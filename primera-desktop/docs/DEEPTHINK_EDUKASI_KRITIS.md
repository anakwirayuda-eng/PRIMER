# DEEPTHINK — Triangulasi Desain: Celah "Topik Kritis" di Skor Edukasi (>3 wajib)

> **Untuk:** DeepThink (reviewer strategis desain-pedagogi, bukan auditor kode)
> **Peran:** CODEX memeriksa *apakah kode/konten benar* (forensik, read-only).
> Kamu memeriksa *apakah keputusan desainnya benar*. Output = PENILAIAN,
> REKOMENDASI berperingkat, dan trade-off eksplisit — bukan daftar bug, bukan kode.
> **Tanggal:** 2026-07-05 · Basis: HEAD branch `claude/vigorous-bose-f66bc6`
> (commit `e4e7df4`), folder `primera-desktop/`.
> **Pendahulu langsung:** `docs/DEEPTHINK_EDUKASI_UX.md` (2026-07-03) — dossier
> ITU menghasilkan mekanik yang KINI jadi subjek dossier INI. Baca §1 dulu utk
> konteks: apa yang sudah diputuskan, dan kenapa celah baru ini bukan kegagalan
> keputusan lama, tapi konsekuensi lanjutannya yang belum terlihat saat itu.
> **Pemicu:** dua ronde audit CODEX berturut (2026-07-05) menemukan & meng-
> konfirmasi celah yang sama dari sudut berbeda — lihat §2.

---

## 0. KONTEKS 90 DETIK (baca dulu, jangan lompat)

PRIMERA = game desktop Electron, *"Football Manager-nya kedokteran komunitas
dengan hati Harvest Moon"*. Pemain = dokter fresh-grad, stase 90 hari (atau Mode
Ujian 30 hari) di Puskesmas desa. Pemakai target: ±50 mahasiswa FK Indonesia yang
**DINILAI dari skor game** (redeploy ±September 2026) → integritas pedagogis &
asesmen adalah kepentingan produk, bukan hiasan. Dev = solo (Dr. Wirayuda) + AI.

Sejak dossier pendahulu (2026-07-03): M6 (kelas & dosen, dossier ber-HMAC +
verifier replay) SELESAI, M7 (polish penuh) SELESAI, M8 (Arena multiplayer)
scaffold ada tapi Supabase belum aktif, M9 (audit-hardening kunci tutorial/SKDI/
tatalaksana) SELESAI. Kini **M10** (audit konsistensi menyeluruh, brief lengkap
di `docs/M10_AUDIT_BRIEF.md`) sedang berjalan lewat CODEX — dossier ini adalah
SATU temuan M10 yang dianggap cukup besar utk butuh triangulasi desain sendiri,
bukan ditambal reaktif. 395 test lolos, `REVISI_ENGINE` di 12.

## 1. APA YANG SUDAH DIPUTUSKAN (dossier pendahulu, JANGAN diputar ulang)

Dossier `DEEPTHINK_EDUKASI_UX.md` (2026-07-03) menghadapi masalah BEDA:
*"tembok 38 tombol edukasi, tenggelam di dasar scroll, strategi degenerate
'4 topik sakti'"*. Rekomendasi yang DITERIMA & DIIMPLEMENTASI (commit `7ac5015`,
M7-awal): **O6 (taksonomi+kategori+sinonim) → O1 (tab Resep|Edukasi, baki
prioritas) → formula baru**:

```
edukasiTarget = min(KAPASITAS_EDUKASI=3, |edukasiWajib|)
skorEdukasi   = 100 × min(1, edukasiTercakup / edukasiTarget) − 15 × edukasiTakRelevan
```

Efeknya BENAR & TERBUKTI BEKERJA utk masalah aslinya: strategi "klik 4 topik
generik yang sama tiap pasien" MATI, karena baki cuma 3 slot dan topik tak-
relevan dihukum berat. Komentar penulis kode SENDIRI saat itu (`clinic.ts:544`)
sudah mengantisipasi konsekuensi ini: *"target = min(kapasitas, wajib) → kasus
komorbid wajib>3 tetap bisa 100"* — diterima sbg trade-off wajar KARENA
diasumsikan berlaku utk kasus **komorbid** (mis. pasien dgn 2 kondisi paralel,
topik-topiknya memang kira-kira setara pentingnya, pilih 3 dari 4-5 topik
serupa bobot tak masalah).

**Yang BELUM terlihat 2026-07-03** (baru ketahuan lewat audit M10, §2): asumsi
itu tidak berlaku UNIVERSAL. Sejumlah kasus wajib>3 bukan "komorbid setara" —
topik-topiknya py bobot klinis SANGAT TIMPANG (satu topik = keselamatan jiwa,
sisanya = kenyamanan suportif), dan formula saat ini memperlakukan semuanya
fungibel/bisa-saling-gantikan.

Ini BUKAN kegagalan keputusan 2026-07-03 — itu solusi tepat utk masalahnya
sendiri. ***Dossier ini bukan revisi §pendahulu, tapi bab lanjutannya.***

## 2. TEMUAN YANG MEMICU DOSSIER INI (fakta, terverifikasi dari kode+konten)

### 2a. Skala masalah (dihitung langsung dari `PACK`, 2026-07-05)

Distribusi jumlah topik wajib per kasus (67 kasus poli total):
**1×2 · 2×9 · 3×24 · 4×30 · 5×2.** Artinya **32 dari 67 kasus (48%)** py
`edukasiWajib.length > KAPASITAS_EDUKASI(3)` — HAMPIR SEPARUH konten, jauh
lebih luas dari yang diasumsikan dossier pendahulu ("kasus komorbid", tersirat
minoritas kecil).

### 2b. Tiga contoh konkret yang lolos audit CODEX (2026-07-05, dua ronde
berbeda, keduanya independen menemukan kelas masalah yang sama):

| Kasus | Wajib (4-5 topik) | Bisa di-skip demi skor 100 | Kenapa itu masalah |
|---|---|---|---|
| `dengue_df` | tanda_bahaya, psn_3m, cairan_oralit, kompres_demam, istirahat_cukup | **tanda_bahaya** | `konsekuensi.narasi` kasus ini SENDIRI: *"melewatkan edukasi tanda bahaya dapat berujung perdarahan atau syok dengue (DSS) yang mengancam jiwa"* — kasus sendiri menandai ini sbg konsekuensi PALING serius, tapi mekanik skor tak membedakannya dari kompres demam. |
| `tb_paru` | minum_oat_tuntas, etika_batuk, kontrol_rutin, kepatuhan_obat | **minum_oat_tuntas** | Inti program DOTS nasional; putus OAT → TB resisten obat (TB-RO), penularan balita serumah. `kepatuhan_obat` (generik) BISA menggantikannya scr formula walau tak sama presisinya scr konten. |
| `diare_akut_anak` | tanda_bahaya, psn_3m*, cairan_oralit, kompres_demam | **cairan_oralit** (atau tanda_bahaya) | Rehidrasi ATAU pengenalan dehidrasi berat adalah INTI tata laksana diare anak (WHO) — bisa di-skip demi kompres_demam yang sekadar kenyamanan. |

*(psn_3m dipakai lintas kasus infeksi vektor — kemungkinan salah tempel di draft
audit CODEX, tak memengaruhi argumen inti.)*

### 2c. Kenapa ini bukan cuma "kosmetik 10% bobot" (dossier pendahulu §2b poin 4)

`BOBOT_EDUKASI = 0.1` (skor encounter) TERLIHAT kecil, TAPI `skorEdukasi ≥ 50`
adalah salah satu dari 4 syarat `rmLengkap` (rekam medis lengkap, `clinic.ts`),
yang menentukan `state.akreditasi` (D60), yang lalu masuk dimensi **Manajemen**
`hitungSkor` (`efekAkreditasi`). Jadi menggelembungkan skorEdukasi via
"skip topik kritis, isi slot dgn yang gampang" TIDAK BERHENTI di angka edukasi
itu sendiri — merembet ke penilaian rekam-medis dan Manajemen. Efek
cross-cutting, bukan noise terisolasi.

## 3. PRINSIP & KEPUTUSAN LAMA YANG MENGIKAT (konsistensi!)

1. **KAPASITAS_EDUKASI=3 TETAP** (anti "4 topik sakti", §1) — solusi apa pun
   TIDAK BOLEH menghapus baki 3-slot scr umum; masalahnya spesifik pada kasus
   wajib>3, bukan mekanik baki itu sendiri.
2. **Tanpa feedback instan per aksi** — centang topik tidak boleh langsung
   bilang benar/salah SAAT dipilih. (Tapi: apakah larangan ini berlaku jg utk
   DEBRIEF pasca-encounter, yang SUDAH menampilkan clue EBM & rincian skor per
   dimensi? Preseden `PanelHasil.tsx` sudah menunjukkan skor per-dimensi +
   clue teks bebas post-hoc — jadi "no instant feedback" secara historis
   berarti "no feedback DURING pemilihan", bukan "no feedback ever".)
3. **Engine murni + action-log**: `TAMBAH_EDUKASI` tercatat action-log; M6
   verifier me-replay & membandingkan `skorEdukasi` hasil replay vs klaim
   dossier. **Perubahan formula skor = WAJIB `REVISI_ENGINE` bump** (dossier
   lama dgn jejak yang kebetulan skip topik kritis akan mereplay ke skor
   BEDA dari yang tercatat → verifier HARUS jatuh ke "tidak dapat
   diverifikasi", bukan "tidak sah" — pola established, lihat riwayat rev
   1-12 di `verifikasi.ts`).
4. **Preseden pola serupa SUDAH ADA di engine, tak perlu diciptakan baru**:
   `clinic.ts:440` — `if (!enc.vitalDiukur) skorPemeriksaan = Math.min(
   skorPemeriksaan, 50)`. Elemen wajib yang hilang MEMBATASI ceiling dimensi
   itu ke 50, TERLEPAS dari seberapa lengkap bagian lain. Pola "mandatory-
   element cap" ini SUDAH ada satu kelas sebelumnya (Pemeriksaan) — opsi §4
   yang mengusulkan pola serupa BUKAN mekanik baru bagi codebase ini,
   melainkan penerapan konsisten pola yang sudah divalidasi bermain baik.
5. **"Rebalance skor menunggu data playtest"** (keputusan lama, M4-M7,
   berulang kali dikutip) — prinsip umum proyek ini: JANGAN ubah instrumen
   asesmen tanpa data, KECUALI ada cacat yang sudah terbukti scr LOGIKA
   (bukan cuma "mungkin kurang optimal"). Apakah celah ini masuk kategori
   "cacat terbukti" (skip elemen paling kritis via desain formula, bisa
   dibuktikan tanpa data lapangan) atau "optimisasi menunggu data"? — Ini
   salah satu pertanyaan inti §5.
6. **Solo-dev, kurasi 32 kasus = biaya nyata.** Proyek ini py precedent kuat
   utk audit BATCH (M9.2 SKDI, M9.3 tatalaksana-vs-clue) drpd tambal reaktif
   satu-satu — tapi tiap batch py BIAYA WAKTU tinjau manual per-kasus yang
   harus dipertimbangkan vs manfaat (target deploy ~September 2026, ada
   runway, tapi tak tak-terbatas).

## 4. RUANG OPSI (peta kami — nilai, gabung, atau tolak; usulkan yang lebih baik)

**O1 — "Topik Kritis" bertingkat (rekomendasi condong kami):** field baru
OPSIONAL `edukasiKritis?: string[]` (subset dari `tatalaksana.edukasi`) —
menandai topik yang TAK BOLEH dilewatkan utk kasus INI secara spesifik. Kalau
`edukasiKritis` terisi & ADA topik kritis yang tak dipilih → `skorEdukasi`
di-cap ke ceiling (mis. 50, MENIRU pola `vitalDiukur` §3.4 persis), berapa pun
cakupan topik lain. Topik kritis TETAP masuk hitungan baki 3-slot (tak ada
budget terpisah) — pemain rasional akan alokasikan 1 dari 3 slotnya ke topik
kritis lebih dulu, mekanik "prioritisasi dgn taruhan" persis semangat dossier
pendahulu, cuma kini bertaruh BENAR. **Biaya konten: SPARSE & OPSIONAL** — dari
32 kasus wajib>3, KEMUNGKINAN tak semua 32 butuh tag ini (kasus yang topiknya
memang setara-bobot dibiarkan apa adanya, field `undefined`). Perlu tinjau
manual per-kasus (biaya nyata, tapi terarah — bukan re-tulis 32 kasus, cuma
TAG 1(-2) topik pada kasus yang genuinely py "must-not-skip").

**O2 — Skor berbobot (weighted), bukan biner kritis/tidak:** tiap topik di
`edukasiWajib` py angka bobot (mis. 1-3), `skorEdukasi` = cakupan-berbobot
bukan cakupan-hitung. Lebih presisi/gradual (tak ada tebing keras spt O1),
TAPI: (a) authoring 32 kasus × bobot per topik jauh lebih berat & rawan
inkonsistensi antar-kasus (bobot "3" di satu kasus vs kasus lain relatif thd
apa?) drpd tag biner "kritis/bukan"; (b) debrief harus menjelaskan skor
pecahan berbobot ke pemain — lebih sulit dibuat *terasa adil & jelas* drpd
"kamu lewatkan topik kritis: [nama], ceiling 50" yang lugas.

**O3 — Naikkan `KAPASITAS_EDUKASI` scr dinamis** (`min(4-5, |wajib|)` bukan
hard 3): murah, TAPI tak menyelesaikan akar masalah (kasus wajib=5 masih bisa
skip 1 topik apa saja demi 100) — cuma menaikkan ambang tanpa membedakan mana
yang TAK-BOLEH-dilewat. Bisa jadi PELENGKAP O1 (baki sedikit lebih longgar utk
kasus 4-5 topik) tapi bukan pengganti.

**O4 — Kasus tertentu "tanpa batas" (bypass KAPASITAS_EDUKASI utk daftar
kasus tertagih):** kasus yang ditag (mis. `edukasiTanpaBatas?: boolean`)
mewajibkan SEMUA topik wajib-nya (kembali ke coverage-set lama, TANPA baki).
Lebih simpel drpd O1 (tak perlu tag PER-TOPIK, cuma per-kasus), TAPI: utk
kasus wajib=5 ini scr efektif membalikkan sebagian keputusan anti-shotgun
dossier pendahulu utk kasus itu spesifik — apakah itu dapat diterima kalau
scope-nya SEMPIT (cuma kasus bertag, bukan global)?

**O5 — Biarkan, tunggu data playtest** (opsi "jangan dikerjakan" yang jujur):
mengingat §3.5 (prinsip rebalance-tunggu-data) & biaya kurasi 32 kasus (§3.6)
— apakah celah ini SUDAH cukup terbukti scr logika (tabel §2b menunjukkan
bukti konkret, bukan spekulasi) utk melangkahi prinsip "tunggu data", atau
haruskah ini masuk antrian "setelah playtest 5-10 mahasiswa" bersama item
rebalance lain yang SUDAH ditunda (SUSPEK/IGD)?

**O6 — Sinyal UI pendamping (BUKAN pengganti mekanik skor, pelengkap O1):**
kalau O1 diterima, apakah debrief (`PanelHasil.tsx`, sudah menampilkan clue
EBM per-encounter) SEHARUSNYA eksplisit menyebut "kamu melewatkan topik
kritis: tanda bahaya dengue — [alasan klinis]" ketika ceiling 50 terpicu?
Atau biarkan SENYAP (pemain cuma lihat skor rendah + clue umum, harus
menyimpulkan sendiri) demi konsistensi §3.2 (tanpa feedback instan)?

**Kombinasi yang kami condongi (bantah bila keliru): O1 (mekanik) + O6
(transparansi debrief, bukan real-time) + tinjau manual ~10-15 dari 32 kasus
(bukan semua 32 — prioritaskan yang py 1 topik jelas "keselamatan jiwa/
kepatuhan-kritis" spt 3 contoh §2b) sebagai batch pertama, sisanya dibiarkan
apa adanya (field kosong = perilaku lama, tak berubah) sampai ditinjau lagi.**

## 5. PERTANYAAN STRATEGIS (jawab bernomor, tegas, dengan alasan)

**Q1 — Mekanik inti.** O1 (kritis biner + cap-50, meniru pola `vitalDiukur`)
vs O2 (berbobot) vs O3/O4 (ubah baki, bukan tambah tingkatan) — mana yang
PALING konsisten dgn bahasa desain game ini (kartu/deck/stempel, bukan
spreadsheet), PALING mudah dijelaskan ke mahasiswa di debrief, dan PALING
murah dikelola solo-dev jangka panjang (kasus baru ke depan)?

**Q2 — Ambang "cukup terbukti tanpa data" (§3.5 vs §4 O5).** Tabel §2b
(3 kasus, tiap satu py `konsekuensi.narasi` yang SECARA EKSPLISIT menyebut
taruhan-nyawa/resistensi-obat dari topik yang bisa di-skip) — apakah bukti
SEPERTI INI (argumen logis+tekstual dari konten sendiri, bukan data
lapangan) cukup utk melangkahi prinsip "tunggu playtest", ATAU haruskah kami
tetap menunggu? Beri kriteria operasional (bukan cuma jawaban kasus ini) utk
kapan "logika kuat" boleh mendahului "data lapangan" di proyek asesmen ini.

**Q3 — Skala kurasi konten.** 32 dari 67 kasus py wajib>3 — apakah SEMUA
perlu ditinjau sebelum fix ini "selesai", atau batch bertahap (mis. 10-15
kasus prioritas-tinggi dulu, field kosong = aman utk sisanya) adalah
pendekatan yang SAH secara metodologis (bukan "setengah kerja"), mengingat
kasus tanpa tag `edukasiKritis` berperilaku IDENTIK dgn hari ini (tak ada
regresi, cuma belum dapat manfaat perbaikan)?

**Q4 — Transparansi debrief (O6).** Menyebut eksplisit topik kritis yang
terlewat di debrief pasca-encounter — apakah ini scaffolding pedagogis yang
sehat (konsisten preseden `PanelHasil` sudah menampilkan skor+clue post-hoc),
atau risiko "menyuap jawaban ronde berikutnya" (mahasiswa main kasus SAMA
lagi di playthrough lain lalu tahu pola)? Preseden anti-bocor dossier
pendahulu (§3 poin 1 di sana) soal ini spesifik ke SAAT PEMILIHAN
(during-play) — apakah prinsip yang sama berlaku ketat utk POST-HOC debrief,
atau beda kelas?

**Q5 — Interaksi dgn dimensi lain.** Pola cap-ceiling `vitalDiukur→
skorPemeriksaan` sudah ada; usul dossier ini menambah `edukasiKritis→
skorEdukasi`. Apakah pola "elemen wajib hilang → cap dimensi" ini
SEHARUSNYA jadi prinsip resmi proyek diterapkan konsisten ke SEMUA 4 dimensi
SOAP (anamnesis esensial sudah py logikanya sendiri; terapi/obatBenar —
apakah ADA "obat paling kritis" yang analog perlu ditandai jg?), atau cukup
scoped ke edukasi saja utk sekarang (risiko: pola tambal lokal lagi, spt
yang dikritik dossier pendahulu §Q6)?

**Q6 — Urutan & REVISI_ENGINE.** Kapan fix ini masuk jadwal — sekarang
(sebelum M10 audit lain lanjut, sbg bagian dari hasil M10), atau ditumpuk
jadi SATU rilis REVISI_ENGINE bareng temuan M10 lain yang mungkin muncul
(hemat berapa kali bump)? Apakah ada risiko menunda (mis. makin banyak
jejak/dossier mahasiswa lama terakumulasi dgn semantik skor lama, makin
banyak yang jatuh "tidak dapat diverifikasi" saat rev naik nanti)?

## 6. FORMAT OUTPUT YANG DIMINTA

1. **Verdikt per Q1–Q6** — bernomor, tegas (pilih, jangan "tergantung"), alasan
   ≤1 paragraf per verdikt, sebut trade-off yang kamu korbankan.
2. **Paket rekomendasi final** — komposisi opsi (O1–O6 / gabungan / opsi
   barumu), dgn: (a) rumus konkret pengganti/tambahan, (b) field kontrak baru
   (kalau ada) beserta tipe TypeScript-nya, (c) daftar kasus prioritas batch
   pertama kalau Q3 memilih bertahap (boleh pakai 3 contoh §2b sbg starting
   point + tambahkan kandidat lain yang kamu lihat dari data §2a).
3. **Risiko tertinggi** yang kami belum sadari dari rekomendasimu (steelman
   serangan terhadap dirimu sendiri) — khususnya soal fairness antar-
   mahasiswa (paket ujian berbeda py kasus berbeda; apakah distribusi
   kasus-berkritis-topik merata antar 8 paket ujian `paketUjian.ts`?).
4. Cara migrasi test/action-log/REVISI_ENGINE (ringkas, bukan kode).
5. Singkat > lengkap-basa-basi. Bahasa Indonesia. Jangan tulis kode.

## 7. LAMPIRAN — RUJUKAN FILE (untuk verifikasi klaim kami)

- Formula skor: `src/engine/clinic.ts` baris 541-554 (`skorEdukasi`), baris
  56 (`BOBOT_EDUKASI=0.1`), baris 64 (`KAPASITAS_EDUKASI=3`), baris 440
  (preseden pola cap `vitalDiukur→skorPemeriksaan`).
- Kontrak: `src/content/types.ts` `Tatalaksana` (baris ~98-116) — tempat
  `edukasiKritis?` akan ditambahkan bila O1 diterima.
- Verifier & REVISI_ENGINE: `src/engine/verifikasi.ts` (riwayat rev 1-12,
  pola "tidak dapat diverifikasi" utk dossier lama pasca-perubahan semantik).
- Rekam medis lengkap → akreditasi → Manajemen: `clinic.ts` (`rmLengkap`),
  `reducer.ts` (akreditasi D60), `scoring.ts` (`efekAkreditasi`).
- 3 contoh konkret: `src/content/kasus/kasusInfeksi.ts` (`dengue_df` mulai
  baris 251, `diare_akut_anak` mulai baris 476, `tb_paru` mulai baris 588).
- Brief M10 (konteks audit yang memicu dossier ini): `docs/M10_AUDIT_BRIEF.md`.
- Riwayat lengkap temuan & keputusan sesi ini: `docs/CODEX_AUDIT_DOSSIER.md`
  §33 (temuan awal), §36 (konfirmasi + 3 contoh CODEX ronde M10 pertama).
- Dossier pendahulu (WAJIB dibaca lebih dulu): `docs/DEEPTHINK_EDUKASI_UX.md`.
