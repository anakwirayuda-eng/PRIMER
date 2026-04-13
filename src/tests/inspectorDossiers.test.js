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

    it('maps RTK wiki access to the maternal facility entry instead of kb_post', () => {
        expect(getWikiKeyForBuilding({ type: BUILDING_TYPES.RTK })).toBe('polindes');
    });
});
