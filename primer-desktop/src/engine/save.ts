/**
 * SAVE — serialisasi GameState versi-berskema.
 * Amplop `{ v: 1, state }` agar migrasi skema di masa depan punya pintu masuk.
 * `deserialize` defensif: JSON rusak / versi asing / bentuk dasar cacat → null
 * (store lalu memperlakukannya sebagai "tidak ada autosave", bukan crash).
 */

import type { GameState } from './state'

const VERSI_SAVE = 1 as const

export function serialize(state: GameState): string {
  return JSON.stringify({ v: VERSI_SAVE, state })
}

function objek(nilai: unknown): nilai is Record<string, unknown> {
  return typeof nilai === 'object' && nilai !== null && !Array.isArray(nilai)
}

export function deserialize(json: string): GameState | null {
  let mentah: unknown
  try {
    mentah = JSON.parse(json)
  } catch {
    return null
  }

  if (!objek(mentah)) return null
  if (mentah['v'] !== VERSI_SAVE) return null

  const st = mentah['state']
  if (!objek(st)) return null

  // Cek versi skema state + tipe dasar. Bukan validasi penuh — cukup untuk
  // menolak save korup/asing tanpa memfosilkan seluruh bentuk state di sini.
  if (st['versi'] !== 1) return null
  if (typeof st['hari'] !== 'number' || !Number.isFinite(st['hari'])) return null
  if (st['blok'] !== 'pagi' && st['blok'] !== 'siang' && st['blok'] !== 'sore') return null
  if (typeof st['seed'] !== 'number') return null
  if (typeof st['namaDokter'] !== 'string') return null
  if (!objek(st['klinik'])) return null
  if (!objek(st['desa'])) return null
  if (!objek(st['tally'])) return null
  if (!objek(st['dex'])) return null
  if (!Array.isArray(st['inbox'])) return null
  if (!Array.isArray(st['jadwal'])) return null
  if (!Array.isArray(st['log'])) return null

  // Semua angka inti harus finite — save yang diedit tangan / korup sebagian
  // (NaN, Infinity, string) tidak boleh meracuni skor.
  for (const kunci of ['stamina', 'burnout', 'kapitasi'] as const) {
    const nilai = st[kunci]
    if (typeof nilai !== 'number' || !Number.isFinite(nilai)) return null
  }
  const tally = st['tally'] as Record<string, unknown>
  // Migrasi-lite: field tally baru diisi 0 untuk save dari versi lebih lama.
  if (tally['autoBermasalah'] === undefined) tally['autoBermasalah'] = 0
  for (const kunci of ['posyanduSesi', 'prolanisSesi', 'klbTuntas', 'rujukanTepat', 'rujukanDitolak', 'igdStabil', 'igdMeninggal'] as const) {
    if (tally[kunci] === undefined) tally[kunci] = 0
  }
  if (typeof st['igdHariIni'] !== 'boolean') st['igdHariIni'] = false
  for (const nilai of Object.values(tally)) {
    if (typeof nilai !== 'number' || !Number.isFinite(nilai) || nilai < 0) return null
  }

  // Migrasi-lite M1: surveilans & drift untuk save pra-bridge.
  const desa = st['desa'] as Record<string, unknown>
  if (!Array.isArray(desa['surveilans'])) desa['surveilans'] = []
  if (typeof desa['drift'] !== 'object' || desa['drift'] === null) {
    desa['drift'] = { minggu: 1, jumlah: 0 }
  }
  // Migrasi-lite M2: bonusIks per RW + state program/prolanis/lapangan.
  if (Array.isArray(desa['rw'])) {
    for (const r of desa['rw'] as Record<string, unknown>[]) {
      if (typeof r['bonusIks'] !== 'number') r['bonusIks'] = 0
    }
  }
  if (typeof st['lapanganTerpakai'] !== 'boolean') st['lapanganTerpakai'] = false
  if (typeof st['prolanis'] !== 'object' || st['prolanis'] === null) st['prolanis'] = { roster: [] }
  if (typeof st['posyanduRwTerakhir'] !== 'object' || st['posyanduRwTerakhir'] === null) {
    st['posyanduRwTerakhir'] = {}
  }
  if (typeof st['program'] !== 'object' || st['program'] === null) st['program'] = {}
  // Pasien lama tanpa RW mendapat RW 1 (cukup untuk melanjutkan save lama).
  const klinik = st['klinik'] as Record<string, unknown>
  if (Array.isArray(klinik['antrian'])) {
    for (const p of klinik['antrian'] as Record<string, unknown>[]) {
      if (typeof p['rw'] !== 'number') p['rw'] = 1
    }
  }

  return st as unknown as GameState
}
