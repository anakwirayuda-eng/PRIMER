import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { EBM_GUIDELINE_CROSSWALK, EBM_GUIDELINE_SOURCES } from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const IDS = [
  'lab_hepatitis_a_akut',
  'lab_leptospirosis_tanpa_komplikasi',
  'lab_filariasis_terkonfirmasi',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 15: klaster pangan, banjir, dan program filariasis', () => {
  it('memberi provenance langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(EBM_GUIDELINE_CROSSWALK[id]?.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(67)
  })

  it('mengubah hepatitis A menjadi episode klinik-klaster pangan yang tertutup', () => {
    const kasus = PACK.kasus.lab_hepatitis_a_akut!
    expect(kasus.konfirmasiWajib).toBe('anti_hav_igm')
    expect(kasus.lab.map((item) => item.id)).toEqual(['sgot_sgpt', 'anti_hav_igm'])
    expect(kasus.tatalaksana.edukasi).toEqual([
      'cegah_hepatitis_a',
      'perawatan_hepatitis_a_rumah',
      'tanda_bahaya_hepatitis_akut',
    ])
    expect(kasus.clue).toMatch(/notifikasi.*line list.*jendela pajanan.*kesehatan lingkungan/is)
    expect(kasus.clue).toMatch(/bukan izin otomatis menutup warung/i)
    expect(kasus.panduanResmi).toMatch(/profilaksis pascapajanan.*bukan resep blanket/is)
    expect(kasus.catatanRealita).toMatch(/jejaring laboratorium.*identitas.*sumber terkonfirmasi/is)
  })

  it('menjaga leptospirosis sebagai diagnosis klinis dini tanpa gerbang laboratorium palsu', () => {
    const kasus = PACK.kasus.lab_leptospirosis_tanpa_komplikasi!
    expect(kasus.nama).toMatch(/suspek.*ringan.*pascabanjir/i)
    expect(kasus.lab).toEqual([])
    expect(kasus.konfirmasiWajib).toBeUndefined()
    expect(kasus.tatalaksana.obatBenar).toEqual(['doksisiklin_100'])
    expect(kasus.tatalaksana.obatOpsional).toEqual(['paracetamol_500'])
    expect(kasus.clue).toMatch(/100 mg.*dua kali.*10 hari/is)
    expect(kasus.clue).toMatch(/CDC 2026.*7 hari.*divergensi/is)
    expect(kasus.catatanRealita).toMatch(/tidak menjadikan.*PCR.*serologi.*wajib/is)
  })

  it('menutup klaster leptospirosis melalui One Health tanpa profilaksis massal', () => {
    const kasus = PACK.kasus.lab_leptospirosis_tanpa_komplikasi!
    expect(kasus.ambangKluster).toBe(2)
    expect(kasus.tatalaksana.edukasi).toEqual([
      'rencana_leptospirosis_jejaring',
      'cegah_leptospirosis',
      'tanda_bahaya_leptospirosis',
    ])
    expect(kasus.panduanResmi).toMatch(/line list.*air-rodensia-hewan.*One Health/is)
    expect(kasus.panduanResmi).toMatch(/melarang pembagian doksisiklin blanket/i)
    expect(kasus.konsekuensi?.kondisiKembali).toMatch(/warga lain.*respons One Health belum berjalan/is)
  })

  it('memisahkan terapi pasien filariasis, MMDP, dan keputusan POPM wilayah', () => {
    const kasus = PACK.kasus.lab_filariasis_terkonfirmasi!
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_koendemis', esensial: true }),
      expect.objectContaining({ id: 'q_hamil', esensial: true }),
    ]))
    expect(kasus.konfirmasiWajib).toBe('apusan_darah_mikrofilaria')
    expect(kasus.tatalaksana.edukasi).toEqual([
      'alur_program_filariasis',
      'perawatan_limfedema_filariasis',
      'cegah_gigitan_filariasis',
    ])
    expect(kasus.clue).toMatch(/satu resep tidak sama dengan POPM\/MDA/i)
    expect(kasus.clue).toMatch(/cuci-keringkan.*latihan.*elevasi.*hidrokel/is)
    expect(kasus.panduanResmi).toMatch(/Permenkes 3\/2026.*mencabut sebagian besar Permenkes 94\/2014/is)
    expect(kasus.catatanRealita).toMatch(/keputusan POPM berada pada program/i)
  })

  it('mengunci sumber mutakhir dan horizon konsekuensi yang tidak deterministik', () => {
    expect(EBM_GUIDELINE_SOURCES['who-hepatitis-a-2026']?.year).toBe(2026)
    expect(EBM_GUIDELINE_SOURCES['cdc-leptospirosis-2026']?.year).toBe(2026)
    expect(EBM_GUIDELINE_SOURCES['kemenkes-disease-control-2026']?.year).toBe(2026)
    expect(PACK.kasus.lab_hepatitis_a_akut?.konsekuensi?.narasi).toMatch(/sebagian besar.*perburukan langka.*klaster/is)
    expect(PACK.kasus.lab_leptospirosis_tanpa_komplikasi?.konsekuensi?.narasi).toMatch(/sebagian.*keterlambatan.*kasus kedua/is)
    expect(PACK.kasus.lab_filariasis_terkonfirmasi?.konsekuensi).toMatchObject({
      kembaliHariMin: 30,
      kembaliHariMax: 90,
    })
    expect(PACK.kasus.lab_filariasis_terkonfirmasi?.konsekuensi?.narasi).toMatch(/bulan-tahun.*bukan pasti/is)
  })
})
