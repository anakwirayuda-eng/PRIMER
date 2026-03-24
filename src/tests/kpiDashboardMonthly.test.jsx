import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../context/ThemeContext.jsx', () => ({
    useTheme: () => ({ isDark: false })
}));

vi.mock('../components/EducationalWikiModal.jsx', () => ({
    default: () => null
}));

import KPIDashboard from '../components/KPIDashboard.jsx';

describe('KPIDashboard monthly archive semantics', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('shows payroll and operational surplus in the monthly archive card', () => {
        mockUseGame.mockReturnValue({
            stats: {
                kapitasi: 50_000_000,
                pendapatanUmum: 300_000
            },
            kpi: {
                totalPatients: 12,
                correctDiagnoses: 9,
                referrals: 1,
                nonSpecialisticReferrals: 0,
                treatedCases: 10,
                inappropriateTreat: 1,
                antibioticPrescriptions: 2,
                rationalAntibiotics: 2,
                patientSatisfaction: [80, 90]
            },
            derivedKpis: {
                referralRate: 8,
                rrns: 0,
                availableFunds: 50_300_000,
                totalExpense: 200_000,
                netBalance: 50_300_000,
                clinicalAccuracy: 75,
                treatmentAppropriateRate: 90,
                antibioticStewardship: 100,
                overallScore: 82
            },
            day: 35,
            history: [],
            queue: [],
            monthlyArchive: [
                {
                    month: 1,
                    avgScore: 80,
                    avgReputation: 85,
                    totalPatients: 90,
                    serviceRevenue: 300000,
                    monthlyKapitasi: 62500000,
                    totalRevenue: 62800000,
                    staffSalaries: 2000000,
                    recordedExpenses: 875000,
                    totalRecordedCosts: 2875000,
                    netOperationalResult: 59925000,
                    trend: {}
                }
            ],
            isWikiOpen: false,
            wikiMetric: null,
            openWiki: vi.fn(),
            closeWiki: vi.fn()
        });

        render(<KPIDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /vault/i }));

        expect(screen.getByText(/Gaji Rp/i)).toBeInTheDocument();
        expect(screen.getByText(/Beban Rp/i)).toBeInTheDocument();
        expect(screen.getByText(/Net Operasional Rp/i)).toBeInTheDocument();
    });
});
