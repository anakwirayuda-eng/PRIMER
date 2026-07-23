/**
 * NAVIGASI HUD — sumber kebenaran bersama urutan tab & alasan nonaktif.
 * Dipakai dua konsumen yang WAJIB sinkron: tombol tab di Hud.tsx dan hotkey
 * angka 1-5 (useHotkeyNavigasi). Logika gate dulu hidup inline di Hud —
 * menduplikasinya di handler keyboard berisiko drift (hotkey menembus layar
 * yang tombolnya digembok).
 */

import type { GameState, LayarGame } from '@engine/state'
import { HARI_BUKA_PETA } from '@engine/reducer'

/** Urutan tab HUD = urutan hotkey angka (1=Meja Kerja … 5=Rapor). */
export const URUTAN_TAB: readonly LayarGame[] = ['meja', 'klinik', 'peta', 'dex', 'rapor']

/**
 * Alasan sebuah tab tidak bisa diklik/dihotkey sekarang; `undefined` = boleh.
 * Urutan prioritas mengikuti tampilan Hud: kunci-hari dulu, lalu encounter
 * klinik, lalu sesi lapangan (kunjungan/IGD/kegiatan).
 */
export function alasanTabNonaktif(state: GameState, layar: LayarGame): string | undefined {
  if (layar === 'peta' && state.hari < HARI_BUKA_PETA) return 'Terbuka besok'
  if (state.klinik.aktif && layar !== 'klinik')
    return 'Sedang memeriksa pasien — selesaikan dulu konsultasinya.'
  const sesiBerjalan =
    state.layar === 'kunjungan' || Boolean(state.igd) || Boolean(state.kegiatan)
  if (sesiBerjalan) return 'Sedang ada sesi berjalan — selesaikan dulu sebelum pindah layar.'
  return undefined
}

/** Elemen yang sedang menerima ketikan — hotkey angka tak boleh membajaknya. */
export function sedangMengetik(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}
