/**
 * @reflection
 * [IDENTITY]: createPlayerSlice (CP2 extraction)
 * [PURPOSE]: Player profile, XP, skills, rest, sleep state slice
 * [STATE]: Production
 * [CROSS_SLICE]: sleepWithAlarm reads world + calls actions.nextDay, worldActions.setTime
 *               takeLoungeRest calls worldActions.advanceTime
 * [DEPENDS_ON]: playerHelpers, GameCore, SoundManager
 * [LAST_UPDATE]: 2026-03-27
 */
import { soundManager } from '../../utils/SoundManager.js';
import {
    sanitizePlayerProfile,
    applyXpGainToProfile,
    spendXpFromProfile,
    normalizeSkillList
} from '../helpers/playerHelpers.js';
import { clampInteger } from '../helpers/storeUtils.js';
import {
    INITIAL_PLAYER_STATE,
    calculateSleepRecovery as calculateSleepRecoveryOutcome
} from '../../game/GameCore.js';

export const createPlayerSlice = (set, get) => ({
    // --- STATE ---
    player: {
        profile: INITIAL_PLAYER_STATE },

    // --- ACTIONS ---
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
                // Cross-slice: calls orchestrator actions.nextDay
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

            // Cross-slice: calls worldActions.setTime
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

            // Cross-slice: calls worldActions.advanceTime
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
            // Gamelan-ish glissando — "level up" feel (skill unlocked via XP).
            // Single call: `a?.() || b()` would fire BOTH (undefined is falsy) — Codex P2.
            soundManager.playLevelUp?.();
            return true;
        },
        resetPlayer: () => set(s => ({ player: { ...s.player, profile: sanitizePlayerProfile(INITIAL_PLAYER_STATE) } })),
    },
});
