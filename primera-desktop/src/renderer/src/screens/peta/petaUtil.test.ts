/**
 * TEST — mendungPetak (DeepThink "game juice", 2026-07-04): IKS Tidak Sehat
 * dapat metafora visual cuaca (awan), bukan cuma warna choropleth.
 */
import { describe, expect, it } from 'vitest'
import { mendungPetak } from './petaUtil'
import type { RwState } from '@engine/state'

function rw(overrides: Partial<RwState>): RwState {
  return { nomor: 1, nama: 'RW 1', jarak: 'dekat', totalKk: 25, kkTersurvei: 10, iks: 0.8, bonusIks: 0, ...overrides }
}

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
