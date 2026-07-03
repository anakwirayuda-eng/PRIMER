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
        {
            id: 'rw03-house-a',
            type: BUILDING_TYPES.HOUSE_HUT,
            x: 28,
            y: 38,
            familyId: 'kk_rw03_a',
            familyData: { id: 'kk_rw03_a', rw: '03', rt: '01', iksScore: 0.22, isLocked: true },
            isLocked: true
        },
        {
            id: 'rw03-house-b',
            type: BUILDING_TYPES.HOUSE_BLUE,
            x: 34,
            y: 42,
            familyId: 'kk_rw03_b',
            familyData: { id: 'kk_rw03_b', rw: '03', rt: '02', iksScore: 0.31, isLocked: true },
            isLocked: true
        },
        {
            id: 'rw01-house-a',
            type: BUILDING_TYPES.HOUSE_MODERN,
            x: 82,
            y: 56,
            familyId: 'kk_rw01_a',
            familyData: { id: 'kk_rw01_a', rw: '01', rt: '01', iksScore: 0.75, isLocked: false },
            isLocked: false
        }
    ]
};

describe('2D map blank spot inspector bridge', () => {
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

    it('routes locked RW blank spot chips into the provided dossier callback', async () => {
        const onRwZoneSelect = vi.fn();

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                onRwZoneSelect={onRwZoneSelect}
            />
        );

        const chip = await waitFor(() => screen.getByTestId('rw-zone-chip-03'));
        fireEvent.click(chip);

        expect(onRwZoneSelect).toHaveBeenCalledWith(expect.objectContaining({
            rw: '03',
            familyCount: 2,
            lockedCount: 2,
            isLocked: true
        }));
    });
});
