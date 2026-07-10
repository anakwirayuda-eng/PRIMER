/**
 * DECK AKSI — kolom kanan: stepper fase + deck kartu kontekstual per fase.
 * Fase dibaca dari state (engine yang menentukan alur, UI hanya menampilkan).
 */

import { useEffect, useRef } from 'react'
import type { EncounterState, FaseEncounter } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import type { KasusKlinis } from '@content/types'
import { DeckAnamnesis } from './DeckAnamnesis'
import { DeckPemeriksaan } from './DeckPemeriksaan'
import { DeckDiagnosis } from './DeckDiagnosis'
import { DeckTerapi } from './DeckTerapi'
import { DeckDisposisi } from './DeckDisposisi'
import { BANNER_TUTORIAL } from './tutorialKlinik'

interface Props {
  enc: EncounterState
  kasus: KasusKlinis
  dispatch: (action: Action) => void
  lastEvents: GameEvent[]
  eventTick: number
  /** DeepThink "onboarding railroaded" (keputusan user) — lihat Klinik.tsx. */
  tutorialAktif: boolean
}

const LANGKAH: { fase: FaseEncounter; label: string }[] = [
  { fase: 'anamnesis', label: 'Anamnesis' },
  { fase: 'pemeriksaan', label: 'Pemeriksaan' },
  { fase: 'diagnosis', label: 'Diagnosis' },
  { fase: 'terapi', label: 'Terapi' },
  { fase: 'disposisi', label: 'Disposisi' },
]

export function DeckAksi({ enc, kasus, dispatch, lastEvents, eventTick, tutorialAktif }: Props) {
  const indexAktif = LANGKAH.findIndex((l) => l.fase === enc.fase)
  const banner = tutorialAktif ? BANNER_TUTORIAL[enc.fase] : ''
  const sectionRef = useRef<HTMLElement>(null)

  // CODEX audit UI/UX 2026-07-10 (#18): Deck anak di-unmount total tiap
  // pergantian fase (tombol yg tadi diklik lenyap dari DOM) — fokus jatuh ke
  // <body> tanpa konteks. Pindahkan ke section ini, tanpa scroll-jump.
  // Review workflow Batch-7: App.tsx punya useEffect SEJENIS (fokus ke <main>
  // tiap state.layar berganti) — lihat komentar silang-referensi di sana utk
  // risiko effect induk menimpa effect anak ini bila layar & fase kebetulan
  // berubah bersamaan (saat ini tak bisa terjadi, tapi implisit).
  useEffect(() => {
    sectionRef.current?.focus({ preventScroll: true })
  }, [enc.fase])

  return (
    <section
      ref={sectionRef}
      className="klinik-deck kertas"
      aria-label={`Deck aksi klinik — ${LANGKAH[indexAktif]?.label ?? ''}`}
      tabIndex={-1}
    >
      <ol className="klinik-deck__stepper">
        {LANGKAH.map((l, i) => (
          <li
            key={l.fase}
            className={`klinik-deck__step${i === indexAktif ? ' klinik-deck__step--aktif' : ''}${
              indexAktif >= 0 && i < indexAktif ? ' klinik-deck__step--lewat' : ''
            }`}
            aria-current={i === indexAktif ? 'step' : undefined}
          >
            <span className="klinik-deck__step-nomor mono">{i + 1}</span>
            <span className="klinik-deck__step-label">{l.label}</span>
          </li>
        ))}
      </ol>

      {banner !== '' && <div className="klinik-tutorial-banner">{banner}</div>}

      {enc.fase === 'anamnesis' && (
        <DeckAnamnesis
          enc={enc}
          kasus={kasus}
          dispatch={dispatch}
          lastEvents={lastEvents}
          eventTick={eventTick}
          tutorialAktif={tutorialAktif}
        />
      )}
      {enc.fase === 'pemeriksaan' && (
        <DeckPemeriksaan enc={enc} dispatch={dispatch} tutorialAktif={tutorialAktif} />
      )}
      {enc.fase === 'diagnosis' && (
        <DeckDiagnosis enc={enc} kasus={kasus} dispatch={dispatch} tutorialAktif={tutorialAktif} />
      )}
      {enc.fase === 'terapi' && (
        <DeckTerapi
          enc={enc}
          dispatch={dispatch}
          lastEvents={lastEvents}
          eventTick={eventTick}
          tutorialAktif={tutorialAktif}
        />
      )}
      {enc.fase === 'disposisi' && (
        <DeckDisposisi enc={enc} kasus={kasus} dispatch={dispatch} tutorialAktif={tutorialAktif} />
      )}
    </section>
  )
}
