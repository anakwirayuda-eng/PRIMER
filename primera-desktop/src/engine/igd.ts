/**
 * IGD (M3.14) — mesin gawat darurat turn-based.
 * Stabilitas 0-100 bergerak per keputusan; habis → Kode Biru (RJP satu kesempatan)
 * → selamat lemah atau Kode Hitam. Setelah semua langkah + stabil → disposisi.
 * Tanpa timer real-time: tegangannya dari konsekuensi keputusan, bukan stopwatch.
 */

import type { IgdState } from './state'
import type { KasusIgd, RumahSakit } from '@content/types'
import type { Rng } from './core/rng'
import type { ContentPack } from '@content/pack'

/** Kecocokan tujuan IGD: spesialisasi dan, bila dinyatakan kasus, kapabilitas waktu-kritis. */
export function rumahSakitCocokUntukIgd(kasus: KasusIgd, rumahSakit: RumahSakit): boolean {
  const spesialisCocok =
    !kasus.spesialisRujukan || rumahSakit.spesialisasi.includes(kasus.spesialisRujukan)
  const butuh = kasus.kapabilitasRujukanSalahSatu ?? []
  const kapabilitasCocok =
    butuh.length === 0 || butuh.some((item) => rumahSakit.kapabilitas?.includes(item))
  return spesialisCocok && kapabilitasCocok
}

export function buatIgd(kasus: KasusIgd, pack: ContentPack, rng: Rng): IgdState {
  const jenisKelamin = kasus.demografi.jenisKelamin ?? (rng.chance(0.5) ? 'L' : 'P')
  const daftarNama = jenisKelamin === 'L' ? pack.namaWarga.pria : pack.namaWarga.wanita
  const usiaBulan =
    kasus.demografi.usiaBulanMin !== undefined && kasus.demografi.usiaBulanMax !== undefined
      ? rng.int(kasus.demografi.usiaBulanMin, kasus.demografi.usiaBulanMax)
      : undefined
  return {
    kasusId: kasus.id,
    pasienNama: daftarNama.length > 0 ? rng.pick(daftarNama) : 'Warga',
    usia: rng.int(kasus.demografi.usiaMin, kasus.demografi.usiaMax),
    ...(usiaBulan !== undefined ? { usiaBulan } : {}),
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
 * SELALU kembali (ROSC); RJP buruk SELALU gagal. M10.5 #14 (2026-07-12):
 * deterministik, bukan dadu — pola sama #1 (hard-cap keselamatan) & #15 (day-
 * scaling): mekanik keselamatan tak boleh bergantung nasib. Stabilitas pasca-
 * ROSC tetap RENDAH (25) — "kembali" bukan "sembuh"; rujuk sebelum stabilisasi
 * lanjutan berkonsekuensi pasien tiba KRITIS di RS (lihat AMBANG_STABIL_RUJUK
 * di `nilaiIgd` — sejak adjudikasi-delegasi 2026-08-21 bukan lagi vonis mati).
 *
 * CODEX audit (2026-07-12, temuan #2): dulu langsung ke fase 'disposisi' —
 * di bawah doktrin lama (rujuk<ambang = mati dalam perjalanan) itu berarti
 * rujukan BENAR (disposisiBenar SEMUA kasus IGD = 'rujuk') selalu berujung
 * Kode Hitam — dead-end deterministik pada SETIAP kasus. Kini singgah dulu
 * di 'pasca_rosc' (lihat `stabilisasiLanjutanIgd`) sebelum disposisi; vonis
 * mati doktrin lama itu sendiri sudah dibalik (adjudikasi-delegasi
 * 2026-08-21, lihat `AMBANG_STABIL_RUJUK`).
 */
export function rjpIgd(igd: IgdState, berkualitas: boolean): IgdState {
  if (igd.fase !== 'kode_biru') return igd
  if (berkualitas) {
    return { ...igd, stabilitas: 25, fase: 'pasca_rosc', melewatiKodeBiru: true }
  }
  return { ...igd, fase: 'selesai', hasil: 'meninggal', melewatiKodeBiru: true }
}

/**
 * M10.5 CODEX audit (2026-07-12, temuan #2): titik keputusan pasca-ROSC yang
 * ditagih dari komentar `rjpIgd` di atas. `ulang_abcde` (re-evaluasi ABCDE +
 * monitor + oksigen sebelum transportasi — kompetensi stabilisasi nyata,
 * BUKAN kelonggaran kosong) menaikkan stabilitas +30 (25→55, melewati
 * `AMBANG_STABIL_RUJUK`=50). `langsung_rujuk` (godaan skip stabilisasi lanjutan
 * krn "waktu mendesak") TIDAK menaikkan stabilitas — konsekuensinya di fase
 * disposisi (nilaiIgd, adjudikasi-delegasi 2026-08-21): bila lanjut rujuk,
 * pasien tiba KRITIS di RS (hidup, `tibaKritis`); bila malah pulang di bawah
 * ambang, pasien memburuk fatal di rumah (Kode Hitam).
 */
export function stabilisasiLanjutanIgd(
  igd: IgdState,
  pilihanId: 'ulang_abcde' | 'langsung_rujuk',
): IgdState {
  if (igd.fase !== 'pasca_rosc') return igd
  if (pilihanId === 'ulang_abcde') {
    return { ...igd, stabilitas: Math.min(100, igd.stabilitas + 30), fase: 'disposisi' }
  }
  return { ...igd, fase: 'disposisi' }
}

/**
 * M10.5 Q4/Q-E (2026-07-12), makna DIBALIK oleh adjudikasi-delegasi
 * 2026-08-21: ambang stabilitas minimum sebelum transportasi rujukan
 * dianggap aman. Doktrin LAMA memvonis rujuk di bawah ambang ini sebagai
 * "meninggal dalam perjalanan" (ditally sekelas Kode Hitam) — kurva
 * konsekuensi terbalik: 'rujuk' adalah disposisiBenar SEMUA kasus IGD dan
 * mahasiswa tak punya aksi penambah stabilitas di fase disposisi, jadi
 * jawaban BENAR justru dihukum mati sementara 'pulang' dipaksa selamat.
 * Kini ambang ini membedakan dua nasib: RUJUK di bawah ambang = pasien
 * tiba KRITIS di RS tapi HIDUP (`tibaKritis`, disposisi dinilai normal);
 * PULANG di bawah ambang = pasien memburuk di rumah dan meninggal
 * (hasil 'memburuk' → Kode Hitam di reducer).
 */
export const AMBANG_STABIL_RUJUK = 50

export interface PenilaianIgd {
  kasusId: string
  pasienNama: string
  hasil: 'stabil' | 'meninggal' | 'memburuk'
  /**
   * Adjudikasi-delegasi 2026-08-21: rujukan pada stabilitas < ambang —
   * pasien HIDUP tapi tiba di RS dalam kondisi kritis. Narasi edukatif
   * (stabilisasi maksimal sebelum & selama transportasi adalah bagian dari
   * rujukan), BUKAN vonis mati dan BUKAN hukuman ganda: kualitas proses
   * sudah terhukum lewat skor formal benar/total.
   */
  tibaKritis: boolean
  benar: number
  total: number
  disposisiTepat: boolean
  clue: string
}

export function nilaiIgd(igd: IgdState, kasus: KasusIgd, disposisi?: 'rujuk' | 'pulang'): PenilaianIgd {
  const benar = igd.jawaban.filter((j) => j.benar).length
  const belumStabil = igd.stabilitas < AMBANG_STABIL_RUJUK
  // Adjudikasi-delegasi 2026-08-21: pulang di bawah ambang = memburuk fatal
  // di rumah; rujuk di bawah ambang = tiba kritis tapi hidup, dinilai normal.
  const pulangFatal = disposisi === 'pulang' && belumStabil
  const tibaKritis = disposisi === 'rujuk' && belumStabil
  return {
    kasusId: kasus.id,
    pasienNama: igd.pasienNama,
    hasil: pulangFatal ? 'memburuk' : igd.hasil ?? 'stabil',
    tibaKritis,
    benar,
    total: kasus.langkah.length,
    disposisiTepat: !pulangFatal && disposisi !== undefined && disposisi === kasus.disposisiBenar,
    clue: kasus.clue,
  }
}
