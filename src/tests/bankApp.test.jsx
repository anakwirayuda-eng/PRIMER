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

    it('uses explicit cycle receipts instead of active kapitasi balance for jaspel', () => {
        mockUseGame.mockReturnValue({
            stats: {
                pendapatanUmum: 125000,
                kapitasi: 50000000,
                currentCycleReceipts: 300000
            },
            monthlyArchive: [],
            playerStats: {
                name: 'Dokter Test'
            }
        });

        render(<BankApp />);

        expect(screen.getByText('+Rp 120.000')).toBeInTheDocument();
        expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    });

    it('does not fall back to kapitasi when no receipt metric is available', () => {
        mockUseGame.mockReturnValue({
            stats: {
                pendapatanUmum: 125000,
                kapitasi: 50000000
            },
            monthlyArchive: [],
            playerStats: {
                name: 'Dokter Test'
            }
        });

        render(<BankApp />);

        expect(screen.getByText('+Rp 0')).toBeInTheDocument();
        expect(screen.queryByText('+Rp 20.000.000')).not.toBeInTheDocument();
    });

    it('keeps personal balance separate from clinic operational funds', () => {
        mockUseGame.mockReturnValue({
            stats: {
                pendapatanUmum: 90000000,
                kapitasi: 50000000
            },
            monthlyArchive: [],
            playerStats: {
                name: 'Dokter Test'
            }
        });

        render(<BankApp />);

        expect(screen.getByText('Rp 4.485.000')).toBeInTheDocument();
        expect(screen.getByText(/Dana klinik tetap dihitung terpisah/i)).toBeInTheDocument();
        expect(screen.queryByText('Rp 90.000.000')).not.toBeInTheDocument();
    });
});
