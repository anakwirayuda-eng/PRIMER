import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

import QuestBoard from '../components/QuestBoard.jsx';

describe('QuestBoard', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('renders story progress from the canonical node target field', () => {
        mockUseGame.mockReturnValue({
            activeQuests: [],
            claimQuest: vi.fn(),
            activeStories: [
                {
                    templateId: 'cikapas_hysteria',
                    instanceId: 'story-1',
                    currentNodeId: 'team_sent',
                    progress: 2,
                    completed: false
                }
            ]
        });

        render(<QuestBoard />);

        expect(screen.getByText(/Misteri Sungai Cikapas/i)).toBeInTheDocument();
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
});
