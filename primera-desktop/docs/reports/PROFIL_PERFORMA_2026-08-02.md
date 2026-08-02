# Profil Performa Runtime PRIMERA — 2026-08-02

Menutup butir roadmap benchmark **"profil performa runtime belum pernah diukur formal"**
([BENCHMARK_EVALUASI_2026-08-02.md](./BENCHMARK_EVALUASI_2026-08-02.md), dimensi A6).

**Build diukur:** `1.1.0-beta.9` (`dist/win-unpacked`, Electron 43.1.0, x64).
**Mesin uji:** Windows 10, satu unit laptop pengembang. Angka di bawah adalah
**satu titik data**, bukan rerata lintas perangkat — mesin mahasiswa yang lebih
lemah akan lebih lambat, tetapi ordo besarannya (milidetik, bukan detik) yang
menjadi kesimpulan di sini tidak akan berubah.

---

## 1. Startup aplikasi (Electron, diukur via Playwright)

| Metrik | Hasil |
|---|---:|
| Jendela pertama muncul | **496 ms** |
| Layar judul siap dilihat (`.title__panel`) | **889 ms** |
| DOMContentLoaded | 326 ms |
| First paint | 364 ms |
| Heap JS saat idle di layar judul | **12,8 MB** |

**Bacaan:** aplikasi dapat dipakai di bawah satu detik dari peluncuran. Untuk
aplikasi Electron ini tergolong cepat — sebagian besar aplikasi Electron
konsumen berada di kisaran 2–4 detik. Tidak ada indikasi kebutuhan optimasi
startup.

---

## 2. Responsivitas UI (pindah tab HUD, 15 sampel)

| Metrik | Hasil |
|---|---:|
| Median | **78–80 ms** |
| p95 | 132–242 ms |
| Maksimum | 242 ms |

**Bacaan:** di bawah ambang 100 ms yang dianggap "terasa instan" pada median.
Ekor p95 disumbang layar terberat (Buku Saku, 144 kartu + Rapor). Masih jauh di
bawah ambang 1 detik yang memutus alur perhatian pengguna. Tidak mendesak, tapi
bila kelak ada keluhan, kandidat optimasi pertama adalah virtualisasi grid Buku
Saku.

---

## 3. Engine — stase penuh 90 hari (mode Karier, headless)

Driver: satu playthrough penuh sampai `TAMAT`, seluruh sesi IGD diselesaikan,
tiga blok per hari, tanpa render.

| Metrik | Hasil |
|---|---:|
| Hari tercapai | 90 (tamat) |
| Total aksi blok | 270 |
| **Waktu simulasi seluruh stase** | **0,13 detik** |
| Latensi aksi — median | **0,01 ms** |
| Latensi aksi — p95 | 1,87 ms |
| Latensi aksi — maksimum | **13,16 ms** |
| `hitungSkor()` | 0,011 ms |

**Bacaan:** engine bukan sumber latensi apa pun yang dapat dirasakan pemain.
Aksi terberat (13 ms) adalah hari-akhir-stase yang membekukan skor — masih di
bawah satu frame 60 fps ganda. Konsekuensinya juga positif untuk hal lain:
verifikasi replay dossier satu mahasiswa berjalan dalam sepersekian detik, jadi
verifikasi massal satu kohort tetap murah.

---

## 4. Save akhir stase 90 hari

| Metrik | Hasil |
|---|---:|
| **Ukuran save** | **125,7 KB** |
| `serialize()` | 1,12 ms |
| `deserialize()` + validasi penuh | 1,14 ms |
| Entri jejak aksi | 318 |
| Entri log | 318 |
| Surat di kotak masuk | 69 |
| Care episodes | 21 |

**Bacaan:** kekhawatiran "save 90 hari membengkak" **tidak terbukti**. 125 KB
untuk stase penuh, dan validasi defensif berlapis di `deserialize` hanya
memakan ~1 ms — jadi pengetatan validasi pada bug-hunt kemarin tidak membebani
apa pun.

Satu catatan pertumbuhan yang perlu diketahui (bukan masalah sekarang):
`jejak` dan `log` bertambah satu entri per aksi tanpa batas atas. Pada
playthrough teliti yang jauh lebih banyak aksinya, ukuran save naik sebanding.
Uji terpisah dengan 5.000 aksi menghasilkan save ~358 KB dengan
serialize/deserialize ~6 ms — masih sangat aman. Batas praktis baru akan terasa
di ordo puluhan ribu aksi, yang tidak dapat dicapai dalam satu stase.

---

## 5. Ukuran bundel

| Metrik | Hasil |
|---|---:|
| Renderer JS | 3,65 MiB |
| Renderer CSS | 183,7 KiB |
| Installer NSIS | ~108 MB |

Dipantau otomatis tiap build lewat `npm run check:bundle`. Ukuran installer
didominasi runtime Electron, bukan kode aplikasi.

---

## 6. Kesimpulan

**Performa BUKAN risiko bagi PRIMERA saat ini** dan tidak perlu menjadi
prioritas pengembangan. Startup di bawah satu detik, engine di bawah satu
milidetik untuk aksi tipikal, save 90 hari hanya 125 KB.

Yang tetap layak dilakukan (prioritas rendah, tercatat agar tidak hilang):

1. **Ulangi pengukuran ini pada mesin mahasiswa** saat pilot M13-1b berjalan —
   satu titik data dari laptop pengembang bukan bukti untuk perangkat kelas
   bawah. Ini yang paling berharga dari daftar ini.
2. Virtualisasi grid Buku Saku bila p95 pindah-tab dikeluhkan pada perangkat
   lebih lemah.
3. Pertimbangkan pemangkasan `log`/`jejak` hanya bila kelak muncul mode yang
   jauh lebih panjang dari 90 hari.

---

## Cara mereproduksi

Angka bagian 1–2 diukur dengan Playwright (`_electron`) terhadap
`dist/win-unpacked`; bagian 3–4 dengan `vite-node` yang menjalankan engine
langsung tanpa render. Skrip pengukuran bersifat sekali-pakai dan sengaja tidak
disimpan di repo agar tidak menua diam-diam; metodenya diringkas di atas
sehingga dapat ditulis ulang saat pengukuran berikutnya diperlukan.
