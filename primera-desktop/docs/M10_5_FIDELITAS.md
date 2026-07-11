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
- **#10** — terapi kondisional dipaksa AND (`clinic.ts:494`). ⚠ DeepThink menandai
  ini paling berisiko *cascade failure* pada 516 test — estimasi waktu bisa meleset.
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
| `tiamfenikol_500` | amfenikol (analog kloramfenikol) | `amfenikol` | silang-reaksi masuk akal; **cek dokter** |
| `mupirosin_krim` | antibiotik topikal (mupirosin) | **— (biarkan kosong?)** | topikal, tak ada kelas silang-reaksi sistemik bermakna. **Keputusan dokter.** |
| `oat_kdt` | kombinasi INH+RIF+PZA+EMB | **— (biarkan kosong?)** | produk kombinasi; satu kelas alergi menyesatkan. **Keputusan dokter.** |

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
3. **Fase 3 — Golden Master (akhir Agustus):** satukan semua, 516+ test hijau, **SATU
   `REVISI_ENGINE` bump final**, hard-freeze `reducer.ts`/`clinic.ts`/`scoring.ts`.
4. **Fase 4 — M11a Live-Ops (Sept dst):** 118 mutiara pengayaan, Debrief Malam
   old-vs-new (Q6b), polish visual/M12, variasi cerita — silent patch, TAK sentuh
   `REVISI_ENGINE`.

**Blind spot DeepThink (WAJIB diingat):** saat Q2 memaksa eskalasi/rujuk kasus gawat
(preeklampsia/stroke), **kalibrasi ulang Referral Guillotine SERENTAK** — jangan
sampai mahasiswa yang merujuk BENAR (per EBM terbaru) justru ditebas penalti rujukan
krn DB SKDI 4A/3B belum di-update. Batas "tuntas-mandiri vs rujuk" harus digeser
bersamaan di Fase 2.

## 6. Q8 — Audit ICD-10 67 kasus + 5 IGD (SELESAI 2026-07-10)

Workflow `audit-icd10-satusehat` (8 auditor, WebSearch vs WHO ICD-10 2010).
**154 kode diperiksa, 147 tepat (95%).** Sangat bersih. Rincian 7 temuan:

### 6a. SATU kode genuinely keliru (CM-only) — butuh keputusan konten
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

**Urutan kerja M10.5 final (sintesis DeepThink + triase):**
1. Minggu-1 (operasi berisiko, timebox+rollback): #10 forced-AND (`clinic.ts:494`)
   + Q1 **O-C** (turunkan ambang akreditasi Mode-Ujian). Isolasi 530+ test hijau.
2. Minggu-2 (P0 keselamatan + data): Q4 stabilisasi + Q6 eskalasi-pasca-MI + audit
   Q7 harusDirujuk poli (paralel).
3. Minggu-3 (disiplin klinis): Q2 gate konfirmasi + Q3 edukasiKritis→rmLengkap.
   Q5 = firewall saja (sudah) + sentilan debrief.
4. Minggu-4 (Golden Master): **self-play deflasi + kalibrasi ambang (§7d, WAJIB)**
   → SATU bump `REVISI_ENGINE=18` → hard-freeze. Keputusan medis (#4/#5/#12) +
   ICD I16.0 (§6a) masuk gelombang ini juga.

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
