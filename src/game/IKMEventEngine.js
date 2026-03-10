/**
 * @reflection
 * [IDENTITY]: IKMEventEngine.js
 * [PURPOSE]: Core game engine for IKM (Community Public Health) scenario events.
 *            Evaluates trigger conditions, manages event phases, resolves outcomes,
 *            and calculates impact on village health indicators.
 * [STATE]: Experimental
 * [ANCHOR]: evaluateIKMTriggers
 * [DEPENDS_ON]: IKMScenarioLibrary, CulturalBeliefs, PHBSIndicators
 */

import { IKM_SCENARIOS, getScenarioById } from '../content/scenarios/IKMScenarioLibrary.js';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const MAX_ACTIVE_EVENTS = 2;
const EVENT_COOLDOWN_DAYS = 5; // Min days between events of same category

// ═══════════════════════════════════════════════════════════════
// IKM ↔ BC OVERLAP PREVENTION
// ═══════════════════════════════════════════════════════════════

/**
 * Maps IKM scenario IDs to overlapping BC scenario IDs.
 * When a BC scenario is active, the corresponding IKM scenario is suppressed
 * to prevent duplicate gameplay about the same health topic.
 *
 * Strategy: IKM = "Quick Community Events" (discovery + choice phases)
 *           BC  = "Deep Cases" (full 6-phase COM-B investigation)
 * They cover the same topics but at different depths,
 * so only one should be active at a time.
 */
const IKM_BC_OVERLAP_MAP = {
    // IKM ID              → BC IDs that overlap
    'bab_sembarangan': ['sth_cacing'],
    'cuci_tangan': ['sth_cacing', 'diare_food_poisoning'],
    'makan_sembarangan': ['diare_food_poisoning'],
    'air_minum_tercemar': ['diare_food_poisoning', 'diare_pasca_banjir'],
    'sampah_menumpuk': ['dbd_psn'],
    'tolak_vaksin': ['campak_outbreak', 'difteri_klb'],
    'dukun_beranak': ['tetanus_neonatorum'],
    'jamu_berbahaya': ['keracunan_pestisida'],
    // Cultural scenarios don't overlap with BC directly
    'kesurupan_massal': [],
};

/**
 * Check if an IKM scenario is blocked by an active BC case.
 * @param {string} ikmScenarioId - IKM scenario to check
 * @param {Array}  activeBCCases - Currently active BC case IDs
 * @returns {boolean} true if blocked
 */
export function isBlockedByBC(ikmScenarioId, activeBCCases) {
    const overlapping = IKM_BC_OVERLAP_MAP[ikmScenarioId];
    if (!overlapping || overlapping.length === 0) return false;
    return overlapping.some(bcId => activeBCCases.includes(bcId));
}

// ═══════════════════════════════════════════════════════════════
// EVENT TRIGGER EVALUATION
// ═══════════════════════════════════════════════════════════════

/**
 * Evaluate which IKM scenarios should trigger based on current game state.
 * Called during the morning briefing phase of each day.
 *
 * @param {Object} state - Current game state
 * @param {number} state.day - Current game day
 * @param {string} state.season - Current season (rainy/dry)
 * @param {Object} state.villageData - Village SDOH data
 * @param {Array}  state.activeIKMEvents - Currently active IKM events
 * @param {Array}  state.completedIKMEvents - Previously completed event IDs
 * @param {Object} state.eventCooldowns - Map of category -> last trigger day
 * @param {Array}  state.activeBCCases - Currently active BC case IDs (overlap guard)
 * @returns {Array} List of newly triggered event instances
 */
export function evaluateIKMTriggers(state) {
    const {
        day = 1,
        season = 'dry',
        villageData = {},
        activeIKMEvents = [],
        completedIKMEvents = [],
        eventCooldowns = {},
        activeBCCases = []
    } = state;

    // Don't trigger if already at max active events
    if (activeIKMEvents.length >= MAX_ACTIVE_EVENTS) return [];

    const activeIds = activeIKMEvents.map(e => e.scenarioId);
    const triggered = [];

    for (const scenario of IKM_SCENARIOS) {
        // Skip if already active or completed
        if (activeIds.includes(scenario.id)) continue;
        if (completedIKMEvents.includes(scenario.id)) continue;

        // Skip if a BC deep case covers the same topic (overlap guard)
        if (isBlockedByBC(scenario.id, activeBCCases)) continue;

        // Check cooldown for this category
        const lastTrigger = eventCooldowns[scenario.category] || 0;
        if (day - lastTrigger < EVENT_COOLDOWN_DAYS) continue;

        // Evaluate trigger conditions
        if (shouldTrigger(scenario.triggerConditions, { day, season, villageData })) {
            triggered.push(createEventInstance(scenario, day));

            // Stop if we'd exceed max
            if (activeIKMEvents.length + triggered.length >= MAX_ACTIVE_EVENTS) break;
        }
    }

    return triggered;
}

/**
 * Check if trigger conditions are met for a scenario
 */
function shouldTrigger(conditions, context) {
    const { day, season, villageData } = context;

    // Check minimum day
    if (conditions.minDay && day < conditions.minDay) return false;

    // Check season
    if (conditions.season && conditions.season !== season) return false;

    // Check SDOH conditions
    if (conditions.sdoh && villageData) {
        for (const [key, allowedValues] of Object.entries(conditions.sdoh)) {
            const villageValue = getSDOHValue(villageData, key);
            if (!villageValue) continue;

            const values = Array.isArray(allowedValues) ? allowedValues : [allowedValues];
            if (!values.includes(villageValue)) return false;
        }
    }

    // Probability roll
    const probability = conditions.probability || 0.1;
    return Math.random() < probability;
}

/**
 * Extract SDOH value from village data
 */
function getSDOHValue(villageData, key) {
    // villageData might have families with SDOH indicators
    if (!villageData.families) return null;

    // Check if any family matches the condition
    for (const family of Object.values(villageData.families)) {
        if (family.sdoh && family.sdoh[key]) {
            return family.sdoh[key];
        }
    }
    return null;
}

/**
 * Create a new event instance from a scenario template
 */
export function createEventInstance(scenario, day) {
    return {
        instanceId: `ikm_${scenario.id}_${day}`,
        scenarioId: scenario.id,
        title: scenario.title,
        category: scenario.category,
        icon: scenario.icon,
        urgency: scenario.urgency,
        currentPhaseId: 'discovery',
        startDay: day,
        completed: false,
        outcome: null,
        choicesMade: [],
        impactAccumulated: {}
    };
}

// ═══════════════════════════════════════════════════════════════
// EVENT PHASE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Get the current phase data for an active event
 * @param {Object} eventInstance - Active event instance
 * @returns {Object|null} Current phase definition
 */
export function getCurrentPhase(eventInstance) {
    const scenario = getScenarioById(eventInstance.scenarioId);
    if (!scenario) return null;

    return scenario.phases.find(p => p.id === eventInstance.currentPhaseId) || null;
}

/**
 * Make a choice in the current dialog phase
 * @param {Object} eventInstance - Active event instance
 * @param {number} choiceIndex - Index of the chosen option
 * @returns {Object} Updated event instance
 */
export function makeChoice(eventInstance, choiceIndex) {
    const phase = getCurrentPhase(eventInstance);
    if (!phase || phase.type !== 'dialog' || !phase.choices) return eventInstance;

    const choice = phase.choices[choiceIndex];
    if (!choice) return eventInstance;

    // Accumulate impact
    const newImpact = { ...eventInstance.impactAccumulated };
    if (choice.impact) {
        for (const [key, value] of Object.entries(choice.impact)) {
            newImpact[key] = (newImpact[key] || 0) + value;
        }
    }

    // Record choice
    const newChoices = [...eventInstance.choicesMade, {
        phaseId: eventInstance.currentPhaseId,
        choiceIndex,
        choiceText: choice.text
    }];

    // Advance to next phase
    const nextPhaseId = choice.nextNode || choice.nextPhase;

    return {
        ...eventInstance,
        currentPhaseId: nextPhaseId,
        impactAccumulated: newImpact,
        choicesMade: newChoices
    };
}

/**
 * Generic advancer for custom UI phases (like diagnosisQnA or interventionQnA)
 * where the UI evaluates the user's answers and determines the outcome.
 * @param {Object} eventInstance - Active event instance
 * @param {string} nextPhaseId - The next phase to go to
 * @param {Object} impactDelta - Impact to accumulate (e.g. { iks_score: -3 })
 * @param {Object} choiceLog - Optional choice to record in choicesMade
 * @returns {Object} Updated event instance
 */
export function advanceEventPhase(eventInstance, nextPhaseId, impactDelta = {}, choiceLog = null) {
    const newImpact = { ...eventInstance.impactAccumulated };
    for (const [key, value] of Object.entries(impactDelta)) {
        if (typeof value === 'number') {
            newImpact[key] = (newImpact[key] || 0) + value;
        } else {
            // Arrays, strings, and objects like spawnPatients are overwritten/merged
            newImpact[key] = value;
        }
    }

    const newChoices = [...eventInstance.choicesMade];
    if (choiceLog) {
        newChoices.push(choiceLog);
    }

    return {
        ...eventInstance,
        currentPhaseId: nextPhaseId,
        impactAccumulated: newImpact,
        choicesMade: newChoices
    };
}

/**
 * Advance an event from an action phase (called when action metric is met)
 * @param {Object} eventInstance - Active event instance
 * @returns {Object} Updated event instance
 */
export function completeAction(eventInstance) {
    const phase = getCurrentPhase(eventInstance);
    if (!phase || phase.type !== 'action') return eventInstance;

    return {
        ...eventInstance,
        currentPhaseId: phase.onComplete
    };
}

/**
 * Resolve a dialog phase that is an endpoint
 * @param {Object} eventInstance - Active event instance
 * @returns {Object} Updated event instance with completed=true
 */
export function resolveEvent(eventInstance) {
    const phase = getCurrentPhase(eventInstance);
    if (!phase) return eventInstance;

    // Accumulate ending impact
    const newImpact = { ...eventInstance.impactAccumulated };
    if (phase.impact) {
        for (const [key, value] of Object.entries(phase.impact)) {
            if (typeof value === 'number') {
                newImpact[key] = (newImpact[key] || 0) + value;
            } else {
                newImpact[key] = value;
            }
        }
    }

    // Check if the phase explicitly spawns patients
    if (phase.spawnPatients) {
        newImpact.spawnPatients = phase.spawnPatients;
    }

    return {
        ...eventInstance,
        completed: phase.isEnd === true,
        outcome: phase.isEnd ? 'resolved' : eventInstance.outcome,
        impactAccumulated: newImpact
    };
}

// ═══════════════════════════════════════════════════════════════
// IMPACT APPLICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Apply accumulated impact from a completed event to the game state.
 * Returns a set of deltas to be applied by the store.
 *
 * @param {Object} eventInstance - Completed event instance
 * @returns {Object} Impact deltas: { reputation, xp, balance, energy, iks_score, outbreak_risk_reduction, outbreak_risk }
 */
export function calculateEventImpact(eventInstance) {
    if (!eventInstance.completed) return {};

    const scenario = getScenarioById(eventInstance.scenarioId);
    const accumulated = eventInstance.impactAccumulated || {};

    // Merge accumulated choice impacts with final outcome
    const impact = { ...accumulated };

    // Add scenario-level outcome bonus if applicable
    if (scenario?.outcomes?.success) {
        const outcome = scenario.outcomes.success;
        for (const [key, value] of Object.entries(outcome)) {
            if (key === 'outbreak_risk_reduction' || key === 'outbreak_risk' || key === 'spawnPatients') {
                impact[key] = value; // Non-numeric values, don't accumulate
            } else if (typeof value === 'number') {
                impact[key] = (impact[key] || 0) + value;
            }
        }
    }

    return impact;
}

// ═══════════════════════════════════════════════════════════════
// ACTION PROGRESS TRACKING
// ═══════════════════════════════════════════════════════════════

/**
 * Check if an active event has an action phase that should be updated.
 * Called whenever a game metric changes (home_visits, psn_done, education_given, etc.)
 *
 * @param {Array} activeEvents - Array of active IKM event instances
 * @param {string} metric - The metric that changed
 * @param {number} currentProgress - Current total for this metric
 * @returns {Array} Updated active events (with any completed actions advanced)
 */
export function updateEventProgress(activeEvents, metric, currentProgress) {
    return activeEvents.map(event => {
        if (event.completed) return event;

        const phase = getCurrentPhase(event);
        if (!phase || phase.type !== 'action') return event;

        // Check if this event's action phase matches the metric
        if (phase.metric === metric && currentProgress >= phase.target) {
            return completeAction(event);
        }

        return event;
    });
}

// ═══════════════════════════════════════════════════════════════
// SEASON LOGIC
// ═══════════════════════════════════════════════════════════════

/**
 * Determine the current season based on game month.
 * Indonesia: Oct-Mar = rainy, Apr-Sep = dry
 *
 * @param {number} day - Current game day
 * @returns {string} 'rainy' or 'dry'
 */
export function getSeasonForDay(day) {
    // Game starts in January. Each month ~ 30 days.
    const month = Math.floor((day - 1) / 30) % 12; // 0-11
    // Rainy: Oct(9), Nov(10), Dec(11), Jan(0), Feb(1), Mar(2)
    const rainyMonths = [0, 1, 2, 9, 10, 11];
    return rainyMonths.includes(month) ? 'rainy' : 'dry';
}

// ═══════════════════════════════════════════════════════════════
// EVENT SUMMARY (for MorningBriefing / Dashboard)
// ═══════════════════════════════════════════════════════════════

/**
 * Get a summary of active IKM events for display
 * @param {Array} activeEvents
 * @returns {Array} Simplified event summaries
 */
export function getEventSummaries(activeEvents) {
    return activeEvents
        .filter(e => !e.completed)
        .map(e => {
            const phase = getCurrentPhase(e);
            return {
                instanceId: e.instanceId,
                title: e.title,
                icon: e.icon,
                urgency: e.urgency,
                category: e.category,
                phaseType: phase?.type || 'unknown',
                needsPlayerAction: phase?.type === 'dialog' && !!phase?.choices,
                actionDescription: phase?.type === 'action' ? phase.description : null,
                actionMetric: phase?.type === 'action' ? phase.metric : null,
                actionTarget: phase?.type === 'action' ? phase.target : null
            };
        });
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
    evaluateIKMTriggers,
    isBlockedByBC,
    createEventInstance,
    getCurrentPhase,
    makeChoice,
    completeAction,
    resolveEvent,
    calculateEventImpact,
    updateEventProgress,
    getSeasonForDay,
    getEventSummaries
};
