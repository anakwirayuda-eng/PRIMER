import { describe, expect, it } from 'vitest';
import { calculateAverageIksFromFamilies } from '../utils/villageMetrics.js';

describe('villageMetrics', () => {
    it('calculates average IKS from a family array', () => {
        expect(calculateAverageIksFromFamilies([
            { iksScore: 0.5 },
            { iksScore: 1.0 },
            { iksScore: 0.25 }
        ])).toBeCloseTo(0.5833, 3);
    });

    it('returns 0 for empty or invalid family lists', () => {
        expect(calculateAverageIksFromFamilies([])).toBe(0);
        expect(calculateAverageIksFromFamilies(null)).toBe(0);
    });
});
