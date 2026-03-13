import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

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
import { selectPlayerStats } from '../store/selectors.js';
import { safeSetStorageItem } from '../utils/browserSafety.js';
import { parseSavePayload } from '../utils/savePayload.js';
import { MEDICATION_DATABASE } from '../data/MedicationDatabase.js';

describe('store prophylaxis', () => {
    beforeEach(() => {
        const initialState = useGameStore.getInitialState();
        useGameStore.setState(initialState, true);
        safeSetStorageItem.mockReset();
        safeSetStorageItem.mockReturnValue(true);
        vi.useRealTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('caps clinical history at 200 newest entries when patients are discharged', () => {
        useGameStore.setState(state => ({
            clinical: {
                ...state.clinical,
                history: Array.from({ length: 200 }, (_, index) => ({
                    id: `hist-${index}`,
                    day: 1
                }))
            }
        }));

        const patient = {
            id: 'p-new',
            name: 'Test Patient',
            social: { hasBPJS: true },
            hidden: { requiredAction: 'treat' },
            medicalData: {
                correctTreatment: ['paracetamol'],
                trueDiagnosisCode: 'J00'
            }
        };

        const decision = {
            action: 'treat',
            medications: ['paracetamol'],
            diagnoses: ['J00'],
            anamnesisScore: 80,
            education: ['rest']
        };

        act(() => {
            useGameStore.getState().clinicalActions.dischargePatient(patient, decision, 1, 600);
        });

        const history = useGameStore.getState().clinical.history;
        expect(history).toHaveLength(200);
        expect(history[0].id).toBe('hist-1');
        expect(history.at(-1).id).toBe('p-new');
    });

    it('restores seeded pharmacy inventory when the game is fully reset', () => {
        useGameStore.setState(state => ({
            finance: {
                ...state.finance,
                pharmacyInventory: []
            }
        }));

        act(() => {
            useGameStore.getState().actions.resetGame();
        });

        const inventory = useGameStore.getState().finance.pharmacyInventory;
        expect(inventory).toHaveLength(MEDICATION_DATABASE.length);
        expect(inventory[0]).toMatchObject({
            medicationId: MEDICATION_DATABASE[0].id,
            stock: Math.floor(MEDICATION_DATABASE[0].minStock * 1.5),
            lastRestockDay: 0
        });
    });

    it('freezes the game before day rollover when preflight autosave fails', () => {
        safeSetStorageItem.mockReturnValueOnce(false);

        useGameStore.setState(state => ({
            nav: { ...state.nav, currentSlotId: 0, gameState: 'playing' },
            world: { ...state.world, day: 5, time: 1439, isPaused: false },
            meta: { ...state.meta, runtimeTrap: null },
            clinical: { ...state.clinical, gameOver: null }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().actions.nextDay(5);
        });

        const state = useGameStore.getState();
        expect(result).toBe(false);
        expect(state.world.day).toBe(5);
        expect(state.nav.gameState).toBe('paused');
        expect(state.world.isPaused).toBe(true);
        expect(state.clinical.gameOver?.type).toBe('runtime_trap');
        expect(state.meta.runtimeTrap?.phase).toBe('autosave_preflight');
    });

    it('freezes the game if the post-rollover autosave fails', () => {
        vi.useFakeTimers();
        safeSetStorageItem.mockReturnValueOnce(true).mockReturnValueOnce(false);

        useGameStore.setState(state => ({
            nav: { ...state.nav, currentSlotId: 0, gameState: 'playing' },
            world: { ...state.world, day: 2, time: 1439, isPaused: false },
            meta: { ...state.meta, runtimeTrap: null },
            clinical: { ...state.clinical, gameOver: null }
        }));

        act(() => {
            useGameStore.getState().actions.nextDay(2);
        });

        expect(useGameStore.getState().world.day).toBe(3);
        expect(useGameStore.getState().meta.runtimeTrap).toBeNull();

        act(() => {
            vi.runAllTimers();
        });

        const state = useGameStore.getState();
        expect(state.nav.gameState).toBe('paused');
        expect(state.world.isPaused).toBe(true);
        expect(state.clinical.gameOver?.type).toBe('runtime_trap');
        expect(state.meta.runtimeTrap?.phase).toBe('autosave_postshift');
    });

    it('derives current-level XP progress and next level target from the leveling helper', () => {
        const selected = selectPlayerStats({
            player: {
                profile: {
                    level: 3,
                    xp: 2300,
                    energy: 80
                }
            }
        });

        expect(selected.totalXp).toBe(2300);
        expect(selected.nextLevelXp).toBe(1000);
        expect(selected.xp).toBe(300);
    });

    it('trims oversized clinical history during save payload normalization', () => {
        const parsed = parseSavePayload({
            clinical: {
                history: Array.from({ length: 240 }, (_, index) => ({ id: `hist-${index}` }))
            }
        });

        expect(parsed.clinical.history).toHaveLength(200);
        expect(parsed.clinical.history[0].id).toBe('hist-40');
    });
});
