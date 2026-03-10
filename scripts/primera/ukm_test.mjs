/**
 * PRIMER UKM Engine Simulation Test
 * Tests all UKM (community health) engines end-to-end.
 * Run: node scripts/primera/ukm_test.mjs
 */
import { fileURLToPath } from 'url';
import path from 'path';

// Mock browser globals
global.window = { addEventListener: () => { }, removeEventListener: () => { } };
global.document = { addEventListener: () => { }, removeEventListener: () => { }, createElement: () => ({ getContext: () => null }) };
global.localStorage = { getItem: () => null, setItem: () => { } };
try { Object.defineProperty(global, 'navigator', { value: { userAgent: 'node' }, writable: true, configurable: true }); } catch (e) { }
global.AudioContext = class { createOscillator() { return { connect() { }, start() { }, stop() { }, frequency: { setValueAtTime() { } } }; } createGain() { return { connect() { }, gain: { setValueAtTime() { }, linearRampToValueAtTime() { } } }; } get destination() { return {}; } };
global.HTMLCanvasElement = class { };
global.Image = class { set onload(fn) { if (fn) setTimeout(fn, 0); } set src(_) { } };

let total = 0, passed = 0, failed = 0;
const failures = [];

function test(name, fn) {
    total++;
    try {
        fn();
        passed++;
        console.log(`  ✅ ${name}`);
    } catch (err) {
        failed++;
        failures.push({ name, error: err.message });
        console.log(`  ❌ ${name}: ${err.message}`);
    }
}
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }

async function run() {
    console.log('\n🏘️ PRIMER UKM ENGINE SIMULATION TEST');
    console.log('═'.repeat(60));

    // ═══════════════════════════════════════════════════════════
    // 1. VILLAGE REGISTRY (dependency)
    // ═══════════════════════════════════════════════════════════
    const VR = await import('../../src/domains/village/VillageRegistry.js');

    // ═══════════════════════════════════════════════════════════
    // 2. DISEASE SCENARIOS
    // ═══════════════════════════════════════════════════════════
    console.log('\n📋 1. DISEASE SCENARIOS');
    const DS = await import('../../src/content/scenarios/DiseaseScenarios.js');

    test('DISEASE_SCENARIOS is non-empty array', () => {
        assert(Array.isArray(DS.DISEASE_SCENARIOS), 'Not an array');
        assert(DS.DISEASE_SCENARIOS.length >= 15, `Only ${DS.DISEASE_SCENARIOS.length} scenarios, expected 15+`);
    });

    test('Every scenario has required fields', () => {
        const bad = DS.DISEASE_SCENARIOS.filter(s => !s.id || !s.title || !s.disease || !s.comBBarriers);
        assert(bad.length === 0, `${bad.length} scenarios missing fields: ${bad.map(s => s.id || 'NO_ID').join(', ')}`);
    });

    test('No duplicate scenario IDs', () => {
        const ids = DS.DISEASE_SCENARIOS.map(s => s.id);
        const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
        assert(dupes.length === 0, `Dupes: ${[...new Set(dupes)].join(', ')}`);
    });

    test('Every scenario has comBBarriers with valid keys', () => {
        const validKeys = ['cap_phy', 'cap_psy', 'opp_phy', 'opp_soc', 'mot_ref', 'mot_aut'];
        for (const s of DS.DISEASE_SCENARIOS) {
            const keys = Object.keys(s.comBBarriers);
            assert(keys.length > 0, `${s.id} has empty comBBarriers`);
            const invalid = keys.filter(k => !validKeys.includes(k));
            assert(invalid.length === 0, `${s.id} has invalid barrier keys: ${invalid.join(',')}`);
        }
    });

    test('Every scenario has bestInterventions', () => {
        const bad = DS.DISEASE_SCENARIOS.filter(s => !s.bestInterventions || s.bestInterventions.length === 0);
        assert(bad.length === 0, `${bad.length} scenarios missing bestInterventions: ${bad.map(s => s.id).join(', ')}`);
    });

    // Note: Tier 3/4 scenarios may not have investigationClues — report as INFO
    {
        const missing = DS.DISEASE_SCENARIOS.filter(s => !s.investigationClues || s.investigationClues.length === 0);
        if (missing.length > 0) {
            console.log(`  ⚠️  INFO: ${missing.length} scenarios missing investigationClues: ${missing.map(s => s.id).join(', ')}`);
        }
    }

    test('COM_B_LABELS covers all 6 domains', () => {
        assert(Object.keys(DS.COM_B_LABELS).length === 6, 'Expected 6 COM-B labels');
    });

    test('READINESS_STAGES has 5 TTM stages', () => {
        assert(DS.READINESS_STAGES.length === 5, `Expected 5 stages, got ${DS.READINESS_STAGES.length}`);
    });

    test('INTERVENTION_FUNCTIONS has 9 functions', () => {
        assert(Object.keys(DS.INTERVENTION_FUNCTIONS).length === 9, `Expected 9, got ${Object.keys(DS.INTERVENTION_FUNCTIONS).length}`);
    });

    // ═══════════════════════════════════════════════════════════
    // 3. IKM SCENARIO LIBRARY
    // ═══════════════════════════════════════════════════════════
    console.log('\n📖 2. IKM SCENARIO LIBRARY');
    const IKM = await import('../../src/content/scenarios/IKMScenarioLibrary.js');

    test('IKM_SCENARIOS is non-empty', () => {
        assert(Array.isArray(IKM.IKM_SCENARIOS), 'Not an array');
        assert(IKM.IKM_SCENARIOS.length >= 10, `Only ${IKM.IKM_SCENARIOS.length} IKM scenarios`);
    });

    test('Every IKM scenario has phases array', () => {
        const bad = IKM.IKM_SCENARIOS.filter(s => !s.phases || s.phases.length === 0);
        assert(bad.length === 0, `${bad.length} IKM scenarios missing phases: ${bad.map(s => s.id).join(', ')}`);
    });

    test('Every IKM scenario has outcomes', () => {
        const bad = IKM.IKM_SCENARIOS.filter(s => !s.outcomes);
        assert(bad.length === 0, `${bad.length} IKM scenarios missing outcomes: ${bad.map(s => s.id).join(', ')}`);
    });

    test('Every IKM phase has valid type', () => {
        const validTypes = ['dialog', 'action', 'choice', 'resolution'];
        for (const s of IKM.IKM_SCENARIOS) {
            for (const p of s.phases) {
                assert(validTypes.includes(p.type), `${s.id} phase "${p.id}" has invalid type: ${p.type}`);
            }
        }
    });

    test('No duplicate IKM scenario IDs', () => {
        const ids = IKM.IKM_SCENARIOS.map(s => s.id);
        const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
        assert(dupes.length === 0, `Dupes: ${[...new Set(dupes)].join(', ')}`);
    });

    // ═══════════════════════════════════════════════════════════
    // 4. BEHAVIOR CASE ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n🔄 3. BEHAVIOR CASE ENGINE');
    const BCE = await import('../../src/game/BehaviorCaseEngine.js');

    test('createBehaviorCase with valid scenario', () => {
        const scenario = DS.DISEASE_SCENARIOS[0];
        const bc = BCE.createBehaviorCase(scenario.id, 'quick', 5);
        assert(bc, `createBehaviorCase returned null for ${scenario.id}`);
        assert(bc.scenarioId === scenario.id, 'scenarioId mismatch');
        assert(bc.mode === 'quick', 'mode mismatch');
        assert(bc.currentPhase === 'investigation', `should start at 'investigation', got '${bc.currentPhase}'`);
    });

    test('createBehaviorCase with deep mode', () => {
        const scenario = DS.DISEASE_SCENARIOS[1];
        const bc = BCE.createBehaviorCase(scenario.id, 'deep', 10);
        assert(bc, 'createBehaviorCase returned null for deep mode');
        assert(bc.mode === 'deep', 'mode should be deep');
        assert(bc.availablePhases.length === 6, `Deep mode should have 6 phases, got ${bc.availablePhases.length}`);
    });

    test('createBehaviorCase with invalid scenario returns null', () => {
        const bc = BCE.createBehaviorCase('nonexistent_scenario', 'quick', 1);
        assert(bc === null, 'Should return null for invalid scenario');
    });

    test('advancePhase increments currentPhase', () => {
        const bc = BCE.createBehaviorCase(DS.DISEASE_SCENARIOS[0].id, 'quick', 5);
        const advanced = BCE.advancePhase(bc);
        assert(advanced.currentPhase === 'intervention', `Phase should be 'intervention', got '${advanced.currentPhase}'`);
        assert(advanced.phasesCompleted.includes('investigation'), 'Should have completed investigation');
    });

    test('getCurrentPhaseInfo returns info', () => {
        const bc = BCE.createBehaviorCase(DS.DISEASE_SCENARIOS[0].id, 'quick', 5);
        const info = BCE.getCurrentPhaseInfo(bc);
        assert(info, 'getCurrentPhaseInfo returned null');
    });

    test('recordClueFound works', () => {
        const scenario = DS.DISEASE_SCENARIOS[0];
        let bc = BCE.createBehaviorCase(scenario.id, 'deep', 5);
        const clue = scenario.investigationClues[0];
        const result = BCE.recordClueFound(bc, clue.location);
        assert(result, 'recordClueFound returned null');
    });

    test('scoreCOMBDiagnosis stores score in comBDiagnosis', () => {
        const scenario = DS.DISEASE_SCENARIOS[0];
        let bc = BCE.createBehaviorCase(scenario.id, 'deep', 5);
        const result = BCE.scoreCOMBDiagnosis(bc, scenario.comBBarriers);
        assert(result, 'scoreCOMBDiagnosis returned null');
        assert(result.comBDiagnosis.score >= 80, `Perfect barriers should score ≥80, got ${result.comBDiagnosis.score}`);
    });

    test('scoreCOMBDiagnosis with wrong barriers scores lower', () => {
        const scenario = DS.DISEASE_SCENARIOS[0];
        let bc = BCE.createBehaviorCase(scenario.id, 'deep', 5);
        const wrongBarriers = { cap_phy: 0.1, mot_aut: 0.1 };
        const result = BCE.scoreCOMBDiagnosis(bc, wrongBarriers);
        assert(result, 'scoreCOMBDiagnosis returned null');
        assert(result.comBDiagnosis.score < 80, `Wrong barriers should score <80, got ${result.comBDiagnosis.score}`);
    });

    test('scoreIntervention with best intervention', () => {
        const scenario = DS.DISEASE_SCENARIOS[0];
        let bc = BCE.createBehaviorCase(scenario.id, 'deep', 5);
        bc = BCE.scoreCOMBDiagnosis(bc, scenario.comBBarriers);
        const bestInt = scenario.bestInterventions[0];
        const result = BCE.scoreIntervention(bc, bestInt);
        assert(result, 'scoreIntervention returned null');
        assert(result.interventionScore > 0, `interventionScore should be > 0, got ${result.interventionScore}`);
    });

    test('getRecommendedInterventions returns array', () => {
        const recs = BCE.getRecommendedInterventions(DS.DISEASE_SCENARIOS[0].id);
        assert(Array.isArray(recs), 'Should return array');
        assert(recs.length > 0, 'Should have recommendations');
    });

    test('resolveOutcome produces valid outcomeTier', () => {
        const scenario = DS.DISEASE_SCENARIOS[0];
        let bc = BCE.createBehaviorCase(scenario.id, 'quick', 5);
        bc = BCE.scoreCOMBDiagnosis(bc, scenario.comBBarriers);
        bc = BCE.scoreIntervention(bc, scenario.bestInterventions[0]);
        const result = BCE.resolveOutcome(bc);
        assert(result, 'resolveOutcome returned null');
        assert(result.outcomeTier, `Missing outcomeTier, got: ${JSON.stringify(Object.keys(result))}`);
        assert(typeof result.xpEarned === 'number', 'Missing xpEarned');
        assert(result.completed === true, 'Should be completed');
    });

    test('selectDailyCases works with game state', () => {
        const state = {
            day: 10,
            villageData: { families: VR.VILLAGE_FAMILIES },
            completedCases: [],
            activeCases: []
        };
        const result = BCE.selectDailyCases(state);
        assert(result, 'selectDailyCases returned null');
        assert(result.coreCases !== undefined, 'Missing coreCases');
    });

    test('Full lifecycle: create → diagnose → intervene → resolve', () => {
        const scenariosWithClues = DS.DISEASE_SCENARIOS.filter(s => s.investigationClues?.length > 0);
        for (const scenario of scenariosWithClues.slice(0, 5)) {
            let bc = BCE.createBehaviorCase(scenario.id, 'quick', 5);
            assert(bc, `Create failed for ${scenario.id}`);
            bc = BCE.scoreCOMBDiagnosis(bc, scenario.comBBarriers);
            bc = BCE.scoreIntervention(bc, scenario.bestInterventions[0]);
            const result = BCE.resolveOutcome(bc);
            assert(result.outcomeTier, `No outcomeTier for ${scenario.id}`);
            assert(result.completed, `Not completed for ${scenario.id}`);
        }
    });

    // ═══════════════════════════════════════════════════════════
    // 5. VILLAGER BEHAVIOR (COM-B profiles)
    // ═══════════════════════════════════════════════════════════
    console.log('\n👥 4. VILLAGER BEHAVIOR');
    const VB = (await import('../../src/domains/village/VillagerBehavior.js')).default;

    test('calculateFamilyCOMB works for all 30 families', () => {
        const errors = [];
        for (const fam of VR.VILLAGE_FAMILIES) {
            try {
                const profile = VB.calculateFamilyCOMB(fam.id);
                if (!profile) errors.push(`${fam.id}: null`);
                else if (typeof profile.cap_psy !== 'number') errors.push(`${fam.id}: missing cap_psy`);
            } catch (e) { errors.push(`${fam.id}: ${e.message}`); }
        }
        assert(errors.length === 0, `Errors: ${errors.join('; ')}`);
    });

    test('getFamilyCOMB returns cached profile', () => {
        const p1 = VB.getFamilyCOMB('kk_01');
        const p2 = VB.getFamilyCOMB('kk_01');
        assert(p1 === p2, 'Cache not working — different references');
    });

    test('getAllFamilyCOMBProfiles covers all families', () => {
        const all = VB.getAllFamilyCOMBProfiles();
        assert(Object.keys(all).length === VR.VILLAGE_FAMILIES.length,
            `Expected ${VR.VILLAGE_FAMILIES.length} profiles, got ${Object.keys(all).length}`);
    });

    test('classifyBehavioralRisk returns valid levels', () => {
        const validLevels = ['minimal', 'low', 'medium', 'high', 'critical'];
        for (const fam of VR.VILLAGE_FAMILIES.slice(0, 10)) {
            const risk = VB.classifyBehavioralRisk(fam.id);
            assert(risk, `${fam.id}: null`);
            assert(validLevels.includes(risk.level), `${fam.id}: invalid level '${risk.level}'`);
            assert(typeof risk.score === 'number', `${fam.id}: score not a number`);
            assert(risk.primaryBarriers.length > 0, `${fam.id}: no primaryBarriers`);
        }
    });

    test('getFamiliesByRisk returns sorted array', () => {
        const sorted = VB.getFamiliesByRisk();
        assert(Array.isArray(sorted), 'Should return array');
        assert(sorted.length === VR.VILLAGE_FAMILIES.length, 'Should cover all families');
        for (let i = 1; i < sorted.length; i++) {
            assert(sorted[i].score <= sorted[i - 1].score, 'Not sorted descending');
        }
    });

    test('calculatePHBSScore returns 0-10', () => {
        for (const fam of VR.VILLAGE_FAMILIES.slice(0, 10)) {
            const score = VB.calculatePHBSScore(fam.id);
            assert(typeof score === 'number', `${fam.id}: not a number`);
            assert(score >= 0 && score <= 10, `${fam.id}: score ${score} out of range`);
        }
    });

    test('matchScenariosToFamily returns ranked matches', () => {
        const matches = VB.matchScenariosToFamily('kk_01', DS.DISEASE_SCENARIOS);
        assert(Array.isArray(matches), 'Should return array');
        assert(matches.length > 0, 'Should find matches');
        assert(matches[0].matchScore >= matches[matches.length - 1].matchScore, 'Should be sorted by score');
    });

    // ═══════════════════════════════════════════════════════════
    // 6. IKM EVENT ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n🎭 5. IKM EVENT ENGINE');
    const IKE = await import('../../src/game/IKMEventEngine.js');

    test('isBlockedByBC with no active cases', () => {
        assert(IKE.isBlockedByBC('bab_sembarangan', []) === false, 'Should not be blocked');
    });

    test('isBlockedByBC with blocking case', () => {
        assert(IKE.isBlockedByBC('bab_sembarangan', ['sth_cacing']) === true, 'Should be blocked by sth_cacing');
    });

    test('evaluateIKMTriggers with fresh state', () => {
        const state = {
            day: 30,
            villageData: { families: VR.VILLAGE_FAMILIES },
            activeIKMEvents: [],
            completedIKMEvents: [],
            eventCooldowns: {},
            activeBCCases: []
        };
        const result = IKE.evaluateIKMTriggers(state);
        assert(Array.isArray(result), 'Should return array');
    });

    test('createEventInstance creates valid instance', () => {
        const scenario = IKM.IKM_SCENARIOS[0];
        const instance = IKE.createEventInstance(scenario, 5);
        assert(instance, 'createEventInstance returned null');
        assert(instance.scenarioId === scenario.id, 'scenarioId mismatch');
        assert(instance.currentPhaseId === 'discovery', `Should start at discovery, got ${instance.currentPhaseId}`);
    });

    test('getCurrentPhase returns first phase', () => {
        const scenario = IKM.IKM_SCENARIOS[0];
        const instance = IKE.createEventInstance(scenario, 5);
        const phase = IKE.getCurrentPhase(instance);
        assert(phase, 'getCurrentPhase returned null');
        assert(phase.type, `Phase missing type, got: ${JSON.stringify(phase)}`);
    });

    test('makeChoice advances dialog phase', () => {
        const scenario = IKM.IKM_SCENARIOS[0];
        let instance = IKE.createEventInstance(scenario, 5);
        const phase = IKE.getCurrentPhase(instance);
        if (phase.type === 'dialog' && phase.choices) {
            const before = instance.currentPhaseId;
            instance = IKE.makeChoice(instance, 0);
            assert(instance.currentPhaseId !== before || instance.completed, 'Should advance after choice');
        }
    });

    test('calculateEventImpact returns deltas for completed event', () => {
        const scenario = IKM.IKM_SCENARIOS[0];
        let instance = IKE.createEventInstance(scenario, 5);
        instance.completed = true;
        instance.impactAccumulated = { reputation: 10, xp: 100 };
        const impact = IKE.calculateEventImpact(instance);
        assert(impact, 'calculateEventImpact returned null');
    });

    test('updateEventProgress handles empty events', () => {
        const result = IKE.updateEventProgress([], 'home_visits', 3);
        assert(Array.isArray(result), 'Should return array');
    });

    test('getSeasonForDay returns valid season', () => {
        assert(IKE.getSeasonForDay(1) === 'rainy', 'Day 1 (Jan) should be rainy');
        assert(IKE.getSeasonForDay(120) === 'dry', 'Day 120 (~Apr) should be dry');
    });

    // ═══════════════════════════════════════════════════════════
    // 7. MINI GAME LIBRARY
    // ═══════════════════════════════════════════════════════════
    console.log('\n🎮 6. MINI GAME LIBRARY');
    const MG = await import('../../src/game/MiniGameLibrary.js');

    test('MINI_GAMES has 3+ games', () => {
        assert(Object.keys(MG.MINI_GAMES).length >= 3, `Only ${Object.keys(MG.MINI_GAMES).length} mini-games`);
    });

    test('Each mini-game has required fields', () => {
        for (const [id, game] of Object.entries(MG.MINI_GAMES)) {
            assert(game.id === id, `${id}: id mismatch`);
            assert(game.title, `${id}: missing title`);
            assert(game.scoring, `${id}: missing scoring`);
        }
    });

    test('inspeksi_kilat has scenes for diseases', () => {
        const ik = MG.MINI_GAMES.inspeksi_kilat;
        assert(ik.scenes, 'Missing scenes');
        assert(Object.keys(ik.scenes).length >= 3, 'Should have 3+ scenes');
        for (const [disease, scene] of Object.entries(ik.scenes)) {
            assert(scene.hazards?.length > 0, `${disease}: no hazards`);
            assert(scene.fakeItems?.length > 0, `${disease}: no fakeItems`);
        }
    });

    test('baca_ekspresi has expressions', () => {
        const be = MG.MINI_GAMES.baca_ekspresi;
        assert(be.expressions?.length >= 5, `Only ${be.expressions?.length} expressions`);
        for (const expr of be.expressions) {
            assert(expr.correctRead, `Expression ${expr.id}: missing correctRead`);
            assert(expr.barrier, `Expression ${expr.id}: missing barrier`);
        }
    });

    test('susun_strategi has cards', () => {
        const ss = MG.MINI_GAMES.susun_strategi;
        assert(ss.cards?.length >= 5, `Only ${ss.cards?.length} cards`);
    });

    // ═══════════════════════════════════════════════════════════
    // 8. EMERGING EVENT TRIGGERS
    // ═══════════════════════════════════════════════════════════
    console.log('\n🦠 7. EMERGING EVENT TRIGGERS');
    const EET = (await import('../../src/game/EmergingEventTriggers.js')).default;

    test('EMERGING_TRIGGERS has triggers', () => {
        assert(Object.keys(EET.EMERGING_TRIGGERS || {}).length >= 3, 'Expected 3+ triggers');
    });

    test('evaluateEmergingTriggers with early day returns null', () => {
        const result = EET.evaluateEmergingTriggers({
            day: 1, villageData: { families: VR.VILLAGE_FAMILIES },
            emergingCooldowns: {}, triggeredEmerging: []
        });
        assert(result === null || result === undefined, 'Day 1 should not trigger emerging events');
    });

    test('getVaxCoverage calculates ratio', () => {
        const coverage = EET.getVaxCoverage({ families: VR.VILLAGE_FAMILIES }, 'imunisasi');
        assert(typeof coverage === 'number', 'Should return number');
        assert(coverage >= 0 && coverage <= 1, `Coverage ${coverage} out of range`);
    });

    // ═══════════════════════════════════════════════════════════
    // 9. POSYANDU ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n⚖️ 8. POSYANDU ENGINE');
    const PE = await import('../../src/game/PosyanduEngine.js');

    test('isPosyanduDay returns true for day 5', () => {
        assert(PE.isPosyanduDay(5) === true, 'Day 5 should be Posyandu day');
    });

    test('isPosyanduDay returns true for day 35', () => {
        assert(PE.isPosyanduDay(35) === true, 'Day 35 should be Posyandu day');
    });

    test('getNextPosyanduDay from day 1 = 5', () => {
        assert(PE.getNextPosyanduDay(1) === 5, `Expected 5, got ${PE.getNextPosyanduDay(1)}`);
    });

    test('getNextPosyanduDay from day 6 = 35', () => {
        assert(PE.getNextPosyanduDay(6) === 35, `Expected 35, got ${PE.getNextPosyanduDay(6)}`);
    });

    test('getEligibleParticipants for penimbangan finds children', () => {
        const eligible = PE.getEligibleParticipants({ families: VR.VILLAGE_FAMILIES }, 'penimbangan');
        assert(eligible.length > 0, 'Should find children age 0-5');
    });

    test('getEligibleParticipants for penyuluhan_gizi finds women', () => {
        const eligible = PE.getEligibleParticipants({ families: VR.VILLAGE_FAMILIES }, 'penyuluhan_gizi');
        assert(eligible.length > 0, 'Should find women age 15-45');
    });

    test('processActivityResult for penimbangan', () => {
        const activity = PE.POSYANDU_ACTIVITIES.penimbangan;
        const participant = { id: 'test', name: 'Anak Test', age: 2, familyId: 'kk_01' };
        const result = PE.processActivityResult(activity, participant);
        assert(result, 'processActivityResult returned null');
        assert(result.xpEarned > 0, 'Should earn XP');
        assert(result.outcomes.length > 0, 'Should have outcomes');
    });

    test('processActivityResult for imunisasi', () => {
        const activity = PE.POSYANDU_ACTIVITIES.imunisasi;
        const participant = { id: 'test', name: 'Bayi Test', age: 0.5, familyId: 'kk_01', vaccineHistory: [] };
        const result = PE.processActivityResult(activity, participant);
        assert(result.outcomes.length > 0, 'Should have vaccination outcomes');
    });

    test('generatePosyanduSummary works', () => {
        const results = [
            { participantId: '1', activityId: 'penimbangan', xpEarned: 15, outcomes: [{ status: 'normal' }] },
            { participantId: '2', activityId: 'penimbangan', xpEarned: 20, outcomes: [{ status: 'underweight' }] },
        ];
        const summary = PE.generatePosyanduSummary(results);
        assert(summary.totalParticipants === 2, 'Wrong participant count');
        assert(summary.totalXP === 35, 'Wrong XP total');
        assert(summary.issuesFound === 1, 'Should find 1 issue');
    });

    // ═══════════════════════════════════════════════════════════
    // 10. PROLANIS ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n💊 9. PROLANIS ENGINE');
    const PL = await import('../../src/game/ProlanisEngine.js');

    test('generateInitialParameters for both disease types', () => {
        const htn = PL.generateInitialParameters('hypertension');
        assert(htn.systolic > 0 && htn.diastolic > 0, 'HTN params invalid');
        const dm = PL.generateInitialParameters('dm_type2');
        assert(dm.hba1c > 0 || dm.fbg > 0, 'DM params invalid');
    });

    test('simulateParameterChange for hypertension', () => {
        const p = PL.generateInitialParameters('hypertension');
        const newP = PL.simulateParameterChange(p, { medicationAdjust: true }, null, 'hypertension');
        assert(newP.systolic > 0, 'New systolic invalid');
    });

    test('simulateParameterChange for dm_type2', () => {
        const p = PL.generateInitialParameters('dm_type2');
        const newP = PL.simulateParameterChange(p, { medicationAdjust: true }, null, 'dm_type2');
        assert(newP, 'simulateParameterChange returned null for DM');
    });

    test('calculateComplicationRisk is 0-100', () => {
        const patient = { diseaseType: 'hypertension', currentParams: PL.generateInitialParameters('hypertension'), history: [], monthsEnrolled: 6 };
        const risk = PL.calculateComplicationRisk(patient);
        assert(risk >= 0 && risk <= 100, `Risk ${risk} out of range`);
    });

    test('determineMonthlyOutcome returns valid outcome', () => {
        const patient = { diseaseType: 'hypertension', currentParams: PL.generateInitialParameters('hypertension'), history: [], monthsEnrolled: 3 };
        const outcome = PL.determineMonthlyOutcome(patient, { medicationAdjust: true, lifestyleCounseling: true });
        assert(outcome, 'determineMonthlyOutcome returned null');
    });

    // ═══════════════════════════════════════════════════════════
    // 11. KIA: PREGNANCY ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n🤰 10. KIA: PREGNANCY ENGINE');
    const Preg = await import('../../src/game/kia/PregnancyEngine.js');

    test('createANCPatient creates valid patient', () => {
        const p = Preg.createANCPatient({ name: 'Ibu Siti', age: 28, gender: 'P' });
        assert(p, 'createANCPatient returned null');
        assert(p.ancData, 'Missing ancData');
        assert(p.ancData.gestationalWeek > 0, 'Invalid gestational weeks');
        assert(p.isANC === true, 'Should be flagged as ANC');
    });

    test('simulateANCVisit for K1', () => {
        const p = Preg.createANCPatient({ name: 'Ibu Test', age: 25, gender: 'P' });
        const result = Preg.simulateANCVisit(p, 'K1', { checksPerformed: ['bp', 'weight', 'fundal_height'] });
        assert(result, 'simulateANCVisit returned null');
        assert(result.score !== undefined, 'Missing score');
    });

    test('evaluateRiskFactors detects high risk', () => {
        const p = Preg.createANCPatient({ name: 'Ibu Risiko', age: 42, gender: 'P' });
        p.ancData.gravida = 5;
        const result = Preg.evaluateRiskFactors(p, { bp: '160/100' });
        assert(result, 'evaluateRiskFactors returned null');
        assert(result.riskScore > 0, 'Should have risk score > 0 for high-risk patient');
    });

    test('generateRandomEvents works', () => {
        const p = Preg.createANCPatient({ name: 'Ibu Test', age: 30, gender: 'P' });
        const events = Preg.generateRandomEvents(p, 2, 5);
        assert(Array.isArray(events), 'Should return array');
    });

    test('KB_METHODS has contraceptive methods', () => {
        assert(Object.keys(Preg.KB_METHODS).length >= 5, `Only ${Object.keys(Preg.KB_METHODS).length} KB methods`);
    });

    // ═══════════════════════════════════════════════════════════
    // 12. KIA: IMMUNIZATION ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n💉 11. KIA: IMMUNIZATION ENGINE');
    const Imm = await import('../../src/game/kia/ImmunizationEngine.js');

    test('getVaccineSchedule for newborn', () => {
        const schedule = Imm.getVaccineSchedule(0, []);
        assert(schedule, 'returned null');
        assert(schedule.due.length > 0, 'Newborn should have due vaccines');
    });

    test('getVaccineSchedule for 9-month baby', () => {
        const schedule = Imm.getVaccineSchedule(9, ['hb0', 'bcg', 'opv1', 'dpt_hb_hib1']);
        assert(schedule.due.length > 0 || schedule.overdue.length > 0, 'Should have due/overdue vaccines');
    });

    test('processImmunization with valid vaccine', () => {
        const baby = { id: 'baby1', name: 'Bayi Test', ageMonths: 0, completedVaccines: [] };
        const result = Imm.processImmunization(baby, 'hb0', 1);
        assert(result, 'processImmunization returned null');
        assert(result.success === true, 'Should succeed for age-appropriate vaccine');
        assert(result.xp > 0, 'Should earn XP');
    });

    test('checkCatchUp finds missing vaccines', () => {
        const baby = { ageMonths: 12, completedVaccines: ['hb0'] };
        const catchUp = Imm.checkCatchUp(baby);
        assert(catchUp.catchUpNeeded.length > 0, 'Should have catch-up vaccines');
    });

    test('calculateCoverage with mixed data', () => {
        const babies = [
            { completedVaccines: ['hb0', 'bcg', 'opv1', 'dpt_hb_hib1'] },
            { completedVaccines: ['hb0'] },
            { completedVaccines: [] },
        ];
        const cov = Imm.calculateCoverage(babies);
        assert(cov, 'calculateCoverage returned null');
        assert(cov.overall >= 0 && cov.overall <= 100, `Coverage ${cov.overall} out of range`);
    });

    test('VACCINE_SCHEDULE has 14+ vaccines', () => {
        assert(Imm.VACCINE_SCHEDULE.length >= 14, `Only ${Imm.VACCINE_SCHEDULE.length} vaccines`);
    });

    // ═══════════════════════════════════════════════════════════
    // 13. KIA: GROWTH CHART ENGINE
    // ═══════════════════════════════════════════════════════════
    console.log('\n📊 12. KIA: GROWTH CHART ENGINE');
    const GC = await import('../../src/game/kia/GrowthChartEngine.js');

    test('plotGrowthPoint for normal boy', () => {
        const result = GC.plotGrowthPoint({ ageMonths: 12, gender: 'L' }, { weight: 9.5, height: 74 });
        assert(result, 'plotGrowthPoint returned null');
        assert(result.weightForAge, 'Missing weightForAge');
        assert(result.category, 'Missing category');
    });

    test('plotGrowthPoint for underweight girl', () => {
        const result = GC.plotGrowthPoint({ ageMonths: 24, gender: 'P' }, { weight: 7.0, height: 80 });
        assert(result.weightForAge.zScore < -1, `Should detect underweight, zScore=${result.weightForAge.zScore}`);
    });

    test('detectGrowthFaltering with falling history', () => {
        // Need 3 consecutive flat/falling points for isFlat (consecutiveFlat >= 2)
        const history = [
            { ageMonths: 6, weight: 7.5 },
            { ageMonths: 9, weight: 7.4 },   // -0.1 (flat)
            { ageMonths: 12, weight: 7.3 },  // -0.1 (flat, consecutive=2 → isFlat)
        ];
        const result = GC.detectGrowthFaltering(history);
        assert(result, 'detectGrowthFaltering returned null');
        assert(result.isFlat === true, `Should detect flat growth, got isFlat=${result.isFlat}, consecutiveFlat=${result.consecutiveFlatMonths}`);
    });

    test('detectGrowthFaltering detects falling weight', () => {
        const history = [
            { ageMonths: 6, weight: 7.5 },
            { ageMonths: 9, weight: 7.0 },  // -0.5 → isFalling
        ];
        const result = GC.detectGrowthFaltering(history);
        assert(result.isFalling === true, 'Should detect falling weight');
        assert(result.alert, 'Should have alert message');
    });

    test('generateKMSData produces chart data', () => {
        const baby = { ageMonths: 12, gender: 'L', growthHistory: [{ ageMonths: 0, weight: 3.3 }, { ageMonths: 6, weight: 7.5 }, { ageMonths: 12, weight: 9.5 }] };
        const kms = GC.generateKMSData(baby);
        assert(kms, 'generateKMSData returned null');
        assert(kms.referenceLines, 'Missing referenceLines');
        assert(kms.actualPoints, 'Missing actualPoints');
    });

    // ═══════════════════════════════════════════════════════════
    // 14. GUEST EVENT SYSTEM
    // ═══════════════════════════════════════════════════════════
    console.log('\n🏠 13. GUEST EVENT SYSTEM');
    const GES = await import('../../src/game/GuestEventSystem.js');

    test('GUEST_EVENTS has events', () => {
        assert(GES.GUEST_EVENTS.length >= 3, `Only ${GES.GUEST_EVENTS.length} events`);
    });

    test('getRandomGuestEvent returns valid event', () => {
        const event = GES.getRandomGuestEvent();
        assert(event.id, 'Missing id');
        assert(event.title, 'Missing title');
        assert(event.options?.length > 0, 'Missing options');
    });

    // ═══════════════════════════════════════════════════════════
    // FINAL REPORT
    // ═══════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(60));
    console.log(`🏁 UKM RESULTS: ${passed}/${total} passed, ${failed} failed`);
    if (failures.length > 0) {
        console.log('\n❌ FAILURES:');
        failures.forEach((f, i) => console.log(`  ${i + 1}. ${f.name}: ${f.error}`));
    }
    console.log('═'.repeat(60));
    process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => { console.error('💥 FATAL:', err); process.exit(1); });
