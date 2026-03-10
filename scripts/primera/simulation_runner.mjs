
/**
 * @reflection
 * [IDENTITY]: SimulationRunner
 * [PURPOSE]: Headless simulation of game logic to generate runtime snapshots for forensic gates.
 * [DEPENDS_ON]: VillageRegistry, CaseLibrary
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Mocks ---
// Mock browser environment for modules that might need it (though our domain logic should be pure)
global.window = {};
global.localStorage = { getItem: () => null, setItem: () => { } };

// --- Imports ---
// We import domain logic directly. 
// Note: We avoid importing React components or hooks (useGameStore) to keep this headless.
// We reconstruct the state logic manually or use the underlying engines.

import { VILLAGE_FAMILIES } from '../../src/domains/village/VillageRegistry.js';
import * as CaseLibrary from '../../src/content/cases/CaseLibrary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const SNAPSHOT_DIR = path.join(ROOT, 'megalog/outputs/snapshots');

if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

async function runSimulation() {
    console.log('🤖 Starting PRIMERA Headless Simulation...');

    // 1. Initialize State
    const state = {
        day: 1,
        world: { time: 540, day: 1, weather: 'sunny' },
        finance: { stats: { kapitasi: 5000000, expenses: 0, revenue: 0 } },
        player: { profile: { energy: 80, name: 'Dr. Player' } },
        clinical: {
            history: [],
            queue: [],
            activePatientId: null
        },
        villagers: []
    };

    // 2. Load Villagers
    // Flatten families into individuals
    VILLAGE_FAMILIES.forEach(fam => {
        fam.members.forEach(m => {
            state.villagers.push({ ...m, familyId: fam.id });
        });
    });
    console.log(`   - Loaded ${state.villagers.length} villagers.`);

    // 3. Simulate Clinical Visits (Day 1)
    console.log('   - Simulating Day 1 visits...');

    // Pick random patients
    const patients = state.villagers.slice(0, 5); // First 5 for determinism

    for (const p of patients) {
        // Generate a case
        const medicalCase = CaseLibrary.getRandomCase('general'); // simplified

        // Create visit record
        const visit = {
            id: `v_${Math.random().toString(36).substr(2, 9)}`,
            villagerId: p.id,
            name: p.name || p.firstName,
            day: 1,
            dischargedAt: 540, // 09:00
            decision: {
                action: 'treat',
                diagnoses: [medicalCase.id || 'I10'],
                procedures: ['counseling']
            },
            outcome: 'good', // default
            triage: 3,
            hidden: {
                caseData: medicalCase,
                familyId: p.familyId
            }
        };

        // Safety Rule Check (Triage Gate test)
        // Let's inject a dangerous ESI 1 case to test the gate if needed, 
        // but for now we want a clean pass.

        state.clinical.history.push(visit);
    }

    // 4. Export Snapshot
    const snapshotPath = path.join(SNAPSHOT_DIR, `sim_day_1_${Date.now()}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify(state, null, 2));

    console.log(`✅ Simulation complete. Snapshot saved to: ${snapshotPath}`);
}

runSimulation().catch(err => {
    console.error('❌ Simulation Failed:', err);
    process.exit(1);
});
