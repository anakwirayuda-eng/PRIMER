/**
 * Audit script: Parses CaseLibrary.js as text and analyzes anamnesis quality
 */
import { readFileSync } from 'fs';

const raw = readFileSync('./src/game/CaseLibrary.js', 'utf-8');

// Extract CASE_LIBRARY array using regex - only find top-level case objects (indented by 4 spaces)
const casePattern = /\n\s{4}\{\s*\n\s{8}id:\s*'([^']+)'/g;
let match;
const caseIds = [];
while ((match = casePattern.exec(raw)) !== null) {
    caseIds.push({ id: match[1], pos: match.index });
}

console.log(`\n========== ANAMNESIS AUDIT ==========\n`);
console.log(`Total case IDs found: ${caseIds.length}\n`);

let withStructured = 0, withLegacyOnly = 0, noAnamnesis = 0;
const issues = [];

caseIds.forEach((entry, idx) => {
    const start = entry.pos;
    const end = idx < caseIds.length - 1 ? caseIds[idx + 1].pos : raw.length;
    const block = raw.substring(start, end);
    const id = entry.id;

    // Extract diagnosis  
    const diagMatch = block.match(/diagnosis:\s*'([^']+)'/);
    const diag = diagMatch ? diagMatch[1] : 'UNKNOWN';

    // Extract category
    const catMatch = block.match(/category:\s*'([^']+)'/);
    const cat = catMatch ? catMatch[1] : 'UNKNOWN';

    const hasStructured = block.includes('anamnesisQuestions:');
    const hasLegacy = block.includes('anamnesis:') && block.includes('anamnesis: [');

    if (!hasStructured && !hasLegacy) {
        noAnamnesis++;
        issues.push({ id, severity: 'CRITICAL', msg: `NO anamnesis data (diag: ${diag})` });
        return;
    }

    if (!hasStructured) {
        withLegacyOnly++;
        issues.push({ id, severity: 'WARNING', msg: `Only legacy anamnesis[] array, no anamnesisQuestions (diag: ${diag})` });
        return;
    }

    withStructured++;

    // Check sections
    const sections = ['keluhan_utama', 'rps', 'rpd', 'rpk', 'sosial'];
    const missing = sections.filter(s => !block.includes(`${s}:`));
    if (missing.length > 0) {
        issues.push({ id, severity: 'WARNING', msg: `Missing sections: ${missing.join(', ')} (diag: ${diag})` });
    }

    // Check essentialQuestions
    if (!block.includes('essentialQuestions')) {
        issues.push({ id, severity: 'WARNING', msg: `No essentialQuestions (diag: ${diag})` });
    }

    // Count questions
    const questionMatches = block.match(/text:\s*'/g);
    const questionCount = questionMatches ? questionMatches.length : 0;
    if (questionCount < 4) {
        issues.push({ id, severity: 'WARNING', msg: `Only ${questionCount} anamnesis questions (min 4 expected) (diag: ${diag})` });
    }

    // Check for empty responses
    const emptyResp = block.match(/response:\s*''/g);
    if (emptyResp) {
        issues.push({ id, severity: 'CRITICAL', msg: `${emptyResp.length} empty response(s) (diag: ${diag})` });
    }

    // Cross-check: essentialQuestions references vs actual question ids
    const essMatch = block.match(/essentialQuestions:\s*\[([^\]]+)\]/);
    if (essMatch) {
        const essIds = essMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
        const qIds = [];
        const qIdPattern = /id:\s*'(q_[^']+)'/g;
        let qm;
        while ((qm = qIdPattern.exec(block)) !== null) {
            qIds.push(qm[1]);
        }
        const broken = essIds.filter(e => !qIds.includes(e));
        if (broken.length > 0) {
            issues.push({ id, severity: 'CRITICAL', msg: `essentialQuestions reference missing ids: ${broken.join(', ')} (available: ${qIds.join(', ')})` });
        }
    }

    // Check symptoms array exists
    if (!block.includes('symptoms:')) {
        issues.push({ id, severity: 'WARNING', msg: `No symptoms array (diag: ${diag})` });
    }

    // Check physicalExamFindings
    if (!block.includes('physicalExamFindings:')) {
        issues.push({ id, severity: 'WARNING', msg: `No physicalExamFindings (diag: ${diag})` });
    }
});

// Summary
console.log(`With structured anamnesisQuestions: ${withStructured}`);
console.log(`With legacy anamnesis[] only: ${withLegacyOnly}`);
console.log(`With NO anamnesis at all: ${noAnamnesis}\n`);

const critical = issues.filter(i => i.severity === 'CRITICAL');
const warnings = issues.filter(i => i.severity === 'WARNING');

console.log(`--- CRITICAL (${critical.length}) ---`);
critical.forEach(i => console.log(`  ❌ [${i.id}] ${i.msg}`));
console.log(`\n--- WARNINGS (${warnings.length}) ---`);
warnings.forEach(i => console.log(`  ⚠  [${i.id}] ${i.msg}`));

console.log(`\n========== END ==========`);
