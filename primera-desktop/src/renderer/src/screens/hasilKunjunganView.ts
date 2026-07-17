import type { HasilKunjungan } from '@engine/state'

export interface TampilanHasilKunjungan {
  label: string
  labelRingkas: string
  kelasWarna: 'stempel--hijau' | 'stempel--kunyit' | 'stempel--merah' | 'stempel--biru'
  substantif: boolean
}

export function tampilanHasilKunjungan(hasil: HasilKunjungan): TampilanHasilKunjungan {
  switch (hasil.hasilAkhir) {
    case 'berhasil':
      return { label: 'KUNJUNGAN BERHASIL', labelRingkas: 'Berhasil', kelasWarna: 'stempel--hijau', substantif: true }
    case 'partial':
      return { label: 'HASIL SEBAGIAN', labelRingkas: 'Hasil sebagian', kelasWarna: 'stempel--kunyit', substantif: true }
    case 'gagal':
      return { label: 'BELUM BERHASIL', labelRingkas: 'Belum berbuah', kelasWarna: 'stempel--kunyit', substantif: true }
    case 'diusir':
      return { label: 'DIPERSILAKAN PULANG', labelRingkas: 'Diusir', kelasWarna: 'stempel--merah', substantif: true }
    case 'ditolak_total':
      return { label: 'KUNJUNGAN DITOLAK DENGAN BAIK', labelRingkas: 'Ditolak, janji ulang', kelasWarna: 'stempel--biru', substantif: false }
    case 'diterima_terpaksa':
      return { label: 'KONTAK DITUTUP, JANJI ULANG', labelRingkas: 'Diterima terpaksa', kelasWarna: 'stempel--biru', substantif: false }
  }
}
