/**
 * SIMULATION v3 — End-to-End Flow + Data Integrity
 * ==================================================
 * NEW perspectives:
 *  1. getAdaptiveResponse() END-TO-END (the real function, not manual pipeline)
 *  2. CASE DATA INTEGRITY: missing fields, empty arrays, malformed data
 *  3. QUESTION ID COLLISIONS: same q.id across different cases
 *  4. DEMEANOR CUE coherence: does getGenericDemeanor match the case?
 *  5. VARIATIONS system: does the priority chain work?
 *  6. VAGUE→CLARIFIED round-trip: does clarifiedResponse preserve clinical info?
 *  7. RESPONSE LENGTH POST-PIPELINE: does the full pipeline create >200 char?
 *  8. WHITESPACE anomalies: leading/trailing spaces, double spaces
 *  9. MIXED LANGUAGE: English fragments leaking into Indonesian responses
 * 10. ADAPTATION IDEMPOTENCY: calling applyPersonaAdaptation twice
 */

import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import { GENERIC_QUESTIONS } from '../src/game/anamnesis/Constants.js';
import {
    applyPersonaAdaptation,
    calculateVaguenessScore,
    pickFromPool,
    resetPersonaMemory,
    updateEmotionState
} from '../src/game/anamnesis/EmotionEngine.js';
import {
    adaptTextForGender,
    getPrefix,
    getDoctorAcknowledgment,
    getInitialComplaintResponse,
    getSpeakerLabel
} from '../src/game/anamnesis/TextAdapter.js';
import { getInformantMode } from '../src/game/anamnesis/InformantSystem.js';
import {
    generateGreeting,
    getGenericDemeanor,
    getChildDirectQuestions,
    getAdaptiveResponse
} from '../src/game/anamnesis/DialogueEngine.js';

const issues = {
    e2eBug: [],
    dataIntegrity: [],
    idCollision: [],
    demeanorCoherence: [],
    variationBug: [],
    vagueClarify: [],
    lengthPostPipeline: [],
    whitespaceBug: [],
    mixedLanguage: [],
    idempotencyBug: [],
    doubleAdaptation: [],
};

let stats = { total: 0, cases: 0 };

console.log('═══════════════════════════════════════════════════════════');
console.log('  PRIMER — Simulation v3: End-to-End + Data Integrity');
console.log('═══════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════
// TEST 1: CASE DATA INTEGRITY
// ═══════════════════════════════════════════════════════════
console.log('── TEST 1: Case Data Integrity ──');
let dataIssues = 0;
for (const c of CASE_LIBRARY) {
    stats.cases++;
    // Required fields
    if (!c.id) { issues.dataIntegrity.push({ case: '??', error: 'Missing id', diag: c.diagnosis }); dataIssues++; }
    if (!c.diagnosis) { issues.dataIntegrity.push({ case: c.id, error: 'Missing diagnosis' }); dataIssues++; }
    if (!c.symptoms || c.symptoms.length === 0) { issues.dataIntegrity.push({ case: c.id, error: 'No symptoms' }); dataIssues++; }
    if (!c.anamnesisQuestions) { issues.dataIntegrity.push({ case: c.id, error: 'No anamnesisQuestions' }); dataIssues++; continue; }

    // Check question structure
    for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
        if (!Array.isArray(qs)) {
            issues.dataIntegrity.push({ case: c.id, error: `Category ${cat} is not array`, type: typeof qs });
            dataIssues++;
            continue;
        }
        for (const q of qs) {
            if (!q.id) { issues.dataIntegrity.push({ case: c.id, cat, error: 'Question missing id', text: q.text?.substring(0, 40) }); dataIssues++; }
            if (!q.text) { issues.dataIntegrity.push({ case: c.id, cat, qId: q.id, error: 'Question missing text' }); dataIssues++; }
            if (!q.response) { issues.dataIntegrity.push({ case: c.id, cat, qId: q.id, error: 'Question missing response' }); dataIssues++; }
            // Response is a string?
            if (q.response && typeof q.response !== 'string') {
                issues.dataIntegrity.push({ case: c.id, qId: q.id, error: 'Response is not string', type: typeof q.response });
                dataIssues++;
            }
            // Variations well-formed?
            if (q.variations && typeof q.variations !== 'object') {
                issues.dataIntegrity.push({ case: c.id, qId: q.id, error: 'Variations is not object' });
                dataIssues++;
            }
        }
    }

    // Essential questions reference valid IDs?
    if (c.essentialQuestions) {
        const allIds = new Set();
        for (const qs of Object.values(c.anamnesisQuestions)) {
            if (Array.isArray(qs)) qs.forEach(q => allIds.add(q.id));
        }
        for (const eqId of c.essentialQuestions) {
            if (!allIds.has(eqId)) {
                issues.dataIntegrity.push({ case: c.id, error: `Essential question "${eqId}" not found in questions` });
                dataIssues++;
            }
        }
    }
}
console.log(`   ${dataIssues === 0 ? '✅' : '❌'} ${dataIssues} data integrity issues in ${stats.cases} cases\n`);

// ═══════════════════════════════════════════════════════════
// TEST 2: QUESTION ID COLLISIONS
// ═══════════════════════════════════════════════════════════
console.log('── TEST 2: Question ID Collisions ──');
const idMap = {};
for (const c of CASE_LIBRARY) {
    const qs = c.anamnesisQuestions;
    if (!qs) continue;
    // Same ID within the same case?
    const caseIds = new Set();
    for (const [cat, questions] of Object.entries(qs)) {
        if (!Array.isArray(questions)) continue;
        for (const q of questions) {
            if (!q.id) continue;
            if (caseIds.has(q.id)) {
                issues.idCollision.push({ case: c.id, qId: q.id, error: 'Duplicate ID within same case' });
            }
            caseIds.add(q.id);
            // Track cross-case
            if (!idMap[q.id]) idMap[q.id] = [];
            idMap[q.id].push(c.id);
        }
    }
}
// Cross-case collisions with DIFFERENT responses
let crossCollisions = 0;
for (const [qId, cases] of Object.entries(idMap)) {
    if (cases.length > 1 && qId === 'q_main') continue; // q_main is expected across cases
    if (cases.length > 20) {
        // Flag suspiciously shared IDs (except known generic ones)
        const knownShared = ['q_main', 'q_fever', 'q_fam', 'q_history', 'q_allergy', 'q_smoke',
            'q_cough', 'q_sob', 'q_duration', 'q_contact', 'q_vaccine'];
        if (!knownShared.includes(qId)) {
            issues.idCollision.push({ qId, count: cases.length, error: 'Shared across many cases', sample: cases.slice(0, 5).join(', ') });
            crossCollisions++;
        }
    }
}
console.log(`   ${issues.idCollision.length === 0 ? '✅' : '⚠️'} ${issues.idCollision.length} ID collision issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 3: END-TO-END getAdaptiveResponse
// ═══════════════════════════════════════════════════════════
console.log('── TEST 3: End-to-End getAdaptiveResponse ──');
let e2eIssues = 0;
const personas = [
    { name: 'Default', age: 35, gender: 'L', communicationStyle: 'concise', demeanor: '', social: {} },
    { name: 'Verbose+Dramatic', age: 40, gender: 'P', communicationStyle: 'verbose', demeanor: 'dramatic', social: {} },
    { name: 'Vague+Anxious', age: 50, gender: 'L', communicationStyle: 'vague', demeanor: 'anxious', social: {} },
    { name: 'Elderly+Stoic', age: 75, gender: 'P', communicationStyle: 'concise', demeanor: 'stoic', social: {} },
    { name: 'LowEdu', age: 30, gender: 'L', communicationStyle: 'verbose', demeanor: '', social: { education: 'SD' } },
    { name: 'HighEdu', age: 32, gender: 'P', communicationStyle: 'concise', demeanor: '', social: { education: 'S1' } },
    { name: 'Child', age: 5, gender: 'L', communicationStyle: 'concise', demeanor: '', informant: { required: true, reason: 'pediatric', relation: 'Ibu' } },
    { name: 'Skeptical', age: 45, gender: 'L', communicationStyle: 'concise', demeanor: '', social: { trustLevel: 'skeptical' } },
];

// Pick 30 representative cases
const sampleCases = CASE_LIBRARY.filter((c, i) => i % 9 === 0).slice(0, 30);

for (const caseData of sampleCases) {
    const qs = caseData.anamnesisQuestions;
    if (!qs) continue;
    const allQs = [];
    for (const [cat, questions] of Object.entries(qs)) {
        if (Array.isArray(questions)) allQs.push(...questions);
    }

    for (const persona of personas) {
        resetPersonaMemory();
        const patient = { ...persona, complaint: caseData.symptoms?.[0] || '' };
        let context = { introduced: true, trust: 0.5, patience: 1.0, count: 0 };

        for (const q of allQs) {
            stats.total++;
            context = updateEmotionState(context, 'question');
            try {
                const result = await getAdaptiveResponse(q, patient, caseData.id, context);

                // Must return proper shape
                if (!result || typeof result !== 'object') {
                    issues.e2eBug.push({ case: caseData.id, qId: q.id, persona: persona.name, error: 'Not an object', result });
                    e2eIssues++;
                    continue;
                }
                if (typeof result.text !== 'string') {
                    issues.e2eBug.push({ case: caseData.id, qId: q.id, persona: persona.name, error: 'text not string', type: typeof result.text });
                    e2eIssues++;
                }
                if (typeof result.rawClinical !== 'string') {
                    issues.e2eBug.push({ case: caseData.id, qId: q.id, persona: persona.name, error: 'rawClinical not string', type: typeof result.rawClinical });
                    e2eIssues++;
                }
                if (!result.text || result.text.length < 3) {
                    issues.e2eBug.push({ case: caseData.id, qId: q.id, persona: persona.name, error: 'Empty/too-short text', text: result.text });
                    e2eIssues++;
                }
                if (!result.rawClinical || result.rawClinical.length < 3) {
                    issues.e2eBug.push({ case: caseData.id, qId: q.id, persona: persona.name, error: 'Empty rawClinical' });
                    e2eIssues++;
                }

                // text should CONTAIN rawClinical or be a vague replacement
                if (!result.isVague && !result.text.includes(result.rawClinical.substring(0, 15))) {
                    // Persona adaptation may have prepended/appended, so check overlap
                    const overlap = result.rawClinical.substring(0, Math.min(20, result.rawClinical.length));
                    if (!result.text.includes(overlap)) {
                        issues.e2eBug.push({
                            case: caseData.id, qId: q.id, persona: persona.name,
                            error: 'text lost rawClinical content',
                            text: result.text.substring(0, 60),
                            raw: result.rawClinical.substring(0, 60)
                        });
                        e2eIssues++;
                    }
                }

                // LENGTH check post-pipeline
                if (result.text.length > 200) {
                    issues.lengthPostPipeline.push({
                        case: caseData.id, qId: q.id, persona: persona.name,
                        len: result.text.length, text: result.text.substring(0, 100)
                    });
                }

                // WHITESPACE check
                if (result.text !== result.text.trim()) {
                    issues.whitespaceBug.push({ case: caseData.id, qId: q.id, error: 'leading/trailing whitespace', text: `[${result.text.substring(0, 40)}]` });
                }
                if (/\s{3,}/.test(result.text)) {
                    issues.whitespaceBug.push({ case: caseData.id, qId: q.id, error: 'triple+ space', text: result.text.substring(0, 60) });
                }

                // MIXED LANGUAGE check
                if (/\b(the|and|with|from|this|that|is|are|was|were|has|have|but|not|for)\b/i.test(result.text)) {
                    // Skip if it's part of a medical term
                    if (!/\b(shift to the left|post-tussive)\b/i.test(result.text)) {
                        issues.mixedLanguage.push({
                            case: caseData.id, qId: q.id,
                            text: result.text.substring(0, 80)
                        });
                    }
                }

            } catch (e) {
                issues.e2eBug.push({ case: caseData.id, qId: q.id, persona: persona.name, error: `Exception: ${e.message}` });
                e2eIssues++;
            }
        }
    }
}
console.log(`   ${e2eIssues === 0 ? '✅' : '❌'} ${e2eIssues} e2e issues in ${stats.total} tests\n`);

// ═══════════════════════════════════════════════════════════
// TEST 4: DEMEANOR CUE COHERENCE
// ═══════════════════════════════════════════════════════════
console.log('── TEST 4: Demeanor Cue Coherence ──');
let demIssues = 0;
const complaintsToTest = [
    { complaint: 'nyeri perut', expected: ['sakit', 'meringis', 'memegang', 'kesakitan'] },
    { complaint: 'pusing', expected: ['lesu', 'pucat', 'sempoyongan', 'lemas', 'lelah'] },
    { complaint: 'sesak napas', expected: ['bernafas', 'pendek', 'batuk', 'terengah'] },
    { complaint: 'demam tinggi', expected: ['nyaman', 'memerah', 'demam', 'keringat'] },
    { complaint: 'cemas berlebihan', expected: ['gelisah', 'cemas', 'gemetar', 'bergoyang'] },
    { complaint: 'batuk', expected: [] }, // No specific match — should fall to neutral
];
for (const test of complaintsToTest) {
    for (let i = 0; i < 10; i++) {
        const p = { name: 'Test', age: 35, gender: 'L', complaint: test.complaint, social: {} };
        const cue = getGenericDemeanor(p);
        if (!cue || cue.length < 3) {
            issues.demeanorCoherence.push({ complaint: test.complaint, error: 'Empty cue', cue });
            demIssues++;
        }
        // Should contain at least one expected keyword (if specified)
        if (test.expected.length > 0) {
            const matchesAny = test.expected.some(kw => cue.toLowerCase().includes(kw));
            if (!matchesAny) {
                issues.demeanorCoherence.push({
                    complaint: test.complaint,
                    error: `Cue doesn't match expected: ${test.expected.join('|')}`,
                    cue
                });
                demIssues++;
            }
        }
    }
}
console.log(`   ${demIssues === 0 ? '✅' : '❌'} ${demIssues} demeanor cue issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 5: VARIATIONS SYSTEM
// ═══════════════════════════════════════════════════════════
console.log('── TEST 5: Variations System ──');
let varIssues = 0;
const casesWithVariations = CASE_LIBRARY.filter(c => {
    const qs = c.anamnesisQuestions;
    if (!qs) return false;
    return Object.values(qs).flat().some(q => q?.variations);
});
console.log(`   Found ${casesWithVariations.length} cases with variations`);
for (const c of casesWithVariations) {
    for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
        if (!Array.isArray(qs)) continue;
        for (const q of qs) {
            if (!q.variations) continue;
            // Check each variation is a non-empty string
            for (const [key, val] of Object.entries(q.variations)) {
                if (typeof val !== 'string' || val.length < 3) {
                    issues.variationBug.push({ case: c.id, qId: q.id, key, error: 'Bad variation value', val });
                    varIssues++;
                }
            }
            // Test that the right variation gets picked
            for (const profile of [
                { age: 5, gender: 'L', social: {}, informant: { required: true }, expected: 'informant' },
                { age: 5, gender: 'L', social: {}, expected: 'pediatric' },
                { age: 35, gender: 'L', social: { trustLevel: 'skeptical' }, expected: 'skeptical' },
                { age: 75, gender: 'P', social: {}, expected: 'elderly' },
                { age: 30, gender: 'L', social: { education: 'SD' }, expected: 'low_education' },
                { age: 30, gender: 'P', social: { education: 'S1' }, expected: 'high_education' },
            ]) {
                if (q.variations[profile.expected]) {
                    resetPersonaMemory();
                    const patient = { ...profile, name: 'VarTest', communicationStyle: 'concise', demeanor: '', complaint: c.symptoms?.[0] || '' };
                    try {
                        const result = await getAdaptiveResponse(q, patient, c.id, { trust: 0.5, patience: 1.0, count: 1 });
                        // rawClinical should reflect the variation, not the base
                        if (!result.rawClinical.includes(q.variations[profile.expected].substring(0, 15)) && !result.isVague) {
                            issues.variationBug.push({
                                case: c.id, qId: q.id, profile: profile.expected,
                                error: 'Variation not picked',
                                raw: result.rawClinical.substring(0, 50),
                                expected: q.variations[profile.expected].substring(0, 50)
                            });
                            varIssues++;
                        }
                    } catch (e) {
                        issues.variationBug.push({ case: c.id, qId: q.id, profile: profile.expected, error: e.message });
                        varIssues++;
                    }
                }
            }
        }
    }
}
console.log(`   ${varIssues === 0 ? '✅' : '❌'} ${varIssues} variation issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 6: IDEMPOTENCY (double adaptation)
// ═══════════════════════════════════════════════════════════
console.log('── TEST 6: Adaptation Idempotency ──');
let idempIssues = 0;
const testResponses = [
    'Demam tinggi sudah 3 hari ini.',
    'Nggak ada dok.',
    'Batuk berdahak warna kuning.',
    'Suka minum es teh.',
];
for (const resp of testResponses) {
    for (const combo of [
        { style: 'verbose', demeanor: 'dramatic' },
        { style: 'concise', demeanor: 'anxious' },
        { style: 'concise', demeanor: 'stoic' },
    ]) {
        resetPersonaMemory();
        const p = { name: 'Test', age: 35, gender: 'L', communicationStyle: combo.style, demeanor: combo.demeanor, complaint: 'sakit' };
        const ctx = { trust: 0.5, patience: 0.8, count: 3 };

        const first = applyPersonaAdaptation(resp, p, ctx, { questionId: 'q_test_1' });
        // Apply again on already-adapted result
        const second = applyPersonaAdaptation(first, p, ctx, { questionId: 'q_test_2' });

        // Check: second pass shouldn't double-stack (it may add more, but not the same suffix)
        const addedFirst = first.length - resp.length;
        const addedSecond = second.length - first.length;
        if (addedFirst > 0 && addedSecond > addedFirst * 1.5 && second.length > 200) {
            issues.idempotencyBug.push({
                base: resp.substring(0, 40),
                combo: `${combo.style}+${combo.demeanor}`,
                firstLen: first.length,
                secondLen: second.length,
                second: second.substring(0, 100)
            });
            idempIssues++;
        }
    }
}
console.log(`   ${idempIssues === 0 ? '✅' : '⚠️'} ${idempIssues} idempotency issues\n`);

// ═══════════════════════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════');
console.log('  SIMULATION v3 — RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`📊 STATS: ${stats.cases} cases, ${stats.total} total e2e tests\n`);

const printIssues = (label, list, maxShow = 10) => {
    if (list.length === 0) { console.log(`✅ ${label}: 0 issues\n`); return; }
    const icon = list.length <= 5 ? '⚠️' : '❌';
    console.log(`${icon} ${label}: ${list.length} issues`);
    list.slice(0, maxShow).forEach((item, i) => console.log(`   ${i + 1}. ${JSON.stringify(item)}`));
    if (list.length > maxShow) console.log(`   ... and ${list.length - maxShow} more`);
    console.log('');
};

printIssues('CASE DATA INTEGRITY', issues.dataIntegrity, 15);
printIssues('ID COLLISIONS', issues.idCollision);
printIssues('E2E getAdaptiveResponse', issues.e2eBug, 15);
printIssues('LENGTH POST-PIPELINE (>200)', issues.lengthPostPipeline);
printIssues('WHITESPACE BUGS', issues.whitespaceBug, 10);
printIssues('MIXED LANGUAGE', issues.mixedLanguage, 10);
printIssues('DEMEANOR CUE COHERENCE', issues.demeanorCoherence);
printIssues('VARIATIONS SYSTEM', issues.variationBug, 10);
printIssues('ADAPTATION IDEMPOTENCY', issues.idempotencyBug);

let total = 0;
for (const v of Object.values(issues)) total += v.length;
console.log('═══════════════════════════════════════════════════════════');
console.log(`  ${total === 0 ? '🏆 ALL CLEAR' : `⚠️ ${total} total issues`}`);
console.log('═══════════════════════════════════════════════════════════\n');
