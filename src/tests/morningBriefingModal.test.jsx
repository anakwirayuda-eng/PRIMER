import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../context/ThemeContext', () => ({
    useTheme: () => ({ isDark: false })
}));

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => null
}));

vi.mock('../components/shared/StepCarousel.jsx', () => ({
    default: ({ children }) => <div>{children}</div>
}));

vi.mock('../components/shared/StatCard.jsx', () => ({
    default: ({ label, value, suffix = '' }) => <div>{label}:{value}{suffix}</div>
}));

import MorningBriefingModal from '../components/MorningBriefingModal.jsx';

describe('MorningBriefingModal', () => {
    it('renders the provided briefingData instead of regenerating an empty default briefing', () => {
        render(
            <MorningBriefingModal
                briefingData={{
                    day: 7,
                    staffReport: { available: 3, total: 4, avgMorale: 82 },
                    kpiSnapshot: { reputation: 91, availableFunds: 50250000, currentCycleReceipts: 1250000 },
                    pendingFollowups: [],
                    stockAlerts: { lowStock: [] },
                    todayEvents: [],
                    suggestedPriority: { icon: '🎯', text: 'Fokus hari ini.' },
                    availablePolis: []
                }}
                gameState={{ day: 7, hiredStaff: [] }}
                onComplete={() => {}}
                onDismiss={() => {}}
            />
        );

        expect(screen.getByText(/Hari 7 - Briefing Pagi/i)).toBeInTheDocument();
        expect(screen.getByText('Reputasi:91')).toBeInTheDocument();
        expect(screen.getByText('Staf Aktif:3/4')).toBeInTheDocument();
        expect(screen.getByText('Dana Aktif')).toBeInTheDocument();
        expect(screen.getByText('Rp 50,3 jt')).toBeInTheDocument();
        expect(screen.getByText('Penerimaan Siklus')).toBeInTheDocument();
        expect(screen.getByText('Rp 1,3 jt')).toBeInTheDocument();
    });
});
