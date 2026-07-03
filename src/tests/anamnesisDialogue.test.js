import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/PersistenceService.js', () => ({
    PersistenceService: {
        getAnamnesisVariations: vi.fn(async () => null)
    }
}));

import {
    generateGreeting,
    getAdaptiveResponse,
    initPersonaRNG,
    resetPersonaMemory
} from '../game/AnamnesisEngine.js';

function buildPediatricInformantPatient(overrides = {}) {
    return {
        id: 'peds-1',
        name: 'Ayu',
        age: 5,
        gender: 'P',
        complaint: 'demam dan muntah',
        informant: {
            relation: 'Ibu',
            name: 'Rina'
        },
        social: {
            education: 'SMA',
            trustLevel: 'neutral',
            healthBelief: 'modern'
        },
        communicationStyle: 'concise',
        demeanor: 'Normal',
        ...overrides
    };
}

describe('anamnesis dialogue hygiene', () => {
    beforeEach(() => {
        resetPersonaMemory();
        initPersonaRNG('anamnesis-dialogue-tests');
    });

    it('avoids duplicate titles in pediatric greetings when informant name already includes one', () => {
        const patient = buildPediatricInformantPatient({
            informant: {
                relation: 'Ibu',
                name: 'Ibu Rina'
            }
        });

        const greeting = generateGreeting(patient, 'Maya', 540, { introduced: false });

        expect(greeting.doctorText).toContain('Ibu Rina');
        expect(greeting.doctorText).not.toContain('Ibu Ibu Rina');
    });

    it('normalizes child-focused informant answers so they do not sound like the parent is the patient', async () => {
        const patient = buildPediatricInformantPatient();
        const question = {
            id: 'q_fever',
            text: 'Apakah ada demam?',
            response: 'Saya nggak bisa bilang sakitnya kayak apa.'
        };

        const result = await getAdaptiveResponse(question, patient, 'demo-case', {
            introduced: true,
            trust: 0.5,
            patience: 1,
            count: 2
        });

        expect(result.text).toBe('Saya nggak bisa bilang sakitnya anak saya kayak apa.');
        expect(result.rawClinical).toBe('Saya nggak bisa bilang sakitnya anak saya kayak apa.');
    });

    it('keeps parent-focused questions in first person for the informant', async () => {
        const patient = buildPediatricInformantPatient();
        const question = {
            id: 'q_smoke',
            text: 'Bapak/Ibu perokok aktif?',
            response: 'Iya dok, sehari sebungkus.'
        };

        const result = await getAdaptiveResponse(question, patient, 'demo-case', {
            introduced: true,
            trust: 0.5,
            patience: 1,
            count: 2
        });

        expect(result.text).toBe('Iya dok, sehari sebungkus.');
    });

    it('sanitizes vague persona lines for pediatric informants', async () => {
        initPersonaRNG('seed-27');
        const patient = buildPediatricInformantPatient({
            communicationStyle: 'vague'
        });
        const question = {
            id: 'q_demo',
            text: 'Ruamnya mulai dari mana?',
            response: 'Demam tinggi dok.'
        };

        const result = await getAdaptiveResponse(question, patient, 'demo-case', {
            introduced: true,
            trust: 0.5,
            patience: 1,
            count: 2
        });

        expect(result.text).toContain('anak saya');
        expect(result.text).not.toBe('Saya nggak bisa bilang sakitnya kayak apa.');
    });
});
