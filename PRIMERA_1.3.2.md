# PRIMERA 1.3.2 — perbaikan sebelum uji coba mahasiswa

**Rilis uji terbit untuk Windows dan macOS:** [test-beta-f98d197](https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-f98d197). Installer Windows sudah dipasang di laptop pengembang dan layar judulnya diperiksa. Build macOS belum dibuka di Mac. Laporan rinci: [pemasangan/publikasi](primera-desktop/docs/RILIS_PRIMERA_1.3.2_2026-10-30.md).

Permintaan pengguna, 30 Oktober 2026: periksa kesiapan PRIMERA terbaru untuk dibagikan ke mahasiswa, lalu siapkan rilis 1.3.2 dengan installer Windows dan macOS.

## Integrasi

Folder kerja: `D:\Dev\PRIMER\PRIMERA 1.3.2`, cabang `codex/primera-1.3.2`, worktree repo `D:\Dev\PRIMER-CODEX-lab`. Basis `337f123` (`codex/primera-1.3.1`). Tiga cabang yang dikerjakan sesudah rilis 1.3.1 digabung tanpa konflik:

| Cabang | Commit | Isi |
| --- | --- | --- |
| `fix/cek-pembaruan-dan-repo` | 5493a8c | "Periksa Pembaruan Saat Dibuka" kembali membaca feed rilis GitHub. Di 1.3.1 pemeriksa ini masih dimatikan sejak masa Lab 2, sehingga pemain tidak pernah diberi tahu ada versi baru. |
| `feat/rekonstruksi-replay-jejak` | b58bf75 | Rekam medis lengkap, atribusi/koreksi kader, dan refleksi percakapan sore disusun ulang dari log aksi setelah game dimuat ulang. Di 1.3.1 semuanya hilang setelah aplikasi ditutup. |
| `fix/potret-warga-binaan` | df23eb2 | Warga binaan bernama (pasien karma, peserta Prolanis) tampil di poli dengan wajah yang sama seperti saat kunjungan rumah. |

Selain itu: identitas versi 1.3.2 (paket, lockfile, jendela, layar judul, HUD, shortcut), nama installer NSIS langsung `PRIMERA-Setup-<versi>.exe` tanpa penggantian nama manual, dan panduan instalasi Windows/macOS disesuaikan dengan nama berkas serta lokasi simpanan yang berlaku.

`src/engine` dan `src/content` identik dengan 1.3.1. Formula penilaian, kunci klinis, dan rilis konten tidak berubah, sehingga stase yang berjalan di 1.3.1 dapat dilanjutkan di 1.3.2.

## Simpanan

Direktori data tetap `%APPDATA%\PRIMERA CODEX Lab 2` (macOS: `~/Library/Application Support/PRIMERA CODEX Lab 2/`), dan folder pemasangan Windows tetap `%LOCALAPPDATA%\Programs\primera-codex-lab2`. Installer 1.3.2 memperbarui 1.3.1 di tempat; slot simpanan tetap terbaca.

## Verifikasi sebelum build

- Typecheck: 0 error. Vitest penuh: **1.766/1.766**, 190 berkas (termasuk tes baru rekonstruksi jejak, feed rilis, dan potret warga binaan).
- Electron (Playwright): **6/6** lulus, termasuk unduh PDF rekam medis dan pemulihan simpanan setelah tutup/buka aplikasi.
- Build runtime: renderer JS 3,84 MiB dan CSS 216,5 KiB, di bawah batas 4 MiB / 320 KiB.
- CI GitHub (`PRIMERA Desktop`) sudah lulus untuk kedua cabang perbaikan sebelum digabung: npm audit, test, exam:simulate, typecheck, e2e, lisensi BGM.

Status installer dan publikasi dicatat di `primera-desktop/docs/RILIS_PRIMERA_1.3.2_2026-10-30.md` setelah rilis.
