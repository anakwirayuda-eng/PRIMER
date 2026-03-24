import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

import PatientHistoryModal from '../components/PatientHistoryModal.jsx';

describe('PatientHistoryModal', () => {
    it('falls back to canonical diagnosisName when diagnosis code is absent', () => {
        render(
            <PatientHistoryModal
                patients={[
                    {
                        id: 'p-1',
                        name: 'Budi',
                        age: 42,
                        gender: 'L',
                        medicalData: { diagnosisName: 'Hipertensi' },
                        decision: { action: 'treat' },
                        social: { hasBPJS: false }
                    }
                ]}
                filter="all"
                onClose={() => {}}
                title="Riwayat"
            />
        );

        expect(screen.getByText('Hipertensi')).toBeInTheDocument();
    });
});
