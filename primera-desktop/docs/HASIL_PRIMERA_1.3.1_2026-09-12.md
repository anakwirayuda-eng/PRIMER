# PRIMERA 1.3.1 — hasil implementasi dan audit lokal

Permintaan dokter: eksekusi perbaikan/upgrading, versi 1.3.1, dan sasaran **kualitas tiap aspek UKM >8/10**. Jawaban klarifikasi menegaskan bahwa ini bukan perintah menaikkan nilai mahasiswa. Laporan ini mencatat kode yang benar-benar berubah dan batas buktinya; tidak memberi nilai kualitas baru atas pekerjaan sendiri.

## Basis yang dapat dibandingkan

Folder aktif `D:\Dev\PRIMER\PRIMERA 1.3.1`, cabang `codex/primera-1.3.1`, adalah worktree dari `D:\Dev\PRIMER-CODEX-lab`. Basis `6e9f17c` dan enam commit Lab 2 sudah disatukan dengan cherry-pick. Tiga dosier Fable ikut dicatat pada commit `dc2c7b4`.

Perubahan baru:

| Commit | Isi |
| --- | --- |
| `18c9753` | Observasi, provenance, perencanaan dan rekap UKM, riwayat kabar, reflow peta/HUD |
| `3ba9ed0` | Debrief sesuai encounter, ekspor data konsultasi dan ringkasan episode |
| `55df61b` | Identitas 1.3.1, launcher, verifikasi browser dan Electron |

Pengelompokan commit mengikuti jalur runtime bersama; bukan satu commit untuk setiap nomor PK di usulan brief. Folder Lab 2 lama tidak diubah. Tiga dosier yang belum di-commit pada checkout sumber tetap dibiarkan utuh. Cabang baru memiliki hubungan ke riwayat sumber; tidak dibuat repo independen ketiga.

## Perubahan yang dirasakan pemain

| Paket rujukan | Hasil |
| --- | --- |
| PK-0 | Perbaikan kartu Kegiatan yang sudah ada di Lab 2 ikut terintegrasi; tes anti-bocor tetap lulus. |
| PK-1 | Hotspot gembok dan piala Slamet tidak bertabrakan; dua koordinat Ketut disesuaikan dengan objek pada ilustrasi. Penanda statis terlihat sebelum klik, tersedia tombol titik amatan bernomor, petunjuk dan hitungan temuan. Nama/temuan tidak dibuka sebelum klik. |
| PK-2 | Lapisan Kemajuan IKS menampilkan selisih terhadap acuan awal tersimpan. Nilai negatif tetap terlihat; tidak dilabeli perubahan harian. Mendung mengikuti penurunan terhadap acuan, dengan gerbang cakupan data. Kartu keluarga membedakan data lengkap, data terverifikasi, laporan kader, janji, dan data belum tersedia. Warna klasifikasi petak tetap memakai aturan lama. |
| PK-3 | Sasaran Posyandu per RW: keluarga dan kolom KIA yang masih berlaporan kader. Hanya tiga indikator yang memang dicakup mesin; tidak menjanjikan semua kolom selesai dalam satu sesi. |
| PK-4 | Nama kader pada pengirim surat yang semula anonim, kepala RW, dan konteks wilayah peringatan. Tidak membuka ketelitian atau pola bias internal kader. |
| PK-5 | Kepala Kegiatan menyebut RW/kampung/hari. Papan penyelidikan menjelaskan catatan yang masih tersedia, pengulangan kunjungan, identitas yang tidak lengkap, dan batasnya sebagai data 14 hari; tidak mengaku sebagai kurva epidemi atau register lengkap. |
| PK-6 | Rekap tiap keputusan menyebut dokter/delegasi dari cuplikan transaksi sesi. Koreksi laporan kader menampilkan kolom yang benar-benar diverifikasi dan berubah. Setelah reload, pelaksana yang tidak disimpan dilabeli tidak tercatat, bukan ditebak dari action-log. |
| PK-7 | Lokmin membedakan penyakit sasaran di luar RW fokus dan penyakit di luar program. Kunci program dijelaskan sebagai kalender bulanan. Fokus program terlihat pada panel RW. Rapor menampilkan sesi Posyandu/Prolanis dan KLB tuntas, dengan penjelasan bahwa KLB tuntas bukan tambahan poin langsung. Tidak mengarang jumlah slot historis yang kosong. |
| PK-8 | Kalender Prolanis mengikuti hari sesi aktual, periode 30/10 dan akhir stase 90/30. Ada peringatan saat menunda satu hari menghilangkan kesempatan sesi. Slot/stamina/peserta tetap syarat, bukan dijanjikan tersedia. |
| PK-9 | Label gaya percakapan dipindah ke refleksi sore. Sambungan narasi generik berbasis efek trust dihapus, sedangkan narasi lanjutan eksplisit tetap dipakai. Kandidat keluarga diurut menurut kebutuhan; tooltip binaan menjelaskan risiko bila lama tak ditindaklanjuti. |
| PK-10 | Penundaan umpan balik kesalahan tidak dijalankan: keputusan pedagogis tetap terbuka. Tidak mengubah jadwal kunjungan ulang. |
| PK-11 | Landasan Resmi pertama terbuka, berikutnya bisa dilipat berdasarkan identitas stase. Sumber tetap dapat dibuka. Tas Kunjungan langsung menuju keluarga. Id indikator di beberapa narasi diterjemahkan ke label. Toast Buku Saku membedakan kasus di luar katalog. Denyut penanda peta dihapus agar kontras stabil. |
| PK-12 | Debrief menunjukkan temuan PF yang terlewat sesuai varian encounter. Biaya lab diberi label biaya katalog, tidak disamakan dengan pemotongan kas. PDF memakai Lembar Periksa dan disposisi yang tercatat; tidak melengkapi hasil atau dosis dari kunci kasus. Episode lama menyediakan ringkasan, bukan rekam medis rekonstruksi. |
| Tambahan UX | Kabar Sukamaju dapat menampilkan kembali episode selesai dan membedakan berakhir tanpa pemulihan. Ini arsip kabar yang sudah ada, bukan kejadian atau kontrafaktual baru. Pada teks besar, peta memakai satu alur gulir dan HUD berbaris agar tidak bertumpuk. |

Tidak seluruh butir opsional PK-11/13 dijalankan. Taksonomi ulang edukasi, mode latihan bebas, kesan pertama pasien, rename kader, narasi baru pasca-tuntas, kunci MI/resep sosial, dan perubahan mesin masuk daftar keputusan/pekerjaan lanjutan; tidak dianggap selesai oleh tabel ini.

## Tujuh keadaan

`I` = implemented, `W` = wired, `V` = verified. **Built dalam format brief berarti installer**, dibedakan dari build runtime yang sudah tersedia.

| Kelompok | I | W | V / bukti | Built (installer) | Installed | Committed | Pushed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PK-0 terintegrasi | Ya | Ya | Regresi anti-bocor pada suite | Belum | Belum | Ya | Belum |
| PK-1/2/3/4/5/6/8 dan reflow | Ya | Ya | Unit/paritas engine + interaksi browser, sumber UKM juga diuji di Electron | Belum | Belum | Ya | Belum |
| PK-7 | Ya | Ya | Tes Lokmin dan helper; panel peta dicek browser. Rapor baru belum diaudit visual terpisah | Belum | Belum | Ya | Belum |
| PK-9/11 | Sebagian lingkup brief | Ya | Tes kunjungan/navigasi + observasi browser + sumber Electron; refleksi sore belum playtest percakapan penuh | Belum | Belum | Ya | Belum |
| PK-12 | Ya | Ya | Unit snapshot/varian/anti-rekonstruksi, klik ekspor Electron, PDF dirender dan dibaca | Belum | Belum | Ya | Belum |
| Arsip kabar selesai | Ya | Ya | Tes komponen pergantian aktif/selesai; belum playtest akhir stase penuh | Belum | Belum | Ya | Belum |
| PK-10, perubahan konten/mesin PK-13 | Tidak | Tidak | Tidak diterapkan | Tidak | Tidak | Tidak | Tidak |

Build runtime desktop `out/` lulus dan launcher tersedia. Tidak ada pemasangan installer atau publikasi rilis yang dilakukan.

## Verifikasi yang benar-benar dijalankan

- Baseline Lab 2 lama: typecheck 0 error; 1.735 tes lulus / 182 berkas.
- Setelah implementasi: typecheck 0 error; **1.750 tes lulus / 187 berkas**, termasuk freeze. Setelah perapian CSS/copy/PDF, **160 tes terkait / 29 berkas** kembali lulus. Perubahan terakhir setelah itu hanya skrip QA dan laporan.
- Electron build: lulus; JS **3,83 MiB**, CSS sekitar **216 KiB**, batas tetap 4 MiB / 320 KiB.
- **6 tes Electron lulus**: boot dan pengaturan, debrief IGD gelap 200%, sumber UKM, pagar informasi kasus formatif, persistensi IGD setelah tutup/buka, unduhan PDF melalui UI.
- **12 checkpoint browser**: judul, peta kemajuan, Prolanis, hotspot Slamet pada tiga lebar, Posyandu, delegasi, koreksi kader, KLB, peta gelap 200% dan panel RW gelap 200%. Axe WCAG 2 A/AA dan 2.1 A/AA: nol pelanggaran terdeteksi pada checkpoint, nol `pageerror`. Bukan sertifikasi seluruh aplikasi.
- Hotspot Slamet: uji `elementFromPoint` pada pusat empat tombol di 1.000/1.280/1.440 piksel serta klik nyata. Lebar 1.280 pada teks 200%: kelompok HUD tidak bertumpuk, peta tidak diperas dan tidak ada scrollbar horizontal global.
- Tes Posyandu memakai 24 seed dan transaksi engine untuk memastikan indikator kandidat UI sama dengan indikator yang benar-benar bisa diverifikasi, bukan hanya salinan assert atas implementasi UI.
- Rekam medis contoh: PDF A4, satu halaman, diunduh dari UI Electron. Teks dan PNG hasil Poppler diperiksa; field yang tidak dikerjakan tetap kosong/berlabel belum diperiksa. Nomor RM tampilan menggunakan hash yang sama dengan Lembar Periksa.
- `git diff --exit-code 6e9f17c -- primera-desktop/src/engine primera-desktop/src/content`: kosong. **REVISI_ENGINE = 72**, **CONTENT_RELEASE = sapuan-ulasan-bulk-2026-08-23**.

Log lokal ada di `primera-desktop/verify-131-*.log`. Bukti browser: `test-results/primera-131/report.json` dan PNG di folder yang sama. Bukti Electron: `test-results/e2e/`. File hasil pengujian tidak dimasukkan ke source; salinan ringkasan browser dicatat bersama laporan ini.

Saat QA, skrip pertama gagal karena selector judul, asumsi label sumber lama, serta `page.waitForEvent('download')` yang tidak memotret unduhan native Electron. Pengujian diperbaiki untuk menunggu event native `will-download`/`done` dan membaca berkas `%PDF-` sungguhan. Satu pengujian fixture browser juga diulang setelah restart server Vite karena referensi modul fixture tertinggal setelah HMR. Kegagalan tersebut tidak disamarkan sebagai pengujian hijau.

## Sasaran kualitas >8/10

Nilai lama berikut berasal dari dosier Fable, bukan hasil ukur build baru.

| Aspek / nilai lama | Perubahan yang mendukung kenaikan | Yang masih harus dibuktikan |
| --- | --- | --- |
| Gameplay 5,5 | KIA operasional, kalender sesi, prioritas keluarga, keputusan dan delegasi dapat ditelusuri | Pilihan terasa berarti selama satu stase; hubungan skor kegiatan tetap dibatasi mesin lama |
| Visual 6,5 | Hotspot jelas, kartu keputusan lebih dekat, peta kemajuan, sumber data berbeda, reflow 200% | Penilaian visual pemain pada ragam layar dan seluruh keluarga |
| Keasikan 5,5 | Identitas kader, konteks wilayah, kabar selesai tetap bisa dibaca | Tempo pekan 6–13 dan variasi setelah arc habis; belum ada konten kampanye baru |
| Presisi 6,5 | Provenance, batas data KLB, kalender per mode, atribusi delegasi dan RM tidak dikarang | Audit dokter terhadap framing MI dan konten yang memang masih menunggu adjudikasi |
| Beban kognitif 5,5 | Sumber dilipat, navigasi langsung, target dan konsekuensi terlihat di tempat keputusan | Playtest tugas tanpa bantuan dan waktu pencarian; taxonomy edukasi besar belum dirombak |

Kriteria audit berikutnya: pemain dapat menemukan keluarga prioritas, menjelaskan asal data/Δ, memilih sasaran Posyandu, merencanakan sesi Prolanis, membedakan delegasi dan keputusan sendiri, serta membaca tindak lanjut selesai tanpa bantuan. Untuk menyatakan setiap aspek >8, minta penilaian ulang pada build ini setelah tugas tersebut dan bagian akhir stase dimainkan. Angka lama tidak ditimpa dengan angka optimistis.

## Batas yang sengaja dipertahankan

Tidak mengubah skor formal, kunci jawaban, probabilitas kader, stamina, uang, ambang KLB, jeda kunjungan, atau daftar kasus teradjudikasi. Nilai Posyandu/KLB dan aturan pedagogis lanjut memerlukan keputusan spesifik, bukan disimpulkan dari permintaan meningkatkan kualitas UX.

Cuplikan rekap dan encounter hanya hidup pada sesi UI, bukan tambahan skema save. Setelah reload, identitas pelaksana detail tidak ditebak; RM lengkap dari encounter yang sudah hilang tidak direkonstruksi. Tampilan desktop tetap memakai direktori save Lab 2 untuk kesinambungan; QA memakai direktori sementara dan konteks browser terpisah.
