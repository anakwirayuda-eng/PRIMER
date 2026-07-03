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
import './App.css'

export default function App() {
  const state = useGame((s) => s.state)
  const muatAutosave = useGame((s) => s.muatAutosave)
  const muatMetaDanSlot = useGame((s) => s.muatMetaDanSlot)
  useAudio()
  useBgm()

  useEffect(() => {
    // Coba lanjutkan autosave saat boot (layar judul tetap yang memutuskan);
    // sekalian muat meta lintas-playthrough & daftar slot manual (M5.24/25).
    void muatAutosave()
    void muatMetaDanSlot()
  }, [muatAutosave, muatMetaDanSlot])

  if (!state) {
    return (
      <>
        <TitleScreen />
        <MuteButton />
      </>
    )
  }

  return (
    <div className="app-frame" data-mode={state.blok === 'sore' ? 'malam' : 'pagi'}>
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
    </div>
  )
}
