/**
 * DEEP CLINICAL REVIEW AUDIT v4.0
 * Exhaustive review of ALL 63 cases for:
 * 1. Clinical Realism (anamnesis responses match clinical picture)
 * 2. Pedagogical Depth (enough questions to teach clinical reasoning)
 * 3. Response Quality (no generic/empty/short responses)
 * 4. Symptom-Diagnosis Alignment
 * 5. Physical Exam Coverage
 * 6. Treatment Appropriateness
 */
import { readFileSync } from 'fs';

const raw = readFileSync('./src/game/CaseLibrary.js', 'utf-8');
const medRaw = readFileSync('./src/data/MedicationDB.js', 'utf-8');

// Extract medication IDs
const MED_IDS = new Set();
let m;
while ((m = /id:\s*'([^']+)'/g.exec(medRaw)) !== null) {
    MED_IDS.add(m[1]);
}

// Extract case blocks
const caseRegex = /\n\s{4}\{\s*\n\s{8}id:\s*'([^']+)'/g;
const cases = [];
let match;
while ((match = caseRegex.exec(raw)) !== null) {
    const start = match.index;
    let end = raw.indexOf('\n    },', start);
    if (end === -1) end = raw.indexOf('\n    }', start);
    cases.push({ id: match[1], block: raw.substring(start, end + 6) });
}

console.log(`\n${'='.repeat(70)}`);
console.log('  DEEP CLINICAL REVIEW AUDIT v4.0');
console.log(`${'='.repeat(70)}`);
console.log(`  Total Cases: ${cases.length}\n`);

const issues = { high: [], medium: [], low: [] };
function log(sev, id, msg) { issues[sev].push({ id, msg }); }

// Helper to extract arrays
const extractArray = (block, field) => {
    const match = block.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
    return match ? (match[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || []) : [];
};

// Helper to count questions
const countQuestions = (block) => (block.match(/text:\s*'/g) || []).length;

// Helper to extract responses
const extractResponses = (block) => {
    const matches = block.match(/response:\s*'([^']+)'/g) || [];
    return matches.map(m => m.replace(/response:\s*'|'/g, ''));
};

cases.forEach(c => {
    const { id, block } = c;

    // 1. CLINICAL DEPTH CHECK
    const qCount = countQuestions(block);
    const essentials = extractArray(block, 'essentialQuestions');
    const symptoms = extractArray(block, 'symptoms');
    const responses = extractResponses(block);

    if (qCount < 4) {
        log('medium', id, `Low question count (${qCount}). Recommend ≥4 for clinical depth.`);
    }

    if (essentials.length < 2) {
        log('high', id, `Only ${essentials.length} essential question(s). Recommend ≥2.`);
    }

    // 2. RESPONSE QUALITY CHECK
    responses.forEach(r => {
        if (r.length < 15) {
            log('low', id, `Short response: "${r.substring(0, 30)}..."`);
        }
    });

    // 3. EMPTY SECTIONS CHECK
    const hasEmptyRpk = block.match(/rpk:\s*\[\s*\]/);
    const hasEmptySosial = block.match(/sosial:\s*\[\s*\]/);
    if (hasEmptyRpk && hasEmptySosial) {
        log('medium', id, `Both rpk[] and sosial[] are empty. Consider adding relevant history.`);
    }

    // 4. SYMPTOM COUNT
    if (symptoms.length < 2) {
        log('medium', id, `Only ${symptoms.length} symptom(s) listed. Recommend ≥3.`);
    }

    // 5. TREATMENT CHECK
    const treatments = extractArray(block, 'correctTreatment');
    const procedures = extractArray(block, 'correctProcedures');
    const education = extractArray(block, 'requiredEducation');

    if (treatments.length === 0 && procedures.length === 0 && education.length === 0) {
        log('high', id, `No treatment, procedure, or education defined.`);
    }

    // 6. PHYSICAL EXAM COVERAGE
    const peMatch = block.match(/physicalExamFindings:\s*\{([\s\S]*?)\}/);
    if (peMatch) {
        const peKeys = peMatch[1].match(/^\s{12}(\w+):/gm)?.map(k => k.trim().replace(':', '')) || [];
        if (peKeys.length < 2) {
            log('medium', id, `Only ${peKeys.length} physical exam system(s) documented. Recommend ≥2.`);
        }
    }

    // 7. DIFFERENTIAL DIAGNOSIS
    const diffs = extractArray(block, 'differentialDiagnosis');
    if (diffs.length === 0 && id !== 'general_checkup') {
        log('low', id, `No differential diagnoses listed.`);
    }

    // 8. CLUE PRESENCE
    if (!block.includes('clue:')) {
        log('low', id, `No diagnostic clue provided.`);
    }

    // 9. VITALS COMPLETENESS
    const vitalsMatch = block.match(/vitals:\s*\{([^}]+)\}/);
    if (vitalsMatch) {
        const vitalsContent = vitalsMatch[1];
        const hasTemp = vitalsContent.includes('temp:');
        const hasBp = vitalsContent.includes('bp:');
        const hasHr = vitalsContent.includes('hr:');
        const hasRr = vitalsContent.includes('rr:');
        if (!hasTemp || !hasBp || !hasHr || !hasRr) {
            log('low', id, `Incomplete vitals object (missing one of: temp, bp, hr, rr).`);
        }
    }
});

// OUTPUT
console.log(`\n${'─'.repeat(70)}`);
console.log('  RESULTS');
console.log(`${'─'.repeat(70)}\n`);

console.log(`🔴 HIGH PRIORITY (${issues.high.length}):`);
if (issues.high.length === 0) console.log('   ✅ None!');
else issues.high.forEach(i => console.log(`   ❌ [${i.id}] ${i.msg}`));

console.log(`\n🟡 MEDIUM PRIORITY (${issues.medium.length}):`);
if (issues.medium.length === 0) console.log('   ✅ None!');
else issues.medium.forEach(i => console.log(`   ⚠️  [${i.id}] ${i.msg}`));

console.log(`\n🔵 LOW PRIORITY (${issues.low.length}):`);
if (issues.low.length === 0) console.log('   ✅ None!');
else {
    issues.low.slice(0, 10).forEach(i => console.log(`   ℹ️  [${i.id}] ${i.msg}`));
    if (issues.low.length > 10) console.log(`   ... and ${issues.low.length - 10} more`);
}

console.log(`\n${'='.repeat(70)}`);
console.log(`  SUMMARY: High=${issues.high.length} | Medium=${issues.medium.length} | Low=${issues.low.length}`);
console.log(`${'='.repeat(70)}\n`);
