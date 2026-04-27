/**
 * @reflection
 * [IDENTITY]: useFeatureUnlockWatcher
 * [PURPOSE]: Emit positive toast saat pemain melewati threshold unlock fitur
 *            (Day 15 Posyandu, Day 30 Prolanis + Akreditasi Detail, Day 45
 *            Outbreak Investigation). Baseline snapshot silent pada mount
 *            agar save-load tidak spam toast retroaktif.
 * [STATE]: Experimental
 * [ANCHOR]: useFeatureUnlockWatcher
 * [DEPENDS_ON]: ToastManager, featureUnlocks
 * [LAST_UPDATE]: 2026-04-26
 */

import { useEffect, useRef } from 'react';
import { showToast } from '../utils/ToastManager.js';
import { getNewlyUnlockedFeatures } from '../utils/featureUnlocks.js';

/**
 * Watch world.day; toast sekali untuk setiap fitur yang baru di-unlock.
 * @param {number} day - Current world.day from store
 */
export function useFeatureUnlockWatcher(day) {
    const prevDayRef = useRef(null);

    useEffect(() => {
        const safeDay = Number.isFinite(Number(day)) ? Number(day) : null;
        if (safeDay === null) return;

        // First run / save-load: snapshot baseline silently — no retroactive
        // spam untuk fitur yang sudah unlocked sebelum save.
        if (prevDayRef.current === null) {
            prevDayRef.current = safeDay;
            return;
        }

        const newlyUnlocked = getNewlyUnlockedFeatures(prevDayRef.current, safeDay);
        if (newlyUnlocked.length > 0) {
            newlyUnlocked.forEach((feat) => {
                showToast(
                    `${feat.icon} ${feat.label} telah terbuka! ${feat.rationale}`,
                    'success',
                    6000
                );
            });
        }

        prevDayRef.current = safeDay;
    }, [day]);
}

export default useFeatureUnlockWatcher;
