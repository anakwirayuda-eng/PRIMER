import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
// @ts-expect-error jsdom has no bundled declarations in this workspace.
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'
import { PACK } from '..'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  EBM_GUIDELINE_SOURCES,
  KFA_QUERIES,
  PNPK_CROSSWALK,
  PPK_CROSSWALK,
} from '../../../scripts/m13-adjudication/config'

const ROOT = process.cwd()
const DATA = buildAdjudicationDataset('2026-07-17T00:00:00.000Z')
const PPK_ENTRIES = JSON.parse(readFileSync(resolve(ROOT, 'docs/references/ppk1186/ppk1186_entries.json'), 'utf8')) as unknown[]
const KFA = JSON.parse(readFileSync(resolve(ROOT, 'docs/M13_137_KFA_SNAPSHOT.json'), 'utf8')) as {
  caseCount: number
  drugCount: number
  unresolved: string[]
  items: Array<{ drugId: string; queryResults: Array<{ results: Array<{ kfaCode: string }> }> }>
}

function usedDrugIds(): string[] {
  return [...new Set(Object.values(PACK.kasus)
    .filter((item) => item.activationStatus === 'lab_prototype_unadjudicated')
    .flatMap((item) => [
      ...item.tatalaksana.obatBenar,
      ...(item.tatalaksana.obatAlternatif ?? []).flat(),
      ...(item.tatalaksana.obatOpsional ?? []),
    ]))].sort()
}

describe('M13-137 adjudication artifact', () => {
  it('mengunci seluruh 137 prototipe aktual, bukan minimum stale 103', () => {
    const runtimeIds = Object.values(PACK.kasus)
      .filter((item) => item.activationStatus === 'lab_prototype_unadjudicated')
      .map((item) => item.id)
      .sort()
    expect(runtimeIds).toHaveLength(137)
    expect(DATA.scope.actualCaseCount).toBe(137)
    expect(DATA.cases.map((item) => item.id).sort()).toEqual(runtimeIds)
    expect(new Set(DATA.cases.map((item) => item.id)).size).toBe(137)
  })

  it('crosswalk PPK hanya memakai kasus runtime dan indeks 167-bab yang valid', () => {
    const runtimeIds = new Set(DATA.cases.map((item) => item.id))
    expect(Object.keys(PPK_CROSSWALK).filter((id) => !runtimeIds.has(id))).toEqual([])
    for (const [caseId, link] of Object.entries(PPK_CROSSWALK)) {
      expect(PPK_ENTRIES[link.entryIndex], caseId).toBeDefined()
      expect(['direct', 'related'], caseId).toContain(link.relation)
    }
    expect(DATA.summary).toMatchObject({ ppkDirect: 91, ppkRelated: 15, ppkAbsent: 31 })
  })

  it('crosswalk PNPK tidak mempunyai caseId yatim dan relasi eksplisit', () => {
    const runtimeIds = new Set(DATA.cases.map((item) => item.id))
    expect(Object.keys(PNPK_CROSSWALK).filter((id) => !runtimeIds.has(id))).toEqual([])
    for (const [caseId, links] of Object.entries(PNPK_CROSSWALK)) {
      expect(links.length, caseId).toBeGreaterThan(0)
      expect(links.every((link) => link.relation === 'direct' || link.relation === 'related'), caseId).toBe(true)
    }
    expect(DATA.summary.pnpkDirect).toBe(27)
  })

  it('registry EBM terpisah dari PNPK, primer, dan tidak mempunyai caseId/sumber yatim', () => {
    const runtimeIds = new Set(DATA.cases.map((item) => item.id))
    expect(Object.keys(EBM_GUIDELINE_CROSSWALK).filter((id) => !runtimeIds.has(id))).toEqual([])
    for (const [caseId, links] of Object.entries(EBM_GUIDELINE_CROSSWALK)) {
      expect(links.length, caseId).toBeGreaterThan(0)
      for (const link of links) {
        const source = EBM_GUIDELINE_SOURCES[link.sourceId]
        expect(source, `${caseId}:${link.sourceId}`).toBeDefined()
        if (!source) throw new Error(`Sumber EBM hilang: ${link.sourceId}`)
        expect(source.officialUrl, link.sourceId).toMatch(/^https:\/\//)
        expect(link.locator.trim().length, link.sourceId).toBeGreaterThan(20)
      }
    }
    expect(DATA.summary.ebmDirect).toBe(66)
  })

  it('snapshot KFA exact mencakup 67 obat dan tidak mengarang query yang gagal', () => {
    const ids = usedDrugIds()
    expect(ids).toHaveLength(67)
    expect(Object.keys(KFA_QUERIES).sort()).toEqual(ids)
    expect(KFA.caseCount).toBe(137)
    expect(KFA.drugCount).toBe(67)
    expect(KFA.unresolved).toEqual([])
    expect(KFA.items.map((item) => item.drugId).sort()).toEqual(ids)
    for (const item of KFA.items) {
      expect(item.queryResults.every((query) => query.results.length > 0), item.drugId).toBe(true)
      for (const result of item.queryResults.flatMap((query) => query.results)) {
        expect(result.kfaCode, item.drugId).toMatch(/^\d{8}$/)
      }
    }
  })

  it('gap locator Fornas=true tetap eksplisit dan tidak melebar diam-diam', () => {
    const missing = [...new Map(DATA.cases.flatMap((item) => [
      ...item.currentManagement.requiredDrugs,
      ...item.currentManagement.alternativeDrugs.flat(),
      ...item.currentManagement.optionalDrugs,
    ]).filter((drug) => drug.catalogFornas && drug.fornas.excerpts.length < drug.fornas.queries.length)
      .map((drug) => [drug.id, drug])).keys()].sort()
    expect(missing).toEqual([])
    expect(DATA.summary.nonFornasDrugIds).toEqual([
      'benzoyl_peroksida_25',
      'emolien_petrolatum',
      'flutikason_semprot_hidung',
      'klindamisin_topikal_1',
      'mdt_kusta_pb',
      'metronidazol_topikal_075',
      'permetrin_losion_1',
      'triamcinolone_orabase',
      'zinc_oxide_krim',
    ])
  })

  it('setiap kasus membawa provenance enam dimensi dan bukan keputusan dokter', () => {
    for (const item of DATA.cases) {
      expect(item.evidence.ppk.status, item.id).toMatch(/^(cocok|perlu-koreksi|tak-ada-sumber)$/)
      expect(item.evidence.pnpk.status, item.id).toMatch(/^(cocok|perlu-koreksi|tak-ada-sumber)$/)
      expect(item.evidence.ebm.status, item.id).toMatch(/^(cocok|perlu-koreksi|tak-ada-sumber)$/)
      expect(item.evidence.fornas.status, item.id).toMatch(/^(cocok|perlu-koreksi|tak-ada-sumber)$/)
      expect(item.evidence.aspak.status, item.id).toMatch(/^(cocok|perlu-koreksi|tak-ada-sumber)$/)
      expect(item.evidence.kfa.status, item.id).toMatch(/^(cocok|perlu-koreksi|tak-ada-sumber)$/)
      expect(item.compiler.suggestion, item.id).toMatch(/^(cocok|perlu-koreksi|tak-ada-sumber)$/)
      expect(item).not.toHaveProperty('physicianDecision')
    }
  })

  it('artefak checked-in cocok dengan fingerprint dataset terkini', () => {
    const checkedIn = JSON.parse(readFileSync(resolve(ROOT, 'docs/M13_137_ADJUDICATION_DATA.json'), 'utf8')) as typeof DATA
    const html = readFileSync(resolve(ROOT, 'docs/M13_137_ADJUDICATION.html'), 'utf8')
    expect(checkedIn.artifactFingerprint).toBe(DATA.artifactFingerprint)
    expect(checkedIn.cases.map((item) => item.id)).toEqual(DATA.cases.map((item) => item.id))
    expect(html).toContain(DATA.artifactFingerprint)
    expect(html).toContain('primera.m13-137-physician-decisions.v1')
    expect(html).toContain('Setuju')
    expect(html).toContain('Perlu edit')
    expect(html).toContain('Tolak')
    expect(html).toContain('Nanti')
  })

  it('HTML final merender, memfilter, menyimpan keputusan, dan mengganti tema', () => {
    const html = readFileSync(resolve(ROOT, 'docs/M13_137_ADJUDICATION.html'), 'utf8')
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      url: 'https://review.primera.local/M13_137_ADJUDICATION.html',
      beforeParse(window: Window & typeof globalThis) {
        Object.defineProperty(window, 'CSS', {
          configurable: true,
          value: { escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&') },
        })
      },
    })
    const { document } = dom.window

    expect(document.querySelectorAll('.case-card')).toHaveLength(18)
    expect(document.querySelector('#progress-label')?.textContent).toContain('0/137')

    const firstRadio = document.querySelector<HTMLInputElement>('.case-card input[type="radio"][value="setuju"]')
    expect(firstRadio).not.toBeNull()
    firstRadio!.click()
    expect(document.querySelector('#progress-label')?.textContent).toContain('1/137')
    const stored = [...Array(dom.window.localStorage.length)].map((_, index) => dom.window.localStorage.key(index))
    expect(stored.some((key) => key?.startsWith('primera.m13-137.review.'))).toBe(true)

    const search = document.querySelector<HTMLInputElement>('#search')!
    search.value = 'Pneumonia Komunitas Dewasa'
    search.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
    expect(document.querySelectorAll('.case-card')).toHaveLength(1)
    expect(document.querySelector('.case-card h2')?.textContent).toContain('Pneumonia Komunitas Dewasa')

    const theme = document.querySelector<HTMLButtonElement>('#theme')!
    theme.click()
    theme.click()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(theme.textContent).toContain('gelap')
    dom.window.close()
  })
})
