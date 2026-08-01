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

  it('membaca feedback RS belum menutup episode; checklist care plan menutupnya secara eksplisit', async () => {
    pasangPrimerStub()
    const awal = buildInitialState('Uji Adopsi Feedback', 707071, PACK)
    const state: GameState = {
      ...awal,
      hari: HARI_BUKA_PETA,
      blok: 'siang',
      inbox: [{
        id: 'surat_feedback_uji',
        hari: HARI_BUKA_PETA,
        jenis: 'hasil_lab',
        dari: 'RSUD Provinsi',
        judul: 'Umpan balik rujukan Bima',
        isi: 'Pelayanan selesai; lanjutkan kontrol di FKTP.',
        dibaca: false,
        kaitKeluargaId: 'keluarga_wulan',
        episodeId: 'episode_feedback_uji',
      }],
      careEpisodes: [{
        id: 'episode_feedback_uji',
        subjectId: 'bima',
        subjectName: 'Bima',
        familyId: 'keluarga_wulan',
        rw: 2,
        source: 'klinik',
        problemId: 'apendisitis',
        problemLabel: 'Apendisitis akut',
        owner: 'rs',
        status: 'kembali',
        openedDay: 1,
        updatedDay: 2,
        nextAction: 'Baca feedback RS.',
        referral: { stage: 'feedback', hospitalName: 'RSUD Provinsi' },
        receipt: { signal: 'Rujukan akut', feedback: 'Pelayanan selesai.', next: 'Adopsi care plan.' },
        history: [{ hari: 2, status: 'kembali', label: 'Feedback masuk', detail: 'Menunggu adopsi.' }],
      }],
    }
    useGame.setState({ state, petaTargetKeluargaId: null })
    render(<MejaKerja />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Umpan balik rujukan Bima/ }))
    expect(useGame.getState().state?.careEpisodes[0]?.referral?.stage).toBe('feedback')
    const terapkan = screen.getByRole('button', { name: /Terapkan ke rencana FKTP/ })
    expect(terapkan).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: /Rekonsiliasi terapi/ }))
    await user.click(screen.getByRole('checkbox', { name: /Tetapkan jadwal kontrol/ }))
    await user.click(screen.getByRole('checkbox', { name: /Hubungkan pemantauan/ }))
    expect(terapkan).toBeEnabled()
    await user.click(terapkan)

    expect(useGame.getState().state?.careEpisodes[0]?.referral?.stage).toBe('acted')
    expect(screen.getByText(/sudah masuk ke rencana perawatan FKTP/i)).toBeInTheDocument()
  })
})
