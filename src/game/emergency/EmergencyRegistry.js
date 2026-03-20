/**
 * @reflection
 * [IDENTITY]: EmergencyRegistry
 * [PURPOSE]: Core constants for the Emergency Engine (Triage, ESI, Actions).
 * [STATE]: Stable
 * [ANCHOR]: TRIAGE_LEVELS
 */

export const TRIAGE_LEVELS = {
    1: {
        name: 'MERAH',
        desc: 'Immediate - Mengancam Nyawa',
        timeLimit: 0,
        color: 'bg-red-600',
        textColor: 'text-red-600',
        badgeTextColor: 'text-white',
        borderColor: 'border-red-600',
        priority: 1
    },
    2: {
        name: 'KUNING',
        desc: 'Urgent - Potensial Mengancam',
        timeLimit: 10,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-700',
        badgeTextColor: 'text-slate-900',
        borderColor: 'border-yellow-500',
        priority: 2
    },
    3: {
        name: 'HIJAU',
        desc: 'Non-Urgent - Dapat Ditunda',
        timeLimit: 60,
        color: 'bg-green-500',
        textColor: 'text-green-700',
        badgeTextColor: 'text-white',
        borderColor: 'border-green-500',
        priority: 3
    },
    4: {
        name: 'HITAM',
        desc: 'Deceased / Expectant',
        timeLimit: 999,
        color: 'bg-slate-800',
        textColor: 'text-slate-800',
        badgeTextColor: 'text-white',
        borderColor: 'border-slate-800',
        priority: 4
    }
};

export const ESI_LEVELS = {
    1: { name: 'ESI 1: Resuscitation', desc: 'Butuh bantuan hidup SEGERA (Intubasi, Syok, Cardiac Arrest).' },
    2: { name: 'ESI 2: Emergent', desc: 'Risiko tinggi, Nyeri hebat, atau Gangguan kesadaran. Harus cepat (10m).' },
    3: { name: 'ESI 3: Urgent', desc: 'Kondisi stabil tapi butuh BANYAK sumber daya (Lab, IV, Radiologi).' },
    4: { name: 'ESI 4: Less Urgent', desc: 'Stabil, butuh HANYA SATU jenis sumber daya (misal: hanya Rontgen saja).' },
    5: { name: 'ESI 5: Non-Urgent', desc: 'Stabil, TIDAK butuh sumber daya (misal: hanya obat oral/ganti verban).' }
};

export const EMERGENCY_ACTIONS = {
    // --- Airway & Breathing ---
    iv_line: { id: 'iv_line', name: 'Pasang akses IV', cost: 100000, requiredItems: ['iv_cannula', 'infusion_set', 'plester', 'sarung_tangan'], vitalEffect: { bp_sys: +10 }, deteriorationModifier: -1 },
    oxygen: { id: 'oxygen', name: 'Oksigen (Nasal Kanul/Masker)', cost: 25000, vitalEffect: { spo2: +8, rr: -3 }, deteriorationModifier: -2 },
    recovery_position: { id: 'recovery_position', name: 'Posisi Recovery', cost: 10000, deteriorationModifier: -1 },
    protect_airway: { id: 'protect_airway', name: 'Jaga Jalan Napas', cost: 15000, vitalEffect: { spo2: +5 }, deteriorationModifier: -2 },
    head_tilt: { id: 'head_tilt', name: 'Head Tilt / Chin Lift', cost: 0, vitalEffect: { spo2: +3 }, deteriorationModifier: -1 },
    suction_airway: { id: 'suction_airway', name: 'Suction Jalan Napas', cost: 15000, vitalEffect: { spo2: +5, rr: -2 }, deteriorationModifier: -2 },
    rescue_breathing: { id: 'rescue_breathing', name: 'Bantuan Napas (Bag Valve Mask)', cost: 25000, vitalEffect: { spo2: +10, rr: -4 }, deteriorationModifier: -3 },
    cpr: { id: 'cpr', name: 'RJP (Resusitasi Jantung Paru)', cost: 0, vitalEffect: { hr: +30, bp_sys: +20, spo2: +5 }, deteriorationModifier: -5 },

    // --- Monitoring & Observation (no vital changes) ---
    monitor_gds: { id: 'monitor_gds', name: 'Monitor GDS tiap 15 menit', cost: 20000, requiredItems: ['reagen_gds'] },
    monitor_vitals_15: { id: 'monitor_vitals_15', name: 'Monitor Vital Sign tiap 15-30m', cost: 10000 },
    observation_6h: { id: 'observation_6h', name: 'Observasi 4-6 jam', cost: 50000 },
    evaluate_nebu: { id: 'evaluate_nebu', name: 'Evaluasi respon Nebulizer', cost: 10000 },
    find_focus: { id: 'find_focus', name: 'Cari fokus infeksi', cost: 5000 },
    education_seizure: { id: 'education_seizure', name: 'Edukasi penanganan kejang', cost: 5000 },
    check_cause: { id: 'check_cause', name: 'Cari penyebab (GDS, demam, trauma)', cost: 5000 },
    ecg: { id: 'ecg', name: 'EKG 12 Lead', cost: 50000, requiredItems: ['ecg_electrode'] },

    // --- Wound Care & Procedures ---
    wound_cleaning: { id: 'wound_cleaning', name: 'Cuci luka (NaCl/Air Bersih)', cost: 25000, requiredItems: ['iv_fluid_ns', 'kasa_steril'], deteriorationModifier: -1 },
    hemostasis: { id: 'hemostasis', name: 'Hemostasis (Tekan)', cost: 15000, requiredItems: ['kasa_steril'], vitalEffect: { bp_sys: +5 }, deteriorationModifier: -2 },
    suturing: { id: 'suturing', name: 'Jahit Luka (Hecting)', cost: 50000, requiredItems: ['suturing_kit_disposable', 'lidocaine_inj', 'kasa_steril', 'sarung_tangan'], deteriorationModifier: -1 },
    warm_compress: { id: 'warm_compress', name: 'Kompres Hangat', cost: 5000 },
    cold_compress: { id: 'cold_compress', name: 'Kompres Dingin', cost: 5000 },
    burn_cooling: { id: 'burn_cooling', name: 'Irigasi Air Mengalir (20 menit)', cost: 5000, deteriorationModifier: -1 },
    silver_sulfadiazine: { id: 'silver_sulfadiazine', name: 'Silver Sulfadiazine Cream', cost: 35000, deductStock: true, deteriorationModifier: -1 },
    burn_wrap: { id: 'burn_wrap', name: 'Balut Luka Bakar Steril', cost: 25000, requiredItems: ['kasa_steril'], deteriorationModifier: -1 },
    immobilize_limb: { id: 'immobilize_limb', name: 'Imobilisasi Ekstremitas (Bidai)', cost: 15000, deteriorationModifier: -1 },
    splint_fracture: { id: 'splint_fracture', name: 'Bidai/Splinting Fraktur', cost: 25000, requiredItems: ['bidai_set', 'kasa_steril'], deteriorationModifier: -1 },

    // --- IV Fluids & Resuscitation ---
    iv_fluid_rl: { id: 'iv_fluid_rl', name: 'Infus Ringer Lactate', cost: 100000, deductStock: true, requiredItems: ['iv_fluid_rl'], vitalEffect: { bp_sys: +15, hr: -5 }, deteriorationModifier: -2 },
    rehydration_bolus: { id: 'rehydration_bolus', name: 'Bolus Cairan NaCl 0.9% 20ml/kg', cost: 100000, deductStock: true, requiredItems: ['iv_fluid_ns'], vitalEffect: { bp_sys: +20, hr: -10 }, deteriorationModifier: -3 },
    nacl_resus: { id: 'nacl_resus', name: 'NaCl 0.9% Resusitasi Masif (1L)', cost: 100000, deductStock: true, requiredItems: ['iv_fluid_ns'], vitalEffect: { bp_sys: +25, hr: -8 }, deteriorationModifier: -3 },

    // --- Drugs: Cardiac & Vascular ---
    epinephrine_inj: { id: 'epinephrine_inj', name: 'Epinefrin 0.3-0.5 mg IM', cost: 20000, deductStock: true, requiredItems: ['epinephrine_inj', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { hr: +20, bp_sys: +30, spo2: +5 }, deteriorationModifier: -4 },
    aspilet_160: { id: 'aspilet_160', name: 'Aspirin 160mg (Loading)', cost: 5000, deductStock: true, deteriorationModifier: -1 },
    isdn_5: { id: 'isdn_5', name: 'ISDN 5mg Sublingual', cost: 5000, deductStock: true, vitalEffect: { bp_sys: -10 }, deteriorationModifier: -2 },
    clopidogrel_300: { id: 'clopidogrel_300', name: 'Clopidogrel 300mg (Loading)', cost: 50000, deductStock: true, deteriorationModifier: -1 },
    morphine_iv: { id: 'morphine_iv', name: 'Morphine IV', cost: 65000, deductStock: true, requiredItems: ['morphine_iv', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { hr: -5, rr: -2 }, deteriorationModifier: -1 },
    furosemide_iv: { id: 'furosemide_iv', name: 'Furosemide 40mg IV', cost: 15000, deductStock: true, requiredItems: ['furosemide_iv', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { bp_sys: -15 }, deteriorationModifier: -2 },
    nicardipine_drip: { id: 'nicardipine_drip', name: 'Nicardipine Drip (Anti-HT Emergency)', cost: 150000, deductStock: true, requiredItems: ['nicardipine_drip', 'infusion_set', 'sarung_tangan'], vitalEffect: { bp_sys: -30 }, deteriorationModifier: -3 },
    tranexamic_acid_iv: { id: 'tranexamic_acid_iv', name: 'Asam Traneksamat 1g IV', cost: 25000, deductStock: true, requiredItems: ['tranexamic_acid_iv', 'spuit_10cc', 'sarung_tangan'], vitalEffect: { bp_sys: +5 }, deteriorationModifier: -1 },

    // --- Drugs: Neurological ---
    diazepam_10mg: { id: 'diazepam_10mg', name: 'Diazepam 10 mg IV Pelan', cost: 25000, deductStock: true, requiredItems: ['diazepam_10mg', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { hr: -5 }, deteriorationModifier: -3 },
    diazepam_rectal_prn: { id: 'diazepam_rectal_prn', name: 'Diazepam Rektal', cost: 45000, deductStock: true, requiredItems: ['diazepam_rectal_prn'], deteriorationModifier: -3 },
    phenytoin_iv: { id: 'phenytoin_iv', name: 'Phenytoin IV (Loading)', cost: 85000, deductStock: true, requiredItems: ['phenytoin_iv', 'spuit_3cc', 'sarung_tangan'], deteriorationModifier: -2 },
    magnesium_sulfate_iv: { id: 'magnesium_sulfate_iv', name: 'MgSO4 40% IV (Anti-kejang Eklampsia)', cost: 50000, deductStock: true, requiredItems: ['magnesium_sulfate_iv', 'spuit_10cc', 'sarung_tangan'], vitalEffect: { bp_sys: -20 }, deteriorationModifier: -3 },

    // --- Drugs: Respiratory ---
    salbutamol_neb: { id: 'salbutamol_neb', name: 'Nebulizer Salbutamol 2.5mg', cost: 35000, deductStock: true, requiredItems: ['salbutamol_neb', 'nebulizer_kit'], vitalEffect: { spo2: +6, rr: -4, hr: +10 }, deteriorationModifier: -3 },
    ipratropium_neb: { id: 'ipratropium_neb', name: 'Nebulizer Ipratropium Br.', cost: 45000, deductStock: true, requiredItems: ['ipratropium_neb', 'nebulizer_kit'], vitalEffect: { spo2: +4, rr: -3 }, deteriorationModifier: -2 },

    // --- Drugs: Anti-inflammatory & Steroid ---
    dexamethasone_iv: { id: 'dexamethasone_iv', name: 'Steroid IV (Dexamethasone)', cost: 15000, deductStock: true, requiredItems: ['dexamethasone_iv', 'spuit_3cc', 'sarung_tangan'], deteriorationModifier: -2 },
    diphenhydramine_iv: { id: 'diphenhydramine_iv', name: 'Antihistamin IV (Diphenhydramine)', cost: 15000, deductStock: true, requiredItems: ['diphenhydramine_iv', 'spuit_3cc', 'sarung_tangan'], deteriorationModifier: -1 },
    methylprednisolone_iv: { id: 'methylprednisolone_iv', name: 'Steroid IV (Methylprednisolone)', cost: 75000, deductStock: true, requiredItems: ['methylprednisolone_iv', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { spo2: +3 }, deteriorationModifier: -2 },
    ketorolac_iv: { id: 'ketorolac_iv', name: 'Ketorolac 30mg IV', cost: 15000, deductStock: true, requiredItems: ['ketorolac_iv', 'spuit_3cc', 'sarung_tangan'] },
    ondansetron_iv: { id: 'ondansetron_iv', name: 'Ondansetron 4mg IV', cost: 15000, deductStock: true, requiredItems: ['ondansetron_iv', 'spuit_3cc', 'sarung_tangan'] },

    // --- Drugs: Metabolic ---
    d40_iv: { id: 'd40_iv', name: 'Bolus Dxtrose 40% (2fl)', cost: 25000, deductStock: true, requiredItems: ['d40_iv', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { gds: +80 }, deteriorationModifier: -4 },
    d10_maintenance: { id: 'd10_maintenance', name: 'Infus Dextrose 10% Maintenance', cost: 35000, deductStock: true, requiredItems: ['d10_maintenance'], vitalEffect: { gds: +30 }, deteriorationModifier: -2 },
    insulin_drip: { id: 'insulin_drip', name: 'Insulin Regular Drip', cost: 75000, deductStock: true, requiredItems: ['insulin_drip', 'infusion_set', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { gds: -80 }, deteriorationModifier: -3 },

    // --- Drugs: Toxicology ---
    atropine_iv: { id: 'atropine_iv', name: 'Atropin Sulfat 0.5-1mg IV', cost: 20000, deductStock: true, requiredItems: ['atropine_iv', 'spuit_3cc', 'sarung_tangan'], vitalEffect: { hr: +35, bp_sys: +20 }, deteriorationModifier: -4 },
    pralidoxime_iv: { id: 'pralidoxime_iv', name: 'Pralidoxime (2-PAM) 1g IV', cost: 100000, deductStock: true, requiredItems: ['pralidoxime_iv', 'spuit_10cc', 'sarung_tangan'], deteriorationModifier: -3 },
    gastric_lavage: { id: 'gastric_lavage', name: 'Bilas Lambung (NGT)', cost: 75000, requiredItems: ['ngt_tube', 'sarung_tangan'], deteriorationModifier: -2 },
    activated_charcoal: { id: 'activated_charcoal', name: 'Arang Aktif (Norit) 50g', cost: 25000, deductStock: true, deteriorationModifier: -2 },
    saep_antivenom: { id: 'saep_antivenom', name: 'Serum Anti Bisa Ular Polivalen (SABU)', cost: 500000, deductStock: true, requiredItems: ['saep_antivenom', 'spuit_3cc', 'sarung_tangan'], deteriorationModifier: -5 },

    // --- Prophylaxis & General ---
    ats_injection: { id: 'ats_injection', name: 'Profilaksis Tetanus (ATS/TT)', cost: 75000, deductStock: true, requiredItems: ['ats_injection', 'spuit_3cc', 'sarung_tangan'] },
    paracetamol_syr: { id: 'paracetamol_syr', name: 'Paracetamol Drop/Sirup', cost: 15000, deductStock: true, vitalEffect: { temp: -1 } },
    paracetamol_500: { id: 'paracetamol_500', name: 'Paracetamol 500mg Tab', cost: 2000, deductStock: true, vitalEffect: { temp: -1 } },
    lidocaine_inj: { id: 'lidocaine_inj', name: 'Anestesi Lokal (Lidocaine)', cost: 15000, deductStock: true, requiredItems: ['lidocaine_inj', 'spuit_3cc', 'sarung_tangan'] },
    amoxicillin_500: { id: 'amoxicillin_500', name: 'Antibiotik Profilaksis', cost: 5000, deductStock: true },
    reagen_gds: { id: 'reagen_gds', name: 'Cek GDS', cost: 20000, deductStock: true, requiredItems: ['reagen_gds'] },
    ecg_electrode: { id: 'ecg_electrode', name: 'Elektrode EKG', cost: 10000, deductStock: true, requiredItems: ['ecg_electrode'] },
    heimlich_maneuver: { id: 'heimlich_maneuver', name: 'Heimlich Maneuver / Back Blow', cost: 0, vitalEffect: { spo2: +10 }, deteriorationModifier: -4 },

    // --- Procedures ---
    ngt_tube: { id: 'ngt_tube', name: 'Pasang NGT', cost: 50000, requiredItems: ['ngt_tube', 'sarung_tangan'] },
    ngt_decompression: { id: 'ngt_decompression', name: 'NGT Dekompresi', cost: 50000, requiredItems: ['ngt_tube', 'sarung_tangan'], deteriorationModifier: -2 },
    blood_crossmatch: { id: 'blood_crossmatch', name: 'Crossmatch Darah (PRC)', cost: 50000 },
    catheter_urine: { id: 'catheter_urine', name: 'Kateter Urin (Foley)', cost: 45000, requiredItems: ['kateter_foley', 'sarung_tangan'] },
};
