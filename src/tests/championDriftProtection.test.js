import { describe, it, expect } from 'vitest';
import { applyFamilyIndicatorDrift } from '../store/helpers/publicHealthHelpers.js';

describe('applyFamilyIndicatorDrift with options.protectedFamilyIds', () => {
    const seed = 'test-seed';
    
    it('skips indicator drift when family ID is in protectedFamilyIds', () => {
        const initialIndicators = { gizi_balita: true, sumber_air: true };
        const family = { id: 'fam_1', indicators: initialIndicators };
        
        // Pass fam_1 as protected
        const result = applyFamilyIndicatorDrift(family, seed, { protectedFamilyIds: ['fam_1', 'fam_2'] });
        
        // Ensure family is returned unchanged exactly
        expect(result).toBe(family);
    });

    it('applies standard logic if family id is NOT in protectedFamilyIds', () => {
        const family = { id: 'fam_3', indicators: { asuransi: true } };
        
        // Provide another family ID in the protected list, but not fam_3
        const result = applyFamilyIndicatorDrift(family, seed, { protectedFamilyIds: ['fam_1'] });
        
        expect(result).toBeDefined();
        expect(result.id).toBe('fam_3');
    });

    it('handles undefined options and missing protectedFamilyIds gracefully', () => {
        const family = { id: 'fam_4', indicators: { asi_eksklusif: true } };
        
        // No options passed
        expect(applyFamilyIndicatorDrift(family, seed)).toBeDefined();
        
        // Empty options
        expect(applyFamilyIndicatorDrift(family, seed, {})).toBeDefined();
    });

    it('returns missing family safely even when protectedFamilyIds is provided', () => {
        expect(applyFamilyIndicatorDrift(undefined, seed, { protectedFamilyIds: ['fam_1'] })).toBeUndefined();
    });
});
