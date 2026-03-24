import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CURRENT_SAVE_VERSION } from '../utils/savePayload.js';
import { useGameStore } from '../store/useGameStore.js';

const { showToast } = vi.hoisted(() => ({
    showToast: vi.fn()
}));

vi.mock('../utils/ToastManager.js', () => ({
    showToast: (...args) => showToast(...args),
    confirmToast: vi.fn()
}));

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn()
    }
}));

describe('referral lifecycle integration', () => {
    beforeEach(() => {
        showToast.mockReset();
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    it('reconciles stale EN_ROUTE referral logs during loadGame', () => {
        const didLoad = useGameStore.getState().actions.loadGame({
            saveVersion: CURRENT_SAVE_VERSION,
            world: { day: 3, time: 600 },
            clinical: {
                activeReferralLog: [
                    {
                        id: 'ref-stale',
                        patientId: 'p-1',
                        patientName: 'Rina',
                        hospitalName: 'RSUD Kota',
                        distance: 10,
                        ambulanceType: 'Advance',
                        sentDay: 3,
                        timeSent: 480,
                        status: 'EN_ROUTE'
                    }
                ]
            }
        }, 'slot-test');

        expect(didLoad).toBe(true);
        expect(useGameStore.getState().clinical.activeReferralLog[0].status).toBe('ARRIVED');
    });

    it('marks overdue referrals as ARRIVED on tick, emits a toast, then auto-clears them later', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 1, time: 1000 },
            publicHealth: { ...state.publicHealth, villageData: null, activeOutbreaks: [] },
            clinical: {
                ...state.clinical,
                queue: [],
                emergencyQueue: [],
                activeReferralLog: [
                    {
                        id: 'ref-live',
                        patientId: 'p-2',
                        patientName: 'Budi',
                        hospitalName: 'RS Harapan',
                        distance: 8,
                        ambulanceType: 'Advance',
                        sentDay: 1,
                        timeSent: 480,
                        status: 'EN_ROUTE'
                    }
                ]
            }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.processDailyTick();
        });

        let activeReferralLog = useGameStore.getState().clinical.activeReferralLog;
        expect(activeReferralLog).toHaveLength(1);
        expect(activeReferralLog[0].status).toBe('ARRIVED');
        expect(showToast).toHaveBeenCalledWith(
            expect.stringContaining('diterima di RS Harapan'),
            'success',
            4200
        );

        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 1, time: 1100 }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.processDailyTick();
        });

        activeReferralLog = useGameStore.getState().clinical.activeReferralLog;
        expect(activeReferralLog).toHaveLength(0);
    });
});
