import type { JenisKelamin } from '@content/types'
import infantAtlas from '../../assets/m12/clinic-infant.webp'
import youthAtlas from '../../assets/m12/clinic-youth.webp'
import womenAtlas from '../../assets/m12/clinic-women.webp'
import menAtlas from '../../assets/m12/clinic-men.webp'
import olderAtlas from '../../assets/m12/clinic-older.webp'

export interface IdentitasVisualPasien {
  id: string
  usia: number
  usiaBulan?: number
  jenisKelamin: JenisKelamin
}

export interface ProfilVisualPasien {
  src: string
  posisi: string
  ukuranAtlas: string
  indeks: number
  kelompok: 'bayi_balita' | 'anak_remaja' | 'dewasa_perempuan' | 'dewasa_laki' | 'lansia'
}

interface KelompokAtlas {
  src: string
  grid: 2 | 3
  selL: readonly number[]
  selP: readonly number[]
  kelompok: ProfilVisualPasien['kelompok']
}

const BAYI_BALITA: KelompokAtlas = {
  src: infantAtlas,
  grid: 2,
  selL: [1, 3],
  selP: [0, 2],
  kelompok: 'bayi_balita',
}

const ANAK_REMAJA: KelompokAtlas = {
  src: youthAtlas,
  grid: 3,
  selL: [1, 3, 5, 7],
  selP: [0, 2, 4, 6, 8],
  kelompok: 'anak_remaja',
}

const DEWASA_PEREMPUAN: KelompokAtlas = {
  src: womenAtlas,
  grid: 3,
  selL: [],
  selP: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  kelompok: 'dewasa_perempuan',
}

const DEWASA_LAKI: KelompokAtlas = {
  src: menAtlas,
  grid: 3,
  selL: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  selP: [],
  kelompok: 'dewasa_laki',
}

const LANSIA: KelompokAtlas = {
  src: olderAtlas,
  grid: 3,
  selL: [0, 3, 5, 7],
  selP: [1, 2, 4, 6, 8],
  kelompok: 'lansia',
}

export const JUMLAH_VARIAN_VISUAL_PASIEN = 40

function hashIdentitas(id: string): number {
  let hash = 2166136261
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function posisiSel(indeks: number, grid: number): string {
  const baris = Math.floor(indeks / grid)
  const kolom = indeks % grid
  const langkah = 100 / (grid - 1)
  return `${kolom * langkah}% ${baris * langkah}%`
}

function kelompokUntuk(pasien: IdentitasVisualPasien): KelompokAtlas {
  if (pasien.usiaBulan !== undefined || pasien.usia < 5) return BAYI_BALITA
  if (pasien.usia < 18) return ANAK_REMAJA
  if (pasien.usia >= 60) return LANSIA
  return pasien.jenisKelamin === 'P' ? DEWASA_PEREMPUAN : DEWASA_LAKI
}

/**
 * Potret dipilih hanya dari identitas demografis, bukan kasus atau diagnosis.
 * Pasien yang sama selalu mendapat sel atlas yang sama di seluruh layar.
 */
export function profilVisualPasien(pasien: IdentitasVisualPasien): ProfilVisualPasien {
  const atlas = kelompokUntuk(pasien)
  const pilihan = pasien.jenisKelamin === 'P' ? atlas.selP : atlas.selL
  const indeks = pilihan[hashIdentitas(`${pasien.id}|${pasien.usia}|${pasien.jenisKelamin}`) % pilihan.length]!
  return {
    src: atlas.src,
    posisi: posisiSel(indeks, atlas.grid),
    ukuranAtlas: `${atlas.grid * 100}% ${atlas.grid * 100}%`,
    indeks,
    kelompok: atlas.kelompok,
  }
}
