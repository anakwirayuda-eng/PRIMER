# PRIMERA — CODEX Lab 2

Versi pengembangan **1.3.0-lab2.1 · Sukamaju Berkisah**.

Klik dua kali **MULAI CODEX Lab 2.cmd** untuk memainkan build desktop yang sudah disiapkan. Jalankan dari folder ini; launcher memakai dependensi dan build milik Lab 2.

## Yang berubah

- **Kabar Sukamaju:** episode aktif muncul di meja kerja, diurutkan berdasarkan jadwal. Pemain bisa membaca sinyal awal, keputusan, kabar terakhir, dan membuka keluarga terkait.
- **Peta keputusan:** lapisan cakupan data, tindak lanjut, dan sinyal kluster. Pencarian nama, roster, surat, dan album membawa pemain ke kartu keluarga yang tepat, termasuk fokus keyboard dan pengguliran.
- **Album Keluarga:** ilustrasi rumah dan riwayat episode yang sudah terjadi. Hasil yang buruk tetap ditulis sebagai hasil buruk; tidak dianggap pemulihan.
- **Buku Lapangan:** temuan yang sudah diamati dan ucapan yang sudah didengar dapat disaring, lalu dua catatan dibaca berdampingan selama kunjungan. Ini alat berpikir, tanpa stempel benar/salah atau tambahan skor.
- **Papan penyelidikan KLB:** daftar pasien tercatat, perbandingan RW, kunjungan ulang, dan grafik hari pertama tercatat. Grafik ini bukan kurva onset gejala. Catatan tanpa identitas ditandai keterbatasannya.
- **Pembahasan kegiatan:** kartu, opsi, warna jawaban, dan nomor langkah tetap merujuk pertanyaan yang baru dijawab. Autosave tetap terjadi segera. Kartu berikutnya baru terlihat setelah pemain melanjutkan.
- **HUD laptop:** navigasi dan sumber daya mendapat baris terpisah untuk mencegah tabrakan ketika teks diperbesar.

## Asal salinan dan penyimpanan

Basis: `D:\Dev\PRIMER-CODEX-lab`, commit `6e9f17c15465d50e19b95a2dc7a0d1374275471d`, PRIMERA 1.2.0. Folder asal tidak diedit. Versi FABLE yang ditemukan lebih lama; basis pengembangan memakai CODEX lab terbaru tersebut.

Source, konten, aset, dokumen, data pendukung, konfigurasi, dan lockfile disalin. Arsip Git lama, dependensi lama, hasil build lama, cache, laporan tes, konfigurasi agen, dan folder backup/log tertentu tidak ikut dalam salinan awal. Dependensi desktop kemudian disalin secara mandiri, dan build Lab 2 dibuat ulang. Daftar pengecualian rinci dan pemeriksaan hash tersedia di `LAB2_COPY_AUDIT.json`.

Repositori Git Lab 2 berdiri sendiri pada branch `lab2/development`. Commit `cac7cff` menyimpan baseline salinan sebelum upgrade.

Save desktop: `%APPDATA%\PRIMERA CODEX Lab 2\saves`. Save versi lama tidak dimigrasikan otomatis. Browser preview memakai port 5202 dan namespace `primer.lab2.save.*`. Pembaruan dari feed rilis utama tidak ditawarkan oleh Lab 2.

## Mencoba fitur

1. Mulai stase atau gunakan fitur impor arsip yang sudah tersedia bila ingin mencoba salinan progres lama. Arsip yang diimpor mengikuti pemeriksaan kompatibilitas bawaan.
2. Peta dan album tersedia saat Peta Desa terbuka, mulai hari 2. Roster dan kolom pencarian dapat dipakai untuk menemukan keluarga.
3. Kabar Sukamaju muncul setelah ada episode aktif. Album memakai keluarga binaan dan episode yang sudah tercatat; tidak mengarang riwayat untuk keluarga baru.
4. Saat kunjungan rumah, buka **Buku Lapangan**, lalu pilih maksimal dua catatan.
5. Ketika sinyal kluster dan syarat kegiatan KLB terpenuhi, mulai respons dari peta. Papan penyelidikan muncul di sebelah kartu keputusan.

## Pengembangan dan pemeriksaan

Di folder `primera-desktop`:

```text
npm ci                  # hanya bila dependensi perlu dipasang ulang
npm run dev             # desktop dengan hot reload
npm run dev:browser     # http://127.0.0.1:5202
npm run typecheck
npm test
npm run build
npm run test:e2e
node scripts/lab2-preview-check.cjs  # jalankan ketika dev:browser aktif
```

Hasil verifikasi terakhir ada di `LAB2_VERIFICATION.md`. Screenshot dan fixture QA memakai sesi uji terpisah; tidak menjadi data bawaan permainan.

## Batas versi ini

Aturan penilaian, konten klinis, peluang kader, progres kampanye, dan engine simulasi tetap memakai basis 1.2.0. KLB masih mempunyai tiga keputusan inti; papan investigasi menambah konteks dan cara membaca bukti, belum menjadi simulasi wabah baru. Posyandu dan Prolanis mendapat perbaikan alur pembahasan dan keterlihatan episode, belum mendapat sistem mekanik baru.

Pilihan dua catatan dalam Buku Lapangan merupakan keadaan tampilan selama kunjungan. Setelah aplikasi ditutup, temuan dan percakapan dapat direkonstruksi dari save, tetapi pilihan perbandingan perlu dipilih kembali.

Langkah lanjutan yang layak diprototipe: keputusan investigasi berdasarkan pola kasus yang bervariasi, pembagian tugas Posyandu, tindak lanjut Prolanis antarsesi, dan dilema sumber daya desa. Semua itu memerlukan desain mekanik serta pengujian keseimbangan tersendiri.
