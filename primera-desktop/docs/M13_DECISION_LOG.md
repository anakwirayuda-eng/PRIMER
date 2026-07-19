# M13 DECISION LOG — riwayat revisi & jejak audit kickoff

> Dokumen ARSIP: kronologi lengkap bagaimana `M13_KICKOFF_PROMPT.md` mencapai
> bentuknya, insiden yang tak boleh terulang, dan bukti verifikasi tiap ronde.
> Keputusan AKTIF ada di `M13_KICKOFF_PROMPT.md` — jangan kerja dari file ini.

## Ringkasan revisi

| Rev | Tanggal | Isi | Nasib |
|---|---|---|---|
| 1 | 2026-07-13 pagi | "Content factory" — langsung tulis 152 kasus | Ditarik (audit CODEX #1: 15 klaim, 13 confirmed/partial) |
| 2 | 2026-07-13 sore | Fase M13-0A/0B/1/2/3 + budget tier + UKM Fase-0 | Digantikan (triase DeepThink+CODEX) |
| 3 | 2026-07-13 malam | Decision Lock 5 keputusan + M13-0/0A/0B/0C/1-5 | Diaudit CODEX #2: 4 blocker P0 + 8 koreksi P1, semua terverifikasi akurat |
| 4 | 2026-07-13 | Koreksi 12 temuan rev 3 | Diaudit CODEX #3: 3 kontradiksi P0 + 6 koreksi menengah, semua terverifikasi |
| 4.1 | 2026-07-13 | Koreksi 9 temuan rev 4 | Diaudit CODEX #4: 7 blocker (6 confirmed, 1 partial) + koreksi lain |
| 4.2 | 2026-07-14 | Model 6-entitas, frozen-build-per-cohort, mode isolation, doc split | Diaudit CODEX #5: 3 blocker Decision Lock + gate milestone tersisa |
| 4.2.1 | 2026-07-14 | Errata checkpoint: catalog-scoped items, dossier release, UKM evidence, closure gates | **Aktif** — source of truth M13 |
| 4.2.2 | 2026-07-15 | Formalisasi prinsip floor+graceful-degradation (Keputusan 1) + sumber ASPAK/KFA | **Aktif** — amandemen governance, bukan revisi struktural |
| 4.2.3 | 2026-07-15 | M13-RP1: baseline resource naratif diterima; simulasi readiness engine ditunda | **Aktif** — batas scope M13-1a |
| 4.2.4 | 2026-07-19 | UKM dan UKP ditetapkan sebagai pilar ko-primer; mutu bridge dinilai dari loop kausal tertutup | **Aktif** — DNA produk lintas milestone |

## Governance — UKM dan UKP sebagai pilar ko-primer (2026-07-19)

dr. Anak Agung Bagus Wirayuda menetapkan bahwa UKM sejak awal bukan sekadar
pendamping UKP. PRIMERA harus mengajarkan tindakan klinis individual sekaligus
konsekuensi keluarga, populasi, program, jejaring, dan kontinuitasnya secara
substantif. Keputusan ini menjadi kriteria penerimaan lintas milestone:

- bridge harus timbal balik dan kausal, bukan sekadar tautan atau narasi;
- keputusan UKM harus dapat mengubah keadaan yang kelak terbaca kembali oleh
  klinik, keluarga, program, atau RS bila hubungan itu memang relevan;
- keputusan UKP harus dapat menghasilkan tindak lanjut komunitas atau program
  bila secara klinis dan epidemiologis memang diperlukan;
- kedalaman dinilai dari agency, feedback, konsekuensi, closure, dan transfer
  belajar, bukan dari kewajiban menyamakan jumlah kasus atau waktu layar;
- kualitas pengalaman pemain harus divalidasi lewat playtest manusia sebelum
  diberi klaim final “well developed” atau “wow”.

## Governance — prinsip floor + graceful degradation (ditetapkan dr. Wirayuda, 2026-07-15)

dr. Anak Agung Bagus Wirayuda, dokter dan penanggung jawab klinis PRIMERA,
menetapkan aturan universal berikut secara langsung. Aturan ini berlaku untuk
SELURUH game, bukan hanya delapan payload M13-1a:

> PPK dan/atau PNPK serta aturan/instruksi Kemenkes aktif terbaru menjadi
> baseline/ambang bawah. EBM yang lebih baru atau lebih baik boleh digunakan
> dengan referensi eksplisit, lalu diterapkan secara bijak melalui graceful
> degradation sesuai ketersediaan obat, alat, SDM, dan jejaring FKTP Indonesia.

Operasionalisasinya:

- baseline Kemenkes tetap dicantumkan ketika EBM lain menaikkan standar;
- applicability populasi/setting/outcome dan alasan pemilihan wajib tertulis;
- konflik material safety/dosis/disposisi tetap memerlukan physician
  adjudication atau waiver sebelum aktivasi;
- Fornas 1199/2025 membuktikan status/restriksi formularium JKN, bukan stok;
- KFA membuktikan kode/identitas/nomenklatur produk, bukan stok fasilitas;
- ASPAK menghimpun rekaman sarana/prasarana/alkes per fasilitas, tetapi tidak
  sendirian membuktikan ketersediaan real-time, fungsi alat, bahan habis pakai,
  maintenance, atau SDM kompeten;
- stok, kedaluwarsa, fungsi, bahan, SDM, transport, dan kapabilitas tujuan
  rujukan harus diverifikasi pada fasilitas/jejaring yang dimodelkan;
- DOEN 2021 hanya konteks historis karena dicabut oleh KMK 2197/2023;
  fungsi daftar obat esensial kini dibaca melalui Fornas aktif yang
  mengintegrasikan obat esensial nasional;
- resource yang tidak tersedia tidak mengubah kebenaran klinis: game menilai
  stabilisasi feasible dan disposisi aman, bukan improvisasi tanpa sumber.

Kebijakan ini diformalkan sebagai objek tervalidasi
`CLINICAL_GROUNDING_POLICY` dan diikat ke setiap review envelope M13-1a.
Kasus supersesi mengikat floor, sumber pengganti, Fornas/KFA/ASPAK yang relevan,
status graceful-degradation, dan catatan implementasi langsung pada
`EvidenceBinding.governance`; validator menolak konflik material yang kehilangan
salah satu lapisan tersebut.
Penerapan pertama merevisi D1 (target oksigen GINA 2026; dosis ipratropium
tetap berbasis usia dan Fornas) serta F1 (no-mini-washout, dengan konflik
PNPK Fraktur 270/2019 versus NICE/BOAST dicatat, bukan disembunyikan).
Keduanya tetap `pending` dan belum memperoleh sign-off kasus. Amandemen ini
tidak mengubah lima Decision Lock lain atau mengaktifkan materi M13-1a.
Pada checkpoint ini, binding mekanis baru diterapkan ke delapan review envelope
M13-1a; ini BUKAN klaim bahwa seluruh konten aktif lama sudah diaudit ulang.
M13-5 kini mewajibkan audit retrospektif seluruh kasus aktif sebelum program
dapat dinyatakan complete.

## Insiden yang menjadi preseden change-control

**DeepThink M10.5 phantom-adjudication (2026-07-13).** DeepThink membalas
dossier M13 CODEX dengan "adjudikasi M10.5 kilat" (item #3/#5/#6/#12/#14/#15/
#19/#20/#21/#23, format "Q-A"–"Q-F"). Verifikasi: format & item itu **TIDAK
ADA** di dossier yang benar-benar dikirim (dossier 3× eksplisit menyatakan
M10.5 selesai); kedelapan item yang bisa dicek SEMUA sudah terimplementasi:

| Item | Bukti selesai |
|---|---|
| #3 rujuk-tanpa-stabilisasi IGD | `igd.ts:116` `AMBANG_STABIL_RUJUK=50` → `igdMeninggal` (Kode Hitam), `scoring.ts:87` bobot -3 komponen UKP — mekanisme BEDA dari cap-grade per-encounter, tak sepadan utk dibandingkan "lebih/kurang berat" |
| #5 formula IKS | `kader.ts:177-178,215`, REVISI 26, Permenkes 39/2016 |
| #12 jadwal (flush+spacing) | `verifikasi.ts:304-307` + `init.ts:146-163` |
| #14 lab hasil terbawa | `clinic.ts:143,151-152` + `reducer.ts:2083-2087` — scoped pasien follow-up sama |
| #15 mode-Ujian day-scaling | `init.ts:104-109`, `reducer.ts` multipel |
| #23 hipertensi PNPK | `kasusKronis.ts:147-152` |
| Q2 gate lab | `clinic.ts:469`, cap 69 |
| §3a TACC justifikasi | `clinic.ts:680-684`, `verifikasi.ts:299-303` |

Test run konfirmasi: `freeze.test.ts` 16/16, `m11prosesStabilisasi.test.ts`
6/6, `paketUjian.test.ts` 2/2 = 24/24. **Pelajaran**: reviewer yang mengulang
posisi lama tanpa bukti baru terverifikasi bukan alasan membuka ulang
milestone tertutup — kini aturan formal di kickoff §15.

## Temuan kunci per ronde audit (semua diverifikasi independen sebelum diadopsi)

**Ronde 1 (rev 1 → 2).** Raw link gap yang saat itu dihitung = 98
(144−46 tertaut), bukan 94 (144−50 self-tag); angka ini kemudian dikoreksi
di ronde-4 sebagai hitungan TAUTAN, bukan gap concept final. Save/replay tak
aman lintas rilis konten (`save.ts` hanya
`{v,state}`, replay pakai pack aktif); PPK 1936/2022 amandemen nyata atas
1186/2022; DOEN 2021 dicabut (rantai KMK 2197/2023→1818/2024→Fornas
1199/2025 efektif 1 April 2026); 4 PNPK 2026 baru (Hipertensi 303/2026, DM2
302/2026, Stroke 304/2026, Epilepsi-Dewasa 274/2026); determinisme IGD/karma
bolong; CI tidak menyentuh `primera-desktop`; persona: 539 pertanyaan
(bukan 461), 87 bervariasi, skeptis=0; divergensi skdi-vs-harusDirujuk
(17 vs 12) adalah KEPUTUSAN sengaja (`kasusKiaJiwa.ts:730-734`), bukan bug.

**Ronde 2 (rev 3 → 4).** KMK 274/2026 = epilepsi DEWASA, 367/2017 = epilepsi
ANAK — dua populasi, bukan supersesi; `kasusSarafMataTht.ts:493` usia 12-30
melintasi keduanya; skema `skdi144` nyata hanya `{id,nama,icd10,kasusId?}[]`
(`pack.ts:33`); "tidak di-hash" ≠ "display-only" → 3 kelas perubahan
(cosmetic/decision-facing/replay-scoring); `telemetriAudit.ts` hanya deteksi
save-scumming, bukan cohort-analytics; `paketUjian.test.ts` hanya 2 test/3
metrik kasar; CI perlu build+check:bgm-license (dipakai jalur rilis nyata);
change-control butuh jenis bukti per domain. Temuan tambahan Claude: pin
repo lama yang benar `6aa7436` (HEAD, memuat `icd10OriginalIndoOverrides.js`
178 baris) — `4d348d9` ada di branch terpisah `claude/goofy-beaver-86bec9`,
bukan ancestor HEAD.

**Ronde 3 (rev 4 → 4.1).** Kardinalitas "144 baris + targetId baru utk
IGD-murni" mustahil dipenuhi; `PACK` diimpor langsung 16 modul produksi
(singleton) → bundled-snapshot hanya membantu verifier, bukan gameplay
lanjutan; kontradiksi literal blueprint-Ujian vs pilot Career-only →
M13-0D dipisah; PPK ≠ SKDI di matriks sumber; wording epilepsi-anak dibuat
konservatif; anamnesis boleh red-flag screening/differential reasoning;
cohort-analytics = entry criteria M13-2; porting narasi lama wajib review
klinis; prosedur unfreeze eksplisit (save/verifikasi/state/paketUjian semua
file beku).

**Ronde 4 (rev 4.1 → 4.2).** Diverifikasi langsung ke kode:
- "144" = baris KATALOG, bukan concept — `skdi144.ts:167-174` entri
  "Hiperurisemia-Gout Arthritis" eksplisit menggabungkan E79.0 + M10 sbg
  SATU kompetensi → perlu `CurriculumItem` ≠ `ClinicalConcept`.
- 46/98 = hitungan tautan mentah — `skdi144.ts:83-88` `pneumonia_bacterial`
  (4A) menaut `pneumonia_balita` (3B, wajib rujuk); rekonsiliasi
  many-to-many adalah DELIVERABLE M13-0A, bukan baseline final.
- IGD tak menulis Dex — `reducer.ts:1187-1214` `DISPOSISI_IGD` hanya sentuh
  tally/burnout/surat → agregasi "Tersertifikasi dari archetype manapun"
  bisa memberi kredit kompetensi keliru; perlu edge `credits` eksplisit.
- Skema rev 4.1 menaruh `skdiLevel` hanya kalau `fktp144=true` — menghapus
  level 3A/3B/2 milik 17 kasus existing.
- Pin `CONTENT_RELEASE` per-stase TIDAK bisa menjalankan save lama di build
  baru (singleton `PACK`) — janji rev 4.1 "app tetap tahu cara jalankan
  rilis lama" salah → kebijakan diganti frozen-build-per-cohort.
- Career-only tak enforceable — `director.ts:217`/`reducer.ts:2109` draw
  dari seluruh pack tanpa filter mode → mode isolation masuk M13-0C.
- `tandaiMigrasi` (`save.ts:176-190`) spesifik utk field TALLY yang
  live-claim ≠ replay — salah alat utk field `CONTENT_RELEASE`; perlu
  migrasi khusus + konstanta baseline legacy.
- Urutan unfreeze rev 4.1 salah — bump `REVISI_ENGINE` SETELAH paste hash
  membatalkan hash `verifikasi.ts` sendiri; hash dihitung TERAKHIR.
- ICD per-archetype beda (asma poli J45.9 vs IGD J46) → `EvidenceBinding`
  per item/archetype, bukan satu icd10 di concept.
- Dossier tak bisa "dihapus nama/NIM" utk analytics — seed deterministik
  diturunkan dari NIM (M6), action log + refleksi + SBAR inheren
  re-identifying → format ekspor analytics minimal terpisah.
- PARTIAL (pushback diterima sebagian): klaim "menambah 1 UKM di M13-1 =
  perubahan engine" hanya benar utk kartu kegiatan Posyandu/Prolanis/KLB
  (`kegiatan.ts:32`, file beku). `SkenarioKunjungan` keluarga binaan hidup
  di `content/keluarga/*.ts` — TIDAK beku, dan arc-nya DI-HASH
  `sidikJariPack` (`'keluarga', ...keluarga`) → UKM pilot M13-1 tetap
  murni content release selama bentuknya kunjungan, bukan kartu kegiatan.

**Ronde 5 (rev 4.2 → 4.2.1, errata checkpoint).** Audit CODEX menerima
doc split + frozen-build policy + pushback UKM, lalu menemukan residu berikut:
- `CurriculumItem` didefinisikan tepat 144 baris sambil diminta menampung
  level 3A/3B/2 di luar katalog itu — kontradiksi. Dikoreksi menjadi item
  lintas `catalogId`; angka 144 hanya subset katalog FKTP-144.
- `CONTENT_RELEASE` baru diwajibkan di save, belum di dossier/verifier —
  decision-facing drift bisa punya `sidikJariPack` sama. Kini release wajib
  HMAC-covered, dibandingkan sebelum replay, dan build cohort diarsipkan dgn
  commit/engine/release/fingerprint/installer hash.
- `EvidenceBinding` belum menarget UKM dan terlalu kasar; kini subject/facet/
  locator/population eksplisit, dan `UkmScenario` mengkreditkan objective UKM.
- `pool=rujuk` mencampur channel dgn target disposisi, sementara `modeAktif`+
  `modePolicy` menduplikasi truth. Kini `channel=clinic|igd`, target terpisah,
  dan hanya `modePolicy` yang otoritatif.
- M13-0B/0D/2/3/5 belum closable secara objektif; diperkeras dgn terminal
  source status, versioned fairness contract, preregistered analysis/wave
  charter, final fairness rerun, serta zero-material-defect/evidence gates.
- M13-1a belum mewajibkan rewire karma Nayla/Dimas dan penghapusan allowlist;
  kini keduanya menjadi exit criterion literal.
- Tiga cross-reference stale diperbaiki (`§13→§15`, `§10d→§12d`,
  `§11→§13`).

Verifikasi pra-edit ronde-5: full suite 71 file / **785/785** test lolos;
`npm run typecheck` bersih. Setelah errata (docs-only), status kode tetap
tidak berubah; verifikasi dokumen dilakukan lagi sebelum commit checkpoint.

## Fakta operasional tetap

- Baseline kode (semua diverifikasi 2026-07-13): `REVISI_ENGINE=32`, 785/785
  test, 50 self-tag 4A / 46 tertaut / 12 `harusDirujuk:true` / 5 `KasusIgd` /
  16 keluarga / 26 skenario kunjungan / 539 pertanyaan anamnesis (87
  bervariasi; skeptis=0).
- Repo lama utk porting: pin `6aa7436`. Git gotcha: prefix
  `git -c safe.directory='D:/Dev/PRIMER-CODEX-lab' <command>` (path
  spesifik, bukan wildcard).
- Nayla (`desaD.ts:641`, bayi 3 bln) & Dimas (`desaE.ts:699`, 7 th) nyata;
  mismatch karma mereka terdokumentasi di `M10_AUDIT_BRIEF_R2.md` &
  `CODEX_AUDIT_DOSSIER.md`.

## Implementasi M13-0A (2026-07-14)

- Blueprint kanonik enam entitas diimplementasikan sebagai manifest authoring
  terpisah dari draw/scoring runtime: 144 item katalog FKTP, 22 item klinis
  tambahan (termasuk seluruh 17 kasus level 3A/3B/2), 12 objective PIS-PK,
  67 archetype klinik, 5 archetype IGD, dan 26 skenario UKM.
- **98** tetap angka raw-link kosong (`144-46`). Setelah adjudikasi semantik,
  hanya **45/144** item punya archetype klinik yang sah untuk sertifikasi;
  canonical certification gap = **99**. Selisih satu adalah
  `pneumonia_balita`: archetype berat 3B tetap berbagi concept pneumonia,
  tetapi mengkredit item klinis 3B sendiri dan secara eksplisit TIDAK
  menyertifikasi `fktp144:pneumonia_bacterial` 4A.
- Baris katalog yang memuat diagnosis berbeda tidak dipipihkan menjadi alias:
  antara lain Hiperurisemia/Gout, disentri basiler/amuba, gastroenteritis-
  kolera-giardiasis, ulkus aftosa/herpes, duh genital gonore/non-gonore,
  furunkel/karbunkel, erupsi obat eksantematosa/fixed, dan laseratum/punctum.
  Variasi spektrum/stadium/derajat yang masih satu konsep tetap satu concept.
- Mastery dikunci tiga tingkat: dijumpai boleh agregat via concept;
  tersertifikasi hanya dari edge `credits` klinik + diagnosis/disposisi benar;
  dikuasai tetap per-archetype. IGD baseline punya concept tetapi nol credit
  diagnostik karena flow-nya belum punya keputusan diagnosis/Dex.
- Semua binding sumber sengaja berstatus `pending`: ini source placeholder
  M13-0A, BUKAN klaim bahwa M13-0B sudah selesai.
- Verifikasi: 12/12 test invariant M13-0A, full suite **72 file / 797 test**,
  typecheck, dan production build lulus. `PACK`, `REVISI_ENGINE`,
  `CONTENT_RELEASE`, serta `sidikJariPack` tidak diubah.

## M13-0B audit teknis pra-sign-off (2026-07-14)

- Registry delapan sumber primer dibuat untuk PNPK HT 303/2026, DM2 302/2026,
  Stroke 304/2026, Epilepsi Dewasa 274/2026, Epilepsi Anak 367/2017, PPK
  1936/2022, Fornas 1199/2025, serta DOEN 6477/2021 sebagai sumber historis
  yang sudah dicabut. Hash PDF dan full-text disimpan terpisah.
- Anomali sumber tidak dinormalisasi diam-diam: PNPK Stroke bernomor 304/2026
  tetapi halaman tanda tangan literal bertanggal 17 April 2025; status formal
  PNPK Epilepsi Anak belum dapat dibuktikan final hanya dari ketiadaan pencabutan.
- Empat delta menghasilkan 32 binding (8 facet per kasus). Semuanya terminal
  `blocked`; binding baseline lain tetap `pending`.
- Konflik material: assessment renal/kontraindikasi dan rujukan HT; tanda
  katabolik vs oral-only/no-referral pada DM; subtipe stroke sebelum CT serta
  cairan/antitrombotik pra-rujuk; populasi campur dan diazepam rektal wajib pada
  epilepsi stabil pascakejang.
- Koreksi adversarial formularium: Fornas aktif memuat diazepam enema 5/10 mg
  pada FPKTP, sehingga masalah epilepsi adalah indikasi, bukan ketersediaan.
  Fornas juga memuat glibenklamid; DOEN 2021 yang dikutip konten DM sudah tidak
  berlaku dan p. 29-nya sendiri tetap memuat glibenklamid untuk Puskesmas.
- Tidak ada konten medis runtime yang diubah pada tahap pra-sign-off ini. Gate
  menolak status `resolved`/`accepted_with_limitation` tanpa physician sign-off.
- Laporan adjudikasi lengkap: `docs/M13_0B_DELTA_AUDIT_2026.md`.
- `docs/references/` di-ignore secara luas. Enam full-text baru sudah ada dan
  terverifikasi lokal, tetapi harus di-`git add -f` saat checkpoint agar registry
  tidak menunjuk artefak yang hilang pada clone baru.
- **Status milestone: belum exit.** Langkah berikutnya adalah physician sign-off
  atas paket resolusi, implementasi koreksi yang disetujui, lalu regresi penuh.
- Baseline pra-sign-off lulus: full suite **73 file / 804 test**, typecheck,
  production build, freeze/fingerprint **16/16**, dan `git diff --check`.
  Baseline ini wajib diulang setelah perubahan medis runtime.

## M13-0B physician adjudication dan exit (2026-07-14)

- dr. Anak Agung Bagus Wirayuda, Dokter dan penanggung jawab klinis PRIMERA,
  memberi sign-off tertulis 4/4 delta serta menyetujui waiver HT dan DM2.
- Status final: HT dan DM2 `accepted_with_limitation`; stroke dan epilepsi
  `resolved`. Seluruh 32 binding membawa physician sign-off; evidence gate
  menghasilkan `ready: true`.
- HT mendapat red-flag/kehamilan gate dan fungsi ginjal; kombinasi serta
  no-referral pasien stabil dipertahankan dengan waiver konflik redaksi sumber.
- DM dinormalisasi nonkatabolik, mendapat fungsi ginjal dan edukasi hipoglikemia
  kritis. Glibenklamid tetap non-preferred `nonPrimer` karena risiko
  hipoglikemia, bukan karena alasan palsu ketidaktersediaan.
- Stroke menjadi `Suspek Stroke Akut`/I64 sampai CT; cairan hanya kondisional,
  antitrombotik pra-pencitraan dilarang, dan target berangkat rujuk <=30 menit.
- Epilepsi dibatasi dewasa 18-30, cue menatap dan diazepam rektal wajib dihapus,
  elektrolit dasar ditambahkan, OAB tidak dimulai, dan archetype anak ditunda.
- Verifikasi final: targeted curriculum/evidence **20/20**, targeted
  pack/anamnesis/label **74/74**, full suite **73 file / 805 test**, typecheck,
  production build, dan freeze **16/16** lulus.
- `PACK` berubah sebelum infrastruktur `CONTENT_RELEASE` tersedia. Checkpoint 0B
  development-only dan tidak boleh didistribusikan ke kohort; M13-0C wajib
  menetapkan initial release + migrasi legacy sebelum aktivasi.
- Keterbatasan non-blocking: stempel `TEGAK`/`SUSPEK` belum punya expected value
  per archetype. Stroke sudah netral-subtipe lewat I64/narasi, tetapi confidence
  stamp belum dipaksa scoring; tidak membuka `clinic.ts` di milestone 0B.

## M13-0C Integrity Release (2026-07-14)

- Initial `CONTENT_RELEASE` ditetapkan ke `m13-0c-2026-07-14`; save tanpa
  field dipetakan ke konstanta `legacy-baseline` lewat migrasi khusus yang
  tidak menyentuh `tallyTermigrasi`.
- Save beda rilis dipertahankan sebagai arsip netral: Continue, impor, dan
  muat slot diblokir; ekspor JSON lama tetap tersedia sebelum mulai-baru.
- `contentRelease` masuk HMAC dossier dan dibandingkan sebelum fingerprint/
  replay. Mismatch menghasilkan `tidak_dapat_diverifikasi`.
- Blueprint 0A diproyeksikan ke runtime `PACK`; mode/release policy kini
  mengunci clinic director, tutorial, karma/pasien kembali, IGD, dan UKM.
- Pool IGD di-sort sebelum RNG; tie hari karma memakai secondary key `id`.
- Fingerprint mencakup seluruh field keputusan runtime M13. `CONTENT_RELEASE`
  tetap mekanisme terpisah dari fingerprint.
- CI desktop Windows dan generator manifest kohort + SHA-256 installer
  ditambahkan. Artifact CI 90 hari wajib disalin ke arsip institusional tahan
  lama sebelum distribusi cohort.
- `MAKS_BINAAN` tetap 16; tidak ada keluarga atau konten medis baru di 0C.
- `REVISI_ENGINE` 32 -> 33; laporan rinci ada di
  `docs/M13_0C_INTEGRITY_RELEASE.md`.
- Exit lokal lulus: **74 file / 820 test**, freeze **16/16**, typecheck,
  production build, pemeriksaan lisensi BGM, dan smoke packaging NSIS.
- Setelah checkpoint, generator dijalankan terhadap installer final dengan
  commit SHA checkpoint. Artefak itu berlabel validasi teknis, bukan cohort
  mahasiswa; tanggal distribusi nyata tetap harus diisi operator.
- **Status milestone: exit terpenuhi; M13-0D belum dimulai.**

## M13-0D Constrained Exam Blueprint (2026-07-14)

- `ExamBlueprint m13-0d-v1` mengunci 98 controlled clinic draws selama 30
  hari, seluruh 67 kasus aktif sekurangnya sekali, dan tepat 5 IGD unik.
- Delapan paket membawa pin blueprint + content release, memakai multiset
  kasus yang sama dengan urutan berbeda. Anchor paket wajib unik, tier paparan
  A, stabil, dan nonrujukan.
- Kuota exact: tier A/B/C 49/33/16; severity stable/referral/stabilization
  86/10/2; 12 rujukan; 12 safety trap; seluruh kuota kategori, eligibility
  usia, dan eligibility gender divalidasi.
- Controlled draw tidak lagi membaca Dex/Leitner, musim, kluster, daftar pasien
  kembali, atau status keluarga binaan. Follow-up, karma, dan PRB tetap
  dimainkan sebagai supplemental encounter di luar denominator 98.
- Review pra-freeze menangkap dan menutup dua behavior leak: substitusi akibat
  pasien kembali semula dapat mengubah ID kasus, dan bridge keluarga akrab
  dapat mengubah demografi controlled patient berdasarkan progres UKM.
- Cache jadwal kini memakai ID + seed + blueprint version + content release.
  Runtime fail-closed bila policy drift, sedangkan validator/CI tetap fail-loud.
- Matriks 8 paket x 32 flavor x 2 profil = **512 run** lulus dengan error nol,
  invariant lintas flavor/bot, maximum same-slot share **5,10%**, dan seluruh
  distribusi demografi di dalam toleransi yang dipra-deklarasikan.
- Target Q17 spread skor <=2/100 tetap hipotesis kalibrasi, bukan acceptance
  gate. Dampak supplemental workload tetap menunggu pilot manusia M13-1b.
- `REVISI_ENGINE` 33 -> 34; blueprint dan pin paket masuk fingerprint;
  `examBlueprint.ts` menjadi file Golden Master ke-17. `CONTENT_RELEASE` tetap
  `m13-0c-2026-07-14` karena tidak ada perubahan materi medis/pool.
- Manifest kohort naik ke schema 2 dan wajib membawa `examBlueprintVersion`.
  CI membuat report simulasi setelah packaging agar artefak tidak terhapus.
- Laporan lengkap: `docs/M13_0D_CONSTRAINED_EXAM_BLUEPRINT.md`.
- Exit lokal lulus: **75 file / 830 test**, freeze **17/17**, typecheck,
  simulasi 512-run, production build, lisensi BGM, dan smoke packaging NSIS.
  Installer validasi berukuran 102.678.168 byte; SHA-256
  `469e382cb1caa1b5fa80bd9ddc2f21ff63cc5ec952795840ec517b5d958736ac`.
- **Status milestone: exit terpenuhi; M13-1a belum dimulai.**

## M13-1a authoring checkpoint - menunggu physician review (2026-07-15)

- Draf authoring selesai untuk 6 poli + 1 IGD + 1 UKM: Nayla (diare bayi
  dehidrasi berat), Dimas (eksaserbasi asma berat anak), hipoglikemia ringan,
  benda asing hidung anak, otitis eksterna ringan, fraktur terbuka tibia,
  IGD STEMI hipoksemik, dan kunjungan Gunawan K2 untuk relapse prevention.
- Kandidat epistaksis awal dibatalkan setelah audit menemukan kasus epistaksis
  sudah aktif. Penggantinya benda asing hidung menutup gap kurikulum nyata.
- Sumber pediatrik dipisahkan eksplisit: WHO IMCI untuk Nayla; Kemenkes Asma
  FKTP + WHO Childhood Asthma 2026 untuk Dimas. Otitis ditriangulasi antara
  PPK lokal, Fornas, AAO-HNSF, dan label produk pembanding; perbedaan pilihan
  agen tidak dinormalisasi diam-diam dan menjadi keputusan dokter.
- Delapan `ContentReviewRecord` mengikat review envelope kanonik dengan
  SHA-256: encounter, katalog/ICD, topology, policy mode/release, evidence,
  metadata sumber, rewire, dan pertanyaan keputusan dokter. Daftar sumber
  tiap record diturunkan dari evidence, bukan dipelihara manual. Semua status
  `awaiting_physician_review`, semua evidence `pending`, dan tidak ada
  `PhysicianSignoff` buatan.
- Draf tetap di `src/content/curriculum/m13_1a/` dan tidak diimpor oleh
  `src/content/index.ts`. `PACK`, `CONTENT_RELEASE`, pool Karier/Ujian, karma
  Nayla/Dimas, serta dua exception mismatch lama tidak berubah.
- Seluruh calon archetype/skenario berpolicy Karier-only dan release usulan
  belum dikenal build aktif. Tiga item FKTP baru diproyeksikan menurunkan gap
  sertifikasi 99 -> 96 hanya setelah aktivasi; gap aktif tetap 99.
- Lima blocker aktivasi dicatat: engine hanya mengunci satu
  `stabilisasiWajib` meski dua kasus memerlukan bundel; UI akan menulis Nayla
  sebagai `0 tahun` karena usia runtime belum punya bulan; harga/biaya katalog
  masih placeholder authoring dan belum dikalibrasi; teknik aman ekstraksi
  benda asing belum dapat dibedakan engine dari blind probing; model rumah
  sakit belum menyimpan kemampuan PCI/fibrinolisis untuk tujuan STEMI.
- Review teknis kedua memperbaiki Plan C agar benar-benar menjadi tindakan
  bernilai, menghapus nama persona dari dialog pasien acak, mengoreksi
  diagnosis banding asma anak, mengunci penyesuaian sulfonilurea, menjadikan
  pembersihan telinga kondisional, serta menambah irigasi/nuansa Fornas pada
  fraktur. Distraktor IGD/UKM juga dinaikkan dari jawaban absurd menjadi
  near-miss yang masuk akal.
- Validator draf fail-closed terhadap collision/orphan katalog, key/id drift,
  concept aktif tertimpa, contentRef ganda, ID archetype/skenario duplikat,
  UKM yang sudah aktif, source/evidence yatim, drift registry kanonik, hash
  drift, mode/release drift, dan sign-off palsu. Gate pra-aktivasi terpisah
  sengaja tetap merah sampai blocker nol, evidence terminal, delapan sign-off
  sah, dan hash aktual tetap cocok.
- Paket keputusan dokter ada di `docs/M13_1A_PHYSICIAN_REVIEW_PACKET.md`.
- Verifikasi checkpoint: authoring **15/15**, full suite **76 file / 845 test**,
  freeze **17/17**, typecheck, production build, dan `git diff --check` lulus.
- **Status milestone: belum exit dan belum aktif.** Langkah berikutnya adalah
  physician review delapan payload serta penyelesaian/waiver blocker. Aktivasi,
  bump release, rewire karma, dan M13-1b tetap dilarang pada checkpoint ini.

## M13-RP1 — baseline resource Puskesmas dan batas scope engine (2026-07-15)

dr. Anak Agung Bagus Wirayuda, dokter dan penanggung jawab klinis PRIMERA,
menyetujui secara eksplisit keputusan M13-RP1 setelah laporan ASPAK dan triase
arsitektur diperiksa. Keputusan:

1. `sukamaju_middle_v1` diterima sebagai baseline naratif dan authoring.
2. Resource Tier A-D diterima sebagai checklist editorial, bukan state runtime;
   taksonomi ini berbeda dari authoring Tier A/B/C untuk kedalaman kasus.
3. Pada M13-1a, resource Tier C yang menjadi prasyarat jawaban benar harus
   dideklarasikan tersedia sebelum pilihan dinilai. Tidak ada hidden penalty.
4. `FacilityResourceProfile`, status `ready`/`present_not_ready`/
   `scheduled_or_shared`/`unavailable`/`unknown`, downtime dinamis, dan
   invariant resource runtime ditunda sampai sesudah M13-1b dan hanya boleh
   masuk lewat RFC/milestone engine tersendiri.
5. Kasus IGD lama tidak di-gate ulang selama M13-1a. Asumsi resource existing
   dicatat sebagai utang audit disclosure, bukan blocker pilot.
6. Scope engine hanya dibuka kembali bila playtest menemukan kebingungan
   resource, hidden penalty, atau kebutuhan gameplay regional/facility-
   management yang berulang.

Dasar verifikasi:

- lore existing menempatkan PONED sebagai jejaring berjarak sekitar satu jam
  (`desaC.ts:649-653`), bukan kapabilitas Sukamaju;
- kasus OA/LBP existing tidak mengasumsikan radiologi rutin
  (`kasusMetabolikMsk.ts:535,667`);
- `KasusIgd` dan `aksiIgd` belum memiliki resource gate; kelima kasus IGD
  mengasumsikan resource tindakannya tersedia;
- model enam entitas M13 tidak memuat `FacilityResourceProfile`;
- laporan riset yang mendasari keputusan tersedia di
  `docs/M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md` serta deliverable keputusan
  `docs/M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE_v1.1.{docx,pdf}`.

Konsekuensi change-control: keputusan ini dokumenter/editorial saja. Tidak ada
perubahan `PACK`, scoring, save, fingerprint, `CONTENT_RELEASE`, atau
`REVISI_ENGINE`. Pada saat M13-RP1 dicatat, delapan `ContentReviewRecord` masih
`awaiting_physician_review`; perubahan status berikutnya dicatat pada bagian
adjudikasi N1-U1 di bawah. M13-1a belum aktif.

## M13-1a physician adjudication N1-U1 (2026-07-15)

dr. Anak Agung Bagus Wirayuda, dokter dan penanggung jawab klinis PRIMERA,
memberikan keputusan eksplisit untuk menyetujui seluruh delapan payload M13-1a.
Ledger mencatat **8/8 `approved`**, tanpa `approved_with_waiver` pada konten:

| ID | Keputusan klinis yang dikunci |
|---|---|
| N1 | Plan C bayi sebagai tindakan komposit; stabilisasi berjalan sambil rujuk; cabang IV/NGT/transfer mengikuti WHO tanpa batas upaya IV arbitrer. |
| D1 | Target SpO2 92-95%; ipratropium 0,5 mg tiap 20 menit x3; total salbutamol nebulisasi 5 mg untuk usia 7 tahun; steroid dini, rujuk sambil terapi, dan kredit tetap 3B. |
| H1 | Rule of 15, makanan setelah pulih, review/hold atau pengurangan sulfonilurea, tidak otomatis memberi dosis berikut, dan rujuk bila tidak stabil atau berulang. |
| B1 | Satu upaya ekstraksi aman menurut bentuk, larangan blind probing/front-grasping benda bulat, serta stop rule dan rujukan eksplisit. |
| O1 | Asam asetat 2% 5 tetes 3-4 kali/hari bila membran timpani utuh; reassessment 48-72 jam; durasi berdasarkan indikasi/respons, bukan angka kaku arbitrer. |
| F1 | No-mini-washout, balut lembap-oklusif, neurovaskular, bidai, analgesia, antibiotik parenteral dini, tetanus sesuai riwayat, dan rujuk segera tanpa substitusi improvisasi. |
| I1 | EKG cepat, aspirin, oksigen terindikasi, monitoring dan transfer jejaring reperfusi; terapi antitrombotik lanjutan/nitrat/strategi reperfusi sengaja di luar skor slice. |
| U1 | Opportunity dan relapse prevention menjadi fokus K2; asesmen ketergantungan/withdrawal/farmakoterapi ditautkan ke UBM tetapi tidak wajib dimainkan atau dinilai pada kunjungan ini. |

Implementasi governance:

- reviewer: `dr. Anak Agung Bagus Wirayuda`;
- kredensial: `Dokter; penanggung jawab klinis PRIMERA`;
- tanggal sign-off: `2026-07-15`;
- seluruh `ContentReviewRecord.status` menjadi `approved`;
- seluruh `EvidenceBinding.reviewStatus` menjadi `resolved`;
- tiga konflik material (target oksigen Dimas, dosis bronkodilator Dimas, dan
  no-mini-washout fraktur) membawa physician sign-off eksplisit;
- snapshot hash menormalisasi hanya metadata pasca-keputusan, sehingga delapan
  SHA-256 tetap mengikat payload klinis pra-keputusan yang sama persis.

Persetujuan konten **bukan persetujuan aktivasi**. Lima blocker tetap terbuka:
bundel stabilisasi dan representasi dosis Dimas, tampilan usia bulan Nayla,
kalibrasi ekonomi/resource,
representasi teknik ekstraksi benda asing, dan kapabilitas tujuan reperfusi
STEMI. Karena itu `PACK`, karma, pool Karier/Ujian, `CONTENT_RELEASE`,
`REVISI_ENGINE`, save, serta fingerprint belum berubah; M13-1b belum boleh
dimulai.

## M13-1a rekonsiliasi kontradiksi dan aktivasi Career-only (2026-07-15)

Bagian ini **mensupersesi status operatif** pada checkpoint authoring dan
adjudikasi di atas tanpa menghapus audit trail-nya. dr. Anak Agung Bagus
Wirayuda menegaskan bahwa seluruh keputusan N1-U1 memang keputusan beliau,
sekaligus mengungkap bahwa beberapa rumusan menjadi kontradiktif karena
kelelahan dan cognitive overload. Untuk clone lab ini, beliau mendelegasikan
penemuan serta fiksasi kontradiksi kepada Codex dengan prioritas hasil akhir
yang dapat dimainkan; adjudikasi bolak-balik dihentikan kecuali muncul konflik
material baru atau gerbang yang sungguh memerlukan manusia.

Rekonsiliasi operatif yang dikunci:

- N1: Plan C dimulai segera sambil menyiapkan rujukan; antibiotik empiris tidak
  rutin untuk diare cair tanpa darah; bayi 3 bulan tampil dan tersimpan sebagai
  `3 bulan`, bukan `0 tahun`.
- D1: target SpO2 92-95%, salbutamol total 5 mg + ipratropium 0,5 mg tiap 20
  menit sampai tiga siklus, steroid dini, dan rujuk sambil terapi melalui
  tindakan protokol komposit.
- H1: hipoglikemia terkait glimepiride dikoreksi dan dinilai ulang, dosis
  sulfonilurea berikutnya ditahan, lalu dirujuk hari yang sama karena Sukamaju
  tidak memiliki observasi memadai untuk risiko kekambuhan berkepanjangan.
- B1: positive pressure/parent's kiss menjadi upaya awal yang dinilai; blind
  probing/front-grasping benda bulat adalah tindakan berbahaya dengan stop rule.
- O1: asam asetat otik 2% hanya pada membran timpani utuh, dengan reassessment
  48-72 jam dan rujuk bila gagal/komplikasi.
- F1: no-mini-washout; balut, bidai, akses IV, antibiotik parenteral sesuai
  protokol jejaring, tetanus, lalu rujuk segera. Irigasi/probing menjadi tindakan
  berbahaya, bukan near-miss netral.
- I1: tujuan rujukan STEMI harus memiliki fibrinolisis atau PCI primer 24/7;
  transfer tidak menunggu troponin.
- U1: kunjungan UKM tetap fokus pada opportunity, trigger, dan relapse
  prevention tanpa membebani satu encounter dengan seluruh terapi berhenti
  merokok.

Lima blocker teknis ditutup melalui dukungan bundel `stabilisasiWajib`, usia
bulan end-to-end, tindakan protokol/resource eksplisit tanpa hidden penalty,
`tindakanSalahUmum` beserta konsekuensi/skor, dan kapabilitas jejaring RS untuk
reperfusi. Slice 6 poli + 1 IGD + 1 UKM masuk `PACK` pada
`CONTENT_RELEASE = m13-1a-pilot-2026-07-15`; karma Nayla/Dimas direwire dan
semua archetype baru berpolicy Karier-only. Pool Ujian tetap tidak berubah.

**Status operatif: M13-1a selesai; M13-1b adalah satu-satunya gerbang berikut.**
M13-1b memerlukan playtest manusia/proxy, uji dangerous-path, catatan usability,
dan keputusan zero-material-defect. Bot, unit test, atau audit AI tidak boleh
menggantikan gerbang manusia tersebut.

Verifikasi final pada working tree yang sama:

- full suite: **78 file / 858 test lulus**;
- Golden Master freeze: **17/17 lulus**, `REVISI_ENGINE = 35`;
- TypeScript `tsc --noEmit`: lulus;
- `electron-vite build`: lulus;
- pemeriksaan lisensi BGM + packaging Windows `electron-builder --win --dir`:
  lulus;
- executable smoke artifact:
  `dist/win-unpacked/PRIMERA - Puskesmas Pagi.exe`;
- SHA-256 executable:
  `9775289E8E625A94493B90BDAC0E1B3A9175D29182291EA88980544FF0D8CD7C`;
- `git diff --check`: lulus.

## M13-137 compiler closure, Wave 1-21 (2026-07-19)

Wave 1-21 menyelesaikan audit mekanis lintas seluruh 137 prototipe klinik:
provenance PPK/PNPK/EBM, pemetaan Fornas dan KFA, resource realism ASPAK,
over-testing first-contact, ketepatan disposisi, serta kontrak isi anamnesis,
diagnosis, terapi, edukasi, dan debrief. Perubahan penting pada wave penutup
mencakup penghapusan lab/imaging yang tidak mengubah disposisi akut, pelabelan
diagnosis kerja yang belum terkonfirmasi, larangan regimen diuretik buta pada
sirosis dekompensata dengan ensefalopati overt, dan koreksi tiga atribusi PPK
yang tidak didukung crosswalk.

Status artefak final:

- compiler: **137 cocok / 0 perlu-koreksi / 0 tak-ada-sumber**;
- PPK: **91 direct / 15 related / 31 absent**;
- PNPK direct: **27 kasus**;
- EBM direct: **66 kasus**;
- resource Tier C/D: **47 teridentifikasi / 47 ter-grounding / 0 unresolved**;
- KFA: **67 obat terpetakan / 0 unresolved**;
- regresi: **123 file / 1191 test lulus**, freeze **18/18**, typecheck,
  pemeriksaan lisensi BGM, dan production build lulus;
- engine baseline: `REVISI_ENGINE = 53`.

**Batas keputusan tetap:** semua 137 kasus masih membawa
`activationStatus: lab_prototype_unadjudicated`, hanya tersedia pada mode
Karier lab dan tetap terisolasi dari Ujian. “Cocok” adalah hasil compiler
berbasis kelengkapan dan konsistensi sumber, bukan physician sign-off. Tidak
ada status adjudikasi yang dinaikkan secara otomatis pada wave ini.
