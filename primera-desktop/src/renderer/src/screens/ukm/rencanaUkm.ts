import type { GameState, KeluargaState } from '@engine/state'
import type { IndikatorPisPk } from '@content/types'
import { PACK } from '@content/index'
import { HARI_BUKA_PROLANIS } from '@engine/reducer'
import { HARI_STASE } from '@engine/paketUjian'
import { hitungIksKeluarga } from '@engine/pispk'
import { kaderRw, karmaTerlihat, LABEL_INDIKATOR } from '../peta/petaUtil'

// Cermin cakupan Posyandu di reducer; paritas dipagari uji perilaku engine.
export const KIA_POSYANDU: readonly IndikatorPisPk[] = ['imunisasi_dasar', 'asi_eksklusif', 'pantau_tumbuh_kembang']

export function sasaranKia(state: GameState, rw: number) {
  return Object.entries(state.desa.keluarga).flatMap(([id, kel]) => {
    const keluarga = PACK.keluarga[id]
    if (!keluarga || keluarga.rw !== rw) return []
    const kolom = KIA_POSYANDU.filter((ind) => kel.indikator[ind].sumber === 'kader' && kel.indikator[ind].status !== 'na')
    return kolom.length ? [{ id, nama: keluarga.namaKeluarga, kolom }] : []
  })
}

export function pengirimSurat(state: GameState, dari: string): string {
  const match = /^Kader RW (\d+)$/i.exec(dari)
  if (!match) return dari
  const rw = Number(match[1])
  const kader = kaderRw(state, rw)
  const kampung = state.desa.rw.find((r) => r.nomor === rw)?.nama
  return kader ? `${kader.nama} — kader RW ${rw}${kampung ? `, ${kampung}` : ''}` : dari
}

/** Hanya id indikator utuh; tidak mengubah kata umum KB/JKN dalam narasi klinis. */
export function teksIndikator(teks: string): string {
  const ids = Object.keys(LABEL_INDIKATOR).sort((a, b) => b.length - a.length)
  return teks.replace(new RegExp(`\\b(${ids.join('|')})\\b`, 'g'), (id) => LABEL_INDIKATOR[id as IndikatorPisPk].penuh)
}

export function prioritasKeluarga(kel: KeluargaState, hari: number): number {
  if (kel.arcSelesai) return 100
  if (karmaTerlihat(kel, hari)) return 0
  if (kel.followUpHari !== undefined && kel.followUpHari <= hari) return 1
  const iks = hitungIksKeluarga(kel)
  return iks === null ? 3 : 2 + iks
}

/** Kalender prospektif, bukan janji slot tersedia/kehadiran peserta. */
export function jadwalProlanis(state: GameState) {
  const periode = HARI_BUKA_PROLANIS[state.mode]
  const batas = HARI_STASE[state.mode]
  const slotLewat = state.blok === 'sore' || state.lapanganTerpakai || !!state.hasilKunjunganHariIni
  const pertama = Math.max(state.hari + (slotLewat ? 1 : 0), state.prolanis.sesiBerikutHari ?? periode, periode)
  const hari: number[] = []
  for (let d = pertama; d <= batas; d += periode) hari.push(d)
  const berikutNomor = state.tally.prolanisSesi + 1
  const totalMungkin = state.tally.prolanisSesi + hari.length
  const tundaPertama = Math.max(state.hari + 1, state.prolanis.sesiBerikutHari ?? periode, periode)
  const jikaTunda = Math.max(0, Math.floor((batas - tundaPertama) / periode) + 1)
  return { hari, batas, periode, berikutNomor, totalMungkin, rugiJikaTunda: hari.length > jikaTunda }
}
