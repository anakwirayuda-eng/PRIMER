import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

import DailyReportModal from '../components/DailyReportModal.jsx';

describe('DailyReportModal', () => {
    it('labels daily archive revenue as service revenue, not total income', () => {
        render(
            <DailyReportModal
                dayData={{
                    day: 5,
                    patientsToday: 12,
                    revenue: 60000,
                    reputation: 78,
                    overallScore: 84,
                    hourlyTraffic: [],
                    topDiseases: []
                }}
                dailyArchive={[{ day: 5 }]}
                onClose={() => {}}
            />
        );

        expect(screen.getByText('Pendapatan Layanan')).toBeInTheDocument();
        expect(screen.getByText('Di luar kapitasi bulanan')).toBeInTheDocument();
    });
});
