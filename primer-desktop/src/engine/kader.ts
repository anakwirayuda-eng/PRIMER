/**
 * KADER — scout harian (Lapis 1 UKM): "dokter = manajer sistem, bukan enumerator".
 * Tiap kader menyurvei 2-4 KK/hari di RW-nya. Keluarga binaan yang masih
 * 'belum' terisi data kader — TAPI kader manusia: indikator yang termasuk
 * biasnya, atau saat ketelitiannya meleset, tercatat TERBALIK. Data ber-chip
 * `~` ini meracuni IKS sampai dokter memverifikasinya sendiri.
 *
 * Surat laporan: maksimal 1/hari, id deterministik `surat_kader_{hari}_{kaderId}`,
 * gaya bahasa hangat khas kader — kadang menyelipkan keanehan yang
 * mengisyaratkan biasnya (petunjuk halus, bukan pengumuman).
 */

import type { GameState, KaderState, KeluargaState, NilaiIndikator, RwState, Surat } from './state'
import type { ContentPack } from '@content/pack'
import type { IndikatorPisPk, StatusIndikator } from '@content/types'
import type { Rng } from './core/rng'
import { hitungIksKeluarga, SEMUA_INDIKATOR_PISPK } from './pispk'

/** Baseline IKS deterministik per jarak RW (KK statistik non-binaan). */
const BASELINE_JARAK: Record<'dekat' | 'sedang' | 'terpencil', number> = {
  dekat: 0.62,
  sedang: 0.55,
  terpencil: 0.45,
}

/** Frasa ramah tiap indikator, untuk surat laporan. */
const LABEL_INDIKATOR: Record<IndikatorPisPk, string> = {
  kb: 'urusan KB',
  persalinan_faskes: 'persalinan di bidan atau Puskesmas',
  imunisasi_dasar: 'imunisasi bayi',
  asi_eksklusif: 'ASI eksklusif',
  pantau_tumbuh_kembang: 'penimbangan balita',
  tb_berobat_standar: 'obat TB',
  hipertensi_berobat: 'obat darah tinggi',
  jiwa_tidak_ditelantarkan: 'perawatan anggota yang sakit jiwa',
  tidak_merokok: 'rokok',
  jkn: 'kartu JKN',
  air_bersih: 'air bersih',
  jamban_sehat: 'jamban',
}

const SALAM_PEMBUKA: readonly string[] = [
  'Assalamualaikum, Dok.',
  'Selamat sore, Dok, laporan singkat dari saya.',
  'Permisi, Dok. Sebentar saja, ini catatan keliling saya.',
  'Dok, titip laporan hari ini ya.',
]

const KALIMAT_PENUTUP: readonly string[] = [
  'Maaf kalau ada yang terlewat — mata saya sudah tidak seawas dulu.',
  'Kalau ada yang janggal, Dokter cek sendiri saja ya, biar mantap.',
  'Besok saya lanjut ke gang sebelah. Sehat selalu, Dok.',
  'Semoga catatannya berguna. Salam dari warga.',
]

function balikStatus(status: StatusIndikator): StatusIndikator {
  if (status === 'ya') return 'tidak'
  if (status === 'tidak') return 'ya'
  return status
}

function clamp01(nilai: number): number {
  return Math.max(0, Math.min(1, nilai))
}

interface AktivitasKader {
  kader: KaderState
  rw: RwState
  /** KK statistik yang baru disurvei hari ini. */
  tambah: number
  /** Keluarga binaan yang datanya baru diisi hari ini. */
  keluargaDiisi: { id: string; nama: string }[]
}

/**
 * Proses harian seluruh kader: survei KK, isi data keluarga (kadang salah!),
 * agregasi IKS RW, dan satu surat laporan bergaya persona.
 * Murni & deterministik — seluruh keacakan dari `rng` yang diturunkan reducer.
 */
export function prosesHarianKader(
  state: GameState,
  pack: ContentPack,
  rng: Rng,
): {
  keluarga: Record<string, KeluargaState>
  rw: RwState[]
  kader: Record<string, KaderState>
  surat: Surat[]
} {
  const hari = state.hari
  const keluarga: Record<string, KeluargaState> = { ...state.desa.keluarga }
  const kader: Record<string, KaderState> = { ...state.desa.kader }
  const rw: RwState[] = state.desa.rw.map((r) => ({ ...r }))

  // Urutan iterasi tetap (RW lalu id) — determinisme lintas save/load.
  const daftarKader = Object.values(kader).sort((a, b) => a.rw - b.rw || a.id.localeCompare(b.id))
  const idKeluargaUrut = Object.keys(pack.keluarga).sort()

  const aktivitas: AktivitasKader[] = []

  for (const k of daftarKader) {
    const wilayah = rw.find((r) => r.nomor === k.rw)
    if (!wilayah) continue

    // Survei 2-4 KK statistik per hari, mentok di totalKk.
    const target = rng.int(2, 4)
    const tambah = Math.max(0, Math.min(target, wilayah.totalKk - wilayah.kkTersurvei))
    if (tambah > 0) {
      wilayah.kkTersurvei += tambah
      kader[k.id] = { ...k, kkTersurvei: k.kkTersurvei + tambah }
    }

    // Keluarga binaan (bernama) di RW ini yang datanya masih 'belum'.
    const keluargaDiisi: { id: string; nama: string }[] = []
    for (const id of idKeluargaUrut) {
      const profil = pack.keluarga[id]
      const st = keluarga[id]
      if (!profil || !st || profil.rw !== k.rw) continue

      const adaBelum = SEMUA_INDIKATOR_PISPK.some(
        (ind) => st.indikator[ind].sumber === 'belum' && st.indikator[ind].statusSebenarnya !== 'na',
      )
      if (!adaBelum) continue

      const indikator: Record<IndikatorPisPk, NilaiIndikator> = { ...st.indikator }
      for (const ind of SEMUA_INDIKATOR_PISPK) {
        const nilai = indikator[ind]
        if (nilai.sumber !== 'belum' || nilai.statusSebenarnya === 'na') continue
        // Bias kader SELALU salah pada indikatornya; sisanya salah sesuai
        // peluang teledor (100 − ketelitian)%.
        const salah = k.bias.includes(ind) || rng.chance((100 - k.ketelitian) / 100)
        indikator[ind] = {
          ...nilai,
          status: salah ? balikStatus(nilai.statusSebenarnya) : nilai.statusSebenarnya,
          sumber: 'kader',
          hariData: hari,
        }
      }
      keluarga[id] = { ...st, indikator }
      keluargaDiisi.push({ id, nama: profil.namaKeluarga })
    }

    aktivitas.push({ kader: kader[k.id] ?? k, rw: wilayah, tambah, keluargaDiisi })
  }

  // Agregasi IKS RW: 0.5 × rata IKS keluarga ber-data + 0.5 × baseline jarak
  // (jitter ±0.05) — hanya bila sudah ada KK tersurvei; selain itu 0 (abu-abu).
  for (const wilayah of rw) {
    if (wilayah.kkTersurvei <= 0) {
      wilayah.iks = 0
      continue
    }
    const baseline = clamp01(BASELINE_JARAK[wilayah.jarak] + (rng.float() * 0.1 - 0.05))
    const nilaiKeluarga: number[] = []
    for (const id of idKeluargaUrut) {
      if (pack.keluarga[id]?.rw !== wilayah.nomor) continue
      const st = keluarga[id]
      if (!st) continue
      const iks = hitungIksKeluarga(st)
      if (iks !== null) nilaiKeluarga.push(iks)
    }
    const rata =
      nilaiKeluarga.length > 0
        ? nilaiKeluarga.reduce((jumlah, x) => jumlah + x, 0) / nilaiKeluarga.length
        : baseline
    // Bonus program M2 (posyandu/KLB/program wilayah) menaikkan IKS RW secara
    // persisten — kegiatan lapangan terbayar di indikator, bukan angka hantu.
    wilayah.iks = clamp01(0.5 * rata + 0.5 * baseline + wilayah.bonusIks)
  }

  // Maksimal SATU surat laporan kader per hari.
  const surat: Surat[] = []
  const kandidat = aktivitas.filter((a) => a.tambah > 0 || a.keluargaDiisi.length > 0)
  if (kandidat.length > 0) {
    const a = rng.pick(kandidat)
    surat.push(buatSuratKader(a, pack, hari, rng))
  }

  return { keluarga, rw, kader, surat }
}

/** Menyusun surat laporan bergaya kader — id deterministik per hari+kader. */
function buatSuratKader(a: AktivitasKader, pack: ContentPack, hari: number, rng: Rng): Surat {
  const profil = pack.kader.find((p) => p.id === a.kader.id)
  const bagian: string[] = [rng.pick(SALAM_PEMBUKA)]

  if (a.tambah > 0) {
    bagian.push(
      `Hari ini saya keliling ${a.tambah} rumah di ${a.rw.nama}. Total sudah ${a.rw.kkTersurvei} dari ${a.rw.totalKk} KK yang tercatat di buku saya.`,
    )
  } else {
    bagian.push(
      `Semua KK di ${a.rw.nama} sudah masuk buku saya; hari ini saya menengok ulang beberapa rumah yang kemarin kosong.`,
    )
  }

  if (a.keluargaDiisi.length > 0) {
    const nama = a.keluargaDiisi.map((x) => x.nama).join(' dan ')
    bagian.push(`Saya sempat mampir agak lama ke ${nama} — formulir 12 indikatornya sudah saya isi dan saya titip di meja Dokter.`)
  }

  // Petunjuk halus: kader kadang "kelepasan" soal indikator biasnya —
  // hasil yang terlalu mulus untuk dipercaya.
  const biasPertama = a.kader.bias[0]
  if (biasPertama && rng.chance(0.4)) {
    bagian.push(
      `Oh iya, soal ${LABEL_INDIKATOR[biasPertama]}, semua rumah yang saya datangi beres semua, Dok. Tidak sempat saya tanya satu-satu, tapi kelihatannya aman — tidak usah dicek ulang rasanya.`,
    )
  }

  if (profil?.persona && rng.chance(0.3)) {
    bagian.push(`(Catatan kecil: orang bilang saya ini ${profil.persona.toLowerCase().replace(/\.$/, '')} — ah, biasa saja kok, Dok.)`)
  }

  bagian.push(rng.pick(KALIMAT_PENUTUP))

  const kaitId = a.keluargaDiisi[0]?.id
  return {
    id: `surat_kader_${hari}_${a.kader.id}`,
    hari,
    jenis: 'laporan_kader',
    dari: `${a.kader.nama} — kader ${a.rw.nama}`,
    judul: `Laporan keliling ${a.rw.nama}`,
    isi: bagian.join(' '),
    dibaca: false,
    ...(kaitId ? { kaitKeluargaId: kaitId } : {}),
  }
}
