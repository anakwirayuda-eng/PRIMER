import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import BishiBashiModal from '../components/BishiBashiModal.jsx';

vi.mock('../context/ThemeContext', () => ({
    useTheme: () => ({ isDark: true }),
}));

vi.mock('../game/DispensingEngine.js', () => ({
    generateDispensingChallenge: vi.fn(() => ({
        timeLimit: 0.1,
        targetMeds: ['med_a'],
        allMeds: ['med_a', 'med_b'],
        challenge: {
            patientName: 'Pasien Uji',
            items: [{ name: 'Obat A' }],
        },
    })),
    scoreBishiBashi: vi.fn((targetMeds, selectedMeds, elapsed) => ({
        accuracy: selectedMeds.includes(targetMeds[0]) ? 100 : 0,
        speed: 80,
        wrong: 0,
        missed: selectedMeds.includes(targetMeds[0]) ? 0 : 1,
        combo: 0,
        xpEarned: 12,
        feedback: elapsed >= 100 ? 'Timeout tercatat' : 'Submit manual',
    })),
}));

vi.mock('../data/MedicationDatabase.js', () => ({
    getMedicationById: vi.fn((id) => ({
        id,
        name: id === 'med_a' ? 'Obat A' : 'Obat B',
        form: 'tablet',
        type: 'umum',
    })),
}));

describe('BishiBashiModal', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('auto-submits the challenge when the timer expires', async () => {
        render(
            <BishiBashiModal
                prescriptionQueue={[]}
                difficulty={1}
                onComplete={vi.fn()}
                onDismiss={vi.fn()}
            />
        );

        act(() => {
            screen.getByRole('button', { name: /mulai rush/i }).click();
        });

        act(() => {
            vi.advanceTimersByTime(150);
        });

        expect(screen.getByText(/timeout tercatat/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /selesai/i })).toBeInTheDocument();
    });
});
