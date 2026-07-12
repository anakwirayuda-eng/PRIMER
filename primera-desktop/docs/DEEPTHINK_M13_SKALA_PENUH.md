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

## 3c. Sub-scope D (BARU 2026-07-12) — Mode Endurance: kejar 144 diagnosis

*(Catatan penomoran: "Sub-scope C" sudah dipakai untuk referensi obat/formularium
DOEN 2021 — lihat memori proyek. Ide baru ini diberi label "Sub-scope D" supaya
tak bentrok, meski posisinya di dokumen ini mengikuti sub-scope B.)*

**Catatan sequencing penting (2026-07-12):** Dr. Wirayuda mengubah urutan milestone —
**M13 sekarang direncanakan SEBELUM M12** ("lebih krusial"), membalik urutan lama
("M12 dijadwalkan setelah M10/M11"). Ini TIDAK mengubah keputusan §2 (M13 sub-scope
A tetap pasca-Golden-Master) — yang berubah murni posisi M13 vs M12 dalam antrean
milestone besar, bukan hubungannya dengan freeze.

### Asal pertanyaan

Dr. Wirayuda bertanya eksploratif (bukan keputusan final, murni brainstorm): *"lazimnya,
bila kita buat mode utk peserta hunt mengumpulkan ke 144 kasus, dengan memperhitungkan
epidemiologi, demografi, prevalensi, statistik probabilitas dan semua logika atau
perhitungan lainnya, butuh berapa hari gameplay? Anggap ini semacam mode endurance ya."*

Ini bukan permintaan membangun fitur — murni ingin tahu berapa lama secara realistis
sebuah "Mode Endurance" (kumpulkan SEMUA 144 diagnosis SKDI-4A wajib minimal sekali)
akan makan waktu, kalau desainnya jujur secara epidemiologis.

### Mekanisme yang SUDAH ADA di kode (temuan penting, bukan usulan baru)

`director.ts` (`susunAntrianHarian`, baris 239-268) sudah punya **"Curriculum
Director"** — pity-timer deterministik: tiap pagi, kalau tak ada kasus 4A-belum-
pernah yang kepilih secara alami di antrean hari itu, slot TERAKHIR **dipaksa**
diganti kasus belum-pernah (utamakan 4A, fallback ke skdi level manapun kalau stok
4A belum-pernah habis) — dipilih **uniform**, bukan tertimbang prevalensi, justru
supaya pity-timer bisa melawan bias prevalensi. Ini SUDAH JALAN di produksi hari
ini untuk pool 67 kasus — bukan mekanisme hipotetis.

Kurva pasien/hari (`jumlahPasienHarian`): 2 (hari 1-2) → 3 (fase tengah) → 4
(sepertiga akhir), relatif terhadap `HARI_STASE[mode]`. `ModeStase` saat ini HANYA
`'karier'|'ujian'` (`HARI_STASE={karier:90, ujian:30}`) — sebuah Mode Endurance
genuinely butuh varian union-type BARU + `HARI_STASE` entry baru, bukan sekadar
penyesuaian angka.

Bobot Director (`bobotKasus`, baris 143-175) saat ini: belum-pernah ×3, lemah
★0-1 ×2, dikuasai ★3 ×0,5; musim hujan × kategori infeksi/pencernaan ×2, kemarau ×
respirasi/kulit ×1,5; kluster aktif ×2,5; `prevalensi` kasus sendiri (field
3-tingkat: `tinggi`×3 / `sedang`×1,5 / `rendah`×0,6); kategori-belum-tersentuh ×1,5.

**Gap kualitas data ditemukan saat verifikasi (relevan utk sub-scope C manapun):**
Buku Saku (`DexSkdi.tsx:47-49`) menghitung "dikenali" HANYA dari `state.dex[kasusId]
!== undefined` — entri dex DIBUAT untuk setiap encounter selesai, BENAR atau SALAH
(`reducer.ts:355-366`: `kuasai = diagnosisBenar && disposisiTepat` cuma memengaruhi
nilai bintang, bukan apakah entrinya eksis). Jadi hari ini seorang pemain bisa
mendiagnosis SALAH 144 kali dan Buku Saku tetap menampilkan "144/144 dikenali".

### Dua analisis yang sudah dilakukan (disajikan berdampingan, biar DeepThink menimbang sendiri)

**Analisis 1 (estimasi tangan Claude, sebelum ada simulasi):** dua skenario —
(a) realisme epidemiologis MURNI (bobot = insidensi riil): kusta/tetanus/
skistosomiasis/filariasis di dunia nyata terkonsentrasi geografis & insidensi
sangat rendah (nasional bisa ribuan/tahun utk populasi 270 juta, jauh terkonsentrasi
di provinsi tertentu) — estimasi kasar: MUSTAHIL dimainkan (puluhan tahun in-game
utk penyakit paling langka muncul sekali). (b) desain berlantai (weight prevalensi
tetap ada utk rasa, tapi cakupan dijamin via mekanisme pity yang SUDAH ADA di atas,
digeneralisasi dari "144 sekarang" ke pool 144 penuh): estimasi dua-fase kasar
(fase organik cepat ~30-40 hari menutup ~100-115 kasus, fase ekor pity-dominated
~30 hari lagi utk sisa) → **±60-80 hari** estimasi tangan (BUKAN simulasi, Fermi
approximation, meleset bisa ±20-30%).

**Analisis 2 (simulasi Monte Carlo CODEX, laporan lengkap terlampir verbatim di
bawah):** hasil tabel skenario (median hari selesai / P95):

| Sistem kemunculan | Median | P95 |
|---|---:|---:|
| Random epidemiologis berbobot murni | ±505 hari | ±827 hari |
| Bonus kasus baru, tanpa pity timer | ±347 hari | ±573 hari |
| Pity setelah 14 hari tanpa kasus baru | ±223 hari | ±261 hari |
| Pity setelah 7 hari | ±180 hari | ±206 hari |
| Pity setelah 5 hari | ±162 hari | ±181 hari |
| Pity setelah 3 hari | ±135 hari | ±148 hari |
| Guardrail produksi sekarang, praktis harian | ±88 hari | ±94 hari |

Input simulasi: distribusi prevalensi produksi (23 tinggi/28 sedang/16 rendah,
diekstrapolasi ke 144), bobot Director produksi (3/1,5/0,6), kurva pasien/hari
produksi, ±3,33 pasien/hari rata-rata, mode 180-hari → ±598 encounter poli total
(±4,15 encounter/diagnosis).

Rekomendasi desain CODEX: 3 saluran antrean (65-70% epidemiologis-murni, 20-25%
penguatan/remediasi kasus lemah-atau-salah, 10-15% discovery kasus belum-dikuasai);
pity progresif (hari 1-90: pity setelah 7 hari tanpa penemuan baru; hari 91-150:
setelah 5 hari; hari 151-180: setelah 2-3 hari atau misi kasus khusus); kasus
endemis regional TIDAK muncul acak di desa yang salah — hadir via rotasi wilayah/
wabah/rujukan/klinik keliling (**tumpang-tindih langsung dengan Q4 sub-scope B di
§4 bawah** — DeepThink sebaiknya menjawab keduanya bersamaan, bukan terpisah).
Framing "Endurance Nusantara" — 6 babak × 30 hari, tiap babak profil wilayah beda
(bahasa naratif, bukan re-lokasi lore Desa Sukamaju — sama prinsipnya dgn Q4).

Rekomendasi definisi status Dex 3-tingkat (menambal gap kualitas data di atas):
**Dijumpai** (pernah bertemu, siluet terbuka) / **Terkumpul-tersertifikasi**
(diagnosis+disposisi benar minimal sekali, ★1) / **Dikuasai** (★3 via pengulangan).
Estimasi durasi per-tingkat: jumpai-semua-144 = 120-180 hari; benar-sekali-semua-144
= 180-210 hari; ★3-semua-144 = 240-300 hari (bergantung akurasi pemain). Rekomendasi
final CODEX: **Mode Endurance 180 hari, target resmi ★1 pada seluruh 144, lanjutan
tanpa batas mengejar ★3.** ±598 encounter ≈ 30-40 jam gameplay klinik murni (di luar
UKM/IGD), asumsi 3-4 menit/encounter.

### Verifikasi Claude atas laporan CODEX (dicek langsung ke kode, bukan dinilai dari kewajaran naratif saja)

**Dikonfirmasi BENAR:**
- Gap "dikenali" (persis seperti dijelaskan di atas) — `DexSkdi.tsx:47-49` +
  `reducer.ts:355-366`, verbatim cocok.
- Bobot Director 3/1,5/0,6 — `director.ts:168`, cocok persis.
- Distribusi prevalensi 23/28/16 — ditally ulang: 23 tinggi & 16 rendah eksplisit
  cocok; 28 "sedang" = 21 eksplisit + 7 kasus tanpa tag field (default 'sedang' per
  `director.ts:167`) — akurat, malah lebih teliti dari hitung cepat manapun.
- Aritmatika 598 encounter utk kurva 180-hari (2→3→4 pasien) — dihitung ulang
  independen, hasil persis sama.
- `ModeStase` cuma `'karier'|'ujian'` — dikonfirmasi; poin tambahan Claude: mode
  ke-3 genuinely butuh perubahan union-type + audit titik yang mengasumsikan 2 mode
  saja, bukan cuma penyesuaian data pacing.

**Ditemukan SALAH:** "45 diagnosis kulit" di narasi CODEX seharusnya **35** —
di-cross-check dua metode independen (audit kategori manual dan replikasi
langsung algoritma linking `index.ts` via skrip), keduanya sepakat di angka
gap-total 98 dan kulit-murni 35 (kemungkinan CODEX salah mengelompokkan beberapa
item non-kulit — kandidiasis mulut, parotitis, cacing tambang, hepatitis A — ke
bucket kulit). Ini murni hiasan naratif, TIDAK memengaruhi tabel Monte Carlo utama.

**Catatan metodologis (paling penting untuk ditriangulasi):** baris "Random
epidemiologis berbobot murni" (±505/827 hari) memakai bobot 3-tingkat KASAR
produksi (rentang cuma 5×: tinggi:rendah = 3:0,6), diekstrapolasi rata ke 144 —
BUKAN insidensi riil per-diagnosis. Di dunia nyata, kusta/tetanus/skistosomiasis
bisa berbeda insidensi 4-5 ORDE BESAR dari common cold, bukan cuma 5×. Kalau bucket
"rendah" diisi insidensi riil (bukan 0,6× seragam), skenario "tanpa jaminan" CODEX
kemungkinan JAUH lebih ekstrem dari 505-827 hari. **Ini tidak merusak kesimpulan
CODEX — malah memperkuatnya**: kalau baseline "murni" mereka SAJA sudah 500+ hari
dengan input yang masih dijinakkan, argumen "wajib pity timer, tak bisa andalkan
probabilitas murni" makin kuat. Tapi angka 505-827 hari TIDAK boleh dikutip sebagai
"estimasi realisme epidemiologis sungguhan" — itu estimasi "realisme ala-bucket-
3-tingkat produksi".

**Kesimpulan Claude:** kedua analisis (tangan vs Monte Carlo) SEPAKAT secara arah:
mekanisme jaminan/pity yang sudah ada di kode adalah kunci yang membuat mode ini
playable sama sekali; realisme epidemiologis murni tanpa jaminan = infeasible utk
game. Angka final "180 hari" CODEX BUKAN angka yang matematis dipaksa — itu
**pilihan pacing** (demi struktur naratif 6-babak regional), dibandingkan lantai
tercepat yang sudah bisa dicapai HARI INI dgn mekanisme yang eksis tanpa perubahan
apapun (±88-94 hari per tabel CODEX sendiri, dekat dgn estimasi tangan Claude
±60-80 hari).

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

**Q6 — Mode Endurance: fitur berdiri sendiri, atau capstone yang menunggu sub-scope
A selesai?** Mode Endurance secara konsep butuh SEMUA 144 SKDI-4A eksis sebagai
kasus playable (sub-scope A, ~152 kasus baru, pasca-Golden-Master, belum
dijadwalkan). Apakah Mode Endurance HARUS menunggu sub-scope A rampung total, atau
bisa diluncurkan bertahap ("kumpulkan yang 46/144 sudah ada sekarang, sisanya
nambah seiring M13 berjalan")? Kalau bertahap, apakah itu risiko pedagogis (target
bergerak, pemain tak pernah tahu "sudah selesai belum") atau justru fitur (living
Dex, konsisten dgn filosofi "living game" proyek ini)?

**Q7 — Gap "dikenali" (Dex menghitung encounter, bukan ketepatan): tambal SEKARANG
di game 67-kasus yang ada, terlepas dari nasib Mode Endurance?** Ini bug/gap nyata
di Buku Saku HARI INI (pemain bisa salah 67x dan tetap lihat "67/67 dikenali"),
independen dari apakah Mode Endurance pernah dibangun. Apakah 3-tingkat
Dijumpai/Terkumpul-tersertifikasi/Dikuasai layak masuk M10.5 (mengingat ini
menyentuh field `dex`/`bintang` yang sudah dalam radar Ember-Merah — lihat
`M10_5_FIDELITAS.md`) sebagai perbaikan independen, ATAU ditahan sampai Mode
Endurance benar-benar diputuskan dibangun (supaya tak menambah beban Golden
Master utk fitur yang belum tentu jalan)?

**Q8 — Pity timer progresif berbasis KALENDER (hari 1-90/91-150/151-180) vs
berbasis STATE pemain?** Rekomendasi CODEX pakai jadwal kalender tetap. Mekanisme
`director.ts` yang SUDAH ADA justru berbasis state (memicu setiap hari kalau
kondisi "belum ada 4A-belum-pernah terpilih" terpenuhi, bukan menghitung hari
sejak penemuan terakhir). Mana yang lebih koheren dgn arsitektur existing: pity
berbasis state (lebih simpel, reuse pola lama, otomatis adaptif ke kecepatan main
pemain) atau berbasis kalender eksplisit (lebih mudah di-tuning manual per fase,
tapi mekanisme paralel baru di luar pola `bobotKasus` yang sudah ada)?

**Q9 — 3-saluran antrean (65-70/20-25/10-15%) CODEX vs sistem bobot tunggal
existing: refactor besar atau bisa dipetakan ke `bobotKasus` yang sudah ada tanpa
mesin baru?** `bobotKasus` sudah menggabungkan banyak faktor (Leitner-lite,
musim, kluster, prevalensi, kategori-belum-tersentuh) jadi SATU angka bobot per
kasus, bukan 3 kanal terpisah. Apakah proposal 3-saluran CODEX genuinely butuh
arsitektur baru (slot-based queue), atau bisa diekspresikan sbg penyesuaian bobot
dalam fungsi tunggal yang sudah ada (lebih murah, lebih konsisten dgn pola kode
proyek ini)?

**Q10 — Ini tumpang tindih LANGSUNG dgn Q4 sub-scope B (§4 atas): kejujuran
framing regional.** CODEX merekomendasikan kasus endemis regional muncul via
rotasi wilayah/wabah/rujukan/klinik keliling, BUKAN acak muncul di desa yang
salah — ini secara substansi SAMA dgn pertanyaan Q4 ("Rotasi Regional" pedagogis-
jujur atau menyesatkan, mengingat Desa Sukamaju adalah setting fiksi TETAP).
DeepThink diminta menjawab Q4 dan Q10 SEBAGAI SATU PERTANYAAN, bukan dua opini
terpisah yang berisiko kontradiksi.

## 5. Yang TIDAK perlu ditriangulasi ulang

- Status "M13 belum dijadwalkan, murni pencatatan scope" — ini keputusan
  user yang sudah final untuk saat ini, bukan pertanyaan terbuka.
  Golden Master sequencing sub-scope A juga sudah diputuskan (§2 akhir) —
  Q1 di atas HANYA menyoal apakah sebagian kecil sub-scope B bisa dikecualikan
  dari penundaan itu, bukan membuka ulang seluruh keputusan.
- Fakta bahwa tidak ada regresi konten (§1) — sudah diverifikasi tuntas via
  audit git-history 5-agen, bukan area yang perlu opini kedua.
