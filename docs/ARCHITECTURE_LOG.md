# 📋 PRIMER Architecture Decision Log
> **Purpose**: Running log of architecture decisions. AI agents: read PRIMER_BIBLE.md first (game identity), then this file (technical decisions).
> **Last Updated**: 2026-03-27

---

## Store Architecture

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

> **⚠️ PRB queue canonical location = `clinical.prbQueue`**, NOT `publicHealth.prbQueue`.

> **⚠️ NEVER call `get().someAction()` inside a `withTransaction` callback.** The nested `set()` gets overwritten by the outer transaction's commit. Always mutate the draft state directly.

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

## Patient Generation Pipeline — Single Canonical Generator

> **ALL patients come from ONE file: `game/PatientGenerator.js`.** This was a hard-won decision after debugging dozens of times where multiple engines independently produced patients, causing queue confusion and duplicate IDs.

### The 4 Generator Functions

| Function | Source | Queue |
|----------|--------|-------|
| `generatePatient()` | 70% warga inti, 30% outsiders | `clinical.queue` |
| `generateEmergencyPatient()` | 50% warga, 50% outsiders | IGD queue |
| `generateProlanisVisitPatient()` | Always from `prolanisRoster` | `clinical.queue` (via `callProlanisPatient`) |
| `generateFollowupPatient()` | From ConsequenceEngine entries | `clinical.queue` |

### Key Invariants
1. **Outsiders are NOT persisted** — no entry in VillageRegistry, no villageLedger record
2. **Prolanis visit IDs have `_visit_` infix** — used by discharge intercept to route correctly
3. **Patient generation is deterministic** — seeded RNG ensures reproducible queues
4. **No engine may independently produce patients** — all paths go through PatientGenerator

---

## ACL — Anti-Corruption Layer (Runtime Guards)

> **ACL = Anti-Corruption Layer.** Three `*Runtime.js` files in `models/` that normalize data shapes at the boundary between engines and store. Built after weeks of debugging recurring "fan-out bugs."

| File | Purpose |
|------|---------|
| `models/PatientRuntime.js` | Normalizes patient shapes → ONE canonical shape (`normalizePatient()`) |
| `models/EncounterRuntime.js` | Encounter validation |
| `models/InventoryRuntime.js` | Inventory validation |

**Problem solved**: Same data had different field names:
- `isBPJS` vs `social.hasBPJS` vs `medicalData.hasBPJS` vs `hidden.bpjs`
- `diagnosisCode` vs `trueDiagnosisCode` vs `icd10`

**Without ACL**: Every consumer checked ALL aliases → missed one = bug.
**With ACL**: `normalizePatient()` at boundary → every consumer reads ONE shape.

---

## Village Population Scaling

| Parameter | Current | Target | Rationale |
|-----------|---------|--------|-----------|
| **Total KK** | 30 | **200** | 1-month patient cycle |
| **Total Jiwa** | ~115 | **~800** | Prolanis pool ~100, Posyandu pool ~80 |
| **RW count** | 1 | **4-5** | Themed zoning, pocket dioramas |
| **Outsiders** | ~30% | **20-30%** | Garbage collected after discharge |

### Dependency Chain
```
Store Slicing CP1 ✅ → CP2 → Patient Factory → Village Expansion → Living Village
```

---

## Prolanis Flow

```
enrollProlanis → prolanisRoster
callProlanisPatient → clinical.queue (id: "{rosterId}_visit_{day}")
dischargePatient → intercept _visit_ → inline roster update → clinical.prbQueue
```

> **⚠️ Discharge intercept MUST inline Prolanis logic into `withTransaction` draft. Do NOT delegate via `get()`.**

---

## Lessons Learned

| Lesson | Context |
|--------|---------|
| PowerShell `Set-Content` corrupts UTF-8 | Use Node.js `fs` for file surgery |
| `git show` piped through PowerShell → NUL bytes | Use `git checkout` or Node.js |
| Nested `set()` inside `withTransaction` = silent data loss | Mutate draft directly |
| ESLint `no-undef` catches real bugs | `normalizeSkillList`, `syncQuestRoster` |

---

*Update this file when making architectural decisions.*
