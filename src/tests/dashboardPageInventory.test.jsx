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

describe('DashboardPage inventory alerts', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('excludes equipment stockouts from the mission-control inventory alert', () => {
        mockUseGame.mockReturnValue({
            stats: { kapitasi: 50_000_000, pendapatanUmum: 0 },
            kpi: { totalPatients: 10 },
            derivedKpis: { rrns: 2, overallScore: 80, clinicalAccuracy: 90, availableFunds: 50_000_000 },
            accreditation: 'Utama',
            day: 12,
            villageData: { families: [], stats: { totalPopulation: 1000 } },
            activeEvent: null,
            pharmacyInventory: [
                { medicationId: 'amoxicillin_500', stock: 0 },
                { medicationId: 'otoscope', stock: 0 }
            ],
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

        expect(screen.getByText('1 obat HABIS')).toBeInTheDocument();
        expect(screen.queryByText('2 obat HABIS')).not.toBeInTheDocument();
    });
});
