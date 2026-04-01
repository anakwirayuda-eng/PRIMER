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

const DETAIL_MAP = {
    width: 160,
    height: 120,
    centerX: 80,
    centerY: 60,
    tiles: Array.from({ length: 120 }, () => Array.from({ length: 160 }, () => null)),
    buildings: [
        { id: 'pustu-1', type: BUILDING_TYPES.PUSTU, x: 28, y: 50, name: 'Pustu Cikapas' },
        { id: 'house-1', type: BUILDING_TYPES.HOUSE_RED, familyId: 'fam-1', x: 130, y: 60, name: 'Rumah 1', economyTier: 'Low', familyData: { iksScore: 1.0 } },
        { id: 'house-2', type: BUILDING_TYPES.HOUSE_BLUE, familyId: 'fam-2', x: 132, y: 61, name: 'Rumah 2', economyTier: 'Middle', familyData: { iksScore: 0.6 } }
    ]
};

describe('2D map sprint 2 visuals', () => {
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

    it('shows facility upgrade badges from store-backed progress at detail zoom', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                buildingProgress: {
                    ...state.publicHealth.buildingProgress,
                    pustu: { completed: true, level: 1, isActive: true }
                }
            }
        }));

        render(
            <Map2DBlueprint
                mapData={DETAIL_MAP}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                bridgeStatus="normal"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('upgrade-badge-pustu-1')).toBeInTheDocument();
        });
    });

    it('renders champion star and protection ring on house markers', () => {
        render(
            <Map2DMarker
                building={{
                    id: 'house-led',
                    type: BUILDING_TYPES.HOUSE_RED,
                    familyId: 'fam-1',
                    x: 10,
                    y: 10,
                    economyTier: 'Low',
                    isChampion: true,
                    isChampionProtected: true,
                    familyData: { iksScore: 1.0 }
                }}
                cellSize={10}
                activeLayer="general"
                showStatusDetails={true}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.getByTestId('champion-star-house-led')).toBeInTheDocument();
        expect(screen.getByTestId('champion-shield-house-led')).toBeInTheDocument();
    });

    it('hides badge-level detail decorations at overview zoom', () => {
        render(
            <Map2DMarker
                building={{
                    id: 'facility-overview',
                    type: BUILDING_TYPES.POSYANDU,
                    x: 10,
                    y: 10,
                    upgradeStatus: { tone: 'emerald', showRing: true }
                }}
                cellSize={10}
                activeLayer="general"
                showStatusDetails={false}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.queryByTestId('upgrade-badge-facility-overview')).not.toBeInTheDocument();
        expect(screen.queryByTestId('upgrade-ring-facility-overview')).not.toBeInTheDocument();
    });

    it('keeps outbreak cluster zones visible even at overview zoom', async () => {
        setViewportSize(400, 300);
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                activeOutbreaks: [{
                    id: 'ob-1',
                    type: 'dbd',
                    typeData: { label: 'DBD' },
                    affectedHouseIds: ['house-1', 'house-2'],
                    resolved: false
                }]
            }
        }));

        render(
            <Map2DBlueprint
                mapData={DETAIL_MAP}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                bridgeStatus="normal"
            />
        );

        const zone = await screen.findByTestId('outbreak-zone-ob-1');
        expect(zone).toBeInTheDocument();
        expect(zone).toHaveTextContent('WABAH DBD');
    });
});
