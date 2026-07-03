import { describe, expect, it } from 'vitest';

import { evaluateConsequences } from '../game/ConsequenceEngine.js';

describe('ConsequenceEngine', () => {
    it('does not schedule a good outcome when overall clinical care is still incomplete', () => {
        const result = evaluateConsequences({
            trueDiagnosisCode: 'J00',
            category: 'General'
        }, {
            action: 'treat',
            diagnosis: ['J00'],
            medications: ['paracetamol'],
            diagnosisScore: 100,
            treatmentScore: 100,
            clinicalQualityScore: 45,
            isClinicalCareComplete: false,
            patientName: 'Test'
        }, 1);

        expect(result).toBeNull();
    });

    it('still schedules a good outcome when diagnosis, treatment, and overall care are complete', () => {
        const result = evaluateConsequences({
            trueDiagnosisCode: 'J00',
            category: 'General'
        }, {
            action: 'treat',
            diagnosis: ['J00'],
            medications: ['paracetamol'],
            diagnosisScore: 100,
            treatmentScore: 100,
            clinicalQualityScore: 88,
            isClinicalCareComplete: true,
            patientName: 'Test'
        }, 1);

        expect(result?.ruleId).toBe('good_outcome');
    });
});
