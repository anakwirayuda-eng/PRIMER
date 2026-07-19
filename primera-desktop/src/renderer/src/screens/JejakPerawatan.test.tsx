import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CareEpisodeLite } from '@engine/state'
import { JejakPerawatan } from './JejakPerawatan'

function episode(override: Partial<CareEpisodeLite> = {}): CareEpisodeLite {
  return {
    id: 'episode_wulan_ht',
    subjectId: 'wulan',
    subjectName: 'Ibu Wulan',
    familyId: 'keluarga_wulan',
    rw: 2,
    source: 'keluarga',
    problemId: 'ht',
    problemLabel: 'Hipertensi belum terkontrol',
    owner: 'dokter',
    status: 'menunggu',
    openedDay: 2,
    updatedDay: 5,
    dueDay: 6,
    nextAction: 'Kontrol di poli FKTP.',
    receipt: {
      signal: 'Kader menemukan tekanan darah tinggi.',
      decision: 'Kontrol klinik dijadwalkan.',
      next: 'Kontrol di poli FKTP.',
    },
    history: [
      { hari: 2, status: 'terdeteksi', label: 'Sinyal masuk', detail: 'Laporan kader diterima.' },
      { hari: 5, status: 'menunggu', label: 'Kontrol dijadwalkan', detail: 'Menunggu kunjungan poli.' },
    ],
    ...override,
  }
}

describe('<JejakPerawatan />', () => {
  it('menampilkan overdue, receipt kausal, progres, riwayat, dan navigasi keluarga', async () => {
    const onBukaKeluarga = vi.fn()
    const user = userEvent.setup()
    render(
      <JejakPerawatan
        episodes={[episode()]}
        hari={9}
        petaTerbuka
        onBukaKeluarga={onBukaKeluarga}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Buka Jejak Perawatan/i }))
    expect(screen.getByRole('dialog', { name: /Jejak Perawatan lintas UKM dan UKP/i })).toBeInTheDocument()
    expect(screen.getByText('Hipertensi belum terkontrol')).toBeInTheDocument()
    expect(screen.getByText('Lewat jatuh tempo')).toBeInTheDocument()
    expect(screen.getByText('Kader menemukan tekanan darah tinggi.')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')

    await user.click(screen.getByText(/Riwayat 2 peristiwa/i))
    expect(screen.getByText('Kontrol dijadwalkan')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Buka keluarga terkait' }))
    expect(onBukaKeluarga).toHaveBeenCalledWith('keluarga_wulan')
  })

  it('memisahkan episode aktif, loop tertutup, dan hasil buruk tanpa menyamarkan outcome', async () => {
    const user = userEvent.setup()
    render(
      <JejakPerawatan
        episodes={[
          episode(),
          episode({ id: 'episode_tutup', subjectName: 'Pak Tuntas', status: 'terverifikasi', dueDay: undefined }),
          episode({ id: 'episode_buruk', subjectName: 'Pak Buruk', status: 'berakhir', dueDay: undefined }),
        ]}
        hari={9}
        petaTerbuka={false}
        onBukaKeluarga={() => undefined}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Buka Jejak Perawatan/i }))
    expect(screen.getByText('Ibu Wulan')).toBeInTheDocument()
    expect(screen.queryByText('Pak Tuntas')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Selesai' }))
    expect(screen.getByText('Pak Tuntas')).toBeInTheDocument()
    expect(screen.getByText('Pak Buruk')).toBeInTheDocument()
    expect(screen.getAllByText('Tindak lanjut tuntas')).toHaveLength(2)
    expect(screen.getByText('Berakhir tanpa pemulihan')).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Semua' })).toHaveAttribute('aria-selected', 'true')
  })
})
