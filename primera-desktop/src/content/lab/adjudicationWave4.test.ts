import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_kehamilan_ektopik_terganggu_suspek',
  'lab_plasenta_previa',
  'lab_mola_hidatidosa',
  'lab_hiperemesis_gravidarum_berat',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 4: kegawatan obstetri', () => {
  it('mempertahankan status prototipe dan mengganti atribusi PNPK palsu dengan pedoman langsung', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.pnpk.status, id).toBe('tak-ada-sumber')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBeGreaterThanOrEqual(10)
  })

  it('KET menilai syok tanpa tiga tindakan cairan duplikat atau oksigen rutin', () => {
    const kasus = PACK.kasus.lab_kehamilan_ektopik_terganggu_suspek!
    expect(kasus.vital.spo2).toBe(98)
    expect(kasus.tatalaksana.prosedur).toEqual(['akses_iv_resusitasi', 'pemantauan_ketat_vital'])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['akses_iv_resusitasi'])
    expect(kasus.stabilisasiWajib).toEqual(['akses_iv_resusitasi'])
    expect(kasus.tatalaksana.prosedur).not.toContain('oksigen')
    expect(kasus.clue).toMatch(/jangan menunggu USG atau beta-hCG serial/i)
    expect(kasus.clue).toMatch(/SpO2 98%.*bukan.*wajib/i)
    expect(kasus.pemeriksaanFisik.some((item) => item.temuan.includes('tidak diulang'))).toBe(true)
  })

  it('plasenta previa membedakan toucher digital dari pemeriksaan spekulum', () => {
    const kasus = PACK.kasus.lab_plasenta_previa!
    expect(kasus.clue).toMatch(/vaginal toucher digital/i)
    expect(kasus.clue).toMatch(/spekulum berbeda/i)
    expect(kasus.panduanResmi).toMatch(/bukan larangan universal terhadap spekulum/i)
    expect(kasus.panduanResmi).toMatch(/tidak memiliki bab diagnosis-spesifik plasenta previa/i)
    const traneksamat = (kasus.tatalaksana.obatSalahUmum ?? [])
      .find((item) => item.id === 'asam_traneksamat_500_inj')
    expect(traneksamat?.alasan).toMatch(/perdarahan pascapersalinan.*bukan terapi rutin lini pertama/is)
  })

  it('mola tidak mengubah test-pack dan TSH tunggal menjadi pemeriksaan kuantitatif', () => {
    const kasus = PACK.kasus.lab_mola_hidatidosa!
    const tesKehamilan = kasus.lab.find((item) => item.id === 'tes_kehamilan')!
    const tsh = kasus.lab.find((item) => item.id === 'tsh')!
    expect(tesKehamilan.hasil).toMatch(/kualitatif/i)
    expect(tesKehamilan.hasil).not.toMatch(/1:100|sangat kuat/i)
    expect(tsh.relevan).toBe(false)
    expect(tsh.hasil).toMatch(/tidak cukup.*tirotoksikosis/i)
    expect(kasus.clue).toMatch(/mola parsial.*1 bulan.*mola komplet.*6 bulan/is)
    expect(kasus.panduanResmi).toMatch(/FIGO Cancer Report 2025/i)
  })

  it('hiperemesis memakai definisi klinis, rute parenteral, dan tiamin tanpa menjadikan keton sebagai derajat', () => {
    const kasus = PACK.kasus.lab_hiperemesis_gravidarum_berat!
    expect(kasus.nama).not.toMatch(/ketosis/i)
    expect(kasus.lab.filter((item) => item.id === 'keton_urin')).toHaveLength(0)
    expect(kasus.lab.find((item) => item.id === 'urinalisis')?.hasil).toMatch(/bukan derajat dehidrasi/i)
    expect(kasus.tatalaksana.obatAlternatif).toEqual([['nacl_09_inf', 'ringer_laktat_inf']])
    expect(kasus.tatalaksana.obatOpsional ?? []).not.toContain('vitamin_b_kompleks')
    expect(kasus.tatalaksana.prosedur).toEqual([
      'pasang_infus',
      'antiemetik_parenteral_hiperemesis',
      'tiamin_hiperemesis',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.tatalaksana.edukasiKritis).toContain('rencana_hiperemesis')
    expect(kasus.clue).toMatch(/ketonuria bukan syarat diagnosis/i)
    expect(kasus.clue).toMatch(/tiamin.*sebelum dekstrosa/i)
    expect(PACK.tindakan.antiemetik_parenteral_hiperemesis?.nama).toMatch(/parenteral/i)
    expect(PACK.tindakan.tiamin_hiperemesis?.nama).toMatch(/tiamin/i)
    expect(PACK.edukasi.rencana_hiperemesis?.nama).toMatch(/minum sedikit-sering/i)
  })
})
