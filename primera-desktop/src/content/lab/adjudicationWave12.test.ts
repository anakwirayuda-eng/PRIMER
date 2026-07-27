import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { EBM_GUIDELINE_CROSSWALK, PNPK_CROSSWALK } from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const IDS = [
  'lab_tb_paru_putus_obat_suspek_mdr',
  'lab_skrofuloderma_suspek',
  'lab_hepatitis_b_kronik',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 12: TB-program dan hepatitis B keluarga', () => {
  it('memberi provenance langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(EBM_GUIDELINE_CROSSWALK[id]?.some((source) => source.relation === 'direct'), id).toBe(true)
    }
    expect(PNPK_CROSSWALK.lab_skrofuloderma_suspek).toEqual([
      expect.objectContaining({ slug: 'tuberkulosis', relation: 'related' }),
    ])
    expect(DATA.summary.ebmDirect).toBe(70)
  })

  it('membedakan RR-TB dari MDR dan memakai TCM dahak melalui jejaring', () => {
    const kasus = PACK.kasus.lab_tb_paru_putus_obat_suspek_mdr!
    expect(kasus.nama).toMatch(/resistan rifampisin/i)
    expect(kasus.lab).toEqual([
      expect.objectContaining({
        id: 'tcm_sputum',
        hasil: expect.stringMatching(/isoniazid.*belum diketahui/i),
      }),
    ])
    expect(kasus.clue).toMatch(/belum boleh disebut MDR-TB/i)
    expect(kasus.clue).toMatch(/catat-notifikasi.*investigasi kontak/is)
    expect(kasus.tatalaksana.edukasi).not.toContain('minum_oat_tuntas')
    expect(kasus.tatalaksana.edukasi).not.toContain('cuci_tangan')
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['alur_tb_ro_jejaring', 'investigasi_kontak_tb'])
  })

  it('membuat skrofuloderma sebagai episode TB ekstraparu, bukan swab luka', () => {
    const kasus = PACK.kasus.lab_skrofuloderma_suspek!
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_gejala_tb_paru', esensial: true }),
      expect.objectContaining({ id: 'q_kontak_tb', esensial: true }),
    ]))
    expect(kasus.lab).toEqual([
      expect.objectContaining({
        id: 'tcm_spesimen_lesi',
        hasil: expect.stringMatching(/aspirat nodus\/jaringan.*bukan swab/is),
      }),
    ])
    expect(kasus.clue).toMatch(/rujuk tanpa menunggu konfirmasi final/i)
    expect(kasus.clue).toMatch(/nilai pula TB paru dan HIV/i)
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['alur_tb_ekstraparu', 'investigasi_kontak_tb'])
  })

  it('membuktikan kronisitas HBV dan tidak memakai USG normal sebagai penutup kasus', () => {
    const kasus = PACK.kasus.lab_hepatitis_b_kronik!
    expect(kasus.anamnesis).toContainEqual(expect.objectContaining({
      id: 'q_hbsag_lama',
      esensial: true,
      jawab: expect.stringMatching(/sepuluh bulan.*HBsAg.*reaktif/is),
    }))
    expect(kasus.lab.map((item) => item.id)).toEqual(['hbsag', 'sgot_sgpt'])
    expect(kasus.lab.find((item) => item.id === 'hbsag')?.hasil).toMatch(/persistensi lebih dari enam bulan/i)
    expect(kasus.clue).toMatch(/tidak membuktikan rute penularan/i)
    expect(kasus.panduanResmi).toMatch(/PPK.*tidak memuat algoritma.*selengkap PNPK/is)
    expect(kasus.panduanResmi).toMatch(/2\.000 IU\/mL/i)
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['rencana_hbv_jejaring', 'cegah_penularan_hepatitis_b'])
  })

  it('menjadikan keluarga dan program sebagai konsekuensi gameplay nyata', () => {
    const tb = PACK.kasus.lab_tb_paru_putus_obat_suspek_mdr!
    const kulit = PACK.kasus.lab_skrofuloderma_suspek!
    const hbv = PACK.kasus.lab_hepatitis_b_kronik!
    expect(PACK.edukasi.investigasi_kontak_tb?.nama).toMatch(/skrining aktif.*TPT/i)
    expect(PACK.edukasi.alur_tb_ro_jejaring?.nama).toMatch(/notifikasi.*TCM.*TB-RO/i)
    expect(PACK.edukasi.alur_tb_ekstraparu?.nama).toMatch(/aspirat\/jaringan.*program/i)
    expect(PACK.edukasi.rencana_hbv_jejaring?.nama).toMatch(/stadiumkan.*antivirus.*retensi/i)
    expect(tb.konsekuensi?.kondisiKembali).toMatch(/layanan TB-RO tidak pernah menerima/i)
    expect(kulit.konsekuensi?.narasi).toMatch(/kontak serumah/i)
    expect(hbv.konsekuensi?.kondisiKembali).toMatch(/waktu penularan tidak dapat dipastikan/i)
  })

  it('mengunci overclaim lama agar tidak kembali', () => {
    const text = IDS.map((id) => {
      const kasus = PACK.kasus[id]!
      return [kasus.clue, kasus.panduanResmi, kasus.catatanRealita, kasus.mutiaraEbm, kasus.konsekuensi?.narasi].join(' ')
    }).join(' ')

    expect(text).not.toMatch(/rifampisin resistan menandakan MDR-TB sampai terbukti sebaliknya/i)
    expect(text).not.toMatch(/BTA negatif.*negatif palsu/is)
    expect(text).not.toMatch(/mengarah kuat pada penularan perinatal/i)
    expect(text).not.toMatch(/vaksin hepatitis B DAN HBIG dalam 12 jam/i)
    expect(text).not.toMatch(/dua pintu terbesar penemuan hepatitis B/i)
  })
})
