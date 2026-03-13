/**
 * @reflection
 * [IDENTITY]: useGameLoop
 * [PURPOSE]: React hook: useGameLoop — manages game tick state and logic.
 * [STATE]: Stable (Post-Refactor v0.8.5 — P2/P3 Fix)
 * [ANCHOR]: useGameLoop
 * [DEPENDS_ON]: SoundManager, invariants, prophylaxis
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-13
 * [FIXES]: P2 (stale closure on day shift), P3 (interval recreation on speed change)
 */

import { useEffect, useRef } from 'react';
import { soundManager } from '../utils/SoundManager.js';
import { checkInvariants } from '../diagnostics/invariants.js';
import { useGameStore } from '../store/useGameStore.js';
import { guardStability } from '../utils/prophylaxis.js';

/**
 * useGameLoop — Main game tick engine.
 * 
 * Runs every second (scaled by gameSpeed).
 * Responsible for:
 *   - Draining player energy/spirit
 *   - Processing clinical ticks (spawns, referrals, ambulances)
 *   - Advancing in-game time
 *   - Triggering day transitions
 * 
 * P2 Fix: Day shift uses queueMicrotask instead of stale closure variable
 * P3 Fix: gameSpeed stored in ref — interval only recreated on gameState/gameOver change
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
    playerStats,
    nextDay,
    setPlayerStats,
    setGameOver,
    setTime,
    processTick
}) {
    // Use refs for values that change every tick to avoid destroying/recreating setInterval
    const tickRef = useRef({ time, day, buffs, villageData, activeOutbreaks, facilities, skills, playerStats });

    // P3 Fix: gameSpeed in ref so interval doesn't recreate on speed change
    const speedRef = useRef(gameSpeed);

    // Synchronously update refs on every render
    tickRef.current = { time, day, buffs, villageData, activeOutbreaks, facilities, skills, playerStats };
    speedRef.current = gameSpeed;

    useEffect(() => {
        if (gameState !== 'playing') return;

        // P3 Fix: Use fixed base interval, scale tick rate via speedRef
        const BASE_INTERVAL_MS = 250; // 4 checks per second for smoother speed response

        const timer = setInterval(() => {
            const currentSpeed = speedRef.current;
            if (currentSpeed <= 0) return; // paused via speed=0

            // Prophylaxis: Core Tick Guard
            if (!guardStability('GAME_LOOP_TICK', 1000, 5)) return;

            const tick = tickRef.current;

            // Drain energy and spirit (0.15/tick ≈ 11 min to full drain at 1x)
            // Scale by speed: at 2x, drain twice per second; at 4x, four times
            const drainMultiplier = currentSpeed * (BASE_INTERVAL_MS / 1000);
            setPlayerStats(prev => {
                const newEnergy = Math.max(0, (prev.energy || 0) - 0.15 * drainMultiplier);
                return {
                    ...prev,
                    energy: newEnergy,
                    spirit: Math.max(0, (prev.spirit || 0) - 0.08 * drainMultiplier)
                };
            });

            // Game Over check
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

            // Advance Time — scale by speed
            // At 1x: advance 1 min per second (4 ticks * 0.25 = 1)
            // At 2x: advance 2 min per second (4 ticks * 0.5 = 2)
            const timeIncrement = currentSpeed * (BASE_INTERVAL_MS / 1000);

            // P2 Fix: Use queueMicrotask for day transition instead of stale closure
            setTime(prev => {
                const newTime = prev + timeIncrement;
                if (newTime >= 1440) {
                    // Schedule day transition after state update completes
                    const currentDay = tick.day;
                    queueMicrotask(() => nextDay(currentDay));
                    return newTime - 1440; // Carry over excess minutes
                }
                return newTime;
            });

            // Check Invariants (Tick Sentry)
            const failures = checkInvariants(useGameStore.getState());
            if (failures.length > 0) {
                console.warn('🚨 PRIMERA INVARIANT FAILURE:', failures);
            }
        }, BASE_INTERVAL_MS);

        return () => clearInterval(timer);
    // P3 Fix: gameSpeed REMOVED from deps — reads from speedRef instead
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, gameOver, nextDay, setPlayerStats, setGameOver, setTime, processTick]);
}
