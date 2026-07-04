/**
 * TEST STORE — simpanKeSlot melapor gagal, bukan diam-diam (CODEX ronde-13).
 * Sebelum fix: `save.write` gagal (disk penuh/izin ditolak) jadi unhandled
 * rejection — tombol "Simpan" di UI tak berefek tanpa pesan apa pun. Pola
 * verifikasi sama `simpan()` autosave yang sudah lebih dulu ditangani.
 */
import { describe, expect, it, beforeEach } from 'vitest'
import { useGame } from './store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'

function pasangPrimerStub(overrides?: Partial<Window['primer']['save']>) {
  window.primer = {
    save: {
      write: async () => true,
      read: async () => null,
      list: async () => [],
      delete: async () => true,
      ...overrides,
    },
    telemetri: {
      append: async () => true,
      read: async () => [],
    },
    appVersion: async () => 'test',
  }
}

describe('simpanKeSlot — melapor sukses/gagal (CODEX ronde-13)', () => {
  beforeEach(() => {
    useGame.setState({ state: buildInitialState('Uji Store', 1, PACK) })
  })

  it('save.write sukses → mengembalikan true', async () => {
    pasangPrimerStub({ write: async () => true })
    const ok = await useGame.getState().simpanKeSlot('slot1')
    expect(ok).toBe(true)
  })

  it('save.write gagal (reject, mis. disk penuh) → mengembalikan false, bukan throw', async () => {
    pasangPrimerStub({
      write: async () => {
        throw new Error('ENOSPC: no space left on device')
      },
    })
    await expect(useGame.getState().simpanKeSlot('slot1')).resolves.toBe(false)
  })

  it('tanpa state aktif → mengembalikan false, bukan diam-diam undefined', async () => {
    pasangPrimerStub()
    useGame.setState({ state: null })
    const ok = await useGame.getState().simpanKeSlot('slot1')
    expect(ok).toBe(false)
  })
})
