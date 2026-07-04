/**
 * PENGATURAN (M7 butir 31) — sumber tunggal preferensi pemain, non-React,
 * persist localStorage + pola subscribe (kompatibel useSyncExternalStore).
 * Dibaca oleh synth.ts (volume SFX), bgm.ts (volume musik), dan App
 * (ukuran teks, mode malam, reduksi gerak). Mute master tetap milik synth.ts.
 */

export type ModeMalam = 'auto' | 'siang' | 'malam'

export interface Pengaturan {
  /** Volume musik latar 0..1. */
  volumeMusik: number
  /** Volume efek suara 0..1. */
  volumeSfx: number
  /** Skala ukuran teks global 0.9..1.4 (aksesibilitas). */
  ukuranTeks: number
  /** Mode gelap: ikut blok (auto), paksa terang, atau paksa gelap. */
  modeMalam: ModeMalam
  /** Kurangi animasi (melengkapi prefers-reduced-motion OS). */
  kurangiGerak: boolean
}

const KUNCI = 'primer.pengaturan'

export const PENGATURAN_DEFAULT: Pengaturan = {
  volumeMusik: 0.6,
  volumeSfx: 0.8,
  ukuranTeks: 1,
  modeMalam: 'auto',
  kurangiGerak: false,
}

function klem(n: unknown, min: number, max: number, fallback: number): number {
  return typeof n === 'number' && Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback
}

function baca(): Pengaturan {
  try {
    const mentah = window.localStorage.getItem(KUNCI)
    if (!mentah) return { ...PENGATURAN_DEFAULT }
    const p = JSON.parse(mentah) as Partial<Pengaturan>
    return {
      volumeMusik: klem(p.volumeMusik, 0, 1, PENGATURAN_DEFAULT.volumeMusik),
      volumeSfx: klem(p.volumeSfx, 0, 1, PENGATURAN_DEFAULT.volumeSfx),
      ukuranTeks: klem(p.ukuranTeks, 0.9, 1.4, PENGATURAN_DEFAULT.ukuranTeks),
      modeMalam: p.modeMalam === 'siang' || p.modeMalam === 'malam' ? p.modeMalam : 'auto',
      kurangiGerak: p.kurangiGerak === true,
    }
  } catch {
    return { ...PENGATURAN_DEFAULT }
  }
}

let nilai: Pengaturan = baca()
const pendengar = new Set<() => void>()

export function getPengaturan(): Pengaturan {
  return nilai
}

export function setPengaturan(patch: Partial<Pengaturan>): void {
  nilai = { ...nilai, ...patch }
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(nilai))
  } catch {
    /* penyimpanan tak tersedia — berlaku untuk sesi ini saja */
  }
  pendengar.forEach((fn) => fn())
}

export function subscribePengaturan(fn: () => void): () => void {
  pendengar.add(fn)
  return () => {
    pendengar.delete(fn)
  }
}
