# Adjudikasi Terdelegasi — 8 Keputusan Bug Hunt, 21 Agustus 2026

**Status wewenang:** dr. Wirayuda mendelegasikan secara eksplisit (chat, 2026-08-21) keputusan atas 8 temuan klinis bug hunt kepada Claude, dengan mandat "sebijak, seakurat, dan selogis mungkin". Rekaman ini adalah jejak auditnya. **Setiap keputusan di sini dapat diveto dokter kapan pun**; bila diveto, kembalikan lewat commit revert yang menyebut dokumen ini.

Prinsip yang dipakai menimbang: (1) jawaban yang benar secara klinis tidak boleh dihukum lebih berat daripada jawaban yang salah; (2) ikuti keputusan dokter yang SUDAH terdokumentasi sebelum mengarang yang baru; (3) pilih arah perubahan yang hanya menghapus hukuman-salah, bukan yang membalik jawaban benar orang; (4) kesederhanaan mekanis di atas kecanggihan spekulatif.

---

## 1. Kurva konsekuensi IGD, stabilitas <50 tanpa Kode Biru — `engine/igd.ts`, `reducer.ts`

**Masalah:** rujuk (disposisi benar di seluruh 20 kasus) pada stabilitas <50 = pasien PASTI meninggal (Kode Hitam, igdMeninggal −3 UKP, burnout +15, badge nol_kode_hitam gugur); pulang (salah) = pasti selamat, cuma −0,5. Mahasiswa tidak punya aksi menaikkan stabilitas di fase disposisi, jadi ia dihukum mati karena memilih opsi terbaik yang tersedia.

**Keputusan:** balikkan arah konsekuensinya, deterministik, satu ambang (AMBANG_STABIL_RUJUK 50 tetap):
- **Rujuk pada stabilitas <50** → pasien TIBA DI RS DALAM KONDISI KRITIS, hidup. `disposisiTepat` tetap dinilai normal (rujukan memang benar; kualitas proses sudah terhukum lewat skor formal jawaban langkah yang salah — tidak ada hukuman ganda). Surat & careEpisode menarasikan kondisi kritis dan menegaskan doktrin "stabilisasi maksimal sebelum & selama transportasi".
- **Pulang pada stabilitas <50** → pasien MEMBURUK DI RUMAH dan meninggal (Kode Hitam + igdMeninggal + burnout +15 — konsekuensi yang dulu salah alamat ke rujukan kini pindah ke tempat yang benar secara klinis). Surat: keluarga terlambat membawanya kembali.
- Pulang pada stabilitas ≥50 (salah disposisi, pasien relatif stabil): perilaku lama dipertahankan (selamat, igdSalahDisposisi), tetapi frasa surat "Untung keluarganya membawanya ke RS sendiri" diganti nada netral yang tidak mengajarkan bahwa transport pribadi pasien-yang-seharusnya-dirujuk itu aman.
- **Invarian baru (di-test):** pada kasus ber-disposisiBenar 'rujuk', tidak boleh ada state di mana konsekuensi memulangkan lebih ringan daripada merujuk.

**Dasar klinis:** doktrin FKTP yang diajarkan game ini sendiri di semua clue IGD — "rujuk sambil stabilisasi berjalan" (KAD, organofosfat, PPH, eklampsia). Memulangkan pasien syok/tidak stabil adalah pilihan terburuk; merujuknya dengan stabilisasi berjalan adalah standar.

## 2. Tiga kasus "Dugaan" menuntut diagnosis TEGAK — `lab/batch2.ts`, `lab/batch1.ts`

**Keputusan:** setel `kepastianDiagnosis: 'suspek'` pada `lab_defisiensi_mineral_zinc`, `lab_defisiensi_vitamin_b_kompleks`, `lab_intoleransi_makanan_laktosa`.

**Dasar:** nama ketiga kasus memuat kata "Dugaan"; clue-nya sendiri menyatakan diagnosis belum dapat ditegakkan di FKTP (zinc: "tidak boleh ditegakkan dari satu gejala"; riboflavin catatanRealita: "label diagnosis tetap dugaan, bukan kepastian laboratorium"). Preseden internal konsisten: skrofuloderma_suspek, leptospirosis, meningitis_bakterial_suspek, dan ±9 kasus lain sudah menyetel 'suspek'. Kelalaian field, bukan keputusan sadar.

## 3. I16.0 vs I13.9 hipertensi urgensi — `kasusMetabolikMsk.ts`

**Keputusan:** pulihkan Fix M6 (commit `d325766`): `icd10: 'I13.9'`, banding sesuai bentuk M6 (`I13.9/I11.9/I12.9`), dan perbarui komentar mencatat pemulihan ini.

**Dasar:** ini BUKAN keputusan klinis baru — M6 adalah adjudikasi terdokumentasi (triase DeepThink 2026-07-11, tercatat "SUDAH DIFIX" di M10_5_FIDELITAS.md §6a) yang ter-revert diam-diam oleh commit refresh EBM `1a5a4e7` tanpa alasan tertulis. Komentar di atas field masih menjelaskan lengkap kenapa I13.9 benar (I16.x = ICD-10-CM AS, tak ada di WHO ICD-10 Kemenkes/BPJS; vignette LVH kronik + nefropati kronik match I13.9). Revert tanpa dokumentasi kalah dari adjudikasi terdokumentasi.

## 4. Eritromisin faringitis vs azitromisin tonsilitis — `kasusInfeksi.ts`, `kasusRespGi.ts`

**Keputusan:** samakan `alternatifBenar` kedua kasus menjadi `['eritromisin_500', 'azitromisin_500']`.

**Dasar:** kedua vignette nyaris identik (suspek GAS + alergiTrap penisilin selalu aktif). Secara farmakologi keduanya makrolida yang sama-sama diterima untuk GAS pada alergi penisilin (IDSA; PPK 1186/2022 memuat eritromisin sebagai alternatif; azitromisin lazim di Fornas). Guideline field tonsilitis sendiri menulis "alternatif makrolida" — kelas, bukan satu molekul. Arah union hanya MENGHAPUS hukuman salah; tidak ada jawaban yang sebelumnya benar menjadi salah.

## 5. Pseudoefedrin di rinitis alergi — `kasusRespGi.ts`

**Keputusan:** turunkan dari `bahaya: 'kontraindikasi'` (−25, bendera merah, grade terkunci D) ke `bahaya: 'nonPrimer'` (sekelas entri amoxicillin di daftar yang sama). Alasan edukatifnya dipertahankan & dipertegas: bukan lini pertama; hati-hati efek sistemik terutama pada hipertensi — yang TIDAK dimiliki pasien vignette ini (TD 118/76).

**Dasar:** pseudoefedrin oral pada dewasa muda normotensi bukan kontraindikasi — hanya bukan terapi utama (ARIA; PPK). Cap grade D untuk obat yang WAJIB diresepkan di kasus rinosinusitis sebelahnya adalah kontradiksi lintas kasus yang menghukum penalaran benar. Teks alasan lama pun sudah mengakui bahayanya kondisional ("terutama pada hipertensi").

## 6. R62.7 pada balita gizi kurang — `lab/batch2.ts`, `icd10.ts`

**Keputusan:** ganti banding `R62.7` → `R62.8` pada `lab_malnutrisi_energi_protein_sedang`; tambah `NAMA_ICD['R62.8'] = 'Gagal Tumbuh (Failure to Thrive)'`; hapus entri `R62.7` yang tak lagi dirujuk siapa pun.

**Dasar:** R62.7 = ICD-10-CM AS "Adult failure to thrive" — tidak ada di WHO ICD-10 dan salah demografi untuk balita. Padanan WHO untuk gagal tumbuh anak adalah R62.8. Distraktor failure-to-thrive tetap dipertahankan (relevan secara pedagogis untuk banding malnutrisi) — hanya kodenya yang dijujurkan dan labelnya dinetralkan demografi.

## 7. Floor observasi-menunggu-lab — `engine/clinic.ts`

**Keputusan:** dua lapis, proporsional dengan beratnya pelanggaran:
- `tindakanBerbahaya`/`tindakanDiLuar` > 0 → floor GUGUR sepenuhnya (sekelas `obatBerbahaya` yang sudah menggugurkan — "observasi yang aman" tidak kompatibel dengan tindakan berbahaya).
- `obatNonPrimerDiresepkan` → floor tetap berlaku, tetapi potongan nonPrimer dikurangkan SETELAH flooring (skorTerapi = max(mentah, 70) − penalti nonPrimer), sehingga kredit observasi-yang-benar tidak lenyap total karena satu resep minor, tapi penaltinya juga tidak pernah terhapus.

**Dasar:** konsisten dengan doktrin Fix #2 (2026-07-11) yang tertulis di komentar kode itu sendiri: "floor tidak boleh menghapus efek penalti" — diterapkan proporsional, bukan pukul rata.

## 8. Arah drift "naikkan dosis" pada HT terkendali — `engine/kegiatan.ts`

**Keputusan:** bila peserta SEDANG terkendali dan intervensi salah (satu-satunya opsi salah di state itu = overtreatment "naikkan dosis"), arah drift dibalik menjadi TURUN (clamp bawah 110/85 yang sudah ada menahan dari nilai absurd), sehingga angka yang tampak di kartu berikutnya konsisten dengan peringatan hipotensi di respons kartunya sendiri. Konsumsi RNG tetap tepat satu draw. Bila narasi kartu berikutnya memuat teks "obat sering lupa diminum" untuk kondisi ini, selaraskan. Klasifikasi `prolanisTerkendali` TIDAK diubah (mengubahnya menjadi rentang akan menghukum peserta yang param-nya turun ke clamp lewat jawaban BENAR berulang — regresi).

**Dasar:** menaikkan dosis antihipertensi pada pasien terkendali menurunkan tekanan darah — simulasi lama menaikkannya, kebalikan fisiologi. Hukuman atas jawaban salah tetap ada di skor sesi (benar/total); yang diperbaiki hanya arah simulasi + narasi yang kontradiktif.

**Amendemen (2026-08-21, hari yang sama, atas temuan agen implementasi):** pembalikan arah dibatasi ke peserta **HT saja**. Pada kartu DM terkendali, opsi salahnya adalah "Stop obat karena gula sudah normal" — itu *under*-treatment: gula justru melonjak lagi (persis teks respons kartunya), sehingga arah +1 lama sudah benar untuk DM. Predikat generik awal akan membuat engine membantah teks edukasinya sendiri di kartu DM.

---

*Implementasi: lihat commit-commit bertanda "adjudikasi-delegasi" pada 2026-08-21. REVISI_ENGINE dan CONTENT_RELEASE di-bump pada rilis yang sama (1.2.0).*
