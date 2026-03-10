/**
 * @reflection
 * [IDENTITY]: MedicationDatabase.js
 * [PURPOSE]: Aggregated registry for all medications in PRIMER. Single Source of Truth for clinical, inventory, and billing data.
 * [STATE]: Stable
 * [ANCHOR]: MEDICATION_DATABASE
 * [DEPENDS_ON]: medication/registry/*, medication/utils.js
 */

import { ANALGESIC_MEDS } from './medication/registry/analgesics.js';
import { ANTIBIOTIC_MEDS } from './medication/registry/antibiotics.js';
import { CARDIOVASCULAR_MEDS } from './medication/registry/cardiovascular.js';
import { DIABETIC_MEDS } from './medication/registry/diabetic.js';
import { RESPIRATORY_MEDS } from './medication/registry/respiratory.js';
import { GASTROINTESTINAL_MEDS } from './medication/registry/gastrointestinal.js';
import { DERMATOLOGY_MEDS } from './medication/registry/dermatology.js';
import { SUPPLEMENT_MEDS } from './medication/registry/supplements.js';
import { PSYCHIATRY_NEURO_MEDS } from './medication/registry/psychiatry_neuro.js';
import { ENT_EYE_MEDS } from './medication/registry/ent_eye.js';
import { EQUIPMENT_MEDS } from './medication/registry/equipment.js';
import { LAB_REAGENT_MEDS } from './medication/registry/lab_reagents.js';
import { EMERGENCY_MEDS } from './medication/registry/emergency.js';
import { METABOLIC_MEDS } from './medication/registry/metabolic.js';
import { MISSING_CASE_MEDS } from './medication/registry/missing_case_meds.js';

import * as MedUtils from './medication/utils.js';

// Re-export constants for easy access
export const MEDICATION_CATEGORIES = MedUtils.MEDICATION_CATEGORIES;

/**
 * CONSOLIDATED MEDICATION DATABASE
 * Single Source of Truth for Clinical, Inventory, and Billing
 */
export const MEDICATION_DATABASE = [
    ...ANALGESIC_MEDS,
    ...ANTIBIOTIC_MEDS,
    ...CARDIOVASCULAR_MEDS,
    ...DIABETIC_MEDS,
    ...RESPIRATORY_MEDS,
    ...GASTROINTESTINAL_MEDS,
    ...DERMATOLOGY_MEDS,
    ...SUPPLEMENT_MEDS,
    ...PSYCHIATRY_NEURO_MEDS,
    ...ENT_EYE_MEDS,
    ...EQUIPMENT_MEDS,
    ...LAB_REAGENT_MEDS,
    ...EMERGENCY_MEDS,
    ...METABOLIC_MEDS,
    ...MISSING_CASE_MEDS
];

// Utility wrappers for backward compatibility with existing components
export const searchMedications = (query, limit = 10) =>
    MedUtils.searchMedications(MEDICATION_DATABASE, query, limit);

export const getMedicationCategories = () =>
    MedUtils.getMedicationCategories();

export function getMedicationById(id) {
    return MedUtils.getMedicationById(MEDICATION_DATABASE, id);
}

export function getMedicationsByCategory(category) {
    return MedUtils.getMedicationsByCategory(MEDICATION_DATABASE, category);
}

export function getFornasMedications() {
    return MedUtils.getFornasMedications(MEDICATION_DATABASE);
}

export function calculateTotalInventoryValue(inventory) {
    return MedUtils.calculateTotalInventoryValue(MEDICATION_DATABASE, inventory);
}
