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

    it('normalizes supported clinical glossary leftovers in the legacy Indonesian field', () => {
        expect(
            normalizeIcd10OriginalIndo({
                code: 'B90.0',
                english: 'Sequelae of central nervous system tuberculosis',
                indo: 'Sequelae tuberkulosis sistem saraf pusat'
            })
        ).toBe('Gejala sisa tuberkulosis sistem saraf pusat');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'I62.0',
                english: 'Subdural haemorrhage (acute) (nontraumatic)',
                indo: 'Perdarahan subdural ( akut ) ( nontraumatic )'
            })
        ).toBe('Perdarahan subdural ( akut ) ( nontraumatik )');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'T34.0',
                english: 'Frostbite with tissue necrosis of head',
                indo: 'Frostbite dengan nekrosis jaringan kepala'
            })
        ).toBe('Radang dingin dengan nekrosis jaringan kepala');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'B85.2',
                english: 'Pediculosis, unspecified',
                indo: 'Pediculosis, tidak spesifik'
            })
        ).toBe('Pedikulosis, tidak spesifik');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'P52.0',
                english: 'Intraventricular (nontraumatic) haemorrhage, grade 1, of fetus and newborn',
                indo: 'Intraventricular ( nontraumatic ) perdarahan , kelas 1 , janin dan bayi baru lahir'
            })
        ).toBe('Intraventrikular ( nontraumatik ) perdarahan , kelas 1 , janin dan bayi baru lahir');
    });

    it('normalizes recurring transport and ectoparasite leftovers in the external-cause chapter', () => {
        expect(
            normalizeIcd10OriginalIndo({
                code: 'V01.0',
                english: 'Pedestrian injured in collision with pedal cycle, nontraffic accident',
                indo: 'Pedestrian terluka dalam tabrakan dengan siklus pedal , kecelakaan nontraffic'
            })
        ).toBe('Pejalan kaki terluka dalam tabrakan dengan sepeda , kecelakaan non-lalu lintas');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'V06.0',
                english: 'Pedestrian injured in collision with other nonmotor vehicle, nontraffic accident',
                indo: 'Pedestrian terluka dalam tabrakan dengan kendaraan nonmotor lain , kecelakaan nontraffic'
            })
        ).toBe('Pejalan kaki terluka dalam tabrakan dengan kendaraan tidak bermotor lain , kecelakaan non-lalu lintas');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'V18.0',
                english: 'Pedal cyclist injured in noncollision transport accident, driver, nontraffic accident',
                indo: 'Pedal sepeda terluka dalam kecelakaan transportasi noncollision , driver, kecelakaan nontraffic'
            })
        ).toBe('Pengendara sepeda terluka dalam kecelakaan transportasi tanpa tabrakan , pengemudi, kecelakaan non-lalu lintas');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'V09.1',
                english: 'Pedestrian injured in unspecified nontraffic accident',
                indo: 'Pedestrian terluka dalam kecelakaan nontraffic spesifik'
            })
        ).toBe('Pejalan kaki terluka dalam kecelakaan non-lalu lintas yang tidak spesifik');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'B85.3',
                english: 'Phthiriasis',
                indo: 'Phthiriasis'
            })
        ).toBe('Ftiriasis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'I71.5',
                english: 'Thoracoabdominal aortic aneurysm, ruptured',
                indo: 'Aneurisma aorta Thoracoabdominal , pecah'
            })
        ).toBe('Aneurisma aorta Torakoabdominal , pecah');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'I84.0',
                english: 'Internal thrombosed haemorrhoids',
                indo: 'Wasir thrombosed internal'
            })
        ).toBe('Wasir trombosis internal');
    });
});
