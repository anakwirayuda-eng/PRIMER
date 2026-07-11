# DEEPTHINK BRIEF — M13: Skala Penuh (144/225 kasus) + Variasi Epidemiologi Regional

Dokumen ini mandiri (self-contained) — asumsikan DeepThink tidak tahu apa-apa soal
sesi ini. Konteks proyek diberikan dulu, baru scope M13, baru pertanyaan yang perlu
ditriangulasi.

## 0. Konteks 90 detik — PRIMERA

PRIMERA "Puskesmas Pagi" adalah game edukasi dokter FKTP Indonesia — *"Football
Manager-nya kedokteran komunitas dengan hati Harvest Moon"*. Pemain = dokter
fresh-grad, stase 90 hari Karier (bebas nilai) atau 30 hari Ujian (satu-satunya
yang dinilai formal, seed kurikulum dari salah satu dari 8 paket rotasi) di
Puskesmas Desa Sukamaju (satu desa fiksi tetap, bukan simulator multi-region).
Target deploy: ~50 mahasiswa FK, ~September 2026. Engine TypeScript murni,
server-authoritative-style determinism (replay/verifikasi HMAC), sudah lewat
milestone M0-M11.5. Dokumen acuan proyek yang relevan: `ROADMAP.md`,
`CODEX_AUDIT_DOSSIER.md`, `M10_5_FIDELITAS.md` (rencana Golden Master akhir
Agustus 2026 — hard-freeze `reducer.ts`/`clinic.ts`/`scoring.ts`).

## 1. Bagaimana M13 lahir (2026-07-11)

Dr. Wirayuda (developer tunggal proyek ini) melihat game hanya punya 67 kasus
playable dan panik ("saya merasa disabotase oleh Claude") — mengira ini regresi
konten akibat keterbatasan context/token AI di sesi-sesi sebelumnya, karena
angka "144 penyakit FKTP" sering disebut di seluruh dokumentasi proyek.

Audit 5-agen (baca git log penuh + dokumen desain asli) mengonfirmasi **TIDAK
ADA REGRESI**: jumlah kasus di `src/content/kasus/` tak pernah turun sepanjang
histori git (16 → melompat ke 67 dalam SATU commit M3a → tetap 67 stabil
selama puluhan commit sampai HEAD). Root cause kekhawatiran: dua makna "144"
yang tertukar —
1. **`skdi144.ts`/"Dex SKDI"** — katalog REFERENSI 144 penyakit (persis SKDI
   2012 Lampiran-3 kompetensi 4A), didesain SEJAK draft `GDD.md` PALING AWAL
   sbg "144 siluet, sebagian terisi" — sebuah Pokedex yang MEMANG dirancang
   terisi bertahap, bukan janji 144 kasus interaktif penuh.
2. **Target "full-fledged"** — ditulis EKSPLISIT oleh user sendiri di
   `ROADMAP.md`/`KONTEN_BALANCE.md` tanggal 2026-07-02 (144 4A + ~60 rujukan +
   ~20 IGD ≈ 225 kasus, porting dari repo lama 253+34 kasus) — TAPI dokumen
   yang sama membedakannya tegas dari checkpoint M3 (60+/67) yang ditandai
   SELESAI ✅. Sejak itu tak pernah dijadwalkan ulang di M4-M12 manapun —
   backlog murni, bukan sesuatu yang "hilang".

M13 diformalkan untuk mengaktifkan kembali aspirasi #2 secara sadar, dengan
scope yang sekarang mencakup DUA sub-bagian (A = skala konten, B = variasi
regional — B ditambahkan sesi yang sama setelah user menyerahkan 3 dokumen
riset epidemiologi).

## 2. Sub-scope A — Skala penuh 144/225 kasus

**Angka:** dari 67 kasus saat ini (50×4A + 7×3A + 9×3B + 1×level-2, pasca
koreksi M9.2 follow-up yang juga terjadi sesi ini — 5 kasus yang skdi
self-report-nya salah dikoreksi ke level resmi) menuju **144 penyakit 4A
playable + ~60 kasus wajib-rujuk (3A/3B/2) + ~20 IGD ≈ 225 total** — perlu
**~152 kasus baru**.

**Aset porting yang tersedia, dan risikonya:** ada repo LAMA (`D:\Dev\PRIMER\src\`,
proyek PRIMER pra-rebuild, codebase 100% berbeda — React/Supabase web app,
sudah dormant sejak 2026-04-27) dengan 253 kasus rawat jalan + ~34 kasus IGD
yang secara teori bisa di-port utk mempercepat penulisan 152 kasus baru. TAPI
repo lama itu PERSIS yang punya insiden P0 terdokumentasi: `master_icd_10.json`-nya
mengandung terjemahan ICD-10 yang salah secara medis berbahaya (mis. kode
jantung C38.0 diberi label Indonesia "hati"/liver; kode respiratory-arrest
R09.2 diberi label "pernapasan lambat"). Insiden itu sudah diperbaiki di repo
lama (commit `4d348d9`, 2026-04-27), tapi ini bukti konkret bahwa dataset
tersebut PERNAH tak bisa dipercaya mentah — porting 152 kasus dari sana tidak
boleh blind-copy, harus diverifikasi ulang per kasus terhadap ICD-10/dosis/
kompetensi resmi (pola yang sama dgn riset PPK 1186/M11.5: grounding wajib,
bukan asumsi sumber lama otomatis benar).

**Tensi jadwal:** Golden Master (`M10_5_FIDELITAS.md`) dijadwalkan akhir
Agustus 2026 — hard-freeze mesin skor demi stabilitas semester. Menulis ~152
kasus ber-akurasi-medis (tiap kasus historisnya butuh riset EBM + kadang audit
dokter berlapis) dalam window ~7 minggu menuju itu, SAMBIL menuntaskan sisa
M10.5/M11, dinilai terlalu berisiko bagi kualitas & tenggat. **Keputusan user
saat M13 diformalkan: sequencing PASCA-Golden-Master, TIDAK dijadwalkan
tanggal mulai** (dipilih eksplisit di antara opsi "mulai sekarang paralel" dan
"tunda total sampai pasca-September").

## 3. Sub-scope B — Variasi epidemiologi regional

Dr. Wirayuda menyerahkan 3 dokumen riset Indonesia (bukan disusun oleh AI di
sesi ini — file eksternal dari user):
1. **"Profil Kesehatan Nusantara 2023"** (PDF, 15 halaman, gaya infografis)
2. **"Indonesia Precision Health Atlas"** (PDF, 15 halaman, gaya infografis)
3. **"Lanskap Epidemiologi Regional Indonesia 2024-2026"** (docx, esai naratif
   dengan **42 sitasi tertelusur** ke Kemenkes/jurnal UGM-UI/PubMed/PLOS/dll)

**Catatan kualitas sumber, penting:** dokumen #3 adalah satu-satunya dari
ketiganya yang bisa diverifikasi silang (setiap klaim bernomor sitasi ke URL
nyata). Dokumen #1 dan #2 menyajikan angka yang tampak spesifik dan presisi
(mis. "30,8% prevalensi hipertensi", "140.206 pasien jantung usia 25-34") TAPI
setelah dibaca PENUH (seluruh 15 halaman masing-masing), **tidak ditemukan
satu pun daftar pustaka atau sitasi ke sumber primer**. Ini tak serta-merta
berarti angkanya salah, tapi berarti angkanya TIDAK bisa langsung dipercaya
mentah dgn standar grounding yang proyek ini pakai di M11.5/PPK 1186 — kalau
nanti angka spesifik dari dokumen #1/#2 mau masuk literal ke `clue`/dosis
kasus, WAJIB diverifikasi ulang ke sumber resmi dulu, persis disiplin yang
sudah dipakai utk riset panduanResmi.

### 3a. Fakta kunci dari ketiga dokumen (ringkas)

- **Disparitas ekstrem tersembunyi di rata-rata nasional**: stunting nasional
  21,5% tapi NTT 37,9% vs Bali 7,2% (5x lipat); malaria 706.000 kasus
  nasional 2025 tapi 86-95% terkonsentrasi di Papua; DKI Jakarta 16.165
  jiwa/km² vs Papua Selatan 5 jiwa/km².
- **3 zona epidemiologi berbeda karakter**: Zona 1 (urban/industri — Jawa,
  sebagian Sumatra/Kalimantan Timur): ledakan PTM (jantung, DM, hipertensi),
  gaya hidup sedenter, dengue urban. Zona 2 (transisi/pertanian): hipertensi
  bercampur zoonosis (rabies, schistosomiasis) & malaria-hutan. Zona 3
  (timur/kepulauan — Papua/NTT/Maluku): kegagalan sistem dasar, gizi buruk
  absolut, infeksi hiper-endemis.
- **Funnel ANC yang bocor**: K1 murni 86,7% → ANC K4 68,1% (turun 6%, "pasien
  mulai gugur") → ANC K6 USG cuma 17,6% ("defisit deteksi klinis") — 4.129
  kematian ibu (hipertensi/pre-eklampsia 412 kasus, perdarahan 360 kasus).
- **KLB spesifik yang terjadi nyata**: wabah polio cVDPV2 2022-2025 (asal
  Aceh, menyebar ke 8 provinsi, direspons >60 juta dosis nOPV2 + PIN, resmi
  dicabut statusnya 2025-11-19); lonjakan DBD 3x lipat (62.001 kasus,
  episentrum sakit di kota padat Jawa, episentrum kematian di pedalaman
  terpencil krn akses rujukan telat); rabies (185.359 gigitan, 122 kematian,
  endemis 26 provinsi); Mpox mulai bersarang urban (88 kasus terkonfirmasi
  s/d medio 2026, 59 di antaranya DKI Jakarta).
- **Diabetes — defisit diagnosis masif**: prevalensi biomarker riil 10,9%
  tapi hanya 2,2-2,4% terdiagnosis dokter (gunung es besar, kebanyakan tak
  sadar sampai komplikasi katastropik).

### 3b. Ide konkret, dikelompokkan per tingkat kesiapan

**Tier 1 — murah, pas mekanik existing, hampir tak berisiko:**
1. **Rotasi Regional Mode Ujian** — 8 paket rotasi (`paketUjian.ts`) diberi
   bobot kasus + flavor teks per 3-zona di atas. Director sudah punya sistem
   bobot kasus (`bobotKasus`, `BIAS_4A_MINGGU_1`, dll) — ini penambahan DATA
   ke sistem yang sudah ada, bukan mesin baru. **Catatan desain penting**:
   setting narasi tetap Desa Sukamaju (bukan re-lokasi literal) — regional
   rotation berarti "seolah-olah kau dirotasi ke Puskesmas dgn beban penyakit
   X", bukan mengubah lore desa itu sendiri.
2. **KLB via surat masuk** — pola inbox/kalender-musim/Program-Wilayah yang
   sudah ada bisa memicu event KLB musiman (PIN Polio, PSN 3M Plus pasca-
   lonjakan DBD) — pola sama persis yang sudah dipakai Program Wilayah lain.
3. **Funnel ANC bocor sbg cabang baru arc bumil risti** — arc 3-babak yang
   sudah ada (skor Poedji Rochjati) dapat cabang: bumil yang "gugur" antar
   K1→K4→K6, mengajarkan continuity-of-care.
4. **MPASI/stunting sbg pengayaan kader/posyandu** — mekanik existing +
   konten spesifik jendela kritis 6-23 bulan.

**Tier 2 — kasus baru utk M13 sub-scope A, butuh riset PPK/SKDI spt biasa:**
5. Filariasis (kaki gajah) — NTD, distribusi DEC+Albendazole.
6. Rabies — kandidat kasus IGD gawat (protokol VAR/SAR, "jangan tunggu
   gejala klinis utk mulai profilaksis").
7. HFMD/Flu Singapura — kasus anak, masuk kategori KIA/anak existing.

**Tier 3 — perlu keputusan sadar dr. Wirayuda dulu, BUKAN diputuskan sepihak:**
8. **Mpox** — datanya nyata & pedagogically genuinely menarik (deteksi lesi,
   isolasi, contact tracing, timeline PHEIC global), TAPI populasi berisiko
   yang tercatat sangat spesifik (96,6% laki-laki, 67,2% terkait aktivitas
   seksual dalam jendela 21 hari pra-lesi) — ini konten kesehatan-seksual
   sensitif utk kohort mahasiswa FK yang beragam. Belum ada keputusan nada/
   pendekatan penulisan. Tidak diasumsikan "aman diproses seperti kasus
   biasa" tanpa arahan eksplisit developer.

## 4. Pertanyaan spesifik untuk DeepThink

**Q1 — Sequencing pasca-Golden-Master, apakah benar-benar semuanya harus
menunggu?** User memilih "M13 disequenc-kan setelah Golden Master, tidak
dijadwalkan." Tapi ide Tier 1 di atas (khususnya #1 Rotasi Regional & #2 KLB
via surat) adalah penambahan KONTEN/DATA ke sistem yang sudah ada (Director
weighting, Program Wilayah), BUKAN perubahan `reducer.ts`/`clinic.ts`/
`scoring.ts` yang di-hard-freeze. Apakah item se-ringan ini boleh/pantas
dikerjakan LEBIH AWAL (paralel dgn M10.5) tanpa melanggar semangat "jangan
bebani window menuju Golden Master", ATAU tetap sebaiknya ditahan bersama
sub-scope A demi kesederhanaan satu-milestone-satu-waktu?

**Q2 — Strategi porting dari repo lama: percepat atau berisiko?** Mengingat
repo lama PERNAH punya insiden ICD-poisoning P0 (sudah diperbaiki DI REPO
LAMA, tapi buktinya dataset itu bisa salah tanpa terdeteksi lama), apakah
porting 253+34 kasus lama (dgn verifikasi ulang PENUH per kasus) benar-benar
lebih cepat/aman drpd menulis dari nol dgn riset PPK/SKDI grounded (pola
M11.5)? Atau adakah cara hybrid yang disarankan (mis. porting HANYA struktur
naratif/persona, riset ulang TOTAL utk fakta klinis)?

**Q3 — Mpox: layak dimasukkan sama sekali utk target audiens ini?** ~50
mahasiswa FK Indonesia, kemungkinan beragam usia/latar belakang. Apakah ada
cara mengajarkan kompetensi klinis inti (kenali lesi, gerbang isolasi,
pelaporan KLB, prinsip contact-tracing) TANPA menonjolkan demografi
transmisi-seksual spesifik secara stigmatisasi/eksploitatif — ATAU apakah
lebih bijak dikecualikan total dari game ini, dan kalau dikecualikan,
alasannya apa yang paling defensible (bukan sekadar "sensitif" tanpa
penjelasan)?

**Q4 — Apakah "Rotasi Regional" pedagogis-jujur atau berpotensi menyesatkan?**
Desa Sukamaju adalah setting FIKSI tetap. Memberi rotasi "paket ujian bertema
Papua" dgn bobot kasus regional TANPA mengubah lore desa itu sendiri —
apakah ini framing yang jujur ("latihan menangani beban penyakit KHAS suatu
wilayah", analog simulasi militer/pesawat yang mensimulasikan skenario tanpa
mengklaim lokasi asli), atau berisiko terasa inkoheren/membingungkan pemain
(kenapa Desa Sukamaju tiba-tiba wabahnya seperti Papua)? Kalau berisiko,
adakah reframing naratif yang lebih koheren (mis. eksplisit "simulasi
skenario rotasi", bukan implisit "desa yang sama tiba-tiba beda")?

**Q5 — Prioritas 152 kasus baru: kondisi umum dulu, atau kondisi
dramatis-langka-tapi-wajib dulu?** Ketika M13 akhirnya mulai (pasca-Golden-
Master), dari ~152 kasus yang perlu ditulis untuk genap 144 SKDI-4A + ~60
rujukan + ~20 IGD, apakah strategi urutan penulisan yang disarankan: (a)
kondisi FREKUENSI-TINGGI dulu (dampak pembelajaran terbesar per kasus
ditulis, ROI tinggi), (b) kondisi LANGKA-TAPI-WAJIB-KOMPETENSI dulu (isi gap
SKDI-4A yang paling jarang disentuh kurikulum lain), atau (c) mengikuti
struktur Tier A/B/C kedalaman yang sudah dirancang user di
`KONTEN_BALANCE.md` (Tier A ±40 kasus sering-full-depth, Tier B ±60-standar,
Tier C ±44 langka-tapi-wajib-ringkas)?

## 5. Yang TIDAK perlu ditriangulasi ulang

- Status "M13 belum dijadwalkan, murni pencatatan scope" — ini keputusan
  user yang sudah final untuk saat ini, bukan pertanyaan terbuka.
  Golden Master sequencing sub-scope A juga sudah diputuskan (§2 akhir) —
  Q1 di atas HANYA menyoal apakah sebagian kecil sub-scope B bisa dikecualikan
  dari penundaan itu, bukan membuka ulang seluruh keputusan.
- Fakta bahwa tidak ada regresi konten (§1) — sudah diverifikasi tuntas via
  audit git-history 5-agen, bukan area yang perlu opini kedua.
