/**
 * REKONSTRUKSI JEJAK — memulihkan cuplikan UI yang tidak disimpan di save.
 *
 * `encounterTerakhir` (rekam medis lengkap pasien terakhir) dan `rekapUkm`
 * (siapa yang menjawab kartu kegiatan, koreksi kader, gaya percakapan) hidup
 * di RAM store saja; engine sengaja tidak menyimpannya (berkas beku). Dulu
 * keduanya hilang begitu sesi dimuat ulang.
 *
 * Save sudah membawa `jejak` (payload utuh setiap aksi) dan engine
 * deterministik, jadi cuplikan itu bisa diturunkan ulang dengan memutar jejak
 * dari state awal: aturan yang sama (`turunkanCuplikan`) dijalankan per aksi,
 * persis seperti `dispatch` live. Tidak ada berkas pendamping, tidak ada format
 * save baru, dan sidik jari dossier tidak berubah karena engine/konten tak
 * disentuh.
 *
 * Fail-closed: bila hasil replay tidak cocok dengan state yang dimuat (save
 * pra-M6 tanpa jejak, save hasil migrasi, berkas diubah), hasilnya null dan UI
 * kembali ke perilaku lama ("tidak tercatat") — tidak pernah menampilkan rekam
 * medis yang mungkin keliru.
 *
 * Biaya terukur (2026-10-19, stase karier 90 hari, 7.925 aksi): replay penuh
 * 135–180 ms di mesin dev.
 */

import type { EncounterState, GameState } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import { advance } from '@engine/reducer'
import { buildInitialState } from '@engine/init'
import { episodeIdPasien } from '@engine/bridge'
import { PACK } from '@content/index'
import { catatRekapUkm, type RekapUkm } from '../screens/ukm/rekapUkm'

export interface CuplikanUi {
  rekapUkm: RekapUkm | null
  encounterTerakhir: EncounterState | null
}

export const CUPLIKAN_KOSONG: CuplikanUi = { rekapUkm: null, encounterTerakhir: null }

/** Konsultasi poli yang ditutup aksi ini, beserta disposisi yang dipilih. */
export function encounterDitutup(sebelum: GameState, events: GameEvent[], action: Action): EncounterState | null {
  if (!sebelum.klinik.aktif || !events.some((e) => e.type === 'ENCOUNTER_SELESAI')) return null
  return {
    ...sebelum.klinik.aktif,
    ...(action.type === 'DISPOSISI'
      ? { disposisi: action.jenis, sbar: action.sbar, justifikasiRujuk: action.justifikasiRujuk }
      : {}),
  }
}

/**
 * SATU sumber aturan cuplikan — dipakai `dispatch` live dan replay. Cuplikan
 * berlaku untuk hari berjalan saja; pergantian hari mengosongkannya.
 */
export function turunkanCuplikan(
  prev: CuplikanUi,
  sebelum: GameState,
  sesudah: GameState,
  events: GameEvent[],
  action: Action,
): CuplikanUi {
  if (sesudah.hari !== sebelum.hari) return CUPLIKAN_KOSONG
  return {
    rekapUkm: catatRekapUkm(sebelum, sesudah, events, action) ?? prev.rekapUkm,
    encounterTerakhir: encounterDitutup(sebelum, events, action) ?? prev.encounterTerakhir,
  }
}

export interface EncounterSelesai {
  hari: number
  episodeId: string
  enc: EncounterState
}

export interface HasilRekonstruksi {
  cuplikan: CuplikanUi
  /** Semua konsultasi poli sepanjang stase, urut waktu. */
  encounter: EncounterSelesai[]
}

/**
 * Cocok bila replay mendarat di titik yang sama dengan state yang dimuat.
 * Tally memuat seluruh penghitung skor, jadi replay yang menyimpang hampir
 * pasti terlihat di sini; sisanya penanda posisi waktu yang murah dibanding.
 */
function replayCocok(hasil: GameState, asli: GameState): boolean {
  return (
    hasil.hari === asli.hari &&
    hasil.blok === asli.blok &&
    hasil.jejak.length === asli.jejak.length &&
    hasil.kapitasi === asli.kapitasi &&
    hasil.careEpisodes.length === asli.careEpisodes.length &&
    JSON.stringify(hasil.tally) === JSON.stringify(asli.tally)
  )
}

function putarUlang(asli: GameState): HasilRekonstruksi | null {
  if (asli.jejak.length === 0) return null
  // State hasil buildInitialState dimiliki eksklusif loop ini, jadi mode replay
  // advance (append log/jejak in-place) aman — pola sama `replayJejak`.
  let s = buildInitialState(asli.namaDokter, asli.seed, PACK, {
    mode: asli.mode,
    ...(asli.nim ? { nim: asli.nim } : {}),
  })
  let cuplikan = CUPLIKAN_KOSONG
  const encounter: EncounterSelesai[] = []
  for (const aksi of asli.jejak) {
    const { state, events } = advance(s, aksi, PACK, true)
    cuplikan = turunkanCuplikan(cuplikan, s, state, events, aksi)
    const enc = encounterDitutup(s, events, aksi)
    if (enc) encounter.push({ hari: s.hari, episodeId: episodeIdPasien(enc.pasien), enc })
    s = state
  }
  return replayCocok(s, asli) ? { cuplikan, encounter } : null
}

// Per objek state: GameState immutable di jalur store, jadi objek yang sama =
// isi yang sama. Kunci berbasis seed+panjang jejak tidak dipakai karena save
// yang diubah tangan bisa berbagi kunci itu dengan save asli.
const cache = new WeakMap<GameState, HasilRekonstruksi | null>()

/** Putar ulang jejak `state` dan kembalikan cuplikan UI + daftar konsultasi. */
export function rekonstruksiJejak(state: GameState): HasilRekonstruksi | null {
  if (cache.has(state)) return cache.get(state)!
  let hasil: HasilRekonstruksi | null
  try {
    hasil = putarUlang(state)
  } catch (e) {
    console.error('Rekonstruksi jejak gagal:', e)
    hasil = null
  }
  cache.set(state, hasil)
  return hasil
}

/** Konsultasi poli dikelompokkan per episode perawatan (id episode → urut waktu). */
export function konsultasiPerEpisode(hasil: HasilRekonstruksi): Map<string, EncounterSelesai[]> {
  const peta = new Map<string, EncounterSelesai[]>()
  for (const item of hasil.encounter) {
    const daftar = peta.get(item.episodeId)
    if (daftar) daftar.push(item)
    else peta.set(item.episodeId, [item])
  }
  return peta
}
