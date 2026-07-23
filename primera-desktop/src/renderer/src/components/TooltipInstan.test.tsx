/**
 * TEST — TooltipInstan (audit premium 2026-07-23): tooltip global [data-tip]
 * harus tampil seketika pada hover DAN fokus keyboard, lalu hilang saat
 * pointer/fokus pergi — pengganti `title` native yang delay ~1 dtk dan buta
 * keyboard. Event delegation di document: situs pemakai tanpa handler.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { TooltipInstan } from './TooltipInstan'

function pasangTombol(tip: string): HTMLButtonElement {
  const b = document.createElement('button')
  b.setAttribute('data-tip', tip)
  b.textContent = 'aksi'
  document.body.appendChild(b)
  return b
}

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

describe('<TooltipInstan />', () => {
  it('hover elemen [data-tip] menampilkan tooltip; keluar menyembunyikan', () => {
    render(<TooltipInstan />)
    const b = pasangTombol('Bantuan instan')
    expect(document.querySelector('.tip-instan')).toBeNull()

    fireEvent.mouseOver(b)
    expect(document.querySelector('.tip-instan')).toHaveTextContent('Bantuan instan')

    fireEvent.mouseOut(b)
    expect(document.querySelector('.tip-instan')).toBeNull()
  })

  it('fokus keyboard juga menampilkan tooltip (paritas non-pointer)', () => {
    render(<TooltipInstan />)
    const b = pasangTombol('Muncul saat fokus')
    fireEvent.focusIn(b)
    expect(document.querySelector('.tip-instan')).toHaveTextContent('Muncul saat fokus')
    fireEvent.focusOut(b)
    expect(document.querySelector('.tip-instan')).toBeNull()
  })

  it('elemen tanpa data-tip tidak memicu apa pun', () => {
    render(<TooltipInstan />)
    const polos = document.createElement('button')
    document.body.appendChild(polos)
    fireEvent.mouseOver(polos)
    expect(document.querySelector('.tip-instan')).toBeNull()
  })

  it('tooltip aria-hidden — murni visual, SR memakai aria situs masing-masing', () => {
    render(<TooltipInstan />)
    const b = pasangTombol('Visual saja')
    fireEvent.mouseOver(b)
    expect(document.querySelector('.tip-instan')).toHaveAttribute('aria-hidden', 'true')
  })
})
