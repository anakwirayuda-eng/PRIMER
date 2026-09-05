# Verifikasi CODEX Lab 2 — 5 September 2026

Build yang diperiksa: **PRIMERA CODEX Lab 2 1.3.0-lab2.1**.

| Pemeriksaan | Hasil |
| --- | --- |
| Baseline sebelum perubahan | 176 file tes, 1.701 tes lulus |
| Reproduksi sebelum perbaikan | 7 tes gagal sesuai dua bug; 1 tes remount lulus |
| Seluruh unit/integration test sesudah perubahan | 180 file tes, **1.713 tes lulus** |
| TypeScript | `npm run typecheck` lulus |
| Build produksi dan anggaran bundle | Lulus; JS 3,80 MiB, CSS 215,3 KiB |
| Electron E2E | **4/4 lulus**, termasuk tema gelap dan teks 200% |
| Playtest browser fitur Lab 2 | Lulus: meja → keluarga, lapisan peta, album, KLB, buku bukti, tema gelap/140% |
| Aksesibilitas otomatis enam permukaan baru yang diperiksa | Tidak ada pelanggaran yang dilaporkan Axe |
| Error JavaScript selama playtest browser | Tidak ada |
| Peluncuran dari folder package | Nama, versi, dan direktori profil QA sesuai |
| Salinan file | 1.575 file basis tersedia; tidak ada yang hilang |
| Engine, konten, dan aset desktop | **227 file identik SHA-256** dengan sumber |
| Sumber asli | Git status bersih, HEAD tetap `6e9f17c15465d50e19b95a2dc7a0d1374275471d` |

Regresi yang diuji mencakup tiga jenis kegiatan, jawaban benar/salah, kartu awal/tengah/akhir, autosave sebelum pembahasan, remount, perpindahan roster dan album, deduplikasi pasien surveilans, batas dua bukti, serta prioritas episode.

Dua tes lama yang mengunci salinan teks UI disesuaikan dengan label dan tooltip baru; perlindungan terhadap duplikasi nama keluarga dan penargetan kartu tetap dipertahankan.

## Bukti lokal

- `primera-desktop/lab2-baseline-tests.log`
- `primera-desktop/lab2-regression-direct-red.log`
- `primera-desktop/lab2-full-tests.log`
- `primera-desktop/lab2-typecheck.log`
- `primera-desktop/lab2-build.log`
- `primera-desktop/lab2-desktop-e2e.log`
- `primera-desktop/lab2-preview.log`
- `primera-desktop/test-results/lab2-preview/report.json`
- `primera-desktop/test-results/lab2-preview/01-title.png` hingga `07-notebook-dark-140.png`
- `primera-desktop/test-results/lab2-package-smoke.json`
- `LAB2_COPY_AUDIT.json`

Log dan hasil visual adalah artefak lokal yang tidak dimasukkan ke Git. Catatan pasien dan episode pada screenshot berasal dari fixture QA yang sengaja disiapkan untuk menjangkau fitur; tidak ditambahkan ke konten permainan.

Pemeriksaan ini memvalidasi implementasi dan alur dasar. Rasa permainan, tingkat kesulitan, dan kualitas belajar masih perlu dinilai melalui playtest pengguna. Tidak ada perubahan baru pada penilaian atau fakta klinis.
