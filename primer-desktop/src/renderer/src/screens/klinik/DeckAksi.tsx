/**
 * DECK AKSI — kolom kanan: stepper fase + deck kartu kontekstual per fase.
 * Fase dibaca dari state (engine yang menentukan alur, UI hanya menampilkan).
 */

import type { EncounterState, FaseEncounter } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import type { KasusKlinis } from '@content/types'
import { DeckAnamnesis } from './DeckAnamnesis'
import { DeckPemeriksaan } from './DeckPemeriksaan'
import { DeckDiagnosis } from './DeckDiagnosis'
import { DeckTerapi } from './DeckTerapi'
import { DeckDisposisi } from './DeckDisposisi'

interface Props {
  enc: EncounterState
  kasus: KasusKlinis
  dispatch: (action: Action) => void
  lastEvents: GameEvent[]
  eventTick: number
}

const LANGKAH: { fase: FaseEncounter; label: string }[] = [
  { fase: 'anamnesis', label: 'Anamnesis' },
  { fase: 'pemeriksaan', label: 'Pemeriksaan' },
  { fase: 'diagnosis', label: 'Diagnosis' },
  { fase: 'terapi', label: 'Terapi' },
  { fase: 'disposisi', label: 'Disposisi' },
]

export function DeckAksi({ enc, kasus, dispatch, lastEvents, eventTick }: Props) {
  const indexAktif = LANGKAH.findIndex((l) => l.fase === enc.fase)

  return (
    <section className="klinik-deck kertas" aria-label="Deck aksi klinik">
      <ol className="klinik-deck__stepper">
        {LANGKAH.map((l, i) => (
          <li
            key={l.fase}
            className={`klinik-deck__step${i === indexAktif ? ' klinik-deck__step--aktif' : ''}${
              indexAktif >= 0 && i < indexAktif ? ' klinik-deck__step--lewat' : ''
            }`}
          >
            <span className="klinik-deck__step-nomor mono">{i + 1}</span>
            <span className="klinik-deck__step-label">{l.label}</span>
          </li>
        ))}
      </ol>

      {enc.fase === 'anamnesis' && (
        <DeckAnamnesis
          enc={enc}
          kasus={kasus}
          dispatch={dispatch}
          lastEvents={lastEvents}
          eventTick={eventTick}
        />
      )}
      {enc.fase === 'pemeriksaan' && <DeckPemeriksaan enc={enc} dispatch={dispatch} />}
      {enc.fase === 'diagnosis' && <DeckDiagnosis enc={enc} kasus={kasus} dispatch={dispatch} />}
      {enc.fase === 'terapi' && (
        <DeckTerapi enc={enc} dispatch={dispatch} lastEvents={lastEvents} eventTick={eventTick} />
      )}
      {enc.fase === 'disposisi' && <DeckDisposisi enc={enc} dispatch={dispatch} />}
    </section>
  )
}
