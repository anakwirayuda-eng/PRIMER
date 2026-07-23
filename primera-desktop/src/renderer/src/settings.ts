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
  /** Skala ukuran teks global 0.9..2.0 (aksesibilitas — WCAG 1.4.4 resize 200%). */
  ukuranTeks: number
  /** Mode gelap: ikut blok (auto), paksa terang, atau paksa gelap. */
  modeMalam: ModeMalam
  /** Kurangi animasi (melengkapi prefers-reduced-motion OS). */
  kurangiGerak: boolean
}

const KUNCI = 'primer.pengaturan'

export const PENGATURAN_DEFAULT: Pengaturan = {
  volumeMusik: 0.6,
  // Q4 (keputusan dr. Wirayuda + DeepThink, 2026-07-23): default SFX SANGAT
  // RENDAH — 50 mahasiswa satu lab tanpa jaminan headphone = polusi kognitif
  // bila tiap klik berbunyi 80%. Menaikkan volume = opt-in via Pengaturan.
  // (Pengguna lama tak terdampak: nilai tersimpan localStorage menang.)
  volumeSfx: 0.2,
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
      // Audit CODEX UX 2026-07-16 (P1): slider Pengaturan.tsx dinaikkan ke
      // max=2 (WCAG 1.4.4) tapi clamp muat-ulang di sini TERTINGGAL di 1.4 —
      // nilai 140-200% pilihan pemain langsung dipangkas balik tiap restart.
      // Batas HARUS sama persis dengan slider — jangan diduplikasi berbeda lagi.
      ukuranTeks: klem(p.ukuranTeks, 0.9, 2, PENGATURAN_DEFAULT.ukuranTeks),
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
