import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../components/wilayah/2d/Map2DTerrain.jsx', () => ({
    default: ({ bridgeStatus, showBridgeStatusDetails }) => (
        <div
            data-testid="mock-terrain"
            data-bridge-status={bridgeStatus}
            data-show-bridge-detail={String(showBridgeStatusDetails)}
        />
    )
}));

vi.mock('../components/wilayah/2d/Map2DMarker.jsx', () => ({
    default: () => null
}));

import Map2DBlueprint from '../components/wilayah/2d/Map2DBlueprint.jsx';

const MAP_DATA = {
    width: 160,
    height: 120,
    centerX: 80,
    centerY: 60,
    tiles: Array.from({ length: 120 }, () => Array.from({ length: 160 }, () => null)),
    buildings: []
};

describe('Map2D bridge visual feedback', () => {
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

    it('keeps bridge visuals quiet in normal state', async () => {
        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                bridgeStatus="normal"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('mock-terrain')).toHaveAttribute('data-show-bridge-detail', 'true');
        });
        expect(screen.getByTestId('mock-terrain')).toHaveAttribute('data-bridge-status', 'normal');
        expect(screen.queryByTestId('east-sector-overlay')).not.toBeInTheDocument();
    });

    it('shows amber east-sector overlay during rawan_banjir', async () => {
        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                bridgeStatus="rawan_banjir"
            />
        );

        const overlay = await screen.findByTestId('east-sector-overlay');
        expect(screen.getByTestId('mock-terrain')).toHaveAttribute('data-bridge-status', 'rawan_banjir');
        expect(overlay).toHaveStyle({
            background: 'rgba(217,119,6,0.04)'
        });
    });

    it('shows pulsing danger overlay during putus', async () => {
        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                bridgeStatus="putus"
            />
        );

        const overlay = await screen.findByTestId('east-sector-overlay');
        expect(screen.getByTestId('mock-terrain')).toHaveAttribute('data-bridge-status', 'putus');
        expect(overlay.style.animation).toContain('primer-east-danger-pulse');
        expect(overlay.style.borderLeft).toContain('dashed');
    });

    it('hides bridge status details under semantic overview zoom', async () => {
        setViewportSize(400, 300);

        render(
            <Map2DBlueprint
                mapData={MAP_DATA}
                selectedBuildingId={null}
                onBuildingSelect={() => {}}
                activeLayer="general"
                bridgeStatus="putus"
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('mock-terrain')).toHaveAttribute('data-show-bridge-detail', 'false');
        });
        expect(screen.queryByTestId('east-sector-overlay')).not.toBeInTheDocument();
    });
});
