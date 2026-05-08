/**
 * @reflection
 * [IDENTITY]: offlineMode
 * [PURPOSE]: Session-scoped explicit offline-mode flag for cloud service guards.
 * [STATE]: Stable
 * [ANCHOR]: OFFLINE_MODE_FLAG
 * [DEPENDS_ON]: browser sessionStorage
 */

export const OFFLINE_MODE_STORAGE_KEY = 'primer:offlineMode';

export function isOfflineModeEnabled() {
    if (typeof window === 'undefined') return false;

    try {
        return window.sessionStorage?.getItem(OFFLINE_MODE_STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
}

export function setOfflineModeEnabled(enabled) {
    if (typeof window === 'undefined') return;

    try {
        if (enabled) {
            window.sessionStorage?.setItem(OFFLINE_MODE_STORAGE_KEY, 'true');
        } else {
            window.sessionStorage?.removeItem(OFFLINE_MODE_STORAGE_KEY);
        }
    } catch {
        // Storage may be unavailable in private mode; callers still keep React state in sync.
    }
}
