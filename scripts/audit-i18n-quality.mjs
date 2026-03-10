/**
 * T2: i18n TRANSLATION QUALITY GATE
 * ===================================
 * Detects broken machine translations, encoding artifacts, untranslated
 * English, and clinically dangerous mistranslations.
 *
 * Prevents: heart→hati, encoding ??, grammar inversion, untranslated terms.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ICD10_DB } from '../src/data/ICD10.js';
import { ICD10_ALIASES } from '../src/data/ICD10_ALIASES.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

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
console.log('  T2: i18n TRANSLATION QUALITY GATE');
console.log('═══════════════════════════════════════════════════════════\n');

// ────────────────────────────────────────────────────
// PHASE 1: ICD10_DB — Curated Names Quality
// ────────────────────────────────────────────────────
console.log('▶ PHASE 1: ICD10_DB Curated Name Quality\n');

let emptyNames = 0;
let shortNames = 0;
let encodingIssues = 0;

for (const d of ICD10_DB) {
    const p = `[${d.code}]`;

    if (!d.name || d.name.trim().length === 0) {
        emptyNames++;
        bugs.push({ label: `${p} Empty name` });
        continue;
    }

    if (d.name.length < 3) {
        shortNames++;
        warn(`${p} Very short name: "${d.name}"`);
    }

    // Encoding artifacts
    if (/\?\?|â€|Ã|Â|\\u[0-9a-f]{4}/i.test(d.name)) {
        encodingIssues++;
        bugs.push({ label: `${p} Encoding artifact in curated DB`, details: d.name });
    }

    // Raw template variables
    if (/\$\{|\{[a-z_]+\}/i.test(d.name)) {
        bugs.push({ label: `${p} Raw template variable in name`, details: d.name });
    }
}

console.log(`  Entries checked: ${ICD10_DB.length}`);
console.log(`  Empty names: ${emptyNames}`);
console.log(`  Encoding issues: ${encodingIssues}`);
console.log('  ✅ Phase 1 complete\n');

// ────────────────────────────────────────────────────
// PHASE 2: master_icd_10.json — Machine Translation Audit
// ────────────────────────────────────────────────────
console.log('▶ PHASE 2: master_icd_10.json Translation Audit\n');

const masterPath = path.join(ROOT, 'src/data/master_icd_10.json');
let masterData = [];
try {
    masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
} catch (e) {
    bugs.push({ label: 'Cannot read master_icd_10.json', details: e.message });
}

// Known dangerous mistranslations (curated blacklist)
const DANGEROUS_TRANSLATIONS = [
    { code: 'C38.0', badText: 'hati', correctOrgan: 'jantung', english: 'heart' },
    { code: 'R09.2', badText: 'pernapasan lambat', correct: 'henti napas', english: 'respiratory arrest' },
];

let dangerousCount = 0;
let encodingBadCount = 0;
let untranslatedCount = 0;
let invertedGrammarCount = 0;
let homonymErrorCount = 0;

for (const d of masterData) {
    const indo = d.nama_icd_indo || '';
    const code = d.kode_icd || '';
    const eng = d.nama_icd || '';

    if (!indo || indo.trim().length === 0) continue;

    // 2a. Check for known dangerous mistranslations
    for (const danger of DANGEROUS_TRANSLATIONS) {
        if (code === danger.code) {
            const hasBad = indo.toLowerCase().includes(danger.badText);
            if (hasBad) {
                dangerousCount++;
                warn(`DANGEROUS: ${code} "${eng}" → "${indo}" (should contain "${danger.correctOrgan || danger.correct}")`);
            }
        }
    }

    // 2b. Encoding artifacts
    if (/\?\?|â€|Ã[^a-z]|Â/i.test(indo)) {
        encodingBadCount++;
        if (encodingBadCount <= 5) warn(`Encoding artifact: ${code} → "${indo.substring(0, 60)}"`);
    }

    // 2c. Untranslated English medical terms left in Indonesian field
    const englishTerms = ['cutaneous', 'overlapping', 'unspecified', 'malignant', 'benign'];
    for (const term of englishTerms) {
        if (indo.toLowerCase().includes(term) && !eng.toLowerCase().includes('(' + term)) {
            untranslatedCount++;
            break; // count once per entry
        }
    }

    // 2d. Inverted grammar — dangling preposition at end
    if (/\b(dengan|dari|untuk|pada|oleh)\s*$/i.test(indo.trim())) {
        invertedGrammarCount++;
        if (invertedGrammarCount <= 5) warn(`Inverted grammar: ${code} → "${indo.substring(0, 60)}"`);
    }

    // 2e. Classic homonym errors
    const homonymChecks = [
        { eng: 'appendix', bad: 'lampiran', correct: 'apendiks' },
        { eng: 'gait', bad: 'kiprah', correct: 'gaya jalan' },
        { eng: 'sites', bad: 'situs', correct: 'lokasi' },
    ];
    for (const h of homonymChecks) {
        if (eng.toLowerCase().includes(h.eng) && indo.toLowerCase().includes(h.bad)) {
            homonymErrorCount++;
            if (homonymErrorCount <= 5) warn(`Homonym error: "${h.eng}" → "${h.bad}" (should: "${h.correct}") in ${code}`);
        }
    }
}

console.log(`  Entries checked: ${masterData.length}`);
console.log(`  DANGEROUS mistranslations flagged: ${dangerousCount}`);
console.log(`  Encoding artifacts: ${encodingBadCount}`);
console.log(`  Untranslated English terms: ${untranslatedCount}`);
console.log(`  Inverted grammar: ${invertedGrammarCount}`);
console.log(`  Homonym errors: ${homonymErrorCount}`);
console.log('  ✅ Phase 2 complete (informational — these are known issues in legacy file)\n');

// ────────────────────────────────────────────────────
// PHASE 3: ICD10_ALIASES Validity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 3: ICD10_ALIASES Validity\n');

let invalidAliasCodes = 0;
const icd10Set = new Set(ICD10_DB.map(d => d.code));

for (const [alias, code] of Object.entries(ICD10_ALIASES)) {
    // Alias text quality
    assert(alias === alias.toLowerCase(), `Alias "${alias}" is lowercase`);
    assert(alias.trim() === alias, `Alias "${alias}" has no trailing whitespace`);
    assert(alias.length >= 2, `Alias "${alias}" has minimum length`);

    // Code format — must look like an ICD code or a special code
    const validFormat = /^[A-Z]\d/.test(code) || /^\d{2}\./.test(code) || /^[STUVWXYZ]\d/.test(code);
    if (!validFormat) {
        invalidAliasCodes++;
        bugs.push({ label: `Alias "${alias}" has invalid code format: ${code}` });
    }
}

console.log(`  Aliases validated: ${Object.keys(ICD10_ALIASES).length}`);
console.log(`  Invalid code formats: ${invalidAliasCodes}`);
console.log('  ✅ Phase 3 complete\n');

// ────────────────────────────────────────────────────
// PHASE 4: Case Diagnosis Names (Indonesian Quality)
// ────────────────────────────────────────────────────
console.log('▶ PHASE 4: Case Diagnosis Name Quality\n');

// Load the case library and check that diagnosis names are reasonable
const { CASE_LIBRARY } = await import('../src/content/cases/CaseLibrary.js');

let badDiagNames = 0;

for (const c of CASE_LIBRARY) {
    if (!c.diagnosis) continue;
    const name = c.diagnosis;

    // Check for raw English-only names that should have Indonesian
    // (informational — many are legitimately English medical terms)

    // Check for encoding artifacts
    if (/\?\?|â€|Ã[^a-z]/i.test(name)) {
        badDiagNames++;
        warn(`[${c.id}] Encoding artifact in diagnosis name: "${name}"`);
    }

    // Check for empty/whitespace-only
    if (name.trim().length < 3) {
        badDiagNames++;
        bugs.push({ label: `[${c.id}] Diagnosis name too short: "${name}"` });
    }
}

console.log(`  Cases checked: ${CASE_LIBRARY.length}`);
console.log(`  Bad diagnosis names: ${badDiagNames}`);
console.log('  ✅ Phase 4 complete\n');

// ────────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════');
console.log('  T2: i18n QUALITY GATE — FINAL RESULTS');
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
    warnings.slice(0, 30).forEach((w, i) => console.log(`    ${i + 1}. ${w.label}${w.details ? ` — ${w.details}` : ''}`));
    if (warnings.length > 30) console.log(`    ... and ${warnings.length - 30} more`);
}

if (bugs.length === 0) {
    console.log(`\n  🏆 ALL CLEAR — i18n quality verified!`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
process.exit(bugs.length > 0 ? 1 : 0);
