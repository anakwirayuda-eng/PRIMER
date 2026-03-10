/**
 * @reflection
 * [IDENTITY]: engine-store-audit
 * [PURPOSE]: Validate useGameStore implementation against STORE_CONTRACT.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mocking some browser environment factors if needed, but we'll try to analyze statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');

async function run() {
    console.log('🛡️ PRIMERA Store Audit Engine starting...');

    const storePath = path.join(ROOT, 'src/store/useGameStore.js');
    const contractPath = path.join(ROOT, 'src/contracts/store.contract.mjs');

    if (!fs.existsSync(storePath)) {
        console.error('❌ useGameStore.js not found');
        process.exit(1);
    }

    const { STORE_CONTRACT } = await import(`file://${contractPath}`);
    const storeContent = fs.readFileSync(storePath, 'utf8');

    const issues = [];
    const results = {
        pass: true,
        checkedSlices: 0,
        checkedActions: 0,
        failures: []
    };

    // Static analysis for presence of keys/actions
    // This is a naive regex-based check for static enforcement

    for (const [sliceName, config] of Object.entries(STORE_CONTRACT.slices)) {
        results.checkedSlices++;
        // Check if slice is defined in the create() block
        if (!storeContent.includes(`${sliceName}:`)) {
            issues.push({ type: 'error', message: `Slice [${sliceName}] missing in useGameStore` });
        } else {
            for (const key of config.requiredKeys) {
                // Check if key is defined within the slice (simple regex)
                // Note: This is fragile but works for the current flat structure
                if (!storeContent.includes(`${key}:`)) {
                    issues.push({ type: 'warning', message: `Key [${key}] might be missing from slice [${sliceName}]` });
                }
            }
        }
    }

    for (const [groupName, actions] of Object.entries(STORE_CONTRACT.actions)) {
        if (!storeContent.includes(`${groupName}:`)) {
            issues.push({ type: 'error', message: `Action Group [${groupName}] missing` });
        } else {
            for (const action of actions) {
                results.checkedActions++;
                if (!storeContent.includes(`${action}:`)) {
                    issues.push({ type: 'error', message: `Action [${action}] missing from [${groupName}]` });
                }
            }
        }
    }

    if (issues.some(i => i.type === 'error')) results.pass = false;
    results.failures = issues;

    fs.writeFileSync(path.join(OUTDIR, 'store_audit.json'), JSON.stringify(results, null, 2));

    if (results.pass) {
        console.log(`✅ Store Contract Audit PASSED (${results.checkedSlices} slices, ${results.checkedActions} actions)`);
    } else {
        console.warn(`⚠️ Store Contract Audit FAILED with ${issues.length} issues. Check megalog/outputs/store_audit.json`);
    }
}

run().catch(err => {
    console.error('Store Audit Engine failed:', err);
    process.exit(1);
});
