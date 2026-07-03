import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let gameState;

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => gameState
}));

import OutbreakModal from '../components/OutbreakModal.jsx';

function buildGameState(overrides = {}) {
    return {
        outbreakNotification: {
            id: 'outbreak-1',
            type: 'dengue',
            typeData: {
                color: 'red',
                icon: '!',
                name: 'DBD',
                xpReward: 50,
                reputationReward: 2
            },
            caseCount: 6,
            affectedHouseIds: ['kk-1', 'kk-2'],
            expiresOnDay: 3,
            resolutionProgress: 40,
            resolved: false,
            actionsPerformed: []
        },
        dismissOutbreakNotification: vi.fn(),
        respondToOutbreak: vi.fn(() => ({ success: true, message: 'Fogging berhasil.' })),
        getOutbreakActions: vi.fn(() => ([
            {
                id: 'fogging',
                name: 'Fogging',
                description: 'Lakukan fogging fokus.',
                icon: 'F',
                energyCost: 10,
                timeCost: 30,
                effectiveness: 0.5
            }
        ])),
        playerStats: { energy: 100 },
        ...overrides
    };
}

describe('OutbreakModal', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        gameState = buildGameState();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('auto-dismisses after the outbreak resolves on a later render', () => {
        const onClose = vi.fn();
        const { rerender } = render(<OutbreakModal isOpen onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: /fogging/i }));

        expect(gameState.respondToOutbreak).toHaveBeenCalledWith('outbreak-1', 'fogging');
        expect(onClose).not.toHaveBeenCalled();

        gameState = buildGameState({
            dismissOutbreakNotification: gameState.dismissOutbreakNotification,
            respondToOutbreak: gameState.respondToOutbreak,
            getOutbreakActions: gameState.getOutbreakActions,
            outbreakNotification: {
                ...gameState.outbreakNotification,
                resolved: true,
                resolutionProgress: 100,
                actionsPerformed: ['fogging']
            }
        });

        rerender(<OutbreakModal isOpen onClose={onClose} />);

        act(() => {
            vi.advanceTimersByTime(1999);
        });

        expect(gameState.dismissOutbreakNotification).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(gameState.dismissOutbreakNotification).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('clears the pending auto-dismiss timer on unmount', () => {
        const onClose = vi.fn();
        const { rerender, unmount } = render(<OutbreakModal isOpen onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: /fogging/i }));

        gameState = buildGameState({
            dismissOutbreakNotification: gameState.dismissOutbreakNotification,
            respondToOutbreak: gameState.respondToOutbreak,
            getOutbreakActions: gameState.getOutbreakActions,
            outbreakNotification: {
                ...gameState.outbreakNotification,
                resolved: true,
                resolutionProgress: 100,
                actionsPerformed: ['fogging']
            }
        });

        rerender(<OutbreakModal isOpen onClose={onClose} />);
        unmount();

        expect(vi.getTimerCount()).toBe(0);

        act(() => {
            vi.runAllTimers();
        });

        expect(gameState.dismissOutbreakNotification).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });
});
