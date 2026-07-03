import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import i18n from '../i18n.js';

const mockUseGame = vi.fn(() => ({
    delegateEmergencyToMaia: vi.fn(),
    openWiki: vi.fn(),
    time: 120
}));

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('framer-motion', async () => {
    const ReactModule = await import('react');
    const passthrough = (tagName) => ReactModule.forwardRef(function MotionElement(
        { children, initial: _initial, animate: _animate, exit: _exit, transition: _transition, ...props },
        ref
    ) {
        return ReactModule.createElement(tagName, { ref, ...props }, children);
    });
    const MotionDiv = passthrough('div');
    const MotionSpan = passthrough('span');

    return {
        motion: { div: MotionDiv, span: MotionSpan },
        AnimatePresence: ({ children }) => <>{children}</>
    };
});

import { EmergencyEMR } from '../components/EmergencyPanel.jsx';

function buildPatient(id) {
    return {
        id,
        name: `Patient ${id}`,
        age: 30,
        gender: 'L',
        complaint: 'Sesak napas memberat',
        triageLevel: 2,
        deterioration: 0,
        hidden: {
            stabilizationChecklist: ['oxygen'],
            immediateActions: ['oxygen'],
            diagnosis: 'Asma akut'
        },
        medicalData: {
            symptoms: ['sesak', 'mengi'],
            diagnosisName: 'Asma akut',
            trueDiagnosisCode: 'J45',
            vitals: {
                hr: 110,
                spo2: 90,
                rr: 28,
                temp: 37,
                bp: '110/70'
            }
        },
        social: {
            hasBPJS: true
        }
    };
}

describe('EmergencyEMR', () => {
    it('auto-advances after triage lock and resets local state for a new patient id', async () => {
        await i18n.changeLanguage('id');

        const patientOne = buildPatient('igd-1');
        const patientTwo = buildPatient('igd-2');
        const noop = () => {};

        const { rerender } = render(
            <I18nextProvider i18n={i18n}>
                <EmergencyEMR patient={patientOne} onStabilize={noop} onRefer={noop} onDischarge={noop} time={120} />
            </I18nextProvider>
        );

        const triageButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('T2'));
        expect(triageButton).toBeTruthy();
        const lockTriageName = /kunci penilaian triase|emergency\.ui\.lockTriage/i;
        const actionGridTitle = /tactical action grid|emergency\.ui\.actionGridTitle/i;
        const esiAssignmentTitle = /penetapan triase esi|emergency\.ui\.esiAssignment/i;

        fireEvent.click(triageButton);
        fireEvent.click(screen.getByRole('button', { name: lockTriageName }));

        expect(await screen.findByText(actionGridTitle)).toBeInTheDocument();

        rerender(
            <I18nextProvider i18n={i18n}>
                <EmergencyEMR patient={patientTwo} onStabilize={noop} onRefer={noop} onDischarge={noop} time={120} />
            </I18nextProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: lockTriageName })).toBeInTheDocument();
        });

        expect(screen.queryByText(actionGridTitle)).not.toBeInTheDocument();
        expect(screen.getByText(esiAssignmentTitle)).toBeInTheDocument();
    });

    it('renders localized English emergency case copy when the app language is English', async () => {
        await i18n.changeLanguage('en');

        const patient = {
            id: 'igd-foreign-body',
            name: 'Patient A',
            age: 3,
            gender: 'P',
            complaint: 'Tiba-tiba tersedak sambil makan, nggak bisa nangis, wajahnya biru.',
            triageLevel: 1,
            esiLevel: 1,
            deterioration: 0,
            hidden: {
                diseaseId: 'foreign_body_aspiration',
                stabilizationChecklist: ['oxygen'],
                immediateActions: ['oxygen'],
                diagnosis: 'Aspirasi Benda Asing'
            },
            medicalData: {
                symptoms: ['Tersedak tiba-tiba', 'Stridor', 'Batuk paroksismal', 'Sianosis', 'Tidak bisa bicara/menangis'],
                diagnosisName: 'Aspirasi Benda Asing',
                trueDiagnosisCode: 'T17.9',
                anamnesis: [
                    'Anak tersedak kacang, sekarang sesak napas berat, suara napasnya bunyi.',
                    'Tiba-tiba tersedak sambil makan, nggak bisa nangis, wajahnya biru.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: 'Tadi lagi makan kacang, tiba-tiba tersedak nggak bisa napas!', priority: 'essential' },
                        { id: 'q_what', text: 'Kira-kira benda apa?', response: 'Kacang tanah dok, nggak digigit langsung ditelan.', priority: 'essential' },
                        { id: 'q_breathe', text: 'Masih bisa napas?', response: 'Susah banget, suaranya bunyi.', priority: 'essential' }
                    ],
                    rps: [
                        { id: 'q_cough', text: 'Masih batuk?', response: 'Tadi batuk-batuk kuat, sekarang udah nggak kuat batuk lagi.' }
                    ]
                },
                vitals: {
                    hr: 150,
                    spo2: 78,
                    rr: 45,
                    bp: '90/60'
                }
            },
            social: {
                hasBPJS: true
            }
        };

        render(
            <I18nextProvider i18n={i18n}>
                <EmergencyEMR patient={patient} onStabilize={() => {}} onRefer={() => {}} onDischarge={() => {}} time={120} />
            </I18nextProvider>
        );

        expect(screen.getByText('Chief Complaint')).toBeInTheDocument();
        expect(screen.getByText('S.A.M.P.L.E Rapid Anamnesis')).toBeInTheDocument();
        expect(screen.getByText(/3 yr \/ Female/i)).toBeInTheDocument();
        expect(screen.getByText('What happened?')).toBeInTheDocument();
        expect(screen.getByText(/eating peanuts and suddenly choked/i)).toBeInTheDocument();
        expect(screen.getByText('Sudden choking')).toBeInTheDocument();
    });

    it('keeps the open emergency panel synced when the app language changes', async () => {
        await act(async () => {
            await i18n.changeLanguage('id');
        });

        const patient = {
            id: 'igd-language-switch',
            name: 'Patient B',
            age: 3,
            gender: 'P',
            complaint: 'Tiba-tiba tersedak sambil makan, nggak bisa nangis, wajahnya biru.',
            triageLevel: 1,
            esiLevel: 1,
            deterioration: 0,
            hidden: {
                diseaseId: 'foreign_body_aspiration',
                stabilizationChecklist: ['oxygen'],
                immediateActions: ['oxygen'],
                diagnosis: 'Aspirasi Benda Asing'
            },
            medicalData: {
                symptoms: ['Tersedak tiba-tiba', 'Stridor'],
                diagnosisName: 'Aspirasi Benda Asing',
                trueDiagnosisCode: 'T17.9',
                anamnesis: [
                    'Anak tersedak kacang, sekarang sesak napas berat, suara napasnya bunyi.',
                    'Tiba-tiba tersedak sambil makan, nggak bisa nangis, wajahnya biru.'
                ],
                anamnesisQuestions: {
                    keluhan_utama: [
                        { id: 'q_event', text: 'Apa yang terjadi?', response: 'Tadi lagi makan kacang, tiba-tiba tersedak nggak bisa napas!', priority: 'essential' }
                    ]
                },
                vitals: {
                    hr: 150,
                    spo2: 78,
                    rr: 45,
                    bp: '90/60'
                }
            },
            social: {
                hasBPJS: true
            }
        };

        render(
            <I18nextProvider i18n={i18n}>
                <EmergencyEMR patient={patient} onStabilize={() => {}} onRefer={() => {}} onDischarge={() => {}} time={120} />
            </I18nextProvider>
        );

        expect(screen.getByText('Keluhan Utama')).toBeInTheDocument();

        await act(async () => {
            await i18n.changeLanguage('en');
        });

        expect(await screen.findByText('Chief Complaint')).toBeInTheDocument();
        expect(screen.getByText('S.A.M.P.L.E Rapid Anamnesis')).toBeInTheDocument();
        expect(screen.getByText('What happened?')).toBeInTheDocument();
        expect(screen.getByText(/3 yr \/ Female/i)).toBeInTheDocument();
    });

    it('shows localized English billing line items for authored emergency cases', async () => {
        await i18n.changeLanguage('en');

        const patient = {
            id: 'igd-billing-localized',
            name: 'Patient C',
            age: 3,
            gender: 'P',
            complaint: 'Tiba-tiba tersedak sambil makan, nggak bisa nangis, wajahnya biru.',
            triageLevel: 1,
            esiLevel: 1,
            deterioration: 0,
            hidden: {
                diseaseId: 'foreign_body_aspiration',
                stabilizationChecklist: ['oxygen'],
                immediateActions: ['oxygen'],
                diagnosis: 'Aspirasi Benda Asing'
            },
            medicalData: {
                symptoms: ['Tersedak tiba-tiba', 'Stridor'],
                diagnosisName: 'Aspirasi Benda Asing',
                trueDiagnosisCode: 'T17.9',
                vitals: {
                    hr: 150,
                    spo2: 78,
                    rr: 45,
                    bp: '90/60'
                }
            },
            social: {
                hasBPJS: true
            }
        };

        render(
            <I18nextProvider i18n={i18n}>
                <EmergencyEMR patient={patient} onStabilize={() => {}} onRefer={() => {}} onDischarge={() => {}} time={120} />
            </I18nextProvider>
        );

        const triageButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('T1'));
        expect(triageButton).toBeTruthy();

        fireEvent.click(triageButton);
        fireEvent.click(screen.getByRole('button', { name: /lock triage assessment/i }));

        const oxygenButton = (await screen.findAllByRole('button')).find((button) => button.textContent?.includes('Oxygen'));
        expect(oxygenButton).toBeTruthy();
        fireEvent.click(oxygenButton);
        fireEvent.click(screen.getByRole('button', { name: /evaluate & complete actions/i }));
        fireEvent.click(await screen.findByRole('button', { name: /administration & billing details/i }));

        expect(await screen.findAllByText(/Oxygen \(Nasal Cannula \/ Mask\)/i)).not.toHaveLength(0);
    });
});
