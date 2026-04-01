import { describe, expect, it } from 'vitest';
import {
    calculateKbkSpawnPressureMultiplier,
    invertAndCapKbkSpawnPressure
} from '../store/slices/createClinicalSlice.js';

describe('KBK spawn pressure multiplier', () => {
    it('increases spawn pressure when avg IKS is low', () => {
        const families = [
            { id: 'kk-1', iksScore: 0.2 },
            { id: 'kk-2', iksScore: 0.4 }
        ];

        const result = calculateKbkSpawnPressureMultiplier(families);
        expect(result).toBeGreaterThan(1.0);
        expect(result).toBe(1.25);
    });

    it('reduces spawn pressure when avg IKS is high', () => {
        const families = [
            { id: 'kk-1', iksScore: 1.0 },
            { id: 'kk-2', iksScore: 0.9 }
        ];

        const result = calculateKbkSpawnPressureMultiplier(families);
        expect(result).toBeLessThan(1.0);
        expect(result).toBeCloseTo(1 / 1.3, 5);
    });

    it('falls back to baseline when families are missing', () => {
        expect(calculateKbkSpawnPressureMultiplier()).toBe(1.0);
        expect(calculateKbkSpawnPressureMultiplier(null)).toBe(1.0);
        expect(calculateKbkSpawnPressureMultiplier([])).toBe(1.0);
    });

    it('caps inverse spawn pressure safely at both ends', () => {
        expect(invertAndCapKbkSpawnPressure(0.1)).toBe(1.5);
        expect(invertAndCapKbkSpawnPressure(5)).toBe(0.75);
    });
});
