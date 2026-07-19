import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_infeksi_umbilikus_neonatus',
  'lab_penyakit_radang_panggul_berat',
  'lab_kaki_diabetik_infeksi',
  'lab_abses_perianal',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 8: infeksi dan source control', () => {
  it('memberi provenance EBM langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(66)
  })

  it('membedakan floor PPK langsung, terkait, dan absen', () => {
    expect(record('lab_infeksi_umbilikus_neonatus').evidence.ppk.relation).toBe('direct')
    expect(record('lab_penyakit_radang_panggul_berat').evidence.ppk.status).toBe('tak-ada-sumber')
    expect(record('lab_kaki_diabetik_infeksi').evidence.ppk.relation).toBe('related')
    expect(record('lab_abses_perianal').evidence.ppk.status).toBe('tak-ada-sumber')
  })

  it('omfalitis mengunci antibiotik, pemantauan, dan jalur hospital-first', () => {
    const kasus = PACK.kasus.lab_infeksi_umbilikus_neonatus!
    expect(kasus.tatalaksana.prosedur).toEqual([
      'akses_iv_resusitasi',
      'antibiotik_parenteral_neonatus_protokol',
      'perawatan_tali_pusat',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.stabilisasiWajib).toEqual([
      'akses_iv_resusitasi',
      'antibiotik_parenteral_neonatus_protokol',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.panduanResmi).toMatch(/WHO.*0-59 Days 2024.*rumah sakit.*jalur utama/is)
    expect(kasus.clue).toMatch(/bolus cairan otomatis/i)
  })

  it('PID berat memakai regimen rawat inap dan tidak bergantung pada USG FKTP', () => {
    const kasus = PACK.kasus.lab_penyakit_radang_panggul_berat!
    expect(kasus.lab.some((item) => item.id === 'usg_abdomen')).toBe(false)
    expect(kasus.tatalaksana.obatBenar).toEqual(['ceftriaxone_1g_inj', 'doksisiklin_100', 'metronidazol_500'])
    expect(kasus.tatalaksana.prosedur).toEqual(['pasang_infus', 'pemantauan_ketat_vital'])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['ceftriaxone_1g_inj'])
    expect(kasus.clue).toMatch(/seftriakson 1 g IV.*doksisiklin.*metronidazol/is)
    expect(kasus.clue).toMatch(/IUD tidak otomatis dilepas/i)
    expect(kasus.clue).not.toMatch(/seftriakson 500 mg intramuskular dosis tunggal/i)
  })

  it('kaki diabetik memisahkan proteksi luka dari debridemen dan regimen universal', () => {
    const kasus = PACK.kasus.lab_kaki_diabetik_infeksi!
    const metformin = kasus.tatalaksana.obatSalahUmum?.find((item) => item.id === 'metformin_500')
    const insisi = kasus.tatalaksana.tindakanSalahUmum?.find((item) => item.id === 'insisi_abses')
    expect(kasus.lab.some((item) => item.id === 'hba1c')).toBe(false)
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.obatAlternatif ?? []).toEqual([])
    expect(kasus.tatalaksana.prosedur).toEqual([
      'pasang_infus',
      'antibiotik_parenteral_kaki_diabetik_protokol',
      'balut_luka_kaki_diabetik_pra_rujuk',
      'pemantauan_ketat_vital',
    ])
    expect(PACK.tindakan.antibiotik_parenteral_kaki_diabetik_protokol?.nama).toMatch(/protokol jejaring/i)
    expect(PACK.tindakan.balut_luka_kaki_diabetik_pra_rujuk?.nama).toMatch(/tanpa debridemen tajam/i)
    expect(metformin?.alasan).toMatch(/jangan mengarang kontraindikasi hipoperfusi/i)
    expect(insisi?.alasan).toMatch(/bedah DAN vaskular segera/i)
    expect(kasus.panduanResmi).toMatch(/IWGDF\/IDSA 2023.*bedah dan vaskular/is)
  })

  it('abses perianal mengajarkan drainase selektif tanpa kamar-operasi universal', () => {
    const kasus = PACK.kasus.lab_abses_perianal!
    const insisi = kasus.tatalaksana.tindakanSalahUmum?.find((item) => item.id === 'insisi_abses')
    expect(kasus.lab.some((item) => item.id === 'hba1c')).toBe(false)
    expect(kasus.tatalaksana.obatBenar).toEqual(['paracetamol_500', 'amoxiclav_625'])
    expect(kasus.tatalaksana.obatAlternatif ?? []).toEqual([])
    expect(kasus.tatalaksana.obatOpsional ?? []).toEqual(['tramadol_50'])
    expect(kasus.tatalaksana.prosedur).toEqual(['pemantauan_ketat_vital'])
    expect(insisi?.alasan).toMatch(/fistulotomi bersamaan hanya.*fistula sederhana/is)
    expect(insisi?.alasan).not.toMatch(/semua pasien|harus dicari dan ditangani sekaligus/i)
    expect(kasus.panduanResmi).toMatch(/tidak mempunyai bab langsung.*ASCRS.*2022/is)
    expect(kasus.catatanRealita?.trim()).not.toMatch(/[—;]$/)
  })
})
