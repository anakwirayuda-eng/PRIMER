# DOSSIER TRIANGULASI MAHA-LENGKAP — Semua Pergumulan Terbuka PRIMERA

> **Untuk:** DeepThink (reviewer strategis) · **Dari:** Dr. Anak Agung Bagus Wirayuda (pengembang tunggal), via Claude (builder)
> **Tanggal:** 2026-07-11 · **Status repo:** branch `claude/vigorous-bose-f66bc6`, engine `REVISI_ENGINE=19`
> **Sifat:** dokumen SELF-CONTAINED. Mengasumsikan DeepThink tak tahu apa-apa soal proyek. Setiap pergumulan
> = satu kartu (konteks + pertanyaan spesifik + jenis keputusan + status). Ini kompilasi menyeluruh dari 4
> penyisiran paralel atas seluruh dokumen milestone + memori proyek.

---

## 0. ORIENTASI — apa itu PRIMERA & aturan mainnya

**Produk.** PRIMERA "Puskesmas Pagi": game edukasi kedokteran single-player (Electron + Vite + React +
TypeScript), simulasi dokter layanan primer di Puskesmas Indonesia. Target rilis **±September 2026** untuk
**±50 mahasiswa FK**. Dikembangkan **seorang diri** oleh Dr. Wirayuda (dokter + pengembang).

**Loop inti.** (1) **UKP/Klinik**: antrian pasien → anamnesis (persona bervariasi) → pemeriksaan fisik →
lab (hasil besok) → diagnosis (stempel TEGAK/SUSPEK) → terapi (formularium + edukasi pasien) → disposisi
(tuntas / rujuk berjenjang SISRUTE). (2) **UKM/komunitas**: kunjungan rumah (COM-B + Motivational
Interviewing), kader, Posyandu, Prolanis, surveilans → klaster → Respons KLB. (3) **Jembatan karma UKP↔UKM**
dua arah. (4) **PIS-PK** 12 indikator, IKS→KBK kapitasi. (5) **Dex SKDI-144** (Pokédex penyakit). (6) Skor
**4 dimensi**. (7) **Mode Ujian 30-hari** (satu-satunya mode yang menghasilkan skor formal untuk disetor
dosen — SUDAH DIBANGUN) + **verifier M6** (replay action-log + HMAC, verifikasi dosen offline).

**"Golden Master" (tenggat inti, akhir Agustus 2026).** Satu milestone yang: melakukan **SATU bump
`REVISI_ENGINE` final** lalu **HARD-FREEZE mesin skor** (`reducer.ts`/`clinic.ts`/`scoring.ts`) selama satu
semester — supaya 50 mahasiswa dinilai di atas mesin yang stabil & tervalidasi. **Konsekuensi kritikal:**
apa pun yang menyentuh skor/replay/save **WAJIB** mendarat SEBELUM freeze; pengayaan display-only/konten
boleh *silent-patch* setelahnya (itulah "M11a Live-Ops").

**Disiplin triangulasi.** Builder (Claude) tak mengaudit karyanya sendiri sebagai final. Dua reviewer
independen menyilang: **CODEX** (audit kode read-only) + **DeepThink** (strategi/pedagogi). **Fakta medis =
Dr. Wirayuda yang adjudikasi** — Claude/DeepThink TIDAK memutuskan fakta klinis sepihak; DeepThink boleh
memberi *second opinion* atas penalaran, tapi bukan sumber fakta baru.

**Yang SUDAH DIPUTUSKAN (jangan dibuka ulang).** M0–M10 selesai. M10.5 "Fidelitas Engine & Medis" =
milestone AKTIF. Split M11a/M10.5, satu Golden Master akhir-Agustus, **dosis obat = abstraksi tanpa-dosis
(O1) dipertahankan** (O2/O3 ditolak), 5 keputusan skoring sudah diputuskan (P1.6=O-C, P1.7=O-B, P1.9=O-B,
C.1=O-B, C.8=O-A), taksonomi edukasi Q6 = disiplin mental (bukan field baru), 21 `kontradiksiClue` (Bagian
A) disetujui penuh, Bagian B (13) diimplementasi, PPK 1186/2022 = *default ternilai* dengan deviasi
ber-justifikasi-EBM yang terdokumentasi tetap sah (pedagogi "tampilkan dua otoritas"), M14 P1 dilebur ke
M10.5 & sudah dieksekusi, #23 (persist lapisan M11.5 ke Buku Saku) sudah beres.

**Cara membaca dossier ini.** Bagian I–III = pertanyaan yang paling butuh **judgment DeepThink**. Bagian IV =
**adjudikasi medis** (ranah Dr. Wirayuda; dicantumkan agar DeepThink paham utang medisnya, boleh
second-opinion). Bagian V = **gerbang rilis wajib** (bukan pilihan, tapi urutannya bisa dinilai). Bagian VI =
**gerbang eksternal non-kode** (uang/legal/manusia). Bagian VII = housekeeping.

---

## BAGIAN I — PERGUMULAN STRATEGIS & SEQUENCING (paling butuh judgment DeepThink)

### [S1] Realisme timeline: "vibecode nonstop Juli–Agustus → kelar sampai ~M15" — betulkah?
**Konteks.** Dr. Wirayuda bertanya: kalau ia ngoding nonstop sepanjang Juli–Agustus, harusnya semua tuntas
bahkan sampai "M15", kan? (Catatan: **M15 belum ada** — scope resmi mentok M14.) Builder menilai ada **dua
"selesai" berbeda**: (a) **Golden Master** yang bisa dirilis+dinilai+integritas-aman akhir Agustus =
realistis; (b) **"kelar seluruh scope termasuk M13"** dalam Juli–Agustus = tidak realistis & memang *by
design* pasca-freeze. M13 sendiri = ~152 kasus baru ber-akurasi-medis (lift konten terbesar proyek).
**Pertanyaan.** Apakah pembagian "Golden Master Agustus + ekor live-ops sepanjang semester" itu penilaian
yang sehat? Apa scope paling agresif-namun-jujur yang bisa dijanjikan untuk deploy September tanpa
mengorbankan integritas medis/asesmen? Adakah risiko yang builder remehkan?
**Jenis:** timeline-sequencing (strategis) · **Status:** OPEN — pertanyaan pemilik proyek langsung.

### [S2] Milestone sudah "beranak-pinak" — perlu konsolidasi taksonomi?
**Konteks.** Struktur milestone terus bercabang: M10→**M10.5**, M11→**M11.5**→**M11a**, M14-P1 dilebur balik
ke M10.5, M13 punya sub-scope A & B. Risiko: peta jadi sulit dilacak & tenggat kabur.
**Pertanyaan.** Apakah taksonomi milestone sebaiknya dikonsolidasi jadi dua ember sederhana — **(1)
"Checklist Golden Master"** (semua yang harus beku sebelum akhir Agustus) + **(2) "Backlog Live-Ops
pasca-freeze"** — alih-alih deretan M-number? Dan **apa "M15" itu seharusnya** (kalau ada) — atau justru
tanda scope sudah cukup dan energinya lebih baik ke polish/playtest?
**Jenis:** meta-struktur/sequencing · **Status:** OPEN.

### [S3] Boleh mulai sepotong sub-scope B (epidemiologi regional) PARALEL dgn M10.5?
**Konteks.** M13 sub-scope A (152 kasus) tegas *pasca-freeze*. Tapi sebagian ide sub-scope B (Rotasi
Regional Mode Ujian, KLB-via-inbox) murni **penambahan data/konten ke Director** — tak menyentuh file beku
`reducer/clinic/scoring`. DeepThink §Q1 sudah dirutekan menanyakan ini.
**Pertanyaan.** Boleh/pantaskah irisan ringan sub-scope B dikerjakan lebih awal (paralel M10.5) tanpa
melanggar semangat "jangan bebani window Golden Master", atau tetap tahan bersama sub-scope A demi
kesederhanaan satu-milestone-satu-waktu?
**Jenis:** timeline-sequencing · **Status:** OPEN.

### [S4] Strategi porting repo lama: akselerator, atau liabilitas keracunan-ICD?
**Konteks.** Repo lama (`D:\Dev\PRIMER\src\`, React/Supabase, dorman sejak 2026-04-27) punya 253 kasus poli
+ ~34 IGD — menggoda untuk porting demi mengejar 152 kasus. TAPI repo itu **persis** tempat insiden P0
terdokumentasi: `master_icd_10.json` teracuni terjemahan (mis. kode jantung dilabeli "hati", henti-napas
dilabeli "napas lambat"), baru diperbaiki di commit lama `4d348d9`.
**Pertanyaan.** Apakah porting 253+34 kasus (dgn **verifikasi ulang PENUH per kasus**) benar-benar lebih
cepat/aman daripada menulis dari nol ber-grounding PPK/SKDI? Atau hybrid (porting HANYA cangkang
naratif/persona, riset ulang TOTAL fakta klinis) yang paling tepat?
**Jenis:** content-scope + fakta-medis (keselamatan pasien) · **Status:** OPEN.

### [S5] Urutan penulisan 152 kasus baru.
**Konteks.** DeepThink §Q5. Tiga strategi kandidat sudah dirumuskan.
**Pertanyaan.** Saat M13 mulai (pasca-freeze), urutan mana: (a) **frekuensi-tinggi dulu** (ROI pemain), (b)
**langka-tapi-wajib-kompetensi-4A dulu** (tutup gap kurikulum), atau (c) ikut struktur kedalaman **Tier
A/B/C** yang sudah dirancang di `KONTEN_BALANCE.md` (Tier A ±40 sering-full-depth, B ±60 standar, C ±44
langka-ringkas)?
**Jenis:** content-scope · **Status:** OPEN.

---

## BAGIAN II — PERGUMULAN DESAIN & PEDAGOGI (judgment DeepThink, tak butuh fakta medis baru)

### [D1] "Debrief Malam" old-vs-new — aturan cap anti-"tembok teks".
**Konteks.** Rencana menampilkan framing praktik-lama-vs-terkini / idealis-vs-realita di ringkasan
akhir-hari (Debrief Malam). Proyek sudah 2× "terbakar" masalah wall-of-text (dulu 38 tombol edukasi). Hari
dgn 5+ kasus bermasalah bisa membanjiri esai tiap malam.
**Pertanyaan.** Berapa kasus yang boleh di-*expand* per malam (aturan cap/kolaps — mis. 1–2 paling
signifikan, sisanya ringkas+tautan)? Dilebur ke keputusan taksonomi Q6 atau jadi pass desain UX terpisah?
**Jenis:** pedagogi/UX · **Status:** OPEN (rumah milestone = M11a Live-Ops sudah pasti; aturan cap-nya belum).

### [D2] "Audit Mutu Internal" (Axis-3 / Opsi 4) — dibangun atau tidak, & milestone mana?
**Konteks.** Ide mekanik UKM baru yang mengajarkan **siklus audit klinis/PDSA** (terkait Permenkes 19/2024
BAB V "Peningkatan Mutu") — mengajarkan *bagaimana praktik keliru ditemukan & dikoreksi* sebagai konten.
Biaya TINGGI: state/skor baru, kemungkinan butuh bump `REVISI_ENGINE`. Saat ini **tak ditugaskan ke
milestone mana pun**; M12 di-scope visual/art-only.
**Pertanyaan.** Dibangun sama sekali? Kalau ya, milestone mana yang memilikinya (M12-diperluas? M13? M15
baru?) — mengingat ia menyentuh engine sehingga TAK bisa pasca-freeze tanpa bump lagi?
**Jenis:** scope-sequencing + engine-architecture · **Status:** OPEN/DEFERRED, tak bermilestone.

### [D3] Variasi presentasi penyakit-sama (M11 butir-4) — mekanik director baru vs konten statis?
**Konteks.** Agar kasus yang berulang di stase 90-hari tak jadi hafalan, satu penyakit idealnya punya 2–3
varian presentasi (keluhan pembuka/kronologi/temuan). Pertanyaannya arsitektural: apakah ini butuh **mekanik
pemilihan-varian BARU di `director.ts`** (mengacak varian saat generate) — lift lebih besar, menyentuh
engine — atau cukup konten statis?
**Pertanyaan.** Mana yang benar, dan bila butuh mekanik director: itu menyentuh area beku → harus sebelum
Golden Master atau ditunda? (Wajib interaksi dgn seed-flavor Mode Ujian agar paket ujian tetap adil.)
**Jenis:** engine-architecture · **Status:** OPEN, belum mulai; fork arsitektur belum diputuskan.

### [D4] "Rotasi Regional" — jujur secara pedagogis, atau inkoheren naratif?
**Konteks.** Desa Sukamaju = latar fiksi satu-desa yang tetap. Ide: paket Ujian bertema regional (mis.
"Papua": bobot malaria/stunting naik) TANPA mengubah lore desa. DeepThink §Q4.
**Pertanyaan.** Apakah framing "latih beban penyakit khas region X" (seperti simulator penerbangan/militer)
itu jujur, atau berisiko terasa inkoheren ("kenapa Sukamaju tiba-tiba wabahnya seperti Papua")? Perlukah
reframing eksplisit "simulasi skenario rotasi"?
**Jenis:** etika-nada + content-scope · **Status:** OPEN.

### [D5] Sub-scope B: mekanisme mana yang dikejar, & bagaimana hindari "stat-dump"?
**Konteks.** Empat mekanisme Tier-1 diusulkan (Rotasi Regional; KLB musiman via inbox spt PIN-Polio/PSN-3M;
funnel ANC bocor K1 86,7%→K4 68,1%→K6-USG 17,6% sbg cabang arc bumil-risti; pengayaan MPASI/stunting di
Posyandu) + kasus Tier-2 (filariasis, rabies IGD VAR/SAR, HFMD). **Prasyarat data:** triage terbaru
(2026-07-11, terverifikasi vs sumber primer Kemenkes) menemukan **7 dari 9 angka epidemiologi di dokumen
riset itu keliru/basi** — mis. "140.206 pasien jantung 25-34" sebenarnya *penyebut survei* (prevalensi asli
0,15%); Kalsel hipertensi 44,1% basi (SKI 2023: 35,8%, tertinggi Kalteng 40,7%); stunting NTT 37,9%/Bali
7,2% → SSGI 2024 jadi 37,0%/**8,6%** (Bali NAIK); mpox "Clade Ib" keliru (semua sekuens Indonesia = IIb).
**Selain itu** riset UKM menemukan mekanik Posyandu PRIMERA masih memodelkan struktur "5 meja" pra-2023,
padahal reformasi **ILP** menggantinya dgn "5 langkah"/Posyandu Prima.
**Pertanyaan.** (a) Dari 4 mekanisme + 3 kasus itu, mana yang layak dikejar dan bagaimana mengubah statistik
disparitas jadi *gameplay/flavor* bukan tempelan angka? (b) Modernisasi Posyandu ke ILP "5 langkah" —
lakukan (dan ini menyentuh konten UKM cukup luas), atau pertahankan "5 meja" klasik? (Ini prasyarat: harus
diputus DULU sebelum riset konten UKM berbuah.)
**Jenis:** content-scope (desain) + fakta-medis (grounding) · **Status:** OPEN, tak ada yang di-greenlight.

### [D6] Lapisan 3-otoritas / SPM di sisi UKM — bangun (butuh telemetri baru)?
**Konteks.** Sisi UKP sudah dapat kotak ke-3 `panduanResmi`. Padanan UKM (gamifikasi "quest" berbasis SPM
PMK 6/2024) **butuh telemetri BARU** (cakupan per-indikator: % hipertensi/DM/ODGJ/TB terlayani) yang
`iksDesa`/`posyanduSesi` sekarang tak granular.
**Pertanyaan.** Sisi komunitas perlu pelapisan panduan-resmi/SPM ini? Kalau ya, kapan — mengingat butuh
telemetri baru (menyentuh engine → implikasi pra/pasca-freeze)?
**Jenis:** engine-architecture + scope-sequencing · **Status:** OPEN/DEFERRED ke "M11 lanjutan".

### [D7] O5 (edukasi → drift/kepatuhan keluarga) + kalibrasi bobot penalti.
**Konteks.** Ide "investasi dunia" ala Harvest Moon: kualitas edukasi pasien memengaruhi drift/kepatuhan
keluarga binaan. Plus kalibrasi bobot penalti edukasi. Keduanya diparkir "pasca-playtest" — dan **playtest
mahasiswa sungguhan belum pernah terjadi**.
**Pertanyaan.** Apakah tautan edukasi→drift itu sepadan (dan bagaimana bentuknya), dan bobot penalti mana
yang perlu digeser? (Data-gated pada playtest — lihat [X3]. Berbeda dari gerbang deflasi-skor sintetis [G2]
yang sudah terjadwal wajib.)
**Jenis:** pedagogi-desain + engine (O5) / kalibrasi-skor · **Status:** OPEN, ditunda pasca-playtest.

---

## BAGIAN III — PERGUMULAN ETIKA / NADA (butuh keputusan sadar; DeepThink kuat utk framing)

### [E1] Mpox — masukkan-dengan-nada-hati-hati, atau kecualikan total?
**Konteks.** Data nyata & dramatis tapi populasi berisiko sangat spesifik (96,6% laki-laki; 67,2% terkait
aktivitas seksual dalam 21 hari pra-lesi) — konten kesehatan-seksual sensitif untuk kohort mahasiswa FK
beragam. **Belum ada keputusan nada.** Ditegaskan: JANGAN diproses "seperti kasus biasa" tanpa keputusan
sadar Dr. Wirayuda.
**Pertanyaan.** Bisakah kompetensi inti (kenali lesi, gerbang isolasi, lapor KLB, prinsip pelacakan kontak)
diajarkan TANPA menonjolkan demografi transmisi-seksual secara stigmatis/eksploitatif — ATAU lebih bijak
dikecualikan total? Bila dikecualikan, alasan paling *defensible* apa (bukan sekadar "sensitif")?
**Jenis:** etika-nada · **Status:** OPEN, di-flag eksplisit, tak diputus sepihak.

### [E2] Otonomi pasien: sapu 16 arc utk pola "kebutuhan medis dasar digantung izin pasangan"?
**Konteks.** Satu titik (`desaF:995` — tablet Fe bumil digantung izin suami) sudah diperbaiki. Pertanyaannya
apakah pola serupa menyebar. Dibedakan sadar dari "KB butuh buy-in pasangan" (yang sengaja dibiarkan karena
memang realistis/tepat).
**Pertanyaan.** Selain `desaF:995`, sapu semua 16 arc keluarga untuk pola "obat/tindakan medis DASAR
digantung izin pasangan" (koreksi), atau biarkan? (Rekomendasi builder condong: hanya perbaikan tertarget,
tapi belum dikonfirmasi.)
**Jenis:** nilai/pedagogi + naratif · **Status:** OPEN (kemungkinan sudah (i)-only, tapi tak tercatat eksplisit).

---

## BAGIAN IV — ADJUDIKASI MEDIS (keputusan Dr. Wirayuda; DeepThink boleh second-opinion, BUKAN sumber fakta)

> Ini utang fakta-klinis yang harus dilewati sebelum konten/freeze. Dicantumkan agar DeepThink paham beban &
> bisa menilai *urutan/pengelompokan*, bukan memutus fakta.

### [M1] §1a — temuan keselamatan klinis P0 (prioritas TERTINGGI).
**#3 stroke:** `I63.9` di-lock tanpa imaging; Lastri (TD 208/118 + pelo) dipetakan ke *hipertensi urgensi*
bukan *suspected stroke*. **#6 algoritma akut tak lengkap:** diare Plan B, laju cairan IGD dengue,
ipratropium asma berat, steroid rutin anafilaksis. **#8 TB:** BTA-only (tanpa TCM/HIV); kontak anak tak bisa
dipilih bersama intervensi utama. **Status:** menunggu adjudikasi; mekanik remediasi #6 menumpang C.1 (sudah
diterima), tapi konten klinisnya belum.

### [M2] §1c — batch konten klinis.
#4 ANC (gol. darah, HIV/sifilis/HBsAg, folat dobel, target 90 TTD, ambang rujuk Hb 8,5, dosis MgSO4); #5
regimen tunggal DM/HT; #11 kode (Widal, GAS, K29.7); #12 "ajaran keliru" (zoster→PHN, OA/RA-vs-gout,
analgesia apendisitis, clue gout/ULT). **Status:** dijadwalkan gelombang Golden Master (Minggu-4), belum
diputus.

### [M3] PPK 1186/2022 "Bagian C" — 7 temuan genuine.
konjungtivitis-alergi (**steroid PPK vs tanpa-steroid AAO — paling signifikan**), dosis amoksisilin OMA,
dosis asam folat anemia bumil, pedikulosis kapitis, demam tifoid, ICD hemoroid (I84 WHO vs K64.0),
ICD apendisitis (K35.9 vs K35.8 PPK). **Status:** di artifact shortlist (41 item), menunggu adjudikasi
per-item.

### [M4] PNPK Kemenkes "Bagian D" — 17 temuan "berbeda" (utang medis terbesar).
7 Tier-1 kasus-spesifik: `hipertensi_esensial` (monoterapi vs PNPK 2021 **wajib kombinasi 2-obat** derajat-2),
`dm_tipe2` (HbA1c 8,9% metformin-mono vs ambang kombinasi), `mm_gagal_jantung_kongestif` (ISDN tanpa cek
interaksi PDE5), `mm_isk_bawah`, `kia_isk_kehamilan`, `jiwa_skizofrenia`, `jiwa_gangguan_cemas`; + 10 Tier-2
gap konten baru (nyeri kronik, pengenalan sepsis, batu saluran kemih, osteoporosis, dst). **Status:** SEMUA
17 tercatat, NOL diputuskan/diimplementasi; konsolidasi UI ditahan (user sempat kelelahan 2026-07-10).

### [M5] M11.5 `panduanResmi` Phase-B — 50 kasus draf (20 "divergensi").
Draf ter-grounding ke kutipan PPK per-item; menunggu Setuju/Edit/Tolak/Nanti per-kasus di artifact. Fokus:
20 divergensi PPK-vs-EBM (mis. pilot konjungtivitis). **Meta-nya sudah diputus** ("tampilkan dua otoritas";
PPK bukan plafon absolut) — yang OPEN cuma adjudikasi per-kasus. 8 kasus tanpa entri PPK tetap
tanpa-`panduanResmi` kecuali PNPK menutup.

### [M6] ICD `mm_hipertensi_urgensi` I16.0 → I10 + pilihan diagnosisBanding.
I16 (krisis hipertensi) TAK ADA di WHO ICD-10 2010 (CM-only). Fix→I10 butuh pilihan DDx pengganti (I11.9?
I15? atau pembanding non-HT) karena WHO tak punya kode urgensi. Companion: 6 kode kurang-spesifik (condong
BIARKAN), opsional T78.2→T88.6 anafilaksis-dipicu-obat (condong "pertimbangkan"). **Status:** menunggu OK
dokter + 1 pilihan DDx.

### [M7] `harusDirujuk` utk 5 kasus yang skdi-nya baru dikoreksi.
5 kasus (dermatitis kontak, rinosinusitis akut, OA lutut, gangguan cemas, depresi ringan) skdi dikoreksi ke
3A/level-2, tapi `harusDirujuk` sengaja dibiarkan — membaliknya mengubah skor/disposisi. **Pertanyaan
medis+desain:** haruskah dibalik jadi wajib-rujuk? **Status:** OPEN, sengaja tak dibundel ke fix label.

### [M8] Level SKDI `tht_rinosinusitis_akut` — 3A atau level-2?
SKDI 2012 memecah "Sinusitis" jadi 4 sub-entri (level campur 3A/2). "3A" provisional dipakai; level benar
tergantung sub-entri mana presentasi "akut" ini memetakan. **Status:** ketidakpastian residual.

### [M9] Tag tepi firewall alergi (Q1a).
`tiamfenikol_500`→amfenikol (silang-reaksi)? `mupirosin_krim` & `oat_kdt` biarkan kosong? **Status:**
KEMUNGKINAN sudah diputus (firewall diimplementasi commit 977960d) tapi docs masih tandai "keputusan dokter"
— **perlu verifikasi apakah 3 tag ini sudah final.**

---

## BAGIAN V — GERBANG RILIS WAJIB (bukan pilihan; urutannya bisa DeepThink nilai)

### [G1] Rekalibrasi Referral Guillotine SERENTAK (blind-spot DeepThink, "WAJIB").
Saat penalti memaksa eskalasi/rujuk kasus gawat (preeklampsia/stroke), batas SKDI "tuntas-mandiri vs rujuk"
harus digeser **bersamaan** — jangan sampai mahasiswa yang merujuk BENAR (per EBM terbaru) malah ditebas
penalti rujukan karena DB 4A/3B belum di-update. **Status:** wajib, Fase-2, belum dieksekusi. (Bertaut [M7].)

### [G2] Self-play deflasi skor + kalibrasi ambang A/B/C/D (gerbang rilis eksplisit).
Ambang grade hard-coded (A≥85/B≥70/C≥55/D<55). Menumpuk penalti Q1–Q4 bisa menerjunkan speedrunner A→C/D.
**Langkah WAJIB sebelum freeze:** jalankan profil adversarial sintetis, ukur pergeseran distribusi grade,
kalibrasi ambang. Ditandai "ini gerbang rilis, bukan opsional". **Status:** belum dijalankan, harus mendahului freeze.

### [G3] Fix #10 (terapi kondisional dipaksa AND) — risiko *cascade failure* tertinggi.
`clinic.ts:494` memaksa AND; DeepThink menandai ini **paling berisiko cascade failure** pada 516 test —
estimasi waktu bisa meleset. Dijadwalkan Minggu-1 dgn *timebox + rollback*. **Status:** butuh spec remediasi
+ bump REVISI; item paling rawan.

---

## BAGIAN VI — GERBANG EKSTERNAL / NON-KODE (tak bisa di-vibecode)

- **[X1] Lisensi BGM (blocker keras).** Installer sekarang masih memuat 7 track OST Square Enix (koleksi
  pribadi) — WAJIB diganti musik berlisensi sebelum distribusi. Belum ada pengganti disumberkan.
- **[X2] Sumber musik pengganti.** Kandidat CC0 sudah dikurasi (Freesound), belum diunduh/normalisasi/pasang.
- **[X3] Playtest 5–10 mahasiswa (gerbang manusia).** Membuka [D7]/O5 & rebalance skor SUSPEK/IGD. Soak +
  adversarial headless sudah; playtest manusia belum pernah.
- **[X4] Uji lab FK spek-rendah (hardware).** Perf, headroom 1200×760, skala OS besar, bundle 1,1 MB.
- **[X5] Format paket distribusi.** Build portable (`electron-builder --dir` → win-unpacked) SUDAH jalan &
  ter-deploy; yang belum: **installer NSIS + ikon** (keputusan: portable vs NSIS). Digerbang [X1].
- **[X6] Infra dosen: dashboard online (Supabase) vs dossier-JSON offline.** Jalur offline (ekspor + verifikasi
  SAH/TIDAK-SAH) SUDAH jalan & teruji. Deteksi jejak-kembar anti-joki cuma ada di opsi online. **Cukupkah
  offline utk 50 mahasiswa proctored, atau perlu dashboard online?** (butir 29 telemetri = fork sama; ROADMAP
  sendiri condong "tak perlu" krn jejak-aksi dossier sudah = telemetri per-keputusan).
- **[X7] Lintas-platform/mobile.** Sebagian mahasiswa cuma punya tablet/HP; Electron tak bisa mobile. **(a)
  Gating:** benarkah deploy September menuntut ini, atau primera-arena (bila dibuat responsif) sudah menutup
  kebutuhan sesi kelas? **(b) Arsitektur (bila ya):** PWA-di-mana-mana vs dua-build (Electron + PWA berbagi
  layer `engine/`+`content/` TS) + pass responsif ~20+ layar (kini cuma 1 `@media`).
- **[X9] Sumber aset M12 (legal, pasca-M11).** AI-gen (risiko konsistensi gaya lintas puluhan generate) vs
  asset-pack RPG-Maker/VN berlisensi (konsisten tapi terikat lisensi/gaya). Kelas kehati-hatian sama dgn BGM;
  waspada meniru gaya game berhakcipta spesifik.
- **[X10] M8 Arena — go/no-go pasca-rilis.** Arah sudah tetap (fork tipis preseden "Sistema" — sudah terbukti
  48 mahasiswa 11-Jun-2026, HAKI terdaftar; app TERPISAH, jangan sandera single-player; MMO ala RoK ditolak).
  Bangun penuh atau tetap fokus single-player?

---

## BAGIAN VII — REKONSILIASI / HOUSEKEEPING (bukan utk DeepThink)

- **Drift ROADMAP (2 item).** ROADMAP masih menulis "M14 P1-into-M10.5 belum diputuskan" & "#23 butuh
  keputusan" — padahal memori lebih baru menegaskan **keduanya sudah diputus & dieksekusi** (P1 dilebur +
  dikerjakan; #23 = persist ke Buku Saku, sudah render). **Aksi:** rapikan 2 baris ROADMAP agar tak
  menyesatkan. *(Builder akan tawarkan patch.)*
- **Memori repo-lama yang kemungkinan MOOT** (deskripsikan build web lama `.jsx`, bukan `primera-desktop`):
  PIS-PK "PR #2 open" (kemungkinan sudah disuperseksi engine desktop `kegiatan.ts`), overhaul audio Howler
  3-channel + device-playtest iOS/Android (milik visi PWA lama), CloudSaveService server-authoritative
  (sudah dijawab offline-first M6). **Aksi:** verifikasi status sebelum diperlakukan sbg gerbang hidup.
- **Koreksi lintas-verifikasi:** Mode Ujian 30-hari **SUDAH dibangun** (bukan "belum") — jangan dijadikan
  gerbang terbuka.
- **Utang teknis sengaja ditunda (bukan pergumulan):** label pembicara Kunjungan selalu nama kepala keluarga
  (Bu Asih berlabel "Pak Jumadi"); kutip `respons`/`responsBohong` (#21, 129/50/15 dari 270); grinding trust
  kunjungan-ulang; peta desa tak ikut mode-malam (#21b); #20c banner pasca-ROSC IGD. Semua diketahui &
  dideferred.

---

## RINGKASAN — di mana DeepThink paling bernilai

1. **Kapstone strategis [S1]+[S2]:** sehatkah rencana "Golden Master Agustus + live-ops semester", dan perlukah
   taksonomi milestone dikonsolidasi (+ apa "M15")?
2. **Judgment tertajam:** porting repo-lama [S4], kejujuran Rotasi Regional [D4], nada Mpox [E1], mekanik
   variasi-presentasi [D3].
3. **Urutan gerbang wajib pra-freeze:** [G1]/[G2]/[G3] — apa risiko urutan yang builder remehkan?
4. **Beban adjudikasi medis [M1–M9]:** DeepThink boleh menilai *pengelompokan/urutan* ronde adjudikasi (mana
   yang keselamatan-P0 vs kosmetik), bukan memutus faktanya.

*Fakta medis tetap ranah Dr. Wirayuda. Gerbang eksternal (Bagian VI) tak terpecahkan oleh koding — masuk
sini agar tergambar utuh berapa banyak "selesai" yang bukan soal kecepatan ngoding.*
