/**
 * @reflection
 * [IDENTITY]: ProceduresDB
 * [PURPOSE]: ProceduresDB.js — Physical Exam and Procedure data constants.
 * [STATE]: Experimental
 * [ANCHOR]: PHYSICAL_EXAM_OPTIONS
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * ProceduresDB.js — Physical Exam and Procedure data constants.
 */

export const PHYSICAL_EXAM_OPTIONS = {
    general: { name: 'Keadaan Umum', cost: 0, time: 1 },
    vitals: { name: 'Tanda Vital (TD, Nadi, Suhu, RR)', cost: 0, time: 2 },
    heent: { name: 'Kepala, Mata, THT', cost: 0, time: 3 },
    neck: { name: 'Leher (KGB, Tiroid)', cost: 0, time: 2 },
    thorax: { name: 'Thorax (Jantung & Paru)', cost: 0, time: 5 },
    abdomen: { name: 'Abdomen', cost: 0, time: 4 },
    extremities: { name: 'Ekstremitas', cost: 0, time: 3 },
    skin: { name: 'Kulit', cost: 0, time: 2 },
    neuro: { name: 'Neurologis Singkat', cost: 0, time: 5 },
    rectal: { name: 'Rectal Touche (RT)', cost: 0, time: 3 },
    genitalia: { name: 'Genitalia (dengan consent)', cost: 0, time: 4 },
    breast: { name: 'Pemeriksaan Payudara', cost: 0, time: 3 }
};

export const PROCEDURES_DB = [
    { id: 'wound_care', name: 'Perawatan Luka (GV)', cost: 25000, indication: ['wound', 'laceration'], requiredItems: ['kasa_steril', 'plester', 'iv_fluid_ns'] },
    { id: 'suturing', name: 'Jahit Luka (Hecting)', cost: 50000, indication: ['laceration'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'plester', 'sarung_tangan'] },
    { id: 'aff_hecting', name: 'Angkat Jahitan', cost: 20000, indication: ['wound_healed'], requiredItems: ['sarung_tangan', 'kasa_steril'] },
    { id: 'incision_drainage', name: 'Insisi Drainase Abses', cost: 75000, indication: ['abscess'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan'] },
    { id: 'nebulizer', name: 'Nebulizer / Uap', cost: 35000, indication: ['asthma', 'bronchospasm'], requiredItems: ['nebulizer_kit', 'salbutamol_neb'] },
    { id: 'suction', name: 'Suction Lendir', cost: 30000, indication: ['secretion'], requiredItems: ['sarung_tangan', 'masker_bedah'] },
    { id: 'iv_fluid', name: 'Pasang Infus (Rehidrasi)', cost: 100000, indication: ['dehydration', 'shock'], requiredItems: ['iv_cannula', 'infusion_set', 'iv_fluid_rl', 'plester', 'sarung_tangan'] },
    { id: 'im_injection', name: 'Injeksi IM', cost: 20000, indication: ['medication'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'iv_injection', name: 'Injeksi IV Bolus', cost: 25000, indication: ['emergency', 'pain_severe'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'ear_syringe', name: 'Spooling Telinga / Cerumen', cost: 30000, indication: ['cerumen'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'catheter', name: 'Pasang Kateter Urine', cost: 75000, indication: ['retention'], requiredItems: ['folley_catheter', 'urine_bag', 'sarung_tangan', 'kasa_steril'] },
    { id: 'ngtb', name: 'Pasang NGT', cost: 75000, indication: ['feeding', 'decompression'], requiredItems: ['ngt_tube', 'sarung_tangan'] },
    { id: 'circumcision', name: 'Sirkumsisi', cost: 250000, indication: ['phimosis'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan', 'plester'] },
    { id: 'tooth_extraction', name: 'Ekstraksi Gigi', cost: 75000, indication: ['dental'], requiredItems: ['lidocaine_inj', 'kasa_steril', 'sarung_tangan'] },
    { id: 'scaling', name: 'Scaling Gigi (Per Kuadran)', cost: 50000, indication: ['dental'], requiredItems: ['sarung_tangan', 'masker_bedah'] },
    { id: 'pap_smear', name: 'Pap Smear', cost: 125000, indication: ['screening'], requiredItems: ['sarung_tangan', 'masker_bedah'] },
    { id: 'iva', name: 'IVA Test', cost: 25000, indication: ['screening'], requiredItems: ['sarung_tangan', 'masker_bedah'] },
    { id: 'kb_suntik', name: 'Suntik KB', cost: 30000, indication: ['contraception'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'kb_implant', name: 'Pasang/Lepas Implant', cost: 100000, indication: ['contraception'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'sarung_tangan'] },
    { id: 'ecg', name: 'Rekam Jantung (EKG)', cost: 50000, indication: ['cardiac'], requiredItems: ['ecg_electrode', 'sarung_tangan'] },
    { id: 'burn_dressing', name: 'Balut Luka Bakar', cost: 35000, indication: ['burn'], requiredItems: ['kasa_steril', 'plester', 'sarung_tangan'] },
    { id: 'anterior_nasal_packing', name: 'Tampon Hidung Anterior', cost: 40000, indication: ['epistaxis'], requiredItems: ['kasa_steril', 'sarung_tangan'] },
    { id: 'wound_debridement', name: 'Debridement Luka', cost: 75000, indication: ['wound_infected', 'ulcer'], requiredItems: ['suturing_kit_disposable', 'kasa_steril', 'sarung_tangan'] },
    { id: 'wound_dressing', name: 'Ganti Balut Luka', cost: 20000, indication: ['wound', 'burn'], requiredItems: ['kasa_steril', 'plester', 'sarung_tangan'] },
    { id: 'wound_suturing', name: 'Penjahitan Luka', cost: 50000, indication: ['laceration', 'vulnus_laceratum'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan'] },
    { id: 'cold_compress', name: 'Kompres Dingin', cost: 5000, indication: ['sprain', 'contusion', 'hematoma'], requiredItems: ['ice_pack'] },
    { id: 'iv_access', name: 'Pasang Akses Intravena', cost: 50000, indication: ['dehydration', 'emergency'], requiredItems: ['iv_cannula', 'infusion_set', 'plester', 'sarung_tangan'] },
    { id: 'airway_management', name: 'Manajemen Jalan Napas', cost: 100000, indication: ['airway_obstruction', 'anaphylaxis'], requiredItems: ['oropharyngeal_airway', 'bag_valve_mask', 'sarung_tangan'] },
    { id: 'tetanus_prophylaxis', name: 'Profilaksis Tetanus (TT/ATS)', cost: 30000, indication: ['wound_contaminated'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'eye_irrigation', name: 'Irigasi Mata', cost: 20000, indication: ['chemical_splash', 'foreign_body_eye'], requiredItems: ['iv_fluid_ns', 'sarung_tangan'] },
    { id: 'foreign_body_removal_eye', name: 'Ekstraksi Benda Asing Mata', cost: 35000, indication: ['foreign_body_eye'], requiredItems: ['cotton_bud_steril', 'sarung_tangan'] },
    { id: 'epilation', name: 'Epilasi Bulu Mata (Trikiasis)', cost: 15000, indication: ['trichiasis'], requiredItems: ['pinset', 'sarung_tangan'] },
    { id: 'snellen_test', name: 'Tes Visus Snellen', cost: 10000, indication: ['screening_mata', 'refraksi'], requiredItems: ['snellen_chart'] },
    { id: 'refraction_test', name: 'Pemeriksaan Refraksi', cost: 25000, indication: ['miopia', 'hipermetropia', 'astigmatisme'], requiredItems: ['trial_lens_set'] },
    { id: 'near_vision_test', name: 'Tes Baca Dekat (Jaeger)', cost: 10000, indication: ['presbiopia'], requiredItems: ['jaeger_chart'] },
    { id: 'cover_test', name: 'Cover Test (Strabismus)', cost: 10000, indication: ['strabismus'], requiredItems: [] },
    { id: 'keratometry', name: 'Keratometri', cost: 50000, indication: ['astigmatisme'], requiredItems: ['keratometer'] },
    { id: 'ear_toilet', name: 'Toilet Telinga', cost: 25000, indication: ['otitis_media', 'otitis_eksterna'], requiredItems: ['sarung_tangan', 'kasa_steril'] },
    { id: 'foreign_body_removal_nose', name: 'Ekstraksi Benda Asing Hidung', cost: 35000, indication: ['foreign_body_nose'], requiredItems: ['pinset', 'sarung_tangan'] },
    { id: 'cryotherapy', name: 'Krioterapi (Nitrogen Cair)', cost: 50000, indication: ['verruca', 'condyloma'], requiredItems: ['liquid_nitrogen', 'sarung_tangan'] },
    { id: 'curettage', name: 'Kuretase Lesi Kulit', cost: 40000, indication: ['molluscum', 'verruca'], requiredItems: ['kuret', 'lidocaine_inj', 'sarung_tangan'] },
    { id: 'excision_lipoma', name: 'Eksisi Lipoma', cost: 200000, indication: ['lipoma'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan'] },
    { id: 'nit_combing', name: 'Sisir Kutu (Nit Combing)', cost: 10000, indication: ['pediculosis'], requiredItems: ['nit_comb'] },
    { id: 'perineal_repair', name: 'Penjahitan Perineum', cost: 100000, indication: ['perineal_rupture'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'sarung_tangan'] },
    { id: 'hoffman_technique', name: 'Teknik Hoffman (Puting Datar)', cost: 0, indication: ['inverted_nipple'], requiredItems: [] },
    { id: 'manual_reduction_paraphimosis', name: 'Reduksi Manual Parafimosis', cost: 50000, indication: ['paraphimosis'], requiredItems: ['ice_pack', 'lidocaine_inj', 'sarung_tangan'] },
    { id: 'gds_monitoring', name: 'Pemantauan Gula Darah Sewaktu', cost: 10000, indication: ['hipoglikemia', 'dm'], requiredItems: ['glucometer', 'lancet', 'sarung_tangan'] },
    { id: 'roserplasty', name: 'Ekstraksi Kuku (Roserplasty)', cost: 75000, indication: ['paronychia', 'onychocryptosis'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan'] },
    { id: 'fracture_splinting', name: 'Stabilisasi Fraktur (Bidai/Splinting)', cost: 40000, indication: ['fracture'], requiredItems: ['splint_set', 'bandage', 'sarung_tangan'] },
    { id: 'needle_decompression', name: 'Dekompresi Jarum (Emergency)', cost: 150000, indication: ['tension_pneumothorax'], requiredItems: ['iv_cannula_14g', 'alcohol_swab', 'sarung_tangan'] },
    { id: 'neonatal_resuscitation', name: 'Resusitasi Bayi Baru Lahir', cost: 100000, indication: ['asphyxia_neonatorum'], requiredItems: ['neonatal_vvm', 'suction_bulb', 'sarung_tangan'] },
    { id: 'spirometry', name: 'Spirometri Dasar', cost: 50000, indication: ['asthma', 'ppok'], requiredItems: ['spirometer', 'disposable_mouthpiece'] },
    { id: 'normal_delivery', name: 'Pertolongan Persalinan Normal (APN)', cost: 600000, indication: ['labor_normal'], requiredItems: ['partus_set', 'oxytocin_inj', 'kasa_steril', 'sarung_tangan_steril'] },
    { id: 'episiotomy', name: 'Episiotomi & Hecting Perineum', cost: 150000, indication: ['labor_normal', 'perineal_rupture'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan_steril'] },
    { id: 'mmse', name: 'Pemeriksaan MMSE / MoCA-In', cost: 25000, indication: ['dementia', 'cognitive_impairment'], requiredItems: ['mmse_form', 'stationery'] },
    { id: 'foreign_body_removal_ear', name: 'Ekstraksi Benda Asing Telinga', cost: 35000, indication: ['foreign_body_ear'], requiredItems: ['ear_hook', 'alligator_forceps', 'sarung_tangan'] },
    { id: 'ureum_kreatinin', name: 'Lab Ureum/Kreatinin', cost: 80000, indication: ['hypertension', 'diabetes', 'kidney'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'neuro_referral', name: 'Rujukan Spesialis Saraf', cost: 0, indication: ['neurology_referral'], requiredItems: [] },

    // === CASE-REFERENCED PROCEDURES (resolves correctProcedures IDs) ===
    // --- Airway & Oxygenation ---
    { id: 'airway_protection', name: 'Proteksi Jalan Napas', cost: 0, indication: ['airway_obstruction', 'decreased_consciousness'], requiredItems: ['oropharyngeal_airway', 'sarung_tangan'] },
    { id: 'nasal_cannula', name: 'Oksigen Nasal Kanul', cost: 30000, indication: ['hypoxia', 'respiratory_distress'], requiredItems: ['nasal_cannula_set', 'o2_tank'] },
    { id: 'o2_mask', name: 'Oksigen Masker Sederhana', cost: 30000, indication: ['hypoxia', 'respiratory_distress'], requiredItems: ['simple_mask', 'o2_tank'] },
    { id: 'o2_mask_10lpm', name: 'Oksigen NRM 10 LPM', cost: 30000, indication: ['severe_hypoxia', 'emergency'], requiredItems: ['nrm_mask', 'o2_tank'] },
    { id: 'o2_mask_15lpm', name: 'Oksigen NRM 15 LPM', cost: 30000, indication: ['severe_hypoxia', 'emergency'], requiredItems: ['nrm_mask', 'o2_tank'] },
    { id: 'o2_nasal_2lpm', name: 'Oksigen Nasal 2 LPM', cost: 30000, indication: ['mild_hypoxia', 'bronchiolitis'], requiredItems: ['nasal_cannula_set', 'o2_tank'] },
    { id: 'o2_nasal_4lpm', name: 'Oksigen Nasal 4 LPM', cost: 30000, indication: ['moderate_hypoxia', 'pneumothorax'], requiredItems: ['nasal_cannula_set', 'o2_tank'] },
    { id: 'nebulizer_serial', name: 'Nebulizer Serial (3x20 menit)', cost: 100000, indication: ['status_asthmaticus', 'severe_bronchospasm'], requiredItems: ['nebulizer_kit', 'salbutamol_neb'] },

    // --- Monitoring & Assessment ---
    { id: 'monitor_vital', name: 'Monitor Tanda Vital Ketat', cost: 0, indication: ['emergency', 'critical'], requiredItems: [] },
    { id: 'intake_output_chart', name: 'Catatan Input/Output Cairan', cost: 0, indication: ['dehydration', 'fluid_management'], requiredItems: [] },
    { id: 'cek_gds_serial', name: 'Cek GDS Serial', cost: 30000, indication: ['hipoglikemia', 'dm_emergency'], requiredItems: ['glucometer', 'lancet', 'sarung_tangan'] },
    { id: 'cek_tsh_ft4', name: 'Cek TSH & FT4', cost: 150000, indication: ['thyroid'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'visual_acuity_check', name: 'Pemeriksaan Tajam Penglihatan', cost: 10000, indication: ['visual_impairment'], requiredItems: ['snellen_chart'] },
    { id: 'bmi_calculation', name: 'Hitung IMT (BMI)', cost: 0, indication: ['obesity', 'malnutrition'], requiredItems: ['timbangan', 'pengukur_tinggi'] },
    { id: 'lingkar_perut', name: 'Ukur Lingkar Perut', cost: 0, indication: ['metabolic_syndrome'], requiredItems: ['pita_ukur'] },
    { id: 'safety_assessment', name: 'Asesmen Keamanan Pasien', cost: 0, indication: ['psychiatric', 'suicidal'], requiredItems: [] },
    { id: 'suicidal_risk_assessment', name: 'Asesmen Risiko Bunuh Diri', cost: 0, indication: ['psychiatric', 'depression'], requiredItems: [] },

    // --- IV & Fluid ---
    { id: 'iv_access_2_lines', name: 'Pasang 2 Jalur IV', cost: 100000, indication: ['hemorrhage', 'shock'], requiredItems: ['iv_cannula', 'infusion_set', 'plester', 'sarung_tangan'] },
    { id: 'fluid_restriction', name: 'Restriksi Cairan', cost: 0, indication: ['heart_failure', 'hyponatremia'], requiredItems: [] },
    { id: 'pasang_mgso4', name: 'Pasang Drip MgSO4', cost: 50000, indication: ['eclampsia', 'preeclampsia'], requiredItems: ['mgso4_inj', 'infusion_set', 'sarung_tangan'] },

    // --- Wound & Dressing ---
    { id: 'wound_care_burn', name: 'Rawat Luka Bakar', cost: 35000, indication: ['burn'], requiredItems: ['kasa_steril', 'silver_sulfadiazine', 'sarung_tangan'] },
    { id: 'wound_irrigation_saline', name: 'Irigasi Luka NaCl', cost: 15000, indication: ['wound_contaminated'], requiredItems: ['iv_fluid_ns', 'sarung_tangan'] },
    { id: 'wound_cover_saline_gauze', name: 'Tutup Luka Kasa Basah NaCl', cost: 10000, indication: ['burn', 'open_wound'], requiredItems: ['kasa_steril', 'iv_fluid_ns'] },
    { id: 'sterile_dressing', name: 'Balut Steril', cost: 15000, indication: ['wound', 'post_procedure'], requiredItems: ['kasa_steril', 'plester', 'sarung_tangan'] },
    { id: 'pressure_bandage', name: 'Balut Tekan (Pressure Bandage)', cost: 15000, indication: ['hemorrhage', 'hematoma'], requiredItems: ['elastic_bandage', 'kasa_steril'] },
    { id: 'compression_bandage', name: 'Bebat Kompresi', cost: 15000, indication: ['sprain', 'dvt_prevention'], requiredItems: ['elastic_bandage'] },

    // --- OB-GYN ---
    { id: 'anc_examination', name: 'Pemeriksaan ANC (Leopold)', cost: 0, indication: ['pregnancy'], requiredItems: ['pita_ukur', 'doppler'] },
    { id: 'inspekulo', name: 'Pemeriksaan Inspekulo', cost: 25000, indication: ['vaginal_discharge', 'cervicitis'], requiredItems: ['spekulum', 'sarung_tangan'] },
    { id: 'monitor_djj', name: 'Monitor DJJ (Detak Jantung Janin)', cost: 0, indication: ['pregnancy', 'labor'], requiredItems: ['doppler'] },
    { id: 'bimanual_compression', name: 'Kompresi Bimanual', cost: 0, indication: ['postpartum_hemorrhage'], requiredItems: ['sarung_tangan_steril'] },
    { id: 'uterine_massage', name: 'Masase Uterus', cost: 0, indication: ['postpartum_hemorrhage'], requiredItems: ['sarung_tangan'] },
    { id: 'remove_tissue_at_oue', name: 'Evakuasi Jaringan di OUE', cost: 50000, indication: ['incomplete_abortion'], requiredItems: ['ring_forceps', 'sarung_tangan_steril'] },
    { id: 'left_lateral_position', name: 'Posisi Miring Kiri', cost: 0, indication: ['preeclampsia', 'labor'], requiredItems: [] },
    { id: 'breastfeeding_counseling', name: 'Konseling Menyusui', cost: 0, indication: ['breastfeeding_problem'], requiredItems: [] },
    { id: 'newborn_care', name: 'Perawatan Bayi Baru Lahir', cost: 0, indication: ['newborn'], requiredItems: ['sarung_tangan', 'kasa_steril'] },

    // --- ENT ---
    { id: 'cerumen_removal', name: 'Pengambilan Serumen', cost: 30000, indication: ['cerumen_impacted'], requiredItems: ['ear_hook', 'sarung_tangan'] },
    { id: 'ear_irrigation', name: 'Irigasi Telinga', cost: 30000, indication: ['cerumen_impacted'], requiredItems: ['spuit_20cc', 'sarung_tangan'] },
    { id: 'otoskopi', name: 'Pemeriksaan Otoskopi', cost: 15000, indication: ['ear_complaint'], requiredItems: ['otoscope'] },
    { id: 'transilluminasi_sinus', name: 'Transilluminasi Sinus', cost: 10000, indication: ['sinusitis'], requiredItems: ['penlight'] },
    { id: 'nasal_foreign_body_removal', name: 'Ekstraksi Benda Asing Hidung', cost: 35000, indication: ['foreign_body_nose'], requiredItems: ['pinset', 'sarung_tangan'] },
    { id: 'epistaxis_management', name: 'Tatalaksana Epistaksis', cost: 40000, indication: ['epistaxis'], requiredItems: ['kasa_steril', 'tampon_anterior', 'sarung_tangan'] },

    // --- Ophthalmology ---
    { id: 'fluorescein_test', name: 'Tes Fluorescein Mata', cost: 15000, indication: ['corneal_ulcer', 'foreign_body_eye'], requiredItems: ['fluorescein_strip', 'penlight'] },
    { id: 'shadow_test', name: 'Shadow Test (Uji Bayangan)', cost: 10000, indication: ['refraction_screening'], requiredItems: ['penlight'] },
    { id: 'lid_hygiene', name: 'Kebersihan Kelopak Mata', cost: 10000, indication: ['blepharitis', 'hordeolum'], requiredItems: ['kasa_steril'] },

    // --- Orthopedics ---
    { id: 'splinting', name: 'Pemasangan Bidai', cost: 40000, indication: ['fracture', 'sprain'], requiredItems: ['splint_set', 'bandage', 'sarung_tangan'] },
    { id: 'immobilization', name: 'Imobilisasi Ekstremitas', cost: 30000, indication: ['fracture', 'dislocation'], requiredItems: ['splint_set', 'bandage'] },
    { id: 'leg_elevation', name: 'Elevasi Kaki', cost: 0, indication: ['sprain', 'edema', 'dvt_prevention'], requiredItems: [] },

    // --- Urology ---
    { id: 'foley_catheter', name: 'Pasang Kateter Foley', cost: 75000, indication: ['retention', 'monitoring'], requiredItems: ['folley_catheter', 'urine_bag', 'sarung_tangan', 'kasa_steril'] },
    { id: 'manual_detorsion_attempt', name: 'Percobaan Detorsi Manual (Testis)', cost: 0, indication: ['torsio_testis'], requiredItems: ['sarung_tangan'] },
    { id: 'usg_ginjal', name: 'USG Ginjal', cost: 150000, indication: ['urolithiasis', 'hydronephrosis'], requiredItems: ['usg_machine'] },

    // --- Diagnostic / Lab ---
    { id: 'rontgen_thorax', name: 'Rontgen Thorax', cost: 100000, indication: ['pneumonia', 'tb', 'effusion', 'pneumothorax'], requiredItems: ['rontgen_machine'] },
    { id: 'ecg_12lead', name: 'EKG 12 Lead', cost: 50000, indication: ['cardiac', 'arrhythmia'], requiredItems: ['ecg_electrode', 'sarung_tangan'] },
    { id: 'lakmus_test', name: 'Tes Lakmus (pH Cairan)', cost: 5000, indication: ['ketuban_pecah'], requiredItems: ['lakmus_strip'] },
    { id: 'excision_biopsy', name: 'Biopsi Eksisi', cost: 200000, indication: ['tumor', 'lump'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan'] },

    // --- Positioning & Supportive ---
    { id: 'posisi_duduk_fowler', name: 'Posisi Duduk Fowler', cost: 0, indication: ['pulmonary_edema', 'respiratory_distress'], requiredItems: [] },
    { id: 'bed_rest', name: 'Istirahat Total (Bed Rest)', cost: 0, indication: ['threatened_abortion', 'preeclampsia'], requiredItems: [] },

    // --- Psychiatric ---
    { id: 'brief_psychotherapy', name: 'Psikoterapi Singkat / Konseling', cost: 0, indication: ['anxiety', 'depression', 'somatoform'], requiredItems: [] },

    // --- Contact Tracing ---
    { id: 'family_tracing', name: 'Pelacakan Kontak Keluarga', cost: 0, indication: ['tb', 'ims'], requiredItems: [] },
    { id: 'partner_tracing', name: 'Pelacakan Kontak Pasangan', cost: 0, indication: ['ims', 'hiv'], requiredItems: [] },

    // --- Neonatal / Pediatric ---
    { id: 'suction_if_needed', name: 'Suction Lendir (Jika Perlu)', cost: 30000, indication: ['secretion', 'newborn'], requiredItems: ['suction_bulb', 'sarung_tangan'] },
    { id: 'apn_procedures', name: 'Prosedur APN (Asuhan Persalinan Normal)', cost: 0, indication: ['labor_normal'], requiredItems: ['partus_set', 'sarung_tangan_steril'] },

    // === MAIA CROSS-VALIDATION — Missing Procedure Entries (v4) ===
    // --- Monitoring & Assessment ---
    { id: 'monitor_vital_15min', name: 'Monitor Vital Tiap 15 Menit', cost: 0, indication: ['shock', 'dss', 'emergency'], requiredItems: [] },
    { id: 'monitor_respiratory_rate', name: 'Monitor Laju Respirasi Ketat', cost: 0, indication: ['gbs', 'respiratory_failure'], requiredItems: [] },
    { id: 'blood_culture', name: 'Ambil Kultur Darah', cost: 120000, indication: ['sepsis', 'bacteremia'], requiredItems: ['spuit_3cc', 'blood_culture_bottle', 'sarung_tangan'] },
    { id: 'cek_hbsag', name: 'Cek HBsAg', cost: 50000, indication: ['hepatitis_b', 'screening'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'cek_ht_serial', name: 'Cek Hematokrit Serial', cost: 30000, indication: ['dss', 'dbd'], requiredItems: ['spuit_3cc', 'sarung_tangan'] },
    { id: 'foot_examination', name: 'Pemeriksaan Kaki Diabetik', cost: 0, indication: ['neuropati_dm', 'diabetic_foot'], requiredItems: ['monofilament', 'garpu_tala'] },
    { id: 'monofilamen_test', name: 'Tes Monofilamen (10g)', cost: 0, indication: ['neuropati_dm'], requiredItems: ['monofilament'] },

    // --- Airway & Positioning ---
    { id: 'airway_preparation', name: 'Persiapan Alat Jalan Napas', cost: 0, indication: ['gbs', 'respiratory_failure_risk'], requiredItems: ['oropharyngeal_airway', 'bag_valve_mask'] },
    { id: 'safety_position', name: 'Recovery Position (Posisi Miring Stabil)', cost: 0, indication: ['kejang', 'penurunan_kesadaran'], requiredItems: [] },
    { id: 'head_elevation_30', name: 'Elevasi Kepala 30 Derajat', cost: 0, indication: ['stroke', 'meningitis', 'peningkatan_tik'], requiredItems: [] },
    { id: 'head_down', name: 'Posisi Trendelenburg (Kepala Rendah)', cost: 0, indication: ['perdarahan_gi', 'syok'], requiredItems: [] },

    // --- Gastro / NGT ---
    { id: 'ngt_decompression', name: 'Pasang NGT Dekompresi', cost: 75000, indication: ['ileus_obstruktif', 'distensi_abdomen'], requiredItems: ['ngt_tube', 'sarung_tangan'] },
    { id: 'ngt_if_dysphagia', name: 'Pasang NGT Jika Disfagia', cost: 75000, indication: ['stroke', 'disfagia'], requiredItems: ['ngt_tube', 'sarung_tangan'] },
    { id: 'ngt_if_vomiting', name: 'Pasang NGT Jika Muntah Persisten', cost: 75000, indication: ['apendisitis', 'ileus'], requiredItems: ['ngt_tube', 'sarung_tangan'] },
    { id: 'ngt_lavage', name: 'Bilas Lambung via NGT', cost: 75000, indication: ['perdarahan_gi_atas'], requiredItems: ['ngt_tube', 'iv_fluid_ns', 'sarung_tangan'] },
    { id: 'puasakan', name: 'Puasakan Pasien (NPO)', cost: 0, indication: ['pre_operasi', 'ileus', 'pankreatitis'], requiredItems: [] },
    { id: 'endoscopy_referral', name: 'Rujuk untuk Endoskopi', cost: 0, indication: ['gerd_erosive', 'gastritis_erosive', 'perdarahan_gi'], requiredItems: [] },

    // --- OB-GYN ---
    { id: 'perineum_repair', name: 'Reparasi Perineum', cost: 100000, indication: ['ruptur_perineum'], requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'sarung_tangan_steril'] },

    // --- Forensik & Medikolegal ---
    { id: 'photo_documentation', name: 'Dokumentasi Foto Luka/Temuan', cost: 0, indication: ['medikolegal', 'kekerasan'], requiredItems: ['kamera'] },
    { id: 'visum_documentation', name: 'Dokumentasi Visum', cost: 0, indication: ['medikolegal'], requiredItems: ['form_visum'] },
    { id: 'visum_et_repertum', name: 'Pembuatan Visum et Repertum', cost: 0, indication: ['medikolegal', 'kekerasan'], requiredItems: ['form_visum'] },
    { id: 'wound_measurement', name: 'Pengukuran & Deskripsi Luka', cost: 0, indication: ['medikolegal', 'wound'], requiredItems: ['pita_ukur'] },
    { id: 'food_sample_collection', name: 'Pengambilan Sampel Makanan', cost: 0, indication: ['keracunan_makanan'], requiredItems: ['wadah_steril'] },

    // --- Referral ---
    { id: 'hospital_referral', name: 'Rujuk ke Rumah Sakit', cost: 0, indication: ['emergency', 'specialist_needed'], requiredItems: [] },

    // --- Neurology ---
    { id: 'epley_maneuver', name: 'Manuver Epley (Reposisi Kanalit)', cost: 0, indication: ['bppv'], requiredItems: [] },
    { id: 'eye_protection', name: 'Proteksi Mata (Taping/Kacamata)', cost: 5000, indication: ['bells_palsy', 'lagoftalmus'], requiredItems: ['plester', 'kasa_steril'] },

    // --- Emergency / Supportive ---
    { id: 'warming_blanket', name: 'Selimut Penghangat', cost: 15000, indication: ['hipotermia', 'tenggelam'], requiredItems: ['selimut'] },
    { id: 'wound_care_umbilical', name: 'Perawatan Luka Tali Pusat', cost: 10000, indication: ['infeksi_umbilikus'], requiredItems: ['kasa_steril', 'sarung_tangan'] },
    { id: 'wound_wash_rabies', name: 'Cuci Luka Gigitan (Sabun 15 menit)', cost: 5000, indication: ['rabies', 'gigitan_hewan'], requiredItems: ['sabun', 'air_mengalir'] }
];

export const PROCEDURE_CODE_MAP = {
    'excision_lipoma': ['86.3'],
    'nebulization': ['93.94'],
    'wound_debridement': ['86.22', '86.28'],
    'wound_suturing': ['86.59'],
    'iv_access': ['38.99', '99.29'],
    'ecg_test': ['89.52'],
    'refraction_test': ['95.01'],
    'snellen_test': ['95.01'],
    'airway_management': ['96.04', '93.90'],
    'cold_compress': ['99.25'],
    'near_vision_test': ['95.01'],
    'manual_reduction_paraphimosis': ['99.0'],
    'roserplasty': ['86.23', '86.27'],
    'fracture_splinting': ['93.54'],
    'needle_decompression': ['34.01', '34.91'],
    'neonatal_resuscitation': ['93.93'],
    'spirometry': ['89.37'],
    'normal_delivery': ['73.59'],
    'episiotomy': ['73.6'],
    'mmse': ['94.01'],
    'foreign_body_removal_ear': ['98.11']
};
