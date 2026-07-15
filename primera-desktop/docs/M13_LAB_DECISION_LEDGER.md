# M13 Lab Decision Ledger

> Clone: `D:\Dev\PRIMER-CODEX-lab\primera-desktop`
> Status: full-fledge lab prototype, bukan release kurikulum teradjudikasi
> Runtime label: `lab_prototype_unadjudicated`

## Aturan Operasi

- PPK/PNPK Kemenkes aktif adalah floor; EBM yang lebih baru boleh mengganti
  floor bila sumbernya disebut dan keputusan tetap masuk akal untuk FKTP.
- Fornas 1199/2025 menentukan status/restriksi, bukan jaminan stok lokal.
- Seluruh ekspansi lab Career-only. Pool Ujian tidak berubah.
- Ledger ini hanya mencatat konflik material yang mengubah diagnosis, terapi,
  stabilisasi, atau disposisi. Tidak ada physician sign-off yang direkayasa.

## Batch 1 - 2026-07-16

**Aktivasi:** 25 kasus poli baru, terdiri dari 18 kasus SKDI 4A dan 7 kasus
3A/3B rujuk. Cakupan tersertifikasi FKTP naik dari 48/144 menjadi 66/144.

**Sumber utama:** PPK Dokter FKTP KMK 1186/2022; PNPK Pneumonia Dewasa KMK
2147/2023; Permenkes 28/2021 Penggunaan Antibiotik; WHO bronchiolitis 2026;
WHO hepatitis A 2026; WHO/CDC helminth guidance; NICE CG141 untuk perdarahan
GI atas; Fornas KMK 1199/2025.

| ID | Konflik material | Keputusan prototipe |
|---|---|---|
| `lab_pneumonia_komunitas_dewasa` | PPK lama memuat pilihan makrolida/doksisiklin; regulasi antibiotik dan PNPK lebih baru menempatkan penilaian berat serta amoksisilin rawat jalan | Amoksisilin 500 mg tiap 8 jam, 5-7 hari untuk pasien stabil tanpa komorbid; evaluasi 48-72 jam |
| `lab_rinitis_vasomotor` | Kortikosteroid intranasal didukung PPK, tetapi flutikason nasal tidak ditandai sebagai Fornas FKTP dalam katalog lab | Flutikason menjadi answer-key ideal; ketidaktersediaan tidak boleh diganti antibiotik/dekongestan berkepanjangan |
| `lab_hepatitis_a_akut` | PPK lama memuat terapi simptomatik; WHO 2026 menekankan menghindari obat yang tidak perlu dan dapat membebani hati | Terapi suportif; parasetamol tidak menjadi jawaban benar, tetapi juga tidak diperlakukan sebagai kontraindikasi absolut |
| `lab_skistosomiasis_sulteng` | Prazikuantel Fornas antisistosoma dibatasi untuk fokus Sulawesi Tengah | Vignette menyebut pajanan Lembah Napu dan terapi dikoordinasikan melalui program |
| `lab_edema_paru_akut_hipertensif` | Furosemid injeksi tidak diasumsikan ready pada baseline Sukamaju | Dudukkan, oksigen, nitrat selektif bila tekanan darah aman, lalu transfer; tidak ada klik wajib furosemid injeksi |
| `lab_perdarahan_gi_atas` | PPK lama memuat NGT/lavage dan PPI; NICE tidak menjadikan PPI pra-endoskopi sebagai langkah universal | ABC, akses IV/cairan terukur, oksigen karena hipoksemia, dan transfer; PPI/lavage tidak menjadi blocker |
| `lab_abses_peritonsil` | Antibiotik oral tidak aman bila jalan napas terancam atau pasien tidak dapat menelan | Vignette eksplisit masih dapat menelan dan tanpa stridor; amoksisilin-klavulanat pra-rujuk dinilai benar, drainase buta dinilai berbahaya |

## Batch 2-3 - 2026-07-16

**Aktivasi:** 78 kasus poli SKDI-4A baru (39 + 39). Seluruh 144 baris katalog
FKTP kini tertaut satu-ke-satu ke 144 kasus playable unik di mode Karier;
total pool poli Karier menjadi 176 kasus. Pool Ujian tetap tidak berubah.

**Sumber utama:** PPK Dokter FKTP KMK 1186/2022 beserta amandemennya; PNPK
terkait; Fornas KMK 1199/2025; pedoman program Kemenkes; WHO untuk EBM yang
lebih baru. Status obat program atau pengadaan lokal disebut eksplisit dan
tidak disamarkan sebagai ketersediaan Fornas.

| ID | Konflik material | Keputusan prototipe |
|---|---|---|
| `lab_kejang_demam_sederhana` | Antipiretik memperbaiki kenyamanan tetapi tidak mencegah kekambuhan kejang demam | Parasetamol dibuat opsional; pertolongan kejang dan safety-net tetap kritis |
| `lab_gonore_uretritis_pria`, `lab_sindrom_duh_genital_servisitis` | Regimen gonore PPK lama sudah tertinggal oleh rekomendasi WHO 2024 dan pola resistensi | Seftriakson 1 g IM dosis tunggal; doksisiklin ditambahkan bila klamidia belum disingkirkan |
| `lab_fimosis_patologis_ringan` | Katalog lama hanya punya betametason 0,1%, sedangkan PPK menyebut 0,05% | Tambah sediaan 0,05%; tidak menukar konsentrasi diam-diam |
| `lab_defisiensi_mineral_zinc` | Zinc dispersibel Fornas ditujukan untuk diare anak, bukan dugaan defisiensi zinc dewasa | Diet dan evaluasi penyebab menjadi inti; suplementasi spesifik melalui jejaring bila terkonfirmasi |
| `lab_kusta_pausibasiler` | MDT adalah pasokan program; komposisi regimen nasional dapat berbeda dari WHO terbaru, dan keterlibatan saraf dapat mengubah klasifikasi | Vignette PB dibuat dua lesi, BTA negatif, tanpa keterlibatan saraf; gunakan blister program aktif dan jangan merakit regimen bebas dari stok umum |
| `lab_ruptur_perineum_derajat_1` | Draf awal menyebut derajat 2 tetapi memakai ICD O70.0 (derajat 1) | Skenario direkonsiliasi menjadi robekan derajat 1 dengan rembesan aktif; otot dan sfingter utuh |
| `lab_tinea_kapitis_anak`, `lab_limfadenitis_servikal_akut`, `lab_ektima_tungkai` | Sediaan dewasa 500-625 mg tidak layak menjadi satu-satunya pilihan untuk pasien anak | Gunakan griseofulvin 125 mg dan sefadroksil sirup 125 mg/5 mL yang tercantum Fornas |
| `lab_pedikulosis_pubis` | PPK lama memakai benzil benzoat 25%; EBM menerima permetrin 1%, tetapi Fornas hanya memuat krim 5% | Losio 1% tersedia lewat pengadaan lokal dalam vignette; konsentrasi tidak disubstitusi diam-diam |
| `lab_tinea_unguium_terkonfirmasi` | Terbinafin tidak tersedia pada tingkat FKTP di Fornas, sedangkan griseofulvin tersedia | Gunakan griseofulvin setelah konfirmasi dan pemeriksaan keamanan yang relevan |
| `lab_eritrasma_lipat_paha` | Tetrasiklin topikal PPK dan eritromisin topikal tidak tersedia di katalog/Fornas FKTP | Lesi terbatas memakai mupirosin topikal yang tersedia; hindari antibiotik sistemik otomatis |
| `lab_dermatitis_kontak_iritan_tangan`, `lab_dermatitis_atopik_ringan`, `lab_dermatitis_numularis`, `lab_dermatitis_popok_iritan`, `lab_akne_vulgaris_ringan`, `lab_hidradenitis_supuratif_hurley1`, `lab_dermatitis_perioral` | Beberapa pilihan topikal EBM tidak tercantum sebagai item Fornas | Skenario menyebut pengadaan lokal/OTC; pilihan non-Fornas wajib memiliki catatan availability dan tidak memicu substitusi antibiotik sistemik |

## Sumber Daring

- Kemenkes, PNPK Pneumonia Dewasa 2023:
  https://www.kemkes.go.id/id/pnpk-2023---tata-laksana-pneumonia-pada-dewasa
- WHO, bronchiolitis and childhood asthma guideline 2026:
  https://www.who.int/publications/i/item/9789240122680
- WHO, Hepatitis A, 14 May 2026:
  https://www.who.int/news-room/fact-sheets/detail/hepatitis-a
- CDC, Clinical Care of Strongyloides:
  https://www.cdc.gov/strongyloides/hcp/clinical-care/index.html
- WHO, Schistosomiasis:
  https://www.who.int/news-room/fact-sheets/detail/schistosomiasis
- WHO, Taeniasis/cysticercosis:
  https://www.who.int/news-room/fact-sheets/detail/taeniasis-cysticercosis
- NICE CG141, acute upper GI bleeding:
  https://www.nice.org.uk/guidance/cg141/chapter/Recommendations
- Kemenkes, Fornas KMK 1199/2025 (berlaku 1 April 2026):
  https://e-fornas.kemkes.go.id/guest/landing
- WHO, Leprosy fact sheet, 23 January 2026:
  https://www.who.int/news-room/fact-sheets/detail/leprosy
- WHO, updated gonorrhoea/chlamydia/syphilis recommendations, 2024:
  https://www.who.int/publications/i/item/9789240090767
