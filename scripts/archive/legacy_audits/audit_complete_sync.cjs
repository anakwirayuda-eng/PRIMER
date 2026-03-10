/**
 * COMPLETE Cross-System Audit v2
 * Checks FOUR database layers:
 * 1. MedicationDB.js (clinical/EMR → billing)
 * 2. MedicationDatabase.js (inventory/logistics → pharmacy)
 * 3. EMERGENCY_ACTIONS in EmergencyCases.js (IGD → billing)
 * 4. PROCEDURES_DB requiredItems + IGD requiredItems
 */
const fs = require('fs');

const medDBFile = fs.readFileSync('./src/data/MedicationDB.js', 'utf8');
const medDatabaseFile = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');
const caseFile = fs.readFileSync('./src/game/CaseLibrary.js', 'utf8');
const emergFile = fs.readFileSync('./src/game/EmergencyCases.js', 'utf8');

// 1. Clinical IDs (MedicationDB.js)
const clinicalIds = new Set([...medDBFile.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]));

// 2. Inventory IDs (MedicationDatabase.js)
const inventoryIds = new Set([...medDatabaseFile.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]));

// 3. IGD action IDs — EMERGENCY_ACTIONS is an object { key: { id, name, cost... }, ... }
const eaSectionStart = emergFile.indexOf('export const EMERGENCY_ACTIONS = {');
const eaSectionEnd = emergFile.indexOf('};\n\n// Emergency conditions');
const eaSection = emergFile.substring(eaSectionStart, eaSectionEnd + 2);

// Extract all action IDs
const igdActionIds = new Set([...eaSection.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]));

// 4. IGD actions that deduct stock
const igdStockActions = [];
// Split by action entries
const actionEntries = eaSection.split(/,\n\s+(?=\w+:)/);
for (const entry of actionEntries) {
    const idMatch = entry.match(/id:\s*'([^']+)'/);
    if (idMatch && entry.includes('deductStock: true')) {
        igdStockActions.push(idMatch[1]);
    }
}

// 5. IGD action requiredItems
const igdRequiredItems = new Set();
const igdReqMatches = [...eaSection.matchAll(/requiredItems:\s*\[([^\]]*)\]/g)];
for (const m of igdReqMatches) {
    const items = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    items.forEach(i => igdRequiredItems.add(i));
}

// 6. Procedure requiredItems  
const procSectionStart = caseFile.indexOf('export const PROCEDURES_DB = [');
let bracketCount = 0;
let procSectionEnd = procSectionStart;
for (let i = caseFile.indexOf('[', procSectionStart); i < caseFile.length; i++) {
    if (caseFile[i] === '[') bracketCount++;
    if (caseFile[i] === ']') bracketCount--;
    if (bracketCount === 0) { procSectionEnd = i + 1; break; }
}
const procSection = caseFile.substring(procSectionStart, procSectionEnd);
const procRequiredItems = new Set();
const procReqMatches = [...procSection.matchAll(/requiredItems:\s*\[([^\]]*)\]/g)];
for (const m of procReqMatches) {
    const items = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    items.forEach(i => procRequiredItems.add(i));
}

// All BHP/alkes referenced by any procedure/IGD action
const allBhpRefs = new Set([...igdRequiredItems, ...procRequiredItems]);

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║      COMPLETE CROSS-SYSTEM SYNCHRONIZATION AUDIT v2        ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log(`\nDB Sizes:`);
console.log(`  MedicationDB.js (clinical):       ${clinicalIds.size} items`);
console.log(`  MedicationDatabase.js (inventory): ${inventoryIds.size} items`);
console.log(`  EMERGENCY_ACTIONS (IGD):           ${igdActionIds.size} actions`);
console.log(`  IGD stock-deducting actions:        ${igdStockActions.length}`);
console.log(`  IGD requiredItems (unique):         ${igdRequiredItems.size}`);
console.log(`  Proc requiredItems (unique):        ${procRequiredItems.size}`);
console.log(`  All BHP/alkes refs (unique):        ${allBhpRefs.size}`);

// A. IGD stock-deducting actions NOT in inventory
const igdStockNotInInventory = igdStockActions.filter(id => !inventoryIds.has(id));
console.log(`\n=== A. IGD stock-deducting actions NOT in Inventory (${igdStockNotInInventory.length}) ===`);
igdStockNotInInventory.forEach(id => console.log('  ❌ ' + id));

// B. IGD stock-deducting actions NOT in clinical  
const igdStockNotInClinical = igdStockActions.filter(id => !clinicalIds.has(id));
console.log(`\n=== B. IGD stock-deducting actions NOT in Clinical (${igdStockNotInClinical.length}) ===`);
igdStockNotInClinical.forEach(id => console.log('  ❌ ' + id));

// C. All BHP/alkes refs NOT in inventory
const bhpNotInInventory = [...allBhpRefs].filter(id => !inventoryIds.has(id)).sort();
console.log(`\n=== C. BHP/Alkes refs NOT in Inventory DB (${bhpNotInInventory.length}) ===`);
bhpNotInInventory.forEach(id => console.log('  ❌ ' + id));

// D. IGD price vs Clinical price conflicts (same item, different selling price)
console.log(`\n=== D. IGD vs Clinical SELL price conflicts ===`);
let igdConflicts = 0;
for (const id of igdActionIds) {
    const igdMatch = eaSection.match(new RegExp(`id:\\s*'${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*cost:\\s*(\\d+)`));
    const clinMatch = medDBFile.match(new RegExp(`id:\\s*'${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*cost:\\s*(\\d+)`));
    if (igdMatch && clinMatch) {
        const igdCost = parseInt(igdMatch[1]);
        const clinCost = parseInt(clinMatch[1]);
        if (igdCost !== clinCost) {
            console.log(`  ⚠ ${id}: IGD=${igdCost}, Clinical=${clinCost}`);
            igdConflicts++;
        }
    }
}
if (igdConflicts === 0) console.log('  ✓ No conflicts');
else console.log(`  Total IGD vs Clinical price conflicts: ${igdConflicts}`);

// E. IGD price vs Inventory buy price  
console.log(`\n=== E. IGD sell vs Inventory buy price (margin analysis) ===`);
let igdInvItems = 0;
for (const id of igdActionIds) {
    const igdMatch = eaSection.match(new RegExp(`id:\\s*'${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*cost:\\s*(\\d+)`));
    const invMatch = medDatabaseFile.match(new RegExp(`id:\\s*'${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*unitPrice:\\s*(\\d+)`));
    if (igdMatch && invMatch) {
        const igdCost = parseInt(igdMatch[1]);
        const invPrice = parseInt(invMatch[1]);
        const margin = invPrice > 0 ? ((igdCost - invPrice) / invPrice * 100).toFixed(0) : 'N/A';
        console.log(`  ${id}: IGD_sell=${igdCost}, Inv_buy=${invPrice} (margin ${margin}%)`);
        igdInvItems++;
    }
}
console.log(`  Total items with both IGD & Inv prices: ${igdInvItems}`);

// F. Unique items only in IGD (not in clinical or inventory)
const igdOnly = [...igdActionIds].filter(id => !clinicalIds.has(id) && !inventoryIds.has(id)).sort();
console.log(`\n=== F. IGD-only items (not in Clinical NOR Inventory) (${igdOnly.length}) ===`);
igdOnly.forEach(id => console.log('  🔵 ' + id));

// G. Clinical meds NOT in inventory (summary only)
const clinicalNotInInventory = [...clinicalIds].filter(id => !inventoryIds.has(id));
console.log(`\n=== G. Clinical meds NOT in Inventory (${clinicalNotInInventory.length} of ${clinicalIds.size}) ===`);
console.log(`  (Detail list omitted — see audit_inventory_sync.js)`);

// H. Clinical-Inventory price conflicts (summary)
const commonIds = [...clinicalIds].filter(id => inventoryIds.has(id));
let priceConflicts = 0;
for (const id of commonIds) {
    const clinicalMatch = medDBFile.match(new RegExp(`\\{[^}]*id:\\s*'${id}'[^}]*cost:\\s*(\\d+)[^}]*\\}`));
    const invMatch = medDatabaseFile.match(new RegExp(`\\{[^}]*id:\\s*'${id}'[^}]*unitPrice:\\s*(\\d+)[^}]*\\}`));
    if (clinicalMatch && invMatch && parseInt(clinicalMatch[1]) !== parseInt(invMatch[1])) priceConflicts++;
}
console.log(`\n=== H. Clinical vs Inventory price differences: ${priceConflicts} of ${commonIds.length} common items ===`);
console.log(`  (This is expected: clinical=sell, inventory=buy)`);
