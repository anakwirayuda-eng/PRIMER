import { describe, expect, it } from 'vitest';
import { processUKPBridge } from '../game/TheDirector.js';
import {
    activateBehaviorCaseForVillage,
    applyBehaviorCaseOutcomeToVillage,
    buildBehaviorCaseDebriefState,
    buildBehaviorCaseHistoryEntry,
    clearBehaviorCaseForVillage,
    collectPendingUkpBridgeCases,
    ensureVillageReadinessState,
    markBehaviorCaseBridgeSpawned,
    resolveBehaviorCaseScenarioId
} from '../utils/behaviorCaseRuntime.js';

describe('behaviorCaseRuntime', () => {
    it('backfills readiness state for village data that does not have one yet', () => {
        const villageData = ensureVillageReadinessState({
            families: [{ id: 'kk_01', iksScore: 0.5 }]
        });

        expect(villageData.readinessState).toBeTruthy();
        expect(villageData.readinessState.kk_01.stage).toBe('contemplation');
    });

    it('records a visit and advances readiness when a behavior case is completed', () => {
        const villageData = ensureVillageReadinessState({
            families: [{ id: 'kk_01', iksScore: 0.5, activeScenarioId: 'bc_scabies_outbreak' }]
        });

        const nextVillage = applyBehaviorCaseOutcomeToVillage(villageData, {
            familyId: 'kk_01',
            outcomeTier: 'good',
            caseInstance: {
                familyId: 'kk_01',
                scenarioId: 'bc_scabies_outbreak',
                outcomeTier: 'good'
            }
        }, 5);

        expect(nextVillage.readinessState.kk_01.visitCount).toBe(1);
        expect(nextVillage.readinessState.kk_01.lastVisitDay).toBe(5);
        expect(nextVillage.readinessState.kk_01.stage).toBe('preparation');
        expect(nextVillage.readinessState.kk_01.scenarioHistory).toContain('bc_scabies_outbreak');
        expect(nextVillage.families[0].activeScenarioId).toBeNull();
    });

    it('tracks active behavior cases on the village model until they are cleared', () => {
        const villageData = ensureVillageReadinessState({
            families: [{ id: 'kk_01', iksScore: 0.5 }]
        });
        const scenarioId = resolveBehaviorCaseScenarioId({ familyData: null, familyId: 'kk_01', day: 4 });

        const activeVillage = activateBehaviorCaseForVillage(villageData, 'kk_01', scenarioId);
        expect(activeVillage.families[0].activeScenarioId).toBe(scenarioId);

        const bcState = buildBehaviorCaseDebriefState(activeVillage, [], 4);
        expect(bcState.activeCases).toEqual([{ familyId: 'kk_01', scenarioId }]);

        const clearedVillage = clearBehaviorCaseForVillage(activeVillage, 'kk_01');
        expect(clearedVillage.families[0].activeScenarioId).toBeNull();
    });

    it('builds bridge-ready history entries with normalized failed outcome labels', () => {
        const entry = buildBehaviorCaseHistoryEntry({
            familyId: 'kk_28',
            outcomeTier: 'fail',
            caseInstance: {
                instanceId: 'bc-1',
                scenarioId: 'bc_scabies_outbreak',
                title: 'Wabah Kudis di RT 03',
                familyId: 'kk_28',
                xpEarned: 10,
                reputationDelta: -10
            }
        }, 7);

        expect(entry.type).toBe('behavior_case');
        expect(entry.behaviorCase.outcome).toBe('failed');
        expect(entry.behaviorCase.scenarioId).toBe('bc_scabies_outbreak');
    });

    it('collects only pending failed or partial bridge cases and marks them once spawned', () => {
        // Mock Math.random so processUKPBridge is deterministic (real scenario failProbability < 1.0)
        const origRandom = Math.random;
        Math.random = () => 0.1; // always below any failProbability

        const history = [
            {
                id: 'bc-1',
                day: 3,
                behaviorCase: {
                    scenarioId: 'bc_scabies_outbreak',
                    outcome: 'failed',
                    completedOnDay: 3
                }
            },
            {
                id: 'bc-2',
                day: 3,
                behaviorCase: {
                    scenarioId: 'bc_tb_paru',
                    outcome: 'partial',
                    completedOnDay: 3,
                    ukpBridgeSpawnedOnDay: 4
                }
            }
        ];

        const pending = collectPendingUkpBridgeCases(history);
        expect(pending).toHaveLength(1);
        expect(pending[0].historyEntryId).toBe('bc-1');

        const events = processUKPBridge(pending, 7);
        expect(events).toHaveLength(1);
        expect(events[0].historyEntryId).toBe('bc-1');

        const updatedHistory = markBehaviorCaseBridgeSpawned(history, ['bc-1'], 7);
        expect(collectPendingUkpBridgeCases(updatedHistory)).toHaveLength(0);

        Math.random = origRandom; // restore
    });

    it('builds debrief BC state from village readiness and today history entries', () => {
        const villageData = applyBehaviorCaseOutcomeToVillage(ensureVillageReadinessState({
            families: [{ id: 'kk_01', iksScore: 0.5 }]
        }), {
            familyId: 'kk_01',
            outcomeTier: 'good',
            caseInstance: {
                familyId: 'kk_01',
                scenarioId: 'bc_scabies_outbreak',
                outcomeTier: 'good'
            }
        }, 8);
        const history = [
            {
                day: 8,
                behaviorCase: {
                    scenarioId: 'bc_scabies_outbreak',
                    outcomeTier: 'excellent',
                    familyId: 'kk_01',
                    xpEarned: 150
                }
            }
        ];

        const bcState = buildBehaviorCaseDebriefState(villageData, history, 8);
        expect(bcState.completedToday).toHaveLength(1);
        expect(bcState.completedToday[0].familyId).toBe('kk_01');
        expect(bcState.readinessState.kk_01).toBeTruthy();
        expect(bcState.readinessSummary.some((stage) => stage.id === 'preparation' && stage.count === 1)).toBe(true);
        expect(bcState.villageIKS).toBeGreaterThan(0);
    });
});
