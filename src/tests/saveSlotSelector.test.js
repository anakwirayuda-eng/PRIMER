import { describe, expect, it } from 'vitest';
import { normalizeSlot } from '../components/SaveSlotSelector.jsx';

describe('save slot normalization', () => {
    it('marks invalid save payloads as empty slots', () => {
        expect(normalizeSlot([], 2)).toEqual({ slotId: 2, empty: true });
    });
});
