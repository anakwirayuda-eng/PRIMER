import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

const translations = {
    'archive.tabs.daily': 'Log Kunjungan Harian',
    'archive.tabs.folders': 'Family Folder (Rekam Medis)',
    'archive.badges.action.delegate': 'DELEGASI',
    'archive.badges.action.refer': 'RUJUK',
    'archive.badges.action.ikm': 'IKM',
    'archive.badges.status.delegated': 'Didelegasikan',
    'archive.badges.status.refer_sisrute': 'Rujuk SISRUTE',
    'archive.badges.status.success': 'Berhasil',
    'archive.search_folders_placeholder': 'Cari KK / Kepala Keluarga...',
    'archive.search_patients_placeholder': 'Cari Pasien...',
    'archive.filter_state.clear': 'Hapus filter',
    'archive.empty.search_title': 'Tidak Ada Hasil',
    'archive.empty.daily_search_description': 'Tidak ditemukan log kunjungan dengan kata kunci "{{query}}"',
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options = {}) => translations[key] ?? options.defaultValue ?? key
    })
}));

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

    it('shows resolved IKM events in the daily archive with impact summary', () => {
        mockUseGame.mockReturnValue({
            history: [
                {
                    id: 'ikm-1',
                    type: 'ikm_event',
                    day: 6,
                    dischargedAt: 600,
                    name: 'BAB Sembarangan di Sungai',
                    outcomeStatus: 'ikm_success',
                    description: 'Biaya Rp 300.000 • IKS +5 • Risiko diare turun'
                }
            ],
            villageData: { families: [] },
            day: 6,
            viewParams: null,
            navigate: vi.fn()
        });

        render(<ArsipPage />);

        fireEvent.click(screen.getByRole('button', { name: /log kunjungan harian/i }));

        expect(screen.getAllByText('IKM').length).toBeGreaterThan(0);
        expect(screen.getByText('Berhasil')).toBeInTheDocument();
        expect(screen.getByText('BAB Sembarangan di Sungai')).toBeInTheDocument();
        expect(screen.getByText('Biaya Rp 300.000 • IKS +5 • Risiko diare turun')).toBeInTheDocument();
    });
    it('keeps folder and daily searches isolated per tab', () => {
        mockUseGame.mockReturnValue({
            history: [
                {
                    id: 'enc-3',
                    day: 7,
                    dischargedAt: 600,
                    name: 'Siti',
                    decision: { action: 'treat' },
                    outcomeStatus: 'correct',
                    medicalData: { trueDiagnosisCode: 'A09' }
                }
            ],
            villageData: {
                families: [
                    {
                        id: 'fam-1',
                        headName: 'Pak Budi',
                        members: [],
                        indicators: {}
                    }
                ]
            },
            day: 7,
            viewParams: null,
            navigate: vi.fn()
        });

        render(<ArsipPage />);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });
        fireEvent.click(screen.getByRole('button', { name: /log kunjungan harian/i }));

        expect(screen.getByRole('textbox')).toHaveValue('');
        expect(screen.getByText('Siti')).toBeInTheDocument();
    });

    it('falls back to visit cards instead of the wide table at 1366px', () => {
        const originalInnerWidth = window.innerWidth;
        window.innerWidth = 1366;

        mockUseGame.mockReturnValue({
            history: [
                {
                    id: 'enc-4',
                    day: 8,
                    dischargedAt: 620,
                    name: 'Dina',
                    decision: { action: 'treat' },
                    outcomeStatus: 'correct',
                    medicalData: { trueDiagnosisCode: 'J11' }
                }
            ],
            villageData: { families: [] },
            day: 8,
            viewParams: null,
            navigate: vi.fn()
        });

        render(<ArsipPage />);
        fireEvent.click(screen.getByRole('button', { name: /log kunjungan harian/i }));

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
        expect(screen.getByText('Dina')).toBeInTheDocument();

        window.innerWidth = originalInnerWidth;
    });
});
