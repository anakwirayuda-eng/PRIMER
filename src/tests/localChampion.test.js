import { describe, it, expect } from 'vitest';
import { isLocalChampionEligible, getLocalChampionTargets } from '../domains/village/localChampion.js';

describe('Geo Law SDoH: Local Champion Target Selector', () => {

    describe('isLocalChampionEligible', () => {
        it('returns true only for exact 1.0 IKS score', () => {
            expect(isLocalChampionEligible(1.0)).toBe(true);
        });

        it('returns false for scores under or over 1.0 (though over shouldn\'t conceptually happen)', () => {
            expect(isLocalChampionEligible(0.99)).toBe(false);
            expect(isLocalChampionEligible(1.01)).toBe(false);
            expect(isLocalChampionEligible(0.0)).toBe(false);
        });

        it('returns false safely for invalid or missing inputs', () => {
            expect(isLocalChampionEligible(null)).toBe(false);
            expect(isLocalChampionEligible(undefined)).toBe(false);
            expect(isLocalChampionEligible('1.0')).toBe(false); // Type safety
            expect(isLocalChampionEligible(NaN)).toBe(false);
        });
    });

    describe('getLocalChampionTargets', () => {
        const testCoords = {
            'championA': { x: 50, y: 50 },  // Center
            'close_1':   { x: 51, y: 50 },  // dist: 1
            'far_1':     { x: 10, y: 10 },  // dist: 80
            'close_2':   { x: 50, y: 48 },  // dist: 2
            'close_3A':  { x: 49, y: 48 },  // dist: 3
            'close_3B':  { x: 51, y: 52 },  // dist: 3
            'close_3C':  { x: 47, y: 50 }   // dist: 3
        };

        it('excludes the champion family itself from the target results', () => {
            // limit = 10, champion should not be in array
            const targets = getLocalChampionTargets('championA', testCoords, 10);
            
            // Expected length is 6 out of 7 total coords
            expect(targets).toHaveLength(6);
            
            const hasChampion = targets.some(t => t.familyId === 'championA');
            expect(hasChampion).toBe(false);
        });

        it('returns exactly up to the limit of nearest neighbors (default 3)', () => {
            const targets = getLocalChampionTargets('championA', testCoords); // limit 3 assumed
            
            expect(targets).toHaveLength(3);
            expect(targets[0].familyId).toBe('close_1'); // dist 1
            expect(targets[1].familyId).toBe('close_2'); // dist 2
            // dist 3 tie-break (3A < 3B < 3C lexicographically)
            expect(targets[2].familyId).toBe('close_3A');
        });

        it('performs deterministic lexicographical tie-breaker sorting for exact same distances', () => {
            const targets = getLocalChampionTargets('championA', testCoords, 5);
            expect(targets).toHaveLength(5);
            
            // Index 2, 3, 4 are distances of 3
            expect(targets[2].familyId).toBe('close_3A');
            expect(targets[3].familyId).toBe('close_3B');
            expect(targets[4].familyId).toBe('close_3C');
        });

        it('returns empty array if invalid input is provided safely', () => {
            expect(getLocalChampionTargets(null, testCoords)).toEqual([]);
            expect(getLocalChampionTargets('championA', null)).toEqual([]);
            expect(getLocalChampionTargets('unknown_champ', testCoords)).toEqual([]);
        });

        it('ignores invalid neighbor coordinates in the structure gracefully', () => {
            const dirtyCoords = {
                'championB': { x: 10, y: 10 },
                'valid_1': { x: 11, y: 10 }, // dist: 1
                'valid_2': { x: 9, y: 10 },  // dist: 1
                'bad_1': null,
                'bad_2': { x: 'ten', y: 10 },
                'bad_3': { x: 10 } // y missing
            };

            const targets = getLocalChampionTargets('championB', dirtyCoords, 5);
            expect(targets).toHaveLength(2); // Only valid_1 and valid_2 should be parsed
            
            // Tie break between valid_1 and valid_2 -> valid_1 < valid_2 alphabetically
            expect(targets[0].familyId).toBe('valid_1');
            expect(targets[1].familyId).toBe('valid_2');
        });

        it('handles limit properly even when <= 0', () => {
            expect(getLocalChampionTargets('championA', testCoords, 0)).toEqual([]);
            expect(getLocalChampionTargets('championA', testCoords, -5)).toEqual([]);
        });
    });

});
