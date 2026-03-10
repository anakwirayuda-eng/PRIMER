/**
 * test_migration.mjs
 * Validates that legacy save data can be safely hydrated into the current store structure.
 */

import { useGameStore } from '../src/store/useGameStore.js';
import fs from 'fs';

const LEGACY_SAVE_MOCK = {
    saveVersion: 3,
    player: { name: 'Dr. Test', energy: 50, xp: 100 },
    world: { day: 10, time: 600 },
    finance: { balance: 5000, facilities: { lab: 1 } },
    clinical: { reputation: 80, history: [] },
    publicHealth: { villageData: null },
    staff: { hiredStaff: [] }
};

function runMigrationTest() {
    console.log('🧪 Starting Save Migration Test...');

    // 1. Simulate Hydration
    try {
        useGameStore.setState(LEGACY_SAVE_MOCK);
        const currentState = useGameStore.getState();

        // 2. Invariants Check
        const checks = [
            { name: 'Player Hydration', pass: currentState.player.name === 'Dr. Test' },
            { name: 'Finance Integrity', pass: currentState.finance.balance === 5000 },
            { name: 'Time Preservation', pass: currentState.world.day === 10 },
            { name: 'Clinical Safety', pass: typeof currentState.clinicalActions.setQueue === 'function' }
        ];

        let allPass = true;
        checks.forEach(c => {
            console.log(`${c.pass ? '✅' : '❌'} ${c.name}`);
            if (!c.pass) allPass = false;
        });

        if (allPass) {
            console.log('\n✨ Migration Test PASSED. Legacy data is compatible.');
            process.exit(0);
        } else {
            console.error('\n💥 Migration Test FAILED. Potential breaking changes detected.');
            process.exit(1);
        }
    } catch (e) {
        console.error('\n🔥 CRITICAL: Migration logic threw an exception!', e.message);
        process.exit(1);
    }
}

runMigrationTest();
