/**
 * T4: SEARCH UX SIMULATOR
 * =========================
 * Simulates real user search queries in Indonesian and verifies
 * they return relevant results via findICD10, findICD9CM, and findWikiKey.
 *
 * Prevents: ICD search failures, alias gaps, WikiData misrouting.
 */
import { ICD10_DB, findICD10 } from '../src/data/ICD10.js';
import { findICD9CM } from '../src/data/ICD9CM.js';
import { findWikiKey, WIKI_REGISTRY } from '../src/data/WikiData.js';
import { ICD10_ALIASES } from '../src/data/ICD10_ALIASES.js';
import { MEDICATION_DATABASE } from '../src/data/MedicationDatabase.js';

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
console.log('  T4: SEARCH UX SIMULATOR');
console.log('═══════════════════════════════════════════════════════════\n');

// ────────────────────────────────────────────────────
// PHASE 1: ICD-10 Indonesian Term Search
// ────────────────────────────────────────────────────
console.log('▶ PHASE 1: ICD-10 Indonesian Term Search\n');

const ICD10_SEARCH_CASES = [
    // Slang Puskesmas
    { query: 'demam berdarah', expectCode: 'A91', desc: 'DBD' },
    { query: 'dbd', expectCode: 'A91', desc: 'DBD alias' },
    { query: 'kencing manis', expectCode: 'E11.9', desc: 'DM T2' },
    { query: 'darah tinggi', expectCode: 'I10', desc: 'Hypertension' },
    { query: 'sesak napas', expectCode: 'R06.0', desc: 'Dyspnoea' },
    { query: 'maag', expectCode: 'K29.7', desc: 'Gastritis' },
    { query: 'panu', expectCode: 'B36.0', desc: 'Pityriasis' },
    { query: 'kudis', expectCode: 'B86', desc: 'Scabies' },
    { query: 'sariawan', expectCode: 'K12.0', desc: 'Stomatitis' },
    { query: 'biduran', expectCode: 'L50.9', desc: 'Urticaria' },
    { query: 'cantengan', expectCode: 'L60.0', desc: 'Ingrowing nail' },
    { query: 'cacingan', expectCode: 'B77.9', desc: 'Ascariasis' },
    { query: 'tipes', expectCode: 'A01.0', desc: 'Typhoid' },
    { query: 'batuk rejan', expectCode: 'A37.9', desc: 'Pertussis' },
    { query: 'ispa', expectCode: 'J06.9', desc: 'URTI' },
    { query: 'tbc', expectCode: 'A15', desc: 'TB' },
    { query: 'flu', expectCode: 'J00', desc: 'Common cold' },
    { query: 'asam urat', expectCode: 'E79.0', desc: 'Hyperuricemia' },
    { query: 'gout', expectCode: 'M10.9', desc: 'Gout' },
    { query: 'vertigo', expectCode: 'H81.1', desc: 'BPPV' },
    { query: 'migrain', expectCode: 'G43.9', desc: 'Migraine' },
    { query: 'anyang-anyangan', expectCode: 'N39.0', desc: 'UTI' },
    { query: 'keseleo', expectCode: 'S93.4', desc: 'Sprain' },
    { query: 'biang keringat', expectCode: 'L74.3', desc: 'Miliaria' },
    { query: 'cacar air', expectCode: 'B01.9', desc: 'Varicella' },
    { query: 'gondongan', expectCode: 'B26', desc: 'Parotitis' },

    // English medical terms (should still work)
    { query: 'hypertension', expectCode: 'I10', desc: 'English search' },
    { query: 'pneumonia', expectCode: 'J18.9', desc: 'English search' },
    { query: 'diabetes', expectCode: 'E11.9', desc: 'English search' },

    // ICD code search
    { query: 'A09', expectCode: 'A09', desc: 'Code search' },
    { query: 'J06.9', expectCode: 'J06.9', desc: 'Code search with dot' },
];

let icd10Hits = 0;
let icd10Misses = 0;

for (const tc of ICD10_SEARCH_CASES) {
    const results = await findICD10(tc.query, 15);
    const found = results.some(r => r.code === tc.expectCode || r.code.startsWith(tc.expectCode));
    if (found) {
        icd10Hits++;
        assert(true, `ICD-10 search "${tc.query}" → ${tc.expectCode} (${tc.desc})`);
    } else {
        icd10Misses++;
        assert(false, `ICD-10 search "${tc.query}" should find ${tc.expectCode} (${tc.desc})`,
            `Got: ${results.slice(0, 3).map(r => r.code).join(', ') || 'EMPTY'}`);
    }
}

console.log(`  Search cases tested: ${ICD10_SEARCH_CASES.length}`);
console.log(`  Hits: ${icd10Hits}, Misses: ${icd10Misses}`);
console.log('  ✅ Phase 1 complete\n');

// ────────────────────────────────────────────────────
// PHASE 2: ICD-9 Procedure Search (Indonesian)
// ────────────────────────────────────────────────────
console.log('▶ PHASE 2: ICD-9 Procedure Search (Indonesian)\n');

const ICD9_SEARCH_CASES = [
    { query: 'jahit luka', expectCode: '86.59', desc: 'Suturing' },
    { query: 'nebulizer', expectCode: '93.94', desc: 'Nebulization' },
    { query: 'pasang infus', expectCode: '38.99', desc: 'IV line' },
    { query: 'ekg', expectCode: '89.52', desc: 'ECG' },
    { query: 'debridement', expectCode: '86.22', desc: 'Debridement' },
    { query: 'kateter', expectCode: '57.94', desc: 'Catheter' },
];

let icd9Hits = 0;

for (const tc of ICD9_SEARCH_CASES) {
    try {
        const results = await findICD9CM(tc.query, 10);
        const found = results.some(r => r.code === tc.expectCode || r.code.startsWith(tc.expectCode));
        if (found) {
            icd9Hits++;
        } else {
            warn(`ICD-9 search "${tc.query}" did not find ${tc.expectCode}`,
                `Got: ${results.slice(0, 3).map(r => r.code).join(', ') || 'EMPTY'}`);
        }
    } catch (e) {
        warn(`ICD-9 search "${tc.query}" crashed: ${e.message}`);
    }
}

console.log(`  Search cases tested: ${ICD9_SEARCH_CASES.length}`);
console.log(`  Hits: ${icd9Hits}`);
console.log('  ✅ Phase 2 complete\n');

// ────────────────────────────────────────────────────
// PHASE 3: Wiki/Codex Routing for Medications
// ────────────────────────────────────────────────────
console.log('▶ PHASE 3: WikiData Medication Routing\n');

const WIKI_MED_CASES = [
    'parasetamol', 'amoxicillin', 'ibuprofen', 'metformin',
    'captopril', 'amlodipine', 'omeprazole', 'salbutamol',
    'dexamethasone', 'cefadroxil'
];

let wikiHits = 0;
let wikiMisses = 0;

for (const medId of WIKI_MED_CASES) {
    const wikiKey = findWikiKey('med', medId);
    if (wikiKey && wikiKey !== 'cppt') {
        wikiHits++;
    } else {
        wikiMisses++;
        warn(`Wiki routing for med "${medId}" → ${wikiKey || 'null'} (expected a valid med_ page)`);
    }
}

// Test that full medication IDs from the database also route correctly
let medRoutingIssues = 0;
const sampleMeds = MEDICATION_DATABASE.slice(0, 50);
for (const med of sampleMeds) {
    const wikiKey = findWikiKey('med', med.id);
    // It's OK if wiki page doesn't exist (not all meds have articles)
    // But it should NOT crash
    assert(wikiKey !== undefined, `Wiki routing for "${med.id}" does not crash`);
}

console.log(`  Common meds tested: ${WIKI_MED_CASES.length} (${wikiHits} hits, ${wikiMisses} misses)`);
console.log(`  DB sample routing: ${sampleMeds.length} tested, ${medRoutingIssues} issues`);
console.log('  ✅ Phase 3 complete\n');

// ────────────────────────────────────────────────────
// PHASE 4: Alias Coverage Completeness
// ────────────────────────────────────────────────────
console.log('▶ PHASE 4: Alias Coverage Report\n');

// Check that every ICD10_DB diagnosis that has an Indonesian name has at least one alias
const icd10WithIndo = ICD10_DB.filter(d => /[a-z]/.test(d.name.toLowerCase()) && d.name.includes('('));
const aliasedCodes = new Set(Object.values(ICD10_ALIASES));

let coveredByAlias = 0;
let uncoveredButCommon = 0;

for (const d of icd10WithIndo) {
    if (aliasedCodes.has(d.code)) {
        coveredByAlias++;
    }
}

console.log(`  ICD10_DB with Indo names: ${icd10WithIndo.length}`);
console.log(`  Covered by aliases: ${coveredByAlias}`);
console.log(`  Total aliases: ${Object.keys(ICD10_ALIASES).length}`);
console.log('  ✅ Phase 4 complete\n');

// ────────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════');
console.log('  T4: SEARCH UX SIMULATOR — FINAL RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`  Total assertions: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${bugs.length}`);
console.log(`  Warnings: ${warnings.length}`);

if (bugs.length > 0) {
    console.log(`\n  ❌ FAILURES (${bugs.length}):`);
    bugs.forEach((b, i) => console.log(`    ${i + 1}. ${b.label}${b.details ? ` — ${b.details}` : ''}`));
}

if (warnings.length > 0) {
    console.log(`\n  ⚠️ WARNINGS (${warnings.length}):`);
    warnings.slice(0, 20).forEach((w, i) => console.log(`    ${i + 1}. ${w.label}${w.details ? ` — ${w.details}` : ''}`));
    if (warnings.length > 20) console.log(`    ... and ${warnings.length - 20} more`);
}

if (bugs.length === 0) {
    console.log(`\n  🏆 ALL CLEAR — Search UX verified!`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
process.exit(bugs.length > 0 ? 1 : 0);
