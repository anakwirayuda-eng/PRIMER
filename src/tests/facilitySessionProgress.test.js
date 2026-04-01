import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn()
    }
}));

vi.mock('../utils/prophylaxis.js', () => ({
    guardStability: () => true
}));

vi.mock('../utils/dispatchGuard.js', () => ({
    dispatchGuard: (name, fn) => fn,
    guardActionGroup: (name, group) => group,
    triggerFreezeProtocol: vi.fn(),
    buildRuntimeTrap: vi.fn()
}));

describe('Facility Session Progress Runtime', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.advanceTimersByTime(1000);
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    const runSession = (buildingType, sessionSummary) => (
        useGameStore.getState().publicHealthActions.recordFacilitySessionProgress(buildingType, sessionSummary)
    );

    const successfulSession = {
        sessionLog: [{ patient: { id: 'p1' }, score: 90 }],
        malpracticeCount: 0
    };

    const failedSession = {
        sessionLog: [{ patient: { id: 'p1' }, score: 20 }],
        malpracticeCount: 1
    };

    it('upgrades posyandu after 3 consecutive successful sessions', () => {
        runSession('posyandu', successfulSession);
        runSession('posyandu', successfulSession);
        const finalState = runSession('posyandu', successfulSession);

        expect(finalState).toMatchObject({
            successStreak: 3,
            currentStreak: 3,
            isUpgraded: true,
            completed: true,
            remainingToUpgrade: 0
        });
        expect(useGameStore.getState().publicHealth.buildingProgress.posyandu).toMatchObject({
            successStreak: 3,
            isUpgraded: true
        });
    });

    it('resets posyandu streak on failed session', () => {
        runSession('posyandu', successfulSession);
        runSession('posyandu', successfulSession);
        const finalState = runSession('posyandu', failedSession);

        expect(finalState).toMatchObject({
            successStreak: 0,
            currentStreak: 0,
            isUpgraded: false,
            completed: false,
            remainingToUpgrade: 3,
            lastSessionSuccessful: false
        });
    });

    it('levels pustu up to level 2 and unlocks services on successful sessions', () => {
        const levelOne = runSession('pustu', successfulSession);
        const levelTwo = runSession('pustu', successfulSession);
        const capped = runSession('pustu', successfulSession);

        expect(levelOne).toMatchObject({
            level: 1,
            completed: true,
            isActive: true,
            availableServices: []
        });
        expect(levelTwo).toMatchObject({
            level: 2,
            completed: true,
            isActive: true,
            availableServices: ['anc_kia', 'pengobatan_dasar']
        });
        expect(capped.level).toBe(2);
    });

    it('tracks polindes progress separately from pustu', () => {
        runSession('pustu', successfulSession);
        const polindes = runSession('polindes', successfulSession);
        const state = useGameStore.getState().publicHealth.buildingProgress;

        expect(state.pustu).toMatchObject({ level: 1 });
        expect(polindes).toMatchObject({ level: 1 });
        expect(state.polindes).toMatchObject({ level: 1 });
        expect(state.polindes).not.toBe(state.pustu);
    });

    it('ignores unsupported facility types safely', () => {
        const before = useGameStore.getState().publicHealth.buildingProgress;
        const result = runSession('mck', successfulSession);
        const after = useGameStore.getState().publicHealth.buildingProgress;

        expect(result).toBeNull();
        expect(after).toBe(before);
    });
});
