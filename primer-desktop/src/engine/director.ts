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
import { clusterAktif } from './surveilans'

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
    rw: rng.int(1, 8),
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

function bobotKasus(k: KasusKlinis, state: GameState, berkluster: ReadonlySet<string>): number {
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

  // Surveilans balik (M1.2): kluster aktif menyalakan penularan — kasus yang
  // sedang berkluster lebih sering datang ke poli sampai wilayahnya dibereskan.
  if (berkluster.has(k.id)) bobot *= 2.5

  // Epidemiologi FKTP nyata (guardrail KONTEN_BALANCE #1): top-diagnosis dominan.
  const prevalensi = k.prevalensi ?? 'sedang'
  bobot *= prevalensi === 'tinggi' ? 3 : prevalensi === 'rendah' ? 0.6 : 1.5

  return bobot
}

/**
 * Susun antrian pasien playable pagi ini.
 * Hari 1-2: 2 pasien; hari 3+: 3 pasien. Tanpa duplikat kasus dalam satu hari.
 * Minggu 1: 92% pilihan dari pool 4A aman. Dijamin ≥1 kasus belum-pernah bila
 * masih ada yang tersedia (jaminan cakupan kurikulum).
 *
 * M4.5 (docs/M45_MODE_UJIAN.md): `rng` = seed KURIKULUM (memilih KASUS apa),
 * `rngFlavor` = seed per-mahasiswa (mewujudkan WAJAH pasien: nama/usia/persona/
 * BPJS + roll keluarga akrab). Default rngFlavor = rng → perilaku lama utuh.
 */
export function susunAntrianHarian(
  state: GameState,
  pack: ContentPack,
  rng: Rng,
  kecuali: string[] = [],
  rngFlavor: Rng = rng,
): PasienAktif[] {
  const jumlah = state.hari <= 2 ? 2 : 3
  // Kasus pasien-kembali/karma hari ini dikeluarkan dari kandidat —
  // janji "tanpa duplikat kasus dalam satu hari" berlaku untuk SELURUH antrian.
  const semua = Object.values(pack.kasus).filter((k) => !kecuali.includes(k.id))
  if (semua.length === 0) return []

  const mingguPertama = state.hari <= 7
  const poolAman = semua.filter(kasusAman)
  const terpilih: KasusKlinis[] = []
  const berkluster = new Set(clusterAktif(state).map((c) => c.kasusId))

  const pilihDari = (pool: KasusKlinis[]): KasusKlinis | undefined => {
    const kandidat = pool.filter((k) => !terpilih.some((t) => t.id === k.id))
    if (kandidat.length === 0) return undefined
    return rng.weighted(kandidat.map((k) => ({ item: k, bobot: bobotKasus(k, state, berkluster) })))
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

  // Curriculum Director (M3.18, DeepThink Q3): kasus 4A (kompetensi wajib inti)
  // yang belum pernah tertangani HARUS diprioritaskan masuk antrian — bahkan
  // bila hari ini "kebetulan" sudah membawa kasus NON-4A lain yang juga belum
  // pernah (guardrail prevalensi tak boleh menunda kasus wajib selamanya hanya
  // karena kasus lain yang lebih sering muncul kebetulan terpilih lebih dulu).
  // Dipilih UNIFORM (bukan tertimbang prevalensi) khusus untuk slot ini — pity-
  // timer harus melawan bobot prevalensi, bukan tunduk padanya.
  const ada4ABelumPernah = terpilih.some((k) => k.skdi === '4A' && state.dex[k.id] === undefined)
  if (!ada4ABelumPernah && terpilih.length > 0) {
    const belumPernah4A = semua.filter(
      (k) => k.skdi === '4A' && state.dex[k.id] === undefined && !terpilih.some((t) => t.id === k.id),
    )
    // Minggu pertama tetap mengutamakan kasus aman bila ada di pool belum-pernah.
    const belumPernah4AAman = mingguPertama ? belumPernah4A.filter(kasusAman) : belumPernah4A
    const sumber4A = belumPernah4AAman.length > 0 ? belumPernah4AAman : belumPernah4A
    if (sumber4A.length > 0) {
      terpilih[terpilih.length - 1] = rng.pick(sumber4A)
    } else {
      // Tak ada 4A belum-pernah tersisa — jaminan cakupan lama tetap berlaku
      // untuk kasus non-4A (mis. rujukan 3A/3B) supaya library itu pun tersentuh.
      const adaBaru = terpilih.some((k) => state.dex[k.id] === undefined)
      if (!adaBaru) {
        const belumPernah = semua.filter(
          (k) => state.dex[k.id] === undefined && !terpilih.some((t) => t.id === k.id),
        )
        if (belumPernah.length > 0) {
          const pengganti = rng.weighted(belumPernah.map((k) => ({ item: k, bobot: bobotKasus(k, state, berkluster) })))
          terpilih[terpilih.length - 1] = pengganti
        }
      }
    }
  }

  // Cap paparan rujukan (guardrail KONTEN_BALANCE #2): maksimal 1 kasus
  // wajib-rujuk per pagi — RRNS sehat ≤5%, library rujukan besar boleh tapi
  // EXPOSURE dikendalikan agar game tidak melatih over-refer lewat frekuensi.
  const rujukTerpilih = terpilih.filter((k) => k.harusDirujuk)
  if (rujukTerpilih.length > 1) {
    const nonRujuk = semua.filter(
      (k) => !k.harusDirujuk && !terpilih.some((t) => t.id === k.id),
    )
    for (let i = terpilih.length - 1; i >= 0 && rujukTerpilih.length > 1; i--) {
      const k = terpilih[i]
      if (!k?.harusDirujuk) continue
      const pengganti =
        nonRujuk.length > 0
          ? rng.weighted(nonRujuk.map((c) => ({ item: c, bobot: bobotKasus(c, state, berkluster) })))
          : undefined
      if (pengganti) {
        terpilih[i] = pengganti
        nonRujuk.splice(nonRujuk.indexOf(pengganti), 1)
        rujukTerpilih.pop()
      }
    }
  }

  const antrian = terpilih.map((k) => buatPasienDariKasus(k.id, pack, rngFlavor))

  // Karma loop arah POSITIF: keluarga binaan yang pernah dikunjungi sesekali
  // mengirim anggotanya ke poli — mereka mengenalmu, lebih terbuka (bonusTrust:
  // riwayat/SDOH sudah dikenal dokter). Pembinaan TERASA di klinik.
  const binaanAkrab = state.desa.binaan.filter((id) => {
    const kel = state.desa.keluarga[id]
    return kel !== undefined && kel.jumlahKunjungan > 0 && kel.trust >= 5
  })
  if (binaanAkrab.length > 0 && antrian.length > 0 && rngFlavor.chance(0.35)) {
    const keluargaId = rngFlavor.pick(binaanAkrab)
    const idx = rngFlavor.int(0, antrian.length - 1)
    const pasien = antrian[idx]
    if (pasien) antrian[idx] = { ...pasien, keluargaId, bonusTrust: true }
  }

  return antrian
}
