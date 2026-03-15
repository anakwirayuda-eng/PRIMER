export const PAGE_SHORTCUTS = [
    { code: 'Digit1', id: 'dashboard', hint: 'Alt+1', label: 'Dashboard' },
    { code: 'Digit2', id: 'clinical', hint: 'Alt+2', label: 'Layanan' },
    { code: 'Digit3', id: 'wilayah', hint: 'Alt+3', label: 'Wilayah' },
    { code: 'Digit4', id: 'facility', hint: 'Alt+4', label: 'Gedung' },
    { code: 'Digit5', id: 'staff', hint: 'Alt+5', label: 'SDM' },
    { code: 'Digit6', id: 'inventory', hint: 'Alt+6', label: 'Sarana' },
    { code: 'Digit7', id: 'academy', hint: 'Alt+7', label: 'Diklat' },
    { code: 'Digit8', id: 'wiki', hint: 'Alt+8', label: 'MAIA Codex' },
    { code: 'Digit9', id: 'archive', hint: 'Alt+9', label: 'Arsip' },
    { code: 'Digit0', id: 'sensus', hint: 'Alt+0', label: 'Kantor Desa' },
];

export const TOGGLE_SHORTCUTS = [
    { code: 'KeyH', id: 'rumah_dinas', hint: 'Alt+H', label: 'Rumah Dinas' },
    { code: 'KeyM', id: 'phone', hint: 'Alt+M', label: 'Smartphone' },
    { code: 'KeyQ', id: 'quests', hint: 'Alt+Q', label: 'Misi' },
    { code: 'KeyJ', id: 'status', hint: 'Alt+J', label: 'Status / Junction' },
    { code: 'KeyK', id: 'kpi', hint: 'Alt+K', label: 'Review KPI' },
    { code: 'KeyS', id: 'settings', hint: 'Alt+S', label: 'Pengaturan' },
    { code: 'KeyC', id: 'calendar', hint: 'Alt+C', label: 'Kalender Laporan' },
];

export const SYSTEM_SHORTCUTS = [
    { hint: 'Space', label: 'Pause / lanjut waktu' },
    { hint: '?', label: 'Buka bantuan shortcut' },
];

const PAGE_SHORTCUT_MAP = Object.fromEntries(PAGE_SHORTCUTS.map(shortcut => [shortcut.code, shortcut]));
const TOGGLE_SHORTCUT_MAP = Object.fromEntries(TOGGLE_SHORTCUTS.map(shortcut => [shortcut.code, shortcut]));

export function isEditableShortcutTarget(target) {
    if (!target) return false;

    const tagName = target.tagName?.toUpperCase?.();
    if (target.isContentEditable) return true;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') return true;

    return typeof target.closest === 'function' && Boolean(target.closest('[contenteditable="true"]'));
}

export function resolveGlobalGameShortcut(event) {
    if (!event || event.defaultPrevented || event.repeat) return null;
    if (event.ctrlKey || event.metaKey) return null;
    if (isEditableShortcutTarget(event.target)) return null;

    if (!event.altKey) {
        if (event.key === '?' || (event.code === 'Slash' && event.shiftKey)) {
            return { type: 'toggle', id: 'shortcut_help', hint: '?', label: 'Bantuan Shortcut' };
        }

        return null;
    }

    const pageShortcut = PAGE_SHORTCUT_MAP[event.code];
    if (pageShortcut) {
        return { type: 'page', ...pageShortcut };
    }

    const toggleShortcut = TOGGLE_SHORTCUT_MAP[event.code];
    if (toggleShortcut) {
        return { type: 'toggle', ...toggleShortcut };
    }

    return null;
}

export function shouldExecuteGlobalGameShortcut(shortcut, { hasBlockingOverlay = false, isShortcutOpen = () => false } = {}) {
    if (!shortcut) return false;

    if (shortcut.type === 'page' || shortcut.id === 'rumah_dinas') {
        return !hasBlockingOverlay;
    }

    if (hasBlockingOverlay && !isShortcutOpen(shortcut.id)) {
        return false;
    }

    return true;
}
