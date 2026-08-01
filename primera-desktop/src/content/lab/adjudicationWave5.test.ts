import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_edema_paru_akut_hipertensif',
  'lab_gagal_jantung_dekompensasi',
  'lab_ppok_eksaserbasi_berat',
  'lab_tia_serangan_iskemik_sesaat',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 5: kegawatan kardiorespirasi dan TIA', () => {
  it('mempertahankan status prototipe sambil memberi provenance EBM langsung', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
      expect(record(id).compiler.suggestion, id).toBe('cocok')
    }
    expect(record('lab_edema_paru_akut_hipertensif').compiler.reasons).toEqual([])
    expect(DATA.summary.ebmDirect).toBeGreaterThanOrEqual(14)
  })

  it('edema paru menilai diuretik IV, akses tanpa bolus, oksigen, dan transfer', () => {
    const kasus = PACK.kasus.lab_edema_paru_akut_hipertensif!
    expect(kasus.tatalaksana.obatBenar).toEqual(['furosemid_inj_20'])
    expect(kasus.tatalaksana.obatOpsional).toEqual(['isosorbid_dinitrat_5'])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['furosemid_inj_20'])
    expect(kasus.stabilisasiWajib).toEqual([
      'posisi_semifowler',
      'oksigen',
      'akses_iv_tanpa_bolus',
    ])
    expect(kasus.clue).toMatch(/furosemid intravena.*ISDN sublingual hanya opsi/is)
    expect(kasus.panduanResmi).toMatch(/ESC 2021.*2023.*vasodilator.*terpilih/is)
  })

  it('gagal jantung tidak bergantung rontgen dan membedakan beta-blocker lama dari inisiasi baru', () => {
    const kasus = PACK.kasus.lab_gagal_jantung_dekompensasi!
    expect(kasus.lab.some((item) => item.id === 'foto_toraks')).toBe(false)
    expect(kasus.tatalaksana.prosedur).toContain('akses_iv_tanpa_bolus')
    expect(kasus.stabilisasiWajib).toContain('akses_iv_tanpa_bolus')
    expect(kasus.panduanResmi).toMatch(/ESC 2021.*2023.*terapi kronik.*stabilitas hemodinamik/is)
    expect(kasus.catatanRealita).toMatch(/jangan menyatakan furosemid oral setara/i)
  })

  it('PPOK memakai diagnosis klinis, oksigen terkontrol, dan tidak menghidupkan fallback lama', () => {
    const kasus = PACK.kasus.lab_ppok_eksaserbasi_berat!
    expect(kasus.nama).toMatch(/Dugaan Infeksi/i)
    expect(kasus.lab.some((item) => item.id === 'foto_toraks')).toBe(false)
    expect(kasus.stabilisasiWajib).toEqual(['oksigen', 'nebulisasi', 'pemantauan_ketat_vital'])
    expect(kasus.clue).toMatch(/Rontgen bukan prasyarat.*target 88-92%/is)
    expect(kasus.panduanResmi).toMatch(/aminofilin atau adrenalin injeksi.*tidak dipakai.*otomatis/is)
    expect(kasus.catatanRealita).toMatch(/pulse oximeter.*transport ready/is)
  })

  it('TIA memberi asetosal segera, menahan antihipertensi akut, dan tidak lagi punya catatan terpotong', () => {
    const kasus = PACK.kasus.lab_tia_serangan_iskemik_sesaat!
    const bukti = record('lab_tia_serangan_iskemik_sesaat').evidence.ebm.sources
    expect(kasus.nama).toMatch(/^Suspek TIA/)
    expect(kasus.anamnesis.some((item) => item.id === 'q_aman_asetosal' && item.esensial)).toBe(true)
    expect(kasus.tatalaksana.obatBenar).toEqual(['asetosal_loading_320'])
    expect(kasus.tatalaksana.obatOpsional ?? []).toEqual([])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['asetosal_loading_320'])
    expect(kasus.tatalaksana.edukasi).toEqual(['tanda_bahaya', 'tia_fa_antikoagulasi', 'berhenti_merokok'])
    expect(kasus.tatalaksana.edukasiKritis).toContain('tia_fa_antikoagulasi')
    expect(kasus.clue).toMatch(/empat tablet.*80 mg.*berangkat sekarang.*jangan memakai ABCD2/is)
    expect(kasus.clue).toMatch(/Aspirin.*bukan.*jangka panjang.*AF/is)
    expect(kasus.panduanResmi).toMatch(/AHA 2023.*gejala yang telah menghilang.*emergensi/is)
    expect(kasus.panduanResmi).toMatch(/AHA\/ASA 2021.*ESC AF 2024/is)
    expect(kasus.catatanRealita).toMatch(/Fornas 1199\/2025.*surat rujuk balik/is)
    expect(kasus.catatanRealita?.trim()).not.toMatch(/(?:—|-)$/)
    expect(kasus.mutiaraEbm).toMatch(/CT tanpa kontras.*DWI-MRI.*tidak membatalkan/is)
    expect(PACK.edukasi.tia_fa_antikoagulasi?.nama).toMatch(/Aspirin awal.*antikoagulasi/i)
    expect(bukti.map((item) => item.sourceId)).toEqual([
      'aha-tia-2023',
      'aha-stroke-prevention-2021',
      'esc-af-2024',
    ])
    expect(PACK.obat.asetosal_loading_320?.nama).toMatch(/320 mg/i)
  })
})
