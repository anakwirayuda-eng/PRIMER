/**
 * @reflection
 * [IDENTITY]: validation
 * [PURPOSE]: Runtime invariants and safe wrappers for asynchronous/event-based logic.
 * [STATE]: Stable
 * [LAST_UPDATE]: 2026-02-14
 */

import { z } from 'zod';

/**
 * Ensures a value is a finite number. Prevents NaN/Infinity drift.
 */
export function assertFinite(name, v) {
    if (typeof v !== 'number' || !Number.isFinite(v)) {
        throw new Error(`[INVARIANT] ${name} invalid: ${v}`);
    }
}

/**
 * Safe wrapper for synchronous functions.
 */
export const safe = (fn, report = console.error) => (...args) => {
    try {
        return fn(...args);
    } catch (e) {
        report(e);
        return null;
    }
};

/**
 * Safe wrapper for asynchronous functions.
 */
export const safeAsync = (fn, report = console.error) => async (...args) => {
    try {
        return await fn(...args);
    } catch (e) {
        report(e);
        return null;
    }
};

/**
 * Schema definitions for core registries to detect shape shifts.
 */
export const MedicationSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    description: z.string().optional()
});

export const MedicationRegistrySchema = z.record(z.string(), MedicationSchema);
