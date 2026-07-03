import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import MiniGamePanel from '../components/wilayah/MiniGamePanel.jsx';

function buildHiddenObjectGame() {
    return {
        id: 'audit-1',
        title: 'Audit Sanitasi',
        gameType: 'hidden_object',
        timeLimit: 1,
        scenes: {
            general: {
                hazards: [
                    { id: 'hazard-1', label: 'Genangan Air', x: 20, y: 20, type: 'water' }
                ],
                fakeItems: []
            }
        }
    };
}

function buildExpressionGame(id, npcLine, correctRead, followUp, options) {
    return {
        id,
        title: `Ekspresi ${id}`,
        gameType: 'expression_reading',
        expressions: [
            {
                emoji: '🙂',
                npcLine,
                correctRead,
                options,
                followUp
            }
        ]
    };
}

function buildCardMatchingGame() {
    return {
        id: 'rtl-1',
        title: 'RTL Lintas Sektor',
        gameType: 'card_matching',
        cards: [
            {
                id: 'card-1',
                label: 'Kunjungan Rumah',
                icon: '🏠',
                matchBarriers: ['cap_phy']
            }
        ],
        distractors: []
    };
}

describe('MiniGamePanel lifecycle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('cancels delayed hidden-object completion when the panel unmounts', () => {
        const onComplete = vi.fn();
        const { unmount } = render(
            <MiniGamePanel game={buildHiddenObjectGame()} onComplete={onComplete} />
        );

        act(() => {
            vi.advanceTimersByTime(1001);
        });

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(vi.getTimerCount()).toBeGreaterThan(0);

        unmount();

        expect(vi.getTimerCount()).toBe(0);

        act(() => {
            vi.runAllTimers();
        });

        expect(onComplete).not.toHaveBeenCalled();
    });

    it('resets expression-reading state when a new session with the same game type is mounted', () => {
        const onComplete = vi.fn();
        const gameA = buildExpressionGame(
            'expr-a',
            'Saya takut biaya obatnya mahal.',
            'Takut biaya',
            'Insight lama',
            ['Takut biaya', 'Tidak percaya']
        );
        const gameB = buildExpressionGame(
            'expr-b',
            'Saya belum paham jadwal minumnya.',
            'Kurang paham',
            'Insight baru',
            ['Kurang paham', 'Sudah paham']
        );

        const { rerender } = render(
            <MiniGamePanel game={gameA} onComplete={onComplete} />
        );

        fireEvent.click(screen.getByRole('button', { name: /takut biaya/i }));
        expect(screen.getByText('Insight lama')).toBeInTheDocument();

        rerender(<MiniGamePanel game={gameB} onComplete={onComplete} />);

        expect(screen.queryByText('Insight lama')).not.toBeInTheDocument();
        expect(screen.getByText(/saya belum paham jadwal minumnya/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /kurang paham/i })).not.toBeDisabled();
    });

    it('cancels delayed card-matching completion when the panel unmounts', () => {
        const onComplete = vi.fn();
        const { unmount } = render(
            <MiniGamePanel
                game={buildCardMatchingGame()}
                activeBarriers={{ cap_phy: 1 }}
                onComplete={onComplete}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /kunjungan rumah/i }));
        fireEvent.click(screen.getByRole('button', { name: /kapabilitas fisik/i }));
        fireEvent.click(screen.getByRole('button', { name: /sahkan rtl lintas sektor/i }));

        expect(vi.getTimerCount()).toBeGreaterThan(0);

        unmount();

        expect(vi.getTimerCount()).toBe(0);

        act(() => {
            vi.runAllTimers();
        });

        expect(onComplete).not.toHaveBeenCalled();
    });
});
