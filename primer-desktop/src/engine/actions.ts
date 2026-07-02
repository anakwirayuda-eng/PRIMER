/**
 * AKSI ENGINE — satu-satunya cara mengubah GameState.
 * UI men-dispatch aksi; reducer memvalidasi & menerapkan; event keluar untuk juice.
 */

import type { Disposisi, JenisDiagnosis, LayarGame, SbarIsi } from './state'
import type { RegionFisik } from '@content/types'

export type Action =
  /* -- Alur waktu ---------------------------------------------------------- */
  | { type: 'MULAI_GAME'; namaDokter: string; seed: number }
  | { type: 'LANJUTKAN' } // mengalirkan blok: pagi→siang→sore→(tidur)→pagi hari berikutnya
  | { type: 'PINDAH_LAYAR'; layar: LayarGame }

  /* -- Meja kerja ----------------------------------------------------------- */
  | { type: 'BACA_SURAT'; suratId: string }
  | { type: 'TULIS_REFLEKSI'; teks: string }
  | { type: 'TUTUP_REKAP' } // tutup modal rekap pekan pertama (persist di flags)

  /* -- Klinik (Lembar Periksa) ---------------------------------------------- */
  | { type: 'PANGGIL_PASIEN' } // ambil pasien berikutnya dari antrian
  | { type: 'TANYA'; pertanyaanId: string }
  | { type: 'UKUR_VITAL' }
  | { type: 'PERIKSA'; region: RegionFisik }
  | { type: 'PESAN_LAB'; labId: string }
  | { type: 'LANJUT_FASE' } // anamnesis→pemeriksaan→diagnosis→terapi→disposisi
  | { type: 'KOMIT_DIAGNOSIS'; icd10: string; jenis: JenisDiagnosis }
  | { type: 'TAMBAH_OBAT'; obatId: string }
  | { type: 'HAPUS_OBAT'; obatId: string }
  | { type: 'TAMBAH_EDUKASI'; edukasiId: string }
  | { type: 'HAPUS_EDUKASI'; edukasiId: string }
  | { type: 'DISPOSISI'; jenis: Disposisi; sbar?: SbarIsi }

  /* -- UKM: peta & roster ----------------------------------------------------- */
  | { type: 'PILIH_BINAAN'; keluargaId: string }
  | { type: 'LEPAS_BINAAN'; keluargaId: string }

  /* -- UKM: kunjungan rumah (match engine 4 babak) ----------------------------- */
  | { type: 'MULAI_KUNJUNGAN'; keluargaId: string }
  | { type: 'KLIK_HOTSPOT'; hotspotId: string }
  | { type: 'LANJUT_BABAK' }
  | { type: 'PILIH_DIALOG'; pilihanId: string }
  | { type: 'KOMIT_HAMBATAN'; hipotesis: 'kapabilitas' | 'kesempatan' | 'motivasi' }
  | { type: 'PILIH_INTERVENSI'; intervensiId: string }

export type ActionType = Action['type']
