/**
 * COMPREHENSIVE CASE LIBRARY AUDIT
 * Multi-layer validation covering:
 * 1. Structural Integrity (required fields, data types)
 * 2. Cross-Reference Validation (medications, procedures, education, physical exam keys)
 * 3. Anamnesis Quality (sections, essential questions, response depth)
 * 4. Clinical Coherence (symptom-diagnosis alignment, category consistency)
 * 5. ICD-10 Validation
 * 6. Referral Logic Consistency
 */
import fs, { readFileSync } from 'fs';
import path from 'path';

// === LOAD DATA ===
// === LOAD DATA ===
const ROOT_DIR = '.';
const caseDir = path.join(ROOT_DIR, 'src/game/cases');

function getFilesRecursively(dir, filter) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(file, filter));
        } else if (filter(file)) {
            results.push(file);
        }
    });
    return results;
}

const caseFiles = getFilesRecursively(caseDir, (f) => f.endsWith('.js'));
let raw = '';
caseFiles.forEach(f => {
    raw += fs.readFileSync(f, 'utf-8') + '\n';
});

// === EXTRACT REFERENCE IDS ===

const MEDICATION_IDS = new Set();
// Scan MedicationDatabase.js for direct IDs AND registries
const medRegistryDir = path.join(ROOT_DIR, 'src/data/medication/registry');
if (fs.existsSync(medRegistryDir)) {
    const medRegistryFiles = fs.readdirSync(medRegistryDir).filter(f => f.endsWith('.js'));
    medRegistryFiles.forEach(f => {
        const content = fs.readFileSync(path.join(medRegistryDir, f), 'utf-8');
        const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
        for (const m of idMatches) {
            MEDICATION_IDS.add(m[1]);
        }
    });
}

// Support MedicationDatabase.js as well
const medDbPath = path.join(ROOT_DIR, 'src/data/MedicationDatabase.js');
if (fs.existsSync(medDbPath)) {
    const content = fs.readFileSync(medDbPath, 'utf-8');
    const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
    for (const m of idMatches) {
        MEDICATION_IDS.add(m[1]);
    }
}
console.log(`✅ Extracted ${MEDICATION_IDS.size} total medication IDs.`);

// Extract procedure IDs from ProceduresDB.js
const procPath = path.join(ROOT_DIR, 'src/data/ProceduresDB.js');
const PROCEDURE_IDS = new Set();
if (fs.existsSync(procPath)) {
    const procRaw = fs.readFileSync(procPath, 'utf-8');
    const procIdPattern = /id:\s*['"]([^'"]+)['"]/g;
    let p;
    while ((p = procIdPattern.exec(procRaw)) !== null) {
        PROCEDURE_IDS.add(p[1]);
    }
}

// Extract education IDs from EducationOptions.js
const eduPath = path.join(ROOT_DIR, 'src/data/EducationOptions.js');
const EDUCATION_IDS = new Set();
if (fs.existsSync(eduPath)) {
    const eduRaw = fs.readFileSync(eduPath, 'utf-8');
    const eduIdPattern = /id:\s*['"]([^'"]+)['"]/g;
    let e;
    while ((e = eduIdPattern.exec(eduRaw)) !== null) {
        EDUCATION_IDS.add(e[1]);
    }
}

// Physical exam keys
const PHYSICAL_EXAM_KEYS = new Set([
    'general', 'vitals', 'heent', 'neck', 'thorax', 'abdomen',
    'extremities', 'skin', 'neuro', 'rectal', 'genitalia', 'breast'
]);

// Valid categories
const VALID_CATEGORIES = new Set([
    'Respiratory', 'Digestive', 'Cardiovascular', 'Infection', 'Dermatology',
    'Neurology', 'Urinary', 'Endocrine', 'Hematology', 'Psychiatry',
    'Ophthalmology', 'ENT', 'Dental', 'Maternal', 'Pediatric', 'Musculoskeletal',
    'Preventive', 'Emergency', 'Trauma', 'Reproductive'
]);

// Valid risk levels
const VALID_RISK_LEVELS = new Set(['low', 'medium', 'high', 'emergency']);

// === EXTRACT CASE OBJECTS ===
const casePattern = /\n\s{4}\{\s*\n\s{8}id:\s*'([^']+)'/g;
let match;
const caseEntries = [];
while ((match = casePattern.exec(raw)) !== null) {
    caseEntries.push({ id: match[1], pos: match.index });
}

console.log(`\n${'='.repeat(60)}`);
console.log(`  COMPREHENSIVE CASE LIBRARY AUDIT`);
console.log(`${'='.repeat(60)}\n`);
console.log(`📊 Reference Data Loaded:`);
console.log(`   - Medications: ${MEDICATION_IDS.size} IDs`);
console.log(`   - Procedures: ${PROCEDURE_IDS.size} IDs`);
console.log(`   - Education Options: ${EDUCATION_IDS.size} IDs`);
console.log(`   - Cases Found: ${caseEntries.length}\n`);

// === AUDIT RESULTS ===
const issues = {
    critical: [],
    warning: [],
    info: []
};

function addIssue(caseId, severity, category, msg) {
    issues[severity].push({ caseId, category, msg });
}

// === AUDIT EACH CASE ===
caseEntries.forEach((entry, idx) => {
    const start = entry.pos;
    const end = idx < caseEntries.length - 1 ? caseEntries[idx + 1].pos : raw.indexOf('];', start);
    const block = raw.substring(start, end);
    const caseId = entry.id;

    // --- 1. STRUCTURAL INTEGRITY ---

    // Required fields
    const requiredFields = ['diagnosis', 'icd10', 'skdi', 'category', 'symptoms', 'vitals'];
    requiredFields.forEach(field => {
        // More robust key check: "field:" or "field :" or "field  :"
        const keyPattern = new RegExp(`\\b${field}\\s*:`, 'i');
        if (!keyPattern.test(block)) {
            addIssue(caseId, 'critical', 'STRUCTURE', `Missing required field: ${field}`);
        }
    });

    // Extract key values
    const diagMatch = block.match(/diagnosis:\s*'([^']+)'/);
    const diagnosis = diagMatch ? diagMatch[1] : 'UNKNOWN';

    const icdMatch = block.match(/icd10:\s*'([^']+)'/);
    const icd10 = icdMatch ? icdMatch[1] : null;

    const catMatch = block.match(/category:\s*'([^']+)'/);
    const category = catMatch ? catMatch[1] : null;

    const riskMatch = block.match(/risk:\s*'([^']+)'/);
    const risk = riskMatch ? riskMatch[1] : null;

    // Validate category
    if (category && !VALID_CATEGORIES.has(category)) {
        addIssue(caseId, 'warning', 'STRUCTURE', `Unknown category: "${category}"`);
    }

    // Validate risk level
    if (risk && !VALID_RISK_LEVELS.has(risk)) {
        addIssue(caseId, 'warning', 'STRUCTURE', `Invalid risk level: "${risk}"`);
    }

    // --- 2. CROSS-REFERENCE VALIDATION ---

    // Validate correctTreatment IDs
    const treatmentMatch = block.match(/correctTreatment:\s*\[([^\]]*)\]/);
    if (treatmentMatch) {
        const treatmentIds = treatmentMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
        treatmentIds.forEach(tid => {
            // Handle alternative medications (arrays within correctTreatment)
            if (!MEDICATION_IDS.has(tid)) {
                addIssue(caseId, 'critical', 'CROSSREF', `Unknown medication ID: "${tid}"`);
            }
        });
    }

    // Validate correctProcedures IDs
    const procMatch = block.match(/correctProcedures:\s*\[([^\]]*)\]/);
    if (procMatch) {
        const procIds = procMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
        procIds.forEach(pid => {
            if (!PROCEDURE_IDS.has(pid)) {
                addIssue(caseId, 'critical', 'CROSSREF', `Unknown procedure ID: "${pid}"`);
            }
        });
    }

    // Validate requiredEducation IDs
    const eduMatch = block.match(/requiredEducation:\s*\[([^\]]*)\]/);
    if (eduMatch) {
        const eduIds = eduMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
        eduIds.forEach(eid => {
            if (!EDUCATION_IDS.has(eid)) {
                addIssue(caseId, 'critical', 'CROSSREF', `Unknown education ID: "${eid}"`);
            }
        });
    }

    // Validate physicalExamFindings keys - only match keys at start of line with proper indentation
    const pefMatch = block.match(/physicalExamFindings:\s*\{([\s\S]*?)\n\s{8}\}/);
    if (pefMatch) {
        // Only match keys that appear at beginning after whitespace (actual object keys)
        const pefKeys = pefMatch[1].match(/^\s*(\w+):/gm)?.map(s => s.trim().replace(':', '')) || [];
        pefKeys.forEach(key => {
            if (!PHYSICAL_EXAM_KEYS.has(key)) {
                addIssue(caseId, 'warning', 'CROSSREF', `Unknown physical exam key: "${key}"`);
            }
        });
    } else {
        addIssue(caseId, 'warning', 'STRUCTURE', `Missing physicalExamFindings`);
    }

    // --- 3. ANAMNESIS QUALITY ---

    const hasStructured = block.includes('anamnesisQuestions:');
    const hasLegacy = block.includes('anamnesis: [');

    if (!hasStructured && !hasLegacy) {
        addIssue(caseId, 'critical', 'ANAMNESIS', `No anamnesis data at all`);
    } else if (!hasStructured) {
        addIssue(caseId, 'warning', 'ANAMNESIS', `Only legacy anamnesis[], missing structured anamnesisQuestions`);
    } else {
        // Check anamnesis sections
        const sections = ['keluhan_utama', 'rps', 'rpd', 'rpk', 'sosial'];
        const missingSections = sections.filter(s => !block.includes(`${s}:`));
        if (missingSections.length > 0) {
            addIssue(caseId, 'warning', 'ANAMNESIS', `Missing sections: ${missingSections.join(', ')}`);
        }

        // Count questions
        const questionCount = (block.match(/text:\s*'/g) || []).length;
        if (questionCount < 3) {
            addIssue(caseId, 'warning', 'ANAMNESIS', `Only ${questionCount} questions (recommend ≥4)`);
        }

        // Check for empty responses
        const emptyResponses = (block.match(/response:\s*''/g) || []).length;
        if (emptyResponses > 0) {
            addIssue(caseId, 'critical', 'ANAMNESIS', `${emptyResponses} empty response(s)`);
        }

        // Validate essentialQuestions cross-reference
        const essMatch = block.match(/essentialQuestions:\s*\[([^\]]+)\]/);
        if (essMatch) {
            const essIds = essMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
            const qIdPattern = /id:\s*'(q_[^']+)'/g;
            const qIds = [];
            let qm;
            while ((qm = qIdPattern.exec(block)) !== null) {
                qIds.push(qm[1]);
            }
            const brokenRefs = essIds.filter(e => !qIds.includes(e));
            if (brokenRefs.length > 0) {
                addIssue(caseId, 'critical', 'ANAMNESIS', `essentialQuestions reference missing IDs: ${brokenRefs.join(', ')}`);
            }
        } else {
            addIssue(caseId, 'warning', 'ANAMNESIS', `No essentialQuestions defined`);
        }

        // Check for empty arrays in rpk/sosial
        if (block.match(/rpk:\s*\[\s*\]/)) {
            addIssue(caseId, 'info', 'ANAMNESIS', `Empty rpk[] (family history)`);
        }
        if (block.match(/sosial:\s*\[\s*\]/)) {
            addIssue(caseId, 'info', 'ANAMNESIS', `Empty sosial[] (social history)`);
        }
    }

    // --- 4. CLINICAL COHERENCE ---

    // Check symptoms array exists and has content
    const symptomsMatch = block.match(/symptoms:\s*\[([^\]]+)\]/);
    if (!symptomsMatch) {
        addIssue(caseId, 'warning', 'CLINICAL', `No symptoms array`);
    } else {
        const symptomCount = (symptomsMatch[1].match(/'/g) || []).length / 2;
        if (symptomCount < 2) {
            addIssue(caseId, 'info', 'CLINICAL', `Only ${symptomCount} symptom(s) listed`);
        }
    }

    // Check for clue field
    if (!block.includes('clue:')) {
        addIssue(caseId, 'info', 'CLINICAL', `No diagnostic clue provided`);
    }

    // Check differential diagnosis
    const diffMatch = block.match(/differentialDiagnosis:\s*\[([^\]]*)\]/);
    if (!diffMatch || diffMatch[1].trim() === '') {
        addIssue(caseId, 'info', 'CLINICAL', `No differentialDiagnosis`);
    }

    // --- 5. ICD-10 VALIDATION ---
    if (icd10) {
        // Basic ICD-10 format check (letter followed by digits, optional dot and more chars)
        if (!/^[A-Z]\d{2}(\.\d{1,2})?$/.test(icd10)) {
            addIssue(caseId, 'warning', 'ICD10', `Invalid ICD-10 format: "${icd10}"`);
        }
    } else {
        addIssue(caseId, 'critical', 'ICD10', `Missing ICD-10 code`);
    }

    // --- 6. REFERRAL LOGIC ---
    const hasNonReferrable = block.includes('nonReferrable:'); // Detects both true and false
    const hasReferralRequired = block.includes('referralRequired: true');
    const hasReferralExceptions = block.includes('referralExceptions:');

    if (block.includes('nonReferrable: true') && hasReferralRequired) {
        addIssue(caseId, 'critical', 'REFERRAL', `Conflicting: both nonReferrable and referralRequired are true`);
    }

    if (!hasNonReferrable && !hasReferralRequired) {
        addIssue(caseId, 'info', 'REFERRAL', `No explicit referral policy (nonReferrable or referralRequired)`);
    }

    // --- 7. TREATMENT COMPLETENESS ---
    const treatMatch = block.match(/correctTreatment:\s*\[([^\]]*)\]/);
    const procTreatMatch = block.match(/correctProcedures:\s*\[([^\]]*)\]/);
    const eduTreatMatch = block.match(/requiredEducation:\s*\[([^\]]*)\]/);

    if (treatMatch && treatMatch[1].trim() === '' &&
        procTreatMatch && procTreatMatch[1].trim() === '' &&
        eduTreatMatch && eduTreatMatch[1].trim() === '') {
        addIssue(caseId, 'warning', 'TREATMENT', `No treatments, procedures, or education required (all empty)`);
    }
});

// === PRINT RESULTS ===
console.log(`\n${'─'.repeat(60)}`);
console.log(`  AUDIT RESULTS`);
console.log(`${'─'.repeat(60)}\n`);

console.log(`🔴 CRITICAL ISSUES (${issues.critical.length}):`);
if (issues.critical.length === 0) {
    console.log(`   ✅ None found!`);
} else {
    const grouped = {};
    issues.critical.forEach(i => {
        if (!grouped[i.caseId]) grouped[i.caseId] = [];
        grouped[i.caseId].push(`[${i.category}] ${i.msg}`);
    });
    Object.entries(grouped).forEach(([caseId, msgs]) => {
        console.log(`   ❌ ${caseId}:`);
        msgs.forEach(m => console.log(`      - ${m}`));
    });
}

console.log(`\n🟡 WARNINGS (${issues.warning.length}):`);
if (issues.warning.length === 0) {
    console.log(`   ✅ None found!`);
} else {
    const grouped = {};
    issues.warning.forEach(i => {
        if (!grouped[i.caseId]) grouped[i.caseId] = [];
        grouped[i.caseId].push(`[${i.category}] ${i.msg}`);
    });
    Object.entries(grouped).forEach(([caseId, msgs]) => {
        console.log(`   ⚠️  ${caseId}:`);
        msgs.forEach(m => console.log(`      - ${m}`));
    });
}

console.log(`\n🔵 INFO (${issues.info.length}):`);
if (issues.info.length === 0) {
    console.log(`   ✅ None found!`);
} else {
    // Group by category for info
    const byCategory = {};
    issues.info.forEach(i => {
        if (!byCategory[i.category]) byCategory[i.category] = [];
        byCategory[i.category].push(`${i.caseId}: ${i.msg}`);
    });
    Object.entries(byCategory).forEach(([cat, items]) => {
        console.log(`   📌 ${cat} (${items.length}):`);
        items.slice(0, 5).forEach(item => console.log(`      - ${item}`));
        if (items.length > 5) console.log(`      ... and ${items.length - 5} more`);
    });
}

// === SUMMARY ===
console.log(`\n${'='.repeat(60)}`);
console.log(`  SUMMARY`);
console.log(`${'='.repeat(60)}`);
console.log(`   Total Cases Audited: ${caseEntries.length}`);
console.log(`   🔴 Critical: ${issues.critical.length}`);
console.log(`   🟡 Warnings: ${issues.warning.length}`);
console.log(`   🔵 Info: ${issues.info.length}`);
console.log(`${'='.repeat(60)}\n`);
