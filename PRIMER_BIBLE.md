# 📖 PRIMER Architecture Bible
> **Version**: 1.0 — 2026-03-27
> **Purpose**: Persistent context for any AI agent (AG/Codex/DT) working on PRIMER. Read this FIRST before making changes.

---

## 1. What Is PRIMER?

A **primary care simulator game** (Sims-style) where the player runs a Puskesmas (Indonesian community health center). The player manages clinical encounters, public health programs (Prolanis, Posyandu), village health mapping, staff, and finances across a simulated rural village.

**Tech**: Vite + React + Zustand + Three.js (diorama). No backend — all state in localStorage.

---

## 2. Store Architecture

### The God Object Problem (Why We Slice)
`useGameStore.js` was **3749 lines** — state, helpers, actions, persistence, middleware ALL in one file. Any edit risked regressions everywhere. Store slicing decomposes it:

| Phase | Status | Result |
|-------|--------|--------|
| **CP1**: Extract helpers → `store/helpers/` (7 files) | ✅ Done | 3749 → 2788 lines |
| **CP2**: Extract actions → `store/slices/` (9 files) | 🔜 Next | Target ~800 lines |

### Store State Shape (Canonical Slices)

```
state = {
  world:        { day, time, speed, ... }
  player:       { profile: { name, xp, level, energy, skills, ... } }
  clinical:     { queue, activePatientId, history, prbQueue, ... }  ← CANONICAL for PRB
  finance:      { stats, pharmacyInventory, kpi, ... }
  publicHealth: { prolanisRoster, prolanisState, activeOutbreaks, ... }
  staff:        { roster, morale, ... }
  meta:         { activeQuests, achievements, ... }
  nav:          { currentPage, ... }
  facilities:   { poli_umum, igd, poli_gigi, poli_kia_kb, ... }
}
```

> [!CAUTION]
> **PRB queue canonical location = `clinical.prbQueue`**, NOT `publicHealth.prbQueue`. This was a split-brain bug fixed in commit `71c1db1`.

### Middleware Stack
```
persist → guardActionGroup → immer (produce)
```

> [!WARNING]
> **NEVER call `get().someAction()` inside a `withTransaction` callback.** The nested `set()` gets overwritten by the outer transaction's commit. Always mutate the draft state directly.

### Helper Files (`store/helpers/`)

| File | Contains |
|------|----------|
| `storeUtils.js` | `isPlainObject`, `clampInteger`, `toAbsoluteWorldMinutes` |
| `playerHelpers.js` | `applyXpGainToProfile`, `normalizeSkillList`, `sanitizePlayerProfile` |
| `ambulanceHelpers.js` | `createBusyAmbulanceEntry`, `isAmbulanceStillBusy` |
| `clinicalHelpers.js` | `isAntibioticMed`, `calculateEncounterRevenue`, `capClinicalHistory` |
| `archiveHelpers.js` | `buildDailyArchiveEntry`, `buildMonthlyArchiveEntry` |
| `persistenceHelpers.js` | `mergePersistedMeta`, `syncQuestRoster`, `createInitial*State` |
| `publicHealthHelpers.js` | `buildProlanisBpjsNumber`, `applyFamilyIndicatorDrift` |

---

## 3. Patient Generation Pipeline — Single Canonical Generator

> [!IMPORTANT]
> **ALL patients come from ONE file: `game/PatientGenerator.js`.** This was a hard-won decision after debugging dozens of times where multiple engines independently produced patients, causing queue confusion and duplicate IDs.

### The 4 Generator Functions

| Function | Source | Queue |
|----------|--------|-------|
| `generatePatient()` | 70% warga inti, 30% outsiders | `clinical.queue` |
| `generateEmergencyPatient()` | 50% warga, 50% outsiders | IGD queue |
| `generateProlanisVisitPatient()` | Always from `prolanisRoster` | `clinical.queue` (via `callProlanisPatient`) |
| `generateFollowupPatient()` | From ConsequenceEngine entries | `clinical.queue` |

### Patient Type Flow
```
VillageRegistry (200 KK) ──→ PatientGenerator ──→ clinical.queue
                                ↑ 30% outsiders (procedural, garbage-collected after discharge)
ProlanisRoster ──→ callProlanisPatient() ──→ clinical.queue (id: "{rosterId}_visit_{day}")
ConsequenceEngine ──→ generateFollowupPatient() ──→ clinical.queue
EmergencyCases ──→ generateEmergencyPatient() ──→ IGD queue
```

### Key Invariants
1. **Outsiders are NOT persisted** — no entry in VillageRegistry, no villageLedger record
2. **Prolanis visit IDs have `_visit_` infix** — used by discharge intercept to route correctly
3. **Patient generation is deterministic** — seeded RNG ensures reproducible queues for testing
4. **No engine may independently produce patients** — all paths go through PatientGenerator

---

## 4. ACL — Anti-Corruption Layer (Runtime Guards)

> [!IMPORTANT]
> **ACL = Anti-Corruption Layer.** Three `*Runtime.js` files in `models/` that normalize data shapes at the boundary between engines and store. This was built after weeks of debugging recurring "fan-out bugs" where the same data existed in multiple incompatible shapes across different consumers.

### The 3 ACL Files

| File | Purpose | Key Function |
|------|---------|--------------|
| `models/PatientRuntime.js` | Normalizes patient shapes from any source (generator, save, history) into ONE canonical shape | `normalizePatient()` |
| `models/EncounterRuntime.js` | Normalizes encounter/visit data | Encounter validation |
| `models/InventoryRuntime.js` | Normalizes pharmacy/inventory data | Inventory validation |

### PatientRuntime — The Core ACL

```
Raw Patient (any source) → normalizePatient() → CanonicalPatient
                                ↑ IDEMPOTENT: normalizePatient(normalizePatient(x)) === normalizePatient(x)
                                ↑ Absorbs 4+ aliases for BPJS, ICD-10, differentials, PE findings
                                ↑ _isCanonical + _aclVersion = O(1) skip on re-normalize
```

**Problem it solved**: The same patient data had different field names depending on source:
- `isBPJS` vs `social.hasBPJS` vs `medicalData.hasBPJS` vs `hidden.bpjs`
- `diagnosisCode` vs `trueDiagnosisCode` vs `icd10` vs `hidden.icd10`
- `differentials` vs `differentialDiagnosis` vs `hidden.differentialDiagnosis`

**Without ACL**: Every UI component and engine had to check ALL aliases → missed one = bug.
**With ACL**: `normalizePatient()` at the boundary → every consumer reads ONE shape.

### Key Commits
- `13426b0` — V8 ACL PatientRuntime + BishiBashi + V7 DebriefEngine
- `0ee0e92` — ACL hard boundary + consumer migration
- `44eb726` — EncounterRuntime + InventoryRuntime ACL

---

## 5. Village Population Scaling

### Current vs Target

| Parameter | Current | Target | Rationale |
|-----------|---------|--------|-----------|
| **Total KK** | 30 | **200** | 1-month patient cycle |
| **Total Jiwa** | ~115 | **~800** | Prolanis pool ~100, Posyandu pool ~80 |
| **KK per RW** | N/A | **40-50** | Cognitive limit + rendering budget |
| **RW count** | 1 | **4-5** | Themed zoning (Pusat, Bantaran, Pelosok) |
| **Outsiders** | ~30% | **20-30%** | Garbage collected after discharge |
| **Kapitasi Header** | N/A | **"34.520 jiwa"** | Illusion of scale (Frostpunk trick) |

### Pocket Dioramas Architecture
- **DO NOT** render 200 houses in one scene (WebGL death)
- Each RW = **1 pocket diorama** with 40-50 houses (same as current ~40 building count)
- WilayahPage: Macro 2D overview → click RW → enter 3D diorama
- RW unlock = campaign progression

### Dependency Chain
```
Store Slicing CP1 ✅
  → Store Slicing CP2 (action slices)
    → Patient Factory (consolidate all gen paths)
      → Village Expansion (30 → 200 KK + Pocket Dioramas)
        → Living Village (villageLedger feedback loop)
```

---

## 6. Prolanis Flow (Critical Path)

```
enrollProlanis(patient) → prolanisRoster += member
callProlanisPatient(id) → generate visit patient → clinical.queue
dischargePatient(patient) → intercept if _visit_ → inline roster update
                         → check PRB eligibility → clinical.prbQueue
completeProlanisVisit(visitData) → direct call (for non-discharge path)
triggerSenamProlanis() → monthly exercise event
```

> [!CAUTION]
> The discharge intercept MUST inline the Prolanis logic into the `withTransaction` draft. Do NOT delegate to `completeProlanisVisit` via `get()`.

---

## 7. Key Lessons Learned

| Lesson | Context |
|--------|---------|
| **PowerShell `Set-Content` corrupts UTF-8** | Use Node.js `fs.readFileSync/writeFileSync` for line surgery |
| **`git show` piped through PowerShell → UTF-16 + NUL bytes** | Use `git checkout TAG -- path` instead |
| **Nested `set()` inside `withTransaction` = silent data loss** | Always mutate draft directly |
| **ESLint `no-undef` catches real runtime bugs** | `normalizeSkillList` and `syncQuestRoster` were both caught this way |
| **AST audit can't follow cross-file imports** | `engine_store_audit.test.mjs` needs update for sliced architecture |

---

## 8. File Map (Key Files)

| Area | File | Purpose |
|------|------|---------|
| Store | `store/useGameStore.js` | Zustand store (compose + middleware) |
| Store | `store/helpers/*.js` | Extracted pure helper functions |
| Patient | `game/PatientGenerator.js` | **THE** canonical patient generator |
| ACL | `models/PatientRuntime.js` | Anti-Corruption Layer — normalizes patient shapes |
| ACL | `models/EncounterRuntime.js` | Anti-Corruption Layer — encounter validation |
| ACL | `models/InventoryRuntime.js` | Anti-Corruption Layer — inventory validation |
| Village | `domains/village/village_families.js` | 30 KK hardcoded (expand to 200) |
| Village | `domains/village/VillageRegistry.js` | Population registry + risk profiles |
| Prolanis | `game/ProlanisEngine.js` | Monthly outcome simulation |
| Clinical | `components/ClinicalPage.jsx` | Main clinical UI |
| Map | `components/wilayah/WilayahDiorama.jsx` | 3D voxel diorama |

---

*Last updated by AG — 2026-03-27. Update this file when making architectural changes.*
