import { describe, expect, it } from 'vitest';

import { buildDailyArchiveEntry } from '../store/helpers/archiveHelpers.js';

describe('archiveHelpers daily archive', () => {
    it('merges todayLog-only encounters into the archived day without double-counting history duplicates', () => {
        const state = {
            player: {
                profile: {
                    reputation: 82
                }
            },
            clinical: {
                history: [
                    {
                        id: 'hist-1',
                        day: 4,
                        name: 'Rina',
                        age: 26,
                        gender: 'P',
                        joinedAt: 480,
                        social: { hasBPJS: false },
                        medicalData: {
                            trueDiagnosisCode: 'J00',
                            diagnosisName: 'Nasofaringitis akut'
                        },
                        decision: {
                            action: 'delegate_to_maia',
                            diagnoses: ['J00'],
                            medications: []
                        },
                        satisfactionScore: 78
                    }
                ],
                todayLog: [
                    {
                        patientId: 'hist-1',
                        patientName: 'Rina',
                        age: 26,
                        gender: 'P',
                        diagnosis: 'J00',
                        diagnosisName: 'Nasofaringitis akut',
                        action: 'delegate_to_maia',
                        completed: true,
                        referred: false,
                        diagnosisScore: 100,
                        revenue: 25000,
                        joinedAt: 480,
                        hasBPJS: false,
                        satisfactionScore: 78,
                        facility: 'poli_umum'
                    },
                    {
                        patientId: 'miss-1',
                        patientName: 'Budi',
                        age: 41,
                        gender: 'L',
                        diagnosis: 'R50.9',
                        diagnosisName: 'Demam',
                        action: 'left_without_service',
                        completed: false,
                        referred: false,
                        missed: true,
                        leftWithoutService: true,
                        reason: 'queue_timeout',
                        revenue: 0,
                        joinedAt: 540,
                        hasBPJS: true,
                        facility: 'poli_umum'
                    },
                    {
                        patientId: 'ref-1',
                        patientName: 'Dewi',
                        age: 33,
                        gender: 'P',
                        diagnosis: 'J45.9',
                        diagnosisName: 'Asma',
                        action: 'refer',
                        completed: false,
                        referred: true,
                        diagnosisScore: 100,
                        revenue: 30000,
                        joinedAt: 600,
                        hasBPJS: false,
                        facility: 'igd'
                    }
                ]
            }
        };

        const archivedDay = buildDailyArchiveEntry(state, 4);

        expect(archivedDay).toMatchObject({
            day: 4,
            patientsToday: 3,
            revenue: 55000,
            reputation: 82
        });
        expect(archivedDay.hourlyTraffic).toEqual(expect.arrayContaining([
            { label: '08:00', value: 1 },
            { label: '09:00', value: 1 },
            { label: '10:00', value: 1 }
        ]));
        expect(archivedDay.topDiseases).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'Nasofaringitis akut', count: 1 }),
            expect.objectContaining({ name: 'Demam', count: 1 }),
            expect.objectContaining({ name: 'Asma', count: 1 })
        ]));
        expect(archivedDay.overallScore).toBeGreaterThan(0);
    });

    it('prefers richer todayLog data when a history duplicate would understate archive revenue', () => {
        const state = {
            player: {
                profile: {
                    reputation: 79
                }
            },
            clinical: {
                history: [
                    {
                        id: 'dup-1',
                        day: 6,
                        name: 'Tono',
                        age: 52,
                        gender: 'L',
                        joinedAt: 510,
                        social: { hasBPJS: true },
                        medicalData: {
                            trueDiagnosisCode: 'E11.9',
                            diagnosisName: 'DM Tipe 2'
                        },
                        decision: {
                            action: 'treat',
                            diagnoses: ['E11.9'],
                            medications: []
                        },
                        satisfactionScore: 82
                    }
                ],
                todayLog: [
                    {
                        patientId: 'dup-1',
                        patientName: 'Tono',
                        age: 52,
                        gender: 'L',
                        diagnosis: 'E11.9',
                        diagnosisName: 'DM Tipe 2',
                        action: 'treat',
                        completed: true,
                        referred: false,
                        diagnosisScore: 100,
                        revenue: -45000,
                        joinedAt: 510,
                        hasBPJS: true,
                        satisfactionScore: 82,
                        facility: 'poli_umum'
                    }
                ]
            }
        };

        const archivedDay = buildDailyArchiveEntry(state, 6);

        expect(archivedDay).toMatchObject({
            day: 6,
            patientsToday: 1,
            revenue: -45000,
            reputation: 79
        });
        expect(archivedDay.topDiseases[0]).toMatchObject({
            name: 'DM Tipe 2',
            count: 1
        });
    });
});
