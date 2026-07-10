/**
 * APP SHELL — routing layar, HUD, toaster, audio hook.
 * Layar diambil dari state.layar (engine yang menentukan; UI hanya menampilkan).
 */

import { useEffect, useRef, useState } from 'react'
import { useGame } from './store'
import { TitleScreen } from './screens/TitleScreen'
import { MejaKerja } from './screens/MejaKerja'
import { Klinik } from './screens/Klinik'
import { PetaDesa } from './screens/PetaDesa'
import { Kunjungan } from './screens/Kunjungan'
import { Kegiatan } from './screens/Kegiatan'
import { Igd } from './screens/Igd'
import { DexSkdi } from './screens/DexSkdi'
import { Rapor } from './screens/Rapor'
import { LaporanAkhir } from './screens/LaporanAkhir'
import { Hud } from './components/Hud'
import { Toaster } from './components/Toaster'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useAudio } from './audio/useAudio'
import { useBgm } from './audio/bgm'
import { MuteButton } from './audio/MuteButton'
import { Pengaturan } from './components/Pengaturan'
import { Onboarding, sudahOnboarding } from './components/Onboarding'
import { usePengaturan } from './usePengaturan'
import './App.css'

const LAYAR_DIKENAL = new Set([
  'meja',
  'klinik',
  'peta',
  'kunjungan',
  'kegiatan',
  'igd',
  'dex',
  'rapor',
  'laporan',
])

// CODEX audit UI/UX 2026-07-10 (#18): label manusiawi utk pengumuman screen-reader
// saat fokus pindah layar — independen dari `tabs` di Hud.tsx (itu komponen, bukan util).
const LABEL_LAYAR: Record<string, string> = {
  meja: 'Meja Kerja',
  klinik: 'Klinik',
  peta: 'Peta Desa',
  kunjungan: 'Kunjungan',
  kegiatan: 'Kegiatan',
  igd: 'IGD',
  dex: 'Buku Saku',
  rapor: 'Rapor',
  laporan: 'Laporan Akhir',
}

export default function App() {
  const state = useGame((s) => s.state)
  const dispatch = useGame((s) => s.dispatch)
  const muatAutosave = useGame((s) => s.muatAutosave)
  const muatMetaDanSlot = useGame((s) => s.muatMetaDanSlot)
  const pengaturan = usePengaturan()
  // M7.30 — onboarding sekali per-instalasi, hanya Hari 1 blok pagi.
  const [onboardingSelesai, setOnboardingSelesai] = useState(sudahOnboarding)
  useAudio()
  useBgm()

  // DeepThink "game juice" (2026-07-04): getar layar singkat saat Kode Hitam —
  // konsekuensi paling berat butuh beban visual sepadan, bukan cuma teks surat.
  const eventTick = useGame((s) => s.eventTick)
  const [getarKodeHitam, setGetarKodeHitam] = useState(false)
  useEffect(() => {
    if (eventTick === 0) return
    const kenaKodeHitam = useGame.getState().lastEvents.some((e) => e.type === 'KODE_HITAM')
    if (!kenaKodeHitam) return
    setGetarKodeHitam(true)
    const t = window.setTimeout(() => setGetarKodeHitam(false), 500)
    return () => window.clearTimeout(t)
  }, [eventTick])

  useEffect(() => {
    // Coba lanjutkan autosave saat boot (layar judul tetap yang memutuskan);
    // sekalian muat meta lintas-playthrough & daftar slot manual (M5.24/25).
    void muatAutosave()
    void muatMetaDanSlot()
  }, [muatAutosave, muatMetaDanSlot])

  // M7.31 — terapkan preferensi visual ke root: ukuran teks (skala em global)
  // + reduksi gerak (kelas yang mematikan animasi, melengkapi media-query OS).
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${pengaturan.ukuranTeks * 100}%`
    root.classList.toggle('kurangi-gerak', pengaturan.kurangiGerak)
  }, [pengaturan.ukuranTeks, pengaturan.kurangiGerak])

  // CODEX audit UI/UX 2026-07-10 (#18): key={state.layar} pada ErrorBoundary di
  // bawah me-remount seluruh subtree saat pindah layar — tombol "Kembali" dsb
  // yg ada DI DALAM layar lenyap, fokus jatuh ke <body> tanpa konteks bagi
  // keyboard/screen-reader. Pindahkan fokus ke <main> itu sendiri tiap ganti layar.
  // Review workflow Batch-7: DeckAksi.tsx (klinik/DeckAksi.tsx) punya useEffect
  // SEJENIS yg fokus ke <section>-nya tiap `enc.fase` berganti. React menjalankan
  // effect ANAK sebelum effect INDUK dalam commit yang sama — bila state.layar
  // DAN enc.fase kebetulan berubah bersamaan, fokus <main> ini akan MENIMPA
  // fokus DeckAksi. Saat ini TAK bisa terjadi (Hud.tsx mengunci semua tab lain
  // selama state.klinik.aktif terisi, dan tiap transisi layar ke/dari 'klinik'
  // menjamin klinik.aktif undefined tepat di titik itu) — tapi implisit, tak
  // dijamin test/komentar mana pun selain ini. Waspadai bila M11/lanjutan
  // mengubah invarian itu.
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true })
  }, [state?.layar])

  // Mode gelap: auto (sore=malam) bisa di-override paksa siang/malam (CODEX P3).
  const mode =
    pengaturan.modeMalam === 'malam'
      ? 'malam'
      : pengaturan.modeMalam === 'siang'
        ? 'pagi'
        : state && state.blok === 'sore'
          ? 'malam'
          : 'pagi'

  if (!state) {
    // Layar judul SELALU "pagi": latarnya gradient fajar hardcoded & itu
    // identitas game ("Puskesmas Pagi"). Memaksa gelap di sini membuat panel
    // kertas gelap mengambang di atas langit terang — inkonsisten (CODEX P2).
    // Preferensi gelap pemain tetap berlaku begitu masuk permainan.
    return (
      <div data-mode="pagi">
        <TitleScreen />
        <MuteButton />
        <Pengaturan />
      </div>
    )
  }

  return (
    <div className={`app-frame${getarKodeHitam ? ' app-frame--kode-hitam' : ''}`} data-mode={mode}>
      <Hud />
      <main
        className="app-layar"
        ref={mainRef}
        tabIndex={-1}
        aria-label={LABEL_LAYAR[state.layar] ?? state.layar}
      >
        {/* Boundary per-layar: crash render satu layar tak menjatuhkan HUD/Pengaturan,
            dan `key={state.layar}` me-remount saat pindah layar → pulih otomatis
            begitu mahasiswa menavigasi keluar lewat HUD. */}
        <ErrorBoundary judul={state.layar} variant="layar" key={state.layar}>
          <div className="app-transisi">
            {state.layar === 'meja' && <MejaKerja />}
            {state.layar === 'klinik' && <Klinik />}
            {state.layar === 'peta' && <PetaDesa />}
            {state.layar === 'kunjungan' && <Kunjungan />}
            {state.layar === 'kegiatan' && <Kegiatan />}
            {state.layar === 'igd' && <Igd />}
            {state.layar === 'dex' && <DexSkdi />}
            {state.layar === 'rapor' && <Rapor />}
            {state.layar === 'laporan' && <LaporanAkhir />}
            {/* CODEX ronde-11 #3/#4: rangkaian di atas tanpa fallback — `layar`
                asing (save.ts kini menolaknya, tapi ini jaring terakhir) akan
                merender area utama kosong TANPA throw, luput dari ErrorBoundary.
                Beri jalan keluar eksplisit alih-alih diam kosong. */}
            {!LAYAR_DIKENAL.has(state.layar) && (
              <div className="layar-tak-dikenal">
                <p>Layar tidak dikenal ({state.layar}).</p>
                <button className="tombol" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'meja' })}>
                  Kembali ke Meja Kerja
                </button>
              </div>
            )}
          </div>
        </ErrorBoundary>
      </main>
      <Toaster />
      {/* M10.a: mute+gigi kini didok di dalam <Hud /> (bukan melayang) —
          versi melayang hanya utk TitleScreen di atas, yang tanpa HUD. */}
      {!onboardingSelesai && state.hari === 1 && state.blok === 'pagi' && (
        <Onboarding onSelesai={() => setOnboardingSelesai(true)} />
      )}
    </div>
  )
}
