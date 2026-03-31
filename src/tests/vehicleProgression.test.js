import { describe, it, expect } from 'vitest';
import { isVehicleUnlocked, getUnlockedVehicles } from '../domains/village/vehicleProgression.js';

describe('Geo Law 2b: Vehicle Progression Unlocks', () => {

    it('jalan_kaki is always unlocked for any valid day and balance', () => {
        expect(isVehicleUnlocked('jalan_kaki', 0, 0)).toBe(true);
        expect(isVehicleUnlocked('jalan_kaki', 10, 50000)).toBe(true);
        expect(isVehicleUnlocked('jalan_kaki', 100, 10000000)).toBe(true);
    });

    it('sepeda unlocks strictly on day >= 20, independent of balance', () => {
        expect(isVehicleUnlocked('sepeda', 19, 0)).toBe(false);
        expect(isVehicleUnlocked('sepeda', 20, 0)).toBe(true);
        expect(isVehicleUnlocked('sepeda', 21, 5000000)).toBe(true);
    });

    it('motor_dinas unlocks exactly when day >= 50 AND balance >= 2,000,000', () => {
        expect(isVehicleUnlocked('motor_dinas', 49, 2000000)).toBe(false); // Day missing
        expect(isVehicleUnlocked('motor_dinas', 50, 1999999)).toBe(false); // Balance missing
        expect(isVehicleUnlocked('motor_dinas', 50, 2000000)).toBe(true);  // Both met
        expect(isVehicleUnlocked('motor_dinas', 60, 5000000)).toBe(true);
    });

    it('puskel unlocks exactly when day >= 80 AND balance >= 5,000,000', () => {
        expect(isVehicleUnlocked('puskel', 79, 5000000)).toBe(false); // Day missing
        expect(isVehicleUnlocked('puskel', 80, 4999999)).toBe(false); // Balance missing
        expect(isVehicleUnlocked('puskel', 80, 5000000)).toBe(true);  // Both met
        expect(isVehicleUnlocked('puskel', 100, 10000000)).toBe(true);
    });

    it('getUnlockedVehicles returns correct arrays at different progression tiers', () => {
        // Tier 0: Day 5, 0 balance
        const v5 = getUnlockedVehicles(5, 0);
        expect(v5).toEqual(['jalan_kaki']);

        // Tier 1: Day 25, 1 juta balance
        const v25 = getUnlockedVehicles(25, 1000000);
        expect(v25).toEqual(['jalan_kaki', 'sepeda']);

        // Tier 2: Day 60, 3 juta balance (Motor tier)
        const v60 = getUnlockedVehicles(60, 3000000);
        expect(v60).toEqual(['jalan_kaki', 'sepeda', 'motor_dinas']);

        // Tier 3: Day 90, 6 juta balance (All unlocked)
        const v90 = getUnlockedVehicles(90, 6000000);
        expect(v90).toEqual(['jalan_kaki', 'sepeda', 'motor_dinas', 'puskel']);
    });

    it('safely handles missing, invalid, or negative arguments', () => {
        expect(isVehicleUnlocked('sepeda', null, 50000)).toBe(false);
        expect(isVehicleUnlocked('sepeda', 25, null)).toBe(false);
        expect(isVehicleUnlocked('unknown_vehicle', 100, 5000000)).toBe(false);
        expect(isVehicleUnlocked('jalan_kaki', -5, 0)).toBe(false);
        expect(isVehicleUnlocked('jalan_kaki', 10, -500)).toBe(false);

        expect(getUnlockedVehicles(null, null)).toEqual([]);
        expect(getUnlockedVehicles(-5, -500)).toEqual([]);
    });

});
