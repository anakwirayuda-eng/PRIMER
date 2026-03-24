import { calculateIKS } from '../game/GameCore.js';

const GENERAL_INDICATORS = ['air', 'jamban', 'jentik', 'imunisasi', 'persalinan', 'jkn', 'jiwa', 'balita', 'asi'];

const TOPIC_TO_INDICATORS = {
    use_latrine: ['jamban'],
    boil_water: ['air'],
    water_treatment: ['air'],
    well_protection: ['air'],
    hand_hygiene: ['air'],
    food_hygiene: ['air'],
    food_safety: ['air'],
    waste_management: ['jentik'],
    mosquito_breeding: ['jentik'],
    psn_3m: ['jentik'],
    respiratory_hygiene: ['air'],
    immunization_importance: ['imunisasi'],
    vaccine_safety: ['imunisasi'],
    herd_immunity: ['imunisasi'],
    safe_delivery: ['persalinan'],
    skilled_birth_attendant: ['persalinan'],
    bidan_dukun_partnership: ['persalinan'],
    partner_dukun: ['persalinan'],
    antenatal_care: ['persalinan'],
    bpjs_access: ['jkn'],
    mental_health: ['jiwa'],
    ptsd_awareness: ['jiwa'],
    psychosis_management: ['jiwa'],
    destigmatization: ['jiwa'],
    suicide_prevention: ['jiwa'],
    adolescent_mental_health: ['jiwa'],
    balanced_nutrition: ['balita'],
    mpasi: ['balita'],
    kms_monitoring: ['balita'],
    exclusive_breastfeeding: ['asi'],
    infant_nutrition: ['asi'],
    iron_rich_food: ['balita'],
    adolescent_nutrition: ['balita'],
};

const CASE_TO_INDICATORS = {
    diare_akut: ['air', 'jamban'],
    tifoid: ['air', 'jamban'],
    gastroenteritis_akut: ['air', 'jamban'],
    dbd: ['jentik'],
    dss: ['jentik'],
    campak: ['imunisasi'],
    rubella: ['imunisasi'],
    perdarahan_postpartum: ['persalinan'],
    perdarahan_post_partum: ['persalinan'],
    preeklampsia: ['persalinan'],
    gizi_buruk: ['balita'],
    cacingan: ['jamban', 'air'],
    anemia_defisiensi_besi: ['balita'],
    anemia_deficiency: ['balita'],
};

export function deriveIkmTargetIndicators(scenarioData = {}) {
    const topicIndicators = (scenarioData.educationTopics || [])
        .flatMap(topic => TOPIC_TO_INDICATORS[topic] || []);
    const caseIndicators = (scenarioData.relatedCases || [])
        .flatMap(caseId => CASE_TO_INDICATORS[caseId] || []);
    const merged = [...new Set([...topicIndicators, ...caseIndicators].filter(Boolean))];
    return merged.length > 0 ? merged : [...GENERAL_INDICATORS];
}

function sortFamilyCandidates(a, b) {
    if (a.score !== b.score) return a.score - b.score;
    return String(a.id).localeCompare(String(b.id));
}

function sortFamilyCandidatesDescending(a, b) {
    if (a.score !== b.score) return b.score - a.score;
    return String(a.id).localeCompare(String(b.id));
}

export function applyIkmScoreToVillage(villageData, scenarioData, iksDelta) {
    if (!villageData || !Array.isArray(villageData.families)) return villageData;
    if (!Number.isFinite(iksDelta) || iksDelta === 0) return villageData;

    const direction = iksDelta > 0 ? 1 : -1;
    const targetIndicators = deriveIkmTargetIndicators(scenarioData);
    const indicatorPool = [...new Set([...targetIndicators, ...GENERAL_INDICATORS])];
    const families = villageData.families.map(family => ({
        ...family,
        indicators: { ...(family.indicators || {}) },
        iksScore: Number.isFinite(family.iksScore) ? family.iksScore : calculateIKS(family.indicators || {})
    }));

    let remainingBudget = Math.max(1, Math.min(6, Math.round(Math.abs(iksDelta))));

    while (remainingBudget > 0) {
        const candidatePool = families
            .map((family, index) => {
                const matchingIndicators = indicatorPool.filter((indicator) =>
                    direction > 0
                        ? family.indicators[indicator] !== true
                        : family.indicators[indicator] === true
                );
                return {
                    id: family.id,
                    index,
                    score: family.iksScore || 0,
                    matchingIndicators
                };
            })
            .filter(candidate => candidate.matchingIndicators.length > 0)
            .sort(direction > 0 ? sortFamilyCandidates : sortFamilyCandidatesDescending);

        const candidate = candidatePool[0];
        if (!candidate) break;

        const family = families[candidate.index];
        const indicator = candidate.matchingIndicators[0];
        family.indicators[indicator] = direction > 0;
        family.iksScore = calculateIKS(family.indicators);
        remainingBudget -= 1;
    }

    const avgIKS = families.length > 0
        ? Math.round((families.reduce((sum, family) => sum + (family.iksScore || 0), 0) / families.length) * 100) / 100
        : 0;

    return {
        ...villageData,
        families,
        stats: villageData.stats
            ? { ...villageData.stats, avgIKS }
            : villageData.stats
    };
}
