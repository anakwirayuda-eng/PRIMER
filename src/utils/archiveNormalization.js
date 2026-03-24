function cloneArchiveEntry(entry) {
    return entry && typeof entry === 'object' ? { ...entry } : null;
}

function normalizeArchiveByKey(rawList = [], keyName) {
    if (!Array.isArray(rawList)) return [];

    const keyedEntries = new Map();
    const unkeyedEntries = [];

    rawList.forEach((entry, index) => {
        const safeEntry = cloneArchiveEntry(entry);
        if (!safeEntry) return;

        const numericKey = Number(safeEntry?.[keyName]);
        if (Number.isFinite(numericKey) && numericKey > 0) {
            keyedEntries.set(numericKey, { index, entry: safeEntry });
            return;
        }

        unkeyedEntries.push({ index, entry: safeEntry });
    });

    return [
        ...Array.from(keyedEntries.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([, wrapped]) => wrapped.entry),
        ...unkeyedEntries
            .sort((a, b) => a.index - b.index)
            .map((wrapped) => wrapped.entry)
    ];
}

export function normalizeDailyArchive(rawList = []) {
    return normalizeArchiveByKey(rawList, 'day');
}

export function normalizeMonthlyArchive(rawList = []) {
    return normalizeArchiveByKey(rawList, 'month');
}
