/**
 * @reflection
 * [IDENTITY]: engine-scenario-replay
 * [PURPOSE]: Execute deterministic golden-path scenario replays through Vitest and export replay artifacts.
 * [STATE]: Active
 * [ANCHOR]: run
 * [DEPENDS_ON]: vitest, artifact_manifest
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { readStampedJson, writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs/scenarios');
const VITEST_JSON = path.join(OUTDIR, 'scenario_replay_vitest.json');
const SUMMARY_PATH = path.join(ROOT, 'megalog/outputs/scenario_replay.json');

function runVitest() {
    const isWin = process.platform === 'win32';
    const bin = isWin
        ? path.join(ROOT, 'node_modules/.bin/vitest.cmd')
        : path.join(ROOT, 'node_modules/.bin/vitest');

    const result = spawnSync(bin, [
        'run',
        'tests/scenarios/scenario_runner.test.js',
        '--reporter=json',
        `--outputFile=${VITEST_JSON}`
    ], {
        cwd: ROOT,
        encoding: 'utf8',
        shell: isWin
    });

    return {
        code: result.status ?? 1,
        stdout: result.stdout || '',
        stderr: result.stderr || ''
    };
}

async function run() {
    console.log('PRIMERA Scenario Replay Engine starting...');
    fs.mkdirSync(OUTDIR, { recursive: true });

    const vitestRun = runVitest();
    const replayResults = fs.readdirSync(OUTDIR)
        .filter((file) => file.endsWith('_result.json'))
        .map((file) => readStampedJson(path.join(OUTDIR, file)))
        .filter(Boolean);

    const summary = {
        pass: vitestRun.code === 0 && replayResults.every((result) => result.pass),
        replayCount: replayResults.length,
        results: replayResults.map((result) => ({
            name: result.name,
            pass: result.pass,
            assertions: result.assertions
        })),
        vitest: readStampedJson(VITEST_JSON) || {
            rawExitCode: vitestRun.code,
            stdout: vitestRun.stdout,
            stderr: vitestRun.stderr
        }
    };

    writeStampedJson(
        SUMMARY_PATH,
        summary,
        'engine-scenario-replay',
        ['tests/scenarios/golden_path_clinical.json', 'tests/scenarios/save_roundtrip.json']
    );

    if (vitestRun.code !== 0) {
        console.error(vitestRun.stderr || vitestRun.stdout);
        process.exit(vitestRun.code);
    }

    console.log(`Scenario replay complete. pass=${summary.pass}`);
}

run().catch((error) => {
    console.error('Scenario Replay Engine failed:', error);
    process.exit(1);
});
