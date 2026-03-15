import { describe, expect, it } from 'vitest';
import { resolveGlobalGameShortcut, shouldExecuteGlobalGameShortcut } from '../utils/gameShortcuts.js';

function createShortcutEvent(overrides = {}) {
    return {
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        repeat: false,
        defaultPrevented: false,
        code: '',
        key: '',
        target: document.body,
        ...overrides
    };
}

describe('gameShortcuts', () => {
    it('maps Alt+digit navigation shortcuts to gameplay pages', () => {
        const shortcut = resolveGlobalGameShortcut(createShortcutEvent({
            altKey: true,
            code: 'Digit4',
            key: '4'
        }));

        expect(shortcut).toMatchObject({
            type: 'page',
            id: 'facility',
            hint: 'Alt+4'
        });
    });

    it('maps toggle shortcuts and shortcut help', () => {
        const questShortcut = resolveGlobalGameShortcut(createShortcutEvent({
            altKey: true,
            code: 'KeyQ',
            key: 'q'
        }));
        const helpShortcut = resolveGlobalGameShortcut(createShortcutEvent({
            code: 'Slash',
            key: '?',
            shiftKey: true
        }));

        expect(questShortcut).toMatchObject({
            type: 'toggle',
            id: 'quests',
            hint: 'Alt+Q'
        });
        expect(helpShortcut).toMatchObject({
            type: 'toggle',
            id: 'shortcut_help',
            hint: '?'
        });
    });

    it('ignores shortcuts while typing or when browser modifiers are active', () => {
        const input = document.createElement('input');

        const typingShortcut = resolveGlobalGameShortcut(createShortcutEvent({
            altKey: true,
            code: 'Digit1',
            key: '1',
            target: input
        }));
        const browserShortcut = resolveGlobalGameShortcut(createShortcutEvent({
            ctrlKey: true,
            altKey: true,
            code: 'Digit1',
            key: '1'
        }));

        expect(typingShortcut).toBeNull();
        expect(browserShortcut).toBeNull();
    });

    it('blocks page navigation while overlays are open but still allows closing the same toggle', () => {
        const pageShortcut = { type: 'page', id: 'dashboard' };
        const settingsShortcut = { type: 'toggle', id: 'settings' };

        expect(shouldExecuteGlobalGameShortcut(pageShortcut, {
            hasBlockingOverlay: true,
            isShortcutOpen: () => false
        })).toBe(false);

        expect(shouldExecuteGlobalGameShortcut(settingsShortcut, {
            hasBlockingOverlay: true,
            isShortcutOpen: (id) => id === 'settings'
        })).toBe(true);
    });
});
