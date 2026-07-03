/**
 * SETUP TEST KOMPONEN — jest-dom matchers (toBeInTheDocument dll) + bersihkan
 * DOM antar test (RTL cleanup). Hanya relevan untuk test .test.tsx (jsdom);
 * tak berefek pada test .test.ts (node) karena keduanya cuma import matcher.
 */
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
