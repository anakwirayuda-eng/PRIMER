import { describe, it, expect, vi } from 'vitest';
import { selectLocalChampionState } from '../store/selectors.js';
import * as localChampion from '../domains/village/localChampion.js';
import * as championProtection from '../domains/village/championProtection.js';
import * as spatialContext from '../domains/village/spatialContext.js';

vi.mock('../domains/village/localChampion.js', () => ({
    isLocalChampionEligible: vi.fn()
}));
vi.mock('../domains/village/championProtection.js', () => ({
    getChampionProtectedFamilies: vi.fn()
}));
vi.mock('../domains/village/spatialContext.js', () => ({
    getSpatialContext: vi.fn()
}));

describe('selectLocalChampionState', () => {
    it('returns safe fallback values when state or villageData is missing/invalid', () => {
        const expected = {
            championFamilyIds: [],
            protectedFamilyIds: [],
            championCount: 0,
            protectedCount: 0
        };
        
        expect(selectLocalChampionState(null)).toEqual(expected);
        expect(selectLocalChampionState(undefined)).toEqual(expected);
        expect(selectLocalChampionState({})).toEqual(expected);
        expect(selectLocalChampionState({ publicHealth: null })).toEqual(expected);
        expect(selectLocalChampionState({ publicHealth: { villageData: { families: [] } } })).toEqual(expected);
    });

    it('correctly returns champion and protected state with correct underlying helper delegations', () => {
        const state = {
            publicHealth: {
                villageData: {
                    families: [
                        { id: 'f1', iksScore: 1.0 },
                        { id: 'f2', iksScore: 0.5 },
                        { id: 'f3', iksScore: 0.9 }
                    ]
                }
            }
        };

        localChampion.isLocalChampionEligible.mockImplementation((score) => score >= 1.0);
        
        spatialContext.getSpatialContext.mockReturnValue({
            familyCoords: { 'f1': { x: 0, y: 0 }, 'f2': { x: 1, y: 1 }, 'f3': { x: 2, y: 2 } }
        });
        
        championProtection.getChampionProtectedFamilies.mockReturnValue(['f2', 'f3']);

        const result = selectLocalChampionState(state);

        expect(result.championFamilyIds).toEqual(['f1']);
        expect(result.protectedFamilyIds).toEqual(['f2', 'f3']);
        expect(result.championCount).toBe(1);
        expect(result.protectedCount).toBe(2);

        // Ensure helpers were called correctly
        expect(localChampion.isLocalChampionEligible).toHaveBeenCalledWith(1.0);
        expect(localChampion.isLocalChampionEligible).toHaveBeenCalledWith(0.5);
        expect(localChampion.isLocalChampionEligible).toHaveBeenCalledWith(0.9);
        expect(spatialContext.getSpatialContext).toHaveBeenCalledWith(state.publicHealth.villageData);
        expect(championProtection.getChampionProtectedFamilies).toHaveBeenCalledWith(
            ['f1'],
            { 'f1': { x: 0, y: 0 }, 'f2': { x: 1, y: 1 }, 'f3': { x: 2, y: 2 } },
            3
        );
    });
});
