import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const megalogDir = path.resolve(__dirname, '../../megalog/outputs');

/**
 * ENGINE: TRIAGE SAFETY GATER
 * 🚨 Enforces medical safety rules for critical (ESI 1/Red Flag) cases.
 */
async function runTriageAudit() {
    console.log('🚨 Running Triage Safety Audit...');

    const snapshotsDir = path.resolve(megalogDir, 'snapshots');
    if (!fs.existsSync(snapshotsDir)) return;

    const files = fs.readdirSync(snapshotsDir).filter(f => f.endsWith('.json'));
    if (files.length === 0) return;

    files.sort((a, b) => fs.statSync(path.join(snapshotsDir, b)).mtimeMs - fs.statSync(path.join(snapshotsDir, a)).mtimeMs);
    const state = JSON.parse(fs.readFileSync(path.join(snapshotsDir, files[0]), 'utf8'));

    const results = {
        pass: true,
        violations: [],
        warnings: [],
        assessed: true
    };

    const history = state.clinical?.history || [];

    history.forEach(p => {
        // Rule: ESI 1 (Resuscitation) must NOT be "discharged to home" (treat action)
        if (p.triage === 1 || p.hidden?.caseData?.triageLevel === 1) {
            if (p.decision?.action === 'treat') {
                results.violations.push({
                    id: p.id,
                    message: `CRITICAL SAFETY BREACH: ESI 1 patient ${p.id} discharged to HOME. High mortality risk.`,
                    outcome: p.outcome
                });
                results.pass = false;
            }
        }

        // Rule: Red Flag patients should generally be referred or have stabilization tindakan
        if (p.hidden?.caseData?.isEmergency && p.decision?.action === 'treat' && !p.decision?.procedures?.length) {
            results.warnings.push({
                id: p.id,
                message: `Patient ${p.id} had emergency flags but was discharged without documented procedures.`
            });
        }
    });

    fs.writeFileSync(path.join(megalogDir, 'triage_safety_audit.json'), JSON.stringify(results, null, 2));
    console.log(`✅ Triage Audit complete. Pass: ${results.pass}. Violations: ${results.violations.length}`);
}

runTriageAudit().catch(err => {
    console.error('❌ Triage Engine Failure:', err);
    process.exit(1);
});
