/**
 * IGD (M3.14) — mesin gawat darurat turn-based.
 * Stabilitas 0-100 bergerak per keputusan; habis → Kode Biru (RJP satu kesempatan)
 * → selamat lemah atau Kode Hitam. Setelah semua langkah + stabil → disposisi.
 * Tanpa timer real-time: tegangannya dari konsekuensi keputusan, bukan stopwatch.
 */

import type { IgdState } from './state'
import type { KasusIgd } from '@content/types'
import type { Rng } from './core/rng'
import type { ContentPack } from '@content/pack'

export function buatIgd(kasus: KasusIgd, pack: ContentPack, rng: Rng): IgdState {
  const jenisKelamin = kasus.demografi.jenisKelamin ?? (rng.chance(0.5) ? 'L' : 'P')
  const daftarNama = jenisKelamin === 'L' ? pack.namaWarga.pria : pack.namaWarga.wanita
  return {
    kasusId: kasus.id,
    pasienNama: daftarNama.length > 0 ? rng.pick(daftarNama) : 'Warga',
    usia: rng.int(kasus.demografi.usiaMin, kasus.demografi.usiaMax),
    jenisKelamin,
    rw: rng.int(1, 8),
    fase: 'langkah',
    langkahIndex: 0,
    stabilitas: kasus.stabilitasAwal,
    jawaban: [],
  }
}

export interface HasilAksiIgd {
  igd: IgdState
  benar: boolean
  respons: string
}

/** Terapkan satu pilihan tindakan pada langkah aktif. */
export function aksiIgd(igd: IgdState, kasus: KasusIgd, langkahId: string, pilihanId: string): HasilAksiIgd {
  if (igd.fase !== 'langkah') return { igd, benar: false, respons: '' }
  const langkah = kasus.langkah[igd.langkahIndex]
  if (!langkah || langkah.id !== langkahId) return { igd, benar: false, respons: '' }
  const pilihan = langkah.pilihan.find((p) => p.id === pilihanId)
  if (!pilihan) return { igd, benar: false, respons: '' }

  const stabilitas = Math.max(0, Math.min(100, igd.stabilitas + pilihan.efekStabilitas))
  const jawaban = [...igd.jawaban, { langkahId, pilihanId, benar: pilihan.benar }]
  const langkahIndex = igd.langkahIndex + 1

  // Stabilitas habis → Kode Biru (satu kesempatan RJP).
  if (stabilitas <= 0) {
    return {
      igd: { ...igd, stabilitas: 0, jawaban, fase: 'kode_biru' },
      benar: pilihan.benar,
      respons: pilihan.respons,
    }
  }

  // Semua langkah tuntas → disposisi.
  const fase = langkahIndex >= kasus.langkah.length ? 'disposisi' : 'langkah'
  return {
    igd: { ...igd, stabilitas, jawaban, langkahIndex, fase },
    benar: pilihan.benar,
    respons: pilihan.respons,
  }
}

/**
 * Kode Biru: RJP berkualitas (pilihan "kompresi 100-120x/menit, minim interupsi")
 * memberi peluang kembali 70%; pilihan salah → 25%. Deterministik dari rng.
 */
export function rjpIgd(igd: IgdState, berkualitas: boolean, rng: Rng): IgdState {
  if (igd.fase !== 'kode_biru') return igd
  const kembali = rng.chance(berkualitas ? 0.7 : 0.25)
  if (kembali) {
    // ROSC — pasien kembali, langsung fase disposisi dengan stabilitas rendah.
    return { ...igd, stabilitas: 25, fase: 'disposisi' }
  }
  return { ...igd, fase: 'selesai', hasil: 'meninggal' }
}

export interface PenilaianIgd {
  kasusId: string
  pasienNama: string
  hasil: 'stabil' | 'meninggal'
  benar: number
  total: number
  disposisiTepat: boolean
  clue: string
}

export function nilaiIgd(igd: IgdState, kasus: KasusIgd, disposisi?: 'rujuk' | 'pulang'): PenilaianIgd {
  const benar = igd.jawaban.filter((j) => j.benar).length
  return {
    kasusId: kasus.id,
    pasienNama: igd.pasienNama,
    hasil: igd.hasil ?? 'stabil',
    benar,
    total: kasus.langkah.length,
    disposisiTepat: disposisi !== undefined && disposisi === kasus.disposisiBenar,
    clue: kasus.clue,
  }
}
