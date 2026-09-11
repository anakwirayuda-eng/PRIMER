# Brainstorm & Rencana — Belajar dari "Ai Clinical Case Simulator v.4" untuk PRIMERA

**Tanggal:** 2026-09-11 · **Status:** brainstorm & rencana saja — TIDAK ADA perubahan kode, konten, maupun skor.
**Basis:** PRIMERA 1.2.0, commit `6e9f17c` (23 Agustus 2026), cabang `codex-gpt56-experiment`, pohon kerja bersih.
**Bahan pembanding:** `ai_clinical_case_simulator_v_4 (1).tsx` (1.991 baris, satu komponen React, mesin kasus = Gemini 2.5 Flash, simpanan = Firebase).
**Cara saya memeriksa:** membaca seluruh file lampiran; membaca mesin klinik, skema konten, dan dokumen keputusan PRIMERA; menjalankan typecheck + seluruh vitest; lalu **memainkan sendiri Hari 1–3** di preview browser (klinik tutorial, pasien KB, meja kerja tiga blok, peta desa, roster binaan, kunjungan Bu Wulan lima tahap sampai hasil, rapor, buku saku).

---

## 0. Ringkasan satu layar

**PRIMERA hari ini sehat dan diam.** Tidak ada commit sejak 23 Agustus. Typecheck bersih, 1.701 test hijau. Yang menahan proyek bukan bug teknis, melainkan **keputusan** yang masih menunggu dokter (jalur full trial, 4 pertanyaan klinis 23 Agustus) dan **satu bug P1 yang sudah terdiagnosis tapi belum diperbaiki** (kartu Kegiatan membocorkan kunci jawaban kartu berikutnya, temuan triase ASTRA 5 September).

**File lampiran bukan pesaing PRIMERA.** Ia simulator stasiun OSCE satu-pasien yang cepat dibuat karena semua kecerdasannya dipinjam dari LLM: kasus dibuat Gemini, pasien dijawab Gemini, saran diagnosis dan obat dari Gemini. Penilaiannya kasar (cocok kata, "teliti" = klik SEMUA pemeriksaan, resep tidak dinilai sama sekali). Ia melanggar beberapa pilar PRIMERA yang sengaja diputuskan juri (umpan balik instan, hadiah untuk pemeriksaan shotgun, tidak deterministik sehingga tidak bisa diverifikasi dosen).

**Tetapi ada lima hal yang layak dipinjam**, semuanya bisa dibangun TANPA LLM dan TANPA menyentuh mesin skor:

1. Debrief yang menunjukkan **teks temuan** pemeriksaan fisik yang terlewat, bukan hanya nama regionya.
2. **Rupiah yang terbuang** per lab tak relevan, tercetak di debrief.
3. **Cetak/ekspor rekam medis** per pasien (Lembar Periksa sudah ada di layar, tinggal dicetak).
4. **Kesan pertama pasien** (gestalt) satu kalimat di ruang tunggu.
5. Mode **Latihan Bebas per kategori** (main pasien berturut-turut, formatif, tanpa konsekuensi dunia) — ini yang paling bernilai untuk mahasiswa menjelang Ujian.

Satu ide besar yang layak dipikirkan tapi butuh keputusan dokter: **anamnesis ketik bebas** yang dipetakan ke bank pertanyaan kasus (deterministik, tanpa LLM) — melatih *mengingat* pertanyaan, bukan *mengenali* dari daftar.

**Yang tidak saya rekomendasikan:** LLM saat runtime (pasien obrolan bebas), timer OSCE yang memengaruhi skor, penilaian cocok-kata, resep bebas berdosis tanpa validasi, ketergantungan online.

---

## 1. Sampai mana PRIMERA hari ini (fakta terverifikasi 11 September 2026)

| Aspek | Keadaan | Cara verifikasi |
|---|---|---|
| Versi & commit | 1.2.0, `6e9f17c`, 23 Agustus 2026 | `git log` |
| Aktivitas | Tidak ada commit selama 19 hari | `git log` |
| Typecheck | 0 error | `npm run typecheck` hari ini |
| Test | 176 berkas, **1.701/1.701 hijau** | `npx vitest run` hari ini |
| Mesin skor | `REVISI_ENGINE` 72, berkas beku terhash | `verifikasi.ts` |
| Kasus poli | **210** (73 inti + 137 prototipe lab) | dihitung dari `PACK` |
| Kasus lab menurut status tinjauan | 16 disetujui dokter · 70 ditinjau Claude · 51 belum | dihitung dari `PACK` |
| Kasus IGD | 20 | dihitung dari `PACK` |
| Sebaran kompetensi | 4A 151 · 3B 33 · 3A 17 · tingkat-2 9 | dihitung dari `PACK` |
| Katalog | 150 obat · 173 topik edukasi · 41 lab · 62 tindakan · 16 keluarga · 144 entri SKDI | dihitung dari `PACK` |
| Variasi | 40 kasus punya varian presentasi; rata-rata 7,4 pertanyaan anamnesis; rata-rata 3,06 opsi diagnosis | dihitung dari `PACK` |
| Pengayaan | 29 pilot Duel/Teach-back; 48 storylet malam | grep konten |
| Milestone | M0–M7, M9, M10.5 (Golden Master), M11 inti, M12, M14 selesai; M13 sebagian (137 kasus lab); M15 disetujui belum dibangun; M8 Arena repo terpisah | ROADMAP |

**Yang masih menunggu keputusan dokter** (bukan pekerjaan teknis):

- **Jalur ke full trial** — 4 opsi di dosier 22 Agustus §3 (manual penuh / berbasis risiko / delegasi bulk / trial dua-tingkat). 121 kasus lab belum bertanda tangan dokter; 70 di antaranya sudah ditinjau Claude sebagai persiapan.
- **4 pertanyaan klinis 23 Agustus** (alergi makanan L27.2/L50.0/T78.1; cacing tambang B76.0/B76.9; cakupan KMK 1936 pada vaginitis kandida; potensi steroid numularis).
- **Dosier koding 22 Agustus §5** (servisitis N89/N72, kekerasan tumpul/tajam, kepadatan 3 opsi, bobot `closureRate`, kalimat pembuka clue stroke).

**Yang wajib diperbaiki sebelum trial, terlepas dari brainstorm ini:**

- **P1 kartu Kegiatan** (triase ASTRA 5 September, sudah dikonfirmasi dengan reducer asli): klik opsi langsung memajukan indeks kartu, layar masih memegang vonis kartu lama, sehingga judul kartu berikutnya tampil bersama pembahasan kartu lama dan stempel hijau jatuh ke opsi kartu berikutnya. Karena semua opsi benar ber-id `a`, ini **kunci jawaban bocor** di Mode Ujian (UKM 35 poin). Per grep hari ini, `Kegiatan.tsx` baris 54 masih membaca `kg.kartu[kg.index]` untuk judul/narasi/opsi — jadi **belum diperbaiki**. Rekomendasi tetap: perbaiki di jalur UI saja (render dari `vonis.kartu` saat vonis ada), nol sentuh engine.

---

## 2. Pengalaman bermain langsung — apa yang terasa

Catatan: dimainkan di preview browser (shim `window.primer` → localStorage), bukan runtime Electron. Temuan visual/interaksi perlu dikonfirmasi ulang di Electron sebelum dianggap bug pasti.

### 2a. Yang kuat (dan lebih baik daripada file lampiran)

- **Lembar Periksa yang terisi sendiri.** Kutipan pasien tercetak dengan tulisan tangan di kolom S, vital muncul `—` sampai diukur, temuan region tercetak di kolom O. Rekam medis tumbuh dari tindakan pemain. Ini "setiap angka diperoleh" yang benar-benar terasa.
- **Anamnesis yang mengalir.** Keluhan utama dulu, satu pertanyaan RPS jembatan, baru riwayat/latar terbuka. Tidak terasa seperti checklist acak. Gauge Sabar terlihat, balon jawaban menempel di atas.
- **Debrief berlapis.** Stempel grade jatuh, empat meter, chip bendera (disposisi tepat, lab tak relevan ×n), laci "Yang Dipilih & Perlu Diperbaiki", Mutiara EBM, "Pelajari Lebih Dalam" 3 topik (Panduan Resmi, Realita FKTP, sumber) + Duel/Teach-back. Umpan balik datang sesudah keputusan terkunci, sesuai GDD §11.
- **Kunjungan rumah = bintang.** Ilustrasi interior, lima titik amatan yang ditulis ke Catatan Observasi, dialog bergaya MI dengan label gaya (Refleksi/Empati), diagnosis perilaku COM-B yang menampilkan "apa yang kamu lihat & dengar" sebagai bahan, empat kartu resep sosial, penutup SAJI, lalu hasil naratif + Landasan Resmi bertautan. Tidak ada satu pun bagian file lampiran yang mendekati ini.
- **Peta & roster jujur.** "Warna dihitung dari data yang MASUK — RW abu-abu berarti kadernya belum menyurvei, bukan berarti sehat." Chip provenance ✓/~/? konsisten.
- **Loop harian ringan.** Tiga blok + LANJUTKAN + Tidur; satu pasien poli 3–5 menit; satu kunjungan ±6 menit. Debrief malam ringkas, storylet, agenda besok, refleksi, arsip manual.

### 2b. Gesekan dan temuan (nomor = urutan prioritas saya)

| # | Temuan | Di mana | Berat | Catatan |
|---|---|---|---|---|
| 1 | **Tembok topik edukasi kembali, satu tingkat di bawah.** Katalog kini 173 topik dalam 6 laci: Tindakan Fisik & Teknik Khusus **62**, Kepatuhan & Kontrol **37**, Higiene **36**. Verdikt DeepThink Juli menetapkan ambang ±15 item per daftar datar — laci-laci ini sendiri melampauinya 2–4×. Pencarian ada, tapi mahasiswa belum tentu tahu kosakata labelnya. | Terapi → tab Edukasi | Sedang–tinggi | Keputusan taksonomi (konten), bukan engine. Lihat §4 ide 6. |
| 2 | **Titik amatan kunjungan tanpa penanda sebelum diklik.** Di tangkapan layar statis, kelima hotspot tidak terlihat sampai diklik; sesudah diklik muncul pin bernomor. Pohon aksesibilitas memberi nama "Amati lebih dekat (titik n dari 5)", jadi pengguna keyboard justru lebih diuntungkan. | Kunjungan tahap 1 | Sedang (perlu konfirmasi Electron) | Bila memang tanpa afordans hover/pulsa, mahasiswa bisa melewatkan bukti COM-B. Mungkin disengaja ("amati pelan-pelan"). Perlu dicek apakah ada animasi yang tidak tertangkap screenshot. |
| 3 | **Nudge edukasi kehilangan kata di pembaca layar.** Nama aksesibel tombol: "💬 Pasien belum diedukasi — buka tab ; konseling ikut dinilai." — nama tab dirender sebagai elemen bergaya, hilang dari teks. | Terapi, bawah tombol Selesai | Rendah | Perbaikan copy/aria kecil. |
| 4 | **Toast "Buku Saku diperbarui (+1)" vs Buku Saku "0 dijumpai / 144 belum".** Kasus KB (Z30.0) bukan bagian 144, jadi toast menjanjikan sesuatu yang tidak muncul di layar Buku Saku. | Setelah pasien KB | Rendah | Konsistensi pesan; verifikasi apakah entri non-144 memang disengaja tak ditampilkan. |
| 5 | **Tooltip menimpa keterangan bantuan.** Saat tombol "Stempelkan Diagnosis" nonaktif, tooltip "Stempelkan diagnosis di lembar." menutupi kalimat panduan di bawahnya. | Diagnosis | Rendah | Kosmetik; pola dual `title`+`data-tip` per pedoman. |
| 6 | **Daftar lab meloncat setelah memesan.** Setelah klik "Pesan", laci tetap terbuka tapi pandangan kembali ke kotak cari (fokus berpindah), item yang baru dipesan keluar dari pandangan. | Pemeriksaan → lab | Rendah | Perlu konfirmasi Electron; kemungkinan fokus-manajemen. |
| 7 | **Tiga opsi diagnosis** rata-rata 3,06 per kasus — masih persis isu dosier 22 Agustus §5.4. Tebakan acak 33%. | Diagnosis | Sedang (validitas asesmen) | Sudah menunggu dokter; §4 ide 9 memberi jalan tanpa LLM. |
| 8 | **Tutorial pasien pertama** mengunci semua kecuali satu tombol; tombol terkunci tampil sebagai tombol tanpa label. | Klinik Hari 1 | Rendah | Sesuai keputusan "onboarding railroaded"; cukup pastikan label "Ikuti langkah tutorial" terbaca. |

Tidak ada crash, tidak ada error konsol, tidak ada state janggal selama tiga hari permainan.

---

## 3. Bedah file lampiran

### 3a. Apa isinya

Satu komponen `App` dengan ±30 `useState`. Alur stasiun 5 fase:

1. **Briefing** — emoji pasien + deskripsi gestalt ("Pria pucat memegangi perut"), keluhan masuk, tanda vital triase.
2. **Anamnesis** — obrolan teks bebas; Gemini berperan pasien dengan *system prompt* yang memuat **diagnosis sebenarnya** ("JANGAN PERNAH SEBUTKAN"), 6 chip pertanyaan cepat, input suara (`webkitSpeechRecognition`).
3. **Pemeriksaan** — tombol pemeriksaan fisik per region (semua dibuat Gemini, semua dianggap relevan) + lab dengan biaya rupiah dan flag `isIndicated`; "Tagihan Virtual" bertambah; meter "stabilitas" turun 5 tiap lab dipesan.
4. **Diagnosis & Tx** — diagnosis kerja & banding teks bebas dengan tombol "saran AI" (Gemini mengembalikan 6 nama), pembangun resep (nama/jumlah/rute/frekuensi) dengan saran obat AI, tindakan & edukasi teks bebas.
5. **Assessment** — scorecard 4 kotak (Akurasi Dx, Ketelitian Fisik, Ketepatan Lab, Efisiensi Biaya), perbandingan tatalaksana pemain vs "Gold Standard KEMENKES", pembahasan. Unduh CPPT sebagai HTML cetak. Riwayat stasiun di dashboard dengan rata-rata akurasi & efisiensi.

Mode: "IGD Acak" (spesialisasi diundi dari 30) atau "Learning" (pilih spesialisasi). Timer 15 menit opsional. Kasus baru dibuat Gemini tiap stasiun dengan larangan mengulang diagnosis sebelumnya.

### 3b. Penilaian jujur — fitur demi fitur

| Fitur file lampiran | PRIMERA | Catatan |
|---|---|---|
| Kasus dibuat LLM tiap sesi | Kasus ditulis manusia, diadjudikasi dokter, ber-sumber, ber-hash | Kelas risiko yang PRIMERA habiskan berbulan-bulan untuk dihapus (insiden ICD-poisoning repo lama). |
| Pasien obrolan bebas (LLM) | Deck 6–10 pertanyaan + persona 7 gaya + gauge Sabar | Rasa obrolan bebas memang lebih "hidup". Lihat §4 ide 8 untuk versi tanpa LLM. |
| Diagnosis teks bebas + saran AI | 3 opsi banding + stempel TEGAK/SUSPEK | Kalibrasi kepastian tidak ada di file lampiran sama sekali. |
| Penilaian diagnosis | **cocok kata**: benar bila ada satu kata >3 huruf dari nama diagnosis emas di ketikan pemain | Mengetik "dengue" pada kasus "Dengue Hemorrhagic Fever with Warning Signs" = Tepat. Mengetik "hemorrhagic" saja juga Tepat. |
| Ketelitian fisik | **semua pemeriksaan harus diklik** (100% atau "Terlewat") | Kebalikan pilar PRIMERA: PF shotgun dihadiahi, tidak ada region tak relevan. |
| Lab | flag `isIndicated` dari LLM; −25 per lab tak perlu; tagihan rupiah | PRIMERA: `relevan` per kasus, kapitasi terbakar nyata, `hasilBesok`, `konfirmasiWajib`. |
| Resep | nama/jumlah/rute/frekuensi — **tidak dinilai**, hanya ditampilkan di samping gold standard | PRIMERA: obatBenar/alternatif/opsional/salah-umum, firewall alergi, interaksi, stewardship antibiotik, terapi kritis. |
| Edukasi & tindakan | teks bebas, tidak dinilai | PRIMERA: prioritas-3 dari 173 topik, edukasiKritis, 62 tindakan. |
| Disposisi | tidak ada | PRIMERA: pulang/observasi/rujuk, SBAR, SISRUTE 4 RS, justifikasi rujuk, guillotine RRNS. |
| Konsekuensi | tidak ada (stasiun berdiri sendiri) | PRIMERA: konsekuensi bernama 5–8 hari kemudian, karma keluarga, surveilans. |
| Umpan balik | instan ("Insting diagnostik yang bagus!") + scorecard | Ditolak juri GDD §11; PRIMERA menaruh umpan balik di debrief. |
| Waktu | timer 15 menit nyata, habis → langsung scorecard | GDD §3 memilih turn-based; tekanan waktu dinilai bukan kompetensi. |
| Determinisme | tidak ada; hasil LLM berbeda tiap kali | PRIMERA: seed + jejak aksi → dosier terverifikasi dosen (M6). |
| Penyimpanan | Firebase (online, anonim) | Save lokal atomik, offline, 3 slot + autosave. |
| Rekam medis | CPPT HTML cetak per stasiun | Lembar Periksa di layar; **belum ada cetak/ekspor per pasien** (hanya ekspor arsip JSON akhir). |
| Riwayat | dashboard semua stasiun + buka ulang scorecard | `selesaiHariIni` saja; **tidak ada arsip encounter lintas hari** yang bisa dibuka ulang (Jejak Perawatan melacak episode, bukan debrief). |
| Gestalt visual pasien | emoji + kalimat "tampak" | Potret + kutipan keluhan; **belum ada kalimat kesan pertama**. |
| Mode belajar per spesialisasi | ada (30 spesialisasi) | **Tidak ada mode latihan bebas**; Karier memakai Director. |

### 3c. Kelemahan teknis yang jangan ditiru

- **Diagnosis emas dimasukkan ke prompt pasien.** Satu pertanyaan "kamu sakit apa sebenarnya?" atau *prompt injection* sederhana bisa membocorkannya.
- **Kunci API kosong di klien** (`const apiKey = ""`) — bila diisi, kunci itu terbaca semua pengguna.
- **`alert()` dan `window.confirm()`** untuk semua konfirmasi — dilarang di pedoman UI PRIMERA (DialogGame).
- **Sinkronisasi state ke Firebase tiap 1 detik** untuk 18 field sekaligus — pola yang rapuh untuk 50 pengguna lab.
- **Skor "stabilitas" pasien turun 5 tiap lab dipesan** tanpa hubungan klinis — meter teater, persis yang GDD §2 larang ("tanpa teater").
- Satu berkas 2.000 baris, tanpa test.

---

## 4. Yang layak diambil — sebelas ide, masing-masing dengan harga dan risikonya

Kode warna sentuhan: **[D]** display saja (tanpa REVISI_ENGINE, aman kapan pun) · **[K]** konten/katalog (perlu `CONTENT_RELEASE` naik bila mengubah kunci jawaban) · **[E]** engine/skor (REVISI_ENGINE, tunggu jendela Golden Master).

### Ide 1 — Debrief menampilkan TEKS temuan PF relevan yang terlewat **[D]**
Sekarang: "Pemeriksaan relevan terlewat: Jantung." File lampiran menulis "Berikut temuan yang Anda lewatkan" beserta hasilnya. Pasca-skor-terkunci, ini bukan kebocoran (preseden: clue & rincian skor sudah tampil post-hoc). Nilai pedagogis tinggi: mahasiswa tahu **apa yang seharusnya ia temukan**, bukan hanya "ada yang terlewat". Kerja: kecil (`PanelHasil.tsx` + `temuanUntukRegion` yang sudah ada). Perhatian: bila kasus ber-varian, ambil dari `kasusEfektif`.

### Ide 2 — Rupiah terbuang per lab tak relevan di debrief **[D]**
Chip "Lab tak relevan ×2" menjadi "Lab tak relevan ×2 · Rp 35.000 terbakar dari kapitasi". Angka sudah ada (biaya lab dipotong kapitasi saat pesan). Kerja: sangat kecil. Membuat pilar manajemen terasa di tiap pasien, bukan hanya di surat Bendahara bulanan.

### Ide 3 — Cetak / ekspor rekam medis per pasien **[D]**
Lembar Periksa sudah berbentuk rekam medis lengkap (kop Puskesmas, No. RM, SOAP). Tambah tombol "Cetak RM" di PanelHasil dan/atau Jejak Perawatan → HTML cetak (di Electron lewat `printToPDF` di proses utama, di preview lewat `window.print`). Nilai: portofolio mahasiswa untuk dosen, bahan refleksi, dan mendukung narasi akreditasi `rmLengkap`. Risiko: nol pada skor. Kerja: kecil–sedang (template cetak + IPC).

### Ide 4 — Kalimat "kesan pertama" di ruang tunggu **[K, display]**
File lampiran: "Pria tampak lemas, wajah pucat berkeringat, memegangi perut kanan atas." Secara klinis, kesan *sakit ringan/sedang/berat* sebelum vital adalah keterampilan nyata (triase visual). PRIMERA punya `pemeriksaanFisik.umum` tapi baru tercetak setelah diklik. Usul: field opsional `kesanPertama` (≤12 kata) ditampilkan di kartu ruang tunggu. **Pagar anti-bocor:** kalimatnya harus generik-observasional (tampak sakit sedang, memegangi perut), bukan menyebut tanda patognomonik. Butuh keputusan dokter apakah ini "apa yang dokter lihat" (sah) atau petunjuk (bocor). Kerja: konten 210 kasus bertahap (bisa mulai dari 73 inti), tidak menyentuh skor.

### Ide 5 — Mode Latihan Bebas per kategori (formatif) **[D + layar baru]**
File lampiran punya "Mode Learning: pilih spesialisasi". PRIMERA belum punya cara berlatih poli tanpa menjalani hari. Usul: dari layar judul, "Latihan Poli" → pilih kategori SKDI (respirasi, kulit, KIA, …) atau "acak" → pasien berturut-turut memakai `buatPasienDariKasus` + `aksiKlinik` + `nilaiEncounter` yang sudah ada, ditandai `formativePrototype`-style sehingga **tidak** menyentuh Dex/rapor/kapitasi/konsekuensi. Nilai: alat belajar mandiri menjelang Ujian untuk 50 mahasiswa; juga jalur cepat untuk dokter menguji kasus. Risiko: kunci jawaban paket Ujian tidak terpengaruh (kasus Ujian sudah dilindungi rotasi paket & seed flavor; latihan hanya memperlihatkan kasus yang memang ada di Karier). Kerja: sedang (layar + store, tanpa engine baru). Ini ide bernilai tertinggi menurut saya, tapi butuh keputusan apakah dikerjakan **sebelum** trial (bermanfaat untuk kohort September) atau sesudahnya (disiplin scope).

### Ide 6 — Perbaiki taksonomi laci edukasi 173 topik **[K, katalog]**
Terapkan ulang heuristik DeepThink Juli (±15 per daftar datar) pada laci yang kini 62/37/36: pecah "Tindakan Fisik & Teknik Khusus" menurut organ/alat (inhaler & napas · kulit & luka · mata-THT · tulang-sendi · …), "Kepatuhan & Kontrol" menurut penyakit kronis vs akut. Tag depan `[Organ]` sudah ada — manfaatkan untuk auto-grup. Kerja: konten metadata saja, nol skor, nol hash. Butuh dokter menyetujui skema kategori (keputusan taksonomi = keputusan pedagogis).

### Ide 7 — Baris pertanyaan universal (alergi, obat rutin, RPD, RPK) **[K, konten menyeluruh]**
Chip cepat file lampiran mengingatkan: empat pertanyaan ini wajib di semua anamnesis nyata. Di PRIMERA, pertanyaan alergi hanya ada di kasus yang memuatnya. Menjadikannya universal berarti tiap kasus butuh jawaban yang konsisten dengan `pasien.alergi`/`alergiTrap` — jawaban default "tidak ada" bisa bertabrakan dengan pasien ber-alergi hasil roll. Jadi ini **bukan** tambahan konten mekanis; butuh aturan engine kecil (jawaban alergi dibaca dari state pasien, bukan dari teks statis). Utang teknis ini sudah tercatat di ROADMAP ("jawaban anamnesis statis vs status pasien dinamis"). Kerja: sedang, menyentuh [E]. Tunda ke jendela REVISI berikutnya.

### Ide 8 — Anamnesis ketik bebas, dipetakan ke bank pertanyaan (tanpa LLM) **[E, pilot]**
Ide terbesar dari file lampiran adalah *rasa* bertanya dengan kata sendiri. Versi PRIMERA yang tetap deterministik: kotak "Tanya dengan kata-katamu…" di atas deck; ketikan dicocokkan (fuzzy + fonetik + sinonim per pertanyaan, mesin yang sama dengan pencarian obat) ke pertanyaan kasus → dispatch `TANYA` biasa; tak cocok → pasien menjawab "Maksudnya bagaimana, Dok?" dengan potongan Sabar kecil. Jejak aksi tetap sama (id pertanyaan), replay tetap sah, tidak ada LLM. Konstruk berubah dari *recognition* ke *recall* — persis pertanyaan Q1 dosier edukasi Juli yang dijawab DeepThink "konsistensi antar-fase vs diferensiasi per-kompetensi". Perlu: sinonim per pertanyaan (konten 210 kasus × 7 pertanyaan — besar), ambang kecocokan, dan keputusan apakah deck tetap tampil (hibrida) atau tersembunyi (recall murni; berisiko frustrasi). Rekomendasi: pilot hibrida di Karier saja setelah trial, ukur pemakaiannya lewat jejak.

### Ide 9 — Kolam distraktor diagnosis lebih besar tanpa LLM **[E + K]**
File lampiran "menyelesaikan" opsi diagnosis dengan teks bebas + saran AI. PRIMERA bisa menjawab isu 3-opsi (dosier §5.4) tanpa itu: opsi = banding kasus (3) + 1–2 distraktor **dari kelompok organ yang sama** di katalog 144, dipilih seed flavor per pasien, disaring agar tidak pernah = diagnosis kasus lain yang identik namanya (audit label Agustus sudah menyiapkan `namaDeck`). Menyentuh `KOMIT_DIAGNOSIS`/validasi opsi → REVISI. Tunggu keputusan dokter atas §5.4 dulu.

### Ide 10 — Arsip debrief lintas hari ("Buku Rekam Medis") **[E kecil + D]**
Dashboard file lampiran membuka ulang scorecard stasiun lama. PRIMERA hanya menyimpan `selesaiHariIni`; debrief kemarin hilang. Menyimpan `PenilaianEncounter` ringkas (tanpa clue panjang) per encounter ke state = perubahan skema save (bukan skor) → perlu migrasi & pertimbangan ukuran save 90 hari × 4 pasien. Nilai: refleksi mingguan, "kasus yang sering meleset" untuk Director sudah dilayani Leitner Dex, jadi nilai tambahnya sedang. Prioritas rendah.

### Ide 11 — Timer OSCE opsional di Mode Latihan **[D]**
Hanya sebagai jam tampilan (tidak memengaruhi skor, tidak memaksa fase), untuk membiasakan tempo OSCE. Murah, tapi hanya masuk akal bila Ide 5 dibangun. Jangan pernah masuk Ujian.

**Sengaja tidak diambil:** input suara (gimmick, dukungan browser tidak merata di Electron), meter "stabilitas" teater, saran obat/diagnosis AI (membocorkan jawaban dan memindahkan penalaran ke mesin), pembangun resep berdosis tanpa validasi (keputusan M10.5 O1 "tanpa dosis" dipertahankan — mengajarkan dosis tanpa validasi lebih buruk daripada tidak mengajarkan).

---

## 5. Soal LLM — tiga posisi yang mungkin

| Posisi | Isi | Penilaian |
|---|---|---|
| **A. Tanpa LLM saat runtime** (keadaan sekarang) | Semua deterministik, offline, terverifikasi dosen | Tetap posisi yang benar untuk alat **asesmen** di lab FK spek rendah tanpa jaminan internet. |
| **B. LLM sebagai alat penulis (offline, sebelum rilis)** | Draf kasus dalam skema PRIMERA → adjudikasi dokter → adversarial review | Sudah persis yang dilakukan batch lab & tinjauan 70 kasus. Bisa diperluas: draf `kesanPertama`, sinonim pertanyaan (Ide 4, 8), varian presentasi Tingkat-A. Aman karena hasilnya masuk katalog bertanda tangan, bukan dihasilkan di depan mahasiswa. |
| **C. LLM saat runtime untuk pasien obrolan bebas** | Hanya di Mode Latihan, tidak pernah di Ujian, kasus tetap kunci kebenaran, LLM hanya "menyuarakan" | Butuh internet + kunci API di server perantara + biaya per mahasiswa + penjaga bocor diagnosis + kebijakan bila LLM mengarang gejala yang bertentangan dengan kasus. Untuk 50 mahasiswa sekali kohort, ongkos operasional & risiko klinis tidak sepadan dengan nilai "rasa obrolan". Ide 8 memberi 70% rasanya dengan 0% risikonya. |

**Rekomendasi:** A + B sekarang; C hanya sebagai eksperimen pasca-trial bila ada dana dan infrastruktur kelas, dan tidak pernah masuk jalur skor.

---

## 6. Rencana bertingkat (belum dikerjakan — menunggu persetujuan)

### Tingkat 0 — Wajib sebelum trial, bukan bagian brainstorm ini
1. Perbaiki P1 kartu Kegiatan (jalur UI, test regresi 3 kartu KLB).
2. Dokter memutuskan jalur full trial (dosier 22 Agustus §3) dan 4 pertanyaan 23 Agustus.
3. Bila konten/skor berubah: `CONTENT_RELEASE` naik (pelajaran beta.17), regenerasi artefak M13 dari pohon bersih.

### Tingkat 1 — Murah, display-only, aman sebelum trial (perkiraan total 1–2 sesi kerja)
- Ide 1 (teks temuan PF terlewat), Ide 2 (rupiah terbuang), Ide 3 (cetak RM).
- Perbaikan §2b #3, #4, #5 (copy/aria/tooltip).
- Verifikasi di Electron: §2b #2 (afordans hotspot) dan #6 (lompatan daftar lab).

### Tingkat 2 — Butuh keputusan dokter; dikerjakan sebelum atau sesudah trial sesuai keputusan
- Ide 5 (Mode Latihan Bebas) — bernilai tinggi untuk kohort September, kerja sedang.
- Ide 6 (taksonomi laci edukasi) — konten, butuh skema kategori disetujui.
- Ide 4 (kesan pertama) — konten bertahap, butuh pagar anti-bocor disetujui.

### Tingkat 3 — Jendela REVISI_ENGINE berikutnya (pasca-trial)
- Ide 8 (anamnesis ketik bebas, pilot hibrida Karier), Ide 7 (pertanyaan universal + jawaban ber-state), Ide 9 (kolam distraktor), Ide 10 (arsip debrief).

### Tidak dikerjakan
- LLM runtime, timer yang memengaruhi skor, cocok-kata, resep berdosis tanpa validasi, Firebase/online, saran AI diagnosis/obat, meter stabilitas.

---

## 7. Pertanyaan untuk dokter (jawab bernomor saja)

1. **Full trial:** jalur A/B/C/D dosier 22 Agustus — mana? (Rekomendasi saya: **B+C** — dokter menyentuh 47 kasus taruhan tinggi, 70 kasus yang sudah ditinjau Claude diratifikasi lewat dosier, 51 sisanya ditinjau dengan pola yang sama; trial mulai dengan label dua-tingkat yang sudah ada di kode.)
2. **P1 Kegiatan:** setuju diperbaiki di jalur UI sekarang? (Rekomendasi: ya, sebelum apa pun yang lain.)
3. **Tingkat 1** (Ide 1, 2, 3 + perbaikan kecil): lanjut? (Rekomendasi: ya.)
4. **Ide 5 Mode Latihan Bebas:** sebelum trial atau sesudah? (Rekomendasi: sesudah P1 dan Tingkat 1, sebelum kohort mulai, dengan batas tegas "formatif, tanpa dunia".)
5. **Ide 4 kesan pertama:** apakah kalimat observasional generik dianggap "yang dokter lihat" (sah) atau petunjuk (bocor)? (Rekomendasi: sah, dengan larangan menyebut tanda patognomonik dan audit otomatis kata terlarang.)
6. **Ide 6 taksonomi edukasi:** setuju laci >15 dipecah menurut organ/alat? (Rekomendasi: ya.)
7. **Ide 8 anamnesis ketik bebas:** layak dipilot pasca-trial di Karier? (Rekomendasi: ya, hibrida; ukur lewat jejak sebelum diputuskan permanen.)
8. **LLM:** setuju posisi A+B, tolak C untuk kohort ini? (Rekomendasi: ya.)

---

## 8. Lampiran — peta padanan berkas

| Konsep file lampiran | Padanan PRIMERA (berkas) |
|---|---|
| `STATIC_CASE` / JSON kasus Gemini | `src/content/types.ts` `KasusKlinis`; kasus di `src/content/kasus/*.ts`, `src/content/lab/*.ts` |
| `sendToAI` (pasien) | `aksiKlinik` → `TANYA` di `src/engine/clinic.ts`; jawaban `jawabanUntuk` (persona) |
| `handlePhysicalExam` | `PERIKSA` + `temuanUntukRegion` (`clinic.ts`); UI `DeckPemeriksaan.tsx`, `FigurTubuh.tsx` |
| `handleOrderLab` + `virtualBill` | `PESAN_LAB` (kapitasi terpotong di reducer); `hasilBesok`, `bolehTundaTerapi` di katalog lab |
| `calculateScores` | `nilaiEncounter` (`clinic.ts` ±baris 503–900) |
| Scorecard fase 5 | `PanelHasil.tsx` + `RefleksiKlinis.tsx` (Duel/Teach-back) |
| `generateSOAPHtml` (CPPT) | `LembarPeriksa.tsx` (di layar; belum ada cetak) |
| Dashboard riwayat | `Rapor.tsx`, `JejakPerawatan.tsx`, `LaporanAkhir.tsx`; `GameState.klinik.selesaiHariIni` |
| Mode Learning per spesialisasi | belum ada; kandidat layar baru memakai `director.ts` `buatPasienDariKasus` |
| Timer | tidak ada (GDD §3) |
