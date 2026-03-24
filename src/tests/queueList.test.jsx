import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();
const mockUseGameStore = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../store/useGameStore.js', () => ({
    useGameStore: (selector) => selector ? selector(mockUseGameStore()) : mockUseGameStore()
}));

vi.mock('../context/ThemeContext.jsx', () => ({
    useTheme: () => ({ isDark: false })
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key === 'dashboard.waiting' ? 'waiting' : key })
}));

vi.mock('../utils/AvatarUtils.js', () => ({
    getAvatarStyle: () => ({ width: 36, height: 36, backgroundColor: '#eee' })
}));

import QueueList from '../components/QueueList.jsx';

describe('QueueList follow-up badge', () => {
    afterEach(() => {
        mockUseGame.mockReset();
        mockUseGameStore.mockReset();
    });

    it('shows upcoming follow-up count within 3 days', () => {
        mockUseGame.mockReturnValue({
            queue: [],
            admitPatient: vi.fn(),
            activePatientId: null,
            delegateToMaia: vi.fn(),
            time: 600,
            day: 10
        });
        mockUseGameStore.mockReturnValue({
            clinical: {
                consequenceQueue: [
                    { returnDay: 11 },
                    { returnDay: 13 },
                    { returnDay: 20 }
                ]
            }
        });

        render(<QueueList activeService={{ id: 'poli_umum', name: 'Poli Umum' }} />);

        expect(screen.getByText('2 kontrol')).toBeInTheDocument();
    });
});
