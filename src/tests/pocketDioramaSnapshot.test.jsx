import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PocketDioramaSnapshot from '../components/wilayah/PocketDioramaSnapshot.jsx';
import { BUILDING_TYPES } from '../components/wilayah/constants.js';
import i18n from '../i18n.js';

const SNAPSHOT_MAP = {
    width: 24,
    height: 18,
    centerX: 12,
    centerY: 9,
    scopeMeta: {
        kind: 'rw',
        id: '03',
        label: 'RW 03',
        buildingCount: 3,
        houseCount: 1,
    },
    buildings: [
        {
            id: 'rtk-1',
            type: BUILDING_TYPES.RTK,
            x: 10,
            y: 7,
            name: 'RTK Desa Sukamaju',
        },
        {
            id: 'house-1',
            type: BUILDING_TYPES.HOUSE_BLUE,
            x: 14,
            y: 10,
            familyId: 'fam-1',
            name: 'Rumah Bu Tini',
        },
        {
            id: 'posyandu-1',
            type: BUILDING_TYPES.POSYANDU,
            x: 8,
            y: 12,
            name: 'Posyandu Melati',
        }
    ]
};

describe('PocketDioramaSnapshot', () => {
    it('renders a static inspector snapshot with scope and focus building context', () => {
        render(
            <PocketDioramaSnapshot
                mapData={SNAPSHOT_MAP}
                selectedBuildingId="rtk-1"
                modeVariant="mobile"
            />
        );

        expect(screen.getByTestId('pocket-diorama-snapshot')).toBeInTheDocument();
        expect(
            screen.getByText(
                i18n.t('wilayahContent.ui.dioramaInspector.modeLabels.mobile', { defaultValue: 'Mobile Snapshot' })
            )
        ).toBeInTheDocument();
        expect(screen.getByText('RW 03')).toBeInTheDocument();
        expect(screen.getAllByText('RTK Desa Sukamaju').length).toBeGreaterThan(0);
        expect(
            screen.getByText(
                i18n.t('wilayahContent.ui.dioramaInspector.metricRenderSafe', { defaultValue: 'GPU Aman' })
            )
        ).toBeInTheDocument();
    });
});
