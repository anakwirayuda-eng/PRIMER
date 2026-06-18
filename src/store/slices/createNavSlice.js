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
        setActivePage: (page) => set((s) => {
            if (s.nav.activePage !== page) soundManager.playSceneEnter?.();
            return { nav: { ...s.nav, activePage: page } };
        }),
        navigate: (page, params = {}) => set((s) => {
            if (s.nav.activePage !== page) soundManager.playSceneEnter?.();
            return { nav: { ...s.nav, activePage: page, viewParams: params } };
        }),
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
            if (newSettings.volume !== undefined) soundManager.setMasterVolume(updated.volume);
            if (newSettings.bgmVolume !== undefined) soundManager.setBGMVolume(updated.bgmVolume);
            if (newSettings.sfxVolume !== undefined) soundManager.setSfxVolume(updated.sfxVolume);
            if (newSettings.ambientVolume !== undefined) soundManager.setAmbientVolume(updated.ambientVolume);
            if (newSettings.focusMode !== undefined) soundManager.setFocusMode(updated.focusMode);
            if (newSettings.reducedAudio !== undefined) soundManager.setReducedAudio(updated.reducedAudio);
            if (newSettings.muted !== undefined) soundManager.setMuted(updated.muted);
            return { nav: { ...s.nav, settings: updated } };
        }),
    },
});
