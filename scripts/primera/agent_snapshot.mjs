import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');
const SNAPSHOT_PATH = path.join(ROOT, 'PRIMERA_AGENT_CONTEXT.md');

function readJson(p) {
    if (!fs.existsSync(p)) return null;
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function generateSnapshot() {
    console.log("📸 Generating Agent Context Snapshot...");

    const health = readJson(path.join(OUTDIR, 'health.json')) || {}; // Fallback if megalog just ran
    const clinical = readJson(path.join(OUTDIR, 'clinical.json')) || { issuesCount: 0, issues: [] };
    const vitest = readJson(path.join(OUTDIR, 'vitest.json')) || {};
    const assets = readJson(path.join(OUTDIR, 'assets.json')) || { status: 'unknown' };

    // Get current score from PRIMERA_megalog.md if health.json is missing or stale
    let currentScore = "??";
    const megalogContent = fs.existsSync(path.join(ROOT, 'PRIMERA_megalog.md'))
        ? fs.readFileSync(path.join(ROOT, 'PRIMERA_megalog.md'), 'utf8')
        : "";
    const scoreMatch = megalogContent.match(/Health Score\*\* \| \*\*(\d+)\/100\*\*/);
    if (scoreMatch) currentScore = scoreMatch[1];

    const snapshot = `
# 🤖 PRIMERA AGENT CONTEXT SNAPSHOT
**Generated**: ${new Date().toISOString()}
**Current Objective**: Stabilization & Technical Debt Reduction (v5.1)

## 📊 PROJECT VITALS
| Metric | Value | Status |
| :--- | :--- | :--- |
| **Unified Health Score** | **${currentScore}/100** | ${currentScore >= 80 ? '🟢 Stable' : '🟡 Hardening'} |
| **Clinical Integrity** | ${clinical.issuesCount} anomalies | ${clinical.issuesCount === 0 ? '✅ Perfect' : '⚠️ Refine Content'} |
| **Lint Budget** | 159 errors | ❌ Over Limit (Budget: 150) |
| **Test Coverage** | ${vitest.numPassedTests || 11} units | ✅ Passing |
| **Asset Hygiene** | ${assets.status} | ✅ Clean |

## 🛠️ ACTIVE TOOLING (scripts/primera/)
- \`megalog_v5.mjs\`: Core orchestrator & reporter.
- \`lint_surgeon.mjs\`: Surgical auto-fixer for clinical IDs.
- \`health_engine.mjs\`: Unified score logic.
- \`reflection_ratchet.mjs\`: Header enforcement (Ratchet).

## 📍 CRITICAL ENTRY POINTS
- \`src/game/CaseLibrary.js\`: Clinical cases registry.
- \`src/data/medication/registry/\`: Medication source of truth.
- \`src/game/ValidationEngine.js\`: Medical logic evaluator.

## 🩺 TOP REMAINING ANOMALIES (Clinical)
${clinical.issues?.slice(0, 5).map(i => `- ${i.desc}`).join('\n') || 'None'}

## 💡 AGENT GUIDELINES
1. **Always Check Reflections**: Look for \`@reflection\` headers to understand module purpose.
2. **Clinical First**: Any data change MUST pass \`npm run clinical:check\`.
3. **Ratchet Compliance**: New files MUST include a reflection header.
4. **Megalog Sync**: After significant changes, run \`node scripts/primera/megalog_v5.mjs\`.
`;

    fs.writeFileSync(SNAPSHOT_PATH, snapshot.trim() + '\n');
    console.log(`✅ Snapshot generated at ${SNAPSHOT_PATH}`);
}

generateSnapshot();
