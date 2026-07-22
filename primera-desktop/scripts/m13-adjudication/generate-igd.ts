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
  return `# M13-14 IGD - Paket Adjudikasi Dokter

**Tanggal kompilasi:** ${data.generatedAt.slice(0, 10)}

**Status:** research + compilation only; **bukan persetujuan medis dan tidak mengubah gameplay**

**Snapshot:** ${data.sourceCommit}; content release \`${data.contentRelease}\`; \`REVISI_ENGINE=${data.engineRevision}\`

**Fingerprint:** \`${data.artifactFingerprint}\`

## Tujuan

Empat belas kasus IGD prototipe sudah tersedia di mode Karier, tetapi sengaja ditandai \`lab_prototype_unadjudicated\` dan dikeluarkan dari mode Ujian. Paket ini memperkecil pekerjaan dokter menjadi 14 keputusan yang dapat dikerjakan satu per satu tanpa membaca source code.

## Cara review

1. Buka [M13_14_IGD_ADJUDICATION.html](M13_14_IGD_ADJUDICATION.html).
2. Baca vignette, algoritma tiap langkah, disposisi, mutiara klinis, dan tautan sumber.
3. Jawab enam pertanyaan checklist yang sama untuk setiap kasus.
4. Pilih **Setuju**, **Perlu edit**, **Tolak**, atau **Nanti**. Isi catatan bila ada koreksi.
5. Ekspor \`M13_14_IGD_DECISIONS.json\` sebagai rekam keputusan.

Pilihan **Setuju** berarti seluruh keputusan material pada kasus diterima untuk target pembelajaran FKTP. Flag kompilator hanya pemeriksaan struktur/provenance; flag kosong bukan bukti klinis benar.

## Ringkasan

- Kasus: **${data.cases.length}**
- Kasus dengan flag kompilator: **${warningCount}**
- Semua kasus masih memerlukan adjudikasi manusia: **${data.cases.length}**

| # | ID | Diagnosis | ICD-10 | SKDI | Sumber terikat | Flag kompilator |
|---:|---|---|---|---|---|---|
${rows}

## Enam pertanyaan tetap

${data.reviewQuestions.map((question, index) => `${index + 1}. ${question}`).join('\n')}

## Batasan

- Registry sumber membuktikan dokumen mana yang dimaksud, tetapi belum menyediakan locator halaman/paragraf untuk setiap klaim.
- Kesesuaian alat/obat harus dibaca dengan baseline \`sukamaju_middle_v1\`; ketersediaan nasional bukan jaminan kesiapan setiap hari.
- Artefak ini tidak mengubah \`activationStatus\`. Aktivasi akademik baru boleh dilakukan dari ekspor keputusan dokter yang fingerprint-nya cocok.

## Regenerasi

\`\`\`powershell
npm run m13:igd-adjudication
\`\`\`
`.replace(/[ \t]+$/gm, '')
}

async function main(): Promise<void> {
  const data = buildIgdAdjudicationDataset()
  if (data.cases.length !== 14) throw new Error(`Jumlah prototipe IGD berubah: ${data.cases.length}; expected 14`)
  await Promise.all([
    writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8'),
    writeFile(HTML_PATH, renderIgdAdjudicationHtml(data), 'utf8'),
    writeFile(REPORT_PATH, report(data), 'utf8'),
  ])
  console.log(`M13-14 IGD: ${data.cases.length} kasus -> ${HTML_PATH}`)
}

await main()
