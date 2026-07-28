/**
 * EVENT ENGINE — keluaran samping reducer untuk UI (juice, toast, suara, modal).
 * Event TIDAK mengubah state; ia narasi tentang apa yang baru terjadi.
 */

import type { PenilaianEncounter, HasilKunjungan, Surat } from './state'
import type { HasilKegiatan } from './kegiatan'

export type GameEvent =
  | { type: 'BLOK_BERGANTI'; blok: 'pagi' | 'siang' | 'sore' }
  | { type: 'HARI_BARU'; hari: number }
  | { type: 'PASIEN_DIPANGGIL'; nama: string }
  | { type: 'PASIEN_MENJAWAB'; teks: string; olehPendamping?: boolean }
  | { type: 'SABAR_MENIPIS' }
  | { type: 'VITAL_TERUKUR' }
  | { type: 'TEMUAN_FISIK'; region: string; temuan: string }
  | { type: 'LAB_DIPESAN'; labId: string; besok: boolean }
  | { type: 'OBSERVASI_DIMULAI'; durasiMenit: number }
  | { type: 'OBSERVASI_SELESAI'; durasiMenit: number; hasil: string }
  | { type: 'FIREWALL_ALERGI'; obatId: string; golongan: string }
  | { type: 'STEMPEL'; jenis: 'tegak' | 'suspek' | 'pulang' | 'rujuk' | 'kontraindikasi' }
  | { type: 'ENCOUNTER_SELESAI'; penilaian: PenilaianEncounter }
  | { type: 'HOTSPOT_DITEMUKAN'; hotspotId: string; narasi: string; indikator?: string }
  | { type: 'WARGA_BICARA'; teks: string; bohong?: boolean }
  | { type: 'DIUSIR' }
  | { type: 'KUNJUNGAN_SELESAI'; hasil: HasilKunjungan }
  | { type: 'KEGIATAN_SELESAI'; hasil: HasilKegiatan }
  | { type: 'SURAT_MASUK'; surat: Surat }
  | { type: 'KARMA_TERJADI'; narasi: string }
  | { type: 'KARMA_DICEGAH'; narasi: string }
  | { type: 'IGD_TIBA'; narasi: string }
  | { type: 'KODE_HITAM'; narasi: string }
  | { type: 'DEX_BERTAMBAH'; kasusId: string; bintang: number }
  | { type: 'PEMULIHAN_SELESAI'; jenis: 'istirahat' | 'olahraga' | 'keluarga'; narasi: string }
  | { type: 'TAMAT'; grade: string }
  | { type: 'ERROR_AKSI'; pesan: string }
