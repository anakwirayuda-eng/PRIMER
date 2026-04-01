import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';
import * as spatialContext from '../domains/village/spatialContext.js';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn()
    }
}));

vi.mock('../utils/prophylaxis.js', () => ({
    guardStability: () => true
}));

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

describe('FOB Level 2 -> Outbreak Response Effectiveness', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.advanceTimersByTime(1000);
        mockFamilyCoords = {};
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    const setupTestStore = (familyId, houseId, x, y, buildingProgress = undefined) => {
        mockFamilyCoords = { [familyId]: { x, y } };
        useGameStore.setState(state => ({
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 100
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
                        id: familyId,
                        houseId,
                        indicators: {}
                    }]
                },
                ...(buildingProgress !== undefined ? { buildingProgress } : {})
            }
        }));
    };

    const runOutbreakAction = () => (
        useGameStore.getState().publicHealthActions.respondToOutbreak(
            'ob-test',
            'psn_campaign',
            { timeCost: 45, energyCost: 25 },
            1
        )
    );

    it('boosts outbreak resolution near a level 2 pustu', () => {
        setupTestStore('fam-pustu', 'h-pustu', 30, 50, { pustu: { completed: true, level: 2 } });

        const res = runOutbreakAction();

        expect(res.success).toBe(true);
        expect(useGameStore.getState().publicHealth.activeOutbreaks[0].resolutionProgress).toBeCloseTo(45.5, 5);
    });

    it('does not boost when pustu is only level 1', () => {
        setupTestStore('fam-pustu', 'h-pustu', 30, 50, { pustu: { completed: true, level: 1 } });

        const res = runOutbreakAction();

        expect(res.success).toBe(true);
        expect(useGameStore.getState().publicHealth.activeOutbreaks[0].resolutionProgress).toBe(35);
    });

    it('does not boost when the nearest FOB is too far away', () => {
        setupTestStore('fam-far', 'h-far', 60, 50, { pustu: { completed: true, level: 2 } });

        const res = runOutbreakAction();

        expect(res.success).toBe(true);
        expect(useGameStore.getState().publicHealth.activeOutbreaks[0].resolutionProgress).toBe(35);
    });

    it('supports polindes level 2 independently', () => {
        setupTestStore('fam-polindes', 'h-polindes', 26, 95, { polindes: { completed: true, level: 2 } });

        const res = runOutbreakAction();

        expect(res.success).toBe(true);
        expect(useGameStore.getState().publicHealth.activeOutbreaks[0].resolutionProgress).toBeCloseTo(45.5, 5);
    });
});
