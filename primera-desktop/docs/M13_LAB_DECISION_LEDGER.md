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
