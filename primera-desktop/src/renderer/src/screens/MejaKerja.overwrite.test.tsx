/**
 * TEST KOMPONEN — konfirmasi sebelum menimpa slot arsip manual (CODEX audit
 * UI/UX 2026-07-10, #3). Sebelum fix: tombol slot langsung `simpanKeSlot`
 * tanpa jeda apa pun — title tooltip saja tak mencegah klik menimpa arsip lama.
 * Audit premium 2026-07-23: window.confirm diganti DialogGame in-game —
 * kontrak sama, medianya dialog kertas dgn tombol Batal/Timpa Slot eksplisit.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { MejaKerja } from './MejaKerja'
import { buildInitialState } from '@engine/init'
import { advance } from '@engine/reducer'
import { PACK } from '@content/index'
import type { GameState } from '@engine/state'

function pasangPrimerStub() {
  window.primer = {
    save: {
      write: async () => true,
      read: async () => null,
      list: async () => [],
      delete: async () => true,
    },
    telemetri: {
      append: async () => true,
      read: async () => [],
    },
    appVersion: async () => 'test',
  }
}

/** Ke blok sore hari 1, membereskan IGD interrupt bila muncul (pola sama m2program.test.ts). */
function soreHariIni(): GameState {
  let s = buildInitialState('Uji MejaKerja', 909090, PACK)
  let guard = 0
  while (s.blok !== 'sore' && guard++ < 10) {
    while (s.igd && guard++ < 40) {
      const kasus = PACK.kasusIgd[s.igd.kasusId]!
      if (s.igd.fase === 'langkah') {
        const l = kasus.langkah[s.igd.langkahIndex]!
        s = advance(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id }, PACK).state
      } else if (s.igd.fase === 'kode_biru') s = advance(s, { type: 'RJP_IGD', berkualitas: true }, PACK).state
      else if (s.igd.fase === 'pasca_rosc') s = advance(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' }, PACK).state
      else if (s.igd.fase === 'disposisi') s = advance(s, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar }, PACK).state
      else break
    }
    s = advance(s, { type: 'LANJUTKAN' }, PACK).state
  }
  return s
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('<MejaKerja /> — konfirmasi timpa slot arsip manual', () => {
  it('slot SUDAH terisi + user BATAL konfirmasi → simpanKeSlot TIDAK terpanggil (write tak terjadi)', async () => {
    pasangPrimerStub()
    let ditulis = false
    window.primer.save.write = async () => {
      ditulis = true
      return true
    }
    const s = soreHariIni()
    useGame.setState({
      state: s,
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Lama', hari: 5, mode: 'karier', tamat: false, contentRelease: PACK.runtimeManifest.contentRelease, compatible: true }],
      meta: null,
      arsip: null,
      sedangMemuat: false,
    })
    render(<MejaKerja />)
    const user = userEvent.setup()

    // Audit UX 2026-08-23: Arsip Manual kini default TERBUKA, tak perlu
    // diklik lagi utk membukanya.

    // Audit premium 2026-07-23: tooltip slot kini data-tip (tooltip instan
    // global), bukan title native — cari via nama tombol + assert tip-nya.
    const tombolSlot = screen.getByRole('button', { name: /Slot 1/ })
    expect(tombolSlot).toHaveAttribute('data-tip', expect.stringContaining('Timpa slot1'))
    await user.click(tombolSlot)

    // Dialog in-game muncul; batalkan — write TIDAK boleh terjadi.
    expect(screen.getByRole('dialog', { name: 'Timpa Slot 1?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Batal' }))

    expect(screen.queryByRole('dialog', { name: 'Timpa Slot 1?' })).not.toBeInTheDocument()
    expect(ditulis).toBe(false)
  })

  it('slot SUDAH terisi + user SETUJU konfirmasi → simpanKeSlot terpanggil (write terjadi)', async () => {
    pasangPrimerStub()
    let ditulis = false
    window.primer.save.write = async () => {
      ditulis = true
      return true
    }
    const s = soreHariIni()
    useGame.setState({
      state: s,
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Lama', hari: 5, mode: 'karier', tamat: false, contentRelease: PACK.runtimeManifest.contentRelease, compatible: true }],
      meta: null,
      arsip: null,
      sedangMemuat: false,
    })
    render(<MejaKerja />)
    const user = userEvent.setup()

    // Audit UX 2026-08-23: Arsip Manual kini default TERBUKA.
    const tombolSlot = screen.getByRole('button', { name: /Slot 1/ })
    await user.click(tombolSlot)

    // Setujui lewat tombol aksi dialog — write terjadi.
    await user.click(screen.getByRole('button', { name: 'Timpa Slot' }))

    expect(ditulis).toBe(true)
  })

  it('slot KOSONG (belum ada arsip) → menyimpan TANPA meminta konfirmasi (bukan gangguan gratis)', async () => {
    pasangPrimerStub()
    let ditulis = false
    window.primer.save.write = async () => {
      ditulis = true
      return true
    }
    const s = soreHariIni()
    useGame.setState({ state: s, slots: [], meta: null, arsip: null, sedangMemuat: false })
    render(<MejaKerja />)
    const user = userEvent.setup()

    // Audit UX 2026-08-23: Arsip Manual kini default TERBUKA.
    const tombolSlot = screen.getByRole('button', { name: /Slot 1/ })
    expect(tombolSlot).toHaveAttribute('data-tip', expect.stringContaining('Simpan ke slot1'))
    await user.click(tombolSlot)

    expect(screen.queryByRole('dialog', { name: /Timpa/ })).not.toBeInTheDocument()
    expect(ditulis).toBe(true)
  })
})
