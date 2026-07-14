/**
 * PAKET UJIAN (M4.5) — pool seed kurikulum untuk Mode Ujian 30 hari.
 * Desain lengkap: docs/M45_MODE_UJIAN.md. Ringkasnya: satu paket = satu
 * kurikulum (urutan kasus Director + pola IGD) yang SAMA untuk semua
 * mahasiswa pemegang paket itu; identitas pasien & lemparan dadu tetap
 * per-mahasiswa (seed flavor).
 *
 * Rotasi ≥8 paket adalah syarat WAJIB anti-walkthrough (blind spot DeepThink):
 * kunci jawaban harus ditulis 8 kali, dan penulisnya tak tahu paket temannya.
 * Menambah paket = menambah baris — tanpa perubahan arsitektur.
 *
 * Seed dipilih manual acak-tetap; JANGAN diubah setelah dipakai satu angkatan
 * (mengubah seed = mengubah soal ujian yang sudah beredar).
 */

import type { ModeStase } from './state'
import { CONTENT_RELEASE } from '@content/pack'
import { EXAM_BLUEPRINT_VERSION } from './examBlueprint'

export interface PaketUjian {
  id: string
  nama: string
  seedKurikulum: number
  /** Pin eksplisit: satu paket tidak boleh diam-diam pindah blueprint/rilis. */
  blueprintVersion: string
  contentRelease: string
}

export const PAKET_UJIAN: PaketUjian[] = [
  { id: 'paket_a', nama: 'Paket A', seedKurikulum: 911_442_083 },
  { id: 'paket_b', nama: 'Paket B', seedKurikulum: 274_618_559 },
  { id: 'paket_c', nama: 'Paket C', seedKurikulum: 638_105_927 },
  { id: 'paket_d', nama: 'Paket D', seedKurikulum: 452_390_161 },
  { id: 'paket_e', nama: 'Paket E', seedKurikulum: 787_264_303 },
  { id: 'paket_f', nama: 'Paket F', seedKurikulum: 129_853_741 },
  { id: 'paket_g', nama: 'Paket G', seedKurikulum: 560_711_489 },
  { id: 'paket_h', nama: 'Paket H', seedKurikulum: 343_976_215 },
].map((paket) => ({
  ...paket,
  blueprintVersion: EXAM_BLUEPRINT_VERSION,
  contentRelease: CONTENT_RELEASE,
}))

/** Pilih paket deterministik dari seed flavor mahasiswa (terdistribusi merata). */
export function pilihPaket(seedFlavor: number): PaketUjian {
  return PAKET_UJIAN[Math.abs(seedFlavor) % PAKET_UJIAN.length]!
}

export function paketUjianDariId(id: string | undefined): PaketUjian | undefined {
  return id ? PAKET_UJIAN.find((paket) => paket.id === id) : undefined
}

/** Durasi stase per mode (hari terakhir yang dimainkan). */
export const HARI_STASE: Record<ModeStase, number> = { karier: 90, ujian: 30 }
