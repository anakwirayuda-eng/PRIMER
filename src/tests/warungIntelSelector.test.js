import { describe, it, expect } from 'vitest';
import { selectWarungIntelState } from '../store/selectors.js';
import { getWarungIntelCost } from '../domains/village/warungIntelCost.js';

describe('selectWarungIntelState', () => {
    it('returns default cost and false affordability when state is empty/invalid', () => {
        const canonicalCost = getWarungIntelCost();
        const expected = { ...canonicalCost, canAfford: false };
        
        expect(selectWarungIntelState(null)).toEqual(expected);
        expect(selectWarungIntelState(undefined)).toEqual(expected);
        expect(selectWarungIntelState({})).toEqual(expected);
        expect(selectWarungIntelState({ player: null, finance: null })).toEqual(expected);
    });

    it('returns correct affordability based on current energy and liquid funds', () => {
        const canonicalCost = getWarungIntelCost();
        
        // Exact cutoff for energy and money (energyCost: 15, cashCost: 20000)
        const state1 = {
            player: { profile: { energy: 15 } },
            finance: { stats: { kapitasi: 10_000, pendapatanUmum: 10_000 } }
        };
        expect(selectWarungIntelState(state1)).toEqual({
            ...canonicalCost,
            canAfford: true
        });

        // Insufficient energy
        const state2 = {
            player: { profile: { energy: 10 } },
            finance: { stats: { kapitasi: 30_000, pendapatanUmum: 0 } }
        };
        expect(selectWarungIntelState(state2)).toEqual({
            ...canonicalCost,
            canAfford: false
        });

        // Insufficient money
        const state3 = {
            player: { profile: { energy: 50 } },
            finance: { stats: { kapitasi: 5_000, pendapatanUmum: 5_000 } }
        };
        expect(selectWarungIntelState(state3)).toEqual({
            ...canonicalCost,
            canAfford: false
        });
    });
});
