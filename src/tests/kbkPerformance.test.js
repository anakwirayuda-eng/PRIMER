import { describe, it, expect } from 'vitest';
import { calculateKBKPerformanceMultiplier } from '../domains/village/kbkPerformance.js';

describe('Geo Law 2b: KBK BPJS Performance', () => {

    it('returns punishment multiplier (0.8) when IKS < 0.5', () => {
        expect(calculateKBKPerformanceMultiplier(0.1)).toBe(0.8);
        expect(calculateKBKPerformanceMultiplier(0.49)).toBe(0.8);
        expect(calculateKBKPerformanceMultiplier(0.0)).toBe(0.8);
    });

    it('returns standard multiplier (1.0) when 0.5 <= IKS <= 0.8', () => {
        expect(calculateKBKPerformanceMultiplier(0.5)).toBe(1.0);
        expect(calculateKBKPerformanceMultiplier(0.65)).toBe(1.0);
        expect(calculateKBKPerformanceMultiplier(0.8)).toBe(1.0);
    });

    it('returns reward multiplier (1.3) when IKS > 0.8', () => {
        expect(calculateKBKPerformanceMultiplier(0.81)).toBe(1.3);
        expect(calculateKBKPerformanceMultiplier(0.95)).toBe(1.3);
        expect(calculateKBKPerformanceMultiplier(1.0)).toBe(1.3);
    });

    it('returns standard multiplier (1.0) on invalid or missing inputs (failsafe behavior)', () => {
        expect(calculateKBKPerformanceMultiplier(null)).toBe(1.0);
        expect(calculateKBKPerformanceMultiplier(undefined)).toBe(1.0);
        expect(calculateKBKPerformanceMultiplier('0.5')).toBe(1.0); // Strict type check
        expect(calculateKBKPerformanceMultiplier(NaN)).toBe(1.0);
        expect(calculateKBKPerformanceMultiplier(-0.1)).toBe(1.0); // Negative score guard
    });

});
