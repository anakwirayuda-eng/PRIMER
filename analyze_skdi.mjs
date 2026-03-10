// Analyze SKDI distribution by level and category
import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('skdi_SKDI_2012.json', 'utf8'));

// Count by level
const byLevel = {};
const byCategory = {};
const byCatAndLevel = {};

for (const row of data) {
    const level = String(row.Level || 'unknown');
    const cat = row.Kategori || 'unknown';
    const name = row.Keterangan || '';
    const type = row.Jenis || '';

    // Only diseases (not skills)
    if (!type.includes('Penyakit')) continue;

    byLevel[level] = (byLevel[level] || 0) + 1;
    byCategory[cat] = (byCategory[cat] || 0) + 1;

    const key = `${cat}|${level}`;
    if (!byCatAndLevel[key]) byCatAndLevel[key] = [];
    byCatAndLevel[key].push(name);
}

console.log('\n=== SKDI Level Distribution (Diseases Only) ===');
for (const [level, count] of Object.entries(byLevel).sort((a, b) => a[0].localeCompare(b[0]))) {
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(`  Level ${level.padEnd(4)}: ${String(count).padStart(4)} ${bar}`);
}

console.log('\n=== By Category ===');
for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b - a)) {
    console.log(`  ${cat}: ${count}`);
}

// Show SKDI 1-3B diseases by category (the ones we need for referral cases)
console.log('\n=== REFERRAL CASES: SKDI 1, 2, 3A, 3B ===');
for (const level of ['1', '2', '3A', '3B']) {
    console.log(`\n--- Level ${level} ---`);
    const cats = {};
    for (const [key, names] of Object.entries(byCatAndLevel)) {
        const [cat, lv] = key.split('|');
        if (lv === level) {
            cats[cat] = names;
        }
    }
    for (const [cat, names] of Object.entries(cats).sort()) {
        console.log(`  ${cat} (${names.length}): ${names.slice(0, 5).join(', ')}${names.length > 5 ? '...' : ''}`);
    }
}

// Count gameable referral diseases (common enough to be worth implementing)
console.log('\n=== COMMON REFERRAL DISEASES (gameplay-relevant) ===');
const gameRelevant = data.filter(r => {
    const level = String(r.Level || '');
    const type = r.Jenis || '';
    return type.includes('Penyakit') && ['2', '3A', '3B'].includes(level);
});
console.log(`Total SKDI 2/3A/3B diseases: ${gameRelevant.length}`);

// Prioritize by epidemiological relevance in rural Indonesia
const highPriority = [
    'Apendisitis akut', 'Kolesistitis', 'Hernia', 'Ileus obstruktif',
    'Meningitis', 'Ensefalitis', 'Stroke', 'Epilepsi',
    'Fraktur', 'Luka bakar', 'Pneumonia berat', 'Asma eksaserbasi berat',
    'Infark miokard akut', 'Gagal jantung', 'Syok anafilaktik',
    'Kehamilan ektopik', 'Pre-eklampsia berat', 'Plasenta previa',
    'Kanker payudara', 'Kanker serviks', 'Tumor otak',
    'Gigitan ular berbisa', 'Keracunan', 'Tenggelam',
    'Demam tifoid berat', 'Malaria berat', 'DBD derajat III-IV',
    'Katarak', 'Glaukoma akut', 'Abses hepar'
];

const found = gameRelevant.filter(r => {
    const name = (r.Keterangan || '').toLowerCase();
    return highPriority.some(hp => name.toLowerCase().includes(hp.toLowerCase().split(' ')[0]));
});
console.log(`High-priority matches: ${found.length}`);
for (const r of found.slice(0, 30)) {
    console.log(`  [SKDI ${r.Level}] ${r.Keterangan} — ${r.Kategori}/${r.Subkategori}`);
}
