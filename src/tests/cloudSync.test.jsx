import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../context/AuthContext.jsx', () => ({
    useAuth: () => ({ isOnline: true })
}));

vi.mock('../services/CloudSaveService.js', () => ({
    CloudSaveService: {
        saveToCloud: vi.fn(async () => ({ success: true, error: null }))
    }
}));

vi.mock('../services/AnalyticsService.js', () => ({
    AnalyticsService: {
        trackEvent: vi.fn(),
        trackGameSaved: vi.fn()
    }
}));

vi.mock('../utils/GameIntegrity.js', () => ({
    sanityCheckState: vi.fn(() => ({ valid: true, violations: [] })),
    generateIntegrityHash: vi.fn(async () => 'integrity-hash')
}));

import { useCloudSync } from '../hooks/useCloudSync.js';
import { CloudSaveService } from '../services/CloudSaveService.js';
import { AnalyticsService } from '../services/AnalyticsService.js';
import { useGameStore } from '../store/useGameStore.js';

describe('useCloudSync', () => {
    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-03-20T08:00:00Z'));
        CloudSaveService.saveToCloud.mockClear();
        AnalyticsService.trackEvent.mockClear();
        AnalyticsService.trackGameSaved.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('syncs to cloud after the in-store day changes', async () => {
        const { unmount } = renderHook(() => useCloudSync({ slotId: 'slot-cloud', enabled: true }));

        act(() => {
            useGameStore.setState((state) => ({
                world: {
                    ...state.world,
                    day: 2
                }
            }));
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(2000);
        });

        expect(CloudSaveService.saveToCloud).toHaveBeenCalledTimes(1);
        expect(CloudSaveService.saveToCloud).toHaveBeenCalledWith(
            'slot-cloud',
            expect.objectContaining({
                saveVersion: expect.any(Number),
                savedAt: expect.any(Number),
                _integrity: 'integrity-hash',
                world: expect.objectContaining({ day: 2 })
            })
        );
        expect(AnalyticsService.trackGameSaved).toHaveBeenCalledWith('slot-cloud');

        unmount();
    });
});
