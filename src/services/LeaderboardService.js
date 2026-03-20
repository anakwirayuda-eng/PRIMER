/**
 * @reflection
 * [IDENTITY]: LeaderboardService
 * [PURPOSE]: Real-time leaderboard using Supabase Realtime subscriptions.
 * [STATE]: Production
 * [ANCHOR]: LEADERBOARD_SERVICE
 * [DEPENDS_ON]: supabaseClient
 * [LAST_UPDATE]: 2026-03-20
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

export const LeaderboardService = {
    /**
     * Fetch the current leaderboard, sorted by score descending.
     * @param {number} limit - Max rows to return (default 50)
     * @returns {{ data: Array, error }}
     */
    async getLeaderboard(limit = 50) {
        if (!isSupabaseConfigured) {
            return { data: [], error: 'Offline mode' };
        }

        const { data, error } = await supabase
            .from('leaderboard')
            .select('nama, nim, score, day_reached, reputation, level, accreditation, patients_treated, updated_at')
            .order('score', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[Leaderboard] Fetch failed:', error.message);
            return { data: [], error: error.message };
        }

        return { data: data || [], error: null };
    },

    /**
     * Subscribe to real-time leaderboard changes.
     * @param {Function} callback - Receives updated leaderboard array
     * @returns {Function} unsubscribe function
     */
    subscribeToLeaderboard(callback) {
        if (!isSupabaseConfigured) return () => {};

        const channel = supabase
            .channel('leaderboard-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'leaderboard',
                },
                async () => {
                    // Re-fetch the full sorted leaderboard on any change
                    const { data } = await this.getLeaderboard();
                    callback(data);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },

    /**
     * Get the current user's rank.
     * @returns {{ rank: number|null, entry: object|null, error }}
     */
    async getMyRank() {
        if (!isSupabaseConfigured) return { rank: null, entry: null, error: 'Offline' };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { rank: null, entry: null, error: 'Not authenticated' };

        // Fetch all scores to compute rank (efficient for ≤50 users)
        const { data } = await this.getLeaderboard();
        const idx = data.findIndex(e => e.nim === user.user_metadata?.nim);

        if (idx === -1) return { rank: null, entry: null, error: null };
        return { rank: idx + 1, entry: data[idx], error: null };
    },
};
