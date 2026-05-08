/**
 * @reflection
 * [IDENTITY]: useGameStore (The New Central Brain)
 * [PURPOSE]: Unified state management replacing Context API frenzy.
 * [STATE]: Initialization
 * [ARCHITECT]: Megalog v4.0 Pattern
 * [DEPENDS_ON]: zustand
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { guardActionGroup } from '../utils/dispatchGuard.js';
import { CURRENT_SAVE_VERSION } from '../utils/savePayload.js';

// ═══════════════════════════════════════════════════════════════
// CP1 EXTRACTED HELPERS — Pure functions moved to store/helpers/
// ═══════════════════════════════════════════════════════════════
import { isPlainObject } from './helpers/storeUtils.js';
import { sanitizePlayerProfile } from './helpers/playerHelpers.js';
import {
    normalizePersistedWorld, createInitialMetaState, createInitialPublicHealthState, createInitialStaffState,
    createInitialClinicalState,
    createInitialFinanceState, INITIAL_NAV_SETTINGS,
    mergePersistedNav, mergePersistedFinance, mergePersistedPublicHealth, mergePersistedStaff, mergePersistedClinical, mergePersistedMeta,
    reconcileClinicalReferralLog
} from './helpers/persistenceHelpers.js';

// ═══════════════════════════════════════════════════════════════
// CP2 EXTRACTED SLICES
// ═══════════════════════════════════════════════════════════════
import { createNavSlice } from './slices/createNavSlice.js';
import { createWorldSlice } from './slices/createWorldSlice.js';
import { createStaffSlice } from './slices/createStaffSlice.js';
import { createPlayerSlice } from './slices/createPlayerSlice.js';
import { createFinanceSlice } from './slices/createFinanceSlice.js';
import { createMetaSlice } from './slices/createMetaSlice.js';
import { createPublicHealthSlice } from './slices/createPublicHealthSlice.js';
import { createClinicalSlice } from './slices/createClinicalSlice.js';
import { createOrchestratorSlice } from './slices/createOrchestratorSlice.js';

const ACTION_GROUP_NAMES = [
    'navActions',
    'worldActions',
    'playerActions',
    'financeActions',
    'publicHealthActions',
    'staffActions',
    'clinicalActions',
    'metaActions',
    'actions'
];

const ACTIONS_ALLOWED_DURING_RUNTIME_TRAP = new Set([
    'clinicalActions.dismissWarning',
    'actions.saveGame',
    'actions.loadGame',
    'actions.startNewGame',
    'actions.resetGame'
]);

const ACTIONS_SKIP_STABILITY_GUARD = new Set([
    'actions.saveGame',
    'actions.loadGame',
    'actions.startNewGame',
    'actions.resetGame',
    'clinicalActions.dismissWarning'
]);

const ACTIONS_SKIP_INVARIANT_RECHECK = new Set([
    'actions.saveGame',
    'clinicalActions.dismissWarning'
]);

function shouldEnableActionStability(fullName, actionName) {
    if (ACTIONS_SKIP_STABILITY_GUARD.has(fullName)) return false;
    return !/^(set|open|close|toggle|clear)/.test(actionName);
}

function guardStoreActions(store, set, get) {
    for (const groupName of ACTION_GROUP_NAMES) {
        if (!store[groupName] || typeof store[groupName] !== 'object') continue;

        store[groupName] = guardActionGroup(groupName, store[groupName], (actionName) => {
            const fullName = `${groupName}.${actionName}`;
            return {
                getState: get,
                setState: set,
                allowDuringFreeze: ACTIONS_ALLOWED_DURING_RUNTIME_TRAP.has(fullName),
                enableStability: shouldEnableActionStability(fullName, actionName),
                freezeOnInvariant: !ACTIONS_SKIP_INVARIANT_RECHECK.has(fullName),
                threshold: fullName === 'actions.nextDay' ? 2000 : 500,
                maxBurst: fullName === 'actions.nextDay' ? 2 : 3
            };
        });
    }

    return store;
}


export const useGameStore = create(
    devtools(
        persist(
            (set, get) => {
                const store = {
                // --- SLICE: NAV & SETTINGS (CP2 extracted) ---
                ...createNavSlice(set, get),

                // --- SLICE: WORLD (CP2 extracted) ---
                ...createWorldSlice(set, get),

                // --- SLICE: PLAYER (CP2 extracted) ---
                ...createPlayerSlice(set, get),

                // --- SLICE: FINANCE (CP2 extracted) ---
                ...createFinanceSlice(set, get),

                // --- SLICE: PUBLIC HEALTH (CP2 extracted) ---
                ...createPublicHealthSlice(set, get),

                // --- SLICE: STAFF (CP2 extracted) ---
                ...createStaffSlice(set, get),


                // --- SLICE: CLINICAL (CP2 extracted) ---
                ...createClinicalSlice(set, get),

                // --- SLICE: META (CP2 extracted) ---
                ...createMetaSlice(set, get),


                // --- SLICE: ORCHESTRATOR (CP2 extracted) ---
                ...createOrchestratorSlice(set, get),
            };

                return guardStoreActions(store, set, get);
            },
            {
                name: 'primer_gamestate_v4',
                merge: (persistedState, currentState) => {
                    const nextState = isPlainObject(persistedState) ? persistedState : {};
                    const mergedNav = mergePersistedNav(nextState.nav, currentState.nav);
                    const mergedWorld = nextState.world
                        ? { ...currentState.world, ...normalizePersistedWorld(nextState.world) }
                        : currentState.world;
                    const mergedClinical = nextState.clinical
                        ? mergePersistedClinical(nextState.clinical, currentState.clinical)
                        : currentState.clinical;
                    const mergedMeta = nextState.meta
                        ? mergePersistedMeta(nextState.meta, currentState.meta, mergedWorld.day)
                        : mergePersistedMeta(currentState.meta, currentState.meta, mergedWorld.day);

                    return {
                        ...currentState,
                        ...nextState,
                        world: mergedWorld,
                        player: nextState.player
                            ? {
                                ...currentState.player,
                                ...nextState.player,
                                profile: sanitizePlayerProfile({
                                    ...currentState.player.profile,
                                    ...(nextState.player.profile || {})
                                })
                            }
                            : currentState.player,
                        finance: nextState.finance
                            ? mergePersistedFinance(nextState.finance, currentState.finance)
                            : currentState.finance,
                        publicHealth: nextState.publicHealth
                            ? mergePersistedPublicHealth(nextState.publicHealth, currentState.publicHealth)
                            : currentState.publicHealth,
                        staff: nextState.staff
                            ? mergePersistedStaff(nextState.staff, currentState.staff)
                            : currentState.staff,
                        nav: mergedNav,
                        clinical: reconcileClinicalReferralLog(mergedClinical, mergedWorld),
                        meta: mergedMeta
                    };
                },
                partialize: (state) => {
                    const normalizedWorld = normalizePersistedWorld(state.world);
                    const mergedClinical = mergePersistedClinical(state.clinical, createInitialClinicalState());
                    const mergedMeta = mergePersistedMeta(
                        { ...state.meta, saveVersion: CURRENT_SAVE_VERSION },
                        createInitialMetaState(normalizedWorld.day),
                        normalizedWorld.day
                    );

                    return {
                        nav: {
                            settings: {
                                ...INITIAL_NAV_SETTINGS,
                                ...state.nav.settings
                            }
                        },
                        world: normalizedWorld,
                        player: {
                            ...state.player,
                            profile: sanitizePlayerProfile(state.player.profile)
                        },
                        finance: mergePersistedFinance(state.finance, createInitialFinanceState()),
                        publicHealth: mergePersistedPublicHealth(state.publicHealth, createInitialPublicHealthState()),
                        staff: mergePersistedStaff(state.staff, createInitialStaffState()),
                        clinical: reconcileClinicalReferralLog(mergedClinical, normalizedWorld),
                        meta: mergedMeta
                    };
                } }
        )
    )
);
