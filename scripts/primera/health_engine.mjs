/**
 * @reflection
 * [IDENTITY]: PRIMERA Health Engine v1.0
 * [PURPOSE]: Unified logic for calculating project health scores. 
 * Combines Static (Reflective) and Dynamic (Watchdog) metrics.
 * [STATE]: Stable
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const HEALTH_PATH = path.join(ROOT, 'megalog/outputs/health.json');

export const HEALTH_WEIGHTS = {
    STATIC_COVERAGE: 0.10,  // Reflections coverage
    STATIC_STRUCTURE: 0.05, // Cycles and broken imports
    QUALITY_LINT: 0.15,     // ESLint errors/warnings
    RUNTIME_TESTS: 0.15,    // Vitest/Playwright
    CLINICAL_INTEGRITY: 0.15,
    INVARIANTS: 0.15,       // [NEW] State invariants coverage
    LIFECYCLE: 0.10,        // [NEW] FSM transition stability
    FORENSIC_DEBT: 0.05,    // Undefined symbols
    ASSET_INTEGRITY: 0.05,  // Asset hygiene
    BUILD_STABILITY: 0.05   // Vite build status
};

/**
 * Calculates a unified health score from 0-100.
 */
export function writeHealthJSON(result, options = {}) {
    const {
        command = 'health_engine',
        inputs = [],
        rootDir = ROOT
    } = options;

    return writeStampedJson(HEALTH_PATH, result, command, inputs, { rootDir });
}

export function calculateUnifiedHealth(data, options = {}) {
    const { writeJson = true } = options;
    const {
        lint = { errors: 0, warnings: 0, totalFiles: 1 },
        tests = { failed: 0, total: 1 },
        e2e = { status: 'passed' },
        assets = { status: 'passed', score: 100 },
        build = { status: 'passed' },
        reflections = { coverage: 100, anomalies: 0, crossCycles: 0, brokenImports: 0 },
        clinical = { status: 'passed', issuesCount: 0 },
        clinicalAudit = { health: 100 },
        invariants = { score: 0, assessed: false },
        lifecycle = { pass: true, assessed: false },
        forensic = { undefinedCount: 0 },
        staleInputs = []
    } = data;

    let scores = {};

    // 1. Static Coverage (10%)
    scores.coverage = reflections.coverage || 0;

    // 2. Static Structure (5%)
    let structScore = 100;
    structScore -= (reflections.crossCycles * 50);
    structScore -= (reflections.brokenImports * 20);
    structScore -= (reflections.anomalies * 5);
    scores.structure = Math.max(0, structScore);

    // 3. Quality (Lint) (15%)
    let lintScore = 100;
    const penaltyPerFile = (lint.errors * 10) + (lint.warnings * 2);
    lintScore -= (lint.totalFiles > 0 ? (penaltyPerFile / lint.totalFiles) * 10 : 0);
    scores.lint = Math.max(0, lintScore);

    // 4. Runtime (Tests) (15%)
    let testScore = 100;
    testScore -= (tests.failed * 10);
    if (e2e.status === 'failed') testScore -= 20;
    else if (e2e.status === 'missing') testScore -= 10;
    scores.runtime = Math.max(0, testScore);

    // 5. Clinical Integrity (15%)
    let clinicalScore = clinicalAudit.health || 100;
    clinicalScore -= (clinical.issuesCount * 5);
    if (clinical.status === 'failed') clinicalScore = Math.min(clinicalScore, 40);
    scores.clinical = Math.max(0, clinicalScore);

    // 6. Invariants (15%)
    // If not assessed, score is 0 but we might want to flag it differently
    scores.invariants = invariants.assessed ? (invariants.score || 0) : 0;

    // 7. Lifecycle (10%)
    scores.lifecycle = lifecycle.assessed ? (lifecycle.pass ? 100 : 40) : 0;

    // 8. Forensic Debt (5%)
    let forensicScore = 100;
    forensicScore -= (forensic.undefinedCount || 0) * 10;
    scores.forensic = Math.max(0, forensicScore);

    // 9. Assets (5%)
    scores.assets = assets.score || (assets.status === 'passed' ? 100 : 0);

    // 10. Build (5%)
    scores.build = build.status === 'passed' ? 100 : 0;

    // Weighted Sum
    let total = (
        (scores.coverage * HEALTH_WEIGHTS.STATIC_COVERAGE) +
        (scores.structure * HEALTH_WEIGHTS.STATIC_STRUCTURE) +
        (scores.lint * HEALTH_WEIGHTS.QUALITY_LINT) +
        (scores.runtime * HEALTH_WEIGHTS.RUNTIME_TESTS) +
        (scores.clinical * HEALTH_WEIGHTS.CLINICAL_INTEGRITY) +
        (scores.invariants * HEALTH_WEIGHTS.INVARIANTS) +
        (scores.lifecycle * HEALTH_WEIGHTS.LIFECYCLE) +
        (scores.forensic * HEALTH_WEIGHTS.FORENSIC_DEBT) +
        (scores.assets * HEALTH_WEIGHTS.ASSET_INTEGRITY) +
        (scores.build * HEALTH_WEIGHTS.BUILD_STABILITY)
    );

    // Hard Caps for Integrity
    let capped = false;
    let capReason = null;
    if (scores.build === 0) {
        total = Math.min(total, 50);
        capped = true;
        capReason ??= 'build failed';
    }
    if (scores.runtime < 50) {
        total = Math.min(total, 70);
        capped = true;
        capReason ??= 'runtime failed';
    }
    if (scores.structure < 50) {
        total = Math.min(total, 60);
        capped = true;
        capReason ??= 'structure failed';
    }
    if (invariants.assessed && scores.invariants < 50) {
        total = Math.min(total, 65);
        capped = true;
        capReason ??= 'invariants failed';
    }

    const result = {
        total: Math.round(total),
        breakdown: scores,
        capped,
        capReason,
        staleInputs
    };

    if (writeJson) {
        writeHealthJSON(result, options);
    }
    return result;
}
