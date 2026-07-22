import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { buildIgdAdjudicationDataset } from './igd-data'
import { renderIgdAdjudicationHtml } from './igd-html'

const DOCS = resolve(process.cwd(), 'docs')
const DATA_PATH = resolve(DOCS, 'M13_14_IGD_ADJUDICATION_DATA.json')
const HTML_PATH = resolve(DOCS, 'M13_14_IGD_ADJUDICATION.html')
const REPORT_PATH = resolve(DOCS, 'M13_14_IGD_ADJUDICATION_REPORT.md')

function report(data: ReturnType<typeof buildIgdAdjudicationDataset>): string {
  const warningCount = data.cases.filter((item) => item.compiler.warnings.length > 0).length
  const rows = data.cases.map((item, index) => {
    const sources = item.sources.map((source) => `${source.label} (${source.year})`).join('; ')
    const warning = item.compiler.warnings.join(' ') || 'Tidak ada flag struktur/provenance otomatis.'
    return `| ${index + 1} | \`${item.id}\` | ${item.name} | ${item.icd10} | ${item.skdi} | ${sources} | ${warning} |`
  }).join('\n')
  return `# M13-14 IGD - Snapshot Implementasi Pasca-Adjudikasi

**Tanggal kompilasi:** ${data.generatedAt.slice(0, 10)}

**Status:** **14/14 keputusan dokter tercatat dan patch telah diterapkan ke gameplay Karier**

**Snapshot:** ${data.sourceCommit}; content release \`${data.contentRelease}\`; \`REVISI_ENGINE=${data.engineRevision}\`

**Fingerprint:** \`${data.artifactFingerprint}\`

## Tujuan

Dokumen ini adalah snapshot yang dapat diaudit dari 14 kasus IGD setelah adjudikasi dokter dan implementasi patch. Seluruh kasus aktif di mode Karier pada release ini dan tetap dikeluarkan dari mode Ujian sampai ada keputusan kurikulum tersendiri.

## Cara verifikasi ulang

1. Buka [M13_14_IGD_ADJUDICATION.html](M13_14_IGD_ADJUDICATION.html).
2. Baca vignette, algoritma tiap langkah, disposisi, mutiara klinis, dan tautan sumber.
3. Gunakan enam pertanyaan checklist yang sama untuk audit ulang bila diperlukan.
4. Kontrol **Setuju**, **Perlu edit**, **Tolak**, atau **Nanti** kini hanya mencatat re-review opsional; keputusan resmi tetap berada di decision log.
5. Ekspor \`M13_14_IGD_DECISIONS.json\` bila audit ulang menghasilkan koreksi baru.

Pilihan **Setuju** berarti seluruh keputusan material pada kasus diterima untuk target pembelajaran FKTP. Flag kompilator hanya pemeriksaan struktur/provenance; flag kosong bukan bukti klinis benar.

## Ringkasan

- Kasus: **${data.cases.length}**
- Kasus dengan flag kompilator: **${warningCount}**
- Kasus berstatus \`physician_approved\`: **${data.cases.filter((item) => item.reviewStatus === 'physician_approved').length}**

| # | ID | Diagnosis | ICD-10 | SKDI | Sumber terikat | Flag kompilator |
|---:|---|---|---|---|---|---|
${rows}

## Enam pertanyaan tetap

${data.reviewQuestions.map((question, index) => `${index + 1}. ${question}`).join('\n')}

## Batasan

- Registry sumber membuktikan dokumen mana yang dimaksud, tetapi belum menyediakan locator halaman/paragraf untuk setiap klaim.
- Kesesuaian alat/obat harus dibaca dengan baseline \`sukamaju_middle_v1\`; ketersediaan nasional bukan jaminan kesiapan setiap hari.
- Keputusan resmi 14/14 tercatat di \`M13_14_IGD_DECISION_LOG.md\`; kontrol interaktif dalam HTML adalah sarana re-audit, bukan pengganti rekam sign-off.
- Kasus aktif hanya di Karier melalui \`reviewStatus\`, mode policy, dan \`CONTENT_RELEASE\`; mode Ujian tetap memakai pool terpisah.

## Regenerasi

\`\`\`powershell
npm run m13:igd-adjudication
\`\`\`
`.replace(/[ \t]+$/gm, '')
}

async function main(): Promise<void> {
  const data = buildIgdAdjudicationDataset()
  if (data.cases.length !== 14) throw new Error(`Jumlah IGD teradjudikasi berubah: ${data.cases.length}; expected 14`)
  await Promise.all([
    writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8'),
    writeFile(HTML_PATH, renderIgdAdjudicationHtml(data), 'utf8'),
    writeFile(REPORT_PATH, report(data), 'utf8'),
  ])
  console.log(`M13-14 IGD: ${data.cases.length} kasus -> ${HTML_PATH}`)
}

await main()
