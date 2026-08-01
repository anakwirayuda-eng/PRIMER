/* eslint-disable */
// Dibangkitkan oleh scripts/generate-clinical-provenance.ts.
// Jangan edit manual; ubah registry/crosswalk generator lalu jalankan npm run generate:provenance.
import type { SumberKlinis } from './types'

interface SourceAssignment {
  sourceId: keyof typeof CLINICAL_SOURCE_REGISTRY
  cakupan: NonNullable<SumberKlinis['cakupan']>
  catatan?: string
}

export const CLINICAL_SOURCE_REGISTRY = {
  "aad-acne-2024": {
    "id": "aad-acne-2024",
    "label": "American Academy of Dermatology - Acne Clinical Guideline",
    "url": "https://www.aad.org/member/clinical-quality/guidelines/acne",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "aao-hns-bell-palsy-2013": {
    "id": "aao-hns-bell-palsy-2013",
    "label": "AAO-HNSF Guideline - Bell Palsy",
    "url": "https://www.entnet.org/wp-content/uploads/files/Bulletin_BellsExecSummary_Final_102313.pdf",
    "tahun": 2013,
    "jenis": "evidence_internasional"
  },
  "aao-hns-bppv-2017": {
    "id": "aao-hns-bppv-2017",
    "label": "AAO-HNSF Guideline - Benign Paroxysmal Positional Vertigo",
    "url": "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/bppv/",
    "tahun": 2017,
    "jenis": "evidence_internasional"
  },
  "aao-hns-cerumen-2017": {
    "id": "aao-hns-cerumen-2017",
    "label": "AAO-HNSF - Clinical Practice Guideline: Cerumen Impaction",
    "url": "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/cerumen-impaction/",
    "tahun": 2017,
    "jenis": "evidence_internasional"
  },
  "aao-hns-nosebleed-2020": {
    "id": "aao-hns-nosebleed-2020",
    "label": "AAO-HNSF Guideline - Nosebleed (Epistaxis)",
    "url": "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/nosebleed-epistaxis/",
    "tahun": 2020,
    "jenis": "evidence_internasional"
  },
  "aao-hns-otitis-externa-2014": {
    "id": "aao-hns-otitis-externa-2014",
    "label": "AAO-HNSF Guideline - Acute Otitis Externa",
    "url": "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/",
    "tahun": 2014,
    "jenis": "evidence_internasional"
  },
  "aao-pvd-retinal-breaks-2024": {
    "id": "aao-pvd-retinal-breaks-2024",
    "label": "American Academy of Ophthalmology - Posterior Vitreous Detachment, Retinal Breaks, and Lattice Degeneration Preferred Practice Pattern",
    "url": "https://www.aao.org/preferred-practice-pattern/posterior-vitreous-detachment-retinal-breaks-latti",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "acep-mtbi-2023": {
    "id": "acep-mtbi-2023",
    "label": "American College of Emergency Physicians - Clinical Policy: Mild Traumatic Brain Injury",
    "url": "https://www.acep.org/siteassets/new-pdfs/clinical-policies/mtbi2023.pdf",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "acg-gerd-2022": {
    "id": "acg-gerd-2022",
    "label": "ACG Clinical Guideline for GERD",
    "url": "https://journals.lww.com/ajg/fulltext/2022/01000/acg_clinical_guideline_for_the_diagnosis_and.14.aspx",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "acg-ugib-2021": {
    "id": "acg-ugib-2021",
    "label": "American College of Gastroenterology - ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
    "url": "https://doi.org/10.14309/ajg.0000000000001245",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "aci-burn-management-2026": {
    "id": "aci-burn-management-2026",
    "label": "NSW Agency for Clinical Innovation, Statewide Burn Injury Service - Burn Patient Management - Clinical Practice Guide, 5th Edition",
    "url": "https://aci.health.nsw.gov.au/__data/assets/pdf_file/0009/250020/ACI-Burn-Patient-Management-Clinical-Practice-Guide.pdf",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "acr-gout-2020": {
    "id": "acr-gout-2020",
    "label": "American College of Rheumatology Guideline for Gout",
    "url": "https://rheumatology.org/gout-guideline",
    "tahun": 2020,
    "jenis": "evidence_internasional"
  },
  "acs-orthopaedic-trauma-2022": {
    "id": "acs-orthopaedic-trauma-2022",
    "label": "American College of Surgeons - Best Practices in Orthopaedic Trauma",
    "url": "https://www.facs.org/media/mkbnhqtw/ortho_guidelines.pdf",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "ada_hypoglycemia_2026": {
    "id": "ada_hypoglycemia_2026",
    "label": "ADA Standards of Care - Glycemic Goals and Hypoglycemia 2026",
    "url": "https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "ada-diabetes-2026-type1": {
    "id": "ada-diabetes-2026-type1",
    "label": "American Diabetes Association - Standards of Care in Diabetes - 2026: Pharmacologic Approaches and Glycemic Goals",
    "url": "https://diabetesjournals.org/care/issue/49/Supplement_1",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "ada-retinopathy-2026": {
    "id": "ada-retinopathy-2026",
    "label": "American Diabetes Association - Retinopathy, Neuropathy, and Foot Care: Standards of Care in Diabetes—2026",
    "url": "https://diabetesjournals.org/care/article/49/Supplement_1/S261/163919/12-Retinopathy-Neuropathy-and-Foot-Care-Standards",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "aga-hemorrhoids-2026": {
    "id": "aga-hemorrhoids-2026",
    "label": "American Gastroenterological Association - Clinical Practice Update: Diagnosis and Treatment of Hemorrhoids",
    "url": "https://gastro.org/clinical-guidance/diagnosis-and-treatment-of-hemorrhoids/",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "aga-ida-2024": {
    "id": "aga-ida-2024",
    "label": "American Gastroenterological Association - AGA Clinical Practice Update on Management of Iron Deficiency Anemia: Expert Review",
    "url": "https://gastro.org/clinical-guidance/management-of-iron-deficiency-anemia/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "aha_asa_stroke_2026": {
    "id": "aha_asa_stroke_2026",
    "label": "AHA/ASA Guideline for Acute Ischemic Stroke 2026",
    "url": "https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "aha-tia-2023": {
    "id": "aha-tia-2023",
    "label": "American Heart Association - Diagnosis, Workup, Risk Reduction of Transient Ischemic Attack in the Emergency Department Setting",
    "url": "https://professional.heart.org/en/science-news/diagnosis-workup-risk-reduction-of-transient-ischemic-attack-in-the-emergency-department-setting",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "aria-rhinitis-2024": {
    "id": "aria-rhinitis-2024",
    "label": "ARIA-EAACI Care Pathways for Allergic Rhinitis",
    "url": "https://www.euforea.eu/aria/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "ascrs-anorectal-abscess-2022": {
    "id": "ascrs-anorectal-abscess-2022",
    "label": "American Society of Colon and Rectal Surgeons - Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula",
    "url": "https://doi.org/10.1097/DCR.0000000000002473",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "ata-hyperthyroidism-2016": {
    "id": "ata-hyperthyroidism-2016",
    "label": "American Thyroid Association - Guidelines for Diagnosis and Management of Hyperthyroidism and Other Causes of Thyrotoxicosis",
    "url": "https://www.thyroid.org/professionals/ata-professional-guidelines/",
    "tahun": 2016,
    "jenis": "evidence_internasional"
  },
  "ats-idsa-cap-2019": {
    "id": "ats-idsa-cap-2019",
    "label": "ATS/IDSA Guideline - Community-acquired Pneumonia in Adults",
    "url": "https://www.thoracic.org/statements/guideline-implementation-tools/diagnosis-and-treatment-of-cap.php",
    "tahun": 2019,
    "jenis": "evidence_internasional"
  },
  "bsaci-rhinitis-2017": {
    "id": "bsaci-rhinitis-2017",
    "label": "BSACI Guideline for the Diagnosis and Management of Allergic and Non-allergic Rhinitis",
    "url": "https://www.bsaci.org/guidelines-and-standards/bsaci-guidelines/rhinitis-2017-update/",
    "tahun": 2017,
    "jenis": "evidence_internasional"
  },
  "bsg-functional-dyspepsia-2022": {
    "id": "bsg-functional-dyspepsia-2022",
    "label": "British Society of Gastroenterology - Functional Dyspepsia Guideline",
    "url": "https://www.bsg.org.uk/clinical-resource/bsg-guidelines-on-the-management-of-functional-dys",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "bts-pleural-procedures-2023": {
    "id": "bts-pleural-procedures-2023",
    "label": "British Thoracic Society - BTS Clinical Statement on Pleural Procedures",
    "url": "https://www.brit-thoracic.org.uk/clinical-resources/clinical-statements/pleural-procedures/",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "bts-pneumothorax-2023": {
    "id": "bts-pneumothorax-2023",
    "label": "British Thoracic Society - British Thoracic Society Guideline for Pleural Disease: Spontaneous Pneumothorax",
    "url": "https://www.brit-thoracic.org.uk/document-library/guidelines/pleural-disease/pleural-disease-full-supplement/",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "cdc-adult-outpatient-2024": {
    "id": "cdc-adult-outpatient-2024",
    "label": "CDC - Outpatient Clinical Care for Adults: Common Cold and Acute Bronchitis",
    "url": "https://www.cdc.gov/antibiotic-use/hcp/clinical-care/adult-outpatient.html",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-bv-2021": {
    "id": "cdc-bv-2021",
    "label": "US Centers for Disease Control and Prevention - Sexually Transmitted Infections Treatment Guidelines: Bacterial Vaginosis",
    "url": "https://www.cdc.gov/std/treatment-guidelines/bv.htm",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "cdc-cervicitis-2021": {
    "id": "cdc-cervicitis-2021",
    "label": "US Centers for Disease Control and Prevention - Urethritis and Cervicitis - STI Treatment Guidelines",
    "url": "https://www.cdc.gov/std/treatment-guidelines/urethritis-and-cervicitis.htm",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "cdc-head-lice-2024": {
    "id": "cdc-head-lice-2024",
    "label": "CDC - Clinical Care of Head Lice",
    "url": "https://www.cdc.gov/lice/hcp/clinical-care/index.html",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-leptospirosis-2026": {
    "id": "cdc-leptospirosis-2026",
    "label": "US Centers for Disease Control and Prevention - Clinical Overview of Leptospirosis",
    "url": "https://www.cdc.gov/leptospirosis/hcp/clinical-overview/index.html",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "cdc-measles-2025": {
    "id": "cdc-measles-2025",
    "label": "CDC - Clinical Overview of Measles",
    "url": "https://www.cdc.gov/measles/hcp/clinical-overview/index.html",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "cdc-motion-sickness-2026": {
    "id": "cdc-motion-sickness-2026",
    "label": "US Centers for Disease Control and Prevention - CDC Yellow Book 2026: Motion Sickness",
    "url": "https://www.cdc.gov/yellow-book/hcp/travel-air-sea/motion-sickness.html",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "cdc-mumps-2024": {
    "id": "cdc-mumps-2024",
    "label": "CDC - Clinical Overview of Mumps",
    "url": "https://www.cdc.gov/mumps/hcp/clinical-overview/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-pertussis-treatment-2025": {
    "id": "cdc-pertussis-treatment-2025",
    "label": "US Centers for Disease Control and Prevention - Treatment of Pertussis",
    "url": "https://www.cdc.gov/pertussis/hcp/clinical-care/",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "cdc-pid-2021": {
    "id": "cdc-pid-2021",
    "label": "US Centers for Disease Control and Prevention - Pelvic Inflammatory Disease - STI Treatment Guidelines",
    "url": "https://www.cdc.gov/std/treatment-guidelines/pid.htm",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "cdc-shigella-2024": {
    "id": "cdc-shigella-2024",
    "label": "CDC - Clinical Care of Shigellosis",
    "url": "https://www.cdc.gov/shigella/hcp/clinical-care/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-shingles-2024": {
    "id": "cdc-shingles-2024",
    "label": "CDC - Clinical Overview of Shingles",
    "url": "https://www.cdc.gov/shingles/hcp/clinical-overview/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-strep-throat-2025": {
    "id": "cdc-strep-throat-2025",
    "label": "CDC - Clinical Guidance for Group A Streptococcal Pharyngitis",
    "url": "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "cdc-strongyloides-2024": {
    "id": "cdc-strongyloides-2024",
    "label": "US Centers for Disease Control and Prevention - Clinical Care of Strongyloides",
    "url": "https://www.cdc.gov/strongyloides/hcp/clinical-care/index.html",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-typhoid-2024": {
    "id": "cdc-typhoid-2024",
    "label": "CDC - Clinical Guidance for Typhoid and Paratyphoid Fever",
    "url": "https://www.cdc.gov/typhoid-fever/hcp/clinical-guidance/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-varicella-2024": {
    "id": "cdc-varicella-2024",
    "label": "CDC - Clinical Guidance for People at Risk for Severe Varicella",
    "url": "https://www.cdc.gov/chickenpox/hcp/clinical-guidance/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "cdc-vvc-2021": {
    "id": "cdc-vvc-2021",
    "label": "CDC STI Guidelines - Vulvovaginal Candidiasis",
    "url": "https://www.cdc.gov/std/treatment-guidelines/candidiasis.htm",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "childrens-mercy-mastoiditis-2026": {
    "id": "childrens-mercy-mastoiditis-2026",
    "label": "Children's Mercy Kansas City - Acute Mastoiditis Clinical Pathway and Synopsis",
    "url": "https://www.childrensmercy.org/health-care-providers/evidence-based-practice/cpgs-cpms-and-eras-pathways/mastoiditis-acute/",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "chop-peritonsillar-abscess-2025": {
    "id": "chop-peritonsillar-abscess-2025",
    "label": "Children's Hospital of Philadelphia - Suspected Pharyngitis or Peritonsillar Abscess Clinical Pathway",
    "url": "https://www.chop.edu/clinical-pathway/pharyngitis-clinical-pathway",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "cochrane-threatened-miscarriage-2021": {
    "id": "cochrane-threatened-miscarriage-2021",
    "label": "Cochrane - Progestogens for Preventing Miscarriage: Network Meta-analysis",
    "url": "https://www.cochrane.org/evidence/CD013792_are-progestogen-treatments-effective-preventing-miscarriage",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "cps-otitis-media-2024": {
    "id": "cps-otitis-media-2024",
    "label": "Canadian Paediatric Society - Acute Otitis Media (reaffirmed 2024)",
    "url": "https://cps.ca/en/documents/position/acute-otitis-media",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "eaaci-food-allergy-2024": {
    "id": "eaaci-food-allergy-2024",
    "label": "EAACI Guideline on Management of IgE-mediated Food Allergy",
    "url": "https://onlinelibrary.wiley.com/doi/10.1111/all.16370",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "eaaci-urticaria-2022": {
    "id": "eaaci-urticaria-2022",
    "label": "EAACI/GA2LEN/EuroGuiDerm/APAAACI Urticaria Guideline",
    "url": "https://onlinelibrary.wiley.com/doi/10.1111/all.15090",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "easl-decompensated-cirrhosis-2018": {
    "id": "easl-decompensated-cirrhosis-2018",
    "label": "European Association for the Study of the Liver - EASL Clinical Practice Guidelines for the management of patients with decompensated cirrhosis",
    "url": "https://easl.eu/wp-content/uploads/2018/10/decompensated-cirrhosis-English-report.pdf",
    "tahun": 2018,
    "jenis": "evidence_internasional"
  },
  "eau-male-luts-2026": {
    "id": "eau-male-luts-2026",
    "label": "European Association of Urology - Guidelines on the Management of Non-neurogenic Male Lower Urinary Tract Symptoms",
    "url": "https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "eau-paediatric-urology-2026": {
    "id": "eau-paediatric-urology-2026",
    "label": "EAU Guidelines on Paediatric Urology 2026",
    "url": "https://uroweb.org/guidelines/paediatric-urology",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "eau-urolithiasis-2026": {
    "id": "eau-urolithiasis-2026",
    "label": "EAU Guidelines on Urolithiasis 2026",
    "url": "https://uroweb.org/guidelines/urolithiasis",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "eau-urological-infections-2026": {
    "id": "eau-urological-infections-2026",
    "label": "EAU Guidelines on Urological Infections 2026",
    "url": "https://uroweb.org/guidelines/urological-infections",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "epos-rhinosinusitis-2020": {
    "id": "epos-rhinosinusitis-2020",
    "label": "EPOS 2020 - Rhinosinusitis and Nasal Polyps",
    "url": "https://www.rhinologyjournal.com/Documents/Supplements/supplement_29.pdf",
    "tahun": 2020,
    "jenis": "evidence_internasional"
  },
  "esc-dyslipidaemia-2025": {
    "id": "esc-dyslipidaemia-2025",
    "label": "ESC/EAS Focused Update on Dyslipidaemias",
    "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "esc-heart-failure-2021": {
    "id": "esc-heart-failure-2021",
    "label": "ESC Guidelines for Acute and Chronic Heart Failure",
    "url": "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-and-Chronic-Heart-Failure",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "esc-heart-failure-2023": {
    "id": "esc-heart-failure-2023",
    "label": "European Society of Cardiology - 2021 Heart Failure Guideline with 2023 Focused Update",
    "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/focused-update-on-heart-failure/",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "esc-hypertension-2024": {
    "id": "esc-hypertension-2024",
    "label": "ESC Guidelines - Elevated Blood Pressure and Hypertension",
    "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "esrs-insomnia-2023": {
    "id": "esrs-insomnia-2023",
    "label": "European Insomnia Guideline 2023",
    "url": "https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "esvs-venous-2022": {
    "id": "esvs-venous-2022",
    "label": "ESVS Guidelines on Chronic Venous Disease",
    "url": "https://www.ejves.com/article/S1078-5884%2821%2900798-6/fulltext",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "eular-ra-2025": {
    "id": "eular-ra-2025",
    "label": "EULAR Recommendations for Rheumatoid Arthritis Management",
    "url": "https://ard.bmj.com/content/early/2025/03/11/ard-2024-226766",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "european-trauma-bleeding-2023": {
    "id": "european-trauma-bleeding-2023",
    "label": "Task Force for Advanced Bleeding Care in Trauma - The European guideline on management of major bleeding and coagulopathy following trauma: sixth edition",
    "url": "https://link.springer.com/article/10.1186/s13054-023-04327-7",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "figo-gtd-2025": {
    "id": "figo-gtd-2025",
    "label": "International Federation of Gynecology and Obstetrics - Diagnosis and management of gestational trophoblastic disease: 2025 update",
    "url": "https://pubmed.ncbi.nlm.nih.gov/40631439/",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "gina_2026": {
    "id": "gina_2026",
    "label": "GINA Global Strategy for Asthma 2026",
    "url": "https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "gold-copd-2026": {
    "id": "gold-copd-2026",
    "label": "Global Initiative for Chronic Obstructive Lung Disease - Global Strategy for Prevention, Diagnosis and Management of COPD: 2026 Report",
    "url": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-REPORT-2026-v1.3-8Dec2025_WMV2.pdf",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "hse-ectopic-pregnancy-2024": {
    "id": "hse-ectopic-pregnancy-2024",
    "label": "Health Service Executive Ireland and Institute of Obstetricians and Gynaecologists - National Clinical Practice Guideline: Diagnosis and Management of Ectopic Pregnancy",
    "url": "https://www.hse.ie/eng/about/who/acute-hospitals-division/woman-infants/clinical-guidelines/the-diagnosis-and-management-of-ectopic-pregnancy-2024-.pdf",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "idsa-ssti-2014": {
    "id": "idsa-ssti-2014",
    "label": "Infectious Diseases Society of America - Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections",
    "url": "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
    "tahun": 2014,
    "jenis": "evidence_internasional"
  },
  "ihs-migraine-2024": {
    "id": "ihs-migraine-2024",
    "label": "International Headache Society - Global Practice Recommendations for Migraine",
    "url": "https://ihs-headache.org/en/resources/guidelines/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "iwgdf-idsa-dfi-2023": {
    "id": "iwgdf-idsa-dfi-2023",
    "label": "International Working Group on the Diabetic Foot and Infectious Diseases Society of America - IWGDF/IDSA Guidelines on the Diagnosis and Treatment of Diabetes-Related Foot Infections",
    "url": "https://www.idsociety.org/practice-guideline/diabetic-foot-infections/",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "jhs-headache-2025": {
    "id": "jhs-headache-2025",
    "label": "Japanese Headache Society - Clinical Practice Guideline for Headache Disorders",
    "url": "https://onlinelibrary.wiley.com/doi/full/10.1111/ncn3.70042",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "kdigo-ckd-2024": {
    "id": "kdigo-ckd-2024",
    "label": "Kidney Disease: Improving Global Outcomes - KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease",
    "url": "https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "kemenkes-antimicrobial-2021": {
    "id": "kemenkes-antimicrobial-2021",
    "label": "Kementerian Kesehatan Republik Indonesia - Peraturan Menteri Kesehatan Nomor 28 Tahun 2021 tentang Pedoman Penggunaan Antibiotik",
    "url": "https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-28-tahun-2021",
    "tahun": 2021,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-disease-control-2026": {
    "id": "kemenkes-disease-control-2026",
    "label": "Kementerian Kesehatan Republik Indonesia - Peraturan Menteri Kesehatan Nomor 3 Tahun 2026 tentang Penanggulangan Penyakit",
    "url": "https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-3-tahun-2026",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-gizi-buruk-2020": {
    "id": "kemenkes-gizi-buruk-2020",
    "label": "Kementerian Kesehatan Republik Indonesia - Pedoman Pencegahan dan Tatalaksana Gizi Buruk pada Balita",
    "url": "https://repository.kemkes.go.id/book/186",
    "tahun": 2020,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-hiv-ims-2022": {
    "id": "kemenkes-hiv-ims-2022",
    "label": "Kementerian Kesehatan Republik Indonesia - Lampiran Permenkes Nomor 23 Tahun 2022 tentang Pedoman Penanggulangan HIV, AIDS, dan Infeksi Menular Seksual",
    "url": "https://jdih.kemkes.go.id/storage/documents/pdfs/2022permenkes023.pdf",
    "tahun": 2022,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-ilp-tb-contact-2023": {
    "id": "kemenkes-ilp-tb-contact-2023",
    "label": "Kementerian Kesehatan Republik Indonesia - Petunjuk Teknis Integrasi Pelayanan Kesehatan Primer",
    "url": "https://kesprimkom.kemkes.go.id/konten/146/176/0/nomor-hk-01-07-menkes-2015-2023",
    "tahun": 2023,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-keswa-fktp-2020": {
    "id": "kemenkes-keswa-fktp-2020",
    "label": "Direktorat Pencegahan dan Pengendalian Masalah Kesehatan Jiwa dan Napza, Kementerian Kesehatan Republik Indonesia - Pedoman Penyelenggaraan Kesehatan Jiwa di Fasilitas Kesehatan Tingkat Pertama",
    "url": "https://ayosehat.kemkes.go.id/buku-pedoman-penyelenggaraan-kesehatan-jiwa-di-fasilitas-kesehatan-tingkat-pertama",
    "tahun": 2020,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-malaria-2024": {
    "id": "kemenkes-malaria-2024",
    "label": "KMK 1988/2024 - Peta Jalan Eliminasi Malaria 2025-2045",
    "url": "https://malaria.kemkes.go.id/sites/default/files/2025-03/20250219100417KMK%20No%20HK%2001%2007%20MENKES%201988%202024%20ttg%20Peta%20Jalan%20Eliminasi%20Malaria%20dan%20Pencegahan%20Penularan%20Kembali%20di%20Indonesia%20Th%202025%202045%20signed.pdf",
    "tahun": 2024,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-meningokokus-2023": {
    "id": "kemenkes-meningokokus-2023",
    "label": "Kementerian Kesehatan Republik Indonesia - Panduan Deteksi dan Respon Penyakit Meningitis Meningokokus",
    "url": "https://infeksiemerging.kemkes.go.id/document/panduan-deteksi-dan-respon-meningitis-meningokokus/view",
    "tahun": 2023,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-mtbs-diare": {
    "id": "kemenkes-mtbs-diare",
    "label": "Kemenkes - MTBS: Rencana Terapi Diare Anak",
    "url": "https://keslan.kemkes.go.id/view_artikel/737/diare-tanda-gejala-dan-cara-mengatasinya",
    "tahun": 2022,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-p2-action-plan-2025": {
    "id": "kemenkes-p2-action-plan-2025",
    "label": "Kementerian Kesehatan Republik Indonesia - Rencana Aksi Program Direktorat Jenderal Penanggulangan Penyakit Tahun 2025-2029",
    "url": "https://bbkkmakassar.kemkes.go.id/assets/files/RAP_Ditjen_Penanggulangan_Penyakit_Tahun_2025-2029.pdf",
    "tahun": 2025,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-penanggulangan-penyakit-2026": {
    "id": "kemenkes-penanggulangan-penyakit-2026",
    "label": "Permenkes 3/2026 - Penanggulangan Penyakit",
    "url": "https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-3-tahun-2026",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-pmt-lokal-2025": {
    "id": "kemenkes-pmt-lokal-2025",
    "label": "Direktorat Jenderal Kesehatan Primer dan Komunitas, Kementerian Kesehatan Republik Indonesia - Petunjuk Teknis Pemberian Makanan Tambahan Berbahan Pangan Lokal bagi Ibu Hamil dan Balita",
    "url": "https://kesprimkom.kemkes.go.id/konten/178/178/0/nomor-hk-02-02-b-576-2025-tentang-petunjuk-teknis-pemberian-makanan-tambahan-berbahan-pangan-lokal-bagi-ibu-hamil-dan-balita-bermasalah-gizi",
    "tahun": 2025,
    "jenis": "pedoman_indonesia"
  },
  "kemenkes-tb-so-2025": {
    "id": "kemenkes-tb-so-2025",
    "label": "Kemenkes - Juknis Penatalaksanaan TB Sensitif Obat 2025",
    "url": "https://p2.kemkes.go.id/juknis-tb-so/",
    "tahun": 2025,
    "jenis": "pedoman_indonesia"
  },
  "merck-nasal-infections-2025": {
    "id": "merck-nasal-infections-2025",
    "label": "Merck Manual Professional Edition - Bacterial Nasal Infections",
    "url": "https://www.merckmanuals.com/professional/ear-nose-and-throat-disorders/nose-and-paranasal-sinus-disorders/bacterial-nasal-infections",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "niddk-lactose-intolerance-2018": {
    "id": "niddk-lactose-intolerance-2018",
    "label": "NIDDK - Diagnosis and Management of Lactose Intolerance",
    "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/lactose-intolerance",
    "tahun": 2018,
    "jenis": "evidence_internasional"
  },
  "nih-riboflavin-2022": {
    "id": "nih-riboflavin-2022",
    "label": "US National Institutes of Health, Office of Dietary Supplements - Riboflavin: Fact Sheet for Health Professionals",
    "url": "https://ods.od.nih.gov/factsheets/Riboflavin-HealthProfessional/",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "nih-zinc-2026": {
    "id": "nih-zinc-2026",
    "label": "US National Institutes of Health, Office of Dietary Supplements - Zinc: Fact Sheet for Health Professionals",
    "url": "https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "permenkes-kespro-2025": {
    "id": "permenkes-kespro-2025",
    "label": "Permenkes 2/2025 - Upaya Kesehatan Reproduksi",
    "url": "https://kesprimkom.kemkes.go.id/modul/unduhan/90",
    "tahun": 2025,
    "jenis": "pedoman_indonesia"
  },
  "pmk-spm-2024": {
    "id": "pmk-spm-2024",
    "label": "Permenkes 6/2024 - Standar Teknis SPM Kesehatan",
    "url": "https://jdih.kemkes.go.id/storage/documents/pdfs/2024permenkes006.pdf",
    "tahun": 2024,
    "jenis": "pedoman_indonesia"
  },
  "pnpk_epilepsi_2026": {
    "id": "pnpk_epilepsi_2026",
    "label": "PNPK Tata Laksana Epilepsi Dewasa 2026",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1776933600_244772.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk_pregnancy_complications_2017": {
    "id": "pnpk_pregnancy_complications_2017",
    "label": "KMK 91/2017 - PNPK Tata Laksana Komplikasi Kehamilan",
    "url": "https://www.kemkes.go.id/app_asset/file_content_download/17012281586566ae7eec8862.58707574.pdf",
    "tahun": 2017,
    "jenis": "pedoman_indonesia"
  },
  "pnpk_stroke_2026": {
    "id": "pnpk_stroke_2026",
    "label": "KMK 304/2026 - PNPK Tata Laksana Stroke",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1780387545_996111.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk_trauma_2017": {
    "id": "pnpk_trauma_2017",
    "label": "KMK 132/2017 - PNPK Tata Laksana Trauma",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan_1610422327_714480.pdf",
    "tahun": 2017,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-batu-saluran-kemih": {
    "id": "pnpk-batu-saluran-kemih",
    "label": "HK.01.07/MENKES/1560/2022 - PNPK batu-saluran-kemih",
    "url": "https://kemkes.go.id/app_asset/file_content_download/170009556165556649b5ce67.54377142.pdf",
    "tahun": 2022,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-cedera-otak-traumatik-2022": {
    "id": "pnpk-cedera-otak-traumatik-2022",
    "label": "HK.01.07/MENKES/1600/2022 - PNPK Tata Laksana Cedera Otak Traumatik",
    "url": "https://www.kemkes.go.id/app_asset/file_content_download/1700096211655568d31f7cd8.56572518.pdf",
    "tahun": 2022,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-dermatitis-seboroik": {
    "id": "pnpk-dermatitis-seboroik",
    "label": "HK.01.07/MENKES/213/2019 - PNPK 2019 - Tata Laksana Dermatitis Seboroik",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17001200356555c5e3e62cd4.19933668.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-dm-anak-2024": {
    "id": "pnpk-dm-anak-2024",
    "label": "HK.01.07/MENKES/2009/2024 - PNPK Tata Laksana Diabetes Melitus pada Anak",
    "url": "https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/2024kepmenkes2009.pdf",
    "tahun": 2024,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-dm-tipe2-dewasa-2026": {
    "id": "pnpk-dm-tipe2-dewasa-2026",
    "label": "KMK 302/2026 - PNPK Diabetes Melitus Tipe 2 Dewasa",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1777518085_672976.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-dm2-2026": {
    "id": "pnpk-dm2-2026",
    "label": "KMK 302/2026 - PNPK Diabetes Melitus Tipe 2 Dewasa",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1777518085_672976.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-epilepsi-anak": {
    "id": "pnpk-epilepsi-anak",
    "label": "HK.01.07/MENKES/367/2017 - PNPK 2017 - Tata Laksana Epilepsi Pada Anak",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012284626566afae5c5401.03284559.pdf",
    "tahun": 2017,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-hepatitis-b": {
    "id": "pnpk-hepatitis-b",
    "label": "HK.01.07/MENKES/322/2019 - PNPK 2019 - Tata Laksana Hepatitis B",
    "url": "https://kemkes.go.id/app_asset/file_content_download/1700729426655f1252948853.94688478.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-hipertensi-2026": {
    "id": "pnpk-hipertensi-2026",
    "label": "KMK 303/2026 - PNPK Hipertensi pada Dewasa",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1780387327_362636.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-hipertensi-dewasa-2026": {
    "id": "pnpk-hipertensi-dewasa-2026",
    "label": "KMK 303/2026 - PNPK Hipertensi pada Dewasa",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1780387327_362636.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-hiv-2019": {
    "id": "pnpk-hiv-2019",
    "label": "HK.01.07/MENKES/90/2019 - PNPK Tata Laksana HIV",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan_1610423733_374785.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-infeksi-intraabdominal": {
    "id": "pnpk-infeksi-intraabdominal",
    "label": "HK.01.07/MENKES/359/2017 - PNPK infeksi-intraabdominal",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012286006566b038cbaaf7.32814762.pdf",
    "tahun": 2017,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-infeksi-saluran-kemih": {
    "id": "pnpk-infeksi-saluran-kemih",
    "label": "HK.01.07/MENKES/762/2025 - Pedoman Nasional Pelayanan Klinis (PNPK) Tata Laksana Infeksi Saluran Kemih",
    "url": "https://kemkes.go.id/app_asset/file_content_download/176214282969082a6d56e2e0.90364057.pdf",
    "tahun": 2025,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-isk-2025": {
    "id": "pnpk-isk-2025",
    "label": "KMK 762/2025 - PNPK Infeksi Saluran Kemih",
    "url": "https://jdih.kemkes.go.id/documents/keputusan-menteri-kesehatan-nomor-hk0107menkes7622025",
    "tahun": 2025,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-katarak-dewasa-2026": {
    "id": "pnpk-katarak-dewasa-2026",
    "label": "HK.01.07/MENKES/67/2026 - PNPK Tatalaksana Katarak pada Dewasa",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1776933479_335376.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-komplikasi-kehamilan": {
    "id": "pnpk-komplikasi-kehamilan",
    "label": "KEPMENKES RI Nomor HK.01.07/MENKES/91/2017 - PNPK 2017 - Tata Laksana Komplikasi Kehamilan",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012281586566ae7eec8862.58707574.pdf",
    "tahun": 2017,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-kusta": {
    "id": "pnpk-kusta",
    "label": "Keputusan Menteri Kesehatan Republik Indonesia Nomor HK.01.07/MENKES/308/2019 tentang Pedoman Nasional Pelayanan Kedokteran Tata Laksana Kusta - PNPK kusta",
    "url": "https://kemkes.go.id/app_asset/file_content_download/1701156043656594cb42cf52.71103349.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-luka-bakar-2019": {
    "id": "pnpk-luka-bakar-2019",
    "label": "HK.01.07/MENKES/555/2019 - PNPK Tata Laksana Luka Bakar",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan_1610415947_843237.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-omsk": {
    "id": "pnpk-omsk",
    "label": "HK.01.07/MENKES/350/2018 (catatan: header halaman Lampiran pada dokumen ini secara internal tertulis NOMOR HK.01.07/MENKES/2345/2018 — kemungkinan artefak template/redaksional dokumen sumber; nomor pada diktum Keputusan di halaman sampul, HK.01.07/MENKES/350/2018, digunakan sebagai rujukan utama) - PNPK 2018 - Tata Laksana Otitis Media Supuratif Kronik (OMSK)",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012261426566a69ee78957.36532033.pdf",
    "tahun": 2018,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-penyakit-ginjal-kronik": {
    "id": "pnpk-penyakit-ginjal-kronik",
    "label": "KEPUTUSAN MENTERI KESEHATAN REPUBLIK INDONESIA NOMOR HK.01.07/MENKES/1634/2023 TENTANG PEDOMAN NASIONAL PELAYANAN KEDOKTERAN TATA LAKSANA PENYAKIT GINJAL KRONIK - PNPK penyakit-ginjal-kronik",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17019170696571318d16eff8.41286905.pdf",
    "tahun": 2023,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-perdarahan-saluran-cerna": {
    "id": "pnpk-perdarahan-saluran-cerna",
    "label": "HK.01.07/MENKES/2162/2023 - PNPK 2023 - Tata Laksana Perdarahan Saluran Cerna",
    "url": "https://kemkes.go.id/app_asset/file_content_download/1704938290659f4b329345f4.01717160.pdf",
    "tahun": 2023,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-pneumonia-dewasa-2023": {
    "id": "pnpk-pneumonia-dewasa-2023",
    "label": "HK.01.07/MENKES/2147/2023 - PNPK Tata Laksana Pneumonia pada Dewasa",
    "url": "https://kemkes.go.id/id/pnpk-2023---tata-laksana-pneumonia-pada-dewasa",
    "tahun": 2023,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-ppok": {
    "id": "pnpk-ppok",
    "label": "HK.01.07/MENKES/687/2019 - PNPK ppok",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17011618646565ab88a3c586.54879411.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-retinopati-diabetika": {
    "id": "pnpk-retinopati-diabetika",
    "label": "HK.01.07/MENKES/1914/2023 - PNPK 2023 - Tata Laksana Retinopati Diabetika",
    "url": "https://kemkes.go.id/app_asset/file_content_download/16998447006551925ccaae04.63843720.pdf",
    "tahun": 2023,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-sepsis-anak": {
    "id": "pnpk-sepsis-anak",
    "label": "HK.01.07/MENKES/4722/2021 - PNPK 2021 - Tata Laksana Sepsis Pada Anak",
    "url": "https://kemkes.go.id/app_asset/file_content_download/1700107231655593df097836.23587693.pdf",
    "tahun": 2021,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-sindroma-koroner-akut": {
    "id": "pnpk-sindroma-koroner-akut",
    "label": "KEPMENKES RI NOMOR HK.01.07/MENKES/675/2019 - PNPK Tata Laksana Sindroma Koroner Akut",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012245296566a05128fce1.82988449.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-sirosis-hati": {
    "id": "pnpk-sirosis-hati",
    "label": "HK.01.07/MENKES/778/2025 - PNPK 2025 - Tata Laksana Sirosis Hati pada Dewasa",
    "url": "https://kemkes.go.id/app_asset/file_content_download/176214276369082a2b17d039.42472492.pdf",
    "tahun": 2025,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-stroke-2026": {
    "id": "pnpk-stroke-2026",
    "label": "KMK 304/2026 - PNPK Tata Laksana Stroke",
    "url": "https://keslan.kemkes.go.id/unduhan/fileunduhan1780387545_996111.pdf",
    "tahun": 2026,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-stunting": {
    "id": "pnpk-stunting",
    "label": "HK.01.07/MENKES/1928/2022 - PNPK 2022 - Tata Laksana Stunting",
    "url": "https://kemkes.go.id/app_asset/file_content_download/170009660765556a5fd08ea8.07048432.pdf",
    "tahun": 2022,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-talasemia-2018": {
    "id": "pnpk-talasemia-2018",
    "label": "HK.01.07/MENKES/1/2018 - PNPK Tata Laksana Talasemia",
    "url": "https://kemkes.go.id/id/media/list/pedoman/pedoman-nasional-pelayanan-kedokteran-pnpk/pnpk-2018",
    "tahun": 2018,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-tonsilitis": {
    "id": "pnpk-tonsilitis",
    "label": "HK.01.07/MENKES/157/2018 - PNPK tonsilitis",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012266166566a878c14712.29105429.pdf",
    "tahun": 2018,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-trauma": {
    "id": "pnpk-trauma",
    "label": "HK.01.07/MENKES/132/2017 - Pedoman Nasional Pelayanan Kedokteran (PNPK) Tata Laksana Trauma",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012291786566b27adad479.88983894.pdf",
    "tahun": 2017,
    "jenis": "pedoman_indonesia"
  },
  "pnpk-tuberkulosis": {
    "id": "pnpk-tuberkulosis",
    "label": "HK.01.07/MENKES/755/2019 - PNPK 2019 - Tata Laksana Tuberkulosis",
    "url": "https://kemkes.go.id/app_asset/file_content_download/17012248006566a1601671d4.28271429.pdf",
    "tahun": 2019,
    "jenis": "pedoman_indonesia"
  },
  "poison-control-button-battery": {
    "id": "poison-control-button-battery",
    "label": "National Capital Poison Center - Button battery ingestion triage and treatment guideline (living web guideline; accessed 2026)",
    "url": "https://www.poison.org/battery/guideline",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "ppk-fktp-1936-2022": {
    "id": "ppk-fktp-1936-2022",
    "label": "KMK 1936/2022 - perubahan PPK Dokter di FKTP",
    "url": "https://jdih.kemkes.go.id/storage/documents/pdfs/2022kepmenkes1936.pdf",
    "tahun": 2022,
    "jenis": "pedoman_indonesia"
  },
  "queensland-csom-2025": {
    "id": "queensland-csom-2025",
    "label": "Queensland Health - Perforated eardrum/chronic suppurative otitis media: Clinical Prioritisation Criteria",
    "url": "https://www.health.qld.gov.au/cpc/ent/perforated-eardrumchronic-suppurative-otitis",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "queensland-nasal-foreign-body-2025": {
    "id": "queensland-nasal-foreign-body-2025",
    "label": "Queensland Paediatric Guideline - Foreign Body in the Nose",
    "url": "https://www.childrens.health.qld.gov.au/health-a-to-z/foreign-body-in-the-nose-emergency-management-in-children",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "racgp-ophthalmic-trauma-2026": {
    "id": "racgp-ophthalmic-trauma-2026",
    "label": "Royal Australian College of General Practitioners - Ophthalmic trauma: First-line management in primary care",
    "url": "https://www1.racgp.org.au/getattachment/0445a2c2-26d7-482d-a7d6-ffbb58f659c0/Ophthalmic-trauma.aspx",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "rch-febrile-seizure-2026": {
    "id": "rch-febrile-seizure-2026",
    "label": "Royal Children Hospital Melbourne - Febrile Seizure Guideline",
    "url": "https://www.rch.org.au/clinicalguide/guideline_index/Febrile_seizure/",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "rcht-paediatric-forearm-fracture-2025": {
    "id": "rcht-paediatric-forearm-fracture-2025",
    "label": "Royal Cornwall Hospitals - Early Management of Paediatric Forearm Fractures",
    "url": "https://doclibrary-rcht.cornwall.nhs.uk/DocumentsLibrary/RoyalCornwallHospitalsTrust/Clinical/EmergencyDepartment/EarlyManagementofPaediatricForearmFracturesintheEmergencyDepartmentClinicalGuideline.pdf",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "rcog-hyperemesis-69-2024": {
    "id": "rcog-hyperemesis-69-2024",
    "label": "Royal College of Obstetricians and Gynaecologists - The Management of Nausea and Vomiting in Pregnancy and Hyperemesis Gravidarum (Green-top Guideline No. 69)",
    "url": "https://doi.org/10.1111/1471-0528.17739",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "rcog-placenta-praevia-27a-2026": {
    "id": "rcog-placenta-praevia-27a-2026",
    "label": "Royal College of Obstetricians and Gynaecologists - Placenta Praevia and Placenta Accreta: Diagnosis and Management (Green-top Guideline No. 27a)",
    "url": "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/placenta-praevia-and-placenta-accreta-diagnosis-and-management-green-top-guideline-no-27a/",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "rcuk-anaphylaxis-2025": {
    "id": "rcuk-anaphylaxis-2025",
    "label": "Resuscitation Council UK and European Resuscitation Council - Resuscitation Guidelines 2025: Special circumstances - anaphylaxis",
    "url": "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/special-circumstances-guidelines",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "sis-iai-2024": {
    "id": "sis-iai-2024",
    "label": "Surgical Infection Society - The Surgical Infection Society Guidelines on the Management of Intra-Abdominal Infection: 2024 Update",
    "url": "https://doi.org/10.1089/sur.2024.137",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "tif-thalassaemia-2021": {
    "id": "tif-thalassaemia-2021",
    "label": "Thalassaemia International Federation Guidelines, fourth edition",
    "url": "https://thalassaemia.org.cy/publications/tif-publications/guidelines-for-the-management-of-transfusion-dependent-thalassaemia-4th-edition-2021-v2/",
    "tahun": 2021,
    "jenis": "evidence_internasional"
  },
  "vadod-obesity-2025": {
    "id": "vadod-obesity-2025",
    "label": "VA/DoD - Management of Adult Overweight and Obesity",
    "url": "https://www.healthquality.va.gov/guidelines/CD/obesity/",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "vadod-osteoarthritis-2026": {
    "id": "vadod-osteoarthritis-2026",
    "label": "VA/DoD - Non-Surgical Management of Hip and Knee Osteoarthritis",
    "url": "https://www.healthquality.va.gov/guidelines/CD/OA/index.asp",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "who_arboviral_2025": {
    "id": "who_arboviral_2025",
    "label": "WHO Guidelines for Clinical Management of Arboviral Diseases 2025",
    "url": "https://www.who.int/publications/i/item/9789240111110",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who_bec": {
    "id": "who_bec",
    "label": "WHO/ICRC Basic Emergency Care",
    "url": "https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care/bec",
    "tahun": 2018,
    "jenis": "evidence_internasional"
  },
  "who_preeclampsia_2025": {
    "id": "who_preeclampsia_2025",
    "label": "WHO Pre-eclampsia Fact Sheet and Recommendations 2025",
    "url": "https://www.who.int/news-room/fact-sheets/detail/pre-eclampsia",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-abortion-care-2025": {
    "id": "who-abortion-care-2025",
    "label": "WHO - Abortion Care Guideline, second edition",
    "url": "https://www.who.int/publications/i/item/9789240104204",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-bronchiolitis-2026": {
    "id": "who-bronchiolitis-2026",
    "label": "World Health Organization - WHO consolidated guidelines for the management of common childhood illness: asthma and bronchiolitis",
    "url": "https://www.who.int/publications/b/82992",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "who-candidiasis-2025": {
    "id": "who-candidiasis-2025",
    "label": "WHO - Candidiasis Clinical Overview",
    "url": "https://www.who.int/news-room/fact-sheets/detail/candidiasis-%28yeast-infection%29",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-cataract-quality-2026": {
    "id": "who-cataract-quality-2026",
    "label": "World Health Organization - Summary of recommendations for quality of care in cataract surgery management",
    "url": "https://www.who.int/publications/i/item/9789240121089",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "who-child-pneumonia-diarrhoea-2024": {
    "id": "who-child-pneumonia-diarrhoea-2024",
    "label": "WHO - Pneumonia and Diarrhoea in Children up to 10 Years",
    "url": "https://www.who.int/publications/i/item/9789240103412",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-filariasis-2024": {
    "id": "who-filariasis-2024",
    "label": "World Health Organization - Lymphatic filariasis fact sheet",
    "url": "https://www.who.int/news-room/fact-sheets/detail/lymphatic-filariasis",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-food-safety-2024": {
    "id": "who-food-safety-2024",
    "label": "WHO - Food Safety and Foodborne Disease",
    "url": "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-haemoglobin-cutoffs-2024": {
    "id": "who-haemoglobin-cutoffs-2024",
    "label": "World Health Organization - Guideline on haemoglobin cutoffs to define anaemia in individuals and populations",
    "url": "https://www.who.int/publications/i/item/9789240088542",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-hbv-2024": {
    "id": "who-hbv-2024",
    "label": "World Health Organization - Guidelines for the prevention, diagnosis, care and treatment for people with chronic hepatitis B infection",
    "url": "https://www.who.int/publications/i/item/9789240090903",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-hepatitis-a-2026": {
    "id": "who-hepatitis-a-2026",
    "label": "World Health Organization - Hepatitis A fact sheet",
    "url": "https://www.who.int/news-room/fact-sheets/detail/hepatitis-a",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "who-hiv-clinical-2025": {
    "id": "who-hiv-clinical-2025",
    "label": "World Health Organization - WHO updated recommendations on HIV clinical management",
    "url": "https://www.who.int/publications/i/item/9789240119468",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-icd11-cddr-2024": {
    "id": "who-icd11-cddr-2024",
    "label": "World Health Organization - Clinical descriptions and diagnostic requirements for ICD-11 mental, behavioural and neurodevelopmental disorders",
    "url": "https://www.who.int/publications/i/item/9789240077263",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-icope-eye-2025": {
    "id": "who-icope-eye-2025",
    "label": "WHO ICOPE - Primary Eye Care and Refractive-error Pathways",
    "url": "https://www.who.int/publications/i/item/9789240103726",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-influenza-2024": {
    "id": "who-influenza-2024",
    "label": "WHO Clinical Practice Guidelines for Influenza",
    "url": "https://www.who.int/publications/b/73919",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-leprosy-2018": {
    "id": "who-leprosy-2018",
    "label": "World Health Organization - Guidelines for the diagnosis, treatment and prevention of leprosy",
    "url": "https://www.who.int/publications-detail-redirect/9789290226383",
    "tahun": 2018,
    "jenis": "evidence_internasional"
  },
  "who-low-back-pain-2023": {
    "id": "who-low-back-pain-2023",
    "label": "WHO Guideline for Chronic Primary Low Back Pain",
    "url": "https://www.who.int/publications/i/item/9789240081789",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "who-malaria-2025": {
    "id": "who-malaria-2025",
    "label": "WHO Guidelines for Malaria",
    "url": "https://www.who.int/publications/i/item/guidelines-for-malaria",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-maternal-health-2025": {
    "id": "who-maternal-health-2025",
    "label": "WHO - Recommendations on Maternal Health, second edition",
    "url": "https://www.who.int/publications/i/item/9789240080591",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-mec-2025": {
    "id": "who-mec-2025",
    "label": "WHO Medical Eligibility Criteria for Contraceptive Use, sixth edition",
    "url": "https://www.who.int/publications/i/item/9789240115583",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-meningitis-2025": {
    "id": "who-meningitis-2025",
    "label": "World Health Organization - WHO guidelines on meningitis diagnosis, treatment and care",
    "url": "https://www.who.int/publications/i/item/9789240108042",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-mhgap-2023": {
    "id": "who-mhgap-2023",
    "label": "WHO mhGAP Guideline, third edition",
    "url": "https://www.who.int/publications/i/item/9789240084278",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "who-oral-health-2022": {
    "id": "who-oral-health-2022",
    "label": "WHO Global Oral Health Status Report",
    "url": "https://www.who.int/publications/i/item/9789240061484",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "who-postnatal-2022": {
    "id": "who-postnatal-2022",
    "label": "WHO - Maternal and Newborn Care for a Positive Postnatal Experience",
    "url": "https://www.who.int/publications/i/item/9789240045989",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "who-ringworm-2025": {
    "id": "who-ringworm-2025",
    "label": "WHO - Ringworm (Tinea) Clinical Overview",
    "url": "https://www.who.int/news-room/fact-sheets/detail/ringworm-%28tinea%29",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-sbi-young-infants-2024": {
    "id": "who-sbi-young-infants-2024",
    "label": "World Health Organization - WHO recommendations for management of serious bacterial infections in infants aged 0-59 days",
    "url": "https://www.who.int/publications/i/item/9789240102903/",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-scabies-2023": {
    "id": "who-scabies-2023",
    "label": "WHO - Scabies: Recognition, Treatment, and Control",
    "url": "https://www.who.int/news-room/fact-sheets/detail/scabies",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "who-schistosomiasis-2026": {
    "id": "who-schistosomiasis-2026",
    "label": "World Health Organization - Schistosomiasis fact sheet",
    "url": "https://www.who.int/news-room/fact-sheets/detail/schistosomiasis",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "who-skin-primary-2026": {
    "id": "who-skin-primary-2026",
    "label": "WHO - Skin NTDs and Common Skin Conditions for Front-line Care",
    "url": "https://www.who.int/publications/i/item/9789292800024",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "who-sth-2023": {
    "id": "who-sth-2023",
    "label": "World Health Organization - Soil-transmitted helminth infections fact sheet",
    "url": "https://www.who.int/news-room/fact-sheets/detail/soil-transmitted-helminth-infections",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "who-sti-2024": {
    "id": "who-sti-2024",
    "label": "World Health Organization - Updated recommendations for Neisseria gonorrhoeae, Chlamydia trachomatis, and Treponema pallidum treatment, syphilis testing and partner services",
    "url": "https://www.who.int/publications/b/73135",
    "tahun": 2024,
    "jenis": "evidence_internasional"
  },
  "who-taeniasis-2022": {
    "id": "who-taeniasis-2022",
    "label": "World Health Organization - Taeniasis/cysticercosis fact sheet",
    "url": "https://www.who.int/news-room/fact-sheets/detail/taeniasis-cysticercosis",
    "tahun": 2022,
    "jenis": "evidence_internasional"
  },
  "who-tb-diagnosis-2025": {
    "id": "who-tb-diagnosis-2025",
    "label": "World Health Organization - WHO consolidated guidelines on tuberculosis: Module 3 - diagnosis",
    "url": "https://www.who.int/publications/i/item/9789240107984",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-tb-treatment-care-2025": {
    "id": "who-tb-treatment-care-2025",
    "label": "World Health Organization - WHO consolidated guidelines on tuberculosis: Module 4 - treatment and care",
    "url": "https://www.who.int/publications/i/item/9789240107243",
    "tahun": 2025,
    "jenis": "evidence_internasional"
  },
  "who-tetanus-2026": {
    "id": "who-tetanus-2026",
    "label": "World Health Organization - Tetanus fact sheet",
    "url": "https://www.who.int/news-room/fact-sheets/detail/tetanus",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "who-wasting-2023": {
    "id": "who-wasting-2023",
    "label": "World Health Organization - WHO guideline on the prevention and management of wasting and nutritional oedema",
    "url": "https://www.who.int/publications/i/item/9789240082830/",
    "tahun": 2023,
    "jenis": "evidence_internasional"
  },
  "wses-appendicitis-2025": {
    "id": "wses-appendicitis-2025",
    "label": "World Society of Emergency Surgery - Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the WSES Jerusalem Guidelines",
    "url": "https://jamanetwork.com/journals/jamasurgery/article-abstract/2844195",
    "tahun": 2026,
    "jenis": "evidence_internasional"
  },
  "wses-asbo-2018": {
    "id": "wses-asbo-2018",
    "label": "World Society of Emergency Surgery ASBO Working Group - Bologna guidelines for diagnosis and management of adhesive small bowel obstruction: 2017 update",
    "url": "https://link.springer.com/article/10.1186/s13017-018-0185-2",
    "tahun": 2018,
    "jenis": "evidence_internasional"
  },
  "wses-cholecystitis-2020": {
    "id": "wses-cholecystitis-2020",
    "label": "WSES Guidelines for Acute Calculous Cholecystitis",
    "url": "https://wjes.biomedcentral.com/articles/10.1186/s13017-020-00336-x",
    "tahun": 2020,
    "jenis": "evidence_internasional"
  },
  "wses-complicated-hernia-2017": {
    "id": "wses-complicated-hernia-2017",
    "label": "World Society of Emergency Surgery - 2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias",
    "url": "https://link.springer.com/article/10.1186/s13017-017-0149-y",
    "tahun": 2017,
    "jenis": "evidence_internasional"
  }
} as const satisfies Record<string, Omit<SumberKlinis, 'cakupan' | 'catatan'>>

export const CLINICAL_SOURCE_ASSIGNMENTS = {
  "anemia_defisiensi_bumil": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-maternal-health-2025",
      "cakupan": "langsung"
    }
  ],
  "apendisitis_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "wses-appendicitis-2025",
      "cakupan": "langsung"
    }
  ],
  "askariasis": [
    {
      "sourceId": "kemenkes-penanggulangan-penyakit-2026",
      "cakupan": "terkait"
    },
    {
      "sourceId": "who-sth-2023",
      "cakupan": "langsung"
    }
  ],
  "asma_eksaserbasi_berat_anak": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "gina_2026",
      "cakupan": "langsung"
    }
  ],
  "asma_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "gina_2026",
      "cakupan": "langsung"
    }
  ],
  "benda_asing_hidung_anak": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "queensland-nasal-foreign-body-2025",
      "cakupan": "langsung"
    }
  ],
  "bronkitis_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Tidak ada bab diagnosis yang dipetakan langsung; dokumen ini hanya menjadi batas bawah praktik FKTP."
    },
    {
      "sourceId": "cdc-adult-outpatient-2024",
      "cakupan": "langsung"
    }
  ],
  "demam_tifoid": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-typhoid-2024",
      "cakupan": "langsung"
    }
  ],
  "dengue_df": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who_arboviral_2025",
      "cakupan": "langsung"
    }
  ],
  "diare_akut_anak": [
    {
      "sourceId": "kemenkes-mtbs-diare",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-child-pneumonia-diarrhoea-2024",
      "cakupan": "langsung"
    }
  ],
  "diare_akut_bayi_dehidrasi_berat": [
    {
      "sourceId": "kemenkes-mtbs-diare",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-child-pneumonia-diarrhoea-2024",
      "cakupan": "langsung"
    }
  ],
  "disentri_basiler": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-shigella-2024",
      "cakupan": "langsung"
    }
  ],
  "dispepsia_fungsional": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Tidak ada bab diagnosis yang dipetakan langsung; dokumen ini hanya menjadi batas bawah praktik FKTP."
    },
    {
      "sourceId": "bsg-functional-dyspepsia-2022",
      "cakupan": "langsung"
    }
  ],
  "dm_tipe2": [
    {
      "sourceId": "pnpk-dm2-2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ada-diabetes-2026-type1",
      "cakupan": "langsung"
    }
  ],
  "faringitis_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-strep-throat-2025",
      "cakupan": "langsung"
    }
  ],
  "fraktur_terbuka_tibia_stabil": [
    {
      "sourceId": "pnpk_trauma_2017",
      "cakupan": "terkait"
    },
    {
      "sourceId": "acs-orthopaedic-trauma-2022",
      "cakupan": "langsung"
    }
  ],
  "gastritis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "bsg-functional-dyspepsia-2022",
      "cakupan": "terkait"
    }
  ],
  "gerd": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "acg-gerd-2022",
      "cakupan": "langsung"
    }
  ],
  "hemoroid_grade1": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aga-hemorrhoids-2026",
      "cakupan": "langsung"
    }
  ],
  "hipertensi_esensial": [
    {
      "sourceId": "pnpk-hipertensi-2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "esc-hypertension-2024",
      "cakupan": "langsung"
    }
  ],
  "hipoglikemia_ringan_dewasa": [
    {
      "sourceId": "pnpk-dm2-2026",
      "cakupan": "terkait"
    },
    {
      "sourceId": "ada_hypoglycemia_2026",
      "cakupan": "langsung"
    }
  ],
  "ispa_common_cold": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-adult-outpatient-2024",
      "cakupan": "langsung"
    }
  ],
  "jiwa_depresi_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-mhgap-2023",
      "cakupan": "langsung"
    }
  ],
  "jiwa_gangguan_cemas": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK memberi konteks klinis terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "who-mhgap-2023",
      "cakupan": "langsung"
    }
  ],
  "jiwa_insomnia": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "esrs-insomnia-2023",
      "cakupan": "langsung"
    }
  ],
  "jiwa_skizofrenia": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-mhgap-2023",
      "cakupan": "langsung"
    }
  ],
  "kia_abortus_iminens": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cochrane-threatened-miscarriage-2021",
      "cakupan": "langsung"
    }
  ],
  "kia_anc_kehamilan_normal": [
    {
      "sourceId": "pmk-spm-2024",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-postnatal-2022",
      "cakupan": "terkait"
    }
  ],
  "kia_isk_kehamilan": [
    {
      "sourceId": "pnpk-isk-2025",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eau-urological-infections-2026",
      "cakupan": "terkait"
    }
  ],
  "kia_kb_konseling": [
    {
      "sourceId": "permenkes-kespro-2025",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-mec-2025",
      "cakupan": "langsung"
    }
  ],
  "kia_malaria_falsiparum": [
    {
      "sourceId": "kemenkes-malaria-2024",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-malaria-2025",
      "cakupan": "langsung"
    }
  ],
  "kia_preeklampsia_berat": [
    {
      "sourceId": "pnpk_pregnancy_complications_2017",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who_preeclampsia_2025",
      "cakupan": "langsung"
    }
  ],
  "konjungtivitis_bakterial": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "terkait"
    }
  ],
  "kulit_dermatitis_kontak": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "terkait"
    }
  ],
  "kulit_herpes_zoster": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-shingles-2024",
      "cakupan": "langsung"
    }
  ],
  "kulit_kandidiasis_kutis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-candidiasis-2025",
      "cakupan": "langsung"
    }
  ],
  "kulit_morbili": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-measles-2025",
      "cakupan": "langsung"
    }
  ],
  "kulit_pedikulosis_kapitis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-head-lice-2024",
      "cakupan": "langsung"
    }
  ],
  "kulit_pioderma_impetigo": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "idsa-ssti-2014",
      "cakupan": "langsung"
    }
  ],
  "kulit_tinea_korporis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-ringworm-2025",
      "cakupan": "langsung"
    }
  ],
  "kulit_urtikaria_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eaaci-urticaria-2022",
      "cakupan": "langsung"
    }
  ],
  "kulit_varisela": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-varicella-2024",
      "cakupan": "langsung"
    }
  ],
  "kulit_veruka_vulgaris": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "terkait"
    }
  ],
  "lab_ablasio_retina": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "aao-pvd-retinal-breaks-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_abortus_spontan_komplit": [
    {
      "sourceId": "pnpk-komplikasi-kehamilan",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-abortion-care-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_abses_folikel_rambut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "idsa-ssti-2014",
      "cakupan": "langsung"
    }
  ],
  "lab_abses_perianal": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "ascrs-anorectal-abscess-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_abses_peritonsil": [
    {
      "sourceId": "pnpk-tonsilitis",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "chop-peritonsillar-abscess-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_akne_vulgaris_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aad-acne-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_alergi_makanan_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eaaci-food-allergy-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_anafilaksis_makanan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "rcuk-anaphylaxis-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_anemia_berat_perlu_transfusi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-haemoglobin-cutoffs-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_anemia_defisiensi_besi_nonhamil": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aga-ida-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_apendisitis_akut_anak": [
    {
      "sourceId": "pnpk-infeksi-intraabdominal",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "wses-appendicitis-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_astigmatisme_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_benda_asing_esofagus": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "poison-control-button-battery",
      "cakupan": "langsung"
    }
  ],
  "lab_benda_asing_konjungtiva": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "racgp-ophthalmic-trauma-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_blefaritis_anterior": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_bronkiolitis_berat": [
    {
      "sourceId": "pnpk-sepsis-anak",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "who-bronchiolitis-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_buta_senja_defisiensi_vitamin_a": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_cacing_tambang": [
    {
      "sourceId": "kemenkes-disease-control-2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-sth-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_cutaneous_larva_migrans": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_defisiensi_mineral_zinc": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "nih-zinc-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_defisiensi_vitamin_b_kompleks": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "nih-riboflavin-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_dermatitis_atopik_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_dermatitis_kontak_iritan_tangan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_dermatitis_numularis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_dermatitis_perioral": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_dermatitis_popok_iritan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_dermatitis_seboroik_dewasa": [
    {
      "sourceId": "pnpk-dermatitis-seboroik",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_dm_tipe1_stabil_prb": [
    {
      "sourceId": "pnpk-dm-anak-2024",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ada-diabetes-2026-type1",
      "cakupan": "langsung"
    }
  ],
  "lab_edema_paru_akut_hipertensif": [
    {
      "sourceId": "pnpk-hipertensi-dewasa-2026",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "esc-heart-failure-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_efusi_pleura": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "bts-pleural-procedures-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_ektima_tungkai": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "idsa-ssti-2014",
      "cakupan": "langsung"
    }
  ],
  "lab_episkleritis_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_erisipelas_tungkai_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_eritrasma_lipat_paha": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_erupsi_obat_morbiliformis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_filariasis_terkonfirmasi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-disease-control-2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-filariasis-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_fimosis_patologis_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eau-paediatric-urology-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_folikulitis_superfisialis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "idsa-ssti-2014",
      "cakupan": "langsung"
    }
  ],
  "lab_fraktur_tertutup_antebrachii_anak": [
    {
      "sourceId": "pnpk-trauma",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "rcht-paediatric-forearm-fracture-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_furunkel_fluktuatif": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "idsa-ssti-2014",
      "cakupan": "langsung"
    }
  ],
  "lab_furunkel_hidung": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "merck-nasal-infections-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_gagal_jantung_dekompensasi": [
    {
      "sourceId": "pnpk-sindroma-koroner-akut",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "esc-heart-failure-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_gangguan_somatoform": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-keswa-fktp-2020",
      "cakupan": "terkait"
    },
    {
      "sourceId": "who-icd11-cddr-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_gizi_buruk_komplikasi": [
    {
      "sourceId": "pnpk-stunting",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-gizi-buruk-2020",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-wasting-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_gonore_uretritis_pria": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-hiv-ims-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-sti-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_hemoroid_interna_derajat4": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "aga-hemorrhoids-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_hepatitis_a_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-hepatitis-a-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_hepatitis_b_kronik": [
    {
      "sourceId": "pnpk-hepatitis-b",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "who-hbv-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_hernia_inguinalis_inkarserata": [
    {
      "sourceId": "pnpk-infeksi-intraabdominal",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "wses-complicated-hernia-2017",
      "cakupan": "langsung"
    }
  ],
  "lab_herpes_simpleks_labialis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_hidradenitis_supuratif_hurley1": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_hiperemesis_gravidarum_berat": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "rcog-hyperemesis-69-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_hipermetropia": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_hipertiroid_graves": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "ata-hyperthyroidism-2016",
      "cakupan": "langsung"
    }
  ],
  "lab_hiv_tanpa_komplikasi": [
    {
      "sourceId": "pnpk-hiv-2019",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-disease-control-2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-hiv-clinical-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_ileus_obstruktif": [
    {
      "sourceId": "pnpk-infeksi-intraabdominal",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "wses-asbo-2018",
      "cakupan": "langsung"
    }
  ],
  "lab_infeksi_umbilikus_neonatus": [
    {
      "sourceId": "pnpk-sepsis-anak",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-sbi-young-infants-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_influenza_tanpa_komplikasi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-influenza-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_intoleransi_makanan_laktosa": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "niddk-lactose-intolerance-2018",
      "cakupan": "langsung"
    }
  ],
  "lab_kaki_diabetik_infeksi": [
    {
      "sourceId": "pnpk-dm-tipe2-dewasa-2026",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "iwgdf-idsa-dfi-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_kandidiasis_mulut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-candidiasis-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_katarak_matur": [
    {
      "sourceId": "pnpk-katarak-dewasa-2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-cataract-quality-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_kehamilan_ektopik_terganggu_suspek": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "hse-ectopic-pregnancy-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_kejang_demam_sederhana": [
    {
      "sourceId": "pnpk-epilepsi-anak",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "rch-febrile-seizure-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_keracunan_makanan_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-food-safety-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_kolesistitis_akut": [
    {
      "sourceId": "pnpk-infeksi-intraabdominal",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "wses-cholecystitis-2020",
      "cakupan": "langsung"
    }
  ],
  "lab_kolik_ureter_obstruksi": [
    {
      "sourceId": "pnpk-batu-saluran-kemih",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eau-urolithiasis-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_kusta_pausibasiler": [
    {
      "sourceId": "pnpk-kusta",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-leprosy-2018",
      "cakupan": "langsung"
    }
  ],
  "lab_laringitis_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-adult-outpatient-2024",
      "cakupan": "terkait"
    }
  ],
  "lab_leptospirosis_tanpa_komplikasi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-antimicrobial-2021",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-leptospirosis-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_limfadenitis_servikal_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "terkait"
    }
  ],
  "lab_lipoma_lengan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "terkait"
    }
  ],
  "lab_luka_bakar_derajat2_dangkal": [
    {
      "sourceId": "pnpk-luka-bakar-2019",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aci-burn-management-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_mabuk_perjalanan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "cdc-motion-sickness-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_malnutrisi_energi_protein_sedang": [
    {
      "sourceId": "pnpk-stunting",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-pmt-lokal-2025",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-wasting-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_mastitis_laktasi": [
    {
      "sourceId": "pnpk-komplikasi-kehamilan",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-postnatal-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_mastoiditis_akut": [
    {
      "sourceId": "pnpk-omsk",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "childrens-mercy-mastoiditis-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_mata_kering": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_meningitis_bakterial_suspek": [
    {
      "sourceId": "kemenkes-meningokokus-2023",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-meningitis-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_miliaria_rubra": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_miopia_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_mola_hidatidosa": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "figo-gtd-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_moluskum_kontagiosum_anak": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_otitis_media_supuratif_kronik_komplikata": [
    {
      "sourceId": "pnpk-omsk",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "queensland-csom-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_parafimosis_reduksibel": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eau-paediatric-urology-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_parotitis_mumps": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-mumps-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_pedikulosis_pubis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_penyakit_ginjal_kronik_st3b": [
    {
      "sourceId": "pnpk-penyakit-ginjal-kronik",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kdigo-ckd-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_penyakit_radang_panggul_berat": [
    {
      "sourceId": "pnpk-komplikasi-kehamilan",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "cdc-pid-2021",
      "cakupan": "langsung"
    }
  ],
  "lab_perdarahan_gi_atas": [
    {
      "sourceId": "pnpk-perdarahan-saluran-cerna",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "acg-ugib-2021",
      "cakupan": "langsung"
    }
  ],
  "lab_perdarahan_subkonjungtiva": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_peritonitis_generalisata": [
    {
      "sourceId": "pnpk-infeksi-intraabdominal",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "sis-iai-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_pertusis_remaja": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "cdc-pertussis-treatment-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_pielonefritis_tanpa_komplikasi": [
    {
      "sourceId": "pnpk-infeksi-saluran-kemih",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eau-urological-infections-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_pitiriasis_rosea": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_pitiriasis_versikolor": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_plasenta_previa": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "rcog-placenta-praevia-27a-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_pneumonia_komunitas_dewasa": [
    {
      "sourceId": "pnpk-pneumonia-dewasa-2023",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ats-idsa-cap-2019",
      "cakupan": "langsung"
    }
  ],
  "lab_pneumotoraks_spontan": [
    {
      "sourceId": "pnpk-trauma",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "bts-pneumothorax-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_ppok_eksaserbasi_berat": [
    {
      "sourceId": "pnpk-ppok",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "gold-copd-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_presbiopia": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_puting_lecet": [
    {
      "sourceId": "pnpk-komplikasi-kehamilan",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-postnatal-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_puting_tenggelam_laktasi": [
    {
      "sourceId": "pnpk-komplikasi-kehamilan",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-postnatal-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_reaksi_gigitan_serangga": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_retensio_urin_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "eau-male-luts-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_retinopati_diabetik_proliferatif": [
    {
      "sourceId": "pnpk-retinopati-diabetika",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ada-retinopathy-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_rinitis_vasomotor": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "bsaci-rhinitis-2017",
      "cakupan": "langsung"
    }
  ],
  "lab_ruptur_perineum_derajat_1": [
    {
      "sourceId": "pnpk-komplikasi-kehamilan",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-postnatal-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_salpingitis_pid_ringan": [
    {
      "sourceId": "pnpk-komplikasi-kehamilan",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "kemenkes-hiv-ims-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-pid-2021",
      "cakupan": "langsung"
    }
  ],
  "lab_sifilis_primer": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-hiv-ims-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-sti-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_sindrom_duh_genital_servisitis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "kemenkes-hiv-ims-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-cervicitis-2021",
      "cakupan": "langsung"
    }
  ],
  "lab_sirosis_hepatis_dekompensata": [
    {
      "sourceId": "pnpk-sirosis-hati",
      "cakupan": "langsung"
    },
    {
      "sourceId": "easl-decompensated-cirrhosis-2018",
      "cakupan": "langsung"
    }
  ],
  "lab_skistosomiasis_sulteng": [
    {
      "sourceId": "kemenkes-p2-action-plan-2025",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-schistosomiasis-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_skrofuloderma_suspek": [
    {
      "sourceId": "pnpk-tuberkulosis",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-ilp-tb-contact-2023",
      "cakupan": "terkait"
    },
    {
      "sourceId": "who-tb-diagnosis-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_stomatitis_aftosa": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-oral-health-2022",
      "cakupan": "terkait"
    }
  ],
  "lab_strongiloidiasis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "cdc-strongyloides-2024",
      "cakupan": "langsung"
    }
  ],
  "lab_taeniasis_intestinal": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP."
    },
    {
      "sourceId": "who-taeniasis-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_talasemia_beta_mayor_anak": [
    {
      "sourceId": "pnpk-talasemia-2018",
      "cakupan": "langsung"
    },
    {
      "sourceId": "tif-thalassaemia-2021",
      "cakupan": "langsung"
    }
  ],
  "lab_tb_paru_putus_obat_suspek_mdr": [
    {
      "sourceId": "pnpk-tuberkulosis",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "kemenkes-ilp-tb-contact-2023",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-tb-diagnosis-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_tetanus_generalisata_awal": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-tetanus-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_tia_serangan_iskemik_sesaat": [
    {
      "sourceId": "pnpk-stroke-2026",
      "cakupan": "terkait",
      "catatan": "PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik."
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aha-tia-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_tinea_barbae": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_tinea_fasialis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_tinea_kapitis_anak": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_tinea_kruris": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_tinea_manus": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_tinea_pedis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_tinea_unguium_terkonfirmasi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "langsung"
    }
  ],
  "lab_trauma_abdomen_tumpul": [
    {
      "sourceId": "pnpk-trauma",
      "cakupan": "langsung"
    },
    {
      "sourceId": "european-trauma-bleeding-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_trauma_tajam_kulit_kepala": [
    {
      "sourceId": "pnpk-trauma",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who_bec",
      "cakupan": "langsung"
    }
  ],
  "lab_trauma_tumpul_kepala_ringan": [
    {
      "sourceId": "pnpk-cedera-otak-traumatik-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "acep-mtbi-2023",
      "cakupan": "langsung"
    }
  ],
  "lab_trikiasis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "langsung"
    }
  ],
  "lab_ulkus_tungkai_vena": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "esvs-venous-2022",
      "cakupan": "langsung"
    }
  ],
  "lab_vaginitis_kandida": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-vvc-2021",
      "cakupan": "langsung"
    }
  ],
  "lab_vaginosis_bakterialis": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "terkait",
      "catatan": "Bab PPK terkait, bukan padanan diagnosis yang identik."
    },
    {
      "sourceId": "cdc-bv-2021",
      "cakupan": "langsung"
    }
  ],
  "lab_vulnus_laseratum_lengan": [
    {
      "sourceId": "pnpk-trauma",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who_bec",
      "cakupan": "langsung"
    }
  ],
  "lab_vulvitis_iritan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-skin-primary-2026",
      "cakupan": "terkait"
    }
  ],
  "mata_glaukoma_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "terkait"
    }
  ],
  "mata_hordeolum": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "terkait"
    }
  ],
  "mata_konjungtivitis_alergi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-icope-eye-2025",
      "cakupan": "terkait"
    }
  ],
  "mm_artritis_reumatoid": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eular-ra-2025",
      "cakupan": "langsung"
    }
  ],
  "mm_dislipidemia": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "esc-dyslipidaemia-2025",
      "cakupan": "langsung"
    }
  ],
  "mm_gagal_jantung_kongestif": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "esc-heart-failure-2021",
      "cakupan": "langsung"
    }
  ],
  "mm_gout_artritis_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "acr-gout-2020",
      "cakupan": "langsung"
    }
  ],
  "mm_hipertensi_urgensi": [
    {
      "sourceId": "pnpk-hipertensi-2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "esc-hypertension-2024",
      "cakupan": "langsung"
    }
  ],
  "mm_isk_bawah": [
    {
      "sourceId": "pnpk-isk-2025",
      "cakupan": "langsung"
    },
    {
      "sourceId": "eau-urological-infections-2026",
      "cakupan": "langsung"
    }
  ],
  "mm_low_back_pain": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Tidak ada bab diagnosis yang dipetakan langsung; dokumen ini hanya menjadi batas bawah praktik FKTP."
    },
    {
      "sourceId": "who-low-back-pain-2023",
      "cakupan": "langsung"
    }
  ],
  "mm_mialgia": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Tidak ada bab diagnosis yang dipetakan langsung; dokumen ini hanya menjadi batas bawah praktik FKTP."
    },
    {
      "sourceId": "who-low-back-pain-2023",
      "cakupan": "terkait"
    }
  ],
  "mm_obesitas": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "vadod-obesity-2025",
      "cakupan": "langsung"
    }
  ],
  "mm_osteoartritis_lutut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "vadod-osteoarthritis-2026",
      "cakupan": "langsung"
    }
  ],
  "otitis_eksterna_akut_ringan": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aao-hns-otitis-externa-2014",
      "cakupan": "langsung"
    }
  ],
  "otitis_media_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cps-otitis-media-2024",
      "cakupan": "langsung"
    }
  ],
  "pneumonia_balita": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-child-pneumonia-diarrhoea-2024",
      "cakupan": "langsung"
    }
  ],
  "ppok_eksaserbasi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "gold-copd-2026",
      "cakupan": "langsung"
    }
  ],
  "rinitis_alergi": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aria-rhinitis-2024",
      "cakupan": "langsung"
    }
  ],
  "saraf_bells_palsy": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aao-hns-bell-palsy-2013",
      "cakupan": "langsung"
    }
  ],
  "saraf_epilepsi_kejang": [
    {
      "sourceId": "pnpk_epilepsi_2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-mhgap-2023",
      "cakupan": "langsung"
    }
  ],
  "saraf_migrain": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "ihs-migraine-2024",
      "cakupan": "langsung"
    }
  ],
  "saraf_tension_headache": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "jhs-headache-2025",
      "cakupan": "langsung"
    }
  ],
  "saraf_vertigo_bppv": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aao-hns-bppv-2017",
      "cakupan": "langsung"
    }
  ],
  "skabies": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-scabies-2023",
      "cakupan": "langsung"
    }
  ],
  "stroke_iskemik": [
    {
      "sourceId": "pnpk_stroke_2026",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aha_asa_stroke_2026",
      "cakupan": "langsung"
    }
  ],
  "tb_paru": [
    {
      "sourceId": "kemenkes-tb-so-2025",
      "cakupan": "langsung"
    },
    {
      "sourceId": "who-tb-treatment-care-2025",
      "cakupan": "langsung"
    }
  ],
  "tht_epistaksis_anterior": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "floor_umum",
      "catatan": "Tidak ada bab diagnosis yang dipetakan langsung; dokumen ini hanya menjadi batas bawah praktik FKTP."
    },
    {
      "sourceId": "aao-hns-nosebleed-2020",
      "cakupan": "langsung"
    }
  ],
  "tht_rinosinusitis_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "epos-rhinosinusitis-2020",
      "cakupan": "langsung"
    }
  ],
  "tht_serumen_prop": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "aao-hns-cerumen-2017",
      "cakupan": "langsung"
    }
  ],
  "tonsilitis_akut": [
    {
      "sourceId": "ppk-fktp-1936-2022",
      "cakupan": "langsung"
    },
    {
      "sourceId": "cdc-strep-throat-2025",
      "cakupan": "langsung"
    }
  ]
} as const satisfies Record<string, readonly SourceAssignment[]>
