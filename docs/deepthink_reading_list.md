# DeepThink Reading List — Kode Sumber untuk Validasi Gamifikasi

> **Tujuan**: Beri DeepThink jejak kode yang cukup sehingga rekomendasi gamifikasi-nya **grounded di realitas codebase**, bukan abstraksi. Tanpa ini, dia mungkin menyarankan fitur yang bertentangan dengan apa yang sudah ada, atau mengusulkan formula yang tidak bisa dibangun dari state yang tersedia.
> **Catatan untuk user**: attach file-file tier 1 dulu. Jika DeepThink minta lebih, baru kasih tier 2. Tier 3 hanya dibutuhkan kalau dia benar-benar pengen detail.

---

## 🔴 TIER 1 — WAJIB BACA (10 file, ±2,700 baris)

File yang **langsung mendefinisikan gamifikasi saat ini** atau akan jadi target perubahan.

| # | File | Baris | Kenapa wajib |
|---|---|---:|---|
| 1 | [`src/utils/LevelingSystem.js`](src/utils/LevelingSystem.js) | 79 | Kurva XP/level linear 1000/lvl — fondasi progresi individual. DeepThink perlu lihat apakah ini sehat atau perlu revisi. |
| 2 | [`src/services/CloudSaveService.js`](src/services/CloudSaveService.js) | 173 | **Formula leaderboard arbitrer** saat ini (`reputation×10 + level×50 + knowledge×2 + day×5`). Fokus: fungsi `extractLeaderboardData()`. Ini yang paling kritikal untuk direvisi. |
| 3 | [`src/game/TheDirector.js`](src/game/TheDirector.js) | 297 | Adaptive pacing 5-stress-profile + UKM↔UKP bridge + director gift. Kunci untuk memahami bagaimana game sudah menyesuaikan tantangan. |
| 4 | [`src/game/QuestEngine.js`](src/game/QuestEngine.js) | 273 | Daily/weekly quest rewards 40–250 XP. Primitive untuk achievement layer. |
| 5 | [`src/game/BehaviorCaseEngine.js`](src/game/BehaviorCaseEngine.js) | 646 | **Scoring UKM** — COM-B diagnosis + intervention matching + SDOH armor + outcome resolution (excellent/good/partial/fail). Penting untuk menilai depth mekanik UKM. |
| 6 | [`src/domains/village/pisPkIndicators.js`](src/domains/village/pisPkIndicators.js) | 372 | **Engine kanonik IKS Kemenkes** (BARU, PR #2). DeepThink harus lihat formula ini sebelum usulkan formula skor akhir — ini yang akan di-consume. |
| 7 | [`src/domains/village/NPCReadiness.js`](src/domains/village/NPCReadiness.js) | 394 | Readiness TTM: stage advancement, social ripple, neglect decay. Kunci memahami mekanik "kesiapan berubah" yang terpisah dari IKS. |
| 8 | [`src/components/VictoryModal.jsx`](src/components/VictoryModal.jsx) | 171 | Endpoint baru dual-criterion (IKS ≥70% + Readiness ≥60%). Fokus: apa yang ditampilkan + what feedback. DeepThink perlu lihat UX victory existing. |
| 9 | [`src/utils/familyContext.js`](src/utils/familyContext.js) | 198 | UKM↔UKP reverse bridge + SDOH teaching notes (BARU). Penting untuk memahami integrated-care sudah live atau belum. |
| 10 | [`ROADMAP.md`](ROADMAP.md) + [`DESIGN_SPEC_INVARIANTS.md`](DESIGN_SPEC_INVARIANTS.md) | 100 | Fase pengembangan yang diklaim + invariant runtime yang wajib dihormati. |

**Total tier 1**: ±2,700 baris. Muat di context window ≥32K token dengan ruang untuk jawaban. Kalau pakai Grok Large / Claude Opus / GPT-4.1 langsung fit. Kalau terbatas, potong file besar (BehaviorCaseEngine) jadi ekstrak fungsi kunci.

---

## 🟡 TIER 2 — SARAN BACA (8 file, ±2,500 baris)

Kalau DeepThink butuh detail lebih untuk tulis formula akurat atau usulkan UI konkret.

| # | File | Baris | Kenapa |
|---|---|---:|---|
| 11 | [`src/store/selectors.js`](src/store/selectors.js) | 300 | Derived state: `derivedKpis.rrns`, `clinicalAccuracy`, `treatmentAppropriateRate`, `antibioticStewardship`, `availableFunds`, `kbkMultiplier`. **Sumber data yang bisa dipakai formula skor akhir**. |
| 12 | [`src/domains/village/kbkPerformance.js`](src/domains/village/kbkPerformance.js) | 32 | Formula Kapitasi Berbasis Kinerja (0.8x–1.3x multiplier). Pendek, wajib paham untuk finance-axis di skor. |
| 13 | [`src/game/ClinicalReasoning.js`](src/game/ClinicalReasoning.js) | 490 | MAIA reasoning scoring: anamnesis coverage KU-RPS-RPD-RPK-Sosial, OLD CARTS depth, Bayesian diagnostic confidence. Kunci untuk axis "akurasi klinis". |
| 14 | [`src/game/ValidationEngine.js`](src/game/ValidationEngine.js) | 249 | Validasi diagnosis/treatment/education/exam per kasus. Fokus: `validateDiagnosis`, `validateTreatment`, `validateExams`. |
| 15 | [`src/store/helpers/persistenceHelpers.js`](src/store/helpers/persistenceHelpers.js) | 417 | **Initial state shape** untuk 9 slice. DeepThink perlu lihat state tree utk usulkan field tambahan (achievementProgress, lifetime stats, dll). |
| 16 | [`src/content/scenarios/DiseaseScenarios.js`](src/content/scenarios/DiseaseScenarios.js) | 720 | 20 BC scenarios + COM-B barriers + ukpBridge structure. Untuk DeepThink paham "apa yang mahasiswa akan alami". **Potong jadi 1-2 scenario sample + definisi constants di atas**. |
| 17 | [`src/components/DashboardPage.jsx`](src/components/DashboardPage.jsx) | ±600 | Hub navigation + wikiLiveStats — tempat skor akhir akan ditampilkan. Baca struktur `hubButtons`, `wikiLiveStats`. |
| 18 | [`src/components/dashboard/PisPkCoverageChart.jsx`](src/components/dashboard/PisPkCoverageChart.jsx) | 158 | Komponen chart baru — sample pattern untuk bar-chart achievement. |

---

## 🟢 TIER 3 — OPSIONAL (latar belakang, ±3,000 baris)

Kalau DeepThink pengen dive deeper atau usulkan fitur yang mengandalkan mekanik tertentu.

| # | File | Kenapa |
|---|---|---|
| 19 | `src/store/slices/createPublicHealthSlice.js` (1,018 baris) | UKM actions: IKM, Prolanis, outbreak, village ledger, home visit. Besar, tapi kaya info. |
| 20 | `src/store/slices/createClinicalSlice.js` (1,120 baris) | UKP actions: patient queue, discharge, referral, dischargePatient logic. |
| 21 | `src/store/slices/createOrchestratorSlice.js` (524 baris) | `nextDay()` orchestrator — bagaimana daily cycle jalan. |
| 22 | `src/domains/village/championProtection.js` + `localChampion.js` (67 baris gabungan) | Kader mechanic — sudah ada, boleh inspirasi untuk achievement tambahan. |
| 23 | `src/game/IKMEventEngine.js` (±400 baris) | IKM event trigger + cooldown + seasonal. Pedagogical depth tinggi. |
| 24 | `src/game/PosyanduEngine.js` (~10 KB), `ProlanisEngine.js` (~11 KB) | Engine mekanik Posyandu + Prolanis chronic DM/HT. Untuk evaluasi apakah achievement per-sistem sudah mungkin. |
| 25 | `src/components/wilayah/BehaviorCasePanel.jsx` (897 baris) | UI BC case — OARS motivational interviewing, tension meter, COM-B scoring. Baca kalau mau usulkan re-UI. |
| 26 | `src/components/emr/PatientEMR.jsx` (±1,000 baris) | EMR orchestrator — 10 tab modular. Baca kalau usulkan skor real-time EMR. |
| 27 | `PRIMER_BIBLE.md` | Dokumentasi arsitektur (**⚠️ dokumentasi drift: klaim "no Tailwind" salah — lihat dossier**). |

**Tidak wajib** kecuali DeepThink minta spesifik.

---

## ⚫ JANGAN DIKIRIM (skip)

- `src/data/master_icd_10.json` (1.8MB) dan `master_icd_9.json` (605KB) — noise untuk gamifikasi
- `src/data/MedicationDatabase.js` (158 KB) — noise
- `src/game/AnamnesisVariations.js` (127 KB) — noise
- `dist/`, `node_modules/`, `.claude/`, `megalog/outputs/*.json` artefak build/watchdog
- `skdi_*.json` (dipakai runtime tapi tidak relevan gamifikasi)

---

## CARA KIRIM KE DEEPTHINK

**Opsi A — Batch satu-per-satu**:
1. Kirim dossier + super prompt
2. Attach 10 file Tier 1 sebagai konteks awal
3. Biarkan DeepThink jawab
4. Kalau dia ask "boleh lihat X", kirim file Tier 2/3 yang relevan

**Opsi B — Bundle semua Tier 1 jadi satu markdown**:
Copy paste tiap file sebagai code block dengan header:
```
### FILE: src/utils/LevelingSystem.js
```js
[isi]
```

### FILE: src/services/CloudSaveService.js
...
```

Lalu kirim sebagai attachment tunggal. Lebih reliable untuk model yang ribet handle multi-attachment.

**Opsi C — Git diff untuk konteks baru saja**:
Kalau ingin fokus ke yang baru dibangun di PR #2:
```bash
git show 3f2d260 > deepthink_pr2_diff.patch
```
Attach patch ini. DeepThink akan lihat "inilah yang baru jadi".

---

## BATAS KONTEKS WAJAR

| Model | Context window | Rekomendasi |
|---|---:|---|
| **Claude Opus / Sonnet** | 200K | Tier 1+2 langsung muat, Tier 3 as-needed |
| **GPT-5 / 4.1** | 128K-1M | Tier 1+2+3 muat |
| **Grok-3 Large / Deepthink** | 130K+ | Tier 1+2 aman |
| **Gemini 2.5 Pro** | 1M | Semuanya muat sekali |
| **DeepSeek V3** | 64K | Tier 1 saja, potong file besar |

---

## POTONG CERDAS KALAU BUTUH

Untuk file besar yang melampaui budget:

- **`BehaviorCaseEngine.js` (646 baris)**: kirim **hanya fungsi `scoreIntervention` + `resolveOutcome` + konstanta di atas (line 1-80)**. 200 baris cukup.
- **`DiseaseScenarios.js` (720 baris)**: kirim **header + 1-2 tier_1 scenarios sample + getter functions (line 670-720)**. 150 baris cukup.
- **`createPublicHealthSlice.js` (1,018 baris)**: kirim **line 1-100 (definisi + reflection header + initial state use)**. Sisanya ringkas dalam dossier.
- **`PatientEMR.jsx`, `WilayahPage.jsx`**: **jangan kirim** — terlalu besar untuk nilai gamifikasi. Ringkas di dossier sudah cukup.

---

## RINGKASAN ACUAN — 3 LAPIS KESIMPULAN DEEPTHINK HARUS DASARKAN PADA

1. **Lapis Matematika**: formula yang sudah berjalan (`LevelingSystem`, `CloudSaveService`, `kbkPerformance`, `pisPkIndicators`, `NPCReadiness`, `ClinicalReasoning`).
2. **Lapis Mekanika**: system behaviors yang sudah hidup (`TheDirector`, `BehaviorCaseEngine`, `QuestEngine`, `VictoryModal`).
3. **Lapis State Shape**: apa yang bisa dibaca/dihitung (`selectors.js`, `persistenceHelpers.js`).

Kalau rekomendasi DeepThink menyarankan fitur yang **tidak bisa dihitung dari 3 lapis di atas**, dia harus eksplisit bilang "butuh state baru X/Y/Z ditambahkan ke slice A".
