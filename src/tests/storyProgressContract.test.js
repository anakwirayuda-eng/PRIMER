import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

import { useGameStore } from '../store/useGameStore.js';
import { clearStability } from '../utils/prophylaxis.js';

function makeStoryInstance(overrides = {}) {
    return {
        instanceId: 'story-test',
        templateId: 'cikapas_hysteria',
        currentNodeId: 'start',
        progress: 0,
        completed: false,
        claimed: false,
        data: {},
        ...overrides
    };
}

describe('story progress contract', () => {
    beforeEach(() => {
        clearStability('ACTION_metaActions.advanceStory');
        clearStability('ACTION_metaActions.updateProgress');
        useGameStore.setState(useGameStore.getInitialState(), true);
        useGameStore.setState(state => ({
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    reputation: 50,
                    xp: 0,
                    energy: 100
                }
            },
            finance: {
                ...state.finance,
                stats: {
                    ...state.finance.stats,
                    pendapatanUmum: 1_000_000,
                    kapitasi: 50_000_000
                }
            }
        }));
    });

    it('applies direct end-node impact exactly once when a dialog choice finishes a story', () => {
        const storyInstance = makeStoryInstance({
            instanceId: 'story-direct',
            currentNodeId: 'personal_visit'
        });

        useGameStore.setState(state => ({
            meta: {
                ...state.meta,
                activeStories: [storyInstance]
            }
        }));

        let firstResult;
        let secondResult;

        act(() => {
            firstResult = useGameStore.getState().metaActions.advanceStory(storyInstance, {
                nextNode: 'education_outcome',
                impact: { reputation: 15 }
            });
        });

        const afterFirstAdvance = useGameStore.getState();
        expect(firstResult).toMatchObject({ success: true });
        expect(afterFirstAdvance.meta.activeStories[0]).toMatchObject({
            currentNodeId: 'education_outcome',
            completed: true
        });
        expect(afterFirstAdvance.player.profile.reputation).toBe(85);
        expect(afterFirstAdvance.player.profile.xp).toBe(150);

        act(() => {
            secondResult = useGameStore.getState().metaActions.advanceStory(afterFirstAdvance.meta.activeStories[0], {
                nextNode: 'education_outcome',
                impact: { reputation: 15 }
            });
        });

        const afterSecondAdvance = useGameStore.getState();
        expect(secondResult).toMatchObject({ success: false });
        expect(afterSecondAdvance.player.profile.reputation).toBe(85);
        expect(afterSecondAdvance.player.profile.xp).toBe(150);
    });

    it('applies action-node end impact exactly once when progress completes the story', () => {
        const storyInstance = makeStoryInstance({
            instanceId: 'story-action',
            currentNodeId: 'team_sent',
            progress: 2
        });

        useGameStore.setState(state => ({
            meta: {
                ...state.meta,
                activeStories: [storyInstance]
            }
        }));

        let firstResult;
        let secondResult;

        act(() => {
            firstResult = useGameStore.getState().metaActions.updateProgress('home_visits', 1);
        });

        const afterFirstUpdate = useGameStore.getState();
        expect(firstResult).toMatchObject({ success: true, metric: 'home_visits' });
        expect(afterFirstUpdate.meta.activeStories[0]).toMatchObject({
            currentNodeId: 'scientific_outcome',
            completed: true
        });
        expect(afterFirstUpdate.player.profile.reputation).toBe(60);
        expect(afterFirstUpdate.player.profile.xp).toBe(100);

        act(() => {
            secondResult = useGameStore.getState().metaActions.updateProgress('home_visits', 1);
        });

        const afterSecondUpdate = useGameStore.getState();
        expect(secondResult).toMatchObject({ success: true, metric: 'home_visits' });
        expect(afterSecondUpdate.player.profile.reputation).toBe(60);
        expect(afterSecondUpdate.player.profile.xp).toBe(100);
    });

    it('advances days_passed action nodes into their terminal reward node', () => {
        const storyInstance = makeStoryInstance({
            instanceId: 'story-days',
            templateId: 'mdr_tb_detection',
            currentNodeId: 'tcm_referral',
            progress: 1
        });

        useGameStore.setState(state => ({
            meta: {
                ...state.meta,
                activeStories: [storyInstance]
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().metaActions.updateProgress('days_passed', 1);
        });

        const nextState = useGameStore.getState();
        expect(result).toMatchObject({ success: true, metric: 'days_passed' });
        expect(nextState.meta.activeStories[0]).toMatchObject({
            currentNodeId: 'mdr_confirmed',
            completed: true
        });
        expect(nextState.player.profile.reputation).toBe(60);
        expect(nextState.player.profile.xp).toBe(200);
    });

    it('accepts legacy posyandu progress producers through the canonical alias', () => {
        useGameStore.setState(state => ({
            meta: {
                ...state.meta,
                activeQuests: [
                    {
                        id: 'posyandu-story',
                        type: 'daily',
                        label: 'Sahabat Posyandu',
                        description: 'Selesaikan 1 kegiatan Posyandu',
                        target: 1,
                        metric: 'posyandu_done',
                        xp: 45,
                        icon: '⚖️',
                        progress: 0,
                        completed: false,
                        claimed: false
                    }
                ]
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().metaActions.updateProgress('posyandu', 1);
        });

        const nextState = useGameStore.getState();
        expect(result).toMatchObject({ success: true, metric: 'posyandu_done' });
        expect(nextState.meta.activeQuests[0]).toMatchObject({
            progress: 1,
            completed: true
        });
    });
});
