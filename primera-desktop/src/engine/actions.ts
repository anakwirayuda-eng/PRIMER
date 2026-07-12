/**
 * AKSI ENGINE — satu-satunya cara mengubah GameState.
 * UI men-dispatch aksi; reducer memvalidasi & menerapkan; event keluar untuk juice.
 */

import type { Disposisi, FokusProgram, JenisDiagnosis, LayarGame, SbarIsi } from './state'
import type { JustifikasiRujuk, RegionFisik } from '@content/types'

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
  | { type: 'TAMBAH_TINDAKAN'; tindakanId: string }
  | { type: 'HAPUS_TINDAKAN'; tindakanId: string }
  | {
      type: 'DISPOSISI'
      jenis: Disposisi
      sbar?: SbarIsi
      /** RS tujuan SISRUTE (M3.13). Kosong = sistem memilih RS terdekat yang cocok. */
      rumahSakitId?: string
      /** M10.5 §3a: alasan rujukan di luar `harusDirujuk` (lihat validity-check di clinic.ts). */
      justifikasiRujuk?: JustifikasiRujuk
    }

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

  /* -- UKM: kegiatan lapangan terjadwal (M2) ------------------------------------ */
  | { type: 'MULAI_POSYANDU'; rw: number }
  | { type: 'MULAI_PROLANIS' }
  | { type: 'MULAI_KLB'; rw: number; kasusId: string }
  | { type: 'JAWAB_KEGIATAN'; kartuId: string; pilihanId: string }
  | { type: 'DELEGASI_KEGIATAN' } // sisa kartu dijawab kader (posyandu; error 20%)
  | { type: 'TETAPKAN_PROGRAM'; fokus: FokusProgram; rwFokus?: number }
  | { type: 'TUTUP_LOKMIN' }

  /* -- IGD (M3.14): gawat darurat turn-based ------------------------------------ */
  | { type: 'AKSI_IGD'; langkahId: string; pilihanId: string }
  | { type: 'RJP_IGD'; berkualitas: boolean } // pilihan Kode Biru
  | {
      /**
       * CODEX audit (2026-07-12, temuan #2): titik keputusan pasca-ROSC —
       * `ulang_abcde` (benar, re-evaluasi ABCDE/monitor/O2 sebelum transportasi,
       * +30 stabilitas) vs `langsung_rujuk` (godaan skip stabilisasi lanjutan,
       * stabilitas TAK naik, risiko rujuk prematur di fase disposisi berikutnya
       * tetap nyata bila lanjut memilih rujuk).
       */
      type: 'STABILISASI_LANJUTAN_IGD'
      pilihanId: 'ulang_abcde' | 'langsung_rujuk'
    }
  | { type: 'DISPOSISI_IGD'; jenis: 'rujuk' | 'pulang'; rumahSakitId?: string }

  /* -- M4: ekonomi & manajemen bergigi ------------------------------------------ */
  | { type: 'PESAN_OBAT'; obatId: string; jumlah: number } // pengadaan, lead time 3 hari
  | { type: 'PEMULIHAN'; jenis: 'istirahat' | 'olahraga' | 'keluarga' } // akhir pekan

export type ActionType = Action['type']
