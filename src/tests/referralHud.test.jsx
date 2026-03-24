import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ReferralHUD from '../components/ReferralHUD.jsx';

describe('ReferralHUD', () => {
    it('renders the arrival note and arrival time for completed referrals', () => {
        render(
            <ReferralHUD
                day={1}
                time={620}
                activeReferralLog={[
                    {
                        id: 'ref-1',
                        patientId: 'p-1',
                        patientName: 'Siti Aminah',
                        hospitalName: 'RSUD Kota',
                        distance: 10,
                        ambulanceType: 'Advance',
                        sentDay: 1,
                        timeSent: 480,
                        estimatedArrivalTotal: 555,
                        arrivedTime: 555,
                        status: 'ARRIVED',
                        arrivalNote: 'Berkas lengkap. Stempel basah didapat.'
                    }
                ]}
            />
        );

        expect(screen.getByText('SAMPAI')).toBeInTheDocument();
        expect(screen.getByText('Pasien telah diterima di RS')).toBeInTheDocument();
        expect(screen.getByText('Berkas lengkap. Stempel basah didapat.')).toBeInTheDocument();
        expect(screen.getByText('Tiba 09:15')).toBeInTheDocument();
    });
});
