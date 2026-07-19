import { describe, expect, it } from 'vitest'
import { PACK } from '..'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'

const IDS = [
  'lab_gizi_buruk_komplikasi',
  'lab_bronkiolitis_berat',
  'lab_meningitis_bakterial_suspek',
  'lab_benda_asing_esofagus',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  return DATA.cases.find((item) => item.id === id)!
}

describe('M13-137 adjudication wave 2: kegawatan anak', () => {
  it('mempertahankan empat kasus sebagai prototipe yang belum diadjudikasi dokter', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
  })

  it('bronkiolitis memakai threshold bayi dan pedoman diagnosis-spesifik yang dapat dilacak', () => {
    const kasus = PACK.kasus.lab_bronkiolitis_berat!
    expect(kasus.vital.spo2).toBe(89)
    expect(kasus.stabilisasiWajib).toEqual(['oksigen'])
    expect(kasus.clue).not.toMatch(/WHO 2026/i)
    expect(kasus.panduanResmi).toMatch(/NICE NG9.*di bawah 90%/i)
    expect(record('lab_bronkiolitis_berat').compiler.suggestion).toBe('cocok')
  })

  it('meningitis memisahkan antibiotik kritis, antipiretik opsional, dan edukasi kontak yang benar', () => {
    const kasus = PACK.kasus.lab_meningitis_bakterial_suspek!
    expect(kasus.tatalaksana.obatBenar).toEqual(['ceftriaxone_1g_inj'])
    expect(kasus.tatalaksana.obatOpsional).toContain('paracetamol_500')
    expect(kasus.tatalaksana.edukasi).toContain('profilaksis_kontak_meningokokus')
    expect(kasus.tatalaksana.edukasi).not.toContain('obati_kontak_serumah')
    expect(kasus.stabilisasiWajib).toEqual([])
    expect(kasus.clue).toMatch(/tiga jam.*2 g IV.*IM/is)
    expect(PACK.edukasi.profilaksis_kontak_meningokokus?.nama).toMatch(/kontak erat/i)
  })

  it('baterai kancing tidak menyuruh madu pada anak yang gagal menelan', () => {
    const kasus = PACK.kasus.lab_benda_asing_esofagus!
    expect(kasus.tatalaksana.edukasi).toContain('cegah_baterai_kancing')
    expect(kasus.tatalaksana.edukasi).not.toContain('cegah_benda_asing_hidung')
    expect(kasus.clue).toMatch(/tidak mampu menelan.*JANGAN paksa madu/is)
    expect(kasus.panduanResmi).toMatch(/dua jam/i)
    expect(PACK.edukasi.cegah_baterai_kancing?.nama).toMatch(/baterai kancing/i)
  })

  it('gizi buruk memakai koreksi hipoglikemia anak dan protokol antibiotik, bukan rule-of-15/seftriakson universal', () => {
    const kasus = PACK.kasus.lab_gizi_buruk_komplikasi!
    expect(kasus.tatalaksana.obatBenar).not.toContain('ceftriaxone_1g_inj')
    expect(kasus.tatalaksana.prosedur).toEqual([
      'koreksi_hipoglikemia_gizi_buruk_anak',
      'antibiotik_parenteral_gizi_buruk_protokol',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.stabilisasiWajib).toEqual(kasus.tatalaksana.prosedur)
    expect(kasus.clue).toMatch(/5 mL\/kg.*bukan tombol rule-of-15 dewasa/is)
    expect(PACK.tindakan.koreksi_hipoglikemia_gizi_buruk_anak?.nama).toMatch(/5 mL\/kg/i)
    expect(PACK.tindakan.antibiotik_parenteral_gizi_buruk_protokol).toBeDefined()
  })
})
