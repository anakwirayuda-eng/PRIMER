/**
 * TEST KOMPONEN — debrief sore bertahan thd entri `klinik.selesaiHariIni` korup.
 *
 * Save yang diedit tangan/rusak bisa menyelipkan entri non-objek ke array itu:
 * wrapper-nya tetap Array sehingga lolos deserialize, tapi debrief men-
 * dereference tiap fieldnya — sekali di badan komponen (ringkasanHarian) dan
 * sekali di chip pasien. Satu entri null karena itu menjatuhkan SELURUH Meja
 * Kerja: layar hub sekaligus satu-satunya jalur UI debrief → refleksi → tidur.
 * Entri antrian sudah lama disaring per-item; ini sisi kembarannya.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { MejaKerja } from './MejaKerja'
import type { PenilaianEncounter } from '@engine/state'

const KASUS_ID = Object.keys(PACK.kasus)[0]!

/** Entri sah seperlunya — field yang benar-benar dibaca debrief & chip. */
function encounter(pasienNama: string): PenilaianEncounter {
  return {
    kasusId: KASUS_ID,
    pasienNama,
    diagnosisBenar: true,
    grade: 'B',
    clue: 'Clue uji.',
    rujukanNonSpesialistik: false,
    cowboy: false,
    antibiotikTanpaIndikasi: false,
    tindakanBerbahaya: false,
    konsekuensiDijadwalkan: false,
  } as PenilaianEncounter
}

function pasangSore(selesaiHariIni: unknown[]): void {
  const state = buildInitialState('Uji Debrief', 4242, PACK)
  useGame.setState({
    state: {
      ...state,
      blok: 'sore',
      klinik: { ...state.klinik, selesaiHariIni: selesaiHariIni as PenilaianEncounter[] },
    },
  })
}

function jumlahTampil(): string | undefined {
  return document.querySelector('.mk__debrief-tally strong')?.textContent ?? undefined
}

describe('<MejaKerja /> — entri selesaiHariIni korup', () => {
  it('entri null di antara entri sah: layar tetap hidup dan entri sah tetap tampil', () => {
    pasangSore([encounter('Warga Sah'), null])
    expect(() => render(<MejaKerja />)).not.toThrow()

    expect(screen.getByText(/Debrief Malam/)).toBeInTheDocument()
    expect(screen.getByText(/Warga Sah/)).toBeInTheDocument()
    // Yang korup tidak ikut dihitung — angka mengikuti entri yang nyata ada.
    expect(jumlahTampil()).toBe('1')
  })

  it('seluruh entri korup: debrief tetap terbuka beserta jalur refleksi & tidur', () => {
    pasangSore([null, 3, 'bukan objek'])
    expect(() => render(<MejaKerja />)).not.toThrow()

    expect(screen.getByText(/Debrief Malam/)).toBeInTheDocument()
    expect(jumlahTampil()).toBe('0')
    expect(screen.getByPlaceholderText(/Apa yang kamu pelajari hari ini/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tidur' })).toBeInTheDocument()
  })

  it('regresi: entri waras seluruhnya tetap terhitung dan tertulis apa adanya', () => {
    pasangSore([encounter('Warga Satu'), encounter('Warga Dua')])
    render(<MejaKerja />)

    expect(jumlahTampil()).toBe('2')
    expect(screen.getByText(/Warga Satu/)).toBeInTheDocument()
    expect(screen.getByText(/Warga Dua/)).toBeInTheDocument()
  })
})
