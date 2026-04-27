/**
 * @reflection
 * [IDENTITY]: createMetaSlice (CP2 extraction)
 * [PURPOSE]: Quest, story, and wiki state slice
 * [STATE]: Production
 * [CROSS_SLICE]: claimQuest calls playerActions.gainXp
 *               evaluateTriggers reads world, player, finance
 *               updateProgress + advanceStory use withTransaction (immer draft)
 * [DEPENDS_ON]: GameProgressEngine, StoryEngine, transactions, progressMetrics,
 *               publicHealthHelpers, SoundManager
 * [LAST_UPDATE]: 2026-03-27
 */
import { soundManager } from '../../utils/SoundManager.js';
import { withTransaction } from '../../utils/transactions.js';
import { normalizeProgressMetric } from '../../utils/progressMetrics.js';
import { INITIAL_TIME_STATE } from '../../game/GameCore.js';
import {
    updateGameProgress,
    claimQuestReward,
    advanceStoryNode,
    getStoryNodeImpact,
    evaluateStoryTriggers
} from '../../game/QuestEngine.js';
import { applyStoryImpactToDraft } from '../helpers/publicHealthHelpers.js';
import { createInitialMetaState, STASE_TARGET_DAY } from '../helpers/persistenceHelpers.js';
import { calculatePerformanceScore } from '../../utils/scoringEngine.js';
import { BADGE_CATALOGUE, evaluateNewlyEligibleBadges } from '../../utils/lifetimeBadges.js';
import { showToast } from '../../utils/ToastManager.js';

export const createMetaSlice = (set, get) => ({
    // --- STATE ---
    meta: createInitialMetaState(INITIAL_TIME_STATE.day),

    // --- ACTIONS ---
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

        // CROSS-SLICE: calls playerActions.gainXp
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

        // Reads world, player, finance — no write to other slices
        evaluateTriggers: () => {
            const s = get();
            const gameState = {
                day: s.world.day,
                reputation: s.player.profile.reputation,
                balance: s.finance.stats.pendapatanUmum,
                patients_treated: s.finance.kpi.totalPatients
            };
            const newStories = evaluateStoryTriggers(gameState, s.meta.activeStories);
            if (newStories.length > 0) {
                set({ meta: { ...s.meta, activeStories: [...s.meta.activeStories, ...newStories] } });
            }
        },

        openWiki: (key) => set((s) => ({ meta: { ...s.meta, isWikiOpen: true, wikiMetric: key } })),
        closeWiki: () => set((s) => ({ meta: { ...s.meta, isWikiOpen: false } })),

        // ═══ STASE ENDGAME — final score lock di hari ke-(STASE_TARGET_DAY+1) ═══
        /**
         * Hitung Skor Kinerja Terpadu dari snapshot state saat ini, lock-in
         * sebagai final score, dan transisi ke phase 'postStase'. Idempotent:
         * memanggil ulang setelah lock pertama tidak meng-overwrite skor.
         * Mahasiswa tetap bisa lanjut main untuk hunt achievement Model C —
         * skor leaderboard tidak berubah lagi.
         */
        lockStaseFinalScore: () => {
            const s = get();
            if (s.meta.stase?.finalScore != null) {
                return s.meta.stase.finalScore; // already locked
            }
            const snapshot = {
                player: s.player,
                clinical: s.clinical,
                publicHealth: s.publicHealth,
                world: s.world,
                derivedKpis: s.finance, // selectDerivedFinance shape
            };
            const performance = calculatePerformanceScore(snapshot);
            const now = Date.now();
            const dayAtLock = s.world?.day ?? null;
            set((state) => ({
                meta: {
                    ...state.meta,
                    stase: {
                        ...(state.meta.stase || {}),
                        targetDay: state.meta.stase?.targetDay ?? STASE_TARGET_DAY,
                        phase: 'postStase',
                        finalScore: performance,
                        finalScoreLockedAt: now,
                        finalScoreDay: dayAtLock,
                        finalReportAcknowledged: false,
                    },
                },
            }));
            // Auto-update Layer C lifetime tracker (best grade + completed stases)
            try {
                get().metaActions.recordStaseCompletion(performance.grade.grade);
            } catch (err) {
                console.warn('[lifetime] recordStaseCompletion failed:', err);
            }
            return performance;
        },

        /** Dismiss laporan akhir; mode pasca-stase tetap aktif untuk badge hunt. */
        acknowledgeStaseFinalReport: () => set((state) => ({
            meta: {
                ...state.meta,
                stase: {
                    ...(state.meta.stase || {}),
                    finalReportAcknowledged: true,
                },
            },
        })),

        // ═══ LIFETIME — Layer C Mastery (DeepThink M5) ═══
        // Tracker antar-playthrough; tidak di-reset oleh resetMeta atau startNewGame.
        // Semua action idempotent dan defensive thd undefined lifetime state.

        /**
         * Catat 1 kasus tuntas ke lifetime tracker. Auto-evaluate badges
         * setelah update + emit toast untuk badge baru.
         * @param {{skdi?:string, icd10?:string}} caseInfo
         */
        recordLifetimeCase: (caseInfo = {}) => set((state) => {
            const lifetime = state.meta.lifetime || {};
            const skdiSet = new Set(lifetime.skdiTouched || []);
            const icdSet = new Set(lifetime.diagnosisIcdTouched || []);
            if (caseInfo.skdi) skdiSet.add(String(caseInfo.skdi));
            if (caseInfo.icd10) icdSet.add(String(caseInfo.icd10));
            const nextLifetime = {
                ...lifetime,
                totalCases: (lifetime.totalCases || 0) + 1,
                skdiTouched: Array.from(skdiSet),
                diagnosisIcdTouched: Array.from(icdSet),
                badges: lifetime.badges || [],
                bestStaseGrade: lifetime.bestStaseGrade ?? null,
                completedStases: lifetime.completedStases || 0,
            };

            // Evaluate newly eligible badges
            const newlyEligible = evaluateNewlyEligibleBadges(nextLifetime);
            if (newlyEligible.length > 0) {
                const now = Date.now();
                const day = state.world?.day ?? null;
                newlyEligible.forEach((badgeId) => {
                    const def = BADGE_CATALOGUE[badgeId];
                    if (!def) return;
                    nextLifetime.badges = [
                        ...nextLifetime.badges,
                        { id: badgeId, label: def.label, awardedAt: now, awardedAtDay: day },
                    ];
                    showToast(`${def.icon} Lencana baru: ${def.label} — ${def.description}`, 'success', 6000);
                });
            }

            return { meta: { ...state.meta, lifetime: nextLifetime } };
        }),

        /**
         * Catat 1 stase selesai (final score locked). Update bestGrade +
         * completedStases counter, lalu evaluate badges stase.
         * @param {string} grade - 'A'|'B'|'C'|'D'
         */
        recordStaseCompletion: (grade) => set((state) => {
            const lifetime = state.meta.lifetime || {};
            // Best grade comparison: A > B > C > D (lower letter = better).
            const gradeOrder = { A: 0, B: 1, C: 2, D: 3 };
            const newGradeRank = gradeOrder[grade] ?? 99;
            const currentBest = lifetime.bestStaseGrade;
            const currentRank = gradeOrder[currentBest] ?? 99;
            const nextBest = newGradeRank < currentRank ? grade : currentBest;

            const nextLifetime = {
                ...lifetime,
                bestStaseGrade: nextBest ?? null,
                completedStases: (lifetime.completedStases || 0) + 1,
                totalCases: lifetime.totalCases || 0,
                skdiTouched: lifetime.skdiTouched || [],
                diagnosisIcdTouched: lifetime.diagnosisIcdTouched || [],
                badges: lifetime.badges || [],
            };

            const newlyEligible = evaluateNewlyEligibleBadges(nextLifetime);
            if (newlyEligible.length > 0) {
                const now = Date.now();
                const day = state.world?.day ?? null;
                newlyEligible.forEach((badgeId) => {
                    const def = BADGE_CATALOGUE[badgeId];
                    if (!def) return;
                    nextLifetime.badges = [
                        ...nextLifetime.badges,
                        { id: badgeId, label: def.label, awardedAt: now, awardedAtDay: day },
                    ];
                    showToast(`${def.icon} Lencana stase: ${def.label} — ${def.description}`, 'success', 7000);
                });
            }

            return { meta: { ...state.meta, lifetime: nextLifetime } };
        }),

        // ═══ ONBOARDING — hints Day 1-2 untuk mahasiswa baru ═══
        advanceOnboardingStep: () => set((state) => ({
            meta: {
                ...state.meta,
                onboarding: {
                    ...(state.meta.onboarding || { enabled: true, currentStep: 0, dismissed: false }),
                    currentStep: (state.meta.onboarding?.currentStep ?? 0) + 1,
                },
            },
        })),
        dismissOnboarding: () => set((state) => ({
            meta: {
                ...state.meta,
                onboarding: {
                    ...(state.meta.onboarding || {}),
                    dismissed: true,
                },
            },
        })),

        /**
         * Tandai milestone monthly debrief sebagai "sudah dilihat".
         * Idempotent — kalau milestoneDay <= lastDebriefDay, tidak berubah.
         */
        acknowledgeMonthlyDebrief: (milestoneDay) => set((state) => {
            const current = state.meta.stase?.lastDebriefDay ?? 0;
            const next = Number(milestoneDay) || 0;
            if (next <= current) return {};
            return {
                meta: {
                    ...state.meta,
                    stase: {
                        ...(state.meta.stase || {}),
                        lastDebriefDay: next,
                    },
                },
            };
        }),

        /**
         * Reset meta state untuk new game / load fresh — TAPI preserve
         * `lifetime` (Layer C Mastery). Pemain yang ulang stase tetap
         * bawa badge + tracker SKDI dari run sebelumnya.
         */
        resetMeta: () => set((state) => {
            const fresh = createInitialMetaState(state.world.day);
            const preservedLifetime = state.meta?.lifetime || fresh.lifetime;
            return { meta: { ...fresh, lifetime: preservedLifetime } };
        }),
    },
});
