import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  PNPK_CROSSWALK,
} from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const ID = 'lab_gangguan_somatoform'
const DATA = buildAdjudicationDataset('2026-07-26T00:00:00.000Z')

function record() {
  const item = DATA.cases.find((candidate) => candidate.id === ID)
  if (!item) throw new Error(`Adjudication record '${ID}' hilang`)
  return item
}

describe('M13-137 adjudication wave 22: keluhan fisik persisten', () => {
  it('memperbaiki provenance tanpa mengaktifkan prototipe', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.activationStatus).toBe('lab_prototype_unadjudicated')
    expect(PNPK_CROSSWALK[ID]).toBeUndefined()
    expect(record().evidence.pnpk.status).toBe('tak-ada-sumber')
    expect(record().evidence.pnpk.sources).toEqual([])
    expect(record().evidence.ebm.status).toBe('cocok')
    expect(EBM_GUIDELINE_CROSSWALK[ID]?.map((item) => item.sourceId)).toEqual([
      'kemenkes-keswa-fktp-2020',
      'who-icd11-cddr-2024',
      'who-mhgap-ig2-2016',
      'who-bodily-distress-cbt-2012',
      'german-s3-functional-somatic-2019',
      'plos-mus-communication-2022',
    ])
    expect(DATA.summary.pnpkDirect).toBe(27)
    expect(DATA.summary.ebmDirect).toBe(71)
  })

  it('menegakkan F45 dari fitur positif dan banding organik yang koheren', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus).toMatchObject({
      nama: 'Gangguan Somatoform - Keluhan Fisik Persisten',
      icd10: 'F45',
      skdi: '4A',
      harusDirujuk: false,
    })
    expect(kasus.diagnosisBanding).toEqual(['F45', 'F41.1', 'E05.9'])
    expect(kasus.diagnosisBanding).not.toContain('E03.9')
    expect(kasus.clue).toMatch(/diagnosis berbasis fitur positif/i)
    expect(kasus.clue).toMatch(/bukan kesimpulan bahwa hasil normal berarti keluhan psikologis/i)
    expect(kasus.mutiaraEbm).toMatch(/dapat hidup bersama penyakit fisik/i)
    expect(kasus.mutiaraEbm).toMatch(/kode F45 tetap dipakai.*SKDI.*PPK/is)
  })

  it('membuat anamnesis medis-psikososial lengkap tanpa tes ulang ritual', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_karakter', esensial: true }),
      expect.objectContaining({ id: 'q_redflag', esensial: true }),
      expect.objectContaining({ id: 'q_organik_zat', esensial: true }),
      expect.objectContaining({
        id: 'q_riwayat_periksa',
        esensial: true,
        jawab: expect.stringMatching(/EKG.*darah rutin.*gula darah.*TSH/is),
      }),
      expect.objectContaining({
        id: 'q_jiwa_keselamatan',
        esensial: true,
        tanya: expect.stringMatching(/kehilangan minat.*menyakiti diri/is),
      }),
      expect.objectContaining({ id: 'q_konteks_tujuan', esensial: true }),
    ]))
    expect(kasus.anamnesis.some((item) => item.id === 'q_dist_kerokan')).toBe(false)
    expect(kasus.lab).toEqual([])
    expect(kasus.clue).toMatch(/tinjau hasil lama.*ulangi pemeriksaan hanya bila ada indikasi baru/is)
    expect(kasus.catatanRealita).toMatch(/gejala baru maupun pola yang berubah.*evaluasi medis ulang/is)
  })

  it('mengunci tata laksana nonstigmatisasi, kontinuitas, dan fokus fungsi', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.obatSalahUmum).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'diazepam_2', bahaya: 'nonPrimer' }),
      expect.objectContaining({
        id: 'fluoksetin_20',
        alasan: expect.stringMatching(/tidak diberikan otomatis.*diagnosis.*komorbid/is),
      }),
    ]))
    expect(kasus.tatalaksana.edukasi).toEqual([
      'validasi_penjelasan_somatik',
      'perawatan_terjadwal_somatik',
      'aktivitas_redflag_somatik',
    ])
    expect(kasus.tatalaksana.edukasiKritis).toEqual([
      'validasi_penjelasan_somatik',
      'perawatan_terjadwal_somatik',
    ])
    expect(PACK.edukasi.validasi_penjelasan_somatik?.nama).toMatch(/validasi gejala.*bersama pasien/is)
    expect(PACK.edukasi.perawatan_terjadwal_somatik?.nama).toMatch(/satu klinisi.*sasaran fungsi/is)
    expect(PACK.edukasi.aktivitas_redflag_somatik?.nama).toMatch(/bertahap beraktivitas.*pola berubah/is)
  })

  it('memberi follow-up longitudinal tanpa karikatur pasien', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.konsekuensi).toMatchObject({
      kembaliHariMin: 21,
      kembaliHariMax: 35,
    })
    expect(kasus.konsekuensi?.narasi).toMatch(/ketidakpastian.*iatrogenik.*gangguan fungsi/is)
    expect(kasus.konsekuensi?.kondisiKembali).toMatch(/hasil lama.*rencana kontrol.*sasaran fungsi/is)
    const text = [
      kasus.keluhanUtama,
      ...kasus.anamnesis.flatMap((item) => [item.tanya, item.jawab]),
      kasus.clue,
      kasus.panduanResmi,
      kasus.catatanRealita,
      kasus.mutiaraEbm,
      kasus.konsekuensi?.narasi,
      kasus.konsekuensi?.kondisiKembali,
    ].join(' ')
    expect(text).not.toMatch(/memperkuat perilaku sakit/i)
    expect(text).not.toMatch(/pasti ada yang belum ketemu/i)
    expect(text).not.toMatch(/hasil normal membuktikan|karena hasil normal, keluhan.*psik/i)
    expect(text).not.toMatch(/kerokan|dikerok/i)
  })

  it('menampilkan sumber langsung dan keterbatasan bukti secara transparan', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.sumber?.map((item) => item.id)).toEqual([
      'ppk_fktp_2022',
      'kemenkes_keswa_fktp_2020',
      'who_icd11_cddr_2024',
      'who_mhgap_ig2_2016',
      'who_bodily_distress_cbt_2012',
      'german_s3_functional_somatic_2019',
      'plos_mus_communication_2022',
    ])
    expect(kasus.panduanResmi).toMatch(/PNPK Kedokteran Jiwa 2015.*tidak memiliki bab somatoform/is)
    expect(kasus.mutiaraEbm).toMatch(/kondisional.*mutu bukti sangat rendah/is)
    expect(kasus.mutiaraEbm).toMatch(/belum menemukan satu skrip yang pasti unggul/is)
    expect(kasus.catatanRealita).toMatch(/tidak mengasumsikan psikolog selalu tersedia/is)
  })
})
