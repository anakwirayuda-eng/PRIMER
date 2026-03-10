 
/**
 * @reflection
 * [IDENTITY]: Infectious Cases Aggregator
 * [PURPOSE]: Consolidates respiratory, digestive, and other infectious case modules.
 * [STATE]: Stable
 */
/**
 * Infectious Diseases Module Aggregator
 *
 * This file aggregates smaller, category-specific modules to improve maintainability and load times.
 * Each module contains a subset of cases (Respiratory, Digestive, Dermatology, etc.).
 */

import { respiratory_infectious } from './infectious/respiratory.js';
import { digestive_infectious } from './infectious/digestive.js';
import { dermatology_infectious } from './infectious/dermatology.js';
import { general_infectious } from './infectious/general.js';
import { sti_urinary_infectious } from './infectious/sti_urinary.js';
import { head_neck_infectious } from './infectious/head_neck.js';

export const INFECTIOUS_CASES = [
    ...respiratory_infectious,
    ...digestive_infectious,
    ...dermatology_infectious,
    ...general_infectious,
    ...sti_urinary_infectious,
    ...head_neck_infectious
];
