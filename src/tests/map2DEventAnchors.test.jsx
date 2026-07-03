import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../components/wilayah/2d/Map2DTerrain.jsx', () => ({
    default: () => <div data-testid="mock-terrain" />
}));

vi.mock('../components/wilayah/2d/Map2DMarker.jsx', () => ({
    default: () => null
}));

import Map2DBlueprint from '../components/wilayah/2d/Map2DBlueprint.jsx';
import { useGameStore } from '../store/useGameStore.js';
import { BUILDING_TYPES } from '../components/wilayah/constants.js';

const MAP_DATA = {
    width: 160,
    height: 120,
    centerX: 80,
    centerY: 60,
    tiles: Array.from({ length: 120 }, () => Array.from({ length: 160 }, () => null)),
    buildings: [
        { id: 'balai', type: BUILDING_TYPES.BALAI_DESA, x: 70, y: 56, name: 'Balai Desa Sukamaju' },
        { id: 'school-1', type: BUILDING_TYPES.SCHOOL, x: 92, y: 42, name: 'SD Sukamaju' },
        { id: 'market-1', type: BUILDING_TYPES.MARKET, x: 120, y: 58, name: 'Pasar Sukamaju' },
        { id: 'posyandu-1', type: BUILDING_TYPES.POSYANDU, x: 60, y: 78, name: 'Posyandu Melati' },
        { id: 'puskesmas', type: BUILDING_TYPES.PUSKESMAS, x: 100, y: 30, name: 'Puskesmas Sukamaju' }
    ]
};

describe('2D map IKM event anchors', () => {
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
    const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');

    const setViewportSize = (width, height) => {
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            configurable: true,
            get() {
                return width;
            }
        });
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
            configurable: true,
            get() {
                return height;
            }
        });
    };

    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
        setViewportSize(1400, 900);
    });

    afterEach(() => {
        if (originalClientWidth) {
            Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
        }
        if (originalClientHeight) {
            Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
        }
    });

    it('renders anchor markers and legend chip for active IKM events', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                activeIKMEvents: [
                    {
                        instanceId: 'ikm-kesurupan-8',
                        scenarioId: 'kesurupan_massal',
                        currentPhaseId: 'discovery',
                        title: 'Kesurupan Massal',
                        category: 'cultural',
                        completed: false
                    }
                ]
            }
        }));

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                selectedEventAnchorId="ikm-kesurupan-8"
                onEventAnchorSelect={() => {}}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('ikm-event-anchor-ikm-kesurupan-8')).toBeInTheDocument();
        });

        expect(screen.getByTestId('ikm-event-label-ikm-kesurupan-8')).toHaveTextContent('Sekolah: Kesurupan Massal');

        const legend = screen.getByTestId('wilayah-map-layer-legend');
        expect(within(legend).getByText('IKM 1')).toBeInTheDocument();
    });

    it('routes event anchors to the provided selector callback', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                activeIKMEvents: [
                    {
                        instanceId: 'ikm-jajanan-12',
                        scenarioId: 'keracunan_jajanan_pasar',
                        currentPhaseId: 'discovery',
                        title: 'Keracunan Jajanan Pasar',
                        category: 'food_safety',
                        completed: false
                    }
                ]
            }
        }));

        const onEventAnchorSelect = vi.fn();

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="surveillance"
                onEventAnchorSelect={onEventAnchorSelect}
            />
        );

        const button = await screen.findByTestId('ikm-event-anchor-ikm-jajanan-12');
        fireEvent.click(button);

        expect(onEventAnchorSelect).toHaveBeenCalledWith('ikm-jajanan-12');
    });
});
