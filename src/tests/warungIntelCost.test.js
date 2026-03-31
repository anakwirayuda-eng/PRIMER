import { describe, it, expect } from 'vitest';
import { getWarungIntelCost, canAffordWarungIntel } from '../domains/village/warungIntelCost.js';

describe('Geo Law Mechanics: Warung Intel Cost', () => {

    describe('getWarungIntelCost', () => {
        it('returns exact static baseline values mandated by Blueprint', () => {
            const cost = getWarungIntelCost();
            expect(cost).toEqual({
                energyCost: 15,
                cashCost: 20000,
                timeCost: 15
            });
        });

        it('returns a fresh object reference each time to protect internal static state from mutations', () => {
            const cost1 = getWarungIntelCost();
            const cost2 = getWarungIntelCost();
            
            // Mutasi pada cost1 TIDAK BOLEH berimbas ke cost2
            cost1.energyCost = 999;
            expect(cost2.energyCost).toBe(15);
            expect(cost1).not.toBe(cost2); // reference check
        });
    });

    describe('canAffordWarungIntel', () => {
        const EXACT_ENERGY = 15;
        const EXACT_CASH = 20000;

        it('returns true when both energy and money bounds are met strictly or exactly', () => {
            // Exact
            expect(canAffordWarungIntel(EXACT_ENERGY, EXACT_CASH)).toBe(true);
            // Surplus
            expect(canAffordWarungIntel(50, 50000)).toBe(true);
        });

        it('returns false when at least one requirement fails (deficit energy or money)', () => {
            // Cukup uang tapi defisit energy
            expect(canAffordWarungIntel(14, 50000)).toBe(false);
            
            // Cukup energy tapi defisit uang
            expect(canAffordWarungIntel(50, 19999)).toBe(false);
            
            // Defisit keduanya
            expect(canAffordWarungIntel(5, 5000)).toBe(false);
        });

        it('returns safe false for missing, invalid, NaN, or non-numeric inputs without crashing', () => {
            // Failsafe parameter checks
            expect(canAffordWarungIntel(null, EXACT_CASH)).toBe(false);
            expect(canAffordWarungIntel(EXACT_ENERGY, undefined)).toBe(false);
            expect(canAffordWarungIntel(NaN, EXACT_CASH)).toBe(false);
            expect(canAffordWarungIntel('15', '20000')).toBe(false); // No silent parsing allowed
            expect(canAffordWarungIntel(-15, -20000)).toBe(false); // No negative stamina bugs
        });
    });

});
