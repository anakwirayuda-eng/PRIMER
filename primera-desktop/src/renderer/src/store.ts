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
  /**
   * M10 Batch-2 (CODEX P1.1): sidik stase (`seed:seedKurikulum`) yang SUDAH
   * direkam tamat — playthroughs tak boleh dobel bila TAMAT terpicu ulang
   * (mis. arsip pra-tamat lama diimpor lalu dimainkan sampai tamat lagi).
   * Badges/dexKuasai memang idempoten (Set/max), hanya counter yang rawan.
   * Opsional: meta lama tanpa field ini tetap sah (dianggap kosong).
   */
  staseTamat?: string[]
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

  mulaiGameBaru: (namaDokter: string, mode?: ModeStase, nim?: string) => void
  lanjutkanArsip: () => void
  muatAutosave: () => Promise<boolean>
  dispatch: (action: Action) => void
  simpan: () => Promise<void>

  /* -- M5.24/25: meta lintas-playthrough + slot manual + impor ---------------- */
  meta: MetaLifetime | null
  slots: InfoSlot[]
  muatMetaDanSlot: () => Promise<void>
  simpanKeSlot: (slot: SlotManual) => Promise<boolean>
  muatDariSlot: (slot: SlotManual) => Promise<boolean>
  imporArsip: (json: string) => boolean
}

/**
 * Momen ireversibel — progres mahasiswa suci, dan reload bukan tombol undo.
 * M10 Batch-2 (CODEX P1.1, dossier §53): KEGIATAN_SELESAI / KODE_HITAM /
 * PEMULIHAN_SELESAI / TAMAT dulu TAK terdaftar — quit setelah outcome bisa
 * MEMBATALKAN kematian pasien IGD, hasil kegiatan UKM, bahkan stase tamat
 * (vektor curang nyata di mode Ujian ternilai; asimetri telanjang: saudaranya
 * KUNJUNGAN_SELESAI & ENCOUNTER_SELESAI sudah lama terdaftar).
 * (Di-export utk test pin-konfigurasi.)
 */
export const EVENT_AUTOSAVE = new Set([
  'HARI_BARU', 'ENCOUNTER_SELESAI', 'KUNJUNGAN_SELESAI', 'BLOK_BERGANTI',
  'KEGIATAN_SELESAI', 'KODE_HITAM', 'PEMULIHAN_SELESAI', 'TAMAT',
])
/**
 * CODEX audit 2026-07-04 (temuan #4): aksi manajemen ini mengubah state nyata
 * (uang, roster binaan, program UKM, refleksi) tapi biasanya `events: []` —
 * jarang cukup sering utk perlu autosave per-aksi (spt TANYA/PERIKSA klinik),
 * tapi cukup jarang & bermakna sampai hilangnya terasa seperti "undo by quit"
 * kalau app ditutup sebelum event autosave besar berikutnya. Simpan langsung.
 * M10 Batch-2 (P1.1): + DISPOSISI_IGD — outcome IGD (stabil/salah-disposisi)
 * ireversibel; dipin di level AKSI krn event STEMPEL-nya dipakai bersama
 * diagnosis klinik biasa (ambigu di level event).
 */
export const AKSI_AUTOSAVE = new Set(['PESAN_OBAT', 'TETAPKAN_PROGRAM', 'PILIH_BINAAN', 'LEPAS_BINAAN', 'TULIS_REFLEKSI', 'DISPOSISI_IGD'])

export const useGame = create<GameStore>((set, get) => ({
  state: null,
  arsip: null,
  lastEvents: [],
  eventTick: 0,
  sedangMemuat: false,

  mulaiGameBaru: (namaDokter: string, mode: ModeStase = 'karier', nim?: string) => {
    // Anti-reroll + ikatan identitas (CODEX): di mode UJIAN seed diturunkan
    // DETERMINISTIK dari NIM — restart dgn NIM sama = paket & wajah pasien
    // IDENTIK, jadi memulai ulang tak bisa "memancing" paket favorit, DAN nama
    // teman tak bisa dipinjam (paket terikat NIM, verifier menolak bila NIM di
    // dossier tak cocok seed). Instruktur menetapkan NIM → paket per-mahasiswa
    // terkendali. Mode KARIER (tak dinilai) tetap Date.now agar tiap main variatif.
    const nimBersih = nim?.trim() || undefined
    const seed = mode === 'ujian' ? hashSeed('ujian', nimBersih ?? namaDokter) : hashSeed(namaDokter, Date.now())
    const state = buildInitialState(namaDokter, seed, PACK, { mode, ...(nimBersih ? { nim: nimBersih } : {}) })
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
      const berhasil = !events.some((e) => e.type === 'ERROR_AKSI')
      if (events.some((e) => EVENT_AUTOSAVE.has(e.type)) || (berhasil && AKSI_AUTOSAVE.has(action.type))) {
        void get().simpan()
      }
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
    // DeepThink ronde-2 — telemetri wall-clock (docs/TELEMETRI_WALLCLOCK.md):
    // log forensik terpisah dari save slot, utk deteksi save-scumming oleh
    // dosen. Best-effort murni — gagal tulis TIDAK BOLEH mengganggu gameplay.
    try {
      await window.primer.telemetri.append(
        JSON.stringify({ t: Date.now(), hari: cur.hari, blok: cur.blok, jejakLen: cur.jejak.length }),
      )
    } catch (e) {
      console.error('Gagal mencatat telemetri:', e)
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
    if (!cur) return false
    // CODEX ronde-13: dulu tak dibungkus try/catch — gagal tulis (disk penuh/
    // izin ditolak) jadi unhandled rejection, tombol "Simpan" diam-diam tak
    // berefek tanpa pesan apa pun. Pola sama `simpan()` autosave di atas.
    try {
      await window.primer.save.write(slot, serialize(cur))
    } catch (e) {
      console.error('Gagal menyimpan ke slot manual:', e)
      return false
    }
    await get().muatMetaDanSlot()
    return true
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
    // M10 Batch-2 (P1.1): idempotensi counter — stase yang SAMA (seed identik)
    // tamat dua kali (arsip lama diimpor & dimainkan ulang) tak menambah
    // playthroughs lagi; badge/dex tetap di-merge (idempoten by-design).
    const sidikStase = `${state.seed}:${state.seedKurikulum}`
    const sudahDirekam = (lama.staseTamat ?? []).includes(sidikStase)
    const meta: MetaLifetime = {
      playthroughs: sudahDirekam ? lama.playthroughs : lama.playthroughs + 1,
      badges: [...new Set([...lama.badges, ...badgesBaru])],
      dexKuasai,
      staseTamat: sudahDirekam ? (lama.staseTamat ?? []) : [...(lama.staseTamat ?? []), sidikStase],
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
