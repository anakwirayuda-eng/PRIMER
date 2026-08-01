import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { PACK } from '../src/content'
import type { SumberKlinis } from '../src/content/types'

interface SourceUse {
  area: 'poli' | 'igd'
  encounterId: string
  encounterName: string
  source: SumberKlinis
}

interface SourceSummary {
  id: string
  label: string
  url: string
  domain: string
  tahun: number
  jenis: SumberKlinis['jenis']
  uses: SourceUse[]
}

const CURRENT_YEAR = 2026
const OUTPUT = resolve('docs', 'reports', 'CLINICAL_SOURCE_QUALITY_AUDIT.md')

/**
 * Browser-verification is deliberately stricter than the HTTP crawler.
 * NICE currently returns a literal 403 page in the same Chromium browser
 * used by PRIMERA, so those links may not ship as player-facing citations.
 */
const PLAYER_BLOCKED_DOMAINS = new Set(['www.nice.org.uk'])

/**
 * These older documents are deliberately retained because they remain active
 * society guidance or define a foundational construct still used by a newer
 * management source. Keeping the rationale here prevents "newer year wins"
 * from becoming a misleading quality rule.
 */
const RETAINED_OLDER_EVIDENCE: Record<string, string> = {
  who_pesticide_2008:
    'Manual WHO yang masih menjadi rujukan klinis organofosfat; dipakai bersama algoritme resusitasi dan tidak ditafsirkan sebagai daftar inventaris FKTP.',
  who_bodily_distress_cbt_2012:
    'Dipertahankan untuk menunjukkan bahwa rekomendasi CBT-principle bersifat kondisional dan buktinya sangat rendah, bukan untuk mengalahkan ICD-11 CDDR 2024.',
  cochrane_antiviral_phn:
    'Review Cochrane diagnosis-spesifik yang menopang batas klaim: antivirus akut tidak terbukti mencegah neuralgia pascaherpes.',
  ilae_status_2015:
    'Definisi waktu status epileptikus yang fondasional; terapi akut ditopang PNPK Epilepsi 2026 dan sumber resusitasi yang lebih baru.',
  'ata-hyperthyroidism-2016':
    'Masih tercantum sebagai guideline aktif ATA untuk hipertiroidisme; kasus membatasi penggunaannya pada populasi dewasa nonhamil.',
  sepsis3_2016:
    'Definisi konsensus fondasional; keputusan tata laksana akut juga ditopang PNPK dan Surviving Sepsis Campaign yang lebih baru.',
  who_mhgap_ig2_2016:
    'Masih menjadi panduan operasional nonspesialis yang diagnosis-spesifik; dibaca bersama ICD-11 CDDR 2024 dan bukti komunikasi 2022.',
  who_snakebite_2016:
    'Pedoman klinis WHO SEARO edisi kedua yang tetap paling langsung untuk konteks regional Indonesia.',
  'bsaci-rhinitis-2017':
    'Tetap paling langsung untuk rinitis nonalergi/vasomotor; update ARIA yang lebih baru berfokus pada rinitis alergi.',
  'wses-complicated-hernia-2017':
    'Masih merupakan update WSES diagnosis-spesifik untuk hernia inkarserata/strangulata dan source control emergensi.',
  'easl-decompensated-cirrhosis-2018':
    'Pedoman EASL sindrom dekompensasi yang masih relevan; dipakai bersama sumber ascites/komplikasi yang lebih baru.',
  'niddk-lactose-intolerance-2018':
    'Halaman klinis NIDDK yang masih aktif untuk diagnosis dan uji eliminasi-terkontrol; bukan sumber dosis obat.',
  who_bec:
    'Kursus first-contact WHO/ICRC fondasional untuk ABCDE, transfer, dan handover di fasilitas terbatas.',
  'who-leprosy-2018':
    'Pedoman WHO diagnosis dan MDT yang masih aktif; aspek kontak diperbarui oleh sumber WHO yang lebih baru.',
  'wses-asbo-2018':
    'Bologna guideline masih menjadi rujukan diagnosis-spesifik WSES untuk adhesive small-bowel obstruction.',
  'ats-idsa-cap-2019':
    'Masih menjadi guideline ATS/IDSA aktif untuk CAP dewasa dan dipakai hanya pada populasi yang sesuai.',
  german_s3_functional_somatic_2019:
    'Sumber stepped-care dan komunikasi diagnosis-spesifik; dibaca bersama ICD-11 CDDR 2024 dan review komunikasi 2022.',
  'aao-hns-nosebleed-2020':
    'Guideline AAO-HNSF aktif dan diagnosis-spesifik untuk epistaksis.',
  'acr-gout-2020':
    'Masih menjadi guideline ACR aktif untuk gout dan tetap menopang keputusan antiinflamasi yang dinilai.',
  'epos-rhinosinusitis-2020':
    'EPOS 2020 tetap pedoman komprehensif aktif untuk rinosinusitis; update yang lebih baru tidak menggantikan seluruh algoritmenya.',
  'wses-cholecystitis-2020':
    'Masih menjadi guideline WSES diagnosis-spesifik untuk kolesistitis akut dan ambang source control.',
  'aao-hns-bell-palsy-2013':
    'Masih menjadi guideline aktif AAO-HNSF untuk Bell palsy; keputusan obat tetap dibaca bersama bukti yang lebih baru bila tersedia.',
  'aao-hns-otitis-externa-2014':
    'Masih menjadi guideline aktif AAO-HNSF untuk acute otitis externa.',
  'aao-hns-bppv-2017':
    'Update AAO-HNSF yang masih aktif dan diagnosis-spesifik untuk BPPV.',
  'aao-hns-cerumen-2017':
    'Guideline diagnosis-spesifik AAO-HNSF yang masih aktif untuk impaksi serumen.',
  'idsa-ssti-2014':
    'Guideline IDSA yang masih aktif untuk SSTI; dipakai pada simpul source-control yang spesifik.',
  // S-provenance (2026-08-01): 7 sumber baru dari batch penguatan cakupan poli
  // yang usianya >6 tahun tapi tetap edisi teraktif tanpa pengganti — tiap
  // klaim "tidak ada versi lebih baru" diverifikasi via WebSearch silang saat
  // riset, bukan asumsi.
  'cochrane-systemic-ras-2012':
    'Tinjauan sistemik RAS pub2 (2012), tidak ditemukan pub3/penarikan; hanya mencakup intervensi sistemik (lihat catatan pada assignment), bukan kortikosteroid topikal yang dipakai kasus.',
  'aaaai-contact-dermatitis-2015':
    'Practice parameter AAAAI/ACAAI/JCAAI masih menjadi rujukan aktif utk patch testing dan diferensiasi ACD/ICD; tidak ditemukan update penuh yang menggantikannya.',
  'cochrane-acute-laryngitis-antibiotics-2015':
    'Update pub5 (23 Mei 2015) dari review 2005; tidak ditemukan pub6. Diagnosis-spesifik "acute laryngitis" — lebih tepat drpd guideline umbrella "hoarseness/dysphonia" yang lebih baru tapi tidak eksplisit membahas laringitis akut.',
  'kyoto-consensus-hpylori-gastritis-2015':
    'Konsensus fondasional (Sugano dkk, Gut 2015) yang masih dikutip aktif di literatur 2023-2024 sbg klasifikasi gastritis kronis berbasis etiologi; tidak ada revisi resmi fakultas yang sama.',
  'who-anc-positive-pregnancy-2016':
    'Dokumen ANC standalone WHO yang masih aktif dgn amandemen tempel s/d 2022 (vit D, zink, USG). Catatan kebijakan: WHO juga menerbitkan compendium "Recommendations on maternal health" 2025 yang mengonsolidasi sebagian rekomendasi individual — tim boleh meninjau ulang preferensi standalone vs konsolidasi pada review berikutnya.',
  'cochrane-hordeolum-2017':
    'Update pub4 (2017) dari seri 2009/2010/2013; tidak ada pub5. Review menyimpulkan ketiadaan RCT memadai, dipakai sbg dasar status opsional (bukan wajib) pada tata laksana kasus.',
  'acog-vulvar-skin-disorders-2020':
    'Practice Bulletin No. 224 (2020) untuk kelainan kulit vulva termasuk vulvitis kontak/iritan; tidak ditemukan nomor bulletin pengganti per Agustus 2026.',
}

function collectUses(): SourceUse[] {
  const uses: SourceUse[] = []

  for (const encounter of Object.values(PACK.kasus)) {
    for (const source of encounter.sumber ?? []) {
      uses.push({
        area: 'poli',
        encounterId: encounter.id,
        encounterName: encounter.diagnosis,
        source,
      })
    }
  }

  for (const encounter of Object.values(PACK.kasusIgd)) {
    for (const source of encounter.sumber) {
      uses.push({
        area: 'igd',
        encounterId: encounter.id,
        encounterName: encounter.diagnosis,
        source,
      })
    }
  }

  return uses
}

function summarize(uses: SourceUse[]): SourceSummary[] {
  const byIdentity = new Map<string, SourceSummary>()

  for (const use of uses) {
    const key = `${use.source.id}\n${use.source.url}`
    const domain = new URL(use.source.url).hostname.toLowerCase()
    const current = byIdentity.get(key)
    if (current) {
      current.uses.push(use)
      continue
    }
    byIdentity.set(key, {
      id: use.source.id,
      label: use.source.label,
      url: use.source.url,
      domain,
      tahun: use.source.tahun,
      jenis: use.source.jenis,
      uses: [use],
    })
  }

  return [...byIdentity.values()].sort(
    (a, b) => a.tahun - b.tahun || a.id.localeCompare(b.id),
  )
}

function escapeCell(value: string): string {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function encounterList(source: SourceSummary): string {
  return source.uses
    .map((use) => `${use.area}:${use.encounterId}`)
    .filter((value, index, all) => all.indexOf(value) === index)
    .sort()
    .join(', ')
}

const uses = collectUses()
const sources = summarize(uses)
const blocked = sources.filter((source) => PLAYER_BLOCKED_DOMAINS.has(source.domain))
const olderEvidence = sources.filter(
  (source) =>
    source.jenis === 'evidence_internasional' &&
    source.tahun <= CURRENT_YEAR - 6,
)
const retainedOlderEvidence = olderEvidence.filter(
  (source) => RETAINED_OLDER_EVIDENCE[source.id],
)
const olderEvidenceNeedingReview = olderEvidence.filter(
  (source) => !RETAINED_OLDER_EVIDENCE[source.id],
)
const encounterIssues: string[] = []

for (const encounter of Object.values(PACK.kasus)) {
  const source = encounter.sumber ?? []
  if (!source.some((item) => item.cakupan === 'langsung')) {
    encounterIssues.push(`${encounter.id}: belum memiliki sumber langsung`)
  }
  if (
    !source.some(
      (item) =>
        item.jenis === 'evidence_internasional' &&
        item.cakupan === 'langsung',
    )
  ) {
    encounterIssues.push(`${encounter.id}: EBM internasional masih terkait/floor`)
  }
}

const lines = [
  '# Audit Mutu Sumber Klinis PRIMERA',
  '',
  `Dihasilkan: ${new Date().toISOString()}`,
  '',
  '## Ringkasan',
  '',
  `- Encounter poli: ${Object.keys(PACK.kasus).length}`,
  `- Encounter IGD: ${Object.keys(PACK.kasusIgd).length}`,
  `- Pemakaian sumber: ${uses.length}`,
  `- Identitas sumber unik: ${sources.length}`,
  `- Tautan dari domain yang gagal di browser pemain: ${blocked.length}`,
  `- Sumber lama yang dipertahankan dengan alasan eksplisit: ${retainedOlderEvidence.length}`,
  `- Kandidat review kemutakhiran (EBM <= ${CURRENT_YEAR - 6}): ${olderEvidenceNeedingReview.length}`,
  `- Kandidat penguatan cakupan poli: ${encounterIssues.length}`,
  '',
  'Tahun lama adalah pemicu review, bukan vonis kedaluwarsa. Sumber lama dapat',
  'dipertahankan bila masih merupakan pedoman aktif, dokumen fondasional, atau',
  'belum memiliki pengganti yang lebih kuat untuk keputusan yang sama.',
  '',
  '## Blocker Akses Pemain',
  '',
  '| Sumber | Tahun | URL | Dipakai pada |',
  '|---|---:|---|---|',
  ...blocked.map(
    (source) =>
      `| ${escapeCell(source.label)} | ${source.tahun} | ${source.url} | ${escapeCell(encounterList(source))} |`,
  ),
  '',
  '## Sumber Lama yang Sengaja Dipertahankan',
  '',
  '| Sumber | Tahun | Alasan | Dipakai pada |',
  '|---|---:|---|---|',
  ...retainedOlderEvidence.map(
    (source) =>
      `| ${escapeCell(source.label)} | ${source.tahun} | ${escapeCell(RETAINED_OLDER_EVIDENCE[source.id]!)} | ${escapeCell(encounterList(source))} |`,
  ),
  '',
  '## Kandidat Review Kemutakhiran',
  '',
  '| Sumber | Tahun | Cakupan | URL |',
  '|---|---:|---|---|',
  ...olderEvidenceNeedingReview.map(
    (source) =>
      `| ${escapeCell(source.label)} | ${source.tahun} | ${escapeCell(encounterList(source))} | ${source.url} |`,
  ),
  '',
  '## Kandidat Penguatan Cakupan Poli',
  '',
  ...(encounterIssues.length > 0
    ? encounterIssues.map((issue) => `- ${issue}`)
    : ['Tidak ada.']),
  '',
]

mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, `${lines.join('\n')}\n`, 'utf8')

console.log(`Sumber unik: ${sources.length}`)
console.log(`Blocker akses pemain: ${blocked.length}`)
console.log(`Sumber lama dipertahankan: ${retainedOlderEvidence.length}`)
console.log(`Kandidat review kemutakhiran: ${olderEvidenceNeedingReview.length}`)
console.log(`Kandidat penguatan cakupan poli: ${encounterIssues.length}`)
console.log(`Laporan: ${OUTPUT}`)

if (blocked.length > 0) process.exitCode = 1
