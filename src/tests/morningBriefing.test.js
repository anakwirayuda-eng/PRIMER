import { describe, expect, it } from 'vitest';
import { generateMorningBriefing } from '../game/MorningBriefing.js';

describe('MorningBriefing', () => {
    it('uses canonical finance totals and explicit reputation in KPI snapshot', () => {
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
        expect(result.kpiSnapshot.revenueThisMonth).toBe(50250000);
        expect(result.kpiSnapshot.kpiItems[0].value).toBe(12);
        expect(result.kpiSnapshot.kpiItems[1].value).toBe(93);
    });
});
