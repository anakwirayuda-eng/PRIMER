import fs from 'fs';
import path from 'path';

const CL = fs.readFileSync('src/game/CaseLibrary.js', 'utf8');
const AV = fs.readFileSync('src/game/AnamnesisVariations.js', 'utf8');

// Extract case IDs from CASE_LIBRARY
// Specifically targeting the id: '...' field that follows { and is before diagnosis:
// A safe way: look for patterns like '{ id: 'something', diagnosis: 'something' }'
const caseIds = [];
const matches = CL.matchAll(/\{\s+id:\s*'([^']+)',\s+diagnosis:/g);
for (const match of matches) {
    caseIds.push(match[1]);
}

// Extract case IDs from AnamnesisVariations
const varIds = [...AV.matchAll(/^\s{4}(\w+):\s*\{/gm)].map(m => m[1]);

// Check which cases have inline variations
const hasInline = [];
const hasExternal = [];
const noVariation = [];

caseIds.forEach(id => {
    // Find the case block in CaseLibrary
    const marker = "id: '" + id + "'";
    const idx = CL.indexOf(marker);
    if (idx === -1) return;

    // Look for variations: within the next 2000 chars (approx block size)
    const chunk = CL.substring(idx, idx + 2000);
    const hasInlineVar = chunk.includes('variations:');
    const hasExternalVar = varIds.includes(id);

    if (hasInlineVar) {
        hasInline.push(id);
    }
    if (hasExternalVar) {
        hasExternal.push(id);
    }
    if (!hasInlineVar && !hasExternalVar) {
        noVariation.push(id);
    }
});

console.log('=== ANAMNESIS VARIATION COVERAGE AUDIT ===');
console.log(`Total cases in CASE_LIBRARY: ${caseIds.length}`);
console.log(`Cases with INLINE variations: ${hasInline.length}`);
console.log(`Cases with EXTERNAL variations (AnamnesisVariations.js): ${hasExternal.length}`);
console.log(`Cases WITHOUT ANY persona variations: ${noVariation.length}`);
console.log('');
console.log('--- Cases without variations ---');
noVariation.forEach(id => console.log('  - ' + id));

// Also check anamnesis question quality
console.log('\n=== ANAMNESIS QUESTION QUALITY ===');
const missingAnamnesis = [];
const fewQuestions = [];

caseIds.forEach(id => {
    const marker = "id: '" + id + "'";
    const idx = CL.indexOf(marker);
    if (idx === -1) return;

    const chunk = CL.substring(idx, idx + 5000);

    if (!chunk.includes('anamnesisQuestions:') && !chunk.includes('anamnesisQuestions :')) {
        missingAnamnesis.push(id);
        return;
    }

    // Count question IDs in the chunk
    const qIds = [...chunk.matchAll(/id:\s*'(q_[^']+)'/g)];
    if (qIds.length < 4) {
        fewQuestions.push({ id, count: qIds.length });
    }
});

console.log(`Cases WITHOUT anamnesisQuestions: ${missingAnamnesis.length}`);
missingAnamnesis.forEach(id => console.log('  - ' + id));
console.log(`\nCases with FEW questions (<4): ${fewQuestions.length}`);
fewQuestions.forEach(q => console.log(`  - ${q.id} (${q.count} questions)`));
