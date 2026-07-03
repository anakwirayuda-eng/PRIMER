import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import ToastViewport from '../components/shared/ToastViewport.jsx';
import { confirmToast, showToast } from '../utils/ToastManager.js';

describe('ToastViewport', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders messages pushed through the global toast bus', async () => {
        render(<ToastViewport />);

        act(() => {
            showToast('Sinkronisasi selesai.', 'success', 0);
        });

        expect(await screen.findByText('Sinkronisasi selesai.')).toBeInTheDocument();
    });

    it('resolves confirm toast actions from the global viewport', async () => {
        const user = userEvent.setup();

        render(<ToastViewport />);

        let confirmation;
        await act(async () => {
            confirmation = confirmToast('Buang progres investigasi?', 'warning');
        });

        expect(await screen.findByText('Buang progres investigasi?')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /ya, lanjutkan/i }));

        await expect(confirmation).resolves.toBe(true);
    });
});
