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
            id: 'house-case',
            type: BUILDING_TYPES.HOUSE_RED,
            x: 82,
            y: 56,
            familyId: 'fam-case',
            name: 'Rumah Kasus',
            economyTier: 'Low',
            hasCase: true,
            familyData: { id: 'fam-case', rw: '01', rt: '01', iksScore: 0.32, hasCase: true },
        },
        {
            id: 'house-neighbor',
            type: BUILDING_TYPES.HOUSE_BLUE,
            x: 88,
            y: 60,
            familyId: 'fam-neighbor',
            name: 'Rumah Tetangga',
            economyTier: 'Middle',
            familyData: { id: 'fam-neighbor', rw: '01', rt: '02', iksScore: 0.82 },
        },
    ]
};

describe('2D map showcase overlays', () => {
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
    const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
    const originalInnerWidth = window.innerWidth;
    const originalMatchMedia = window.matchMedia;

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
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: width,
        });
    };

    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
        setViewportSize(1400, 900);
        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));
    });

    afterEach(() => {
        if (originalClientWidth) {
            Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
        }
        if (originalClientHeight) {
            Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
        }
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: originalInnerWidth,
        });
        window.matchMedia = originalMatchMedia;
    });

    it('renders threat vignette and radar sweep during surveillance outbreaks', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                activeOutbreaks: [
                    {
                        id: 'outbreak-1',
                        type: 'diare',
                        typeData: { label: 'Diare' },
                        affectedHouseIds: ['house-case'],
                        resolved: false,
                    }
                ]
            }
        }));

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="surveillance"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('wilayah-threat-vignette')).toBeInTheDocument();
        });
        expect(screen.getByTestId('wilayah-radar-sweep')).toBeInTheDocument();
        expect(screen.getByTestId('outbreak-zone-bloom-outbreak-1')).toBeInTheDocument();
    });

    it('keeps threat vignette but disables radar sweep on general mode', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                activeOutbreaks: [
                    {
                        id: 'outbreak-2',
                        type: 'ispa',
                        typeData: { label: 'ISPA' },
                        affectedHouseIds: ['house-case'],
                        resolved: false,
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
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('wilayah-threat-vignette')).toBeInTheDocument();
        });
        expect(screen.queryByTestId('wilayah-radar-sweep')).not.toBeInTheDocument();
    });

    it('limits liquid outbreak bloom to surveillance markers only', () => {
        const surveillanceRender = render(
            <Map2DMarker
                building={{
                    id: 'marker-case',
                    type: BUILDING_TYPES.HOUSE_RED,
                    familyId: 'fam-case',
                    x: 12,
                    y: 14,
                    economyTier: 'Low',
                    hasCase: true,
                    familyData: { iksScore: 0.2, hasCase: true }
                }}
                cellSize={10}
                activeLayer="surveillance"
                showStatusDetails={true}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.getByTestId('outbreak-bloom-marker-case')).toBeInTheDocument();
        surveillanceRender.unmount();

        render(
            <Map2DMarker
                building={{
                    id: 'marker-case-general',
                    type: BUILDING_TYPES.HOUSE_RED,
                    familyId: 'fam-case',
                    x: 12,
                    y: 14,
                    economyTier: 'Low',
                    hasCase: true,
                    familyData: { iksScore: 0.2, hasCase: true }
                }}
                cellSize={10}
                activeLayer="general"
                showStatusDetails={true}
                selected={false}
                onClick={() => {}}
            />
        );

        expect(screen.queryByTestId('outbreak-bloom-marker-case-general')).not.toBeInTheDocument();
    });
});
