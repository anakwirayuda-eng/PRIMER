import { describe, expect, it } from 'vitest';
import { generateDebrief } from '../game/DebriefEngine.js';

describe('DebriefEngine', () => {
    it('includes referred encounters in critical cases and generates a referral reflection prompt', () => {
        const result = generateDebrief({
            todayLog: [
                {
                    patientName: 'Budi',
                    age: 54,
                    diagnosis: 'I20.0',
                    correctDiagnosis: 'I20.0',
                    diagnosisScore: 85,
                    referred: true,
                    completed: false,
                    revenue: -150000
                }
            ],
            consequenceQueue: [],
            day: 3,
            stats: { reputation: 80 }
        });

        expect(result.criticalCases).toHaveLength(1);
        expect(result.criticalCases[0].patientName).toBe('Budi');
        expect(result.criticalCases[0].referred).toBe(true);
        expect(result.reflectionPrompts.some((prompt) => prompt.type === 'referral_question')).toBe(true);
    });

    it('falls back to diagnosis when todayLog entries do not provide correctDiagnosis', () => {
        const result = generateDebrief({
            todayLog: [
                {
                    patientName: 'Siti',
                    age: 61,
                    diagnosis: 'I21.9',
                    diagnosisScore: 0,
                    referred: false,
                    completed: true,
                    revenue: 0
                }
            ],
            consequenceQueue: [],
            day: 4,
            stats: { reputation: 80 }
        });

        expect(result.criticalCases[0].correctDiagnosis).toBe('I21.9');
        expect(result.criticalCases[0].keyLearning).toContain('I21.9');
    });
});
