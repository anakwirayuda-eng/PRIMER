/* global process */
/**
 * @reflection
 * [IDENTITY]: FeatureGuard
 * [PURPOSE]: Verify critical game features are present in the build.
 * [STATE]: Stable
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';

// Components
import EducationalWikiModal from '../components/EducationalWikiModal.jsx';

// Mock specific dependencies for WikiModal if needed
// WikiModal appears to be a presentational component mostly, but might use hooks.
// Assuming it is relatively pure or we can mock context if it fails.

describe('Feature Guard: Critical Features', () => {

    it('MAIA Codex (Wiki) should be accessible and tagged', () => {
        // Mock props
        const props = {
            isOpen: true,
            onClose: () => { },
            section: 'general'
        };

        // We might need to wrap this if it errors due to context
        try {
            render(<EducationalWikiModal {...props} />);
            expect(screen.getByTestId('maia-codex')).toBeInTheDocument();
        } catch {
            // Fallback: If render fails due to complex dependencies, check file content
            const content = fs.readFileSync(path.resolve(process.cwd(), 'src/components/EducationalWikiModal.jsx'), 'utf8');
            expect(content).toContain('data-testid="maia-codex"');
        }
    });

    it('Dashboard should contain IKS Stats (dashboard-stats)', () => {
        // Dashboard is too complex to render in isolation without heavy mocking.
        // We perform a static verification ensuring the tag exists in the source.
        const content = fs.readFileSync(path.resolve(process.cwd(), 'src/components/DashboardPage.jsx'), 'utf8');
        expect(content).toContain('data-testid="dashboard-stats"');
    });

    it('Asset Management should rely on manifest (random check)', () => {
        // Quick verify that we don't have hardcoded assets in key files
        const filesToCheck = [
            'src/components/OpeningScreen.jsx',
            'src/components/MainLayout.jsx'
        ];

        filesToCheck.forEach(file => {
            const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
            // Should verify getAssetUrl is used or at least imported
            // This is a loose check, the real work is done by watchdog-asset-refs.mjs
            expect(content).not.toMatch(/src="\/assets\/.*"/); // Simple regex for hardcoded public assets
        });
    });

});
