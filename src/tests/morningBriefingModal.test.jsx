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
                    kpiSnapshot: { reputation: 91 },
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

        expect(screen.getByText(/Hari ke-7/)).toBeInTheDocument();
        expect(screen.getByText('Reputasi:91')).toBeInTheDocument();
        expect(screen.getByText('Staff Aktif:3/4')).toBeInTheDocument();
    });
});
