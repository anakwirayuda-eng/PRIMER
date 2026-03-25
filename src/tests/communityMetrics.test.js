import { describe, expect, it } from 'vitest';
import { calculateCommunityMetrics, calculateEffectiveFamilyIks } from '../utils/communityMetrics.js';

describe('communityMetrics', () => {
    it('keeps baseline IKS unchanged when readiness has no real engagement yet', () => {
        const villageData = {
            families: [
                { id: 'kk_01', iksScore: 0.4, indicators: { jentik: false } }
            ],
            readinessState: {
                kk_01: {
                    stage: 'action',
                    familiarity: 80,
                    visitCount: 0,
                    scenarioHistory: [],
                    stageHistory: []
                }
            }
        };

        expect(calculateEffectiveFamilyIks(villageData.families[0], villageData.readinessState)).toBe(0.4);
        expect(calculateCommunityMetrics(villageData).avgIKS).toBe(0.4);
    });

    it('surfaces behavior-case progress into effective village metrics and active case counts', () => {
        const villageData = {
            families: [
                {
                    id: 'kk_01',
                    iksScore: 0.4,
                    indicators: { jentik: false },
                    activeScenarioId: 'bc_scabies_outbreak'
                },
                {
                    id: 'kk_02',
                    iksScore: 0.6,
                    indicators: { jentik: true }
                }
            ],
            readinessState: {
                kk_01: {
                    stage: 'action',
                    familiarity: 60,
                    visitCount: 2,
                    scenarioHistory: ['bc_scabies_outbreak'],
                    stageHistory: [{ from: 'contemplation', to: 'action', day: 8 }]
                }
            }
        };

        const metrics = calculateCommunityMetrics(villageData);

        expect(metrics.avgIKS).toBeGreaterThan(0.5);
        expect(metrics.risky).toBe(0);
        expect(metrics.activeBehaviorCases).toBe(1);
        expect(metrics.engagedFamilies).toBe(1);
        expect(metrics.readinessVillageIKS).toBeGreaterThan(0);
        expect(metrics.readinessSummary.some((stage) => stage.id === 'action' && stage.count === 1)).toBe(true);
    });
});
