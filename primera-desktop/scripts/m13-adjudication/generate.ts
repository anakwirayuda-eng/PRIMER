import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { buildAdjudicationDataset, type AdjudicationDataset, type ReviewStatus } from './build-data'
import { renderAdjudicationHtml } from './html'

const DOCS = resolve(process.cwd(), 'docs')
const DATA_PATH = resolve(DOCS, 'M13_137_ADJUDICATION_DATA.json')
const HTML_PATH = resolve(DOCS, 'M13_137_ADJUDICATION.html')
const REPORT_PATH = resolve(DOCS, 'M13_137_ADJUDICATION_REPORT.md')

function listCases(data: AdjudicationDataset, status: ReviewStatus): string {
  const cases = data.cases.filter((item) => item.compiler.suggestion === status)
  return cases.length
    ? cases.map((item) => `- \`${item.id}\` - ${item.name}: ${item.compiler.reasons.join(' ') || 'tidak ada red flag provenance otomatis'}`).join('\n')
    : '- Tidak ada.'
}

function report(data: AdjudicationDataset): string {
  const sourceWarnings = data.cases.filter((item) => item.compiler.sourceAttributionWarning)
  const noFloor = data.cases.filter((item) => item.evidence.ppk.status === 'tak-ada-sumber' && item.evidence.pnpk.status === 'tak-ada-sumber' && item.evidence.ebm.status === 'tak-ada-sumber')
  const fornasTrueUnlocated = [...new Map(data.cases.flatMap((item) => [
    ...item.currentManagement.requiredDrugs,
    ...item.currentManagement.alternativeDrugs.flat(),
    ...item.currentManagement.optionalDrugs,
  ]).filter((drug) => drug.catalogFornas && drug.fornas.excerpts.length < drug.fornas.queries.length).map((drug) => [drug.id, drug])).values()]

  return `# M13-137 - Laporan Kompilasi Adjudikasi Prototipe Klinis

**Tanggal kompilasi:** ${data.generatedAt.slice(0, 10)}
**Status:** research + compilation only; **bukan adjudikasi dokter dan tidak mengubah gameplay**
**Kemajuan adjudikasi dokter:** **${data.summary.physicianApproved}** kasus sudah ditandatangani, **${data.summary.pendingReview}** masih menunggu. Daftar yang sudah disetujui beserta catatan editnya ada di [\`docs/M13_137_DECISION_LOG.md\`](M13_137_DECISION_LOG.md) — jangan diadjudikasi ulang.
**Snapshot:** commit \`${data.sourceCommit}\`, artefak \`${data.artifactFingerprint}\`, pack \`${data.packFingerprint}\`, content release \`${data.contentRelease}\`, \`REVISI_ENGINE=${data.engineRevision}\`

## Ringkasan eksekutif

Briefing menyebut “M13-103”, tetapi query runtime \`activationStatus === 'lab_prototype_unadjudicated'\` menghasilkan **${data.scope.actualCaseCount} kasus**. Angka 103 berasal dari assertion minimum lama; Batch 4 menambah 34 kasus. Paket review ini karena itu sengaja mengunci **137/137**, bukan hanya 103 pertama.

| Indikator | Hasil |
|---|---:|
| Kasus prototipe aktual | **${data.scope.actualCaseCount}** |
| Sudah disetujui dokter | **${data.summary.physicianApproved}** |
| Menunggu adjudikasi dokter | **${data.summary.pendingReview}** |
| Crosswalk PPK langsung | ${data.summary.ppkDirect} |
| Crosswalk PPK terkait, bukan identik | ${data.summary.ppkRelated} |
| Tanpa crosswalk PPK | ${data.summary.ppkAbsent} |
| Memiliki PNPK langsung | ${data.summary.pnpkDirect} |
| Memiliki pedoman EBM langsung tambahan | ${data.summary.ebmDirect} |
| Saran kompilator “cocok” | ${data.summary.bySuggestion.cocok} |
| Saran kompilator “perlu-koreksi” | ${data.summary.bySuggestion['perlu-koreksi']} |
| Saran kompilator “tak-ada-sumber” | ${data.summary.bySuggestion['tak-ada-sumber']} |
| Kasus dengan resource Tier C/D | ${data.summary.resourceTierCOrD} |
| Obat unik non-Fornas menurut katalog | ${data.summary.nonFornasDrugIds.length} |
| Query KFA aktif-substance tak terpetakan | ${data.summary.kfaUnresolvedQueries} |

Angka saran kompilator **bukan skor mutu klinis**. “Perlu-koreksi” dapat dipicu oleh locator sumber, klaim Fornas, atau readiness ASPAK, meski inti diagnosis mungkin benar. Keputusan akhir tetap radio dokter pada artefak HTML.

## Deliverable

1. [M13_137_ADJUDICATION.html](M13_137_ADJUDICATION.html) - alat review interaktif, filter, autosave lokal, keputusan Setuju/Perlu Edit/Tolak/Nanti, ekspor-impor JSON.
2. [M13_137_ADJUDICATION_DATA.json](M13_137_ADJUDICATION_DATA.json) - dataset audit machine-readable 137 kasus.
3. [M13_137_KFA_SNAPSHOT.json](M13_137_KFA_SNAPSHOT.json) - snapshot endpoint publik KFA active-substance untuk seluruh obat unik yang dipakai prototipe saat artefak dibangun.
4. Dokumen ini - metode, keterbatasan, dan daftar temuan provenance.

## Metode

### Inventaris

- Sumber runtime: \`PACK.kasus\` pada snapshot di atas.
- Filter exact: \`activationStatus === 'lab_prototype_unadjudicated'\`.
- Semua diagnosis, obat wajib/alternatif/opsional, tindakan, edukasi, lab relevan, disposisi, dan teks pedagogis diambil langsung dari objek runtime, bukan disalin manual.

### Lantai PPK/PNPK

- PPK 1186/2022: crosswalk manual-konservatif ke 167 bab pada \`docs/references/ppk1186/ppk1186_entries.json\`.
- Relasi dibedakan **direct** dan **related**. Related tidak boleh dipakai untuk menyatakan “PPK menetapkan diagnosis ini” tanpa pembatasan.
- Cuplikan penatalaksanaan/kriteria rujuk diambil literal dari ekstrak lokal dan diberi nomor bab serta halaman PDF.
- PNPK dipetakan hanya bila ada dokumen diagnosis-spesifik atau konteks terkait yang nyata. Cuplikan otomatis diberi baris sumber; dokumen penuh tetap wajib dibaca saat adjudikasi.
- Amandemen KMK 1936/2022 dan PNPK aktif lebih baru harus mengalahkan bagian lama yang berkonflik.

### Pedoman EBM diagnosis-spesifik

- Registry EBM disimpan terpisah dari PNPK agar WHO, NICE, atau badan pedoman lain tidak pernah salah label sebagai regulasi Indonesia.
- Sumber harus primer, memiliki URL resmi dan locator keputusan; relasi tetap dibedakan **direct** dan **related**.
- Pedoman EBM melengkapi atau memperbarui floor lokal, tetapi implementasinya tetap tunduk pada Fornas, ASPAK, KFA, kewenangan FKTP, dan jalur rujukan.

### Fornas 1199

- Setiap obat dibandingkan dengan flag \`fornas\` katalog dan teks resmi KMK 1199/2025.
- Locator berupa baris ekstrak lokal. Keberadaan nama belum otomatis berarti boleh di FPKTP: reviewer harus membaca kolom FPKTP/FPKTL, restriksi, dan batas peresepan di konteks tabel.
- Non-Fornas bukan otomatis “obat salah”; ia menuntut graceful degradation: alternatif Fornas, program, pengadaan lokal yang eksplisit, atau jejaring.

### ASPAK

- Baseline yang dipakai adalah keputusan M13-RP1 \`sukamaju_middle_v1\`: Puskesmas perdesaan nonrawat-inap, sarana inti cukup, tetapi alat/prasarana bukan all-ready.
- Tier C harus menyatakan jadwal/operator/consumable/readiness; Tier D tidak boleh diasumsikan dan tidak boleh menunda rujukan.
- Ini checklist authoring, bukan mekanik inventori runtime.

### KFA

- Endpoint publik browser KFA: \`/api/search/active-ingredients\`, diakses ${data.generatedAt.slice(0, 10)}.
- Snapshot menghasilkan kode active substance untuk semua query (${data.summary.kfaUnresolvedQueries} unresolved).
- Kode tersebut **bukan** product template/variant, bukan status Fornas, dan bukan bukti stok. Tidak ada kode yang ditebak.

## Temuan provenance prioritas

### Atribusi PPK terlalu kuat (${sourceWarnings.length})

Kasus berikut sudah menulis “PPK/1186” pada teks pemain, tetapi crosswalk hanya related atau tidak ditemukan. Ini perlu dibaca manual sebelum aktivasi; alternatifnya adalah melunakkan atribusi, mengganti sumber, atau memberi locator diagnosis-spesifik.

${sourceWarnings.map((item) => `- \`${item.id}\` - ${item.name}: ${item.evidence.ppk.relation ?? 'none'}${item.evidence.ppk.limitation ? `; ${item.evidence.ppk.limitation}` : ''}`).join('\n') || '- Tidak ada.'}

### Tidak ada PPK, PNPK, maupun pedoman EBM diagnosis-spesifik (${noFloor.length})

“Tak ada sumber” di sini berarti tidak ada sumber yang berhasil dipetakan dalam corpus resmi saat kompilasi, **bukan** bahwa penyakit tidak punya pedoman di dunia. Kasus ini memerlukan sumber program/EBM tambahan atau klaim yang dibatasi.

${noFloor.map((item) => `- \`${item.id}\` - ${item.name}`).join('\n') || '- Tidak ada.'}

### Obat non-Fornas (${data.summary.nonFornasDrugIds.length})

${data.summary.nonFornasDrugIds.map((id) => `- \`${id}\``).join('\n')}

### Flag Fornas=true tetapi locator komponen belum lengkap (${fornasTrueUnlocated.length})

${fornasTrueUnlocated.map((drug) => `- \`${drug.id}\` - ${drug.name}; query: ${drug.fornas.queries.join(', ')}`).join('\n') || '- Tidak ada.'}

## Daftar triase kompilator

### Perlu koreksi

${listCases(data, 'perlu-koreksi')}

### Tak ada sumber

${listCases(data, 'tak-ada-sumber')}

### Cocok secara provenance awal

${listCases(data, 'cocok')}

## Cara regenerasi

\`\`\`powershell
npm run m13:kfa
npm run m13:adjudication
\`\`\`

Generator memvalidasi bahwa query KFA tepat mencakup seluruh obat prototipe. Test invariant terpisah mengunci jumlah 137, caseId exact, indeks PPK valid, dan larangan kode KFA karangan.

## Sumber resmi utama

- KMK 1199/2025 Formularium Nasional: https://e-fornas.kemkes.go.id/api/download?column=pustaka&filename=KMK%20No.%20HK.01.07-MENKES-1199-2025%20ttg%20Formularium%20Nasional.pdf
- Katalog PNPK Kemenkes: https://www.kemkes.go.id/id/media/subfolder/pedoman/pedoman-nasional-pelayanan-kedokteran-pnpk
- Produk hukum Kesehatan Lanjutan 2026: https://keslan.kemkes.go.id/produkhukum?id=2
- Dokumentasi KFA SATUSEHAT: https://satusehat.kemkes.go.id/platform/docs/id/master-data/kfa/preliminary/
- Browser publik KFA: https://satusehat.kemkes.go.id/kfa-browser/farmasi
- Baseline ASPAK lokal: \`docs/M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md\`.
`
}

async function main(): Promise<void> {
  const data = buildAdjudicationDataset()
  if (data.scope.actualCaseCount !== 137) throw new Error(`Jumlah kasus berubah: ${data.scope.actualCaseCount}, expected 137`)
  await Promise.all([
    writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8'),
    writeFile(HTML_PATH, renderAdjudicationHtml(data), 'utf8'),
    writeFile(REPORT_PATH, report(data), 'utf8'),
  ])
  console.log(`M13-137: ${data.cases.length} kasus -> ${HTML_PATH}`)
  console.log(`Saran: ${JSON.stringify(data.summary.bySuggestion)}`)
}

await main()
