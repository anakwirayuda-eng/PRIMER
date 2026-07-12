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
 * SELALU kembali (ROSC); RJP buruk SELALU gagal. M10.5 #14 (2026-07-12):
 * deterministik, bukan dadu — pola sama #1 (hard-cap keselamatan) & #15 (day-
 * scaling): mekanik keselamatan tak boleh bergantung nasib. Stabilitas pasca-
 * ROSC tetap RENDAH (25) — "kembali" bukan "sembuh"; rujuk sebelum stabilisasi
 * lanjutan tetap berisiko nyata (lihat AMBANG_STABIL_RUJUK di `nilaiIgd`).
 *
 * CODEX audit (2026-07-12, temuan #2): dulu langsung ke fase 'disposisi' —
 * janji "stabilisasi lanjutan tetap berisiko nyata" di atas tak pernah
 * ditagih jadi mekanik sungguhan, jadi rujukan BENAR (disposisiBenar SEMUA
 * kasus IGD = 'rujuk') selalu jatuh di bawah AMBANG_STABIL_RUJUK dan mati
 * dalam perjalanan, sedangkan pulang (SALAH) justru selamat — dead-end
 * deterministik pada SETIAP kasus. Kini singgah dulu di 'pasca_rosc'
 * (lihat `stabilisasiLanjutanIgd`) sebelum disposisi.
 */
export function rjpIgd(igd: IgdState, berkualitas: boolean): IgdState {
  if (igd.fase !== 'kode_biru') return igd
  if (berkualitas) {
    return { ...igd, stabilitas: 25, fase: 'pasca_rosc' }
  }
  return { ...igd, fase: 'selesai', hasil: 'meninggal' }
}

/**
 * M10.5 CODEX audit (2026-07-12, temuan #2): titik keputusan pasca-ROSC yang
 * ditagih dari komentar `rjpIgd` di atas. `ulang_abcde` (re-evaluasi ABCDE +
 * monitor + oksigen sebelum transportasi — kompetensi stabilisasi nyata,
 * BUKAN kelonggaran kosong) menaikkan stabilitas +30 (25→55, melewati
 * `AMBANG_STABIL_RUJUK`=50). `langsung_rujuk` (godaan skip stabilisasi lanjutan
 * krn "waktu mendesak") TIDAK menaikkan stabilitas — risiko rujuk prematur di
 * fase disposisi berikutnya (nilaiIgd) tetap nyata bila lanjut memilih rujuk.
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
 * M10.5 Q4/Q-E (2026-07-12): ambang stabilitas minimum sebelum transportasi
 * rujukan dianggap aman. Di bawah ini, merujuk (bukan menstabilkan dulu)
 * adalah rujukan PREMATUR — setara meninggal dalam perjalanan, ditally
 * sekelas Kode Hitam (bukan sekadar disposisi keliru) krn risikonya nyata:
 * pasien gawat tak stabil yang ditransportasi jarak jauh bisa memburuk fatal.
 */
export const AMBANG_STABIL_RUJUK = 50

export interface PenilaianIgd {
  kasusId: string
  pasienNama: string
  hasil: 'stabil' | 'meninggal' | 'memburuk'
  benar: number
  total: number
  disposisiTepat: boolean
  clue: string
}

export function nilaiIgd(igd: IgdState, kasus: KasusIgd, disposisi?: 'rujuk' | 'pulang'): PenilaianIgd {
  const benar = igd.jawaban.filter((j) => j.benar).length
  const rujukPrematur = disposisi === 'rujuk' && igd.stabilitas < AMBANG_STABIL_RUJUK
  return {
    kasusId: kasus.id,
    pasienNama: igd.pasienNama,
    hasil: rujukPrematur ? 'memburuk' : igd.hasil ?? 'stabil',
    benar,
    total: kasus.langkah.length,
    disposisiTepat: !rujukPrematur && disposisi !== undefined && disposisi === kasus.disposisiBenar,
    clue: kasus.clue,
  }
}
