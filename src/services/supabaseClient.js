/**
 * @reflection
 * [IDENTITY]: supabaseClient
 * [PURPOSE]: Singleton Supabase client initialization.
 * [STATE]: Production
 * [ANCHOR]: SUPABASE_CLIENT
 * [DEPENDS_ON]: @supabase/supabase-js
 * [LAST_UPDATE]: 2026-03-20
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SINGLETON_KEY = '__PRIMER_SUPABASE_CLIENT__';

/**
 * Whether Supabase is configured. When false, all services
 * gracefully degrade to offline/local-only mode.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn(
        '[Supabase] Not configured — running in offline mode. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable cloud features.'
    );
}

function getOrCreateSupabaseClient() {
    if (!isSupabaseConfigured) return null;

    if (!globalThis[SUPABASE_SINGLETON_KEY]) {
        globalThis[SUPABASE_SINGLETON_KEY] = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
        });
    }

    return globalThis[SUPABASE_SINGLETON_KEY];
}

export const supabase = getOrCreateSupabaseClient();
