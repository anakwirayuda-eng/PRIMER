import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_penyakit_ginjal_kronik_st3b',
  'lab_hipertiroid_graves',
  'lab_anemia_berat_perlu_transfusi',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 11: metabolik-hematologi rujuk', () => {
  it('memberi provenance EBM langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(record('lab_hipertiroid_graves').compiler.suggestion).toBe('cocok')
    expect(record('lab_anemia_berat_perlu_transfusi').compiler.suggestion).toBe('cocok')
    expect(record('lab_penyakit_ginjal_kronik_st3b').compiler).toMatchObject({
      suggestion: 'cocok',
      reasons: [],
    })
    expect(record('lab_penyakit_ginjal_kronik_st3b').evidence.aspak.resources).toContainEqual(
      expect.objectContaining({ id: 'fungsi_ginjal', tier: 'C', grounding: 'declared' }),
    )
    expect(DATA.summary.ebmDirect).toBe(67)
  })

  it('PGK membuktikan kronisitas dan tidak menyamakan G3b dengan persiapan dialisis', () => {
    const kasus = PACK.kasus.lab_penyakit_ginjal_kronik_st3b!
    expect(kasus.anamnesis).toContainEqual(expect.objectContaining({
      id: 'q_riwayat_fungsi_ginjal',
      esensial: true,
      jawab: expect.stringMatching(/enam bulan.*eGFR.*38/is),
    }))
    expect(kasus.lab.map((item) => item.id)).toEqual(['fungsi_ginjal', 'proteinuria', 'hb'])
    expect(kasus.lab.find((item) => item.id === 'proteinuria')?.hasil).toMatch(/ACR/i)
    expect(kasus.catatanRealita).toMatch(/kreatinin terjadwal lewat jejaring/i)
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.obatAlternatif ?? []).toEqual([])
    expect(kasus.clue).toMatch(/kronisitas.*tiga bulan/is)
    expect(kasus.panduanResmi).toMatch(/eGFR 35 sendiri bukan sinonim persiapan dialisis/i)
    expect(kasus.konsekuensi?.narasi).toMatch(/bukan kepastian/i)
  })

  it('Graves tetap diagnosis klinis terduga dan menyaring bahaya sebelum propranolol', () => {
    const kasus = PACK.kasus.lab_hipertiroid_graves!
    expect(kasus.nama).toMatch(/^Suspek/i)
    expect(kasus.lab).toEqual([])
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_kontra_beta_blocker', esensial: true }),
      expect.objectContaining({ id: 'q_kehamilan', esensial: true, hanyaUntuk: 'P' }),
    ]))
    expect(kasus.tatalaksana.obatBenar).toEqual(['propranolol_10'])
    expect(kasus.tatalaksana.obatOpsional ?? []).not.toContain('propiltiourasil_100')
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['rencana_tirotoksikosis_rujuk'])
    expect(PACK.edukasi.rencana_tirotoksikosis_rujuk?.nama).toMatch(/keamanan beta-blocker/i)
    expect(kasus.clue).toMatch(/TSH rendah perlu FT4\/FT3/i)
    expect(kasus.clue).toMatch(/Jangan memulai PTU secara ad hoc/i)
  })

  it('anemia mengunci etiologi, tes kehamilan, dan rujukan tanpa tes Tier-D', () => {
    const kasus = PACK.kasus.lab_anemia_berat_perlu_transfusi!
    expect(kasus.icd10).toBe('D50.0')
    expect(kasus.nama).toMatch(/defisiensi besi.*perdarahan kronik/i)
    expect(kasus.lab.map((item) => item.id)).toEqual(['hb', 'tes_kehamilan'])
    expect(kasus.anamnesis.find((item) => item.id === 'q_hamil')).toEqual(expect.objectContaining({
      esensial: true,
      jawab: expect.stringMatching(/belum pernah tes kehamilan/i),
    }))
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.obatOpsional).toEqual(['tablet_fe'])
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['rencana_anemia_berat_rujuk'])
    expect(kasus.clue).toMatch(/rujuk hari yang sama/i)
    expect(kasus.catatanRealita).toMatch(/tidak menunggu pemeriksaan lanjutan/i)
  })

  it('membedakan akses IV dari bolus dan fasilitas Sukamaju dari klaim nasional', () => {
    const kasus = PACK.kasus.lab_anemia_berat_perlu_transfusi!
    const cairan = kasus.tatalaksana.tindakanSalahUmum?.find((item) => item.id === 'resusitasi_cairan_kristaloid')
    const transfusi = kasus.tatalaksana.tindakanSalahUmum?.find((item) => item.id === 'transfusi_darah_fktp')
    expect(cairan?.alasan).toMatch(/Akses intravena.*berbeda dari bolus/is)
    expect(transfusi?.alasan).toMatch(/Sukamaju.*nonrawat-inap/is)
    expect(transfusi?.alasan).toMatch(/bukan larangan universal/i)
  })

  it('tidak menghidupkan kembali overclaim lama', () => {
    const text = IDS.map((id) => {
      const kasus = PACK.kasus[id]!
      return [kasus.clue, kasus.panduanResmi, kasus.catatanRealita, kasus.mutiaraEbm, kasus.konsekuensi?.narasi].join(' ')
    }).join(' ')

    expect(text).not.toMatch(/persiapan terapi pengganti ginjal/i)
    expect(text).not.toMatch(/Gula darah sewaktu 104 mg\/dL.*menyingkirkan diabetes/is)
    expect(text).not.toMatch(/TSH dan obat antitiroid nyaris tidak pernah tersedia/i)
    expect(text).not.toMatch(/Hb 5,8.*jauh lebih sering daripada yang diduga/is)
    expect(text).not.toMatch(/menaikkan Hb sekitar 1 g\/dL per DUA MINGGU/i)
  })
})
