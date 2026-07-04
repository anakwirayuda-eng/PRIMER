// Konfigurasi RS komons per-pod — dipakai GM saat membuat pod baru untuk
// mengisi kolom `pod_states.rs_beds`. Kapasitas SENGAJA kecil (bed sedikit)
// supaya rebutan "STEMI-ku merebut kasurmu" terasa dalam 1 sesi kelas singkat.

import type { BedRS } from '@/lib/types'

export const RS_KOMONS_DEFAULT: Record<string, BedRS> = {
  puskesmas_rawat_inap: {
    nama: 'Puskesmas Rawat Inap',
    kelas: 'D',
    spesialisasi: ['interna'],
    bedTotal: 4,
    bedTerpakai: 0,
  },
  rsud_kabupaten: {
    nama: 'RSUD Kabupaten',
    kelas: 'C',
    spesialisasi: ['interna', 'bedah', 'anak', 'obgyn'],
    bedTotal: 6,
    bedTerpakai: 0,
  },
  rs_rujukan_provinsi: {
    nama: 'RS Rujukan Provinsi',
    kelas: 'B',
    spesialisasi: ['jantung', 'saraf', 'bedah', 'anak', 'obgyn', 'interna'],
    bedTotal: 3,
    bedTerpakai: 0,
  },
}
