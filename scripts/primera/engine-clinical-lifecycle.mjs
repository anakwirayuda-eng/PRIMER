import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const megalogDir = path.resolve(__dirname, '../../megalog/outputs');

/**
 * ENGINE: CLINICAL LIFECYCLE MONITOR
 * 🏥 Ensures patients follow a strict medical state machine.
 */
async function runLifecycleAudit() {
    console.log('🏥 Running Clinical Lifecycle Audit...');

    const snapshotsDir = path.resolve(megalogDir, 'snapshots');
    if (!fs.existsSync(snapshotsDir)) return;

    const files = fs.readdirSync(snapshotsDir).filter(f => f.endsWith('.json'));
    if (files.length === 0) return;

    files.sort((a, b) => fs.statSync(path.join(snapshotsDir, b)).mtimeMs - fs.statSync(path.join(snapshotsDir, a)).mtimeMs);
    const state = JSON.parse(fs.readFileSync(path.join(snapshotsDir, files[0]), 'utf8'));

    const results = {
        pass: true,
        leaks: [],
        orphans: [],
        transitions: [],
        assessed: true
    };

    const queue = state.clinical?.queue || [];
    const emergency = state.clinical?.emergencyQueue || [];
    const history = state.clinical?.history || [];
    const activeId = state.clinical?.activePatientId;

    // 1. Leak Detection (One patient in two places)
    const allIds = [...queue, ...emergency, ...history].map(p => p.id);
    const idFreq = {};
    allIds.forEach(id => idFreq[id] = (idFreq[id] || 0) + 1);

    Object.keys(idFreq).forEach(id => {
        if (idFreq[id] > 1) {
            results.leaks.push({ id, message: `Patient exists in ${idFreq[id]} lifecycle stages simultaneously.` });
            results.pass = false;
        }
    });

    // 2. Active Pointer Orphanage
    if (activeId && !queue.some(p => p.id === activeId) && !emergency.some(p => p.id === activeId)) {
        results.orphans.push({ id: activeId, message: 'activePatientId points to a patient not in the active queue.' });
        results.pass = false;
    }

    fs.writeFileSync(path.join(megalogDir, 'clinical_lifecycle_audit.json'), JSON.stringify(results, null, 2));
    console.log(`✅ Lifecycle Audit complete. Pass: ${results.pass}. Leaks: ${results.leaks.length}`);
}

runLifecycleAudit().catch(err => {
    console.error('❌ Lifecycle Engine Failure:', err);
    process.exit(1);
});
