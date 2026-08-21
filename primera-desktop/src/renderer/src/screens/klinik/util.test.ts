/**
 * Test util klinik — dua keluhan playtest user (2026-07-03):
 * 1. Pilihan diagnosis banding tampil "Kode M06.9" tanpa nama.
 * 2. Pencarian obat gagal karena ejaan Inggris (paracetamol/amoxicillin/
 *    cetirizine) vs nama katalog Indonesia (Parasetamol/Amoksisilin/Setirizin).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { NAMA_ICD } from '@content/icd10'
import { cocokLab, cocokObat, namaDiagnosis, normalisasiNamaObat } from './util'

describe('namaDiagnosis — semua banding bernama', () => {
  it('kode dari screenshot playtest (M06.9, M54.5) kini bernama', () => {
    const mialgia = PACK.kasus['mm_mialgia']!
    for (const kode of mialgia.diagnosisBanding) {
      expect(namaDiagnosis(kode, mialgia)).not.toMatch(/^Kode /)
    }
  })

  it('TIDAK ADA kode banding mana pun yang jatuh ke fallback "Kode X"', () => {
    const telanjang: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      for (const kode of k.diagnosisBanding) {
        if (namaDiagnosis(kode, k).startsWith('Kode ')) telanjang.push(`${k.id}:${kode}`)
      }
    }
    expect(telanjang).toEqual([])
  })

  // Audit label 2026-08-22: label DISTRAKTOR tak boleh lagi bersumber dari nama
  // kasus playable lain. Lapisan itu membuat identitas kasus lain — berikut
  // penanda demografi & narasi gejalanya — bocor ke deck kasus yang
  // demografinya bertolak belakang ("Epilepsi Dewasa" di deck balita kejang
  // demam, "Mastoiditis Akut pada Anak" di deck pasien 15-40 th). Penjaga ini
  // memastikan lapisan itu tidak bisa dipasang kembali diam-diam: nama tiap
  // distraktor wajib SAMA PERSIS dengan sumber kurasi (SKDI-144 atau kamus
  // icd10.ts), bukan dengan nama kasus mana pun.
  it('label distraktor TIDAK PERNAH meminjam nama kasus playable lain', () => {
    const namaKasusLain = new Map<string, string>(
      Object.values(PACK.kasus).map((k) => [k.icd10, k.nama]),
    )
    const sumberKurasi = (kode: string): string | undefined =>
      PACK.skdi144.find((e) => e.icd10 === kode)?.nama ?? NAMA_ICD[kode]

    const meminjam: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      for (const kode of k.diagnosisBanding) {
        if (kode === k.icd10) continue // jawaban benar memang pakai nama kasusnya sendiri
        const tampil = namaDiagnosis(kode, k)
        const kurasi = sumberKurasi(kode)
        const pinjaman = namaKasusLain.get(kode)
        if (kurasi === undefined || tampil !== kurasi) {
          meminjam.push(`${k.id}:${kode} tampil "${tampil}" (kurasi: ${kurasi ?? 'TIDAK ADA'}, nama kasus lain: ${pinjaman ?? '-'})`)
        }
      }
    }
    expect(meminjam).toEqual([])
  })

  // Temuan playtest 2026-07-04: dua kode banding berbeda (D50.9 & O99.0) tampil
  // NAMA IDENTIK di layar → pemain lihat opsi dobel, tak bisa membedakannya.
  it('TIDAK ADA dua kode banding dalam satu kasus yang tampil nama sama', () => {
    const tabrakan: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      const perNama = new Map<string, string[]>()
      for (const kode of k.diagnosisBanding) {
        const nama = namaDiagnosis(kode, k)
        perNama.set(nama, [...(perNama.get(nama) ?? []), kode])
      }
      for (const [nama, kodes] of perNama) {
        if (kodes.length > 1) tabrakan.push(`${k.id}: "${nama}" ← ${kodes.join(', ')}`)
      }
    }
    expect(tabrakan).toEqual([])
  })

  // Audit CODEX 2026-07-04: 27 kasus salah tampil label GENERIK skdi144 utk
  // JAWABAN BENARNYA SENDIRI (mis. "Hipertensi Urgensi" tertampil "Hipertensi
  // Esensial") krn urutan resolusi lama mengecek skdi144 sebelum kasus sendiri.
  // Jawaban benar kasus WAJIB pakai nama presisinya sendiri, selalu.
  it('jawaban benar kasus SELALU pakai nama kasus sendiri (bukan label skdi144)', () => {
    const salah: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      if (namaDiagnosis(k.icd10, k) !== k.nama) salah.push(`${k.id}: tampil "${namaDiagnosis(k.icd10, k)}" ≠ nama sendiri "${k.nama}"`)
    }
    expect(salah).toEqual([])
  })
})

describe('pencarian obat toleran-ejaan', () => {
  const obat = (id: string) => PACK.obat[id]!

  it('normalisasi fonetik EN→ID', () => {
    expect(normalisasiNamaObat('Paracetamol')).toBe(normalisasiNamaObat('Parasetamol'))
    expect(normalisasiNamaObat('Amoxicillin')).toBe(normalisasiNamaObat('Amoksisilin'))
    expect(normalisasiNamaObat('Cetirizine')).toBe(normalisasiNamaObat('Setirizine'))
    expect(normalisasiNamaObat('Ciprofloxacin')).toBe(normalisasiNamaObat('Siprofloksasin'))
  })

  it('ejaan Inggris menemukan obat katalog Indonesia', () => {
    expect(cocokObat(obat('paracetamol_500'), 'paracetamol')).toBe(true)
    expect(cocokObat(obat('amoxicillin_500'), 'amoxicillin')).toBe(true)
    expect(cocokObat(obat('cetirizine_10'), 'cetirizine')).toBe(true)
    expect(cocokObat(obat('ciprofloxacin_500'), 'ciprofloxacin')).toBe(true)
    expect(cocokObat(obat('asiklovir_400'), 'acyclovir')).toBe(true)
    expect(cocokObat(obat('cefadroxil_500'), 'cefadroxil')).toBe(true)
  })

  it('sinonim/singkatan lazim menemukan obatnya', () => {
    expect(cocokObat(obat('ctm_4'), 'chlorpheniramine')).toBe(true)
    expect(cocokObat(obat('tablet_fe'), 'tablet tambah darah')).toBe(true)
    expect(cocokObat(obat('oralit'), 'ORS')).toBe(true)
    expect(cocokObat(obat('dihidroartemisinin_piperakuin'), 'DHP')).toBe(true)
    expect(cocokObat(obat('mgso4_inj'), 'magnesium sulfat')).toBe(true)
  })

  it('kueri ngawur tetap tidak mencocokkan apa pun', () => {
    expect(cocokObat(obat('paracetamol_500'), 'xyzzy')).toBe(false)
  })
})

// DeepThink (2026-07-04): daftar lab dulu satu-satunya tanpa pencarian di
// antara 3 daftar pilihan klinik — pola cocokLab meniru cocokObat/cocokEdukasi.
describe('pencarian lab (DeepThink — konsistensi Laci/Cari)', () => {
  const lab = (id: string) => PACK.lab[id]!

  it('kueri kosong mencocokkan semua item', () => {
    expect(cocokLab(lab('darah_rutin'), '')).toBe(true)
  })

  it('kueri sebagian nama menemukan item', () => {
    expect(cocokLab(lab('darah_rutin'), 'darah rutin')).toBe(true)
    expect(cocokLab(lab('widal'), 'widal')).toBe(true)
  })

  it('kueri ngawur tidak mencocokkan apa pun', () => {
    expect(cocokLab(lab('darah_rutin'), 'xyzzy')).toBe(false)
  })
})
