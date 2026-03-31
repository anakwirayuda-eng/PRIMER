import { describe, it, expect } from 'vitest';
import { getWarungIntelTargets } from '../domains/village/warungIntel.js';

describe('Geo Law Intel: Warung Kopi Nearest Targets', () => {

    const testOrigin = { x: 50, y: 50 };
    
    // Test dataset with specific Manhattan distances
    const testFamilyCoords = {
        'kk_close_1': { x: 50, y: 52 },  // distance: 2
        'kk_far_1':   { x: 10, y: 10 },  // distance: 80
        'kk_close_2': { x: 52, y: 49 },  // distance: 3
        'kk_far_2':   { x: 90, y: 90 },  // distance: 80
        'kk_exact':   { x: 50, y: 50 },  // distance: 0 (warung owner)
        'kk_close_3': { x: 48, y: 48 },  // distance: 4
        'kk_close_4': { x: 46, y: 50 }   // distance: 4
    };

    it('returns an empty array if origin is invalid or null', () => {
        expect(getWarungIntelTargets(null, testFamilyCoords)).toEqual([]);
        expect(getWarungIntelTargets({}, testFamilyCoords)).toEqual([]);
        expect(getWarungIntelTargets({ x: 10 }, testFamilyCoords)).toEqual([]);
        expect(getWarungIntelTargets({ x: '50', y: null }, testFamilyCoords)).toEqual([]);
    });

    it('returns an empty array if familyCoords is invalid or null', () => {
        expect(getWarungIntelTargets(testOrigin, null)).toEqual([]);
        expect(getWarungIntelTargets(testOrigin, 123)).toEqual([]);
    });

    it('returns an empty array if limit is clamped to zero or negative', () => {
        expect(getWarungIntelTargets(testOrigin, testFamilyCoords, 0)).toEqual([]);
        expect(getWarungIntelTargets(testOrigin, testFamilyCoords, -10)).toEqual([]);
    });

    it('sorts and returns exactly up to limit nearest families deterministically', () => {
        const results = getWarungIntelTargets(testOrigin, testFamilyCoords, 3);
        
        expect(results).toHaveLength(3);
        
        // Exact 0 (kk_exact)
        expect(results[0]).toEqual({ familyId: 'kk_exact', distance: 0 });
        // Dist 2 (kk_close_1)
        expect(results[1]).toEqual({ familyId: 'kk_close_1', distance: 2 });
        // Dist 3 (kk_close_2)
        expect(results[2]).toEqual({ familyId: 'kk_close_2', distance: 3 });
    });

    it('applies lexicographical tie-breaker for families with exact same distance', () => {
        // 'kk_close_3' and 'kk_close_4' both have distance 4.
        // alphabetically: 'kk_close_3' < 'kk_close_4'
        const results = getWarungIntelTargets(testOrigin, testFamilyCoords, 5);
        expect(results).toHaveLength(5);
        
        expect(results[3]).toEqual({ familyId: 'kk_close_3', distance: 4 });
        expect(results[4]).toEqual({ familyId: 'kk_close_4', distance: 4 });
    });

    it('ignores invalid individual house coordinates gracefully without crashing', () => {
        const dirtyCoords = {
            'kk_good': { x: 49, y: 49 }, // dist: 2
            'kk_bad_1': null,
            'kk_bad_2': { x: 'ten' },
            'kk_good_2': { x: 50, y: 49 } // dist: 1
        };

        const results = getWarungIntelTargets(testOrigin, dirtyCoords, 5);
        
        // Should only pick up the valid 2
        expect(results).toHaveLength(2);
        expect(results[0]).toEqual({ familyId: 'kk_good_2', distance: 1 });
        expect(results[1]).toEqual({ familyId: 'kk_good', distance: 2 });
    });

    it('defaults to 5 limit if limit parameter is omitted', () => {
        const mockFamilies = {};
        for(let i=0; i<10; i++) {
            mockFamilies[`kk_${i}`] = { x: 50+i, y: 50 };
        }
        
        const results = getWarungIntelTargets(testOrigin, mockFamilies);
        expect(results).toHaveLength(5);
    });

});
