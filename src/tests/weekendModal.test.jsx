import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

import WeekendModal from '../components/WeekendModal.jsx';

function createGameContext(overrides = {}) {
    return {
        playerStats: {
            stress: 40,
            knowledge: 20
        },
        stats: {
            pendapatanUmum: 100000,
            kapitasi: 0
        },
        day: 6,
        performWeekendActivity: undefined,
        ...overrides
    };
}

describe('WeekendModal', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('shows a clear warning and disables execution when weekend engine is unavailable', async () => {
        mockUseGame.mockReturnValue(createGameContext());

        const user = userEvent.setup();
        render(<WeekendModal />);

        expect(screen.getByText(/mode akhir pekan belum aktif di build ini/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /Istirahat Total/i }));

        expect(screen.getByRole('button', { name: /Mode Belum Aktif/i })).toBeDisabled();
    });

    it('uses pooled operational funds for paid weekend activities when backend action exists', async () => {
        const performWeekendActivity = vi.fn();

        mockUseGame.mockReturnValue(createGameContext({
            stats: {
                pendapatanUmum: 100000,
                kapitasi: 500000
            },
            performWeekendActivity
        }));

        const user = userEvent.setup();
        render(<WeekendModal />);

        await user.click(screen.getByRole('button', { name: /Liburan Singkat/i }));
        await user.click(screen.getByRole('button', { name: /Mulai Aktivitas/i }));

        expect(screen.getByText(/Dana Aktif/i)).toBeInTheDocument();
        expect(screen.getByText(/Rp 600.000/i)).toBeInTheDocument();
        expect(performWeekendActivity).toHaveBeenCalledWith(expect.objectContaining({
            id: 'recreation',
            cost: 500000
        }));
    });
});
