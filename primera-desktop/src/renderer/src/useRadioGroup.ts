/**
 * useRadioGroup (M10 §49, 2026-07-10) — pola WAI-ARIA radiogroup yang benar
 * untuk pemilih single-select. Sapuan multiagen menemukan pola berulang di ≥4
 * komponen (TitleScreen mode, Pengaturan mode, DeckDisposisi RS, DeckDiagnosis
 * banding/tinta): `role="radiogroup"` membungkus `<button aria-pressed>` — AT
 * mengumumkannya sbg "toggle button pressed", bukan "radio 1 dari N", dan tak
 * ada navigasi panah. Hook ini memberi props yang benar: tiap opsi jadi
 * `role="radio"` + `aria-checked`, dengan roving tabindex (hanya yang terpilih
 * yang di-Tab) + navigasi panah kiri/kanan/atas/bawah (wrap-around).
 *
 * Dipakai untuk grup datar (segmented control). Untuk grup berbasis kartu yang
 * sebagian opsinya bisa TERKUNCI (tutorial) — cukup pakai `radioProps` tanpa
 * roving penuh; lock membuat roving degenerate, jadi di sana kita hanya ambil
 * role+aria-checked (lihat pemakaian di Deck*).
 */
import type { KeyboardEvent } from 'react'

export function useRadioGroup<T extends string | number>(
  nilai: readonly T[],
  terpilih: T,
  pilih: (v: T) => void,
) {
  const onKeyDown = (e: KeyboardEvent<HTMLElement>, v: T): void => {
    const arah =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0
    if (arah === 0) return
    e.preventDefault()
    const i = nilai.indexOf(v)
    if (i < 0 || nilai.length === 0) return
    const next = nilai[(i + arah + nilai.length) % nilai.length]!
    pilih(next)
    // Roving: pindahkan fokus ke radio berikutnya dalam grup yang sama.
    const grup = e.currentTarget.closest('[role="radiogroup"]')
    grup?.querySelector<HTMLElement>(`[data-radio="${String(next)}"]`)?.focus()
  }

  /** Props untuk container. */
  const groupProps = { role: 'radiogroup' as const }

  /** Props untuk tiap opsi radio (spread ke `<button>`). */
  const radioProps = (v: T) => ({
    role: 'radio' as const,
    'aria-checked': terpilih === v,
    tabIndex: terpilih === v ? 0 : -1,
    'data-radio': String(v),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => onKeyDown(e, v),
  })

  return { groupProps, radioProps }
}
