import { checkInvariants } from '../diagnostics/invariants.js';
import { guardStability } from './prophylaxis.js';

/**
 * PRIMERA Dispatch Guard (Choke Point)
 * 🔬 Proactively monitors store actions for stability and integrity.
 * 
 * @param {string} actionName - The name of the action being executed
 * @param {Function} actionFn - The actual action logic
 * @param {Object} options - Guard options (severity, invariants, etc.)
 * @returns {Function} Wrapped action
 */
export function dispatchGuard(actionName, actionFn, _options = {}) {
    return (set, get, _api) => (...args) => {
        // 1. Stability Check (Recursion/Oscillation)
        if (!guardStability(`ACTION_${actionName}`, 500, 3)) {
            console.error(`🛑 [dispatchGuard] Action ${actionName} blocked due to oscillation.`);
            return;
        }

        // 2. Pre-Action Execution
        // TODO: Start Transaction if needed

        // 3. Execute Action
        const result = actionFn(...args);

        // 4. Post-Action Integrity Check (Invariants)
        // We defer this slightly to let Zustand settle if needed, or check immediately for sync errors
        const state = get();
        const failures = checkInvariants(state);

        if (failures.length > 0) {
            console.error(`🚨 [dispatchGuard] Invariant Failure after ${actionName}:`, failures);
            // TODO: Trigger Freeze Protocol if severity is critical
        }

        return result;
    };
}
