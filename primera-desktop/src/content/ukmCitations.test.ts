/**
 * M11 UKM C2: integritas sitasi player-facing untuk kunjungan rumah.
 *
 * Field ini murni display. Seluruh skenario dan kartu intervensi wajib punya
 * sumber yang dapat ditelusuri, tetapi tidak boleh menggeser replay/fingerprint.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from './index'
import type { ContentPack } from './pack'
import { sidikJariPack } from '@engine/verifikasi'
import { panduanSkenarioUkm, sitasiIntervensiUkm, sumberKegiatanUkm } from './ukmCitations'

const semuaSkenario = Object.values(PACK.keluarga).flatMap((keluarga) => keluarga.arc.kunjungan)
const semuaIntervensi = semuaSkenario.flatMap((skenario) => skenario.intervensi)
const placeholder = /\b(?:todo|tbd|placeholder|perlu sumber|belum ada sumber)\b/i
const dokumenTerlacak = /(?:Permenkes|KMK|Kementerian Kesehatan|BPJS Kesehatan|WHO).*(?:19|20)\d{2}/i

describe('M11 UKM C2 - cakupan sitasi kunjungan rumah', () => {
  it('mengunci inventaris 27 skenario dan 89 kartu intervensi', () => {
    expect(semuaSkenario).toHaveLength(27)
    expect(semuaIntervensi).toHaveLength(89)
  })

  it('setiap skenario punya panduan resmi yang nyata dan terlacak', () => {
    for (const skenario of semuaSkenario) {
      const panduan = panduanSkenarioUkm(skenario)
      expect(panduan, skenario.id).toBeTruthy()
      expect(panduan, skenario.id).not.toMatch(placeholder)
      expect(panduan, skenario.id).toMatch(dokumenTerlacak)
    }
  })

  it('setiap kartu intervensi punya landasan sumber dan padanan Pinkesga', () => {
    for (const skenario of semuaSkenario) {
      for (const kartu of skenario.intervensi) {
        const sitasi = sitasiIntervensiUkm(skenario, kartu)
        expect(sitasi.sumber, kartu.id).toBeTruthy()
        expect(sitasi.sumber, kartu.id).not.toMatch(placeholder)
        expect(sitasi.sumber, kartu.id).toMatch(dokumenTerlacak)
        expect(sitasi.pinkesga, kartu.id).toMatch(/^Pinkesga /)
      }
    }
  })

  it('kunci komposit mencegah collision id lokal antar-skenario', () => {
    const ketut = semuaSkenario.find((skenario) => skenario.id === 'ketut_k1')!
    const karsa = semuaSkenario.find((skenario) => skenario.id === 'karsa_k1')!
    const kartuKetut = ketut.intervensi.find((kartu) => kartu.id === 'kk1_i2')!
    const kartuKarsa = karsa.intervensi.find((kartu) => kartu.id === 'kk1_i2')!

    expect(sitasiIntervensiUkm(ketut, kartuKetut).sumber).toMatch(/Posyandu/i)
    expect(sitasiIntervensiUkm(karsa, kartuKarsa).sumber).not.toMatch(/Posyandu/i)
    expect(sitasiIntervensiUkm(karsa, kartuKarsa).pinkesga).toBe('Pinkesga Keluarga Berencana (KB)')
  })

  it('registry display-only tidak memutasi pack atau sidik jarinya', () => {
    const sebelum = sidikJariPack(PACK)
    for (const skenario of semuaSkenario) {
      panduanSkenarioUkm(skenario)
      for (const kartu of skenario.intervensi) sitasiIntervensiUkm(skenario, kartu)
    }
    expect(sidikJariPack(PACK)).toBe(sebelum)
  })

  it('mengunci alasan registry: injeksi inline ke arc saat ini memang menggeser hash', () => {
    const [keluargaId, keluarga] = Object.entries(PACK.keluarga)[0]!
    const skenarioPertama = keluarga.arc.kunjungan[0]!
    const packInline: ContentPack = {
      ...PACK,
      keluarga: {
        ...PACK.keluarga,
        [keluargaId]: {
          ...keluarga,
          arc: {
            ...keluarga.arc,
            kunjungan: [
              { ...skenarioPertama, panduanResmi: panduanSkenarioUkm(skenarioPertama) },
              ...keluarga.arc.kunjungan.slice(1),
            ],
          },
        },
      },
    }
    expect(sidikJariPack(packInline)).not.toBe(sidikJariPack(PACK))
  })

  it('memetakan seluruh keluarga kartu kegiatan tanpa bergantung pada engine beku', () => {
    expect(sumberKegiatanUkm({ id: 'posy_timbang' }, 'posyandu')).toMatch(/Kementerian Kesehatan RI.*2023/i)
    expect(sumberKegiatanUkm({ id: 'prol_peserta_uji' }, 'prolanis')).toMatch(/BPJS Kesehatan.*2014-2019/i)
    expect(sumberKegiatanUkm({ id: 'klb_5w1h' }, 'klb')).toMatch(/Permenkes RI No\. 19 Tahun 2024/i)
    expect(sumberKegiatanUkm({ id: 'kartu_lain' })).toBeUndefined()
  })
})
