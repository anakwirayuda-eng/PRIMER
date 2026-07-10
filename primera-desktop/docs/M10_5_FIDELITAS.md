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
