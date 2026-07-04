/**
 * GUARD bahasa pasien (M7 34c) — jargon dokter TIDAK boleh keluar dari mulut
 * pasien. Ucapan pasien = `jawab` + semua `variasi` per persona (termasuk
 * 'terpelajar' = awam berpendidikan, BUKAN sejawat). Istilah klinis Latin/
 * Inggris hanya sah di teks DOKTER (temuan fisik, clue, edukasi) — bukan di
 * sini. Audit awal menemukan 79 pelanggaran, semua di 'terpelajar'; guard ini
 * mencegah konten baru mengulanginya. Lihat catatan gaya di types.ts Persona.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from './index'

// Hanya istilah yang HAMPIR PASTI salah bila diucapkan pasien awam. Konservatif:
// istilah awam yang sah ("darah tinggi", "biduran", "asam urat", "amandel")
// sengaja TIDAK masuk daftar.
const JARGON_TERLARANG = [
  'wheal', 'eritematosa', 'eritem', 'evanescent', 'makula', 'papul', 'papula',
  'vesikel', 'pustul', 'urtika', 'ekskoriasi', 'likenifikasi', 'deskuamasi',
  'skuama', 'krusta', 'maserasi', 'verukosa', 'anular', 'sentrifugal', 'sentripetal',
  'dispnea', 'dispneu', 'ortopnea', 'paroksismal', 'hemoptisis', 'hematemesis',
  'melena', 'disuria', 'hematuria', 'poliuria', 'polidipsia', 'polifagia',
  'diaforesis', 'sianosis', 'ikterik', 'pruritus', 'parestesia', 'klaudikasio',
  'febris', 'afebris', 'odinofagia', 'disfagia', 'rinorea', 'otorea', 'takipnea',
  'retraksi', 'sputum', 'mukoid', 'mukopurulen', 'purulen', 'tenesmus', 'defekasi',
  'epigastrium', 'epigastrik', 'periumbilikal', 'retrosternal', 'regurgitasi',
  'okular', 'palpebra', 'konjungtiva', 'kavum nasi', 'oksipital', 'occipital',
  'lumbal', 'muskular', 'monoartikular', 'poliartritis', 'artralgia', 'artritis',
  'edema', 'nokturnal', 'onset', 'intermiten', 'episodik', 'insidental',
  'anhedonia', 'insomnia inisial', 'tonik-klonik', 'postiktal', 'neuralgik',
  'parese', 'disartria', 'hemiparesis', 'antenatal', 'gestasi', 'hiperglikemia',
  'subfebris', 'stepladder', 'wheezing', 'ekspiratoar', 'lesi', 'kontaktan',
  'toleransi aktivitas', 'weight-bearing', 'mcburney', 'nyha', 'ldl', 'lipid',
  'kontrasepsi', 'visus', 'injeksi konjungtiva', 'serosa', 'konduktif', 'obstruksi nasi',
]

describe('bahasa pasien — jargon dokter tak bocor (M7 34c)', () => {
  it('tidak ada istilah klinis di jawab/variasi seluruh kasus', () => {
    const pelanggaran: string[] = []
    for (const kasus of Object.values(PACK.kasus)) {
      const cek = (label: string, teks: unknown) => {
        if (typeof teks !== 'string') return
        for (const j of JARGON_TERLARANG) {
          if (new RegExp(`\\b${j}\\b`, 'i').test(teks)) {
            pelanggaran.push(`${kasus.id} | ${label} | "${j}" | ${teks.slice(0, 80)}`)
          }
        }
      }
      for (const q of kasus.anamnesis ?? []) {
        cek(`${q.id}.jawab`, q.jawab)
        for (const [persona, v] of Object.entries(q.variasi ?? {})) cek(`${q.id}.${persona}`, v)
      }
    }
    expect(pelanggaran).toEqual([])
  })
})
