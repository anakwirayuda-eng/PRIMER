import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

import BankApp from '../components/apps/BankApp.jsx';

describe('BankApp', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('falls back to kapitasi when pendapatanJkn is unavailable', () => {
        mockUseGame.mockReturnValue({
            stats: {
                pendapatanUmum: 125000,
                kapitasi: 50000000
            },
            playerStats: {
                name: 'Dokter Test'
            }
        });

        render(<BankApp />);

        expect(screen.getByText('+Rp 20.000.000')).toBeInTheDocument();
        expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    });
});
