/**
 * FOKUS — util murni utk mencegah efek auto-fokus (perpindahan fase/layar,
 * lihat DeckAksi.tsx & App.tsx, CODEX audit UI/UX 2026-07-10 #18) MENCURI
 * fokus dari kontrol interaktif yang sudah dipakai pemain (mis. input
 * pencarian "Cari obat" di DeckTerapi). Tanpa penjagaan ini, klik+ketik di
 * jendela antara paint & effect bisa membuat keystroke lanjutan hilang
 * karena fokus ditarik balik ke <section>/<main>.
 */

/** Deteksi apakah elemen aktif saat ini adalah kontrol interaktif (input/textarea/select/
 *  contenteditable) yang sedang dipakai pemain — dipakai utk mencegah efek auto-fokus
 *  (perpindahan fase/layar) mencuri fokus dari kontrol yang sudah dipakai pemain. */
export function adaKontrolInteraktifDifokus(elemen: Element | null): boolean {
  if (!(elemen instanceof HTMLElement)) return false
  if (elemen.isContentEditable) return true
  return elemen.tagName === 'INPUT' || elemen.tagName === 'TEXTAREA' || elemen.tagName === 'SELECT'
}
