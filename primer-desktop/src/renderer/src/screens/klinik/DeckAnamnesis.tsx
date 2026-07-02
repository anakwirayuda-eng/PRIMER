/**
 * DECK ANAMNESIS — kartu pertanyaan per kategori + gauge SABAR pasien.
 * Pertanyaan yang sudah ditanya tercatat di lembar; jawaban terakhir muncul
 * sebagai balon bicara (termasuk jawaban ketus saat sabar habis).
 */

import { useMemo } from 'react'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import type { KasusKlinis, KategoriAnamnesis, PertanyaanAnamnesis } from '@content/types'
import { LABEL_KATEGORI, URUTAN_KATEGORI } from './util'

interface Props {
  enc: EncounterState
  kasus: KasusKlinis
  dispatch: (action: Action) => void
  lastEvents: GameEvent[]
  eventTick: number
}

export function DeckAnamnesis({ enc, kasus, dispatch, lastEvents, eventTick }: Props) {
  const perKategori = useMemo(() => {
    const peta = new Map<KategoriAnamnesis, PertanyaanAnamnesis[]>()
    for (const kat of URUTAN_KATEGORI) peta.set(kat, [])
    for (const q of kasus.anamnesis) {
      const daftar = peta.get(q.kategori)
      if (daftar) daftar.push(q)
      else peta.set(q.kategori, [q])
    }
    return peta
  }, [kasus])

  let jawabanTerakhir: string | null = null
  for (const e of lastEvents) {
    if (e.type === 'PASIEN_MENJAWAB') jawabanTerakhir = e.teks
  }

  const sabar = enc.sabar
  const kelasSabar =
    sabar < 30 ? ' meter__isi--bahaya' : sabar < 60 ? ' meter__isi--waspada' : ''
  const pasienLelah = enc.ditanya.length >= 8

  return (
    <>
      <div className="klinik-deck__isi">
        {/* Gauge sabar */}
        <div className="klinik-sabar">
          <div className="baris baris--antara">
            <span className="judul-seksi klinik-sabar__judul">Sabar Pasien</span>
            <span className="mono teks-xs teks-lembut">{sabar}/100</span>
          </div>
          <div className="meter">
            <div className={`meter__isi${kelasSabar}`} style={{ width: `${sabar}%` }} />
          </div>
          {pasienLelah && (
            <div className="klinik-lelah">
              Pasien mulai lelah ditanya-tanya &mdash; tiap pertanyaan tambahan menggerus sabarnya.
            </div>
          )}
        </div>

        {/* Balon jawaban terakhir */}
        {jawabanTerakhir !== null && (
          <div key={eventTick} className="klinik-balon">
            &ldquo;{jawabanTerakhir}&rdquo;
          </div>
        )}

        {/* Kartu pertanyaan per kategori */}
        {URUTAN_KATEGORI.map((kat) => {
          const daftar = perKategori.get(kat) ?? []
          if (daftar.length === 0) return null
          return (
            <div key={kat} className="klinik-deck__grup">
              <div className="judul-seksi">{LABEL_KATEGORI[kat]}</div>
              {daftar.map((q) => {
                const sudah = enc.ditanya.includes(q.id)
                return (
                  <button
                    key={q.id}
                    className={`klinik-tanya${sudah ? ' klinik-tanya--sudah' : ''}`}
                    onClick={() => dispatch({ type: 'TANYA', pertanyaanId: q.id })}
                    disabled={sudah}
                    title={sudah ? 'Sudah ditanyakan — jawabannya tercatat di lembar.' : undefined}
                  >
                    <span>{q.tanya}</span>
                    {sudah && <span className="klinik-tanya__cek">&#10003;</span>}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      <footer className="klinik-deck__footer">
        <button
          className="tombol tombol--utama tombol--besar"
          onClick={() => dispatch({ type: 'LANJUT_FASE' })}
        >
          Selesai Anamnesis &mdash; ke Pemeriksaan &rarr;
        </button>
        <span className="teks-xs teks-lembut">
          Fase tidak bisa diulang. Pastikan riwayat yang penting sudah kamu gali.
        </span>
      </footer>
    </>
  )
}
