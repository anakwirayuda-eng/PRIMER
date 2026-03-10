import { MEDICATION_DATABASE, MEDICATION_CATEGORIES } from './src/data/MedicationDatabase.js';

// 1. Total count
console.log(`\n=== TOTAL INVENTORY ===`);
console.log(`Total entries: ${MEDICATION_DATABASE.length}`);

// 2. Category breakdown
const cats = {};
MEDICATION_DATABASE.forEach(m => {
    cats[m.category] = (cats[m.category] || 0) + 1;
});
console.log(`\n=== CATEGORY BREAKDOWN ===`);
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// 3. Search for specific items the user asked about
console.log(`\n=== CHLORAMPHENICOL VARIANTS ===`);
MEDICATION_DATABASE.filter(m => m.name.toLowerCase().includes('chloram') || m.name.toLowerCase().includes('kloram'))
    .forEach(m => console.log(`  [${m.id}] ${m.name} (${m.form}) - ${m.category}`));

// 4. EQUIPMENT / ALKES category
console.log(`\n=== MEDICAL EQUIPMENT & EMERGENCY ===`);
MEDICATION_DATABASE.filter(m =>
    m.category === MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT ||
    m.category === MEDICATION_CATEGORIES.EMERGENCY
).forEach(m => console.log(`  [${m.id}] ${m.name} (${m.form}) - ${m.category}`));

// 5. Check for oxygen, nasal cannula, etc.
console.log(`\n=== SEARCH: Oxygen/O2/Nasal/Cannula/Infus/Spuit ===`);
const searchTerms = ['oksigen', 'o2', 'nasal', 'cannul', 'kanul', 'infus', 'spuit', 'syringe', 'iv', 'tabung', 'regulator'];
MEDICATION_DATABASE.filter(m => {
    const n = m.name.toLowerCase() + ' ' + m.description.toLowerCase();
    return searchTerms.some(t => n.includes(t));
}).forEach(m => console.log(`  [${m.id}] ${m.name} (${m.form}) - ${m.category}`));

// 6. Deep redundancy check - items with very similar names
console.log(`\n=== POTENTIAL REDUNDANCIES (similar names) ===`);
const allNames = MEDICATION_DATABASE.map(m => ({ id: m.id, name: m.name, cat: m.category }));
for (let i = 0; i < allNames.length; i++) {
    for (let j = i + 1; j < allNames.length; j++) {
        const a = allNames[i].name.toLowerCase().replace(/[^a-z]/g, '');
        const b = allNames[j].name.toLowerCase().replace(/[^a-z]/g, '');
        // Check if one contains the other (substring match)
        if (a.length > 5 && b.length > 5 && (a.includes(b) || b.includes(a))) {
            console.log(`  SIMILAR: "${allNames[i].name}" <-> "${allNames[j].name}"`);
        }
    }
}

// 7. Specifically check "salf" / "salep" / "ointment" items
console.log(`\n=== TOPICALS (Cream/Salep/Ointment/Gel) ===`);
MEDICATION_DATABASE.filter(m =>
    ['cream', 'ointment', 'gel', 'salep', 'lotion'].includes(m.form) ||
    m.name.toLowerCase().includes('cream') ||
    m.name.toLowerCase().includes('salep') ||
    m.name.toLowerCase().includes('salf') ||
    m.name.toLowerCase().includes('ointment') ||
    m.name.toLowerCase().includes('gel')
).forEach(m => console.log(`  [${m.id}] ${m.name} (form: ${m.form}) - ${m.category}`));

// 8. Check the "38 missing" more carefully
console.log(`\n=== RE-CHECKING "MISSING" ITEMS ===`);
const missingNames = [
    'Amoxicilin', 'Chloramfenikol', 'Gentamycin', 'Oksitetraskilin',
    'Phenoxy methilpenicilin', 'Tetrasiklin', 'Gentian Violet', 'Ketokonazol',
    'Pirantel Pamoat', 'DMP', 'Novahexin', 'Antalgin', 'Tramadol',
    'Aminofilin', 'Efedrin HCL', 'Hidroklortiazid', 'Glibenklamid',
    'Buscopan', 'Alupurinol', 'Na. Bicarbonat', 'Isosorbid dinitrat',
    'Dexamenthasone', 'Hidrokortison krim', 'Betamentason', 'Loperamid',
    'CPZ', 'Clobazam', 'Fenitoin', 'Fenobarbital', 'Karbamazepin',
    'Betahistin mesilat', 'Becefort', 'Vit C', 'Vit K', 'Vit B1, B6, B12',
    'Vit B.Complex', 'Lysmin', 'Laktas'
];

missingNames.forEach(missing => {
    const norm = missing.toLowerCase().replace(/[^a-z]/g, '');
    // Broader search - check if ANY part of the name matches
    const partial = MEDICATION_DATABASE.filter(m => {
        const dbNorm = m.name.toLowerCase().replace(/[^a-z]/g, '');
        const dbId = m.id.toLowerCase();
        // Try multiple matching strategies
        return dbNorm.includes(norm) || norm.includes(dbNorm) ||
            dbId.includes(norm) || norm.includes(dbId) ||
            // Try first 4 chars
            (norm.length >= 4 && dbNorm.includes(norm.substring(0, 4))) ||
            (dbNorm.length >= 4 && norm.includes(dbNorm.substring(0, 4)));
    });

    if (partial.length > 0) {
        console.log(`  "${missing}" -> POSSIBLE MATCHES: ${partial.map(p => p.name).join(', ')}`);
    } else {
        console.log(`  "${missing}" -> ❌ TRULY MISSING`);
    }
});
