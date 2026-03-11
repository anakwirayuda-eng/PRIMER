import { checkInvariants } from '../diagnostics/invariants.js';
import { guardStability } from './prophylaxis.js';

const DEFAULT_FREEZE_SEVERITIES = new Set(['critical', 'error']);

function toMessage(value) {
    if (value instanceof Error) return value.message;
    if (typeof value === 'string') return value;
    return '';
}

export function buildRuntimeTrap(actionName, details = {}) {
    const failures = Array.isArray(details.failures) ? details.failures : [];
    const failureSummary = failures
        .slice(0, 2)
        .map((failure) => failure.id || failure.message)
        .filter(Boolean)
        .join(', ');
    const errorMessage = toMessage(details.error);

    const segments = [details.reason];
    if (failureSummary) {
        segments.push(`Invariant: ${failureSummary}.`);
    }
    if (errorMessage) {
        segments.push(`Error: ${errorMessage}.`);
    }

    return {
        active: true,
        actionName,
        phase: details.phase || 'runtime',
        failures,
        occurredAt: Date.now(),
        message: segments.filter(Boolean).join(' ').trim() || 'Anomali runtime terdeteksi. Sistem masuk mode aman.'
    };
}

export function triggerFreezeProtocol(setState, getState, trap) {
    if (typeof setState !== 'function' || typeof getState !== 'function' || !trap) {
        return trap;
    }

    const currentTrap = getState()?.meta?.runtimeTrap;
    if (currentTrap?.active && currentTrap.actionName === trap.actionName && currentTrap.phase === trap.phase) {
        return currentTrap;
    }

    setState((state) => ({
        nav: { ...state.nav, gameState: 'paused' },
        world: { ...state.world, isPaused: true },
        clinical: {
            ...state.clinical,
            gameOver: {
                type: 'runtime_trap',
                reason: trap.message
            }
        },
        meta: {
            ...state.meta,
            runtimeTrap: trap
        }
    }));

    console.error(`[dispatchGuard] Freeze protocol armed by ${trap.actionName}`, trap);
    return trap;
}

export function dispatchGuard(actionName, actionFn, options = {}) {
    const {
        getState,
        setState,
        threshold = 500,
        maxBurst = 3,
        enableStability = true,
        allowDuringFreeze = false,
        freezeOnInvariant = true,
        freezeOnError = true,
        freezeSeverities = DEFAULT_FREEZE_SEVERITIES
    } = options;

    return (...args) => {
        const currentState = typeof getState === 'function' ? getState() : null;
        if (!allowDuringFreeze && currentState?.meta?.runtimeTrap?.active) {
            console.warn(`[dispatchGuard] ${actionName} blocked while runtime trap is active.`);
            return;
        }

        if (enableStability && !guardStability(`ACTION_${actionName}`, threshold, maxBurst)) {
            const trap = buildRuntimeTrap(actionName, {
                phase: 'stability',
                reason: `${actionName} diblok karena pola osilasi terdeteksi.`
            });
            triggerFreezeProtocol(setState, getState, trap);
            return;
        }

        try {
            const result = actionFn(...args);

            if (freezeOnInvariant && typeof getState === 'function') {
                const failures = checkInvariants(getState());
                const criticalFailures = failures.filter((failure) => freezeSeverities.has(failure.severity));
                if (criticalFailures.length > 0) {
                    const trap = buildRuntimeTrap(actionName, {
                        phase: 'invariant',
                        reason: `Invariant kritis gagal setelah ${actionName}.`,
                        failures: criticalFailures
                    });
                    triggerFreezeProtocol(setState, getState, trap);
                }
            }

            return result;
        } catch (error) {
            console.error(`[dispatchGuard] ${actionName} threw`, error);
            if (freezeOnError) {
                const trap = buildRuntimeTrap(actionName, {
                    phase: 'exception',
                    reason: `${actionName} memicu exception runtime.`,
                    error
                });
                triggerFreezeProtocol(setState, getState, trap);
            }
            return;
        }
    };
}

export function guardActionGroup(groupName, actionGroup, resolveOptions = () => ({})) {
    const guardedGroup = {};
    for (const [actionName, actionFn] of Object.entries(actionGroup)) {
        guardedGroup[actionName] = typeof actionFn === 'function'
            ? dispatchGuard(`${groupName}.${actionName}`, actionFn, resolveOptions(actionName, actionFn))
            : actionFn;
    }
    return guardedGroup;
}
