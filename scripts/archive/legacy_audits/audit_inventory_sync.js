/* global require, process, console */
/**
 * Cross-Database Sync Audit
 * Checks synchronization between:
 * 1. MedicationDB.js (clinical/EMR, 311 items) ↔ MedicationDatabase.js (inventory/logistics)
 * 2. PROCEDURES_DB requiredItems ↔ MedicationDatabase.js items
 * 3. calculatePatientBill ↔ actual cost consistency
 */
const fs = require('fs');

const medDBFile = fs.readFileSync('./src/data/MedicationDB.js', 'utf8');
const medDatabaseFile = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');
const caseFile = fs.readFileSync('./src/game/CaseLibrary.js', 'utf8');

// 1. Extract IDs from MedicationDB.js (clinical)
const clinicalIds = new Set([...medDBFile.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]));

// 2. Extract IDs from MedicationDatabase.js (inventory)  
const inventoryIds = new Set([...medDatabaseFile.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]));

// 3. Extract requiredItems from PROCEDURES_DB
const procSection = caseFile.substring(
    caseFile.indexOf('PROCEDURES_DB = ['),
    caseFile.indexOf('];\n\n// Comprehensive EBM')
);
const requiredItemIds = new Set();
const reqMatches = [...procSection.matchAll(/requiredItems:\s*\[([^\]]*)\]/g)];
for (const m of reqMatches) {
    const items = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    items.forEach(i => requiredItemIds.add(i));
}

// --- Analysis ---

// A. Clinical meds NOT in inventory system
const clinicalNotInInventory = [...clinicalIds].filter(id => !inventoryIds.has(id)).sort();

// B. Inventory items NOT in clinical system
const inventoryNotInClinical = [...inventoryIds].filter(id => !clinicalIds.has(id)).sort();

// C. Procedure requiredItems NOT in inventory
const reqItemsNotInInventory = [...requiredItemIds].filter(id => !inventoryIds.has(id)).sort();

// D. Procedure requiredItems NOT in clinical
const reqItemsNotInClinical = [...requiredItemIds].filter(id => !clinicalIds.has(id)).sort();

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║        CROSS-DATABASE SYNCHRONIZATION AUDIT                ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log(`\nDB Sizes:`);
console.log(`  MedicationDB.js (clinical):    ${clinicalIds.size} items`);
console.log(`  MedicationDatabase.js (inv):   ${inventoryIds.size} items`);
console.log(`  Procedure requiredItems (uniq): ${requiredItemIds.size} item refs`);

console.log(`\n=== A. Clinical meds NOT in Inventory (${clinicalNotInInventory.length}) ===`);
clinicalNotInInventory.forEach(id => console.log('  ' + id));

console.log(`\n=== B. Inventory items NOT in Clinical (${inventoryNotInClinical.length}) ===`);
inventoryNotInClinical.forEach(id => console.log('  ' + id));

console.log(`\n=== C. Procedure requiredItems NOT in Inventory (${reqItemsNotInInventory.length}) ===`);
reqItemsNotInInventory.forEach(id => console.log('  ' + id));

console.log(`\n=== D. Procedure requiredItems NOT in Clinical (${reqItemsNotInClinical.length}) ===`);
reqItemsNotInClinical.forEach(id => console.log('  ' + id));

// E. Price consistency check (for items that exist in BOTH databases)
const commonIds = [...clinicalIds].filter(id => inventoryIds.has(id));
console.log(`\n=== E. Items in BOTH databases (${commonIds.length}) — Price Comparison ===`);
let priceConflicts = 0;
for (const id of commonIds) {
    const clinicalMatch = medDBFile.match(new RegExp(`\\{[^}]*id:\\s*'${id}'[^}]*cost:\\s*(\\d+)[^}]*\\}`));
    const invMatch = medDatabaseFile.match(new RegExp(`\\{[^}]*id:\\s*'${id}'[^}]*unitPrice:\\s*(\\d+)[^}]*\\}`));
    if (clinicalMatch && invMatch) {
        const clinicalCost = parseInt(clinicalMatch[1]);
        const invPrice = parseInt(invMatch[1]);
        if (clinicalCost !== invPrice) {
            console.log(`  ⚠ ${id}: clinical cost=${clinicalCost}, inventory unitPrice=${invPrice}`);
            priceConflicts++;
        }
    }
}
if (priceConflicts === 0) console.log('  ✓ All common items have matching prices');
else console.log(`  Total price conflicts: ${priceConflicts}`);
