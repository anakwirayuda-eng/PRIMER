/**
 * APPLY PHASE 6 UPDATES TO MEDICATION DATABASE
 * Run with: node apply_phase6.mjs
 */

import fs from 'fs';

const dbPath = './src/data/MedicationDatabase.js';
let content = fs.readFileSync(dbPath, 'utf8');

console.log('=== APPLYING PHASE 6 UPDATES ===\n');

// 1. FIX CATEGORY: betamethasone_cream (SUPPLEMENT -> DERMATOLOGY)
content = content.replace(
    /id: 'betamethasone_cream',\s*\n\s*name: 'Betamethasone Cream 0\.1%',\s*\n\s*category: MEDICATION_CATEGORIES\.SUPPLEMENT,/,
    `id: 'betamethasone_cream',
        name: 'Betamethasone Cream 0.1%',
        category: MEDICATION_CATEGORIES.DERMATOLOGY,`
);
console.log('✓ Fixed: betamethasone_cream -> DERMATOLOGY');

// 2. FIX CATEGORY: chloramphenicol_eo (SUPPLEMENT -> ENT_EYE)
content = content.replace(
    /id: 'chloramphenicol_eo',\s*\n\s*name: 'Chloramphenicol Eye Ointment 1%',\s*\n\s*category: MEDICATION_CATEGORIES\.SUPPLEMENT,/,
    `id: 'chloramphenicol_eo',
        name: 'Chloramphenicol Eye Ointment 1%',
        category: MEDICATION_CATEGORIES.ENT_EYE,`
);
console.log('✓ Fixed: chloramphenicol_eo -> ENT_EYE');

// 3. FIX CATEGORY: gentamicin_cream (SUPPLEMENT -> DERMATOLOGY)
content = content.replace(
    /id: 'gentamicin_cream',\s*\n\s*name: 'Gentamicin Cream 0\.1%',\s*\n\s*category: MEDICATION_CATEGORIES\.SUPPLEMENT,/,
    `id: 'gentamicin_cream',
        name: 'Gentamicin Cream 0.1%',
        category: MEDICATION_CATEGORIES.DERMATOLOGY,`
);
console.log('✓ Fixed: gentamicin_cream -> DERMATOLOGY');

// 4. FIX CATEGORY: salep_24 (SUPPLEMENT -> DERMATOLOGY)
content = content.replace(
    /id: 'salep_24',\s*\n\s*name: 'Salep 2-4 \(Sulfur\)',\s*\n\s*category: MEDICATION_CATEGORIES\.SUPPLEMENT,/,
    `id: 'salep_24',
        name: 'Salep 2-4 (Sulfur)',
        category: MEDICATION_CATEGORIES.DERMATOLOGY,`
);
console.log('✓ Fixed: salep_24 -> DERMATOLOGY');

// 5. FIX CATEGORY: tretinoin_cream (SUPPLEMENT -> DERMATOLOGY)
content = content.replace(
    /id: 'tretinoin_cream',\s*\n\s*name: 'Tretinoin Cream 0\.025%',\s*\n\s*category: MEDICATION_CATEGORIES\.SUPPLEMENT,/,
    `id: 'tretinoin_cream',
        name: 'Tretinoin Cream 0.025%',
        category: MEDICATION_CATEGORIES.DERMATOLOGY,`
);
console.log('✓ Fixed: tretinoin_cream -> DERMATOLOGY');

// 6. FIX CATEGORY: urea_cream (SUPPLEMENT -> DERMATOLOGY)
content = content.replace(
    /id: 'urea_cream',\s*\n\s*name: 'Urea Cream 10%',\s*\n\s*category: MEDICATION_CATEGORIES\.SUPPLEMENT,/,
    `id: 'urea_cream',
        name: 'Urea Cream 10%',
        category: MEDICATION_CATEGORIES.DERMATOLOGY,`
);
console.log('✓ Fixed: urea_cream -> DERMATOLOGY');

// 7. REMOVE DUPLICATE: sulfas_ferosus (keep sulfas_ferrosus)
// Match the entire object block
const sulfasFerosusPattern = /\{\s*id: 'sulfas_ferosus',[\s\S]*?description: 'Sulfas Ferosus \(Fe\) Tab'\s*\},?\s*/;
if (sulfasFerosusPattern.test(content)) {
    content = content.replace(sulfasFerosusPattern, '');
    console.log('✓ Removed duplicate: sulfas_ferosus');
} else {
    console.log('⚠ Could not find sulfas_ferosus to remove');
}

// 8. ADD NEW ENTRIES before the closing ];
const newEntries = `
    // === PHASE 6: NEW MEDICATIONS ===

    // --- RESPIRATORY ---
    {
        id: 'dextromethorphan_15',
        name: 'Dextromethorphan (DMP) 15mg',
        category: MEDICATION_CATEGORIES.RESPIRATORY,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 500,
        sellPrice: 800,
        igdPrice: null,
        minStock: 200,
        maxStock: 2000,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['batuk_kering', 'antitusif'],
        description: 'Antitusif non-narkotik untuk batuk kering'
    },
    {
        id: 'dextromethorphan_syr',
        name: 'Dextromethorphan Sirup 10mg/5ml',
        category: MEDICATION_CATEGORIES.RESPIRATORY,
        type: 'botol',
        form: 'syrup',
        fornas: true,
        unitPrice: 8500,
        sellPrice: 13000,
        igdPrice: null,
        minStock: 100,
        maxStock: 1000,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['batuk_kering_pediatric'],
        description: 'Sirup antitusif untuk anak'
    },
    {
        id: 'ephedrine_25',
        name: 'Efedrin HCL 25mg',
        category: MEDICATION_CATEGORIES.RESPIRATORY,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 800,
        sellPrice: 1200,
        igdPrice: null,
        minStock: 100,
        maxStock: 1000,
        supplier: 'dinkes',
        leadTime: 7,
        indication: ['bronkospasme', 'hipotensi'],
        description: 'Simpatomimetik untuk bronkospasme dan hipotensi'
    },

    // --- ANALGESIC ---
    {
        id: 'tramadol_50',
        name: 'Tramadol 50mg',
        category: MEDICATION_CATEGORIES.ANALGESIC,
        type: 'kapsul',
        form: 'capsule',
        fornas: true,
        unitPrice: 1500,
        sellPrice: 2500,
        igdPrice: 5000,
        minStock: 50,
        maxStock: 500,
        supplier: 'dinkes',
        leadTime: 7,
        indication: ['nyeri_sedang_berat'],
        description: 'Analgesik opioid lemah untuk nyeri sedang-berat'
    },

    // --- GASTROINTESTINAL ---
    {
        id: 'hyoscine_10',
        name: 'Hyoscine Butylbromide (Buscopan) 10mg',
        category: MEDICATION_CATEGORIES.GASTROINTESTINAL,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 1200,
        sellPrice: 2000,
        igdPrice: 4000,
        minStock: 100,
        maxStock: 1000,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['kolik', 'spasme_gi', 'dismenore'],
        description: 'Antispasmodik untuk kolik dan kram perut'
    },

    // --- PSYCHIATRY & NEUROLOGY ---
    {
        id: 'clobazam_10',
        name: 'Clobazam 10mg',
        category: MEDICATION_CATEGORIES.PSYCHIATRY_NEURO,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 2500,
        sellPrice: 4000,
        igdPrice: null,
        minStock: 50,
        maxStock: 500,
        supplier: 'dinkes',
        leadTime: 7,
        indication: ['epilepsi_adjuvan', 'ansietas'],
        description: 'Benzodiazepin untuk terapi tambahan epilepsi'
    },
    {
        id: 'phenobarbital_30',
        name: 'Phenobarbital 30mg',
        category: MEDICATION_CATEGORIES.PSYCHIATRY_NEURO,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 600,
        sellPrice: 1000,
        igdPrice: null,
        minStock: 100,
        maxStock: 1000,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['epilepsi', 'kejang_demam'],
        description: 'Antikonvulsan barbiturat untuk epilepsi dan kejang'
    },

    // --- DERMATOLOGY ---
    {
        id: 'gentian_violet_1',
        name: 'Gentian Violet 1%',
        category: MEDICATION_CATEGORIES.DERMATOLOGY,
        type: 'botol',
        form: 'solution',
        fornas: true,
        unitPrice: 3000,
        sellPrice: 5000,
        igdPrice: null,
        minStock: 50,
        maxStock: 500,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['candidiasis_oral', 'tinea', 'antiseptik'],
        description: 'Antiseptik dan antijamur topikal klasik'
    },

    // --- ANTIHELMINTHIC ---
    {
        id: 'pyrantel_125',
        name: 'Pyrantel Pamoate 125mg',
        category: MEDICATION_CATEGORIES.ANTIBIOTIC,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 800,
        sellPrice: 1500,
        igdPrice: null,
        minStock: 100,
        maxStock: 1000,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['ascariasis', 'enterobiasis', 'cacing_kremi'],
        description: 'Antelmintik untuk infeksi cacing gelang dan kremi'
    },

    // --- VITAMINS ---
    {
        id: 'neurobion_combo',
        name: 'Vitamin B1-B6-B12 Kombinasi',
        category: MEDICATION_CATEGORIES.SUPPLEMENT,
        type: 'tablet',
        form: 'tablet',
        fornas: false,
        unitPrice: 1500,
        sellPrice: 2500,
        igdPrice: null,
        minStock: 200,
        maxStock: 2000,
        supplier: 'vendor_swasta',
        leadTime: 5,
        indication: ['neuropati', 'defisiensi_b'],
        description: 'Kombinasi vitamin neurotropik untuk neuropati'
    },

    // === PHASE 6: EMERGENCY EQUIPMENT ===
    {
        id: 'o2_tank_portable',
        name: 'Tabung Oksigen Portabel 1L',
        category: MEDICATION_CATEGORIES.EMERGENCY,
        type: 'unit',
        form: 'equipment',
        fornas: false,
        unitPrice: 350000,
        sellPrice: 0,
        igdPrice: 50000,
        minStock: 3,
        maxStock: 10,
        supplier: 'vendor_swasta',
        leadTime: 14,
        indication: ['hipoksia', 'sesak_napas', 'resusitasi'],
        description: 'Tabung oksigen portabel untuk emergensi'
    },
    {
        id: 'o2_regulator',
        name: 'Regulator Oksigen',
        category: MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT,
        type: 'unit',
        form: 'equipment',
        fornas: false,
        unitPrice: 150000,
        sellPrice: 0,
        igdPrice: 15000,
        minStock: 2,
        maxStock: 5,
        supplier: 'vendor_swasta',
        leadTime: 14,
        indication: ['delivery_o2'],
        description: 'Regulator untuk mengatur aliran oksigen'
    },
    {
        id: 'nasal_cannula',
        name: 'Nasal Cannula (Nasal Prong)',
        category: MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT,
        type: 'unit',
        form: 'disposable',
        fornas: true,
        unitPrice: 5000,
        sellPrice: 8000,
        igdPrice: 15000,
        minStock: 50,
        maxStock: 200,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['terapi_o2_low_flow'],
        description: 'Kanul hidung untuk terapi oksigen 1-6 L/menit'
    },
    {
        id: 'simple_o2_mask',
        name: 'Simple Oxygen Mask',
        category: MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT,
        type: 'unit',
        form: 'disposable',
        fornas: true,
        unitPrice: 8000,
        sellPrice: 12000,
        igdPrice: 20000,
        minStock: 30,
        maxStock: 100,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['terapi_o2_medium_flow'],
        description: 'Masker oksigen sederhana untuk 5-10 L/menit'
    },
    {
        id: 'nrb_mask',
        name: 'Non-Rebreather Mask (NRB)',
        category: MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT,
        type: 'unit',
        form: 'disposable',
        fornas: true,
        unitPrice: 15000,
        sellPrice: 25000,
        igdPrice: 40000,
        minStock: 20,
        maxStock: 50,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['terapi_o2_high_flow', 'hipoksia_berat'],
        description: 'Masker NRB untuk terapi oksigen 10-15 L/menit'
    },
    {
        id: 'ambu_bag',
        name: 'Ambu Bag (BVM) Dewasa',
        category: MEDICATION_CATEGORIES.EMERGENCY,
        type: 'unit',
        form: 'equipment',
        fornas: true,
        unitPrice: 250000,
        sellPrice: 0,
        igdPrice: 35000,
        minStock: 2,
        maxStock: 5,
        supplier: 'dinkes',
        leadTime: 10,
        indication: ['resusitasi', 'ventilasi_manual'],
        description: 'Bag-Valve-Mask untuk ventilasi manual darurat'
    },
    {
        id: 'suction_catheter',
        name: 'Suction Catheter',
        category: MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT,
        type: 'unit',
        form: 'disposable',
        fornas: true,
        unitPrice: 3500,
        sellPrice: 6000,
        igdPrice: 10000,
        minStock: 30,
        maxStock: 100,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['suction_airway'],
        description: 'Kateter hisap untuk membersihkan jalan napas'
    },
`;

// Insert before the closing ];
content = content.replace(/\n\];\s*\n\n\/\/ Backward compatibility/, newEntries + '\n];\n\n// Backward compatibility');
console.log('✓ Added 17 new entries (10 medications + 7 equipment)');

// Write back
fs.writeFileSync(dbPath, content);
console.log('\n=== DATABASE UPDATED SUCCESSFULLY ===');
console.log('Run: node deep_audit.mjs to verify the changes');
