import { describe, expect, it } from 'vitest';
import { normalizeIcd10OriginalIndo } from '../data/icd10OriginalIndoOverrides.js';

describe('normalizeIcd10OriginalIndo', () => {
    it('rewrites clinically unsafe mistranslations for known ICD rows', () => {
        const cases = [
            {
                code: 'C38.0',
                english: 'Malignant neoplasm of heart',
                indo: 'Neoplasma ganas hati',
                expected: 'Neoplasma ganas jantung'
            },
            {
                code: 'R09.2',
                english: 'Respiratory arrest',
                indo: 'pernapasan lambat',
                expected: 'Henti napas'
            },
            {
                code: 'K38.0',
                english: 'Hyperplasia of appendix',
                indo: 'Hiperplasia lampiran',
                expected: 'Hiperplasia apendiks'
            }
        ];

        cases.forEach(({ code, english, indo, expected }) => {
            expect(normalizeIcd10OriginalIndo({ code, english, indo })).toBe(expected);
        });
    });

    it('rewrites targeted untranslated legacy ICD labels into Indonesian runtime copy', () => {
        const cases = [
            {
                code: 'A22.0',
                english: 'Cutaneous anthrax',
                indo: 'Cutaneous anthrax',
                expected: 'Antraks kulit'
            },
            {
                code: 'A94',
                english: 'Unspecified arthropod-borne viral fever',
                indo: 'Demam virus arthropoda -borne Unspecified',
                expected: 'Demam virus bawaan artropoda tidak spesifik'
            },
            {
                code: 'H81.1',
                english: 'Benign paroxysmal vertigo',
                indo: 'Benign paroxysmal vertigo',
                expected: 'Vertigo paroksismal jinak'
            },
            {
                code: 'Q85.0',
                english: 'Neurofibromatosis (nonmalignant)',
                indo: 'Neurofibromatosis ( nonmalignant )',
                expected: 'Neurofibromatosis (tidak ganas)'
            }
        ];

        cases.forEach(({ code, english, indo, expected }) => {
            expect(normalizeIcd10OriginalIndo({ code, english, indo })).toBe(expected);
        });
    });

    it('keeps generic homonym cleanup active for non-overridden rows', () => {
        expect(
            normalizeIcd10OriginalIndo({
                code: 'D12.1',
                english: 'Benign neoplasm of appendix',
                indo: 'Neoplasma jinak lampiran'
            })
        ).toBe('Neoplasma jinak apendiks');
    });

    it('normalizes generic situs wording for non-overridden overlapping-site rows', () => {
        expect(
            normalizeIcd10OriginalIndo({
                code: 'C79.8',
                english: 'Secondary malignant neoplasm of other specified sites',
                indo: 'Neoplasma ganas sekunder dari situs tertentu lainnya'
            })
        ).toBe('Neoplasma ganas sekunder dari lokasi tertentu lainnya');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'I71.8',
                english: 'Aortic aneurysm of unspecified site, ruptured',
                indo: 'Aneurisma aorta situs yang tidak spesifik, pecah'
            })
        ).toBe('Aneurisma aorta lokasi yang tidak spesifik, pecah');
    });
});
