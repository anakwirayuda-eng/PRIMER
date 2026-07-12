/**
 * TEST KOMPONEN — konfirmasi sebelum menimpa slot arsip manual (CODEX audit
 * UI/UX 2026-07-10, #3). Sebelum fix: tombol slot langsung `simpanKeSlot`
 * tanpa jeda apa pun — title tooltip saja tak mencegah klik menimpa arsip lama.
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
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Lama', hari: 5, mode: 'karier', tamat: false }],
      meta: null,
      arsip: null,
      sedangMemuat: false,
    })
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<MejaKerja />)
    const user = userEvent.setup()

    const tombolSlot = screen.getByTitle(/Timpa slot1/)
    await user.click(tombolSlot)

    expect(window.confirm).toHaveBeenCalled()
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
      slots: [{ slot: 'slot1', namaDokter: 'Dr. Lama', hari: 5, mode: 'karier', tamat: false }],
      meta: null,
      arsip: null,
      sedangMemuat: false,
    })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<MejaKerja />)
    const user = userEvent.setup()

    const tombolSlot = screen.getByTitle(/Timpa slot1/)
    await user.click(tombolSlot)

    expect(window.confirm).toHaveBeenCalled()
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
    const confirmSpy = vi.spyOn(window, 'confirm')
    render(<MejaKerja />)
    const user = userEvent.setup()

    const tombolSlot = screen.getByTitle(/Simpan ke slot1/)
    await user.click(tombolSlot)

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(ditulis).toBe(true)
  })
})
