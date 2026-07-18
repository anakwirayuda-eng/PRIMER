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
import { advance, HARI_BUKA_PETA, HARI_BUKA_PROLANIS } from '@engine/reducer'
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
    // Audit CODEX UKM 2026-07-16 #3: TETAPKAN_PROGRAM kini wajib rwFokus —
    // tombol fokus disabled sampai RW fokus dipilih; pilih RW 1 dulu.
    const psnSebelum = screen.getByRole('radio', { name: 'PSN 3M (vektor DBD)' })
    expect(psnSebelum).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'RW 1' }))
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
describe('<MejaKerja /> — hitungan Prolanis mengikuti peserta JKN aktif', () => {
  it('komorbid dihitung sebagai satu orang dan peserta JKN mati tidak dihitung sebagai kartu aktif', () => {
    pasangPrimerStub()
    const awal = buildInitialState('Uji Hitungan Prolanis', 515151, PACK)
    const [keluargaAktifA, keluargaAktifB, keluargaTidakAktif] = Object.keys(awal.desa.keluarga)
    const aktifA = awal.desa.keluarga[keluargaAktifA!]!
    const aktifB = awal.desa.keluarga[keluargaAktifB!]!
    const tidakAktif = awal.desa.keluarga[keluargaTidakAktif!]!
    const state: GameState = {
      ...awal,
      hari: HARI_BUKA_PROLANIS.karier,
      blok: 'siang',
      tutorialAktif: false,
      desa: {
        ...awal.desa,
        keluarga: {
          ...awal.desa.keluarga,
          [keluargaAktifA!]: {
            ...aktifA,
            indikator: { ...aktifA.indikator, jkn: { ...aktifA.indikator.jkn, statusSebenarnya: 'ya' } },
          },
          [keluargaAktifB!]: {
            ...aktifB,
            indikator: { ...aktifB.indikator, jkn: { ...aktifB.indikator.jkn, statusSebenarnya: 'ya' } },
          },
          [keluargaTidakAktif!]: {
            ...tidakAktif,
            indikator: { ...tidakAktif.indikator, jkn: { ...tidakAktif.indikator.jkn, statusSebenarnya: 'tidak' } },
          },
        },
      },
      prolanis: {
        sesiBerikutHari: HARI_BUKA_PROLANIS.karier,
        roster: [
          { id: 'a_ht', orangId: 'orang_a', nama: 'A', usia: 60, jenisKelamin: 'L', rw: 1, keluargaId: keluargaAktifA, jenis: 'ht', param: 160, takTerkontrolBerturut: 0 },
          { id: 'a_dm', orangId: 'orang_a', nama: 'A', usia: 60, jenisKelamin: 'L', rw: 1, keluargaId: keluargaAktifA, jenis: 'dm', param: 180, takTerkontrolBerturut: 0 },
          { id: 'b_ht', orangId: 'orang_b', nama: 'B', usia: 55, jenisKelamin: 'P', rw: 2, keluargaId: keluargaAktifB, jenis: 'ht', param: 150, takTerkontrolBerturut: 0 },
          { id: 'c_dm', orangId: 'orang_c', nama: 'C', usia: 52, jenisKelamin: 'P', rw: 3, keluargaId: keluargaTidakAktif, jenis: 'dm', param: 190, takTerkontrolBerturut: 0 },
        ],
      },
    }
    useGame.setState({ state, slots: [], meta: null, arsip: null, sedangMemuat: false })
    render(<MejaKerja />)

    const tombol = screen.getByRole('button', { name: /Gelar Sesi Prolanis/ })
    expect(tombol).toHaveTextContent(/2 peserta · 3 masalah aktif · 1 tunggu JKN/)
    expect(tombol).toBeEnabled()
  })
})
