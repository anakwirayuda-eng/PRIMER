# Audit Kesiapan Kelas dan Penutupan P0-P3

**Tanggal:** 22 Juli 2026

**Versi kandidat:** `1.1.0-beta.1`

**Content release:** `class-readiness-2026-07-22`

**Engine:** `REVISI_ENGINE=57`

## Ringkasan eksekutif

Batch ini menutup risiko mekanik yang masih dapat diperbaiki lewat rekayasa: episode rujukan yang tertutup terlalu dini, konsekuensi karma yang dapat saling menimpa, penilaian terapi yang tidak adil untuk kasus tanpa obat/tindakan wajib, SBAR yang tidak bernilai, pemulihan crash yang tidak terlihat, serta reflow dan kontras pada teks 200 persen. Gerbang Electron nyata, Axe, soak 30/90 hari, integritas rilis, dan audit dependensi kini ikut menjadi pagar permanen.

Semua dimensi rekayasa yang disentuh batch ini berada di atas 8 setelah perbaikan. Angka tersebut adalah audit terstruktur atas perilaku dan bukti mesin, bukan validasi psikometrik atau tanda tangan klinis. Validasi dokter untuk 137 kasus poli prototipe dan 14 kasus IGD tetap menjadi gerbang manusia yang tidak boleh digantikan oleh skor teknis.

## Skor pra-pasca

Skor memakai rubrik 0-10 berdasarkan kelengkapan alur, ketahanan state, keterujian, aksesibilitas, dan fidelity simulasi. Nilai pra merekonstruksi kondisi sebelum batch ini; nilai pasca ditopang oleh invariant, E2E Electron, pembacaan diff, dan simulasi terpadu.

| Dimensi | Pra | Pasca | Bukti utama |
|---|---:|---:|---|
| Kontinuitas manajemen dan rujukan | 6,0 | **8,7** | Surat balik harus dibaca dan rekomendasi dipilih satu per satu sebelum episode ditutup |
| Bridge UKM-UKP longitudinal | 8,7 | **8,9** | Callback rujukan menjadi aksi nyata; benturan jadwal karma dicegah; soak teladan menuntaskan kedua domain |
| Keadilan skor klinik | 6,8 | **8,8** | Terapi menjadi N/A bila memang tak ada obat/tindakan wajib; kesalahan tetap dihukum; bobot dialihkan ke edukasi |
| Handoff klinis SBAR | 7,1 | **8,4** | SBAR yang benar menyumbang nilai proses tanpa mengalahkan keselamatan atau keputusan klinis |
| Ketahanan crash dan pemulihan | 6,7 | **8,6** | Log crash persisten, satu kali auto-reload, fallback aman, dan notifikasi pemulihan |
| Aksesibilitas visual dan teks besar | 7,6 | **8,7** | Axe A/AA, dark/light, 200 persen, reflow HUD, overflow dan benturan badge diuji di Electron |
| Integritas rilis dan replay | 8,3 | **9,2** | Release baru, engine bump, 18 hash beku, migrasi/fingerprint, CI E2E, dan 0 vulnerability |
| Reliabilitas gameplay terpadu | 7,5 | **9,0** | Karier/Ujian, UKP/UKM, kegiatan, KLB, karma, ekonomi, dan akhir stase berjalan dalam soak penuh |
| Kesiapan review klinis | 7,4 | **8,5** | Paket review 137 poli dan 14 IGD lengkap, reproducible, dan tidak memalsukan keputusan dokter |
| **Rerata rekayasa** | **7,3** | **8,8** | Seluruh dimensi rekayasa pasca berada di atas 8 |

## Temuan yang ditutup

### P0

1. **Surat balik rujukan menutup episode tanpa adopsi rekomendasi.** Membaca surat kini hanya membuka isi. Pemain harus menandai langkah tindak lanjut dan mengadopsinya secara eksplisit sebelum episode berstatus selesai.
2. **Karma terjadwal dapat tertimpa kejadian lain pada hari yang sama.** Penjadwalan ulang kini mencari hari kosong sehingga konsekuensi longitudinal tidak hilang diam-diam.

### P1

1. **Kasus non-obat mendapat nilai terapi nol walau tidak membutuhkan obat/tindakan.** Dimensi terapi sekarang N/A dan bobotnya dialihkan secara eksplisit; pemberian obat/tindakan keliru tetap menurunkan nilai.
2. **SBAR diisi tetapi tidak memengaruhi kualitas proses.** Dokumentasi SBAR kini bernilai kecil dan terukur, tanpa dapat menyelamatkan keputusan klinis berbahaya.
3. **Restart/crash terasa seperti game mulai sendiri.** Main process menyimpan `runtime-crashes.jsonl`; renderer mencoba pulih sekali, lalu menampilkan fallback bila crash berulang, serta memberi tahu pemain setelah recovery.
4. **Teks 200 persen membuat HUD berhimpitan.** Layout memakai dua baris stabil pada skala besar, label dapat membungkus, dan badge tidak menutupi navigasi.

### P2

1. **Belum ada pemeriksaan aksesibilitas di aplikasi Electron sebenarnya.** Playwright sekarang membuka build produksi, menjalankan alur mulai stase, dark/light, teks 200 persen, Axe WCAG A/AA, serta pemeriksaan overflow dan tabrakan HUD.
2. **Kontras teks sekunder sedikit di bawah 4,5:1 pada permukaan tertentu.** Token siang diperkuat dari `#5b6a62` menjadi `#536159` dengan rasio sekitar 4,8:1 pada permukaan sasaran.
3. **Empat belas kasus IGD belum memiliki alat adjudikasi satu per satu.** Artefak JSON, HTML interaktif, dan laporan Markdown kini dihasilkan dari data runtime yang sama dan dikunci invariant.
4. **Konfigurasi Vitest memakai API yang telah deprecated.** Suite dipisahkan lewat `projects` eksplisit tanpa mengubah cakupan pengujian.

### P3

1. **Dependensi pengujian memiliki advisory dev-only.** Dependency tree diperbarui; `npm audit` dan `npm audit --omit=dev` keduanya 0 vulnerability.
2. **Audit editorial masih menandai 80 kapitalisasi.** Tidak ada temuan tinggi. Sinyal sedang dipertahankan sebagai antrean editorial karena mayoritas adalah akronim, signage, atau penekanan keselamatan; mass-lowercase akan merusak makna.

## Verifikasi reproduktif

- Full Vitest: **1.247/1.247 lulus**.
- TypeScript: **bersih**.
- Electron Playwright: **1/1 alur penuh lulus**.
- Axe: **0 serious/critical violation** pada light, dark, dan teks 200 persen di layar yang diuji.
- Exam blueprint: **512 run**, maksimum same-slot `0.0510`.
- Soak teladan Karier: **90,2/100**; UKP 35,0, UKM 25,2, Manajemen 15,0, Resiliensi 15,0.
- Soak teladan Ujian: **89,8/100**; UKP 35,0, UKM 24,8, Manajemen 15,0, Resiliensi 15,0.
- Audit dependensi produksi dan penuh: **0 vulnerability**.
- Bundle renderer: JavaScript **3,33 MiB**, CSS **161,0 KiB**, dalam budget proyek.
- Installer NSIS: `PRIMERA test-beta Setup 1.1.0-beta.1.exe`, SHA-256 `B86C4D85B4C656B6668F36567B299EC967A183CF6706FFACF480736DF4A1C921`.
- `app.asar` build dan instalasi lokal identik, SHA-256 `0C18391C6B9A78F5B7407D3B790B7F00A60A4A89225A6A3651A4D4E3AAFAA994`.

Soak teladan memaksa satu sinyal kluster yang masuk akal ketika KLB dibuka agar jalur KLB benar-benar dieksekusi. Karena itu hasil ini membuktikan integrasi mekanik, bukan bahwa setiap seed alami selalu menghasilkan jumlah kluster yang sama.

## Residual yang tidak disamarkan

1. **Adjudikasi klinis manusia:** 137 kasus poli prototipe dan 14 kasus IGD belum seluruhnya ditandatangani dokter. Compiler provenance dan struktur lengkap bukan pengganti review medis.
2. **Lima binding IGD perlu currency check saat adjudikasi:** cedera kepala, gigitan ular, organofosfat, luka bakar, dan tension pneumothorax memakai sumber terikat yang relatif lama. Lama tidak otomatis salah, tetapi wajib dibandingkan dengan pedoman terbaru.
3. **Playtest mahasiswa:** belum ada bukti manusia untuk waktu baca, beban kognitif, kesenangan, dan kemampuan menjelaskan ulang loop UKM-UKP.
4. **Semantik aset observasi UKM:** pass visual rumah/NPC sudah meningkat, tetapi audit kecocokan semua hotspot dengan detail gambar sengaja dijadwalkan sebagai batch M12 berikutnya.
5. **Crash native nyata:** jalur recovery telah diuji pada boundary IPC/renderer; injeksi crash proses native dalam installer tetap layak menjadi uji manual sebelum penggunaan kelas.

## Rekomendasi gerbang berikutnya

Pekerjaan manusia berikutnya dipersempit menjadi satu jenis saja: **adjudikasi 14 kasus IGD, satu per satu**. Ini lebih kecil dan lebih berisiko-keselamatan daripada paket 137 poli, sehingga memberi kemenangan yang terukur tanpa menambah overload. Setiap kasus harus diputuskan `Setuju`, `Perlu edit`, `Tolak`, atau `Nanti`, dengan riset current-source dilakukan hanya pada kasus yang sedang dibaca.
