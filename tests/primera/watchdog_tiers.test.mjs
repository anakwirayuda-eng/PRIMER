import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { runTier } from '../../scripts/primera/watchdog_tiers.mjs';

describe('watchdog_tiers', () => {
    it('stops the tier when store-audit exits non-zero', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'primer-watchdog-'));
        const markerPath = path.join(tempDir, 'after-store-audit.txt');
        const summary = runTier('deep', {
            outdir: tempDir,
            stepsOverride: [
                {
                    name: 'preflight',
                    command: process.execPath,
                    args: ['-e', 'process.exit(0)']
                },
                {
                    name: 'store-audit',
                    command: process.execPath,
                    args: ['-e', 'process.exit(1)']
                },
                {
                    name: 'after-store-audit',
                    command: process.execPath,
                    args: ['-e', `require('fs').writeFileSync(${JSON.stringify(markerPath)}, 'ran')`]
                }
            ]
        });

        expect(summary.pass).toBe(false);
        expect(summary.failedSteps).toEqual(['store-audit']);
        expect(summary.steps.map((step) => step.name)).toEqual(['preflight', 'store-audit']);
        expect(fs.existsSync(markerPath)).toBe(false);

        const report = JSON.parse(
            fs.readFileSync(path.join(tempDir, 'watchdog_deep.json'), 'utf8')
        );
        expect(report.pass).toBe(false);
        expect(report.failedSteps).toEqual(['store-audit']);
        expect(report.steps.map((step) => step.name)).toEqual(['preflight', 'store-audit']);
    });
});
