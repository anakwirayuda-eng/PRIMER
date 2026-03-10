/**
 * @reflection
 * [IDENTITY]: useGameLoop
 * [PURPOSE]: React hook: useGameLoop — manages game state state and logic.
 * [STATE]: Stable (Post-Refactor v0.8.0)
 * [ANCHOR]: useGameLoop
 * [DEPENDS_ON]: SoundManager
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-13
 */

import { useEffect, useRef } from 'react';
// produce removed — game loop uses functional setState, not immer
import { soundManager } from '../utils/SoundManager.js';
import { checkInvariants } from '../diagnostics/invariants.js';
import { useGameStore } from '../store/useGameStore.js';
import { guardStability } from '../utils/prophylaxis.js';

/**
 * useGameLoop — Extracted from GameContext.jsx
 * 
 * The main game tick engine. Runs every second (scaled by gameSpeed).
 * Responsible for:
 *   - Draining player energy/spirit
 *   - Processing clinical ticks (spawns, referrals, ambulances)
 *   - Advancing in-game time
 *   - Triggering day transitions
 */
export function useGameLoop({
    gameState,
    gameSpeed,
    gameOver,
    time,
    day,
    buffs,
    villageData,
    activeOutbreaks,
    facilities,
    skills,
    playerStats, // New prop
    nextDay,
    setPlayerStats,
    setGameOver,
    setTime,
    processTick
}) {
    // Use refs for values that change every tick to avoid destroying/recreating setInterval
    const tickRef = useRef({ time, day, buffs, villageData, activeOutbreaks, facilities, skills, playerStats });

    // Synchronously update ref on every render to ensure interval always sees latest state
    // eslint-disable-next-line react-hooks/refs
    tickRef.current = { time, day, buffs, villageData, activeOutbreaks, facilities, skills, playerStats };

    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            // Prophylaxis: Core Tick Guard
            if (!guardStability('GAME_LOOP_TICK', 1000, 5)) return;

            const tick = tickRef.current;

            // Drain energy and spirit (0.15/tick ≈ 11 min to full drain at 1x)
            setPlayerStats(prev => {
                const newEnergy = Math.max(0, (prev.energy || 0) - 0.15); // Guard NaN
                return {
                    ...prev,
                    energy: newEnergy,
                    spirit: Math.max(0, (prev.spirit || 0) - 0.08)
                };
            });

            // Check Game Over condition using the LATEST state from Ref (synchronous check)
            // Note: we check the *previous* tick's stats or the current ref. 
            // Since setPlayerStats is async, we can't read the result immediately, 
            // but we can check if we were already low enough to trigger on *this* tick.
            // Better yet, just check the prop passed down which updates every render.
            // But inside setInterval, we must use the ref.

            // Logic: If energy was already very low in the last render (stored in ref), 
            // and we just subtracted more, we might be at 0.
            // Actually, safe bet is to check if valid energy < 0.2 (since we drain 0.15).
            if (tick.playerStats && tick.playerStats.energy <= 0.2 && !gameOver) {
                setGameOver({
                    type: 'fainted',
                    reason: 'Anda pingsan karena kelelahan luar biasa. Puskesmas terpaksa tutup sementara sampai Anda sadar.'
                });
                soundManager.playError();
            }

            // Process Clinical Tick (Referrals, Ambulances, Closing Time, Population Spawns)
            processTick({
                time: tick.time,
                day: tick.day,
                buffs: tick.buffs,
                villageData: tick.villageData,
                activeOutbreaks: tick.activeOutbreaks,
                facilities: tick.facilities,
                skills: tick.skills,
                onNextDay: nextDay
            });

            // Advance Time
            let didShiftDay = false;
            setTime(prev => {
                const newTime = prev + 1;
                if (newTime >= 1440) {
                    didShiftDay = true;
                    return 0;
                }
                return newTime;
            });

            if (didShiftDay) {
                nextDay(tick.day);
            }

            // Check Invariants (Tick Sentry)
            const failures = checkInvariants(useGameStore.getState());
            if (failures.length > 0) {
                console.warn('🚨 PRIMERA INVARIANT FAILURE:', failures);
            }
        }, 1000 / Math.max(0.1, gameSpeed)); // Guard against 0 or negative speed

        return () => clearInterval(timer);
    }, [gameState, gameSpeed, gameOver, nextDay, setPlayerStats, setGameOver, setTime, processTick]);
}
