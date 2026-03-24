import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();
const mockUseGameStore = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../store/useGameStore.js', () => ({
    useGameStore: (selector) => selector ? selector(mockUseGameStore()) : mockUseGameStore()
}));

vi.mock('../utils/prophylaxis.js', () => ({
    guardStability: vi.fn()
}));

vi.mock('../components/OrderModal.jsx', () => ({
    default: () => null
}));

import InventoryPage from '../components/InventoryPage.jsx';

describe('InventoryPage procurement log', () => {
    afterEach(() => {
        mockUseGame.mockReset();
        mockUseGameStore.mockReset();
    });

    it('shows reverse-chronological procurement entries in the collapsible table', { timeout: 15000 }, () => {
        mockUseGame.mockReturnValue({
            pharmacyInventory: [{ medicationId: 'paracetamol', stock: 10 }],
            pendingOrders: [],
            day: 7
        });
        mockUseGameStore.mockReturnValue({
            finance: {
                procurementLog: [
                    { orderId: 'ord-1', supplierName: 'Dinkes', itemCount: 2, cost: 50000, day: 3, isExpress: false },
                    { orderId: 'ord-2', supplierName: 'Vendor Swasta', itemCount: 1, cost: 150000, day: 5, receiptMode: 'auto', isExpress: true }
                ]
            }
        });

        render(<InventoryPage />);

        fireEvent.click(screen.getByRole('button', { name: /riwayat pembelian/i }));

        const latestRow = screen.getByText('Vendor Swasta').closest('tr');
        const olderRow = screen.getByText('Dinkes').closest('tr');

        expect(latestRow).toHaveTextContent('Hari 5');
        expect(latestRow).toHaveTextContent('AUTO');
        expect(olderRow).toHaveTextContent('Hari 3');
        expect(olderRow).toHaveTextContent('REGULAR');
    });
});
