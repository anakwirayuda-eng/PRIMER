export function safeGetStorageItem(key, fallback = null, storage = globalThis?.localStorage) {
    try {
        const value = storage?.getItem?.(key);
        return value ?? fallback;
    } catch (error) {
        console.warn(`[browserSafety] Failed to read storage key "${key}"`, error);
        return fallback;
    }
}

export function safeSetStorageItem(key, value, storage = globalThis?.localStorage) {
    try {
        storage?.setItem?.(key, value);
        return true;
    } catch (error) {
        console.warn(`[browserSafety] Failed to write storage key "${key}"`, error);
        return false;
    }
}

export function safeRemoveStorageItem(key, storage = globalThis?.localStorage) {
    try {
        storage?.removeItem?.(key);
        return true;
    } catch (error) {
        console.warn(`[browserSafety] Failed to remove storage key "${key}"`, error);
        return false;
    }
}

export function safeReloadPage(locationObject = globalThis?.window?.location) {
    if (typeof locationObject?.reload !== 'function') {
        return false;
    }

    locationObject.reload();
    return true;
}
