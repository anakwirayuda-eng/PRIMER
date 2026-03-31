import { beforeEach, describe, it, expect } from 'vitest';
import { useGameStore } from '../store/useGameStore.js';

describe('Geo Law SDoH Wiring: KBK Performance in Finance Slice', () => {
    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    it('multiplies base monthly kapitasi explicitly utilizing KBK performance rules', () => {
        // Setup state prior to action
        useGameStore.setState(s => ({
            ...s,
            world: {
                ...s.world,
                day: 31
            },
            clinical: {
                ...s.clinical,
                dailyArchive: [
                    {
                        day: 30,
                        overallScore: 80,
                        reputation: 75,
                        patientsToday: 10,
                        revenue: 500_000
                    }
                ],
                monthlyArchive: []
            },
            publicHealth: {
                ...s.publicHealth,
                villageData: {
                    families: [
                        { id: 'kk_1', iksScore: 1.0 },
                        { id: 'kk_2', iksScore: 1.0 }
                    ]
                }
            },
            finance: {
                ...s.finance,
                stats: {
                    kapitasi: 10_000_000,
                    pengeluaranObat: 0,
                    pengeluaranLab: 0,
                    pengeluaranOperasional: 0,
                    pendapatanUmum: 0
                }
            }
        }));

        // Execute action (Utama accreditation = 1.25x)
        // With avgIKS 1.0, KBK performance is 1.3x
        // monthlyKapitasi should be 50,000,000 * 1.25 * 1.3 = 81,250,000
        useGameStore.getState().financeActions.processMonthlyReport('Utama', []);

        const state = useGameStore.getState();
        const finalKapitasi = state.finance.stats.kapitasi;
        const monthlyArchiveEntry = state.clinical.monthlyArchive.at(-1);
        // 10,000,000 (starting) + 81,250,000 (added) = 91,250,000
        expect(finalKapitasi).toBe(91_250_000);
        expect(monthlyArchiveEntry?.monthlyKapitasi).toBe(81_250_000);
    });

    it('falls back to 1.0 performance multiplier when families/villageData is empty seamlessly', () => {
        useGameStore.setState(s => ({
            ...s,
            world: {
                ...s.world,
                day: 31
            },
            clinical: {
                ...s.clinical,
                dailyArchive: [
                    {
                        day: 30,
                        overallScore: 70,
                        reputation: 60,
                        patientsToday: 8,
                        revenue: 250_000
                    }
                ],
                monthlyArchive: []
            },
            publicHealth: {
                ...s.publicHealth,
                villageData: null
            },
            finance: {
                ...s.finance,
                stats: {
                    kapitasi: 0,
                    pengeluaranObat: 0,
                    pengeluaranLab: 0,
                    pengeluaranOperasional: 0,
                    pendapatanUmum: 0
                }
            }
        }));

        // Dasar accreditation = 1.0x
        // KBK = 1.0x (fallback gracefully)
        // Expected = 50,000,000 * 1.0 * 1.0 = 50,000,000
        useGameStore.getState().financeActions.processMonthlyReport('Dasar', []);

        const state = useGameStore.getState();
        const finalKapitasi = state.finance.stats.kapitasi;
        const monthlyArchiveEntry = state.clinical.monthlyArchive.at(-1);
        expect(finalKapitasi).toBe(50_000_000);
        expect(monthlyArchiveEntry?.monthlyKapitasi).toBe(50_000_000);
    });
});
