/**
 * @reflection
 * [IDENTITY]: ContentService
 * [PURPOSE]: Dynamic content loading from Supabase (CMS without redeploy).
 * [STATE]: Production
 * [ANCHOR]: CONTENT_SERVICE
 * [DEPENDS_ON]: supabaseClient
 * [LAST_UPDATE]: 2026-03-20
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

/** Local cache to avoid redundant fetches */
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

export const ContentService = {
    /**
     * Get content items by type.
     * @param {string} contentType - e.g. 'case', 'announcement', 'config'
     * @returns {{ data: Array, error }}
     */
    async getContent(contentType) {
        if (!isSupabaseConfigured) {
            return { data: [], error: 'Offline mode' };
        }

        const cacheKey = `content:${contentType}`;
        const cached = getCached(cacheKey);
        if (cached) return { data: cached, error: null };

        const { data, error } = await supabase
            .from('content')
            .select('id, data, version, updated_at')
            .eq('content_type', contentType)
            .eq('is_active', true)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('[Content] Fetch failed:', error.message);
            return { data: [], error: error.message };
        }

        cache.set(cacheKey, { data, timestamp: Date.now() });
        return { data: data || [], error: null };
    },

    /**
     * Get a single content item by ID.
     * @param {string} id
     * @returns {{ data: object|null, error }}
     */
    async getContentById(id) {
        if (!isSupabaseConfigured) return { data: null, error: 'Offline' };

        const cached = getCached(`content:id:${id}`);
        if (cached) return { data: cached, error: null };

        const { data, error } = await supabase
            .from('content')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return { data: null, error: error.message };

        cache.set(`content:id:${id}`, { data, timestamp: Date.now() });
        return { data, error: null };
    },

    /**
     * Check if any content has been updated since a given version.
     * Useful for "check for updates" flow.
     * @param {string} contentType
     * @param {number} currentVersion
     * @returns {{ hasUpdate: boolean, latestVersion: number }}
     */
    async checkForUpdates(contentType, currentVersion = 0) {
        if (!isSupabaseConfigured) return { hasUpdate: false, latestVersion: currentVersion };

        const { data, error } = await supabase
            .from('content')
            .select('version')
            .eq('content_type', contentType)
            .eq('is_active', true)
            .order('version', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) return { hasUpdate: false, latestVersion: currentVersion };
        return {
            hasUpdate: data.version > currentVersion,
            latestVersion: data.version,
        };
    },

    /**
     * Clear the local cache (force re-fetch on next call).
     */
    clearCache() {
        cache.clear();
    },
};
