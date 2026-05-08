import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUseGame = vi.fn();

vi.mock('../context/GameContext.jsx', () => ({
    useGame: () => mockUseGame()
}));

vi.mock('../components/VillagerAvatar.jsx', () => ({
    default: ({ name }) => <div>{name}</div>
}));

import SensusPage from '../components/sensus/SensusPage.jsx';

describe('SensusPage', () => {
    afterEach(() => {
        mockUseGame.mockReset();
    });

    it('renders live village families from gameplay state instead of static registry defaults', () => {
        mockUseGame.mockReturnValue({
            villageData: {
                families: [{
                    id: 'kk_runtime',
                    surname: 'Runtime',
                    headName: 'Test Runtime',
                    rt: '09',
                    rw: '02',
                    indicators: { jkn: true, air: true, jamban: true },
                    members: [
                        { id: 'm1', firstName: 'Test', age: 40, gender: 'L', role: 'head', occupation: 'Petani' },
                        { id: 'm2', firstName: 'Ina', age: 35, gender: 'P', role: 'spouse', occupation: 'IRT' }
                    ]
                }]
            }
        });

        render(<SensusPage />);

        expect(screen.getByText('Kel. Runtime')).toBeInTheDocument();
        expect(screen.getByText('RT 09/RW 02')).toBeInTheDocument();
    });

    it('honors focusRw navigation params from Wilayah blank spot dossier', () => {
        mockUseGame.mockReturnValue({
            viewParams: { focusRw: '05', source: 'blank_spot' },
            villageData: {
                unlockedRWs: ['01', '02'],
                families: [
                    {
                        id: 'kk_focus_rw',
                        surname: 'Fokus',
                        headName: 'Pak Fokus',
                        rt: '01',
                        rw: '05',
                        indicators: { jkn: false, air: false, jamban: false },
                        members: [
                            { id: 'm1', firstName: 'Fokus', age: 46, gender: 'L', role: 'head', occupation: 'Petani' }
                        ]
                    },
                    {
                        id: 'kk_lain',
                        surname: 'Lain',
                        headName: 'Bu Lain',
                        rt: '02',
                        rw: '02',
                        indicators: { jkn: true, air: true, jamban: true },
                        members: [
                            { id: 'm2', firstName: 'Lain', age: 38, gender: 'P', role: 'head', occupation: 'Guru' }
                        ]
                    }
                ]
            }
        });

        render(<SensusPage />);

        expect(screen.getByText('Fokus dari blueprint wilayah: RW 05')).toBeInTheDocument();
        expect(screen.getByDisplayValue('RW 05 (Semua RT)')).toBeInTheDocument();
        expect(screen.getByText('Kel. Fokus')).toBeInTheDocument();
        expect(screen.queryByText('Kel. Lain')).not.toBeInTheDocument();
    });
    it('keeps table mode in compact row fallback on 1366px screens', () => {
        const originalInnerWidth = window.innerWidth;
        window.innerWidth = 1366;

        mockUseGame.mockReturnValue({
            villageData: {
                families: [{
                    id: 'kk_compact',
                    surname: 'Compact',
                    headName: 'Pak Compact',
                    rt: '03',
                    rw: '01',
                    indicators: { jkn: true, air: true, jamban: true },
                    members: [
                        { id: 'm1', firstName: 'Compact', age: 41, gender: 'L', role: 'head', occupation: 'Petani' }
                    ]
                }]
            }
        });

        render(<SensusPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Tabel' }));

        expect(screen.getByText('Mode tabel diringkas menjadi kartu baris agar tetap terbaca di layar ini.')).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
        expect(screen.getByText('Kel. Compact')).toBeInTheDocument();

        window.innerWidth = originalInnerWidth;
    });
});
