# M11 Fase-2 — Hasil Riset Pengayaan (mutiaraEbm + catatanRealita)

> **ERRATUM 2026-07-13:** dokumen ini adalah arsip kandidat riset 2026-07-10, bukan sumber implementasi terkini untuk lapisan realita FKTP. Adjudikasi 67/67 terbaru ada di [`M11_REALITA_FKTP_AUDIT_2026.md`](./M11_REALITA_FKTP_AUDIT_2026.md). Fornas yang berlaku saat audit adalah **KMK HK.01.07/MENKES/1199/2025**; **KMK 730/2025 bukan Fornas**, melainkan nilai klaim harga obat Program Rujuk Balik. Jangan menyalin klaim stok, tingkat fasilitas, atau angka SDM dari dokumen lama ini tanpa verifikasi ulang.

**Status: ARSIP RISET KANDIDAT — superseded untuk keputusan item 7.** Dihasilkan oleh workflow multi-agen
`m11-pengayaan-riset` (7 finder per-file kasus → verifikasi WebSearch per-kandidat vs guideline 
WHO/Kemenkes/PPK/Fornas + konteks FKTP nyata Indonesia). 118 kandidat, 63/67 kasus tercakup.

**Ringkasan:** 55 `dikonfirmasi` langsung, 63 `perlu-nuansa` (draft sudah diperhalus verifikator — 
baca `catatanFinal`, itu versi FINAL siap-tempel, bukan draft asal). 104 keyakinan TINGGI, 14 SEDANG. 
**21 item bertanda ⚠KONTRADIKSI-CLUE** — verifikator menilai catatan ini mengoreksi/berlawanan dengan 
`clue` yang SUDAH tampil di game saat ini. Ini prioritas tertinggi untuk Anda tinjau: bisa berarti 
clue lama perlu diperbarui, bukan sekadar menambah catatan baru di sebelahnya.

Cara baca tiap entri: **[status · keyakinan · flag]** lalu teks final, lalu *sitasi*, lalu catatan verifikator singkat.

---

## ⚠ Prioritas — 21 item berpotensi mengoreksi clue lama

### `anemia_defisiensi_bumil` — Anemia Defisiensi Besi pada Kehamilan

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Mikrositik hipokrom tak selalu defisiensi besi — thalassemia trait lazim di Indonesia dan menirunya. Curigai bila eritrosit normal/tinggi (indeks Mentzer <13), riwayat keluarga, atau tak respons besi 1 bulan; jangan lanjut besi tanpa bukti defisiensi (risiko kelebihan besi).
  - *Sitasi:* Permenkes No. 88/2014; Pedoman Pengendalian Thalassemia Kemenkes; Indeks Mentzer (Indonesian J Clinical Pathology 2016); BJH 2021 (besi oral aman pada beta-thal minor bila defisiensi terbukti).
  - _Verifikator:_ Inti draft benar & sangat relevan FKTP Indonesia (negara sabuk thalassemia). Lab kasus (baris 746) & clue (baris 757) menyebut gambaran mikrositik hipokrom "khas defisiensi besi" tanpa menyebut thalassemia → note ini mengoreksi generalisasi itu, maka kontradiksiClue=true (untuk k…

### `disentri_basiler` — Disentri Basiler (Shigellosis)

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Satu kali mikroskopi feses negatif TIDAK menyingkirkan amubiasis — sensitivitas 1 sampel hanya ~33-50% (perlu feses segar-hangat & periksa serial). Bila tak membaik dengan siprofloksasin, pertimbangkan ameba/metronidazol; jangan sandarkan diagnosis pada satu hasil negatif.
  - *Sitasi:* WHO — tata laksana disentri/amubiasis (mikroskopi feses tunggal sensitivitas rendah; uji spesifik E. histolytica); Medscape/AMBOSS Amebiasis Workup 2023-24; PPK IDI 2017 (Disentri); LINTAS DIARE Kemenkes
  - _Verifikator:_ Inti draft BENAR & mutakhir: mikroskopi feses tunggal utk E. histolytica sensitivitasnya rendah (~33-50% 1 sampel; 3 sampel/≤10 hari baru 85-95%), trofozoit hanya terlihat pada feses segar-hangat, dan WHO kini menganjurkan uji antigen/PCR spesifik. Maka lab kasus ("trofozoit tida…

### `faringitis_akut` — Faringitis Akut Bakterial (Streptokokus Grup A)

- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Di Puskesmas, RADT dan kultur usap tenggorok praktis tak tersedia; diagnosis strep bertumpu pada skor Centor/McIsaac semata — rawan over/undertreatment. Skor lebih andal MENYINGKIRKAN strep daripada memastikannya; jangan klaim 'pasti strep', andalkan skor plus konteks.
  - *Sitasi:* IDSA GAS Pharyngitis Guideline 2025 (skor klinis); PPK Kemenkes (KMK No. 1936/2022); studi validasi McIsaac di Puskesmas (Sari, Maj. Kedokteran Sriwijaya / Sari Pediatri)
  - _Verifikator:_ Premis realita terkonfirmasi kuat: RADT & kultur usap tenggorok praktis tak tersedia di Puskesmas (studi validasi McIsaac Indonesia menyebut ketersediaan RADT/tes molekuler 'masih terbatas'), sehingga diagnosis strep memang sepenuhnya klinis. Risiko over/undertreatment nyata. Ref…

### `jiwa_insomnia` — 'Higiene tidur' saja bukti lemah — inti CBT-I adalah kontrol stimulus & pembatasan tidur

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** Higiene tidur sebagai terapi TUNGGAL buktinya lemah — AASM justru merekomendasikan jangan dipakai sendirian. Komponen CBT-I yang efektif: kontrol stimulus (tempat tidur hanya untuk tidur; keluar bila tak bisa tidur) & pembatasan tidur. Membagikan leaflet higiene ≠ mengobati.
  - *Sitasi:* AASM Clinical Practice Guideline: Behavioral & Psychological Treatments for Chronic Insomnia (J Clin Sleep Med, 2021); ACP Clinical Practice Guideline: Management of Chronic Insomnia in Adults (Ann Intern Med, 2016)
  - _Verifikator:_ Terkonfirmasi kuat. AASM 2021 secara eksplisit merekomendasikan AGAINST higiene tidur sebagai terapi tunggal untuk insomnia kronik, dan merekomendasikan kontrol stimulus + pembatasan tidur (sleep restriction) sebagai single-component therapy yang efektif. ACP 2016 menempatkan CBT…

### `kia_anc_kehamilan_normal` — ANC — Kehamilan Normal (Trimester 2)

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Ambang anemia T2 lebih rendah: <10,5 g/dL (vs <11 di T1/T3), karena volume plasma naik lebih cepat dari massa eritrosit → Hb turun fisiologis, nadir ~minggu 28-34. Jadi Hb 10,5-10,9 di T2 masih normal, bukan anemia. Lanjutkan Fe profilaksis, jangan buru-buru naik ke dosis terapi.
  - *Sitasi:* WHO Guideline on Haemoglobin Cutoffs to Define Anaemia 2024; Kemenkes Buku Saku Pencegahan Anemia pada Ibu Hamil 2023
  - _Verifikator:_ Inti draft benar & mutakhir: WHO 2024 kini memakai cutoff per-trimester (T1/T3 <110 g/L, T2 <105 g/L=10,5) dan Kemenkes 2023 memakai skema sama (anemia T2 <10,5). Fisiologi hemodilusi (plasma naik lebih cepat dari eritrosit, nadir ~28-34 mgg) terkonfirmasi; "28-32" pada draft sed…

### `kia_preeklampsia_berat` — Proteinuria TIDAK wajib untuk diagnosis preeklampsia berat — absennya tak menyingkirkan

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** Preeklampsia berat bisa ditegakkan TANPA proteinuria: hipertensi + ≥1 tanda berat (trombositopenia, SGOT/SGPT/kreatinin naik, edema paru, nyeri kepala/gangguan visus, nyeri epigastrium). Jangan tunda MgSO4/rujuk hanya karena protein urin negatif; edema bukan kriteria.
  - *Sitasi:* ACOG Practice Bulletin 222 (2020); ISSHP 2018; PNPK Preeklampsia POGI/Kemenkes 2016
  - _Verifikator:_ Klaim terkonfirmasi kuat & mutakhir. ACOG 2020 (PB 222) menghapus proteinuria sebagai syarat wajib: hipertensi + severe features/disfungsi organ sudah cukup untuk preeklampsia berat (TD ≥160/110 ATAU ≥140/90 + tanda berat). PNPK POGI/Kemenkes 2016 juga mengakui preeklampsia via h…

### `kulit_dermatitis_kontak` — Dermatitis Kontak Alergi

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** Dermatitis kontak ALERGI dan IRITAN tampak identik secara klinis; pada ibu rumah tangga dengan tangan terus basah (air, sabun, detergen), penyebab tersering justru IRITAN, bukan alergi. Keduanya tak bisa dipisahkan pasti tanpa uji tempel — jangan terpaku pada label 'alergi'.
  - *Sitasi:* PPK PERDOSKI 2021 (Dermatitis Kontak Iritan & Alergi); Panduan Praktik Klinis Dokter FKTP (Permenkes 5/2014)
  - _Verifikator:_ Draft EBM-akurat dan siap pakai. Presentasi kasus (IRT, detergen baru, wet-work harian, mereda saat libur, lesi terbatas di dorsum manus) adalah gambaran klasik DERMATITIS KONTAK IRITAN, bukan alergi — air/sabun/detergen adalah iritan lemah penyebab DKI kumulatif kronik; riwayat …

### `kulit_herpes_zoster` — Herpes Zoster

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** Batas 72 jam bukan tenggat mutlak: asiklovir tetap bermanfaat >72 jam bila masih ada vesikel BARU, atau pada imunokompromais/DM, zoster oftalmikus, dan lansia. Jangan tolak antivirus hanya karena pasien datang hari ke-4 — DM + usia lanjut tetap indikasi terapi.
  - *Sitasi:* CDC Shingles Clinical Overview (HCP) 2024; PPK PERDOSKI Herpes Zoster; CDK Journal 2023 (Herpes Zoster pada Lansia DM)
  - _Verifikator:_ Draft faktual & mutakhir. CDC Shingles Clinical Overview (HCP) menegaskan antivirus paling efektif <72 jam TETAPI tetap diindikasikan >72 jam bila lesi/vesikel baru masih timbul, atau pada imunokompromais, usia >50, dan zoster oftalmikus/komplikata — persis framing draft. Literat…

### `kulit_pedikulosis_kapitis` — Pedikulosis Kapitis (Kutu Kepala)

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** Nits yang menempel BUKAN bukti infestasi AKTIF — cangkang telur kosong bisa bertahan berbulan-bulan; diagnosis aktif butuh menemukan KUTU/nimfa HIDUP. Gagal terapi permetrin sering karena RESISTENSI piretroid, bukan semata reinfestasi kontak — pertimbangkan ganti agen.
  - *Sitasi:* CDC Head Lice (Diagnosis & Clinical Care) 2024; AAP Clinical Report "Head Lice" 2022 (Pediatrics 150(4):e2022059282)
  - _Verifikator:_ Kedua klaim draft terkonfirmasi kuat oleh sumber otoritatif terkini. (1) CDC: diagnosis infestasi AKTIF butuh menemukan kutu/nimfa HIDUP; nits >¼ inci (~1 cm) dari kulit kepala hampir selalu sudah menetas/mati, cangkang kosong melekat berbulan-bulan, dan nits dekat kulit kepala p…

### `kulit_pioderma_impetigo` — Pioderma — Impetigo Krustosa

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** Mengobati impetigo TIDAK terbukti mencegah glomerulonefritis pascastreptokokus (GNAPS) — beda dari demam rematik. Jangan janjikan antibiotik 'mencegah komplikasi ginjal'; ia diberi untuk mempercepat sembuh & memutus penularan. Tetap pantau tanda GNAPS (bengkak, urin merah).
  - *Sitasi:* CDC Clinical Guidance for Group A Streptococcal Impetigo 2024; AAFP "Poststreptococcal Illness" 2018; IDSA SSTI 2014; Cochrane "Interventions for impetigo" 2012
  - _Verifikator:_ Klaim inti draft valid & mutakhir. CDC (GAS Impetigo Guidance): antibiotik sistemik membunuh streptokokus kulit TAPI "do not appear to prevent glomerulonephritis" — hanya menekan penyebaran strain nefritogenik di populasi, bukan mencegah GNAPS individu. AAFP 2018 menegaskan antib…

### `mm_isk_bawah` — Infeksi Saluran Kemih Bawah (Sistitis)

- **[realita · PERLU-NUANSA · SEDANG · ⚠KONTRADIKSI-CLUE]** Kotrimoksazol lini pertama mengandaikan resistensi lokal <20%, padahal resistensi E. coli di Indonesia umumnya >20% (AMRIN ~29–56%). Nitrofurantoin/fosfomisin lebih ideal tapi sering kosong di Puskesmas — jadi kotrimoksazol, bahkan siprofloksasin, kerap tetap dipakai.
  - *Sitasi:* IDSA/ESCMID 2011 (Gupta et al., Clin Infect Dis 52:e103); AMRIN Study (Kemenkes, E. coli resisten kotrimoksazol 29% komunitas / 56% RS); Fornas (kesesuaian obat FKTP ~50–62%)
  - _Verifikator:_ Web mengonfirmasi premis inti: IDSA/ESCMID 2011 hanya membolehkan kotrimoksazol empiris bila resistensi lokal <20%, dan menempatkan nitrofurantoin & fosfomisin sebagai lini pertama (resistensi minimal). Di Indonesia resistensi E. coli thd kotrimoksazol umumnya melampaui ambang it…

### `mm_low_back_pain` — Low Back Pain Mekanik (Nyeri Punggung Bawah)

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Parasetamol tunggal TIDAK lebih unggul dari plasebo pada LBP akut (PACE, Lancet 2014); OAINS oral jadi lini pertama bila tak ada kontraindikasi lambung/ginjal/kardiovaskular. Parasetamol bukan monoterapi andalan, tapi berguna sebagai kombinasi atau saat OAINS kontraindikasi.
  - *Sitasi:* Williams et al., Lancet 2014 (PACE trial); NICE NG59 Low Back Pain & Sciatica (2016, rev. 2020); PPK Neurologi PERDOSSI 2016
  - _Verifikator:_ Inti draft SOLID & mutakhir: trial PACE (Lancet 2014, n=1652) menunjukkan parasetamol tak beda dari plasebo utk waktu pulih/nyeri/disabilitas LBP akut; NICE NG59 eksplisit "do not offer paracetamol alone" + OAINS lini pertama. Namun kunilai 'perlu-nuansa' (bukan 'dikonfirmasi') k…

### `mm_osteoartritis_lutut` — Osteoartritis Lutut

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Jebakan: parasetamol nyaris tak bermanfaat pada OA lutut (Lancet 2016); pedoman internasional (NICE/OARSI) utamakan OAINS TOPIKAL lini pertama. Tapi topikal tetap OAINS — pada pasien alergi NSAID ini justru kontraindikasi, jadi parasetamol + latihan tetap pilihan tepat.
  - *Sitasi:* da Costa et al., The Lancet 2016 (NMA OA, 58.556 pasien); NICE NG226 (2022); OARSI 2019; Rekomendasi Diagnosis & Penatalaksanaan OA IRA/PB IRA 2014; label diklofenak gel FDA (kontraindikasi hipersensitivitas NSAID)
  - _Verifikator:_ Inti draft BENAR & mutakhir: da Costa (Lancet 2016, 58.556 pasien) menyimpulkan parasetamol tunggal tak berperan pada OA berapa pun dosisnya; NICE NG226 (2022), ACR 2019, dan OARSI 2019 konsensus kuat menempatkan OAINS topikal (diklofenak gel) sebagai analgetik lini pertama, di a…

### `rinitis_alergi` — Rinitis Alergi

- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ARIA jadikan kortikosteroid intranasal (flutikason) lini utama rinitis persisten sedang-berat, tapi steroid semprot ini kerap tak tersedia di Puskesmas. Praktik nyata pakai antihistamin oral—sering CTM gen-1 yang murah tapi bikin kantuk, bukan loratadin/setirizin.
  - *Sitasi:* ARIA next-generation (GRADE) 2019, JACI; PPK Dokter FKTP (KMK 514/2015); Fornas (klorfeniramin/loratadin/setirizin terdaftar)
  - _Verifikator:_ Inti draft benar & mutakhir: ARIA menempatkan kortikosteroid intranasal sebagai lini utama AR persisten sedang-berat (dikonfirmasi ARIA-GRADE 2019 & PPK FKTP), sementara antihistamin oral non-sedatif (loratadin/setirizin) untuk kasus ringan/intermiten. Realita FKTP juga akurat: C…

### `saraf_bells_palsy` — Bell's Palsy (Parese Nervus Fasialis Perifer)

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** Absennya vesikel pada kunjungan pertama BELUM menyingkirkan Ramsay Hunt — vesikel bisa muncul beberapa hari SETELAH kelumpuhan (bahkan zoster sine herpete, tanpa ruam). Wajah lumpuh bilateral atau progresif >2 minggu juga bukan Bell's khas: cari penyebab lain.
  - *Sitasi:* AAFP Bell Palsy Rapid Evidence Review 2023; AAN Practice Guideline (Gronseth 2012); DermNet NZ / Medscape Ramsay Hunt Syndrome; PPK PERDOSSI Bell's Palsy.
  - _Verifikator:_ Semua klaim draft terverifikasi & mutakhir. (1) Sekitar 20% pasien Ramsay Hunt mengalami parese fasialis BEBERAPA HARI SEBELUM vesikel muncul, dan varian zoster sine herpete tak pernah beruam — RHS menyumbang hingga ~20% kasus yang awalnya didiagnosis Bell's (DermNet/Medscape). (…

### `saraf_epilepsi_kejang` — Epilepsi (Bangkitan Umum Tonik-Klonik Berulang)

- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Idealnya EEG + OAE oleh neurolog, tapi di banyak daerah keduanya tak terjangkau; WHO mhGAP membenarkan GP terlatih memulai OAE lini-1 (fenobarbital/valproat untuk bangkitan umum) sambil merujuk. Diazepam rektal untuk rescue sering kosong stok di Puskesmas.
  - *Sitasi:* WHO mhGAP-IG Epilepsy 2016; PPK PERDOSSI Epilepsi; Fornas (diazepam rektal 5 mg, OAE fenobarbital/valproat/fenitoin tingkat FKTP)
  - _Verifikator:_ Sisi idealis (EEG + OAE oleh neurolog, SKDI 3A wajib rujuk) benar per PPK PERDOSSI dan clue kasus. Sisi realita valid dan justru diperkuat: EEG/neurolog terpusat di kota/RS rujukan sehingga tak terjangkau di banyak kabupaten; WHO mhGAP secara eksplisit membenarkan tenaga non-spes…

### `stroke_iskemik` — Stroke Iskemik Akut

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** FAST bisa menyesatkan: stroke sirkulasi posterior sering TANPA pelo/kelemahan klasik — tampil sebagai vertigo mendadak, ataksia, atau diplopia dan mudah salah dilabel 'vertigo perifer'. Vertigo akut + tak mampu berdiri + faktor risiko vaskular → curigai stroke, pakai BE-FAST.
  - *Sitasi:* PERDOSSI Guideline Stroke 2011; KMK RI No. HK.01.07/MENKES/394/2019 (PNPK Tata Laksana Stroke); studi BE-FAST vs FAST — sensitivitas 97,8% vs 58,7% (Cureus 2024); prinsip HINTS untuk vertigo sentral vs perifer.
  - _Verifikator:_ Inti draft SAHIH & mutakhir: FAST tidak sensitif untuk sirkulasi posterior (~20% stroke iskemik); satu studi menemukan FAST hanya 58,7% vs BE-FAST 97,8%, ~39% stroke posterior FAST-negatif. Stroke serebelar/batang otak kerap tampil sebagai vertigo+ataksia+diplopia dan salah dilab…

### `tb_paru` — Tuberkulosis Paru

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** BTA sputum NEGATIF tak menyingkirkan TB (sensitivitas mikroskopis hanya ~50-60%; TB BTA-negatif lazim). Pedoman Nasional TB kini menjadikan TCM/GeneXpert pemeriksaan awal utama, bukan mikroskopis — jangan tunda OAT hanya karena BTA negatif.
  - *Sitasi:* Pedoman Nasional Penanggulangan TBC Kemenkes 2020 & Petunjuk Teknis TCM GeneXpert Kemenkes 2023; WHO Consolidated Guidelines on Tuberculosis, Module 3: Diagnosis 2021
  - _Verifikator:_ Ketiga klaim terverifikasi. Sensitivitas mikroskopis BTA ~50-60% (studi Indonesia 2022: ZN 58,8%; butuh 5.000-10.000 basil/mL) — figur "~50-60%" defensible. BTA-negatif tidak menyingkirkan TB: dikonfirmasi luas. TCM/GeneXpert sebagai tes awal utama menggantikan mikroskopis: kuat …

### `tht_epistaksis_anterior` — Epistaksis Anterior

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** TD tinggi saat mimisan sering reaktif thd nyeri/cemas & turun sendiri sesudah perdarahan berhenti; kausalitas HT–epistaksis lemah (asosiasi saja). Prioritas: tekan cuping 10-15 mnt + tenangkan lalu ukur ulang TD, bukan kejar penurunan TD akut. Kontrol HT jangka panjang tetap penting.
  - *Sitasi:* AAO-HNS CPG Nosebleed (Epistaxis) 2020 (Tunkel dkk.); Payne dkk. 2020, Otolaryngol Head Neck Surg; Jurnal Kesehatan Andalas — Epistaksis dan Hipertensi
  - _Verifikator:_ Draft faktual & mutakhir. AAO-HNS 2020 CPG (Tunkel) + komentar Payne 2020 menegaskan hubungan KAUSAL HT–epistaksis tidak terbukti (hanya asosiasi, studi metodologi lemah/tak terkontrol). Literatur emergensi (StatPearls/AFP/RCEM) menegaskan kenaikan TD saat mimisan umumnya reaktif…

- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Merocel & kauter perak-nitrat jarang ada di Puskesmas; realistisnya epistaksis anterior: tekan cuping 10-15 mnt, lalu tampon kasa+vaselin ± kapas ADRENALIN (epinefrin 1:10.000, andalan Fornas; oksimetazolin spray tak selalu distok). Bila tak berhenti, rujuk THT.
  - *Sitasi:* Alomedika/KalbeMed Epistaksis 2023-2024 (Merocel/rapid rhino tak tersedia di semua fasilitas; kapas adrenalin 1:10.000 rutin); Fornas 2023 (Kepmenkes HK.01.07/MENKES/2197/2023) & E-Katalog LKPP (oksimetazolin 0,025%); Permenkes 75/2014 standar peralatan Puskesmas; PPK PERHATI-KL Epistaksis.
  - _Verifikator:_ Inti draft VALID & bernilai pedagogis: sumber Indonesia (Alomedika/KalbeMed, jknamed, Galenical) mengonfirmasi Merocel/rapid rhino tak ada di semua fasilitas sedangkan tampon kasa+vaselin dibuat lokal; kauter umumnya perlu rujukan THT; kapas adrenalin/epinefrin 1:10.000 adalah va…

### `tht_rinosinusitis_akut` — Rinosinusitis Akut

- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** Di FKTP antibiotik sering diberikan sejak hari ke-1/2 untuk pilek biasa (over-prescribing). Di Fornas, amoksisilin-klavulanat direstriksi (lanjutan parenteral/uji resistensi), sehingga pilihan realistis adalah amoksisilin dosis adekuat — hanya bila kriteria bakterial terpenuhi.
  - *Sitasi:* Fornas 2023 (KMK HK.01.07/MENKES/2197/2023); EPOS 2020; studi rasionalitas antibiotik ISPA Puskesmas Indonesia (program POR Kemenkes)
  - _Verifikator:_ Ketiga klaim draft terverifikasi kuat. (1) Fornas 2023 merestriksi amoksisilin-klavulanat oral (hanya lanjutan terapi parenteral atau sesuai uji resistensi), sementara amoksisilin polos tersedia bebas di FKTP — jadi realistisnya amoksisilin polos yang dipakai. (2) Over-prescribin…


---

## Seluruh kandidat per file kasus

### kasusInfeksi.ts

**`ispa_common_cold`** — ISPA — Common Cold (Nasofaringitis Akut)

- **[ebm · KONFIRMASI · TINGGI]** Ingus yang berubah kuning atau hijau BUKAN tanda infeksi bakteri maupun indikasi antibiotik — warna itu berasal dari sel darah putih dan merupakan bagian normal common cold viral. Jangan terkecoh warna ingus/dahak untuk meresepkan antibiotik.
  - *Sitasi:* CDC Common Cold / Antibiotic Use (fact sheet 2024); Permenkes RI No. 28/2021 Pedoman Penggunaan Antibiotik
- **[realita · KONFIRMASI · TINGGI]** Guideline (POR Kemenkes) menetapkan antibiotik ISPA non-pneumonia harus ≤20%, tapi realitanya sering jauh melampaui (30–65% di banyak Puskesmas) — didorong tekanan pasien minta 'obat kuat' & konsultasi singkat yang tak cukup untuk edukasi penyakit swasirna.
  - *Sitasi:* Permenkes 28/2021 (Pedoman Penggunaan Antibiotik); Indikator POR Kemenkes RI — antibiotik ISPA non-pneumonia ≤20%; studi peresepan Puskesmas Indonesia 2021–2025

**`faringitis_akut`** — Faringitis Akut Bakterial (Streptokokus Grup A)

- **[ebm · KONFIRMASI · TINGGI]** Eksudat tonsil + pembesaran KGB leher TIDAK spesifik streptokokus — mononukleosis infeksiosa (EBV) meniru gambaran ini, dan amoxicillin pada mono kerap memicu ruam makulopapular luas. Curigai mono bila limfadenopati generalisata, splenomegali, atau pasien remaja/dewasa muda.
  - *Sitasi:* IDSA Clinical Practice Guideline Group A Streptococcal Pharyngitis 2012 (Shulman et al., CID); Chovel-Sella et al., Pediatrics 2013 (insiden ruam amoxicillin pada mononukleosis infeksiosa)
- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Di Puskesmas, RADT dan kultur usap tenggorok praktis tak tersedia; diagnosis strep bertumpu pada skor Centor/McIsaac semata — rawan over/undertreatment. Skor lebih andal MENYINGKIRKAN strep daripada memastikannya; jangan klaim 'pasti strep', andalkan skor plus konteks.
  - *Sitasi:* IDSA GAS Pharyngitis Guideline 2025 (skor klinis); PPK Kemenkes (KMK No. 1936/2022); studi validasi McIsaac di Puskesmas (Sari, Maj. Kedokteran Sriwijaya / Sari Pediatri)

**`dengue_df`** — Demam Dengue (DF)

- **[ebm · KONFIRMASI · TINGGI]** Fase paling berbahaya dengue justru saat demam TURUN (hari ke-4-6, defervescence): penurunan suhu kerap disalahartikan 'membaik', padahal inilah saat kebocoran plasma & syok mengintai. Justru pantauan tanda bahaya harus DIINTENSIFKAN saat demam reda.
  - *Sitasi:* WHO Dengue Guidelines 2009 (fase kritis/defervescence); PNPK Tata Laksana Infeksi Dengue Dewasa (Kemenkes/PAPDI)
- **[realita · PERLU-NUANSA · TINGGI]** Hct/trombosit serial dan NS1 tak selalu tersedia/terjangkau di Puskesmas, terutama daerah terpencil. Pemantauan bertumpu pada klinis & warning signs (uji torniket hanya penunjang), maka ambang merujuk untuk observasi ketat harus rendah begitu muncul warning sign.
  - *Sitasi:* WHO Dengue Guidelines 2009 (klasifikasi Grup A/B/C & rujukan); PNPK Tatalaksana Infeksi Dengue Dewasa (PAPDI/Kemenkes)

**`demam_tifoid`** — Demam Tifoid

- **[ebm · KONFIRMASI · TINGGI]** Di daerah endemis, demam akut jangan langsung dikunci sebagai tifoid — malaria & dengue tumpang-tindih gejalanya. Singkirkan malaria dulu dengan apusan darah tebal-tipis (atau RDT) sebelum bersandar pada Widal yang positif-palsunya tinggi.
  - *Sitasi:* Pedoman Tatalaksana Kasus Malaria Kemenkes RI (apus darah tebal-tipis/RDT); WHO Guidelines for Malaria 2023 (konfirmasi parasitologi sebelum terapi); PNPK Demam Tifoid Kemenkes (DDx malaria/dengue)
- **[realita · PERLU-NUANSA · SEDANG]** Kultur darah (baku emas) praktis tak ada di Puskesmas. WHO/global geser ke seftriakson/azitromisin/fluorokuinolon akibat resistensi, tapi S. typhi Indonesia umumnya masih sensitif kloramfenikol — Fornas jadikan lini-1: murah, efektif. Wajib tuntas + pantau hematologik.
  - *Sitasi:* WHO Typhoid treatment (azithromycin/ceftriaxone/ciprofloxacin); PPK Demam Tifoid IDAI/PAPDI (kloramfenikol lini-1, sefiksim/seftriakson lini-2 MDR); Fornas FKTP; data resistensi S. typhi Asia (Bangladesh 1999–2022, medRxiv 2023)

**`diare_akut_anak`** — Diare Akut pada Anak (Gastroenteritis Akut)

- **[ebm · KONFIRMASI · TINGGI]** Anak diare yang tampak HAUS dan minum lahap BUKAN tanda aman — itu justru dehidrasi ringan-sedang (WHO Rencana Terapi B). Bahaya sesungguhnya: anak LETARGIS, malas minum, atau tak bisa minum (dehidrasi berat, Terapi C). Jangan terlena oleh anak yang tampak haus.
  - *Sitasi:* WHO/Kemenkes Bagan MTBS 2015 (klasifikasi dehidrasi, WHO IMCI); Buku Saku LINTAS DIARE Kemenkes
- **[realita · KONFIRMASI · TINGGI]** Di lapangan orang tua kerap menuntut 'obat mampet' (loperamide/antimotilitas — kontraindikasi pada anak), antibiotik, atau infus; oralit sering ditolak anak karena rasa hingga oralit+zinc tak diteruskan 10 hari penuh di rumah, dan stok zinc dispersible sesekali kosong.
  - *Sitasi:* Buku Saku LINTAS DIARE Kemenkes; WHO/UNICEF Joint Statement — Clinical Management of Acute Diarrhoea 2004; IDSA Infectious Diarrhea Guideline 2017 (antimotilitas kontraindikasi pada anak)

**`tb_paru`** — Tuberkulosis Paru

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ BTA sputum NEGATIF tak menyingkirkan TB (sensitivitas mikroskopis hanya ~50-60%; TB BTA-negatif lazim). Pedoman Nasional TB kini menjadikan TCM/GeneXpert pemeriksaan awal utama, bukan mikroskopis — jangan tunda OAT hanya karena BTA negatif.
  - *Sitasi:* Pedoman Nasional Penanggulangan TBC Kemenkes 2020 & Petunjuk Teknis TCM GeneXpert Kemenkes 2023; WHO Consolidated Guidelines on Tuberculosis, Module 3: Diagnosis 2021
- **[realita · KONFIRMASI · TINGGI]** TCM/GeneXpert kini tes awal prioritas namun belum ada di semua Puskesmas — dahak dirujuk ke faskes ber-TCM, hasil tertunda. Keberhasilan OAT bergantung pada PMO; stigma & putus obat (angka keberhasilan program ~85%, di bawah target 90%) tetap tantangan nyata DOTS.
  - *Sitasi:* Pedoman Nasional Penanggulangan TBC Kemenkes (PNPK 2020) & Perpres 67/2021; PDPI Pedoman Diagnosis & Penatalaksanaan TB di Indonesia 2021; WHO Consolidated Guidelines on TB — Diagnosis (2021, TCM sbg tes awal); data program TBC (success rate ~85–86%)

**`skabies`** — Skabies (Kudis)

- **[ebm · PERLU-NUANSA · TINGGI]** Gatal bisa MENETAP 2–4 minggu pasca terapi BERHASIL (pruritus pascaskabies = reaksi hipersensitivitas terhadap antigen/feses tungau), BUKAN gagal terapi/reinfestasi — jangan buru-buru ulang skabisida. Curigai gagal HANYA bila muncul burrow/lesi BARU atau gatal >4 minggu.
  - *Sitasi:* CDC – About Scabies (2024); PPK PERDOSKI 2021; IACS 2020 Diagnostic Criteria for Scabies
- **[realita · PERLU-NUANSA · TINGGI]** Permetrin 5% (lini pertama Fornas) sering kosong di Puskesmas; andalan realistis adalah salep 2-4 (asam salisilat + sulfur presipitatum) — murah, tersedia luas, aman untuk bayi <2 bulan & ibu hamil. Tantangan nyata: obati serentak semua penghuni asrama/pesantren.
  - *Sitasi:* Fornas (permetrin 5% & salep 2-4); CDC Clinical Care of Scabies (HCP) 2024; PERDOSKI/MDVI 2023; Alomedika (skabies) 2023

**`konjungtivitis_bakterial`** — Konjungtivitis Bakterial

- **[ebm · PERLU-NUANSA · TINGGI]** Sekret purulen tak selalu bakterial: tanda klinis buruk memisahkan viral vs bakterial & mayoritas konjungtivitis swasirna. Viral (adenovirus) dominan pada dewasa & sangat menular, tapi pada ANAK bakterial lebih sering. Jangan refleks antibiotik tiap mata merah bersekret.
  - *Sitasi:* AAO PPP Conjunctivitis 2018; Rietveld dkk., BMJ 2004 (tanda klinis tak andal bedakan viral/bakterial); Cochrane antibiotik topikal 2012; PPK Dokter FKTP (Permenkes 5/2014); StatPearls Conjunctivitis 2023
- **[realita · PERLU-NUANSA · SEDANG]** Tetes mata steroid/steroid-antibiotik (mis. deksametason, Cendo Xitrol) sebenarnya obat KERAS wajib resep, tapi lazim ditebus tanpa resep di apotek — pasien swamedikasi steroid pada mata merah, berisiko memperberat keratitis herpes/glaukoma hingga ulkus kornea.
  - *Sitasi:* AAO Preferred Practice Pattern — Conjunctivitis (2018); Penjelasan BPOM RI — deksametason & tetes mata steroid = golongan Obat Keras wajib resep (2020)

### kasusKronis.ts

**`hipertensi_esensial`** — Hipertensi Esensial

- **[ebm · KONFIRMASI · TINGGI]** Keluhan tengkuk berat/pusing berkorelasi LEMAH dengan derajat TD — hipertensi umumnya asimptomatik; tengkuk tegang lebih sering nyeri otot/ansietas. Jangan takar kontrol atau ubah dosis dari "rasa tengkuk"; nilai lewat pengukuran TD berulang yang benar.
  - *Sitasi:* ICHD-3 kriteria 10.3 (2018); Konsensus Penatalaksanaan Hipertensi InaSH/PERHI 2019 & 2021; PPK Dokter di FKTP (Permenkes 5/2014)
- **[realita · PERLU-NUANSA · TINGGI]** Guideline menganjurkan skrining organ target hipertensi—EKG (LVH), rasio albumin-kreatinin/albuminuria, funduskopi—tetapi di banyak Puskesmas EKG belum merata, ACR jarang tersedia, dan funduskopi nyaris tak dikerjakan, sehingga kerusakan organ kerap luput terdeteksi.
  - *Sitasi:* Konsensus Penatalaksanaan Hipertensi InaSH 2019/2021; ESH Guidelines 2023; Permenkes 43/2019 (standar peralatan Puskesmas); program pemasangan EKG Puskesmas Kemenkes 2023.

**`dm_tipe2`** — Diabetes Melitus Tipe 2

- **[ebm · PERLU-NUANSA · TINGGI]** HbA1c bisa MENYESATKAN: palsu-TINGGI pada defisiensi besi; palsu-RENDAH bila putaran eritrosit naik (hemolisis, perdarahan, kehamilan); thalassemia/hemoglobinopati mengacaukan pembacaan. Bila janggal atau ada anemia, andalkan kriteria glukosa (GDP/GDS/TTGO).
  - *Sitasi:* PERKENI 2021 (keterbatasan HbA1c pd anemia/hemoglobinopati/gangguan eritrosit); lit. def. besi ↑ & hemolisis ↓ HbA1c (PMC 2018/2020); NGSP
- **[realita · PERLU-NUANSA · TINGGI]** Realita FKTP: HbA1c sering tak tersedia di Puskesmas (alat mahal, SDM terbatas) — pasien dirujuk ke lab; via Prolanis baru ditanggung BPJS tiap 6 bulan. Diagnosis & pemantauan harian umumnya bersandar GDP/GDS glukometer yang punya keterbatasan pra-analitik.
  - *Sitasi:* PERKENI 2021 (rev. 2024); Panduan Prolanis BPJS Kesehatan; Permenkes 43/2019 tentang standar Puskesmas; studi ketersediaan HbA1c FKTP (J. Mitra Keluarga, 2021)

**`gastritis`** — Gastritis (Dispepsia)

- **[ebm · KONFIRMASI · TINGGI]** PPI empiris bisa menyamarkan alarm keganasan lambung & membuat tes H. pylori (urea breath test, antigen tinja, biopsi) palsu-negatif — hentikan PPI ≥2 minggu sebelum tes. 'Membaik dengan PPI' BUKAN bukti penyakit jinak; tanda alarm tetap wajib endoskopi/rujuk.
  - *Sitasi:* Konsensus Dispepsia & Infeksi H. pylori Indonesia 2022 (Gut Pathogens 2023); Maastricht VI Consensus 2022; ACG Dyspepsia; NICE QS96
- **[realita · KONFIRMASI · TINGGI]** Strategi 'test-and-treat' H. pylori sulit di FKTP: urea breath test & antigen tinja hampir tak tersedia dan serologi tak bisa membedakan infeksi aktif vs lampau — realitanya dokter memberi PPI empiris; endoskopi untuk tanda alarm pun antre panjang lewat rujukan berjenjang.
  - *Sitasi:* Konsensus Nasional Penatalaksanaan Dispepsia & Infeksi H. pylori PGI 2014 (Adendum P-CAB 2024); sistem rujukan berjenjang BPJS (Permenkes)

**`asma_ringan`** — Asma Bronkial (Ringan)

- **[ebm · KONFIRMASI · TINGGI]** SpO2 normal (97% di kasus ini) TIDAK menyingkirkan asma bermakna atau serangan yang memburuk; hipoksemia dan 'dada senyap' (mengi hilang, aliran udara minimal) adalah tanda LAMBAT. Nilai keparahan dari kerja napas, bicara kalimat penuh, dan retraksi — bukan oksimetri saja.
  - *Sitasi:* GINA 2024 (Global Strategy for Asthma Management and Prevention) — tabel penilaian keparahan eksaserbasi akut; konsisten dengan PPK/PDPI
- **[realita · PERLU-NUANSA · TINGGI]** GINA menuntut tiap pasien asma dapat inhaler ICS (budesonid), tapi di FKTP praktis tak terjangkau: ICS inhaler = obat PRB yang butuh konfirmasi spesialis paru dulu, dan banyak Puskesmas hanya menyetok salbutamol/aminofilin oral — pasien baru kerap hanya dapat SABA.
  - *Sitasi:* GINA 2019–2025; Daftar Obat PRB / Fornas (KMK HK.01.07/MENKES/730/2025); Panduan Praktis Program Rujuk Balik BPJS Kesehatan

**`otitis_media_akut`** — Otitis Media Akut

- **[ebm · KONFIRMASI · TINGGI]** Gendang telinga MERAH saja bukan OMA — menangis/demam/manipulasi liang telinga bisa bikin membran timpani hiperemis. Diagnosis butuh membran MENONJOL (bulging)/efusi + tanda akut; tanpa itu risiko over-diagnosis & antibiotik berlebih (bedakan dari OME yang tak butuh antibiotik).
  - *Sitasi:* AAP Clinical Practice Guideline: Diagnosis and Management of Acute Otitis Media 2013 (Pediatrics 131:e964); PPK PERHATI-KL
- **[realita · PERLU-NUANSA · SEDANG]** Dosis tinggi amoksisilin 80–90 mg/kg/hari (AAP 2013) di lapangan sering menyusut jadi ~40–50 mg/kg/hari — memadai untuk pneumokokus peka, tapi bisa gagal pada strain resisten. Otoskop berfungsi pun tak selalu ada, sehingga 'bulging' tak ternilai dan diagnosis jadi terkaan.
  - *Sitasi:* AAP AOM Guideline 2013 (Lieberthal, Pediatrics); "Optimizing antibiotic use in Indonesia" systematic review 2022; Permenkes 43/2019 (peralatan Puskesmas)

**`anemia_defisiensi_bumil`** — Anemia Defisiensi Besi pada Kehamilan

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Mikrositik hipokrom tak selalu defisiensi besi — thalassemia trait lazim di Indonesia dan menirunya. Curigai bila eritrosit normal/tinggi (indeks Mentzer <13), riwayat keluarga, atau tak respons besi 1 bulan; jangan lanjut besi tanpa bukti defisiensi (risiko kelebihan besi).
  - *Sitasi:* Permenkes No. 88/2014; Pedoman Pengendalian Thalassemia Kemenkes; Indeks Mentzer (Indonesian J Clinical Pathology 2016); BJH 2021 (besi oral aman pada beta-thal minor bila defisiensi terbukti).
- **[realita · PERLU-NUANSA · TINGGI]** Di Puskesmas anemia bumil praktis ditegakkan dari Hb saja (sering Sahli/POCT yang akurasinya terbatas, error ±15–20%); MCV/MCH, ferritin, dan apusan darah tepi jarang tersedia — label 'mikrositik hipokrom' jadi asumtif dan TTD diberikan empiris ke semua bumil.
  - *Sitasi:* Permenkes No. 88/2014 (Standar TTD WUS & Bumil); Pedoman Pemberian TTD Bumil Kemenkes 2020; studi validitas metode Sahli vs sianmethemoglobin (error ±15–20%)

**`pneumonia_balita`** — Pneumonia Balita (Berat)

- **[ebm · PERLU-NUANSA · TINGGI]** Paru 'bersih' TAK menyingkirkan pneumonia anak — ronki sering tak terdengar; IMCI/MTBS menegakkan dari hitung napas + tarikan dinding dada, bukan stetoskop. Demam/tangis memalsukan takipnea: hitung 60 detik penuh saat anak tenang. Tapi bila ada tarikan dada, jangan tunda rujuk.
  - *Sitasi:* WHO IMCI Chart Book / Buku Bagan MTBS Kemenkes 2015-2022; IDAI: Hitung Napas Anak
- **[realita · KONFIRMASI · TINGGI]** Pra-rujukan 'oksigen lalu rujuk' sering terganjal realita: oksimeter & sumber oksigen tak selalu ada di Puskesmas — hipoksia mudah luput bila hanya andalkan tanda klinis — dan transport/ambulans ke RS anak bisa jauh, terutama di perdesaan, menghambat stabilisasi & rujukan tepat waktu.
  - *Sitasi:* WHO IMCI Chart Booklet 2014; Lancet Global Health 2024 (hipoksemia & pulse oximetry di layanan primer); Permenkes 43/2019 tentang Puskesmas; Pedoman Teknis Ambulans Kemenkes 2019

**`stroke_iskemik`** — Stroke Iskemik Akut

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ FAST bisa menyesatkan: stroke sirkulasi posterior sering TANPA pelo/kelemahan klasik — tampil sebagai vertigo mendadak, ataksia, atau diplopia dan mudah salah dilabel 'vertigo perifer'. Vertigo akut + tak mampu berdiri + faktor risiko vaskular → curigai stroke, pakai BE-FAST.
  - *Sitasi:* PERDOSSI Guideline Stroke 2011; KMK RI No. HK.01.07/MENKES/394/2019 (PNPK Tata Laksana Stroke); studi BE-FAST vs FAST — sensitivitas 97,8% vs 58,7% (Cureus 2024); prinsip HINTS untuk vertigo sentral vs perifer.
- **[realita · KONFIRMASI · TINGGI]** Window reperfusi (rtPA ≤4,5 jam/trombektomi) tak terjangkau mayoritas pasien: RS ber-CT jauh, alteplase mahal & hanya di RS rujukan, ambulans terbatas — apalagi wake-up stroke (onset sejak terakhir normal). Peran FKTP: stabilkan, rujuk cepat, cegah sekunder agresif.
  - *Sitasi:* PPK PERDOSSI Stroke Iskemik Akut; ECASS III (rtPA ≤4,5 jam) & AHA/ASA 2019 (trombektomi ≤6 jam); alteplase JKN via mekanisme non-INA-CBG (obat khusus, hanya FKRTL ber-ICU/stroke unit); program Kemenkes distribusi 514 CT scan 2023-2024

### kasusRespGi.ts

**`bronkitis_akut`** — Bronkitis Akut

- **[ebm · KONFIRMASI · TINGGI]** Dahak yang berubah kuning atau kehijauan pada bronkitis akut BUKAN bukti infeksi bakteri — warna itu berasal dari sel radang (mieloperoksidase), sehingga sputum purulen sekalipun tidak menjadi alasan memberi antibiotik.
  - *Sitasi:* NICE NG120 (Cough acute: antimicrobial prescribing, 2019); AAFP "Acute Bronchitis" 2016; PPK IDI Bronkitis Akut / Kemenkes PPRA
- **[realita · PERLU-NUANSA · TINGGI]** Di Puskesmas, bronkitis akut sangat sering tetap diberi antibiotik karena desakan pasien ('minta obat kuat'), konsultasi singkat, dan tiadanya rontgen dada untuk menyingkirkan pneumonia — salah satu penyumbang terbesar peresepan antibiotik tak perlu di FKTP.
  - *Sitasi:* Antibiotics 2017;6(4):22 (~62% bronkitis akut diberi antibiotik meski guideline melarang); studi rasionalitas antibiotik ISPA Puskesmas Indonesia (metode Gyssens); Permenkes 43/2019 tentang Puskesmas; PPK IDI Bronkitis Akut

**`rinitis_alergi`** — Rinitis Alergi

- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ ARIA jadikan kortikosteroid intranasal (flutikason) lini utama rinitis persisten sedang-berat, tapi steroid semprot ini kerap tak tersedia di Puskesmas. Praktik nyata pakai antihistamin oral—sering CTM gen-1 yang murah tapi bikin kantuk, bukan loratadin/setirizin.
  - *Sitasi:* ARIA next-generation (GRADE) 2019, JACI; PPK Dokter FKTP (KMK 514/2015); Fornas (klorfeniramin/loratadin/setirizin terdaftar)

**`tonsilitis_akut`** — Tonsilitis Akut Bakterial

- **[ebm · PERLU-NUANSA · TINGGI]** Eksudat tonsil TIDAK memastikan Streptokokus — mononukleosis (EBV) tampak identik (tonsil eksudatif, KGB, demam) dan amoxicillin memicu ruam makulopapular luas. Curigai EBV bila KGB servikal POSTERIOR, splenomegali, atau limfosit atipik pada apusan darah.
  - *Sitasi:* PPK IDI Tonsilitis Akut; kriteria Centor/McIsaac; AAFP "Infectious Mononucleosis: Rapid Evidence Review" 2023 & "Streptococcal Pharyngitis" 2016; laporan amoxicillin-rash pada mononukleosis EBV (Cureus/PMC 2023-2025)
- **[realita · KONFIRMASI · TINGGI]** RADT dan kultur usap tenggorok yang dipakai guideline untuk memastikan Streptokokus praktis tak tersedia di Puskesmas; keputusan antibiotik akhirnya bertumpu pada skor klinis (Centor/McIsaac) yang tak sepenuhnya andal — berisiko over- maupun under-treatment.
  - *Sitasi:* IDSA Group A Streptococcal Pharyngitis Guideline 2012 (Shulman et al., Clin Infect Dis); Permenkes 43/2019 tentang Puskesmas (lingkup lab dasar); studi validasi McIsaac Indonesia (Sari Pediatri)

**`ppok_eksaserbasi`** — PPOK Eksaserbasi Akut

- **[ebm · PERLU-NUANSA · TINGGI]** SpO2 yang tampak "aman" (88–92%) TIDAK menyingkirkan gagal napas hiperkapnik — oksimetri hanya mengukur oksigenasi, buta terhadap retensi CO2. Waspadai tanda klinis: mengantuk, bingung, asteriksis meski SpO2 baik. AGD jarang ada di Puskesmas — jangan tunda rujuk.
  - *Sitasi:* GOLD Report 2025 (terapi oksigen terkontrol, target SpO2 88–92%, indikasi AGD); Pedoman PPOK PDPI 2021
- **[realita · PERLU-NUANSA · TINGGI]** Nasal kanul 1–2 L dititrasi oksimetri ke SpO2 88–92% justru cara standar & tersedia di Puskesmas; sungkup Venturi opsional. Gap nyata: tak ada AGD untuk deteksi retensi CO2/asidosis & tak ada ventilasi bantu — stabilkan seperlunya lalu SEGERA rujuk paru.
  - *Sitasi:* GOLD 2023 Report; PPK Penyakit Paru Kemenkes/PDPI 2023; TSANZ Acute Oxygen Guidelines 2016; Permenkes 43/2019 (peralatan Puskesmas)

**`gerd`** — Penyakit Refluks Gastroesofageal (GERD)

- **[ebm · KONFIRMASI · TINGGI]** Dada yang MEREDA setelah antasida/PPI ('GI cocktail') TIDAK menyingkirkan penyakit jantung — respons antasida bukan uji diagnostik iskemia. Nyeri dada atipik pada pasien berisiko tetap wajib dinilai jantungnya (EKG, faktor risiko) SEBELUM dilabeli GERD.
  - *Sitasi:* 2021 AHA/ACC Chest Pain Guideline (Circulation 2021; dikutip Merck Manual Professional); Chan dkk. systematic review GI cocktail utk bedakan GERD vs ACS, Emerg Med Australasia 2014; PPK IDI GERD

**`dispepsia_fungsional`** — Dispepsia Fungsional

- **[realita · PERLU-NUANSA · TINGGI]** Test-and-treat H. pylori sulit di FKTP: UBT & antigen feses jarang tersedia; serologi (bila ada) tak bisa bedakan infeksi aktif vs lampau dan tetap positif pasca-eradikasi. Apalagi prevalensi H. pylori Indonesia rendah — praktik bertumpu pada terapi empiris PPI/antasida.
  - *Sitasi:* Konsensus Nasional Penatalaksanaan Dispepsia & Infeksi H. pylori (PB PGI 2014; 2022 Indonesian Consensus Report, Gut Pathogens 2023); ACG/Maastricht — serologi tidak untuk konfirmasi eradikasi

**`disentri_basiler`** — Disentri Basiler (Shigellosis)

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Satu kali mikroskopi feses negatif TIDAK menyingkirkan amubiasis — sensitivitas 1 sampel hanya ~33-50% (perlu feses segar-hangat & periksa serial). Bila tak membaik dengan siprofloksasin, pertimbangkan ameba/metronidazol; jangan sandarkan diagnosis pada satu hasil negatif.
  - *Sitasi:* WHO — tata laksana disentri/amubiasis (mikroskopi feses tunggal sensitivitas rendah; uji spesifik E. histolytica); Medscape/AMBOSS Amebiasis Workup 2023-24; PPK IDI 2017 (Disentri); LINTAS DIARE Kemenkes
- **[realita · PERLU-NUANSA · TINGGI]** Kultur feses & uji kepekaan tak tersedia di Puskesmas → terapi empiris. Resistensi Shigella pada kotrimoksazol sudah tinggi & fluorokuinolon (siprofloksasin) makin dilaporkan; bila gagal, pertimbangkan azitromisin/sefalosporin gen-3 atau rujuk sesuai pola resistensi lokal.
  - *Sitasi:* WHO Guidelines for the control of shigellosis 2005; CDC HAN XDR Shigella 2023; Permenkes 28/2021 (Fornas); Alomedika Penatalaksanaan Disentri 2023

**`askariasis`** — Askariasis (Cacing Gelang)

- **[ebm · PERLU-NUANSA · TINGGI]** Larva Ascaris bermigrasi ke paru ~1-2 minggu pascainfeksi → batuk, mengi, infiltrat sementara + eosinofilia (sindrom Löffler), mirip asma/bronkitis. Riwayat batuk beberapa minggu-bulan lalu + eosinofilia pada anak berisiko higiene: curigai fase migrasi cacing, jangan berhenti di asma.
  - *Sitasi:* CDC-DPDx Ascariasis; Medscape Ascariasis Clinical Presentation 2023; StatPearls Ascariasis (NCBI) 2023; PPK Dokter FKTP (Permenkes 5/2014, Askariasis)

**`hemoroid_grade1`** — Hemoroid Interna Grade 1

- **[ebm · KONFIRMASI · TINGGI]** Colok dubur normal + wasir terlihat TIDAK menyingkirkan kanker kolorektal proksimal: tumor kolon kanan di luar jangkauan jari & bisa berdampingan dengan hemoroid. Ada red flag (usia >50, anemia, BB turun, pola BAB berubah)? Tetap rujuk kolonoskopi meski wasir 'sudah ketemu'.
  - *Sitasi:* PPK IDI Hemoroid 2017; Kemenkes Panduan Penatalaksanaan Kanker Kolorektal; USPSTF Colorectal Cancer Screening 2021; studi nilai diagnostik DRE (sensitivitas ~0,76) Am Fam Physician/PubMed 2007
- **[realita · PERLU-NUANSA · SEDANG]** Kolonoskopi untuk menyingkirkan keganasan hanya di RS rujukan; anoskopi kerap tak dipakai dan tes darah samar tinja (FOBT) baru digulirkan lewat program skrining, belum merata—sehingga banyak perdarahan rektal 'diamati saja' karena rujukan terkendala antrean, jarak, dan biaya.
  - *Sitasi:* Permenkes 43/2019 (standar Puskesmas); Kemenkes — Skrining Kanker Kolorektal via Cek Kesehatan Gratis 2025 (RAN Penanggulangan Kanker 2024–2034); PPK IDI Hemoroid

**`apendisitis_akut`** — Apendisitis Akut

- **[ebm · KONFIRMASI · TINGGI]** Nyeri apendisitis yang tiba-tiba MEREDA bisa berarti apendiks sudah PERFORASI (dekompresi), bukan membaik — jangan lengah memulangkan pasien. Leukosit NORMAL tak menyingkirkan apendisitis; apendiks retrosekal/pelvik bisa menyerupai gastroenteritis atau ISK.
  - *Sitasi:* WSES Jerusalem Guidelines Apendisitis Akut (Di Saverio et al., World J Emerg Surg 2020); PPK IDI Apendisitis Akut
- **[realita · PERLU-NUANSA · TINGGI]** USG/CT dan dokter bedah tak ada di FKTP: diagnosis bertumpu skor klinis (Alvarado) lalu rujuk cepat. Realitanya rujukan sering tertunda jarak, ketersediaan ambulans/kamar operasi (SISRUTE), dan penolakan keluarga—padahal risiko perforasi meningkat tajam setelah 24-48 jam gejala.
  - *Sitasi:* WSES Jerusalem Guidelines Apendisitis 2020; Permenkes 43/2019 (Standar Puskesmas); Bickell dkk. 2006 (waktu-perforasi, J Am Coll Surg)

### kasusKulit.ts

**`kulit_dermatitis_kontak`** — Dermatitis Kontak Alergi

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Dermatitis kontak ALERGI dan IRITAN tampak identik secara klinis; pada ibu rumah tangga dengan tangan terus basah (air, sabun, detergen), penyebab tersering justru IRITAN, bukan alergi. Keduanya tak bisa dipisahkan pasti tanpa uji tempel — jangan terpaku pada label 'alergi'.
  - *Sitasi:* PPK PERDOSKI 2021 (Dermatitis Kontak Iritan & Alergi); Panduan Praktik Klinis Dokter FKTP (Permenkes 5/2014)
- **[realita · PERLU-NUANSA · TINGGI]** Patch test (uji tempel) untuk konfirmasi alergen tak tersedia di Puskesmas — dilakukan di RS/spesialis kulit; di FKTP alergen tetap dugaan klinis dari anamnesis. 'Hindari pencetus' sulit bagi ibu rumah tangga yang harus mencuci: andalkan sarung tangan + emolien, kepatuhan rendah.
  - *Sitasi:* PPK PERDOSKI 2021 (dermatitis kontak alergi); Alomedika (uji tempel di RS pendidikan); Permenkes 43/2019 standar sarana Puskesmas

**`kulit_tinea_korporis`** — Tinea Korporis (Kurap Badan)

- **[ebm · KONFIRMASI · TINGGI]** KOH bisa FALSE-NEGATIVE, terutama bila pasien sudah memakai krim antijamur/steroid sebelumnya atau sampel diambil dari bagian tengah lesi yang sudah tenang. KOH negatif TIDAK menyingkirkan tinea — kerok dari TEPI AKTIF dan tetap percayai gambaran klinis.
  - *Sitasi:* PPK Perdoski (Dermatofitosis); studi akurasi KOH pada tinea korporis (~15% negatif palsu)
- **[realita · PERLU-NUANSA · TINGGI]** Krim kombinasi steroid kuat (betametason + antijamur/antibiotik) berstatus obat keras tapi dijual bebas di warung/apotek — biang utama tinea inkognito; selalu gali riwayat 'krim warung'. KOH kerokan jarang dikerjakan di Puskesmas, diagnosis praktis klinis.
  - *Sitasi:* PPK PERDOSKI (Dermatofitosis); Alomedika 2023 (Tinea Incognito, penyalahgunaan steroid topikal); BPOM (kombinasi betametason = obat keras)

**`kulit_pioderma_impetigo`** — Pioderma — Impetigo Krustosa

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Mengobati impetigo TIDAK terbukti mencegah glomerulonefritis pascastreptokokus (GNAPS) — beda dari demam rematik. Jangan janjikan antibiotik 'mencegah komplikasi ginjal'; ia diberi untuk mempercepat sembuh & memutus penularan. Tetap pantau tanda GNAPS (bengkak, urin merah).
  - *Sitasi:* CDC Clinical Guidance for Group A Streptococcal Impetigo 2024; AAFP "Poststreptococcal Illness" 2018; IDSA SSTI 2014; Cochrane "Interventions for impetigo" 2012
- **[realita · PERLU-NUANSA · SEDANG]** Mupirosin (lini pertama pedoman) sering TIDAK distok di Puskesmas—umumnya sediaan bermerek. Realistis: salep gentamisin generik (paling sering ada), asam fusidat, atau langsung antibiotik oral anti-Staph (sefadroksil). Sesuaikan stok Fornas/e-katalog setempat; jangan resepkan obat yang kosong.
  - *Sitasi:* Fornas — KMK No. HK.01.07/Menkes/2197/2023 (berlaku Mar 2024); IDSA SSTI Guidelines 2014 & PPK Perdoski (mupirosin lini pertama impetigo); praktik FKTP Indonesia (diskusi klinis Alomedika)

**`kulit_urtikaria_akut`** — Urtikaria Akut

- **[ebm · KONFIRMASI · TINGGI]** Bila SATU bentol menetap >24 jam, terasa NYERI/perih (bukan gatal), atau meninggalkan memar/bercak kehitaman → itu BUKAN urtikaria biasa; curigai URTIKARIA VASKULITIS, tata & rujuk berbeda. Urtikaria sejati: tiap bentol hilang <24 jam tanpa bekas.
  - *Sitasi:* EAACI/GA²LEN/EuroGuiDerm/APAAACI Urticaria Guideline 2022 (Zuberbier et al., Allergy 2022); Delphi consensus diagnosis urtikaria vaskulitis (JACI 2022) — sejalan PPK Perdoski (urtikaria)
- **[realita · PERLU-NUANSA · TINGGI]** Di Indonesia tak ada autoinjektor adrenalin (EpiPen) untuk dibawa pulang — pasien tak bisa menolong diri saat anafilaksis berikutnya. Adrenalin hanya ampul 1:1000 yang harus didosis & disuntik nakes. Jaring pengaman: edukasi tanda bahaya + rute tercepat ke Puskesmas/IGD.
  - *Sitasi:* Perhimpunan Alergi Imunologi Klinik Indonesia (allergyimmunology.id); Alomedika — Farmakologi & Dosis Epinefrin (1:1000, IM); Fornas — epinefrin hanya sediaan injeksi

**`kulit_herpes_zoster`** — Herpes Zoster

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Batas 72 jam bukan tenggat mutlak: asiklovir tetap bermanfaat >72 jam bila masih ada vesikel BARU, atau pada imunokompromais/DM, zoster oftalmikus, dan lansia. Jangan tolak antivirus hanya karena pasien datang hari ke-4 — DM + usia lanjut tetap indikasi terapi.
  - *Sitasi:* CDC Shingles Clinical Overview (HCP) 2024; PPK PERDOSKI Herpes Zoster; CDK Journal 2023 (Herpes Zoster pada Lansia DM)
- **[realita · PERLU-NUANSA · SEDANG]** Asiklovir zoster 5×800 mg/hari (di FKTP = 5×2 tab 400 mg = 10 tablet/hari, 7 hari) menekan kepatuhan. Valasiklovir 3×1 g lebih ringkas dan ADA di Fornas, tapi restriksi tingkat RS & lebih mahal—tak lazim di Puskesmas. Realistis tetap asiklovir 5×/hari; kunci: alarm & jadwal minum.
  - *Sitasi:* PPK Perdoski (dosis asiklovir 5×800 mg & valasiklovir 3×1 g herpes zoster); Fornas 2023 (KMK Menkes No. HK.01.07/2197/2023, kelas 6.6.1 Antiherpes — asiklovir tab 200/400 mg tersedia TK-1/FKTP, valasiklovir 500 mg restriksi tingkat lanjut)

**`kulit_varisela`** — Varisela (Cacar Air)

- **[ebm · PERLU-NUANSA · TINGGI]** Bila ruam MONOMORF-sentrifugal (padat di wajah/ekstremitas/telapak) → curiga mpox/variola, bukan varisela (polimorf-sentripetal). Waspada: mpox 2022 sering ATIPIK — lesi sedikit, anogenital, bisa pleomorf. Setiap curiga mpox WAJIB lapor ke SKDR/PHEOC.
  - *Sitasi:* Kemenkes, Pedoman Pencegahan & Pengendalian Mpox 2023; CDC Evaluating Patients for Smallpox/Mpox rash algorithm 2024; WHO Mpox 2023
- **[realita · PERLU-NUANSA · SEDANG]** VZIG untuk kontak rentan berisiko (mis. bumil) idealnya <=96 jam (bisa s/d 10 hari) pascapajanan, tetapi praktis tak tersedia di Indonesia. Realistis: rujuk bumil ke SpOG; bila VZIG tak ada, asiklovir oral profilaksis mulai hari ke-7-10 dapat dipertimbangkan.
  - *Sitasi:* CDC MMWR 2013 (Updated Recommendations for Use of VariZIG — hingga 10 hari); AAP Red Book & VZV post-exposure prophylaxis review (PMC6931226, 2019)

**`kulit_kandidiasis_kutis`** — Kandidiasis Kutis (Intertriginosa)

- **[ebm · KONFIRMASI · TINGGI]** Tak semua ruam merah di lipatan = kandida: ERITRASMA (Corynebacterium; merah-koral di lampu Wood) & PSORIASIS INVERSA sangat mirip, terapinya beda. Kunci kandida = LESI SATELIT papulopustular di luar tepi; bila tak ada satelit & tak respons antijamur, pikir ulang.
  - *Sitasi:* PPK Perdoski 2021 (kandidiasis kutis intertriginosa; DD eritrasma — lampu Wood coral red); JABFM 2013 (inverse psoriasis mimicking candidal intertrigo)
- **[realita · PERLU-NUANSA · SEDANG]** Lampu Wood pemisah eritrasma-kandida sering tak ada di Puskesmas dan KOH jarang dikerjakan rutin, jadi terapi kerap empiris. 'Jaga area kering' sulit pada pasien obes di iklim lembap — rekurensi tinggi selama BB, kelembapan, dan gula darah belum dikoreksi.
  - *Sitasi:* PPK PERDOSKI 2021 (kandidiasis kutis); Fornas 2023 (Kepmenkes HK.01.07/MENKES/2197/2023 — mikonazol/ketokonazol/nistatin topikal); StatPearls Erythrasma 2023 (fluoresensi coral-red lampu Wood)

**`kulit_pedikulosis_kapitis`** — Pedikulosis Kapitis (Kutu Kepala)

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Nits yang menempel BUKAN bukti infestasi AKTIF — cangkang telur kosong bisa bertahan berbulan-bulan; diagnosis aktif butuh menemukan KUTU/nimfa HIDUP. Gagal terapi permetrin sering karena RESISTENSI piretroid, bukan semata reinfestasi kontak — pertimbangkan ganti agen.
  - *Sitasi:* CDC Head Lice (Diagnosis & Clinical Care) 2024; AAP Clinical Report "Head Lice" 2022 (Pediatrics 150(4):e2022059282)

**`kulit_veruka_vulgaris`** — Veruka Vulgaris (Kutil)

- **[ebm · KONFIRMASI · TINGGI]** Serut permukaan lesi untuk memisahkan kutil dari mata ikan (klavus): kutil menampakkan BLACK DOTS (kapiler trombosis), mudah berdarah, dermatoglifik HILANG; klavus berinti bening & garis kulit utuh. Lesi verukosa soliter tumbuh/berdarah/tak sembuh bisa meniru KSS — biopsi/rujuk.
  - *Sitasi:* PPK Perdoski (Veruka Vulgaris); DermNet NZ — Viral wart/verrucas; NCBI/PMC — Cutaneous SCC masquerading as verruca (2023)
- **[realita · KONFIRMASI · TINGGI]** Krioterapi N2 cair (opsi pedoman) umumnya TAK tersedia di Puskesmas—tak ada pasokan nitrogen. Realistis FKTP: asam salisilat topikal (lambat, berminggu-minggu), kauter/bedah minor bila ada alat, atau observasi karena banyak swasirna; rujuk bila resisten/luas.
  - *Sitasi:* PPK Perdoski (veruka vulgaris); Fornas — Kepmenkes HK.01.07/MENKES/813/2019 (asam salisilat keratolitik 5-40%); Permenkes 43/2019 (standar peralatan Puskesmas)

**`kulit_morbili`** — Morbili (Campak)

- **[ebm · KONFIRMASI · TINGGI]** Koplik spots patognomonik TAPI transien — memudar 1-2 hari setelah ruam muncul, jadi sering SUDAH HILANG saat pasien datang; absennya Koplik TIDAK menyingkirkan campak. Diagnosis tetap KLINIS: trias 3C + ruam makulopapular sefalokaudal + epidemiologi kontak.
  - *Sitasi:* CDC Measles Clinical Diagnosis Fact Sheet 2024; Kemenkes Petunjuk Teknis Surveilans Campak-Rubela; Front Microbiol 2019 (Koplik sensitivitas ~48%, terdokumentasi ~24% kasus)
- **[realita · PERLU-NUANSA · TINGGI]** Tiap suspek campak dilapor SEGERA & individual via SKDR + spesimen IgM utk surveilans; terapi JANGAN tunggu lab. KLB = ≥5 kasus/4 mgg mengelompok atau ≥2 IgM(+) → lapor W1 24 jam + PE + ORI. Vitamin A 2 dosis utk SEMUA anak campak, tanpa pandang status gizi.
  - *Sitasi:* Kemenkes Pedoman Surveilans Campak-Rubela 2020 (definisi KLB ≥5 kasus/4 mgg mengelompok+epi-link; ≥2 IgM(+)=KLB pasti; laporan W1 24 jam vs W2 mingguan); WHO Measles Fact Sheet 2024 (vitamin A dua dosis utk semua anak, tanpa memandang status gizi)

### kasusSarafMataTht.ts

**`saraf_migrain`** — Migrain Tanpa Aura

- **[ebm · KONFIRMASI · TINGGI]** 'Sakit kepala sinus' dengan nyeri dahi/pipi + hidung tersumbat sering salah diberi antibiotik — padahal ~80% sebenarnya MIGRAIN. Pembeda: ada mual/fotofobia & membaik di ruang gelap; bukan demam/ingus purulen.
  - *Sitasi:* Schreiber (SAMS), Arch Intern Med 2004; Al-Hashel dkk, J Headache Pain 2013; ICHD-3 2018; PPK PERDOSSI/Neurologi 2016
- **[realita · PERLU-NUANSA · TINGGI]** Triptan (sumatriptan) — terapi abortif spesifik migrain — praktis tak tersedia di Puskesmas; di Fornas hanya untuk tingkat rujukan/spesialis. Andalan FKTP tetap NSAID/parasetamol + antiemetik (metoklopramid); profilaksis amitriptilin/propranolol yang murah & tersedia.
  - *Sitasi:* Fornas 2023 (KMK HK.01.07/MENKES/2197/2023); PPK PERDOSSI Neurologi/Migrain (ICHD-3)

**`saraf_vertigo_bppv`** — Vertigo Posisional Paroksismal Jinak (BPPV)

- **[ebm · KONFIRMASI · TINGGI]** Tidak semua vertigo posisional adalah BPPV. Nistagmus TIDAK melelah (non-fatigable), murni vertikal/downbeat atau berganti arah, vertigo menetap >1 menit, atau ada defisit neurologis/tak mampu berdiri → curiga vertigo SENTRAL (mis. stroke serebelar): jangan Epley, RUJUK.
  - *Sitasi:* AAO-HNS BPPV CPG 2017 (Bhattacharyya); PERDOSSI Pedoman Tatalaksana Vertigo 2017; HINTS (Kattah 2009)
- **[realita · KONFIRMASI · TINGGI]** Di banyak Puskesmas manuver Epley jarang dikerjakan (keterbatasan waktu/keterampilan); pasien BPPV kerap dipulangkan hanya dengan betahistin/flunarizin. Padahal reposisi kanalit adalah terapi utama — obat hanya meredakan mual, bukan menyembuhkan.
  - *Sitasi:* AAO-HNS BPPV CPG 2017 (rekomendasi kuat reposisi kanalit); Kim et al., BMC Primary Care 2023 (meta-analisis: Epley efektif di layanan primer tapi kurang dipakai karena keterbatasan keterampilan/waktu); PPK PERDOSSI Vertigo

**`saraf_bells_palsy`** — Bell's Palsy (Parese Nervus Fasialis Perifer)

- **[realita · KONFIRMASI · TINGGI]** Di FKTP Bell's palsy sering cuma diberi vitamin neurotropik (B1/B6/B12/mekobalamin) yang tak terbukti mengubah prognosis, sementara kortikosteroid oral yang justru efektif — jendela emas <72 jam — terlewat. Prednison murah & tersedia di Puskesmas: mulai dini, jangan tunda.
  - *Sitasi:* Cochrane — Corticosteroids for Bell's palsy (Madhok, CD001942, 2016); NEJM — Sullivan et al. 2007 (early prednisolone <72 jam); AAN Practice Guideline (Gronseth 2012); Fornas 2023 (prednison).
- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Absennya vesikel pada kunjungan pertama BELUM menyingkirkan Ramsay Hunt — vesikel bisa muncul beberapa hari SETELAH kelumpuhan (bahkan zoster sine herpete, tanpa ruam). Wajah lumpuh bilateral atau progresif >2 minggu juga bukan Bell's khas: cari penyebab lain.
  - *Sitasi:* AAFP Bell Palsy Rapid Evidence Review 2023; AAN Practice Guideline (Gronseth 2012); DermNet NZ / Medscape Ramsay Hunt Syndrome; PPK PERDOSSI Bell's Palsy.

**`saraf_epilepsi_kejang`** — Epilepsi (Bangkitan Umum Tonik-Klonik Berulang)

- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Idealnya EEG + OAE oleh neurolog, tapi di banyak daerah keduanya tak terjangkau; WHO mhGAP membenarkan GP terlatih memulai OAE lini-1 (fenobarbital/valproat untuk bangkitan umum) sambil merujuk. Diazepam rektal untuk rescue sering kosong stok di Puskesmas.
  - *Sitasi:* WHO mhGAP-IG Epilepsy 2016; PPK PERDOSSI Epilepsi; Fornas (diazepam rektal 5 mg, OAE fenobarbital/valproat/fenitoin tingkat FKTP)
- **[ebm · KONFIRMASI · TINGGI]** EEG interiktal NORMAL tidak menyingkirkan epilepsi (sensitivitas EEG rutin tunggal hanya ~30-55%; naik hingga ~80% bila diulang/kurang tidur). Diagnosis epilepsi tetap KLINIS — jangan batalkan diagnosis atau rujukan hanya karena 'EEG normal'.
  - *Sitasi:* ILAE Operational Definition of Epilepsy (Fisher et al., Epilepsia 2014); PPK Neurologi PERDOSSI 2016; StatPearls: Epilepsy EEG (NCBI, 2023)

**`mata_konjungtivitis_alergi`** — Konjungtivitis Alergi

- **[realita · PERLU-NUANSA · TINGGI]** Realita FKTP: 'mata merah' refleks diberi kloramfenikol; tetes kombinasi steroid-antibiotik (mis. deksametason-neomisin) sebenarnya obat keras tapi kerap ditebus tanpa resep. Pada konjungtivitis alergi antibiotik sia-sia & steroid berisiko glaukoma/katarak dan memperburuk herpes kornea.
  - *Sitasi:* AAO Preferred Practice Pattern Conjunctivitis (2018/2023); BPOM/Permenkes penggolongan obat keras (Daftar G); Riskesdas 2013 (swamedikasi obat keras tanpa resep)

**`tht_epistaksis_anterior`** — Epistaksis Anterior

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ TD tinggi saat mimisan sering reaktif thd nyeri/cemas & turun sendiri sesudah perdarahan berhenti; kausalitas HT–epistaksis lemah (asosiasi saja). Prioritas: tekan cuping 10-15 mnt + tenangkan lalu ukur ulang TD, bukan kejar penurunan TD akut. Kontrol HT jangka panjang tetap penting.
  - *Sitasi:* AAO-HNS CPG Nosebleed (Epistaxis) 2020 (Tunkel dkk.); Payne dkk. 2020, Otolaryngol Head Neck Surg; Jurnal Kesehatan Andalas — Epistaksis dan Hipertensi
- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Merocel & kauter perak-nitrat jarang ada di Puskesmas; realistisnya epistaksis anterior: tekan cuping 10-15 mnt, lalu tampon kasa+vaselin ± kapas ADRENALIN (epinefrin 1:10.000, andalan Fornas; oksimetazolin spray tak selalu distok). Bila tak berhenti, rujuk THT.
  - *Sitasi:* Alomedika/KalbeMed Epistaksis 2023-2024 (Merocel/rapid rhino tak tersedia di semua fasilitas; kapas adrenalin 1:10.000 rutin); Fornas 2023 (Kepmenkes HK.01.07/MENKES/2197/2023) & E-Katalog LKPP (oksimetazolin 0,025%); Permenkes 75/2014 standar peralatan Puskesmas; PPK PERHATI-KL Epistaksis.

**`tht_rinosinusitis_akut`** — Rinosinusitis Akut

- **[ebm · KONFIRMASI · TINGGI]** Ingus kental kehijauan/kekuningan BUKAN bukti infeksi bakteri — warnanya berasal dari neutrofil (enzim mieloperoksidase) dan lazim pada pilek viral. Pemicu antibiotik adalah KRITERIA: >10 hari tak membaik, ATAU double-sickening, ATAU berat — bukan warna ingus.
  - *Sitasi:* EPOS 2020 (European Position Paper on Rhinosinusitis); IDSA Clinical Practice Guideline for Acute Bacterial Rhinosinusitis 2012 (Chow et al., Clin Infect Dis)
- **[realita · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Di FKTP antibiotik sering diberikan sejak hari ke-1/2 untuk pilek biasa (over-prescribing). Di Fornas, amoksisilin-klavulanat direstriksi (lanjutan parenteral/uji resistensi), sehingga pilihan realistis adalah amoksisilin dosis adekuat — hanya bila kriteria bakterial terpenuhi.
  - *Sitasi:* Fornas 2023 (KMK HK.01.07/MENKES/2197/2023); EPOS 2020; studi rasionalitas antibiotik ISPA Puskesmas Indonesia (program POR Kemenkes)

**`mata_glaukoma_akut`** — Glaukoma Akut Sudut Tertutup

- **[ebm · PERLU-NUANSA · TINGGI]** Obat flu/antimabuk warung (antikolinergik/antihistamin/dekongestan) dapat MENCETUSKAN glaukoma sudut-tertutup pada mata rentan (sudut sempit). Untuk mual-muntahnya hindari antiemetik antikolinergik (dimenhidrinat/prometazin); pilih ondansetron/metoklopramid.
  - *Sitasi:* PNPK Glaukoma PERDAMI 2018; AAO Primary Angle-Closure Disease PPP 2025; AAO EyeNet "Medication-Induced Acute Angle-Closure Glaucoma"
- **[realita · PERLU-NUANSA · TINGGI]** Timolol, asetazolamid & pilokarpin ada di Fornas FKTP tapi sering tak distok Puskesmas (glaukoma = kasus rujuk); manitol nyaris nihil. Bila obat ada, beri asetazolamid PO + timolol tetes sambil siapkan rujukan; bila tidak, jangan tunda — rujuk secepatnya, tiap jam berharga.
  - *Sitasi:* Fornas 2023 (Kepmenkes HK.01.07/MENKES/2197/2023); PNPK Glaukoma PERDAMI 2018; PPK Dokter FKTP (Permenkes 5/2014) — Glaukoma Akut SKDI 3B

### kasusMetabolikMsk.ts

**`mm_dislipidemia`** — Dislipidemia

- **[ebm · PERLU-NUANSA · SEDANG]** LDL ≥190 mg/dL yang terisolasi + riwayat jantung dini keluarga bukan sekadar 'kolesterol gaya hidup' — curigai Hiperkolesterolemia Familial & rujuk untuk skrining keluarga. Di kasus ini pola campuran (TG tinggi, HDL rendah, obesitas) condong ke dislipidemia metabolik.
  - *Sitasi:* PB PERKENI, Panduan Pengelolaan Dislipidemia di Indonesia 2021; kriteria Dutch Lipid Clinic Network (DLCN); ESC/EAS Dyslipidaemias 2019
- **[realita · PERLU-NUANSA · SEDANG]** Di praktik FKTP, statin yang tersedia lazimnya hanya simvastatin (intensitas sedang); atorvastatin/rosuvastatin intensitas tinggi jarang ada di rak Puskesmas. Pemantauan ulang lipid & SGOT/SGPT sering terlewat, dan pasien kerap putus obat karena merasa 'tak ada keluhan'.
  - *Sitasi:* PERKENI Panduan Pengelolaan Dislipidemia 2021; Fornas (KMK Kemenkes terbaru); Pedoman PTM Kemenkes

**`mm_obesitas`** — Obesitas

- **[ebm · KONFIRMASI · TINGGI]** Jangan pakai ambang Barat (obesitas ≥30) untuk pasien Asia — risiko kardiometabolik naik lebih dini (kriteria Asia-Pasifik/Kemenkes: BB lebih ≥23, obesitas ≥25 kg/m²). Lingkar perut (♂>90, ♀>80 cm) sering lebih prediktif; pasien ber-IMT 'hampir normal' pun bisa berisiko tinggi.
  - *Sitasi:* WHO "The Asia-Pacific Perspective: Redefining Obesity and its Treatment" 2000; Kemenkes P2PTM — klasifikasi IMT & lingkar perut Asia-Pasifik
- **[realita · PERLU-NUANSA · TINGGI]** Farmakoterapi obesitas berbasis bukti (orlistat, agonis GLP-1) & bedah bariatrik tak ditanggung BPJS/di luar ranah FKTP; konseling gizi-aktivitas intensif nyaris mustahil di poli padat menitan — lini utama gaya hidup pun kerap jadi nasihat singkat tanpa pendampingan nyata.
  - *Sitasi:* Formularium Nasional Kemenkes (obat anti-obesitas di luar tanggungan BPJS/FKTP); Konsensus Pengelolaan Obesitas PERKENI; Pedoman PTM & Pelayanan Gizi Puskesmas Kemenkes

**`mm_osteoartritis_lutut`** — Osteoartritis Lutut

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Jebakan: parasetamol nyaris tak bermanfaat pada OA lutut (Lancet 2016); pedoman internasional (NICE/OARSI) utamakan OAINS TOPIKAL lini pertama. Tapi topikal tetap OAINS — pada pasien alergi NSAID ini justru kontraindikasi, jadi parasetamol + latihan tetap pilihan tepat.
  - *Sitasi:* da Costa et al., The Lancet 2016 (NMA OA, 58.556 pasien); NICE NG226 (2022); OARSI 2019; Rekomendasi Diagnosis & Penatalaksanaan OA IRA/PB IRA 2014; label diklofenak gel FDA (kontraindikasi hipersensitivitas NSAID)
- **[realita · KONFIRMASI · TINGGI]** Fondasi OA (latihan penguatan kuadrisep terpandu/fisioterapi) jarang tersedia di Puskesmas — Permenkes 43/2019 tak wajibkan fisioterapis; injeksi steroid & rujukan ortopedi antre, sementara suplemen glukosamin/kondroitin laris dibeli bebas meski bukti lemah.
  - *Sitasi:* OARSI 2019 (glukosamin & kondroitin strongly not recommended); Permenkes 43/2019 Puskesmas & Permenkes 65/2015 Standar Pelayanan Fisioterapi; studi implementasi fisioterapi Puskesmas Jatim (hanya ~6,4% layani); ACR/AF 2019; PPK/PNPK Osteoartritis

**`mm_low_back_pain`** — Low Back Pain Mekanik (Nyeri Punggung Bawah)

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Parasetamol tunggal TIDAK lebih unggul dari plasebo pada LBP akut (PACE, Lancet 2014); OAINS oral jadi lini pertama bila tak ada kontraindikasi lambung/ginjal/kardiovaskular. Parasetamol bukan monoterapi andalan, tapi berguna sebagai kombinasi atau saat OAINS kontraindikasi.
  - *Sitasi:* Williams et al., Lancet 2014 (PACE trial); NICE NG59 Low Back Pain & Sciatica (2016, rev. 2020); PPK Neurologi PERDOSSI 2016
- **[realita · PERLU-NUANSA · TINGGI]** Realita FKTP: pasien LBP sering menuntut rontgen & 'suntik', dan mitos tirah baring total/pijat dari sektor informal (mantri/tukang urut) masih kuat. Tantangan dokter bukan sekadar tahu terapi konservatif, tapi menahan tekanan pencitraan & meluruskan mitos 'istirahat total'.
  - *Sitasi:* NICE NG59 Low Back Pain & Sciatica (2016, upd. 2020); Choosing Wisely–AAFP: Imaging for Low Back Pain; PPK Dokter FKTP (Permenkes 5/2014) — Low Back Pain

**`mm_mialgia`** — Mialgia (Nyeri Otot)

- **[ebm · PERLU-NUANSA · TINGGI]** Mialgia betis (gastroknemius) hebat + riwayat kontak air banjir/tikus: curigai LEPTOSPIROSIS. Mialgia + demam + nyeri retroorbital + gigitan nyamuk: curigai DENGUE. Keduanya kerap disangka pegal biasa — gali riwayat pajanan & demam sebelum menyimpulkan mialgia mekanik.
  - *Sitasi:* WHO Leptospirosis (surveillance/clinical description: mialgia betis); SE Ditjen P2P Kemenkes Kewaspadaan Leptospirosis 2024 & ayosehat.kemkes.go.id (nyeri betis, DD demam akut di FKTP); WHO Dengue Guidelines (2009/rev.) & CDC Dengue (nyeri retroorbital + mialgia); PPK Dokter FKTP (Permenkes 5/2014)

**`mm_artritis_reumatoid`** — Artritis Reumatoid

- **[ebm · KONFIRMASI · TINGGI]** RF bisa NEGATIF pada RA sejati (seronegatif ~20-30%) dan POSITIF pada lansia sehat/infeksi kronik (HCV, endokarditis). Jangan singkirkan atau tunda rujuk RA hanya karena 'RF negatif' — putuskan dari pola klinis (poliartritis simetris sendi kecil, kaku pagi >1 jam), bukan menunggu serologi.
  - *Sitasi:* Kriteria Klasifikasi ACR/EULAR 2010; Rekomendasi Diagnosis & Pengelolaan Artritis Reumatoid — Perhimpunan Reumatologi Indonesia (IRA) 2021
- **[realita · PERLU-NUANSA · TINGGI]** RA (SKDI 3A) wajib dirujuk: DMARD & serologi RF/anti-CCP tak tersedia di FKTP, tapi antrean reumatologi/penyakit dalam panjang. Selama menunggu pasien lazim pakai jamu pegal-linu ber-BKO deksametason (temuan BPOM) → Cushing iatrogenik, osteoporosis, gula darah naik.
  - *Sitasi:* Temuan BKO BPOM 2020–2022 (deksametason pd jamu pegal-linu); Fornas 2023 (KMK HK.01.07/MENKES/2197/2023 — restriksi metotreksat); Rekomendasi IRA/PAPDI Diagnosis & Pengelolaan Artritis Reumatoid 2021

**`mm_hipertensi_urgensi`** — Hipertensi Urgensi

- **[ebm · PERLU-NUANSA · TINGGI]** Tengkuk kaku & pusing BUKAN penanda andal tingginya tensi — TD sangat tinggi kerap tanpa gejala, dan pusing sering bukan akibat tensi. Nilai gawat-tidaknya dari ADA/TIDAK kerusakan organ target akut (nyeri dada, defisit neurologis, edema paru), bukan dari keluhan.
  - *Sitasi:* InaSH Konsensus Penatalaksanaan Hipertensi 2019; AHA Scientific Statement — Management of Elevated BP in the Acute Care Setting 2024; ACC/AHA Hypertension Guideline 2017 (update 2025)
- **[realita · PERLU-NUANSA · TINGGI]** Nifedipin sublingual/kunyah MASIH sering dipakai di Puskesmas meski dilarang pada krisis hipertensi (kebiasaan lama). Funduskopi & kreatinin kerap tak ada di FKTP dasar (EKG/urinalisis lebih sering ada) — menilai kerusakan organ target sulit, jadi rujuk paling aman.
  - *Sitasi:* Konsensus InaSH 2024; PPK Hipertensi Kemenkes; Permenkes 43/2019 (standar sarana Puskesmas)

**`mm_gagal_jantung_kongestif`** — Gagal Jantung Kongestif

- **[ebm · PERLU-NUANSA · TINGGI]** Edema tungkai bilateral tak spesifik untuk gagal jantung — bisa insufisiensi vena, hipoalbuminemia, penyakit ginjal, atau efek amlodipin (lazim di Puskesmas). Yang lebih menunjuk kongesti: JVP↑, S3 gallop, ortopnea, PND. Sesak+ronki bisa juga pneumonia/PPOK.
  - *Sitasi:* Kriteria Framingham gagal jantung; ESC Heart Failure Guidelines 2021; PPK/Pedoman Tatalaksana Gagal Jantung PERKI 2020/2023
- **[realita · KONFIRMASI · TINGGI]** Diagnosis definitif CHF (ekokardiografi, BNP/NT-proBNP) tak ada di FKTP; CHF jadi diagnosis KLINIS: stabilisasi + rujuk. Oksigen/furosemid injeksi bisa terbatas di Pustu, dan keterlambatan transport rujukan (SISRUTE/ambulans) kerap lebih fatal daripada pilihan obatnya.
  - *Sitasi:* PPK Gagal Jantung PERKI/Kemenkes (PPK-1 Dokter FKTP); Permenkes 43/2019 (standar sarana Puskesmas & Pustu); regulasi SISRUTE Kemenkes

**`mm_isk_bawah`** — Infeksi Saluran Kemih Bawah (Sistitis)

- **[ebm · KONFIRMASI · TINGGI]** Nitrit dipstik bisa FALSE-NEGATIVE: kuman non-pengurai nitrat (Enterococcus, S. saprophyticus), urin encer, atau urin belum lama di kandung kemih (sering berkemih). Nitrit negatif TIDAK menyingkirkan ISK; pada perempuan dengan disuria-frekuensi-urgensi klasik, diagnosis KLINIS.
  - *Sitasi:* IDSA/ESCMID Uncomplicated Cystitis Guideline 2011 (Gupta et al., CID); AAFP Dipstick Urinalysis 2013; PPK Dokter di FKTP Kemenkes (Permenkes 5/2014)
- **[realita · PERLU-NUANSA · SEDANG · ⚠KONTRADIKSI-CLUE]** ⚠ Kotrimoksazol lini pertama mengandaikan resistensi lokal <20%, padahal resistensi E. coli di Indonesia umumnya >20% (AMRIN ~29–56%). Nitrofurantoin/fosfomisin lebih ideal tapi sering kosong di Puskesmas — jadi kotrimoksazol, bahkan siprofloksasin, kerap tetap dipakai.
  - *Sitasi:* IDSA/ESCMID 2011 (Gupta et al., Clin Infect Dis 52:e103); AMRIN Study (Kemenkes, E. coli resisten kotrimoksazol 29% komunitas / 56% RS); Fornas (kesesuaian obat FKTP ~50–62%)

### kasusKiaJiwa.ts

**`kia_anc_kehamilan_normal`** — ANC — Kehamilan Normal (Trimester 2)

- **[ebm · PERLU-NUANSA · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Ambang anemia T2 lebih rendah: <10,5 g/dL (vs <11 di T1/T3), karena volume plasma naik lebih cepat dari massa eritrosit → Hb turun fisiologis, nadir ~minggu 28-34. Jadi Hb 10,5-10,9 di T2 masih normal, bukan anemia. Lanjutkan Fe profilaksis, jangan buru-buru naik ke dosis terapi.
  - *Sitasi:* WHO Guideline on Haemoglobin Cutoffs to Define Anaemia 2024; Kemenkes Buku Saku Pencegahan Anemia pada Ibu Hamil 2023
- **[realita · PERLU-NUANSA · TINGGI]** Standar ANC Kemenkes 2020: 6x kunjungan + USG oleh dokter min. 2x (K1 trimester 1 & K5 trimester 3). Realita: meski alat USG didistribusikan ke Puskesmas sejak 2023, dokter tersertifikasi USG obstetri terbatas & listrik stabil sering belum ada, skrining tak jalan/dirujuk.
  - *Sitasi:* Pedoman Pelayanan Antenatal Terpadu Kemenkes 2020; Media Indonesia — Kemenkes soal kendala USG Puskesmas 2023; POGI Pelatihan USG Obstetri Dasar Terbatas

**`kia_isk_kehamilan`** — Nitrit/leukosit esterase dipstik NEGATIF tidak menyingkirkan ISK (kia_isk_kehamilan)

- **[ebm · KONFIRMASI · TINGGI]** Dipstik negatif TIDAK menyingkirkan ISK: nitrit bisa negatif bila kuman tak mereduksi nitrat (Enterococcus, Staph. saprophyticus) atau urin <4 jam di kandung kemih (sering berkemih); leukosit esterase bisa negatif bila piuria minimal. Bila gejala khas, tetap obati/kultur.
  - *Sitasi:* WHO Antenatal Care Recommendations 2016 (kultur urin midstream sebagai metode diagnosis bakteriuria asimtomatik; bila tak tersedia, pewarnaan Gram > dipstik); IDSA Asymptomatic Bacteriuria Guideline 2019; Cochrane (Smaill & Vazquez 2019).
- **[realita · KONFIRMASI · TINGGI]** Idealnya semua bumil diskrining bakteriuria asimtomatik dengan kultur urin (baku emas WHO) di ANC awal, tetapi kultur & uji sensitivitas hampir tak tersedia di Puskesmas — diagnosis dan pilihan antibiotik bertumpu pada dipstik/urinalisis dan terapi empiris.
  - *Sitasi:* WHO Antenatal Care Recommendations 2016 (skrining ASB dengan kultur urin midstream; Gram-stain bila kultur tak tersedia); USPSTF ASB Screening 2019; Permenkes 43/2019 (standar lab Puskesmas: urinalisis/dipstik, tanpa kultur urin)

**`kia_preeklampsia_berat`** — Proteinuria TIDAK wajib untuk diagnosis preeklampsia berat — absennya tak menyingkirkan

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Preeklampsia berat bisa ditegakkan TANPA proteinuria: hipertensi + ≥1 tanda berat (trombositopenia, SGOT/SGPT/kreatinin naik, edema paru, nyeri kepala/gangguan visus, nyeri epigastrium). Jangan tunda MgSO4/rujuk hanya karena protein urin negatif; edema bukan kriteria.
  - *Sitasi:* ACOG Practice Bulletin 222 (2020); ISSHP 2018; PNPK Preeklampsia POGI/Kemenkes 2016
- **[realita · KONFIRMASI · TINGGI]** Idealnya beri MgSO4 dosis loading (4 g IV) + antihipertensi SEBELUM transport, tapi di lapangan pasien sering dirujuk tanpa dosis awal karena keraguan/kurang terlatih. Siapkan kalsium glukonas 10% sebagai antidot; pantau napas (>16x/mnt), refleks patela & produksi urin.
  - *Sitasi:* PNPK Preeklampsia-Eklampsia POGI 2016 (regimen MgSO4 + syarat antidot kalsium glukonas 10%); studi pra-rujukan RSUP Fatmawati (93,3% Puskesmas & 96% praktik mandiri tak memberi MgSO4 pra-rujuk); Fornas KMK No. HK.01.07/MENKES/2197/2023.

**`kia_abortus_iminens`** — Abortus Iminens (Ancaman Keguguran)

- **[realita · PERLU-NUANSA · SEDANG]** Realita: abortus iminens rutin diberi progestin oral (alilestrenol/didrogesteron) walau bukti manfaat terbatas—progesteron vaginal (PRISM) hanya menolong subgrup dengan riwayat keguguran; pada pasien tanpa riwayat belum terbukti & bukan keharusan. Inti: rujuk USG.
  - *Sitasi:* PRISM RCT (Coomarasamy dkk., NEJM 2019); NICE NG126 (2019, upd. 2025); meta-analisis progestogen (Zhao dkk., Acta Obstet Gynecol Scand 2024); praktik lapangan RI (Premaston/Duphaston, obat keras rutin diresepkan)

**`kia_kb_konseling`** — Konseling KB (Kontrasepsi Pascapersalinan)

- **[ebm · KONFIRMASI · TINGGI]** Ovulasi bisa terjadi SEBELUM haid pertama kembali — 'belum menstruasi' bukan jaminan tak hamil. LAM/MAL hanya andal bila SEMUA syarat terpenuhi (ASI eksklusif on-demand + amenorea + bayi <6 bulan) & bersifat sementara; jangan tunda kontrasepsi hanya karena belum haid.
  - *Sitasi:* WHO Medical Eligibility Criteria for Contraceptive Use, 5th ed. (LAM/Bellagio Consensus); BKKBN — Metode Amenore Laktasi (MAL)
- **[realita · PERLU-NUANSA · TINGGI]** Di Puskesmas metode terbanyak = suntik DMPA 3 bulan, tapi kesuburan baru pulih median ~10 bulan (bisa sampai 18 bulan) sejak suntikan terakhir — penting bagi ibu yang berniat hamil lagi. Bila reversibilitas cepat jadi prioritas, tawarkan IUD/implan sebagai informed choice.
  - *Sitasi:* WHO Selected Practice Recommendations for Contraceptive Use 2016 (median return to fertility DMPA ~10 bln, hingga 18 bln); BKKBN 2023 (suntik ~53% akseptor); SDKI 2017 (indeks informed choice ~17%)

**`jiwa_gangguan_cemas`** — SSRI bisa memperberat cemas 1–2 minggu awal & butuh 2–4 minggu untuk bekerja

- **[ebm · KONFIRMASI · TINGGI]** SSRI (fluoksetin/sertralin) dapat memicu 'aktivasi' (cemas/gelisah/insomnia sementara) di 1–4 minggu awal, dan efek terapi baru terasa 2–4 minggu. Mulai dosis rendah, edukasi pasien jangan hentikan dini — penyebab umum salah kira 'obat gagal' lalu beralih ke benzodiazepin.
  - *Sitasi:* NICE CG113 GAD (2011, upd. 2020); mhGAP WHO 2016; label/EI fluoksetin-sertralin (activation & onset of action); Fornas 2023 (SSRI tersedia di FKTP)
- **[realita · PERLU-NUANSA · TINGGI]** Realita FKTP: psikolog klinis nyaris tak ada (baru ~203, terpusat di kota besar, untuk >10.000 Puskesmas) & waktu konsul singkat, sehingga CBT sulit; praktik sering jatuh ke benzodiazepin (Fornas Puskesmas: diazepam) demi 'efek cepat' — padahal berisiko toleransi/ketergantungan.
  - *Sitasi:* Data Kemenkes/IPK Indonesia 2025-2026 (psikolog klinis Puskesmas ~203; 29/4.335 di puskesmas-klinik pratama); WHO mhGAP (task-sharing SDM jiwa); Fornas (diazepam & fluoksetin FKTP); PPK Jiwa FKTP

**`jiwa_depresi_ringan`** — Episode Depresif Ringan

- **[ebm · KONFIRMASI · TINGGI]** Depresi di FKTP sering bertopeng keluhan somatik (pegal, lemas, pusing, nyeri kronik, gangguan tidur), terutama pada lansia, sehingga terjebak pemeriksaan organik berulang. Pada keluhan somatik tak berpola, skrining mood + anhedonia aktif (PHQ-2) membantu menangkapnya.
  - *Sitasi:* WHO mhGAP-IG 2.0 (Depression); Kroenke PHQ-2 2003; Riskesdas 2013 (depresi lansia Indonesia)
- **[realita · PERLU-NUANSA · SEDANG]** Idealnya (mhGAP/NICE NG222) depresi ringan: psikoedukasi + aktivasi perilaku + active monitoring dulu, antidepresan tak rutin. Realita FKTP: layanan psikologi sering tak ada (hanya ~40% Puskesmas punya layanan jiwa) & kontrol sulit, obat kerap langsung diberi — bila perlu, sertai rencana kontrol + skrining bunuh diri.
  - *Sitasi:* NICE NG222 (2022); WHO mhGAP-IG v2.0 & Update 2023; Kemenkes/PDSKJI — cakupan layanan jiwa Puskesmas ~40% & mandat psikolog klinis PMK No.19/2024

**`jiwa_insomnia`** — 'Higiene tidur' saja bukti lemah — inti CBT-I adalah kontrol stimulus & pembatasan tidur

- **[ebm · KONFIRMASI · TINGGI · ⚠KONTRADIKSI-CLUE]** ⚠ Higiene tidur sebagai terapi TUNGGAL buktinya lemah — AASM justru merekomendasikan jangan dipakai sendirian. Komponen CBT-I yang efektif: kontrol stimulus (tempat tidur hanya untuk tidur; keluar bila tak bisa tidur) & pembatasan tidur. Membagikan leaflet higiene ≠ mengobati.
  - *Sitasi:* AASM Clinical Practice Guideline: Behavioral & Psychological Treatments for Chronic Insomnia (J Clin Sleep Med, 2021); ACP Clinical Practice Guideline: Management of Chronic Insomnia in Adults (Ann Intern Med, 2016)
- **[realita · KONFIRMASI · TINGGI]** CBT-I lini pertama (AASM 2021), tetapi terapis/CBT-I digital nyaris nihil di FKTP (hanya segelintir psikolog klinis di Puskesmas; ~50% Puskesmas tanpa layanan jiwa). Praktik jatuh ke higiene tidur + hipnotik/benzodiazepin — batasi durasi, cegah ketergantungan/jatuh pada lansia.
  - *Sitasi:* AASM CPG "Behavioral & Psychological Treatments for Chronic Insomnia" 2021; Permenkes No. 19/2024 (psikolog klinis wajib di Puskesmas); data Kemenkes/IPK Indonesia 2026 (cakupan layanan jiwa Puskesmas ~50%, psikolog klinis di Puskesmas ~29/4.335); PAPDI CME & advisory Kemenkes ttg benzodiazepin.

**`jiwa_skizofrenia`** — Haloperidol bisa memicu distonia akut/akatisia — antisipasi, jangan disangka 'memburuk'

- **[ebm · KONFIRMASI · TINGGI]** Haloperidol sering picu efek ekstrapiramidal: distonia akut (kaku, mata mendelik, tortikolis) dalam jam–hari pertama & akatisia (gelisah tak bisa diam) — mudah disangka psikosis memburuk. Atasi distonia akut dgn difenhidramin/triheksifenidil, pakai dosis efektif terendah.
  - *Sitasi:* WHO mhGAP 2016 (modul psikosis); Stroup & Gray, World Psychiatry 2018 (manajemen efek samping antipsikotik); Fornas 2023 (haloperidol, triheksifenidil, difenhidramin)
- **[realita · KONFIRMASI · TINGGI]** Idealnya ke SpKJ, tapi psikiater hanya ~1.100 se-Indonesia dan absen di banyak kabupaten — rujukan berarti jarak & antre. Realitanya FKTP yang menjaga rumatan (haloperidol/klorpromazin, ada di Fornas). Kunci cegah kambuh & pasung: kontinuitas obat + pendampingan keluarga.
  - *Sitasi:* WHO mhGAP 2015/2023 (task-sharing & rumatan antipsikotik); Fornas 2023 (Kepmenkes HK.01.07/MENKES/2197/2023 — haloperidol & klorpromazin FKTP); UU No.18/2014 Kesehatan Jiwa; Kemenkes/Riskesdas — data SDM psikiater (~1.100; 0,32/100.000) & pasung 2023-2026

**`kia_malaria_falsiparum`** — RDT malaria negatif sekali tidak menyingkirkan malaria

- **[ebm · PERLU-NUANSA · TINGGI]** Satu RDT (HRP-2) negatif TIDAK menyingkirkan malaria: bisa negatif-palsu saat parasitemia dini/rendah, pada delesi pfhrp2/3 (dilaporkan di Papua), atau efek prozone saat parasitemia sangat tinggi. Klinis kuat + riwayat endemis → ulangi RDT/mikroskop tebal-tipis 12–24 jam.
  - *Sitasi:* WHO Guidelines for Malaria 2023 (keterbatasan RDT HRP-2: delesi pfhrp2/3 & efek prozone); Buku Saku Tata Laksana Kasus Malaria Kemenkes 2023 (mikroskop baku emas, apus tebal-tipis); CDC Malaria Diagnosis 2024 (ulang apusan tiap 12–24 jam, hingga 3 set); Scientific Reports 2025 (delesi PfHRP2/3 pada isolat Papua, Indonesia)
- **[realita · KONFIRMASI · SEDANG]** Malaria impor: pasien pulang dari Papua/NTT kerap berobat di Puskesmas Jawa/Bali non-endemis yang tak menstok RDT & ACT (DHP)/primakuin (distribusi terfokus daerah endemis) → diagnosis terlambat. Curigai demam+riwayat perjalanan; siapkan rujukan & lapor e-SISMAL.
  - *Sitasi:* Buku Saku Tata Laksana Kasus Malaria Kemenkes 2023; KMK No.556/2019 (PNPK Malaria); e-SISMAL Kemenkes; laporan kasus malaria impor wilayah non-endemis (Medicina Udayana, 2024)

---

## Kasus tanpa kandidat (4/67)

`mata_hordeolum`, `mm_gout_artritis_akut`, `saraf_tension_headache`, `tht_serumen_prop`

(Finder menilai kasus ini tak punya jebakan EBM/jurang-realita yang cukup kuat untuk diusulkan — sesuai instruksi 'boleh mengembalikan sedikit, kualitas > kuantitas'.)
