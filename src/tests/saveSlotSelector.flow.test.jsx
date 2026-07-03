import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const safeGetStorageItemMock = vi.fn();

vi.mock('../components/AvatarRenderer.jsx', () => ({
    default: () => null
}));

vi.mock('../assets/assets.js', () => ({
    ASSET_KEY: { ITS_LOGO: 'its', FKK_LOGO: 'fkk' },
    getAssetUrl: vi.fn(() => null)
}));

vi.mock('../utils/browserSafety.js', () => ({
    safeGetStorageItem: (...args) => safeGetStorageItemMock(...args),
    safeSetStorageItem: vi.fn(() => true),
    safeRemoveStorageItem: vi.fn(() => true)
}));

import SaveSlotSelector from '../components/SaveSlotSelector.jsx';

describe('SaveSlotSelector transition handoff', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        safeGetStorageItemMock.mockReset();
        safeGetStorageItemMock.mockReturnValue(null);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('delays new-game handoff until the cinematic transition completes', async () => {
        const onNewGame = vi.fn();

        render(<SaveSlotSelector onSelectSlot={() => {}} onNewGame={onNewGame} />);

        fireEvent.click(screen.getByRole('button', { name: /inisiasi sistem/i }));
        fireEvent.click(screen.getAllByRole('button', { name: /inisiasi/i })[0]);

        expect(onNewGame).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1199);
        });

        expect(onNewGame).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(onNewGame).toHaveBeenCalledWith(0);
    });

    it('cancels the pending handoff when the selector unmounts mid-transition', async () => {
        const onNewGame = vi.fn();

        const { unmount } = render(<SaveSlotSelector onSelectSlot={() => {}} onNewGame={onNewGame} />);

        fireEvent.click(screen.getByRole('button', { name: /inisiasi sistem/i }));
        fireEvent.click(screen.getAllByRole('button', { name: /inisiasi/i })[0]);

        unmount();

        act(() => {
            vi.advanceTimersByTime(1200);
        });

        expect(onNewGame).not.toHaveBeenCalled();
    });
});
