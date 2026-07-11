# Sumber riset UKM untuk M11 — riset selesai 2026-07-10, keputusan desain BELUM diambil

Dr. Wirayuda meminta dicatat sumber-sumber EBM/guideline/sitasi (nasional & internasional)
serta sumber inspirasi naratif untuk konten sisi UKM (Upaya Kesehatan Masyarakat) PRIMERA —
paralel dengan riset PNPK yang sudah jalan di sisi UKP ([M10_5_FIDELITAS.md](M10_5_FIDELITAS.md),
[references/pnpk/catalog.md](references/pnpk/catalog.md)). Katalog awal ditulis, lalu 12 sumber
diriset mendalam via workflow (`ukm-deep-research`, 2026-07-10, 8/8 resmi + 4/4 naratif berhasil).
**Riset sudah selesai; yang BELUM adalah keputusan desain berdasarkan riset ini** — lihat
"Yang perlu diputuskan" di bagian bawah.

Detail lengkap tiap sumber (fulltext + distillation.json) ada di
`docs/references/ukm/<slug>/`. Dokumen ini adalah ringkasan untuk dibaca cepat.

## TEMUAN PALING PENTING — DIKONFIRMASI: mekanik Posyandu PRIMERA meniru struktur pra-2023

Riset mendalam MENGONFIRMASI dugaan awal, dengan kutipan langsung dari 3 dokumen resmi:

- **KMK No. HK.01.07/MENKES/2015/2023** (Juknis Integrasi Layanan Primer/ILP, terbit 29 Agu 2023,
  272 halaman) — kata "meja" TIDAK MUNCUL SAMA SEKALI di seluruh dokumen (dicek penuh). Kutipan
  kunci: *"Penataan posyandu yang berbasis program antara lain posyandu KIA, posyandu remaja,
  posbindu PTM, posyandu lansia menjadi posyandu yang melayani seluruh siklus hidup."* Data
  fragmentasi lama yang dikutip dokumen: 301.068 Posyandu umum, 109.415 Posyandu Lansia, 18.300
  Posyandu Remaja, 79.099 Posbindu PTM — berjalan sendiri-sendiri, secara eksplisit disebut
  sebagai masalah yang diperbaiki ILP.
- **Panduan Pengelolaan Posyandu Bidang Kesehatan** (Kemenkes, terbit Agustus 2023 — PASCA-ILP,
  meski landing page Kemenkes sendiri salah cantum tanggal 2018/drift dokumentasi) — struktur
  "5 meja" klasik sudah diganti total jadi **"5 LANGKAH"** (Pendaftaran→Penimbangan/Deteksi
  Dini→Pencatatan→Pelayanan→Penyuluhan), dan tiap langkah melayani SEMUA kelompok siklus hidup
  (bumil-balita-remaja-dewasa-lansia) SEKALIGUS dalam satu sesi bulanan, bukan hari terpisah.
- **Permenkes No. 19/2024** — Puskesmas kini WAJIB terorganisasi lewat 5 klaster (Manajemen,
  Ibu-Anak, Dewasa-Lansia, Penanggulangan Penyakit Menular, Lintas Klaster); istilah "UKM esensial"
  (dari Permenkes 43/2019 lama) sudah TIDAK DIPAKAI LAGI — UKM & UKP melebur per klaster, bukan
  dua struktur terpisah seperti sebelumnya.

**Kesimpulan konkret**: mekanik `kartuPosyandu()` PRIMERA (`src/engine/kegiatan.ts`) — 4 kartu
tetap Meja 2-5 (Penimbangan/KMS/Imunisasi/Penyuluhan), sebagai SATU jenis kegiatan terpisah dari
`prolanis` — memang meniru struktur yang sudah resmi digantikan sejak Agustus 2023. Ini bukan lagi
dugaan, tapi temuan terverifikasi 3-sumber-independen. **Perlu keputusan desain** (lihat bagian
bawah), bukan riset tambahan.

**Bonus temuan**: kata "Prolanis" TIDAK MUNCUL SAMA SEKALI di KMK 2015/2023 (272 halaman, dicek
penuh) — fungsinya tampak diserap ke Klaster Dewasa-Lansia + skrining PTM tahunan di Posyandu
terintegrasi, bukan lagi mekanisme berdiri sendiri dalam kerangka resmi ILP.

## Ringkasan 8 sumber resmi (detail penuh di `docs/references/ukm/<slug>/distillation.json`)

| Sumber | Terbit | Temuan kunci utk PRIMERA |
|---|---|---|
| **KMK 2015/2023 (ILP)** | 29 Agu 2023 | Lihat di atas — dasar restrukturisasi Posyandu & 5 klaster Puskesmas |
| **Permenkes 19/2024** | 24 Des 2024 | Payung hukum ILP; kader vs nakes dipisah tegas secara hukum (Pasal 72/74) — kader edukasi/skrining/catat/rujuk, TIDAK PERNAH diagnosis/tindakan; bagus utk batas keras mekanik `delegasiKegiatan` |
| **Panduan Posyandu Kemenkes** | Agu 2023 | Struktur "5 LANGKAH" pasca-ILP (bukan 5 meja) — ganti kerangka teknis Posyandu PRIMERA |
| **Permenkes 39/2016 (PIS-PK)** | 2016 | 12 indikator sudah persis sama di kode. TEMUAN BARU: metode kunjungan rumah resmi **"SAJI"** (Salam-Ajak bicara-Jelaskan&Bantu-Ingatkan) — jauh lebih rinci dari alur 4-babak PRIMERA saat ini, termasuk prosedur resmi utk "ditolak total" & "diterima tapi terpaksa" sbg hasil SAH (bukan kegagalan), daftar gaya-komunikasi-terlarang yang lebih tajam dari "konfrontasi" generik, dan konsep **Pinkesga** (leaflet fisik bertarget-masalah — padanan literal `KartuIntervensi`) |
| **Stranas P3S 2025-2029** | Nov 2024 | Meninggalkan framing lama "gizi spesifik vs sensitif" → diganti pengelompokan by **5 kelompok sasaran** (Remaja Putri&Catin / Bumil-Busui-Nifas / Anak 0-23bln / Anak 24-59bln / Rumah Tangga) dgn target cakupan numerik eksplisit (Tabel 9) — bisa langsung jadi rubric skor modul gizi/stunting |
| **Panduan 25 Keterampilan Kader** | 2023 | Daftar 25 keterampilan literal per kelompok siklus-hidup + jenjang kompetensi resmi (Purwa/Madya/Utama) — kerangka presisi utk bias/ketelitian kader di `kader.ts` (penyuluhan=hafalan=akurat; pengukuran fisik LiLA/tensi=lebih rawan salah, sesuai dokumen sumber) |
| **Panduan Prolanis BPJS** | ~2014-2019 | 4 kanal resmi terpisah (Konsultasi/Edukasi Klub+"Duta PROLANIS"/Reminder SMS/Home Visit dgn kriteria spesifik) + target agregat 75% peserta terkontrol — PRIMERA saat ini melebur semua jadi 1 kartu keputusan, belum granular per-kanal |
| **WHO CHW Guideline 2018 + Astana Declaration** | 2018 | 15 rekomendasi berbasis-bukti (seleksi/pelatihan/sertifikasi, supervisi suportif bukan punitif, integrasi sistem — kader BUKAN pengganti murah nakes); Astana: people-centred/multisectoral/community-participation — kerangka filosofis utk skenario "keterlibatan komunitas vs top-down" |

## Ringkasan 4 sumber naratif — nilai inspirasi RENDAH-SEDANG, semua sebagai bumbu bukan plot utama

| Sumber | Bisa diakses gratis? | Verdict |
|---|---|---|
| *Semua Menjadi Satu* (dr. Arry Pongtiku, dokter PTT Sulteng 1990an + suku Korowai Papua) | Tidak (403) | Tema besar cocok (dokter baru berimprovisasi di lapangan minim sumber daya, penyakit terabaikan/kusta-frambusia-filariasis dgn stigma) tapi teks tak terverifikasi — pakai sebagai bumbu tone, bukan kutipan literal |
| *Kesaksian Seorang Dokter* (dr. Khalid Al-Jubair, bedah jantung Riyadh) | Ya (resensi+kutipan) | Setting RS tersier Arab Saudi, genre dakwah/mukjizat — TIDAK relevan langsung; hanya motif "coping lewat iman" (pasien bilang "insya Allah") berpotensi jadi flavor-text religius-kultural ringan |
| *My Medical Story* (antologi 31 kisah nakes Indonesia) | Tidak (eBook berbayar, metadata saja) | Nada emosional umum (kecemasan dokter, dilema bidan) berpotensi jadi tekstur dialog, tapi tak ada detail Puskesmas/PIS-PK spesifik yang terverifikasi |
| Memoar dr. Rusdhy Hoesein (Puskesmas Parang, Magetan → sejarawan) | Tidak (buku berbayar) | Kerangka karier (FK→Puskesmas kecamatan→pimpin→promosi RSUD) otentik & bisa jadi pola arc NPC senior/easter egg nama, tapi tak ada anekdot klinis terverifikasi gratis |

**Kesimpulan naratif**: tidak ada satu pun dari 4 sumber ini yang layak jadi tambang cerita
literal — semuanya paling banter bumbu atmosfer minor. Tidak direkomendasikan membeli buku
berbayar manapun demi keperluan ini kecuali ada minat baca pribadi Dr. Wirayuda di luar konteks
PRIMERA.

## Peta konten UKM PRIMERA saat ini

- **Kegiatan lapangan terjadwal** (`src/engine/kegiatan.ts`, `state.ts`, `reducer.ts`,
  `surveilans.ts`): 3 jenis — **posyandu** (4 kartu tetap gaya klasik, bisa didelegasikan ke
  kader), **prolanis** (1 kartu/peserta kronis HT/DM, drift bulanan, hanya peserta JKN aktif),
  **respons KLB** (3 kartu, dipicu ambang cluster kasus menular 14 hari).
- **16 keluarga binaan** (`src/content/keluarga/desaA–F.ts`): 4 babak per kunjungan (observasi
  hotspot → wawancara MI/OARS dgn gerbang kejujuran → diagnosis hambatan COM-B → resep sosial),
  target 12 indikator PIS-PK, mekanik karma (diabaikan → komplikasi klinis muncul di poli UKP).
- **PIS-PK** (`src/engine/pispk.ts`, `kader.ts`): 12 indikator kanonik persis Permenkes 39/2016.
- **Skor UKM** (`scoring.ts`): `(0.5×iksDesa + 0.25×rasioKunjungan + 0.25×kualitasMi)×35 − penalti`.
- **UKM PRIMERA saat ini NOL sitasi EBM/guideline player-facing** — beda total dgn UKP yg sudah
  berlapis (`clue`/`konsekuensi.guideline`/M11 `mutiaraEbm`/`catatanRealita`). Tipe
  `KeluargaBinaan`/`SkenarioKunjungan`/`KartuKegiatan` belum punya slot field utk sitasi sama
  sekali. Riset ini genuinely mulai dari nol, bukan reconciliation seperti PNPK di UKP.

## Yang perlu diputuskan (keputusan desain Dr. Wirayuda, bukan riset lanjutan)

Riset sudah cukup matang utk 3 keputusan konkret — masing-masing butuh opsi diajukan sebelum
implementasi, pola sama seperti keputusan M10.5 lainnya:

1. **Modernisasi mekanik Posyandu**: ganti kerangka "4 meja tetap" jadi "1 Hari Buka Posyandu
   bulanan melayani semua siklus hidup sekaligus" (sesuai 5-LANGKAH pasca-ILP)? Atau
   dipertahankan sbg penyederhanaan gameplay yang disengaja? Kalau diperbarui: mekanik `prolanis`
   kemungkinan perlu dijembatani/dilebur ke sesi Posyandu Klaster Dewasa-Lansia, bukan berdiri
   sendiri (sesuai temuan kata "Prolanis" tak ada di ILP resmi).
2. **Field sitasi UKM**: rancang slot field baru (analog `mutiaraEbm`/`catatanRealita` di UKP)
   utk `KeluargaBinaan`/`SkenarioKunjungan`/`KartuKegiatan` sebelum konten sitasi bisa ditambah.
3. **Kedalaman granularitas Prolanis**: pecah "sesi Prolanis" generik jadi 4 kanal resmi
   (Konsultasi/Edukasi Klub-Duta PROLANIS/Reminder SMS/Home Visit-kriteria-spesifik), atau
   biarkan sederhana seperti sekarang?

Kandidat pengayaan konten konkret lain (tak butuh keputusan struktural, tinggal ditulis kalau
giliran M11-UKM tiba): babak "Ingatkan" (penutup wajib tiap kunjungan keluarga binaan, dari
metode SAJI Permenkes 39/2016), 2 hasil sah baru di babak wawancara (ditolak-total &
diterima-terpaksa, bukan cuma berhasil/gagal biner), taksonomi gaya-dialog-terlarang yang lebih
rinci dari "konfrontasi", jenjang kompetensi kader (Purwa/Madya/Utama) sbg progression system,
target agregat 75% Prolanis terkontrol & Tabel-9 Stranas sbg KPI musiman di Lokakarya Mini.

**Masih murni keputusan tertunda — belum ada yang diimplementasikan.** Proses lanjutan
(implementasi field baru, penulisan konten keluarga binaan baru, dst) menunggu giliran &
prioritas eksplisit dari Dr. Wirayuda.
