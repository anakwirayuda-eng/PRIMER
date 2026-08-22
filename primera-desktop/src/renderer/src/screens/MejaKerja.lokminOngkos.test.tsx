/**
 * Audit UKM 2026-08-22 (P2) — panel "Ongkos oportunitas" Lokakarya Mini.
 *
 * Supresi penularan oleh Program Wilayah menuntut DUA syarat di engine:
 * penyakitnya masuk `TARGET_KASUS_PROGRAM[fokus]` DAN klusternya berada di
 * `program.rwFokus` (reducer.ts). Panel ini dulu hanya mencocokkan penyakitnya,
 * jadi wabah penyakit target di RW LAIN raib dari daftar seolah sudah tertangani
 * — padahal dana program tak pernah sampai ke sana, dan justru RW yang tidak
 * dipilih itulah ongkos oportunitas yang ingin ditunjukkan panel ini.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { SIKLUS_LAPORAN_BULANAN } from '@engine/reducer'
import type { GameState } from '@engine/state'
import { useGame } from '../store'
import { MejaKerja } from './MejaKerja'

/** RW yang benar-benar DIDAFTAR sebagai dibiarkan (chip merah per kluster) —
 *  bukan RW fokus yang disebut kalimat pengantar panel. */
function rwDidaftar(): string[] {
  const panel = document.querySelector('.mk__lokmin-ongkos')
  if (!panel) return []
  return Array.from(panel.querySelectorAll('.chip--merah')).map((el) => el.textContent ?? '')
}

const RW_FOKUS = 3
const RW_LAIN = 5
const KASUS_TARGET_PSN = 'dengue_df' // TARGET_KASUS_PROGRAM.psn

function stateLokmin(): GameState {
  const awal = buildInitialState('Uji Ongkos Lokmin', 4242, PACK)
  const siklus = SIKLUS_LAPORAN_BULANAN[awal.mode]
  const hari = siklus + 1
  return {
    ...awal,
    hari,
    blok: 'pagi',
    flags: { ...awal.flags, [`lokmin${hari}`]: true },
    program: { fokus: 'psn', rwFokus: RW_FOKUS, periodeDitetapkan: 1 },
    desa: {
      ...awal.desa,
      surveilans: [
        // Kluster dengue di RW fokus — SUNGGUH ditekan program (ambang 2).
        { hari: hari - 1, rw: RW_FOKUS, kasusId: KASUS_TARGET_PSN, pasienNama: 'Warga A' },
        { hari: hari - 1, rw: RW_FOKUS, kasusId: KASUS_TARGET_PSN, pasienNama: 'Warga B' },
        // Kluster dengue di RW lain — penyakitnya target, tapi dananya tak sampai.
        { hari: hari - 1, rw: RW_LAIN, kasusId: KASUS_TARGET_PSN, pasienNama: 'Warga C' },
        { hari: hari - 1, rw: RW_LAIN, kasusId: KASUS_TARGET_PSN, pasienNama: 'Warga D' },
      ],
    },
  }
}

describe('<MejaKerja /> — ongkos oportunitas Lokmin selaras syarat supresi engine', () => {
  it('kluster penyakit target di RW NON-fokus tetap dihitung sebagai yang dibiarkan', () => {
    useGame.setState({ state: stateLokmin(), petaTargetKeluargaId: null })
    render(<MejaKerja />)

    expect(screen.getByText(/Ongkos oportunitas bulan ini/)).toBeInTheDocument()
    expect(rwDidaftar()).toContain(`RW ${RW_LAIN}`)
    const panel = document.querySelector('.mk__lokmin-ongkos')!
    expect(panel.textContent).toContain(PACK.kasus[KASUS_TARGET_PSN]!.nama)
    expect(panel.textContent).toContain('2 kasus dalam 14 hari terakhir')
  })

  it('kluster yang benar-benar ditekan (penyakit target DI RW fokus) tidak ikut didaftar', () => {
    useGame.setState({ state: stateLokmin(), petaTargetKeluargaId: null })
    render(<MejaKerja />)

    expect(rwDidaftar()).not.toContain(`RW ${RW_FOKUS}`)
    // Kalimat pengantar tetap menyebut RW fokusnya supaya pemain paham mengapa
    // wabah penyakit yang sama di RW lain justru ikut terdaftar.
    expect(screen.getByText(new RegExp(`RW ${RW_FOKUS}\\) tak menyentuh kluster berikut`))).toBeInTheDocument()
  })

  it('tanpa RW fokus, tak satu pun kluster boleh diklaim tercakup (cermin idxRedam = -1)', () => {
    const state = stateLokmin()
    useGame.setState({
      state: { ...state, program: { fokus: 'psn', periodeDitetapkan: 1 } },
      petaTargetKeluargaId: null,
    })
    render(<MejaKerja />)

    expect(rwDidaftar()).toContain(`RW ${RW_FOKUS}`)
    expect(rwDidaftar()).toContain(`RW ${RW_LAIN}`)
  })
})
