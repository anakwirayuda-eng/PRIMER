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
import { MEDICATION_DATABASE, getMedicationById } from '../data/MedicationDatabase.js';
import { getSupplierById, calculateOrderCost, estimateDeliveryDate } from '../data/SupplierDatabase.js';
import { generateInitialParameters, determineMonthlyOutcome } from '../game/ProlanisEngine.js';
import { applyOutbreakAction, checkForOutbreakTrigger, checkOutbreakExpiry } from '../domains/community/OutbreakSystem.js';
import { TRIAGE_LEVELS, calculateEmergencyBill } from '../game/EmergencyCases.js';
import { PROCEDURES_DB } from '../data/ProceduresDB.js';
import { HOSPITALS, AMBULANCES } from '../data/HospitalDB.js';
import { buildCPPTRecord, buildMaiaCPPTRecord } from '../game/CPPTEngine.js';
import { getPatientSpikeMultiplier } from '../domains/community/OutbreakSystem.js';
import { generatePatient, generateEmergencyPatient, generateFollowupPatient, generateGenericPatients, generateProlanisVisitPatient } from '../game/PatientGenerator.js';
import { getScheduledFollowups, clearProcessedFollowups } from '../game/ConsequenceEngine.js';
import { checkLevelUp, getNextLevelXp } from '../utils/LevelingSystem.js';
import { evaluateIKMTriggers, resolveEvent, calculateEventImpact, getSeasonForDay, createEventInstance, advanceEventPhase } from '../game/IKMEventEngine.js';
import { getScenarioById } from '../content/scenarios/IKMScenarioLibrary.js';
import { VILLAGE_FAMILIES, FAMILY_INDICATORS, VILLAGE_STATS, getAllVillagers } from '../domains/village/VillageRegistry.js';
import { claimQuestReward, evaluateStoryTriggers, advanceStoryNode, updateGameProgress } from '../game/QuestEngine.js';
import { STORY_TEMPLATES } from '../game/StoryDatabase.js';
import { getIndicatorByDx } from '../game/CaseIndicators.js';
import { evaluateDirectorState, generateDirectorGift, processUKPBridge } from '../game/TheDirector.js';
import { buildRuntimeTrap, guardActionGroup, triggerFreezeProtocol } from '../utils/dispatchGuard.js';
import { CURRENT_SAVE_VERSION, createSaveSnapshot, parseSavePayload } from '../utils/savePayload.js';
import { withTransaction } from '../utils/transactions.js';
import { chanceFromSeed, pickDeterministic, seedKey, seededBetween, seededInt } from '../utils/deterministicRandom.js';
import { safeSetStorageItem } from '../utils/browserSafety.js';


import {
    INITIAL_PLAYER_STATE,
    INITIAL_TIME_STATE,
    calculateIKS,
    calculateGlobalBuffs,
    calculateSleepRecovery as calculateSleepRecoveryOutcome
} from '../game/GameCore.js';

const buildProlanisBpjsNumber = (patient, day) => {
    const patientSeed = patient?.id || patient?.name || 'prolanis';
    const suffix = String(seededInt(`prolanis:${patientSeed}:${day}`, 10000)).padStart(4, '0');
    return `PRO-${suffix}`;
};

const applyFamilyIndicatorDrift = (family, seed) => {
    if (!family?.indicators || !chanceFromSeed(seed, 0.05)) {
        return family;
    }

    const keys = Object.keys(family.indicators);
    if (keys.length === 0) {
        return family;
    }

    const randomKey = pickDeterministic(keys, seed, 1);
    const indicators = {
        ...family.indicators,
        [randomKey]: chanceFromSeed(seed, 0.6, 2)
    };
    return { ...family, indicators, iksScore: calculateIKS(indicators) };
};

const applyStaffMoraleDecay = (hiredStaff, seedPrefix) => {
    return hiredStaff.map((staff, index) => ({
        ...staff,
        morale: Math.max(
            0,
            (staff.morale || 70) - seededBetween(`${seedPrefix}:${staff.id || index}`, 2, 7)
        )
    }));
};

const INITIAL_META_STATE = {
    activeQuests: [],
    activeStories: [],
    isWikiOpen: false,
    wikiMetric: null,
    saveVersion: CURRENT_SAVE_VERSION,
    runtimeTrap: null
};

const INITIAL_FINANCE_STATS = {
    kapitasi: 50000000,
    pendapatanUmum: 0,
    pengeluaranObat: 0,
    pengeluaranLab: 0,
    pengeluaranOperasional: 0
};

const createInitialPharmacyInventory = () => MEDICATION_DATABASE.map((med) => ({
    medicationId: med.id,
    stock: Math.floor(med.minStock * 1.5),
    lastRestockDay: 0
}));

const INITIAL_KPI = {
    totalPatients: 0,
    correctDiagnoses: 0,
    correctTreatments: 0,
    referrals: 0,
    nonSpecialisticReferrals: 0,
    inappropriateReferrals: 0,
    treatedCases: 0,
    inappropriateTreat: 0,
    antibioticPrescriptions: 0,
    rationalAntibiotics: 0,
    patientSatisfaction: [],
    avgWaitTime: 0,
    bpjsPatients: 0,
    umumPatients: 0,
    inappropriateTests: 0,
    delegatedCases: 0
};

const INITIAL_FACILITIES = {
    poli_umum: 1,
    poli_gigi: 0,
    poli_kia_kb: 1,
    lab: 0,
    apotek: 1,
    igd: 1,
    rawat_inap: 0,
    gudang: 1
};

const createInitialFinanceState = () => ({
    stats: { ...INITIAL_FINANCE_STATS },
    kpi: { ...INITIAL_KPI },
    facilities: { ...INITIAL_FACILITIES },
    pharmacyInventory: createInitialPharmacyInventory(),
    pendingOrders: []
});

const createInitialPublicHealthState = () => ({
    villageData: null,
    prolanisRoster: [],
    prolanisState: { lastSenamMonth: -1, lastSenamDay: -1 },
    activeOutbreaks: [],
    outbreakNotification: null,
    activeIKMEvents: [],
    completedIKMIds: [],
    ikmCooldowns: {},
    ikmCaseBoosts: [],
    buildingProgress: {}
});

const createInitialStaffState = () => ({
    hiredStaff: []
});

const INITIAL_CLINICAL_STATE = {
    queue: [],
    emergencyQueue: [],
    activePatientId: null,
    activeEmergencyId: null,
    history: [],
    dailyArchive: [],
    monthlyArchive: [],
    accreditation: 'Dasar',
    activeReferral: null,
    activeReferralLog: [],
    busyAmbulanceIds: [],
    hospitalBedUsage: {},  // S4: tracks beds used per hospital {hospitalId: count}
    prbQueue: [],
    rrns: [], // Missing state that caused DashboardPage crash
    warningLevel: 0,
    gameOver: null,
    // --- Phase 0: Foundation Engines ---
    consequenceQueue: [],       // Delayed patient outcomes from ConsequenceEngine
    todayLog: [],               // Case outcomes logged during the day for DebriefEngine
    reflections: [],            // Player reflection texts (historical)
    showMorningBriefing: false, // Modal display flag
    showEndOfDayDebrief: false, // Modal display flag
    dailyQuestId: null,         // Selected daily priority quest
    staffAllocation: {},        // Poli → staff assignments from morning briefing
    morningReputation: null,    // Reputation snapshot at start of day (for delta)
    // --- Phase 1-3: Service Engine State ---
    pharmacyQueue: [],          // Pending prescriptions for DispensingEngine
    labQueue: [],               // Pending lab orders for LabEngine
    labMasteryHistory: [],      // Lab interpretation mastery tracking
    kiaPatients: {},            // Persistent ANC patients { [id]: ancPatient }
    dentalLog: [],              // Completed dental procedure records
};

const createInitialClinicalState = () => ({
    ...INITIAL_CLINICAL_STATE,
    queue: [],
    emergencyQueue: [],
    history: [],
    dailyArchive: [],
    monthlyArchive: [],
    activeReferralLog: [],
    busyAmbulanceIds: [],
    hospitalBedUsage: {},
    prbQueue: [],
    rrns: [],
    consequenceQueue: [],
    todayLog: [],
    reflections: [],
    staffAllocation: {},
    pharmacyQueue: [],
    labQueue: [],
    labMasteryHistory: [],
    kiaPatients: {},
    dentalLog: []
});

const MAX_CLINICAL_HISTORY = 200;

const INITIAL_NAV_SETTINGS = {
    theme: 'medika',
    fontSize: 'normal',
    volume: 1.0,
    autoSave: true
};

const createInitialNavState = (overrides = {}) => ({
    gameState: 'opening',
    activePage: 'dashboard',
    viewParams: {},
    sidebarCollapsed: false,
    currentSlotId: null,
    showKPIGlobal: false,
    isWikiOpen: false,
    wikiMetric: null,
    settings: {
        ...INITIAL_NAV_SETTINGS,
        ...(overrides.settings || {})
    },
    ...overrides
});

const normalizeSkillList = (skills) => {
    if (Array.isArray(skills)) {
        return [...new Set(skills.filter((skillId) => typeof skillId === 'string' && skillId.length > 0))];
    }

    if (skills && typeof skills === 'object') {
        return Object.entries(skills)
            .filter(([, unlocked]) => Boolean(unlocked))
            .map(([skillId]) => skillId);
    }

    return [];
};

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const asFiniteNumber = (value, fallback) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

const clampInteger = (value, fallback, min, max) => {
    const safeValue = Math.trunc(asFiniteNumber(value, fallback));
    return Math.min(max, Math.max(min, safeValue));
};

const normalizePersistedWorld = (world) => {
    const nextWorld = isPlainObject(world) ? { ...world } : {};
    nextWorld.day = clampInteger(nextWorld.day, INITIAL_TIME_STATE.day, 1, 999999);
    nextWorld.time = clampInteger(nextWorld.time, INITIAL_TIME_STATE.time, 0, 1439);
    nextWorld.speed = Math.max(0, asFiniteNumber(nextWorld.speed, INITIAL_TIME_STATE.speed));
    nextWorld.isPaused = typeof nextWorld.isPaused === 'boolean' ? nextWorld.isPaused : INITIAL_TIME_STATE.isPaused;
    return nextWorld;
};

const clampNumber = (value, min, max, fallback) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, numeric));
};

const clampEnergyToProfile = (profile, energy) => Math.max(
    0,
    Math.min(profile?.maxEnergy || INITIAL_PLAYER_STATE.maxEnergy, Number(energy) || 0)
);

const getProfileLevel = (profile = {}) => Math.max(1, Number(profile.level) || INITIAL_PLAYER_STATE.level);

const getCurrentLevelXp = (profile = {}) => {
    const level = getProfileLevel(profile);
    const nextLevelXp = getNextLevelXp(level);
    const storedXp = Math.max(0, Number(profile.xp) || 0);
    const xpAtLevelStart = (level - 1) * nextLevelXp;

    if (level > 1 && storedXp >= xpAtLevelStart) {
        return Math.max(0, Math.min(nextLevelXp, storedXp - xpAtLevelStart));
    }

    return Math.max(0, Math.min(nextLevelXp, storedXp));
};

const sanitizePlayerProfile = (profile = {}) => {
    const level = getProfileLevel(profile);
    const maxEnergy = clampNumber(
        profile.maxEnergy,
        1,
        150,
        INITIAL_PLAYER_STATE.maxEnergy
    );

    return {
        ...INITIAL_PLAYER_STATE,
        ...profile,
        level,
        xp: getCurrentLevelXp({ ...profile, level }),
        knowledge: Math.max(0, Number(profile.knowledge) || 0),
        maxEnergy,
        energy: clampEnergyToProfile({ maxEnergy }, profile.energy ?? maxEnergy),
        reputation: clampNumber(
            profile.reputation,
            0,
            100,
            INITIAL_PLAYER_STATE.reputation
        ),
        stress: clampNumber(
            profile.stress,
            0,
            100,
            INITIAL_PLAYER_STATE.stress
        ),
        spirit: clampNumber(
            profile.spirit,
            0,
            100,
            INITIAL_PLAYER_STATE.spirit
        ),
        skills: normalizeSkillList(profile.skills)
    };
};

const applyXpGainToProfile = (profile, amount = 0) => {
    const safeProfile = sanitizePlayerProfile(profile);
    const xpGain = Math.max(0, Number(amount) || 0);

    if (xpGain === 0) {
        return safeProfile;
    }

    const result = checkLevelUp({
        ...safeProfile,
        xp: safeProfile.xp + xpGain
    });

    return sanitizePlayerProfile({
        ...safeProfile,
        ...result.stats
    });
};

const spendXpFromProfile = (profile, cost = 0) => {
    const safeProfile = sanitizePlayerProfile(profile);
    const xpCost = Math.max(0, Number(cost) || 0);

    if (safeProfile.xp < xpCost) {
        return { success: false, profile: safeProfile };
    }

    return {
        success: true,
        profile: sanitizePlayerProfile({
            ...safeProfile,
            xp: safeProfile.xp - xpCost
        })
    };
};

const advanceElapsedTime = (get, minutes = 1) => {
    const increment = Math.max(0, Number(minutes) || 0);

    if (increment === 0) {
        return { success: true, dayChanged: false };
    }

    const state = get();
    const nextTime = state.world.time + increment;

    if (nextTime < 1440) {
        state.worldActions.setTime(nextTime);
        return { success: true, dayChanged: false };
    }

    const didAdvanceDay = state.actions.nextDay(state.world.day);
    return { success: didAdvanceDay !== false, dayChanged: didAdvanceDay !== false };
};

const createStartingPlayerProfile = (profile = {}) => {
    const initialStats = profile.initialStats || {};
    const maxEnergy = clampNumber(
        profile.maxEnergy ?? initialStats.maxEnergy,
        1,
        150,
        INITIAL_PLAYER_STATE.maxEnergy
    );
    const reputation = clampNumber(
        profile.reputation ?? initialStats.baseReputation,
        0,
        100,
        INITIAL_PLAYER_STATE.reputation
    );

    return sanitizePlayerProfile({
        ...profile,
        maxEnergy,
        energy: maxEnergy,
        reputation,
        spirit: INITIAL_PLAYER_STATE.spirit
    });
};

const mergePersistedFinance = (finance, currentFinance) => {
    if (!isPlainObject(finance)) {
        return currentFinance;
    }

    return {
        ...currentFinance,
        ...finance,
        stats: isPlainObject(finance.stats)
            ? { ...currentFinance.stats, ...finance.stats }
            : currentFinance.stats,
        kpi: isPlainObject(finance.kpi)
            ? { ...currentFinance.kpi, ...finance.kpi }
            : currentFinance.kpi,
        facilities: isPlainObject(finance.facilities)
            ? { ...currentFinance.facilities, ...finance.facilities }
            : currentFinance.facilities,
        pharmacyInventory: Array.isArray(finance.pharmacyInventory)
            ? finance.pharmacyInventory
            : currentFinance.pharmacyInventory,
        pendingOrders: Array.isArray(finance.pendingOrders)
            ? finance.pendingOrders
            : currentFinance.pendingOrders
    };
};

const mergePersistedPublicHealth = (publicHealth, currentPublicHealth) => {
    if (!isPlainObject(publicHealth)) {
        return currentPublicHealth;
    }

    return {
        ...currentPublicHealth,
        ...publicHealth,
        villageData: hasOwn(publicHealth, 'villageData')
            ? publicHealth.villageData
            : currentPublicHealth.villageData,
        prolanisRoster: Array.isArray(publicHealth.prolanisRoster)
            ? publicHealth.prolanisRoster
            : currentPublicHealth.prolanisRoster,
        prolanisState: isPlainObject(publicHealth.prolanisState)
            ? { ...currentPublicHealth.prolanisState, ...publicHealth.prolanisState }
            : currentPublicHealth.prolanisState,
        activeOutbreaks: Array.isArray(publicHealth.activeOutbreaks)
            ? publicHealth.activeOutbreaks
            : currentPublicHealth.activeOutbreaks,
        outbreakNotification: hasOwn(publicHealth, 'outbreakNotification')
            ? publicHealth.outbreakNotification
            : currentPublicHealth.outbreakNotification,
        activeIKMEvents: Array.isArray(publicHealth.activeIKMEvents)
            ? publicHealth.activeIKMEvents
            : currentPublicHealth.activeIKMEvents,
        completedIKMIds: Array.isArray(publicHealth.completedIKMIds)
            ? publicHealth.completedIKMIds
            : currentPublicHealth.completedIKMIds,
        ikmCooldowns: isPlainObject(publicHealth.ikmCooldowns)
            ? { ...currentPublicHealth.ikmCooldowns, ...publicHealth.ikmCooldowns }
            : currentPublicHealth.ikmCooldowns,
        ikmCaseBoosts: Array.isArray(publicHealth.ikmCaseBoosts)
            ? publicHealth.ikmCaseBoosts
            : currentPublicHealth.ikmCaseBoosts,
        buildingProgress: isPlainObject(publicHealth.buildingProgress)
            ? { ...currentPublicHealth.buildingProgress, ...publicHealth.buildingProgress }
            : currentPublicHealth.buildingProgress
    };
};

const mergePersistedStaff = (staff, currentStaff) => {
    if (!isPlainObject(staff)) {
        return currentStaff;
    }

    return {
        ...currentStaff,
        ...staff,
        hiredStaff: Array.isArray(staff.hiredStaff)
            ? staff.hiredStaff
            : currentStaff.hiredStaff
    };
};

const mergePersistedClinical = (clinical, currentClinical) => {
    if (!isPlainObject(clinical)) {
        return currentClinical;
    }

    return {
        ...currentClinical,
        ...clinical,
        queue: [],
        emergencyQueue: [],
        activePatientId: null,
        activeEmergencyId: null,
        history: capClinicalHistory(Array.isArray(clinical.history) ? clinical.history : currentClinical.history),
        dailyArchive: Array.isArray(clinical.dailyArchive) ? clinical.dailyArchive : currentClinical.dailyArchive,
        monthlyArchive: Array.isArray(clinical.monthlyArchive) ? clinical.monthlyArchive : currentClinical.monthlyArchive,
        activeReferralLog: Array.isArray(clinical.activeReferralLog) ? clinical.activeReferralLog : currentClinical.activeReferralLog,
        busyAmbulanceIds: Array.isArray(clinical.busyAmbulanceIds) ? clinical.busyAmbulanceIds : currentClinical.busyAmbulanceIds,
        hospitalBedUsage: isPlainObject(clinical.hospitalBedUsage)
            ? { ...currentClinical.hospitalBedUsage, ...clinical.hospitalBedUsage }
            : currentClinical.hospitalBedUsage,
        prbQueue: Array.isArray(clinical.prbQueue) ? clinical.prbQueue : currentClinical.prbQueue,
        rrns: Array.isArray(clinical.rrns) ? clinical.rrns : currentClinical.rrns,
        consequenceQueue: Array.isArray(clinical.consequenceQueue) ? clinical.consequenceQueue : currentClinical.consequenceQueue,
        todayLog: Array.isArray(clinical.todayLog) ? clinical.todayLog : currentClinical.todayLog,
        reflections: Array.isArray(clinical.reflections) ? clinical.reflections : currentClinical.reflections,
        staffAllocation: isPlainObject(clinical.staffAllocation)
            ? { ...currentClinical.staffAllocation, ...clinical.staffAllocation }
            : currentClinical.staffAllocation,
        pharmacyQueue: Array.isArray(clinical.pharmacyQueue) ? clinical.pharmacyQueue : currentClinical.pharmacyQueue,
        labQueue: Array.isArray(clinical.labQueue) ? clinical.labQueue : currentClinical.labQueue,
        labMasteryHistory: Array.isArray(clinical.labMasteryHistory) ? clinical.labMasteryHistory : currentClinical.labMasteryHistory,
        kiaPatients: isPlainObject(clinical.kiaPatients)
            ? { ...currentClinical.kiaPatients, ...clinical.kiaPatients }
            : currentClinical.kiaPatients,
        dentalLog: Array.isArray(clinical.dentalLog) ? clinical.dentalLog : currentClinical.dentalLog
    };
};

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

function capClinicalHistory(history) {
    if (!Array.isArray(history) || history.length <= MAX_CLINICAL_HISTORY) {
        return Array.isArray(history) ? history : [];
    }

    return history.slice(-MAX_CLINICAL_HISTORY);
}

function appendClinicalHistory(history, entry) {
    return capClinicalHistory([...(Array.isArray(history) ? history : []), entry]);
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
                // --- SLICE: NAV & SETTINGS ---
                nav: createInitialNavState(),
                navActions: {
                    setGameState: (state) => set((s) => ({ nav: { ...s.nav, gameState: state } })),
                    setActivePage: (page) => set((s) => ({ nav: { ...s.nav, activePage: page } })),
                    navigate: (page, params = {}) => set((s) => ({ nav: { ...s.nav, activePage: page, viewParams: params } })),
                    toggleSidebar: () => set((s) => ({ nav: { ...s.nav, sidebarCollapsed: !s.nav.sidebarCollapsed } })),
                    setSlotId: (id) => set((s) => ({ nav: { ...s.nav, currentSlotId: id } })),
                    toggleKPI: () => set((s) => ({ nav: { ...s.nav, showKPIGlobal: !s.nav.showKPIGlobal } })),
                    // openWiki: (key) => set((s) => ({ nav: { ...s.nav, isWikiOpen: true, wikiMetric: key } })), // Moved to metaActions
                    // closeWiki: () => set((s) => ({ nav: { ...s.nav, isWikiOpen: false } })), // Moved to metaActions
                    setShowKPIGlobal: (value) => set((s) => ({ nav: { ...s.nav, showKPIGlobal: value } })),
                    resetNavigation: (overrides = {}) => set((s) => ({
                        nav: createInitialNavState({
                            sidebarCollapsed: s.nav.sidebarCollapsed,
                            settings: s.nav.settings,
                            ...overrides
                        })
                    })),
                    updateSettings: (newSettings) => set((s) => {
                        const updated = { ...s.nav.settings, ...newSettings };
                        // Theme CSS classes are now managed by ThemeContext
                        if (newSettings.volume !== undefined) {
                            soundManager.setVolume(updated.volume);
                        }
                        return { nav: { ...s.nav, settings: updated } };
                    }),
                },

                // --- SLICE: WORLD (Time & Environment) ---
                world: {
                    ...INITIAL_TIME_STATE,
                },
                worldActions: {
                    tick: (minutes = 1) => set((s) => {
                        let newTime = s.world.time + minutes;
                        let newDay = s.world.day;
                        if (newTime >= 1440) { // 24 hours
                            newTime = 0;
                            newDay += 1;
                        }
                        return { world: { ...s.world, time: newTime, day: newDay } };
                    }),
                    setTime: (val) => set((s) => {
                        let next = typeof val === 'function' ? val(s.world.time) : val;
                        next = Number(next) || 0;
                        // B4 Fix: clamp time with day rollover
                        let newDay = s.world.day;
                        if (next >= 1440) { next = next % 1440; newDay += 1; }
                        if (next < 0) { next = 0; }
                        return { world: { ...s.world, time: next, day: newDay } };
                    }),
                    setDay: (val) => set((s) => {
                        const next = typeof val === 'function' ? val(s.world.day) : val;
                        return { world: { ...s.world, day: Number(next) || 1 } };
                    }),
                    setGameSpeed: (speed) => set((s) => ({ world: { ...s.world, speed: Number(speed) || 0, isPaused: speed === 0 } })),
                    advanceTime: (minutes = 1) => advanceElapsedTime(get, minutes),
                    resetTime: () => set((s) => ({ world: { ...s.world, ...INITIAL_TIME_STATE } })),
                },

                // --- SLICE: PLAYER ---
                player: {
                    profile: INITIAL_PLAYER_STATE,
                },
                playerActions: {
                    setPlayerStats: (stats) => set((s) => {
                        const nextStats = typeof stats === 'function' ? stats(s.player.profile) : stats;
                        return {
                            player: {
                                ...s.player,
                                profile: sanitizePlayerProfile({ ...s.player.profile, ...nextStats })
                            }
                        };
                    }),
                    updateProfile: (updates) => set((state) => ({
                        player: {
                            ...state.player,
                            profile: sanitizePlayerProfile({ ...state.player.profile, ...updates })
                        }
                    })),
                    gainXp: (amount) => set((state) => {
                        return {
                            player: {
                                ...state.player,
                                profile: applyXpGainToProfile(state.player.profile, amount)
                            }
                        };
                    }),
                    sleepWithAlarm: (targetHour) => {
                        const state = get();
                        const wakeHour = clampInteger(targetHour, 5, 0, 23);
                        const outcome = calculateSleepRecoveryOutcome(
                            state.world.time,
                            wakeHour,
                            state.player.profile.energy,
                            state.player.profile.stress
                        );

                        if (outcome.isNextDay) {
                            const didAdvanceDay = state.actions.nextDay(state.world.day);
                            if (didAdvanceDay === false) {
                                return {
                                    success: false,
                                    status: outcome.status,
                                    wakeTime: outcome.wakeTime,
                                    time: outcome.wakeTime,
                                    isNextDay: true
                                };
                            }
                        }

                        set(s => ({
                            player: {
                                ...s.player,
                                profile: sanitizePlayerProfile({
                                    ...s.player.profile,
                                    energy: Math.min(s.player.profile.maxEnergy, outcome.energy),
                                    stress: outcome.stress,
                                    morningStatus: outcome.status
                                })
                            }
                        }));

                        get().worldActions.setTime(outcome.wakeTime);

                        return {
                            success: true,
                            status: outcome.status,
                            wakeTime: outcome.wakeTime,
                            time: outcome.wakeTime,
                            isNextDay: outcome.isNextDay
                        };
                    },
                    calculateSleepRecovery: (targetHour, currentTime) => {
                        const sleepHour = Math.floor(currentTime / 60);
                        const wakeHour = targetHour;
                        let sleepDuration = (wakeHour > sleepHour) ? (wakeHour - sleepHour) : ((24 - sleepHour) + wakeHour);
                        const isNextDay = wakeHour <= sleepHour;
                        const isGroggy = sleepDuration < 6 || wakeHour < 5;
                        const status = isGroggy ? 'groggy' : 'refreshed';
                        set(s => ({
                            player: {
                                ...s.player,
                                profile: sanitizePlayerProfile({
                                    ...s.player.profile,
                                    energy: isGroggy ? Math.min(s.player.profile.maxEnergy, 70) : s.player.profile.maxEnergy,
                                    stress: Math.max(0, s.player.profile.stress - (isGroggy ? 10 : 30)),
                                    morningStatus: status
                                })
                            }
                        }));
                        return { success: true, status, wakeTime: wakeHour * 60, isNextDay };
                    },
                    takeLoungeRest: () => {
                        const s = get();
                        const { day } = s.world;
                        const profile = s.player.profile;
                        const currentCount = profile.lastLoungeDay === day ? profile.loungeRestCount : 0;

                        if (currentCount >= 3) return { success: false, message: 'Sudah mencapai batas istirahat hari ini.' };

                        set(state => ({
                            player: {
                                ...state.player,
                                profile: sanitizePlayerProfile({
                                    ...state.player.profile,
                                    energy: Math.min(state.player.profile.maxEnergy, state.player.profile.energy + 15),
                                    stress: Math.max(0, state.player.profile.stress - 10),
                                    loungeRestCount: currentCount + 1,
                                    lastLoungeDay: day
                                })
                            }
                        }));

                        // Advance time by 15 mins
                        get().worldActions.advanceTime(15);
                        soundManager.playSuccess();
                        return { success: true };
                    },
                    clearMorningStatus: () => set(s => ({ player: { ...s.player, profile: { ...s.player.profile, morningStatus: null } } })),
                    setReputation: (rep) => set(s => ({ player: { ...s.player, profile: { ...s.player.profile, reputation: typeof rep === 'function' ? rep(s.player.profile.reputation) : rep } } })),
                    unlockSkill: (skillId, xpCost = 0) => {
                        const state = get();
                        const currentSkills = normalizeSkillList(state.player.profile.skills);

                        if (!skillId || currentSkills.includes(skillId)) {
                            return false;
                        }

                        const spent = spendXpFromProfile(state.player.profile, xpCost);
                        if (!spent.success) {
                            soundManager.playError();
                            return false;
                        }

                        set(s => ({
                            player: {
                                ...s.player,
                                profile: sanitizePlayerProfile({
                                    ...spent.profile,
                                    skills: [...currentSkills, skillId]
                                })
                            }
                        }));
                        soundManager.playSuccess();
                        return true;
                    },
                    resetPlayer: () => set(s => ({ player: { ...s.player, profile: sanitizePlayerProfile(INITIAL_PLAYER_STATE) } })),
                },

                // --- SLICE: FINANCE ---
                finance: createInitialFinanceState(),
                financeActions: {
                    setStats: (val) => set(s => ({ finance: { ...s.finance, stats: typeof val === 'function' ? val(s.finance.stats) : val } })),
                    setKpi: (val) => set(s => ({ finance: { ...s.finance, kpi: typeof val === 'function' ? val(s.finance.kpi) : val } })),
                    setFacilities: (val) => set(s => ({ finance: { ...s.finance, facilities: typeof val === 'function' ? val(s.finance.facilities) : val } })),
                    setPharmacyInventory: (val) => set(s => ({ finance: { ...s.finance, pharmacyInventory: typeof val === 'function' ? val(s.finance.pharmacyInventory) : val } })),
                    setPendingOrders: (val) => set(s => ({ finance: { ...s.finance, pendingOrders: typeof val === 'function' ? val(s.finance.pendingOrders) : val } })),
                    upgradeFacility: (facilityId, cost) => {
                        const state = get();
                        if (state.finance.stats.pendapatanUmum >= cost && state.finance.facilities[facilityId] !== undefined) {
                            set(s => ({
                                finance: {
                                    ...s.finance,
                                    stats: { ...s.finance.stats, pendapatanUmum: s.finance.stats.pendapatanUmum - cost },
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
                        const currentItem = state.finance.pharmacyInventory.find(item => item.medicationId === medicationId);
                        const medication = getMedicationById(medicationId);
                        if (!medication) return { success: false, error: 'Medication not found' };
                        if (!currentItem || currentItem.stock < quantity) return { success: false, error: `Insufficient stock` };
                        set(s => ({
                            finance: {
                                ...s.finance,
                                pharmacyInventory: s.finance.pharmacyInventory.map(item =>
                                    item.medicationId === medicationId ? { ...item, stock: item.stock - quantity } : item
                                )
                            }
                        }));
                        const medicineCostReduction = buffs.medicineCostReduction || 0;
                        const totalCost = (medication.unitPrice * quantity) * (1 - medicineCostReduction);
                        set(s => ({
                            finance: {
                                ...s.finance,
                                stats: { ...s.finance.stats, pengeluaranObat: (s.finance.stats.pengeluaranObat || 0) + totalCost }
                            }
                        }));
                        return { success: true, remainingStock: currentItem.stock - quantity };
                    },
                    checkInventoryAvailability: (medicationId, quantity) => {
                        const state = get();
                        const currentItem = state.finance.pharmacyInventory.find(item => item.medicationId === medicationId);
                        const medication = getMedicationById(medicationId);
                        if (!currentItem || !medication) return { available: false, stock: 0 };
                        return {
                            available: currentItem.stock >= quantity,
                            stock: currentItem.stock,
                            isLowStock: currentItem.stock < medication.minStock,
                            percentageOfMin: (currentItem.stock / medication.minStock) * 100
                        };
                    },
                    submitOrder: (orderItems, supplierId, day) => {
                        const state = get();
                        const supplier = getSupplierById(supplierId);
                        if (!supplier) return { success: false, error: 'Supplier not found' };
                        const items = orderItems.map(item => ({ ...item, unitPrice: getMedicationById(item.medicationId).unitPrice }));
                        const costCalculation = calculateOrderCost(supplierId, items);
                        if (costCalculation.error) return { success: false, error: costCalculation.error };
                        if (state.finance.stats.kapitasi < costCalculation.total) return { success: false, error: 'Insufficient kapitasi' };
                        if (supplier.paymentTerms === 'cash_upfront') {
                            set(s => ({
                                finance: {
                                    ...s.finance,
                                    stats: {
                                        ...s.finance.stats,
                                        kapitasi: s.finance.stats.kapitasi - costCalculation.total,
                                        pengeluaranObat: (s.finance.stats.pengeluaranObat || 0) + costCalculation.total
                                    }
                                }
                            }));
                        }
                        const newOrder = {
                            id: `ORDER_${Date.now()}`,
                            supplierId,
                            items: orderItems,
                            orderDay: day,
                            deliveryDay: estimateDeliveryDate(supplierId, day),
                            status: 'pending',
                            cost: costCalculation.total,
                            paymentTerms: supplier.paymentTerms
                        };
                        set(s => ({ finance: { ...s.finance, pendingOrders: [...s.finance.pendingOrders, newOrder] } }));
                        soundManager.playConfirm();
                        return { success: true, order: newOrder, message: `Order submitted` };
                    },
                    receiveOrder: (orderId, day) => {
                        const state = get();
                        const order = state.finance.pendingOrders.find(o => o.id === orderId);
                        if (!order) return { success: false, error: 'Order not found' };
                        set(s => ({
                            finance: {
                                ...s.finance,
                                pharmacyInventory: s.finance.pharmacyInventory.map(item => {
                                    const orderItem = order.items.find(oi => oi.medicationId === item.medicationId);
                                    return orderItem ? { ...item, stock: item.stock + orderItem.quantity, lastRestockDay: day } : item;
                                }),
                                pendingOrders: s.finance.pendingOrders.map(o => o.id === orderId ? { ...o, status: 'received', receivedDay: day } : o)
                            }
                        }));
                        soundManager.playSuccess();
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
                            const accreditationMultiplier = { 'Dasar': 1.0, 'Madya': 1.1, 'Utama': 1.25, 'Paripurna': 1.5 }[accreditation] || 1.0;
                            const monthlyKapitasi = 50000000 * accreditationMultiplier;
                            const totalSalaries = hiredStaff.reduce((total, s) => total + (s.salary || 0), 0);
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
                    setVillageData: (val) => set(s => ({ publicHealth: { ...s.publicHealth, villageData: typeof val === 'function' ? val(s.publicHealth.villageData) : val } })),
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
                                enrolledDay: day, lastVisitDay: day,
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
                                const outcome = determineMonthlyOutcome(
                                    { ...member },
                                    doctorDecisions,
                                    seedKey('prolanis-visit', member.id, effectiveDay)
                                );
                                xpEarned = outcome.xpEarned || 0;
                                return {
                                    ...member,
                                    prolanisData: {
                                        ...member.prolanisData, lastVisitDay: effectiveDay, parameters: outcome.newParameters,
                                        consecutiveControlled: outcome.consecutiveControlled,
                                        history: [...member.prolanisData.history, { day: effectiveDay, parameters: outcome.newParameters, wasControlled: outcome.wasControlled, doctorDecisions }],
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
                        if (state.finance.stats.pendapatanUmum < 150000) {
                            soundManager.playError();
                            return { success: false, message: 'Pendapatan umum tidak cukup untuk operasional kegiatan.' };
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
                                    ...currentState.finance.stats,
                                    pendapatanUmum: currentState.finance.stats.pendapatanUmum - 150000
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
                                queue: [...currentState.clinical.queue, visitPatient]
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
                                        if (!outbreak.affectedHouseIds.includes(fam.houseId)) return fam;
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
                        const { updatedOutbreaks } = checkOutbreakExpiry(activeOutbreaks, day);
                        const newOutbreak = checkForOutbreakTrigger(history, villageData, day, updatedOutbreaks);
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
                            activeBCCases: history.map(h => h.medicalData?.trueDiagnosisCode).filter(Boolean)
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
                                villageData: nextVillage,
                                activeIKMEvents: nextIkmEvents
                            }
                        }));
                    },
                    resetPublicHealth: () => set(() => ({
                        publicHealth: { villageData: null, prolanisRoster: [], prolanisState: { lastSenamMonth: -1, lastSenamDay: -1 }, activeOutbreaks: [], outbreakNotification: null, activeIKMEvents: [], completedIKMIds: [], ikmCooldowns: {}, ikmCaseBoosts: [], buildingProgress: {} }
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
                                s.world?.currentTime || 480,
                                seedKey('ikm-spawn', resolved.scenarioId, s.world.day, impact.spawnPatients.diseaseId)
                            );
                        }

                        set(state => {
                            const ph = state.publicHealth;
                            const player = state.player;
                            const currentQueue = state.clinical.queue || [];

                            // Prevent overflowing the queue if there are too many patients
                            const spaceLeft = 30 - currentQueue.length;
                            const patientsToAdd = newPatients.slice(0, spaceLeft > 0 ? spaceLeft : 0);

                            return {
                                publicHealth: {
                                    ...ph,
                                    activeIKMEvents: ph.activeIKMEvents.filter(e => e.instanceId !== eventInstanceId),
                                    completedIKMIds: [...ph.completedIKMIds, resolved.scenarioId],
                                    ikmCooldowns: { ...ph.ikmCooldowns, [resolved.category]: s.world.day },
                                    ikmCaseBoosts: [...ph.ikmCaseBoosts, ...caseBoosts]
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
                                    queue: [...currentQueue, ...patientsToAdd]
                                }
                            };
                        });

                        return { resolved, impact, caseBoosts, newPatients };
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
                        if (s.publicHealth.activeIKMEvents.some(e => e.scenarioId === scenarioId)) return false;
                        if (s.publicHealth.completedIKMIds.includes(scenarioId)) return false;

                        const scenario = getScenarioById(scenarioId);
                        if (!scenario) return false;

                        const event = createEventInstance(scenario, s.world.day);
                        soundManager.playNotification();
                        set(state => ({
                            publicHealth: {
                                ...state.publicHealth,
                                activeIKMEvents: [...state.publicHealth.activeIKMEvents, event]
                            }
                        }));
                        return true;
                    },

                    /** Generic phase advancer for the UI to move to the next phase (e.g. after Q&A) */
                    advanceIKMPhase: (eventInstanceId, nextPhaseId, impactDelta = {}, choiceLog = null) => {
                        set(state => {
                            const event = state.publicHealth.activeIKMEvents.find(e => e.instanceId === eventInstanceId);
                            if (!event) return state;

                            const updatedEvent = advanceEventPhase(event, nextPhaseId, impactDelta, choiceLog);
                            return {
                                publicHealth: {
                                    ...state.publicHealth,
                                    activeIKMEvents: state.publicHealth.activeIKMEvents.map(e =>
                                        e.instanceId === eventInstanceId ? updatedEvent : e
                                    )
                                }
                            };
                        });
                    }
                },

                // --- SLICE: STAFF ---
                staff: createInitialStaffState(),
                staffActions: {
                    setHiredStaff: (val) => set(s => ({ staff: { ...s.staff, hiredStaff: typeof val === 'function' ? val(s.staff.hiredStaff) : val } })),
                    coachStaff: (staffId, day) => {
                        const s = get();
                        const staff = s.staff.hiredStaff.find(st => st.id === staffId);
                        if (!staff) return { success: false, message: 'Staff not found' };
                        if (s.player.profile.energy < 10) { soundManager.playError(); return { success: false, message: 'Not enough energy' }; }
                        set(state => ({
                            staff: { ...state.staff, hiredStaff: state.staff.hiredStaff.map(st => st.id === staffId ? { ...st, morale: Math.min(100, (st.morale || 70) + 15), lastCoached: day } : st) },
                            player: { ...state.player, profile: { ...state.player.profile, energy: state.player.profile.energy - 10 } }
                        }));
                        soundManager.playSuccess();
                        return { success: true, message: `${staff.name} motivated!` };
                    },
                    assignTask: (staffId, taskId, day) => {
                        set(s => ({ staff: { ...s.staff, hiredStaff: s.staff.hiredStaff.map(st => st.id === staffId ? { ...st, currentTask: taskId, taskAssignedDay: day } : st) } }));
                        soundManager.playConfirm();
                        return { success: true, message: `Task assigned` };
                    },
                    processDailyDecay: () => {
                        const day = get().world.day;
                        set(s => ({
                            staff: {
                                ...s.staff,
                                hiredStaff: applyStaffMoraleDecay(s.staff.hiredStaff, `staff-daily:${day}`)
                            }
                        }));
                    },
                    resetStaff: () => set(s => ({ staff: { ...s.staff, hiredStaff: [] } }))
                },

                // --- SLICE: CLINICAL ---
                clinical: createInitialClinicalState(),
                clinicalActions: {
                    setQueue: (val) => set(s => ({ clinical: { ...s.clinical, queue: typeof val === 'function' ? val(s.clinical.queue) : val } })),
                    setEmergencyQueue: (val) => set(s => ({ clinical: { ...s.clinical, emergencyQueue: typeof val === 'function' ? val(s.clinical.emergencyQueue) : val } })),
                    setActivePatientId: (val) => set(s => ({ clinical: { ...s.clinical, activePatientId: typeof val === 'function' ? val(s.clinical.activePatientId) : val } })),
                    setActiveEmergencyId: (val) => set(s => ({ clinical: { ...s.clinical, activeEmergencyId: typeof val === 'function' ? val(s.clinical.activeEmergencyId) : val } })),
                    setHistory: (val) => set(s => ({ clinical: { ...s.clinical, history: typeof val === 'function' ? val(s.clinical.history) : val } })),
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
                    setPharmacyQueue: (val) => set(s => ({ clinical: { ...s.clinical, pharmacyQueue: typeof val === 'function' ? val(s.clinical.pharmacyQueue) : val } })),
                    pushPharmacyOrder: (order) => set(s => ({ clinical: { ...s.clinical, pharmacyQueue: [...s.clinical.pharmacyQueue, order] } })),
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
                            state.clinical.history = appendClinicalHistory(state.clinical.history, {
                                ...patient,
                                day,
                                dischargedAt: time,
                                decision: { action: 'delegate_to_maia' },
                                outcome: 'delegated',
                                satisfactionScore,
                                cpptRecord: buildMaiaCPPTRecord(patient, day, time, 'delegated')
                            });

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
                        });

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
                                    history: appendClinicalHistory(state.clinical.history, {
                                        ...patient,
                                        day,
                                        dischargedAt: time,
                                        decision: { action: 'delegate_to_maia' },
                                        outcome: 'delegated',
                                        outcomeStatus: 'delegated',
                                        satisfactionScore,
                                        isEmergency: true,
                                        cpptRecord: buildMaiaCPPTRecord(patient, day, time, 'delegated', true)
                                    })
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
                                    kpi: nextKpi
                                }
                            };
                        });

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
                        state.clinical.busyAmbulanceIds = state.clinical.busyAmbulanceIds.filter(item => time < item.busyUntil);

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
                                const followupPatient = generateFollowupPatient(
                                    consequence,
                                    time,
                                    seedKey('followup-spawn', consequence.id, day)
                                );
                                state.clinical.queue.push(followupPatient);
                            });
                            if (followups.length > 0) {
                                state.clinical.consequenceQueue = clearProcessedFollowups(
                                    state.clinical.consequenceQueue, day
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
                                state.clinical.queue.push(newPatient); // Immer push
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
                                state.clinical.emergencyQueue.push(newEmergency);
                                soundManager.playNotification();
                            }
                        }

                        // 6. Emergency Deterioration
                        state.clinical.emergencyQueue.forEach(p => {
                            if (p.status === 'igd_waiting' && p.deteriorationRate > 0) {
                                p.deterioration = Math.min(100, p.deterioration + p.deteriorationRate);
                            }
                        });
                    })),
                    dischargePatient: (patient, decision, day, time) => withTransaction(set, get, 'dischargePatient', (state) => {
                        day = day ?? state.world.day;
                        time = time ?? state.world.time;
                        if (!patient?.id) {
                            state.clinical.activePatientId = null;
                            return;
                        }
                        const buffs = calculateGlobalBuffs(state);
                        const isBPJS = patient.social?.hasBPJS;
                        const isCorrectTriage = patient.hidden?.requiredAction === decision.action;
                        const correctMedList = patient.medicalData?.correctTreatment || [];
                        const isCorrectMeds = ((required, selected) => {
                            if (!required || required.length === 0) return true;
                            if (!selected) return false;
                            for (const req of required) { if (Array.isArray(req)) { if (!req.some(r => selected.includes(r))) return false; } else { if (!selected.includes(req)) return false; } }
                            return true;
                        })(correctMedList, decision.medications || []);
                        const isCorrectAction = decision.action === 'treat' ? (isCorrectTriage && isCorrectMeds) : isCorrectTriage;
                        const hasAntibiotic = decision.medications?.some(m => ['amoxicillin', 'azithromycin', 'ciprofloxacin', 'metronidazole', 'doxycycline', 'cotrimoxazole', 'cefadroxil', 'cefixime', 'erythromycin', 'levofloxacin'].includes(m));

                        let fundChange = 0, repChange = 0, satisfactionScore = 70;
                        if (decision.action === 'treat') {
                            if (!isCorrectAction) {
                                if (!isCorrectTriage) { repChange = -10; satisfactionScore = 40; }
                                else if (!isCorrectMeds) { repChange = -2; satisfactionScore = 60; }
                            } else {
                                fundChange = isBPJS ? -15000 : 50000; repChange = +2; satisfactionScore = 85;
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
                            // S1 Fix: refer tanpa melalui SISRUTE penalti bypass prosedur rujukan
                            repChange = isCorrectTriage ? -3 : -5;
                            satisfactionScore = isCorrectTriage ? 55 : 45;
                            soundManager.playError();
                        }

                        satisfactionScore += (buffs.patientSatisfaction || 0);
                        const inventoryUpdates = new Map();
                        if (decision.medications) decision.medications.forEach(id => inventoryUpdates.set(id, (inventoryUpdates.get(id) || 0) + 1));
                        if (decision.procedures) {
                            decision.procedures.forEach(procId => {
                                const proc = PROCEDURES_DB.find(p => p.id === procId);
                                if (proc?.requiredItems) proc.requiredItems.forEach(itemId => inventoryUpdates.set(itemId, (inventoryUpdates.get(itemId) || 0) + 1));
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
                                    state.clinical.busyAmbulanceIds.push({ id: amb.id, busyUntil: time + (travelTime * 2) });
                                }
                                state.clinical.activeReferralLog.push({
                                    id: `ref_${Date.now()}`, patientId: patient.id, patientName: patient.name,
                                    familyId: patient.hidden?.familyId || null,
                                    diagnosisId: patient.medicalData?.trueDiagnosisCode || '',
                                    diagnosis: patient.medicalData?.trueDiagnosis || patient.medicalData?.diagnosis || '',
                                    hospitalName: hosp.name, distance: hosp.distance, ambulanceType: amb.type,
                                    timeSent: time, status: 'EN_ROUTE'
                                });
                            
                                // S4 Fix: decrement hospital bed availability
                                const bedKey = hosp.id;
                                if (!state.clinical.hospitalBedUsage) state.clinical.hospitalBedUsage = {};
                                state.clinical.hospitalBedUsage[bedKey] = (state.clinical.hospitalBedUsage[bedKey] || 0) + 1;
                            }
                        }

                        const cppt = buildCPPTRecord(patient, decision, day, time, { outcomeStatus: isCorrectAction ? 'pulih' : 'memburuk', satisfactionScore, isCorrectAction, isEmergency: false });
                        state.clinical.history = appendClinicalHistory(state.clinical.history, {
                            ...patient,
                            day,
                            dischargedAt: time,
                            decision,
                            outcome: repChange >= 0 ? 'good' : 'bad',
                            satisfactionScore,
                            cpptRecord: cppt
                        });

                        if (isCorrectAction && patient.familyId && state.publicHealth.villageData) {
                            state.publicHealth.villageData.families = state.publicHealth.villageData.families.map(fam => {
                                if (fam.id !== patient.familyId) return fam;
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
                        if (decision.action === 'refer') newKpi.referrals++;
                    }),
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

                        // Override rep/score if it's a completed SISRUTE referral
                        if (decision.action === 'refer' && decision.isSISRUTE) {
                            repChange = decision.repBonus || repChange;
                            satisfactionScore = decision.satisfaction || satisfactionScore;
                        }

                        if (isCorrectTriage || (decision.action === 'refer' && decision.isSISRUTE && decision.referralDetails?.result?.status === 'ACCEPTED')) {
                            soundManager.playSuccess();
                        } else {
                            soundManager.playError();
                        }

                        const billing = calculateEmergencyBill(decision.actions, patient.hidden?.caseData);
                        set(state => {
                            const newKpi = { ...state.finance.kpi }; if (isCorrectTriage) newKpi.correctTreatments++;
                            let fundChange = billing.total;
                            let newBusyAmbulanceIds = state.clinical.busyAmbulanceIds;
                            let newActiveReferralLog = state.clinical.activeReferralLog;
                            let newHospitalBedUsage = { ...(state.clinical.hospitalBedUsage || {}) };

                            // Handle SISRUTE referral completion: ambulance costs & referral log
                            if (decision.action === 'refer' && decision.isSISRUTE && decision.referralDetails?.result?.status === 'ACCEPTED') {
                                const { hospitalId, ambulanceId } = decision.referralDetails;
                                const hosp = HOSPITALS.find(h => h.id === hospitalId), amb = AMBULANCES.find(a => a.id === ambulanceId);
                                if (amb && amb.cost > 0) fundChange -= amb.cost;
                                if (hosp && amb) {
                                    const travelTime = hosp.distance * (1 / (amb.speedBoost || 1)) * 2;
                                    if (amb.isAmbulance !== false) {
                                        newBusyAmbulanceIds = [...newBusyAmbulanceIds, { id: amb.id, busyUntil: time + (travelTime * 2) }];
                                    }
                                    newActiveReferralLog = [...newActiveReferralLog, {
                                        id: `ref_${Date.now()}`, patientId: patient.id, patientName: patient.name,
                                        familyId: patient.hidden?.familyId || null,
                                        diagnosisId: patient.medicalData?.trueDiagnosisCode || '',
                                        diagnosis: patient.medicalData?.trueDiagnosis || patient.medicalData?.diagnosis || '',
                                        hospitalName: hosp.name, distance: hosp.distance, ambulanceType: amb.type,
                                        timeSent: time, status: 'EN_ROUTE'
                                    }];
                                    // S4 Fix: decrement hospital bed availability
                                    newHospitalBedUsage[hosp.id] = (newHospitalBedUsage[hosp.id] || 0) + 1;
                                }
                            }

                            return {
                                clinical: {
                                    ...state.clinical,
                                    busyAmbulanceIds: newBusyAmbulanceIds,
                                    activeReferralLog: newActiveReferralLog,
                                    emergencyQueue: state.clinical.emergencyQueue.filter(p => p.id !== patient.id),
                                    activeEmergencyId: null,
                                    history: appendClinicalHistory(state.clinical.history, {
                                        ...patient,
                                        day,
                                        dischargedAt: time,
                                        decision,
                                        outcome: repChange >= 0 ? 'good' : 'bad',
                                        outcomeStatus: 'stabilized',
                                        satisfactionScore,
                                        isEmergency: true,
                                        cpptRecord: buildMaiaCPPTRecord(patient, day, time, 'stabilized', true)
                                    })
                                },
                                player: {
                                    ...state.player,
                                    profile: applyXpGainToProfile({
                                        ...state.player.profile,
                                        reputation: Math.min(100, Math.max(0, state.player.profile.reputation + repChange))
                                    }, isCorrectTriage ? 30 : 10)
                                },
                                finance: { ...state.finance, stats: { ...state.finance.stats, pendapatanUmum: state.finance.stats.pendapatanUmum + fundChange }, kpi: newKpi }
                            };
                        });
                    },
                    orderLab: (patientId, labName, cost) => {
                        set(state => {
                            const nextQueue = state.clinical.queue.map(p => p.id === patientId ? { ...p, labsRevealed: [...(p.labsRevealed || []), labName] } : p);
                            const nextFinance = { ...state.finance, stats: { ...state.finance.stats, pengeluaranLab: (state.finance.stats.pengeluaranLab || 0) + cost } };
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
                    resetDailyState: () => set(s => ({ clinical: { ...s.clinical, queue: [], emergencyQueue: [], activePatientId: null, activeEmergencyId: null, activeReferral: null, busyAmbulanceIds: [], hospitalBedUsage: {} } })),
                },

                // --- SLICE: META (Quests, Stories, Wiki) ---
                meta: INITIAL_META_STATE,
                metaActions: {
                    setMeta: (meta) => set((s) => ({ meta: { ...s.meta, ...meta } })),

                    updateProgress: (metric, amount = 1) => {
                        const s = get();
                        const { updatedQuests, updatedStories } = updateGameProgress(s.meta.activeQuests, s.meta.activeStories, metric, amount);
                        set({ meta: { ...s.meta, activeQuests: updatedQuests, activeStories: updatedStories } });
                    },

                    claimQuest: (questId) => {
                        const s = get();
                        const { updatedQuests, xpReward } = claimQuestReward(s.meta.activeQuests, questId);
                        if (xpReward > 0) get().playerActions.gainXp(xpReward);
                        set({ meta: { ...s.meta, activeQuests: updatedQuests } });
                    },

                    advanceStory: (storyInstance, choice) => {
                        const s = get();
                        if (choice.impact) {
                            if (choice.impact.balance) s.financeActions.setStats(stats => ({ ...stats, pendapatanUmum: stats.pendapatanUmum + choice.impact.balance }));
                            if (choice.impact.energy) s.playerActions.updateProfile({ energy: clampEnergyToProfile(s.player.profile, s.player.profile.energy + choice.impact.energy) });
                            if (choice.impact.spirit) s.playerActions.updateProfile({ spirit: Math.max(0, Math.min(100, s.player.profile.spirit + choice.impact.spirit)) });
                            if (choice.impact.reputation) s.playerActions.updateProfile({ reputation: s.player.profile.reputation + choice.impact.reputation });
                            if (choice.impact.xp) s.playerActions.gainXp(choice.impact.xp);
                        }
                        const updated = advanceStoryNode(storyInstance, choice);
                        set({ meta: { ...s.meta, activeStories: s.meta.activeStories.map(st => st.instanceId === storyInstance.instanceId ? updated : st) } });
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

                    resetMeta: () => set({ meta: INITIAL_META_STATE })
                },

                // --- ORCHESTRATION ACTIONS ---
                actions: {
                    saveGame: (slotId = get().nav.currentSlotId) => {
                        if (slotId === null) return false;
                        try {
                            const state = get();
                            const saveData = createSaveSnapshot(state);
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
                                    s.world = { ...s.world, ...normalizedSave.world };
                                }
                                if (normalizedSave.finance) {
                                    s.finance = { ...s.finance, ...normalizedSave.finance };
                                }
                                if (normalizedSave.clinical) {
                                    s.clinical = { ...s.clinical, ...normalizedSave.clinical };
                                }
                                if (normalizedSave.publicHealth) {
                                    s.publicHealth = { ...s.publicHealth, ...normalizedSave.publicHealth };
                                }
                                if (normalizedSave.staff) {
                                    s.staff = { ...s.staff, ...normalizedSave.staff };
                                }

                                s.meta = { ...INITIAL_META_STATE, saveVersion: normalizedSave.saveVersion || CURRENT_SAVE_VERSION };
                                s.clinical.gameOver = null;
                                s.world.isPaused = false;
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
                            state.publicHealth.villageData = population;

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
                            // Note: We use state.publicHealth directly from draft
                            // Re-implement checkOutbreakExpiry logic inline or call helper if pure?
                            // checkOutbreakExpiry is pure.
                            const { updatedOutbreaks } = checkOutbreakExpiry(activeOutbreaks, targetDay); // Use targetDay (current day) or nextDay? Original passed `day` (current).
                            const newOutbreak = checkForOutbreakTrigger(state.clinical.history, villageData, targetDay, updatedOutbreaks);

                            state.publicHealth.activeOutbreaks = updatedOutbreaks;
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
                                activeBCCases: [] // BC cases not yet wired
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
                                casesToday: (state.clinical.todayLog || []).length
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
                            const completedBCCases = (state.clinical.history || [])
                                .filter(h => h.behaviorCase && (h.behaviorCase.outcome === 'failed' || h.behaviorCase.outcome === 'partial'))
                                .map(h => ({
                                    scenarioId: h.behaviorCase.scenarioId,
                                    outcome: h.behaviorCase.outcome,
                                    completedOnDay: h.behaviorCase.completedOnDay || h.day,
                                    scenario: h.behaviorCase.scenario
                                }));
                            const ukpEvents = processUKPBridge(completedBCCases, nextDayVal);
                            ukpEvents.forEach(evt => {
                                if (evt.reputationPenalty) {
                                    state.player.profile.reputation = Math.max(0, state.player.profile.reputation + evt.reputationPenalty);
                                }
                                // Push consequence narrative to clinical log
                                state.clinical.consequenceQueue.push({
                                    type: 'ukp_bridge',
                                    message: evt.message,
                                    diseaseId: evt.diseaseId,
                                    severity: evt.severity,
                                    spawnDay: evt.spawnDay || nextDayVal,
                                    followupDay: nextDayVal + 1
                                });
                            });

                            // 5. Advance Time
                            state.world.day = nextDayVal;
                            state.world.time = 480;

                            // 6. Monthly Report Trigger
                        }));

                        // Monthly Report (Post-update)
                        const nextDayVal = targetDay + 1;
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
                        meta: INITIAL_META_STATE,
                    })),
                }
            };

                return guardStoreActions(store, set, get);
            },
            {
                name: 'primer_gamestate_v4',
                merge: (persistedState, currentState) => {
                    const nextState = isPlainObject(persistedState) ? persistedState : {};

                    return {
                        ...currentState,
                        ...nextState,
                        world: nextState.world
                            ? { ...currentState.world, ...normalizePersistedWorld(nextState.world) }
                            : currentState.world,
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
                        clinical: nextState.clinical
                            ? mergePersistedClinical(nextState.clinical, currentState.clinical)
                            : currentState.clinical
                    };
                },
                partialize: (state) => ({
                    world: normalizePersistedWorld(state.world),
                    player: {
                        ...state.player,
                        profile: sanitizePlayerProfile(state.player.profile)
                    },
                    finance: mergePersistedFinance(state.finance, createInitialFinanceState()),
                    publicHealth: mergePersistedPublicHealth(state.publicHealth, createInitialPublicHealthState()),
                    staff: mergePersistedStaff(state.staff, createInitialStaffState()),
                    clinical: mergePersistedClinical(state.clinical, createInitialClinicalState())
                }),
            }
        )
    )
);
