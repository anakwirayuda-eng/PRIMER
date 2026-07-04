# DEEPTHINK — Triangulasi Desain: UX "Edukasi Pasien" (tembok tombol)

> **Untuk:** DeepThink (reviewer strategis desain-pedagogi, bukan auditor kode)
> **Peran:** CODEX memeriksa *apakah kode/konten benar* (forensik, read-only).
> Kamu memeriksa *apakah keputusan desainnya benar*. Output = PENILAIAN,
> REKOMENDASI berperingkat, dan trade-off eksplisit — bukan daftar bug, bukan kode.
> **Tanggal:** 2026-07-03 · Basis: HEAD branch `claude/vigorous-bose-f66bc6`
> (commit `e80fd43`), folder `primer-desktop/`.
> **Pemicu:** keluhan playtest langsung dari pengembang (dokter, pemain pertama):
> *"yg tombolisasi utk edukasi pasien ini kok bener2 gak enak ya secara UIUX"* —
> plus temuan CODEX UI: panel terapi `scrollHeight` ±5758px untuk viewport isi
> ±642px, dan seksi Edukasi terkubur PALING BAWAH di bawah formularium obat.

---

## 0. KONTEKS 90 DETIK (baca dulu, jangan lompat)

PRIMER = game desktop Electron, *"Football Manager-nya kedokteran komunitas
dengan hati Harvest Moon"*. Pemain = dokter fresh-grad, stase 90 hari (atau Mode
Ujian 30 hari) di Puskesmas desa. Pemakai target: ±50 mahasiswa FK Indonesia yang
**DINILAI dari skor game** (redeploy ±September 2026) → integritas pedagogis &
asesmen adalah kepentingan produk, bukan hiasan. Dev = solo (Dr. Wirayuda) + AI.

Loop klinik per pasien ("Lembar Periksa", satu lembar SOAP): Anamnesis (deck
pertanyaan, gauge Sabar) → Pemeriksaan fisik → Lab (hasil besok) → Diagnosis
(banding → tegak/suspek, stempel kalibrasi) → **Terapi (resep obat + EDUKASI ←
subjek dossier ini)** → Disposisi (pulang/rujuk/rawat). Engine murni deterministik
(`src/engine/`), action-log = sumber skor, 172 test. Semua konten dari
`ContentPack` (`src/content/`), divalidasi `validasiPack` fail-fast.

Status milestone: M0–M5 + M4.5 (Mode Ujian dua-seed) SELESAI. Sisa: M6 (kelas &
dosen: rekomputasi skor dari action-log, dossier mahasiswa ber-checksum), M7
(polish; sudah antre: rebalance skor SUSPEK/IGD pasca-playtest, label pembicara
kunjungan, anamnesis branching, axis penilaian konseling KB), M8 (Arena multiplayer).

## 1. HIERARKI PRIORITAS (jangan dibalik saat menilai)

integritas pedagogis > integritas asesmen/anti-bocor > retensi/usability > fun kasual.

Dengan catatan: keluhan ini datang dari **pemain-dokter sungguhan pada hari
pertama bermain** — kalau dokter yang paham isinya saja tersiksa, mahasiswa yang
sedang belajar akan lebih tersiksa; friksi UI di fitur yang dinilai = ancaman
retensi DAN validitas asesmen (skor jadi mengukur stamina scanning, bukan
kompetensi konseling).

## 2. POTRET MEKANIK SAAT INI (fakta, sudah diverifikasi dari kode)

### 2a. UI (`src/renderer/src/screens/klinik/DeckTerapi.tsx`)

Panel kanan fase Terapi berisi, berurutan dari atas: (1) Formularium — daftar
obat + kotak cari toleran-ejaan; (2) **"Edukasi Pasien" — SEMUA 38 topik**
dirender sebagai chip-tombol toggle, urut alfabet, tanpa cari, tanpa grup,
tanpa prioritas, di bawah formularium yang panjang. Klik = toggle centang.
Hint satu baris: *"Pilih topik yang relevan dengan kasus — edukasi termasuk
komponen penilaian."*

Temuan CODEX (runtime): `scrollHeight` panel ±5758px vs area terlihat ±642px —
edukasi ada di dasar sumur scroll ±9 layar. Mudah terlewat total (pemain bisa
menyelesaikan pasien tanpa pernah TAHU seksi edukasi ada).

### 2b. Skoring (`src/engine/clinic.ts` — `nilaiEncounter`)

```
skorEdukasi = clamp( 100 × (tercakup / wajib) − 10 × takRelevan, 0, 100 )
bobot dalam skor encounter: BOBOT_EDUKASI = 0.1   (anamnesis/dx/terapi lebih besar)
```
- "Wajib" = `kasus.tatalaksana.edukasi` (2–5 topik, modus 3–4; lihat 2c).
- Penalti shotgun −10/topik-tak-relevan SUDAH ada (anti "centang semua").
- Feedback baru terasa di skor akhir encounter (grade pasien) — tidak ada
  feedback instan per topik (konsisten keputusan lama: tanpa feedback instan
  per aksi, biar kalibrasi diuji, bukan trial-and-error).

### 2c. Data konten (dihitung dari 67 kasus poli; IGD & kunjungan rumah TIDAK
memakai mekanik ini — kunjungan punya "resep sosial" terpisah)

Distribusi jumlah topik wajib per kasus: 1 topik ×2 kasus · 2×8 · 3×25 · 4×30 · 5×2.

Frekuensi pemakaian topik (total 38 topik; 18 di `katalog.ts` + 20 `katalogM3.ts`):

| Kelompok | Topik (frekuensi) |
|---|---|
| **"4 sakti" generik** | tanda_bahaya (28), kepatuhan_obat (22), kontrol_rutin (19), cuci_tangan (16) |
| Menengah | kebersihan_kulit (12), gizi_seimbang (12), istirahat_cukup (10), aktivitas_fisik (10), minum_air_cukup (8), higiene_tidur (8), manajemen_stres (6) |
| Ekor panjang (≤5) | 17 topik: etika_batuk, hindari_alergen, kompres_demam, oralit, P4K, ergonomi, dst. |
| **Sekali pakai (1×)** | 9 topik justru yang paling khas-klinis: teknik_inhaler, latihan_bppv (Epley/Brandt-Daroff), diet_purin, posisi_tidur_gerd, minum_oat_tuntas+PMO, kenali_kambuh_jiwa, hindari_pencetus_migrain, asi_eksklusif, anc_rutin |

### 2d. Masalah yang MUNCUL dari data itu (analisis kami — silakan bantah)

1. **Strategi degenerate "4 sakti"**: klik buta tanda_bahaya + kepatuhan_obat +
   kontrol_rutin + cuci_tangan tiap pasien → sering 50–100% cakupan dengan
   penalti kecil. Ini bukan konseling; ini farming. (Hitung cepat: kasus wajib
   {tanda_bahaya, kepatuhan_obat, kontrol_rutin} → strategi buta dapat 100−10=90.)
2. **Topik kaya-pedagogi tenggelam**: 9 topik sekali-pakai (inhaler, Epley,
   purin…) — justru materi konseling paling "kedokteran" — tersembunyi di
   tembok alfabetis; menemukannya = latihan scanning, bukan recall klinis.
3. **Kembar-konfusabel**: "Kenali & hindari pencetus (debu, dingin, asap)" [asma]
   vs "…pencetus alergi" vs "…pencetus migrain (…)"; "Kompres hangat saat demam"
   vs "Kompres hangat kelopak mata"; "Kontrol rutin sesuai jadwal" vs "Kontrol
   rutin PTM & cegah komplikasi" vs "Kenali tanda kekambuhan & pentingnya
   kepatuhan" vs "Kepatuhan minum obat". Pemain memilih-antara-kembar berdasarkan
   ejaan, bukan konsep — dan kembar ini lahir dari kebutuhan konten (edukasi
   spesifik-kasus), bukan dari taksonomi yang dirancang.
4. **Interaksi × frekuensi**: ±4–8 pasien/hari × 30–90 hari; tiap pasien =
   scroll 9 layar + scan 38 chip. Friksi kumulatif justru di fitur berbobot
   TERKECIL (10%) — rasio effort/reward paling buruk di seluruh game.
5. **Terkubur** (CODEX P2): edukasi di bawah formularium → banyak pemain tidak
   akan pernah menyentuhnya; skor edukasi mereka acak-nol, mencemari asesmen.

## 3. PRINSIP & KEPUTUSAN LAMA YANG MENGIKAT (konsistensi!)

1. **Anti-bocor UI**: UI tidak boleh membocorkan jawaban. Preseden keras: semua
   pilihan diagnosis banding HARUS bernama setara (baru saja diperbaiki commit
   `79795df` + guard test); layar IGD dulu bocorkan diagnosis → ditutup (CODEX
   M3b P1). Konsekuensi: **"tampilkan hanya topik relevan-kasus" = bocor** —
   subset kecil per kasus praktis menunjuk jawaban.
2. **Tanpa feedback instan per aksi** (keputusan panel desain awal): centang
   topik tidak boleh langsung bilang benar/salah.
3. **Engine murni + action-log**: `TAMBAH_EDUKASI`/`HAPUS_EDUKASI` tercatat di
   action-log (M6 akan rekomputasi skor dari log). Perubahan UI murni = aman;
   perubahan mekanik skor = migrasi test + guard anti-regresi.
4. **Anti-walkthrough Mode Ujian** (keputusan M4.5): asesmen harus tahan
   "walkthrough WhatsApp angkatan". Catatan penting kami: daftar topik wajib
   per kasus SUDAH bocor-able via walkthrough hari ini (konten statis per kasus)
   — pertahanannya adalah variasi kasus per paket ujian, bukan kerahasiaan
   jawaban per kasus. Jadi jangan menilai opsi HANYA dari "walkthrough-proof"
   yang memang mustahil sempurna.
5. **Determinisme dua-seed**: apa pun yang di-randomisasi (mis. urutan opsi,
   distraktor) HARUS dari `seed` flavor per-mahasiswa ATAU `seedKurikulum` per
   paket — putuskan yang mana, karena berbeda konsekuensi keadilan antar-mahasiswa.
6. **Identitas visual**: "arsip Puskesmas yang dirawat dengan sayang" — kertas,
   stempel, deck. Solusi jangan berubah jadi dropdown-birokratis tanpa rasa.

## 4. RUANG OPSI (peta kami — nilai, gabung, atau tolak; usulkan yang lebih baik)

**O1 — Polish murni-UI (tanpa sentuh engine/skor):** kelompokkan 38 topik ke
5–7 kategori bertajuk (Gaya Hidup & Pencegahan · Kepatuhan & Kontrol ·
Diet/Nutrisi · Higiene & Infeksi · KIA · Muskuloskeletal & Fisik · Jiwa & Tidur),
kotak cari toleran-ejaan (fondasi `normalisasiNamaObat` sudah ada), baki
"terpilih (n)" sticky, dan pindahkan Edukasi dari dasar sumur scroll (tab
"Resep | Edukasi" di panel yang sama, atau seksi kolaps-persisten). Biaya: kecil
(1 sesi). Risiko: kategorisasi itu sendiri petunjuk lemah (lihat §3.1) — apakah
level "kategori" masih di sisi aman anti-bocor?

**O2 — Cari-dulu (recall > recognition):** default hanya kotak cari + topik
terpilih; mengetik memunculkan kandidat (fuzzy). Argumen pedagogis: konseling
nyata = *mengingat* apa yang perlu disampaikan, bukan *mengenali* dari daftar.
Risiko: frustrasi bila kosakata pemain ≠ nama topik (kami baru saja menambal
masalah persis ini di pencarian obat); butuh sinonim per topik.

**O3 — Dek kandidat per kasus (recognition terkurasi):** engine menyusun ±10–12
kartu = topik wajib + distraktor plausible (seeded, dari kategori serumpun).
Plus: scan cost turun drastis, distraktor bisa dirancang mendidik (kembar-
konfusabel jadi soal!). Minus: menabrak keras prinsip anti-bocor #1 (eliminasi
mudah), mengubah konstruk asesmen dari recall-38 → recognition-12, dan
walkthrough-nya jadi trivial ("pilih 4 ini"). Kalau direkomendasikan, jelaskan
kenapa pelanggaran prinsip ini layak — atau desain mitigasinya.

**O4 — "Resep Edukasi" prioritas-3 (ubah konstruk):** pemain menulis maksimal 3
topik terpenting (slot terbatas) — memaksa prioritisasi seperti konseling nyata
(waktu dokter FKTP terbatas!). Perubahan skor: dari coverage-set → precision@k.
Konten perlu menandai prioritas per kasus (67 kasus × kurasi ulang). Paling
"jujur pedagogis", paling mahal konten.

**O5 — Naikkan taruhannya sekalian:** kalau UX diinvestasikan (O1–O4), apakah
bobot 10% masih pantas? Alternatif: edukasi mempengaruhi *dunia* (kepatuhan
pasien kronis → drift keluarga binaan → karma) bukan cuma angka — sudah ada
jalur `kepatuhan` di engine keluarga. Ini menyulap edukasi dari "ceklis nilai"
jadi "investasi dunia" (filosofi Harvest Moon). Biaya: sedang–besar, M7+.

**O6 — Perbaiki taksonomi konten dulu (prasyarat semua opsi):** merger/rename
kembar-konfusabel, pangkas 38 → ±30 topik ortogonal, tambah `kategori` +
`sinonim` ke `TopikEdukasi`. Murni konten + `validasiPack`; tidak mengubah skor
(id lama di-alias). Hampir pasti perlu — bantah kalau tidak.

**Kombinasi default yang kami condongi (bantah bila keliru):
O6 → O1 (+cari dari O2 sebagai pelengkap, bukan pengganti) sekarang di M7-awal;
O4/O5 dipertimbangkan pasca-playtest 5–10 mahasiswa.** Alasan: memperbaiki 80%
sakit dengan 20% biaya, nol perubahan konstruk asesmen sebelum ada data playtest,
konsisten semua prinsip §3.

## 5. PERTANYAAN STRATEGIS (jawab bernomor, tegas, dengan alasan)

**Q1 — Konstruk yang diukur.** Untuk kompetensi "edukasi & konseling pasien"
level UKMPPD/SKDI di FKTP: apa yang VALID diukur game turn-based — (a) recall
(cari/tulis), (b) recognition (pilih dari daftar), (c) prioritisasi (top-3),
(d) cakupan-set seperti sekarang? Mana yang *hidden curriculum*-nya paling
sehat? (Ingat: anamnesis kami pakai deck recognition juga — konsistensi antar-fase
vs diferensiasi per-kompetensi?)

**Q2 — Batas anti-bocor.** Di spektrum "38 topik telanjang" ↔ "hanya topik
relevan", di titik mana petunjuk struktural (kategori bertajuk, hasil cari,
jumlah slot) berubah dari *scaffolding pedagogis yang sah* menjadi *kebocoran
jawaban*? Beri kriteria operasional yang bisa kami pakai untuk memutuskan kasus
serupa berikutnya (ini pertanyaan prinsip, bukan cuma kasus ini).

**Q3 — Strategi degenerate "4 sakti".** Dengan formula sekarang (coverage −
10×takRelevan, bobot 10%), seberapa serius lubang "klik 4 topik generik tiap
pasien"? Perlu ditambal di formula (mis. bobot topik ~ 1/frekuensi, atau penalti
naik utk pola berulang), di konten (kurangi ketergantungan pada topik generik),
di UI (slot terbatas O4), atau dibiarkan (noise 10% tidak layak kompleksitas)?

**Q4 — Penempatan dalam flow.** Edukasi sekarang menumpang di fase Terapi,
di bawah formularium (CODEX: terkubur 9 layar). Layakkah edukasi jadi langkah
eksplisit sendiri (mis. sesudah resep, sebelum disposisi — cermin "konseling
sebelum pasien pulang" di alur nyata), dengan trade-off +1 klik LANJUT_FASE per
pasien × ratusan pasien? Atau cukup tab/reposisi dalam fase Terapi?

**Q5 — Urutan pengerjaan & risiko jadwal.** Solo dev; sisa: M6 (kelas/dosen,
kontrak asesmen), M7 (polish), M8 (Arena); target kelas ±September 2026; per
keputusan lama, rebalance skor menunggu data playtest. Paket mana yang masuk
M7-awal vs pasca-playtest vs tidak-sama-sekali? Secara khusus: apakah MENGUBAH
KONSTRUK skor edukasi (O4/O5) sebelum playtest perdana = kesalahan metodologis
(mengubah instrumen sebelum baseline), atau justru wajib sebelum instrumen
dipakai menilai 50 orang?

**Q6 — Tembok tombol sebagai pola.** Keluhan "tombolisasi" mungkin bukan cuma
edukasi: deck anamnesis (±10–14 kartu pertanyaan/kasus, ber-kategori), lab
(±15 item), formularium (60+ obat, sudah ada cari). Apakah ada prinsip interaksi
umum yang harus kami tetapkan untuk SEMUA "pilih-dari-katalog" di game ini
(ambang jumlah item → wajib cari/grup/slot?), supaya perbaikan edukasi tidak jadi
tambalan lokal yang inkonsisten dengan fase lain?

## 6. FORMAT OUTPUT YANG DIMINTA

1. **Verdikt per Q1–Q6** — bernomor, tegas (pilih, jangan "tergantung"), alasan
   ≤1 paragraf per verdikt, sebut trade-off yang kamu korbankan.
2. **Paket rekomendasi final** — komposisi opsi (O1–O6 / gabungan / opsi barumu)
   dibagi: (a) kerjakan sekarang (M7-awal, sebelum playtest), (b) setelah data
   playtest, (c) jangan dikerjakan + alasan.
3. **Risiko tertinggi** yang kami belum sadari dari rekomendasimu (steelman
   serangan terhadap dirimu sendiri).
4. Jika menyentuh skor: rumus konkret pengganti + cara migrasi test/action-log.
5. Singkat > lengkap-basa-basi. Bahasa Indonesia. Jangan tulis kode.

## 7. LAMPIRAN — RUJUKAN FILE (untuk verifikasi klaim kami)

- UI: `src/renderer/src/screens/klinik/DeckTerapi.tsx` (seksi "Edukasi Pasien"),
  `Klinik.css` (`.klinik-eduk`, struktur scroll `.klinik-deck__isi`).
- Skor: `src/engine/clinic.ts` `nilaiEncounter` §edukasi (±baris 384–394,
  `BOBOT_EDUKASI = 0.1` baris 56).
- Katalog: `src/content/katalog.ts` (`EDUKASI`, 18), `src/content/katalogM3.ts`
  (`EDUKASI_M3`, 20). Kontrak: `src/content/types.ts` (`TopikEdukasi`,
  `Tatalaksana.edukasi`).
- Preseden anti-bocor: `docs/AUDIT_EBM_KASUS.md` §Ronde 3, `ROADMAP.md`
  §Triangulasi M3b (IGD bocor diagnosis), commit `79795df`.
- Keputusan seed & anti-walkthrough: `docs/M45_MODE_UJIAN.md`.
- Temuan CODEX UI (scrollHeight 5758px, kontras, reduced-motion): tertangani
  sebagian di commit `e80fd43`; sisa keputusan struktural = dossier ini.
