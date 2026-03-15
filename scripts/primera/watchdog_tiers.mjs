import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');

const isWin = process.platform === 'win32';

function npmStep(name, script, extraArgs = []) {
    return {
        name,
        command: 'npm',
        args: ['run', script, ...extraArgs]
    };
}

function nodeStep(name, scriptPath, extraArgs = []) {
    return {
        name,
        command: process.execPath,
        args: [scriptPath, ...extraArgs]
    };
}

function resolveCommand(step) {
    if (!isWin || step.command !== 'npm') {
        return { command: step.command, args: step.args };
    }

    return {
        command: 'cmd',
        args: ['/c', 'npm', ...step.args]
    };
}

function runStep(step, options = {}) {
    const { dryRun = false, cwd = ROOT } = options;
    const resolved = resolveCommand(step);
    const startedAt = new Date().toISOString();

    console.log(`\n[watchdog] ${step.name}`);
    console.log(`command: ${resolved.command} ${resolved.args.join(' ')}`);

    if (dryRun) {
        return {
            name: step.name,
            ok: true,
            skipped: true,
            code: 0,
            startedAt,
            finishedAt: new Date().toISOString()
        };
    }

    const result = spawnSync(resolved.command, resolved.args, {
        cwd,
        stdio: 'inherit',
        shell: false
    });

    return {
        name: step.name,
        ok: (result.status ?? 1) === 0,
        code: result.status ?? 1,
        startedAt,
        finishedAt: new Date().toISOString()
    };
}

const quickSteps = [
    npmStep('lint-budget', 'watchdog:lint'),
    npmStep('unit-tests', 'test', ['--', '--run']),
    npmStep('build', 'build')
];

const deepOnlySteps = [
    npmStep('assets-check', 'assets:check'),
    npmStep('clinical-check', 'clinical:check'),
    nodeStep('content-audit', 'scripts/primera/engine-content-audit.mjs'),
    nodeStep('scenario-replay', 'scripts/primera/engine-scenario-replay.mjs'),
    npmStep('diag-export', 'diag:export'),
    nodeStep('pldb-analyzer', 'scripts/primera/pldb_analyzer.mjs'),
    nodeStep('pathfinder', 'scripts/primera/watchdog-pathfinder.mjs'),
    nodeStep('topology-audit', 'scripts/primera/engine-topology.mjs'),
    nodeStep('wiring-audit', 'scripts/primera/engine-wiring.mjs'),
    nodeStep('store-audit', 'scripts/primera/engine-store-audit.mjs'),
    nodeStep('save-audit', 'scripts/primera/engine-save-audit.mjs'),
    nodeStep('collision-audit', 'scripts/primera/engine-collision.mjs'),
    nodeStep('oscillation-audit', 'scripts/primera/engine-oscillation.mjs'),
    nodeStep('invariants-runtime', 'scripts/primera/engine-invariants-runtime.mjs'),
    nodeStep('clinical-lifecycle', 'scripts/primera/engine-clinical-lifecycle.mjs'),
    nodeStep('triage-gate', 'scripts/primera/engine-triage-gate.mjs'),
    nodeStep('clinical-guardian', 'scripts/primera/engine-clinical-guardian.mjs'),
    nodeStep('igd-sisrute-gate', 'scripts/primera/engine-igd-sisrute-gate.mjs')
];

const fullOnlySteps = [
    npmStep('e2e-smoke', 'test:e2e'),
    nodeStep('gameplay-simulation', 'scripts/primera/gameplay_test.mjs'),
    nodeStep('ukm-simulation', 'scripts/primera/ukm_test.mjs'),
    nodeStep('headless-simulation', 'scripts/primera/simulation_runner.mjs'),
    nodeStep('soak-test', 'scripts/primera/test_invariants.mjs')
];

const tiers = {
    quick: quickSteps,
    deep: [...quickSteps, ...deepOnlySteps],
    full: [...quickSteps, ...deepOnlySteps, ...fullOnlySteps]
};

function getTierSteps(tier) {
    const steps = tiers[tier];
    if (!steps) {
        throw new Error(`Unknown watchdog tier "${tier}". Expected one of: ${Object.keys(tiers).join(', ')}`);
    }
    return steps;
}

function runTier(tier, options = {}) {
    const {
        dryRun = false,
        cwd = ROOT,
        outdir = OUTDIR,
        stepsOverride = null
    } = options;

    const steps = stepsOverride || getTierSteps(tier);
    const results = [];

    for (const step of steps) {
        const result = runStep(step, { dryRun, cwd });
        results.push(result);
        if (!result.ok) {
            break;
        }
    }

    const failedSteps = results.filter((step) => !step.ok);
    const summary = {
        tier,
        dryRun,
        pass: failedSteps.length === 0,
        steps: results,
        failedSteps: failedSteps.map((step) => step.name),
        generatedAt: new Date().toISOString()
    };

    fs.mkdirSync(outdir, { recursive: true });
    fs.writeFileSync(
        path.join(outdir, `watchdog_${tier}.json`),
        JSON.stringify(summary, null, 2),
        'utf8'
    );

    return summary;
}

function isDirectExecution() {
    return Boolean(process.argv[1]) && path.resolve(process.argv[1]) === __filename;
}

export {
    npmStep,
    nodeStep,
    resolveCommand,
    runStep,
    getTierSteps,
    runTier
};

if (isDirectExecution()) {
    const tier = process.argv[2] || 'quick';
    const dryRun = process.argv.includes('--dry-run');

    try {
        const summary = runTier(tier, { dryRun });
        if (!summary.pass) {
            console.error(`\n[watchdog] ${tier} failed: ${summary.failedSteps.join(', ')}`);
            process.exit(1);
        }
        console.log(`\n[watchdog] ${tier} passed`);
    } catch (error) {
        console.error(error.message || error);
        process.exit(1);
    }
}
