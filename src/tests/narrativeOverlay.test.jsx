import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

import NarrativeOverlay from '../components/NarrativeOverlay.jsx';

describe('NarrativeOverlay', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('disables unaffordable story choices using pooled operational funds', () => {
        mockUseGame.mockReturnValue({
            advanceStory: vi.fn(),
            stats: {
                pendapatanUmum: 0,
                kapitasi: 100000,
                availableFunds: 100000
            }
        });

        render(
            <NarrativeOverlay
                storyInstance={{ templateId: 'cikapas_hysteria', instanceId: 'story-1', currentNodeId: 'start' }}
                onClose={vi.fn()}
            />
        );

        const costlyChoice = screen.getByRole('button', { name: /Kirim tim investigasi kesehatan/i });
        expect(costlyChoice).toBeDisabled();
        expect(screen.getByText(/Butuh Rp 500.000/i)).toBeInTheDocument();
    });

    it('renders action-node story progress without expecting dialog choices', () => {
        mockUseGame.mockReturnValue({
            advanceStory: vi.fn(),
            stats: {
                pendapatanUmum: 0,
                kapitasi: 100000,
                availableFunds: 100000
            }
        });

        render(
            <NarrativeOverlay
                storyInstance={{ templateId: 'cikapas_hysteria', instanceId: 'story-2', currentNodeId: 'team_sent', progress: 1 }}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByText(/Tim sedang menganalisis sampel air dan udara di lokasi/i)).toBeInTheDocument();
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
        expect(screen.queryByText(/Tentukan Pilihanmu/i)).not.toBeInTheDocument();
    });
});
