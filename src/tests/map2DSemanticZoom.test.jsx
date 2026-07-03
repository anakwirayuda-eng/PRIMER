import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../components/wilayah/2d/Map2DTerrain.jsx', () => ({
    default: ({ showBridgeStatusDetails }) => (
        <div data-testid="mock-terrain" data-show-bridge-detail={String(showBridgeStatusDetails)} />
    )
}));

vi.mock('../components/wilayah/2d/Map2DMarker.jsx', () => ({
    default: ({ building }) => <div data-testid={`mock-marker-${building.id}`} />
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
        { id: 'puskesmas', type: BUILDING_TYPES.PUSKESMAS, x: 100, y: 30, name: 'Puskesmas Sukamaju' },
        {
            id: 'house-critical',
            type: BUILDING_TYPES.HOUSE_RED,
            familyId: 'fam-critical',
            x: 125,
            y: 64,
            economyTier: 'Low',
            familyData: { iksScore: 0.32 }
        }
    ]
};

describe('2D map semantic zoom contract', () => {
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
    });

    afterEach(() => {
        if (originalClientWidth) {
            Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
        }
        if (originalClientHeight) {
            Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
        }
    });

    it('marks compact laptop overview as overview and hides bridge detail cues', async () => {
        setViewportSize(400, 300);

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('map2d-semantic-zoom-root')).toHaveAttribute('data-semantic-zoom', 'overview');
        });
        expect(screen.getByTestId('mock-terrain')).toHaveAttribute('data-show-bridge-detail', 'false');
        expect(screen.getByTestId('map2d-semantic-zoom-overview-frame')).toBeInTheDocument();
        expect(screen.getByTestId('mock-marker-balai')).toBeInTheDocument();
        expect(screen.getByTestId('mock-marker-puskesmas')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-marker-house-critical')).not.toBeInTheDocument();
    });

    it('keeps priority households visible in overview for operational layers like PIS-PK', async () => {
        setViewportSize(400, 300);

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="pispk"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('map2d-semantic-zoom-root')).toHaveAttribute('data-semantic-zoom', 'overview');
        });
        expect(screen.getByTestId('mock-marker-house-critical')).toBeInTheDocument();
    });

    it('keeps event anchors unlabeled in operational zoom and auto-labels them in close detail', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                activeIKMEvents: [
                    {
                        instanceId: 'ikm-kesurupan-22',
                        scenarioId: 'kesurupan_massal',
                        currentPhaseId: 'discovery',
                        title: 'Kesurupan Massal',
                        category: 'cultural',
                        completed: false
                    }
                ]
            }
        }));

        setViewportSize(1400, 900);
        const { unmount } = render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                onEventAnchorSelect={() => {}}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('map2d-semantic-zoom-root')).toHaveAttribute('data-semantic-zoom', 'operational');
        });
        expect(screen.queryByTestId('ikm-event-label-ikm-kesurupan-22')).not.toBeInTheDocument();

        setViewportSize(2400, 1800);
        unmount();
        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                onEventAnchorSelect={() => {}}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('map2d-semantic-zoom-root')).toHaveAttribute('data-semantic-zoom', 'detail');
        });
        expect(screen.getByTestId('ikm-event-label-ikm-kesurupan-22')).toHaveTextContent('Sekolah: Kesurupan Massal');
    });
});
