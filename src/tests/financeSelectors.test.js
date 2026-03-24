import { describe, expect, it } from 'vitest';

import { selectDerivedFinance } from '../store/selectors.js';

describe('selectDerivedFinance', () => {
    it('treats available funds as current balances without subtracting cumulative expenses twice', () => {
        const derived = selectDerivedFinance({
            finance: {
                stats: {
                    kapitasi: 50_000_000,
                    pendapatanUmum: 200_000,
                    pengeluaranObat: 100_000,
                    pengeluaranLab: 50_000,
                    pengeluaranOperasional: 25_000
                },
                kpi: {}
            }
        });

        expect(derived.totalExpense).toBe(175_000);
        expect(derived.availableFunds).toBe(50_200_000);
        expect(derived.totalRevenue).toBe(50_200_000);
        expect(derived.netBalance).toBe(50_200_000);
    });
});
