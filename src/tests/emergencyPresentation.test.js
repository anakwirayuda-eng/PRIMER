import { describe, expect, it } from 'vitest';
import i18n from '../i18n.js';
import { getEmergencyCasePresentation } from '../game/emergency/emergencyPresentation.js';

function buildEmergencyPatient(caseId) {
    return {
        complaint: '',
        hidden: {
            diseaseId: caseId,
            diagnosis: ''
        },
        medicalData: {
            symptoms: [],
            anamnesis: [],
            anamnesisQuestions: {},
            physicalExamFindings: {},
            relevantLabs: []
        }
    };
}

describe('getEmergencyCasePresentation', () => {
    it('returns localized English objective and referral payload for authored emergency cases', async () => {
        await i18n.changeLanguage('en');

        const view = getEmergencyCasePresentation(
            buildEmergencyPatient('foreign_body_aspiration'),
            i18n.t.bind(i18n),
            i18n
        );

        expect(view.physicalExamFindings.general).toContain('3-year-old child');
        expect(view.physicalExamFindings.thorax).toContain('Inspiratory stridor');
        expect(view.sisruteData.assessment).toContain('rigid bronchoscopy');
    });

    it('returns localized English relevant labs and physical findings for pediatric emergency cases', async () => {
        await i18n.changeLanguage('en');

        const view = getEmergencyCasePresentation(
            buildEmergencyPatient('dka_pediatric'),
            i18n.t.bind(i18n),
            i18n
        );

        expect(view.relevantLabs).toEqual([
            'Random blood glucose',
            'Complete blood count',
            'Electrolytes',
            'Blood gas analysis'
        ]);
        expect(view.physicalExamFindings.general).toContain('10-year-old child');
        expect(view.sisruteData.recommendation).toContain('PICU');
    });

    it('keeps Indonesian objective and referral payload when the app language is Indonesian', async () => {
        await i18n.changeLanguage('id');

        const view = getEmergencyCasePresentation(
            buildEmergencyPatient('bronchiolitis_severe'),
            i18n.t.bind(i18n),
            i18n
        );

        expect(view.relevantLabs).toEqual(['SpO2', 'Darah Lengkap']);
        expect(view.physicalExamFindings.general).toContain('Bayi 8 bulan');
        expect(view.sisruteData.assessment).toContain('Bronkiolitis berat');
    });
});
