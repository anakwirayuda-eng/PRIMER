import { produce } from 'immer';

/**
 * PRIMERA Transaction Guard
 * 💸 Ensures atomic commits across multiple state slices.
 */

/**
 * withTransaction - Wraps multiple store updates in a single atomic commit.
 * 
 * @param {Function} set - The Zustand set function
 * @param {Function} get - The Zustand get function 
 * @param {string} name - Transaction name for logging
 * @param {Function} fn - The function body containing multiple updates
 */
export function withTransaction(set, get, name, fn) {
    console.debug(`🎬 Starting Transaction: ${name}`);

    // 1. Capture Snapshot (for potential rollback)
    const snapshot = get();

    try {
        // 2. Perform updates using produce (Immer) for a draft-based atomic commit
        set(produce(state => {
            fn(state);
        }));

        console.debug(`✅ Transaction Committed: ${name}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Transaction Aborted: ${name}. Rolling back.`, error);

        // 3. Rollback (Set state back to snapshot)
        set(snapshot);

        return { success: false, error };
    }
}
