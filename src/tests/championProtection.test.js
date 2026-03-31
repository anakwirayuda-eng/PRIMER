import { describe, it, expect } from 'vitest';
import { getChampionProtectedFamilies } from '../domains/village/championProtection.js';

describe('Geo Law SDoH: Champion Protection Helper', () => {

    const testCoords = {
        'champ_1': { x: 50, y: 50 }, // Champion 1
        'champ_2': { x: 50, y: 48 }, // Champion 2, overlapping with champ_1
        'kk_a':    { x: 51, y: 50 }, // Dist 1 to champ_1
        'kk_b':    { x: 50, y: 49 }, // Dist 1 to both, right in the middle
        'kk_c':    { x: 52, y: 50 }, // Dist 2 from champ_1
        'kk_d':    { x: 49, y: 48 }, // Dist 1 from champ_2
        'kk_f':    { x: 10, y: 10 }  // Dist 80, far away
    };

    it('collects up to N nearest distinct protected families from one champion', () => {
        // From champ_1: closest non-champions are: kk_b, kk_a, kk_c 
        // From champ_2: closest non-champions are: kk_b, kk_d, kk_a(dist 3)
        // Let's refine the test to pass both champions so they are excluded!
        
        const strictProtectedArray = getChampionProtectedFamilies(['champ_1', 'champ_2'], testCoords, 3);
        
        // From champ_1: closest non-champions are: kk_b, kk_a, kk_c 
        // From champ_2: closest non-champions are: kk_b, kk_d, kk_a(dist 3)
        // Set union sorted: ['kk_a', 'kk_b', 'kk_c', 'kk_d']
        expect(strictProtectedArray).toHaveLength(4);
        expect(strictProtectedArray).toEqual(['kk_a', 'kk_b', 'kk_c', 'kk_d']);
    });

    it('excludes champions from gaining protection buffs from other champions (via overlapping check)', () => {
        // Only output target families should emerge
        const protectedArray = getChampionProtectedFamilies(['champ_1', 'champ_2'], testCoords, 5);
        expect(protectedArray).not.toContain('champ_1');
        expect(protectedArray).not.toContain('champ_2');
    });

    it('returns empty array if champion array is empty or bad format', () => {
        expect(getChampionProtectedFamilies([], testCoords)).toEqual([]);
        expect(getChampionProtectedFamilies(null, testCoords)).toEqual([]);
        expect(getChampionProtectedFamilies({}, testCoords)).toEqual([]);
    });

    it('returns empty array securely if familyCoords are missing/invalid', () => {
        expect(getChampionProtectedFamilies(['champ_1'], null)).toEqual([]);
        expect(getChampionProtectedFamilies(['champ_1'], undefined)).toEqual([]);
        expect(getChampionProtectedFamilies(['champ_1'], 123)).toEqual([]);
    });

    it('returns empty array if limit is clamped safely to <= 0', () => {
        expect(getChampionProtectedFamilies(['champ_1'], testCoords, 0)).toEqual([]);
        expect(getChampionProtectedFamilies(['champ_1'], testCoords, -10)).toEqual([]);
    });

    it('sorts the output alphabetically ascending to guarantee test determinism', () => {
        // By changing the alphabetical names, we expect sorted result
        const weirdCoords = {
            'c1': { x: 0, y: 0 },
            'Z_TARGET': { x: 1, y: 0 },
            'A_TARGET': { x: 0, y: 1 },
            'M_TARGET': { x: 1, y: 1 }
        };

        const result = getChampionProtectedFamilies(['c1'], weirdCoords, 3);
        expect(result).toEqual(['A_TARGET', 'M_TARGET', 'Z_TARGET']);
    });

});
