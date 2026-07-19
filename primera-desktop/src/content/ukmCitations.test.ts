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
import { EVIDENCE_INTERVENSI_UKM, evidenceIntervensiUkm, kartuIntervensiBenar } from './ukmEvidence'

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

  it('setiap kartu intervensi punya konteks netral pra-penilaian dan padanan Pinkesga', () => {
    for (const skenario of semuaSkenario) {
      for (const kartu of skenario.intervensi) {
        const sitasi = sitasiIntervensiUkm(skenario, kartu)
        expect(sitasi.sumber, kartu.id).toBeTruthy()
        expect(sitasi.sumber, kartu.id).not.toMatch(placeholder)
        expect(sitasi.sumber, kartu.id).toMatch(dokumenTerlacak)
        expect(sitasi.pinkesga, kartu.id).toMatch(/^Pinkesga /)
        expect(sitasi.tingkatDukungan, kartu.id).toBe('konteks_domain')
        expect(sitasi.labelDukungan, kartu.id).toMatch(/bukan kunci jawaban/i)
      }
    }
  })

  it('27 skenario masing-masing punya tepat satu kartu benar dan binding evidence spesifik', () => {
    expect(EVIDENCE_INTERVENSI_UKM).toHaveLength(27)
    expect(new Set(EVIDENCE_INTERVENSI_UKM.map((item) => `${item.skenarioId}:${item.kartuId}`)).size).toBe(27)
    for (const skenario of semuaSkenario) {
      const benar = skenario.intervensi.filter((kartu) => kartuIntervensiBenar(skenario, kartu))
      expect(benar, skenario.id).toHaveLength(1)
      const evidence = evidenceIntervensiUkm(skenario, benar[0]!)
      expect(evidence, skenario.id).toBeDefined()
      expect(evidence?.batasan, skenario.id).toBeTruthy()
      const pasca = sitasiIntervensiUkm(skenario, benar[0]!, 'pasca_penilaian')
      expect(pasca.tingkatDukungan, skenario.id).not.toBe('konteks_domain')
      expect(pasca.sumber, skenario.id).toMatch(dokumenTerlacak)
    }
  })

  it('kunci komposit mencegah collision id lokal antar-skenario tanpa membenarkan distraktor', () => {
    const ketut = semuaSkenario.find((skenario) => skenario.id === 'ketut_k1')!
    const karsa = semuaSkenario.find((skenario) => skenario.id === 'karsa_k1')!
    const kartuKetut = ketut.intervensi.find((kartu) => kartu.id === 'kk1_i2')!
    const kartuKarsa = karsa.intervensi.find((kartu) => kartu.id === 'kk1_i2')!

    expect(sitasiIntervensiUkm(ketut, kartuKetut, 'pasca_penilaian').tingkatDukungan).toBe('konteks_domain')
    expect(sitasiIntervensiUkm(karsa, kartuKarsa, 'pasca_penilaian').tingkatDukungan).toBe('konteks_domain')
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
    expect(sumberKegiatanUkm({ id: 'posy_timbang' }, 'posyandu')).toMatch(/Kementerian Kesehatan RI.*2023.*2024.*25 keterampilan/i)
    expect(sumberKegiatanUkm({ id: 'prol_peserta_uji' }, 'prolanis')).toMatch(/BPJS Kesehatan.*2014-2019/i)
    const sumberKlb = sumberKegiatanUkm({ id: 'klb_5w1h' }, 'klb')
    expect(sumberKlb).toMatch(/Permenkes RI No\. 1 Tahun 2026/i)
    expect(sumberKlb).toMatch(/Permenkes RI No\. 19 Tahun 2024/i)
    expect(sumberKegiatanUkm({ id: 'kartu_lain' })).toBeUndefined()
  })

  it('menjaga lapisan ILP terhubung ke bukti implementasi SAJI terkini', () => {
    const panduan = panduanSkenarioUkm(semuaSkenario[0]!)
    expect(panduan).toMatch(/SAJI.*15 April 2025/is)
    expect(panduan).toMatch(/missing service.*non-compliance.*danger sign/is)
  })
})
