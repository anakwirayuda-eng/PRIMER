import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';
import * as spatialContext from '../domains/village/spatialContext.js';
import * as helpers from '../store/helpers/publicHealthHelpers.js';
import * as eventEngine from '../game/IKMEventEngine.js';
import * as bridgeSeasonal from '../domains/village/bridgeSeasonalState.js';

vi.mock('../store/helpers/publicHealthHelpers.js', async (importOriginal) => {
    const orig = await importOriginal();
    return {
        ...orig,
        applyFamilyIndicatorDrift: vi.fn(orig.applyFamilyIndicatorDrift)
    };
});

let mockFamilyCoords = {};
vi.spyOn(spatialContext, 'getSpatialContext').mockImplementation(() => ({
    familyCoords: mockFamilyCoords
}));

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
    guardStability: () => true,
    clearStability: vi.fn()
}));

vi.mock('../utils/dispatchGuard.js', () => ({
    dispatchGuard: (name, fn) => fn,
    guardActionGroup: (name, group) => group,
    triggerFreezeProtocol: vi.fn(),
    buildRuntimeTrap: vi.fn()
}));

describe('Bridge Seasonal -> East-Sector Drift Amplification', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFamilyCoords = {};
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    const setupTestStore = () => {
        const familyEastFar = { id: 'fam-east-far', houseId: 'h-1', indicators: {} };
        const familyEastNear = { id: 'fam-east-near', houseId: 'h-2', indicators: {} };
        const familyWest = { id: 'fam-west', houseId: 'h-3', indicators: {} };
        const familyMissing = { id: 'fam-missing', houseId: 'h-4', indicators: {} };
        
        // Puskesmas is at { x: 100, y: 30 }
        mockFamilyCoords = {
            'fam-east-far': { x: 150, y: 30 },   // distance 50 -> base multiplier 2.0
            'fam-east-near': { x: 125, y: 30 },  // distance 25 -> base multiplier 1.5
            'fam-west': { x: 90, y: 30 }         // distance 10 -> base multiplier 1.0 (also not east because x < 120)
            // fam-missing has no coords
        };

        useGameStore.setState(state => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                villageData: {
                    families: [familyEastFar, familyEastNear, familyWest, familyMissing]
                }
            }
        }));
    };

    const runDailyCycle = () => {
        // Trigger orchestrator slice loop natively or direct public health process
        useGameStore.getState().publicHealthActions.processDailyPublicHealth(1, []);
        
        const calls = helpers.applyFamilyIndicatorDrift.mock.calls;
        const result = {};
        for (const call of calls) {
            const fam = call[0];
            const options = call[2] || {};
            result[fam.id] = options.driftMultiplier;
        }
        return result;
    };

    it('east family on putus day gets amplified multiplier above base', () => {
        setupTestStore();
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
        vi.spyOn(bridgeSeasonal, 'isExtremeRainDay').mockReturnValue(true);

        const multipliers = runDailyCycle();
        
        // Base is 1.5. Putus amplification is 1.5 * 1.5 = 2.25
        expect(multipliers['fam-east-near']).toBe(2.25);
    });

    it('amplification is capped at 3.0', () => {
        setupTestStore();
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
        vi.spyOn(bridgeSeasonal, 'isExtremeRainDay').mockReturnValue(true);

        const multipliers = runDailyCycle();
        
        // Base is 2.0. Putus amplification is 2.0 * 1.5 = 3.0 (bounded)
        expect(multipliers['fam-east-far']).toBe(3.0);
    });

    it('west family on putus day keeps base multiplier', () => {
        setupTestStore();
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
        vi.spyOn(bridgeSeasonal, 'isExtremeRainDay').mockReturnValue(true);

        const multipliers = runDailyCycle();
        
        // Base is 1.0. West family does not get amplified
        expect(multipliers['fam-west']).toBe(1.0);
    });

    it('east family on non-putus rainy day keeps base multiplier', () => {
        setupTestStore();
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
        vi.spyOn(bridgeSeasonal, 'isExtremeRainDay').mockReturnValue(false);

        const multipliers = runDailyCycle();
        
        // Base is 1.5. No amplification because not putus
        expect(multipliers['fam-east-near']).toBe(1.5);
    });

    it('missing coords keeps base multiplier', () => {
        setupTestStore();
        vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
        vi.spyOn(bridgeSeasonal, 'isExtremeRainDay').mockReturnValue(true);

        const multipliers = runDailyCycle();
        
        // Missing coords -> effective distance 0 -> base multiplier 1.0. No amplification.
        expect(multipliers['fam-missing']).toBe(1.0);
    });
});
