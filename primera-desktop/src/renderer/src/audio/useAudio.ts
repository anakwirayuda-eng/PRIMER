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
  sfxSelesai,
  sfxKlik,
  sfxPanggil,
  sfxTolak,
  sfxSirine,
  sfxTickSabar,
  sfxTemuan,
  sfxBlok
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

/** ERROR_AKSI bisa beruntun (pemain menekan-nekan tombol yang tak sah). */
const JEDA_TOLAK_MS = 300

/**
 * SABAR_MENIPIS ditembakkan ulang oleh engine pada TIAP aksi selama sabar
 * masih < 30 — tanpa jeda, bunyinya berubah dari isyarat jadi omelan.
 */
const JEDA_SABAR_MS = 5000

/** Anti dobel utk klik universal (pointer + keyboard bisa memicu beruntun). */
const JEDA_KLIK_MS = 50

/**
 * Elemen yang pantas berbunyi "klik". Sengaja TIDAK memasukkan slider
 * (input range menembak beruntun saat digeser) dan area teks.
 */
const SELEKTOR_KLIK =
  'button, [role="button"], [role="tab"], summary, a[href], input[type="radio"], input[type="checkbox"], select'

export function useAudio(): void {
  const eventTick = useGame((s) => s.eventTick)
  // -Infinity, BUKAN 0: performance.now() dihitung sejak proses mulai, jadi
  // awal 0 akan menelan bunyi pertama yang datang < jeda throttle sesudah boot.
  const blipTerakhir = useRef(-Infinity)
  const tolakTerakhir = useRef(-Infinity)
  const sabarTerakhir = useRef(-Infinity)

  // Init pada gesture pertama + klik UI universal + cleanup saat unmount.
  useEffect(() => {
    const padaGesture = (): void => initAudio()
    window.addEventListener('pointerdown', padaGesture, { once: true })

    // Klik universal: event 'click' juga menembak utk aktivasi keyboard
    // (Enter/Spasi pada tombol), jadi satu listener melayani keduanya.
    // capture:true agar stopPropagation() di komponen tidak membisukannya.
    let klikTerakhir = -Infinity
    const padaKlik = (e: MouseEvent): void => {
      const target = e.target
      if (!(target instanceof Element)) return
      const elemen = target.closest(SELEKTOR_KLIK)
      if (!elemen) return
      if (elemen.matches(':disabled, [aria-disabled="true"]')) return
      const kini = performance.now()
      if (kini - klikTerakhir < JEDA_KLIK_MS) return
      klikTerakhir = kini
      sfxKlik()
    }
    document.addEventListener('click', padaKlik, { capture: true })

    return () => {
      window.removeEventListener('pointerdown', padaGesture)
      document.removeEventListener('click', padaKlik, { capture: true })
      disposeAudio()
    }
  }, [])

  // Mainkan SFX untuk event dari dispatch terakhir.
  useEffect(() => {
    if (eventTick === 0) return
    const events = useGame.getState().lastEvents
    for (const ev of events) mainkan(ev, { blipTerakhir, tolakTerakhir, sabarTerakhir })
  }, [eventTick])
}

interface RefWaktu {
  blipTerakhir: { current: number }
  tolakTerakhir: { current: number }
  sabarTerakhir: { current: number }
}

function mainkan(ev: GameEvent, ref: RefWaktu): void {
  const { blipTerakhir, tolakTerakhir, sabarTerakhir } = ref
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
    case 'DIUSIR':
      sfxBuzzer()
      break

    case 'IGD_TIBA':
      // Audit audio 2026-08-02: dipisah dari sfxBuzzer. Buzzer = "kamu salah";
      // pasien gawat tiba = peristiwa eksternal mendesak. Kategori beda,
      // bunyi harus beda (Brewster: bedakan lewat jumlah nada & ritme).
      sfxSirine()
      break

    case 'PASIEN_DIPANGGIL':
      sfxPanggil()
      break

    case 'SABAR_MENIPIS': {
      const kini = performance.now()
      if (kini - sabarTerakhir.current < JEDA_SABAR_MS) return
      sabarTerakhir.current = kini
      sfxTickSabar()
      break
    }

    case 'BLOK_BERGANTI':
      sfxBlok()
      break

    case 'HOTSPOT_DITEMUKAN':
      sfxTemuan()
      break

    case 'OBSERVASI_SELESAI':
    case 'KEGIATAN_SELESAI':
    case 'PEMULIHAN_SELESAI':
      sfxSelesai()
      break

    case 'KUNJUNGAN_SELESAI':
      if (ev.hasil.berhasil) sfxArpeggio()
      else sfxSelesai()
      break

    case 'ERROR_AKSI': {
      // "Tidak bisa" ≠ "kamu salah secara klinis" — thud lirih, bukan buzzer.
      const kini = performance.now()
      if (kini - tolakTerakhir.current < JEDA_TOLAK_MS) return
      tolakTerakhir.current = kini
      sfxTolak()
      break
    }

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

    // SENGAJA hening (audit kelengkapan 2026-08-02, bukan kelalaian):
    // - VITAL_TERUKUR / TEMUAN_FISIK / LAB_DIPESAN / OBSERVASI_DIMULAI:
    //   aksi rutin beruntun — klik universal sudah memberi umpan balik;
    //   bunyi khusus per aksi hanya menambah derau.
    // - DEX_BERTAMBAH: selalu berbarengan ENCOUNTER_SELESAI yang sudah
    //   berbunyi; dua SFX bertumpuk jadi bubur.
    default:
      break
  }
}
