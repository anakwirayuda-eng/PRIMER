/**
 * Medication Category Audit Script
 * Identifies all misclassified medications and generates a fix plan
 */
import fs from 'fs';

const content = fs.readFileSync('src/data/MedicationDatabase.js', 'utf8');

// Extract all items
const re = /id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)',\s*\n\s*category:\s*MEDICATION_CATEGORIES\.([A-Z_]+),/g;
let m;
const items = [];
while (m = re.exec(content)) {
    items.push({ id: m[1], name: m[2], currentCat: m[3] });
}

console.log(`Total items: ${items.length}\n`);

// ============================================================
// PHARMACOLOGICAL CLASSIFICATION RULES
// Based on Indonesian Formularium Nasional (FORNAS) 
// ============================================================
const CORRECT_CATEGORIES = {
    // === ANALGESIC ===
    'asam_mefenamat': 'ANALGESIC',
    'ibuprofen_200': 'ANALGESIC',
    'ibuprofen_400': 'ANALGESIC',
    'ketorolac_iv': 'ANALGESIC',
    'meloxicam_15': 'ANALGESIC',
    'naproxen_500': 'ANALGESIC',
    'natrium_diklofenak': 'ANALGESIC',
    'paracetamol_500': 'ANALGESIC',
    'paracetamol_syr': 'ANALGESIC',
    'piroxicam_20': 'ANALGESIC',
    'tramadol_50': 'ANALGESIC',
    'morphine_iv': 'ANALGESIC', // Opioid analgesic (not really "emergency" — it's a pain med)

    // === ANTIBIOTIC / ANTI-INFEKSI ===
    'acyclovir_200': 'ANTIBIOTIC',
    'acyclovir_400': 'ANTIBIOTIC',
    'acyclovir_cream': 'ANTIBIOTIC',
    'amoxicillin_500': 'ANTIBIOTIC',
    'amoxiclav_625': 'ANTIBIOTIC',
    'ampicillin_500': 'ANTIBIOTIC',
    'azithromycin_500': 'ANTIBIOTIC',
    'cefadroxil_500': 'ANTIBIOTIC',
    'cefixime_100': 'ANTIBIOTIC',
    'ceftriaxone_inj': 'ANTIBIOTIC',
    'ciprofloxacin_500': 'ANTIBIOTIC',
    'clindamycin_300': 'ANTIBIOTIC',
    'cotrimoxazole_480': 'ANTIBIOTIC',
    'cotrimoxazole_960': 'ANTIBIOTIC',
    'doxycycline_100': 'ANTIBIOTIC',
    'erythromycin_500': 'ANTIBIOTIC',
    'ethambutol_400': 'ANTIBIOTIC', // Anti-TB
    'fluconazole_150': 'ANTIBIOTIC', // Antifungal
    'gentamicin_inj': 'ANTIBIOTIC',
    'griseofulvin_500': 'ANTIBIOTIC', // Antifungal
    'isoniazid_300': 'ANTIBIOTIC', // Anti-TB
    'ketoconazole_200': 'ANTIBIOTIC', // Antifungal
    'ketoconazole_cream': 'ANTIBIOTIC', // Antifungal
    'levofloxacin_500': 'ANTIBIOTIC',
    'metronidazole_500': 'ANTIBIOTIC',
    'miconazole_cream': 'ANTIBIOTIC', // Antifungal
    'nystatin_oral': 'ANTIBIOTIC', // Antifungal
    'pyrazinamide_400': 'ANTIBIOTIC', // Anti-TB
    'rifampicin_450': 'ANTIBIOTIC', // Anti-TB
    'dhp': 'ANTIBIOTIC', // Antimalarial
    'primaquine_15': 'ANTIBIOTIC', // Antimalarial

    // === ANTIHYPERTENSIVE / CARDIOVASCULAR ===
    'amlodipine_10': 'ANTIHYPERTENSIVE',
    'amlodipine_5': 'ANTIHYPERTENSIVE',
    'bisoprolol_5': 'ANTIHYPERTENSIVE',
    'captopril_25': 'ANTIHYPERTENSIVE',
    'candesartan_8': 'ANTIHYPERTENSIVE',
    'diltiazem_30': 'ANTIHYPERTENSIVE',
    'furosemide_40': 'ANTIHYPERTENSIVE',
    'hct_25': 'ANTIHYPERTENSIVE',
    'isdn_5': 'ANTIHYPERTENSIVE', // Cardiovascular
    'lisinopril_10': 'ANTIHYPERTENSIVE',
    'nifedipine_10': 'ANTIHYPERTENSIVE',
    'propranolol_10': 'ANTIHYPERTENSIVE',
    'simvastatin_10': 'ANTIHYPERTENSIVE', // Lipid-lowering (cardiovascular)
    'spironolactone_25': 'ANTIHYPERTENSIVE',
    'valsartan_80': 'ANTIHYPERTENSIVE',
    'aspilet_160': 'ANTIHYPERTENSIVE', // Antiplatelet (cardiovascular)
    'clopidogrel_300': 'ANTIHYPERTENSIVE', // Antiplatelet (cardiovascular)

    // === ANTIDIABETIC ===
    'glibenclamide_5': 'ANTIDIABETIC',
    'glimepiride_2': 'ANTIDIABETIC',
    'insulin_nph': 'ANTIDIABETIC',
    'insulin_rapid': 'ANTIDIABETIC',
    'metformin_500': 'ANTIDIABETIC',

    // === RESPIRATORY ===
    'aminophylline_inj': 'RESPIRATORY',
    'ambroxol_30': 'RESPIRATORY',
    'budesonide_inh': 'RESPIRATORY',
    'codein_10': 'RESPIRATORY', // Antitussive
    'ctm_4': 'RESPIRATORY', // Antihistamine used for respiratory allergies
    'cetirizine_10': 'RESPIRATORY', // Antihistamine
    'dextromethorphan': 'RESPIRATORY', // Antitussive
    'fluticasone_inh': 'RESPIRATORY',
    'glyceryl_guaiacolate': 'RESPIRATORY', // Expectorant
    'guaiafenesin_100': 'RESPIRATORY', // Expectorant
    'ipratropium_neb': 'RESPIRATORY',
    'loratadine_10': 'RESPIRATORY', // Antihistamine
    'obt': 'RESPIRATORY', // OBH (Obat Batuk Hitam)
    'salbutamol_2': 'RESPIRATORY',
    'salbutamol_mdi': 'RESPIRATORY',
    'salbutamol_neb': 'RESPIRATORY',

    // === GASTROINTESTINAL ===
    'antasida_syr': 'GASTROINTESTINAL',
    'attapulgite': 'GASTROINTESTINAL',
    'bisacodyl_5': 'GASTROINTESTINAL',
    'domperidone_10': 'GASTROINTESTINAL',
    'lactulose_syr': 'GASTROINTESTINAL',
    'loperamide_2': 'GASTROINTESTINAL',
    'oralit': 'GASTROINTESTINAL',
    'omeprazole_20': 'GASTROINTESTINAL',
    'ranitidine_150': 'GASTROINTESTINAL',
    'simethicone': 'GASTROINTESTINAL',
    'sucralfate_syr': 'GASTROINTESTINAL',
    'ondansetron_4': 'GASTROINTESTINAL', // Antiemetic

    // === DERMATOLOGY ===
    'betamethasone_cream': 'DERMATOLOGY',
    'calamine_lotion': 'DERMATOLOGY',
    'desoximetasone_cream': 'DERMATOLOGY',
    'gentamicin_cream': 'DERMATOLOGY',
    'hydrocortisone_cream': 'DERMATOLOGY',
    'permethrin_5': 'DERMATOLOGY',
    'permetrin_cream': 'DERMATOLOGY',
    'salep_24': 'DERMATOLOGY',
    'silver_sulfadiazine_cream': 'DERMATOLOGY',
    'tretinoin_cream': 'DERMATOLOGY',
    'urea_cream': 'DERMATOLOGY',
    'zinc_oxide_cream': 'DERMATOLOGY',
    'zinc_oxide_salep': 'DERMATOLOGY',
    'mupirosin_cream': 'DERMATOLOGY',

    // === SUPPLEMENT / VITAMIN / OBSTETRI ===
    'albendazole_400': 'SUPPLEMENT', // Antihelminthic — could go here or anti-infeksi
    'calcium': 'SUPPLEMENT',
    'calcium_tab': 'SUPPLEMENT',
    'fe_folat': 'SUPPLEMENT',
    'kalk_500': 'SUPPLEMENT',
    'mebendazole_100': 'SUPPLEMENT', // Antihelminthic
    'mebendazole_500': 'SUPPLEMENT',
    'pmt_pemulihan': 'SUPPLEMENT', // PMT
    'pyrantel_125': 'SUPPLEMENT', // Antihelminthic
    'sulfas_ferosus': 'SUPPLEMENT',
    'sulfas_ferrosus': 'SUPPLEMENT',
    'tablet_tambah_darah': 'SUPPLEMENT',
    'vit_a_200000': 'SUPPLEMENT',
    'vit_b_complex': 'SUPPLEMENT',
    'vit_b1': 'SUPPLEMENT',
    'vit_b12_inj': 'SUPPLEMENT',
    'vit_b6': 'SUPPLEMENT',
    'vit_c_500': 'SUPPLEMENT',
    'vit_c_50': 'SUPPLEMENT',
    'vit_d3': 'SUPPLEMENT',
    'vit_e_100': 'SUPPLEMENT',
    'vit_k_inj': 'SUPPLEMENT',
    'zinc_syr': 'SUPPLEMENT',
    'zinc_tab': 'SUPPLEMENT',
    'suntik_kb_1bln': 'SUPPLEMENT', // Obstetri/KB
    'suntik_kb_3bln': 'SUPPLEMENT', // Obstetri/KB
    'implant_kb': 'SUPPLEMENT', // Obstetri/KB
    'iud_insertion': 'SUPPLEMENT', // Obstetri/KB
    'misoprostol_tab': 'SUPPLEMENT', // Obstetri
    'methylergometrine': 'SUPPLEMENT', // Obstetri
    'magnesium_sulfate': 'SUPPLEMENT', // Obstetri (pre-eclampsia)
    'oxytocin_inj': 'SUPPLEMENT', // Obstetri
    'tetanus_immunoglobulin': 'SUPPLEMENT', // Vaccine/Immunologic

    // === PSYCHIATRY & NEURO ===
    'alprazolam_0.25': 'PSYCHIATRY_NEURO',
    'amitriptyline_25': 'PSYCHIATRY_NEURO',
    'betahistine_6': 'PSYCHIATRY_NEURO',
    'carbamazepine_200': 'PSYCHIATRY_NEURO',
    'chlorpromazine_100': 'PSYCHIATRY_NEURO',
    'diazepam_2mg': 'PSYCHIATRY_NEURO',
    'diazepam_5mg': 'PSYCHIATRY_NEURO',
    'dimenhidrinat_50': 'PSYCHIATRY_NEURO',
    'fluoxetine_20': 'PSYCHIATRY_NEURO',
    'gabapentin_100': 'PSYCHIATRY_NEURO',
    'haloperidol_1': 'PSYCHIATRY_NEURO',
    'haloperidol_inj': 'PSYCHIATRY_NEURO',
    'mecobalamin_500': 'PSYCHIATRY_NEURO',
    'phenytoin_100': 'PSYCHIATRY_NEURO',
    'risperidone_2': 'PSYCHIATRY_NEURO',
    'sertraline_50': 'PSYCHIATRY_NEURO',
    'sumatriptan_50': 'PSYCHIATRY_NEURO',
    'trihexyphenidyl_2': 'PSYCHIATRY_NEURO',
    'valproic_250': 'PSYCHIATRY_NEURO',

    // === ENT / EYE ===
    'artificial_tears': 'ENT_EYE',
    'chloramphenicol_ed': 'ENT_EYE',
    'chloramphenicol_eo': 'ENT_EYE', // Eye ointment
    'ciprofloxacin_ed': 'ENT_EYE', // Eye drops
    'ear_drops_carboglycerin': 'ENT_EYE',
    'gentamicin_ed': 'ENT_EYE', // Eye drops
    'lozenges': 'ENT_EYE',
    'ofloxacin_ed': 'ENT_EYE', // Eye drops
    'ofloxacin_eard': 'ENT_EYE', // Ear drops
    'pseudoephedrine': 'ENT_EYE', // Nasal decongestant
    'nasal_tampon': 'ENT_EYE', // Moved from MEDICAL_EQUIPMENT
    'triamcinolone_orabase': 'ENT_EYE', // Oral ulcer (Mouth)

    // === ALKES / MEDICAL EQUIPMENT ===
    'ats_injection': 'MEDICAL_EQUIPMENT', // Could argue vaccine but stays here with other supplies
    'wound_dressing_material': 'MEDICAL_EQUIPMENT',
    'suturing_kit_disposable': 'MEDICAL_EQUIPMENT',
    'iv_fluid_ns': 'MEDICAL_EQUIPMENT',
    'iv_fluid_rl': 'MEDICAL_EQUIPMENT',
    'ecg_electrode': 'MEDICAL_EQUIPMENT',
    'folley_catheter': 'MEDICAL_EQUIPMENT',
    'infusion_set': 'MEDICAL_EQUIPMENT',
    'iv_cannula': 'MEDICAL_EQUIPMENT',
    'kasa_steril': 'MEDICAL_EQUIPMENT',
    'masker_bedah': 'MEDICAL_EQUIPMENT',
    'ngt_tube': 'MEDICAL_EQUIPMENT',
    'nebulizer_kit': 'MEDICAL_EQUIPMENT',
    'plester': 'MEDICAL_EQUIPMENT',
    'kacamata_resep': 'MEDICAL_EQUIPMENT',
    'kacamata_baca': 'MEDICAL_EQUIPMENT',
    'kacamata_minus': 'MEDICAL_EQUIPMENT',
    'kacamata_plus': 'MEDICAL_EQUIPMENT',
    'kacamata_silinder': 'MEDICAL_EQUIPMENT',
    'sarung_tangan': 'MEDICAL_EQUIPMENT',
    'spuit_3cc': 'MEDICAL_EQUIPMENT',
    'urine_bag': 'MEDICAL_EQUIPMENT',
    'rl_infusion': 'MEDICAL_EQUIPMENT', // Duplicate of iv_fluid_rl but keeps as equipment

    // === LAB REAGENT ===
    'reagen_gds': 'LAB_REAGENT',
    'reagen_hb': 'LAB_REAGENT',
    'reagen_urine': 'LAB_REAGENT',

    // === EMERGENCY / INJEKSI ===
    'atropin_inj': 'EMERGENCY',
    'd10_maintenance': 'EMERGENCY',
    'd40_iv': 'EMERGENCY',
    'dexamethasone_iv': 'EMERGENCY',
    'diazepam_10mg': 'EMERGENCY',
    'diazepam_rectal_prn': 'EMERGENCY',
    'diphenhydramine_iv': 'EMERGENCY',
    'epinephrine_inj': 'EMERGENCY',
    'glucose_iv': 'EMERGENCY',
    'dextrose_oral': 'EMERGENCY',
    'lidocaine_inj': 'EMERGENCY',
    'methylprednisolone_iv': 'EMERGENCY',
    'phenytoin_iv': 'EMERGENCY',
    'saep_antivenom': 'EMERGENCY',
    'activated_charcoal': 'EMERGENCY',

    // === CORTICOSTEROIDS / ANTI-INFLAMMATORY (Move to correct groups) ===
    'dexamethasone_0': 'ANALGESIC', // Oral steroid — anti-inflammatory
    'methylprednisolone_4': 'ANALGESIC', // Oral steroid
    'prednisone_5': 'ANALGESIC', // Oral steroid
    'prednisone_60': 'ANALGESIC', // Oral steroid tapering
    'colchicine_0_5': 'ANALGESIC', // Anti-gout

    // === MUSCULOSKELETAL (currently SUPPLEMENT but should be ANALGESIC) ===
    'allopurinol_100': 'ANALGESIC', // Anti-hyperuricemia (musculoskeletal)
};

// Check mismatches
const changes = [];
const uncategorized = [];

for (const item of items) {
    const correct = CORRECT_CATEGORIES[item.id];
    if (!correct) {
        uncategorized.push(item);
    } else if (correct !== item.currentCat) {
        changes.push({
            id: item.id,
            name: item.name,
            from: item.currentCat,
            to: correct
        });
    }
}

// Group changes by category
const byCategory = {};
for (const c of changes) {
    if (!byCategory[c.to]) byCategory[c.to] = [];
    byCategory[c.to].push(c);
}

console.log('=== MISCLASSIFIED ITEMS ===');
console.log(`Total items needing reclassification: ${changes.length}\n`);

for (const [cat, items] of Object.entries(byCategory).sort()) {
    console.log(`\n→ Should be ${cat}:`);
    for (const c of items) {
        console.log(`  ${c.name.padEnd(45)} ${c.from.padEnd(20)} → ${c.to}`);
    }
}

if (uncategorized.length > 0) {
    console.log(`\n\n=== UNCATEGORIZED (${uncategorized.length} items) ===`);
    for (const item of uncategorized) {
        console.log(`  ${item.id.padEnd(30)} ${item.name.padEnd(45)} [${item.currentCat}]`);
    }
}

// Category distribution
console.log('\n\n=== CURRENT DISTRIBUTION ===');
const dist = {};
for (const item of items) dist[item.currentCat] = (dist[item.currentCat] || 0) + 1;
for (const [k, v] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(20)} ${v}`);
}

console.log('\n=== PROPOSED DISTRIBUTION ===');
const newDist = {};
for (const item of items) {
    const correct = CORRECT_CATEGORIES[item.id] || item.currentCat;
    newDist[correct] = (newDist[correct] || 0) + 1;
}
for (const [k, v] of Object.entries(newDist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(20)} ${v}`);
}
