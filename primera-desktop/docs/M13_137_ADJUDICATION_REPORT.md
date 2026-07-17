# M13-137 - Laporan Kompilasi Adjudikasi Prototipe Klinis

**Tanggal kompilasi:** 2026-07-17  
**Status:** research + compilation only; **bukan adjudikasi dokter dan tidak mengubah gameplay**  
**Snapshot:** commit `280c08babb358ca3ba2673b78eea8eee5f05615e`, artefak `aeb00572cdc7c9c781624a4e7c79b7dc1ca92d354c85b3bc6bfcd448efd3e1b1`, pack `f43843fc`, content release `m11-e2-saji-pilot-2026-07-17`, `REVISI_ENGINE=42`

## Ringkasan eksekutif

Briefing menyebut “M13-103”, tetapi query runtime `activationStatus === 'lab_prototype_unadjudicated'` menghasilkan **137 kasus**. Angka 103 berasal dari assertion minimum lama; Batch 4 menambah 34 kasus. Paket review ini karena itu sengaja mengunci **137/137**, bukan hanya 103 pertama.

| Indikator | Hasil |
|---|---:|
| Kasus prototipe aktual | **137** |
| Crosswalk PPK langsung | 89 |
| Crosswalk PPK terkait, bukan identik | 17 |
| Tanpa crosswalk PPK | 31 |
| Memiliki PNPK langsung | 30 |
| Saran kompilator “cocok” | 46 |
| Saran kompilator “perlu-koreksi” | 88 |
| Saran kompilator “tak-ada-sumber” | 3 |
| Kasus dengan resource Tier C/D | 64 |
| Obat unik non-Fornas menurut katalog | 9 |
| Query KFA aktif-substance tak terpetakan | 0 |

Angka saran kompilator **bukan skor mutu klinis**. “Perlu-koreksi” dapat dipicu oleh locator sumber, klaim Fornas, atau readiness ASPAK, meski inti diagnosis mungkin benar. Keputusan akhir tetap radio dokter pada artefak HTML.

## Deliverable

1. [M13_137_ADJUDICATION.html](M13_137_ADJUDICATION.html) - alat review interaktif, filter, autosave lokal, keputusan Setuju/Perlu Edit/Tolak/Nanti, ekspor-impor JSON.
2. [M13_137_ADJUDICATION_DATA.json](M13_137_ADJUDICATION_DATA.json) - dataset audit machine-readable 137 kasus.
3. [M13_137_KFA_SNAPSHOT.json](M13_137_KFA_SNAPSHOT.json) - snapshot endpoint publik KFA active-substance untuk 74 obat unik.
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

### Fornas 1199

- Setiap obat dibandingkan dengan flag `fornas` katalog dan teks resmi KMK 1199/2025.
- Locator berupa baris ekstrak lokal. Keberadaan nama belum otomatis berarti boleh di FPKTP: reviewer harus membaca kolom FPKTP/FPKTL, restriksi, dan batas peresepan di konteks tabel.
- Non-Fornas bukan otomatis “obat salah”; ia menuntut graceful degradation: alternatif Fornas, program, pengadaan lokal yang eksplisit, atau jejaring.

### ASPAK

- Baseline yang dipakai adalah keputusan M13-RP1 `sukamaju_middle_v1`: Puskesmas perdesaan nonrawat-inap, sarana inti cukup, tetapi alat/prasarana bukan all-ready.
- Tier C harus menyatakan jadwal/operator/consumable/readiness; Tier D tidak boleh diasumsikan dan tidak boleh menunda rujukan.
- Ini checklist authoring, bukan mekanik inventori runtime.

### KFA

- Endpoint publik browser KFA: `/api/search/active-ingredients`, diakses 2026-07-17.
- Snapshot menghasilkan kode active substance untuk semua query (0 unresolved).
- Kode tersebut **bukan** product template/variant, bukan status Fornas, dan bukan bukti stok. Tidak ada kode yang ditebak.

## Temuan provenance prioritas

### Atribusi PPK terlalu kuat (37)

Kasus berikut sudah menulis “PPK/1186” pada teks pemain, tetapi crosswalk hanya related atau tidak ditemukan. Ini perlu dibaca manual sebelum aktivasi; alternatifnya adalah melunakkan atribusi, mengganti sumber, atau memberi locator diagnosis-spesifik.

- `lab_trauma_abdomen_tumpul` - Trauma Abdomen Tumpul dengan Curiga Cedera Organ Padat: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_trauma_tajam_kulit_kepala` - Trauma Tajam Kulit Kepala Sederhana: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_trauma_tumpul_kepala_ringan` - Trauma Tumpul Kepala Risiko Rendah: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_hepatitis_b_kronik` - Hepatitis B Kronik Tanpa Gejala: related; Bab PPK berjudul hepatitis B tanpa pemisahan kronik; PNPK hepatitis B menjadi sumber utama.
- `lab_salpingitis_pid_ringan` - Salpingitis/PID Ringan Rawat Jalan: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_sindrom_duh_genital_servisitis` - Sindrom Duh Genital - Servisitis: related; Bab fluor albus/vaginal discharge, bukan servisitis terkonfirmasi.
- `lab_vaginosis_bakterialis` - Vaginosis Bakterialis: related; Bab vaginitis terkait, tetapi etiologi bakterial perlu sumber regimen yang lebih spesifik.
- `lab_gizi_buruk_komplikasi` - Gizi Buruk dengan Komplikasi pada Balita: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_hiperemesis_gravidarum_berat` - Hiperemesis Gravidarum Berat dengan Ketosis: related; Bab PPK membahas hiperemesis ringan; kasus ini berat dengan ketosis dan wajib dirujuk.
- `lab_mola_hidatidosa` - Mola Hidatidosa (Hamil Anggur): none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_penyakit_radang_panggul_berat` - Penyakit Radang Panggul Berat dengan Curiga Abses Tubo-Ovarium: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_plasenta_previa` - Perdarahan Antepartum karena Plasenta Previa: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_kehamilan_ektopik_terganggu_suspek` - Suspek Kehamilan Ektopik Terganggu: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_abses_folikel_rambut` - Abses Folikel Rambut Superfisial: related; Bab pioderma terkait infeksi kulit, bukan padanan abses yang identik.
- `lab_folikulitis_superfisialis` - Folikulitis Superfisialis: related; Bab pioderma terkait, bukan padanan folikulitis langsung.
- `lab_furunkel_fluktuatif` - Furunkel Fluktuatif Lokal: related; Bab pioderma terkait, bukan padanan furunkel langsung.
- `lab_ektima_tungkai` - Impetigo Ulseratif (Ektima): related; Bab pioderma/impetigo terkait; ektima lebih dalam dan tidak identik.
- `lab_ablasio_retina` - Ablasio Retina — Tirai Hitam Tanpa Nyeri: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_anemia_berat_perlu_transfusi` - Anemia Berat dengan Indikasi Transfusi: related; Bab anemia defisiensi besi tidak identik dengan anemia berat etiologi belum pasti.
- `lab_anemia_defisiensi_besi_nonhamil` - Anemia Defisiensi Besi pada Dewasa: related; Bab anemia defisiensi besi relevan; kode sumber memakai klasifikasi lama 280.
- `lab_defisiensi_mineral_zinc` - Defisiensi Mineral - Dugaan Kekurangan Zinc: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_defisiensi_vitamin_b_kompleks` - Defisiensi Vitamin B Kompleks Ringan: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_dm_tipe1_stabil_prb` - Diabetes Melitus Tipe 1 Stabil: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_hipertiroid_graves` - Hipertiroid Graves: related; Bab tirotoksikosis, bukan Graves spesifik.
- `lab_kaki_diabetik_infeksi` - Kaki Diabetik Terinfeksi: related; Bab DM tipe 2 memberi konteks, bukan pedoman kaki diabetik terinfeksi lengkap.
- `lab_malnutrisi_energi_protein_sedang` - Malnutrisi Energi-Protein Sedang Tanpa Komplikasi: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_penyakit_ginjal_kronik_st3b` - Penyakit Ginjal Kronik Stadium 3b: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_talasemia_beta_mayor_anak` - Talasemia Beta Mayor pada Anak: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_abses_perianal` - Abses Perianal pada Penyandang Diabetes: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_hemoroid_interna_derajat4` - Hemoroid Interna Derajat IV dengan Anemia: related; PPK membahas grade 1-2; kasus grade IV memakai bab ini hanya untuk batas rujuk.
- `lab_hernia_inguinalis_inkarserata` - Hernia Inguinalis Inkarserata: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_kolik_ureter_obstruksi` - Kolik Ureter oleh Batu dengan Obstruksi: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_retensio_urin_akut` - Retensi Urin Akut pada Pembesaran Prostat: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_sirosis_hepatis_dekompensata` - Sirosis Hepatis Dekompensata: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_meningitis_bakterial_suspek` - Suspek Meningitis Bakterial: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_benda_asing_esofagus` - Benda Asing Esofagus pada Anak — Baterai Kancing: none; Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.
- `lab_mastoiditis_akut` - Mastoiditis Akut pada Anak: related; Komplikasi OMSK terkait, tetapi mastoiditis akut tidak mempunyai bab PPK sendiri.

### Tidak ada PPK maupun PNPK diagnosis-spesifik (15)

“Tak ada sumber” di sini berarti tidak ada sumber yang berhasil dipetakan dalam corpus resmi saat kompilasi, **bukan** bahwa penyakit tidak punya pedoman di dunia. Kasus ini memerlukan sumber program/EBM tambahan atau klaim yang dibatasi.

- `lab_ablasio_retina` - Ablasio Retina — Tirai Hitam Tanpa Nyeri
- `lab_defisiensi_mineral_zinc` - Defisiensi Mineral - Dugaan Kekurangan Zinc
- `lab_defisiensi_vitamin_b_kompleks` - Defisiensi Vitamin B Kompleks Ringan
- `lab_dm_tipe1_stabil_prb` - Diabetes Melitus Tipe 1 Stabil
- `lab_abses_perianal` - Abses Perianal pada Penyandang Diabetes
- `lab_cacing_tambang` - Infeksi Cacing Tambang
- `lab_retensio_urin_akut` - Retensi Urin Akut pada Pembesaran Prostat
- `lab_skistosomiasis_sulteng` - Skistosomiasis dari Fokus Endemis Sulawesi Tengah
- `lab_strongiloidiasis` - Strongiloidiasis Kronik
- `lab_taeniasis_intestinal` - Taeniasis Intestinal Tanpa Gejala Neurologis
- `lab_efusi_pleura` - Efusi Pleura Simptomatik
- `lab_pertusis_remaja` - Pertusis pada Remaja
- `lab_meningitis_bakterial_suspek` - Suspek Meningitis Bakterial
- `lab_benda_asing_esofagus` - Benda Asing Esofagus pada Anak — Baterai Kancing
- `lab_mabuk_perjalanan` - Mabuk Perjalanan

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

### Flag Fornas=true tetapi locator komponen belum lengkap (2)

- `ringer_laktat_inf` - Ringer Laktat Infus; query: ringer laktat
- `air_mata_buatan` - Air Mata Buatan (Hipromelosa); query: hipromelosa

## Daftar triase kompilator

### Perlu koreksi

- `lab_parafimosis_reduksibel` - Parafimosis Akut: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_trauma_abdomen_tumpul` - Trauma Abdomen Tumpul dengan Curiga Cedera Organ Padat: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_trauma_tajam_kulit_kepala` - Trauma Tajam Kulit Kepala Sederhana: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait.
- `lab_trauma_tumpul_kepala_ringan` - Trauma Tumpul Kepala Risiko Rendah: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait.
- `lab_hepatitis_a_akut` - Hepatitis A Akut Tanpa Gagal Hati: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_hepatitis_b_kronik` - Hepatitis B Kronik Tanpa Gejala: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_hiv_tanpa_komplikasi` - HIV Tanpa Komplikasi - Inisiasi Program: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_leptospirosis_tanpa_komplikasi` - Leptospirosis Tanpa Komplikasi: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_pielonefritis_tanpa_komplikasi` - Pielonefritis Akut Tanpa Komplikasi: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_salpingitis_pid_ringan` - Salpingitis/PID Ringan Rawat Jalan: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait.
- `lab_sindrom_duh_genital_servisitis` - Sindrom Duh Genital - Servisitis: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_vaginitis_kandida` - Vaginitis Kandidiasis: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_vaginosis_bakterialis` - Vaginosis Bakterialis: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_edema_paru_akut_hipertensif` - Edema Paru Akut Hipertensif: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_gagal_jantung_dekompensasi` - Gagal Jantung Dekompensasi Akut: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_gizi_buruk_komplikasi` - Gizi Buruk dengan Komplikasi pada Balita: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_hiperemesis_gravidarum_berat` - Hiperemesis Gravidarum Berat dengan Ketosis: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_infeksi_umbilikus_neonatus` - Infeksi Umbilikus dengan Tanda Sistemik: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_mola_hidatidosa` - Mola Hidatidosa (Hamil Anggur): Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_penyakit_radang_panggul_berat` - Penyakit Radang Panggul Berat dengan Curiga Abses Tubo-Ovarium: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_plasenta_previa` - Perdarahan Antepartum karena Plasenta Previa: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_ruptur_perineum_derajat_1` - Ruptur Perineum Derajat 1 dengan Perdarahan: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_kehamilan_ektopik_terganggu_suspek` - Suspek Kehamilan Ektopik Terganggu: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_abses_folikel_rambut` - Abses Folikel Rambut Superfisial: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_akne_vulgaris_ringan` - Akne Vulgaris Ringan: Grounding Fornas perlu ditinjau: benzoyl_peroksida_25.
- `lab_dermatitis_atopik_ringan` - Dermatitis Atopik Ringan: Grounding Fornas perlu ditinjau: emolien_petrolatum.
- `lab_dermatitis_kontak_iritan_tangan` - Dermatitis Kontak Iritan Tangan: Grounding Fornas perlu ditinjau: emolien_petrolatum.
- `lab_dermatitis_numularis` - Dermatitis Numularis: Grounding Fornas perlu ditinjau: emolien_petrolatum. Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_dermatitis_perioral` - Dermatitis Perioral: Grounding Fornas perlu ditinjau: metronidazol_topikal_075.
- `lab_dermatitis_popok_iritan` - Dermatitis Popok Iritan: Grounding Fornas perlu ditinjau: zinc_oxide_krim.
- `lab_eritrasma_lipat_paha` - Eritrasma Lipat Paha: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_filariasis_terkonfirmasi` - Filariasis Limfatik Terkonfirmasi: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_folikulitis_superfisialis` - Folikulitis Superfisialis: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_furunkel_fluktuatif` - Furunkel Fluktuatif Lokal: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_hidradenitis_supuratif_hurley1` - Hidradenitis Supuratif Hurley I: Grounding Fornas perlu ditinjau: klindamisin_topikal_1.
- `lab_ektima_tungkai` - Impetigo Ulseratif (Ektima): Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_kusta_pausibasiler` - Kusta Pausibasiler Tanpa Reaksi: Grounding Fornas perlu ditinjau: mdt_kusta_pb. Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_pedikulosis_pubis` - Pedikulosis Pubis: Grounding Fornas perlu ditinjau: permetrin_losion_1.
- `lab_pitiriasis_versikolor` - Pitiriasis Versikolor: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_skrofuloderma_suspek` - Suspek Skrofuloderma - Konfirmasi Program: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_tinea_barbae` - Tinea Barbae Noninflamasi: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_tinea_fasialis` - Tinea Fasialis: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_tinea_kapitis_anak` - Tinea Kapitis Noninflamasi: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_tinea_kruris` - Tinea Kruris: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_tinea_manus` - Tinea Manus: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_tinea_pedis` - Tinea Pedis Interdigital: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_tinea_unguium_terkonfirmasi` - Tinea Unguium Terbatas: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_ablasio_retina` - Ablasio Retina — Tirai Hitam Tanpa Nyeri: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_benda_asing_konjungtiva` - Benda Asing Konjungtiva Superfisial: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_blefaritis_anterior` - Blefaritis Anterior: Grounding Fornas perlu ditinjau: air_mata_buatan.
- `lab_episkleritis_ringan` - Episkleritis Sederhana: Grounding Fornas perlu ditinjau: air_mata_buatan.
- `lab_mata_kering` - Mata Kering: Grounding Fornas perlu ditinjau: air_mata_buatan.
- `lab_retinopati_diabetik_proliferatif` - Retinopati Diabetik Proliferatif: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_trikiasis` - Trikiasis Tanpa Komplikasi Kornea: Grounding Fornas perlu ditinjau: air_mata_buatan. Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_anemia_berat_perlu_transfusi` - Anemia Berat dengan Indikasi Transfusi: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_anemia_defisiensi_besi_nonhamil` - Anemia Defisiensi Besi pada Dewasa: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_defisiensi_mineral_zinc` - Defisiensi Mineral - Dugaan Kekurangan Zinc: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_defisiensi_vitamin_b_kompleks` - Defisiensi Vitamin B Kompleks Ringan: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_dm_tipe1_stabil_prb` - Diabetes Melitus Tipe 1 Stabil: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_hipertiroid_graves` - Hipertiroid Graves: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_kaki_diabetik_infeksi` - Kaki Diabetik Terinfeksi: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_malnutrisi_energi_protein_sedang` - Malnutrisi Energi-Protein Sedang Tanpa Komplikasi: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait.
- `lab_penyakit_ginjal_kronik_st3b` - Penyakit Ginjal Kronik Stadium 3b: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_talasemia_beta_mayor_anak` - Talasemia Beta Mayor pada Anak: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_fraktur_tertutup_antebrachii_anak` - Fraktur Tertutup Lengan Bawah Anak - Stabilisasi Pra-Rujuk: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_abses_perianal` - Abses Perianal pada Penyandang Diabetes: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_apendisitis_akut_anak` - Apendisitis Akut pada Anak: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_hemoroid_interna_derajat4` - Hemoroid Interna Derajat IV dengan Anemia: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_hernia_inguinalis_inkarserata` - Hernia Inguinalis Inkarserata: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_ileus_obstruktif` - Ileus Obstruktif: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_cacing_tambang` - Infeksi Cacing Tambang: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_kolesistitis_akut` - Kolesistitis Akut: Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_kolik_ureter_obstruksi` - Kolik Ureter oleh Batu dengan Obstruksi: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_peritonitis_generalisata` - Peritonitis Generalisata: Grounding Fornas perlu ditinjau: ringer_laktat_inf. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_retensio_urin_akut` - Retensi Urin Akut pada Pembesaran Prostat: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_sirosis_hepatis_dekompensata` - Sirosis Hepatis Dekompensata: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_skistosomiasis_sulteng` - Skistosomiasis dari Fokus Endemis Sulawesi Tengah: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_stomatitis_aftosa` - Stomatitis Aftosa Rekuren: Grounding Fornas perlu ditinjau: triamcinolone_orabase.
- `lab_strongiloidiasis` - Strongiloidiasis Kronik: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_taeniasis_intestinal` - Taeniasis Intestinal Tanpa Gejala Neurologis: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_pneumonia_komunitas_dewasa` - Pneumonia Komunitas Dewasa - Rawat Jalan: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_ppok_eksaserbasi_berat` - PPOK Eksaserbasi Berat dengan Infeksi Saluran Napas Bawah: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_tb_paru_putus_obat_suspek_mdr` - TB Paru Putus Obat dengan Suspek Resistan Obat: Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.
- `lab_meningitis_bakterial_suspek` - Suspek Meningitis Bakterial: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_tia_serangan_iskemik_sesaat` - TIA — Serangan Iskemik Sesaat yang Sudah Pulih: Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.
- `lab_benda_asing_esofagus` - Benda Asing Esofagus pada Anak — Baterai Kancing: Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait. Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk. Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_mastoiditis_akut` - Mastoiditis Akut pada Anak: Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED. Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario. Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_rinitis_vasomotor` - Rinitis Vasomotor: Grounding Fornas perlu ditinjau: flutikason_semprot_hidung.

### Tak ada sumber

- `lab_efusi_pleura` - Efusi Pleura Simptomatik: Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_pertusis_remaja` - Pertusis pada Remaja: Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.
- `lab_mabuk_perjalanan` - Mabuk Perjalanan: Belum ada PPK/PNPK diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian pedoman tanpa sumber tambahan.

### Cocok secara provenance awal

- `lab_luka_bakar_derajat2_dangkal` - Luka Bakar Derajat II Dangkal Terbatas: tidak ada red flag provenance otomatis
- `lab_anafilaksis_makanan` - Reaksi Anafilaktik setelah Makanan: tidak ada red flag provenance otomatis
- `lab_vulnus_laseratum_lengan` - Vulnus Laseratum Sederhana: tidak ada red flag provenance otomatis
- `lab_gonore_uretritis_pria` - Gonore Uretra Tanpa Komplikasi: tidak ada red flag provenance otomatis
- `lab_limfadenitis_servikal_akut` - Limfadenitis Servikal Akut Bakterial: tidak ada red flag provenance otomatis
- `lab_parotitis_mumps` - Parotitis Epidemika (Mumps): tidak ada red flag provenance otomatis
- `lab_tetanus_generalisata_awal` - Tetanus Generalisata - Stabilisasi dan Rujuk: tidak ada red flag provenance otomatis
- `lab_vulvitis_iritan` - Vulvitis Iritan: tidak ada red flag provenance otomatis
- `lab_gangguan_somatoform` - Gangguan Somatoform: tidak ada red flag provenance otomatis
- `lab_abortus_spontan_komplit` - Abortus Spontan Komplit - Stabil: tidak ada red flag provenance otomatis
- `lab_puting_lecet` - Cracked Nipple karena Perlekatan Buruk: tidak ada red flag provenance otomatis
- `lab_fimosis_patologis_ringan` - Fimosis Patologis Tanpa Retensi: tidak ada red flag provenance otomatis
- `lab_puting_tenggelam_laktasi` - Inverted Nipple dengan Kesulitan Laktasi: tidak ada red flag provenance otomatis
- `lab_mastitis_laktasi` - Mastitis Laktasi Tanpa Abses: tidak ada red flag provenance otomatis
- `lab_cutaneous_larva_migrans` - Cutaneous Larva Migrans: tidak ada red flag provenance otomatis
- `lab_dermatitis_seboroik_dewasa` - Dermatitis Seboroik Dewasa: tidak ada red flag provenance otomatis
- `lab_erisipelas_tungkai_ringan` - Erisipelas Tungkai Tanpa Sepsis: tidak ada red flag provenance otomatis
- `lab_erupsi_obat_morbiliformis` - Erupsi Obat Morbiliformis Tanpa SCAR: tidak ada red flag provenance otomatis
- `lab_herpes_simpleks_labialis` - Herpes Simpleks Labialis Rekuren: tidak ada red flag provenance otomatis
- `lab_miliaria_rubra` - Miliaria Rubra: tidak ada red flag provenance otomatis
- `lab_moluskum_kontagiosum_anak` - Moluskum Kontagiosum Anak: tidak ada red flag provenance otomatis
- `lab_pitiriasis_rosea` - Pitiriasis Rosea: tidak ada red flag provenance otomatis
- `lab_reaksi_gigitan_serangga` - Reaksi Lokal Gigitan Serangga: tidak ada red flag provenance otomatis
- `lab_sifilis_primer` - Sifilis Primer: tidak ada red flag provenance otomatis
- `lab_astigmatisme_ringan` - Astigmatisme Ringan: tidak ada red flag provenance otomatis
- `lab_buta_senja_defisiensi_vitamin_a` - Buta Senja karena Defisiensi Vitamin A: tidak ada red flag provenance otomatis
- `lab_hipermetropia` - Hipermetropia: tidak ada red flag provenance otomatis
- `lab_katarak_matur` - Katarak Matur pada Lansia: tidak ada red flag provenance otomatis
- `lab_miopia_ringan` - Miopia Ringan: tidak ada red flag provenance otomatis
- `lab_perdarahan_subkonjungtiva` - Perdarahan Subkonjungtiva Spontan: tidak ada red flag provenance otomatis
- `lab_presbiopia` - Presbiopia: tidak ada red flag provenance otomatis
- `lab_lipoma_lengan` - Lipoma Subkutan: tidak ada red flag provenance otomatis
- `lab_ulkus_tungkai_vena` - Ulkus Tungkai Kronis - Dominan Vena: tidak ada red flag provenance otomatis
- `lab_alergi_makanan_ringan` - Alergi Makanan Tanpa Anafilaksis: tidak ada red flag provenance otomatis
- `lab_intoleransi_makanan_laktosa` - Intoleransi Makanan - Dugaan Laktosa: tidak ada red flag provenance otomatis
- `lab_kandidiasis_mulut` - Kandidiasis Mulut: tidak ada red flag provenance otomatis
- `lab_keracunan_makanan_ringan` - Keracunan Makanan Ringan: tidak ada red flag provenance otomatis
- `lab_perdarahan_gi_atas` - Perdarahan Saluran Cerna Atas dengan Syok Terkompensasi: tidak ada red flag provenance otomatis
- `lab_bronkiolitis_berat` - Bronkiolitis Bayi dengan Hipoksemia: tidak ada red flag provenance otomatis
- `lab_influenza_tanpa_komplikasi` - Influenza Tanpa Komplikasi: tidak ada red flag provenance otomatis
- `lab_laringitis_akut` - Laringitis Akut: tidak ada red flag provenance otomatis
- `lab_pneumotoraks_spontan` - Pneumotoraks Spontan: tidak ada red flag provenance otomatis
- `lab_kejang_demam_sederhana` - Kejang Demam Sederhana: tidak ada red flag provenance otomatis
- `lab_abses_peritonsil` - Abses Peritonsil: Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.
- `lab_furunkel_hidung` - Furunkel pada Hidung: tidak ada red flag provenance otomatis
- `lab_otitis_media_supuratif_kronik_komplikata` - OMSK Tipe Bahaya — Curiga Kolesteatoma: tidak ada red flag provenance otomatis

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
