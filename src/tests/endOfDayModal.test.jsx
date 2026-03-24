import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../context/ThemeContext', () => ({
    useTheme: () => ({ isDark: false })
}));

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

vi.mock('../components/shared/StatCard', () => ({
    default: ({ label, value, suffix }) => (
        <div>
            <span>{label}</span>
            <span>{value}{suffix || ''}</span>
        </div>
    )
}));

vi.mock('../components/shared/ExpandableCard', () => ({
    default: ({ title }) => <div>{title}</div>
}));

vi.mock('../components/shared/GuidelineBadge', () => ({
    default: ({ text }) => <div>{text}</div>
}));

import EndOfDayModal from '../components/EndOfDayModal.jsx';

describe('EndOfDayModal', () => {
    it('labels the daily service metric as Net Layanan', () => {
        render(
            <EndOfDayModal
                debriefData={{
                    day: 5,
                    summary: {
                        patientsServed: 3,
                        avgDiagnosisScore: 82,
                        reputation: 88,
                        reputationDelta: 2,
                        todayRevenue: 50000,
                        correctDiagnoses: 2,
                        incorrectDiagnoses: 1,
                        referralsMade: 0
                    },
                    criticalCases: [],
                    reflectionPrompts: [],
                    consequencePreview: [],
                    grade: { emoji: 'A', label: 'Baik', grade: 'A', stars: 4 },
                    xpEarned: 10,
                    reflectionXpBonus: 20
                }}
                onComplete={vi.fn()}
                onDismiss={vi.fn()}
            />
        );

        expect(screen.getByText('Net Layanan')).toBeInTheDocument();
    });
});
