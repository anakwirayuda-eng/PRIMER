# 📂 DOSSIER: PRIMER Post-CP2 Pipeline
> **Tujuan**: Briefing lengkap untuk AG workflow / DeepThink / Codex tentang tugas-tugas setelah CP2 Store Slicing selesai.
> **Date**: 2026-03-27
> **Author**: AG (Commander)

---

## 1. Status Saat Ini (Snapshot)

### CP2 Store Slicing — ✅ COMPLETE

| Metric | Before | After | Delta |
|---|---|---|---|
| `useGameStore.js` | 2,762 lines (141 KB) | 267 lines (13.8 KB) | **-90.3%** |
| Slice files | 0 | 9 files in `src/store/slices/` | +9 |
| Helper files | 7 in `src/store/helpers/` | 7 (unchanged) | — |
| Build time | ~30s | ~22s | **-27%** |
| Test suite | 41/41 pass | 41/41 pass | **100% green** |

### 9 Extracted Slices

| # | Slice | Actions | Lines | Risk Level |
|---|---|---|---|---|
| 1 | `createNavSlice.js` | ~8 | ~80 | 🟢 Low |
| 2 | `createWorldSlice.js` | ~6 | ~60 | 🟢 Low |
| 3 | `createPlayerSlice.js` | ~12 | ~150 | 🟡 Medium |
| 4 | `createStaffSlice.js` | ~10 | ~120 | 🟡 Medium |
| 5 | `createFinanceSlice.js` | ~15 | ~200 | 🟡 Medium |
| 6 | `createMetaSlice.js` | ~12 | ~160 | 🟡 Medium |
| 7 | `createPublicHealthSlice.js` | ~20 | ~630 | 🔴 High |
| 8 | **`createClinicalSlice.js`** | **42** | **~950** | 🔴 **Highest** |
| 9 | `createOrchestratorSlice.js` | 5 | ~380 | 🔴 High |

### File Structure Post-CP2

```
src/store/
├── useGameStore.js           ← 267 lines (shell: imports + slice composition + persist)
├── helpers/                  ← 7 pure-function files (CP1, unchanged)
│   ├── storeUtils.js
│   ├── playerHelpers.js
│   ├── ambulanceHelpers.js
│   ├── clinicalHelpers.js
│   ├── archiveHelpers.js
│   ├── persistenceHelpers.js
│   └── publicHealthHelpers.js
├── slices/                   ← 9 action-slice files (CP2, NEW)
│   ├── createNavSlice.js
│   ├── createWorldSlice.js
│   ├── createPlayerSlice.js
│   ├── createStaffSlice.js
│   ├── createFinanceSlice.js
│   ├── createMetaSlice.js
│   ├── createPublicHealthSlice.js
│   ├── createClinicalSlice.js
│   └── createOrchestratorSlice.js
└── selectors/                ← (existing, unchanged)
```

### Cross-Slice Dependency Map

```
orchestrator ──writes──▶ ALL slices (nextDay, resetGame, loadGame)
clinical ──writes──▶ finance (stats, kpi, pharmacyInventory)
clinical ──writes──▶ player (profile: xp, rep, energy)
clinical ──writes──▶ publicHealth (villageData.families, prolanisRoster)
clinical ──calls──▶ meta (metaActions.updateProgress)
publicHealth ──writes──▶ player (profile: xp, reputation)
publicHealth ──writes──▶ finance (stats)
finance ──writes──▶ clinical (morningAlerts)
meta ──writes──▶ player (profile: xp via gainXp)
staff ──writes──▶ player (profile: energy via coachStaff)
```

---

## 2. Pipeline Berikutnya (Roadmap)

Sumber: `docs/GAME_DESIGN_LOG.md`

```
CP2 Store Slicing  ✅ DONE
     ↓
Patient Factory    ← NEXT (konsolidasi generator)
     ↓
Village Expansion  ← 30 KK → 200 KK (~800 jiwa), 4-5 RW
     ↓
Living Village     ← villageLedger feedback loop
     ↓
EMR Dashboard      ← Mobile responsiveness + UX intuitif
```

---

## 3. Tugas 1: Patient Factory

### Problem Statement
Patient generator saat ini tersebar di beberapa file dan memiliki banyak generator functions:
- `generatePatient()` — poli umum
- `generateEmergencyPatient()` — IGD
- `generateFollowupPatient()` — follow-up kunjungan
- `generateGenericPatients()` — batch spawn
- `generateProlanisVisitPatient()` — Prolanis monthly

Semua di `src/game/PatientGenerator.js`. Masalah: kasus cepat repetitif (pool 30 KK habis dalam 4 hari), tidak ada trait persistence, dan demographic logic sangat basic.

### What Needs to Happen
1. **Unified Factory**: Single entry point `createPatient(context)` yang routes ke generator yang tepat
2. **Demographic Enrichment**: Gunakan village family data untuk generate pasien realistis
3. **Trait Persistence**: Pasien yang pernah datang harus punya riwayat (alergi, penyakit kronis)
4. **Disease Pool Expansion**: Lebih banyak variasi penyakit sesuai epidemiologi Indonesia
5. **Outsider System**: 20-30% pasien dari luar desa (garbage-collected, tidak masuk sensus)

### Key Files
- `src/game/PatientGenerator.js` — main generator
- `src/game/DiseasePool.js` atau `src/data/DiseaseDatabase.js` — pool penyakit
- `src/domains/village/VillageRegistry.js` — 30 KK saat ini
- `src/models/PatientRuntime.js` — patient normalization

### Constraints
- Save compatibility harus tetap terjaga
- Test suite 41/41 harus tetap green
- Patient shape harus compatible dengan existing EMR components

### DeepThink Reference
`deepthink_v10_triage.md` — "5 Pillars of Immortality" sudah dibahas:
1. Identity Engine (name + demographic)
2. Clinical Profile (disease assignment)
3. Social Determinant (SDoH layer)
4. Visit Context (time, queue position)
5. Narrative Fabric (medical history)

---

## 4. Tugas 2: Village Expansion (200 KK)

### Problem Statement
Saat ini hanya 30 KK (~115 warga) di `VillageRegistry.js`. Pool habis dalam 4 hari game. Target: **200 KK (~800 jiwa)**, 4-5 RW.

### What Needs to Happen
1. **Scale Registry**: 30 → 200 KK dengan data demografis realistis
2. **RW System**: Bagi 200 KK ke 4-5 RW, unlock progresif seiring level naik
3. **Kapitasi Scaling**: Header tampilkan "34.520 jiwa" sebagai ilusi skala (Frostpunk trick)
4. **IKS Calculation**: Maintain per-family IKS scoring
5. **Performance**: Ensure 200 KK tidak memperlambat state updates

### Key Files
- `src/domains/village/VillageRegistry.js` — family definitions
- `src/domains/village/NPCReadiness.js` — readiness decay
- `src/data/FamilyIndicators.js` (atau inline) — PHBS indicators per family
- `src/store/slices/createPublicHealthSlice.js` — village data state

### Constraints
- **Privacy**: Data keluarga/warga = SDoH sensitive → jika perlu LLM assist, gunakan **Ollama lokal** (sesuai GUARDRAILS.md)
- Nama-nama harus realistis Indonesia (Jawa, Sunda, Madura, dll)
- Data demografi harus sesuai profil desa Indonesia nyata

### DeepThink Reference
`deepthink_village_triage.md` — scaling strategy sudah dibahas

---

## 5. Tugas 3: Living Village (villageLedger)

### Problem Statement
Saat ini discharge pasien → selesai. Tidak ada feedback loop ke village. Goal: setiap aksi klinis berdampak ke village health indicators.

### What Needs to Happen
1. **villageLedger**: Ledger yang catat setiap interaksi clinical → village impact
2. **Feedback Loop**: Discharge → update family indicators → IKS recalculation
3. **Consequence Chain**: Poor treatment → family health decline → more patients
4. **Visual Feedback**: Map/dashboard menunjukkan village health trend

### Key Files
- `src/store/slices/createClinicalSlice.js` — discharge actions
- `src/store/slices/createPublicHealthSlice.js` — village data
- `src/utils/ikmImpact.js` — existing impact system

---

## 6. Tugas 4: EMR Dashboard Mobile + UX

### Problem Statement
Dashboard poliklinik saat ini **tidak mobile-friendly** sama sekali. Harus representatif sebagai simulasi EMR untuk mahasiswa FK.

### What Needs to Happen
1. **Responsive Layout**: Semua EMR panels harus usable di mobile
2. **Touch-Friendly**: Buttons, tabs, inputs harus cukup besar
3. **UX Intuitif**: Flow yang natural: Antrean → Anamnesis → Pemeriksaan → Diagnosis → Terapi → Discharge
4. **Exhibition Ready**: Harus layak pamer di kegiatan akademik FKK ITS

### Key Components
- `src/components/DailyReportModal.jsx`
- `src/components/PoliklinikDashboard.jsx` (atau equivalent)
- Semua tab EMR (Anamnesis, Riwayat, Diagnosa, Medikamentosa, Edukasi)

---

## 7. Lint Cleanup (Debt)

### Current State
Masih ada `no-unused-vars` warnings di `useGameStore.js` — sisa dari refactor CP2. Import yang dulunya dipakai inline sekarang sudah pindah ke slice files tapi import-nya belum dihapus dari main file.

### Effort
~30 menit — hapus unused imports, verify build tetap green.

---

## 8. Recommended Workflow per Task

Berdasarkan `D:\Dev\Workflow\ai_workflow_strategy.md` dan `CONCLUSION.md`:

| Task | AG | Codex | DeepThink | Ollama |
|---|---|---|---|---|
| **Patient Factory** | ✅ Implement | ✅ Parallel test writing | ✅ Architecture (sudah v10) | — |
| **Village 200 KK** | ✅ Implement | ✅ Validate family data | — | ✅ **SDoH data generation** (privacy) |
| **Living Village** | ✅ Implement | ✅ Edge case review | ⚠️ Design feedback loop | — |
| **EMR Mobile** | ✅ CSS + Layout | ✅ Audit accessibility | — | — |
| **Lint Cleanup** | ✅ Quick fix | — | — | — |

### Archetype yang Paling Relevan
- **Archetype 2 (Synchronous Sprint)**: AG coding + Codex test writing paralel → untuk Patient Factory & Village
- **Archetype 3 (Privacy Pre-Filter)**: Ollama lokal untuk generate data demografi 200 KK → sebelum AG implementasi
- **Archetype 5 (AI-Arbitration)**: AG design Living Village → Codex review → DeepThink arbitrasi

---

## 9. Test Suite Reference

```bash
# Full regression (harus 41/41 green setelah setiap perubahan)
npx vitest run src/tests/storeProphylaxis.test.js src/tests/referralLifecycle.test.js src/tests/rumahDinasSleep.test.js

# Build verification
npx vite build
```

---

## 10. NO-FLY Zones (dari GUARDRAILS.md)

- ❌ **Jangan ubah** `useGameStore.js` persist/merge/partialize logic kecuali benar-benar perlu
- ❌ **Jangan ubah** save payload format (backward compat wajib)
- ❌ **Data SDoH/pasien** tidak boleh ke cloud API — gunakan Ollama lokal
- ❌ **Jangan hapus** file `.md` yang sudah ada di `docs/`
- ✅ **Selalu jalankan** test suite setelah setiap perubahan signifikan
