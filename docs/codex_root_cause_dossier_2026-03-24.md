# PRIMER Root Cause Dossier

Date: 2026-03-24  
Author: Codex  
Scope: Technical root-cause analysis from multi-batch bug hunting across gameplay, MAIA, encounter flow, inventory, procurement, archive, and dashboards.

## 1. What "Runtime Model" Means

`Runtime model` adalah bentuk data yang benar-benar hidup saat game berjalan.

Ini berbeda dari:
- desain konseptual
- schema yang "dimaksud"
- isi case file static
- komentar atau asumsi UI

Contoh:
- Jika generator pasien menulis `patient.medicalData.trueDiagnosisCode`, maka itu adalah runtime model.
- Jika viewer lain masih membaca `patient.medicalData.diagnosisCode`, maka viewer itu memakai model lama dan akan drift dari runtime.

Masalah utama PRIMER saat ini bukan sekadar banyak bug terpisah, tetapi karena runtime model belum tunggal dan belum dipaksa konsisten lintas producer dan consumer.

## 2. Executive Summary

Bug PRIMER terasa "tidak selesai-selesai" karena sebagian besar bug adalah gejala dari beberapa klaster akar masalah yang sama:

1. Fragmentasi kontrak data lintas fitur
2. Migrasi parsial dari model lama ke model baru
3. Tidak adanya canonical adapter/normalizer antar-domain
4. Fitur selesai secara lokal, tetapi tidak selesai end-to-end
5. Viewer/reporting tertinggal dari runtime aktual
6. Inventory dan emergency item model belum punya batas domain yang rapi

Akibatnya, satu mismatch kecil bisa memecah banyak layar sekaligus:
- gameplay benar, archive salah
- archive benar, dashboard salah
- MAIA benar, overlay salah
- inventory terpotong, procurement tidak melihatnya

## 3. Primary Root Causes

### Root Cause A — Patient / Case Schema Fragmentation

Entity `patient` tidak punya satu shape tunggal yang dipatuhi semua jalur.

Representative symptoms:
- `medicalData` vs `medical`
- `trueDiagnosisCode` vs `diagnosisCode`
- `physicalExamFindings` vs `physicalExam`
- `differentialDiagnosis` vs `differentials`
- `social.hasBPJS` vs `isBPJS` / `medicalData.hasBPJS`

Representative files:
- [PatientGenerator.js](/D:/Dev/PRIMER/src/game/PatientGenerator.js)
- [usePatientEMR.js](/D:/Dev/PRIMER/src/hooks/usePatientEMR.js)
- [ReasoningDashboard.jsx](/D:/Dev/PRIMER/src/components/emr/ReasoningDashboard.jsx)
- [MAIAValidationOverlay.jsx](/D:/Dev/PRIMER/src/components/emr/sidebar/MAIAValidationOverlay.jsx)

Impact:
- MAIA, EMR, debrief, outbreak, dashboard, dan history bisa membaca "pasien" yang berbeda walau secara bisnis itu entitas yang sama.

### Root Cause B — Encounter / Decision / History Schema Fragmentation

Encounter yang sudah selesai tidak punya satu bentuk final yang konsisten.

Representative symptoms:
- `decision.actions` vs `decision.actionsPerformed`
- `decision.diagnosis` vs `decision.diagnoses`
- `outcome` vs `outcomeStatus`
- `completed/referred/revenue` kadang ada, kadang tidak
- viewer history/archive collapse banyak action modern jadi label default

Representative files:
- [usePatientEMR.js](/D:/Dev/PRIMER/src/hooks/usePatientEMR.js)
- [useGameStore.js](/D:/Dev/PRIMER/src/store/useGameStore.js)
- [PatientHistoryModal.jsx](/D:/Dev/PRIMER/src/components/PatientHistoryModal.jsx)
- [ArsipPage.jsx](/D:/Dev/PRIMER/src/components/ArsipPage.jsx)
- [DebriefEngine.js](/D:/Dev/PRIMER/src/game/DebriefEngine.js)

Impact:
- gameplay utama bisa terlihat benar, tetapi history, archive, KPI, dan debrief membaca encounter yang salah.

### Root Cause C — Partial Migration Without a Canonical Adapter Layer

Banyak patch memperbaiki satu consumer, tetapi tidak ada satu normalizer yang mengubah data lama dan baru ke format tunggal sebelum dipakai seluruh app.

Representative symptoms:
- fix di satu panel tidak otomatis menutup bug di panel lain
- bug yang sama muncul ulang dengan nama field berbeda
- dashboard lama dan panel baru hidup berdampingan

Representative files:
- [GameContext.jsx](/D:/Dev/PRIMER/src/context/GameContext.jsx)
- [selectors.js](/D:/Dev/PRIMER/src/store/selectors.js)
- berbagai viewer di `src/components/`

Impact:
- patching jadi reaktif dan lokal
- biaya maintenance naik
- regression mudah muncul setelah feature baru masuk

### Root Cause D — Feature Completion Is Local, Not End-to-End

Banyak subsystem selesai di satu layer, tapi tidak benar-benar ditutup sampai persistence, audit trail, archive, metrics, dan UI secondary consumer juga ikut selesai.

Representative examples:
- farmasi: verify/dispense ada, tetapi parity dengan finance/inventory/history sempat drift
- procurement: order placement ada, tetapi audit visibility dan supplier semantics masih drift
- MAIA: scoring engine ada, tetapi label/display/contract consumer sempat pecah
- consequence/debrief: engine ada, tapi producer payload dan viewer belum sepenuhnya sinkron

Representative files:
- [FarmasiPanel.jsx](/D:/Dev/PRIMER/src/components/FarmasiPanel.jsx)
- [OrderModal.jsx](/D:/Dev/PRIMER/src/components/OrderModal.jsx)
- [DispensingEngine.js](/D:/Dev/PRIMER/src/game/DispensingEngine.js)
- [ConsequenceEngine.js](/D:/Dev/PRIMER/src/game/ConsequenceEngine.js)
- [MorningBriefing.js](/D:/Dev/PRIMER/src/game/MorningBriefing.js)

Impact:
- fitur terasa "ada", tapi state, archive, atau downstream consumer tidak ikut valid.

### Root Cause E — Inventory Domain Boundary Is Unclear

Saat ini inventory masih mencampur beberapa kelas item yang seharusnya diperlakukan berbeda:
- obat habis pakai
- alkes habis pakai
- equipment/durable tools
- pseudo-action / care instruction
- item emergency authored di registry tetapi tidak selalu punya SKU katalog

Representative symptoms:
- bootstrap inventory memasukkan equipment
- procurement UI menyembunyikan equipment
- prosedur tetap mengurangi equipment di backend
- forecast stok tidak menghitung semua item yang benar-benar dipakai
- emergency actions punya banyak `requiredItems` tanpa SKU katalog

Representative files:
- [useGameStore.js](/D:/Dev/PRIMER/src/store/useGameStore.js)
- [InventoryPage.jsx](/D:/Dev/PRIMER/src/components/InventoryPage.jsx)
- [OrderModal.jsx](/D:/Dev/PRIMER/src/components/OrderModal.jsx)
- [LogisticsView.jsx](/D:/Dev/PRIMER/src/components/dashboard/LogisticsView.jsx)
- [EmergencyRegistry.js](/D:/Dev/PRIMER/src/game/emergency/EmergencyRegistry.js)
- [ProceduresDB.js](/D:/Dev/PRIMER/src/data/ProceduresDB.js)

Impact:
- stok backend, procurement, logistics, dan emergency usage tidak pernah benar-benar bicara model yang sama.

### Root Cause F — Runtime Consumers Lag Behind Producers

Producer modern sering sudah benar, tetapi consumer lama masih membaca field warisan.

Representative symptoms:
- KPI dashboard menampilkan diagnosis sebenarnya, bukan diagnosis pilihan user
- history/archive memakai fallback default untuk status modern
- RRNS/referral metrics salah label
- debrief membaca payload lama

Representative files:
- [KPIDashboard.jsx](/D:/Dev/PRIMER/src/components/KPIDashboard.jsx)
- [PerformanceView.jsx](/D:/Dev/PRIMER/src/components/dashboard/PerformanceView.jsx)
- [PatientHistoryModal.jsx](/D:/Dev/PRIMER/src/components/PatientHistoryModal.jsx)
- [EndOfDayModal.jsx](/D:/Dev/PRIMER/src/components/EndOfDayModal.jsx)

Impact:
- game state bisa benar, tetapi observability-nya salah. Ini berbahaya karena bug tersembunyi di reporting.

## 4. Why The Bug Count Feels Explosive

Jumlah bug terlihat sangat besar karena sebagian besar adalah `fan-out bugs`.

Satu mismatch seperti:
- `trueDiagnosisCode` vs `diagnosisCode`

bisa memecah:
- MAIA
- outbreak
- reasoning dashboard
- debrief
- KPI forensic
- history/archive

Jadi angka temuan tinggi tidak selalu berarti ada ratusan penyebab independen. Banyak di antaranya adalah manifestasi dari akar masalah yang sama.

## 5. Current Architectural Risk Ranking

### Highest Risk

1. Patient/case schema fragmentation
2. Encounter/history schema fragmentation
3. Inventory/emergency item model inconsistency

### Medium Risk

4. Viewer/reporting drift
5. Partial feature completion

### Lower Risk but Expensive if Left Untouched

6. Legacy paths and dead-but-still-live compatibility branches

## 6. Recommended Remediation Order

### Phase 1 — Define Canonical Runtime Contracts

Create and document one canonical shape each for:
- `PatientRuntime`
- `EncounterRuntime`
- `InventoryItemRuntime`
- `EmergencyActionRuntime`

Minimum requirement:
- explicit required fields
- no aliases inside the canonical form
- comments are not enough; the app needs executable normalization

### Phase 2 — Add Adapter / Normalizer Boundaries

Before data enters broad app usage:
- generator output → normalize
- saved history → normalize
- archive input → normalize
- MAIA input → normalize
- dashboard input → normalize

Goal:
- producer lama dan baru tetap bisa hidup sementara
- consumer hanya membaca satu shape

### Phase 3 — Split Inventory Into Real Subdomains

At minimum:
- consumable stock
- durable equipment
- pseudo-actions / non-stock instructions

Emergency and procedure registries should point only to valid SKU/domain references.

### Phase 4 — Unify Encounter Finalization

Semua jalur selesai encounter harus menghasilkan satu payload final yang sama:
- diagnosis chosen
- action taken
- medications/procedures/labs
- billing
- outcome
- outcomeStatus
- referral/delegation metadata
- archive/debrief-safe fields

### Phase 5 — Retrofit Reporting to Canonical Data Only

Dashboard, archive, debrief, KPI, history, and modal viewers should stop reading raw mixed runtime objects directly.

They should consume:
- normalized selectors
- normalized archive records
- normalized encounter summaries

## 7. Tactical Rules To Reduce New Bug Creation

1. No new feature should read raw patient objects directly in more than one place.
2. New UI consumers should read selectors/adapters, not raw store slices.
3. Any new field rename must ship with:
   - adapter
   - regression test
   - grep sweep of consumer references
4. Engine and UI names must not diverge for inventory-backed items.
5. Dashboard/reporting should never invent fallback semantics for business-critical fields.

## 8. Practical Interpretation

PRIMER tidak terlihat hancur di level "core loop tidak jalan".  
Yang terjadi adalah arsitektur data belum terkonsolidasi.

Selama model runtime belum tunggal:
- bug akan terus muncul batch demi batch
- tiap fix lokal akan terasa seperti "masih bocor"
- QA akan terus menemukan drift antar-panel

Jadi strategi terbaik bukan firefighting per gejala, tetapi menutup beberapa klaster akar:
- patient runtime contract
- encounter finalization contract
- inventory domain contract
- reporting selector contract

## 9. Bottom Line

Root cause terbesar PRIMER adalah:

`the app does not yet enforce one canonical runtime data model across gameplay, storage, engines, and viewers.`

Selama itu belum dibereskan, bug akan terus terlihat "banyak sekali" walau developer sudah memperbaiki banyak hal dengan benar.
