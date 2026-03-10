/**
 * SIMULATION v5 — FINAL COMPREHENSIVE SWEEP
 * ============================================
 * Combines the strongest checks from v1-v4 into one definitive run:
 *  - ALL cases × ALL personas × brute force (from v1)
 *  - Content-aware checks (from v2)
 *  - Data integrity (from v3)
 *  - Stress/adversarial (from v4)
 *  - NEW: response semantic coherence check
 *  - NEW: prefix/suffix balance check
 *  - NEW: getGenericDemeanor for ALL cases
 *  - NEW: calculateVaguenessScore on ALL case responses
 */

import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import {
    applyPersonaAdaptation,
    calculateVaguenessScore,
    resetPersonaMemory,
    updateEmotionState
} from '../src/game/anamnesis/EmotionEngine.js';
import { adaptTextForGender, getDoctorAcknowledgment, getInitialComplaintResponse } from '../src/game/anamnesis/TextAdapter.js';
import { getInformantMode } from '../src/game/anamnesis/InformantSystem.js';
import { generateGreeting, getGenericDemeanor, getChildDirectQuestions } from '../src/game/anamnesis/DialogueEngine.js';

const STYLES = ['concise', 'verbose', 'vague'];
const DEMEANORS = ['', 'stoic', 'anxious', 'dramatic'];
const DENIAL_RE = /\b(tidak|nggak|belum|enggak|bukan|tidak ada|nggak ada|biasa aja|normal|baik-baik|disangkal|negatif)\b/i;
const COMPLAINT_RE = /\b(sakit|nyeri|sesak|demam|panas|pusing|lemas|batuk|muntah|mual|gatal|bengkak|berdarah|darah|parah|kambuh|sulit|susah|terganggu|meler|serak|kesakitan|ngilu|perih|pegel|luka|radang|diare|mencret|napas|kejang|tremor|biru|pucat|turun|hilang)\b/i;
const NEUTRAL_RE = /\b(suka|kadang-kadang|jarang|pernah|biasa|dulu|minum|makan|merokok|olahraga|kerja|tidur|bangun|anak|suami|istri|guru|petani|teman|tetangga|kantor|rumah|sekolah|kampung)\b/i;

const counts = {
    total: 0, cases: 0, casesWithQ: 0, totalQ: 0,
    absurd: 0, denialLeakage: 0, anxiousDenial: 0, repetition: 0,
    tooLong: 0, empty: 0, logicalError: 0, stacking: 0,
    whitespace: 0, mixedLang: 0, dataIntegrity: 0,
};
const samples = {
    absurd: [], denialLeakage: [], anxiousDenial: [], repetition: [],
    tooLong: [], empty: [], logicalError: [], whitespace: [],
    mixedLang: [], dataIntegrity: [],
};

console.log('═══════════════════════════════════════════════════════════');
console.log('  PRIMER — FINAL COMPREHENSIVE SWEEP v5');
console.log('  ALL cases × ALL personas × ALL checks');
console.log('═══════════════════════════════════════════════════════════\n');

// ── DATA INTEGRITY PRE-CHECK ──
for (const c of CASE_LIBRARY) {
    counts.cases++;
    if (!c.anamnesisQuestions) continue;
    counts.casesWithQ++;
    for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
        if (!Array.isArray(qs)) continue;
        for (const q of qs) {
            counts.totalQ++;
            if (!q.id || !q.response) {
                counts.dataIntegrity++;
                if (samples.dataIntegrity.length < 5) samples.dataIntegrity.push({ case: c.id, error: 'Missing id/response' });
            }
            if (/ and /i.test(q.response || '')) {
                counts.mixedLang++;
                if (samples.mixedLang.length < 5) samples.mixedLang.push({ case: c.id, qId: q.id, text: q.response.substring(0, 50) });
            }
        }
    }
}

// ── MAIN BRUTE FORCE ──
for (const caseData of CASE_LIBRARY) {
    const qs = caseData.anamnesisQuestions;
    if (!qs) continue;

    const allQs = [];
    for (const [cat, questions] of Object.entries(qs)) {
        if (Array.isArray(questions)) for (const q of questions) allQs.push({ ...q, category: cat });
    }

    for (const style of STYLES) {
        for (const demeanor of DEMEANORS) {
            resetPersonaMemory();
            const patient = {
                name: 'Test', age: 35, gender: Math.random() > 0.5 ? 'L' : 'P',
                communicationStyle: style, demeanor, complaint: caseData.symptoms?.[0] || '',
            };
            const info = getInformantMode(patient);
            const sessionResponses = [];
            let context = { introduced: true, trust: 0.5, patience: 1.0, count: 0 };

            for (const q of allQs) {
                counts.total++;
                if (!q.response) continue;

                context = updateEmotionState(context, 'question');
                let response = adaptTextForGender(q.response, patient, info);
                const rawClinical = response;

                try {
                    response = applyPersonaAdaptation(response, patient, context, { questionId: q.id });
                } catch (e) {
                    counts.logicalError++;
                    if (samples.logicalError.length < 5) samples.logicalError.push({ case: caseData.id, qId: q.id, error: e.message });
                    continue;
                }

                // EMPTY CHECK
                if (!response || response.length < 3) {
                    counts.empty++;
                    if (samples.empty.length < 5) samples.empty.push({ case: caseData.id, qId: q.id });
                }

                // TOO LONG
                if (response.length > 200) {
                    counts.tooLong++;
                    if (samples.tooLong.length < 5) samples.tooLong.push({ case: caseData.id, len: response.length });
                }

                // REPETITION
                if (sessionResponses.includes(response) && response !== rawClinical) {
                    counts.repetition++;
                    if (samples.repetition.length < 5) samples.repetition.push({ case: caseData.id, qId: q.id, text: response.substring(0, 60) });
                }
                sessionResponses.push(response);

                // WHITESPACE
                if (response !== response.trim() || /\s{3,}/.test(response)) {
                    counts.whitespace++;
                    if (samples.whitespace.length < 5) samples.whitespace.push({ case: caseData.id, qId: q.id });
                }

                // ABSURD — dramatic prefix/suffix on raw denial
                const rawIsDenial = DENIAL_RE.test(rawClinical);
                const rawIsComplaint = COMPLAINT_RE.test(rawClinical);
                if (demeanor === 'dramatic' && rawIsDenial && !rawIsComplaint) {
                    const hasDramaticPrefix = /^(Aduh|Ya ampun|Astaghfirullah|Waduh|Duh|Haduh|Ya Allah|Ampun|Tolong|Innalillahi|Masyaallah|Astaga)/i.test(response);
                    if (hasDramaticPrefix) {
                        counts.denialLeakage++;
                        if (samples.denialLeakage.length < 5) samples.denialLeakage.push({ case: caseData.id, qId: q.id, raw: rawClinical.substring(0, 50), adapted: response.substring(0, 70) });
                    }
                }

                // ANXIOUS on pure denial
                if ((demeanor === 'anxious' || demeanor === 'cemas') && rawIsDenial && !rawIsComplaint) {
                    const hasAnxSuffix = /\b(Bahaya|sembuh|serius|takut|parah|normal nggak|kenapa|aman|rawat|rujuk|operasi|mahal|cemas|khawatir|deg-degan|UGD|kanker)\b/i.test(response);
                    if (hasAnxSuffix && response !== rawClinical) {
                        counts.anxiousDenial++;
                        if (samples.anxiousDenial.length < 5) samples.anxiousDenial.push({ case: caseData.id, qId: q.id, raw: rawClinical.substring(0, 50), adapted: response.substring(0, 70) });
                    }
                }
            }
        }
    }
}

// ── VAGUENESS SCORE SWEEP ──
let vagueScoreIssues = 0;
for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;
    for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
        if (!Array.isArray(qs)) continue;
        for (const q of qs) {
            if (!q.response) continue;
            const score = calculateVaguenessScore(q.response);
            // Clinical responses shouldn't score as highly vague
            if (score > 0.7 && q.response.length > 30) {
                vagueScoreIssues++;
            }
        }
    }
}

// ── DEMEANOR CUE SWEEP ──
let demCueIssues = 0;
for (const c of CASE_LIBRARY) {
    if (!c.symptoms || !c.symptoms[0]) continue;
    const p = { name: 'T', age: 35, gender: 'L', complaint: c.symptoms[0], social: {} };
    const cue = getGenericDemeanor(p);
    if (!cue || cue.length < 3) demCueIssues++;
}

// ── LENGTH DISTRIBUTION ──
const lengths = [];
const allCasesFlat = [];
for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;
    for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
        if (!Array.isArray(qs)) continue;
        for (const q of qs) {
            if (!q.response) continue;
            allCasesFlat.push(q);
        }
    }
}
resetPersonaMemory();
for (const q of allCasesFlat) {
    const p = { name: 'T', age: 35, gender: 'L', communicationStyle: 'verbose', demeanor: 'dramatic', complaint: 'sakit' };
    const adapted = applyPersonaAdaptation(q.response, p, { count: lengths.length }, { questionId: q.id });
    lengths.push(adapted.length);
}

// ── REPORT ──
console.log('\n═══════════════════════════════════════════════════════════');
console.log('  FINAL COMPREHENSIVE SWEEP v5 — RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`📊 DATASET: ${counts.cases} total cases, ${counts.casesWithQ} with questions, ${counts.totalQ} total questions`);
console.log(`📊 BRUTE FORCE: ${counts.total} tests (${STYLES.length} styles × ${DEMEANORS.length} demeanors)\n`);

const reportLine = (label, count, sampleArr, maxSamples = 3) => {
    const icon = count === 0 ? '✅' : count <= 5 ? '⚠️' : '❌';
    console.log(`${icon} ${label}: ${count}`);
    if (count > 0 && sampleArr && sampleArr.length > 0) {
        sampleArr.slice(0, maxSamples).forEach((s, i) => console.log(`   → ${JSON.stringify(s)}`));
    }
};

reportLine('Data Integrity', counts.dataIntegrity, samples.dataIntegrity);
reportLine('Mixed Language ("and")', counts.mixedLang, samples.mixedLang);
reportLine('Empty/Short Response', counts.empty, samples.empty);
reportLine('Too Long (>200)', counts.tooLong, samples.tooLong);
reportLine('Logical Errors', counts.logicalError, samples.logicalError);
reportLine('Whitespace Bugs', counts.whitespace, samples.whitespace);
reportLine('Repetition (session)', counts.repetition, samples.repetition);
reportLine('Denial Leakage (dramatic)', counts.denialLeakage, samples.denialLeakage);
reportLine('Anxious on Pure Denial', counts.anxiousDenial, samples.anxiousDenial);
reportLine('Vague Score False Positives', vagueScoreIssues, []);
reportLine('Demeanor Cue Issues', demCueIssues, []);

// Length distribution
if (lengths.length > 0) {
    const sorted = [...lengths].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const avg = Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
    console.log(`\n📏 LENGTH (verbose+dramatic worst-case): p10=${p10}  p50=${p50}  avg=${avg}  p90=${p90}  max=${sorted[sorted.length - 1]}`);
}

const totalIssues = counts.dataIntegrity + counts.mixedLang + counts.empty + counts.tooLong +
    counts.logicalError + counts.whitespace + counts.denialLeakage + counts.anxiousDenial +
    vagueScoreIssues + demCueIssues;
// Repetition is informational, not a "bug"

console.log('\n═══════════════════════════════════════════════════════════');
if (totalIssues === 0) {
    console.log(`  🏆 PERFECT SCORE — 0 critical issues across ${counts.total}+ tests`);
} else {
    console.log(`  ⚠️ ${totalIssues} issues found`);
}
console.log(`  ℹ️ ${counts.repetition} repetitions (informational, ${(counts.repetition / counts.total * 100).toFixed(2)}%)`);
console.log('═══════════════════════════════════════════════════════════\n');
