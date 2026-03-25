const PROGRESS_METRIC_ALIASES = {
    posyandu: 'posyandu_done'
};

export function normalizeProgressMetric(metric) {
    if (typeof metric !== 'string' || metric.length === 0) return metric;
    return PROGRESS_METRIC_ALIASES[metric] || metric;
}

export function getHomeVisitProgressMetrics(actionId) {
    const metrics = ['home_visits'];

    if (actionId === 'psn') {
        metrics.push('psn_done');
    } else {
        metrics.push('education_given');
    }

    if (actionId === 'sanitasi') {
        metrics.push('phbs_survey');
    }

    if (actionId === 'asi' || actionId === 'balita') {
        metrics.push('nutrition_education');
    }

    return metrics;
}

export function getPosyanduProgressMetrics() {
    return ['posyandu_done', 'nutrition_education'];
}

export default {
    normalizeProgressMetric,
    getHomeVisitProgressMetrics,
    getPosyanduProgressMetrics
};
