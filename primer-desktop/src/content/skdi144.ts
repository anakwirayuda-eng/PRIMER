/**
 * SKDI 144 — daftar 144 penyakit wajib tuntas di FKTP
 * (KMK No. HK.01.07/MENKES/1186/2022), untuk Dex Buku Saku.
 *
 * Di-port dari repo lama `src/data/FKTP144Diseases.js` dengan perbaikan
 * 3 duplikat id di sumber:
 *  - `impetigo` ganda → entri "Impetigo Ulseratif (Ektima)" menjadi `ektima` (L08.0)
 *  - `furuncle` ganda → entri "Abses Folikel Rambut/Kelenjar Sebasea" (sistem
 *    reproduksi) menjadi `abses_folikel_rambut` (L02.9)
 *  - `sharp_trauma` ganda → entri "Vulnus Laseratum, Punctum" menjadi
 *    `vulnus_laseratum` (T14.1)
 * Hasil: TEPAT 144 entri dengan id unik.
 *
 * `kasusId` menghubungkan entri ke kasus playable di vertical slice
 * (15 dari 16 kasus slice ada di daftar ini; stroke iskemik bukan penyakit
 * FKTP-144 sehingga tidak punya entri).
 */

export const SKDI144: { id: string; nama: string; icd10: string; kasusId?: string }[] = [
  // === SISTEM SARAF & JIWA (9) ===
  { id: 'febrile_seizure', nama: 'Kejang Demam', icd10: 'R56.0' },
  { id: 'tetanus', nama: 'Tetanus', icd10: 'A35' },
  { id: 'hiv_uncomplicated', nama: 'HIV/AIDS Tanpa Komplikasi', icd10: 'Z21' },
  { id: 'tension_headache', nama: 'Nyeri Kepala Tipe Tegang', icd10: 'G44.2' },
  { id: 'migraine', nama: 'Migren', icd10: 'G43.9' },
  { id: 'bells_palsy', nama: "Bell's Palsy", icd10: 'G51.0' },
  { id: 'vertigo_bppv', nama: 'Vertigo (BPPV)', icd10: 'R42' },
  { id: 'somatoform', nama: 'Gangguan Somatoform', icd10: 'F45' },
  { id: 'insomnia', nama: 'Insomnia', icd10: 'F51.0' },

  // === SISTEM INDRA — MATA (13) ===
  { id: 'foreign_body_conjunctiva', nama: 'Benda Asing Konjungtiva', icd10: 'T15.9' },
  {
    id: 'conjunctivitis_bacterial',
    nama: 'Konjungtivitis',
    icd10: 'H10.9',
    kasusId: 'konjungtivitis_bakterial',
  },
  { id: 'subconjunctival_hemorrhage', nama: 'Perdarahan Subkonjungtiva', icd10: 'H11.3' },
  { id: 'dry_eye', nama: 'Mata Kering', icd10: 'H04.1' },
  { id: 'blepharitis', nama: 'Blefaritis', icd10: 'H01.0' },
  { id: 'hordeolum', nama: 'Hordeolum (Bintitan)', icd10: 'H00.0' },
  { id: 'trichiasis', nama: 'Trikiasis', icd10: 'H02' },
  { id: 'episcleritis', nama: 'Episkleritis', icd10: 'H15.1' },
  { id: 'hypermetropia', nama: 'Hipermetropia', icd10: 'H52.0' },
  { id: 'myopia_mild', nama: 'Miopia Ringan', icd10: 'H52.1' },
  { id: 'astigmatism_mild', nama: 'Astigmatisme Ringan', icd10: 'H52.2' },
  { id: 'presbyopia', nama: 'Presbiopia', icd10: 'H52.4' },
  { id: 'night_blindness', nama: 'Buta Senja', icd10: 'H53.6' },

  // === SISTEM INDRA — THT (9) ===
  { id: 'otitis_externa', nama: 'Otitis Eksterna', icd10: 'H60.9' },
  {
    id: 'otitis_media_acute',
    nama: 'Otitis Media Akut',
    icd10: 'H65.0',
    kasusId: 'otitis_media_akut',
  },
  { id: 'cerumen_prop', nama: 'Serumen Prop', icd10: 'H61.2' },
  { id: 'motion_sickness', nama: 'Mabuk Perjalanan', icd10: 'T75.3' },
  { id: 'furunkel_nose', nama: 'Furunkel pada Hidung', icd10: 'J34.0' },
  { id: 'ispa_common', nama: 'Rinitis Akut / ISPA (Common Cold)', icd10: 'J00', kasusId: 'ispa_common_cold' },
  { id: 'rhinitis_vasomotor', nama: 'Rinitis Vasomotor', icd10: 'J30.0' },
  { id: 'rhinitis_allergic', nama: 'Rinitis Alergika', icd10: 'J30.4' },
  { id: 'foreign_body_nose', nama: 'Benda Asing di Hidung', icd10: 'T17.1' },

  // === SISTEM RESPIRASI (10) ===
  { id: 'epistaxis', nama: 'Epistaksis', icd10: 'R04.0' },
  { id: 'influenza', nama: 'Influenza', icd10: 'J11' },
  { id: 'pertussis', nama: 'Pertusis', icd10: 'A37' },
  { id: 'acute_pharyngitis', nama: 'Faringitis Akut', icd10: 'J02.9', kasusId: 'faringitis_akut' },
  { id: 'tonsillitis_acute', nama: 'Tonsilitis Akut', icd10: 'J03.9' },
  { id: 'laryngitis_acute', nama: 'Laringitis Akut', icd10: 'J04.0' },
  { id: 'asthma_bronchiale', nama: 'Asma Bronkial', icd10: 'J45.9', kasusId: 'asma_ringan' },
  { id: 'bronchitis_acute', nama: 'Bronkitis Akut', icd10: 'J20.9' },
  {
    id: 'pneumonia_bacterial',
    nama: 'Pneumonia, Bronkopneumonia',
    icd10: 'J18.9',
    kasusId: 'pneumonia_balita',
  },
  { id: 'tb_pulmonary', nama: 'Tuberkulosis Paru Tanpa Komplikasi', icd10: 'A15', kasusId: 'tb_paru' },

  // === SISTEM KARDIOVASKULAR (1) ===
  {
    id: 'hypertension_primary',
    nama: 'Hipertensi Esensial',
    icd10: 'I10',
    kasusId: 'hipertensi_esensial',
  },

  // === SISTEM PENCERNAAN (18) ===
  { id: 'oral_candidiasis', nama: 'Kandidiasis Mulut', icd10: 'B37.9' },
  { id: 'stomatitis_aftosa', nama: 'Ulkus Mulut (Aftosa, Herpes)', icd10: 'K12' },
  { id: 'parotitis_mumps', nama: 'Parotitis', icd10: 'B26' },
  { id: 'umbilical_infection', nama: 'Infeksi pada Umbilikus', icd10: 'P38' },
  { id: 'gastritis_acute', nama: 'Gastritis', icd10: 'K29.7', kasusId: 'gastritis' },
  {
    id: 'acute_gastroenteritis',
    nama: 'Gastroenteritis (termasuk Kolera, Giardiasis)',
    icd10: 'A09',
    kasusId: 'diare_akut_anak',
  },
  { id: 'gerd', nama: 'Refluks Gastroesofagus (GERD)', icd10: 'K21.9' },
  { id: 'typhoid_fever', nama: 'Demam Tifoid', icd10: 'A01.0', kasusId: 'demam_tifoid' },
  { id: 'food_intolerance', nama: 'Intoleransi Makanan', icd10: 'K90.4' },
  { id: 'food_allergy', nama: 'Alergi Makanan', icd10: 'L27.2' },
  { id: 'food_poisoning', nama: 'Keracunan Makanan', icd10: 'T62' },
  { id: 'hookworm', nama: 'Penyakit Cacing Tambang', icd10: 'B76.0' },
  { id: 'strongyloidiasis', nama: 'Strongiloidiasis', icd10: 'B78.9' },
  { id: 'ascariasis', nama: 'Askariasis', icd10: 'B77.9' },
  { id: 'schistosomiasis', nama: 'Skistosomiasis', icd10: 'B65.9' },
  { id: 'taeniasis', nama: 'Taeniasis', icd10: 'B68.9' },
  { id: 'hepatitis_a', nama: 'Hepatitis A', icd10: 'B15' },
  { id: 'dysentery', nama: 'Disentri Basiler, Disentri Amuba', icd10: 'A03' },

  // === SISTEM GINJAL & SALURAN KEMIH (6) ===
  { id: 'hemorrhoid_12', nama: 'Hemoroid Grade 1–2', icd10: 'I84' },
  { id: 'uti', nama: 'Infeksi Saluran Kemih', icd10: 'N39.0' },
  { id: 'gonorrhea', nama: 'Gonore', icd10: 'A54.9' },
  { id: 'pyelonephritis', nama: 'Pielonefritis Tanpa Komplikasi', icd10: 'N10' },
  { id: 'phimosis', nama: 'Fimosis', icd10: 'N47.1' },
  { id: 'paraphimosis', nama: 'Parafimosis', icd10: 'N47.2' },

  // === SISTEM REPRODUKSI (14) ===
  { id: 'genital_discharge', nama: 'Sindroma Duh Genital (Gonore & Non-Gonore)', icd10: 'N89' },
  { id: 'lower_uti', nama: 'Infeksi Saluran Kemih Bagian Bawah', icd10: 'N30.0' },
  { id: 'vulvitis', nama: 'Vulvitis', icd10: 'N76.0' },
  { id: 'vaginitis', nama: 'Vaginitis', icd10: 'N76.0' },
  { id: 'bacterial_vaginosis', nama: 'Vaginosis Bakterialis', icd10: 'N76.0' },
  { id: 'salpingitis', nama: 'Salpingitis', icd10: 'N70' },
  { id: 'normal_pregnancy', nama: 'Kehamilan Normal', icd10: 'Z34' },
  { id: 'complete_abortion', nama: 'Abortus Spontan Komplit', icd10: 'O03.9' },
  {
    // ICD-10 harus D50.9 (defisiensi besi) agar COCOK dengan kasus yang
    // ditautkan (anemia_defisiensi_bumil, icd10 D50.9). Sebelumnya O99.0
    // ("anemia komplikasi kehamilan", generik) — menabrakkan nama dgn D50.9
    // di daftar diagnosis banding kasus (dua opsi tampak identik). O99.0 kini
    // bebas menampilkan nama distingtifnya sendiri ("Anemia dalam Kehamilan",
    // lihat icd10.ts) sebagai distraktor "jawaban tak-spesifik".
    id: 'anemia_pregnancy',
    nama: 'Anemia Defisiensi Besi pada Kehamilan',
    icd10: 'D50.9',
    kasusId: 'anemia_defisiensi_bumil',
  },
  { id: 'perineal_rupture_12', nama: 'Ruptur Perineum Tingkat 1–2', icd10: 'O70.0' },
  { id: 'abses_folikel_rambut', nama: 'Abses Folikel Rambut / Kelenjar Sebasea', icd10: 'L02.9' },
  { id: 'mastitis_lactation', nama: 'Mastitis', icd10: 'N61' },
  { id: 'cracked_nipple', nama: 'Cracked Nipple (Puting Lecet)', icd10: 'O92.13' },
  { id: 'inverted_nipple', nama: 'Inverted Nipple (Puting Tenggelam)', icd10: 'O92.03' },

  // === SISTEM ENDOKRIN, METABOLIK & NUTRISI (9) ===
  { id: 'dm_type1', nama: 'Diabetes Melitus Tipe 1', icd10: 'E10' },
  { id: 'dm_type2', nama: 'Diabetes Melitus Tipe 2', icd10: 'E11', kasusId: 'dm_tipe2' },
  { id: 'hypoglycemia_mild', nama: 'Hipoglikemia Ringan', icd10: 'E16.2' },
  { id: 'pem', nama: 'Malnutrisi Energi-Protein', icd10: 'E44' },
  { id: 'vitamin_deficiency', nama: 'Defisiensi Vitamin', icd10: 'E50-E56' },
  { id: 'mineral_deficiency', nama: 'Defisiensi Mineral', icd10: 'E58-E61' },
  { id: 'dyslipidemia', nama: 'Dislipidemia', icd10: 'E78.5' },
  { id: 'hyperuricemia', nama: 'Hiperurisemia', icd10: 'E79.0' },
  { id: 'obesity', nama: 'Obesitas', icd10: 'E66.9' },

  // === SISTEM HEMATOLOGI & IMUNOLOGI (6) ===
  { id: 'anemia_deficiency', nama: 'Anemia Defisiensi Besi', icd10: 'D50' },
  { id: 'lymphadenitis', nama: 'Limfadenitis', icd10: 'I88' },
  { id: 'dengue_df', nama: 'Demam Dengue, DHF', icd10: 'A90', kasusId: 'dengue_df' },
  { id: 'malaria_vivax', nama: 'Malaria', icd10: 'B54' },
  { id: 'leptospirosis', nama: 'Leptospirosis Tanpa Komplikasi', icd10: 'A27.9' },
  { id: 'anaphylaxis', nama: 'Reaksi Anafilaktik', icd10: 'T78.2' },

  // === SISTEM MUSKULOSKELETAL (2) ===
  { id: 'leg_ulcer', nama: 'Ulkus pada Tungkai', icd10: 'L97' },
  { id: 'lipoma', nama: 'Lipoma', icd10: 'D17' },

  // === SISTEM INTEGUMEN / KULIT (45) ===
  { id: 'verruca_vulgaris', nama: 'Veruka Vulgaris', icd10: 'B07' },
  { id: 'molluscum', nama: 'Moluskum Kontagiosum', icd10: 'B08.1' },
  { id: 'herpes_zoster', nama: 'Herpes Zoster Tanpa Komplikasi', icd10: 'B02.9' },
  { id: 'morbilli', nama: 'Morbili Tanpa Komplikasi', icd10: 'B05.9' },
  { id: 'varicella', nama: 'Varisela Tanpa Komplikasi', icd10: 'B01.9' },
  { id: 'herpes_simplex', nama: 'Herpes Simpleks Tanpa Komplikasi', icd10: 'B00.9' },
  { id: 'impetigo', nama: 'Impetigo', icd10: 'L01.0' },
  { id: 'ektima', nama: 'Impetigo Ulseratif (Ektima)', icd10: 'L08.0' },
  { id: 'folliculitis', nama: 'Folikulitis Superfisialis', icd10: 'L73.9' },
  { id: 'furuncle', nama: 'Furunkel, Karbunkel', icd10: 'L02' },
  { id: 'erythrasma', nama: 'Eritrasma', icd10: 'L08.1' },
  { id: 'erysipelas', nama: 'Erisipelas', icd10: 'A46' },
  { id: 'scrofuloderma', nama: 'Skrofuloderma', icd10: 'A18.4' },
  { id: 'leprosy', nama: 'Lepra (Morbus Hansen)', icd10: 'A30' },
  { id: 'syphilis_12', nama: 'Sifilis Stadium 1 dan 2', icd10: 'A51' },
  { id: 'tinea_capitis', nama: 'Tinea Kapitis', icd10: 'B35.0' },
  { id: 'tinea_barbae', nama: 'Tinea Barbae', icd10: 'B35.0' },
  { id: 'tinea_facialis', nama: 'Tinea Fasialis', icd10: 'B35.8' },
  { id: 'tinea_corporis', nama: 'Tinea Korporis', icd10: 'B35.4' },
  { id: 'tinea_manus', nama: 'Tinea Manus', icd10: 'B35.2' },
  { id: 'tinea_unguium', nama: 'Tinea Unguium', icd10: 'B35.1' },
  { id: 'tinea_cruris', nama: 'Tinea Kruris', icd10: 'B35.6' },
  { id: 'tinea_pedis', nama: 'Tinea Pedis', icd10: 'B35.3' },
  { id: 'pityriasis_versicolor', nama: 'Pitiriasis Versikolor (Panu)', icd10: 'B36.0' },
  { id: 'candidiasis_mucocutan', nama: 'Kandidiasis Mukokutan Ringan', icd10: 'B37.2' },
  { id: 'cutaneous_larva_migrans', nama: 'Cutaneous Larva Migrans', icd10: 'B76.9' },
  { id: 'filariasis', nama: 'Filariasis', icd10: 'B74' },
  { id: 'pediculosis_capitis', nama: 'Pedikulosis Kapitis (Kutu Rambut)', icd10: 'B85.0' },
  { id: 'pediculosis_pubis', nama: 'Pedikulosis Pubis', icd10: 'B85.3' },
  { id: 'scabies', nama: 'Skabies', icd10: 'B86', kasusId: 'skabies' },
  { id: 'insect_bite', nama: 'Reaksi Gigitan Serangga', icd10: 'T63.4' },
  { id: 'dermatitis_kontak', nama: 'Dermatitis Kontak Iritan', icd10: 'L24' },
  { id: 'atopic_dermatitis', nama: 'Dermatitis Atopik (Kecuali Rekalsitran)', icd10: 'L20' },
  { id: 'nummular_dermatitis', nama: 'Dermatitis Numularis', icd10: 'L30.0' },
  { id: 'napkin_eczema', nama: 'Eksema Popok (Napkin Eczema)', icd10: 'L22' },
  { id: 'seborrheic_dermatitis', nama: 'Dermatitis Seboroik', icd10: 'L21' },
  { id: 'pityriasis_rosea', nama: 'Pitiriasis Rosea', icd10: 'L42' },
  { id: 'acne_vulgaris', nama: 'Akne Vulgaris Ringan', icd10: 'L70.0' },
  { id: 'hidradenitis', nama: 'Hidradenitis Supuratif', icd10: 'L73.2' },
  { id: 'perioral_dermatitis', nama: 'Dermatitis Perioral', icd10: 'L71.0' },
  { id: 'miliaria', nama: 'Miliaria (Biang Keringat)', icd10: 'L74.3' },
  { id: 'urticaria_acute', nama: 'Urtikaria Akut', icd10: 'L50.9' },
  { id: 'drug_eruption', nama: 'Erupsi Obat (Eksantematosa & Fixed Drug Eruption)', icd10: 'L27.0' },
  { id: 'vulnus_laseratum', nama: 'Vulnus Laseratum, Punctum', icd10: 'T14.1' },
  { id: 'burn_grade12', nama: 'Luka Bakar Derajat 1 dan 2', icd10: 'T30' },

  // === TRAUMA (2) ===
  { id: 'blunt_trauma', nama: 'Kekerasan Tumpul', icd10: 'S00-S09' },
  { id: 'sharp_trauma', nama: 'Kekerasan Tajam', icd10: 'S00-S09' },
]
