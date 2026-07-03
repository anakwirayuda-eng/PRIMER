import { describe, expect, it } from 'vitest';

import { CASE_LIBRARY } from '../content/cases/CaseLibrary.js';
import { getCaseDemographicProfile } from '../game/PatientGenerator.js';
import {
    getAudienceAdjustedQuestionText,
    shouldHideQuestionForPatient
} from '../game/anamnesis/QuestionPresentation.js';

const CAREGIVER_COMPLAINT_RE = /\b(anak saya|bayi saya|anak kami|putra saya|putri saya)\b/i;

describe('anamnesis conversation audit', () => {
    it('requires an explicit caregiver profile when authored complaints use caregiver voice beyond age 7', () => {
        const mismatches = CASE_LIBRARY
            .filter((caseData) => (caseData.anamnesis || []).some((line) => CAREGIVER_COMPLAINT_RE.test(line)))
            .filter((caseData) => {
                const profile = getCaseDemographicProfile(caseData);
                return profile.maxAge > 7 && profile.informant?.required !== true;
            })
            .map((caseData) => caseData.id);

        expect(mismatches).toEqual([]);
    });

    it('hides female-specific self questions for male patients even when the wording uses suffixed forms', () => {
        const hidden = shouldHideQuestionForPatient(
            { id: 'q_menstruation', text: 'Haidnya banyak?' },
            { age: 25, gender: 'L' },
            { isInformant: false },
            new Set()
        );

        expect(hidden).toBe(true);
    });

    it('hides male-specific self questions for female patients even when the wording uses suffixed forms', () => {
        const hidden = shouldHideQuestionForPatient(
            { id: 'q_scrotal_pain', text: 'Buah zakarnya sakit?' },
            { age: 25, gender: 'P' },
            { isInformant: false },
            new Set()
        );

        expect(hidden).toBe(true);
    });

    it('rephrases direct lifestyle questions into pediatric-safe wording for caregiver interviews', () => {
        const text = getAudienceAdjustedQuestionText(
            { id: 'sos_merokok', text: 'Apakah Bapak/Ibu merokok?' },
            { age: 8, gender: 'L' },
            { isInformant: true, reason: 'pediatric', informantLabel: 'Ibu' }
        );

        expect(text).toBe('Ada yang merokok di rumah atau dekat anak?');
    });
});
