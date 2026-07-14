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
import { LEGACY_CONTENT_RELEASE } from '@content/pack'
import { serialize } from '@engine/save'

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

describe('muatDariSlot — memuat slot manual JADI autosave aktif (CODEX audit UI/UX 2026-07-10, #4)', () => {
  beforeEach(() => {
    useGame.setState({ state: buildInitialState('Uji Store', 1, PACK) })
  })

  it('setelah memuat dari slot manual, autosave ikut ditulis (bukan hanya state in-memory)', async () => {
    const ditulis: { slot: string; json: string }[] = []
    const sSlot = buildInitialState('Dari Slot', 2, PACK)
    pasangPrimerStub({
      read: async (slot: string) => (slot === 'slot1' ? serialize(sSlot) : null),
      write: async (slot: string, json: string) => {
        ditulis.push({ slot, json })
        return true
      },
    })
    const ok = await useGame.getState().muatDariSlot('slot1')
    expect(ok).toBe(true)
    // Sebelum fix: muatDariSlot cuma `set(...)` in-memory, tak pernah menulis
    // autosave — menutup app sebelum aksi lain memicu autosave berikutnya
    // membuat boot berikutnya membaca save LAMA, bukan sesi yang baru dimuat.
    expect(ditulis.some((d) => d.slot === 'autosave')).toBe(true)
  })

  it('slot beda CONTENT_RELEASE ditolak tanpa menimpa sesi atau autosave aktif', async () => {
    const aktif = buildInitialState('Tetap Aktif', 3, PACK)
    const legacy = { ...buildInitialState('Slot Lama', 4, PACK), contentRelease: LEGACY_CONTENT_RELEASE }
    const ditulis: string[] = []
    useGame.setState({ state: aktif })
    pasangPrimerStub({
      read: async () => serialize(legacy),
      write: async (slot) => {
        ditulis.push(slot)
        return true
      },
    })

    expect(await useGame.getState().muatDariSlot('slot1')).toBe(false)
    expect(useGame.getState().state).toBe(aktif)
    expect(ditulis).toEqual([])
  })
})

describe('statusSimpan — melapor gagal-simpan, bukan diam-diam (CODEX audit UI/UX 2026-07-10, #2)', () => {
  beforeEach(() => {
    useGame.setState({ state: buildInitialState('Uji Store', 1, PACK), statusSimpan: 'idle' })
  })

  it('simpan() sukses → statusSimpan "idle"', async () => {
    pasangPrimerStub({ write: async () => true })
    await useGame.getState().simpan()
    expect(useGame.getState().statusSimpan).toBe('idle')
  })

  it('simpan() gagal (write reject) → statusSimpan "gagal"', async () => {
    pasangPrimerStub({
      write: async () => {
        throw new Error('ENOSPC: no space left on device')
      },
    })
    await useGame.getState().simpan()
    expect(useGame.getState().statusSimpan).toBe('gagal')
  })

  it('muatAutosave() — read reject (bukan "file tak ada") → statusSimpan "gagal", mengembalikan false (bukan unhandled rejection)', async () => {
    pasangPrimerStub({
      read: async () => {
        throw new Error('EACCES: permission denied')
      },
    })
    const ok = await useGame.getState().muatAutosave()
    expect(ok).toBe(false)
    expect(useGame.getState().statusSimpan).toBe('gagal')
  })

  it('muatAutosave() — read null (memang belum ada save) TIDAK dianggap gagal', async () => {
    pasangPrimerStub({ read: async () => null })
    const ok = await useGame.getState().muatAutosave()
    expect(ok).toBe(false)
    expect(useGame.getState().statusSimpan).toBe('idle')
  })

  it('autosave beda CONTENT_RELEASE tetap dimuat sebagai arsip netral, bukan sesi aktif', async () => {
    const legacy = { ...buildInitialState('Arsip Lama', 5, PACK), contentRelease: LEGACY_CONTENT_RELEASE }
    useGame.setState({ state: null, arsip: null, statusSimpan: 'idle' })
    pasangPrimerStub({ read: async () => serialize(legacy) })

    expect(await useGame.getState().muatAutosave()).toBe(true)
    expect(useGame.getState().state).toBeNull()
    expect(useGame.getState().arsip?.contentRelease).toBe(LEGACY_CONTENT_RELEASE)
  })
})

describe('M10 Batch-2 (CODEX P1.1) — konfigurasi autosave mencakup outcome ireversibel', () => {
  it('EVENT_AUTOSAVE memuat KEGIATAN_SELESAI/KODE_HITAM/PEMULIHAN_SELESAI/TAMAT', async () => {
    const { EVENT_AUTOSAVE } = await import('./store')
    for (const ev of ['HARI_BARU', 'ENCOUNTER_SELESAI', 'KUNJUNGAN_SELESAI', 'BLOK_BERGANTI', 'KEGIATAN_SELESAI', 'KODE_HITAM', 'PEMULIHAN_SELESAI', 'TAMAT']) {
      expect(EVENT_AUTOSAVE.has(ev), ev).toBe(true)
    }
  })

  it('AKSI_AUTOSAVE memuat DISPOSISI_IGD (outcome IGD dipin di level aksi)', async () => {
    const { AKSI_AUTOSAVE } = await import('./store')
    expect(AKSI_AUTOSAVE.has('DISPOSISI_IGD')).toBe(true)
  })
})
