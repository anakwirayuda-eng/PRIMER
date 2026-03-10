/**
 * @reflection
 * [IDENTITY]: ImmunizationEngine
 * [PURPOSE]: Vaccine scheduling, catch-up logic, coverage tracking. Shared by KIA and PosyanduEngine.
 * [STATE]: Experimental
 * [ANCHOR]: getVaccineSchedule
 * [DEPENDS_ON]: None (pure logic)
 * [LAST_UPDATE]: 2026-02-18
 */

// ═══════════════════════════════════════════════════════════════
// NATIONAL IMMUNIZATION SCHEDULE (Kemenkes RI)
// ═══════════════════════════════════════════════════════════════

const VACCINE_SCHEDULE = [
    { id: 'hb0', name: 'Hepatitis B-0', ageMonths: 0, dueWindow: [0, 0.25], dose: 1, type: 'birth_dose', description: 'Diberikan < 24 jam setelah lahir' },
    { id: 'bcg', name: 'BCG', ageMonths: 1, dueWindow: [0, 3], dose: 1, type: 'single', description: 'Diberikan usia 0-3 bulan' },
    { id: 'polio1', name: 'Polio 1 (OPV)', ageMonths: 1, dueWindow: [1, 2], dose: 1, type: 'series', description: 'OPV dosis 1' },
    { id: 'dpt_hb_hib1', name: 'DPT-HB-HiB 1', ageMonths: 2, dueWindow: [2, 3], dose: 1, type: 'series', description: 'Pentavalen dosis 1' },
    { id: 'polio2', name: 'Polio 2 (OPV)', ageMonths: 2, dueWindow: [2, 3], dose: 1, type: 'series', description: 'OPV dosis 2' },
    { id: 'dpt_hb_hib2', name: 'DPT-HB-HiB 2', ageMonths: 3, dueWindow: [3, 4], dose: 1, type: 'series', description: 'Pentavalen dosis 2' },
    { id: 'polio3', name: 'Polio 3 (OPV)', ageMonths: 3, dueWindow: [3, 4], dose: 1, type: 'series', description: 'OPV dosis 3' },
    { id: 'dpt_hb_hib3', name: 'DPT-HB-HiB 3', ageMonths: 4, dueWindow: [4, 5], dose: 1, type: 'series', description: 'Pentavalen dosis 3' },
    { id: 'polio4', name: 'Polio 4 (OPV)', ageMonths: 4, dueWindow: [4, 5], dose: 1, type: 'series', description: 'OPV dosis 4' },
    { id: 'ipv1', name: 'IPV 1', ageMonths: 4, dueWindow: [4, 5], dose: 1, type: 'single', description: 'Polio suntik dosis 1' },
    { id: 'ipv2', name: 'IPV 2', ageMonths: 9, dueWindow: [9, 12], dose: 1, type: 'single', description: 'Polio suntik dosis 2' },
    { id: 'campak_rubella1', name: 'MR/Campak-Rubella 1', ageMonths: 9, dueWindow: [9, 12], dose: 1, type: 'series', description: 'MR dosis 1' },
    { id: 'dpt_hb_hib_booster', name: 'DPT-HB-HiB Booster', ageMonths: 18, dueWindow: [18, 24], dose: 1, type: 'booster', description: 'Pentavalen booster' },
    { id: 'campak_rubella2', name: 'MR/Campak-Rubella 2', ageMonths: 18, dueWindow: [18, 24], dose: 1, type: 'booster', description: 'MR dosis 2' },
];

export { VACCINE_SCHEDULE };

// ═══════════════════════════════════════════════════════════════
// SCHEDULE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get vaccine schedule status for a baby
 * @param {number} babyAgeMonths - Baby's age in months
 * @param {string[]} completedVaccines - Array of vaccine IDs already given
 * @returns {{ due[], overdue[], upcoming[], completed[] }}
 */
export function getVaccineSchedule(babyAgeMonths, completedVaccines = []) {
    const due = [];
    const overdue = [];
    const upcoming = [];
    const completed = [];

    for (const vaccine of VACCINE_SCHEDULE) {
        if (completedVaccines.includes(vaccine.id)) {
            completed.push({ ...vaccine, status: 'completed' });
            continue;
        }

        const [dueStart, dueEnd] = vaccine.dueWindow;

        if (babyAgeMonths >= dueStart && babyAgeMonths <= dueEnd) {
            due.push({ ...vaccine, status: 'due', urgency: 'normal' });
        } else if (babyAgeMonths > dueEnd) {
            overdue.push({ ...vaccine, status: 'overdue', urgency: babyAgeMonths > dueEnd + 3 ? 'critical' : 'warning', monthsLate: Math.round(babyAgeMonths - dueEnd) });
        } else {
            upcoming.push({ ...vaccine, status: 'upcoming', monthsUntilDue: Math.round(dueStart - babyAgeMonths) });
        }
    }

    return { due, overdue, upcoming, completed };
}

/**
 * Process immunization — validate timing and record
 * @param {Object} baby - Baby data { id, name, ageMonths, completedVaccines[] }
 * @param {string} vaccineId - Vaccine ID to administer
 * @param {number} gameDay - Current game day for recording
 * @returns {{ success, timingAccuracy, xp, feedback, updatedVaccines[] }}
 */
export function processImmunization(baby, vaccineId, gameDay) {
    const vaccine = VACCINE_SCHEDULE.find(v => v.id === vaccineId);
    if (!vaccine) return { success: false, feedback: `Vaksin "${vaccineId}" tidak ditemukan`, xp: 0 };

    const completed = baby.completedVaccines || [];
    if (completed.includes(vaccineId)) {
        return { success: false, feedback: `${vaccine.name} sudah pernah diberikan`, xp: 0 };
    }

    const [dueStart, dueEnd] = vaccine.dueWindow;
    const age = baby.ageMonths || 0;

    let timingAccuracy, xp, feedback;

    if (age < dueStart) {
        // Too early
        return { success: false, feedback: `${vaccine.name} belum waktunya — tunggu usia ${dueStart} bulan`, xp: 0 };
    } else if (age >= dueStart && age <= dueEnd) {
        // Perfect timing
        timingAccuracy = 'tepat_waktu';
        xp = 20;
        feedback = `✅ ${vaccine.name} diberikan tepat waktu!`;
    } else if (age <= dueEnd + 6) {
        // Late but acceptable (catch-up)
        timingAccuracy = 'terlambat';
        xp = 10;
        feedback = `⚠️ ${vaccine.name} diberikan terlambat ${Math.round(age - dueEnd)} bulan — catch-up berhasil`;
    } else {
        // Very late
        timingAccuracy = 'sangat_terlambat';
        xp = 5;
        feedback = `⚠️ ${vaccine.name} sangat terlambat. Catch-up tetap penting untuk proteksi.`;
    }

    const updatedVaccines = [...completed, vaccineId];

    return {
        success: true,
        vaccineName: vaccine.name,
        timingAccuracy,
        xp,
        feedback,
        updatedVaccines,
        record: { vaccineId, vaccineName: vaccine.name, ageMonths: age, gameDay, timingAccuracy }
    };
}

/**
 * Check catch-up vaccines needed
 * @param {Object} baby - { ageMonths, completedVaccines[] }
 * @returns {{ catchUpNeeded[], priorityOrder[] }}
 */
export function checkCatchUp(baby) {
    const schedule = getVaccineSchedule(baby.ageMonths || 0, baby.completedVaccines || []);

    // Combine overdue and due, prioritize by urgency
    const catchUpNeeded = [
        ...schedule.overdue.map(v => ({ ...v, priority: v.urgency === 'critical' ? 1 : 2 })),
        ...schedule.due.map(v => ({ ...v, priority: 3 }))
    ].sort((a, b) => a.priority - b.priority);

    return {
        catchUpNeeded,
        totalOverdue: schedule.overdue.length,
        totalDue: schedule.due.length,
        completionRate: Math.round((schedule.completed.length / VACCINE_SCHEDULE.length) * 100)
    };
}

/**
 * Calculate village-level immunization coverage
 * @param {Object[]} babies - Array of baby objects with completedVaccines
 * @returns {{ overall, byVaccine{}, target, gap, status }}
 */
export function calculateCoverage(babies = []) {
    if (babies.length === 0) {
        return { overall: 0, byVaccine: {}, target: 95, gap: 95, status: 'Tidak ada data' };
    }

    const byVaccine = {};
    for (const vaccine of VACCINE_SCHEDULE) {
        const eligible = babies.filter(b => (b.ageMonths || 0) >= vaccine.dueWindow[0]);
        const vaccinated = eligible.filter(b => (b.completedVaccines || []).includes(vaccine.id));
        const coverage = eligible.length > 0 ? Math.round((vaccinated.length / eligible.length) * 100) : 0;
        byVaccine[vaccine.id] = { name: vaccine.name, eligible: eligible.length, vaccinated: vaccinated.length, coverage };
    }

    // Overall = average of all completed basic vaccines (IDL)
    const basicVaccines = ['hb0', 'bcg', 'dpt_hb_hib3', 'polio4', 'campak_rubella1'];
    const basicCoverages = basicVaccines.map(id => byVaccine[id]?.coverage || 0);
    const overall = Math.round(basicCoverages.reduce((a, b) => a + b, 0) / basicCoverages.length);

    const target = 95; // UCI target
    let status;
    if (overall >= target) status = '✅ UCI tercapai';
    else if (overall >= 80) status = '⚠️ Hampir UCI — kejar cakupan';
    else status = '❌ UCI belum tercapai — perlu sweeping';

    return { overall, byVaccine, target, gap: Math.max(0, target - overall), status };
}
