import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CaseSpecificSelection from '../components/emr/anamnesis/CaseSpecificSelection.jsx';

function buildProps(overrides = {}) {
    return {
        patient: { age: 30, gender: 'L' },
        anamnesisCategory: 'rps',
        hasAskedComplaint: false,
        caseData: {
            anamnesisQuestions: {
                rps: [
                    { id: 'rps_1', text: 'Nyeri sejak kapan?', response: 'Sejak pagi.' },
                    { id: 'rps_2', text: 'Apakah makin berat?', response: 'Iya.' }
                ],
                sosial: [
                    { id: 'sosial_1', text: 'Apakah ada paparan asap?', response: 'Tidak.' },
                    { id: 'sosial_2', text: 'Siapa yang menemani?', response: 'Istri.' }
                ]
            },
            essentialQuestions: []
        },
        anamnesisHistory: [],
        handleAskQuestion: vi.fn(),
        isDark: false,
        ...overrides
    };
}

function buildTranslator(overrides = {}) {
    const translations = {
        'anamnesis.ui.grid_label': 'Anamnesis questions',
        'anamnesis.question_rewrites.adolescent_activity': 'What do they usually do day to day? School or other activities?',
        'anamnesis.question_rewrites.adolescent_smoke': 'Have they ever smoked or been exposed to cigarette smoke often?',
        'anamnesis.questions.rps_onset': 'When did this complaint start?',
        'anamnesis.responses.rps_onset': 'It started a few days ago, Doc.',
        'anamnesis.tags.rps_onset': 'Onset'
    };

    return (key, options = {}) => {
        const translation = overrides[key] ?? translations[key];
        return translation ?? options.defaultValue ?? key;
    };
}

describe('CaseSpecificSelection', () => {
    it('resets focus to the first tag when the category changes', async () => {
        const props = buildProps();
        const { rerender } = render(<CaseSpecificSelection {...props} />);

        const grid = screen.getByRole('grid', { name: /pertanyaan anamnesis/i });
        let cells = screen.getAllByRole('gridcell');

        expect(cells[0]).toHaveAttribute('tabindex', '0');

        fireEvent.keyDown(grid, { key: 'ArrowRight' });

        await waitFor(() => {
            const updatedCells = screen.getAllByRole('gridcell');
            expect(updatedCells[1]).toHaveAttribute('tabindex', '0');
        });

        rerender(
            <CaseSpecificSelection
                {...props}
                anamnesisCategory="sosial"
            />
        );

        cells = screen.getAllByRole('gridcell');
        expect(cells[0]).toHaveAttribute('tabindex', '0');
    });

    it('hides adult-only generic history prompts for pediatric patients', () => {
        render(
            <CaseSpecificSelection
                {...buildProps({
                    patient: {
                        age: 5,
                        gender: 'P',
                        informant: { relation: 'Ibu', name: 'Rina' }
                    },
                    anamnesisCategory: 'rpd',
                    caseData: {
                        anamnesisQuestions: {
                            rpd: []
                        },
                        essentialQuestions: []
                    }
                })}
            />
        );

        expect(screen.getByTitle(/Pernah mengalami keluhan serupa sebelumnya\?/i)).toBeInTheDocument();
        expect(screen.queryByTitle(/riwayat darah tinggi/i)).not.toBeInTheDocument();
        expect(screen.queryByTitle(/riwayat kencing manis/i)).not.toBeInTheDocument();
        expect(screen.queryByTitle(/riwayat penyakit jantung/i)).not.toBeInTheDocument();
    });

    it('rewrites social prompts for pediatric informants and removes alcohol prompts', () => {
        render(
            <CaseSpecificSelection
                {...buildProps({
                    patient: {
                        age: 5,
                        gender: 'P',
                        informant: { relation: 'Ibu', name: 'Rina' }
                    },
                    anamnesisCategory: 'sosial',
                    caseData: {
                        anamnesisQuestions: {
                            sosial: []
                        },
                        essentialQuestions: []
                    }
                })}
            />
        );

        expect(screen.getByTitle(/Aktivitas anak sehari-hari bagaimana\?/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Ada yang merokok di rumah atau dekat anak\?/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Bagaimana pola makan anak sehari-hari\?/i)).toBeInTheDocument();
        expect(screen.queryByTitle(/mengonsumsi minuman beralkohol/i)).not.toBeInTheDocument();
    });

    it('rewrites adolescent social prompts to school/activity framing', () => {
        render(
            <CaseSpecificSelection
                {...buildProps({
                    patient: {
                        age: 13,
                        gender: 'P'
                    },
                    anamnesisCategory: 'sosial',
                    caseData: {
                        anamnesisQuestions: {
                            sosial: []
                        },
                        essentialQuestions: []
                    }
                })}
            />
        );

        expect(screen.getByTitle(/Sehari-hari aktivitasnya apa\? Sekolah atau kegiatan lain\?/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Pernah merokok atau sering kena asap rokok\?/i)).toBeInTheDocument();
        expect(screen.queryByTitle(/mengonsumsi minuman beralkohol/i)).not.toBeInTheDocument();
    });

    it('switches anamnesis shell copy to English when a translator is supplied', () => {
        render(
            <CaseSpecificSelection
                {...buildProps({
                    patient: {
                        age: 13,
                        gender: 'P'
                    },
                    anamnesisCategory: 'sosial',
                    caseData: {
                        anamnesisQuestions: {
                            sosial: []
                        },
                        essentialQuestions: []
                    }
                })}
                t={buildTranslator()}
            />
        );

        expect(screen.getByRole('grid', { name: /anamnesis questions/i })).toBeInTheDocument();
        expect(screen.getByTitle(/What do they usually do day to day\? School or other activities\?/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Have they ever smoked or been exposed to cigarette smoke often\?/i)).toBeInTheDocument();
    });

    it('localizes generic anamnesis question text, tag, and response payloads', () => {
        const handleAskQuestion = vi.fn();

        render(
            <CaseSpecificSelection
                {...buildProps({
                    anamnesisCategory: 'rps',
                    caseData: {
                        anamnesisQuestions: {
                            rps: []
                        },
                        essentialQuestions: []
                    },
                    handleAskQuestion
                })}
                t={buildTranslator()}
            />
        );

        const onsetButton = screen.getByTitle('When did this complaint start?');

        expect(onsetButton).toHaveTextContent('Onset');

        fireEvent.click(onsetButton);

        expect(handleAskQuestion).toHaveBeenCalledWith(expect.objectContaining({
            id: 'rps_onset',
            text: 'When did this complaint start?',
            response: 'It started a few days ago, Doc.'
        }));
    });
});
