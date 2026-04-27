import {
    STAGE_INDEX,
    STAGE_ORDER,
    calculateVillageIKS,
    getReadinessSummary
} from '../domains/village/NPCReadiness.js';
import { calculateFamilyIKSPisPk } from '../domains/village/pisPkIndicators.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

/**
 * Family-level PIS-PK score (0-1). Delegates to the canonical engine which
 * applies the 12-indikator Kemenkes formula with demographic applicability
 * (e.g. ASI indicator N/A for a family without bayi). Honours `family.iksScore`
 * override for save-game and PosyanduModal flows.
 */
export function calculateFamilyIndicatorIks(family) {
    return calculateFamilyIKSPisPk(family).iks;
}

export function hasBehaviorReadinessEngagement(readinessEntry) {
    if (!readinessEntry || typeof readinessEntry !== 'object') {
        return false;
    }

    return (
        (Number(readinessEntry.visitCount) || 0) > 0 ||
        (Array.isArray(readinessEntry.stageHistory) && readinessEntry.stageHistory.length > 0) ||
        (Array.isArray(readinessEntry.scenarioHistory) && readinessEntry.scenarioHistory.length > 0)
    );
}

export function calculateBehaviorReadinessLift(readinessEntry) {
    if (!hasBehaviorReadinessEngagement(readinessEntry)) {
        return 0;
    }

    const stageIndex = STAGE_INDEX[readinessEntry.stage] ?? 0;
    const contemplationIndex = STAGE_INDEX.contemplation ?? 1;
    const stageProgress = Math.max(0, stageIndex - contemplationIndex);
    const stageLift = (stageProgress / Math.max(1, STAGE_ORDER.length - 1)) * 0.2;
    const familiarityLift = clamp01((Number(readinessEntry.familiarity) || 0) / 100) * 0.05;

    return Math.min(0.2, stageLift + familiarityLift);
}

export function calculateEffectiveFamilyIks(family, readinessState = {}) {
    const baseIks = calculateFamilyIndicatorIks(family);
    const readinessEntry = family?.id ? readinessState?.[family.id] : null;
    return clamp01(baseIks + calculateBehaviorReadinessLift(readinessEntry));
}

export function calculateCommunityMetrics(villageData) {
    const families = Array.isArray(villageData?.families) ? villageData.families : [];
    const readinessState = villageData?.readinessState || {};

    if (families.length === 0) {
        return {
            avgIKS: 0,
            baseAvgIKS: 0,
            jentik: 0,
            risky: 0,
            totalKK: 0,
            activeBehaviorCases: 0,
            engagedFamilies: 0,
            readinessVillageIKS: 0,
            readinessSummary: []
        };
    }

    const effectiveScores = families.map(family => calculateEffectiveFamilyIks(family, readinessState));
    const baseScores = families.map(calculateFamilyIndicatorIks);
    const engagedReadinessState = Object.fromEntries(
        Object.entries(readinessState).filter(([, entry]) => hasBehaviorReadinessEngagement(entry))
    );

    return {
        avgIKS: effectiveScores.reduce((sum, score) => sum + score, 0) / families.length,
        baseAvgIKS: baseScores.reduce((sum, score) => sum + score, 0) / families.length,
        jentik: (families.filter(family => family.indicators?.jentik).length / families.length) * 100,
        risky: effectiveScores.filter(score => score < 0.5).length,
        totalKK: families.length,
        activeBehaviorCases: families.filter(family => typeof family?.activeScenarioId === 'string' && family.activeScenarioId.length > 0).length,
        engagedFamilies: Object.keys(engagedReadinessState).length,
        readinessVillageIKS: Object.keys(engagedReadinessState).length > 0
            ? calculateVillageIKS(engagedReadinessState).iks / 100
            : 0,
        readinessSummary: getReadinessSummary(engagedReadinessState)
    };
}

export default {
    calculateFamilyIndicatorIks,
    hasBehaviorReadinessEngagement,
    calculateBehaviorReadinessLift,
    calculateEffectiveFamilyIks,
    calculateCommunityMetrics
};
