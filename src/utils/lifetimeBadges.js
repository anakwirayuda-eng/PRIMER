/**
 * @reflection
 * [IDENTITY]: lifetimeBadges
 * [PURPOSE]: Layer C (Mastery) — koleksi badge persisten antar playthrough
 *            untuk pemain yang ulang stase. DeepThink M5: insentif intrinsik
 *            tanpa mengganggu skor formal stase. Pemain Grade C yang ulang
 *            untuk hunt badge SKDI Master tetap mendapat skor immutable di
 *            run pertamanya.
 *
 *            Badge eligible saat pemain memenuhi threshold lifetime —
 *            dievaluasi setelah setiap discharge / endgame lock. Award
 *            sekali, tidak berulang.
 *
 * [STATE]: Production
 * [ANCHOR]: BADGE_CATALOGUE
 * [DEPENDS_ON]: (none — pure)
 * [LAST_UPDATE]: 2026-04-26
 */

/**
 * Catalog badge dengan threshold + evaluator function.
 * `condition(lifetime)` returns boolean — apakah pemain layak.
 */
export const BADGE_CATALOGUE = Object.freeze({
    skdi_starter: {
        id: 'skdi_starter',
        label: 'SKDI Starter',
        description: 'Diagnosa benar 10 SKDI unik.',
        icon: '🩺',
        condition: (lifetime) => (lifetime?.skdiTouched?.length ?? 0) >= 10,
    },
    skdi_explorer: {
        id: 'skdi_explorer',
        label: 'SKDI Explorer',
        description: 'Diagnosa benar 50 ICD-10 unik.',
        icon: '🔬',
        condition: (lifetime) => (lifetime?.diagnosisIcdTouched?.length ?? 0) >= 50,
    },
    skdi_master: {
        id: 'skdi_master',
        label: 'SKDI Master',
        description: 'Diagnosa benar 144 ICD-10 unik (FKTP wajib).',
        icon: '🏅',
        condition: (lifetime) => (lifetime?.diagnosisIcdTouched?.length ?? 0) >= 144,
    },
    century_club: {
        id: 'century_club',
        label: 'Century Club',
        description: 'Layani 100 pasien seumur hidup.',
        icon: '💯',
        condition: (lifetime) => (lifetime?.totalCases ?? 0) >= 100,
    },
    veteran: {
        id: 'veteran',
        label: 'Veteran PTT',
        description: 'Layani 500 pasien seumur hidup.',
        icon: '⚕️',
        condition: (lifetime) => (lifetime?.totalCases ?? 0) >= 500,
    },
    stase_lulus: {
        id: 'stase_lulus',
        label: 'Stase Lulus',
        description: 'Selesaikan 1 stase 90-hari dengan Grade C+ (skor ≥55).',
        icon: '🎓',
        condition: (lifetime) => {
            const best = lifetime?.bestStaseGrade;
            return best === 'A' || best === 'B' || best === 'C';
        },
    },
    stase_kompeten: {
        id: 'stase_kompeten',
        label: 'Stase Kompeten',
        description: 'Capai Grade B+ (skor ≥70) di salah satu stase.',
        icon: '🥈',
        condition: (lifetime) => {
            const best = lifetime?.bestStaseGrade;
            return best === 'A' || best === 'B';
        },
    },
    stase_teladan: {
        id: 'stase_teladan',
        label: 'PTT Teladan',
        description: 'Capai Grade A (skor ≥85) di salah satu stase.',
        icon: '🥇',
        condition: (lifetime) => lifetime?.bestStaseGrade === 'A',
    },
    repeated_runner: {
        id: 'repeated_runner',
        label: 'Repeated Runner',
        description: 'Selesaikan 3 stase berbeda sampai endgame.',
        icon: '🏃',
        condition: (lifetime) => (lifetime?.completedStases ?? 0) >= 3,
    },
});

/**
 * Cek badge mana yang layak award berdasarkan lifetime state saat ini.
 * Return array badge IDs yang LAYAK tapi BELUM di-award.
 * @param {Object} lifetime - meta.lifetime
 * @returns {Array<string>} ID badges newly eligible
 */
export function evaluateNewlyEligibleBadges(lifetime) {
    if (!lifetime || typeof lifetime !== 'object') return [];
    const ownedIds = new Set((lifetime.badges || []).map((b) => b.id));
    return Object.values(BADGE_CATALOGUE)
        .filter((badge) => !ownedIds.has(badge.id) && badge.condition(lifetime))
        .map((b) => b.id);
}

/** Total badges available di catalogue. */
export const TOTAL_BADGES = Object.keys(BADGE_CATALOGUE).length;

export default {
    BADGE_CATALOGUE,
    evaluateNewlyEligibleBadges,
    TOTAL_BADGES,
};
