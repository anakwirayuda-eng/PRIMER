import { describe, expect, it } from 'vitest';
import {
    buildReferralLogEntry,
    reconcileReferralLog
} from '../utils/referralLog.js';

describe('referralLog', () => {
    it('dedupes repeated patient logs and promotes overdue referrals to ARRIVED', () => {
        const result = reconcileReferralLog([
            {
                id: 'old-ref',
                patientId: 'p-1',
                patientName: 'Siti',
                hospitalName: 'RS Lama',
                distance: 12,
                ambulanceType: 'Basic',
                sentDay: 1,
                timeSent: 480,
                status: 'EN_ROUTE'
            },
            {
                id: 'new-ref',
                patientId: 'p-1',
                patientName: 'Siti',
                hospitalName: 'RS Baru',
                distance: 10,
                ambulanceType: 'Advance',
                sentDay: 1,
                timeSent: 540,
                status: 'EN_ROUTE'
            }
        ], 1, 600);

        expect(result.activeReferralLog).toHaveLength(1);
        expect(result.newlyArrived).toHaveLength(1);
        expect(result.activeReferralLog[0].status).toBe('ARRIVED');
        expect(result.activeReferralLog[0].hospitalName).toBe('RS Baru');
        expect(result.activeReferralLog[0].arrivalNote).toBeTruthy();
    });

    it('keeps newly arrived referrals for one reconcile pass and clears them later', () => {
        const entry = buildReferralLogEntry({
            patient: {
                id: 'p-2',
                name: 'Budi',
                medicalData: { trueDiagnosisCode: 'I21.9', diagnosisName: 'STEMI' }
            },
            hospital: { name: 'RS Kota', distance: 8 },
            ambulance: { type: 'Advance' },
            day: 1,
            time: 480,
            travelDurationMinutes: 15
        });

        const arrived = reconcileReferralLog([entry], 1, 600);
        expect(arrived.activeReferralLog).toHaveLength(1);
        expect(arrived.activeReferralLog[0].status).toBe('ARRIVED');

        const cleared = reconcileReferralLog(arrived.activeReferralLog, 1, 700);
        expect(cleared.activeReferralLog).toHaveLength(0);
    });
});
