import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function CrashyPanel() {
    throw new Error('boom');
}

describe('ErrorBoundary', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        cleanup();
        consoleErrorSpy.mockRestore();
    });

    it('shows a secondary recovery action for contextual escape hatches', () => {
        const handleClose = vi.fn();

        render(
            <ErrorBoundary
                name="QuestBoard"
                fallbackAction={handleClose}
                fallbackActionLabel="Tutup Panel"
            >
                <CrashyPanel />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Tutup Panel' }));

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('resets automatically when resetKeys change', () => {
        const { rerender } = render(
            <ErrorBoundary name="Widget" resetKeys={['alpha']}>
                <CrashyPanel />
            </ErrorBoundary>
        );

        expect(screen.getByText('Terjadi Kesalahan')).toBeInTheDocument();

        rerender(
            <ErrorBoundary name="Widget" resetKeys={['beta']}>
                <div>Recovered</div>
            </ErrorBoundary>
        );

        expect(screen.getByText('Recovered')).toBeInTheDocument();
    });
});
