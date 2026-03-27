/**
 * createOrchestratorSlice.js — CP2 Extracted Orchestrator Slice
 * 
 * Owns: actions (saveGame, loadGame, startNewGame, nextDay, resetGame)
 * These are the top-level game lifecycle actions that orchestrate across ALL slices.
 * Cross-slice writes: ALL slices (nav, world, player, finance, clinical, publicHealth, staff, meta)
 * 
 * Pattern: Standard Zustand slice — (set, get) => ({ actions: { ... } })
 */
import { produce } from 'immer';
import { soundManager } from '../../utils/SoundManager.js';
import { getSupplierById } from '../../data/SupplierDatabase.js';
import { checkForOutbreakTrigger, checkOutbreakExpiry } from '../../domains/community/OutbreakSystem.js';
import { generatePatient } from '../../game/PatientGenerator.js';
import { evaluateIKMTriggers, getSeasonForDay } from '../../game/IKMEventEngine.js';
import { VILLAGE_FAMILIES, FAMILY_INDICATORS, VILLAGE_STATS, getAllVillagers, getUnlockedRWs } from '../../domains/village/VillageRegistry.js';
import { applyNeglectDecay } from '../../domains/village/NPCReadiness.js';
import { normalizeMedicationId } from '../../models/InventoryRuntime.js';
import { evaluateDirectorState, generateDirectorGift, processUKPBridge } from '../../game/TheDirector.js';
import { CURRENT_SAVE_VERSION, parseSavePayload } from '../../utils/savePayload.js';
import { seedKey } from '../../utils/deterministicRandom.js';
import { safeSetStorageItem } from '../../utils/browserSafety.js';
import { clearStability } from '../../utils/prophylaxis.js';
import { reconcileReferralLog } from '../../utils/referralLog.js';
import { INITIAL_PLAYER_STATE, INITIAL_TIME_STATE, calculateIKS } from '../../game/GameCore.js';
import { sanitizePlayerProfile, createStartingPlayerProfile, clampEnergyToProfile } from '../helpers/playerHelpers.js';
import { isAmbulanceStillBusy } from '../helpers/ambulanceHelpers.js';
import { buildDailyArchiveEntry } from '../helpers/archiveHelpers.js';
import {
    normalizePersistedWorld, createInitialMetaState, createInitialPublicHealthState, createInitialStaffState,
    createInitialClinicalState, createInitialFinanceState, createInitialNavState,
    mergePersistedFinance, mergePersistedPublicHealth, mergePersistedStaff, mergePersistedClinical, mergePersistedMeta,
    reconcileClinicalReferralLog, buildManualSaveSnapshot, syncQuestRoster
} from '../helpers/persistenceHelpers.js';
import { applyFamilyIndicatorDrift, applyStaffMoraleDecay, pruneOutbreakRiskModifiers } from '../helpers/publicHealthHelpers.js';
import {
    collectPendingUkpBridgeCases,
    ensureVillageReadinessState,
    markBehaviorCaseBridgeSpawned
} from '../../utils/behaviorCaseRuntime.js';
import { buildRuntimeTrap, triggerFreezeProtocol } from '../../utils/dispatchGuard.js';

/**
 * Arms the autosave trap — halts game if save fails.
 * Uses the canonical triggerFreezeProtocol path so runtime trap fields
 * (clinical.gameOver.type, nav.gameState, meta.runtimeTrap.phase) match tests.
 */
function armAutosaveTrap(set, get, trapId, message) {
    const trap = buildRuntimeTrap('actions.nextDay', {
        phase: trapId,
        reason: message
    });
    triggerFreezeProtocol(set, get, trap);
    return false;
}

export const createOrchestratorSlice = (set, get) => ({
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
                population.unlockedRWs = getUnlockedRWs(1, 50); // Day 1, starting reputation
                state.publicHealth.villageData = ensureVillageReadinessState(population);

                // Opening day: Generate 3 patients. Two use forced-resident seeds
                // to guarantee the player sees village residents on day 1.
                const _p0 = generatePatient(480, population, 1, state.finance.facilities, [], seedKey('new-game', 'open-a'));
                const _p1 = generatePatient(510, population, 1, state.finance.facilities, [], seedKey('new-game', 'open-b'));
                const _p2 = generatePatient(540, population, 1, state.finance.facilities, [], seedKey('new-game', 'open-c'));

                // Post-generate: Force at least 2 to be residents if they aren't already
                const _forceResident = (p, idx) => {
                    if (p.social?.isResident) return p; // Already resident
                    // Pick a random villager from the expanded pool
                    const villagers = population.villagers?.filter(v => v.status === 'alive') || [];
                    if (villagers.length === 0) return p;
                    const v = pickDeterministic(villagers, seedKey('force-resident', idx));
                    const fam = population.families?.find(f => f.id === v.familyId);
                    return {
                        ...p,
                        name: v.fullName || (v.firstName + ' ' + (fam?.surname || '')),
                        age: v.age || p.age,
                        gender: v.gender === 'L' ? 'Laki-laki' : 'Perempuan',
                        social: { ...p.social, isResident: true, familyId: v.familyId, villagerId: v.id },
                        hidden: { ...p.hidden, familyId: v.familyId, villagerId: v.id, isResident: true }
                    };
                };

                state.clinical.queue = [
                    _forceResident(_p0, 0),
                    _forceResident(_p1, 1),
                    _p2 // Third patient can be outsider/random
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

                // Update unlocked RWs based on current reputation + day
                if (state.publicHealth.villageData) {
                    state.publicHealth.villageData.unlockedRWs = getUnlockedRWs(
                        nextDayVal,
                        state.player.profile.reputation || 50
                    );
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
            meta: createInitialMetaState(INITIAL_TIME_STATE.day)
        }))
    },
});
