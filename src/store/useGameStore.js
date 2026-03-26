/**
 * @reflection
 * [IDENTITY]: useGameStore (The New Central Brain)
 * [PURPOSE]: Unified state management replacing Context API frenzy.
 * [STATE]: Initialization
 * [ARCHITECT]: Megalog v4.0 Pattern
 * [DEPENDS_ON]: zustand
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';
import { soundManager } from '../utils/SoundManager.js';
import { getMedicationById } from '../data/MedicationDatabase.js';
import { getSupplierById, calculateOrderCost, estimateDeliveryDate } from '../data/SupplierDatabase.js';
import { calculatePatientBill } from '../game/BillingEngine.js';
import { generateInitialParameters, determineMonthlyOutcome } from '../game/ProlanisEngine.js';
import { applyOutbreakAction, checkForOutbreakTrigger, checkOutbreakExpiry } from '../domains/community/OutbreakSystem.js';
import { EMERGENCY_ACTIONS, calculateEmergencyBillForPatient } from '../game/EmergencyCases.js';
import { PROCEDURES_DB } from '../data/ProceduresDB.js';
import { HOSPITALS, AMBULANCES } from '../data/HospitalDB.js';
import { buildCPPTRecord, buildMaiaCPPTRecord } from '../game/CPPTEngine.js';
import { getPatientSpikeMultiplier } from '../domains/community/OutbreakSystem.js';
import { generatePatient, generateEmergencyPatient, generateFollowupPatient, generateGenericPatients, generateProlanisVisitPatient } from '../game/PatientGenerator.js';
import { getScheduledFollowups, clearProcessedFollowups } from '../game/ConsequenceEngine.js';
import { evaluateIKMTriggers, isBlockedByBC, resolveEvent, calculateEventImpact, determineScenarioOutcomeKey, getSeasonForDay, createEventInstance, advanceEventPhase } from '../game/IKMEventEngine.js';
import { getScenarioById } from '../content/scenarios/IKMScenarioLibrary.js';
import { VILLAGE_FAMILIES, FAMILY_INDICATORS, VILLAGE_STATS, getAllVillagers } from '../domains/village/VillageRegistry.js';
import { applyNeglectDecay } from '../domains/village/NPCReadiness.js';
import { claimQuestReward, evaluateStoryTriggers, advanceStoryNode, getStoryNodeImpact, updateGameProgress } from '../game/QuestEngine.js';
import { normalizePatient, normalizePatientList } from '../models/PatientRuntime.js';
import { normalizeEncounter } from '../models/EncounterRuntime.js';
import { normalizeInventoryList, normalizeMedicationId } from '../models/InventoryRuntime.js';
import { canAffordOperationalCost, spendOperationalFunds } from '../utils/operationalFunds.js';
import { applyIkmScoreToVillage } from '../utils/ikmImpact.js';
import { formatIkmImpactSummary, getIkmOutcomeStatus } from '../utils/ikmHistory.js';
import {
    collectPendingUkpBridgeCases,
    ensureVillageReadinessState,
    markBehaviorCaseBridgeSpawned
} from '../utils/behaviorCaseRuntime.js';
import { processLabOrder } from '../game/LabEngine.js';
import { getIndicatorByDx } from '../game/CaseIndicators.js';
import { evaluateDirectorState, generateDirectorGift, processUKPBridge } from '../game/TheDirector.js';
import { buildRuntimeTrap, guardActionGroup, triggerFreezeProtocol } from '../utils/dispatchGuard.js';
import { CURRENT_SAVE_VERSION, parseSavePayload } from '../utils/savePayload.js';
import { withTransaction } from '../utils/transactions.js';
import { chanceFromSeed, seedKey } from '../utils/deterministicRandom.js';
import { safeSetStorageItem } from '../utils/browserSafety.js';
import { showToast } from '../utils/ToastManager.js';
import { clearStability } from '../utils/prophylaxis.js';
import {
    appendReferralLogEntry,
    buildReferralLogEntry,
    reconcileReferralLog
} from '../utils/referralLog.js';
import { normalizeProgressMetric } from '../utils/progressMetrics.js';
import {
    INITIAL_PLAYER_STATE,
    INITIAL_TIME_STATE,
    calculateIKS,
    calculateGlobalBuffs,
    calculateSleepRecovery as calculateSleepRecoveryOutcome
} from '../game/GameCore.js';

// ═══════════════════════════════════════════════════════════════
// CP1 EXTRACTED HELPERS — Pure functions moved to store/helpers/
// ═══════════════════════════════════════════════════════════════
import { isPlainObject, clampInteger } from './helpers/storeUtils.js';
import { sanitizePlayerProfile, applyXpGainToProfile, spendXpFromProfile, createStartingPlayerProfile, clampEnergyToProfile, normalizeSkillList } from './helpers/playerHelpers.js';
import { createBusyAmbulanceEntry, isAmbulanceStillBusy } from './helpers/ambulanceHelpers.js';
import { appendClinicalHistory, normalizeClinicalHistoryEntry, isAntibioticMed } from './helpers/clinicalHelpers.js';
import { buildDailyArchiveEntry, buildMonthlyArchiveEntry, ACCREDITATION_MULTIPLIER } from './helpers/archiveHelpers.js';
import {
    normalizePersistedWorld, createInitialMetaState, createInitialPublicHealthState, createInitialStaffState,
    INITIAL_CLINICAL_STATE, createInitialClinicalState, createInitialPharmacyInventory, INITIAL_KPI, INITIAL_FACILITIES,
    createInitialFinanceState, INITIAL_NAV_SETTINGS, createInitialNavState,
    mergePersistedFinance, mergePersistedPublicHealth, mergePersistedStaff, mergePersistedClinical, mergePersistedMeta,
    reconcileClinicalReferralLog, buildManualSaveSnapshot, syncQuestRoster
} from './helpers/persistenceHelpers.js';
import { buildProlanisBpjsNumber, applyFamilyIndicatorDrift, applyStaffMoraleDecay, pruneOutbreakRiskModifiers, applyIkmOutbreakRiskModifiers, applyStoryImpactToDraft } from './helpers/publicHealthHelpers.js';

// ═══════════════════════════════════════════════════════════════
// CP2 EXTRACTED SLICES
// ═══════════════════════════════════════════════════════════════
import { createNavSlice } from './slices/createNavSlice.js';
import { createWorldSlice } from './slices/createWorldSlice.js';
import { createStaffSlice } from './slices/createStaffSlice.js';
import { createPlayerSlice } from './slices/createPlayerSlice.js';

const ACTION_GROUP_NAMES = [
    'navActions',
    'worldActions',
    'playerActions',
    'financeActions',
    'publicHealthActions',
    'staffActions',
    'clinicalActions',
    'metaActions',
    'actions'
];

const ACTIONS_ALLOWED_DURING_RUNTIME_TRAP = new Set([
    'clinicalActions.dismissWarning',
    'actions.saveGame',
    'actions.loadGame',
    'actions.startNewGame',
    'actions.resetGame'
]);

const ACTIONS_SKIP_STABILITY_GUARD = new Set([
    'actions.saveGame',
    'actions.loadGame',
    'actions.startNewGame',
    'actions.resetGame',
    'clinicalActions.dismissWarning'
]);

const ACTIONS_SKIP_INVARIANT_RECHECK = new Set([
    'actions.saveGame',
    'clinicalActions.dismissWarning'
]);

function shouldEnableActionStability(fullName, actionName) {
    if (ACTIONS_SKIP_STABILITY_GUARD.has(fullName)) return false;
    return !/^(set|open|close|toggle|clear)/.test(actionName);
}

function armAutosaveTrap(setState, getState, phase, reason) {
    const trap = buildRuntimeTrap('actions.saveGame', {
        phase,
        reason: reason || 'Autosave gagal. Penyimpanan lokal mungkin penuh atau tidak tersedia.'
    });
    triggerFreezeProtocol(setState, getState, trap);
    return false;
}

function guardStoreActions(store, set, get) {
    for (const groupName of ACTION_GROUP_NAMES) {
        if (!store[groupName] || typeof store[groupName] !== 'object') continue;

        store[groupName] = guardActionGroup(groupName, store[groupName], (actionName) => {
            const fullName = `${groupName}.${actionName}`;
            return {
                getState: get,
                setState: set,
                allowDuringFreeze: ACTIONS_ALLOWED_DURING_RUNTIME_TRAP.has(fullName),
                enableStability: shouldEnableActionStability(fullName, actionName),
                freezeOnInvariant: !ACTIONS_SKIP_INVARIANT_RECHECK.has(fullName),
                threshold: fullName === 'actions.nextDay' ? 2000 : 500,
                maxBurst: fullName === 'actions.nextDay' ? 2 : 3
            };
        });
    }

    return store;
}


export const useGameStore = create(
    devtools(
        persist(
            (set, get) => {
                const store = {
                // --- SLICE: NAV & SETTINGS (CP2 extracted) ---
                ...createNavSlice(set, get),

                // --- SLICE: WORLD (CP2 extracted) ---
                ...createWorldSlice(set, get),

                // --- SLICE: PLAYER (CP2 extracted) ---
                ...createPlayerSlice(set, get),

                // --- SLICE: FINANCE ---
                finance: createInitialFinanceState(),
                financeActions: {
                    setStats: (val) => set(s => ({ finance: { ...s.finance, stats: typeof val === 'function' ? val(s.finance.stats) : val } })),
                    setKpi: (val) => set(s => ({ finance: { ...s.finance, kpi: typeof val === 'function' ? val(s.finance.kpi) : val } })),
                    setFacilities: (val) => set(s => ({ finance: { ...s.finance, facilities: typeof val === 'function' ? val(s.finance.facilities) : val } })),
                    setPharmacyInventory: (val) => set(s => ({
                        finance: {
                            ...s.finance,
                            pharmacyInventory: normalizeInventoryList(typeof val === 'function' ? val(s.finance.pharmacyInventory) : val)
                        }
                    })),
                    setPendingOrders: (val) => set(s => ({ finance: { ...s.finance, pendingOrders: typeof val === 'function' ? val(s.finance.pendingOrders) : val } })),
                    upgradeFacility: (facilityId, cost) => {
                        const state = get();
                        if (state.finance.facilities[facilityId] !== undefined && canAffordOperationalCost(state.finance.stats, cost)) {
                            set(s => ({
                                finance: {
                                    ...s.finance,
                                    stats: spendOperationalFunds(s.finance.stats, cost),
                                    facilities: { ...s.finance.facilities, [facilityId]: s.finance.facilities[facilityId] + 1 }
                                }
                            }));
                            soundManager.playSuccess();
                            return true;
                        }
                        return false;
                    },
                    consumeMedication: (medicationId, quantity, buffs = {}) => {
                        const state = get();
                        const canonicalMedicationId = normalizeMedicationId(medicationId);
                        const currentItem = state.finance.pharmacyInventory.find(item => item.medicationId === canonicalMedicationId);
                        const medication = getMedicationById(canonicalMedicationId) || getMedicationById(medicationId);
                        if (!medication) return { success: false, error: 'Medication not found' };
                        if (!currentItem || currentItem.stock < quantity) return { success: false, error: `Insufficient stock` };
                        set(s => ({
                            finance: {
                                ...s.finance,
                                pharmacyInventory: s.finance.pharmacyInventory.map(item =>
                                    item.medicationId === canonicalMedicationId ? { ...item, stock: item.stock - quantity } : item
                                )
                            }
                        }));
                        // Codex Fix: pengeluaranObat is procurement-side only (COGS-on-purchase).
                        // Consumption just reduces stock — cost was already posted when order was placed/received.
                        return { success: true, remainingStock: currentItem.stock - quantity };
                    },
                    // Codex Fix: mark prescription as dispensed in history to prevent double-dispense on remount
                    markPrescriptionDispensed: (patientId) => {
                        set(produce(state => {
                            // Mark dispensed in history
                            state.clinical.history = (state.clinical.history || []).map(h =>
                                h.id === patientId ? { ...h, dispensed: true } : h
                            );
                            // Pharmacy verification bonus: +5 XP, +1 reputation
                            state.player.profile = applyXpGainToProfile({
                                ...state.player.profile,
                                reputation: Math.min(100, (state.player.profile.reputation || 0) + 1)
                            }, 5);
                        }));
                    },
                    checkInventoryAvailability: (medicationId, quantity) => {
                        const state = get();
                        const canonicalMedicationId = normalizeMedicationId(medicationId);
                        const currentItem = state.finance.pharmacyInventory.find(item => item.medicationId === canonicalMedicationId);
                        const medication = getMedicationById(canonicalMedicationId) || getMedicationById(medicationId);
                        if (!currentItem || !medication) return { available: false, stock: 0 };
                        return {
                            available: currentItem.stock >= quantity,
                            stock: currentItem.stock,
                            isLowStock: currentItem.stock < medication.minStock,
                            percentageOfMin: (currentItem.stock / medication.minStock) * 100
                        };
                    },
                    submitOrder: (orderItems, supplierId, day, isExpress = false) => {
                        const state = get();
                        const supplier = getSupplierById(supplierId);
                        if (!supplier) return { success: false, error: 'Supplier not found' };
                        const normalizedOrderItems = (Array.isArray(orderItems) ? orderItems : []).map(item => ({
                            ...item,
                            medicationId: normalizeMedicationId(item?.medicationId)
                        }));

                        // Codex Fix: filter compatible items instead of blocking entire batch.
                        // acceptsAll suppliers (dinkes, apotek) accept all categories incl. null.
                        let compatibleItems = normalizedOrderItems;
                        const skipped = [];
                        if (!supplier.acceptsAll && supplier.availableCategories) {
                            compatibleItems = [];
                            for (const item of normalizedOrderItems) {
                                const med = getMedicationById(item.medicationId);
                                if (!med) continue;
                                // Codex Fix: null-category items are incompatible with specialized suppliers
                                if (!med.category || !supplier.availableCategories.includes(med.category)) {
                                    skipped.push(med.name || item.medicationId);
                                } else {
                                    compatibleItems.push(item);
                                }
                            }
                        }
                        if (compatibleItems.length === 0) {
                            return { success: false, error: `${supplier.name} tidak menjual item yang dipilih${skipped.length ? `: ${skipped.join(', ')}` : ''}` };
                        }

                        const items = compatibleItems.map(item => {
                            const med = getMedicationById(item.medicationId);
                            return { ...item, unitPrice: med?.buyPrice || 0 };
                        });
                        const costCalculation = calculateOrderCost(supplierId, items, isExpress);
                        if (costCalculation.error) return { success: false, error: costCalculation.error };
                        const totalCost = costCalculation.total; // Already includes express surcharge
                        // Codex Fix: include pending kapitasi_deduction orders in solvency check
                        const pendingKapitasiReserved = (state.finance.pendingOrders || []).filter(
                            o => o.status === 'pending' && o.paymentTerms === 'kapitasi_deduction'
                        ).reduce((sum, o) => sum + (o.cost || 0), 0);
                        const effectiveKapitasi = state.finance.stats.kapitasi - pendingKapitasiReserved;
                        if (effectiveKapitasi < totalCost) return { success: false, error: 'Dana kapitasi tidak cukup (termasuk order pending)' };
                        if (supplier.paymentTerms === 'cash_upfront') {
                            set(s => ({
                                finance: {
                                    ...s.finance,
                                    stats: {
                                        ...s.finance.stats,
                                        kapitasi: s.finance.stats.kapitasi - totalCost,
                                        pengeluaranObat: (s.finance.stats.pengeluaranObat || 0) + totalCost
                                    }
                                }
                            }));
                        }
                        const newOrder = {
                            id: `ORDER_${Date.now()}`,
                            supplierId,
                            items: compatibleItems.filter(ci => {
                                // Codex Fix: Strip program meds (buyPrice=0) from non-government orders
                                // so they don't piggyback into restock for free
                                const med = getMedicationById(ci.medicationId);
                                if (!med) return false;
                                if (med.buyPrice === 0 && supplier.type !== 'government') return false;
                                return true;
                            }),
                            orderDay: day,
                            // Use estimateDeliveryDate with express flag (respects supplier contract)
                            deliveryDay: (() => {
                                const baseDelivery = estimateDeliveryDate(supplierId, day, isExpress);
                                const maxItemLead = compatibleItems.reduce((max, item) => {
                                    const med = getMedicationById(item.medicationId);
                                    return (med?.leadTime && med.leadTime > max) ? med.leadTime : max;
                                }, 0);
                                return !isExpress && maxItemLead > 0 ? Math.max(baseDelivery, day + maxItemLead) : baseDelivery;
                            })(),
                            status: 'pending',
                            cost: totalCost,
                            paymentTerms: supplier.paymentTerms,
                            isExpress
                        };
                        set(s => ({ finance: { ...s.finance, pendingOrders: [...s.finance.pendingOrders, newOrder] } }));
                        // Audit trail: log the procurement event
                        set(s => ({
                            finance: {
                                ...s.finance,
                                procurementLog: [...(s.finance.procurementLog || []), {
                                    type: 'order_placed',
                                    orderId: newOrder.id,
                                    supplierName: supplier.name,
                                    supplierId,
                                    itemCount: newOrder.items.length,
                                    skippedCount: skipped.length,
                                    cost: totalCost, // Include express surcharge
                                    isExpress,
                                    orderMode: isExpress ? 'express' : 'regular',
                                    day,
                                    timestamp: Date.now()
                                }]
                            }
                        }));
                        compatibleItems = newOrder.items;
                        soundManager.playConfirm();
                        const msg = skipped.length > 0
                            ? `Order dikirim (${compatibleItems.length} item). ${skipped.length} item dilewati — tidak tersedia di ${supplier.name}.`
                            : `Order berhasil dikirim (${compatibleItems.length} item)`;
                        return { success: true, order: newOrder, message: msg, skipped };
                    },
                    receiveOrder: (orderId, day) => {
                        const state = get();
                        const order = state.finance.pendingOrders.find(o => o.id === orderId);
                        if (!order) return { success: false, error: 'Order not found' };
                        set(s => {
                            const newStats = { ...s.finance.stats };
                            // Codex Fix: sync with nextDay path — deduct kapitasi for kapitasi_deduction orders
                            if (order.paymentTerms === 'kapitasi_deduction' && order.cost) {
                                newStats.kapitasi = (newStats.kapitasi || 0) - order.cost;
                                newStats.pengeluaranObat = (newStats.pengeluaranObat || 0) + order.cost;
                            }
                            return {
                                finance: {
                                    ...s.finance,
                                    stats: newStats,
                                    pharmacyInventory: s.finance.pharmacyInventory.map(item => {
                                        const orderItem = order.items.find(oi => normalizeMedicationId(oi.medicationId) === item.medicationId);
                                        return orderItem ? { ...item, stock: item.stock + orderItem.quantity, lastRestockDay: day } : item;
                                    }),
                                    pendingOrders: s.finance.pendingOrders.map(o => o.id === orderId ? { ...o, status: 'received', receivedDay: day } : o)
                                }
                            };
                        });
                        soundManager.playSuccess();
                        // Audit trail: log the receive event
                        set(s => ({
                            finance: {
                                ...s.finance,
                                procurementLog: [...(s.finance.procurementLog || []), {
                                    type: 'order_received',
                                    orderId,
                                    supplierId: order.supplierId,
                                    supplierName: getSupplierById(order.supplierId)?.name || order.supplierId,
                                    itemCount: order.items.length,
                                    cost: order.cost,
                                    isExpress: Boolean(order.isExpress),
                                    receiptMode: 'manual',
                                    day,
                                    timestamp: Date.now()
                                }]
                            }
                        }));
                        return { success: true };
                    },
                    archiveDay: (_day) => {
                        set(s => {
                            const dailyOpCost = 50000 + (Object.values(s.finance.facilities).reduce((a, b) => a + b, 0) * 10000);
                            return {
                                finance: {
                                    ...s.finance,
                                    stats: { ...s.finance.stats, pengeluaranOperasional: (s.finance.stats.pengeluaranOperasional || 0) + dailyOpCost }
                                }
                            };
                        });
                    },
                    processMonthlyReport: (accreditation, hiredStaff) => {
                        set(s => {
                            const accreditationMultiplier = ACCREDITATION_MULTIPLIER[accreditation] || 1.0;
                            const monthlyKapitasi = 50000000 * accreditationMultiplier;
                            const totalSalaries = hiredStaff.reduce((total, staffMember) => total + (staffMember.salary || 0), 0);
                            const monthlyReport = buildMonthlyArchiveEntry(s, accreditation, hiredStaff);
                            const existingMonthReport = monthlyReport
                                ? (s.clinical.monthlyArchive || []).find((entry) => entry?.month === monthlyReport.month)
                                : null;
                            const monthlyArchive = monthlyReport
                                ? [
                                    ...(s.clinical.monthlyArchive || []).filter((entry) => entry?.month !== monthlyReport.month),
                                    monthlyReport
                                ]
                                : s.clinical.monthlyArchive;

                            if (existingMonthReport) {
                                return {
                                    clinical: {
                                        ...s.clinical,
                                        monthlyArchive
                                    }
                                };
                            }

                            return {
                                finance: {
                                    ...s.finance,
                                    stats: {
                                        ...s.finance.stats,
                                        kapitasi: s.finance.stats.kapitasi + monthlyKapitasi - totalSalaries,
                                        pengeluaranObat: 0,
                                        pengeluaranLab: 0,
                                        pengeluaranOperasional: 0,
                                        pendapatanUmum: 0
                                    },
                                    kpi: INITIAL_KPI
                                },
                                clinical: {
                                    ...s.clinical,
                                    monthlyArchive
                                }
                            };
                        });
                        soundManager.playNotification();
                    },
                    resetFinance: () => set(s => ({
                        finance: {
                            ...s.finance,
                            ...createInitialFinanceState()
                        }
                    }))
                },

                // --- SLICE: PUBLIC HEALTH ---
                publicHealth: createInitialPublicHealthState(),
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
                    completeProlanisVisit: (visitData, day) => {
                        const { patientId, doctorDecisions } = visitData;
                        const rosterId = patientId.split('_visit_')[0];
                        set(state => {
                            const effectiveDay = Number.isFinite(day) ? day : state.world.day;
                            let xpEarned = 0;
                            const updatedRoster = state.publicHealth.prolanisRoster.map(member => {
                                if (member.id !== rosterId) return member;

                                // ═══ CONTRACT ADAPTER ═══════════════════════════
                                // EMR sends: { diagnoses, medications, action }
                                // Engine expects: { medicationAction, education, complianceBonus }
                                const hasMeds = Array.isArray(doctorDecisions?.medications) && doctorDecisions.medications.length > 0;
                                const diseaseType = member.prolanisData?.diseaseType;

                                // Map medications → medicationAction with paramChange
                                // Each medication given = -15 paramChange (therapeutic effect)
                                const medicationAction = hasMeds ? {
                                    effect: {
                                        paramChange: -(15 * Math.min(doctorDecisions.medications.length, 3))
                                    }
                                } : null;

                                // Compliance bonus if patient visited within 35 days
                                const lastVisitDay = member.prolanisData?.lastVisitDay || 0;
                                const complianceBonus = lastVisitDay > 0 && (effectiveDay - lastVisitDay) <= 35;

                                // Education: if meds were given, assume basic education was provided
                                const education = hasMeds ? [{
                                    effect: diseaseType === 'dm_type2'
                                        ? { gds: -8, hba1c: -0.05 }
                                        : { systolic: -3, diastolic: -2 }
                                }] : [];

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

                        // Generate generic patients if scenario phase requested it (e.g. from failed intervention)
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

                            // Prevent overflowing the queue if there are too many patients
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

                    /** Manually trigger an IKM event (e.g. from clicking linkedScenario badge) */
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

                    /** Generic phase advancer for the UI to move to the next phase (e.g. after Q&A) */
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
                    }
                },

                // --- SLICE: STAFF (CP2 extracted) ---
                ...createStaffSlice(set, get),

                // --- SLICE: CLINICAL ---
                clinical: createInitialClinicalState(),
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
                                villageData,
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
                                        outcomeStatus: 'stabilized',
                                        satisfactionScore,
                                        isEmergency: true,
                                        dispensed: true, // IGD always auto-dispenses
                                        cpptRecord: buildMaiaCPPTRecord(patient, day, time, 'stabilized', true)
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
                    resetDailyState: () => set(s => ({ clinical: { ...s.clinical, queue: [], emergencyQueue: [], activePatientId: null, activeEmergencyId: null, activeReferral: null, busyAmbulanceIds: [], hospitalBedUsage: {}, activeReferralLog: [] } })) },

                // --- SLICE: META (Quests, Stories, Wiki) ---
                meta: createInitialMetaState(INITIAL_TIME_STATE.day),
                metaActions: {
                    setMeta: (meta) => set((s) => ({ meta: { ...s.meta, ...meta } })),

                    updateProgress: (metric, amount = 1) => {
                        const normalizedMetric = normalizeProgressMetric(metric);
                        let failureMessage = null;

                        const txResult = withTransaction(set, get, 'updateProgress', (state) => {
                            const { updatedQuests, updatedStories, storyImpactEvents } = updateGameProgress(
                                state.meta.activeQuests,
                                state.meta.activeStories,
                                normalizedMetric,
                                amount
                            );

                            for (const event of storyImpactEvents) {
                                const impactResult = applyStoryImpactToDraft(state, event.impact);
                                if (!impactResult.success) {
                                    failureMessage = impactResult.message;
                                    throw new Error(failureMessage);
                                }
                            }

                            state.meta.activeQuests = updatedQuests;
                            state.meta.activeStories = updatedStories;
                        });

                        if (!txResult.success) {
                            soundManager.playError();
                            return { success: false, message: failureMessage || 'Progress cerita gagal diperbarui.' };
                        }

                        return { success: true, metric: normalizedMetric };
                    },

                    claimQuest: (questId) => {
                        const s = get();
                        const { updatedQuests, xpReward } = claimQuestReward(s.meta.activeQuests, questId);
                        if (xpReward > 0) get().playerActions.gainXp(xpReward);
                        set({ meta: { ...s.meta, activeQuests: updatedQuests } });
                    },

                    advanceStory: (storyInstance, choice) => {
                        const currentState = get();
                        const currentStory = currentState.meta.activeStories.find(st => st.instanceId === storyInstance.instanceId);

                        if (!currentStory) {
                            soundManager.playError();
                            return { success: false, message: 'Cerita aktif tidak ditemukan.' };
                        }

                        if (currentStory.completed) {
                            return { success: false, message: 'Cerita ini sudah selesai.' };
                        }

                        let updated = currentStory;
                        let failureMessage = null;

                        const txResult = withTransaction(set, get, 'advanceStory', (state) => {
                            const liveStory = state.meta.activeStories.find(st => st.instanceId === storyInstance.instanceId);
                            if (!liveStory || liveStory.completed) {
                                failureMessage = 'Cerita ini sudah selesai.';
                                throw new Error(failureMessage);
                            }

                            const choiceImpactResult = applyStoryImpactToDraft(state, choice?.impact);
                            if (!choiceImpactResult.success) {
                                failureMessage = choiceImpactResult.message;
                                throw new Error(failureMessage);
                            }

                            updated = advanceStoryNode(liveStory, choice);

                            const endNodeImpact = getStoryNodeImpact(updated);
                            const endImpactResult = applyStoryImpactToDraft(state, endNodeImpact);
                            if (!endImpactResult.success) {
                                failureMessage = endImpactResult.message;
                                throw new Error(failureMessage);
                            }

                            state.meta.activeStories = state.meta.activeStories.map(st =>
                                st.instanceId === storyInstance.instanceId ? updated : st
                            );
                        });

                        if (!txResult.success) {
                            soundManager.playError();
                            return { success: false, message: failureMessage || 'Pilihan tidak dapat dijalankan.' };
                        }

                        return { success: true, story: updated };
                    },

                    evaluateTriggers: () => {
                        const s = get();
                        const gameState = {
                            day: s.world.day,
                            reputation: s.player.profile.reputation,
                            balance: s.finance.stats.pendapatanUmum, // Using public funds for trigger checks
                            patients_treated: s.finance.kpi.totalPatients
                        };
                        const newStories = evaluateStoryTriggers(gameState, s.meta.activeStories);
                        if (newStories.length > 0) {
                            set({ meta: { ...s.meta, activeStories: [...s.meta.activeStories, ...newStories] } });
                        }
                    },

                    openWiki: (key) => set((s) => ({ meta: { ...s.meta, isWikiOpen: true, wikiMetric: key } })),
                    closeWiki: () => set((s) => ({ meta: { ...s.meta, isWikiOpen: false } })),

                    resetMeta: () => set({ meta: createInitialMetaState(get().world.day) })
                },

                // --- ORCHESTRATION ACTIONS ---
                actions: {
                    saveGame: (slotId = get().nav.currentSlotId) => {
                        if (slotId === null) return false;
                        try {
                            const state = get();
                            const saveData = buildManualSaveSnapshot(state);
                            if (!saveData) return false;
                            return safeSetStorageItem(`primer_save_${slotId}`, JSON.stringify(saveData));
                        } catch (error) {
                            console.error('[Store] Save failed:', error);
                            return false;
                        }
                    },

                    loadGame: (saveData, slotId) => {
                        const normalizedSave = parseSavePayload(saveData);
                        if (!normalizedSave) {
                            console.warn('[Store] Load rejected: invalid save payload');
                            return false;
                        }
                        try {
                            set(produce(s => {
                                s.nav = createInitialNavState({
                                    sidebarCollapsed: s.nav.sidebarCollapsed,
                                    settings: s.nav.settings,
                                    currentSlotId: slotId,
                                    gameState: 'playing'
                                });

                                if (normalizedSave.player) {
                                    s.player = {
                                        ...s.player,
                                        ...normalizedSave.player,
                                        profile: sanitizePlayerProfile({
                                            ...s.player.profile,
                                            ...(normalizedSave.player.profile || {})
                                        })
                                    };
                                }
                                if (normalizedSave.world) {
                                    s.world = { ...s.world, ...normalizePersistedWorld(normalizedSave.world) };
                                }
                                if (normalizedSave.finance) {
                                    s.finance = mergePersistedFinance(normalizedSave.finance, s.finance);
                                }
                                if (normalizedSave.clinical) {
                                    s.clinical = mergePersistedClinical(normalizedSave.clinical, s.clinical);
                                }
                                if (normalizedSave.publicHealth) {
                                    s.publicHealth = mergePersistedPublicHealth(normalizedSave.publicHealth, s.publicHealth);
                                }
                                if (normalizedSave.staff) {
                                    s.staff = mergePersistedStaff(normalizedSave.staff, s.staff);
                                }

                                s.meta = mergePersistedMeta(
                                    {
                                        ...(normalizedSave.meta || {}),
                                        saveVersion: normalizedSave.saveVersion || CURRENT_SAVE_VERSION
                                    },
                                    s.meta,
                                    s.world.day
                                );
                                s.clinical.gameOver = null;
                                s.world.isPaused = false;
                                s.clinical = reconcileClinicalReferralLog(s.clinical, s.world);
                            }));
                            return true;
                        } catch (error) {
                            console.error('[Store] Load failed:', error);
                            return false;
                        }
                    },

                    startNewGame: (profile, slotId) => {
                        const s = get();
                        s.actions.resetGame();

                        set(produce(state => {
                            state.nav.currentSlotId = slotId;
                            state.player.profile = createStartingPlayerProfile(profile);

                            const population = {
                                families: VILLAGE_FAMILIES.map(f => ({
                                    ...f,
                                    members: f.members.map(m => ({ ...m, fullName: `${m.firstName} ${f.surname}` })),
                                    indicators: FAMILY_INDICATORS[f.id] || {},
                                    iksScore: calculateIKS(FAMILY_INDICATORS[f.id] || {})
                                })),
                                villagers: getAllVillagers(),
                                stats: VILLAGE_STATS
                            };
                            state.publicHealth.villageData = ensureVillageReadinessState(population);

                            state.clinical.queue = [
                                generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-patient', 0)),
                                generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-patient', 1)),
                                generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game-patient', 2))
                            ];
                            state.nav.gameState = 'playing';
                        }));
                    },

                    nextDay: (targetDay = get().world.day) => {
                        const s = get();
                        const didSaveSnapshot = s.actions.saveGame(); // Save previous day state
                        if (!didSaveSnapshot) {
                            return armAutosaveTrap(
                                set,
                                get,
                                'autosave_preflight',
                                'Autosave gagal sebelum pergantian hari. Permainan dijeda untuk mencegah kehilangan progres.'
                            );
                        }

                        set(produce(state => {
                            // 1. Archive Day (Finance)
                            const dailyOpCost = 50000 + (Object.values(state.finance.facilities).reduce((a, b) => a + b, 0) * 10000);
                            state.finance.stats.pengeluaranOperasional = (state.finance.stats.pengeluaranOperasional || 0) + dailyOpCost;

                            // 1.5 Auto-receive matured orders (Codex Fix: receiveOrder was never called)
                            const nextDayNum = targetDay + 1;
                            if (state.finance.pendingOrders) {
                                state.finance.pendingOrders.forEach(order => {
                                    if (order.status === 'pending' && order.deliveryDay <= nextDayNum) {
                                        // Supply Chain Friction: reliability RNG check
                                        const supplier = getSupplierById(order.supplierId);
                                        const reliability = supplier?.reliability || 0.95;
                                        if (Math.random() > reliability && !order.isExpress) {
                                            // Delivery delayed! Push back 1 day
                                            order.deliveryDay += 1;
                                            state.clinical.morningAlerts = [
                                                ...(state.clinical.morningAlerts || []),
                                                { type: 'supply_delay', message: `⚠️ Pengiriman dari ${supplier?.name || 'supplier'} tertunda (cuaca/logistik). Estimasi tiba: Hari ${order.deliveryDay}` }
                                            ];
                                            return; // Skip receive, try again next day
                                        }
                                        // Add stock
                                        order.items.forEach(oi => {
                                            const invItem = state.finance.pharmacyInventory.find(
                                                item => item.medicationId === normalizeMedicationId(oi.medicationId)
                                            );
                                            if (invItem) {
                                                invItem.stock += oi.quantity;
                                                invItem.lastRestockDay = nextDayNum;
                                            }
                                        });
                                        if (order.paymentTerms === 'kapitasi_deduction' && order.cost > 0) {
                                            state.finance.stats.kapitasi -= order.cost;
                                            state.finance.stats.pengeluaranObat = (state.finance.stats.pengeluaranObat || 0) + order.cost;
                                        }
                                        order.status = 'received';
                                        order.receivedDay = nextDayNum;
                                        // Audit trail: log auto-receive event
                                        state.finance.procurementLog = [
                                            ...(state.finance.procurementLog || []),
                                            {
                                                type: 'order_received',
                                                orderId: order.id,
                                                supplierId: order.supplierId,
                                                supplierName: getSupplierById(order.supplierId)?.name || order.supplierId,
                                                itemCount: order.items.length,
                                                cost: order.cost,
                                                isExpress: Boolean(order.isExpress),
                                                receiptMode: 'auto',
                                                day: nextDayNum,
                                                timestamp: Date.now()
                                            }
                                        ];
                                    }
                                });
                            }

                            const casesToday = (state.clinical.todayLog || []).length;
                            const archivedDay = buildDailyArchiveEntry(state, targetDay);
                            state.clinical.dailyArchive = [
                                ...(state.clinical.dailyArchive || []).filter((entry) => entry?.day !== targetDay),
                                archivedDay
                            ];

                            // 2. Reset Clinical State
                            state.clinical.queue = [];
                            state.clinical.todayLog = [];           // Clear daily log
                            state.clinical.showMorningBriefing = true; // Trigger morning briefing
                            state.clinical.showEndOfDayDebrief = false;
                            state.clinical.dailyQuestId = null;
                            state.clinical.morningReputation = state.player.profile.reputation || 80;

                            const nextDayVal = targetDay + 1;
                            // 3. Staff Decay
                            state.staff.hiredStaff = applyStaffMoraleDecay(
                                state.staff.hiredStaff,
                                `staff-next-day:${nextDayVal}`
                            );

                            // 4. Public Health (Process Daily)
                            const { activeOutbreaks, villageData } = state.publicHealth;
                            const riskModifiers = pruneOutbreakRiskModifiers(state.publicHealth.outbreakRiskModifiers, targetDay);
                            // Note: We use state.publicHealth directly from draft
                            // Re-implement checkOutbreakExpiry logic inline or call helper if pure?
                            // checkOutbreakExpiry is pure.
                            const { updatedOutbreaks } = checkOutbreakExpiry(activeOutbreaks, targetDay); // Use targetDay (current day) or nextDay? Original passed `day` (current).
                            const newOutbreak = checkForOutbreakTrigger(state.clinical.history, villageData, targetDay, updatedOutbreaks, riskModifiers);

                            state.publicHealth.activeOutbreaks = updatedOutbreaks;
                            state.publicHealth.outbreakRiskModifiers = riskModifiers;
                            if (newOutbreak) {
                                state.publicHealth.activeOutbreaks.push(newOutbreak);
                                state.publicHealth.outbreakNotification = newOutbreak;
                                soundManager.playError();
                            }

                            // Village Dynamic Health (Random fluctuations)
                            if (state.publicHealth.villageData) {
                                state.publicHealth.villageData.families =
                                    state.publicHealth.villageData.families.map((fam) => {
                                        return applyFamilyIndicatorDrift(
                                            fam,
                                            `next-day:${nextDayVal}:${fam.id}`
                                        );
                                    });

                                if (state.publicHealth.villageData.readinessState) {
                                    const readinessDecay = applyNeglectDecay(
                                        state.publicHealth.villageData.readinessState,
                                        nextDayVal
                                    );
                                    state.publicHealth.villageData.readinessState = readinessDecay.state;
                                }
                            }

                            // 4.5. UKM: Evaluate IKM Triggers for new day
                            const season = getSeasonForDay(nextDayVal);
                            const ikmState = {
                                day: nextDayVal,
                                season,
                                villageData: state.publicHealth.villageData,
                                activeIKMEvents: state.publicHealth.activeIKMEvents || [],
                                completedIKMEvents: state.publicHealth.completedIKMIds || [],
                                eventCooldowns: state.publicHealth.ikmCooldowns || {},
                                activeBCCases: (state.publicHealth.villageData?.families || []).map(f => f.activeScenarioId).filter(Boolean).map(id => id.replace('bc_', ''))
                            };
                            const newIKMEvents = evaluateIKMTriggers(ikmState);
                            if (newIKMEvents.length > 0) {
                                state.publicHealth.activeIKMEvents = [
                                    ...(state.publicHealth.activeIKMEvents || []),
                                    ...newIKMEvents
                                ];
                            }

                            // 4.6. Expire old IKM case boosts
                            if (state.publicHealth.ikmCaseBoosts) {
                                state.publicHealth.ikmCaseBoosts = state.publicHealth.ikmCaseBoosts.filter(
                                    b => b.expiresDay > nextDayVal
                                );
                            }

                            // 4.7. TheDirector — Evaluate Stress & Set Pacing
                            const directorInput = {
                                day: nextDayVal,
                                queueLength: state.clinical.queue.length,
                                emergencyQueueLength: (state.clinical.emergencyQueue || []).length,
                                energy: state.player.profile.energy || 100,
                                reputation: state.player.profile.reputation || 50,
                                activeOutbreakCount: (state.publicHealth.activeOutbreaks || []).length,
                                casesToday
                            };
                            const verdict = evaluateDirectorState(directorInput);
                            state.world.directorVerdict = verdict;

                            // Director Gift (mercy/breathing mode bonus)
                            if (verdict.shouldGift) {
                                const gift = generateDirectorGift(seedKey('director-gift', nextDayVal, verdict.label));
                                if (gift.impact.energy) state.player.profile.energy = clampEnergyToProfile(state.player.profile, state.player.profile.energy + gift.impact.energy);
                                if (gift.impact.spirit) state.player.profile.spirit = Math.min(100, state.player.profile.spirit + gift.impact.spirit);
                                if (gift.impact.reputation) state.player.profile.reputation = Math.min(100, state.player.profile.reputation + gift.impact.reputation);
                                state.world.directorGiftMessage = gift.message;
                            } else {
                                state.world.directorGiftMessage = null;
                            }

                            // 4.8. UKP Bridge — Failed UKM cases spawn clinical consequences
                            const completedBCCases = collectPendingUkpBridgeCases(state.clinical.history || []);
                            const ukpEvents = processUKPBridge(completedBCCases, nextDayVal);
                            const bridgedHistoryIds = [];
                            ukpEvents.forEach(evt => {
                                if (evt.reputationPenalty) {
                                    state.player.profile.reputation = Math.max(0, state.player.profile.reputation + evt.reputationPenalty);
                                }
                                if (evt.historyEntryId) {
                                    bridgedHistoryIds.push(evt.historyEntryId);
                                }
                                // Push consequence narrative to clinical log
                                state.clinical.consequenceQueue.push({
                                    type: 'ukp_bridge',
                                    message: evt.message,
                                    diseaseId: evt.diseaseId,
                                    severity: evt.severity,
                                    spawnDay: evt.spawnDay || nextDayVal,
                                    returnDay: nextDayVal + 1
                                });
                            });
                            if (bridgedHistoryIds.length > 0) {
                                state.clinical.history = markBehaviorCaseBridgeSpawned(
                                    state.clinical.history,
                                    bridgedHistoryIds,
                                    nextDayVal
                                );
                            }

                            // 5. Advance Time
                            state.world.day = nextDayVal;
                            state.world.time = 480;
                            state.meta.activeQuests = syncQuestRoster(state.meta.activeQuests, nextDayVal);
                            state.meta.saveVersion = CURRENT_SAVE_VERSION;
                            state.meta.isWikiOpen = false;
                            state.meta.wikiMetric = null;
                            state.meta.runtimeTrap = null;
                            state.clinical.busyAmbulanceIds = state.clinical.busyAmbulanceIds.filter(
                                item => isAmbulanceStillBusy(item, nextDayVal, 480)
                            );
                            state.clinical.activeReferralLog = reconcileReferralLog(
                                state.clinical.activeReferralLog,
                                nextDayVal,
                                480
                            ).activeReferralLog;

                            // 6. Monthly Report Trigger
                        }));

                        // Monthly Report (Post-update)
                        const nextDayVal = targetDay + 1;
                        clearStability('ACTION_metaActions.updateProgress');
                        get().metaActions.updateProgress('days_passed', 1);
                        if (nextDayVal % 30 === 1) {
                            get().financeActions.processMonthlyReport(get().clinical.accreditation, get().staff.hiredStaff);
                        }

                        // Re-trigger auto-save
                        setTimeout(() => {
                            if (!get().actions.saveGame()) {
                                armAutosaveTrap(
                                    set,
                                    get,
                                    'autosave_postshift',
                                    'Autosave gagal setelah pergantian hari. Bebaskan ruang penyimpanan sebelum melanjutkan.'
                                );
                            }
                        }, 500);
                    },

                    resetGame: () => set((s) => ({
                        nav: createInitialNavState({
                            sidebarCollapsed: s.nav.sidebarCollapsed,
                            settings: s.nav.settings
                        }),
                        world: { ...INITIAL_TIME_STATE },
                        player: { profile: sanitizePlayerProfile(INITIAL_PLAYER_STATE) },
                        finance: createInitialFinanceState(),
                        publicHealth: createInitialPublicHealthState(),
                        staff: createInitialStaffState(),
                        clinical: createInitialClinicalState(),
                        meta: createInitialMetaState(INITIAL_TIME_STATE.day) })) }
            };

                return guardStoreActions(store, set, get);
            },
            {
                name: 'primer_gamestate_v4',
                merge: (persistedState, currentState) => {
                    const nextState = isPlainObject(persistedState) ? persistedState : {};
                    const mergedWorld = nextState.world
                        ? { ...currentState.world, ...normalizePersistedWorld(nextState.world) }
                        : currentState.world;
                    const mergedClinical = nextState.clinical
                        ? mergePersistedClinical(nextState.clinical, currentState.clinical)
                        : currentState.clinical;
                    const mergedMeta = nextState.meta
                        ? mergePersistedMeta(nextState.meta, currentState.meta, mergedWorld.day)
                        : mergePersistedMeta(currentState.meta, currentState.meta, mergedWorld.day);

                    return {
                        ...currentState,
                        ...nextState,
                        world: mergedWorld,
                        player: nextState.player
                            ? {
                                ...currentState.player,
                                ...nextState.player,
                                profile: sanitizePlayerProfile({
                                    ...currentState.player.profile,
                                    ...(nextState.player.profile || {})
                                })
                            }
                            : currentState.player,
                        finance: nextState.finance
                            ? mergePersistedFinance(nextState.finance, currentState.finance)
                            : currentState.finance,
                        publicHealth: nextState.publicHealth
                            ? mergePersistedPublicHealth(nextState.publicHealth, currentState.publicHealth)
                            : currentState.publicHealth,
                        staff: nextState.staff
                            ? mergePersistedStaff(nextState.staff, currentState.staff)
                            : currentState.staff,
                        clinical: reconcileClinicalReferralLog(mergedClinical, mergedWorld),
                        meta: mergedMeta
                    };
                },
                partialize: (state) => {
                    const normalizedWorld = normalizePersistedWorld(state.world);
                    const mergedClinical = mergePersistedClinical(state.clinical, createInitialClinicalState());
                    const mergedMeta = mergePersistedMeta(
                        { ...state.meta, saveVersion: CURRENT_SAVE_VERSION },
                        createInitialMetaState(normalizedWorld.day),
                        normalizedWorld.day
                    );

                    return {
                        world: normalizedWorld,
                        player: {
                            ...state.player,
                            profile: sanitizePlayerProfile(state.player.profile)
                        },
                        finance: mergePersistedFinance(state.finance, createInitialFinanceState()),
                        publicHealth: mergePersistedPublicHealth(state.publicHealth, createInitialPublicHealthState()),
                        staff: mergePersistedStaff(state.staff, createInitialStaffState()),
                        clinical: reconcileClinicalReferralLog(mergedClinical, normalizedWorld),
                        meta: mergedMeta
                    };
                } }
        )
    )
);
