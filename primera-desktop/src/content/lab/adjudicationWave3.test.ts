import { describe, expect, it } from 'vitest'
import { PACK } from '..'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'

const IDS = ['lab_efusi_pleura', 'lab_pertusis_remaja'] as const
const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  return DATA.cases.find((item) => item.id === id)!
}

describe('M13-137 adjudication wave 3: respirasi dan surveilans', () => {
  it('mempertahankan kedua kasus sebagai prototipe, tetapi memberi provenance EBM langsung', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
      expect(record(id).compiler.suggestion, id).toBe('cocok')
    }
    expect(DATA.summary.ebmDirect).toBeGreaterThanOrEqual(6)
    expect(DATA.summary.bySuggestion['tak-ada-sumber']).toBe(0)
  })

  it('efusi pleura tetap diagnosis sindromik dan melarang pungsi buta di FKTP', () => {
    const kasus = PACK.kasus.lab_efusi_pleura!
    expect(kasus.tatalaksana.prosedur).toEqual(['oksigen'])
    expect(kasus.stabilisasiWajib).toEqual(['oksigen'])
    expect(kasus.clue).toMatch(/suspek efusi.*belum menentukan etiologi/is)
    expect(kasus.clue).toMatch(/jangan memberi OAT, antibiotik, atau diuretik/i)
    expect(kasus.panduanResmi).toMatch(/BTS.*2023.*Quality Standard 2026/is)
    expect(kasus.panduanResmi).toMatch(/operator kompeten.*ultrasonografi toraks/is)
    expect(kasus.catatanRealita).toMatch(/tidak diasumsikan memiliki rontgen.*tanpa prosedur buta/is)
  })

  it('pertusis membedakan suspek, konfirmasi, terapi indeks, dan PEP kontak', () => {
    const kasus = PACK.kasus.lab_pertusis_remaja!
    expect(kasus.ambangKluster).toBe(2)
    expect(kasus.lab).toEqual([])
    expect(kasus.tatalaksana.obatBenar).toEqual(['azitromisin_500'])
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['cegah_pertusis'])
    expect(kasus.clue).toMatch(/suspek klinis.*belum.*konfirmasi laboratorium/is)
    expect(kasus.clue).toMatch(/tiga minggu.*swab nasofaring.*tanpa menunda terapi/is)
    expect(kasus.panduanResmi).toMatch(/lima hari antibiotik efektif/is)
    expect(kasus.panduanResmi).toMatch(/PEP.*bukan disalin massal/is)
    expect(PACK.edukasi.cegah_pertusis?.nama).toMatch(/5 hari terapi/i)
  })
})
