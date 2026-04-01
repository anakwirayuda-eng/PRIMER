import { describe, it, expect } from 'vitest';
import { getEffectiveServiceDistance } from '../domains/village/serviceDistance.js';
import { calculateDistanceDecayModifiers } from '../domains/village/spatialDistanceDecay.js';
import { applyFamilyIndicatorDrift } from '../store/helpers/publicHealthHelpers.js';

const puskesmasAnchor = { id: 'puskesmas', x: 100, y: 30, isActive: true };

function resolveDriftMultiplier(homeCoords) {
    const { distance } = getEffectiveServiceDistance(homeCoords, [puskesmasAnchor]);
    const safeDistance = Number.isFinite(distance) ? distance : 0;
    return calculateDistanceDecayModifiers(safeDistance, false).driftMultiplier;
}

describe('distance decay drift multiplier integration', () => {
    it('keeps near families at base multiplier', () => {
        expect(resolveDriftMultiplier({ x: 110, y: 30 })).toBe(1.0);
    });

    it('applies mid-distance multiplier at 20-40 cells', () => {
        expect(resolveDriftMultiplier({ x: 125, y: 30 })).toBe(1.5);
    });

    it('applies far-distance multiplier above 40 cells', () => {
        expect(resolveDriftMultiplier({ x: 150, y: 30 })).toBe(2.0);
    });

    it('falls back to base multiplier when family coordinates are missing', () => {
        expect(resolveDriftMultiplier(undefined)).toBe(1.0);
    });
});

describe('applyFamilyIndicatorDrift with options.driftMultiplier', () => {
    const seed = 'test-seed';

    it('prioritizes protectedFamilyIds early return over driftMultiplier', () => {
        const protectedFamily = { id: 'fam_protected', indicators: { asuransi: true } };
        const result = applyFamilyIndicatorDrift(
            protectedFamily,
            seed,
            { protectedFamilyIds: ['fam_protected'], driftMultiplier: 2.0 }
        );
        expect(result).toBe(protectedFamily);
    });

    it('preserves legacy behavior when driftMultiplier option is absent', () => {
        const familyA = { id: 'fam_default_a', indicators: { air: true, jamban: true } };
        const familyB = { id: 'fam_default_a', indicators: { air: true, jamban: true } };

        const withoutOption = applyFamilyIndicatorDrift(familyA, seed, {});
        const explicitBaseMultiplier = applyFamilyIndicatorDrift(familyB, seed, { driftMultiplier: 1.0 });

        expect(withoutOption).toEqual(explicitBaseMultiplier);
    });
});
