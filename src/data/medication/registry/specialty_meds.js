/**
 * @reflection
 * [IDENTITY]: specialty_meds.js
 * [PURPOSE]: Registry for specialty medications needed by DispensingEngine interaction checks.
 *            Warfarin, Kalium, Antasida, Methotrexate — drugs that were referenced in
 *            INTERACTION_PAIRS but missing from formularium.
 * [STATE]: Stable
 * [ANCHOR]: SPECIALTY_MEDS
 * [DEPENDS_ON]: utils.js
 */

import { MEDICATION_CATEGORIES } from '../utils.js';

export const SPECIALTY_MEDS = [
    {
        id: 'warfarin_tab',
        name: 'Warfarin 2mg',
        category: MEDICATION_CATEGORIES.ANTIHYPERTENSIVE,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 1500,
        buyPrice: 975,
        sellPrice: 2300,
        igdPrice: null,
        minStock: 30,
        maxStock: 300,
        supplier: 'dinkes',
        leadTime: 7,
        indication: ['antikoagulan', 'dvt', 'fibrilasi_atrial', 'emboli_paru'],
        description: 'Antikoagulan oral — perlu monitoring INR berkala'
    },
    {
        id: 'kalium_tab',
        name: 'KSR (Kalium Klorida) 600mg',
        category: MEDICATION_CATEGORIES.SUPPLEMENT,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 650,
        buyPrice: 425,
        sellPrice: 1000,
        igdPrice: null,
        minStock: 50,
        maxStock: 500,
        supplier: 'dinkes',
        leadTime: 5,
        indication: ['hipokalemia', 'suplemen_kalium'],
        description: 'Suplemen kalium — INTERAKSI dengan ACE-inhibitor (risiko hiperkalemia)'
    },
    {
        id: 'antasida_tab',
        name: 'Antasida DOEN (Al(OH)3 + Mg(OH)2)',
        category: MEDICATION_CATEGORIES.GASTROINTESTINAL,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 195,
        buyPrice: 130,
        sellPrice: 300,
        igdPrice: null,
        minStock: 200,
        maxStock: 2000,
        supplier: 'dinkes',
        leadTime: 3,
        indication: ['dispepsia', 'gerd', 'maag'],
        description: 'Antasida — INTERAKSI: menurunkan absorpsi Ciprofloxacin jika diminum bersamaan'
    },
    {
        id: 'methotrexate_tab',
        name: 'Methotrexate 2.5mg',
        category: MEDICATION_CATEGORIES.ANALGESIC,
        type: 'tablet',
        form: 'tablet',
        fornas: true,
        unitPrice: 3250,
        buyPrice: 2100,
        sellPrice: 5000,
        igdPrice: null,
        minStock: 10,
        maxStock: 100,
        supplier: 'dinkes',
        leadTime: 14,
        indication: ['rheumatoid_arthritis', 'psoriasis', 'imunosupresan'],
        description: 'Imunosupresan/DMARD — INTERAKSI: Amoxicillin meningkatkan toksisitas'
    }
];
