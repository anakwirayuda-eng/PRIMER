// Fungsi PENILAIAN — murni & deterministik (tanpa I/O), agar hasilnya bisa
// diverifikasi ulang dari log `actions` kapan saja (pola sama dgn engine
// primer-desktop: logika skor dipisah dari efek samping DB/realtime).
//
// Prinsip desain (ROADMAP.md, Sistema): skor di sini BUKAN nilai akhir mahasiswa
// — hanya substrat "Kartu Rapor Keputusan" untuk bahan Refleksi yang dinilai
// dosen. Jangan jadikan angka ini terlihat sbg leaderboard kompetitif.

import type { KartuPasien, KlaimBedResult } from './types'

export interface HasilNilai {
  score: number
  alasan: string
}

export function nilaiKeputusan(
  pasien: KartuPasien,
  keputusan: 'tuntas' | 'rujuk',
  rsSpesialisasi: string[] | null,
  hasilKlaim: KlaimBedResult | null
): HasilNilai {
  if (keputusan === 'tuntas') {
    if (pasien.kegawatan === 'tinggi') {
      return { score: -2, alasan: 'Kegawatan tinggi ditangani tuntas di Puskesmas — seharusnya dirujuk.' }
    }
    if (pasien.kegawatan === 'sedang') {
      return { score: 0, alasan: 'Kegawatan sedang ditangani tuntas — batas kewenangan, perlu evaluasi.' }
    }
    return { score: 2, alasan: 'Kegawatan rendah tuntas di Puskesmas — tepat, tidak membebani RS.' }
  }

  // keputusan === 'rujuk'
  if (pasien.kegawatan === 'rendah') {
    return { score: -1, alasan: 'Rujukan berlebih (over-referral) untuk kasus kegawatan rendah.' }
  }

  const spesialisasiCocok = rsSpesialisasi?.includes(pasien.spesialisasiButuh) ?? true
  if (!spesialisasiCocok) {
    return { score: -1, alasan: `RS tujuan tidak punya spesialisasi ${pasien.spesialisasiButuh} — salah pilih rujukan.` }
  }

  if (hasilKlaim && !hasilKlaim.ok) {
    return {
      score: 0,
      alasan:
        hasilKlaim.reason === 'penuh'
          ? 'Keputusan rujuk tepat, tapi bed RS penuh (komons direbut rujukan lain).'
          : 'Keputusan rujuk tepat, klaim bed belum berhasil.',
    }
  }

  return { score: 2, alasan: 'Rujuk tepat indikasi & tepat spesialisasi RS.' }
}
