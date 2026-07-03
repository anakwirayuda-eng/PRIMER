import { describe, expect, it } from 'vitest';

import { CHRONIC_CASES } from '../content/cases/modules/chronic.js';
import { dermatology_infectious } from '../content/cases/modules/infectious/dermatology.js';
import { sti_urinary_infectious } from '../content/cases/modules/infectious/sti_urinary.js';
import { HEMATOLOGY_CASES } from '../content/cases/modules/modules/hematology.js';
import { REPRODUCTIVE_CASES } from '../content/cases/modules/modules/reproductive.js';

function getCase(cases, id) {
    return cases.find((entry) => entry.id === id);
}

describe('adult anamnesis content regression guards', () => {
    it('keeps adult insect-bite anamnesis in adult first-person voice', () => {
        const insectBite = getCase(dermatology_infectious, 'gigitan_serangga');

        expect(insectBite.anamnesis.some((line) => /anak saya/i.test(line))).toBe(false);
        expect(insectBite.anamnesis[1]).toMatch(/kaki saya/i);
    });

    it('keeps male gonorrhea authored clue and symptoms male-specific', () => {
        const gonorrhea = getCase(sti_urinary_infectious, 'gonorrhea');

        expect(gonorrhea.clue).toMatch(/uretra/i);
        expect(gonorrhea.clue).not.toMatch(/vagina/i);
        expect(gonorrhea.symptoms).toContain('Duh uretra purulen');
    });

    it('asks adult dengue players about illness day and warning signs', () => {
        const dengue = getCase(HEMATOLOGY_CASES, 'demam_dengue');
        const questionIds = Object.values(dengue.anamnesisQuestions).flat().map((q) => q.id);

        expect(questionIds).toContain('q_day');
        expect(questionIds).toContain('q_warning');
        expect(dengue.essentialQuestions).toContain('q_day');
    });

    it('aligns vulvitis with candidal discharge and irritant history', () => {
        const vulvitis = getCase(REPRODUCTIVE_CASES, 'vulvitis');
        const questionIds = Object.values(vulvitis.anamnesisQuestions).flat().map((q) => q.id);

        expect(vulvitis.clue).toMatch(/kandidiasis/i);
        expect(questionIds).toContain('q_discharge');
        expect(questionIds).toContain('q_trigger');
        expect(vulvitis.essentialQuestions).toContain('q_discharge');
    });

    it('captures edema alongside orthopnea in adult heart failure essential history', () => {
        const chf = getCase(CHRONIC_CASES, 'heart_failure_congestive');
        const questionIds = Object.values(chf.anamnesisQuestions).flat().map((q) => q.id);

        expect(questionIds).toContain('q_edema');
        expect(questionIds).toContain('q_activity');
        expect(questionIds).toContain('q_pnd');
        expect(chf.essentialQuestions).toContain('q_edema');
    });

    it('captures systemic TB cues in scrofuloderma authored flow', () => {
        const scrofuloderma = getCase(dermatology_infectious, 'scrofuloderma');
        const questionIds = Object.values(scrofuloderma.anamnesisQuestions).flat().map((q) => q.id);

        expect(questionIds).toContain('q_tb_systemic');
        expect(scrofuloderma.anamnesis[1]).toMatch(/keringat malam/i);
    });
});
