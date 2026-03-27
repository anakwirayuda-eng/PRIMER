/**
 * @reflection
 * [IDENTITY]: createPublicHealthSlice (CP2 extraction)
 * [PURPOSE]: Public health, Prolanis, outbreaks, IKM events, village data slice
 * [STATE]: Production
 * [CROSS_SLICE]: enrollProlanis → player.profile.reputation
 *               completeProlanisVisit → clinical.queue, player
 *               triggerSenamProlanis → finance.stats, player.profile, clinical.history
 *               callProlanisPatient → clinical.queue, clinical.history
 *               monitorMedication → player.profile, clinical.history
 *               respondToOutbreak → player, world.time
 *               resolveIKMEvent → player.profile, clinical.queue, clinical.history
 *               advanceIKMPhase → finance.stats
 * [DEPENDS_ON]: ProlanisEngine, IKMEventEngine, OutbreakSystem, PatientGenerator,
 *               VillageRegistry, NPCReadiness, ikmImpact, ikmHistory, SoundManager
 * [LAST_UPDATE]: 2026-03-27
 */
import { soundManager } from '../../utils/SoundManager.js';
import { seedKey, chanceFromSeed } from '../../utils/deterministicRandom.js';
import { normalizePatient, normalizePatientList } from '../../models/PatientRuntime.js';
import { normalizeEncounter } from '../../models/EncounterRuntime.js';
import { canAffordOperationalCost, spendOperationalFunds } from '../../utils/operationalFunds.js';
import { applyIkmScoreToVillage } from '../../utils/ikmImpact.js';
import { formatIkmImpactSummary, getIkmOutcomeStatus } from '../../utils/ikmHistory.js';
import { ensureVillageReadinessState } from '../../utils/behaviorCaseRuntime.js';
import {
    evaluateIKMTriggers, isBlockedByBC, resolveEvent, calculateEventImpact,
    determineScenarioOutcomeKey, getSeasonForDay, createEventInstance, advanceEventPhase
} from '../../game/IKMEventEngine.js';
import { getScenarioById } from '../../content/scenarios/IKMScenarioLibrary.js';
import { generateProlanisVisitPatient, generateGenericPatients } from '../../game/PatientGenerator.js';
import { generateInitialParameters, determineMonthlyOutcome } from '../../game/ProlanisEngine.js';
import { checkForOutbreakTrigger, checkOutbreakExpiry, applyOutbreakAction } from '../../domains/community/OutbreakSystem.js';
import { calculateIKS } from '../../game/GameCore.js';
import { applyXpGainToProfile } from '../helpers/playerHelpers.js';
import {
    buildProlanisBpjsNumber, applyFamilyIndicatorDrift,
    pruneOutbreakRiskModifiers, applyIkmOutbreakRiskModifiers
} from '../helpers/publicHealthHelpers.js';
import { createInitialPublicHealthState } from '../helpers/persistenceHelpers.js';
import { appendClinicalHistory } from '../helpers/clinicalHelpers.js';

export const createPublicHealthSlice = (set, get) => ({
    // --- STATE ---
    publicHealth: createInitialPublicHealthState(),

    // --- ACTIONS ---
    publicHealthActions: {
        setVillageData: (val) => set(s => {
            const nextVillageData = typeof val === 'function'
                ? val(s.publicHealth.villageData)
                : val;

            return {
                publicHealth: {
                    ...s.publicHealth,
                    villageData: ensureVillageReadinessState(nextVillageData)
                }
            };
        }),
        setProlanisRoster: (val) => set(s => ({ publicHealth: { ...s.publicHealth, prolanisRoster: typeof val === 'function' ? val(s.publicHealth.prolanisRoster) : val } })),
        setProlanisState: (val) => set(s => ({ publicHealth: { ...s.publicHealth, prolanisState: typeof val === 'function' ? val(s.publicHealth.prolanisState) : val } })),
        setActiveOutbreaks: (val) => set(s => ({ publicHealth: { ...s.publicHealth, activeOutbreaks: typeof val === 'function' ? val(s.publicHealth.activeOutbreaks) : val } })),
        setOutbreakNotification: (val) => set(s => ({ publicHealth: { ...s.publicHealth, outbreakNotification: typeof val === 'function' ? val(s.publicHealth.outbreakNotification) : val } })),
        dismissOutbreakNotification: () => set(s => ({
            publicHealth: {
                ...s.publicHealth,
                outbreakNotification: null
            }
        })),
        // CROSS-SLICE: writes player.profile.reputation
        enrollProlanis: (patient, dayOrDiseaseType) => {
            const s = get();
            const day = Number.isFinite(dayOrDiseaseType) ? dayOrDiseaseType : s.world.day;
            const diseaseType = typeof dayOrDiseaseType === 'string'
                ? dayOrDiseaseType
                : (patient.prolanisData?.diseaseType || 'dm_type2');
            if (s.publicHealth.prolanisRoster.some(p => p.id === patient.id)) return false;
            const initialParams = generateInitialParameters(
                diseaseType,
                seedKey('prolanis-enroll', patient.id || patient.name, day)
            );
            const newMember = {
                id: patient.id, name: patient.name, age: patient.age, gender: patient.gender,
                anthropometrics: patient.anthropometrics,
                bpjsNumber: patient.social?.bpjsNumber || buildProlanisBpjsNumber(patient, day),
                social: patient.social,
                prolanisData: {
                    diseaseType,
                    // Codex Fix: don't inflate KPI — 0 means "never visited yet"
                    enrolledDay: day, lastVisitDay: 0,
                    parameters: initialParams, history: [], consecutiveControlled: 0
                }
            };
            set(state => ({
                publicHealth: { ...state.publicHealth, prolanisRoster: [...state.publicHealth.prolanisRoster, newMember] },
                player: { ...state.player, profile: { ...state.player.profile, reputation: Math.min(100, state.player.profile.reputation + 2) } }
            }));
            return true;
        },
        // CROSS-SLICE: writes clinical.queue, player
        completeProlanisVisit: (visitData, day) => {
            const { patientId, doctorDecisions } = visitData;
            const rosterId = patientId.split('_visit_')[0];
            set(state => {
                const effectiveDay = Number.isFinite(day) ? day : state.world.day;
                let xpEarned = 0;
                const updatedRoster = state.publicHealth.prolanisRoster.map(member => {
                    if (member.id !== rosterId) return member;

                    // ═══ CONTRACT ADAPTER (handles EMR + legacy shapes) ════
                    // EMR shape: { medications: [...], education: [...] }
                    // Legacy shape: { medicationAction: { effect }, education: [{ effect }] }
                    const diseaseType = member.prolanisData?.diseaseType;
                    const lastVisitDay = member.prolanisData?.lastVisitDay || 0;
                    const complianceBonus = lastVisitDay > 0 && (effectiveDay - lastVisitDay) <= 35;

                    let medicationAction = null;
                    let education = [];

                    if (doctorDecisions?.medicationAction) {
                        // Legacy engine shape — pass through directly
                        medicationAction = doctorDecisions.medicationAction;
                        education = doctorDecisions.education || [];
                    } else {
                        // EMR shape — adapt medications[] to engine format
                        const hasMeds = Array.isArray(doctorDecisions?.medications) && doctorDecisions.medications.length > 0;
                        medicationAction = hasMeds ? {
                            effect: {
                                paramChange: -(15 * Math.min(doctorDecisions.medications.length, 3))
                            }
                        } : null;
                        education = hasMeds ? [{
                            effect: diseaseType === 'dm_type2'
                                ? { gds: -8, hba1c: -0.05 }
                                : { systolic: -3, diastolic: -2 }
                        }] : [];
                    }

                    const engineIntervention = { medicationAction, education, complianceBonus };
                    // ═══ END ADAPTER ════════════════════════════════

                    const outcome = determineMonthlyOutcome(
                        { ...member },
                        engineIntervention,
                        seedKey('prolanis-visit', member.id, effectiveDay)
                    );
                    xpEarned = outcome.xpEarned || 0;
                    return {
                        ...member,
                        // Codex Fix: sync complication state to root (UI reads root)
                        hasComplication: !!outcome.complication,
                        complicationRisk: outcome.newRisk ?? member.complicationRisk ?? 0,
                        prolanisData: {
                            ...member.prolanisData, lastVisitDay: effectiveDay, parameters: outcome.newParameters,
                            consecutiveControlled: outcome.consecutiveControlled,
                            history: [...(member.prolanisData?.history || []), { day: effectiveDay, parameters: outcome.newParameters, wasControlled: outcome.wasControlled, doctorDecisions }],
                            hasComplication: !!outcome.complication, complicationDetails: outcome.complication
                        }
                    };
                });
                return {
                    clinical: {
                        ...state.clinical,
                        queue: state.clinical.queue.filter(patient => patient.id !== patientId),
                        activePatientId: state.clinical.activePatientId === patientId ? null : state.clinical.activePatientId
                    },
                    publicHealth: { ...state.publicHealth, prolanisRoster: updatedRoster },
                    player: xpEarned > 0
                        ? {
                            ...state.player,
                            profile: applyXpGainToProfile(state.player.profile, xpEarned)
                        }
                        : state.player
                };
            });
        },
        // CROSS-SLICE: writes finance.stats, player.profile, clinical.history
        triggerSenamProlanis: () => {
            const state = get();
            const currentMonth = Math.floor((state.world.day - 1) / 30);

            if (state.publicHealth.prolanisState?.lastSenamMonth === currentMonth) {
                return { success: false, message: 'Senam Prolanis bulan ini sudah terlaksana.' };
            }
            if (state.player.profile.energy < 20) {
                soundManager.playError();
                return { success: false, message: 'Energi tidak cukup untuk memimpin kegiatan.' };
            }
            if (!canAffordOperationalCost(state.finance.stats, 150000)) {
                soundManager.playError();
                return { success: false, message: 'Dana aktif tidak cukup untuk operasional kegiatan.' };
            }

            set(currentState => ({
                publicHealth: {
                    ...currentState.publicHealth,
                    prolanisState: {
                        ...currentState.publicHealth.prolanisState,
                        lastSenamMonth: currentMonth,
                        lastSenamDay: currentState.world.day
                    },
                    prolanisRoster: currentState.publicHealth.prolanisRoster.map((member) => {
                        const currentParams = member.prolanisData?.parameters || {};
                        const nextParams = member.prolanisData?.diseaseType === 'hypertension'
                            ? {
                                ...currentParams,
                                systolic: Math.max(90, (currentParams.systolic || 150) - 6),
                                diastolic: Math.max(60, (currentParams.diastolic || 95) - 3)
                            }
                            : {
                                ...currentParams,
                                gds: Math.max(70, (currentParams.gds || 180) - 12),
                                gdp: Math.max(70, (currentParams.gdp || 140) - 6),
                                hba1c: Math.max(4, (currentParams.hba1c || 8) - 0.1)
                            };

                        return {
                            ...member,
                            complicationRisk: Math.max(0, (member.complicationRisk || 0) - 5),
                            prolanisData: {
                                ...member.prolanisData,
                                parameters: nextParams,
                                lastSenamDay: currentState.world.day
                            }
                        };
                    })
                },
                finance: {
                    ...currentState.finance,
                    stats: {
                        ...spendOperationalFunds(currentState.finance.stats, 150000)
                    }
                },
                player: {
                    ...currentState.player,
                    profile: applyXpGainToProfile({
                        ...currentState.player.profile,
                        energy: currentState.player.profile.energy - 20,
                        stress: Math.max(0, currentState.player.profile.stress - 8),
                        reputation: Math.min(100, currentState.player.profile.reputation + 2)
                    }, 25)
                },
                // Codex Fix: append to clinical.history so ArsipPage shows the activity
                clinical: {
                    ...currentState.clinical,
                    history: [...currentState.clinical.history, {
                        type: 'senam_prolanis',
                        day: currentState.world.day,
                        name: 'Senam Prolanis',
                        participants: currentState.publicHealth.prolanisRoster.length }]
                }
            }));
            soundManager.playSuccess();
            return { success: true, message: 'Senam Prolanis berhasil dilaksanakan.' };
        },
        // CROSS-SLICE: writes clinical.queue, clinical.history
        callProlanisPatient: (patientId) => {
            const state = get();
            const rosterMember = state.publicHealth.prolanisRoster.find(member => member.id === patientId);
            if (!rosterMember) {
                return { success: false, message: 'Pasien Prolanis tidak ditemukan.' };
            }

            const visitId = `${patientId}_visit_${state.world.day}`;
            if (state.clinical.queue.some(patient => patient.id === visitId || patient.originalId === patientId)) {
                return { success: false, message: 'Pasien ini sudah ada di antrean hari ini.' };
            }
            if (state.clinical.queue.length >= 30) {
                return { success: false, message: 'Antrean penuh. Selesaikan pasien lain terlebih dahulu.' };
            }

            const visitPatient = {
                ...generateProlanisVisitPatient(
                    rosterMember,
                    state.world.day,
                    seedKey('prolanis-call', patientId, state.world.day)
                ),
                joinedAt: Math.max(state.world.time, 480)
            };

            set(currentState => ({
                clinical: {
                    ...currentState.clinical,
                    queue: [...currentState.clinical.queue, normalizePatient(visitPatient)],
                    // Codex Fix: append to clinical.history so ArsipPage shows the activity
                    history: [...currentState.clinical.history, {
                        type: 'prolanis_call',
                        day: currentState.world.day,
                        name: `Panggil Prolanis: ${rosterMember.name}`,
                        patientId: patientId,
                        patientName: rosterMember.name,
                        diseaseType: rosterMember.prolanisData?.diseaseType }]
                }
            }));
            soundManager.playConfirm();
            return { success: true, patient: visitPatient };
        },
        // CROSS-SLICE: writes player.profile, clinical.history
        monitorMedication: (patientId) => {
            const state = get();
            const rosterMember = state.publicHealth.prolanisRoster.find(member => member.id === patientId);
            if (!rosterMember) {
                return { success: false, message: 'Pasien Prolanis tidak ditemukan.' };
            }
            if (rosterMember.prolanisData?.lastMedicationReviewDay === state.world.day) {
                return { success: false, message: 'Obat pasien ini sudah dipantau hari ini.' };
            }

            set(currentState => ({
                publicHealth: {
                    ...currentState.publicHealth,
                    prolanisRoster: currentState.publicHealth.prolanisRoster.map((member) => {
                        if (member.id !== patientId) return member;

                        const currentParams = member.prolanisData?.parameters || {};
                        const nextParams = member.prolanisData?.diseaseType === 'hypertension'
                            ? {
                                ...currentParams,
                                systolic: Math.max(90, (currentParams.systolic || 150) - 4),
                                diastolic: Math.max(60, (currentParams.diastolic || 95) - 2)
                            }
                            : {
                                ...currentParams,
                                gds: Math.max(70, (currentParams.gds || 180) - 8),
                                gdp: Math.max(70, (currentParams.gdp || 140) - 4),
                                hba1c: Math.max(4, (currentParams.hba1c || 8) - 0.05)
                            };

                        return {
                            ...member,
                            complicationRisk: Math.max(0, (member.complicationRisk || 0) - 3),
                            prolanisData: {
                                ...member.prolanisData,
                                parameters: nextParams,
                                medicationAdherence: Math.min(100, (member.prolanisData?.medicationAdherence || 70) + 5),
                                lastMedicationReviewDay: currentState.world.day
                            }
                        };
                    })
                },
                player: {
                    ...currentState.player,
                    profile: applyXpGainToProfile({
                        ...currentState.player.profile,
                        reputation: Math.min(100, currentState.player.profile.reputation + 1)
                    }, 10)
                },
                // Codex Fix: append to clinical.history so ArsipPage shows the activity
                clinical: {
                    ...currentState.clinical,
                    history: [...currentState.clinical.history, {
                        type: 'prolanis_monitor',
                        day: currentState.world.day,
                        name: `Pantau Obat: ${rosterMember.name}`,
                        patientId: patientId,
                        patientName: rosterMember.name }]
                }
            }));
            soundManager.playConfirm();
            return { success: true, message: 'Pemantauan obat dicatat.' };
        },
        // CROSS-SLICE: writes player, world.time
        respondToOutbreak: (outbreakId, actionId, action, _day) => {
            const s = get();
            const outbreak = s.publicHealth.activeOutbreaks.find(o => o.id === outbreakId);
            if (!outbreak) return { success: false, message: 'Outbreak not found' };
            if (s.player.profile.energy < action.energyCost) { soundManager.playError(); return { success: false, message: 'Not enough energy' }; }
            const updatedOutbreak = applyOutbreakAction(outbreak, actionId);
            set(state => {
                const nextPlayer = {
                    ...state.player,
                    profile: applyXpGainToProfile({
                        ...state.player.profile,
                        energy: state.player.profile.energy - action.energyCost
                    }, 25)
                };
                const nextOutbreaks = state.publicHealth.activeOutbreaks.map(o => o.id === outbreakId ? updatedOutbreak : o);
                let nextVillage = state.publicHealth.villageData;
                if (actionId === 'psn_campaign' || actionId === 'fogging' || actionId === 'sanitation') {
                    if (nextVillage) {
                        const updatedFamilies = nextVillage.families.map(fam => {
                            if (!outbreak.affectedHouseIds?.includes(fam.houseId)) return fam;
                            const indicators = { ...fam.indicators };
                            if (actionId === 'psn_campaign' || actionId === 'fogging') indicators.jentik = true;
                            if (actionId === 'sanitation') { indicators.jamban = true; indicators.air = true; }
                            return { ...fam, indicators, iksScore: calculateIKS(indicators) };
                        });
                        nextVillage = { ...nextVillage, families: updatedFamilies };
                    }
                }
                const nextWorld = { ...state.world, time: Math.min(960, state.world.time + action.timeCost) };
                if (updatedOutbreak.resolved) { nextPlayer.profile.reputation = Math.min(100, nextPlayer.profile.reputation + (outbreak.typeData?.reputationReward || 15)); }
                return { player: nextPlayer, publicHealth: { ...state.publicHealth, activeOutbreaks: nextOutbreaks, villageData: nextVillage }, world: nextWorld };
            });
            if (updatedOutbreak.resolved) soundManager.playSuccess();
            else soundManager.playConfirm();
            return { success: true, resolved: updatedOutbreak.resolved };
        },
        processDailyPublicHealth: (day, history) => {
            const s = get();
            const { activeOutbreaks, villageData } = s.publicHealth;
            const riskModifiers = pruneOutbreakRiskModifiers(s.publicHealth.outbreakRiskModifiers, day);
            const { updatedOutbreaks } = checkOutbreakExpiry(activeOutbreaks, day);
            const newOutbreak = checkForOutbreakTrigger(history, villageData, day, updatedOutbreaks, riskModifiers);
            let finalOutbreaks = [...updatedOutbreaks];
            let notification = null;
            if (newOutbreak) { finalOutbreaks.push(newOutbreak); notification = newOutbreak; soundManager.playError(); }
            let nextVillage = villageData;
            if (nextVillage) {
                const updatedFamilies = nextVillage.families.map(fam => {
                    return applyFamilyIndicatorDrift(fam, `public-health:${day}:${fam.id}`);
                });
                nextVillage = { ...nextVillage, families: updatedFamilies };
            }

            // Evaluate IKM (Community Health) Scenario Triggers
            const ikmTriggers = evaluateIKMTriggers({
                day,
                season: getSeasonForDay(day),
                villageData: nextVillage,
                activeIKMEvents: s.publicHealth.activeIKMEvents,
                completedIKMEvents: s.publicHealth.completedIKMIds,
                eventCooldowns: s.publicHealth.ikmCooldowns,
                activeBCCases: (nextVillage?.families || []).map(f => f.activeScenarioId).filter(Boolean).map(id => id.replace('bc_', ''))
            });

            let nextIkmEvents = [...s.publicHealth.activeIKMEvents];
            if (ikmTriggers.length > 0) {
                nextIkmEvents = [...nextIkmEvents, ...ikmTriggers];
                soundManager.playNotification();
            }

            set(state => ({
                publicHealth: {
                    ...state.publicHealth,
                    activeOutbreaks: finalOutbreaks,
                    outbreakNotification: notification,
                    outbreakRiskModifiers: riskModifiers,
                    villageData: nextVillage,
                    activeIKMEvents: nextIkmEvents
                }
            }));
        },
        resetPublicHealth: () => set(() => ({
            publicHealth: { villageData: null, prolanisRoster: [], prolanisState: { lastSenamMonth: -1, lastSenamDay: -1 }, activeOutbreaks: [], outbreakNotification: null, outbreakRiskModifiers: { protectedUntil: {}, vulnerableUntil: {} }, activeIKMEvents: [], completedIKMIds: [], ikmCooldowns: {}, ikmCaseBoosts: [], buildingProgress: {} }
        })),
        // --- UKM IKM Actions ---
        /** Resolve a completed IKM event: apply impacts, produce case boosts */
        // CROSS-SLICE: writes player.profile, clinical.queue, clinical.history
        resolveIKMEvent: (eventInstanceId) => {
            const s = get();
            const event = s.publicHealth.activeIKMEvents.find(e => e.instanceId === eventInstanceId);
            if (!event) return null;
            const resolved = resolveEvent(event);
            if (!resolved.completed) return null;

            const impact = calculateEventImpact(resolved);
            const scenarioData = getScenarioById(resolved.scenarioId);
            const outcomeKey = determineScenarioOutcomeKey(resolved, scenarioData) || 'success';
            const historyEntry = normalizeEncounter({
                type: 'ikm_event',
                day: s.world.day,
                dischargedAt: s.world.time || 480,
                name: scenarioData?.title || resolved.title || resolved.scenarioId,
                description: formatIkmImpactSummary(impact),
                outcome: outcomeKey,
                outcomeStatus: getIkmOutcomeStatus(outcomeKey),
                ikmEvent: {
                    scenarioId: resolved.scenarioId,
                    category: resolved.category,
                    outcome: outcomeKey,
                    impact: {
                        balance: Number(impact.balance || 0),
                        iks_score: Number(impact.iks_score || 0),
                        outbreak_risk_reduction: impact.outbreak_risk_reduction || null,
                        outbreak_risk: impact.outbreak_risk || null,
                        spawnedCases: Number(impact.spawnPatients?.amount || 0)
                    }
                }
            });

            // Produce case boosts from relatedCases
            const caseBoosts = (scenarioData?.relatedCases || []).map(caseId => ({
                caseId,
                boost: 0.3,
                sourceEvent: resolved.scenarioId,
                expiresDay: s.world.day + 3
            }));

            // Generate generic patients if scenario phase requested it
            let newPatients = [];
            if (impact.spawnPatients) {
                newPatients = generateGenericPatients(
                    impact.spawnPatients.diseaseId,
                    impact.spawnPatients.amount || 1,
                    impact.spawnPatients.targetClinic,
                    s.world?.time || 480,
                    seedKey('ikm-spawn', resolved.scenarioId, s.world.day, impact.spawnPatients.diseaseId)
                );
            }

            set(state => {
                const ph = state.publicHealth;
                const player = state.player;
                const currentQueue = state.clinical.queue || [];
                const nextVillage = applyIkmScoreToVillage(
                    ph.villageData,
                    scenarioData,
                    Number(impact.iks_score || 0)
                );
                const nextOutbreakRiskModifiers = applyIkmOutbreakRiskModifiers(
                    ph.outbreakRiskModifiers,
                    impact,
                    state.world.day
                );

                // Prevent overflowing the queue
                const spaceLeft = 30 - currentQueue.length;
                const patientsToAdd = newPatients.slice(0, spaceLeft > 0 ? spaceLeft : 0);

                return {
                    publicHealth: {
                        ...ph,
                        activeIKMEvents: ph.activeIKMEvents.filter(e => e.instanceId !== eventInstanceId),
                        completedIKMIds: [...ph.completedIKMIds, resolved.scenarioId],
                        ikmCooldowns: { ...ph.ikmCooldowns, [resolved.category]: s.world.day },
                        ikmCaseBoosts: [...ph.ikmCaseBoosts, ...caseBoosts],
                        villageData: nextVillage,
                        outbreakRiskModifiers: nextOutbreakRiskModifiers
                    },
                    player: {
                        ...player,
                        profile: applyXpGainToProfile({
                            ...player.profile,
                            reputation: Math.min(100, Math.max(0, player.profile.reputation + (impact.reputation || 0))),
                            energy: Math.max(0, player.profile.energy + (impact.energy || 0))
                        }, impact.xp || 0)
                    },
                    clinical: {
                        ...state.clinical,
                        queue: [...currentQueue, ...normalizePatientList(patientsToAdd)],
                        history: appendClinicalHistory(state.clinical.history, historyEntry)
                    }
                };
            });

            return { resolved, impact, outcomeKey, caseBoosts, newPatients };
        },

        /** Apply SDOH delta from building completion */
        applyBuildingSDOH: (buildingType, sdohDelta) => {
            if (!sdohDelta) return;
            set(state => {
                const vd = state.publicHealth.villageData;
                if (!vd || !vd.families) return state;
                // Apply SDOH improvement to a deterministic subset of families
                const updatedFamilies = vd.families.map(fam => {
                    if (!chanceFromSeed(`sdoh:${buildingType}:${fam.id}`, 0.4)) return fam;
                    const indicators = { ...fam.indicators };
                    for (const [key, val] of Object.entries(sdohDelta)) {
                        if (typeof indicators[key] === 'boolean') {
                            indicators[key] = val > 0 ? true : indicators[key];
                        }
                    }
                    return { ...fam, indicators, iksScore: calculateIKS(indicators) };
                });
                return {
                    publicHealth: {
                        ...state.publicHealth,
                        villageData: { ...vd, families: updatedFamilies },
                        buildingProgress: {
                            ...state.publicHealth.buildingProgress,
                            [buildingType]: { ...(state.publicHealth.buildingProgress[buildingType] || {}), completed: true }
                        }
                    }
                };
            });
        },

        /** Manually trigger an IKM event */
        triggerIKMEvent: (scenarioId) => {
            const s = get();
            const activeEvents = s.publicHealth.activeIKMEvents || [];
            const completedIds = s.publicHealth.completedIKMIds || [];
            const cooldowns = s.publicHealth.ikmCooldowns || {};
            const scenario = getScenarioById(scenarioId);

            // Guard 1: Reject bc_* IDs
            if (scenarioId?.startsWith('bc_')) {
                console.warn(`[triggerIKMEvent] Rejected bc_* ID "${scenarioId}" — use BehaviorCase engine instead.`);
                return false;
            }

            // Guard 2: Scenario not found
            if (!scenario) {
                console.warn(`[triggerIKMEvent] Scenario "${scenarioId}" not found.`);
                return false;
            }

            // Guard 3: Already active or completed
            if (activeEvents.some(e => e.scenarioId === scenarioId) || completedIds.includes(scenarioId)) {
                return false;
            }

            // Guard 4: MAX_ACTIVE_EVENTS (max 2)
            if (activeEvents.length >= 2) {
                return false;
            }

            // Guard 5: BC overlap — suppress if a matching BC case is active
            const activeBCIds = (s.publicHealth.villageData?.families || [])
                .map(f => f.activeScenarioId).filter(Boolean).map(id => id.replace('bc_', ''));
            if (isBlockedByBC(scenarioId, activeBCIds)) {
                return false;
            }

            // Guard 6: Category cooldown (5 days)
            const lastTrigger = cooldowns[scenario.category] || 0;
            if (s.world.day - lastTrigger < 5) {
                return false;
            }

            const event = createEventInstance(scenario, s.world.day);
            soundManager.playNotification();
            set(state => ({
                publicHealth: {
                    ...state.publicHealth,
                    activeIKMEvents: [...state.publicHealth.activeIKMEvents, event],
                    ikmCooldowns: {
                        ...state.publicHealth.ikmCooldowns,
                        [scenario.category]: state.world.day
                    }
                }
            }));
            return true;
        },

        /** Generic phase advancer for the UI */
        // CROSS-SLICE: writes finance.stats
        advanceIKMPhase: (eventInstanceId, nextPhaseId, impactDelta = {}, choiceLog = null) => {
            const snapshot = get();
            const balanceDelta = Number(impactDelta?.balance || 0);
            const requiredFunds = balanceDelta < 0 ? Math.abs(balanceDelta) : 0;

            if (requiredFunds > 0 && !canAffordOperationalCost(snapshot.finance.stats, requiredFunds)) {
                soundManager.playError();
                return { success: false, message: 'Dana aktif tidak cukup untuk intervensi komunitas ini.' };
            }

            set(state => {
                const event = state.publicHealth.activeIKMEvents.find(e => e.instanceId === eventInstanceId);
                if (!event) return state;

                let nextStats = state.finance.stats;
                if (requiredFunds > 0) {
                    nextStats = spendOperationalFunds(state.finance.stats, requiredFunds) || state.finance.stats;
                } else if (balanceDelta > 0) {
                    nextStats = {
                        ...state.finance.stats,
                        pendapatanUmum: (state.finance.stats.pendapatanUmum || 0) + balanceDelta
                    };
                }

                const sanitizedImpactDelta = balanceDelta !== 0
                    ? { ...impactDelta, balance: 0 }
                    : impactDelta;
                const updatedEvent = advanceEventPhase(event, nextPhaseId, sanitizedImpactDelta, choiceLog);
                return {
                    finance: {
                        ...state.finance,
                        stats: nextStats
                    },
                    publicHealth: {
                        ...state.publicHealth,
                        activeIKMEvents: state.publicHealth.activeIKMEvents.map(e =>
                            e.instanceId === eventInstanceId ? updatedEvent : e
                        )
                    }
                };
            });

            return { success: true };
        },
    },
});
