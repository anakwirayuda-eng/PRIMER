/**
 * BADGE (M5.24) — 9 pencapaian lintas-playthrough (port semangat 9 badge lama).
 * Dihitung MURNI dari state saat stase tamat; persistensi lifetime (gabungan
 * antar-playthrough) dikerjakan store lewat slot 'meta' — engine tetap pure.
 */

import type { GameState } from './state'
import { hitungSkor } from './scoring'

export interface Badge {
  id: string
  nama: string
  deskripsi: string
  ikon: string
}

export const SEMUA_BADGE: Badge[] = [
  // Copy-audit 2026-08-01: "PTT" (Pegawai Tidak Tetap) = program yang sudah
  // dihapus 2017 — id internal dipertahankan, nama tampil dipermanusiakan.
  { id: 'ptt_teladan', nama: 'Dokter Teladan', deskripsi: 'Tamat stase dengan grade A.', ikon: '🏅' },
  { id: 'nol_kode_hitam', nama: 'Penjaga Nyawa', deskripsi: 'Menangani ≥2 pasien IGD tanpa satu pun Kode Hitam.', ikon: '⛑️' },
  { id: 'gerbang_kokoh', nama: 'Gerbang Kokoh', deskripsi: 'RRNS ≤5% dengan ≥5 rujukan — gatekeeper sejati.', ikon: '🚪' },
  { id: 'pencegah_takdir', nama: 'Pencegah Takdir', deskripsi: 'Mencegah ≥4 krisis keluarga (karma dibatalkan kunjungan).', ikon: '⏳' },
  { id: 'sahabat_desa', nama: 'Sahabat Desa', deskripsi: 'Menuntaskan arc ≥5 keluarga binaan dengan berhasil.', ikon: '🏡' },
  { id: 'paripurna', nama: 'Akreditasi Paripurna', deskripsi: 'Lulus visitasi akreditasi dengan predikat tertinggi.', ikon: '📋' },
  { id: 'bendahara_rapi', nama: 'Bendahara Rapi', deskripsi: 'Tamat tanpa satu pun teguran Dinkes soal kas.', ikon: '🧾' },
  { id: 'kolektor_dex', nama: 'Kolektor Buku Saku', deskripsi: 'Menguasai (★3) ≥25 penyakit di Buku Saku.', ikon: '📖' },
  { id: 'anti_apatis', nama: 'Hadir Sepenuhnya', deskripsi: '≥15 kunjungan rumah tanpa sekali pun kunjungan kosong (apathy 0).', ikon: '🤝' },
]

/** Hitung badge yang diraih state ini (dipanggil saat tamat; pure). */
export function hitungBadge(state: GameState): string[] {
  const t = state.tally
  const skor = hitungSkor(state)
  const arcBerhasil = Object.values(state.desa.keluarga).filter((k) => k.arcSelesai === 'berhasil').length
  const dexKuasai = Object.values(state.dex).filter((d) => d.bintang >= 3).length
  const rrns = t.rujukanTotal > 0 ? (t.rujukanNonSpesialistik / t.rujukanTotal) * 100 : 100

  const raih: string[] = []
  if (skor.grade === 'A') raih.push('ptt_teladan')
  if (t.igdStabil + t.igdSalahDisposisi >= 2 && t.igdMeninggal === 0) raih.push('nol_kode_hitam')
  if (t.rujukanTotal >= 5 && rrns <= 5) raih.push('gerbang_kokoh')
  if (t.karmaDicegah >= 4) raih.push('pencegah_takdir')
  if (arcBerhasil >= 5) raih.push('sahabat_desa')
  if (state.akreditasi === 'paripurna') raih.push('paripurna')
  if (t.teguranDinkes === 0 && state.hari >= 30) raih.push('bendahara_rapi')
  if (dexKuasai >= 25) raih.push('kolektor_dex')
  if (t.kunjunganTotal >= 15 && t.apathy === 0) raih.push('anti_apatis')
  return raih
}
