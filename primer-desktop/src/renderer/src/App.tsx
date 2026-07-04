/**
 * APP SHELL — routing layar, HUD, toaster, audio hook.
 * Layar diambil dari state.layar (engine yang menentukan; UI hanya menampilkan).
 */

import { useEffect, useState } from 'react'
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
    <div className="app-frame" data-mode={mode}>
      <Hud />
      <main className="app-layar">
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
      <MuteButton />
      <Pengaturan />
      {!onboardingSelesai && state.hari === 1 && state.blok === 'pagi' && (
        <Onboarding onSelesai={() => setOnboardingSelesai(true)} />
      )}
    </div>
  )
}
