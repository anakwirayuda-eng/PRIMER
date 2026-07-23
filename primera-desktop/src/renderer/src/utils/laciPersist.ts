/**
 * PERSISTENSI LACI AKORDEON (audit premium 2026-07-23) — status buka/tutup
 * laci formularium/edukasi/tindakan/lab dulu Set level-modul: hilang tiap
 * restart app. Pemain yang selalu membuka laci yang sama harus mengulang
 * klik yang sama setiap sesi. Kini dipersist ke localStorage (kanal yang
 * sama dengan settings.ts) — preferensi UI murni, BUKAN state save/skor.
 * Gagal baca/tulis (storage penuh/diblok) jatuh senyap ke perilaku lama.
 */

export function muatLaci<T extends string>(kunci: string): Set<T> {
  try {
    const mentah = localStorage.getItem(kunci)
    if (mentah === null) return new Set()
    const isi: unknown = JSON.parse(mentah)
    return new Set(Array.isArray(isi) ? (isi.filter((x) => typeof x === 'string') as T[]) : [])
  } catch {
    return new Set()
  }
}

export function simpanLaci(kunci: string, isi: ReadonlySet<string>): void {
  try {
    localStorage.setItem(kunci, JSON.stringify([...isi]))
  } catch {
    // Preferensi kosmetik — kegagalan simpan tak boleh mengganggu gameplay.
  }
}
