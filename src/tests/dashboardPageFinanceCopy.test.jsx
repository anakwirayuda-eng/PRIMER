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

vi.mock('../components/dashboard/ClinicalView.jsx', () => ({ default: () => null }));
vi.mock('../components/dashboard/CommunityView.jsx', () => ({ default: () => null }));
vi.mock('../components/dashboard/PerformanceView.jsx', () => ({ default: () => null }));
vi.mock('../components/dashboard/AccreditationView.jsx', () => ({ default: () => null }));
vi.mock('../components/dashboard/LogisticsView.jsx', () => ({ default: () => null }));

import DashboardPage from '../components/DashboardPage.jsx';

describe('DashboardPage finance wording', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('uses operational fund wording and available funds in the performance hub card', () => {
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
                overallScore: 88,
                clinicalAccuracy: 90,
                availableFunds: 50_200_000
            },
            accreditation: 'Utama',
            day: 30,
            villageData: { families: [], stats: { totalPopulation: 1000 } },
            activeEvent: null,
            pharmacyInventory: [],
            hiredStaff: [],
            queue: [],
            history: [],
            prbQueue: [],
            prolanisRoster: [],
            playerStats: { stress: 10, energy: 90 },
            activeOutbreaks: [],
            wikiMetric: null,
            openWiki: () => {}
        });

        render(<DashboardPage />);

        expect(screen.getByText('KBK • Dana Operasional • Kinerja')).toBeInTheDocument();
        expect(screen.getByText('Rp 50.2M')).toBeInTheDocument();
    });
});
