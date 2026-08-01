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

/**
 * Apakah stase ini sudah punya aktivitas ternilai — gerbang "ada cukup data"
 * sebelum grade A-D boleh ditampilkan sama sekali.
 *
 * CODEX audit UI/UX 2026-07-10 (#23): `gradeDariTotal` menstempel A-D tanpa
 * syarat ini, sehingga Hari 1 pagi (tally nol, tapi manajemen & resiliensi
 * mulai dari default tinggi) jatuh ke 'D — Perlu Pembinaan' padahal pemain
 * belum melakukan apa pun. Rapor.tsx sudah menjaganya untuk stempel; helper
 * ini menaikkan logika yang sama ke engine agar permukaan lain (progres badge
 * di bawah) tak mengulang salinan yang bisa menyimpang diam-diam.
 */
export function adaAktivitasTernilai(state: GameState): boolean {
  const t = state.tally
  return (
    t.totalPasien > 0 ||
    t.kunjunganTotal > 0 ||
    t.posyanduSesi > 0 ||
    t.prolanisSesi > 0 ||
    t.klbTuntas > 0 ||
    t.igdStabil > 0 ||
    t.igdSalahDisposisi > 0 ||
    t.igdMeninggal > 0 ||
    t.autoBermasalah > 0
  )
}

/**
 * Progres berjalan sebuah badge — MURNI untuk ditampilkan (Rapor), bukan
 * penentu perolehan: `raih` selalu diambil dari `hitungBadge()` di atas
 * sebagai sumber kebenaran tunggal, sehingga angka pajangan tak akan pernah
 * memberi badge yang tak dihitung engine.
 */
export interface ProgresBadge extends Badge {
  raih: boolean
  /** Hitungan berjalan pada syarat utama. */
  kini: number
  /** Ambang syarat utama. */
  target: number
  /** Terkunci permanen stase ini — syarat "tanpa cacat" sudah tercoreng. */
  gagal?: string
  /** Hitungan utama boleh saja cukup, tapi syarat lain belum terpenuhi. */
  tertahan?: string
}

/**
 * Alasan permukaan ini ada (deferred sejak beta.4, dituntaskan 2026-08-01):
 * badge dulu HANYA terungkap di LaporanAkhir setelah stase tamat — pemain
 * baru tahu "kurang satu kunjungan lagi" ketika skor sudah beku dan tak ada
 * lagi yang bisa dikejar. Pencapaian yang mengajarkan perilaku (RRNS rendah,
 * nol Kode Hitam, rekam medis lengkap) hanya berguna bila bisa dilihat
 * SELAGI masih bisa diperbaiki.
 */
export function progresBadge(state: GameState): ProgresBadge[] {
  const t = state.tally
  const skor = hitungSkor(state)
  const arcBerhasil = Object.values(state.desa.keluarga).filter((k) => k.arcSelesai === 'berhasil').length
  const dexKuasai = Object.values(state.dex).filter((d) => d.bintang >= 3).length
  const rrns = t.rujukanTotal > 0 ? (t.rujukanNonSpesialistik / t.rujukanTotal) * 100 : 100
  const diraih = new Set(hitungBadge(state))
  const igdDitangani = t.igdStabil + t.igdSalahDisposisi
  // Predikat akreditasi ditetapkan SEKALI saat visitasi (reducer.ts menjaga
  // `akreditasi === undefined`) — begitu turun bukan-paripurna, tak ada jalan
  // memperbaikinya lagi. Sebelum visitasi, rasio rekam-medis-lengkap adalah
  // proksi berjalan yang persis dipakai reducer utk menentukan predikat.
  const targetRmLengkap = Math.max(1, Math.ceil(0.75 * t.totalPasien))

  const rincian: Record<string, Omit<ProgresBadge, keyof Badge | 'raih'>> = {
    ptt_teladan: {
      kini: skor.grade === 'A' ? 1 : 0,
      target: 1,
      // Tanpa gerbang aktivitas, Hari 1 pagi berbunyi "Grade berjalan D" —
      // persis vonis prematur yang dicegah audit #23 pada stempel Rapor.
      ...(skor.grade === 'A'
        ? {}
        : {
            tertahan: adaAktivitasTernilai(state)
              ? `Grade berjalan ${skor.grade}`
              : 'Grade belum bermakna — belum ada aktivitas ternilai',
          }),
    },
    nol_kode_hitam: {
      kini: igdDitangani,
      target: 2,
      ...(t.igdMeninggal > 0
        ? { gagal: `${t.igdMeninggal} Kode Hitam sudah terjadi — tak bisa dibatalkan` }
        : {}),
    },
    gerbang_kokoh: {
      kini: t.rujukanTotal,
      target: 5,
      ...(t.rujukanTotal === 0
        ? { tertahan: 'Belum ada rujukan — RRNS dinilai setelah ada sampel' }
        : rrns > 5
          ? { tertahan: `RRNS berjalan ${Math.round(rrns)}% (maksimal 5%)` }
          : {}),
    },
    pencegah_takdir: { kini: t.karmaDicegah, target: 4 },
    sahabat_desa: { kini: arcBerhasil, target: 5 },
    paripurna: {
      kini: t.rmLengkap,
      target: targetRmLengkap,
      ...(state.akreditasi !== undefined && state.akreditasi !== 'paripurna'
        ? { gagal: `Visitasi sudah selesai dengan predikat ${state.akreditasi.toUpperCase()}` }
        : state.akreditasi === undefined
          ? { tertahan: 'Predikat ditetapkan saat visitasi akreditasi' }
          : {}),
    },
    bendahara_rapi: {
      kini: Math.min(state.hari, 30),
      target: 30,
      ...(t.teguranDinkes > 0
        ? { gagal: `${t.teguranDinkes} teguran Dinkes sudah tercatat` }
        : {}),
    },
    kolektor_dex: { kini: dexKuasai, target: 25 },
    anti_apatis: {
      kini: t.kunjunganTotal,
      target: 15,
      ...(t.apathy > 0 ? { gagal: `${t.apathy} kunjungan kosong sudah tercatat` } : {}),
    },
  }

  return SEMUA_BADGE.map((b) => ({ ...b, raih: diraih.has(b.id), ...rincian[b.id]! }))
}
