/**
 * Hook React untuk Pengaturan — memisahkan React dari settings.ts (yang
 * dipakai modul audio non-React). useSyncExternalStore → re-render saat
 * preferensi berubah dari mana pun (modal, tombol, dsb.).
 */

import { useSyncExternalStore } from 'react'
import { getPengaturan, subscribePengaturan, type Pengaturan } from './settings'

export function usePengaturan(): Pengaturan {
  return useSyncExternalStore(subscribePengaturan, getPengaturan, getPengaturan)
}
