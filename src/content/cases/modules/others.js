/**
 * @reflection
 * [IDENTITY]: others
 * [PURPOSE]: Game engine registry aggregating all other specialized cases.
 * [STATE]: Stable (Registry Pattern)
 * [ANCHOR]: OTHER_CASES
 * [DEPENDS_ON]: modules/*
 * [LAST_UPDATE]: 2026-02-12
 */

import { DIGESTIVE_CASES } from './modules/digestive.js';
import { MUSCULOSKELETAL_CASES } from './modules/musculoskeletal.js';
import { DERMATOLOGY_CASES } from './modules/dermatology.js';
import { NEUROLOGY_CASES } from './modules/neurology.js';
import { RESPIRATORY_CASES } from './modules/respiratory.js';
import { HEMATOLOGY_CASES } from './modules/hematology.js';
import { OPHTHALMOLOGY_CASES } from './modules/ophthalmology.js';
import { ENT_CASES } from './modules/ent.js';
import { PSYCHIATRY_CASES } from './modules/psychiatry.js';
import { CARDIOVASCULAR_CASES } from './modules/cardiovascular.js';
import { URINARY_CASES } from './modules/urinary.js';
import { TRAUMA_CASES } from './modules/trauma.js';
import { REPRODUCTIVE_CASES } from './modules/reproductive.js';
import { PEDIATRIC_CASES } from './modules/pediatric.js';
import { ORAL_CASES } from './modules/oral.js';
import { GENERAL_CASES } from './modules/general.js';
import { FORENSIK_CASES } from './modules/forensik.js';

export const OTHER_CASES = [
    ...DIGESTIVE_CASES,
    ...MUSCULOSKELETAL_CASES,
    ...DERMATOLOGY_CASES,
    ...NEUROLOGY_CASES,
    ...RESPIRATORY_CASES,
    ...HEMATOLOGY_CASES,
    ...OPHTHALMOLOGY_CASES,
    ...ENT_CASES,
    ...PSYCHIATRY_CASES,
    ...CARDIOVASCULAR_CASES,
    ...URINARY_CASES,
    ...TRAUMA_CASES,
    ...REPRODUCTIVE_CASES,
    ...PEDIATRIC_CASES,
    ...ORAL_CASES,
    ...GENERAL_CASES,
    ...FORENSIK_CASES
];
