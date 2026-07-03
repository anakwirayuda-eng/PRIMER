import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn()
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
import { safeSetStorageItem } from '../utils/browserSafety.js';

describe('RumahDinas sleep flow', () => {
    beforeEach(() => {
        const initialState = useGameStore.getInitialState();
        useGameStore.setState(initialState, true);
        safeSetStorageItem.mockReset();
        safeSetStorageItem.mockReturnValue(true);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('routes overnight sleep through next-day transition and wakes at the requested alarm hour', () => {
        useGameStore.setState(state => ({
            nav: {
                ...state.nav,
                currentSlotId: 0,
                gameState: 'playing'
            },
            world: {
                ...state.world,
                day: 4,
                time: 22 * 60,
                isPaused: false
            },
            clinical: {
                ...state.clinical,
                queue: [{ id: 'queue-1' }],
                todayLog: [{ id: 'log-1' }],
                showMorningBriefing: false,
                showEndOfDayDebrief: true
            },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 25,
                    maxEnergy: 88,
                    stress: 60,
                    morningStatus: null
                }
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().playerActions.sleepWithAlarm(5);
            vi.runAllTimers();
        });

        const state = useGameStore.getState();

        expect(result).toMatchObject({
            success: true,
            status: 'refreshed',
            wakeTime: 300,
            time: 300,
            isNextDay: true
        });
        expect(state.world.day).toBe(5);
        expect(state.world.time).toBe(300);
        expect(state.player.profile.energy).toBe(88);
        expect(state.player.profile.stress).toBe(30);
        expect(state.player.profile.morningStatus).toBe('refreshed');
        expect(state.clinical.showMorningBriefing).toBe(true);
        expect(state.clinical.showEndOfDayDebrief).toBe(false);
        expect(state.clinical.todayLog).toEqual([]);
    });

    it('converts stranded poli patients into missed encounters before overnight rollover archive', () => {
        useGameStore.setState(state => ({
            nav: {
                ...state.nav,
                currentSlotId: 0,
                gameState: 'playing'
            },
            world: {
                ...state.world,
                day: 4,
                time: 14 * 60,
                isPaused: false
            },
            clinical: {
                ...state.clinical,
                queue: [
                    {
                        id: 'queue-stranded-1',
                        name: 'Siti',
                        age: 29,
                        gender: 'P',
                        joinedAt: 13 * 60,
                        medicalData: {
                            trueDiagnosisCode: 'R50.9',
                            diagnosisName: 'Demam'
                        }
                    }
                ],
                activePatientId: 'queue-stranded-1',
                todayLog: [],
                showMorningBriefing: false,
                showEndOfDayDebrief: true
            },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    reputation: 80,
                    energy: 40,
                    maxEnergy: 90,
                    stress: 55,
                    morningStatus: null
                }
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().playerActions.sleepWithAlarm(5);
            vi.runAllTimers();
        });

        const state = useGameStore.getState();
        const archivedDay = state.clinical.dailyArchive.at(-1);

        expect(result?.success).toBe(true);
        expect(state.world.day).toBe(5);
        expect(state.clinical.queue).toEqual([]);
        expect(state.clinical.activePatientId).toBeNull();
        expect(state.player.profile.reputation).toBe(78.5);
        expect(archivedDay).toMatchObject({
            day: 4,
            patientsToday: 1,
            revenue: 0
        });
        expect(archivedDay.hourlyTraffic).toEqual(expect.arrayContaining([
            { label: '13:00', value: 1 }
        ]));
        expect(archivedDay.topDiseases[0]).toMatchObject({
            name: 'Demam',
            count: 1
        });
    });
});
