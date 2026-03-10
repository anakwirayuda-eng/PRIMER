import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INVARIANTS } from '../../src/diagnostics/invariants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "../../");
const megalogDir = path.join(ROOT, 'megalog/outputs');
const snapshotsDir = path.resolve(megalogDir, 'snapshots');

async function runAudit() {
    console.log('🛡️ Running High-Precision Invariant Audit...');

    const results = {
        pass: false,
        score: 0,
        violations: [],
        coverage: {
            declared: INVARIANTS.length,
            executed: 0,
            percent: 0
        },
        assessed: false
    };

    if (!fs.existsSync(snapshotsDir)) {
        console.log('ℹ️ No snapshots found to audit.');
        fs.writeFileSync(path.join(megalogDir, 'invariant_audit.json'), JSON.stringify(results, null, 2));
        return;
    }

    const files = fs.readdirSync(snapshotsDir).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
        console.log('ℹ️ No snapshot files found.');
        fs.writeFileSync(path.join(megalogDir, 'invariant_audit.json'), JSON.stringify(results, null, 2));
        return;
    }

    // Sort by modification time to get latest
    files.sort((a, b) => fs.statSync(path.join(snapshotsDir, b)).mtimeMs - fs.statSync(path.join(snapshotsDir, a)).mtimeMs);
    const latestFile = path.join(snapshotsDir, files[0]);
    const state = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

    console.log(`🔍 Auditing snapshot: ${files[0]}`);

    results.assessed = true;
    let score = 100;
    let executedInvariants = 0;

    for (const inv of INVARIANTS) {
        try {
            executedInvariants++;
            if (!inv.check(state)) {
                results.violations.push({
                    id: inv.id,
                    severity: inv.severity || 'warning',
                    message: inv.description
                });

                // Penalty logic
                if (inv.severity === 'critical') score -= 25;
                else if (inv.severity === 'alert') score -= 15;
                else score -= 5;
            }
        } catch (e) {
            results.violations.push({
                id: inv.id,
                severity: 'error',
                message: `Check execution failed: ${e.message}`
            });
            score -= 10;
        }
    }

    results.score = Math.max(0, score);
    results.pass = results.score >= 80;
    results.coverage.executed = executedInvariants;
    results.coverage.percent = Math.round((executedInvariants / INVARIANTS.length) * 100);

    fs.writeFileSync(path.join(megalogDir, 'invariant_audit.json'), JSON.stringify(results, null, 2));
    console.log(`✅ Audit complete. Score: ${results.score}. Coverage: ${results.coverage.percent}%`);
}

runAudit().catch(err => {
    console.error('❌ Invariant Engine Failure:', err);
    process.exit(1);
});
