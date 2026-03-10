import fs from 'fs';

// [id, name, cat, type, form, unitPrice, sellPrice, indication[], desc]
const defs = {
    alprazolam_025: ['Alprazolam 0.25mg', 'PSYCHIATRY_NEURO', 'tablet', 'oral', 2500, 5000, ['ansietas'], 'Benzodiazepin anxiolytic'],
    amoxicillin_250_ped: ['Amoxicillin Sirup 250mg/5ml', 'ANTIBIOTICS', 'botol', 'syrup', 8500, 15000, ['infeksi_anak'], 'Antibiotik sirup anak'],
    amoxicillin_clavulanate_625: ['Amoxicillin/Clavulanate 625mg', 'ANTIBIOTICS', 'tablet', 'oral', 5500, 10000, ['infeksi_campuran'], 'Ko-amoksiklav'],
    amoxicillin_ped: ['Amoxicillin Sirup Ped', 'ANTIBIOTICS', 'botol', 'syrup', 7000, 12000, ['infeksi_anak'], 'Sirup antibiotik anak'],
    ampicillin_1g_iv: ['Ampicillin 1g IV', 'ANTIBIOTICS', 'vial', 'injection', 6500, 15000, ['infeksi_berat'], 'Antibiotik IV broadspectrum'],
    ampicillin_sulbactam_1_5g_iv: ['Ampicillin/Sulbactam 1.5g IV', 'ANTIBIOTICS', 'vial', 'injection', 22000, 40000, ['infeksi_campuran_berat'], 'Antibiotik kombinasi IV'],
    analgesik: ['Analgesik (Generic)', 'ANALGESICS', 'tablet', 'oral', 500, 2000, ['nyeri_ringan'], 'Pereda nyeri generik'],
    asam_folat_1: ['Asam Folat 1mg', 'SUPPLEMENTS', 'tablet', 'oral', 250, 1000, ['anemia_defisiensi', 'kehamilan'], 'Suplemen folat'],
    asam_traneksamat_500_iv: ['Asam Traneksamat 500mg IV', 'EMERGENCY', 'ampul', 'injection', 8500, 20000, ['perdarahan'], 'Antifibrinolitik'],
    asetazolamid_250: ['Asetazolamid 250mg', 'ENT_EYE', 'tablet', 'oral', 3500, 8000, ['glaukoma_akut'], 'Inhibitor karbonik anhidrase'],
    aspirin_320_kunyah: ['Aspirin 320mg Kunyah', 'CARDIOVASCULAR', 'tablet', 'oral', 500, 2000, ['acs', 'antiplatelet'], 'Antiplatelet loading'],
    aspirin_80: ['Aspirin 80mg', 'CARDIOVASCULAR', 'tablet', 'oral', 350, 1500, ['antiplatelet'], 'Antiplatelet maintenance'],
    att_injection: ['Anti Tetanus Toxoid Injeksi', 'EMERGENCY', 'ampul', 'injection', 15000, 25000, ['tetanus_profilaksis'], 'Vaksin tetanus'],
    bed_rest: ['Tirah Baring', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['istirahat'], 'Instruksi tirah baring'],
    betamethasone_cream_topical: ['Betamethasone Cream Topical', 'DERMATOLOGY', 'tube', 'topical', 5500, 12000, ['dermatitis'], 'Kortikosteroid topikal'],
    betamethasone_valerate_cream: ['Betamethasone Valerate 0.1%', 'DERMATOLOGY', 'tube', 'topical', 6000, 13000, ['dermatitis', 'eksim'], 'Kortikosteroid topikal poten'],
    bisoprolol_2_5: ['Bisoprolol 2.5mg', 'CARDIOVASCULAR', 'tablet', 'oral', 3500, 7000, ['hipertensi', 'gagal_jantung'], 'Beta blocker selektif'],
    calcipotriol_cream: ['Calcipotriol 50mcg/g Cream', 'DERMATOLOGY', 'tube', 'topical', 55000, 85000, ['psoriasis'], 'Vitamin D analog topikal'],
    calcium_500: ['Kalsium 500mg', 'SUPPLEMENTS', 'tablet', 'oral', 800, 2000, ['osteoporosis'], 'Suplemen kalsium'],
    captopril_12_5: ['Captopril 12.5mg', 'CARDIOVASCULAR', 'tablet', 'oral', 350, 1500, ['hipertensi'], 'ACE inhibitor low dose'],
    carboglycerin_ear_drops: ['Carboglycerin Ear Drops', 'ENT_EYE', 'botol', 'drops', 8000, 15000, ['serumen_prop'], 'Pelembut serumen'],
    cefazolin_1g_iv: ['Cefazolin 1g IV', 'ANTIBIOTICS', 'vial', 'injection', 12000, 25000, ['profilaksis_bedah'], 'Sefalosporin gen-1 IV'],
    ceftriaxone_1g_iv: ['Ceftriaxone 1g IV', 'ANTIBIOTICS', 'vial', 'injection', 18000, 35000, ['infeksi_berat'], 'Sefalosporin gen-3 IV'],
    ceftriaxone_2g_iv: ['Ceftriaxone 2g IV', 'ANTIBIOTICS', 'vial', 'injection', 35000, 60000, ['meningitis'], 'Sefalosporin gen-3 dosis tinggi'],
    chloramphenicol_eye_drops: ['Chloramphenicol Eye Drops 0.5%', 'ENT_EYE', 'botol', 'drops', 5500, 10000, ['konjungtivitis'], 'Antibiotik tetes mata'],
    citicoline_500_iv: ['Citicoline 500mg IV', 'PSYCHIATRY_NEURO', 'ampul', 'injection', 22000, 40000, ['stroke'], 'Neuroprotektor'],
    clotrimazole_vag: ['Clotrimazole Vaginal 200mg', 'DERMATOLOGY', 'ovula', 'vaginal', 12000, 22000, ['kandidiasis_vagina'], 'Antijamur vaginal'],
    cold_compress: ['Kompres Dingin', 'EQUIPMENT', 'unit', 'action', 0, 0, ['demam'], 'Terapi dingin lokal'],
    corrective_lenses_minus: ['Kacamata Minus', 'EQUIPMENT', 'unit', 'equipment', 0, 200000, ['miopia'], 'Koreksi refraksi miopia'],
    corrective_lenses_plus: ['Kacamata Plus', 'EQUIPMENT', 'unit', 'equipment', 0, 200000, ['presbiopia'], 'Koreksi refraksi plus'],
    dexamethasone_05: ['Dexamethasone 0.5mg', 'ANALGESICS', 'tablet', 'oral', 250, 1000, ['anti_inflamasi'], 'Kortikosteroid oral'],
    dexamethasone_6_im: ['Dexamethasone 6mg IM', 'EMERGENCY', 'ampul', 'injection', 3500, 8000, ['pematangan_paru'], 'Dexamethasone IM'],
    dextrose_10_maintenance: ['Dextrose 10% Maintenance', 'EMERGENCY', 'kolf', 'infusion', 18000, 30000, ['hipoglikemia'], 'Cairan maintenance glukosa'],
    dextrose_40_25ml_iv: ['Dextrose 40% 25ml IV', 'EMERGENCY', 'vial', 'injection', 9750, 15000, ['hipoglikemia_berat'], 'Bolus glukosa hipertonik'],
    diazepam_10_im: ['Diazepam 10mg IM', 'EMERGENCY', 'ampul', 'injection', 4500, 10000, ['kejang'], 'Benzodiazepin IM'],
    diazepam_10_iv: ['Diazepam 10mg IV', 'EMERGENCY', 'ampul', 'injection', 4500, 10000, ['status_epileptikus'], 'Benzodiazepin IV'],
    diazepam_5_prn: ['Diazepam 5mg PRN', 'PSYCHIATRY_NEURO', 'tablet', 'oral', 1200, 3000, ['kejang'], 'Benzodiazepin oral prn'],
    diet_tinggi_kalori: ['Diet Tinggi Kalori', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['malnutrisi'], 'Instruksi diet'],
    dietary_modification: ['Modifikasi Diet', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['metabolik'], 'Konseling diet'],
    diosmin_flavonoid: ['Diosmin/Hesperidin 500mg', 'CARDIOVASCULAR', 'tablet', 'oral', 4000, 8000, ['hemoroid'], 'Venotonik'],
    diphenhydramine_inj: ['Diphenhydramine 10mg/ml Inj', 'EMERGENCY', 'ampul', 'injection', 3500, 8000, ['alergi_akut'], 'Antihistamin injeksi'],
    emollient: ['Emollient (Pelembab Kulit)', 'DERMATOLOGY', 'tube', 'topical', 15000, 30000, ['kulit_kering'], 'Pelembab kulit'],
    eperisone_50: ['Eperisone 50mg', 'ANALGESICS', 'tablet', 'oral', 3500, 7000, ['spasme_otot'], 'Muscle relaxant'],
    epinefrin_im: ['Epinefrin 1mg/ml IM', 'EMERGENCY', 'ampul', 'injection', 4550, 10000, ['anafilaksis'], 'Adrenalin IM'],
    fenitoin_100: ['Fenitoin 100mg', 'PSYCHIATRY_NEURO', 'tablet', 'oral', 1500, 4000, ['epilepsi'], 'Antikonvulsan'],
    fenitoin_loading_iv: ['Fenitoin Loading IV', 'EMERGENCY', 'vial', 'injection', 35000, 60000, ['status_epileptikus'], 'Antikonvulsan loading'],
    ferrous_sulfate_300: ['Ferrous Sulfate 300mg', 'SUPPLEMENTS', 'tablet', 'oral', 250, 1000, ['anemia_defisiensi_besi'], 'Suplemen besi'],
    furosemide_20: ['Furosemide 20mg', 'CARDIOVASCULAR', 'tablet', 'oral', 350, 1500, ['edema'], 'Diuretik loop'],
    furosemide_40_iv: ['Furosemide 40mg IV', 'EMERGENCY', 'ampul', 'injection', 3500, 8000, ['edema_paru'], 'Diuretik IV'],
    gentamicin_80_iv: ['Gentamicin 80mg IV', 'ANTIBIOTICS', 'ampul', 'injection', 5500, 12000, ['infeksi_berat'], 'Aminoglikosida IV'],
    gentamicin_topical: ['Gentamicin 0.1% Cream', 'DERMATOLOGY', 'tube', 'topical', 6000, 12000, ['infeksi_kulit'], 'Antibiotik topikal'],
    haloperidol_5_im: ['Haloperidol 5mg IM', 'PSYCHIATRY_NEURO', 'ampul', 'injection', 4000, 10000, ['psikosis_akut'], 'Antipsikotik IM'],
    heparin_subkutan: ['Heparin 5000IU Subkutan', 'CARDIOVASCULAR', 'vial', 'injection', 25000, 45000, ['dvt'], 'Antikoagulan'],
    high_fiber_diet: ['Diet Tinggi Serat', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['konstipasi'], 'Instruksi diet serat'],
    insulin_drip: ['Insulin Regular IV Drip', 'EMERGENCY', 'vial', 'injection', 65000, 100000, ['kad'], 'Insulin regular IV drip'],
    ipratropium_nebulizer: ['Ipratropium Nebulizer', 'RESPIRATORY', 'ampul', 'nebulizer', 8500, 15000, ['bronkospasme'], 'Antikolinergik inhalasi'],
    isdn_5_sublingual: ['ISDN 5mg Sublingual', 'CARDIOVASCULAR', 'tablet', 'sublingual', 1200, 3000, ['angina_pektoris'], 'Nitrat sublingual'],
    ketorolac_30_im: ['Ketorolac 30mg IM', 'ANALGESICS', 'ampul', 'injection', 6500, 15000, ['nyeri_akut'], 'NSAID injeksi IM'],
    ketorolac_30_iv: ['Ketorolac 30mg IV', 'ANALGESICS', 'ampul', 'injection', 6500, 15000, ['nyeri_kolik'], 'NSAID injeksi IV'],
    lanolin_nipple_cream: ['Lanolin Nipple Cream', 'DERMATOLOGY', 'tube', 'topical', 45000, 75000, ['nipple_cracked'], 'Pelindung puting'],
    levofloxacin_eye_drops: ['Levofloxacin Eye Drops 0.5%', 'ENT_EYE', 'botol', 'drops', 35000, 55000, ['keratitis'], 'Fluorokuinolon tetes mata'],
    lidocaine_suppository: ['Lidocaine Suppository', 'GASTROINTESTINAL', 'supp', 'rectal', 8000, 15000, ['hemoroid'], 'Anestesi lokal rektal'],
    meropenem_1g_iv: ['Meropenem 1g IV', 'ANTIBIOTICS', 'vial', 'injection', 95000, 150000, ['sepsis'], 'Karbapenem broad-spectrum'],
    methylcobalamin_500: ['Methylcobalamin 500mcg', 'SUPPLEMENTS', 'tablet', 'oral', 2500, 5000, ['neuropati'], 'Vitamin B12 aktif'],
    methylergometrine: ['Methylergometrine 0.2mg Tab', 'EMERGENCY', 'tablet', 'oral', 1500, 4000, ['pph'], 'Uterotonika oral'],
    methylprednisolone_iv: ['Methylprednisolone 125mg IV', 'EMERGENCY', 'vial', 'injection', 45000, 75000, ['inflamasi_berat'], 'Kortikosteroid IV pulse'],
    metronidazole_500_iv: ['Metronidazole 500mg IV', 'ANTIBIOTICS', 'kolf', 'infusion', 12000, 25000, ['infeksi_anaerob'], 'Anti-anaerob IV'],
    mgso4_loading_dose: ['MgSO4 Loading 4g IV', 'EMERGENCY', 'vial', 'injection', 25000, 40000, ['eklamsia'], 'Anti-kejang obstetrik loading'],
    mgso4_maintenance: ['MgSO4 Maintenance 1g/jam', 'EMERGENCY', 'vial', 'injection', 16000, 30000, ['eklamsia'], 'Anti-kejang obstetrik drip'],
    misoprostol_800_rektal: ['Misoprostol 800mcg Rektal', 'EMERGENCY', 'tablet', 'rectal', 8000, 15000, ['pph'], 'Prostaglandin uterotonik'],
    morfin_2_iv: ['Morphine 2mg IV', 'EMERGENCY', 'ampul', 'injection', 15000, 30000, ['nyeri_berat'], 'Opioid analgesik'],
    multivitamin: ['Multivitamin', 'SUPPLEMENTS', 'tablet', 'oral', 250, 1000, ['suplementasi'], 'Vitamin kombinasi'],
    nacl_09_1000: ['NaCl 0.9% 1000ml', 'EMERGENCY', 'kolf', 'infusion', 18000, 30000, ['rehidrasi'], 'Normal saline 1L'],
    nacl_nasal_drops: ['NaCl 0.9% Nasal Drops', 'ENT_EYE', 'botol', 'drops', 5000, 10000, ['rinitis'], 'Tetes hidung salin'],
    naloxone_04_iv: ['Naloxone 0.4mg IV', 'EMERGENCY', 'ampul', 'injection', 35000, 60000, ['overdosis_opioid'], 'Antagonis opioid'],
    nasal_packing_anterior: ['Tampon Hidung Anterior', 'EQUIPMENT', 'unit', 'equipment', 8000, 15000, ['epistaksis'], 'Tampon hidung'],
    niclosamide_2g: ['Niclosamide 500mg (4 tab)', 'ANTIBIOTICS', 'tablet', 'oral', 8000, 15000, ['taeniasis'], 'Anthelmintic cestoda'],
    nifedipine_10: ['Nifedipine 10mg', 'CARDIOVASCULAR', 'tablet', 'oral', 1200, 3000, ['hipertensi_krisis'], 'CCB dihidropiridin'],
    nipple_shield: ['Nipple Shield', 'EQUIPMENT', 'unit', 'equipment', 25000, 45000, ['menyusui'], 'Pelindung puting'],
    nutritional_support: ['Dukungan Nutrisi', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['malnutrisi'], 'Konseling nutrisi'],
    o2_nrm_15lpm: ['Oksigen NRM 15 LPM', 'EMERGENCY', 'unit', 'action', 0, 50000, ['hipoksia'], 'Oksigen non-rebreathing mask'],
    observation: ['Observasi', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['monitoring'], 'Instruksi observasi'],
    ofloxacin_ear_drops: ['Ofloxacin Ear Drops 0.3%', 'ENT_EYE', 'botol', 'drops', 25000, 45000, ['otitis_media'], 'Fluorokuinolon tetes telinga'],
    oksitosin_10_drip: ['Oxytocin 10IU Drip', 'EMERGENCY', 'ampul', 'injection', 6500, 15000, ['pph'], 'Uterotonika drip'],
    oksitosin_10_iv: ['Oxytocin 10IU IV', 'EMERGENCY', 'ampul', 'injection', 6500, 15000, ['pph'], 'Uterotonika bolus'],
    omeprazole_40_iv: ['Omeprazole 40mg IV', 'EMERGENCY', 'vial', 'injection', 25000, 45000, ['perdarahan_gi'], 'PPI injeksi'],
    ondansetron_4_iv: ['Ondansetron 4mg IV', 'EMERGENCY', 'ampul', 'injection', 8000, 18000, ['mual_berat'], 'Antiemetik IV'],
    paracetamol_1g_iv: ['Paracetamol 1g IV', 'EMERGENCY', 'kolf', 'infusion', 18000, 35000, ['demam_berat'], 'Antipiretik infus'],
    paracetamol_infus: ['Paracetamol Infus 1g', 'EMERGENCY', 'kolf', 'infusion', 18000, 35000, ['demam_berat'], 'Paracetamol IV'],
    paracetamol_syrup: ['Paracetamol Sirup 120mg/5ml', 'ANALGESICS', 'botol', 'syrup', 6000, 12000, ['demam_anak'], 'Antipiretik sirup anak'],
    praziquantel_600: ['Praziquantel 600mg', 'ANTIBIOTICS', 'tablet', 'oral', 6000, 12000, ['schistosomiasis'], 'Anthelmintic trematoda'],
    propylthiouracil_100: ['PTU 100mg', 'METABOLIC', 'tablet', 'oral', 2500, 5000, ['hipertiroid'], 'Antitiroid'],
    pseudoefedrin_60: ['Pseudoefedrin 60mg', 'RESPIRATORY', 'tablet', 'oral', 1500, 3000, ['kongesti_nasal'], 'Dekongestan oral'],
    ranitidine_50_iv: ['Ranitidine 50mg IV', 'EMERGENCY', 'ampul', 'injection', 4550, 10000, ['gastroproteksi'], 'H2 blocker IV'],
    rl_1000: ['Ringer Lactate 1000ml', 'EMERGENCY', 'kolf', 'infusion', 20000, 35000, ['rehidrasi'], 'Kristaloid 1L'],
    rl_1000_guyur: ['RL 1000ml Guyur', 'EMERGENCY', 'kolf', 'infusion', 20000, 35000, ['syok'], 'Resusitasi cairan cepat'],
    rl_1000_guyur_2: ['RL 1000ml Guyur (2nd)', 'EMERGENCY', 'kolf', 'infusion', 20000, 35000, ['syok'], 'Resusitasi cairan kedua'],
    rl_20ml_kg_guyur: ['RL 20ml/kgBB Guyur', 'EMERGENCY', 'kolf', 'infusion', 20000, 35000, ['syok_anak'], 'Resusitasi pediatrik'],
    rl_30ml_kg: ['RL 30ml/kgBB', 'EMERGENCY', 'kolf', 'infusion', 20000, 35000, ['sepsis'], 'Resusitasi sepsis'],
    rl_maintenance: ['RL Maintenance', 'EMERGENCY', 'kolf', 'infusion', 13000, 25000, ['maintenance'], 'Cairan rumatan'],
    rl_parkland_formula: ['RL Parkland Formula', 'EMERGENCY', 'kolf', 'infusion', 20000, 35000, ['luka_bakar'], 'Resusitasi luka bakar'],
    salbutamol_nebulizer_serial: ['Salbutamol Nebulizer Serial', 'RESPIRATORY', 'ampul', 'nebulizer', 5500, 12000, ['status_asmatikus'], 'Bronkodilator serial'],
    sertraline_50: ['Sertraline 50mg', 'PSYCHIATRY_NEURO', 'tablet', 'oral', 8000, 15000, ['depresi'], 'SSRI antidepresan'],
    silver_sulfadiazine: ['Silver Sulfadiazine 1%', 'DERMATOLOGY', 'tube', 'topical', 18000, 35000, ['luka_bakar'], 'Antibiotik luka bakar'],
    spironolakton_25: ['Spironolakton 25mg', 'CARDIOVASCULAR', 'tablet', 'oral', 2500, 5000, ['gagal_jantung'], 'Antagonis aldosteron'],
    stop_offending_drug: ['Hentikan Obat Penyebab', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['reaksi_obat'], 'Instruksi stop obat'],
    supportive_care: ['Perawatan Suportif', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['umum'], 'Perawatan suportif'],
    tetanus_toxoid: ['Tetanus Toxoid Inj', 'EMERGENCY', 'ampul', 'injection', 12000, 20000, ['tetanus'], 'Vaksin tetanus'],
    timolol_eye_drops: ['Timolol 0.5% Eye Drops', 'ENT_EYE', 'botol', 'drops', 22000, 40000, ['glaukoma'], 'Beta blocker tetes mata'],
    tramadol_50_iv: ['Tramadol 50mg IV', 'ANALGESICS', 'ampul', 'injection', 6500, 15000, ['nyeri_sedang_berat'], 'Opioid lemah IV'],
    triamcinolone_orabase: ['Triamcinolone Orabase', 'ENT_EYE', 'tube', 'topical', 18000, 30000, ['stomatitis'], 'Kortikosteroid oral topikal'],
    vitamin_a_200000iu: ['Vitamin A 200.000 IU', 'SUPPLEMENTS', 'kapsul', 'oral', 500, 1500, ['suplementasi_anak'], 'Vitamin A dosis tinggi'],
    vitamin_b6_25: ['Vitamin B6 25mg', 'SUPPLEMENTS', 'tablet', 'oral', 250, 1000, ['mual_kehamilan'], 'Piridoksin'],
    warfarin_2: ['Warfarin 2mg', 'CARDIOVASCULAR', 'tablet', 'oral', 1500, 4000, ['af'], 'Antikoagulan oral'],
    wound_care: ['Perawatan Luka', 'EQUIPMENT', 'set', 'action', 5000, 15000, ['luka'], 'Set perawatan luka'],
    wound_dressing: ['Wound Dressing', 'EQUIPMENT', 'set', 'action', 5000, 15000, ['luka'], 'Balut luka'],
    wrist_splint: ['Wrist Splint', 'EQUIPMENT', 'unit', 'equipment', 35000, 65000, ['cts'], 'Bidai pergelangan tangan'],
    diet_rendah_garam: ['Diet Rendah Garam', 'SUPPLEMENTS', 'tindakan', 'action', 0, 0, ['hipertensi'], 'Instruksi diet rendah garam']
};

const lines = [
    '/**',
    ' * @reflection',
    ' * [IDENTITY]: missing_case_meds.js',
    ' * [PURPOSE]: Additional medication/treatment entries referenced by SKDI case files.',
    ' * [STATE]: Stable',
    ' * [ANCHOR]: MISSING_CASE_MEDS',
    ' * [DEPENDS_ON]: utils.js',
    ' */',
    '',
    "import { MEDICATION_CATEGORIES } from '../utils.js';",
    '',
    'export const MISSING_CASE_MEDS = ['
];

const entries = Object.entries(defs);
entries.forEach(([id, [name, cat, type, form, unitPrice, sellPrice, indication, desc]], idx) => {
    lines.push('    {');
    lines.push(`        id: '${id}',`);
    lines.push(`        name: '${name}',`);
    lines.push(`        category: MEDICATION_CATEGORIES.${cat},`);
    lines.push(`        type: '${type}',`);
    lines.push(`        form: '${form}',`);
    lines.push('        fornas: true,');
    lines.push(`        unitPrice: ${unitPrice},`);
    lines.push(`        sellPrice: ${sellPrice},`);
    lines.push(`        igdPrice: ${Math.round(sellPrice * 1.5)},`);
    lines.push('        minStock: 10,');
    lines.push('        maxStock: 100,');
    lines.push("        supplier: 'dinkes',");
    lines.push('        leadTime: 5,');
    lines.push(`        indication: ${JSON.stringify(indication)},`);
    lines.push(`        description: '${desc}'`);
    lines.push('    }' + (idx < entries.length - 1 ? ',' : ''));
});
lines.push('];');
lines.push('');

fs.writeFileSync('src/data/medication/registry/missing_case_meds.js', lines.join('\n'));
console.log(`Created missing_case_meds.js with ${entries.length} entries`);
