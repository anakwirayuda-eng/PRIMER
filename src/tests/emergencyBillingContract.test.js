import { describe, expect, it } from 'vitest';
import {
    calculateEmergencyBill,
    calculateEmergencyBillForPatient,
    getEmergencyCase
} from '../game/EmergencyCases.js';

describe('emergency billing contract', () => {
    it('preserves BPJS coverage and triage when billing a patient with authored case data', () => {
        const caseData = {
            billingItems: {
                tindakan: [{ code: '99.29', name: 'Anti-HT IV', cost: 100000 }],
                obat: [],
                alkes: []
            }
        };

        const patient = {
            social: { hasBPJS: true },
            triageLevel: 1,
            hidden: { caseData }
        };

        const direct = calculateEmergencyBill(['nicardipine_drip'], caseData, true, 1);
        const viaPatient = calculateEmergencyBillForPatient(patient, ['nicardipine_drip'], 1);

        expect(viaPatient).toEqual(direct);
        expect(viaPatient.isCovered).toBe(true);
        expect(viaPatient.finalBill).toBe(0);
    });

    it('falls back to the authored emergency registry case via hidden.diseaseId', () => {
        const registryCase = getEmergencyCase('hypertensive_crisis');
        expect(registryCase?.billingItems).toBeTruthy();

        const patient = {
            social: { hasBPJS: true },
            triageLevel: 2,
            hidden: { diseaseId: 'hypertensive_crisis' }
        };

        const bill = calculateEmergencyBillForPatient(patient, ['nicardipine_drip', 'iv_line'], 2);

        expect(bill.total).toBeGreaterThan(50000);
        expect(bill.isCovered).toBe(true);
        expect(bill.finalBill).toBe(0);
    });
});
