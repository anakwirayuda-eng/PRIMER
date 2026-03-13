import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MEDICATION_DATABASE } from '../data/MedicationDatabase.js';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

import OrderModal from '../components/OrderModal.jsx';

describe('OrderModal', () => {
    beforeEach(() => {
        vi.stubGlobal('alert', vi.fn());
    });

    afterEach(() => {
        mockUseGame.mockReset();
        vi.unstubAllGlobals();
    });

    it('passes the current day to submitOrder', async () => {
        const submitOrder = vi.fn(() => ({ success: true }));
        const medication = MEDICATION_DATABASE[0];

        mockUseGame.mockReturnValue({
            pharmacyInventory: [{ medicationId: medication.id, stock: 0 }],
            submitOrder,
            day: 12,
            stats: {}
        });

        const user = userEvent.setup();
        render(<OrderModal onClose={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: /kirim order/i }));

        expect(submitOrder).toHaveBeenCalledWith(
            [{ medicationId: medication.id, quantity: medication.minStock }],
            'dinkes',
            12
        );
    });
});
