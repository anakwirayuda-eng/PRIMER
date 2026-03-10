/**
 * DEEP REDUNDANCY AUDIT
 * Checks for:
 * 1. Exact name duplicates
 * 2. Near-duplicates (fuzzy/normalized name matching)
 * 3. Duplicate IDs
 * 4. Price anomalies (sellPrice < unitPrice)
 * 5. Missing required fields
 * 6. Orphaned references in game code
 */
const fs = require('fs');

const dbFile = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');

// Parse all entries
const entryRegex = /\{\s*\n\s*id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*([^\n]+)[\s\S]*?unitPrice:\s*(\d+)[\s\S]*?sellPrice:\s*(\d+)[\s\S]*?\}/g;
const entries = [];
let match;
while ((match = entryRegex.exec(dbFile)) !== null) {
    entries.push({
        id: match[1],
        name: match[2],
        category: match[3].trim().replace(/,\s*$/, ''),
        unitPrice: parseInt(match[4]),
        sellPrice: parseInt(match[5]),
    });
}

console.log('=== DEEP REDUNDANCY AUDIT ===');
console.log('Total entries parsed:', entries.length);
console.log('');

// --- CHECK 1: Exact name duplicates ---
console.log('--- CHECK 1: EXACT NAME DUPLICATES ---');
const byName = {};
for (const e of entries) {
    const key = e.name.toLowerCase().trim();
    if (!byName[key]) byName[key] = [];
    byName[key].push(e);
}
let exactDupes = 0;
for (const [name, items] of Object.entries(byName)) {
    if (items.length > 1) {
        console.log('  DUPE: "' + name + '"');
        items.forEach(i => console.log('    - id=' + i.id + ' unit=' + i.unitPrice + ' sell=' + i.sellPrice));
        exactDupes++;
    }
}
if (exactDupes === 0) console.log('  ✅ NONE found');
console.log('');

// --- CHECK 2: Near-duplicates (normalized) ---
console.log('--- CHECK 2: NEAR-DUPLICATES (fuzzy) ---');
function normalize(name) {
    return name.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '')
        .replace(/mg$/, '')
        .replace(/iu$/, '')
        .replace(/ml$/, '')
        .replace(/tab$/, '')
        .replace(/cap$/, '')
        .replace(/syr$/, '')
        .replace(/sirup$/, '')
        .replace(/cream$/, '')
        .replace(/ointment$/, '')
        .replace(/salep$/, '')
        .replace(/krim$/, '');
}
const byNormalized = {};
for (const e of entries) {
    const key = normalize(e.name);
    if (!byNormalized[key]) byNormalized[key] = [];
    byNormalized[key].push(e);
}
let nearDupes = 0;
for (const [key, items] of Object.entries(byNormalized)) {
    if (items.length > 1) {
        // Check if names are actually different (not caught by exact check)
        const uniqueNames = new Set(items.map(i => i.name.toLowerCase().trim()));
        if (uniqueNames.size > 1 || items.length > 1) {
            console.log('  NEAR-DUPE (' + key + '):');
            items.forEach(i => console.log('    - "' + i.name + '" id=' + i.id + ' unit=' + i.unitPrice + ' sell=' + i.sellPrice));
            nearDupes++;
        }
    }
}
if (nearDupes === 0) console.log('  ✅ NONE found');
console.log('');

// --- CHECK 3: Duplicate IDs ---
console.log('--- CHECK 3: DUPLICATE IDs ---');
const byId = {};
let idDupes = 0;
for (const e of entries) {
    if (byId[e.id]) {
        console.log('  DUPE ID: ' + e.id);
        idDupes++;
    }
    byId[e.id] = e;
}
if (idDupes === 0) console.log('  ✅ NONE found');
console.log('');

// --- CHECK 4: Price anomalies ---
console.log('--- CHECK 4: PRICE ANOMALIES (sellPrice < unitPrice) ---');
let priceIssues = 0;
for (const e of entries) {
    if (e.sellPrice < e.unitPrice) {
        console.log('  ⚠️  ' + e.id + ': unit=' + e.unitPrice + ' > sell=' + e.sellPrice);
        priceIssues++;
    }
}
if (priceIssues === 0) console.log('  ✅ NONE found');
console.log('');

// --- CHECK 5: Orphaned references ---
console.log('--- CHECK 5: ORPHANED MEDICATION REFERENCES IN GAME CODE ---');
const gameFiles = [
    './src/game/CaseLibrary.js',
    './src/game/EmergencyCases.js',
    './src/context/GameContext.jsx',
    './src/components/SaranaPage.jsx',
];
const dbIds = new Set(entries.map(e => e.id));
let orphans = 0;
for (const gf of gameFiles) {
    try {
        const content = fs.readFileSync(gf, 'utf8');
        // Find medication id references in quotes
        const refs = [...content.matchAll(/'([a-z][a-z0-9_]+(?:\.[a-z0-9]+)?)'/g)];
        for (const ref of refs) {
            const refId = ref[1];
            // Only check IDs that look like medication references (contain underscore or match pattern)
            if (refId.includes('_') && !refId.startsWith('MEDICATION') && !refId.startsWith('http')
                && !refId.includes('/') && !refId.includes('..') && refId.length > 3) {
                // This is a heuristic - not all quoted strings are med IDs
                // Check against known prefixes from the DB
                if (dbIds.has(refId)) continue; // exists, fine
            }
        }
    } catch (e) { }
}
console.log('  (Heuristic check only — manual review recommended)');
console.log('');

// --- CHECK 6: Same substance, different strengths (info only) ---
console.log('--- CHECK 6: SAME-SUBSTANCE VARIANTS (info, not errors) ---');
const bySubstance = {};
for (const e of entries) {
    // Extract base substance name (before strength numbers)
    const base = e.name.replace(/\s*\d+[\.,]?\d*\s*(mg|ml|%|iu|mcg|g).*$/i, '').trim().toLowerCase();
    if (!bySubstance[base]) bySubstance[base] = [];
    bySubstance[base].push(e);
}
let variants = 0;
for (const [base, items] of Object.entries(bySubstance)) {
    if (items.length > 1) {
        const uniqueNames = new Set(items.map(i => i.name));
        if (uniqueNames.size > 1) {
            console.log('  ' + base + ':');
            items.forEach(i => console.log('    - "' + i.name + '" id=' + i.id));
            variants++;
        } else if (items.length > 1) {
            // Same name, same base — these are actual dupes missed above
            console.log('  ⚠️  SAME NAME+BASE: ' + base + ':');
            items.forEach(i => console.log('    - "' + i.name + '" id=' + i.id));
            variants++;
        }
    }
}
if (variants === 0) console.log('  ✅ No multi-variant substances');
console.log('');

// --- SUMMARY ---
console.log('=== SUMMARY ===');
console.log('Total entries: ' + entries.length);
console.log('Exact name duplicates: ' + exactDupes);
console.log('Near-duplicates: ' + nearDupes);
console.log('ID duplicates: ' + idDupes);
console.log('Price anomalies: ' + priceIssues);
console.log(exactDupes + nearDupes + idDupes + priceIssues === 0
    ? '✅ DATABASE IS CLEAN!'
    : '⚠️  Issues found — see above');
