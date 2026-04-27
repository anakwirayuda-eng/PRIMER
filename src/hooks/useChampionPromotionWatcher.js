/**
 * @reflection
 * [IDENTITY]: useChampionPromotionWatcher
 * [PURPOSE]: Detect when a family crosses the Local Champion threshold
 *            (IKS 100% — full 12 PIS-PK Kemenkes + PSN fulfilled) and surface
 *            a positive toast. Previously a silent mechanic: buff activated
 *            in the background without student feedback.
 * [STATE]: Experimental
 * [ANCHOR]: useChampionPromotionWatcher
 * [DEPENDS_ON]: ToastManager, localChampion
 * [LAST_UPDATE]: 2026-04-23
 */

import { useEffect, useRef } from 'react';
import { showToast } from '../utils/ToastManager.js';
import { isLocalChampionEligible } from '../domains/village/localChampion.js';

/**
 * Watch the village families array; toast once whenever a family newly
 * reaches champion status. Skips the initial mount (existing champions on
 * save-load should not re-trigger notifications).
 *
 * @param {Array<{id:string, iksScore?:number, surname?:string}>} families
 */
export function useChampionPromotionWatcher(families) {
    const prevChampionsRef = useRef(null);

    useEffect(() => {
        const list = Array.isArray(families) ? families : [];
        const currentIds = new Set(
            list
                .filter((fam) => fam && isLocalChampionEligible(fam.iksScore))
                .map((fam) => fam.id)
        );

        // First run / after save-load: snapshot baseline silently — no toast spam.
        if (prevChampionsRef.current === null) {
            prevChampionsRef.current = currentIds;
            return;
        }

        const prev = prevChampionsRef.current;
        const newlyPromoted = [];
        currentIds.forEach((id) => {
            if (!prev.has(id)) newlyPromoted.push(id);
        });

        if (newlyPromoted.length > 0) {
            const byId = new Map(list.map((fam) => [fam.id, fam]));
            newlyPromoted.forEach((id) => {
                const fam = byId.get(id);
                const label = fam?.surname ? `Kel. ${fam.surname}` : `Keluarga ${id}`;
                showToast(`⭐ Kader Lokal baru: ${label} mencapai IKS 100%`, 'success', 5000);
            });
        }

        prevChampionsRef.current = currentIds;
    }, [families]);
}

export default useChampionPromotionWatcher;
