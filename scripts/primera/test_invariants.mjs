import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Import Core Logic (Assuming Node supports ES modules here, which it does if mjs)
import {
    INITIAL_PLAYER_STATE,
    INITIAL_TIME_STATE,
    advanceTime,
    calculateXpGain,
    calculateGlobalBuffs
} from '../src/game/GameCore.js';

// --- SEEDED RNG (LGC) ---
class SeededRNG {
    constructor(seed = 12345) {
        this.seed = seed;
    }
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
}

const rng = new SeededRNG(42); // Deterministic seed

async function runSimulation(daysToSimulate = 1000) {
    console.log(`\n🧬 Starting Honest Soak Test (${daysToSimulate} days)...`);

    let state = {
        player: { profile: { ...INITIAL_PLAYER_STATE } },
        world: { ...INITIAL_TIME_STATE },
        finance: { stats: { pendapatanUmum: 1000000 }, facilities: { poli_umum: 1 } },
        staff: { hiredStaff: [] }
    };

    const logs = [];
    let invariantsBroken = false;
    let daysElapsed = 0;

    try {
        for (let d = 0; d < daysToSimulate; d++) {
            // Simulate a full day (1440 minutes)
            for (let m = 0; m < 1440; m += 5) {
                const next = advanceTime(state.world.time, state.world.day, 5);
                state.world.time = next.time;
                state.world.day = next.day;

                // Random events (using seeded RNG)
                if (rng.next() < 0.01) {
                    state.player.profile.energy = Math.max(0, state.player.profile.energy - 5);
                    state.player.profile.xp = calculateXpGain(state.player.profile.xp, 10).xp;
                }

                // CHECK INVARIANTS
                if (isNaN(state.world.time) || isNaN(state.player.profile.energy)) {
                    throw new Error(`NaN detected at Day ${state.world.day}, Time ${state.world.time}`);
                }
                if (state.player.profile.energy < 0) {
                    throw new Error(`Energy dropped below zero at Day ${state.world.day}`);
                }
                if (state.player.profile.spirit < 0) {
                    throw new Error(`Spirit dropped below zero at Day ${state.world.day}`);
                }
            }
            daysElapsed++;

            // Daily recovery (Simplified for sim)
            state.player.profile.energy = 100;

            if (d % 100 === 0) console.log(`  ...day ${d} pass`);
        }
    } catch (err) {
        console.error(`❌ Simulation Failed: ${err.message}`);
        invariantsBroken = true;
        logs.push(err.message);
    }

    const results = {
        timestamp: new Date().toISOString(),
        status: invariantsBroken ? 'failed' : 'passed',
        daysElapsed,
        seed: 42,
        metrics: {
            finalLevel: state.player.profile.level,
            finalXp: state.player.profile.xp,
            finalBalance: state.finance.stats.pendapatanUmum
        },
        logs
    };

    fs.writeFileSync(path.join(ROOT_DIR, 'simulation_results.json'), JSON.stringify(results, null, 2));
    console.log(`✅ Simulation complete. Status: ${results.status}\n`);
}

runSimulation().catch(console.error);
