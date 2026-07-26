# M13-137 - Laporan Kompilasi Adjudikasi Prototipe Klinis

**Tanggal kompilasi:** 2026-07-26
**Status:** research + compilation only; **bukan adjudikasi dokter dan tidak mengubah gameplay**
**Snapshot:** commit `bd100abb0e333561583ceeaa710e9d18927b8470+dirty`, artefak `93a2313bb67ea736af178ca5c2263c407e1800750855decaf5a3e23d9977e127`, pack `725c127b`, content release `igd-adjudication-2026-07-22`, `REVISI_ENGINE=58`

## Ringkasan eksekutif

Briefing menyebut “M13-103”, tetapi query runtime `activationStatus === 'lab_prototype_unadjudicated'` menghasilkan **137 kasus**. Angka 103 berasal dari assertion minimum lama; Batch 4 menambah 34 kasus. Paket review ini karena itu sengaja mengunci **137/137**, bukan hanya 103 pertama.

| Indikator | Hasil |
|---|---:|
| Kasus prototipe aktual | **137** |
| Crosswalk PPK langsung | 93 |
| Crosswalk PPK terkait, bukan identik | 15 |
| Tanpa crosswalk PPK | 29 |
| Memiliki PNPK langsung | 27 |
| Memiliki pedoman EBM langsung tambahan | 69 |
| Saran kompilator “cocok” | 137 |
| Saran kompilator “perlu-koreksi” | 0 |
| Saran kompilator “tak-ada-sumber” | 0 |
| Kasus dengan resource Tier C/D | 45 |
| Obat unik non-Fornas menurut katalog | 9 |
| Query KFA aktif-substance tak terpetakan | 0 |

Angka saran kompilator **bukan skor mutu klinis**. “Perlu-koreksi” dapat dipicu oleh locator sumber, klaim Fornas, atau readiness ASPAK, meski inti diagnosis mungkin benar. Keputusan akhir tetap radio dokter pada artefak HTML.

## Deliverable

1. [M13_137_ADJUDICATION.html](M13_137_ADJUDICATION.html) - alat review interaktif, filter, autosave lokal, keputusan Setuju/Perlu Edit/Tolak/Nanti, ekspor-impor JSON.
2. [M13_137_ADJUDICATION_DATA.json](M13_137_ADJUDICATION_DATA.json) - dataset audit machine-readable 137 kasus.
3. [M13_137_KFA_SNAPSHOT.json](M13_137_KFA_SNAPSHOT.json) - snapshot endpoint publik KFA active-substance untuk seluruh obat unik yang dipakai prototipe saat artefak dibangun.
4. Dokumen ini - metode, keterbatasan, dan daftar temuan provenance.

## Metode

### Inventaris

- Sumber runtime: `PACK.kasus` pada snapshot di atas.
- Filter exact: `activationStatus === 'lab_prototype_unadjudicated'`.
- Semua diagnosis, obat wajib/alternatif/opsional, tindakan, edukasi, lab relevan, disposisi, dan teks pedagogis diambil langsung dari objek runtime, bukan disalin manual.

### Lantai PPK/PNPK

- PPK 1186/2022: crosswalk manual-konservatif ke 167 bab pada `docs/references/ppk1186/ppk1186_entries.json`.
- Relasi dibedakan **direct** dan **related**. Related tidak boleh dipakai untuk menyatakan “PPK menetapkan diagnosis ini” tanpa pembatasan.
- Cuplikan penatalaksanaan/kriteria rujuk diambil literal dari ekstrak lokal dan diberi nomor bab serta halaman PDF.
- PNPK dipetakan hanya bila ada dokumen diagnosis-spesifik atau konteks terkait yang nyata. Cuplikan otomatis diberi baris sumber; dokumen penuh tetap wajib dibaca saat adjudikasi.
- Amandemen KMK 1936/2022 dan PNPK aktif lebih baru harus mengalahkan bagian lama yang berkonflik.

### Pedoman EBM diagnosis-spesifik

- Registry EBM disimpan terpisah dari PNPK agar WHO, NICE, atau badan pedoman lain tidak pernah salah label sebagai regulasi Indonesia.
- Sumber harus primer, memiliki URL resmi dan locator keputusan; relasi tetap dibedakan **direct** dan **related**.
- Pedoman EBM melengkapi atau memperbarui floor lokal, tetapi implementasinya tetap tunduk pada Fornas, ASPAK, KFA, kewenangan FKTP, dan jalur rujukan.

### Fornas 1199

- Setiap obat dibandingkan dengan flag `fornas` katalog dan teks resmi KMK 1199/2025.
- Locator berupa baris ekstrak lokal. Keberadaan nama belum otomatis berarti boleh di FPKTP: reviewer harus membaca kolom FPKTP/FPKTL, restriksi, dan batas peresepan di konteks tabel.
- Non-Fornas bukan otomatis “obat salah”; ia menuntut graceful degradation: alternatif Fornas, program, pengadaan lokal yang eksplisit, atau jejaring.

### ASPAK

- Baseline yang dipakai adalah keputusan M13-RP1 `sukamaju_middle_v1`: Puskesmas perdesaan nonrawat-inap, sarana inti cukup, tetapi alat/prasarana bukan all-ready.
- Tier C harus menyatakan jadwal/operator/consumable/readiness; Tier D tidak boleh diasumsikan dan tidak boleh menunda rujukan.
- Ini checklist authoring, bukan mekanik inventori runtime.

### KFA

- Endpoint publik browser KFA: `/api/search/active-ingredients`, diakses 2026-07-26.
- Snapshot menghasilkan kode active substance untuk semua query (0 unresolved).
- Kode tersebut **bukan** product template/variant, bukan status Fornas, dan bukan bukti stok. Tidak ada kode yang ditebak.

## Temuan provenance prioritas

### Atribusi PPK terlalu kuat (0)

Kasus berikut sudah menulis “PPK/1186” pada teks pemain, tetapi crosswalk hanya related atau tidak ditemukan. Ini perlu dibaca manual sebelum aktivasi; alternatifnya adalah melunakkan atribusi, mengganti sumber, atau memberi locator diagnosis-spesifik.

- Tidak ada.

### Tidak ada PPK, PNPK, maupun pedoman EBM diagnosis-spesifik (0)

“Tak ada sumber” di sini berarti tidak ada sumber yang berhasil dipetakan dalam corpus resmi saat kompilasi, **bukan** bahwa penyakit tidak punya pedoman di dunia. Kasus ini memerlukan sumber program/EBM tambahan atau klaim yang dibatasi.

- Tidak ada.

### Obat non-Fornas (9)

- `benzoyl_peroksida_25`
- `emolien_petrolatum`
- `flutikason_semprot_hidung`
- `klindamisin_topikal_1`
- `mdt_kusta_pb`
- `metronidazol_topikal_075`
- `permetrin_losion_1`
- `triamcinolone_orabase`
- `zinc_oxide_krim`

### Flag Fornas=true tetapi locator komponen belum lengkap (0)

- Tidak ada.

## Daftar triase kompilator

### Perlu koreksi

- Tidak ada.

### Tak ada sumber

- Tidak ada.

### Cocok secara provenance awal

- `lab_luka_bakar_derajat2_dangkal` - Luka Bakar Derajat II Dangkal Terbatas: tidak ada red flag provenance otomatis
- `lab_parafimosis_reduksibel` - Parafimosis Akut: tidak ada red flag provenance otomatis
- `lab_anafilaksis_makanan` - Reaksi Anafilaktik setelah Makanan: tidak ada red flag provenance otomatis
- `lab_trauma_abdomen_tumpul` - Trauma Abdomen Tumpul dengan Curiga Cedera Organ Padat: tidak ada red flag provenance otomatis
- `lab_trauma_tajam_kulit_kepala` - Trauma Tajam Kulit Kepala Sederhana: tidak ada red flag provenance otomatis
- `lab_trauma_tumpul_kepala_ringan` - Trauma Tumpul Kepala Risiko Rendah: tidak ada red flag provenance otomatis
- `lab_vulnus_laseratum_lengan` - Vulnus Laseratum Sederhana: tidak ada red flag provenance otomatis
- `lab_gonore_uretritis_pria` - Gonore Uretra Tanpa Komplikasi: tidak ada red flag provenance otomatis
- `lab_hepatitis_a_akut` - Hepatitis A Akut Tanpa Gagal Hati: tidak ada red flag provenance otomatis
- `lab_hepatitis_b_kronik` - Hepatitis B Kronik Tanpa Gejala: tidak ada red flag provenance otomatis
- `lab_hiv_tanpa_komplikasi` - Infeksi HIV Asimtomatik - Inisiasi ART: tidak ada red flag provenance otomatis
- `lab_limfadenitis_servikal_akut` - Limfadenitis Servikal Akut Bakterial: tidak ada red flag provenance otomatis
- `lab_parotitis_mumps` - Parotitis Epidemika (Mumps): tidak ada red flag provenance otomatis
- `lab_salpingitis_pid_ringan` - Penyakit Radang Panggul Ringan - Rawat Jalan: tidak ada red flag provenance otomatis
- `lab_pielonefritis_tanpa_komplikasi` - Pielonefritis Akut Tanpa Komplikasi: tidak ada red flag provenance otomatis
- `lab_sindrom_duh_genital_servisitis` - Servisitis Mukopurulen - Tata Laksana Sindromik: tidak ada red flag provenance otomatis
- `lab_leptospirosis_tanpa_komplikasi` - Suspek Leptospirosis Ringan Pascabanjir: tidak ada red flag provenance otomatis
- `lab_tetanus_generalisata_awal` - Tetanus Generalisata Derajat Sedang: tidak ada red flag provenance otomatis
- `lab_vaginitis_kandida` - Vaginitis Kandidiasis: tidak ada red flag provenance otomatis
- `lab_vaginosis_bakterialis` - Vaginosis Bakterialis: tidak ada red flag provenance otomatis
- `lab_vulvitis_iritan` - Vulvitis Iritan: tidak ada red flag provenance otomatis
- `lab_gangguan_somatoform` - Gangguan Somatoform - Keluhan Fisik Persisten: tidak ada red flag provenance otomatis
- `lab_edema_paru_akut_hipertensif` - Edema Paru Akut Hipertensif: tidak ada red flag provenance otomatis
- `lab_gagal_jantung_dekompensasi` - Gagal Jantung Dekompensasi Akut: tidak ada red flag provenance otomatis
- `lab_abortus_spontan_komplit` - Abortus Spontan Komplit - Stabil: tidak ada red flag provenance otomatis
- `lab_puting_lecet` - Cracked Nipple karena Perlekatan Buruk: tidak ada red flag provenance otomatis
- `lab_fimosis_patologis_ringan` - Fimosis Patologis Tanpa Retensi: tidak ada red flag provenance otomatis
- `lab_gizi_buruk_komplikasi` - Gizi Buruk dengan Komplikasi pada Balita: tidak ada red flag provenance otomatis
- `lab_hiperemesis_gravidarum_berat` - Hiperemesis Gravidarum Berat dengan Dehidrasi: tidak ada red flag provenance otomatis
- `lab_infeksi_umbilikus_neonatus` - Infeksi Umbilikus dengan Tanda Sistemik: tidak ada red flag provenance otomatis
- `lab_puting_tenggelam_laktasi` - Inverted Nipple dengan Kesulitan Laktasi: tidak ada red flag provenance otomatis
- `lab_mastitis_laktasi` - Mastitis Laktasi Tanpa Abses: tidak ada red flag provenance otomatis
- `lab_penyakit_radang_panggul_berat` - Penyakit Radang Panggul Berat dengan Curiga Abses Tubo-Ovarium: tidak ada red flag provenance otomatis
- `lab_plasenta_previa` - Perdarahan Antepartum karena Plasenta Previa: tidak ada red flag provenance otomatis
- `lab_ruptur_perineum_derajat_1` - Ruptur Perineum Derajat 1 dengan Perdarahan: tidak ada red flag provenance otomatis
- `lab_kehamilan_ektopik_terganggu_suspek` - Suspek Kehamilan Ektopik Terganggu: tidak ada red flag provenance otomatis
- `lab_mola_hidatidosa` - Suspek Mola Hidatidosa (Hamil Anggur): tidak ada red flag provenance otomatis
- `lab_abses_folikel_rambut` - Abses Folikel Rambut Superfisial: tidak ada red flag provenance otomatis
- `lab_akne_vulgaris_ringan` - Akne Vulgaris Ringan: tidak ada red flag provenance otomatis
- `lab_cutaneous_larva_migrans` - Cutaneous Larva Migrans: tidak ada red flag provenance otomatis
- `lab_dermatitis_atopik_ringan` - Dermatitis Atopik Ringan: tidak ada red flag provenance otomatis
- `lab_dermatitis_kontak_iritan_tangan` - Dermatitis Kontak Iritan Tangan: tidak ada red flag provenance otomatis
- `lab_dermatitis_numularis` - Dermatitis Numularis: tidak ada red flag provenance otomatis
- `lab_dermatitis_perioral` - Dermatitis Perioral: tidak ada red flag provenance otomatis
- `lab_dermatitis_popok_iritan` - Dermatitis Popok Iritan: tidak ada red flag provenance otomatis
- `lab_dermatitis_seboroik_dewasa` - Dermatitis Seboroik Dewasa: tidak ada red flag provenance otomatis
- `lab_erisipelas_tungkai_ringan` - Erisipelas Tungkai Tanpa Sepsis: tidak ada red flag provenance otomatis
- `lab_eritrasma_lipat_paha` - Eritrasma Lipat Paha: tidak ada red flag provenance otomatis
- `lab_erupsi_obat_morbiliformis` - Erupsi Obat Morbiliformis Tanpa SCAR: tidak ada red flag provenance otomatis
- `lab_filariasis_terkonfirmasi` - Filariasis Limfatik Terkonfirmasi Program: tidak ada red flag provenance otomatis
- `lab_folikulitis_superfisialis` - Folikulitis Superfisialis: tidak ada red flag provenance otomatis
- `lab_furunkel_fluktuatif` - Furunkel Fluktuatif Lokal: tidak ada red flag provenance otomatis
- `lab_herpes_simpleks_labialis` - Herpes Simpleks Labialis Rekuren: tidak ada red flag provenance otomatis
- `lab_hidradenitis_supuratif_hurley1` - Hidradenitis Supuratif Hurley I: tidak ada red flag provenance otomatis
- `lab_ektima_tungkai` - Impetigo Ulseratif (Ektima): tidak ada red flag provenance otomatis
- `lab_kusta_pausibasiler` - Kusta Pausibasiler Tanpa Reaksi: tidak ada red flag provenance otomatis
- `lab_miliaria_rubra` - Miliaria Rubra: tidak ada red flag provenance otomatis
- `lab_moluskum_kontagiosum_anak` - Moluskum Kontagiosum Anak: tidak ada red flag provenance otomatis
- `lab_pedikulosis_pubis` - Pedikulosis Pubis: tidak ada red flag provenance otomatis
- `lab_pitiriasis_rosea` - Pitiriasis Rosea: tidak ada red flag provenance otomatis
- `lab_pitiriasis_versikolor` - Pitiriasis Versikolor: tidak ada red flag provenance otomatis
- `lab_reaksi_gigitan_serangga` - Reaksi Lokal Gigitan Serangga: tidak ada red flag provenance otomatis
- `lab_sifilis_primer` - Sifilis Primer: tidak ada red flag provenance otomatis
- `lab_skrofuloderma_suspek` - Suspek Skrofuloderma (TB Kulit): tidak ada red flag provenance otomatis
- `lab_tinea_barbae` - Tinea Barbae Noninflamasi: tidak ada red flag provenance otomatis
- `lab_tinea_fasialis` - Tinea Fasialis: tidak ada red flag provenance otomatis
- `lab_tinea_kapitis_anak` - Tinea Kapitis Noninflamasi: tidak ada red flag provenance otomatis
- `lab_tinea_kruris` - Tinea Kruris: tidak ada red flag provenance otomatis
- `lab_tinea_manus` - Tinea Manus: tidak ada red flag provenance otomatis
- `lab_tinea_pedis` - Tinea Pedis Interdigital: tidak ada red flag provenance otomatis
- `lab_tinea_unguium_terkonfirmasi` - Tinea Unguium Terbatas: tidak ada red flag provenance otomatis
- `lab_ablasio_retina` - Ablasio Retina Regmatogen — Tirai Hitam Tanpa Nyeri: tidak ada red flag provenance otomatis
- `lab_astigmatisme_ringan` - Astigmatisme Ringan: tidak ada red flag provenance otomatis
- `lab_benda_asing_konjungtiva` - Benda Asing Konjungtiva Superfisial: tidak ada red flag provenance otomatis
- `lab_blefaritis_anterior` - Blefaritis Anterior: tidak ada red flag provenance otomatis
- `lab_buta_senja_defisiensi_vitamin_a` - Buta Senja karena Defisiensi Vitamin A: tidak ada red flag provenance otomatis
- `lab_episkleritis_ringan` - Episkleritis Sederhana: tidak ada red flag provenance otomatis
- `lab_hipermetropia` - Hipermetropia: tidak ada red flag provenance otomatis
- `lab_katarak_matur` - Katarak Senilis Lanjut dengan Gangguan Visual Berat: tidak ada red flag provenance otomatis
- `lab_mata_kering` - Mata Kering: tidak ada red flag provenance otomatis
- `lab_miopia_ringan` - Miopia Ringan: tidak ada red flag provenance otomatis
- `lab_perdarahan_subkonjungtiva` - Perdarahan Subkonjungtiva Spontan: tidak ada red flag provenance otomatis
- `lab_presbiopia` - Presbiopia: tidak ada red flag provenance otomatis
- `lab_retinopati_diabetik_proliferatif` - Suspek Retinopati Diabetik Mengancam Penglihatan: tidak ada red flag provenance otomatis
- `lab_trikiasis` - Trikiasis Tanpa Komplikasi Kornea: tidak ada red flag provenance otomatis
- `lab_anemia_defisiensi_besi_nonhamil` - Anemia Defisiensi Besi akibat Haid Banyak: tidak ada red flag provenance otomatis
- `lab_anemia_berat_perlu_transfusi` - Anemia Defisiensi Besi Berat Simptomatik akibat Perdarahan Kronik: tidak ada red flag provenance otomatis
- `lab_dm_tipe1_stabil_prb` - DM Tipe 1 Remaja: Review Spesialis lalu PRB: tidak ada red flag provenance otomatis
- `lab_defisiensi_vitamin_b_kompleks` - Dugaan Defisiensi Riboflavin dalam Kekurangan Mikronutrien Campuran: tidak ada red flag provenance otomatis
- `lab_defisiensi_mineral_zinc` - Dugaan Defisiensi Zinc: tidak ada red flag provenance otomatis
- `lab_malnutrisi_energi_protein_sedang` - Gizi Kurang Balita Tanpa Komplikasi: tidak ada red flag provenance otomatis
- `lab_kaki_diabetik_infeksi` - Kaki Diabetik Terinfeksi: tidak ada red flag provenance otomatis
- `lab_penyakit_ginjal_kronik_st3b` - Penyakit Ginjal Kronik G3b dengan Komplikasi: tidak ada red flag provenance otomatis
- `lab_hipertiroid_graves` - Suspek Penyakit Graves dengan Tirotoksikosis: tidak ada red flag provenance otomatis
- `lab_talasemia_beta_mayor_anak` - Talasemia Beta Mayor pada Anak: tidak ada red flag provenance otomatis
- `lab_fraktur_tertutup_antebrachii_anak` - Fraktur Tertutup Lengan Bawah Anak - Stabilisasi Pra-Rujuk: tidak ada red flag provenance otomatis
- `lab_lipoma_lengan` - Lipoma Subkutan: tidak ada red flag provenance otomatis
- `lab_ulkus_tungkai_vena` - Ulkus Tungkai Kronis - Dominan Vena: tidak ada red flag provenance otomatis
- `lab_abses_perianal` - Abses Perianal pada Penyandang Diabetes: tidak ada red flag provenance otomatis
- `lab_alergi_makanan_ringan` - Alergi Makanan Tanpa Anafilaksis: tidak ada red flag provenance otomatis
- `lab_apendisitis_akut_anak` - Apendisitis Akut pada Anak: tidak ada red flag provenance otomatis
- `lab_hemoroid_interna_derajat4` - Hemoroid Interna Derajat IV dengan Anemia: tidak ada red flag provenance otomatis
- `lab_hernia_inguinalis_inkarserata` - Hernia Inguinalis Inkarserata: tidak ada red flag provenance otomatis
- `lab_cacing_tambang` - Infeksi Cacing Tambang: tidak ada red flag provenance otomatis
- `lab_intoleransi_makanan_laktosa` - Intoleransi Makanan - Dugaan Laktosa: tidak ada red flag provenance otomatis
- `lab_kandidiasis_mulut` - Kandidiasis Mulut: tidak ada red flag provenance otomatis
- `lab_keracunan_makanan_ringan` - Keracunan Makanan Ringan: tidak ada red flag provenance otomatis
- `lab_kolesistitis_akut` - Kolesistitis Akut: tidak ada red flag provenance otomatis
- `lab_kolik_ureter_obstruksi` - Kolik Ureter — Suspek Batu Obstruktif: tidak ada red flag provenance otomatis
- `lab_ileus_obstruktif` - Obstruksi Usus Mekanik (Suspek Adhesi): tidak ada red flag provenance otomatis
- `lab_perdarahan_gi_atas` - Perdarahan Saluran Cerna Atas dengan Instabilitas Hemodinamik: tidak ada red flag provenance otomatis
- `lab_peritonitis_generalisata` - Peritonitis Generalisata: tidak ada red flag provenance otomatis
- `lab_retensio_urin_akut` - Retensi Urin Akut pada Pembesaran Prostat: tidak ada red flag provenance otomatis
- `lab_sirosis_hepatis_dekompensata` - Sirosis Hepatis Dekompensata: tidak ada red flag provenance otomatis
- `lab_skistosomiasis_sulteng` - Skistosomiasis dari Fokus Endemis Sulawesi Tengah: tidak ada red flag provenance otomatis
- `lab_stomatitis_aftosa` - Stomatitis Aftosa Rekuren: tidak ada red flag provenance otomatis
- `lab_strongiloidiasis` - Strongiloidiasis Kronik: tidak ada red flag provenance otomatis
- `lab_taeniasis_intestinal` - Taeniasis Intestinal Tanpa Gejala Neurologis: tidak ada red flag provenance otomatis
- `lab_bronkiolitis_berat` - Bronkiolitis Bayi dengan Hipoksemia: tidak ada red flag provenance otomatis
- `lab_efusi_pleura` - Efusi Pleura Simptomatik: tidak ada red flag provenance otomatis
- `lab_influenza_tanpa_komplikasi` - Influenza Tanpa Komplikasi: tidak ada red flag provenance otomatis
- `lab_laringitis_akut` - Laringitis Akut: tidak ada red flag provenance otomatis
- `lab_pertusis_remaja` - Pertusis pada Remaja: tidak ada red flag provenance otomatis
- `lab_pneumonia_komunitas_dewasa` - Pneumonia Komunitas Dewasa - Rawat Jalan: tidak ada red flag provenance otomatis
- `lab_pneumotoraks_spontan` - Pneumotoraks Spontan Primer dengan Gangguan Fisiologis: tidak ada red flag provenance otomatis
- `lab_ppok_eksaserbasi_berat` - PPOK Eksaserbasi Berat dengan Dugaan Infeksi Saluran Napas Bawah: tidak ada red flag provenance otomatis
- `lab_tb_paru_putus_obat_suspek_mdr` - TB Paru Resistan Rifampisin setelah Putus Pengobatan: tidak ada red flag provenance otomatis
- `lab_kejang_demam_sederhana` - Kejang Demam Sederhana: tidak ada red flag provenance otomatis
- `lab_meningitis_bakterial_suspek` - Suspek Meningitis Bakterial: tidak ada red flag provenance otomatis
- `lab_tia_serangan_iskemik_sesaat` - Suspek TIA — Defisit Fokal Sudah Pulih: tidak ada red flag provenance otomatis
- `lab_abses_peritonsil` - Abses Peritonsil: tidak ada red flag provenance otomatis
- `lab_benda_asing_esofagus` - Benda Asing Esofagus pada Anak — Baterai Kancing: tidak ada red flag provenance otomatis
- `lab_furunkel_hidung` - Furunkel pada Hidung: tidak ada red flag provenance otomatis
- `lab_mabuk_perjalanan` - Mabuk Perjalanan: tidak ada red flag provenance otomatis
- `lab_mastoiditis_akut` - Mastoiditis Akut pada Anak: tidak ada red flag provenance otomatis
- `lab_otitis_media_supuratif_kronik_komplikata` - OMSK Tipe Bahaya — Curiga Kolesteatoma: tidak ada red flag provenance otomatis
- `lab_rinitis_vasomotor` - Rinitis Vasomotor: tidak ada red flag provenance otomatis

## Cara regenerasi

```powershell
npm run m13:kfa
npm run m13:adjudication
```

Generator memvalidasi bahwa query KFA tepat mencakup seluruh obat prototipe. Test invariant terpisah mengunci jumlah 137, caseId exact, indeks PPK valid, dan larangan kode KFA karangan.

## Sumber resmi utama

- KMK 1199/2025 Formularium Nasional: https://e-fornas.kemkes.go.id/api/download?column=pustaka&filename=KMK%20No.%20HK.01.07-MENKES-1199-2025%20ttg%20Formularium%20Nasional.pdf
- Katalog PNPK Kemenkes: https://www.kemkes.go.id/id/media/subfolder/pedoman/pedoman-nasional-pelayanan-kedokteran-pnpk
- Produk hukum Kesehatan Lanjutan 2026: https://keslan.kemkes.go.id/produkhukum?id=2
- Dokumentasi KFA SATUSEHAT: https://satusehat.kemkes.go.id/platform/docs/id/master-data/kfa/preliminary/
- Browser publik KFA: https://satusehat.kemkes.go.id/kfa-browser/farmasi
- Baseline ASPAK lokal: `docs/M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`.
