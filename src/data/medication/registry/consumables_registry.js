/**
 * @reflection
 * [IDENTITY]: consumables_registry
 * [PURPOSE]: BHP (Bahan Habis Pakai) & Alkes consumables for procedures and IGD.
 * [STATE]: Stable
 * [ANCHOR]: CONSUMABLES_MEDICATIONS
 * [DEPENDS_ON]: None
 * [LAST_UPDATE]: 2026-03-24
 *
 * Items are split into two groups:
 * - form: 'consumable' → tracked in inventory, deducted per use
 * - form: 'equipment'  → permanent Puskesmas assets, NOT deducted
 *
 * All items use category: 'Alat Kesehatan Habis Pakai' for consumables
 * or category: 'Peralatan Medis' for equipment.
 */

export const CONSUMABLES_MEDICATIONS = [
    // ═══════════════════════════════════════════════════════════
    // INFUSION & IV ACCESS
    // ═══════════════════════════════════════════════════════════
    { id: 'iv_cannula', name: 'IV Cannula (Abbocath)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 8000, sellPrice: 15000, minStock: 50, description: 'Kanul intravena untuk akses vaskular' },
    { id: 'iv_cannula_14g', name: 'IV Cannula 14G (Large Bore)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 12000, sellPrice: 20000, minStock: 20, description: 'Kanul besar untuk resusitasi cairan cepat' },
    { id: 'infusion_set', name: 'Infusion Set (Selang Infus)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 10000, sellPrice: 18000, minStock: 50, description: 'Set selang infus makro/mikro' },
    { id: 'iv_fluid_ns', name: 'NaCl 0.9% 500ml (Normal Saline)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 12000, sellPrice: 20000, minStock: 40, description: 'Cairan infus NaCl 0.9%' },
    { id: 'iv_fluid_rl', name: 'Ringer Laktat 500ml', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 13000, sellPrice: 22000, minStock: 40, description: 'Cairan infus Ringer Laktat' },

    // ═══════════════════════════════════════════════════════════
    // AIRWAY & OXYGEN
    // ═══════════════════════════════════════════════════════════
    { id: 'o2_tank', name: 'Tabung Oksigen (refill)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 50000, sellPrice: 75000, minStock: 10, description: 'Refill tabung oksigen medis' },
    { id: 'nasal_cannula_set', name: 'Nasal Cannula Set', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 5000, sellPrice: 10000, minStock: 30, description: 'Kanul hidung untuk terapi oksigen' },
    { id: 'simple_mask', name: 'Simple Face Mask', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 6000, sellPrice: 12000, minStock: 30, description: 'Masker oksigen sederhana' },
    { id: 'nrm_mask', name: 'Non-Rebreather Mask (NRM)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 15000, sellPrice: 25000, minStock: 15, description: 'Masker oksigen konsentrasi tinggi' },
    { id: 'bag_valve_mask', name: 'Bag-Valve-Mask (Ambu Bag)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 35000, sellPrice: 55000, minStock: 5, description: 'Ambu bag untuk ventilasi manual' },
    { id: 'oropharyngeal_airway', name: 'Oropharyngeal Airway (OPA)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 8000, sellPrice: 15000, minStock: 10, description: 'Airway adjunct orofaringeal' },
    { id: 'nebulizer_kit', name: 'Nebulizer Kit (Disposable)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 12000, sellPrice: 20000, minStock: 20, description: 'Kit nebulizer sekali pakai' },
    { id: 'ngt_tube', name: 'NGT (Nasogastric Tube)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 10000, sellPrice: 18000, minStock: 10, description: 'Selang nasogastrik untuk dekompresi/feeding' },

    // ═══════════════════════════════════════════════════════════
    // WOUND CARE & DRESSING
    // ═══════════════════════════════════════════════════════════
    { id: 'kasa_steril', name: 'Kasa Steril', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 3000, sellPrice: 6000, minStock: 100, description: 'Kasa steril untuk perawatan luka', isDuplicate: true },
    { id: 'bandage', name: 'Perban (Bandage Roll)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 4000, sellPrice: 8000, minStock: 50, description: 'Perban gulung untuk balut tekan' },
    { id: 'elastic_bandage', name: 'Elastic Bandage', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 8000, sellPrice: 15000, minStock: 20, description: 'Perban elastis untuk sprain/strain' },
    { id: 'plester', name: 'Plester (Adhesive Tape)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 5000, sellPrice: 10000, minStock: 50, description: 'Plester fiksasi' },
    { id: 'suturing_kit_disposable', name: 'Suturing Kit (Disposable)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 25000, sellPrice: 45000, minStock: 15, description: 'Kit jahit luka disposable (benang + jarum)' },
    { id: 'splint_set', name: 'Splint Set (Bidai)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 15000, sellPrice: 25000, minStock: 10, description: 'Bidai untuk imobilisasi fraktur' },
    { id: 'tampon_anterior', name: 'Tampon Anterior (Epistaxis)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 5000, sellPrice: 10000, minStock: 10, description: 'Tampon hidung untuk epistaksis anterior' },
    { id: 'ice_pack', name: 'Ice Pack (Kompres Dingin)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 3000, sellPrice: 6000, minStock: 20, description: 'Kompres dingin instan' },

    // ═══════════════════════════════════════════════════════════
    // SYRINGES & NEEDLES
    // ═══════════════════════════════════════════════════════════
    { id: 'spuit_3cc', name: 'Spuit 3cc', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 1500, sellPrice: 3000, minStock: 100, description: 'Syringe 3ml untuk injeksi', isDuplicate: true },
    { id: 'spuit_20cc', name: 'Spuit 20cc', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 3000, sellPrice: 6000, minStock: 30, description: 'Syringe 20ml untuk aspirasi/irigasi' },
    { id: 'lancet', name: 'Lancet (Blood Sampling)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 500, sellPrice: 1000, minStock: 100, description: 'Lancet untuk pengambilan darah kapiler' },

    // ═══════════════════════════════════════════════════════════
    // PPE & HYGIENE
    // ═══════════════════════════════════════════════════════════
    { id: 'sarung_tangan', name: 'Sarung Tangan (Non-steril)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 500, sellPrice: 1000, minStock: 200, description: 'Handscoon latex/nitrile non-steril' },
    { id: 'sarung_tangan_steril', name: 'Sarung Tangan Steril', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 3000, sellPrice: 6000, minStock: 50, description: 'Handscoon steril untuk prosedur invasif' },
    { id: 'masker_bedah', name: 'Masker Bedah', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 500, sellPrice: 1000, minStock: 200, description: 'Masker bedah 3-ply', isDuplicate: true },
    { id: 'alcohol_swab', name: 'Alcohol Swab', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 200, sellPrice: 500, minStock: 200, description: 'Swab alkohol untuk desinfeksi', isDuplicate: true },

    // ═══════════════════════════════════════════════════════════
    // CATHETER & TUBES
    // ═══════════════════════════════════════════════════════════
    { id: 'folley_catheter', name: 'Folley Catheter', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 18000, sellPrice: 30000, minStock: 10, description: 'Kateter urin menetap' },
    { id: 'urine_bag', name: 'Urine Bag', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 8000, sellPrice: 15000, minStock: 10, description: 'Kantong urin untuk kateter', isDuplicate: true },
    { id: 'suction_bulb', name: 'Suction Bulb', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 5000, sellPrice: 10000, minStock: 10, description: 'Bulb suction untuk bersihkan jalan napas' },

    // ═══════════════════════════════════════════════════════════
    // LAB & DIAGNOSTIC CONSUMABLES
    // ═══════════════════════════════════════════════════════════
    { id: 'blood_culture_bottle', name: 'Botol Kultur Darah', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 20000, sellPrice: 35000, minStock: 10, description: 'Botol kultur darah aerob/anaerob' },
    { id: 'cotton_bud_steril', name: 'Cotton Bud Steril', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 500, sellPrice: 1000, minStock: 50, description: 'Swab kapas steril' },
    { id: 'wadah_steril', name: 'Wadah Steril (Specimen)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 2000, sellPrice: 4000, minStock: 30, description: 'Wadah steril untuk spesimen' },
    { id: 'lakmus_strip', name: 'Lakmus Strip (pH)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 500, sellPrice: 1000, minStock: 30, description: 'Strip kertas lakmus pH' },
    { id: 'ecg_electrode', name: 'ECG Electrode (Disposable)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 1500, sellPrice: 3000, minStock: 30, description: 'Elektroda ECG sekali pakai' },
    { id: 'fluorescein_strip', name: 'Fluorescein Strip', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 3000, sellPrice: 6000, minStock: 10, description: 'Strip fluorescein untuk pemeriksaan mata' },
    { id: 'disposable_mouthpiece', name: 'Mouthpiece Spirometer (Disposable)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 2000, sellPrice: 4000, minStock: 20, description: 'Mouthpiece spirometer sekali pakai' },
    { id: 'neonatal_vvm', name: 'Neonatal VVM (Vaccine Vial Monitor)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 1000, sellPrice: 2000, minStock: 20, description: 'Monitor vial vaksin neonatal' },
    { id: 'mmse_form', name: 'Formulir MMSE', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 500, sellPrice: 500, minStock: 20, description: 'Form Mini Mental State Examination' },
    { id: 'form_visum', name: 'Formulir Visum et Repertum', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 500, sellPrice: 500, minStock: 10, description: 'Formulir visum medikolegal' },

    // ═══════════════════════════════════════════════════════════
    // OBSTETRIC & SURGICAL CONSUMABLES
    // ═══════════════════════════════════════════════════════════
    { id: 'partus_set', name: 'Partus Set (Disposable)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 45000, sellPrice: 75000, minStock: 5, description: 'Set partus disposable lengkap' },
    { id: 'selimut', name: 'Selimut (Disposable)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 5000, sellPrice: 10000, minStock: 10, description: 'Selimut disposable untuk pasien' },
    { id: 'kuret', name: 'Kuret (Disposable)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 20000, sellPrice: 35000, minStock: 5, description: 'Kuret disposable untuk dermatologi' },
    { id: 'nit_comb', name: 'Sisir Serit (Nit Comb)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 3000, sellPrice: 5000, minStock: 10, description: 'Sisir serit untuk pediculosis' },

    // ═══════════════════════════════════════════════════════════
    // MISC CONSUMABLES
    // ═══════════════════════════════════════════════════════════
    { id: 'stationery', name: 'Alat Tulis Medis', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 1000, sellPrice: 1000, minStock: 50, description: 'Alat tulis untuk dokumentasi' },
    { id: 'liquid_nitrogen', name: 'Nitrogen Cair (Cryotherapy)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 25000, sellPrice: 40000, minStock: 5, description: 'Nitrogen cair untuk krioterapi' },

    // Codex Batch 6 fix: missing SKUs referenced by EmergencyRegistry / ProceduresDB
    { id: 'spuit_10cc', name: 'Spuit 10cc', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 2000, sellPrice: 4000, minStock: 50, description: 'Syringe 10ml untuk injeksi/aspirasi' },
    { id: 'reagen_gds', name: 'Reagen Strip GDS (Glucotest)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 3000, sellPrice: 5000, minStock: 100, description: 'Strip reagen cek gula darah sewaktu' },
    { id: 'bidai_set', name: 'Bidai Set (Emergency Splint)', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 15000, sellPrice: 25000, minStock: 10, description: 'Bidai untuk fraktur — alias splint_set' },
    { id: 'kateter_foley', name: 'Kateter Foley', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 18000, sellPrice: 30000, minStock: 10, description: 'Kateter urin Foley — alias folley_catheter' },

    // ═══════════════════════════════════════════════════════════
    // EQUIPMENT (form: 'equipment') — NOT deducted from stock
    // These are permanent Puskesmas assets, tracked for availability only
    // ═══════════════════════════════════════════════════════════
    { id: 'otoscope', name: 'Otoskop', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Alat periksa telinga' },
    { id: 'penlight', name: 'Penlight', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Senter medis untuk pemeriksaan' },
    { id: 'timbangan', name: 'Timbangan Badan', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Timbangan berat badan' },
    { id: 'pengukur_tinggi', name: 'Alat Ukur Tinggi Badan', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Stadiometer' },
    { id: 'pita_ukur', name: 'Pita Ukur (Meteran)', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Pita ukur antropometri' },
    { id: 'snellen_chart', name: 'Snellen Chart', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Kartu Snellen untuk visus' },
    { id: 'jaeger_chart', name: 'Jaeger Chart', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Kartu Jaeger untuk visus dekat' },
    { id: 'trial_lens_set', name: 'Trial Lens Set', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Set lensa coba untuk refraksi' },
    { id: 'keratometer', name: 'Keratometer', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Alat ukur kornea' },
    { id: 'spirometer', name: 'Spirometer', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Alat fungsi paru' },
    { id: 'glucometer', name: 'Glucometer', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Alat cek gula darah' },
    { id: 'doppler', name: 'Doppler (Fetal/Vaskular)', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Doppler untuk deteksi DJJ/vaskular' },
    { id: 'rontgen_machine', name: 'Mesin Rontgen', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Mesin X-Ray' },
    { id: 'usg_machine', name: 'Mesin USG', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Ultrasonografi' },
    { id: 'garpu_tala', name: 'Garpu Tala', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Garpu tala untuk tes pendengaran' },
    { id: 'monofilament', name: 'Monofilament 10g', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Monofilament untuk tes neuropati DM' },
    { id: 'spekulum', name: 'Spekulum Vagina', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Spekulum untuk pemeriksaan ginekologi' },
    { id: 'pinset', name: 'Pinset Anatomis/Chirurgis', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Pinset untuk prosedur minor' },
    { id: 'ring_forceps', name: 'Ring Forceps', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Forceps cincin untuk tampon/IUD' },
    { id: 'alligator_forceps', name: 'Alligator Forceps', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Forceps aligator untuk ekstraksi benda asing THT' },
    { id: 'ear_hook', name: 'Ear Hook', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Hook telinga untuk ekstraksi serumen' },
    { id: 'kamera', name: 'Kamera Dokumentasi', category: 'Peralatan Medis', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Kamera untuk dokumentasi klinis' },

    // Items that need special handling
    { id: 'air_mengalir', name: 'Air Mengalir (Cuci Tangan)', category: 'Alat Kesehatan Habis Pakai', form: 'equipment', buyPrice: 0, sellPrice: 0, minStock: 1, description: 'Fasilitas air mengalir — selalu tersedia' },
    { id: 'sabun', name: 'Sabun Cuci Tangan', category: 'Alat Kesehatan Habis Pakai', form: 'consumable', buyPrice: 2000, sellPrice: 3000, minStock: 20, description: 'Sabun antiseptik' },
];
