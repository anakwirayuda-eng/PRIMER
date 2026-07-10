/**
 * TEST — mendungPetak (DeepThink "game juice", 2026-07-04): IKS Tidak Sehat
 * dapat metafora visual cuaca (awan), bukan cuma warna choropleth.
 */
import { describe, expect, it } from 'vitest'
import { mendungPetak, warnaPetak } from './petaUtil'
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
