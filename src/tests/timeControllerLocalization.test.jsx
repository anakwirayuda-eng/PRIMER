import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../i18n.js';
import TimeController from '../components/TimeController.jsx';

const mockUseGame = vi.hoisted(() => vi.fn());

vi.mock('../context/GameContext.jsx', () => ({
    useGame: mockUseGame
}));

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        pause: vi.fn(),
        resume: vi.fn(),
        playClick: vi.fn()
    }
}));

function renderTimeController() {
    return render(
        <I18nextProvider i18n={i18n}>
            <TimeController />
        </I18nextProvider>
    );
}

describe('TimeController localization', () => {
    beforeEach(() => {
        mockUseGame.mockReturnValue({
            gameState: 'paused',
            setGameState: vi.fn(),
            day: 2,
            time: (8 * 60) + 53,
            gameSpeed: 1,
            setGameSpeed: vi.fn(),
            gameOver: null
        });
    });

    it('renders the HUD weekday and speed controls in English', async () => {
        await i18n.changeLanguage('en');

        renderTimeController();

        expect(screen.getByText('Fri')).toBeInTheDocument();
        expect(screen.queryByText('Jum')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Pause (Space)')).toBeInTheDocument();
        expect(screen.getByLabelText('Normal speed')).toBeInTheDocument();
    });

    it('keeps the HUD weekday and speed controls localized in Indonesian', async () => {
        await i18n.changeLanguage('id');

        renderTimeController();

        expect(screen.getByText('Jum')).toBeInTheDocument();
        expect(screen.getByLabelText('Jeda (Space)')).toBeInTheDocument();
        expect(screen.getByLabelText('Kecepatan normal')).toBeInTheDocument();
    });
});
