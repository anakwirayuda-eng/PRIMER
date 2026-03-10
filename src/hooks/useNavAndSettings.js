/**
 * @reflection
 * [IDENTITY]: useNavAndSettings
 * [PURPOSE]: React hook: useNavAndSettings — manages navigation/settings state and logic.
 * [STATE]: Experimental
 * [ANCHOR]: useNavAndSettings
 * [DEPENDS_ON]: SoundManager
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import { useState, useCallback } from 'react';
import { soundManager } from '../utils/SoundManager.js';

const INITIAL_SETTINGS = {
    theme: 'medika', // medika, emerald, midnight, military, premium
    fontSize: 'normal', // normal, large
    volume: 1.0, // 0.0 to 1.0
    autoSave: true
};

export function useNavAndSettings() {
    const [gameState, setGameState] = useState('opening'); // 'opening', 'slot_select', 'setup', 'playing', 'paused'
    const [activePage, setActivePage] = useState('dashboard');
    const [viewParams, setViewParams] = useState({});
    const [gameSpeed, setGameSpeed] = useState(1);
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const [currentSlotId, setCurrentSlotId] = useState(null);
    const [showKPIGlobal, setShowKPIGlobal] = useState(false);

    // Wiki State
    const [wikiMetric, setWikiMetric] = useState(null);
    const [isWikiOpen, setIsWikiOpen] = useState(false);

    const navigate = useCallback((page, params = {}) => {
        setActivePage(page);
        setViewParams(params);
    }, []);

    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };

            // Side effects for volume
            if (newSettings.volume !== undefined) {
                soundManager.setVolume(updated.volume);
            }

            return updated;
        });
    }, []);

    const openWiki = useCallback((key) => {
        setWikiMetric(key);
        setIsWikiOpen(true);
    }, []);

    const closeWiki = useCallback(() => {
        setIsWikiOpen(false);
    }, []);

    return {
        gameState, setGameState,
        activePage, setActivePage,
        viewParams, setViewParams,
        navigate,
        gameSpeed, setGameSpeed,
        settings, setSettings,
        updateSettings,
        currentSlotId, setCurrentSlotId,
        showKPIGlobal, setShowKPIGlobal,
        wikiMetric, isWikiOpen, openWiki, closeWiki,
        INITIAL_SETTINGS
    };
}
