# PRIMERA — Panduan Instalasi & Distribusi

Untuk **dosen, asisten, dan admin lab komputer**. Panduan penggunaan
pedagogisnya ada di [PANDUAN_DOSEN.md](./PANDUAN_DOSEN.md); dokumen ini khusus
soal memasang dan menyebarkan aplikasinya.

---

## 1. Dua bentuk berkas — pilih sesuai situasi

Setiap rilis menyediakan **dua** berkas `.exe`. Keduanya berisi aplikasi yang
sama persis; yang berbeda hanya cara menjalankannya.

| | **Installer** (`PRIMERA test-beta Setup <versi>.exe`) | **Portable** (`PRIMERA-test-beta-Portable-<versi>.exe`) |
|---|---|---|
| Perlu hak admin? | Tidak (pasang per-pengguna) | Tidak |
| Memasang ke sistem? | Ya (`%LOCALAPPDATA%\Programs`) | **Tidak** — jalan langsung dari berkas |
| Pintasan Start Menu | Ya | Tidak |
| Cocok untuk | Laptop pribadi mahasiswa | **Lab komputer terkunci**, flashdisk, cobabaca cepat |
| Waktu buka | Cepat | Sedikit lebih lambat (mengekstrak dulu tiap kali) |

**Rekomendasi:** bagikan **keduanya**. Mahasiswa dengan laptop pribadi memakai
installer; komputer lab yang membatasi pemasangan perangkat lunak memakai
portable — cukup salin satu berkas dan klik dua kali.

> **Catatan penting soal portable:** progres tetap tersimpan di profil pengguna
> Windows (`%APPDATA%`), **bukan** di sebelah berkas .exe. Dua akibatnya:
>
> 1. Di komputer lab yang profilnya dihapus tiap logout, progres mahasiswa akan
>    hilang. Minta mereka **mengekspor arsip manual** (3 slot di layar judul)
>    sebelum keluar.
> 2. Versi portable dan versi installer **berbagi folder simpanan yang sama**.
>    Biasanya justru berguna — tapi ketahuilah bahwa membuka versi lama lewat
>    portable dapat menimpa progres dari versi yang lebih baru.

---

## 2. Peringatan SmartScreen — sampaikan SEBELUM membagikan

Installer **belum ditandatangani secara digital** (belum ada sertifikat
penandatanganan kode). Windows akan menampilkan layar biru:

> *"Windows protected your PC"*

**Cara melanjutkan:** klik **"More info"** → **"Run anyway"**.

Ini normal untuk perangkat lunak akademik yang belum bersertifikat. Namun bila
Anda tidak memberitahu lebih dulu, sebagian mahasiswa akan mengira aplikasinya
berbahaya dan berhenti di situ — jadi sampaikan bersamaan dengan tautan unduhan,
bukan sesudahnya.

---

## 3. Memastikan berkas utuh (checksum SHA-256)

Karena berkas tidak bertanda tangan, **checksum** adalah cara memastikan yang
Anda unduh benar-benar berkas asli dan tidak berubah. Tiap rilis menyertakan
`SHA256SUMS-<versi>.txt`.

Di PowerShell:

```bash
Get-FileHash "PRIMERA test-beta Setup 1.1.0-beta.10.exe" -Algorithm SHA256
```

Bandingkan hasilnya dengan baris di `SHA256SUMS-<versi>.txt` (huruf besar/kecil
tidak masalah). Bila **tidak cocok**, jangan dijalankan — unduh ulang.

Ini terutama penting bila berkas berpindah lewat flashdisk atau salinan
antar-mahasiswa, bukan langsung dari halaman rilis.

---

## 4. Menyebarkan ke banyak komputer

**Cara paling sederhana (disarankan):** salin berkas **portable** ke tiap
komputer atau ke folder jaringan bersama. Tidak ada pemasangan, tidak ada hak
admin, tidak ada yang perlu dibersihkan setelahnya.

> **Tips yang menghilangkan SmartScreen sepenuhnya:** letakkan berkas di
> **share intranet kampus**, lalu minta mahasiswa menjalankannya dari sana.
> Berkas dari zona *Local Intranet* tidak mendapat *Mark-of-the-Web*, sehingga
> SmartScreen tidak terpicu sama sekali — dinyatakan eksplisit oleh dokumentasi
> Microsoft. Berkas yang diunduh lewat browser dari GitHub selalu mendapat
> penanda itu. Jadi bila Anda punya akses share kampus, itu jalur distribusi
> terbaik — bukan sekadar alternatif.

**Bila ingin terpasang permanen**, installer mendukung mode senyap:

```bash
"PRIMERA test-beta Setup 1.1.0-beta.10.exe" /S
```

Pemasangan berlangsung tanpa dialog, ke `%LOCALAPPDATA%\Programs\primera-desktop`
milik pengguna yang menjalankannya (bukan seluruh mesin).

---

## 5. Menyeragamkan versi — ini soal keadilan penilaian, bukan kerapian

Dossier mahasiswa yang dibuat di versi berbeda akan berstatus **"tidak dapat
diverifikasi"** saat Anda memeriksanya. Itu bukan tuduhan curang, tapi membuat
penilaian tak bisa dilanjutkan (lihat [PANDUAN_DOSEN.md](./PANDUAN_DOSEN.md) §6).

Karena itu:

1. Untuk satu kelompok penilaian, tetapkan **satu versi** dan bagikan tautan
   rilis yang sama — bukan berkas hasil salin-tempel yang mungkin sudah lama.
2. Aplikasi punya **"Periksa Pembaruan Saat Dibuka"** di Pengaturan
   (default **mati**, karena aplikasi ini sengaja luring). Bila dinyalakan,
   aplikasi akan memberi tahu jika ada versi lebih baru — tapi **tidak pernah
   memasang sendiri**; mahasiswa mengunduhnya manual. Sarankan menyalakannya
   untuk kegiatan latihan, dan **mematikannya** saat periode penilaian agar
   tidak ada yang berpindah versi di tengah jalan.
3. Cek versi yang sedang dipakai lewat **Pengaturan → Tentang & Kredit**.

---

## 6. Privasi & jaringan

Aplikasi berjalan **sepenuhnya luring**. Tidak ada akun, tidak ada server,
tidak ada data mahasiswa yang dikirim ke mana pun.

Satu-satunya koneksi keluar yang mungkin terjadi:

| Kapan | Ke mana | Data yang dikirim |
|---|---|---|
| "Periksa Pembaruan" dinyalakan (default mati) | Daftar rilis publik GitHub, maksimal sekali per 12 jam | Tidak ada — hanya permintaan baca |
| Pengguna mengklik tautan sumber klinis | Situs pedoman yang bersangkutan, di browser bawaan | Tidak ada |

**Laporan Diagnostik** (Pengaturan → "Menemukan Masalah?") membuat berkas di
komputer pengguna — **tidak** mengirimkannya. Mahasiswa yang memutuskan
mengirimkannya kepada Anda.

---

## 7. Pemecahan masalah

| Gejala | Langkah |
|---|---|
| SmartScreen memblokir | "More info" → "Run anyway" (lihat §2) |
| Antivirus mengarantina | Umum untuk .exe tanpa tanda tangan. Verifikasi checksum (§3) lalu tambahkan pengecualian, atau pakai versi portable |
| Portable lambat dibuka | Wajar — mengekstrak tiap kali dijalankan. Bila dipakai rutin, pasang versi installer |
| Progres hilang setelah logout di lab | Profil Windows dibersihkan. Minta mahasiswa mengekspor arsip manual sebelum keluar (§1) |
| Dossier "tidak dapat diverifikasi" massal | Hampir selalu versi tidak seragam (§5). Samakan versi, minta ekspor ulang |
| Aplikasi tidak terbuka sama sekali | Minta Laporan Diagnostik (Pengaturan) — berkasnya memuat catatan gangguan teknis |

---

## 8. Yang BELUM tersedia (jujur, agar tidak salah harap)

- **Tanda tangan kode** — belum ada sertifikat, sehingga SmartScreen selalu
  muncul. Ini satu-satunya cara menghilangkannya sepenuhnya.
- **Pembaruan otomatis** — aplikasi hanya memberi tahu, tidak memasang sendiri.
  Alasannya bukan soal peringatan tambahan, melainkan keamanan — lihat penjelasan
  di bawah.
- **macOS & Linux** — saat ini hanya Windows x64.

### Mengapa pembaruan otomatis TIDAK diaktifkan (keputusan sadar)

Secara teknis `electron-updater` **bisa** dipakai pada aplikasi tak
bertanda-tangan. Justru itu masalahnya: verifikasi penerbit **dilewati total**
ketika tanda tangan tidak ada. Jalur pembaruan jadi tanpa otentikasi sama
sekali — memasang biner tak terverifikasi secara otomatis ke ratusan PC lab
bukan risiko yang sepadan untuk aplikasi yang rilisnya masih sering.

Karena itu aplikasi hanya **memberi tahu**, tidak pernah memasang sendiri.

### Bila kelak ingin menandatangani (urutan yang masuk akal)

1. **Microsoft Store (MSIX)** — gratis, dan satu-satunya jalur yang benar-benar
   menghilangkan peringatan.
2. **Sertifikat OV atas nama pribadi** (mis. SSL.com Individual Validated,
   sekitar $129/tahun) — tidak perlu badan hukum.
3. Yang **tidak** perlu dikejar: sertifikat **EV** sudah **tidak lagi**
   mem-bypass SmartScreen sejak 2024. *Azure Trusted Signing* saat ini tidak
   tersedia untuk Indonesia.

Perlu diketahui juga: tanpa tanda tangan, reputasi SmartScreen harus dibangun
**ulang setiap rilis** — sehingga ritme rilis beta yang sering membuat reputasi
mustahil terbentuk. Menunggu ritme melambat sebelum membeli sertifikat adalah
keputusan yang masuk akal.
