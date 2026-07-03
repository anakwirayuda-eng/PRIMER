import { describe, expect, it } from 'vitest';
import { localizeClinicalText } from '../utils/clinicalContentLocalization.js';

describe('clinical content localization normalizer', () => {
    it('keeps Indonesian labels unchanged for the default locale', () => {
        expect(localizeClinicalText('Diet Rendah Garam (< 1 sdt/hari)', 'id')).toBe('Diet Rendah Garam (< 1 sdt/hari)');
        expect(localizeClinicalText('Rawat Luka (GV)', 'id')).toBe('Rawat Luka (GV)');
    });

    it('normalizes high-visibility legacy clinical labels for English UI', () => {
        expect(localizeClinicalText('Diet Rendah Garam (< 1 sdt/hari)', 'en')).toBe('Low-salt diet (< 1 tsp/day)');
        expect(localizeClinicalText('Rawat Luka (GV)', 'en')).toBe('Wound Care (Dressing)');
        expect(localizeClinicalText('Katalog Obat', 'en')).toBe('Medicine Catalog');
        expect(localizeClinicalText('Tanda Vital (TD, Nadi, Suhu, RR)', 'en')).toBe('Vital Signs (BP, Pulse, Temp, RR)');
    });

    it('normalizes legacy lab result snippets without partial medical-word replacements', () => {
        expect(localizeClinicalText('Darah Lengkap', 'en')).toBe('Complete Blood Count');
        expect(localizeClinicalText('Hb 14, Leuko 3.500 (Leukopenia), Trombo 98.000 (Trombositopenia)', 'en'))
            .toBe('Hb 14, Leukocytes 3.500 (Leukopenia), Platelets 98.000 (Thrombocytopenia)');
    });

    it('normalizes legacy physical exam findings and vital sign abbreviations for English UI', () => {
        expect(localizeClinicalText('Tampak sakit sedang, wajah kemerahan (facial flushing).', 'en'))
            .toBe('Moderately ill appearing, facial flushing.');
        expect(localizeClinicalText('TD 110/70, N 98x, RR 20x, S 39.5\u00b0C', 'en'))
            .toBe('BP 110/70, Pulse 98/min, RR 20/min, Temp 39.5\u00b0C');
        expect(localizeClinicalText('Dalam batas normal / Tidak ada kelainan.', 'en'))
            .toBe('Within normal limits / No abnormal findings.');
    });

    it('does not replace short Indonesian tokens inside unrelated words', () => {
        expect(localizeClinicalText('Lesi tersebar di badan dan wajah.', 'en'))
            .toBe('Lesions scattered in trunk and face.');
        expect(localizeClinicalText('Angular cheilitis, dorsalis pedis normal.', 'en'))
            .toBe('Angular cheilitis, dorsalis pedis normal.');
    });
});
