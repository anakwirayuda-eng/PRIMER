/**
 * useAmbient — jembatan konteks permainan → musik latar generatif (ambient.ts).
 *
 * Menggantikan peran bgm.ts (berkas musik) yang dimatikan sejak masalah
 * lisensi OST: sejak itu game berjalan TANPA musik sama sekali. Modul ini
 * mengembalikan musik latar tanpa satu berkas pun, jadi tak ada lisensi yang
 * bisa dicabut.
 *
 * Autoplay: AudioContext baru ada setelah gesture pertama (useAudio yang
 * membuatnya). Hook ini menunggu konteks itu tersedia, lalu menyalakan ambient.
 */

import { useEffect } from 'react'
import { useGame } from '../store'
import { ambilCtxAudio, isMuted, subscribeMute } from './synth'
import { subscribePengaturan } from '../settings'
import {
  hentikanAmbient,
  mulaiAmbient,
  sinkronVolumeAmbient,
  type KonteksAmbient,
} from './ambient'

export function useAmbient(): void {
  const konteks = useGame((s): KonteksAmbient => {
    const st = s.state
    if (!st) return 'title'
    if (st.igd) return 'igd'
    if (st.layar === 'laporan') return 'laporan'
    return st.blok
  })

  useEffect(() => {
    let batal = false
    // AudioContext dibuat pada gesture pertama — jajaki sampai tersedia,
    // lalu berhenti menjajaki (tidak polling selamanya).
    const coba = (): void => {
      if (batal) return
      const ctx = ambilCtxAudio()
      if (!ctx) return
      window.clearInterval(pemeriksa)
      mulaiAmbient(ctx, konteks)
      sinkronVolumeAmbient(isMuted())
    }
    const pemeriksa = window.setInterval(coba, 400)
    coba()
    return () => {
      batal = true
      window.clearInterval(pemeriksa)
    }
  }, [konteks])

  useEffect(() => {
    const lepasMute = subscribeMute(() => sinkronVolumeAmbient(isMuted()))
    const lepasSet = subscribePengaturan(() => sinkronVolumeAmbient())
    return () => {
      lepasMute()
      lepasSet()
      hentikanAmbient()
    }
  }, [])
}
