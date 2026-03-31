import { describe, it, expect } from 'vitest';
import { selectUnlockedVillageVehicles } from '../store/selectors.js';

describe('selectUnlockedVillageVehicles', () => {
    it('returns minimal default jalan_kaki if state is missing/invalid', () => {
        expect(selectUnlockedVillageVehicles(null)).toEqual(['jalan_kaki']);
        expect(selectUnlockedVillageVehicles(undefined)).toEqual(['jalan_kaki']);
        expect(selectUnlockedVillageVehicles({})).toEqual(['jalan_kaki']);
        
        // Invalid nested structures
        expect(selectUnlockedVillageVehicles({ world: null, finance: null })).toEqual(['jalan_kaki']);
        
        // Negative day fallback scenario
        expect(selectUnlockedVillageVehicles({
            world: { day: -5 },
            finance: { stats: { kapitasi: 100, pendapatanUmum: 0 } }
        })).toEqual(['jalan_kaki']);
    });

    it('returns correct vehicle array based on progressing day and balance rules', () => {
        // Day 25 => sepeda unlocked
        const state1 = {
            world: { day: 25 },
            finance: { stats: { kapitasi: 5000, pendapatanUmum: 0 } }
        };
        expect(selectUnlockedVillageVehicles(state1)).toEqual(['jalan_kaki', 'sepeda']);

        // Day 50, but kapitasi 1.0M, pendapatanUmum 1.0M => total 2.0M => motor_dinas unlocked
        const state2 = {
            world: { day: 50 },
            finance: { stats: { kapitasi: 1_000_000, pendapatanUmum: 1_000_000 } }
        };
        expect(selectUnlockedVillageVehicles(state2)).toEqual(['jalan_kaki', 'sepeda', 'motor_dinas']);

        // Day 85, strictly kapitasi 10M => puskel unlocked
        const state3 = {
            world: { day: 85 },
            finance: { stats: { kapitasi: 10_000_000, pendapatanUmum: 0 } }
        };
        expect(selectUnlockedVillageVehicles(state3)).toEqual(['jalan_kaki', 'sepeda', 'motor_dinas', 'puskel']);
    });
});
