import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import PosyanduActivePanel from '../components/wilayah/PosyanduActivePanel.jsx';
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

vi.mock('../game/kia/GrowthChartEngine.js', () => ({
    generateKMSData: vi.fn(() => ({
        referenceLines: {
            median: [{ age: 9, weight: 8.5 }],
            plus1: [{ age: 9, weight: 9 }],
            plus2: [{ age: 9, weight: 9.5 }],
            minus1: [{ age: 9, weight: 8 }],
            minus2: [{ age: 9, weight: 7.5 }],
            minus3: [{ age: 9, weight: 7 }]
        },
        actualPoints: [{ age: 9, weight: 8.5 }]
    })),
    plotGrowthPoint: vi.fn(() => ({ category: 'gizi_baik' })),
    detectGrowthFaltering: vi.fn(() => ({ isFlat: false, isFalling: false }))
}));

vi.mock('../game/kia/ImmunizationEngine.js', () => ({
    processImmunization: vi.fn(() => ({ success: true, feedback: 'OK', xp: 5 }))
}));

describe('Posyandu Mandiri XP Aura', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.advanceTimersByTime(1000);
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    const initialBabies = [{
        id: 'baby-1',
        name: 'Bayi Uji',
        ageMonths: 9,
        gender: 'L',
        familyId: 'fam-1',
        familyName: 'Uji',
        weight: 8.5,
        height: 70,
        growthHistory: [],
        completedVaccines: [],
        complaint: 'Kontrol rutin'
    }];

    const completeSuccessfulSession = async () => {
        fireEvent.click(screen.getByRole('button', { name: /periksa/i }));
        fireEvent.click(screen.getByRole('button', { name: /\[\s*gizi baik\s*\]/i }));
        fireEvent.click(screen.getByRole('button', { name: /sahkan & lanjut meja 5/i }));
        fireEvent.click(screen.getByRole('button', { name: /tunda vaksin/i }));
        fireEvent.click(screen.getByRole('button', { name: /selesaikan exam/i }));
    };

    it('grants xp aura bonus when the session upgrades posyandu to mandiri', async () => {
        useGameStore.setState(state => ({
            publicHealth: {
                ...state.publicHealth,
                buildingProgress: {
                    ...state.publicHealth.buildingProgress,
                    posyandu: { successStreak: 2, isUpgraded: false }
                }
            }
        }));

        const onComplete = vi.fn();
        render(<PosyanduActivePanel initialBabies={initialBabies} onClose={vi.fn()} onComplete={onComplete} />);

        await completeSuccessfulSession();

        expect(screen.getByText(/Aura Mandiri \+20 XP/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /tutup logbook/i }));

        expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({
            totalXP: 65,
            xpBonus: 20,
            auraBuff: 'xp_posyandu'
        }));
        expect(useGameStore.getState().publicHealth.buildingProgress.posyandu).toMatchObject({
            isUpgraded: true,
            successStreak: 3
        });
    });

    it('does not grant aura bonus before mandiri threshold is reached', async () => {
        useGameStore.setState(state => ({
            publicHealth: {
                ...state.publicHealth,
                buildingProgress: {
                    ...state.publicHealth.buildingProgress,
                    posyandu: { successStreak: 0, isUpgraded: false }
                }
            }
        }));

        const onComplete = vi.fn();
        render(<PosyanduActivePanel initialBabies={initialBabies} onClose={vi.fn()} onComplete={onComplete} />);

        await completeSuccessfulSession();

        expect(screen.queryByText(/Aura Mandiri \+20 XP/i)).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /tutup logbook/i }));

        expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({
            totalXP: 45,
            xpBonus: 0,
            auraBuff: null
        }));
    });
});
