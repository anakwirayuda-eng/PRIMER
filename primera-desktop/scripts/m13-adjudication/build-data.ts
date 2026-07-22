import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PACK } from '../../src/content'
import { CONTENT_RELEASE } from '../../src/content/pack'
import type { KasusKlinis } from '../../src/content/types'
import { REVISI_ENGINE, sidikJariPack } from '../../src/engine/verifikasi'
import {
  EBM_GUIDELINE_CROSSWALK,
  EBM_GUIDELINE_SOURCES,
  EXTERNAL_PNPK_SOURCES,
  FORNAS_QUERIES,
  PNPK_CROSSWALK,
  PPK_CROSSWALK,
  type EvidenceRelation,
} from './config'

export type ReviewStatus = 'cocok' | 'perlu-koreksi' | 'tak-ada-sumber'

interface PpkEntry {
  num: string
  title: string
  icpc2_list: string[]
  icd10_list: string[]
  text_start: number
  text_end: number
  chunk: string
}

interface KfaSnapshot {
  schema: string
  retrievedAt: string
  endpoint: string
  browserUrl: string
  scopeWarning: string
  caseCount: number
  drugCount: number
  unresolved: string[]
  items: Array<{
    drugId: string
    catalogName: string
    queryResults: Array<{
      query: string
      results: Array<{ kfaCode: string; name: string; ucumSymbol: string }>
    }>
  }>
}

interface LiteralExcerpt {
  label: string
  text: string
  locator: string
}

interface ResourceItem {
  id: string
  name: string
  kind: 'procedure' | 'laboratory'
  tier: 'A' | 'B' | 'C' | 'D'
  note: string
  grounding: 'baseline' | 'declared' | 'unresolved'
}

export interface AdjudicationCase {
  ordinal: number
  id: string
  name: string
  icd10: string
  skdi: string
  category: string
  mustRefer: boolean
  fktp144: boolean
  demographics: string
  openingComplaint: string
  currentManagement: {
    requiredDrugs: DrugEvidence[]
    alternativeDrugs: DrugEvidence[][]
    optionalDrugs: DrugEvidence[]
    procedures: Array<{ id: string; name: string }>
    education: Array<{ id: string; name: string; critical: boolean }>
    relevantLabs: Array<{ id: string; name: string; result: string }>
    differentialIcd10: string[]
    confirmationRequired?: string
    stabilizationRequired: string[]
  }
  currentEditorial: {
    clue: string
    officialGuidance?: string
    realityNote?: string
    ebmPearl?: string
  }
  evidence: {
    ppk: {
      status: ReviewStatus
      relation?: EvidenceRelation
      sourceTitle?: string
      sourceEntryNumber?: string
      pdfPage?: number
      sourceIcd10: string[]
      excerpts: LiteralExcerpt[]
      limitation?: string
    }
    pnpk: {
      status: ReviewStatus
      sources: PnpkEvidence[]
      limitation?: string
    }
    ebm: {
      status: ReviewStatus
      sources: EbmGuidelineEvidence[]
      limitation?: string
    }
    fornas: {
      status: ReviewStatus
      limitation: string
    }
    aspak: {
      status: ReviewStatus
      profile: string
      highestTier: 'A' | 'B' | 'C' | 'D'
      resources: ResourceItem[]
      unresolvedResourceIds: string[]
      limitation: string
    }
    kfa: {
      status: ReviewStatus
      limitation: string
    }
  }
  compiler: {
    suggestion: ReviewStatus
    reasons: string[]
    sourceAttributionWarning: boolean
  }
}

export interface DrugEvidence {
  id: string
  name: string
  dosageForm: string
  role: 'required' | 'alternative' | 'optional'
  catalogFornas: boolean
  fornas: {
    status: ReviewStatus
    queries: string[]
    excerpts: LiteralExcerpt[]
    note: string
    caseAvailabilityGrounded: boolean
    availabilityGrounding?: string
  }
  kfa: {
    status: ReviewStatus
    components: Array<{
      query: string
      matches: Array<{ code: string; name: string; unit: string }>
    }>
    note: string
  }
}

interface PnpkEvidence {
  slug: string
  relation: EvidenceRelation
  title: string
  documentNumber?: string
  officialUrl?: string
  localFulltext?: string
  population?: string
  facilityScope?: string
  excerpts: LiteralExcerpt[]
  limitation?: string
}

interface EbmGuidelineEvidence {
  sourceId: string
  relation: EvidenceRelation
  title: string
  authority: string
  year: number
  officialUrl: string
  population: string
  facilityScope: string
  locator: string
  limitation?: string
}

export interface AdjudicationDataset {
  schema: 'primera.m13-137-adjudication.v1'
  generatedAt: string
  sourceCommit: string
  artifactFingerprint: string
  packFingerprint: string
  contentRelease: string
  engineRevision: number
  title: string
  scope: {
    requestedMinimum: number
    actualCaseCount: number
    reconciliation: string
    physicianDecisionValues: string[]
  }
  sourcePolicy: string[]
  globalLimitations: string[]
  sourceHashes: Record<string, string>
  summary: {
    bySuggestion: Record<ReviewStatus, number>
    ppkDirect: number
    ppkRelated: number
    ppkAbsent: number
    pnpkDirect: number
    ebmDirect: number
    nonFornasDrugIds: string[]
    resourceTierCOrD: number
    resourceGrounded: number
    resourceUnresolved: number
    kfaUnresolvedQueries: number
  }
  cases: AdjudicationCase[]
}

const ROOT = process.cwd()
const PPK_ENTRIES_PATH = resolve(ROOT, 'docs/references/ppk1186/ppk1186_entries.json')
const PPK_BOUNDARIES_PATH = resolve(ROOT, 'docs/references/ppk1186/ppk1186_page_boundaries.json')
const FORNAS_PATH = resolve(ROOT, 'docs/references/fornas1199/fornas1199_fulltext.txt')
const KFA_PATH = resolve(ROOT, 'docs/M13_137_KFA_SNAPSHOT.json')

const PPK_ENTRIES = JSON.parse(readFileSync(PPK_ENTRIES_PATH, 'utf8')) as PpkEntry[]
const PPK_BOUNDARIES = JSON.parse(readFileSync(PPK_BOUNDARIES_PATH, 'utf8')) as number[]
const FORNAS_TEXT = readFileSync(FORNAS_PATH, 'utf8')
const FORNAS_LINES = FORNAS_TEXT.split(/\r?\n/)
const KFA = JSON.parse(readFileSync(KFA_PATH, 'utf8')) as KfaSnapshot

const RESOURCE_TIERS: Record<string, Pick<ResourceItem, 'tier' | 'note'>> = {
  adrenalin_im_anafilaksis: { tier: 'B', note: 'Obat emergensi dan kemampuan injeksi harus ready saat layanan.' },
  akses_iv_tanpa_bolus: { tier: 'B', note: 'Akses IV, consumable, dan monitoring harus ready; tidak mengizinkan bolus cairan otomatis.' },
  akses_iv_resusitasi: { tier: 'B', note: 'Akses IV/cairan lazim, tetapi readiness consumable tetap perlu.' },
  antiemetik_parenteral_hiperemesis: { tier: 'C', note: 'Pilihan obat, dosis, rute parenteral, kontraindikasi, dan monitoring harus mengikuti protokol kehamilan lokal.' },
  antibiotik_parenteral_gizi_buruk_protokol: { tier: 'C', note: 'Regimen, dosis anak, stok, dan jejaring TFC/RS harus dinyatakan; bukan satu vial universal.' },
  rehidrasi_gizi_buruk_non_syok: { tier: 'B', note: 'ReSoMal lebih disukai; ORS osmolaritas rendah adalah fallback terpantau bila ReSoMal tidak tersedia.' },
  jaga_hangat_gizi_buruk_anak: { tier: 'A', note: 'Kain kering, selimut, suhu ruangan, dan pemantauan suhu adalah kesiapan inti.' },
  antibiotik_parenteral_kaki_diabetik_protokol: { tier: 'C', note: 'Regimen, stok, alergi, fungsi ginjal, pola resistensi lokal, dan jalur bedah-vaskular harus dinyatakan; bukan satu vial universal.' },
  antibiotik_parenteral_neonatus_protokol: { tier: 'C', note: 'Protokol neonatus dan jejaring/PONED tidak diasumsikan otomatis.' },
  balut_luka_kaki_diabetik_pra_rujuk: { tier: 'B', note: 'Balutan bersih nonadheren dan off-loading sederhana harus ready; tidak mencakup probing atau debridemen tajam.' },
  dekompresi_ngt: { tier: 'C', note: 'NGT, operator, dan monitoring perlu dinyatakan.' },
  ekstraksi_benda_asing_konjungtiva: { tier: 'C', note: 'Instrumen, anestetik topikal, dan kompetensi operator perlu dinyatakan.' },
  epilasi_trikiasis: { tier: 'C', note: 'Instrumen mata dan kompetensi operator perlu dinyatakan.' },
  hecting_luka: { tier: 'B', note: 'Set bedah minor dan anestetik lokal perlu ready.' },
  insisi_abses: { tier: 'B', note: 'Set bedah minor, anestetik, dan kondisi lokasi menentukan kelayakan.' },
  jahit_perineum: { tier: 'C', note: 'Kompetensi, set obstetri, anestesi, dan dukungan maternal perlu dinyatakan.' },
  koreksi_hipoglikemia_gizi_buruk_anak: { tier: 'B', note: 'Glukosa/sukrosa, alat ukur, jalur oral/NG, dan pemberian makan lanjutan harus siap.' },
  nebulisasi: { tier: 'B', note: 'Nebulizer, oksigen/udara pendorong, obat, dan consumable harus ready.' },
  oksigen: { tier: 'B', note: 'Sumber oksigen, delivery device, dan pulse oximeter harus ready.' },
  pasang_infus: { tier: 'B', note: 'Akses IV dan cairan lazim, tetapi readiness consumable tetap perlu.' },
  pemantauan_ketat_vital: { tier: 'B', note: 'Tensimeter, pulse oximeter, jam observasi, dan petugas harus ready selama stabilisasi pra-rujuk.' },
  pemasangan_kateter_urin: { tier: 'C', note: 'Kateter berbagai ukuran, asepsis, dan operator perlu dinyatakan.' },
  profilaksis_tetanus: { tier: 'B', note: 'Produk vaksin/serum mengikuti indikasi dan stok aktual.' },
  reduksi_parafimosis: { tier: 'C', note: 'Analgesia, operator, dan jalur rujuk bila gagal harus dinyatakan.' },
  resusitasi_cairan_kristaloid: { tier: 'B', note: 'Cairan, akses IV, dan pemantauan harus ready.' },
  tiamin_hiperemesis: { tier: 'C', note: 'Rute oral/parenteral mengikuti toleransi dan stok; jangan menunda transfer atau memberi dekstrosa tanpa proteksi tiamin.' },
  uji_visus_refraksi: { tier: 'B', note: 'Snellen/pinhole lazim; refraksi lengkap tidak diasumsikan.' },
  darah_rutin: { tier: 'C', note: 'Laboratorium dasar tidak seragam; jadwal/reagen/operator perlu dinyatakan.' },
  ekg: { tier: 'C', note: 'Rifaskes: EKG jauh dari universal; jangan diasumsikan selalu tersedia.' },
  fungsi_ginjal: { tier: 'C', note: 'Kimia darah sering terjadwal/jejaring, bukan core-ready.' },
  feses_rutin: { tier: 'C', note: 'Mikroskop, reagen, dan ATLM perlu dinyatakan.' },
  hba1c: { tier: 'D', note: 'Rifaskes menunjukkan HbA1c sangat jarang di Puskesmas.' },
  mikroskopis_gram_koh: { tier: 'C', note: 'Mikroskop, reagen, dan operator perlu dinyatakan.' },
  anti_hav_igm: { tier: 'D', note: 'Serologi hepatitis A tidak diasumsikan tersedia di Puskesmas generik; gunakan jejaring laboratorium dan tutup tindak lanjut hasil.' },
  apusan_darah_mikrofilaria: { tier: 'C', note: 'Pemeriksaan program, waktu pengambilan, dan mikroskopi perlu dinyatakan.' },
  bta_sputum: { tier: 'C', note: 'Cukup luas tetapi tidak universal; TCM/rujukan spesimen dapat diperlukan.' },
  tcm_sputum: { tier: 'C', note: 'Kemampuan TCM sering berupa jejaring program; pengiriman dan tindak lanjut hasil perlu dinyatakan.' },
  slit_skin_smear: { tier: 'C', note: 'Pemeriksaan program kusta dan operator terlatih perlu dinyatakan.' },
  tcm_spesimen_lesi: { tier: 'D', note: 'TCM tidak menjadi kemampuan diam-diam Puskesmas generik.' },
  foto_ekstremitas: { tier: 'D', note: 'Rontgen tidak diasumsikan di Sukamaju; gunakan jejaring.' },
  foto_polos_abdomen: { tier: 'D', note: 'Rontgen tidak diasumsikan di Sukamaju; jangan menunda rujuk.' },
  foto_toraks: { tier: 'D', note: 'Rontgen tidak diasumsikan di Sukamaju; gunakan jejaring.' },
  usg_abdomen: { tier: 'D', note: 'USG/operator tidak diasumsikan tersedia rutin.' },
  usg_obstetri: { tier: 'D', note: 'USG/operator tidak diasumsikan tersedia rutin.' },
  elektrolit_serum: { tier: 'D', note: 'Kimia darah lanjutan tidak diasumsikan tersedia segera.' },
  ferritin_serum: { tier: 'D', note: 'Pemeriksaan lanjutan memakai jejaring laboratorium.' },
  hitung_retikulosit: { tier: 'D', note: 'Pemeriksaan hematologi lanjutan memakai jejaring.' },
  sgot_sgpt: { tier: 'C', note: 'Kimia darah sering terjadwal/jejaring.' },
  profil_lipid: { tier: 'C', note: 'Kimia darah sering terjadwal/jejaring.' },
  tsh: { tier: 'D', note: 'Pemeriksaan hormon tidak diasumsikan tersedia di Puskesmas.' },
}

const DEFAULT_RESOURCE: Pick<ResourceItem, 'tier' | 'note'> = {
  tier: 'A',
  note: 'Core-ready pada profil naratif Sukamaju atau tidak membutuhkan alat khusus.',
}

/**
 * Resource C/D yang sudah dijelaskan secara eksplisit di catatan realita kasus.
 * Daftar ini tidak mengubah readiness runtime; ia hanya mencegah kompilator
 * menyebut keterbatasan yang sudah diakui dan diberi graceful-degradation path
 * sebagai kesalahan yang belum ditangani.
 */
const RESOURCE_GROUNDING_BY_CASE: Record<string, readonly string[]> = {
  lab_trauma_abdomen_tumpul: ['usg_abdomen'],
  lab_hepatitis_a_akut: ['sgot_sgpt', 'anti_hav_igm'],
  lab_hepatitis_b_kronik: ['sgot_sgpt'],
  lab_gagal_jantung_dekompensasi: ['ekg'],
  lab_infeksi_umbilikus_neonatus: ['antibiotik_parenteral_neonatus_protokol'],
  lab_plasenta_previa: ['usg_obstetri'],
  lab_kehamilan_ektopik_terganggu_suspek: ['usg_obstetri'],
  lab_filariasis_terkonfirmasi: ['apusan_darah_mikrofilaria'],
  lab_skrofuloderma_suspek: ['tcm_spesimen_lesi'],
  lab_tinea_unguium_terkonfirmasi: ['mikroskopis_gram_koh', 'sgot_sgpt'],
  lab_anemia_defisiensi_besi_nonhamil: ['darah_rutin'],
  lab_penyakit_ginjal_kronik_st3b: ['fungsi_ginjal'],
  lab_apendisitis_akut_anak: ['darah_rutin'],
  lab_cacing_tambang: ['feses_rutin'],
  lab_skistosomiasis_sulteng: ['feses_rutin'],
  lab_strongiloidiasis: ['feses_rutin'],
  lab_taeniasis_intestinal: ['feses_rutin'],
  lab_tb_paru_putus_obat_suspek_mdr: ['tcm_sputum'],
  lab_meningitis_bakterial_suspek: ['darah_rutin'],
  lab_mastoiditis_akut: ['darah_rutin'],
  lab_vaginosis_bakterialis: ['mikroskopis_gram_koh'],
  lab_retensio_urin_akut: ['pemasangan_kateter_urin'],
  lab_hemoroid_interna_derajat4: ['darah_rutin'],
  lab_edema_paru_akut_hipertensif: ['ekg'],
  lab_ileus_obstruktif: ['dekompresi_ngt'],
  lab_benda_asing_konjungtiva: ['ekstraksi_benda_asing_konjungtiva'],
  lab_trikiasis: ['epilasi_trikiasis'],
  lab_parafimosis_reduksibel: ['reduksi_parafimosis'],
  lab_vaginitis_kandida: ['mikroskopis_gram_koh'],
  lab_ruptur_perineum_derajat_1: ['jahit_perineum'],
  lab_eritrasma_lipat_paha: ['mikroskopis_gram_koh'],
  lab_tinea_kapitis_anak: ['mikroskopis_gram_koh'],
  lab_tinea_barbae: ['mikroskopis_gram_koh'],
  lab_tinea_fasialis: ['mikroskopis_gram_koh'],
  lab_tinea_manus: ['mikroskopis_gram_koh'],
  lab_tinea_kruris: ['mikroskopis_gram_koh'],
  lab_tinea_pedis: ['mikroskopis_gram_koh'],
  lab_pitiriasis_versikolor: ['mikroskopis_gram_koh'],
  lab_dermatitis_numularis: ['mikroskopis_gram_koh'],
  lab_hiperemesis_gravidarum_berat: ['antiemetik_parenteral_hiperemesis', 'tiamin_hiperemesis'],
  lab_gizi_buruk_komplikasi: ['antibiotik_parenteral_gizi_buruk_protokol'],
  lab_talasemia_beta_mayor_anak: ['darah_rutin', 'ferritin_serum', 'hitung_retikulosit'],
  lab_hernia_inguinalis_inkarserata: ['dekompresi_ngt'],
  lab_peritonitis_generalisata: ['dekompresi_ngt'],
  lab_kaki_diabetik_infeksi: ['antibiotik_parenteral_kaki_diabetik_protokol'],
  lab_tia_serangan_iskemik_sesaat: ['ekg'],
}

const STOP_WORDS = new Set([
  'akut', 'anak', 'awal', 'berat', 'dengan', 'dewasa', 'dugaan', 'komplikasi', 'kronik',
  'pada', 'ringan', 'stabil', 'suspek', 'tanpa', 'terganggu', 'terinfeksi', 'terkonfirmasi',
])

function hashFile(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function normalized(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function clip(value: string, length = 760): string {
  const tidy = clean(value)
  return tidy.length <= length ? tidy : `${tidy.slice(0, length).trimEnd()}...`
}

function extractSection(chunk: string, starts: RegExp[], ends: RegExp[], label: string): LiteralExcerpt | undefined {
  const start = starts.map((pattern) => ({ pattern, index: chunk.search(pattern) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index)[0]
  if (!start) return undefined
  const tail = chunk.slice(start.index)
  const headingMatch = tail.match(start.pattern)
  const bodyStart = headingMatch ? start.index + (headingMatch.index ?? 0) + headingMatch[0].length : start.index
  const remaining = chunk.slice(bodyStart)
  const endIndex = ends.map((pattern) => remaining.search(pattern)).filter((index) => index > 20).sort((a, b) => a - b)[0]
  const body = endIndex === undefined ? remaining : remaining.slice(0, endIndex)
  const text = clip(body)
  if (!text) return undefined
  return { label, text, locator: '' }
}

function ppkEvidence(kasus: KasusKlinis): AdjudicationCase['evidence']['ppk'] {
  const link = PPK_CROSSWALK[kasus.id]
  if (!link) {
    return {
      status: 'tak-ada-sumber',
      sourceIcd10: [],
      excerpts: [],
      limitation: 'Tidak ditemukan bab diagnosis langsung maupun crosswalk terkait di 167 entri PPK 1186/2022.',
    }
  }
  const entry = PPK_ENTRIES[link.entryIndex]
  if (!entry) throw new Error(`PPK index ${link.entryIndex} hilang untuk ${kasus.id}`)
  let chunk = entry.chunk
  let chunkOffset = 0
  if (link.chunkStartMarker) {
    chunkOffset = entry.chunk.indexOf(link.chunkStartMarker)
    if (chunkOffset < 0) throw new Error(`PPK marker awal '${link.chunkStartMarker}' hilang untuk ${kasus.id}`)
    chunk = entry.chunk.slice(chunkOffset)
  }
  if (link.chunkEndMarker) {
    const endIndex = chunk.indexOf(link.chunkEndMarker)
    if (endIndex < 0) throw new Error(`PPK marker akhir '${link.chunkEndMarker}' hilang untuk ${kasus.id}`)
    chunk = chunk.slice(0, endIndex)
  }
  const sourceOffset = entry.text_start + chunkOffset
  const pdfPage = PPK_BOUNDARIES.findIndex((offset) => offset > sourceOffset) + 1
  const excerpts = [
    extractSection(
      chunk,
      [/Penatalaksanaan Komprehensif\s*\(Plan\)/i, /Penatalaksanaan\s+/i],
      [/Rencana Tindak Lanjut/i, /Konseling dan Edukasi/i, /Kriteria Rujukan/i, /Peralatan/i],
      'Penatalaksanaan',
    ),
    extractSection(
      chunk,
      [/Kriteria Rujukan/i],
      [/Peralatan/i, /Prognosis/i, /Referensi/i],
      'Kriteria rujukan',
    ),
  ].filter((item): item is LiteralExcerpt => Boolean(item))
    .map((item) => ({ ...item, locator: `PPK 1186/2022, bab ${entry.num}, PDF p.${pdfPage}` }))

  return {
    status: link.relation === 'direct' ? 'cocok' : 'perlu-koreksi',
    relation: link.relation,
    sourceTitle: link.titleOverride ?? entry.title,
    sourceEntryNumber: link.entryNumberOverride ?? entry.num,
    pdfPage,
    sourceIcd10: link.icd10Override ?? entry.icd10_list,
    excerpts,
    limitation: link.rationale ?? (link.relation === 'related' ? 'Sumber hanya terkait, bukan diagnosis identik.' : undefined),
  }
}

function sourceKeywords(kasus: KasusKlinis): string[] {
  return normalized(kasus.nama)
    .split(' ')
    .filter((word) => word.length >= 5 && !STOP_WORDS.has(word))
    .slice(0, 5)
}

function excerptFromLines(lines: string[], regex: RegExp, label: string, path: string): LiteralExcerpt | undefined {
  const index = lines.findIndex((line) => regex.test(normalized(line)))
  if (index < 0) return undefined
  const from = Math.max(0, index - 2)
  const to = Math.min(lines.length, index + 4)
  return {
    label,
    text: clip(lines.slice(from, to).join(' '), 620),
    locator: `${path}:baris ${index + 1}`,
  }
}

function loadPnpkSource(slug: string, relation: EvidenceRelation, kasus: KasusKlinis, rationale?: string): PnpkEvidence {
  const external = EXTERNAL_PNPK_SOURCES[slug]
  if (external) {
    return {
      slug,
      relation,
      title: external.title,
      documentNumber: external.documentNumber,
      officialUrl: external.officialUrl,
      population: external.population,
      facilityScope: external.facilityScope,
      excerpts: [],
      limitation: rationale ?? 'Dokumen resmi diverifikasi, tetapi belum ada ekstrak lokal ber-locator dalam corpus ini.',
    }
  }

  const directory = resolve(ROOT, `docs/references/pnpk/${slug}`)
  const distillationPath = resolve(directory, 'distillation.json')
  const fulltextPath = resolve(directory, 'fulltext.txt')
  const distillation = existsSync(distillationPath)
    ? JSON.parse(readFileSync(distillationPath, 'utf8')) as Record<string, unknown>
    : undefined
  const fulltext = existsSync(fulltextPath) ? readFileSync(fulltextPath, 'utf8') : ''
  const lines = fulltext.split(/\r?\n/)
  const source = distillation?.sumber as Record<string, unknown> | undefined
  const title = String(distillation?.judul ?? source?.judul ?? `PNPK ${slug}`)
  const officialUrl = String(distillation?.pdfUrl ?? source?.halamanDetail ?? '') || undefined
  const documentNumber = String(distillation?.nomorSK ?? '') || undefined
  const localFulltext = existsSync(fulltextPath) ? `docs/references/pnpk/${slug}/fulltext.txt` : undefined
  const casePattern = sourceKeywords(kasus).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const excerpts = fulltext ? [
    casePattern ? excerptFromLines(lines, new RegExp(casePattern, 'i'), 'Konteks diagnosis', localFulltext!) : undefined,
    excerptFromLines(lines, /puskesmas|fktp|rujuk/, 'Konteks FKTP/rujukan', localFulltext!),
  ].filter((item): item is LiteralExcerpt => Boolean(item)) : []

  return {
    slug,
    relation,
    title,
    documentNumber,
    officialUrl,
    localFulltext,
    population: String(distillation?.population ?? distillation?.sasaranDokumen ?? '') || undefined,
    facilityScope: String(distillation?.catatanFktp ?? '') ? 'Lintas tingkat fasilitas; lihat cuplikan dan dokumen penuh.' : undefined,
    excerpts,
    limitation: rationale ?? (excerpts.length === 0 ? 'Tidak ada cuplikan literal ber-locator yang berhasil diambil.' : 'Cuplikan literal adalah orientasi; adjudikasi tetap membaca konteks dokumen penuh.'),
  }
}

function pnpkEvidence(kasus: KasusKlinis): AdjudicationCase['evidence']['pnpk'] {
  const links = PNPK_CROSSWALK[kasus.id] ?? []
  if (links.length === 0) {
    return {
      status: 'tak-ada-sumber',
      sources: [],
      limitation: 'Tidak ditemukan PNPK diagnosis-spesifik dalam katalog resmi/corpus lokal yang dipetakan.',
    }
  }
  const sources = links.map((link) => loadPnpkSource(link.slug, link.relation, kasus, link.rationale))
  const direct = sources.some((source) => source.relation === 'direct')
  return {
    status: direct ? 'cocok' : 'perlu-koreksi',
    sources,
    limitation: direct ? undefined : 'Seluruh PNPK yang ditemukan hanya terkait, bukan diagnosis identik.',
  }
}

function ebmGuidelineEvidence(kasus: KasusKlinis): AdjudicationCase['evidence']['ebm'] {
  const links = EBM_GUIDELINE_CROSSWALK[kasus.id] ?? []
  if (links.length === 0) {
    return {
      status: 'tak-ada-sumber',
      sources: [],
      limitation: 'Belum ada pedoman EBM diagnosis-spesifik tambahan yang dipetakan dalam registry adjudikasi.',
    }
  }

  const sources = links.map((link): EbmGuidelineEvidence => {
    const source = EBM_GUIDELINE_SOURCES[link.sourceId]
    if (!source) throw new Error(`Sumber EBM '${link.sourceId}' hilang untuk ${kasus.id}`)
    return {
      sourceId: link.sourceId,
      relation: link.relation,
      ...source,
      locator: link.locator,
      limitation: link.rationale,
    }
  })
  return {
    status: sources.some((source) => source.relation === 'direct') ? 'cocok' : 'perlu-koreksi',
    sources,
    limitation: sources.some((source) => source.relation === 'direct')
      ? 'Sumber EBM melengkapi atau memperbarui floor lokal; penerapan tetap harus melalui graceful degradation FKTP.'
      : 'Sumber EBM yang dipetakan hanya terkait, bukan diagnosis identik.',
  }
}

function defaultFornasQueries(name: string): string[] {
  const query = normalized(name)
    .replace(/\b\d+(?:\s+\d+)*\b.*$/, '')
    .replace(/\b(tablet|sirup|krim|injeksi|infus|kapsul|tetes|semprot|losio|oralit)\b.*$/, '')
    .replace(/\b(ampul|vial|botol|kolf|suspensi|salep|gel)\b.*$/, '')
    .trim()
  return [query || normalized(name).split(' ').slice(0, 2).join(' ')]
}

function fornasExcerpt(query: string): LiteralExcerpt | undefined {
  const target = normalized(query)
  const index = FORNAS_LINES.findIndex((line) => normalized(line).includes(target))
  if (index < 0) return undefined
  return {
    label: query,
    text: clip(FORNAS_LINES.slice(Math.max(0, index - 2), Math.min(FORNAS_LINES.length, index + 4)).join(' '), 480),
    locator: `docs/references/fornas1199/fornas1199_fulltext.txt:baris ${index + 1}`,
  }
}

function drugEvidence(id: string, role: DrugEvidence['role'], realityNote?: string): DrugEvidence {
  const drug = PACK.obat[id]
  if (!drug) throw new Error(`Obat ${id} tidak ada di katalog`)
  const queries = FORNAS_QUERIES[id] ?? defaultFornasQueries(drug.nama)
  const excerpts = queries.map(fornasExcerpt).filter((item): item is LiteralExcerpt => Boolean(item))
  const allQueriesLocated = excerpts.length === queries.length
  const fornasStatus: ReviewStatus = !drug.fornas
    ? 'perlu-koreksi'
    : allQueriesLocated ? 'cocok' : 'perlu-koreksi'
  const caseAvailabilityGrounded = !drug.fornas && Boolean(realityNote && (
    /(?:non-Fornas|bukan[^.]{0,40}Fornas|tidak[^.]{0,40}(?:diklaim|ditandai)[^.]{0,40}Fornas|Fornas[^.]{0,40}hanya|obat program|tidak dianggap stok rutin)/i.test(realityNote) &&
    /(?:pengadaan lokal|OTC|program|perawatan suportif|bila tidak tersedia|bila tidak ada|tidak dianggap stok rutin)/i.test(realityNote)
  ))
  const snapshot = KFA.items.find((item) => item.drugId === id)
  const components = snapshot?.queryResults.map((item) => ({
    query: item.query,
    matches: item.results.map((match) => ({ code: match.kfaCode, name: match.name, unit: match.ucumSymbol })),
  })) ?? []
  const kfaStatus: ReviewStatus = components.length > 0 && components.every((item) => item.matches.length > 0)
    ? 'cocok'
    : 'tak-ada-sumber'

  return {
    id,
    name: drug.nama,
    dosageForm: drug.sediaan,
    role,
    catalogFornas: drug.fornas,
    fornas: {
      status: fornasStatus,
      queries,
      excerpts,
      note: !drug.fornas
        ? 'Katalog game menandai non-Fornas; bila tetap dipakai, perlu jalur pengadaan/program/alternatif yang eksplisit.'
        : allQueriesLocated
          ? 'Nama generik/komponen ditemukan pada ekstrak Fornas 1199; reviewer tetap wajib membaca kolom fasilitas dan restriksi pada konteks baris.'
          : 'Flag Fornas=true di katalog belum didukung locator teks untuk seluruh komponen; perlu verifikasi manual.',
      caseAvailabilityGrounded,
      availabilityGrounding: caseAvailabilityGrounded ? realityNote : undefined,
    },
    kfa: {
      status: kfaStatus,
      components,
      note: kfaStatus === 'cocok'
        ? 'Kode KFA adalah active substance, bukan product template/variant dan bukan bukti stok.'
        : 'Nama belum ditemukan di endpoint active-substance publik; jangan mengarang kode.',
    },
  }
}

function resourceEvidence(kasus: KasusKlinis): AdjudicationCase['evidence']['aspak'] {
  const procedures = (kasus.tatalaksana.prosedur ?? []).map((id): Omit<ResourceItem, 'grounding'> => ({
    id,
    name: PACK.tindakan[id]?.nama ?? id,
    kind: 'procedure',
    ...(RESOURCE_TIERS[id] ?? DEFAULT_RESOURCE),
  }))
  const laboratories = kasus.lab.filter((item) => item.relevan).map((item): Omit<ResourceItem, 'grounding'> => ({
    id: item.id,
    name: PACK.lab[item.id]?.nama ?? item.id,
    kind: 'laboratory',
    ...(RESOURCE_TIERS[item.id] ?? DEFAULT_RESOURCE),
  }))
  const rawResources = [...procedures, ...laboratories]
  const declared = new Set(RESOURCE_GROUNDING_BY_CASE[kasus.id] ?? [])
  const elevatedIds = new Set(rawResources.filter((item) => item.tier === 'C' || item.tier === 'D').map((item) => item.id))
  for (const id of declared) {
    if (!elevatedIds.has(id)) {
      throw new Error(`Resource grounding ${kasus.id}/${id} tidak menunjuk resource Tier C/D aktif`)
    }
  }
  if (declared.size > 0 && !kasus.catatanRealita?.trim()) {
    throw new Error(`Resource grounding ${kasus.id} wajib memiliki catatanRealita`)
  }
  const resources: ResourceItem[] = rawResources.map((item) => ({
    ...item,
    grounding: item.tier === 'A' || item.tier === 'B'
      ? 'baseline'
      : declared.has(item.id) ? 'declared' : 'unresolved',
  }))
  const unresolvedResourceIds = resources
    .filter((item) => item.grounding === 'unresolved')
    .map((item) => item.id)
  const highestTier = resources.reduce<'A' | 'B' | 'C' | 'D'>((highest, item) => {
    const order = ['A', 'B', 'C', 'D']
    return order.indexOf(item.tier) > order.indexOf(highest) ? item.tier : highest
  }, 'A')
  return {
    status: unresolvedResourceIds.length === 0 ? 'cocok' : 'perlu-koreksi',
    profile: 'sukamaju_middle_v1 (perdesaan, nonrawat-inap; M13-RP1)',
    highestTier,
    resources,
    unresolvedResourceIds,
    limitation: unresolvedResourceIds.length > 0 && highestTier === 'D'
      ? 'Ada resource Tier D yang tidak boleh diasumsikan tersedia; gunakan jejaring dan jangan menjadikannya syarat menunda rujuk.'
      : unresolvedResourceIds.length > 0 && highestTier === 'C'
        ? 'Ada resource Tier C: jadwal, operator, consumable, atau readiness harus dinyatakan di skenario.'
        : highestTier === 'C' || highestTier === 'D'
          ? 'Resource Tier C/D telah dinyatakan eksplisit pada catatan realita kasus; ini tetap narasi authoring, bukan bukti readiness real-time.'
        : 'Status adalah baseline authoring naratif, bukan simulasi stok/readiness runtime.',
  }
}

function formatDemographics(kasus: KasusKlinis): string {
  const sex = kasus.demografi.jenisKelamin === 'L' ? 'laki-laki' : kasus.demografi.jenisKelamin === 'P' ? 'perempuan' : 'semua gender'
  if (kasus.demografi.usiaBulanMin !== undefined) {
    return `${kasus.demografi.usiaBulanMin}-${kasus.demografi.usiaBulanMax} bulan, ${sex}`
  }
  return `${kasus.demografi.usiaMin}-${kasus.demografi.usiaMax} tahun, ${sex}`
}

function caseRecord(kasus: KasusKlinis, ordinal: number): AdjudicationCase {
  const ppk = ppkEvidence(kasus)
  const pnpk = pnpkEvidence(kasus)
  const ebm = ebmGuidelineEvidence(kasus)
  const requiredDrugs = kasus.tatalaksana.obatBenar.map((id) => drugEvidence(id, 'required', kasus.catatanRealita))
  const alternativeDrugs = (kasus.tatalaksana.obatAlternatif ?? []).map((group) => group.map((id) => drugEvidence(id, 'alternative', kasus.catatanRealita)))
  const optionalDrugs = (kasus.tatalaksana.obatOpsional ?? []).map((id) => drugEvidence(id, 'optional', kasus.catatanRealita))
  const allDrugs = [...requiredDrugs, ...alternativeDrugs.flat(), ...optionalDrugs]
  const unresolvedFornasDrugs = allDrugs.filter((drug) => (
    drug.fornas.status === 'perlu-koreksi' && !drug.fornas.caseAvailabilityGrounded
  ))
  const fornasStatus: ReviewStatus = unresolvedFornasDrugs.length > 0
    ? 'perlu-koreksi'
    : allDrugs.length === 0 ? 'cocok' : 'cocok'
  const kfaStatus: ReviewStatus = allDrugs.some((drug) => drug.kfa.status !== 'cocok') ? 'tak-ada-sumber' : 'cocok'
  const aspak = resourceEvidence(kasus)
  const reasons: string[] = []
  const ppkMention = Boolean(kasus.panduanResmi && /\bPPK\b|1186\/2022/i.test(kasus.panduanResmi))
  const ppkLimitationExplicit = Boolean(kasus.panduanResmi && (
    /PPK[^.]{0,100}\btidak (?:memiliki|mempunyai|menyediakan|memuat)\b/i.test(kasus.panduanResmi) ||
    /\btidak (?:ada|ditemukan)\b[^.]{0,140}\bPPK\b/i.test(kasus.panduanResmi) ||
    /\bPPK\b[^.]{0,200}\bbukan pedoman diagnosis-spesifik\b/i.test(kasus.panduanResmi) ||
    /\btidak ada algoritme\b[^.]{0,140}\bPPK\b/i.test(kasus.panduanResmi) ||
    /\b(?:bab|crosswalk)[^.]{0,180}\b(?:hanya (?:menjadi )?floor terkait|tidak identik|bukan (?:padanan|pedoman)[^.]{0,80}identik)\b/i.test(kasus.panduanResmi)
  ))
  const sourceAttributionWarning = ppkMention && !ppkLimitationExplicit && ppk.relation !== 'direct'

  if (sourceAttributionWarning) {
    reasons.push(ppk.relation === 'related'
      ? 'Teks panduan saat ini mengatribusikan PPK secara kuat, tetapi crosswalk hanya RELATED.'
      : 'Teks panduan saat ini menyebut PPK, tetapi tidak ditemukan bab PPK diagnosis langsung/terkait.')
  }
  if (fornasStatus === 'perlu-koreksi') {
    const ids = unresolvedFornasDrugs.map((drug) => drug.id)
    reasons.push(`Grounding Fornas perlu ditinjau: ${[...new Set(ids)].join(', ')}.`)
  }
  if (aspak.status === 'perlu-koreksi') reasons.push(aspak.limitation)
  if (ppk.status === 'tak-ada-sumber' && pnpk.status === 'tak-ada-sumber' && ebm.status === 'tak-ada-sumber') {
    reasons.push('Belum ada PPK/PNPK maupun pedoman EBM diagnosis-spesifik yang terpetakan; jangan menyatakan kesesuaian tanpa sumber tambahan.')
  } else if (ppk.relation === 'related' && pnpk.status !== 'cocok' && ebm.status !== 'cocok') {
    reasons.push('Sumber klinis yang tersedia hanya RELATED; perlu sumber diagnosis-spesifik atau pembatasan klaim.')
  }

  const suggestion: ReviewStatus = sourceAttributionWarning || fornasStatus === 'perlu-koreksi' || aspak.status === 'perlu-koreksi'
    ? 'perlu-koreksi'
    : ppk.status === 'tak-ada-sumber' && pnpk.status === 'tak-ada-sumber' && ebm.status === 'tak-ada-sumber'
      ? 'tak-ada-sumber'
      : 'cocok'

  return {
    ordinal,
    id: kasus.id,
    name: kasus.nama,
    icd10: kasus.icd10,
    skdi: kasus.skdi,
    category: kasus.kategori,
    mustRefer: kasus.harusDirujuk,
    fktp144: kasus.fktp144,
    demographics: formatDemographics(kasus),
    openingComplaint: kasus.keluhanUtama,
    currentManagement: {
      requiredDrugs,
      alternativeDrugs,
      optionalDrugs,
      procedures: (kasus.tatalaksana.prosedur ?? []).map((id) => ({ id, name: PACK.tindakan[id]?.nama ?? id })),
      education: kasus.tatalaksana.edukasi.map((id) => ({
        id,
        name: PACK.edukasi[id]?.nama ?? id,
        critical: (kasus.tatalaksana.edukasiKritis ?? []).includes(id),
      })),
      relevantLabs: kasus.lab.filter((item) => item.relevan).map((item) => ({
        id: item.id,
        name: PACK.lab[item.id]?.nama ?? item.id,
        result: item.hasil,
      })),
      differentialIcd10: kasus.diagnosisBanding,
      confirmationRequired: kasus.konfirmasiWajib,
      stabilizationRequired: kasus.stabilisasiWajib ?? [],
    },
    currentEditorial: {
      clue: kasus.clue,
      officialGuidance: kasus.panduanResmi,
      realityNote: kasus.catatanRealita,
      ebmPearl: kasus.mutiaraEbm,
    },
    evidence: {
      ppk,
      pnpk,
      ebm,
      fornas: {
        status: fornasStatus,
        limitation: 'Fornas menentukan listing/restriksi JKN, bukan stok pada hari permainan. Locator perlu dibaca bersama kolom FPKTP/FPKTL dan restriksi.',
      },
      aspak,
      kfa: {
        status: kfaStatus,
        limitation: KFA.scopeWarning,
      },
    },
    compiler: { suggestion, reasons, sourceAttributionWarning },
  }
}

function currentCommit(): string {
  try {
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim()
    const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim()
    return dirty ? `${commit}+dirty` : commit
  } catch {
    return 'unknown'
  }
}

export function buildAdjudicationDataset(generatedAt = new Date().toISOString()): AdjudicationDataset {
  const labCases = Object.values(PACK.kasus)
    .filter((item) => item.activationStatus === 'lab_prototype_unadjudicated')
    .sort((a, b) => a.kategori.localeCompare(b.kategori, 'id') || a.nama.localeCompare(b.nama, 'id'))
  const cases = labCases.map((kasus, index) => caseRecord(kasus, index + 1))
  const bySuggestion: Record<ReviewStatus, number> = {
    cocok: cases.filter((item) => item.compiler.suggestion === 'cocok').length,
    'perlu-koreksi': cases.filter((item) => item.compiler.suggestion === 'perlu-koreksi').length,
    'tak-ada-sumber': cases.filter((item) => item.compiler.suggestion === 'tak-ada-sumber').length,
  }
  const uniqueDrugs = [...new Set(cases.flatMap((item) => [
    ...item.currentManagement.requiredDrugs,
    ...item.currentManagement.alternativeDrugs.flat(),
    ...item.currentManagement.optionalDrugs,
  ]).map((drug) => drug.id))]
  const sourceHashes = {
    ppkEntriesSha256: hashFile(PPK_ENTRIES_PATH),
    ppkBoundariesSha256: hashFile(PPK_BOUNDARIES_PATH),
    fornas1199Sha256: hashFile(FORNAS_PATH),
    kfaSnapshotSha256: hashFile(KFA_PATH),
  }
  const artifactFingerprint = createHash('sha256').update(JSON.stringify({
    packFingerprint: sidikJariPack(PACK),
    contentRelease: CONTENT_RELEASE,
    engineRevision: REVISI_ENGINE,
    sourceHashes,
    cases,
  })).digest('hex')

  return {
    schema: 'primera.m13-137-adjudication.v1',
    generatedAt,
    sourceCommit: currentCommit(),
    artifactFingerprint,
    packFingerprint: sidikJariPack(PACK),
    contentRelease: CONTENT_RELEASE,
    engineRevision: REVISI_ENGINE,
    title: 'PRIMERA M13-137 - Paket Adjudikasi Prototipe Klinis Lab',
    scope: {
      requestedMinimum: 103,
      actualCaseCount: cases.length,
      reconciliation: 'Angka 103 pada briefing berasal dari assert minimum lama. Query runtime aktual menemukan 137 kasus: 103 gelombang awal + 34 Batch 4.',
      physicianDecisionValues: ['setuju', 'perlu-edit', 'tolak', 'nanti'],
    },
    sourcePolicy: [
      'PPK 1186/2022 + amandemen 1936/2022 dan PNPK aktif adalah floor, bukan ceiling.',
      'EBM yang lebih baru boleh menggantikan floor bila sumber dan alasan deviasi dicantumkan.',
      'Fornas 1199 memeriksa listing/restriksi; jalur non-Fornas hanya diterima pada tingkat kasus bila pengadaan/program/alternatif dinyatakan eksplisit.',
      'ASPAK memeriksa kewajaran resource; resource Tier C/D hanya dianggap grounded bila catatan realita menyatakan lokasi, kesiapan, jadwal, atau jalur jejaringnya.',
      'KFA menormalkan nomenklatur dan tidak membuktikan stok.',
      'Tidak ditemukannya sumber dilaporkan apa adanya, bukan diisi dari asumsi.',
    ],
    globalLimitations: [
      'Ini kompilasi penelitian untuk keputusan dokter, bukan adjudikasi dan bukan perubahan gameplay.',
      'Crosswalk RELATED tidak boleh dipromosikan menjadi bukti diagnosis identik.',
      'Cuplikan PNPK otomatis adalah orientasi literal ber-locator, bukan pengganti pembacaan dokumen penuh.',
      'KFA snapshot hanya active-substance master data; bukan product-template, Fornas, harga, atau stok.',
      'ASPAK profile sukamaju_middle_v1 adalah baseline authoring M13-RP1, bukan readiness real-time.',
    ],
    sourceHashes,
    summary: {
      bySuggestion,
      ppkDirect: cases.filter((item) => item.evidence.ppk.relation === 'direct').length,
      ppkRelated: cases.filter((item) => item.evidence.ppk.relation === 'related').length,
      ppkAbsent: cases.filter((item) => !item.evidence.ppk.relation).length,
      pnpkDirect: cases.filter((item) => item.evidence.pnpk.sources.some((source) => source.relation === 'direct')).length,
      ebmDirect: cases.filter((item) => item.evidence.ebm.sources.some((source) => source.relation === 'direct')).length,
      nonFornasDrugIds: uniqueDrugs.filter((id) => PACK.obat[id]?.fornas === false).sort(),
      resourceTierCOrD: cases.filter((item) => item.evidence.aspak.highestTier === 'C' || item.evidence.aspak.highestTier === 'D').length,
      resourceGrounded: cases.filter((item) => (
        (item.evidence.aspak.highestTier === 'C' || item.evidence.aspak.highestTier === 'D') &&
        item.evidence.aspak.unresolvedResourceIds.length === 0
      )).length,
      resourceUnresolved: cases.filter((item) => item.evidence.aspak.unresolvedResourceIds.length > 0).length,
      kfaUnresolvedQueries: KFA.unresolved.length,
    },
    cases,
  }
}
