import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { panduanSkenarioUkm } from '@content/ukmCitations'
import type { HasilKunjungan } from '@engine/state'
import { useGame } from '../store'
import { PetaDesa } from './PetaDesa'

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

    expect(await screen.findByText(panduanSkenarioUkm(skenario))).toBeInTheDocument()
  })
})
