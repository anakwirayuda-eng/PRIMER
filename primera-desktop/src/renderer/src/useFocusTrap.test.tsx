/**
 * TEST — useFocusTrap (M10.a ronde-4, CODEX 2026-07-06, dossier §44).
 *
 * Berbeda dari bug layering §38/§39/§42 (murni CSS painting — TAK bisa diuji
 * jsdom, hanya browser sungguhan), kebocoran fokus KEYBOARD adalah perilaku
 * DOM/event murni (focus/Tab/Escape) — jsdom mengimplementasikannya penuh,
 * jadi celah ini genuinely bisa direplikasi & dipagari di suite unit.
 * Reproduksi empiris SEBELUM fix (browser sungguhan, docs §44): tombol HUD
 * "Klinik" tetap `document.activeElement` via `.focus()` dan `state.layar`
 * berubah via `.click()` walau Onboarding overlay menutupinya total.
 */
import { describe, it, expect } from 'vitest'
import { useRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFocusTrap } from './useFocusTrap'

/** Harness minimal: "konten latar" (spt HUD) + modal overlay opsional. */
function Harness({ aktif, onEscape }: { aktif: boolean; onEscape?: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(aktif, onEscape)
  return (
    <div>
      <button>Latar Satu</button>
      <button>Latar Dua</button>
      {aktif && (
        <div ref={ref} role="dialog" aria-modal="true" aria-label="Modal Uji">
          <button>Dalam Satu</button>
          <button>Dalam Dua</button>
        </div>
      )}
    </div>
  )
}

describe('useFocusTrap (M10.a ronde-4)', () => {
  it('saat aktif: fokus awal jatuh ke elemen focusable PERTAMA di dalam modal', () => {
    render(<Harness aktif={true} />)
    expect(screen.getByText('Dalam Satu')).toHaveFocus()
  })

  it('Tab dari elemen TERAKHIR di dalam modal membungkus ke elemen PERTAMA — tak pernah keluar ke latar', async () => {
    const user = userEvent.setup()
    render(<Harness aktif={true} />)
    screen.getByText('Dalam Dua').focus()
    await user.tab()
    expect(screen.getByText('Dalam Satu')).toHaveFocus()
  })

  it('Shift+Tab dari elemen PERTAMA di dalam modal membungkus ke elemen TERAKHIR', async () => {
    const user = userEvent.setup()
    render(<Harness aktif={true} />)
    screen.getByText('Dalam Satu').focus()
    await user.tab({ shift: true })
    expect(screen.getByText('Dalam Dua')).toHaveFocus()
  })

  it('CELAH ASLI (dossier §44): fokus yang dipaksa keluar (mis. .focus() manual, atau Tab wrap alami browser) ditarik kembali ke dalam modal saat Tab berikutnya ditekan — tak pernah mendarat permanen di tombol latar', async () => {
    const user = userEvent.setup()
    render(<Harness aktif={true} />)
    // Simulasikan skenario CODEX: sesuatu memaksa fokus ke tombol LATAR
    // (persis .focus() yang terbukti berhasil di browser sungguhan sebelum
    // fix). Tanpa trap, Tab berikutnya akan lanjut ke tombol latar KEDUA —
    // dgn trap, capture-phase listener menariknya balik ke dalam modal.
    screen.getByText('Latar Satu').focus()
    await user.tab()
    expect(screen.getByText('Latar Dua')).not.toHaveFocus()
    const dalamSatu = screen.getByText('Dalam Satu')
    const dalamDua = screen.getByText('Dalam Dua')
    expect(dalamSatu === document.activeElement || dalamDua === document.activeElement).toBe(true)
  })

  it('Escape memanggil onEscape HANYA bila disediakan (modal wajib-selesai spt Rekap/Lokmin TAK diberi onEscape)', async () => {
    const user = userEvent.setup()
    let terpanggil = false
    render(<Harness aktif={true} onEscape={() => { terpanggil = true }} />)
    await user.keyboard('{Escape}')
    expect(terpanggil).toBe(true)
  })

  it('tanpa onEscape: Escape tak melakukan apa pun (modal wajib-diselesaikan tetap wajib)', async () => {
    const user = userEvent.setup()
    render(<Harness aktif={true} />)
    await user.keyboard('{Escape}')
    // Tak ada assertion crash/throw = cukup; modal (role=dialog) tetap ada.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('trap NONAKTIF (aktif=false): tombol latar Tab-able normal — dipakai Pengaturan saat TentangModal menimpanya', () => {
    render(<Harness aktif={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    screen.getByText('Latar Satu').focus()
    expect(screen.getByText('Latar Satu')).toHaveFocus()
  })

  it('fokus dikembalikan ke elemen sebelumnya saat modal ditutup (aktif true→false)', async () => {
    const user = userEvent.setup()
    function Pembungkus() {
      const [aktif, setAktif] = useState(false)
      const ref = useFocusTrap<HTMLDivElement>(aktif)
      return (
        <div>
          <button onClick={() => setAktif(true)}>Pemicu</button>
          {aktif && (
            <div ref={ref} role="dialog" aria-modal="true" aria-label="Modal Uji">
              <button onClick={() => setAktif(false)}>Tutup</button>
            </div>
          )}
        </div>
      )
    }
    render(<Pembungkus />)
    await user.click(screen.getByText('Pemicu'))
    expect(screen.getByText('Tutup')).toHaveFocus()
    await user.click(screen.getByText('Tutup'))
    expect(screen.getByText('Pemicu')).toHaveFocus()
  })
})
