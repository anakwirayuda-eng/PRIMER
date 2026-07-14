# M13 KICKOFF PROMPT (rev 4.2.1) — Curriculum & Release Program

> Dokumen KEPUTUSAN AKTIF: schema, milestone, gate, dan aturan kerja M13.
> Riwayat revisi lengkap + jejak audit 5 ronde (CODEX×5, DeepThink×1, semua
> temuan diverifikasi independen ke kode/regulasi sebelum diadopsi) ada di
> `M13_DECISION_LOG.md` — pindahan dari §0-0.2 rev lama supaya kickoff ini
> tetap ringkas. Rev 4.2.1 adalah errata hasil audit CODEX ronde-5 dan
> menjadi source of truth M13 pada checkpoint ini bersama decision log.

## 0. M10.5 — CLOSED

M10.5 genuinely selesai (`REVISI_ENGINE=32`, 24/24 test tertarget lolos,
bukti per-item di `M13_DECISION_LOG.md`). Jangan reimplementasi/adjudikasi
ulang item M10.5 manapun kecuali ada temuan BARU terverifikasi ke kode —
insiden DeepThink phantom-adjudication (lihat decision log) adalah preseden
kenapa aturan ini formal.

## 1. M13-0 — Decision Lock

Lima keputusan. Revisi hanya lewat §15 (Change control).

### Keputusan 1 — Matriks sumber grounding klinis

| Sumber | Menjawab pertanyaan apa |
|---|---|
| Guideline spesialis/PNPK TERKINI, **sesuai kelompok usia pasien** (§3) | Regimen tatalaksana (dosis, protokol) |
| PPK FKTP 1186/2022 **+ amandemen 1936/2022** (keduanya wajib dicek, §3) | Scope kompetensi FKTP **DAN** regimen praktis level-FKTP (PPK bukan cuma dokumen scope) |
| SKDI 2012 | Plafon kompetensi kurikulum murni (bukan protokol) |
| Fornas AKTIF — **KMK 1199/2025** (efektif 1 April 2026, SUDAH berlaku). **DOEN 2021 TERCABUT** — jangan dipakai rujukan dosis | Akses/restriksi JKN (formularium/reimbursement) |
| SOP lokal & corpus `docs/references/` | Operasional — titik AWAL pencarian, bukan bukti kemutakhiran |

Kalau dua sumber yang sama-sama relevan berbeda (mis. PNPK vs PPK FKTP),
JANGAN pilih diam-diam: catat keduanya di `EvidenceBinding`, tandai domain
konflik, lalu adjudikasi eksplisit. Konflik yang material terhadap keselamatan,
dosis, atau disposisi memblokir aktivasi sampai selesai atau mendapat waiver
tertulis dr. Wirayuda.

### Keputusan 2 — Model kurikulum 6-entitas (dikoreksi dari rev 4.1/4.2)

"144" = jumlah **baris dalam katalog FKTP-144 tertentu**, BUKAN jumlah semua
`CurriculumItem` dan BUKAN jumlah konsep klinis. Bukti: entri
`skdi144.ts:167-174` "Hiperurisemia-Gout Arthritis" adalah SATU kompetensi
resmi yang menggabungkan DUA konsep/kode (E79.0 + M10). Model enam entitas:

1. **`CurriculumItem`** — baris lintas katalog/domain: `id, catalogId,
   domain (ukp/ukm), judulResmi, skdiLevel?, tier?, statusReview`. Angka 144
   dihitung HANYA dari `catalogId='fktp144-1186-2022'`; item SKDI 3A/3B/2
   dan learning objective UKM tetap dapat dimodelkan tanpa mengubah angka 144.
2. **`ClinicalConcept`** — semua diagnosis, TIDAK dibatasi 144: `id,
   diagnosis, aliases?`.
3. **Relasi Item↔Concept** — many-to-many (gout: 1 item ↔ 2 concept; arah
   sebaliknya juga boleh). Item UKM yang non-diagnostik tidak wajib punya
   relasi concept.
4. **`EncounterArchetype`** — `id, conceptId, contentRef {kind:
   clinic|igd,id}, channel (clinic/igd), severityDegree, targetFktp,
   prevalensi, modePolicy {karier:boolean,ujian:boolean}, releasePolicy
   {introducedIn:ContentReleaseId,retiredAfter?:ContentReleaseId}, credits:
   CurriculumItemId[]`.
   `channel` dipisahkan dari target disposisi: rujuk BUKAN channel tersendiri.
   `modePolicy` adalah SATU-SATUNYA sumber kebenaran aktivasi mode (tidak ada
   `modeAktif` duplikat).
5. **`EvidenceBinding`** — menempel ke item/archetype/UKM scenario, BUKAN
   satu ICD/sumber di concept: `subject, facet (membership/skdi/diagnosis/
   regimen/dose/disposition/formulary/ukm-objective), icd10?, source,
   locator, population?, reviewStatus`. Alasan: asma poli J45.9 vs IGD J46;
   epilepsi beda pedoman per usia; satu archetype pun dapat memakai beberapa
   sumber utk facet berbeda.
6. **`UkmScenario`** — referensi `SkenarioKunjungan`: `id, contentRef
   {familyId,visitId}, modePolicy, releasePolicy, credits:
   CurriculumItemId[]`; kedua policy memakai bentuk yang sama dengan
   `EncounterArchetype`, dan grounding melalui `EvidenceBinding`. Arc keluarga
   sudah konten (`content/keluarga/*.ts`, tak beku) dan di-hash
   `sidikJariPack`. Kartu Posyandu/Prolanis/KLB masih hardcoded di
   `engine/kegiatan.ts:32` (file beku); ekstraksinya adalah pekerjaan engine
   terpisah yang ditunda, BUKAN prasyarat M13 (lihat §4).

Baseline angka (hitungan MENTAH, direkonsiliasi di M13-0A — bukan gap
final): 144 baris katalog; 46 tautan `kasusId` singular (≥1 diketahui
menaut kasus 3B: `pneumonia_balita`→`pneumonia_bacterial`); 50 kasus
self-tag `fktp144:true`; 12 `harusDirujuk:true`; 5 `KasusIgd`; target ~60
archetype rujuk + ~20 archetype IGD.

### Keputusan 3 — Frozen build per cohort (dikoreksi dari rev 4.1)

Rev 4.1 menjanjikan save Karier lama "lanjut di rilis lama" — TIDAK bisa
diwujudkan: `PACK` adalah singleton yang diimpor langsung 16 modul produksi
(`store.ts:14` dst.); setelah app di-update, semua gameplay membaca pack
baru; metadata pin tidak menyediakan konten lama. Kebijakan realistis
solo-dev:

- **Build DIBEKUKAN per cohort**: tidak ada update aplikasi/konten selama
  stase kohort aktif berjalan. Rilis konten mendarat DI ANTARA stase.
- Save dari rilis lama dibuka di build baru → JANGAN dilanjutkan diam-diam:
  tawarkan (a) arsipkan dgn label netral, atau (b) fork eksplisit ke epoch
  baru (mulai stase baru di rilis sekarang). Ujian: restart attempt bersih
  tanpa penalti. **Tidak pernah** `'tidak_sah'` utk drift rilis.
- "Melanjutkan save lama di build baru" TIDAK dijanjikan sampai
  historical-pack runtime (multi-versi `PACK`) benar-benar dibangun —
  eksplisit di luar scope M13.
- Save file tetap menyimpan `CONTENT_RELEASE` id (utk deteksi drift &
  labeling di atas) — dgn **migrasi khusus + konstanta baseline legacy**
  utk save yang belum punya field itu; **JANGAN pakai `tandaiMigrasi`**
  (`save.ts:176-190` — mekanisme itu spesifik field TALLY yang live-claim
  ≠ replay; menyalahgunakannya membuat dossier `tidak_dapat_diverifikasi`).
- Setiap build cohort diarsipkan dgn manifest reproduksibilitas: commit SHA,
  versi app, `REVISI_ENGINE`, `CONTENT_RELEASE`, `sidikJariPack`, hash
  installer, serta tanggal mulai/selesai cohort. Verifikasi dossier lama
  memakai build cohort yang diarsipkan, bukan build terbaru secara paksa.
- `CONTENT_RELEASE` juga WAJIB masuk bagian HMAC-covered dossier dan
  dibandingkan SEBELUM replay. Menyimpannya hanya di save tidak cukup:
  perubahan decision-facing memang sengaja dapat meninggalkan
  `sidikJariPack` tetap sama.

### Keputusan 4 — Semantik fingerprint + 3 kelas perubahan konten

| Mekanisme | Yang mengubahnya | Fungsi |
|---|---|---|
| `REVISI_ENGINE` | Bump manual, perubahan semantik 16 file mesin | Versi mesin, dikunci `freeze.test.ts` |
| `CONTENT_RELEASE` (baru, §4) | Bump saat batch konten diaktifkan ke `PACK` | Versi konten, disimpan di save + dossier HMAC dan dibandingkan verifier (Keputusan 3) |
| `sidikJariPack` | Hash field spesifik + `REVISI_ENGINE` (`verifikasi.ts:639`) | Deteksi drift/tampering; TIDAK auto-berubah tiap build |

Tiga kelas perubahan: **`cosmetic`** (typo murni — tanpa bump);
**`decision-facing`** (`keluhanUtama`, `anamnesis.jawab/variasi`,
`pemeriksaanFisik.temuan`, `bukaSetelah` — tak masuk hash TAPI mengubah
info yang pemain terima → WAJIB bump `CONTENT_RELEASE`); **`replay-scoring`**
(Ember Merah §12d — bump + masuk hash).

### Keputusan 5 — Model 5-sumbu

Diagnosis / level SKDI (plafon kurikulum, bukan kegawatan) / archetype
encounter / derajat keparahan / target tindakan FKTP — kini terwujud
struktural di entitas Keputusan 2. Preseden penting: kasus berskdi 3A/3B/2
dgn `harusDirujuk:false` adalah keputusan sengaja (`kasusKiaJiwa.ts:730-734`)
— SKDI bukan gerbang rujuk otomatis.

## 2. M13-0A — Canonical Curriculum Blueprint

**Entry**: §1 disepakati. **Exit**: keenam entitas Keputusan 2 ada; tepat 144
item ber-`catalogId='fktp144-1186-2022'` terisi (yang sudah punya kasus:
penuh; sisanya: judul resmi + placeholder sumber); item katalog utk level
3A/3B/2 existing dan objective UKM awal termodelkan TANPA masuk hitungan 144;
67 kasus klinik, 5 IGD, dan 26 `SkenarioKunjungan` existing masing-masing
punya mapping eksplisit atau alasan tertulis kenapa belum punya credit;
**rekonsiliasi many-to-many selesai** — tiap tautan existing diaudit
(termasuk anomali `pneumonia_balita` 3B yang menaut item 4A: putuskan apakah
item pneumonia butuh archetype poli-4A sendiri terpisah dari archetype rujuk
3B); validator relasi + kardinalitas jalan; aturan mastery ditulis.

**Aturan mastery-aggregation (dikoreksi dari rev 4.1 — jangan beri kredit
kompetensi keliru)**:
- **Dijumpai** — boleh agregat dari archetype MANAPUN milik item.
- **Tersertifikasi** — HANYA dari archetype yang punya edge `credits`
  eksplisit ke item tsb. Catatan keras: IGD saat ini TIDAK punya keputusan
  diagnosis dan TIDAK menulis Dex (`reducer.ts:1187-1214` — `DISPOSISI_IGD`
  hanya sentuh tally/burnout/surat) → archetype IGD TIDAK memberi
  sertifikasi diagnostik sampai mekanik itu dibangun (kalau pernah).
- **Dikuasai** — tetap per-archetype individual.

## 3. M13-0B — Source Registry & Delta Audit 2026

**Entry**: skema M13-0A ada. **Exit**: audit 4 kasus selesai dan tiap delta
punya status terminal `{resolved, accepted_with_limitation, blocked}` di
`EvidenceBinding`; konflik material sudah diperbaiki atau mendapat waiver
tertulis; locator/populasi/facet sumber lengkap; physician sign-off tercatat.
Status `blocked` berarti M13-0B BELUM boleh exit.

- **Epilepsi**: KMK 274/2026 = PNPK Epilepsi **Dewasa**; KMK 367/2017 =
  PNPK Epilepsi **Anak** — dua populasi. **Tidak ditemukan pencabutan/
  pengganti pedoman anak** (katalog Keslan + halaman kemkes.go.id), tapi
  kehadiran di katalog ≠ bukti status hukum final — pakai PNPK Anak 2017
  sbg sumber relevan SAMBIL verifikasi status formal. `kasusSarafMataTht.
  ts:493` usia 12-30 MELINTASI kedua populasi → audit per kelompok usia
  (12-17 → 367/2017; 18-30 → 274/2026); pertimbangkan pecah 2 kasus.
- Hipertensi Dewasa KMK 303/2026 (gantikan 4634/2021); DM2 Dewasa KMK
  302/2026 (gantikan 603/2020); Stroke KMK 304/2026 (gantikan 394/2019).
- PPK 1936/2022 (amandemen 1186/2022) — teksnya belum di corpus lokal
  (diunduh 2026-07-11), cari terpisah; kalau tak ketemu, catat eksplisit
  sbg keterbatasan di `EvidenceBinding`.

## 4. M13-0C — Integrity Release

**Entry**: M13-0A/0B selesai. **Exit**: keenam sub-task + prosedur unfreeze
(di bawah) + full suite hijau.

1. **`CONTENT_RELEASE`** — Keputusan 3/4: state/save + migrasi khusus dan
   konstanta baseline legacy (BUKAN `tandaiMigrasi`); field HMAC-covered di
   dossier; verifier membandingkannya sebelum replay; mismatch rilis jatuh ke
   status netral, bukan `tidak_sah`; manifest build cohort + hash installer
   dihasilkan dan diarsipkan.
2. **Determinisme** — sort pool IGD sebelum `rngIgd.pick()`
   (`reducer.ts:2110`, mirror `director.ts`); tie-break karma
   insertion-order (`init.ts:121-163`) → secondary key eksplisit.
3. **Mode isolation (BARU, blocker ronde-4)** — `director.ts:217` dan pool
   IGD `reducer.ts:2109` men-draw dari SELURUH pack tanpa filter; tanpa
   fix, kasus pilot "Career-only" otomatis bocor ke Ujian. Tambah filter
   `modePolicy`/`releasePolicy` (dari `EncounterArchetype`, Keputusan 2) di
   kedua titik draw. Wajib SEBELUM aktivasi konten pilot apa pun; test negatif
   membuktikan archetype nonaktif tidak pernah terpilih di mode salah.
4. **CI desktop** — `cd primera-desktop && npm ci && npm test && npm run
   typecheck && npm run build && npm run check:bgm-license` (dua terakhir
   sudah dipakai jalur rilis `pack`/`dist`). Smoke-packaging Windows boleh
   fase-2.
5. **`MAKS_BINAAN`** — sinkron `reducer.ts:76` + `m3keluarga.test.ts:
   198-211` kalau nanti nambah keluarga.
6. **Fingerprint manifest runtime** — semua field baru yang memengaruhi draw,
   scoring, atau credit (`contentRef`, `channel`, `targetFktp`, `prevalensi`,
   `modePolicy`, `releasePolicy`, `credits`) wajib ikut `sidikJariPack`.
   Metadata editorial murni tetap mengikuti klasifikasi Keputusan 4.

**Klarifikasi UKM (pushback ronde-4, diverifikasi)**: `SkenarioKunjungan`
keluarga binaan = KONTEN (`content/keluarga/*.ts` tak beku, arc di-hash
`sidikJariPack`) → UKM pilot M13-1 adalah content release normal. Yang
genuinely engine adalah kartu kegiatan Posyandu/Prolanis/KLB
(`kegiatan.ts:32`, beku) — ekstraksinya DITUNDA, bukan prasyarat M13.

**Prosedur unfreeze (urutan DIKOREKSI — hash dihitung TERAKHIR)**:
`save.ts`/`verifikasi.ts`/`state.ts`/`paketUjian.ts` serta `director.ts`/
`reducer.ts`/`init.ts` yang disentuh task di atas termasuk file beku.
Urutan benar: (a) SEMUA edit kode selesai — termasuk bump `REVISI_ENGINE`
dan migrasi save; (b) test kompatibilitas tertarget (save lama dibuka
pasca-perubahan) ditulis & lulus; (c) BARU hitung hash final via
`freeze.test.ts` → paste ke `HASH_DIBEKUKAN`; (d) full suite. (Rev 4.1
salah menaruh bump SETELAH paste hash — bump mengedit `verifikasi.ts`,
membatalkan hash-nya sendiri.)

## 5. M13-0D — Constrained Exam Blueprint

**Entry**: M13-0C selesai. **Exit**: artefak `ExamBlueprint` berversi sudah
mengunci definisi strata, kuota, sampel simulasi, statistik, dan toleransi;
implementasinya lulus kontrak itu + full suite hijau. **Wajib sebelum konten
baru diaktifkan ke pool UJIAN; TIDAK menghalangi authoring/pilot Career-only**
(yang enforceable krn mode-isolation task 3 di §4), TAPI build hasil 0D tidak boleh
didistribusikan ke cohort Karier yang sedang aktif — tunggu batas cohort.

Masalah: `paketUjian.ts` memberi tiap paket satu `seedKurikulum` ke director
yang sama dgn Karier; bobot kluster sudah digerbang off Ujian
(`director.ts:165-179`) tapi bobot Leitner personal (`director.ts:149-155`)
TIDAK. Test existing (2 test, 3 metrik kasar) bukan kontrak fairness.
Blueprint selesai HARUS punya: (a) `blueprintVersion` + `CONTENT_RELEASE`
yang dipin per paket; (b) kuota EXACT utk strata draw yang dikendalikan
kurikulum (tier/kategori/severity/rujukan/trap); (c) definisi tegas bahwa
"kuota demografi" berarti eligibility archetype — demografi pasien aktual
berasal dari flavor RNG dan dinilai sbg distribusi lintas banyak flavor seed,
bukan dipaksa identik; (d) matriks seluruh paket × sekurangnya 32 flavor seed
× bot kuat dan bot lemah/ceroboh; (e) statistik + toleransi yang disetujui
SEBELUM implementasi diuji. Angka Q17 tetap hipotesis, bukan diam-diam
dipromosikan menjadi gate.

## 6. M13-1a — Authoring Slice (Nayla + Dimas)

**Entry**: M13-0C penuh (BUKAN 0D — Career-only). **Exit**: 6 poli + 1 IGD
+ 1 UKM (`SkenarioKunjungan`) ditulis dan terhubung ke item/objective;
`ContentReviewRecord` mencatat author, reviewer, tanggal, facet yang direview,
hash/release konten, serta sign-off; kedua karma Nayla/Dimas DIREWIRE ke kasus
pediatrik baru dan dua exception `DIKETAHUI_BELUM_DIPERBAIKI` di
`pack.test.ts:398-414` dihapus; aktivasi via bump `CONTENT_RELEASE` dgn
`modePolicy.karier=true` dan `modePolicy.ujian=false`; full suite hijau; save
pra-aktivasi diperlakukan sesuai Keputusan 3.

Nayla (`desaD.ts:641`, bayi 3 bln, karma→`diare_akut_anak` yang ditulis utk
3-5 th) dan Dimas (`desaE.ts:699`, 7 th, karma→`asma_ringan` yang ditulis
utk 15-40 th) — mismatch terdokumentasi; tulis padanan pediatrik benar utk
kedua karma + 4 kasus representatif lain (≥1 per tier A/B/C + ≥1 rujuk).

## 7. M13-1b — Learner Pilot (BARU — dipisah dari authoring)

**Entry**: M13-1a selesai. **Exit**: playtest oleh minimal 3 mahasiswa/proxy
sungguhan (bukan bot): usability dicatat, dangerous-path dites (pemain
sengaja salah — apakah konsekuensi/feedback benar), dan keputusan
**zero-material-defect** eksplisit dari dr. Wirayuda sebelum lanjut.
Rasional: M13-1a membuktikan PIPELINE jalan; M13-1b membuktikan KONTEN
layak dipelajari manusia — dua klaim berbeda.

## 8. M13-2 — First Measured Wave

**Entry**: M13-1b lulus; alat analytics offline sudah jalan; protocol analisis
SUDAH dipraregistrasikan sebelum data pertama dikumpulkan: estimand, ukuran
sampel, ukuran kemampuan baseline + strata, unit analisis/clustering,
missing-data rule, response-rate minimum, CI/minimum precision, dan batas
interpretasi voluntary export. **Exit**: data exploratory calibration
terkumpul dari ≥1 cohort dan dianalisis persis menurut protocol tsb.

**Analytics (dikoreksi ronde-4/5)**: JANGAN pakai dossier yang "dihapus
nama/NIM-nya" — dossier membawa seed deterministik turunan NIM, action log,
refleksi, SBAR: inheren re-identifying. Bangun **format ekspor analytics
minimal terpisah** berisi random per-run id + `CONTENT_RELEASE` + metrik
turunan yang memang diperlukan (paparan/mastery per tier, latency remediasi,
jumlah IGD unik/repeat, outcome agregat); TANPA nama/NIM/seed/raw action log/
refleksi/SBAR. Ekspor sukarela, consent eksplisit + retention/access policy
tertulis, tanpa remote telemetry. Sampel sukarela disebut **respondent
sample**, bukan otomatis "cohort p10", kecuali response coverage memenuhi
ambang protocol.

Batch 4-6 poli / 2-3 IGD-UKM per cohort; aktivasi atomik per batas cohort;
UKM target 26→32/34 (bukan langsung ~40); ukuran batch mengikuti kapasitas
review dr. Wirayuda. Simulasi Q10 (pity/remediation) dgn data nyata di
sini SEBELUM membangun antrean remediasi.

## 9. M13-3 — Scale by Evidence

**Entry**: M13-2 exit terpenuhi + angka §13 direvisi berdasar data + wave
charter berikutnya dikunci SEBELUM authoring (target item/objective, jumlah
konten, metrik perubahan, ambang keputusan, kapasitas review). **Exit**:
cakupan `CurriculumItem` naik sesuai wave charter; tiap gelombang lewat gate
M13-1b-style (`ContentReviewRecord` + defect decision). **Stop condition**:
kalau 2 gelombang berturut-turut gagal mencapai ambang perubahan yang sudah
dipraregistrasikan (beserta CI/minimum precision) atau kapasitas review jenuh
— berhenti menambah, konsolidasi dulu.

## 10. M13-4 — Full Library & Mode Gating

**Entry**: M13-0D selesai + cakupan dari M13-3 dinilai cukup oleh
dr. Wirayuda. **Exit**: pool terdistribusi via `modePolicy` (Karier/Ujian
blueprint/…); Regional-KLB & Endurance TETAP menunggu keputusan sub-scope
B/D (`DEEPTHINK_M13_SKALA_PENUH.md` Q1-Q10). **Stop condition**: fairness
Ujian gagal diverifikasi ulang pasca-distribusi → rollback ke pool Ujian
sebelumnya.

## 11. M13-5 — Completion Audit

**Entry**: M13-4 selesai. **Exit**: (a) rekonsiliasi manifest vs `PACK` — tiap
`CurriculumItem` berstatus TEPAT SATU dari {dibangun, dikecualikan-dgn-
alasan-tertulis, ditunda-eksplisit}; (b) semua archetype/UKM aktif punya
referensi valid, `EvidenceBinding` terminal, dan `ContentReviewRecord` yang
masih cocok dgn hash/release konten; (c) tidak ada material defect terbuka;
(d) test mode/release isolation + determinisme hijau; (e) kontrak fairness
M13-0D dijalankan ulang pada pool FINAL dan lulus; (f) manifest build tiap
cohort + installer hash tersimpan. Completion bukan sekadar hitung baris.

## 12. Metodologi kerja (M13-1a dst.)

### 12a. Shell-factory porting dari repo lama

Pin `D:\Dev\PRIMER\src\` ke **`6aa7436`** (HEAD; memuat
`icd10OriginalIndoOverrides.js` — BUKAN `4d348d9`, branch terpisah).
Boleh diporting sbg **DRAF bahasa** (dialog anamnesis, kalimat keluhan,
narasi PF) — tetap WAJIB review klinis sebelum aktivasi (decision-facing ≠
bebas fakta klinis implisit; repo ini bekas insiden ICD-poisoning). WAJIB
dibangun ulang dari nol: `icd10, skdi, category, clue`, semua nilai
`labs{}`/`vitals{}`, `correctTreatment/correctProcedures/requiredEducation/
risk/referral*/differentialDiagnosis` — grounding Keputusan 1. IGD lama
TIDAK plug-compatible — tulis fresh ikuti `igd.ts`.

### 12b. Template kasus + budget kedalaman

Sampel verbatim: `kasusInfeksi.ts:22-133` (baseline), `:140-258`
(`alergiTrap`), `:633-761` (`konfirmasiWajib`), `kasusRespGi.ts:385-502`
(rujuk terlengkap).

| | Tier A (±40) | Tier B (±60) | Tier C (±44) |
|---|---|---|---|
| Pertanyaan anamnesis | 10-15 | 7-10 | 5-8 esensial inti |
| `obatSalahUmum` | Lengkap+`alasan` | 1-2 opsi umum | Hanya bahaya nyata |
| `mutiaraEbm`/`catatanRealita`/`panduanResmi` | Kalau relevan | Isu klinis nyata | Umumnya tidak |
| `clue` | 2-4 kalimat | 1-3 kalimat | 1-2 kalimat |

Rujuk-wajib baru: SEMUA wajib justifikasi/tujuan rujuk benar; HANYA yang
pasiennya tidak stabil butuh `stabilisasiWajib`. Lantai mutu SAMA semua
tier: red flag, dosis, kontraindikasi, stabilisasi, rujukan, follow-up,
safety-net, sumber. Cap-grade (`clinic.ts:754-780`): cowboy/obat-berbahaya
→54; antibiotik-tanpa-indikasi/konfirmasi/stabilisasi/firewall→69;
rujukan-non-spesialistik→84.

### 12c. Aturan anamnesis

1. ≥1 pertanyaan `keluhan_utama` kompatibel gender (dites otomatis
   `DeckAnamnesis.test.tsx`).
2. `keluhanUtama` tak boleh bocorkan penentu diagnosis (pelajaran
   `kia_malaria_falsiparum`).
3. `bukaSetelah` jarang; tak pengaruhi skor TAPI decision-facing (bump
   `CONTENT_RELEASE` bila diubah pasca-aktivasi).
4. `hanyaUntuk` gender-gate; prasyarat kompatibel gender.
5. Alur koheren (pembuka → OLDCARTS → red flag → sistem terarah →
   riwayat/paparan); rationale lompatan boleh dari (a) info sudah terbuka,
   (b) red-flag screening standar, atau (c) differential reasoning sah —
   cukup dicatat sbg komentar authoring, tak harus jadi dialog/`bukaSetelah`.
6. Jawaban konsisten dgn `clue`/`vital`/PF/lab — variasi klinis sah (demam
   di rumah, suhu normal saat periksa krn antipiretik/intermiten) boleh,
   asal penjelasannya tersurat.

### 12d. Ember Merah vs Hijau (`sidikJariPack`)

Di-hash: `id, icd, rujuk, bisaPrb, trap, interaksi, konfirmasi, stabilisasi,
justifikasi, tx` (seluruh `tatalaksana` termasuk `alasan`), `lab` (termasuk
teks `hasil`), `pf` (`{region,relevan}` saja), `anamnesis`
(`{id,esensial,distraktor,oldcarts,hanyaUntuk}` saja), `demografi,
prevalensi, kategori, skdi, konsekuensi, spesialis` — plus arc keluarga.
Setelah manifest M13 aktif, field runtime archetype/UKM yang mengubah draw,
scoring, atau credit (`contentRef`, `channel`, `targetFktp`, `prevalensi`,
`modePolicy`, `releasePolicy`, `credits`) juga WAJIB masuk hash.
Tidak di-hash: `nama, keluhanUtama, keluhanUtamaOlehPendamping, clue,
mutiaraEbm, catatanRealita, panduanResmi`, teks tanya/jawab/variasi/
kategori/`bukaSetelah`, `pemeriksaanFisik.temuan` — **sebagian besar tetap
decision-facing** (Keputusan 4): bump `CONTENT_RELEASE` walau tak masuk
hash; hanya cosmetic murni yang bebas.

### 12e. Persona

539 pertanyaan; 87 bervariasi (16,1%); 313 esensial (226 belum bervariasi);
polos=83, terpelajar=79, cemas=69, lansia=12, wali_anak=8, **skeptis=0**.
Prioritas: 226 esensial, dahulukan 40 kasus terpapar tertinggi; isi
`skeptis`. Invariant: persona mengubah GAYA BAHASA saja, tak pernah fakta
klinis.

## 13. Q17 — Target kalibrasi eksploratif, BUKAN acceptance gate

| Metrik (hipotesis, belum tervalidasi) | Angka |
|---|---|
| Selisih skor bot antar-paket Ujian | ≤2/100 |
| Remediasi kasus gagal | 90% dlm 7 hari in-game |
| Paparan Karier (p10) | 100% Tier A, ≥80% B, ≥60% C |
| Keunikan event IGD | 85% unik sebelum repeat |

`telemetriAudit.ts` hanya deteksi save-scumming — cohort-analytics adalah
komponen baru (lihat §8). Satu kohort = "exploratory calibration", bukan
validasi. Jangan blokir M13-1/2 dgn angka ini.

## 14. Yang SENGAJA dikecualikan

- **Mpox** — sensitif; tanpa arahan eksplisit dr. Wirayuda jangan ditulis.
- **Sub-scope B/D** (regional, Endurance) — Q1-Q10
  `DEEPTHINK_M13_SKALA_PENUH.md` belum diputuskan.
- **Historical-pack runtime** (melanjutkan save lintas rilis di build baru)
  — di luar scope M13 (Keputusan 3).
- **Ekstraksi kartu kegiatan UKM ke content pack** — ditunda (§4).

## 15. Change control setelah Decision Lock

| Domain klaim | Bukti sah utk revisi Keputusan §1 |
|---|---|
| Teknis/arsitektur | Kutipan file:line + hasil test run nyata |
| Klinis/EBM | Sumber primer resmi (URL+tanggal, Keputusan 1) + sign-off dr. Wirayuda |
| UX/gameplay | Observasi playtest langsung |
| Pedagogi/kurikulum | Keputusan eksplisit product-owner (dr. Wirayuda) |

Prosedur: temuan BARU → verifikasi independen sesuai domain → revisi +
justifikasi dicatat di `M13_DECISION_LOG.md`. Reviewer yang mengulang posisi
lama tanpa bukti baru bukan alasan membuka ulang (preseden: insiden
DeepThink M10.5, lihat decision log).

## 16. Disiplin verifikasi

Tiap batch CODEX diverifikasi independen — test/typecheck/`CONTENT_RELEASE`
dijalankan nyata; klaim medis dicek ke Keputusan 1 per jenis bukti §15.
Koreksi adalah proses normal (rev 1→4.2.1 dokumen ini buktinya).

## 17. Working folder & git

Kerja di `D:\Dev\PRIMER-CODEX-lab\primera-desktop` (branch
`codex-gpt56-experiment`) — BUKAN repo lama (read-only, pin `6aa7436`) dan
BUKAN worktree produksi. Git "dubious ownership" → prefix
`git -c safe.directory='D:/Dev/PRIMER-CODEX-lab' <command>` per command
(path spesifik, jangan wildcard; jangan ubah git config global).
