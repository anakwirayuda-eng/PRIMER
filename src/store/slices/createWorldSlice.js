/**
 * @reflection
 * [IDENTITY]: createWorldSlice (CP2 extraction)
 * [PURPOSE]: Time & environment state slice
 * [STATE]: Production
 * [DEPENDS_ON]: GameCore (INITIAL_TIME_STATE)
 * [NOTE]: advanceTime is NOT here — it's orchestrator-level (calls actions.nextDay)
 * [LAST_UPDATE]: 2026-03-27
 */
import { INITIAL_TIME_STATE } from '../../game/GameCore.js';

export const createWorldSlice = (set, get) => ({
    // --- STATE ---
    world: { ...INITIAL_TIME_STATE },

    // --- ACTIONS ---
    worldActions: {
        tick: (minutes = 1) => set((s) => {
            let newTime = s.world.time + minutes;
            let newDay = s.world.day;
            if (newTime >= 1440) {
                newTime = 0;
                newDay += 1;
            }
            return { world: { ...s.world, time: newTime, day: newDay } };
        }),
        setTime: (val) => set((s) => {
            let next = typeof val === 'function' ? val(s.world.time) : val;
            next = Number(next) || 0;
            let newDay = s.world.day;
            if (next >= 1440) { next = next % 1440; newDay += 1; }
            if (next < 0) { next = 0; }
            return { world: { ...s.world, time: next, day: newDay } };
        }),
        setDay: (val) => set((s) => {
            const next = typeof val === 'function' ? val(s.world.day) : val;
            return { world: { ...s.world, day: Number(next) || 1 } };
        }),
        setGameSpeed: (speed) => set((s) => ({
            world: { ...s.world, speed: Number(speed) || 0, isPaused: speed === 0 }
        })),
        advanceTime: (minutes = 1) => {
            const increment = Math.max(0, Number(minutes) || 0);
            if (increment === 0) return { success: true, dayChanged: false };
            const state = get();
            const nextTime = state.world.time + increment;
            if (nextTime < 1440) {
                state.worldActions.setTime(nextTime);
                return { success: true, dayChanged: false };
            }
            const didAdvanceDay = state.actions.nextDay(state.world.day);
            return { success: didAdvanceDay !== false, dayChanged: didAdvanceDay !== false };
        },
        resetTime: () => set((s) => ({ world: { ...s.world, ...INITIAL_TIME_STATE } })),
    },
});
