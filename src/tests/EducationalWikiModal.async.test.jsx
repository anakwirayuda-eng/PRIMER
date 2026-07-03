import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getWikiEntryMock = vi.fn();

vi.mock('../hooks/useModalA11y.js', () => ({
    default: () => ({ current: null })
}));

vi.mock('../data/WikiData.js', () => ({
    WIKI_REGISTRY: {
        manajemen: ['liquidity', 'quality_score']
    },
    getWikiEntry: (...args) => getWikiEntryMock(...args)
}));

import EducationalWikiModal from '../components/EducationalWikiModal.jsx';

function createDeferred() {
    let resolve;
    const promise = new Promise((resolver) => {
        resolve = resolver;
    });

    return { promise, resolve };
}

function buildEntry(title, concept) {
    return {
        title,
        category: 'manajemen',
        icon: 'Info',
        concept,
        ikmContext: `${title} IKM`,
        sknContext: `${title} SKN`,
        funFact: `${title} fact`,
        gameTip: `${title} tip`
    };
}

describe('EducationalWikiModal async loading', () => {
    beforeEach(() => {
        getWikiEntryMock.mockReset();
    });

    it('keeps the newest wiki entry when slower responses arrive late', async () => {
        const liquidityRequest = createDeferred();
        const qualityRequest = createDeferred();

        getWikiEntryMock.mockImplementation((key) => {
            if (key === 'liquidity') return liquidityRequest.promise;
            if (key === 'quality_score') return qualityRequest.promise;
            return Promise.resolve(null);
        });

        const { rerender } = render(
            <EducationalWikiModal metricKey="liquidity" isOpen onClose={() => {}} />
        );

        rerender(
            <EducationalWikiModal metricKey="quality_score" isOpen onClose={() => {}} />
        );

        await act(async () => {
            qualityRequest.resolve(buildEntry('Quality Score', 'Konteks mutu terbaru'));
            await qualityRequest.promise;
        });

        expect(await screen.findByText('Konteks mutu terbaru')).toBeInTheDocument();

        await act(async () => {
            liquidityRequest.resolve(buildEntry('Liquidity', 'Konteks likuiditas lama'));
            await liquidityRequest.promise;
        });

        expect(screen.getByText('Konteks mutu terbaru')).toBeInTheDocument();
        expect(screen.queryByText('Konteks likuiditas lama')).not.toBeInTheDocument();
    });
});
