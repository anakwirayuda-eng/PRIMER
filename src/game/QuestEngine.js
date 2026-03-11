/**
 * @reflection
 * [IDENTITY]: QuestEngine
 * [PURPOSE]: Game engine module for Daily, Weekly, and Story branching quests.
 * [STATE]: Experimental
 * [ANCHOR]: QUEST_TEMPLATES
 */

import { STORY_TEMPLATES } from './StoryDatabase.js';
import { randomIdFromSeed, seedKey, shuffleDeterministic } from '../utils/deterministicRandom.js';

export const QUEST_TEMPLATES = [
    // Daily Quests
    {
        id: 'home_visit_3',
        type: 'daily',
        label: 'Petugas Rajin',
        description: 'Kunjungi 3 keluarga di wilayah',
        target: 3,
        metric: 'home_visits',
        xp: 50,
        icon: '🏠'
    },
    {
        id: 'psn_5',
        type: 'daily',
        label: 'Juru Pantau Jentik',
        description: 'Lakukan PSN di 5 rumah',
        target: 5,
        metric: 'psn_done',
        xp: 60,
        icon: '🪳'
    },
    // IKM Daily Quests
    {
        id: 'penyuluhan_1',
        type: 'daily',
        label: 'Penyuluh Handal',
        description: 'Berikan 1 sesi penyuluhan kesehatan',
        target: 1,
        metric: 'education_given',
        xp: 40,
        icon: '📢'
    },
    {
        id: 'posyandu_activity',
        type: 'daily',
        label: 'Sahabat Posyandu',
        description: 'Selesaikan 1 kegiatan Posyandu',
        target: 1,
        metric: 'posyandu_done',
        xp: 45,
        icon: '⚖️'
    },
    {
        id: 'phbs_survey_2',
        type: 'daily',
        label: 'Inspektur PHBS',
        description: 'Survei PHBS di 2 rumah',
        target: 2,
        metric: 'phbs_survey',
        xp: 50,
        icon: '🧼'
    },
    {
        id: 'edukasi_gizi',
        type: 'daily',
        label: 'Ahli Gizi Muda',
        description: 'Berikan edukasi gizi ke 1 keluarga',
        target: 1,
        metric: 'nutrition_education',
        xp: 40,
        icon: '🥗'
    },
    // Weekly Quests
    {
        id: 'treat_patients_20',
        type: 'weekly',
        label: 'Dokter Handal',
        description: 'Tangani 20 pasien di klinik',
        target: 20,
        metric: 'patients_treated',
        xp: 200,
        icon: '👨‍⚕️'
    },
    {
        id: 'home_visit_10',
        type: 'weekly',
        label: 'Penjelajah Wilayah',
        description: 'Kunjungi 10 keluarga dalam seminggu',
        target: 10,
        metric: 'home_visits',
        xp: 150,
        icon: '🏘️'
    },
    {
        id: 'surveilans_lingkungan',
        type: 'weekly',
        label: 'Detektif Lingkungan',
        description: 'Lakukan PSN di 15 rumah dalam seminggu',
        target: 15,
        metric: 'psn_done',
        xp: 180,
        icon: '🔍'
    }
];

/**
 * Evaluates triggers for story quests based on current world state
 */
export function evaluateStoryTriggers(state, activeStories = []) {
    const activeIds = activeStories.map(s => s.templateId);

    return STORY_TEMPLATES.filter(template => {
        if (activeIds.includes(template.id)) return false;

        const { trigger } = template;

        // Day-based trigger
        if (trigger.type === 'day' && state.day >= trigger.value) {
            if (trigger.condition) {
                // Simple condition parser for 'reputation > X'
                if (trigger.condition.includes('reputation')) {
                    const threshold = parseInt(trigger.condition.split('>')[1]);
                    return (state.reputation || 0) > threshold;
                }
            }
            return true;
        }

        // Stat-based trigger (e.g., patients_treated)
        if (trigger.type === 'stat' && (state[trigger.metric] || 0) >= trigger.value) {
            return true;
        }

        return false;
    }).map((template, index) => ({
        templateId: template.id,
        instanceId: randomIdFromSeed(
            'story',
            seedKey('story-trigger', template.id, state.day || 1, index, activeIds)
        ),
        currentNodeId: 'start',
        progress: 0,
        completed: false,
        claimed: false,
        data: {}
    }));
}

/**
 * Advances a story to the next node
 */
export function advanceStoryNode(storyInstance, choice) {
    const template = STORY_TEMPLATES.find(t => t.id === storyInstance.templateId);
    if (!template) return storyInstance;

    const nextNodeId = choice.nextNode;
    const nextNode = template.nodes[nextNodeId];

    return {
        ...storyInstance,
        currentNodeId: nextNodeId,
        progress: 0,
        completed: nextNode?.isEnd || false
    };
}

/**
 * Global Progress Updater for both Quests and Stories
 */
export function updateGameProgress(currentQuests, activeStories, metric, amount = 1) {
    let newlyCompleted = [];

    // 1. Update Daily/Weekly Quests
    const updatedQuests = currentQuests.map(quest => {
        if (quest.metric !== metric || quest.completed) return quest;
        const newProgress = Math.min(quest.progress + (amount || 1), quest.target);
        const isDone = newProgress >= quest.target;
        if (isDone) newlyCompleted.push(quest);
        return { ...quest, progress: newProgress, completed: isDone };
    });

    // 2. Update Story Action Nodes
    const updatedStories = activeStories.map(story => {
        if (story.completed) return story;

        const template = STORY_TEMPLATES.find(t => t.id === story.templateId);
        const currentNode = template?.nodes[story.currentNodeId];

        if (currentNode?.type === 'action' && currentNode.metric === metric) {
            const newProgress = story.progress + amount;
            const isDone = newProgress >= currentNode.target;

            if (isDone) {
                const nextId = currentNode.onComplete;
                return {
                    ...story,
                    currentNodeId: nextId,
                    progress: 0,
                    completed: template.nodes[nextId]?.isEnd || false
                };
            }
            return { ...story, progress: newProgress };
        }
        return story;
    });

    return { updatedQuests, updatedStories, newlyCompleted };
}

/**
 * Standard Quest Reward Logic
 */
export function claimQuestReward(quests, questId) {
    let xpReward = 0;
    const updatedQuests = quests.map(quest => {
        if (quest.id === questId && quest.completed && !quest.claimed) {
            xpReward = quest.xp;
            return { ...quest, claimed: true };
        }
        return quest;
    });
    return { updatedQuests, xpReward };
}

// Utility Helpers
export function generateDailyQuests(day) {
    const dailies = QUEST_TEMPLATES.filter(q => q.type === 'daily');
    return shuffleDeterministic(dailies, seedKey('daily-quests', day)).slice(0, 3).map(q => ({
        ...q, assignedDay: day, progress: 0, completed: false, claimed: false
    }));
}

export function generateWeeklyQuests(week) {
    const weeklies = QUEST_TEMPLATES.filter(q => q.type === 'weekly');
    return shuffleDeterministic(weeklies, seedKey('weekly-quests', week)).slice(0, 2).map(q => ({
        ...q, assignedWeek: week, progress: 0, completed: false, claimed: false
    }));
}

export function getWeekFromDay(day) {
    return Math.floor((day - 1) / 7) + 1;
}

export default {
    evaluateStoryTriggers,
    advanceStoryNode,
    updateGameProgress,
    claimQuestReward,
    generateDailyQuests,
    generateWeeklyQuests,
    getWeekFromDay
};
