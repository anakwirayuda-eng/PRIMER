/**
 * @reflection
 * [IDENTITY]: Vitest Global Setup
 * [PURPOSE]: Configures test environment and global mocks.
 * [STATE]: Stable
 */
// Vitest setup file
import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';
import i18n from '../i18n.js';

let consoleDebugSpy = null;

beforeEach(async () => {
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    if (i18n.resolvedLanguage !== 'id') {
        await i18n.changeLanguage('id');
    }
});

afterEach(() => {
    consoleDebugSpy?.mockRestore();
    consoleDebugSpy = null;
});
