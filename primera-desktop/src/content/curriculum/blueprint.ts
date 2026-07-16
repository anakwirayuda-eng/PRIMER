import { LAB_CONTENT_RELEASE, LEGACY_CONTENT_RELEASE, type ContentCatalog } from '../pack'
import type { IndikatorPisPk, KasusIgd, KasusKlinis } from '../types'
import type {
  ClinicalConcept,
  CurriculumBlueprint,
  CurriculumItem,
  CurriculumItemConcept,
  EncounterArchetype,
  EvidenceBinding,
  ExcludedCredit,
  ModePolicy,
  ReleasePolicy,
  UkmScenario,
} from './types'
import { buildM13DeltaEvidenceBindings } from './m13DeltaAudit'
import { LAB_ALL_ARCHETYPE_SPECS } from '../lab'

export const FKTP144_CATALOG_ID = 'fktp144-1186-2022'
export const EXISTING_CLINICAL_CATALOG_ID = 'existing-clinical-baseline-2026-07-14'
export const PIS_PK_CATALOG_ID = 'pis-pk-39-2016'

interface ClinicArchetypeSpec {
  conceptId: string
  credits: string[]
  excludedCredits?: ExcludedCredit[]
}

const BASE_CLINIC_ARCHETYPE_SPEC: Record<string, ClinicArchetypeSpec> = {
  anemia_defisiensi_bumil: { conceptId: 'concept:anemia_pregnancy', credits: ['fktp144:anemia_pregnancy'] },
  apendisitis_akut: { conceptId: 'concept:apendisitis_akut', credits: ['clinical:apendisitis_akut'] },
  askariasis: { conceptId: 'concept:ascariasis', credits: ['fktp144:ascariasis'] },
  asma_ringan: { conceptId: 'concept:asthma', credits: ['fktp144:asthma_bronchiale'] },
  bronkitis_akut: { conceptId: 'concept:bronchitis_acute', credits: ['fktp144:bronchitis_acute'] },
  demam_tifoid: { conceptId: 'concept:typhoid_fever', credits: ['fktp144:typhoid_fever'] },
  dengue_df: { conceptId: 'concept:dengue', credits: ['fktp144:dengue_df'] },
  diare_akut_anak: { conceptId: 'concept:acute_gastroenteritis', credits: ['fktp144:acute_gastroenteritis'] },
  disentri_basiler: { conceptId: 'concept:bacillary_dysentery', credits: ['fktp144:dysentery'] },
  dispepsia_fungsional: { conceptId: 'concept:dispepsia_fungsional', credits: ['clinical:dispepsia_fungsional'] },
  dm_tipe2: { conceptId: 'concept:dm_type2', credits: ['fktp144:dm_type2'] },
  faringitis_akut: { conceptId: 'concept:acute_pharyngitis', credits: ['fktp144:acute_pharyngitis'] },
  gastritis: { conceptId: 'concept:gastritis_acute', credits: ['fktp144:gastritis_acute'] },
  gerd: { conceptId: 'concept:gerd', credits: ['fktp144:gerd'] },
  hemoroid_grade1: { conceptId: 'concept:hemorrhoid_12', credits: ['fktp144:hemorrhoid_12'] },
  hipertensi_esensial: { conceptId: 'concept:hypertension', credits: ['fktp144:hypertension_primary'] },
  ispa_common_cold: { conceptId: 'concept:ispa_common', credits: ['fktp144:ispa_common'] },
  jiwa_depresi_ringan: { conceptId: 'concept:jiwa_depresi_ringan', credits: ['clinical:jiwa_depresi_ringan'] },
  jiwa_gangguan_cemas: { conceptId: 'concept:jiwa_gangguan_cemas', credits: ['clinical:jiwa_gangguan_cemas'] },
  jiwa_insomnia: { conceptId: 'concept:insomnia', credits: ['fktp144:insomnia'] },
  jiwa_skizofrenia: { conceptId: 'concept:jiwa_skizofrenia', credits: ['clinical:jiwa_skizofrenia'] },
  kia_abortus_iminens: { conceptId: 'concept:kia_abortus_iminens', credits: ['clinical:kia_abortus_iminens'] },
  kia_anc_kehamilan_normal: { conceptId: 'concept:normal_pregnancy', credits: ['fktp144:normal_pregnancy'] },
  kia_isk_kehamilan: { conceptId: 'concept:uti', credits: ['fktp144:uti'] },
  kia_kb_konseling: { conceptId: 'concept:kia_kb_konseling', credits: ['clinical:kia_kb_konseling'] },
  kia_malaria_falsiparum: { conceptId: 'concept:malaria', credits: ['fktp144:malaria_vivax'] },
  kia_preeklampsia_berat: { conceptId: 'concept:kia_preeklampsia_berat', credits: ['clinical:kia_preeklampsia_berat'] },
  konjungtivitis_bakterial: { conceptId: 'concept:conjunctivitis_bacterial', credits: ['fktp144:conjunctivitis_bacterial'] },
  kulit_dermatitis_kontak: { conceptId: 'concept:kulit_dermatitis_kontak', credits: ['clinical:kulit_dermatitis_kontak'] },
  kulit_herpes_zoster: { conceptId: 'concept:herpes_zoster', credits: ['fktp144:herpes_zoster'] },
  kulit_kandidiasis_kutis: { conceptId: 'concept:candidiasis_mucocutan', credits: ['fktp144:candidiasis_mucocutan'] },
  kulit_morbili: { conceptId: 'concept:morbilli', credits: ['fktp144:morbilli'] },
  kulit_pedikulosis_kapitis: { conceptId: 'concept:pediculosis_capitis', credits: ['fktp144:pediculosis_capitis'] },
  kulit_pioderma_impetigo: { conceptId: 'concept:impetigo', credits: ['fktp144:impetigo'] },
  kulit_tinea_korporis: { conceptId: 'concept:tinea_corporis', credits: ['fktp144:tinea_corporis'] },
  kulit_urtikaria_akut: { conceptId: 'concept:urticaria_acute', credits: ['fktp144:urticaria_acute'] },
  kulit_varisela: { conceptId: 'concept:varicella', credits: ['fktp144:varicella'] },
  kulit_veruka_vulgaris: { conceptId: 'concept:verruca_vulgaris', credits: ['fktp144:verruca_vulgaris'] },
  mata_glaukoma_akut: { conceptId: 'concept:mata_glaukoma_akut', credits: ['clinical:mata_glaukoma_akut'] },
  mata_hordeolum: { conceptId: 'concept:hordeolum', credits: ['fktp144:hordeolum'] },
  mata_konjungtivitis_alergi: { conceptId: 'concept:mata_konjungtivitis_alergi', credits: ['clinical:mata_konjungtivitis_alergi'] },
  mm_artritis_reumatoid: { conceptId: 'concept:mm_artritis_reumatoid', credits: ['clinical:mm_artritis_reumatoid'] },
  mm_dislipidemia: { conceptId: 'concept:dyslipidemia', credits: ['fktp144:dyslipidemia'] },
  mm_gagal_jantung_kongestif: { conceptId: 'concept:mm_gagal_jantung_kongestif', credits: ['clinical:mm_gagal_jantung_kongestif'] },
  mm_gout_artritis_akut: { conceptId: 'concept:gout_arthritis', credits: ['fktp144:hyperuricemia'] },
  mm_hipertensi_urgensi: { conceptId: 'concept:hypertension', credits: ['clinical:mm_hipertensi_urgensi'] },
  mm_isk_bawah: { conceptId: 'concept:lower_uti', credits: ['fktp144:lower_uti'] },
  mm_low_back_pain: { conceptId: 'concept:mm_low_back_pain', credits: ['clinical:mm_low_back_pain'] },
  mm_mialgia: { conceptId: 'concept:mm_mialgia', credits: ['clinical:mm_mialgia'] },
  mm_obesitas: { conceptId: 'concept:obesity', credits: ['fktp144:obesity'] },
  mm_osteoartritis_lutut: { conceptId: 'concept:mm_osteoartritis_lutut', credits: ['clinical:mm_osteoartritis_lutut'] },
  otitis_media_akut: { conceptId: 'concept:otitis_media_acute', credits: ['fktp144:otitis_media_acute'] },
  pneumonia_balita: {
    conceptId: 'concept:pneumonia',
    credits: ['clinical:pneumonia_balita'],
    excludedCredits: [
      {
        itemId: 'fktp144:pneumonia_bacterial',
        reason: 'Archetype ini pneumonia balita berat level 3B/rujuk; tidak menyertifikasi kompetensi tuntas-FKTP 4A. Dibutuhkan archetype poli 4A terpisah.',
      },
    ],
  },
  ppok_eksaserbasi: { conceptId: 'concept:ppok_eksaserbasi', credits: ['clinical:ppok_eksaserbasi'] },
  rinitis_alergi: { conceptId: 'concept:rhinitis_allergic', credits: ['fktp144:rhinitis_allergic'] },
  saraf_bells_palsy: { conceptId: 'concept:bells_palsy', credits: ['fktp144:bells_palsy'] },
  saraf_epilepsi_kejang: { conceptId: 'concept:saraf_epilepsi_kejang', credits: ['clinical:saraf_epilepsi_kejang'] },
  saraf_migrain: { conceptId: 'concept:migraine', credits: ['fktp144:migraine'] },
  saraf_tension_headache: { conceptId: 'concept:tension_headache', credits: ['fktp144:tension_headache'] },
  saraf_vertigo_bppv: { conceptId: 'concept:vertigo_bppv', credits: ['fktp144:vertigo_bppv'] },
  skabies: { conceptId: 'concept:scabies', credits: ['fktp144:scabies'] },
  stroke_iskemik: { conceptId: 'concept:stroke_iskemik', credits: ['clinical:stroke_iskemik'] },
  tb_paru: { conceptId: 'concept:tb_pulmonary', credits: ['fktp144:tb_pulmonary'] },
  tht_epistaksis_anterior: { conceptId: 'concept:epistaxis', credits: ['fktp144:epistaxis'] },
  tht_rinosinusitis_akut: { conceptId: 'concept:tht_rinosinusitis_akut', credits: ['clinical:tht_rinosinusitis_akut'] },
  tht_serumen_prop: { conceptId: 'concept:cerumen_prop', credits: ['fktp144:cerumen_prop'] },
  tonsilitis_akut: { conceptId: 'concept:tonsillitis_acute', credits: ['fktp144:tonsillitis_acute'] },
}

const CLINIC_ARCHETYPE_SPEC: Record<string, ClinicArchetypeSpec> = {
  ...BASE_CLINIC_ARCHETYPE_SPEC,
  ...LAB_ALL_ARCHETYPE_SPECS,
}

const CATALOG_CONCEPT_OVERRIDES: Record<string, ClinicalConcept[]> = {
  acute_gastroenteritis: [
    { id: 'concept:acute_gastroenteritis', diagnosis: 'Gastroenteritis akut' },
    { id: 'concept:cholera', diagnosis: 'Kolera' },
    { id: 'concept:giardiasis', diagnosis: 'Giardiasis' },
  ],
  asthma_bronchiale: [{ id: 'concept:asthma', diagnosis: 'Asma', aliases: ['Asma bronkial'] }],
  dengue_df: [{ id: 'concept:dengue', diagnosis: 'Infeksi dengue', aliases: ['Demam dengue', 'DHF', 'DSS'] }],
  drug_eruption: [
    { id: 'concept:exanthematous_drug_eruption', diagnosis: 'Erupsi obat eksantematosa' },
    { id: 'concept:fixed_drug_eruption', diagnosis: 'Fixed drug eruption' },
  ],
  dysentery: [
    { id: 'concept:bacillary_dysentery', diagnosis: 'Disentri basiler' },
    { id: 'concept:amoebic_dysentery', diagnosis: 'Disentri amuba' },
  ],
  furuncle: [
    { id: 'concept:furuncle', diagnosis: 'Furunkel' },
    { id: 'concept:carbuncle', diagnosis: 'Karbunkel' },
  ],
  genital_discharge: [
    { id: 'concept:gonorrhea', diagnosis: 'Gonore' },
    { id: 'concept:nongonococcal_genital_discharge', diagnosis: 'Sindrom duh genital non-gonore' },
  ],
  gonorrhea: [{ id: 'concept:gonorrhea', diagnosis: 'Gonore' }],
  hyperuricemia: [
    { id: 'concept:hyperuricemia', diagnosis: 'Hiperurisemia' },
    { id: 'concept:gout_arthritis', diagnosis: 'Artritis gout', aliases: ['Gout arthritis'] },
  ],
  hypertension_primary: [{ id: 'concept:hypertension', diagnosis: 'Hipertensi', aliases: ['Hipertensi esensial'] }],
  hypoglycemia_mild: [{ id: 'concept:hypoglycemia', diagnosis: 'Hipoglikemia' }],
  malaria_vivax: [{ id: 'concept:malaria', diagnosis: 'Malaria', aliases: ['Malaria vivax', 'Malaria falciparum'] }],
  pneumonia_bacterial: [{ id: 'concept:pneumonia', diagnosis: 'Pneumonia bakterial', aliases: ['Pneumonia'] }],
  stomatitis_aftosa: [
    { id: 'concept:aphthous_ulcer', diagnosis: 'Ulkus aftosa' },
    { id: 'concept:herpes_simplex', diagnosis: 'Herpes simpleks oral' },
  ],
  herpes_simplex: [{ id: 'concept:herpes_simplex', diagnosis: 'Herpes simpleks' }],
  vulnus_laseratum: [
    { id: 'concept:laceration', diagnosis: 'Vulnus laseratum' },
    { id: 'concept:puncture_wound', diagnosis: 'Vulnus punctum' },
  ],
}

const IGD_CONCEPT_BY_ID: Record<string, string> = {
  // 5 baseline — concept-nya sudah lahir dari katalog FKTP-144.
  igd_asma_berat: 'concept:asthma',
  igd_dengue_syok: 'concept:dengue',
  igd_hipoglikemia: 'concept:hypoglycemia',
  igd_kejang_demam: 'concept:febrile_seizure',
  igd_syok_anafilaksis: 'concept:anaphylaxis',
  // M13 Batch 4 (prototipe lab, Career-only) — concept-nya didaftarkan di
  // IGD_ONLY_CONCEPTS karena tak ada padanannya di katalog 144.
  igd_status_epileptikus: 'concept:status_epilepticus',
  igd_cedera_kepala_sedang: 'concept:moderate_head_injury',
  igd_luka_bakar_luas: 'concept:major_burn',
  igd_ketoasidosis_diabetik: 'concept:diabetic_ketoacidosis',
  igd_stroke_iskemik_window: 'concept:acute_ischemic_stroke_window',
  igd_perdarahan_pascasalin: 'concept:postpartum_hemorrhage',
  igd_asfiksia_neonatorum: 'concept:neonatal_asphyxia',
  igd_tenggelam: 'concept:drowning',
  igd_keracunan_organofosfat: 'concept:organophosphate_poisoning',
  igd_gigitan_ular_berbisa: 'concept:venomous_snakebite',
  igd_syok_sepsis: 'concept:septic_shock',
  igd_eklampsia: 'concept:eclampsia',
  igd_sumbatan_jalan_napas_anak: 'concept:pediatric_airway_obstruction',
  igd_pneumotoraks_tension_trauma: 'concept:tension_pneumothorax',
}

/**
 * Concept yang HANYA lahir lewat kanal IGD (M13 Batch 4). Katalog 144 dan kasus
 * klinik standalone masing-masing sudah membuat concept-nya sendiri; kegawatan
 * di bawah tak punya padanan di keduanya, jadi harus didaftarkan eksplisit —
 * tanpa ini `validasiCurriculumBlueprint` menolak archetype-nya sebagai
 * "concept tidak ada".
 */
const IGD_ONLY_CONCEPTS: Record<string, string> = {
  'concept:status_epilepticus': 'Status Epileptikus',
  'concept:moderate_head_injury': 'Cedera Kepala Sedang',
  'concept:major_burn': 'Luka Bakar Luas',
  'concept:diabetic_ketoacidosis': 'Ketoasidosis Diabetik',
  'concept:acute_ischemic_stroke_window': 'Stroke Iskemik Akut dalam Jendela Terapi',
  'concept:postpartum_hemorrhage': 'Perdarahan Pascasalin',
  'concept:neonatal_asphyxia': 'Asfiksia Neonatorum',
  'concept:drowning': 'Tenggelam',
  'concept:organophosphate_poisoning': 'Keracunan Organofosfat',
  'concept:venomous_snakebite': 'Gigitan Ular Berbisa',
  'concept:septic_shock': 'Syok Sepsis',
  'concept:eclampsia': 'Eklampsia',
  'concept:pediatric_airway_obstruction': 'Sumbatan Jalan Napas Anak',
  'concept:tension_pneumothorax': 'Pneumotoraks Tension Traumatik',
}

const UKM_OBJECTIVE_LABELS: Record<IndikatorPisPk, string> = {
  kb: 'Keluarga mengikuti program KB',
  persalinan_faskes: 'Persalinan ibu dilakukan di fasilitas pelayanan kesehatan',
  imunisasi_dasar: 'Bayi mendapat imunisasi dasar lengkap',
  asi_eksklusif: 'Bayi mendapat ASI eksklusif',
  pantau_tumbuh_kembang: 'Pertumbuhan balita dipantau',
  tb_berobat_standar: 'Penderita TB paru berobat sesuai standar',
  hipertensi_berobat: 'Penderita hipertensi berobat teratur',
  jiwa_tidak_ditelantarkan: 'Penderita gangguan jiwa mendapat pengobatan dan tidak ditelantarkan',
  tidak_merokok: 'Anggota keluarga tidak ada yang merokok',
  jkn: 'Keluarga menjadi anggota JKN',
  air_bersih: 'Keluarga memiliki akses sarana air bersih',
  jamban_sehat: 'Keluarga memiliki akses atau menggunakan jamban sehat',
}

export const PIS_PK_OBJECTIVE_IDS = Object.keys(UKM_OBJECTIVE_LABELS) as IndikatorPisPk[]

const IGD_CREDIT_RATIONALE =
  'Flow IGD saat ini tidak memiliki keputusan diagnosis dan tidak menulis Dex; archetype hanya dapat menandai konsep dijumpai, bukan menyertifikasi item.'

/**
 * M13 Batch 4: kedua helper ini semula hanya menerima `KasusKlinis` sehingga
 * kanal IGD selalu memanggilnya TANPA argumen — artinya setiap kasus IGD baru
 * otomatis `ujian: true`. Dilonggarkan ke bentuk struktural supaya `KasusIgd`
 * ikut terbaca: kasus IGD prototipe lab kini Career-only persis seperti
 * saudaranya di kanal klinik, tanpa menyentuh 5 kasus IGD baseline.
 */
type BerstatusAktivasi = { activationStatus?: KasusKlinis['activationStatus'] }

function currentModePolicy(kasus?: BerstatusAktivasi): ModePolicy {
  return kasus?.activationStatus === 'lab_prototype_unadjudicated'
    ? { karier: true, ujian: false }
    : { karier: true, ujian: true }
}

function releasePolicyFor(kasus?: BerstatusAktivasi): ReleasePolicy {
  return {
    introducedIn: kasus?.activationStatus === 'lab_prototype_unadjudicated'
      ? LAB_CONTENT_RELEASE
      : LEGACY_CONTENT_RELEASE,
  }
}

function compareIds(a: { id: string }, b: { id: string }): number {
  return a.id.localeCompare(b.id)
}

function assertExactKeys(label: string, expected: string[], actual: string[]): void {
  const expectedSet = new Set(expected)
  const actualSet = new Set(actual)
  const missing = expected.filter((id) => !actualSet.has(id))
  const extra = actual.filter((id) => !expectedSet.has(id))
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(`${label}: mapping tidak eksak; hilang=[${missing.join(', ')}], ekstra=[${extra.join(', ')}]`)
  }
}

function catalogConcepts(entry: ContentCatalog['skdi144'][number]): ClinicalConcept[] {
  return CATALOG_CONCEPT_OVERRIDES[entry.id] ?? [{ id: `concept:${entry.id}`, diagnosis: entry.nama }]
}

function severityForClinic(kasus: KasusKlinis): EncounterArchetype['severityDegree'] {
  if (!kasus.harusDirujuk) return 'uncomplicated_or_stable'
  return kasus.stabilisasiWajib ? 'referral_needs_stabilization' : 'referral_required'
}

function targetForClinic(kasus: KasusKlinis): EncounterArchetype['targetFktp'] {
  if (!kasus.harusDirujuk) return 'manage_at_fktp'
  return kasus.stabilisasiWajib ? 'stabilize_then_refer' : 'refer'
}

function targetForIgd(kasus: KasusIgd): EncounterArchetype['targetFktp'] {
  return kasus.disposisiBenar === 'rujuk' ? 'stabilize_then_refer' : 'stabilize_then_discharge'
}

function populationOf(kasus: KasusKlinis | KasusIgd): string {
  const gender = kasus.demografi.jenisKelamin ? `; gender=${kasus.demografi.jenisKelamin}` : ''
  return `usia=${kasus.demografi.usiaMin}-${kasus.demografi.usiaMax} tahun${gender}`
}

export function buildCurriculumBlueprint(pack: ContentCatalog): CurriculumBlueprint {
  assertExactKeys('Kasus klinik', Object.keys(pack.kasus).sort(), Object.keys(CLINIC_ARCHETYPE_SPEC).sort())
  assertExactKeys('Kasus IGD', Object.keys(pack.kasusIgd).sort(), Object.keys(IGD_CONCEPT_BY_ID).sort())

  const curriculumItems: CurriculumItem[] = pack.skdi144.map((entry) => ({
    id: `fktp144:${entry.id}`,
    catalogId: FKTP144_CATALOG_ID,
    domain: 'ukp',
    judulResmi: entry.nama,
    skdiLevel: '4A',
    statusReview: 'mapped',
  }))

  const standaloneCaseIds = Object.entries(CLINIC_ARCHETYPE_SPEC)
    .filter(([, spec]) => spec.credits.some((id) => id.startsWith('clinical:')))
    .map(([caseId]) => caseId)
    .sort()

  for (const caseId of standaloneCaseIds) {
    const kasus = pack.kasus[caseId]
    if (!kasus) throw new Error(`Kasus standalone '${caseId}' tidak ada di PACK`)
    curriculumItems.push({
      id: `clinical:${caseId}`,
      catalogId: EXISTING_CLINICAL_CATALOG_ID,
      domain: 'ukp',
      judulResmi: kasus.nama,
      skdiLevel: kasus.skdi,
      statusReview: 'needs_source_review',
    })
  }

  for (const objectiveId of PIS_PK_OBJECTIVE_IDS) {
    curriculumItems.push({
      id: `ukm:pis-pk:${objectiveId}`,
      catalogId: PIS_PK_CATALOG_ID,
      domain: 'ukm',
      judulResmi: UKM_OBJECTIVE_LABELS[objectiveId],
      statusReview: 'mapped',
    })
  }
  curriculumItems.sort(compareIds)

  const conceptMap = new Map<string, ClinicalConcept>()
  const itemConcepts: CurriculumItemConcept[] = []
  for (const entry of pack.skdi144) {
    for (const concept of catalogConcepts(entry)) {
      conceptMap.set(concept.id, concept)
      itemConcepts.push({ itemId: `fktp144:${entry.id}`, conceptId: concept.id })
    }
  }

  for (const caseId of standaloneCaseIds) {
    const kasus = pack.kasus[caseId]!
    const spec = CLINIC_ARCHETYPE_SPEC[caseId]!
    if (!conceptMap.has(spec.conceptId)) {
      conceptMap.set(spec.conceptId, { id: spec.conceptId, diagnosis: kasus.nama })
    }
    itemConcepts.push({ itemId: `clinical:${caseId}`, conceptId: spec.conceptId })
  }
  itemConcepts.sort((a, b) => `${a.itemId}:${a.conceptId}`.localeCompare(`${b.itemId}:${b.conceptId}`))

  const encounterArchetypes: EncounterArchetype[] = Object.values(pack.kasus)
    .sort(compareIds)
    .map((kasus) => {
      const spec = CLINIC_ARCHETYPE_SPEC[kasus.id]!
      return {
        id: `clinic:${kasus.id}`,
        conceptId: spec.conceptId,
        contentRef: { kind: 'clinic', id: kasus.id },
        channel: 'clinic',
        severityDegree: severityForClinic(kasus),
        targetFktp: targetForClinic(kasus),
        prevalensi: kasus.prevalensi ?? 'sedang',
        modePolicy: currentModePolicy(kasus),
        releasePolicy: releasePolicyFor(kasus),
        credits: [...spec.credits],
        excludedCredits: spec.excludedCredits?.map((credit) => ({ ...credit })),
      }
    })

  for (const kasus of Object.values(pack.kasusIgd).sort(compareIds)) {
    const conceptId = IGD_CONCEPT_BY_ID[kasus.id]!
    if (!conceptMap.has(conceptId)) {
      const diagnosis = IGD_ONLY_CONCEPTS[conceptId]
      if (!diagnosis) {
        throw new Error(`Kasus IGD '${kasus.id}': concept '${conceptId}' tak lahir dari katalog manapun & tak terdaftar di IGD_ONLY_CONCEPTS`)
      }
      conceptMap.set(conceptId, { id: conceptId, diagnosis })
    }
    const relatedItems = itemConcepts.filter((relation) => relation.conceptId === conceptId).map((relation) => relation.itemId)
    encounterArchetypes.push({
      id: `igd:${kasus.id}`,
      conceptId,
      contentRef: { kind: 'igd', id: kasus.id },
      channel: 'igd',
      severityDegree: 'emergency',
      targetFktp: targetForIgd(kasus),
      prevalensi: 'not_modeled',
      modePolicy: currentModePolicy(kasus),
      releasePolicy: releasePolicyFor(kasus),
      credits: [],
      excludedCredits: relatedItems.map((itemId) => ({ itemId, reason: IGD_CREDIT_RATIONALE })),
      creditRationale: IGD_CREDIT_RATIONALE,
    })
  }
  encounterArchetypes.sort(compareIds)

  const ukmScenarios: UkmScenario[] = []
  for (const keluarga of Object.values(pack.keluarga).sort(compareIds)) {
    for (const scenario of keluarga.arc.kunjungan) {
      ukmScenarios.push({
        id: `ukm:${keluarga.id}:${scenario.id}`,
        contentRef: { familyId: keluarga.id, visitId: scenario.id },
        modePolicy: currentModePolicy(),
        releasePolicy: releasePolicyFor(),
        credits: scenario.target.map((target) => `ukm:pis-pk:${target}`),
      })
    }
  }
  ukmScenarios.sort(compareIds)

  const evidenceBindings: EvidenceBinding[] = curriculumItems.map((item) => {
    if (item.catalogId === FKTP144_CATALOG_ID) {
      return {
        id: `evidence:${item.id}:membership`,
        subject: { kind: 'curriculum_item', id: item.id },
        facet: 'membership',
        source: 'KMK-HK.01.07-MENKES-1186-2022',
        locator: `entry=${item.id.slice('fktp144:'.length)}; page locator pending M13-0B`,
        reviewStatus: 'pending',
      }
    }
    if (item.catalogId === PIS_PK_CATALOG_ID) {
      return {
        id: `evidence:${item.id}:ukm-objective`,
        subject: { kind: 'curriculum_item', id: item.id },
        facet: 'ukm-objective',
        source: 'Permenkes-39-2016',
        locator: `12 indikator PIS-PK; page locator pending M13-0B`,
        reviewStatus: 'pending',
      }
    }
    return {
      id: `evidence:${item.id}:skdi`,
      subject: { kind: 'curriculum_item', id: item.id },
      facet: 'skdi',
      source: 'source-pending:M13-0B',
      locator: `existing self-tag ${item.id}; authoritative locator pending`,
      reviewStatus: 'pending',
    }
  })

  const m13DeltaBindings = buildM13DeltaEvidenceBindings()
  const m13AuditedArchetypeIds = new Set(m13DeltaBindings.map((binding) => binding.subject.id))

  for (const archetype of encounterArchetypes) {
    if (m13AuditedArchetypeIds.has(archetype.id)) continue
    const kasus = archetype.contentRef.kind === 'clinic'
      ? pack.kasus[archetype.contentRef.id]
      : pack.kasusIgd[archetype.contentRef.id]
    if (!kasus) throw new Error(`ContentRef '${archetype.contentRef.kind}:${archetype.contentRef.id}' tidak ada`)
    evidenceBindings.push({
      id: `evidence:${archetype.id}:diagnosis`,
      subject: { kind: 'encounter_archetype', id: archetype.id },
      facet: 'diagnosis',
      icd10: kasus.icd10,
      source: 'source-pending:M13-0B',
      locator: `${archetype.contentRef.kind}:${archetype.contentRef.id}.icd10`,
      population: populationOf(kasus),
      reviewStatus: 'pending',
    })
  }
  evidenceBindings.push(...m13DeltaBindings)

  for (const scenario of ukmScenarios) {
    evidenceBindings.push({
      id: `evidence:${scenario.id}:ukm-objective`,
      subject: { kind: 'ukm_scenario', id: scenario.id },
      facet: 'ukm-objective',
      source: 'source-pending:M13-0B',
      locator: `family=${scenario.contentRef.familyId}; visit=${scenario.contentRef.visitId}; targets from existing content`,
      reviewStatus: 'pending',
    })
  }
  evidenceBindings.sort(compareIds)

  return {
    schemaVersion: 1,
    baselineId: 'm13-0a-legacy-2026-07-14',
    curriculumItems,
    clinicalConcepts: [...conceptMap.values()].sort(compareIds),
    itemConcepts,
    encounterArchetypes,
    evidenceBindings,
    ukmScenarios,
  }
}
