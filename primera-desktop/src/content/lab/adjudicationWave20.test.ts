import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function labs(caseId: string): string[] {
  const kasus = PACK.kasus[caseId]
  if (!kasus) throw new Error(`Kasus '${caseId}' hilang`)
  return kasus.lab.map((item) => item.id)
}

describe('M13-137 adjudication wave 20: first-contact tanpa over-testing', () => {
  it('tidak menggantungkan keputusan akut pada lab atau imaging jejaring', () => {
    expect(labs('lab_pneumonia_komunitas_dewasa')).toEqual([])
    expect(labs('lab_pielonefritis_tanpa_komplikasi')).toEqual(['urinalisis', 'tes_kehamilan'])
    expect(labs('lab_penyakit_radang_panggul_berat')).toEqual([
      'tes_kehamilan',
      'tes_hiv_serial',
      'tes_sifilis',
    ])
    expect(labs('lab_mola_hidatidosa')).not.toContain('usg_obstetri')
    expect(labs('lab_hiperemesis_gravidarum_berat')).toEqual(['urinalisis', 'tes_kehamilan'])
    expect(labs('lab_fraktur_tertutup_antebrachii_anak')).toEqual([])
    expect(labs('lab_gizi_buruk_komplikasi')).toEqual(['gds', 'hb'])
  })

  it('membuat kasus bedah dapat distabilisasi dan dirujuk secara klinis', () => {
    expect(labs('lab_hernia_inguinalis_inkarserata')).toEqual([])
    expect(labs('lab_kolesistitis_akut')).toEqual([])
    expect(labs('lab_peritonitis_generalisata')).toEqual([])
    expect(labs('lab_kolik_ureter_obstruksi')).toEqual(['urinalisis'])
    expect(labs('lab_abses_perianal')).toEqual(['gds'])

    const kolik = PACK.kasus.lab_kolik_ureter_obstruksi!
    expect(kolik.nama).toMatch(/Suspek Batu Obstruktif/i)
    expect(kolik.tatalaksana.obatBenar).not.toContain('tamsulosin_04')
    expect(kolik.clue).toMatch(/ukuran\/lokasi belum diketahui|imaging/i)
    expect(kolik.panduanResmi).toMatch(/PPK.*tidak mempunyai.*PNPK/is)
  })

  it('menghindari diuretik buta pada sirosis dengan ensefalopati overt', () => {
    const kasus = PACK.kasus.lab_sirosis_hepatis_dekompensata!
    expect(labs(kasus.id)).toEqual(['hbsag'])
    expect(kasus.tatalaksana.obatBenar).toEqual(['laktulosa_syr'])
    expect(kasus.tatalaksana.obatOpsional ?? []).not.toContain('furosemid_40')
    expect(kasus.tatalaksana.obatSalahUmum).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'spironolakton_25' }),
      expect.objectContaining({ id: 'furosemid_40' }),
    ]))
    expect(kasus.clue).toMatch(/jangan memulai spironolakton.*secara buta/is)
    const record = DATA.cases.find((item) => item.id === kasus.id)
    expect(record?.evidence.ebm.status).toBe('cocok')
    expect(record?.evidence.ebm.sources.map((source) => source.sourceId)).toEqual(
      expect.arrayContaining(['easl-decompensated-cirrhosis-2018', 'aasld-ascites-2021']),
    )
  })

  it('menjaga hasil jejaring sebagai hasil jejaring, bukan kapabilitas onsite', () => {
    const kasus = PACK.kasus.lab_talasemia_beta_mayor_anak!
    expect(labs(kasus.id)).toEqual(['hb', 'darah_rutin', 'ferritin_serum', 'hitung_retikulosit'])
    for (const id of ['darah_rutin', 'ferritin_serum', 'hitung_retikulosit']) {
      expect(kasus.lab.find((item) => item.id === id)?.hasil, id).toMatch(/hasil jejaring/i)
    }
    expect(kasus.clue).toMatch(/tidak mengunci etiologi sendiri/i)
    expect(kasus.clue).not.toMatch(/orang tua pasti pembawa/i)
  })

  it('menghapus pemeriksaan yang tidak mengubah disposisi respirasi, kaki diabetik, dan TIA', () => {
    expect(labs('lab_kaki_diabetik_infeksi')).toEqual(['gds'])
    expect(labs('lab_ppok_eksaserbasi_berat')).toEqual([])
    expect(labs('lab_tia_serangan_iskemik_sesaat')).toEqual(['ekg', 'gds'])
  })

  it('menutup tiga atribusi PPK palsu tanpa kehilangan PNPK langsung', () => {
    for (const id of [
      'lab_talasemia_beta_mayor_anak',
      'lab_kolik_ureter_obstruksi',
      'lab_sirosis_hepatis_dekompensata',
    ]) {
      const record = DATA.cases.find((item) => item.id === id)
      expect(record?.compiler.sourceAttributionWarning, id).toBe(false)
      expect(record?.evidence.pnpk.status, id).toBe('cocok')
      expect(PACK.kasus[id]?.panduanResmi, id).toMatch(/PPK.*tidak mempunyai/is)
    }
  })
})
