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
import { createFinanceSlice } from './slices/createFinanceSlice.js';
import { createMetaSlice } from './slices/createMetaSlice.js';
import { createPublicHealthSlice } from './slices/createPublicHealthSlice.js';
import { createClinicalSlice } from './slices/createClinicalSlice.js';
import { createOrchestratorSlice } from './slices/createOrchestratorSlice.js';

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

                // --- SLICE: FINANCE (CP2 extracted) ---
                ...createFinanceSlice(set, get),

                // --- SLICE: PUBLIC HEALTH (CP2 extracted) ---
                ...createPublicHealthSlice(set, get),

                // --- SLICE: STAFF (CP2 extracted) ---
                ...createStaffSlice(set, get),


                // --- SLICE: CLINICAL (CP2 extracted) ---
                ...createClinicalSlice(set, get),

                // --- SLICE: META (CP2 extracted) ---
                ...createMetaSlice(set, get),


                // --- SLICE: ORCHESTRATOR (CP2 extracted) ---
                ...createOrchestratorSlice(set, get),
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
