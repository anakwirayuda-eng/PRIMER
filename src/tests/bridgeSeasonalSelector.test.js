import { describe, it, expect, vi } from 'vitest';
import { selectBridgeSeasonalState } from '../store/selectors.js';
import * as IKMEventEngine from '../game/IKMEventEngine.js';

vi.mock('../game/IKMEventEngine.js', () => ({
    getSeasonForDay: vi.fn()
}));

describe('selectBridgeSeasonalState', () => {
    it('returns normal kemarau state fallback when state/day is missing/invalid', () => {
        const expected = expect.objectContaining({ status: 'normal', eastTravelMultiplier: 1.0 });
        
        expect(selectBridgeSeasonalState(null)).toEqual(expected);
        expect(selectBridgeSeasonalState(undefined)).toEqual(expected);
        expect(selectBridgeSeasonalState({})).toEqual(expected);
        expect(selectBridgeSeasonalState({ world: null })).toEqual(expected);
        expect(selectBridgeSeasonalState({ world: { day: -10 } })).toEqual(expected);
    });

    it('maps dry season to kemarau and uses default isExtremeRain = false', () => {
        IKMEventEngine.getSeasonForDay.mockReturnValue('dry');
        
        const result = selectBridgeSeasonalState({ world: { day: 10 } });
        expect(result.status).toBe('normal');
        expect(result.eastTravelMultiplier).toBe(1.0);
        expect(result.isIsolated).toBe(false);
    });

    it('maps rainy season to hujan', () => {
        IKMEventEngine.getSeasonForDay.mockReturnValue('rainy');
        
        const result = selectBridgeSeasonalState({ world: { day: 160 } });
        expect(result.status).toBe('rawan_banjir');
        expect(result.eastTravelMultiplier).toBe(2.0);
        expect(result.isIsolated).toBe(false);
    });

    it('maps rainy season + extreme rain flag to putus state', () => {
        IKMEventEngine.getSeasonForDay.mockReturnValue('rainy');
        
        const result = selectBridgeSeasonalState({ world: { day: 165 } }, true);
        expect(result.status).toBe('putus');
        expect(result.isIsolated).toBe(true);
        expect(result.isolationDays).toBe(3);
        expect(result.isAmbulanceDelayed).toBe(true);
    });
});
