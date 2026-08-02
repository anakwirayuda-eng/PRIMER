/**
 * BGM — musik latar dari BERKAS ASLI yang digubah manusia.
 *
 * Riwayat singkat, supaya keputusan di sini tidak diulang keliru:
 *  - Dulu memakai 7 track OST komersial → harus dihapus (tanpa lisensi).
 *  - Lalu dicoba musik generatif (disintesis kode) → bebas lisensi, tapi
 *    dr. Wirayuda mendengarnya sendiri dan hasilnya "bunyi-bunyian tak jelas".
 *    Dihapus 2026-08-02. Pelajarannya bukan "generatif itu buruk", melainkan
 *    mutu musik TIDAK BISA diverifikasi oleh pengembang yang tak bisa mendengar.
 *  - Sekarang: berkas asli berlisensi bebas, dikurasi telinga manusia.
 *
 * Musik dijaga tenang & tak menuntut perhatian — pemain sedang membaca
 * vignette klinis dan menimbang keputusan. Semua track diputar sangat pelan,
 * di-loop, dan tunduk pada tombol bisu yang sama dengan SFX.
 *
 * Aman saat daftar musik KOSONG: seluruh fungsi menjadi no-op senyap, jadi
 * game tetap berjalan tanpa musik sampai track terkurasi ditambahkan.
 */

import { useEffect } from 'react'
import { useGame } from '../store'
import { isMuted, subscribeMute } from './synth'
import { getPengaturan, subscribePengaturan } from '../settings'
import { KREDIT_MUSIK } from './bgmKredit'

export type KonteksBgm = 'title' | 'pagi' | 'siang' | 'sore' | 'igd' | 'laporan'

/**
 * Plafon volume musik. Dijaga jauh di bawah SFX: di lab 30-50 mesin tanpa
 * jaminan headphone, musik yang terdengar jelas dari kursi sebelah adalah
 * gangguan, bukan suasana.
 */
const PLAFON = 0.35
const LANGKAH_FADE = 0.04
const INTERVAL_FADE_MS = 80

function volumeTarget(): number {
  const p = getPengaturan()
  if (!p.musikAktif || isMuted()) return 0
  return p.volumeMusik * PLAFON
}

/**
 * Pilih track untuk sebuah konteks. Dicocokkan lewat `suasana` bila ada;
 * kalau tidak, pakai track pertama — satu lagu tenang untuk semua konteks
 * jauh lebih baik daripada hening, dan tak ada yang "salah tempat".
 */
function trackUntuk(konteks: KonteksBgm): string | null {
  if (KREDIT_MUSIK.length === 0) return null
  const cocok = KREDIT_MUSIK.find((k) => k.suasana.includes(konteks))
  return (cocok ?? KREDIT_MUSIK[0]!).berkas
}

let audio: HTMLAudioElement | null = null
let berkasAktif = ''
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
      el.volume = Math.max(0, Math.min(1, target))
      hentikanFade()
      if (laluHentikan) el.pause()
      return
    }
    el.volume = Math.max(0, Math.min(1, el.volume + Math.sign(beda) * LANGKAH_FADE))
  }, INTERVAL_FADE_MS)
}

function cobaPlay(el: HTMLAudioElement): void {
  el.play()
    .then(() => fadeKe(volumeTarget()))
    .catch(() => {
      // Autoplay diblokir (browser preview; Electron mengizinkan) — ulangi
      // pada gesture pertama.
      if (retryDipasang) return
      retryDipasang = true
      window.addEventListener(
        'pointerdown',
        () => {
          retryDipasang = false
          if (audio && volumeTarget() > 0) cobaPlay(audio)
        },
        { once: true },
      )
    })
}

/** Ganti musik sesuai konteks; no-op bila track sama atau musik dimatikan. */
export function gantiBgm(konteks: KonteksBgm): void {
  const berkas = trackUntuk(konteks)
  if (!berkas) return
  if (berkas === berkasAktif && audio && !audio.paused) return
  berkasAktif = berkas

  const mulaiBaru = (): void => {
    if (!audio) {
      audio = new Audio()
      audio.loop = true
    }
    audio.src = `bgm/${berkas}`
    audio.volume = 0
    if (volumeTarget() > 0) cobaPlay(audio)
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
      el.volume = Math.max(0, el.volume - LANGKAH_FADE)
    }, INTERVAL_FADE_MS)
  } else {
    mulaiBaru()
  }
}

/**
 * Redam musik sesaat lalu kembali — "musik menahan napas".
 * Dipakai Kode Hitam (pasien meninggal di IGD), konsekuensi terberat di game.
 */
export function redamBgm(msTurun: number, msTahan: number): void {
  if (!audio || audio.paused) return
  const target = volumeTarget()
  hentikanFade()
  const el = audio
  const langkah = Math.max(0.01, el.volume / Math.max(1, msTurun / INTERVAL_FADE_MS))
  fadeTimer = window.setInterval(() => {
    if (el.volume <= langkah) {
      el.volume = 0
      hentikanFade()
      window.setTimeout(() => {
        if (volumeTarget() > 0) fadeKe(target)
      }, msTahan)
      return
    }
    el.volume = Math.max(0, el.volume - langkah)
  }, INTERVAL_FADE_MS)
}

export function disposeBgm(): void {
  hentikanFade()
  if (audio) {
    audio.pause()
    audio.src = ''
    audio = null
  }
  berkasAktif = ''
}

/** Hook App: turunkan konteks dari state game + ikut tombol bisu/pengaturan. */
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
    const sinkron = (): void => {
      if (!audio) {
        // Musik baru dinyalakan di Pengaturan saat sesi berjalan.
        if (volumeTarget() > 0) gantiBgm(konteks)
        return
      }
      if (volumeTarget() <= 0) fadeKe(0, true)
      else {
        if (audio.paused) cobaPlay(audio)
        else fadeKe(volumeTarget())
      }
    }
    const lepasMute = subscribeMute(sinkron)
    const lepasSet = subscribePengaturan(sinkron)
    return () => {
      lepasMute()
      lepasSet()
      disposeBgm()
    }
  }, [konteks])
}
