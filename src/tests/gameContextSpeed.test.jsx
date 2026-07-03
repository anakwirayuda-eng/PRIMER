import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockState = {
    nav: {
        gameState: 'playing',
        currentSlotId: 0,
        showKPIGlobal: false,
        viewParams: {},
        settings: {},
        activePage: 'dashboard'
    },
    navActions: {
        resetNavigation: vi.fn(),
        navigate: vi.fn(),
        setGameState: vi.fn()
    },
    world: {
        speed: 0,
        time: 420,
        day: 1
    },
    worldActions: {
        setTime: vi.fn(),
        setDay: vi.fn(),
        setGameSpeed: vi.fn()
    },
    player: {
        profile: {
            name: 'Tester',
            energy: 100,
            spirit: 100,
            reputation: 80,
            knowledge: 0,
            skills: [],
            xp: 0,
            level: 1,
            maxEnergy: 100,
            morningStatus: null,
            loungeRestCount: 0
        }
    },
    playerActions: {
        setPlayerStats: vi.fn(),
        updateProfile: vi.fn(),
        gainXp: vi.fn(),
        clearMorningStatus: vi.fn(),
        takeLoungeRest: vi.fn(() => ({ success: true }))
    },
    finance: {
        stats: {
            kapitasi: 0,
            pendapatanUmum: 0,
            pengeluaranObat: 0,
            pengeluaranLab: 0,
            pengeluaranOperasional: 0
        },
        kpi: {
            totalPatients: 0,
            correctDiagnoses: 0,
            referrals: 0,
            nonSpecialisticReferrals: 0,
            treatedCases: 0,
            inappropriateTreat: 0,
            antibioticPrescriptions: 0,
            rationalAntibiotics: 0,
            patientSatisfaction: [],
            bpjsPatients: 0,
            umumPatients: 0
        },
        accreditation: 'Paripurna',
        facilities: {},
        pharmacyInventory: []
    },
    financeActions: {
        setStats: vi.fn()
    },
    clinical: {
        gameOver: null,
        activePatientId: null,
        activeEmergencyId: null,
        activeReferral: null,
        activeReferralLog: [],
        prbQueue: [],
        queue: [],
        emergencyQueue: [],
        history: [],
        dailyArchive: []
    },
    clinicalActions: {
        setGameOver: vi.fn(),
        processDailyTick: vi.fn(),
        dismissWarning: vi.fn(),
        setActivePatientId: vi.fn(),
        setActiveEmergencyId: vi.fn()
    },
    publicHealth: {
        villageData: { families: [] },
        activeOutbreaks: [],
        outbreakNotification: null
    },
    publicHealthActions: {
        setVillageData: vi.fn(),
        dismissOutbreakNotification: vi.fn()
    },
    staff: {
        hiredStaff: []
    },
    staffActions: {},
    meta: {},
    metaActions: {},
    actions: {
        saveGame: vi.fn(),
        loadGame: vi.fn(),
        startNewGame: vi.fn(),
        nextDay: vi.fn()
    }
};

vi.mock('../store/useGameStore.js', () => ({
    useGameStore: (selector) => (selector ? selector(mockState) : mockState)
}));

vi.mock('../hooks/useGameLoop.js', () => ({
    useGameLoop: vi.fn()
}));

vi.mock('../hooks/useCloudSync.js', () => ({
    useCloudSync: vi.fn()
}));

vi.mock('../context/contracts/gameContext.contract.js', () => ({
    assertGameContextContract: vi.fn()
}));

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {}
}));

vi.mock('../utils/browserSafety.js', () => ({
    safeReloadPage: vi.fn()
}));

import { GameProvider, useGame } from '../context/GameContext.jsx';

function GameSpeedProbe() {
    const { gameSpeed } = useGame();
    return <div>{String(gameSpeed)}</div>;
}

describe('GameContext speed passthrough', () => {
    it('preserves speed 0 instead of coercing it to 1', () => {
        render(
            <GameProvider>
                <GameSpeedProbe />
            </GameProvider>
        );

        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
