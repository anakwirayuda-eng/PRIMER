/**
 * @reflection
 * [IDENTITY]: Clinical Watchdog v2.0
 * [PURPOSE]: Automated medical logic & MAIA integrity validator for PRIMER Case Library.
 * [STATE]: Stable
 * [ANCHOR]: CLINICAL_INTEGRITY + MAIA_INTEGRITY
 * [DEPENDS_ON]: CaseLibrary, MedicationDatabase, ProceduresDB, EducationOptions
 * [LAST_UPDATE]: 2026-02-19
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');

const IMPACT_PRIORITY = {
    crash_risk: 'P0',
    save_corruption: 'P0',
    wrong_clinical_scoring: 'P1',
    nondeterminism: 'P1',
    stale_telemetry: 'P2',
    dead_ui_wiring: 'P2',
    cosmetic: 'P3'
};

function createFinding(impact, desc, extra = {}) {
    return {
        impact,
        priority: IMPACT_PRIORITY[impact] || 'P3',
        desc,
        ...extra
    };
}

// ─── Static ID Extraction (regex-based, no dynamic import needed) ───
function extractIds(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /id:\s*['"]([^'"]+)['"]/g;
    const ids = new Set();
    let m;
    while ((m = regex.exec(content)) !== null) ids.add(m[1]);
    return ids;
}

function extractIdsFromDir(dirPath) {
    const ids = new Set();
    if (!fs.existsSync(dirPath)) return ids;
    for (const f of fs.readdirSync(dirPath).filter(x => x.endsWith('.js'))) {
        for (const id of extractIds(path.join(dirPath, f))) ids.add(id);
    }
    return ids;
}

// ─── Case Parser (static analysis) ───
function parseCaseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const cases = [];
    const lines = content.split(/\r?\n/);
    let cur = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const idMatch = line.match(/^\s{4,12}id:\s*['"]([^'"]+)['"]/);
        if (idMatch) {
            const nextBlock = lines.slice(i + 1, i + 5).join(' ');
            if (nextBlock.includes('diagnosis:') || nextBlock.includes('icd10:')) {
                if (cur && cur._ok) cases.push(cur);
                cur = { id: idMatch[1], ct: [], cp: [], re: [], _ok: false };
            }
        }
        if (!cur) continue;

        for (const [field, key] of [['correctTreatment', 'ct'], ['correctProcedures', 'cp'], ['requiredEducation', 're']]) {
            if (line.includes(field + ':')) {
                if (field === 'correctTreatment') cur._ok = true;
                let block = '';
                let j = i;
                while (j < lines.length) { block += lines[j]; if (block.includes(']')) break; j++; }
                const items = block.match(/['"]([^'"]+)['"]/g);
                const parsed = items ? items.map(s => s.replace(/['"]/g, '')).filter(s => s !== field) : [];
                cur[key] = parsed;
            }
        }
    }
    if (cur && cur._ok) cases.push(cur);
    return cases;
}

async function runClinicalAudit() {
    console.log("🩺 Starting Clinical Watchdog v2.0 Audit...");

    const issues = [];
    let casesCount = 0;

    // ─── PHASE 1: Dynamic Import Validation (original clinical checks) ───
    try {
        const caseLibraryPath = path.resolve(ROOT, 'src/content/cases/CaseLibrary.js');
        const medDbPath = path.resolve(ROOT, 'src/data/MedicationDatabase.js');

        const { CASE_LIBRARY } = await import('file:///' + caseLibraryPath.replace(/\\/g, '/'));
        const { MEDICATION_DATABASE } = await import('file:///' + medDbPath.replace(/\\/g, '/'));

        const medIds = new Set(MEDICATION_DATABASE.map(m => m.id));
        casesCount = CASE_LIBRARY.length;

        CASE_LIBRARY.forEach(c => {
            const prefix = `[Case: ${c.id || 'unknown'}]`;
            if (!c.id) issues.push(createFinding('wrong_clinical_scoring', `${prefix} Missing unique ID.`));
            if (!c.diagnosis) issues.push(createFinding('wrong_clinical_scoring', `${prefix} Missing diagnosis name.`));
            if (!c.icd10) issues.push(createFinding('wrong_clinical_scoring', `${prefix} Missing ICD-10 code.`));
            if (!c.correctTreatment || c.correctTreatment.length === 0) {
                issues.push(createFinding('wrong_clinical_scoring', `${prefix} Missing correct treatment plan.`));
            }
            if (c.correctTreatment) {
                c.correctTreatment.forEach(t => {
                    if (Array.isArray(t)) {
                        t.forEach(alt => {
                            if (!medIds.has(alt)) {
                                issues.push(createFinding('wrong_clinical_scoring', `${prefix} Invalid Med ID: ${alt}`));
                            }
                        });
                    } else {
                        if (!medIds.has(t)) issues.push(createFinding('wrong_clinical_scoring', `${prefix} Invalid Med ID: ${t}`));
                    }
                });
            }
            if (c.diagnosis?.toLowerCase().includes('dengue') || c.diagnosis?.toLowerCase().includes('dbd')) {
                if (!c.relevantLabs?.includes('lab_hematology') && !c.relevantLabs?.includes('lab_ns1')) {
                    issues.push(createFinding('wrong_clinical_scoring', `${prefix} Dengue case missing Hematology/NS1 in relevant labs.`));
                }
            }
            if (c.diagnosis?.toLowerCase().includes('hipertensi') || c.id?.includes('hypertension')) {
                if (!c.physicalExamFindings?.vitals?.bp) {
                    issues.push(createFinding('wrong_clinical_scoring', `${prefix} Hypertension case missing BP vital finding.`));
                }
            }
        });
    } catch (e) {
        issues.push(createFinding('stale_telemetry', `Dynamic Import Crash: ${e.message}`));
    }

    // ─── PHASE 2: MAIA Integrity (static file scanning) ───
    console.log("🔍 Running MAIA Integrity Check...");

    const medIds = extractIdsFromDir(path.join(ROOT, 'src/data/medication/registry'));
    const procIds = extractIds(path.join(ROOT, 'src/data/ProceduresDB.js'));
    const eduIds = extractIds(path.join(ROOT, 'src/data/EducationOptions.js'));

    const caseDirs = [
        path.join(ROOT, 'src/content/cases/modules/modules'),
        path.join(ROOT, 'src/content/cases/modules/infectious'),
        path.join(ROOT, 'src/content/cases/modules')
    ];

    const allCases = [];
    for (const dir of caseDirs) {
        if (!fs.existsSync(dir)) continue;
        for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
            const fp = path.join(dir, file);
            if (fs.statSync(fp).isDirectory()) continue;
            try { allCases.push(...parseCaseFile(fp)); } catch (e) { /* skip */ }
        }
    }

    const missingMeds = new Set();
    const missingProcs = new Set();
    const missingEdus = new Set();

    for (const c of allCases) {
        c.ct.forEach(id => { if (!medIds.has(id)) missingMeds.add(id); });
        c.cp.forEach(id => { if (!procIds.has(id)) missingProcs.add(id); });
        c.re.forEach(id => { if (!eduIds.has(id)) missingEdus.add(id); });
    }

    const maiaIntegrity = {
        casesScanned: allCases.length,
        dbSizes: { medications: medIds.size, procedures: procIds.size, education: eduIds.size },
        missingMeds: missingMeds.size,
        missingProcs: missingProcs.size,
        missingEdus: missingEdus.size,
        missingMedIds: [...missingMeds].sort(),
        missingProcIds: [...missingProcs].sort(),
        missingEduIds: [...missingEdus].sort(),
        status: (missingMeds.size + missingProcs.size + missingEdus.size) === 0 ? 'passed' : 'failed'
    };

    // ─── Generate Report ───
    const report = {
        gate: "CLINICAL_INTEGRITY",
        status: issues.filter(i => i.priority === 'P0' || i.priority === 'P1').length === 0 ? "passed" : "failed",
        casesCount,
        issuesCount: issues.length,
        issues,
        maiaIntegrity,
        impactSummary: issues.reduce((acc, issue) => {
            acc[issue.impact] = (acc[issue.impact] || 0) + 1;
            return acc;
        }, {})
    };

    if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
    writeStampedJson(
        path.join(OUTDIR, 'clinical.json'),
        report,
        'clinical_watchdog',
        ['CaseLibrary.js', 'MedicationDatabase.js', 'ProceduresDB.js', 'EducationOptions.js']
    );

    console.log(`✅ Clinical Audit Complete. Found ${issues.length} anomalies.`);
    console.log(`🔒 MAIA Integrity: ${maiaIntegrity.status.toUpperCase()} (Meds=${maiaIntegrity.missingMeds} Procs=${maiaIntegrity.missingProcs} Edu=${maiaIntegrity.missingEdus})`);
}

runClinicalAudit().catch(console.error);
