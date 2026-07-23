/**
 * TOOLTIP INSTAN GLOBAL (audit premium 2026-07-23) — pengganti `title` native
 * yang lambat (~1 dtk), tak muncul untuk fokus keyboard, dan tak bisa distyle.
 *
 * Satu komponen dipasang di App; event delegation di level document membaca
 * atribut `data-tip` dari elemen mana pun — situs pemakai cukup menulis
 * `data-tip="..."` tanpa handler per-elemen. Tampil pada hover DAN fokus
 * keyboard; sembunyi saat pointer/fokus pergi, scroll, atau resize.
 *
 * Kontrak pemakaian (WAJIB saat migrasi dari `title`):
 * - `data-tip` adalah bantuan VISUAL; informasi yang sama harus tetap sampai
 *   ke SR lewat teks terlihat, aria-label, atau aria-describedby milik situs.
 * - Kontrol yang bisa `disabled` native TIDAK menerima mouse event di
 *   Chromium — untuk kontrol demikian pertahankan `title` (native tooltip
 *   tetap bekerja pada elemen disabled) atau pakai pola
 *   `title={nonaktif ? teks : undefined} data-tip={teks}`.
 * - Jangan pasang `title` dan `data-tip` aktif bersamaan — dobel tooltip.
 */

import { useEffect, useState } from 'react'
import './TooltipInstan.css'

interface Tip {
  teks: string
  x: number
  y: number
}

export function TooltipInstan() {
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => {
    let sumber: Element | null = null

    const sembunyikan = () => {
      if (sumber === null) return
      sumber = null
      setTip(null)
    }

    const tampilkan = (el: Element) => {
      const teks = el.getAttribute('data-tip')
      if (teks === null || teks === '') return
      sumber = el
      const r = el.getBoundingClientRect()
      const x = Math.min(Math.max(r.left + r.width / 2, 16), window.innerWidth - 16)
      setTip({ teks, x, y: r.bottom + 6 })
    }

    const dariTarget = (t: EventTarget | null): Element | null =>
      t instanceof Element ? t.closest('[data-tip]') : null

    const onOver = (e: Event) => {
      const el = dariTarget(e.target)
      if (el === sumber) return
      if (el !== null) tampilkan(el)
      else sembunyikan()
    }
    const onOut = (e: MouseEvent) => {
      if (sumber === null) return
      const tujuan = dariTarget(e.relatedTarget)
      if (tujuan !== sumber) sembunyikan()
    }
    const onFocusIn = (e: FocusEvent) => {
      const el = dariTarget(e.target)
      if (el !== null && el !== sumber) tampilkan(el)
    }
    const onFocusOut = () => sembunyikan()
    // Posisi dihitung sekali saat tampil — scroll/resize membuatnya basi.
    const onScroll = () => sembunyikan()

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  if (tip === null) return null
  return (
    <div className="tip-instan" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
      {tip.teks}
    </div>
  )
}
