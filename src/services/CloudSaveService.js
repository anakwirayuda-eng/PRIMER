/**
 * @reflection
 * [IDENTITY]: CloudSaveService
 * [PURPOSE]: Cloud save/load via Supabase with auto-leaderboard sync.
 * [STATE]: Production
 * [ANCHOR]: CLOUD_SAVE
 * [DEPENDS_ON]: supabaseClient
 * [LAST_UPDATE]: 2026-03-20
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Extract leaderboard-relevant fields from a game state snapshot.
 */
function extractLeaderboardData(gameState) {
    const player = gameState?.player?.profile || {};
    const world = gameState?.world || {};
    const clinical = gameState?.clinical || {};

    return {
        score: Math.round(
            (player.reputation || 0) * 10 +
            (player.level || 1) * 50 +
            (player.knowledge || 0) * 2 +
            (world.day || 1) * 5
        ),
        day_reached: world.day || 1,
        reputation: player.reputation || 0,
        level: player.level || 1,
        accreditation: gameState?.publicHealth?.accreditation || 'Dasar',
        patients_treated: Array.isArray(clinical.history) ? clinical.history.length : 0,
    };
}

export const CloudSaveService = {
    /**
     * Save game state to cloud.
     * Also auto-updates the leaderboard entry.
     * @param {string} slotId - Save slot identifier
     * @param {object} gameState - Full Zustand game state
     * @returns {{ success, error }}
     */
    async saveToCloud(slotId, gameState) {
        if (!isSupabaseConfigured) {
            return { success: false, error: 'Offline mode' };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        const leaderboard = extractLeaderboardData(gameState);

        // Upsert save
        const { error: saveError } = await supabase
            .from('game_saves')
            .upsert({
                user_id: user.id,
                slot_id: slotId,
                game_state: gameState,
                day: leaderboard.day_reached,
                score: leaderboard.score,
                version: (gameState._saveVersion || 0) + 1,
                saved_at: new Date().toISOString(),
            }, { onConflict: 'user_id,slot_id' });

        if (saveError) {
            console.error('[CloudSave] Save failed:', saveError.message);
            return { success: false, error: saveError.message };
        }

        // Upsert leaderboard
        const profile = user.user_metadata || {};
        const { error: lbError } = await supabase
            .from('leaderboard')
            .upsert({
                user_id: user.id,
                nama: profile.nama || 'Unknown',
                nim: profile.nim || '',
                ...leaderboard,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (lbError) {
            console.warn('[CloudSave] Leaderboard update failed:', lbError.message);
            // Non-fatal: save still succeeded
        }

        return { success: true, error: null };
    },

    /**
     * Load game state from cloud.
     * @param {string} slotId - Save slot identifier
     * @returns {{ data, error }}
     */
    async loadFromCloud(slotId) {
        if (!isSupabaseConfigured) {
            return { data: null, error: 'Offline mode' };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('game_saves')
            .select('game_state, day, score, saved_at, version')
            .eq('user_id', user.id)
            .eq('slot_id', slotId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No save found — not an error
                return { data: null, error: null };
            }
            console.error('[CloudSave] Load failed:', error.message);
            return { data: null, error: error.message };
        }

        return { data, error: null };
    },

    /**
     * List all save slots for the current user.
     * @returns {{ saves: Array, error }}
     */
    async listSaves() {
        if (!isSupabaseConfigured) {
            return { saves: [], error: 'Offline mode' };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { saves: [], error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('game_saves')
            .select('slot_id, day, score, saved_at, version')
            .eq('user_id', user.id)
            .order('saved_at', { ascending: false });

        if (error) {
            console.error('[CloudSave] List failed:', error.message);
            return { saves: [], error: error.message };
        }

        return { saves: data || [], error: null };
    },

    /**
     * Delete a cloud save slot.
     * @param {string} slotId
     */
    async deleteSave(slotId) {
        if (!isSupabaseConfigured) return { success: false };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false };

        const { error } = await supabase
            .from('game_saves')
            .delete()
            .eq('user_id', user.id)
            .eq('slot_id', slotId);

        return { success: !error, error: error?.message };
    },
};
