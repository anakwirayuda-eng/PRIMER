import { readFileSync, writeFileSync } from 'fs';

const raw = readFileSync('./src/game/CaseLibrary.js', 'utf-8');

// Regex to find cases and their anamnesisQuestions blocks
const casePattern = /id:\s*'([^']+)'[\s\S]*?anamnesisQuestions:\s*\{([\s\S]*?)\}/g;
let match;
const results = {};

while ((match = casePattern.exec(raw)) !== null) {
    const caseId = match[1];
    const questionsBlock = match[2];

    // Find all question IDs in this block
    const idPattern = /id:\s*'([^']+)'/g;
    let idMatch;
    const ids = [];
    while ((idMatch = idPattern.exec(questionsBlock)) !== null) {
        ids.push(idMatch[1]);
    }

    results[caseId] = ids;
}

writeFileSync('./extracted_anamnesis_ids.json', JSON.stringify(results, null, 2));
console.log(`Extracted questions for ${Object.keys(results).length} cases.`);
