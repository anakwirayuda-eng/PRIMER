/**
 * AGENDA BESOK (usulan Claude 2026-07-23, disetujui dr. Wirayuda) — kartu
 * perencanaan di debrief sore: loop harian dulu berhenti di refleksi dan
 * pemain tidur "buta" terhadap hari esok, padahal semua datanya sudah ada di
 * state. Murni display/derivasi read-only — TIDAK menyentuh engine/skor, dan
 * TIDAK meramal hal yang belum ditentukan engine (mis. isi antrian poli besok
 * yang baru di-draw Director saat pagi).
 */

import type { GameState } from '@engine/state'
import { HARI_BUKA_PETA, HARI_BUKA_KUNJUNGAN } from '@engine/reducer'
import { PACK } from '@content/index'

export interface ItemAgenda {
  id: string
  teks: string
}

/** Episode perawatan yang sudah tutup — selaras filter JejakPerawatan/MejaKerja. */
function terminal(status: string): boolean {
  return status === 'terverifikasi' || status === 'berakhir'
}

export function agendaBesok(state: GameState): ItemAgenda[] {
  if (state.tamat) return []
  const besok = state.hari + 1
  const agenda: ItemAgenda[] = []

  if (besok === HARI_BUKA_PETA) {
    agenda.push({
      id: 'peta-terbuka',
      teks: '🗺️ Peta Desa terbuka besok — kader mulai mengirim data keluarga.',
    })
  }
  if (besok === HARI_BUKA_KUNJUNGAN) {
    agenda.push({
      id: 'kunjungan-terbuka',
      teks: '🏠 Kunjungan rumah terbuka besok — slot lapangan pertamamu menanti.',
    })
  }

  // Janji tindak lanjut keluarga yang jatuh tempo (termasuk yang sudah lewat).
  const keluargaJanji = Object.values(state.desa.keluarga).filter(
    (kel) => !kel.arcSelesai && kel.followUpHari !== undefined && kel.followUpHari <= besok,
  ).length
  if (keluargaJanji > 0) {
    agenda.push({
      id: 'janji-keluarga',
      teks: `👣 ${keluargaJanji} keluarga menunggu tindak lanjut kunjungan — janjinya jatuh tempo.`,
    })
  }

  // Episode perawatan bertenggat (pola dueDay yang sama dgn Jejak Perawatan).
  const episodeTempo = state.careEpisodes.filter(
    (episode) =>
      !terminal(episode.status) && episode.dueDay !== undefined && episode.dueDay <= besok,
  ).length
  if (episodeTempo > 0) {
    agenda.push({
      id: 'episode-tempo',
      teks: `🧾 ${episodeTempo} episode perawatan jatuh tempo — periksa Jejak Perawatan sebelum siang.`,
    })
  }

  // Sesi Prolanis berikutnya terbuka besok.
  if (
    state.prolanis.roster.length > 0 &&
    state.prolanis.sesiBerikutHari !== undefined &&
    state.prolanis.sesiBerikutHari === besok
  ) {
    agenda.push({
      id: 'prolanis-buka',
      teks: '🩺 Sesi Prolanis bulan ini dapat digelar mulai besok siang.',
    })
  }

  // Kiriman obat yang tiba besok (pesanan Gudang Obat, tibaHari eksplisit).
  const kirimanBesok = state.gudang.pesanan.filter((p) => p.tibaHari === besok)
  if (kirimanBesok.length > 0) {
    const nama = kirimanBesok
      .slice(0, 3)
      .map((p) => PACK.obat[p.obatId]?.nama ?? p.obatId)
      .join(', ')
    const sisa = kirimanBesok.length - Math.min(3, kirimanBesok.length)
    agenda.push({
      id: 'obat-tiba',
      teks: `📦 Kiriman obat tiba besok: ${nama}${sisa > 0 ? ` (+${sisa} lagi)` : ''}.`,
    })
  }

  // Akhir pekan — slot pemulihan diri (aturan hari%7===0 di MejaKerja siang).
  if (besok % 7 === 0) {
    agenda.push({
      id: 'pemulihan',
      teks: '😴 Besok akhir pekan — slot pemulihan diri tersedia di siang hari.',
    })
  }

  return agenda
}
