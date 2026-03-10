/**
 * COMPREHENSIVE CONSISTENCY AUDIT
 * Checks for: duplicates, naming issues, category errors, missing fields
 */

import { MEDICATION_DATABASE, MEDICATION_CATEGORIES } from './src/data/MedicationDatabase.js';

console.log('=== COMPREHENSIVE CONSISTENCY AUDIT ===\n');
console.log(`Total entries: ${MEDICATION_DATABASE.length}\n`);

let issues = 0;

// 1. Check for duplicate IDs
console.log('--- DUPLICATE ID CHECK ---');
const idMap = new Map();
MEDICATION_DATABASE.forEach((m, idx) => {
    if (idMap.has(m.id)) {
        console.log(`❌ DUPLICATE ID: "${m.id}" at index ${idMap.get(m.id)} and ${idx}`);
        issues++;
    } else {
        idMap.set(m.id, idx);
    }
});
if (issues === 0) console.log('✓ No duplicate IDs found');

// 2. Check for duplicate names (case-insensitive)
console.log('\n--- DUPLICATE NAME CHECK ---');
const nameMap = new Map();
let nameIssues = 0;
MEDICATION_DATABASE.forEach((m, idx) => {
    const normName = m.name.toLowerCase().trim();
    if (nameMap.has(normName)) {
        console.log(`❌ DUPLICATE NAME: "${m.name}" at index ${nameMap.get(normName)} and ${idx}`);
        nameIssues++;
    } else {
        nameMap.set(normName, idx);
    }
});
if (nameIssues === 0) console.log('✓ No duplicate names found');
issues += nameIssues;

// 3. Check for very similar names (potential confusion)
console.log('\n--- SIMILAR NAME CHECK (potential confusion) ---');
const allNames = MEDICATION_DATABASE.map((m, i) => ({ idx: i, name: m.name, id: m.id, cat: m.category }));
const similarPairs = [];
for (let i = 0; i < allNames.length; i++) {
    for (let j = i + 1; j < allNames.length; j++) {
        const a = allNames[i].name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const b = allNames[j].name.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Only flag if VERY similar (>90% same characters) but different
        if (a.length > 8 && b.length > 8) {
            const shorter = a.length < b.length ? a : b;
            const longer = a.length >= b.length ? a : b;
            if (longer.includes(shorter) && shorter.length > 10) {
                similarPairs.push([allNames[i], allNames[j]]);
            }
        }
    }
}
if (similarPairs.length > 0) {
    similarPairs.slice(0, 10).forEach(([a, b]) => {
        console.log(`⚠ Similar: "${a.name}" <-> "${b.name}"`);
    });
    if (similarPairs.length > 10) console.log(`  ... and ${similarPairs.length - 10} more`);
} else {
    console.log('✓ No confusingly similar names found');
}

// 4. Check category consistency
console.log('\n--- CATEGORY VALIDATION ---');
const validCategories = new Set(Object.values(MEDICATION_CATEGORIES));
let catIssues = 0;
MEDICATION_DATABASE.forEach(m => {
    if (!validCategories.has(m.category)) {
        console.log(`❌ INVALID CATEGORY: "${m.id}" has "${m.category}"`);
        catIssues++;
    }
});
if (catIssues === 0) console.log('✓ All categories are valid');
issues += catIssues;

// 5. Check for missing required fields
console.log('\n--- REQUIRED FIELD CHECK ---');
const requiredFields = ['id', 'name', 'category', 'type', 'form', 'unitPrice', 'sellPrice', 'minStock', 'maxStock'];
let fieldIssues = 0;
MEDICATION_DATABASE.forEach(m => {
    requiredFields.forEach(field => {
        if (m[field] === undefined) {
            console.log(`❌ MISSING FIELD: "${m.id}" missing "${field}"`);
            fieldIssues++;
        }
    });
});
if (fieldIssues === 0) console.log('✓ All required fields present');
issues += fieldIssues;

// 6. Check for anthelmintics in wrong category
console.log('\n--- ANTHELMINTIC CATEGORY CHECK ---');
const anthelmintics = ['albendazole', 'mebendazole', 'pyrantel', 'ivermectin', 'praziquantel'];
MEDICATION_DATABASE.filter(m => anthelmintics.some(a => m.name.toLowerCase().includes(a))).forEach(m => {
    if (m.category !== MEDICATION_CATEGORIES.ANTIBIOTIC) {
        console.log(`⚠ Anthelmintic in wrong category: "${m.name}" is in "${m.category}"`);
    } else {
        console.log(`✓ "${m.name}" correctly in Anti-Infeksi`);
    }
});

// 7. Check for topicals in wrong category
console.log('\n--- TOPICAL CATEGORY CHECK ---');
const topicalForms = ['cream', 'ointment', 'gel', 'lotion'];
const wrongTopicals = MEDICATION_DATABASE.filter(m =>
    topicalForms.includes(m.form) &&
    m.category === MEDICATION_CATEGORIES.SUPPLEMENT
);
if (wrongTopicals.length > 0) {
    wrongTopicals.forEach(m => {
        console.log(`⚠ Topical in SUPPLEMENT: "${m.name}" (${m.form})`);
    });
} else {
    console.log('✓ No topicals miscategorized as SUPPLEMENT');
}

// 8. Final category breakdown
console.log('\n--- CATEGORY BREAKDOWN ---');
const catCounts = {};
MEDICATION_DATABASE.forEach(m => {
    catCounts[m.category] = (catCounts[m.category] || 0) + 1;
});
Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});

console.log(`\n=== AUDIT COMPLETE: ${issues} critical issues found ===`);
