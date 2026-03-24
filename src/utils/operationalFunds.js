export function getAvailableOperationalFunds(stats = {}) {
    return (Number(stats?.pendapatanUmum) || 0) + (Number(stats?.kapitasi) || 0);
}

export function canAffordOperationalCost(stats = {}, amount = 0) {
    const cost = Math.max(0, Number(amount) || 0);
    return getAvailableOperationalFunds(stats) >= cost;
}

/**
 * Deduct operational spending from pooled funds.
 * Current policy spends unrestricted public revenue first, then kapitasi.
 */
export function spendOperationalFunds(stats = {}, amount = 0) {
    const cost = Math.max(0, Number(amount) || 0);
    const currentPendapatanUmum = Number(stats?.pendapatanUmum) || 0;
    const currentKapitasi = Number(stats?.kapitasi) || 0;

    if (cost === 0) {
        return {
            ...stats,
            pendapatanUmum: currentPendapatanUmum,
            kapitasi: currentKapitasi
        };
    }

    if ((currentPendapatanUmum + currentKapitasi) < cost) {
        return null;
    }

    const debitPendapatanUmum = Math.min(currentPendapatanUmum, cost);
    const remainingCost = cost - debitPendapatanUmum;

    return {
        ...stats,
        pendapatanUmum: currentPendapatanUmum - debitPendapatanUmum,
        kapitasi: currentKapitasi - remainingCost
    };
}
