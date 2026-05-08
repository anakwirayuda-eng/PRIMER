/**
 * @reflection
 * [IDENTITY]: AuthContext
 * [PURPOSE]: React context providing authentication state and user info globally.
 * [STATE]: Production
 * [ANCHOR]: AUTH_CONTEXT
 * [DEPENDS_ON]: AuthService
 * [LAST_UPDATE]: 2026-03-20
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/AuthService';
import { isSupabaseConfigured, suspendSupabaseAuthForOfflineMode } from '../services/supabaseClient';
import { isOfflineModeEnabled, setOfflineModeEnabled } from '../services/offlineMode';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [offlineMode, setOfflineMode] = useState(() => isOfflineModeEnabled());
    const [loading, setLoading] = useState(() => isSupabaseConfigured && !isOfflineModeEnabled());
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        if (offlineMode || !isSupabaseConfigured) {
            // Offline mode — skip auth completely
            return;
        }

        let mounted = true;

        const checkSession = async () => {
            const currentUser = await AuthService.getUser();
            if (mounted && currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
                const userProfile = await AuthService.getProfile();
                if (mounted) setProfile(userProfile);
            }
            if (mounted) setLoading(false);
        };

        checkSession();

        // Listen for auth changes (login/logout)
        const { data: { subscription } } = AuthService.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;

                if (event === 'SIGNED_IN' && session?.user) {
                    setUser(session.user);
                    setIsAuthenticated(true);
                    const userProfile = await AuthService.getProfile();
                    if (mounted) setProfile(userProfile);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setProfile(null);
                    setIsAuthenticated(false);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [offlineMode]);

    const login = useCallback((userData) => {
        setOfflineModeEnabled(false);
        setOfflineMode(false);
        setLoading(false);
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    const loginOffline = useCallback(async () => {
        // Allow playing without auth
        setOfflineModeEnabled(true);
        setOfflineMode(true);
        await suspendSupabaseAuthForOfflineMode();
        setLoading(false);
        setIsAuthenticated(true);
        setUser(null);
        setProfile(null);
    }, []);

    const logout = useCallback(async () => {
        await AuthService.signOut();
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
    }, []);

    const value = {
        user,
        profile,
        loading,
        offlineMode,
        isAuthenticated,
        isOnline: !offlineMode && isSupabaseConfigured && !!user,
        login,
        loginOffline,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
