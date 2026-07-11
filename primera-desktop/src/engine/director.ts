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

import type { GameState, ModeStase, PasienAktif } from './state'
import { musimDariHari } from './state'
import type { ContentPack } from '@content/pack'
import type { KasusKlinis, Persona } from '@content/types'
import type { Rng } from './core/rng'
import { clusterAktif } from './surveilans'
import { HARI_STASE } from './paketUjian'

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
 * demografi, persona berbobot (lansia/wali anak dipaksa usia), BPJS 70%.
 * Kasus ber-`alergiTrap` SELALU membawa alergi golongan tsb (bukan probabilistik) —
 * jebakannya adalah inti pelajaran kasus, dan anamnesisnya menceritakan riwayat itu.
 * `override` untuk pasien follow-up/karma (reducer yang mengisi).
 */
export function buatPasienDariKasus(
  kasusId: string,
  pack: ContentPack,
  rng: Rng,
  override?: Partial<PasienAktif>,
  // Fix #28b (audit CODEX 2026-07-11): tanpa parameter ini, dua pasien di
  // antrian HARI YANG SAMA bisa kebetulan dapat nama sama (mis. dua "Narti")
  // — daftar namaWarga tak sebesar itu & tak ada guard anti-tabrakan sesama
  // pasien (guard yg ADA hanya cegah bentrok dgn nama anggota keluarga
  // binaan, beda scope). Opsional agar backward-compatible (pemanggil follow-
  // up/karma/prolanis satu-pasien tak perlu peduli).
  namaTerpakai?: Set<string>,
): PasienAktif {
  const kasus = pack.kasus[kasusId]
  if (!kasus) {
    throw new Error(`buatPasienDariKasus: kasus '${kasusId}' tidak ada di ContentPack`)
  }

  const jenisKelamin = kasus.demografi.jenisKelamin ?? (rng.chance(0.5) ? 'L' : 'P')
  const daftarNama = jenisKelamin === 'L' ? pack.namaWarga.pria : pack.namaWarga.wanita
  let nama = daftarNama.length > 0 ? rng.pick(daftarNama) : 'Warga Sukamaju'
  if (namaTerpakai && daftarNama.length > namaTerpakai.size) {
    let percobaan = 0
    while (namaTerpakai.has(nama) && percobaan < 20) {
      nama = rng.pick(daftarNama)
      percobaan++
    }
  }
  namaTerpakai?.add(nama)
  const usia = rng.int(kasus.demografi.usiaMin, kasus.demografi.usiaMax)
  // M10.b (dossier §43): persona WAJIB dari usia EFEKTIF — pasien inject
  // (karma/prolanis/PRB) membawa usia sungguhan via override, tapi dulu
  // persona dihitung dari roll demografi yang lantas DIBUANG merge override:
  // Mbah Lastri 71 th bisa bicara dgn suara 'polos' dewasa (atau sebaliknya).
  // override.persona (bila ada, mis. pasien kembali) tetap menang saat merge.
  const persona = pilihPersona(override?.usia ?? usia, rng)
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

/* ---------------------------------------------------------------------------
 * KURVA 90 HARI (M5.22) — pacing per fase, PROPORSIONAL terhadap durasi mode
 * (utang M4.5: mode Ujian 30 hari memakai kurva yang sama, dipadatkan 3×).
 * Fase awal (≤1/3 durasi) = breathing; fase akhir (>2/3) = tekanan penuh.
 * ------------------------------------------------------------------------- */

/** Fase stase 0..1 — fraksi durasi mode yang sudah dijalani. */
export function faseStase(hari: number, mode: ModeStase): number {
  return hari / HARI_STASE[mode]
}

/**
 * Jumlah pasien playable pagi ini. Hari 1-2 selalu 2 (onboarding);
 * fase akhir naik ke 4 — poli penuh adalah ujian stamina yang sebenarnya.
 */
export function jumlahPasienHarian(hari: number, mode: ModeStase): number {
  if (hari <= 2) return 2
  return faseStase(hari, mode) > 2 / 3 ? 4 : 3
}

/**
 * Peluang interrupt IGD per pagi (dipakai reducer): breathing 0.12 →
 * tengah 0.15 → tekanan penuh 0.20.
 */
export function peluangIgd(hari: number, mode: ModeStase): number {
  const f = faseStase(hari, mode)
  return f > 2 / 3 ? 0.2 : f > 1 / 3 ? 0.15 : 0.12
}

function bobotKasus(
  k: KasusKlinis,
  state: GameState,
  berkluster: ReadonlySet<string>,
  kategoriTersentuh?: ReadonlySet<string>,
): number {
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

  // Jaminan cakupan kategori (M5.22): kategori SKDI yang belum pernah disentuh
  // sama sekali diberi dorongan — kurikulum harus melebar, bukan cuma mendalam.
  if (kategoriTersentuh && !kategoriTersentuh.has(k.kategori)) bobot *= 1.5

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
  // Kurva pacing M5.22: 2 pasien saat onboarding → 3 → 4 di fase tekanan penuh.
  const jumlah = jumlahPasienHarian(state.hari, state.mode)
  // Kasus pasien-kembali/karma hari ini dikeluarkan dari kandidat —
  // janji "tanpa duplikat kasus dalam satu hari" berlaku untuk SELURUH antrian.
  // M10 Batch-2 (CODEX P1.4): SORT by id — Object.values mengikuti urutan
  // insersi key perakitan pack; refactor tak-berbahaya (menyusun ulang file
  // kasus) dulu bisa mengubah hasil rng.weighted TANPA mengubah sidik jari
  // (yang menyortir). Kandidat kini deterministik thd ISI pack, bukan bentuknya.
  const semua = Object.values(pack.kasus)
    .filter((k) => !kecuali.includes(k.id))
    .sort((a, b) => a.id.localeCompare(b.id))
  if (semua.length === 0) return []

  const mingguPertama = state.hari <= 7
  const poolAman = semua.filter(kasusAman)
  const terpilih: KasusKlinis[] = []
  const berkluster = new Set(clusterAktif(state).map((c) => c.kasusId))
  // Cakupan kategori (M5.22): kategori yang sudah punya ≥1 entri Dex dianggap
  // tersentuh; sisanya didorong bobotnya supaya kurikulum melebar.
  const kategoriTersentuh = new Set<string>()
  for (const id of Object.keys(state.dex)) {
    const kat = pack.kasus[id]?.kategori
    if (kat) kategoriTersentuh.add(kat)
  }

  const pilihDari = (pool: KasusKlinis[]): KasusKlinis | undefined => {
    const kandidat = pool.filter((k) => !terpilih.some((t) => t.id === k.id))
    if (kandidat.length === 0) return undefined
    return rng.weighted(
      kandidat.map((k) => ({ item: k, bobot: bobotKasus(k, state, berkluster, kategoriTersentuh) })),
    )
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
          const pengganti = rng.weighted(belumPernah.map((k) => ({ item: k, bobot: bobotKasus(k, state, berkluster, kategoriTersentuh) })))
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
          ? rng.weighted(nonRujuk.map((c) => ({ item: c, bobot: bobotKasus(c, state, berkluster, kategoriTersentuh) })))
          : undefined
      if (pengganti) {
        terpilih[i] = pengganti
        nonRujuk.splice(nonRujuk.indexOf(pengganti), 1)
        rujukTerpilih.pop()
      }
    }
  }

  // Fix #28b: satu Set dipakai bersama utk seluruh antrian hari ini, supaya
  // dua pasien (mis. dua kasus berbeda dgn jenis kelamin sama) tak kebetulan
  // dapat nama sama persis.
  const namaTerpakaiHariIni = new Set<string>()
  const antrian = terpilih.map((k) => buatPasienDariKasus(k.id, pack, rngFlavor, undefined, namaTerpakaiHariIni))

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
    const kontenKeluarga = pack.keluarga[keluargaId]
    // Fix #14 (adjudikasi DeepThink 2026-07-11, ronde CODEX-31, opsi O-B
    // best-effort): RW selalu ditimpa RW keluarga asli. Nama/usia/jenisKelamin
    // HANYA ditimpa dari anggota keluarga sungguhan bila ada yg usianya cocok
    // rentang demografi kasus yg SUDAH terpilih (kurikulum/epidemiologi tetap
    // penentu pemilihan kasus — hanya identitas pasien yg disesuaikan
    // sesudahnya). Tak ada yg cocok → tetap fallback ke roll acak lama.
    const kasus = pasien ? pack.kasus[pasien.kasusId] : undefined
    // Fix #4 (audit CODEX 2026-07-11): pencocokan usia SAJA tak cukup — kasus
    // ber-demografi.jenisKelamin tetap (mis. bumil, HANYA 'P') bisa ditimpa
    // jadi anggota keluarga laki-laki yg kebetulan usianya cocok. Fallback
    // "tak ada yg cocok → tetap roll lama" sudah ada, jadi menambah syarat
    // gender di sini tak menimbulkan regresi — cuma lebih sering fallback.
    const anggotaCocok = kasus
      ? kontenKeluarga?.anggota.find(
          (a) =>
            a.usia >= kasus.demografi.usiaMin &&
            a.usia <= kasus.demografi.usiaMax &&
            (!kasus.demografi.jenisKelamin || a.jenisKelamin === kasus.demografi.jenisKelamin),
        )
      : undefined
    if (pasien && kontenKeluarga) {
      antrian[idx] = {
        ...pasien,
        keluargaId,
        bonusTrust: true,
        rw: kontenKeluarga.rw,
        ...(anggotaCocok
          ? { nama: anggotaCocok.nama, usia: anggotaCocok.usia, jenisKelamin: anggotaCocok.jenisKelamin }
          : {}),
      }
    }
  }

  return antrian
}
