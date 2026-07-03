/**
 * APP SHELL — routing layar, HUD, toaster, audio hook.
 * Layar diambil dari state.layar (engine yang menentukan; UI hanya menampilkan).
 */

import { useEffect } from 'react'
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
import { useAudio } from './audio/useAudio'
import { useBgm } from './audio/bgm'
import { MuteButton } from './audio/MuteButton'
import { Pengaturan } from './components/Pengaturan'
import { usePengaturan } from './usePengaturan'
import './App.css'

export default function App() {
  const state = useGame((s) => s.state)
  const muatAutosave = useGame((s) => s.muatAutosave)
  const muatMetaDanSlot = useGame((s) => s.muatMetaDanSlot)
  const pengaturan = usePengaturan()
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
    return (
      <div data-mode={pengaturan.modeMalam === 'malam' ? 'malam' : 'pagi'}>
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
        {state.layar === 'meja' && <MejaKerja />}
        {state.layar === 'klinik' && <Klinik />}
        {state.layar === 'peta' && <PetaDesa />}
        {state.layar === 'kunjungan' && <Kunjungan />}
        {state.layar === 'kegiatan' && <Kegiatan />}
        {state.layar === 'igd' && <Igd />}
        {state.layar === 'dex' && <DexSkdi />}
        {state.layar === 'rapor' && <Rapor />}
        {state.layar === 'laporan' && <LaporanAkhir />}
      </main>
      <Toaster />
      <MuteButton />
      <Pengaturan />
    </div>
  )
}
