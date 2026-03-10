/**
 * @reflection
 * [IDENTITY]: Discharge Emergency Patient Logic Test
 * [PURPOSE]: Unit tests for the dischargeEmergencyPatient clinical action,
 *            specifically the SISRUTE intercept flow and direct discharge bypass.
 * [STATE]: Stable
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';
import { act } from '@testing-library/react';

// Mock SoundManager to avoid errors during tests
vi.mock('../utils/SoundManager', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

describe('dischargeEmergencyPatient logic', () => {
    beforeEach(() => {
        const initialState = useGameStore.getInitialState();
        useGameStore.setState(initialState, true); // Reset store

        // Setup initial player stats for testing
        useGameStore.setState(state => ({
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    reputation: 50,
                    xp: 0,
                    energy: 100
                }
            },
            finance: {
                ...state.finance,
                kpi: {
                    ...state.finance.kpi,
                    totalPatients: 0,
                    correctTreatments: 0
                }
            },
            clinical: {
                ...state.clinical,
                activeEmergencyId: 'igd1',
                emergencyQueue: [
                    {
                        id: 'igd1',
                        name: 'Test IGD Patient',
                        isBPJS: true,
                        social: { hasBPJS: true },
                        triageLevel: 1,
                        hidden: {
                            requiredAction: 'refer',
                            referralRequired: true,
                            category: 'Cardiovascular',
                            trueDiagnosisCode: 'I21.9' // STEMI 
                        },
                        medicalData: { trueDiagnosisCode: 'I21.9', diagnosisName: 'STEMI', category: 'Cardiovascular' },
                        vitals: { hr: 120, bp: '90/60', rr: 28, temp: 36.5, spo2: 88 }
                    }
                ],
                activePatientId: null,
                activeReferral: null,
                queue: []
            }
        }));
    });

    it('should set activeReferral with correct shape when referred with isSISRUTE: true', () => {
        const mockPatient = useGameStore.getState().clinical.emergencyQueue[0];

        const decision = {
            action: 'refer',
            isSISRUTE: true,
            triageAssigned: 1,
            actionsPerformed: ['oxygen', 'iv_line', 'ecg']
        };

        const { dischargeEmergencyPatient } = useGameStore.getState().clinicalActions;

        // Perform the action
        act(() => {
            dischargeEmergencyPatient(mockPatient, decision);
        });

        const state = useGameStore.getState();

        // 1. activeReferral must be set with the shape { patient, decisionData, isEmergency }
        //    This is what ReferralSISRUTEModal expects to render itself.
        expect(state.clinical.activeReferral).not.toBeNull();
        expect(state.clinical.activeReferral.patient).toBeDefined();
        expect(state.clinical.activeReferral.patient.id).toBe('igd1');
        expect(state.clinical.activeReferral.decisionData).toBeDefined();
        expect(state.clinical.activeReferral.decisionData.action).toBe('refer');
        expect(state.clinical.activeReferral.isEmergency).toBe(true);

        // 2. Patient should STILL be in the emergency queue (not removed until SISRUTE finishes)
        expect(state.clinical.emergencyQueue.length).toBe(1);
        expect(state.clinical.emergencyQueue[0].id).toBe('igd1');

        // 3. activeEmergencyId is cleared so UI can show the modal over the dashboard
        expect(state.clinical.activeEmergencyId).toBeNull();

        // 4. XP should NOT change (the patient is not yet discharged)
        expect(state.player.profile.xp).toBe(0);
    });

    it('should instantly discharge if referred without isSISRUTE flag (bypasses modal)', () => {
        const mockPatient = useGameStore.getState().clinical.emergencyQueue[0];

        // This simulates the scenario where isSISRUTE is missing from the payload
        const decision = {
            action: 'refer',
            // isSISRUTE: true // MISSING!
            triageAssigned: 1,
            actionsPerformed: ['oxygen', 'iv_line', 'ecg']
        };

        const { dischargeEmergencyPatient } = useGameStore.getState().clinicalActions;

        // Perform the action
        act(() => {
            dischargeEmergencyPatient(mockPatient, decision);
        });

        const state = useGameStore.getState();

        // 1. activeReferral should NOT be set (modal should NOT appear)
        expect(state.clinical.activeReferral).toBeNull();

        // 2. Patient should be REMOVED from the emergency queue instantly
        expect(state.clinical.emergencyQueue.length).toBe(0);

        // 3. activeEmergencyId is cleared
        expect(state.clinical.activeEmergencyId).toBeNull();

        // 4. XP is awarded because isCorrectTriage is true (refer === refer) -> 30 XP
        expect(state.player.profile.xp).toBe(30);
    });
});
