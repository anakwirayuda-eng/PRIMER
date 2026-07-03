import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();
const mockGetEligibleParticipants = vi.fn();
const mockCalculateAttendance = vi.fn();
const mockProcessActivityResult = vi.fn();
const mockGeneratePosyanduSummary = vi.fn();

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../game/PosyanduEngine.js', () => ({
    POSYANDU_ACTIVITIES: {
        penimbangan: {
            id: 'penimbangan',
            name: 'Penimbangan',
            energyCost: 3,
            timeCost: 10,
            targetAge: 1,
            iksImpact: { indicator: 'gizi' },
            icon: '⚖️'
        },
        kms: {
            id: 'kms',
            name: 'KMS',
            energyCost: 2,
            timeCost: 5,
            targetAge: 1,
            icon: '📋'
        }
    },
    getEligibleParticipants: (...args) => mockGetEligibleParticipants(...args),
    calculateAttendance: (...args) => mockCalculateAttendance(...args),
    processActivityResult: (...args) => mockProcessActivityResult(...args),
    generatePosyanduSummary: (...args) => mockGeneratePosyanduSummary(...args)
}));

vi.mock('../game/GameCore.js', () => ({
    calculateIKS: vi.fn(() => 1)
}));

vi.mock('../utils/deterministicRandom.js', () => ({
    chanceFromSeed: vi.fn(() => false)
}));

vi.mock('../utils/villageMetrics.js', () => ({
    calculateAverageIksFromFamilies: vi.fn(() => 0.75)
}));

import PosyanduModal from '../components/PosyanduModal.jsx';

function createGameMock() {
    return {
        villageData: {
            averageIks: 0.72,
            families: [{ id: 'fam-1', indicators: {} }]
        },
        reputation: 12,
        day: 5,
        playerStats: { energy: 20 },
        setPlayerStats: vi.fn(),
        setTime: vi.fn(),
        setReputation: vi.fn(),
        setVillageData: vi.fn(),
        soundManager: {
            playConfirm: vi.fn(),
            playSuccess: vi.fn()
        },
        setHistory: vi.fn(),
        getStaffBuffs: vi.fn(() => ({ childNutrition: 0 })),
        gainXp: vi.fn()
    };
}

const childParticipant = {
    id: 'child-1',
    familyId: 'fam-1',
    familyName: 'Keluarga A',
    age: 1,
    name: 'Bayi A'
};

describe('PosyanduModal', () => {
    beforeEach(() => {
        const gameMock = createGameMock();
        mockUseGame.mockReturnValue(gameMock);
        mockGetEligibleParticipants.mockImplementation((_villageData, activityType) => (
            activityType === 'penimbangan' ? [childParticipant] : []
        ));
        mockCalculateAttendance.mockImplementation((participants) => participants);
        mockProcessActivityResult.mockImplementation((activity) => ({
            activityId: activity.id,
            xp: activity.id === 'penimbangan' ? 10 : 20,
            issue: activity.id === 'kms'
        }));
        mockGeneratePosyanduSummary.mockImplementation((results) => ({
            totalParticipants: 1,
            totalXP: results.reduce((sum, item) => sum + item.xp, 0),
            issuesFound: results.filter((item) => item.issue).length
        }));
    });

    it('counts the final attendee results and charges reminder energy', () => {
        render(<PosyanduModal isOpen onClose={() => {}} />);

        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(screen.getByRole('button', { name: /mulai posyandu/i }));
        fireEvent.click(screen.getByRole('button', { name: /layani & lanjut/i }));

        const gameMock = mockUseGame.mock.results.at(-1)?.value;
        expect(gameMock.gainXp).toHaveBeenCalledWith(30);

        const energyUpdater = gameMock.setPlayerStats.mock.calls[0][0];
        expect(energyUpdater({ energy: 20 })).toMatchObject({ energy: 10 });

        expect(screen.getByText(/posyandu selesai/i)).toBeInTheDocument();
    });

    it('resets back to setup when the modal is reopened', () => {
        const { rerender } = render(<PosyanduModal isOpen onClose={() => {}} />);

        fireEvent.click(screen.getByRole('button', { name: /mulai posyandu/i }));
        expect(screen.getByRole('button', { name: /layani & lanjut/i })).toBeInTheDocument();

        rerender(<PosyanduModal isOpen={false} onClose={() => {}} />);
        rerender(<PosyanduModal isOpen onClose={() => {}} />);

        expect(screen.getByRole('button', { name: /mulai posyandu/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /layani & lanjut/i })).not.toBeInTheDocument();
    });
});
