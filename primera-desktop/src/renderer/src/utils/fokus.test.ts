/**
 * TEST — adaKontrolInteraktifDifokus. Bug nyata (2026-07-13): efek auto-fokus
 * fase/layar (DeckAksi.tsx, App.tsx — CODEX #18) mencuri fokus dari kontrol
 * teks (mis. "Cari obat" DeckTerapi) yang baru diklik+diketik pemain. Guard
 * ini yang mencegahnya — kunci klaim: true HANYA utk kontrol interaktif nyata
 * (input/textarea/select/contenteditable), false utk elemen non-interaktif
 * termasuk null & document.body.
 *
 * @vitest-environment jsdom
 * (vitest.config.ts environmentMatchGlobs hanya mencocokkan *.test.tsx ke
 * jsdom; file ini perlu `document` walau berekstensi .test.ts, jadi override
 * per-file alih-alih mengubah konfigurasi bersama.)
 */
import { describe, expect, it } from 'vitest'
import { adaKontrolInteraktifDifokus } from './fokus'

describe('adaKontrolInteraktifDifokus', () => {
  it('true utk <input> yang difokus', () => {
    const el = document.createElement('input')
    expect(adaKontrolInteraktifDifokus(el)).toBe(true)
  })

  it('true utk <textarea>', () => {
    const el = document.createElement('textarea')
    expect(adaKontrolInteraktifDifokus(el)).toBe(true)
  })

  it('true utk <select>', () => {
    const el = document.createElement('select')
    expect(adaKontrolInteraktifDifokus(el)).toBe(true)
  })

  it('true utk elemen dengan isContentEditable=true (bukan hanya tag whitelist)', () => {
    // jsdom TIDAK mengimplementasikan isContentEditable (selalu undefined
    // walau contentEditable/attribute diset — keterbatasan jsdom yang
    // terdokumentasi, bukan bug kita). Stub properti ini langsung agar
    // cabang kode itu tetap teruji jujur, tanpa berpura-pura jsdom
    // menghitungnya sendiri.
    const el = document.createElement('div')
    Object.defineProperty(el, 'isContentEditable', { value: true })
    expect(adaKontrolInteraktifDifokus(el)).toBe(true)
  })

  it('false utk <div> biasa (bukan kontrol interaktif)', () => {
    const el = document.createElement('div')
    expect(adaKontrolInteraktifDifokus(el)).toBe(false)
  })

  it('false utk <section> (elemen yang jadi target auto-fokus DeckAksi)', () => {
    const el = document.createElement('section')
    expect(adaKontrolInteraktifDifokus(el)).toBe(false)
  })

  it('false utk null (tak ada elemen aktif)', () => {
    expect(adaKontrolInteraktifDifokus(null)).toBe(false)
  })

  it('false utk document.body (fokus default browser)', () => {
    expect(adaKontrolInteraktifDifokus(document.body)).toBe(false)
  })
})
