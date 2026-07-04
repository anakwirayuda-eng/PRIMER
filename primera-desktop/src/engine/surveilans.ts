/**
 * SURVEILANS BALIK UKP→UKM (M1.2) — port ringan pola surveillance repo lama.
 * Setiap diagnosis penyakit menular di poli tercatat per RW; kluster dalam
 * jendela 14 hari menyalakan sinyal di peta + surat kader, dan Director
 * menaikkan bobot kasus yang sedang berkluster (loop UKP→UKM→UKP).
 */

import type { GameState } from './state'

export interface SurveilansEntry {
  hari: number
  rw: number
  kasusId: string
}

/** Jendela pengamatan kluster (hari) — angka repo lama. */
export const JENDELA_SURVEILANS = 14

/**
 * Ambang kluster per kasus menular (jumlah kasus di SATU RW dalam 14 hari).
 * Kasus di luar tabel ini tidak dicatat surveilans (tidak menular/relevan).
 * Angka diturunkan dari trigger outbreak repo lama (DBD 2+, diare 3+, ISPA 5+).
 */
export const AMBANG_CLUSTER: Record<string, number> = {
  dengue_df: 2,
  demam_tifoid: 2,
  tb_paru: 2,
  pneumonia_balita: 2,
  diare_akut_anak: 3,
  skabies: 3,
  konjungtivitis_bakterial: 3,
  ispa_common_cold: 5,
}

export function kasusMenular(kasusId: string): boolean {
  return AMBANG_CLUSTER[kasusId] !== undefined
}

/** Buang entri di luar jendela 14 hari. */
export function pangkasSurveilans(entries: SurveilansEntry[], hariIni: number): SurveilansEntry[] {
  return entries.filter((e) => hariIni - e.hari < JENDELA_SURVEILANS)
}

export interface Cluster {
  rw: number
  kasusId: string
  jumlah: number
}

/** Hitung kluster aktif per (RW, kasus) dari entri surveilans. */
export function hitungCluster(entries: SurveilansEntry[], hariIni: number): Cluster[] {
  const hitung = new Map<string, Cluster>()
  for (const e of pangkasSurveilans(entries, hariIni)) {
    const kunci = `${e.rw}|${e.kasusId}`
    const ada = hitung.get(kunci)
    if (ada) ada.jumlah += 1
    else hitung.set(kunci, { rw: e.rw, kasusId: e.kasusId, jumlah: 1 })
  }
  const out: Cluster[] = []
  for (const c of hitung.values()) {
    const ambang = AMBANG_CLUSTER[c.kasusId]
    if (ambang !== undefined && c.jumlah >= ambang) out.push(c)
  }
  return out.sort((a, b) => b.jumlah - a.jumlah)
}

/** Kluster aktif dari state (util untuk UI Peta & Director). */
export function clusterAktif(state: GameState): Cluster[] {
  return hitungCluster(state.desa.surveilans, state.hari)
}
