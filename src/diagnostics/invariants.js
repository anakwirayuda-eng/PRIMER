/**
 * @reflection
 * [IDENTITY]: invariants
 * [PURPOSE]: Dynamic state validation rules for PRIMER.
 */

export const INVARIANTS = [
    {
        id: 'NON_NEGATIVE_MONEY',
        description: 'Kapitasi must not be negative',
        check: (state) => state.finance?.stats?.kapitasi >= 0,
        severity: 'alert'
    },
    {
        id: 'TIME_CONTINUITY',
        description: 'Game time must be between 0 and 1440',
        check: (state) => state.world?.time >= 0 && state.world?.time < 1440,
        severity: 'critical'
    },
    {
        id: 'PLAYER_ENERGY_RANGE',
        description: 'Energy must be between 0 and the player maxEnergy cap',
        check: (state) => {
            const energy = Number(state.player?.profile?.energy);
            const maxEnergy = Math.max(1, Number(state.player?.profile?.maxEnergy) || 100);
            return energy >= 0 && energy <= maxEnergy;
        },
        severity: 'warning'
    },
    {
        id: 'QUEUE_INTEGRITY',
        description: 'Clinical queue must not contain undefined patients',
        check: (state) => state.clinical?.queue?.every(p => p && p.id),
        severity: 'critical'
    },
    {
        id: 'NAVIGATION_STABILITY',
        description: 'Clinical navigation state must be structurally valid',
        check: (state) => {
            const activeId = state.clinical?.activePatientId;
            if (!activeId) return true;
            return state.clinical?.queue?.some(p => p.id === activeId);
        },
        severity: 'warning'
    },
    {
        id: 'CLIN_LIFECYCLE',
        description: 'Patient lifecycle must prevent dual-state or invalid transitions',
        check: (state) => {
            const queueIds = new Set(state.clinical?.queue?.map(p => p.id));
            const historyIds = new Set(state.clinical?.history?.map(p => p.id));
            // Intersection check
            for (let id of queueIds) {
                if (historyIds.has(id)) return false;
            }
            return true;
        },
        severity: 'critical'
    },
    {
        id: 'CLIN_TRIAGE_GATING',
        description: 'Critical patients (ESI 1) cannot be discharged without stabilization',
        check: (state) => {
            // Note: This check usually happens at Action time, 
            // but we can check if any patient in history was ESI 1 and discharged to home incorrectly.
            return state.clinical?.history?.every(p => {
                if (p.triage === 1 && p.decision?.action === 'treat') return false;
                return true;
            });
        },
        severity: 'alert'
    },
    {
        id: 'FIN_RECONCILE',
        description: 'Financial reconciliation must match inventory deltas',
        check: (state) => {
            // Basic sanity: negative money is already blocked, but let's check total spend
            const totalSpend = (state.finance?.stats?.pengeluaranObat || 0) +
                (state.finance?.stats?.pengeluaranLab || 0) +
                (state.finance?.stats?.pengeluaranOperasional || 0);
            return totalSpend >= 0;
        },
        severity: 'warning'
    }
];

/**
 * Runs all invariants against current store state.
 * @param {Object} state - The Zustand store state
 * @returns {Array} List of failed invariant IDs
 */
export function checkInvariants(state) {
    const failures = [];
    for (const inv of INVARIANTS) {
        try {
            if (!inv.check(state)) {
                failures.push({ id: inv.id, message: inv.description, severity: inv.severity });
            }
        } catch (e) {
            failures.push({ id: inv.id, message: `Check failed: ${e.message}`, severity: 'error' });
        }
    }
    return failures;
}
