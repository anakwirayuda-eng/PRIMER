# Audit Currency EBM PRIMERA

**Tanggal audit:** 18 Juli 2026  
**Snapshot:** working tree `codex-gpt56-experiment`, PRIMERA test-beta  
**Cakupan:** konten UKP/poli, IGD, dan landasan UKM yang masuk `PACK`  
**Sifat laporan:** audit teknis-klinis berbasis sumber; bukan pengganti adjudikasi dokter atas seluruh prototipe M13

## 1. Ringkasan Eksekutif

Audit menemukan bahwa masalah utama bukan sekadar "tahun sitasi lama". Beberapa pedoman lama masih merupakan pedoman aktif, sedangkan beberapa teks yang lebih baru justru tidak cukup spesifik untuk menggantikan algoritme lama. Kriteria penggantian yang dipakai adalah: **apakah sumber baru mengubah keputusan yang dimainkan**.

Gelombang ini memperbaiki enam kelas risiko:

1. **Keputusan terapi yang salah dihukum atau diwajibkan oleh scoring.** Allopurinol saat flare gout dan oksigen pada gagal jantung dengan SpO2 92% dikoreksi sampai ke semantik scoring.
2. **Regimen yang benar-benar stale.** Regimen TB intermiten lama diganti KDT harian `2HRZE/4HR` sesuai Juknis TB-SO Indonesia 2025.
3. **Guideline aktif yang sudah berubah.** Asma, PPOK, stroke, dengue, perdarahan pascasalin, DKA, meningitis, dan beberapa kegawatdaruratan diperbarui.
4. **Angka lama yang tercampur antara pencegahan dan terapi.** Anemia kehamilan sekarang membedakan 180 tablet program antenatal dari dosis terapi besi elemental.
5. **UKM yang benar secara historis tetapi kurang bukti implementasi mutakhir.** SAJI, ILP, Posyandu, dan KLB kini memiliki lapisan sumber 2024-2026 tanpa membuang sumber dasar yang masih berlaku.
6. **Kasus tanpa jejak panduan terpisah.** Seluruh 210 kasus poli kini memiliki `panduanResmi`, termasuk pernyataan transparan bila PPK 1186/2022 tidak menyediakan jalur mandiri dan sumber EBM lain dipakai untuk mengisi keputusan klinis.

**Verdict:** konten aktif menjadi lebih aman dan lebih current, tetapi audit ini tidak menyatakan seluruh 230 encounter telah selesai diadjudikasi dokter. Prototipe M13 tetap harus melewati review klinis yang sudah dirancang.

## 2. Apa yang Sebenarnya Dilihat Pemain

Inventaris runtime pada snapshot ini:

| Lapisan | Cakupan | Fungsi |
|---|---:|---|
| Kasus poli/UKP | 210 | Encounter klinis yang dapat dimainkan |
| Mutiara Klinis utama (`clue`) | 210/210 | Debrief EBM utama; selalu tampil setelah kasus |
| Waspada temuan menyesatkan (`mutiaraEbm`) | 44/210 | Lapisan khusus bila ada pitfall diagnostik; sengaja tidak dipaksakan ke semua kasus |
| Panduan Resmi/jejak sumber (`panduanResmi`) | 210/210 | Floor lokal, sumber EBM pelengkap, dan penjelasan divergensi Kemenkes-vs-EBM |
| Realita FKTP (`catatanRealita`) | 100/210 | Graceful degradation sumber daya dan jejaring |
| Kasus IGD | 20 | Semua memiliki debrief utama pada `clue`; tipe IGD belum memakai panel `panduanResmi` terpisah |
| Skenario UKM/keluarga | 27 | Sitasi diinjeksikan lewat registry display-only agar replay tidak berubah |

Implikasi penting: **44/210 bukan berarti hanya 44 kasus memiliki EBM.** Semua 210 kasus poli memiliki Mutiara Klinis utama. Field `mutiaraEbm` khusus untuk pesan seperti "nilai normal tidak menyingkirkan penyakit" dan sebaiknya tidak diisi dengan filler.

## 3. Hierarki Sumber

Urutan yang diterapkan:

1. **Floor Indonesia:** PNPK/PPK Kemenkes dan aturan program nasional yang masih berlaku.
2. **EBM pengganti:** guideline internasional/organisasi profesi terbaru bila mengubah keputusan dan metodologinya lebih kuat.
3. **Ketersediaan:** Formularium Nasional 1199/2025, KFA, ASPAK, dan jejaring rujukan.
4. **Graceful degradation:** keterbatasan gedung tidak boleh disamakan dengan hilangnya akses jejaring.
5. **Sumber lama yang masih aktif boleh dipertahankan:** tahun publikasi bukan alasan tunggal untuk mengganti pedoman.

Contoh penerapan yang hati-hati: WHO Arboviral Guideline 2025 memberi rekomendasi GRADE yang luas untuk dengue, tetapi tidak menggantikan seluruh angka laju cairan rinci pada algoritme WHO Dengue 2009/PAPDI. Karena itu sumber 2025 dipakai sebagai payung, sedangkan angka rinci tetap diberi asal yang jujur.

## 4. Koreksi yang Mengubah Gameplay

### 4.1 Gout akut

- Sebelumnya allopurinol diperlakukan sebagai jawaban salah saat flare.
- ACR 2020 secara kondisional membolehkan memulai ULT saat flare bila indikasinya memang ada; yang salah adalah memakai ULT sebagai pengganti antiinflamasi akut.
- `allopurinol_100` dipindah menjadi obat opsional. Menambahkannya tidak menurunkan skor, tetapi allopurinol saja tetap tidak mendapat skor terapi flare yang memadai.
- Debrief menekankan dosis awal rendah, profilaksis antiinflamasi 3-6 bulan, dan treat-to-target `<6 mg/dL`.

### 4.2 Gagal jantung kongestif, SpO2 92%

- PPK lama mencantumkan oksigen rutin 2-4 L/menit.
- ESC 2021 merekomendasikan oksigen bila SpO2 `<90%` atau PaO2 `<60 mmHg`; oksigen rutin pada pasien nonhipoksemik dapat merugikan hemodinamik.
- Oksigen dipindah dari tindakan wajib menjadi tindakan opsional. Furosemid dan posisi tetap dinilai.
- Engine sekarang mengenal `prosedurOpsional`; tindakan itu sah, tetapi tidak masuk denominator dan tidak menjadi gerbang skor.

### 4.3 Common cold dan bronkitis akut

- Ambroksol sebelumnya dapat memperoleh kredit walau manfaat klinis mukolitik pada infeksi saluran napas akut tanpa penyakit mukus kronis tidak cukup mendukungnya sebagai target belajar.
- Ambroksol sekarang tidak lagi menjadi jawaban benar/opsional pada kedua kasus dan pilihan itu menurunkan kualitas terapi bronkitis.
- Fokus kembali ke komunikasi perjalanan penyakit, safety-netting, terapi simptomatik yang rasional, dan stewardship antibiotik.

### 4.4 BPPV

- Reposisi kanalit/Epley sekarang merupakan tindakan inti yang harus dipilih.
- Betahistin tetap dapat dipilih sebagai obat opsional untuk gejala, tetapi tidak dapat menggantikan manuver dan tidak menaikkan skor inti.

### 4.5 Epistaksis anterior

- Kompresi langsung hidung 10-15 menit ditambahkan sebagai tindakan inti.
- Tampon menjadi tindakan opsional bila kompresi gagal, bukan jawaban wajib untuk semua pasien.
- Hipertensi dicatat sebagai komorbid yang perlu dinilai, bukan penyebab langsung yang menggantikan hemostasis lokal.

### 4.6 Low back pain nonspesifik

- Parasetamol tidak lagi menjadi terapi utama tunggal yang memperoleh skor penuh.
- NSAID oral dosis efektif terendah dan durasi terpendek menjadi opsi farmakologis utama bila tidak ada kontraindikasi, bersama aktivitas dan edukasi; parasetamol hanya opsional.

### 4.7 ISK dalam kehamilan

- Amoksisilin empiris tidak lagi dikreditkan sebelum kultur karena resistansi *E. coli* yang tinggi.
- Nitrofurantoin atau sefalosporin menjadi pilihan empiris yang dinilai sesuai usia kehamilan, fungsi ginjal, pola resistansi lokal, dan hasil kultur; kotrimoksazol tidak lagi dilabel sebagai kontraindikasi absolut tanpa konteks trimester.

### 4.8 Dispepsia fungsional dan hipertensi berat

- Kronologi dispepsia diperpanjang agar memenuhi definisi sindrom kronis, bukan keluhan satu bulan yang terlalu dini untuk label fungsional.
- "Hipertensi urgensi" diperjelas menjadi hipertensi berat tanpa kerusakan organ akut dan kode ICD-10 dikoreksi ke `I16.0`.

## 5. Koreksi Klinis dan Sumber Utama

| Area/kasus | Koreksi | Sumber aktif |
|---|---|---|
| Asma dewasa | GINA 2019 diganti GINA 2026; SABA-tunggal tidak diajarkan sebagai strategi aman | GINA Strategy 2026; PPK 1186/2022 sebagai floor |
| PPOK | Target oksigen dan tata laksana eksaserbasi diperbarui | GOLD Report 2026 |
| TB paru sensitif obat | `2HRZE/4H3R3` diganti KDT harian `2HRZE/4HR`; TCM diprioritaskan, BTA hanya fallback sementara dan tetap perlu uji resistansi jejaring | Kepdirjen P2 HK.02.02/C/5401/2025; WHO TB Modules 3-4, 2025 |
| Dengue | Warning signs, kristaloid, dan monitoring memakai payung GRADE 2025; angka rinci lama tidak diklaim berasal dari 2025 | WHO Arboviral Clinical Management 2025; WHO Dengue 2009/PAPDI untuk angka rinci |
| Hipertensi | Konsekuensi dan target merujuk PNPK 303/2026, bukan JNC-8/Permenkes 5/2014 | PNPK Hipertensi Dewasa 303/2026; PPK 1936/2022 |
| Stroke/TIA | Stroke akut dan TIA memakai PNPK Stroke 304/2026; keputusan antitrombotik tidak diimprovisasi pra-imaging | PNPK 304/2026; AHA/ASA AIS 2026; AHA TIA 2023 |
| DKA dewasa | Batas populasi dibuat dewasa; cairan/insulin/kalium merujuk konsensus krisis hiperglikemik | ADA/EASD/JBDS/AACE/DTS Consensus Report 2024 |
| Perdarahan pascasalin | Tata laksana awal ditulis sebagai bundel simultan, termasuk TXA dini dan eskalasi | WHO/FIGO/ICM 2025; WHO implementation guide 2026 |
| Meningitis | Antibiotik empiris dini tidak boleh tertunda oleh diagnostik | WHO Guidelines on Meningitis 2025 |
| Gizi buruk berkomplikasi | WHO 2013 tidak lagi dipresentasikan sebagai guideline utama | WHO Wasting and Nutritional Oedema Guideline 2023 |
| Tenggelam | Prioritas ventilasi/resusitasi diperbarui | AHA/AAP Focused Update on Drowning 2024; AHA CPR/ECC 2025 |
| Sumbatan jalan napas anak | Algoritme sadar/tidak sadar dan transisi CPR diperbarui | AHA/AAP Pediatric BLS 2025 |
| ANC | K4 lama diganti K6, dua kontak dokter+USG, dan 180 TTD | PMK 6/2024 |
| Anemia kehamilan | 180 tablet program dibedakan dari terapi; PPK 180 mg/hari dan WHO 120 mg/hari ditampilkan sebagai divergensi | PPK 1186/2022; PMK 6/2024; WHO 2024 |
| Osteoartritis | Latihan dan manajemen berat badan menjadi inti; parasetamol bukan default universal | NICE NG226, 2022 |
| Artritis reumatoid | Rujuk/DMARD dini dan treat-to-target ditegaskan | EULAR RA Management Update 2025 |
| Gangguan cemas | Klaim lama bahwa fluoksetin tidak tersedia di FKTP dihapus | Fornas 1199/2025 |
| Common cold/bronkitis akut | Mukolitik tidak lagi menjadi target skor; stewardship dan safety-netting diprioritaskan | PPK 1186/2022; NICE NG120 |
| BPPV | Manuver reposisi menjadi terapi inti; obat simptomatik tidak menggantikannya | PPK 1186/2022; AAO-HNSF BPPV |
| Epistaksis anterior | Kompresi langsung menjadi langkah pertama; tampon hanya bila perlu | PPK 1186/2022; AAO-HNSF Nosebleed Guideline |
| Low back pain | Aktivitas/edukasi dan NSAID rasional; parasetamol bukan monoterapi default | WHO LBP 2023; NICE NG59 |
| ISK kehamilan | Hindari amoksisilin empiris sebelum kultur; pilihan disesuaikan trimester dan antibiogram | ACOG Clinical Consensus 2023, reaffirmed 2026 |
| Konseling KB | Kelayakan metode dibaca per kondisi klinis, termasuk menyusui; estrogen tidak dipukul rata | Permenkes 2/2025; WHO MEC edisi 6, 2025 |
| Depresi ringan | Asesmen bunuh diri dibuat multidimensi dan antidepresan tidak otomatis dimulai | PPK 1186/2022; WHO mhGAP 2023 |

## 6. Pembaruan UKM

Sumber historis tidak dibuang bila masih menjadi dasar legal/programatik:

- Permenkes 39/2016 tetap menjadi sumber PIS-PK, Pinkesga, dan SAJI.
- KMK 2015/2023 tetap menjadi kerangka ILP.
- Bukti implementasi Kemenkes 15 April 2025 ditambahkan untuk mengonfirmasi bahwa kunjungan rumah ILP memang mencari `missing service`, `non-compliance`, dan `danger sign`, serta tetap memakai SAJI.
- Posyandu ditautkan ke Panduan Pengelolaan Posyandu 2023 dan Kurikulum 25 Keterampilan Dasar Kader 2024.
- KLB diperbarui ke Permenkes 1/2026 dan struktur Puskesmas PMK 19/2024.
- Pedoman operasional PROLANIS BPJS yang tersedia memang lebih tua. Ia dipertahankan secara transparan sebagai sumber program, dibaca bersama ILP 2023; tahun lama tidak disamarkan menjadi dokumen baru.

## 7. Sumber yang Lama tetapi Belum Stale

| Sumber | Status audit | Alasan dipertahankan |
|---|---|---|
| ACR Gout 2020 | Aktif | Masih guideline ACR yang dipublikasikan sebagai acuan gout aktif |
| ESC Heart Failure 2021 | Aktif untuk aturan oksigen | Focused update berikutnya tidak membalik ambang oksigen yang dipakai |
| NICE OA NG226 (2022) | Aktif | Halaman rekomendasi NICE masih current |
| CDC STI Guidelines 2021 | Aktif | Belum ada pengganti komprehensif; pembaruan topikal harus dinilai per penyakit |
| WHO Dengue 2009 | Terbatas | Hanya untuk detail algoritme/laju yang tidak dinyatakan ulang oleh guideline GRADE 2025 |
| AAO-HNSF BPPV 2017 | Aktif | Belum diganti guideline praktik klinis organisasi tersebut |

## 8. Pagar Regresi

Tes baru mengunci:

- allopurinol opsional tidak dihukum dan tidak dapat menggantikan terapi flare;
- oksigen CHF opsional tidak mengubah skor;
- tindakan tidak boleh sekaligus wajib dan opsional;
- GINA/GOLD 2026 tetap tampil;
- hipertensi tidak kembali ke JNC-8/Permenkes 5/2014;
- ANC, anemia, dengue, DKA, stroke, PPH, TIA, meningitis, gizi buruk, tenggelam, dan FBAO mempertahankan sumber aktif;
- TB tidak kembali ke regimen intermiten lama;
- registry UKM tetap menyebut bukti implementasi SAJI/ILP 2025;
- ambroksol tidak kembali memperoleh kredit pada common cold/bronkitis akut;
- BPPV tidak dapat lulus tanpa reposisi kanalit;
- tampon tidak menggantikan kompresi awal epistaksis;
- parasetamol tunggal tidak memperoleh skor terapi penuh pada low back pain;
- amoksisilin empiris ISK kehamilan tidak dikreditkan sebelum kultur;
- semua 210 kasus poli selalu memiliki `panduanResmi` nonkosong;
- kasus berisiko tinggi mempertahankan jejak sumber spesifik dan dispepsia mempertahankan kronologi yang sah.

## 9. Keterbatasan dan Sisa Kerja

1. **Prototipe M13:** banyak kasus ekspansi masih berstatus `lab_prototype_unadjudicated`. Pembaruan sumber tidak sama dengan physician sign-off.
2. **IGD:** 20/20 memiliki debrief EBM, tetapi model datanya belum memisahkan panel Kemenkes dari clue utama.
3. **URL terstruktur per kasus:** semua kasus menyebut sumber dalam debrief, tetapi registry URL mesin-belajar belum mencakup setiap kasus. Laporan ini menjadi daftar jejak, bukan pengganti source registry M13-0B.
4. **Kedalaman tidak seragam:** cakupan sumber sudah 210/210, tetapi kasus sederhana sengaja memakai panel singkat. Kelengkapan panel bukan bukti bahwa seluruh dosis, contraindication, dan cabang populasi telah mendapat sign-off dokter.
5. **Surveilans berkala:** asma, PPOK, diabetes, stroke, resusitasi, penyakit infeksi, dan formularium perlu audit minimal tahunan atau segera setelah rilis PNPK/Fornas baru.

## 10. Tautan Primer

- Kemenkes Juknis TB-SO 2025: https://p2.kemkes.go.id/wp-content/uploads/2025/12/Buku-Petunjuk-Teknis-Penatalaksanaan-Tuberkulosis-Sensitif-Obat-di-Indonesia_FINAL.pdf
- WHO TB Module 4, 2025: https://www.who.int/publications/b/77823
- GINA 2026: https://ginasthma.org/2026-gina-strategy-report/
- GOLD 2026: https://goldcopd.org/2026-gold-report-and-pocket-guide/
- WHO Arboviral Clinical Management 2025: https://www.who.int/publications/i/item/9789240111110
- WHO Meningitis 2025: https://www.who.int/publications/i/item/9789240108042
- WHO Wasting Guideline 2023: https://www.who.int/publications/i/item/9789240082830/
- WHO PPH consolidated guideline: https://www.who.int/publications/b/81071
- AHA/ASA Acute Ischemic Stroke 2026: https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke
- AHA CPR/ECC 2025: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/executive-summary
- ACR Gout Guideline 2020: https://rheumatology.org/gout-guideline
- NICE Osteoarthritis NG226: https://www.nice.org.uk/guidance/ng226/chapter/Recommendations
- ESC Heart Failure 2021: https://academic.oup.com/eurheartj/article/42/36/3599/6358045
- Kemenkes implementasi ILP/SAJI 2025: https://kesprimkom.kemkes.go.id/konten/127/133/0/puskesmas-fokus-wujudkan-masyarakat-hidup-sehat
- Kurikulum Keterampilan Dasar Kader Posyandu: https://siakpel.kemkes.go.id/upload/akreditasi_kurikulum/kurikulum-1-39373538-3039-4333-b230-363232383734.pdf
- ACOG UTI in Pregnancy (reaffirmed 2026): https://www.acog.org/clinical/clinical-guidance/clinical-consensus/articles/2023/08/urinary-tract-infections-in-pregnant-individuals
- WHO Medical Eligibility Criteria for Contraceptive Use, 6th ed. (2025): https://www.who.int/publications/b/81082
- WHO mhGAP Guideline (2023): https://www.who.int/publications/b/70678
- NICE Acute Cough NG120: https://www.nice.org.uk/guidance/ng120/chapter/Recommendations
- NICE Low Back Pain NG59: https://www.nice.org.uk/guidance/ng59/chapter/Recommendations
- NICE Dyspepsia CG184: https://www.nice.org.uk/guidance/cg184/chapter/Recommendations
- AAO-HNSF BPPV: https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/bppv/
- AAO-HNSF Nosebleed: https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/nosebleed-epistaxis/
- CDC Varicella Clinical Guidance: https://www.cdc.gov/chickenpox/hcp/clinical-guidance/index.html
- WHO Low Back Pain Guideline (2023): https://www.who.int/publications/i/item/9789240081789
- NICE Bronchiolitis NG9: https://www.nice.org.uk/guidance/ng9/chapter/Recommendations
- BTS Pleural Disease Guideline: https://www.brit-thoracic.org.uk/clinical-resources/guidelines/pleural-disease/

## 11. Kesimpulan

Standar yang paling defensible untuk PRIMERA bukan "selalu pakai tahun terbaru", melainkan:

> Gunakan floor Kemenkes yang masih berlaku; gantikan keputusan yang tertinggal dengan EBM lebih kuat dan lebih baru; lalu turunkan penerapannya secara jujur ke kemampuan FKTP dan jejaring Indonesia.

Gelombang ini menerapkan prinsip tersebut pada keputusan yang paling berisiko, mengunci hasilnya dengan tes, dan meninggalkan daftar gap yang dapat dilanjutkan tanpa mengklaim penyelesaian palsu.
