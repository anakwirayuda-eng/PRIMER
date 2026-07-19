import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_anafilaksis_makanan',
  'lab_perdarahan_gi_atas',
  'lab_pneumotoraks_spontan',
  'lab_tetanus_generalisata_awal',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 6: stabilisasi time-critical', () => {
  it('mempertahankan status prototipe dan memberi provenance EBM langsung', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(66)
  })

  it('anafilaksis mengunci epinefrin IM dewasa, pengulangan, monitoring, dan batas IV', () => {
    const kasus = PACK.kasus.lab_anafilaksis_makanan!
    expect(kasus.tatalaksana.prosedur).toContain('pemantauan_ketat_vital')
    expect(kasus.stabilisasiWajib).toEqual([
      'adrenalin_im_anafilaksis',
      'oksigen',
      'akses_iv_resusitasi',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.clue).toMatch(/0,5 mg IM.*ulang.*5 menit.*jangan biarkan berdiri/is)
    expect(kasus.panduanResmi).toMatch(/RCUK.*adrenalin intravena hanya untuk spesialis/is)
    expect(kasus.catatanRealita).toMatch(/bukan memberi bolus adrenalin IV atau aminofilin rutin/i)
  })

  it('perdarahan GI menguji sirkulasi, monitoring, puasa, dan transfer tanpa lavage rutin', () => {
    const kasus = PACK.kasus.lab_perdarahan_gi_atas!
    expect(kasus.tatalaksana.prosedur).toEqual([
      'akses_iv_resusitasi',
      'oksigen',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['akses_iv_resusitasi'])
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['puasa_sambil_rujuk'])
    expect(kasus.clue).toMatch(/SpO2 92%.*puasakan.*transfer/is)
    expect(kasus.panduanResmi).toMatch(/NICE CG141.*ACG 2021.*bilas lambung/is)
    expect(kasus.catatanRealita).toMatch(/bila pemeriksaan tidak ready, jangan menunggu/i)
  })

  it('pneumotoraks menolak rawat konservatif saat ada gangguan fisiologis', () => {
    const kasus = PACK.kasus.lab_pneumotoraks_spontan!
    expect(kasus.tatalaksana.prosedur).toEqual(['oksigen', 'pemantauan_ketat_vital'])
    expect(kasus.stabilisasiWajib).toEqual(['oksigen'])
    expect(kasus.clue).toMatch(/gangguan fisiologis.*bukan kandidat observasi konservatif/is)
    expect(kasus.clue).toMatch(/oksigen karena hipoksemia/is)
    expect(kasus.panduanResmi).toMatch(/BTS.*ERS\/EACTS\/ESTS 2024/is)
    expect(kasus.catatanRealita).toMatch(/dugaan tensi.*jangan menunggu pencitraan/is)
  })

  it('tetanus memakai diagnosis klinis, minim stimulus, monitoring, dan transfer', () => {
    const kasus = PACK.kasus.lab_tetanus_generalisata_awal!
    expect(kasus.tatalaksana.prosedur).toEqual([
      'minim_stimulus_tetanus',
      'perawatan_luka',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.stabilisasiWajib).toEqual(['minim_stimulus_tetanus', 'pemantauan_ketat_vital'])
    expect(kasus.clue).toMatch(/diagnosis klinis.*jangan menunggu tes laboratorium/is)
    expect(kasus.panduanResmi).toMatch(/CDC Clinical Care of Tetanus 2025.*rawat inap/is)
    expect(kasus.catatanRealita).toMatch(/tidak boleh menunda transfer/i)
  })
})
