/**
 * P2 Final Fix: Force opening day patients to include residents.
 * The problem: generatePatient uses rng.chance(0.7) for resident selection,
 * but with deterministic seeds, all 3 opening patients happen to fail this check.
 * Solution: Generate directly by picking village residents and building patients around them.
 */
import fs from 'fs';

const orcFile = 'src/store/slices/createOrchestratorSlice.js';
let orc = fs.readFileSync(orcFile, 'utf8');

// Add import for pickDeterministic and seedKey (if not already imported)
if (!orc.includes("from '../../utils/deterministicRandom.js'")) {
    // seedKey is already imported, but we need pickDeterministic
    orc = orc.replace(
        "import { seedKey } from '../../utils/deterministicRandom.js';",
        "import { seedKey, pickDeterministic } from '../../utils/deterministicRandom.js';"
    );
}

// Replace the opening day queue generation
const oldQueue = `// Opening day: 2 resident patients + 1 walk-in to showcase 200 KK village
                state.clinical.queue = [
                    generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-resident', 0)),
                    generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-resident', 1)),
                    generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-walkin', 0))
                ];`;

const newQueue = `// Opening day: Generate 3 patients. Two use forced-resident seeds
                // to guarantee the player sees village residents on day 1.
                const _p0 = generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game', 'open-a'));
                const _p1 = generatePatient(510, population, 1, state.finance.facilities, [], seedKey('new-game', 'open-b'));
                const _p2 = generatePatient(540, population, 1, state.finance.facilities, [], seedKey('new-game', 'open-c'));

                // Post-generate: Force at least 2 to be residents if they aren't already
                const _forceResident = (p, idx) => {
                    if (p.social?.isResident) return p; // Already resident
                    // Pick a random villager from the expanded pool
                    const villagers = population.villagers?.filter(v => v.status === 'alive') || [];
                    if (villagers.length === 0) return p;
                    const v = pickDeterministic(villagers, seedKey('force-resident', idx));
                    const fam = population.families?.find(f => f.id === v.familyId);
                    return {
                        ...p,
                        name: v.fullName || (v.firstName + ' ' + (fam?.surname || '')),
                        age: v.age || p.age,
                        gender: v.gender === 'L' ? 'Laki-laki' : 'Perempuan',
                        social: { ...p.social, isResident: true, familyId: v.familyId, villagerId: v.id },
                        hidden: { ...p.hidden, familyId: v.familyId, villagerId: v.id, isResident: true }
                    };
                };

                state.clinical.queue = [
                    _forceResident(_p0, 0),
                    _forceResident(_p1, 1),
                    _p2 // Third patient can be outsider/random
                ];`;

if (orc.includes(oldQueue)) {
    orc = orc.replace(oldQueue, newQueue);
    console.log('✅ P2: Opening day patients — 2/3 forced residents, 1 random walk-in');
} else {
    // Try original pattern
    const origQueue = `state.clinical.queue = [
                    generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-patient', 0)),
                    generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-patient', 1)),
                    generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-patient', 2))
                ];`;
    if (orc.includes(origQueue)) {
        orc = orc.replace(origQueue, newQueue);
        console.log('✅ P2: Opening day patients (original pattern) — 2/3 forced residents');
    } else {
        console.log('⚠️ P2: Could not find queue generation pattern. Manual check needed.');
        console.log('   Searching for seedKey near queue...');
        const idx = orc.indexOf('new-game');
        if (idx > -1) console.log('   Found "new-game" at offset', idx);
    }
}

fs.writeFileSync(orcFile, orc, 'utf8');
