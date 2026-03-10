/**
 * @reflection
 * [IDENTITY]: ThemeContext
 * [PURPOSE]: Unified theme provider — single source of truth for app theming.
 * [STATE]: Stable
 * [ANCHOR]: useTheme
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

/**
 * Theme definitions — each theme is self-contained.
 * `isDark` determines whether the `.dark` class is applied to <html>.
 * `sidebarGradient` provides the sidebar's Tailwind gradient classes.
 * `colors` are preview swatches for the settings UI.
 */
export const THEMES = {
    medika: {
        id: 'medika',
        name: 'Medika',
        description: 'Default dark — emerald medical HUD',
        isDark: true,
        cssClass: null,             // default theme, no extra class
        sidebarGradient: 'from-emerald-900 to-teal-900',
        colors: {
            bg: '#0f172a',          // slate-900
            panel: '#1e293b',       // slate-800
            primary: '#059669',     // emerald-600
            accent: '#2563eb',      // blue-600
            text: '#f8fafc',        // slate-50
        },
    },
    emerald: {
        id: 'emerald',
        name: 'Emerald Chat',
        description: 'Light mode — warm beige, WhatsApp-inspired',
        isDark: false,
        cssClass: 'theme-emerald',
        sidebarGradient: 'from-teal-800 to-emerald-900',
        colors: {
            bg: '#e5ddd5',          // warm beige
            panel: '#ffffff',
            primary: '#008069',     // whatsapp green
            accent: '#075e54',      // darker green
            text: '#111827',        // gray-900
        },
    },
    midnight: {
        id: 'midnight',
        name: 'Neon Midnight',
        description: 'Dark cyber — amber & violet neon',
        isDark: true,
        cssClass: 'theme-midnight',
        sidebarGradient: 'from-slate-900 to-indigo-950',
        colors: {
            bg: '#0f172a',          // slate-900
            panel: '#1e293b',       // slate-800
            primary: '#f59e0b',     // amber-500
            accent: '#8b5cf6',      // violet-500
            text: '#f8fafc',        // slate-50
        },
    },
    military: {
        id: 'military',
        name: 'Tactical',
        description: 'Dark rugged — olive drab, khaki accents',
        isDark: true,
        cssClass: 'theme-military',
        sidebarGradient: 'from-[#2b2f21] to-[#3a4030]',
        colors: {
            bg: '#2b2f21',          // charcoal olive
            panel: '#3a4030',       // dark forest
            primary: '#738c4b',     // army green
            accent: '#c2b280',      // sand / khaki
            text: '#f1f5f1',        // fog
        },
    },
    premium: {
        id: 'premium',
        name: 'Premium Glass',
        description: 'Dark luxury — frosted glass, sky-blue glow',
        isDark: true,
        cssClass: 'theme-premium',
        sidebarGradient: 'from-sky-900/40 to-indigo-900/40 backdrop-blur-xl',
        colors: {
            bg: '#020617',          // darkest slate
            panel: '#1e293b',       // frosted slate
            primary: '#38bdf8',     // sky-400
            accent: '#f0abfc',      // pink-400
            text: '#f0f9ff',        // clear blue-white
        },
    },
};

const THEME_IDS = Object.keys(THEMES);
const ALL_CSS_CLASSES = THEME_IDS
    .map(id => THEMES[id].cssClass)
    .filter(Boolean);

// eslint-disable-next-line react-refresh/only-export-components -- Standard context pattern: hook + provider
export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [themeId, setThemeId] = useState(() => {
        const saved = localStorage.getItem('primer_theme');
        if (saved && THEMES[saved]) return saved;
        return 'medika';
    });

    const theme = THEMES[themeId];

    // Apply classes to <html> whenever theme changes
    useEffect(() => {
        const root = document.documentElement;

        // Dark class
        if (theme.isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Theme CSS class (for CSS custom property sets)
        ALL_CSS_CLASSES.forEach(cls => root.classList.remove(cls));
        if (theme.cssClass) {
            root.classList.add(theme.cssClass);
        }

        // Persist
        localStorage.setItem('primer_theme', themeId);
    }, [themeId, theme]);

    const value = useMemo(() => ({
        themeId,
        theme,
        isDark: theme.isDark,
        setThemeId: (id) => {
            if (THEMES[id]) setThemeId(id);
        },
        // Back-compat: toggleTheme swaps between medika (dark) and emerald (light)
        toggleTheme: () => setThemeId(prev => prev === 'emerald' ? 'medika' : 'emerald'),
    }), [themeId, theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
