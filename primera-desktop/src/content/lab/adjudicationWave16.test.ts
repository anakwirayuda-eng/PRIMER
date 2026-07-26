import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { EBM_GUIDELINE_CROSSWALK, EBM_GUIDELINE_SOURCES } from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const IDS = [
  'lab_cacing_tambang',
  'lab_strongiloidiasis',
  'lab_skistosomiasis_sulteng',
  'lab_taeniasis_intestinal',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 16: helminth klinik-WASH-One Health-program', () => {
  it('memberi provenance langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(EBM_GUIDELINE_CROSSWALK[id]?.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(67)
  })

  it('menghubungkan cacing tambang ke terapi anemia, WASH, dan batas POPM', () => {
    const kasus = PACK.kasus.lab_cacing_tambang!
    expect(kasus.tatalaksana.obatBenar).toEqual(['albendazol_400', 'tablet_fe'])
    expect(kasus.tatalaksana.edukasi).toEqual([
      'rencana_cacing_tambang_anemia',
      'cegah_cacing_tanah',
      'beda_popm_cacingan',
    ])
    expect(kasus.clue).toMatch(/kontrol gejala serta Hb/i)
    expect(kasus.clue).toMatch(/tidak membuktikan penularan langsung antarmanusia/i)
    expect(kasus.panduanResmi).toMatch(/Permenkes 3\/2026.*15\/2017 sudah dicabut/is)
    expect(kasus.panduanResmi).toMatch(/POPM.*bukan resep otomatis/is)
  })

  it('menutup hasil strongiloidiasis sebelum steroid dan memisahkan MDA', () => {
    const kasus = PACK.kasus.lab_strongiloidiasis!
    expect(kasus.lab.map((item) => item.id)).toEqual(['feses_rutin'])
    expect(kasus.tatalaksana.edukasiKritis).toEqual([
      'rencana_strongiloides_steroid',
      'kontrol_strongiloides',
    ])
    expect(kasus.clue).toMatch(/ivermektin 200 mcg\/kg.*1-2 hari/is)
    expect(kasus.clue).toMatch(/pemberi steroid.*2-4 minggu/is)
    expect(kasus.panduanResmi).toMatch(/prevalensi sekurangnya 5%.*tidak menggantikan.*pasien/is)
    expect(kasus.konsekuensi?.kondisiKembali).toMatch(/jika steroid telanjur dimulai.*sesak.*sepsis/is)
  })

  it('membuat skistosomiasis Sulawesi Tengah sebagai episode program One Health', () => {
    const kasus = PACK.kasus.lab_skistosomiasis_sulteng!
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_program', esensial: true }),
      expect.objectContaining({ id: 'q_hewan' }),
    ]))
    expect(kasus.lab.map((item) => item.id)).toEqual(['feses_rutin'])
    expect(kasus.tatalaksana.edukasi).toEqual([
      'alur_program_skistosomiasis',
      'hindari_air_tawar_endemis',
      'one_health_skistosomiasis',
    ])
    expect(kasus.clue).toMatch(/kasus individual.*terpisah dari POPM.*air-keong.*reservoir hewan/is)
    expect(kasus.panduanResmi).toMatch(/Poso-Sigi.*POPM desa.*fokus keong/is)
    expect(kasus.konsekuensi).toMatchObject({ kembaliHariMin: 30, kembaliHariMax: 90 })
  })

  it('memperbaiki kausalitas taeniasis-sistiserkosis dan menutup One Health', () => {
    const kasus = PACK.kasus.lab_taeniasis_intestinal!
    expect(kasus.anamnesis).toContainEqual(expect.objectContaining({ id: 'q_ternak', esensial: true }))
    expect(kasus.tatalaksana.edukasi).toEqual([
      'rencana_taeniasis',
      'masak_daging_matang',
      'tanda_bahaya_sistiserkosis',
    ])
    expect(kasus.clue).toMatch(/belum memastikan spesies.*10 mg\/kg dosis tunggal/is)
    expect(kasus.panduanResmi).toMatch(/obati carrier manusia.*jaga babi dari tinja.*inspeksi/is)
    expect(kasus.catatanRealita).toMatch(/bagian antisistosoma.*bukan bukti otomatis/is)
    expect(kasus.konsekuensi?.narasi).toMatch(/menelan telur.*bukan semata-mata makan daging/is)
  })

  it('mengunci sumber aktif dan menghapus klaim program yang sudah dicabut', () => {
    expect(EBM_GUIDELINE_SOURCES['who-strongyloidiasis-pc-2024']?.year).toBe(2024)
    expect(EBM_GUIDELINE_SOURCES['who-schistosomiasis-2026']?.year).toBe(2026)
    expect(EBM_GUIDELINE_SOURCES['kemenkes-p2-action-plan-2025']?.authority).toMatch(/Kementerian Kesehatan/i)
    const seluruh = IDS.map((id) => [
      PACK.kasus[id]?.clue,
      PACK.kasus[id]?.panduanResmi,
      PACK.kasus[id]?.catatanRealita,
    ].join(' ')).join('\n')
    expect(seluruh).not.toMatch(/Permenkes 15\/2017 (?:menjadi|adalah) (?:floor|payung|pedoman aktif)/i)
  })
})
