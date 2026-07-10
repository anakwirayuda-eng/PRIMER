# DEEPTHINK — Triangulasi Strategis: Persimpangan Pasca-Audit M10/M11

> **Untuk:** DeepThink (reviewer strategis, bukan auditor kode).
> **Peran:** Berbeda dari CODEX. CODEX memeriksa *apakah kode & konten benar*
> (read-only, forensik) — sudah dikerjakan dua kali minggu ini, hasilnya di
> §2. Kamu memeriksa *apakah arah keputusannya benar*: skop, urutan, dan
> risiko strategis. Boleh baca kode untuk konteks, tapi output = PENILAIAN &
> REKOMENDASI berperingkat, bukan daftar bug baru.
> **Tanggal:** 2026-07-10 · Basis: HEAD branch `claude/vigorous-bose-f66bc6`
> (commit `4c13ecf`), folder `primera-desktop/`. `REVISI_ENGINE=17`, 516 test.

---

## 0. KONTEKS PRIMERA — BACA DARI NOL

> Dossier-dossier DeepThink sebelumnya (M3b, dst.) mengasumsikan kontinuitas
> sesi. **Dossier ini TIDAK** — kamu tak punya riwayat percakapan PRIMER
> manapun. Bagian 0a–0f di bawah dimaksudkan supaya §1–§3 bisa dijawab tanpa
> menebak istilah. Bila tetap ada singkatan/istilah asing yang lolos, itu
> celah dossier ini, bukan sesuatu yang harus kamu asumsikan maknanya.

### 0a. Apa ini, siapa pemainnya, kenapa taruhannya tinggi

PRIMERA ("Puskesmas Pagi") = game desktop Electron (TypeScript+React),
*"Football Manager-nya kedokteran komunitas dengan hati Harvest Moon"*.
Pemain berperan sbg dokter fresh-graduate yang ditugaskan ke SATU Puskesmas
(FKTP — lihat glosarium §0f) desa fiktif Indonesia, selama **stase 90 hari**
("Karier": tiap hari dibagi 3 blok waktu bermain) atau **Mode Ujian 30
hari** (subset kasus, seed deterministik — dipakai sbg jalur asesmen utama
krn stase 90-hari penuh terlalu panjang utk jadwal rotasi klinik nyata).

**Target pemakai: ±50 mahasiswa Fakultas Kedokteran Indonesia, redeploy
±September 2026, DINILAI dari skor game mereka** — bukan sekadar dimainkan
utk hiburan. Karena itu integritas pedagogis (mengajarkan hal yang BENAR)
dan integritas asesmen (skor tak bisa dipalsukan) adalah kepentingan PRODUK
inti. Developer: SATU dokter (Dr. Wirayuda, juga penulis sebagian besar
konten klinis) dibantu agen AI (Claude) yang menulis kode & konten atas
arahannya — konteks ini penting krn membatasi berapa banyak yang REALISTIS
bisa dikerjakan sebelum Sept.

### 0b. Loop permainan inti

**Sisi klinik (UKP — Upaya Kesehatan Perorangan, "poli" Puskesmas):**
mayoritas waktu bermain. Tiap "pasien" = satu `KasusKlinis` (67 kasus poli
+ 5 kasus IGD darurat-interupsi) dipilih sistem "Director" berbobot
epidemiologi (kasus sering muncul ×3, jarang ×0.6, meniru distribusi
kunjungan Puskesmas nyata). Alur SATU encounter: **Anamnesis** (tanya
gejala; sebagian jawaban sengaja jadi distraktor/jebakan) → **Pemeriksaan
Fisik** (pilih regio tubuh relevan) → **Lab** (opsional; sebagian hasil
baru keluar "besok") → **Diagnosis** (pilih ICD-10 + stempel **TEGAK**
[yakin penuh] atau **SUSPEK** [masih ragu] — kejujuran epistemik dinilai
terpisah dari benar/salahnya diagnosis) → **Tatalaksana** (resep dari
katalog ~97 obat + tindakan/prosedur) → **Edukasi** (pilih topik dari
daftar wajib kasus itu, dibatasi "baki" 3 slot) → **Disposisi** (tuntas
mandiri di FKTP, ATAU rujuk berjenjang ke RS via SISRUTE — merujuk kasus
yang SEHARUSNYA bisa ditangani sendiri kena penalti "Referral Guillotine").
Encounter berakhir dgn **debrief**: stempel grade A–D + rincian skor per
sub-dimensi (anamnesis/pemeriksaan/terapi/edukasi) + `clue` (mutiara EBM
tertulis) + (baru, M11 — lihat §1) `mutiaraEbm`/`catatanRealita`.

**Sisi masyarakat (UKM — Upaya Kesehatan Masyarakat):** pemain juga
mengelola **16 "keluarga binaan"** (pasien berulang dgn arc cerita
multi-kunjungan; contoh yg disebut §2–3: keluarga Asih, Dewi, Karsa,
Santoso, Lastri, Ketut — tersebar di file `desaA.ts`–`desaF.ts`, 1 file per
"desa"/klaster keluarga) via **kunjungan rumah**: tiap kunjungan
berstruktur beberapa "babak" (hotspot yg digali utk info → pilihan dialog
dinilai kualitas teknik wawancara-motivasi ["MI"] → intervensi yg dipilih
pemain → hasil `berhasil` / `partial` / `gagal` / `diusir`). Data awal
keluarga dilaporkan **kader** (relawan kesehatan desa; datanya kadang bias/
tak akurat — pemain harus verifikasi sendiri). Program berkala berjalan di
latar: **Posyandu** (pos layanan balita bulanan — gizi/imunisasi),
**Prolanis** (program BPJS utk penyakit kronis stabil), **KLB** (Kejadian
Luar Biasa = wabah), **Lokakarya Mini** (rapat koordinasi lintas-program
Puskesmas bulanan).

**Jembatan UKM→UKP ("karma_igd"):** sejumlah keluarga binaan punya risiko
klinis terjadwal di latar (mis. keluarga dgn preeklampsia atau hipertensi
tak terkendali) — bila tak ditangani via kunjungan rumah dlm tenggat
tertentu, risiko itu "jatuh tempo" jadi kasus IGD darurat sungguhan.
Kunjungan yg `berhasil` MEMBATALKAN risiko itu SEPENUHNYA (mekanisme
persis relevan di Q2); `partial`/`gagal` menggeser tenggatnya.

### 0c. Skor & integritas asesmen (kenapa `REVISI_ENGINE` di §1 penting)

Skor akhir stase = 4 dimensi berbobot (masih berlaku persis di kode saat
ini): **UKP 35 · UKM 35 · Manajemen 15 · Resiliensi 15** (Manajemen =
kesehatan ekonomi Puskesmas/kapitasi + stewardship lab-antibiotik;
Resiliensi = kelelahan/burnout pemain sendiri). Tiap aksi pemain dicatat
sbg **action-log** (bukan cuma skor akhir tersimpan) — ini memungkinkan
**replay**: sistem "M6 — Kelas & Dosen" membaca ulang jurnal aksi
mahasiswa & MENGHITUNG ULANG skornya dari nol, membandingkan dgn skor yg
diklaim mahasiswa saat mengekspor **"Dossier Mahasiswa"** (file ber-HMAC/
checksum) — ini pertahanan utama anti-kecurangan (mengedit save-file
manual). Karena replay bergantung pada LOGIKA skor yg PERSIS SAMA saat main
vs saat verifikasi, mengubah logika (bukan cuma konten) MEMAKSA
`REVISI_ENGINE` naik (mekanismenya di §1 poin 1).

### 0d. Riwayat ringkas M0–M11 (biar §2 "M10 tuntas, M11 baru mulai" tak muncul dari udara kosong)

M0–M5: loop harian penuh, 60+ konten klinik, ekonomi Puskesmas, endgame
90-hari. M6: sistem kelas/dosen (§0c). M7: polish UX (edukasi,
aksesibilitas, onboarding). M8: prototipe multipemain terpisah ("Arena",
proyek beda, belum aktif). M9: audit-hardening (kunci tutorial, SKDI,
tatalaksana-vs-clue). **M10** (baru TUNTAS hari ini): audit konsistensi
TOTAL — 6 ronde CODEX (auditor kode/medis eksternal, read-only, terpisah
dari DeepThink) + sapuan multi-agen, semua temuan ditriase & diperbaiki,
dicatat `CODEX_AUDIT_DOSSIER.md` §48–§55. **M11** (baru DIMULAI): user
mendefinisikannya eksplisit sbg "pengayaan & polish" — beda kelas dari M10
("audit utk yg salah/tak-konsisten"). Lalu **dua audit besar mendarat
BERSAMAAN hari ini** (§2) yg menantang batas definisi itu — itulah alasan
dossier ini ditulis SEKARANG, bukan menunggu M11 "selesai" dulu.

### 0e. Hierarki prioritas yang mengikat (jangan dibalik saat menilai)

*Integritas pedagogis > integritas asesmen/anti-forgery > retensi >
kompetisi > fun kasual.* Ditetapkan sejak dossier M3b (triangulasi
DeepThink pertama proyek ini), belum pernah dicabut. Sebagian besar tensi
§3 di bawah pada dasarnya adalah pertanyaan "di titik mana hierarki ini
berbenturan dgn realitas solo-dev + tenggat".

### 0f. Glosarium istilah (rujuk balik ke sini bila §1–§3 memakai istilah yg belum jelas)

**Sistem kesehatan Indonesia** (dipakai sbg latar realita, bukan istilah
buatan proyek):
- **FKTP** — Fasilitas Kesehatan Tingkat Pertama; Puskesmas = FKTP milik
  pemerintah, gerbang PERTAMA sistem kesehatan sebelum rujuk ke RS.
- **SKDI** — Standar Kompetensi Dokter Indonesia. Level **4A** = dokter
  FKTP WAJIB tuntas MANDIRI; **3B** = diagnosis+stabilisasi awal+WAJIB
  rujuk; **3A** = diagnosis+rujuk (tak boleh coba tangani sendiri).
- **Kepmenkes 144-FKTP** — daftar RESMI 144 penyakit yg wajib dikuasai
  tuntas dokter FKTP (lebih spesifik dari SKDI umum). Dokumen resminya
  BELUM ada di tangan tim (lihat Q8/§0d-M9.2).
- **SATUSEHAT** — platform data kesehatan nasional Kemenkes; menetapkan
  kode **WHO ICD-10 2010** sbg standar resmi, BUKAN ICD-10-CM (versi AS —
  ini sumber salah satu temuan §2b).
- **BPJS/JKN** — asuransi kesehatan nasional Indonesia.
- **Kapitasi** — model pembayaran FKTP: dibayar TETAP per-kepala warga
  terdaftar per-bulan, bukan per-layanan.
- **SISRUTE / PRB** — Sistem Rujukan Terintegrasi (rujuk-berjenjang
  digital ke RS) / Program Rujuk Balik (pasien kronis stabil dikembalikan
  ke FKTP dgn obat tetap dari RS).

**Mekanik & kode PRIMERA:**
- **`PACK` / `KasusKlinis`** — seluruh konten statis game (kasus, obat,
  lab, keluarga, IGD) dimuat sbg satu objek `PACK`; tiap kasus klinik
  adalah satu `KasusKlinis`.
- **`clue`** — mutiara EBM (kalimat ajaran klinis) yg tampil di debrief
  tiap kasus sejak awal proyek. `mutiaraEbm`/`catatanRealita` (§1) adalah
  DUA field BARU M11 yg tampil di kotak terpisah, bukan pengganti `clue`.
- **`REVISI_ENGINE` / `sidikJariPack`** — lihat §0c & §1 poin 1.
- **Pola "cap skor"** (`vitalDiukur→skorPemeriksaan`, `edukasiKritis→
  skorEdukasi`) — bila elemen WAJIB tertentu terlewat, skor dimensi itu
  di-plafon (mis. maks 50) apa pun kelengkapan bagian lain.
- **M9.2** — sub-inisiatif M9 (audit SKDI/ICD sistemik) yg DIRENCANAKAN
  tapi terhambat krn dokumen Kepmenkes 144-FKTP resmi tak di tangan saat
  itu — preseden langsung utk Q8.
- **P1.6 / P1.7 / P1.9 / C.1 / C.8** (disebut di Q5) — 5 temuan/keputusan
  DESAIN (bukan bug) dari ronde audit M10 sebelumnya, dipindah ke antrian
  M11 krn perlu keputusan pedagogis:
  - **P1.6** — apakah Mode Ujian seharusnya menilai PROSES klinis
    (anamnesis/PF/terapi/edukasi), bukan cuma hasil-akhir
    (diagnosis/disposisi)?
  - **P1.7/C.7** — apakah tes konfirmasi yg `clue` SENDIRI sebut wajib
    (mis. RDT malaria, BTA TB) seharusnya MENGUNCI skor diagnosis bila
    dilewati?
  - **P1.9** — apakah topik edukasi kritis yg terlewat seharusnya JUGA
    menggagalkan status "rekam medis lengkap" (`rmLengkap`), bukan cuma
    cap skor edukasi?
  - **C.1** — apakah stabilisasi tangan-pertama (oksigen, infus) sblm
    rujuk pasien gawat seharusnya jadi mekanik BERNILAI, bukan opsional?
  - **C.8** — mekanik keselamatan skrining-alergi tambahan (rincian
    penuh belum ada, baru sebatas judul temuan).

## 1. PRINSIP MENGIKAT (konsistensi — jangan diputar ulang tanpa alasan)

1. **`REVISI_ENGINE` naik HANYA bila semantik replay/skor berubah.** Konten
   murni (tatalaksana/lab/pf/anamnesis/demografi/prevalensi/kategori/skdi/
   konsekuensi/spesialis) sudah ter-hash ke `sidikJariPack` — dossier lama
   otomatis jatuh ke "tidak dapat diverifikasi" (bukan "tidak sah") bila pack
   berubah. `clue` dan field M11 baru (`mutiaraEbm`, `catatanRealita`) SENGAJA
   tidak di-hash — murni display, aman diedit kapan pun, langsung menjangkau
   save lama. Prinsip ini SUDAH terbukti bekerja (16 bump sejauh ini,
   dikelola rapi). Pertanyaan §3.3–3.4 di bawah menguji apakah pola ini masih
   cukup untuk gelombang temuan BARU yang jauh lebih besar dari biasanya.
2. **Pola "elemen wajib hilang → cap skor dimensi"** (`vitalDiukur→
   skorPemeriksaan` cap 50, `edukasiKritis→skorEdukasi` cap 50) adalah
   mekanik yang SUDAH divalidasi & dipakai berulang di codebase ini —
   pilihan pertama untuk menambal celah skoring baru, bukan mekanik baru.
3. **"Rebalance skor menunggu data playtest, KECUALI cacat terbukti secara
   logika"** — prinsip lama, dikutip di setiap dossier DeepThink sejauh ini.
   Belum pernah ada playtest mahasiswa sungguhan; semua keputusan sejauh ini
   berbasis argumen logis+tekstual dari konten sendiri.
4. **M11 didefinisikan pengguna secara eksplisit sebagai "pengayaan &
   polish"** — beda kelas dari M10 ("audit utk yang salah/tak-konsisten").
   Temuan §2b di bawah menantang batas ini: apakah semuanya benar-benar
   "M11-shaped", atau sebagian sebenarnya "M10 belum selesai"?
5. **Arsitektur non-REVISI = alat sengaja**, bukan kebetulan: dibangun
   supaya patch konten bisa "menjangkau save lama" pemain yang sedang jalan
   di tengah semester. Ini jadi alat tawar strategis penting di §3.5.

## 2. APA YANG BARU TERJADI (dua audit besar, dalam 24 jam yang sama)

### 2a. M11 Fase-2 — riset pengayaan (workflow `m11-pengayaan-riset`, 7 finder + verifikasi web per-kandidat)

**118 kandidat** `mutiaraEbm`/`catatanRealita` menyapu **63/67 kasus**. 104
keyakinan tinggi, 14 sedang. **21 ditandai `kontradiksiClue`** — verifikator
menilai kontennya BUKAN sekadar tambahan, tapi mengoreksi `clue` yang SUDAH
tayang di game hari ini. Beberapa contoh tajam (semua bersitasi guideline
nyata, sudah diverifikasi web independen):
- `stroke_iskemik` — FAST tak sensitif untuk stroke sirkulasi posterior
  (58,7% vs BE-FAST 97,8%, studi Cureus 2024) — **lihat 2b, temuan ini
  MUNCUL LAGI secara independen di audit CODEX** dari sudut sama sekali
  berbeda (imaging pre-diagnosis).
- `kia_preeklampsia_berat` — ACOG PB222 (2020) sudah MENGHAPUS proteinuria
  sbg syarat wajib preeklampsia berat; clue lama tampaknya masih
  mensyaratkannya.
- `anemia_defisiensi_bumil` — mikrositik-hipokrom bisa thalassemia trait
  (lazim di Indonesia), bukan otomatis defisiensi besi.
- `jiwa_insomnia` — "higiene tidur" TUNGGAL buktinya lemah (AASM 2021
  against); inti CBT-I = kontrol-stimulus + pembatasan tidur.
- `kulit_pioderma_impetigo` — antibiotik impetigo TAK terbukti mencegah
  GNAPS (beda dari demam rematik); klaim lama "mencegah komplikasi ginjal"
  perlu dikoreksi.

Dokumen lengkap: `docs/M11_FASE2_RISET_PENGAYAAN.md` + artefak interaktif
(belum diadjudikasi Dr. Wirayuda saat dossier ini ditulis).

### 2b. Ronde verifikasi CODEX independen (workflow `codex-ronde-verifikasi`, 23 agen, terhadap laporan CODEX read-only commit `6e1b2bcc`)

**Semua 14 temuan sistemik CODEX terverifikasi benar** — 8 dikonfirmasi
penuh, 6 sebagian benar, **NOL yang basi/keliru** (termasuk dua angka presisi
yang saya cek ulang independen dan cocok persis: 13/97 obat & 8/19 antibiotik
bertag alergi). Dikategorikan menurut jenis remediasi:

| # | Temuan (ringkas) | Kategori | Keyakinan |
|---|---|---|---|
| 1 | Mesin resep tanpa dosis/rute/frekuensi/durasi/BB; firewall alergi 13/97 obat & 8/19 antibiotik; nol pemeriksa interaksi obat | **desain-engine** | tinggi |
| 2 | Storyline Asih (TD 150/95+edema→sakit kepala menetap) diarahkan baca buku KIA seminggu, bukan eskalasi HDP/preeklamsia | desain-engine (mekanisme karma "selesai" tanpa aksi klinis) | tinggi |
| 3 | Stroke ditetapkan iskemik (I63.9) tanpa CT; storyline Lastri (TD 208/118+pelo) dipetakan hipertensi urgensi, bukan suspected stroke | keputusan-medis | tinggi |
| 4 | ANC: gol.darah tak relevan dinilai, tanpa HIV/sifilis/HBsAg, folat dobel, target 90 TTD ketinggalan; Hb 8,5 hamil tak dirujuk; MgSO4 tanpa loading/maintenance | keputusan-medis | sedang |
| 5 | DM (HbA1c 8,9%) hanya metformin tanpa eGFR/UACR; HT (TD 160/95) hanya amlodipin tunggal tanpa work-up target-organ | keputusan-medis | tinggi |
| 6 | Diare anak tanpa Plan B 75mL/kg/4jam; IGD dengue tanpa laju cairan; asma berat tanpa ipratropium; anafilaksis wajib steroid rutin | keputusan-medis | tinggi |
| 7 | Prolanis: GDS<200 tunggal = "terkontrol"; DBP=0,62×SBP; rujukan bisa terblokir walau drift masuk rentang gawat | **desain-engine** | tinggi |
| 8 | TB: diagnosis hanya BTA tanpa TCM/HIV; keluarga Santoso — anak kontak serumah bergejala TAK BISA dipilih bersama intervensi utama (batasan UI/struktur data) | keputusan-medis | tinggi |
| 9 | Keberhasilan KB Dewi dinarasikan keputusan suami; Karsa perlu izin suami utk zat besi — pelanggaran otonomi pasien perempuan | keputusan-medis (nilai/desain naratif) | tinggi |
| 10 | Terapi kondisional dipaksa jadi AND (common cold wajib 3 obat, PPOK dobel inhaler+nebulisasi, epistaksis wajib tampon walau sudah terlokalisasi) | **desain-engine** (pola scoring `clinic.ts:494`) | tinggi |
| 11 | Widal tunggal dikredit; GAS dilabel tanpa RADT/kultur; K29.7 "gastritis" = uninvestigated dyspepsia; **I16.0 dari ICD-10-CM, bukan WHO ICD-10 2010/SATUSEHAT**; DRE hemoroid/apendisitis disembunyikan region "ekstremitas" | keputusan-medis | tinggi |
| 12 | Zoster klaim asiklovir cegah PHN; OA/RA "urat normal singkirkan gout"; apendisitis benarkan+larang analgesia sekaligus; clue gout lama larang ULT saat flare (lawan pearl M11+ACR) | keputusan-medis | tinggi |
| 13 | Distraktor eksplisit `kasusInfeksi.ts` tak ditandai `distraktor:true`; fallback usia <15 bikin wali ucap jawaban dewasa ("teman kos", dst.) | **mekanis-aman** | tinggi |
| 14 | Kegagalan edukasi tak ikut tentukan konsekuensi walau narasi menyalahkannya; konsekuensi hari-0 baru diproses di `HARI_BARU` | **desain-engine** | tinggi |

**Audit ulang tabel 67-kasus CODEX**: 44/67 dikonfirmasi, 17 tak-jelas
(ambigu/butuh penilaian klinis kasus-per-kasus), **6 basi/keliru** (klaim
per-kasus CODEX yang TAK bertahan saat diverifikasi ulang — detail di
artefak §2c). **UKM/keluarga**: 16/24 dikonfirmasi (termasuk pola berulang:
istilah BGM disalahgunakan Posyandu, KLB konjungtivitis disamakan skabies,
morbili tak masuk mesin surveilans, jadwal imunisasi Ketut ketinggalan).
**IGD**: 5/5 dikonfirmasi (steroid rutin anafilaksis, timeline kejang-demam,
ipratropium hilang asma berat, dosis D40 hipoglikemia tak eksplisit, laju
cairan+kriteria usia dengue syok — semua nyata).

### 2c. Kedua dokumen mentah (dibaca lebih dulu sebelum menjawab §3)

- `docs/M11_FASE2_RISET_PENGAYAAN.md` — 118 kandidat pengayaan lengkap.
- Artefak interaktif riset pengayaan & triase CODEX (tersedia di sesi kerja
  Dr. Wirayuda — berisi rincian per-temuan, sitasi, & tabel per-kasus
  lengkap; ringkasannya sudah dirangkum §2a/2b di atas).

## 3. PETA PERSIMPANGAN — PERTANYAAN STRATEGIS

### Q1 — Fidelitas resep: model dosis atau tidak? (temuan #1, akar dari banyak temuan lain)

**Fakta:** `Obat` (types.ts:281) tak punya field dosis/rute/frekuensi/
durasi; `demografi` pasien (types.ts:178) tak punya berat badan; `resep`
(state.ts:104) cuma `string[]` ID obat; skor terapi (`clinic.ts:494`) murni
set-membership ID — meresepkan ID benar dgn dosis SALAH (andaikan ada) tetap
skor penuh, karena mekanismenya memang tak eksis. Ini BUKAN bug lokal — ini
gap arsitektural yang menyentuh 97 obat × berapa pun kasus yang relevan.

**Opsi:**
- **O1 (status quo, didokumentasikan eksplisit):** PRIMERA secara sadar TAK
  memodelkan presisi dosis — skop game FKTP-edukasi (diagnosis→pilihan
  kelas obat yang tepat→edukasi), bukan simulator e-prescribing. Tulis ini
  eksplisit di GDD/dokumentasi supaya bukan "gap tersembunyi" tapi
  "batasan skop yang disengaja".
- **O2 (model dosis penuh):** tambah field dosis/rute/frekuensi/durasi ke
  `Obat` + input UI + logika skor per-kasus utk 97 obat. Biaya BESAR (UI
  baru, kurasi 97×dosis, kemungkinan REVISI bump) — pertanyaan: sepadan utk
  timeline Sept?
- **O3 (model dosis PARSIAL, kelas obat berisiko-tinggi saja):** obat di
  mana dosis SALAH itu sendiri adalah pelajaran keselamatan (mis. insulin,
  antikoagulan, obat pediatrik berat-badan-dependent seperti amoksisilin
  anak) dapat field dosis + gerbang skor; sisanya tetap ID-saja. Biaya
  sedang, tertarget ke kasus yang paling "berisiko-nyata" secara pedagogis.

**Catatan terpisah, TAK bergantung pada pilihan di atas:** cakupan firewall
alergi (13/97 obat, 8/19 antibiotik bertag `golonganAlergi`) adalah gap DATA
murni, mekanis-aman, biaya rendah, risiko regresi rendah (mekanismenya sudah
ada di `clinic.ts:292` — tinggal menambah tag ke ~11 antibiotik & obat
non-antibiotik yang relevan). **Q1a:** apakah ini layak jadi "quick win"
independen dikerjakan sekarang, terlepas dari keputusan O1/O2/O3?

**Pertanyaan:** Mana dari O1/O2/O3 yang paling konsisten dgn hierarki
prioritas §0e (integritas pedagogis) TANPA mengorbankan kelayakan solo-dev
menjelang Sept? Bila O3, kelas obat/kasus mana yang PALING berhak masuk
tahap pertama?

### Q2 — Klaster "keselamatan klinis" (temuan #2, #3, #6, #8): tarik keluar dari M11 "pengayaan", jadi jalur cepat tersendiri?

**Fakta:** Beberapa temuan bukan sekadar "kurang lengkap" — game secara
AKTIF mengajarkan refleks yang salah/berbahaya ke mahasiswa yang akan jadi
dokter sungguhan: storyline Asih menunda eskalasi preeklampsia seminggu
penuh (karma "selesai" begitu SATU kunjungan ber-`berhasil=true`, terlepas
isi kunjungannya — dikonfirmasi di `reducer.ts:724-734`); stroke Lastri
(TD 208/118+pelo) dipetakan ke hipertensi urgensi bukan kegawatan; anak
kontak-serumah TB bergejala TAK BISA dipilih bersamaan dgn intervensi utama
(batasan struktur data `Kunjungan`, bukan sekadar konten kurang); prolanis
bisa "meloloskan" pasien yg driftnya sebenarnya masuk rentang gawat.

Ini beda KELAS dari sisa M11 (variasi storyline, polish visual, mutiara
EBM tambahan) — kesalahannya berpotensi membentuk *hidden curriculum*
keliru pada asesmen yang sungguhan dipakai menilai mahasiswa.

**Pertanyaan:** Haruskah 4 klaster ini (± item terkait yang muncul di audit
per-kasus/UKM, mis. Karsa/Dewi §Q7) ditarik keluar dari milestone "M11 —
pengayaan" (yang secara definisi §1.4 adalah "polish", bukan "koreksi
keselamatan") dan diproses sbg jalur cepat TERSENDIRI, diprioritaskan DI
ATAS sisa pekerjaan M11 lain — meski itu berarti M11 "resmi" secara timeline
terlihat lebih lambat selesai?

### Q3 — Re-skop M11: pisah jadi M11a (pengayaan murni, sudah jalan) vs M10.5/M11b (koreksi & desain-engine, akan butuh REVISI)?

**Fakta:** M11 didefinisikan pengguna sbg "pengayaan & polish", TANPA
implikasi REVISI_ENGINE (§1.4). Tapi separuh dari 14 temuan CODEX (5 dari
14: temuan #1/#2/#7/#10/#14) adalah **desain-engine** — mengubah mekanisme
skor/replay, yg BERARTI mereka akan butuh bump `REVISI_ENGINE` bila
dikerjakan (berbeda sifat dari field display M11 Fase-1 yg sengaja
tak-di-hash). Menaruh keduanya di bawah nama "M11" yg sama berisiko
mengaburkan mana yg aman-kapan-saja vs mana yg perlu jendela rilis khusus.

**Pertanyaan:** Apakah lebih sehat memformalkan pemisahan — **M11a**
(pengayaan pure-display: Fase-1/Fase-2 yg sudah jalan, TANPA REVISI, aman
dicicil kapan pun) vs **milestone baru terpisah** (nama: M10.5? "Kesetiaan
Klinis"? "M11-koreksi"?) yg menampung SEMUA temuan `desain-engine` +
`keputusan-medis` dari audit ini, secara eksplisit BOLEH ber-REVISI dan
BOLEH mengubah UI/skor? Atau justru pemisahan formal ini birokrasi
berlebihan utk tim solo, dan cukup ditandai per-item di dossier (spt yg
sudah dilakukan §2b) tanpa perlu nama milestone baru?

### Q4 — Kapan jendela REVISI_ENGINE terakhir sebelum semester dimulai?

**Fakta:** Redeploy ±September 2026 utk 50 mahasiswa yg akan main SEPANJANG
semester (90 hari karier ATAU 30 hari ujian). `REVISI_ENGINE` bump membuat
save/dossier LAMA jatuh ke "tidak dapat diverifikasi" saat direplay dgn
semantik baru — pola yg SUDAH diterima utk save developer/playtest, tapi
belum pernah diuji tekanannya thd mahasiswa sungguhan yg SEDANG di tengah
stase saat bump terjadi.

Temuan §2b berpotensi memicu 5 kandidat bump `desain-engine` (#1/#2/#7/#10/
#14) — jauh lebih banyak dari biasanya (histori: 1-2 temuan ber-REVISI per
ronde). Bila semua dikerjakan satu-satu tersebar sepanjang M11, berpotensi
5× lebih banyak titik "versi lama tak dapat diverifikasi" drpd biasanya.

**Pertanyaan:** Haruskah SEMUA bump `desain-engine` yg diputuskan
dikerjakan (dari Q1-Q3) DIKUMPULKAN jadi SATU rilis REVISI tunggal
sebelum tanggal cutoff (mis. akhir Agustus, sebelum semester Sept mulai) —
supaya mahasiswa SELALU mulai dgn semantik final, dan TAK ADA bump lagi
setelah kelas berjalan? Atau strategi "bump kapan pun siap, mahasiswa
paham versi bisa berubah" tetap dapat diterima asalkan dikomunikasikan?

### Q5 — Sekuensing di bawah tenggat: apa yg WAJIB utk Sept, apa yg aman ditunda?

**Fakta, seluruh permukaan kerja yg kini diketahui, per hari ini:**
(a) M11 Fase-2: 118 kandidat pengayaan (murni display, aman kapan saja);
(b) 14 temuan CODEX (1 mekanis-aman, 8 keputusan-medis, 5 desain-engine);
(c) 6 temuan per-kasus + 8 UKM tambahan yg tak masuk 14 besar;
(d) sisa scope M11 yg BELUM disentuh sama sekali: variasi storyline,
polish visual, mekanik variasi presentasi-penyakit (butuh desain director
baru), variasi kasus UKM, + 5 item mekanik-skoring pindahan dari M10 Batch-3
(P1.6/P1.7/P1.9/C.1/C.8 — definisi tiap kode ada di glosarium §0f);
(e) M12 (pass estetika penuh, dijadwalkan SETELAH M10/M11);
(f) pertimbangan cross-platform/mobile (di-flag terpisah, belum dikerjakan).

Arsitektur non-REVISI (§1.5) berarti (a) dan sebagian besar (c)/(d)/(e)
BISA dirilis SETELAH Sept tanpa merusak save mahasiswa yg sedang jalan —
alat tawar nyata utk menunda yg tak genuinely mendesak.

**Pertanyaan:** Dgn kerangka "load-bearing utk Sept" (game harus BENAR &
tak menyesatkan saat 50 mahasiswa dinilai) vs "aman-ditunda-pasca-Sept"
(diaktifkan via patch non-REVISI ke save yg sedang jalan) — bagaimana
Anda mengurutkan (a)-(f) di atas? Item mana yg secara jujur TAK BISA
ditunda meski itu berarti mengorbankan item lain?

### Q6 — "Idealis vs realita FKTP" vs "sekadar ketinggalan zaman": perlu taksonomi 3 arah yang eksplisit?

**Fakta:** M11 item asal (pengayaan) lahir dari premis "PRIMERA SENGAJA
menggambarkan FKTP ideal, `catatanRealita` menjembatani ke realita" (mis.
kolkisin gout tak selalu tersedia). Tapi audit hari ini menunjukkan
sebagian "kesenjangan" BUKAN idealisme-vs-realita sama sekali — itu sekadar
KETINGGALAN pedoman (target 90 TTD ANC, syarat proteinuria preeklampsia,
Widal tunggal, kode ICD-10-CM vs WHO). Menyamakan keduanya di bawah payung
"pengayaan realita FKTP" berisiko MELUNAKKAN sesuatu yg sebenarnya perlu
DIPERBAIKI tegas, bukan diberi catatan tambahan yg menjembataninya.

**Pertanyaan:** Apakah proyek perlu taksonomi eksplisit 3-arah tiap kali
menemukan gap semacam ini — **(i) idealis-by-design** (pertahankan, cukup
anotasi `catatanRealita`), **(ii) usang/keliru** (WAJIB diperbaiki
langsung, terlepas dari framing idealisme), **(iii) realita-FKTP genuin
layak-ajar** (memang layak jadi `catatanRealita` baru) — atau klasifikasi
ini sudah cukup terjadi secara implisit lewat kerja triase yg sudah
berjalan (§2b), dan menambah field/tag formal untuk ini hanya birokrasi
tanpa manfaat nyata?

### Q7 — Pola otonomi naratif (temuan #9): kejadian tunggal atau gejala sistemik di 16 arc keluarga?

**Fakta:** KB Dewi (`desaB.ts:1499`) & zat besi Karsa (`desaF.ts:995`)
sama-sama membingkai keberhasilan/kepatuhan sbg butuh IZIN suami, bukan
keputusan pasien perempuan sendiri (pelibatan pasangan itu baik & benar
secara budaya-klinis; MEWAJIBKAN otorisasi bukan). Ini muncul di DUA arc
keluarga yg beda, ditulis kemungkinan di waktu berbeda — pola yg berulang,
bukan sekali ketikan.

**Pertanyaan:** Apakah ini cukup utk menjustifikasi SAPUAN eksplisit
membaca ulang seluruh 16 arc `desaA.ts`-`desaF.ts` dgn lensa "pelibatan vs
otorisasi pasangan" (kemungkinan pola ini muncul di tempat lain yg belum
ketahuan), ATAU cukup ditambal di 2 titik yg sudah dikonfirmasi & ditunggu
laporan berikutnya utk menemukan sisanya secara reaktif (pola kerja proyek
ini sejauh ini)?

### Q8 — Audit ICD-10 sistemik: temuan lokal atau proyek tersendiri?

**Fakta:** Temuan #11 menunjuk SATU contoh konkret (`I16.0` dari
ICD-10-CM, bukan WHO ICD-10 2010 yg dipakai SATUSEHAT) tapi menyiratkan
KELAS masalah — proyek ini sebelumnya SUDAH pernah menambal 1 kode serupa
sendiri-sendiri (`K35.80`→`K35.8` di M10 Batch-3). Preseden M9.2 (audit
SKDI/ICD sistemik, direncanakan tapi terhambat krn tak ada dokumen Kepmenkes
144-FKTP di tangan) relevan di sini: apakah audit ICD kali ini boleh
"cukup dgn SKDI umum + penilaian klinis sendiri", atau tetap harus menunggu
sumber resmi sblm melangkah lebih jauh dari 1-2 kode yg sudah ketahuan?

**Pertanyaan:** Apakah kode ICD di SEMUA 67+ kasus/IGD layak disapu sekali
dalam SATU pass sistemik (bukan ditambal reaktif per-temuan CODEX), dan
jika ya — apakah kelayakannya bergantung pada tersedianya dokumen Kepmenkes
resmi (blocker M9.2 lama), atau sudah cukup diverifikasi via WHO ICD-10
2010 + SATUSEHAT terminology page (yg sudah dipakai audit hari ini) tanpa
menunggu dokumen itu?

## 4. FORMAT OUTPUT YANG DIMINTA

Untuk tiap Q1–Q8:
- **Penilaian** (2–4 kalimat): posisimu, dgn alasan berbasis literatur
  pendidikan kedokteran / manajemen produk-solo-dev bila relevan.
- **Rekomendasi konkret** (1 kalimat actionable).
- **Tag keyakinan:** [Kuat] / [Sedang] / [Spekulatif].

Lalu:
- **Satu urutan-kerja end-to-end yang kamu rekomendasikan** (Q1→Q8 saling
  bergantung — mis. jawaban Q3 membentuk jawaban Q4; sintesiskan jadi SATU
  jalur, bukan 8 jawaban lepas).
- **Satu keputusan yang paling kamu khawatirkan** (blind spot yg tim
  mungkin lewatkan di persimpangan ini).
- **Satu hal yang tim lakukan BENAR** dan tidak boleh diubah karena
  tekanan tenggat (mis. disiplin test-first, triase-sebelum-fix,
  arsitektur non-REVISI utk display layer).

## 5. BIAS-CHECK MANDATORY (jawab singkat di akhir)

- Apakah rekomendasimu bias ke "perbaiki semuanya sekarang" padahal
  solo-dev + tenggat Sept nyata? Koreksi bila perlu.
- Apakah kamu mengasumsikan tim py kapasitas QA/medis-review setara
  institusi besar, padahal ini satu dokter + agen AI? Koreksi.
- Untuk Q2/Q7 (keselamatan & otonomi) — apakah kekhawatiranmu proporsional
  dgn bukti yg ada (2b), atau kamu overclaim risiko dari sampel kecil?
- Di mana kamu paling mungkin SALAH?

---

*Triangulasi PRIMERA: Claude (builder + verifier independen ronde ini) ·
CODEX (auditor asal, read-only) · DeepThink (reviewer strategis). Tiga
sudut independen; sintesis akhir & keputusan tetap milik Dr. Wirayuda.*
