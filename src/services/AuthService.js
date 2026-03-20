/**
 * @reflection
 * [IDENTITY]: AuthService
 * [PURPOSE]: Authentication wrapper using Supabase Auth with NIM-based login.
 * [STATE]: Production
 * [ANCHOR]: AUTH_SERVICE
 * [DEPENDS_ON]: supabaseClient
 * [LAST_UPDATE]: 2026-03-20
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Convert NIM to a pseudo-email for Supabase Auth
 * (Supabase requires email format for email/password auth)
 */
const nimToEmail = (nim) => `${nim}@students.primer-app.com`;

export const AuthService = {
    /**
     * Register a new student account.
     * @param {string} nim - Student NIM
     * @param {string} password - Password (min 6 chars)
     * @param {string} nama - Full name
     * @param {number} [angkatan] - Graduating class year
     * @returns {{ user, error }}
     */
    async signUp(nim, password, nama, angkatan = null) {
        if (!isSupabaseConfigured) {
            return { user: null, error: { message: 'Supabase belum dikonfigurasi.' } };
        }

        const { data, error } = await supabase.auth.signUp({
            email: nimToEmail(nim),
            password,
            options: {
                data: { nim, nama, role: 'student', angkatan },
                emailRedirectTo: undefined,
            },
        });

        if (error) return { user: null, error };
        return { user: data.user, error: null };
    },

    /**
     * Sign in with NIM + password.
     */
    async signIn(nim, password) {
        if (!isSupabaseConfigured) {
            return { user: null, error: { message: 'Supabase belum dikonfigurasi.' } };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: nimToEmail(nim),
            password,
        });

        if (error) return { user: null, error };
        return { user: data.user, error: null };
    },

    /**
     * Sign out the current user.
     */
    async signOut() {
        if (!isSupabaseConfigured) return;
        await supabase.auth.signOut();
    },

    /**
     * Get the currently authenticated user (null if not logged in).
     */
    async getUser() {
        if (!isSupabaseConfigured) return null;
        const { data } = await supabase.auth.getUser();
        return data?.user ?? null;
    },

    /**
     * Get the user's profile from the profiles table.
     */
    async getProfile() {
        if (!isSupabaseConfigured) return null;
        const user = await this.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('[AuthService] getProfile error:', error.message);
            return null;
        }
        return data;
    },

    /**
     * Subscribe to auth state changes.
     * @param {Function} callback - Receives (event, session)
     * @returns {{ data: { subscription } }}
     */
    onAuthStateChange(callback) {
        if (!isSupabaseConfigured) return { data: { subscription: { unsubscribe: () => {} } } };
        return supabase.auth.onAuthStateChange(callback);
    },

    /**
     * Check if Supabase is available.
     */
    isOnline() {
        return isSupabaseConfigured;
    },
};
