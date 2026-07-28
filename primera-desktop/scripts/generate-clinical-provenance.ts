import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SUMBER_IGD } from '../src/content/igdSources'
import type { SumberKlinis } from '../src/content/types'
import {
  EBM_GUIDELINE_SOURCES,
  EXTERNAL_PNPK_SOURCES,
} from './m13-adjudication/config'

type Coverage = NonNullable<SumberKlinis['cakupan']>
type SourceKind = SumberKlinis['jenis']

interface SourceDefinition {
  id: string
  label: string
  url: string
  tahun: number
  jenis: SourceKind
}

interface Assignment {
  sourceId: string
  cakupan: Coverage
  catatan?: string
}

interface M13EvidenceSource {
  sourceId?: string
  slug?: string
  relation: 'direct' | 'related'
  title: string
  authority?: string
  year?: number
  documentNumber?: string
  officialUrl?: string
}

interface M13Case {
  id: string
  evidence: {
    ppk: {
      status: string
      relation?: 'direct' | 'related'
      limitation?: string
    }
    pnpk: { sources: M13EvidenceSource[] }
    ebm: { sources: M13EvidenceSource[] }
  }
}

interface M13Dataset {
  cases: M13Case[]
}

function sumber(
  id: string,
  label: string,
  url: string,
  tahun: number,
  jenis: SourceKind,
): SourceDefinition {
  return { id, label, url, tahun, jenis }
}

const EXTRA_SOURCES: Record<string, SourceDefinition> = {
  'ppk-fktp-1936-2022': sumber(
    'ppk-fktp-1936-2022',
    'KMK 1936/2022 - perubahan PPK Dokter di FKTP',
    'https://jdih.kemkes.go.id/storage/documents/pdfs/2022kepmenkes1936.pdf',
    2022,
    'pedoman_indonesia',
  ),
  'pnpk-hipertensi-2026': sumber(
    'pnpk-hipertensi-2026',
    'KMK 303/2026 - PNPK Hipertensi pada Dewasa',
    'https://keslan.kemkes.go.id/unduhan/fileunduhan1780387327_362636.pdf',
    2026,
    'pedoman_indonesia',
  ),
  'pnpk-dm2-2026': sumber(
    'pnpk-dm2-2026',
    'KMK 302/2026 - PNPK Diabetes Melitus Tipe 2 Dewasa',
    'https://keslan.kemkes.go.id/unduhan/fileunduhan1777518085_672976.pdf',
    2026,
    'pedoman_indonesia',
  ),
  'pnpk-isk-2025': sumber(
    'pnpk-isk-2025',
    'KMK 762/2025 - PNPK Infeksi Saluran Kemih',
    'https://jdih.kemkes.go.id/documents/keputusan-menteri-kesehatan-nomor-hk0107menkes7622025',
    2025,
    'pedoman_indonesia',
  ),
  'pmk-spm-2024': sumber(
    'pmk-spm-2024',
    'Permenkes 6/2024 - Standar Teknis SPM Kesehatan',
    'https://jdih.kemkes.go.id/storage/documents/pdfs/2024permenkes006.pdf',
    2024,
    'pedoman_indonesia',
  ),
  'permenkes-kespro-2025': sumber(
    'permenkes-kespro-2025',
    'Permenkes 2/2025 - Upaya Kesehatan Reproduksi',
    'https://kesprimkom.kemkes.go.id/modul/unduhan/90',
    2025,
    'pedoman_indonesia',
  ),
  'kemenkes-malaria-2024': sumber(
    'kemenkes-malaria-2024',
    'KMK 1988/2024 - Peta Jalan Eliminasi Malaria 2025-2045',
    'https://malaria.kemkes.go.id/sites/default/files/2025-03/20250219100417KMK%20No%20HK%2001%2007%20MENKES%201988%202024%20ttg%20Peta%20Jalan%20Eliminasi%20Malaria%20dan%20Pencegahan%20Penularan%20Kembali%20di%20Indonesia%20Th%202025%202045%20signed.pdf',
    2024,
    'pedoman_indonesia',
  ),
  'kemenkes-tb-so-2025': sumber(
    'kemenkes-tb-so-2025',
    'Kemenkes - Juknis Penatalaksanaan TB Sensitif Obat 2025',
    'https://p2.kemkes.go.id/juknis-tb-so/',
    2025,
    'pedoman_indonesia',
  ),
  'kemenkes-mtbs-diare': sumber(
    'kemenkes-mtbs-diare',
    'Kemenkes - MTBS: Rencana Terapi Diare Anak',
    'https://keslan.kemkes.go.id/view_artikel/737/diare-tanda-gejala-dan-cara-mengatasinya',
    2022,
    'pedoman_indonesia',
  ),
  'kemenkes-penanggulangan-penyakit-2026': sumber(
    'kemenkes-penanggulangan-penyakit-2026',
    'Permenkes 3/2026 - Penanggulangan Penyakit',
    'https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-3-tahun-2026',
    2026,
    'pedoman_indonesia',
  ),
  'who-iron-pregnancy-2012': sumber(
    'who-iron-pregnancy-2012',
    'WHO - Daily Iron and Folic Acid in Pregnant Women',
    'https://www.who.int/publications/i/item/9789241501996',
    2012,
    'evidence_internasional',
  ),
  'who-child-pneumonia-diarrhoea-2024': sumber(
    'who-child-pneumonia-diarrhoea-2024',
    'WHO - Pneumonia and Diarrhoea in Children up to 10 Years',
    'https://www.who.int/publications/i/item/9789240103412',
    2024,
    'evidence_internasional',
  ),
  'who-skin-primary-2026': sumber(
    'who-skin-primary-2026',
    'WHO - Skin NTDs and Common Skin Conditions for Front-line Care',
    'https://www.who.int/publications/i/item/9789292800024',
    2026,
    'evidence_internasional',
  ),
  'who-eye-screening-2024': sumber(
    'who-eye-screening-2024',
    'WHO - Vision and Eye Screening Implementation Handbook',
    'https://www.who.int/publications/i/item/9789240082458',
    2024,
    'evidence_internasional',
  ),
  'who-icope-eye-2025': sumber(
    'who-icope-eye-2025',
    'WHO ICOPE - Primary Eye Care and Refractive-error Pathways',
    'https://www.who.int/publications/i/item/9789240103726',
    2025,
    'evidence_internasional',
  ),
  'who-postnatal-2022': sumber(
    'who-postnatal-2022',
    'WHO - Maternal and Newborn Care for a Positive Postnatal Experience',
    'https://www.who.int/publications/i/item/9789240045989',
    2022,
    'evidence_internasional',
  ),
  'who-influenza-2024': sumber(
    'who-influenza-2024',
    'WHO Clinical Practice Guidelines for Influenza',
    'https://www.who.int/publications/b/73919',
    2024,
    'evidence_internasional',
  ),
  'who-candidiasis-2025': sumber(
    'who-candidiasis-2025',
    'WHO - Candidiasis Clinical Overview',
    'https://www.who.int/news-room/fact-sheets/detail/candidiasis-%28yeast-infection%29',
    2025,
    'evidence_internasional',
  ),
  'who-ringworm-2025': sumber(
    'who-ringworm-2025',
    'WHO - Ringworm (Tinea) Clinical Overview',
    'https://www.who.int/news-room/fact-sheets/detail/ringworm-%28tinea%29',
    2025,
    'evidence_internasional',
  ),
  'who-scabies-2023': sumber(
    'who-scabies-2023',
    'WHO - Scabies: Recognition, Treatment, and Control',
    'https://www.who.int/news-room/fact-sheets/detail/scabies',
    2023,
    'evidence_internasional',
  ),
  'who-mhgap-2023': sumber(
    'who-mhgap-2023',
    'WHO mhGAP Guideline, third edition',
    'https://www.who.int/publications/i/item/9789240084278',
    2023,
    'evidence_internasional',
  ),
  'who-malaria-2025': sumber(
    'who-malaria-2025',
    'WHO Guidelines for Malaria',
    'https://www.who.int/publications/i/item/guidelines-for-malaria',
    2025,
    'evidence_internasional',
  ),
  'who-mec-2025': sumber(
    'who-mec-2025',
    'WHO Medical Eligibility Criteria for Contraceptive Use, sixth edition',
    'https://www.who.int/publications/i/item/9789240115583',
    2025,
    'evidence_internasional',
  ),
  'nice-miscarriage-ng126-2026': sumber(
    'nice-miscarriage-ng126-2026',
    'NICE NG126 - Ectopic Pregnancy and Miscarriage',
    'https://www.nice.org.uk/guidance/ng126',
    2026,
    'evidence_internasional',
  ),
  'nice-acne-ng198-2026': sumber(
    'nice-acne-ng198-2026',
    'NICE NG198 - Acne Vulgaris: Management',
    'https://www.nice.org.uk/guidance/ng198/chapter/Recommendations',
    2026,
    'evidence_internasional',
  ),
  'nice-acute-cough-ng120': sumber(
    'nice-acute-cough-ng120',
    'NICE NG120 - Cough (Acute): Antimicrobial Prescribing',
    'https://www.nice.org.uk/guidance/ng120/chapter/Recommendations',
    2019,
    'evidence_internasional',
  ),
  'nice-dyspepsia-cg184': sumber(
    'nice-dyspepsia-cg184',
    'NICE CG184 - Dyspepsia and GORD',
    'https://www.nice.org.uk/guidance/cg184/chapter/Recommendations',
    2019,
    'evidence_internasional',
  ),
  'nice-open-fractures-ng37': sumber(
    'nice-open-fractures-ng37',
    'NICE NG37 - Fractures (Complex): Open-fracture Care',
    'https://www.nice.org.uk/guidance/ng37/chapter/recommendations',
    2022,
    'evidence_internasional',
  ),
  'nice-fractures-ng38': sumber(
    'nice-fractures-ng38',
    'NICE NG38 - Fractures (Non-complex)',
    'https://www.nice.org.uk/guidance/ng38/chapter/recommendations',
    2022,
    'evidence_internasional',
  ),
  'nice-pyelonephritis-ng111': sumber(
    'nice-pyelonephritis-ng111',
    'NICE NG111 - Acute Pyelonephritis',
    'https://www.nice.org.uk/guidance/ng111/chapter/recommendations',
    2024,
    'evidence_internasional',
  ),
  'nice-fever-under5-ng143': sumber(
    'nice-fever-under5-ng143',
    'NICE NG143 - Fever in Under 5s',
    'https://www.nice.org.uk/guidance/ng143/chapter/recommendations',
    2021,
    'evidence_internasional',
  ),
  'nice-overweight-ng246-2025': sumber(
    'nice-overweight-ng246-2025',
    'NICE NG246 - Overweight and Obesity Management',
    'https://www.nice.org.uk/guidance/ng246/chapter/Recommendations',
    2025,
    'evidence_internasional',
  ),
  'nice-osteoarthritis-ng226': sumber(
    'nice-osteoarthritis-ng226',
    'NICE NG226 - Osteoarthritis in Over 16s',
    'https://www.nice.org.uk/guidance/ng226/chapter/Recommendations',
    2022,
    'evidence_internasional',
  ),
  'nice-headache-cg150-2025': sumber(
    'nice-headache-cg150-2025',
    'NICE CG150 - Headaches in Over 12s',
    'https://www.nice.org.uk/guidance/cg150/chapter/recommendations',
    2025,
    'evidence_internasional',
  ),
  'nice-hearing-loss-ng98': sumber(
    'nice-hearing-loss-ng98',
    'NICE NG98 - Hearing Loss in Adults: Earwax Removal',
    'https://www.nice.org.uk/guidance/ng98/chapter/recommendations',
    2023,
    'evidence_internasional',
  ),
  'eau-paediatric-urology-2026': sumber(
    'eau-paediatric-urology-2026',
    'EAU Guidelines on Paediatric Urology 2026',
    'https://uroweb.org/guidelines/paediatric-urology',
    2026,
    'evidence_internasional',
  ),
  'eau-urolithiasis-2026': sumber(
    'eau-urolithiasis-2026',
    'EAU Guidelines on Urolithiasis 2026',
    'https://uroweb.org/guidelines/urolithiasis',
    2026,
    'evidence_internasional',
  ),
  'eau-urological-infections-2025': sumber(
    'eau-urological-infections-2025',
    'EAU Guidelines on Urological Infections',
    'https://uroweb.org/guidelines/urological-infections',
    2025,
    'evidence_internasional',
  ),
  'cdc-vvc-2021': sumber(
    'cdc-vvc-2021',
    'CDC STI Guidelines - Vulvovaginal Candidiasis',
    'https://www.cdc.gov/std/treatment-guidelines/candidiasis.htm',
    2021,
    'evidence_internasional',
  ),
  'cdc-mumps-2024': sumber(
    'cdc-mumps-2024',
    'CDC - Clinical Overview of Mumps',
    'https://www.cdc.gov/mumps/hcp/clinical-overview/',
    2024,
    'evidence_internasional',
  ),
  'cdc-shigella-2024': sumber(
    'cdc-shigella-2024',
    'CDC - Clinical Care of Shigellosis',
    'https://www.cdc.gov/shigella/hcp/clinical-care/',
    2024,
    'evidence_internasional',
  ),
  'cdc-typhoid-2024': sumber(
    'cdc-typhoid-2024',
    'CDC - Clinical Guidance for Typhoid and Paratyphoid Fever',
    'https://www.cdc.gov/typhoid-fever/hcp/clinical-guidance/',
    2024,
    'evidence_internasional',
  ),
  'cdc-strep-throat-2025': sumber(
    'cdc-strep-throat-2025',
    'CDC - Clinical Guidance for Group A Streptococcal Pharyngitis',
    'https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html',
    2025,
    'evidence_internasional',
  ),
  'cdc-varicella-2024': sumber(
    'cdc-varicella-2024',
    'CDC - Clinical Guidance for People at Risk for Severe Varicella',
    'https://www.cdc.gov/chickenpox/hcp/clinical-guidance/',
    2024,
    'evidence_internasional',
  ),
  'cdc-shingles-2024': sumber(
    'cdc-shingles-2024',
    'CDC - Clinical Overview of Shingles',
    'https://www.cdc.gov/shingles/hcp/clinical-overview/',
    2024,
    'evidence_internasional',
  ),
  'cdc-head-lice-2024': sumber(
    'cdc-head-lice-2024',
    'CDC - Clinical Care of Head Lice',
    'https://www.cdc.gov/lice/hcp/clinical-care/index.html',
    2024,
    'evidence_internasional',
  ),
  'cdc-measles-2025': sumber(
    'cdc-measles-2025',
    'CDC - Clinical Overview of Measles',
    'https://www.cdc.gov/measles/hcp/clinical-overview/index.html',
    2025,
    'evidence_internasional',
  ),
  'acg-gerd-2022': sumber(
    'acg-gerd-2022',
    'ACG Clinical Guideline for GERD',
    'https://journals.lww.com/ajg/fulltext/2022/01000/acg_clinical_guideline_for_the_diagnosis_and.14.aspx',
    2022,
    'evidence_internasional',
  ),
  'ats-idsa-cap-2019': sumber(
    'ats-idsa-cap-2019',
    'ATS/IDSA Guideline - Community-acquired Pneumonia in Adults',
    'https://www.thoracic.org/statements/guideline-implementation-tools/diagnosis-and-treatment-of-cap.php',
    2019,
    'evidence_internasional',
  ),
  'aao-hns-otitis-externa-2014': sumber(
    'aao-hns-otitis-externa-2014',
    'AAO-HNSF Guideline - Acute Otitis Externa',
    'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/',
    2014,
    'evidence_internasional',
  ),
  'aao-hns-bell-palsy-2013': sumber(
    'aao-hns-bell-palsy-2013',
    'AAO-HNSF Guideline - Bell Palsy',
    'https://www.entnet.org/wp-content/uploads/files/Bulletin_BellsExecSummary_Final_102313.pdf',
    2013,
    'evidence_internasional',
  ),
  'aao-hns-bppv-2017': sumber(
    'aao-hns-bppv-2017',
    'AAO-HNSF Guideline - Benign Paroxysmal Positional Vertigo',
    'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/bppv/',
    2017,
    'evidence_internasional',
  ),
  'aao-hns-nosebleed-2020': sumber(
    'aao-hns-nosebleed-2020',
    'AAO-HNSF Guideline - Nosebleed (Epistaxis)',
    'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/nosebleed-epistaxis/',
    2020,
    'evidence_internasional',
  ),
  'aap-otitis-media-2013': sumber(
    'aap-otitis-media-2013',
    'AAP Guideline - Diagnosis and Management of Acute Otitis Media',
    'https://publications.aap.org/pediatrics/article/131/3/e964/30912/The-Diagnosis-and-Management-of-Acute-Otitis',
    2013,
    'evidence_internasional',
  ),
  'aria-rhinitis-2024': sumber(
    'aria-rhinitis-2024',
    'ARIA-EAACI Care Pathways for Allergic Rhinitis',
    'https://www.euforea.eu/aria/',
    2024,
    'evidence_internasional',
  ),
  'bsaci-rhinitis-2017': sumber(
    'bsaci-rhinitis-2017',
    'BSACI Guideline for the Diagnosis and Management of Allergic and Non-allergic Rhinitis',
    'https://www.bsaci.org/guidelines-and-standards/bsaci-guidelines/rhinitis-2017-update/',
    2017,
    'evidence_internasional',
  ),
  'epos-rhinosinusitis-2020': sumber(
    'epos-rhinosinusitis-2020',
    'EPOS 2020 - Rhinosinusitis and Nasal Polyps',
    'https://www.rhinologyjournal.com/Documents/Supplements/supplement_29.pdf',
    2020,
    'evidence_internasional',
  ),
  'eular-ra-2025': sumber(
    'eular-ra-2025',
    'EULAR Recommendations for Rheumatoid Arthritis Management',
    'https://ard.bmj.com/content/early/2025/03/11/ard-2024-226766',
    2025,
    'evidence_internasional',
  ),
  'esc-dyslipidaemia-2025': sumber(
    'esc-dyslipidaemia-2025',
    'ESC/EAS Focused Update on Dyslipidaemias',
    'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/',
    2025,
    'evidence_internasional',
  ),
  'esc-heart-failure-2021': sumber(
    'esc-heart-failure-2021',
    'ESC Guidelines for Acute and Chronic Heart Failure',
    'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-and-Chronic-Heart-Failure',
    2021,
    'evidence_internasional',
  ),
  'esc-hypertension-2024': sumber(
    'esc-hypertension-2024',
    'ESC Guidelines - Elevated Blood Pressure and Hypertension',
    'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/',
    2024,
    'evidence_internasional',
  ),
  'acr-gout-2020': sumber(
    'acr-gout-2020',
    'American College of Rheumatology Guideline for Gout',
    'https://rheumatology.org/gout-guideline',
    2020,
    'evidence_internasional',
  ),
  'who-low-back-pain-2023': sumber(
    'who-low-back-pain-2023',
    'WHO Guideline for Chronic Primary Low Back Pain',
    'https://www.who.int/publications/i/item/9789240081789',
    2023,
    'evidence_internasional',
  ),
  'eaaci-urticaria-2022': sumber(
    'eaaci-urticaria-2022',
    'EAACI/GA2LEN/EuroGuiDerm/APAAACI Urticaria Guideline',
    'https://onlinelibrary.wiley.com/doi/10.1111/all.15090',
    2022,
    'evidence_internasional',
  ),
  'eaaci-food-allergy-2024': sumber(
    'eaaci-food-allergy-2024',
    'EAACI Guideline on Management of IgE-mediated Food Allergy',
    'https://onlinelibrary.wiley.com/doi/10.1111/all.16370',
    2024,
    'evidence_internasional',
  ),
  'esrs-insomnia-2023': sumber(
    'esrs-insomnia-2023',
    'European Insomnia Guideline 2023',
    'https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035',
    2023,
    'evidence_internasional',
  ),
  'esvs-venous-2022': sumber(
    'esvs-venous-2022',
    'ESVS Guidelines on Chronic Venous Disease',
    'https://www.ejves.com/article/S1078-5884%2821%2900798-6/fulltext',
    2022,
    'evidence_internasional',
  ),
  'tif-thalassaemia-2021': sumber(
    'tif-thalassaemia-2021',
    'Thalassaemia International Federation Guidelines, fourth edition',
    'https://thalassaemia.org.cy/publications/tif-publications/guidelines-for-the-management-of-transfusion-dependent-thalassaemia-4th-edition-2021-v2/',
    2021,
    'evidence_internasional',
  ),
  'wses-cholecystitis-2020': sumber(
    'wses-cholecystitis-2020',
    'WSES Guidelines for Acute Calculous Cholecystitis',
    'https://wjes.biomedcentral.com/articles/10.1186/s13017-020-00336-x',
    2020,
    'evidence_internasional',
  ),
  'who-food-safety-2024': sumber(
    'who-food-safety-2024',
    'WHO - Food Safety and Foodborne Disease',
    'https://www.who.int/news-room/fact-sheets/detail/food-safety',
    2024,
    'evidence_internasional',
  ),
  'niddk-lactose-intolerance-2018': sumber(
    'niddk-lactose-intolerance-2018',
    'NIDDK - Diagnosis and Management of Lactose Intolerance',
    'https://www.niddk.nih.gov/health-information/digestive-diseases/lactose-intolerance',
    2018,
    'evidence_internasional',
  ),
  'who-oral-health-2022': sumber(
    'who-oral-health-2022',
    'WHO Global Oral Health Status Report',
    'https://www.who.int/publications/i/item/9789240061484',
    2022,
    'evidence_internasional',
  ),
  'queensland-nasal-foreign-body-2025': sumber(
    'queensland-nasal-foreign-body-2025',
    'Queensland Paediatric Guideline - Foreign Body in the Nose',
    'https://www.childrens.health.qld.gov.au/health-a-to-z/foreign-body-in-the-nose-emergency-management-in-children',
    2025,
    'evidence_internasional',
  ),
}

const A = (
  sourceId: string,
  cakupan: Coverage = 'langsung',
  catatan?: string,
): Assignment => ({ sourceId, cakupan, ...(catatan ? { catatan } : {}) })

const PPK_DIRECT = A('ppk-fktp-1936-2022', 'langsung')
const PPK_RELATED = A(
  'ppk-fktp-1936-2022',
  'terkait',
  'Bab PPK memberi konteks klinis terkait, bukan padanan diagnosis yang identik.',
)
const PPK_FLOOR = A(
  'ppk-fktp-1936-2022',
  'floor_umum',
  'Tidak ada bab diagnosis yang dipetakan langsung; dokumen ini hanya menjadi batas bawah praktik FKTP.',
)

const BASELINE_ASSIGNMENTS: Record<string, Assignment[]> = {
  anemia_defisiensi_bumil: [PPK_DIRECT, A('who-iron-pregnancy-2012')],
  apendisitis_akut: [PPK_DIRECT, A('wses-appendicitis-2025')],
  askariasis: [A('kemenkes-penanggulangan-penyakit-2026', 'terkait'), A('who-sth-2023')],
  asma_eksaserbasi_berat_anak: [PPK_DIRECT, A('gina_2026')],
  asma_ringan: [PPK_DIRECT, A('gina_2026')],
  benda_asing_hidung_anak: [PPK_DIRECT, A('queensland-nasal-foreign-body-2025')],
  bronkitis_akut: [PPK_FLOOR, A('nice-acute-cough-ng120')],
  demam_tifoid: [PPK_DIRECT, A('cdc-typhoid-2024')],
  dengue_df: [PPK_DIRECT, A('who_arboviral_2025')],
  diare_akut_anak: [A('kemenkes-mtbs-diare'), A('who-child-pneumonia-diarrhoea-2024')],
  diare_akut_bayi_dehidrasi_berat: [A('kemenkes-mtbs-diare'), A('who-child-pneumonia-diarrhoea-2024')],
  disentri_basiler: [PPK_DIRECT, A('cdc-shigella-2024')],
  dispepsia_fungsional: [PPK_FLOOR, A('nice-dyspepsia-cg184')],
  dm_tipe2: [A('pnpk-dm2-2026'), A('ada-diabetes-2026-type1')],
  faringitis_akut: [PPK_DIRECT, A('cdc-strep-throat-2025')],
  fraktur_terbuka_tibia_stabil: [A('pnpk_trauma_2017', 'terkait'), A('nice-open-fractures-ng37')],
  gastritis: [PPK_DIRECT, A('nice-dyspepsia-cg184', 'terkait')],
  gerd: [PPK_DIRECT, A('acg-gerd-2022')],
  hemoroid_grade1: [PPK_DIRECT, A('aga-hemorrhoids-2026')],
  hipertensi_esensial: [A('pnpk-hipertensi-2026'), A('esc-hypertension-2024')],
  hipoglikemia_ringan_dewasa: [A('pnpk-dm2-2026', 'terkait'), A('ada_hypoglycemia_2026')],
  ispa_common_cold: [PPK_DIRECT, A('nice-acute-cough-ng120', 'terkait')],
  jiwa_depresi_ringan: [PPK_DIRECT, A('who-mhgap-2023')],
  jiwa_gangguan_cemas: [PPK_RELATED, A('who-mhgap-2023')],
  jiwa_insomnia: [PPK_DIRECT, A('esrs-insomnia-2023')],
  jiwa_skizofrenia: [PPK_DIRECT, A('who-mhgap-2023')],
  kia_abortus_iminens: [PPK_DIRECT, A('nice-miscarriage-ng126-2026')],
  kia_anc_kehamilan_normal: [A('pmk-spm-2024'), A('who-postnatal-2022', 'terkait')],
  kia_isk_kehamilan: [A('pnpk-isk-2025'), A('nice-pyelonephritis-ng111', 'terkait')],
  kia_kb_konseling: [A('permenkes-kespro-2025'), A('who-mec-2025')],
  kia_malaria_falsiparum: [A('kemenkes-malaria-2024'), A('who-malaria-2025')],
  kia_preeklampsia_berat: [A('pnpk_pregnancy_complications_2017'), A('who_preeclampsia_2025')],
  konjungtivitis_bakterial: [PPK_DIRECT, A('who-icope-eye-2025', 'terkait')],
  kulit_dermatitis_kontak: [PPK_DIRECT, A('who-skin-primary-2026', 'terkait')],
  kulit_herpes_zoster: [PPK_DIRECT, A('cdc-shingles-2024')],
  kulit_kandidiasis_kutis: [PPK_DIRECT, A('who-candidiasis-2025')],
  kulit_morbili: [PPK_DIRECT, A('cdc-measles-2025')],
  kulit_pedikulosis_kapitis: [PPK_DIRECT, A('cdc-head-lice-2024')],
  kulit_pioderma_impetigo: [PPK_DIRECT, A('idsa-ssti-2014')],
  kulit_tinea_korporis: [PPK_DIRECT, A('who-ringworm-2025')],
  kulit_urtikaria_akut: [PPK_DIRECT, A('eaaci-urticaria-2022')],
  kulit_varisela: [PPK_DIRECT, A('cdc-varicella-2024')],
  kulit_veruka_vulgaris: [PPK_DIRECT, A('who-skin-primary-2026', 'terkait')],
  mata_glaukoma_akut: [PPK_DIRECT, A('who-icope-eye-2025', 'terkait')],
  mata_hordeolum: [PPK_DIRECT, A('who-icope-eye-2025', 'terkait')],
  mata_konjungtivitis_alergi: [PPK_DIRECT, A('who-icope-eye-2025', 'terkait')],
  mm_artritis_reumatoid: [PPK_DIRECT, A('eular-ra-2025')],
  mm_dislipidemia: [PPK_DIRECT, A('esc-dyslipidaemia-2025')],
  mm_gagal_jantung_kongestif: [PPK_DIRECT, A('esc-heart-failure-2021')],
  mm_gout_artritis_akut: [PPK_DIRECT, A('acr-gout-2020')],
  mm_hipertensi_urgensi: [A('pnpk-hipertensi-2026'), A('esc-hypertension-2024')],
  mm_isk_bawah: [A('pnpk-isk-2025'), A('eau-urological-infections-2025')],
  mm_low_back_pain: [PPK_FLOOR, A('who-low-back-pain-2023')],
  mm_mialgia: [PPK_FLOOR, A('who-low-back-pain-2023', 'terkait')],
  mm_obesitas: [PPK_DIRECT, A('nice-overweight-ng246-2025')],
  mm_osteoartritis_lutut: [PPK_DIRECT, A('nice-osteoarthritis-ng226')],
  otitis_eksterna_akut_ringan: [PPK_DIRECT, A('aao-hns-otitis-externa-2014')],
  otitis_media_akut: [PPK_DIRECT, A('aap-otitis-media-2013')],
  pneumonia_balita: [PPK_DIRECT, A('who-child-pneumonia-diarrhoea-2024')],
  ppok_eksaserbasi: [PPK_DIRECT, A('gold-copd-2026')],
  rinitis_alergi: [PPK_DIRECT, A('aria-rhinitis-2024')],
  saraf_bells_palsy: [PPK_DIRECT, A('aao-hns-bell-palsy-2013')],
  saraf_epilepsi_kejang: [A('pnpk_epilepsi_2026'), A('nice_epilepsy_2025')],
  saraf_migrain: [PPK_DIRECT, A('nice-headache-cg150-2025')],
  saraf_tension_headache: [PPK_DIRECT, A('nice-headache-cg150-2025')],
  saraf_vertigo_bppv: [PPK_DIRECT, A('aao-hns-bppv-2017')],
  skabies: [PPK_DIRECT, A('who-scabies-2023')],
  stroke_iskemik: [A('pnpk_stroke_2026'), A('aha_asa_stroke_2026')],
  tb_paru: [A('kemenkes-tb-so-2025'), A('who-tb-treatment-care-2025')],
  tht_epistaksis_anterior: [PPK_FLOOR, A('aao-hns-nosebleed-2020')],
  tht_rinosinusitis_akut: [PPK_DIRECT, A('epos-rhinosinusitis-2020')],
  tht_serumen_prop: [PPK_DIRECT, A('nice-hearing-loss-ng98', 'terkait')],
  tonsilitis_akut: [PPK_DIRECT, A('cdc-strep-throat-2025')],
}

const LAB_FALLBACK_BY_SOURCE: Record<string, string[]> = {
  'eau-paediatric-urology-2026': [
    'lab_parafimosis_reduksibel',
    'lab_fimosis_patologis_ringan',
  ],
  who_bec: [
    'lab_trauma_tajam_kulit_kepala',
    'lab_vulnus_laseratum_lengan',
  ],
  'cdc-vvc-2021': ['lab_vaginitis_kandida'],
  'nice-pyelonephritis-ng111': ['lab_pielonefritis_tanpa_komplikasi'],
  'cdc-mumps-2024': ['lab_parotitis_mumps'],
  'nice-miscarriage-ng126-2026': ['lab_abortus_spontan_komplit'],
  'who-postnatal-2022': [
    'lab_puting_lecet',
    'lab_puting_tenggelam_laktasi',
    'lab_mastitis_laktasi',
    'lab_ruptur_perineum_derajat_1',
  ],
  'nice-acne-ng198-2026': ['lab_akne_vulgaris_ringan'],
  'who-skin-primary-2026': [
    'lab_cutaneous_larva_migrans',
    'lab_dermatitis_atopik_ringan',
    'lab_dermatitis_kontak_iritan_tangan',
    'lab_dermatitis_numularis',
    'lab_dermatitis_perioral',
    'lab_dermatitis_popok_iritan',
    'lab_dermatitis_seboroik_dewasa',
    'lab_erisipelas_tungkai_ringan',
    'lab_eritrasma_lipat_paha',
    'lab_erupsi_obat_morbiliformis',
    'lab_herpes_simpleks_labialis',
    'lab_hidradenitis_supuratif_hurley1',
    'lab_miliaria_rubra',
    'lab_moluskum_kontagiosum_anak',
    'lab_pedikulosis_pubis',
    'lab_pitiriasis_rosea',
    'lab_pitiriasis_versikolor',
    'lab_reaksi_gigitan_serangga',
    'lab_tinea_barbae',
    'lab_tinea_fasialis',
    'lab_tinea_kapitis_anak',
    'lab_tinea_kruris',
    'lab_tinea_manus',
    'lab_tinea_pedis',
    'lab_tinea_unguium_terkonfirmasi',
  ],
  'who-icope-eye-2025': [
    'lab_astigmatisme_ringan',
    'lab_blefaritis_anterior',
    'lab_buta_senja_defisiensi_vitamin_a',
    'lab_episkleritis_ringan',
    'lab_hipermetropia',
    'lab_mata_kering',
    'lab_miopia_ringan',
    'lab_perdarahan_subkonjungtiva',
    'lab_presbiopia',
    'lab_trikiasis',
  ],
  'tif-thalassaemia-2021': ['lab_talasemia_beta_mayor_anak'],
  'nice-fractures-ng38': ['lab_fraktur_tertutup_antebrachii_anak'],
  'who-skin-primary-2026:related': ['lab_lipoma_lengan'],
  'esvs-venous-2022': ['lab_ulkus_tungkai_vena'],
  'eaaci-food-allergy-2024': ['lab_alergi_makanan_ringan'],
  'niddk-lactose-intolerance-2018': ['lab_intoleransi_makanan_laktosa'],
  'who-candidiasis-2025': ['lab_kandidiasis_mulut'],
  'who-food-safety-2024': ['lab_keracunan_makanan_ringan'],
  'wses-cholecystitis-2020': ['lab_kolesistitis_akut'],
  'eau-urolithiasis-2026': ['lab_kolik_ureter_obstruksi'],
  'who-oral-health-2022:related': ['lab_stomatitis_aftosa'],
  'who-influenza-2024': ['lab_influenza_tanpa_komplikasi'],
  'nice-acute-cough-ng120:related': ['lab_laringitis_akut'],
  'ats-idsa-cap-2019': ['lab_pneumonia_komunitas_dewasa'],
  'nice-fever-under5-ng143:related': ['lab_kejang_demam_sederhana'],
  'bsaci-rhinitis-2017': ['lab_rinitis_vasomotor'],
  'who-skin-primary-2026:infection-related': [
    'lab_limfadenitis_servikal_akut',
    'lab_vulvitis_iritan',
  ],
}

function fallbackMap(): Map<string, Assignment> {
  const result = new Map<string, Assignment>()
  for (const [rawSourceId, caseIds] of Object.entries(LAB_FALLBACK_BY_SOURCE)) {
    const [sourceId, qualifier] = rawSourceId.split(':')
    const cakupan: Coverage = qualifier ? 'terkait' : 'langsung'
    for (const caseId of caseIds) {
      if (result.has(caseId)) throw new Error(`Fallback provenance lab duplikat: ${caseId}`)
      result.set(caseId, A(sourceId!, cakupan))
    }
  }
  return result
}

function yearFrom(value: string | undefined, fallback = 2022): number {
  const matches = value?.match(/20\d{2}/g)
  return Number(matches?.at(-1) ?? fallback)
}

function isIndonesianEbm(source: M13EvidenceSource): boolean {
  return (
    source.sourceId?.startsWith('kemenkes-') === true ||
    /Kementerian Kesehatan|Kemenkes/i.test(source.authority ?? '')
  )
}

function relation(value: 'direct' | 'related'): Coverage {
  return value === 'direct' ? 'langsung' : 'terkait'
}

function sourceIdForPnpk(source: M13EvidenceSource): string {
  return `pnpk-${source.slug}`
}

function mergeRegistry(data: M13Dataset): Map<string, SourceDefinition> {
  const registry = new Map<string, SourceDefinition>()
  const add = (item: SourceDefinition) => {
    const previous = registry.get(item.id)
    if (
      previous &&
      (previous.label !== item.label ||
        previous.url !== item.url ||
        previous.tahun !== item.tahun ||
        previous.jenis !== item.jenis)
    ) {
      throw new Error(`Definisi sumber bertabrakan: ${item.id}`)
    }
    registry.set(item.id, item)
  }

  for (const item of Object.values(SUMBER_IGD)) add({ ...item })
  for (const item of Object.values(EXTRA_SOURCES)) add(item)

  for (const [id, item] of Object.entries(EBM_GUIDELINE_SOURCES)) {
    add(
      sumber(
        id,
        `${item.authority} - ${item.title}`,
        item.officialUrl,
        item.year,
        /Kementerian Kesehatan|Kemenkes/i.test(item.authority)
          ? 'pedoman_indonesia'
          : 'evidence_internasional',
      ),
    )
  }

  for (const [slug, item] of Object.entries(EXTERNAL_PNPK_SOURCES)) {
    add(
      sumber(
        `pnpk-${slug}`,
        `${item.documentNumber} - ${item.title}`,
        item.officialUrl,
        yearFrom(item.documentNumber),
        'pedoman_indonesia',
      ),
    )
  }

  const pnpkFallback: Record<string, SourceDefinition> = {
    'hipertensi-dewasa-2026': {
      ...EXTRA_SOURCES['pnpk-hipertensi-2026']!,
      id: 'pnpk-hipertensi-dewasa-2026',
    },
    'dm-tipe2-dewasa-2026': {
      ...EXTRA_SOURCES['pnpk-dm2-2026']!,
      id: 'pnpk-dm-tipe2-dewasa-2026',
    },
    'stroke-2026': {
      ...SUMBER_IGD.pnpk_stroke_2026,
      id: 'pnpk-stroke-2026',
    },
  }
  for (const pnpk of data.cases.flatMap((item) => item.evidence.pnpk.sources)) {
    const id = sourceIdForPnpk(pnpk)
    if (registry.has(id)) continue
    const fallback = pnpk.slug ? pnpkFallback[pnpk.slug] : undefined
    if (fallback) {
      add(fallback)
      continue
    }
    if (!pnpk.officialUrl) {
      throw new Error(`PNPK tanpa URL resmi: ${pnpk.slug ?? pnpk.title}`)
    }
    add(
      sumber(
        id,
        `${pnpk.documentNumber ? `${pnpk.documentNumber} - ` : ''}${pnpk.title}`,
        pnpk.officialUrl,
        pnpk.year ?? yearFrom(pnpk.documentNumber ?? pnpk.title),
        'pedoman_indonesia',
      ),
    )
  }

  return registry
}

function buildLabAssignments(data: M13Dataset): Record<string, Assignment[]> {
  const fallback = fallbackMap()
  const result: Record<string, Assignment[]> = {}

  for (const kasus of data.cases) {
    const assignments: Assignment[] = []
    const directPnpk = kasus.evidence.pnpk.sources.find((item) => item.relation === 'direct')
    const relatedPnpk = kasus.evidence.pnpk.sources.find((item) => item.relation === 'related')
    const pnpk = directPnpk ?? relatedPnpk

    if (pnpk) {
      assignments.push(
        A(
          sourceIdForPnpk(pnpk),
          relation(pnpk.relation),
          pnpk.relation === 'related'
            ? 'PNPK memberi konteks terkait; bukan pedoman diagnosis yang identik.'
            : undefined,
        ),
      )
    }

    if (kasus.evidence.ppk.status !== 'tak-ada-sumber' && kasus.evidence.ppk.relation) {
      assignments.push(
        A(
          'ppk-fktp-1936-2022',
          relation(kasus.evidence.ppk.relation),
          kasus.evidence.ppk.relation === 'related'
            ? 'Bab PPK terkait, bukan padanan diagnosis yang identik.'
            : undefined,
        ),
      )
    }

    const nationalEbm = kasus.evidence.ebm.sources.find(isIndonesianEbm)
    if (nationalEbm && !assignments.some((item) => item.sourceId === nationalEbm.sourceId)) {
      assignments.push(A(nationalEbm.sourceId!, relation(nationalEbm.relation)))
    }

    if (!assignments.length) {
      assignments.push(
        A(
          'ppk-fktp-1936-2022',
          'floor_umum',
          'Audit tidak menemukan bab PPK/PNPK diagnosis-spesifik; dokumen ini hanya menjadi batas bawah kewenangan FKTP.',
        ),
      )
    }

    const international = kasus.evidence.ebm.sources
      .filter((item) => !isIndonesianEbm(item))
      .sort((a, b) => Number(b.relation === 'direct') - Number(a.relation === 'direct'))[0]
    if (international?.sourceId) {
      assignments.push(A(international.sourceId, relation(international.relation)))
    } else {
      const fallbackSource = fallback.get(kasus.id)
      if (!fallbackSource) {
        throw new Error(`Kasus lab tanpa evidence internasional/fallback: ${kasus.id}`)
      }
      assignments.push(fallbackSource)
    }

    result[kasus.id] = assignments.slice(0, 4)
  }

  return result
}

function assertRegistry(
  registry: Map<string, SourceDefinition>,
  assignments: Record<string, Assignment[]>,
): void {
  for (const [caseId, items] of Object.entries(assignments)) {
    if (items.length < 2 || items.length > 4) {
      throw new Error(`${caseId}: jumlah sumber ${items.length}, wajib 2-4`)
    }
    for (const item of items) {
      if (!registry.has(item.sourceId)) {
        throw new Error(`${caseId}: source id tidak dikenal '${item.sourceId}'`)
      }
    }
    const kinds = new Set(items.map((item) => registry.get(item.sourceId)!.jenis))
    if (!kinds.has('pedoman_indonesia') || !kinds.has('evidence_internasional')) {
      throw new Error(`${caseId}: wajib punya sumber Indonesia dan internasional`)
    }
  }
}

function render(
  registry: Map<string, SourceDefinition>,
  assignments: Record<string, Assignment[]>,
): string {
  const usedIds = new Set(Object.values(assignments).flat().map((item) => item.sourceId))
  const usedRegistry = Object.fromEntries(
    [...registry.entries()]
      .filter(([id]) => usedIds.has(id))
      .sort(([a], [b]) => a.localeCompare(b)),
  )
  const orderedAssignments = Object.fromEntries(
    Object.entries(assignments).sort(([a], [b]) => a.localeCompare(b)),
  )

  return `/* eslint-disable */
// Dibangkitkan oleh scripts/generate-clinical-provenance.ts.
// Jangan edit manual; ubah registry/crosswalk generator lalu jalankan npm run generate:provenance.
import type { SumberKlinis } from './types'

interface SourceAssignment {
  sourceId: keyof typeof CLINICAL_SOURCE_REGISTRY
  cakupan: NonNullable<SumberKlinis['cakupan']>
  catatan?: string
}

export const CLINICAL_SOURCE_REGISTRY = ${JSON.stringify(usedRegistry, null, 2)} as const satisfies Record<string, Omit<SumberKlinis, 'cakupan' | 'catatan'>>

export const CLINICAL_SOURCE_ASSIGNMENTS = ${JSON.stringify(orderedAssignments, null, 2)} as const satisfies Record<string, readonly SourceAssignment[]>
`
}

const dataset = JSON.parse(
  readFileSync(resolve(process.cwd(), 'docs/M13_137_ADJUDICATION_DATA.json'), 'utf8'),
) as M13Dataset
const registry = mergeRegistry(dataset)
const labAssignments = buildLabAssignments(dataset)
const assignments = { ...BASELINE_ASSIGNMENTS, ...labAssignments }

if (Object.keys(BASELINE_ASSIGNMENTS).length !== 73) {
  throw new Error(`Baseline provenance wajib 73 kasus, aktual ${Object.keys(BASELINE_ASSIGNMENTS).length}`)
}
if (Object.keys(labAssignments).length !== 137) {
  throw new Error(`Lab provenance wajib 137 kasus, aktual ${Object.keys(labAssignments).length}`)
}
if (Object.keys(assignments).length !== 210) {
  throw new Error(`Total provenance wajib 210 kasus, aktual ${Object.keys(assignments).length}`)
}

assertRegistry(registry, assignments)
writeFileSync(
  resolve(process.cwd(), 'src/content/clinicalSourceAssignments.generated.ts'),
  render(registry, assignments),
  'utf8',
)
console.log(`Generated provenance ${Object.keys(assignments).length}/210 kasus.`)
