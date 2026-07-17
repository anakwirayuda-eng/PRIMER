import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { Rng } from './core/rng'
import { kartuKlb, polaKlbDariKasus } from './kegiatan'

const AKSI_DIHARAPKAN: Record<string, RegExp> = {
  demam_tifoid: /air aman|sanitasi|higiene pangan/i,
  dengue_df: /3m|sarang|vektor/i,
  diare_akut_anak: /air aman|sanitasi|ctps/i,
  ispa_common_cold: /etika batuk|masker/i,
  konjungtivitis_bakterial: /higiene tangan|handuk|barang pribadi/i,
  lab_cacing_tambang: /alas kaki|sanitasi|obat cacing/i,
  lab_gonore_uretritis_pria: /pasangan seksual|kondom/i,
  lab_hepatitis_a_akut: /air aman|sanitasi|higiene pangan/i,
  lab_influenza_tanpa_komplikasi: /influenza|vaksinasi|kelompok risiko/i,
  lab_keracunan_makanan_ringan: /hentikan|tarik|pangan/i,
  lab_kusta_pausibasiler: /skrining kontak|mdt|rifampisin/i,
  lab_leptospirosis_tanpa_komplikasi: /air banjir|rodensia|sepatu bot/i,
  lab_parotitis_mumps: /5 hari|mmr|parotitis/i,
  lab_pertusis_remaja: /profilaksis|kontak serumah|bayi/i,
  lab_pneumonia_komunitas_dewasa: /etika batuk|ventilasi|penemuan kasus/i,
  lab_sifilis_primer: /pasangan seksual|kondom/i,
  lab_sindrom_duh_genital_servisitis: /pasangan seksual|kondom/i,
  lab_skistosomiasis_sulteng: /praziquantel|air tawar|keong/i,
  lab_tinea_kapitis_anak: /sisir|topi|barang pribadi/i,
  pneumonia_balita: /etika batuk|ventilasi|penemuan kasus/i,
  skabies: /kontak serumah|anggota rumah|serentak/i,
  tb_paru: /investigasi kontak|tpt|ventilasi/i,
}

describe('P0-B — aksi KLB mengikuti rute dan sumber penularan', () => {
  const kasusKluster = Object.values(PACK.kasus)
    .filter((kasus) => kasus.ambangKluster !== undefined)
    .sort((a, b) => a.id.localeCompare(b.id))

  it('inventaris uji menutup tepat seluruh kasus yang dapat membentuk kluster', () => {
    expect(Object.keys(AKSI_DIHARAPKAN).sort()).toEqual(kasusKluster.map((kasus) => kasus.id))
    expect(kasusKluster.map((kasus) => polaKlbDariKasus(kasus.id))).not.toContain('belum_dipetakan')
  })

  for (const kasus of kasusKluster) {
    it(`${kasus.id}: aksi benar relevan terhadap transmisi`, () => {
      const aksi = kartuKlb(kasus.id, kasus.nama, 'RW Uji', new Rng(17, 'p0b'))
        .find((kartu) => kartu.id === 'klb_aksi')!
        .pilihan.find((pilihan) => pilihan.benar)!
      expect(aksi.label).toMatch(AKSI_DIHARAPKAN[kasus.id]!)
    })
  }
})
