# DEEPTHINK — Adjudikasi Desain M10.5 "Fidelitas Engine & Medis"

> **Untuk:** DeepThink (reviewer strategis desain-pedagogi, BUKAN auditor kode &
> BUKAN penentu fakta medis). CODEX sudah memverifikasi *apakah kodenya benar*;
> Dr. Wirayuda (dokter) memutuskan *fakta medis*. Kamu memutuskan *apakah desain
> mekanik/skor & urutannya benar* — output = PENILAIAN + REKOMENDASI berperingkat
> + trade-off, bukan daftar bug, bukan kode, bukan klaim medis baru.
> **Tanggal:** 2026-07-10 · Basis: HEAD `claude/vigorous-bose-f66bc6` commit
> `9508875`, folder `primera-desktop/`. `REVISI_ENGINE=17`, 530 test.
> **Pendahulu:** `DEEPTHINK_TRIANGULASI_M11.md` (kamu jawab; diterima PENUH).
> Dossier ITU memutuskan *apakah M10.5 harus ada* (ya). Dossier INI menanyakan
> *keputusan desain DI DALAM M10.5* yang tersisa.

---

## 0. KONTEKS RINGKAS (baca dari nol; detail penuh di `DEEPTHINK_TRIANGULASI_M11.md` §0)

PRIMERA = game desktop edukasi dokter FKTP Indonesia (Electron/TS/React).
Pemain = dokter fresh-grad, stase **90 hari** ("Karier") atau **Mode Ujian 30
hari** (jalur asesmen utama). Pemakai: **±50 mahasiswa FK, DINILAI dari skor
game, redeploy ±September 2026.** Dev solo (Dr. Wirayuda) + AI. Integritas
pedagogis & asesmen = kepentingan produk inti.

**Loop klinik (UKP):** tiap pasien = 1 `KasusKlinis` (67 poli + 5 IGD). Alur:
Anamnesis → Pemeriksaan Fisik → (Lab) → Diagnosis (pilih ICD + stempel TEGAK/
SUSPEK) → Tatalaksana (resep dari ~97 obat) → Edukasi (pilih topik, baki 3 slot)
→ Disposisi (tuntas FKTP / rujuk RS). **Loop masyarakat (UKM):** 16 keluarga
binaan via kunjungan rumah berstruktur babak (hotspot info → dialog dinilai
kualitas wawancara-motivasi/MI → intervensi → hasil berhasil/partial/gagal/
diusir). Skor akhir: **UKP 35 · UKM 35 · Manajemen 15 · Resiliensi 15.**

**Istilah:** SKDI = level kompetensi (4A tuntas mandiri FKTP; 3B diagnosis+
stabilisasi+WAJIB rujuk; 3A diagnosis+rujuk). `REVISI_ENGINE` = versi semantik
skor; bump memaksa dossier lama mahasiswa "tidak dapat diverifikasi" saat replay.
`rmLengkap` = rekam medis lengkap (4 skor SOAP ≥50). **Referral Guillotine** =
penalti bila merujuk kasus yang seharusnya tuntas-mandiri (anti over-rujuk).
"Pola cap skor" = elemen wajib hilang → skor dimensi diplafon (mis. `vitalDiukur`
→ skorPemeriksaan maks 50; `edukasiKritis` → skorEdukasi maks 50). Ini mekanik
tervalidasi & dipakai berulang.

**Keputusan mengikat M10.5 (dari dossier pendahulu, diterima):** semua fix
ber-REVISI dikumpulkan → **SATU Golden Master akhir Agustus** → hard-freeze mesin
skor saat semester mulai. Display murni (M11a) = live-ops pasca-Sept. Model dosis
obat DITOLAK (pertahankan abstraksi tanpa-dosis). Hierarki prioritas:
**pedagogis > asesmen/anti-forgery > retensi > kompetisi > fun.**

**Rencana M10.5 lengkap:** `docs/M10_5_FIDELITAS.md` (14 temuan CODEX terpilah +
tabel firewall + audit ICD + urutan). 4 quick-win Fase-1 SUDAH selesai (firewall
alergi, reframe otonomi desaF, audit ICD-10 67 kasus, dok keputusan ini). Yang
TERSISA & jadi subjek dossier ini = keputusan DESAIN mekanik/skor untuk gelombang
Agustus.

## 1. INTI TUGASMU — LIMA KEPUTUSAN MEKANIK SKOR

Kelimanya pilihan DESAIN pedagogis (bukan bug, bukan fakta medis). Semua ber-
REVISI bila diubah → harus final SEBELUM Agustus. Fakta kode di bawah SUDAH
diverifikasi ke HEAD terkini. Untuk tiap: **Penilaian** (2-4 kalimat) +
**Rekomendasi** (1 kalimat) + **Tag** [Kuat]/[Sedang]/[Spekulatif].

### Q1 (P1.6) — Mode Ujian menilai PROSES klinis, atau hanya hasil-akhir?
**Fakta (scoring.ts:43-78):** UKP = `(0,75×akurasiDiagnosis + 0,25×kalibrasi) ×
guillotine − 5×cowboy + bonusRujukan + efekIGD`. Sub-skor per-encounter
(anamnesis/PF/terapi/edukasi) **TIDAK dibaca sama sekali** ke UKP. Jalur proses
klinis satu-satunya = `rmLengkap` (4 SOAP ≥50) → akreditasi, TAPI akreditasi baru
menggigit **hari-60**, sedangkan **Ujian tamat hari-30**. → Di Mode Ujian,
mahasiswa bisa mengabaikan anamnesis/PF/terapi/edukasi & tetap raih UKP tinggi
asal diagnosis+disposisi benar.
- **O-A:** biarkan (outcome-only disengaja).
- **O-B:** bobotkan rata-rata grade encounter ke UKP (proses dinilai langsung).
  Lebih valid sbg proxy OSCE, TAPI ubah formula inti → re-baseline test + mungkin
  re-balance karier.
- **O-C:** turunkan ambang hari-akreditasi utk Mode Ujian (mis. D30) → `rmLengkap`
  (yang SUDAH menuntut proses) berpengaruh di Ujian. Lebih ringan drpd O-B, reuse
  jalur yang ada.
- *Lean kami:* O-B atau O-C — asesmen dokter yang menilai HANYA tebakan akhir
  mengajarkan hidden curriculum "proses tak penting". **Pertanyaanmu:** O-B (ubah
  formula, lebih murni) vs O-C (geser ambang, lebih murah/aman) — mana lebih tepat
  utk instrumen asesmen solo-dev, DAN apakah "proses tak dinilai di Ujian" cukup
  jadi cacat utk melangkahi prinsip "jangan utak-atik skor tanpa data playtest"?

### Q2 (P1.7/C.7) — Tes konfirmasi MENGUNCI skor diagnosis bila dilewati?
**Fakta:** malaria (RDT/mikroskop), TB (BTA), DM (GDP/HbA1c) bisa dapat grade baik
TANPA melakukan tes konfirmasi yang `clue`-nya SENDIRI wajibkan ("KONFIRMASI
sebelum terapi"). Tak ada gerbang.
- **O-A:** biarkan (tes opsional).
- **O-B:** field baru per-kasus `konfirmasiWajib?: labId`; melewatinya cap skor
  diagnosis/grade — **meniru pola `vitalDiukur`/`edukasiKritis` yang SUDAH ada**
  (bukan mekanik baru, hanya penerapan konsisten). Konten: tag ~5-10 kasus.
- *Lean kami:* O-B — kuat secara pedagogi ("jangan terapi buta") & reuse pola
  tervalidasi. **Pertanyaanmu:** setuju O-B? Adakah risiko over-railroading (game
  jadi checklist "klik lab wajib" mekanis) yang menggerus penilaian klinis, atau
  justru itu poin-nya? Haruskah cap-nya keras (spt vitalDiukur) atau bergradasi?

### Q3 (P1.9) — edukasiKritis terlewat JUGA gagalkan `rmLengkap`?
**Fakta (reducer.ts:314-318, clinic.ts:583):** topik edukasi kritis terlewat kini
cap `skorEdukasi` ke **tepat 50**; `rmLengkap` menuntut skorEdukasi **≥50** → 50
LOLOS. Jadi melewatkan edukasi non-negotiable TAK menggagalkan "rekam medis
lengkap" (inkonsisten dgn label "kritis").
- **O-A:** biarkan (cap skor sudah cukup hukuman).
- **O-B:** edukasiKritis terlewat → `rmLengkap=false` (ubah syarat jadi "edukasi
  ≥50 DAN tak ada kritis terlewat"). Konsisten dgn semantik "kritis". REVISI.
- *Lean kami:* O-B ringan. **Pertanyaanmu:** setuju? Atau cap-50 + sudah-disebut-
  di-debrief sudah cukup, dan menambah kopel ke rmLengkap = over-engineering yang
  memperumit rantai skor tanpa nilai pedagogis proporsional?

### Q4 (C.1) — Stabilisasi tangan-pertama jadi mekanik BERNILAI?
**Fakta:** clue pneumonia berat/PPOK/CHF/anafilaksis sebut oksigen/infus pra-rujuk,
tapi tak ada aksi "oksigen"; `pasang_infus` baru dipakai 1 kasus. Tumpang-tindih
dgn temuan keselamatan P0 (#6 anafilaksis/asma/dengue).
- **O-A:** biarkan (stabilisasi naratif saja).
- **O-B:** tambah `tindakan` oksigen + jadikan stabilisasi pra-rujuk langkah
  ternilai/wajib utk kasus gawat tertentu (pola cap bila dilewati). Konten + tipe
  aksi baru + REVISI. Digabung ke jalur P0 keselamatan.
- *Lean kami:* O-B, digabung P0. **Pertanyaanmu:** setuju stabilisasi jadi mekanik
  bernilai? Risiko: menambah beban klik/kompleksitas utk mahasiswa (bukan residen
  manajemen) — apakah stabilisasi-pra-rujuk cukup sentral bagi kompetensi dokter
  FKTP untuk membenarkan aksi+skor baru, atau lebih baik tetap edukasi naratif?

### Q5 (C.8) — Mekanik keselamatan skrining-alergi?
**Fakta:** firewall alergi (mencegah RESEP obat yang pasien alergi) baru saja
dilengkapi (17/19 antibiotik). Tapi tak ada mekanik yang menghargai/mewajibkan
pemain BERTANYA riwayat alergi (anamnesis) SEBELUM meresepkan — firewall menyelamatkan
pemain secara diam-diam tanpa dia belajar bertanya.
- **O-A:** firewall saja cukup (poka-yoke).
- **O-B:** jadikan "menanyakan riwayat alergi" langkah anamnesis ternilai; resep
  tanpa cek alergi (pada kasus ber-`alergiTrap`) menggerus skor/memicu peringatan —
  mengajarkan REFLEKS bertanya, bukan bergantung pada firewall.
- *Lean kami:* condong O-B tapi ragu (bisa jadi micro-management). **Pertanyaanmu:**
  apakah "reflek tanya alergi" layak jadi mekanik bernilai tersendiri, atau firewall
  poka-yoke + debrief sudah memadai untuk level ini?

**Pertanyaan lintas-Q1-Q5:** kelimanya menambah "gerbang/cap" ke rantai skor.
Adakah risiko AGREGAT — game jadi terlalu banyak gerbang punitif (anamnesis wajib,
vital wajib, lab-konfirmasi wajib, edukasi-kritis wajib, alergi wajib, stabilisasi
wajib) sehingga terasa seperti checklist compliance, bukan penalaran klinis? Di
mana titik "cukup gerbang"? Prioritaskan bila harus pilih SUBSET.

## 2. DESAIN FIX KESELAMATAN P0 (bukan fakta medis — pola mekaniknya)

Fakta medis (apa yang benar secara klinis) = ranah Dr. Wirayuda. Yang kutanyakan
= **bagaimana membentuk mekaniknya tanpa merusak maksud sistem yang ada.**

### Q6 — Karma preeklampsia "selesai tanpa aksi klinis" (#2): paradoks desain
**Fakta (reducer.ts:729):** sistem kunjungan-rumah SECARA ARSITEKTUR adalah mesin
identifikasi-hambatan-perilaku (motivasi/kapabilitas/kesempatan) via wawancara-
motivasi — BUKAN mesin keputusan klinis akut. "Karma_igd" (risiko klinis keluarga
jatuh tempo jadi IGD) DIBATALKAN begitu SATU kunjungan `berhasil=true`, terlepas
isi kunjungan. Untuk keluarga Asih (preeklampsia): pemain bisa "mencegah krisis"
murni lewat keberhasilan teknik komunikasi, tanpa pernah ada tindakan klinis
(ukur TD ulang, rujuk segera). Ini mengajarkan bahwa preeklampsia berat bisa
"diselesaikan" dengan edukasi keluarga.
**Paradoks:** menuntut "aksi klinis" di kunjungan rumah bertentangan dgn desain
sistem itu (yang sengaja tentang perubahan-perilaku, bukan tatalaksana). Tapi
membiarkannya mengajarkan penundaan berbahaya.
- **Opsi peta kami (nilai/gabung/tolak):** (a) untuk keluarga ber-risiko-akut-
  spesifik, kunjungan `berhasil` TAK cukup membatalkan karma — butuh disposisi
  "rujuk/eskalasi SEKARANG" eksplisit sbg pilihan intervensi; (b) pisahkan "risiko
  akut" (preeklampsia, stroke-mengancam) dari sistem karma-perilaku ke jalur
  berbeda yang MENUNTUT rujukan; (c) biarkan sistem, tapi ubah NARASI hasil agar
  tak mengklaim "krisis dicegah" — hanya "hambatan perilaku teratasi, tetap butuh
  tindak lanjut klinis".
- **Pertanyaanmu:** bagaimana merepresentasikan kegawatan-medis dalam sistem
  kunjungan yang filosofinya perubahan-perilaku, TANPA mengkhianati desain MI-nya
  yang berharga? Mana dari (a)/(b)/(c) — atau lainnya — yang paling menjaga KEDUA
  tujuan (ajarkan MI + jangan ajarkan penundaan fatal)?

### Q7 — Referral Guillotine recalibration (blind spot yang KAMU angkat sendiri)
**Fakta (scoring.ts:48-52, 65-70):** Guillotine menghukum RRNS (rujukan non-
spesialistik = merujuk kasus yang SEHARUSNYA tuntas 4A) begitu rujukanTotal≥3;
ada `bonusRujukanTepat` utk merujuk kasus wajib-rujuk dengan benar. Klasifikasi
"wajib tuntas (4A) vs wajib rujuk (3B/3A)" ada di `skdi`/`harusDirujuk` per-kasus.
**Blind spot:** saat fix P0 (Q6, #3 stroke) MEMAKSA eskalasi/rujuk kasus gawat,
bila DB SKDI/`harusDirujuk` tak di-update SERENTAK, mahasiswa yang merujuk BENAR
(per EBM terbaru) bisa ditebas guillotine krn kasus itu masih terklasifikasi "4A
tuntas-mandiri".
- **Pertanyaanmu:** (i) apakah recalibrasi ini murni tugas data (audit `harusDirujuk`
  semua 67 kasus serentak dgn fix P0) atau ada dimensi desain (mis. haruskah
  guillotine punya zona-abu utk kasus yang "boleh tuntas ATAU rujuk tergantung
  presentasi")? (ii) Prinsip apa yang menjaga guillotine tetap bergigi (anti
  over-rujuk, tujuan aslinya) tanpa menghukum rujukan-benar-yang-baru?

## 3. URUTAN & RISIKO DALAM M10.5

### Q8 — "Satu Golden Master" realistis, atau perlu penahanan internal?
**Fakta:** M10.5 memuat: 5 keputusan skoring (§1) + 4 desain-engine (#1 firewall
SUDAH · #7 Prolanis · #10 forced-AND · #14 konsekuensi) + P0 keselamatan (§2) +
keputusan medis (#4/#5/#11/#12, ranah dokter) + audit ICD. **#10 (terapi kondisional
dipaksa AND, `clinic.ts:494`) kamu tandai sendiri berisiko cascade-failure pada
530 test** — estimasi bisa meleset jauh.
- **Pertanyaanmu:** (i) Dgn tenggat Agustus + solo-dev, apakah "kumpulkan SEMUA →
  satu bump" tetap strategi terbaik, atau ada item yang lebih aman di-*land* lebih
  dulu (mis. yang risiko-rendah & independen) untuk mengurangi ukuran Golden Master
  final? Ingat: tiap bump antara = titik "dossier lama tak terverifikasi", jadi ada
  tegangan "sedikit bump" vs "Golden Master raksasa berisiko". (ii) Bagaimana
  mengelola risiko #10 spesifik — kerjakan paling awal (waktu buffer) atau paling
  akhir (isolasi bila meledak)? (iii) Ada urutan internal yang kamu sarankan di
  antara 5-keputusan-skoring + desain-engine + P0, mengingat sebagian saling
  bergantung (mis. Q4 stabilisasi ⊂ P0; Q7 guillotine ⊂ fix rujukan)?

## 4. FORMAT OUTPUT YANG DIMINTA

- Tiap Q1–Q8: **Penilaian** (2-4 kal.) + **Rekomendasi** (1 kal. actionable) +
  **Tag keyakinan** [Kuat]/[Sedang]/[Spekulatif].
- **Satu urutan-kerja M10.5 yang kamu rekomendasikan** (sintesis, bukan 8 jawaban
  lepas — Q8 mengikat semuanya).
- **Satu keputusan yang paling kamu khawatirkan** (blind spot tim).
- **Satu hal yang tim lakukan BENAR** & jangan diubah karena tenggat.

## 5. BIAS-CHECK MANDATORY (jawab singkat)

- Rekomendasimu bias "tambah gerbang/mekanik" padahal risiko checklist-compliance
  & solo-dev + tenggat? Koreksi.
- Mengasumsikan pemain = gamer, padahal mahasiswa FK yang mungkin tak suka game?
  Koreksi.
- Untuk Q1/Q6 (ubah instrumen asesmen & sistem MI) — apakah manfaat pedagogisnya
  sepadan dgn risiko destabilisasi mekanik yang sudah battle-tested + biaya
  re-baseline?
- Di mana kamu paling mungkin SALAH?

---

*Triangulasi PRIMERA: Claude (builder + verifier) · CODEX (auditor kode/medis,
read-only) · DeepThink (reviewer desain-strategi). Tiga sudut independen; fakta
medis & sintesis akhir milik Dr. Wirayuda.*
