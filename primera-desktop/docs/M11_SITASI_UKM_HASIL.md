# M11 UKM C2 - Hasil Implementasi Sitasi Player-Facing

Tanggal: 17 Juli 2026

Repo: `D:/Dev/PRIMER-CODEX-lab/primera-desktop`

Branch: `codex-gpt56-experiment`

## Ringkasan eksekutif

C2 kini tersedia secara fungsional di gameplay tanpa menyentuh engine beku:

- 27/27 skenario kunjungan rumah mendapat panduan PIS-PK/SAJI/ILP yang spesifik terhadap indikatornya.
- 89/89 kartu resep sosial mendapat landasan program dan padanan Pinkesga resmi.
- Seluruh kartu Posyandu, Prolanis, dan respons KLB mendapat sitasi pasca-jawaban.
- Sitasi baru muncul setelah pemain mengambil keputusan agar tidak menjadi bocoran jawaban atau menambah beban kognitif sebelum waktunya.
- Tidak ada perubahan skor, replay, `REVISI_ENGINE`, atau hash file beku.

## Sumber yang dipakai

| Lapisan | Sumber | Penggunaan |
|---|---|---|
| PIS-PK, SAJI, Pinkesga | Permenkes RI No. 39 Tahun 2016, Lampiran I | 12 indikator keluarga sehat, SAJI, kunjungan tindak lanjut, dan daftar 12 Pinkesga |
| Integrasi layanan primer | KMK RI No. HK.01.07/MENKES/2015/2023 | Jejaring Puskesmas-Pustu-Posyandu-kunjungan rumah; missing service, ketidakpatuhan, tanda bahaya, dan PWS |
| Posyandu | *Panduan Pengelolaan Posyandu Bidang Kesehatan*, Kemenkes RI, Agustus 2023 | Lima langkah pelayanan untuk seluruh siklus hidup |
| Tata kelola Puskesmas/KLB | Permenkes RI No. 19 Tahun 2024 | Klaster P2PL, surveilans, respons penyakit menular, dan jejaring pelaporan |
| Prolanis | *Panduan Praktis PROLANIS* BPJS Kesehatan No. 06, dokumen era 2014-2019 | Konsultasi, edukasi klub, reminder, home visit, dan target program; dibaca dalam konteks transisi ILP 2023 |

Sumber regulasi utama diverifikasi kembali melalui portal resmi JDIH Kemenkes,
peraturan.go.id, peraturan.bpk.go.id, dan Ayosehat Kemenkes. Teks Prolanis
menyatakan tahun terbit tidak tercantum; implementasi tidak menyamarkannya
sebagai pedoman 2026.

## Cakupan Pinkesga

Nama paket mengikuti daftar literal Permenkes 39/2016: Keluarga Berencana,
Pemeriksaan Kehamilan, Imunisasi, ASI Eksklusif, Penimbangan Balita,
Tuberkulosis, Hipertensi, Kesehatan Jiwa, Bahaya Merokok, Sarana Air Bersih,
Jamban Sehat, dan Jaminan Kesehatan Nasional. Skenario dua indikator menampilkan
dua paket yang relevan, bukan membuat nama paket gabungan baru.

## Resolusi kontradiksi hash

Briefing menyebut field sitasi UKM non-hash. Kode aktual berbeda:
`sidikJariPack()` di `src/engine/verifikasi.ts` memasukkan `k.arc` secara
wholesale, dan komentarnya secara eksplisit menyatakan `panduanResmi` UKM ikut
ter-hash. Probe test-first membuktikan injeksi satu `panduanResmi` inline saja
mengubah fingerprint.

Karena mandat C2 juga melarang perubahan engine beku dan bump
`REVISI_ENGINE`, sitasi ditempatkan di registry konten `ukmCitations.ts`,
dipetakan dari ID/indikator, lalu dibaca langsung oleh renderer. Field schema
tetap didukung sebagai override bila kelak hash keluarga diproyeksikan per-field
dalam gelombang unfreeze tersendiri. Pendekatan non-enumerable atau mutasi objek
runtime sengaja tidak dipakai karena rapuh dan sulit diaudit.

## Delivery ke pemain

1. Kunjungan rumah: setelah memilih resep sosial, pemain melihat Pinkesga dan landasan sumber kartu terpilih.
2. Hasil kunjungan: modal debrief menampilkan panduan resmi skenario yang selesai.
3. Kegiatan lapangan: setelah menjawab kartu, umpan balik memuat satu blok landasan resmi sebelum tombol lanjut.
4. Modal hasil diberi batas tinggi dan gulir agar teks sitasi tidak memotong tombol pada layar pendek.

## Batas klaim dan gap sumber

Semua kartu memperoleh landasan indikator/program, tetapi teks sumber secara
eksplisit menyebut bentuk operasional kartu sebagai adaptasi gameplay, bukan
mandat kata-per-kata pedoman. Ini penting untuk mekanisme yang belum memiliki
sumber spesifik terdistilasi di corpus:

- rincian pemicuan STBM, deklarasi ODF, arisan/talangan jamban;
- alur administratif PBI/Jampersal dan subsidi lokal;
- bentuk dukungan komunitas seperti testimoni penyintas, grup sebaya, atau kontrak keluarga;
- format 5W1H sebagai rubrik kartu KLB;
- praktik Prolanis kontemporer setelah adopsi ILP, karena dokumen BPJS yang tersedia tidak mencantumkan tahun terbit dan istilah Prolanis tidak muncul di KMK ILP 2023.

Tidak ada klaim spesifik baru yang dikarang untuk menutup gap tersebut. Jika
mekanisme itu kelak hendak diajarkan sebagai standar resmi, sumber program
khusus perlu ditambahkan dan direview terpisah.

## Pagar regresi

Test baru mengunci:

- inventaris tetap 27 skenario dan 89 kartu intervensi;
- semua panduan/sumber terlacak ke dokumen bernomor atau bertahun dan bebas placeholder;
- semua kartu intervensi punya padanan Pinkesga;
- mapping Posyandu/Prolanis/KLB lengkap tanpa mengedit generator engine;
- registry tidak memutasi `PACK` atau fingerprint;
- injeksi inline ke arc memang terdeteksi sebagai perubahan hash;
- sitasi resep sosial, debrief kunjungan, dan debrief kegiatan benar-benar dirender setelah keputusan.

Verifikasi akhir: 20/20 test fokus lulus; full suite 88 file, 976/976 test
lulus; typecheck bersih; dan `freeze.test.ts` tetap 17/17. Production build
juga dijalankan sebelum commit checkpoint.
