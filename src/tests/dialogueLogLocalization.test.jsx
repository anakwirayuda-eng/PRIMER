import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DialogueLog from '../components/emr/anamnesis/DialogueLog.jsx';

const t = (key, options = {}) => {
    const translations = {
        'anamnesis.dialogue.empty': '[ WAITING FOR CLINICAL QUESTIONS ]',
        'anamnesis.dialogue.doctor': 'Doctor',
        'anamnesis.dialogue.patient': 'Patient',
        'anamnesis.dialogue.companion': 'Companion',
        'anamnesis.dialogue.vague': 'Unclear'
    };
    return translations[key] ?? options.defaultValue ?? key;
};

describe('DialogueLog localization', () => {
    it('localizes the empty anamnesis prompt', () => {
        render(
            <DialogueLog
                anamnesisHistory={[]}
                patient={{ name: 'Budi', age: 30, gender: 'L' }}
                isDark={false}
                chatEndRef={{ current: null }}
                isProcessing={false}
                t={t}
            />
        );

        expect(screen.getByText('[ WAITING FOR CLINICAL QUESTIONS ]')).toBeInTheDocument();
    });

    it('localizes doctor and vague labels in dialogue bubbles', () => {
        render(
            <DialogueLog
                anamnesisHistory={[
                    {
                        id: 'q_demo',
                        text: 'How are you feeling?',
                        response: 'Hard to explain, Doc.',
                        isVague: true
                    }
                ]}
                patient={{ age: 30, gender: 'L' }}
                isDark={false}
                chatEndRef={{ current: null }}
                isProcessing={false}
                t={t}
            />
        );

        expect(screen.getByText('Doctor')).toBeInTheDocument();
        expect(screen.getByText('Unclear')).toBeInTheDocument();
        expect(screen.getByText('Patient')).toBeInTheDocument();
    });
});
