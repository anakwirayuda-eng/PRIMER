import { describe, expect, it } from 'vitest';

import { MEDICATION_DATABASE } from '../data/MedicationDatabase.js';
import { AMBULANCES } from '../data/HospitalDB.js';
import { calculatePatientBill, calculatePrimaryCareRevenueForDecision } from '../game/BillingEngine.js';

const stockMedication = MEDICATION_DATABASE.find((med) => (med.buyPrice || 0) > 0 && med.form !== 'action');
const paidAmbulance = AMBULANCES.find((ambulance) => (ambulance.cost || 0) > 0);

describe('primary-care revenue contract', () => {
    it('uses real billing total for non-BPJS treated encounters', () => {
        const patient = {
            social: { hasBPJS: false },
            medicalData: {}
        };
        const decision = {
            action: 'treat',
            medications: stockMedication ? [{ id: stockMedication.id, frequency: 2, duration: 3 }] : [],
            procedures: [],
            labsRevealed: {}
        };

        const bill = calculatePatientBill(
            decision.medications,
            decision.procedures,
            decision.labsRevealed,
            patient.medicalData,
            false
        );

        expect(calculatePrimaryCareRevenueForDecision(patient, decision)).toBe(bill.total);
    });

    it('uses net-of-lab revenue for non-BPJS encounters when lab was already performed', () => {
        const patient = {
            social: { hasBPJS: false },
            labsRevealed: {
                gds: {
                    cost: 15000,
                    result: '312 mg/dL'
                }
            },
            medicalData: {}
        };
        const decision = {
            action: 'treat',
            medications: stockMedication ? [{ id: stockMedication.id, frequency: 1, duration: 2 }] : [],
            procedures: []
        };

        const bill = calculatePatientBill(
            decision.medications,
            decision.procedures,
            patient.labsRevealed,
            patient.medicalData,
            false
        );

        expect(calculatePrimaryCareRevenueForDecision(patient, decision)).toBe((bill.total || 0) - 15000);
    });

    it('uses buy-price burn for BPJS treated encounters', () => {
        const patient = {
            social: { hasBPJS: true },
            medicalData: {}
        };
        const decision = {
            action: 'treat',
            medications: stockMedication ? [{ id: stockMedication.id, frequency: 2, duration: 3 }] : [],
            procedures: [],
            labsRevealed: {}
        };

        const bill = calculatePatientBill(
            decision.medications,
            decision.procedures,
            decision.labsRevealed,
            patient.medicalData,
            true
        );

        expect(calculatePrimaryCareRevenueForDecision(patient, decision)).toBe(-bill.buyPriceTotal);
    });

    it('includes ordered lab burn from patient runtime data for BPJS encounters', () => {
        const patient = {
            social: { hasBPJS: true },
            labsRevealed: {
                gds: {
                    cost: 15000,
                    result: '312 mg/dL'
                }
            },
            medicalData: {}
        };
        const decision = {
            action: 'treat',
            medications: stockMedication ? [{ id: stockMedication.id, frequency: 1, duration: 2 }] : [],
            procedures: []
        };

        const bill = calculatePatientBill(
            decision.medications,
            decision.procedures,
            patient.labsRevealed,
            patient.medicalData,
            true
        );

        expect(calculatePrimaryCareRevenueForDecision(patient, decision)).toBe(-((bill.buyPriceTotal || 0) + 15000));
    });

    it('records accepted SISRUTE referrals as ambulance cost only', () => {
        const decision = {
            action: 'refer',
            isSISRUTE: true,
            referralDetails: {
                ambulanceId: paidAmbulance?.id,
                result: { status: 'ACCEPTED' }
            }
        };

        expect(calculatePrimaryCareRevenueForDecision({ social: { hasBPJS: false } }, decision)).toBe(-(paidAmbulance?.cost || 0));
    });

    it('keeps non-SISRUTE referrals at zero revenue impact', () => {
        expect(
            calculatePrimaryCareRevenueForDecision(
                { social: { hasBPJS: false } },
                { action: 'refer', isSISRUTE: false }
            )
        ).toBe(0);
    });
});
