/**
 * @reflection
 * [IDENTITY]: engine-clinical-guardian
 * [PURPOSE]: Deep audit of CASE_LIBRARY for schema, reasoning metadata, and impact-aware clinical integrity reporting.
 * [STATE]: Active
 * [ANCHOR]: runAudit
 * [DEPENDS_ON]: CaseLibrary, CaseIndicators, artifact_manifest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CASE_LIBRARY } from '../../src/content/cases/CaseLibrary.js';
import { getIndicatorByDx } from '../../src/game/CaseIndicators.js';
import { writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');

const REQUIRED_FIELDS = ['id', 'diagnosis', 'icd10', 'category', 'anamnesis', 'correctTreatment'];
const IMPACT_PRIORITY = {
    crash_risk: 'P0',
    save_corruption: 'P0',
    wrong_clinical_scoring: 'P1',
    nondeterminism: 'P1',
    stale_telemetry: 'P2',
    dead_ui_wiring: 'P2',
    cosmetic: 'P3'
};

function makeFinding(caseId, impact, message, severity = 'error') {
    return {
        caseId,
        severity,
        impact,
        priority: IMPACT_PRIORITY[impact] || 'P3',
        message
    };
}

async function runAudit() {
    console.log('PRIMERA Clinical Guardian Engine active...');
    console.log(`Auditing ${CASE_LIBRARY.length} cases for Clinical Integrity...`);

    fs.mkdirSync(OUTDIR, { recursive: true });

    const results = {
        total: 0,
        findings: [],
        errors: [],
        warnings: [],
        coverage: {
            physicalExam: 0,
            labs: 0,
            education: 0,
            iksMapping: 0,
            bayesianMetadata: 0,
            structuredAnamnesis: 0
        },
        pass: false
    };

    for (const clinicalCase of CASE_LIBRARY) {
        const caseId = clinicalCase.id || 'unknown';
        results.total++;

        for (const field of REQUIRED_FIELDS) {
            if (!clinicalCase[field]) {
                results.findings.push(makeFinding(caseId, 'wrong_clinical_scoring', `Missing required field: ${field}`));
            }
        }

        if (clinicalCase.anamnesisQuestions && typeof clinicalCase.anamnesisQuestions === 'object' && !Array.isArray(clinicalCase.anamnesisQuestions) && Object.keys(clinicalCase.anamnesisQuestions).length > 0) {
            results.coverage.structuredAnamnesis++;
        } else {
            results.findings.push(makeFinding(caseId, 'wrong_clinical_scoring', 'Missing structured anamnesisQuestions; anamnesis validation will auto-pass for this case.'));
        }

        const iksKey = getIndicatorByDx(clinicalCase.icd10);
        if (iksKey) {
            results.coverage.iksMapping++;
        }

        if (Array.isArray(clinicalCase.essentialQuestions) && clinicalCase.essentialQuestions.length > 0) {
            results.coverage.bayesianMetadata++;
        } else {
            results.findings.push(makeFinding(caseId, 'wrong_clinical_scoring', 'Missing essentialQuestions for Bayesian Reasoning', 'warning'));
        }

        if (clinicalCase.physicalExamFindings && Object.keys(clinicalCase.physicalExamFindings).length > 0) {
            results.coverage.physicalExam++;
        }
        if (clinicalCase.relevantLabs && clinicalCase.relevantLabs.length > 0) {
            results.coverage.labs++;
        }
        if (clinicalCase.requiredEducation && clinicalCase.requiredEducation.length > 0) {
            results.coverage.education++;
        }
    }

    for (const finding of results.findings) {
        const line = `[${finding.caseId}] ${finding.message}`;
        if (finding.severity === 'error') {
            results.errors.push(line);
        } else {
            results.warnings.push(line);
        }
    }

    const auditedRuleCount = REQUIRED_FIELDS.length + 1;
    const health = Math.round(((results.total * auditedRuleCount - results.errors.length) / (results.total * auditedRuleCount)) * 100);
    results.pass = health >= 90;
    results.health = health;
    results.impactSummary = results.findings.reduce((acc, finding) => {
        acc[finding.impact] = (acc[finding.impact] || 0) + 1;
        return acc;
    }, {});

    console.log(`Audit Complete. Score: ${health}%`);
    console.log(`- Errors: ${results.errors.length} | Warnings: ${results.warnings.length}`);

    writeStampedJson(
        path.join(OUTDIR, 'clinical_guardian.json'),
        results,
        'engine-clinical-guardian',
        ['CaseLibrary.js', 'CaseIndicators.js']
    );
}

runAudit().catch((error) => {
    console.error('Guardian Engine failed:', error);
    process.exit(1);
});
