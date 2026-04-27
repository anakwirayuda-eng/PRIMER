/**
 * @reflection
 * [IDENTITY]: featureUnlocks
 * [PURPOSE]: Curriculum scaffolding — gate fitur non-akut di awal stase agar
 *            mahasiswa baru tidak overwhelmed. Pasien klinik (UKP), SISRUTE
 *            rujukan, dan inventaris obat TIDAK pernah di-gate karena clinical
 *            safety. Yang di-gate hanya fitur preventif/komunitas/manajerial
 *            yang tertunda 14-30 hari tidak menimbulkan kerugian medis.
 *
 *            Hierarki keputusan (M3 revisi):
 *            - SISRUTE: tidak di-gate (pasien gawat tidak menunggu Day 15)
 *            - Posyandu: Day 15+ (bulanan, bisa ditunda 14 hari)
 *            - Prolanis: Day 30+ (chronic care, monthly cycle)
 *            - Outbreak Investigation UI: Day 45+ (alert tetap muncul, hanya
 *              UI investigation yang di-gate)
 *            - Detail Akreditasi: Day 30+ (perlu data 1 bulan dulu)
 *
 * [STATE]: Production
 * [ANCHOR]: FEATURE_UNLOCKS
 * [DEPENDS_ON]: (none — pure)
 * [LAST_UPDATE]: 2026-04-26
 */

/** Daftar fitur yang di-gate beserta hari unlock-nya. */
export const FEATURE_UNLOCKS = Object.freeze({
    posyandu: {
        unlockDay: 15,
        label: 'Posyandu',
        rationale: 'Aktivitas Posyandu bulanan; Pekan 1-2 fokus adaptasi triase klinik dulu.',
        icon: '👶',
    },
    prolanis: {
        unlockDay: 30,
        label: 'Klub Prolanis',
        rationale: 'Chronic care DM/HT bersifat bulanan; perlu kestabilan klinik dasar dulu.',
        icon: '💊',
    },
    outbreak_investigation: {
        unlockDay: 45,
        label: 'Investigasi Outbreak',
        rationale: 'Alert outbreak tetap aktif; UI investigasi epidemiologi terbuka setelah pemain mengelola Posyandu + Prolanis.',
        icon: '🦠',
    },
    accreditation_detail: {
        unlockDay: 30,
        label: 'Detail Akreditasi',
        rationale: 'Tracking akreditasi butuh data minimal 1 bulan operasional.',
        icon: '🏥',
    },
});

/**
 * @param {string} featureId - Salah satu key dari FEATURE_UNLOCKS
 * @param {number} day - Current world.day
 * @returns {boolean} true kalau sudah unlocked atau featureId tidak dikenali
 */
export function isFeatureUnlocked(featureId, day) {
    const config = FEATURE_UNLOCKS[featureId];
    if (!config) return true;  // unknown feature → not gated
    const safeDay = Number(day);
    if (!Number.isFinite(safeDay)) return false;
    return safeDay >= config.unlockDay;
}

/**
 * @param {number} day - Current world.day
 * @returns {Array<{id, unlockDay, label, rationale, icon}>}
 */
export function getUnlockedFeatures(day) {
    return Object.entries(FEATURE_UNLOCKS)
        .filter(([, cfg]) => isFeatureUnlocked(cfg, day) === false ? false : Number(day) >= cfg.unlockDay)
        .map(([id, cfg]) => ({ id, ...cfg }));
}

/**
 * Cari fitur yang akan unlock berikutnya — untuk teaser di UI ("Day X buka Y").
 * @param {number} day - Current world.day
 * @returns {{id, unlockDay, label, rationale, icon} | null}
 */
export function getNextUnlock(day) {
    const safeDay = Number.isFinite(Number(day)) ? Number(day) : 0;
    const upcoming = Object.entries(FEATURE_UNLOCKS)
        .filter(([, cfg]) => safeDay < cfg.unlockDay)
        .sort((a, b) => a[1].unlockDay - b[1].unlockDay);
    if (upcoming.length === 0) return null;
    const [id, cfg] = upcoming[0];
    return { id, ...cfg };
}

/**
 * Diff: features yang unlock pada transisi day prev→curr.
 * Useful untuk emit toast saat melewati threshold.
 * @returns {Array<{id, ...cfg}>}
 */
export function getNewlyUnlockedFeatures(prevDay, currDay) {
    const prev = Number.isFinite(Number(prevDay)) ? Number(prevDay) : 0;
    const curr = Number.isFinite(Number(currDay)) ? Number(currDay) : 0;
    if (curr <= prev) return [];
    return Object.entries(FEATURE_UNLOCKS)
        .filter(([, cfg]) => prev < cfg.unlockDay && curr >= cfg.unlockDay)
        .map(([id, cfg]) => ({ id, ...cfg }));
}

export default {
    FEATURE_UNLOCKS,
    isFeatureUnlocked,
    getUnlockedFeatures,
    getNextUnlock,
    getNewlyUnlockedFeatures,
};
