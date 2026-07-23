/**
 * TUTORIAL KLINIK — sorotan UI utk encounter tutorial (DeepThink "onboarding
 * railroaded", keputusan user). Konstanta kasus terpandu ada di engine
 * (`@engine/tutorial`, dipakai init.ts juga) — file ini murni teks banner
 * + helper "apakah tombol X yang harus disorot" per Deck.
 */
import type { EncounterState } from '@engine/state'
import { KASUS_TUTORIAL, ANAMNESIS_PERTAMA_TUTORIAL, REGION_PERTAMA_TUTORIAL, OBAT_PERTAMA_TUTORIAL } from '@engine/tutorial'

export { KASUS_TUTORIAL, ANAMNESIS_PERTAMA_TUTORIAL, REGION_PERTAMA_TUTORIAL, OBAT_PERTAMA_TUTORIAL }

/** Aktif hanya bila tutorial menyala DAN pasien di layar ini memang kasus terpandunya. */
export function tutorialUntukEncounter(tutorialAktif: boolean, kasusId: string): boolean {
  return tutorialAktif && kasusId === KASUS_TUTORIAL
}

export const BANNER_TUTORIAL: Record<EncounterState['fase'], string> = {
  // Audit editorial 2026-07-23: "MEMPENGARUHI" → bentuk baku "MEMENGARUHI"
  // (KBBI; konsisten dgn PanelHasil "tak memengaruhi skor").
  anamnesis: '🎓 Latihan pertama: pasien ini TAK MEMENGARUHI skor. Klik pertanyaan yang menyala untuk mulai anamnesis.',
  pemeriksaan: '🎓 Ukur tanda vital dulu, lalu periksa regio yang menyala.',
  diagnosis: '🎓 Pilih diagnosis yang menyala, lalu stempelkan.',
  terapi: '🎓 Tambahkan obat yang menyala ke resep, lalu lanjutkan.',
  disposisi: '🎓 Pasien ini cukup dipulangkan — klik tombol yang menyala.',
  selesai: '',
}
