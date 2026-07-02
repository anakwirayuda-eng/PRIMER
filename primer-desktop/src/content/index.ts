/**
 * PACK RAKITAN — satu-satunya titik masuk konten ke engine/UI.
 * Semua file konten diimpor di sini; validasi silang berjalan saat boot (dev).
 */

import type { ContentPack } from './pack'
import { validasiPack } from './pack'
import type { KasusKlinis, KeluargaBinaan } from './types'
import { KASUS_INFEKSI } from './kasus/kasusInfeksi'
import { KASUS_KRONIS } from './kasus/kasusKronis'
import { KELUARGA_DESA_A } from './keluarga/desaA'
import { KELUARGA_DESA_B, KADER_PROFIL, RW_PROFIL } from './keluarga/desaB'
import { OBAT, LAB, EDUKASI } from './katalog'
import { SKDI144 } from './skdi144'
import { NAMA_WARGA } from './nama'

function byId<T extends { id: string }>(arr: T[]): Record<string, T> {
  const out: Record<string, T> = {}
  for (const item of arr) {
    if (out[item.id]) throw new Error(`Konten duplikat id: ${item.id}`)
    out[item.id] = item
  }
  return out
}

const semuaKasus: KasusKlinis[] = [...KASUS_INFEKSI, ...KASUS_KRONIS]
const semuaKeluarga: KeluargaBinaan[] = [...KELUARGA_DESA_A, ...KELUARGA_DESA_B]

export const PACK: ContentPack = {
  kasus: byId(semuaKasus),
  keluarga: byId(semuaKeluarga),
  kader: KADER_PROFIL,
  rw: RW_PROFIL,
  obat: OBAT,
  lab: LAB,
  edukasi: EDUKASI,
  skdi144: SKDI144,
  namaWarga: NAMA_WARGA,
}

// Fail-fast saat dev: drift id konten ketahuan sebelum sampai ke pemain.
if (import.meta.env?.DEV) {
  const masalah = validasiPack(PACK)
  if (masalah.length > 0) {
    console.warn(`[PACK] ${masalah.length} masalah konten:`, masalah)
  }
}
