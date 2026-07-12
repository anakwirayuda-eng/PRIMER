# M10.5 — "Fidelitas Engine & Medis" (milestone koreksi, ber-REVISI)

> **Dibuat 2026-07-10** setelah adjudikasi DeepThink (`DEEPTHINK_TRIANGULASI_M11.md`)
> yang diterima PENUH oleh Dr. Wirayuda. Dokumen ini adalah SUMBER TUNGGAL rencana
> M10.5. Status tiap item ditandai; keputusan medis menunggu adjudikasi.

## 0. Definisi milestone (keputusan DeepThink Q3/Q4, diterima)

Pemisahan formal dua jalur kerja pasca-audit:

- **M10.5 "Fidelitas Engine & Medis"** — SEMUA perbaikan yang mengubah semantik
  skor/replay (butuh `REVISI_ENGINE` bump) ATAU mengoreksi kebenaran medis/
  keselamatan. Target: **Golden Master tunggal akhir Agustus 2026** → SATU bump
  `REVISI_ENGINE` pamungkas → **hard-freeze** mesin skor (`reducer.ts`, `clinic.ts`,
  `scoring.ts`) begitu semester (±September) mulai. Alasan: aturan asesmen harus
  stabil; bump di tengah stase mahasiswa membuat Dossier ber-HMAC mereka gagal
  diverifikasi dosen.
- **M11a "Pengayaan Live-Ops"** — display murni (mutiaraEbm/catatanRealita/clue,
  variasi naratif non-skor). TIDAK ber-REVISI, langsung menjangkau save lama.
  Boleh dirilis **kapan pun, termasuk pasca-September** sebagai silent patch —
  ini "katup pelepas tekanan" tenggat (DeepThink §4, "jangan diubah").

**Prinsip pembatas (bias-check DeepThink, diterima):** tolak scope-creep. Dosis
obat (Q1 O2/O3) DITOLAK utk siklus ini — pertahankan abstraksi tanpa-dosis (O1),
dokumentasikan sbg batasan simulasi disengaja di onboarding. Fokus Agustus 100%
pada logika skor deterministik + keselamatan pasien virtual.

## 1. Inventaris item M10.5 (dari 14 temuan CODEX terverifikasi)

Sumber: `DEEPTHINK_TRIANGULASI_M11.md` §2b (14 temuan, semua terverifikasi benar).
Kategori remediasi menentukan jalur.

### 1a. Jalur cepat P0 — keselamatan klinis (DeepThink Q2: blokir kosmetik)
Temuan yang membuat game AKTIF mengajarkan refleks berbahaya — prioritas TERTINGGI:
- **#2** — storyline Asih: karma preeklampsia "selesai" via keberhasilan komunikasi
  tanpa aksi klinis (`reducer.ts:729`). *(desain-engine + naratif)*
- **#3** — stroke: `I63.9` di-lock tanpa imaging; Lastri (TD 208/118+pelo) dipetakan
  ke hipertensi urgensi, bukan suspected stroke/kegawatan. *(keputusan-medis)*
- **#6** — algoritma akut tak lengkap: diare Plan B, IGD dengue laju cairan,
  asma berat ipratropium, anafilaksis steroid rutin. *(keputusan-medis)*
- **#8** — TB: BTA-only (tanpa TCM/HIV); kontak anak Santoso tak bisa dipilih
  bersama intervensi utama. *(keputusan-medis + struktur data)*

### 1b. Desain-engine (butuh REVISI bump)
- **#1** — firewall alergi parsial → lihat §2 (Q1a, quick-win, aman). Bagian dosis
  DITOLAK (O1).
- **#7** — Prolanis: GDS<200 tunggal "terkontrol", DBP=0,62×SBP, rujukan bisa
  terblokir walau drift gawat (`kegiatan.ts:135`).
- **#10** — ✅ SELESAI 2026-07-11 (turun kasta dari "operasi engine" ke sapuan
  konten): mekanisme AND di `clinic.ts:494` terverifikasi disengaja/by-design
  (`types.ts:107-109`), bukan bug. Audit G3 menyisir seluruh kasus multi-obat —
  2 kandidat baru dipindah ke `obatOpsional` (common cold/ambroxol, dispepsia/
  antasida), 1 kandidat (CHF/ISDN) GUGUR (data vital kasus itu sendiri
  memenuhi syarat kondisional). Angka "516 test" basi — 647/652 hijau,
  premis *cascade failure* tak terjadi.
- **#14** — konsekuensi tak ikuti kegagalan edukasi; konsekuensi hari-0 telat proses.

### 1c. Keputusan-medis (adjudikasi Dr. Wirayuda, lalu konten)
- **#4** ANC (gol.darah, HIV/sifilis/HBsAg, folat dobel, target 90 TTD, Hb 8,5 rujuk,
  MgSO4 dosis) · **#5** DM/HT regimen tunggal · **#9** otonomi naratif → §4 (Q7) ·
  **#11** kode/pemeriksaan (Widal, GAS, K29.7, ICD → audit terpisah Q8) · **#12**
  ajaran keliru (zoster PHN, OA/RA gout, apendisitis analgesia, clue gout ULT).

### 1d. Mekanis-aman (boleh segera)
- **#13** — distraktor `kasusInfeksi.ts` tak bertanda `distraktor:true`; fallback
  usia <15 bikin wali ucap jawaban dewasa. *(non-medis, aman)*

## 2. Q1a — Pelengkapan firewall alergi (QUICK-WIN, disetujui utk mulai)

**Fakta terverifikasi:** 13/97 obat & 8/19 antibiotik bertag `golonganAlergi`.
Mekanisme firewall (`clinic.ts:292`) sudah ada — hanya DATA tag yang kurang.
`golonganAlergi` DIHASH ke `sidikJariPack` → menambah tag mengubah sidik jari
(dossier lama → "tidak dapat diverifikasi") TAPI **tak perlu `REVISI_ENGINE` bump**
(ini konten, bukan semantik skor).

**Keamanan terbukti:** `alergiTrap` yang DIPAKAI kasus saat ini hanya kelas
`nsaid`/`penisilin`/`statin`/`sulfa` (6 kasus). Menambah tag kelas BARU
(aminoglikosida/tetrasiklin/kuinolon/amfenikol/nitrofuran/nitroimidazol) TAK bisa
memblokir obat benar di kasus mana pun sekarang — tak ada pasien yang membawa
alergi kelas itu. Jadi §2 murni "mengarmir" firewall utk trap masa depan +
kebenaran; nol perubahan skor. (Dikawal test firewall.)

**Tabel usulan (11 antibiotik tak-bertag → golonganAlergi):**

| Obat | Kelas farmakologi | Usulan `golonganAlergi` | Catatan |
|---|---|---|---|
| `ciprofloxacin_500` | fluorokuinolon | `kuinolon` | jelas |
| `doksisiklin_100` | tetrasiklin | `tetrasiklin` | jelas |
| `gentamisin_tetes_mata` | aminoglikosida | `aminoglikosida` | jelas |
| `gentamisin_krim` | aminoglikosida | `aminoglikosida` | jelas |
| `nitrofurantoin_100` | nitrofuran | `nitrofuran` | jelas |
| `metronidazol_500` | nitroimidazol | `nitroimidazol` | jelas |
| `kloramfenikol_250` | amfenikol | `amfenikol` | jelas |
| `kloramfenikol_tetes_mata` | amfenikol | `amfenikol` | jelas |
| `tiamfenikol_500` | amfenikol (analog kloramfenikol) | `amfenikol` | ✅ SUDAH DITERAPKAN (dikonfirmasi 2026-07-11, `katalogM3.ts`) |
| `mupirosin_krim` | antibiotik topikal (mupirosin) | ✅ dibiarkan kosong | ✅ SUDAH DITERAPKAN (dikonfirmasi 2026-07-11) |
| `oat_kdt` | kombinasi INH+RIF+PZA+EMB | ✅ dibiarkan kosong | ✅ SUDAH DITERAPKAN (dikonfirmasi 2026-07-11) |

**Non-antibiotik: SUDAH lengkap.** nsaid (3 obat), statin (1), sulfa (1), makrolida,
penisilin, sefalosporin sudah tertag. `furosemid_40` (loop, turunan sulfonamida)
SENGAJA tak ditag `sulfa` — silang-reaksi sulfonamida-antibiotik vs -non-antibiotik
sudah terbantah lemah (menandainya justru mengajarkan mitos). `ramipril` (ACE-i)
angioedema = efek kelas, bukan alergi IgE — biarkan.

**Follow-on OPSIONAL (bukan bagian quick-win, masuk konten M10.5):** menambah
`alergiTrap` BARU ke kasus relevan agar kelas yang baru diarmir benar-benar
"menggigit" (mis. pasien ISK alergi kuinolon → ciprofloxacin jadi trap). Ini
mengubah playability per-kasus → keputusan desain per-kasus, bukan quick-win.

## 3. Lima keputusan skoring (P1.6/P1.7/P1.9/C.1/C.8) — dipindah dari M10 Batch-3

Semua adalah pilihan DESAIN pedagogis (bukan bug). DeepThink Q5: tuntaskan
keputusannya SEBELUM Agustus agar Agustus jadi bulan IMPLEMENTASI, bukan diskusi.
Setiap item: fakta kode (terverifikasi dossier §51) + opsi + trade-off.

### P1.6 — Mode Ujian menilai PROSES klinis, atau hanya hasil-akhir?
**Fakta:** `hitungSkor` (scoring.ts) dimensi UKP didominasi diagnosis/disposisi/tally;
sub-skor per-encounter (anamnesis/PF/terapi/edukasi/grade) TIDAK dibaca ke grade
akhir. `rmLengkap`→akreditasi baru menggigit D60, padahal Ujian tamat D30. → di
Mode Ujian, mahasiswa bisa lewati proses klinis & tetap UKP tinggi.
- **O-A (biarkan):** outcome-only disengaja (ujian = bisa diagnosis+disposisi benar).
- **O-B (bobotkan proses):** rata-rata grade encounter masuk komponen UKP. Lebih
  valid sbg OSCE-proxy, TAPI ubah formula inti → REVISI + re-baseline test + mungkin
  re-balance karier. **Kondisi ganti:** hanya bila kita yakin "proses tak dinilai"
  adalah cacat, bukan desain.
- **O-C (rmLengkap gigit lebih awal di Ujian):** turunkan ambang hari akreditasi
  utk Mode Ujian (D30) → proses klinis (via rmLengkap) berpengaruh. Lebih ringan
  drpd O-B.
- *Rekomendasi condong:* **O-B atau O-C** — outcome-only pada asesmen dokter
  mengajarkan "yang penting tebakan akhir benar" (hidden curriculum). Butuh keputusan.

### P1.7 / C.7 — Tes konfirmasi MENGUNCI skor diagnosis bila dilewati?
**Fakta:** malaria (RDT/mikroskop), TB (BTA), DM (GDP/HbA1c) bisa dapat grade baik
TANPA tes konfirmasi yang `clue`-nya sendiri wajibkan ("KONFIRMASI sebelum terapi").
- **O-A (biarkan):** tes opsional.
- **O-B (gate):** field baru per-kasus `konfirmasiWajib?: labId`; melewatinya cap
  skor diagnosis/grade — **meniru pola `vitalDiukur`/`edukasiKritis` yang SUDAH ada**
  (bukan mekanik baru). REVISI bump. Konten: tag ~5-10 kasus.
- *Rekomendasi condong:* **O-B** — sangat sejalan pedagogi ("jangan terapi buta") &
  reuse pola tervalidasi. Butuh keputusan + daftar kasus wajib-konfirmasi.

### P1.9 — edukasiKritis terlewat JUGA gagalkan `rmLengkap`?
**Fakta:** topik edukasi kritis terlewat kini hanya cap `skorEdukasi`→50; `rmLengkap`
terima ≥50 & gerbang konsekuensi abaikan edukasi.
- **O-A (biarkan):** cap skor cukup.
- **O-B (kopel ke rmLengkap):** edukasiKritis terlewat → rekam medis TAK lengkap
  (dan/atau picu konsekuensi). Konsisten dgn "edukasi kritis = non-negotiable".
  REVISI bump (ubah syarat rmLengkap).
- *Rekomendasi condong:* **O-B ringan** — bila sudah setuju edukasi kritis
  non-negotiable, inkonsisten bila tak memengaruhi "lengkap". Butuh keputusan.

### C.1 — Stabilisasi tangan-pertama jadi mekanik BERNILAI?
**Fakta:** clue pneumonia berat/PPOK/CHF sebut oksigen/infus pra-rujuk, tapi tak ada
aksi "oksigen"; `pasang_infus` baru dipakai apendisitis (§49). CODEX #6 (anafilaksis/
asma/dengue) & Q2 keselamatan menyentuh area sama.
- **O-A (biarkan):** stabilisasi naratif saja.
- **O-B (mekanik):** tambah `tindakan` oksigen + jadikan stabilisasi pra-rujuk
  langkah ternilai/wajib utk kasus gawat tertentu. Konten + mungkin tipe aksi baru +
  REVISI. Tumpang-tindih dgn perbaikan Q2/#6 → **kerjakan bersama**.
- *Rekomendasi condong:* **O-B, digabung ke jalur P0 keselamatan (§1a)** — basis
  medis "kasus mana butuh stabilisasi apa" sebagian sudah ada dari riset Batch-3.

### C.8 — Mekanik keselamatan skrining-alergi tambahan
**Fakta:** baru sebatas judul temuan; rincian penuh belum ada. Terkait erat §2 (Q1a
firewall). Perlu didefinisikan: apa persisnya "skrining alergi" yang dinilai —
mis. mewajibkan pemain BERTANYA riwayat alergi (anamnesis) sebelum meresepkan, dan
menghukum resep tanpa cek alergi?
- **Aksi:** definisikan dulu ruang lingkupnya bersama Q1a sebelum jadi opsi konkret.
- *Rekomendasi condong:* tundukkan ke bawah Q1a — firewall (mencegah resep alergi)
  + kemungkinan gerbang "sudahkah tanya alergi" sbg satu paket keselamatan.

## 3a. Perluasan Q7 (Referral Guillotine) — "rujukan terjustifikasi" (DeepThink, 2026-07-10)

**Sumber baru terverifikasi:** Kepmenkes 1186/2022 halaman 13 (dibaca langsung, bukan
dipercaya mentah) memuat kriteria rujukan **TACC** (Time-Age-Complication-Comorbidity)
+ poin (e): *"kondisi fasilitas pelayanan juga dapat menjadi dasar bagi dokter untuk
melakukan rujukan demi menjamin keberlangsungan penatalaksanaan dengan persetujuan
pasien."* Ini prinsip UMUM (bab pendahuluan, berlaku semua penyakit), bukan properti
satu kasus.

**Fakta kode terverifikasi:** guillotine saat ini murni boolean statis —
`rujukanNonSpesialistik = disposisi==='rujuk' && !kasus.harusDirujuk` — nol
pengecualian. DeepThink usul "tag kasus 4A tertentu di database"; **koreksi**: krn
prinsipnya umum (bukan per-penyakit), implementasi setia ke dokumen bukan tag statis,
tapi **mekanisme "rujukan terjustifikasi"**: pemain mendeklarasikan alasan (komplikasi/
komorbid/keterbatasan fasilitas) saat merujuk kasus 4A, tercatat (sesuai Diktum
KEENAM/KETUJUH — "harus tercantum dalam rekam medis"), dan itu yang membebaskan dari
guillotine — bukan flag hardcode developer per-kasus. **Digabung ke Q7, bukan hack
terpisah.** Butuh: field/aksi baru "justifikasi rujukan" + skor tak menghukum bila
terjustifikasi & alasannya konsisten dgn kondisi kasus (komplikasi/komorbid nyata ada
di skenario). REVISI bump (ubah gerbang skor).

## 3b. Koreksi medikolegal — PPK Kemenkes BUKAN "hukum mutlak" anti-EBM

DeepThink sempat mengusulkan menjawab protes mahasiswa dgn "PPK = hukum, EBM tak
berlaku." **Ini keliru & bertentangan dgn dokumen yang sama.** Diktum KEENAM & KETUJUH
KMK 1186/2022 (dibaca langsung): *"Modifikasi terhadap pelaksanaan PPK Dokter dapat
dilakukan... berdasarkan keadaan tertentu... meliputi keadaan khusus pasien,
kedaruratan, keterbatasan sumber daya, dan **perkembangan ilmu kedokteran dan
teknologi berbasis bukti (evidence based)**."* Kemenkes sendiri MENGIZINKAN deviasi
ber-EBM, asal beralasan & terdokumentasi.

**Framing yang benar utk skor & tutorial Hari-1:** PPK = baku DEFAULT; deviasi
EBM-justified + terdokumentasi = SAH (bukan "PPK selalu menang"). Ini juga
memperbaiki mitigasi disonansi-kognitif (M11a): bukan "catatan realita murni bekal
mental, bukan kunci jawaban", tapi *"skor dinilai berdasar PPK sbg baku; menyimpang
boleh BILA beralasan klinis kuat & terdokumentasi — realita lapangan salah satu alasan
sah, bukan alasan otomatis untuk berbeda dari PPK."*

## 3c. Penempatan 3-lapis (EBM Terkini / Panduan Resmi Kemenkes / Realita Lapangan)

**Keputusan:** UKP (per-kasus klinik) → tambahkan kotak ke-3 "📜 Panduan Resmi
Kemenkes" ke `PanelHasil` (debrief per-encounter) yang SUDAH punya 2 kotak
(`mutiaraEbm`/`catatanRealita`) — bukan Debrief Malam terpisah. Alasan: `PanelHasil`
sudah per-pasien satu-satu (tak pernah ditumpuk), jadi menambah 1 kotak ke kartu yang
sudah ada adalah jalur termurah & paling konsisten dgn arsitektur, bukan membangun
mekanisme baru. UKM (populasi, PMK 6/2024 SPM) → kandidat gamifikasi "quest" terpisah
di Kegiatan/Lokakarya Mini — **butuh telemetri BARU** (cakupan per-indikator: %
hipertensi/DM/ODGJ/TB terlayani), krn `iksDesa`/`posyanduSesi` yang ada sekarang tak
granular per-indikator SPM. Masuk M11 lanjutan, bukan quick-win.

Field baru M11a: `panduanResmi?: string` (paralel dgn `mutiaraEbm`/`catatanRealita`,
sama-sama TAK di-hash/TAK pengaruhi skor, sitasi eksplisit "KMK 1186/2022").

## 3d. Cross-check menyeluruh PPK 1186/2022 — SELESAI 2026-07-10, 7 temuan genuine

Workflow `ppk1186-crosscheck`: ekstrak 1379 halaman PDF (PyMuPDF, 1.83 juta karakter),
parse 167 entri penyakit, fuzzy-match 59/67 kasus PRIMERA ke entri PPK, 8 agen
cross-check tiap kasus vs rentang halaman PPK yang cocok. Hasil mentah: 72 diproses,
59 cocok entri, verdict ICD 47 cocok/14 tak-cocok/11 n-a, verdict tatalaksana 35
cocok/17 beda/7 primera-lebih-luas/13 n-a.

**Bug metodologi tertangkap sendiri sebelum dilaporkan**: 3 temuan paling mengkhawatirkan
("obatBenar kosong/hilang" pada demam_tifoid, kulit_tinea_korporis, kulit_urtikaria_akut)
ternyata SEMUA false positive — payload cross-check yang saya susun sendiri hanya
menyertakan field `obatBenar`, tak menyertakan `obatAlternatif`/`obatOpsional` tempat
obat-obat itu sebenarnya berada (sudah diverifikasi langsung ke kode sumber: benar,
tidak ada bug). **Pelajaran utk dump data tatalaksana PRIMERA di masa depan: selalu
sertakan ketiga field kebutuhan-obat, jangan cuma obatBenar.**

Setelah menyaring false-positive & kasus PRIMERA-lebih-spesifik-dari-kode-umum-PPK
(bukan masalah), tersisa **7 temuan genuine**: mata_konjungtivitis_alergi (steroid
vs tanpa-steroid — benturan PPK vs EBM internasional AAO, paling signifikan),
otitis_media_akut (dosis amoksisilin standar-PPK vs tinggi-AAP), anemia_defisiensi_bumil
(dosis asam folat), kulit_pedikulosis_kapitis (durasi aplikasi + strategi kontak
serumah), demam_tifoid (wording hierarki lini-1/lini-2 di clue), hemoroid_grade1
(ICD I84 WHO vs K64.0 CM-style), apendisitis_akut (ICD K35.9 vs K35.8 PPK).

Ketujuhnya digabung sbg "Bagian C" ke artifact shortlist konsolidasi yang sudah ada
(34→41 item): `https://claude.ai/code/artifact/9c7df187-9996-4f0d-9097-2756f97a6a5f`
(+ `docs/M11_SHORTLIST_41.pdf`). Data ekstraksi PPK (fulltext/entries/page-boundaries/
match) disimpan permanen di `docs/references/ppk1186/` — PDF sumber sendiri TIDAK
disimpan di repo (hanya upload user), perlu diunggah ulang bila ekstraksi ulang
diperlukan. AWAITING keputusan Dr. Wirayuda per item (via artifact shortlist).

## 3e. PNPK Kemenkes (31 dokumen, di luar PPK 1186) — 17 temuan "Bagian D" (2026-07-11)

Cross-check terpisah (workflow `pnpk-crosscheck`, `docs/references/pnpk/
crosscheck_berbeda.json`) menghasilkan **7 temuan Tier-1** (divergensi konkret pada
kasus yang SUDAH ada: `hipertensi_esensial` monoterapi vs wajib-kombinasi Derajat-2,
`dm_tipe2` HbA1c 8,9% masih monoterapi, `mm_isk_bawah` kotrimoksazol vs lini-kuat
nitrofurantoin/fosfomisin, `kia_isk_kehamilan` durasi 7hr vs PNPK 3hr, `jiwa_
skizofrenia` inisiasi antipsikotik FKTP vs mandat PNPK-2025 di FPKTL, `jiwa_
gangguan_cemas` fluoksetin vs tabel lini-pertama PNPK, `mm_gagal_jantung_kongestif`
×2 — interaksi ISDN+PDE5-inhibitor tak termodelkan + nuansa silent-MI) + **10
temuan Tier-2** (celah cakupan tanpa kasus sama sekali: nyeri-kronik/opioid,
sepsis dewasa+anak, trauma, komunikasi-rujukan, angina/CCB-nonDHP, batu-saluran-
kemih, perdarahan-GI-aktif, osteoporosis).

**Digabung sbg "Bagian D"** ke artifact adjudikasi baru (pola sama persis dgn
Bagian A/B/C — kartu per-temuan + radio Setuju/Perlu-Edit/Tolak/Nanti tersimpan
localStorage + tombol ekspor ringkasan):
`https://claude.ai/code/artifact/48d8547b-f117-4287-ab75-e9af0a05929c`.
Tier-1 = keputusan protokol klinis nyata (mengedit kunci-jawaban ternilai) — TIDAK
diterapkan sepihak, menunggu adjudikasi Dr. Wirayuda per-item sama seperti Bagian
C. Tier-2 = bukan bug, murni referensi cakupan kandidat M13 (tak mendesak Golden
Master). AWAITING keputusan Dr. Wirayuda.

## 4. Q7 — Otonomi naratif (temuan #9): temuan lebih halus dari dugaan

**Hasil baca kode (bukan asumsi):** kedua arc yang ditandai CODEX ternyata
**depiksi SENGAJA & tertulis baik** tentang hambatan NYATA (dominasi keputusan
suami pada KB pedesaan) — game MEM-PROBLEM-KAN-nya, bukan mengesahkannya. Bu Painah/
Bu Dewi diposisikan sbg pasien yang otonominya DIHALANGI; tugas pemain memulihkan
agensinya lewat MI. `penutupBerhasil` Dewi (`desaB:1530`) berakhir pada rencana KB
Dewi "bertinta biru" & suami berterima kasih "nggak dipaksa" — agensi pasien utuh.
- **Titik yang GENUINELY bermasalah (paling tajam): `desaF:995`** — "Tablet tambah
  darah Bu Painah diresepkan ulang **LEWAT persetujuan Pak Karsa**." Ini membundel
  pengobatan anemia (kebutuhan medis dasar milik Painah sendiri) dgn negosiasi KB →
  menyiratkan obat Fe-nya butuh izin suami. KB berdua wajar; Fe pribadi tidak.
- **Sisanya (`desaB:1523`, `desaC:319`, framing "izin suami" sbg hambatan):**
  arguably TAK perlu diubah — itu depiksi realistis hambatan, bukan endorsement.
  Mengubahnya berisiko menghapus skenario pedagogis yang valid (belajar navigasi
  dinamika pasangan di KB adalah skill FKTP nyata).

**Keputusan yang diminta (Q7 versi terkoreksi):**
- (i) Perbaiki HANYA `desaF:995` (pisahkan Fe dari izin suami) — konservatif,
  targeted. *(rekomendasi condong)*
- (ii) + sapuan ringan 16 arc utk pola "obat/tindakan medis dasar digantung izin
  pasangan" (beda dari "KB butuh buy-in pasangan" yang dibiarkan).
- (iii) Biarkan semua — nilai depiksi realistis > risiko salah-baca. (Tak
  direkomендasikan utk `desaF:995` yang memang lintas-batas.)

Perubahan ini murni naratif (tak skor, tak hash) → sebenarnya M11a-class, TAPI krn
menyangkut kebenaran nilai/etik lebih baik diputuskan bersama gelombang M10.5.

## 5. Urutan menuju Golden Master (DeepThink §2, diterima)

1. **Fase 1 — Triage & data cepat (minggu ini):** Q1a firewall (§2, setelah dokter
   sahkan tabel) · Q7 `desaF:995` (§4) · audit ICD-10 67 kasus (Q8, workflow jalan) ·
   #13 distraktor (mekanis-aman). Filter temuan pakai taksonomi Q6 (idealis/usang/
   realita) sbg disiplin mental, bukan field baru.
2. **Fase 2 — M10.5 "Operasi Mesin Inti" (Agustus):** P0 keselamatan (§1a) · 4
   temuan desain-engine (#7/#10/#14 + firewall) · 5 keputusan skoring (§3, keputusan
   HARUS sudah rampung) · keputusan medis (§1c). Pertahankan O1 (tanpa dosis).
3. **Fase 3 — Golden Master (akhir Agustus):** satukan semua, 647+ test hijau
   (angka "516" di draf awal basi — 647 terverifikasi 2026-07-11), **SATU
   `REVISI_ENGINE` bump final**, hard-freeze `reducer.ts`/`clinic.ts`/`scoring.ts`.
4. **Fase 4 — M11a Live-Ops (Sept dst):** 118 mutiara pengayaan, Debrief Malam
   old-vs-new (Q6b), polish visual/M12, variasi cerita — silent patch, TAK sentuh
   `REVISI_ENGINE`.

**Blind spot DeepThink (WAJIB diingat):** saat Q2 memaksa eskalasi/rujuk kasus gawat
(preeklampsia/stroke), **kalibrasi ulang Referral Guillotine SERENTAK** — jangan
sampai mahasiswa yang merujuk BENAR (per EBM terbaru) justru ditebas penalti rujukan
krn DB SKDI 4A/3B belum di-update. Batas "tuntas-mandiri vs rujuk" harus digeser
bersamaan di Fase 2.

## 5b. Router Ember pra/pasca-freeze — per-FIELD, diverifikasi 2026-07-11

Triase jawaban DeepThink (memo strategis 2026-07-11) menemukan klaimnya "semua
koreksi PPK/PNPK aman pasca-freeze" **REFUTED** oleh kode nyata (workflow adversarial
baca `clinic.ts`/`verifikasi.ts`/`kegiatan.ts`) — detail penuh di memori
`project_primer_freeze_bucket_router.md`. Aturan yang benar, per-FIELD bukan
per-"ini kan teks":

**Ember Merah (WAJIB tuntas SEBELUM freeze — field ini ternilai + ter-hash
`sidikJariPack`):** `tatalaksana.*` (obatBenar/obatAlternatif/obatOpsional/
obatSalahUmum/prosedur/edukasi/edukasiKritis) · `icd10` · `harusDirujuk` ·
`alergiTrap` · `skdi` (bukan lewat scorer per-encounter, tapi menyetir `bobotKasus`
seleksi antrian director + tetap ter-hash) · menambah kasus BARU (menggeser draw
RNG Director untuk seed yang sama).

**Ember Hijau (aman pasca-freeze, silent-patch semester berjalan):**
`panduanResmi`/`catatanRealita`/`mutiaraEbm` (murni display, absen dari hash) ·
teks `clue` (naratif debrief saja, tak dibaca skor) · nama/kategori/sinonim
katalog edukasi.

**Kasus tepi:** `diagnosisBanding` tak ter-hash & bukan kunci mekanis (skor = match
icd10), replay-safe secara teknis — tapi mengubah set distraktor menggeser
kesulitan lintas-kohort → perlakukan Ember Merah bila materiil.

**Dampak konkret ke backlog adjudikasi §1c/PPK-C/PNPK-D:** temuan mana pun yang
menulis ulang obat lini-1/ICD-ternilai/keputusan-rujuk (mis. HT monoterapi→kombinasi
2-obat, DM2 metformin→kombinasi, dosis/pilihan OMA) **WAJIB Ember Merah** — TIDAK
aman ditunda ke September seperti sempat diusulkan. Hanya temuan yang murni menambah
`panduanResmi`/`catatanRealita` boleh Ember Hijau. Alasannya dua: (1) kunci-jawaban
bergeser tengah-semester → mahasiswa main minggu-2 vs minggu-8 dinilai beda kunci;
(2) `sidikJariPack` berubah → dossier/save lama jatuh "tidak dapat diverifikasi".

**Posyandu-ILP (nuansa serupa):** dek `kartuPosyandu()` hidup di `kegiatan.ts`
(BUKAN salah satu dari 3 file beku, TAK ada di `scoring.ts`). Relabel murni
"Meja"→"Langkah" (id kartu/pilihan/flag-benar tetap) = replay identik = Ember
Hijau, aman ditunda. Mengubah id kartu/jumlah kartu (4→5)/jawaban-benar = skor
replay bergeser = Ember Merah + bump `REVISI_ENGINE` manual (dek ini di luar
`sidikJariPack`, precedent kartuKlb §49). Jadi ini keputusan SCOPE, bukan
keharusan struktural "sekarang".

**Status checklist per 2026-07-11** (dari dossier triangulasi lengkap,
`DEEPTHINK_TRIANGULASI_LENGKAP_2026-07-11.md`):

- ✅ **SELESAI & terverifikasi 2026-07-11** (647/647 test hijau, tsc bersih):
  [M6] ICD `mm_hipertensi_urgensi` I16.0→I13.9 (kode CM-only diganti WHO real,
  diagnosisBanding+kamus ICD ikut diperbarui) · [M9] firewall alergi dikonfirmasi
  sudah diterapkan (tiamfenikol/mupirosin/oat_kdt, tak ada yg tertunda) · [M8]
  level SKDI `tht_rinosinusitis_akut` dikonfirmasi 3A (teks SKDI 2012 Lampiran-3
  dibaca langsung, ambiguitas lama ditutup) · [M1]#3 kontradiksi karma Lastri
  (stroke vs hipertensi-urgensi) — di-reroute ke `stroke_iskemik`, demografi
  usiaMax 68→78 disesuaikan · [M1]#6a diare Plan-B (clue+mutiaraEbm) · [M1]#6b
  dengue cairan kompensata vs dekompensata (clue+opsi d1/d2) · [M1]#6d
  anafilaksis DIKONFIRMASI sudah benar (epinefrin lini-1, steroid adjuvant
  eksplisit — tanpa perubahan) · [G3] 2 dari 3 kandidat obatBenar→obatOpsional
  (common cold/ambroxol, dispepsia/antasida; CHF/ISDN GUGUR — tetap obatBenar,
  data vital kasus itu sendiri memenuhi syarat) · [M1]#8 TB TCM/HIV (keputusan
  Dr. Wirayuda: "teks dulu, mekanik nanti" — clue+mutiaraEbm sebut TCM sbg
  baku-emas, katalog lab tak disentuh) · **[M1]#6c asma-ipratropium** (keputusan
  Dr. Wirayuda: "sesuai konteks FKTP + PPK terbaru" — dicek langsung ke PPK
  1186/2022: NOL mention ipratropium, kriteria rujuk eksplisit "serangan
  sedang-berat", bundel FKTP = O2+bronkodilator+steroid lalu rujuk = PERSIS
  yg sudah diajarkan kasus ini. Skor TIDAK diubah — ipratropium/GINA
  disurfacekan sbg `mutiaraEbm` idealis-vs-lokal, bukan syarat wajib).
  **→ SEMUA 6 sub-temuan [M1] P0 keselamatan kini TUNTAS.**
  **[M7]** `jiwa_depresi_ringan` harusDirujuk dikunci `false` + didokumentasikan
  eksplisit (gating criteria) — keputusan Dr. Wirayuda "kunci false + dokumentasi".
  **[D5] Posyandu ILP "5 Langkah" — MIGRASI PENUH SELESAI 2026-07-11**: pool
  12-kartu (Langkah 2/3/4 masing-masing 3-4 opsi lintas siklus-hidup
  balita/bumil/remaja/produktif-lansia + Langkah 5 Validasi Data tetap), 1
  kartu ditarik per Langkah 2/3/4 tiap sesi via `Rng(seedKurikulum,'posyandu',
  hari,rw)` (deterministik+adil lintas paket ujian), Langkah 1 dilebur narasi.
  `REVISI_ENGINE` 19→20 (dek hardcoded di kegiatan.ts, di luar `sidikJariPack`,
  precedent kartuKlb §49). 5 test baru (struktur/determinisme/variasi/cakupan
  -pool/integrasi-RW) + 647 lama tetap hijau (652 total), tsc bersih.
- ✅ **SELESAI tambahan 2026-07-11** (652/652 hijau, tsc bersih): [G1] audit
  sweep guillotine SELESAI — bersih, nol kandidat baru di luar yg sudah
  diperbaiki (sanggahan menemukan 1 overclaim kecil di rumusan ringkasan,
  substansi tetap benar) · [#14] fix minimal `Math.max(1,...)` konsekuensi
  hari-0 (murni logika, nol dampak observable) · [#12c] konsistensi teks
  debrief apendisitis (3 lokasi, tak sentuh skor) · [#7b] hapus formula DBP
  arbitrer di narasi Prolanis (kosmetik, tak sentuh skor).
- ✅ **[#2] Asih storyline — SELESAI 2026-07-11** (ronde CODEX-31 Addendum
  Q6). SCOPE: DeepThink pilih Jalur Generik (formula bersama, bukan
  allowlist Asih-saja) — berlaku ke seluruh 16 keluarga. MEKANISME (blocker
  lama: kartu ke-4 terpisah tak jalan krn kunjungan single-select) dijawab
  dokter: syarat `kualitasMi >= 50` ditambahkan ke formula `berhasil`
  (`kunjungan.ts`, `AMBANG_KUALITAS_MI_BERHASIL`) — hipotesis+kartu benar
  TAPI dialog MI asal-tebak (kualitasMi rendah) kini jatuh ke `tingkat:
  'partial'`, bukan otomatis `berhasil`. Tak perlu konten kartu baru.
  REVISI_ENGINE 20→21 (bersamaan dgn fix #16 lab-floor, sesi sama). Detail:
  `docs/CODEX_AUDIT_DOSSIER.md` §63, `docs/DEEPTHINK_CODEX31_KEPUTUSAN.md`.
- ✅ **[#14]/[#7c]/[#4a]/[#4c] SEMUA SELESAI 2026-07-12** (dossier
  `CODEX_AUDIT_DOSSIER.md` §65): edukasiKritis-konsekuensi dipersempit ke
  `minum_oat_tuntas` saja · Prolanis DM/HT asimetri dijawab via transparansi-
  narasi (gerbang rujukan TIDAK diubah, disengaja) · ANC gol.darah distraktor
  dicabut (komponen 10T resmi) · ANC folat dobel dibereskan (`asam_folat`
  dicabut dari `obatBenar`, `tablet_fe` sudah cover).
- ✅ **PNPK-D(17) SELESAI 2026-07-12**: 7 Tier-1 (protokol klinis, 3 dari 5
  rekomendasi awal Claude DIBALIK setelah digrounding ke DOEN/PPK1186 — lihat
  [[project_primer_pnpk_crosscheck]]) + 5 Tambahan di atas. Tier-2 (10 item)
  tetap backlog M13 (celah cakupan, bukan bug).
- ⚠️ **PPK-C(7) — STATUS TAK PASTI, PERLU VERIFIKASI ULANG** (jangan percaya
  baris di atas maupun memori lama begitu saja): dokter approve Bagian A(21)+
  C(7) penuh 2026-07-10, tapi cek commit history hanya menemukan implementasi
  Bagian B (13 item, commit `d4b608f`) — TIDAK ada commit terpisah utk
  Bagian A/C. Cek langsung kode `mata_konjungtivitis_alergi` (flagship item
  Bagian C, steroid-vs-tidak): sudah tertangani via `panduanResmi` Phase-A
  (menampilkan 2 otoritas berdampingan, bukan mengubah `obatBenar`) — TAPI 6
  item Bagian C lainnya (dosis amoksisilin OMA, dosis asam folat anemia,
  durasi pedikulosis, tifoid, ICD hemoroid I84-vs-K64.0, ICD apendisitis
  K35.9-vs-K35.8) statusnya BELUM diverifikasi satu-satu. Dari aturan
  Ember-Merah/Hijau ([[project_primer_freeze_bucket_router]]): HANYA 2 kode
  ICD itu yang genuinely blocking freeze (Ember Merah); sisanya kemungkinan
  besar clue/dosis-tak-terstruktur (Ember Hijau, non-blocking, pola sama spt
  `kia_isk_kehamilan` durasi) — tapi ini ASUMSI belum diverifikasi kasus per
  kasus. Bagian A (21 koreksi clue) murni Ember Hijau di semua kasus — TAK
  memblokir freeze, aman dikerjakan kapan saja.
- 🟢 Aman ditunda September (M11a/M13, tunggu greenlight milestone):
  panduanResmi Phase-B murni-display (58 kasus, artifact
  `https://claude.ai/code/artifact/fa1f4474-0395-4182-ac62-415ca16fb2f0`) ·
  118 sisa mutiara pengayaan · Debrief Malam cap-3 [D1] · M12 aesthetic
  (sekarang dijadwalkan SETELAH M13, dibalik 2026-07-12) · M13 konten baru.

## 6. Q8 — Audit ICD-10 67 kasus + 5 IGD (SELESAI 2026-07-10)

Workflow `audit-icd10-satusehat` (8 auditor, WebSearch vs WHO ICD-10 2010).
**154 kode diperiksa, 147 tepat (95%).** Sangat bersih. Rincian 7 temuan:

### 6a. SATU kode genuinely keliru (CM-only) — ✅ SUDAH DIFIX (kode pakai `I13.9`,
bukan rencana `I10` di bawah — dokumen ini basi di titik ini, dikoreksi 2026-07-12)
- **`mm_hipertensi_urgensi` icd10 `I16.0`** (keyakinan TINGGI, = konfirmasi CODEX
  #11). Kategori **I16 (Hypertensive crisis) TIDAK ADA di WHO ICD-10 2010** — murni
  tambahan ICD-10-CM AS (efektif FY2018). WHO 2010 blok hipertensi berhenti di I15.
  Komentar kode di `kasusMetabolikMsk.ts:896-898` ("audit CODEX 2026-07-04" yg
  mengubah I10→I16.0 dgn alasan "kode urgensi/krisis di ICD-10 memang I16.x") BENAR
  utk CM tapi SALAH utk WHO 2010 — justru I10 lama sudah benar.
  - **Ganjalan:** WHO 2010 TAK punya kode urgensi/krisis terpisah → hipertensi
    urgensi = **I10** (sama dgn `hipertensi_esensial`; I10 WHO mencakup malignant/
    berat). Dua kasus akan berbagi I10.
  - **Kenapa itu OK & terkelola:** kedua kasus SUDAH dibedakan oleh `skdi`/
    `harusDirujuk` (urgensi=3B rujuk, esensial=4A tuntas), BUKAN oleh kode ICD.
    `pack.test.ts` (`ICD_DUPLIKAT_SENGAJA`) sudah menyediakan mekanisme
    men-dokumentasi-kan duplikat ICD yang disengaja — jadi ini didukung, bukan
    melawan invarian.
  - **Rencana fix (butuh OK dokter + 1 keputusan):** (1) icd10 I16.0→I10; (2)
    diagnosisBanding [I10,I16.0,I16.9] → buang I16.x (CM-only) & ganti dgn pembanding
    WHO nyata — **PILIHAN DDx ini keputusan dokter** (mis. I11.9 hypertensive heart
    disease? I15 secondary? atau cukup sisakan pembanding non-hipertensi); (3)
    daftarkan I10 di `ICD_DUPLIKAT_SENGAJA` + alasan; (4) perbaiki komentar
    menyesatkan di baris 896-898.
  - **RESOLUSI AKTUAL (ditemukan 2026-07-12, tak diketahui kapan persis
    dieksekusi):** kode saat ini (`kasusMetabolikMsk.ts:914`) pakai **`I13.9`**
    (Hypertensive heart AND renal disease, WHO 2010 valid) — solusi lebih baik
    dari rencana I10 di atas, karena tak perlu berbagi kode dgn
    `hipertensi_esensial` sama sekali (menghindari isu duplikat-ICD ini
    seluruhnya, bukan sekadar mendokumentasikannya). Rencana di atas dibiarkan
    sbg arsip historis — jangan dieksekusi ulang.

### 6b. Enam "kurang-spesifik" — OPSIONAL, rekomendasi condong BIARKAN
Semua keyakinan SEDANG; auditor sendiri menegaskan kode 3-karakter saat ini LAZIM &
DITERIMA di FKTP Indonesia (PPK Kemenkes/daftar 144/BPJS), dan beberapa justru LEBIH
tepat utk diagnosis presumtif-klinis tanpa lab (= realita FKTP yang PRIMERA modelkan):
| Kasus | Sekarang | Saran | Catatan |
|---|---|---|---|
| `faringitis_akut` | J02.9 | J02.0 (streptococcal) | J02.9 sah bila strep presumtif klinis (tanpa RADT/kultur) |
| `tonsilitis_akut` | J03.9 | J03.0 (streptococcal) | idem — sah bila belum ada konfirmasi lab |
| `diare_akut_anak` | A09 | A09.0 | A09 bare = kategori (WHO 2010 pecah A09.0/.9); tapi A09 lazim FKTP |
| `disentri_basiler` (DDx) | A09 | A09.9 | kode DDx saja, dampak kecil |
| `apendisitis_akut` (DDx) | A09 | A09.9 | kode DDx saja, dampak kecil |
| `igd_syok_anafilaksis` | T78.2 | T88.6 | T78.2 sah utk anafilaksis generik; T88.6 lebih tepat KARENA dipicu obat (suntik antibiotik). Refinement bermakna klinis — **layak dipertimbangkan** |

**Rekomendasi:** wajib fix hanya 6a (I16.0). Utk 6b: BIARKAN J02.9/J03.9/A09 (sengaja
memodelkan dx presumtif-klinis FKTP — bahkan bisa jadi bahan `catatanRealita`/clue M11a
"kenapa unspecified sah di FKTP"); pertimbangkan T88.6 utk anafilaksis-dipicu-obat
(nuansa "correct drug properly administered" = pelajaran koding bagus). Semua keputusan
dokter. Kode ICD ikut `sidikJariPack` → mengubahnya butuh masuk gelombang M10.5 (bukan
REVISI bump, tapi pack-hash bergeser).

## 7. Adjudikasi DeepThink (jawaban diterima 2026-07-10) + triase Claude

DeepThink menjawab 8 pertanyaan `DEEPTHINK_M10_5.md`. Semua [Kuat]. Claude
memverifikasi klaim feasibility ke kode aktual sebelum meratifikasi. Ringkas:

| Q | Rekomendasi DeepThink | Triase Claude (terverifikasi) |
|---|---|---|
| Q1 (P1.6) | O-B (bobot proses ke UKP) | ✅ **DIPUTUSKAN: O-C dulu** (Dr. Wirayuda 2026-07-10) — turunkan ambang hari-akreditasi Mode-Ujian, reuse `rmLengkap`, deflasi minimal. Naik ke O-B hanya bila self-play tunjukkan outcome-gaming tetap dominan. Mode-awareness sudah ada (`scoring.ts:85`). |
| Q2 (P1.7) | **O-B** (gate tes konfirmasi, <10 kasus) | ✅ ACCEPT. Reuse pola cap `vitalDiukur`/`edukasiKritis`. |
| Q3 (P1.9) | **O-B** (edukasiKritis → rmLengkap=false) | ✅ ACCEPT. Operator AND murah (`reducer.ts:314-318`). |
| Q4 (C.1) | **O-B** (stabilisasi mekanik bernilai, cap bila lewat) | ✅ ACCEPT, gabung jalur P0. Landasan SKDI 3B kuat. |
| Q5 (C.8) | **O-A** (firewall + sentilan debrief, TANPA gerbang baru) | ✅ ACCEPT — ini rem anti-checklist-fatigue. |
| Q6 (#2 karma) | **Opsi (a)** (MI-berhasil + WAJIB pilih "Rujuk/Eskalasi SEKARANG" utk batalkan karma) | ✅ ACCEPT — feasibility DIVERIFIKASI, lihat §7b. |
| Q7 (guillotine) | sinkron `harusDirujuk` biner (bukan rework mesin) | ✅ ACCEPT + **right-size** §7c — lingkupnya lebih kecil dari dugaan. |
| Q8 (urutan) | Golden Master TUNGGAL eksternal; #10+Q1 isolasi minggu-1 timebox | ✅ ACCEPT. |

### 7a. FORK Q1 — O-B vs O-C (satu-satunya keputusan tersisa)
DeepThink pilih O-B (rombak formula UKP Mode-Ujian, bobotkan grade proses). Tapi
**blind-spot yang DeepThink sendiri angkat = "deflasi skor global"** (§7d) justru
argumen kuat utk O-C: O-B menambah tekanan deflasi PALING besar (grade proses
langsung menekan UKP), sedangkan O-C (turunkan ambang hari-akreditasi utk Ujian
→ `rmLengkap` yang SUDAH ada berpengaruh) menambah lebih sedikit. Verifikasi:
`scoring.ts:85` sudah bercabang `state.mode==='ujian'` → keduanya feasible tanpa
mekanik baru. **Rekomendasi Claude: mulai O-C (lebih ringan, reuse jalur), naikkan
ke O-B HANYA bila self-play (§7d) menunjukkan outcome-gaming tetap dominan.**
Argumen O-B (DeepThink): granularitas kualitas penalaran lebih tinggi, O-C "biner/
eksploitatif". **KEPUTUSAN Dr. Wirayuda (2026-07-10): O-C dulu.** O-B tetap di meja
sebagai eskalasi bersyarat bila data self-play (§7d) menunjukkan outcome-gaming bertahan.

### 7b. Q6 feasibility DIVERIFIKASI (kekhawatiran DeepThink sendiri)
DeepThink ragu arsitektur `desa.ts`+reducer bisa menyuntik aksi medis ke babak
naratif. **Cek kode:** `selesaikanKunjungan` (`kunjungan.ts:273`) hitung
`berhasil = !diusir && hipotesisBenar && intervensiCocok`; `Intervensi.cocokUntuk`
sudah ada. Karma dibatalkan di `reducer.ts:729` saat `berhasil`. Menambah opsi
"Rujuk/Eskalasi SEKARANG" = cukup 1 intervensi baru di arc + flag (mis.
`aksiEskalasi?: boolean`); gerbang karma jadi `berhasil && eskalasiDipilih`.
**Perubahan MODERAT (reducer.ts:729 + konten arc), BUKAN refactor rantai-event
rumit** yang DeepThink takutkan. Sistem intervensi memang sudah dirancang utk
pilihan bercabang — menyuntik satu pilihan medis tak melawan arsitekturnya.

### 7c. Q7 right-sized (lebih kecil dari dugaan DeepThink)
**Cek kode:** guillotine hanya melihat `rujukanNonSpesialistik` yang dihitung
PER-ENCOUNTER POLI (`clinic.ts:595`, diakumulasi `reducer.ts:270` dari poli saja).
Storyline/UKM/kunjungan TAK memberi makan tally ini. → Fix P0 yang hidup di
storyline (Asih preeklampsia = keluarga arc; Lastri stroke = storyline) **TAK
menyentuh guillotine sama sekali**. Kerja Q7 = audit HANYA kasus POLI yang
klasifikasi `harusDirujuk`-nya berubah (segelintir; `stroke_iskemik`/
`mm_hipertensi_urgensi` poli SUDAH 3B harusDirujuk). Jadi ini audit-data mungil,
mengonfirmasi (& mengecilkan) kesimpulan DeepThink "bukan rework mesin".

### 7d. Blind-spot DEFLASI SKOR — DIELEVASI jadi langkah wajib Golden Master
DeepThink benar & ini terverifikasi konkret: ambang grade HARD-CODED di
`scoring.ts:30-33` (**A≥85 · B≥70 · C≥55 "Lulus" · D<55**). Menumpuk penalti
Q1-Q4 bisa menerjunkan speedrunner dari A ke C/D → tuduhan "game nge-bug/tak adil".
**Jembatan dgn prinsip "jangan rebalance tanpa data":** harness self-play/soak
SUDAH ADA (`selfplay.test.ts`, `soak.test.ts`). **Langkah wajib SEBELUM freeze
Golden Master:** jalankan profil adversarial (speedrunner, teliti, ceroboh) pasca
semua penalti → UKUR pergeseran distribusi grade → kalibrasi ambang A/B/C/D
dengan data SINTETIS itu (bukan buta), ATAU komunikasikan standar baru eksplisit
di tutorial Hari-1. Ini bukan opsional; ini gerbang rilis.

### 7e. Yang DeepThink benar & JANGAN diubah (dicatat)
Disiplin mendaur-ulang pola "cap skor" (`vitalDiukur→maks 50`) alih-alih membangun
infrastruktur hukuman baru dari nol utk Q2/Q4 — matikan scope-creep, jaga
kestabilan regresi. Dipertahankan sbg prinsip M10.5.

**Urutan kerja M10.5 final (sintesis DeepThink + triase):** ⚠️ status per-baris
dikoreksi 2026-07-12 (REVISI_ENGINE sudah 23 sekarang, bukan satu bump tunggal
"=18" seperti direncanakan di bawah — sudah naik bertahap 18→19→20→21→22→23 lewat
banyak batch terpisah, bukan satu Minggu-4 pamungkas):
1. Minggu-1 (operasi berisiko, timebox+rollback): #10 forced-AND (`clinic.ts:494`)
   — **kemungkinan besar SELESAI** via mekanisme `obatOpsional` (komentar kode
   "M10 §49" persis menjelaskan fix utk skenario forced-AND ini) tapi belum
   diverifikasi eksplisit sbg penutup item #10 spesifik ini — cek sebelum
   dianggap tuntas. Q1 **O-C** (turunkan ambang akreditasi Mode-Ujian) — ❌ **BELUM,
   sedang dikerjakan sekarang** (`reducer.ts:1769` masih cuma cek `hari===60`,
   tak pernah nyala di mode Ujian yg tamat hari 30).
2. Minggu-2 (P0 keselamatan + data): Q4 stabilisasi — ❌ **BELUM, butuh keputusan
   dokter** (bangun mekanisme oksigen/tindakan pra-rujuk atau skip). Q6
   eskalasi-pasca-MI — ✅ **SELESAI** (Asih/preeklampsia, `aksiEskalasi` digeneralisasi
   ke 16 keluarga, 2026-07-12). Audit Q7 harusDirujuk poli — status tak diverifikasi
   ulang sesi ini.
3. Minggu-3 (disiplin klinis): Q2 gate konfirmasi + Q3 edukasiKritis→rmLengkap —
   ⚠️ **STATUS BENTROK, PERLU RATIFIKASI DOKTER**: badan teks §7 ini bilang "butuh
   keputusan", tapi kalau ada tabel adjudikasi terpisah yg menandai ACCEPT, itu
   perlu dikonfirmasi eksplisit ini ratifikasi final, bukan triase awal yg belum
   disetujui. BELUM diimplementasi baik pun. Q5 = firewall saja (sudah) + sentilan
   debrief — ❌ **teks nudge belum ditempel ke PanelHasil.tsx** (segera dikerjakan).
4. Minggu-4 (Golden Master): **self-play deflasi + kalibrasi ambang (§7d, WAJIB)**
   — ❌ **BELUM ADA sama sekali**: `soak.test.ts` yang ada murni defensif
   (anti-crash), `selfplay.test.ts` cuma 1 profil "dokter rajin" bukan 3 profil
   adversarial (speedrunner/teliti/ceroboh) yg diminta di sini — **capstone
   sebenarnya, sedang dibangun sekarang**. Freeze-enforcement (checksum test)
   juga 0% ada di kode — freeze sejauh ini murni kebijakan dokumen, lihat
   `project_primer_freeze_bucket_router` (memori proyek). Keputusan medis (#4/#5/#12) sudah
   dieksekusi 2026-07-12; ICD I16.0 (§6a) sudah dieksekusi (jadi I13.9, bukan I10
   spt rencana asli).

### 7f. G2 — Baseline soak-test adversarial PERTAMA (2026-07-12)

`src/engine/soakAdversarial.test.ts` dibangun: 3 profil (speedrunner/teliti/
ceroboh), 2 mode × 2 seed, penuh sampai `tamat`. Cakupan: IGD (optimal, semua
profil) + poli klinik (parameter penuh per-profil) + maks 1 kunjungan/hari.
**TIDAK mencakup** Kegiatan/Posyandu/Prolanis/Pemulihan eksplisit (batasan sama
dgn `soak.test.ts` lama) — Resiliensi karenanya 0.0/15 di SEMUA run, itu artefak
cakupan harness, BUKAN temuan skor.

**Bug ditemukan & diperbaiki DI HARNESS SENDIRI sebelum data dipercaya**: draft
pertama menyamakan disposisi "benar" dgn `kasus.harusDirujuk` mentah, tanpa
mengecualikan pasien PRB (rujuk-balik, M3.13) — merujuk-ulang pasien PRB
terhitung `rujukanNonSpesialistik` (`clinic.ts:642-644`) walau `harusDirujuk`
kasusnya true. Ini men-charge diri sendiri lewat Referral Guillotine
(`scoring.ts:51-52`): profil TELITI (100% diagnosis benar, 100% kalibrasi TEGAK)
sempat menunjukkan UKP=5.0/35 murni krn bug ini. Diperbaiki (cek `enc.pasien.prb`
dulu), lalu diverifikasi ulang.

**Hasil baseline SETELAH fix (REVISI_ENGINE 23, sebelum kalibrasi kategori-3
manapun turun):**

| Mode | Profil | UKP | UKM | Manajemen | Resiliensi | Total | Grade |
|---|---|---:|---:|---:|---:|---:|---|
| Karier | teliti | 35.0/35 | ~29.3/35 | 12-13/15 | 0/15 | ~76-78 | B |
| Karier | speedrunner | 35.0/35 | ~29.2/35 | 9.5-10/15 | 0/15 | ~74 | B |
| Karier | ceroboh | 0.0/35 | 0.0/35 | 0.0/15 | 0/15 | 0.0 | D |
| Ujian | teliti | 35.0/35 | ~28.8/35 | 11.5-15/15 | 0/15 | tinggi | — |
| Ujian | speedrunner | ~35.0/35 | ~25.5-28.5/35 | 11-11.5/15 | 0/15 | — | — |
| Ujian | ceroboh | 0.0/35 | 0-1.5/35 | 0.0/15 | 0/15 | ~0 | D |

**Bacaan awal (bukan kalibrasi final — G2 masih perlu keputusan kategori-3
turun dulu, §7e di atas):** teliti vs speedrunner HAMPIR IDENTIK di Karier
(±2-4 poin) — konsisten dgn Q1's kekhawatiran "speedrunner bisa lolos nyaris
sama baik dgn teliti" (argumen utk Q1 eskalasi O-C→O-B BELUM terpicu di sini,
tapi juga belum tertutup krn Q2/Q3/Q4 belum diimplementasi — soak final wajib
diulang setelah itu turun). Ceroboh jatuh ke 0.0 total (guillotine + penalti
lain kompak jenuh ke lantai) — Referral Guillotine + hard-cap #12 tampak
bekerja sesuai desain (bukan sekadar terjun bebas tak terkendali). Invarian
`teliti ≥ speedrunner ≥ ceroboh` (rata-rata grade per-encounter numerik)
terpasang sbg pagar regresi permanen.

## 8. Cross-check 31 PNPK Kemenkes (Tier 1+2) — SELESAI 2026-07-10, 17 temuan "berbeda"

Workflow `pnpk-crosscheck` (61 agen, 30/31 dokumen berhasil diproses — 1 gagal genuinely
krn file PDF yang di-hosting Kemenkes sendiri salah unggah/tertukar, lihat catatan di bawah).
46 finding total: 16 cocok, 5 primera-lebih-luas (aman, tak perlu aksi), 6 tak-relevan,
2 tidak-ditemukan-di-kode, **17 berbeda (butuh keputusan/tinjau)**. Detail penuh tiap finding
(termasuk sitasi persis & kutipan kode) di `docs/references/pnpk/crosscheck_full.json`
(semua) dan `crosscheck_berbeda.json` (17 yang actionable saja).

**Temuan operasional menarik (bukan bug proses kita)**: PDF resmi Kemenkes untuk "PNPK 2021
Tata Laksana Gagal Jantung" ternyata isinya SALAH — badan Lampiran (~206rb karakter) adalah
teks PNPK Diabetes Melitus Tipe 2, bukan Gagal Jantung (diverifikasi 2 mirror independen,
MD5 identik, tanda tangan Menkes berbeda di akhir Lampiran). Bukan diproses lebih lanjut —
tak ada dasar utk distilasi/cross-check yang valid dari file yang salah ini.

**7 dari 17 "berbeda" adalah Tier-1** (kasus SPESIFIK sudah ada, isinya berbeda dari PNPK):
- `hipertensi_esensial` vs PNPK Hipertensi 2021 [TINGGI] — kasus pakai monoterapi amlodipine
  utk TD 160/95 (Derajat 2), padahal PNPK mewajibkan KOMBINASI 2 obat sejak awal utk Derajat
  2/3 kecuali lansia-frail/Derajat-1-risiko-rendah. `clue`/`konsekuensi.guideline` kasus ini
  malah menyitir JNC-8 + Permenkes 5/2014 — PNPK 2021 tak disebut sama sekali sbg rujukan.
- `dm_tipe2` vs PNPK DM2 2020 [SEDANG] — HbA1c 8,9% (≥7,5%, ambang PNPK utk kombinasi 2 obat),
  tapi kasus hanya definisikan metformin monoterapi (`obatAlternatif`/`obatOpsional` memang
  kosong, bukan salah baca sibling field).
- `mm_isk_bawah` vs PNPK ISK 2025 [SEDANG] — pilihan antibiotik lini pertama sistitis.
- `kia_isk_kehamilan` vs PNPK ISK 2025 [TINGGI] — durasi terapi ISK kehamilan.
- `jiwa_skizofrenia` vs PNPK Skizofrenia 2025 [SEDANG] — episode psikotik pertama.
- `jiwa_gangguan_cemas` vs PNPK Kedokteran Jiwa 2015 [SEDANG] — diagnosis/alur/prinsip sudah
  sesuai, obat spesifik yang dikodekan yang beda.
- `mm_gagal_jantung_kongestif` vs PNPK Angina Pectoris Stabil 2023 [TINGGI] — ISDN diresepkan
  tanpa ada pengecekan riwayat inhibitor PDE5 (interaksi hipotensi berat) di manapun di kasus.

**10 sisanya Tier-2** (gap/latar, bukan kasus spesifik yang salah — lebih ke arah "PRIMERA
belum punya konten soal X sama sekali"): PNPK Nyeri (kerangka nyeri kronik lintas-kasus belum
ada), Sepsis dewasa+anak (PRIMERA tak punya modul pengenalan sepsis sbg entitas lintas-etiologi
di luar IGD-spesifik), Trauma (2 finding — modul IGD sudah oke arsitektur stabilitas, tapi
mekanisme rujukan SISRUTE bisa lebih detail), Sindroma Koroner Akut [RENDAH], Angina Pectoris
Stabil (2 finding — 1 soal EKG "gelombang Q lama" gagal_jantung, 1 soal verapamil/diltiazem
sama sekali tak ada di katalog obat), Batu Saluran Kemih (PRIMERA nol konten ttg ini),
Perdarahan Saluran Cerna (poin actionable soal red-flag rujuk, bukan diagnosis dispepsia/GERD
yg sudah benar), Osteoporosis (nol konten skrining faktor risiko/rujuk BMD).

**Status: SEMUA 17 murni tercatat, belum ada yang diputuskan/diimplementasikan.** Rencana
sama seperti PPK1186 (§3d): gabungkan ke artifact shortlist konsolidasi (41 item saat ini)
sbg "Bagian D", TAPI belum dieksekusi — menunggu Dr. Wirayuda siap melakukan satu putaran
adjudikasi (beliau menyatakan lelah 2026-07-10, riset dilanjutkan tanpa menunggu, tapi
konsolidasi UI ditahan dulu sampai diminta).
