/**
 * PETA UTIL — geometri petak RW organik + kosakata label Peta Desa.
 * Murni presentasional: tidak ada aturan game di sini, hanya bentuk & nama.
 */

import type { KeluargaState, RwState } from '@engine/state'
import type { IndikatorPisPk } from '@content/types'
import { klasifikasiIks } from '@engine/pispk'

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

/**
 * CODEX audit UI/UX 2026-07-10 (#12): dulu 5 pita warna manual (daun-600/
 * daun-500/kunyit-600/kunyit-700/tinta-merah) yg TAK COCOK dgn klasifikasi
 * resmi 3-kelas (klasifikasiIks, engine/pispk.ts) yg dipakai legenda peta &
 * chip klasifikasi panel detail RW — RW "Pra-Sehat" (0.65-0.8) bisa tampak
 * HIJAU (mirip "Sehat"), RW "Tidak Sehat" (0.35-0.5) bisa tampak KUNYIT
 * (mirip "Pra-Sehat"). Panggil klasifikasi resmi yg sama, map 1:1 ke 3 warna
 * legenda — warna peta & label kelas kini SELALU konsisten utk RW yang sama.
 */
export function warnaPetak(rw: RwState): string {
  if (rw.kkTersurvei <= 0) return 'var(--kertas-400)' // abu-abu: belum ada data
  const kelas = klasifikasiIks(rw.iks)
  if (kelas === 'sehat') return 'var(--daun-600)'
  if (kelas === 'pra_sehat') return 'var(--kunyit-600)'
  return 'var(--tinta-merah)'
}

/**
 * Mendung di atas petak (DeepThink "game juice", 2026-07-04): IKS "Tidak
 * Sehat" (<0.5, klasifikasiIks) sudah beda warna, tapi warna saja mudah
 * terlewat sekilas mata — tambah metafora visual "cuaca desa memburuk" yang
 * lebih terasa. Hanya utk RW yg SUDAH tersurvei (abu-abu = belum ada data,
 * bukan buruk).
 */
export function mendungPetak(rw: RwState): boolean {
  return rw.kkTersurvei > 0 && rw.iks < 0.5
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
