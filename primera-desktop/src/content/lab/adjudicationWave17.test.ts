import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  EBM_GUIDELINE_SOURCES,
  EXTERNAL_PNPK_SOURCES,
  PNPK_CROSSWALK,
  PPK_CROSSWALK,
} from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const IDS = [
  'lab_dm_tipe1_stabil_prb',
  'lab_malnutrisi_energi_protein_sedang',
  'lab_anemia_defisiensi_besi_nonhamil',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 17: continuity DM-PRB, gizi Posyandu, dan anemia', () => {
  it('memberi provenance langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(EBM_GUIDELINE_CROSSWALK[id]?.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(67)
  })

  it('membuat DM tipe 1 benar-benar melewati review spesialis lalu PRB', () => {
    const kasus = PACK.kasus.lab_dm_tipe1_stabil_prb!
    expect(kasus).toMatchObject({
      harusDirujuk: true,
      spesialisRujukan: 'anak',
      bisaPrb: true,
    })
    expect(kasus.lab.map((item) => item.id)).toEqual(['gds', 'urinalisis'])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['insulin_nph'])
    expect(kasus.tatalaksana.edukasi).toEqual([
      'sick_day_dm1',
      'hipoglikemia_dm1',
      'rencana_prb_dm1',
    ])
    expect(kasus.clue).toMatch(/hipoglikemia level 2.*review regimen.*rujuk balik/is)
    expect(kasus.panduanResmi).toMatch(/PNPK.*2009\/2024.*ADA.*2026.*Fornas 1199\/2025/is)
    expect(kasus.catatanRealita).toMatch(/HbA1c berasal dari resume.*bukan.*Puskesmas/is)
    expect(kasus.konsekuensi).toMatchObject({ kembaliHariMin: 2, kembaliHariMax: 5 })
    expect(PNPK_CROSSWALK.lab_dm_tipe1_stabil_prb).toEqual([
      { slug: 'dm-anak-2024', relation: 'direct' },
    ])
  })

  it('menutup bridge Posyandu-Puskesmas-PMT-pemantauan pada gizi kurang', () => {
    const kasus = PACK.kasus.lab_malnutrisi_energi_protein_sedang!
    expect(kasus.anamnesis).toContainEqual(expect.objectContaining({ id: 'q_program', esensial: true }))
    expect(kasus.tatalaksana.edukasi).toEqual([
      'alur_pmt_lokal_2025',
      'makan_balita_padat_gizi',
      'pantau_tumbuh_mingguan',
    ])
    expect(kasus.tatalaksana.edukasiKritis).toEqual([
      'alur_pmt_lokal_2025',
      'pantau_tumbuh_mingguan',
    ])
    expect(kasus.clue).toMatch(/56 hari.*tidak menggantikan makanan utama.*mingguan/is)
    expect(kasus.clue).toMatch(/14 hari.*evaluasi ulang/is)
    expect(kasus.panduanResmi).toMatch(/576\/2025.*menggantikan.*1622\/2023.*dicabut/is)
    expect(kasus.catatanRealita).toMatch(/UKM ke UKP.*kembali.*kader/is)
    expect(kasus.ambangKluster).toBeUndefined()
  })

  it('mengunci pasien anemia sebagai perempuan dan menutup terapi-sumber-kontrol Hb', () => {
    const kasus = PACK.kasus.lab_anemia_defisiensi_besi_nonhamil!
    expect(kasus.demografi.jenisKelamin).toBe('P')
    expect(kasus.demografi).toMatchObject({ usiaMin: 18, usiaMax: 45 })
    expect(kasus.lab.map((item) => item.id)).toEqual(['darah_rutin'])
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_haid', esensial: true }),
      expect.objectContaining({ id: 'q_bekuan', esensial: true }),
    ]))
    expect(kasus.tatalaksana.edukasi).toEqual([
      'terapi_besi_terukur',
      'telusuri_sumber_anemia',
      'kontrol_hb_anemia',
    ])
    expect(kasus.clue).toMatch(/60 mg.*sekali sehari.*selang sehari/is)
    expect(kasus.clue).toMatch(/Hb dalam 2-4 minggu.*tiga bulan setelah Hb normal/is)
    expect(kasus.panduanResmi).toMatch(/PPK.*3 x 200 mg.*AGA.*2024.*BSG.*2021/is)
    expect(kasus.catatanRealita).toMatch(/Ferritin tidak dijadikan tombol wajib/is)
    expect(kasus.konsekuensi).toMatchObject({ kembaliHariMin: 14, kembaliHariMax: 28 })
    expect(PPK_CROSSWALK.lab_anemia_defisiensi_besi_nonhamil?.relation).toBe('direct')
  })

  it('mengunci sumber aktif dan populasi pediatrik secara eksplisit', () => {
    expect(EXTERNAL_PNPK_SOURCES['dm-anak-2024']).toMatchObject({
      documentNumber: 'HK.01.07/MENKES/2009/2024',
      population: expect.stringMatching(/anak dan remaja/i),
    })
    expect(EBM_GUIDELINE_SOURCES['ada-diabetes-2026-type1']?.year).toBe(2026)
    expect(EBM_GUIDELINE_SOURCES['kemenkes-pmt-lokal-2025']?.year).toBe(2025)
    expect(EBM_GUIDELINE_SOURCES['aga-ida-2024']?.year).toBe(2024)
    expect(EBM_GUIDELINE_SOURCES['bsg-ida-2021']?.year).toBe(2021)
    expect(EBM_GUIDELINE_SOURCES['nice-hmb-ng88']?.year).toBe(2025)
  })
})
