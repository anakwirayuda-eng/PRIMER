import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

import DiklatPage from '../components/DiklatPage.jsx';

function createGameContext(overrides = {}) {
    return {
        playerStats: {
            xp: 20,
            level: 1,
            nextLevelXp: 1000,
            completedWorkshops: []
        },
        skills: [],
        unlockSkill: vi.fn(() => true),
        addXp: vi.fn(),
        stats: { pendapatanUmum: 600_000 },
        setStats: vi.fn(),
        setPlayerProfile: vi.fn(),
        ...overrides
    };
}

describe('DiklatPage', () => {
    beforeEach(() => {
        vi.stubGlobal('alert', vi.fn());
    });

    afterEach(() => {
        mockUseGame.mockReset();
        vi.unstubAllGlobals();
    });

    it('completes a paid workshop, deducts funds, awards xp, and records completion', async () => {
        const addXp = vi.fn();
        const setStats = vi.fn();
        const setPlayerProfile = vi.fn();

        mockUseGame.mockReturnValue(createGameContext({
            addXp,
            setStats,
            setPlayerProfile
        }));

        const user = userEvent.setup();
        render(<DiklatPage />);

        await user.click(screen.getByRole('button', { name: /Workshop/i }));
        await user.click(screen.getByRole('button', { name: /Rp 500K/i }));

        expect(addXp).toHaveBeenCalledWith(100);
        expect(setStats).toHaveBeenCalledTimes(1);
        expect(setPlayerProfile).toHaveBeenCalledTimes(1);

        const statsUpdater = setStats.mock.calls[0][0];
        expect(statsUpdater({ pendapatanUmum: 600_000 })).toEqual({ pendapatanUmum: 100_000 });

        const profileUpdater = setPlayerProfile.mock.calls[0][0];
        expect(profileUpdater({ completedWorkshops: [] }).completedWorkshops).toEqual([2]);
    });

    it('shows completed workshops as finished and non-interactive', async () => {
        mockUseGame.mockReturnValue(createGameContext({
            playerStats: {
                xp: 20,
                level: 1,
                nextLevelXp: 1000,
                completedWorkshops: [2]
            }
        }));

        const user = userEvent.setup();
        render(<DiklatPage />);

        await user.click(screen.getByRole('button', { name: /Workshop/i }));

        expect(screen.getByRole('button', { name: /Selesai/i })).toBeDisabled();
    });
});
