/**
 * PIS-PK — matematika Indeks Keluarga Sehat kanonik (Permenkes 39/2016).
 * SATU formula, SATU kebenaran: IKS = ya / (ya + tidak) atas indikator yang
 * PUNYA data (sumber ≠ 'belum') dan BERLAKU secara demografis (status ≠ 'na').
 *
 * Catatan pedagogis penting: IKS dihitung dari `status` yang TERCATAT — bukan
 * `statusSebenarnya`. Data kader yang salah (bias/teledor) dan kebohongan warga
 * yang lolos gerbang kejujuran ikut meracuni IKS; hanya verifikasi dokter yang
 * meluruskannya. Persis seperti di dunia nyata.
 */

import type { KeluargaState } from './state'
import type { IndikatorPisPk } from '@content/types'

/** 12 indikator PIS-PK kanonik, urutan tetap (deterministik untuk iterasi & rng). */
export const SEMUA_INDIKATOR_PISPK: readonly IndikatorPisPk[] = [
  'kb',
  'persalinan_faskes',
  'imunisasi_dasar',
  'asi_eksklusif',
  'pantau_tumbuh_kembang',
  'tb_berobat_standar',
  'hipertensi_berobat',
  'jiwa_tidak_ditelantarkan',
  'tidak_merokok',
  'jkn',
  'air_bersih',
  'jamban_sehat',
]

/**
 * IKS satu keluarga: ya/(ya+tidak) atas indikator ber-sumber ≠ 'belum' dan
 * status ≠ 'na'. `null` bila belum ada satu pun data — "setiap angka
 * diperoleh, atau ia tidak ada".
 */
export function hitungIksKeluarga(kel: KeluargaState): number | null {
  let ya = 0
  let tidak = 0
  for (const ind of SEMUA_INDIKATOR_PISPK) {
    const nilai = kel.indikator[ind]
    if (nilai.sumber === 'belum') continue
    if (nilai.status === 'na') continue
    if (nilai.status === 'ya') ya += 1
    else tidak += 1
  }
  const total = ya + tidak
  if (total === 0) return null
  return ya / total
}

/** Klasifikasi kanonik: >0.8 sehat; 0.5–0.8 pra-sehat; <0.5 tidak sehat. */
export function klasifikasiIks(iks: number): 'sehat' | 'pra_sehat' | 'tidak_sehat' {
  if (iks > 0.8) return 'sehat'
  if (iks >= 0.5) return 'pra_sehat'
  return 'tidak_sehat'
}
