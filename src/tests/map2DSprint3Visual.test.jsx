import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
        { id: 'polindes', type: BUILDING_TYPES.POLINDES, x: 25, y: 95, name: 'Polindes Desa' },
        { id: 'jembatan_gantung', type: BUILDING_TYPES.JEMBATAN, x: 148, y: 25, name: 'Jembatan Gantung' }
    ]
};

describe('2D map sprint 3 visuals', () => {
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

    it('shows only the puskesmas ring in detective mode by default', async () => {
        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="surveillance"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('service-ring-puskesmas')).toBeInTheDocument();
        });
        expect(screen.queryByTestId('service-ring-pustu')).not.toBeInTheDocument();
        expect(screen.queryByTestId('service-ring-polindes')).not.toBeInTheDocument();
    });

    it('hides service coverage rings in general layer', async () => {
        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
            />
        );

        await waitFor(() => {
            expect(screen.queryByTestId('service-ring-puskesmas')).not.toBeInTheDocument();
        });
    });

    it('adds satellite and inner level-2 rings for upgraded FOB anchors', async () => {
        useGameStore.setState((state) => ({
            ...state,
            publicHealth: {
                ...state.publicHealth,
                buildingProgress: {
                    ...state.publicHealth.buildingProgress,
                    pustu: { completed: true, level: 2, isActive: true },
                    fob: { completed: true, level: 2 }
                }
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
            expect(screen.getByTestId('service-ring-pustu')).toBeInTheDocument();
        });
        expect(screen.getByTestId('service-ring-inner-pustu')).toBeInTheDocument();
    });

    it('shows a bridge repair chip during active outage and clears it after a successful repair', async () => {
        useGameStore.setState((state) => ({
            ...state,
            world: {
                ...state.world,
                day: 10
            },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 100
                }
            },
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 10,
                lastBridgeRepairDay: -1
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

        const chip = await screen.findByTestId('bridge-repair-chip');
        expect(chip).toHaveTextContent('PERBAIKI');

        fireEvent.click(chip);

        await waitFor(() => {
            expect(screen.queryByTestId('bridge-repair-chip')).not.toBeInTheDocument();
        });
        expect(useGameStore.getState().publicHealth.bridgeOutageUntilDay).toBe(9);
    });

    it('shows the repair failure message when energy is insufficient', async () => {
        useGameStore.setState((state) => ({
            ...state,
            world: {
                ...state.world,
                day: 10
            },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 10
                }
            },
            publicHealth: {
                ...state.publicHealth,
                bridgeOutageUntilDay: 12,
                lastBridgeRepairDay: -1
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

        const chip = await screen.findByTestId('bridge-repair-chip');
        fireEvent.click(chip);

        await waitFor(() => {
            expect(screen.getByTestId('bridge-repair-chip')).toHaveTextContent('Energi tidak cukup');
        });
        expect(useGameStore.getState().publicHealth.bridgeOutageUntilDay).toBe(12);
    });
});
