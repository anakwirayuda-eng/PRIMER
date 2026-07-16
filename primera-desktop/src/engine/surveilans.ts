/**
 * SURVEILANS BALIK UKP→UKM (M1.2) — port ringan pola surveillance repo lama.
 * Setiap diagnosis penyakit menular di poli tercatat per RW; kluster dalam
 * jendela 14 hari menyalakan sinyal di peta + surat kader, dan Director
 * menaikkan bobot kasus yang sedang berkluster (loop UKP→UKM→UKP).
 */

import type { ContentPack } from '@content/pack'
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
 * Kasus tanpa `ambangKluster` tidak dicatat surveilans (tidak menular/relevan).
 *
 * GROUNDING (audit CODEX UKM 2026-07-16, sumber diterima dr. Wirayuda):
 * Permenkes 1/2026 tentang KLB, Wabah & Krisis Kesehatan — Pasal 23 ayat (2):
 * "Penetapan status KLB dilakukan apabila memenuhi minimal 1 (satu) kriteria
 * KLB sesuai ketentuan peraturan perundang-undangan" + definisi KLB (Ketentuan
 * Umum): "meningkatnya kejadian ... yang BERMAKNA SECARA EPIDEMIOLOGIS di suatu
 * daerah pada kurun waktu tertentu". Permenkes 1/2026 SENGAJA tak mematok angka
 * tunggal — ia mendelegasikan ke kriteria numerik klasik (a.l. peningkatan ≥2×
 * lipat dibanding periode sebelumnya). Ambang tiap kasus = operasionalisasi
 * kriteria "peningkatan bermakna" untuk skala satu RW dalam jendela 14 hari.
 * Angka DIKALIBRASI (2026-07-16) agar sinyal KLB benar-benar terjangkau dalam
 * satu stase (dulu ~6% seed) tanpa menabrak realisme: penyakit vektor/berat
 * tetap ambang rendah (2), ISPA ringan 5→4. Penetapan resmi "KLB" di game tetap
 * menuntut verifikasi (label "Verifikasi & Respons Sinyal KLB" pra-penetapan).
 *
 * M13 Batch 6 (2026-07-16) — SUMBER AMBANG DIPINDAH KE KONTEN. Sampai rev 38
 * daftar ini adalah 8 id hardcoded DI SINI, yang berarti: (a) 13 kasus infeksi
 * batch lab tak pernah bisa berkluster walau epidemiologinya menuntut, dan
 * (b) satu-satunya cara mendaftarkan kasus menular baru adalah membuka Golden
 * Master. Ambang kini dideklarasikan pada kasusnya sendiri
 * (`KasusKlinis.ambangKluster`) dan dibaca lewat `ambangKlusterPack()`, jadi
 * konten menular baru terintegrasi otomatis tanpa menyentuh file beku ini.
 */
export type AmbangKluster = Readonly<Record<string, number>>

/** Peta ambang efektif dari konten — satu-satunya sumber kebenaran. */
export function ambangKlusterPack(pack: ContentPack): AmbangKluster {
  const out: Record<string, number> = {}
  for (const kasus of Object.values(pack.kasus)) {
    if (kasus.ambangKluster !== undefined) out[kasus.id] = kasus.ambangKluster
  }
  return out
}

export function kasusMenular(kasus: { ambangKluster?: number }): boolean {
  return kasus.ambangKluster !== undefined
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
export function hitungCluster(
  entries: SurveilansEntry[],
  hariIni: number,
  ambangKluster: AmbangKluster,
): Cluster[] {
  const hitung = new Map<string, Cluster>()
  for (const e of pangkasSurveilans(entries, hariIni)) {
    const kunci = `${e.rw}|${e.kasusId}`
    const ada = hitung.get(kunci)
    if (ada) ada.jumlah += 1
    else hitung.set(kunci, { rw: e.rw, kasusId: e.kasusId, jumlah: 1 })
  }
  const out: Cluster[] = []
  for (const c of hitung.values()) {
    const ambang = ambangKluster[c.kasusId]
    if (ambang !== undefined && c.jumlah >= ambang) out.push(c)
  }
  return out.sort((a, b) => b.jumlah - a.jumlah)
}

/** Kluster aktif dari state (util untuk UI Peta & Director). */
export function clusterAktif(state: GameState, pack: ContentPack): Cluster[] {
  return hitungCluster(state.desa.surveilans, state.hari, ambangKlusterPack(pack))
}
