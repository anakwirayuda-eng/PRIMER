# PRIMERA 1.3.1 — pengembangan UKM

**Installer sudah dibuat dan dipasang; game 1.3.1 sudah dibuka.** Gunakan shortcut **PRIMERA 1.3.1** di Desktop. Source, tag, installer dan portable sudah diterbitkan sebagai [rilis uji 1.3.1](https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-2ab6ae4). Laporan rinci: [implementasi](primera-desktop/docs/HASIL_PRIMERA_1.3.1_2026-09-12.md) dan [pemasangan/publikasi](primera-desktop/docs/RILIS_PRIMERA_1.3.1_2026-09-12.md).

Permintaan pengguna, 12 September 2026: versi berikutnya dinamai PRIMERA 1.3.1; eksekusi perbaikan dan upgrade, dengan sasaran kualitas gameplay, visual, keasikan, presisi, dan beban kognitif masing-masing >8/10. Pengguna mengonfirmasi bahwa sasaran itu adalah kualitas pengalaman, bukan angka nilai mahasiswa.

## Integrasi

Folder kerja: `D:\Dev\PRIMER\PRIMERA 1.3.1`, cabang `codex/primera-1.3.1`, worktree repo `D:\Dev\PRIMER-CODEX-lab`. Basis `6e9f17c`; enam perubahan Lab 2 diterapkan di atas riwayat tersebut. Folder Lab 2 lama menjadi pembanding.

| Commit Lab 2 | Commit integrasi |
| --- | --- |
| e3318c9 | daae6c8 |
| f3d01e2 | 82dbe96 |
| 02ff832 | 467f178 |
| 0f3167e | 04d9e6a |
| 8eb0fe4 | 5a4ab04 |
| 689812f | 4933675 |

Source runtime, package/lockfile, scripts, dan e2e hasil integrasi identik dengan Lab 2. Arsip/referensi yang hanya ada di riwayat sumber dipertahankan; bukan dihapus demi menyamakan snapshot salinan. Tiga dosier Claude disalin utuh sebagai bahan audit, bukan tanda bahwa seluruh keputusan klinis di dalamnya telah disetujui.

## Lingkup

- Hotspot yang tepat dan bisa dijangkau, petunjuk observasi, pembahasan gaya percakapan setelah kunjungan.
- Peta yang membedakan kelengkapan data, sumber data, dan perubahan terhadap acuan awal.
- Sasaran Posyandu, kader bernama, konteks kegiatan dan investigasi, rekap delegasi/verifikasi.
- Jadwal Prolanis, cakupan program/Lokmin, ringkasan kegiatan di rapor, navigasi dan bahasa yang lebih ringan.
- Debrief UKP dan cetak terbatas pada data encounter yang benar-benar tersedia.
- Identitas versi 1.3.1, build dan pemeriksaan runtime.

Formula penilaian, kunci klinis, dan 18 berkas engine beku dipertahankan. Sasaran >8/10 akan dinilai lewat kriteria perilaku dan playtest; bukan diklaim tercapai hanya karena patch atau jumlah tes.

## Verifikasi

- Typecheck: 0 error. Vitest penuh: **1.750/1.750**, 187 berkas; setelah penyempurnaan terakhir, 160 tes terkait di 29 berkas kembali lulus.
- Electron: **6/6** lulus, termasuk unduh PDF dan pemulihan simpanan setelah tutup/buka aplikasi.
- Browser: 12 tampilan diperiksa; tidak ada pelanggaran axe pada cakupan yang diuji, tidak ada page error. Hotspot Slamet tepat pada lebar 1.000/1.280/1.440 piksel. Mode gelap 200% memakai pengaturan aplikasi dan diuji tanpa tumpang tindih kelompok HUD.
- Build runtime: lulus; renderer JS 3,83 MiB dan CSS sekitar 216 KiB, di bawah batas 4 MiB / 320 KiB.
- Seluruh `src/engine` dan `src/content` identik dengan `6e9f17c`; REVISI_ENGINE 72 dan CONTENT_RELEASE tetap.
- Kode dan laporan di-commit serta di-push. **Installer terpasang dan game terbuka.** Rilis uji Windows tersedia dengan installer, portable dan SHA-256. Sumber binary tetap commit `2ab6ae4`; pembaruan laporan setelahnya tidak mengubah binary.

Penilaian kualitas >8/10 tetap sasaran audit/playtest, belum dinyatakan sebagai hasil ukur baru. Terutama variasi akhir stase dan keputusan pedagogis konten masih perlu penilaian dokter.

## Simpanan dan cara menjalankan

- Shortcut Desktop menjalankan aplikasi terpasang di `%LOCALAPPDATA%\Programs\primera-codex-lab2\PRIMERA 1.3.1.exe`. Launcher pengembangan `MULAI PRIMERA 1.3.1.cmd` tetap tersedia untuk build `primera-desktop/out/`.
- Identitas tampilan dan versi paket adalah 1.3.1. Direktori data desktop tetap `%APPDATA%\PRIMERA CODEX Lab 2` agar slot lama dapat dilanjutkan; mekanisme satu instans tetap berlaku. Pengujian memakai direktori data sementara, tidak memakai simpanan pemain.
- Preview browser memakai port 5131 dan penyimpanan browsernya sendiri. Jalankan `npm.cmd run dev:browser` dari `primera-desktop`; untuk QA terpisah jalankan `npm.cmd run test:ui:131` saat server itu aktif. Gunakan server yang baru dimulai agar modul fixture QA tidak tertinggal setelah HMR.
- PDF rekam medis lengkap tersedia pada debrief konsultasi yang baru selesai. Sesudah memuat ulang, data encounter lengkap tidak disimpan oleh skema lama; Jejak Perawatan menyediakan unduhan ringkasan episode yang tersedia.
