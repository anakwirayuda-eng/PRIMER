import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();
const mockGenerateMorningBriefing = vi.fn(() => null);
const mockGenerateDebrief = vi.fn(() => ({
    day: 1,
    summary: {
        patientsServed: 0,
        avgDiagnosisScore: 0,
        reputation: 80,
        reputationDelta: 0,
        todayRevenue: 0,
        correctDiagnoses: 0,
        incorrectDiagnoses: 0,
        referralsMade: 0
    },
    criticalCases: [],
    reflectionPrompts: [],
    consequencePreview: [],
    grade: { emoji: '🙂', label: 'Baik', grade: 'B', stars: 3 },
    xpEarned: 0,
    reflectionXpBonus: 0
}));

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../game/GuestEventSystem.js', () => ({
    getRandomGuestEvent: vi.fn(() => null)
}));

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playClick: vi.fn(),
        playError: vi.fn(),
        playSuccess: vi.fn()
    }
}));

vi.mock('../game/MorningBriefing.js', () => ({
    generateMorningBriefing: (...args) => mockGenerateMorningBriefing(...args)
}));

vi.mock('../game/DebriefEngine.js', () => ({
    generateDebrief: (...args) => mockGenerateDebrief(...args)
}));

vi.mock('../components/MorningBriefingModal.jsx', () => ({
    default: () => null
}));

vi.mock('../components/EndOfDayModal.jsx', () => ({
    default: () => null
}));

import RumahDinas from '../pages/RumahDinas.jsx';

function createGameContext(overrides = {}) {
    return {
        playerStats: {
            name: 'Dokter Test',
            energy: 80,
            maxEnergy: 100,
            stress: 10,
            spirit: 90,
            level: 1,
            reputation: 80
        },
        setPlayerStats: vi.fn(),
        furnitureInventory: undefined,
        setFurnitureInventory: undefined,
        stats: { pendapatanUmum: 5_000_000 },
        setStats: vi.fn(),
        time: 12 * 60,
        advanceTime: vi.fn(),
        sleepWithAlarm: vi.fn(() => ({ success: true, status: 'refreshed', wakeTime: 5 * 60 })),
        setReputation: vi.fn(),
        clearMorningStatus: vi.fn(),
        gainXp: vi.fn(),
        showMorningBriefing: false,
        setShowMorningBriefing: vi.fn(),
        showEndOfDayDebrief: false,
        setShowEndOfDayDebrief: vi.fn(),
        todayLog: [],
        consequenceQueue: [],
        setDailyQuestId: vi.fn(),
        setStaffAllocation: vi.fn(),
        addReflection: vi.fn(),
        logCaseOutcome: vi.fn(),
        dailyQuestId: null,
        morningReputation: 80,
        day: 3,
        hiredStaff: [],
        pharmacyInventory: [],
        queue: [],
        history: [],
        ...overrides
    };
}

describe('RumahDinas', () => {
    afterEach(() => {
        mockUseGame.mockReset();
        mockGenerateMorningBriefing.mockClear();
        mockGenerateDebrief.mockClear();
    });

    it('shows the default starter furniture even when no furniture inventory is persisted yet', () => {
        mockUseGame.mockReturnValue(createGameContext());

        render(<RumahDinas onClose={() => {}} />);

        expect(screen.getByText('Radio Jadul')).toBeInTheDocument();
        expect(screen.getByText('Kursi Kayu')).toBeInTheDocument();
    });

    it('stores purchased furniture through player profile updates', async () => {
        const setPlayerStats = vi.fn();
        const setStats = vi.fn();

        mockUseGame.mockReturnValue(createGameContext({
            setPlayerStats,
            setStats
        }));

        const user = userEvent.setup();
        render(<RumahDinas onClose={() => {}} />);

        await user.click(screen.getAllByRole('button', { name: 'Beli' })[0]);

        expect(setStats).toHaveBeenCalledTimes(1);
        expect(setPlayerStats).toHaveBeenCalledTimes(1);

        const updater = setPlayerStats.mock.calls[0][0];
        expect(updater({
            furnitureInventory: undefined
        }).furnitureInventory).toEqual([
            'bed_basic',
            'sofa_basic',
            'desk_basic',
            'ent_radio',
            'kitchen_basic',
            'pc_basic',
            'mic_basic',
            'ent_tv_crt'
        ]);
    });
});
