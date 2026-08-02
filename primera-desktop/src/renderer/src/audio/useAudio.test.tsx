/**
 * TEST — useAudio: pemetaan GameEvent → SFX (DeepThink "game juice", 2026-07-04).
 * Kunci klaim: Kode Hitam TIDAK LAGI memakai sfxBuzzer (dulu disamakan dgn
 * kesalahan rutin) — kini sfxKodeHitam + duck BGM. Surat kabar-buruk
 * (teguran/karma/igd) pakai buzzer, surat rutin tetap bel ceria.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, render } from '@testing-library/react'
import { useGame } from '../store'
import type { GameEvent } from '@engine/events'

vi.mock('./synth', () => ({
  initAudio: vi.fn(),
  disposeAudio: vi.fn(),
  sfxStempel: vi.fn(),
  sfxBlip: vi.fn(),
  sfxBel: vi.fn(),
  sfxBuzzer: vi.fn(),
  sfxKodeHitam: vi.fn(),
  sfxArpeggio: vi.fn(),
  sfxPagi: vi.fn(),
  sfxSelesai: vi.fn(),
  sfxKlik: vi.fn(),
  sfxPanggil: vi.fn(),
  sfxTolak: vi.fn(),
  sfxSirine: vi.fn(),
  sfxTickSabar: vi.fn(),
  sfxTemuan: vi.fn(),
  sfxBlok: vi.fn(),
}))
vi.mock('./bgm', () => ({ redamBgm: vi.fn() }))

import {
  sfxBuzzer,
  sfxKodeHitam,
  sfxBel,
  sfxArpeggio,
  sfxSelesai,
  sfxKlik,
  sfxPanggil,
  sfxTolak,
  sfxSirine,
  sfxTickSabar,
  sfxTemuan,
  sfxBlok,
} from './synth'
import { redamBgm } from './bgm'
import { useAudio } from './useAudio'

function Harness() {
  useAudio()
  return null
}

function tembakEvent(ev: GameEvent): void {
  const tick = useGame.getState().eventTick + 1
  act(() => {
    useGame.setState({ lastEvents: [ev], eventTick: tick })
  })
}

describe('useAudio — pemetaan event ke SFX', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGame.setState({ lastEvents: [], eventTick: 0 })
    render(<Harness />)
  })

  it('KODE_HITAM memakai sfxKodeHitam + redamBgm, BUKAN sfxBuzzer (dulu disamakan dgn kesalahan rutin)', () => {
    tembakEvent({ type: 'KODE_HITAM', narasi: 'Kode Hitam. Uji tidak tertolong.' })
    expect(sfxKodeHitam).toHaveBeenCalledTimes(1)
    expect(redamBgm).toHaveBeenCalledTimes(1)
    expect(sfxBuzzer).not.toHaveBeenCalled()
  })

  it('surat kabar-buruk (teguran_kapus) memakai buzzer, bukan bel ceria', () => {
    tembakEvent({
      type: 'SURAT_MASUK',
      surat: { id: 's1', hari: 1, jenis: 'teguran_kapus', dari: 'x', judul: 'x', isi: 'x', dibaca: false },
    })
    expect(sfxBuzzer).toHaveBeenCalledTimes(1)
    expect(sfxBel).not.toHaveBeenCalled()
  })

  it('surat karma & igd (kabar buruk lain) juga memakai buzzer', () => {
    tembakEvent({ type: 'SURAT_MASUK', surat: { id: 's2', hari: 1, jenis: 'karma', dari: 'x', judul: 'x', isi: 'x', dibaca: false } })
    tembakEvent({ type: 'SURAT_MASUK', surat: { id: 's3', hari: 1, jenis: 'igd', dari: 'x', judul: 'x', isi: 'x', dibaca: false } })
    expect(sfxBuzzer).toHaveBeenCalledTimes(2)
  })

  it('surat RUTIN (laporan_kader/kabar_warga/dll) tetap memakai bel ceria', () => {
    tembakEvent({
      type: 'SURAT_MASUK',
      surat: { id: 's4', hari: 1, jenis: 'laporan_kader', dari: 'x', judul: 'x', isi: 'x', dibaca: false },
    })
    expect(sfxBel).toHaveBeenCalledTimes(1)
    expect(sfxBuzzer).not.toHaveBeenCalled()
  })

  // ---- Kelengkapan SFX (audit 2026-08-02) ----------------------------------

  it('IGD_TIBA memakai sfxSirine, BUKAN sfxBuzzer (peristiwa eksternal ≠ "kamu salah")', () => {
    tembakEvent({ type: 'IGD_TIBA', narasi: 'Pasien gawat tiba.' })
    expect(sfxSirine).toHaveBeenCalledTimes(1)
    expect(sfxBuzzer).not.toHaveBeenCalled()
  })

  it('ERROR_AKSI memakai sfxTolak lirih, BUKAN buzzer — dan di-throttle bila beruntun', () => {
    tembakEvent({ type: 'ERROR_AKSI', pesan: 'Aksi tidak sah.' })
    tembakEvent({ type: 'ERROR_AKSI', pesan: 'Aksi tidak sah.' })
    expect(sfxTolak).toHaveBeenCalledTimes(1)
    expect(sfxBuzzer).not.toHaveBeenCalled()
  })

  it('SABAR_MENIPIS berbunyi sekali lalu diam (engine menembak ulang tiap aksi)', () => {
    tembakEvent({ type: 'SABAR_MENIPIS' })
    tembakEvent({ type: 'SABAR_MENIPIS' })
    tembakEvent({ type: 'SABAR_MENIPIS' })
    expect(sfxTickSabar).toHaveBeenCalledTimes(1)
  })

  it('PASIEN_DIPANGGIL → denting loket; BLOK_BERGANTI → nada transisi; HOTSPOT_DITEMUKAN → dua nada temuan', () => {
    tembakEvent({ type: 'PASIEN_DIPANGGIL', nama: 'Bu Sari' })
    tembakEvent({ type: 'BLOK_BERGANTI', blok: 'siang' })
    tembakEvent({ type: 'HOTSPOT_DITEMUKAN', hotspotId: 'h1', narasi: 'Jentik di bak mandi.' })
    expect(sfxPanggil).toHaveBeenCalledTimes(1)
    expect(sfxBlok).toHaveBeenCalledTimes(1)
    expect(sfxTemuan).toHaveBeenCalledTimes(1)
  })

  it('KUNJUNGAN_SELESAI: berhasil → arpeggio, gagal → nada selesai netral', () => {
    const dasar = {
      keluargaId: 'k1', skenarioId: 's1', diusir: false, hipotesisBenar: true, trustDelta: 1,
    }
    tembakEvent({
      type: 'KUNJUNGAN_SELESAI',
      hasil: { ...dasar, hasilAkhir: 'tuntas', berhasil: true } as never,
    })
    expect(sfxArpeggio).toHaveBeenCalledTimes(1)
    tembakEvent({
      type: 'KUNJUNGAN_SELESAI',
      hasil: { ...dasar, hasilAkhir: 'gagal', berhasil: false } as never,
    })
    expect(sfxSelesai).toHaveBeenCalledTimes(1)
  })
})

describe('useAudio — klik UI universal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGame.setState({ lastEvents: [], eventTick: 0 })
  })

  it('klik pada tombol aktif membunyikan sfxKlik; tombol disabled diam', () => {
    const { unmount } = render(
      <>
        <Harness />
        <button type="button">Aktif</button>
        <button type="button" disabled>Mati</button>
      </>
    )
    const [aktif, mati] = Array.from(document.querySelectorAll('button'))
    act(() => {
      mati!.click()
    })
    expect(sfxKlik).not.toHaveBeenCalled()
    act(() => {
      aktif!.click()
    })
    expect(sfxKlik).toHaveBeenCalledTimes(1)
    unmount()
    // Listener dilepas saat unmount — klik berikutnya tidak berbunyi lagi.
    act(() => {
      aktif!.click()
    })
    expect(sfxKlik).toHaveBeenCalledTimes(1)
  })

  it('klik pada elemen non-interaktif (div/teks) tidak berbunyi', () => {
    const { unmount } = render(
      <>
        <Harness />
        <div data-testid="polos">bukan tombol</div>
      </>
    )
    act(() => {
      document.querySelector<HTMLElement>('[data-testid="polos"]')!.click()
    })
    expect(sfxKlik).not.toHaveBeenCalled()
    unmount()
  })
})
