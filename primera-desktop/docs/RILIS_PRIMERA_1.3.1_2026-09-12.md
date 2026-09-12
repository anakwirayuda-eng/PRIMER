# PRIMERA 1.3.1 — installer, pemasangan dan publikasi

Permintaan pengguna: selesaikan status distribusi yang belum dikerjakan dan buka game terbaru.

## Status akhir

- Commit kode dan dokumen sudah di-push ke `origin/codex/primera-1.3.1`.
- Sumber installer: **`2ab6ae4f0b257496db6c554981b8d7ebfc87cebd`**, tag **`test-beta-2ab6ae4`**. Tag menunjuk commit build, bukan branch default.
- `npm run dist` lulus dari working tree bersih: provenance, pemeriksaan lisensi/audio, build, anggaran bundle, NSIS, portable dan SHA-256. Tidak ada bypass gerbang.
- [Rilis GitHub](https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-2ab6ae4) diterbitkan sebagai **prerelease / rilis uji**, dengan dua executable Windows x64 dan checksum.
- Installer dijalankan dengan `/S`, exit code **0**. Registry uninstall dan metadata executable menunjukkan versi **1.3.1**.
- Shortcut **PRIMERA 1.3.1** dibuat di Desktop. App terpasang di `%LOCALAPPDATA%\Programs\primera-codex-lab2\PRIMERA 1.3.1.exe`.
- Aplikasi terpasang telah dibuka. Jendela berjudul **PRIMERA 1.3.1**, layar judul menampilkan **PRIMERA 1.3.1 · SUKAMAJU BERKISAH**, dan pilihan melanjutkan simpanan tersedia. Tidak memulai atau menimpa stase pengguna.

## Artefak

| Berkas | Ukuran | SHA-256 |
| --- | --- | --- |
| `PRIMERA-Setup-1.3.1.exe` | 108.029.175 byte | `80f849d44a3a543d9df50c77e863a12a0dba03691cc7735d62d7b99777af372e` |
| `PRIMERA-Portable-1.3.1.exe` | 107.872.002 byte | `8f02760e8d233cec2f2a6c9cd4703601d01b0aeefb55305a3595cf0b4b917212` |

Berkas lokal ada di `primera-desktop/dist/`. Nama installer keluaran NSIS dinormalisasi menjadi nama distribusi di atas tanpa mengubah byte. SHA-256 executable dan `resources/app.asar` pada instalasi cocok dengan `dist/win-unpacked`. Asset GitHub diperiksa status unggah, ukuran dan digest-nya.

Rilis belum memakai sertifikat penandatanganan kode. Ini mengikuti distribusi uji sebelumnya; checksum tidak dinyatakan sebagai tanda tangan penerbit.

## Simpanan dan audit

Sebelum pemasangan, folder saves, preferensi dan telemetri Lab 2 dicadangkan ke `%LOCALAPPDATA%\PRIMERA-backups\before-1.3.1-20260912-215508`. Simpanan tetap memakai `%APPDATA%\PRIMERA CODEX Lab 2`. Instalasi 1.2.0 di direktori lain tetap tersedia.

Pemeriksaan layar memakai accessibility tree setelah API tangkapan layar Windows melaporkan `SetIsBorderRequired ... 0x80004002`. Versi, menu, proses dan path executable terpasang diverifikasi; tidak mengklaim screenshot baru untuk pemeriksaan ini.

Tidak ada perubahan runtime setelah build pada commit `2ab6ae4`. Commit dokumentasi pemasangan boleh berada sesudah tag tersebut. Reproduksi binary harus memakai sumber pada tag; status distribusi yang tertulis dalam dokumen versi tag masih mencatat keadaan sebelum pemasangan.

Target kualitas UKM >8/10 tetap memerlukan audit/playtest; penerbitan installer tidak menggantikan keputusan pedagogis atau adjudikasi klinis yang tercatat dalam [laporan implementasi](HASIL_PRIMERA_1.3.1_2026-09-12.md).
