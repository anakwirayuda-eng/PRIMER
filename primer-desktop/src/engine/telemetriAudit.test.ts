/**
 * TEST — auditTelemetri (DeepThink ronde-2, keputusan user: telemetri wall-clock).
 * Murni: baris JSONL sudah-direkam masuk, peringatan string keluar. Tidak
 * pernah memanggil Date.now() — semua timestamp di fixture ini disuntik.
 */
import { describe, expect, it } from 'vitest'
import { auditTelemetri } from './telemetriAudit'

function baris(t: number, hari: number, jejakLen: number, blok = 'pagi'): string {
  return JSON.stringify({ t, hari, blok, jejakLen })
}

describe('auditTelemetri', () => {
  it('progres normal (hari naik, jejak naik) → tanpa peringatan', () => {
    const log = [baris(1000, 1, 2), baris(2000, 2, 8), baris(3000, 3, 15)]
    expect(auditTelemetri(log)).toEqual([])
  })

  it('hari MUNDUR tanpa jejak reset → peringatan save lama dimuat ulang', () => {
    const log = [baris(1000, 5, 40), baris(2000, 3, 42)] // hari 5→3, jejak tetap naik (42>40, bukan reset)
    const peringatan = auditTelemetri(log)
    expect(peringatan.length).toBeGreaterThan(0)
    expect(peringatan[0]).toMatch(/[Hh]ari mundur/)
  })

  it('jejak MENYUSUT tanpa hari reset → peringatan save lama dimuat ulang', () => {
    const log = [baris(1000, 10, 50), baris(2000, 10, 30)] // hari sama, jejak turun drastis
    const peringatan = auditTelemetri(log)
    expect(peringatan.length).toBeGreaterThan(0)
    expect(peringatan[0]).toMatch(/menyusut/)
  })

  it('stase BARU dimulai (jejak jatuh ke ~0, hari reset ke 1) → TIDAK dicurigai', () => {
    const log = [baris(1000, 45, 200), baris(2000, 1, 0)] // stase lama tamat, mulai baru
    expect(auditTelemetri(log)).toEqual([])
  })

  it('baris korup (bukan JSON / field hilang) dilewati, bukan throw', () => {
    const log = ['bukan json valid', JSON.stringify({ hari: 1 }), baris(1000, 1, 2), baris(2000, 2, 5)]
    expect(() => auditTelemetri(log)).not.toThrow()
    expect(auditTelemetri(log)).toEqual([])
  })

  it('log kosong atau satu baris → tanpa peringatan (tak ada dasar bandingan)', () => {
    expect(auditTelemetri([])).toEqual([])
    expect(auditTelemetri([baris(1000, 1, 0)])).toEqual([])
  })
})
