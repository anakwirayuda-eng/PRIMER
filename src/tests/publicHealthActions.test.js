import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

import { useGameStore } from '../store/useGameStore.js';

describe('publicHealthActions', () => {
    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    it('dismisses outbreak notifications without leaving an undefined action in context consumers', () => {
        useGameStore.setState(state => ({
            publicHealth: {
                ...state.publicHealth,
                outbreakNotification: { id: 'ob-1', title: 'DBD' }
            }
        }));

        expect(typeof useGameStore.getState().publicHealthActions.dismissOutbreakNotification).toBe('function');

        act(() => {
            useGameStore.getState().publicHealthActions.dismissOutbreakNotification();
        });

        expect(useGameStore.getState().publicHealth.outbreakNotification).toBeNull();
    });
});
