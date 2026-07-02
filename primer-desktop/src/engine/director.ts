/**
 * DIRECTOR — kurator antrian pagi (GDD §7).
 * Memilih pasien playable dari seluruh kasus pack dengan tiga tekanan:
 *  1. Kurikulum: minggu pertama 92% kasus kompetensi 4A yang aman (tak dirujuk).
 *  2. Leitner: kasus yang belum pernah / lemah di Dex diberi bobot lebih besar;
 *     kasus yang sudah dikuasai (★3) jarang dikirim ulang.
 *  3. Musim epidemiologis: hujan menaikkan infeksi/pencernaan, kemarau
 *     menaikkan respirasi/kulit.
 * Deterministik penuh: keacakan hanya dari Rng ber-seed.
 */

import type { GameState, PasienAktif } from './state'
import { musimDariHari } from './state'
import type { ContentPack } from '@content/pack'
import type { KasusKlinis, Persona } from '@content/types'
import type { Rng } from './core/rng'

// Re-export skor untuk UI: layar Rapor/MejaKerja mengimpor dari '@engine/director'.
export { hitungSkor, ringkasanHarian } from './scoring'

/* ---------------------------------------------------------------------------
 * Generator pasien
 * ------------------------------------------------------------------------- */

function pilihPersona(usia: number, rng: Rng): Persona {
  if (usia >= 60) return 'lansia'
  if (usia < 15) return 'wali_anak'
  return rng.weighted<Persona>([
    { item: 'polos', bobot: 40 },
    { item: 'terpelajar', bobot: 20 },
    { item: 'skeptis', bobot: 20 },
    { item: 'cemas', bobot: 20 },
  ])
}

/**
 * Wujudkan satu pasien dari kasus: nama sesuai jenis kelamin, usia dalam rentang
 * demografi, persona berbobot (lansia/wali anak dipaksa usia), BPJS 70%,
 * alergiTrap 60% membawa alergi golongan tersebut. `override` untuk pasien
 * follow-up/karma (reducer yang mengisi).
 */
export function buatPasienDariKasus(
  kasusId: string,
  pack: ContentPack,
  rng: Rng,
  override?: Partial<PasienAktif>,
): PasienAktif {
  const kasus = pack.kasus[kasusId]
  if (!kasus) {
    throw new Error(`buatPasienDariKasus: kasus '${kasusId}' tidak ada di ContentPack`)
  }

  const jenisKelamin = kasus.demografi.jenisKelamin ?? (rng.chance(0.5) ? 'L' : 'P')
  const daftarNama = jenisKelamin === 'L' ? pack.namaWarga.pria : pack.namaWarga.wanita
  const nama = daftarNama.length > 0 ? rng.pick(daftarNama) : 'Warga Sukamaju'
  const usia = rng.int(kasus.demografi.usiaMin, kasus.demografi.usiaMax)
  const persona = pilihPersona(usia, rng)
  // Kasus ber-alergiTrap SELALU membawa alerginya: dialog anamnesisnya menceritakan
  // riwayat alergi itu, dan jebakannya justru inti pelajaran kasus tersebut.
  const alergi = kasus.alergiTrap ? [kasus.alergiTrap.kelas] : []

  const dasar: PasienAktif = {
    id: `p_${kasusId}_${rng.int(1000, 9999)}`,
    nama,
    usia,
    jenisKelamin,
    persona,
    kasusId,
    bpjs: rng.chance(0.7),
    alergi,
    bonusTrust: false,
  }
  return { ...dasar, ...override }
}

/* ---------------------------------------------------------------------------
 * Kurasi antrian harian
 * ------------------------------------------------------------------------- */

const BIAS_4A_MINGGU_1 = 0.92

function kasusAman(k: KasusKlinis): boolean {
  return k.skdi === '4A' && !k.harusDirujuk
}

function bobotKasus(k: KasusKlinis, state: GameState): number {
  // Leitner-lite dari Dex: belum pernah ×3; lemah (★0-1) ×2; dikuasai (★3) ×0.5.
  const entri = state.dex[k.id]
  let bobot: number
  if (entri === undefined) bobot = 3
  else if (entri.bintang <= 1) bobot = 2
  else if (entri.bintang >= 3) bobot = 0.5
  else bobot = 1

  // Musim epidemiologis.
  const musim = musimDariHari(state.hari)
  if (musim === 'hujan' && (k.kategori === 'infeksi' || k.kategori === 'pencernaan')) bobot *= 2
  if (musim === 'kemarau' && (k.kategori === 'respirasi' || k.kategori === 'kulit')) bobot *= 1.5

  return bobot
}

/**
 * Susun antrian pasien playable pagi ini.
 * Hari 1-2: 2 pasien; hari 3+: 3 pasien. Tanpa duplikat kasus dalam satu hari.
 * Minggu 1: 92% pilihan dari pool 4A aman. Dijamin ≥1 kasus belum-pernah bila
 * masih ada yang tersedia (jaminan cakupan kurikulum).
 */
export function susunAntrianHarian(
  state: GameState,
  pack: ContentPack,
  rng: Rng,
  kecuali: string[] = [],
): PasienAktif[] {
  const jumlah = state.hari <= 2 ? 2 : 3
  // Kasus pasien-kembali/karma hari ini dikeluarkan dari kandidat —
  // janji "tanpa duplikat kasus dalam satu hari" berlaku untuk SELURUH antrian.
  const semua = Object.values(pack.kasus).filter((k) => !kecuali.includes(k.id))
  if (semua.length === 0) return []

  const mingguPertama = state.hari <= 7
  const poolAman = semua.filter(kasusAman)
  const terpilih: KasusKlinis[] = []

  const pilihDari = (pool: KasusKlinis[]): KasusKlinis | undefined => {
    const kandidat = pool.filter((k) => !terpilih.some((t) => t.id === k.id))
    if (kandidat.length === 0) return undefined
    return rng.weighted(kandidat.map((k) => ({ item: k, bobot: bobotKasus(k, state) })))
  }

  for (let i = 0; i < jumlah; i++) {
    let pilihan: KasusKlinis | undefined
    if (mingguPertama && poolAman.length > 0 && rng.chance(BIAS_4A_MINGGU_1)) {
      // Pool aman bisa habis (semua sudah terpilih hari ini) → jatuh ke pool penuh.
      pilihan = pilihDari(poolAman) ?? pilihDari(semua)
    } else {
      pilihan = pilihDari(semua)
    }
    if (!pilihan) break
    terpilih.push(pilihan)
  }

  // Jaminan kurikulum: minimal 1 kasus belum-pernah bila tersedia.
  const adaBaru = terpilih.some((k) => state.dex[k.id] === undefined)
  if (!adaBaru && terpilih.length > 0) {
    const belumPernah = semua.filter(
      (k) => state.dex[k.id] === undefined && !terpilih.some((t) => t.id === k.id),
    )
    // Minggu pertama tetap mengutamakan kasus aman bila ada di pool belum-pernah.
    const belumPernahAman = mingguPertama ? belumPernah.filter(kasusAman) : belumPernah
    const sumber = belumPernahAman.length > 0 ? belumPernahAman : belumPernah
    if (sumber.length > 0) {
      const pengganti = rng.weighted(sumber.map((k) => ({ item: k, bobot: bobotKasus(k, state) })))
      terpilih[terpilih.length - 1] = pengganti
    }
  }

  const antrian = terpilih.map((k) => buatPasienDariKasus(k.id, pack, rng))

  // Karma loop arah POSITIF: keluarga binaan yang pernah dikunjungi sesekali
  // mengirim anggotanya ke poli — mereka mengenalmu, lebih terbuka (bonusTrust:
  // riwayat/SDOH sudah dikenal dokter). Pembinaan TERASA di klinik.
  const binaanAkrab = state.desa.binaan.filter((id) => {
    const kel = state.desa.keluarga[id]
    return kel !== undefined && kel.jumlahKunjungan > 0 && kel.trust >= 5
  })
  if (binaanAkrab.length > 0 && antrian.length > 0 && rng.chance(0.35)) {
    const keluargaId = rng.pick(binaanAkrab)
    const idx = rng.int(0, antrian.length - 1)
    const pasien = antrian[idx]
    if (pasien) antrian[idx] = { ...pasien, keluargaId, bonusTrust: true }
  }

  return antrian
}
