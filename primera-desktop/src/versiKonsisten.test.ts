/**
 * TEST — kebenaran versi rilis (gerbang, bukan sekadar catatan).
 *
 * Latar: audit CODEX 2026-08-03 menemukan tiga sumber versi yang berbeda-beda
 * dalam satu rilis — package.json beta.13 (belum di-commit), package-lock.json
 * masih beta.9, dan layar Tentang menampilkan 1.0.0. Akibatnya installer
 * beta.13 tidak dapat dibuktikan berasal dari sumber mana pun.
 *
 * Disiplin proyek ini "satu versi = satu binary" hanya berarti bila angka
 * versinya tunggal. Test ini menjaga hal itu secara mekanis.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const akar = resolve(__dirname, '..')

function bacaJson(nama: string): Record<string, unknown> {
  return JSON.parse(readFileSync(resolve(akar, nama), 'utf-8')) as Record<string, unknown>
}

describe('kebenaran versi rilis', () => {
  const pkg = bacaJson('package.json')
  const lock = bacaJson('package-lock.json')
  const versi = pkg.version as string

  it('package.json memakai semver prarilis yang dikenali pembanding versi', () => {
    // Pembanding di pembaruan.ts mengandalkan bentuk ini; "beta.10" vs "beta.9"
    // pernah salah urut ketika dibandingkan sebagai string biasa.
    expect(versi).toMatch(/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/)
  })

  it('package-lock.json menyebut versi yang SAMA dengan package.json', () => {
    expect(lock.version).toBe(versi)
    const paketAkar = (lock.packages as Record<string, { version?: string }> | undefined)?.['']
    expect(paketAkar?.version).toBe(versi)
  })

  it('tidak ada versi yang dipaku di kode yang menyamar sebagai versi rilis', () => {
    // Layar Tentang & Kredit HARUS membaca app.getVersion() (IPC 'app:version'),
    // bukan METADATA.versi — METADATA.versi adalah versi KARYA TERDAFTAR (HKI)
    // yang memang tidak berubah tiap rilis.
    const tentang = readFileSync(
      resolve(akar, 'src/renderer/src/components/TentangModal.tsx'),
      'utf-8',
    )
    expect(tentang).toContain('appVersion')
    expect(tentang).not.toMatch(/Versi terpasang[\s\S]{0,80}METADATA\.versi/)
  })
})
