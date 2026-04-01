import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';
import * as spatialContext from '../domains/village/spatialContext.js';
import * as helpers from '../store/helpers/publicHealthHelpers.js';

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
    guardStability: () => true
}));

vi.mock('../utils/dispatchGuard.js', () => ({
    dispatchGuard: (name, fn) => fn,
    guardActionGroup: (name, group) => group,
    triggerFreezeProtocol: vi.fn(),
    buildRuntimeTrap: vi.fn()
}));

describe('FOB Upgrade -> Distance Decay Mitigation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFamilyCoords = {};
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    const setupTestStore = (buildingProgress = undefined) => {
        // Puskesmas is at x: 100, y: 30
        const familyNear = { id: 'fam-near', houseId: 'h-near', indicators: {} };
        const familyFar = { id: 'fam-far', houseId: 'h-far', indicators: {} };
        
        mockFamilyCoords = {
            'fam-near': { x: 110, y: 30 }, // distance = 10
            'fam-far': { x: 150, y: 30 }   // distance = 50
        };

        useGameStore.setState(state => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                villageData: {
                    families: [familyNear, familyFar]
                },
                buildingProgress
            }
        }));
    };

    const runDailyCycle = () => {
        // Since we patched both processDailyPublicHealth and orchestrator's nextDay,
        // we can trigger processDailyPublicHealth directly.
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

    it('without FOB mitigation, far family keeps multiplier 2.0', () => {
        // buildingProgress doesn't unlock FOB
        setupTestStore({ pustu: { completed: false }, polindes: { completed: false } });
        const multipliers = runDailyCycle();
        expect(multipliers['fam-far']).toBe(2.0);
    });

    it('with FOB mitigation active, same far family gets reduced multiplier', () => {
        // buildingProgress unlocks pustu
        setupTestStore({ pustu: { completed: true } });
        const multipliers = runDailyCycle();
        // Distance 50 with mitigation => effective distance = 30.
        // Distance 30 falls into 20-40 range => multiplier 1.5
        expect(multipliers['fam-far']).toBe(1.5);
    });

    it('near family never gets bonus below 1.0', () => {
        // Check near family with mitigation
        setupTestStore({ fob: { completed: true } });
        const multipliers = runDailyCycle();
        // Near distance is 10. Mitigation reduces effective distance to 0, but multiplier shouldn't go below 1.0.
        expect(multipliers['fam-near']).toBe(1.0);
    });

    it('both slices still default to existing behavior when buildingProgress missing', () => {
        // Setup without passing buildingProgress at all
        setupTestStore(undefined);
        const multipliers = runDailyCycle();
        // Should behave like no mitigation
        expect(multipliers['fam-far']).toBe(2.0);
        expect(multipliers['fam-near']).toBe(1.0);
    });
});
