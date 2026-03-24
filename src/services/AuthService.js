/**
 * @reflection
 * [IDENTITY]: AuthService
 * [PURPOSE]: Authentication wrapper using Supabase Auth with email-based login.
 * [STATE]: Production
 * [ANCHOR]: AUTH_SERVICE
 * [DEPENDS_ON]: supabaseClient
 * [LAST_UPDATE]: 2026-03-25
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

export const AuthService = {
    /**
     * Register a new user account.
     * @param {string} email - User email
     * @param {string} password - Password (min 6 chars)
     * @param {string} nama - Full name
     * @param {number} [angkatan] - Graduating class year
     * @returns {{ user, error }}
     */
    async signUp(email, password, nama, angkatan = null) {
        if (!isSupabaseConfigured) {
            return { user: null, error: { message: 'Supabase belum dikonfigurasi.' } };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { nama, role: 'student', angkatan },
                emailRedirectTo: undefined,
            },
        });

        if (error) return { user: null, error };
        return { user: data.user, error: null };
    },

    /**
     * Sign in with email + password.
     */
    async signIn(email, password) {
        if (!isSupabaseConfigured) {
            return { user: null, error: { message: 'Supabase belum dikonfigurasi.' } };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
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
