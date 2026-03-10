/**
 * COMPREHENSIVE UI & CLINICAL AUDIT
 * ===================================
 * Exhaustive brute-force test covering:
 * 1. Anamnesis UI: duplicate buttons, question pool integrity
 * 2. PE: MAIA suggestion display names, body map coverage
 * 3. Lab: suggestion labels, case-specific vs common lab overlap
 * 4. Treatment: medication ID validity
 * 5. Education: option ID validity
 * 6. Cross-cutting: MAIA examLabSuggestions pipeline
 */

import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import { GENERIC_QUESTIONS, KEYWORD_BY_ID } from '../src/game/anamnesis/Constants.js';
import { getExamLabSuggestions } from '../src/game/ClinicalReasoning.js';
import {
    validateDiagnosis, validateTreatment, validateEducation,
    validateExams, validateAnamnesis
} from '../src/game/ValidationEngine.js';
import { PHYSICAL_EXAM_OPTIONS } from '../src/data/ProceduresDB.js';
import { EDUCATION_OPTIONS } from '../src/data/EducationOptions.js';
import { getMedicationById } from '../src/data/MedicationDatabase.js';

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

console.log('═══════════════════════════════════════════════════════════');
console.log('  COMPREHENSIVE UI & CLINICAL AUDIT');
console.log(`  ${CASE_LIBRARY.length} cases × 7 dimensions`);
console.log('═══════════════════════════════════════════════════════════\n');

// ────────────────────────────────────────────────────
// PHASE 1: ANAMNESIS UI — Duplicate Detection
// ────────────────────────────────────────────────────
console.log('▶ PHASE 1: Anamnesis UI — Duplicate & Pool Integrity\n');

let dupIdIssues = 0;
let dupTextIssues = 0;
let emptyPoolCases = 0;
let essentialNotInPool = 0;
const CATEGORIES = ['keluhan_utama', 'rps', 'rpd', 'rpk', 'sosial'];

for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;

    for (const cat of CATEGORIES) {
        const caseQs = c.anamnesisQuestions?.[cat] || [];
        const genericQs = GENERIC_QUESTIONS[cat] || [];

        // Simulate the merge logic from CaseSpecificSelection.jsx
        let combined = [...caseQs];
        const existingTexts = new Set(combined.map(q => (q.text || '').toLowerCase().trim()));
        const existingIds = new Set(combined.map(q => q.id));

        genericQs.forEach(gq => {
            if (!existingIds.has(gq.id) && !existingTexts.has((gq.text || '').toLowerCase().trim())) {
                combined.push(gq);
            }
        });

        // CHECK 1: Duplicate IDs within same category after merge
        const idMap = {};
        for (const q of combined) {
            if (idMap[q.id]) {
                dupIdIssues++;
                bugs.push({
                    label: `DUP ID in ${c.id}/${cat}`,
                    details: `ID "${q.id}" appears ${idMap[q.id] + 1}x`
                });
            }
            idMap[q.id] = (idMap[q.id] || 0) + 1;
        }

        // CHECK 2: Duplicate TEXT within same category after merge
        const textMap = {};
        for (const q of combined) {
            const norm = (q.text || '').toLowerCase().trim();
            if (norm && textMap[norm]) {
                dupTextIssues++;
                warn(`DUP TEXT in ${c.id}/${cat}`, `"${q.text.substring(0, 50)}..." (IDs: ${textMap[norm]}, ${q.id})`);
            }
            textMap[norm] = q.id;
        }
    }

    // CHECK 3: Essential questions must exist in some pool
    const essential = c.essentialQuestions || [];
    const allPoolIds = new Set();
    for (const cat of CATEGORIES) {
        const caseQs = c.anamnesisQuestions?.[cat] || [];
        const genericQs = GENERIC_QUESTIONS[cat] || [];
        caseQs.forEach(q => allPoolIds.add(q.id));
        genericQs.forEach(q => allPoolIds.add(q.id));
    }
    // Also allow 'initial_complaint' as alias for q_main
    allPoolIds.add('initial_complaint');
    for (const eId of essential) {
        if (!allPoolIds.has(eId)) {
            essentialNotInPool++;
            warn(`Essential "${eId}" not in any pool for ${c.id}`);
        }
    }

    // CHECK 4: Empty pools (case has anamnesisQuestions but some categories are empty)
    const totalCaseQs = CATEGORIES.reduce((sum, cat) => sum + (c.anamnesisQuestions?.[cat]?.length || 0), 0);
    if (totalCaseQs === 0) {
        emptyPoolCases++;
        warn(`Case ${c.id} has anamnesisQuestions object but ALL categories are empty`);
    }
}

console.log(`  Duplicate ID issues: ${dupIdIssues}`);
console.log(`  Duplicate text issues: ${dupTextIssues}`);
console.log(`  Empty pool cases: ${emptyPoolCases}`);
console.log(`  Essential not in pool: ${essentialNotInPool}`);

// CHECK 5: Cross-category duplicate IDs (same ID in multiple categories of ONE case)
let crossCatDups = 0;
for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;
    const allIds = {};
    for (const cat of CATEGORIES) {
        for (const q of (c.anamnesisQuestions?.[cat] || [])) {
            if (allIds[q.id] && allIds[q.id] !== cat) {
                crossCatDups++;
                warn(`Cross-cat dup: ID "${q.id}" in ${allIds[q.id]} AND ${cat} for ${c.id}`);
            }
            allIds[q.id] = cat;
        }
    }
}
console.log(`  Cross-category duplicate IDs: ${crossCatDups}`);

// CHECK 6: Questions with missing text or response
let missingFields = 0;
for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;
    for (const cat of CATEGORIES) {
        for (const q of (c.anamnesisQuestions?.[cat] || [])) {
            if (!q.text || q.text.trim().length < 3) {
                missingFields++;
                bugs.push({ label: `Missing/short text for ${c.id}/${cat}/${q.id}`, details: `text="${q.text}"` });
            }
            if (!q.response || q.response.trim().length < 3) {
                missingFields++;
                bugs.push({ label: `Missing/short response for ${c.id}/${cat}/${q.id}`, details: `response="${q.response}"` });
            }
        }
    }
}
console.log(`  Missing text/response fields: ${missingFields}`);

// CHECK 7: Tag labels — every question should have a label via KEYWORD_BY_ID or fallback
let missingTagLabels = 0;
for (const c of CASE_LIBRARY) {
    if (!c.anamnesisQuestions) continue;
    for (const cat of CATEGORIES) {
        for (const q of (c.anamnesisQuestions?.[cat] || [])) {
            const label = KEYWORD_BY_ID[q.id];
            if (!label) {
                // Fallback logic: first 3 words of text
                const words = (q.text || '').split(/\s+/).slice(0, 3).join(' ');
                if (words.length < 3) {
                    missingTagLabels++;
                    warn(`No tag label for ID "${q.id}" in ${c.id}/${cat}`);
                }
            }
        }
    }
}
console.log(`  Questions without KEYWORD_BY_ID entry: ${missingTagLabels}`);
console.log('  ✅ Phase 1 complete\n');

// ────────────────────────────────────────────────────
// PHASE 2: PE — Physical Exam Integrity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 2: Physical Exam — Body Map & MAIA Suggestions\n');

const VALID_BODY_AREAS = new Set(Object.keys(PHYSICAL_EXAM_OPTIONS || {}));
// Also allow these standard keys used in case data
const KNOWN_EXAM_KEYS = new Set([
    'general', 'vitals', 'heent', 'head', 'neck', 'thorax', 'chest',
    'abdomen', 'extremities', 'neuro', 'skin', 'musculoskeletal',
    'genitalia', 'rectal', 'breast', 'obstetric', 'lymph',
    'eyes', 'ears', 'nose', 'throat', 'cardiovascular', 'respiratory',
    'spine', 'joints', 'oral', 'dental', 'mental_status'
]);

let unknownExamKeys = 0;
let casesWithPE = 0;
for (const c of CASE_LIBRARY) {
    const findings = c.physicalExamFindings || {};
    const keys = Object.keys(findings);
    if (keys.length === 0) continue;
    casesWithPE++;

    for (const key of keys) {
        if (!VALID_BODY_AREAS.has(key) && !KNOWN_EXAM_KEYS.has(key)) {
            unknownExamKeys++;
            warn(`Unknown PE key "${key}" in ${c.id} — not in BodyMap or known set`);
        }
    }
}
console.log(`  Cases with PE findings: ${casesWithPE}`);
console.log(`  Unknown PE keys: ${unknownExamKeys}`);

// MAIA exam suggestion display names
let badExamLabels = 0;
for (const c of CASE_LIBRARY) {
    const suggestions = getExamLabSuggestions(c, [], [], 50);
    for (const s of suggestions.examSuggestions) {
        if (!s.label || s.label.length < 2) {
            badExamLabels++;
            bugs.push({ label: `Bad PE suggestion label for ${c.id}`, details: `ID: ${s.id}, Label: "${s.label}"` });
        }
        // Label should not be just the raw ID (unless it's a recognized name)
        if (s.label === s.id) {
            warn(`PE suggestion label = raw ID "${s.id}" for ${c.id} — consider adding display name`);
        }
    }
}
console.log(`  Bad exam suggestion labels: ${badExamLabels}`);
console.log('  ✅ Phase 2 complete\n');

// ────────────────────────────────────────────────────
// PHASE 3: Lab — Suggestions & Data Integrity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 3: Lab — Suggestions & Data Integrity\n');

let badLabLabels = 0;
let casesWithLabs = 0;
let labSuggestionCount = 0;
for (const c of CASE_LIBRARY) {
    const labs = c.labs || {};
    const relevantLabs = c.relevantLabs || [];
    if (relevantLabs.length > 0 || Object.keys(labs).length > 0) casesWithLabs++;

    const suggestions = getExamLabSuggestions(c, [], [], 50);
    labSuggestionCount += suggestions.labSuggestions.length;
    for (const s of suggestions.labSuggestions) {
        if (!s.label || s.label.length < 2) {
            badLabLabels++;
            bugs.push({ label: `Bad lab suggestion label for ${c.id}`, details: `ID: ${s.id}, Label: "${s.label}"` });
        }
    }

    // Check: labs in relevantLabs should ideally exist in labs object too
    for (const labId of relevantLabs) {
        if (!labs[labId] && !labs[labId.replace(/_/g, ' ')]) {
            // This is not necessarily a bug — COMMON_LABS covers some
            // Just note it as informational
        }
    }
}
console.log(`  Cases with lab data: ${casesWithLabs}`);
console.log(`  Total lab suggestions generated: ${labSuggestionCount}`);
console.log(`  Bad lab suggestion labels: ${badLabLabels}`);
console.log('  ✅ Phase 3 complete\n');

// ────────────────────────────────────────────────────
// PHASE 4: Treatment — Medication ID Validity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 4: Treatment — Medication ID Resolution\n');

let unresolvedMeds = 0;
let casesWithTreatment = 0;
const unresolvedList = [];
for (const c of CASE_LIBRARY) {
    const meds = c.correctTreatment || [];
    if (meds.length === 0) continue;
    casesWithTreatment++;

    for (const medEntry of meds) {
        const medIds = Array.isArray(medEntry) ? medEntry : [medEntry];
        for (const medId of medIds) {
            const resolved = getMedicationById(medId);
            if (!resolved) {
                unresolvedMeds++;
                const key = `${medId} (${c.id})`;
                if (!unresolvedList.includes(medId)) unresolvedList.push(medId);
                warn(`Unresolved med "${medId}" in case ${c.id}`);
            }
        }
    }
}
console.log(`  Cases with treatment: ${casesWithTreatment}`);
console.log(`  Unresolved medication IDs: ${unresolvedMeds}`);
if (unresolvedList.length > 0) {
    console.log(`  Unique unresolved: ${[...new Set(unresolvedList)].slice(0, 15).join(', ')}${unresolvedList.length > 15 ? '...' : ''}`);
}
console.log('  ✅ Phase 4 complete\n');

// ────────────────────────────────────────────────────
// PHASE 5: Education — Option ID Validity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 5: Education — Option ID Resolution\n');

const eduIdSet = new Set(EDUCATION_OPTIONS.map(e => e.id));
let unresolvedEdu = 0;
let casesWithEdu = 0;
const unresolvedEduList = [];
for (const c of CASE_LIBRARY) {
    const required = c.requiredEducation || [];
    if (required.length === 0) continue;
    casesWithEdu++;

    for (const eduId of required) {
        if (!eduIdSet.has(eduId)) {
            unresolvedEdu++;
            if (!unresolvedEduList.includes(eduId)) unresolvedEduList.push(eduId);
            warn(`Unresolved education "${eduId}" in case ${c.id}`);
        }
    }
}
console.log(`  Cases with education: ${casesWithEdu}`);
console.log(`  Unresolved education IDs: ${unresolvedEdu}`);
if (unresolvedEduList.length > 0) {
    console.log(`  Unique unresolved: ${[...new Set(unresolvedEduList)].slice(0, 15).join(', ')}${unresolvedEduList.length > 15 ? '...' : ''}`);
}
console.log('  ✅ Phase 5 complete\n');

// ────────────────────────────────────────────────────
// PHASE 6: MAIA examLabSuggestions Pipeline
// ────────────────────────────────────────────────────
console.log('▶ PHASE 6: MAIA examLabSuggestions Full Pipeline\n');

let suggestCrashes = 0;
let suggestEmpty = 0;
let suggestValid = 0;
for (const c of CASE_LIBRARY) {
    try {
        // Test at various anamnesis progress levels
        for (const progress of [0, 20, 30, 50, 80, 100]) {
            const result = getExamLabSuggestions(c, [], [], progress);
            assert(result !== null && result !== undefined, `getExamLabSuggestions not null for ${c.id}@${progress}%`);
            assert(Array.isArray(result.examSuggestions), `examSuggestions is array for ${c.id}@${progress}%`);
            assert(Array.isArray(result.labSuggestions), `labSuggestions is array for ${c.id}@${progress}%`);

            // Below 30% should always be empty
            if (progress < 30) {
                assert(result.examSuggestions.length === 0, `No exam suggestions below 30% for ${c.id}`, `Got ${result.examSuggestions.length}`);
                assert(result.labSuggestions.length === 0, `No lab suggestions below 30% for ${c.id}`, `Got ${result.labSuggestions.length}`);
            }

            // At 50% with nothing performed, suggestions should reflect case data
            if (progress === 50) {
                const requiredExams = Object.keys(c.physicalExamFindings || {});
                if (requiredExams.length > 0) {
                    assert(result.examSuggestions.length > 0, `Exam suggestions present at 50% for ${c.id}`, `Got ${result.examSuggestions.length}`);
                }
            }
        }

        // Test after performing all exams/labs — should be empty
        const allExams = Object.keys(c.physicalExamFindings || {});
        const allLabs = c.relevantLabs || [];
        const afterAll = getExamLabSuggestions(c, allExams, allLabs, 80);
        assert(afterAll.examSuggestions.length === 0, `No exam suggestions after all performed for ${c.id}`, `Got ${afterAll.examSuggestions.length}`);
        assert(afterAll.labSuggestions.length === 0, `No lab suggestions after all ordered for ${c.id}`, `Got ${afterAll.labSuggestions.length}`);
        suggestValid++;
    } catch (e) {
        suggestCrashes++;
        bugs.push({ label: `getExamLabSuggestions CRASH for ${c.id}`, details: e.message });
    }
}
console.log(`  Cases tested: ${CASE_LIBRARY.length}`);
console.log(`  Valid: ${suggestValid}, Crashes: ${suggestCrashes}`);
console.log('  ✅ Phase 6 complete\n');

// ────────────────────────────────────────────────────
// PHASE 7: Cross-Cutting Data Quality
// ────────────────────────────────────────────────────
console.log('▶ PHASE 7: Cross-Cutting Data Quality\n');

let dupCaseIds = 0;
const caseIdMap = {};
for (const c of CASE_LIBRARY) {
    if (caseIdMap[c.id]) {
        dupCaseIds++;
        bugs.push({ label: `Duplicate case ID: ${c.id}`, details: `Appears ${caseIdMap[c.id] + 1}x` });
    }
    caseIdMap[c.id] = (caseIdMap[c.id] || 0) + 1;
}

let dupICD10 = 0;
const icdMap = {};
for (const c of CASE_LIBRARY) {
    if (!c.icd10) continue;
    if (icdMap[c.icd10]) {
        dupICD10++;
        // Multiple cases can share ICD-10 (e.g., H00.0 for hordeolum + hordeolum eksternum)
        // Just note it, not a bug
    }
    icdMap[c.icd10] = (icdMap[c.icd10] || 0) + 1;
}

// Cases missing critical fields
let missingDx = 0, missingCategory = 0;
for (const c of CASE_LIBRARY) {
    if (!c.diagnosis) { missingDx++; bugs.push({ label: `Missing diagnosis name for ${c.id}` }); }
    if (!c.category) { missingCategory++; bugs.push({ label: `Missing category for ${c.id}` }); }
}

console.log(`  Duplicate case IDs: ${dupCaseIds}`);
console.log(`  Shared ICD-10 codes: ${dupICD10} (informational)`);
console.log(`  Missing diagnosis name: ${missingDx}`);
console.log(`  Missing category: ${missingCategory}`);
console.log('  ✅ Phase 7 complete\n');


// ────────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════');
console.log('  COMPREHENSIVE UI & CLINICAL AUDIT — FINAL RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`  Total assertions: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${totalTests - passedTests}`);
console.log(`  Warnings: ${warnings.length}`);

if (bugs.length > 0) {
    console.log(`\n  ❌ BUGS (${bugs.length}):`);
    bugs.forEach((b, i) => console.log(`    ${i + 1}. ${b.label}${b.details ? ' — ' + b.details : ''}`));
}

if (warnings.length > 0) {
    console.log(`\n  ⚠️ WARNINGS (${warnings.length}):`);
    warnings.slice(0, 30).forEach((w, i) => console.log(`    ${i + 1}. ${w.label}${w.details ? ' — ' + w.details : ''}`));
    if (warnings.length > 30) console.log(`    ... and ${warnings.length - 30} more`);
}

const verdict = bugs.length === 0 ? '🏆 ALL CLEAR' : `❌ ${bugs.length} BUGS FOUND`;
console.log(`\n  ${verdict} across ${CASE_LIBRARY.length} cases!`);
console.log('\n═══════════════════════════════════════════════════════════\n');

process.exit(bugs.length > 0 ? 1 : 0);
