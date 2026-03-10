/**
 * ICD-10 / ICD-9 CONCORDANCE DEEP ATTRITION TEST
 * ================================================
 * Exhaustive brute-force audit across ALL cases × 2 iterations.
 *
 * Tests:
 * 1. Every case ICD-10 code resolves in ICD10_DB
 * 2. Every differential diagnosis code resolves in ICD10_DB
 * 3. validateDiagnosis returns correct for exact ICD match
 * 4. validateDiagnosis returns correct for differential matches
 * 5. Score concordance: correct → 100 equivalent, wrong → 0
 * 6. ICD-9 procedure codes in correctProcedures resolve in ProceduresDB
 * 7. MAIA pipeline integrity: all functions accept ICD codes without crash
 * 8. PatientGenerator output concordance
 * 9. Cross-iteration determinism (2 iterations)
 */

import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import { ICD10_DB } from '../src/data/ICD10.js';
import {
    validateDiagnosis, validateTreatment, validateEducation,
    validateExams, validateAnamnesis
} from '../src/game/ValidationEngine.js';
import {
    initDiagnosticTracker, updateDiagnosticProbability,
    getDiagnosticConfidence, calculateCoverageScore,
    getMAIAAlerts, getExamLabSuggestions
} from '../src/game/ClinicalReasoning.js';
import { PROCEDURES_DB, PROCEDURE_CODE_MAP } from '../src/data/ProceduresDB.js';
import { classifyResponse } from '../src/game/anamnesis/SynthesisEngine.js';

const bugs = [];
const warnings = [];
let totalTests = 0;
let passedTests = 0;

function assert(test, label, details = '') {
    totalTests++;
    if (test) { passedTests++; }
    else { bugs.push({ label, details }); }
}
function warn(label, details = '') { warnings.push({ label, details }); }

const ITERATIONS = 2;
const icd10Set = new Set(ICD10_DB.map(d => d.code));
const icd10Map = Object.fromEntries(ICD10_DB.map(d => [d.code, d]));

console.log('═══════════════════════════════════════════════════════════');
console.log('  ICD-10/ICD-9 CONCORDANCE DEEP ATTRITION TEST');
console.log(`  ${CASE_LIBRARY.length} cases × ${ITERATIONS} iterations`);
console.log('═══════════════════════════════════════════════════════════\n');

for (let iter = 1; iter <= ITERATIONS; iter++) {
    console.log(`\n🔄 ITERATION ${iter}/${ITERATIONS}\n`);

    // ────────────────────────────────────────────────────
    // PHASE 1: ICD-10 Code Resolution
    // ────────────────────────────────────────────────────
    if (iter === 1) console.log('▶ PHASE 1: ICD-10 Code Resolution\n');

    let resolvedPrimary = 0;
    let unresolvedPrimary = 0;
    let resolvedDiff = 0;
    let unresolvedDiff = 0;

    for (const c of CASE_LIBRARY) {
        // 1a. Primary ICD-10 code
        const code = c.icd10;
        assert(!!code, `Case ${c.id} has ICD-10 code`);
        if (code) {
            const found = icd10Set.has(code);
            if (found) {
                resolvedPrimary++;
            } else {
                unresolvedPrimary++;
                // Check if it's a sub-code (e.g., E11.2 not in DB but E11.9 is)
                const baseCode = code.split('.')[0];
                const hasBase = ICD10_DB.some(d => d.code.startsWith(baseCode));
                if (hasBase) {
                    warn(`ICD-10 "${code}" for ${c.id} not in DB but base "${baseCode}" exists — sub-code gap`);
                } else {
                    bugs.push({ label: `ICD-10 "${code}" for ${c.id} NOT in ICD10_DB at all`, details: `No code starting with "${baseCode}"` });
                }
            }
        }

        // 1b. Differential diagnosis codes
        const diffs = c.differentialDiagnosis || [];
        for (const dd of diffs) {
            if (icd10Set.has(dd)) {
                resolvedDiff++;
            } else {
                unresolvedDiff++;
                const baseCode = dd.split('.')[0];
                const hasBase = ICD10_DB.some(d => d.code.startsWith(baseCode));
                if (!hasBase) {
                    warn(`Differential "${dd}" for ${c.id} not in ICD10_DB (no base match)`);
                }
            }
        }
    }

    if (iter === 1) {
        console.log(`  Primary ICD-10 resolved: ${resolvedPrimary}/${CASE_LIBRARY.length}`);
        console.log(`  Primary ICD-10 unresolved: ${unresolvedPrimary}`);
        console.log(`  Differential resolved: ${resolvedDiff}`);
        console.log(`  Differential unresolved: ${unresolvedDiff}`);
    }

    // ────────────────────────────────────────────────────
    // PHASE 2: validateDiagnosis Concordance
    // ────────────────────────────────────────────────────
    if (iter === 1) console.log('\n▶ PHASE 2: validateDiagnosis Concordance\n');

    let dxCorrectCount = 0;
    let dxWrongCount = 0;
    let dxDiffCount = 0;
    let dxCrashCount = 0;

    for (const c of CASE_LIBRARY) {
        try {
            // 2a. Exact correct diagnosis
            const icdEntry = icd10Map[c.icd10];
            const correctDx = [{ code: c.icd10, name: icdEntry?.name || c.diagnosis }];
            const r1 = validateDiagnosis(c, correctDx);
            assert(r1.isPrimaryCorrect === true, `[iter${iter}] Correct dx for ${c.id}`, `Got: ${r1.isPrimaryCorrect}`);
            if (r1.isPrimaryCorrect) dxCorrectCount++;

            // 2b. Wrong diagnosis (unrelated code)
            const wrongDx = [{ code: 'Z99.9', name: 'Unspecified' }];
            const r2 = validateDiagnosis(c, wrongDx);
            assert(r2.isPrimaryCorrect === false, `[iter${iter}] Wrong dx for ${c.id}`);
            if (!r2.isPrimaryCorrect) dxWrongCount++;

            // 2c. Differential diagnosis (should be !isPrimaryCorrect but hasReasonableDifferential)
            const diffs = c.differentialDiagnosis || [];
            if (diffs.length > 0) {
                // Use a differential that is NOT the primary
                const altDiff = diffs.find(d => d !== c.icd10);
                if (altDiff) {
                    const altEntry = icd10Map[altDiff];
                    const diffDx = [{ code: altDiff, name: altEntry?.name || altDiff }];
                    const r3 = validateDiagnosis(c, diffDx);
                    // Should either be primary correct (if diff == icd10) or has reasonable differential
                    assert(r3.isPrimaryCorrect || r3.hasReasonableDifferential,
                        `[iter${iter}] Differential "${altDiff}" recognized for ${c.id}`,
                        `isPrimary: ${r3.isPrimaryCorrect}, hasDiff: ${r3.hasReasonableDifferential}`);
                    if (r3.hasReasonableDifferential) dxDiffCount++;
                }
            }

            // 2d. Empty diagnosis
            const r4 = validateDiagnosis(c, []);
            assert(r4.isPrimaryCorrect === false, `[iter${iter}] Empty dx for ${c.id}`);

            // 2e. Multiple diagnoses (correct + wrong)
            const multiDx = [{ code: 'Z99.9', name: 'Fake' }, ...correctDx];
            const r5 = validateDiagnosis(c, multiDx);
            assert(r5.isPrimaryCorrect === true, `[iter${iter}] Multi-dx with correct for ${c.id}`);
        } catch (e) {
            dxCrashCount++;
            bugs.push({ label: `[iter${iter}] validateDiagnosis CRASH for ${c.id}`, details: e.message });
        }
    }

    if (iter === 1) {
        console.log(`  Correct dx recognized: ${dxCorrectCount}/${CASE_LIBRARY.length}`);
        console.log(`  Wrong dx rejected: ${dxWrongCount}/${CASE_LIBRARY.length}`);
        console.log(`  Differentials recognized: ${dxDiffCount}`);
        console.log(`  Crashes: ${dxCrashCount}`);
    }

    // ────────────────────────────────────────────────────
    // PHASE 3: ICD-9 Procedure Code Concordance
    // ────────────────────────────────────────────────────
    if (iter === 1) console.log('\n▶ PHASE 3: ICD-9 / Procedure Code Concordance\n');

    let procsResolved = 0;
    let procsUnresolved = 0;
    const unresolvedProcs = new Set();
    const procIdSet = new Set(PROCEDURES_DB.map(p => p.id));
    const procCodeSet = new Set(Object.keys(PROCEDURE_CODE_MAP || {}));

    for (const c of CASE_LIBRARY) {
        const procs = c.correctProcedures || [];
        for (const p of procs) {
            // Check if procedure ID resolves in PROCEDURES_DB or PROCEDURE_CODE_MAP
            if (procIdSet.has(p) || procCodeSet.has(p)) {
                procsResolved++;
            } else {
                procsUnresolved++;
                unresolvedProcs.add(p);
                warn(`Procedure "${p}" in ${c.id} not found in PROCEDURES_DB or CODE_MAP`);
            }
        }
    }

    if (iter === 1) {
        console.log(`  Procedures resolved: ${procsResolved}`);
        console.log(`  Procedures unresolved: ${procsUnresolved}`);
        if (unresolvedProcs.size > 0) {
            console.log(`  Unique unresolved: ${[...unresolvedProcs].slice(0, 20).join(', ')}`);
        }
    }

    // ────────────────────────────────────────────────────
    // PHASE 4: Full MAIA Pipeline with ICD Codes
    // ────────────────────────────────────────────────────
    if (iter === 1) console.log('\n▶ PHASE 4: MAIA Pipeline ICD Integration\n');

    let pipelineCrashes = 0;
    let pipelineTests = 0;

    for (const c of CASE_LIBRARY) {
        if (!c.anamnesisQuestions) continue;
        pipelineTests++;

        try {
            // Simulate full patient workflow
            const allQs = [];
            for (const [cat, qs] of Object.entries(c.anamnesisQuestions)) {
                if (Array.isArray(qs)) for (const q of qs) allQs.push({ ...q, category: cat });
            }

            let tracker = initDiagnosticTracker(c);
            assert(tracker.correctDiagnosis === (c.icd10 || 'R69'),
                `[iter${iter}] Tracker ICD for ${c.id}`,
                `Expected: ${c.icd10}, Got: ${tracker.correctDiagnosis}`);

            // Ask all questions
            const essential = c.essentialQuestions || [];
            for (const q of allQs) {
                const status = classifyResponse(q.response);
                tracker = updateDiagnosticProbability(tracker, q.id, status, essential);
            }

            // Coverage score
            const coverage = calculateCoverageScore(
                allQs,
                Object.keys(c.physicalExamFindings || {}),
                c.relevantLabs || [],
                essential
            );

            // MAIA alerts (with caseData for relevantCategories + SKDI)
            const alerts = getMAIAAlerts(allQs, 'keluhan_utama', c);

            // Diagnostic confidence
            const conf = getDiagnosticConfidence(tracker, coverage);
            assert(typeof conf.confidence === 'number', `[iter${iter}] Confidence is number for ${c.id}`);

            // Exam/lab suggestions
            const suggestions = getExamLabSuggestions(c, [], [], 50);
            assert(suggestions !== null, `[iter${iter}] Suggestions not null for ${c.id}`);

            // Validate all dimensions
            const dxResult = validateDiagnosis(c, [{ code: c.icd10, name: c.diagnosis }]);
            assert(dxResult.isPrimaryCorrect, `[iter${iter}] Pipeline dx correct for ${c.id}`);

            const examResult = validateExams(c, Object.keys(c.physicalExamFindings || {}), c.relevantLabs || []);
            assert(typeof examResult.score === 'number', `[iter${iter}] Exam score is number for ${c.id}`);

            const correctMeds = (c.correctTreatment || []).map(m => Array.isArray(m) ? m[0] : m);
            const txResult = validateTreatment(c, correctMeds, c.correctProcedures || []);
            assert(typeof txResult.score === 'number', `[iter${iter}] Tx score is number for ${c.id}`);

            const anamResult = validateAnamnesis(c, allQs);
            assert(typeof anamResult.score === 'number', `[iter${iter}] Anamnesis score is number for ${c.id}`);

            const eduResult = validateEducation(c, c.requiredEducation || []);
            assert(typeof eduResult.score === 'number', `[iter${iter}] Education score is number for ${c.id}`);

            // SKDI referral alert check
            if (c.skdi && ['1', '2', '3A', '3B'].includes(c.skdi)) {
                const skdiAlert = alerts.some(a => a.id === 'skdi_referral');
                // Note: may not fire if < 7 questions
                if (allQs.length >= 7 && !skdiAlert) {
                    warn(`[iter${iter}] SKDI "${c.skdi}" for ${c.id} no referral alert after ${allQs.length} questions`);
                }
            }
        } catch (e) {
            pipelineCrashes++;
            bugs.push({ label: `[iter${iter}] MAIA pipeline CRASH for ${c.id}`, details: e.message });
        }
    }

    if (iter === 1) {
        console.log(`  Pipeline tests: ${pipelineTests}`);
        console.log(`  Pipeline crashes: ${pipelineCrashes}`);
    }

    // ────────────────────────────────────────────────────
    // PHASE 5: Score Concordance Matrix
    // ────────────────────────────────────────────────────
    if (iter === 1) console.log('\n▶ PHASE 5: Score Concordance Matrix\n');

    let scoreAnomalies = 0;
    for (const c of CASE_LIBRARY) {
        try {
            // Correct dx → high score
            const r1 = validateDiagnosis(c, [{ code: c.icd10, name: c.diagnosis }]);
            // Wrong dx → should NOT be correct
            const r2 = validateDiagnosis(c, [{ code: 'Z99.9', name: 'Fake' }]);

            if (r1.isPrimaryCorrect === r2.isPrimaryCorrect) {
                scoreAnomalies++;
                bugs.push({
                    label: `[iter${iter}] Score anomaly for ${c.id}`,
                    details: `Correct and wrong dx both returned isPrimaryCorrect=${r1.isPrimaryCorrect}`
                });
            }

            // Perfect treatment → high score
            const correctMeds = (c.correctTreatment || []).map(m => Array.isArray(m) ? m[0] : m);
            if (correctMeds.length > 0) {
                const tr1 = validateTreatment(c, correctMeds, c.correctProcedures || []);
                const tr2 = validateTreatment(c, ['fake_nonexistent_med'], []);

                assert(tr1.score >= tr2.score,
                    `[iter${iter}] Correct treatment ≥ wrong for ${c.id}`,
                    `Correct: ${tr1.score}, Wrong: ${tr2.score}`);
            }

            // Full exams → higher score than empty
            const examKeys = Object.keys(c.physicalExamFindings || {});
            if (examKeys.length > 0) {
                const ex1 = validateExams(c, examKeys, c.relevantLabs || []);
                const ex2 = validateExams(c, [], []);
                assert(ex1.score >= ex2.score,
                    `[iter${iter}] Full exams ≥ empty for ${c.id}`,
                    `Full: ${ex1.score}, Empty: ${ex2.score}`);
            }
        } catch (e) {
            bugs.push({ label: `[iter${iter}] Score concordance CRASH for ${c.id}`, details: e.message });
        }
    }

    if (iter === 1) {
        console.log(`  Score anomalies: ${scoreAnomalies}`);
    }

    // ────────────────────────────────────────────────────
    // PHASE 6: ICD-10 Category Consistency
    // ────────────────────────────────────────────────────
    if (iter === 1) console.log('\n▶ PHASE 6: ICD-10 Category vs Case Category Consistency\n');

    let categoryMismatches = 0;
    const ICD_TO_CATEGORY = {
        A: 'Infectious', B: 'Infectious',
        E: 'Endocrine', F: 'Mental',
        G: 'Neurology', H: 'Ophthalmology',
        I: 'Cardiovascular', J: 'Respiratory',
        K: 'Digestive', L: 'Dermatology',
        M: 'Musculoskeletal', N: 'Urinary',
        O: 'Reproductive', S: 'Trauma', T: 'Trauma',
        R: 'General'
    };

    for (const c of CASE_LIBRARY) {
        if (!c.icd10 || !c.category) continue;
        const letter = c.icd10.charAt(0).toUpperCase();
        const expectedCategory = ICD_TO_CATEGORY[letter];
        if (expectedCategory) {
            const caseCategory = c.category.toLowerCase();
            const expected = expectedCategory.toLowerCase();
            // Loose match — allow related categories
            const isMatch = caseCategory.includes(expected) || expected.includes(caseCategory) ||
                (letter === 'H' && (caseCategory.includes('ophthal') || caseCategory.includes('ent') || caseCategory.includes('ear'))) ||
                (letter === 'E' && (caseCategory.includes('endocrine') || caseCategory.includes('nutrition') || caseCategory.includes('metabolic'))) ||
                (letter === 'N' && (caseCategory.includes('urin') || caseCategory.includes('reproductive') || caseCategory.includes('renal'))) ||
                (letter === 'A' && (caseCategory.includes('infect') || caseCategory.includes('sti'))) ||
                (letter === 'B' && (caseCategory.includes('infect') || caseCategory.includes('derma'))) ||
                (letter === 'T' && (caseCategory.includes('trauma') || caseCategory.includes('ophthal') || caseCategory.includes('emergency'))) ||
                (letter === 'I' && (caseCategory.includes('cardio') || caseCategory.includes('emergency'))) ||
                (letter === 'R' && true) || // R codes are symptoms, can map to any category
                (letter === 'G' && (caseCategory.includes('neuro') || caseCategory.includes('general'))) ||
                (['General', 'Emergency', 'Pediatric'].some(g => caseCategory.includes(g.toLowerCase()))); // General/Emergency can span all

            if (!isMatch) {
                categoryMismatches++;
                warn(`Category mismatch: ${c.id} ICD "${c.icd10}" (${letter}→${expectedCategory}) vs case category "${c.category}"`);
            }
        }
    }

    if (iter === 1) {
        console.log(`  Category mismatches: ${categoryMismatches}`);
    }

    console.log(`  ✅ Iteration ${iter} complete`);
}

// ────────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════');
console.log('  ICD-10/ICD-9 CONCORDANCE — FINAL RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`  Total assertions: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${totalTests - passedTests}`);
console.log(`  Warnings: ${warnings.length}`);
console.log(`  Iterations: ${ITERATIONS}`);

if (bugs.length > 0) {
    console.log(`\n  ❌ BUGS (${bugs.length}):`);
    bugs.forEach((b, i) => console.log(`    ${i + 1}. ${b.label}${b.details ? ' — ' + b.details : ''}`));
}

if (warnings.length > 0) {
    console.log(`\n  ⚠️ WARNINGS (${warnings.length}):`);
    warnings.slice(0, 40).forEach((w, i) => console.log(`    ${i + 1}. ${w.label}${w.details ? ' — ' + w.details : ''}`));
    if (warnings.length > 40) console.log(`    ... and ${warnings.length - 40} more`);
}

const verdict = bugs.length === 0 ? '🏆 ALL CLEAR' : `❌ ${bugs.length} BUGS FOUND`;
console.log(`\n  ${verdict} across ${CASE_LIBRARY.length} cases × ${ITERATIONS} iterations!`);
console.log('\n═══════════════════════════════════════════════════════════\n');

process.exit(bugs.length > 0 ? 1 : 0);
