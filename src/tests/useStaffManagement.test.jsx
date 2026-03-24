import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

import { useStaffManagement } from '../hooks/useStaffManagement.js';

describe('useStaffManagement', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('allows hiring against pooled operational funds and spends pendapatan umum before kapitasi', () => {
        const setStats = vi.fn();
        const setHiredStaff = vi.fn();

        mockUseGame.mockReturnValue({
            stats: { pendapatanUmum: 150_000, kapitasi: 250_000 },
            setStats,
            hiredStaff: [],
            setHiredStaff,
            day: 12,
            coachStaff: vi.fn()
        });

        const { result } = renderHook(() => useStaffManagement());

        let outcome;
        act(() => {
            outcome = result.current.hireStaff({
                id: 'perawat_1',
                name: 'Perawat Satu',
                salary: 100_000
            });
        });

        expect(outcome).toMatchObject({ success: true });
        expect(result.current.availableCapital).toBe(400_000);
        expect(setStats).toHaveBeenCalledTimes(1);
        expect(setHiredStaff).toHaveBeenCalledTimes(1);

        const statsUpdater = setStats.mock.calls[0][0];
        expect(statsUpdater({ pendapatanUmum: 150_000, kapitasi: 250_000 })).toEqual({
            pendapatanUmum: 0,
            kapitasi: 100_000
        });
    });
});
