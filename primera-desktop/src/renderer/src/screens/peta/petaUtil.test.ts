/**
 * TEST — mendungPetak (DeepThink "game juice", 2026-07-04): IKS Tidak Sehat
 * dapat metafora visual cuaca (awan), bukan cuma warna choropleth.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { formatIks, mendungPetak, warnaPetak } from './petaUtil'
import { klasifikasiIks } from '@engine/pispk'
import type { RwState } from '@engine/state'

function rw(overrides: Partial<RwState>): RwState {
  return { nomor: 1, nama: 'RW 1', jarak: 'dekat', totalKk: 25, kkTersurvei: 10, iks: 0.8, bonusIks: 0, ...overrides }
}

describe('warnaPetak — konsisten dgn klasifikasiIks 3-kelas (CODEX audit UI/UX 2026-07-10, #12)', () => {
  it('RW di zona "Pra-Sehat" (0.65-0.8, dulu tampak hijau krn pita 5-warna) kini warna KUNYIT, bukan hijau', () => {
    const target = rw({ iks: 0.7, kkTersurvei: 10 })
    expect(klasifikasiIks(target.iks)).toBe('pra_sehat')
    expect(warnaPetak(target)).toBe('var(--kunyit-600)')
    expect(warnaPetak(target)).not.toBe('var(--daun-600)')
  })

  it('RW di zona "Tidak Sehat" (0.35-0.5, dulu tampak kunyit krn pita 5-warna) kini warna MERAH, bukan kunyit', () => {
    const target = rw({ iks: 0.4, kkTersurvei: 10 })
    expect(klasifikasiIks(target.iks)).toBe('tidak_sehat')
    expect(warnaPetak(target)).toBe('var(--tinta-merah)')
    expect(warnaPetak(target)).not.toBe('var(--kunyit-700)')
  })

  it('RW "Sehat" (>0.8) tetap hijau; belum tersurvei tetap abu-abu (regresi guard)', () => {
    expect(warnaPetak(rw({ iks: 0.9, kkTersurvei: 10 }))).toBe('var(--daun-600)')
    expect(warnaPetak(rw({ iks: 0, kkTersurvei: 0 }))).toBe('var(--kertas-400)')
  })

  it('warnaPetak selalu sinkron dgn klasifikasiIks di seluruh rentang 0-1 (sapuan)', () => {
    for (let iks = 0; iks <= 1; iks += 0.01) {
      const kelas = klasifikasiIks(iks)
      const warna = warnaPetak(rw({ iks, kkTersurvei: 10 }))
      const warnaHarapan = kelas === 'sehat' ? 'var(--daun-600)' : kelas === 'pra_sehat' ? 'var(--kunyit-600)' : 'var(--tinta-merah)'
      expect(warna, `iks=${iks} kelas=${kelas}`).toBe(warnaHarapan)
    }
  })
})

describe('mendungPetak', () => {
  it('IKS di bawah 0.5 (Tidak Sehat) dan sudah tersurvei → mendung', () => {
    expect(mendungPetak(rw({ iks: 0.4, kkTersurvei: 10 }))).toBe(true)
  })

  it('IKS 0.5 ke atas (Pra-Sehat/Sehat) → tidak mendung', () => {
    expect(mendungPetak(rw({ iks: 0.5, kkTersurvei: 10 }))).toBe(false)
    expect(mendungPetak(rw({ iks: 0.9, kkTersurvei: 10 }))).toBe(false)
  })

  it('belum tersurvei (kkTersurvei=0) → tidak mendung meski iks rendah (itu "belum ada data", bukan "buruk")', () => {
    expect(mendungPetak(rw({ iks: 0, kkTersurvei: 0 }))).toBe(false)
  })
})

/**
 * REGRESI — audit CODEX UX 2026-07-16: format IKS sempat tak seragam
 * (0-100 tanpa satuan di PetaDesa.tsx vs desimal koma 0,00 di layar lain),
 * ditambal 2× di titik terpisah dan 2 titik lain tetap terlewat. Pagar ganda:
 * (a) formatIks() sendiri benar di seluruh rentang, (b) sapuan statis atas
 * seluruh screens/ — tak boleh ada `.toFixed(0)`/`* 100).toFixed` mentah pada
 * variabel bernama `iks` di luar petaUtil.ts sendiri.
 */
describe('formatIks — format kanonik desimal koma (audit CODEX UX 2026-07-16)', () => {
  it('dua desimal, titik→koma, tanpa satuan tambahan', () => {
    expect(formatIks(0.6)).toBe('0,60')
    expect(formatIks(0.3)).toBe('0,30')
    expect(formatIks(1)).toBe('1,00')
    expect(formatIks(0)).toBe('0,00')
  })

  it('konsisten di seluruh rentang 0-1 (pola sama sapuan warnaPetak di atas)', () => {
    for (let iks = 0; iks <= 1; iks += 0.05) {
      expect(formatIks(iks), `iks=${iks}`).toMatch(/^\d,\d\d$/)
    }
  })
})

describe('Sapuan statis — tak ada format IKS mentah di luar petaUtil.ts (anti-regresi)', () => {
  function daftarFileTsx(dir: string): string[] {
    const hasil: string[] = []
    for (const nama of readdirSync(dir)) {
      if (nama === 'node_modules' || nama.startsWith('.')) continue
      const jalur = resolve(dir, nama)
      const info = statSync(jalur)
      if (info.isDirectory()) hasil.push(...daftarFileTsx(jalur))
      else if (/\.(tsx?|ts)$/.test(nama) && !nama.endsWith('.test.ts') && !nama.endsWith('.test.tsx')) {
        hasil.push(jalur)
      }
    }
    return hasil
  }

  it('tak ada `iks * 100).toFixed` mentah — semua pemanggil wajib lewat formatIks()', () => {
    const akarScreens = resolve(__dirname, '..')
    const pelanggar: string[] = []
    for (const berkas of daftarFileTsx(akarScreens)) {
      if (berkas.endsWith('petaUtil.ts')) continue // definisi formatIks sendiri
      const isi = readFileSync(berkas, 'utf8')
      if (/iks\s*\*\s*100\)\.toFixed/.test(isi)) pelanggar.push(berkas)
    }
    expect(pelanggar, `format IKS mentah ditemukan di: ${pelanggar.join(', ')}`).toEqual([])
  })
})
