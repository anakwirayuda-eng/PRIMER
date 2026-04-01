import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn()
    }
}));

import { useGameStore } from '../store/useGameStore.js';
import { isBridgeOutageActive } from '../domains/village/bridgeSeasonalState.js';
import { createInitialPublicHealthState, mergePersistedPublicHealth } from '../store/helpers/persistenceHelpers.js';
import { clearStability } from '../utils/prophylaxis.js';

describe('repairBridge action', () => {
    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
        clearStability('ACTION_publicHealthActions.repairBridge');
    });

    it('reduces outage by one day and deducts energy, time, and grants xp', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: {
                ...state.world,
                day: 10,
                time: 480
            },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 80,
                    xp: 0
                }
            },
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 12,
                lastBridgeRepairDay: -1
            }
        }));

        const beforeXp = useGameStore.getState().player.profile.xp;
        let result;
        act(() => {
            result = useGameStore.getState().publicHealthActions.repairBridge();
        });

        const state = useGameStore.getState();
        expect(result).toEqual(expect.objectContaining({
            success: true,
            bridgeOutageUntilDay: 11
        }));
        expect(state.publicHealth.bridgeOutageUntilDay).toBe(11);
        expect(state.publicHealth.lastBridgeRepairDay).toBe(10);
        expect(state.player.profile.energy).toBe(55);
        expect(state.world.time).toBe(540);
        expect(state.player.profile.xp).toBeGreaterThan(beforeXp);
    });

    it('fails safely when no outage is active', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 10, time: 480 },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 80,
                    xp: 0
                }
            },
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 9,
                lastBridgeRepairDay: -1
            }
        }));

        const before = useGameStore.getState();
        const result = useGameStore.getState().publicHealthActions.repairBridge();
        const after = useGameStore.getState();

        expect(result).toEqual(expect.objectContaining({ success: false }));
        expect(after.publicHealth.bridgeOutageUntilDay).toBe(before.publicHealth.bridgeOutageUntilDay);
        expect(after.publicHealth.lastBridgeRepairDay).toBe(before.publicHealth.lastBridgeRepairDay);
        expect(after.player.profile.energy).toBe(before.player.profile.energy);
        expect(after.world.time).toBe(before.world.time);
    });

    it('blocks repeat repairs on the same day', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 10, time: 480 },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 100
                }
            },
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 12,
                lastBridgeRepairDay: -1
            }
        }));

        act(() => {
            useGameStore.getState().publicHealthActions.repairBridge();
        });
        const afterFirst = useGameStore.getState();

        const secondResult = useGameStore.getState().publicHealthActions.repairBridge();
        const afterSecond = useGameStore.getState();

        expect(secondResult).toEqual(expect.objectContaining({
            success: false,
            message: 'Sudah dikerjakan hari ini.'
        }));
        expect(afterSecond.publicHealth.bridgeOutageUntilDay).toBe(afterFirst.publicHealth.bridgeOutageUntilDay);
        expect(afterSecond.player.profile.energy).toBe(afterFirst.player.profile.energy);
        expect(afterSecond.world.time).toBe(afterFirst.world.time);
    });

    it('blocks repair when energy is below the cost', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 10, time: 480 },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 24
                }
            },
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 12,
                lastBridgeRepairDay: -1
            }
        }));

        const result = useGameStore.getState().publicHealthActions.repairBridge();

        expect(result).toEqual(expect.objectContaining({
            success: false,
            message: 'Energi tidak cukup untuk koordinasi perbaikan jembatan.'
        }));
        expect(useGameStore.getState().publicHealth.bridgeOutageUntilDay).toBe(12);
    });

    it('can clear an outage on its final active day', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 10, time: 480 },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 60
                }
            },
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 10,
                lastBridgeRepairDay: -1
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().publicHealthActions.repairBridge();
        });

        const state = useGameStore.getState();
        expect(result).toEqual(expect.objectContaining({
            success: true,
            bridgeOutageUntilDay: 9
        }));
        expect(isBridgeOutageActive(10, state.publicHealth.bridgeOutageUntilDay)).toBe(false);
    });

    it('backfills lastBridgeRepairDay safely for legacy saves', () => {
        const merged = mergePersistedPublicHealth(
            { bridgeOutageUntilDay: 14 },
            createInitialPublicHealthState()
        );

        expect(merged.bridgeOutageUntilDay).toBe(14);
        expect(merged.lastBridgeRepairDay).toBe(-1);
    });
});
