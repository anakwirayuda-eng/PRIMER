// Dek kartu pasien starter — v0 vertical slice. Konten SIMULASI PEMBELAJARAN,
// disederhanakan dari taksonomi kasus primera-desktop (bukan salinan 1:1 —
// codebase ini terpisah). Nanti bisa diperluas / disinkron dgn engine kasus.

import type { KartuPasien } from '@/lib/types'

export const DEK_KASUS: KartuPasien[] = [
  {
    nama: 'Pak Slamet, 58th',
    usia: 58,
    keluhan: 'Nyeri dada kiri menjalar ke lengan, keringat dingin, 30 menit',
    icd10: 'I21.9',
    kegawatan: 'tinggi',
    spesialisasiButuh: 'jantung',
  },
  {
    nama: 'Bu Ratna, 34th',
    usia: 34,
    keluhan: 'Demam 3 hari, nyeri kepala, tidak ada tanda bahaya',
    icd10: 'A90',
    kegawatan: 'rendah',
    spesialisasiButuh: 'interna',
  },
  {
    nama: 'Andi, 8th',
    usia: 8,
    keluhan: 'Sesak napas berat, wheezing, retraksi dinding dada',
    icd10: 'J45.901',
    kegawatan: 'tinggi',
    spesialisasiButuh: 'anak',
  },
  {
    nama: 'Bu Yanti, 29th',
    usia: 29,
    keluhan: 'Hamil 38 minggu, kontraksi teratur, pembukaan 4cm',
    icd10: 'O80',
    kegawatan: 'sedang',
    spesialisasiButuh: 'obgyn',
  },
  {
    nama: 'Pak Darto, 45th',
    usia: 45,
    keluhan: 'Luka robek dalam di betis akibat kecelakaan motor',
    icd10: 'S81.0',
    kegawatan: 'sedang',
    spesialisasiButuh: 'bedah',
  },
  {
    nama: 'Dik Fira, 16th',
    usia: 16,
    keluhan: 'Batuk pilek ringan 2 hari, tanpa demam',
    icd10: 'J06.9',
    kegawatan: 'rendah',
    spesialisasiButuh: 'interna',
  },
  {
    nama: 'Pak Wawan, 62th',
    usia: 62,
    keluhan: 'Bicara pelo mendadak, lemah separuh tubuh kanan, 1 jam lalu',
    icd10: 'I63.9',
    kegawatan: 'tinggi',
    spesialisasiButuh: 'saraf',
  },
  {
    nama: 'Bu Sri, 51th',
    usia: 51,
    keluhan: 'Nyeri perut kanan atas, mual, riwayat batu empedu',
    icd10: 'K80.2',
    kegawatan: 'sedang',
    spesialisasiButuh: 'bedah',
  },
]

export function kartuAcak(rng: () => number): KartuPasien {
  const idx = Math.min(Math.floor(rng() * DEK_KASUS.length), DEK_KASUS.length - 1)
  return DEK_KASUS[idx]!
}
