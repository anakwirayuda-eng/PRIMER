import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
// @ts-expect-error jsdom has no bundled declarations in this workspace.
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { report } from '../../../scripts/m13-adjudication/generate'
import { renderAdjudicationHtml } from '../../../scripts/m13-adjudication/html'

const ROOT = process.cwd()
const DATA = buildAdjudicationDataset('2026-07-17T00:00:00.000Z')
const HTML = renderAdjudicationHtml(DATA)
const KFA = JSON.parse(readFileSync(resolve(ROOT, 'docs/M13_137_KFA_SNAPSHOT.json'), 'utf8')) as {
  retrievedAt: string
  endpoint: string
}

type KasusAdjudikasi = (typeof DATA.cases)[number]

// Korpus pencarian SEBELUM obat alternatif ikut diindeks; dipakai untuk memilih
// fixture yang hanya bisa ketemu lewat slot alternatif, bukan untuk berasumsi
// tentang implementasi pencarian di artefak.
function corpusTanpaAlternatif(item: KasusAdjudikasi): string {
  return [
    item.id,
    item.name,
    item.icd10,
    item.category,
    item.skdi,
    item.openingComplaint,
    ...item.currentManagement.requiredDrugs.map((drug) => drug.name),
    ...item.currentManagement.optionalDrugs.map((drug) => drug.name),
  ].join(' ').toLowerCase()
}

function namaObatAlternatif(item: KasusAdjudikasi): string[] {
  return item.currentManagement.alternativeDrugs.flat().map((drug) => drug.name)
}

/** Obat yang hanya hidup di slot alternatif dan menunjuk tepat satu kasus. */
function fixtureObatAlternatif(): { caseId: string; query: string } {
  for (const item of DATA.cases) {
    for (const name of namaObatAlternatif(item)) {
      const query = name.toLowerCase()
      const takTerindeksLama = DATA.cases.filter((other) => corpusTanpaAlternatif(other).includes(query))
      const pemilik = DATA.cases.filter((other) => corpusTanpaAlternatif(other).includes(query)
        || namaObatAlternatif(other).some((alt) => alt.toLowerCase().includes(query)))
      const [satuSatunya] = pemilik
      if (takTerindeksLama.length === 0 && pemilik.length === 1 && satuSatunya?.id === item.id) {
        return { caseId: item.id, query: name }
      }
    }
  }
  throw new Error('Dataset tidak lagi punya obat alternatif eksklusif untuk menguji korpus pencarian.')
}

function bukaAlatReview(): { dom: JSDOM; document: Document } {
  const dom = new JSDOM(HTML, {
    runScripts: 'dangerously',
    url: 'https://review.primera.local/M13_137_ADJUDICATION.html',
    beforeParse(window: Window & typeof globalThis) {
      Object.defineProperty(window, 'CSS', {
        configurable: true,
        value: { escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&') },
      })
      // jsdom tidak mengimplementasikan scrollIntoView; tanpa stub ini handler
      // "kasus berikutnya" melempar setelah render dan menutupi kegagalan asli.
      window.HTMLElement.prototype.scrollIntoView = () => {}
    },
  })
  return { dom, document: dom.window.document }
}

function ubahFilter(dom: JSDOM, document: Document, id: string, value: string): void {
  const select = document.querySelector<HTMLSelectElement>('#' + id)!
  select.value = value
  select.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
}

function cari(dom: JSDOM, document: Document, query: string): void {
  const search = document.querySelector<HTMLInputElement>('#search')!
  search.value = query
  search.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
}

describe('alat review M13-137', () => {
  it('menandai kasus yang sudah ditandatangani dokter di markup, bukan hanya di dataset tertanam', () => {
    const disetujui = DATA.cases.filter((item) => item.reviewStatus === 'physician_approved')
    expect(disetujui.length).toBe(DATA.summary.physicianApproved)
    expect(disetujui.length).toBeGreaterThan(0)

    const { dom, document } = bukaAlatReview()
    ubahFilter(dom, document, 'approval', 'disetujui')

    const kartu = [...document.querySelectorAll('.case-card')]
    expect(kartu.length).toBeGreaterThan(0)
    expect(kartu.every((card) => card.getAttribute('data-approved') === 'true')).toBe(true)
    for (const card of kartu) {
      expect(card.textContent, card.id).toContain('Disetujui dokter')
      expect(card.textContent, card.id).toContain('M13_137_DECISION_LOG.md')
    }
    expect(document.querySelector('#result-count')?.textContent).toBe(`${disetujui.length} kasus cocok filter`)
    dom.window.close()
  })

  it('memberi tahu jumlah tanda tangan dokter pada muat pertama, bukan hanya 0/137 lokal', () => {
    const { dom, document } = bukaAlatReview()
    const label = document.querySelector('#progress-label')?.textContent ?? ''
    expect(label).toContain('0/137')
    expect(label).toContain(`${DATA.summary.physicianApproved} kasus sudah ditandatangani dokter`)
    expect(label).toContain(`${DATA.summary.pendingReview} menunggu`)
    dom.window.close()
  })

  it('filter tanda tangan memisahkan kasus final dari yang masih menunggu', () => {
    const { dom, document } = bukaAlatReview()

    ubahFilter(dom, document, 'approval', 'menunggu')
    expect(document.querySelector('#result-count')?.textContent).toBe(`${DATA.summary.pendingReview} kasus cocok filter`)
    expect(document.querySelectorAll('.case-card[data-approved="true"]')).toHaveLength(0)

    ubahFilter(dom, document, 'approval', '')
    expect(document.querySelector('#result-count')?.textContent).toBe(`${DATA.cases.length} kasus cocok filter`)
    dom.window.close()
  })

  it('tombol kasus berikutnya melewati kasus yang sudah ditandatangani dokter', () => {
    const { dom, document } = bukaAlatReview()
    document.querySelector<HTMLButtonElement>('#next-undecided')!.click()

    expect(document.querySelector<HTMLSelectElement>('#approval')!.value).toBe('menunggu')
    expect(document.querySelector('#result-count')?.textContent).toBe(`${DATA.summary.pendingReview} kasus cocok filter`)
    const pertama = document.querySelector('.case-card')
    expect(pertama).not.toBeNull()
    expect(pertama!.getAttribute('data-approved')).toBeNull()

    const idDisetujui = new Set(DATA.cases.filter((item) => item.reviewStatus === 'physician_approved').map((item) => 'case-' + item.id))
    expect([...document.querySelectorAll('.case-card')].filter((card) => idDisetujui.has(card.id))).toEqual([])
    dom.window.close()
  })

  it('pencarian menemukan kasus lewat nama obat alternatifnya', () => {
    const fixture = fixtureObatAlternatif()
    const { dom, document } = bukaAlatReview()
    cari(dom, document, fixture.query)

    expect(document.querySelector('#result-count')?.textContent).toBe('1 kasus cocok filter')
    expect(document.querySelectorAll('.case-card')).toHaveLength(1)
    expect(document.querySelector('.case-card')?.id).toBe('case-' + fixture.caseId)
    expect(document.querySelector('.empty')).toBeNull()
    dom.window.close()
  })

  it('blok pedoman EBM memakai pemisah titik-tengah yang bersih, bukan mojibake', () => {
    expect(HTML).not.toContain('Â')

    const kasus = DATA.cases.find((item) => item.evidence.ebm.sources.length > 0)!
    const sumber = kasus.evidence.ebm.sources[0]!
    const { dom, document } = bukaAlatReview()
    cari(dom, document, kasus.id)

    const card = document.querySelector('.case-card')!
    const blokEbm = [...card.querySelectorAll('details')]
      .find((node) => node.querySelector('summary')?.textContent?.includes('Pedoman EBM'))!
    expect(blokEbm).toBeDefined()
    expect(blokEbm.querySelector('.source-title')?.textContent).toBe(`${sumber.title} · ${sumber.relation.toUpperCase()}`)
    expect(blokEbm.querySelector('.source .limitation')?.textContent).toBe(`${sumber.authority} · ${sumber.year}`)
    expect(blokEbm.textContent).not.toContain('Â')
    dom.window.close()
  })
})

describe('laporan kompilasi M13-137', () => {
  it('menyebut tanggal panen snapshot KFA, bukan tanggal kompilasi artefak', () => {
    const tanggalPanen = KFA.retrievedAt.slice(0, 10)
    const tanggalKompilasi = DATA.generatedAt.slice(0, 10)
    expect(tanggalPanen).not.toBe(tanggalKompilasi)

    const markdown = report(DATA)
    expect(markdown).toContain(`\`${KFA.endpoint}\`, diakses ${tanggalPanen}`)
    expect(markdown).not.toContain(`diakses ${tanggalKompilasi}`)
    expect(markdown).toContain(`dipanen ${tanggalPanen}`)
    expect(markdown).not.toContain('saat artefak dibangun')
    expect(markdown).toContain('npm run m13:kfa')
  })
})
