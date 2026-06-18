# PRIMER — UKM Home-Visit Redesign: Build-Spec Produksi

> **Tujuan**: Mengubah loop kunjungan rumah (behavior change) dari "tebak-2-dari-6 + roda poster + checklist" menjadi loop yang MEMAKSA penalaran COM-B/TTM nyata dan terasa seperti game. **Dikunci ke `BehaviorCaseEngine.js` yang sudah ada** — kita tidak menulis engine skor baru, hanya (a) memperbaiki bug, (b) menambah lapisan TTM-gating + UI interaktif, (c) memperbesar library skenario, (d) mengaktifkan persistensi yang plumbing-nya sudah ada.
> **Status**: Spec siap-bangun. Referensi prototipe interaktif: skenario `kk_31` (ayah perokok) & `kk_tb` (Sumarno TB) — dua profil kontras, mekanik sama.
> **Penanda**: [V] diverifikasi di kode · [NEW] tambahan baru · [FIX] perbaikan bug.

---

## 1. RUANG LINGKUP & PRINSIP

- **Kunci**: ruang jawaban kontinu (magnitudo 0–1 per 6 domain), bukan slot biner. Engine sudah menilai *kedekatan magnitudo*, bukan benar/salah biner ([V] `scoreCOMBDiagnosis` bobot 30% magnitude).
- **Memaksa reasoning**: bukti disembunyikan domainnya; pemain menyimpulkan. Jawaban menang **tidak transfer antar-kasus** (lihat §9: rokok ≠ TB; edukasi jebakan di satu, benar di lain).
- **Klinis non-negotiable**: tiap skenario divalidasi dosen sebelum masuk (angka `comBBarriers`, `primaryBarriers`, `bestInterventions`).
- **Anti-grind 2 pekan**: persistensi TTM + seed per-mahasiswa + rotasi skenario per-keluarga (§6–§7).

---

## 2. KONTRAK DATA `DiseaseScenario` (dikunci ke engine)

Engine membaca field berikut dari `getDiseaseScenarioById(scenarioId)` ([V] di `scoreCOMBDiagnosis`/`scoreIntervention`/`resolveOutcome`). **Tiap skenario WAJIB menyediakan:**

```js
{
  id: 'bc_rokok_dalam_rumah',
  tier: 1,                          // [V] dipakai resolveBehaviorCaseScenarioId
  title: 'Asap di Ruang Tengah',
  targetBehavior: 'Ayah merokok di luar rumah, bukan di dekat bayi',
  pisPkIndicatorId: 'rokok',        // [NEW] untuk Rapor & coverage chart

  // --- DINILAI ENGINE (jangan ubah nama) ---
  comBBarriers: { mot_aut:0.85, opp_soc:0.75, cap_psy:0.40, mot_ref:0.35, opp_phy:0.20, cap_phy:0.10 }, // [V]
  primaryBarriers: ['mot_aut','opp_soc'],   // [V] ≥0.5 = poin primer 60%
  bestInterventions: ['environmental_restructuring','modelling','enablement','persuasion'], // [V] scoreIntervention=100
  familyResistance: 24,             // [V] SDOH armor di resolveOutcome (≈pendidikan+ekonomi)
  ukpBridge: { delayDays:{min:5,max:12}, failProbability:0.6, failOutcomes:['ispa_pneumonia_bayi'] }, // [V]

  // --- BUKTI / ANAMNESIS LINGKUNGAN ([FIX]: field hilang di data lama) ---
  clues: [
    { id:'asbak', location:'ruang_tengah', finding:'Asbak penuh di sebelah ayunan bayi',
      comBRevealed:'mot_aut',         // [V] dipakai engine; DISEMBUNYIKAN dari UI saat fase diagnosis
      npcLine:'…',                    // [FIX] dibaca InvestigationPhase tapi TIDAK ADA di data → tambahkan
      defenseThreshold:40 },          // [FIX] idem
    // …7–8 clue, ≥1 red herring (correctDomain dgn magnitudo <0.2)
  ],

  // --- [NEW] LAPISAN TTM-GATING ---
  ttmStage: 'precontemplation',       // precontemplation|contemplation|preparation|action|maintenance
  gatedInterventions: ['coercion','restriction','incentivisation'], // backfire pada tahap ini
  gateReason: 'Tahap pra-kontemplasi: intervensi memaksa memicu Righting Reflex',
}
```

**Catatan integrasi [V]**: id mesin `INTERVENTION_FUNCTIONS` memakai `environmental` & target yang DISEDERHANAKAN (mis. `enablement.targets`, `modelling.targets`). UI memetakan label penuh Michie → id mesin saat submit. Petakan sekali di `src/game/interventionMap.js` [NEW] agar konsisten.

---

## 3. FUNGSI ENGINE — DIPAKAI APA ADANYA + 2 BUG WAJIB FIX

**Dipakai tanpa diubah** [V]:
- `scoreCOMBDiagnosis(caseInstance, playerBarriers)` — 60% primer (≥0.5) + 30% kedekatan magnitudo + 10% bonus no-false-positive − 10%/false-positive (actual<0.2). UI cukup menyuplai `playerBarriers={domain:magnitudo}`.
- `scoreIntervention(caseInstance, interventionId)` — 100 bila ∈ `bestInterventions`, 50 bila target overlap `primaryBarriers`, else 10.
- `resolveOutcome(caseInstance)` — diagMultiplier `max(0.3, diag/100)` (bottleneck), bobot 40/45/15, SDOH armor, tier, `calculateReadinessChange`, `ukpBridge` deterministik saat fail.

**[FIX] P0 — Apathy Penalty mati** (lihat audit): 
1. `BehaviorCaseEngine.js:273` menulis `combDiagnosis` (b kecil) → ganti ke `comBDiagnosis`.
2. `buildBehaviorCaseHistoryEntry` ([V] `behaviorCaseRuntime.js:123`) **tidak menulis `comBDiagnosis` ke entry** → tambahkan `comBDiagnosis: { apathyPenalty, score }` ke objek `behaviorCase` agar `countApathyEvents` (scoringEngine) berfungsi. Tanpa ini, anti-apathy tetap dead code.

---

## 4. REDESIGN INTERAKSI (4 fase + roda 3-mode)

Ganti `BehaviorCasePanel` 4-fase inline. UI baru, engine sama.

| Fase | Interaksi | Output ke engine |
|---|---|---|
| **1 · Baca** | Denah rumah; klik hotspot benda/NPC → kartu bukti meluncur ke rak. NPC = OARS (empati/klarifikasi/konfrontasi). `comBRevealed` DISEMBUNYIKAN. `cluesFound` ↑. | `caseInstance.cluesFound`, `totalClues` |
| **2 · Diagnosis** | **Roda COM-B MODE A**: pilih kartu → klik wedge → seret slider magnitudo (radial). Validasi live "bukti lemah". Satu kartu boleh ke >1 wedge. | `playerBarriers` → `scoreCOMBDiagnosis` |
| **3 · Intervensi** | **Roda MODE B (preskriptif)**: cincin 9 fungsi; hanya yang valid utk domain ber-magnitudo aktif; gate TTM (§5) mengunci fungsi backfire. Budget AP. | `interventionChosen` → `scoreIntervention` |
| **4 · Konsekuensi** | **Roda MODE C (review)**: dua-lapis formulasi pemain vs ground-truth. Tally 3 baris, bottleneck, SDOH, snark, jembatan UKP, delta TTM. | `resolveOutcome` |

**[NEW] Roda interaktif** = pengganti `EliteCOMBWheel` read-only. SVG donut 6 wedge (polarToCartesian sudah ada), wedge = drop-target + gauge magnitudo. **Anamnesis lingkungan**: hotspot rumah = scene `PixelSceneRenderer` yang ISINYA bukti klinis (asbak, jentik, dll) — inilah hook walkable masa depan ("B" hanya bermakna setelah loop ini ada).

---

## 5. [NEW] LAPISAN TTM-GATING (tambahan engine)

Engine sekarang tidak meng-gate intervensi per tahap TTM. Tambahkan tipis:

```js
// src/game/ttmGating.js [NEW]
export function isInterventionGated(scenario, interventionId) {
  return (scenario.gatedInterventions||[]).includes(interventionId);
}
// di submit intervensi: jika gated → interventionScore kontribusi 0 + Trust −30 (BACKFIRE) + flag.
```

Aturan klinis (per literatur MI/TTM):
- **precontemplation**: gate `coercion, restriction, incentivisation` (memaksa → reaktansi). Valid: consciousness-raising (`persuasion` afektif, `modelling`, `environmental_restructuring`, `enablement`).
- **action(relapse)/contemplation**: gate `coercion` (+`restriction` bila stigma). `education`/`training`/`enablement` justru VALID bila barrier `cap_psy` (mis. TB miskonsepsi). **Inilah pembuktian general**: `education` jebakan di rokok, benar di TB.

Trust [NEW] = meter 0–100 (mulai 50), dipakai gate backfire + warna feedback. Tidak menggantikan skor engine — hanya UX + flag backfire.

---

## 6. PERSISTENSI TTM (pakai `NPCReadiness` yang SUDAH ADA)

Plumbing lengkap, tinggal di-surface [V]:
- `readinessState[familyId]` punya `currentStage`, `stageHistory`, `visitCount`, `scenarioHistory` (`behaviorCaseRuntime.js` + `NPCReadiness.js`).
- `recordVisit` + `advanceReadiness(state, familyId, outcomeTier, day)` sudah menggerakkan tahap probabilistik per outcome.
- **[NEW] Surface di UI**: Kartu Keluarga menampilkan tahap TTM + "kunjungan ke-N"; keluarga **mengingat** kunjungan lalu; kunjungan ulang memakai tahap tersimpan (gate berubah seiring kemajuan). Ini mengubah repetisi 200-keluarga menjadi **arc relasi**, bukan grind.
- **Anti-grind 2 pekan**: (a) seed per-mahasiswa (varian desa beda → tak bisa contek jawaban); (b) keluarga yang sudah `maintenance` tidak memunculkan kasus baru; (c) `activeScenarioId` per-keluarga (§7) → hanya sebagian rumah berkasus, dan ditandai di peta (triase).

---

## 7. [FIX] PERBESAR LIBRARY & PERBAIKI PEMILIHAN SKENARIO

Masalah [V]: `resolveBehaviorCaseScenarioId` (`behaviorCaseRuntime.js:77`) memetakan keluarga ke `tierOneScenarios[(charSum+day) % N]` → **200 keluarga = N skenario tier-1** (sekarang ~7 → terasa identik).

Fix:
1. **Library 20–30 skenario** (§8) lintas indikator PIS-PK × tahap TTM × profil barrier.
2. Pemilihan **per-keluarga berbasis demografi + tahap tersimpan** (bukan modulo hari): keluarga dengan balita → kasus ASI/imunisasi; ada perokok → rokok; demografi cocok via `getApplicableIndicators` (sudah ada di `pisPkIndicators.js`).
3. **Variasi tahap**: keluarga yang sama bisa naik skenario lanjutan saat TTM maju (precontemplation→contemplation memakai dialog & gate berbeda).

---

## 8. LIBRARY 20–30 SKENARIO (matriks cakupan)

Sasaran: tiap indikator PIS-PK ≥1 skenario, tersebar di ≥3 tahap TTM, ≥4 profil barrier-primer berbeda. Contoh matriks (judul · indikator · tahap · primer):

| # | Judul | Indikator | Tahap TTM | Barrier primer |
|---|---|---|---|---|
| 1 | Asap di Ruang Tengah | rokok | precontemplation | mot_aut + opp_soc |
| 2 | Obat yang Dihentikan | tb | action(relapse) | cap_psy + opp_soc |
| 3 | ASI vs Susu Formula | asi | contemplation | opp_soc + mot_ref |
| 4 | Posyandu yang Dilewati | balita | precontemplation | mot_aut + opp_phy |
| 5 | Imunisasi Ditunda | imunisasi | contemplation | cap_psy(hoax) + opp_soc |
| 6 | Tensi Tak Terkontrol | hipertensi | action(relapse) | cap_psy + mot_aut |
| 7 | Jamban yang Tertunda | jamban | preparation | opp_phy + mot_ref |
| 8 | Air dari Sungai | air | precontemplation | cap_psy + opp_phy |
| 9 | Jentik di Bak Mandi | jentik | maintenance(lapse) | mot_aut + opp_soc |
| 10 | KB yang Ditolak | kb | contemplation | opp_soc(agama) + mot_ref |
| 11 | ODGJ yang Dipasung | jiwa | precontemplation | cap_psy + opp_soc(stigma) |
| 12 | Persalinan ke Dukun | persalinan | preparation | opp_soc + mot_ref |
| 13 | JKN yang Tak Diurus | jkn | contemplation | cap_psy + opp_phy |
| … | (24 total: tambah varian tahap/profil tiap indikator) | | | |

Tiap entri = objek §2 lengkap, **divalidasi dosen**. Golden-test: minimal kasus #1 & #2 (di bawah) jadi regression test mekanik.

---

## 9. DUA SKENARIO REFERENSI (golden test — membuktikan general)

**#1 Rokok (kk_31, Sukirman)** — precontemplation · primer `mot_aut 0.85 + opp_soc 0.75` · best=`environmental_restructuring/modelling/enablement/persuasion` · **`education` = JEBAKAN** (ayah sudah tahu rokok buruk; ceramah → reaktansi). Red herring: `opp_phy` "rumah sempit".

**#2 TB (Sumarno)** — action(relapse) · primer `cap_psy 0.85 + opp_soc 0.60` · best=`education/enablement/environmental_restructuring/modelling` · **`education` = BENAR** (miskonsepsi "sehat = boleh stop" → koreksi pengetahuan mengubah perilaku). Red herring: `mot_aut` "malas/lupa" (menggoda → coercion) + batuk anak (menggoda fokus UKP, bukan barrier perilaku). Jembatan UKP: skrining kontak + TPT Ningsih; gagal → MDR-TB + penularan serumah.

> **Bukti general**: paket menang #1 (`env_restructuring+modelling`) KALAH di #2; `education` membalik dari jebakan→benar. Pemain tak bisa menghafal satu jawaban — harus menalar bukti→domain→magnitudo→fungsi-valid→tahap-TTM tiap kasus. (Keduanya sudah ada prototipe interaktif.)

---

## 10. KILL LIST + ACCEPTANCE

**Bunuh (legacy)** [V]: `CommunityDiagnosisPanel` 5W1H dropdown (engine UKM kedua yang bersaing), `EliteCOMBWheel` read-only, jalur "Kunjungan Cepat (Lama)" checklist (`WilayahPage.jsx:811` + `HOME_VISIT_INTERVENTIONS`), `PosyanduModal` orphaned, Prolanis "Pantau Obat"/"Senam" buff-gratis. Satu loop kanonik per aktivitas.
**Hidupkan**: `MiniGamePanel`/`MiniGameLibrary` (dead import) — wire ke fase intervensi ATAU hapus; jangan ship setengah.

**Acceptance tests**:
1. Apathy: submit kosong → `comBDiagnosis.apathyPenalty===true` DAN terbaca di `countApathyEvents` (history). [FIX P0]
2. General: bot yang memakai paket menang #1 pada #2 → skor < tier `good`.
3. Kalibrasi: klaim `opp_phy>0.5` di #1 → proximity penalty; klaim `cap_phy>0` → guillotine −10.
4. Gate TTM: pilih `coercion` di precontemplation → backfire (kontribusi 0, Trust −30).
5. Bottleneck: diag<50 → effectiveIntScore = raw × 0.3..0.5 walau intervensi `best`.
6. Persistensi: kunjungi keluarga sama 2× → `stageHistory.length` naik, tahap maju bila outcome `good+`.

---

*Referensi kode: `src/game/BehaviorCaseEngine.js`, `src/utils/behaviorCaseRuntime.js`, `src/domains/village/NPCReadiness.js`, `src/content/scenarios/DiseaseScenarios.js`, `src/components/wilayah/{BehaviorCasePanel,EliteCOMBWheel,MiniGamePanel}.jsx`. Lihat juga `docs/deepthink_dossier_triangulasi.md`.*
