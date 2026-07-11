# DEEPTHINK — Ronde CODEX-31: Keputusan Tersisa (2026-07-11)

> **Untuk:** DeepThink (reviewer strategis desain-pedagogi, BUKAN auditor kode &
> BUKAN penentu fakta medis). CODEX sudah memverifikasi *apakah kodenya benar*;
> Dr. Wirayuda (dokter) memutuskan *fakta medis*. Kamu memutuskan *apakah desain
> mekanik/skor/kebijakan-rilis yang tersisa masuk akal* — output = PENILAIAN +
> REKOMENDASI berperingkat + trade-off, bukan daftar bug, bukan kode, bukan
> klaim medis baru.
> **Tanggal:** 2026-07-11 · Basis: HEAD `claude/vigorous-bose-f66bc6` commit
> `d3f3eeb` ("fix(codex-31): 17 fix mekanis-aman dari audit CODEX read-only
> 2026-07-11"), folder `primera-desktop/`. `REVISI_ENGINE=20`, **652 test**
> (dijalankan ulang `npx vitest run` saat menulis dossier ini — 63 file test,
> 652 lulus, 0 gagal — bukan angka lama yang diasumsikan).
> **Pendahulu:** `docs/DEEPTHINK_M10_5.md` (kamu jawab Q1-Q8: 5 keputusan
> skoring + 2 P0-desain + urutan-kerja M10.5 — SUDAH selesai/diterima
> 2026-07-10, lihat `docs/M10_5_FIDELITAS.md`).

**Kenapa dossier ini beda dari pendahulunya:** `DEEPTHINK_M10_5.md` menjawab
paket keputusan M10.5 yang sudah tuntas dan disepakati. Dossier INI berasal
dari sumber terpisah — audit CODEX baru (31 temuan, snapshot commit
`d325766`, 2026-07-11) yang dikerjakan **paralel** dengan Dr. Wirayuda
sendiri mengerjakan 17 temuan cross-check PNPK Kemenkes + 5 item M10.5
miliknya sendiri. Claude menggarap laporan CODEX-31 ini: ~17 temuan yang
mekanis-aman (tidak butuh keputusan desain — jelas bug atau jelas cara
memperbaikinya) **SUDAH difix langsung** dan menghasilkan commit `d3f3eeb` di
atas (daftar lengkap 17 item itu ada di `docs/CODEX_AUDIT_DOSSIER.md` §62).
Dokumen INI memuat **sisa** temuan dari audit yang sama — 13 item yang
genuinely butuh keputusan desain/kebijakan, bukan sekadar bug yang bisa
ditambal tanpa trade-off. Sebagian besar berbeda kelas dari M10.5: beberapa
menyentuh skor/mekanik (REVISI_ENGINE-bearing, kena freeze pre-Golden-Master),
tapi sebagian lain murni infra-rilis (code signing, versi Electron, rotasi
log) yang **tidak** menyentuh skor sama sekali dan karena itu tidak terikat
tenggat Golden Master.

---

## §0 KONTEKS RINGKAS (baca dari nol; self-contained)

PRIMERA = game desktop edukasi dokter FKTP Indonesia (Electron/TypeScript/
React). Pemain = dokter fresh-grad menjalani stase **90 hari** ("Karier") atau
**Mode Ujian 30 hari** (jalur asesmen utama). Pemakai target: **±50 mahasiswa
FK, DINILAI dari skor game, redeploy ±September 2026.** Developer solo (Dr.
Wirayuda, dokter) + AI (Claude sebagai builder/verifier, CODEX sebagai
auditor read-only, DeepThink sebagai reviewer strategi). Integritas pedagogis
& asesmen adalah kepentingan produk inti — bukan sekadar hiburan.

**Loop klinik (UKP):** tiap pasien = 1 `KasusKlinis` (67 kasus poli + 5 kasus
IGD). Alur per-encounter: Anamnesis → Pemeriksaan Fisik → (Lab opsional) →
Diagnosis (pilih ICD-10 + stempel TEGAK/SUSPEK) → Tatalaksana (resep dari
~97 obat) → Edukasi (pilih topik, baki 3 slot) → Disposisi (tuntas-di-FKTP
atau rujuk RS). **Loop masyarakat (UKM):** 16 keluarga binaan via kunjungan
rumah berstruktur babak (hotspot info → dialog dinilai kualitas wawancara-
motivasi/MI → intervensi → hasil berhasil/partial/gagal/diusir). Skor akhir
dari 4 komponen: **UKP 35 · UKM 35 · Manajemen 15 · Resiliensi 15.**

**Istilah kunci:** SKDI = level kompetensi kasus (4A = tuntas mandiri FKTP;
3B = diagnosis+stabilisasi+WAJIB rujuk; 3A = diagnosis+rujuk). `REVISI_ENGINE`
= versi semantik mesin-skor; setiap bump memaksa dossier lama mahasiswa jadi
"tidak dapat diverifikasi" saat replay server-side — sehingga field yang
mengubah jawaban-benar/skor/verifikasi HARUS selesai sebelum freeze Golden
Master, sedangkan field kosmetik (teks debrief, narasi) aman diubah kapan
saja. "Referral Guillotine" = penalti otomatis bila pemain over-merujuk
kasus yang seharusnya tuntas-mandiri. Prolanis = program pengendalian
penyakit kronis (roster peserta HT/DM dengan kontrol bulanan). Karma =
mekanik krisis-keluarga terjadwal yang bisa dicegah lewat kunjungan rumah
yang berhasil. Golden Master = build akhir Agustus 2026 setelah semua fix
ber-REVISI dikumpulkan, lalu mesin skor dibekukan (freeze) untuk satu
semester penuh.

---

### CODEX#6 — Diare Rencana Terapi B: gate observasi sungguhan

**Fakta:** Clue kasus `diare_akut_anak` menjanjikan prosedur dua-tahap eksplisit — "ORALIT 75 mL/kgBB ... selama 3–4 JAM DI PUSKESMAS ... lalu NILAI ULANG hidrasi" dengan percabangan membaik/memburuk (`src/content/kasus/kasusInfeksi.ts:600`) — tapi mekanik disposisi tidak pernah mengecek waktu atau reassessment apa pun. Di UI, tombol PULANGKAN (`src/renderer/src/screens/klinik/DeckDisposisi.tsx:173`, gate `disabled` di baris 178) dan tombol OBSERVASI (baris 189, gate baris 190) sama-sama hanya digerbang `punyaDiagnosis`/tutorial — tidak ada beda interval/waktu. Di scoring, `rasioTerapi`/`skorTerapi` (`src/engine/clinic.ts:495` & `542`) murni fungsi resep vs `obatBenar`, dan `disposisiTepat` (`clinic.ts:598-602`) menyamakan `'pulang'` dengan `'observasi'` untuk semua kasus non-rujuk-non-PRB. Di `src/engine/reducer.ts`, klik OBSERVASI dicatat sebagai `'pulang'` di STEMPEL (baris 285), dan pengecualian konsekuensi `observasiMenungguLab` (baris 378-383) hanya berlaku bila ada lab `hasilBesok:true` yang relevan — `feses_rutin` tidak punya field itu, jadi untuk kasus ini `pantasKonsekuensi` (baris 384-386) tidak pernah membedakan mahasiswa yang skip observasi dari yang benar-benar observasi. Ringkas: state `'observasi'` ada, tapi tidak fungsional — gap ini sudah lama berlaku untuk *semua* kasus non-rujuk di engine, bukan cuma diare.

**O-A:** Bangun gate observasi penuh — tambah state durasi/interval pada encounter, langkah reassessment (recheck hidrasi/vital) sebagai prasyarat sebelum disposisi `'pulang'` bisa dipilih, dan percabangan skor berdasarkan hasil reassessment (membaik→Rencana A, memburuk→Rencana C/rujuk). REVISI_ENGINE-bearing penuh: state encounter baru, scoring (`skorTerapi`/`disposisiTepat`) berubah, UI `DeckDisposisi` berubah — dan karena pola "Rencana B" ini generik (dehidrasi, potensi dengue), desainnya perlu digeneralisasi, bukan cuma untuk diare.

**O-B:** Gate ringan — tambah field `butuhObservasiDulu` pada kasus tertentu; klik PULANGKAN tanpa OBSERVASI lebih dulu kena penalti `skorTerapi`, tanpa simulasi waktu/interval sungguhan. Lebih kecil dari O-A tapi tetap REVISI_ENGINE-bearing (field baru + logika scoring baru); risiko: gate "checkbox" begini bisa terasa artifisial dan tak benar-benar mengajarkan reassessment klinis, hanya menghukum urutan klik.

**O-C:** Jangan bangun gate apa pun sekarang — biarkan observasi tetap state naratif/dekoratif seperti kasus non-rujuk lain, dan parkir keputusan desain generalisasi ke scope M13/M14 (saat 144/225 kasus mungkin menambah lebih banyak pola "Rencana B"). Nol footprint REVISI_ENGINE, konsisten dengan disiplin freeze M10.5, tapi tidak menutup gap struktural — clue tetap menjanjikan prosedur yang mekanik tak pernah verifikasi.

**Lean kami:** Condong ke O-C untuk siklus ini — pola observasi=alias-pulang sistemik lintas semua kasus non-rujuk, bukan spesifik diare, jadi membangun gate ad-hoc (O-A/O-B) hanya untuk kasus ini berisiko desain yang tak generalisasi saat kasus Rencana-B-style lain ditambahkan di M13.

**Pertanyaanmu:** Kalau M13 memang akan menambah kasus dehidrasi/dengue bertipe "Rencana B" lain, apakah worth menaikkan ini jadi keputusan desain mekanik generalisasi (O-A) sekarang — sebelum Golden Master — supaya tidak perlu retrofit skor/state per-kasus nanti, atau risiko over-engineering satu mekanik observasi generik sebelum tahu berapa banyak kasus sebenarnya akan memakainya lebih besar daripada manfaat menahannya ke O-C?

---

### CODEX#2c — Pisahkan build developer vs build ujian (PRIMER_DEV)

**Fakta:** `DEV` didefinisikan di `src/main/index.ts:14` sebagai `(!app.isPackaged && !!process.env['ELECTRON_RENDERER_URL']) || process.env['PRIMER_DEV'] === '1'` — klausa kedua tidak mensyaratkan `app.isPackaged === false`, jadi `PRIMER_DEV=1` menyalakan `DEV` sama saja di build dev maupun di installer produksi yang sudah dipaket. Flag ini menggerbangi dua perilaku: guard anti-DevTools (blokir F12/Ctrl+Shift+I/J/C + auto-close DevTools jika terbuka) di `src/main/index.ts:195` (`if (!DEV) { ... }`, blok baris 193-205), dan pelucutan menu aplikasi bawaan di `src/main/index.ts:277` (`if (!DEV) Menu.setApplicationMenu(null)`). Komentar di `src/main/index.ts:5-13` menyatakan eksplisit ini disengaja sebagai *escape hatch* pengembang dan mengklaim "TIDAK di build kelas" — namun tak ada apa pun secara teknis yang mencegah env var polos ini dipakai di build kelas selain fakta bahwa mahasiswa tidak (secara default) tahu namanya. `app.asar` hasil build tidak diobfuskasi (dikonfirmasi sebelumnya via `npx asar list` pada instalator NSIS di `dist/`), sehingga siapa pun yang mengekstraknya dan membaca `main/index.js` bisa menemukan string literal `'PRIMER_DEV'` dan mengaktifkannya sebelum menjalankan `.exe` produksi untuk membuka DevTools + mengembalikan menu bar.

**O-A:** Pisahkan lewat build flag waktu-kompilasi, bukan env var runtime — dua target build eksplisit (mis. `pack:dev` vs `pack:ujian`) dengan konstanta `DEV` di-*inline* saat build (electron-vite `define`), sehingga binary ujian secara fisik tidak membawa cabang kode DEV maupun string `PRIMER_DEV` sama sekali. Bukan REVISI_ENGINE-bearing (tak menyentuh skor/adjudikasi), tapi menambah pipeline rilis (dua target, checklist ganda "build mana yang dipush ke lab") dan perlu smoke-test kedua jalur build.

**O-B:** Perberat syarat aktivasi tanpa mengubah arsitektur satu-binary — ganti nama env var jadi token acak yang digenerate ulang tiap rilis (tak pernah dicommit di sumber terbuka) dan/atau syaratkan file marker tambahan yang tak ikut ter-*package*. Lebih murah dikerjakan (tidak menyentuh pipeline build), tapi tetap security-by-obscurity: siapa pun yang mengekstrak asar dari rilis spesifik itu tetap menemukan nilai yang bekerja untuk rilis itu.

**O-C:** Terima risiko seperti sekarang, tanpa perubahan kode — mendokumentasikan sebagai batasan-disadari. Eksploitasi butuh mahasiswa yang tahu istilah `PRIMER_DEV`, mau mengekstrak `app.asar`, dan sempat menjalankan `.exe` lewat env var alih-alih klik ikon biasa; untuk kelas 50 mahasiswa yang diawasi tatap muka saat ujian, jalur ini kalah realistis dibanding risiko lain yang sudah ditangani (edit save file langsung → dimitigasi HMAC+replay di #3a/#3b).

**Lean kami:** tidak condong ke mana pun — trade-off antara effort pipeline dua-target (O-A) vs risiko residual obscurity (O-B) vs terima-risiko-terdokumentasi (O-C) sama-sama masuk akal tergantung seberapa nyata ancaman "mahasiswa membongkar asar" dinilai untuk konteks kelas yang diawasi langsung.

**Pertanyaanmu:** Mengingat integritas skor sebenarnya sudah dijamin oleh mekanisme replay-server-side (bukan oleh DevTools-lock di client, lihat #3a/#3b di klaster yang sama) — apakah membangun pipeline build dua-target (O-A) sepadan untuk menutup celah yang eksploitasinya butuh niat + skill ekstraksi asar dari mahasiswa yang diawasi tatap muka saat ujian, atau ini kasus yang lebih tepat didokumentasikan sebagai batasan-disadari (sejalan dengan §3a/§3c pada klaster yang sama) ketimbang menambah satu pipeline build baru untuk solo-dev?

---

### CODEX#3c — Kebijakan proctoring/heuristik kecepatan (anti-joki)

**Fakta:** Docstring `verifikasi.ts:1-8` menyatakan eksplisit bahwa HMAC hanya deterrent dan pertahanan sesungguhnya adalah replay; sepanjang pipeline `verifikasiDossier` (`src/engine/verifikasi.ts:434-591`) — cap ukuran, cek bentuk, cocokkan sidik jari pack, ikatan NIM↔seed (`:524`), lalu banding tally/hari/paketUjian/seedKurikulum/tamat/skor/badge hasil replay (`:553-587`) — tidak ada satu pun titik yang memeriksa waktu-per-aksi atau bukti "manusia ini yang mengerjakan real-time": `JejakAksi` sendiri didefinisikan sebagai alias murni dari `Action` (`src/engine/state.ts:483,589-590`), tanpa field timestamp apa pun. Lapisan forensik terpisah yang memang ada (`src/engine/telemetriAudit.ts:55-89`, didesain sesuai `docs/TELEMETRI_WALLCLOCK.md:21-40`) hanya mendeteksi dua pola save-scumming — hari mundur tanpa sesi baru (`:77-80`) dan jejak menyusut (`:81-85`) — dan dokumen itu sendiri menegaskan "Progres wall-clock vs hari HANYA informatif (bukan bukti)" serta mengakui log bisa dihapus manual, "bukan anti-cheat tamper-proof" (`docs/TELEMETRI_WALLCLOCK.md:35-36,44-46`). Tidak ada mekanisme apa pun (kode atau kebijakan tertulis) yang mencoba memverifikasi bahwa NIM pemegang seed ujian adalah orang yang benar-benar duduk mengerjakan stase itu.

**O-A:** Tambahkan heuristik kecepatan-minimum sebagai sinyal forensik tambahan di `telemetriAudit.ts` (mis. rasio jejakLen/waktu-berlalu di luar rentang wajar), dengan pola yang sama seperti dua deteksi yang sudah ada — tetap di luar skor/replay, jadi bukan REVISI_ENGINE-bearing, tapi menambah risiko false-positive terhadap mahasiswa cepat yang jujur (sudah diakui sebagai trade-off eksplisit di dokumen desain saat ini).

**O-B:** Pertahankan status quo — nyatakan secara eksplisit di kebijakan ujian (bukan di kode) bahwa perangkat lunak tidak menjamin identitas pengerja, dan letakkan seluruh beban anti-joki pada kontrol prosedural (pengawasan tatap muka saat sesi ujian). Tidak ada perubahan kode maupun skema dossier.

**O-C:** Tambahkan pengikat sesi tambahan yang bukan biometrik (mis. device/session fingerprint di luar NIM, dicatat di log telemetri) untuk menaikkan biaya berbagi-akun — sejalan filosofi "deterrent, bukan rahasia kuat" yang sudah dipakai untuk HMAC; ini mengubah skema log/dossier (butuh bump versi format, bukan `REVISI_ENGINE` karena tak menyentuh replay/skor) tapi tetap tidak membuktikan siapa yang mengetik.

**Lean kami:** tidak condong ke mana pun — ini murni pertanyaan kebijakan pengawasan ujian, bukan celah teknis yang bisa ditambal tanpa keputusan trade-off.

**Pertanyaanmu:** Mengingat filosofi PRIMER yang sudah tertulis sebagai "alat edukasi, bukan kompetisi berperingkat ketat", apakah heuristik kecepatan (O-A) sepadan dengan risiko salah-tandai mahasiswa cepat yang jujur, ataukah anti-joki identitas ini sebaiknya secara sadar didokumentasikan sebagai di luar jangkauan software client dan diserahkan penuh ke pengawasan prosedural (O-B)? Kalau condong ke instrumentasi tambahan, sinyal apa yang punya rasio true-positive/false-positive cukup tinggi untuk layak masuk log forensik dosen?

---

### CODEX#10 — Formula KBK: pengali kapitasi pakai IKS-desa, bukan 3 indikator riil

**Fakta:** Pengali kapitasi bulanan dihitung murni dari rata-rata IKS RW binaan: `reducer.ts:1642-1645` — `rwBerdata` (RW dengan `iks > 0`) dirata-rata jadi `iksDesa`, lalu `pengali = iksDesa > 0.8 ? 1.3 : iksDesa >= 0.5 ? 1.0 : 0.8`, dan `masukan = Math.round(6_000_000 * pengali)` — dipakai lagi di notifikasi `reducer.ts:1651-1652,1661`. Formula KBK BPJS sungguhan memakai 3 indikator institusi FKTP — Angka Kontak (AK, target >150 permil), Rasio Rujukan Rawat Jalan Non-Spesialistik (RRNS, target **<2%**), Rasio Peserta Prolanis Terkendali (RPPT, target >5%) — domainnya kinerja klinik, bukan IKS keluarga/PIS-PK yang jadi basis game saat ini. Infrastruktur RRNS sebagian sudah ada dan tak terpakai di blok ini: `tally.rujukanTotal`/`tally.rujukanNonSpesialistik` diakumulasi per-encounter di `clinic.ts:603,667` lalu `reducer.ts:301-302`, dan sudah dipakai di dua tempat lain — gerbang badge `badge.ts:35,40` dan skor rujukan `scoring.ts:48,51` — tapi blok kapitasi (`reducer.ts:1642-1652`) tidak membacanya sama sekali. RPPT punya kandidat sumber data (`prolanis.roster`, field `terkontrol` di `state.ts` sekitar area Prolanis) tapi belum diagregasi jadi rasio populasi; AK (kontak per-peserta per-bulan) belum ditrack mekanik apa pun di codebase.

**O-A:** Sambungkan RRNS yang sudah ada, biarkan AK/RPPT menyusul nanti — ganti komponen `iksDesa` di formula pengali dengan (atau campur berbobot bersama) RRNS dari `tally` yang sudah terakumulasi — kode paling murah karena datanya sudah dihitung, tinggal dibaca di blok kapitasi. Konsekuensi: pengali jadi sebagian mencerminkan kinerja rujukan riil, tapi masih bukan KBK penuh (2 dari 3 indikator hilang) — REVISI_ENGINE-bearing (mengubah basis ekonomi-game musim ini, kena freeze bucket pre-Golden-Master karena menyentuh field kapitasi/skoring).

**O-B:** Bangun ketiga indikator (AK+RRNS+RPPT) sebelum Golden Master — tambah mekanik tracking AK (kontak per peserta/bulan — belum ada padanan sama sekali), agregasi RPPT dari roster Prolanis, lalu gabung dengan RRNS jadi formula 3-komponen sesuai bobot KBK BPJS asli. Paling akurat secara klinis-institusional, tapi AK butuh desain mekanik baru dari nol dan menambah beban ke Golden Master akhir Agustus — REVISI_ENGINE-bearing, cakupan besar.

**O-C:** Pertahankan IKS-desa sebagai simplifikasi sadar, cuma perjelas framing — tak ubah formula; cukup ganti label/copy notifikasi (`reducer.ts:1652,1661`) agar eksplisit menyebut ini "proksi PIS-PK", bukan menyiratkan KBK BPJS sungguhan. Termurah, tak REVISI_ENGINE-bearing (teks-saja), tapi tak menutup gap konflasi domain yang sudah diidentifikasi — pemain tetap belajar model ekonomi yang salah nama.

**Lean kami:** tidak condong ke mana pun — O-A murah karena RRNS "gratis" untuk disambung, tapi menyentuh ekonomi-game musim berjalan tetap butuh sign-off eksplisit, bukan sekadar quick-win teknis.

**Pertanyaanmu:** dengan Golden Master akhir Agustus dan AK yang butuh mekanik baru dari nol, apakah menyambungkan RRNS saja (O-A, komponen parsial-riil) sepadan mengingat hasilnya masih "KBK palsu" berlabel benar — atau justru O-C (framing jujur atas simplifikasi yang ada) lebih defensibel secara pedagogis sampai ada slot waktu untuk O-B penuh pasca-freeze?

---

### CODEX#13b — Model data Prolanis: satu peserta tak bisa komorbid HT+DM

**Fakta:** `PesertaProlanis.jenis` adalah union tunggal `'ht' | 'dm'` (`src/engine/state.ts:295`) — satu record hanya bisa menyimpan satu kondisi kronis. Pembentukan roster di `bentukRosterProlanis` mengecek kedua kondisi dari `kondisi?: string[]` warga (`src/content/types.ts:377`), lalu **mengorbankan salah satu** kalau keduanya `true`: `const jenis: 'ht' | 'dm' = ht ? 'ht' : 'dm'` (`src/engine/reducer.ts:1936`) — HT selalu menang, DM didiamkan begitu saja. Ini bukan skenario teoretis: `Musa` (kepala keluarga, RW 3) sudah didefinisikan dengan `kondisi: ['dm_tipe2', 'hipertensi_esensial']` (`src/content/keluarga/desaB.ts:517`), sehingga di roster Prolanis ia hanya terdaftar sebagai peserta HT — komorbid DM-nya hilang dari drift, skor, dan alur kasus komplikasi sejak awal permainan. `driftProlanis` (`src/engine/kegiatan.ts:619-626`) juga hanya menggerakkan satu `param` sesuai `p.jenis` (SBP untuk ht, GDS untuk dm) — struktur saat ini tak punya tempat untuk dua parameter berjalan simultan pada satu pasien.

**O-A:** Biarkan struktur record-tunggal; perlakukan "peserta menang salah satu kondisi" sebagai simplifikasi sadar (dokumentasikan di sini, bukan fix). Tak REVISI_ENGINE. Risiko: karakter seperti Musa terus salah-representasi tanpa batas waktu, dan penulis konten warga baru bisa tanpa sadar membuat komorbid lain yang diam-diam hilang.

**O-B:** Ubah `jenis` jadi kumpulan kondisi (mis. `kondisi: ('ht'|'dm')[]`) + `driftProlanis` menggerakkan param HT dan DM independen pada record yang sama + kartu kegiatan/kasus komplikasi baru untuk skenario komorbid. REVISI_ENGINE-bearing (ubah bentuk `PesertaProlanis` = ubah skema save), butuh keputusan turunan soal bagaimana satu jawaban "intervensi tepat" memengaruhi dua parameter sekaligus.

**O-C:** Pertahankan record bertipe tunggal, tapi pecah warga komorbid jadi dua entri roster (satu `'ht'`, satu `'dm'`) yang berbagi `keluargaId` sama. Perubahan tipe minimal (tak REVISI_ENGINE untuk `state.ts`, hanya logika `bentukRosterProlanis`), tapi menduplikasi identitas pasien di UI roster bulanan ("Musa" muncul 2 slot) dan mengasumsikan dua kunjungan kontrol terpisah untuk satu pasien nyata — janggal secara naratif/PIS-PK (biasanya 1 kunjungan menangani kedua kondisi sekaligus).

**Lean kami:** condong menghindari O-B menjelang Golden Master akhir Agustus (REVISI_ENGINE + reshape save schema berisiko tinggi di jendela sesempit ini), tapi O-A membiarkan bug representasi nyata (kasus Musa) tanpa batas — jadi antara O-A-sementara-dengan-catatan vs O-C-stopgap murni soal toleransi risiko waktu, bukan soal mana yang lebih benar secara klinis.

**Pertanyaanmu:** mengingat #13a dan #13c sudah menyerap kapasitas keputusan Prolanis sesi ini (lihat referensi terpisah), apakah #13b layak jadi keputusan mandiri sekarang, atau cukup dicatat sebagai defisiensi terdokumentasi untuk M13 (dengan O-A sebagai status-quo eksplisit) sampai ada slot waktu untuk O-B yang lebih tuntas? Dan kalau butuh stopgap cepat, apakah duplikasi record ala O-C bisa diterima secara pedagogis (pemain melihat "dua pasien" dari satu keluarga) atau itu sendiri menciptakan kebingungan yang lebih buruk dari bug yang mau diperbaiki?

---

### Addendum — Q6/Asih (M10.5, MASIH PENDING): CODEX#4/#5a menggeneralisasi ke 16 keluarga

Ini bukan pertanyaan baru. `docs/M10_5_FIDELITAS.md:410-414` sudah mencatat item ini sebagai PENDING:

> 🔴 Masih perlu KEPUTUSAN Dr. Wirayuda (artifact Bagian D, bagian "Tambahan"): **[#2] Asih storyline** — Q6 Opsi-a ternyata butuh keputusan MEKANISME (bukan cuma ya/tidak): kartu ke-4 terpisah tak akan berfungsi krn kunjungan single-select; + keputusan SCOPE (gerbang karma generik dipakai 8 arc lain, semua atau allowlist Asih-saja?)

Audit CODEX #4/#5a menyodorkan data tambahan yang relevan langsung ke sub-keputusan SCOPE tersebut.

**Fakta (diverifikasi ulang terhadap kode saat ini):**

- Formula `berhasil` yang jadi objek Q6 adalah SATU fungsi bersama (`selesaikanKunjungan`), dipakai oleh seluruh keluarga tanpa cabang per-arc: `intervensiCocok = kartu?.cocokUntuk.includes(skenario.hambatanSebenarnya)`, `hipotesisBenar = kj.hipotesis === skenario.hambatanSebenarnya`, `berhasil = !kj.diusir && hipotesisBenar && intervensiCocok` (`src/engine/kunjungan.ts:271-273`, identik dgn kutipan §7b lama di `M10_5_FIDELITAS.md:507-508`).
- Gerbang karma yang dibahas Q6 memakai `hasil.berhasil` per-kunjungan, bukan `arcTamatBerhasil` (dideklarasikan `false` di `src/engine/kunjungan.ts:341`, baru di-set `true` di baris 350 saat `arcIndex >= totalSkenario`, rentang `341-350`): `if (adaKarma && hasil.berhasil) { jadwal = jadwal.filter(...); ...; t.karmaDicegah += 1 }` (`src/engine/reducer.ts:766-772` — nomor baris bergeser dari 729 di kutipan lama krn komentar fix #5b disisipkan sesi ini di blok yg sama; logikanya tidak berubah).
- Grep `namaKeluarga:` di `src/content/keluarga/*.ts` mengonfirmasi 16 keluarga di 6 file desa (desaA-F), semuanya memakai skema `Hambatan`/`Intervensi.cocokUntuk` yang sama persis (`types.ts:392`) — jadi cacat formula #4 memang generik ke seluruh 16, bukan spesifik Asih.
- Tapi jadwal `karma_igd` sendiri TIDAK otomatis ada di ke-16: `src/engine/init.ts:106-120` membuatnya hanya kalau `skenarioPertama?.karma` didefinisikan di konten (`if (!skenarioPertama?.karma) continue`). Grep `karma:\s*\{` di konten keluarga → 9 kemunculan total (desaA×1, desaC×1 [Asih], desaD×2, desaE×4, desaF×1). Artinya "8 arc lain" di dok (9 dikurangi Asih) sudah akurat untuk *scope karma* — CODEX tidak mengoreksi angka itu.
- Yang BELUM ada di dok: formula `berhasil` yang sama juga men-tally `t.kunjunganBerhasil += 1` untuk SEMUA 16 keluarga tanpa syarat karma (`src/engine/reducer.ts:746`), dan tally itu masuk `rasioKunjungan` berbobot 0.25 dari skor UKM(35) (`src/engine/scoring.ts:87-89`). Jadi cacat formula #4 sudah aktif memengaruhi skor UKM untuk ke-16 keluarga hari ini — terlepas dari keputusan SCOPE karma nanti.

**Efek praktis terhadap 2 sub-keputusan yang pending:**

Untuk **MEKANISME**: karena ke-16 keluarga berbagi tipe `Intervensi`/`Hambatan` yang identik (bukan hanya arc Asih), penyelesaian struktural utk kartu-ke-4/eskalasi Asih (mis. field opsional baru di level tipe `Intervensi`) otomatis reachable oleh ke-15 keluarga lain begitu dibangun — sisa pekerjaan untuk memperluas ke arc lain jadi murni penulisan konten (kartu eskalasi per-arc), bukan pekerjaan engine tambahan.

Untuk **SCOPE**: kalau fix Q6 diimplementasi sebagai perubahan pada formula bersama `berhasil` (kunjungan.ts:271-273) atau gerbang karma bersama (reducer.ts:766-772) — yang merupakan jalur paling murah secara kode — efeknya otomatis menjangkau seluruh 16 keluarga (termasuk `rasioKunjungan`/skor UKM utk 7 keluarga yang bahkan tidak punya karma sama sekali), bukan hanya 9 yang berkarma. Sebaliknya, "allowlist Asih-saja" yang benar-benar circumscribed hanya tercapai bila fix ditulis sebagai override per-keluarga (mis. gate tambahan `keluargaId === 'keluarga_asih'` atau flag konten khusus) yang justru menambah percabangan baru di luar pola generik yang sudah ada — implementasi allowlist di sini lebih mahal, bukan lebih murah, dibanding opsi generik.

**Lean kami:** tidak condong ke mana pun — ini murni memperkaya data utk keputusan SCOPE yang sudah menunggu.

**Pertanyaanmu:** mengingat opsi generik ternyata jalur implementasi yang lebih murah (fix satu formula bersama) sementara opsi allowlist-Asih-saja butuh percabangan per-keluarga baru yang belum ada presedennya di codebase — apakah itu cukup menggeser kalkulus SCOPE ke arah generik, atau risiko memperluas dampak skor ke 15 keluarga lain (termasuk 7 yang sama sekali tidak berkarma) tetap membuat allowlist lebih aman untuk Golden Master, walau lebih mahal secara implementasi?

---

### CODEX#14 — Bridge karma UKP↔UKM: kecocokan identitas penuh (nama/usia/gender)

**Fakta:** Bagian aman sudah masuk sesi ini: `rw` pasien "keluarga binaanmu" kini ditimpa dengan `rw` keluarga asli (`src/engine/director.ts:313-314`, `pack.keluarga[keluargaId]?.rw`), dan tabrakan nama antar-pasien harian sudah dicegah lewat parameter `namaTerpakai` (`director.ts:56,66-73`, dipakai di `director.ts:295`). Yang sengaja TIDAK disentuh, dengan komentar eksplisit menandainya sebagai keputusan terpisah: `nama`, `usia`, `jenisKelamin` pasien tetap hasil roll acak dari `buatPasienDariKasus` (`director.ts:63-65,74`) meski pasien itu ditempeli `keluargaId` + `bonusTrust:true` (`director.ts:305-314`). UI menampilkan `p.nama` dan `{p.usia} th · {labelJk(p.jenisKelamin)}` bersanding chip "Keluarga binaanmu" (`src/renderer/src/screens/klinik/RuangTunggu.tsx:61-64,82-88`) — sehingga pemain tetap bisa melihat pasien ber-nama/usia/gender yang tak cocok dengan anggota mana pun di `AnggotaKeluarga` milik keluarga yang diklaim sebagai binaannya.

**O-A:** Biarkan seperti sekarang (hanya RW yang dijamin cocok) — pemilihan kasus pagi tetap murni kurikulum/epidemiologi; chip "Keluarga binaanmu" dibaca sebagai "salah satu warga dari keluarga ini", bukan klaim identitas 1:1. Tidak ada perubahan kode, bukan REVISI_ENGINE-bearing.

**O-B:** Best-effort match — pakai anggota keluarga asli HANYA bila usianya cocok rentang demografi kasus, fallback ke roll acak bila tak ada yang cocok. Ini pola yang sudah diverifikasi sebelumnya (`kontenKeluarga?.anggota.find(a => a.usia dalam rentang kasus)` lalu override `nama/usia/jenisKelamin` bila ketemu) — tidak mengubah kasus mana yang terpilih (kurikulum tetap penentu), hanya menimpa identitas pasien yang sudah terpilih. Konsekuensi: chip "Keluarga binaanmu" kadang tetap tak 1:1 (saat tak ada anggota yang usianya cocok), jadi separuh-fix, bukan penuh. Tidak REVISI_ENGINE-bearing (tak mengubah kasus/tatalaksana/skdi).

**O-C:** Paksa kecocokan penuh — jadikan komposisi `AnggotaKeluarga` sebagai salah satu filter pemilihan kasus pagi untuk slot binaanAkrab. Menjamin identitas selalu konsisten, tapi mengubah aturan seleksi antrian pagi (bukan lagi murni kurikulum/epidemiologi untuk slot ini) — bisa membatasi variasi kasus yang bisa dikirim per keluarga (mis. keluarga tanpa anggota lansia tak pernah bisa mengirim kasus geriatri via jalur ini). Berpotensi REVISI_ENGINE-bearing tergantung apakah menyentuh logika pemilihan kasus yang dihitung skor/pack-hash.

**Lean kami:** condong ke O-B sebagai titik tengah murah (memakai kembali draf yang sudah diverifikasi), tapi tidak menutup O-A sebagai pilihan sah bila chip memang dimaksud longgar sejak awal.

**Pertanyaanmu:** Apakah chip "Keluarga binaanmu" dimaksud sebagai klaim identitas 1:1 (sehingga mismatch nama/usia/gender adalah cacat integritas yang harus ditutup, minimal best-effort seperti O-B), atau sebagai penanda afiliasi longgar ("salah satu dari keluarga ini") yang sudah cukup benar dengan RW yang kini konsisten — dan jika O-B/O-C dipilih, haruskah cakupannya diperluas sekalian ke bridge negatif (`karma_igd`) atau cukup arah positif ini saja?

---

### CODEX#16 — Lantai skor terapi 70 tanpa resep sama sekali

**Fakta:** Floor diterapkan di `clinic.ts:560-566`: bila `enc.disposisi==='observasi'` dan minimal satu lab yang dipesan punya `pack.lab[id].hasilBesok` DAN `kasus.lab.find(l=>l.id===id)?.relevan===true`, serta `obatBerbahaya===0`, maka `skorTerapi = Math.max(skorTerapi, 70)`. Syaratnya sama sekali tidak menuntut resep non-kosong: bila `enc.resep=[]`, `obatBerbahaya` (`clinic.ts:499-501`, filter obat berbahaya yang ADA di `enc.resep`) otomatis 0, dan `rasioTerapi` (`clinic.ts:495-496`, `totalSlot>0 ? (...)/totalSlot : 1`) otomatis 0 selama kasus punya slot terapi — jadi skor mentah 0 tetap terselamatkan jadi 70 gratis. Dari 7 kasus berlab `hasilBesok`+`relevan`, 5 punya `obatBenar`/`obatAlternatif` non-kosong sehingga benar-benar exploitable — termasuk GAD (`kasusKiaJiwa.ts:669` tsh relevan, `:674` `obatBenar:['fluoksetin_20']`) dan Tifoid, yang narasi konsekuensinya sendiri eksplisit memperingatkan "Bila antibiotik tidak dituntaskan ... risiko perforasi usus dan perdarahan saluran cerna pada minggu ke-3" (`kasusInfeksi.ts:486`). 2 kasus lain (Depresi Ringan `kasusKiaJiwa.ts:805`, Obesitas `kasusMetabolikMsk.ts:390`) punya `obatBenar:[]` by design (komentar `kasusKiaJiwa.ts:802-804` — lini pertama non-farmakologis) sehingga `rasioTerapi` sudah 100 tanpa floor; di situ floor teknis terpicu tapi no-op, bukan celah nyata. Komentar `clinic.ts:554-559` mengonfirmasi niat floor ini sah: melindungi "observasi legitimate sambil menunggu lab" dari dihukum sebagai gagal-terapi — celahnya adalah floor tidak membedakan "menunda satu obat sambil observasi wajar" dari "tidak meresepkan apa pun".

**O-A:** Biarkan seperti sekarang — floor tetap berlaku tanpa syarat resep. Tidak REVISI-bearing, tapi mempertahankan windfall 70 di 5 kasus (termasuk Tifoid/TB yang secara klinis paling berisiko ditunda tanpa terapi apa pun).

**O-B:** Tambah syarat generik `rasioTerapi > 0` (atau `enc.resep.length > 0`) sebelum floor berlaku — pasien yang benar-benar nol resep dievaluasi rasio aslinya (0), floor hanya melindungi yang sudah memulai sebagian terapi sambil menunggu lab. REVISI-bearing (mengubah formula `skorTerapi`), tapi seragam untuk semua kasus, tanpa percabangan per-diagnosis.

**O-C:** Turunkan/nihilkan floor khusus untuk kasus dengan antibiotik lini-pertama wajib (Tifoid/TB), karena "tunggu besok tanpa terapi apa pun" secara klinis lebih berbahaya di situ dibanding DM/GAD. REVISI-bearing, lebih presisi tapi menambah percabangan per-diagnosis ke rubrik yang mendekati freeze Agustus.

**Lean kami:** Condong ke O-B karena memperbaiki celah inti tanpa menambah percabangan per-kasus di rubrik yang mendekati freeze, tapi belum jelas apakah itu cukup untuk risiko Tifoid/TB yang lebih tajam.

**Pertanyaanmu:** O-B menutup celah "nol resep sama sekali", tapi gate `resep.length>0` bisa lolos dengan SATU obat sembarangan yang tak relevan sekalipun (bukan bagian `obatBenar`/`idAlternatifSah`) — apakah itu cukup untuk memvalidasi "sudah memulai terapi legitimate", atau floor semestinya lebih ketat (mis. resep yang diperhitungkan harus bagian dari gold-standard kasus itu sendiri)? Dan apakah trade-off kompleksitas O-C sepadan mengingat hanya Tifoid/TB yang punya argumen klinis setajam itu, dibanding DM/GAD yang keterlambatan sehari lebih dapat ditoleransi?

---

### CODEX#19b — `sbarSkor` dihitung tapi tak pernah pengaruhi grade/tally

**Fakta:** `sbarSkor` dideklarasikan dan dihitung di `clinic.ts:616-643` (hanya bila `disposisi === 'rujuk' && enc.sbar`, dengan anti-cheat cukup elaborate: syarat panjang≥20/kolom, syarat data-numerik di kolom S, bonus penyebutan diagnosis, penalti -50 copy-paste antar-kolom), lalu di-spread kondisional ke objek hasil di `clinic.ts:671`. Formula `nilaiTotal` (`clinic.ts:648-653`) hanya menjumlahkan `BOBOT_DIAGNOSIS/ANAMNESIS/TERAPI/PEMERIKSAAN/EDUKASI` — `sbarSkor` tidak muncul di sana sama sekali. Grep menyeluruh `sbarSkor` di `src/` (di luar test) hanya menghasilkan 4 file: `clinic.ts` (hitung+spread), `state.ts:131` (deklarasi tipe `sbarSkor?: number`), `PanelHasil.tsx:58-61` (dirender sebagai chip "SBAR X/100", warna hijau bila ≥60 / kuning bila <60), dan `DeckDisposisi.tsx:96-98` (cuma komentar yang mereferensikan ambangnya, bukan pemakaian nilai). Tidak ada satu pun kemunculan di `reducer.ts` — tidak masuk `tally`, tidak memicu surat/konsekuensi apa pun. Sebagai pembanding, `disposisiTepat` — yang **juga** tak masuk `nilaiTotal` — tetap punya jalur konsumsi nyata: `reducer.ts:357` (`kuasai = nilai.diagnosisBenar && nilai.disposisiTepat`, menggerakkan naik/turunnya `bintang` penguasaan kasus) dan `reducer.ts:558` (`tally.rujukanTepat`). `sbarSkor` tidak punya jalur setara — benar-benar berhenti di chip kosmetik.

**O-A:** Masukkan `sbarSkor` ke `nilaiTotal` sebagai komponen berbobot baru (mis. `BOBOT_SBAR`), dengan redistribusi lima bobot lain agar total tetap 1.0. REVISI_ENGINE-bearing: mengubah grade huruf untuk setiap encounter yang berujung rujuk dengan SBAR, jadi termasuk perubahan rubrik pre-freeze.

**O-B:** Ikuti pola `disposisiTepat`: alirkan `sbarSkor` ke `tally` terpisah di `reducer.ts` (mis. ambang skor tinggi/rendah memicu surat pujian/teguran kapus atau memengaruhi progres `bintang` khusus rujukan) tanpa menyentuh `nilaiTotal`/grade huruf. Tidak mengubah grade, tapi tetap REVISI_ENGINE-bearing karena menambah konsekuensi gameplay baru dari nilai yang sebelumnya no-op.

**O-C:** Biarkan `sbarSkor` murni kosmetik seperti sekarang, tapi tambahkan komentar keputusan-sadar di `clinic.ts` yang menyatakan itu eksplisit dan turunkan sebagian anti-cheat (copy-paste -50, syarat data-numerik) yang saat ini terasa berlebihan untuk sekadar chip tampilan. Tidak REVISI_ENGINE-bearing — tidak ada perubahan rubrik, murni dokumentasi + kemungkinan pemangkasan kode.

**Lean kami:** tidak condong ke mana pun — ketiadaan komentar rationale di kode ini (padahal basis kode konsisten menulis rationale untuk keputusan non-obvious) membuat O-C terasa seperti merasionalisasi kealpaan, tapi anti-cheat SBAR yang serumit itu juga aneh dibangun murni untuk kosmetik jika O-C memang niat awal.

**Pertanyaanmu:** apakah `sbarSkor` seharusnya memengaruhi grade huruf (O-A, mengubah distribusi bobot yang sedang menuju freeze M10.5), memengaruhi konsekuensi/tally terpisah tanpa mengubah grade (O-B, pola `disposisiTepat`), atau tetap kosmetik secara sengaja (O-C) — dan bila O-A/O-B, apakah SBAR pantas dinilai untuk SEMUA rujukan atau hanya rujukan yang juga `disposisiTepat` (mencegah pemain merujuk kasus yang seharusnya ditangani sendiri lalu "menang" dari SBAR yang rapi)?

---

### CODEX#28a — Indikator karma tampil sebelum kunjungan Hari-3 terbuka

**Fakta:** `karmaTerlihat(kel: KeluargaState): boolean` di `petaUtil.ts:20-23` menentukan visibilitas tanda karma murni dari `kel.karmaAktif` (truthy) + minimal satu `indikator[...].sumber !== 'belum'` — tidak ada parameter/pengecekan `hari`. Tombol kunjungan baru terbuka di `HARI_BUKA_KUNJUNGAN = 3` (`reducer.ts:39`, guard reducer `reducer.ts:677`, guard UI `PetaDesa.tsx:89-90`), tapi EMPAT pemanggil `karmaTerlihat` memakainya tanpa gerbang hari tambahan: `PetaDesa.tsx:57` (menandai RW di peta), `PetaDesa.tsx:172` (badge pada roster keluarga binaan), `KartuKeluarga.tsx:71` (kelas `peta-keluarga--karma` pada kartu keluarga), dan `MejaKerja.tsx:150` (`if (karmaTerlihat(kel) && kel.karmaAktif)`, menggerakkan rekomendasi "Kader mendengar kondisinya memburuk — prioritaskan" di layar Meja Kerja). `karmaAktif` sendiri di-set di SATU tempat saat inisialisasi game — `init.ts:123` (`keluarga[id] = { ...kel, karmaAktif: { jadwalId, jatuhTempoHari: ... } }`) — yakni Hari 1, independen dari progres hari. Secara konten, `jatuhTempoHari` termuda di seluruh pack adalah 6 (`desaA.ts:415`), jadi indikator dini ini tidak pernah benar-benar memblokir penyelesaian sebelum deadline sungguhan (selalu ada buffer ≥3 hari setelah kunjungan dibuka).

**O-A:** Biarkan seperti sekarang — perlakukan sebagai "game juice" sengaja: pemain melihat sinyal karma sejak Hari 1-2 tapi belum bisa menindaklanjuti via kunjungan, menciptakan tensi antisipatif. Tanpa perubahan kode, tidak REVISI_ENGINE-bearing.
**O-B:** Gating tampilan — `karmaTerlihat` menerima `hari` dan mengembalikan `false` bila `hari < HARI_BUKA_KUNJUNGAN`, sesuai draf CODEX; perlu update signature + EMPAT caller (`PetaDesa.tsx:57/172`, `KartuKeluarga.tsx:71`, `MejaKerja.tsx:150`). Murni UI-timing (tidak menyentuh `karmaAktif`/skor), tidak REVISI_ENGINE-bearing, tapi menghilangkan visibilitas krisis aktif selama 2 hari pertama.
**O-C:** Kompromi tampilan-redup — indikator tetap muncul sebelum Hari 3 tapi dengan afeksi visual berbeda (mis. warna pudar/ikon "terdeteksi, tunggu kunjungan") ketimbang badge identik dengan status "siap ditindak". Butuh state tiga-nilai (bukan boolean) + penyesuaian CSS/label di keempat titik pakai; sedikit lebih invasif dari O-B namun juga tidak REVISI_ENGINE-bearing.

**Lean kami:** tidak condong ke mana pun.

**Pertanyaanmu:** apakah indikator karma yang tampil sebelum kunjungan bisa dilakukan (Hari 1-2) adalah efek pacing yang memang diinginkan (pemain "tahu tapi belum bisa bertindak"), atau sebaiknya digating ke Hari 3 agar UI tidak menyiratkan aksi yang belum tersedia — dan bila digating, apakah lebih baik biner (O-B) atau bertahap/redup (O-C) mengingat buffer jatuhTempoHari minimum sudah cukup longgar (≥3 hari) untuk menyerap gating tanpa risiko pemain kehabisan waktu?

---

### CODEX#30b — Code signing installer Windows

**Fakta:** `package.json:21-39` (blok `build`) mendefinisikan `productName` (baris 23: `"PRIMERA - Puskesmas Pagi"`), `build.win` (baris 33-35, hanya `icon: "build/icon.ico"`), dan `build.nsis` (baris 36-39, hanya `oneClick`+`shortcutName`) — tak ada satu pun field signing (`certificateFile`, `certificatePassword`, `CSC_LINK`/`CSC_KEY_PASSWORD`, `signtoolOptions`, `forceCodeSigning`, dsb.). Grep menyeluruh atas repo untuk `certificateFile|CSC_LINK|forceCodeSigning|signtool|codesign` tidak menemukan konfigurasi apa pun (satu-satunya match, `src/content/types.ts:353`, adalah kecocokan kebetulan pada kata "redesign:", bukan kode signing). Konsekuensinya: baik `dist/win-unpacked/PRIMERA - Puskesmas Pagi.exe` maupun installer NSIS keluaran `npm run dist` akan tidak bertanda tangan digital sama sekali, sehingga Windows SmartScreen/Defender kemungkinan besar menandainya "Unknown Publisher" saat 50 mahasiswa pertama kali menjalankannya di lab.

**O-A:** Beli sertifikat code-signing (OV/EV dari CA seperti DigiCert/Sectigo) dan tambahkan `certificateFile`/`certificatePassword` (atau `CSC_LINK`/`CSC_KEY_PASSWORD` via env var) ke `build.win` di `package.json`. Menghilangkan warning sepenuhnya dan memberi identitas penerbit resmi, tapi ada biaya berulang tahunan + proses verifikasi identitas (CA butuh dokumen legal/organisasi) yang perlu waktu — realistis tidak selesai sebelum redeploy September 2026 kalau belum dimulai. Bukan REVISI_ENGINE-bearing (murni konfigurasi build/packaging, tidak menyentuh skor/data kasus).

**O-B:** Terima risiko warning apa adanya, karena environment terkendali (lab kampus, instalasi terjadwal, bukan distribusi publik lewat internet terbuka) — tidak ada perubahan kode; cukup dipastikan asisten lab tahu ini bukan malware. Nol biaya, nol effort, tapi tiap mahasiswa akan melihat dialog "Windows protected your PC" dan butuh diyakinkan satu-per-satu (potensi kebingungan/kepanikan menit-menit awal sesi kelas). Tidak REVISI_ENGINE-bearing.

**O-C:** Mitigasi murah tanpa sertifikat CA — buat catatan instruksi eksplisit (mis. selipkan di `MULAI PRIMER.bat` atau README instalasi) berisi langkah "More info → Run anyway", dan/atau evaluasi self-signed certificate untuk sekadar konsistensi hash antar build (self-signed TIDAK menghapus SmartScreen warning tanpa reputasi, jadi manfaatnya terbatas dibanding O-A). Bisa dikombinasikan dengan O-B; nol biaya CA tapi tidak menghilangkan warning, hanya mengurangi kebingungan saat itu muncul. Tidak REVISI_ENGINE-bearing.

**Lean kami:** condong ke O-B+O-C dikombinasikan (terima warning + instruksi eksplisit ke asisten lab), mengingat skala 50 mahasiswa di lab terkontrol dan timeline sertifikat OV/EV yang berisiko tak selesai sebelum September 2026 — tapi tidak menutup O-A kalau anggaran/waktu ternyata tersedia.

**Pertanyaanmu:** untuk deployment 50 mahasiswa di lab kampus terkontrol (bukan distribusi publik), apakah trade-off biaya+waktu proses CA untuk sertifikat code-signing (O-A) sepadan dibanding cukup menerima SmartScreen warning dengan instruksi eksplisit ke asisten lab (O-B/O-C) — atau ada opsi menengah (mis. sertifikat lebih murah/self-signed, atau submission Microsoft SmartScreen reputation building tanpa EV cert) yang lebih pas untuk skala dan timeline ini?

---

### CODEX#31b — Rotasi log telemetri (opsional, low-severity)

**Fakta:** `TELEMETRI_FILE()` mengarah ke satu file tunggal `telemetri.jsonl` di `userData` (`src/main/index.ts:114`), ditulis murni via `fs.appendFile` di dalam handler `telemetri:append` (`src/main/index.ts:120-128`, panggilan `appendFile` di baris 122) — grep ulang seluruh `index.ts` untuk `rotat`/`truncate`/`MAX_LINES`/`slice(-` tidak menemukan mekanisme pemangkasan atau rotasi apa pun. Penulisan hanya terjadi setelah autosave sukses (`src/renderer/src/store.ts:224-231`, dengan komentar eksplisit "HANYA catat bila save BERHASIL"), dan payloadnya kecil serta tetap: `{t, sesi, hari, blok, jejakLen}` (`store.ts:231`) — sehingga pertumbuhan realistis untuk skenario 50 mahasiswa/semester diperkirakan di kisaran ratusan KB, bukan risiko disk nyata. `docs/TELEMETRI_WALLCLOCK.md` mendokumentasikan file ini sebagai jejak forensik anti-save-scum tapi tidak pernah menyebut rotasi sebagai requirement, jadi ini murni gap-belum-diputuskan, bukan bug maupun keputusan sadar yang sudah terdokumentasi.

**O-A:** Biarkan apa adanya (no-op) — file terus tumbuh tanpa batas sepanjang masa pakai game, tapi pada skala 50 mahasiswa/semester tetap realistis di kisaran ratusan KB–low single-digit MB per semester. Tidak menyentuh apa pun (bukan REVISI_ENGINE, file ini bukan bagian pack-hash/answer-key).
**O-B:** Tambah cap sederhana berbasis jumlah baris (mis. saat handler dipanggil, kalau isi file sudah > N baris, pangkas ke N baris terakhir sebelum append) — perubahan kecil di `index.ts`, tidak mengubah skema entri maupun cara baca (`telemetri:read` tetap satu file), bukan REVISI_ENGINE-bearing, tapi secara sengaja membuang baris forensik terlama.
**O-C:** Rotasi berbasis waktu/ukuran (mis. nama file jadi `telemetri-YYYY-MM.jsonl`, atau rotate saat melewati ambang KB tertentu) — tak ada baris forensik yang hilang, tapi menambah kompleksitas kecil pada `telemetri:read` (harus tahu file/rentang mana yang dibaca) dan berpotensi menyentuh `src/engine/telemetriAudit.ts` bila modul itu berasumsi satu file tunggal.

**Lean kami:** condong ke O-A untuk saat ini, mengingat severitas sudah dikonfirmasi rendah dan pertumbuhan realistis jauh di bawah ambang masalah — tapi ini item kecil/opsional, jadi tidak keberatan bila DeepThink melihat alasan kuat untuk hardening murah semacam O-C.

**Pertanyaanmu:** Mengingat pertumbuhan file diperkirakan hanya ratusan KB per semester dan temuan ini eksplisit low-severity/opsional, apakah rotasi log telemetri layak masuk antrean kerja sama sekali sebelum Golden Master, atau lebih tepat dicatat sebagai backlog tanpa target implementasi — dan kalau suatu saat dikerjakan, apakah cap-baris sederhana (O-B) sudah cukup atau rotasi per-file (O-C) lebih pas mengingat kemungkinan pemakaian lintas-semester ke depan?

---

### CODEX#30a — Strategi bump versi Electron (^37 → lebih baru)

**Fakta:** Pin saat ini di `package.json:57` (blok `devDependencies`, baris 49-64) adalah `"electron": "^37.2.0"`, dan `npm ls electron --depth=0` mengonfirmasi versi yang benar-benar terpasang di `node_modules` adalah **37.10.3** — versi inilah yang dikemas electron-builder ke `dist/win-unpacked/` dan dieksekusi mahasiswa. `npm audit` (penuh, tanpa `--omit=dev`) melaporkan severity **HIGH** untuk seluruh rentang `<38.8.6` (AppleScript injection, IPC spoofing, dll. — lihat #30 sub-klaim A). Draf fix awal CODEX menyasar `^38.8.6` sebagai patch keamanan terdekat (lompat 1 major, dari 37→38). Namun `npm view electron version` terhadap registry npm per 2026-07-11 menunjukkan rilis terbaru sudah **43.1.0** — artinya `^38.8.6` menutup CVE yang dilaporkan tapi meninggalkan proyek 5 major di belakang tepat saat masuk periode pra-Golden-Master (freeze skor Agustus), yang secara historis berarti bump berikutnya baru realistis dilakukan lagi di semester depan.

**O-A:** Bump minimal ke `^38.8.6` — menutup seluruh CVE HIGH/moderate yang dilaporkan `npm audit`, lompat 1 major, permukaan breaking-change tersempit (sandbox/IPC/Node ABI berubah paling sedikit dibanding lompat ke 43). Bukan REVISI_ENGINE-bearing (murni devDependency infra, tidak menyentuh field jawaban/skor), tapi tetap wajib smoke-test manual (`npm run pack`, window/DevTools-lock, save-IPC) sebelum dianggap aman — dan besar kemungkinan perlu di-bump lagi beberapa bulan setelah Golden Master begitu 38.x juga mulai dilaporkan usang.
**O-B:** Lompat langsung ke rilis stabil terbaru (43.1.0 per hari ini, atau versi ter-stabil terdekat saat fix benar-benar dieksekusi) — menutup CVE yang sama sekaligus menunda kebutuhan bump berikutnya selama mungkin, tapi permukaan breaking-change jauh lebih besar (5 major sekaligus: Node/Chromium ABI, perubahan default sandbox/context-isolation antar rilis Electron kerap ada), sehingga smoke-test manual menjadi jauh lebih krusial dan risiko menemukan regresi window/DevTools-lock atau save-IPC tepat mepet Golden Master Agustus lebih tinggi.
**O-C:** Tunda keputusan versi final, tapi kunci jendela eksekusi: jalankan smoke-test (`npm run pack` + cek manual window/DevTools-lock `src/main/index.ts` + save-IPC) terhadap **kedua** kandidat (`^38.8.6` dan versi terbaru saat itu) di lingkungan terisolasi sebelum freeze, lalu pilih yang lulus tanpa regresi — menghindari komitmen prematur ke salah satu angka sebelum data smoke-test ada, dengan konsekuensi menambah satu putaran kerja manual sebelum Agustus.

**Lean kami:** Tidak condong ke mana pun — trade-off "risiko breaking-change sekarang" vs "utang bump berulang tiap semester" murni soal toleransi risiko operasional pemilik proyek yang lebih tahu kapasitas smoke-test manual-nya menjelang Golden Master, bukan sesuatu yang bisa diputuskan dari analisis kode semata.

**Pertanyaanmu:** Mengingat jendela smoke-test manual yang tersedia sebelum freeze Golden Master Agustus terbatas dan tidak bisa diverifikasi headless, apakah lebih rasional melompat sekaligus ke rilis Electron terbaru sekarang (menyerap seluruh risiko breaking-change dalam satu putaran uji sebelum freeze, menghindari utang bump berulang tiap semester) atau membatasi lompatan ke patch keamanan minimal `^38.8.6` (risiko regresi tersempit menjelang tenggat, tapi menunda persoalan yang sama ke semester berikutnya) — dan pada faktor apa keputusan ini seharusnya digantung?

---

## Referensi — SUDAH DIPUTUSKAN / TAK PERLU DIBAHAS ULANG (bukan pertanyaan baru)

Daftar ini murni informatif, supaya DeepThink & Dr. Wirayuda tak membuang waktu
menimbang ulang hal yang sudah dianggap final atau sudah tercatat di tempat lain:

- **CODEX#7/#8/#9 (surveilans ground-truth pemain vs kasus, KLB-tuntas MENGHAPUS
  bukan resolve entri, ambang statis + verifikasi via kartu skor)** — ketiganya
  desain sadar & defensible (komentar kode eksplisit), diverifikasi independen 2x
  (Verify+Adversary), NOL kebutuhan fix. Buka kembali HANYA bila owner ingin scope
  baru: simulasi sinyal-palsu, atau laporan epidemiologi kumulatif permanen.
- **CODEX#11a (indikator positif keluarga bisa dibalik oleh drift)** — mekanisme
  M1.3 sengaja ("versi dibalik dari bug lama"), sudah diputuskan.
- **CODEX#11b** (label sumber:'dokter' tak ikut berubah saat drift) — SUDAH DIFIX
  sesi ini (reducer.ts, filter kandidat drift kini sumber==='kader' saja).
- **CODEX#13a** (kontrol HT cuma SBP tunggal) — overlap [#7b] M10_5_FIDELITAS.md,
  SUDAH diputuskan sesi lalu (hapus formula DBP fabrikasi).
- **CODEX#13c** (komplikasi DM generik dm_tipe2 vs HT dapat stroke_iskemik nyata)
  — overlap PENUH dgn **[#7c]** M10_5_FIDELITAS.md baris 416 yang SUDAH menunggu
  keputusan Dr. Wirayuda (opsi exempt-gerbang/kasus-DM-baru/transparansi-saja).
  JANGAN buka tiket baru — arahkan ke keputusan [#7c] yang sudah ada.
- **CODEX#15a/b/c** (silaturahmi buff-massal, jitter IKS harian, kapasitas
  roster=16=total keluarga) — ketiganya desain sadar terdokumentasi di kode/roadmap.
- **CODEX#18** (atribusi keluhanUtama wali/pendamping, 10 kasus) — label tampilan
  SUDAH DIFIX sesi ini (3 layar + field baru). Pertanyaan yang TERSISA (skala
  besar: apakah membangun varian teks per-persona utk 144+ kasus layak investasi
  konten) BUKAN pertanyaan mekanik/desain — murni keputusan prioritas-waktu Dr.
  Wirayuda sendiri, tak perlu adjudikasi DeepThink.
- **CODEX#20** (perubahan sesi sebelumnya: common-cold/bronkitis ambroxol,
  mm_hipertensi_urgensi→I13.9, TB TCM/HIV) — SEMUA diverifikasi bersih 2x, nol
  regresi, nol tindakan.
- **CODEX#21** (narasi dengue d2 "Setelah bolus") — SUDAH DIFIX sesi ini.
- **CODEX#22** (lompat fase via gameplay normal) — REFUTED, guard sudah solid;
  bagian save-import yang genuinely rentan SUDAH DIFIX sesi ini (save.ts).
- **CODEX#23/#25b** (ukuran & stroke label peta) — SUDAH DIFIX sesi ini.
- **CODEX#25a** (kanvas peta tak ikut mode-malam) — desain sadar terdokumentasi
  (playtest 2026-07-06), bukan bug.
- **CODEX#26a** (TitleScreen selalu "pagi") — desain sadar terdokumentasi.
- **CODEX#26b/#27** (file-picker bahasa Indonesia, pemisah visual dosen) — SUDAH
  DIFIX sesi ini.
- **CODEX#28b** (tabrakan nama pasien harian) — SUDAH DIFIX sesi ini.
- **CODEX#29a** (nama exe launcher salah) — SUDAH DIFIX sesi ini.
- **CODEX#29b** (versi package.json mismatch) — REFUTED, sumber sudah 1.0.0,
  hanya artefak dist/ lokal basi (gitignored).
- **CODEX#31a** (batas payload IPC telemetri) — OVERCLAIM, bukan permukaan
  serangan nyata (bukan input attacker-controlled).
- **CODEX#31c** (tak ada UI hapus data dari game) — SUDAH-DIPUTUSKAN utk telemetri
  (dijaga sengaja, integritas forensik); REFUTED utk save-slot (save:delete ADA).
- **CODEX#31d** (telemetri tak di-flush before-quit) — SUDAH DIFIX sesi ini.
- **Musik BGM (CODEX#1)** — SELESAI: musik dinonaktifkan sepenuhnya (bukan cuma
  digerbang saat build) per keputusan dokter 2026-07-11 ("matikan dulu aja
  sementara, toh gak esensial"); 7 file OST tak berlisensi sudah dihapus dari
  repo (git rm), flag BGM_NONAKTIF_SEMENTARA di bgm.ts menahan playback, gerbang
  build (check-bgm-license.js) tetap ada sbg pagar bila file itu kelak dipasang
  ulang tanpa lisensi. SFX/alarm tidak terpengaruh.

---

## FORMAT OUTPUT YANG DIMINTA

- Untuk tiap CODEX#N/Addendum di atas: **Penilaian** (2-4 kalimat) +
  **Rekomendasi** (1 kalimat actionable) + **Tag keyakinan**
  [Kuat]/[Sedang]/[Spekulatif].
- **Satu sintesis prioritas**: dari 13 item ini, mana yang paling mendesak
  diputuskan SEBELUM Golden Master Agustus, vs mana yang aman ditunda ke
  M11a/M13 pasca-freeze. Perhatikan bahwa sebagian item (code signing #30b,
  bump Electron #30a, rotasi log #31b) **TIDAK REVISI_ENGINE-bearing** —
  tidak menyentuh skor/mekanik/replay sama sekali, sehingga tidak terikat
  tenggat Golden Master dengan cara yang sama seperti item yang mengubah
  skor/mekanik (diare #6, KBK #10, Prolanis #13b, bridge karma #14, floor
  terapi #16, SBAR #19b, visibilitas karma #28a, Asih-addendum). #2c/#3c
  murni kebijakan (nol REVISI, nol tenggat teknis).
- **Satu keputusan yang paling kamu khawatirkan** (blind spot tim).
- **Satu hal yang tim lakukan BENAR** & jangan diubah karena tenggat.

## BIAS-CHECK MANDATORY

- Rekomendasimu bias "tambah gerbang punitif lagi" untuk item #16 (floor
  terapi), #19b (SBAR masuk grade), atau #6 (gate observasi diare) — padahal
  M10.5 sudah diperingatkan soal risiko checklist-compliance & solo-dev +
  tenggat sempit? Koreksi bila iya.
- Untuk item proctoring/anti-joki (#3c): cek bias "security theater" —
  mengingat filosofi PRIMER eksplisit tertulis sebagai "alat edukasi, bukan
  kompetisi berperingkat ketat", apakah rekomendasimu diam-diam mengasumsikan
  kebutuhan anti-cheat setingkat ujian nasional berperingkat, padahal
  konteksnya kelas 50 mahasiswa yang diawasi tatap muka?
- Untuk item non-esensial (code signing #30b, bump Electron #30a, rotasi log
  #31b): cek bias "over-investasi waktu solo-dev" — apakah rekomendasimu
  realistis mengingat developer tunggal dengan kapasitas smoke-test manual
  terbatas menjelang Golden Master, atau diam-diam mengasumsikan tim QA/infra
  yang tidak ada?
- Di mana kamu paling mungkin SALAH?

---

*Triangulasi PRIMERA: Claude (builder+verifier) · CODEX (auditor read-only) · DeepThink (reviewer desain-strategi). Tiga sudut independen; keputusan akhir milik Dr. Wirayuda.*
