import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../utils/prophylaxis.js', () => ({
    guardStability: vi.fn()
}));

import GedungPage from '../components/GedungPage.jsx';

describe('GedungPage', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('shows pooled operational funds as Dana Aktif', () => {
        mockUseGame.mockReturnValue({
            stats: {
                pendapatanUmum: 0,
                kapitasi: 500000,
                availableFunds: 500000
            },
            facilities: {},
            upgradeFacility: vi.fn(),
            openWiki: vi.fn()
        });

        render(<GedungPage />);

        expect(screen.getByText('Dana Aktif')).toBeInTheDocument();
        expect(screen.getByText('Rp 0.5M')).toBeInTheDocument();
    });
});
