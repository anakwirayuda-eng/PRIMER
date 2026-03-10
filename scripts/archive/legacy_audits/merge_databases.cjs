/**
 * MERGE SCRIPT: Unify MedicationDB.js + MedicationDatabase.js + EmergencyCases.js
 * into a single MedicationDatabase_UNIFIED.js
 * 
 * Strategy:
 * - Base: MedicationDatabase.js (inventory data: unitPrice, minStock, maxStock, supplier, leadTime)
 * - Enrich from MedicationDB.js (clinical data: form, indication, sellPrice=cost)
 * - Enrich from EmergencyCases.js (IGD data: igdPrice=cost)
 * - Items only in Clinical: Create new entry with estimated inventory fields
 * - Items only in Inventory: Keep as-is (BHP/Alkes)
 */
const fs = require('fs');

// ===== PARSE MedicationDB.js (Clinical) =====
const medDBRaw = fs.readFileSync('./src/data/MedicationDB.js', 'utf8');
const clinicalItems = [];
const clinRegex = /\{\s*id:\s*'([^']+)'[^}]+\}/g;
let m;
while ((m = clinRegex.exec(medDBRaw)) !== null) {
    const block = m[0];
    const id = m[1];
    const name = (block.match(/name:\s*'([^']+)'/) || [])[1] || id;
    const category = (block.match(/category:\s*'([^']+)'/) || [])[1] || 'unknown';
    const form = (block.match(/form:\s*'([^']+)'/) || [])[1] || 'tablet';
    const cost = parseInt((block.match(/cost:\s*(\d+)/) || [])[1] || '0');

    // Parse indication array
    const indMatch = block.match(/indication:\s*\[([^\]]*)\]/);
    let indication = [];
    if (indMatch) {
        indication = [...indMatch[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    }

    clinicalItems.push({ id, name, category, form, indication, sellPrice: cost });
}

// ===== PARSE MedicationDatabase.js (Inventory) =====
const medDataRaw = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');
const inventoryItems = [];

// Use \r?\n to handle both Unix and Windows line endings
const invSectionStart = medDataRaw.indexOf('export const MEDICATION_DATABASE = [');
const invSectionEnd = medDataRaw.indexOf('];', invSectionStart + 100);
const invSection = medDataRaw.substring(invSectionStart, invSectionEnd);
const invEntries = invSection.split(/\},\s*\r?\n/);
for (const entry of invEntries) {
    const idMatch = entry.match(/id:\s*'([^']+)'/);
    if (!idMatch) continue;
    const id = idMatch[1];
    const name = (entry.match(/name:\s*'([^']+)'/) || [])[1] || id;
    const category = (entry.match(/category:\s*MEDICATION_CATEGORIES\.(\w+)/) || [])[1] || 'UNKNOWN';
    const type = (entry.match(/type:\s*'([^']+)'/) || [])[1] || 'tablet';
    const fornas = entry.includes('fornas: true');
    const unitPrice = parseInt((entry.match(/unitPrice:\s*(\d+)/) || [])[1] || '0');
    const minStock = parseInt((entry.match(/minStock:\s*(\d+)/) || [])[1] || '100');
    const maxStock = parseInt((entry.match(/maxStock:\s*(\d+)/) || [])[1] || '1000');
    const supplier = (entry.match(/supplier:\s*'([^']+)'/) || [])[1] || 'dinkes';
    const leadTime = parseInt((entry.match(/leadTime:\s*(\d+)/) || [])[1] || '5');
    const description = (entry.match(/description:\s*'([^']+)'/) || [])[1] || '';

    inventoryItems.push({ id, name, category, type, fornas, unitPrice, minStock, maxStock, supplier, leadTime, description });
}

// ===== PARSE EmergencyCases.js (IGD prices) =====
const emergRaw = fs.readFileSync('./src/game/EmergencyCases.js', 'utf8');
const igdPrices = {};
const eaStart = emergRaw.indexOf('export const EMERGENCY_ACTIONS = {');
const eaEnd = emergRaw.indexOf('};', eaStart);
const eaSection = emergRaw.substring(eaStart, eaEnd + 2);
const eaLines = eaSection.split(/\r?\n/);
for (const line of eaLines) {
    const idMatch = line.match(/id:\s*'([^']+)'/);
    const costMatch = line.match(/cost:\s*(\d+)/);
    if (idMatch && costMatch) {
        igdPrices[idMatch[1]] = parseInt(costMatch[1]);
    }
}

// ===== BUILD UNIFIED MAP =====
const unified = new Map();

// 1. Start with inventory items (they have the richest metadata)
for (const inv of inventoryItems) {
    unified.set(inv.id, {
        id: inv.id,
        name: inv.name,
        inventoryCategory: inv.category,
        type: inv.type,
        fornas: inv.fornas,
        unitPrice: inv.unitPrice,
        sellPrice: null, // will be filled from clinical
        igdPrice: null,  // will be filled from IGD
        minStock: inv.minStock,
        maxStock: inv.maxStock,
        supplier: inv.supplier,
        leadTime: inv.leadTime,
        description: inv.description,
        form: inv.type, // default to inventory type
        indication: [],
        source: 'inventory'
    });
}

// 2. Merge clinical data
for (const clin of clinicalItems) {
    if (unified.has(clin.id)) {
        // Exists in inventory — enrich
        const existing = unified.get(clin.id);
        existing.sellPrice = clin.sellPrice;
        existing.form = clin.form || existing.form;
        existing.indication = clin.indication;
        existing.source = 'both';
    } else {
        // Clinical only — create new entry with estimated inventory fields
        const estUnitPrice = Math.round(clin.sellPrice * 0.65); // ~65% of sell price
        unified.set(clin.id, {
            id: clin.id,
            name: clin.name,
            inventoryCategory: mapClinicalToInventoryCategory(clin.category),
            type: mapFormToType(clin.form),
            fornas: true,
            unitPrice: estUnitPrice,
            sellPrice: clin.sellPrice,
            igdPrice: null,
            minStock: estimateMinStock(clin.category),
            maxStock: estimateMinStock(clin.category) * 10,
            supplier: 'dinkes',
            leadTime: estimateLeadTime(clin.category),
            description: clin.name,
            form: clin.form,
            indication: clin.indication,
            source: 'clinical_only'
        });
    }
}

// 3. Merge IGD prices
for (const [id, price] of Object.entries(igdPrices)) {
    if (unified.has(id)) {
        unified.get(id).igdPrice = price;
    }
    // Note: IGD-only procedural actions (iv_line, suturing, etc.) are NOT medications
    // They stay in EMERGENCY_ACTIONS — they're procedures, not inventory items
}

// 4. PRICE NORMALIZATION — ensure logical pricing hierarchy
// Rule: unitPrice (buy) < sellPrice (poli) < igdPrice (igd)
let priceFixCount = 0;
for (const item of unified.values()) {
    // If sell price is lower than buy price, use buy price * 1.2 as minimum sell
    if (item.sellPrice !== null && item.unitPrice > 0 && item.sellPrice < item.unitPrice) {
        item.sellPrice = Math.round(item.unitPrice * 1.2);
        priceFixCount++;
    }
    // If sell price is null (inventory-only BHP), estimate at unitPrice * 1.5
    if (item.sellPrice === null && item.unitPrice > 0) {
        item.sellPrice = Math.round(item.unitPrice * 1.5);
    }
    // If igdPrice exists but is lower than sellPrice, fix it
    if (item.igdPrice !== null && item.igdPrice < item.sellPrice) {
        item.igdPrice = Math.round(item.sellPrice * 1.3);
    }
}
console.log(`Price fixes applied: ${priceFixCount} items (sellPrice was < unitPrice)`);


// ===== HELPER FUNCTIONS =====
function mapClinicalToInventoryCategory(clinCat) {
    const map = {
        'analgesic': 'ANALGESIC', 'nsaid': 'ANALGESIC',
        'antibiotic': 'ANTIBIOTIC', 'antifungal': 'ANTIBIOTIC', 'antiviral': 'ANTIBIOTIC',
        'antiparasitic': 'ANTIBIOTIC', 'antihelminthic': 'ANTIBIOTIC', 'antimalarial': 'ANTIBIOTIC',
        'anti_leprosy': 'ANTIBIOTIC', 'anti_tb': 'ANTIBIOTIC',
        'antihypertensive': 'ANTIHYPERTENSIVE', 'cardiovascular': 'ANTIHYPERTENSIVE',
        'antiplatelet': 'ANTIHYPERTENSIVE', 'lipid_lowering': 'ANTIHYPERTENSIVE',
        'antidiabetic': 'ANTIDIABETIC',
        'respiratory': 'RESPIRATORY', 'antitussive': 'RESPIRATORY', 'mucolytic': 'RESPIRATORY',
        'bronchodilator': 'RESPIRATORY', 'antihistamine': 'RESPIRATORY', 'decongestant': 'RESPIRATORY',
        'gastrointestinal': 'GASTROINTESTINAL', 'antiemetic': 'GASTROINTESTINAL',
        'antidiarrheal': 'GASTROINTESTINAL', 'antacid': 'GASTROINTESTINAL', 'laxative': 'GASTROINTESTINAL',
        'hepatoprotector': 'GASTROINTESTINAL', 'ppi': 'GASTROINTESTINAL',
        'dermatology': 'DERMATOLOGY', 'topical_antifungal': 'DERMATOLOGY',
        'topical_antibiotic': 'DERMATOLOGY', 'topical_steroid': 'DERMATOLOGY',
        'supplement': 'SUPPLEMENT', 'vitamin': 'SUPPLEMENT', 'mineral': 'SUPPLEMENT',
        'iron_supplement': 'SUPPLEMENT',
        'psychiatry': 'PSYCHIATRY_NEURO', 'neuro': 'PSYCHIATRY_NEURO',
        'antiepileptic': 'PSYCHIATRY_NEURO', 'antipsychotic': 'PSYCHIATRY_NEURO',
        'antidepressant': 'PSYCHIATRY_NEURO', 'anxiolytic': 'PSYCHIATRY_NEURO',
        'ophthalmic': 'ENT_EYE', 'ent': 'ENT_EYE', 'ear': 'ENT_EYE',
        'corticosteroid': 'EMERGENCY', 'emergency': 'EMERGENCY',
        'device': 'MEDICAL_EQUIPMENT', 'nutrition': 'SUPPLEMENT',
        'obstetric': 'SUPPLEMENT', 'contraceptive': 'SUPPLEMENT',
        'urology': 'GASTROINTESTINAL',
        'antihyperuricemic': 'ANALGESIC',
        'thyroid': 'ANTIDIABETIC',
    };
    return map[clinCat] || 'SUPPLEMENT';
}

function mapFormToType(form) {
    const map = {
        'tablet': 'tablet', 'capsule': 'kapsul', 'syrup': 'botol',
        'drop': 'botol', 'cream': 'tube', 'ointment': 'tube',
        'injection': 'ampul', 'inhaler': 'unit', 'suppository': 'unit',
        'lotion': 'bottle', 'shampoo': 'bottle', 'gel': 'tube',
        'powder': 'sachet', 'suspension': 'botol', 'spray': 'unit',
        'patch': 'unit', 'sachet': 'sachet', 'solution': 'botol',
        'ear_drops': 'botol', 'eye_drops': 'botol', 'eye_ointment': 'tube',
        'nasal_spray': 'unit', 'pessary': 'unit', 'implant': 'unit',
        'plaster': 'unit', 'nebulizer': 'unit', 'mdi': 'unit',
    };
    return map[form] || 'tablet';
}

function estimateMinStock(category) {
    const high = ['analgesic', 'nsaid', 'antibiotic', 'vitamin', 'supplement', 'antihistamine', 'mucolytic'];
    const medium = ['antihypertensive', 'antidiabetic', 'gastrointestinal', 'respiratory'];
    if (high.includes(category)) return 300;
    if (medium.includes(category)) return 200;
    return 100;
}

function estimateLeadTime(category) {
    if (['emergency', 'corticosteroid'].includes(category)) return 3;
    if (['antibiotic', 'anti_tb', 'antimalarial', 'anti_leprosy'].includes(category)) return 7;
    return 5;
}

// ===== STATS =====
const items = [...unified.values()];
const bothCount = items.filter(i => i.source === 'both').length;
const clinOnlyCount = items.filter(i => i.source === 'clinical_only').length;
const invOnlyCount = items.filter(i => i.source === 'inventory').length;
const withIgd = items.filter(i => i.igdPrice !== null).length;

console.log('=== MERGE RESULTS ===');
console.log(`Total unified items: ${items.length}`);
console.log(`  In both DBs: ${bothCount}`);
console.log(`  Clinical-only (new inventory): ${clinOnlyCount}`);
console.log(`  Inventory-only (BHP/Alkes): ${invOnlyCount}`);
console.log(`  With IGD price: ${withIgd}`);

// ===== GENERATE OUTPUT =====
// Group items by inventoryCategory
const groups = {};
for (const item of items) {
    if (!groups[item.inventoryCategory]) groups[item.inventoryCategory] = [];
    groups[item.inventoryCategory].push(item);
}

// Sort groups
const categoryOrder = ['ANALGESIC', 'ANTIBIOTIC', 'ANTIHYPERTENSIVE', 'ANTIDIABETIC',
    'RESPIRATORY', 'GASTROINTESTINAL', 'DERMATOLOGY', 'SUPPLEMENT',
    'PSYCHIATRY_NEURO', 'ENT_EYE', 'MEDICAL_EQUIPMENT', 'LAB_REAGENT', 'EMERGENCY'];

let output = `/**
 * UNIFIED MEDICATION DATABASE for PRIMER
 * Single Source of Truth for Clinical, Inventory, and Billing
 * 
 * Price Structure (based on Indonesian Healthcare Regulations):
 * - unitPrice: Harga Beli / Modal (HNA + PPN) — procurement cost
 * - sellPrice: Tarif Jual Poli (Rawat Jalan) — includes Jasa Sarana & Pelayanan
 * - igdPrice: Tarif Jual IGD — includes Emergency Surcharge (+30-50%)
 * 
 * Generated: ${new Date().toISOString().split('T')[0]}
 */

export const MEDICATION_CATEGORIES = {
    ANALGESIC: 'Analgesik/Antipiretik',
    ANTIBIOTIC: 'Anti-Infeksi (Antibiotik/Antifungi/Antivirus)',
    ANTIHYPERTENSIVE: 'Antihipertensi/Kardiovaskular',
    ANTIDIABETIC: 'Antidiabetes',
    RESPIRATORY: 'Sistem Respirasi',
    GASTROINTESTINAL: 'Saluran Cerna',
    DERMATOLOGY: 'Dermatologi',
    SUPPLEMENT: 'Vitamin/Suplemen/Obstetri',
    PSYCHIATRY_NEURO: 'Psikiatri & Neurologi',
    ENT_EYE: 'Mata/Telinga/Hidung/Tenggorokan',
    MEDICAL_EQUIPMENT: 'Alat Kesehatan Habis Pakai',
    LAB_REAGENT: 'Reagensia Laboratorium',
    EMERGENCY: 'Gawat Darurat / Injeksi'
};

export const MEDICATION_DATABASE = [
`;

for (const cat of categoryOrder) {
    const catItems = groups[cat] || [];
    if (catItems.length === 0) continue;

    // Sort items within category by name
    catItems.sort((a, b) => a.name.localeCompare(b.name));

    output += `    // === ${cat} ===\n`;

    for (const item of catItems) {
        const indicationStr = item.indication.length > 0
            ? `[${item.indication.map(i => `'${i}'`).join(', ')}]`
            : '[]';

        const sellPriceStr = item.sellPrice !== null ? item.sellPrice : Math.round(item.unitPrice * 1.5);
        const igdPriceStr = item.igdPrice !== null ? item.igdPrice : 'null';

        output += `    {\n`;
        output += `        id: '${item.id}',\n`;
        output += `        name: '${item.name.replace(/'/g, "\\'")}',\n`;
        output += `        category: MEDICATION_CATEGORIES.${item.inventoryCategory},\n`;
        output += `        type: '${item.type}',\n`;
        output += `        form: '${item.form}',\n`;
        output += `        fornas: ${item.fornas},\n`;
        output += `        unitPrice: ${item.unitPrice},\n`;
        output += `        sellPrice: ${sellPriceStr},\n`;
        output += `        igdPrice: ${igdPriceStr},\n`;
        output += `        minStock: ${item.minStock},\n`;
        output += `        maxStock: ${item.maxStock},\n`;
        output += `        supplier: '${item.supplier}',\n`;
        output += `        leadTime: ${item.leadTime},\n`;
        output += `        indication: ${indicationStr},\n`;
        output += `        description: '${(item.description || item.name).replace(/'/g, "\\'")}'\n`;
        output += `    },\n`;
    }
}

output += `];

// Helper functions
export function getMedicationById(id) {
    return MEDICATION_DATABASE.find(med => med.id === id);
}

export function getMedicationsByCategory(category) {
    return MEDICATION_DATABASE.filter(med => med.category === category);
}

export function getFornasMedications() {
    return MEDICATION_DATABASE.filter(med => med.fornas === true);
}

export function calculateTotalInventoryValue(inventory) {
    return inventory.reduce((total, item) => {
        const medication = getMedicationById(item.medicationId);
        return total + (medication ? medication.unitPrice * item.stock : 0);
    }, 0);
}
`;

fs.writeFileSync('./src/data/MedicationDatabase_UNIFIED.js', output, 'utf8');
console.log(`\nGenerated: src/data/MedicationDatabase_UNIFIED.js`);
console.log(`File size: ${(output.length / 1024).toFixed(1)} KB`);
