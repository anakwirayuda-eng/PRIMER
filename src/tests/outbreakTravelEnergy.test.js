import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';
import * as spatialContext from '../domains/village/spatialContext.js';

// Mock SoundManager before initializing store
vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

// Mock guardStability to prevent test burst from triggering stability lock
vi.mock('../utils/prophylaxis.js', () => ({
    guardStability: () => true
}));

// Mock dispatchGuard entirely
vi.mock('../utils/dispatchGuard.js', () => ({
    dispatchGuard: (name, fn) => fn,
    guardActionGroup: (name, group) => group,
    triggerFreezeProtocol: vi.fn(),
    buildRuntimeTrap: vi.fn()
}));

let mockFamilyCoords = {};
vi.spyOn(spatialContext, 'getSpatialContext').mockImplementation(() => ({
    familyCoords: mockFamilyCoords
}));

describe('Respond to Outbreak - Travel Energy Integration', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.advanceTimersByTime(1000); // clear dispatchGuard stability lock
        mockFamilyCoords = {};
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    const setupTestStore = (houseId, x, y, day, balance, initialEnergy = 100, buildingProgress = undefined) => {
        mockFamilyCoords = { 'fam-test': { x, y } };
        useGameStore.setState(state => ({
            world: {
                ...state.world,
                day
            },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: initialEnergy
                }
            },
            finance: {
                ...state.finance,
                stats: {
                    ...state.finance.stats,
                    kapitasi: balance,
                    pendapatanUmum: 0
                }
            },
            publicHealth: {
                ...state.publicHealth,
                activeOutbreaks: [{
                    id: 'ob-test',
                    affectedHouseIds: [houseId],
                    resolutionProgress: 0,
                    actionsPerformed: [],
                    resolved: false,
                    typeData: { reputationReward: 10 }
                }],
                villageData: {
                    families: [{
                        id: 'fam-test',
                        houseId: houseId,
                        indicators: {}
                    }]
                },
                ...(buildingProgress !== undefined ? { buildingProgress } : {})
            }
        }));
    };

    const runOutbreakAction = (energyCost = 40) => {
        return useGameStore.getState().publicHealthActions.respondToOutbreak('ob-test', 'psn_campaign', { timeCost: 60, energyCost }, 1);
    };

    it('outbreak in timur with jalan_kaki costs more than flat base', () => {
        // Timur coords (x=130, y=50), day 1 (jalan_kaki)
        setupTestStore('h-timur', 130, 50, 1, 0, 100);
        const res = runOutbreakAction(40);
        expect(res.success).toBe(true);

        const energySpent = 100 - useGameStore.getState().player.profile.energy;
        // Manhattan distance = |100-130| + |30-50| = 30 + 20 = 50
        // Scale = 50 / 200 = 0.25
        // Timur penalty = 0.5
        // jalan_kaki mitigation = 1.0
        // Effective penalty = 0.125 -> multiplier 1.125 -> 40 * 1.125 = 45
        expect(energySpent).toBeGreaterThan(40);
        expect(energySpent).toBe(45);
    });

    it('same outbreak with motor_dinas costs less penalty than jalan_kaki', () => {
        // Day 60, balance 3,000,000 unlocks motor_dinas
        setupTestStore('h-timur', 130, 50, 60, 3000000, 100);
        const res = runOutbreakAction(40);
        expect(res.success).toBe(true);

        const energySpent = 100 - useGameStore.getState().player.profile.energy;
        // motor_dinas mitigation = 0.2
        // Effective penalty = 0.25 * 0.5 * 0.2 = 0.025 -> 40 * 1.025 = 41
        expect(energySpent).toBeGreaterThan(40);
        expect(energySpent).toBeLessThan(45);
        expect(energySpent).toBe(41);
    });

    it('active Pustu reduces effective outbreak travel distance for nearby remote areas', () => {
        setupTestStore('h-pustu', 30, 50, 1, 0, 100, { pustu: { completed: true } });
        const res = runOutbreakAction(40);
        expect(res.success).toBe(true);

        const energySpent = 100 - useGameStore.getState().player.profile.energy;
        expect(energySpent).toBeLessThan(54.4);
        expect(energySpent).toBe(40.3);
    });

    it('without active FOB anchor, same nearby remote area still uses Puskesmas distance', () => {
        setupTestStore('h-pustu', 30, 50, 1, 0, 100);
        const res = runOutbreakAction(40);
        expect(res.success).toBe(true);

        const energySpent = 100 - useGameStore.getState().player.profile.energy;
        expect(energySpent).toBe(54.4);
    });

    it('outbreak in pusat costs exactly flat base', () => {
        // Pusat coords (x=100, y=30)
        setupTestStore('h-pusat', 100, 30, 1, 0, 100);
        const res = runOutbreakAction(40);
        expect(res.success).toBe(true);
        const energySpent = 100 - useGameStore.getState().player.profile.energy;
        expect(energySpent).toBe(40);
    });

    it('puskel results in flat base regardless of terrain', () => {
        // Timur coords, Day 90, balance 6,000,000 unlocks puskel
        setupTestStore('h-timur', 130, 50, 90, 6000000, 100);
        const res = runOutbreakAction(40);
        expect(res.success).toBe(true);
        const energySpent = 100 - useGameStore.getState().player.profile.energy;
        // puskel mitigation = 0.0
        expect(energySpent).toBe(40);
    });

    it('missing familyCoords falls back to flat base', () => {
        // Set up without spatial data
        useGameStore.setState(state => ({
            publicHealth: {
                ...state.publicHealth,
                villageData: { families: [{ id: 'fam-test', houseId: 'h-missing' }] },
                activeOutbreaks: [{ id: 'ob-test', affectedHouseIds: ['h-missing'], resolutionProgress: 0, actionsPerformed: [], resolved: false, typeData: { reputationReward: 10 } }]
            },
            player: { ...state.player, profile: { ...state.player.profile, energy: 100 } }
        }));
        const res = runOutbreakAction(40);
        expect(res.success).toBe(true);
        const energySpent = 100 - useGameStore.getState().player.profile.energy;
        expect(energySpent).toBe(40);
    });

    it('affordability guard and deduction use the same effective energy cost', () => {
        // Timur coords (x=130, y=50), requires 45 energy
        // We set energy to exactly 44 -> should be rejected by guard
        setupTestStore('h-timur', 130, 50, 1, 0, 44);
        const res1 = runOutbreakAction(40);
        expect(res1.success).toBe(false);
        expect(res1.message).toBe('Not enough energy');
        expect(useGameStore.getState().player.profile.energy).toBe(44);

        // We set energy to exactly 45 -> should be accepted and deduct 45
        setupTestStore('h-timur', 130, 50, 1, 0, 45);
        const res2 = runOutbreakAction(40);
        expect(res2.success).toBe(true);
        expect(useGameStore.getState().player.profile.energy).toBe(0);
    });
});
