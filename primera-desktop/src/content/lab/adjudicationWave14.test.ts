import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { EBM_GUIDELINE_CROSSWALK } from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const IDS = [
  'lab_gonore_uretritis_pria',
  'lab_sindrom_duh_genital_servisitis',
  'lab_salpingitis_pid_ringan',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 14: episode IMS klinik-pasangan-wilayah', () => {
  it('memberi provenance langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(EBM_GUIDELINE_CROSSWALK[id]?.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(71)
  })

  it('menjaga kode katalog sambil memperjelas fenotipe klinis', () => {
    const gonore = PACK.kasus.lab_gonore_uretritis_pria!
    const servisitis = PACK.kasus.lab_sindrom_duh_genital_servisitis!
    const pid = PACK.kasus.lab_salpingitis_pid_ringan!
    expect(gonore).toMatchObject({ icd10: 'A54.9', nama: expect.stringMatching(/uretra tanpa komplikasi/i) })
    expect(servisitis).toMatchObject({ icd10: 'N89', nama: expect.stringMatching(/servisitis mukopurulen/i) })
    expect(pid).toMatchObject({ icd10: 'N70', nama: expect.stringMatching(/radang panggul ringan/i) })
    expect(gonore.catatanRealita).toMatch(/konkordan.*katalog SKDI-144/i)
    expect(servisitis.catatanRealita).toMatch(/konkordan.*katalog SKDI-144/i)
    expect(pid.catatanRealita).toMatch(/konkordan.*katalog SKDI-144/i)
  })

  it('mengunci regimen dan tindak lanjut gonore terkini', () => {
    const kasus = PACK.kasus.lab_gonore_uretritis_pria!
    expect(kasus.anamnesis).toContainEqual(expect.objectContaining({
      id: 'q_lokasi_pajanan',
      esensial: true,
    }))
    expect(kasus.lab.map((item) => item.id)).toEqual(['tes_hiv_serial', 'tes_sifilis'])
    expect(kasus.tatalaksana.obatBenar).toEqual(['ceftriaxone_1g_inj', 'doksisiklin_100'])
    expect(kasus.clue).toMatch(/ceftriaxone 1 g IM.*doxycycline 100 mg.*tujuh hari/is)
    expect(kasus.clue).toMatch(/retest sekitar tiga bulan/i)
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['tindak_lanjut_gonore', 'layanan_pasangan_ims'])
  })

  it('membuat terapi presumtif servisitis bergantung risiko dan akses follow-up', () => {
    const kasus = PACK.kasus.lab_sindrom_duh_genital_servisitis!
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_pid', esensial: true }),
      expect.objectContaining({ id: 'q_hamil', esensial: true }),
      expect.objectContaining({ id: 'q_alergi', esensial: true }),
    ]))
    expect(kasus.lab.map((item) => item.id)).toEqual(['tes_kehamilan', 'tes_hiv_serial', 'tes_sifilis'])
    expect(kasus.clue).toMatch(/pasangan baru.*NAAT tidak tersedia.*tindak lanjut belum pasti/is)
    expect(kasus.clue).toMatch(/bukan vaginitis atau PID/i)
    expect(kasus.panduanResmi).toMatch(/PPK.*tidak mempunyai bab servisitis langsung/i)
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['tindak_lanjut_servisitis', 'layanan_pasangan_ims'])
  })

  it('membuat PID rawat jalan sebagai episode 14 hari dengan safety-net 72 jam', () => {
    const kasus = PACK.kasus.lab_salpingitis_pid_ringan!
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_berat', esensial: true }),
      expect.objectContaining({ id: 'q_hamil', esensial: true }),
      expect.objectContaining({ id: 'q_alergi', esensial: true }),
    ]))
    expect(kasus.tatalaksana.obatBenar).toEqual(['ceftriaxone_1g_inj', 'doksisiklin_100', 'metronidazol_500'])
    expect(kasus.clue).toMatch(/selama 14 hari/i)
    expect(kasus.clue).toMatch(/kurang dari 72 jam.*rawat inap/is)
    expect(kasus.catatanRealita).toMatch(/pemilihan vial tidak berarti seluruh isi/i)
    expect(kasus.konsekuensi?.kondisiKembali).toMatch(/lebih dari 72 jam.*rujukan rumah sakit kini wajib/i)
  })

  it('menutup bridge pasien-pasangan-surveilans tanpa identitas atau kepastian palsu', () => {
    const gonore = PACK.kasus.lab_gonore_uretritis_pria!
    const servisitis = PACK.kasus.lab_sindrom_duh_genital_servisitis!
    expect(gonore.ambangKluster).toBe(3)
    expect(servisitis.ambangKluster).toBe(3)
    expect(PACK.edukasi.layanan_pasangan_ims?.nama).toMatch(/sukarela.*rahasia.*kekerasan/i)
    expect(PACK.edukasi.pencegahan_ims_terintegrasi?.nama).toMatch(/HIV-sifilis.*PrEP/i)
    expect(gonore.catatanRealita).toMatch(/telaah agregat.*tanpa membuka identitas atau membuktikan wabah/is)
    expect(servisitis.catatanRealita).toMatch(/agregat terde-identifikasi.*ditelaah program/i)
    expect(PACK.kasus.lab_salpingitis_pid_ringan?.konsekuensi?.narasi).toMatch(/probabilistik/i)
  })
})
