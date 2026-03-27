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
import { createInitialMetaState } from '../helpers/persistenceHelpers.js';

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

        resetMeta: () => set({ meta: createInitialMetaState(get().world.day) }),
    },
});
