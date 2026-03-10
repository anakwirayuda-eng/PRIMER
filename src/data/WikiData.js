/**
 * @reflection
 * [IDENTITY]: WikiData
 * [PURPOSE]: Static data module exporting: WIKI_DATA, findWikiKey.
 * [STATE]: Experimental
 * [ANCHOR]: WIKI_DATA
 * [DEPENDS_ON]: manajemen, wilayah, klinis, penyakit, kulit, obat, lab_prosedur, igd
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-18
 */

/**
 * Registry of wiki keys by category for discovery.
 */
export const WIKI_REGISTRY = {
    manajemen: ['liquidity', 'staff_readiness', 'quality_score', 'pusk_accreditation', 'blud_status'],
    klinis: ['cppt'],
    wilayah: [
        'village_id', 'pispk_index', 'outbreak_risk',
        'building_emergency', 'building_outpatient', 'building_lab', 'building_pharmacy',
        'staff_physician', 'staff_nurse', 'staff_midwife', 'staff_sanitarian',
        'poli_standard', 'poli_umum_wiki', 'poli_kia_kb_wiki', 'poli_gigi_wiki', 'farmasi_lab_wiki'
    ],
    penyakit: [
        'urti_uncomplicated', 'pneumonia_child', 'tuberculosis_lung', 'asthma_attack', 'pharyngitis_acute',
        'hypertension', 'diabetes_type2', 'heart_failure_acute', 'dyslipidemia', 'hyperuricemia', 'obesity',
        'gerd_gastritis', 'diarrhea_acute', 'typhoid_fever',
        'otitis_media', 'conjunctivitis_acute',
        'lower_uti', 'gonorrhea',
        'malnutrition_energy_protein', 'vitamin_deficiency', 'mineral_deficiency',
        'hiv_uncomplicated', 'anemia_deficiency', 'lymphadenitis', 'dengue_df', 'malaria_vivax',
        'leptospirosis', 'anaphylaxis',
        'leg_ulcer', 'lipoma', 'sharp_trauma', 'blunt_trauma', 'burn_grade12'
    ],
    kulit: [
        'verruca_vulgaris', 'molluscum', 'herpes_zoster', 'varicella', 'herpes_simplex',
        'impetigo', 'folliculitis', 'furuncle', 'erythrasma', 'erysipelas',
        'scrofuloderma', 'leprosy', 'syphilis_12',
        'tinea_corporis', 'tinea_cruris', 'tinea_pedis', 'pityriasis_versicolor', 'scabies',
        'dermatitis_kontak', 'atopic_dermatitis', 'seborrheic_dermatitis', 'acne_vulgaris',
        'miliaria', 'urticaria_acute'
    ],
    obat: [
        'med_paracetamol', 'med_asam_mefenamat', 'med_ibuprofen',
        'med_amoxicillin', 'med_cefixime', 'med_cotrimoxazole', 'med_metronidazole', 'med_acyclovir',
        'med_oat_tb', 'med_antimalaria', 'med_antelmintik', 'med_antifungi',
        'med_amlodipine', 'med_bisoprolol', 'med_diuretik', 'med_statin', 'med_captopril', 'med_antiplatelet',
        'med_metformin', 'med_sulfonilurea', 'med_insulin', 'med_antidiabetik_lain',
        'med_omeprazole', 'med_salbutamol', 'med_antasida',
        'med_kortikosteroid', 'med_antihistamin', 'med_oralit_zinc',
        'med_vitamin_suplemen', 'med_obat_luar', 'med_emergency_inj', 'med_alkes_habis_pakai', 'med_psikiatri_neuro'
    ],
    lab_prosedur: [
        'proc_iv_line', 'proc_oxygen', 'proc_nebulizer', 'proc_cpr', 'proc_hecting', 'proc_kateter',
        'lab_dl', 'lab_gds', 'lab_widal', 'lab_urin'
    ],
    igd: [
        'igd_copd_exacerbation', 'igd_foreign_body_aspiration',
        'igd_hypertensive_crisis', 'igd_chf_acute',
        'igd_dka', 'igd_hhs',
        'igd_angioedema',
        'igd_cva_stroke', 'igd_head_injury_moderate',
        'igd_severe_malaria', 'igd_sepsis',
        'igd_open_fracture', 'igd_organophosphate_poisoning',
        'igd_hematemesis',
        'igd_eclampsia', 'igd_suicide_attempt',
        'igd_bronchiolitis', 'igd_intussusception', 'igd_dka_child', 'igd_neonatal_asphyxia'
    ],
    dashboard: [
        'energy', 'reputation', 'accuracy', 'treatment', 'ukp_overview',
        'stress', 'inventory', 'kbk', 'angka_kontak',
        'patient_safety', 'skdi_coverage', 'rrns',
        'iks', 'prolanis_compliance', 'prb',
        'accreditation_chapters', 'dana_bok'
    ],
    emergency_triage: [
        'esi_overview', 'esi_1', 'esi_2', 'esi_3', 'esi_4', 'esi_5',
        'triage_red', 'triage_yellow', 'triage_green', 'triage_black'
    ]
};

/**
 * getWikiEntry
 * Async loader for wiki content.
 * @param {string} key 
 * @returns {Promise<Object|null>}
 */
export const getWikiEntry = async (key) => {
    try {
        let module;
        if (WIKI_REGISTRY.manajemen.includes(key)) module = await import('./wiki/manajemen');
        else if (WIKI_REGISTRY.klinis.includes(key)) module = await import('./wiki/klinis');
        else if (WIKI_REGISTRY.wilayah.includes(key)) module = await import('./wiki/wilayah');
        else if (WIKI_REGISTRY.penyakit.includes(key)) module = await import('./wiki/penyakit');
        else if (WIKI_REGISTRY.kulit.includes(key)) module = await import('./wiki/kulit');
        else if (WIKI_REGISTRY.obat.includes(key)) module = await import('./wiki/obat');
        else if (WIKI_REGISTRY.lab_prosedur.includes(key)) module = await import('./wiki/lab_prosedur');
        else if (WIKI_REGISTRY.igd.includes(key)) module = await import('./wiki/igd');
        else if (WIKI_REGISTRY.dashboard.includes(key)) module = await import('./wiki/dashboard_manajemen');
        else if (WIKI_REGISTRY.emergency_triage.includes(key)) module = await import('./wiki/emergency_wiki');
        else {
            // Fallback: check all for legacy/dynamic keys
            const modules = [
                import('./wiki/manajemen'), import('./wiki/klinis'), import('./wiki/wilayah'),
                import('./wiki/penyakit'), import('./wiki/kulit'), import('./wiki/obat'),
                import('./wiki/lab_prosedur'), import('./wiki/igd'),
                import('./wiki/dashboard_manajemen'), import('./wiki/emergency_wiki')
            ];
            const loaded = await Promise.all(modules);
            for (const m of loaded) {
                const data = m.manajemenData || m.klinisData || m.wilayahData || m.penyakitData || m.kulitData || m.obatData || m.labProsedurData || m.igdData || m.dashboardManajemenData || m.emergencyWikiData;
                if (data && data[key]) return data[key];
            }
            return null;
        }

        const data = module.manajemenData || module.klinisData || module.wilayahData || module.penyakitData || module.kulitData || module.obatData || module.labProsedurData || module.igdData || module.dashboardManajemenData || module.emergencyWikiData;
        return data ? data[key] : null;
    } catch (e) {
        console.error('Error loading wiki entry:', key, e);
        return null;
    }
};

/**
 * findWikiKey
 * Fuzzy matches a game ID (medication, procedure, lab) to a WikiData key.
 */
export const findWikiKey = (type, id) => {
    if (!id) return null;
    const searchId = id.toLowerCase().replace(/\s+/g, '_');

    // Mappings for common game things to Wiki keys
    const labMap = {
        'darah_lengkap': 'lab_dl',
        'gds': 'lab_gds',
        'gula_darah_sewaktu': 'lab_gds',
        'widal': 'lab_widal',
        'urinalisa': 'lab_urin',
        'urin_rutin': 'lab_urin',
        'hb': 'lab_hb'
    };

    const procMap = {
        '99.21': 'med_antibiotik',
        'iv_line': 'proc_iv_line',
        'infus': 'proc_iv_line',
        'oxygen': 'proc_oxygen',
        'oksigen': 'proc_oxygen',
        'nebulizer': 'proc_nebulizer',
        'uap': 'proc_nebulizer',
        'cpr': 'proc_cpr',
        'rjp': 'proc_cpr',
        'hecting': 'proc_hecting',
        'jahit': 'proc_hecting',
        'suturing': 'proc_hecting',
        'kateter': 'proc_kateter',
        'catheter': 'proc_kateter'
    };

    if (type === 'lab' && labMap[searchId]) return labMap[searchId];
    if (type === 'proc' && procMap[searchId]) return procMap[searchId];

    if (type === 'med') {
        const exactMatch = WIKI_REGISTRY.obat.find(wItem => wItem === `med_${searchId}`);
        if (exactMatch) return exactMatch;
        // Fallback for partial matches
        const partialMatch = WIKI_REGISTRY.obat.find(wItem => wItem.includes(searchId));
        if (partialMatch) return partialMatch;

        const baseMed = searchId.split('_')[0];
        return `med_${baseMed}`;
    }

    // Default: return as-is
    return id;
};

// Exporting an empty object or a warning proxy for legacy WIKI_DATA users if needed
export const WIKI_DATA = {};
export default WIKI_DATA;
