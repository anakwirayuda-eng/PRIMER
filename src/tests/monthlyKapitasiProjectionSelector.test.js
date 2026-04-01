import { describe, it, expect } from 'vitest';
import { selectProjectedMonthlyKapitasi } from '../store/selectors.js';

describe('selectProjectedMonthlyKapitasi', () => {
    it('returns safe fallback values when state is missing/invalid', () => {
        const expected = {
            baseKapitasi: 50_000_000,
            accreditationMultiplier: 1.0,
            kbkMultiplier: 1.0,
            projectedMonthlyKapitasi: 50_000_000
        };
        
        expect(selectProjectedMonthlyKapitasi(null)).toEqual(expected);
        expect(selectProjectedMonthlyKapitasi(undefined)).toEqual(expected);
    });

    it('returns 1.0 accreditation multiplier correctly if accreditation is invalid/unknown', () => {
        const state = { publicHealth: { villageData: { families: [] } } };
        const result = selectProjectedMonthlyKapitasi(state, 'UnknownStatus');
        
        expect(result.accreditationMultiplier).toBe(1.0);
        expect(result.projectedMonthlyKapitasi).toBe(50_000_000);
    });

    it('calculates full projection correctly combining accreditation and KBK from inner selector', () => {
        // 'Utama' => 1.25 multiplier
        // KBK with families giving avgIKS 1.0 (multiplier 1.3)
        const state = {
            publicHealth: {
                villageData: { families: [{ id: 'k1', iksScore: 1.0 }] }
            }
        };
        
        const result = selectProjectedMonthlyKapitasi(state, 'Utama');
        
        expect(result.baseKapitasi).toBe(50_000_000);
        expect(result.accreditationMultiplier).toBe(1.25);
        expect(result.kbkMultiplier).toBe(1.3);
        // expected: 50,000,000 * 1.25 * 1.3 = 81,250,000
        expect(result.projectedMonthlyKapitasi).toBe(81_250_000);
    });
});
