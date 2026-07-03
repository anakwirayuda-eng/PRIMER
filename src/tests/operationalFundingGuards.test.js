import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

vi.mock('../utils/browserSafety.js', async () => {
    const actual = await vi.importActual('../utils/browserSafety.js');
    return {
        ...actual,
        safeSetStorageItem: vi.fn(() => true)
    };
});

import { useGameStore } from '../store/useGameStore.js';

describe('operational funding guards', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    afterEach(() => {
        vi.useRealTimers();
        consoleErrorSpy?.mockRestore();
    });

    it('spends pooled operational funds for negative story balance choices', () => {
        const storyInstance = { templateId: 'cikapas_hysteria', instanceId: 'story-1', currentNodeId: 'start' };

        useGameStore.setState((state) => ({
            finance: {
                ...state.finance,
                stats: { ...state.finance.stats, pendapatanUmum: 0, kapitasi: 50_000_000 }
            },
            meta: {
                ...state.meta,
                activeStories: [storyInstance]
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().metaActions.advanceStory(storyInstance, {
                nextNode: 'team_sent',
                impact: { balance: -500_000 }
            });
        });

        const state = useGameStore.getState();
        expect(result).toMatchObject({ success: true });
        expect(state.finance.stats.pendapatanUmum).toBe(0);
        expect(state.finance.stats.kapitasi).toBe(49_500_000);
        expect(state.meta.activeStories[0].currentNodeId).toBe('team_sent');
    });

    it('rejects story choices when pooled operational funds are insufficient', () => {
        const storyInstance = { templateId: 'cikapas_hysteria', instanceId: 'story-2', currentNodeId: 'start' };

        useGameStore.setState((state) => ({
            finance: {
                ...state.finance,
                stats: { ...state.finance.stats, pendapatanUmum: 0, kapitasi: 100_000 }
            },
            meta: {
                ...state.meta,
                activeStories: [storyInstance]
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().metaActions.advanceStory(storyInstance, {
                nextNode: 'team_sent',
                impact: { balance: -500_000 }
            });
        });

        const state = useGameStore.getState();
        expect(result).toMatchObject({ success: false });
        expect(state.finance.stats.pendapatanUmum).toBe(0);
        expect(state.finance.stats.kapitasi).toBe(100_000);
        expect(state.meta.activeStories[0].currentNodeId).toBe('start');
    });

    it('allows facility upgrades against pooled funds and spends pendapatan umum before kapitasi', () => {
        const state = useGameStore.getState();
        const facilityId = Object.keys(state.finance.facilities)[0];

        useGameStore.setState((currentState) => ({
            finance: {
                ...currentState.finance,
                stats: { ...currentState.finance.stats, pendapatanUmum: 100_000, kapitasi: 500_000 },
                facilities: {
                    ...currentState.finance.facilities,
                    [facilityId]: 1
                }
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().financeActions.upgradeFacility(facilityId, 500_000);
        });

        const next = useGameStore.getState();
        expect(result).toBe(true);
        expect(next.finance.stats.pendapatanUmum).toBe(0);
        expect(next.finance.stats.kapitasi).toBe(100_000);
        expect(next.finance.facilities[facilityId]).toBe(2);
    });

    it('allows senam prolanis against pooled funds and spends kapitasi when needed', () => {
        const member = {
            id: 'prolanis-pooled',
            name: 'Pak Budi',
            prolanisData: {
                diseaseType: 'dm_type2',
                parameters: { gds: 210, gdp: 150, hba1c: 8.5 },
                history: [],
                consecutiveControlled: 0
            },
            complicationRisk: 30
        };

        useGameStore.setState((state) => ({
            world: { ...state.world, day: 31, time: 540 },
            finance: {
                ...state.finance,
                stats: { ...state.finance.stats, pendapatanUmum: 0, kapitasi: 500_000 }
            },
            publicHealth: {
                ...state.publicHealth,
                prolanisRoster: [member]
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().publicHealthActions.triggerSenamProlanis();
        });

        const next = useGameStore.getState();
        expect(result).toMatchObject({ success: true });
        expect(next.finance.stats.pendapatanUmum).toBe(0);
        expect(next.finance.stats.kapitasi).toBe(350_000);
        expect(next.publicHealth.prolanisState.lastSenamDay).toBe(31);
    });
});
