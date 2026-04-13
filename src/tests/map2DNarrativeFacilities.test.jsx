import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Map2DMarker from '../components/wilayah/2d/Map2DMarker.jsx';
import { BUILDING_TYPES } from '../components/wilayah/constants.js';

describe('2D map narrative facilities', () => {
    it('renders RTK as a maternal referral anchor with a dedicated cue chip', () => {
        render(
            <Map2DMarker
                building={{
                    id: 'rtk-cue',
                    type: BUILDING_TYPES.RTK,
                    x: 12,
                    y: 12,
                    name: 'RTK Desa Sukamaju',
                }}
                cellSize={10}
                activeLayer="general"
                showStatusDetails={true}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.getByTestId('narrative-cue-rtk-cue')).toHaveTextContent('RUJUK');

        fireEvent.pointerEnter(screen.getByTestId('map-marker-rtk-cue'));

        expect(screen.getByText('Maternal Hub')).toBeInTheDocument();
        expect(screen.getByText('Rujukan Maternal')).toBeInTheDocument();
        expect(screen.getByText('Persalinan aman dan transit ibu')).toBeInTheDocument();
    });

    it('switches Padepokan Dukun cue into mediation mode on perilaku layer', () => {
        render(
            <Map2DMarker
                building={{
                    id: 'padepokan-cue',
                    type: BUILDING_TYPES.PADEPOKAN_DUKUN,
                    x: 20,
                    y: 18,
                    name: 'Padepokan Dukun Mbah Surti',
                }}
                cellSize={10}
                activeLayer="perilaku"
                showStatusDetails={true}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.getByTestId('narrative-cue-padepokan-cue')).toHaveTextContent('MEDIASI');

        fireEvent.pointerEnter(screen.getByTestId('map-marker-padepokan-cue'));

        expect(screen.getByText('Budaya')).toBeInTheDocument();
        expect(screen.getByText('Dialog Tradisi')).toBeInTheDocument();
        expect(screen.getByText('Jembatan adat dan evidence')).toBeInTheDocument();
    });
});
