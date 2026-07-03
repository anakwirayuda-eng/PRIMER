import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AMBULANCES, HOSPITALS } from '../data/HospitalDB.js';
import { validateTreatment } from '../game/ValidationEngine.js';
import { useGameStore } from '../store/useGameStore.js';

vi.mock('../utils/SoundManager', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

vi.mock('../utils/dispatchGuard.js', () => ({
    dispatchGuard: (_name, fn) => fn,
    guardActionGroup: (_groupName, actionGroup) => actionGroup,
    buildRuntimeTrap: vi.fn((actionName, details = {}) => ({
        active: true,
        actionName,
        phase: details.phase || 'runtime',
        failures: details.failures || [],
        occurredAt: Date.now(),
        message: details.reason || 'runtime trap'
    })),
    triggerFreezeProtocol: vi.fn()
}));

function seedQuestState() {
    useGameStore.setState((state) => ({
        ...state,
        meta: {
            ...state.meta,
            activeQuests: [
                {
                    id: 'treat_patients_20',
                    type: 'weekly',
                    label: 'Dokter Handal',
                    description: 'Tangani 20 pasien di klinik',
                    target: 20,
                    metric: 'patients_treated',
                    xp: 200,
                    icon: 'xp',
                    progress: 0,
                    completed: false,
                    claimed: false
                }
            ]
        }
    }));
}

describe('clinical workflow fixes', () => {
    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
        seedQuestState();
    });

    it('counts required procedures in treatment validation', () => {
        const result = validateTreatment(
            {
                correctTreatment: ['paracetamol'],
                correctProcedures: ['nebulization']
            },
            [{ id: 'paracetamol' }],
            []
        );

        expect(result.score).toBe(50);
        expect(result.isRequiredCareComplete).toBe(false);
        expect(result.missingProcs).toHaveLength(1);
    });

    it('fails discharge success when diagnosis or required procedures are missing', () => {
        const patient = {
            id: 'p-1',
            name: 'Rina',
            age: 28,
            gender: 'P',
            social: { hasBPJS: true },
            hidden: { requiredAction: 'treat' },
            medicalData: {
                trueDiagnosisCode: 'J00',
                diagnosisName: 'Common Cold',
                correctTreatment: ['paracetamol'],
                correctProcedures: ['nebulization'],
                requiredEducation: ['rest']
            }
        };

        act(() => {
            useGameStore.getState().clinicalActions.dischargePatient(patient, {
                action: 'treat',
                diagnoses: ['J00'],
                medications: [{ id: 'paracetamol', frequency: 3, duration: 3 }],
                procedures: [],
                education: [],
                examsPerformed: [],
                labsRevealed: {},
                anamnesisScore: 90
            }, 1, 600);
        });

        const state = useGameStore.getState();
        expect(state.finance.kpi.correctTreatments).toBe(0);
        expect(state.player.profile.xp).toBe(10);
        expect(state.clinical.todayLog).toHaveLength(1);
        expect(state.clinical.todayLog[0].clinicalQualityScore).toBeLessThan(70);
    });

    it('does not count treatment as complete when one required education item is omitted', () => {
        const patient = {
            id: 'edu-1',
            name: 'Ayu',
            age: 31,
            gender: 'P',
            social: { hasBPJS: true },
            hidden: { requiredAction: 'treat' },
            medicalData: {
                trueDiagnosisCode: 'J00',
                diagnosisName: 'Common Cold',
                correctTreatment: ['paracetamol'],
                requiredEducation: ['rest', 'fluid_intake', 'hand_hygiene', 'sleep_hygiene'],
                physicalExamFindings: {
                    general: 'Tampak sakit ringan',
                    heent: 'Faring hiperemis ringan'
                }
            }
        };

        act(() => {
            useGameStore.getState().clinicalActions.dischargePatient(patient, {
                action: 'treat',
                diagnoses: ['J00'],
                medications: [{ id: 'paracetamol', frequency: 3, duration: 3 }],
                procedures: [],
                education: ['rest', 'fluid_intake', 'hand_hygiene'],
                examsPerformed: ['general', 'heent'],
                labsRevealed: {},
                anamnesisScore: 90
            }, 1, 600);
        });

        const state = useGameStore.getState();
        expect(state.finance.kpi.correctTreatments).toBe(0);
        expect(state.clinical.todayLog[0].educationScore).toBe(75);
        expect(state.clinical.todayLog[0].clinicalQualityScore).toBeGreaterThan(70);
        expect(state.clinical.consequenceQueue).toHaveLength(0);
    });

    it('does not count treatment as complete when one required lab is omitted', () => {
        const patient = {
            id: 'exam-1',
            name: 'Dian',
            age: 44,
            gender: 'P',
            social: { hasBPJS: true },
            hidden: { requiredAction: 'treat' },
            medicalData: {
                trueDiagnosisCode: 'E11.9',
                diagnosisName: 'Diabetes Melitus Tipe 2',
                correctTreatment: ['metformin_500'],
                requiredEducation: ['diet_low_sugar'],
                relevantLabs: ['Gula Darah Puasa', 'HbA1c'],
                physicalExamFindings: {
                    general: 'Compos mentis',
                    vitals: { bp: '140/90' },
                    heent: 'Mukosa agak kering',
                    extremities: 'Tidak ada luka kaki'
                }
            }
        };

        act(() => {
            useGameStore.getState().clinicalActions.dischargePatient(patient, {
                action: 'treat',
                diagnoses: ['E11.9'],
                medications: [{ id: 'metformin_500', frequency: 2, duration: 30 }],
                procedures: [],
                education: ['diet_low_sugar'],
                examsPerformed: ['general', 'vitals', 'heent', 'extremities'],
                labsRevealed: {
                    'Gula Darah Puasa': {
                        result: '186 mg/dL',
                        cost: 10000
                    }
                },
                anamnesisScore: 90
            }, 1, 600);
        });

        const state = useGameStore.getState();
        expect(state.finance.kpi.correctTreatments).toBe(0);
        expect(state.clinical.todayLog[0].examScore).toBe(80);
        expect(state.clinical.todayLog[0].clinicalQualityScore).toBeGreaterThan(70);
        expect(state.clinical.consequenceQueue).toHaveLength(0);
    });

    it('logs accepted primary-care SISRUTE referrals into todayLog', () => {
        const patient = {
            id: 'p-ref',
            name: 'Budi',
            age: 55,
            gender: 'L',
            social: { hasBPJS: true },
            hidden: { requiredAction: 'refer' },
            medicalData: {
                trueDiagnosisCode: 'I21.9',
                diagnosisName: 'STEMI'
            }
        };

        act(() => {
            useGameStore.getState().clinicalActions.dischargePatient(patient, {
                action: 'refer',
                diagnoses: ['I21.9'],
                isSISRUTE: true,
                referralDetails: {
                    hospitalId: HOSPITALS[0].id,
                    ambulanceId: AMBULANCES[0].id,
                    result: { status: 'ACCEPTED' }
                },
                repBonus: 5,
                satisfaction: 80
            }, 1, 600);
        });

        const todayLog = useGameStore.getState().clinical.todayLog;
        expect(todayLog).toHaveLength(1);
        expect(todayLog[0].referred).toBe(true);
        expect(todayLog[0].action).toBe('refer');
    });

    it('records accepted IGD referrals in KPI, log, and quest progress', () => {
        const patient = {
            id: 'igd-1',
            name: 'Sari',
            age: 47,
            gender: 'P',
            social: { hasBPJS: true },
            triageLevel: 1,
            hidden: {
                requiredAction: 'refer',
                referralRequired: true
            },
            medicalData: {
                trueDiagnosisCode: 'I21.9',
                diagnosisName: 'STEMI'
            }
        };

        useGameStore.setState((state) => ({
            ...state,
            clinical: {
                ...state.clinical,
                emergencyQueue: [patient]
            }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.dischargeEmergencyPatient(patient, {
                action: 'refer',
                isSISRUTE: true,
                referralDetails: {
                    hospitalId: HOSPITALS[0].id,
                    ambulanceId: AMBULANCES[0].id,
                    result: { status: 'ACCEPTED' }
                },
                repBonus: 7,
                satisfaction: 88,
                actionsPerformed: ['oxygen', 'iv_line']
            }, 1, 600);
        });

        const state = useGameStore.getState();
        expect(state.finance.kpi.referrals).toBe(1);
        expect(state.finance.kpi.totalPatients).toBe(1);
        expect(state.clinical.todayLog[0].referred).toBe(true);
        expect(state.meta.activeQuests[0].progress).toBe(1);
        expect(state.clinical.emergencyQueue[0].status).toBe('sisrute_limbo');
    });

    it('burns kapitasi for BPJS lab orders', () => {
        useGameStore.setState((state) => ({
            ...state,
            finance: {
                ...state.finance,
                stats: {
                    ...state.finance.stats,
                    kapitasi: 100_000,
                    pendapatanUmum: 20_000,
                    pengeluaranLab: 0
                }
            },
            clinical: {
                ...state.clinical,
                queue: [
                    {
                        id: 'lab-1',
                        name: 'Test Lab',
                        social: { hasBPJS: true },
                        medicalData: { trueDiagnosisCode: 'E11.9' }
                    }
                ]
            }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.orderLab('lab-1', 'gds', 10_000);
        });

        const stats = useGameStore.getState().finance.stats;
        expect(stats.kapitasi).toBe(90_000);
        expect(stats.pengeluaranLab).toBe(10_000);
    });

    it('does not burn kapitasi for non-BPJS lab orders before discharge settlement', () => {
        useGameStore.setState((state) => ({
            ...state,
            finance: {
                ...state.finance,
                stats: {
                    ...state.finance.stats,
                    kapitasi: 100_000,
                    pendapatanUmum: 20_000,
                    pengeluaranLab: 0
                }
            },
            clinical: {
                ...state.clinical,
                queue: [
                    {
                        id: 'lab-umum-1',
                        name: 'Pasien Umum',
                        social: { hasBPJS: false },
                        medicalData: { trueDiagnosisCode: 'E11.9' }
                    }
                ]
            }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.orderLab('lab-umum-1', 'gds', 10_000);
        });

        const stats = useGameStore.getState().finance.stats;
        expect(stats.kapitasi).toBe(100_000);
        expect(stats.pendapatanUmum).toBe(20_000);
        expect(stats.pengeluaranLab).toBe(10_000);
    });

    it('stores authored case-specific lab results instead of placeholder flags', () => {
        useGameStore.setState((state) => ({
            ...state,
            finance: {
                ...state.finance,
                stats: {
                    ...state.finance.stats,
                    kapitasi: 100_000,
                    pendapatanUmum: 20_000,
                    pengeluaranLab: 0
                }
            },
            clinical: {
                ...state.clinical,
                queue: [
                    {
                        id: 'lab-case-1',
                        name: 'Anthrax Case',
                        social: { hasBPJS: true },
                        medicalData: {
                            trueDiagnosisCode: 'A22.0',
                            labs: {
                                'Gram Stain Lesi': {
                                    result: 'Basil gram positif berkapsul (Bacillus anthracis suspect)',
                                    cost: 30_000
                                }
                            }
                        }
                    }
                ]
            }
        }));

        let orderResult;
        act(() => {
            orderResult = useGameStore.getState().clinicalActions.orderLab('lab-case-1', 'Gram Stain', 50_000);
        });

        const orderedPatient = useGameStore.getState().clinical.queue[0];
        const stats = useGameStore.getState().finance.stats;

        expect(orderResult?.ok).toBe(true);
        expect(orderResult?.orderKey).toBe('Gram Stain Lesi');
        expect(orderedPatient.labsRevealed['Gram Stain Lesi'].result).toContain('Bacillus anthracis');
        expect(typeof orderedPatient.labsRevealed['Gram Stain Lesi']).toBe('object');
        expect(stats.kapitasi).toBe(70_000);
        expect(stats.pengeluaranLab).toBe(30_000);
    });

    it('writes missed encounter logs for queue timeout and clinic close', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 1, time: 900 },
            clinical: {
                ...state.clinical,
                activePatientId: 'late-1',
                queue: [
                    {
                        id: 'late-1',
                        name: 'Late Patient',
                        age: 34,
                        medicalData: { trueDiagnosisCode: 'R50.9' },
                        joinedAt: 480
                    }
                ]
            }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.processDailyTick();
        });

        let state = useGameStore.getState();
        expect(state.clinical.todayLog.some((entry) => entry.reason === 'queue_timeout')).toBe(true);
        expect(state.clinical.activePatientId).toBeNull();

        useGameStore.setState((current) => ({
            ...current,
            world: { ...current.world, time: 960 },
            clinical: {
                ...current.clinical,
                queue: [
                    {
                        id: 'close-1',
                        name: 'Closing Patient',
                        age: 41,
                        medicalData: { trueDiagnosisCode: 'J06.9' },
                        joinedAt: 930
                    }
                ]
            }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.processDailyTick();
        });

        state = useGameStore.getState();
        expect(state.clinical.todayLog.some((entry) => entry.reason === 'clinic_closed')).toBe(true);
    });

    it('spawns queued ukp_bridge consequences into clinical patients instead of dropping them', () => {
        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 10, time: 480 },
            publicHealth: {
                ...state.publicHealth,
                villageData: {
                    ...state.publicHealth.villageData,
                    families: [
                        {
                            id: 'kk_bridge',
                            surname: 'Santoso',
                            houseId: 'house_bridge',
                            members: [
                                { id: 'adult_1', firstName: 'Bambang', gender: 'L', age: 55 }
                            ]
                        }
                    ]
                }
            },
            clinical: {
                ...state.clinical,
                queue: [],
                consequenceQueue: [
                    {
                        id: 'ukp_bridge:test',
                        type: 'ukp_bridge',
                        diseaseId: 'pph',
                        familyId: 'kk_bridge',
                        scenarioId: 'bc_kia_dukun',
                        returnDay: 10
                    }
                ]
            }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.processDailyTick();
        });

        const state = useGameStore.getState();
        expect(state.clinical.queue).toHaveLength(1);
        expect(state.clinical.queue[0].hidden.isBCBridge).toBe(true);
        expect(state.clinical.queue[0].hidden.diseaseId).toBe('pph');
        expect(state.clinical.queue[0].gender).toBe('P');
        expect(state.clinical.consequenceQueue).toHaveLength(0);
    });
});
