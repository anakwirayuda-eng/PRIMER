function formatMillions(value, fractionDigits = 2) {
    return `Rp ${(Number(value || 0) / 1000000).toFixed(fractionDigits)}M`;
}

function getLatestMonthlyReport(monthlyArchive = []) {
    return Array.isArray(monthlyArchive) && monthlyArchive.length > 0
        ? monthlyArchive[monthlyArchive.length - 1]
        : null;
}

export function getCycleReceipts(stats = {}, monthlyArchive = []) {
    const latestMonthlyReport = getLatestMonthlyReport(monthlyArchive);
    return Number(
        stats?.pendapatanJkn
        ?? stats?.currentCycleReceipts
        ?? latestMonthlyReport?.serviceRevenue
        ?? 0
    );
}

export function buildLiquidityWikiStats(stats = {}) {
    const availableFunds = Number(
        stats?.availableFunds
        ?? ((Number(stats?.kapitasi) || 0) + (Number(stats?.pendapatanUmum) || 0))
    );

    return {
        'Dana Aktif': formatMillions(availableFunds, 1),
        'Penerimaan Siklus': formatMillions(getCycleReceipts(stats), 2),
        'Dana Umum': formatMillions(stats?.pendapatanUmum || 0, 2)
    };
}

export function buildPersonalBankSnapshot(stats = {}, monthlyArchive = [], monthlySalary = 4500000) {
    const jasaPelayananBase = getCycleReceipts(stats, monthlyArchive);
    const jasaPelayanan = Math.floor(jasaPelayananBase * 0.4);
    const personalSavings = Math.max(0, monthlySalary + jasaPelayanan - 15000);

    return {
        monthlySalary,
        jasaPelayananBase,
        jasaPelayanan,
        personalSavings
    };
}
