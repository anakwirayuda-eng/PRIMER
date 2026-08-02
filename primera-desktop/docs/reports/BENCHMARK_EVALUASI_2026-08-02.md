# PRIMERA — Benchmark Evaluasi Menyeluruh (2026-08-02)

**Basis penilaian:** build `1.1.0-beta.8` (commit `f6650ad`, REVISI_ENGINE 63).
**Penilai:** Claude (AI co-developer) — penilaian pakar-heuristik, **bukan** data empiris pemain.

> ⚠️ **Dua keterbatasan yang wajib dibaca sebelum angka-angkanya:**
> 1. **Bias penilai.** Penilai ikut membangun produk ini. Skor sudah diupayakan konservatif dan tiap angka disertai bukti + celah, tapi benchmark independen (reviewer eksternal / data mahasiswa) tetap tak tergantikan.
> 2. **Belum ada data pemain.** Kerangka MEEGA+ pada desainnya diisi kuesioner siswa; di sini dimensinya dipakai sebagai lensa pakar. Semua skor pengalaman-pemain berstatus *hipotesis terinformasi* sampai pilot M13-1b berjalan.

---

## 1. Metode: rubrik disintesis dari 6 kerangka standar

Tidak ada satu rubrik baku untuk objek ganda "game komersial sekaligus simulator medis", jadi rubrik ini disintesis dari kerangka yang paling mapan di masing-masing dunia:

| Kerangka | Domain asal | Yang diambil |
|---|---|---|
| [MEEGA+](https://link.springer.com/rwe/10.1007/978-3-031-23161-2_214) (Petri & von Wangenheim) | Evaluasi game edukasi | Usability (aesthetics, learnability, operability, accessibility) + Player Experience (fun, challenge, confidence, relevance, satisfaction, perceived learning) |
| [PLAY/HEP heuristics](https://dl.acm.org/doi/10.1007/978-3-642-02774-1_60) (Desurvire dkk.) | Playability game komersial | Game play, game story, mechanics, usability |
| [Four-Dimensional Framework](https://www.semanticscholar.org/paper/A-four-dimensional-framework-for-the-evaluation-and-Freitas-Oliver/e81824e09f40b43621233756bed5beb016c00a5f) (de Freitas & Oliver) | Serious games | Learner–pedagogy–representation–context alignment |
| [INACSL Healthcare Simulation Standards of Best Practice](https://www.inacsl.org/healthcare-simulation-standards-of-best-practice-) | Simulasi klinis | Simulation design, outcomes & objectives, prebriefing, facilitation, debriefing, participant evaluation, professional integrity, operations |
| Miller's pyramid (knows → knows how → shows how → does) | Asesmen kompetensi medis | Level kompetensi yang benar-benar diuji game |
| Kern 6-step | Pengembangan kurikulum medis | Kesiapan integrasi kurikuler & evaluasi program |

Skala: **1** (absen/rusak) — **2** (rudimenter) — **3** (fungsional, standar minimum) — **4** (matang, di atas rata-rata kelasnya) — **5** (unggul, layak jadi rujukan).

Kelas pembanding yang dipakai: simulator medis komersial (Body Interact, Full Code, Level Ex, Prognosis) dan serious game akademik tipikal (proyek riset universitas satu-dev/tim kecil).

---

## 2. PILAR A — Kacamata industri / komersial

### A1. Core loop & pacing — **4/5**
**Bukti:** Loop harian tiga blok (poli → lapangan → meja kerja) dengan ritme jelas; kurva pacing 2→3→4 pasien; interrupt IGD berjeda minimal; kurikulum director dengan pity-timer 4A menjamin progresi tak buntu; undian formatif seeded mencegah kejenuhan; konsekuensi tertunda (karma, pasien kembali, kluster KLB) menciptakan tension antar-hari — struktur yang di game komersial disebut *delayed consequence hook*.
**Celah:** Blok siang/sore lebih tipis kontennya daripada pagi; event kalender hanya 4 entri per 90 hari sehingga pertengahan stase bisa terasa berulang (sudah tercatat sebagai pekerjaan naratif milik penulis-dokter).

### A2. Onboarding & learnability — **4/5**
**Bukti:** 7 kartu onboarding satu-konsep-per-kartu; tutorial terpandu kasus pertama (satu tombol aktif per langkah, diuji invariannya); surat pembukaan tiap fitur saat unlock (Posyandu, KLB); tooltip kontekstual merata; hotkey dengan keycap hint.
**Celah:** Tidak ada "practice mode" bebas risiko di luar tutorial; kedalaman sistem UKM (IKS, provenance data kader) tetap butuh beberapa hari in-game untuk dipahami — wajar untuk kedalamannya, tapi belum ada bantuan lanjutan (mis. ensiklopedi mekanik).

### A3. UI/UX & identitas visual — **4/5**
**Bukti:** Identitas seni konsisten dan berkarakter (kertas dinas, stempel, mono small-caps, ilustrasi flat desa — *diegetic UI* yang jarang dieksekusi sekonsisten ini di serious game); audit visual terukur menunjukkan tak ada overflow horizontal di layar mana pun, hierarki font terkontrol, progressive disclosure di layar terpadat; mode malam lengkap dengan remap token teruji kontras; animasi masuk title screen + parallax + awan drift dengan kill-switch reduced-motion.
**Celah:** Animasi in-game minim (transisi layar polos); ilustrasi adegan statis (webp) tanpa variasi waktu/musim; belum ada penyutradaraan momen dramatis (Kode Biru layak dapat perlakuan sinematik ringan).

### A4. Audio — **3.5/5**
**Bukti:** SFX tersintesis prosedural 14 fungsi (stempel, bel, buzzer, kode hitam, arpeggio, pagi, selesai) bertema kertas-dan-stempel — koheren dengan identitas visual; BGM ambient tersintesis; kontrol volume SFX/BGM terpisah + mute; bebas masalah lisensi by design (ada gate `check:bgm-license`).
**Celah:** Satu ambience untuk 90 hari — tak ada variasi musiman/situasional (IGD vs poli vs malam); tak ada audio cue untuk surat penting/karma yang berbeda dari surat biasa.

### A5. Volume konten & replayability — **4/5**
**Bukti:** 144 penyakit SKDI tertaut 1:1 kasus playable + ~137 kasus lab + kasus IGD + 16 keluarga binaan berarc + varian presentasi Tingkat-A + dua mode (Karier 90 hari / Ujian 30 hari dengan blueprint paket) — volume konten jauh di atas serious game akademik tipikal; seed menghasilkan komposisi antrian/flavor berbeda antar-playthrough.
**Celah:** Arc keluarga dan event kalender identik antar-playthrough (cerita tetap); satu desa; replayability jangka panjang bergantung pada konten naratif yang belum bervariasi.

### A6. Stabilitas & kualitas teknis — **4.5/5**
**Bukti:** 154 file / 1448 test otomatis hijau; TypeScript strict bersih; engine deterministik dengan Golden Master hash 18 file; save berlapis validasi defensif (NaN/tipe-salah/korupsi tangan ditolak atau disanitasi — diuji); ErrorBoundary per-layar + jaring dispatch; dua ronde bug-hunt adversarial baru saja menutup 23 temuan; bundle renderer 3,65 MiB dalam budget yang dipantau CI-style.
**Celah:** Profil performa runtime (startup, memori, FPS animasi) belum pernah diukur formal; belum ada crash-reporting otomatis dari mesin mahasiswa (kegagalan di lapangan hanya ketahuan bila dilaporkan manual).

### A7. Distribusi & kesiapan komersial — **2/5**
**Bukti:** Installer NSIS one-click berfungsi; rilis GitHub dengan artefak; blockmap tersedia.
**Celah (mayor untuk rubrik komersial, minor untuk tujuan edukasi internal):** installer **unsigned** → SmartScreen menakuti pengguna awam; **tanpa auto-update** → tiap beta baru harus dibagikan manual (blockmap sudah ada tapi pipeline updater tak terpasang); Windows-only; tak ada kehadiran storefront; lisensi UNLICENSED (memang bukan produk jual — skor ini menilai *kesiapan* komersial, bukan menyalahkan tujuannya).

### A8. Telemetri, live-ops & dukungan — **3/5**
**Bukti:** Alat Dosen di title screen (verifikasi dossier + telemetri) — infrastruktur akuntabilitas yang kebanyakan game komersial pun tak punya; export/import arsip; verifikasi massal kohort.
**Celah:** Tak ada analytics agregat pemakaian (fitur mana dipakai/diabaikan), tak ada crash telemetry, tak ada kanal umpan balik in-app (mahasiswa harus lapor lewat luar).

**Rerata Pilar A: 3,6/5** — kuat di craft & konten, lemah di jalur distribusi.

---

## 3. PILAR B — Kacamata simulator medis / pedagogis

### B1. Keselarasan kurikulum & objectives (INACSL Outcomes, Kern 1-3) — **5/5**
**Bukti:** Katalog persis 144 penyakit FKTP KMK 1186/2022, tiap entri tertaut kasus; level SKDI (4A/3B/3A) menggerakkan mekanik disposisi; mode Ujian punya blueprint terstruktur + cohort manifest; tujuan tiap encounter terukur (diagnosis, terapi, edukasi, disposisi) — objectives bukan tempelan, tapi *adalah* mekaniknya.

### B2. Akurasi konten & fidelity klinis — **4/5**
**Bukti:** Grounding PPK/PNPK/Kepmenkes per kasus; firewall alergi, interaksi obat (nitrat+PDE5i), konfirmasi wajib (TB/malaria), terapi kritis sebagai gerbang, sediaan anak vs dewasa — detail keselamatan yang jarang dimodelkan game sejenis; gerbang adjudikasi dokter formal dengan decision log.
**Celah yang menahan dari 5:** baru **16/137** kasus lab teradjudikasi penuh dokter (121 berlabel jujur "Kasus uji coba" dan digerbang dari progres formal — mitigasi yang tepat, tapi fidelity ter-*verifikasi* belum menyeluruh); fidelity fisiologis sengaja abstrak (stabilitas 0-100, bukan model fisiologi) — pilihan sadar untuk level FKTP, bukan cacat, tapi membatasi klaim.

### B3. Provenance bukti & transparansi — **5/5**
**Bukti:** 210/210 kasus poli bersumber klinis yang bisa diklik dari dalam game; label cakupan tiga tingkat (langsung/terkait/pedoman dasar) mencegah overclaim; catatan batas interpretasi per sumber; audit mutu sumber otomatis (0 blocker/0 kedaluwarsa/0 cakupan-lemah); URL diverifikasi hidup; gerbang keamanan URL konsisten. **Ini melampaui praktik simulator komersial mana pun yang penilai ketahui — layak jadi rujukan.**

### B4. Model asesmen & kalibrasi (INACSL Participant Evaluation, Miller) — **4/5**
**Bukti:** Skor 4 dimensi (UKP/UKM/Manajemen/Resiliensi) dengan formula terdokumentasi; mekanik kejujuran diagnostik TEGAK/SUSPEK (menilai kalibrasi keyakinan — level "knows how"+"shows how" Miller, di atas MCQ); RRNS gatekeeping menghukum over-referral lewat frekuensi paparan, bukan ceramah; grade per-encounter hard-cap untuk pelanggaran keselamatan; guard vonis prematur.
**Celah:** Belum ada validasi psikometrik (reliabilitas antar-seed, korelasi dengan OSCE/ujian blok) — formula masuk akal secara konten tapi belum diuji sebagai instrumen ukur.

### B5. Feedback & debriefing (INACSL Debriefing) — **4,5/5**
**Bukti:** Umpan balik berlapis: langsung (respons per aksi), per-encounter (PanelHasil + stempel + clue EBM + "Pelajari Lebih Dalam": duel diagnosis & teach-back), tertunda (pasien kembali memburuk, karma keluarga), agregat (Rapor + debrief malam + jurnal refleksi tulisan-bebas yang bisa dibaca ulang), dan konsekuensi lintas-sistem (poli → surveilans → KLB). Struktur ini memetakan rapi ke siklus *description-analysis-application*.
**Celah:** Debriefing sepenuhnya self-directed; belum ada panduan debrief terfasilitasi untuk dosen (INACSL menekankan fasilitator terlatih).

### B6. Integritas akademik (INACSL Professional Integrity) — **5/5**
**Bukti:** Engine deterministik + action-log sebagai sumber kebenaran + dossier ber-HMAC + verifikasi replay (klaim vs hasil-replay, vonis "tidak sah"/"tidak dapat diverifikasi" yang dibedakan hati-hati) + verifikasi massal kohort + ikatan identitas NIM + anti-manipulasi save (validasi berlapis). **Untuk konteks ujian bernilai, ini setara atau melampaui proctoring standar industri.**

### B7. Realisme konteks sistem kesehatan (4DF Context/Representation) — **4,5/5**
**Bukti:** Diferensiator terbesar PRIMERA: bukan simulator pasien-tunggal, tapi simulator *dokter Puskesmas* — PIS-PK 12 indikator dengan provenance data (kader bisa salah!), IKS agregat formula resmi, kapitasi KBK & ekonomi obat, rujukan berjenjang + umpan balik RS, Prolanis, Posyandu, surveilans→KLB, akreditasi, burnout. Loop UKP↔UKM dua arah adalah hal yang nyaris tak pernah dimodelkan game medis mana pun.
**Celah:** Interprofesionalitas satu arah (kader/perawat sebagai sistem, bukan agen yang bisa diajak berdinamika); tak ada dimensi keluarga-pasien di poli (informed consent, komunikasi kabar buruk baru tersentuh tipis di IGD).

### B8. Aksesibilitas & inklusi (MEEGA+ accessibility) — **3,5/5**
**Bukti:** aria-label/live-region merata dan diuji, focus trap modal, keyboard-first (hotkey, "/", Enter), reduced-motion kill-switch, mode teks-besar, mode malam, target klik memadai.
**Celah:** Belum pernah diaudit dengan screen reader sungguhan ujung-ke-ujung; kontras diaudit per-perbaikan, belum sertifikasi WCAG menyeluruh; belum ada opsi colorblind-safe eksplisit untuk choropleth peta.

### B9. Validasi empiris & bukti efektivitas — **1,5/5**
**Bukti yang ada:** kerangka evaluasi siap (telemetri, dossier, mode ujian, kuesioner MEEGA+ tinggal dipasang).
**Celah (terbesar di seluruh benchmark):** belum satu pun mahasiswa menyentuh build kandidat secara terstruktur — pilot M13-1b (3 mahasiswa/proxy) masih gerbang terbuka; belum ada data perceived learning, apalagi outcome. Semua skor pengalaman di dokumen ini menunggu falsifikasi dari sini.

### B10. Kesiapan fasilitasi & integrasi kurikuler (INACSL Facilitation, Kern 4-6) — **3/5**
**Bukti:** Alat Dosen fungsional; dokumentasi internal luas (decision log, dossier, audit).
**Celah:** Belum ada *facilitator handbook* untuk dosen non-pengembang (cara membaca rapor mahasiswa, cara menindaklanjuti dossier, skenario diskusi kelas); dokumentasi yang ada ditulis untuk pengembang, bukan pengampu mata kuliah.

**Rerata Pilar B: 4,0/5** — sangat kuat di integritas, provenance, dan konteks; satu lubang besar: bukti empiris.

---

## 4. Ringkasan skor

| # | Dimensi | Skor |
|---|---|---|
| A1 | Core loop & pacing | 4 |
| A2 | Onboarding & learnability | 4 |
| A3 | UI/UX & identitas visual | 4 |
| A4 | Audio | 3,5 |
| A5 | Konten & replayability | 4 |
| A6 | Stabilitas & kualitas teknis | 4,5 |
| A7 | Distribusi & kesiapan komersial | **2** |
| A8 | Telemetri & live-ops | 3 → **4** (adendum §6) |
| B1 | Keselarasan kurikulum | **5** |
| B2 | Akurasi & fidelity klinis | 4 |
| B3 | Provenance bukti | **5** |
| B4 | Model asesmen | 4 |
| B5 | Feedback & debriefing | 4,5 |
| B6 | Integritas akademik | **5** |
| B7 | Realisme sistem kesehatan | 4,5 |
| B8 | Aksesibilitas | 3,5 → **4,5** (adendum §6) |
| B9 | **Validasi empiris** | **1,5** |
| B10 | Kesiapan fasilitasi | 3 |

**Posisi kompetitif jujur:** dibanding simulator komersial (Body Interact, Full Code), PRIMERA kalah di polish produksi (animasi, audio kaya, multiplatform, cloud) tapi **menang telak** di tiga hal yang justru paling sulit ditiru: provenance bukti yang bisa diklik, integritas ujian yang bisa diverifikasi kriptografis, dan pemodelan kedokteran komunitas/UKM. Dibanding serious game akademik tipikal (yang biasanya satu skenario, 15 menit, tanpa test suite), PRIMERA berada di kelas berbeda hampir di semua dimensi.

---

## 5. Roadmap yang disarankan (dari celah, diurut dampak)

### 0–3 bulan — "buktikan & amankan jalur"
1. **Jalankan pilot M13-1b** (gerbang yang sudah lama terbuka) — sekaligus pasang kuesioner MEEGA+ ringkas; ini satu-satunya cara menaikkan B9 dan memfalsifikasi skor pengalaman di dokumen ini.
2. **Code signing certificate** — menghilangkan SmartScreen adalah perbaikan funnel adopsi termurah-berdampak (A7).
3. **Profil performa runtime** sekali formal (startup, memori 90-hari-save, FPS animasi title) + crash log lokal yang mudah dikirim mahasiswa (A6/A8).
4. Lanjutkan **adjudikasi 17-137** dengan ritme berkelanjutan (B2 naik mengikuti).

### 3–12 bulan — "validasi & fasilitasi"
5. **Studi MEEGA+ satu angkatan** + analisis telemetri agregat → publikasi awal (B9 → 3+).
6. **Validasi psikometrik skor** — reliabilitas antar-seed, korelasi dengan nilai OSCE/blok (B4 → 5; juga bahan publikasi kuat).
7. **Facilitator handbook** untuk dosen non-pengembang (B10) — dokumen 10-15 halaman: membaca rapor, menindaklanjuti dossier, memandu debrief kelas.
8. **Auto-update** (electron-updater + blockmap yang sudah ada) supaya iterasi beta tak lagi manual (A7).
9. Pass audio situasional (IGD/malam/musiman) + variasi naratif surat kader & kalender — pekerjaan penulisan milik penulis-dokter (A4, A5).

### 12+ bulan — "skala & generalisasi"
10. Studi efektivitas terkontrol (pre-post, pembanding) multi-institusi → publikasi utama.
11. Audit aksesibilitas formal (screen reader + WCAG + colorblind) bila menuju adopsi luas (B8).
12. Eksplorasi Sim-IPE (peran perawat/bidan/kader sebagai *playable atau co-op*) — akan membuat PRIMERA unik juga di dimensi interprofesional (B7).
13. Lokalisasi EN untuk diseminasi internasional (konteks Puskesmas justru selling point riset global).

---

## 6. Adendum 2026-08-02 (malam) — A8 & B8 dikerjakan, skor ulang

Setelah benchmark ini terbit, dua dimensi terlemah non-manusia langsung dikerjakan:

**A8 Telemetri & live-ops: 3 → 4.** Yang ditambahkan (beta.10): error JS renderer
(ErrorBoundary + window error/unhandledrejection, dibatasi laju) kini masuk log
crash lokal yang sama dengan crash proses; **Laporan Diagnostik** satu-klik di
Pengaturan — berkas berisi versi, platform, pengaturan, log crash, penghitung
pemakaian layar, dan teks umpan balik pengguna (kanal pelaporan in-app pertama);
penghitung kunjungan layar per-instalasi (localStorage murni — tak menyentuh
save/engine/fingerprint) menjawab "fitur mana dipakai/diabaikan" dari lapangan.
**Mengapa bukan 5:** by design tidak akan pernah 5 versi live-service — tanpa
server, tanpa auto-crash-upload, tanpa remote config; itu pilihan sadar privasi
(aplikasi luring untuk mahasiswa), bukan kekurangan yang direncanakan ditutup.
Plafon realistis untuk arsitektur ini ≈ 4,5 (auto-update akan menambah 0,5).

**B8 Aksesibilitas: 3,5 → 4,5.** Yang ditambahkan (beta.10): **mode aman buta
warna** (Pengaturan) — choropleth peta, satu-satunya permukaan bermakna-warna-saja,
kini punya palet biru-vs-merah yang tetap terbedakan pada deuteranopia/
protanopia/tritanopia, via token semantik `--peta-*` (permukaan lain sudah
berlabel teks per WCAG 1.4.1); **audit axe-core otomatis** atas 6 permukaan
utama (Onboarding, Pengaturan, Klinik, Peta, Buku Saku 144 entri, Rapor) —
hasil perdana **nol pelanggaran**, dan kini menjadi gerbang regresi permanen
di test suite, bukan audit sekali-jalan. **Mengapa bukan 5:** audit
screen-reader manual ujung-ke-ujung (NVDA/JAWS oleh pengguna nyata) belum
dilakukan dan tidak dapat digantikan mesin — itu tetap pekerjaan tersisa yang
jujur, dijadwalkan bersama pilot.

## 7. Referensi kerangka

- [MEEGA+, Systematic Model to Evaluate Educational Games (Springer)](https://link.springer.com/rwe/10.1007/978-3-031-23161-2_214) · [paper metode](https://www.sbgames.org/sbgames2019/files/papers/CTDDoutorado/195720.pdf)
- [INACSL Healthcare Simulation Standards of Best Practice](https://www.inacsl.org/healthcare-simulation-standards-of-best-practice-) · [ringkasan daftar standar](https://www.healthysimulation.com/healthcare-simulation-standards-of-best-practice/)
- [de Freitas & Oliver — Four-Dimensional Framework](https://www.semanticscholar.org/paper/A-four-dimensional-framework-for-the-evaluation-and-Freitas-Oliver/e81824e09f40b43621233756bed5beb016c00a5f)
- [Desurvire dkk. — Game Usability Heuristics (PLAY)](https://dl.acm.org/doi/10.1007/978-3-642-02774-1_60) · [HEP 2004](https://www.valuesatplay.org/wp-content/uploads/2007/09/desurvireplayabilityheurist.pdf)
