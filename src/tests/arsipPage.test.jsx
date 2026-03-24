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

vi.mock('../utils/prophylaxis.js', () => ({
    guardStability: vi.fn(() => true)
}));

vi.mock('../components/ErrorBoundary.jsx', () => ({
    default: ({ children }) => children
}));

vi.mock('../components/CPPTCard.jsx', () => ({
    default: () => null
}));

import ArsipPage from '../components/ArsipPage.jsx';

describe('ArsipPage daily log semantics', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('shows explicit action and outcome badges for modern encounter statuses', () => {
        mockUseGame.mockReturnValue({
            history: [
                {
                    id: 'enc-1',
                    day: 5,
                    dischargedAt: 540,
                    name: 'Budi',
                    decision: { action: 'delegate_to_maia' },
                    outcomeStatus: 'delegated',
                    medicalData: { trueDiagnosisCode: 'I10' }
                },
                {
                    id: 'enc-2',
                    day: 5,
                    dischargedAt: 560,
                    name: 'Siti',
                    decision: { action: 'refer' },
                    outcomeStatus: 'referred_sisrute',
                    medicalData: { trueDiagnosisCode: 'J18.9' }
                }
            ],
            villageData: { families: [] },
            day: 5,
            viewParams: null,
            navigate: vi.fn()
        });

        render(<ArsipPage />);

        fireEvent.click(screen.getByRole('button', { name: /log kunjungan harian/i }));

        expect(screen.getByText('DELEGASI')).toBeInTheDocument();
        expect(screen.getByText('Didelegasikan')).toBeInTheDocument();
        expect(screen.getAllByText('RUJUK').length).toBeGreaterThan(0);
        expect(screen.getByText('Rujuk SISRUTE')).toBeInTheDocument();
    });
});
