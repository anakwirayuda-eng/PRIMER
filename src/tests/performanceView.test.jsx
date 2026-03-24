import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

import PerformanceView from '../components/dashboard/PerformanceView.jsx';

describe('PerformanceView finance semantics', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('labels current balances as operational funds and uses availableFunds for saldo widgets', () => {
        mockUseGame.mockReturnValue({
            stats: {
                kapitasi: 50_000_000,
                pendapatanUmum: 200_000
            },
            kpi: {
                totalPatients: 20
            },
            derivedKpis: {
                rrns: 4,
                availableFunds: 50_200_000,
                netBalance: 49_900_000
            },
            villageData: { stats: { totalPopulation: 1000 } },
            prolanisRoster: [],
            day: 30
        });

        render(<PerformanceView onBack={() => {}} openWiki={() => {}} />);

        expect(screen.getByText('Sumber Dana Operasional')).toBeInTheDocument();
        expect(screen.getByText('Dana Aktif')).toBeInTheDocument();
        expect(screen.getByText('Rp 50.2M')).toBeInTheDocument();
    });
});
