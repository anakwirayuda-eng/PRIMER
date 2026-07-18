import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildInitialState } from '@engine/init'
import { HARI_BUKA_PETA } from '@engine/reducer'
import { PACK } from '@content/index'
import type { GameState } from '@engine/state'
import { useGame } from '../store'
import { MejaKerja } from './MejaKerja'

function pasangPrimerStub() {
  window.primer = {
    save: {
      write: async () => true,
      read: async () => null,
      list: async () => [],
      delete: async () => true,
    },
    telemetri: {
      append: async () => true,
      read: async () => [],
    },
    appVersion: async () => 'test',
  }
}

describe('<MejaKerja /> — navigasi surat keluarga', () => {
  it('membawa id keluarga ke Peta Desa, bukan hanya membuka layar umum', async () => {
    pasangPrimerStub()
    const awal = buildInitialState('Uji Tautan Surat', 707070, PACK)
    const state: GameState = {
      ...awal,
      hari: HARI_BUKA_PETA,
      blok: 'siang',
      inbox: [{
        id: 'surat_uji_bridge',
        hari: HARI_BUKA_PETA,
        jenis: 'kabar_warga',
        dari: 'Perawat poli',
        judul: 'Pemulihan keluarga perlu dilanjutkan',
        isi: 'Kunjungi keluarga ini untuk menutup akar risikonya.',
        dibaca: false,
        kaitKeluargaId: 'keluarga_wulan',
      }],
    }
    useGame.setState({ state, petaTargetKeluargaId: null })
    render(<MejaKerja />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Pemulihan keluarga perlu dilanjutkan/ }))
    await user.click(screen.getByRole('button', { name: /Lihat keluarga di Peta Desa/ }))

    expect(useGame.getState().state?.layar).toBe('peta')
    expect(useGame.getState().petaTargetKeluargaId).toBe('keluarga_wulan')
  })
})
