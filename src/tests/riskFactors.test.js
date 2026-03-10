/**
 * @reflection
 * [IDENTITY]: Risk Factors Logic Test
 * [PURPOSE]: Unit tests for patient risk factor calculation (IKS indicators).
 * [STATE]: Stable
 */
import { describe, it, expect } from 'vitest';
import { calculateRiskFactors } from '../domains/village/VillageRegistry.js';

describe('calculateRiskFactors', () => {
    it('should identify sanitation and water risks from indicators', () => {
        const indicators = { jamban: false, air: false, rokok: true, jkn: true };
        const member = { age: 25 };
        const sdoh = {};

        const risks = calculateRiskFactors(indicators, member, sdoh);

        expect(risks).toContain('poor_sanitation');
        expect(risks).toContain('unsafe_water');
    });

    it('should identify smoking and uninsured risks', () => {
        const indicators = { jamban: true, air: true, rokok: false, jkn: false };
        const member = { age: 30 };
        const sdoh = {};

        const risks = calculateRiskFactors(indicators, member, sdoh);

        expect(risks).toContain('smoke_exposure');
        expect(risks).toContain('uninsured');
    });

    it('should flag uncontrolled hypertension for adults over 40', () => {
        const indicators = { hipertensi: false };
        const memberOver40 = { age: 45 };
        const memberUnder40 = { age: 35 };

        const risksOver40 = calculateRiskFactors(indicators, memberOver40, {});
        const risksUnder40 = calculateRiskFactors(indicators, memberUnder40, {});

        expect(risksOver40).toContain('uncontrolled_hypertension');
        expect(risksUnder40).not.toContain('uncontrolled_hypertension');
    });

    it('should flag diabetes risk from diet in SDOH', () => {
        const indicators = {};
        const member = { age: 30 };
        const sdoh = { diet: 'High Sugar' };

        const risks = calculateRiskFactors(indicators, member, sdoh);

        expect(risks).toContain('diabetes_risk');
    });

    it('should flag profile-specific risks like stunting', () => {
        const indicators = {};
        const member = { age: 4 };
        const sdoh = {};
        const profile = { conditions: ['stunting_risk'] };

        const risks = calculateRiskFactors(indicators, member, sdoh, profile);

        expect(risks).toContain('stunting');
    });
});
