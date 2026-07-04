/**
 * ACAK URUTAN JAWABAN — pertahanan thd walkthrough mekanis (DeepThink ronde-2
 * bonus, keputusan user). Walkthrough "di langkah X klik pilihan ke-2" yang
 * dibagi lintas-angkatan via WhatsApp cuma berfungsi bila urutan tampil SAMA
 * utk semua orang. Diacak per-mahasiswa pakai `rngFlavor` (seed per-mahasiswa
 * M4.5, BUKAN seedKurikulum yg dibagi bersama) + konteks pertanyaan — jadi
 * "klik posisi ke-2" tak lagi berarti sama utk siswa lain, sementara konten &
 * skor (dispatch by pilihanId, bukan index) sama sekali tak berubah.
 */
import { Rng, hashSeed } from '@engine/core/rng'

export function acakUrutan<T>(items: readonly T[], seedFlavor: number, ...konteks: (string | number)[]): T[] {
  return new Rng(hashSeed('urutan-jawaban', seedFlavor, ...konteks)).shuffle(items)
}
