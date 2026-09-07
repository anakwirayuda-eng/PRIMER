import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFocusTrap } from './useFocusTrap'

function Modal({ children, fokusKontainer = false }: { children: ReactNode; fokusKontainer?: boolean }) {
  const ref = useFocusTrap<HTMLDivElement>(true, undefined, { fokusKontainer })
  return <><button>Latar awal</button><div ref={ref} role="dialog" tabIndex={-1}>{children}</div><button>Latar akhir</button></>
}

describe('Lab 2 — keyboard modal dengan detail terlipat', () => {
  it('summary terakhir tetap menjadi batas Tab ketika tautan riwayat di dalamnya terlipat', async () => {
    render(<Modal><button>Tutup</button><details><summary>Riwayat</summary><a href="#kasus">Kasus tersembunyi</a></details></Modal>)
    screen.getByText('Riwayat').focus()
    await userEvent.setup().tab()
    expect(screen.getByText('Tutup')).toHaveFocus()
  })

  it('Shift+Tab dari tombol pertama kembali ke summary, bukan tautan tersembunyi', async () => {
    render(<Modal><button>Tutup</button><details><summary>Riwayat</summary><a href="#kasus">Kasus tersembunyi</a></details></Modal>)
    await userEvent.setup().tab({ shift: true })
    expect(screen.getByText('Riwayat')).toHaveFocus()
  })

  it('detail yang dibuka menambahkan tautan ke urutan fokus', async () => {
    render(<Modal><button>Tutup</button><details open><summary>Riwayat</summary><a href="#kasus">Kasus terlihat</a></details></Modal>)
    await userEvent.setup().tab({ shift: true })
    expect(screen.getByText('Kasus terlihat')).toHaveFocus()
    await userEvent.setup().tab()
    expect(screen.getByText('Tutup')).toHaveFocus()
  })

  it('fokus awal melewati tombol tersembunyi, nonaktif, inert, dan tabindex negatif', () => {
    render(<Modal>
      <button hidden>Tersembunyi</button>
      <div style={{ display: 'none' }}><button>CSS tersembunyi</button></div>
      <div style={{ visibility: 'hidden' }}><button>Tidak terlihat</button></div>
      <div inert><button>Inert</button></div>
      <button tabIndex={-1}>Fokus programatis</button>
      <button disabled tabIndex={0}>Nonaktif</button>
      <details><summary>Buka catatan</summary><button>Isi tertutup</button></details>
      <button>Selesai</button>
    </Modal>)
    expect(screen.getByText('Buka catatan')).toHaveFocus()
  })

  it('Tab dari kontainer debrief mengikuti kontrol pertama, Shift+Tab menuju kontrol terakhir', async () => {
    render(<Modal fokusKontainer><button>Pertama</button><details><summary>Terakhir</summary><button>Tersembunyi</button></details></Modal>)
    expect(screen.getByRole('dialog')).toHaveFocus()
    await userEvent.setup().tab({ shift: true })
    expect(screen.getByText('Terakhir')).toHaveFocus()
  })
})
