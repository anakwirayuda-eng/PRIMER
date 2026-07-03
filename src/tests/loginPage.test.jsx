import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/AuthService', () => ({
    AuthService: {
        signIn: vi.fn(),
        signUp: vi.fn()
    }
}));

import LoginPage from '../components/LoginPage.jsx';

describe('LoginPage quote rotation', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('rotates quotes on a timer and clears timers on unmount', () => {
        vi.useFakeTimers();

        const { unmount } = render(<LoginPage onLoginSuccess={() => {}} />);

        expect(screen.getByText(/dr\. tony iton/i)).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(6500);
        });

        expect(screen.getByText(/rudolf virchow/i)).toBeInTheDocument();

        unmount();

        expect(vi.getTimerCount()).toBe(0);
    });
});
