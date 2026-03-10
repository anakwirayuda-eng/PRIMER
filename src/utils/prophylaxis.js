/**
 * PRIMERA Prophylaxis System
 * 🛡️ Anti-Oscillation & Stability Guard
 * 
 * Used to detect and report recursive state resets or infinite layout loops.
 */

const stabilityRegistry = new Map();

/**
 * Track a state transition or effect execution to detect rapid "oscillation".
 * @param {string} key - Unique identifier for the operation (e.g., 'EMR_TAB_RESET')
 * @param {number} threshold - Min ms between executions (default 1000)
 * @param {number} maxBurst - Max allowed executions within the window
 */
export function guardStability(key, threshold = 1000, maxBurst = 3) {
    const now = Date.now();
    const entry = stabilityRegistry.get(key) || { lastRun: 0, burstCount: 0, windowStart: now };

    if (now - entry.windowStart > threshold) {
        // Reset window
        entry.windowStart = now;
        entry.burstCount = 1;
    } else {
        entry.burstCount++;
    }

    entry.lastRun = now;
    stabilityRegistry.set(key, entry);

    if (entry.burstCount > maxBurst) {
        const errorMsg = `🚨 PRIMERA STABILITY FAILURE: [${key}] is oscillating! (Phase 12 Prophylaxis Trap)`;
        console.error(errorMsg);

        // In a real environment, we'd send this to a logging endpoint.
        // For this local engine-ification, we'll try to persist it if fs is available (node environment tests)
        // or just rely on console scraping for the watchdog if we run E2E.
        return false;
    }

    return true;
}

/**
 * Reset the guard for a specific key (e.g. on legal patient change)
 */
export function clearStability(key) {
    stabilityRegistry.delete(key);
}
