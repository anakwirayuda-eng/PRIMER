import { describe, it, expect } from 'vitest';
import { getEffectiveServiceDistance } from '../domains/village/serviceDistance.js';

describe('Geo Law SDoH: Effective Service Distance', () => {

    const testAnchors = [
        { id: 'puskesmas', x: 100, y: 30, isActive: true },
        { id: 'pustu_utara', x: 28, y: 50, isActive: false },
        { id: 'polindes_selatan', x: 25, y: 95, isActive: true }
    ];

    it('returns Puskesmas distance correctly as fallback when other hubs are inactive or far', () => {
        const homeCoords = { x: 90, y: 30 }; // Distance to puskesmas = 10
        const result = getEffectiveServiceDistance(homeCoords, testAnchors);

        expect(result).toEqual({ anchorId: 'puskesmas', distance: 10 });
    });

    it('returns closer active FOB distance instead of Puskesmas', () => {
        const homeCoords = { x: 25, y: 90 }; // Distance to polindes = 5
        const result = getEffectiveServiceDistance(homeCoords, testAnchors);

        expect(result).toEqual({ anchorId: 'polindes_selatan', distance: 5 });
    });

    it('safely ignores inactive anchors even if they are closer', () => {
        // pustu_utara is at (28, 50) and distance to (28, 50) is 0, but it is INACTIVE.
        // therefore it should fallback to the nearest active one.
        const homeCoords = { x: 28, y: 50 };
        const result = getEffectiveServiceDistance(homeCoords, testAnchors);

        // Closest active to (28,50) in testAnchors is Polindes at (25,95) [dist: 3+45 = 48]
        // Puskesmas is (100, 30) [dist: 72+20 = 92]
        expect(result.anchorId).toBe('polindes_selatan');
        expect(result.distance).toBe(48);
    });

    it('returns correct lexicographical tie-breaker ID for identical distances deterministically', () => {
        // Equal distance mock anchors
        const equalAnchors = [
            { id: 'hub_z', x: 10, y: 10, isActive: true },
            { id: 'hub_a', x: 30, y: 30, isActive: true } // Same 20 manhattan distance from 20,20
        ];
        const result = getEffectiveServiceDistance({ x: 20, y: 20 }, equalAnchors);

        // alphabet rule: hub_a comes before hub_z
        expect(result).toEqual({ anchorId: 'hub_a', distance: 20 });
    });

    it('returns { null, Infinity } bounds for array with no active anchors at all', () => {
        const inactiveAnchors = [
            { id: 'hub_1', x: 10, y: 10, isActive: false },
            { id: 'hub_2', x: 20, y: 20, isActive: false }
        ];
        const result = getEffectiveServiceDistance({ x: 15, y: 15 }, inactiveAnchors);

        expect(result).toEqual({ anchorId: null, distance: Infinity });
    });

    it('returns graceful Infinity bounds when inputs are dirty/invalid without crashing', () => {
        const EXPECTED_BOGUS = { anchorId: null, distance: Infinity };

        // Invalid home coords
        expect(getEffectiveServiceDistance(null, testAnchors)).toEqual(EXPECTED_BOGUS);
        expect(getEffectiveServiceDistance({ x: '10', y: 10 }, testAnchors)).toEqual(EXPECTED_BOGUS);

        // Invalid anchor array
        expect(getEffectiveServiceDistance({ x: 10, y: 10 }, null)).toEqual(EXPECTED_BOGUS);
        expect(getEffectiveServiceDistance({ x: 10, y: 10 }, {})).toEqual(EXPECTED_BOGUS);
    });

    it('safely ignores dirty elements within the anchor array', () => {
        const dirtyAnchors = [
            null,
            { id: 'good_hub', x: 0, y: 0, isActive: true },
            { id: 'missing_y', x: 10, isActive: true },
            { id: 'nan_hub', x: Math.NaN, y: 10, isActive: true },
            'string_hub_in_array'
        ];

        // Should successfully filter out the garbage and pick "good_hub"
        const result = getEffectiveServiceDistance({ x: 0, y: 5 }, dirtyAnchors);
        expect(result).toEqual({ anchorId: 'good_hub', distance: 5 });
    });
});
