/**
 * STORE — jembatan tipis UI ↔ engine. Satu-satunya pemilik GameState di renderer.
 * Komponen TIDAK boleh menghitung skor/aturan sendiri — semua dari engine/selector.
 */

import { create } from 'zustand'
import type { GameState, ModeStase } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import { advance } from '@engine/reducer'
import { buildInitialState } from '@engine/init'
import { serialize, deserialize } from '@engine/save'
import { PACK } from '@content/index'
import { hashSeed } from '@engine/core/rng'

export const SLOT_AUTOSAVE = 'autosave'

interface GameStore {
  state: GameState | null
  /**
   * Autosave yang termuat tapi BELUM dimasuki — layar judul yang memutuskan.
   * (Pemisahan ini penting: komputer lab dipakai bergantian; mahasiswa lain
   * harus tetap bisa memulai stase baru tanpa menyelam ke save orang.)
   */
  arsip: GameState | null
  /** Event dari dispatch terakhir — untuk juice (toast, suara, animasi). */
  lastEvents: GameEvent[]
  /** Counter naik tiap dispatch — dependency murah untuk useEffect juice. */
  eventTick: number
  sedangMemuat: boolean

  mulaiGameBaru: (namaDokter: string, mode?: ModeStase) => void
  lanjutkanArsip: () => void
  muatAutosave: () => Promise<boolean>
  dispatch: (action: Action) => void
  simpan: () => Promise<void>
}

/** Momen ireversibel — progres mahasiswa suci, dan reload bukan tombol undo. */
const EVENT_AUTOSAVE = new Set(['HARI_BARU', 'ENCOUNTER_SELESAI', 'KUNJUNGAN_SELESAI', 'BLOK_BERGANTI'])

export const useGame = create<GameStore>((set, get) => ({
  state: null,
  arsip: null,
  lastEvents: [],
  eventTick: 0,
  sedangMemuat: false,

  mulaiGameBaru: (namaDokter: string, mode: ModeStase = 'karier') => {
    const seed = hashSeed(namaDokter, Date.now())
    // M4.5: mode 'ujian' memilih paket kurikulum dari seed (docs/M45_MODE_UJIAN.md).
    const state = buildInitialState(namaDokter, seed, PACK, { mode })
    set({ state, arsip: null, lastEvents: [], eventTick: 0 })
    void get().simpan()
  },

  lanjutkanArsip: () => {
    const arsip = get().arsip
    if (!arsip) return
    set({ state: arsip, arsip: null, lastEvents: [], eventTick: 0 })
  },

  muatAutosave: async () => {
    set({ sedangMemuat: true })
    try {
      const json = await window.primer.save.read(SLOT_AUTOSAVE)
      if (!json) return false
      const arsip = deserialize(json, PACK)
      if (!arsip) return false
      set({ arsip })
      return true
    } finally {
      set({ sedangMemuat: false })
    }
  },

  dispatch: (action: Action) => {
    const cur = get().state
    if (!cur) return
    try {
      const { state, events } = advance(cur, action, PACK)
      set((prev) => ({ state, lastEvents: events, eventTick: prev.eventTick + 1 }))
      if (events.some((e) => EVENT_AUTOSAVE.has(e.type))) void get().simpan()
    } catch (e) {
      // Jaring terakhir: engine tidak boleh membekukan UI tanpa pesan.
      console.error('Engine error:', action.type, e)
      set((prev) => ({
        lastEvents: [{ type: 'ERROR_AKSI', pesan: 'Terjadi kesalahan internal — coba aksi lain atau muat ulang.' }],
        eventTick: prev.eventTick + 1,
      }))
    }
  },

  simpan: async () => {
    const cur = get().state
    if (!cur) return
    try {
      await window.primer.save.write(SLOT_AUTOSAVE, serialize(cur))
    } catch (e) {
      console.error('Gagal menyimpan:', e)
    }
  },
}))

/** Selector siap pakai — dipakai lintas layar agar aturan konsisten. */
export const pilih = {
  state: (s: GameStore) => s.state,
  dispatch: (s: GameStore) => s.dispatch,
  suratBelumDibaca: (s: GameStore) => s.state?.inbox.filter((m) => !m.dibaca).length ?? 0,
}
