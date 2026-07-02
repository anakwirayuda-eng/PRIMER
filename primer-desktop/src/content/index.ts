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
import { RUMAH_SAKIT } from './rumahSakit'
import { OBAT, LAB, EDUKASI } from './katalog'
import { OBAT_M3, LAB_M3, EDUKASI_M3, TINDAKAN_M3 } from './katalogM3'
import { KASUS_RESPIRASI_GI } from './kasus/kasusRespGi'
import { KASUS_KULIT } from './kasus/kasusKulit'
import { KASUS_SARAF_MATA_THT } from './kasus/kasusSarafMataTht'
import { KASUS_METABOLIK_MSK } from './kasus/kasusMetabolikMsk'
import { KASUS_KIA_JIWA } from './kasus/kasusKiaJiwa'
import { KASUS_IGD } from './igd'
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

const semuaKasus: KasusKlinis[] = [
  ...KASUS_INFEKSI,
  ...KASUS_KRONIS,
  ...KASUS_RESPIRASI_GI,
  ...KASUS_KULIT,
  ...KASUS_SARAF_MATA_THT,
  ...KASUS_METABOLIK_MSK,
  ...KASUS_KIA_JIWA,
]
const semuaKeluarga: KeluargaBinaan[] = [...KELUARGA_DESA_A, ...KELUARGA_DESA_B]

const kasusById = byId(semuaKasus)

// Tautkan Dex 144 ke kasus playable via kecocokan ICD-10 (agar penulis kasus
// tidak perlu menyentuh skdi144.ts — anti-konflik antar penulis konten).
const skdi144Tertaut = SKDI144.map((entri) => {
  if (entri.kasusId) return entri
  const kasusCocok = semuaKasus.find((k) => k.icd10 === entri.icd10)
  return kasusCocok ? { ...entri, kasusId: kasusCocok.id } : entri
})

export const PACK: ContentPack = {
  kasus: kasusById,
  kasusIgd: byId(KASUS_IGD),
  keluarga: byId(semuaKeluarga),
  kader: KADER_PROFIL,
  rw: RW_PROFIL,
  rumahSakit: RUMAH_SAKIT,
  obat: { ...OBAT, ...OBAT_M3 },
  lab: { ...LAB, ...LAB_M3 },
  edukasi: { ...EDUKASI, ...EDUKASI_M3 },
  tindakan: TINDAKAN_M3,
  skdi144: skdi144Tertaut,
  namaWarga: NAMA_WARGA,
}

// Fail-fast saat dev: drift id konten ketahuan sebelum sampai ke pemain.
if (import.meta.env?.DEV) {
  const masalah = validasiPack(PACK)
  if (masalah.length > 0) {
    console.warn(`[PACK] ${masalah.length} masalah konten:`, masalah)
  }
}
