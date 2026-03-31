import { describe, it, expect } from 'vitest';
import { getPosyanduUpgradeState } from '../domains/village/posyanduUpgrade.js';

describe('Geo Law SDoH: Posyandu Streak Helper', () => {

    it('returns upgraded state when streak equals exactly the requirement (3)', () => {
        expect(getPosyanduUpgradeState(3)).toEqual({
            isUpgraded: true,
            requiredStreak: 3,
            currentStreak: 3,
            remainingToUpgrade: 0
        });
    });

    it('returns upgraded state when streak exceeds the requirement (> 3)', () => {
        expect(getPosyanduUpgradeState(5)).toEqual({
            isUpgraded: true,
            requiredStreak: 3,
            currentStreak: 5,
            remainingToUpgrade: 0
        });
    });

    it('returns non-upgraded state and accurate remaining jumps when streak is < 3', () => {
        expect(getPosyanduUpgradeState(1)).toEqual({
            isUpgraded: false,
            requiredStreak: 3,
            currentStreak: 1,
            remainingToUpgrade: 2
        });

        // Barely missed
        expect(getPosyanduUpgradeState(2)).toEqual({
            isUpgraded: false,
            requiredStreak: 3,
            currentStreak: 2,
            remainingToUpgrade: 1
        });
    });

    it('defaults safely to baseline 0 state when streak is negative', () => {
        expect(getPosyanduUpgradeState(-5)).toEqual({
            isUpgraded: false,
            requiredStreak: 3,
            currentStreak: 0,
            remainingToUpgrade: 3
        });
    });

    it('gracefully handles missing, NaN, or completely invalid inputs to baseline 0 state', () => {
        const expectedBaseline = {
            isUpgraded: false,
            requiredStreak: 3,
            currentStreak: 0,
            remainingToUpgrade: 3
        };

        expect(getPosyanduUpgradeState(null)).toEqual(expectedBaseline);
        expect(getPosyanduUpgradeState(undefined)).toEqual(expectedBaseline);
        expect(getPosyanduUpgradeState(NaN)).toEqual(expectedBaseline);
        expect(getPosyanduUpgradeState('2')).toEqual(expectedBaseline); // Strict type safety, no implicit cast
        expect(getPosyanduUpgradeState({})).toEqual(expectedBaseline);
    });

    it('cleans up fractional streaks safely to integer floor values', () => {
        // 2.9 shouldn't trigger upgraded
        expect(getPosyanduUpgradeState(2.9)).toEqual({
            isUpgraded: false,
            requiredStreak: 3,
            currentStreak: 2,
            remainingToUpgrade: 1
        });
    });

});
