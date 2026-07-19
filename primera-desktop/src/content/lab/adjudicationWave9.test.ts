import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_abses_peritonsil',
  'lab_mastoiditis_akut',
  'lab_otitis_media_supuratif_kronik_komplikata',
  'lab_furunkel_hidung',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 9: infeksi THT dan source control', () => {
  it('memberi provenance EBM langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(66)
  })

  it('menjaga status floor PPK tetap jujur', () => {
    expect(record('lab_abses_peritonsil').evidence.ppk.relation).toBe('related')
    expect(record('lab_mastoiditis_akut').evidence.ppk.relation).toBe('related')
    expect(record('lab_otitis_media_supuratif_kronik_komplikata').evidence.ppk.relation).toBe('direct')
    expect(record('lab_furunkel_hidung').evidence.ppk.relation).toBe('direct')
  })

  it('OMSK perforasi tidak lagi mewajibkan asam asetat atau tetes improvisasi', () => {
    const kasus = PACK.kasus.lab_otitis_media_supuratif_kronik_komplikata!
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.prosedur).toEqual(['pembersihan_telinga_kering_pra_rujuk'])
    expect(PACK.tindakan.pembersihan_telinga_kering_pra_rujuk?.nama).toMatch(/kering tanpa irigasi/i)
    expect(kasus.clue).toMatch(/tidak membuktikan erosi tulang/i)
    expect(kasus.panduanResmi).toMatch(/DailyMed 2025.*perforasi sebagai kontraindikasi/is)
    expect(kasus.catatanRealita).toMatch(/tidak mengimprovisasi pengganti/i)
    expect(`${kasus.clue} ${kasus.panduanResmi}`).not.toMatch(/asam asetat.*aman.*berlubang/is)
  })

  it('mastoiditis anak memakai protokol berbasis berat dan source control selektif', () => {
    const kasus = PACK.kasus.lab_mastoiditis_akut!
    expect(kasus.demografi).toEqual({ usiaMin: 3, usiaMax: 5 })
    expect(kasus.tatalaksana.obatBenar).toEqual(['paracetamol_sirup'])
    expect(kasus.tatalaksana.prosedur).toEqual([
      'pasang_infus',
      'antibiotik_parenteral_mastoiditis_anak_protokol',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['antibiotik_parenteral_mastoiditis_anak_protokol'])
    expect(kasus.stabilisasiWajib).toEqual([
      'antibiotik_parenteral_mastoiditis_anak_protokol',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.clue).toMatch(/tidak membuktikan keluarga menyebabkan komplikasi/i)
    expect(kasus.clue).toMatch(/tidak semua anak otomatis memerlukan mastoidektomi/i)
    expect(kasus.catatanRealita).toMatch(/bukan satu vial seftriakson 1 g universal/i)
  })

  it('abses peritonsil mempertahankan rujuk dan drainase terkontrol', () => {
    const kasus = PACK.kasus.lab_abses_peritonsil!
    expect(kasus.harusDirujuk).toBe(true)
    expect(kasus.tatalaksana.prosedur).toEqual(['pemantauan_ketat_vital'])
    expect(kasus.clue).toMatch(/source control/i)
    expect(kasus.clue).toMatch(/bukan aspirasi buta di FKTP/i)
    expect(kasus.panduanResmi).toMatch(/NICE NG84.*dirujuk ke rumah sakit/is)
    expect(kasus.catatanRealita).toMatch(/jangan memaksa obat oral/i)
  })

  it('furunkel hidung membedakan lesi lokal dari penyebaran berbahaya', () => {
    const kasus = PACK.kasus.lab_furunkel_hidung!
    expect(kasus.harusDirujuk).toBe(false)
    expect(kasus.tatalaksana.prosedur).toEqual(['kompres_hangat_furunkel_hidung'])
    expect(kasus.clue).toMatch(/lesi kecil, lokal, belum fluktuatif/i)
    expect(kasus.clue).toMatch(/antibiotik sistemik.*dipertimbangkan/is)
    expect(kasus.mutiaraEbm).toMatch(/tidak berarti setiap pustul.*pasti menyebar/is)
    expect(kasus.catatanRealita).toMatch(/restriksi diagnosis MRSA/i)
  })
})
