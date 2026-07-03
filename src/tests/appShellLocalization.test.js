import { describe, expect, it } from 'vitest';

import en from '../locales/en.json';
import id from '../locales/id.json';
import { APP_METADATA } from '../data/AppMetadata.js';

describe('app shell localization resources', () => {
    it('ships localized brand and legal copy used by global shell surfaces', () => {
        const requiredAppKeys = [
            'name',
            'full_name',
            'tagline',
            'organization',
            'department',
            'copyright',
            'version_label'
        ];

        for (const key of requiredAppKeys) {
            expect(en.app[key]).toBeTruthy();
            expect(id.app[key]).toBeTruthy();
        }

        expect(en.settings.footer_signature).toBeTruthy();
        expect(id.settings.footer_signature).toBeTruthy();
        expect(en.bankApp.doctor_prefix).toBeTruthy();
        expect(id.bankApp.doctor_prefix).toBeTruthy();
        expect(en.newsApp.ad.badge).toBeTruthy();
        expect(id.newsApp.ad.badge).toBeTruthy();

        for (const themeId of ['medika', 'emerald', 'midnight', 'military', 'premium']) {
            expect(en.settings.themes[themeId].name).toBeTruthy();
            expect(en.settings.themes[themeId].description).toBeTruthy();
            expect(id.settings.themes[themeId].name).toBeTruthy();
            expect(id.settings.themes[themeId].description).toBeTruthy();
        }
    });

    it('keeps metadata fallback strings free from mojibake artifacts', () => {
        expect(JSON.stringify(APP_METADATA)).not.toMatch(/[Ââ]/);
    });
});
