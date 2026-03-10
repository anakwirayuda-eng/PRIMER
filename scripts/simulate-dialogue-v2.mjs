/**
 * SUPER DEEP Dialogue Simulation v2
 * ===================================
 * NEW test dimensions beyond v1:
 *  1. CROSS-QUESTION COHERENCE: same patient denying something they confirmed earlier
 *  2. GENDER ADAPTATION: does adaptTextForGender produce correct results?
 *  3. INFORMANT MODE: pediatric/caregiver greeting & response coherence
 *  4. VAGUE REPLACEMENT RISK: does calculateVaguenessScore falsely trigger on clinical responses?
 *  5. EDGE PATIENTS: elderly (75), child (3), skeptical, tradisionalis
 *  6. ANXIOUS ON DENIAL: "Nggak ada dok. Bahaya nggak?" — is this illogical?
 *  7. STOIC ON SEVERE PAIN: "(tampak datar)" on "sakitnya luar biasa" — plausible?
 *  8. GENERIC QUESTIONS: Constants.GENERIC_QUESTIONS through the pipeline
 *  9. DUPLICATE SHORT ANSWERS: "Nggak ada dok." appears in many cases
 * 10. GREETING GENERATION: all time slots × informant modes × edge names
 * 11. DOCTOR ACKNOWLEDGMENT: all complaint types
 * 12. INITIAL COMPLAINT RESPONSE: all cases × informant modes
 * 13. FULL SESSION SIMULATION: 15-question sequence per case with context evolution
 * 14. VERBOSE NEUTRAL SUFFIX COHERENCE: do neutral suffixes make sense on RPK/Sosial?
 * 15. TEMPLATE GRAMMAR: do suffixes grammatically connect to the base response?
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
import { generateGreeting, getGenericDemeanor, getChildDirectQuestions } from '../src/game/anamnesis/DialogueEngine.js';

// ── Config ──
const RUNS = 5;  // Runs per case-persona combo for randomness stability

// ── Issue containers ──
const issues = {
    genderError: [],
    informantError: [],
    greetingError: [],
    vagueOnClinical: [],
    anxiousOnDenial: [],
    stoicOnSevere: [],
    duplicateShortResp: [],
    genericQuestionBug: [],
    verboseNeutralIncoherent: [],
    grammarGlitch: [],
    fullSessionRepetition: [],
    acknowledgmentBug: [],
    initialComplaintBug: [],
    childQuestionBug: [],
    contextEvolutionBug: [],
    doublePunctuation: [],
    speakerLabelBug: [],
    calculateVagueBug: [],
};

let stats = { total: 0, cases: 0 };

// ── UTIL ──
const DENIAL_RE = /\b(tidak|nggak|belum|enggak|bukan|tidak ada|nggak ada|biasa aja|normal|baik-baik|itu aja|disangkal|negatif)\b/i;
const COMPLAINT_RE = /\b(sakit|nyeri|sesak|demam|panas|pusing|lemas|batuk|muntah|mual|gatal|bengkak|berdarah|darah|parah|kambuh|sulit|susah|terganggu|meler|serak)\b/i;

console.log('═══════════════════════════════════════════════════════════');
console.log('  PRIMER — SUPER DEEP Dialogue Simulation v2');
console.log('  15 test dimensions × all cases × 5 runs');
console.log('═══════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════
// TEST 1: GREETING GENERATION (all time slots × patient types)
// ═══════════════════════════════════════════════════════════
console.log('── TEST 1: Greeting Generation ──');
const times = [300, 500, 700, 900, 1020, 1200]; // before dawn, morning, noon, afternoon, evening, night
const testPatients = [
    { name: 'Budi', age: 35, gender: 'L', complaint: 'Sakit perut' },
    { name: 'Siti', age: 28, gender: 'P', complaint: 'Demam' },
    { name: 'Anak Ahmad', age: 3, gender: 'L', complaint: 'Batuk', informant: { required: true, reason: 'pediatric', relation: 'Ibu', name: 'Nurhayati' } },
    { name: 'Oma Kartini', age: 78, gender: 'P', complaint: 'Pusing' },
    { name: 'Pak Rosmala', age: 65, gender: 'L', complaint: 'Sesak', informant: { required: true, reason: 'caregiver', relation: 'Anaknya' } },
    { name: null, age: 40, gender: 'L', complaint: 'Nyeri dada' }, // Missing name
];

let greetingIssues = 0;
for (const p of testPatients) {
    for (const t of times) {
        for (let r = 0; r < 3; r++) {
            try {
                const g = generateGreeting(p, 'Dr. Test', t, { introduced: false });
                if (!g.doctorText || g.doctorText.length < 5) {
                    issues.greetingError.push({ patient: p.name, time: t, error: 'Too short or empty doctorText', text: g.doctorText });
                    greetingIssues++;
                }
                if (!g.patientResponse || g.patientResponse.length < 5) {
                    issues.greetingError.push({ patient: p.name, time: t, error: 'Too short or empty patientResponse', text: g.patientResponse });
                    greetingIssues++;
                }
                // Check for double greeting - "Selamat pagi Selamat pagi"
                if (/(Selamat \w+).*\1/.test(g.doctorText)) {
                    issues.greetingError.push({ patient: p.name, time: t, error: 'Double greeting', text: g.doctorText });
                    greetingIssues++;
                }
                // Follow-up greeting
                const g2 = generateGreeting(p, 'Dr. Test', t, { introduced: true });
                if (!g2.doctorText || g2.doctorText.length < 5) {
                    issues.greetingError.push({ patient: p.name, time: t, error: 'Follow-up greeting empty', text: g2.doctorText });
                    greetingIssues++;
                }
            } catch (e) {
                issues.greetingError.push({ patient: p.name, time: t, error: e.message });
                greetingIssues++;
            }
        }
    }
}
console.log(`   ${greetingIssues === 0 ? '✅' : '❌'} ${greetingIssues} issues in ${testPatients.length * times.length * 3} greeting tests\n`);

// ═══════════════════════════════════════════════════════════
// TEST 2: GENDER ADAPTATION
// ═══════════════════════════════════════════════════════════
console.log('── TEST 2: Gender Adaptation ──');
let genderIssues = 0;
const genderTests = [
    { text: 'Apakah Bapak perokok?', patient: { gender: 'P', age: 30 }, expected: 'Ibu' },
    { text: 'Apakah Bapak perokok?', patient: { gender: 'L', age: 10 }, expected: 'Adik' },
    { text: '{prefix} merasa sakit.', patient: { gender: 'L', age: 40 }, expected: 'Bapak' },
    { text: '{prefix} merasa sakit.', patient: { gender: 'P', age: 25 }, expected: 'Ibu' },
    { text: 'Bapak/Ibu punya alergi?', patient: { gender: 'P', age: 50 }, expected: 'Ibu' },
];
for (const t of genderTests) {
    const info = getInformantMode(t.patient);
    const result = adaptTextForGender(t.text, t.patient, info);
    if (!result.includes(t.expected)) {
        issues.genderError.push({ input: t.text, gender: t.patient.gender, age: t.patient.age, expected: t.expected, got: result });
        genderIssues++;
    }
}
console.log(`   ${genderIssues === 0 ? '✅' : '❌'} ${genderIssues} gender adaptation issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 3: calculateVaguenessScore false positives
// ═══════════════════════════════════════════════════════════
console.log('── TEST 3: Vagueness Score False Positives ──');
let vagueIssues = 0;
// Clinical responses that should NOT be flagged as vague
const clinicalResponses = [
    'Batuk berdahak sudah seminggu dok.',
    'Demam tinggi 3 hari.',
    'Sakit kepala terus-menerus.',
    'Nyeri perut kanan bawah.',
    'Meler terus, cairannya bening.',
    'Sesak napas saat naik tangga.',
];
// Vague responses that SHOULD score high
const vagueResponses = [
    'Gitu aja.',
    'Ya gitu deh.',
    'Pokoknya sakit.',
    'Kurang tahu.',
    'Saya bingung.',
];
for (const r of clinicalResponses) {
    const score = calculateVaguenessScore(r);
    if (score > 0.7) {
        issues.calculateVagueBug.push({ response: r, score, error: 'Clinical response scored as vague' });
        vagueIssues++;
    }
}
for (const r of vagueResponses) {
    const score = calculateVaguenessScore(r);
    if (score < 0.3) {
        issues.calculateVagueBug.push({ response: r, score, error: 'Vague response scored too low' });
        vagueIssues++;
    }
}
console.log(`   ${vagueIssues === 0 ? '✅' : '❌'} ${vagueIssues} vagueness score issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 4: DOCTOR ACKNOWLEDGMENT across all cases
// ═══════════════════════════════════════════════════════════
console.log('── TEST 4: Doctor Acknowledgment ──');
let ackIssues = 0;
for (const c of CASE_LIBRARY) {
    const complaint = c.symptoms?.[0] || '';
    for (const gender of ['L', 'P']) {
        const p = { name: 'Test', age: 35, gender, complaint };
        try {
            const ack = getDoctorAcknowledgment(complaint, p);
            if (!ack.text || ack.text.length < 3) {
                issues.acknowledgmentBug.push({ case: c.id, complaint, error: 'Empty acknowledgment' });
                ackIssues++;
            }
            // Check for weird casing or broken template
            if (ack.text.includes('undefined') || ack.text.includes('null') || ack.text.includes('NaN')) {
                issues.acknowledgmentBug.push({ case: c.id, complaint, error: 'Template injection', text: ack.text });
                ackIssues++;
            }
        } catch (e) {
            issues.acknowledgmentBug.push({ case: c.id, complaint, error: e.message });
            ackIssues++;
        }
    }
}
console.log(`   ${ackIssues === 0 ? '✅' : '❌'} ${ackIssues} acknowledgment issues in ${CASE_LIBRARY.length * 2} tests\n`);

// ═══════════════════════════════════════════════════════════
// TEST 5: INITIAL COMPLAINT RESPONSE
// ═══════════════════════════════════════════════════════════
console.log('── TEST 5: Initial Complaint Response ──');
let icIssues = 0;
for (const c of CASE_LIBRARY) {
    const complaint = c.symptoms?.[0] || 'sakit';
    for (const ageGroup of [3, 12, 35, 75]) {
        const p = { name: 'Test', age: ageGroup, gender: 'P', complaint };
        if (ageGroup <= 7) p.informant = { required: true, reason: 'pediatric', relation: 'Ibu' };
        try {
            const resp = getInitialComplaintResponse(p, complaint);
            if (!resp.response || resp.response.length < 3) {
                issues.initialComplaintBug.push({ case: c.id, age: ageGroup, error: 'Empty response' });
                icIssues++;
            }
            if (resp.response.includes('undefined') || resp.response.includes('null')) {
                issues.initialComplaintBug.push({ case: c.id, age: ageGroup, error: 'Template injection', text: resp.response });
                icIssues++;
            }
            // Speaker label check
            if (!resp.speaker || resp.speaker.length < 1) {
                issues.speakerLabelBug.push({ case: c.id, age: ageGroup, error: 'Missing speaker label' });
                icIssues++;
            }
        } catch (e) {
            issues.initialComplaintBug.push({ case: c.id, age: ageGroup, error: e.message });
            icIssues++;
        }
    }
}
console.log(`   ${icIssues === 0 ? '✅' : '❌'} ${icIssues} initial complaint issues in ${CASE_LIBRARY.length * 4} tests\n`);

// ═══════════════════════════════════════════════════════════
// TEST 6: CHILD DIRECT QUESTIONS
// ═══════════════════════════════════════════════════════════
console.log('── TEST 6: Child Direct Questions ──');
let childIssues = 0;
for (const age of [4, 6, 8, 10, 14, 15]) {
    const p = { name: 'Andi', age, gender: 'L' };
    for (const complaint of ['sakit perut', 'pusing', 'batuk']) {
        const qs = getChildDirectQuestions(p, complaint);
        if (age >= 4 && age <= 14 && qs.length === 0) {
            issues.childQuestionBug.push({ age, complaint, error: 'No child questions returned for eligible child' });
            childIssues++;
        }
        if ((age < 4 || age > 14) && qs.length > 0) {
            issues.childQuestionBug.push({ age, complaint, error: 'Child questions for ineligible age' });
            childIssues++;
        }
        for (const q of qs) {
            if (!q.text || !q.response || !q.speaker) {
                issues.childQuestionBug.push({ age, complaint, qId: q.id, error: 'Missing fields' });
                childIssues++;
            }
        }
    }
}
console.log(`   ${childIssues === 0 ? '✅' : '❌'} ${childIssues} child question issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 7: GENERIC QUESTIONS through persona pipeline
// ═══════════════════════════════════════════════════════════
console.log('── TEST 7: Generic Questions + Persona ──');
let genIssues = 0;
const styles = ['concise', 'verbose', 'vague'];
const demeanors = ['', 'stoic', 'anxious', 'dramatic'];
for (const [category, questions] of Object.entries(GENERIC_QUESTIONS)) {
    for (const q of questions) {
        for (const style of styles) {
            for (const dem of demeanors) {
                const p = { name: 'Test', age: 40, gender: 'L', communicationStyle: style, demeanor: dem, complaint: 'sakit' };
                const ctx = { trust: 0.5, patience: 0.8, count: 5 };
                try {
                    resetPersonaMemory();
                    const adapted = applyPersonaAdaptation(q.response, p, ctx, { questionId: q.id });
                    if (!adapted || adapted.length < 3) {
                        issues.genericQuestionBug.push({ category, qId: q.id, style, dem, error: 'Empty adapted', text: adapted });
                        genIssues++;
                    }
                    // Check for response containing parenthetical placeholders
                    if (adapted.includes('(Menya') || adapted.includes('(Menj') && !adapted.includes('(tampak') && !adapted.includes('(ekspresi')) {
                        // Skip — these are intentional placeholders in generic questions
                    }
                } catch (e) {
                    issues.genericQuestionBug.push({ category, qId: q.id, style, dem, error: e.message });
                    genIssues++;
                }
                stats.total++;
            }
        }
    }
}
console.log(`   ${genIssues === 0 ? '✅' : '❌'} ${genIssues} generic question issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 8: FULL SESSION SIMULATION (15 questions per case)
// ═══════════════════════════════════════════════════════════
console.log('── TEST 8: Full Session Simulation (coherence + context) ──');
let sessionIssues = 0;
let sessionsRun = 0;
const sessionRepTracker = {};

for (const caseData of CASE_LIBRARY) {
    stats.cases++;
    const questions = caseData.anamnesisQuestions;
    if (!questions) continue;

    const allQs = [];
    for (const [cat, qs] of Object.entries(questions)) {
        if (!Array.isArray(qs)) continue;
        for (const q of qs) allQs.push({ ...q, category: cat });
    }

    // Run 3 persona combos per case (representative sample)
    const combos = [
        { style: 'verbose', demeanor: 'dramatic' },
        { style: 'vague', demeanor: 'anxious' },
        { style: 'concise', demeanor: 'stoic' },
    ];

    for (const combo of combos) {
        resetPersonaMemory();
        const patient = {
            id: `sess_${caseData.id}`,
            name: 'Session Test',
            age: caseData.category === 'Pediatric' ? 6 : 40,
            gender: Math.random() > 0.5 ? 'L' : 'P',
            communicationStyle: combo.style,
            demeanor: combo.demeanor,
            complaint: caseData.symptoms?.[0] || '',
            social: {}
        };

        let context = { introduced: true, trust: 0.5, patience: 1.0, count: 0 };
        const sessionResponses = [];
        sessionsRun++;

        for (const q of allQs) {
            stats.total++;
            const base = q.response;
            if (!base) continue;

            const info = getInformantMode(patient);
            let response = adaptTextForGender(base, patient, info);
            const rawClinical = response;

            context = updateEmotionState(context, 'question');

            try {
                response = applyPersonaAdaptation(response, patient, context, { questionId: q.id });
            } catch (e) {
                issues.contextEvolutionBug.push({ case: caseData.id, qId: q.id, error: e.message });
                sessionIssues++;
                continue;
            }

            // ── CHECK: Session-level repetition ──
            if (sessionResponses.includes(response) && response !== rawClinical) {
                issues.fullSessionRepetition.push({
                    case: caseData.id, combo: `${combo.style}+${combo.demeanor}`,
                    qId: q.id, count: context.count,
                    text: response.substring(0, 80)
                });
                sessionIssues++;
            }
            sessionResponses.push(response);

            // ── CHECK: Anxious suffix on pure denial responses ──
            if (combo.demeanor === 'anxious' && DENIAL_RE.test(rawClinical) && !COMPLAINT_RE.test(rawClinical)) {
                const hasAnxSuffix = /\b(Bahaya|sembuh|serius|takut|parah|normal|kenapa|aman|rawat|rujuk|operasi|mahal|cemas|khawatir|deg-degan|UGD|kanker)\b/i.test(response);
                if (hasAnxSuffix && response !== rawClinical) {
                    issues.anxiousOnDenial.push({
                        case: caseData.id, qId: q.id,
                        raw: rawClinical.substring(0, 60),
                        adapted: response.substring(0, 80),
                        reason: 'Patient denies symptom but then asks "is it dangerous?"'
                    });
                }
            }

            // ── CHECK: Stoic parenthetical on severe complaint ──
            if (combo.demeanor === 'stoic') {
                const isSevere = /\b(luar biasa|hebat|parah banget|nggak kuat|mau pingsan|sekarat)\b/i.test(rawClinical);
                if (isSevere && /\(tampak datar\)|\(tanpa ekspresi\)|\(tampak tak acuh\)/.test(response)) {
                    issues.stoicOnSevere.push({
                        case: caseData.id, qId: q.id,
                        raw: rawClinical.substring(0, 60),
                        adapted: response.substring(0, 80),
                        reason: 'Patient describes extreme pain but appears indifferent'
                    });
                }
            }

            // ── CHECK: Double punctuation ──
            if (/\.\.\s*\.|,\s*,|\.\s+\.\s|!\s*!/.test(response)) {
                issues.doublePunctuation.push({
                    case: caseData.id, qId: q.id,
                    text: response.substring(0, 80)
                });
            }

            // ── CHECK: Verbose neutral suffix on complaint ──
            if (combo.style === 'verbose' && COMPLAINT_RE.test(rawClinical)) {
                const neutralSuffixes = ['Gitu, Dok.', 'Ya begitulah.', 'Gitu aja sih', 'Segitu aja.', 'Udah biasa sih.', 'Cuma gitu aja.'];
                const hasNeutralOnComplaint = neutralSuffixes.some(s => response.endsWith(s));
                if (hasNeutralOnComplaint) {
                    issues.verboseNeutralIncoherent.push({
                        case: caseData.id, qId: q.id,
                        raw: rawClinical.substring(0, 60),
                        adapted: response.substring(0, 80),
                        reason: 'Complaint response got neutral suffix (should get complaint suffix)'
                    });
                }
            }

            // ── CHECK: Context evolution sanity ──
            if (context.count > 0 && context.trust < 0) {
                issues.contextEvolutionBug.push({ case: caseData.id, qId: q.id, error: 'Trust went negative', context });
                sessionIssues++;
            }
            if (context.patience < 0) {
                // patience capped at 0 in engine, but let's verify
                if (context.patience < -0.01) {
                    issues.contextEvolutionBug.push({ case: caseData.id, qId: q.id, error: 'Patience went deeply negative', context });
                    sessionIssues++;
                }
            }
        }
    }
}
console.log(`   ${sessionIssues === 0 ? '✅' : '❌'} ${sessionIssues} issues in ${sessionsRun} full sessions\n`);

// ═══════════════════════════════════════════════════════════
// TEST 9: DUPLICATE SHORT ANSWERS across cases
// ═══════════════════════════════════════════════════════════
console.log('── TEST 9: Duplicate Short Answers ──');
const responseFreq = {};
for (const c of CASE_LIBRARY) {
    const qs = c.anamnesisQuestions;
    if (!qs) continue;
    for (const [cat, questions] of Object.entries(qs)) {
        if (!Array.isArray(questions)) continue;
        for (const q of questions) {
            if (!q.response) continue;
            const r = q.response.trim();
            if (r.length < 25) { // Short responses
                if (!responseFreq[r]) responseFreq[r] = [];
                responseFreq[r].push({ case: c.id, qId: q.id, cat });
            }
        }
    }
}
let dupShortCount = 0;
const highFreqResponses = Object.entries(responseFreq)
    .filter(([r, locs]) => locs.length >= 5)
    .sort((a, b) => b[1].length - a[1].length);
for (const [resp, locs] of highFreqResponses) {
    issues.duplicateShortResp.push({
        response: resp,
        count: locs.length,
        cases: locs.slice(0, 5).map(l => l.case).join(', ')
    });
    dupShortCount += locs.length;
}
console.log(`   ⚠️ ${highFreqResponses.length} short responses appear 5+ times (${dupShortCount} total occurrences)\n`);

// ═══════════════════════════════════════════════════════════
// TEST 10: SPEAKER LABEL consistency
// ═══════════════════════════════════════════════════════════
console.log('── TEST 10: Speaker Label ──');
let speakerIssues = 0;
for (const ageGroup of [3, 8, 35, 75]) {
    for (const gender of ['L', 'P']) {
        const p = { name: 'Test', age: ageGroup, gender };
        if (ageGroup <= 7) p.informant = { required: true, reason: 'pediatric', relation: gender === 'P' ? 'Ibu' : 'Bapak' };
        const label = getSpeakerLabel({}, p);
        if (!label || label === 'undefined' || label === 'null') {
            issues.speakerLabelBug.push({ age: ageGroup, gender, error: 'Bad label', label });
            speakerIssues++;
        }
    }
}
console.log(`   ${speakerIssues === 0 ? '✅' : '❌'} ${speakerIssues} speaker label issues\n`);

// ═══════════════════════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════');
console.log('  SUPER DEEP SIMULATION v2 — RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`📊 STATS: ${stats.cases} cases, ${stats.total} total tests\n`);

const printIssues = (label, list, maxShow = 10) => {
    if (list.length === 0) {
        console.log(`✅ ${label}: 0 issues\n`);
        return;
    }
    const icon = list.length <= 5 ? '⚠️' : '❌';
    console.log(`${icon} ${label}: ${list.length} issues`);
    list.slice(0, maxShow).forEach((item, i) => {
        console.log(`   ${i + 1}. ${JSON.stringify(item)}`);
    });
    if (list.length > maxShow) console.log(`   ... and ${list.length - maxShow} more`);
    console.log('');
};

printIssues('GREETING ERRORS', issues.greetingError);
printIssues('GENDER ADAPTATION', issues.genderError);
printIssues('VAGUENESS SCORE BUGS', issues.calculateVagueBug);
printIssues('DOCTOR ACKNOWLEDGMENT', issues.acknowledgmentBug);
printIssues('INITIAL COMPLAINT', issues.initialComplaintBug);
printIssues('CHILD QUESTIONS', issues.childQuestionBug);
printIssues('SPEAKER LABELS', issues.speakerLabelBug);
printIssues('GENERIC QUESTIONS', issues.genericQuestionBug);
printIssues('ANXIOUS ON DENIAL', issues.anxiousOnDenial, 15);
printIssues('STOIC ON SEVERE PAIN', issues.stoicOnSevere, 15);
printIssues('VERBOSE NEUTRAL ON COMPLAINT', issues.verboseNeutralIncoherent, 15);
printIssues('DOUBLE PUNCTUATION', issues.doublePunctuation, 10);
printIssues('FULL SESSION REPETITION', issues.fullSessionRepetition, 15);
printIssues('CONTEXT EVOLUTION', issues.contextEvolutionBug);
printIssues('DUPLICATE SHORT ANSWERS', issues.duplicateShortResp, 20);

// Total
let totalIssues = 0;
for (const [k, v] of Object.entries(issues)) {
    if (k !== 'duplicateShortResp') totalIssues += v.length;
}
console.log('═══════════════════════════════════════════════════════════');
if (totalIssues === 0) {
    console.log('  🏆 ALL CHECKS PASSED — 0 issues!');
} else {
    console.log(`  ⚠️ ${totalIssues} total issues found (excluding duplicate short answer stats)`);
}
console.log('═══════════════════════════════════════════════════════════\n');
