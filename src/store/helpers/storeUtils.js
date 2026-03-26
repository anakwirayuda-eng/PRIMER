/**
 * Shared utility functions for store helpers.
 * Pure functions only — NO store imports.
 */

export const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const isMetaRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

export const asFiniteNumber = (value, fallback) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

export const clampInteger = (value, fallback, min, max) => {
    const safeValue = Math.trunc(asFiniteNumber(value, fallback));
    return Math.min(max, Math.max(min, safeValue));
};

export const clampNumber = (value, min, max, fallback) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, numeric));
};

export const toAbsoluteWorldMinutes = (day = 1, time = 0) => (
    (Math.max(1, Math.trunc(Number(day) || 1)) - 1) * 1440
) + Math.max(0, Number(time) || 0);
