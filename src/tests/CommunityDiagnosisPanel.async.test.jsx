import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let gameState;

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => gameState
}));

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playClick: vi.fn(),
        playNotification: vi.fn(),
        playSuccess: vi.fn(),
        playError: vi.fn()
    }
}));

vi.mock('../content/scenarios/IKMScenarioLibrary.js', () => ({
    getScenarioById: vi.fn(() => ({
        phases: [
            {
                id: 'diagnosis',
                type: 'diagnosisQnA',
                question: 'Apa masalah utama di desa ini?',
                nextPhase: 'resolution',
                choices: [
                    {
                        text: 'Diare terkait air tercemar',
                        isCorrect: true,
                        feedback: 'Analisis sesuai data lapangan.'
                    },
                    {
                        text: 'Stres kerja massal',
                        isCorrect: false,
                        feedback: 'Belum didukung data lapangan.'
                    }
                ]
            }
        ]
    }))
}));

vi.mock('../components/wilayah/EliteCOMBWheel.jsx', () => ({
    default: () => <div>COMB Wheel</div>
}));

import CommunityDiagnosisPanel from '../components/wilayah/CommunityDiagnosisPanel.jsx';

function buildEventInstance() {
    return {
        instanceId: 'ikm-1',
        scenarioId: 'scenario-1',
        currentPhaseId: 'diagnosis',
        icon: '!',
        title: 'KLB Diare',
        completed: false
    };
}

describe('CommunityDiagnosisPanel', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        gameState = {
            advanceIKMPhase: vi.fn(() => ({ success: true })),
            resolveIKMEvent: vi.fn(),
            stats: { availableFunds: 100000 }
        };
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('cancels pending diagnosis timers when the panel unmounts', () => {
        const eventInstance = buildEventInstance();
        const { unmount } = render(
            <CommunityDiagnosisPanel eventInstance={eventInstance} onClose={() => {}} />
        );

        fireEvent.click(screen.getByText('Diare terkait air tercemar'));
        fireEvent.click(screen.getByRole('button', { name: /tetapkan diagnosis/i }));

        expect(screen.getByRole('button', { name: /menganalisis/i })).toBeInTheDocument();

        unmount();

        expect(vi.getTimerCount()).toBe(0);

        act(() => {
            vi.runAllTimers();
        });

        expect(gameState.advanceIKMPhase).not.toHaveBeenCalled();
    });
});
