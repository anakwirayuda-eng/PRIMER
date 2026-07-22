# Pemetaan Respons KLB Berdasarkan Rute dan Sumber Penularan

**Tanggal telaah:** 17 Juli 2026  
**Cakupan:** 23/23 kasus `PACK.kasus` yang memiliki `ambangKluster`
**Tujuan:** mencegah kartu tindakan KLB memakai respons droplet untuk penyakit
yang ditularkan melalui pangan, tanah, air tawar, kontak seksual, fomit, atau
lingkungan yang terkontaminasi urine hewan.

## Prinsip desain

1. Verifikasi diagnosis dan penyelidikan Orang-Tempat-Waktu tetap wajib untuk
   semua kluster.
2. Tindakan pengendalian harus mengikuti rute/sumber penularan yang telah
   diverifikasi, bukan kategori organ atau gejala pasien.
3. Tatalaksana klinis pasien dan pengendalian populasi dibedakan. Contohnya,
   oralit tepat untuk pasien diare yang membutuhkan rehidrasi, tetapi bukan
   respons universal untuk hepatitis A atau tifoid walau ketiganya fekal-oral.
4. Kasus baru tanpa pemetaan tidak boleh jatuh diam-diam ke droplet. Runtime
   memakai respons aman "verifikasi dan koordinasikan", sedangkan invariant
   test wajib gagal sampai penulis menambahkan pemetaan eksplisit.
5. [Permenkes 1/2026](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-1-tahun-2026)
   menjadi kerangka umum kewaspadaan dini, penyelidikan epidemiologi, identifikasi
   sumber/rute, tindakan spesifik, komunikasi risiko, dan pemulihan. Sumber WHO
   atau CDC di bawah menjadi grounding tindakan spesifik penyakit.

## Registry 23 kasus

| Pola | Kasus | Esensi tindakan benar | Grounding utama |
|---|---|---|---|
| `vektor` | `dengue_df` | PSN/source reduction dan kendali Aedes terpadu; fogging bukan pengganti PSN | WHO Dengue |
| `fekal_oral` | `diare_akut_anak`, `demam_tifoid`, `lab_hepatitis_a_akut` | Air aman, sanitasi, CTPS, higiene pangan, telusuri sumber | WHO Diarrhoeal disease; Typhoid; Hepatitis A |
| `pangan_toksin` | `lab_keracunan_makanan_ringan` | Hentikan/tarik pangan tersangka, telusuri rantai dan penjamah, sampling sesuai protokol | WHO Food safety |
| `tanah_helminth` | `lab_cacing_tambang` | Deworming kelompok berisiko sesuai program, sanitasi, alas kaki | WHO Soil-transmitted helminths |
| `air_tawar_keong` | `lab_skistosomiasis_sulteng` | Praziquantel kelompok sasaran, WASH, kurangi pajanan air tawar, kendali keong/One Health | WHO Schistosomiasis |
| `zoonosis_lingkungan` | `lab_leptospirosis_tanpa_komplikasi` | Hindari air/soil tercemar, lindungi luka, APD/sepatu bot, air aman, kendali rodensia | CDC Leptospirosis |
| `seksual` | `lab_gonore_uretritis_pria`, `lab_sindrom_duh_genital_servisitis`, `lab_sifilis_primer` | Layanan rahasia, tes/obati kasus dan pasangan, kondom, skrining IMS terkait | WHO Gonorrhoea; STIs; Syphilis |
| `skabies_serumah` | `skabies` | Tangani kasus dan semua anggota rumah/kontak erat serentak, bersihkan linen/pakaian | WHO Scabies |
| `kontak_fomit` | `konjungtivitis_bakterial`, `lab_tinea_kapitis_anak` | Tangani kasus, higiene tangan, jangan berbagi handuk/sisir/topi, periksa kontak bergejala | CDC Conjunctivitis; Ringworm |
| `kusta_kontak_erat` | `lab_kusta_pausibasiler` | MDT dini, skrining kontak dengan kerahasiaan/persetujuan, SDR-PEP hanya yang eligible sesuai program | WHO Leprosy |
| `airborne_tb` | `tb_paru` | Investigasi kontak, tes melalui jejaring, TPT eligible, ventilasi, penemuan kasus aktif | WHO TB preventive treatment dan IPC |
| `droplet_rutin` | `ispa_common_cold`, `lab_pneumonia_komunitas_dewasa`, `pneumonia_balita` | Etika batuk/masker saat sakit, ventilasi, higiene tangan, temukan/tangani kasus dan faktor risiko | WHO Pneumonia |
| `influenza` | `lab_influenza_tanpa_komplikasi` | Kurangi kontak saat sakit, masker/etika batuk, ventilasi/higiene, lindungi kelompok risiko, vaksinasi sesuai kebijakan | WHO Influenza |
| `parotitis` | `lab_parotitis_mumps` | Isolasi lima hari sejak parotitis, pantau kontak, telaah MMR bila tersedia; MMR pascapajanan bukan jaminan | CDC Mumps outbreak strategy |
| `pertusis` | `lab_pertusis_remaja` | Obati/isolasi kasus, nilai kontak rumah dan kelompok risiko terutama bayi, PEP sesuai protokol, cek DPT | CDC Pertussis PEP |
| `meningokokus` | `lab_meningitis_bakterial_suspek` | Laporkan segera, verifikasi, kewaspadaan droplet, telusuri/pantau kontak erat 14 hari, koordinasikan kemoprofilaksis | Kemenkes Panduan Deteksi dan Respon Meningitis Meningokokus; WHO Meningitis Toolkit 2026 |

## Sumber resmi

- WHO, [Dengue](https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue).
- WHO, [Diarrhoeal disease](https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease).
- WHO, [Typhoid](https://www.who.int/news-room/fact-sheets/detail/typhoid).
- WHO, [Hepatitis A](https://www.who.int/news-room/fact-sheets/detail/hepatitis-a).
- WHO, [Food safety](https://www.who.int/news-room/fact-sheets/detail/food-safety).
- WHO, [Soil-transmitted helminth infections](https://www.who.int/news-room/fact-sheets/detail/soil-transmitted-helminth-infections).
- WHO, [Schistosomiasis](https://www.who.int/news-room/fact-sheets/detail/schistosomiasis).
- CDC, [Preventing leptospirosis after flooding](https://www.cdc.gov/leptospirosis/prevention/index.html).
- WHO, [Gonorrhoea](https://www.who.int/news-room/fact-sheets/detail/gonorrhoea-%28neisseria-gonorrhoeae-infection%29).
- WHO, [Sexually transmitted infections](https://www.who.int/news-room/fact-sheets/detail/sexually-transmitted-infections-%28stis%29).
- WHO, [Syphilis](https://www.who.int/news-room/fact-sheets/detail/syphilis).
- WHO, [Scabies](https://www.who.int/news-room/fact-sheets/detail/scabies).
- CDC, [Conjunctivitis prevention](https://www.cdc.gov/conjunctivitis/prevention/index.html).
- CDC, [Ringworm prevention](https://www.cdc.gov/ringworm/aboutemergingringworm/index.html).
- WHO, [Leprosy](https://www.who.int/news-room/fact-sheets/detail/leprosy).
- WHO, [Tuberculosis preventive treatment update](https://www.who.int/news/item/09-09-2024-who-releases-updated-guidelines-on-tuberculosis-preventive-treatment).
- WHO, [Tuberculosis infection prevention and control](https://iris.who.int/bitstream/handle/10665/311259/9789241550512-eng.pdf).
- WHO, [Pneumonia in children](https://www.who.int/westernpacific/newsroom/fact-sheets/detail/pneumonia).
- WHO, [Influenza](https://www.who.int/europe/news-room/fact-sheets/item/influenza).
- CDC, [Mumps outbreak control](https://www.cdc.gov/mumps/php/public-health-strategy/index.html).
- CDC, [Pertussis post-exposure prophylaxis](https://www.cdc.gov/pertussis/php/postexposure-prophylaxis/index.html).
- Kemenkes, [Panduan Deteksi dan Respon Meningitis Meningokokus](https://infeksiemerging.kemkes.go.id/document/panduan-deteksi-dan-respon-meningitis-meningokokus/view).
- WHO, [Bacterial meningitis outbreak toolkit for frontline healthcare workers](https://www.who.int/publications/i/item/B09660/).

## Batas interpretasi

Pemetaan ini menentukan jawaban tindakan pengendalian pada simulasi, bukan
protokol lapangan lengkap. Pemilihan obat, PEP, vaksinasi, sampling, atau
intervensi massal tetap memerlukan kebijakan Kemenkes/Dinkes, kelayakan pasien,
ketersediaan lokal, dan koordinasi lintas sektor. Bahasa kartu sengaja memakai
"sesuai program/protokol/kebijakan" pada titik tersebut agar EBM tidak berubah
menjadi instruksi improvisasi di FKTP.
