/**
 * Hook bersama — gabungkan sinyal OS (`prefers-reduced-motion`) dengan
 * toggle manual pengaturan (`kurangiGerak`). Diekstrak dari LaporanAkhir.tsx
 * (CODEX audit 2026-07-04 ronde-6) agar bisa dipakai layar lain yang juga
 * memanggil API animasi eksplisit (mis. scrollIntoView) yang tak tunduk
 * pada gerbang CSS global (CODEX audit UI/UX 2026-07-10, Polish#2a).
 */

import { usePengaturan } from './usePengaturan'

export function useMotionDikurangi(): boolean {
  const pengaturan = usePengaturan()
  const osKurangi =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  return pengaturan.kurangiGerak || osKurangi
}
