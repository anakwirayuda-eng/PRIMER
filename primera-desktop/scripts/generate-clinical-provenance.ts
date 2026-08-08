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
  /**
   * Bug hunt 2026-08-06 (temuan A2): identitas dokumen ini DIPERBAIKI atas
   * keputusan dr. Wirayuda.
   *
   * Yang salah sebelumnya: 132 kasus menempelkan badge "LANGSUNG" pada KMK
   * 1936/2022, sementara legenda di layar yang sama menjelaskan LANGSUNG =
   * "sumber yang langsung membahas kasus ini". Mahasiswa membuka skabies,
   * mengeklik, lalu mendarat di PDF yang tidak memuat satu kata pun tentang
   * skabies — karena 1936 adalah dokumen PERUBAHAN yang hanya mengubah 15 bab
   * dan menambah 5. Lewat peta bab otoritatif (docs/references/ppk1186/
   * ppk_match.json), 125 dari 132 kasus berbadge LANGSUNG babnya di luar
   * cakupan amandemen itu.
   *
   * Bab penyakitnya hidup di KMK 1186/2022; 1936 mengubah sebagiannya. Karena
   * itu identitasnya kini ditulis sebagai satu keluarga dokumen, persis seperti
   * hierarki resmi proyek ini sudah menuliskannya ("1186 sebagaimana diubah
   * 1936") dan persis seperti seluruh 205 locator adjudikasi menyitirnya
   * ("PPK 1186/2022, bab N" — nol menyebut 1936).
   *
   * URL memakai indeks paralegal.id yang SUDAH jadi preseden di enam tempat
   * lain di proyek ini (igdSources.ts + lima kasus inline), karena PDF resmi
   * 1186 di JDIH sudah mati — tercatat di sourceRegistry.ts.
   */
  'ppk-fktp-1936-2022': sumber(
    'ppk-fktp-1936-2022',
    'KMK 1186/2022 - PPK Dokter di FKTP (sebagaimana diubah KMK 1936/2022)',
    'https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/',
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
  // 'kemenkes-mtbs-diare' DIHAPUS 2026-08-04: URL-nya sudah 404, dan
  // pencarian pengganti resmi (Buku Bagan/Saku MTBS-Lintas-Diare di
  // kemkes.go.id) tidak menemukan apa pun yang bisa diverifikasi hidup —
  // hanya salinan pihak ketiga (Academia.edu, Slideshare) yang tak memenuhi
  // standar sumber proyek ini. diare_akut_anak/diare_akut_bayi_dehidrasi_
  // berat sementara memakai kemenkes-penanggulangan-penyakit-2026 (terkait).
  //
  // 2026-08-05 — UTANG ITU LUNAS. Dokumennya ketemu bukan di kemkes.go.id
  // melainkan di lemari dokumen kebijakan WHO (platform.who.int/docs,
  // repositori naskah kebijakan nasional bidang kesehatan ibu-anak): berkas
  // PDF 2,9 MB yang berhasil diunduh dan DIBACA HALAMANNYA satu per satu,
  // bukan sekadar ditebak dari judul tautan. Isinya benar-benar Buku Bagan
  // MTBS terbitan Kementerian Kesehatan, Jakarta 2015, bertanda tangan lima
  // direktur, dan daftar isinya memuat persis yang diklaim label sitasi ini:
  // Rencana Terapi A (diare di rumah), B (dehidrasi ringan/sedang dengan
  // oralit), dan C (dehidrasi berat). Ini penerbit aslinya, bukan salinan
  // pihak ketiga — memenuhi standar sumber proyek ini.
  //
  // Kejujuran yang harus ikut tercatat: revisi nasional yang lebih baru
  // memang ada (beredar sebagai berkas 2022), tetapi salinan resminya yang
  // hidup tidak ditemukan. Karena itu tahun ditulis apa adanya 2015 dan
  // batas itu dinyatakan terbuka lewat `catatan` pada kedua kasus diare —
  // mengikuti kebiasaan proyek ini menahan bukti lama secara sadar, bukan
  // diam-diam.
  'kemenkes-mtbs-2015': sumber(
    'kemenkes-mtbs-2015',
    'Kemenkes - Buku Bagan MTBS 2015: Rencana Terapi A, B, dan C untuk diare anak',
    'https://platform.who.int/docs/default-source/mca-documents/policy-documents/guideline/IDN-CH-20-01-GUIDELINE-2015-ind-Chart-Book-of-Integrated-Management-of-Sick-Toddler.pdf',
    2015,
    'pedoman_indonesia',
  ),
  'kemenkes-penanggulangan-penyakit-2026': sumber(
    'kemenkes-penanggulangan-penyakit-2026',
    'Permenkes 3/2026 - Penanggulangan Penyakit',
    'https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-3-tahun-2026',
    2026,
    'pedoman_indonesia',
  ),
  'who-maternal-health-2025': sumber(
    'who-maternal-health-2025',
    'WHO - Recommendations on Maternal Health, second edition',
    'https://www.who.int/publications/i/item/9789240080591',
    2025,
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
  // Audit CODEX 2026-08-04 (temuan 6): label lama berbunyi "WHO ICOPE —
  // Primary Eye Care and Refractive-error Pathways", padahal dokumen di URL
  // itu berjudul "Integrated care for older people (ICOPE): guidance for
  // person-centred assessment and pathways in primary care, 2nd ed" —
  // panduan penilaian LANSIA, bukan pedoman penyakit mata/refraksi.
  // Diverifikasi langsung ke who.int. Label kini menyebut dokumennya apa
  // adanya; penilaian mata memang salah satu domain kapasitas intrinsik yang
  // disaring ICOPE, jadi sumbernya tidak dibuang — tapi ia kerangka
  // penyaringan, bukan pedoman per-penyakit. Karena itu cakupannya diturunkan
  // dari 'langsung' ke 'terkait' pada sepuluh kasus mata (lihat di bawah).
  // KOREKSI 2026-08-05: id 'who-vision-screening-2025' tidak pernah ada di
  // registry ini (yang nyata 'who-eye-screening-2024', di atas), DAN dokumen
  // di baliknya adalah buku panduan MENYELENGGARAKAN penyaringan penglihatan
  // — satu kelas dengan ICOPE, jadi memindahkan kasus ke sana tidak menaikkan
  // kejujuran cakupan sama sekali. Kesepuluh kasus mata kini dipindah ke tujuh
  // sumber per-kondisi (lihat klaster sapuan mata di bawah). Definisi ICOPE
  // ini sengaja dibiarkan menganggur: render() hanya memancarkan sumber yang
  // benar-benar terpakai, jadi menghapusnya cuma melebarkan diff.
  'who-icope-eye-2025': sumber(
    'who-icope-eye-2025',
    'WHO ICOPE - Integrated Care for Older People: penilaian kapasitas intrinsik (termasuk penyaringan penglihatan)',
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
  'who-abortion-care-2025': sumber(
    'who-abortion-care-2025',
    'WHO - Abortion Care Guideline, second edition',
    'https://www.who.int/publications/i/item/9789240104204',
    2025,
    'evidence_internasional',
  ),
  'cochrane-threatened-miscarriage-2021': sumber(
    'cochrane-threatened-miscarriage-2021',
    'Cochrane - Progestogens for Preventing Miscarriage: Network Meta-analysis',
    'https://www.cochrane.org/evidence/CD013792_are-progestogen-treatments-effective-preventing-miscarriage',
    2021,
    'evidence_internasional',
  ),
  'aad-acne-2024': sumber(
    'aad-acne-2024',
    'American Academy of Dermatology - Acne Clinical Guideline',
    'https://www.aad.org/member/clinical-quality/guidelines/acne',
    2024,
    'evidence_internasional',
  ),
  'cdc-adult-outpatient-2024': sumber(
    'cdc-adult-outpatient-2024',
    'CDC - Outpatient Clinical Care for Adults: Common Cold and Acute Bronchitis',
    'https://www.cdc.gov/antibiotic-use/hcp/clinical-care/adult-outpatient.html',
    2024,
    'evidence_internasional',
  ),
  'bsg-functional-dyspepsia-2022': sumber(
    'bsg-functional-dyspepsia-2022',
    'British Society of Gastroenterology - Functional Dyspepsia Guideline',
    'https://www.bsg.org.uk/clinical-resource/bsg-guidelines-on-the-management-of-functional-dys',
    2022,
    'evidence_internasional',
  ),
  'acs-orthopaedic-trauma-2022': sumber(
    'acs-orthopaedic-trauma-2022',
    'American College of Surgeons - Best Practices in Orthopaedic Trauma',
    'https://www.facs.org/media/mkbnhqtw/ortho_guidelines.pdf',
    2022,
    'evidence_internasional',
  ),
  'rcht-paediatric-forearm-fracture-2025': sumber(
    'rcht-paediatric-forearm-fracture-2025',
    'Royal Cornwall Hospitals - Early Management of Paediatric Forearm Fractures',
    'https://doclibrary-rcht.cornwall.nhs.uk/DocumentsLibrary/RoyalCornwallHospitalsTrust/Clinical/EmergencyDepartment/EarlyManagementofPaediatricForearmFracturesintheEmergencyDepartmentClinicalGuideline.pdf',
    2025,
    'evidence_internasional',
  ),
  'rch-febrile-seizure-2026': sumber(
    'rch-febrile-seizure-2026',
    'Royal Children Hospital Melbourne - Febrile Seizure Guideline',
    'https://www.rch.org.au/clinicalguide/guideline_index/Febrile_seizure/',
    2026,
    'evidence_internasional',
  ),
  'vadod-obesity-2025': sumber(
    'vadod-obesity-2025',
    'VA/DoD - Management of Adult Overweight and Obesity',
    'https://www.healthquality.va.gov/guidelines/CD/obesity/',
    2025,
    'evidence_internasional',
  ),
  'vadod-osteoarthritis-2026': sumber(
    'vadod-osteoarthritis-2026',
    'VA/DoD - Non-Surgical Management of Hip and Knee Osteoarthritis',
    'https://www.healthquality.va.gov/guidelines/CD/OA/index.asp',
    2026,
    'evidence_internasional',
  ),
  'ihs-migraine-2024': sumber(
    'ihs-migraine-2024',
    'International Headache Society - Global Practice Recommendations for Migraine',
    'https://ihs-headache.org/en/resources/guidelines/',
    2024,
    'evidence_internasional',
  ),
  'jhs-headache-2025': sumber(
    'jhs-headache-2025',
    'Japanese Headache Society - Clinical Practice Guideline for Headache Disorders',
    'https://onlinelibrary.wiley.com/doi/full/10.1111/ncn3.70042',
    2025,
    'evidence_internasional',
  ),
  'aao-hns-cerumen-2017': sumber(
    'aao-hns-cerumen-2017',
    'AAO-HNSF - Clinical Practice Guideline: Cerumen Impaction',
    'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/cerumen-impaction/',
    2017,
    'evidence_internasional',
  ),
  'eau-paediatric-urology-2026': sumber(
    'eau-paediatric-urology-2026',
    'EAU Guidelines on Paediatric Urology 2026',
    // Sapuan 2026-08-05: dulu menunjuk halaman payung berisi daftar 32 bab —
    // dua agen memfetchnya dan teks parafimosis TIDAK muncul di sana sama
    // sekali, jadi mahasiswa mendarat di daftar isi dan tak bisa memverifikasi
    // apa pun. Kini menunjuk bab prepusiumnya langsung (memuat fimosis DAN
    // parafimosis), tempat batas populasinya bisa dibaca sendiri.
    'https://uroweb.org/guidelines/paediatric-urology/chapter/phimosis-and-other-abnormalities-of-the-penile-skin',
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
  'eau-urological-infections-2026': sumber(
    'eau-urological-infections-2026',
    'EAU Guidelines on Urological Infections 2026',
    'https://uroweb.org/guidelines/urological-infections',
    2026,
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
  // Audit CODEX 2026-08-04 (temuan 15): pedoman ACG GERD dulu tampil DUA
  // baris ke pemain, keduanya berbadge LANGSUNG — satu dari sumber inline
  // kasus (`acg_gerd_2022`, tautan PubMed) dan satu dari sini (tautan situs
  // penerbit). Dedup di clinicalSources.ts hanya mencocokkan id/url persis,
  // dan keduanya berbeda pada dua-duanya. Entri inline dicabut dari
  // kasusRespGi.ts; tautannya dipindah ke sini karena PubMed selalu terbuka
  // tanpa berbayar, sedangkan situs penerbit dapat berbayar.
  'acg-gerd-2022': sumber(
    'acg-gerd-2022',
    'ACG Clinical Guideline for GERD (2022)',
    'https://pubmed.ncbi.nlm.nih.gov/34807007/',
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
  'cps-otitis-media-2024': sumber(
    'cps-otitis-media-2024',
    'Canadian Paediatric Society - Acute Otitis Media (reaffirmed 2024)',
    'https://cps.ca/en/documents/position/acute-otitis-media',
    2024,
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
    // Label 2026-08-05 dipertegas: kata KRONIK dibuat mencolok supaya penelaah
    // berikutnya tidak lagi memasangnya sebagai sumber 'langsung' pada nyeri
    // punggung yang baru mulai. Itu persis yang terjadi sebelumnya.
    'WHO: Non-surgical Management of CHRONIC PRIMARY Low Back Pain in Adults (2023)',
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
  // Audit tautan mati 2026-08-04: URL lama (halaman konsumen "health-a-to-z")
  // sudah 404. Diganti ke jalur profesional QPEC — sama seperti
  // 'foreign-body-inhaled' yang sudah dipakai & terverifikasi di igdSources.ts,
  // tapi ini entri KHUSUS HIDUNG (bukan tertelan/terhirup — entitas beda).
  // Domain ini membalas 403 ke bot (Cloudflare), TAPI hidup di browser
  // sungguhan — pola sama dgn saudara 'foreign-body-inhaled' yang sudah lama
  // dipakai proyek ini.
  'queensland-nasal-foreign-body-2025': sumber(
    'queensland-nasal-foreign-body-2025',
    'Queensland Paediatric Guideline - Foreign Body in the Nose (QPEC, profesional)',
    'https://www.childrens.health.qld.gov.au/for-health-professionals/queensland-paediatric-emergency-care-qpec/queensland-paediatric-clinical-guidelines/foreign-body-nose',
    2025,
    'evidence_internasional',
  ),
  // S-provenance (2026-08-01): 14 sumber diagnosis-spesifik pengganti EBM yang
  // sebelumnya 'terkait'/floor (who-icope-eye-2025, who-skin-primary-2026, dkk
  // dipakai lintas-diagnosis sbg kerangka umum, bukan sumber langsung per
  // kondisi). Tiap URL diverifikasi hidup via WebFetch ganda (peneliti +
  // reviewer skeptis independen) sebelum masuk registry — lihat audit mutu
  // scripts/audit-clinical-source-quality.ts.
  'aao-conjunctivitis-ppp-2023': sumber(
    'aao-conjunctivitis-ppp-2023',
    'AAO Preferred Practice Pattern: Conjunctivitis 2023 (bakterial, viral, alergi)',
    'https://www.aao.org/education/preferred-practice-pattern/conjunctivitis-ppp-2023',
    2023,
    'evidence_internasional',
  ),
  // ---------------------------------------------------------------------
  // Sapuan sitasi mata 2026-08-05. Sepuluh kasus mata dilepas dari ICOPE
  // (dokumen penilaian lansia) ke tujuh sumber per-kondisi. Tiap URL
  // diverifikasi hidup DUA KALI oleh agen yang berbeda dan saling menyanggah;
  // yang gugur dicatat di bawah supaya tak dicoba lagi.
  // ---------------------------------------------------------------------
  'aao-refractive-errors-ppp-2022': sumber(
    'aao-refractive-errors-ppp-2022',
    'AAO Preferred Practice Pattern: Refractive Errors (2022, diperbarui 2025)',
    'https://www.aao.org/education/preferred-practice-pattern/refractive-errors-ppp-2022',
    2022,
    'evidence_internasional',
  ),
  // Slug URL di bawah generik bawaan CMS AAO dan TIDAK memuat nama penyakit.
  // Diverifikasi 2026-08-05: halaman benar berjudul "Blepharitis PPP 2023".
  // JANGAN ditebak-ganti ke slug 'blepharitis-ppp-2023' — slug itu belum
  // pernah diverifikasi. Ini satu-satunya sitasi mata yang identitasnya
  // bergantung pada isi halaman, bukan alamatnya; periksa ulang berkala.
  'aao-blepharitis-ppp-2023': sumber(
    'aao-blepharitis-ppp-2023',
    'AAO Preferred Practice Pattern: Blepharitis (2023)',
    'https://www.aao.org/education/preferred-practice-pattern/new-preferredpracticepatternguideline-4',
    2023,
    'evidence_internasional',
  ),
  'aao-dry-eye-syndrome-ppp-2023': sumber(
    'aao-dry-eye-syndrome-ppp-2023',
    'AAO Preferred Practice Pattern: Dry Eye Syndrome (2023)',
    'https://www.aao.org/education/preferred-practice-pattern/dry-eye-syndrome-ppp-2023',
    2023,
    'evidence_internasional',
  ),
  // Edisi WHO 1997 sempat diusulkan karena memuat tabel dosis, TAPI penyanggah
  // membuka halamannya sendiri dan tidak menemukan tabel itu — jadi tidak
  // dipakai. Proyek ini tidak menyitir isi yang tak dibaca sendiri.
  'who-xerophthalmia-assessment-2014': sumber(
    'who-xerophthalmia-assessment-2014',
    'WHO - Xerophthalmia and Night Blindness for the Assessment of Clinical Vitamin A Deficiency in Individuals and Populations',
    'https://www.who.int/publications/i/item/WHO-NMH-NHD-EPG-14.4',
    2014,
    'evidence_internasional',
  ),
  // Tiga kondisi berikut TIDAK punya pedoman badan profesi mana pun — dicari
  // AAO PPP dan Cochrane, nihil. StatPearls (perpustakaan NIH) dipakai karena
  // ia benar-benar per-penyakit, dan batas kelasnya (tinjauan tersier, bukan
  // pedoman) dinyatakan terbuka ke mahasiswa lewat `catatan`, bukan disimpan
  // sendiri.
  'statpearls-episcleritis-2023': sumber(
    'statpearls-episcleritis-2023',
    'StatPearls (NIH Bookshelf) - Episcleritis',
    'https://www.ncbi.nlm.nih.gov/books/NBK534796/',
    2023,
    'evidence_internasional',
  ),
  'statpearls-subconjunctival-hemorrhage-2025': sumber(
    'statpearls-subconjunctival-hemorrhage-2025',
    'StatPearls (NIH Bookshelf) - Subconjunctival Hemorrhage',
    'https://www.ncbi.nlm.nih.gov/books/NBK551666/',
    2025,
    'evidence_internasional',
  ),
  'statpearls-diseases-of-eyelashes-2023': sumber(
    'statpearls-diseases-of-eyelashes-2023',
    'StatPearls (NIH Bookshelf) - Diseases of the Eyelashes (memuat trikiasis)',
    'https://www.ncbi.nlm.nih.gov/books/NBK537100/',
    2023,
    'evidence_internasional',
  ),
  'kyoto-consensus-hpylori-gastritis-2015': sumber(
    'kyoto-consensus-hpylori-gastritis-2015',
    'Kyoto Global Consensus Report on Helicobacter pylori Gastritis (Gut, mirror PMC/NIH)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC4552923/',
    2015,
    'evidence_internasional',
  ),
  'aaaai-contact-dermatitis-2015': sumber(
    'aaaai-contact-dermatitis-2015',
    'AAAAI/ACAAI/JCAAI Practice Parameter Update: Contact Dermatitis (2015)',
    'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/Contact-dermatitis-2015.pdf',
    2015,
    'evidence_internasional',
  ),
  'csd-cutaneous-warts-2022': sumber(
    'csd-cutaneous-warts-2022',
    'Clinical Guideline for the Diagnosis and Treatment of Cutaneous Warts (2022)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC9825897/',
    2022,
    'evidence_internasional',
  ),
  'cochrane-hordeolum-2017': sumber(
    'cochrane-hordeolum-2017',
    'Cochrane Review: Interventions for an Acute Internal Hordeolum',
    'https://www.cochrane.org/evidence/CD007742_interventions-acute-internal-hordeolum',
    2017,
    'evidence_internasional',
  ),
  'aao-ppp-angle-closure-2025': sumber(
    'aao-ppp-angle-closure-2025',
    'AAO Preferred Practice Pattern: Primary Angle-Closure Disease (2025)',
    'https://www.aao.org/education/preferred-practice-pattern/primary-angle-closure-disease-ppp',
    2025,
    'evidence_internasional',
  ),
  'cochrane-doms-cold-water-immersion-2022': sumber(
    'cochrane-doms-cold-water-immersion-2022',
    'Cochrane Review: Cold-Water Immersion for Preventing and Treating Muscle Soreness after Exercise',
    'https://www.cochrane.org/evidence/CD008262_cold-water-immersion-preventing-and-treating-muscle-soreness-after-exercise',
    2022,
    'evidence_internasional',
  ),
  'who-anc-positive-pregnancy-2016': sumber(
    'who-anc-positive-pregnancy-2016',
    'WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience (2016)',
    'https://www.who.int/publications/i/item/9789241549912',
    2016,
    'evidence_internasional',
  ),
  'acog-uti-pregnancy-2023': sumber(
    'acog-uti-pregnancy-2023',
    'ACOG Clinical Consensus No. 4: Urinary Tract Infection in Pregnant Individuals (2023)',
    'https://www.acog.org/clinical/clinical-guidance/clinical-consensus/articles/2023/08/urinary-tract-infections-in-pregnant-individuals',
    2023,
    'evidence_internasional',
  ),
  'aafp-soft-tissue-masses-2022': sumber(
    'aafp-soft-tissue-masses-2022',
    'AAFP: Evaluation and Management of Soft Tissue Masses in Primary Care (2022)',
    'https://www.aafp.org/pubs/afp/issues/2022/0600/p602.html',
    2022,
    'evidence_internasional',
  ),
  // Sapuan 2026-08-05. Batas yang harus diketahui sebelum memakai ulang
  // sumber ini: berbeda dari saudaranya di atas yang terbuka penuh, artikel
  // AFP 2025 ini baru membuka abstrak dan tabel derajat buktinya kepada
  // pembaca tanpa langganan. AFP biasa membuka teks penuh sekitar setahun
  // sesudah terbit, jadi artikel November 2025 diperkirakan terbuka menjelang
  // akhir 2026. Tetap dipilih karena satu-satunya alternatifnya adalah
  // membiarkan kasus nyeri punggung akut tanpa sumber yang benar-benar
  // membahas fase akut sama sekali.
  'aafp-acute-low-back-pain-2025': sumber(
    'aafp-acute-low-back-pain-2025',
    'AAFP/AFP: Acute Low Back Pain - Diagnosis and Management (2025)',
    'https://www.aafp.org/pubs/afp/issues/2025/1100/acute-low-back-pain.html',
    2025,
    'evidence_internasional',
  ),
  'aafp-acp-nyeri-msk-akut-2020': sumber(
    'aafp-acp-nyeri-msk-akut-2020',
    'AAFP/ACP - Management of Acute Pain from Non-Low Back Musculoskeletal Injuries (2020)',
    'https://www.aafp.org/pubs/afp/issues/2020/1201/p697.html',
    2020,
    'evidence_internasional',
  ),
  'cochrane-systemic-ras-2012': sumber(
    'cochrane-systemic-ras-2012',
    'Cochrane Review: Systemic Interventions for Recurrent Aphthous Stomatitis',
    'https://www.cochrane.org/evidence/CD005411_systemic-interventions-recurrent-aphthous-stomatitis-mouth-ulcers',
    2012,
    'evidence_internasional',
  ),
  'cochrane-acute-laryngitis-antibiotics-2015': sumber(
    'cochrane-acute-laryngitis-antibiotics-2015',
    'Cochrane Review: Antibiotics for Acute Laryngitis in Adults',
    'https://www.cochrane.org/evidence/CD004783_antibiotics-treat-adults-acute-laryngitis',
    2015,
    'evidence_internasional',
  ),
  'rch-cervical-lymphadenitis-2021': sumber(
    'rch-cervical-lymphadenitis-2021',
    "Royal Children's Hospital Melbourne — Clinical Practice Guideline: Cervical Lymphadenopathy",
    'https://www.rch.org.au/clinicalguide/guideline_index/cervical_lymphadenopathy/',
    2021,
    'evidence_internasional',
  ),
  'acog-vulvar-skin-disorders-2020': sumber(
    'acog-vulvar-skin-disorders-2020',
    'ACOG Practice Bulletin No. 224: Diagnosis and Management of Vulvar Skin Disorders (2020)',
    'https://pubmed.ncbi.nlm.nih.gov/32590724/',
    2020,
    'evidence_internasional',
  ),
}

const A = (
  sourceId: string,
  cakupan: Coverage = 'langsung',
  catatan?: string,
): Assignment => ({ sourceId, cakupan, ...(catatan ? { catatan } : {}) })

/** Batas edisi bagan MTBS — dinyatakan ke mahasiswa, bukan disimpan sendiri. */
const CATATAN_MTBS =
  'Edisi yang dapat diverifikasi hidup adalah terbitan 2015 (mengikuti rekomendasi WHO 2014 dan protokol UKK IDAI 2015). Revisi nasional yang lebih baru beredar, tetapi salinan resminya tidak ditemukan; periksa edisi terbaru di fasilitas sebelum memakai angka yang bergantung waktu.'

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
  anemia_defisiensi_bumil: [PPK_DIRECT, A('who-maternal-health-2025')],
  apendisitis_akut: [PPK_DIRECT, A('wses-appendicitis-2025')],
  askariasis: [A('kemenkes-penanggulangan-penyakit-2026', 'terkait'), A('who-sth-2023')],
  asma_eksaserbasi_berat_anak: [PPK_DIRECT, A('gina_2026')],
  asma_ringan: [PPK_DIRECT, A('gina_2026')],
  benda_asing_hidung_anak: [PPK_DIRECT, A('queensland-nasal-foreign-body-2025')],
  bronkitis_akut: [PPK_FLOOR, A('cdc-adult-outpatient-2024')],
  demam_tifoid: [PPK_DIRECT, A('cdc-typhoid-2024')],
  dengue_df: [PPK_DIRECT, A('who_arboviral_2025')],
  // 2026-08-05: pengalihan sementara ke regulasi payung (tingkat 'terkait')
  // DICABUT — bagan MTBS aslinya sudah ditemukan & dibaca, lihat catatan
  // 'kemenkes-mtbs-2015' di registry. Kedua kasus ini persis sasaran bagan
  // itu: diare_akut_anak berpasien 3-5 tahun (bagan menyasar 2 bulan sampai
  // 5 tahun) dan kasus bayi dehidrasi berat jatuh ke Rencana Terapi C.
  // Karena itu tingkatnya naik ke 'langsung'; batas edisinya dinyatakan
  // terbuka lewat catatan, bukan disembunyikan.
  diare_akut_anak: [A('kemenkes-mtbs-2015', 'langsung', CATATAN_MTBS), A('who-child-pneumonia-diarrhoea-2024')],
  diare_akut_bayi_dehidrasi_berat: [A('kemenkes-mtbs-2015', 'langsung', CATATAN_MTBS), A('who-child-pneumonia-diarrhoea-2024')],
  disentri_basiler: [PPK_DIRECT, A('cdc-shigella-2024')],
  dispepsia_fungsional: [PPK_FLOOR, A('bsg-functional-dyspepsia-2022')],
  dm_tipe2: [A('pnpk-dm2-2026'), A('ada-diabetes-2026-type1')],
  faringitis_akut: [PPK_DIRECT, A('cdc-strep-throat-2025')],
  fraktur_terbuka_tibia_stabil: [A('pnpk_trauma_2017', 'terkait'), A('acs-orthopaedic-trauma-2022')],
  gastritis: [PPK_DIRECT, A('kyoto-consensus-hpylori-gastritis-2015')],
  gerd: [PPK_DIRECT, A('acg-gerd-2022')],
  hemoroid_grade1: [PPK_DIRECT, A('aga-hemorrhoids-2026')],
  hipertensi_esensial: [A('pnpk-hipertensi-2026'), A('esc-hypertension-2024')],
  hipoglikemia_ringan_dewasa: [A('pnpk-dm2-2026', 'terkait'), A('ada_hypoglycemia_2026')],
  ispa_common_cold: [PPK_DIRECT, A('cdc-adult-outpatient-2024')],
  jiwa_depresi_ringan: [PPK_DIRECT, A('who-mhgap-2023')],
  jiwa_gangguan_cemas: [PPK_RELATED, A('who-mhgap-2023')],
  jiwa_insomnia: [PPK_DIRECT, A('esrs-insomnia-2023')],
  jiwa_skizofrenia: [PPK_DIRECT, A('who-mhgap-2023')],
  kia_abortus_iminens: [PPK_DIRECT, A('cochrane-threatened-miscarriage-2021')],
  // S-provenance (2026-08-01): who-postnatal-2022 salah-periode (pasca-salin,
  // bukan antenatal) — diganti WHO ANC 2016 yang genuinely membahas kehamilan.
  kia_anc_kehamilan_normal: [A('pmk-spm-2024'), A('who-anc-positive-pregnancy-2016')],
  kia_isk_kehamilan: [
    A('pnpk-isk-2025'),
    A(
      'acog-uti-pregnancy-2023',
      'langsung',
      'Errata terminologi Desember 2024 (PMID 39601712) tidak mengubah rekomendasi inti.',
    ),
  ],
  kia_kb_konseling: [A('permenkes-kespro-2025'), A('who-mec-2025')],
  kia_malaria_falsiparum: [A('kemenkes-malaria-2024'), A('who-malaria-2025')],
  kia_preeklampsia_berat: [A('pnpk_pregnancy_complications_2017'), A('who_preeclampsia_2025')],
  konjungtivitis_bakterial: [PPK_DIRECT, A('aao-conjunctivitis-ppp-2023')],
  kulit_dermatitis_kontak: [PPK_DIRECT, A('aaaai-contact-dermatitis-2015')],
  kulit_herpes_zoster: [PPK_DIRECT, A('cdc-shingles-2024')],
  kulit_kandidiasis_kutis: [PPK_DIRECT, A('who-candidiasis-2025')],
  kulit_morbili: [PPK_DIRECT, A('cdc-measles-2025')],
  kulit_pedikulosis_kapitis: [PPK_DIRECT, A('cdc-head-lice-2024')],
  kulit_pioderma_impetigo: [PPK_DIRECT, A('idsa-ssti-2014')],
  kulit_tinea_korporis: [PPK_DIRECT, A('who-ringworm-2025')],
  kulit_urtikaria_akut: [PPK_DIRECT, A('eaaci-urticaria-2022')],
  kulit_varisela: [PPK_DIRECT, A('cdc-varicella-2024')],
  kulit_veruka_vulgaris: [PPK_DIRECT, A('csd-cutaneous-warts-2022')],
  mata_glaukoma_akut: [PPK_DIRECT, A('aao-ppp-angle-closure-2025')],
  mata_hordeolum: [
    PPK_DIRECT,
    A(
      'cochrane-hordeolum-2017',
      'langsung',
      'Cakupan review terbatas pada hordeolum internum (bukan eksternum); temuan adalah ketiadaan bukti RCT yang memadai, bukan rekomendasi efikasi positif — dasar status tata laksana opsional, bukan wajib.',
    ),
  ],
  mata_konjungtivitis_alergi: [PPK_DIRECT, A('aao-conjunctivitis-ppp-2023')],
  mm_artritis_reumatoid: [PPK_DIRECT, A('eular-ra-2025')],
  mm_dislipidemia: [PPK_DIRECT, A('esc-dyslipidaemia-2025')],
  mm_gagal_jantung_kongestif: [PPK_DIRECT, A('esc-heart-failure-2021')],
  mm_gout_artritis_akut: [PPK_DIRECT, A('acr-gout-2020')],
  mm_hipertensi_urgensi: [A('pnpk-hipertensi-2026'), A('esc-hypertension-2024')],
  mm_isk_bawah: [A('pnpk-isk-2025'), A('eau-urological-infections-2026')],
  // Sapuan 2026-08-05: pedoman WHO itu hanya berlaku untuk nyeri yang sudah
  // menetap lebih dari tiga bulan, sedangkan pasien kasus ini baru sakit sejak
  // kemarin sesudah mengangkat galon. Cakupan 'langsung' lahir semata karena
  // argumen kedua A() dikosongkan dan bawaannya memang 'langsung'.
  mm_low_back_pain: [
    PPK_FLOOR,
    A('aafp-acute-low-back-pain-2025'),
    A(
      'who-low-back-pain-2023',
      'terkait',
      'Pedoman WHO ini hanya untuk nyeri punggung bawah yang sudah menetap lebih dari tiga bulan, sedangkan pasien di kasus ini baru sakit sejak kemarin. Dipakai sebagai konteks arah tata laksana di layanan primer, bukan acuan langsung untuk nyeri baru ini.',
    ),
  ],
  // Sapuan 2026-08-05: kasus ini SENGAJA dibiarkan tanpa sumber 'langsung'.
  // Mialgia mekanik pasca-aktivitas memang tak punya padanan pedoman — tinjauan
  // Cochrane itu hanya menilai berendam air dingin pada relawan berolahraga
  // (nol menyentuh parasetamol, NSAID, istirahat, maupun peregangan yang jadi
  // seluruh isi kunci jawaban kasus ini), sedangkan panduan AAFP/ACP membahas
  // cedera muskuloskeletal akut yang diskret, bukan pegal menyeluruh. Dua
  // temuan periksaCakupan di audit:provenance:quality untuk mm_mialgia adalah
  // konsekuensi yang disengaja; JANGAN "diperbaiki" dengan menaikkan salah satu
  // ke 'langsung' hanya demi memuaskan gerbang audit.
  mm_mialgia: [
    PPK_FLOOR,
    A(
      'aafp-acp-nyeri-msk-akut-2020',
      'terkait',
      'Panduan ini dipakai sebagai acuan cara meredakan nyeri otot akut di layanan primer, bukan sebagai padanan diagnosis kasus ini: yang dibahas di sana cedera muskuloskeletal akut di luar punggung bawah, sedangkan kasus ini pegal menyeluruh setelah kerja fisik berat. Yang menyambung: obat minum pereda nyeri, baik parasetamol maupun NSAID, sama-sama masuk akal dan tidak perlu digabung; pilihan pertama panduan itu sendiri justru NSAID bentuk oles, yang tidak dipakai di sini.',
    ),
    A(
      'cochrane-doms-cold-water-immersion-2022',
      'terkait',
      'Tinjauan ini menilai berendam air dingin pada relawan yang berolahraga, dengan mutu penelitian rendah — bukan dasar tata laksana kasus ini. Dipakai sebatas rujukan fenomena pegal otot setelah aktivitas berlebih; tidak ada satu pun tindakan di kunci jawaban kasus ini yang dinilai olehnya.',
    ),
  ],
  mm_obesitas: [PPK_DIRECT, A('vadod-obesity-2025')],
  mm_osteoartritis_lutut: [PPK_DIRECT, A('vadod-osteoarthritis-2026')],
  otitis_eksterna_akut_ringan: [PPK_DIRECT, A('aao-hns-otitis-externa-2014')],
  otitis_media_akut: [PPK_DIRECT, A('cps-otitis-media-2024')],
  pneumonia_balita: [PPK_DIRECT, A('who-child-pneumonia-diarrhoea-2024')],
  ppok_eksaserbasi: [PPK_DIRECT, A('gold-copd-2026')],
  rinitis_alergi: [PPK_DIRECT, A('aria-rhinitis-2024')],
  saraf_bells_palsy: [PPK_DIRECT, A('aao-hns-bell-palsy-2013')],
  saraf_epilepsi_kejang: [A('pnpk_epilepsi_2026'), A('who-mhgap-2023')],
  saraf_migrain: [PPK_DIRECT, A('ihs-migraine-2024')],
  saraf_tension_headache: [PPK_DIRECT, A('jhs-headache-2025')],
  saraf_vertigo_bppv: [PPK_DIRECT, A('aao-hns-bppv-2017')],
  skabies: [PPK_DIRECT, A('who-scabies-2023')],
  stroke_iskemik: [A('pnpk_stroke_2026'), A('aha_asa_stroke_2026')],
  tb_paru: [A('kemenkes-tb-so-2025'), A('who-tb-treatment-care-2025')],
  tht_epistaksis_anterior: [PPK_FLOOR, A('aao-hns-nosebleed-2020')],
  tht_rinosinusitis_akut: [PPK_DIRECT, A('epos-rhinosinusitis-2020')],
  tht_serumen_prop: [PPK_DIRECT, A('aao-hns-cerumen-2017')],
  tonsilitis_akut: [PPK_DIRECT, A('cdc-strep-throat-2025')],
}

const LAB_FALLBACK_BY_SOURCE: Record<string, string[]> = {
  'eau-paediatric-urology-2026': ['lab_fimosis_patologis_ringan'],
  // Sapuan 2026-08-05: bab prepusium pedoman ini MEMANG membahas parafimosis
  // dan memberi rekomendasi kuat "reduksi manual dulu, bedah bila gagal" —
  // topiknya cocok. Yang tidak cocok POPULASINYA: dokumennya pedoman urologi
  // ANAK sedangkan pasien kasus parafimosis 15-70 tahun. Mengikuti kalibrasi
  // proyek ini — salah populasi turun ke 'terkait' (preseden buta senja),
  // cakupan intervensi lebih sempit tetap 'langsung' + catatan (preseden
  // hordeolum & stomatitis aftosa). Kasus fimosis (5-11 th) tetap 'langsung'.
  // Bacaan tandingan yang sah dan sengaja tidak dipilih: karena parafimosis
  // adalah padanan diagnosis yang persis, ada argumen mempertahankan
  // 'langsung' dan menaruh seluruh batasnya di catatan. Yang menentukan
  // adalah aturan tie-break proyek ini: bila ragu, merendah.
  'eau-paediatric-urology-2026:terkait': ['lab_parafimosis_reduksibel'],
  who_bec: [
    'lab_trauma_tajam_kulit_kepala',
    'lab_vulnus_laseratum_lengan',
  ],
  'cdc-vvc-2021': ['lab_vaginitis_kandida'],
  'eau-urological-infections-2026': ['lab_pielonefritis_tanpa_komplikasi'],
  'cdc-mumps-2024': ['lab_parotitis_mumps'],
  'who-abortion-care-2025': ['lab_abortus_spontan_komplit'],
  'who-postnatal-2022': [
    'lab_puting_lecet',
    'lab_puting_tenggelam_laktasi',
    'lab_mastitis_laktasi',
    'lab_ruptur_perineum_derajat_1',
  ],
  'aad-acne-2024': ['lab_akne_vulgaris_ringan'],
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
  // Sapuan sitasi mata 2026-08-05, kelanjutan audit CODEX temuan 6. Kemarin
  // kesepuluh kasus ini cuma DITURUNKAN ke 'terkait' karena ICOPE dokumen
  // penilaian lansia; hari ini akar masalahnya dibereskan — mereka ternyata
  // enam entitas penyakit yang berbeda, dan tak ada satu dokumen pun yang
  // membahas keenamnya. Kini tiap kelompok memakai sumber per-kondisinya
  // sendiri, sehingga tujuh dari sepuluh kasus jujur berstatus 'langsung'.
  'aao-refractive-errors-ppp-2022': [
    'lab_miopia_ringan',
    'lab_hipermetropia',
    'lab_astigmatisme_ringan',
    'lab_presbiopia',
  ],
  'aao-blepharitis-ppp-2023': ['lab_blefaritis_anterior'],
  'aao-dry-eye-syndrome-ppp-2023': ['lab_mata_kering'],
  'who-xerophthalmia-assessment-2014': ['lab_buta_senja_defisiensi_vitamin_a'],
  'statpearls-episcleritis-2023': ['lab_episkleritis_ringan'],
  'statpearls-subconjunctival-hemorrhage-2025': ['lab_perdarahan_subkonjungtiva'],
  'statpearls-diseases-of-eyelashes-2023': ['lab_trikiasis'],
  'tif-thalassaemia-2021': ['lab_talasemia_beta_mayor_anak'],
  'rcht-paediatric-forearm-fracture-2025': ['lab_fraktur_tertutup_antebrachii_anak'],
  'aafp-soft-tissue-masses-2022': ['lab_lipoma_lengan'],
  'esvs-venous-2022': ['lab_ulkus_tungkai_vena'],
  'eaaci-food-allergy-2024': ['lab_alergi_makanan_ringan'],
  'niddk-lactose-intolerance-2018': ['lab_intoleransi_makanan_laktosa'],
  'who-candidiasis-2025': ['lab_kandidiasis_mulut'],
  'who-food-safety-2024': ['lab_keracunan_makanan_ringan'],
  'wses-cholecystitis-2020': ['lab_kolesistitis_akut'],
  'eau-urolithiasis-2026': ['lab_kolik_ureter_obstruksi'],
  'cochrane-systemic-ras-2012': ['lab_stomatitis_aftosa'],
  'who-influenza-2024': ['lab_influenza_tanpa_komplikasi'],
  'cochrane-acute-laryngitis-antibiotics-2015': ['lab_laringitis_akut'],
  'ats-idsa-cap-2019': ['lab_pneumonia_komunitas_dewasa'],
  'rch-febrile-seizure-2026': ['lab_kejang_demam_sederhana'],
  'bsaci-rhinitis-2017': ['lab_rinitis_vasomotor'],
  'rch-cervical-lymphadenitis-2021': ['lab_limfadenitis_servikal_akut'],
  'acog-vulvar-skin-disorders-2020': ['lab_vulvitis_iritan'],
}

// S-provenance (2026-08-01): catatan batas-interpretasi utk assignment lab_*
// yang datang lewat fallbackMap (fallbackMap tak punya slot catatan bawaan
// spt BASELINE_ASSIGNMENTS/A() 3-argumen). Dipisah di sini agar tak diam-diam
// overclaim — lihat SumberKlinis.catatan di types.ts.
const LAB_FALLBACK_CATATAN: Record<string, string> = {
  // Sapuan sitasi mata 2026-08-05: dokumennya kini benar-benar membahas
  // kondisi kasus, jadi catatan tak lagi perlu meminta maaf soal populasi
  // lansia — yang tersisa adalah batas isi (mengenali, bukan menakar obat)
  // dan batas program suplementasi nasional.
  lab_buta_senja_defisiensi_vitamin_a:
    'Dokumen ini membahas persis kondisi kasus, yaitu kekurangan vitamin A pada mata termasuk buta senja. Isinya cara mengenali dan menilai derajatnya, bukan takaran pengobatan — untuk dosis kapsul vitamin A ikuti pedoman gizi nasional yang berlaku. Perlu diketahui, program pemberian kapsul rutin secara nasional menyasar balita, sedangkan pasien kasus ini sudah usia sekolah.',
  lab_presbiopia:
    'Pedoman ini juga membahas lensa tanam dan pilihan bedah yang berada di luar kewenangan layanan primer; bagian yang dipakai kasus ini hanya penentuan tambahan lensa baca dari hasil pemeriksaan refraksi.',
  lab_episkleritis_ringan:
    'Ini bab tinjauan ringkas per-penyakit dari perpustakaan NIH, bukan pedoman badan profesi — untuk episkleritis memang belum ada pedoman badan profesi maupun tinjauan sistematik. Dipakai sebagai rujukan pengenalan dan pembedaan dari radang lapisan mata yang lebih dalam, bukan sebagai standar terapi.',
  lab_perdarahan_subkonjungtiva:
    'Ini bab tinjauan ringkas per-penyakit dari perpustakaan NIH, bukan pedoman badan profesi; untuk kondisi ini memang belum ada pedoman badan profesi. Dipakai sebagai rujukan pengenalan dan perjalanan penyakit.',
  lab_trikiasis:
    'Judul dokumennya adalah penyakit bulu mata secara umum, bukan pedoman khusus trikiasis — babnya memuat trikiasis dari berbagai sebab, termasuk radang tepi kelopak menahun seperti pada kasus ini. Ini tinjauan ringkas dari perpustakaan NIH, bukan pedoman badan profesi.',
  lab_parafimosis_reduksibel:
    'Bab prepusium pedoman ini membahas parafimosis secara langsung dan memberi rekomendasi kuat "reduksi manual dulu, bedah bila gagal" — langkah yang sama juga berlaku pada dewasa. Yang perlu diketahui: dokumennya pedoman urologi ANAK, sedangkan pasien kasus ini 15 sampai 70 tahun, sehingga angka kejadian dan penyebab yang tertulis di sana untuk anak. Dipakai sebagai dasar langkah reduksinya, bukan sebagai rujukan populasi dewasa. Pedoman dewasa yang setara memang belum ada: pedoman EAU untuk laki-laki dewasa hanya mencakup hipogonadisme, gangguan ereksi dan ejakulasi, bentuk dan ukuran penis, priapismus, serta kesuburan — tanpa bab kulup.',
  lab_stomatitis_aftosa:
    'Tinjauan ini menilai HANYA intervensi sistemik (kortikosteroid oral, colchicine, pentoxifylline, dll) untuk RAS — tidak mencakup kortikosteroid topikal (mis. triamsinolon asetonid orabase) yang menjadi tata laksana PPK pada kasus ini; dipakai sbg rujukan diagnosis/epidemiologi RAS, bukan pembenaran regimen topikal.',
}

/**
 * Daftar-izin catatan untuk sumber EBM internasional yang datang lewat berkas
 * adjudikasi (bukan lewat fallbackMap). Dua fungsi sekaligus:
 *   1. memberi slot catatan yang selama ini memang tidak ada di jalur itu, dan
 *   2. menjadi gerbang — sumber internasional KEDUA dan seterusnya hanya
 *      didaftarkan bila pasangan kasus::sumber-nya punya catatan tertulis di
 *      sini, sehingga tak ada sumber baru yang bisa menyelinap ke mata
 *      mahasiswa tanpa batas interpretasinya ikut terbaca.
 * Ditambahkan pada sapuan sitasi 2026-08-05.
 */
const EBM_CATATAN: Record<string, string> = {
  'lab_anemia_berat_perlu_transfusi::aabb-rbc-transfusion-2023':
    'Pedoman AABB ini mengatur keputusan transfusi untuk pasien dewasa yang sudah dirawat inap di rumah sakit dan kondisinya stabil, bukan untuk Puskesmas. Ambang hemoglobin di bawah 7 yang disebutnya adalah ambang yang nanti dipakai tim rumah sakit penerima rujukan, bukan izin mentransfusi di sini. Tugas layanan primer pada kasus ini mengenali kegawatan, menyiapkan rujukan, dan mengirim data yang dibutuhkan tim penerima.',
  'lab_anemia_berat_perlu_transfusi::acog-aub-2013':
    'Dokumen ini membahas perdarahan rahim AKUT, yaitu perdarahan yang menurut penilaian klinisi butuh tindakan segera untuk menghentikan kehilangan darah, sedangkan pasien ini haid banyak menahun delapan bulan yang menurut definisi dokumen itu sendiri tergolong menahun. Dipakai sebatas kerangka menilai kestabilan dan menelusuri sumber perdarahan; obat dan tindakan penghenti perdarahan yang disebutnya adalah ranah rumah sakit, bukan layanan primer.',
  'lab_abses_peritonsil::chop-peritonsillar-abscess-2025':
    'Jalur klinis ini disusun untuk pasien anak dan remaja: simpul masuknya anak, ambang usianya anak, dan takaran obatnya menurut berat badan. Pasien kasus ini 15 sampai 50 tahun. Dipakai sebagai kerangka simpul keputusan — risiko jalan napas, tanda infeksi berat, kemampuan minum, kontrol nyeri, dan kapan melibatkan spesialis THT — bukan sebagai rujukan populasi dewasa.',
}

function fallbackMap(): Map<string, Assignment> {
  const result = new Map<string, Assignment>()
  for (const [rawSourceId, caseIds] of Object.entries(LAB_FALLBACK_BY_SOURCE)) {
    const [sourceId, qualifier] = rawSourceId.split(':')
    const cakupan: Coverage = qualifier ? 'terkait' : 'langsung'
    for (const caseId of caseIds) {
      if (result.has(caseId)) throw new Error(`Fallback provenance lab duplikat: ${caseId}`)
      result.set(caseId, A(sourceId!, cakupan, LAB_FALLBACK_CATATAN[caseId]))
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

  // `cakupan`/`catatan` adalah properti ASSIGNMENT (relasi sumber↔kasus),
  // bukan properti definisi sumber. SUMBER_IGD menyimpan keduanya sekaligus,
  // jadi menyalinnya bulat-bulat membocorkan `cakupan` ke registry — dan
  // registry di-render `satisfies Omit<SumberKlinis, 'cakupan'|'catatan'>`,
  // sehingga 11 entri gagal typecheck setiap kali generator dijalankan.
  // Bug pra-ada yang selama ini menghalangi regenerasi penuh (audit 2026-08-04).
  for (const item of Object.values(SUMBER_IGD)) {
    const { cakupan: _cakupan, catatan: _catatan, ...definisi } = item
    add(definisi)
  }
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
    // Sama seperti catatan di loop SUMBER_IGD di atas: entri IGD membawa
    // `cakupan`/`catatan` yang tak boleh ikut ke definisi sumber.
    'stroke-2026': (() => {
      const { cakupan: _c, catatan: _n, ...definisi } = SUMBER_IGD.pnpk_stroke_2026
      return { ...definisi, id: 'pnpk-stroke-2026' }
    })(),
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
      // Sortir HANYA pada peringkat relasi. Sempat dicoba menambah kunci kedua
      // berupa abjad sourceId, dengan alasan urutan array di config.ts membuat
      // pemenang jadi kebetulan. Dibatalkan setelah hasilnya diperiksa: sort
      // JavaScript sudah stabil, jadi di antara sumber sederajat yang menang
      // adalah yang ditulis lebih dulu — dan itu URUTAN KURASI PENULIS, bukan
      // kebetulan. Abjad justru merusaknya: pneumotoraks tertukar dari pedoman
      // pneumotoraks BTS 2023 ke pedoman oksigen BTS 2017, somatoform dari
      // ICD-11 CDDR 2024 ke pedoman Jerman 2019, dan TIA dari pedoman TIA AHA
      // 2023 ke pencegahan stroke 2021. Semuanya lebih buruk.
      .sort((a, b) => Number(b.relation === 'direct') - Number(a.relation === 'direct'))
    const [utama, ...sisa] = international
    if (utama?.sourceId) {
      assignments.push(
        A(utama.sourceId, relation(utama.relation), EBM_CATATAN[`${kasus.id}::${utama.sourceId}`]),
      )
      // Sumber internasional kedua dan seterusnya hanya ikut bila pasangan
      // kasus::sumber-nya punya catatan batas yang ditulis manusia. Gerbang
      // ini disengaja: 30 dari 137 kasus punya lebih dari satu sumber
      // internasional, jadi "ambil semua" akan mendorong puluhan sumber baru
      // ke layar mahasiswa tanpa catatan — persis pola cacat ICOPE, tapi
      // sekaligus di banyak kasus.
      for (const tambahan of sisa) {
        if (!tambahan.sourceId) continue
        const catatan = EBM_CATATAN[`${kasus.id}::${tambahan.sourceId}`]
        if (!catatan) continue
        assignments.push(A(tambahan.sourceId, relation(tambahan.relation), catatan))
      }
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
