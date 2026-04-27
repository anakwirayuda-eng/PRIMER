import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const showToastMock = vi.fn();

vi.mock('../utils/ToastManager.js', () => ({
    showToast: (...args) => showToastMock(...args),
}));

import { useChampionPromotionWatcher } from '../hooks/useChampionPromotionWatcher.js';

describe('useChampionPromotionWatcher', () => {
    beforeEach(() => {
        showToastMock.mockReset();
    });

    it('is silent on first mount (baseline snapshot only)', () => {
        const families = [
            { id: 'kk_01', surname: 'Santoso', iksScore: 1.0 },
            { id: 'kk_02', surname: 'Widodo', iksScore: 0.85 },
        ];
        renderHook(({ fam }) => useChampionPromotionWatcher(fam), {
            initialProps: { fam: families },
        });
        expect(showToastMock).not.toHaveBeenCalled();
    });

    it('fires a success toast when a family newly crosses IKS 1.0', () => {
        const families = [
            { id: 'kk_01', surname: 'Santoso', iksScore: 0.92 },
            { id: 'kk_02', surname: 'Widodo', iksScore: 0.70 },
        ];
        const { rerender } = renderHook(({ fam }) => useChampionPromotionWatcher(fam), {
            initialProps: { fam: families },
        });

        // Promote kk_01 to 1.0
        rerender({
            fam: [
                { id: 'kk_01', surname: 'Santoso', iksScore: 1.0 },
                { id: 'kk_02', surname: 'Widodo', iksScore: 0.70 },
            ],
        });

        expect(showToastMock).toHaveBeenCalledTimes(1);
        const [message, type] = showToastMock.mock.calls[0];
        expect(message).toContain('Kader Lokal');
        expect(message).toContain('Kel. Santoso');
        expect(message).toContain('IKS 100%');
        expect(type).toBe('success');
    });

    it('does not re-fire for families that were already champions', () => {
        const families = [
            { id: 'kk_01', surname: 'Santoso', iksScore: 1.0 },
        ];
        const { rerender } = renderHook(({ fam }) => useChampionPromotionWatcher(fam), {
            initialProps: { fam: families },
        });

        // Same champion on next tick — should stay silent
        rerender({ fam: [{ id: 'kk_01', surname: 'Santoso', iksScore: 1.0 }] });
        expect(showToastMock).not.toHaveBeenCalled();
    });

    it('stays silent when a champion loses status (regression)', () => {
        const { rerender } = renderHook(({ fam }) => useChampionPromotionWatcher(fam), {
            initialProps: { fam: [{ id: 'kk_01', surname: 'Santoso', iksScore: 1.0 }] },
        });

        // IKS drops — should not emit any toast (MVP scope: only promotions)
        rerender({ fam: [{ id: 'kk_01', surname: 'Santoso', iksScore: 0.88 }] });
        expect(showToastMock).not.toHaveBeenCalled();
    });

    it('handles multiple simultaneous promotions', () => {
        const { rerender } = renderHook(({ fam }) => useChampionPromotionWatcher(fam), {
            initialProps: {
                fam: [
                    { id: 'kk_01', surname: 'A', iksScore: 0.9 },
                    { id: 'kk_02', surname: 'B', iksScore: 0.9 },
                ],
            },
        });

        rerender({
            fam: [
                { id: 'kk_01', surname: 'A', iksScore: 1.0 },
                { id: 'kk_02', surname: 'B', iksScore: 1.0 },
            ],
        });

        expect(showToastMock).toHaveBeenCalledTimes(2);
    });

    it('falls back to family id when surname is missing', () => {
        const { rerender } = renderHook(({ fam }) => useChampionPromotionWatcher(fam), {
            initialProps: { fam: [{ id: 'kk_99', iksScore: 0.9 }] },
        });

        rerender({ fam: [{ id: 'kk_99', iksScore: 1.0 }] });
        expect(showToastMock).toHaveBeenCalledWith(
            expect.stringContaining('Keluarga kk_99'),
            'success',
            expect.any(Number)
        );
    });

    it('tolerates empty/null family arrays', () => {
        const { rerender } = renderHook(({ fam }) => useChampionPromotionWatcher(fam), {
            initialProps: { fam: null },
        });
        rerender({ fam: [] });
        rerender({ fam: undefined });
        expect(showToastMock).not.toHaveBeenCalled();
    });
});
