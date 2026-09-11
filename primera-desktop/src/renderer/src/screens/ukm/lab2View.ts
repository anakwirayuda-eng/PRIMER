import type { CareEpisodeLite, GameState } from '@engine/state'
import { pangkasSurveilans, type SurveilansEntry } from '@engine/surveilans'

export const episodeTuntas = (e: CareEpisodeLite): boolean => e.status === 'terverifikasi' || e.status === 'berakhir'
export function episodePrioritas(episodes: readonly CareEpisodeLite[]): CareEpisodeLite[] {
  return episodes.filter((e) => !episodeTuntas(e)).sort((a, b) =>
    (a.dueDay ?? Infinity) - (b.dueDay ?? Infinity) || b.updatedDay - a.updatedDay || a.id.localeCompare(b.id))
}
export function labelJanji(e: CareEpisodeLite, hari: number): string {
  if (episodeTuntas(e)) return e.status === 'terverifikasi' ? 'Tindak lanjut tuntas' : 'Berakhir tanpa pemulihan'
  if (e.dueDay === undefined) return 'Jadwal belum ditetapkan'
  if (e.dueDay < hari) return `Lewat ${hari - e.dueDay} hari`
  if (e.dueDay === hari) return 'Jadwal hari ini'
  return `Hari ${e.dueDay} · ${e.dueDay - hari} hari lagi`
}

export interface CatatanOrang { id: string; nama: string; rw: number; hari: number[] }
/** Pasien tanpa identitas tetap terpisah, sesuai kompatibilitas catatan lama di engine. */
export function catatanPenyelidikan(entries: SurveilansEntry[], hari: number, kasusId: string): CatatanOrang[] {
  const orang = new Map<string, CatatanOrang>()
  pangkasSurveilans(entries, hari).filter((e) => e.kasusId === kasusId).forEach((e, i) => {
    const id = `${e.rw}|${e.pasienNama === undefined ? `anon:${i}` : `nama:${e.pasienNama}`}`
    const ada = orang.get(id)
    if (ada) ada.hari.push(e.hari)
    else orang.set(id, { id, nama: e.pasienNama ?? 'Identitas belum tercatat', rw: e.rw, hari: [e.hari] })
  })
  return [...orang.values()].map((o) => ({ ...o, hari: o.hari.sort((a, b) => a - b) }))
    .sort((a, b) => a.hari[0]! - b.hari[0]! || a.nama.localeCompare(b.nama))
}
export type LapisanPeta = 'cakupan' | 'kemajuan' | 'tindak_lanjut' | 'sinyal'
export function hitungTindakLanjutRw(state: GameState, rw: number): number {
  return state.careEpisodes.filter((e) => e.rw === rw && !episodeTuntas(e)).length
}
