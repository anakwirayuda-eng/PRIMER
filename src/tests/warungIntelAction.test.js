import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';
import * as spatialContext from '../domains/village/spatialContext.js';
import { getWarungIntelCost } from '../domains/village/warungIntelCost.js';

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

describe('Warung Intel -> Store Action Integration', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.advanceTimersByTime(1000); // clear dispatchGuard stability lock
        mockFamilyCoords = {};
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    it('initial and reset publicHealth state keep lastIntelTargets canonical', () => {
        expect(useGameStore.getInitialState().publicHealth.lastIntelTargets).toBeNull();

        useGameStore.setState(state => ({
            publicHealth: {
                ...state.publicHealth,
                lastIntelTargets: [{ familyId: 'fam-temp', distance: 1 }]
            }
        }));

        useGameStore.getState().publicHealthActions.resetPublicHealth();

        const resetState = useGameStore.getState().publicHealth;
        expect(resetState.lastIntelTargets).toBeNull();
        expect(resetState.villageLedger).toEqual([]);
    });

    const setupTestStore = (energy, balance, time = 480) => {
        useGameStore.setState(state => ({
            ...state,
            player: {
                ...state.player,
                profile: { ...state.player.profile, energy }
            },
            finance: {
                ...state.finance,
                stats: { ...state.finance.stats, kapitasi: balance, pendapatanUmum: 0 }
            },
            world: {
                ...state.world,
                time
            },
            publicHealth: {
                ...state.publicHealth,
                villageData: { families: [] } // dummy structure
            }
        }));
    };

    it('success path deducts canonical energy, money, time and stores 5 nearest targets', () => {
        const canonicalCost = getWarungIntelCost();
        const startEnergy = 100;
        const startBalance = 50000;
        const startTime = 480;

        // Origin at 50, 50. families at 51,50 (1), 52,50 (2), 55,50 (5), etc.
        mockFamilyCoords = {
            'fam-far-1': { x: 100, y: 100 },
            'fam-far-2': { x: 90, y: 90 },
            'fam-near-1': { x: 51, y: 50 },
            'fam-near-2': { x: 52, y: 50 },
            'fam-near-3': { x: 50, y: 53 },
            'fam-near-4': { x: 49, y: 50 },
            'fam-near-5': { x: 50, y: 46 }
        };

        setupTestStore(startEnergy, startBalance, startTime);

        const res = useGameStore.getState().publicHealthActions.buyWarungIntel({ x: 50, y: 50 });
        
        expect(res.success).toBe(true);
        expect(res.targets.length).toBe(5);
        expect(res.targets[0].familyId).toBe('fam-near-1'); // closest
        
        const state = useGameStore.getState();
        expect(state.player.profile.energy).toBe(startEnergy - canonicalCost.energyCost);
        // Spend operational funds uses default behavior, if remaining is kapitasi:
        const remainingMoney = (state.finance.stats.kapitasi || 0) + (state.finance.stats.pendapatanUmum || 0);
        expect(remainingMoney).toBe(startBalance - canonicalCost.cashCost);
        expect(state.world.time).toBe(startTime + canonicalCost.timeCost);
        expect(state.publicHealth.lastIntelTargets).toEqual(res.targets);
    });

    it('unaffordable path does not mutate state', () => {
        const canonicalCost = getWarungIntelCost();
        // Too little money, enough energy
        const startEnergy = 100;
        const startBalance = canonicalCost.cashCost - 1000;
        const startTime = 480;

        mockFamilyCoords = { 'fam-near-1': { x: 51, y: 50 } };
        setupTestStore(startEnergy, startBalance, startTime);

        const stateBefore = useGameStore.getState();
        const res = stateBefore.publicHealthActions.buyWarungIntel({ x: 50, y: 50 });
        
        expect(res.success).toBe(false);
        expect(res.message).toContain('tidak cukup');
        
        const stateAfter = useGameStore.getState();
        // Exact reference equality since we aborted before calling set()
        expect(stateBefore.player).toBe(stateAfter.player);
        expect(stateBefore.finance).toBe(stateAfter.finance);
    });

    it('missing spatial context fails safely with no mutation', () => {
        const canonicalCost = getWarungIntelCost();
        const startEnergy = 100;
        const startBalance = canonicalCost.cashCost + 1000;
        const startTime = 480;

        // Deliberately reset mock to missing (or return empty from spy)
        mockFamilyCoords = undefined;
        setupTestStore(startEnergy, startBalance, startTime);

        const stateBefore = useGameStore.getState();
        const res = stateBefore.publicHealthActions.buyWarungIntel({ x: 50, y: 50 });
        
        expect(res.success).toBe(false);
        expect(res.message).toContain('Data peta');

        const stateAfter = useGameStore.getState();
        expect(stateBefore.player).toBe(stateAfter.player);
        expect(stateBefore.finance).toBe(stateAfter.finance);
    });

    it('invalid origin fails safely with no mutation', () => {
        const canonicalCost = getWarungIntelCost();
        const startEnergy = 100;
        const startBalance = canonicalCost.cashCost + 1000;
        const startTime = 480;

        mockFamilyCoords = { 'fam-near-1': { x: 51, y: 50 } };
        setupTestStore(startEnergy, startBalance, startTime);

        const stateBefore = useGameStore.getState();
        const res = stateBefore.publicHealthActions.buyWarungIntel(null);

        expect(res.success).toBe(false);
        expect(res.message).toContain('Target intel');

        const stateAfter = useGameStore.getState();
        expect(stateBefore.player).toBe(stateAfter.player);
        expect(stateBefore.finance).toBe(stateAfter.finance);
        expect(stateBefore.world).toBe(stateAfter.world);
    });
});
