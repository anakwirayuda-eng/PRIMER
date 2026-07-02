/**
 * PETA UTIL — geometri petak RW organik + kosakata label Peta Desa.
 * Murni presentasional: tidak ada aturan game di sini, hanya bentuk & nama.
 */

import type { KeluargaState, RwState } from '@engine/state'
import type { IndikatorPisPk } from '@content/types'

/* ---------------------------------------------------------------------------
 * Gerbang provenance karma — pilar "setiap angka diperoleh".
 * ------------------------------------------------------------------------- */

/**
 * Peringatan karma hanya boleh TAMPIL bila dokter benar-benar punya data
 * keluarga itu (≥1 indikator ber-sumber dokter/kader). Tanpa data, dokter
 * tidak mungkin tahu ada yang memburuk — UI tidak boleh membocorkannya.
 * Murni gerbang tampilan: engine tetap menjalankan karma di baliknya.
 */
export function karmaTerlihat(kel: KeluargaState): boolean {
  if (!kel.karmaAktif) return false
  return Object.values(kel.indikator).some((n) => n.sumber !== 'belum')
}

/* ---------------------------------------------------------------------------
 * Bentuk petak RW — poligon organik (bukan grid kaku), gaya kartu pos.
 * ------------------------------------------------------------------------- */

export interface BentukPetak {
  /** Titik pusat petak pada kanvas 760×560. */
  cx: number
  cy: number
  /** Jari-jari per sudut (variasi = kesan digambar tangan). */
  radii: number[]
  /** Rotasi awal sudut pertama (radian). */
  putar: number
  /** Pemipihan vertikal 0-1 (petak sawah/kampung cenderung melebar). */
  pipih: number
}

/** Tata letak 8 petak RW mengelilingi Puskesmas, dipisah sungai & jalan. */
export const PETAK_RW: Record<number, BentukPetak> = {
  1: { cx: 140, cy: 112, radii: [64, 58, 70, 62, 55, 68, 60], putar: 0.3, pipih: 0.8 },
  2: { cx: 345, cy: 96, radii: [70, 60, 66, 74, 58, 64, 69], putar: 1.1, pipih: 0.78 },
  3: { cx: 612, cy: 120, radii: [64, 72, 56, 66, 60, 68, 55], putar: 2.0, pipih: 0.82 },
  4: { cx: 148, cy: 262, radii: [58, 66, 54, 62, 68, 56, 63], putar: 0.7, pipih: 0.8 },
  5: { cx: 604, cy: 296, radii: [62, 70, 58, 66, 54, 68, 60], putar: 1.6, pipih: 0.8 },
  6: { cx: 430, cy: 458, radii: [64, 56, 68, 58, 62, 70, 54], putar: 0.2, pipih: 0.76 },
  7: { cx: 612, cy: 462, radii: [58, 66, 54, 62, 68, 56, 64], putar: 2.4, pipih: 0.8 },
  8: { cx: 295, cy: 478, radii: [54, 60, 50, 58, 60, 52, 57], putar: 1.3, pipih: 0.8 },
}

/**
 * Menyusun path SVG tertutup yang halus melewati titik-tengah antar sudut —
 * hasilnya blob organik ala peta desa yang digambar tangan. Deterministik.
 */
export function jalurOrganik(b: BentukPetak): string {
  const n = b.radii.length
  const titik = b.radii.map((r, i) => {
    const sudut = b.putar + (i / n) * Math.PI * 2
    return { x: b.cx + Math.cos(sudut) * r, y: b.cy + Math.sin(sudut) * r * b.pipih }
  })
  let d = ''
  for (let i = 0; i < n; i++) {
    const p = titik[i]
    const q = titik[(i + 1) % n]
    if (!p || !q) continue
    if (i === 0) {
      const akhir = titik[n - 1]
      if (!akhir) continue
      d = `M ${((akhir.x + p.x) / 2).toFixed(1)} ${((akhir.y + p.y) / 2).toFixed(1)}`
    }
    d += ` Q ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${((p.x + q.x) / 2).toFixed(1)} ${((p.y + q.y) / 2).toFixed(1)}`
  }
  return `${d} Z`
}

/* ---------------------------------------------------------------------------
 * Warna choropleth — gradasi Daun → Kunyit → Merah dari token (tanpa warna baru).
 * ------------------------------------------------------------------------- */

export function warnaPetak(rw: RwState): string {
  if (rw.kkTersurvei <= 0) return 'var(--kertas-400)' // abu-abu: belum ada data
  if (rw.iks > 0.8) return 'var(--daun-600)'
  if (rw.iks >= 0.65) return 'var(--daun-500)'
  if (rw.iks >= 0.5) return 'var(--kunyit-600)'
  if (rw.iks >= 0.35) return 'var(--kunyit-700)'
  return 'var(--tinta-merah)'
}

/* ---------------------------------------------------------------------------
 * Kosakata label
 * ------------------------------------------------------------------------- */

export const LABEL_JARAK: Record<'dekat' | 'sedang' | 'terpencil', string> = {
  dekat: 'dekat',
  sedang: 'sedang',
  terpencil: 'terpencil',
}

export const LABEL_EKONOMI: Record<'mampu' | 'cukup' | 'rentan' | 'miskin', string> = {
  mampu: 'Mampu',
  cukup: 'Cukup',
  rentan: 'Rentan',
  miskin: 'Miskin',
}

export const LABEL_KLASIFIKASI: Record<
  'sehat' | 'pra_sehat' | 'tidak_sehat',
  { label: string; chip: string; meter: string }
> = {
  sehat: { label: 'Sehat', chip: 'chip--daun', meter: '' },
  pra_sehat: { label: 'Pra-Sehat', chip: 'chip--kunyit', meter: 'meter__isi--waspada' },
  tidak_sehat: { label: 'Tidak Sehat', chip: 'chip--merah', meter: 'meter__isi--bahaya' },
}

/** Label 12 indikator PIS-PK: singkatan untuk chip, kalimat penuh untuk tooltip. */
export const LABEL_INDIKATOR: Record<IndikatorPisPk, { singkat: string; penuh: string }> = {
  kb: { singkat: 'KB', penuh: 'Keluarga mengikuti program KB' },
  persalinan_faskes: { singkat: 'Salin', penuh: 'Persalinan di fasilitas kesehatan' },
  imunisasi_dasar: { singkat: 'Imun', penuh: 'Bayi mendapat imunisasi dasar lengkap' },
  asi_eksklusif: { singkat: 'ASI', penuh: 'Bayi mendapat ASI eksklusif' },
  pantau_tumbuh_kembang: { singkat: 'Tumbang', penuh: 'Balita dipantau tumbuh kembangnya' },
  tb_berobat_standar: { singkat: 'TB', penuh: 'Penderita TB berobat sesuai standar' },
  hipertensi_berobat: { singkat: 'HT', penuh: 'Penderita hipertensi berobat teratur' },
  jiwa_tidak_ditelantarkan: { singkat: 'Jiwa', penuh: 'Penderita gangguan jiwa dirawat, tidak ditelantarkan' },
  tidak_merokok: { singkat: 'Rokok', penuh: 'Tidak ada anggota keluarga yang merokok' },
  jkn: { singkat: 'JKN', penuh: 'Keluarga menjadi anggota JKN' },
  air_bersih: { singkat: 'Air', penuh: 'Keluarga punya akses air bersih' },
  jamban_sehat: { singkat: 'Jamban', penuh: 'Keluarga punya akses jamban sehat' },
}

/** Simbol provenance data: ✓ diverifikasi dokter, ~ laporan kader, ? belum ada. */
export const SIMBOL_SUMBER: Record<'dokter' | 'kader' | 'belum', string> = {
  dokter: '✓',
  kader: '~',
  belum: '?',
}
