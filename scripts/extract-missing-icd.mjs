/**
 * Extract missing ICD-10 codes from CASE_LIBRARY that need to be added to ICD10_DB
 */
import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import { ICD10_DB } from '../src/data/ICD10.js';

const dbSet = new Set(ICD10_DB.map(d => d.code));
const missing = new Map();

for (const c of CASE_LIBRARY) {
    if (c.icd10 && !dbSet.has(c.icd10)) {
        missing.set(c.icd10, { name: c.diagnosis, category: c.category, caseId: c.id });
    }
    for (const dd of (c.differentialDiagnosis || [])) {
        if (!dbSet.has(dd) && !missing.has(dd)) {
            missing.set(dd, { name: dd, category: 'differential', caseId: c.id });
        }
    }
}

console.log(`Missing ICD-10 codes: ${missing.size}`);
console.log('');

// Group by ICD category letter
const groups = {};
for (const [code, info] of missing) {
    const letter = code.charAt(0);
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push({ code, ...info });
}

// Output as JS entries to paste
for (const letter of Object.keys(groups).sort()) {
    for (const entry of groups[letter].sort((a, b) => a.code.localeCompare(b.code))) {
        const cat = getCat(entry.code);
        console.log(`    { code: '${entry.code}', name: '${entry.name.replace(/'/g, "\\'")} (${entry.caseId})', category: '${cat}' },`);
    }
}

function getCat(code) {
    const l = code.charAt(0).toUpperCase();
    if (['A', 'B'].includes(l)) return 'infectious';
    if (['C', 'D'].includes(l)) return 'neoplasm';
    if (l === 'E') return 'endocrine';
    if (l === 'F') return 'mental';
    if (l === 'G') return 'nervous';
    if (l === 'H') {
        const num = parseInt(code.slice(1));
        return num >= 60 ? 'ear' : 'eye';
    }
    if (l === 'I') return 'circulatory';
    if (l === 'J') return 'respiratory';
    if (l === 'K') return 'digestive';
    if (l === 'L') return 'skin';
    if (l === 'M') return 'musculoskeletal';
    if (l === 'N') return 'genitourinary';
    if (l === 'O') return 'pregnancy';
    if (l === 'P') return 'perinatal';
    if (l === 'Q') return 'congenital';
    if (l === 'R') return 'symptoms';
    if (['S', 'T'].includes(l)) return 'injury';
    if (['V', 'W', 'X', 'Y'].includes(l)) return 'external';
    if (l === 'Z') return 'factors';
    return 'other';
}
