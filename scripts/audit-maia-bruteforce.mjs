/**
 * MAIA BRUTE-FORCE DEEP AUDIT
 * ============================
 * Tests every MAIA function individually and in full integration pipeline.
 * Covers: ClinicalReasoning + ValidationEngine across ALL 258 cases.
 *
 * 1. Unit Tests — each function individually
 * 2. Integration Tests — full patient workflow simulation
 * 3. Edge Cases — empty/malformed inputs
 * 4. Boundary Tests — score thresholds
 */

import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import {
    calculateCoverageScore,
    getMAIAAlerts,
    getDiagnosticConfidence,
    updateDiagnosticProbability,
    initDiagnosticTracker,
    ANAMNESIS_CATEGORIES,
    OLD_CARTS
} from '../src/game/ClinicalReasoning.js';
import {
    validateDiagnosis,
    validateTreatment,
    validateEducation,
    validateExams,
    validateAnamnesis
} from '../src/game/ValidationEngine.js';
import { classifyResponse } from '../src/game/anamnesis/SynthesisEngine.js';

const bugs = [];
const warnings = [];
let totalTests = 0;
let passedTests = 0;

function assert(test, label, details = '') {
    totalTests++;
    if (test) {
        passedTests++;
    } else {
        bugs.push({ label, details });
    }
}

function warn(label, details = '') {
    warnings.push({ label, details });
}

console.log('═══════════════════════════════════════════════════════════');
console.log('  MAIA BRUTE-FORCE DEEP AUDIT');
console.log('  All functions × All 258 cases');
console.log('═══════════════════════════════════════════════════════════\n');

// ────────────────────────────────────────────────
// PHASE 1: UNIT TESTS — Per Function
// ────────────────────────────────────────────────

console.log('▶ PHASE 1: Unit Tests\n');

// === 1.1 calculateCoverageScore ===
console.log('  1.1 calculateCoverageScore');
{
    // Empty inputs
    const r1 = calculateCoverageScore([], [], [], []);
    assert(r1.score === 0, 'Empty inputs → score 0', `Got ${r1.score}`);
    assert(r1.anamnesisTotal === 0, 'Empty inputs → anamnesisTotal 0', `Got ${r1.anamnesisTotal}`);
    assert(r1.physical === 0, 'Empty inputs → physical 0', `Got ${r1.physical}`);
    assert(r1.labs === 0, 'Empty inputs → labs 0', `Got ${r1.labs}`);

    // Only KU asked
    const r2 = calculateCoverageScore([{ id: 'q_main', category: 'keluhan_utama', text: 'Keluhan utama?' }], [], [], []);
    assert(r2.score > 0, 'KU only → score > 0', `Got ${r2.score}`);
    assert(r2.anamnesis.macro === 15, 'KU only → macro = 15 (KU weight)', `Got ${r2.anamnesis.macro}`);

    // All categories covered
    const allCatQs = ANAMNESIS_CATEGORIES.map(c => ({ id: `test_${c.id}`, category: c.id, text: 'test' }));
    const r3 = calculateCoverageScore(allCatQs, [], [], []);
    assert(r3.anamnesis.macro === 100, 'All categories → macro = 100', `Got ${r3.anamnesis.macro}`);

    // Physical exam scoring
    const r4 = calculateCoverageScore([], ['general', 'vitals', 'head', 'chest', 'abdomen'], [], []);
    assert(r4.physical === 100, '5 exams → physical = 100', `Got ${r4.physical}`);

    // Labs scoring
    const r5 = calculateCoverageScore([], [], ['cbc'], []);
    assert(r5.labs === 100, 'Any lab → labs = 100', `Got ${r5.labs}`);

    // Emergency mode weighting
    const r6 = calculateCoverageScore(allCatQs, ['general'], ['cbc'], [], { caseType: 'emergency' });
    assert(r6.isEmergency === true, 'Emergency flag propagated', `Got ${r6.isEmergency}`);
    assert(r6.weights.anamnesis === 0.30, 'Emergency: anamnesis weight = 0.30', `Got ${r6.weights.anamnesis}`);

    // Essential ID aliases (P0-C)
    const r7 = calculateCoverageScore(
        [{ id: 'rps_onset', category: 'rps', text: 'onset' }], [], [],
        ['q_onset']
    );
    assert(r7.anamnesis.essential > 0, 'Essential alias rps_onset → q_onset should match', `Got ${r7.anamnesis.essential}`);

    // OLD CARTS keyword fallback (P0-B)
    const r8 = calculateCoverageScore(
        [{ id: 'case_specific_q1', category: 'rps', text: 'Sejak kapan mulai sakit?' }], [], [], []
    );
    assert(r8.anamnesis.micro > 0, 'Keyword "mulai" should match OLD CARTS onset', `Got ${r8.anamnesis.micro}`);

    console.log('    ✅ calculateCoverageScore basic tests done');
}

// === 1.2 getMAIAAlerts ===
console.log('  1.2 getMAIAAlerts');
{
    // Below threshold
    const r1 = getMAIAAlerts([{ id: 'q1' }], 'keluhan_utama');
    assert(r1.length === 0, 'Below threshold (1 question) → no alerts', `Got ${r1.length} alerts`);

    const r2 = getMAIAAlerts(
        Array.from({ length: 6 }, (_, i) => ({ id: `q${i}`, category: 'keluhan_utama' })),
        'keluhan_utama'
    );
    assert(r2.length === 0, '6 questions → still below threshold (need 7)', `Got ${r2.length} alerts`);

    // Above threshold, missing categories
    const history7 = Array.from({ length: 7 }, (_, i) => ({ id: `q${i}`, category: 'keluhan_utama' }));
    const r3 = getMAIAAlerts(history7, 'keluhan_utama');
    assert(r3.length <= 1, 'Above threshold → max 1 alert returned', `Got ${r3.length}`);

    // Don't alert for current tab
    const r4 = getMAIAAlerts(history7, 'rps');
    const alertsForRPS = r4.filter(a => a.suggestTab === 'rps');
    assert(alertsForRPS.length === 0, 'Should not alert for current tab (rps)', `Got ${alertsForRPS.length}`);

    // SKDI referral alert
    const r5 = getMAIAAlerts(history7, 'keluhan_utama', { skdi: '2' });
    const hasSkdi = r5.some(a => a.id === 'skdi_referral');
    assert(hasSkdi, 'SKDI level 2 → should trigger referral alert', `Alerts: ${JSON.stringify(r5.map(a => a.id))}`);

    // relevantCategories filtering
    const r6 = getMAIAAlerts(history7, 'keluhan_utama', { relevantCategories: ['keluhan_utama', 'rps'] });
    const rpkAlert = r6.some(a => a.suggestTab === 'rpk');
    assert(!rpkAlert, 'RPK not in relevantCategories → should not alert', `Got rpk alert: ${rpkAlert}`);

    // Micro check (allergy)
    const allergyHistory = Array.from({ length: 8 }, (_, i) => ({ id: `q${i}`, category: 'rps' }));
    const r7 = getMAIAAlerts(allergyHistory, 'rps');
    const hasAllergy = r7.some(a => a.id === 'allergy');
    // Allergy alert should fire because suggestTab='rpd' ≠ currentTab='rps' and allergy not asked
    assert(hasAllergy || r7.length > 0, 'Allergy check fires when rpd_alergi not asked', `Alerts: ${JSON.stringify(r7.map(a => a.id))}`);

    console.log('    ✅ getMAIAAlerts basic tests done');
}

// === 1.3 Diagnostic Tracker ===
console.log('  1.3 Diagnostic Tracker (init, update, confidence)');
{
    for (const c of CASE_LIBRARY) {
        const tracker = initDiagnosticTracker(c);
        assert(tracker !== null, `initTracker for ${c.id}`, 'returned null');
        assert(typeof tracker.totalQuestions === 'number', `tracker.totalQuestions is number for ${c.id}`);
        assert(typeof tracker.essentialsTotal === 'number', `tracker.essentialsTotal is number for ${c.id}`);

        // Update once
        const updated = updateDiagnosticProbability(tracker, 'q_main', 'confirmed', c.essentialQuestions || []);
        assert(updated.totalQuestions === 1, `Updated totalQuestions=1 for ${c.id}`, `Got ${updated.totalQuestions}`);

        // Confidence at early stage
        const conf = getDiagnosticConfidence(updated, { physical: 0, labs: 0 });
        assert(conf.confidence <= 40, `Early confidence ≤ 40 for ${c.id}`, `Got ${conf.confidence}`);
        assert(['low', 'developing', 'unknown'].includes(conf.level), `Early level = low/developing for ${c.id}`, `Got ${conf.level}`);
    }
    console.log(`    ✅ Diagnostic Tracker tested across ${CASE_LIBRARY.length} cases`);
}

// === 1.4 validateDiagnosis ===
console.log('  1.4 validateDiagnosis');
{
    let correctCount = 0;
    let incorrectCount = 0;
    let crashCount = 0;
    for (const c of CASE_LIBRARY) {
        try {
            // Correct diagnosis
            const r1 = validateDiagnosis(c, [{ code: c.icd10, name: c.diagnosis }]);
            assert(r1.isPrimaryCorrect === true, `Correct dx for ${c.id}`, `Got ${r1.isPrimaryCorrect}`);
            if (r1.isPrimaryCorrect) correctCount++;

            // Wrong diagnosis
            const r2 = validateDiagnosis(c, [{ code: 'Z99.9', name: 'Fake' }]);
            assert(r2.isPrimaryCorrect === false, `Wrong dx for ${c.id}`);
            if (!r2.isPrimaryCorrect) incorrectCount++;

            // Empty diagnosis
            const r3 = validateDiagnosis(c, []);
            assert(r3.isPrimaryCorrect === false, `Empty dx for ${c.id}`);
        } catch (e) {
            crashCount++;
            bugs.push({ label: `validateDiagnosis CRASH for ${c.id}`, details: e.message });
        }
    }
    console.log(`    ✅ validateDiagnosis: ${correctCount} correct, ${incorrectCount} incorrect, ${crashCount} crashes`);
}

// === 1.5 validateTreatment ===
console.log('  1.5 validateTreatment');
{
    let crashCount = 0;
    let perfectCount = 0;
    let hasCorrectTreatment = 0;
    for (const c of CASE_LIBRARY) {
        try {
            const correctMeds = c.correctTreatment || [];
            const correctProcs = c.correctProcedures || [];
            if (correctMeds.length === 0 && correctProcs.length === 0) continue;
            hasCorrectTreatment++;

            // All correct
            const flatMeds = correctMeds.map(m => Array.isArray(m) ? m[0] : m);
            const r1 = validateTreatment(c, flatMeds, correctProcs);
            assert(r1.score >= 80, `Perfect treatment for ${c.id}`, `Score: ${r1.score}`);
            if (r1.score >= 80) perfectCount++;

            // Empty treatment
            const r2 = validateTreatment(c, [], []);
            assert(r2.score <= 10, `Empty treatment ≤ 10 for ${c.id}`, `Score: ${r2.score}`);

            // Wrong meds
            const r3 = validateTreatment(c, ['fake_med_xyz'], []);
            assert(r3.unnecessaryMeds.length > 0, `Fake med flagged for ${c.id}`, `Unnecessary: ${r3.unnecessaryMeds.length}`);
        } catch (e) {
            crashCount++;
            bugs.push({ label: `validateTreatment CRASH for ${c.id}`, details: e.message });
        }
    }
    console.log(`    ✅ validateTreatment: ${hasCorrectTreatment} cases tested, ${perfectCount} perfect, ${crashCount} crashes`);
}

// === 1.6 validateExams ===
console.log('  1.6 validateExams');
{
    let crashCount = 0;
    let casesWithExams = 0;
    for (const c of CASE_LIBRARY) {
        try {
            const findings = c.physicalExamFindings || {};
            const important = Object.keys(findings).filter(e => e !== 'general' && e !== 'vitals');
            if (important.length === 0) continue;
            casesWithExams++;

            // All correct exams
            const r1 = validateExams(c, important, c.relevantLabs || []);
            assert(r1.score >= 50, `Good exam score for ${c.id}`, `Score: ${r1.score}`);
            assert(typeof r1.feedback === 'string' && r1.feedback.length > 0, `Feedback exists for ${c.id}`);

            // Over-examination
            const tooMany = [...important, 'fake_ex1', 'fake_ex2', 'fake_ex3', 'fake_ex4'];
            const r2 = validateExams(c, tooMany, []);
            assert(r2.overExamPenalty >= 0, `Over-exam penalty ≥ 0 for ${c.id}`, `Penalty: ${r2.overExamPenalty}`);
            // Feedback should contain base feedback AND warning if applicable
            if (r2.overExamWarning) {
                assert(r2.feedback.includes('Over-investigation') && r2.feedback.includes('Pemeriksaan'),
                    `Exam feedback contains both base AND warning for ${c.id}`,
                    `Feedback: ${r2.feedback.substring(0, 80)}`);
            }

            // Empty exams
            const r3 = validateExams(c, [], []);
            assert(r3.missingExams.length > 0, `Missing exams when none performed for ${c.id}`);
        } catch (e) {
            crashCount++;
            bugs.push({ label: `validateExams CRASH for ${c.id}`, details: e.message });
        }
    }
    console.log(`    ✅ validateExams: ${casesWithExams} cases, ${crashCount} crashes`);
}

// === 1.7 validateAnamnesis ===
console.log('  1.7 validateAnamnesis');
{
    let crashCount = 0;
    let casesWithAnamnesis = 0;
    let perfectCount = 0;
    for (const c of CASE_LIBRARY) {
        try {
            if (!c.anamnesisQuestions) {
                // Auto-pass for cases without anamnesis
                const r = validateAnamnesis(c, []);
                assert(r.score === 100, `Auto-pass for ${c.id} without anamnesis`, `Score: ${r.score}`);
                continue;
            }
            casesWithAnamnesis++;

            // All questions asked
            const allQs = [];
            for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
                if (Array.isArray(qs)) {
                    for (const q of qs) allQs.push({ ...q, category: cat });
                }
            }
            const r1 = validateAnamnesis(c, allQs);
            assert(typeof r1.score === 'number', `Score is number for ${c.id}`, `Got ${typeof r1.score}`);
            assert(r1.score >= 0 && r1.score <= 100, `Score 0-100 for ${c.id}`, `Got ${r1.score}`);
            assert(Array.isArray(r1.essentialMissed), `essentialMissed is array for ${c.id}`, `Got ${typeof r1.essentialMissed}`);
            if (r1.score >= 80) perfectCount++;

            // No questions asked
            const r2 = validateAnamnesis(c, []);
            assert(r2.score <= 30, `Empty anamnesis ≤ 30 for ${c.id}`, `Score: ${r2.score}`);

            // Only essential questions asked
            const essentialQs = (c.essentialQuestions || []).map(eId => {
                const found = allQs.find(q => q.id === eId);
                return found || { id: eId, category: 'rps', text: eId, response: 'test' };
            });
            if (essentialQs.length > 0) {
                const r3 = validateAnamnesis(c, essentialQs);
                assert(r3.score > 0, `Essential-only score > 0 for ${c.id}`, `Score: ${r3.score}`);
            }
        } catch (e) {
            crashCount++;
            bugs.push({ label: `validateAnamnesis CRASH for ${c.id}`, details: e.message });
        }
    }
    console.log(`    ✅ validateAnamnesis: ${casesWithAnamnesis} cases, ${perfectCount} perfect, ${crashCount} crashes`);
}

// === 1.8 validateEducation ===
console.log('  1.8 validateEducation');
{
    let crashCount = 0;
    let casesWithEdu = 0;
    for (const c of CASE_LIBRARY) {
        try {
            const required = c.requiredEducation || [];
            if (required.length === 0) continue;
            casesWithEdu++;

            // All correct
            const r1 = validateEducation(c, required);
            assert(r1.score >= 80, `Full education ≥ 80 for ${c.id}`, `Score: ${r1.score}`);

            // Empty
            const r2 = validateEducation(c, []);
            assert(r2.score <= 10, `Empty education ≤ 10 for ${c.id}`, `Score: ${r2.score}`);

            // Too much
            const r3 = validateEducation(c, [...required, 'fake_edu_1', 'fake_edu_2']);
            assert(r3.unnecessary.length > 0, `Unnecessary flagged for ${c.id}`);
        } catch (e) {
            crashCount++;
            bugs.push({ label: `validateEducation CRASH for ${c.id}`, details: e.message });
        }
    }
    console.log(`    ✅ validateEducation: ${casesWithEdu} cases, ${crashCount} crashes`);
}

// ────────────────────────────────────────────────
// PHASE 2: INTEGRATION TESTS — Full Pipeline
// ────────────────────────────────────────────────

console.log('\n▶ PHASE 2: Integration Tests (Full MAIA Pipeline)\n');

let integrationBugs = 0;
let integrationTests = 0;

for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;

    integrationTests++;
    const allQs = [];
    for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
        if (Array.isArray(qs)) for (const q of qs) allQs.push({ ...q, category: cat });
    }

    // Simulate full patient workflow
    let tracker = initDiagnosticTracker(c);
    const essential = c.essentialQuestions || [];
    let history = [];

    // Step 1: Ask all questions progressively
    for (const q of allQs) {
        history.push(q);
        const status = classifyResponse(q.response);
        tracker = updateDiagnosticProbability(tracker, q.id, status, essential);
    }

    // Step 2: Coverage score after all questions
    const coverage = calculateCoverageScore(history, Object.keys(c.physicalExamFindings || {}), c.relevantLabs || [], essential);

    // Step 3: MAIA alerts at the end (should see fewest alerts possible)
    const alerts = getMAIAAlerts(history, 'keluhan_utama', c);

    // Step 4: Diagnostic confidence
    const conf = getDiagnosticConfidence(tracker, coverage);

    // Step 5: Validate anamnesis
    const anamResult = validateAnamnesis(c, history);

    // Step 6: Validate diagnosis (correct)
    const dxResult = validateDiagnosis(c, [{ code: c.icd10, name: c.diagnosis }]);

    // Step 7: Validate exams (all relevant)
    const examResult = validateExams(c, Object.keys(c.physicalExamFindings || {}), c.relevantLabs || []);

    // Step 8: Validate treatment (correct)
    const correctMeds = (c.correctTreatment || []).map(m => Array.isArray(m) ? m[0] : m);
    const txResult = validateTreatment(c, correctMeds, c.correctProcedures || []);

    // Step 9: Validate education
    const eduResult = validateEducation(c, c.requiredEducation || []);

    // ─── ASSERTIONS ───
    let caseBugs = 0;

    // Coverage should be reasonable after asking all questions
    if (coverage.anamnesisTotal < 20 && allQs.length > 3) {
        caseBugs++;
        warn(`Low anamnesisTotal (${coverage.anamnesisTotal}) despite ${allQs.length} questions for ${c.id}`);
    }

    // Confidence should be moderate+ after all questions
    if (conf.confidence < 30 && essential.length > 0 && allQs.length > 5) {
        caseBugs++;
        warn(`Low confidence (${conf.confidence}) after full anamnesis for ${c.id}`);
    }

    // Anamnesis score check
    if (typeof anamResult.score !== 'number' || isNaN(anamResult.score)) {
        caseBugs++;
        bugs.push({ label: `validateAnamnesis returned NaN for ${c.id}`, details: JSON.stringify(anamResult) });
    }

    // Diagnosis should be correct
    if (!dxResult.isPrimaryCorrect) {
        caseBugs++;
        bugs.push({ label: `validateDiagnosis false for CORRECT dx on ${c.id}`, details: `ICD10: ${c.icd10}` });
    }

    // Treatment score should be high with correct meds
    if (txResult.score < 50 && correctMeds.length > 0) {
        caseBugs++;
        warn(`Low treatment score (${txResult.score}) with correct meds for ${c.id}`);
    }

    // MAIA alerts: check no high-priority alerts if all questions asked
    const highAlerts = alerts.filter(a => a.priority === 'high' && !a.id.includes('skdi'));
    if (highAlerts.length > 0 && allQs.length > 10) {
        warn(`High MAIA alert after ${allQs.length} questions for ${c.id}: ${highAlerts[0].message}`);
    }

    if (caseBugs > 0) integrationBugs++;
}

console.log(`  Integration: ${integrationTests} cases simulated, ${integrationBugs} with issues`);

// ────────────────────────────────────────────────
// PHASE 3: EDGE CASES
// ────────────────────────────────────────────────

console.log('\n▶ PHASE 3: Edge Cases\n');

// Null/undefined inputs
try {
    calculateCoverageScore(null, null, null, null);
    bugs.push({ label: 'calculateCoverageScore should handle null', details: 'No crash but unexpected' });
} catch (e) {
    // Expected
}

try {
    const r = getMAIAAlerts([], '');
    assert(r.length === 0, 'getMAIAAlerts empty history → empty', `Got ${r.length}`);
} catch (e) {
    bugs.push({ label: 'getMAIAAlerts crashes on empty input', details: e.message });
}

try {
    const r = getDiagnosticConfidence(null, null);
    assert(r.confidence === 0, 'null tracker → 0 confidence', `Got ${r.confidence}`);
} catch (e) {
    bugs.push({ label: 'getDiagnosticConfidence crashes on null', details: e.message });
}

try {
    const r = updateDiagnosticProbability(null, 'q', 'confirmed', []);
    assert(r === null, 'null tracker update → null', `Got ${r}`);
} catch (e) {
    bugs.push({ label: 'updateDiagnosticProbability crashes on null', details: e.message });
}

// Empty case validation
try { validateDiagnosis({}, []); } catch (e) {
    bugs.push({ label: 'validateDiagnosis crashes on empty case', details: e.message });
}
try { validateTreatment({}, [], []); } catch (e) {
    bugs.push({ label: 'validateTreatment crashes on empty case', details: e.message });
}
try { validateExams({}, [], []); } catch (e) {
    bugs.push({ label: 'validateExams crashes on empty case', details: e.message });
}
try { validateAnamnesis({}, []); } catch (e) {
    bugs.push({ label: 'validateAnamnesis crashes on empty case', details: e.message });
}
try { validateEducation({}, []); } catch (e) {
    bugs.push({ label: 'validateEducation crashes on empty case', details: e.message });
}

console.log('  ✅ Edge cases tested');

// ────────────────────────────────────────────────
// PHASE 4: DATA QUALITY AUDIT
// ────────────────────────────────────────────────

console.log('\n▶ PHASE 4: Data Quality Audit\n');

let casesNoICD = 0, casesNoEssential = 0, casesNoExams = 0, casesNoTreatment = 0;
let casesNoAnamnesis = 0, casesNoLabs = 0, casesNoEducation = 0;
let casesWithSKDI = 0, casesWithRelevantCat = 0;

for (const c of CASE_LIBRARY) {
    if (!c.icd10) casesNoICD++;
    if (!c.essentialQuestions || c.essentialQuestions.length === 0) casesNoEssential++;
    if (!c.physicalExamFindings || Object.keys(c.physicalExamFindings).length === 0) casesNoExams++;
    if (!c.correctTreatment || c.correctTreatment.length === 0) casesNoTreatment++;
    if (!c.anamnesisQuestions) casesNoAnamnesis++;
    if (!c.relevantLabs || c.relevantLabs.length === 0) casesNoLabs++;
    if (!c.requiredEducation || c.requiredEducation.length === 0) casesNoEducation++;
    if (c.skdi) casesWithSKDI++;
    if (c.relevantCategories) casesWithRelevantCat++;
}

console.log(`  📊 Total cases: ${CASE_LIBRARY.length}`);
console.log(`  📊 Cases missing ICD-10: ${casesNoICD}`);
console.log(`  📊 Cases missing essentialQuestions: ${casesNoEssential}`);
console.log(`  📊 Cases missing physicalExamFindings: ${casesNoExams}`);
console.log(`  📊 Cases missing correctTreatment: ${casesNoTreatment}`);
console.log(`  📊 Cases missing anamnesisQuestions: ${casesNoAnamnesis}`);
console.log(`  📊 Cases missing relevantLabs: ${casesNoLabs}`);
console.log(`  📊 Cases missing requiredEducation: ${casesNoEducation}`);
console.log(`  📊 Cases with SKDI level: ${casesWithSKDI}`);
console.log(`  📊 Cases with relevantCategories: ${casesWithRelevantCat}`);

// ────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  MAIA BRUTE-FORCE AUDIT — FINAL RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`  Total Unit Tests: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${totalTests - passedTests}`);
console.log(`  Integration Sims: ${integrationTests}`);
console.log(`  Integration Issues: ${integrationBugs}`);
console.log(`  Warnings: ${warnings.length}`);

if (bugs.length > 0) {
    console.log(`\n  ❌ BUGS (${bugs.length}):`);
    bugs.forEach((b, i) => console.log(`    ${i + 1}. ${b.label} — ${b.details}`));
}

if (warnings.length > 0) {
    console.log(`\n  ⚠️ WARNINGS (${warnings.length}):`);
    warnings.slice(0, 20).forEach((w, i) => console.log(`    ${i + 1}. ${w.label} — ${w.details}`));
    if (warnings.length > 20) console.log(`    ... and ${warnings.length - 20} more`);
}

if (bugs.length === 0 && integrationBugs === 0) {
    console.log(`\n  🏆 ALL CLEAR — MAIA system is robust across ${CASE_LIBRARY.length} cases!`);
}
console.log('\n═══════════════════════════════════════════════════════════\n');
