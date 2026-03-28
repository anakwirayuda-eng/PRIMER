/**
 * createClinicalSlice.js — CP2 Extracted Clinical Slice
 * 
 * Owns: clinical state + clinicalActions (~42 actions)
 * Cross-slice writes: finance.stats, finance.kpi, finance.pharmacyInventory,
 *   player.profile, publicHealth.villageData, publicHealth.prolanisRoster
 * 
 * Pattern: Standard Zustand slice — (set, get) => ({ ...state, ...actions })
 */
import { produce } from 'immer';
import { soundManager } from '../../utils/SoundManager.js';
import { getMedicationById } from '../../data/MedicationDatabase.js';
import { calculatePatientBill } from '../../game/BillingEngine.js';
import { determineMonthlyOutcome } from '../../game/ProlanisEngine.js';
import { EMERGENCY_ACTIONS, calculateEmergencyBillForPatient } from '../../game/EmergencyCases.js';
import { PROCEDURES_DB } from '../../data/ProceduresDB.js';
import { HOSPITALS, AMBULANCES } from '../../data/HospitalDB.js';
import { buildCPPTRecord, buildMaiaCPPTRecord } from '../../game/CPPTEngine.js';
import { getPatientSpikeMultiplier } from '../../domains/community/OutbreakSystem.js';
import { generatePatient, generateEmergencyPatient, generateFollowupPatient, generateProlanisVisitPatient } from '../../game/PatientGenerator.js';
import { getScheduledFollowups, clearProcessedFollowups } from '../../game/ConsequenceEngine.js';
import { normalizePatient } from '../../models/PatientRuntime.js';
import { normalizeMedicationId } from '../../models/InventoryRuntime.js';
import { processLabOrder } from '../../game/LabEngine.js';
import { getIndicatorByDx } from '../../game/CaseIndicators.js';
import { withTransaction } from '../../utils/transactions.js';
import { chanceFromSeed, seedKey } from '../../utils/deterministicRandom.js';
import { showToast } from '../../utils/ToastManager.js';
import {
    appendReferralLogEntry,
    buildReferralLogEntry,
    reconcileReferralLog
} from '../../utils/referralLog.js';
import { calculateIKS, calculateGlobalBuffs } from '../../game/GameCore.js';
import { sanitizePlayerProfile, applyXpGainToProfile, normalizeSkillList } from '../helpers/playerHelpers.js';
import { createBusyAmbulanceEntry, isAmbulanceStillBusy } from '../helpers/ambulanceHelpers.js';
import { appendClinicalHistory, normalizeClinicalHistoryEntry, isAntibioticMed } from '../helpers/clinicalHelpers.js';
import { createInitialClinicalState } from '../helpers/persistenceHelpers.js';

export const createClinicalSlice = (set, get) => ({
    // --- STATE ---
    clinical: createInitialClinicalState(),

    // --- ACTIONS ---
    clinicalActions: {
        setQueue: (val) => set(s => ({ clinical: { ...s.clinical, queue: typeof val === 'function' ? val(s.clinical.queue) : val } })),
        setEmergencyQueue: (val) => set(s => ({ clinical: { ...s.clinical, emergencyQueue: typeof val === 'function' ? val(s.clinical.emergencyQueue) : val } })),
        setActivePatientId: (val) => set(s => ({ clinical: { ...s.clinical, activePatientId: typeof val === 'function' ? val(s.clinical.activePatientId) : val } })),
        setActiveEmergencyId: (val) => set(s => ({ clinical: { ...s.clinical, activeEmergencyId: typeof val === 'function' ? val(s.clinical.activeEmergencyId) : val } })),
        setHistory: (val) => set(s => ({ clinical: { ...s.clinical, history: typeof val === 'function' ? val(s.clinical.history) : val } })),
        appendClinicalHistoryEntry: (entry) => set(s => ({
            clinical: {
                ...s.clinical,
                history: appendClinicalHistory(s.clinical.history, entry)
            }
        })),
        setAccreditation: (val) => set(s => ({ clinical: { ...s.clinical, accreditation: typeof val === 'function' ? val(s.clinical.accreditation) : val } })),
        setActiveReferral: (val) => set(s => ({ clinical: { ...s.clinical, activeReferral: typeof val === 'function' ? val(s.clinical.activeReferral) : val } })),
        setActiveReferralLog: (val) => set(s => ({ clinical: { ...s.clinical, activeReferralLog: typeof val === 'function' ? val(s.clinical.activeReferralLog) : val } })),
        setBusyAmbulanceIds: (val) => set(s => ({ clinical: { ...s.clinical, busyAmbulanceIds: typeof val === 'function' ? val(s.clinical.busyAmbulanceIds) : val } })),
        setPrbQueue: (val) => set(s => ({ clinical: { ...s.clinical, prbQueue: typeof val === 'function' ? val(s.clinical.prbQueue) : val } })),
        completePRBControl: (prbId) => set(s => ({
            clinical: {
                ...s.clinical,
                prbQueue: s.clinical.prbQueue.map(prb =>
                    prb.id === prbId ? { ...prb, status: 'completed' } : prb
                )
            }
        })),
        setWarningLevel: (val) => set(s => ({ clinical: { ...s.clinical, warningLevel: typeof val === 'function' ? val(s.clinical.warningLevel) : val } })),
        setGameOver: (val) => set(s => ({ clinical: { ...s.clinical, gameOver: typeof val === 'function' ? val(s.clinical.gameOver) : val } })),
        dismissWarning: () => set(s => {
            const isFainted = s.clinical.gameOver?.type === 'fainted';
            const isRuntimeTrap = s.clinical.gameOver?.type === 'runtime_trap';
            const nextState = { clinical: { ...s.clinical, gameOver: null } };

            if (isRuntimeTrap) {
                nextState.meta = { ...s.meta, runtimeTrap: null };
                return nextState;
            }

            // Faint recovery logic
            if (isFainted) {
                nextState.player = {
                    ...s.player,
                    profile: {
                        ...s.player.profile,
                        energy: 35, // Recover small amount
                        stress: Math.max(0, s.player.profile.stress - 30) // Reduce stress
                    }
                };
                // Advance time to late afternoon (Puskesmas tutup sementara)
                nextState.world = {
                    ...s.world,
                    time: Math.max(s.world.time + 180, 960) // Add 3 hours or jump to 16:00
                };

                // Penalize reputation for fainting
                nextState.player.profile.reputation = Math.max(0, s.player.profile.reputation - 5);
                soundManager.playConfirm();
            }

            return nextState;
        }),
        resetClinical: () => set(s => ({ clinical: { ...s.clinical, ...createInitialClinicalState() } })),
        updatePatient: (id, updates) => set(s => ({ clinical: { ...s.clinical, queue: s.clinical.queue.map(p => p.id === id ? { ...p, ...updates } : p) } })),
        // --- Phase 0 Actions ---
        setConsequenceQueue: (val) => set(s => ({ clinical: { ...s.clinical, consequenceQueue: typeof val === 'function' ? val(s.clinical.consequenceQueue) : val } })),
        pushConsequence: (entry) => set(s => ({ clinical: { ...s.clinical, consequenceQueue: [...s.clinical.consequenceQueue, entry] } })),
        setTodayLog: (val) => set(s => ({ clinical: { ...s.clinical, todayLog: typeof val === 'function' ? val(s.clinical.todayLog) : val } })),
        logCaseOutcome: (caseOutcome) => set(s => ({ clinical: { ...s.clinical, todayLog: [...s.clinical.todayLog, caseOutcome] } })),
        setShowMorningBriefing: (val) => set(s => ({ clinical: { ...s.clinical, showMorningBriefing: val } })),
        setShowEndOfDayDebrief: (val) => set(s => ({ clinical: { ...s.clinical, showEndOfDayDebrief: val } })),
        setDailyQuestId: (val) => set(s => ({ clinical: { ...s.clinical, dailyQuestId: val } })),
        setStaffAllocation: (val) => set(s => ({ clinical: { ...s.clinical, staffAllocation: val } })),
        setMorningReputation: (val) => set(s => ({ clinical: { ...s.clinical, morningReputation: val } })),
        addReflection: (entry) => set(s => ({ clinical: { ...s.clinical, reflections: [...s.clinical.reflections, entry] } })),
        // --- Phase 1-3 Service Engine Actions ---
        // pharmacyQueue mutators removed — dead state (FarmasiPanel uses derived state)
        setLabQueue: (val) => set(s => ({ clinical: { ...s.clinical, labQueue: typeof val === 'function' ? val(s.clinical.labQueue) : val } })),
        pushLabOrder: (order) => set(s => ({ clinical: { ...s.clinical, labQueue: [...s.clinical.labQueue, order] } })),
        addLabMasteryEntry: (entry) => set(s => ({ clinical: { ...s.clinical, labMasteryHistory: [...s.clinical.labMasteryHistory, entry] } })),
        setKiaPatients: (val) => set(s => ({ clinical: { ...s.clinical, kiaPatients: typeof val === 'function' ? val(s.clinical.kiaPatients) : val } })),
        upsertKiaPatient: (id, data) => set(s => ({ clinical: { ...s.clinical, kiaPatients: { ...s.clinical.kiaPatients, [id]: data } } })),
        setDentalLog: (val) => set(s => ({ clinical: { ...s.clinical, dentalLog: typeof val === 'function' ? val(s.clinical.dentalLog) : val } })),
        pushDentalRecord: (record) => set(s => ({ clinical: { ...s.clinical, dentalLog: [...s.clinical.dentalLog, record] } })),
        delegateToMaia: (patientId, day, time) => {
            const currentState = get();
            const patient = currentState.clinical.queue.find(entry => entry.id === patientId);
            if (!patient) {
                return { success: false, message: 'Pasien tidak ditemukan di antrean.' };
            }

            day = day ?? currentState.world.day;
            time = time ?? currentState.world.time;

            withTransaction(set, get, 'delegateToMaia', (state) => {
                const isBPJS = Boolean(patient.social?.hasBPJS);
                const satisfactionScore = 78;

                state.clinical.queue = state.clinical.queue.filter(entry => entry.id !== patientId);
                if (state.clinical.activePatientId === patientId) {
                    state.clinical.activePatientId = null;
                }
                state.clinical.history = appendClinicalHistory(state.clinical.history, normalizeClinicalHistoryEntry({
                    ...patient,
                    day,
                    dischargedAt: time,
                    decision: { action: 'delegate_to_maia' },
                    outcome: 'delegated',
                    outcomeStatus: 'delegated',
                    satisfactionScore,
                    cpptRecord: buildMaiaCPPTRecord(patient, day, time, 'delegated')
                }));

                if (isBPJS) {
                    state.finance.stats.kapitasi -= 10000;
                } else {
                    state.finance.stats.pendapatanUmum += 25000;
                }

                state.finance.kpi.totalPatients++;
                state.finance.kpi.delegatedCases++;
                if (isBPJS) state.finance.kpi.bpjsPatients++;
                else state.finance.kpi.umumPatients++;
                state.finance.kpi.patientSatisfaction.push(satisfactionScore);

                // Codex Fix: push to todayLog so debrief can count this encounter
                state.clinical.todayLog.push({
                    patientName: patient.name,
                    age: patient.age,
                    diagnosis: patient.medicalData?.trueDiagnosisCode || 'unknown',
                    action: 'delegate_to_maia',
                    completed: true,
                    referred: false,
                    diagnosisScore: 0,
                    revenue: isBPJS ? 0 : 25000,
                    timestamp: Date.now()
                });
            });

            get().metaActions.updateProgress('patients_treated', 1);
            soundManager.playConfirm();
            return { success: true };
        },
        delegateEmergencyToMaia: (patientId, day, time) => {
            const currentState = get();
            const patient = currentState.clinical.emergencyQueue.find(entry => entry.id === patientId);
            if (!patient) {
                return { success: false, message: 'Pasien IGD tidak ditemukan.' };
            }

            day = day ?? currentState.world.day;
            time = time ?? currentState.world.time;

            set(state => {
                const isBPJS = Boolean(patient.social?.hasBPJS);
                const satisfactionScore = 72;
                const nextKpi = {
                    ...state.finance.kpi,
                    totalPatients: state.finance.kpi.totalPatients + 1,
                    delegatedCases: state.finance.kpi.delegatedCases + 1,
                    bpjsPatients: state.finance.kpi.bpjsPatients + (isBPJS ? 1 : 0),
                    umumPatients: state.finance.kpi.umumPatients + (isBPJS ? 0 : 1),
                    patientSatisfaction: [...state.finance.kpi.patientSatisfaction, satisfactionScore]
                };

                return {
                    clinical: {
                        ...state.clinical,
                        emergencyQueue: state.clinical.emergencyQueue.filter(entry => entry.id !== patientId),
                        activeEmergencyId: state.clinical.activeEmergencyId === patientId ? null : state.clinical.activeEmergencyId,
                        history: appendClinicalHistory(state.clinical.history, normalizeClinicalHistoryEntry({
                            ...patient,
                            day,
                            dischargedAt: time,
                            decision: { action: 'delegate_to_maia' },
                            outcome: 'delegated',
                            outcomeStatus: 'delegated',
                            satisfactionScore,
                            isEmergency: true,
                            cpptRecord: buildMaiaCPPTRecord(patient, day, time, 'delegated', true)
                        })),
                        // Codex Fix: push to todayLog so debrief counts emergency delegation
                        todayLog: [...state.clinical.todayLog, {
                            patientName: patient.name,
                            age: patient.age,
                            diagnosis: patient.medicalData?.trueDiagnosisCode || 'unknown',
                            action: 'delegate_to_maia',
                            completed: true,
                            referred: false,
                            diagnosisScore: 0,
                            revenue: isBPJS ? 0 : 50000,
                            timestamp: Date.now()
                        }]
                    },
                    player: {
                        ...state.player,
                        profile: sanitizePlayerProfile({
                            ...state.player.profile,
                            reputation: state.player.profile.reputation - 5
                        })
                    },
                    finance: {
                        ...state.finance,
                        kpi: nextKpi,
                        stats: {
                            ...state.finance.stats,
                            ...(isBPJS ? {} : { pendapatanUmum: state.finance.stats.pendapatanUmum + 50000 })
                        }
                    }
                };
            });

            get().metaActions.updateProgress('patients_treated', 1);
            soundManager.playConfirm();
            return { success: true };
        },
        processDailyTick: () => set(produce(state => {
            const { time, day } = state.world;
            const { facilities } = state.finance;
            const { profile } = state.player;
            const { villageData, activeOutbreaks } = state.publicHealth;

            // P5: RW Progressive Unlock — filter to only unlocked RW families for patient spawn
            const unlockedRWs = villageData?.unlockedRWs || ['01', '02'];
            const villageDataFiltered = villageData ? {
                ...villageData,
                families: (villageData.families || []).filter(f => unlockedRWs.includes(f.rw || '01')),
                villagers: (villageData.villagers || []).filter(v => {
                    const fam = (villageData.families || []).find(f => f.id === v.familyId);
                    return unlockedRWs.includes(fam?.rw || '01');
                })
            } : null;

            // 1. Update Busy Ambulances
            // Ambulance filter (count tracked implicitly by array mutation)
            state.clinical.busyAmbulanceIds = state.clinical.busyAmbulanceIds.filter(item => isAmbulanceStillBusy(item, day, time));

            // 2. Queue capacity penalty at day end (16:00 = 960)
            if (time === 960) {
                const waitingCount = state.clinical.queue.length;
                if (waitingCount > 0) {
                    state.clinical.queue = [];
                    state.player.profile.reputation = Math.max(0, state.player.profile.reputation - (waitingCount * 1.5));
                }
            }

            // 3. Queue Timeout Check
            const MAX_WAIT_TIME = 360;
            const timedOutPatients = state.clinical.queue.filter(p => time - (p.joinedAt || 480) > MAX_WAIT_TIME && p.status !== 'in_treatment');
            if (timedOutPatients.length > 0) {
                state.clinical.queue = state.clinical.queue.filter(p => !timedOutPatients.includes(p)); // Immer handles this correctly? Yes, replacement.
                state.player.profile.reputation = Math.max(0, state.player.profile.reputation - (timedOutPatients.length * 2));
            }

            // 3.5. Inject Followup Patients from Consequence Queue
            if (time === 480) {
                const followups = getScheduledFollowups(state.clinical.consequenceQueue, day);
                followups.forEach(consequence => {
                    // Codex Fix: skip ukp_bridge entries — no originalCase data
                    if (consequence.type === 'ukp_bridge') return;
                    const followupPatient = generateFollowupPatient(
                        consequence,
                        time,
                        seedKey('followup-spawn', consequence.id, day)
                    );
                    state.clinical.queue.push(normalizePatient(followupPatient));
                });
                if (followups.length > 0) {
                    // DeepThink Fix: use processedIds to clear only spawned follow-ups
                    const processedIds = followups.filter(c => c.type !== 'ukp_bridge').map(c => c.id);
                    state.clinical.consequenceQueue = clearProcessedFollowups(
                        state.clinical.consequenceQueue, day, processedIds
                    );
                    soundManager.playNotification();
                }
            }

            // 3.6. UKM → UKP Bridge: IKM Case Boosts increase disease probability
            // Active case boosts from resolved IKM events increase specific disease spawn rates
            const activeBoosts = (state.publicHealth.ikmCaseBoosts || []).filter(b => b.expiresDay > day);

            // 4. Generate New Patients (Poli Umum)
            // Heuristic: activeOutbreaks gives a multiplier
            let timeFactor = (time < 480 || time >= 960) ? 0 : time > 840 ? 0.05 : 0.20;
            if (time >= 720 && time < 780) timeFactor = 0; // Istirahat
            // IKM case boosts increase patient spawn rate for related diseases
            const ikmBoostMultiplier = activeBoosts.length > 0 ? 1 + (activeBoosts.length * 0.15) : 1;
            // TheDirector spawn multiplier (mercy=0.4, crisis=1.6)
            const directorMultiplier = state.world.directorVerdict?.spawnMultiplier || 1.0;
            const finalTimeFactor = timeFactor * getPatientSpikeMultiplier(activeOutbreaks) * ikmBoostMultiplier * directorMultiplier;
            const maxCapacity = 12 + (facilities.poli_umum - 1) * 3;

            if (
                chanceFromSeed(
                    `clinical-spawn:${day}:${time}:${state.clinical.queue.length}`,
                    finalTimeFactor
                ) &&
                state.clinical.queue.length < maxCapacity
            ) {
                const newPatient = generatePatient(
                    time,
                    villageDataFiltered,
                    day,
                    facilities,
                    normalizeSkillList(profile.skills),
                    seedKey('queue-spawn', day, time, state.clinical.queue.length, state.clinical.todayLog.length)
                );
                // Dedup guard: skip if same name already in queue
                const nameExists = state.clinical.queue.some(p => p.name === newPatient.name);
                if (!nameExists) {
                    state.clinical.queue.push(normalizePatient(newPatient)); // Immer push + ACL
                }
                soundManager.playNotification();
            }

            // 5. Generate Emergency Patients (IGD)
            if (
                chanceFromSeed(
                    `emergency-spawn:${day}:${time}:${state.clinical.emergencyQueue.length}`,
                    0.08
                ) &&
                state.clinical.emergencyQueue.length < 3
            ) {
                const newEmergency = generateEmergencyPatient(
                    time,
                    facilities,
                    villageData,
                    seedKey('emergency-spawn', day, time, state.clinical.emergencyQueue.length)
                );
                if (newEmergency) {
                    state.clinical.emergencyQueue.push(normalizePatient(newEmergency));
                    soundManager.playNotification();
                }
            }

            // 6. Emergency Deterioration
            state.clinical.emergencyQueue.forEach(p => {
                if ((p.status === 'igd_waiting' || p.status === 'sisrute_limbo') && p.deteriorationRate > 0) {
                    p.deterioration = Math.min(100, p.deterioration + p.deteriorationRate);
                }
            });

            // 7. SISRUTE Limbo Auto-Discharge (ambulance arrived)
            const currentTime = state.world.time;
            const arrivedPatients = state.clinical.emergencyQueue.filter(
                p => p.status === 'sisrute_limbo' && p.sisruteData?.estimatedArrival <= currentTime
            );
            arrivedPatients.forEach(p => {
                const sd = p.sisruteData;
                state.clinical.emergencyQueue = state.clinical.emergencyQueue.filter(q => q.id !== p.id);
                state.clinical.history = appendClinicalHistory(state.clinical.history, normalizeClinicalHistoryEntry({
                    ...p, day: state.world.day, dischargedAt: currentTime,
                    // DeepThink Fix: spread original decision to preserve diagnoses/medications
                    decision: { ...(p.originalDecision || {}), action: 'refer', isSISRUTE: true, actionsPerformed: p.sisruteData?.actionsPerformed || [], referralDetails: sd?.referralDetails },
                    outcome: 'referred', outcomeStatus: 'sisrute_transferred',
                    satisfactionScore: 90, isEmergency: true,
                    cpptRecord: buildMaiaCPPTRecord(p, state.world.day, currentTime, 'referred', true)
                }));
                soundManager.playSuccess();
            });

            const referralLogResult = reconcileReferralLog(
                state.clinical.activeReferralLog,
                day,
                time
            );
            state.clinical.activeReferralLog = referralLogResult.activeReferralLog;
            referralLogResult.newlyArrived.forEach((referral) => {
                showToast(
                    `Radio RS: ${referral.patientName} diterima di ${referral.hospitalName}. ${referral.arrivalNote}`,
                    'success',
                    4200
                );
            });
        })),
        dischargePatient: (patient, decision, day, time) => {
            const txResult = withTransaction(set, get, 'dischargePatient', (state) => {
                day = day ?? state.world.day;
                time = time ?? state.world.time;
                if (!patient?.id) {
                    state.clinical.activePatientId = null;
                    return;
                }

                // Codex Fix: intercept Prolanis visit patients — inline roster update
                // (do NOT call completeProlanisVisit via get() here — it creates a nested
                //  set() inside withTransaction that gets overwritten by the outer commit)
                if (typeof patient.id === 'string' && patient.id.includes('_visit_')) {
                    const rosterId = patient.id.split('_visit_')[0];
                    const effectiveDay = day;

                    // EMR → Engine contract adapter
                    const hasMeds = Array.isArray(decision?.medications) && decision.medications.length > 0;
                    let xpEarned = 0;

                    state.publicHealth.prolanisRoster = state.publicHealth.prolanisRoster.map(member => {
                        if (member.id !== rosterId) return member;

                        const diseaseType = member.prolanisData?.diseaseType;
                        const medicationAction = hasMeds ? {
                            effect: { paramChange: -(15 * Math.min(decision.medications.length, 3)) }
                        } : null;
                        const lastVisitDay = member.prolanisData?.lastVisitDay || 0;
                        const complianceBonus = lastVisitDay > 0 && (effectiveDay - lastVisitDay) <= 35;
                        const education = hasMeds ? [{
                            effect: diseaseType === 'dm_type2'
                                ? { gds: -8, hba1c: -0.05 }
                                : { systolic: -3, diastolic: -2 }
                        }] : [];

                        const outcome = determineMonthlyOutcome(
                            { ...member },
                            { medicationAction, education, complianceBonus },
                            seedKey('prolanis-visit', member.id, effectiveDay)
                        );
                        xpEarned = outcome.xpEarned || 0;

                        return {
                            ...member,
                            hasComplication: !!outcome.complication,
                            complicationRisk: outcome.newRisk ?? member.complicationRisk ?? 0,
                            prolanisData: {
                                ...member.prolanisData,
                                lastVisitDay: effectiveDay,
                                parameters: outcome.newParameters,
                                consecutiveControlled: outcome.consecutiveControlled,
                                history: [...(member.prolanisData?.history || []), {
                                    day: effectiveDay,
                                    parameters: outcome.newParameters,
                                    wasControlled: outcome.wasControlled,
                                    doctorDecisions: decision
                                }],
                                hasComplication: !!outcome.complication,
                                complicationDetails: outcome.complication
                            }
                        };
                    });

                    // Remove from queue + clear active
                    state.clinical.queue = state.clinical.queue.filter(p => p.id !== patient.id);
                    if (state.clinical.activePatientId === patient.id) {
                        state.clinical.activePatientId = null;
                    }

                    // Award XP
                    if (xpEarned > 0) {
                        state.player.profile = applyXpGainToProfile(state.player.profile, xpEarned);
                    }

                    // PRB eligibility check — write to clinical.prbQueue (canonical)
                    const updatedMember = state.publicHealth.prolanisRoster.find(m => m.id === rosterId);
                    if (updatedMember && (updatedMember.prolanisData?.consecutiveControlled || 0) >= 3 && !updatedMember.hasComplication) {
                        const prbExists = (state.clinical.prbQueue || []).some(p => p.patientId === rosterId);
                        if (!prbExists) {
                            state.clinical.prbQueue = [...(state.clinical.prbQueue || []), {
                                id: `prb_${rosterId}_${day}`,
                                patientId: rosterId,
                                patientName: updatedMember.name,
                                diagnosis: updatedMember.prolanisData?.diseaseType === 'hypertension' ? 'Hipertensi' : 'DM Tipe 2',
                                status: 'active',
                                enrolledDay: day,
                                tasks: [
                                    { id: 'prb_control_1', label: 'Kontrol PRB 1', dueDay: day + 30, completed: false },
                                    { id: 'prb_control_2', label: 'Kontrol PRB 2', dueDay: day + 60, completed: false },
                                    { id: 'prb_control_3', label: 'Kontrol PRB 3', dueDay: day + 90, completed: false },
                                ]
                            }];
                        }
                    }
                    // Codex Fix: write Prolanis visit to history + todayLog so debrief/archive captures it
                    state.clinical.history = appendClinicalHistory(state.clinical.history, normalizeClinicalHistoryEntry({
                        ...patient,
                        day: effectiveDay,
                        dischargedAt: time ?? state.world.time,
                        decision: { ...decision, action: 'treat' },
                        outcome: 'good',
                        outcomeStatus: 'prolanis_visit',
                        satisfactionScore: 85,
                        isEmergency: false,
                        isProlanis: true
                    }));
                    state.clinical.todayLog = [...state.clinical.todayLog, {
                        patientName: patient.name,
                        age: patient.age,
                        diagnosis: patient.medicalData?.trueDiagnosisCode || 'prolanis',
                        action: 'treat',
                        completed: true,
                        referred: false,
                        diagnosisScore: 100,
                        revenue: 0, // Prolanis = BPJS kapitasi, no direct revenue
                        timestamp: Date.now()
                    }];

                    return;
                }
                const buffs = calculateGlobalBuffs(state);
                const isBPJS = patient.social?.hasBPJS;
                const isCorrectTriage = patient.hidden?.requiredAction === decision.action;
                const correctMedList = patient.medicalData?.correctTreatment || [];
                const isCorrectMeds = ((required, selected) => {
                    if (!required || required.length === 0) return true;
                    if (!selected) return false;
                    // Codex Fix: normalize meds to string IDs (EMR saves objects)
                    const selectedIds = selected.map(m => typeof m === 'object' ? (m.id || m.medId) : m);
                    for (const req of required) { if (Array.isArray(req)) { if (!req.some(r => selectedIds.includes(r))) return false; } else { if (!selectedIds.includes(req)) return false; } }
                    return true;
                })(correctMedList, decision.medications || []);
                const isCorrectAction = decision.action === 'treat' ? (isCorrectTriage && isCorrectMeds) : isCorrectTriage;
                const hasAntibiotic = decision.medications?.some(m => {
                    const medId = typeof m === 'object' ? (m.id || m.medId) : m;
                    return isAntibioticMed(medId);
                });

                let fundChange = 0, repChange = 0, satisfactionScore = 70;

                // === REAL BILLING (replaces flat +50k/-15k) ===
                let bill = null;
                if (decision.action === 'treat') {
                    bill = calculatePatientBill(
                        decision.medications || [],
                        decision.procedures || [],
                        patient.medicalData?.labsRevealed || {},
                        patient.medicalData || {},
                        isBPJS
                    );
                    if (!isCorrectAction) {
                        if (!isCorrectTriage) {
                            // Cowboy Doctor penalty: treating a case that should be referred
                            const isCowboy = decision.action === 'treat' && patient.hidden?.requiredAction === 'refer';
                            repChange = isCowboy ? -20 : -10;
                            satisfactionScore = isCowboy ? 30 : 40;
                            if (isCowboy) {
                                state.clinical.morningAlerts = [
                                    ...(state.clinical.morningAlerts || []),
                                    { type: 'warning', title: '⚠️ Peringatan Malapraktik', message: `Kasus ${patient.medicalData?.diagnosisName || 'pasien'} seharusnya dirujuk (di luar kompetensi FKTP). Menahan kasus di luar SKDI = risiko keselamatan pasien.`, day }
                                ];
                            }
                        }
                        else if (!isCorrectMeds) { repChange = -2; satisfactionScore = 60; }
                    } else {
                        repChange = +2; satisfactionScore = 85;
                    }
                    // Real revenue: Umum pays sellPrice, BPJS burns kapitasi at buyPrice (HPP)
                    if (isBPJS) {
                        fundChange = -(bill.buyPriceTotal || 0); // Kapitasi bears HPP
                    } else {
                        fundChange = bill.total || 0; // Umum pays full bill
                    }
                    if (!isCorrectAction) soundManager.playError(); else soundManager.playSuccess();
                } else if (decision.action === 'refer' && decision.isSISRUTE) {
                    repChange = decision.repBonus || 0; satisfactionScore = decision.satisfaction || 80;
                    if (decision.referralDetails?.result?.status === 'ACCEPTED') {
                        const { hospitalId: _hospitalId, ambulanceId } = decision.referralDetails;
                        const amb = AMBULANCES.find(a => a.id === ambulanceId);
                        if (amb && amb.cost > 0) fundChange -= amb.cost;
                    }
                    soundManager.playSuccess();
                } else if (decision.action === 'refer') {
                    repChange = isCorrectTriage ? -3 : -5;
                    satisfactionScore = isCorrectTriage ? 55 : 45;
                    soundManager.playError();
                }

                satisfactionScore += (buffs.patientSatisfaction || 0);

                // === AUTO-DEDUCT STOCK (medications) ===
                const inventoryUpdates = new Map();
                if (decision.action === 'treat' && decision.medications) {
                    decision.medications.forEach(m => {
                        const medId = normalizeMedicationId(typeof m === 'object' ? (m.id || m.medId) : m);
                        const freq = typeof m === 'object' ? (m.frequency || 1) : 1;
                        const dur = typeof m === 'object' ? (m.duration || 1) : 1;
                        const qty = freq * dur;
                        inventoryUpdates.set(medId, (inventoryUpdates.get(medId) || 0) + qty);
                    });
                }
                // Procedure consumables
                if (decision.procedures) {
                    decision.procedures.forEach(procId => {
                        const procIdClean = typeof procId === 'object' ? (procId.id || procId.code) : procId;
                        const proc = PROCEDURES_DB.find(p => p.id === procIdClean);
                        if (proc?.requiredItems) {
                            proc.requiredItems.forEach(itemId => {
                                const canonicalItemId = normalizeMedicationId(itemId);
                                inventoryUpdates.set(canonicalItemId, (inventoryUpdates.get(canonicalItemId) || 0) + 1);
                            });
                        }
                    });
                }

                // Apply Slice Updates to State Draft
                state.finance.stats.kapitasi += (isBPJS ? fundChange : 0);
                state.finance.stats.pendapatanUmum += (!isBPJS ? fundChange : 0);

                if (inventoryUpdates.size > 0) {
                    state.finance.pharmacyInventory = state.finance.pharmacyInventory.map(item => {
                        if (inventoryUpdates.has(item.medicationId)) {
                            const qty = inventoryUpdates.get(item.medicationId);
                            return { ...item, stock: Math.max(0, item.stock - qty) };
                        }
                        return item;
                    });
                }

                state.player.profile = applyXpGainToProfile({
                    ...state.player.profile,
                    reputation: Math.min(100, Math.max(0, state.player.profile.reputation + repChange)),
                    energy: Math.max(0, state.player.profile.energy - (5 - (buffs.energyEfficiency || 0))),
                    stress: Math.max(0, Math.min(100, state.player.profile.stress + (isCorrectAction ? 2 : 5) - (buffs.stressReduction || 0)))
                }, (isCorrectAction ? 20 : 5) + (buffs.accuracyBonus || 0));

                state.clinical.queue = state.clinical.queue.filter(p => p.id !== patient.id);
                state.clinical.activePatientId = null;

                if (decision.action === 'refer' && decision.isSISRUTE && decision.referralDetails?.result?.status === 'ACCEPTED') {
                    const { hospitalId, ambulanceId } = decision.referralDetails;
                    const hosp = HOSPITALS.find(h => h.id === hospitalId), amb = AMBULANCES.find(a => a.id === ambulanceId);
                    if (hosp && amb) {
                        const travelTime = hosp.distance * (1 / (amb.speedBoost || 1)) * 2 * ((100 + (buffs.referralTime || 0)) / 100);
                        if (amb.isAmbulance !== false) {
                            state.clinical.busyAmbulanceIds.push(
                                createBusyAmbulanceEntry(amb.id, day, time, travelTime * 2)
                            );
                        }
                        state.clinical.activeReferralLog = appendReferralLogEntry(
                            state.clinical.activeReferralLog,
                            buildReferralLogEntry({
                                patient,
                                hospital: hosp,
                                ambulance: amb,
                                day,
                                time,
                                travelDurationMinutes: travelTime
                            }),
                            day,
                            time
                        );

                        // S4 Fix: decrement hospital bed availability
                        const bedKey = hosp.id;
                        if (!state.clinical.hospitalBedUsage) state.clinical.hospitalBedUsage = {};
                        state.clinical.hospitalBedUsage[bedKey] = (state.clinical.hospitalBedUsage[bedKey] || 0) + 1;
                    }
                }

                // Codex Fix: add outcomeStatus for SISRUTE referrals so PatientHistoryModal can distinguish them
                const isSISRUTEAccepted = decision.action === 'refer' && decision.isSISRUTE && decision.referralDetails?.result?.status === 'ACCEPTED';
                const cppt = buildCPPTRecord(patient, decision, day, time, { outcomeStatus: isSISRUTEAccepted ? 'referred_sisrute' : (isCorrectAction ? 'pulih' : 'memburuk'), satisfactionScore, isCorrectAction, isEmergency: false });
                state.clinical.history = appendClinicalHistory(state.clinical.history, normalizeClinicalHistoryEntry({
                    ...patient,
                    day,
                    dischargedAt: time,
                    decision,
                    outcome: repChange >= 0 ? 'good' : 'bad',
                    outcomeStatus: isSISRUTEAccepted ? 'referred_sisrute' : undefined,
                    satisfactionScore,
                    cpptRecord: cppt
                }));

                // DeepThink Fix: familyId is in hidden, not root
                const patientFamilyId = patient.hidden?.familyId || patient.familyId;
                if (isCorrectAction && patientFamilyId && state.publicHealth.villageData) {
                    state.publicHealth.villageData.families = state.publicHealth.villageData.families.map(fam => {
                        if (fam.id !== patientFamilyId) return fam;
                        const indicators = { ...fam.indicators };
                        let changed = false;
                        const dxCode = patient.medicalData?.trueDiagnosisCode;
                        const indicatorToUpdate = getIndicatorByDx(dxCode);
                        if (indicatorToUpdate) {
                            if (indicatorToUpdate === 'jamban') {
                                indicators.jamban = chanceFromSeed(
                                    `discharge:${day}:${patient.id}:${dxCode}:jamban`,
                                    0.7
                                );
                            }
                            else if (indicatorToUpdate === 'rokok') { if (decision.education?.includes('stop_smoking')) indicators.rokok = true; }
                            else indicators[indicatorToUpdate] = true;
                            changed = true;
                        }
                        if (isBPJS && !indicators.jkn) { indicators.jkn = true; changed = true; }
                        if (!changed) return fam;
                        return { ...fam, indicators, iksScore: calculateIKS(indicators) };
                    });
                }

                // KPI Updates
                const newKpi = state.finance.kpi;
                newKpi.totalPatients++;
                if (isBPJS) newKpi.bpjsPatients++; else newKpi.umumPatients++;
                if (isCorrectAction && decision.action === 'treat') newKpi.correctTreatments++;
                if (decision.diagnoses?.includes(patient.medicalData?.trueDiagnosisCode)) newKpi.correctDiagnoses++;
                if (hasAntibiotic) newKpi.antibioticPrescriptions++;
                if (hasAntibiotic && isCorrectAction) newKpi.rationalAntibiotics++;
                newKpi.patientSatisfaction.push(satisfactionScore);
                if (decision.action === 'refer') {
                    newKpi.referrals++;
                    // Codex Fix: Increment nonSpecialisticReferrals at runtime (not just in archive)
                    if (!isCorrectTriage) {
                        newKpi.nonSpecialisticReferrals = (newKpi.nonSpecialisticReferrals || 0) + 1;
                    }
                }
            });

            if (txResult.success && patient?.id && !(typeof patient.id === 'string' && patient.id.includes('_visit_'))) {
                get().metaActions.updateProgress('patients_treated', 1);

                // P6: Living Village Ledger — record discharge outcome for resident families
                const patientFamilyId = patient.hidden?.familyId || patient.familyId;
                if (patientFamilyId) {
                    const dxCode = patient.medicalData?.trueDiagnosisCode || '';
                    const category = dxCode.startsWith('I') ? 'Cardiovascular'
                        : dxCode.startsWith('A15') ? 'Respiratory'
                        : (dxCode.startsWith('F') ? 'Psychiatry' : 'General');
                    get().publicHealthActions.recordVillageLedgerEntry(patientFamilyId, 'discharge', {
                        patientId: patient.id,
                        patientName: patient.name,
                        diagnosisCode: dxCode,
                        diagnosisCategory: category,
                        action: decision.action,
                    });
                }
            }

            // P6: Living Village Ledger — Prolanis visits also feed back to village
            if (txResult.success && typeof patient?.id === 'string' && patient.id.includes('_visit_')) {
                const proFamilyId = patient.hidden?.familyId || patient.familyId;
                if (proFamilyId) {
                    get().publicHealthActions.recordVillageLedgerEntry(proFamilyId, 'prolanis', {
                        patientId: patient.id,
                        patientName: patient.name,
                        diseaseType: patient.hidden?.diseaseId || 'chronic',
                    });
                }
            }

            return txResult;
        },
        dischargeEmergencyPatient: (patient, decision, day, time) => {
            day = day ?? get().world.day;
            time = time ?? get().world.time;
            // 1. SISRUTE Intercept: Trigger modal if referring without completed referral details
            //    ReferralSISRUTEModal expects activeReferral = { patient, decisionData, isEmergency }
            if (decision.action === 'refer' && decision.isSISRUTE && !decision.referralDetails) {
                set(state => ({
                    clinical: {
                        ...state.clinical,
                        activeReferral: { patient, decisionData: decision, isEmergency: true },
                        activeEmergencyId: null
                    }
                }));
                return; // Early return — patient stays in queue until SISRUTE completes
            }

            const isCorrectTriage = patient.hidden?.requiredAction === decision.action;
            let repChange = isCorrectTriage ? 5 : -5, satisfactionScore = isCorrectTriage ? 95 : 50;
            let outcomeStatus = isCorrectTriage ? 'correct' : 'incorrect';

            // 🖤 DEATH: Patient died after failed resuscitation
            if (decision.action === 'death') {
                repChange = -15;
                satisfactionScore = 0;
                outcomeStatus = 'meninggal';
                soundManager.playError();
            }
            // Override rep/score if it's a completed SISRUTE referral
            else if (decision.action === 'refer' && decision.isSISRUTE) {
                repChange = decision.repBonus || repChange;
                satisfactionScore = decision.satisfaction || satisfactionScore;
            }

            if (decision.action !== 'death') {
                if (isCorrectTriage || (decision.action === 'refer' && decision.isSISRUTE && decision.referralDetails?.result?.status === 'ACCEPTED')) {
                    soundManager.playSuccess();
                } else {
                    soundManager.playError();
                }
            }

            const billing = decision.action === 'death'
                ? { total: 0 }
                : calculateEmergencyBillForPatient(
                    patient,
                    decision.actionsPerformed || decision.actions || [],
                    decision.triageAssigned || patient.triageLevel
                );
            set(state => {
                const newKpi = { ...state.finance.kpi }; if (isCorrectTriage) newKpi.correctTreatments++;
                if (decision.action === 'death') newKpi.deathCases = (newKpi.deathCases || 0) + 1;
                let fundChange = billing.total;
                let newBusyAmbulanceIds = state.clinical.busyAmbulanceIds;
                let newActiveReferralLog = state.clinical.activeReferralLog;
                let newHospitalBedUsage = { ...(state.clinical.hospitalBedUsage || {}) };

                // Handle SISRUTE referral completion: → ENTER LIMBO instead of instant discharge
                if (decision.action === 'refer' && decision.isSISRUTE && decision.referralDetails?.result?.status === 'ACCEPTED') {
                    const { hospitalId, ambulanceId } = decision.referralDetails;
                    const hosp = HOSPITALS.find(h => h.id === hospitalId), amb = AMBULANCES.find(a => a.id === ambulanceId);
                    const travelTime = hosp ? Math.ceil(hosp.distance * (1 / (amb?.speedBoost || 1)) * 2) : 30;

                    // Deduct ambulance cost immediately
                    if (amb && amb.cost > 0) fundChange -= amb.cost;
                    // Mark ambulance as busy
                    if (hosp && amb && amb.isAmbulance !== false) {
                        newBusyAmbulanceIds = [
                            ...newBusyAmbulanceIds,
                            createBusyAmbulanceEntry(amb.id, day, time, travelTime * 2)
                        ];
                    }
                    // Hospital bed reservation
                    if (hosp) newHospitalBedUsage[hosp.id] = (newHospitalBedUsage[hosp.id] || 0) + 1;
                    // Add referral log
                    if (hosp && amb) {
                        newActiveReferralLog = appendReferralLogEntry(
                            newActiveReferralLog,
                            buildReferralLogEntry({
                                patient,
                                hospital: hosp,
                                ambulance: amb,
                                day,
                                time,
                                travelDurationMinutes: travelTime
                            }),
                            day,
                            time
                        );
                    }

                    // 🚑 SISRUTE LIMBO: patient stays in queue waiting for ambulance (immutable update)
                    const newEmergencyQueue = state.clinical.emergencyQueue.map(q => {
                        if (q.id !== patient.id) return q;
                        return {
                            ...q,
                            status: 'sisrute_limbo',
                            // DeepThink Fix: preserve original player decision for auto-discharge
                            originalDecision: decision,
                            sisruteData: {
                                hospitalId: hosp?.id, hospitalName: hosp?.name || 'RS Rujukan',
                                ambulanceId: amb?.id, ambulanceName: amb?.name || 'Ambulans',
                                acceptedAt: time, estimatedArrival: time + travelTime,
                                actionsPerformed: decision.actionsPerformed || [],
                                referralDetails: decision.referralDetails
                            },
                            deteriorationRate: Math.max(0, (q.deteriorationRate || 0) * 0.5)
                        };
                    });

                    return {
                        clinical: {
                            ...state.clinical,
                            emergencyQueue: newEmergencyQueue,
                            busyAmbulanceIds: newBusyAmbulanceIds,
                            activeReferralLog: newActiveReferralLog,
                            activeEmergencyId: null,
                            hospitalBedUsage: newHospitalBedUsage
                        },
                        finance: { ...state.finance, stats: { ...state.finance.stats, pendapatanUmum: state.finance.stats.pendapatanUmum + fundChange }, kpi: newKpi }
                    };
                }

                return {
                    clinical: {
                        ...state.clinical,
                        busyAmbulanceIds: newBusyAmbulanceIds,
                        activeReferralLog: newActiveReferralLog,
                        emergencyQueue: state.clinical.emergencyQueue.filter(p => p.id !== patient.id),
                        activeEmergencyId: null,
                        history: appendClinicalHistory(state.clinical.history, normalizeClinicalHistoryEntry({
                            ...patient,
                            day,
                            dischargedAt: time,
                            decision,
                            outcome: repChange >= 0 ? 'good' : 'bad',
                            outcomeStatus: outcomeStatus,
                            satisfactionScore,
                            isEmergency: true,
                            dispensed: true, // IGD always auto-dispenses
                            cpptRecord: buildCPPTRecord(patient, decision, day, time, { outcomeStatus, satisfactionScore, isCorrectAction: isCorrectTriage, isEmergency: true, handledBy: 'Player' })
                        })),
                        // Codex Fix: push to todayLog so debrief counts emergency discharges
                        todayLog: [...state.clinical.todayLog, {
                            patientName: patient.name,
                            age: patient.age,
                            diagnosis: patient.medicalData?.trueDiagnosisCode || 'unknown',
                            action: decision.action,
                            completed: decision.action !== 'refer',
                            referred: decision.action === 'refer',
                            diagnosisScore: isCorrectTriage ? 100 : 0,
                            revenue: billing.total || 0,
                            timestamp: Date.now()
                        }]
                    },
                    player: {
                        ...state.player,
                        profile: applyXpGainToProfile({
                            ...state.player.profile,
                            reputation: Math.min(100, Math.max(0, state.player.profile.reputation + repChange))
                        }, isCorrectTriage ? 30 : 10)
                    },
                    finance: {
                        ...state.finance,
                        stats: { ...state.finance.stats, pendapatanUmum: state.finance.stats.pendapatanUmum + fundChange },
                        kpi: newKpi,
                        // IGD AUTO-DEDUCT: consume meds/alkes used during emergency
                        pharmacyInventory: (() => {
                            const igdConsumption = new Map();
                            // 1. Actions performed → each action's med cost (if it's a real medication)
                            const actions = decision.actionsPerformed || decision.actions || [];
                            actions.forEach(actionId => {
                                const canonicalActionId = normalizeMedicationId(actionId);
                                const med = getMedicationById(canonicalActionId) || getMedicationById(actionId);
                                if (med && med.form !== 'action' && med.form !== 'equipment') {
                                    igdConsumption.set(canonicalActionId, (igdConsumption.get(canonicalActionId) || 0) + 1);
                                }
                                // Also consume requiredItems from the action definition
                                const actionDef = EMERGENCY_ACTIONS[actionId];
                                if (actionDef?.requiredItems) {
                                    actionDef.requiredItems.forEach(itemId => {
                                        const canonicalItemId = normalizeMedicationId(itemId);
                                        const itemMed = getMedicationById(canonicalItemId) || getMedicationById(itemId);
                                        if (itemMed && itemMed.form !== 'equipment') {
                                            igdConsumption.set(canonicalItemId, (igdConsumption.get(canonicalItemId) || 0) + 1);
                                        }
                                    });
                                }
                            });
                            // 2. Authored billingItems from case data (obat + alkes)
                            const caseData = patient.hidden?.caseData;
                            if (caseData?.billingItems?.obat) {
                                caseData.billingItems.obat.forEach(item => {
                                    if (item.medId) {
                                        const canonicalMedId = normalizeMedicationId(item.medId);
                                        igdConsumption.set(canonicalMedId, (igdConsumption.get(canonicalMedId) || 0) + (item.qty || 1));
                                    }
                                });
                            }
                            if (caseData?.billingItems?.alkes) {
                                caseData.billingItems.alkes.forEach(item => {
                                    if (item.id) {
                                        const canonicalItemId = normalizeMedicationId(item.id);
                                        const itemMed = getMedicationById(canonicalItemId) || getMedicationById(item.id);
                                        if (itemMed && itemMed.form !== 'equipment') {
                                            igdConsumption.set(canonicalItemId, (igdConsumption.get(canonicalItemId) || 0) + (item.qty || 1));
                                        }
                                    }
                                });
                            }
                            if (igdConsumption.size === 0) return state.finance.pharmacyInventory;
                            return state.finance.pharmacyInventory.map(inv => {
                                if (igdConsumption.has(inv.medicationId)) {
                                    return { ...inv, stock: Math.max(0, inv.stock - igdConsumption.get(inv.medicationId)) };
                                }
                                return inv;
                            });
                        })()
                    }
                };
            });

            const entersSisruteLimbo = decision.action === 'refer'
                && decision.isSISRUTE
                && decision.referralDetails?.result?.status === 'ACCEPTED';

            if (!entersSisruteLimbo && patient?.id) {
                get().metaActions.updateProgress('patients_treated', 1);

                // P6: Living Village Ledger — record emergency discharge for resident families
                const patientFamilyId = patient.hidden?.familyId || patient.familyId;
                if (patientFamilyId) {
                    const dxCode = patient.medicalData?.trueDiagnosisCode || patient.hidden?.icd10 || '';
                    const category = dxCode.startsWith('I') ? 'Cardiovascular'
                        : dxCode.startsWith('A15') ? 'Respiratory'
                        : (dxCode.startsWith('F') ? 'Psychiatry' : 'General');
                    get().publicHealthActions.recordVillageLedgerEntry(patientFamilyId, 'discharge', {
                        patientId: patient.id,
                        patientName: patient.name,
                        diagnosisCode: dxCode,
                        diagnosisCategory: category,
                        action: decision.action,
                        isEmergency: true,
                    });
                }
            }
        },
        orderLab: (patientId, labName, cost) => {
            set(state => {
                const patient = state.clinical.queue.find(p => p.id === patientId);
                // Codex Fix: call processLabOrder to get real disease-contextualized results
                let labResult = true; // fallback: boolean flag
                let actualCost = cost;
                try {
                    const orderOutput = processLabOrder([labName], patient, {});
                    if (orderOutput.results[labName]) {
                        labResult = orderOutput.results[labName];
                    }
                    if (orderOutput.totalCost > 0) {
                        actualCost = orderOutput.totalCost;
                    }
                } catch (e) {
                    console.warn('[orderLab] processLabOrder failed, using flag:', e);
                }
                // Store rich result object (or boolean flag as fallback) keyed by labName
                const nextQueue = state.clinical.queue.map(p => {
                    if (p.id !== patientId) return p;
                    const prevRevealed = p.labsRevealed || {};
                    // Support both array (legacy) and object (modern) formats
                    const revealedObj = Array.isArray(prevRevealed)
                        ? prevRevealed.reduce((acc, name) => ({ ...acc, [name]: true }), {})
                        : { ...prevRevealed };
                    revealedObj[labName] = labResult;
                    return { ...p, labsRevealed: revealedObj };
                });
                const nextFinance = { ...state.finance, stats: { ...state.finance.stats, pengeluaranLab: (state.finance.stats.pengeluaranLab || 0) + actualCost } };
                return { clinical: { ...state.clinical, queue: nextQueue }, finance: nextFinance };
            });
        },
        checkAccreditation: () => {
            const s = get();
            const score = s.player.profile.reputation;
            let newAccreditation = 'Dasar';
            if (score >= 90) newAccreditation = 'Paripurna'; else if (score >= 80) newAccreditation = 'Utama'; else if (score >= 70) newAccreditation = 'Madya';
            if (newAccreditation !== s.clinical.accreditation) { set(st => ({ clinical: { ...st.clinical, accreditation: newAccreditation } })); }
        },
        resetDailyState: () => set(s => ({ clinical: { ...s.clinical, queue: [], emergencyQueue: [], activePatientId: null, activeEmergencyId: null, activeReferral: null, busyAmbulanceIds: [], hospitalBedUsage: {}, activeReferralLog: [] } }))
    },
});
