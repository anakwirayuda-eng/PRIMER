/**
 * @reflection
 * [IDENTITY]: useCloudSync
 * [PURPOSE]: Hook that syncs game saves to Supabase cloud after local save.
 *            Hardened with: shadowban trojan horse, circuit breaker analytics,
 *            debounce cleanup, module-level throttle.
 * [STATE]: Production (Hardened)
 * [ANCHOR]: CLOUD_SYNC_HOOK
 * [DEPENDS_ON]: CloudSaveService, AnalyticsService, AuthContext, GameIntegrity
 * [LAST_UPDATE]: 2026-03-20
 */

import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { CloudSaveService } from '../services/CloudSaveService';
import { AnalyticsService } from '../services/AnalyticsService';
import { useGameStore } from '../store/useGameStore';
import { sanityCheckState, generateIntegrityHash } from '../utils/GameIntegrity';

// ── Module-level variables: survives component remounts ──
let globalLastSync = 0;
let hasReportedCheatThisSession = false;
const MIN_SYNC_INTERVAL = 30_000; // 30s between syncs

/**
 * Watches for game state changes and syncs to cloud.
 * Non-intrusive: if cloud fails, local save is unaffected.
 *
 * Anti-cheat strategy: "Trojan Horse Shadowban"
 * - Cheaters are NOT blocked from syncing (that teaches them what's caught)
 * - Instead, tainted data is tagged silently — leaderboard hides them
 * - Cheater sees "Synced successfully" and thinks they won
 *
 * @param {object} options
 * @param {string} options.slotId - Current save slot
 * @param {boolean} options.enabled - Whether cloud sync is active
 */
export function useCloudSync({ slotId = 'default', enabled = true } = {}) {
    const auth = useAuth();

    const syncToCloud = useCallback(async () => {
        if (!enabled || !auth?.isOnline) return;

        // Module-level throttle — immune to remount bypass
        const now = Date.now();
        if (now - globalLastSync < MIN_SYNC_INTERVAL) return;
        globalLastSync = now;

        try {
            const state = useGameStore.getState();

            // Extract only persistable slices
            const persistableState = {
                world: state.world,
                player: state.player,
                finance: state.finance,
                publicHealth: state.publicHealth,
                staff: state.staff,
                clinical: state.clinical,
            };

            // ── Anti-Cheat: Sanity check ──
            const sanity = sanityCheckState(state);
            let isTainted = false;

            if (!sanity.valid) {
                isTainted = true;

                // Circuit breaker: report cheat ONCE per session (saves API quota)
                if (!hasReportedCheatThisSession) {
                    AnalyticsService.track('cheat_detected', {
                        type: 'sanity_check',
                        violations: sanity.violations
                    });
                    hasReportedCheatThisSession = true;
                }

                // Trojan Horse: mark data as tainted but DON'T block sync
                // Cheater sees "success" — but leaderboard silently hides them
                persistableState._is_tainted = true;
            }

            // Data sealing: attach integrity hash
            try {
                persistableState._integrity = await generateIntegrityHash(state);
            } catch { /* non-critical */ }

            const { success, error } = await CloudSaveService.saveToCloud(slotId, persistableState);

            if (success) {
                console.debug('[CloudSync] Synced to cloud successfully');
                // Only track legitimate saves (save quota)
                if (!isTainted) AnalyticsService.trackGameSaved(slotId);
            } else {
                console.warn('[CloudSync] Cloud sync failed (non-fatal):', error);
            }
        } catch (err) {
            console.warn('[CloudSync] Cloud sync error (non-fatal):', err.message);
        }
    }, [auth?.isOnline, enabled, slotId]);

    // Sync when the day changes (a significant game event)
    useEffect(() => {
        if (!enabled || !auth?.isOnline) return;

        let timeoutId; // Track for cleanup — prevents memory leak

        const unsub = useGameStore.subscribe(
            (state) => state.world.day,
            (day, prevDay) => {
                if (day !== prevDay && day > 1) {
                    // Clear previous timer if user spams "Next Day"
                    if (timeoutId) clearTimeout(timeoutId);
                    timeoutId = setTimeout(syncToCloud, 2000);
                }
            }
        );

        return () => {
            unsub();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [auth?.isOnline, enabled, syncToCloud]);

    return { syncToCloud };
}
