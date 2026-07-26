import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  FORNAS_QUERIES,
} from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const ID = 'lab_benda_asing_konjungtiva'
const DATA = buildAdjudicationDataset('2026-07-26T00:00:00.000Z')

function record() {
  const item = DATA.cases.find((candidate) => candidate.id === ID)
  if (!item) throw new Error(`Adjudication record '${ID}' hilang`)
  return item
}

describe('M13-137 adjudication wave 23: benda asing konjungtiva superfisial', () => {
  it('memperkuat provenance tanpa mengaktifkan prototipe', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.activationStatus).toBe('lab_prototype_unadjudicated')
    expect(record().evidence.ppk).toMatchObject({
      status: 'cocok',
      relation: 'direct',
    })
    expect(record().evidence.ebm.status).toBe('cocok')
    expect(EBM_GUIDELINE_CROSSWALK[ID]?.map((item) => [item.sourceId, item.relation])).toEqual([
      ['racgp-ophthalmic-trauma-2026', 'direct'],
      ['college-optometrists-ocular-fb-2025', 'direct'],
      ['cochrane-corneal-antibiotic-2025', 'related'],
    ])
    expect(DATA.summary.ppkDirect).toBe(93)
    expect(DATA.summary.ebmDirect).toBe(68)
  })

  it('mempertahankan identitas kasus FKTP dan menyaring trauma mata berisiko', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus).toMatchObject({
      nama: 'Benda Asing Konjungtiva Superfisial',
      icd10: 'T15.9',
      skdi: '4A',
      harusDirujuk: false,
    })
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_gejala_redflag', esensial: true }),
      expect.objectContaining({ id: 'q_mekanisme', esensial: true }),
      expect.objectContaining({ id: 'q_lensa_riwayat', esensial: true }),
      expect.objectContaining({ id: 'q_tindakan_awal', esensial: true }),
    ]))
    expect(kasus.anamnesis.some((item) => item.id === 'q_dist_alergi_debu')).toBe(false)
  })

  it('mengunci pemeriksaan mata sebelum dan sesudah ekstraksi', () => {
    const kasus = PACK.kasus[ID]!
    const mata = kasus.pemeriksaanFisik.find((item) => item.region === 'mata')
    expect(mata?.temuan).toMatch(/visus setara.*pupil.*bilik depan.*dieversi/is)
    expect(mata?.temuan).toMatch(/sekam longgar.*konjungtiva tarsal/is)
    expect(mata?.temuan).toMatch(/fluorescein.*tidak menunjukkan defek epitel.*Seidel negatif/is)
    expect(kasus.clue).toMatch(/catat visus sebelum anestetik.*ulangi fluorescein setelah pengangkatan/is)
  })

  it('membatasi ekstraksi pada benda longgar dan memberi ambang berhenti yang nyata', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.tatalaksana.prosedur).toEqual(['ekstraksi_benda_asing_konjungtiva'])
    expect(PACK.tindakan.ekstraksi_benda_asing_konjungtiva?.nama)
      .toMatch(/irigasi atau ekstraksi lembut.*tampak superfisial/i)
    expect(kasus.catatanRealita).toMatch(/slit lamp tidak diasumsikan/i)
    expect(kasus.catatanRealita).toMatch(/hanya sekam longgar.*konjungtiva tarsal.*diangkat/is)
    expect(kasus.catatanRealita).toMatch(/korneal\/tertanam.*resistensi.*rujuk/is)
    expect(kasus.clue).toMatch(/jangan melakukan probing atau upaya berulang/i)
  })

  it('menjadikan antibiotik selektif dan aftercare sebagai kompetensi wajib', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.obatOpsional).toEqual(['kloramfenikol_tetes_mata'])
    expect(kasus.tatalaksana.edukasi).toEqual([
      'perawatan_pasca_benda_asing_mata',
      'perlindungan_mata',
      'tanda_bahaya',
    ])
    expect(kasus.tatalaksana.edukasiKritis).toEqual([
      'perawatan_pasca_benda_asing_mata',
      'tanda_bahaya',
    ])
    expect(PACK.edukasi.perawatan_pasca_benda_asing_mata?.nama)
      .toMatch(/jangan membawa pulang anestetik tetes.*24-48 jam/i)
    expect(kasus.mutiaraEbm).toMatch(/kepastian bukti.*sangat rendah/i)
    expect(kasus.mutiaraEbm).toMatch(/kloramfenikol.*opsi klinis, bukan syarat nilai/is)
  })

  it('memberi follow-up dini yang koheren untuk material organik', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.konsekuensi).toMatchObject({
      kembaliHariMin: 1,
      kembaliHariMax: 2,
    })
    expect(kasus.konsekuensi?.narasi).toMatch(/fragmen organik.*defek epitel.*keratitis/is)
    expect(kasus.konsekuensi?.kondisiKembali)
      .toMatch(/visus.*kelopak dieversi.*fluorescein.*fragmen.*defek.*infiltrat/is)
  })

  it('menampilkan empat sumber klikabel dan locator Fornas bentuk sediaan mata', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.sumber?.map((item) => item.id)).toEqual([
      'ppk_fktp_2022',
      'racgp_ophthalmic_trauma_2026',
      'college_optometrists_ocular_fb_2025',
      'cochrane_corneal_antibiotic_2025',
    ])
    expect(kasus.sumber?.every((item) => item.url.startsWith('https://'))).toBe(true)
    expect(FORNAS_QUERIES.kloramfenikol_tetes_mata).toEqual(['5 kloramfenikol'])

    const drug = record().currentManagement.optionalDrugs
      .find((item) => item.id === 'kloramfenikol_tetes_mata')
    expect(drug?.fornas.status).toBe('cocok')
    expect(drug?.fornas.excerpts[0]).toMatchObject({
      label: '5 kloramfenikol',
      locator: expect.stringMatching(/baris 166\d\d$/),
    })
    expect(drug?.name).toMatch(/tetes mata/i)
    expect(drug?.dosageForm).toMatch(/botol tetes/i)
    expect(drug?.fornas.excerpts[0]?.text).toMatch(/kloramfenikol.*salep mata/is)
  })
})
