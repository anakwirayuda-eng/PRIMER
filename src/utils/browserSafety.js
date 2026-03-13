function resolveStorage(storage) {
    if (typeof storage !== 'undefined') {
        return storage;
    }

    return globalThis?.localStorage;
}

export function safeGetStorageItem(key, fallback = null, storage) {
    try {
        const value = resolveStorage(storage)?.getItem?.(key);
        return value ?? fallback;
    } catch (error) {
        console.warn(`[browserSafety] Failed to read storage key "${key}"`, error);
        return fallback;
    }
}

export function safeSetStorageItem(key, value, storage) {
    try {
        const resolvedStorage = resolveStorage(storage);
        if (typeof resolvedStorage?.setItem !== 'function') {
            return false;
        }

        resolvedStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn(`[browserSafety] Failed to write storage key "${key}"`, error);
        return false;
    }
}

export function safeRemoveStorageItem(key, storage) {
    try {
        const resolvedStorage = resolveStorage(storage);
        if (typeof resolvedStorage?.removeItem !== 'function') {
            return false;
        }

        resolvedStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`[browserSafety] Failed to remove storage key "${key}"`, error);
        return false;
    }
}

export function safeReloadPage(locationObject) {
    const resolvedLocation = locationObject ?? globalThis?.window?.location;

    if (typeof resolvedLocation?.reload !== 'function') {
        return false;
    }

    resolvedLocation.reload();
    return true;
}
