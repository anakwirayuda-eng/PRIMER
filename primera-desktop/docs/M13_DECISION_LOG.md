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
