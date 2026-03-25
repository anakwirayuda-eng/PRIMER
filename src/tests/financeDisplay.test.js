import { describe, expect, it } from 'vitest';
import { buildLiquidityWikiStats, buildPersonalBankSnapshot } from '../utils/financeDisplay.js';

describe('financeDisplay helpers', () => {
    it('builds liquidity stats from active funds and cycle receipts', () => {
        expect(buildLiquidityWikiStats({
            kapitasi: 50_000_000,
            pendapatanUmum: 250_000,
            currentCycleReceipts: 1_500_000,
            availableFunds: 50_250_000
        })).toEqual({
            'Dana Aktif': 'Rp 50.3M',
            'Penerimaan Siklus': 'Rp 1.50M',
            'Dana Umum': 'Rp 0.25M'
        });
    });

    it('keeps personal bank estimates separate from clinic operational balances', () => {
        expect(buildPersonalBankSnapshot({
            pendapatanUmum: 90_000_000,
            kapitasi: 50_000_000,
            currentCycleReceipts: 300_000
        })).toEqual(expect.objectContaining({
            monthlySalary: 4_500_000,
            jasaPelayanan: 120_000,
            personalSavings: 4_605_000
        }));
    });
});
