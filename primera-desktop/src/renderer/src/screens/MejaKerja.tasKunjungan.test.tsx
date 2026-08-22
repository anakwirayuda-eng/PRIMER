/**
 * Audit UKM 2026-08-22 (P3) — batas IKS di Tas Kunjungan.
 *
 * Saran kunjungan dulu memakai salinan ambangnya sendiri (`iks < 0.8`), jadi
 * keluarga ber-IKS TEPAT 0,80 dianggap sudah sehat dan dibuang dari daftar —
 * padahal klasifikasi kanonik (pispk.ts, Permenkes 39/2016) baru menyebut sehat
 * di ATAS 0,8. Keluarga yang tinggal selangkah dari tuntas justru yang paling
 * layak dikunjungi. Layar kini memanggil `klasifikasiIks`, bukan menyalin angka.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { HARI_BUKA_PETA } from '@engine/reducer'
import { hitungIksKeluarga, klasifikasiIks, SEMUA_INDIKATOR_PISPK } from '@engine/pispk'
import type { GameState, KeluargaState } from '@engine/state'
import type { StatusIndikator } from '@content/types'
import { useGame } from '../store'
import { MejaKerja } from './MejaKerja'

const KELUARGA_ID = 'keluarga_wulan'

const KELUARGA_AWAL = buildInitialState('Basis Keluarga', 1, PACK).desa.keluarga[KELUARGA_ID]!

/** Keluarga dengan IKS tepat sasaran: `jumlahYa` dari 10 indikator berdata. */
function keluargaBerIks(jumlahYa: number): KeluargaState {
  const indikator = { ...KELUARGA_AWAL.indikator }
  SEMUA_INDIKATOR_PISPK.forEach((ind, i) => {
    if (i >= 10) {
      indikator[ind] = { ...indikator[ind], sumber: 'belum' }
      return
    }
    const status: StatusIndikator = i < jumlahYa ? 'ya' : 'tidak'
    indikator[ind] = { status, statusSebenarnya: status, sumber: 'dokter', hariData: 1 }
  })
  return { ...KELUARGA_AWAL, indikator }
}

function statePagi(kel: KeluargaState): GameState {
  const awal = buildInitialState('Uji Tas Kunjungan', 77, PACK)
  return {
    ...awal,
    hari: HARI_BUKA_PETA,
    blok: 'pagi',
    // Hanya satu keluarga dalam simulasi: daftar saran dipangkas 3 teratas, dan
    // keluarga tanpa data (prioritas lebih tinggi) akan menutupi yang diuji.
    desa: { ...awal.desa, keluarga: { [KELUARGA_ID]: kel } },
  }
}

describe('<MejaKerja /> — Tas Kunjungan memakai klasifikasi IKS kanonik', () => {
  it('IKS tepat 0,80 tetap PRA-SEHAT dan tetap disarankan (dulu dibuang sebagai sehat)', () => {
    const kel = keluargaBerIks(8)
    expect(hitungIksKeluarga(kel)).toBe(0.8)
    expect(klasifikasiIks(0.8), 'prasyarat: kanon menyebut 0,80 pra-sehat').toBe('pra_sehat')

    useGame.setState({ state: statePagi(kel), petaTargetKeluargaId: null })
    render(<MejaKerja />)

    expect(screen.getByText(/IKS 0,80 \(pra-sehat\)/)).toBeInTheDocument()
    expect(screen.queryByText(/Belum ada keluarga yang mendesak/)).not.toBeInTheDocument()
  })

  it('IKS 0,90 memang sehat — tidak ikut memenuhi tas kunjungan', () => {
    const kel = keluargaBerIks(9)
    expect(hitungIksKeluarga(kel)).toBe(0.9)

    useGame.setState({ state: statePagi(kel), petaTargetKeluargaId: null })
    render(<MejaKerja />)

    expect(screen.getByText(/Belum ada keluarga yang mendesak/)).toBeInTheDocument()
  })

  it('IKS 0,40 tetap dibaca tidak sehat', () => {
    const kel = keluargaBerIks(4)
    expect(hitungIksKeluarga(kel)).toBe(0.4)

    useGame.setState({ state: statePagi(kel), petaTargetKeluargaId: null })
    render(<MejaKerja />)

    expect(screen.getByText(/IKS 0,40 \(tidak sehat\)/)).toBeInTheDocument()
  })
})
