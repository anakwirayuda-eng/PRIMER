/**
 * @reflection
 * [IDENTITY]: FKTP144Diseases
 * [PURPOSE]: FKTP 144 Diseases Reference Database Based on KMK No. HK.01.07/MENKES/1186/2022 These 144 diseases MUST be handled at pr
 * [STATE]: Experimental
 * [ANCHOR]: REFERRAL_EXCEPTIONS
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * FKTP 144 Diseases Reference Database
 * Based on KMK No. HK.01.07/MENKES/1186/2022
 * 
 * These 144 diseases MUST be handled at primary care level (FKTP/Puskesmas)
 * and should NOT be referred to hospital unless there are valid exceptions.
 */

// Referral Exception Types
export const REFERRAL_EXCEPTIONS = {
    EMERGENCY: 'emergency',          // Kegawatdaruratan
    COMORBIDITY: 'comorbidity',      // Ada penyakit penyerta/komplikasi
    NO_IMPROVEMENT: 'no_improvement', // Tidak membaik setelah terapi
    RESOURCE_LIMITED: 'resource',     // Keterbatasan SDM/alat
    RECURRENT: 'recurrent'           // Berulang/rekalsitran
};

/**
 * Complete list of 144 FKTP Mandatory Diseases
 * All marked as SKDI 4A (must be fully managed at primary care)
 */
export const FKTP_144_DISEASES = [
    // === SISTEM SARAF (9 penyakit) ===
    { id: 'febrile_seizure', name: 'Kejang Demam', icd10: 'R56.0', category: 'Neurology', skdi: '4A' },
    { id: 'tetanus', name: 'Tetanus', icd10: 'A35', category: 'Neurology', skdi: '4A' },
    { id: 'hiv_uncomplicated', name: 'HIV AIDS Tanpa Komplikasi', icd10: 'Z21', category: 'Infection', skdi: '4A' },
    { id: 'tension_headache', name: 'Tension Headache', icd10: 'G44.2', category: 'Neurology', skdi: '4A' },
    { id: 'migraine', name: 'Migren', icd10: 'G43.9', category: 'Neurology', skdi: '4A' },
    { id: 'bells_palsy', name: "Bell's Palsy", icd10: 'G51.0', category: 'Neurology', skdi: '4A' },
    { id: 'vertigo_bppv', name: 'Vertigo', icd10: 'R42', category: 'Neurology', skdi: '4A' },
    { id: 'somatoform', name: 'Gangguan Somatoform', icd10: 'F45', category: 'Psychiatry', skdi: '4A' },
    { id: 'insomnia', name: 'Insomnia', icd10: 'F51.0', category: 'Psychiatry', skdi: '4A' },

    // === SISTEM INDRA - MATA (14 penyakit) ===
    { id: 'foreign_body_conjunctiva', name: 'Benda Asing Konjungtiva', icd10: 'T15.9', category: 'Ophthalmology', skdi: '4A' },
    { id: 'conjunctivitis_bacterial', name: 'Konjungtivitis', icd10: 'H10.9', category: 'Ophthalmology', skdi: '4A' },
    { id: 'subconjunctival_hemorrhage', name: 'Perdarahan Subkonjungtiva', icd10: 'H11.3', category: 'Ophthalmology', skdi: '4A' },
    { id: 'dry_eye', name: 'Mata Kering', icd10: 'H04.1', category: 'Ophthalmology', skdi: '4A' },
    { id: 'blepharitis', name: 'Blefaritis', icd10: 'H01.0', category: 'Ophthalmology', skdi: '4A' },
    { id: 'hordeolum', name: 'Hordeolum (Bintitan)', icd10: 'H00.0', category: 'Ophthalmology', skdi: '4A' },
    { id: 'trichiasis', name: 'Trikiasis', icd10: 'H02', category: 'Ophthalmology', skdi: '4A' },
    { id: 'episcleritis', name: 'Episkleritis', icd10: 'H15.1', category: 'Ophthalmology', skdi: '4A' },
    { id: 'hypermetropia', name: 'Hipermetropia', icd10: 'H52.0', category: 'Ophthalmology', skdi: '4A', mapsTo: 'refractive_error' },
    { id: 'myopia_mild', name: 'Miopia Ringan', icd10: 'H52.1', category: 'Ophthalmology', skdi: '4A', mapsTo: 'refractive_error' },
    { id: 'astigmatism_mild', name: 'Astigmatism Ringan', icd10: 'H52.2', category: 'Ophthalmology', skdi: '4A', mapsTo: 'refractive_error' },
    { id: 'presbyopia', name: 'Presbiopia', icd10: 'H52.4', category: 'Ophthalmology', skdi: '4A', mapsTo: 'refractive_error' },
    { id: 'night_blindness', name: 'Buta Senja', icd10: 'H53.6', category: 'Ophthalmology', skdi: '4A' },

    // === SISTEM INDRA - THT (9 penyakit) ===
    { id: 'otitis_externa', name: 'Otitis Eksterna', icd10: 'H60.9', category: 'ENT', skdi: '4A' },
    { id: 'otitis_media_acute', name: 'Otitis Media Akut', icd10: 'H65.0', category: 'ENT', skdi: '4A' },
    { id: 'cerumen_prop', name: 'Cerumen Prop', icd10: 'H61.2', category: 'ENT', skdi: '4A' },
    { id: 'motion_sickness', name: 'Mabuk Perjalanan', icd10: 'T75.3', category: 'ENT', skdi: '4A' },
    { id: 'furunkel_nose', name: 'Furunkel pada Hidung', icd10: 'J34.0', category: 'ENT', skdi: '4A' },
    { id: 'ispa_common', name: 'Rhinitis Akut / ISPA', icd10: 'J00', category: 'ENT', skdi: '4A' },
    { id: 'rhinitis_vasomotor', name: 'Rhinitis Vasomotor', icd10: 'J30.0', category: 'ENT', skdi: '4A' },
    { id: 'rhinitis_allergic', name: 'Rhinitis Alergika', icd10: 'J30.4', category: 'ENT', skdi: '4A' },
    { id: 'foreign_body_nose', name: 'Benda Asing di Hidung', icd10: 'T17.1', category: 'ENT', skdi: '4A' },

    // === SISTEM RESPIRASI (10 penyakit) ===
    { id: 'epistaxis', name: 'Epistaksis', icd10: 'R04.0', category: 'Respiratory', skdi: '4A' },
    { id: 'influenza', name: 'Influenza', icd10: 'J11', category: 'Respiratory', skdi: '4A' },
    { id: 'pertussis', name: 'Pertusis', icd10: 'A37', category: 'Respiratory', skdi: '4A' },
    { id: 'acute_pharyngitis', name: 'Faringitis', icd10: 'J02.9', category: 'Respiratory', skdi: '4A' },
    { id: 'tonsillitis_acute', name: 'Tonsilitis', icd10: 'J03.9', category: 'Respiratory', skdi: '4A' },
    { id: 'laryngitis_acute', name: 'Laringitis', icd10: 'J04.0', category: 'Respiratory', skdi: '4A' },
    { id: 'asthma_bronchiale', name: 'Asma Bronkiale', icd10: 'J45.9', category: 'Respiratory', skdi: '4A' },
    { id: 'bronchitis_acute', name: 'Bronkitis Akut', icd10: 'J20.9', category: 'Respiratory', skdi: '4A' },
    { id: 'pneumonia_bacterial', name: 'Pneumonia, Bronkopneumonia', icd10: 'J18.9', category: 'Respiratory', skdi: '4A' },
    { id: 'tb_pulmonary', name: 'Tuberkulosis Paru Tanpa Komplikasi', icd10: 'A15', category: 'Respiratory', skdi: '4A' },

    // === SISTEM KARDIOVASKULAR (1 penyakit) ===
    { id: 'hypertension_primary', name: 'Hipertensi Esensial', icd10: 'I10', category: 'Cardiovascular', skdi: '4A' },

    // === SISTEM PENCERNAAN (18 penyakit) ===
    { id: 'oral_candidiasis', name: 'Kandidiasis Mulut', icd10: 'B37.9', category: 'Digestive', skdi: '4A' },
    { id: 'stomatitis_aftosa', name: 'Ulkus Mulut (Aptosa, Herpes)', icd10: 'K12', category: 'Digestive', skdi: '4A' },
    { id: 'parotitis_mumps', name: 'Parotitis', icd10: 'B26', category: 'Digestive', skdi: '4A' },
    { id: 'umbilical_infection', name: 'Infeksi pada Umbilikus', icd10: 'P38', category: 'Digestive', skdi: '4A' },
    { id: 'gastritis_acute', name: 'Gastritis', icd10: 'K29.7', category: 'Digestive', skdi: '4A' },
    { id: 'acute_gastroenteritis', name: 'Gastroenteritis (termasuk Kolera, Giardiasis)', icd10: 'A09', category: 'Digestive', skdi: '4A' },
    { id: 'gerd', name: 'Refluks Gastroesofagus', icd10: 'K21.9', category: 'Digestive', skdi: '4A' },
    { id: 'typhoid_fever', name: 'Demam Tifoid', icd10: 'A01.0', category: 'Digestive', skdi: '4A' },
    { id: 'food_intolerance', name: 'Intoleransi Makanan', icd10: 'K90.4', category: 'Digestive', skdi: '4A' },
    { id: 'food_allergy', name: 'Alergi Makanan', icd10: 'L27.2', category: 'Digestive', skdi: '4A' },
    { id: 'food_poisoning', name: 'Keracunan Makanan', icd10: 'T62', category: 'Digestive', skdi: '4A' },
    { id: 'hookworm', name: 'Penyakit Cacing Tambang', icd10: 'B76.0', category: 'Digestive', skdi: '4A' },
    { id: 'strongyloidiasis', name: 'Strongiloidiasis', icd10: 'B78.9', category: 'Digestive', skdi: '4A' },
    { id: 'ascariasis', name: 'Askariasis', icd10: 'B77.9', category: 'Digestive', skdi: '4A' },
    { id: 'schistosomiasis', name: 'Skistosomiasis', icd10: 'B65.9', category: 'Digestive', skdi: '4A' },
    { id: 'taeniasis', name: 'Taeniasis', icd10: 'B68.9', category: 'Digestive', skdi: '4A' },
    { id: 'hepatitis_a', name: 'Hepatitis A', icd10: 'B15', category: 'Digestive', skdi: '4A' },
    { id: 'dysentery', name: 'Disentri Basiler, Disentri Amuba', icd10: 'A03', category: 'Digestive', skdi: '4A' },

    // === SISTEM GINJAL & SALURAN KEMIH (6 penyakit) ===
    { id: 'hemorrhoid_12', name: 'Hemoroid Grade 1/2', icd10: 'I84', category: 'Digestive', skdi: '4A' },
    { id: 'uti', name: 'Infeksi Saluran Kemih', icd10: 'N39.0', category: 'Urinary', skdi: '4A', mapsTo: 'lower_uti' },
    { id: 'gonorrhea', name: 'Gonore', icd10: 'A54.9', category: 'STI', skdi: '4A' },
    { id: 'pyelonephritis', name: 'Pielonefritis Tanpa Komplikasi', icd10: 'N10', category: 'Urinary', skdi: '4A' },
    { id: 'phimosis', name: 'Fimosis', icd10: 'N47.1', category: 'Urinary', skdi: '4A' },
    { id: 'paraphimosis', name: 'Parafimosis', icd10: 'N47.2', category: 'Urinary', skdi: '4A' },

    // === SISTEM REPRODUKSI (14 penyakit) ===
    { id: 'genital_discharge', name: 'Sindroma Duh Genital (Gonore dan Non Gonore)', icd10: 'N89', category: 'Reproductive', skdi: '4A' },
    { id: 'lower_uti', name: 'Infeksi Saluran Kemih Bagian Bawah', icd10: 'N30.0', category: 'Urinary', skdi: '4A' },
    { id: 'vulvitis', name: 'Vulvitis', icd10: 'N76.0', category: 'Reproductive', skdi: '4A' },
    { id: 'vaginitis', name: 'Vaginitis', icd10: 'N76.0', category: 'Reproductive', skdi: '4A' },
    { id: 'bacterial_vaginosis', name: 'Vaginosis Bakterialis', icd10: 'N76.0', category: 'Reproductive', skdi: '4A' },
    { id: 'salpingitis', name: 'Salphingitis', icd10: 'N70', category: 'Reproductive', skdi: '4A' },
    { id: 'normal_pregnancy', name: 'Kehamilan Normal', icd10: 'Z34', category: 'Obstetric', skdi: '4A' },
    { id: 'complete_abortion', name: 'Abortus Spontan Komplit', icd10: 'O03.9', category: 'Obstetric', skdi: '4A' },
    { id: 'anemia_pregnancy', name: 'Anemia Defisiensi Besi pada Kehamilan', icd10: 'O99.0', category: 'Obstetric', skdi: '4A' },
    { id: 'perineal_rupture_12', name: 'Ruptur Perineum Tingkat 1/2', icd10: 'O70.0', category: 'Obstetric', skdi: '4A' },
    { id: 'furuncle', name: 'Abses Folikel Rambut/Kelenjar Sebasea', icd10: 'L02', category: 'Dermatology', skdi: '4A', aliasOf: 'furuncle' },
    { id: 'mastitis_lactation', name: 'Mastitis', icd10: 'N61', category: 'Reproductive', skdi: '4A' },
    { id: 'cracked_nipple', name: 'Cracked Nipple', icd10: 'O92.13', category: 'Reproductive', skdi: '4A' },
    { id: 'inverted_nipple', name: 'Inverted Nipple', icd10: 'O92.03', category: 'Reproductive', skdi: '4A' },

    // === SISTEM ENDOKRIN, METABOLIK & NUTRISI (9 penyakit) ===
    { id: 'dm_type1', name: 'DM Tipe 1', icd10: 'E10', category: 'Endocrine', skdi: '4A' },
    { id: 'dm_type2', name: 'DM Tipe 2', icd10: 'E11', category: 'Endocrine', skdi: '4A' },
    { id: 'hypoglycemia_mild', name: 'Hipoglikemi Ringan', icd10: 'E16.2', category: 'Endocrine', skdi: '4A' },
    { id: 'pem', name: 'Malnutrisi Energi Protein', icd10: 'E44', category: 'Nutrition', skdi: '4A' },
    { id: 'vitamin_deficiency', name: 'Defisiensi Vitamin', icd10: 'E50-E56', category: 'Nutrition', skdi: '4A' },
    { id: 'mineral_deficiency', name: 'Defisiensi Mineral', icd10: 'E58-E61', category: 'Nutrition', skdi: '4A' },
    { id: 'dyslipidemia', name: 'Dislipidemia', icd10: 'E78.5', category: 'Endocrine', skdi: '4A' },
    { id: 'hyperuricemia', name: 'Hiperurisemia', icd10: 'E79.0', category: 'Endocrine', skdi: '4A' },
    { id: 'obesity', name: 'Obesitas', icd10: 'E66.9', category: 'Endocrine', skdi: '4A' },

    // === SISTEM HEMATOLOGI & IMUNOLOGI (6 penyakit) ===
    { id: 'anemia_deficiency', name: 'Anemia Defisiensi Besi', icd10: 'D50', category: 'Hematology', skdi: '4A' },
    { id: 'lymphadenitis', name: 'Limfadenitis', icd10: 'I88', category: 'Hematology', skdi: '4A' },
    { id: 'dengue_df', name: 'Demam Dengue, DHF', icd10: 'A90', category: 'Infection', skdi: '4A' },
    { id: 'malaria_vivax', name: 'Malaria', icd10: 'B54', category: 'Infection', skdi: '4A' },
    { id: 'leptospirosis', name: 'Leptospirosis (Tanpa Komplikasi)', icd10: 'A27.9', category: 'Infection', skdi: '4A' },
    { id: 'anaphylaxis', name: 'Reaksi Anafilaktik', icd10: 'T78.2', category: 'Emergency', skdi: '4A' },

    // === SISTEM MUSKULOSKELETAL (2 penyakit) ===
    { id: 'leg_ulcer', name: 'Ulkus pada Tungkai', icd10: 'L97', category: 'Musculoskeletal', skdi: '4A' },
    { id: 'lipoma', name: 'Lipoma', icd10: 'D17', category: 'Musculoskeletal', skdi: '4A' },

    // === SISTEM INTEGUMEN / KULIT (45 penyakit) ===
    { id: 'verruca_vulgaris', name: 'Veruka Vulgaris', icd10: 'B07', category: 'Dermatology', skdi: '4A' },
    { id: 'molluscum', name: 'Moluskum Kontagiosum', icd10: 'B08.1', category: 'Dermatology', skdi: '4A' },
    { id: 'herpes_zoster', name: 'Herpes Zoster Tanpa Komplikasi', icd10: 'B02.9', category: 'Dermatology', skdi: '4A' },
    { id: 'morbilli', name: 'Morbili Tanpa Komplikasi', icd10: 'B05.9', category: 'Dermatology', skdi: '4A' },
    { id: 'varicella', name: 'Varicella Tanpa Komplikasi', icd10: 'B01.9', category: 'Dermatology', skdi: '4A' },
    { id: 'herpes_simplex', name: 'Herpes Simpleks Tanpa Komplikasi', icd10: 'B00.9', category: 'Dermatology', skdi: '4A' },
    { id: 'impetigo', name: 'Impetigo', icd10: 'L01.0', category: 'Dermatology', skdi: '4A' },
    { id: 'impetigo', name: 'Impetigo Ulseratif (Ektima)', icd10: 'L01.0', category: 'Dermatology', skdi: '4A', note: 'covered by impetigo case' },
    { id: 'folliculitis', name: 'Folikulitis Superfisialis', icd10: 'L73.9', category: 'Dermatology', skdi: '4A' },
    { id: 'furuncle', name: 'Furunkel, Karbunkel', icd10: 'L02', category: 'Dermatology', skdi: '4A' },
    { id: 'erythrasma', name: 'Eritrasma', icd10: 'L08.1', category: 'Dermatology', skdi: '4A' },
    { id: 'erysipelas', name: 'Erisipelas', icd10: 'A46', category: 'Dermatology', skdi: '4A' },
    { id: 'scrofuloderma', name: 'Skrofuloderma', icd10: 'A18.4', category: 'Dermatology', skdi: '4A' },
    { id: 'leprosy', name: 'Lepra', icd10: 'A30', category: 'Dermatology', skdi: '4A' },
    { id: 'syphilis_12', name: 'Sifilis Stadium 1 dan 2', icd10: 'A51', category: 'STI', skdi: '4A' },
    { id: 'tinea_capitis', name: 'Tinea Kapitis', icd10: 'B35.0', category: 'Dermatology', skdi: '4A' },
    { id: 'tinea_barbae', name: 'Tinea Barbae', icd10: 'B35.0', category: 'Dermatology', skdi: '4A' },
    { id: 'tinea_facialis', name: 'Tinea Fasialis', icd10: 'B35.8', category: 'Dermatology', skdi: '4A' },
    { id: 'tinea_corporis', name: 'Tinea Korporis', icd10: 'B35.4', category: 'Dermatology', skdi: '4A' },
    { id: 'tinea_manus', name: 'Tinea Manus', icd10: 'B35.2', category: 'Dermatology', skdi: '4A' },
    { id: 'tinea_unguium', name: 'Tinea Unguium', icd10: 'B35.1', category: 'Dermatology', skdi: '4A' },
    { id: 'tinea_cruris', name: 'Tinea Kruris', icd10: 'B35.6', category: 'Dermatology', skdi: '4A' },
    { id: 'tinea_pedis', name: 'Tinea Pedis', icd10: 'B35.3', category: 'Dermatology', skdi: '4A' },
    { id: 'pityriasis_versicolor', name: 'Pitiriasis Versikolor', icd10: 'B36.0', category: 'Dermatology', skdi: '4A' },
    { id: 'candidiasis_mucocutan', name: 'Kandidiasis Mukokutan Ringan', icd10: 'B37.2', category: 'Dermatology', skdi: '4A' },
    { id: 'cutaneous_larva_migrans', name: 'Cutaneous Larva Migrans', icd10: 'B76.9', category: 'Dermatology', skdi: '4A' },
    { id: 'filariasis', name: 'Filariasis', icd10: 'B74', category: 'Dermatology', skdi: '4A' },
    { id: 'pediculosis_capitis', name: 'Pedikulosis Kapitis', icd10: 'B85.0', category: 'Dermatology', skdi: '4A' },
    { id: 'pediculosis_pubis', name: 'Pedikulosis Pubis', icd10: 'B85.3', category: 'Dermatology', skdi: '4A' },
    { id: 'scabies', name: 'Skabies', icd10: 'B86', category: 'Dermatology', skdi: '4A' },
    { id: 'insect_bite', name: 'Reaksi Gigitan Serangga', icd10: 'T63.4', category: 'Dermatology', skdi: '4A' },
    { id: 'dermatitis_kontak', name: 'Dermatitis Kontak Iritan', icd10: 'L24', category: 'Dermatology', skdi: '4A' },
    { id: 'atopic_dermatitis', name: 'Dermatitis Atopik (Kecuali Recalcitrant)', icd10: 'L20', category: 'Dermatology', skdi: '4A' },
    { id: 'nummular_dermatitis', name: 'Dermatitis Numularis', icd10: 'L30.0', category: 'Dermatology', skdi: '4A' },
    { id: 'napkin_eczema', name: 'Napkin Eksema', icd10: 'L22', category: 'Dermatology', skdi: '4A' },
    { id: 'seborrheic_dermatitis', name: 'Dermatitis Seboroik', icd10: 'L21', category: 'Dermatology', skdi: '4A' },
    { id: 'pityriasis_rosea', name: 'Pitiriasis Rosea', icd10: 'L42', category: 'Dermatology', skdi: '4A' },
    { id: 'acne_vulgaris', name: 'Akne Vulgaris Ringan', icd10: 'L70.0', category: 'Dermatology', skdi: '4A' },
    { id: 'hidradenitis', name: 'Hidradenitis Supuratif', icd10: 'L73.2', category: 'Dermatology', skdi: '4A' },
    { id: 'perioral_dermatitis', name: 'Dermatitis Perioral', icd10: 'L71.0', category: 'Dermatology', skdi: '4A' },
    { id: 'miliaria', name: 'Miliaria', icd10: 'L74.3', category: 'Dermatology', skdi: '4A' },
    { id: 'urticaria_acute', name: 'Urtikaria Akut', icd10: 'L50.9', category: 'Dermatology', skdi: '4A' },
    { id: 'drug_eruption', name: 'Eksantematous Drug Eruption, Fixed Drug Eruption', icd10: 'L27.0', category: 'Dermatology', skdi: '4A' },
    { id: 'sharp_trauma', name: 'Vulnus Laseratum, Punctum', icd10: 'T14.1', category: 'Trauma', skdi: '4A' },
    { id: 'burn_grade12', name: 'Luka Bakar Derajat 1 dan 2', icd10: 'T30', category: 'Trauma', skdi: '4A' },

    // === TRAUMA (2 penyakit) ===
    { id: 'blunt_trauma', name: 'Kekerasan Tumpul', icd10: 'S00-S09', category: 'Trauma', skdi: '4A' },
    { id: 'sharp_trauma', name: 'Kekerasan Tajam', icd10: 'S00-S09', category: 'Trauma', skdi: '4A' }
];

// Disease frequency weights based on real Puskesmas data (top 10 most common)
export const DISEASE_FREQUENCY_WEIGHTS = {
    'hypertension_primary': 20,        // #1 Hipertensi - paling sering
    'ispa_common': 15,                 // #2 ISPA/Common Cold
    'gastritis_acute': 12,             // #3 Dyspepsia/Gastritis
    'acute_gastroenteritis': 10,       // #4 Diare/GE
    'dm_type2': 8,                     // #5 Diabetes Melitus
    'tension_headache': 6,             // #6 Nyeri kepala
    'dermatitis_kontak': 5,            // #7 Dermatitis
    'atopic_dermatitis': 5,
    'dengue_df': 4,                    // #8 DHF (endemis)
    'malaria_vivax': 3,                // #8 Malaria (endemis tertentu)
    'acute_pharyngitis': 4,            // #9 Faringitis
    'lower_uti': 4,                    // #10 ISK
    // Other diseases get default weight of 1
};

/**
 * Check if a disease is in the 144 FKTP mandatory list
 */
export function isFKTPMandatory(icd10Code) {
    return FKTP_144_DISEASES.some(d => d.icd10 === icd10Code);
}

/**
 * Get disease info by ICD-10 code
 */
export function getFKTPDiseaseByCode(icd10Code) {
    return FKTP_144_DISEASES.find(d => d.icd10 === icd10Code);
}

/**
 * Get disease info by internal ID
 */
export function getFKTPDiseaseById(id) {
    return FKTP_144_DISEASES.find(d => d.id === id);
}

/**
 * Get frequency weight for a disease (for realistic patient generation)
 */
export function getDiseaseWeight(diseaseId) {
    return DISEASE_FREQUENCY_WEIGHTS[diseaseId] || 1;
}

/**
 * Get all diseases by category
 */
export function getDiseasesByCategory(category) {
    return FKTP_144_DISEASES.filter(d => d.category === category);
}

export default FKTP_144_DISEASES;
