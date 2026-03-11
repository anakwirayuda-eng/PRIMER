/**
 * @reflection
 * [IDENTITY]: GameContext (The Unified Interface)
 * [PURPOSE]: Provides a single entry point for combined game state and actions.
 * [STATE]: Stable (Post-Refactor v4.1)
 * [ANCHOR]: GameProvider
 * [LAST_UPDATE]: 2026-02-14
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore.js';
import { useShallow } from 'zustand/react/shallow';
import { selectDerivedFinance, selectPlayerStats, selectClinical, selectBuffs } from '../store/selectors.js';
import { useGameLoop } from '../hooks/useGameLoop.js';
import { assertGameContextContract } from './contracts/gameContext.contract.js';
import { soundManager } from '../utils/SoundManager.js';

const GameContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components -- Standard context pattern: hook + provider
export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({ children }) {
    // --- Store Integration ---
    const nav = useGameStore(useShallow(s => s.nav));
    const navActions = useGameStore(useShallow(s => s.navActions));
    const world = useGameStore(useShallow(s => s.world));
    const worldActions = useGameStore(useShallow(s => s.worldActions));
    const player = useGameStore(useShallow(selectPlayerStats));
    const playerActions = useGameStore(useShallow(s => s.playerActions));
    const finance = useGameStore(useShallow(selectDerivedFinance));
    const financeActions = useGameStore(useShallow(s => s.financeActions));
    const clinical = useGameStore(useShallow(selectClinical));
    const clinicalActions = useGameStore(useShallow(s => s.clinicalActions));
    const publicHealth = useGameStore(useShallow(s => s.publicHealth));
    const publicHealthActions = useGameStore(useShallow(s => s.publicHealthActions));
    const staff = useGameStore(useShallow(s => s.staff));
    const staffActions = useGameStore(useShallow(s => s.staffActions));
    const meta = useGameStore(useShallow(s => s.meta));
    const metaActions = useGameStore(useShallow(s => s.metaActions));

    // Core Actions (Now delegated to Store)
    const { saveGame, loadGame, startNewGame, nextDay } = useGameStore(useShallow(s => s.actions));

    // Derived State
    const buffs = useGameStore(useShallow(selectBuffs));

    // --- Life Cycle Management ---
    useGameLoop({
        gameState: nav.gameState,
        gameSpeed: world.speed || 1, // Fix: world.speed instead of nav.gameSpeed
        gameOver: clinical.gameOver,
        time: world.time,
        day: world.day,
        buffs,
        villageData: publicHealth.villageData,
        activeOutbreaks: publicHealth.activeOutbreaks,
        facilities: finance.facilities,
        skills: player.skills,
        playerStats: player,
        nextDay,
        setPlayerStats: playerActions.setPlayerStats,
        setGameOver: clinicalActions.setGameOver,
        setTime: worldActions.setTime,
        processTick: clinicalActions.processDailyTick || clinicalActions.processTick
    });

    const value = useMemo(() => {
        // Prepare base object - Merging store states and actions
        // SPREAD SLICES for legacy compatibility (destructuring at top level)
        const base = {
            ...nav, ...navActions,
            ...world, ...worldActions,
            ...player, ...playerActions,
            ...finance, ...financeActions,
            ...clinical, ...clinicalActions,
            ...publicHealth, ...publicHealthActions,
            ...staff, ...staffActions,
            ...meta, ...metaActions,
            buffs,
            saveGame, loadGame, startNewGame, nextDay,
            logout: () => { saveGame(nav.currentSlotId); navActions.setGameState('slot_select'); navActions.setSlotId(null); },
            restartGame: () => window.location.reload()
        };

        // Compatibility aliases for legacy destructuring
        const value = {
            ...base,
            derivedKpis: finance, // selectDerivedFinance already returns the flat KPIs
            playerStats: player,
            playerProfile: player,
            setPlayerStats: playerActions.setPlayerStats,
            setPlayerProfile: (nextProfile) => {
                const resolvedProfile = typeof nextProfile === 'function' ? nextProfile(player) : nextProfile;
                playerActions.updateProfile(resolvedProfile);
            },
            addXp: playerActions.gainXp,
            soundManager,
            viewParams: nav.viewParams,
            navigate: navActions.navigate,
            gameState: nav.gameState,
            setGameState: navActions.setGameState,
            gameSpeed: world.speed || 1,
            setGameSpeed: worldActions.setGameSpeed,
            time: world.time,
            day: world.day,
            setTime: worldActions.setTime,
            setDay: worldActions.setDay,
            reputation: clinical.reputation,
            activePatientId: clinical.activePatientId,
            admitPatient: (id) => clinicalActions.setActivePatientId(id),
            admitEmergencyPatient: (id) => clinicalActions.setActiveEmergencyId(id),
            villageData: publicHealth.villageData,
            setVillageData: publicHealthActions.setVillageData,
            activeEvent: null, // Legacy placeholder
            energy: player.energy,
            spirit: player.spirit,
            morningStatus: player.morningStatus,
            clearMorningStatus: playerActions.clearMorningStatus,
            takeLoungeRest: playerActions.takeLoungeRest,
            loungeRestCount: player.loungeRestCount,
            stats: finance, // selectDerivedFinance already spreads finance.stats
            setStats: financeActions.setStats,
            activeReferralLog: clinical.activeReferralLog || [],
            activeReferral: clinical.activeReferral,
            prbQueue: clinical.prbQueue || [],
            outbreakNotification: publicHealth.outbreakNotification,
            dismissOutbreakNotification: publicHealthActions.dismissOutbreakNotification
        };

        // Contract Assertion (must run before return)
        assertGameContextContract(value, 'GameContext(Provider)');

        return value;
    }, [nav, navActions, world, worldActions, player, playerActions, finance, financeActions, clinical, clinicalActions, publicHealth, publicHealthActions, staff, staffActions, meta, metaActions, buffs, saveGame, loadGame, startNewGame, nextDay]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}
