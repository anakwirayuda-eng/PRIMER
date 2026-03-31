import { describe, it, expect } from 'vitest';
import { getBridgeSeasonalState } from '../domains/village/bridgeSeasonalState.js';

describe('Geo Law 2b: Jembatan Gantung Seasonal State', () => {

    it('returns normal state with 0% travel penalty during kemarau', () => {
        const state = getBridgeSeasonalState('kemarau', false);
        expect(state).toEqual({
            status: 'normal',
            eastTravelMultiplier: 1.0,
            isIsolated: false,
            isAmbulanceDelayed: false,
            severityBoost: 0,
            isolationDays: 0
        });
    });

    it('returns rawan_banjir state with +100% travel penalty during hujan', () => {
        const state = getBridgeSeasonalState('hujan', false);
        expect(state).toEqual({
            status: 'rawan_banjir',
            eastTravelMultiplier: 2.0,
            isIsolated: false,
            isAmbulanceDelayed: false,
            severityBoost: 0,
            isolationDays: 0
        });
    });

    it('returns putus state when extreme rain triggers (triggering isolation mechanics)', () => {
        // Hujan + extreme
        const state1 = getBridgeSeasonalState('hujan', true);
        expect(state1).toEqual({
            status: 'putus',
            eastTravelMultiplier: Infinity,
            isIsolated: true,
            isAmbulanceDelayed: true,
            severityBoost: 1, // Pasien sampai UGD sudah parah
            isolationDays: 3  // Downtime jembatan
        });

        // Even in missing season arg, extreme flag dominates
        const state2 = getBridgeSeasonalState(undefined, true);
        expect(state2.status).toBe('putus');
    });

    it('safely handles invalid season inputs and defaults to kemarau state', () => {
        const expectedDefault = {
            status: 'normal',
            eastTravelMultiplier: 1.0,
            isIsolated: false,
            isAmbulanceDelayed: false,
            severityBoost: 0,
            isolationDays: 0
        };

        expect(getBridgeSeasonalState(null, false)).toEqual(expectedDefault);
        expect(getBridgeSeasonalState(12345, false)).toEqual(expectedDefault);
        expect(getBridgeSeasonalState({}, false)).toEqual(expectedDefault);
        expect(getBridgeSeasonalState('  mUSiM_gAuL  ', false)).toEqual(expectedDefault);
    });

});
