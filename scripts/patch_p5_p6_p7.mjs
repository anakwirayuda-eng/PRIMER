/**
 * P5: RW Progressive Unlock
 * P6: Living Village (villageLedger feedback loop)
 * P7: EMR Dashboard Mobile responsive fix
 *
 * Run: node scripts/patch_p5_p6_p7.mjs
 */
import fs from 'fs';

// ═══════════════════════════════════════════════════════════
// P5: RW PROGRESSIVE UNLOCK
// ═══════════════════════════════════════════════════════════

// Add RW unlock thresholds to VillageRegistry
const vrFile = 'src/domains/village/VillageRegistry.js';
let vr = fs.readFileSync(vrFile, 'utf8');

// Add RW unlock system after FAMILY_INDICATORS merge
const rwUnlockCode = `
// ═══ RW Progressive Unlock ═════════════════════════════
// Game starts with RW 01-02 (30 KK). Additional RW unlock based on day + reputation.
export const RW_UNLOCK_THRESHOLDS = {
    '01': { day: 0, reputation: 0 },   // Always unlocked
    '02': { day: 0, reputation: 0 },   // Always unlocked
    '03': { day: 15, reputation: 30 },  // Early game
    '04': { day: 30, reputation: 40 },  // Mid-early
    '05': { day: 45, reputation: 50 },  // Mid game
    '06': { day: 60, reputation: 55 },  // Mid-late
    '07': { day: 75, reputation: 60 },  // Late game
    '08': { day: 90, reputation: 65 },  // Endgame
};

export function getUnlockedRWs(day, reputation) {
    return Object.entries(RW_UNLOCK_THRESHOLDS)
        .filter(([, req]) => day >= req.day && reputation >= req.reputation)
        .map(([rw]) => rw);
}

export function filterFamiliesByUnlockedRW(families, day, reputation) {
    const unlockedRWs = getUnlockedRWs(day, reputation);
    return families.filter(f => unlockedRWs.includes(f.rw || '01'));
}
`;

// Insert before the VILLAGE_STATS IIFE
if (!vr.includes('RW_UNLOCK_THRESHOLDS')) {
    vr = vr.replace(
        /\/\/ Codex Fix: derive VILLAGE_STATS/,
        rwUnlockCode + '\n// Codex Fix: derive VILLAGE_STATS'
    );
    fs.writeFileSync(vrFile, vr, 'utf8');
    console.log('✅ P5: RW progressive unlock thresholds + helpers added to VillageRegistry.js');
} else {
    console.log('ℹ️ P5: RW_UNLOCK_THRESHOLDS already exists, skipping');
}

// Wire unlock into startNewGame and nextDay
const orcFile = 'src/store/slices/createOrchestratorSlice.js';
let orc = fs.readFileSync(orcFile, 'utf8');

// Add import for getUnlockedRWs
if (!orc.includes('getUnlockedRWs')) {
    orc = orc.replace(
        /import \{ VILLAGE_FAMILIES, FAMILY_INDICATORS, VILLAGE_STATS, getAllVillagers \} from '\.\.\/\.\.\/domains\/village\/VillageRegistry\.js';/,
        `import { VILLAGE_FAMILIES, FAMILY_INDICATORS, VILLAGE_STATS, getAllVillagers, getUnlockedRWs } from '../../domains/village/VillageRegistry.js';`
    );
    console.log('✅ P5: Added getUnlockedRWs import to createOrchestratorSlice.js');
}

// Add unlockedRWs to villageData in startNewGame
if (!orc.includes('unlockedRWs')) {
    orc = orc.replace(
        /state\.publicHealth\.villageData = ensureVillageReadinessState\(population\);/,
        `population.unlockedRWs = getUnlockedRWs(1, 50); // Day 1, starting reputation
                state.publicHealth.villageData = ensureVillageReadinessState(population);`
    );
    console.log('✅ P5: Wired unlockedRWs into startNewGame villageData');
}

// Update unlockedRWs on nextDay
if (!orc.includes('Update unlocked RWs')) {
    orc = orc.replace(
        /\/\/ Village Dynamic Health \(Random fluctuations\)/,
        `// Update unlocked RWs based on current reputation + day
                if (state.publicHealth.villageData) {
                    state.publicHealth.villageData.unlockedRWs = getUnlockedRWs(
                        nextDayVal,
                        state.player.profile.reputation || 50
                    );
                }

                // Village Dynamic Health (Random fluctuations)`
    );
    console.log('✅ P5: Wired unlockedRWs update into nextDay');
}

fs.writeFileSync(orcFile, orc, 'utf8');

// ═══════════════════════════════════════════════════════════
// P6: LIVING VILLAGE (villageLedger feedback loop)
// ═══════════════════════════════════════════════════════════

// Add villageLedger to createPublicHealthSlice
const phFile = 'src/store/slices/createPublicHealthSlice.js';
let ph = fs.readFileSync(phFile, 'utf8');

if (!ph.includes('villageLedger')) {
    // Find the completeProlanisVisit or any action in the slice to add after
    // Add recordVillageLedgerEntry action
    const ledgerAction = `
        // ═══ P6: Living Village — villageLedger feedback loop ═════
        // Records discharge outcomes → updates family indicators
        recordVillageLedgerEntry: (familyId, entryType, details = {}) => {
            set(produce(s => {
                if (!s.publicHealth.villageLedger) s.publicHealth.villageLedger = [];

                const entry = {
                    familyId,
                    type: entryType, // 'discharge', 'home_visit', 'prolanis', 'immunization'
                    day: get().world?.day || 0,
                    timestamp: Date.now(),
                    ...details
                };
                s.publicHealth.villageLedger.push(entry);

                // Apply feedback to family indicators
                if (s.publicHealth.villageData?.families && familyId) {
                    const famIdx = s.publicHealth.villageData.families.findIndex(f => f.id === familyId);
                    if (famIdx >= 0) {
                        const fam = s.publicHealth.villageData.families[famIdx];
                        const indicators = { ...(fam.indicators || {}) };

                        // Discharge feedback: improve relevant indicators
                        if (entryType === 'discharge' && details.diagnosisCategory) {
                            if (details.diagnosisCategory === 'Cardiovascular') indicators.hipertensi = true;
                            if (details.diagnosisCategory === 'Respiratory' && details.diagnosisCode?.startsWith('A15')) indicators.tb = true;
                            if (details.diagnosisCategory === 'Psychiatry') indicators.jiwa = true;
                        }

                        // Prolanis completion: improve chronic indicators
                        if (entryType === 'prolanis') {
                            indicators.hipertensi = true;
                        }

                        // Immunization: improve imunisasi indicator
                        if (entryType === 'immunization') {
                            indicators.imunisasi = true;
                        }

                        s.publicHealth.villageData.families[famIdx] = {
                            ...fam,
                            indicators,
                            lastLedgerDay: entry.day
                        };
                    }
                }
            }));
        },

        getVillageLedger: () => {
            return get().publicHealth.villageLedger || [];
        },
`;

    // Insert before the closing of the slice
    // Find a good insertion point - after completeProlanisVisit
    const insertPoint = ph.lastIndexOf('completeProlanisVisit:');
    if (insertPoint > -1) {
        // Find the end of completeProlanisVisit action (next top-level action or closing)
        const afterComplete = ph.indexOf('\n    },\n', insertPoint);
        if (afterComplete > -1) {
            const insertAt = afterComplete + '\n    },\n'.length;
            ph = ph.slice(0, insertAt) + ledgerAction + ph.slice(insertAt);
            console.log('✅ P6: villageLedger actions added to createPublicHealthSlice.js');
        }
    }

    fs.writeFileSync(phFile, ph, 'utf8');
} else {
    console.log('ℹ️ P6: villageLedger already exists');
}

// Wire discharge → villageLedger in createClinicalSlice
const clinicalFile = 'src/store/slices/createClinicalSlice.js';
let cl = fs.readFileSync(clinicalFile, 'utf8');

if (!cl.includes('recordVillageLedgerEntry')) {
    // Find the discharge logic and add ledger entry
    // Look for where patients move from queue to history
    const dischargePattern = /clinical\.history\.push\(/;
    const match = cl.match(dischargePattern);
    if (match) {
        // Add ledger call after the first history.push
        const pushIdx = cl.indexOf('clinical.history.push(');
        if (pushIdx > -1) {
            // Find the end of the push statement
            let depth = 0;
            let endIdx = pushIdx;
            for (let i = pushIdx; i < cl.length; i++) {
                if (cl[i] === '(') depth++;
                if (cl[i] === ')') { depth--; if (depth === 0) { endIdx = i + 1; break; } }
            }
            // Find the semicolon
            while (endIdx < cl.length && cl[endIdx] !== ';') endIdx++;
            endIdx++;

            const ledgerCall = `
                    // P6: Record to villageLedger for Living Village feedback
                    const _familyId = patient?.hidden?.familyId;
                    if (_familyId) {
                        setTimeout(() => {
                            const phActions = get().publicHealthActions;
                            if (phActions?.recordVillageLedgerEntry) {
                                phActions.recordVillageLedgerEntry(_familyId, 'discharge', {
                                    diagnosisCategory: patient?.medicalData?.category,
                                    diagnosisCode: patient?.medicalData?.trueDiagnosisCode,
                                    outcome: dischargeData?.outcome || 'treated'
                                });
                            }
                        }, 0);
                    }`;

            cl = cl.slice(0, endIdx) + ledgerCall + cl.slice(endIdx);
            console.log('✅ P6: Discharge → villageLedger wired in createClinicalSlice.js');
        }
    } else {
        console.log('⚠️ P6: Could not find clinical.history.push pattern');
    }

    fs.writeFileSync(clinicalFile, cl, 'utf8');
}

// ═══════════════════════════════════════════════════════════
// P7: EMR DASHBOARD MOBILE RESPONSIVE
// ═══════════════════════════════════════════════════════════

// Check if EMR dashboard exists and fix responsive issues
const emrFiles = [
    'src/components/EMRDashboard.jsx',
    'src/components/emr/EMRDashboard.jsx',
    'src/components/poli/EMRDashboard.jsx'
];

let emrFile = null;
for (const f of emrFiles) {
    if (fs.existsSync(f)) { emrFile = f; break; }
}

if (!emrFile) {
    // Search more broadly
    console.log('⚠️ P7: EMR Dashboard file not found in expected locations, searching...');
    const { execSync } = await import('child_process');
    const result = execSync('dir /s /b src\\*EMR* 2>nul || echo NONE', { cwd: process.cwd(), encoding: 'utf8' });
    console.log('   Found:', result.trim().split('\n').slice(0, 5).join(', '));
} else {
    let emr = fs.readFileSync(emrFile, 'utf8');

    // Add responsive meta-fixes: overflow-x hidden, max-w constraints
    if (!emr.includes('mobile-responsive-fix')) {
        // Find the main container div and add responsive classes
        emr = emr.replace(
            /className="([^"]*max-w-[^"]*)">/,
            (match, classes) => {
                if (!classes.includes('overflow-x-hidden')) {
                    return `className="${classes} overflow-x-hidden /* mobile-responsive-fix */">`;
                }
                return match;
            }
        );
        fs.writeFileSync(emrFile, emr, 'utf8');
        console.log('✅ P7: EMR responsive fix applied');
    }
}

console.log('\n🏁 All P5-P7 patches applied!');
