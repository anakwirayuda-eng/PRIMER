import { describe, expect, it } from 'vitest';
import { generateMorningBriefing } from '../game/MorningBriefing.js';

describe('MorningBriefing', () => {
    it('separates available funds from cycle receipts in KPI snapshot', () => {
        const result = generateMorningBriefing({
            day: 6,
            stats: {
                totalPatients: 12,
                kapitasi: 50000000,
                pendapatanUmum: 250000
            },
            reputation: 93,
            villageData: {}
        });

        expect(result.kpiSnapshot.patientsServedTotal).toBe(12);
        expect(result.kpiSnapshot.reputation).toBe(93);
        expect(result.kpiSnapshot.availableFunds).toBe(50250000);
        expect(result.kpiSnapshot.currentCycleReceipts).toBe(0);
        expect(result.kpiSnapshot.revenueThisMonth).toBe(0);
        expect(result.kpiSnapshot.kpiItems[0].value).toBe(12);
        expect(result.kpiSnapshot.kpiItems[1].value).toBe(93);
    });

    it('prefers explicit cycle receipt metrics over active funds', () => {
        const result = generateMorningBriefing({
            stats: {
                totalPatientsServed: 9,
                availableFunds: 50300000,
                monthlyRevenue: 1250000
            },
            reputation: 88,
            villageData: {}
        });

        expect(result.kpiSnapshot.availableFunds).toBe(50300000);
        expect(result.kpiSnapshot.currentCycleReceipts).toBe(1250000);
        expect(result.kpiSnapshot.revenueThisMonth).toBe(1250000);
    });
});
