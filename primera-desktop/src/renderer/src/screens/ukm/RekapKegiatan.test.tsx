import { beforeEach, expect, it } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { buildInitialState } from '@engine/init'
import { serialize, deserialize } from '@engine/save'
import { PACK } from '@content/index'
import { useGame } from '../../store'
import { RekapKegiatan } from './RekapKegiatan'

beforeEach(() => {
  window.primer = { save: { write: async () => true, read: async () => null, list: async () => [], delete: async () => true }, telemetri: { append: async () => true, read: async () => [] }, appVersion: async () => '1.3.1-test' }
})
it('rekap membedakan jawaban dokter dan delegasi; setelah reload tidak mengarang pelaksana', () => {
  useGame.setState({ state: { ...buildInitialState('Delegasi', 131, PACK), hari: 16, blok: 'siang' }, rekapUkm: null, lastEvents: [] })
  const dispatch = useGame.getState().dispatch
  dispatch({ type: 'MULAI_POSYANDU', rw: 1 })
  const kartu = useGame.getState().state!.kegiatan!.kartu[0]!
  dispatch({ type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: kartu.pilihan[0]!.id })
  dispatch({ type: 'DELEGASI_KEGIATAN' })
  const state = useGame.getState().state!
  expect(useGame.getState().rekapUkm?.dijawabDokter).toBe(1)
  render(<RekapKegiatan hasil={state.hasilKegiatanTerakhir!} />)
  expect(screen.getAllByText('Dokter')).toHaveLength(1)
  expect(screen.getAllByText('Delegasi kader')).toHaveLength(3)
  expect(screen.getByText(kartu.judul)).toBeInTheDocument()
  cleanup()
  const arsip = serialize(state)
  expect(arsip).not.toContain('dijawabDokter')
  useGame.getState().imporArsip(arsip)
  expect(useGame.getState().rekapUkm).toBeNull()
  const dimuat = deserialize(arsip)!
  render(<RekapKegiatan hasil={dimuat.hasilKegiatanTerakhir!} />)
  expect(screen.getAllByText('Pelaksana tidak tercatat')).toHaveLength(4)
  expect(screen.getByText(kartu.judul)).toBeInTheDocument()
})
