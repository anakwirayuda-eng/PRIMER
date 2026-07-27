import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  PNPK_CROSSWALK,
} from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const ID = 'lab_trauma_abdomen_tumpul'
const DATA = buildAdjudicationDataset('2026-07-27T00:00:00.000Z')

function record() {
  const item = DATA.cases.find((candidate) => candidate.id === ID)
  if (!item) throw new Error(`Adjudication record '${ID}' hilang`)
  return item
}

describe('M13-137 adjudication wave 24: trauma abdomen tumpul dengan syok hemoragik', () => {
  it('memperkuat provenance tanpa mengaktifkan prototipe', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.activationStatus).toBe('lab_prototype_unadjudicated')
    expect(PNPK_CROSSWALK[ID]).toEqual([{ slug: 'trauma', relation: 'direct' }])
    expect(record().evidence.pnpk.status).toBe('cocok')
    expect(EBM_GUIDELINE_CROSSWALK[ID]?.map((item) => [item.sourceId, item.relation])).toEqual([
      ['european-trauma-bleeding-2023', 'direct'],
      ['nice-major-trauma-ng39', 'direct'],
      ['anzcor-oxygen-emergencies-2026', 'related'],
    ])
    expect(record().evidence.ebm.status).toBe('cocok')
    expect(DATA.summary.ebmDirect).toBe(70)
  })

  it('mempertahankan identitas dan disposisi trauma bedah 3B', () => {
    expect(PACK.kasus[ID]).toMatchObject({
      nama: 'Trauma Abdomen Tumpul dengan Curiga Cedera Organ Padat',
      icd10: 'S36.9',
      skdi: '3B',
      harusDirujuk: true,
      spesialisRujukan: 'bedah',
    })
  })

  it('menilai syok dari fisiologi tanpa kelas ATLS kaku', () => {
    const kasus = PACK.kasus[ID]!
    const sirkulasi = kasus.pemeriksaanFisik.find((item) => item.region === 'jantung')
    expect(sirkulasi?.temuan).toMatch(/syok hemoragik.*kelas syok kaku/is)
    expect(sirkulasi?.temuan).not.toMatch(/kelas II/i)
    expect(kasus.mutiaraEbm).toMatch(/Shock index.*1,33.*bukan pengganti penilaian klinis/is)
  })

  it('menghapus FAST, Hb, dan ABO dari skor sambil mempertahankan pengajaran non-gating', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.lab).toEqual([])
    expect(kasus.clue).toMatch(/FAST, Hb serial.*golongan darah.*tidak mendapat skor.*tidak boleh.*menahan ambulans/is)
    expect(kasus.catatanRealita).toMatch(/FAST.*Hb cepat.*golongan darah.*tidak diasumsikan tersedia/is)
    expect(kasus.mutiaraEbm).toMatch(/satu Hb rendah.*tidak mengukur volume atau kecepatan perdarahan/is)
    expect(kasus.mutiaraEbm).toMatch(/FAST.*hasil negatif tidak menyingkirkan/is)
  })

  it('mengunci bundel stabilisasi restriktif tanpa mengejar normotensi', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.tatalaksana.prosedur).toEqual([
      'resusitasi_restriktif_trauma',
      'oksigen',
      'cegah_hipotermia_trauma',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.stabilisasiWajib).toEqual(kasus.tatalaksana.prosedur)
    expect(kasus.tatalaksana.terapiKritis).toEqual([
      'asam_traneksamat_500_inj',
      'resusitasi_restriktif_trauma',
    ])
    expect(PACK.tindakan.resusitasi_restriktif_trauma?.nama)
      .toMatch(/akses IV besar.*250 mL.*SBP 80-90/is)
    expect(PACK.tindakan.cegah_hipotermia_trauma?.nama)
      .toMatch(/selimuti.*hangatkan cairan.*pantau suhu/is)
    expect(kasus.clue).toMatch(/syok meski SpO2 awal 97%/i)
    expect(kasus.clue).toMatch(/tanpa bukti cedera otak atau spinal.*SBP sekitar 80-90/is)
  })

  it('memberi TXA dini dengan dosis operasional dan tanpa menahan transfer', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.tatalaksana.obatBenar).toEqual(['asam_traneksamat_500_inj'])
    expect(kasus.clue).toMatch(/asam traneksamat 1 g IV selama 10 menit.*dua ampul 500 mg.*dalam tiga jam/is)
    expect(kasus.clue).toMatch(/transfer segera/i)

    const txa = record().currentManagement.requiredDrugs
      .find((item) => item.id === 'asam_traneksamat_500_inj')
    expect(txa?.fornas.status).toBe('cocok')
  })

  it('tidak mengajarkan transfusi improvisasi atau kamar operasi sebagai satu-satunya jalur', () => {
    const kasus = PACK.kasus[ID]!
    const transfusi = kasus.tatalaksana.tindakanSalahUmum
      ?.find((item) => item.id === 'transfusi_darah_fktp')
    expect(transfusi?.alasan).toMatch(/tidak menggantikan type-and-screen atau crossmatch/is)
    expect(transfusi?.alasan).toMatch(/operatif atau intervensional/is)
    expect(kasus.konsekuensi?.narasi).toMatch(/operatif atau intervensional/is)
    expect(`${transfusi?.alasan} ${kasus.konsekuensi?.narasi}`).not.toMatch(/satu-satunya.*kamar operasi/is)
  })

  it('menampilkan empat sumber klikabel dan merekonsiliasi resource', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.sumber?.map((item) => item.id)).toEqual([
      'pnpk_trauma_2017',
      'european_trauma_bleeding_2023',
      'nice_major_trauma_ng39',
      'anzcor_oxygen_2026',
    ])
    expect(kasus.sumber?.every((item) => item.url.startsWith('https://'))).toBe(true)
    expect(DATA.summary.resourceTierCOrD).toBe(45)
    expect(DATA.summary.resourceGrounded).toBe(45)
    expect(DATA.summary.resourceUnresolved).toBe(0)
    expect(record().evidence.aspak.unresolvedResourceIds).toEqual([])
  })
})
