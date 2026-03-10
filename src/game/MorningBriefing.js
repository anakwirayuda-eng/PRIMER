/**
 * @reflection
 * [IDENTITY]: MorningBriefing
 * [PURPOSE]: Generates the morning briefing data for the strategic planning phase.
 *            Analyzes staff, inventory, consequences, events, and KPIs.
 * [STATE]: Experimental
 * [ANCHOR]: generateMorningBriefing
 * [DEPENDS_ON]: ConsequenceEngine, CLINICAL_SERVICES, PosyanduEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

import { getScheduledFollowups, getUpcomingFollowups } from './ConsequenceEngine.js';
import { CLINICAL_SERVICES } from '../data/ClinicalServices.js';
import { isPosyanduDay } from './PosyanduEngine.js';

// Local helper — PosyanduEngine doesn't export this  
function getNextPosyanduDay(currentDay) {
    // Posyandu is typically every 30 days; scan ahead to find next
    for (let d = currentDay + 1; d <= currentDay + 31; d++) {
        if (isPosyanduDay(d)) return d;
    }
    return currentDay + 30; // fallback
}

// ═══════════════════════════════════════════════════════════════
// MORNING BRIEFING GENERATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Generate the complete morning briefing from current game state.
 * Called when player wakes up, before clinical operations begin.
 * 
 * @param {Object} state - Complete game state snapshot:
 *   { day, hiredStaff, pharmacyInventory, consequenceQueue,
 *     villageData, activeOutbreaks, prolanisRoster, stats }
 * @returns {Object} Briefing data for MorningBriefingModal
 */
export function generateMorningBriefing(state) {
    const {
        day = 1,
        hiredStaff = [],
        pharmacyInventory = [],
        consequenceQueue = [],
        villageData = {},
        activeOutbreaks = [],
        prolanisRoster = [],
        stats = {},
        playerLevel = 1,
    } = state;

    return {
        day,
        staffReport: generateStaffReport(hiredStaff),
        stockAlerts: generateStockAlerts(pharmacyInventory),
        pendingFollowups: getScheduledFollowups(consequenceQueue, day),
        upcomingFollowups: getUpcomingFollowups(consequenceQueue, day, 3),
        todayEvents: generateTodayEvents(day, prolanisRoster, activeOutbreaks),
        kpiSnapshot: generateKpiSnapshot(stats, villageData),
        availablePolis: getAvailablePolis(playerLevel, hiredStaff),
        suggestedPriority: generateSuggestedPriority(state),
    };
}

// ═══════════════════════════════════════════════════════════════
// SUB-GENERATORS
// ═══════════════════════════════════════════════════════════════

/**
 * Staff availability and morale report.
 */
function generateStaffReport(hiredStaff) {
    const available = hiredStaff.filter(s => (s.morale || 70) > 20);
    const lowMorale = hiredStaff.filter(s => (s.morale || 70) <= 40 && (s.morale || 70) > 20);
    const absent = hiredStaff.filter(s => (s.morale || 70) <= 20);

    return {
        total: hiredStaff.length,
        available: available.length,
        lowMorale: lowMorale.map(s => ({ name: s.name || s.type, morale: Math.round(s.morale || 0) })),
        absent: absent.map(s => ({ name: s.name || s.type, reason: 'Morale terlalu rendah' })),
        avgMorale: hiredStaff.length > 0
            ? Math.round(hiredStaff.reduce((sum, s) => sum + (s.morale || 70), 0) / hiredStaff.length)
            : 0,
    };
}

/**
 * Inventory alerts: low stock, near-expiry, critical items.
 */
function generateStockAlerts(pharmacyInventory) {
    if (!Array.isArray(pharmacyInventory) || pharmacyInventory.length === 0) {
        return { lowStock: [], nearExpiry: [], criticalMissing: [] };
    }

    const lowStock = pharmacyInventory
        .filter(item => (item.quantity || 0) <= (item.minStock || 10))
        .map(item => ({
            name: item.name || item.id,
            quantity: item.quantity || 0,
            minStock: item.minStock || 10,
        }))
        .slice(0, 5); // Top 5 most critical

    return { lowStock, nearExpiry: [], criticalMissing: [] };
}

/**
 * Today's special events.
 */
function generateTodayEvents(day, prolanisRoster, activeOutbreaks) {
    const events = [];

    // Posyandu check
    if (isPosyanduDay(day)) {
        events.push({
            type: 'posyandu',
            icon: '⚖️',
            title: 'Hari Posyandu',
            description: 'Jadwal Posyandu hari ini — penimbangan, KMS, imunisasi.',
            priority: 'medium',
        });
    } else {
        const nextPosyandu = getNextPosyanduDay(day);
        if (nextPosyandu - day <= 3) {
            events.push({
                type: 'posyandu_soon',
                icon: '📅',
                title: `Posyandu ${nextPosyandu - day} hari lagi`,
                description: 'Persiapkan perlengkapan dan reminder ke kader.',
                priority: 'low',
            });
        }
    }

    // Prolanis day (every 30 days)
    if (day % 30 === 0 && prolanisRoster.length > 0) {
        events.push({
            type: 'prolanis',
            icon: '💗',
            title: 'Jadwal Prolanis',
            description: `${prolanisRoster.length} pasien Prolanis dijadwalkan kontrol hari ini.`,
            priority: 'high',
        });
    }

    // Active outbreaks
    if (activeOutbreaks.length > 0) {
        activeOutbreaks.forEach(outbreak => {
            events.push({
                type: 'outbreak',
                icon: '🦠',
                title: `Wabah: ${outbreak.name || outbreak.disease || 'Tidak diketahui'}`,
                description: 'Kasus bisa melonjak. Siapkan stok obat dan APD.',
                priority: 'critical',
            });
        });
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    events.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));

    return events;
}

/**
 * Quick KPI snapshot vs targets.
 */
function generateKpiSnapshot(stats, villageData) {
    const indicators = villageData?.healthIndicators || {};

    return {
        patientsServedTotal: stats.totalPatientsServed || 0,
        revenueThisMonth: stats.monthlyRevenue || stats.totalRevenue || 0,
        reputation: stats.reputation || 80,
        outbreakRisk: indicators.outbreak_risk || 'low',
        kpiItems: [
            {
                label: 'Pasien Dilayani',
                value: stats.totalPatientsServed || 0,
                target: 10,
                unit: '/hari',
                status: (stats.totalPatientsServed || 0) >= 10 ? 'green' : 'amber',
            },
            {
                label: 'Reputasi',
                value: stats.reputation || 80,
                target: 75,
                unit: '',
                status: (stats.reputation || 80) >= 75 ? 'green' : 'red',
            },
        ],
    };
}

/**
 * Determine which polis are available based on player level + staff.
 */
function getAvailablePolis(playerLevel, hiredStaff) {
    const staffTypes = hiredStaff.map(s => s.type || s.role);

    return CLINICAL_SERVICES.map(service => ({
        id: service.id,
        name: service.name,
        icon: service.icon,
        available: !service.betaLocked &&
            service.unlockLevel <= playerLevel &&
            (!service.requiredStaff || staffTypes.includes(service.requiredStaff)),
        reason: service.betaLocked
            ? 'Coming Soon'
            : service.unlockLevel > playerLevel
                ? `Level ${service.unlockLevel}`
                : service.requiredStaff && !staffTypes.includes(service.requiredStaff)
                    ? `Butuh ${service.requiredStaff}`
                    : null,
    }));
}

/**
 * AI-generated priority suggestion based on current state.
 */
function generateSuggestedPriority(state) {
    const { consequenceQueue = [], day = 1, activeOutbreaks = [] } = state;

    // Critical: outbreak active
    if (activeOutbreaks.length > 0) {
        return {
            text: `Wabah aktif! Fokus tangani kasus ${activeOutbreaks[0]?.name || 'menular'} dan cegah penyebaran.`,
            type: 'critical',
            icon: '🦠',
        };
    }

    // High: consequence patients returning
    const returningToday = getScheduledFollowups(consequenceQueue, day);
    if (returningToday.length > 0) {
        const worst = returningToday.find(c => c.severity === 'critical') || returningToday[0];
        return {
            text: `${worst.originalCase.patientName} ${worst.narrative}. Prioritaskan penanganan ulang.`,
            type: 'high',
            icon: '⚠️',
        };
    }

    // Default: general efficiency
    const priorities = [
        { text: 'Layani pasien dengan efisien — minimkan waktu tunggu.', type: 'normal', icon: '🎯' },
        { text: 'Cek stok obat dan pastikan persediaan cukup untuk minggu ini.', type: 'normal', icon: '💊' },
        { text: 'Tingkatkan skor reputasi Puskesmas melalui pelayanan prima.', type: 'normal', icon: '⭐' },
    ];

    return priorities[day % priorities.length];
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT STAFF ALLOCATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate default staff-to-poli allocation.
 * Player can override this in the Morning Briefing UI.
 * 
 * @param {Array} hiredStaff - Array of staff objects
 * @returns {Object} Map of poliId → staffIds[]
 */
export function generateDefaultAllocation(hiredStaff = []) {
    const allocation = {};

    hiredStaff.forEach(staff => {
        const role = staff.type || staff.role;
        let targetPoli = 'poli_umum'; // default

        if (role === 'bidan') targetPoli = 'poli_kia_kb';
        else if (role === 'dokter_gigi') targetPoli = 'poli_gigi';
        else if (role === 'apoteker' || role === 'analis_lab') targetPoli = 'farmasi_lab';
        else if (role === 'perawat') targetPoli = 'poli_umum';

        if (!allocation[targetPoli]) allocation[targetPoli] = [];
        allocation[targetPoli].push(staff.id || staff.name || role);
    });

    return allocation;
}

// ═══════════════════════════════════════════════════════════════
// DAILY PRIORITY QUESTS
// ═══════════════════════════════════════════════════════════════

/**
 * Generate selectable daily priority quests.
 * Player picks one for bonus XP on completion.
 */
export function generateDailyQuests(state) {
    const { day = 1 } = state;

    const allQuests = [
        {
            id: 'serve_10',
            title: 'Layani 10 Pasien',
            description: 'Selesaikan konsultasi untuk 10 pasien hari ini.',
            xpBonus: 50,
            icon: '🩺',
            check: (endOfDayStats) => (endOfDayStats.patientsServed || 0) >= 10,
        },
        {
            id: 'zero_miss',
            title: 'Zero Pasien Terlewat',
            description: 'Jangan sampai ada pasien yang pulang tanpa dilayani.',
            xpBonus: 75,
            icon: '🎯',
            check: (endOfDayStats) => (endOfDayStats.patientsMissed || 0) === 0,
        },
        {
            id: 'accuracy_90',
            title: 'Akurasi Diagnosis 90%',
            description: 'Capai skor diagnosis rata-rata ≥90% hari ini.',
            xpBonus: 100,
            icon: '🧠',
            check: (endOfDayStats) => (endOfDayStats.avgDiagnosisScore || 0) >= 90,
        },
        {
            id: 'reputation_up',
            title: 'Naikkan Reputasi',
            description: 'Akhiri hari dengan reputasi lebih tinggi dari pagi.',
            xpBonus: 60,
            icon: '⭐',
            check: (endOfDayStats) => (endOfDayStats.reputationDelta || 0) > 0,
        },
    ];

    // Rotate 3 quests based on day
    const startIdx = day % allQuests.length;
    const selected = [];
    for (let i = 0; i < 3 && i < allQuests.length; i++) {
        selected.push(allQuests[(startIdx + i) % allQuests.length]);
    }

    return selected;
}
