/**
 * MASTER AUDIT SCRIPT v3.0 (SUPER RIGOROUS)
 * Performs exhaustive checks on CaseLibrary.js and its neighbors.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const CASE_LIBRARY_PATH = './src/game/CaseLibrary.js';
const MEDICATION_DB_PATH = './src/data/MedicationDB.js';
const PATIENT_GEN_PATH = './src/game/PatientGenerator.js';

const rawCase = readFileSync(CASE_LIBRARY_PATH, 'utf-8');
const rawMed = readFileSync(MEDICATION_DB_PATH, 'utf-8');
const rawGen = readFileSync(PATIENT_GEN_PATH, 'utf-8');

// --- HELPER: Extract Set of IDs ---
function extractIds(text, pattern) {
    const set = new Set();
    let match;
    while ((match = pattern.exec(text)) !== null) {
        set.add(match[1]);
    }
    return set;
}

// 1. EXTRACT REFERENCE DATA
const MED_IDS = extractIds(rawMed, /id:\s*'([^']+)'/g);
const CASE_IDS = extractIds(rawCase, /\n\s{4}id:\s*'([^']+)'/g);

// Extract Education IDs
const eduSection = rawCase.match(/EDUCATION_OPTIONS\s*=\s*\[([\s\S]*?)\];/);
const EDU_IDS = eduSection ? extractIds(eduSection[1], /id:\s*'([^']+)'/g) : new Set();

// Extract Procedure IDs
const procSection = rawCase.match(/PROCEDURES_DB\s*=\s*\[([\s\S]*?)\];/);
const PROC_IDS = procSection ? extractIds(procSection[1], /id:\s*'([^']+)'/g) : new Set();

// Mapping of categorization in Generator
const mappedCasesInGen = extractIds(rawGen, /'([^']+)'/g); // Rough catch

const PE_KEYS = new Set(['general', 'vitals', 'heent', 'neck', 'thorax', 'abdomen', 'extremities', 'skin', 'neuro', 'rectal', 'genitalia', 'breast']);

const RESULTS = {
    critical: [],
    warning: [],
    info: []
};

function log(sev, caseId, msg) {
    RESULTS[sev].push({ caseId, msg });
}

// 2. PARSE CASES INDIVIDUALLY
const caseRegex = /\n\s{4}\{\s*\n\s{8}id:\s*'([^']+)'/g;
let m;
const cases = [];
while ((m = caseRegex.exec(rawCase)) !== null) {
    const start = m.index;
    let end = rawCase.indexOf('\n    },', start);
    if (end === -1) end = rawCase.indexOf('\n    }', start);
    const block = rawCase.substring(start, end + 6);
    cases.push({ id: m[1], block });
}

console.log(`\nStarting MASTER AUDIT v3.0... Found ${cases.length} cases.\n`);

const ALL_QUESTION_IDS = new Set();

cases.forEach(c => {
    const { id, block } = c;

    // A. Structural Checks
    if (!block.includes('diagnosis:')) log('critical', id, 'Missing diagnosis');
    if (!block.includes('icd10:')) log('critical', id, 'Missing icd10');
    if (!block.includes('skdi:')) log('critical', id, 'Missing skdi');
    if (!block.includes('category:')) log('critical', id, 'Missing category');
    if (!block.includes('vitals:')) log('critical', id, 'Missing vitals object');
    if (!block.includes('anamnesisQuestions:')) log('warning', id, 'Missing structured anamnesisQuestions');

    // B. Reference Checks (Meds, Procs, Edu)
    const extractArray = (field) => {
        const match = block.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
        if (!match) return [];
        return match[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
    };

    const meds = extractArray('correctTreatment');
    meds.forEach(m => { if (!MED_IDS.has(m)) log('critical', id, `Unknown Med ID: ${m}`); });

    const procs = extractArray('correctProcedures');
    procs.forEach(p => { if (!PROC_IDS.has(p)) log('critical', id, `Unknown Procedure ID: ${p}`); });

    const edus = extractArray('requiredEducation');
    edus.forEach(e => { if (!EDU_IDS.has(e)) log('critical', id, `Unknown Education ID: ${e}`); });

    // C. Physical Exam Keys - Only match keys at the start of a line (following standard formatting)
    const peSection = block.match(/physicalExamFindings:\s*\{([\s\S]*?)\}/);
    if (peSection) {
        // Find indented keys like '        heent:' or '        thorax:'
        const keys = peSection[1].match(/^\s{12}(\w+):/gm)?.map(k => k.trim().replace(':', '')) || [];
        keys.forEach(k => { if (!PE_KEYS.has(k)) log('warning', id, `Non-standard PE key: "${k}"`); });
    }

    // D. Anamnesis Integrity
    const qIds = block.match(/id:\s*'(q_[^']+)'/g)?.map(s => s.match(/'([^']+)'/)[1]) || [];
    qIds.forEach(qid => {
        ALL_QUESTION_IDS.add(qid);
    });

    const essential = extractArray('essentialQuestions');
    essential.forEach(eq => {
        if (!qIds.includes(eq)) log('critical', id, `Essential question ID ${eq} not found in anamnesisQuestions`);
    });

    if (essential.length < 2 && id !== 'general_checkup') log('info', id, `Low essential question count (${essential.length})`);

    // E. SKDI vs Referral Logic
    const skdiMatch = block.match(/skdi:\s*'([^']+)'/);
    const skdi = skdiMatch ? skdiMatch[1] : '';
    const isNonReferrable = block.includes('nonReferrable: true');
    const isReferralRequired = block.includes('referralRequired: true');

    if (skdi === '2' && !isReferralRequired) {
        log('warning', id, `SKDI 2 case missing referralRequired: true`);
    }

    // F. Vital Signs Logic - Extract temperature more carefully
    const tempMatch = block.match(/vitals:\s*\{[^}]*temp:\s*([\d.]+)/);
    const pfVitalsMatch = block.match(/vitals:\s*"([^"]+)"/);
    if (tempMatch && pfVitalsMatch) {
        const pfTempMatch = pfVitalsMatch[1].match(/S\s*([\d.]+)/);
        if (pfTempMatch) {
            if (parseFloat(tempMatch[1]) !== parseFloat(pfTempMatch[1])) {
                log('warning', id, `Temp mismatch: vitals.temp (${tempMatch[1]}) vs physicalExamFindings.vitals (${pfTempMatch[1]})`);
            }
        }
    }

    // G. ICD-10 formatting
    const icdMatch = block.match(/icd10:\s*'([^']+)'/);
    if (icdMatch && !/^[A-Z]\d{2}(\.\d{1,2})?$/.test(icdMatch[1])) {
        log('info', id, `Non-standard ICD10 format: ${icdMatch[1]}`);
    }

    // H. Generator Mapping Check
    if (!mappedCasesInGen.has(id)) {
        // Note:mappedCasesInGen.has(id) might be flakey with simple regex, but good for overview
        // log('info', id, `Case ID not explicitly found in PatientGenerator CONDITION_CASE_MAPPING (potential orphan)`);
    }
});

// OUTPUT
console.log('--- CRITICAL ---');
if (RESULTS.critical.length === 0) console.log('NONE');
else RESULTS.critical.forEach(r => console.log(`[${r.caseId}] ${r.msg}`));

console.log('\n--- WARNING ---');
if (RESULTS.warning.length === 0) console.log('NONE');
else RESULTS.warning.forEach(r => console.log(`[${r.caseId}] ${r.msg}`));

console.log('\n--- INFO ---');
if (RESULTS.info.length === 0) console.log('NONE');
else RESULTS.info.forEach(r => console.log(`[${r.caseId}] ${r.msg}`));

console.log('\nAudit complete.');
