import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGame } from '../context/GameContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

function GameProbe() {
    useGame();
    return <div>game</div>;
}

function ThemeProbe() {
    useTheme();
    return <div>theme</div>;
}

describe('context guardrails', () => {
    it('throws a clear error when useGame is called outside GameProvider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<GameProbe />)).toThrow('useGame must be used within GameProvider.');

        consoleSpy.mockRestore();
    });

    it('throws a clear error when useTheme is called outside ThemeProvider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<ThemeProbe />)).toThrow('useTheme must be used within ThemeProvider.');

        consoleSpy.mockRestore();
    });
});
