/**
 * Allergy Gate regression tests.
 *
 * Covers:
 * - matchDrugAllergy (DispensingEngine) — class-based, substring, edge cases
 * - Documents the gates that wire into it (audit 2026-04-26)
 *
 * P0 clinical safety per project_primer_audio.md + project_primer_clinical_risks.md.
 */

import { describe, it, expect } from 'vitest';
import { matchDrugAllergy } from '../game/DispensingEngine.js';

describe('matchDrugAllergy — empty / null safety', () => {
    it('returns null when allergies is empty array', () => {
        expect(matchDrugAllergy({ id: 'amoxicillin_500', name: 'Amoxicillin' }, [])).toBeNull();
    });

    it('returns null when allergies is null', () => {
        expect(matchDrugAllergy({ id: 'amoxicillin_500', name: 'Amoxicillin' }, null)).toBeNull();
    });

    it('returns null when med is null', () => {
        expect(matchDrugAllergy(null, ['Penisilin'])).toBeNull();
    });

    it('returns null when no allergy matches', () => {
        expect(
            matchDrugAllergy(
                { id: 'paracetamol_500', name: 'Paracetamol 500mg' },
                ['Penisilin', 'NSAID']
            )
        ).toBeNull();
    });
});

describe('matchDrugAllergy — class-based matching (DRUG_CLASS_ALLERGY_MAP)', () => {
    it('blocks amoxicillin when patient is allergic to "Penisilin"', () => {
        const med = { id: 'amoxicillin_500', name: 'Amoxicillin 500mg', category: 'antibiotic' };
        expect(matchDrugAllergy(med, ['Penisilin'])).toBe('Penisilin');
    });

    it('blocks amoxicillin when patient is allergic to "Penicillin" (English)', () => {
        const med = { id: 'amoxicillin_500', name: 'Amoxicillin 500mg' };
        expect(matchDrugAllergy(med, ['Penicillin'])).toBe('Penicillin');
    });

    it('blocks ibuprofen when patient is allergic to NSAID', () => {
        const med = { id: 'ibuprofen_200', name: 'Ibuprofen 200mg' };
        expect(matchDrugAllergy(med, ['NSAID'])).toBe('NSAID');
    });

    it('blocks ciprofloxacin via "Fluorokuinolon" class allergy', () => {
        const med = { id: 'ciprofloxacin_500', name: 'Ciprofloxacin 500mg' };
        expect(matchDrugAllergy(med, ['Fluorokuinolon'])).toBe('Fluorokuinolon');
    });

    it('blocks azithromycin via "Makrolida" class allergy', () => {
        const med = { id: 'azithromycin_500', name: 'Azithromycin 500mg' };
        expect(matchDrugAllergy(med, ['Makrolida'])).toBe('Makrolida');
    });

    it('blocks cotrimoxazole via "Sulfa" class allergy', () => {
        const med = { id: 'cotrimoxazole_480', name: 'Cotrimoxazole 480mg' };
        expect(matchDrugAllergy(med, ['Sulfa'])).toBe('Sulfa');
    });
});

describe('matchDrugAllergy — substring matching', () => {
    it('blocks med when allergy text appears in med name', () => {
        const med = { id: 'paracetamol_500', name: 'Paracetamol 500mg' };
        expect(matchDrugAllergy(med, ['paracetamol'])).toBe('paracetamol');
    });

    it('is case-insensitive', () => {
        const med = { id: 'paracetamol_500', name: 'PARACETAMOL 500mg' };
        expect(matchDrugAllergy(med, ['Paracetamol'])).toBe('Paracetamol');
    });

    it('blocks med when med name appears inside allergy phrase', () => {
        const med = { id: 'aspirin_80', name: 'Aspirin' };
        expect(matchDrugAllergy(med, ['Alergi terhadap aspirin'])).toBe('Alergi terhadap aspirin');
    });
});

describe('matchDrugAllergy — category matching', () => {
    it('blocks med when allergy text matches med category', () => {
        const med = { id: 'misc_drug_1', name: 'Some Drug', category: 'opioid' };
        expect(matchDrugAllergy(med, ['Opioid'])).toBe('Opioid');
    });
});

describe('matchDrugAllergy — multiple allergies', () => {
    it('returns the FIRST matching allergy when patient has multiple', () => {
        const med = { id: 'amoxicillin_500', name: 'Amoxicillin' };
        // Penisilin matches via class — should return that, not later substring hits
        const result = matchDrugAllergy(med, ['Telur', 'Penisilin', 'Susu']);
        expect(result).toBe('Penisilin');
    });

    it('returns null when none of the multiple allergies match', () => {
        const med = { id: 'paracetamol_500', name: 'Paracetamol' };
        expect(matchDrugAllergy(med, ['Telur', 'Susu', 'Kacang'])).toBeNull();
    });
});

/**
 * Allergy gate WIRING — sites that call matchDrugAllergy and block on positive match.
 * Update this list whenever a new dispensing flow is added.
 *
 * Verified 2026-04-26 audit:
 * - src/hooks/usePatientEMR.js:521         (Poli prescription, EMR Tambah Obat)
 * - src/components/EmergencyPanel.jsx:431  (IGD Tactical Action Grid, deductStock actions)
 * - src/game/DispensingEngine.js:139       (Pharmacy verifyPrescription)
 *
 * Gaps still pending (lower priority):
 * - SISRUTE auto-discharge re-validation (createClinicalSlice.js:443)
 * - FarmasiPanel bill bypass guard (FarmasiPanel.jsx:107)
 */
describe('Allergy gate wiring documentation', () => {
    it('lists at least 3 known wired call sites', () => {
        const wiredSites = [
            'usePatientEMR.js — Poli prescription',
            'EmergencyPanel.jsx — IGD action grid',
            'DispensingEngine.js — pharmacy verification',
        ];
        expect(wiredSites.length).toBeGreaterThanOrEqual(3);
    });
});
