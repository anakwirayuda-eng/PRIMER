import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_hernia_inguinalis_inkarserata',
  'lab_ileus_obstruktif',
  'lab_apendisitis_akut_anak',
  'lab_peritonitis_generalisata',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 7: abdomen akut bedah', () => {
  it('memberi provenance EBM langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(67)
  })

  it('membedakan floor PPK langsung dari sumber yang hanya terkait atau absen', () => {
    expect(record('lab_hernia_inguinalis_inkarserata').evidence.ppk.status).toBe('tak-ada-sumber')
    expect(record('lab_ileus_obstruktif').evidence.ppk.relation).toBe('related')
    expect(record('lab_apendisitis_akut_anak').evidence.ppk.relation).toBe('direct')
    expect(record('lab_peritonitis_generalisata').evidence.ppk.relation).toBe('direct')
  })

  it('hernia strangulata tidak menunggu Tier-D atau menerima analgesik oral saat muntah', () => {
    const kasus = PACK.kasus.lab_hernia_inguinalis_inkarserata!
    expect(kasus.lab).toEqual([])
    expect(kasus.tatalaksana.obatAlternatif).toEqual([['nacl_09_inf', 'ringer_laktat_inf']])
    expect(kasus.tatalaksana.prosedur).toEqual(['pasang_infus', 'dekompresi_ngt', 'pemantauan_ketat_vital'])
    expect(kasus.stabilisasiWajib).toEqual(['pasang_infus', 'dekompresi_ngt', 'pemantauan_ketat_vital'])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['pasang_infus'])
    expect(kasus.panduanResmi).toMatch(/PPK 1186\/2022 tidak mempunyai bab.*WSES 2017/is)
  })

  it('obstruksi adhesif adalah jalur observasi bedah, bukan resep pulang', () => {
    const kasus = PACK.kasus.lab_ileus_obstruktif!
    expect(kasus.nama).toBe('Obstruksi Usus Mekanik (Suspek Adhesi)')
    expect(kasus.lab.some((item) => item.id === 'elektrolit_serum')).toBe(false)
    expect(kasus.tatalaksana.prosedur).toContain('pemantauan_ketat_vital')
    expect(kasus.tatalaksana.terapiKritis).toEqual(['akses_iv_resusitasi'])
    expect(kasus.mutiaraEbm).toMatch(/jalur rawat dan observasi serial.*bukan resep pulang/is)
    expect(kasus.konsekuensi?.kondisiKembali).toMatch(/peritonitis/i)
  })

  it('apendisitis anak memakai dosis berbasis berat dan tidak menganggap semua NSAID kontraindikasi', () => {
    const kasus = PACK.kasus.lab_apendisitis_akut_anak!
    const ibuprofen = kasus.tatalaksana.obatSalahUmum?.find((item) => item.id === 'ibuprofen_400')
    expect(kasus.anamnesis.some((item) => item.id === 'q_berat_badan' && item.esensial)).toBe(true)
    expect(kasus.tatalaksana.obatBenar).toEqual(['paracetamol_sirup'])
    expect(kasus.tatalaksana.obatAlternatif ?? []).toEqual([])
    expect(ibuprofen?.bahaya).toBe('nonPrimer')
    expect(kasus.lab.some((item) => item.id === 'usg_abdomen')).toBe(false)
    expect(kasus.clue).toMatch(/berat badan aktual.*10-15 mg\/kg/is)
    expect(kasus.panduanResmi).toMatch(/WSES Jerusalem 2025.*terbit 2026/is)
  })

  it('peritonitis mengunci cakupan anaerob dan tidak lagi bergantung radiografi', () => {
    const kasus = PACK.kasus.lab_peritonitis_generalisata!
    const ppi = kasus.tatalaksana.obatSalahUmum?.find((item) => item.id === 'omeprazole_20')
    expect(kasus.lab.some((item) => item.id === 'foto_polos_abdomen')).toBe(false)
    expect(kasus.tatalaksana.terapiKritis).toEqual([
      'resusitasi_cairan_kristaloid',
      'ceftriaxone_1g_inj',
      'metronidazol_inj_500',
    ])
    expect(kasus.stabilisasiWajib).toContain('pemantauan_ketat_vital')
    expect(ppi?.alasan).not.toMatch(/tidak akan terserap/i)
    expect(kasus.catatanRealita?.trim()).not.toMatch(/;$/)
    expect(kasus.clue).toMatch(/Gram-negatif dan anaerob.*kendali sumber/is)
  })
})
