/**
 * @reflection
 * [IDENTITY]: CalendarEventDB
 * [PURPOSE]: CalendarEventDB.js Comprehensive calendar database for PRIMER game Contains: - Indonesian national holidays 2026 (Libur 
 * [STATE]: Experimental
 * [ANCHOR]: GAME_START_DATE
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * CalendarEventDB.js
 * Comprehensive calendar database for PRIMER game
 * Contains:
 * - Indonesian national holidays 2026 (Libur Nasional)
 * - Collective leave days (Cuti Bersama)
 * - WHO health observance days
 * - Game-specific events
 */

// Game starts on January 1, 2026 (Thursday)
export const GAME_START_DATE = new Date(2026, 0, 1); // January 1, 2026

// Convert day number to actual date
export function getDayDate(dayNumber) {
    const date = new Date(GAME_START_DATE);
    date.setDate(date.getDate() + dayNumber - 1);
    return date;
}
export const getDateFromDay = getDayDate; // Alias for compatibility

// Get day of week (0 = Sunday, 6 = Saturday)
export function getDayOfWeek(dayNumber) {
    return getDayDate(dayNumber).getDay();
}

// Format date to Indonesian format
export function formatDate(dayNumber) {
    const date = getDayDate(dayNumber);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${date.getDate()} ${months[date.getMonth()]} 2026`;
}

// ═══════════════════════════════════════════════════════════════
// INDONESIAN NATIONAL HOLIDAYS 2026 (Libur Nasional)
// ═══════════════════════════════════════════════════════════════

export const NATIONAL_HOLIDAYS_2026 = {
    // January
    1: { title: "Tahun Baru 2026", type: "holiday", description: "Hari Libur Nasional" },
    16: { title: "Isra Mi'raj", type: "holiday", description: "Isra Mi'raj Nabi Muhammad SAW" },

    // February
    48: { title: "Tahun Baru Imlek", type: "holiday", description: "Tahun Baru Imlek 2577 Kongzili" },

    // March
    78: { title: "Hari Raya Nyepi", type: "holiday", description: "Tahun Baru Saka 1948" },
    80: { title: "Idul Fitri 1447 H", type: "holiday", description: "Hari Raya Idul Fitri" },
    81: { title: "Idul Fitri 1447 H", type: "holiday", description: "Hari Raya Idul Fitri (hari ke-2)" },

    // April
    93: { title: "Jumat Agung", type: "holiday", description: "Wafat Isa Al-Masih / Good Friday" },

    // May
    121: { title: "Hari Buruh", type: "holiday", description: "Hari Buruh Internasional" },
    134: { title: "Kenaikan Isa Almasih", type: "holiday", description: "Kenaikan Yesus Kristus" },
    147: { title: "Idul Adha", type: "holiday", description: "Idul Adha 1447 Hijriah" },
    151: { title: "Hari Raya Waisak", type: "holiday", description: "Waisak 2570 BE" },

    // June
    152: { title: "Hari Pancasila", type: "holiday", description: "Hari Lahir Pancasila" },
    167: { title: "Tahun Baru Islam", type: "holiday", description: "1 Muharram 1448 Hijriah" },

    // August
    229: { title: "HUT RI ke-81", type: "holiday", description: "Hari Kemerdekaan Republik Indonesia" },
    237: { title: "Maulid Nabi", type: "holiday", description: "Maulid Nabi Muhammad SAW" },

    // December
    359: { title: "Hari Natal", type: "holiday", description: "Hari Raya Natal" }
};

// ═══════════════════════════════════════════════════════════════
// CUTI BERSAMA 2026 (Collective Leave)
// ═══════════════════════════════════════════════════════════════

export const CUTI_BERSAMA_2026 = {
    47: { title: "Cuti Bersama Imlek", type: "cuti", description: "Cuti bersama menjelang Imlek" },
    77: { title: "Cuti Bersama Nyepi", type: "cuti", description: "Cuti bersama menjelang Nyepi" },
    79: { title: "Cuti Bersama Idul Fitri", type: "cuti", description: "Cuti bersama Idul Fitri" },
    82: { title: "Cuti Bersama Idul Fitri", type: "cuti", description: "Cuti bersama Idul Fitri" },
    83: { title: "Cuti Bersama Idul Fitri", type: "cuti", description: "Cuti bersama Idul Fitri" },
    135: { title: "Cuti Bersama Kenaikan", type: "cuti", description: "Cuti bersama Kenaikan Isa Almasih" },
    148: { title: "Cuti Bersama Idul Adha", type: "cuti", description: "Cuti bersama Idul Adha" },
    358: { title: "Cuti Bersama Natal", type: "cuti", description: "Cuti bersama menjelang Natal" }
};

// ═══════════════════════════════════════════════════════════════
// WHO HEALTH OBSERVANCE DAYS 2026
// ═══════════════════════════════════════════════════════════════

export const HEALTH_DAYS_2026 = {
    // January
    25: { title: "Hari Kusta Sedunia", type: "health", description: "World Leprosy Day - Akhiri stigma, tingkatkan akses diagnosis", emoji: "🩺" },

    // February
    4: { title: "Hari Kanker Sedunia", type: "health", description: "World Cancer Day - Deteksi dini selamatkan nyawa", emoji: "🎗️" },
    15: { title: "Hari Kanker Anak", type: "health", description: "International Childhood Cancer Day", emoji: "👶" },

    // March
    3: { title: "Hari Cacat Lahir", type: "health", description: "World Birth Defects Day - Pencegahan dan perawatan", emoji: "💜" },
    14: { title: "Hari Ginjal Sedunia", type: "health", description: "World Kidney Day - Jaga kesehatan ginjal", emoji: "🫘" },
    22: { title: "Hari Air Sedunia", type: "health", description: "World Water Day - Air bersih untuk kesehatan", emoji: "💧" },
    24: { title: "Hari TBC Sedunia", type: "health", description: "World Tuberculosis Day - Akhiri TBC!", emoji: "🫁" },

    // April
    97: { title: "Hari Kesehatan Sedunia", type: "health", description: "World Health Day - Membangun Dunia Lebih Sehat", emoji: "🌍" },
    115: { title: "Hari Malaria Sedunia", type: "health", description: "World Malaria Day - Cegah dan obati malaria", emoji: "🦟" },

    // May
    125: { title: "Hari Cuci Tangan", type: "health", description: "World Hand Hygiene Day - Cuci tangan selamatkan nyawa", emoji: "🧼" },
    132: { title: "Hari Perawat", type: "health", description: "International Nurses Day - Hormati tenaga perawat", emoji: "👩‍⚕️" },
    151: { title: "Hari Tanpa Tembakau", type: "health", description: "World No Tobacco Day - Berhenti merokok!", emoji: "🚭" },

    // June
    165: { title: "Hari Donor Darah", type: "health", description: "World Blood Donor Day - Donorkan darahmu!", emoji: "🩸" },

    // July
    209: { title: "Hari Hepatitis", type: "health", description: "World Hepatitis Day - Deteksi dan cegah hepatitis", emoji: "🟡" },

    // November
    316: { title: "Hari Pneumonia", type: "health", description: "World Pneumonia Day - Cegah pneumonia pada anak", emoji: "🫁" },
    318: { title: "Hari Diabetes Sedunia", type: "health", description: "World Diabetes Day - Kelola gula darah Anda", emoji: "💙" },

    // December
    335: { title: "Hari AIDS Sedunia", type: "health", description: "World AIDS Day - Akhiri stigma HIV/AIDS", emoji: "🎀" },
    346: { title: "Hari Cakupan Kesehatan", type: "health", description: "Universal Health Coverage Day", emoji: "🏥" }
};

// ═══════════════════════════════════════════════════════════════
// GAME-SPECIFIC EVENTS (Recurring)
// ═══════════════════════════════════════════════════════════════

export const GAME_EVENTS = {
    // Monthly events (will be generated dynamically based on day)
};

// Generate monthly audit/evaluation events
function generateMonthlyEvents() {
    const events = {};
    // Every 30 days: BPJS Audit
    for (let d = 30; d <= 365; d += 30) {
        events[d] = { title: "Audit BPJS Bulanan", type: "audit", description: "Evaluasi RNS dan kualitas pelayanan" };
    }
    // Every 60 days: Dinas Kesehatan inspection
    for (let d = 60; d <= 365; d += 60) {
        if (!events[d]) {
            events[d] = { title: "Inspeksi Dinkes", type: "inspection", description: "Inspeksi akreditasi dari Dinas Kesehatan" };
        }
    }
    // Every 15th of month: Posyandu
    [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349].forEach(d => {
        if (!events[d]) {
            events[d] = { title: "Posyandu", type: "program", description: "Posyandu Balita dan Lansia" };
        }
    });
    return events;
}

// ═══════════════════════════════════════════════════════════════
// COMBINED CALENDAR EVENTS
// ═══════════════════════════════════════════════════════════════

export const CALENDAR_EVENTS = {
    ...generateMonthlyEvents(),
    ...HEALTH_DAYS_2026,
    ...CUTI_BERSAMA_2026,
    ...NATIONAL_HOLIDAYS_2026
};

// ═══════════════════════════════════════════════════════════════
// EVENT COLORS / STYLES
// ═══════════════════════════════════════════════════════════════

export const EVENT_COLORS = {
    holiday: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', emoji: '🎌' },
    cuti: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', emoji: '🏖️' },
    health: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', emoji: '💊' },
    audit: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300', emoji: '📋' },
    inspection: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', emoji: '🔍' },
    program: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300', emoji: '👶' },
    milestone: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', emoji: '🏆' },
    evaluation: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', emoji: '📊' },
    season: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', emoji: '🌧️' },
    training: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', emoji: '📚' },
    deadline: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300', emoji: '⏰' }
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get all events for a specific month (1-12)
 */
export function getEventsForMonth(month) {
    const startDay = getDayNumberForDate(2026, month, 1);
    const endDay = getDayNumberForDate(2026, month + 1, 0); // Last day of month

    return Object.entries(CALENDAR_EVENTS)
        .filter(([day]) => {
            const d = parseInt(day);
            return d >= startDay && d <= endDay;
        })
        .map(([day, event]) => ({
            day: parseInt(day),
            date: getDayDate(parseInt(day)),
            ...event
        }));
}

/**
 * Convert date to day number (days since Jan 1, 2026)
 */
export function getDayNumberForDate(year, month, day) {
    const target = new Date(year, month - 1, day);
    const diff = target - GAME_START_DATE;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Get the first day of a month as day number
 */
export function getFirstDayOfMonth(month) {
    return getDayNumberForDate(2026, month, 1);
}

/**
 * Get number of days in a month
 */
export function getDaysInMonth(month) {
    return new Date(2026, month, 0).getDate();
}

/**
 * Check if a day is a weekend
 */
export function isWeekend(dayNumber) {
    const dow = getDayOfWeek(dayNumber);
    return dow === 0 || dow === 6;
}

/**
 * Check if a day is a holiday or cuti
 */
export function isHoliday(dayNumber) {
    const event = CALENDAR_EVENTS[dayNumber];
    return event && (event.type === 'holiday' || event.type === 'cuti');
}
