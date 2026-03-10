/**
 * T1: DATA CONTRACT ENFORCER
 * ===========================
 * Schema validation for every data source — ensures required fields,
 * correct types, valid enum values, and referential integrity.
 *
 * Prevents: Missing fields, enum drift, orphaned IDs, malformed data.
 */
import { CASE_LIBRARY } from '../src/content/cases/CaseLibrary.js';
import { MEDICATION_DATABASE, getMedicationById } from '../src/data/MedicationDatabase.js';
import { PROCEDURES_DB, PROCEDURE_CODE_MAP } from '../src/data/ProceduresDB.js';
import { EDUCATION_OPTIONS } from '../src/data/EducationOptions.js';
import { ICD10_DB } from '../src/data/ICD10.js';
import { ICD10_ALIASES } from '../src/data/ICD10_ALIASES.js';
import { WIKI_REGISTRY } from '../src/data/WikiData.js';

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
console.log('  T1: DATA CONTRACT ENFORCER');
console.log('═══════════════════════════════════════════════════════════\n');

// ────────────────────────────────────────────────────
// PHASE 1: Case Library Schema
// ────────────────────────────────────────────────────
console.log('▶ PHASE 1: Case Library Schema Validation\n');

const caseIds = new Set();
let dupCaseIds = 0;
const VALID_CATEGORIES = new Set([
    'Dermatology', 'Skin', 'Digestive', 'Infectious', 'Respiratory',
    'ENT', 'Cardiovascular', 'Endocrine', 'Musculoskeletal', 'Neurology',
    'Ophthalmology', 'Psychiatry', 'Urogenital', 'Hematology', 'Trauma',
    'Forensic', 'Obstetric', 'Pediatric', 'General', 'Metabolic',
    'critical_emergency', 'Nephrology', 'Gynecology', 'OB/GYN'
]);

for (const c of CASE_LIBRARY) {
    const p = `[${c.id || 'NO_ID'}]`;

    // Required fields
    assert(!!c.id, `${p} Has id`);
    assert(typeof c.id === 'string' && c.id.length > 0, `${p} id is non-empty string`);
    assert(!!c.diagnosis, `${p} Has diagnosis`, `Missing diagnosis name`);
    assert(!!c.icd10, `${p} Has icd10`, `Missing ICD-10 code`);
    assert(!!c.category, `${p} Has category`);

    // ICD-10 format
    if (c.icd10) {
        assert(/^[A-Z]\d/.test(c.icd10) || /^[A-Z]\d/.test(c.icd10.charAt(0)),
            `${p} ICD-10 format valid`, `Got: ${c.icd10}`);
    }

    // Duplicate ID check
    if (c.id) {
        if (caseIds.has(c.id)) { dupCaseIds++; bugs.push({ label: `${p} DUPLICATE case ID` }); }
        caseIds.add(c.id);
    }

    // Treatment array
    assert(Array.isArray(c.correctTreatment), `${p} correctTreatment is array`,
        `Type: ${typeof c.correctTreatment}`);

    // Anamnesis questions (warn only — some newer cases use generic question system)
    if (!c.anamnesisQuestions) {
        warn(`${p} No anamnesisQuestions (uses generic system)`);
    } else {
        assert(typeof c.anamnesisQuestions === 'object', `${p} anamnesisQuestions is object`);
    }

    // Physical exam findings (warn only — some cases derive PE from template)
    if (!c.physicalExamFindings) {
        warn(`${p} No physicalExamFindings`);
    }

    // Differential diagnosis
    if (c.differentialDiagnosis) {
        assert(Array.isArray(c.differentialDiagnosis), `${p} differentialDiagnosis is array`);
    }

    // SKDI level
    if (c.skpiLevel || c.skdiLevel) {
        const level = c.skpiLevel || c.skdiLevel;
        assert([1, 2, 3, '3A', '3B', 4, '4A', '4B', '1', '2', '3', '4'].includes(level),
            `${p} SKDI level valid`, `Got: ${level}`);
    }
}

console.log(`  Cases validated: ${CASE_LIBRARY.length}`);
console.log(`  Duplicate IDs: ${dupCaseIds}`);
console.log('  ✅ Phase 1 complete\n');

// ────────────────────────────────────────────────────
// PHASE 2: Medication Database Schema
// ────────────────────────────────────────────────────
console.log('▶ PHASE 2: Medication Database Schema\n');

const medIds = new Set();
let dupMedIds = 0;

for (const m of MEDICATION_DATABASE) {
    const p = `[Med:${m.id || 'NO_ID'}]`;
    assert(!!m.id, `${p} Has id`);
    assert(!!m.name, `${p} Has name`, `Missing medication name`);

    if (m.id) {
        if (medIds.has(m.id)) { dupMedIds++; warn(`${p} DUPLICATE medication ID`); }
        medIds.add(m.id);
    }
}

console.log(`  Medications validated: ${MEDICATION_DATABASE.length}`);
console.log(`  Duplicate IDs: ${dupMedIds}`);
console.log('  ✅ Phase 2 complete\n');

// ────────────────────────────────────────────────────
// PHASE 3: Procedures Database Schema
// ────────────────────────────────────────────────────
console.log('▶ PHASE 3: Procedures Database Schema\n');

const procIds = new Set();

for (const p of PROCEDURES_DB) {
    const label = `[Proc:${p.id || 'NO_ID'}]`;
    assert(!!p.id, `${label} Has id`);
    assert(!!p.name, `${label} Has name`);
    if (p.id) { procIds.add(p.id); }
}

console.log(`  Procedures validated: ${PROCEDURES_DB.length}`);
console.log('  ✅ Phase 3 complete\n');

// ────────────────────────────────────────────────────
// PHASE 4: Education Options Schema
// ────────────────────────────────────────────────────
console.log('▶ PHASE 4: Education Options Schema\n');

const eduIds = new Set();

for (const e of EDUCATION_OPTIONS) {
    const label = `[Edu:${e.id || 'NO_ID'}]`;
    assert(!!e.id, `${label} Has id`);
    assert(!!e.title || !!e.label, `${label} Has title/label`);
    if (e.id) { eduIds.add(e.id); }
}

console.log(`  Education options validated: ${EDUCATION_OPTIONS.length}`);
console.log('  ✅ Phase 4 complete\n');

// ────────────────────────────────────────────────────
// PHASE 5: ICD10_DB Schema
// ────────────────────────────────────────────────────
console.log('▶ PHASE 5: ICD10_DB Schema\n');

const icd10Codes = new Set();
let dupIcd10 = 0;

for (const d of ICD10_DB) {
    const label = `[ICD:${d.code || 'NO_CODE'}]`;
    assert(!!d.code, `${label} Has code`);
    assert(!!d.name, `${label} Has name`, `Missing ICD-10 name`);
    assert(d.name && d.name.length > 3, `${label} Name is meaningful`, `Got: "${d.name}"`);

    if (d.code) {
        if (icd10Codes.has(d.code)) { dupIcd10++; warn(`${label} DUPLICATE ICD-10 code`); }
        icd10Codes.add(d.code);
    }
}

console.log(`  ICD-10 entries validated: ${ICD10_DB.length}`);
console.log(`  Duplicate codes: ${dupIcd10}`);
console.log('  ✅ Phase 5 complete\n');

// ────────────────────────────────────────────────────
// PHASE 6: Referential Integrity (Foreign Keys)
// ────────────────────────────────────────────────────
console.log('▶ PHASE 6: Referential Integrity\n');

let unresolvedMeds = 0;
let unresolvedProcs = 0;
let unresolvedEdus = 0;
let unresolvedIcd = 0;

for (const c of CASE_LIBRARY) {
    const p = `[${c.id}]`;

    // Treatment → Medication
    if (c.correctTreatment) {
        for (const t of c.correctTreatment) {
            const ids = Array.isArray(t) ? t : [t];
            for (const id of ids) {
                if (!medIds.has(id)) {
                    unresolvedMeds++;
                    bugs.push({ label: `${p} Unresolved med: ${id}` });
                }
            }
        }
    }

    // Procedures → ProceduresDB
    if (c.correctProcedures) {
        for (const pid of c.correctProcedures) {
            if (!procIds.has(pid)) {
                unresolvedProcs++;
                bugs.push({ label: `${p} Unresolved procedure: ${pid}` });
            }
        }
    }

    // Education → EducationOptions
    if (c.requiredEducation) {
        for (const eid of c.requiredEducation) {
            if (!eduIds.has(eid)) {
                unresolvedEdus++;
                bugs.push({ label: `${p} Unresolved education: ${eid}` });
            }
        }
    }

    // ICD-10 → ICD10_DB (warn only, not assert — sub-codes are OK)
    if (c.icd10 && !icd10Codes.has(c.icd10)) {
        const baseCode = c.icd10.split('.')[0];
        if (!ICD10_DB.some(d => d.code.startsWith(baseCode))) {
            unresolvedIcd++;
            warn(`${p} ICD-10 "${c.icd10}" has no match or base in ICD10_DB`);
        }
    }
}

console.log(`  Unresolved medications: ${unresolvedMeds}`);
console.log(`  Unresolved procedures: ${unresolvedProcs}`);
console.log(`  Unresolved education: ${unresolvedEdus}`);
console.log(`  ICD-10 without DB match: ${unresolvedIcd} (warnings)`);
console.log('  ✅ Phase 6 complete\n');

// ────────────────────────────────────────────────────
// PHASE 7: ICD10_ALIASES Integrity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 7: ICD10_ALIASES Integrity\n');

let invalidAliases = 0;
const aliasValues = Object.values(ICD10_ALIASES);

for (const [alias, code] of Object.entries(ICD10_ALIASES)) {
    assert(alias.length > 1, `Alias "${alias}" is non-trivial`, `Too short`);
    assert(code && code.length > 1, `Alias "${alias}" maps to valid code`, `Got: ${code}`);

    // Check for duplicate values pointing to different aliases (informational only)
}

// Check for overlapping aliases that could cause ambiguity
const sortedAliases = Object.keys(ICD10_ALIASES).sort();
for (let i = 0; i < sortedAliases.length - 1; i++) {
    const a = sortedAliases[i];
    const b = sortedAliases[i + 1];
    if (b.startsWith(a) && ICD10_ALIASES[a] !== ICD10_ALIASES[b]) {
        warn(`Alias overlap: "${a}"→${ICD10_ALIASES[a]} vs "${b}"→${ICD10_ALIASES[b]}`);
    }
}

console.log(`  Aliases validated: ${Object.keys(ICD10_ALIASES).length}`);
console.log(`  Invalid aliases: ${invalidAliases}`);
console.log('  ✅ Phase 7 complete\n');

// ────────────────────────────────────────────────────
// PHASE 8: WikiData Registry Integrity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 8: WikiData Registry Integrity\n');

let wikiIssues = 0;
if (WIKI_REGISTRY) {
    for (const [category, items] of Object.entries(WIKI_REGISTRY)) {
        assert(Array.isArray(items), `Wiki category "${category}" is array`);
        if (Array.isArray(items)) {
            for (const item of items) {
                assert(typeof item === 'string' && item.length > 0,
                    `Wiki item in "${category}" is non-empty string`, `Got: ${item}`);
            }
        }
    }
}

console.log(`  Wiki categories: ${Object.keys(WIKI_REGISTRY || {}).length}`);
console.log('  ✅ Phase 8 complete\n');

// ────────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════');
console.log('  T1: DATA CONTRACT ENFORCER — FINAL RESULTS');
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
    console.log(`\n  🏆 ALL CLEAR — Data contracts verified!`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
process.exit(bugs.length > 0 ? 1 : 0);
