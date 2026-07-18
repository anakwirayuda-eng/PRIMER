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
import { encounterArchetypeAktif, type ContentPack } from '@content/pack'
import type { KasusKlinis, Persona } from '@content/types'
import type { Rng } from './core/rng'
import { clusterAktif } from './surveilans'
import { HARI_STASE, paketUjianDariId } from './paketUjian'
import { examClinicCaseIdsForDay } from './examBlueprint'

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
  const usiaBulan =
    kasus.demografi.usiaBulanMin !== undefined && kasus.demografi.usiaBulanMax !== undefined
      ? rng.int(kasus.demografi.usiaBulanMin, kasus.demografi.usiaBulanMax)
      : undefined
  // M10.b (dossier §43): persona WAJIB dari usia EFEKTIF — pasien inject
  // (karma/prolanis/PRB) membawa usia sungguhan via override, tapi dulu
  // persona dihitung dari roll demografi yang lantas DIBUANG merge override:
  // Mbah Lastri 71 th bisa bicara dgn suara 'polos' dewasa (atau sebaliknya).
  // override.persona (bila ada, mis. pasien kembali) tetap menang saat merge.
  const persona = pilihPersona(override?.usia ?? usia, rng)
  // Kasus ber-alergiTrap SELALU membawa alerginya: dialog anamnesisnya menceritakan
  // riwayat alergi itu, dan jebakannya justru inti pelajaran kasus tersebut.
  const alergi = kasus.alergiTrap ? [kasus.alergiTrap.kelas] : []
  // Tier-1 #7 (audit CODEX 2026-07-11): pola sama alergi di atas, tapi utk
  // faktor risiko interaksi obat (mis. pemakaian PDE5-inhibitor tersembunyi).
  const faktorRisiko = kasus.interaksiTrap ? [kasus.interaksiTrap.faktor] : []

  // M11 #4 Tingkat A (2026-07-16): undian varian kosmetik pakai RNG yang SAMA
  // dipakai nama/usia/persona/BPJS di atas — precedent sudah ada: "wajah
  // pasien" (hal yang tak mengubah jawaban benar) memang boleh berbeda bebas
  // antar-mahasiswa/antar-hari tanpa melanggar kontrak keadilan Mode Ujian
  // ("bobot kasus identik per paket") karena yang diatur kontrak itu adalah
  // KASUS mana yang muncul, bukan wajah kosmetiknya. `varianPresentasi`
  // secara struktural (lihat types.ts) tak pernah mengubah kunci jawaban,
  // jadi ia masuk kelas yang sama dengan persona, bukan kelas seleksi kasus.
  const varianId = kasus.varianPresentasi?.length
    ? rng.pick(['_dasar', ...kasus.varianPresentasi.map((v) => v.id)])
    : undefined

  const dasar: PasienAktif = {
    id: `p_${kasusId}_${rng.int(1000, 9999)}`,
    nama,
    usia,
    ...(usiaBulan !== undefined ? { usiaBulan } : {}),
    jenisKelamin,
    persona,
    kasusId,
    bpjs: rng.chance(0.7),
    alergi,
    faktorRisiko,
    rw: rng.int(1, 8),
    bonusTrust: false,
    ...(varianId !== undefined ? { varianId } : {}),
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
  //
  // CODEX audit pasca-GM (2026-07-13, temuan #10a): kluster (`clusterAktif`,
  // surveilans.ts) dihitung dari `state.desa.surveilans`, yang RW-nya diisi
  // dari stream FLAVOR (`rngFlavor`, pribadi per-mahasiswa — lihat komentar
  // `susunAntrianHarian` di atas) — bukan stream kurikulum. Di mode Ujian, ini
  // melanggar janji M45_MODE_UJIAN.md §3b ("bobot kasus identik per paket"):
  // dua mahasiswa di paket SAMA dengan keputusan klinis IDENTIK bisa dapat
  // antrian kasus BERBEDA murni krn RW pasien-pasien sebelumnya (flavor,
  // pribadi) kebetulan mengelompok beda, mengaktifkan kluster berbeda.
  // Direproduksi langsung: draw kurikulum identik, slot pertama berubah kasus
  // semata krn status kluster berbeda. Karier TIDAK punya kontrak "paket
  // identik" ini (tiap mahasiswa memang menjalani dunia sendiri), jadi bobot
  // kluster tetap aktif di sana — hanya digerbang OFF di Ujian. `clusterAktif`
  // sendiri TETAP dihitung & ditampilkan ke pemain (MejaKerja.tsx/PetaDesa.tsx)
  // di kedua mode — ini murni soal bobot pemilihan kasus, bukan visibilitas.
  if (state.mode !== 'ujian' && berkluster.has(k.id)) bobot *= 2.5

  // Epidemiologi FKTP nyata (guardrail KONTEN_BALANCE #1): top-diagnosis dominan.
  const prevalensi = k.prevalensi ?? 'sedang'
  bobot *= prevalensi === 'tinggi' ? 3 : prevalensi === 'rendah' ? 0.6 : 1.5

  // Jaminan cakupan kategori (M5.22): kategori SKDI yang belum pernah disentuh
  // sama sekali diberi dorongan — kurikulum harus melebar, bukan cuma mendalam.
  if (kategoriTersentuh && !kategoriTersentuh.has(k.kategori)) bobot *= 1.5

  return bobot
}

function wujudkanAntrian(
  terpilih: readonly KasusKlinis[],
  pack: ContentPack,
  rngFlavor: Rng,
): PasienAktif[] {
  const namaTerpakaiHariIni = new Set<string>()
  return terpilih.map((kasus) =>
    buatPasienDariKasus(kasus.id, pack, rngFlavor, undefined, namaTerpakaiHariIni),
  )
}

/**
 * Susun antrian pasien playable pagi ini.
 * Mode Ujian keluar lewat blueprint tetap; aturan bobot/pity di bawah hanya
 * berlaku untuk Karier. Controlled draw tidak memakai status keluarga binaan.
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
  kecuali: readonly string[] = [],
  rngFlavor: Rng = rng,
): PasienAktif[] {
  // Kurva pacing M5.22: 2 pasien saat onboarding → 3 → 4 di fase tekanan penuh.
  const jumlah = jumlahPasienHarian(state.hari, state.mode)
  if (state.mode === 'ujian') {
    const paket = paketUjianDariId(state.paketUjian)
    if (!paket) return []
    const terpilih = examClinicCaseIdsForDay(pack, paket, state.hari, kecuali)
      .slice(0, jumlah)
      .map((id) => pack.kasus[id])
      .filter((kasus): kasus is KasusKlinis => kasus !== undefined)
    // Controlled draw Ujian murni dari blueprint + flavor seed. Status binaan
    // tidak boleh mengubah demografi; konsekuensinya hadir sebagai supplemental.
    return wujudkanAntrian(terpilih, pack, rngFlavor)
  }
  // Kasus pasien-kembali/karma hari ini dikeluarkan dari kandidat —
  // janji "tanpa duplikat kasus dalam satu hari" berlaku untuk SELURUH antrian.
  // M10 Batch-2 (CODEX P1.4): SORT by id — Object.values mengikuti urutan
  // insersi key perakitan pack; refactor tak-berbahaya (menyusun ulang file
  // kasus) dulu bisa mengubah hasil rng.weighted TANPA mengubah sidik jari
  // (yang menyortir). Kandidat kini deterministik thd ISI pack, bukan bentuknya.
  const semua = Object.values(pack.kasus)
    .filter(
      (k) =>
        !kecuali.includes(k.id) &&
        encounterArchetypeAktif(pack, 'clinic', k.id, state.mode, state.contentRelease),
    )
    .sort((a, b) => a.id.localeCompare(b.id))
  if (semua.length === 0) return []

  const mingguPertama = state.hari <= 7
  const poolAman = semua.filter(kasusAman)
  const terpilih: KasusKlinis[] = []
  const berkluster = new Set(clusterAktif(state, pack).map((c) => c.kasusId))
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
  // Bridge B1.1: siapkan hanya pasangan keluarga-pasien yang benar-benar
  // punya anggota dengan demografi kompatibel. Versi lama memilih keluarga
  // dan pasien lebih dulu, lalu tetap menempelkan keluargaId saat tak ada
  // anggota cocok; itu menciptakan continuity fiktif.
  const kandidatJembatan = binaanAkrab.flatMap((keluargaId) => {
    const kontenKeluarga = pack.keluarga[keluargaId]
    if (!kontenKeluarga) return []
    const pasienCocok = antrian.flatMap((pasien, idx) => {
      const kasus = pack.kasus[pasien.kasusId]
      const anggota = kasus
        ? kontenKeluarga.anggota.find(
            (a) =>
              a.usia >= kasus.demografi.usiaMin &&
              a.usia <= kasus.demografi.usiaMax &&
              (!kasus.demografi.jenisKelamin || a.jenisKelamin === kasus.demografi.jenisKelamin),
          )
        : undefined
      return anggota ? [{ idx, anggota }] : []
    })
    return pasienCocok.length > 0 ? [{ keluargaId, kontenKeluarga, pasienCocok }] : []
  })

  if (kandidatJembatan.length > 0 && rngFlavor.chance(0.35)) {
    const kandidatKeluarga = rngFlavor.pick(kandidatJembatan)
    const { idx, anggota } = rngFlavor.pick(kandidatKeluarga.pasienCocok)
    const pasien = antrian[idx]!
    antrian[idx] = {
      ...pasien,
      // Model PIS-PK game menyimpan kepesertaan JKN pada tingkat keluarga.
      // Pasien yang kini beridentitas anggota nyata tak boleh mempertahankan
      // undian pembayar acak yang berkontradiksi dengan keluarga asalnya.
      bpjs: state.desa.keluarga[kandidatKeluarga.keluargaId]!.indikator.jkn.statusSebenarnya === 'ya',
      keluargaId: kandidatKeluarga.keluargaId,
      bonusTrust: true,
      rw: kandidatKeluarga.kontenKeluarga.rw,
      nama: anggota.nama,
      usia: anggota.usia,
      jenisKelamin: anggota.jenisKelamin,
      persona: pilihPersona(anggota.usia, rngFlavor),
    }
  }

  return antrian
}
