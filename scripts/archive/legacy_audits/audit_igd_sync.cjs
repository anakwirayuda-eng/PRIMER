const fs = require('fs');
const m1 = fs.readFileSync('./src/data/MedicationDB.js', 'utf8');
const m2 = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');
const e = fs.readFileSync('./src/game/EmergencyCases.js', 'utf8');

const cIds = new Set([...m1.matchAll(/\bid:\s*'([^']+)'/g)].map(x => x[1]));
const iIds = new Set([...m2.matchAll(/\bid:\s*'([^']+)'/g)].map(x => x[1]));

// Parse EMERGENCY_ACTIONS
const s = e.indexOf('export const EMERGENCY_ACTIONS = {');
const en = e.indexOf('};', s);
const sec = e.substring(s, en + 2);
const eIds = [...sec.matchAll(/id:\s*'([^']+)'/g)].map(x => x[1]);

// Stock-deducting actions
const stockActions = [];
const lines = sec.split(/\r?\n/);
let cid = null;
for (const l of lines) {
    const m = l.match(/id:\s*'([^']+)'/);
    if (m) cid = m[1];
    if (cid && l.includes('deductStock: true')) {
        stockActions.push(cid);
        cid = null;
    }
}

// requiredItems from IGD
const igdReqItems = new Set();
for (const match of sec.matchAll(/requiredItems:\s*\[([^\]]*)\]/g)) {
    for (const item of match[1].matchAll(/'([^']+)'/g)) {
        igdReqItems.add(item[1]);
    }
}

console.log('=== COMPLETE IGD CROSS-AUDIT ===');
console.log(`IGD total actions: ${eIds.length}`);
console.log(`IGD stock-deducting: ${stockActions.length}`);
console.log(`IGD requiredItems unique: ${igdReqItems.size}`);

// A: stock actions not in inventory
const notInInv = stockActions.filter(x => !iIds.has(x));
console.log(`\nA. IGD stock actions NOT in Inventory (${notInInv.length}):`);
notInInv.forEach(x => console.log('  ' + x));

// B: stock actions not in clinical 
const notInClin = stockActions.filter(x => !cIds.has(x));
console.log(`\nB. IGD stock actions NOT in Clinical (${notInClin.length}):`);
notInClin.forEach(x => console.log('  ' + x));

// C: IGD requiredItems not in inventory
const reqNotInInv = [...igdReqItems].filter(x => !iIds.has(x)).sort();
console.log(`\nC. IGD requiredItems NOT in Inventory (${reqNotInInv.length}):`);
reqNotInInv.forEach(x => console.log('  ' + x));

// D: IGD-only (not in clinical NOR inventory)
const igdOnly = eIds.filter(x => !cIds.has(x) && !iIds.has(x));
console.log(`\nD. IGD-only items, not in Clinical NOR Inventory (${igdOnly.length}):`);
igdOnly.forEach(x => console.log('  ' + x));

// E: Price conflicts IGD vs Clinical
console.log('\nE. IGD vs Clinical price conflicts:');
let pc = 0;
for (const id of eIds) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const em = sec.match(new RegExp("id:\\s*'" + esc + "'[^}]*cost:\\s*(\\d+)"));
    const cm = m1.match(new RegExp("id:\\s*'" + esc + "'[^}]*cost:\\s*(\\d+)"));
    if (em && cm) {
        const ev = parseInt(em[1]), cv = parseInt(cm[1]);
        if (ev !== cv) {
            console.log(`  ${id}: IGD=${ev} vs Clinical=${cv}`);
            pc++;
        }
    }
}
console.log(`  Total conflicts: ${pc}`);

// F: Price conflicts IGD vs Inventory
console.log('\nF. IGD vs Inventory price comparison:');
let ic = 0;
for (const id of eIds) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const em = sec.match(new RegExp("id:\\s*'" + esc + "'[^}]*cost:\\s*(\\d+)"));
    const im = m2.match(new RegExp("id:\\s*'" + esc + "'[^}]*unitPrice:\\s*(\\d+)"));
    if (em && im) {
        const ev = parseInt(em[1]), iv = parseInt(im[1]);
        console.log(`  ${id}: IGD_sell=${ev}, Inv_buy=${iv}`);
        ic++;
    }
}
console.log(`  Total items present in both: ${ic}`);
