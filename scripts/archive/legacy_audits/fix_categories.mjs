/**
 * COMPREHENSIVE Medication Reclassification Script
 * Fixes all misclassified items in MedicationDatabase.js
 *
 * Run: node fix_categories.mjs
 */
import fs from 'fs';

const FILE = 'src/data/MedicationDatabase.js';
let content = fs.readFileSync(FILE, 'utf8');

// ============================================================
// COMPLETE RECLASSIFICATION MAP
// Every item that needs its category changed.
// Key: medication ID → Value: correct MEDICATION_CATEGORIES key
// ============================================================
const RECLASSIFY = {
    // ─────────────── ANALGESIC ───────────────
    // Oral corticosteroids & anti-inflammatory (used for pain/inflammation)
    'dexamethasone_0': 'ANALGESIC',       // Oral steroid (anti-inflammatory)
    'methylprednisolone_4': 'ANALGESIC',       // Oral steroid
    'prednisone_60': 'ANALGESIC',       // Steroid tapering dose
    'colchicine_0_5': 'ANALGESIC',       // Anti-gout
    'allopurinol_100': 'ANALGESIC',       // Anti-hyperuricemia
    'allopurinol_300': 'ANALGESIC',       // Anti-hyperuricemia
    'paracetamol_syr': 'ANALGESIC',       // Syrup analgesic (was EMERGENCY)
    'morphine_iv': 'ANALGESIC',       // Opioid analgesic (was EMERGENCY)
    'tranexamic_acid_500': 'ANALGESIC',       // Hemostatic/antifibrinolytic — used for pain/bleeding

    // ─────────────── ANTIBIOTIC / ANTI-INFEKSI ───────────────
    'arv_regimen_1': 'ANTIBIOTIC',      // ARV (antiviral)
    'clindamycin_gel': 'ANTIBIOTIC',      // Topical antibiotic (acne)
    'clotrimazole_cream': 'ANTIBIOTIC',      // Antifungal
    'erythromycin_cream': 'ANTIBIOTIC',      // Topical antibiotic
    'ethambutol_500': 'ANTIBIOTIC',      // Anti-TB
    'fusidic_cream': 'ANTIBIOTIC',      // Topical antibiotic
    'mdt_pb': 'ANTIBIOTIC',      // Anti-leprosy
    'metronidazole_cream': 'ANTIBIOTIC',      // Topical anti-infective
    'mupirocin_oint': 'ANTIBIOTIC',      // Topical antibiotic
    'nystatin_cream': 'ANTIBIOTIC',      // Antifungal
    'oat_kat2': 'ANTIBIOTIC',      // Anti-TB (OAT Kategori 2)
    'pirazinamid_500': 'ANTIBIOTIC',      // Anti-TB
    'praziquantel': 'ANTIBIOTIC',      // Antihelminthic
    'dec_tab': 'ANTIBIOTIC',      // Antihelminthic (DEC for filariasis)

    // ─────────────── ANTIHYPERTENSIVE / KARDIOVASKULAR ───────────────
    'bisoprolol_2': 'ANTIHYPERTENSIVE', // Beta-blocker
    'captopril_12': 'ANTIHYPERTENSIVE', // ACE inhibitor
    'digoxin_0': 'ANTIHYPERTENSIVE', // Cardiac glycoside
    'furosemide_inj': 'ANTIHYPERTENSIVE', // Loop diuretic injection
    'isdn_10': 'ANTIHYPERTENSIVE', // Vasodilator (was SUPPLEMENT)
    'lisinopril_5': 'ANTIHYPERTENSIVE', // ACE inhibitor
    'losartan_50': 'ANTIHYPERTENSIVE', // ARB
    'propranolol_40': 'ANTIHYPERTENSIVE', // Beta-blocker
    'simvastatin_10': 'ANTIHYPERTENSIVE', // Statin (cardiovascular)
    'aspilet_160': 'ANTIHYPERTENSIVE', // Antiplatelet (was EMERGENCY)
    'clopidogrel_300': 'ANTIHYPERTENSIVE', // Antiplatelet (was EMERGENCY)
    'kcl': 'ANTIHYPERTENSIVE', // Electrolyte for cardiac use

    // ─────────────── ANTIDIABETIC ───────────────
    // (nothing new — all 11 items already correct)

    // ─────────────── RESPIRATORY ───────────────
    'gg': 'RESPIRATORY',       // GG (Glyceryl Guaiacolate) - expectorant
    'ipratropium_nasal': 'RESPIRATORY',       // Nasal spray (respiratory category)

    // ─────────────── GASTROINTESTINAL ───────────────
    'ranitidine_150': 'GASTROINTESTINAL',  // H2 blocker (was SUPPLEMENT)
    'simethicone': 'GASTROINTESTINAL',  // Antiflatulent (was SUPPLEMENT → already handled, double check)
    'sucralfate_syr': 'GASTROINTESTINAL',  // Gastric protectant (was SUPPLEMENT)
    'ondansetron_4': 'GASTROINTESTINAL',  // Antiemetic (was SUPPLEMENT)
    'dimenhydrinate_50': 'GASTROINTESTINAL',  // Anti-motion sickness / antiemetic
    'dimenhidrinat_50': 'GASTROINTESTINAL',  // Anti-motion sickness (was PSYCHIATRY_NEURO)

    // ─────────────── DERMATOLOGY ───────────────
    'benzoyl_peroxide': 'DERMATOLOGY',       // Acne treatment
    'desonide_cream': 'DERMATOLOGY',       // Topical corticosteroid
    'emla_cream': 'DERMATOLOGY',       // Topical anesthetic
    'hc_cream_1': 'DERMATOLOGY',       // Hydrocortisone cream
    'ketoconazole_shampoo': 'DERMATOLOGY',       // Antifungal shampoo (already DERMATOLOGY in DB)
    'lanolin_cream': 'DERMATOLOGY',       // Skin care
    'moisturizer': 'DERMATOLOGY',       // Emollient
    'permethrin_1_lotion': 'DERMATOLOGY',       // Pediculosis treatment
    'salicylic_acid_plaster': 'DERMATOLOGY',      // Keratolytic
    'zinc_oxide_cream': 'DERMATOLOGY',       // Skin protectant
    'zinc_oxide_salep': 'DERMATOLOGY',       // Skin protectant

    // ─────────────── SUPPLEMENT / VITAMIN / OBSTETRI ───────────────
    'asam_folat': 'SUPPLEMENT',        // Vitamin/supplement
    'calcium_carbonate': 'SUPPLEMENT',        // Supplement
    'fe_syr': 'SUPPLEMENT',        // Iron supplement
    'ferrous_sulfate': 'SUPPLEMENT',        // Iron supplement
    'folic_acid': 'SUPPLEMENT',        // Vitamin
    'kalsium_laktat': 'SUPPLEMENT',        // Calcium supplement
    'pil_kb_kombinasi': 'SUPPLEMENT',        // KB (Obstetri)
    'pil_kb_progestin': 'SUPPLEMENT',        // KB (Obstetri)
    'iud_copper': 'SUPPLEMENT',        // KB (Obstetri)
    'misoprostol': 'SUPPLEMENT',        // Obstetri
    'mgso4_inj': 'SUPPLEMENT',        // Obstetri (pre-eclampsia)
    'oksitosin_inj': 'SUPPLEMENT',        // Obstetri

    // ─────────────── PSYCHIATRY & NEUROLOGI ───────────────
    'alprazolam_0': 'PSYCHIATRY_NEURO',  // Benzodiazepine
    'diazepam_2': 'PSYCHIATRY_NEURO',  // Benzodiazepine
    'diazepam_5': 'PSYCHIATRY_NEURO',  // Benzodiazepine
    'trihexyphenidyl_2': 'PSYCHIATRY_NEURO',  // Anticholinergic (Parkinsonism)
    'prednisone_5': 'PSYCHIATRY_NEURO',  // KEEP — used for Bell's Palsy in neuro context
    // Actually prednisone_5 is more anti-inflammatory...
    // Let's put it in ANALGESIC instead since it's general purpose

    // ─────────────── ENT / MATA ───────────────
    'carboglycerin': 'ENT_EYE',           // Ear drop
    'chloramphenicol_eard': 'ENT_EYE',           // Ear drop antibiotic
    'chloramphenicol_eye_drops': 'ENT_EYE',       // Eye drops
    'h2o2_ear': 'ENT_EYE',           // Ear cleaning
    'hc_ed': 'ENT_EYE',           // Eye drop (anti-inflammatory)
    'nsaid_eye_drops': 'ENT_EYE',           // Eye drops
    'nasal_tampon': 'ENT_EYE',           // Nasal packing (was MEDICAL_EQUIPMENT)
    'triamcinolone_orabase': 'ENT_EYE',           // Oral ulcer (was SUPPLEMENT)
    'ofloxacin_eard': 'ENT_EYE',           // Ear drops (verify)

    // ─────────────── ALKES / MEDICAL EQUIPMENT ───────────────
    'rl_infusion': 'MEDICAL_EQUIPMENT',  // IV fluid
    'dextrose_5': 'MEDICAL_EQUIPMENT',  // IV fluid
    'ka_en_3b': 'MEDICAL_EQUIPMENT',  // IV fluid
    'lidocaine_epi': 'MEDICAL_EQUIPMENT',  // Local procedure supply
    'lidocaine_local': 'MEDICAL_EQUIPMENT',  // Local procedure supply
    'lidocaine_jelly': 'MEDICAL_EQUIPMENT',  // Catheterization supply

    // ─────────────── LAB REAGENT ───────────────
    'reagen_gds': 'LAB_REAGENT',        // GDS strip (was SUPPLEMENT)

    // ─────────────── GAWAT DARURAT / EMERGENCY ───────────────
    // Keep only true resuscitation/emergency drugs here
    // Remove items that belong to other categories (moved above)

    // ─────────────── THYROID (put in SUPPLEMENT or create new?) ───────────────
    'ptu_100': 'ANTIDIABETIC',       // Thyroid → closest fit is endocrine = ANTIDIABETIC
};

// Override: prednisone_5 should stay in ANALGESIC (general anti-inflammatory)
RECLASSIFY['prednisone_5'] = 'ANALGESIC';

// Count changes
let changeCount = 0;
let errors = [];

for (const [id, newCat] of Object.entries(RECLASSIFY)) {
    // Find the line: category: MEDICATION_CATEGORIES.XXXX,
    // that belongs to this specific id
    const idPattern = `id: '${id}',`;
    const idIndex = content.indexOf(idPattern);

    if (idIndex === -1) {
        errors.push(`❌ ID not found: ${id}`);
        continue;
    }

    // Find the category line within ~500 chars after the id
    const searchWindow = content.substring(idIndex, idIndex + 500);
    const catMatch = searchWindow.match(/category:\s*MEDICATION_CATEGORIES\.([A-Z_]+),/);

    if (!catMatch) {
        errors.push(`❌ Category line not found for: ${id}`);
        continue;
    }

    const oldCat = catMatch[1];
    if (oldCat === newCat) {
        // Already correct, skip
        continue;
    }

    // Replace within the window
    const oldStr = `category: MEDICATION_CATEGORIES.${oldCat},`;
    const newStr = `category: MEDICATION_CATEGORIES.${newCat},`;

    // Find exact position
    const catLineStart = idIndex + searchWindow.indexOf(oldStr);
    content = content.substring(0, catLineStart) + newStr + content.substring(catLineStart + oldStr.length);

    changeCount++;
    console.log(`✅ ${id.padEnd(30)} ${oldCat.padEnd(20)} → ${newCat}`);
}

if (errors.length > 0) {
    console.log('\n--- ERRORS ---');
    errors.forEach(e => console.log(e));
}

// Write back
fs.writeFileSync(FILE, content, 'utf8');
console.log(`\n✅ Done! ${changeCount} categories updated.`);

// Verify new distribution
const re2 = /category:\s*MEDICATION_CATEGORIES\.([A-Z_]+),/g;
let m2;
const dist = {};
while (m2 = re2.exec(content)) {
    dist[m2[1]] = (dist[m2[1]] || 0) + 1;
}
console.log('\n=== NEW DISTRIBUTION ===');
for (const [k, v] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(20)} ${v}`);
}
