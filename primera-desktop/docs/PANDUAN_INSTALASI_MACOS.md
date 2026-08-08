# Memasang PRIMERA di macOS

Panduan ini untuk mahasiswa yang memakai MacBook. Bacalah sampai bagian
Gatekeeper sebelum mengunduh — di macOS langkahnya berbeda dari Windows, dan
melewatkannya membuat aplikasi tampak "rusak" padahal tidak.

## Berkas mana yang diunduh

| Mac Anda | Unduh |
|---|---|
| Apple Silicon (M1, M2, M3, M4) | `PRIMERA-test-beta-<versi>-arm64.dmg` |
| Intel | `PRIMERA-test-beta-<versi>-x64.dmg` |

Tidak yakin? Menu Apple di pojok kiri atas → **About This Mac**. Bila baris
"Chip" berbunyi Apple M-sesuatu, ambil `arm64`. Bila berbunyi Intel, ambil
`x64`. Salah pilih tidak merusak apa pun; aplikasinya hanya menolak jalan.

## Cocokkan sidik jari berkasnya

Sebelum memasang, pastikan berkas yang sampai ke Anda memang berkas yang kami
terbitkan. Buka **Terminal**, lalu:

```bash
shasum -a 256 ~/Downloads/PRIMERA-test-beta-*.dmg
```

Bandingkan hasilnya dengan baris yang sesuai di `SHA256SUMS-<versi>.txt` pada
halaman rilis. Harus sama persis. Kalau berbeda, jangan dipasang — unduh ulang.

## Gatekeeper: bagian yang wajib dibaca

Aplikasi ini **belum ditandatangani secara digital dan belum dinotarisasi
Apple**. Itu keputusan sadar untuk tahap uji coba, bukan kelalaian: sertifikat
Apple Developer berbayar per tahun dan belum diambil selama PRIMERA masih
berstatus test-beta.

Akibatnya, saat pertama dibuka macOS akan menolak dengan pesan seperti
*"PRIMERA test-beta is damaged and can't be opened"* atau *"cannot be opened
because the developer cannot be verified"*. **Aplikasinya tidak rusak.** Yang
terjadi: macOS menandai setiap berkas yang diunduh dari internet, lalu menolak
menjalankan aplikasi bertanda itu bila tidak dinotarisasi.

Cara membukanya — jalankan di Terminal setelah menyeret aplikasi ke folder
Applications:

```bash
xattr -cr "/Applications/PRIMERA test-beta.app"
```

Perintah itu menghapus tanda "diunduh dari internet" pada aplikasi tersebut
saja. Sesudahnya, buka seperti biasa dari Launchpad atau Applications.

Bila Anda lebih nyaman lewat antarmuka: klik-kanan aplikasinya → **Open** →
**Open** sekali lagi pada dialog yang muncul. Pada macOS Sonoma ke atas cara
ini kadang tidak lagi cukup, sehingga perintah `xattr` di atas lebih andal.

**Jangan pernah menjalankan `xattr -cr` pada seluruh folder Applications.**
Perintah itu mencabut perlindungan dari semua aplikasi Anda sekaligus. Sebutkan
jalur aplikasinya secara spesifik, persis seperti contoh di atas.

## Di mana simpanan permainan disimpan

```
~/Library/Application Support/primera-desktop/
```

Folder itu tidak ikut terhapus saat aplikasi dibuang, jadi memasang versi baru
tidak menghilangkan stase yang sedang berjalan.

Satu hal yang perlu diketahui: bila rilis baru menaikkan **rilis konten**,
stase yang sedang berjalan dari versi lama menjadi arsip — masih terbaca,
tidak bisa dilanjutkan. Itu disengaja. Melanjutkan stase lama dengan kunci
jawaban baru membuat dossier Anda dinilai tidak sah oleh dosen, dan itu
kerugian yang jauh lebih besar daripada mengulang stase.

## Bila aplikasinya tetap tidak mau terbuka

1. Pastikan arsitekturnya benar (arm64 vs x64 di tabel paling atas).
2. Pastikan macOS Anda 11 Big Sur ke atas.
3. Jalankan dari Terminal untuk melihat pesan aslinya:
   ```bash
   "/Applications/PRIMERA test-beta.app/Contents/MacOS/PRIMERA test-beta"
   ```
   Salin pesan yang muncul saat melapor ke dosen.

## Catatan untuk dosen

Binari macOS dibangun di runner macOS GitHub Actions, bukan di mesin
pengembang yang memakai Windows — berkas `.dmg` memerlukan `hdiutil` milik
macOS untuk dirakit. Alur kerjanya ada di
`.github/workflows/primera-macos.yml`, memakai gerbang typecheck dan test yang
sama dengan build Windows.

Berbeda dari Windows, binari macOS **belum diverifikasi berjalan** oleh
pengembang: tidak ada mesin macOS untuk mengujinya. Sebelum dibagikan ke satu
kelas, mohon dibuka lebih dulu di satu Mac dan dipastikan layar judul muncul.
