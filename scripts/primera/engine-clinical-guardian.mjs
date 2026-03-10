/**
 * @reflection
 * [IDENTITY]: engine-clinical-guardian
 * [PURPOSE]: Deep audit of CASE_LIBRARY for schema, reasoning, and public health integration.
 * [STATE]: Hardened
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CASE_LIBRARY } from '../../src/game/CaseLibrary.js';
import { getIndicatorByDx } from '../../src/game/CaseIndicators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const OUTDIR = path.join(ROOT, "megalog/outputs");

if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

const REQUIRED_FIELDS = [
    'id',
    'diagnosis',
    'icd10',
    'category',
    'anamnesis',
    'correctTreatment'
];

async function runAudit() {
    console.log('🛡️  PRIMERA Clinical Guardian Engine active...');
    console.log(`🔍 Auditing ${Object.keys(CASE_LIBRARY).length} cases for Clinical Integrity...`);

    const results = {
        total: 0,
        errors: [],
        warnings: [],
        coverage: {
            physicalExam: 0,
            labs: 0,
            education: 0,
            iksMapping: 0,
            bayesianMetadata: 0
        },
        pass: false
    };

    for (const [id, c] of Object.entries(CASE_LIBRARY)) {
        results.total++;
        const caseIssues = [];

        // 1. Structural requirements
        REQUIRED_FIELDS.forEach(field => {
            if (!c[field]) {
                caseIssues.push({ type: 'error', message: `Missing required field: ${field}` });
            }
        });

        // 2. IKS Alignment Check
        const iksKey = getIndicatorByDx(c.icd10);
        if (iksKey) {
            results.coverage.iksMapping++;
        } else if (c.category === 'emergency' || c.skdi === '4A') {
            // Optional: flag cases that SHOULD have IKS mapping but don't
        }

        // 3. Bayesian Reasoning Meta-data
        if (c.essentialQuestions && Array.isArray(c.essentialQuestions) && c.essentialQuestions.length > 0) {
            results.coverage.bayesianMetadata++;
        } else {
            caseIssues.push({ type: 'warning', message: 'Missing essentialQuestions for Bayesian Reasoning' });
        }

        // 4. Clinical coverage checks
        if (c.physicalExamFindings && Object.keys(c.physicalExamFindings).length > 0) results.coverage.physicalExam++;
        if (c.relevantLabs && c.relevantLabs.length > 0) results.coverage.labs++;
        if (c.requiredEducation && c.requiredEducation.length > 0) results.coverage.education++;

        if (caseIssues.length > 0) {
            caseIssues.forEach(issue => {
                const logMsg = `[${id}] ${issue.message}`;
                if (issue.type === 'error') results.errors.push(logMsg);
                else results.warnings.push(logMsg);
            });
        }
    }

    const health = Math.round(((results.total * REQUIRED_FIELDS.length - results.errors.length) / (results.total * REQUIRED_FIELDS.length)) * 100);
    results.pass = health >= 90;
    results.health = health;

    // Output Summary
    console.log(`✅ Audit Complete. Score: ${health}%`);
    console.log(`- Errors: ${results.errors.length} | Warnings: ${results.warnings.length}`);
    console.log(`- IKS Mapping Coverage: ${Math.round(results.coverage.iksMapping / results.total * 100)}%`);
    console.log(`- Bayesian Ready: ${Math.round(results.coverage.bayesianMetadata / results.total * 100)}%`);

    fs.writeFileSync(path.join(OUTDIR, 'clinical_guardian.json'), JSON.stringify(results, null, 2));
}

runAudit().catch(err => {
    console.error('Guardian Engine failed:', err);
    process.exit(1);
});
