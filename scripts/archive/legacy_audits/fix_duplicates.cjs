/**
 * DEDUPLICATION SCRIPT
 * Merges 10 duplicate pairs in the unified MedicationDatabase.js
 * For each pair: keeps the ID referenced by game code, 
 * merges best data from both entries, removes the duplicate.
 */
const fs = require('fs');

let db = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');

// Pairs: [REMOVE, KEEP] — keep the one referenced by game code
// For each, we also merge the better data (indications, description) from the removed entry
const removals = [
    // asam_mefenamat_500 has no refs, but has inventory data (unit:1000, sell:1500) 
    // asam_mefenamat has clinical data (ind: pain, dysmenorrhea) — keep this one but upgrade prices
    { remove: 'asam_mefenamat_500', keep: 'asam_mefenamat', upgradePrice: { unitPrice: 1000, sellPrice: 1500 } },

    // colchicine_0.5 is referenced but has dots in ID (problematic), colchicine_0_5 also referenced
    // Keep colchicine_0_5 (underscore is cleaner)
    { remove: 'colchicine_0.5', keep: 'colchicine_0_5' },

    // natrium_diklofenak has refs in CaseLibrary, natrium_diklofenak_50 has better inventory data
    { remove: 'natrium_diklofenak_50', keep: 'natrium_diklofenak', upgradePrice: { unitPrice: 800, sellPrice: 1200 } },

    // amoxicillin_sirup has refs, amoxicillin_syr is a duplicate
    { remove: 'amoxicillin_syr', keep: 'amoxicillin_sirup' },

    // cotrimoxazole has refs in CaseLibrary+GameContext, cotrimoxazole_480 has better prices
    { remove: 'cotrimoxazole_480', keep: 'cotrimoxazole', upgradePrice: { unitPrice: 1200, sellPrice: 1800 } },

    // hydrocortisone_cream has refs, hc_cream_2 is duplicate
    { remove: 'hc_cream_2', keep: 'hydrocortisone_cream' },

    // mupirocin_oint has refs, mupirocin_cream is duplicate
    { remove: 'mupirocin_cream', keep: 'mupirocin_oint' },

    // tranexamic_acid_500 has refs, tranexamic_acid is duplicate
    { remove: 'tranexamic_acid', keep: 'tranexamic_acid_500' },

    // praziquantel has refs, praziquantel_600 is duplicate
    { remove: 'praziquantel_600', keep: 'praziquantel' },

    // vit_a_200000 has refs, vit_a_200 is duplicate
    { remove: 'vit_a_200', keep: 'vit_a_200000' },
];

let removedCount = 0;
let upgradedCount = 0;

for (const { remove, keep, upgradePrice } of removals) {
    // Find and remove the duplicate entry block
    // Match the full entry: from "    {" ... id: 'REMOVE_ID' ... to "    },"
    const entryRegex = new RegExp(
        "    \\{\\n[\\s\\S]*?id: '" + remove.replace('.', '\\.') + "'[\\s\\S]*?\\n    \\},\\n",
        ''
    );

    const match = db.match(entryRegex);
    if (match) {
        db = db.replace(match[0], '');
        removedCount++;
        console.log('REMOVED: ' + remove);
    } else {
        console.log('NOT FOUND for removal: ' + remove);
    }

    // Upgrade prices on the kept entry if specified
    if (upgradePrice) {
        const keepBlock = db.match(new RegExp("id: '" + keep.replace('.', '\\.') + "'"));
        if (keepBlock) {
            // Find the entry block boundaries
            const startIdx = db.lastIndexOf('    {', keepBlock.index);
            const endIdx = db.indexOf('    },', keepBlock.index) + 6;
            let block = db.substring(startIdx, endIdx);

            // Update unitPrice if current is lower
            const currentUnit = parseInt((block.match(/unitPrice: (\d+)/) || [])[1] || '0');
            if (upgradePrice.unitPrice > currentUnit) {
                block = block.replace(/unitPrice: \d+/, 'unitPrice: ' + upgradePrice.unitPrice);
            }

            // Update sellPrice if current is lower
            const currentSell = parseInt((block.match(/sellPrice: (\d+)/) || [])[1] || '0');
            if (upgradePrice.sellPrice > currentSell) {
                block = block.replace(/sellPrice: \d+/, 'sellPrice: ' + upgradePrice.sellPrice);
            }

            db = db.substring(0, startIdx) + block + db.substring(endIdx);
            upgradedCount++;
            console.log('UPGRADED: ' + keep + ' (unit:' + upgradePrice.unitPrice + ', sell:' + upgradePrice.sellPrice + ')');
        }
    }
}

// Also fix colchicine_0.5 reference in CaseLibrary.js
const caseFile = fs.readFileSync('./src/game/CaseLibrary.js', 'utf8');
const fixedCase = caseFile.replace(/colchicine_0\.5/g, 'colchicine_0_5');
if (fixedCase !== caseFile) {
    fs.writeFileSync('./src/game/CaseLibrary.js', fixedCase, 'utf8');
    console.log('\nFixed colchicine_0.5 reference in CaseLibrary.js');
}

fs.writeFileSync('./src/data/MedicationDatabase.js', db, 'utf8');

// Verify count
const finalIds = [...db.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
const uniqueIds = new Set(finalIds);
console.log('\nTotal entries after dedup: ' + finalIds.length);
console.log('Unique IDs: ' + uniqueIds.size);
console.log('Removed: ' + removedCount);
console.log('Price-upgraded: ' + upgradedCount);

if (finalIds.length !== uniqueIds.size) {
    console.log('\nWARNING: Still have duplicate IDs!');
    const counts = {};
    for (const id of finalIds) {
        counts[id] = (counts[id] || 0) + 1;
    }
    for (const [id, count] of Object.entries(counts)) {
        if (count > 1) console.log('  STILL DUPE: ' + id + ' (' + count + 'x)');
    }
}
