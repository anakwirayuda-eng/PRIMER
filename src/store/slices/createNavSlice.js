/**
 * @reflection
 * [IDENTITY]: createNavSlice (CP2 extraction)
 * [PURPOSE]: Navigation & settings state slice
 * [STATE]: Production
 * [DEPENDS_ON]: persistenceHelpers, SoundManager
 * [LAST_UPDATE]: 2026-03-27
 */
import { soundManager } from '../../utils/SoundManager.js';
import { createInitialNavState } from '../helpers/persistenceHelpers.js';

export const createNavSlice = (set, _get) => ({
    // --- STATE ---
    nav: createInitialNavState(),

    // --- ACTIONS ---
    navActions: {
        setGameState: (state) => set((s) => ({ nav: { ...s.nav, gameState: state } })),
        setActivePage: (page) => set((s) => ({ nav: { ...s.nav, activePage: page } })),
        navigate: (page, params = {}) => set((s) => ({ nav: { ...s.nav, activePage: page, viewParams: params } })),
        toggleSidebar: () => set((s) => ({ nav: { ...s.nav, sidebarCollapsed: !s.nav.sidebarCollapsed } })),
        setSlotId: (id) => set((s) => ({ nav: { ...s.nav, currentSlotId: id } })),
        toggleKPI: () => set((s) => ({ nav: { ...s.nav, showKPIGlobal: !s.nav.showKPIGlobal } })),
        setShowKPIGlobal: (value) => set((s) => ({ nav: { ...s.nav, showKPIGlobal: value } })),
        resetNavigation: (overrides = {}) => set((s) => ({
            nav: createInitialNavState({
                sidebarCollapsed: s.nav.sidebarCollapsed,
                settings: s.nav.settings,
                ...overrides
            })
        })),
        updateSettings: (newSettings) => set((s) => {
            const updated = { ...s.nav.settings, ...newSettings };
            if (newSettings.volume !== undefined) {
                soundManager.setVolume(updated.volume);
            }
            return { nav: { ...s.nav, settings: updated } };
        }),
    },
});
