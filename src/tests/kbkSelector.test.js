import { describe, it, expect } from 'vitest';
import { selectKBKPerformanceState } from '../store/selectors.js';

describe('selectKBKPerformanceState', () => {
    it('returns avgIKS 0 and multiplier 1.0 fallback when state/families is empty/invalid', () => {
        const expected = { avgIKS: 0, multiplier: 1.0 };
        
        expect(selectKBKPerformanceState(null)).toEqual(expected);
        expect(selectKBKPerformanceState(undefined)).toEqual(expected);
        expect(selectKBKPerformanceState({})).toEqual(expected);
        expect(selectKBKPerformanceState({ publicHealth: { villageData: null } })).toEqual(expected);
        expect(selectKBKPerformanceState({ publicHealth: { villageData: { families: [] } } })).toEqual(expected);
    });

    it('returns correct avgIKS and multiplier based on IKS score calculation', () => {
        // avgIKS < 0.5 => 0.8
        const state1 = {
            publicHealth: {
                villageData: { families: [{ id: 'k1', iksScore: 0.2 }, { id: 'k2', iksScore: 0.4 }] }
            }
        };
        // Avg: 0.3
        const result1 = selectKBKPerformanceState(state1);
        expect(result1.avgIKS).toBeCloseTo(0.3);
        expect(result1.multiplier).toBe(0.8);

        // avgIKS 0.5-0.8 => 1.0
        const state2 = {
            publicHealth: {
                villageData: { families: [{ id: 'k1', iksScore: 0.6 }, { id: 'k2', iksScore: 0.8 }] }
            }
        };
        // Avg: 0.7
        const result2 = selectKBKPerformanceState(state2);
        expect(result2.avgIKS).toBeCloseTo(0.7);
        expect(result2.multiplier).toBe(1.0);

        // avgIKS > 0.8 => 1.3
        const state3 = {
            publicHealth: {
                villageData: { families: [{ id: 'k1', iksScore: 1.0 }, { id: 'k2', iksScore: 0.9 }] }
            }
        };
        // Avg: 0.95
        const result3 = selectKBKPerformanceState(state3);
        expect(result3.avgIKS).toBeCloseTo(0.95);
        expect(result3.multiplier).toBe(1.3);
    });
});
