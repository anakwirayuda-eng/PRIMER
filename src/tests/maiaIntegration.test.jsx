/* global process */
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

vi.mock('../data/WikiData.js', () => ({
    WIKI_REGISTRY: {
        manajemen: ['liquidity']
    },
    getWikiEntry: vi.fn(async () => ({
        title: 'Liquidity',
        category: 'manajemen',
        icon: 'Info',
        concept: 'Arus dana operasional.',
        ikmContext: 'Konteks IKM.',
        sknContext: 'Konteks SKN.',
        funFact: 'Dana yang sehat menjaga layanan tetap jalan.',
        gameTip: 'Pantau kapitasi dan belanja obat.'
    }))
}));

import EducationalWikiModal from '../components/EducationalWikiModal.jsx';

describe('MAIA integration', () => {
    it('renders live telemetry inside the shared wiki modal', async () => {
        render(
            <EducationalWikiModal
                metricKey="liquidity"
                isOpen
                onClose={() => {}}
                liveStats={{
                    'Dana Kapitasi': 'Rp 50.0M',
                    'Pendapatan Umum': 'Rp 1.25M'
                }}
            />
        );

        await screen.findByText('Telemetry Snapshot');
        expect(screen.getByText('Dana Kapitasi')).toBeInTheDocument();
        expect(screen.getByText('Rp 50.0M')).toBeInTheDocument();
        expect(screen.getByText('Pendapatan Umum')).toBeInTheDocument();
        expect(screen.getByText('Rp 1.25M')).toBeInTheDocument();
    });

    it('keeps MAIA modal ownership out of DashboardPage', () => {
        const dashboardSource = fs.readFileSync(
            path.resolve(process.cwd(), 'src/components/DashboardPage.jsx'),
            'utf8'
        );

        expect(dashboardSource).not.toContain('<EducationalWikiModal');
        expect(dashboardSource).not.toContain("import EducationalWikiModal");
    });
});
