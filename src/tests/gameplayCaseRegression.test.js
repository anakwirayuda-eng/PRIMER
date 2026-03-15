import { describe, expect, it } from 'vitest';
import { ENT_CASES } from '../content/cases/modules/modules/ent.js';
import { HEMATOLOGY_CASES } from '../content/cases/modules/modules/hematology.js';
import { OPHTHALMOLOGY_CASES } from '../content/cases/modules/modules/ophthalmology.js';
import { URINARY_CASES } from '../content/cases/modules/modules/urinary.js';

function getCase(cases, id) {
    return cases.find((entry) => entry.id === id);
}

describe('gameplay case regression guards', () => {
    it('keeps dengue hematology cases on canonical lab keys', () => {
        expect(getCase(HEMATOLOGY_CASES, 'dbd_grade_1')?.relevantLabs).toEqual(['lab_hematology', 'lab_ns1']);
        expect(getCase(HEMATOLOGY_CASES, 'demam_dengue')?.relevantLabs).toEqual(['lab_hematology', 'lab_ns1']);
        expect(getCase(HEMATOLOGY_CASES, 'dss')?.relevantLabs).toEqual(['lab_hematology']);
    });

    it('preserves non-empty treatment plans for referral-heavy gameplay cases', () => {
        const katarak = getCase(OPHTHALMOLOGY_CASES, 'katarak');
        const caNasofaring = getCase(ENT_CASES, 'ca_nasofaring');
        const parafimosis = getCase(URINARY_CASES, 'parafimosis');

        expect(katarak?.correctTreatment).toEqual(['observation']);
        expect(katarak?.correctProcedures).toContain('hospital_referral');

        expect(caNasofaring?.correctTreatment).toEqual(['tranexamic_acid_500']);
        expect(caNasofaring?.correctProcedures).toContain('hospital_referral');

        expect(parafimosis?.correctTreatment).toEqual(['cold_compress']);
        expect(parafimosis?.correctProcedures).toContain('manual_reduction_paraphimosis');
    });
});
