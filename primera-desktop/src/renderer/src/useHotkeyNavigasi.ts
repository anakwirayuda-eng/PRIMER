/**
 * useHotkeyNavigasi (audit UI/UX premium 2026-07-23) — hotkey angka 1-5 untuk
 * navigasi layar via HUD, standar game desktop komersial (mouse-only terasa
 * "web page", bukan game). Pagar keamanan setara tombol tab:
 *
 * 1. TIDAK aktif saat pemain mengetik (input/textarea/select/contenteditable)
 *    — angka masuk ke teks, bukan navigasi.
 * 2. TIDAK aktif saat modal mana pun terbuka ([role="dialog"]) — modal sudah
 *    memegang fokus (useFocusTrap); hotkey menembus modal = navigasi
 *    diam-diam di belakang dialog, persis kelas bug yang trap itu tutup.
 * 3. Menghormati alasanTabNonaktif — gate yang sama dengan tombol Hud
 *    (peta terkunci, encounter klinik aktif, sesi lapangan berjalan).
 * 4. Tanpa modifier — Ctrl/Alt/Meta+angka dibiarkan untuk shortcut OS/Electron.
 */

import { useEffect } from 'react'
import { useGame } from './store'
import { URUTAN_TAB, alasanTabNonaktif, sedangMengetik } from './utils/navigasiHud'

export function useHotkeyNavigasi(): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return
      const idx = Number.parseInt(e.key, 10) - 1
      if (Number.isNaN(idx) || idx < 0 || idx >= URUTAN_TAB.length) return
      const { state, dispatch } = useGame.getState()
      if (!state) return
      if (sedangMengetik(document.activeElement)) return
      if (document.querySelector('[role="dialog"]') !== null) return
      const layar = URUTAN_TAB[idx]!
      if (state.layar === layar) return
      if (alasanTabNonaktif(state, layar) !== undefined) return
      dispatch({ type: 'PINDAH_LAYAR', layar })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
