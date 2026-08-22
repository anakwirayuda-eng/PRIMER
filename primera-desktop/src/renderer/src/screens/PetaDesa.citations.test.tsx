import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { panduanSkenarioUkm, sitasiIntervensiUkm, tautanPanduanSkenarioUkm } from '@content/ukmCitations'
import { kartuIntervensiBenar } from '@content/ukmEvidence'
import type { HasilKunjungan } from '@engine/state'
import { useGame } from '../store'
import { PetaDesa } from './PetaDesa'

const KELUARGA_UJI = PACK.keluarga['keluarga_wulan']!
const SKENARIO_UJI = KELUARGA_UJI.arc.kunjungan.find((item) => item.id === 'wulan_k1')!
/** Kartu yang cocok dengan `hambatanSebenarnya` — kunci jawaban skenario ini. */
const KARTU_BENAR = SKENARIO_UJI.intervensi.find((kartu) =>
  kartuIntervensiBenar(SKENARIO_UJI, kartu),
)!
const BUKTI_KARTU_BENAR = sitasiIntervensiUkm(SKENARIO_UJI, KARTU_BENAR, 'pasca_penilaian')

function hasilUji(patch: Partial<HasilKunjungan>): HasilKunjungan {
  return {
    keluargaId: KELUARGA_UJI.id,
    skenarioId: SKENARIO_UJI.id,
    hasilAkhir: 'berhasil',
    berhasil: true,
    diusir: false,
    hipotesisBenar: true,
    trustDelta: 2,
    kualitasMi: 100,
    kualitasSaji: 100,
    indikatorTerverifikasi: ['hipertensi_berobat'],
    narasiPenutup: SKENARIO_UJI.penutupBerhasil,
    ...patch,
  }
}

describe('<PetaDesa /> - debrief sitasi kunjungan C2', () => {
  it('hasil kunjungan menampilkan panduan resmi skenario yang selesai', async () => {
    const keluarga = PACK.keluarga['keluarga_wulan']!
    const skenario = keluarga.arc.kunjungan.find((item) => item.id === 'wulan_k1')!
    const hasil: HasilKunjungan = {
      keluargaId: keluarga.id,
      skenarioId: skenario.id,
      hasilAkhir: 'berhasil',
      berhasil: true,
      diusir: false,
      hipotesisBenar: true,
      trustDelta: 2,
      kualitasMi: 100,
      kualitasSaji: 100,
      indikatorTerverifikasi: ['hipertensi_berobat'],
      narasiPenutup: skenario.penutupBerhasil,
    }
    const state = { ...buildInitialState('Uji Sitasi', 1, PACK), layar: 'peta' as const }
    useGame.setState({ state, lastEvents: [{ type: 'KUNJUNGAN_SELESAI', hasil }], eventTick: 991 })

    render(<PetaDesa />)

    // panduanSkenarioUkm kini multi-paragraf (\n\n, dirender white-space:
    // pre-line) — testing-library meratakan whitespace DOM, jadi kedua sisi
    // dinormalkan dgn cara yang sama sebelum dibandingkan utuh.
    const rata = (t: string) => t.replace(/\s+/g, ' ').trim()
    const panduanUtuh = rata(panduanSkenarioUkm(skenario))
    expect(
      await screen.findByText((_, el) => el?.tagName === 'P' && rata(el.textContent ?? '') === panduanUtuh),
    ).toBeInTheDocument()
    const tautan = tautanPanduanSkenarioUkm(skenario)
    for (const sumber of tautan) {
      expect(screen.getByRole('link', { name: new RegExp(sumber.label) })).toHaveAttribute('href', sumber.url)
    }
  })

  it('hasil berhasil membuka bukti kartu yang tepat — skenarionya tak akan diulang', async () => {
    const hasil = hasilUji({ hasilAkhir: 'berhasil', berhasil: true })
    const state = { ...buildInitialState('Uji Bukti Berhasil', 5, PACK), layar: 'peta' as const }
    useGame.setState({ state, lastEvents: [{ type: 'KUNJUNGAN_SELESAI', hasil }], eventTick: 994 })

    render(<PetaDesa />)

    expect(await screen.findByText('Bukti resep sosial')).toBeInTheDocument()
    expect(screen.getByText(BUKTI_KARTU_BENAR.sumber)).toBeInTheDocument()
  })

  it('target dari surat membuka RW dan menandai keluarga yang tepat', async () => {
    const keluarga = PACK.keluarga['keluarga_wulan']!
    const rw = PACK.rw.find((item) => item.nomor === keluarga.rw)!
    const state = { ...buildInitialState('Uji Tautan Surat', 2, PACK), layar: 'peta' as const }
    useGame.setState({
      state,
      lastEvents: [],
      eventTick: 0,
      petaTargetKeluargaId: keluarga.id,
    })

    render(<PetaDesa />)

    expect(await screen.findByText(`RW ${rw.nomor} — ${rw.nama}`)).toBeInTheDocument()
    expect(screen.getByText('DARI SURAT')).toBeInTheDocument()
    expect(useGame.getState().petaTargetKeluargaId).toBeNull()
  })
})

/**
 * Audit UKM 2026-08-22 (P2): modal hasil kunjungan mencari kartu intervensi
 * yang BENAR dari `hambatanSebenarnya` lalu merender buktinya pada SEMUA hasil.
 * Arc kunjungan hanya maju bila `hasil.berhasil` (kunjungan.ts), jadi pemain
 * yang gagal mengulang skenario yang sama persis — dengan kunci jawaban sudah
 * di tangan. Sekarang buktinya ditahan selama skenarionya masih akan diulang.
 */
describe('<PetaDesa /> — bukti kartu benar tak bocor ke kunjungan yang akan diulang', () => {
  const akanDiulang: HasilKunjungan['hasilAkhir'][] = ['gagal', 'partial', 'diusir', 'ditolak_total']

  for (const hasilAkhir of akanDiulang) {
    it(`hasil '${hasilAkhir}' menahan bukti resep sosial dan nama kartu yang benar`, async () => {
      const hasil = hasilUji({
        hasilAkhir,
        berhasil: false,
        hipotesisBenar: false,
        indikatorTerverifikasi: [],
        narasiPenutup: SKENARIO_UJI.penutupGagal,
        ...(hasilAkhir === 'ditolak_total' ? { ulangDalamHari: 3 } : {}),
      })
      const state = { ...buildInitialState('Uji Anti Bocor', 3, PACK), layar: 'peta' as const }
      useGame.setState({ state, lastEvents: [{ type: 'KUNJUNGAN_SELESAI', hasil }], eventTick: 992 })

      render(<PetaDesa />)

      const modal = await screen.findByRole('dialog', { name: 'Hasil kunjungan' })
      expect(screen.queryByText('Bukti resep sosial')).not.toBeInTheDocument()
      expect(screen.queryByText(BUKTI_KARTU_BENAR.sumber)).not.toBeInTheDocument()
      expect(modal.textContent).not.toContain(KARTU_BENAR.nama)
    })
  }

  it('yang gagal tetap mendapat arahan belajar, bukan layar kosong', async () => {
    const hasil = hasilUji({
      hasilAkhir: 'gagal',
      berhasil: false,
      hipotesisBenar: false,
      indikatorTerverifikasi: [],
      narasiPenutup: SKENARIO_UJI.penutupGagal,
    })
    const state = { ...buildInitialState('Uji Umpan Balik', 4, PACK), layar: 'peta' as const }
    useGame.setState({ state, lastEvents: [{ type: 'KUNJUNGAN_SELESAI', hasil }], eventTick: 993 })

    render(<PetaDesa />)

    // LANDASAN RESMI (konteks masalah, bukan kunci) tetap berdiri…
    expect(await screen.findByText('LANDASAN RESMI')).toBeInTheDocument()
    // …ditemani penjelasan mengapa buktinya ditahan.
    expect(screen.getByText(/belum dibuka/)).toBeInTheDocument()
  })
})
