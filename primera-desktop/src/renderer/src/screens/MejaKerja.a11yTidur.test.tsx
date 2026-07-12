/**
 * TEST KOMPONEN — dua temuan CODEX audit UI/UX 2026-07-10:
 *  #16e: Program Wilayah adalah single-select TERKUNCI-sebagian (persis kasus
 *        useRadioGroup.ts baris 10-14) — butuh role="radio"+aria-checked,
 *        bukan cuma className penanda visual tanpa semantik ARIA.
 *  P3-tidur-duplikat: dua tombol berfungsi identik (`tidur()`) dulu tampil
 *        berdampingan di blok sore — panel debrief kiri DAN panel "Langkah
 *        Berikutnya" kanan (yang sudah cukup sbg satu-satunya CTA utama).
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { MejaKerja } from './MejaKerja'
import { buildInitialState } from '@engine/init'
import { advance, HARI_BUKA_PETA } from '@engine/reducer'
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

/** Siang, Hari ke-2 — Peta Desa (dan Program Wilayah) sudah terbuka. */
function siangDenganPetaTerbuka(): GameState {
  const s = buildInitialState('Uji Program Wilayah', 424242, PACK)
  return { ...s, hari: HARI_BUKA_PETA, blok: 'siang' }
}

/** Ke blok sore hari 1, membereskan IGD interrupt bila muncul (pola sama MejaKerja.overwrite.test.tsx). */
function soreHariIni(): GameState {
  let s = buildInitialState('Uji Tidur Duplikat', 909090, PACK)
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

describe('<MejaKerja /> — Program Wilayah role=radio + aria-checked (#16e)', () => {
  it('ketiga tombol fokus berperan radio; aria-checked mengikuti state.program.fokus', async () => {
    pasangPrimerStub()
    const s = siangDenganPetaTerbuka()
    useGame.setState({ state: s, slots: [], meta: null, arsip: null, sedangMemuat: false })
    render(<MejaKerja />)

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    radios.forEach((r) => expect(r).toHaveAttribute('aria-checked', 'false'))

    const user = userEvent.setup()
    await user.click(screen.getByRole('radio', { name: 'PSN 3M (vektor DBD)' }))

    const radiosSetelah = screen.getAllByRole('radio')
    const psn = radiosSetelah.find((r) => r.textContent?.includes('PSN 3M'))
    expect(psn).toHaveAttribute('aria-checked', 'true')
    const lain = radiosSetelah.filter((r) => r !== psn)
    expect(lain).toHaveLength(2)
    lain.forEach((r) => expect(r).toHaveAttribute('aria-checked', 'false'))
  })
})

describe('<MejaKerja /> — satu tombol Tidur/Akhiri Hari (P3-tidur-duplikat)', () => {
  it('hanya SATU tombol Tidur/Akhiri Hari tampil di blok sore, bukan dua duplikat', () => {
    pasangPrimerStub()
    const s = soreHariIni()
    useGame.setState({ state: s, slots: [], meta: null, arsip: null, sedangMemuat: false })
    render(<MejaKerja />)

    const tombolTidur = screen.getAllByRole('button', { name: /Tidur|Akhiri Hari/ })
    expect(tombolTidur).toHaveLength(1)
  })
})
