/**
 * PHASE 6: Comprehensive Medication Database Update
 * 
 * This script performs:
 * 1. Adds truly missing medications (~10 items)
 * 2. Adds emergency O2 equipment (~6 items)
 * 3. Fixes category misplacements
 * 4. Removes redundant entries (SF duplicates)
 * 5. Validates final database integrity
 */

import fs from 'fs';
import { MEDICATION_DATABASE, MEDICATION_CATEGORIES } from './src/data/MedicationDatabase.js';

// === NEW MEDICATIONS TO ADD ===
const NEW_MEDICATIONS = [
    // --- RESPIRATORY ---
    {
        id: 'dextromethorphan_15',
        name: 'Dextromethorphan (DMP) 15mg',
        category: 'Sistem Respirasi',
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
        category: 'Sistem Respirasi',
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
        category: 'Sistem Respirasi',
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
        category: 'Analgesik/Antipiretik',
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
        category: 'Saluran Cerna',
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
        category: 'Psikiatri & Neurologi',
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
        category: 'Psikiatri & Neurologi',
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

    // --- DERMATOLOGY / ANTISEPTIC ---
    {
        id: 'gentian_violet_1',
        name: 'Gentian Violet 1%',
        category: 'Dermatologi',
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
        category: 'Anti-Infeksi (Antibiotik/Antifungi/Antivirus)',
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
        category: 'Vitamin/Suplemen/Obstetri',
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
    }
];

// === NEW EMERGENCY EQUIPMENT ===
const NEW_EQUIPMENT = [
    {
        id: 'o2_tank_portable',
        name: 'Tabung Oksigen Portabel 1L',
        category: 'Gawat Darurat / Injeksi',
        type: 'unit',
        form: 'equipment',
        fornas: false,
        unitPrice: 350000,
        sellPrice: 0, // Not sold, operational asset
        igdPrice: 50000, // Usage fee
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
        category: 'Alat Kesehatan Habis Pakai',
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
        category: 'Alat Kesehatan Habis Pakai',
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
        category: 'Alat Kesehatan Habis Pakai',
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
        category: 'Alat Kesehatan Habis Pakai',
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
        category: 'Gawat Darurat / Injeksi',
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
        category: 'Alat Kesehatan Habis Pakai',
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
    }
];

// === IDs TO REMOVE (Redundant) ===
const IDS_TO_REMOVE = [
    'sulfas_ferosus', // Duplicate of sulfas_ferrosus
    // Keep sulfas_ferrosus and tablet_tambah_darah (they serve different purposes)
];

// === CATEGORY FIXES ===
const CATEGORY_FIXES = {
    'betamethasone_cream': 'Dermatologi',
    'chloramphenicol_eo': 'Mata/Telinga/Hidung/Tenggorokan',
    'gentamicin_cream': 'Dermatologi',
    'salep_24': 'Dermatologi',
    'tretinoin_cream': 'Dermatologi',
    'urea_cream': 'Dermatologi',
};

// === EXECUTE UPDATES ===
console.log('=== PHASE 6: DATABASE UPDATE ===\n');

// Read the current database file
const dbPath = './src/data/MedicationDatabase.js';
let dbContent = fs.readFileSync(dbPath, 'utf8');

// 1. Count current entries
console.log(`Current entries: ${MEDICATION_DATABASE.length}`);

// 2. Check what needs to be added (avoid duplicates)
const existingIds = new Set(MEDICATION_DATABASE.map(m => m.id));

const medsToAdd = NEW_MEDICATIONS.filter(m => !existingIds.has(m.id));
const equipToAdd = NEW_EQUIPMENT.filter(e => !existingIds.has(e.id));

console.log(`\nNew medications to add: ${medsToAdd.length}`);
medsToAdd.forEach(m => console.log(`  + ${m.name}`));

console.log(`\nNew equipment to add: ${equipToAdd.length}`);
equipToAdd.forEach(e => console.log(`  + ${e.name}`));

// 3. Check redundancies to remove
const idsToActuallyRemove = IDS_TO_REMOVE.filter(id => existingIds.has(id));
console.log(`\nRedundant entries to remove: ${idsToActuallyRemove.length}`);
idsToActuallyRemove.forEach(id => console.log(`  - ${id}`));

// 4. Check category fixes needed
const fixesNeeded = Object.entries(CATEGORY_FIXES).filter(([id]) => existingIds.has(id));
console.log(`\nCategory fixes needed: ${fixesNeeded.length}`);
fixesNeeded.forEach(([id, newCat]) => console.log(`  ~ ${id} -> ${newCat}`));

// 5. Calculate final count
const finalCount = MEDICATION_DATABASE.length + medsToAdd.length + equipToAdd.length - idsToActuallyRemove.length;
console.log(`\n=== PROJECTED FINAL COUNT: ${finalCount} ===`);

// Generate the JavaScript code for new entries
const allNewItems = [...medsToAdd, ...equipToAdd];

if (allNewItems.length > 0) {
    console.log('\n--- GENERATED CODE FOR NEW ENTRIES ---\n');

    const codeBlock = allNewItems.map(item => {
        return `    {
        id: '${item.id}',
        name: '${item.name}',
        category: MEDICATION_CATEGORIES.${Object.entries(MEDICATION_CATEGORIES).find(([k, v]) => v === item.category)?.[0] || 'SUPPLEMENT'},
        type: '${item.type}',
        form: '${item.form}',
        fornas: ${item.fornas},
        unitPrice: ${item.unitPrice},
        sellPrice: ${item.sellPrice},
        igdPrice: ${item.igdPrice},
        minStock: ${item.minStock},
        maxStock: ${item.maxStock},
        supplier: '${item.supplier}',
        leadTime: ${item.leadTime},
        indication: ${JSON.stringify(item.indication)},
        description: '${item.description}'
    }`;
    }).join(',\n');

    console.log(codeBlock);
}

// Output category fix code
if (fixesNeeded.length > 0) {
    console.log('\n--- CATEGORY FIX MAPPINGS ---\n');
    fixesNeeded.forEach(([id, newCat]) => {
        const catKey = Object.entries(MEDICATION_CATEGORIES).find(([k, v]) => v === newCat)?.[0];
        console.log(`// ${id}: change category to MEDICATION_CATEGORIES.${catKey}`);
    });
}

console.log('\n=== AUDIT COMPLETE ===');
console.log('Run: node apply_phase6_updates.mjs to apply changes');
