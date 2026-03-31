import { describe, it, expect } from 'vitest';
import { getFOBUpgradeState } from '../domains/village/fobUpgrade.js';

describe('Geo Law Mechanics: Forward Operating Base (FOB) State', () => {

    it('returns empty building state for baseline Level 0 (inactive)', () => {
        expect(getFOBUpgradeState(0)).toEqual({
            level: 0,
            isActive: false,
            isRestPoint: false,
            energyRecovery: 0,
            availableServices: []
        });
    });

    it('returns staffed transit point state for Level 1 (recovery active)', () => {
        expect(getFOBUpgradeState(1)).toEqual({
            level: 1,
            isActive: true,
            isRestPoint: true,
            energyRecovery: 10,
            availableServices: []
        });
    });

    it('returns fully functional FOB state for Level 2 (clinical services unlocked)', () => {
        expect(getFOBUpgradeState(2)).toEqual({
            level: 2,
            isActive: true,
            isRestPoint: true,
            energyRecovery: 10,
            availableServices: ['anc_kia', 'pengobatan_dasar']
        });
    });

    it('clamps levels safely below 0 to Level 0 default', () => {
        expect(getFOBUpgradeState(-1)).toMatchObject({ level: 0, isActive: false });
        expect(getFOBUpgradeState(-50)).toMatchObject({ level: 0, isActive: false });
    });

    it('clamps levels safely above 2 exclusively to Level 2', () => {
        expect(getFOBUpgradeState(3)).toMatchObject({ level: 2, availableServices: ['anc_kia', 'pengobatan_dasar'] });
        expect(getFOBUpgradeState(99)).toMatchObject({ level: 2 });
    });

    it('forces fractions into lower integers using Math.floor internally', () => {
        expect(getFOBUpgradeState(1.9)).toMatchObject({ level: 1 });
        expect(getFOBUpgradeState(0.5)).toMatchObject({ level: 0 });
    });

    it('safely handles null, objects, NaN, and strings to baseline Level 0', () => {
        const expectedZero = {
            level: 0,
            isActive: false,
            isRestPoint: false,
            energyRecovery: 0,
            availableServices: []
        };

        expect(getFOBUpgradeState(null)).toEqual(expectedZero);
        expect(getFOBUpgradeState(NaN)).toEqual(expectedZero);
        expect(getFOBUpgradeState('1')).toEqual(expectedZero); // Strict number types only
        expect(getFOBUpgradeState({})).toEqual(expectedZero);
    });

});
