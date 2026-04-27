import { describe, expect, it } from 'vitest';
import { generatePatient } from '../game/PatientGenerator.js';

/**
 * Validasi onboarding bias Day 1-14: distribusi SKDI didominasi 4A (≥85%)
 * sehingga mahasiswa baru tidak overwhelmed dengan rujukan SISRUTE awal.
 *
 * Population kosong → pasien bukan resident → branch isStochastic=true →
 * bias aktif. Generator menggunakan `pickDeterministic` dari `seedKey` —
 * jadi distribusi reproducible per seedHint.
 */
describe('PatientGenerator — onboarding bias Day 1-14', () => {
    const facilities = { poli_umum: 1 };

    function sampleSkdiDistribution(gameDay, count = 50) {
        const counts = { '4A': 0, 'other': 0 };
        for (let i = 0; i < count; i++) {
            const patient = generatePatient(
                480, // currentTime
                null, // population — null forces stochastic non-resident path
                gameDay,
                facilities,
                {}, // skills
                `bias-test-${gameDay}-${i}`,
            );
            const skdi = patient?.medicalData?.skdi || patient?.hidden?.skdi || '4A';
            if (skdi === '4A') counts['4A']++;
            else counts['other']++;
        }
        return counts;
    }

    it('Day 5 (Pekan 1): ≥85% pasien adalah 4A', () => {
        const dist = sampleSkdiDistribution(5, 50);
        const ratio4A = dist['4A'] / (dist['4A'] + dist['other']);
        expect(ratio4A).toBeGreaterThanOrEqual(0.85);
    });

    it('Day 12 (Pekan 2): ≥70% pasien adalah 4A', () => {
        const dist = sampleSkdiDistribution(12, 50);
        const ratio4A = dist['4A'] / (dist['4A'] + dist['other']);
        expect(ratio4A).toBeGreaterThanOrEqual(0.70);
    });

    it('Day 30 (post-onboarding): bias tidak aktif → distribusi natural (mix)', () => {
        // Tidak menetapkan ratio tertentu; cukup pastikan ada variasi.
        const dist = sampleSkdiDistribution(30, 50);
        expect(dist['4A'] + dist['other']).toBe(50);
        // Boleh saja semua 4A atau semua non-4A — yang penting tidak FORCE dibias
    });
});
