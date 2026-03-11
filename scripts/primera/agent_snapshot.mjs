/**
 * @reflection
 * [IDENTITY]: agent_snapshot
 * [PURPOSE]: Generate a current PRIMERA agent context snapshot from canonical JSON artifacts.
 * [STATE]: Active
 * [ANCHOR]: generateSnapshot
 * [DEPENDS_ON]: artifact_manifest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readStampedJson, stampMarkdown } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');
const SNAPSHOT_PATH = path.join(ROOT, 'PRIMERA_AGENT_CONTEXT.md');

function generateSnapshot() {
    console.log('Generating Agent Context Snapshot...');

    const health = readStampedJson(path.join(OUTDIR, 'health.json')) || {};
    const clinical = readStampedJson(path.join(OUTDIR, 'clinical.json')) || { issuesCount: 0, issues: [] };
    const vitest = readStampedJson(path.join(OUTDIR, 'vitest.json')) || {};
    const assets = readStampedJson(path.join(OUTDIR, 'assets.json')) || { status: 'unknown' };

    const snapshot = `
# PRIMERA Agent Context Snapshot
**Generated**: ${new Date().toISOString()}
**Current Objective**: Stabilization & Technical Debt Reduction (vNext)

## Project Vitals
| Metric | Value | Status |
| :--- | :--- | :--- |
| **Unified Health Score** | **${health.total ?? '??'}/100** | ${health.total >= 80 ? 'Stable' : 'Hardening'} |
| **Clinical Integrity** | ${clinical.issuesCount ?? 0} anomalies | ${(clinical.issuesCount || 0) === 0 ? 'Clean' : 'Refine Content'} |
| **Lint Budget** | ${health.breakdown?.lint ?? '??'} health score | ${health.breakdown?.lint >= 90 ? 'Healthy' : 'Needs Work'} |
| **Test Coverage** | ${vitest.numPassedTests || 0} units | ${(vitest.numFailedTests || 0) === 0 ? 'Passing' : 'Failing'} |
| **Asset Hygiene** | ${assets.status} | ${assets.status === 'passed' ? 'Clean' : 'Review'} |

## Active Tooling (scripts/primera/)
- \`megalog_v5.mjs\`: Core orchestrator & reporter.
- \`health_engine.mjs\`: Unified score logic + canonical \`health.json\`.
- \`artifact_manifest.mjs\`: Provenance and stale-input enforcement.
- \`engine-store-audit.mjs\`: Store/save drift and randomness auditing.

## Critical Entry Points
- \`src/content/cases/CaseLibrary.js\`: Clinical cases registry.
- \`src/data/medication/registry/\`: Medication source of truth.
- \`src/game/ValidationEngine.js\`: Medical logic evaluator.

## Top Remaining Anomalies (Clinical)
${clinical.issues?.slice(0, 5).map(issue => `- ${issue.desc}`).join('\n') || 'None'}

## Agent Guidelines
1. Always trust \`megalog/outputs/health.json\` first.
2. Clinical content changes must pass \`npm run clinical:check\`.
3. New audit outputs must be stamped with provenance.
4. After meta-layer changes, run \`node scripts/primera/megalog_v5.mjs\`.
`;

    fs.writeFileSync(
        SNAPSHOT_PATH,
        stampMarkdown(snapshot.trim() + '\n', 'agent_snapshot', ['health.json', 'clinical.json', 'vitest.json', 'assets.json'])
    );
    console.log(`Snapshot generated at ${SNAPSHOT_PATH}`);
}

generateSnapshot();
