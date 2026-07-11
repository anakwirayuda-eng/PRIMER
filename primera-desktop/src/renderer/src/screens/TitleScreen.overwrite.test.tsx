/**
 * TEST KOMPONEN — konfirmasi sebelum menimpa arsip (CODEX audit UI/UX
 * 2026-07-10, #3). Sebelum fix: mulai stase baru & impor JSON menimpa arsip
 * lama tanpa jeda sama sekali — salah klik/Enter cukup utk menghapus progres.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { TitleScreen } from './TitleScreen'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'

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
  vi.restoreAllMocks()
})

describe('<TitleScreen /> — konfirmasi timpa arsip saat mulai stase baru', () => {
  it('arsip ADA + user BATAL konfirmasi → mulaiGameBaru TIDAK terpanggil (arsip tetap utuh)', async () => {
    pasangPrimerStub()
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    useGame.setState({ arsip: arsipLama, state: null, slots: [], meta: null, sedangMemuat: false })
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tulis namamu di sini'), 'Dokter Baru')
    await user.click(screen.getByRole('button', { name: 'Mulai Stase' }))

    expect(window.confirm).toHaveBeenCalled()
    expect(useGame.getState().state).toBeNull() // game baru TIDAK dimulai
    expect(useGame.getState().arsip).toBe(arsipLama) // arsip lama tetap ada
  })

  it('arsip ADA + user SETUJU konfirmasi → mulaiGameBaru terpanggil (stase baru dimulai)', async () => {
    pasangPrimerStub()
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    useGame.setState({ arsip: arsipLama, state: null, slots: [], meta: null, sedangMemuat: false })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tulis namamu di sini'), 'Dokter Baru')
    await user.click(screen.getByRole('button', { name: 'Mulai Stase' }))

    expect(window.confirm).toHaveBeenCalled()
    expect(useGame.getState().state?.namaDokter).toBe('Dokter Baru')
  })

  it('TANPA arsip aktif → mulai stase baru TIDAK meminta konfirmasi (bukan gangguan gratis)', async () => {
    pasangPrimerStub()
    useGame.setState({ arsip: null, state: null, slots: [], meta: null, sedangMemuat: false })
    const confirmSpy = vi.spyOn(window, 'confirm')
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tulis namamu di sini'), 'Dokter Pertama')
    await user.click(screen.getByRole('button', { name: 'Mulai Stase' }))

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(useGame.getState().state?.namaDokter).toBe('Dokter Pertama')
  })
})

describe('<TitleScreen /> — konfirmasi timpa arsip saat MUAT SLOT (CODEX M14 #4)', () => {
  it('arsip ADA + BATAL konfirmasi → slot TIDAK dibaca (arsip utuh)', async () => {
    pasangPrimerStub()
    const bacaSlot = vi.fn(async () => null)
    window.primer.save.read = bacaSlot
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    useGame.setState({
      arsip: arsipLama, state: null, meta: null, sedangMemuat: false,
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Slot', hari: 5, mode: 'karier', tamat: false }],
    })
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Slot 1/ }))

    expect(window.confirm).toHaveBeenCalled()
    expect(bacaSlot).not.toHaveBeenCalled() // muat dibatalkan sebelum baca
    expect(useGame.getState().arsip).toBe(arsipLama)
  })

  it('TANPA arsip → muat slot langsung (tanpa konfirmasi gratis)', async () => {
    pasangPrimerStub()
    const bacaSlot = vi.fn(async () => null)
    window.primer.save.read = bacaSlot
    useGame.setState({
      arsip: null, state: null, meta: null, sedangMemuat: false,
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Slot', hari: 5, mode: 'karier', tamat: false }],
    })
    const confirmSpy = vi.spyOn(window, 'confirm')
    render(<TitleScreen />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Slot 1/ }))

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(bacaSlot).toHaveBeenCalledWith('slot1') // langsung mencoba muat
  })
})

describe('<TitleScreen /> — konfirmasi timpa arsip saat impor JSON', () => {
  it('arsip ADA + user BATAL konfirmasi → imporArsip TIDAK terpanggil (arsip tetap utuh)', async () => {
    pasangPrimerStub()
    const arsipLama = buildInitialState('Dr. Lama', 1, PACK)
    const arsipBaru = buildInitialState('Dr. Impor', 2, PACK)
    useGame.setState({ arsip: arsipLama, state: null, slots: [], meta: null, sedangMemuat: false })
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<TitleScreen />)
    const user = userEvent.setup()

    const { serialize } = await import('@engine/save')
    const file = new File([serialize(arsipBaru)], 'arsip.json', { type: 'application/json' })
    const input = screen.getByLabelText(/Impor arsip JSON/) as HTMLInputElement
    await user.upload(input, file)

    expect(window.confirm).toHaveBeenCalled()
    expect(useGame.getState().state).toBeNull()
    expect(useGame.getState().arsip).toBe(arsipLama)
  })
})
