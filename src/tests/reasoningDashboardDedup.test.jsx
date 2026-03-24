import { describe, expect, it } from 'vitest';
import {
    buildDiagnosticProbabilities,
    resolveCanonicalDiagnosisName
} from '../components/emr/reasoningDashboardUtils.js';

describe('ReasoningDashboard dedup', () => {
    it('strips a DDx entry whose raw ICD matches the primary diagnosis code', () => {
        const probabilities = buildDiagnosticProbabilities(
            {
                medicalData: {
                    diagnosisName: 'Gangguan Cemas Menyeluruh (GAD)',
                    trueDiagnosisCode: 'F41.1'
                },
                hidden: {
                    differentialDiagnosis: ['F41.1', 'F41.0']
                }
            },
            100
        );

        expect(probabilities.map(entry => entry.name)).toEqual([
            'Gangguan Cemas Menyeluruh (GAD)',
            'Panic disorder'
        ]);
        expect(probabilities.map(entry => entry.displayName)).toEqual([
            'F41.1 Gangguan Cemas Menyeluruh (GAD)',
            'F41.0 Panic disorder'
        ]);
    });

    it('collapses DDx synonyms that normalize to the same disease', () => {
        const probabilities = buildDiagnosticProbabilities(
            {
                medicalData: {
                    diagnosisName: 'Acute gastroenteritis',
                    trueDiagnosisCode: 'A09'
                },
                hidden: {
                    differentialDiagnosis: ['urinary tract infection', 'Infeksi saluran kemih', 'N39.0']
                }
            },
            85
        );

        const ddxCanonicals = probabilities
            .slice(1)
            .map(entry => resolveCanonicalDiagnosisName(entry.name));

        expect(ddxCanonicals).toEqual(['infeksi saluran kemih']);
    });

    it('prefixes ICD-10 codes on visible labels when a code can be resolved', () => {
        const probabilities = buildDiagnosticProbabilities(
            {
                medicalData: {
                    diagnosisName: 'Infark Serebral (Stroke Iskemik)',
                    trueDiagnosisCode: 'I63.9'
                },
                hidden: {
                    differentialDiagnosis: ['I61.9', 'Intracerebral haemorrhage']
                }
            },
            40
        );

        expect(probabilities[0].displayName).toBe('I63.9 Infark Serebral (Stroke Iskemik)');
        expect(probabilities[1].displayName).toBe('I61.9 Intracerebral haemorrhage');
        expect(probabilities).toHaveLength(2);
    });
});
