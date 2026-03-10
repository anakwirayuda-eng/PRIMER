/**
 * @reflection
 * [IDENTITY]: ICD10
 * [PURPOSE]: Comprehensive ICD-10 Database for Indonesian Primary Care (Puskesmas) Covers SKDI 4A conditions (must be handled at prim
 * [STATE]: Experimental
 * [ANCHOR]: ICD10_DB
 * [DEPENDS_ON]: PersistenceService
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * Comprehensive ICD-10 Database for Indonesian Primary Care (Puskesmas)
 * Covers SKDI 4A conditions (must be handled at primary care) and common referral cases
 */

export const ICD10_DB = [
    // ========== INFECTIOUS DISEASES (A00-B99) ==========
    { code: 'A00.9', name: 'Cholera, unspecified (Kolera)', category: 'infectious' },
    { code: 'A01.0', name: 'Typhoid fever (Demam Tifoid)', category: 'infectious' },
    { code: 'A02.0', name: 'Salmonella enteritis', category: 'infectious' },
    { code: 'A04.9', name: 'Bacterial intestinal infection, unspecified', category: 'infectious' },
    { code: 'A06.9', name: 'Amoebiasis, unspecified', category: 'infectious' },
    { code: 'A09', name: 'Gastroenteritis and colitis (Diare)', category: 'infectious' },
    { code: 'A15.0', name: 'Tuberculosis of lung (TB Paru BTA+)', category: 'infectious' },
    { code: 'A16.0', name: 'Tuberculosis of lung (TB Paru BTA-)', category: 'infectious' },
    { code: 'A37.9', name: 'Whooping cough (Pertusis/Batuk Rejan)', category: 'infectious' },
    { code: 'A46', name: 'Erysipelas', category: 'infectious' },
    { code: 'A60.0', name: 'Herpes simplex infection of genitalia', category: 'infectious' },
    { code: 'A63.0', name: 'Anogenital (venereal) warts (Kondiloma)', category: 'infectious' },
    { code: 'A69.2', name: 'Lyme disease', category: 'infectious' },
    { code: 'A75.9', name: 'Typhus fever, unspecified', category: 'infectious' },
    { code: 'A82.9', name: 'Rabies, unspecified', category: 'infectious' },
    { code: 'A90', name: 'Dengue fever (Demam Dengue)', category: 'infectious' },
    { code: 'A91', name: 'Dengue haemorrhagic fever (DBD)', category: 'infectious' },
    { code: 'B00.9', name: 'Herpes viral infection, unspecified', category: 'infectious' },
    { code: 'B01.9', name: 'Varicella (Cacar Air)', category: 'infectious' },
    { code: 'B02.9', name: 'Zoster (Herpes Zoster/Cacar Ular)', category: 'infectious' },
    { code: 'B05.9', name: 'Measles (Campak)', category: 'infectious' },
    { code: 'B06.9', name: 'Rubella (Campak Jerman)', category: 'infectious' },
    { code: 'B08.4', name: 'Hand, foot and mouth disease', category: 'infectious' },
    { code: 'B15.9', name: 'Hepatitis A', category: 'infectious' },
    { code: 'B16.9', name: 'Hepatitis B', category: 'infectious' },
    { code: 'B17.1', name: 'Hepatitis C', category: 'infectious' },
    { code: 'B26.9', name: 'Mumps (Gondongan)', category: 'infectious' },
    { code: 'B35.0', name: 'Tinea capitis (Kurap Kepala)', category: 'infectious' },
    { code: 'B35.3', name: 'Tinea pedis (Kutu Air)', category: 'infectious' },
    { code: 'B35.4', name: 'Tinea corporis (Kurap Badan)', category: 'infectious' },
    { code: 'B36.0', name: 'Pityriasis versicolor (Panu)', category: 'infectious' },
    { code: 'B37.0', name: 'Candidal stomatitis (Oral Thrush)', category: 'infectious' },
    { code: 'B37.3', name: 'Candidiasis of vulva and vagina', category: 'infectious' },
    { code: 'B50.9', name: 'Plasmodium falciparum malaria', category: 'infectious' },
    { code: 'B51.9', name: 'Plasmodium vivax malaria', category: 'infectious' },
    { code: 'B54', name: 'Malaria, unspecified', category: 'infectious' },
    { code: 'B77.9', name: 'Ascariasis (Cacingan)', category: 'infectious' },
    { code: 'B82.9', name: 'Intestinal parasitism, unspecified', category: 'infectious' },
    { code: 'B86', name: 'Scabies (Kudis)', category: 'infectious' },
    { code: 'B85.0', name: 'Pediculosis capitis (Kutu Rambut)', category: 'infectious' },

    // ========== NEOPLASMS (C00-D48) ==========
    { code: 'D17.9', name: 'Lipoma, unspecified', category: 'neoplasm' },
    { code: 'D22.9', name: 'Melanocytic naevi (Tahi Lalat)', category: 'neoplasm' },
    { code: 'D23.9', name: 'Benign neoplasm of skin', category: 'neoplasm' },

    // ========== BLOOD DISEASES (D50-D89) ==========
    { code: 'D50.9', name: 'Iron deficiency anaemia (Anemia Defisiensi Besi)', category: 'blood' },
    { code: 'D64.9', name: 'Anaemia, unspecified', category: 'blood' },

    // ========== ENDOCRINE (E00-E90) ==========
    { code: 'E03.9', name: 'Hypothyroidism, unspecified', category: 'endocrine' },
    { code: 'E05.9', name: 'Thyrotoxicosis (Hipertiroid)', category: 'endocrine' },
    { code: 'E10.9', name: 'Type 1 diabetes mellitus', category: 'endocrine' },
    { code: 'E11.9', name: 'Type 2 diabetes mellitus', category: 'endocrine' },
    { code: 'E14.9', name: 'Diabetes mellitus, unspecified', category: 'endocrine' },
    { code: 'E44.1', name: 'Mild protein-calorie malnutrition (Gizi Kurang)', category: 'endocrine' },
    { code: 'E46', name: 'Protein-calorie malnutrition, unspecified (KEP)', category: 'endocrine' },
    { code: 'E55.9', name: 'Vitamin D deficiency', category: 'endocrine' },
    { code: 'E66.9', name: 'Obesity, unspecified', category: 'endocrine' },
    { code: 'E78.0', name: 'Hypercholesterolaemia (Kolesterol Tinggi)', category: 'endocrine' },
    { code: 'E78.5', name: 'Hyperlipidaemia (Dislipidemia)', category: 'endocrine' },
    { code: 'E79.0', name: 'Hyperuricaemia (Asam Urat Tinggi)', category: 'endocrine' },

    // ========== MENTAL DISORDERS (F00-F99) ==========
    { code: 'F10.1', name: 'Alcohol abuse', category: 'mental' },
    { code: 'F17.2', name: 'Nicotine dependence (Ketergantungan Rokok)', category: 'mental' },
    { code: 'F32.9', name: 'Depressive episode (Depresi)', category: 'mental' },
    { code: 'F41.0', name: 'Panic disorder', category: 'mental' },
    { code: 'F41.1', name: 'Generalized anxiety disorder (GAD)', category: 'mental' },
    { code: 'F45.0', name: 'Somatization disorder', category: 'mental' },
    { code: 'F51.0', name: 'Insomnia (Sulit Tidur)', category: 'mental' },

    // ========== NERVOUS SYSTEM (G00-G99) ==========
    { code: 'G43.9', name: 'Migraine', category: 'nervous' },
    { code: 'G44.2', name: 'Tension-type headache (Sakit Kepala Tegang)', category: 'nervous' },
    { code: 'G45.9', name: 'Transient cerebral ischaemic attack (TIA)', category: 'nervous' },
    { code: 'G47.3', name: 'Sleep apnoea', category: 'nervous' },
    { code: 'G50.0', name: 'Trigeminal neuralgia', category: 'nervous' },
    { code: 'G51.0', name: "Bell's palsy", category: 'nervous' },
    { code: 'G56.0', name: 'Carpal tunnel syndrome', category: 'nervous' },
    { code: 'G81.9', name: 'Hemiplegia (Stroke sequelae)', category: 'nervous' },

    // ========== EYE (H00-H59) ==========
    { code: 'H00.0', name: 'Hordeolum (Bintitan)', category: 'eye' },
    { code: 'H01.0', name: 'Blepharitis', category: 'eye' },
    { code: 'H10.0', name: 'Mucopurulent conjunctivitis', category: 'eye' },
    { code: 'H10.9', name: 'Conjunctivitis (Mata Merah)', category: 'eye' },
    { code: 'H16.0', name: 'Corneal ulcer', category: 'eye' },
    { code: 'H25.9', name: 'Senile cataract (Katarak)', category: 'eye' },
    { code: 'H40.9', name: 'Glaucoma', category: 'eye' },
    { code: 'H52.1', name: 'Myopia (Rabun Jauh)', category: 'eye' },
    { code: 'H52.0', name: 'Hypermetropia (Rabun Dekat)', category: 'eye' },
    { code: 'H52.4', name: 'Presbyopia (Mata Tua)', category: 'eye' },
    { code: 'H57.1', name: 'Ocular pain', category: 'eye' },

    // ========== EAR (H60-H95) ==========
    { code: 'H60.9', name: 'Otitis externa (Radang Telinga Luar)', category: 'ear' },
    { code: 'H65.9', name: 'Otitis media (Radang Telinga Tengah)', category: 'ear' },
    { code: 'H66.9', name: 'Otitis media, suppurative (Congek)', category: 'ear' },
    { code: 'H81.1', name: 'Benign paroxysmal vertigo', category: 'ear' },
    { code: 'H81.3', name: 'Other peripheral vertigo', category: 'ear' },
    { code: 'H91.9', name: 'Hearing loss, unspecified', category: 'ear' },

    // ========== CIRCULATORY (I00-I99) ==========
    { code: 'I10', name: 'Essential hypertension (Hipertensi)', category: 'circulatory' },
    { code: 'I11.9', name: 'Hypertensive heart disease', category: 'circulatory' },
    { code: 'I20.9', name: 'Angina pectoris', category: 'circulatory' },
    { code: 'I21.9', name: 'Acute myocardial infarction (Serangan Jantung)', category: 'circulatory' },
    { code: 'I25.9', name: 'Chronic ischaemic heart disease (PJK)', category: 'circulatory' },
    { code: 'I50.9', name: 'Heart failure (Gagal Jantung)', category: 'circulatory' },
    { code: 'I63.9', name: 'Cerebral infarction (Stroke Iskemik)', category: 'circulatory' },
    { code: 'I64', name: 'Stroke, not specified', category: 'circulatory' },
    { code: 'I80.9', name: 'Phlebitis and thrombophlebitis', category: 'circulatory' },
    { code: 'I83.9', name: 'Varicose veins (Varises)', category: 'circulatory' },
    { code: 'I84.9', name: 'Haemorrhoids (Wasir/Ambeien)', category: 'circulatory' },
    { code: 'I95.1', name: 'Orthostatic hypotension', category: 'circulatory' },

    // ========== RESPIRATORY (J00-J99) ==========
    { code: 'J00', name: 'Acute nasopharyngitis (Common Cold/Flu)', category: 'respiratory' },
    { code: 'J01.9', name: 'Acute sinusitis', category: 'respiratory' },
    { code: 'J02.9', name: 'Acute pharyngitis (Radang Tenggorokan)', category: 'respiratory' },
    { code: 'J03.9', name: 'Acute tonsillitis (Radang Amandel)', category: 'respiratory' },
    { code: 'J04.0', name: 'Acute laryngitis', category: 'respiratory' },
    { code: 'J06.9', name: 'Acute upper respiratory infection (ISPA)', category: 'respiratory' },
    { code: 'J10.1', name: 'Influenza with other respiratory manifestations', category: 'respiratory' },
    { code: 'J11.1', name: 'Influenza, virus not identified', category: 'respiratory' },
    { code: 'J12.9', name: 'Viral pneumonia', category: 'respiratory' },
    { code: 'J15.9', name: 'Bacterial pneumonia', category: 'respiratory' },
    { code: 'J18.9', name: 'Pneumonia, unspecified', category: 'respiratory' },
    { code: 'J20.9', name: 'Acute bronchitis', category: 'respiratory' },
    { code: 'J21.9', name: 'Acute bronchiolitis', category: 'respiratory' },
    { code: 'J30.1', name: 'Allergic rhinitis (Pilek Alergi)', category: 'respiratory' },
    { code: 'J31.0', name: 'Chronic rhinitis', category: 'respiratory' },
    { code: 'J32.9', name: 'Chronic sinusitis', category: 'respiratory' },
    { code: 'J35.0', name: 'Chronic tonsillitis', category: 'respiratory' },
    { code: 'J40', name: 'Bronchitis, not specified', category: 'respiratory' },
    { code: 'J42', name: 'Chronic bronchitis', category: 'respiratory' },
    { code: 'J44.9', name: 'COPD (PPOK)', category: 'respiratory' },
    { code: 'J45.9', name: 'Asthma (Asma)', category: 'respiratory' },
    { code: 'J46', name: 'Status asthmaticus (Serangan Asma Berat)', category: 'respiratory' },

    // ========== DIGESTIVE (K00-K93) ==========
    { code: 'K02.9', name: 'Dental caries (Gigi Berlubang)', category: 'digestive' },
    { code: 'K04.7', name: 'Periapical abscess (Abses Gigi)', category: 'digestive' },
    { code: 'K05.0', name: 'Acute gingivitis (Radang Gusi)', category: 'digestive' },
    { code: 'K08.8', name: 'Other specified disorders of teeth', category: 'digestive' },
    { code: 'K12.0', name: 'Recurrent oral aphthae (Sariawan)', category: 'digestive' },
    { code: 'K21.0', name: 'GERD (Maag Kronis)', category: 'digestive' },
    { code: 'K25.9', name: 'Gastric ulcer (Tukak Lambung)', category: 'digestive' },
    { code: 'K26.9', name: 'Duodenal ulcer (Tukak Duodenum)', category: 'digestive' },
    { code: 'K29.7', name: 'Gastritis (Maag)', category: 'digestive' },
    { code: 'K30', name: 'Functional dyspepsia (Dispepsia)', category: 'digestive' },
    { code: 'K35.9', name: 'Acute appendicitis (Usus Buntu)', category: 'digestive' },
    { code: 'K40.9', name: 'Inguinal hernia (Hernia)', category: 'digestive' },
    { code: 'K42.9', name: 'Umbilical hernia', category: 'digestive' },
    { code: 'K52.9', name: 'Noninfective gastroenteritis', category: 'digestive' },
    { code: 'K58.9', name: 'Irritable bowel syndrome (IBS)', category: 'digestive' },
    { code: 'K59.0', name: 'Constipation (Sembelit)', category: 'digestive' },
    { code: 'K60.0', name: 'Anal fissure', category: 'digestive' },
    { code: 'K76.0', name: 'Fatty liver (Perlemakan Hati)', category: 'digestive' },
    { code: 'K80.2', name: 'Cholelithiasis (Batu Empedu)', category: 'digestive' },

    // ========== SKIN (L00-L99) ==========
    { code: 'L01.0', name: 'Impetigo', category: 'skin' },
    { code: 'L02.9', name: 'Cutaneous abscess, furuncle and carbuncle (Bisul)', category: 'skin' },
    { code: 'L03.9', name: 'Cellulitis', category: 'skin' },
    { code: 'L08.9', name: 'Local infection of skin (Infeksi Kulit)', category: 'skin' },
    { code: 'L20.9', name: 'Atopic dermatitis (Eksim)', category: 'skin' },
    { code: 'L21.0', name: 'Seborrhoeic dermatitis of scalp', category: 'skin' },
    { code: 'L23.9', name: 'Allergic contact dermatitis', category: 'skin' },
    { code: 'L24.9', name: 'Irritant contact dermatitis', category: 'skin' },
    { code: 'L25.9', name: 'Contact dermatitis, unspecified', category: 'skin' },
    { code: 'L30.9', name: 'Dermatitis, unspecified', category: 'skin' },
    { code: 'L40.9', name: 'Psoriasis', category: 'skin' },
    { code: 'L50.9', name: 'Urticaria (Biduran/Kaligata)', category: 'skin' },
    { code: 'L60.0', name: 'Ingrowing nail (Cantengan)', category: 'skin' },
    { code: 'L70.0', name: 'Acne vulgaris (Jerawat)', category: 'skin' },
    { code: 'L72.0', name: 'Epidermal cyst (Atheroma/Kista Kulit)', category: 'skin' },
    { code: 'L73.9', name: 'Follicular disorder (Folikulitis)', category: 'skin' },
    { code: 'L81.0', name: 'Postinflammatory hyperpigmentation', category: 'skin' },
    { code: 'L84', name: 'Corns and callosities (Kapalan)', category: 'skin' },
    { code: 'L98.9', name: 'Disorder of skin, unspecified', category: 'skin' },

    // ========== MUSCULOSKELETAL (M00-M99) ==========
    { code: 'M06.9', name: 'Rheumatoid arthritis (Rematik)', category: 'musculoskeletal' },
    { code: 'M10.9', name: 'Gout (Asam Urat/Pirai)', category: 'musculoskeletal' },
    { code: 'M13.9', name: 'Arthritis, unspecified', category: 'musculoskeletal' },
    { code: 'M17.9', name: 'Osteoarthritis of knee (OA Lutut)', category: 'musculoskeletal' },
    { code: 'M19.9', name: 'Osteoarthritis, unspecified', category: 'musculoskeletal' },
    { code: 'M25.5', name: 'Pain in joint (Nyeri Sendi)', category: 'musculoskeletal' },
    { code: 'M47.9', name: 'Spondylosis', category: 'musculoskeletal' },
    { code: 'M54.2', name: 'Cervicalgia (Nyeri Leher)', category: 'musculoskeletal' },
    { code: 'M54.4', name: 'Lumbago (Nyeri Pinggang)', category: 'musculoskeletal' },
    { code: 'M54.5', name: 'Low back pain (LBP)', category: 'musculoskeletal' },
    { code: 'M62.8', name: 'Other specified disorders of muscle (Pegal-pegal)', category: 'musculoskeletal' },
    { code: 'M65.9', name: 'Synovitis and tenosynovitis', category: 'musculoskeletal' },
    { code: 'M72.0', name: 'Palmar fascial fibromatosis (Dupuytren)', category: 'musculoskeletal' },
    { code: 'M75.1', name: 'Rotator cuff syndrome', category: 'musculoskeletal' },
    { code: 'M79.1', name: 'Myalgia (Nyeri Otot)', category: 'musculoskeletal' },
    { code: 'M79.3', name: 'Panniculitis', category: 'musculoskeletal' },
    { code: 'M81.9', name: 'Osteoporosis', category: 'musculoskeletal' },

    // ========== GENITOURINARY (N00-N99) ==========
    { code: 'N10', name: 'Acute pyelonephritis (Infeksi Ginjal)', category: 'genitourinary' },
    { code: 'N18.9', name: 'Chronic kidney disease (Gagal Ginjal Kronik)', category: 'genitourinary' },
    { code: 'N20.0', name: 'Calculus of kidney (Batu Ginjal)', category: 'genitourinary' },
    { code: 'N21.0', name: 'Calculus of bladder (Batu Kandung Kemih)', category: 'genitourinary' },
    { code: 'N30.0', name: 'Acute cystitis (Infeksi Kandung Kemih)', category: 'genitourinary' },
    { code: 'N34.1', name: 'Nonspecific urethritis', category: 'genitourinary' },
    { code: 'N39.0', name: 'Urinary tract infection (ISK)', category: 'genitourinary' },
    { code: 'N40', name: 'Benign prostatic hyperplasia (BPH)', category: 'genitourinary' },
    { code: 'N41.0', name: 'Acute prostatitis', category: 'genitourinary' },
    { code: 'N47', name: 'Phimosis', category: 'genitourinary' },
    { code: 'N72', name: 'Cervicitis', category: 'genitourinary' },
    { code: 'N73.9', name: 'Female pelvic inflammatory disease', category: 'genitourinary' },
    { code: 'N76.0', name: 'Acute vaginitis (Keputihan/Fluor Albus)', category: 'genitourinary' },
    { code: 'N91.2', name: 'Amenorrhoea', category: 'genitourinary' },
    { code: 'N92.0', name: 'Excessive menstruation (Menorrhagia)', category: 'genitourinary' },
    { code: 'N94.4', name: 'Dysmenorrhoea (Nyeri Haid)', category: 'genitourinary' },
    { code: 'N95.1', name: 'Menopausal symptoms', category: 'genitourinary' },

    // ========== PREGNANCY (O00-O99) ==========
    { code: 'O21.0', name: 'Mild hyperemesis gravidarum (Mual Hamil)', category: 'pregnancy' },
    { code: 'O23.4', name: 'UTI in pregnancy', category: 'pregnancy' },
    { code: 'O26.8', name: 'Other pregnancy conditions', category: 'pregnancy' },
    { code: 'O80', name: 'Normal delivery (Persalinan Normal)', category: 'pregnancy' },

    // ========== PERINATAL (P00-P96) ==========
    { code: 'P07.3', name: 'Low birth weight baby (BBLR)', category: 'perinatal' },
    { code: 'P59.9', name: 'Neonatal jaundice (Kuning Bayi)', category: 'perinatal' },

    // ========== SYMPTOMS/SIGNS (R00-R99) ==========
    { code: 'R00.0', name: 'Tachycardia', category: 'symptoms' },
    { code: 'R00.2', name: 'Palpitations', category: 'symptoms' },
    { code: 'R05', name: 'Cough (Batuk)', category: 'symptoms' },
    { code: 'R06.0', name: 'Dyspnoea (Sesak Napas)', category: 'symptoms' },
    { code: 'R07.4', name: 'Chest pain, unspecified (Nyeri Dada)', category: 'symptoms' },
    { code: 'R10.4', name: 'Abdominal pain (Nyeri Perut)', category: 'symptoms' },
    { code: 'R11', name: 'Nausea and vomiting (Mual Muntah)', category: 'symptoms' },
    { code: 'R14', name: 'Flatulence (Kembung)', category: 'symptoms' },
    { code: 'R21', name: 'Rash (Ruam Kulit)', category: 'symptoms' },
    { code: 'R22.9', name: 'Localized swelling, mass and lump', category: 'symptoms' },
    { code: 'R42', name: 'Dizziness and giddiness (Pusing)', category: 'symptoms' },
    { code: 'R50.9', name: 'Fever, unspecified (Demam)', category: 'symptoms' },
    { code: 'R51', name: 'Headache (Sakit Kepala)', category: 'symptoms' },
    { code: 'R52.9', name: 'Pain, unspecified (Nyeri)', category: 'symptoms' },
    { code: 'R53', name: 'Malaise and fatigue (Lesu/Lemas)', category: 'symptoms' },
    { code: 'R55', name: 'Syncope and collapse (Pingsan)', category: 'symptoms' },
    { code: 'R56.0', name: 'Febrile convulsions (Kejang Demam)', category: 'symptoms' },
    { code: 'R60.0', name: 'Localized oedema (Bengkak)', category: 'symptoms' },
    { code: 'R63.0', name: 'Anorexia (Tidak Nafsu Makan)', category: 'symptoms' },
    { code: 'R63.4', name: 'Abnormal weight loss', category: 'symptoms' },
    { code: 'R73.9', name: 'Hyperglycaemia (Gula Darah Tinggi)', category: 'symptoms' },

    // ========== INJURY (S00-T98) ==========
    { code: 'S00.9', name: 'Superficial injury of head', category: 'injury' },
    { code: 'S01.9', name: 'Open wound of head (Luka Kepala)', category: 'injury' },
    { code: 'S06.0', name: 'Concussion (Gegar Otak Ringan)', category: 'injury' },
    { code: 'S20.2', name: 'Contusion of thorax (Memar Dada)', category: 'injury' },
    { code: 'S30.0', name: 'Contusion of lower back/pelvis', category: 'injury' },
    { code: 'S40.0', name: 'Contusion of shoulder/upper arm', category: 'injury' },
    { code: 'S52.9', name: 'Fracture of forearm (Patah Lengan)', category: 'injury' },
    { code: 'S60.2', name: 'Contusion of finger (Memar Jari)', category: 'injury' },
    { code: 'S61.9', name: 'Open wound of wrist/hand (Luka Tangan)', category: 'injury' },
    { code: 'S80.1', name: 'Contusion of lower leg (Memar Kaki)', category: 'injury' },
    { code: 'S82.9', name: 'Fracture of lower leg (Patah Kaki)', category: 'injury' },
    { code: 'S90.3', name: 'Contusion of foot', category: 'injury' },
    { code: 'S93.4', name: 'Sprain of ankle (Keseleo)', category: 'injury' },
    { code: 'T14.0', name: 'Superficial injury (Luka Lecet)', category: 'injury' },
    { code: 'T14.1', name: 'Open wound (Luka Terbuka)', category: 'injury' },
    { code: 'T15.9', name: 'Foreign body on external eye', category: 'injury' },
    { code: 'T30.0', name: 'Burn, unspecified (Luka Bakar)', category: 'injury' },
    { code: 'T63.4', name: 'Venom of other arthropods (Sengatan Serangga)', category: 'injury' },
    { code: 'T78.2', name: 'Anaphylactic shock (Syok Anafilaksis)', category: 'injury' },
    { code: 'T78.4', name: 'Allergy, unspecified (Alergi)', category: 'injury' },

    // ========== EXTERNAL CAUSES (V01-Y98) ==========
    { code: 'W54', name: 'Bitten by dog (Gigitan Anjing)', category: 'external' },
    { code: 'X58', name: 'Accidental exposure', category: 'external' },

    // ========== EXTENDED CODES FROM CASE LIBRARY ==========
    // --- Infectious (A/B) ---
    { code: 'A15', name: 'Respiratory tuberculosis, confirmed (TB Paru)', category: 'infectious' },
    { code: 'A28.9', name: 'Zoonotic bacterial disease, unspecified', category: 'infectious' },
    { code: 'A33', name: 'Tetanus neonatorum', category: 'infectious' },
    { code: 'A34', name: 'Obstetrical tetanus', category: 'infectious' },
    { code: 'A35', name: 'Tetanus (Tetanus)', category: 'infectious' },
    { code: 'A36.9', name: 'Diphtheria (Difteri)', category: 'infectious' },
    { code: 'A39.0', name: 'Meningococcal meningitis', category: 'infectious' },
    { code: 'A51.0', name: 'Primary genital syphilis (Sifilis Stadium 1)', category: 'infectious' },
    { code: 'A53.9', name: 'Syphilis, unspecified (Sifilis)', category: 'infectious' },
    { code: 'A54.0', name: 'Gonococcal infection, unspecified (Gonore)', category: 'infectious' },
    { code: 'A54.9', name: 'Gonococcal infection, unspecified', category: 'infectious' },
    { code: 'A56.0', name: 'Chlamydial infection of lower genitourinary tract', category: 'infectious' },
    { code: 'A56.2', name: 'Chlamydial infection, unspecified', category: 'infectious' },
    { code: 'A05.9', name: 'Bacterial foodborne intoxication, unspecified', category: 'infectious' },
    { code: 'A22.9', name: 'Anthrax, unspecified', category: 'infectious' },
    { code: 'A80.9', name: 'Acute poliomyelitis, unspecified', category: 'infectious' },
    { code: 'B00.1', name: 'Herpesviral vesicular dermatitis', category: 'infectious' },
    { code: 'B00.5', name: 'Herpesviral ocular disease', category: 'infectious' },
    { code: 'B07.0', name: 'Verruca vulgaris (Kutil)', category: 'infectious' },
    { code: 'B07.9', name: 'Viral wart, unspecified', category: 'infectious' },
    { code: 'B08.1', name: 'Molluscum contagiosum', category: 'infectious' },
    { code: 'B09', name: 'Unspecified viral infection with skin lesion', category: 'infectious' },
    { code: 'B15', name: 'Acute hepatitis A (Hepatitis A)', category: 'infectious' },
    { code: 'B20', name: 'HIV disease (HIV/AIDS)', category: 'infectious' },
    { code: 'B24', name: 'Unspecified HIV disease', category: 'infectious' },
    { code: 'B26', name: 'Mumps (Gondongan/Parotitis)', category: 'infectious' },
    { code: 'B27.9', name: 'Infectious mononucleosis, unspecified', category: 'infectious' },
    { code: 'B35.1', name: 'Tinea unguium (Jamur Kuku)', category: 'infectious' },
    { code: 'B35.2', name: 'Tinea manuum (Jamur Tangan)', category: 'infectious' },
    { code: 'B35.6', name: 'Tinea cruris (Jamur Selangkangan)', category: 'infectious' },
    { code: 'B35.8', name: 'Other dermatophytoses (Tinea Lainnya)', category: 'infectious' },
    { code: 'B37.2', name: 'Candidiasis of skin and nail', category: 'infectious' },
    { code: 'B37.9', name: 'Candidiasis, unspecified', category: 'infectious' },
    { code: 'B74.9', name: 'Filariasis, unspecified', category: 'infectious' },
    { code: 'B76.0', name: 'Cutaneous larva migrans (CLM)', category: 'infectious' },
    { code: 'B85.3', name: 'Phthiriasis (Pediculosis Pubis)', category: 'infectious' },

    // --- Neoplasm (C/D) ---
    { code: 'C11.9', name: 'Malignant neoplasm of nasopharynx (Ca Nasofaring)', category: 'neoplasm' },
    { code: 'C95.9', name: 'Leukaemia, unspecified (Leukemia)', category: 'neoplasm' },
    { code: 'D50.0', name: 'Iron deficiency anaemia secondary to blood loss', category: 'blood' },
    { code: 'D59.9', name: 'Acquired haemolytic anaemia (Anemia Hemolitik)', category: 'blood' },
    { code: 'D69.3', name: 'Immune thrombocytopenic purpura (ITP)', category: 'blood' },

    // --- Endocrine (E) ---
    { code: 'E10', name: 'Type 1 diabetes mellitus', category: 'endocrine' },
    { code: 'E10.1', name: 'Type 1 DM with ketoacidosis (KAD)', category: 'endocrine' },
    { code: 'E11', name: 'Type 2 diabetes mellitus', category: 'endocrine' },
    { code: 'E11.2', name: 'Type 2 DM with kidney complications (Nefropati DM)', category: 'endocrine' },
    { code: 'E11.5', name: 'Type 2 DM with peripheral circulatory complications', category: 'endocrine' },
    { code: 'E11.6', name: 'Type 2 DM with other specified complications', category: 'endocrine' },
    { code: 'E13', name: 'Other specified diabetes mellitus', category: 'endocrine' },
    { code: 'E15', name: 'Nondiabetic hypoglycaemic coma', category: 'endocrine' },
    { code: 'E16.2', name: 'Hypoglycaemia, unspecified (Hipoglikemia)', category: 'endocrine' },
    { code: 'E40', name: 'Kwashiorkor', category: 'endocrine' },
    { code: 'E50.5', name: 'Vitamin A deficiency with night blindness (Buta Senja)', category: 'endocrine' },
    { code: 'E53.9', name: 'Vitamin B deficiency, unspecified', category: 'endocrine' },
    { code: 'E56.9', name: 'Vitamin deficiency, unspecified', category: 'endocrine' },
    { code: 'E58', name: 'Dietary calcium deficiency', category: 'endocrine' },
    { code: 'E61.9', name: 'Mineral deficiency, unspecified', category: 'endocrine' },
    { code: 'E66.0', name: 'Obesity due to excess calories', category: 'endocrine' },
    { code: 'E66.1', name: 'Drug-induced obesity', category: 'endocrine' },
    { code: 'E78.0', name: 'Pure hypercholesterolaemia', category: 'endocrine' },
    { code: 'E78.1', name: 'Pure hyperglyceridaemia', category: 'endocrine' },
    { code: 'E88.8', name: 'Other specified metabolic disorders (Sindrom Metabolik)', category: 'endocrine' },
    { code: 'E05.0', name: 'Thyrotoxicosis with diffuse goitre (Graves)', category: 'endocrine' },

    // --- Mental (F) ---
    { code: 'F19.0', name: 'Psychoactive substance intoxication (Intoksikasi Zat)', category: 'mental' },
    { code: 'F20.9', name: 'Schizophrenia (Skizofrenia)', category: 'mental' },
    { code: 'F31.1', name: 'Bipolar affective disorder, manic episode (Bipolar Manik)', category: 'mental' },
    { code: 'F32.0', name: 'Mild depressive episode', category: 'mental' },
    { code: 'F32.2', name: 'Severe depressive episode without psychotic symptoms', category: 'mental' },
    { code: 'F33.9', name: 'Recurrent depressive disorder (Depresi Berat)', category: 'mental' },
    { code: 'F40.0', name: 'Agoraphobia', category: 'mental' },
    { code: 'F43.1', name: 'Post-traumatic stress disorder (PTSD)', category: 'mental' },
    { code: 'F43.2', name: 'Adjustment disorders', category: 'mental' },

    // --- Nervous (G) ---
    { code: 'G24.9', name: 'Dystonia, unspecified', category: 'nervous' },
    { code: 'G40.9', name: 'Epilepsy, unspecified (Epilepsi)', category: 'nervous' },
    { code: 'G41.9', name: 'Status epilepticus, unspecified', category: 'nervous' },
    { code: 'G61.0', name: 'Guillain-Barré syndrome', category: 'nervous' },

    // --- Eye (H00-H59) ---
    { code: 'H00.1', name: 'Chalazion (Kalazion)', category: 'eye' },
    { code: 'H01.1', name: 'Noninfectious dermatoses of eyelid', category: 'eye' },
    { code: 'H02.0', name: 'Entropion and trichiasis (Trikiasis)', category: 'eye' },
    { code: 'H04.0', name: 'Dacryoadenitis', category: 'eye' },
    { code: 'H04.1', name: 'Dry eye syndrome (Mata Kering)', category: 'eye' },
    { code: 'H04.3', name: 'Acute dacryocystitis', category: 'eye' },
    { code: 'H04.4', name: 'Chronic dacryocystitis (Dakriosistitis)', category: 'eye' },
    { code: 'H10.1', name: 'Acute atopic conjunctivitis', category: 'eye' },
    { code: 'H10.4', name: 'Chronic conjunctivitis', category: 'eye' },
    { code: 'H11.0', name: 'Pterygium (Pterigium)', category: 'eye' },
    { code: 'H11.3', name: 'Conjunctival haemorrhage (Perdarahan Subkonjungtiva)', category: 'eye' },
    { code: 'H15.0', name: 'Scleritis', category: 'eye' },
    { code: 'H15.1', name: 'Episcleritis', category: 'eye' },
    { code: 'H16.9', name: 'Keratitis, unspecified', category: 'eye' },
    { code: 'H20.0', name: 'Acute iridocyclitis (Uveitis Anterior)', category: 'eye' },
    { code: 'H20.9', name: 'Iridocyclitis, unspecified', category: 'eye' },
    { code: 'H43.3', name: 'Vitreous haemorrhage', category: 'eye' },
    { code: 'H44.0', name: 'Purulent endophthalmitis', category: 'eye' },
    { code: 'H53.0', name: 'Amblyopia ex anopsia', category: 'eye' },

    // --- Ear (H60-H95) ---
    { code: 'H61.2', name: 'Cerumen impaction (Serumen Prop)', category: 'ear' },
    { code: 'H83.0', name: 'Labyrinthitis', category: 'ear' },
    { code: 'H93.1', name: 'Tinnitus', category: 'ear' },

    // --- Circulatory (I) ---
    { code: 'I15.9', name: 'Secondary hypertension', category: 'circulatory' },
    { code: 'I47.1', name: 'Supraventricular tachycardia', category: 'circulatory' },
    { code: 'I48.9', name: 'Atrial fibrillation (Fibrilasi Atrial)', category: 'circulatory' },
    { code: 'I80.2', name: 'Deep vein thrombosis (DVT)', category: 'circulatory' },
    { code: 'I87.0', name: 'Postthrombotic syndrome', category: 'circulatory' },
    { code: 'I89.0', name: 'Lymphoedema, not elsewhere classified', category: 'circulatory' },
    { code: 'I97.2', name: 'Postmastectomy lymphoedema syndrome', category: 'circulatory' },

    // --- Respiratory (J) ---
    { code: 'J11', name: 'Influenza, virus not identified', category: 'respiratory' },
    { code: 'J34.0', name: 'Abscess/furuncle of nose (Furunkel Hidung)', category: 'respiratory' },
    { code: 'J36', name: 'Peritonsillar abscess (Abses Peritonsil)', category: 'respiratory' },
    { code: 'J38.0', name: 'Paralysis of vocal cords', category: 'respiratory' },
    { code: 'J81', name: 'Pulmonary oedema', category: 'respiratory' },
    { code: 'J93.0', name: 'Spontaneous tension pneumothorax', category: 'respiratory' },
    { code: 'J96.0', name: 'Acute respiratory failure', category: 'respiratory' },

    // --- Digestive (K) ---
    { code: 'K11.2', name: 'Sialoadenitis', category: 'digestive' },
    { code: 'K70.1', name: 'Alcoholic hepatitis', category: 'digestive' },
    { code: 'K73.9', name: 'Chronic hepatitis, unspecified', category: 'digestive' },

    // --- Skin (L) ---
    { code: 'L03.0', name: 'Cellulitis of finger (Paronikia)', category: 'skin' },
    { code: 'L08.1', name: 'Erythrasma', category: 'skin' },
    { code: 'L21.9', name: 'Seborrhoeic dermatitis (Dermatitis Seboroik)', category: 'skin' },
    { code: 'L22', name: 'Diaper dermatitis (Napkin Eczema)', category: 'skin' },
    { code: 'L24', name: 'Irritant contact dermatitis (DKI)', category: 'skin' },
    { code: 'L27.0', name: 'Generalized skin eruption due to drugs', category: 'skin' },
    { code: 'L27.1', name: 'Localized skin eruption due to drugs', category: 'skin' },
    { code: 'L30.0', name: 'Nummular dermatitis', category: 'skin' },
    { code: 'L30.1', name: 'Dyshidrosis', category: 'skin' },
    { code: 'L30.4', name: 'Erythema intertrigo', category: 'skin' },
    { code: 'L40.0', name: 'Psoriasis vulgaris', category: 'skin' },
    { code: 'L42', name: 'Pityriasis rosea', category: 'skin' },
    { code: 'L50.0', name: 'Allergic urticaria (Urtikaria Akut)', category: 'skin' },
    { code: 'L51.1', name: 'Stevens-Johnson syndrome (SJS)', category: 'skin' },
    { code: 'L51.2', name: 'Toxic epidermal necrolysis (TEN)', category: 'skin' },
    { code: 'L51.9', name: 'Erythema multiforme, unspecified', category: 'skin' },
    { code: 'L52', name: 'Erythema nodosum', category: 'skin' },
    { code: 'L60.3', name: 'Nail dystrophy', category: 'skin' },
    { code: 'L63.9', name: 'Alopecia areata, unspecified', category: 'skin' },
    { code: 'L72.1', name: 'Trichilemmal cyst', category: 'skin' },
    { code: 'L73.2', name: 'Hidradenitis suppurativa', category: 'skin' },
    { code: 'L74.0', name: 'Miliaria rubra', category: 'skin' },
    { code: 'L74.3', name: 'Miliaria (Biang Keringat)', category: 'skin' },
    { code: 'L85.8', name: 'Other specified epidermal thickening (Kornu Kutaneum)', category: 'skin' },
    { code: 'L93.0', name: 'Discoid lupus erythematosus', category: 'skin' },
    { code: 'L97', name: 'Non-pressure chronic ulcer of lower limb (Ulkus Tungkai)', category: 'skin' },

    // --- Musculoskeletal (M) ---
    { code: 'M00.9', name: 'Pyogenic arthritis, unspecified', category: 'musculoskeletal' },
    { code: 'M51.1', name: 'Lumbar disc disorders with radiculopathy (HNP)', category: 'musculoskeletal' },
    { code: 'M51.2', name: 'Other specified intervertebral disc degeneration', category: 'musculoskeletal' },
    { code: 'M54.1', name: 'Radiculopathy', category: 'musculoskeletal' },
    { code: 'M86.1', name: 'Other acute osteomyelitis', category: 'musculoskeletal' },
    { code: 'M86.9', name: 'Osteomyelitis, unspecified (Osteomielitis)', category: 'musculoskeletal' },

    // --- Genitourinary (N) ---
    { code: 'N00.9', name: 'Acute nephritic syndrome (GNA)', category: 'genitourinary' },
    { code: 'N03.9', name: 'Chronic nephritic syndrome', category: 'genitourinary' },
    { code: 'N08.3', name: 'Glomerular disorders in diabetes mellitus', category: 'genitourinary' },
    { code: 'N23', name: 'Unspecified renal colic', category: 'genitourinary' },
    { code: 'N30.9', name: 'Cystitis, unspecified', category: 'genitourinary' },
    { code: 'N44.0', name: 'Torsion of testis (Torsio Testis)', category: 'genitourinary' },
    { code: 'N45.9', name: 'Orchitis and epididymitis', category: 'genitourinary' },
    { code: 'N47.1', name: 'Phimosis, specified', category: 'genitourinary' },
    { code: 'N47.2', name: 'Paraphimosis (Parafimosis)', category: 'genitourinary' },
    { code: 'N48.1', name: 'Balanoposthitis', category: 'genitourinary' },
    { code: 'N61', name: 'Inflammatory disorders of breast (Mastitis)', category: 'genitourinary' },
    { code: 'N64.5', name: 'Other signs and symptoms in breast', category: 'genitourinary' },
    { code: 'N70.9', name: 'Salpingitis and oophoritis (PID)', category: 'genitourinary' },
    { code: 'N73.0', name: 'Acute parametritis and pelvic cellulitis', category: 'genitourinary' },
    { code: 'N75.1', name: 'Bartholin gland abscess', category: 'genitourinary' },
    { code: 'N77.1', name: 'Vaginitis in diseases classified elsewhere (Vaginosis)', category: 'genitourinary' },

    // --- Pregnancy (O) ---
    { code: 'O02.1', name: 'Missed abortion', category: 'pregnancy' },
    { code: 'O03.4', name: 'Incomplete spontaneous abortion (Abortus Inkomplit)', category: 'pregnancy' },
    { code: 'O03.9', name: 'Complete spontaneous abortion (Abortus Komplit)', category: 'pregnancy' },
    { code: 'O06.9', name: 'Unspecified abortion, complete', category: 'pregnancy' },
    { code: 'O14.1', name: 'Severe pre-eclampsia (Preeklampsia Berat)', category: 'pregnancy' },
    { code: 'O15.0', name: 'Eclampsia in pregnancy (Eklampsia)', category: 'pregnancy' },
    { code: 'O20.0', name: 'Threatened abortion', category: 'pregnancy' },
    { code: 'O21.1', name: 'Hyperemesis gravidarum with metabolic disturbance', category: 'pregnancy' },
    { code: 'O42.9', name: 'Premature rupture of membranes (KPD)', category: 'pregnancy' },
    { code: 'O62.0', name: 'Primary inadequate contractions', category: 'pregnancy' },
    { code: 'O70.0', name: 'First degree perineal laceration (Ruptur Perineum)', category: 'pregnancy' },
    { code: 'O70.1', name: 'Second degree perineal laceration', category: 'pregnancy' },
    { code: 'O72.0', name: 'Third-stage haemorrhage', category: 'pregnancy' },
    { code: 'O72.1', name: 'Postpartum haemorrhage (PPH)', category: 'pregnancy' },
    { code: 'O80.9', name: 'Single spontaneous delivery (Persalinan Normal)', category: 'pregnancy' },
    { code: 'O91.0', name: 'Infection of nipple associated with childbirth', category: 'pregnancy' },
    { code: 'O91.2', name: 'Nonpurulent mastitis (Mastitis Laktasi)', category: 'pregnancy' },
    { code: 'O92.1', name: 'Cracked nipple (Puting Lecet)', category: 'pregnancy' },
    { code: 'O99.0', name: 'Anaemia complicating pregnancy (Anemia Kehamilan)', category: 'pregnancy' },

    // --- Perinatal (P) ---
    { code: 'P21.9', name: 'Birth asphyxia (Asfiksia Neonatorum)', category: 'perinatal' },
    { code: 'P22.0', name: 'Respiratory distress syndrome of newborn', category: 'perinatal' },
    { code: 'P38', name: 'Omphalitis of newborn (Infeksi Umbilikus)', category: 'perinatal' },

    // --- Congenital (Q) ---
    { code: 'Q83.8', name: 'Other congenital malformations of breast (Inverted Nipple)', category: 'congenital' },

    // --- Symptoms/Signs (R) ---
    { code: 'R04.0', name: 'Epistaxis (Mimisan)', category: 'symptoms' },
    { code: 'R56.8', name: 'Other and unspecified convulsions', category: 'symptoms' },
    { code: 'R57.0', name: 'Cardiogenic shock', category: 'symptoms' },
    { code: 'R57.1', name: 'Hypovolaemic shock (Syok Hipovolemik)', category: 'symptoms' },
    { code: 'R65.2', name: 'Severe sepsis', category: 'symptoms' },

    // --- Injury (S/T) ---
    { code: 'S50', name: 'Superficial injury of forearm', category: 'injury' },
    { code: 'S53', name: 'Dislocation/sprain of elbow', category: 'injury' },
    { code: 'T00.9', name: 'Multiple superficial injuries', category: 'injury' },
    { code: 'T01.9', name: 'Multiple open wounds', category: 'injury' },
    { code: 'T14.2', name: 'Fracture of unspecified body region (Fraktur Terbuka)', category: 'injury' },
    { code: 'T14.9', name: 'Injury, unspecified', category: 'injury' },
    { code: 'T15.0', name: 'Foreign body in cornea', category: 'injury' },
    { code: 'T15.1', name: 'Foreign body in conjunctival sac', category: 'injury' },
    { code: 'T17.1', name: 'Foreign body in nostril (Benda Asing Hidung)', category: 'injury' },
    { code: 'T30.2', name: 'Burn of second degree', category: 'injury' },
    { code: 'T30.3', name: 'Burn of third degree (Luka Bakar Derajat 3)', category: 'injury' },
    { code: 'T31.0', name: 'Burns involving <10% body surface', category: 'injury' },
    { code: 'T62', name: 'Toxic effects of noxious substances eaten as food', category: 'injury' },
    { code: 'T62.9', name: 'Noxious substance eaten as food (Keracunan Makanan)', category: 'injury' },
    { code: 'T75.1', name: 'Drowning and nonfatal submersion (Tenggelam)', category: 'injury' },
    { code: 'T75.3', name: 'Motion sickness (Mabuk Perjalanan)', category: 'injury' },
    { code: 'T78.0', name: 'Anaphylactic reaction due to food', category: 'injury' },
    { code: 'T78.1', name: 'Other adverse food reactions (Alergi Makanan)', category: 'injury' },
    { code: 'T78.3', name: 'Angioneurotic oedema', category: 'injury' },

    // --- Factors (Z) ---
    { code: 'Z00.0', name: 'General health examination (Medical Check-up)', category: 'factors' },
    { code: 'Z04.5', name: 'Examination after alleged physical assault (Visum)', category: 'factors' },
    { code: 'Z21', name: 'Asymptomatic HIV infection status', category: 'factors' },
    { code: 'Z34.0', name: 'Supervision of normal pregnancy (ANC)', category: 'factors' },

    // ========== ROUND 2 ADDITIONS ==========
    // --- Infectious ---
    { code: 'A03.9', name: 'Shigellosis/Dysentery, unspecified (Disentri)', category: 'infectious' },
    { code: 'A18.4', name: 'Tuberculosis of skin (Scrofuloderma)', category: 'infectious' },
    { code: 'A27.9', name: 'Leptospirosis, unspecified', category: 'infectious' },
    { code: 'A30.9', name: 'Leprosy, unspecified (Lepra/Kusta)', category: 'infectious' },
    { code: 'A41.9', name: 'Sepsis, unspecified (Sepsis)', category: 'infectious' },
    { code: 'A59.0', name: 'Urogenital trichomoniasis', category: 'infectious' },
    { code: 'A87.9', name: 'Viral meningitis, unspecified', category: 'infectious' },
    { code: 'B30.9', name: 'Viral conjunctivitis, unspecified', category: 'infectious' },
    { code: 'B65.9', name: 'Schistosomiasis, unspecified', category: 'infectious' },
    { code: 'B68.9', name: 'Taeniasis, unspecified', category: 'infectious' },
    { code: 'B78.9', name: 'Strongyloidiasis, unspecified', category: 'infectious' },

    // --- Neoplasm ---
    { code: 'C44.9', name: 'Malignant neoplasm of skin, unspecified', category: 'neoplasm' },
    { code: 'C49.9', name: 'Malignant neoplasm of connective tissue', category: 'neoplasm' },

    // --- Mental ---
    { code: 'F03', name: 'Unspecified dementia', category: 'mental' },
    { code: 'F03.90', name: 'Unspecified dementia (Alzheimer early)', category: 'mental' },

    // --- Nervous ---
    { code: 'G00.9', name: 'Bacterial meningitis, unspecified (Meningitis)', category: 'nervous' },
    { code: 'G30.9', name: 'Alzheimer disease, unspecified', category: 'nervous' },
    { code: 'G62.9', name: 'Polyneuropathy, unspecified', category: 'nervous' },
    { code: 'G63.2', name: 'Diabetic polyneuropathy (Neuropati DM)', category: 'nervous' },
    { code: 'G82.0', name: 'Flaccid paraplegia', category: 'nervous' },

    // --- Circulatory ---
    { code: 'I61.9', name: 'Intracerebral haemorrhage (Stroke Hemoragik)', category: 'circulatory' },
    { code: 'I85.0', name: 'Oesophageal varices with bleeding', category: 'circulatory' },

    // --- Respiratory ---
    { code: 'J90', name: 'Pleural effusion (Efusi Pleura)', category: 'respiratory' },

    // --- Digestive ---
    { code: 'K37', name: 'Unspecified appendicitis', category: 'digestive' },
    { code: 'K56.5', name: 'Intestinal adhesions with obstruction', category: 'digestive' },
    { code: 'K56.6', name: 'Other and unspecified intestinal obstruction (Ileus)', category: 'digestive' },
    { code: 'K62.5', name: 'Haemorrhage of anus and rectum', category: 'digestive' },
    { code: 'K64.0', name: 'First degree haemorrhoids (Hemoroid Grade 1-2)', category: 'digestive' },
    { code: 'K81.0', name: 'Acute cholecystitis (Kolesistitis Akut)', category: 'digestive' },
    { code: 'K90.4', name: 'Malabsorption due to intolerance (Intoleransi Makanan)', category: 'digestive' },
    { code: 'K92.2', name: 'Gastrointestinal haemorrhage (Perdarahan GI)', category: 'digestive' },

    // --- Skin ---
    { code: 'L04.9', name: 'Acute lymphadenitis, unspecified (Limfadenitis)', category: 'skin' },
    { code: 'L10.0', name: 'Pemphigus vulgaris', category: 'skin' },
    { code: 'L12.0', name: 'Bullous pemphigoid', category: 'skin' }
];

import { PersistenceService, db } from '../services/PersistenceService.js';
import { ICD10_ALIASES } from './ICD10_ALIASES.js';

// cachedMasterICD removed — PersistenceService handles ICD10 caching now

// loadMasterICD is removed as per the refactoring plan.

export async function findICD10(query, limit = 15) {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase().trim();

    // 0. Check Indonesian aliases first (highest priority, exact colloquial terms)
    const aliasMatches = [];
    for (const [alias, code] of Object.entries(ICD10_ALIASES)) {
        if (alias.includes(q) || q.includes(alias)) {
            const match = ICD10_DB.find(d => d.code === code);
            if (match && !aliasMatches.find(m => m.code === match.code)) {
                aliasMatches.push(match);
            }
        }
    }

    // 1. Search curated ICD10_DB (always reliable)
    const dbMatches = ICD10_DB.filter(d =>
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q)
    );

    // Merge alias + DB matches (deduplicated)
    const seen = new Set();
    const merged = [];
    for (const m of [...aliasMatches, ...dbMatches]) {
        if (!seen.has(m.code)) {
            seen.add(m.code);
            merged.push(m);
        }
    }
    if (merged.length >= limit) return merged.slice(0, limit);

    // 2. Try PersistenceService (IndexedDB) for extended codes
    try {
        const results = await PersistenceService.searchICD10(query, limit - merged.length);
        if (results && results.length > 0) {
            for (const r of results) {
                if (!seen.has(r.code)) {
                    seen.add(r.code);
                    merged.push(r);
                }
            }
        }
    } catch (e) {
        console.warn('IndexedDB search failed, using local results only...', e);
    }

    return merged.slice(0, limit);
}

export function getCategoryFromCode(code) {
    const letter = code.charAt(0).toUpperCase();
    if (['A', 'B'].includes(letter)) return 'infectious';
    if (['C', 'D'].includes(letter)) return 'neoplasm/blood';
    if (letter === 'E') return 'endocrine';
    if (letter === 'F') return 'mental';
    if (letter === 'G') return 'nervous';
    if (letter === 'H') return 'eye/ear';
    if (letter === 'I') return 'circulatory';
    if (letter === 'J') return 'respiratory';
    if (letter === 'K') return 'digestive';
    if (letter === 'L') return 'skin';
    if (letter === 'M') return 'musculoskeletal';
    if (letter === 'N') return 'genitourinary';
    if (letter === 'O') return 'pregnancy';
    if (letter === 'P') return 'perinatal';
    if (letter === 'Q') return 'congenital';
    if (letter === 'R') return 'symptoms';
    if (['S', 'T'].includes(letter)) return 'injury';
    return 'other';
}

export async function getICD10ByCode(code) {
    // 1. Try local hardcoded DB first (fastest)
    const localMatch = ICD10_DB.find(d => d.code === code);
    if (localMatch) return localMatch;

    // 2. Try PersistenceService (IndexedDB)
    try {
        const fromDb = await db.icd10.get(code);
        if (fromDb) return fromDb;
    } catch (e) {
        console.warn('getICD10ByCode DB lookup failed', e);
    }

    return null;
}

export function getRandomICD10ByCategory(category) {
    const filtered = ICD10_DB.filter(d => d.category === category);
    return filtered[Math.floor(Math.random() * filtered.length)];
}
