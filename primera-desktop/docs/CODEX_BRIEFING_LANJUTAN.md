# CODEX_BRIEFING_LANJUTAN.md — briefing lanjutan + strategi baru + tugas aktif

**Ditulis**: 2026-07-17, oleh sesi Claude (Fable) yang sama yang mengerjakan gelombang M11
REVISI_ENGINE 41. **Baseline saat ditulis**: branch `codex-gpt56-experiment`, working tree bersih,
commit terakhir `c65dc78`, `npx vitest run` → **86 file test, 966 test, semua hijau**,
`npm run typecheck` bersih, `REVISI_ENGINE = 41` (`src/engine/verifikasi.ts:578`).

Ini BUKAN dokumen pengganti `CODEX_HANDOFF_DOSSIER.md` (778 baris, ditulis 2026-07-13) — dokumen
itu tetap berlaku penuh untuk §0 (isolasi folder eksperimen), §1-2 (identitas proyek & mekanik
inti), §3 (arsitektur teknis, 3 hukum inti, freeze-bucket router), §6 (ketegangan peran read-only
vs builder), §7 (disiplin verifikasi), §8 (jebakan yang sudah terbukti), §9 (riwayat M0-M14
padat), §10 (konteks tambahan) — SEMUA masih akurat, baca dokumen itu dulu kalau Anda belum.
Dokumen INI hanya: (a) memperbarui fakta yang sudah basi di sana (§5.6 khususnya — status
"STILL OPEN" sudah tidak benar), (b) mengumumkan perubahan STRATEGIS dalam cara Anda dan Dr.
Wirayuda/Claude bekerja sama, dan (c) memberi Anda antrean tugas konkret sekarang.

---

## 0. Perubahan strategis — bacaan wajib, ini alasan dokumen ini ada

Dr. Wirayuda baru saja menetapkan **arahan baku baru** untuk kolaborasi proyek ini ke depan
(disampaikan langsung, 2026-07-17, bukan tebakan/interpretasi):

> "Kamu (Claude/Fable) jadi otaknya, CODEX jadi anak buah/pesuruh/agentic/kaki tangan untuk
> pekerjaan-pekerjaan berat dan/atau pekerjaan dengan token/kuota besar."

Konkretnya:

- **Claude/Fable** = orkestrator & pengambil keputusan. Menerjemahkan permintaan Dr. Wirayuda
  jadi keputusan desain/scope, memverifikasi hasil, menjaga disiplin proses (freeze-dance,
  test-first, grounding EBM), dan menulis/memperbarui dokumen briefing seperti ini.
- **CODEX (Anda)** = tangan eksekusi untuk pekerjaan yang **berat atau boros token/kuota** —
  terutama: sapuan konten berskala besar (menulis puluhan/ratusan string konten yang masing-masing
  butuh dibaca-groundkan), audit mekanis lintas banyak file, atau pekerjaan berulang yang
  polanya sudah didesain tapi butuh banyak "jam tangan" untuk dieksekusi.
- Ini **arahan tetap** (standing), bukan sekali pakai untuk tugas ini saja — berlaku untuk sesi
  CODEX berikutnya juga, selama masih di lab eksperimen ini (`codex-gpt56-experiment`).
- **Yang TIDAK berubah**: semua batasan §6 dokumen lama tetap berlaku penuh — Anda tetap TIDAK
  memutuskan sendiri hal yang genuinely butuh judgment medis/desain/pedagogis (usulkan opsi,
  jangan putuskan), tetap WAJIB verifikasi ulang klaim lama vs kode nyata, tetap test-first,
  tetap tak pernah push ke `master`/branch produksi. "Tangan eksekusi" berarti Anda mengerjakan
  LEBIH BANYAK dengan otonomi lebih besar dalam RUANG yang sudah digariskan — bukan bahwa
  pagar-pagar proses lama dicabut.
- Kalau Anda (instance CODEX manapun yang membaca ini di masa depan) menemukan pekerjaan besar
  lain yang cocok pola "berat/boros token" tapi TIDAK ada di antrean §2 di bawah — jangan mulai
  sendiri, laporkan balik dulu (lihat §3) supaya Claude/Dr. Wirayuda bisa triase & assign resmi.

---

## 1. Apa yang berubah sejak dossier lama ditulis (2026-07-13 → 2026-07-17)

Dossier lama, §5.6, mencatat 3 hal sebagai **"STILL OPEN"**: keputusan slot sitasi UKM (#2),
granularitas Prolanis (#3), dan adopsi SAJI. **Ketiganya sudah diadjudikasi Dr. Wirayuda dan
SUDAH diimplementasikan** dalam gelombang REVISI_ENGINE 41 di atas. Juga, §5.3 mencatat M11 item
2/4/5 sebagai "belum dispesifikasi, JANGAN mereka-reka" — item **#4 dan #5-B1 sudah dispesifikasi
DAN dibangun**; #2 (storylet) sebagian dibangun (A2); sisanya (#3 A3, #6, #7-riset) masih belum
digarap, lihat §2.3.

9 commit baru sejak dossier lama (`b3b7e58` → `c65dc78`, semua di `codex-gpt56-experiment`):

| Commit | Isi |
|---|---|
| `b3b7e58` | Mekanik engine "variasi presentasi Tingkat-A" (#4) — `VarianPresentasiTingkatA`, `kasusEfektif`, seleksi RNG di `director.ts`. REVISI_ENGINE 40→41. |
| `5cde066` | Fix: `variasi` (suara persona) tak lagi menggugurkan override varian; sidik jari pack jadi sensitif thd STRUKTUR varian (id list), tapi kebal thd TEKS varian. |
| `1a26a56` | Fase 1 UKM: slot sitasi Decision #2 (schema saja) + label SAJI di layar Kunjungan (adopsi Permenkes 39/2016). |
| `7d1d8ce` | **Konten** #4 — 40 kasus/79 varian (dari workflow adversarial-verified) + mekanik #5-B1 (kunjungan Tingkat-A: `VarianKunjunganTingkatA`, `skenarioEfektif`, dll). |
| `be3095a` | Lapisan penerapan varian-kunjungan ke katalog + `KartuKegiatan.sumber?` (slot sitasi kegiatan). |
| `ae71097` | A2 — storylet Debrief Malam (atmosfer, non-REVISI, murni renderer). |
| `34b8652` | D3-lite — rotasi naratif 4 kanal Prolanis (BPJS 4-kanal resmi vs realita ILP 2023). |
| `ff335e8` | B2 — pool narasi kartu KLB verifikasi & 5W1H. |
| `c65dc78` | Dok: B3 (variasi suara surat kader) ternyata SUDAH terpenuhi kode lama, tak perlu kerja baru; + tabel status eksekusi. |

**Dokumen kunci yang HARUS Anda baca sebelum mulai kerja** (jangan re-derive dari nol):
- `docs/M11_LANJUTAN_KEPUTUSAN_TERPADU.md` — dossier keputusan Bagian A-F (storyline, variasi
  UKM, sitasi, Prolanis, SAJI, M13-103) + tabel "STATUS EKSEKUSI" di akhir. Ini sumber kebenaran
  untuk "apa sudah diputuskan, apa masih terbuka."
- `docs/M11_VARIAN_TINGKAT_A_HASIL.md` — ringkasan per-kasus hasil workflow #4 (40 kasus).
- `src/content/varianKunjunganTingkatAData.ts` — **CEK STATUS FILE INI DULU** sebelum menyentuh
  apa pun terkait #5-B1 (lihat §2.0 di bawah, penting).

---

## 2. Antrean tugas — urutan prioritas

### 2.0 — Status #5-B1 (varian-kunjungan Tingkat-A): SELESAI-PARSIAL, JANGAN dilengkapi sendiri

Update 2026-07-17 malam: `src/content/varianKunjunganTingkatAData.ts` sudah terisi + ter-commit
(`70d56fd`), tapi cakupannya **PARSIAL secara sengaja, bukan bug** — dari 16 skenario yang jadi
target (bukan 27 seperti perkiraan awal), hanya **9/16 lolos verifikasi adversarial** (3 penuh
2/2 varian, 6 sebagian 1/2 varian); **7/16 gagal verifikasi total** (0 varian, alasan spesifik
per-skenario ada di `docs/M11_VARIAN_KUNJUNGAN_TINGKAT_A_HASIL.md`). Ini bukan pekerjaan yang
"belum sempat" — 7 skenario itu SUDAH dicoba dan draf/repair-nya gagal lolos 2 lensa adversarial
(kontradiksi ground-truth MI, pelanggaran field terkunci, dll). **Jangan menambah varian sendiri
untuk 7 skenario yang gagal itu** — itu butuh pipeline draf+verifikasi yang sama (tooling
orkestrasi Claude), bukan sesuatu yang aman ditulis manual tanpa lensa adversarial yang setara.
Kalau Dr. Wirayuda memutuskan untuk mengejar cakupan penuh nanti, itu akan jadi tugas Claude lagi
(atau di-assign eksplisit ke Anda dengan instruksi baru) — jangan berinisiatif sendiri di area
ini. Lanjut ke §2.1, yang independen dari status B1.

### 2.1 — PRIORITAS UTAMA ANDA: tulis konten sitasi resmi (UKM Decision #2, "C2 penuh")

**Ini tugas inti yang di-assign ke Anda** — sapuan konten besar, cocok pola "berat/boros token."

**Yang sudah ada (schema, sudah di-commit, TIDAK perlu Anda ubah)**:
- `SkenarioKunjungan.panduanResmi?: string` (`src/content/types.ts`) — field display-only,
  paralel dgn `KasusKlinis.panduanResmi` yang sudah lama ada di sisi UKP.
- `KartuIntervensi.sumber?: string` dan `KartuIntervensi.pinkesga?: string` (`types.ts`).
- `KartuKegiatan.sumber?: string` (`src/engine/state.ts`).

Semua 4 field ini **"Ember Hijau"** (freeze-bucket router, lihat `CODEX_HANDOFF_DOSSIER.md` §3)
— display-only, TIDAK dibaca `sidikJariPack`/`scoring.ts`/`clinic.ts`/`reducer.ts` untuk skor
atau replay. **Konsekuensi penting: menulis isi field-field ini TIDAK butuh unfreeze-dance sama
sekali** — bukan file beku, bukan REVISI_ENGINE bump, cukup isi teksnya dan jalankan test biasa.

**Tugas Anda**: isi keempat field itu dengan teks sitasi/panduan resmi yang ASLI (bukan
placeholder, bukan karangan) untuk seluruh 27 skenario kunjungan (16 keluarga) dan kartu
intervensi/kegiatan UKM yang relevan.

**Langkah kerja yang disarankan**:
1. **Inventarisasi dulu, jangan langsung menulis.** Baca `docs/UKM_SUMBER_RISET_M11.md` (indeks
   riset UKM) dan `ls docs/references/ukm/` untuk melihat topik apa saja yang SUDAH ada
   `distillation.json`-nya (riset yang sudah didistilasi dari sumber primer — Posyandu ILP 2023
   sudah confirmed migrated per catatan lama, mungkin ada topik lain). Buat tabel silang: 16
   keluarga × topik kunjungan/kartu vs sumber-tersedia/tidak-tersedia, SEBELUM menulis satu
   kalimat sitasi pun. Ini mencegah Anda mengarang sitasi utk topik yang sumbernya tak ada.
2. **Urutan prioritas grounding** (aturan baku proyek ini, `feedback_ebm_realistis_priority_rule`
   dan `CODEX_HANDOFF_DOSSIER.md` §3): PPK 1186/2022 dan PNPK terkini = **lantai wajib**
   (mandatory floor), bukan plafon. Untuk sitasi UKM spesifik: Permenkes 39/2016 (formula IKS,
   sudah dipakai `kader.ts`), Pedoman ILP 2023 (Posyandu, sudah termigrasi), Juknis Prolanis
   BPJS (4 kanal resmi, sudah dipakai `kegiatan.ts` gelombang D3-lite), Fornas 1199/2025 utk
   obat. Kalau riset EBM lebih baru mau dipakai menggantikan yang lama, WAJIB sertakan kutipan
   sumbernya di teks sitasi itu sendiri — bukan diam-diam.
3. **Untuk topik yang TAK ADA sumber ter-distilasi**: JANGAN mengarang dari ingatan pelatihan
   umum. Opsi: (a) tandai sebagai "perlu sumber" di sebuah dokumen kerja sementara dan lewati
   dulu, kerjakan topik yang sumbernya ada; (b) kalau topiknya penting & sumbernya jelas ada di
   dunia nyata tapi belum ada di repo (mis. dokumen resmi Kemenkes/BPJS yang belum diunduh),
   laporkan balik (§3) daripada menebak isinya.
4. **Test-first tetap wajib** meski field ini display-only — bukan utk "membuktikan fix," tapi
   utk mengunci INTEGRITAS SITASI ke depan: tambahkan test (kemungkinan di `pack.test.ts` atau
   file baru `citations.test.ts`) yang menjamin invarian struktural minimal, misalnya "tiap
   skenario kunjungan yang py `panduanResmi` terisi, teksnya bukan string kosong/placeholder"
   dan/atau "tiap kartu dgn `sumber` terisi mencantumkan tahun/nomor dokumen yang bisa
   ditelusuri." Desain test detailnya terserah Anda (ini bukan mekanik replay, jadi tak ada pola
   baku yang harus ditiru persis) — tapi JANGAN klaim tugas ini "selesai" tanpa test yang
   membuktikan sesuatu, bukan cuma test yang selalu hijau apa pun isinya.
5. **Verifikasi akhir**: `npx vitest run` (harus ≥966 tetap hijau + test baru Anda), `npm run
   typecheck` bersih. TIDAK perlu `freeze.test.ts`/`REVISI_ENGINE` bump (lihat alasan Ember Hijau
   di atas) — kalau Anda mendapati diri Anda mengedit `HASH_DIBEKUKAN` utk tugas ini, STOP,
   itu tanda Anda salah menyentuh file yang seharusnya tak perlu disentuh utk pekerjaan
   display-only ini.
6. Commit dengan pesan gaya proyek ini (`feat(m11-ukm): ...`), JANGAN push.
7. Perbarui tabel "STATUS EKSEKUSI" di `docs/M11_LANJUTAN_KEPUTUSAN_TERPADU.md` (tandai C2 dari
   "schema done, konten belum" jadi selesai) dan tulis ringkasan singkat cakupan (berapa
   skenario/kartu yang dapat sitasi vs yang dilewati krn sumber tak ada) di dokumen yang sama
   atau dokumen baru `docs/M11_SITASI_UKM_HASIL.md` (pola sama dgn `..._HASIL.md` lain).

### 2.2 — DITAHAN, jangan mulai tanpa greenlight eksplisit baru

- **E-2 (SAJI Fase-2)**: babak "Ingatkan" baru, 2 outcome kunjungan baru (ditolak-total/
  diterima-terpaksa), perluasan taksonomi gaya-terlarang. Ini gelombang unfreeze TERPISAH
  (`docs/M11_LANJUTAN_KEPUTUSAN_TERPADU.md` Bagian E) — JANGAN dicampur ke gelombang rev-41 yang
  sekarang kalau gelombang itu sudah ter-tag/dirilis sebagai Golden Master baru saat Anda
  membaca ini (cek: apakah ada tag `golden-master-*` baru di `git tag` yang menunjuk ke commit
  ≥`c65dc78`?). Kalau belum ter-tag, tetap tunggu instruksi eksplisit sebelum mulai — ini murni
  soal urutan kerja, bukan soal sudah/belum disetujui.
- **M13 103-kasus sisa adjudikasi** (Bagian F): ini PEKERJAAN Dr. Wirayuda sendiri (adjudikasi
  medis), bukan tugas CODEX atau Claude. Kalau diminta, Anda boleh menyiapkan ARTEFAK bantu
  (tabel gap, draft opsi) tapi jangan mengadjudikasi sendiri.
- **M11 #3 (A3)**, **#6**, **#7-riset** — 3 sisa dari daftar 7 item M11 kreatif yang belum
  digarap sama sekali. Belum ada scope/desain concrete utk ini (beda dgn #2/#4/#5 yang sudah
  didesain sesi ini). Jangan improvisasi scope-nya sendiri.

### 2.3 — Kalau §2.1 sudah selesai semua dan tak ada instruksi baru

Jangan mencari-cari pekerjaan lain sendiri di luar §2.2. Laporkan selesai (§3) dan tunggu
antrean berikutnya — dossier ini akan diperbarui Claude begitu ada tugas baru yang di-assign.

---

## 3. Cara melapor balik

Ikuti pola operasi proyek ini yang sudah konsisten sejak awal (`CODEX_HANDOFF_DOSSIER.md` §6):
**usulkan opsi dgn tradeoff jelas, JANGAN putuskan sendiri** untuk apa pun yang genuinely butuh
judgment medis/desain/pedagogis. Untuk pelaporan status/hasil kerja, dan khususnya untuk
mengurangi bolak-balik verifikasi yang lambat: **kalau temuan Anda mekanis** (mis. sitasi yang
salah kutip nomor dokumen, field kosong yang seharusnya terisi) — **perbaiki langsung**, jangan
tanya dulu. Tandai hanya kontradiksi yang genuinely butuh keputusan klinis/desain baru sebagai
item terpisah yang perlu diadjudikasi. Laporan akhir cukup: apa yang selesai, cakupan (berapa
dari berapa), apa yang dilewati & kenapa, commit hash, hasil test/typecheck.

Selamat bekerja. Dokumen ini akan diperbarui (oleh Claude) setiap kali antrean tugas berubah —
kalau Anda instance CODEX yang membaca ini di sesi berikutnya, cek dulu commit terbaru pada
`docs/CODEX_BRIEFING_LANJUTAN.md` sendiri (git log -- docs/CODEX_BRIEFING_LANJUTAN.md) untuk
memastikan Anda membaca versi yang masih current, bukan cache lama.
