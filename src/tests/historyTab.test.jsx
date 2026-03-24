import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HistoryTab from '../components/emr/HistoryTab.jsx';

describe('HistoryTab', () => {
    it('falls back to canonical diagnosis fields for legacy visits without decision diagnoses', () => {
        render(
            <HistoryTab
                patient={{ social: { villagerId: 'villager-1' } }}
                isDark={false}
                openWiki={() => {}}
                history={[
                    {
                        day: 3,
                        dischargedAt: 540,
                        social: { villagerId: 'villager-1' },
                        decision: { action: 'treat' },
                        medicalData: {
                            trueDiagnosisCode: 'I10',
                            diagnosisName: 'Hipertensi'
                        }
                    }
                ]}
            />
        );

        expect(screen.getByText('I10')).toBeInTheDocument();
    });
});
