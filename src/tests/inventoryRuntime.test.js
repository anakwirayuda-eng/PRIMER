import { describe, expect, it } from 'vitest';
import {
    INVENTORY_ACL_VERSION,
    normalizeInventoryItem,
    normalizeInventoryList,
    normalizeMedicationId
} from '../models/InventoryRuntime.js';

describe('InventoryRuntime ACL', () => {
    it('normalizes known alias ids to canonical medication ids', () => {
        expect(normalizeMedicationId('folley_catheter')).toBe('kateter_foley');
        expect(normalizeMedicationId('splint_set')).toBe('bidai_set');
        expect(normalizeMedicationId('mgso4_inj')).toBe('magnesium_sulfate_iv');
    });

    it('fills form and category from the medication catalog', () => {
        const canonical = normalizeInventoryItem({
            medicationId: 'folley_catheter',
            stock: 5,
            lastRestockDay: 2
        });

        expect(canonical.medicationId).toBe('kateter_foley');
        expect(canonical.form).toBe('consumable');
        expect(canonical.category).toBeTruthy();
        expect(canonical.stock).toBe(5);
        expect(canonical.lastRestockDay).toBe(2);
    });

    it('is idempotent for current ACL version', () => {
        const first = normalizeInventoryItem({ medicationId: 'salbutamol_neb', stock: 3 });
        const second = normalizeInventoryItem(first);
        expect(second).toBe(first);
    });

    it('re-normalizes outdated canonical items', () => {
        const fresh = normalizeInventoryItem({
            medicationId: 'folley_catheter',
            stock: 2,
            _isInventoryCanonical: true,
            _inventoryAclVersion: 0
        });

        expect(fresh._inventoryAclVersion).toBe(INVENTORY_ACL_VERSION);
        expect(fresh.medicationId).toBe('kateter_foley');
    });

    it('normalizeInventoryList merges duplicate aliases and filters nulls', () => {
        const normalized = normalizeInventoryList([
            { medicationId: 'folley_catheter', stock: 2, lastRestockDay: 1 },
            { medicationId: 'kateter_foley', stock: 3, lastRestockDay: 4 },
            null
        ]);

        expect(normalized).toHaveLength(1);
        expect(normalized[0]).toMatchObject({
            medicationId: 'kateter_foley',
            stock: 5,
            lastRestockDay: 4
        });
    });
});
