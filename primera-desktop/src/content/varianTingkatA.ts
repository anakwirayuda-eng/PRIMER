/**
 * LAPISAN VARIAN PRESENTASI TINGKAT-A (M11 #4, 2026-07-16).
 *
 * Varian ditaruh di LAPISAN TERPISAH (bukan menyunting literal kasus di
 * kasus/*.ts, lab/batch*.ts, dan curriculum/m13_1a) — alasan yang sama
 * dengan lapisan pengayaan lab (lab/enrichment.ts): (a) konten varian mudah
 * ditinjau/diadjudikasi terpisah saat porting ke repo produksi, (b) kasus
 * dasar tetap satu sumber, (c) tak perlu menyentuh 10 file konten dgn 3
 * bentuk authoring berbeda (literal / buatKasusLab / buatKasusFktpLab —
 * bentuk padat FktpLabSpec bahkan tak memuat field varianPresentasi).
 *
 * Diterapkan SEKALI di titik rakit PACK (index.ts), SETELAH aktivasi katalog
 * M13-1a supaya kasus hasil aktivasi (mis. diare_akut_bayi_dehidrasi_berat)
 * ikut terjangkau. Integritas isi varian dijaga `validasiPack` (pack.ts);
 * integritas peta ini (id kasus harus ada, tak boleh dobel sumber) dijaga
 * di sini secara fail-fast.
 */
import type { ContentCatalog } from './pack'
import { VARIAN_TINGKAT_A } from './varianTingkatAData'

export function terapkanVarianTingkatA(katalog: ContentCatalog): ContentCatalog {
  const entri = Object.entries(VARIAN_TINGKAT_A)
  if (entri.length === 0) return katalog
  const kasus = { ...katalog.kasus }
  for (const [id, varian] of entri) {
    const dasar = kasus[id]
    if (!dasar) {
      throw new Error(`Varian Tingkat-A: kasus '${id}' tidak ada di katalog`)
    }
    if (dasar.varianPresentasi?.length) {
      throw new Error(
        `Varian Tingkat-A: kasus '${id}' sudah punya varianPresentasi inline — satu sumber saja (hapus salah satu)`,
      )
    }
    kasus[id] = { ...dasar, varianPresentasi: varian }
  }
  return { ...katalog, kasus }
}
