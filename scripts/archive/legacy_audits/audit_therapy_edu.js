/* global require, process, console */
// Targeted scan for orphan education IDs
const fs = require('fs');
const caseFile = fs.readFileSync('./src/game/CaseLibrary.js', 'utf8');
const medFile = fs.readFileSync('./src/data/MedicationDB.js', 'utf8');

// Extract DB IDs
const medIds = new Set([...medFile.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]));
const eduSection = caseFile.substring(caseFile.indexOf('EDUCATION_OPTIONS'), caseFile.indexOf('CASE_LIBRARY'));
const eduIds = new Set([...eduSection.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]));

// Extract all unique IDs from requiredEducation arrays
const eduRefIds = new Set();
const eduRefs = [...caseFile.matchAll(/requiredEducation:\s*\[(.*?)\]/gs)];
for (const m of eduRefs) {
    const items = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    items.forEach(i => eduRefIds.add(i));
}
const orphanEdus = [...eduRefIds].filter(id => !eduIds.has(id)).sort();

// Extract all unique IDs from correctTreatment arrays (handle nested alternatives)
const medRefIds = new Set();
const medRefs = [...caseFile.matchAll(/correctTreatment:\s*\[(.*?)\]/gs)];
for (const m of medRefs) {
    const items = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    items.forEach(i => medRefIds.add(i));
}
const orphanMeds = [...medRefIds].filter(id => !medIds.has(id)).sort();

// Extract all unique IDs from correctProcedures arrays
const procSection = caseFile.substring(caseFile.indexOf('PROCEDURES_DB'), caseFile.indexOf('EDUCATION_OPTIONS'));
const procIds = new Set([...procSection.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]));
const procRefIds = new Set();
const procRefs = [...caseFile.matchAll(/correctProcedures:\s*\[(.*?)\]/gs)];
for (const m of procRefs) {
    const items = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    items.forEach(i => procRefIds.add(i));
}
const orphanProcs = [...procRefIds].filter(id => !procIds.has(id)).sort();

console.log('=== ORPHAN EDUCATION IDs (' + orphanEdus.length + ') ===');
orphanEdus.forEach(id => console.log('  ' + id));
console.log('\n=== ORPHAN MEDICATION IDs (' + orphanMeds.length + ') ===');
orphanMeds.forEach(id => console.log('  ' + id));
console.log('\n=== ORPHAN PROCEDURE IDs (' + orphanProcs.length + ') ===');
orphanProcs.forEach(id => console.log('  ' + id));
console.log('\n=== DB sizes: ' + medIds.size + ' meds, ' + eduIds.size + ' edus, ' + procIds.size + ' procs ===');
console.log('=== Ref sizes: ' + medRefIds.size + ' med refs, ' + eduRefIds.size + ' edu refs, ' + procRefIds.size + ' proc refs ===');
