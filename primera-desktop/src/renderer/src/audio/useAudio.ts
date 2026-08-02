/**
 * useAudio — jembatan GameEvent → SFX synth. Dipanggil sekali dari App.
 * Aman saat state null (layar judul): hook hanya membaca lastEvents/eventTick,
 * tidak pernah menyentuh state game.
 *
 * - AudioContext baru dibuat pada gesture pertama (pointerdown global sekali)
 *   demi kebijakan autoplay browser/Electron.
 * - Blip bicara di-throttle 60 ms agar rentetan event tidak jadi berisik.
 */

import { useEffect, useRef } from 'react'
import { useGame } from '../store'
import type { GameEvent } from '@engine/events'
import type { JenisSurat } from '@engine/state'
import {
  initAudio,
  disposeAudio,
  sfxStempel,
  sfxBlip,
  sfxBel,
  sfxBuzzer,
  sfxKodeHitam,
  sfxArpeggio,
  sfxPagi,
  sfxSelesai
} from './synth'
import { redamBgm } from './bgm'

// DeepThink "game juice" (2026-07-04): surat kabar-buruk (teguran/karma/IGD)
// dulu memakai bel ceria yang SAMA dengan surat rutin — bobot emosionalnya
// harus terasa beda begitu Kotak Masuk menyala.
const JENIS_SURAT_BURUK = new Set<JenisSurat>(['teguran_kapus', 'karma', 'igd'])

/**
 * Audit audio 2026-08-02: 60 ms membolehkan ~16,7 blip/detik. Brewster dkk.
 * (1995) menetapkan batas kegunaan earcon ~6 nada/detik — di atas itu rentetan
 * berhenti terbaca sbg isyarat dan berubah jadi derau. 160 ms = ~6/detik.
 */
const JEDA_BLIP_MS = 160

export function useAudio(): void {
  const eventTick = useGame((s) => s.eventTick)
  const blipTerakhir = useRef(0)

  // Init pada gesture pertama + cleanup total saat App di-unmount.
  useEffect(() => {
    const padaGesture = (): void => initAudio()
    window.addEventListener('pointerdown', padaGesture, { once: true })
    return () => {
      window.removeEventListener('pointerdown', padaGesture)
      disposeAudio()
    }
  }, [])

  // Mainkan SFX untuk event dari dispatch terakhir.
  useEffect(() => {
    if (eventTick === 0) return
    const events = useGame.getState().lastEvents
    for (const ev of events) mainkan(ev, blipTerakhir)
  }, [eventTick])
}

function mainkan(ev: GameEvent, blipTerakhir: { current: number }): void {
  switch (ev.type) {
    case 'STEMPEL':
      sfxStempel()
      break

    case 'PASIEN_MENJAWAB':
    case 'WARGA_BICARA': {
      const kini = performance.now()
      if (kini - blipTerakhir.current < JEDA_BLIP_MS) return
      blipTerakhir.current = kini
      sfxBlip()
      break
    }

    case 'SURAT_MASUK':
      if (JENIS_SURAT_BURUK.has(ev.surat.jenis)) sfxBuzzer()
      else sfxBel()
      break

    case 'FIREWALL_ALERGI':
    case 'KARMA_TERJADI':
    case 'IGD_TIBA':
    case 'DIUSIR':
      sfxBuzzer()
      break

    case 'KODE_HITAM':
      // Konsekuensi paling berat — sengaja BUKAN sfxBuzzer (dulu disamakan
      // dgn kesalahan rutin). Duck BGM dulu supaya drone kematian terdengar
      // jelas, bukan tenggelam di musik latar.
      redamBgm(180, 900)
      sfxKodeHitam()
      break

    case 'KARMA_DICEGAH':
      sfxArpeggio()
      break

    case 'ENCOUNTER_SELESAI':
      if (ev.penilaian.grade === 'A') sfxArpeggio()
      else sfxSelesai()
      break

    case 'HARI_BARU':
      sfxPagi()
      break

    case 'TAMAT':
      sfxArpeggio()
      break

    default:
      break
  }
}
