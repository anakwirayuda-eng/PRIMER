import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../components/wilayah/2d/Map2DTerrain.jsx', () => ({
    default: () => <div data-testid="mock-terrain" />
}));

import Map2DBlueprint from '../components/wilayah/2d/Map2DBlueprint.jsx';
import Map2DMarker from '../components/wilayah/2d/Map2DMarker.jsx';
import { useGameStore } from '../store/useGameStore.js';
import { BUILDING_TYPES } from '../components/wilayah/constants.js';

const MAP_DATA = {
    width: 160,
    height: 120,
    centerX: 80,
    centerY: 60,
    tiles: Array.from({ length: 120 }, () => Array.from({ length: 160 }, () => null)),
    buildings: [
        {
            id: 'house-intel',
            type: BUILDING_TYPES.HOUSE_RED,
            familyId: 'fam-intel',
            x: 130,
            y: 60,
            name: 'Rumah Intel',
            economyTier: 'Middle',
            familyData: { iksScore: 0.95 }
        },
        {
            id: 'house-plain',
            type: BUILDING_TYPES.HOUSE_BLUE,
            familyId: 'fam-plain',
            x: 132,
            y: 62,
            name: 'Rumah Biasa',
            economyTier: 'Middle',
            familyData: { iksScore: 0.95 }
        }
    ]
};

describe('2D map sprint 5 champion and intel readability', () => {
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

    it('renders stronger champion beacon and protected shield on house markers', () => {
        render(
            <Map2DMarker
                building={{
                    id: 'house-champion',
                    type: BUILDING_TYPES.HOUSE_RED,
                    familyId: 'fam-champion',
                    x: 10,
                    y: 10,
                    economyTier: 'Low',
                    isChampion: true,
                    isChampionProtected: true,
                    familyData: { iksScore: 1.0 }
                }}
                cellSize={10}
                activeLayer="pispk"
                showStatusDetails={true}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.getByTestId('champion-beacon-house-champion')).toBeInTheDocument();
        expect(screen.getByTestId('champion-star-house-champion')).toBeInTheDocument();
        expect(screen.getByTestId('champion-shield-house-champion')).toBeInTheDocument();
    });

    it('shows intel target badge and ring on mapped houses', () => {
        render(
            <Map2DMarker
                building={{
                    id: 'house-intel-marker',
                    type: BUILDING_TYPES.HOUSE_BLUE,
                    familyId: 'fam-intel',
                    x: 20,
                    y: 20,
                    economyTier: 'Middle',
                    isIntelTarget: true,
                    rank: 2,
                    familyData: { iksScore: 0.85 }
                }}
                cellSize={10}
                activeLayer="general"
                showStatusDetails={false}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.getByTestId('intel-ring-house-intel-marker')).toBeInTheDocument();
        expect(screen.getByTestId('intel-badge-house-intel-marker')).toHaveTextContent('2');
    });

    it('keeps intel targets visible even in overview zoom of general mode', async () => {
        setViewportSize(400, 300);
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                lastIntelTargets: [{ familyId: 'fam-intel', distance: 3 }]
            }
        }));

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('intel-badge-house-intel')).toHaveTextContent('1');
        });
        expect(screen.queryByTestId('intel-badge-house-plain')).not.toBeInTheDocument();
    });
});
