const fs = require('fs');

// Duplicate pairs found by name matching
const dupes = [
    ['asam_mefenamat_500', 'asam_mefenamat'],
    ['colchicine_0_5', 'colchicine_0.5'],
    ['natrium_diklofenak_50', 'natrium_diklofenak'],
    ['amoxicillin_syr', 'amoxicillin_sirup'],
    ['cotrimoxazole_480', 'cotrimoxazole'],
    ['hydrocortisone_cream', 'hc_cream_2'],
    ['mupirocin_cream', 'mupirocin_oint'],
    ['tranexamic_acid_500', 'tranexamic_acid'],
    ['praziquantel_600', 'praziquantel'],
    ['vit_a_200', 'vit_a_200000'],
];

const searchFiles = [
    './src/game/CaseLibrary.js',
    './src/game/EmergencyCases.js',
    './src/components/PatientEMR.jsx',
    './src/context/GameContext.jsx',
    './src/components/SaranaPage.jsx',
    './src/components/InventoryPage.jsx',
    './src/components/EmergencyPanel.jsx',
];

const contents = {};
for (const f of searchFiles) {
    try { contents[f] = fs.readFileSync(f, 'utf8'); } catch (e) { }
}

// Also get the price data for each dupe from the unified DB
const dbFile = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');

console.log('=== DUPLICATE REFERENCE ANALYSIS ===\n');

for (const [a, b] of dupes) {
    const refsA = [];
    const refsB = [];
    for (const [f, c] of Object.entries(contents)) {
        const fname = f.split('/').pop();
        // Search for the ID as a string literal
        if (c.includes("'" + a + "'") || c.includes('"' + a + '"')) refsA.push(fname);
        if (c.includes("'" + b + "'") || c.includes('"' + b + '"')) refsB.push(fname);
    }

    // Get prices from DB
    const aBlock = dbFile.match(new RegExp("id: '" + a + "'[\\s\\S]*?\\},"));
    const bBlock = dbFile.match(new RegExp("id: '" + b + "'[\\s\\S]*?\\},"));
    const aUnit = aBlock ? (aBlock[0].match(/unitPrice: (\d+)/) || [])[1] : '?';
    const aSell = aBlock ? (aBlock[0].match(/sellPrice: (\d+)/) || [])[1] : '?';
    const bUnit = bBlock ? (bBlock[0].match(/unitPrice: (\d+)/) || [])[1] : '?';
    const bSell = bBlock ? (bBlock[0].match(/sellPrice: (\d+)/) || [])[1] : '?';

    const aInd = aBlock ? (aBlock[0].match(/indication: \[([^\]]*)\]/) || [])[1] : '';
    const bInd = bBlock ? (bBlock[0].match(/indication: \[([^\]]*)\]/) || [])[1] : '';

    console.log(a + ' (unit:' + aUnit + ', sell:' + aSell + ', ind:' + (aInd || 'none') + ')');
    console.log('  refs: ' + (refsA.length > 0 ? refsA.join(', ') : 'NONE'));
    console.log(b + ' (unit:' + bUnit + ', sell:' + bSell + ', ind:' + (bInd || 'none') + ')');
    console.log('  refs: ' + (refsB.length > 0 ? refsB.join(', ') : 'NONE'));

    // Recommendation
    const keepA = refsA.length >= refsB.length;
    const keep = keepA ? a : b;
    const remove = keepA ? b : a;
    console.log('  >> KEEP: ' + keep + ', REMOVE: ' + remove);
    console.log('');
}
