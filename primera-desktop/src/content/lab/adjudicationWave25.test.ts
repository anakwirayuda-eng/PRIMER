import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  PNPK_CROSSWALK,
} from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'
import { NAMA_ICD } from '../icd10'

const ID = 'lab_trauma_tumpul_kepala_ringan'
const DATA = buildAdjudicationDataset('2026-07-27T00:00:00.000Z')

function record() {
  const item = DATA.cases.find((candidate) => candidate.id === ID)
  if (!item) throw new Error(`Adjudication record '${ID}' hilang`)
  return item
}

describe('M13-137 adjudication wave 25: cedera superfisial kepala risiko rendah', () => {
  it('memperkuat provenance tanpa mengaktifkan prototipe', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.activationStatus).toBe('lab_prototype_unadjudicated')
    expect(PNPK_CROSSWALK[ID]).toEqual([{ slug: 'cedera-otak-traumatik-2022', relation: 'direct' }])
    expect(record().evidence.pnpk.status).toBe('cocok')
    expect(EBM_GUIDELINE_CROSSWALK[ID]?.map((item) => [item.sourceId, item.relation])).toEqual([
      ['nice-head-injury-ng232', 'direct'],
      ['cdc-mild-tbi-2025', 'related'],
    ])
    expect(record().evidence.ebm.status).toBe('cocok')
    expect(DATA.summary.ebmDirect).toBe(70)
  })

  it('mengunci diagnosis superfisial dan algoritme dewasa tanpa rujuk otomatis', () => {
    expect(PACK.kasus[ID]).toMatchObject({
      nama: 'Cedera Superfisial Kulit Kepala setelah Benturan Risiko Rendah',
      icd10: 'S00.0',
      skdi: '4A',
      harusDirujuk: false,
      demografi: {
        usiaMin: 16,
        usiaMax: 59,
      },
    })
    expect(NAMA_ICD['S00.0']).toBe('Cedera Superfisial Kulit Kepala')
    expect(PACK.kasus[ID]?.diagnosisBanding).toEqual(['S00.0', 'S06.0', 'S06.5', 'S02.9'])
  })

  it('membedakan nyeri tekan lokal dari sakit kepala persisten', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.keluhanUtama).toMatch(/benjol kecil.*nyeri bila ditekan/i)
    expect(kasus.anamnesis.find((item) => item.id === 'q_keluhan')?.jawab)
      .toMatch(/nyeri kalau ditekan, bukan sakit kepala menetap/i)
    expect(kasus.anamnesis.find((item) => item.id === 'q_perburukan')?.jawab)
      .toMatch(/nyeri hanya tepat di benjolan.*tidak muntah/is)
  })

  it('menutup domain anamnesis yang menentukan CT, rujukan, dan keamanan pulang', () => {
    const kasus = PACK.kasus[ID]!
    const ids = kasus.anamnesis.filter((item) => item.esensial).map((item) => item.id)
    expect(ids).toEqual(expect.arrayContaining([
      'q_kesadaran',
      'q_perburukan',
      'q_mekanisme',
      'q_obat',
      'q_risiko',
      'q_intoksikasi_keamanan',
      'q_leher',
      'q_pendamping',
    ]))
    const teks = kasus.anamnesis.map((item) => `${item.tanya} ${item.jawab}`).join(' ')
    expect(teks).toMatch(/pingsan.*lupa.*kejang/is)
    expect(teks).toMatch(/antikoagulan.*antiplatelet.*aspirin/is)
    expect(teks).toMatch(/operasi otak.*pembekuan darah/is)
    expect(teks).toMatch(/alkohol.*kekerasan/is)
    expect(teks).toMatch(/mengawasi selama 24 jam.*kendaraan/is)
  })

  it('mencatat GCS per komponen dan pemeriksaan trauma kepala yang relevan', () => {
    const kasus = PACK.kasus[ID]!
    const neuro = kasus.pemeriksaanFisik.find((item) => item.region === 'neurologis')
    const kepala = kasus.pemeriksaanFisik.find((item) => item.region === 'kepala_leher')
    expect(neuro?.temuan).toMatch(/GCS 15\/15.*E4 V5 M6.*orientasi.*memori.*pupil.*gait/is)
    expect(kepala?.temuan).toMatch(/hematoma.*2 cm.*tanpa luka terbuka.*step-off/is)
    expect(kepala?.temuan).toMatch(/hemotimpanum.*Battle sign.*raccoon eyes.*rinorea\/otorea/is)
  })

  it('menjadikan observasi wajib, analgesia opsional, dan imaging nonrutin', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.lab).toEqual([])
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.obatOpsional).toEqual(['paracetamol_500'])
    expect(kasus.tatalaksana.prosedur).toEqual(['observasi_neurologis'])
    expect(PACK.tindakan.observasi_neurologis?.nama)
      .toMatch(/GCS \(E\/V\/M\).*pupil.*gejala.*defisit neurologis/is)
    expect(kasus.clue).toMatch(/bukan otomatis konkusi.*foto polos kepala atau CT rutin/is)
  })

  it('mengganti edukasi generik dengan safety-net cedera kepala yang operasional', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.tatalaksana.edukasi).toEqual([
      'tanda_bahaya_cedera_kepala',
      'pengawasan_24_jam_cedera_kepala',
      'pemulihan_bertahap_cedera_kepala',
    ])
    expect(kasus.tatalaksana.edukasiKritis).toEqual([
      'tanda_bahaya_cedera_kepala',
      'pengawasan_24_jam_cedera_kepala',
    ])
    expect(PACK.edukasi.tanda_bahaya_cedera_kepala?.nama)
      .toMatch(/mengantuk.*kejang.*muntah.*perilaku berubah/is)
    expect(PACK.edukasi.pengawasan_24_jam_cedera_kepala?.nama)
      .toMatch(/pendamping dewasa.*24 jam.*jalur kembali/is)
    expect(PACK.edukasi.pemulihan_bertahap_cedera_kepala?.nama)
      .toMatch(/aktivitas berisiko hari ini.*gejala konkusi.*1-2 hari.*bertahap/is)
  })

  it('menjaga risiko rendah tetap jujur dan obat sedatif bukan kontraindikasi absolut', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.konsekuensi?.narasi).toMatch(/risiko.*rendah.*perburukan yang jarang/is)
    expect(kasus.tatalaksana.obatSalahUmum).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'diazepam_2', bahaya: 'nonPrimer' }),
      expect.objectContaining({ id: 'tramadol_50', bahaya: 'nonPrimer' }),
    ]))
    expect(kasus.catatanRealita).toMatch(/tidak memiliki CT.*observasi berkepanjangan.*bukan pengganti CT/is)
  })

  it('menampilkan tiga sumber klikabel dan resource observasi tetap grounded', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.sumber?.map((item) => item.id)).toEqual([
      'pnpk_cot_2022',
      'nice_head_injury_2023',
      'cdc_mild_tbi_2025',
    ])
    expect(kasus.sumber?.every((item) => item.url.startsWith('https://'))).toBe(true)
    expect(record().evidence.aspak.unresolvedResourceIds).toEqual([])
    expect(DATA.summary.resourceTierCOrD).toBe(45)
    expect(DATA.summary.resourceGrounded).toBe(45)
    expect(DATA.summary.resourceUnresolved).toBe(0)
  })
})
