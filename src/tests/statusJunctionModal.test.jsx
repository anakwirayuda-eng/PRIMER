import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

vi.mock('../components/AvatarRenderer.jsx', () => ({
    default: () => null
}));

import StatusJunctionModal from '../components/StatusJunctionModal.jsx';

describe('StatusJunctionModal finance footer', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('shows active funds wording instead of revenue wording', () => {
        mockUseGame.mockReturnValue({
            playerProfile: { name: 'Dokter Test' },
            playerStats: {
                level: 2,
                xp: 100,
                nextLevelXp: 1000,
                playTime: 8,
                energy: 80,
                maxEnergy: 100,
                stress: 10,
                knowledge: 5,
                confidence: 7,
                hygiene: 9
            },
            skills: [],
            activeQuests: [],
            derivedKpis: {
                availableFunds: 50_250_000
            }
        });

        render(<StatusJunctionModal onClose={() => {}} onOpenWiki={() => {}} />);

        expect(screen.getByText(/GIL \(Dana Aktif\):/i)).toBeInTheDocument();
        expect(screen.getByText(/50\.250\.000/)).toBeInTheDocument();
    });
});
