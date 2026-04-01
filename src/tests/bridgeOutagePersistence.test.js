import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';
import { isBridgeOutageActive, resolveBridgeOutageUntilDay } from '../domains/village/bridgeSeasonalState.js';
import { selectBridgeSeasonalState } from '../store/selectors.js';
import * as eventEngine from '../game/IKMEventEngine.js';
import * as randomUtils from '../utils/deterministicRandom.js';

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
    guardStability: () => true,
    clearStability: vi.fn()
}));

vi.mock('../utils/dispatchGuard.js', () => ({
    dispatchGuard: (name, fn) => fn,
    guardActionGroup: (name, group) => group,
    triggerFreezeProtocol: vi.fn(),
    buildRuntimeTrap: vi.fn()
}));

describe('Bridge outage persistence', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    it('extends outage through three days when extreme rain triggers', () => {
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
        vi.spyOn(randomUtils, 'chanceFromSeed').mockReturnValue(true);

        expect(resolveBridgeOutageUntilDay(42, 0)).toBe(44);
    });

    it('keeps selector in putus state while persisted outage is still active', () => {
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('dry');

        const result = selectBridgeSeasonalState({
            world: { day: 43 },
            publicHealth: { bridgeOutageUntilDay: 44 }
        });

        expect(result.status).toBe('putus');
        expect(result.isIsolated).toBe(true);
    });

    it('returns to seasonal baseline after persisted outage window ends', () => {
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('dry');

        const result = selectBridgeSeasonalState({
            world: { day: 45 },
            publicHealth: { bridgeOutageUntilDay: 44 }
        });

        expect(result.status).toBe('normal');
        expect(isBridgeOutageActive(45, 44)).toBe(false);
    });

    it('processDailyPublicHealth persists outage until day 3 even after next day is calm', () => {
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
        vi.spyOn(randomUtils, 'chanceFromSeed')
            .mockReturnValueOnce(true)
            .mockReturnValue(false);

        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                villageData: { families: [] }
            }
        }));

        useGameStore.getState().publicHealthActions.processDailyPublicHealth(42, []);
        expect(useGameStore.getState().publicHealth.bridgeOutageUntilDay).toBe(44);

        useGameStore.getState().publicHealthActions.processDailyPublicHealth(43, []);
        expect(useGameStore.getState().publicHealth.bridgeOutageUntilDay).toBe(44);
    });

    it('resetPublicHealth clears persisted outage state', () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 44
            }
        }));

        useGameStore.getState().publicHealthActions.resetPublicHealth();
        expect(useGameStore.getState().publicHealth.bridgeOutageUntilDay).toBe(0);
    });
});
