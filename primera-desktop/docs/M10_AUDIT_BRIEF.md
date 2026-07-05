# M10 — Audit Brief untuk CODEX: Konsistensi Pipeline Penyakit, Jembatan UKP↔UKM, dan Status NPC/Warga

**Status dokumen:** brief kerja, ditulis SEBELUM audit dijalankan (pola sama M6/M45 — desain dulu, baru eksekusi).
**Ditulis:** 2026-07-05. **Untuk:** ronde audit CODEX berikutnya, read-only, laporkan kembali ke Claude untuk ditriase.
**Konteks lengkap:** `docs/CODEX_AUDIT_DOSSIER.md` §1-35 (jangan lewati §"Yang SUDAH ditutup / DO NOT RE-REPORT" di bawah — bagian terpenting dokumen ini agar audit tidak mengulang temuan lama).

---

## 1. Kenapa M10 ada

M9 (docs §28-30) berhasil menutup pola bug berulang di SATU klaster (kunci tutorial, linking SKDI/ICD, tatalaksana-vs-obat). Tapi tiga ronde audit SETELAHNYA (§31, §33, plus dua bug live ditemukan lewat gameplay sungguhan di §34-35) terus menemukan kelas bug BARU — bukan pola lama muncul lagi, tapi sudut-sudut yang belum pernah diperiksa dgn lensa yang tepat (verifier completeness, ekonomi tindakan, katalog near-duplicate).

User (2026-07-05) mendefinisikan M10 secara eksplisit: **bukan** mencari 1-2 bug lagi, tapi **audit sistematis menyeluruh** atas tiga sumbu:

1. **Konsistensi pipeline penyakit** — pemeriksaan → diagnosis → tatalaksana → edukasi, end-to-end, utk SEMUA 67 kasus playable, bukan cuma satu tahap.
2. **Integritas jembatan UKP ↔ UKM** — apakah interaksi klinik (poli) dan program komunitas (kunjungan rumah/kader/RW/posyandu/prolanis) saling konsisten.
3. **Konsistensi status/keberadaan NPC (warga lokal)** — apakah "orang yang sama" direpresentasikan koheren di seluruh subsistem yang bisa merujuknya.

Ini kemungkinan inisiatif solo TERBESAR di proyek ini sejauh ini. Dokumen ini dibuat SANGAT lengkap justru supaya audit bisa berjalan presisi tanpa perlu menebak-nebak arsitektur atau mengulang temuan yang sudah selesai.

---

## 2. Orientasi proyek (fakta, bukan asumsi — semua diverifikasi 2026-07-05)

### 2.1 Struktur folder relevan (root: `primera-desktop/`)

```
src/content/           — SEMUA data konten (kasus, katalog, keluarga, kader, RS, skdi144)
  ├─ types.ts          — kontrak tipe TUNGGAL utk semua konten (baca ini duluan)
  ├─ index.ts           — perakitan PACK final + auto-link skdi144↔kasus via ICD-10
  ├─ pack.ts            — validasiPack() — fail-fast drift check
  ├─ katalog.ts          — obat/lab/edukasi (batch awal)
  ├─ katalogM3.ts        — obat/lab/edukasi/tindakan (batch M3+)
  ├─ skdi144.ts          — 144 entri kompetensi FKTP wajib + link manual/auto ke kasus
  ├─ icd10.ts            — kamus nama ICD-10 (utk diagnosisBanding tanpa entri lain)
  ├─ nama.ts             — pool nama warga (NAMA_WARGA) dipakai director generate pasien acak
  ├─ igd.ts              — 5 kasus gawat darurat (KasusIgd)
  ├─ rumahSakit.ts        — 4 RS jejaring rujukan (SISRUTE)
  └─ kasus/*.ts (7 file) — 67 KasusKlinis, dikelompokkan per kategori:
       kasusInfeksi.ts · kasusKronis.ts · kasusRespGi.ts · kasusKulit.ts ·
       kasusSarafMataTht.ts · kasusMetabolikMsk.ts · kasusKiaJiwa.ts
  └─ keluarga/desaA-F.ts  — 16 KeluargaBinaan (UKM), + kader/RW profil di desaB.ts

src/engine/            — SEMUA logika, murni TypeScript, TANPA React/DOM
  ├─ state.ts           — GameState, EncounterState, semua tipe runtime
  ├─ actions.ts          — union Action (semua aksi pemain)
  ├─ reducer.ts          — advance(state, action, pack) — SATU-SATUNYA titik mutasi state
  ├─ clinic.ts           — aksiKlinik/nilaiEncounter — logika encounter poli + skoring
  ├─ scoring.ts          — hitungSkor — 4 dimensi (UKP/UKM/Manajemen/Resiliensi)
  ├─ director.ts         — buatPasienDariKasus, susunAntrianHarian — generator pasien
  ├─ kunjungan.ts         — logika kunjungan rumah (4 babak) + terapkanHasil
  ├─ kader.ts            — prosesHarianKader — kader mengumpulkan data IKS per RW
  ├─ kegiatan.ts          — posyandu/prolanis/KLB (program UKM terjadwal)
  ├─ igd.ts              — logika encounter IGD (turn-based, stabilitas)
  ├─ surveilans.ts        — kasusMenular, hitungCluster (KLB)
  ├─ badge.ts            — 9 badge lintas-playthrough
  ├─ verifikasi.ts        — dossier mahasiswa + replay verifier (M6)
  ├─ init.ts             — buildInitialState — SEMUA state awal dirakit di sini
  └─ tutorial.ts         — konstanta KASUS_TUTORIAL + target sorotan per-Deck

src/renderer/src/screens/  — UI React
  ├─ klinik/             — Klinik.tsx + 5 Deck (Anamnesis/Pemeriksaan/Diagnosis/Terapi/Disposisi)
  ├─ Kunjungan.tsx        — layar kunjungan rumah
  ├─ Kegiatan.tsx         — layar posyandu/prolanis/KLB
  ├─ PetaDesa.tsx         — peta choropleth 8 RW (visual UKM)
  ├─ Igd.tsx             — layar IGD
  ├─ DexSkdi.tsx          — Buku Saku (Leitner 144 kompetensi)
  ├─ Rapor.tsx           — laporan 4 dimensi
  └─ MejaKerja.tsx        — inbox + hub navigasi harian
```

### 2.2 Statistik konten (dihitung langsung dari `PACK` — bukan estimasi)

| Kategori | Jumlah |
|---|---|
| Kasus klinis playable | **67** |
| Keluarga binaan (UKM) | **16** (di 6 desa A-F, 2/RW) |
| Kader | 8 · RW | 8 |
| Obat | 97 · Lab | 23 · Edukasi | 39 · Tindakan | 8 |
| Kasus IGD | 5 · Rumah Sakit jejaring | 4 |
| Entri SKDI-144 | 144 (TEPAT, terverifikasi ulang M9.2) — **46 tertaut** ke kasus |
| Kasus `harusDirujuk: true` | 12 |
| Kasus dgn `konsekuensi` (arc follow-up) | 57 |
| Kasus dgn `alergiTrap` | 6 |
| Kasus dgn `tatalaksana.prosedur` | 4 (BPPV→Epley, serumen→irigasi, epistaksis→tampon, PPOK→nebulisasi) |

### 2.3 Istilah domain (agar tak salah tafsir)

- **UKP** (Upaya Kesehatan Perseorangan) = layar Klinik/poli — encounter 1 dokter-1 pasien, SOAP, skor per-kasus.
- **UKM** (Upaya Kesehatan Masyarakat) = kunjungan rumah + kader + program wilayah (posyandu/prolanis/KLB) + peta IKS 8 RW.
- **IKS** = Indeks Keluarga Sehat, dihitung dari 12 indikator PIS-PK per keluarga → agregat per RW → memengaruhi pengali kapitasi KBK.
- **Karma** = mekanisme SATU-SATUNYA yang secara eksplisit menjembatani UKM→UKP: keluarga yang diabaikan (kunjungan tak berhasil) memicu anggota keluarganya JATUH SAKIT dan muncul sbg pasien klinik/IGD bernama (lihat §4.2 di bawah — detail lengkap + pertanyaan audit spesifik).
- **PRB** = Program Rujuk Balik — pasien yang dirujuk lalu stabil, kontrol balik ke FKTP dgn status `prb: true`.
- **Dex/SKDI144** = Buku Saku Leitner — tracker penguasaan 144 kompetensi wajib, ditautkan via ICD-10 match atau manual `kasusId` di `skdi144.ts`.
- **Tutorial (`tutorialAktif`)** = pasien PERTAMA tiap stase baru dipaksa jadi `ispa_common_cold` (KASUS_TUTORIAL), kebal skor SEPENUHNYA by design (DeepThink "onboarding railroaded", keputusan user) — **BUKAN bug**, lihat §5.

---

## 3. SUMBU A — Konsistensi pipeline penyakit (pemeriksaan→diagnosis→tatalaksana→edukasi)

Untuk **SETIAP** dari 67 kasus, periksa RANTAI PENUH berikut sbg SATU kesatuan naratif klinis — bukan tiap field diperiksa terisolasi:

### A.1 — Internal per-kasus (baca `clue` dulu sbg "niat penulis", lalu cocokkan tiap field ke niat itu)

1. **`clue` vs `tatalaksana.obatBenar`/`obatAlternatif`** — apakah SEMUA obat yang clue sebut sbg "lini pertama"/"pilihan" punya slot yg bisa dipilih pemain? (M9.3 sudah sapu ini dgn heuristik kata kunci antibiotik/steroid-sistemik/rujuk-kuat — TAPI itu cuma 3 kata kunci; kasus lain bisa py klaim serupa dgn kata kunci beda, mis. "insulin", "oksigen", "cairan IV", dll — jangan asumsikan M9.3 exhaustive).
2. **`clue` vs `tatalaksana.edukasi`** — SUMBU INI BELUM PERNAH DISAPU SISTEMATIS (M9.3 hanya cek obat). Contoh nyata yg SUDAH ditemukan & diperbaiki manual (bukan lewat sapuan): `kia_kb_konseling` (topik generik tak menyentuh pemilihan metode KB — lihat dossier bagian akhir), `mm_gagal_jantung_kongestif` (topik `minum_air_cukup` justru KEBALIKAN dari kebutuhan CHF/restriksi cairan). **Periksa SEMUA 67 kasus**: apakah tiap topik `tatalaksana.edukasi` benar-benar relevan & TIDAK bertentangan dgn clue kasusnya (cross-check nama+sinonim topik vs isi clue), bukan cuma "ada 2-4 topik apa saja".
3. **`edukasiWajib.length` vs `KAPASITAS_EDUKASI` (3)** — utk kasus dgn >3 topik wajib, formula `edukasiTarget=min(3,|wajib|)` (clinic.ts:549) mengizinkan skor penuh dari topik MANA SAJA, termasuk melewatkan yg paling kritis. **32 dari 67 kasus (48%) py wajib>3** — ini sudah dikonfirmasi (dossier §33), TAPI belum ada keputusan/fix. Audit ini: identifikasi PER-KASUS topik mana yg secara klinis "tidak boleh dilewatkan" (mis. tanda bahaya dengue, kepatuhan OAT TB) vs "suportif" (istirahat, kompres) — laporkan per-kasus, bukan cuma jumlah total.
4. **`diagnosisBanding` vs opsi yg tersedia** — apakah ICD-10 di `diagnosisBanding` benar2 punya nama yg bisa di-resolve (skdi144/icd10.ts/kasus lain)? (Sudah dijaga test `pack.test.ts` — TAPI cek apakah ada ICD baru yg lolos krn kebetulan match sesuatu yg tak relevan.)
5. **`pemeriksaanFisik`/`lab` vs `clue`** — apakah temuan fisik & hasil lab yg `relevan:true` benar2 mendukung diagnosis yg dimaksud clue? Apakah ada region/lab `relevan:false` yg SEHARUSNYA relevan (atau sebaliknya)?
6. **`vital` vs `demografi` vs kasus** — apakah tanda vital masuk akal utk rentang usia `demografi.usiaMin/usiaMax`? (mis. nadi bayi vs dewasa beda rentang normal — kasus lansia dgn takikardia ekstrem tanpa penjelasan?)
7. **`harusDirujuk` vs `skdi`** — cek KONSISTENSI internal (independen dari isu dokumen eksternal §26/§30 yg sudah OPEN): kasus `skdi:'4A'` SEHARUSNYA `harusDirujuk:false` (4A = tuntas FKTP), kasus `skdi:'3B'` SEHARUSNYA `harusDirujuk:true` (3B = stabilisasi-rujuk). Laporkan kasus manapun yg field-nya SALING KONTRADIKTIF (bukan soal dokumen eksternal — ini murni logika internal 2 field).
8. **`alergiTrap` (6 kasus) vs jalur pertanyaan** — sudah dijaga test (`pack.test.ts`, kasus ber-alergiTrap wajib py pertanyaan anamnesis bertext "alergi") — TAPI cek apakah `obatTerlarang` di trap benar2 anggota `obatBenar`/`obatAlternatif` kasus itu (kalau trap melarang obat yg TAK PERNAH jadi pilihan benar, trap itu tak berdampak/mati).
9. **`konsekuensi` (57 kasus)** — apakah `narasi`/`kondisiKembali` konsisten dgn apa yg SEBENARNYA terjadi bila tatalaksana salah (baca ulang formula skor terkait)? Apakah `kembaliHariMin/Max` masuk akal utk jenis penyakit (infeksi akut kembali dlm hari, kronis dlm minggu)?
10. **Variasi persona (`anamnesis[].variasi`)** — apakah SEMUA 6 persona (polos/terpelajar/skeptis/cemas/lansia/wali_anak) konsisten scr FAKTA KLINIS (cuma beda gaya bahasa, bukan beda substansi jawaban) dgn `jawab` baku? (Guard `bahasaPasien.test.ts` sudah cek jargon-leak, TAPI belum tentu cek konsistensi FAKTA lintas-persona.)

### A.2 — Lintas-kasus (perbandingan, bukan per-kasus tunggal)

11. **Katalog near-duplicate** (obat/lab/edukasi/tindakan) — pola PERSIS yg baru ditemukan di lab (`asam_urat` vs `asam_urat_darah`, `mikroskopis_bta` vs `bta_sputum`, sudah diperbaiki dossier bagian akhir) — **BELUM disapu utk katalog OBAT (97 entri) & EDUKASI (39 entri)**. Cari nama yg nyaris identik merepresentasikan konsep klinis SAMA dgn ID/nama berbeda tipis, terutama yg salah satunya YATIM (tak dipakai kasus manapun — orphan entry = jebakan tanpa manfaat).
12. **`cocokObat`/`cocokLab`/`cocokEdukasi` (util.ts)** — konfirmasi: fungsi pencocokan pencarian formularium mencocokkan query thd `id` JUGA (bukan cuma `nama`/`sinonim`). Entri manapun yg `id`-nya mengandung substring nama penyakit/tes lain (spt kasus `mikroskopis_bta` mengandung "bta") berisiko nyangkut di pencarian yg tak relevan. Audit SEMUA id katalog utk pola serupa.
13. **Prevalensi vs pembobotan director** — 67 kasus py `prevalensi: 'tinggi'|'sedang'|'rendah'` (bobot ×3/×1.5/×0.6). Apakah distribusi ini realistis (top-20 diagnosis ≈80% kunjungan, guardrail KONTEN_BALANCE #1)? Apakah ada kasus `prevalensi` tak diisi (default sedang) yg SEHARUSNYA eksplisit tinggi/rendah?
14. **ICD-10 tabrakan lintas-kasus** — apakah ada 2 kasus BERBEDA memakai `icd10` yg SAMA (kecuali sengaja, spt kia_isk_kehamilan vs uti umum yg sudah didokumentasikan allowlist)?

---

## 4. SUMBU B — Integritas jembatan UKP ↔ UKM

### 4.1 — Mekanisme bridge yg SUDAH ada (audit apakah bekerja BENAR, bukan cari mekanisme baru)

- **Karma** (`SkenarioKunjungan.karma`, `types.ts:417-425`) — lihat §4.2, ini yg PALING penting diaudit.
- **Kader → IKS** (`kader.ts` `prosesHarianKader`) — kader py `ketelitian`(45-90) & `bias`(indikator yg salah dilaporkan) per RW. Apakah data yg masuk ke IKS desa benar2 mencerminkan `ketelitian`/`bias` kader yg bersangkutan, atau ada RW yg datanya "terlalu akurat" utk kader ber-ketelitian rendah?
- **Kapitasi KBK** (`scoring.ts` — pengali dari IKS desa) — apakah pengali kapitasi (×0.5 s.d. ×1.3 tergantung IKS) benar2 dihitung dari agregat IKS TERKINI, bukan snapshot lama?
- **PRB** — pasien rujuk-balik (`prb: true` di jadwal) — apakah status PRB konsisten dgn riwayat rujukan pasien tsb (pernah benar2 dirujuk sebelumnya utk kasus yg sama)?
- **Rekam medis lengkap → akreditasi** (`rmLengkap`) — mempengaruhi `state.akreditasi`, yg mempengaruhi dimensi Manajemen. Apakah `rmLengkap` cuma dihitung dari encounter KLINIK, atau apakah kunjungan rumah yg lengkap SOAP-nya (kalau ada konsep serupa di sana) turut dihitung? (Kemungkinan TIDAK — worth dikonfirmasi apakah ini disengaja atau lubang.)

### 4.2 — AUDIT SPESIFIK: konsistensi demografi karma (temuan baru saat menyusun brief ini, BELUM diverifikasi lebih lanjut — prioritaskan ini)

Mekanisme (dikonfirmasi kode, `init.ts:104-125` + `reducer.ts:1313-1339`):
1. Tiap `KeluargaBinaan` py `arc.kunjungan[0].karma` opsional: `{ kasusId, anggotaIndex, jatuhTempoHari, narasi }`.
2. Saat game dimulai (`buildInitialState`), SEMUA keluarga dgn karma di kunjungan pertama dijadwalkan (`jadwalKarma`) — identitas NAMA/USIA/JENIS KELAMIN diambil dari `content.anggota[karma.anggotaIndex]` (anggota keluarga SUNGGUHAN, bukan random).
3. Bila kunjungan gagal & jatuh tempo, `reducer.ts:1313` memicu `pasienKembali` — pasien klinik/IGD baru muncul dgn `nama`/`usia`/`jenisKelamin` dari anggota keluarga tsb, TAPI `kasusId` yg dipakai adalah dari `karma.kasusId` yg ditulis penulis konten.

**Pertanyaan audit KONKRET** (belum dijawab, ini PERSIS "status/being NPC" yg diminta user):
- Utk SETIAP keluarga dgn `karma` (grep `arc.kunjungan[0].karma` di `keluarga/desa*.ts`): apakah `anggota[karma.anggotaIndex].usia` masuk akal utk `pack.kasus[karma.kasusId].demografi.usiaMin/usiaMax`? (Anak umur 5 tak boleh kena kasus dgn `usiaMin:40`, dst.)
- Apakah `anggota[karma.anggotaIndex].jenisKelamin` konsisten dgn `demografi.jenisKelamin` kasus itu (kalau kasusnya spesifik gender, mis. KIA)?
- Apakah `anggotaIndex` valid (tidak out-of-bounds thd panjang array `anggota` keluarga itu)?
- Apakah `nama`/`usia`/`jenisKelamin` yg di-inject BENAR-BENAR dipakai oleh UI/engine saat encounter berjalan (telusuri `pasienKembali` sampai ke `buatPasienDariKasus`/`susunAntrianHarian` — apakah override ini konsisten dipakai, atau di titik lain malah kasusnya di-generate ulang dgn demografi RANDOM dari template, membuang identitas yg sudah di-inject)?

### 4.3 — Konsistensi kunjungan rumah vs klinik utk keluarga yg SAMA

- Apakah anggota keluarga yg PERNAH jadi pasien klinik (baik via karma maupun kebetulan director generate nama sama) tercatat/terhubung ke profil UKM keluarga itu, atau dua sistem ini buta satu sama lain di luar jalur karma?
- `AnggotaKeluarga.kondisi?: string[]` (`types.ts:311`, "id kasus/kondisi kronis") — apakah field ini benar2 dipakai di mana pun runtime, atau cuma metadata naratif yg tak disentuh logika? Kalau dipakai: apakah kondisi yg tercantum konsisten dgn kasus yg pernah/akan dialami anggota itu?

---

## 5. SUMBU C — Konsistensi status/keberadaan NPC (warga lokal)

Berbeda dari §4 (yg fokus pada BRIDGE mekanisme), sumbu ini fokus pada IDENTITAS itu sendiri — apakah "satu orang" tetap satu orang yg koheren di seluruh sistem yg bisa merujuknya.

1. **Pool nama terpisah** — `NAMA_WARGA` (nama.ts, dipakai director generate pasien klinik ACAK) vs nama anggota `KeluargaBinaan` (ditulis manual per-keluarga) — apakah ini SENGAJA dua pool terpisah (populasi klinik acak ≠ 16 keluarga binaan bernama, By design krn keluarga binaan memang subset kecil warga terlacak)? Konfirmasi ini bukan bug, tapi DOKUMENTASIKAN eksplisit kalau belum ada penjelasannya di kode/dok manapun — audit berikutnya akan menanyakan hal sama.
2. **IGD vs klinik vs kunjungan — pool identitas terpisah?** — 5 `KasusIgd` py demografi sendiri (bukan terhubung `KasusKlinis` manapun secara eksplisit kecuali kebetulan `icd10` sama). Apakah pasien IGD PERNAH merujuk pada keluarga binaan yg sama (selain via karma_igd yg sudah dibahas §4.2)? Kalau tidak pernah, apakah itu peluang desain M11 (bukan bug M10) atau memang arsitektur yg disengaja terpisah?
3. **Kader sbg NPC** — `KaderProfil` (nama, rw, ketelitian, bias, persona) — apakah kader ini PERNAH muncul sbg karakter di narasi lain (surat, dialog kunjungan), atau murni angka statistik tanpa "keberadaan" naratif? (Bukan bug, tapi relevan utk "being" yg ditanya user — laporkan sbg observasi.)
4. **Dex/SKDI progress vs kasus yg BENAR-benar dimainkan** — `dex[kasus.id]` di-update saat encounter selesai (`ditangani`/`benar`/`bintang`). Apakah ada jalur (auto-resolve pasien terlewat, karma, dll) yg SEHARUSNYA meng-update dex tapi tidak (mis. pasien auto-bermasalah yg dijadwalkan ulang lalu ditangani — apakah encounter KEDUA ini konsisten diberi kredit dex yg sama seperti encounter normal)?
5. **`namaWarga` dipakai di IGD/kunjungan/klinik** — konfirmasi TIDAK ADA dua entitas aktif SEKALIGUS dgn nama sama yg membingungkan pemain (mis. pasien klinik hari ini bernama "Ibu Wulan" DAN keluarga binaan "Bu Wulan" aktif kunjungan hari yg sama, padahal beda orang) — cek apakah ada guard anti-tabrakan nama, atau ini murni untung-untungan RNG.

---

## 6. Yang SUDAH ditutup — **DO NOT RE-REPORT** (baca dulu sebelum lapor apa pun)

Berikut daftar temuan yg SUDAH diperiksa & diputuskan (fixed/stale/rejected) di ronde-ronde sebelumnya. Kalau audit menemukan hal yg PERSIS ini lagi, itu artinya audit membaca snapshot/state LAMA — verifikasi ulang thd kode TERKINI dulu sebelum melaporkan sbg temuan baru.

- **Tutorial (`tutorialAktif`) kebal skor sepenuhnya** — BY DESIGN (DeepThink "onboarding railroaded"), termasuk di mode ujian (`biarkan seragam`, keputusan user §25). BUKAN bug.
- **`clue` vs `konsekuensi.guideline`** — model dua-lapis SENGAJA (`clue` wajib-universal, `konsekuensi` opsional-hanya-kasus-berarc). Kasus tanpa `konsekuensi` TIDAK berarti kekurangan EBM.
- **5 kasus self-report `skdi`/`fktp144` tak cocok dokumen resmi** (`kulit_dermatitis_kontak`, `tht_rinosinusitis_akut`, `mm_osteoartritis_lutut`, `jiwa_gangguan_cemas`, `jiwa_depresi_ringan`) — SUDAH diverifikasi berkali-kali (§26/§30/§31/§35) thd SKDI 2012 Lampiran-3 & Kepmenkes 1186/2022. Ini KEPUTUSAN KURIKULUM terbuka (apakah field kasus perlu dikoreksi), BUKAN linking bug — kalau ingin diusulkan lagi, WAJIB hitung ULANG exact count thd sumber otoritatif yg SAMA (jangan infer dari dokumen berbeda meski saling mengutip — pelajaran mahal sesi ini, lihat §30).
- **`dispepsia_fungsional`/`mm_low_back_pain`/`mm_mialgia`** — kemungkinan Daftar Masalah bukan Daftar Penyakit, sudah diverifikasi tak ada di Lampiran-3 SKDI 2012.
- **`kia_kb_konseling`** — masuk Daftar Keterampilan Klinis, bukan Daftar Penyakit — correctly excluded dari SKDI144 linking (tapi topik edukasinya SUDAH diperbaiki, lihat sumbu A.1 #2).
- **`mata_konjungtivitis_alergi`** — SKDI 2012 cuma py SATU entri generik "Konjungtivitis" (4A), sudah diklaim `conjunctivitis_bacterial`. Arsitektur skdi144 tak mendukung 2 kasus/1 entri — correctly excluded, bukan bug.
- **Duplikat ICD di skdi144.ts** (`N76.0`, `B35.0`, `S00-S09`) — didokumentasikan sengaja via allowlist `GENERIK_SENGAJA`/`ICD_DUPLIKAT_SENGAJA` di `pack.test.ts`. Sudah dijaga test — jangan re-flag kecuali menemukan duplikat BARU yg belum ada di allowlist.
- **`obatAlternatif` "pilih salah satu"** — TIDAK menghukum monoterapi benar, TIDAK menghadiahi polifarmasi (audit penuh konten nyata sudah dilakukan, nol instance exploitable).
- **`rasioTerapi=1` saat `totalSlot=0`** (kasus tanpa obat/prosedur wajib) — BENAR by design (obat di luar rencana tetap dihukum independen dari totalSlot). SUDAH diverifikasi individual utk `stroke_iskemik`, `mm_obesitas`, `kia_abortus_iminens`, `jiwa_depresi_ringan`, `jiwa_insomnia` — semua manajemen non-farmakologis yg memang lini-pertama EBM. (`kia_kb_konseling` & `mm_gagal_jantung_kongestif` SUDAH diperbaiki krn topik edukasinya salah, bukan krn totalSlot=0-nya.)
- **SUSPEK/TEGAK breakeven 80% akurasi** — kalibrasi epistemik disengaja, bukan subsidi-kepengecutan.
- **Cowboy penalty, save-scumming telemetry, jawaban-shuffle rngFlavor** — sudah diputuskan & diimplementasikan (DeepThink ronde-2, docs §21).
- **Badge verifier, PanelHasil aria-hidden, tatalaksanaClue negasi, tindakan billing, sidikJariPack tindakan, katalog lab asam_urat/mikroskopis_bta, tutorial scroll** — SEMUA sudah fixed (docs §31/§33/§34/§35). Jangan re-flag kecuali menemukan REGRESI (fix-nya rusak lagi).
- **`fktp144` (field per-kasus)** — TAK dipakai runtime manapun, murni metadata dokumentasi (dikonfirmasi grep, nol referensi di luar fixture test). Linking Dex/144 SESUNGGUHNYA dikendalikan `skdi144.ts`, independen total dari field ini. Sudah dijaga konsistensi internal (fktp144:true hanya utk skdi:4A).
- **Path lama `primer-desktop`/`primer-arena`** (sebelum rebrand PRIMERA) — kalau laporan audit menyebut path ini, itu SINYAL snapshot lama/stale — verifikasi ulang thd path `primera-desktop`/`primera-arena` saat ini.

---

## 7. Format laporan yang diminta

Agar triase efisien (dan tidak mengulang siklus "CODEX lapor mentah → Claude verifikasi ulang dari nol" berkali-kali spt ronde-ronde sebelumnya), tiap temuan WAJIB menyertakan:

1. **File:baris** persis (bukan cuma nama file).
2. **Kutipan kode/konten** yg relevan (2-5 baris cukup).
3. **Klaim spesifik** — apa yg salah/tak konsisten, dalam SATU kalimat.
4. **Bukti/reasoning** — kenapa ini masalah (bukan cuma "kelihatan aneh") — kalau memungkinkan, tunjukkan skenario konkret (mis. "kasus X + pilihan Y menghasilkan Z yg salah").
5. **Severity**: P1 (integritas skor/keamanan data mahasiswa), P2 (konten/UX salah tapi tak eksploitatif), P3 (kosmetik/dokumentasi).
6. **Cek dulu** thd §6 di atas — kalau ini SAMA/SERUPA dgn item di sana, JANGAN laporkan sbg temuan baru; kalau BERBEDA tapi berkaitan, jelaskan bedanya secara eksplisit.

Read-only — JANGAN edit/hapus file apa pun. Laporkan ke Claude utk ditriase (verifikasi thd kode aktual, test-first fix, verifikasi-bergigi, dossier update) — pola yg sama persis spt seluruh ronde sebelumnya di sesi ini.
