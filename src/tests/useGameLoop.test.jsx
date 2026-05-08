import React, { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playError: vi.fn()
    }
}));

vi.mock('../diagnostics/invariants.js', () => ({
    checkInvariants: () => []
}));

vi.mock('../store/useGameStore.js', () => ({
    useGameStore: {
        getState: () => ({})
    }
}));

vi.mock('../utils/prophylaxis.js', () => ({
    guardStability: () => true
}));

import { useGameLoop } from '../hooks/useGameLoop.js';

function LoopHarness({ speed = 1, processTick = () => {} }) {
    const [time, setTime] = useState(480);
    const [playerStats, setPlayerStats] = useState({ energy: 100, spirit: 100 });
    const [nextDay] = useState(() => vi.fn());
    const [setGameOverMock] = useState(() => vi.fn());

    useGameLoop({
        gameState: 'playing',
        gameSpeed: speed,
        gameOver: null,
        time,
        day: 1,
        buffs: {},
        villageData: { families: [] },
        activeOutbreaks: [],
        facilities: {},
        skills: {},
        playerStats,
        nextDay,
        setPlayerStats,
        setGameOver: setGameOverMock,
        setTime,
        processTick
    });

    return <div data-testid="clock">{String(time)}</div>;
}

describe('useGameLoop clinical cadence', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    function advanceInSteps(totalMs, stepMs = 250) {
        for (let elapsed = 0; elapsed < totalMs; elapsed += stepMs) {
            act(() => {
                vi.advanceTimersByTime(stepMs);
            });
        }
    }

    it('processes clinical logic once per in-game minute at 1x speed', () => {
        vi.useFakeTimers();
        const processTick = vi.fn();

        render(<LoopHarness processTick={processTick} />);

        advanceInSteps(1000);

        expect(processTick).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('clock')).toHaveTextContent('481');
    });

    it('keeps the same minute cadence when the game runs at 2x speed', () => {
        vi.useFakeTimers();
        const processTick = vi.fn();

        render(<LoopHarness speed={2} processTick={processTick} />);

        advanceInSteps(1000);

        expect(processTick).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId('clock')).toHaveTextContent('482');
    });
});
