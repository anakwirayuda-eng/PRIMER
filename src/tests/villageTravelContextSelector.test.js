import { describe, it, expect, vi } from 'vitest';
import { selectVillageTravelContext } from '../store/selectors.js';
import * as IKMEventEngine from '../game/IKMEventEngine.js';

vi.mock('../game/IKMEventEngine.js', () => ({
    getSeasonForDay: vi.fn()
}));

describe('selectVillageTravelContext', () => {
    it('returns combined safe fallbacks when state is empty/invalid', () => {
        const expectedBridgeState = expect.objectContaining({ status: 'normal', eastTravelMultiplier: 1.0 });
        const result = selectVillageTravelContext(null);
        
        expect(result.unlockedVehicles).toEqual(['jalan_kaki']);
        expect(result.bridgeState).toEqual(expectedBridgeState);
    });

    it('returns correct combined state from both underlying selectors', () => {
        IKMEventEngine.getSeasonForDay.mockReturnValue('rainy');
        // Day 150 unlocks sepeda and is rainy (hujan)
        const state = {
            world: { day: 150 },
            finance: { stats: { kapitasi: 50_000, pendapatanUmum: 0 } }
        };
        
        const result = selectVillageTravelContext(state);
        expect(result.unlockedVehicles).toEqual(['jalan_kaki', 'sepeda']);
        expect(result.bridgeState.status).toBe('rawan_banjir');
        expect(result.bridgeState.eastTravelMultiplier).toBe(2.0);
    });

    it('passes through isExtremeRain parameter precisely to bridge selector', () => {
        IKMEventEngine.getSeasonForDay.mockReturnValue('rainy');
        const state = {
            world: { day: 100 },
            finance: { stats: { kapitasi: 0, pendapatanUmum: 0 } }
        };
        
        const result = selectVillageTravelContext(state, true);
        expect(result.unlockedVehicles).toEqual(['jalan_kaki', 'sepeda']);
        expect(result.bridgeState.status).toBe('putus');
        expect(result.bridgeState.isIsolated).toBe(true);
    });
});
