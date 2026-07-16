/**
 * LAPISAN VARIAN KUNJUNGAN TINGKAT-A (M11 #5 B1, 2026-07-17).
 *
 * Padanan persis `varianTingkatA.ts` (UKP) — lapisan terpisah dari
 * literal skenario di keluarga/desa*.ts, diterapkan sekali di titik rakit
 * PACK (index.ts). Kunci peta = id skenario (unik lintas 16 keluarga,
 * dijaga pack.test.ts) — flat, bukan bersarang per-keluarga, krn skenario
 * tak pernah berbagi id lintas keluarga.
 */
import type { ContentCatalog } from './pack'
import { VARIAN_KUNJUNGAN_TINGKAT_A } from './varianKunjunganTingkatAData'

export function terapkanVarianKunjunganTingkatA(katalog: ContentCatalog): ContentCatalog {
  const entri = Object.entries(VARIAN_KUNJUNGAN_TINGKAT_A)
  if (entri.length === 0) return katalog
  const sisaPeta = new Map(entri)
  const keluarga = { ...katalog.keluarga }
  for (const [kelId, kel] of Object.entries(keluarga)) {
    let berubah = false
    const kunjunganBaru = kel.arc.kunjungan.map((sk) => {
      const varian = sisaPeta.get(sk.id)
      if (!varian) return sk
      sisaPeta.delete(sk.id)
      if (sk.varianKunjungan?.length) {
        throw new Error(
          `Varian Kunjungan Tingkat-A: skenario '${sk.id}' sudah punya varianKunjungan inline — satu sumber saja (hapus salah satu)`,
        )
      }
      berubah = true
      return { ...sk, varianKunjungan: varian }
    })
    if (berubah) keluarga[kelId] = { ...kel, arc: { ...kel.arc, kunjungan: kunjunganBaru } }
  }
  if (sisaPeta.size > 0) {
    throw new Error(
      `Varian Kunjungan Tingkat-A: id skenario tidak ada di katalog manapun: ${[...sisaPeta.keys()].join(', ')}`,
    )
  }
  return { ...katalog, keluarga }
}
