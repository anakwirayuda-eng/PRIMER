/**
 * @reflection
 * [IDENTITY]: EmergingEventTriggers.js
 * [PURPOSE]: Probability engine for Tier 3 (Emerging/Re-emerging) disease events.
 *            Integrates with IKMEventEngine and CalendarEventDB to trigger
 *            surprise KLB/outbreak alerts based on village conditions.
 * [STATE]: Experimental
 * [ANCHOR]: evaluateEmergingTriggers
 * [DEPENDS_ON]: DiseaseScenarios, CalendarEventDB, IKMEventEngine
 */

import { getSeasonForDay } from './IKMEventEngine.js';
import { NATIONAL_HOLIDAYS_2026 } from '../data/CalendarEventDB.js';
import { chanceFromSeed, seedKey } from '../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// TRIGGER CONDITIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Emerging event trigger conditions.
 * Each has a scenario ID, minimum day, probability per check,
 * and optional contextual conditions.
 */
const EMERGING_TRIGGERS = {
    bc_difteri_klb: {
        scenarioId: 'bc_difteri_klb',
        minDay: 21,
        baseProbability: 0.04,
        conditions: {
            vaxCoverageBelow: 0.85,   // Triggers when village DPT coverage < 85%
            vaxIndicator: 'imunisasi'
        },
        season: null,               // Any season
        maxPerRotation: 1,
        cooldownDays: 30
    },
    bc_avian_flu_scare: {
        scenarioId: 'bc_avian_flu_scare',
        minDay: 7,
        baseProbability: 0.03,
        conditions: null,
        season: null,
        maxPerRotation: 1,
        cooldownDays: 45
    },
    bc_anthrax_alert: {
        scenarioId: 'bc_anthrax_alert',
        minDay: 1,
        baseProbability: 0.02,
        conditions: {
            nearCalendarEvent: 'Idul Adha',
            daysBefore: 10,
            daysAfter: 3
        },
        season: null,
        maxPerRotation: 1,
        cooldownDays: 60
    },
    bc_malaria_import: {
        scenarioId: 'bc_malaria_import',
        minDay: 14,
        baseProbability: 0.03,
        conditions: null,
        season: null,
        maxPerRotation: 1,
        cooldownDays: 30
    },
    bc_pertussis_cluster: {
        scenarioId: 'bc_pertussis_cluster',
        minDay: 21,
        baseProbability: 0.04,
        conditions: {
            vaxCoverageBelow: 0.80,
            vaxIndicator: 'imunisasi'
        },
        season: null,
        maxPerRotation: 1,
        cooldownDays: 30
    },
    bc_hep_a_klb: {
        scenarioId: 'bc_hep_a_klb',
        minDay: 14,
        baseProbability: 0.04,
        conditions: null,
        season: 'rainy',
        maxPerRotation: 1,
        cooldownDays: 30
    }
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Calendar Event Proximity
// ═══════════════════════════════════════════════════════════════

/**
 * Check if current game day is near a specific calendar event.
 * @param {number} day - Current game day
 * @param {string} eventName - Name to search for (partial match)
 * @param {number} daysBefore - Window before event
 * @param {number} daysAfter - Window after event
 * @returns {boolean}
 */
function isNearCalendarEvent(day, eventName, daysBefore = 7, daysAfter = 3) {
    for (const [eventDay, event] of Object.entries(NATIONAL_HOLIDAYS_2026)) {
        if (event.title && event.title.toLowerCase().includes(eventName.toLowerCase())) {
            const eventDayNum = parseInt(eventDay);
            if (day >= eventDayNum - daysBefore && day <= eventDayNum + daysAfter) {
                return true;
            }
        }
    }
    return false;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Vaccination Coverage
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate vaccination coverage from village family indicators.
 * @param {Object} villageData - Village data with families
 * @param {string} indicator - Indicator key (e.g., 'imunisasi')
 * @returns {number} Coverage ratio (0-1)
 */
function getVaxCoverage(villageData, indicator = 'imunisasi') {
    if (!villageData?.families) return 1.0; // Assume good if no data

    let total = 0;
    let covered = 0;

    const families = Array.isArray(villageData.families)
        ? villageData.families
        : Object.values(villageData.families);

    for (const family of families) {
        total++;
        const indicators = family.indicators || {};
        if (indicators[indicator]) {
            covered++;
        }
    }

    return total > 0 ? covered / total : 1.0;
}

// ═══════════════════════════════════════════════════════════════
// MAIN EVALUATION
// ═══════════════════════════════════════════════════════════════

/**
 * Evaluate which emerging events should trigger today.
 * Called once per game day during morning briefing.
 *
 * @param {Object} state - Game state
 * @param {number} state.day - Current game day
 * @param {Object} state.villageData - Village data with families + indicators
 * @param {Array}  state.completedEmergingIds - IDs of previously completed emerging events
 * @param {Object} state.emergingCooldowns - Map of scenarioId → last trigger day
 * @returns {Object|null} Triggered emerging event, or null
 */
export function evaluateEmergingTriggers(state) {
    const {
        day = 1,
        villageData = {},
        completedEmergingIds = [],
        emergingCooldowns = {}
    } = state;

    const season = getSeasonForDay(day);

    for (const [_key, trigger] of Object.entries(EMERGING_TRIGGERS)) {
        // Skip already completed
        if (completedEmergingIds.includes(trigger.scenarioId)) continue;

        // Check cooldown
        const lastTrigger = emergingCooldowns[trigger.scenarioId] || 0;
        if (day - lastTrigger < trigger.cooldownDays) continue;

        // Check minimum day
        if (day < trigger.minDay) continue;

        // Check season
        if (trigger.season && trigger.season !== season) continue;

        // Check special conditions
        if (trigger.conditions) {
            // Vaccination coverage check
            if (trigger.conditions.vaxCoverageBelow) {
                const coverage = getVaxCoverage(villageData, trigger.conditions.vaxIndicator);
                if (coverage >= trigger.conditions.vaxCoverageBelow) continue;
            }

            // Calendar event proximity check
            if (trigger.conditions.nearCalendarEvent) {
                const near = isNearCalendarEvent(
                    day,
                    trigger.conditions.nearCalendarEvent,
                    trigger.conditions.daysBefore || 7,
                    trigger.conditions.daysAfter || 3
                );
                if (!near) continue;
            }
        }

        // Probability roll (modified by PHBS score)
        let probability = trigger.baseProbability;

        // Boost probability if village PHBS is poor
        if (villageData?.avgPHBS && villageData.avgPHBS < 60) {
            probability *= 1.5; // 50% more likely in unhealthy villages
        }

        if (chanceFromSeed(seedKey('emerging-trigger', trigger.scenarioId, day, season, villageData?.avgPHBS), probability)) {
            return {
                scenarioId: trigger.scenarioId,
                triggerDay: day,
                triggerSeason: season,
                triggerReason: buildTriggerReason(trigger, day, villageData)
            };
        }
    }

    return null;
}

/**
 * Build a human-readable explanation of why this event triggered.
 */
function buildTriggerReason(trigger, day, villageData) {
    const reasons = [];

    if (trigger.conditions?.vaxCoverageBelow) {
        const coverage = getVaxCoverage(villageData, trigger.conditions.vaxIndicator);
        reasons.push(`Cakupan imunisasi desa: ${Math.round(coverage * 100)}% (di bawah ${Math.round(trigger.conditions.vaxCoverageBelow * 100)}%)`);
    }

    if (trigger.conditions?.nearCalendarEvent) {
        reasons.push(`Mendekati ${trigger.conditions.nearCalendarEvent}`);
    }

    if (trigger.season) {
        reasons.push(`Musim ${trigger.season === 'rainy' ? 'hujan' : 'kemarau'}`);
    }

    if (reasons.length === 0) {
        reasons.push('Kejadian acak (sporadis)');
    }

    return reasons.join('. ');
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
