/**
 * BGM — musik latar per konteks permainan (koleksi pribadi user di
 * public/bgm; lihat CATATAN_LISENSI.txt — WAJIB ditinjau sebelum
 * distribusi kelas). Satu elemen audio, loop, crossfade lembut, dan
 * tunduk pada tombol bisu yang sama dengan SFX (synth.ts).
 *
 * Autoplay: Electron mengizinkan; browser preview memblokir sampai gesture
 * pertama — kegagalan play() ditelan dan dicoba ulang pada pointerdown.
 */

import { useEffect } from 'react'
import { useGame } from '../store'
import { isMuted, subscribeMute } from './synth'

export type KonteksBgm = 'title' | 'pagi' | 'siang' | 'sore' | 'igd' | 'laporan'

/** Pemetaan tematik (Guldove = desa penyembuh → klinik pagi). */
const TRACK: Record<KonteksBgm, string> = {
  title: 'arni_home.mp3',
  pagi: 'guldove_home.mp3',
  siang: 'blue_fields.mp3',
  sore: 'fishermans_horizon.mp3',
  igd: 'guldove_another.mp3',
  laporan: 'balamb_garden.mp3',
}

const VOLUME_BGM = 0.3
const LANGKAH_FADE = 0.05
const INTERVAL_FADE_MS = 90

let audio: HTMLAudioElement | null = null
let trackAktif = ''
let fadeTimer: number | null = null
let retryDipasang = false

function hentikanFade(): void {
  if (fadeTimer !== null) {
    window.clearInterval(fadeTimer)
    fadeTimer = null
  }
}

function fadeKe(target: number, laluHentikan = false): void {
  if (!audio) return
  hentikanFade()
  const el = audio
  fadeTimer = window.setInterval(() => {
    const beda = target - el.volume
    if (Math.abs(beda) <= LANGKAH_FADE) {
      el.volume = target
      hentikanFade()
      if (laluHentikan) el.pause()
      return
    }
    el.volume += Math.sign(beda) * LANGKAH_FADE
  }, INTERVAL_FADE_MS)
}

function cobaPlay(el: HTMLAudioElement): void {
  el.play()
    .then(() => {
      // Play bisa berhasil BELAKANGAN (retry pasca-gesture) — pastikan volume naik.
      fadeKe(VOLUME_BGM)
    })
    .catch(() => {
      // Autoplay diblokir (browser preview; Electron mengizinkan) — ulangi
      // pada gesture pertama.
      if (retryDipasang) return
      retryDipasang = true
      window.addEventListener(
        'pointerdown',
        () => {
          retryDipasang = false
          if (audio && !isMuted()) cobaPlay(audio)
        },
        { once: true },
      )
    })
}

/** Ganti musik sesuai konteks; no-op bila track sama. */
export function gantiBgm(konteks: KonteksBgm): void {
  const berkas = TRACK[konteks]
  if (berkas === trackAktif) return
  trackAktif = berkas

  const mulaiBaru = (): void => {
    if (!audio) {
      audio = new Audio()
      audio.loop = true
    }
    audio.src = `bgm/${berkas}`
    audio.volume = 0
    if (!isMuted()) {
      cobaPlay(audio)
      fadeKe(VOLUME_BGM)
    }
  }

  if (audio && !audio.paused) {
    // Crossfade sederhana: turunkan dulu, lalu tukar sumber.
    hentikanFade()
    const el = audio
    fadeTimer = window.setInterval(() => {
      if (el.volume <= LANGKAH_FADE) {
        hentikanFade()
        mulaiBaru()
        return
      }
      el.volume -= LANGKAH_FADE
    }, INTERVAL_FADE_MS)
  } else {
    mulaiBaru()
  }
}

export function disposeBgm(): void {
  hentikanFade()
  if (audio) {
    audio.pause()
    audio.src = ''
    audio = null
  }
  trackAktif = ''
}

/** Hook App: turunkan konteks dari state game + ikut tombol bisu. */
export function useBgm(): void {
  const konteks = useGame((s): KonteksBgm => {
    const st = s.state
    if (!st) return 'title'
    if (st.igd) return 'igd'
    if (st.layar === 'laporan') return 'laporan'
    return st.blok
  })

  useEffect(() => {
    gantiBgm(konteks)
  }, [konteks])

  useEffect(() => {
    const sinkronMute = (): void => {
      if (!audio) return
      if (isMuted()) fadeKe(0, true)
      else {
        cobaPlay(audio)
        fadeKe(VOLUME_BGM)
      }
    }
    const lepas = subscribeMute(sinkronMute)
    return () => {
      lepas()
      disposeBgm()
    }
  }, [])
}
