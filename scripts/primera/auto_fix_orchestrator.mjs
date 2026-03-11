/**
 * @reflection
 * [IDENTITY]: auto_fix_orchestrator
 * [PURPOSE]: Generate safe patch proposals from current PRIMERA findings instead of auto-editing source blindly.
 * [STATE]: Active
 * [ANCHOR]: main
 * [DEPENDS_ON]: artifact_manifest
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { readStampedJson, writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');
const PROPOSALS_PATH = path.join(OUTDIR, 'patch_proposals.json');

const AUDIT_COMMANDS = [
    'node scripts/primera/watchdog-lint-budget.mjs',
    'node scripts/primera/clinical_watchdog.mjs',
    'node scripts/primera/engine-clinical-guardian.mjs',
    'node scripts/primera/engine-store-audit.mjs',
    'node scripts/primera/engine-save-audit.mjs',
    'node scripts/primera/reflect_and_sync.mjs'
];

function runAudits() {
    for (const command of AUDIT_COMMANDS) {
        try {
            execSync(command, { cwd: ROOT, stdio: 'inherit' });
        } catch (error) {
            console.warn(`[PRIMERA] Audit command failed but continuing: ${command}`);
            console.warn(error.message);
        }
    }
}

function buildProposal({
    file,
    line = null,
    type,
    confidence,
    blastRadius,
    description,
    diff = null,
    rollbackNote,
    autoFixAllowed
}) {
    return {
        file,
        line,
        type,
        confidence,
        blastRadius,
        description,
        diff,
        rollbackNote,
        autoFixAllowed
    };
}

function lintProposals(eslintJson) {
    const proposals = [];
    for (const fileResult of eslintJson || []) {
        for (const message of fileResult.messages || []) {
            if (message.ruleId !== 'no-undef' || message.severity !== 2) continue;
            const symbol = /'([^']+)' is not defined/.exec(message.message)?.[1];
            const relativeFile = path.relative(ROOT, fileResult.filePath).replace(/\\/g, '/');

            if (relativeFile === 'src/hooks/usePatientEMR.js' && symbol === 'treatScore') {
                proposals.push(buildProposal({
                    file: relativeFile,
                    line: message.line,
                    type: 'crash_risk',
                    confidence: 0.95,
                    blastRadius: 'low',
                    description: 'treatScore is undefined, should use the cached treatResult score.',
                    diff: '- treatmentScore: treatScore\n+ treatmentScore: treatResult?.score ?? 0',
                    rollbackNote: 'Revert single line, no cascading effect.',
                    autoFixAllowed: true
                }));
                continue;
            }

            proposals.push(buildProposal({
                file: relativeFile,
                line: message.line,
                type: 'crash_risk',
                confidence: 0.45,
                blastRadius: 'unknown',
                description: message.message,
                diff: `// Manual review required for undefined symbol: ${symbol || 'unknown'}`,
                rollbackNote: 'Proposal only. Inspect local scope before applying.',
                autoFixAllowed: false
            }));
        }
    }
    return proposals;
}

function storeProposals(storeAudit) {
    const proposals = [];

    for (const duplicate of storeAudit?.duplicateActions || []) {
        proposals.push(buildProposal({
            file: 'src/store/useGameStore.js',
            line: duplicate.lines?.[0] || null,
            type: duplicate.impact || 'dead_ui_wiring',
            confidence: 0.88,
            blastRadius: 'medium',
            description: `Duplicate action key "${duplicate.name}" will silently overwrite the earlier implementation.`,
            diff: `// Merge duplicate action definitions for ${duplicate.name} into a single source of truth.`,
            rollbackNote: 'Restore the removed duplicate block if behavior regresses.',
            autoFixAllowed: false
        }));
    }

    const drift = storeAudit?.schemaDrift;
    if (drift && (drift.readButNotSaved?.length || drift.savedButNotRead?.length)) {
        proposals.push(buildProposal({
            file: 'src/components/SaveSlotSelector.jsx',
            line: 83,
            type: 'save_corruption',
            confidence: 0.9,
            blastRadius: 'medium',
            description: `Save slot UI schema drift detected. readButNotSaved=${drift.readButNotSaved.join(', ') || '-'}; savedButNotRead=${drift.savedButNotRead.join(', ') || '-'}.`,
            diff: '// Align SaveSlotSelector root fields with saveGame() persisted schema and keep legacy normalization explicit.',
            rollbackNote: 'Restore previous selectors if slot metadata rendering regresses.',
            autoFixAllowed: false
        }));
    }

    const unsafeRandomness = storeAudit?.randomnessAudit?.hits?.filter((hit) => hit.classification === 'unsafe') || [];
    for (const hit of unsafeRandomness.slice(0, 20)) {
        proposals.push(buildProposal({
            file: hit.file,
            line: hit.line,
            type: 'nondeterminism',
            confidence: 0.86,
            blastRadius: 'medium',
            description: 'Unsafe Math.random() detected in a gameplay path.',
            diff: '// Replace Math.random() with seedrandom or a deterministic injected RNG.',
            rollbackNote: 'Revert to previous RNG only if deterministic replay is not required for this path.',
            autoFixAllowed: hit.file.startsWith('src/store/') || hit.file.startsWith('src/hooks/')
        }));
    }

    return proposals;
}

function saveProposals(saveAudit) {
    if (saveAudit?.pass) return [];
    return [
        buildProposal({
            file: 'src/store/useGameStore.js',
            line: 1174,
            type: saveAudit.impact || 'save_corruption',
            confidence: 0.92,
            blastRadius: 'high',
            description: 'Runtime save/load round-trip failed in PRIMERA save audit.',
            diff: `// Review failing save checks: ${JSON.stringify(saveAudit.checks || [], null, 2)}`,
            rollbackNote: 'Restore previous save/load code path if slot writes stop working.',
            autoFixAllowed: false
        })
    ];
}

function clinicalProposals(clinical) {
    const proposals = [];
    for (const issue of clinical?.issues || []) {
        proposals.push(buildProposal({
            file: 'src/content/cases/CaseLibrary.js',
            line: null,
            type: issue.impact || 'wrong_clinical_scoring',
            confidence: 0.8,
            blastRadius: 'high',
            description: issue.desc,
            diff: '// Medical content proposal only. Review with clinical SME before applying.',
            rollbackNote: 'No auto-fix. Clinical content changes must be reviewed manually.',
            autoFixAllowed: false
        }));
    }
    return proposals;
}

async function main() {
    console.log('--- PRIMERA PATCH PROPOSAL ENGINE ---');
    fs.mkdirSync(OUTDIR, { recursive: true });

    runAudits();

    const eslintJson = readStampedJson(path.join(OUTDIR, 'eslint.json')) || [];
    const clinical = readStampedJson(path.join(OUTDIR, 'clinical.json')) || {};
    const storeAudit = readStampedJson(path.join(OUTDIR, 'store_audit.json')) || {};
    const saveAudit = readStampedJson(path.join(OUTDIR, 'save_audit.json')) || {};

    const proposals = [
        ...lintProposals(eslintJson),
        ...storeProposals(storeAudit),
        ...saveProposals(saveAudit),
        ...clinicalProposals(clinical)
    ];

    writeStampedJson(
        PROPOSALS_PATH,
        {
            proposalCount: proposals.length,
            proposals
        },
        'auto_fix_orchestrator',
        ['eslint.json', 'clinical.json', 'store_audit.json', 'save_audit.json']
    );

    fs.writeFileSync(
        path.join(ROOT, 'build_error.log'),
        `PRIMERA patch proposals generated: ${proposals.length}\nSee megalog/outputs/patch_proposals.json\n`
    );

    console.log(`Patch proposals written to ${PROPOSALS_PATH}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
