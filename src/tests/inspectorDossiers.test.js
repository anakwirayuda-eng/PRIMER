import { describe, expect, it } from 'vitest';

import { BUILDING_TYPES } from '../components/wilayah/constants.js';
import { getBuildingInspectorDossier } from '../components/wilayah/inspectorDossiers.js';
import { getWikiKeyForBuilding } from '../components/wilayah/map-utils.js';

describe('wilayah inspector dossiers', () => {
    it('returns a maternal operations dossier for RTK', () => {
        const dossier = getBuildingInspectorDossier(BUILDING_TYPES.RTK);

        expect(dossier?.eyebrow).toBe('Maternal Hub');
        expect(dossier?.title).toContain('rujukan obstetri');
        expect(dossier?.metrics).toHaveLength(3);
        expect(dossier?.focusPoints?.[0]).toContain('ibu risiko tinggi');
    });

    it('returns a tradition-versus-evidence dossier for padepokan dukun', () => {
        const dossier = getBuildingInspectorDossier(BUILDING_TYPES.PADEPOKAN_DUKUN);

        expect(dossier?.eyebrow).toBe('Budaya + Evidence');
        expect(dossier?.summary).toContain('keyakinan');
        expect(dossier?.caseHint).toContain('tradisi vs evidence');
    });

    it('localizes inspector dossier copy when a translator is provided', () => {
        const t = (key, options = {}) => ({
            'wilayahContent.inspectorDossiers.rtk.title': 'RTK is the final referral buffer.',
            'wilayahContent.inspectorDossiers.rtk.focusPoints.0': 'Keep the high-risk mother near referral transport.',
            'wilayahContent.inspectorDossiers.rtk.metrics.1.label': 'Pressure',
            'wilayahContent.inspectorDossiers.rtk.metrics.1.value': 'Preeclampsia / family hesitation',
            'wilayahContent.inspectorDossiers.rtk.caseHint': 'Use linked cases to test maternal referral delay.'
        })[key] ?? options.defaultValue;

        const dossier = getBuildingInspectorDossier(BUILDING_TYPES.RTK, t);

        expect(dossier?.title).toBe('RTK is the final referral buffer.');
        expect(dossier?.focusPoints?.[0]).toBe('Keep the high-risk mother near referral transport.');
        expect(dossier?.metrics?.[1]).toMatchObject({
            label: 'Pressure',
            value: 'Preeclampsia / family hesitation'
        });
        expect(dossier?.caseHint).toBe('Use linked cases to test maternal referral delay.');
    });

    it('maps RTK wiki access to the maternal facility entry instead of kb_post', () => {
        expect(getWikiKeyForBuilding({ type: BUILDING_TYPES.RTK })).toBe('polindes');
    });
});
