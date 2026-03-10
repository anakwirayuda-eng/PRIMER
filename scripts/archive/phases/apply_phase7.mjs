/**
 * PHASE 7: METABOLIC CATEGORY & DRUP REALIGNMENT
 * Fixes Allopurinol (Analgesic -> Metabolic)
 * Moves Lipid drugs (Cardiac -> Metabolic)
 * Adds Sodium Bicarbonate
 */

import fs from 'fs';

const dbPath = './src/data/MedicationDatabase.js';
let content = fs.readFileSync(dbPath, 'utf8');

console.log('=== APPLYING PHASE 7 UPDATES ===\n');

// 1. Add METABOLIC to categories
if (!content.includes('METABOLIC:')) {
    content = content.replace(
        /EMERGENCY: 'Gawat Darurat \/ Injeksi'\n\};/,
        `EMERGENCY: 'Gawat Darurat / Injeksi',
    METABOLIC: 'Obat Metabolik & Gout'
};`
    );
    console.log('✓ Added METABOLIC category');
}

// 2. Fix Allopurinol 100mg
content = content.replace(
    /id: 'allopurinol_100',[\s\S]*?category: MEDICATION_CATEGORIES\.ANALGESIC,/,
    `id: 'allopurinol_100',
        name: 'Allopurinol 100mg',
        category: MEDICATION_CATEGORIES.METABOLIC,`
);
console.log('✓ Recategorized Allopurinol 100mg -> METABOLIC');

// 3. Fix Allopurinol 300mg
content = content.replace(
    /id: 'allopurinol_300',[\s\S]*?category: MEDICATION_CATEGORIES\.ANALGESIC,/,
    `id: 'allopurinol_300',
        name: 'Allopurinol 300mg',
        category: MEDICATION_CATEGORIES.METABOLIC,`
);
console.log('✓ Recategorized Allopurinol 300mg -> METABOLIC');

// 4. Fix Simvastatin 20mg
content = content.replace(
    /id: 'simvastatin_20',[\s\S]*?category: MEDICATION_CATEGORIES\.ANTIHYPERTENSIVE,/,
    `id: 'simvastatin_20',
        name: 'Simvastatin 20mg',
        category: MEDICATION_CATEGORIES.METABOLIC,`
);
console.log('✓ Recategorized Simvastatin 20mg -> METABOLIC');

// 5. Fix Simvastatin 10mg
content = content.replace(
    /id: 'simvastatin_10',[\s\S]*?category: MEDICATION_CATEGORIES\.ANTIHYPERTENSIVE,/,
    `id: 'simvastatin_10',
        name: 'Simvastatin 10mg',
        category: MEDICATION_CATEGORIES.METABOLIC,`
);
console.log('✓ Recategorized Simvastatin 10mg -> METABOLIC');

// 6. Fix Gemfibrozil 300mg
content = content.replace(
    /id: 'gemfibrozil_300',[\s\S]*?category: MEDICATION_CATEGORIES\.ANTIHYPERTENSIVE,/,
    `id: 'gemfibrozil_300',
        name: 'Gemfibrozil 300mg',
        category: MEDICATION_CATEGORIES.METABOLIC,`
);
console.log('✓ Recategorized Gemfibrozil 300mg -> METABOLIC');

// 7. Add Sodium Bicarbonate 500mg
const naBic = `
    {
        id: 'sodium_bicarbonate_500',
        name: 'Sodium Bicarbonate 500mg',
        category: MEDICATION_CATEGORIES.METABOLIC,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 200,
        sellPrice: 500,
        igdPrice: 1000,
        minStock: 100,
        maxStock: 1000,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['acidosis', 'hiperurisemia', 'alkalinisasi_urin'],
        description: 'Sodium Bicarbonate untuk alkalinisasi urin pada gout'
    },
`;

// Insert before the closing ]; (assuming it's formatted as \n]; \n\n// Backward compatibility)
content = content.replace(/\n\];\s*\n\n\/\/ Backward compatibility/, naBic + '\n];\n\n// Backward compatibility');
console.log('✓ Added Sodium Bicarbonate 500mg');

fs.writeFileSync(dbPath, content);
console.log('\n=== PHASE 7 COMPLETED ===');
