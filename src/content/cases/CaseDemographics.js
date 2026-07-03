/**
 * Authored demographic profiles for every clinical/emergency case id.
 * This file is the single source of truth for age/gender/informant constraints.
 */

function cloneProfile(profile) {
    if (!profile) return null;
    return {
        ...profile,
        genders: Array.isArray(profile.genders) ? [...profile.genders] : ['L', 'P'],
        informant: profile.informant ? { ...profile.informant } : undefined,
    };
}

const GENERAL = Object.freeze({ kind: 'general', minAge: 15, maxAge: 89, genders: ['L', 'P'] });
const GENERAL_FEMALE = Object.freeze({ kind: 'general', minAge: 15, maxAge: 89, genders: ['P'] });
const GENERAL_MALE = Object.freeze({ kind: 'general', minAge: 15, maxAge: 89, genders: ['L'] });
const GENERAL_CAREGIVER_YOUNG_ADULT = Object.freeze({ kind: 'general', minAge: 16, maxAge: 35, genders: ['L', 'P'], informant: { required: true, reason: 'caregiver', relation: 'Orang Tua' } });
const MATERNAL = Object.freeze({ kind: 'maternal', minAge: 12, maxAge: 55, genders: ['P'] });
const NEONATE = Object.freeze({ kind: 'neonate', minAge: 0, maxAge: 0, genders: ['L', 'P'] });
const INFANT = Object.freeze({ kind: 'infant', minAge: 0, maxAge: 1, genders: ['L', 'P'] });
const PEDIATRIC_UNDER5 = Object.freeze({ kind: 'pediatric', minAge: 0, maxAge: 5, genders: ['L', 'P'] });
const PEDIATRIC_0_12 = Object.freeze({ kind: 'pediatric', minAge: 0, maxAge: 12, genders: ['L', 'P'] });
const PEDIATRIC_5_17 = Object.freeze({ kind: 'pediatric', minAge: 5, maxAge: 17, genders: ['L', 'P'] });
const PEDIATRIC_CAREGIVER_UNDER5 = Object.freeze({ kind: 'pediatric', minAge: 0, maxAge: 5, genders: ['L', 'P'], informant: { required: true, reason: 'pediatric', relation: 'Orang Tua' } });
const PEDIATRIC_CAREGIVER_0_12 = Object.freeze({ kind: 'pediatric', minAge: 0, maxAge: 12, genders: ['L', 'P'], informant: { required: true, reason: 'pediatric', relation: 'Orang Tua' } });
const PEDIATRIC_CAREGIVER_5_17 = Object.freeze({ kind: 'pediatric', minAge: 5, maxAge: 17, genders: ['L', 'P'], informant: { required: true, reason: 'pediatric', relation: 'Orang Tua' } });
const PEDIATRIC_MALE_CAREGIVER_0_12 = Object.freeze({ kind: 'pediatric', minAge: 0, maxAge: 12, genders: ['L'], informant: { required: true, reason: 'pediatric', relation: 'Orang Tua' } });

function mapIds(ids, profile) {
    return Object.fromEntries(ids.map((id) => [id, profile]));
}

const GENERAL_IDS = [
    'abses_kelenjar_sebasea',
    'abses_peritonsil',
    'acute_gastroenteritis',
    'acute_mi_stemi',
    'acute_pharyngitis',
    'akne_vulgaris',
    'alzheimers_early',
    'ami_stemi',
    'anaphylaxis',
    'anemia_deficiency',
    'anemia_defisiensi_besi_simptomatik',
    'anemia_hemolitik',
    'angina_pektoris',
    'angioedema_severe',
    'anthrax',
    'apendisitis_akut',
    'artritis_reumatoid',
    'asma_bronkiale_akut',
    'asthma_acute_severe',
    'asthma_bronchiale',
    'batu_saluran_kemih',
    'bells_palsy',
    'benda_asing_konjungtiva',
    'bipolar_manik',
    'blefaritis',
    'bone_fracture_simple',
    'bronchitis_acute',
    'bronkhitis_akut',
    'burn_second_degree',
    'ca_nasofaring',
    'cacing_tambang',
    'candidiasis_mucocutan',
    'carpal_tunnel',
    'chest_pain_acs',
    'chf_acute_pulmonary_edema',
    'contact_dermatitis',
    'copd_exacerbation',
    'cutaneous_larva_migrans',
    'cva_stroke',
    'dbd_grade_1',
    'demam_dengue',
    'demam_tifoid',
    'dengue_df',
    'dengue_warning_signs',
    'depresi_berat',
    'dermatitis_kontak',
    'dermatitis_kontak_iritan',
    'dermatitis_numularis',
    'dermatitis_seboroik',
    'diabetes_melitus_tipe_2',
    'diare_akut_non_spesifik',
    'dka_adult',
    'dm_complicated',
    'dm_type2',
    'drug_eruption',
    'dvt',
    'dysentery',
    'dyslipidemia',
    'edema_paru_akut',
    'efusi_pleura',
    'episkleritis',
    'epistaksis',
    'eritema_nodosum',
    'erysipelas',
    'erythrasma',
    'faringitis_akut',
    'faringitis_streptokokus',
    'fibrilasi_atrial',
    'filariasis',
    'folikulitis_superfisialis',
    'food_poisoning',
    'food_poisoning_acute',
    'fraktur_terbuka',
    'furunkel_hidung',
    'furunkel_karbunkel',
    'gagal_jantung_kronik',
    'gangguan_cemas',
    'gangguan_somatoform',
    'gastritis_acute',
    'gastritis_erosive',
    'gbs',
    'general_checkup',
    'gerd',
    'gerd_erosive',
    'gigitan_serangga',
    'glaukoma_akut',
    'gonore_uncomplicated',
    'gout_akut',
    'gout_arthritis',
    'head_injury_mild',
    'head_injury_moderate',
    'heart_failure_congestive',
    'hematemesis_melena',
    'hemoroid_grade12',
    'hepatitis_a',
    'hepatitis_b',
    'herpes_simplex',
    'herpes_zoster',
    'hhs_hyperosmolar',
    'hidradenitis_supurativa',
    'hipertiroid_graves',
    'hipoglikemia_berat',
    'hiv_uncomplicated',
    'hnp_lumbal',
    'hordeolum',
    'hordeolum_eksternum',
    'hypertension_primary',
    'hypertensive_crisis',
    'hyperuricemia',
    'hypoglycemia_mild',
    'hypoglycemia_severe',
    'ileus_obstruktif',
    'influenza',
    'insomnia',
    'intoksikasi_zat_psikoaktif',
    'intoleransi_makanan',
    'intussusception',
    'ispa_common',
    'katarak',
    'kekerasan_tajam',
    'kekerasan_tumpul',
    'keracunan_makanan',
    'keratitis',
    'kolesistitis_akut',
    'kornu_kutaneum',
    'laceration_minor',
    'laryngitis_acute',
    'lbp_mechanical',
    'leprosy',
    'leptospirosis',
    'leptospirosis_ringan',
    'limfadenitis',
    'lipoma',
    'luka_bakar_derajat_3',
    'mabuk_perjalanan',
    'malaria_vivax',
    'mata_kering',
    'meningitis_bakterial',
    'migrain',
    'migraine',
    'mineral_deficiency',
    'myalgia',
    'near_drowning',
    'neuropati_dm',
    'obesity',
    'omsk',
    'open_fracture',
    'organophosphate_poisoning',
    'osteoarthritis',
    'otitis_eksterna',
    'otitis_media_acute',
    'paronychia_acute',
    'parotitis_mumps',
    'pediculosis_pubis',
    'pemfigus_vulgaris',
    'perdarahan_gi_atas',
    'perdarahan_subkonjungtiva',
    'pitiriasis_rosea',
    'pityriasis_versicolor',
    'pneumonia_bacterial',
    'pneumonia_bakterial',
    'pneumothorax',
    'ppok_exacerbation',
    'presbyopia',
    'psoriasis_vulgaris',
    'pterigium',
    'pyelonephritis',
    'rabies',
    'reaksi_anafilaktik',
    'rhinitis_akut',
    'rhinitis_allergic',
    'rhinitis_vasomotor',
    'scabies',
    'scabies_infeksi',
    'scrofuloderma',
    'seizure_ongoing',
    'sepsis',
    'serumen_prop',
    'severe_dehydration_shock',
    'severe_malaria',
    'sifilis_stadium_1',
    'sindrom_metabolik',
    'sinusitis_acute',
    'sinusitis_akut',
    'sjs',
    'skistosomiasis',
    'snake_bite',
    'status_asmatikus',
    'status_epileptikus',
    'stomatitis_aftosa',
    'stroke_infark',
    'strongiloidiasis',
    'suicide_attempt',
    'syok_hipovolemik',
    'taeniasis',
    'tb_pulmonary',
    'tension_headache',
    'tension_headache_chronic',
    'tension_pneumothorax',
    'tetanus',
    'tinea_barbae',
    'tinea_corporis',
    'tinea_corporis_extensive',
    'tinea_cruris',
    'tinea_facialis',
    'tinea_manus',
    'tinea_pedis',
    'tinea_unguium',
    'tonsilitis_akut',
    'tonsillitis_acute',
    'trikiasis',
    'typhoid_fever',
    'ulkus_mulut',
    'ulkus_tungkai',
    'urtikaria_akut',
    'varicella',
    'verruca_vulgaris',
    'vertigo_bppv',
    'visum_et_repertum_hidup',
    'vitamin_deficiency',
    'vulnus_laceratum',
];

const GENERAL_FEMALE_IDS = [
    'isk_uncomplicated',
    'salpingitis',
    'uti_uncomplicated',
    'vaginitis',
    'vaginosis_bakterialis',
    'vulvitis',
];

const GENERAL_MALE_IDS = [
    'gonorrhea',
    'syphilis_12',
    'torsio_testis',
];

const GENERAL_CAREGIVER_YOUNG_ADULT_IDS = [
    'skizofrenia',
];

const MATERNAL_IDS = [
    'aborsi_komplit',
    'abortus_inkomplit',
    'anemia_kehamilan',
    'cracked_nipple',
    'eclampsia',
    'eklampsia',
    'hiperemesis_gravidarum',
    'inverted_nipple',
    'kehamilan_normal_anc',
    'kpd',
    'mastitis',
    'normal_pregnancy',
    'pph',
    'preeklampsia_berat',
    'ruptur_perineum_12',
];

const NEONATE_IDS = [
    'asphyxia_neonatorum',
    'infeksi_umbilikus',
    'neonatal_asphyxia',
];

const INFANT_IDS = [
    'bronchiolitis_severe',
    'bronkiolitis_akut',
];

const PEDIATRIC_UNDER5_IDS = [
    'benda_asing_hidung',
    'exanthem_subitum',
    'kejang_demam',
    'napkin_eczema',
];

const PEDIATRIC_0_12_IDS = [
    'conjunctivitis_bacterial',
    'febrile_convulsion',
    'foreign_body_aspiration',
    'hipermetropia_ringan',
    'luka_bakar_minor',
    'oral_candidiasis',
    'konjungtivitas_bakterial',
];

const PEDIATRIC_5_17_IDS = [
    'dka_pediatric',
];

const PEDIATRIC_CAREGIVER_0_12_IDS = [
    'ascariasis',
    'alergi_makanan',
    'buta_senja',
    'dermatitis_atopik',
    'diphtheria',
    'impetigo',
    'miliaria',
    'miopia_ringan',
    'molluscum',
    'morbilli',
    'otitis_media_akut',
    'pediculosis_capitis',
    'pertussis',
    'tinea_capitis',
];

const PEDIATRIC_CAREGIVER_UNDER5_IDS = [
    'pem',
];

const PEDIATRIC_CAREGIVER_5_17_IDS = [
    'dm_type1',
    'dss',
    'epilepsi',
    'gna',
    'kad',
    'leukemia_suspicion',
    'osteomielitis',
    'tenggelam',
];

const PEDIATRIC_MALE_CAREGIVER_0_12_IDS = [
    'fimosis',
    'parafimosis',
];

export const CASE_DEMOGRAPHIC_PROFILES = {
    ...mapIds(GENERAL_IDS, GENERAL),
    ...mapIds(GENERAL_FEMALE_IDS, GENERAL_FEMALE),
    ...mapIds(GENERAL_MALE_IDS, GENERAL_MALE),
    ...mapIds(GENERAL_CAREGIVER_YOUNG_ADULT_IDS, GENERAL_CAREGIVER_YOUNG_ADULT),
    ...mapIds(MATERNAL_IDS, MATERNAL),
    ...mapIds(NEONATE_IDS, NEONATE),
    ...mapIds(INFANT_IDS, INFANT),
    ...mapIds(PEDIATRIC_UNDER5_IDS, PEDIATRIC_UNDER5),
    ...mapIds(PEDIATRIC_0_12_IDS, PEDIATRIC_0_12),
    ...mapIds(PEDIATRIC_5_17_IDS, PEDIATRIC_5_17),
    ...mapIds(PEDIATRIC_CAREGIVER_UNDER5_IDS, PEDIATRIC_CAREGIVER_UNDER5),
    ...mapIds(PEDIATRIC_CAREGIVER_0_12_IDS, PEDIATRIC_CAREGIVER_0_12),
    ...mapIds(PEDIATRIC_CAREGIVER_5_17_IDS, PEDIATRIC_CAREGIVER_5_17),
    ...mapIds(PEDIATRIC_MALE_CAREGIVER_0_12_IDS, PEDIATRIC_MALE_CAREGIVER_0_12),
};

export function getAuthoredDemographicProfile(caseId = "") {
    return cloneProfile(CASE_DEMOGRAPHIC_PROFILES[caseId] || null);
}

export function attachAuthoredDemographicProfile(caseData = {}) {
    if (!caseData || typeof caseData !== "object") return caseData;
    const authoredProfile = caseData.demographicProfile || getAuthoredDemographicProfile(caseData.id);
    if (!authoredProfile) return caseData;
    return { ...caseData, demographicProfile: authoredProfile };
}

export function listMissingAuthoredDemographics(caseList = []) {
    return (Array.isArray(caseList) ? caseList : [])
        .map((entry) => entry?.id)
        .filter((id) => id && !CASE_DEMOGRAPHIC_PROFILES[id]);
}
