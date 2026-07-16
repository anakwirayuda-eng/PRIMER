/**
 * PACK RAKITAN — satu-satunya titik masuk konten ke engine/UI.
 * Semua file konten diimpor di sini; validasi silang berjalan saat boot (dev).
 */

import type { ContentCatalog, RuntimeContentPack } from './pack'
import { CONTENT_RELEASE, CONTENT_RELEASE_ORDER, validasiPack } from './pack'
import type { KasusKlinis, KeluargaBinaan } from './types'
import { KASUS_INFEKSI } from './kasus/kasusInfeksi'
import { KASUS_KRONIS } from './kasus/kasusKronis'
import { KELUARGA_DESA_A } from './keluarga/desaA'
import { KELUARGA_DESA_B, KADER_PROFIL, RW_PROFIL } from './keluarga/desaB'
import { KELUARGA_DESA_C } from './keluarga/desaC'
import { KELUARGA_DESA_D } from './keluarga/desaD'
import { KELUARGA_DESA_E } from './keluarga/desaE'
import { KELUARGA_DESA_F } from './keluarga/desaF'
import { RUMAH_SAKIT } from './rumahSakit'
import { OBAT, LAB, EDUKASI } from './katalog'
import { OBAT_M3, LAB_M3, EDUKASI_M3, TINDAKAN_M3 } from './katalogM3'
import { KASUS_RESPIRASI_GI } from './kasus/kasusRespGi'
import { KASUS_KULIT } from './kasus/kasusKulit'
import { KASUS_SARAF_MATA_THT } from './kasus/kasusSarafMataTht'
import { KASUS_METABOLIK_MSK } from './kasus/kasusMetabolikMsk'
import { KASUS_KIA_JIWA } from './kasus/kasusKiaJiwa'
import { KASUS_IGD } from './igd'
import { KASUS_IGD_LAB_1 } from './igdLab1'
import { KASUS_IGD_LAB_2 } from './igdLab2'
import { SKDI144 } from './skdi144'
import { NAMA_WARGA } from './nama'
import { buildCurriculumBlueprint, validasiCurriculumBlueprint } from './curriculum'
import {
  aktifkanBlueprintM13_1A,
  aktifkanKatalogM13_1A,
} from './curriculum/m13_1a/activation'
import { LAB_ALL_CASES, LAB_CASE_ID_BY_FKTP_ITEM } from './lab'
import { EDUKASI_LAB, LAB_LAB, OBAT_LAB, TINDAKAN_LAB } from './lab/catalog'
import {
  EDUKASI_LAB_EXPANSION,
  LAB_LAB_EXPANSION,
  OBAT_LAB_EXPANSION,
  TINDAKAN_LAB_EXPANSION,
} from './lab/catalogExpansion'
import {
  EDUKASI_LAB_BATCH4,
  LAB_LAB_BATCH4,
  OBAT_LAB_BATCH4,
  TINDAKAN_LAB_BATCH4,
} from './lab/catalogBatch4'

function byId<T extends { id: string }>(arr: T[]): Record<string, T> {
  const out: Record<string, T> = {}
  for (const item of arr) {
    if (out[item.id]) throw new Error(`Konten duplikat id: ${item.id}`)
    out[item.id] = item
  }
  return out
}

const semuaKasusDasar: KasusKlinis[] = [
  ...KASUS_INFEKSI,
  ...KASUS_KRONIS,
  ...KASUS_RESPIRASI_GI,
  ...KASUS_KULIT,
  ...KASUS_SARAF_MATA_THT,
  ...KASUS_METABOLIK_MSK,
  ...KASUS_KIA_JIWA,
  ...LAB_ALL_CASES,
]
const semuaKeluargaDasar: KeluargaBinaan[] = [
  ...KELUARGA_DESA_A,
  ...KELUARGA_DESA_B,
  ...KELUARGA_DESA_C,
  ...KELUARGA_DESA_D,
  ...KELUARGA_DESA_E,
  ...KELUARGA_DESA_F,
]

const kasusDasarById = byId(semuaKasusDasar)

// Tautkan Dex 144 ke kasus playable via kecocokan ICD-10 (agar penulis kasus
// tidak perlu menyentuh skdi144.ts — anti-konflik antar penulis konten).
const skdi144Tertaut = SKDI144.map((entri) => {
  const kasusLabId = LAB_CASE_ID_BY_FKTP_ITEM[entri.id]
  if (kasusLabId) return { ...entri, kasusId: kasusLabId }
  if (entri.kasusId) return entri
  const kasusCocok = semuaKasusDasar.find((k) => k.icd10 === entri.icd10)
  return kasusCocok ? { ...entri, kasusId: kasusCocok.id } : entri
})

const BASE_CONTENT_CATALOG: ContentCatalog = {
  kasus: kasusDasarById,
  // M13 Batch 4: +14 kasus IGD prototipe lab (Career-only via activationStatus).
  kasusIgd: byId([...KASUS_IGD, ...KASUS_IGD_LAB_1, ...KASUS_IGD_LAB_2]),
  keluarga: byId(semuaKeluargaDasar),
  kader: KADER_PROFIL,
  rw: RW_PROFIL,
  rumahSakit: RUMAH_SAKIT,
  obat: { ...OBAT, ...OBAT_M3, ...OBAT_LAB, ...OBAT_LAB_EXPANSION, ...OBAT_LAB_BATCH4 },
  lab: { ...LAB, ...LAB_M3, ...LAB_LAB, ...LAB_LAB_EXPANSION, ...LAB_LAB_BATCH4 },
  edukasi: { ...EDUKASI, ...EDUKASI_M3, ...EDUKASI_LAB, ...EDUKASI_LAB_EXPANSION, ...EDUKASI_LAB_BATCH4 },
  tindakan: { ...TINDAKAN_M3, ...TINDAKAN_LAB, ...TINDAKAN_LAB_EXPANSION, ...TINDAKAN_LAB_BATCH4 },
  skdi144: skdi144Tertaut,
  namaWarga: NAMA_WARGA,
}

const BASE_CURRICULUM_BLUEPRINT = buildCurriculumBlueprint(BASE_CONTENT_CATALOG)
const CONTENT_CATALOG = aktifkanKatalogM13_1A(BASE_CONTENT_CATALOG)

/** M13-0A + M13-1a: manifest authoring kanonik lengkap, termasuk evidence registry. */
export const CURRICULUM_BLUEPRINT = aktifkanBlueprintM13_1A(BASE_CURRICULUM_BLUEPRINT)

/**
 * M13-0C: runtime hanya membawa proyeksi keputusan draw/credit. Evidence dan
 * metadata authoring tetap di CURRICULUM_BLUEPRINT, di luar jalur game.
 */
export const PACK: RuntimeContentPack = {
  ...CONTENT_CATALOG,
  runtimeManifest: {
    schemaVersion: 1,
    contentRelease: CONTENT_RELEASE,
    releaseOrder: [...CONTENT_RELEASE_ORDER],
    encounterArchetypes: CURRICULUM_BLUEPRINT.encounterArchetypes,
    ukmScenarios: CURRICULUM_BLUEPRINT.ukmScenarios,
  },
}

// Fail-fast saat dev: drift id konten ketahuan sebelum sampai ke pemain (CODEX
// P2 — sekadar console.warn tidak "fail-fast" sungguhan; lempar error di dev
// supaya penulis konten tak bisa mengabaikannya). Test wajib di pack.test.ts
// menjaring hal yang sama di CI terlepas dari mode DEV.
if (import.meta.env?.DEV) {
  const masalah = [
    ...validasiPack(PACK),
    ...validasiCurriculumBlueprint(CURRICULUM_BLUEPRINT, PACK),
  ]
  if (masalah.length > 0) {
    throw new Error(`[PACK] ${masalah.length} masalah konten:\n${masalah.join('\n')}`)
  }
}
