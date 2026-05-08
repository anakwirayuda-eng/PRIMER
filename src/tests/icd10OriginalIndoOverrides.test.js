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

        expect(
            normalizeIcd10OriginalIndo({
                code: 'A15.0',
                english: 'Tuberculosis of lung, confirmed by sputum microscopy with or without culture',
                indo: 'TBC paru-paru , hasil konfirmasi mikroskop pada sputum dengan atau tanpa cultur'
            })
        ).toBe('TBC paru-paru , hasil konfirmasi mikroskop pada sputum dengan atau tanpa kultur');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'A15.3',
                english: 'Tuberculosis of intrathoracic lymph nodes, confirmed bacteriologically and histologically',
                indo: 'Tuberkulosis kelenjar getah bening intrathoracic , dikonfirmasi bakteriologis dan histologis'
            })
        ).toBe('Tuberkulosis kelenjar getah bening intratorakal , dikonfirmasi bakteriologis dan histologis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'M00.0',
                english: 'Staphylococcal arthritis and polyarthritis',
                indo: 'Arthritis stafilokokus dan polyarthritis'
            })
        ).toBe('Artritis stafilokokus dan poliartritis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'M08.1',
                english: 'Juvenile ankylosing spondylitis',
                indo: 'Juvenile ankylosing spondylitis'
            })
        ).toBe('Juvenil ankylosing spondylitis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'D69.3',
                english: 'Idiopathic thrombocytopenic purpura',
                indo: 'Idiopathic thrombocytopenic purpura'
            })
        ).toBe('Idiopatik thrombocytopenic purpura');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'E89.0',
                english: 'Postprocedural hypothyroidism',
                indo: 'Hipotiroidisme postprocedural'
            })
        ).toBe('Hipotiroidisme pascaprosedural');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'A40.0',
                english: 'Septicaemia due to streptococcus, group A',
                indo: 'Septicaemia karena streptokokus grup A'
            })
        ).toBe('Septikemia karena streptokokus grup A');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'M50.0',
                english: 'Cervical disc disorder with myelopathy',
                indo: 'Gangguan disc serviks dengan myelopathy'
            })
        ).toBe('Gangguan disk serviks dengan mielopati');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'I42.0',
                english: 'Alcoholic cardiomyopathy',
                indo: 'Cardiomyopathy beralkohol'
            })
        ).toBe('Kardiomiopati beralkohol');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'B87.2',
                english: 'Ocular myiasis',
                indo: 'Myiasis pada mata'
            })
        ).toBe('Miasis pada mata');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'B87.8',
                english: 'Myiasis of other sites',
                indo: 'Myiasis pada lokasi lain'
            })
        ).toBe('Miasis pada lokasi lain');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'D80.9',
                english: 'Immunodeficiency with predominantly antibody defects, unspecified',
                indo: 'Immunodeficiency dengan cacat terutama antibodi , tidak spesifik'
            })
        ).toBe('Imunodefisiensi dengan cacat terutama antibodi , tidak spesifik');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'B22.1',
                english: 'HIV disease resulting in lymphoid interstitial pneumonitis',
                indo: 'Penyakit HIV mengakibatkan limfoid interstitial pneumonitis'
            })
        ).toBe('Penyakit HIV mengakibatkan limfoid interstisial pneumonitis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'D60.9',
                english: 'Acquired pure red cell aplasia, unspecified',
                indo: 'Acquired murni aplasia sel darah merah , tidak spesifik'
            })
        ).toBe('Didapat murni aplasia sel darah merah , tidak spesifik');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'S07.0',
                english: 'Crushing injury of face',
                indo: 'Crushing cedera wajah'
            })
        ).toBe('Cedera remuk wajah');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'X86',
                english: 'Assault by corrosive substance',
                indo: 'Assault oleh zat korosif'
            })
        ).toBe('Penyerangan oleh zat korosif');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'B36.9',
                english: 'Superficial mycosis, unspecified',
                indo: 'Mikosis Superficial , tidak spesifik'
            })
        ).toBe('Mikosis Superfisial , tidak spesifik');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'E65',
                english: 'Localized adiposity',
                indo: 'Localized adipositas'
            })
        ).toBe('Terlokalisasi adipositas');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'S03.5',
                english: 'Sprain and strain of joints and ligaments of other and unspecified parts of head',
                indo: 'Keseleo dan strain sendi dan ligamen dari bagian lain dan tidak spesifik dari kepala'
            })
        ).toBe('Keseleo dan regangan sendi dan ligamen dari bagian lain dan tidak spesifik dari kepala');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'T03.0',
                english: 'Dislocations, sprains and strains involving head with neck',
                indo: 'Dislokasi , keseleo dan strain melibatkan kepala dengan leher'
            })
        ).toBe('Dislokasi , keseleo dan regangan melibatkan kepala dengan leher');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'S06.6',
                english: 'Traumatic subarachnoid haemorrhage',
                indo: 'perdarahan subarachnoid traumatis'
            })
        ).toBe('perdarahan subaraknoid traumatis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'T04.0',
                english: 'Crushing injuries involving head with neck',
                indo: 'Crushing cedera yang melibatkan kepala dengan leher'
            })
        ).toBe('Cedera remuk yang melibatkan kepala dengan leher');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'V03.0',
                english: 'Pedestrian injured in collision with car, pick-up truck or van, nontraffic accident',
                indo: 'Pejalan kaki terluka dalam tabrakan dengan mobil , truk pick-up atau van , kecelakaan nontraffic'
            })
        ).toBe('Pejalan kaki terluka dalam tabrakan dengan mobil , truk pikap atau van , kecelakaan non-lalu lintas');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'Z44.0',
                english: 'Fitting and adjustment of artificial arm',
                indo: 'Fitting dan penyesuaian lengan buatan'
            })
        ).toBe('Pemasangan dan penyesuaian lengan buatan');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'A83.8',
                english: 'Other mosquito-borne viral encephalitis',
                indo: 'Ensefalitis viral yang ditularkan dari virus nyamuk lainnya'
            })
        ).toBe('Ensefalitis virus yang ditularkan dari virus nyamuk lainnya');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'M51.0',
                english: 'Lumbar and other intervertebral disc disorders with myelopathy',
                indo: 'Lumbar dan gangguan disc intervertebralis lainnya dengan myelopathy'
            })
        ).toBe('Lumbal dan gangguan disk intervertebralis lainnya dengan mielopati');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'F10.7',
                english: 'Mental and behavioural disorders due to use of alcohol, residual and late-onset psychotic disorder',
                indo: 'Gangguan mental dan perilaku akibat penggunaan alkohol , residual dan gangguan psikotik akhir-onset'
            })
        ).toBe('Gangguan mental dan perilaku akibat penggunaan alkohol , sisa dan gangguan psikotik akhir-onset');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'M41.0',
                english: 'Infantile idiopathic scoliosis',
                indo: 'Infantile idiopatik scoliosis'
            })
        ).toBe('Infantile idiopatik skoliosis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'F31.0',
                english: 'Bipolar affective disorder, current episode hypomanic',
                indo: 'Gangguan afektif bipolar , episode hypomanic saat ini'
            })
        ).toBe('Gangguan afektif bipolar , episode hipomanik saat ini');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'Q90.0',
                english: 'Trisomy 21, meiotic nondisjunction',
                indo: 'Trisomi 21 , nondisjunction meiosis'
            })
        ).toBe('Trisomi 21 , nondisjungsi meiosis');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'F12.0',
                english: 'Mental and behavioural disorders due to use of cannabinoids, acute intoxication',
                indo: 'Gangguan mental dan perilaku akibat penggunaan cannabinoids , intoksikasi akut'
            })
        ).toBe('Gangguan mental dan perilaku akibat penggunaan kanabinoid , intoksikasi akut');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'H43.0',
                english: 'Vitreous prolapse',
                indo: 'Prolaps vitreous'
            })
        ).toBe('Prolaps vitreus');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'V80.0',
                english: 'Rider or occupant injured by fall from or being thrown from animal or animal-drawn vehicle in noncollision accident',
                indo: 'Rider atau penghuni terluka oleh jatuh dari atau terlempar dari hewan atau kendaraan ditarik hewan dalam kecelakaan noncollision'
            })
        ).toBe('Pengendara atau penghuni terluka oleh jatuh dari atau terlempar dari hewan atau kendaraan ditarik hewan dalam kecelakaan tanpa tabrakan');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'I34.1',
                english: 'Mitral (valve) prolapse',
                indo: 'Mitral ( valve ) prolaps'
            })
        ).toBe('Mitral ( katup ) prolaps');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'K40.2',
                english: 'Bilateral inguinal hernia, without obstruction or gangrene',
                indo: 'Hernia inguinalis bilateral, tanpa halangan atau gangrene'
            })
        ).toBe('Hernia inguinalis bilateral, tanpa halangan atau gangren');

        expect(
            normalizeIcd10OriginalIndo({
                code: 'F00.0',
                english: 'Dementia in Alzheimers disease with early onset',
                indo: 'Demensia pada penyakit Alzheimers dengan onset awal'
            })
        ).toBe('Demensia pada penyakit Alzheimer dengan onset awal');
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
        ).toBe('Phthiriasis');

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
