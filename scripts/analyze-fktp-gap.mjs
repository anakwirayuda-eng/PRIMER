// Script to analyze missing FKTP 144 diseases from CaseLibrary
import { FKTP_144_DISEASES } from '../src/data/FKTP144Diseases.js';
import { CASE_LIBRARY } from '../src/game/CaseLibrary.js';

const fktpIds = FKTP_144_DISEASES.map(d => d.id);
const caseIds = CASE_LIBRARY.map(c => c.id);

const missing = fktpIds.filter(id => !caseIds.includes(id));

console.log('=== FKTP 144 Gap Analysis ===\n');
console.log(`Total FKTP 144 diseases: ${fktpIds.length}`);
console.log(`Total CaseLibrary cases: ${caseIds.length}`);
console.log(`Missing from CaseLibrary: ${missing.length}\n`);

console.log('Missing diseases:');
missing.forEach(id => {
    const d = FKTP_144_DISEASES.find(x => x.id === id);
    console.log(`- ${id} | ${d.name} | ${d.icd10} | ${d.category}`);
});
