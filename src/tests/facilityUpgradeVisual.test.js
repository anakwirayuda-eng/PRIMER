import { describe, it, expect } from 'vitest';
import { getFacilityUpgradeVisual } from '../domains/village/facilityUpgradeVisual.js';

describe('Geo Law Mechanics: Facility Visual Upgrades', () => {

    describe('MCK', () => {
        it('returns baseline state when not upgraded', () => {
            expect(getFacilityUpgradeVisual('mck', false)).toEqual({
                spriteKey: 'mck_basic',
                isUpgraded: false,
                auraBuff: null
            });
        });

        it('returns upgraded keramik state with buff when upgraded', () => {
            expect(getFacilityUpgradeVisual('mck', true)).toEqual({
                spriteKey: 'mck_keramik',
                isUpgraded: true,
                auraBuff: 'jamban_rt'
            });
        });
    });

    describe('PAMSIMAS', () => {
        it('returns damaged state when not upgraded', () => {
            expect(getFacilityUpgradeVisual('pamsimas', false)).toEqual({
                spriteKey: 'pamsimas_rusak',
                isUpgraded: false,
                auraBuff: null
            });
        });

        it('returns active pristine state with buff when upgraded', () => {
            expect(getFacilityUpgradeVisual('pamsimas', true)).toEqual({
                spriteKey: 'pamsimas_aktif',
                isUpgraded: true,
                auraBuff: 'air_rw'
            });
        });
    });

    describe('Posyandu', () => {
        it('returns simple baseline when not upgraded', () => {
            expect(getFacilityUpgradeVisual('posyandu', false)).toEqual({
                spriteKey: 'posyandu_sederhana',
                isUpgraded: false,
                auraBuff: null
            });
        });

        it('returns mandiri state with XP buff when upgraded', () => {
            expect(getFacilityUpgradeVisual('posyandu', true)).toEqual({
                spriteKey: 'posyandu_mandiri',
                isUpgraded: true,
                auraBuff: 'xp_posyandu'
            });
        });
    });

    describe('Invalid inputs and coercion', () => {
        it('returns a safe null baseline for completely unknown types', () => {
            const expectedSafeReturn = { spriteKey: null, isUpgraded: false, auraBuff: null };

            expect(getFacilityUpgradeVisual('unknown_building', true)).toEqual(expectedSafeReturn);
            expect(getFacilityUpgradeVisual(null, true)).toEqual(expectedSafeReturn);
            expect(getFacilityUpgradeVisual(1234, false)).toEqual(expectedSafeReturn);
            expect(getFacilityUpgradeVisual(undefined, false)).toEqual(expectedSafeReturn);
        });

        it('ignores case differences in valid type lookup', () => {
            expect(getFacilityUpgradeVisual('PAMSIMAS', true).isUpgraded).toBe(true);
            expect(getFacilityUpgradeVisual('   McK   ', true).spriteKey).toBe('mck_keramik');
        });

        it('coerces truthy/falsy the isUpgraded flag safely', () => {
            // truthy
            expect(getFacilityUpgradeVisual('mck', 1).isUpgraded).toBe(true);
            expect(getFacilityUpgradeVisual('mck', 'yes').isUpgraded).toBe(true);
            
            // falsy
            expect(getFacilityUpgradeVisual('mck', 0).isUpgraded).toBe(false);
            expect(getFacilityUpgradeVisual('mck', null).isUpgraded).toBe(false);
            expect(getFacilityUpgradeVisual('mck', undefined).isUpgraded).toBe(false);
        });
    });

});
