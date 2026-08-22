# Dosier Triangulasi DeepThink — Koding ICD-10, Desain Deck, & Tata Kelola Tanda Tangan
**Disusun:** 2026-08-22 · **Untuk:** triangulasi DeepThink · **Pemutus akhir:** dr. Anak Agung Bagus Wirayuda

---

## 0. Cara memakai dosier ini

Dosier ini memuat **7 pertanyaan terbuka** yang TIDAK diputuskan sepihak, lengkap dengan seluruh konteks yang diperlukan untuk menjawabnya tanpa membuka repo. Tiap pertanyaan menyertakan: fakta terverifikasi, argumen kedua sisi, preseden internal yang relevan, dan konsekuensi tiap pilihan.

**Yang diminta dari DeepThink:** bukan sekadar "mana yang benar", melainkan penalaran yang menimbang *ketegangan nyata* di tiap pertanyaan — karena hampir semuanya adalah benturan antara dua prinsip yang sama-sama sah, bukan benar-lawan-salah.

**Konteks produk (ringkas).** PRIMERA adalah game edukasi kedokteran Indonesia: simulasi dokter FKTP (Puskesmas) untuk mahasiswa kedokteran. Pemain menegakkan diagnosis dengan memilih satu dari beberapa opsi di "Deck Diagnosis"; **kode ICD-10 ikut tercetak di layar di sebelah nama diagnosis**, sehingga kode yang salah bukan sekadar metadata — ia materi hafalan yang terbaca berulang. Sistem koding rujukan Indonesia (Kemenkes/BPJS/SATUSEHAT) adalah **WHO ICD-10**, bukan ICD-10-CM Amerika.

**Dua struktur data yang sering bertabrakan dalam dosier ini:**
- **`skdi144`** — katalog 144 kompetensi wajib FKTP (dari KMK 1186/2022). Baris di sini adalah *kompetensi*, kadang setingkat **sindrom** ("Sindroma Duh Genital"), bukan diagnosis presisi. Namanya bertugas rangkap: judul kartu Buku Saku, `judulResmi` kurikulum, dan (dulu) label deck.
- **`kasus`** — vignette klinis yang benar-benar dimainkan, dengan fenotipe spesifik.
Keduanya ditautkan otomatis lewat kecocokan ICD-10. Ketika kasus memakai kode **lebih spesifik** daripada katalog, itu didaftarkan eksplisit di allowlist `GENERIK_SENGAJA` (pack.test.ts) — sudah ada 13 entri, mis. `vaginitis` (katalog N76.0 sindrom generik vs kasus B37.3 kandidiasis).

---

## 1. Riset yang SUDAH tuntas (bukan pertanyaan — konteks untuk menjawab yang lain)

Deep research 2026-08-22, tiap klaim diverifikasi silang ke ≥2 sumber independen (WHO ICD-10 API resmi `icd.who.int/browse10/2019`, portal Kemenkes Jerman `gesund.bund.de` untuk ICD-10-GM, `icd10data.com`/`aapc.com` untuk status ICD-10-CM). **Sudah diimplementasikan, tidak perlu ditinjau ulang:**

| Kode lama | Temuan | Diganti ke |
|---|---|---|
| `B37.9` untuk kandidiasis mulut | B37.9 = "Candidiasis, unspecified" (generik). Kandidiasis mulut = B37.0 "Candidal stomatitis" | **B37.0** |
| `B37.89` | Hanya ICD-10-CM. WHO API: anak B37.8 **kosong** — tak ada pemecahan 5-digit | **B37.8** |
| `J34.89` | Hanya ICD-10-CM. WHO: J34.8 kode terminal | **J34.8** |
| `J45.901` | Hanya ICD-10-CM (6-digit status eksaserbasi). WHO J45 hanya .0/.1/.8/.9 | **J45.9** |
| `O92.03`, `O92.13` | Hanya ICD-10-CM. **Digit ke-5 = episode waktu (laktasi), bukan lateralitas** | **O92.0**, **O92.1** |
| `E50-E56` (rentang blok) | Bukan kode diagnosis | **E53.0** "Riboflavin deficiency" |
| `E58-E61` (rentang blok) | Bukan kode diagnosis. Zinc TIDAK ada di E61.x | **E60** "Dietary zinc deficiency" |
| `S00-S09` (rentang blok) pada kasus trauma tajam | Bukan kode diagnosis | **S01.0** "Open wound of scalp" |

**Temuan struktural penting untuk pertanyaan di bawah:** WHO ICD-10 **tidak** mengkodekan mekanisme cedera (tumpul vs tajam) di blok S00-S09 sama sekali. WHO memakai desain **dua-aksis**: kode S = *sifat* cedera; kode Bab XX (V01-Y98, mis. W20-W49 tumpul vs W25-W29 tajam) = *sebab/mekanisme*, dipakai bersama.

---

## 2. PERTANYAAN 1 — Servisitis: N89 (katalog) vs N72 (fenotipe klinis)

### Fakta terverifikasi
- **N89 WHO** = *"Other **noninflammatory** disorders of **vagina**"*. Sub-kodenya: displasia vagina ringan/sedang/berat, leukoplakia, striktur/atresia, cincin himen ketat, hematokolpos. **Tak satu pun menyebut duh, sekret, atau servisitis.**
- **N72 WHO** = *"Inflammatory disease of cervix uteri"*, mencakup *cervicitis, endocervicitis, exocervicitis* (dengan/tanpa erosi-ektropion).
- Fenotipe kasus `lab_sindrom_duh_genital_servisitis`: perempuan 18-45 th, **sekret mukopurulen dari serviks**, **serviks mudah berdarah (contact bleeding)**, tanpa nyeri goyang serviks/demam/nyeri pelvis. Nama kasus: "Servisitis Mukopurulen - Tata Laksana Sindromik".
- Kode yang dipakai sekarang: **N89**, sama dengan baris katalog `genital_discharge` = "Sindroma Duh Genital (Gonore & Non-Gonore)".

### Ketegangannya
Kasus ini adalah bagian dari **klaster IMS 3-kasus** yang diadjudikasi bersama pada "wave 14", dengan prinsip yang dinyatakan eksplisit dan **dikunci test**: *"menjaga kode katalog sambil memperjelas fenotipe klinis"*. Test `adjudicationWave14.test.ts` mewajibkan ketiganya memuat frasa `konkordan...katalog SKDI-144` di `catatanRealita`:
- `lab_gonore_uretritis_pria` → A54.9 (katalog `gonorrhea` = A54.9) — kode **cocok** secara klinis
- `lab_salpingitis_pid_ringan` → N70 — kode **cocok** secara klinis
- `lab_sindrom_duh_genital_servisitis` → N89 — kode **TIDAK cocok** secara klinis

Jadi kebijakan seragam itu tidak berbahaya untuk 2 dari 3 kasus, tetapi pada kasus ketiga menghasilkan kode yang secara definisi WHO salah organ **dan** salah kelas (noninflamasi untuk penyakit inflamasi).

### Argumen mempertahankan N89
1. Ini **keputusan sadar tingkat-gelombang**, bukan kelalaian — dinyatakan di `catatanRealita`, diterapkan konsisten ke 3 kasus, dan dikunci test.
2. Katalog SKDI adalah kompetensi **tingkat sindrom**; pendekatan sindromik memang doktrin IMS di FKTP Indonesia (terapi presumtif tanpa NAAT). Kode sindrom mungkin memang niatnya.
3. Mengubah satu dari tiga merusak koherensi klaster.
4. *(Belum terverifikasi — perlu DeepThink)* WHO N89.8 kemungkinan memuat inklusi **"Leukorrhoea NOS"** (duh vagina tanpa keterangan). Bila benar, N89 defensible untuk baris katalog tingkat-sindrom, meski tetap tidak untuk fenotipe servisitis.

### Argumen pindah ke N72
1. Kode **tercetak di layar** — mahasiswa menghafal bahwa servisitis = kode kelainan noninflamasi vagina.
2. Mekanisme untuk divergensi katalog-vs-kasus **sudah ada dan matang**: allowlist `GENERIK_SENGAJA`, 13 entri, salah satunya (`vaginitis`: katalog N76.0 sindrom vs kasus B37.3 etiologi teridentifikasi) **berbentuk identik** dengan kasus ini.
3. Riset tidak berhasil memverifikasi bahwa N89 adalah konvensi resmi Kemenkes; `skdi144.ts` sendiri mencatat datanya "di-port dari repo lama `FKTP144Diseases.js`", bukan disalin dari teks KMK 1186/2022. Kemungkinan warisan informal.
4. Kasus ini **bukan** salah satu dari 16 kasus bertanda tangan dokter (statusnya `lab_prototype_unadjudicated`).

### Yang sudah dicoba dan dibatalkan
Claude sempat mengubah ke N72 + mendaftarkannya di allowlist, lalu **membatalkannya sendiri** setelah menemukan test wave-14 — karena menimpa kebijakan teradjudikasi dengan bukti sepihak persis pola kegagalan yang pernah melukai proyek ini (insiden "fix M6 ter-revert diam-diam"). Perubahan itu juga menabrak penjaga terpisah (`m11pengayaan.test.ts`: catatan realita wajib ringkas, bukan kuliah) — sinyal kedua bahwa arahnya melawan arus desain.

### Pertanyaan untuk DeepThink
> **(a)** Apakah WHO ICD-10 N89.8 benar memuat inklusi "Leukorrhoea NOS"? Bila ya, apakah itu cukup menjustifikasi N89 pada baris katalog *tingkat sindrom*?
> **(b)** Untuk kasus yang fenotipenya sudah **jelas servisitis**, mana yang lebih benar secara pedagogis-klinis: konsistensi kode dengan baris kompetensi, atau presisi kode dengan diagnosis yang ditegakkan? Ingat: kodenya tercetak di layar mahasiswa.
> **(c)** Bila jawabannya N72, apakah klaster 3-kasus itu harus ditinjau serentak (dan test wave-14 diperbarui), atau boleh dikoreksi satu-satu?

---

## 3. PERTANYAAN 2 — Alergi makanan: L27.2 vs T78.1 vs L50.0, dan deck yang saling bertabrakan

### Fakta terverifikasi (kutipan langsung teks WHO)
- **L27.2** = *"Dermatitis due to ingested food"*. Kategori induk **L27 memuat Excludes: `urticaria (L50.-)`** — artinya L27.2 **tertutup secara aturan** untuk presentasi urtikaria.
- **T78.1** = *"Other adverse food reactions, not elsewhere classified"*. Excludes-nya: *"dermatitis due to food (L27.2)"* — jadi T78.1 dan L27.2 saling eksklusif by design. T78.1 **tidak** mengecualikan urtikaria.
- **L50.0** = *"Allergic urticaria"* (dibaca langsung dari tabel Volume 1 WHO, urutan label dicocokkan 1:1 dengan urutan kode).
- **T78.0** = *"Anaphylactic shock due to adverse food reaction"*.

### Fenotipe kasus `lab_alergi_makanan_ringan`
Nama: "Alergi Makanan Tanpa Anafilaksis". Kompetensi SKDI: `food_allergy` "Alergi Makanan" (4A, wajib tuntas FKTP). Usia 15-55, TD 120/78 normal.
Keluhan: **"Setiap makan udang, kulit saya bentol gatal dalam beberapa menit."** Bentol muncul ~15 menit setelah makan udang, di lengan dan badan. Anamnesis esensial memastikan: **tidak ada** suara serak/sesak/mengi/bengkak bibir-lidah/pusing/pingsan; **berulang 3× khusus udang**, makanan lain aman; tidak pernah reaksi berat, tidak asma.

**Jadi: urtikaria alergika generalisata dipicu makanan, tanpa anafilaksis.**

### Masalah berlapis
1. **Kode sekarang (L27.2) melanggar Excludes WHO** — presentasinya urtikaria, bukan dermatitis eksematosa.
2. **Distraktornya adalah diagnosis yang benar.** `diagnosisBanding: ['L27.2', 'L50.0', 'T78.2']` → pemain memilih antara "Alergi Makanan" (L27.2, jawaban benar), **"Urtikaria Alergika" (L50.0, distraktor)**, dan "Syok Anafilaktik" (T78.2, distraktor). Padahal pasien ini secara harfiah **menderita urtikaria alergika**. Distraktor L50.0 bukan salah — ia benar.
3. Praktik koding lazim memakai **dua kode**: L50.0 (manifestasi) + T78.1 (pencetus makanan). Engine hanya mengizinkan satu kode per kasus.

### Opsi yang terpetakan
| Opsi | Kode jawaban | Konsekuensi |
|---|---|---|
| **A** | `T78.1` | Kompetensi "Alergi Makanan" tetap utuh; Excludes tidak dilanggar; L50.0 tetap jadi distraktor sah (urtikaria tanpa pencetus makanan teridentifikasi). Poin ajar jadi: *sudahkah kausalitas makanan ditegakkan?* — yang memang inti anamnesis kasus (berulang 3× khusus udang). |
| **B** | `L50.0` | Paling presisi terhadap manifestasi, tapi **bertabrakan dengan distraktornya sendiri** → distraktor harus diganti, dan nama kasus/kompetensi "Alergi Makanan" jadi kurang pas. |
| **C** | tetap `L27.2` | Melanggar Excludes WHO; tidak direkomendasikan. |

Catatan: baris katalog `food_allergy` juga berkode L27.2 — bila kasus pindah, allowlist `GENERIK_SENGAJA` bisa menampung divergensinya (preseden ada).

### Pertanyaan untuk DeepThink
> **(a)** Untuk urtikaria akut yang dipicu makanan dan terbukti berulang, **tanpa** anafilaksis, di FKTP Indonesia — kode WHO ICD-10 tunggal mana yang paling tepat: T78.1, L50.0, atau kombinasi (dan bila kombinasi, mana yang jadi kode utama)?
> **(b)** Apakah Opsi A menciptakan diskriminasi klinis yang bermakna bagi mahasiswa (T78.1 vs L50.0 = "pencetus makanan tegak vs tidak"), atau justru membingungkan karena keduanya sah untuk pasien yang sama?
> **(c)** Bila L50.0 dipilih sebagai jawaban benar, distraktor pengganti apa yang paling mendidik untuk deck ini?

---

## 4. PERTANYAAN 3 — Kekerasan tumpul vs tajam: dua kompetensi, satu kode

### Fakta
- `skdi144` memuat **dua** baris kompetensi berbeda dengan **kode identik `S00-S09`**: `blunt_trauma` ("Kekerasan Tumpul") dan `sharp_trauma` ("Kekerasan Tajam").
- `S00-S09` bukan kode diagnosis — itu **nama blok** ("Injuries to the head").
- Kasus `lab_trauma_tumpul_kepala_ringan` sudah memakai **S00.0** (cedera superfisial kulit kepala).
- Kasus `lab_trauma_tajam_kulit_kepala` baru diubah ke **S01.0** (luka terbuka kulit kepala) — laserasi linear 2 cm, galea utuh, GCS 15.
- **WHO tidak mengkodekan mekanisme di blok S**: sifat cedera di S00-S09; mekanisme tumpul/tajam di Bab XX (W20-W49 vs W25-W29), dipakai sebagai kode kedua.

### Ketegangannya
"Kekerasan Tumpul" dan "Kekerasan Tajam" sebagai kompetensi SKDI kemungkinan besar berasal dari konteks **forensik/medikolegal** (visum et repertum), di mana mekanisme memang inti kompetensinya — bukan konteks koding morbiditas. Memaksakannya ke satu kode ICD nature-of-injury bisa jadi salah kerangka sejak awal.

### Pertanyaan untuk DeepThink
> **(a)** Apakah kompetensi SKDI "Kekerasan Tumpul/Tajam" memang berkerangka forensik? Bila ya, apakah baris katalog sebaiknya tidak memakai kode ICD morbiditas sama sekali, atau memakai kode Bab XX (sebab luar)?
> **(b)** Untuk game yang menampilkan satu kode per kasus, apakah S00.0 (tumpul, superfisial) dan S01.0 (tajam, luka terbuka) adalah pemetaan yang benar — atau justru menyamarkan bahwa pembedanya semestinya mekanisme, bukan sifat luka?

---

## 5. PERTANYAAN 4 — Kepadatan opsi: 198 dari 210 kasus hanya 3 pilihan

### Fakta terukur
Distribusi jumlah opsi diagnosis per kasus: **3 opsi = 198 kasus**, 4 opsi = 11 kasus, 5 opsi = 1 kasus. Dengan 2 distraktor, tebakan acak = 33%; satu distraktor yang mudah dieliminasi menaikkannya ke 50%.

### Pertanyaan untuk DeepThink
> **(a)** Untuk asesmen formatif kedokteran berbasis vignette, berapa jumlah opsi yang optimal secara psikometrik? (Literatur MCQ modern cenderung menyimpulkan 3 opsi berkualitas ≥ 5 opsi dengan distraktor lemah — apakah itu berlaku untuk penalaran diagnostik bergambar-kasus?)
> **(b)** Bila 3 opsi dipertahankan, syarat mutu apa yang harus dipenuhi kedua distraktor agar tebakan-acak tidak mendominasi? (mis. keduanya wajib berada dalam ruang banding yang sama, tak boleh ada yang tereliminasi hanya dari demografi/format)
> **(c)** Apakah kasus tier-rujuk/kegawatan layak diberi ambang lebih tinggi daripada kasus 4A rutin?

---

## 6. PERTANYAAN 5 — Bobot skor kontinuitas rujukan (`closureRate`)

### Fakta
- `closureRate` **dihitung** di `bridge.ts` (rasio episode rujukan yang ditutup dengan umpan balik) tetapi **tidak pernah dibaca** oleh `scoring.ts`. Mahasiswa yang selalu menutup loop rujukan mendapat skor **identik** dengan yang tidak pernah menutupnya.
- Aksi menutup loop (`ADOPSI_UMPAN_BALIK`) adalah satu-satunya aksi pemain yang efeknya murni tulisan ledger: tanpa event, tanpa tally.
- **Argumen tandingan yang selama ini menahan perubahan:** menutup loop tidak berbiaya (tak memakai stamina/slot/gerbang blok), jadi melewatkannya bukan strategi dominan yang bisa dieksploitasi — berbeda dari bug skor sungguhan yang pernah diperbaiki (mis. `prolanisSesi`, `obatBerbahaya`) yang masing-masing menciptakan jalan pintas gratis.
- Biaya teknis: menyentuh **7 berkas beku** (state/init/save/reducer/scoring/verifikasi/bridge) → wajib bump REVISI_ENGINE + refresh hash + rekalibrasi soak/benchmark.

### Pertanyaan untuk DeepThink
> **(a)** Dalam kurikulum kedokteran keluarga, seberapa sentral "menutup loop rujukan" (menerima & menindaklanjuti umpan balik RS) sebagai kompetensi yang layak **dinilai**, bukan sekadar dinarasikan?
> **(b)** Bila layak dinilai, berapa bobot proporsional yang wajar terhadap 4 dimensi yang ada (UKP 35 / UKM 35 / Manajemen 15 / Resiliensi 15)? Masuk ke dimensi mana?
> **(c)** Apakah risiko "menghukum mahasiswa atas hal di luar kendalinya" (umpan balik RS datang lewat mekanik acak) cukup besar untuk membatalkan gagasan ini?

---

## 7. PERTANYAAN 6 — Clue stroke masih memakai nama pra-adjudikasi

### Fakta
- Lapisan adjudikasi (`igdAdjudication.ts`) mengubah nama kasus menjadi **"Suspek Stroke Akut dalam Jendela Reperfusi"** dan kode ke **I64** ("Stroke, tidak spesifik sebagai perdarahan atau infark") — perubahan yang **epistemik disengaja**: di FKTP tanpa CT, iskemik vs perdarahan **tidak boleh** dipastikan.
- Tetapi teks *clue* di lapisan dasar (`igdLab1.ts`, `icd10: 'I63.9'`) masih membuka dengan kalimat deklaratif: **"Stroke iskemik akut: sumbatan arteri menciptakan inti infark dan PENUMBRA..."**
- Isi clue selebihnya sudah benar dan konsisten (menekankan CT, jangan beri aspirin sebelum perdarahan disingkirkan).

### Ketegangannya
Kalimat pembuka mengajarkan kepastian ("stroke iskemik") yang justru dibantah oleh keputusan adjudikasi ("suspek", I64) dan oleh isi clue-nya sendiri. Tapi mengubah kalimat pembuka ajaran klinis adalah keputusan redaksi-klinis, bukan koreksi mekanis.

### Pertanyaan untuk DeepThink
> Bagaimana kalimat pembuka clue seharusnya berbunyi agar (i) tetap mengajarkan patofisiologi penumbra yang memang inti pelajaran reperfusi, tetapi (ii) tidak menyatakan subtipe stroke sebagai kepastian di setting tanpa pencitraan?

---

## 8. PERTANYAAN 7 — Tata kelola: bolehkah Claude menyegel ulang amplop untuk koreksi berdelta-klinis-nol?

### Fakta
- Slice kurikulum `m13-1a` dilindungi **amplop tanda tangan dokter**: hash SHA-256 atas payload kanonik. Gerbang `fail-closed` menolak aktivasi bila isi berubah setelah ditandatangani. Mekanisme ini sudah **dua kali bekerja benar** dan mencegah perubahan diam-diam.
- Aturan yang berlaku (preseden commit `db25f00`): penyegelan ulang **hanya atas perintah dokter** — "bukan wewenang pengembang".
- Situasi sekarang: koreksi `J34.89` → `J34.8` pada kasus `benda_asing_hidung_anak` menyentuh payload bertanda tangan. Delta klinisnya **nol secara harfiah** — judul WHO J34.8 dan judul ICD-10-CM J34.89 adalah kalimat yang **sama persis**: *"Other specified disorders of nose and nasal sinuses"*. Yang berubah hanya sistem koding mana yang dirujuk.
- Akibatnya **3 test merah** menggantung di repo (2 gerbang amplop + 1 fingerprint artefak M13), yang menyamarkan regresi lain di masa depan.

### Ketegangannya
Aturan "reseal hanya atas perintah dokter" ada untuk melindungi integritas verifikasi dosier mahasiswa — alasan yang kuat. Tetapi menerapkannya secara mutlak pada koreksi berdelta-nol berarti repo menyimpan kode yang diketahui salah **dan** test merah menahun, hanya karena menunggu satu kata.

### Pertanyaan untuk DeepThink
> **(a)** Layakkah dibuat **kelas pengecualian sempit** yang terdefinisi ketat — mis. "koreksi kode ke padanan WHO yang judul resminya identik kata-per-kata, nol perubahan diagnosis/obat/dosis/disposisi/sitasi" — di mana penyegelan ulang boleh dilakukan pengembang dengan pencatatan wajib, tanpa perintah eksplisit tiap kali?
> **(b)** Bila ya, penjaga teknis apa yang harus menegakkan batas kelas itu agar tidak melar (mis. test yang membandingkan payload lama-vs-baru dan menolak bila ada field selain kode yang berubah)?
> **(c)** Bila tidak, bagaimana sebaiknya repo menahan koreksi semacam ini agar tidak meninggalkan test merah menahun?

---

## 9. Lampiran — status implementasi saat dosier ini ditulis

**Sudah dikerjakan & hijau** (typecheck bersih, 1664/1667 test):
- 9 koreksi kode ICD-10 di tabel §1
- `cuci_seprai_panas` dicabut dari edukasi wajib rinitis alergi (Keputusan delegasi #9 — dasar bukti lengkap ada di `docs/ADJUDIKASI_DELEGASI_2026-08-21.md`)
- Sinkronisasi 5 baris katalog `skdi144` mengikuti kode kasusnya
- Allowlist duplikat `S00-S09` dicabut (bukan duplikat lagi setelah `sharp_trauma` → S01.0)

**Sengaja dibatalkan sendiri:** perubahan N89 → N72 (lihat §2), karena menabrak kebijakan teradjudikasi wave-14.

**Merah menunggu keputusan §8:** 2 gerbang amplop m13-1a + 1 fingerprint artefak M13.
