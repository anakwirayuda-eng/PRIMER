/**
 * TEST KOMPONEN — konfirmasi sebelum menimpa arsip (CODEX audit UI/UX
 * 2026-07-10, #3). Sebelum fix: mulai stase baru & impor JSON menimpa arsip
 * lama tanpa jeda sama sekali — salah klik/Enter cukup utk menghapus progres.
 * Audit premium 2026-07-23: window.confirm diganti DialogGame in-game —
 * kontrak SAMA (batal = tak ada efek, setuju = aksi jalan, tanpa-arsip =
 * tanpa gangguan), hanya medianya kini dialog kertas dgn tombol eksplisit.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { TitleScreen } from './TitleScreen'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { LEGACY_CONTENT_RELEASE } from '@content/pack'
import { serialize } from '@engine/save'

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

afterEach(() => {
  cleanup()
})

describe('<TitleScreen /> — konfirmasi timpa arsip saat mulai stase baru', () => {
  it('arsip ADA + user BATAL di dialog → mulaiGameBaru TIDAK terpanggil (arsip tetap utuh)', async () => {
    pasangPrimerStub()
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    useGame.setState({ arsip: arsipLama, state: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tulis namamu di sini'), 'Dokter Baru')
    await user.click(screen.getByRole('button', { name: 'Mulai Stase' }))

    // Dialog in-game muncul; batalkan.
    const dialog = screen.getByRole('dialog', { name: 'Mulai Stase Baru?' })
    expect(dialog).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Batal' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useGame.getState().state).toBeNull() // game baru TIDAK dimulai
    expect(useGame.getState().arsip).toBe(arsipLama) // arsip lama tetap ada
  })

  it('arsip ADA + user SETUJU di dialog → mulaiGameBaru terpanggil (stase baru dimulai)', async () => {
    pasangPrimerStub()
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    useGame.setState({ arsip: arsipLama, state: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tulis namamu di sini'), 'Dokter Baru')
    await user.click(screen.getByRole('button', { name: 'Mulai Stase' }))
    await user.click(screen.getByRole('button', { name: 'Mulai Stase Baru' }))

    expect(useGame.getState().state?.namaDokter).toBe('Dokter Baru')
  })

  it('TANPA arsip aktif → mulai stase baru TIDAK meminta konfirmasi (bukan gangguan gratis)', async () => {
    pasangPrimerStub()
    useGame.setState({ arsip: null, state: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tulis namamu di sini'), 'Dokter Pertama')
    await user.click(screen.getByRole('button', { name: 'Mulai Stase' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useGame.getState().state?.namaDokter).toBe('Dokter Pertama')
  })

  it('Esc pada dialog konfirmasi = batal (tak mengeksekusi aksi destruktif)', async () => {
    pasangPrimerStub()
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    useGame.setState({ arsip: arsipLama, state: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tulis namamu di sini'), 'Dokter Baru')
    await user.click(screen.getByRole('button', { name: 'Mulai Stase' }))
    expect(screen.getByRole('dialog', { name: 'Mulai Stase Baru?' })).toBeInTheDocument()
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useGame.getState().state).toBeNull()
    expect(useGame.getState().arsip).toBe(arsipLama)
  })
})

describe('<TitleScreen /> — arsip beda CONTENT_RELEASE', () => {
  it('tetap terlihat sebagai arsip tetapi tidak dapat dilanjutkan atau diimpor', () => {
    pasangPrimerStub()
    const legacy = {
      ...buildInitialState('Dr. Arsip Lama', 7, PACK),
      contentRelease: LEGACY_CONTENT_RELEASE,
    }
    useGame.setState({ arsip: legacy, state: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)

    expect(screen.queryByRole('button', { name: /Lanjutkan/ })).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/berasal dari rilis legacy-baseline/i)

    useGame.getState().lanjutkanArsip()
    expect(useGame.getState().state).toBeNull()
    expect(useGame.getState().arsip).toBe(legacy)
    expect(useGame.getState().imporArsip(serialize(legacy))).toBe(false)
    expect(useGame.getState().state).toBeNull()
  })
})

describe('<TitleScreen /> — konfirmasi timpa arsip saat MUAT SLOT (CODEX M14 #4)', () => {
  it('arsip ADA + BATAL di dialog → slot TIDAK dibaca (arsip utuh)', async () => {
    pasangPrimerStub()
    let dibaca = false
    window.primer.save.read = async () => {
      dibaca = true
      return null
    }
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    useGame.setState({
      arsip: arsipLama, state: null, meta: null, sedangMemuat: false,
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Slot', hari: 5, mode: 'karier', tamat: false, contentRelease: PACK.runtimeManifest.contentRelease, compatible: true }],
    })
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Slot 1/ }))
    expect(screen.getByRole('dialog', { name: 'Muat Slot 1?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Batal' }))

    expect(dibaca).toBe(false) // muat dibatalkan sebelum baca
    expect(useGame.getState().arsip).toBe(arsipLama)
  })

  it('TANPA arsip → muat slot langsung (tanpa konfirmasi gratis)', async () => {
    pasangPrimerStub()
    let slotDibaca: string | null = null
    window.primer.save.read = async (slot: string) => {
      slotDibaca = slot
      return null
    }
    useGame.setState({
      arsip: null, state: null, meta: null, sedangMemuat: false,
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Slot', hari: 5, mode: 'karier', tamat: false, contentRelease: PACK.runtimeManifest.contentRelease, compatible: true }],
    })
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Slot 1/ }))

    expect(screen.queryByRole('dialog', { name: /Muat/ })).not.toBeInTheDocument()
    expect(slotDibaca).toBe('slot1') // langsung mencoba muat
  })
})

describe('<TitleScreen /> — konfirmasi timpa arsip saat impor JSON', () => {
  it('arsip ADA + user BATAL di dialog → imporArsip TIDAK terpanggil (arsip tetap utuh)', async () => {
    pasangPrimerStub()
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    const arsipBaru = buildInitialState('Dr. Impor', 2, PACK)
    useGame.setState({ arsip: arsipLama, state: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)
    const user = userEvent.setup()

    const { serialize } = await import('@engine/save')
    const file = new File([serialize(arsipBaru)], 'arsip.json', { type: 'application/json' })
    const input = screen.getByLabelText(/Impor arsip JSON/) as HTMLInputElement
    await user.upload(input, file)

    expect(screen.getByRole('dialog', { name: 'Impor Arsip?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Batal' }))

    expect(useGame.getState().state).toBeNull()
    expect(useGame.getState().arsip).toBe(arsipLama)
  })
})
