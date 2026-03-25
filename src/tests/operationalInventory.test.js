import { describe, expect, it } from 'vitest';
import { buildOperationalInventoryWikiStats, summarizeOperationalInventory } from '../utils/operationalInventory.js';

describe('operationalInventory', () => {
    it('excludes equipment and pseudo-items from operational stock summaries', () => {
        const summary = summarizeOperationalInventory([
            { medicationId: 'amoxicillin_500', stock: 0 },
            { medicationId: 'amlodipine_5', stock: 5 },
            { medicationId: 'otoscope', stock: 0 },
            { medicationId: 'bed_rest', stock: 0 }
        ]);

        expect(summary.totalItems).toBe(2);
        expect(summary.outOfStock).toBe(1);
        expect(summary.lowStock).toBeGreaterThanOrEqual(1);
        expect(summary.stockItems.map((item) => item.medicationId)).toEqual(
            expect.arrayContaining(['amoxicillin_500', 'amlodipine_5'])
        );
        expect(summary.stockItems.map((item) => item.medicationId)).not.toEqual(
            expect.arrayContaining(['otoscope', 'bed_rest'])
        );
    });

    it('builds shell-level wiki stats from operational stock only', () => {
        expect(buildOperationalInventoryWikiStats([
            { medicationId: 'amoxicillin_500', stock: 0 },
            { medicationId: 'amlodipine_5', stock: 5 },
            { medicationId: 'otoscope', stock: 0 }
        ])).toEqual({
            'Total Item': 2,
            'Stok Habis': 1
        });
    });
});
