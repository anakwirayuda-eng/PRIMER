/**
 * @reflection
 * [IDENTITY]: DebriefEngine
 * [PURPOSE]: Analyzes daily performance and generates end-of-day reflection data.
 *            Provides educational feedback linking clinical decisions to guidelines.
 * [STATE]: Experimental
 * [ANCHOR]: generateDebrief
 * [DEPENDS_ON]: ConsequenceEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

import { getUpcomingFollowups } from './ConsequenceEngine.js';

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE GRADING
// ═══════════════════════════════════════════════════════════════

const GRADE_THRESHOLDS = [
    { min: 90, grade: 'S', label: 'Luar Biasa!', stars: 5, emoji: '🏆' },
    { min: 80, grade: 'A', label: 'Sangat Baik', stars: 4, emoji: '⭐' },
    { min: 70, grade: 'B', label: 'Baik', stars: 3, emoji: '👍' },
    { min: 50, grade: 'C', label: 'Cukup', stars: 2, emoji: '📋' },
    { min: 0, grade: 'D', label: 'Perlu Perbaikan', stars: 1, emoji: '📉' },
];

function getGrade(score) {
    return GRADE_THRESHOLDS.find(t => score >= t.min) || GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];
}

// ═══════════════════════════════════════════════════════════════
// REFLECTION PROMPT TEMPLATES
// ═══════════════════════════════════════════════════════════════

const REFLECTION_TEMPLATES = {
    missed_diagnosis: (patientName, condition) =>
        `${patientName} terdiagnosis ${condition} — apakah ada tanda yang terlewat saat anamnesis?`,
    incorrect_treatment: (patientName) =>
        `Terapi untuk ${patientName} kurang tepat. Obat apa yang seharusnya diberikan?`,
    good_case: (patientName) =>
        `${patientName} membaik berkat penanganan Anda. Apa kunci keberhasilannya?`,
    time_pressure: () =>
        'Beberapa pasien menunggu terlalu lama. Bagaimana mengoptimalkan alur pelayanan besok?',
    referral_question: (patientName) =>
        `${patientName} dirujuk ke RS. Apakah rujukan ini tepat, atau bisa ditangani di Puskesmas?`,
};

// ═══════════════════════════════════════════════════════════════
// CORE DEBRIEF GENERATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Generate end-of-day debrief from today's case log.
 * 
 * @param {Object} params
 * @param {Array} params.todayLog - Array of case outcome records
 * @param {Array} params.consequenceQueue - Current consequence queue
 * @param {number} params.day - Current game day
 * @param {Object} params.stats - Financial/reputation stats
 * @param {string|null} params.dailyQuestId - Selected daily quest ID
 * @param {Object|null} params.morningReputation - Reputation at start of day (for delta)
 * @param {Object|null} params.bcState - UKM Behavior Change state for BC progress summary
 * @param {Array} params.bcState.activeCases - Currently active BC cases
 * @param {Array} params.bcState.completedToday - BC cases completed today
 * @param {Object} params.bcState.readinessState - NpcReadiness state map
 * @returns {Object} Debrief data for EndOfDayModal
 */
export function generateDebrief({
    todayLog = [],
    consequenceQueue = [],
    day = 1,
    stats = {},
    dailyQuestId = null,
    morningReputation = null,
    bcState = null,
}) {
    const summary = generateSummary(todayLog, stats, morningReputation);
    const criticalCases = extractCriticalCases(todayLog);
    const reflectionPrompts = generateReflectionPrompts(todayLog, criticalCases);
    const consequencePreview = getUpcomingFollowups(consequenceQueue, day, 7);
    const grade = getGrade(summary.overallScore);

    // Calculate XP bonus
    const baseXp = Math.round(summary.overallScore * 0.5);
    const questBonus = dailyQuestId ? 0 : 0; // Will be calculated with actual quest check

    // Build BC progress summary if bcState is provided
    const bcProgress = bcState ? buildBCProgress(bcState, day) : null;

    return {
        day,
        summary,
        criticalCases,
        reflectionPrompts,
        consequencePreview: consequencePreview.map(c => ({
            patientName: c.originalCase.patientName,
            returnDay: c.returnDay,
            daysUntil: c.returnDay - day,
            condition: c.condition,
            severity: c.severity,
            narrative: c.narrative,
        })),
        grade,
        xpEarned: baseXp + questBonus,
        reflectionXpBonus: 10, // Extra XP if player writes reflection
        bcProgress,
    };
}

// ═══════════════════════════════════════════════════════════════
// SUB-GENERATORS
// ═══════════════════════════════════════════════════════════════

/**
 * Generate summary statistics from today's log.
 */
function generateSummary(todayLog, stats, morningReputation) {
    const patientsServed = todayLog.filter(c => c.completed).length;
    const patientsMissed = todayLog.filter(c => c.missed || c.leftWithoutService).length;
    const referralsMade = todayLog.filter(c => c.referred).length;

    const diagnosisScores = todayLog
        .filter(c => c.diagnosisScore !== undefined && c.diagnosisScore !== null)
        .map(c => c.diagnosisScore);
    const avgDiagnosisScore = diagnosisScores.length > 0
        ? Math.round(diagnosisScores.reduce((a, b) => a + b, 0) / diagnosisScores.length)
        : 0;

    const correctDiagnoses = todayLog.filter(c => (c.diagnosisScore || 0) >= 80).length;
    const incorrectDiagnoses = todayLog.filter(c => c.completed && (c.diagnosisScore || 0) < 50).length;

    const todayRevenue = todayLog.reduce((sum, c) => sum + (c.revenue || 0), 0);
    const reputation = stats.reputation || 80;
    const reputationDelta = morningReputation !== null ? reputation - morningReputation : 0;

    // Calculate overall score (weighted average)
    const servingScore = patientsServed > 0 ? Math.min(100, (patientsServed / Math.max(1, patientsServed + patientsMissed)) * 100) : 50;
    const diagScore = avgDiagnosisScore || 50;
    const efficiencyScore = patientsMissed === 0 ? 100 : Math.max(0, 100 - patientsMissed * 20);

    const overallScore = Math.round(
        servingScore * 0.3 +
        diagScore * 0.5 +
        efficiencyScore * 0.2
    );

    return {
        patientsServed,
        patientsMissed,
        referralsMade,
        correctDiagnoses,
        incorrectDiagnoses,
        avgDiagnosisScore,
        todayRevenue,
        reputation,
        reputationDelta,
        overallScore,
    };
}

/**
 * Extract the most critical/interesting cases for review.
 */
function extractCriticalCases(todayLog) {
    // Sort by impact: incorrect diagnoses first, then referrals, then good ones
    const scored = todayLog
        .filter(c => c.completed)
        .map(c => ({
            ...c,
            impactScore:
                (c.diagnosisScore < 50 ? 100 : 0) +  // Wrong diagnosis = highest impact
                (c.referred ? 50 : 0) +                // Referral = interesting
                (c.diagnosisScore >= 90 ? 30 : 0) +    // Perfect diagnosis = noteworthy
                (c.complication ? 80 : 0),              // Complication = critical
        }))
        .sort((a, b) => b.impactScore - a.impactScore);

    return scored.slice(0, 3).map(c => ({
        patientName: c.patientName || 'Pasien',
        age: c.age,
        gender: c.gender,
        diagnosis: c.diagnosis || c.correctDiagnosis || 'Tidak terdiagnosis',
        correctDiagnosis: c.correctDiagnosis,
        diagnosisScore: c.diagnosisScore,
        wasCorrect: (c.diagnosisScore || 0) >= 70,
        referred: c.referred || false,
        vitals: c.vitals || {},
        guidelineRef: c.guidelineRef || null,
        treatmentGiven: c.treatmentGiven || [],
        keyLearning: generateKeyLearning(c),
    }));
}

/**
 * Generate a key learning point for a case.
 */
function generateKeyLearning(caseRecord) {
    if ((caseRecord.diagnosisScore || 0) < 50) {
        return `Diagnosis yang tepat adalah "${caseRecord.correctDiagnosis || '?'}". Perhatikan gejala-gejala kunci pada anamnesis.`;
    }
    if (caseRecord.referred) {
        return 'Kasus ini memerlukan rujukan. Pastikan stabilisasi sebelum pasien dikirim ke RS.';
    }
    if ((caseRecord.diagnosisScore || 0) >= 90) {
        return 'Diagnosa dan tatalaksana tepat. Pertahankan pola klinis seperti ini!';
    }
    return 'Evaluasi kembali alur anamnesis dan pemeriksaan fisik untuk akurasi lebih tinggi.';
}

/**
 * Generate reflection prompts based on today's cases.
 */
function generateReflectionPrompts(todayLog, criticalCases) {
    const prompts = [];

    // Prompt for missed diagnoses
    const missed = criticalCases.filter(c => !c.wasCorrect);
    if (missed.length > 0) {
        prompts.push({
            type: 'missed_diagnosis',
            text: REFLECTION_TEMPLATES.missed_diagnosis(
                missed[0].patientName,
                missed[0].correctDiagnosis || 'kondisi pasien'
            ),
            category: 'critical',
        });
    }

    // Prompt for time management
    const totalMissed = todayLog.filter(c => c.missed).length;
    if (totalMissed > 2) {
        prompts.push({
            type: 'time_pressure',
            text: REFLECTION_TEMPLATES.time_pressure(),
            category: 'improvement',
        });
    }

    // Prompt for good cases
    const excellent = criticalCases.filter(c => c.wasCorrect && (c.diagnosisScore || 0) >= 90);
    if (excellent.length > 0 && prompts.length < 3) {
        prompts.push({
            type: 'good_case',
            text: REFLECTION_TEMPLATES.good_case(excellent[0].patientName),
            category: 'positive',
        });
    }

    // Always include at least one prompt
    if (prompts.length === 0) {
        prompts.push({
            type: 'general',
            text: 'Apa satu hal yang akan kamu perbaiki besok di Puskesmas?',
            category: 'general',
        });
    }

    return prompts.slice(0, 3);
}

// ═══════════════════════════════════════════════════════════════
// UKM BEHAVIOR CHANGE PROGRESS BUILDER
// ═══════════════════════════════════════════════════════════════

/**
 * Build a summary of UKM behavior change progress for debrief display.
 * @param {Object} bcState - { activeCases, completedToday, readinessState }
 * @param {number} day - Current game day
 * @returns {Object} BC progress summary
 */
function buildBCProgress(bcState, day) {
    const { activeCases = [], completedToday = [], readinessState = {} } = bcState;

    // Build readiness distribution from state map
    const readinessDistribution = {};
    const neglectWarnings = [];
    const NEGLECT_THRESHOLD = 5; // days without visit triggers a warning

    Object.entries(readinessState).forEach(([familyId, data]) => {
        const stage = data?.stage || data?.readinessStage || 'precontemplation';
        readinessDistribution[stage] = (readinessDistribution[stage] || 0) + 1;

        // Check for neglect (families not visited recently)
        const lastVisit = data?.lastVisitDay || 0;
        if (day - lastVisit > NEGLECT_THRESHOLD && stage !== 'maintenance') {
            neglectWarnings.push({
                familyId,
                daysSinceVisit: day - lastVisit,
                stage,
            });
        }
    });

    // Approximate village IKS from readiness percentages
    const totalFamilies = Object.keys(readinessState).length || 1;
    const advancedCount = (readinessDistribution.action || 0) + (readinessDistribution.maintenance || 0);
    const villageIKS = Math.round((advancedCount / totalFamilies) * 100);

    return {
        activeCaseCount: activeCases.length,
        completedToday: completedToday.map(c => ({
            scenarioId: c.scenarioId,
            outcomeTier: c.outcomeTier,
            familyId: c.familyId || null,
            xpEarned: c.xpEarned || 0,
        })),
        readinessDistribution,
        villageIKS,
        neglectWarnings: neglectWarnings.slice(0, 5), // Top 5 most neglected
        totalFamiliesTracked: totalFamilies,
    };
}
