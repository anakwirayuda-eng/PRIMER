import { describe, expect, it, vi } from 'vitest';
import {
    safeGetStorageItem,
    safeSetStorageItem,
    safeRemoveStorageItem,
    safeReloadPage
} from '../utils/browserSafety.js';

describe('browser safety helpers', () => {
    it('returns a fallback when storage reads throw', () => {
        const storage = {
            getItem: () => {
                throw new Error('blocked');
            }
        };

        expect(safeGetStorageItem('primer_theme', 'medika', storage)).toBe('medika');
    });

    it('returns false when storage writes or deletes throw', () => {
        const storage = {
            setItem: () => {
                throw new Error('quota');
            },
            removeItem: () => {
                throw new Error('blocked');
            }
        };

        expect(safeSetStorageItem('primer_save_0', '{}', storage)).toBe(false);
        expect(safeRemoveStorageItem('primer_save_0', storage)).toBe(false);
    });

    it('reloads only when a reload function exists', () => {
        const reload = vi.fn();

        expect(safeReloadPage({ reload })).toBe(true);
        expect(reload).toHaveBeenCalledTimes(1);
        expect(safeReloadPage({})).toBe(false);
    });
});
