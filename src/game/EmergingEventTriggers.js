/**
 * @reflection
 * [IDENTITY]: EmergingEventTriggers.js
 * [PURPOSE]: Probability engine for Tier 3 (Emerging/Re-emerging) disease events.
 *            "The Karma & Tension Engine" — integrates with CalendarEventDB and
 *            IKMEventEngine to trigger outbreak alerts based on village conditions.
 *            Returns { triggeredEvent, earlyWarnings } for UI consumption.
 * [STATE]: Production
 * [ANCHOR]: evaluateEmergingTriggers
 * [DEPENDS_ON]: CalendarEventDB (v2 Array), IKMEventEngine, deterministicRandom
 * [LAST_UPDATE]: 2026-03-20
 */

import { getSeasonForDay } from './IKMEventEngine.js';
import { CALENDAR_EVENTS, getEpidemiologicalSeason } from '../data/CalendarEventDB.js';
import { chanceFromSeed, seedKey } from '../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// TRIGGER CONDITIONS (with UI Payloads for Frontend)
// ═══════════════════════════════════════════════════════════════

const EMERGING_TRIGGERS = {
    bc_difteri_klb: {
        scenarioId: 'bc_difteri_klb',
        title: 'KLB Difteri',
        severity: 'CRITICAL',
        minDay: 21,
        baseProbability: 0.04,
        conditions: {
            vaxCoverageBelow: 0.85,
            vaxIndicator: 'imunisasi'
        },
        season: null,
        maxPerRotation: 1,
        cooldownDays: 45,
        ui: {
            headline: "DARURAT: Ruang Isolasi Penuh Suspek Difteri",
            flavor: "Rendahnya cakupan imunisasi dasar (DPT) memicu kembalinya penyakit yang seharusnya bisa dicegah."
        }
    },
    bc_avian_flu_scare: {
        scenarioId: 'bc_avian_flu_scare',
        title: 'Suspek Flu Burung (H5N1)',
        severity: 'HIGH',
        minDay: 15,
        baseProbability: 0.03,
        conditions: { poorPHBS: true },
        season: null,
        maxPerRotation: 1,
        cooldownDays: 60,
        ui: {
            headline: "Unggas Mati Misterius, Warga Mulai Alami Demam Tinggi",
            flavor: "Sanitasi kandang ternak yang buruk memfasilitasi zoonosis."
        }
    },
    bc_anthrax_alert: {
        scenarioId: 'bc_anthrax_alert',
        title: 'Wabah Antraks Kulit',
        severity: 'HIGH',
        minDay: 1,
        baseProbability: 0.15,
        conditions: {
            nearCalendarEvent: 'Idul Adha',
            daysBefore: 7,
            daysAfter: 14
        },
        season: null,
        maxPerRotation: 1,
        cooldownDays: 300,
        ui: {
            headline: "Petaka Daging Kurban: Warga Keluhkan Luka Hitam Melepuh",
            flavor: "Pemotongan hewan tidak higienis memicu infeksi spora Bacillus anthracis."
        }
    },
    bc_malaria_import: {
        scenarioId: 'bc_malaria_import',
        title: 'Klaster Malaria Impor',
        severity: 'WARNING',
        minDay: 14,
        baseProbability: 0.04,
        conditions: {
            nearCalendarEvent: 'Idul Fitri',
            daysBefore: 0,
            daysAfter: 20
        },
        season: 'rainy',
        maxPerRotation: 1,
        cooldownDays: 45,
        ui: {
            headline: "Pemudik Membawa 'Oleh-Oleh' Demam Menggigil",
            flavor: "Mobilitas arus balik dari daerah endemik memicu transmisi lokal via nyamuk Anopheles."
        }
    },
    bc_pertussis_cluster: {
        scenarioId: 'bc_pertussis_cluster',
        title: 'Klaster Pertusis (Batuk Rejan)',
        severity: 'HIGH',
        minDay: 21,
        baseProbability: 0.04,
        conditions: {
            vaxCoverageBelow: 0.80,
            vaxIndicator: 'imunisasi'
        },
        season: null,
        maxPerRotation: 1,
        cooldownDays: 30,
        ui: {
            headline: "Suara Batuk 'Whoop' Memecah Keheningan SD",
            flavor: "Penolakan vaksinasi oleh sekelompok warga menjebol Herd Immunity."
        }
    },
    bc_hep_a_klb: {
        scenarioId: 'bc_hep_a_klb',
        title: 'KLB Hepatitis A',
        severity: 'CRITICAL',
        minDay: 14,
        baseProbability: 0.05,
        conditions: { poorPHBS: true },
        season: 'dry', // Kemarau → air bersih susah
        maxPerRotation: 1,
        cooldownDays: 45,
        ui: {
            headline: "Mata Menguning, Belasan Murid SD Tumbang Berjamaah",
            flavor: "Krisis air bersih saat kemarau memaksa warga memakai air sungai tercemar."
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Calendar Event Proximity (ARRAY-SAFE v2)
// Now searches CALENDAR_EVENTS (Array-per-day) instead of flat object
// ═══════════════════════════════════════════════════════════════

function isNearCalendarEvent(day, eventName, daysBefore = 7, daysAfter = 3) {
    const startWindow = Math.max(1, day - daysAfter);
    const endWindow = day + daysBefore;

    for (let d = startWindow; d <= endWindow; d++) {
        const dailyEvents = CALENDAR_EVENTS[d];
        if (!dailyEvents || !Array.isArray(dailyEvents)) continue;
        if (dailyEvents.some(ev => ev.title && ev.title.toLowerCase().includes(eventName.toLowerCase()))) {
            return true;
        }
    }
    return false;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Vaccination Coverage (THE IGNORANCE PENALTY)
// If no census data → assume worst case 30%, not 100%
// ═══════════════════════════════════════════════════════════════

function getVaxCoverage(villageData, indicator = 'imunisasi') {
    // 🔥 IGNORANCE PENALTY: No data = assume DANGER ZONE (30%)
    // Forces players to prioritize PIS-PK census before they feel safe
    if (!villageData?.families) return 0.30;

    const families = Array.isArray(villageData.families)
        ? villageData.families
        : Object.values(villageData.families);

    if (families.length === 0) return 0.30;

    let total = 0;
    let covered = 0;

    for (const family of families) {
        total++;
        const indicators = family.indicators || {};
        if (indicators[indicator]) covered++;
    }

    return total > 0 ? covered / total : 0.30;
}

// ═══════════════════════════════════════════════════════════════
// MAIN EVALUATION (returns { triggeredEvent, earlyWarnings })
// ═══════════════════════════════════════════════════════════════

export function evaluateEmergingTriggers(state) {
    const {
        day = 1,
        villageData = {},
        completedEmergingIds = [],
        emergingCooldowns = {}
    } = state;

    const season = getSeasonForDay(day); // 'rainy' | 'dry'
    const avgPHBS = villageData?.avgPHBS ?? 40; // Default poor if unknown
    const isPoorPHBS = avgPHBS < 60;

    const earlyWarnings = [];
    const triggeredCandidates = [];

    for (const [_key, trigger] of Object.entries(EMERGING_TRIGGERS)) {
        // Skip already completed
        if (completedEmergingIds.includes(trigger.scenarioId)) continue;

        // Check cooldown
        const lastTrigger = emergingCooldowns[trigger.scenarioId] || -999;
        if (day - lastTrigger < trigger.cooldownDays) continue;

        // Check minimum day
        if (day < trigger.minDay) continue;

        // Check season
        if (trigger.season && trigger.season !== season) continue;

        // Evaluate conditions
        let dynamicProb = trigger.baseProbability;
        let isEligible = true;
        const reasons = [];

        if (trigger.conditions) {
            // Vaccination coverage (dynamic karma: wider gap = higher probability)
            if (trigger.conditions.vaxCoverageBelow) {
                const coverage = getVaxCoverage(villageData, trigger.conditions.vaxIndicator);
                if (coverage >= trigger.conditions.vaxCoverageBelow) {
                    isEligible = false; // Herd immunity intact
                } else {
                    const deficit = trigger.conditions.vaxCoverageBelow - coverage;
                    dynamicProb += (deficit * 0.15); // Karma multiplier
                    reasons.push(`Cakupan Imunisasi Kritis: ${Math.round(coverage * 100)}%`);
                }
            }

            // Calendar event proximity (now searches Array v2)
            if (trigger.conditions.nearCalendarEvent) {
                if (!isNearCalendarEvent(
                    day,
                    trigger.conditions.nearCalendarEvent,
                    trigger.conditions.daysBefore || 7,
                    trigger.conditions.daysAfter || 3
                )) {
                    isEligible = false;
                } else {
                    reasons.push(`Mobilisasi Massa: Efek ${trigger.conditions.nearCalendarEvent}`);
                }
            }

            // PHBS / sanitation check
            if (trigger.conditions.poorPHBS) {
                if (!isPoorPHBS) {
                    isEligible = false;
                } else {
                    dynamicProb *= 1.5;
                    reasons.push(`Sanitasi Desa Kritis (Skor PHBS: ${Math.round(avgPHBS)})`);
                }
            }
        } else {
            // No conditions — boost by PHBS (legacy behavior preserved)
            if (isPoorPHBS) {
                dynamicProb *= 1.5;
            }
        }

        if (!isEligible) continue;

        // Collect early warning if probability is notable (for Morning Briefing UI)
        if (dynamicProb > 0.05) {
            earlyWarnings.push({
                id: trigger.scenarioId,
                title: `⚠️ Risiko ${trigger.title} Meningkat`,
                desc: reasons.join(' • ') || 'Faktor risiko terdeteksi',
                severity: trigger.severity
            });
        }

        // Probability roll
        const seedStr = seedKey('emerging-trigger', trigger.scenarioId, day, season, avgPHBS);
        if (chanceFromSeed(seedStr, dynamicProb)) {
            if (reasons.length === 0) reasons.push('Kejadian sporadis tidak terduga');

            triggeredCandidates.push({
                scenarioId: trigger.scenarioId,
                title: trigger.title,
                severity: trigger.severity,
                triggerDay: day,
                triggerSeason: season,
                triggerReason: reasons.join('. '),
                uiPayload: trigger.ui || null
            });
        }
    }

    // No outbreak today — return warnings only
    if (triggeredCandidates.length === 0) {
        return { triggeredEvent: null, earlyWarnings };
    }

    // If multiple outbreaks, pick the most severe
    const severityWeight = { 'CRITICAL': 3, 'HIGH': 2, 'WARNING': 1 };
    triggeredCandidates.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));

    return {
        triggeredEvent: triggeredCandidates[0],
        earlyWarnings
    };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export { EMERGING_TRIGGERS };

export default {
    evaluateEmergingTriggers,
    EMERGING_TRIGGERS,
    getVaxCoverage,
    isNearCalendarEvent
};
