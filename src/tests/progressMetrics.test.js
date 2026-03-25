import { describe, expect, it } from 'vitest';

import {
    getHomeVisitProgressMetrics,
    getPosyanduProgressMetrics,
    normalizeProgressMetric
} from '../utils/progressMetrics.js';

describe('progressMetrics', () => {
    it('normalizes legacy posyandu metric aliases', () => {
        expect(normalizeProgressMetric('posyandu')).toBe('posyandu_done');
        expect(normalizeProgressMetric('patients_treated')).toBe('patients_treated');
    });

    it('maps sanitasi visits to survey and education progress', () => {
        expect(getHomeVisitProgressMetrics('sanitasi')).toEqual([
            'home_visits',
            'education_given',
            'phbs_survey'
        ]);
    });

    it('maps psn visits without inflating generic education progress', () => {
        expect(getHomeVisitProgressMetrics('psn')).toEqual([
            'home_visits',
            'psn_done'
        ]);
    });

    it('maps posyandu sessions to the canonical metrics used by quests and stories', () => {
        expect(getPosyanduProgressMetrics()).toEqual([
            'posyandu_done',
            'nutrition_education'
        ]);
    });
});
