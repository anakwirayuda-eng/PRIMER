# PRIMERA 1.3.2 — installer, pemasangan dan publikasi

Permintaan pengguna, 30 Oktober 2026: siapkan rilis 1.3.2 (Windows + macOS) sebelum PRIMERA dibagikan ke mahasiswa untuk uji coba. Isi perubahan: [PRIMERA_1.3.2.md](../../PRIMERA_1.3.2.md).

## Status akhir

- Sumber installer: **`f98d197dc04a248e06844e4c3354c8bac3e36c23`**, tag **`test-beta-f98d197`**, cabang `codex/primera-1.3.2`. Tag dibuat dan di-push sebelum rilis, sesuai [PROSEDUR_RILIS.md](PROSEDUR_RILIS.md).
- Windows: `npm run dist` lulus dari working tree bersih tanpa bypass: asal-usul, lisensi BGM, audit audio, build, anggaran bundle, NSIS, portable, SHA-256.
- macOS: push tag memicu `PRIMERA macOS build` (run 40978222611) — npm ci, typecheck, test, `dist:mac` untuk x64 dan arm64, semuanya lulus. Artefak diunduh dari run tersebut; checksum yang dihitung ulang secara lokal identik dengan `SHA256SUMS` buatan runner.
- [Rilis GitHub](https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-f98d197) diterbitkan sebagai **prerelease / rilis uji** dengan enam berkas dan satu checksum gabungan.

## Artefak

| Berkas | Ukuran (byte) | SHA-256 |
| --- | --- | --- |
| `PRIMERA-Setup-1.3.2.exe` | 108.036.612 | `eb96a7ba3f995a01310d7dd1af6bd7f8d7a092db8d6f0448c9e336e42d0b3897` |
| `PRIMERA-Portable-1.3.2.exe` | 107.879.446 | `fb338f4b7a5e876d8dd7c45f31bdbd2065fc61637259020153fb701f02dbad81` |
| `PRIMERA-1.3.2-arm64.dmg` | 129.741.951 | `fc595b71c86be6c8700086791b7d700a14a346ee785ed5509de1cb32ab70f98a` |
| `PRIMERA-1.3.2-x64.dmg` | 131.509.485 | `0ea8ddc789d441895367d8c369c9c039a46317d479fa6bf2e7a3d713c77f2781` |
| `PRIMERA-1.3.2-arm64.zip` | 129.417.086 | `0a640c2aeda63ae823109d2a83c060547d3d49d00d60406dff3b2f911ebd1ac9` |
| `PRIMERA-1.3.2-x64.zip` | 131.253.464 | `bbc8bab34d716282aeaa6dc2f93807f8fdbda23fdaa7a532fd70aa0d1cde65e7` |

Semua berkas belum ditandatangani (`Get-AuthenticodeSignature`: NotSigned; macOS `identity: null`, tanpa notarisasi). Checksum bukan tanda tangan penerbit.

## Pemasangan Windows

- Sebelum pemasangan, saves, preferensi, Local Storage dan telemetri dicadangkan ke `%LOCALAPPDATA%\PRIMERA-backups\before-1.3.2-20261030-091054`.
- `PRIMERA-Setup-1.3.2.exe /S` → exit code **0**. Pemasangan memperbarui 1.3.1 di tempat (`%LOCALAPPDATA%\Programs\primera-codex-lab2`): hanya `PRIMERA 1.3.2.exe` yang tersisa, metadata versi 1.3.2.0, registry uninstall `PRIMERA 1.3.2` versi 1.3.2, shortcut Desktop `PRIMERA 1.3.2`. `resources/app.asar` terpasang identik dengan `dist/win-unpacked`.
- Aplikasi terpasang dibuka: jendela berjudul **PRIMERA 1.3.2**; accessibility tree layar judul menampilkan **PRIMERA 1.3.2 · SUKAMAJU BERKISAH** dan tombol melanjutkan simpanan yang ada. Tidak ada `runtime-crashes.jsonl`. Aplikasi ditutup tanpa memulai atau menimpa stase.

## Batas verifikasi

- Build macOS **belum dibuka di Mac**: tidak ada mesin macOS. Buka di satu Mac (ikuti [PANDUAN_INSTALASI_MACOS.md](PANDUAN_INSTALASI_MACOS.md)) sebelum dibagikan ke kelas.
- Linux tidak dibangun.
- CI `PRIMERA Desktop` pada commit yang sama lulus di run cabang (40977824745) tetapi gagal satu e2e di run tag (40978222535): axe `scrollable-region-focusable` pada `.mk__konteks > .mk__panel` (Briefing Pagi di belakang debrief IGD, mode gelap, teks 200%). Pemeriksaan lokal 6/6 lulus. `MejaKerja.tsx/.css` tidak berubah sejak 1.3.1, jadi ini kondisi lama yang muncul hanya bila panel meluap; pengguna keyboard pada teks 200% bisa tidak dapat menggulir panel itu. Dicatat untuk perbaikan berikutnya, bukan regresi 1.3.2.
- Target kualitas UKM >8/10 dan keputusan pedagogis konten tetap memerlukan playtest dan penilaian dokter.
