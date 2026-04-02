import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
        { id: 'puskesmas', type: BUILDING_TYPES.PUSKESMAS, x: 100, y: 30, name: 'Puskesmas Sukamaju' },
        { id: 'pustu_utama', type: BUILDING_TYPES.PUSTU, x: 28, y: 50, name: 'Pustu Sukamaju' },
        { id: 'polindes', type: BUILDING_TYPES.POLINDES, x: 25, y: 95, name: 'Polindes Desa' }
    ]
};

describe('2D map sprint 4 service labels', () => {
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
        setViewportSize(1400, 1000);
    });

    afterEach(() => {
        if (originalClientWidth) {
            Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
        }
        if (originalClientHeight) {
            Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
        }
    });

    it('shows subtle puskesmas service label in detective overlays and hides it in general mode', async () => {
        const { rerender } = render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="surveillance"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('service-label-puskesmas')).toHaveTextContent('PUSKESMAS');
        });

        rerender(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
            />
        );

        await waitFor(() => {
            expect(screen.queryByTestId('service-label-puskesmas')).not.toBeInTheDocument();
        });
    });

    it('adds satellite labels and level markers for upgraded anchors', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                buildingProgress: {
                    ...state.publicHealth.buildingProgress,
                    pustu: { completed: true, level: 2, isActive: true },
                    polindes: { completed: true, level: 1, isActive: true },
                    fob: { completed: true, level: 2 }
                }
            }
        }));

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="pispk"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('service-label-pustu')).toHaveTextContent('PUSTU');
        });
        expect(screen.getByTestId('service-label-pustu')).toHaveTextContent('L2');
        expect(screen.getByTestId('service-label-polindes')).toHaveTextContent('POLINDES');
    });

    it('keeps service labels visible under overview zoom in detective mode', async () => {
        setViewportSize(400, 300);

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="surveillance"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('service-label-puskesmas')).toBeInTheDocument();
        });
    });
});
