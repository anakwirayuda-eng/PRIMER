import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { EBM_GUIDELINE_CROSSWALK, EBM_GUIDELINE_SOURCES } from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const IDS = [
  'lab_mabuk_perjalanan',
  'lab_defisiensi_mineral_zinc',
  'lab_defisiensi_vitamin_b_kompleks',
  'lab_retensio_urin_akut',
  'lab_vaginosis_bakterialis',
  'lab_abses_folikel_rambut',
  'lab_folikulitis_superfisialis',
  'lab_furunkel_fluktuatif',
  'lab_ektima_tungkai',
  'lab_hemoroid_interna_derajat4',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 19: sumber spesifik dan graceful degradation FKTP', () => {
  it('memberi pedoman diagnosis-spesifik tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(EBM_GUIDELINE_CROSSWALK[id]?.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(66)
    expect(DATA.summary.bySuggestion['tak-ada-sumber']).toBe(0)
  })

  it('mengunci sumber terkini yang benar-benar dipakai', () => {
    expect(EBM_GUIDELINE_SOURCES['cdc-motion-sickness-2026']?.year).toBe(2026)
    expect(EBM_GUIDELINE_SOURCES['nih-zinc-2026']?.year).toBe(2026)
    expect(EBM_GUIDELINE_SOURCES['nih-riboflavin-2022']?.year).toBe(2022)
    expect(EBM_GUIDELINE_SOURCES['nice-acute-retention-cg97']?.officialUrl).toMatch(/nice\.org\.uk/)
    expect(EBM_GUIDELINE_SOURCES['idsa-ssti-2014']?.officialUrl).toMatch(/idsociety\.org/)
    expect(EBM_GUIDELINE_SOURCES['cdc-bv-2021']?.officialUrl).toMatch(/cdc\.gov/)
    expect(EBM_GUIDELINE_SOURCES['aga-hemorrhoids-2026']?.year).toBe(2026)
  })

  it('menurunkan kepastian diagnosis mikronutrien dan menghindari suplemen zinc empiris', () => {
    const riboflavin = PACK.kasus.lab_defisiensi_vitamin_b_kompleks!
    expect(riboflavin).toMatchObject({
      nama: expect.stringMatching(/Dugaan Defisiensi Riboflavin/i),
      icd10: 'E50-E56',
    })
    expect(riboflavin.clue).toMatch(/tidak membuktikannya.*sering berkelompok/is)
    expect(riboflavin.catatanRealita).toMatch(/label diagnosis tetap dugaan/i)

    const zinc = PACK.kasus.lab_defisiensi_mineral_zinc!
    expect(zinc).toMatchObject({ nama: 'Dugaan Defisiensi Zinc', icd10: 'E58-E61' })
    expect(zinc.tatalaksana.obatBenar).toEqual([])
    expect(zinc.clue).toMatch(/hanya meningkatkan probabilitas/i)
    expect(zinc.panduanResmi).toMatch(/NIH ODS 2026.*tidak selalu/is)
  })

  it('membuat retensi akut dapat ditangani tanpa USG atau kreatinin lokal', () => {
    const kasus = PACK.kasus.lab_retensio_urin_akut!
    expect(kasus.lab.map((item) => item.id)).toEqual(['urinalisis'])
    expect(kasus.stabilisasiWajib).toEqual(['pemasangan_kateter_urin'])
    expect(kasus.clue).toMatch(/satu upaya kateterisasi lembut.*berhenti dan transfer/is)
    expect(kasus.catatanRealita).toMatch(/alat\/operator tidak ready.*tanpa manipulasi berulang/is)
    expect(kasus.panduanResmi).toMatch(/PPK 1186\/2022 tidak mempunyai.*NICE CG97/is)
    expect(record('lab_retensio_urin_akut').evidence.aspak).toMatchObject({
      status: 'cocok',
      unresolvedResourceIds: [],
    })
  })

  it('membatasi klaim PPK kulit dan mempertahankan source control yang tepat', () => {
    expect(PACK.kasus.lab_abses_folikel_rambut?.tatalaksana.prosedur).toEqual(['insisi_abses'])
    expect(PACK.kasus.lab_furunkel_fluktuatif?.tatalaksana.prosedur).toEqual(['insisi_abses'])
    expect(PACK.kasus.lab_ektima_tungkai?.tatalaksana.obatBenar).toEqual(['cefadroxil_sirup_125'])
    for (const id of ['lab_abses_folikel_rambut', 'lab_folikulitis_superfisialis', 'lab_furunkel_fluktuatif', 'lab_ektima_tungkai'] as const) {
      expect(PACK.kasus[id]?.panduanResmi, id).toMatch(/floor terkait|hanya floor terkait/i)
      expect(record(id).compiler.suggestion, id).toBe('cocok')
    }
  })

  it('menggrounding BV dan hemoroid tanpa alat diagnostik berlebihan', () => {
    const bv = PACK.kasus.lab_vaginosis_bakterialis!
    expect(bv.tatalaksana.obatBenar).toEqual(['metronidazol_500'])
    expect(bv.panduanResmi).toMatch(/floor terkait.*CDC/is)
    expect(record('lab_vaginosis_bakterialis').evidence.aspak.unresolvedResourceIds).toEqual([])

    const hemorrhoid = PACK.kasus.lab_hemoroid_interna_derajat4!
    expect(hemorrhoid.lab.map((item) => item.id)).toEqual(['darah_rutin'])
    expect(hemorrhoid.panduanResmi).toMatch(/floor terkait.*AGA.*2026/is)
    expect(hemorrhoid.clue).toMatch(/pria dewasa.*tidak boleh otomatis/is)
    expect(record('lab_hemoroid_interna_derajat4').evidence.aspak.unresolvedResourceIds).toEqual([])
  })
})
