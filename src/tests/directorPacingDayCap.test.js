import { describe, expect, it } from 'vitest';
import {
    selectPacingProfile,
    getDayPhaseCapIntensity,
    evaluateDirectorState,
    PACING_PROFILES,
} from '../game/TheDirector.js';

describe('TheDirector — getDayPhaseCapIntensity (DeepThink M2 kurva 90-hari)', () => {
    it.each([
        [1, 1],   // Day 1 → cap breathing (1)
        [7, 1],
        [14, 1],
        [15, 2],  // Day 15 → cap normal (2)
        [30, 2],
        [31, 3],  // Day 31 → cap pressure (3)
        [60, 3],
        [61, 4],  // Day 61+ → cap crisis (4)
        [90, 4],
        [120, 4],
    ])('day=%i → cap intensity %i', (day, expected) => {
        expect(getDayPhaseCapIntensity(day)).toBe(expected);
    });

    it('handles invalid input as Day 1', () => {
        expect(getDayPhaseCapIntensity(NaN)).toBe(1);
        expect(getDayPhaseCapIntensity(-5)).toBe(1);
        expect(getDayPhaseCapIntensity(undefined)).toBe(1);
    });
});

describe('TheDirector — selectPacingProfile day-aware cap', () => {
    it('early game (Day 1-14): bored player tetap dilempar ke breathing, bukan crisis', () => {
        // Stress score 5 (very low) di Day 7 → tanpa cap = crisis, dengan cap = breathing
        const profile = selectPacingProfile(5, 7);
        expect(profile).toBe(PACING_PROFILES.breathing);
    });

    it('mid game (Day 15-30): bored player → normal max', () => {
        const profile = selectPacingProfile(5, 20);
        expect(profile).toBe(PACING_PROFILES.normal);
    });

    it('late mid (Day 31-60): bored player → pressure max', () => {
        const profile = selectPacingProfile(5, 50);
        expect(profile).toBe(PACING_PROFILES.pressure);
    });

    it('endgame (Day 61+): bored player full crisis sesuai stress', () => {
        const profile = selectPacingProfile(5, 75);
        expect(profile).toBe(PACING_PROFILES.crisis);
    });

    it('high stress player tetap dapat mercy mode di hari berapa pun', () => {
        // Stress 90 → mercy regardless of cap
        expect(selectPacingProfile(90, 1)).toBe(PACING_PROFILES.mercy);
        expect(selectPacingProfile(90, 90)).toBe(PACING_PROFILES.mercy);
    });

    it('mid-stress di hari awal stay capped', () => {
        // Stress 25 (would be 'pressure' tanpa cap), Day 7 (cap breathing)
        const profile = selectPacingProfile(25, 7);
        expect(profile).toBe(PACING_PROFILES.breathing);
    });

    it('back-compat: selectPacingProfile(stress) tanpa day → no cap', () => {
        // Default day = Infinity (existing behavior preserved)
        expect(selectPacingProfile(5)).toBe(PACING_PROFILES.crisis);
        expect(selectPacingProfile(90)).toBe(PACING_PROFILES.mercy);
    });
});

describe('TheDirector — evaluateDirectorState passes day to selector', () => {
    it('Day 5 + queue kosong + energy max → tetap breathing (capped)', () => {
        const verdict = evaluateDirectorState({
            day: 5,
            queueLength: 0,
            emergencyQueueLength: 0,
            energy: 100,
            reputation: 90,
            activeOutbreakCount: 0,
            casesToday: 0,
        });
        expect(verdict.profile).toBe(PACING_PROFILES.breathing);
        expect(verdict.label).toBe('Breathing Room');
    });

    it('Day 75 + queue kosong + energy max → crisis (uncapped)', () => {
        const verdict = evaluateDirectorState({
            day: 75,
            queueLength: 0,
            emergencyQueueLength: 0,
            energy: 100,
            reputation: 90,
            activeOutbreakCount: 0,
            casesToday: 0,
        });
        expect(verdict.profile).toBe(PACING_PROFILES.crisis);
    });
});
