import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildInitialState } from '@engine/init'
import type { JenisKegiatan, KartuKegiatan } from '@engine/state'
import { PACK } from '@content/index'
import { useGame } from '../store'
import { Kegiatan } from './Kegiatan'
import { deserialize } from '@engine/save'

let autosave = ''
beforeEach(() => {
  autosave = ''
  window.primer = { save: {
    write: async (slot, json) => { if (slot === 'autosave') autosave = json; return true },
    read: async () => null, list: async () => [], delete: async () => true,
  }, telemetri: { append: async () => true, read: async () => [] }, appVersion: async () => 'lab2-test' }
})

function mulai(jenis: JenisKegiatan, benar: boolean) {
  const kartu: KartuKegiatan[] = [0, 1, 2].map((i) => ({
    id: `uji_${i}`, judul: `Pertanyaan ${i + 1}`, narasi: `Situasi ${i + 1}`,
    pilihan: [
      { id: 'a', label: `Opsi A kartu ${i + 1}`, benar: i === 0 ? benar : !benar, respons: `Pembahasan A ${i + 1}` },
      { id: 'b', label: `Opsi B kartu ${i + 1}`, benar: i === 0 ? !benar : benar, respons: `Pembahasan B ${i + 1}` },
    ],
  }))
  useGame.setState({
    state: { ...buildInitialState('Lab 2', 71, PACK), hari: 40, blok: 'siang', layar: 'kegiatan',
      kegiatan: { jenis, rw: 1, kartu, index: 0, jawaban: [] } },
    lastEvents: [], eventTick: 0,
  })
}

describe('Lab 2 — pembahasan melekat pada kartu yang dijawab', () => {
  for (const jenis of ['posyandu', 'prolanis', 'klb'] as const) {
    for (const benar of [true, false]) {
      it(`${jenis}, jawaban ${benar}: simpan segera, tahan kartu sampai pemain lanjut`, async () => {
        mulai(jenis, benar)
        const user = userEvent.setup()
        const view = render(<Kegiatan />)
        await user.click(screen.getByRole('button', { name: 'Opsi A kartu 1' }))
        expect(useGame.getState().state?.kegiatan?.index).toBe(1)
        expect(useGame.getState().state?.kegiatan?.jawaban).toHaveLength(1)
        expect(deserialize(autosave)?.kegiatan?.jawaban).toHaveLength(1)
        expect(screen.getByText('Pertanyaan 1')).toBeInTheDocument()
        expect(screen.getByText('Kartu 1/3')).toBeInTheDocument()
        expect(screen.queryByText('Pertanyaan 2')).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Opsi A kartu 2' })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Opsi A kartu 1' })).toHaveClass(benar ? 'kegiatan__opsi--benar' : 'kegiatan__opsi--salah')
        await user.click(screen.getByRole('button', { name: /Kartu Berikutnya/ }))
        expect(screen.getByText('Pertanyaan 2')).toBeInTheDocument()
        expect(screen.queryByText('Pembahasan A 1')).not.toBeInTheDocument()
        expect(view.container.querySelector('.kegiatan__opsi--benar, .kegiatan__opsi--salah')).toBeNull()
        await user.click(screen.getByRole('button', { name: 'Opsi A kartu 2' }))
        expect(screen.getByRole('button', { name: /Kartu Berikutnya/ })).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /Kartu Berikutnya/ }))
        await user.click(screen.getByRole('button', { name: 'Opsi A kartu 3' }))
        expect(useGame.getState().state?.kegiatan).toBeUndefined()
        expect(screen.getByText('Pembahasan A 3')).toBeInTheDocument()
      })
    }
  }
  it('remount setelah menjawab membuka kartu berikutnya tanpa membatalkan jawaban', async () => {
    mulai('posyandu', true)
    const view = render(<Kegiatan />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Opsi A kartu 1' }))
    view.unmount()
    render(<Kegiatan />)
    expect(screen.getByText('Pertanyaan 2')).toBeInTheDocument()
    expect(screen.queryByText('Pembahasan A 1')).not.toBeInTheDocument()
    expect(useGame.getState().state?.kegiatan?.jawaban).toHaveLength(1)
  })
})
