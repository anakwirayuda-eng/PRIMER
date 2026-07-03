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
import { hitungBadge } from '@engine/badge'
import { PACK } from '@content/index'
import { hashSeed } from '@engine/core/rng'

export const SLOT_AUTOSAVE = 'autosave'
/** M5.25 — tiga slot arsip manual di samping autosave. */
export const SLOT_MANUAL = ['slot1', 'slot2', 'slot3'] as const
export type SlotManual = (typeof SLOT_MANUAL)[number]
/** M5.24 — slot meta lintas-playthrough (badge & dex bertahan). */
const SLOT_META = 'meta'

export interface InfoSlot {
  slot: SlotManual
  namaDokter: string
  hari: number
  mode: ModeStase
  tamat: boolean
}

export interface MetaLifetime {
  playthroughs: number
  badges: string[]
  /** kasusId → bintang tertinggi yang pernah dicapai lintas playthrough. */
  dexKuasai: Record<string, number>
}

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

  /* -- M5.24/25: meta lintas-playthrough + slot manual + impor ---------------- */
  meta: MetaLifetime | null
  slots: InfoSlot[]
  muatMetaDanSlot: () => Promise<void>
  simpanKeSlot: (slot: SlotManual) => Promise<void>
  muatDariSlot: (slot: SlotManual) => Promise<boolean>
  imporArsip: (json: string) => boolean
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
      // M5.24 — stase tamat: rekam badge & dex ke meta lintas-playthrough.
      if (events.some((e) => e.type === 'TAMAT')) void rekamMeta(state, set, get)
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

  /* -- M5.24/25 --------------------------------------------------------------- */
  meta: null,
  slots: [],

  muatMetaDanSlot: async () => {
    try {
      const metaJson = await window.primer.save.read(SLOT_META)
      if (metaJson) {
        const m = JSON.parse(metaJson) as MetaLifetime
        if (typeof m.playthroughs === 'number' && Array.isArray(m.badges)) set({ meta: m })
      }
    } catch {
      /* meta korup → mulai kosong */
    }
    const slots: InfoSlot[] = []
    for (const slot of SLOT_MANUAL) {
      try {
        const json = await window.primer.save.read(slot)
        if (!json) continue
        const st = deserialize(json, PACK)
        if (!st) continue
        slots.push({ slot, namaDokter: st.namaDokter, hari: st.hari, mode: st.mode, tamat: st.tamat !== undefined })
      } catch {
        /* slot korup → lewati */
      }
    }
    set({ slots })
  },

  simpanKeSlot: async (slot) => {
    const cur = get().state
    if (!cur) return
    await window.primer.save.write(slot, serialize(cur))
    await get().muatMetaDanSlot()
  },

  muatDariSlot: async (slot) => {
    const json = await window.primer.save.read(slot)
    if (!json) return false
    const st = deserialize(json, PACK)
    if (!st) return false
    set({ state: st, arsip: null, lastEvents: [], eventTick: 0 })
    return true
  },

  imporArsip: (json) => {
    const st = deserialize(json, PACK)
    if (!st) return false
    set({ state: st, arsip: null, lastEvents: [], eventTick: 0 })
    void get().simpan()
    return true
  },
}))

/** M5.24 — gabungkan hasil playthrough tamat ke meta lintas-playthrough. */
async function rekamMeta(
  state: GameState,
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
): Promise<void> {
  try {
    const lama: MetaLifetime = get().meta ?? { playthroughs: 0, badges: [], dexKuasai: {} }
    const badgesBaru = hitungBadge(state)
    const dexKuasai = { ...lama.dexKuasai }
    for (const [id, d] of Object.entries(state.dex)) {
      dexKuasai[id] = Math.max(dexKuasai[id] ?? 0, d.bintang)
    }
    const meta: MetaLifetime = {
      playthroughs: lama.playthroughs + 1,
      badges: [...new Set([...lama.badges, ...badgesBaru])],
      dexKuasai,
    }
    await window.primer.save.write(SLOT_META, JSON.stringify(meta))
    set({ meta })
  } catch (e) {
    console.error('Gagal merekam meta:', e)
  }
}

/** Selector siap pakai — dipakai lintas layar agar aturan konsisten. */
export const pilih = {
  state: (s: GameStore) => s.state,
  dispatch: (s: GameStore) => s.dispatch,
  suratBelumDibaca: (s: GameStore) => s.state?.inbox.filter((m) => !m.dibaca).length ?? 0,
}
