/**
 * @reflection
 * [IDENTITY]: ProlanisEngine
 * [PURPOSE]: ProlanisEngine.js Core game logic for Prolanis (Chronic Disease Management)
 * [STATE]: Experimental
 * [ANCHOR]: generateInitialParameters
 * [DEPENDS_ON]: ProlanisDB
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * ProlanisEngine.js
 * Core game logic for Prolanis (Chronic Disease Management)
 */

import { PROLANIS_DISEASES, PROLANIS_EVENTS, getParameterStatus } from '../data/ProlanisDB.js';
import { seedKey, seededBetween, seededFloat } from '../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// PARAMETER SIMULATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate initial parameters for a new Prolanis patient
 */
export function generateInitialParameters(diseaseType, seedHint = 'default') {
    const disease = PROLANIS_DISEASES[diseaseType];
    if (!disease) return {};

    const params = {};
    const baseSeed = seedKey('prolanis-init', diseaseType, seedHint);

    if (diseaseType === 'dm_type2') {
        // Uncontrolled at start (that's why they need Prolanis!)
        params.hba1c = randomRange(7.5, 10, baseSeed, 0);
        params.gds = randomRange(180, 280, baseSeed, 1);
        params.gdp = randomRange(130, 180, baseSeed, 2);
    } else if (diseaseType === 'hypertension') {
        params.systolic = randomRange(150, 180, baseSeed, 0);
        params.diastolic = randomRange(95, 110, baseSeed, 1);
    }

    return params;
}

/**
 * Simulate parameter changes based on treatment and events
 * @param {Object} currentParams - Current patient parameters
 * @param {Object} intervention - Doctor's intervention this month
 * @param {Object} event - Random event that occurred (if any)
 * @param {string} diseaseType - 'dm_type2' or 'hypertension'
 * @returns {Object} New parameters after simulation
 */
export function simulateParameterChange(currentParams, intervention, event, diseaseType, seedHint = 'default') {
    const newParams = { ...currentParams };
    const changeSeed = seedKey('prolanis-change', diseaseType, seedHint, currentParams);
    let driftOffset = 0;

    // Base drift (slight random variation)
    const baseDrift = () => randomRange(-5, 5, changeSeed, driftOffset++);

    // Apply intervention effects
    if (intervention) {
        if (intervention.medicationAction) {
            const effect = intervention.medicationAction.effect?.paramChange || 0;
            if (diseaseType === 'dm_type2') {
                newParams.gds = Math.max(70, newParams.gds + effect + baseDrift());
                newParams.hba1c = Math.max(4, newParams.hba1c + (effect / 50));
            } else if (diseaseType === 'hypertension') {
                newParams.systolic = Math.max(90, newParams.systolic + effect + baseDrift());
                newParams.diastolic = Math.max(60, newParams.diastolic + (effect * 0.6) + baseDrift());
            }
        }

        // Education effects
        if (intervention.education && intervention.education.length > 0) {
            intervention.education.forEach(edu => {
                if (edu.effect) {
                    Object.entries(edu.effect).forEach(([key, value]) => {
                        if (newParams[key] !== undefined) {
                            newParams[key] += value;
                        }
                    });
                }
            });
        }

        // Compliance bonus (consistent patients improve faster)
        if (intervention.complianceBonus) {
            if (diseaseType === 'dm_type2') {
                newParams.gds -= 10;
                newParams.hba1c -= 0.1;
            } else {
                newParams.systolic -= 5;
                newParams.diastolic -= 3;
            }
        }
    }

    // Apply event effects
    if (event && event.effects) {
        Object.entries(event.effects).forEach(([key, value]) => {
            if (newParams[key] !== undefined) {
                newParams[key] += value;
            }
        });
    }

    // Clamp values to realistic ranges
    if (diseaseType === 'dm_type2') {
        newParams.hba1c = clamp(newParams.hba1c, 4, 15);
        newParams.gds = clamp(newParams.gds, 40, 500);
        newParams.gdp = clamp(newParams.gdp, 40, 400);
    } else if (diseaseType === 'hypertension') {
        newParams.systolic = clamp(newParams.systolic, 80, 250);
        newParams.diastolic = clamp(newParams.diastolic, 50, 150);
    }

    return newParams;
}

// ═══════════════════════════════════════════════════════════════
// RISK CALCULATION
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate complication risk score (0-100)
 * Higher = more likely to develop complications
 */
export function calculateComplicationRisk(patient) {
    let risk = patient.complicationRisk || 0;
    const diseaseType = patient.prolanisData?.diseaseType;
    const params = patient.prolanisData?.parameters;
    const history = patient.prolanisData?.history || [];

    if (!diseaseType || !params) return risk;

    // Check current parameter status
    const _disease = PROLANIS_DISEASES[diseaseType];
    let uncontrolledCount = 0;
    let criticalCount = 0;

    Object.entries(params).forEach(([paramName, value]) => {
        const status = getParameterStatus(diseaseType, paramName, value);
        if (status === 'warning') uncontrolledCount++;
        if (status === 'critical') criticalCount++;
        if (status === 'uncontrolled') uncontrolledCount++;
    });

    // Risk increases for uncontrolled parameters
    risk += uncontrolledCount * 5;
    risk += criticalCount * 15;

    // Historical trend (consecutive uncontrolled months)
    const recentHistory = history.slice(-6);
    const uncontrolledMonths = recentHistory.filter(h => !h.wasControlled).length;
    risk += uncontrolledMonths * 8;

    // Age factor
    if (patient.age > 60) risk += 10;
    if (patient.age > 70) risk += 10;

    // Comorbidity factor
    if (patient.prolanisData?.hasComorbidity) risk += 15;

    // Decrease risk for consistent control
    const controlledMonths = recentHistory.filter(h => h.wasControlled).length;
    risk -= controlledMonths * 5;

    return clamp(risk, 0, 100);
}

/**
 * Check if a complication should trigger
 * Returns the complication object if triggered, null otherwise
 */
export function checkForComplication(patient, seedHint = 'default') {
    const risk = calculateComplicationRisk(patient);
    const diseaseType = patient.prolanisData?.diseaseType;
    const disease = PROLANIS_DISEASES[diseaseType];

    if (!disease) return null;

    // Sort complications by risk threshold (lowest first)
    const sortedComplications = [...disease.complications].sort((a, b) => a.riskThreshold - b.riskThreshold);

    // Roll for complication based on risk
    const roll = seededFloat(
        seedKey('prolanis-complication', patient.id || patient.name, seedHint, diseaseType, risk, patient.prolanisData?.history?.length || 0)
    ) * 100;

    for (const complication of sortedComplications) {
        if (risk >= complication.riskThreshold && roll < (risk - complication.riskThreshold + 10)) {
            return complication;
        }
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════
// MONTHLY OUTCOME DETERMINATION
// ═══════════════════════════════════════════════════════════════

/**
 * Determine the outcome of a monthly Prolanis visit
 */
export function determineMonthlyOutcome(patient, doctorDecisions, seedHint = 'default') {
    const diseaseType = patient.prolanisData?.diseaseType;
    const currentParams = patient.prolanisData?.parameters;
    const monthSeed = seedKey(
        'prolanis-month',
        patient.id || patient.name,
        seedHint,
        diseaseType,
        patient.prolanisData?.history?.length || 0
    );

    // Roll for random event
    const event = rollDeterministicEvent(monthSeed);

    // Simulate new parameters
    const newParams = simulateParameterChange(currentParams, doctorDecisions, event, diseaseType, monthSeed);

    // Check if controlled after intervention
    const wasControlled = checkIfControlled(newParams, diseaseType);

    // Calculate new risk
    const tempPatient = {
        ...patient,
        prolanisData: {
            ...patient.prolanisData,
            parameters: newParams,
            history: [...(patient.prolanisData?.history || []), { wasControlled, parameters: newParams }]
        }
    };
    const newRisk = calculateComplicationRisk(tempPatient);

    // Check for complication
    const complication = checkForComplication(tempPatient, seedKey(monthSeed, 'complication'));

    // Calculate XP reward
    let xp = 20; // Base XP for visit
    if (wasControlled) xp += 30;
    if (event?.type === 'positive') xp += 15;
    if (doctorDecisions.education?.length > 0) xp += 10;

    return {
        newParameters: newParams,
        event,
        wasControlled,
        newRisk,
        complication,
        xpEarned: xp,
        consecutiveControlled: wasControlled
            ? (patient.prolanisData?.consecutiveControlled || 0) + 1
            : 0
    };
}

/**
 * Check if all parameters are within target
 */
export function checkIfControlled(params, diseaseType) {
    const disease = PROLANIS_DISEASES[diseaseType];
    if (!disease) return false;

    return Object.entries(disease.parameters).every(([paramName, paramDef]) => {
        const value = params[paramName];
        if (value === undefined) return true;
        return value >= paramDef.target.min && value <= paramDef.target.max;
    });
}

// ═══════════════════════════════════════════════════════════════
// PROLANIS PATIENT SCHEDULING
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a Prolanis patient is due for monthly checkup
 * @param {Object} patient - Prolanis patient
 * @param {number} currentDay - Current game day
 */
export function isPatientDueForCheckup(patient, currentDay) {
    const lastVisitDay = patient.prolanisData?.lastVisitDay || 0;
    const daysSinceVisit = currentDay - lastVisitDay;

    // Due every 30 days (± 5 day tolerance)
    return daysSinceVisit >= 25;
}

/**
 * Get list of Prolanis patients due for checkup today
 */
export function getPatientsDueToday(prolanisRoster, currentDay) {
    return prolanisRoster.filter(p =>
        isPatientDueForCheckup(p, currentDay) &&
        !p.hasComplication
    );
}

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function randomRange(min, max, seed = 'prolanis-range', offset = 0) {
    return seededBetween(`${seed}:${offset}`, min, max);
}

function rollDeterministicEvent(seedHint) {
    const roll = seededFloat(seedKey(seedHint, 'event-roll'));
    let cumulative = 0;

    for (const event of PROLANIS_EVENTS) {
        cumulative += event.probability;
        if (roll < cumulative) {
            return event;
        }
    }

    return null;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Format parameter for display
 */
export function formatParameter(value, paramName) {
    if (paramName === 'hba1c') return value.toFixed(1);
    return Math.round(value);
}

/**
 * Get trend arrow based on history
 */
export function getParameterTrend(history, paramName) {
    if (history.length < 2) return 'stable';

    const recent = history[history.length - 1].parameters[paramName];
    const previous = history[history.length - 2].parameters[paramName];

    const diff = recent - previous;
    if (Math.abs(diff) < 5) return 'stable';

    // For DM/HT, lower is generally better
    return diff < 0 ? 'improving' : 'worsening';
}
