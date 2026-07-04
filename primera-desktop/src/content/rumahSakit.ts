/**
 * JEJARING RUJUKAN SISRUTE (M3.13) — RS tujuan berjenjang.
 * Trade-off nyata: RS D dekat tapi terbatas; RS B lengkap tapi 90 menit.
 * Ketersediaan bed di-roll harian (deterministik) dari bedDasar.
 */

import type { RumahSakit } from './types'

export const RUMAH_SAKIT: RumahSakit[] = [
  {
    id: 'rsud_pratama',
    nama: 'RSUD Pratama Sukamaju',
    kelas: 'D',
    jarakMenit: 20,
    spesialisasi: ['penyakit_dalam', 'anak', 'obgyn', 'bedah'],
    bedDasar: 3,
  },
  {
    id: 'rs_kasih_bunda',
    nama: 'RS Kasih Bunda (Swasta)',
    kelas: 'C',
    jarakMenit: 35,
    spesialisasi: ['obgyn', 'anak', 'penyakit_dalam', 'tht'],
    bedDasar: 4,
  },
  {
    id: 'rsud_kertosono',
    nama: 'RSUD Kertosono',
    kelas: 'C',
    jarakMenit: 45,
    spesialisasi: ['penyakit_dalam', 'bedah', 'anak', 'obgyn', 'saraf', 'mata'],
    bedDasar: 6,
  },
  {
    id: 'rsud_provinsi',
    nama: 'RSUD Provinsi dr. Soeprapto',
    kelas: 'B',
    jarakMenit: 90,
    spesialisasi: ['penyakit_dalam', 'bedah', 'anak', 'obgyn', 'saraf', 'mata', 'tht', 'jiwa', 'paru'],
    bedDasar: 8,
  },
]

/** Peluang bed tersedia hari ini (di-roll deterministik oleh reducer). */
export function peluangBed(rs: RumahSakit): number {
  return Math.min(0.95, 0.5 + rs.bedDasar * 0.06)
}
