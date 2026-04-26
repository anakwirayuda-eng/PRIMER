/**
 * Persistence/merge helpers for store save/load.
 * Pure functions only — NO store imports.
 */
import { INITIAL_TIME_STATE } from '../../game/GameCore.js';
import { CURRENT_SAVE_VERSION, parseSavePayload } from '../../utils/savePayload.js';
import { normalizePatientList } from '../../models/PatientRuntime.js';
import { normalizeEncounterList } from '../../models/EncounterRuntime.js';
import { normalizeInventoryList, normalizeMedicationId } from '../../models/InventoryRuntime.js';
import { normalizeDailyArchive, normalizeMonthlyArchive } from '../../utils/archiveNormalization.js';
import { ensureVillageReadinessState } from '../../utils/behaviorCaseRuntime.js';
import { reconcileReferralLog } from '../../utils/referralLog.js';
import { generateDailyQuests, generateWeeklyQuests, getWeekFromDay } from '../../game/QuestEngine.js';
import { MEDICATION_DATABASE } from '../../data/MedicationDatabase.js';
import { isPlainObject, isMetaRecord, hasOwn, clampInteger } from './storeUtils.js';
import { sanitizePlayerProfile } from './playerHelpers.js';
import { capClinicalHistory } from './clinicalHelpers.js';

export const normalizePersistedWorld = (world) => {
    const nextWorld = isPlainObject(world) ? { ...world } : {};
    nextWorld.day = clampInteger(nextWorld.day, INITIAL_TIME_STATE.day, 1, 999999);
    nextWorld.time = clampInteger(nextWorld.time, INITIAL_TIME_STATE.time, 0, 1439);
    nextWorld.speed = Math.max(0, (Number.isFinite(Number(nextWorld.speed)) ? Number(nextWorld.speed) : INITIAL_TIME_STATE.speed));
    nextWorld.isPaused = typeof nextWorld.isPaused === 'boolean' ? nextWorld.isPaused : INITIAL_TIME_STATE.isPaused;
    return nextWorld;
};

const createSeededQuestRoster = (day = INITIAL_TIME_STATE.day) => {
    const safeDay = Math.max(1, Math.trunc(Number(day) || INITIAL_TIME_STATE.day));
    return [
        ...generateDailyQuests(safeDay),
        ...generateWeeklyQuests(getWeekFromDay(safeDay))
    ];
};

export const syncQuestRoster = (quests, day = INITIAL_TIME_STATE.day) => {
    const safeDay = Math.max(1, Math.trunc(Number(day) || INITIAL_TIME_STATE.day));
    const safeWeek = getWeekFromDay(safeDay);
    const questList = Array.isArray(quests) ? quests.filter(isMetaRecord) : [];
    const currentDaily = questList.filter((quest) => quest.type === 'daily' && quest.assignedDay === safeDay);
    const currentWeekly = questList.filter((quest) => quest.type === 'weekly' && quest.assignedWeek === safeWeek);

    return [
        ...(currentDaily.length > 0 ? currentDaily : generateDailyQuests(safeDay)),
        ...(currentWeekly.length > 0 ? currentWeekly : generateWeeklyQuests(safeWeek))
    ];
};

// --- Initial State Constructors ---

/** Default Stase length. DeepThink usul 60 hari (lab one-shot), kami pakai
 *  90 hari karena pemakaian hybrid lab+rumah memungkinkan playtime lebih
 *  panjang & TTM keluarga butuh observasi 3 bulan untuk bergerak meaningful
 *  (Prochaska & DiClemente 1983).
 */
export const STASE_TARGET_DAY = 90;

/** Hari-hari milestone bulanan untuk debrief non-blocking (selain Day-1 day endpoint). */
export const STASE_DEBRIEF_MILESTONES = Object.freeze([30, 60]);

/** Initial state untuk Stase / endgame tracking. */
const createInitialStaseState = () => ({
    targetDay: STASE_TARGET_DAY,
    phase: 'active',                 // 'active' | 'postStase'
    finalScore: null,                // hasil calculatePerformanceScore saat hari (target+1) — immutable
    finalScoreLockedAt: null,        // timestamp ms saat skor di-lock
    finalScoreDay: null,             // day saat lock (sanity check)
    finalReportAcknowledged: false,  // user sudah dismiss laporan akhir?
    lastDebriefDay: 0,               // last monthly debrief milestone yang sudah dilewati & di-ack
});

export const createInitialMetaState = (day = INITIAL_TIME_STATE.day) => ({
    activeQuests: createSeededQuestRoster(day),
    activeStories: [],
    isWikiOpen: false,
    wikiMetric: null,
    saveVersion: CURRENT_SAVE_VERSION,
    runtimeTrap: null,
    stase: createInitialStaseState(),
});

export const createInitialPublicHealthState = () => ({
    villageData: null,
    prolanisRoster: [],
    prolanisState: { lastSenamMonth: -1, lastSenamDay: -1 },
    activeOutbreaks: [],
    outbreakNotification: null,
    outbreakRiskModifiers: { protectedUntil: {}, vulnerableUntil: {} },
    activeIKMEvents: [],
    completedIKMIds: [],
    ikmCooldowns: {},
    ikmCaseBoosts: [],
    bridgeOutageUntilDay: 0,
    lastBridgeRepairDay: -1,
    buildingProgress: {},
    lastIntelTargets: null,
    villageLedger: [],
    // PIS-PK "Desa Sehat" victory flag: set once when dual criteria met (meanIKS
    // ≥0.70 + readiness ≥60). Persist acknowledgement so the modal fires only once.
    villageVictoryAcknowledged: false
});

export const createInitialStaffState = () => ({
    hiredStaff: []
});

export const INITIAL_CLINICAL_STATE = {
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
    hospitalBedUsage: {},
    prbQueue: [],
    rrns: [],
    warningLevel: 0,
    gameOver: null,
    consequenceQueue: [],
    todayLog: [],
    reflections: [],
    showMorningBriefing: false,
    showEndOfDayDebrief: false,
    dailyQuestId: null,
    staffAllocation: {},
    morningReputation: null,
    labQueue: [],
    labMasteryHistory: [],
    kiaPatients: {},
    dentalLog: []
};

export const createInitialClinicalState = () => ({
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
    labQueue: [],
    labMasteryHistory: [],
    kiaPatients: {},
    dentalLog: []
});

// Codex Fix: exclude non-stock pseudo-items (care instructions like bed_rest, diet)
export const createInitialPharmacyInventory = () => normalizeInventoryList(
    MEDICATION_DATABASE
        .filter(med => med.form !== 'action')
        .map((med) => ({
            medicationId: med.id,
            stock: Math.floor(med.minStock * 1.5),
            lastRestockDay: 0
        }))
);

export const INITIAL_KPI = {
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

export const INITIAL_FACILITIES = {
    poli_umum: 1,
    poli_gigi: 0,
    poli_kia_kb: 1,
    lab: 0,
    apotek: 1,
    igd: 1,
    rawat_inap: 0,
    gudang: 1
};

export const createInitialFinanceState = () => ({
    stats: { kapitasi: 50000000, pendapatanUmum: 0, pengeluaranObat: 0, pengeluaranLab: 0, pengeluaranOperasional: 0 },
    kpi: { ...INITIAL_KPI },
    facilities: { ...INITIAL_FACILITIES },
    pharmacyInventory: createInitialPharmacyInventory(),
    pendingOrders: [],
    procurementLog: []
});

export const INITIAL_NAV_SETTINGS = {
    theme: 'medika',
    fontSize: 'normal',
    volume: 1.0,
    autoSave: true
};

export const createInitialNavState = (overrides = {}) => ({
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

// --- Merge/Persistence Helpers ---

export const mergePersistedFinance = (finance, currentFinance) => {
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
            ? (() => {
                const savedIds = new Set(
                    finance.pharmacyInventory.map(i => normalizeMedicationId(i?.medicationId))
                );
                const freshInventory = currentFinance.pharmacyInventory || [];
                const missingItems = freshInventory.filter(i => !savedIds.has(i.medicationId));
                return normalizeInventoryList([...finance.pharmacyInventory, ...missingItems]);
            })()
            : currentFinance.pharmacyInventory,
        pendingOrders: Array.isArray(finance.pendingOrders)
            ? finance.pendingOrders
            : currentFinance.pendingOrders
    };
};

export const mergePersistedPublicHealth = (publicHealth, currentPublicHealth) => {
    if (!isPlainObject(publicHealth)) {
        return currentPublicHealth;
    }

    return {
        ...currentPublicHealth,
        ...publicHealth,
        villageData: hasOwn(publicHealth, 'villageData')
            ? ensureVillageReadinessState(publicHealth.villageData)
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
        outbreakRiskModifiers: isPlainObject(publicHealth.outbreakRiskModifiers)
            ? {
                protectedUntil: {
                    ...(currentPublicHealth.outbreakRiskModifiers?.protectedUntil || {}),
                    ...(publicHealth.outbreakRiskModifiers.protectedUntil || {})
                },
                vulnerableUntil: {
                    ...(currentPublicHealth.outbreakRiskModifiers?.vulnerableUntil || {}),
                    ...(publicHealth.outbreakRiskModifiers.vulnerableUntil || {})
                }
            }
            : currentPublicHealth.outbreakRiskModifiers,
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
        bridgeOutageUntilDay: hasOwn(publicHealth, 'bridgeOutageUntilDay')
            ? clampInteger(publicHealth.bridgeOutageUntilDay, currentPublicHealth.bridgeOutageUntilDay, 0, 999999)
            : currentPublicHealth.bridgeOutageUntilDay,
        lastBridgeRepairDay: hasOwn(publicHealth, 'lastBridgeRepairDay')
            ? clampInteger(publicHealth.lastBridgeRepairDay, currentPublicHealth.lastBridgeRepairDay, -1, 999999)
            : currentPublicHealth.lastBridgeRepairDay,
        buildingProgress: isPlainObject(publicHealth.buildingProgress)
            ? { ...currentPublicHealth.buildingProgress, ...publicHealth.buildingProgress }
            : currentPublicHealth.buildingProgress,
        villageLedger: Array.isArray(publicHealth.villageLedger)
            ? publicHealth.villageLedger
            : currentPublicHealth.villageLedger
    };
};

export const mergePersistedStaff = (staff, currentStaff) => {
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

export const mergePersistedClinical = (clinical, currentClinical) => {
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
        history: normalizeEncounterList(
            normalizePatientList(
                capClinicalHistory(Array.isArray(clinical.history) ? clinical.history : currentClinical.history)
            )
        ),
        dailyArchive: normalizeDailyArchive(Array.isArray(clinical.dailyArchive) ? clinical.dailyArchive : currentClinical.dailyArchive),
        monthlyArchive: normalizeMonthlyArchive(Array.isArray(clinical.monthlyArchive) ? clinical.monthlyArchive : currentClinical.monthlyArchive),
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
        labQueue: Array.isArray(clinical.labQueue) ? clinical.labQueue : currentClinical.labQueue,
        labMasteryHistory: Array.isArray(clinical.labMasteryHistory) ? clinical.labMasteryHistory : currentClinical.labMasteryHistory,
        kiaPatients: isPlainObject(clinical.kiaPatients)
            ? { ...currentClinical.kiaPatients, ...clinical.kiaPatients }
            : currentClinical.kiaPatients,
        dentalLog: Array.isArray(clinical.dentalLog) ? clinical.dentalLog : currentClinical.dentalLog
    };
};

export const mergePersistedMeta = (meta, currentMeta, day = INITIAL_TIME_STATE.day) => {
    const safeDay = Math.max(1, Math.trunc(Number(day) || INITIAL_TIME_STATE.day));
    const baseMeta = createInitialMetaState(safeDay);
    const fallbackMeta = isMetaRecord(currentMeta) ? currentMeta : baseMeta;
    const safeMeta = isMetaRecord(meta) ? meta : {};
    const questSource = Array.isArray(safeMeta.activeQuests) ? safeMeta.activeQuests : fallbackMeta.activeQuests;

    return {
        ...baseMeta,
        ...fallbackMeta,
        ...safeMeta,
        activeQuests: syncQuestRoster(questSource, safeDay),
        activeStories: Array.isArray(safeMeta.activeStories)
            ? safeMeta.activeStories
            : Array.isArray(fallbackMeta.activeStories)
                ? fallbackMeta.activeStories
                : [],
        isWikiOpen: false,
        wikiMetric: null,
        saveVersion: Number.isInteger(safeMeta.saveVersion) ? safeMeta.saveVersion : CURRENT_SAVE_VERSION,
        runtimeTrap: null
    };
};

export const reconcileClinicalReferralLog = (clinicalState, worldState) => {
    const { activeReferralLog } = reconcileReferralLog(
        clinicalState?.activeReferralLog,
        worldState?.day,
        worldState?.time
    );

    return {
        ...clinicalState,
        activeReferralLog
    };
};

export const buildManualSaveSnapshot = (state) => parseSavePayload({
    saveVersion: CURRENT_SAVE_VERSION,
    savedAt: Date.now(),
    world: normalizePersistedWorld(state.world),
    player: {
        ...state.player,
        profile: sanitizePlayerProfile(state.player.profile)
    },
    finance: mergePersistedFinance(state.finance, createInitialFinanceState()),
    publicHealth: mergePersistedPublicHealth(state.publicHealth, createInitialPublicHealthState()),
    staff: mergePersistedStaff(state.staff, createInitialStaffState()),
    clinical: mergePersistedClinical(state.clinical, createInitialClinicalState()),
    meta: mergePersistedMeta(
        { ...state.meta, saveVersion: CURRENT_SAVE_VERSION },
        createInitialMetaState(state.world?.day),
        state.world?.day
    )
});
