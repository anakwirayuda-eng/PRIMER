/**
 * TRANSKRIP KUNJUNGAN TAHAN-RESTART (usulan Claude 2026-07-23, disetujui).
 *
 * Masalah: riwayat ucapan ("TERDENGAR" di babak Diagnosis Perilaku) hidup di
 * state React lokal — app ditutup/crash di tengah kunjungan lalu dilanjutkan
 * dari autosave membuat rekap kosong padahal dialog sudah berjalan.
 *
 * Solusi: rekonstruksi murni dari state tersimpan. Ini MENIRU PERSIS aturan
 * gerbang kejujuran engine (kunjungan.ts, case PILIH_DIALOG ± baris 288-319):
 *   - trustDelta terakumulasi per pilihan (kj.trustDelta menyimpan totalnya);
 *   - utk pilihan ber-`ungkap`, teks warga = respons jujur bila
 *     trustEfektif (trust keluarga + delta SETELAH pilihan itu) ≥ ambangTrust,
 *     selain itu responsBohong — TANPA penanda, sesuai pedagogi kontradiksi.
 * Baseline delta pra-wawancara dihitung mundur (kj.trustDelta dikurangi total
 * efekTrust seluruh pilihan) sehingga kontribusi fase lain ikut terbawa benar.
 *
 * Kontrak kesetaraan dgn engine dipagari test silang di transkrip.test.ts
 * (membandingkan hasil rekonstruksi dgn event WARGA_BICARA aksiKunjungan
 * sungguhan) — bila aturan engine berubah, test itu merah, bukan drift senyap.
 */

import type { SkenarioKunjungan } from '@content/types'

export interface UcapanTranskrip {
  peran: 'dokter' | 'warga'
  teks: string
}

export function rekonstruksiTranskrip(
  skenario: Pick<SkenarioKunjungan, 'dialog'>,
  pilihanDiambil: readonly string[],
  trustKeluarga: number,
  trustDeltaKini: number,
): UcapanTranskrip[] {
  // Pasangkan tiap pilihan tersimpan dgn node-nya (indeks i ↔ dialog[i] —
  // engine menaikkan dialogIndex tepat satu per PILIH_DIALOG).
  const langkah: SkenarioKunjungan['dialog'][number]['pilihan'][number][] = []
  let totalEfek = 0
  pilihanDiambil.forEach((id, i) => {
    const pilihan = skenario.dialog[i]?.pilihan.find((p) => p.id === id)
    if (!pilihan) return // konten berubah/korup — lewati dgn anggun, jangan crash
    langkah.push(pilihan)
    totalEfek += pilihan.efekTrust
  })

  let delta = trustDeltaKini - totalEfek // baseline pra-wawancara
  const hasil: UcapanTranskrip[] = []
  for (const pilihan of langkah) {
    hasil.push({ peran: 'dokter', teks: pilihan.teks })
    delta += pilihan.efekTrust
    if (pilihan.ungkap) {
      const trustEfektif = trustKeluarga + delta
      hasil.push({
        peran: 'warga',
        teks: trustEfektif >= pilihan.ungkap.ambangTrust ? pilihan.respons : pilihan.ungkap.responsBohong,
      })
    } else {
      hasil.push({ peran: 'warga', teks: pilihan.respons })
    }
  }
  return hasil
}
