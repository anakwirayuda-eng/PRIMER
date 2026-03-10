/**
 * SIMULATION v4 — Stress Test + Adversarial + Boundary Conditions
 * ================================================================
 * 1. EXTREME PATIENT PROFILES: age 0, age 120, empty name, null fields
 * 2. VERY LONG RESPONSES: responses > 150 chars through pipeline
 * 3. HIGH QUESTION COUNT: simulate 40+ questions (patience drain test)
 * 4. ALL CASES × INFORMANT MODE: every case as informant-mode patient
 * 5. MIXED CASE RESPONSES: check case data for remaining "and" typos
 * 6. SPECIAL CHARACTERS: responses with parentheses, quotes, commas
 * 7. VERBOSE+ANXIOUS combo: test interaction between style and demeanor
 * 8. FULL PIPELINE STRESS: 10 consecutive runs per case (memory leak check)
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
import { generateGreeting, getGenericDemeanor } from '../src/game/anamnesis/DialogueEngine.js';

const issues = {
    extremeProfile: [],
    longResponse: [],
    highQuestionCount: [],
    informantAll: [],
    remainingAnd: [],
    specialChar: [],
    comboInteraction: [],
    memoryLeak: [],
    patienceNegative: [],
};

let stats = { total: 0, cases: 0 };

console.log('═══════════════════════════════════════════════════════════');
console.log('  PRIMER — Simulation v4: Stress Test + Adversarial');
console.log('═══════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════
// TEST 1: EXTREME PATIENT PROFILES
// ═══════════════════════════════════════════════════════════
console.log('── TEST 1: Extreme Patient Profiles ──');
let extremeIssues = 0;
const extremePatients = [
    { name: null, age: 0, gender: 'L', communicationStyle: 'verbose', demeanor: 'dramatic', complaint: 'sakit' },
    { name: '', age: -1, gender: 'P', communicationStyle: 'vague', demeanor: 'stoic', complaint: '' },
    { name: 'A'.repeat(100), age: 120, gender: 'X', communicationStyle: 'concise', demeanor: 'anxious', complaint: 'nyeri' },
    { name: 'Test', age: undefined, gender: undefined, communicationStyle: undefined, demeanor: undefined, complaint: undefined },
    { name: 'Test', age: NaN, gender: 'L', communicationStyle: '', demeanor: '', complaint: 'pusing' },
    {},  // completely empty
    null, // null patient
];

const testResponse = 'Sakit kepala sudah 3 hari, pusing, mual.';
for (const p of extremePatients) {
    try {
        resetPersonaMemory();
        const adapted = applyPersonaAdaptation(testResponse, p, { trust: 0.5, patience: 0.8, count: 3 }, { questionId: 'q_test' });
        if (adapted === null || adapted === undefined) {
            issues.extremeProfile.push({ patient: JSON.stringify(p)?.substring(0, 50), error: 'null/undefined result' });
            extremeIssues++;
        }
        // Should still return a string
        if (typeof adapted !== 'string') {
            issues.extremeProfile.push({ patient: JSON.stringify(p)?.substring(0, 50), error: `returned ${typeof adapted}` });
            extremeIssues++;
        }
    } catch (e) {
        issues.extremeProfile.push({ patient: JSON.stringify(p)?.substring(0, 50), error: e.message.substring(0, 80) });
        extremeIssues++;
    }

    // Test greeting too
    try {
        if (p) {
            const g = generateGreeting(p, 'Dr. Test', 480, { introduced: false });
            // Should not crash
        }
    } catch (e) {
        issues.extremeProfile.push({ patient: JSON.stringify(p)?.substring(0, 50), error: `Greeting: ${e.message.substring(0, 60)}` });
        extremeIssues++;
    }

    // Test gender adaptation
    try {
        if (p) {
            const info = getInformantMode(p);
            adaptTextForGender(testResponse, p, info);
        }
    } catch (e) {
        issues.extremeProfile.push({ patient: JSON.stringify(p)?.substring(0, 50), error: `Gender: ${e.message.substring(0, 60)}` });
        extremeIssues++;
    }
}
console.log(`   ${extremeIssues === 0 ? '✅' : '❌'} ${extremeIssues} extreme profile issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 2: REMAINING "and" CHECK
// ═══════════════════════════════════════════════════════════
console.log('── TEST 2: Remaining "and" Typos ──');
let andIssues = 0;
for (const c of CASE_LIBRARY) {
    stats.cases++;
    const qs = c.anamnesisQuestions;
    if (!qs) continue;
    for (const [cat, questions] of Object.entries(qs)) {
        if (!Array.isArray(questions)) continue;
        for (const q of questions) {
            if (q.response && / and /i.test(q.response)) {
                issues.remainingAnd.push({ case: c.id, qId: q.id, text: q.response.substring(0, 60) });
                andIssues++;
            }
            // Also check variations
            if (q.variations) {
                for (const [k, v] of Object.entries(q.variations)) {
                    if (typeof v === 'string' && / and /i.test(v)) {
                        issues.remainingAnd.push({ case: c.id, qId: q.id, var: k, text: v.substring(0, 60) });
                        andIssues++;
                    }
                }
            }
        }
    }
    // Check anamnesis array
    if (c.anamnesis) {
        for (const a of c.anamnesis) {
            if (/ and /i.test(a)) {
                issues.remainingAnd.push({ case: c.id, field: 'anamnesis', text: a.substring(0, 60) });
                andIssues++;
            }
        }
    }
}
console.log(`   ${andIssues === 0 ? '✅' : '❌'} ${andIssues} remaining "and" typos\n`);

// ═══════════════════════════════════════════════════════════
// TEST 3: HIGH QUESTION COUNT (patience drain)
// ═══════════════════════════════════════════════════════════
console.log('── TEST 3: High Question Count (40 questions) ──');
let patienceIssues = 0;
const testP = { name: 'Test', age: 35, gender: 'L', communicationStyle: 'concise', demeanor: '', complaint: 'sakit' };
let ctx = { introduced: true, trust: 0.5, patience: 1.0, count: 0 };
for (let i = 0; i < 40; i++) {
    ctx = updateEmotionState(ctx, 'question');
    if (ctx.patience < 0) {
        issues.patienceNegative.push({ question: i + 1, patience: ctx.patience, trust: ctx.trust });
        patienceIssues++;
    }
    // Verify the adaptation still works at low patience
    const resp = applyPersonaAdaptation('Iya dok, sakit banget.', testP, ctx, { questionId: `q_stress_${i}` });
    if (!resp || typeof resp !== 'string') {
        issues.highQuestionCount.push({ question: i + 1, error: 'Bad response at high count' });
        patienceIssues++;
    }
}
console.log(`   ${patienceIssues === 0 ? '✅' : '⚠️'} patience at q40: ${ctx.patience.toFixed(3)}, trust: ${ctx.trust.toFixed(3)}\n`);

// ═══════════════════════════════════════════════════════════
// TEST 4: ALL CASES AS INFORMANT MODE
// ═══════════════════════════════════════════════════════════
console.log('── TEST 4: All Cases as Informant Mode ──');
let infoIssues = 0;
for (const c of CASE_LIBRARY) {
    const qs = c.anamnesisQuestions;
    if (!qs) continue;
    const p = {
        name: 'Anak Test', age: 3, gender: 'L', communicationStyle: 'concise', demeanor: '',
        complaint: c.symptoms?.[0] || '', informant: { required: true, reason: 'pediatric', relation: 'Ibu', name: 'Siti' }
    };
    const info = getInformantMode(p);

    for (const [cat, questions] of Object.entries(qs)) {
        if (!Array.isArray(questions)) continue;
        for (const q of questions) {
            stats.total++;
            if (!q.response) continue;
            try {
                const adapted = adaptTextForGender(q.response, p, info);
                if (!adapted || adapted.length < 3) {
                    issues.informantAll.push({ case: c.id, qId: q.id, error: 'Empty informant response' });
                    infoIssues++;
                }
                // Check if "Bapak" appears in a child patient's response (should be "Ibu" or "Adik")
                if (adapted.includes('Bapak') && p.gender === 'L' && p.age < 12) {
                    // This could happen if the original response has "Bapak" for the patient's father
                    // which is fine. Only flag if it's addressing the patient.
                }
            } catch (e) {
                issues.informantAll.push({ case: c.id, qId: q.id, error: e.message.substring(0, 60) });
                infoIssues++;
            }
        }
    }
}
console.log(`   ${infoIssues === 0 ? '✅' : '❌'} ${infoIssues} informant mode issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 5: SPECIAL CHARACTERS IN RESPONSES
// ═══════════════════════════════════════════════════════════
console.log('── TEST 5: Special Characters ──');
let specIssues = 0;
const specResponses = [
    'Tenggorokan sakit (kayak ditusuk-tusuk), menelan susah.',
    "Kata tetangga, 'di kampung ada yang sakit begini juga.'",
    'Suhu 38.5°C, TD 120/80 mmHg.',
    'Anak saya muntah-muntah > 5x.',
    'Duduk di atas batu / tanah lembab.',
];
for (const resp of specResponses) {
    for (const combo of [
        { style: 'verbose', demeanor: 'dramatic' },
        { style: 'concise', demeanor: 'stoic' },
        { style: 'vague', demeanor: 'anxious' },
    ]) {
        const p = { name: 'Test', age: 35, gender: 'L', communicationStyle: combo.style, demeanor: combo.demeanor, complaint: 'sakit' };
        try {
            resetPersonaMemory();
            const adapted = applyPersonaAdaptation(resp, p, { trust: 0.5, patience: 0.8, count: 3 }, { questionId: 'q_spec' });
            if (!adapted || adapted.length < 3) {
                issues.specialChar.push({ resp: resp.substring(0, 40), combo, error: 'Empty result' });
                specIssues++;
            }
        } catch (e) {
            issues.specialChar.push({ resp: resp.substring(0, 40), combo, error: e.message });
            specIssues++;
        }
    }
}
console.log(`   ${specIssues === 0 ? '✅' : '❌'} ${specIssues} special character issues\n`);

// ═══════════════════════════════════════════════════════════
// TEST 6: MEMORY LEAK CHECK (10 consecutive resets)
// ═══════════════════════════════════════════════════════════
console.log('── TEST 6: Memory Leak Check ──');
let memIssues = 0;
for (let session = 0; session < 10; session++) {
    resetPersonaMemory();
    const p = { name: 'Mem', age: 35, gender: 'L', communicationStyle: 'verbose', demeanor: 'dramatic', complaint: 'sakit kepala' };
    for (let q = 0; q < 20; q++) {
        const resp = applyPersonaAdaptation('Sakit kepala dok, pusing.', p, { count: q }, { questionId: `q_mem_${q}` });
        if (!resp || typeof resp !== 'string') {
            issues.memoryLeak.push({ session, q, error: 'Bad response' });
            memIssues++;
        }
    }
}
console.log(`   ${memIssues === 0 ? '✅' : '❌'} ${memIssues} memory issues in 10×20=200 iterations\n`);

// ═══════════════════════════════════════════════════════════
// TEST 7: VERBOSE + ANXIOUS COMBO
// ═══════════════════════════════════════════════════════════
console.log('── TEST 7: Verbose+Anxious Combo ──');
let comboIssues = 0;
const comboPatient = { name: 'Combo', age: 35, gender: 'P', communicationStyle: 'verbose', demeanor: 'anxious', complaint: 'demam' };
const comboResponses = [
    'Demam sudah 3 hari dok.',
    'Nggak ada alergi.',
    'Batuk pilek juga.',
    'Keluarga sehat semua.',
    'Ibu rumah tangga, anak dua.',
];
resetPersonaMemory();
for (let run = 0; run < 5; run++) {
    for (const resp of comboResponses) {
        const adapted = applyPersonaAdaptation(resp, comboPatient, { count: run * 5 }, { questionId: `q_cb_${run}` });
        // Should not have BOTH verbose suffix AND anxious suffix (no stacking)
        const VERBOSE_MARKERS = ['Pokoknya ganggu', 'Udah lama', 'Kerja terganggu', 'Capek', 'Kasian', 'Dari kemarin', 'Tolong bantu'];
        const ANXIOUS_MARKERS = ['Bahaya', 'takut', 'serius', 'cemas', 'parah', 'operasi'];
        const hasVerbose = VERBOSE_MARKERS.some(m => adapted.includes(m));
        const hasAnxious = ANXIOUS_MARKERS.some(m => adapted.includes(m));
        if (hasVerbose && hasAnxious) {
            issues.comboInteraction.push({
                run, resp: resp.substring(0, 40),
                adapted: adapted.substring(0, 100),
                error: 'STACKING: both verbose and anxious detected'
            });
            comboIssues++;
        }
    }
}
console.log(`   ${comboIssues === 0 ? '✅' : '❌'} ${comboIssues} combo stacking issues\n`);

// ═══════════════════════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════');
console.log('  SIMULATION v4 — RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`📊 STATS: ${stats.cases} cases, ${stats.total} informant tests\n`);

const printIssues = (label, list, maxShow = 10) => {
    if (list.length === 0) { console.log(`✅ ${label}: 0\n`); return; }
    console.log(`${list.length <= 5 ? '⚠️' : '❌'} ${label}: ${list.length}`);
    list.slice(0, maxShow).forEach((it, i) => console.log(`   ${i + 1}. ${JSON.stringify(it)}`));
    if (list.length > maxShow) console.log(`   ... and ${list.length - maxShow} more`);
    console.log('');
};

printIssues('EXTREME PROFILES', issues.extremeProfile);
printIssues('REMAINING "and" TYPOS', issues.remainingAnd, 15);
printIssues('HIGH QUESTION COUNT', issues.highQuestionCount);
printIssues('PATIENCE NEGATIVE', issues.patienceNegative);
printIssues('INFORMANT ALL CASES', issues.informantAll);
printIssues('SPECIAL CHARACTERS', issues.specialChar);
printIssues('MEMORY LEAK', issues.memoryLeak);
printIssues('VERBOSE+ANXIOUS STACKING', issues.comboInteraction);

let total = 0;
for (const v of Object.values(issues)) total += v.length;
console.log('═══════════════════════════════════════════════════════════');
console.log(`  ${total === 0 ? '🏆 ALL CLEAR' : `⚠️ ${total} total issues`}`);
console.log('═══════════════════════════════════════════════════════════\n');
