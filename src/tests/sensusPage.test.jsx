import React from 'react';
import { render, screen } from '@testing-library/react';
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
        expect(screen.getByText(/Menampilkan 1 dari 1 KK/i)).toBeInTheDocument();
    });
});
