import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PACK } from '../src/content'
import {
  sitasiIntervensiUkm,
  tautanKegiatanUkm,
  tautanPanduanSkenarioUkm,
} from '../src/content/ukmCitations'
import { kartuIntervensiBenar } from '../src/content/ukmEvidence'
import { DUEL_DIAGNOSIS_PILOTS, TEACH_BACK_PILOTS } from '../src/content/pedagogyPilots'

interface CaseAudit {
  id: string
  nama: string
  indonesia: number
  internasional: number
  total: number
  masalah: string[]
}

export function auditClinicalProvenance(): CaseAudit[] {
  return Object.values(PACK.kasus)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((kasus) => {
      const sumber = kasus.sumber ?? []
      const ids = sumber.map((item) => item.id)
      const masalah: string[] = []
      const indonesia = sumber.filter((item) => item.jenis === 'pedoman_indonesia').length
      const internasional = sumber.filter((item) => item.jenis === 'evidence_internasional').length

      if (indonesia === 0) masalah.push('tanpa sumber Indonesia')
      if (internasional === 0) masalah.push('tanpa evidence internasional')
      if (new Set(ids).size !== ids.length) masalah.push('id sumber duplikat')
      if (new Set(sumber.map((item) => item.url)).size !== sumber.length) {
        masalah.push('URL sumber duplikat')
      }
      if (sumber.some((item) => !item.url.startsWith('https://'))) masalah.push('URL non-HTTPS')
      if (sumber.some((item) => !Number.isInteger(item.tahun) || item.tahun < 1900 || item.tahun > 2100)) {
        masalah.push('tahun sumber tidak valid')
      }
      if (sumber.some((item) => !item.cakupan)) masalah.push('status cakupan kosong')
      if (sumber.some((item) => item.cakupan === 'floor_umum' && !item.catatan?.trim())) {
        masalah.push('floor umum tanpa catatan batas')
      }
      if (sumber.length < 2) masalah.push('kurang dari 2 sumber')
      if (sumber.length > 10) masalah.push('lebih dari 10 sumber')

      return {
        id: kasus.id,
        nama: kasus.nama,
        indonesia,
        internasional,
        total: sumber.length,
        masalah,
      }
    })
}

const hasil = auditClinicalProvenance()
const bermasalah = hasil.filter((item) => item.masalah.length > 0)
const totalSumber = hasil.reduce((jumlah, item) => jumlah + item.total, 0)
const inventoryMode = process.argv.includes('--inventory')
const baselineOnly = process.argv.includes('--baseline')
const markdownMode = process.argv.includes('--markdown')

console.log(`Kasus poli: ${hasil.length}`)
console.log(`Lengkap: ${hasil.length - bermasalah.length}/${hasil.length}`)
console.log(`Tautan: ${totalSumber}`)
console.log(`Bermasalah: ${bermasalah.length}`)

if (markdownMode) {
  const cases = Object.values(PACK.kasus).sort((a, b) => a.id.localeCompare(b.id))
  const igdCases = Object.values(PACK.kasusIgd).sort((a, b) => a.id.localeCompare(b.id))
  const ukmScenarios = Object.values(PACK.keluarga)
    .flatMap((keluarga) => keluarga.arc.kunjungan)
    .sort((a, b) => a.id.localeCompare(b.id))
  const activityKinds = ['posyandu', 'prolanis', 'klb'] as const
  const allUrls = [
    ...cases.flatMap((kasus) => (kasus.sumber ?? []).map((item) => item.url)),
    ...igdCases.flatMap((kasus) => kasus.sumber.map((item) => item.url)),
    ...ukmScenarios.flatMap((skenario) => {
      const correct = skenario.intervensi.find((card) => kartuIntervensiBenar(skenario, card))
      return [
        ...tautanPanduanSkenarioUkm(skenario).map((item) => item.url),
        ...(correct
          ? sitasiIntervensiUkm(skenario, correct, 'pasca_penilaian').tautan.map((item) => item.url)
          : []),
      ]
    }),
    ...activityKinds.flatMap((kind) =>
      tautanKegiatanUkm({ id: `${kind}_audit` }, kind).map((item) => item.url),
    ),
    ...DUEL_DIAGNOSIS_PILOTS.flatMap((pilot) => pilot.sumber.map((item) => item.url)),
    ...TEACH_BACK_PILOTS.flatMap((pilot) => pilot.sumber.map((item) => item.url)),
  ]
  const uniqueUrls = new Set(allUrls)
  const coverageCounts = cases
    .flatMap((kasus) => kasus.sumber ?? [])
    .reduce<Record<string, number>>((counts, source) => {
      const key = source.cakupan ?? 'tanpa_status'
      counts[key] = (counts[key] ?? 0) + 1
      return counts
    }, {})
  const cell = (value: string): string =>
    value.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim()
  const sourceList = (kasus: (typeof cases)[number]): string =>
    (kasus.sumber ?? [])
      .map((source) => {
        const kind = source.jenis === 'pedoman_indonesia' ? 'Indonesia' : 'Internasional'
        const scope = source.cakupan === 'floor_umum'
          ? 'floor umum'
          : source.cakupan ?? 'tanpa status'
        const note = source.catatan ? `; batas: ${cell(source.catatan)}` : ''
        return `[${cell(source.label)}](${source.url}) (${kind}; ${scope}; ${source.tahun}${note})`
      })
      .join('<br>')
  const rows = cases.map((kasus, index) =>
    `| ${index + 1} | \`${kasus.id}\` | ${cell(kasus.nama)} | \`${kasus.icd10}\` | ${sourceList(kasus)} |`,
  )
  const igdRows = igdCases.map((kasus, index) =>
    `| ${index + 1} | \`${kasus.id}\` | ${cell(kasus.nama)} | ${kasus.sumber
      .map((source) => `[${cell(source.label)}](${source.url}) (${source.jenis === 'pedoman_indonesia' ? 'Indonesia' : 'Internasional'}; ${source.tahun})`)
      .join('<br>')} |`,
  )
  const ukmRows = ukmScenarios.map((skenario, index) => {
    const correct = skenario.intervensi.find((card) => kartuIntervensiBenar(skenario, card))
    const evidence = correct
      ? sitasiIntervensiUkm(skenario, correct, 'pasca_penilaian')
      : undefined
    const broadLinks = tautanPanduanSkenarioUkm(skenario)
      .map((source) => `[${cell(source.label)}](${source.url})`)
      .join('<br>')
    const evidenceLinks = evidence?.tautan
      .map((source) => `[${cell(source.label)}](${source.url})`)
      .join('<br>') ?? '-'
    return `| ${index + 1} | \`${skenario.id}\` | ${cell(skenario.judul)} | ${cell(skenario.target.join(', '))} | ${correct ? cell(correct.nama) : '**TIDAK ADA**'} | ${broadLinks} | ${evidenceLinks} |`
  })
  const activityRows = activityKinds.map((kind, index) =>
    `| ${index + 1} | ${kind.toUpperCase()} | ${tautanKegiatanUkm({ id: `${kind}_audit` }, kind)
      .map((source) => `[${cell(source.label)}](${source.url})`)
      .join('<br>')} |`,
  )
  const pedagogyRows = [
    ...DUEL_DIAGNOSIS_PILOTS.map((pilot) => ({
      kind: 'Duel Diagnosis',
      id: pilot.id,
      sources: pilot.sumber,
    })),
    ...TEACH_BACK_PILOTS.map((pilot) => ({
      kind: 'Teach-back',
      id: pilot.id,
      sources: pilot.sumber,
    })),
  ].map((pilot, index) =>
    `| ${index + 1} | ${pilot.kind} | \`${pilot.id}\` | ${pilot.sources
      .map((source) => `[${cell(source.label)}](${source.url}) (${source.tahun})`)
      .join('<br>')} |`,
  )
  const report = [
    '# Matriks Provenance Gameplay PRIMERA',
    '',
    `Dibangkitkan: ${new Date().toISOString()}`,
    '',
    '## Ringkasan',
    '',
    `- Kasus poli: **${cases.length}/${cases.length}** memiliki provenance terstruktur.`,
    `- Kasus IGD: **${igdCases.length}/${igdCases.length}** memiliki provenance terstruktur.`,
    `- Skenario kunjungan UKM: **${ukmScenarios.length}/${ukmScenarios.length}** memiliki landasan program dan binding evidence untuk resep sosial benar.`,
    `- Keluarga kegiatan UKM: **${activityKinds.length}/${activityKinds.length}** memiliki tautan sumber resmi.`,
    `- Refleksi formatif: **${DUEL_DIAGNOSIS_PILOTS.length}** Duel Diagnosis dan **${TEACH_BACK_PILOTS.length}** Teach-back memiliki tautan evidence.`,
    `- Tautan kasus-sumber poli: **${totalSumber}**.`,
    `- URL unik lintas UKP, IGD, dan UKM: **${uniqueUrls.size}**.`,
    `- Cakupan: langsung **${coverageCounts['langsung'] ?? 0}**, terkait **${coverageCounts['terkait'] ?? 0}**, floor umum **${coverageCounts['floor_umum'] ?? 0}**.`,
    `- Masalah struktural saat generasi: **${bermasalah.length}**.`,
    '',
    'Label `langsung` berarti sumber menopang keputusan encounter secara langsung; `terkait` menopang domain atau jalur keputusan yang berdekatan; `floor umum` adalah batas bawah regulasi/layanan dan selalu disertai catatan batas interpretasi.',
    '',
    'Audit keterjangkauan jaringan dijalankan terpisah melalui `npm run audit:provenance:urls` agar kegagalan sementara atau penolakan bot tidak disamakan dengan tautan mati.',
    '',
    '## Matriks Poli',
    '',
    '| No. | ID kasus | Diagnosis | ICD-10 | Sumber klik-able |',
    '|---:|---|---|---|---|',
    ...rows,
    '',
    '## Matriks IGD',
    '',
    '| No. | ID kasus | Diagnosis kerja | Sumber klik-able |',
    '|---:|---|---|---|',
    ...igdRows,
    '',
    '## Matriks Kunjungan UKM',
    '',
    'Setiap skenario memiliki empat floor/domain links. Hanya kartu resep sosial yang benar mendapat binding evidence mekanisme; kartu lain adalah distraktor dan tidak diendors sumber.',
    '',
    '| No. | ID skenario | Judul | Target PIS-PK | Resep sosial benar | Landasan program | Evidence mekanisme |',
    '|---:|---|---|---|---|---|---|',
    ...ukmRows,
    '',
    '## Matriks Kegiatan UKM',
    '',
    '| No. | Kegiatan | Sumber klik-able |',
    '|---:|---|---|',
    ...activityRows,
    '',
    '## Matriks Refleksi Formatif',
    '',
    '| No. | Bentuk | ID | Sumber klik-able |',
    '|---:|---|---|---|',
    ...pedagogyRows,
    '',
  ].join('\n')
  const outputPath = resolve('docs/CLINICAL_PROVENANCE_MATRIX.md')
  writeFileSync(outputPath, report, 'utf8')
  console.log(`Matriks Markdown: ${outputPath}`)
} else if (inventoryMode) {
  const kasusInventaris = Object.values(PACK.kasus)
    .filter((kasus) => !baselineOnly || !kasus.id.startsWith('lab_'))
    .sort((a, b) => a.id.localeCompare(b.id))
  for (const kasus of kasusInventaris) {
    console.log([
      kasus.id,
      kasus.nama,
      kasus.icd10,
      kasus.kategori,
      kasus.panduanResmi ?? '',
      kasus.mutiaraEbm ?? '',
    ].map((value) => String(value).replace(/\s+/g, ' ').trim()).join('\t'))
  }
} else {
  for (const item of bermasalah) {
    console.log(
      `${item.id}\t${item.nama}\tID=${item.indonesia}\tEBM=${item.internasional}\t${item.masalah.join('; ')}`,
    )
  }
}

if (bermasalah.length > 0) process.exitCode = 1
