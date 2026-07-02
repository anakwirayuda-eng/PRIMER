/**
 * RNG deterministik ber-seed — SATU-SATUNYA sumber keacakan engine.
 * Dilarang memakai Math.random() di mana pun dalam engine/konten
 * (pelajaran dari repo lama: satu Math.random bocor merusak replay/testing).
 */

/** Hash string → uint32 (FNV-1a). Untuk menurunkan seed dari kunci bernama. */
export function hashSeed(...parts: (string | number)[]): number {
  let h = 0x811c9dc5
  const s = parts.join('|')
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** PRNG mulberry32 — cepat, cukup untuk gameplay, 1 uint32 state. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Rng objek praktis: deterministik penuh dari seed + kunci konteks. */
export class Rng {
  private next: () => number

  constructor(seed: number | string, ...context: (string | number)[]) {
    const base = typeof seed === 'number' ? seed : hashSeed(seed)
    this.next = mulberry32(context.length ? hashSeed(base, ...context) : base)
  }

  /** float [0,1) */
  float(): number {
    return this.next()
  }

  /** int [min,max] inklusif */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1))
  }

  /** true dengan peluang p */
  chance(p: number): boolean {
    return this.next() < p
  }

  /** pilih satu elemen */
  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('Rng.pick: array kosong')
    return arr[Math.floor(this.next() * arr.length)] as T
  }

  /** pilih berbobot: [{item, bobot}] */
  weighted<T>(entries: readonly { item: T; bobot: number }[]): T {
    const total = entries.reduce((s, e) => s + e.bobot, 0)
    if (total <= 0) throw new Error('Rng.weighted: total bobot 0')
    let r = this.next() * total
    for (const e of entries) {
      r -= e.bobot
      if (r <= 0) return e.item
    }
    return entries[entries.length - 1]!.item
  }

  /** shuffle Fisher–Yates (salinan baru) */
  shuffle<T>(arr: readonly T[]): T[] {
    const out = [...arr]
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      const tmp = out[i]!
      out[i] = out[j]!
      out[j] = tmp
    }
    return out
  }
}
