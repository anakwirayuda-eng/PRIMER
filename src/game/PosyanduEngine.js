/**
 * @reflection
 * [IDENTITY]: PosyanduEngine
 * [PURPOSE]: POSYANDU ENGINE Manages Posyandu (community health post) events and activities Includes: Penimbangan, KMS, Imunisasi, Pe
 * [STATE]: Experimental
 * [ANCHOR]: POSYANDU_ACTIVITIES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * POSYANDU ENGINE
 * Manages Posyandu (community health post) events and activities
 * Includes: Penimbangan, KMS, Imunisasi, Penyuluhan Gizi
 */

// Posyandu activity types
export const POSYANDU_ACTIVITIES = {
    penimbangan: {
        id: 'penimbangan',
        name: 'Penimbangan Balita',
        description: 'Timbang berat badan dan ukur tinggi badan anak',
        icon: '⚖️',
        energyCost: 10,
        timeCost: 30, // minutes
        targetAge: [0, 5], // 0-5 years
        xpReward: 15,
        iksImpact: { indicator: 'gizi', improvement: 0.05 }
    },
    kms: {
        id: 'kms',
        name: 'Pencatatan KMS',
        description: 'Record growth chart in Kartu Menuju Sehat',
        icon: '📋',
        energyCost: 5,
        timeCost: 15,
        targetAge: [0, 5],
        xpReward: 10,
        iksImpact: { indicator: 'gizi', improvement: 0.03 }
    },
    imunisasi: {
        id: 'imunisasi',
        name: 'Imunisasi Rutin',
        description: 'Pemberian vaksin sesuai jadwal imunisasi nasional',
        icon: '💉',
        energyCost: 15,
        timeCost: 20,
        targetAge: [0, 2], // 0-2 years for most vaccines
        xpReward: 25,
        iksImpact: { indicator: 'imunisasi', improvement: 0.08 },
        requiredStock: 'vaccine_bcg' // Example, can be dynamic
    },
    penyuluhan_gizi: {
        id: 'penyuluhan_gizi',
        name: 'Penyuluhan Gizi',
        description: 'Edukasi nutrisi untuk ibu hamil dan menyusui',
        icon: '🥗',
        energyCost: 15,
        timeCost: 45,
        targetAge: null, // Adults (mothers)
        xpReward: 20,
        iksImpact: { indicator: 'gizi', improvement: 0.06 }
    },
    penyuluhan_asi: {
        id: 'penyuluhan_asi',
        name: 'Konseling ASI Eksklusif',
        description: 'Edukasi pentingnya ASI eksklusif 6 bulan pertama',
        icon: '🍼',
        energyCost: 10,
        timeCost: 30,
        targetAge: null,
        xpReward: 15,
        iksImpact: { indicator: 'asi', improvement: 0.05 }
    },
    pmba: {
        id: 'pmba',
        name: 'PMBA (Pemberian Makan Bayi dan Anak)',
        description: 'Demonstrasi makanan pendamping ASI yang benar',
        icon: '🥣',
        energyCost: 20,
        timeCost: 60,
        targetAge: [0.5, 2], // 6 months to 2 years
        xpReward: 25,
        iksImpact: { indicator: 'gizi', improvement: 0.07 }
    }
};

// Posyandu schedule configurations
export const POSYANDU_CONFIG = {
    frequencyDays: 30, // Once per month (in-game)
    defaultActivities: ['penimbangan', 'kms', 'imunisasi', 'penyuluhan_gizi'],
    maxActivitiesPerSession: 4,
    baseAttendanceRate: 0.6, // 60% of eligible families attend by default
    bonusForReminder: 0.15 // +15% if player sends reminder
};

/**
 * Check if today is a Posyandu day
 * @param {number} currentDay - Current game day
 * @returns {boolean}
 */
export function isPosyanduDay(currentDay) {
    // Posyandu typically on specific days (e.g., day 5, 35, 65...)
    return currentDay % POSYANDU_CONFIG.frequencyDays === 5;
}

/**
 * Get next Posyandu day
 * @param {number} currentDay - Current game day
 * @returns {number}
 */
export function getNextPosyanduDay(currentDay) {
    const remainder = currentDay % POSYANDU_CONFIG.frequencyDays;
    if (remainder < 5) {
        return currentDay + (5 - remainder);
    }
    return currentDay + (POSYANDU_CONFIG.frequencyDays - remainder + 5);
}

/**
 * Get eligible children for Posyandu from village data
 * @param {Object} villageData - Village data with families
 * @param {string} activityId - Activity type
 * @returns {Array} - Array of eligible children/mothers
 */
export function getEligibleParticipants(villageData, activityId) {
    if (!villageData || !villageData.families) return [];

    const activity = POSYANDU_ACTIVITIES[activityId];
    if (!activity) return [];

    const participants = [];

    villageData.families.forEach(family => {
        if (!family.members) return;

        family.members.forEach(member => {
            // For child activities
            if (activity.targetAge) {
                const [minAge, maxAge] = activity.targetAge;
                if (member.age >= minAge && member.age <= maxAge) {
                    participants.push({
                        ...member,
                        familyId: family.id,
                        familyName: family.kepalaKeluarga,
                        houseId: family.houseId
                    });
                }
            } else {
                // For mother activities (penyuluhan)
                if (member.gender === 'P' && member.age >= 15 && member.age <= 45) {
                    // Women of childbearing age
                    participants.push({
                        ...member,
                        familyId: family.id,
                        familyName: family.kepalaKeluarga,
                        houseId: family.houseId
                    });
                }
            }
        });
    });

    return participants;
}

/**
 * Calculate attendance based on various factors
 * @param {Array} eligibleParticipants - List of eligible participants
 * @param {Object} options - Options like reminder sent, reputation, etc.
 * @returns {Array} - Attending participants
 */
export function calculateAttendance(eligibleParticipants, options = {}) {
    const { reminderSent = false, reputation = 50, iksScore = 0.5 } = options;

    let attendanceRate = POSYANDU_CONFIG.baseAttendanceRate;

    // Reputation bonus
    if (reputation >= 80) attendanceRate += 0.1;
    else if (reputation >= 60) attendanceRate += 0.05;

    // Reminder bonus
    if (reminderSent) attendanceRate += POSYANDU_CONFIG.bonusForReminder;

    // IKS bonus (healthier communities are more engaged)
    attendanceRate += iksScore * 0.1;

    // Cap at 95%
    attendanceRate = Math.min(0.95, attendanceRate);

    // Filter based on probability
    return eligibleParticipants.filter(() => Math.random() < attendanceRate);
}

/**
 * Process a Posyandu activity result
 * @param {Object} activity - Activity performed
 * @param {Object} participant - Child/mother data
 * @param {Object} playerInput - Player's input during mini-game
 * @returns {Object} - Result with outcomes
 */
export function processActivityResult(activity, participant, _playerInput = {}) {
    const result = {
        participantId: participant.id,
        participantName: participant.name,
        familyId: participant.familyId,
        activityId: activity.id,
        success: true,
        xpEarned: activity.xpReward,
        outcomes: []
    };

    // Penimbangan specific logic
    if (activity.id === 'penimbangan') {
        const currentWeight = participant.weight || 10 + Math.random() * 5;
        const expectedWeight = getExpectedWeight(participant.age);
        const weightStatus = currentWeight >= expectedWeight * 0.9 ? 'normal' :
            currentWeight >= expectedWeight * 0.7 ? 'underweight' : 'severely_underweight';

        result.outcomes.push({
            type: 'weight_check',
            weight: currentWeight.toFixed(1),
            status: weightStatus,
            message: weightStatus === 'normal' ? 'Berat badan normal' :
                weightStatus === 'underweight' ? 'BB Kurang - perlu konseling gizi' :
                    'BB Sangat Kurang - perlu rujukan PMT'
        });

        if (weightStatus !== 'normal') {
            result.xpEarned += 5; // Extra XP for identifying issues
        }
    }

    // Imunisasi specific logic
    if (activity.id === 'imunisasi') {
        const vaccinesDue = getVaccinesDue(participant.age, participant.vaccineHistory || []);
        if (vaccinesDue.length > 0) {
            result.outcomes.push({
                type: 'vaccination',
                vaccines: vaccinesDue,
                message: `Imunisasi ${vaccinesDue.join(', ')} diberikan`
            });
            result.xpEarned += vaccinesDue.length * 10;
        } else {
            result.outcomes.push({
                type: 'vaccination',
                vaccines: [],
                message: 'Imunisasi sudah lengkap sesuai usia'
            });
        }
    }

    return result;
}

/**
 * Helper: Get expected weight for age (simplified)
 */
function getExpectedWeight(ageInYears) {
    if (ageInYears < 0.5) return 6;
    if (ageInYears < 1) return 9;
    if (ageInYears < 2) return 11;
    if (ageInYears < 3) return 13;
    if (ageInYears < 4) return 15;
    return 17;
}

/**
 * Helper: Get vaccines due based on age
 */
function getVaccinesDue(ageInYears, vaccineHistory = []) {
    const schedule = [
        { age: 0, vaccine: 'Hepatitis B-0' },
        { age: 0.08, vaccine: 'BCG' }, // ~1 month
        { age: 0.16, vaccine: 'Polio 1' }, // ~2 months
        { age: 0.25, vaccine: 'DPT-HB-Hib 1' }, // ~3 months
        { age: 0.33, vaccine: 'Polio 2' }, // ~4 months
        { age: 0.41, vaccine: 'DPT-HB-Hib 2' }, // ~5 months
        { age: 0.75, vaccine: 'Campak' }, // ~9 months
        { age: 1.5, vaccine: 'DPT-HB-Hib Booster' },
        { age: 2, vaccine: 'Campak Booster' }
    ];

    return schedule
        .filter(s => ageInYears >= s.age && !vaccineHistory.includes(s.vaccine))
        .map(s => s.vaccine)
        .slice(0, 2); // Max 2 vaccines per visit
}

/**
 * Generate Posyandu session summary
 * @param {Array} results - Array of activity results
 * @returns {Object} - Session summary
 */
export function generatePosyanduSummary(results) {
    const totalParticipants = results.length;
    const totalXP = results.reduce((sum, r) => sum + r.xpEarned, 0);

    const issues = results.filter(r =>
        r.outcomes.some(o => o.status === 'underweight' || o.status === 'severely_underweight')
    );

    return {
        totalParticipants,
        totalXP,
        issuesFound: issues.length,
        activities: [...new Set(results.map(r => r.activityId))],
        timestamp: Date.now()
    };
}
