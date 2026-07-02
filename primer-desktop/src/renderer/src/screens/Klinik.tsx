/**
 * KLINIK — "Lembar Periksa" (layar terbesar).
 * Kiri: rekam medis kertas ber-SOAP yang terisi hidup dari tindakan pemain.
 * Kanan: deck aksi kontekstual per fase encounter.
 * Tanpa pasien aktif: ruang tunggu (antrian + panggil).
 * Event ENCOUNTER_SELESAI → panel hasil dengan grade stempel + clue EBM.
 */

import { useEffect, useState } from 'react'
import { useGame } from '../store'
import { PACK } from '@content/index'
import type { PenilaianEncounter } from '@engine/state'
import { RuangTunggu } from './klinik/RuangTunggu'
import { LembarPeriksa } from './klinik/LembarPeriksa'
import { DeckAksi } from './klinik/DeckAksi'
import { PanelHasil } from './klinik/PanelHasil'
import './Klinik.css'

export function Klinik() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const lastEvents = useGame((s) => s.lastEvents)
  const eventTick = useGame((s) => s.eventTick)

  const [hasil, setHasil] = useState<PenilaianEncounter | null>(null)

  useEffect(() => {
    for (const e of lastEvents) {
      if (e.type === 'ENCOUNTER_SELESAI') setHasil(e.penilaian)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTick])

  const enc = state.klinik.aktif
  const kasus = enc ? PACK.kasus[enc.pasien.kasusId] : undefined

  const bolehPanggil =
    state.klinik.antrian.length > 0 && state.blok === 'pagi' && state.stamina >= 1
  const alasanTutup =
    state.klinik.antrian.length === 0
      ? 'Antrian habis — tutup poli dan lanjutkan harimu.'
      : state.blok !== 'pagi'
        ? 'Poli sudah tutup untuk hari ini.'
        : 'Staminamu habis — istirahatkan dirimu.'

  return (
    <div className="klinik">
      {enc && kasus ? (
        <div className="klinik__ruang">
          <LembarPeriksa enc={enc} kasus={kasus} dispatch={dispatch} />
          <DeckAksi
            enc={enc}
            kasus={kasus}
            dispatch={dispatch}
            lastEvents={lastEvents}
            eventTick={eventTick}
          />
        </div>
      ) : enc ? (
        <div className="kartu klinik__rusak">
          Kasus pasien ini tidak ditemukan di paket konten. Selesaikan lewat disposisi atau
          laporkan sebagai bug konten.
        </div>
      ) : (
        <RuangTunggu state={state} dispatch={dispatch} />
      )}

      {hasil !== null && (
        <PanelHasil
          hasil={hasil}
          bolehPanggil={bolehPanggil}
          alasanTutup={alasanTutup}
          onSelesai={(panggilBerikutnya) => {
            setHasil(null)
            if (panggilBerikutnya) dispatch({ type: 'PANGGIL_PASIEN' })
          }}
        />
      )}
    </div>
  )
}
