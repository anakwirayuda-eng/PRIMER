/**
 * @reflection
 * [IDENTITY]: scoringEngine
 * [PURPOSE]: Skor Kinerja Terpadu PRIMER — formula 4-dimensi pedagogis
 *            (UKP / UKM / Manajemen / Ketahanan) yang menggantikan formula
 *            leaderboard arbitrer di CloudSaveService. Mendesain anti-min-max
 *            via Referral Guillotine (RRNS) dan Apathy Penalty (BC omission)
 *            sehingga "main curang" (over-refer, klik-kosong di home visit)
 *            menghasilkan skor rendah meski metrik permukaan tampak bagus.
 *
 *            Adopt rekomendasi DeepThink (review 2026-04-26) dengan adjustment
 *            untuk durasi 90-hari single track + continue mode.
 *
 *            Referensi pedagogis:
 *            - Permenkes 39/2016 (PIS-PK 12 indikator)
 *            - Michie 2011 (COM-B + apathy = omission failure)
 *            - Hamari et al. 2014 (anti-min-max design)
 *            - Graafland et al. 2012 (medical serious-game integrity)
 *
 * [STATE]: Production
 * [ANCHOR]: calculatePerformanceScore
 * [DEPENDS_ON]: pisPkIndicators, NPCReadiness
 * [LAST_UPDATE]: 2026-04-26
 */

import { calculateVillageIKSPisPk } from '../domains/village/pisPkIndicators.js';
import { calculateVillageIKS as calculateReadinessVillageIKS } from '../domains/village/NPCReadiness.js';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

/** Bobot per dimensi (total 100). */
export const SCORE_WEIGHTS = Object.freeze({
    UKP: 35,
    UKM: 35,
    MANAGEMENT: 15,
    RESILIENCE: 15,
});

/**
 * Pemetaan tier akreditasi Puskesmas → poin manajemen.
 * Mendorong pemain me-reinvestasi kapitasi ke fasilitas, bukan menimbun uang.
 */
export const ACCREDITATION_POINTS = Object.freeze({
    Dasar: 4,
    Madya: 8,
    Utama: 12,
    Paripurna: 15,
});

/** Penalti per kejadian omisi UKM (klik kosong di home visit). */
export const APATHY_PENALTY_PER_EVENT = 5;

/** Penalti per kejadian pingsan (burnout). */
export const FAINTED_PENALTY_PER_EVENT = 5;

/**
 * Threshold grade akhir. Adopt langsung dari rekomendasi DeepThink:
 *   ≥85 PTT Teladan / 70-84 Kompeten / 55-69 Lulus / <55 Belajar.
 */
export const GRADE_THRESHOLDS = Object.freeze([
    { min: 85, grade: 'A', label: 'PTT Teladan', color: 'emerald' },
    { min: 70, grade: 'B', label: 'Kompeten', color: 'sky' },
    { min: 55, grade: 'C', label: 'Lulus', color: 'amber' },
    { min: 0, grade: 'D', label: 'Belajar / Recall Dinkes', color: 'rose' },
]);

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    if (n < min) return min;
    if (n > max) return max;
    return n;
};

const numberOr = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};

// ═══════════════════════════════════════════════════════════════
// 1. UKP CLINICAL — 35 POIN dengan REFERRAL GUILLOTINE
// ═══════════════════════════════════════════════════════════════

/**
 * Multiplier guillotine berdasarkan RRNS (Rasio Rujukan Non-Spesialistik).
 * Toleransi Kemenkes ≤5%. Setiap 1% di atas 5% memotong multiplier 5%.
 * RRNS ≥25% = multiplier 0 (akurasi 100% pun jadi 0 poin UKP).
 *
 * @param {number} rrnsPercent - 0-100
 * @returns {number} multiplier 0..1
 */
export function calculateReferralGuillotine(rrnsPercent) {
    const rrns = numberOr(rrnsPercent, 0);
    return Math.max(0, Math.min(1, 1 - (rrns - 5) * 0.05));
}

/**
 * UKP score: clinicalAccuracy × 35 × Referral_Guillotine.
 * @param {{clinicalAccuracy?:number, rrns?:number}} derivedKpis
 * @returns {{score:number, accuracy:number, rrns:number, guillotine:number}}
 */
export function calculateClinicalScore(derivedKpis) {
    const accuracy = clamp(derivedKpis?.clinicalAccuracy, 0, 100);
    const rrns = clamp(derivedKpis?.rrns, 0, 100);
    const guillotine = calculateReferralGuillotine(rrns);
    const score = (accuracy / 100) * SCORE_WEIGHTS.UKP * guillotine;
    return {
        score: Math.max(0, Math.min(SCORE_WEIGHTS.UKP, score)),
        accuracy,
        rrns,
        guillotine,
    };
}

// ═══════════════════════════════════════════════════════════════
// 2. UKM COMMUNITY — 35 POIN dengan APATHY PENALTY
// ═══════════════════════════════════════════════════════════════

/**
 * Hitung jumlah BC case dengan apathyPenalty=true di history klinis.
 * Referensi: BehaviorCaseEngine line 281 — apathy = pemain klik-kosong saat
 * home visit (datang tapi tidak input apa-apa). Omisi sama fatalnya dengan
 * salah tindakan (Michie 2011 — capability without action = behavior gap).
 */
export function countApathyEvents(clinicalHistory) {
    if (!Array.isArray(clinicalHistory)) return 0;
    return clinicalHistory.reduce((count, entry) => {
        if (entry?.comBDiagnosis?.apathyPenalty === true) return count + 1;
        if (entry?.behaviorCase?.comBDiagnosis?.apathyPenalty === true) return count + 1;
        return count;
    }, 0);
}

/**
 * UKM score: kkSehat (15) + readinessTTM (20) − apathyPenalty (5/event).
 * Dua sub-metrik: PIS-PK Kemenkes (output administratif) + Readiness COM-B
 * (kualitas diagnostik). DeepThink memberi bobot lebih ke readiness karena
 * itu kerja diagnosis-level mahasiswa, bukan sekadar coverage angka.
 *
 * @param {Array} families - publicHealth.villageData.families
 * @param {Object} readinessState - publicHealth.villageData.readinessState
 * @param {Array} clinicalHistory - clinical.history (untuk count apathy)
 * @returns {{score, kkSehatPoints, readinessPoints, apathyEvents, apathyPenalty}}
 */
export function calculateCommunityScore(families, readinessState, clinicalHistory) {
    const familiesArr = Array.isArray(families) ? families : [];
    const pisPk = calculateVillageIKSPisPk(familiesArr);
    const kkSehatPercent = clamp(pisPk.kkSehatPercent, 0, 100);

    // Hanya hitung readiness untuk keluarga yang sudah di-engage agar tidak
    // membohongi pemain dengan baseline 0 sbg 100% (precontemplation = stage 0).
    const engagedReadinessState = Object.fromEntries(
        Object.entries(readinessState || {}).filter(([, entry]) =>
            (Number(entry?.visitCount) || 0) > 0 ||
            (Array.isArray(entry?.stageHistory) && entry.stageHistory.length > 0)
        )
    );
    const readinessRaw = Object.keys(engagedReadinessState).length > 0
        ? clamp(calculateReadinessVillageIKS(engagedReadinessState).iks, 0, 100)
        : 0;

    const kkSehatPoints = (kkSehatPercent / 100) * 15;
    const readinessPoints = (readinessRaw / 100) * 20;

    const apathyEvents = countApathyEvents(clinicalHistory);
    const apathyPenalty = apathyEvents * APATHY_PENALTY_PER_EVENT;

    const raw = kkSehatPoints + readinessPoints - apathyPenalty;
    const score = Math.max(0, Math.min(SCORE_WEIGHTS.UKM, raw));

    return {
        score,
        kkSehatPoints,
        readinessPoints,
        apathyEvents,
        apathyPenalty,
        kkSehatPercent,
        readinessPercent: readinessRaw,
    };
}

// ═══════════════════════════════════════════════════════════════
// 3. MANAGEMENT — 15 POIN
// ═══════════════════════════════════════════════════════════════

/**
 * @param {string} accreditation - 'Dasar' | 'Madya' | 'Utama' | 'Paripurna'
 */
export function calculateManagementScore(accreditation) {
    const points = ACCREDITATION_POINTS[accreditation] ?? 0;
    return {
        score: Math.max(0, Math.min(SCORE_WEIGHTS.MANAGEMENT, points)),
        accreditation: accreditation || 'Dasar',
    };
}

// ═══════════════════════════════════════════════════════════════
// 4. RESILIENCE — 15 POIN
// ═══════════════════════════════════════════════════════════════

/**
 * Resilience = reputation × 0.15 − fainted × 5. Dokter yang terus-menerus
 * tumbang adalah beban darurat medis tambahan, bukan dokter Puskesmas yang
 * kompeten (Bandura — self-efficacy + sustainable practice).
 */
export function calculateResilienceScore(player) {
    const reputation = clamp(player?.reputation, 0, 100);
    const faintedCount = Math.max(0, numberOr(player?.faintedCount, 0));
    const reputationPoints = reputation * 0.15;
    const faintedPenalty = faintedCount * FAINTED_PENALTY_PER_EVENT;
    const raw = reputationPoints - faintedPenalty;
    const score = Math.max(0, Math.min(SCORE_WEIGHTS.RESILIENCE, raw));
    return {
        score,
        reputation,
        reputationPoints,
        faintedCount,
        faintedPenalty,
    };
}

// ═══════════════════════════════════════════════════════════════
// GRADE
// ═══════════════════════════════════════════════════════════════

export function gradeFromScore(total) {
    const score = numberOr(total, 0);
    return GRADE_THRESHOLDS.find((tier) => score >= tier.min) || GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];
}

// ═══════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Hitung Skor Kinerja Terpadu dari snapshot Zustand state.
 * Input adalah full state shape (post-canonicalSavePayload atau live store).
 *
 * @param {Object} state - { player, clinical, publicHealth, derivedKpis?, world? }
 * @returns {{
 *   total: number,
 *   grade: { grade, label, color },
 *   ukp: object, ukm: object, management: object, resilience: object,
 *   meta: { day, computedAt }
 * }}
 */
export function calculatePerformanceScore(state) {
    const safe = state || {};
    const derivedKpis = safe.derivedKpis || {};
    const player = safe.player?.profile || safe.player || {};
    const clinical = safe.clinical || {};
    const publicHealth = safe.publicHealth || {};
    const village = publicHealth.villageData || {};

    const ukp = calculateClinicalScore(derivedKpis);
    const ukm = calculateCommunityScore(
        village.families,
        village.readinessState,
        clinical.history
    );
    const management = calculateManagementScore(clinical.accreditation);
    const resilience = calculateResilienceScore(player);

    const totalRaw = ukp.score + ukm.score + management.score + resilience.score;
    const total = Math.max(0, Math.min(100, totalRaw));
    const grade = gradeFromScore(total);

    return {
        total,
        grade,
        ukp,
        ukm,
        management,
        resilience,
        meta: {
            day: safe.world?.day ?? null,
            computedAt: Date.now(),
        },
    };
}

export default {
    SCORE_WEIGHTS,
    ACCREDITATION_POINTS,
    APATHY_PENALTY_PER_EVENT,
    FAINTED_PENALTY_PER_EVENT,
    GRADE_THRESHOLDS,
    calculateReferralGuillotine,
    calculateClinicalScore,
    countApathyEvents,
    calculateCommunityScore,
    calculateManagementScore,
    calculateResilienceScore,
    gradeFromScore,
    calculatePerformanceScore,
};
