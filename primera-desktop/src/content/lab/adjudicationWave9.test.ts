import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_abses_peritonsil',
  'lab_mastoiditis_akut',
  'lab_otitis_media_supuratif_kronik_komplikata',
  'lab_furunkel_hidung',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 9: infeksi THT dan source control', () => {
  it('memberi provenance EBM langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(70)
  })

  it('menjaga status floor PPK tetap jujur', () => {
    expect(record('lab_abses_peritonsil').evidence.ppk.relation).toBe('related')
    expect(record('lab_mastoiditis_akut').evidence.ppk.relation).toBe('related')
    expect(record('lab_mastoiditis_akut').evidence.ppk.sourceTitle).toBe('Otitis Media Akut')
    expect(record('lab_mastoiditis_akut').evidence.ppk.sourceEntryNumber).toBe('2')
    const mastoidPpk = record('lab_mastoiditis_akut').evidence.ppk.excerpts
    expect(mastoidPpk.map((item) => item.label)).toContain('Kriteria rujukan')
    expect(mastoidPpk.find((item) => item.label === 'Kriteria rujukan')?.text).toMatch(/komplikasi dari otitis media akut/i)
    expect(mastoidPpk.map((item) => item.text).join(' ')).not.toMatch(/Tetrakain|benda asing/i)
    expect(record('lab_otitis_media_supuratif_kronik_komplikata').evidence.ppk.relation).toBe('direct')
    expect(record('lab_furunkel_hidung').evidence.ppk.relation).toBe('direct')
  })

  it('OMSK perforasi tidak lagi mewajibkan asam asetat atau tetes improvisasi', () => {
    const kasus = PACK.kasus.lab_otitis_media_supuratif_kronik_komplikata!
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.prosedur).toEqual(['pembersihan_telinga_kering_pra_rujuk'])
    expect(PACK.tindakan.pembersihan_telinga_kering_pra_rujuk?.nama).toMatch(/kering tanpa irigasi/i)
    expect(kasus.clue).toMatch(/tidak membuktikan erosi tulang/i)
    expect(kasus.panduanResmi).toMatch(/DailyMed 2025.*perforasi sebagai kontraindikasi/is)
    expect(kasus.catatanRealita).toMatch(/tidak mengimprovisasi pengganti/i)
    expect(`${kasus.clue} ${kasus.panduanResmi}`).not.toMatch(/asam asetat.*aman.*berlubang/is)
  })

  it('mastoiditis anak memakai protokol berbasis berat dan source control selektif', () => {
    const kasus = PACK.kasus.lab_mastoiditis_akut!
    expect(kasus.demografi).toEqual({ usiaMin: 3, usiaMax: 5 })
    expect(kasus.skdi).toBe('3A')
    expect(kasus.tatalaksana.obatBenar).toEqual(['paracetamol_sirup'])
    expect(kasus.tatalaksana.prosedur).toEqual([
      'akses_iv_tanpa_bolus',
      'antibiotik_parenteral_mastoiditis_anak_protokol',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.tatalaksana.prosedur).not.toContain('pasang_infus')
    expect(kasus.tatalaksana.terapiKritis).toEqual(['antibiotik_parenteral_mastoiditis_anak_protokol'])
    expect(kasus.stabilisasiWajib).toEqual([
      'antibiotik_parenteral_mastoiditis_anak_protokol',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.clue).toMatch(/tidak membuktikan keluarga menyebabkan komplikasi/i)
    expect(kasus.clue).toMatch(/tidak semua anak otomatis memerlukan mastoidektomi/i)
    expect(kasus.clue).toMatch(/akses IV tanpa bolus cairan rutin/i)
    expect(kasus.catatanRealita).toMatch(/bukan seftriakson 1 g universal/i)
    expect(kasus.tatalaksana.edukasi).toEqual(['rujuk_mastoiditis_anak', 'kepatuhan_obat', 'tanda_bahaya'])
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['rujuk_mastoiditis_anak'])
    expect(kasus.panduanResmi).toMatch(/SKDI 2012.*3A.*Otitis Media Akut/is)
    expect(kasus.konsekuensi?.guideline).not.toMatch(/SKDI 3B/i)

    const pembuka = kasus.anamnesis.find((item) => item.id === 'q_keluhan')
    const riwayatObat = kasus.anamnesis.find((item) => item.id === 'q_riwayat_oma')
    const imunisasi = kasus.anamnesis.find((item) => item.id === 'q_distraktor_imunisasi')
    expect(pembuka?.jawab).not.toMatch(/empat hari.*henti/i)
    expect(riwayatObat?.jawab).toMatch(/empat hari.*simpan sisanya/i)
    expect(imunisasi?.distraktor).not.toBe(true)
  })

  it('abses peritonsil mempertahankan rujuk dan drainase terkontrol', () => {
    const kasus = PACK.kasus.lab_abses_peritonsil!
    expect(kasus.harusDirujuk).toBe(true)
    expect(kasus.tatalaksana.prosedur).toEqual(['pemantauan_ketat_vital'])
    expect(kasus.clue).toMatch(/source control/i)
    expect(kasus.clue).toMatch(/bukan aspirasi buta di FKTP/i)
    expect(kasus.panduanResmi).toMatch(/NICE NG84.*dirujuk ke rumah sakit/is)
    expect(kasus.catatanRealita).toMatch(/jangan memaksa obat oral/i)
  })

  it('furunkel hidung membedakan lesi lokal dari penyebaran berbahaya', () => {
    const kasus = PACK.kasus.lab_furunkel_hidung!
    expect(kasus.harusDirujuk).toBe(false)
    expect(kasus.tatalaksana.prosedur).toEqual(['kompres_hangat_furunkel_hidung'])
    expect(kasus.clue).toMatch(/lesi kecil, lokal, belum fluktuatif/i)
    expect(kasus.clue).toMatch(/antibiotik sistemik.*dipertimbangkan/is)
    expect(kasus.mutiaraEbm).toMatch(/tidak berarti setiap pustul.*pasti menyebar/is)
    expect(kasus.catatanRealita).toMatch(/restriksi diagnosis MRSA/i)
  })
})
