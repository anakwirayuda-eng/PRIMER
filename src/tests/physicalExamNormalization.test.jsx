import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BodyMapWidget from '../components/BodyMapWidget.jsx';
import PhysicalExamTab from '../components/emr/PhysicalExamTab.jsx';
import {
    calculateCoverageScore,
    getExamLabSuggestions,
} from '../game/ClinicalReasoning.js';
import { validateExams } from '../game/ValidationEngine.js';
import { getPhysicalExamFinding } from '../utils/physicalExam.js';

describe('physical exam normalization', () => {
    it('merges legacy thorax aliases into a single body-map progress segment', () => {
        render(
            <BodyMapWidget
                examsPerformed={{
                    cardio: 'Gallop S3 (+).',
                    respiratory: 'Wheezing bilateral.',
                }}
                onExam={() => {}}
                isDark={false}
            />
        );

        expect(screen.getByText('8%')).toBeInTheDocument();
        expect(screen.getByText('1/12')).toBeInTheDocument();
    });

    it('normalizes MAIA suggestion clicks to canonical body-map keys', () => {
        const handleExam = vi.fn();

        render(
            <PhysicalExamTab
                patient={null}
                isDark={false}
                handleExam={handleExam}
                examsPerformed={{}}
                examResultsRef={{ current: null }}
                openWiki={() => {}}
                maiaSuggestions={[{ id: 'respiratory', label: 'Respirasi' }]}
                anamnesisScore={60}
            />
        );

        fireEvent.click(screen.getByText('Respirasi'));
        expect(handleExam).toHaveBeenCalledWith('thorax');
    });

    it('resolves canonical thorax findings from legacy case keys', () => {
        const finding = getPhysicalExamFinding(
            {
                physicalExamFindings: {
                    cardio: 'BJ I-II lemah, gallop S3 (+).',
                    respiratory: 'Wheezing bilateral.',
                },
            },
            'thorax'
        );

        expect(finding).toContain('Kardiovaskular: BJ I-II lemah, gallop S3 (+).');
        expect(finding).toContain('Respirasi: Wheezing bilateral.');
    });

    it('deduplicates MAIA exam suggestions onto canonical keys', () => {
        const { examSuggestions } = getExamLabSuggestions(
            {
                physicalExamFindings: {
                    cardio: 'Gallop S3 (+).',
                    respiratory: 'Wheezing bilateral.',
                    genital: 'Ulkus genital.',
                },
                relevantLabs: [],
            },
            [],
            [],
            60
        );

        expect(examSuggestions.map((suggestion) => suggestion.id)).toEqual(['thorax', 'genitalia']);
    });

    it('normalizes canonical dengue lab requirements against legacy ordered labs', () => {
        const result = validateExams(
            {
                physicalExamFindings: {
                    general: 'Tampak sakit sedang.',
                    vitals: 'TD 110/70, N 88x, RR 18x.',
                },
                relevantLabs: ['lab_hematology', 'lab_ns1'],
            },
            ['general', 'vitals'],
            ['Darah Lengkap', 'NS1 Antigen']
        );

        expect(result.labScore).toBe(100);
        expect(result.missingLabs).toEqual([]);
        expect(result.unnecessaryLabs).toEqual([]);
    });

    it('normalizes MAIA lab suggestions onto canonical dengue lab keys', () => {
        const { labSuggestions } = getExamLabSuggestions(
            {
                physicalExamFindings: {
                    general: 'Tampak sakit sedang.',
                    vitals: 'TD 110/70, N 88x, RR 18x.',
                },
                relevantLabs: ['lab_hematology', 'lab_ns1'],
            },
            [],
            ['darah_lengkap'],
            60
        );

        expect(labSuggestions).toEqual([
            {
                id: 'lab_ns1',
                label: 'NS1 Ag',
                message: 'Lab yang perlu dipertimbangkan: NS1 Ag',
                priority: 'medium',
            },
        ]);
    });

    it('scores canonical body-map exams correctly against legacy case keys', () => {
        const result = validateExams(
            {
                physicalExamFindings: {
                    general: 'Tampak sakit.',
                    vitals: 'TD 120/80, RR 28x.',
                    respiratory: 'Wheezing bilateral.',
                    cardio: 'Gallop S3 (+).',
                    genital: 'Ulkus genital.',
                    obstetric: 'VT: pembukaan 4 cm.',
                    extremity: 'Edema pretibial bilateral.',
                },
                relevantLabs: [],
            },
            ['thorax', 'genitalia', 'extremities'],
            []
        );

        expect(result.examScore).toBe(100);
        expect(result.examsCorrect).toEqual(['thorax', 'genitalia', 'extremities']);
        expect(result.missingExams).toEqual([]);
        expect(result.unnecessaryExams).toEqual([]);
    });

    it('does not overcount duplicate alias exams in coverage scoring', () => {
        const coverage = calculateCoverageScore([], ['thorax', 'respiratory', 'cardio'], [], []);

        expect(coverage.physical).toBe(20);
    });
});
