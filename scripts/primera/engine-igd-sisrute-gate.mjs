/**
 * @reflection
 * [IDENTITY]: engine-igd-sisrute-gate
 * [PURPOSE]: PRIMERA prophylactic guard ensuring the IGD → SISRUTE referral pipeline
 *            remains correctly wired. Prevents regression where SISRUTE modal intercept
 *            or isSISRUTE flag gets silently dropped.
 * [STATE]: Stable
 * [ANCHOR]: IGD_SISRUTE_GATE
 * [DEPENDS_ON]: useGameStore, EmergencyPanel, ReferralSISRUTEModal, MainLayout
 * [LAST_UPDATE]: 2026-02-21
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const SRC = path.join(ROOT, 'src');
const OUTDIR = path.join(ROOT, 'megalog/outputs');

const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m',
};

/**
 * IGD → SISRUTE flow has 4 critical invariants:
 * 
 * 1. STORE_INTERCEPT: dischargeEmergencyPatient must contain the SISRUTE early intercept
 *    (sets activeReferral and returns early before discharge)
 * 
 * 2. UI_FLAG: EmergencyPanel's "Rujuk ke RS" button must send isSISRUTE: true
 * 
 * 3. MODAL_RENDER: MainLayout must conditionally render ReferralSISRUTEModal
 *    when activeReferral is truthy
 * 
 * 4. MODAL_CALLBACK: ReferralSISRUTEModal must call dischargeEmergencyPatient
 *    with the completed referralDetails
 */

function readFile(relPath) {
    const fullPath = path.join(SRC, relPath);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf-8');
}

function checkInvariant(name, desc, content, patterns) {
    if (!content) return { name, desc, status: 'FAIL', reason: 'File not found' };
    for (const p of patterns) {
        if (!content.includes(p)) {
            return { name, desc, status: 'FAIL', reason: `Missing pattern: "${p.slice(0, 60)}..."` };
        }
    }
    return { name, desc, status: 'PASS' };
}

function run() {
    console.log(`${C.cyan}${C.bold}🏥 PRIMERA IGD-SISRUTE Gate Check${C.reset}\n`);

    const store = readFile('store/useGameStore.js');
    const emergencyPanel = readFile('components/EmergencyPanel.jsx');
    const mainLayout = readFile('components/MainLayout.jsx');
    const sisruteModal = readFile('components/ReferralSISRUTEModal.jsx');

    const results = [];

    // INV-1: Store must have SISRUTE intercept in dischargeEmergencyPatient
    results.push(checkInvariant(
        'STORE_INTERCEPT',
        'dischargeEmergencyPatient has SISRUTE early intercept (sets activeReferral, returns early)',
        store,
        [
            'decision.isSISRUTE',
            'activeReferral:',
            'isEmergency: true',
            'return;' // The early return after setting activeReferral
        ]
    ));

    // INV-2: EmergencyPanel must send isSISRUTE: true on refer button
    results.push(checkInvariant(
        'UI_FLAG',
        'EmergencyPanel sends isSISRUTE: true in onRefer decision payload',
        emergencyPanel,
        [
            'isSISRUTE: true',
            "action: 'refer'"
        ]
    ));

    // INV-3: MainLayout must render ReferralSISRUTEModal when activeReferral is set
    results.push(checkInvariant(
        'MODAL_RENDER',
        'MainLayout conditionally renders ReferralSISRUTEModal with activeReferral',
        mainLayout,
        [
            'activeReferral',
            'ReferralSISRUTEModal'
        ]
    ));

    // INV-4: ReferralSISRUTEModal must call dischargeEmergencyPatient
    results.push(checkInvariant(
        'MODAL_CALLBACK',
        'ReferralSISRUTEModal calls dischargeEmergencyPatient with referralDetails',
        sisruteModal,
        [
            'dischargeEmergencyPatient'
        ]
    ));

    // INV-5: Test file exists for this flow  
    const testExists = fs.existsSync(path.join(SRC, 'tests/dischargeEmergencyPatient.test.js'));
    results.push({
        name: 'TEST_EXISTS',
        desc: 'Unit test file exists for dischargeEmergencyPatient SISRUTE flow',
        status: testExists ? 'PASS' : 'FAIL',
        reason: testExists ? undefined : 'Missing test file: src/tests/dischargeEmergencyPatient.test.js'
    });

    // INV-6: GameContext exposes activeReferral to UI
    const gameContext = readFile('context/GameContext.jsx');
    results.push(checkInvariant(
        'CONTEXT_EXPOSED',
        'GameContext exposes activeReferral to UI components',
        gameContext,
        [
            'activeReferral'
        ]
    ));

    // ─── Report ───
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const total = results.length;

    console.log(`${'─'.repeat(60)}`);
    for (const r of results) {
        const icon = r.status === 'PASS' ? `${C.green}✓` : `${C.red}✗`;
        console.log(`  ${icon} ${C.bold}${r.name}${C.reset}: ${r.desc}`);
        if (r.reason) console.log(`    ${C.red}→ ${r.reason}${C.reset}`);
    }
    console.log(`${'─'.repeat(60)}`);
    console.log(`\n  Result: ${passed}/${total} invariants ${failed === 0 ? `${C.green}PASSED` : `${C.red}FAILED`}${C.reset}\n`);

    // Write JSON report
    const report = {
        gate: 'IGD_SISRUTE_GATE',
        status: failed === 0 ? 'passed' : 'failed',
        invariants: results,
        passedCount: passed,
        failedCount: failed,
        totalCount: total,
        generatedAt: new Date().toISOString()
    };

    if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
    fs.writeFileSync(path.join(OUTDIR, 'igd_sisrute_gate.json'), JSON.stringify(report, null, 2));

    if (failed > 0) {
        console.error(`${C.red}${C.bold}❌ IGD-SISRUTE GATE FAILED — ${failed} broken invariant(s).${C.reset}`);
        console.error(`${C.yellow}   This means the IGD referral flow to SISRUTE modal is broken.${C.reset}`);
        console.error(`${C.yellow}   Fix the issues above before shipping.${C.reset}\n`);
        process.exit(1);
    } else {
        console.log(`${C.green}${C.bold}✅ IGD-SISRUTE Gate: All ${total} invariants intact.${C.reset}\n`);
    }
}

run();
