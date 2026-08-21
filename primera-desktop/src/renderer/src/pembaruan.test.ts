// @vitest-environment jsdom
/**
 * TEST — perbandingan versi untuk pemberitahuan pembaruan (A7, 2026-08-02).
 * Kasus paling berbahaya: perbandingan STRING biasa menyatakan "beta.9" lebih
 * baru dari "beta.10" (leksikografis) — persis rentang versi rilis proyek ini.
 */
import { describe, expect, it } from 'vitest'
import { lebihBaru } from './pembaruan'

describe('lebihBaru — semver dgn prarilis', () => {
  it('beta.10 LEBIH BARU dari beta.9 (jebakan perbandingan string)', () => {
    expect(lebihBaru('1.1.0-beta.10', '1.1.0-beta.9')).toBe(true)
    expect(lebihBaru('1.1.0-beta.9', '1.1.0-beta.10')).toBe(false)
  })

  it('versi sama → bukan pembaruan', () => {
    expect(lebihBaru('1.1.0-beta.10', '1.1.0-beta.10')).toBe(false)
  })

  it('naik pada inti versi menang atas prarilis', () => {
    expect(lebihBaru('1.2.0-beta.1', '1.1.0-beta.99')).toBe(true)
    expect(lebihBaru('2.0.0', '1.9.9')).toBe(true)
    expect(lebihBaru('1.1.0', '1.1.1-beta.1')).toBe(false)
  })

  it('rilis FINAL lebih baru dari prarilis pada inti yang sama', () => {
    expect(lebihBaru('1.1.0', '1.1.0-beta.10')).toBe(true)
    expect(lebihBaru('1.1.0-beta.10', '1.1.0')).toBe(false)
  })

  it('awalan "v" dan spasi tak mengganggu', () => {
    expect(lebihBaru(' v1.1.0-beta.11 ', '1.1.0-beta.10')).toBe(true)
  })

  it('rc lebih baru dari beta walau angkanya lebih kecil', () => {
    // Jebakan kedua: membandingkan ANGKA prarilis saja membaca 1 vs 19 dan
    // menyimpulkan rc.1 lebih lama — banner rc tak akan pernah muncul di
    // mesin yang masih memakai beta.19.
    expect(lebihBaru('1.1.0-rc.1', '1.1.0-beta.19')).toBe(true)
    expect(lebihBaru('1.1.0-beta.19', '1.1.0-rc.1')).toBe(false)
  })

  it('urutan identifier prarilis mengikuti semver', () => {
    const naik = [
      '1.0.0-alpha',
      '1.0.0-alpha.1',
      '1.0.0-alpha.beta',
      '1.0.0-beta',
      '1.0.0-beta.2',
      '1.0.0-beta.11',
      '1.0.0-rc.1',
      '1.0.0',
    ]
    for (let i = 1; i < naik.length; i++) {
      const baru = naik[i] as string
      const lama = naik[i - 1] as string
      expect(lebihBaru(baru, lama), `${baru} > ${lama}`).toBe(true)
      expect(lebihBaru(lama, baru), `${lama} < ${baru}`).toBe(false)
    }
  })

  it('metadata build tidak menentukan urutan', () => {
    expect(lebihBaru('1.1.0-beta.20+79464b5', '1.1.0-beta.19')).toBe(true)
    expect(lebihBaru('1.1.0+79464b5', '1.1.0')).toBe(false)
  })
})
