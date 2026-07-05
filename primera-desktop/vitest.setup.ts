/**
 * SETUP TEST KOMPONEN — jest-dom matchers (toBeInTheDocument dll) + bersihkan
 * DOM antar test (RTL cleanup). Hanya relevan untuk test .test.tsx (jsdom);
 * tak berefek pada test .test.ts (node) karena keduanya cuma import matcher.
 */
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom TAK mengimplementasikan scrollIntoView sama sekali (butuh layout
// sungguhan) — komponen yang memanggilnya (mis. DeckTerapi sorotan tutorial,
// bug live 2026-07-05) akan throw "not implemented" di jsdom tanpa stub ini.
// File ini juga dimuat utk test .test.ts di environment NODE (tanpa DOM sama
// sekali) — cek `typeof Element` dulu, jangan asumsikan global itu ada.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

afterEach(() => {
  cleanup()
})
