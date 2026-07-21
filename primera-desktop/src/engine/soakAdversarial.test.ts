/**
 * SOAK ADVERSARIAL (M10.5 capstone, docs/M10_5_FIDELITAS.md §7d/G2) — mainkan
 * stase PENUH (Karier 90 hari & Ujian 30 hari, konten produksi) dengan 3 profil
 * pemain berbeda kualitas, ukur distribusi grade A/B/C/D nyata. Ini kalibrasi
 * data SEBELUM Golden Master (bukan tebakan) menjawab: apakah pemain minimal-
 * effort (speedrunner) bisa lolos dgn nilai baik, dan apakah pemain ceroboh
 * benar-benar dihukum sesuai proporsinya.
 *
 * Beda dari `soak.test.ts` (defensif murni, anti-crash/NaN, tak peduli kualitas
 * keputusan) dan `selfplay.test.ts` (SATU profil "dokter rajin", 8 hari, gagal-
 * keras bila aksi ditolak). Driver di sini TOLERAN (seperti soak.test.ts) tapi
 * kualitas keputusannya di-parameter-kan per-profil, dijalankan penuh sepanjang
 * mode, dan MENCATAT (bukan cuma lulus/gagal) distribusi grade tiap profil.
 *
 * Cakupan: subuh IGD (ditangani optimal utk SEMUA profil — kompetensi gawat
 * darurat bukan fokus perbandingan ini) + poli klinik (parameter penuh per-
 * profil) + maksimal 1 kunjungan rumah/hari bila roster & stamina mengizinkan
 * (parameter kualitas MI per-profil). TIDAK mengunjungi Kegiatan/Posyandu/
 * Prolanis eksplisit — sama batasan cakupannya dgn `soak.test.ts`, dicatat
 * di sini juga supaya tak dikira representasi UKM penuh.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { hitungSkor } from './scoring'
import { KAPASITAS_EDUKASI } from './clinic'
import { HARI_STASE } from './paketUjian'
import { Rng } from './core/rng'
import { isGayaTerlarang } from '@content/types'
import { rumahSakitCocokUntukIgd } from './igd'
import type { Action } from './actions'
import type { GameEvent } from './events'
import type { GameState, ModeStase, PenilaianEncounter } from './state'

/* ---------------------------------------------------------------------------
 * Profil — parameter kualitas keputusan per-langkah
 * ------------------------------------------------------------------------- */

interface Profil {
  nama: string
  askFraction: number
  askDistraktor: boolean
  measureVitalProb: number
  examFraction: number
  diagnosisCorrectProb: number
  diagnosisTegakProb: number
  obatBenarFraction: number
  obatAlternatifProb: number
  tindakanFraction: number
  edukasiFraction: number
  disposisiCorrectProb: number
  kunjunganKualitas: 'teladan' | 'cepat' | 'acak'
}

const SPEEDRUNNER: Profil = {
  nama: 'speedrunner',
  askFraction: 0.2,
  askDistraktor: false,
  measureVitalProb: 0.3,
  examFraction: 0.3,
  diagnosisCorrectProb: 0.9,
  diagnosisTegakProb: 0.9,
  obatBenarFraction: 1,
  obatAlternatifProb: 1,
  tindakanFraction: 1,
  edukasiFraction: 0.1,
  disposisiCorrectProb: 1,
  kunjunganKualitas: 'cepat',
}

const TELITI: Profil = {
  nama: 'teliti',
  askFraction: 1,
  askDistraktor: false,
  measureVitalProb: 1,
  examFraction: 1,
  diagnosisCorrectProb: 1,
  diagnosisTegakProb: 1,
  obatBenarFraction: 1,
  obatAlternatifProb: 1,
  tindakanFraction: 1,
  edukasiFraction: 1,
  disposisiCorrectProb: 1,
  kunjunganKualitas: 'teladan',
}

const CEROBOH: Profil = {
  nama: 'ceroboh',
  askFraction: 0.4,
  askDistraktor: false,
  measureVitalProb: 0.6,
  examFraction: 0.5,
  diagnosisCorrectProb: 0.6,
  diagnosisTegakProb: 0.7,
  obatBenarFraction: 0.6,
  obatAlternatifProb: 0.5,
  tindakanFraction: 0.6,
  edukasiFraction: 0.3,
  disposisiCorrectProb: 0.7,
  kunjunganKualitas: 'acak',
}

/* ---------------------------------------------------------------------------
 * Driver toleran (pola soak.test.ts): tak melempar pada ERROR_AKSI, hanya
 * pada exception sungguhan (crash).
 * ------------------------------------------------------------------------- */

function cobaEv(state: GameState, action: Action): { state: GameState; events: GameEvent[] } {
  try {
    return advance(state, action, PACK)
  } catch (e) {
    throw new Error(`CRASH saat ${action.type} (hari ${state.hari}/${state.blok}): ${String(e)}`)
  }
}
function coba(state: GameState, action: Action): GameState {
  return cobaEv(state, action).state
}

function semuaAngkaFinite(obj: Record<string, unknown>, label: string): string[] {
  const cacat: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'number' && !Number.isFinite(v)) cacat.push(`${label}.${k}=${v}`)
  }
  return cacat
}

/** Subuh IGD ditangani OPTIMAL utk semua profil (di luar cakupan perbandingan). */
function beresIgd(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.igd && guard++ < 40) {
    const kasus = PACK.kasusIgd[s.igd.kasusId]
    if (!kasus) break
    if (s.igd.fase === 'langkah') {
      const langkah = kasus.langkah[s.igd.langkahIndex]
      if (!langkah) break
      const benar = langkah.pilihan.find((p) => p.benar) ?? langkah.pilihan[0]!
      s = coba(s, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: benar.id })
    } else if (s.igd.fase === 'kode_biru') {
      s = coba(s, { type: 'RJP_IGD', berkualitas: true })
    } else if (s.igd.fase === 'pasca_rosc') {
      s = coba(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
    } else if (s.igd.fase === 'disposisi') {
      const rumahSakit =
        kasus.disposisiBenar === 'rujuk'
          ? PACK.rumahSakit
              .filter((rs) => rumahSakitCocokUntukIgd(kasus, rs))
              .sort((a, b) => a.jarakMenit - b.jarakMenit || a.id.localeCompare(b.id))[0]
          : undefined
      s = coba(s, {
        type: 'DISPOSISI_IGD',
        jenis: kasus.disposisiBenar,
        ...(rumahSakit ? { rumahSakitId: rumahSakit.id } : {}),
      })
    } else break
  }
  return s
}

/** Satu pasien poli, kualitas keputusan dari `profil`. Mengembalikan penilaian bila selesai. */
function tanganiPasienProfil(
  state: GameState,
  profil: Profil,
  rng: Rng,
): { state: GameState; penilaian?: PenilaianEncounter } {
  let s = coba(state, { type: 'PANGGIL_PASIEN' })
  const enc = s.klinik.aktif
  if (!enc) return { state: s }
  const kasus = PACK.kasus[enc.pasien.kasusId]
  if (!kasus) {
    s = coba(s, { type: 'DISPOSISI', jenis: 'pulang' })
    return { state: s }
  }

  for (const q of kasus.anamnesis) {
    if (q.distraktor === true && !profil.askDistraktor) continue
    if (rng.chance(profil.askFraction)) s = coba(s, { type: 'TANYA', pertanyaanId: q.id })
  }
  s = coba(s, { type: 'LANJUT_FASE' })

  if (rng.chance(profil.measureVitalProb)) s = coba(s, { type: 'UKUR_VITAL' })
  for (const t of kasus.pemeriksaanFisik) {
    if (!t.relevan) continue
    if (rng.chance(profil.examFraction)) s = coba(s, { type: 'PERIKSA', region: t.region })
  }
  s = coba(s, { type: 'LANJUT_FASE' })

  const diagnosisBenar = rng.chance(profil.diagnosisCorrectProb) || kasus.diagnosisBanding.length === 0
  const icd10Dipakai = diagnosisBenar ? kasus.icd10 : rng.pick(kasus.diagnosisBanding)
  const jenis = rng.chance(profil.diagnosisTegakProb) ? 'tegak' : 'suspek'
  s = coba(s, { type: 'KOMIT_DIAGNOSIS', icd10: icd10Dipakai, jenis })

  // CODEX audit pasca-GM (2026-07-13, temuan #20): dulu meresepkan obatBenar
  // MENTAH tanpa cek alergiTrap/interaksiTrap pasien — persis bug yg sudah
  // diperbaiki di selfplay.test.ts "dokter rajin" (fix #1/#13B) tapi tak
  // ikut ditambal di sini. Firewall alergi kini punya konsekuensi skor nyata
  // (capGrade + UKP -1/kejadian), jadi profil TELITI/SPEEDRUNNER yg "benar
  // secara resep" tapi buta-alergi terjebak firewall berkali-kali sepanjang
  // stase penuh — cukup menjatuhkan UKP ke 0 (lantai clamp) meski >70% grade
  // per-encounter A, mencemari baseline kalibrasi Golden Master. Filter di
  // bawah persis logika trap-adjustment nilaiEncounter (clinic.ts).
  const trap = kasus.alergiTrap
  const kenaTrap =
    trap !== undefined && enc.pasien.alergi.some((a) => a.toLowerCase() === trap.kelas.toLowerCase())
  const interaksi = kasus.interaksiTrap
  const kenaInteraksi = interaksi !== undefined && enc.pasien.faktorRisiko.includes(interaksi.faktor)
  const terlarangGabungan = [
    ...(kenaTrap && trap ? trap.obatTerlarang : []),
    ...(kenaInteraksi && interaksi ? interaksi.obatTerlarang : []),
  ]
  const obatBenarAman = [
    ...kasus.tatalaksana.obatBenar.filter((id) => !terlarangGabungan.includes(id)),
    ...(kenaTrap && trap ? trap.alternatifBenar : []),
    ...(kenaInteraksi && interaksi ? interaksi.alternatifBenar : []),
  ]
  for (const obatId of obatBenarAman) {
    if (rng.chance(profil.obatBenarFraction)) s = coba(s, { type: 'TAMBAH_OBAT', obatId })
  }
  for (const grupMentah of kasus.tatalaksana.obatAlternatif ?? []) {
    const grup = grupMentah.filter((id) => !terlarangGabungan.includes(id))
    if (grup[0] && rng.chance(profil.obatAlternatifProb)) s = coba(s, { type: 'TAMBAH_OBAT', obatId: grup[0] })
  }
  for (const tindakanId of kasus.tatalaksana.prosedur ?? []) {
    if (rng.chance(profil.tindakanFraction)) {
      s = coba(s, { type: 'TAMBAH_TINDAKAN', tindakanId })
    }
  }
  for (const edukasiId of kasus.tatalaksana.edukasi.slice(0, KAPASITAS_EDUKASI)) {
    if (rng.chance(profil.edukasiFraction)) s = coba(s, { type: 'TAMBAH_EDUKASI', edukasiId })
  }
  s = coba(s, { type: 'LANJUT_FASE' })

  // PRB (rujuk-balik, M3.13): pasien SUDAH distabilkan RS — disposisi tepat
  // adalah pulang/observasi (kontrol lanjutan lokal), BUKAN kasus.harusDirujuk
  // (yang menilai kondisi klinis dasarnya, bukan status rujuk-balik pasien
  // ini). Merujuk-ulang PRB = rujukanNonSpesialistik (clinic.ts:642-644) —
  // tanpa cabang ini, driver salah menghukum diri sendiri lewat guillotine.
  const disposisiBenar = rng.chance(profil.disposisiCorrectProb)
  const jenisSeharusnya: 'rujuk' | 'pulang' =
    enc.pasien.prb === true ? 'pulang' : kasus.harusDirujuk ? 'rujuk' : 'pulang'
  const jenisDipakai = disposisiBenar ? jenisSeharusnya : (jenisSeharusnya === 'rujuk' ? 'pulang' : 'rujuk')
  const aksiDisposisi: Action =
    jenisDipakai === 'rujuk'
      ? {
          type: 'DISPOSISI',
          jenis: 'rujuk',
          sbar: {
            situation: `Pasien ${enc.pasien.nama}, ${enc.pasien.usia} th, keluhan: ${kasus.keluhanUtama}`,
            background: 'Anamnesis/vital/pemeriksaan terlampir (soak adversarial).',
            assessment: `${kasus.nama} (${kasus.icd10})`,
            recommendation: 'Rujuk fasilitas lanjutan.',
          },
        }
      : { type: 'DISPOSISI', jenis: 'pulang' }
  const hasil = cobaEv(s, aksiDisposisi)
  const selesai = hasil.events.find(
    (e): e is Extract<GameEvent, { type: 'ENCOUNTER_SELESAI' }> => e.type === 'ENCOUNTER_SELESAI',
  )
  return { state: hasil.state, penilaian: selesai?.penilaian }
}

/** Seluruh antrian pagi, kualitas per-`profil`. */
function beresPagiProfil(
  state: GameState,
  profil: Profil,
  rng: Rng,
): { state: GameState; penilaian: PenilaianEncounter[] } {
  let s = state
  const penilaian: PenilaianEncounter[] = []
  let guard = 0
  while (s.klinik.antrian.length > 0 && guard++ < 20) {
    const hasil = tanganiPasienProfil(s, profil, rng)
    s = hasil.state
    if (hasil.penilaian) penilaian.push(hasil.penilaian)
    if (s.klinik.aktif) break // encounter tak tuntas (aksi ditolak berulang) — cegah infinite loop
  }
  return { state: s, penilaian }
}

/** Maksimal 1 kunjungan rumah siang ini, kualitas MI per-`profil`. Toleran total. */
function cobaKunjunganProfil(state: GameState, profil: Profil, rng: Rng): GameState {
  if (state.blok !== 'siang' || state.stamina <= 0) return state
  const kandidat = Object.entries(state.desa.keluarga)
    .filter(([, k]) => k.arcSelesai === undefined)
    .sort(([a], [b]) => (state.desa.binaan.includes(a) === state.desa.binaan.includes(b) ? 0 : state.desa.binaan.includes(a) ? -1 : 1))
  const target = kandidat[0]?.[0]
  if (!target) return state
  const kelContent = PACK.keluarga[target]
  const kelAwal = state.desa.keluarga[target]
  if (!kelContent || !kelAwal) return state
  const skenario = kelContent.arc.kunjungan[kelAwal.arcIndex]
  if (!skenario) return state

  let s = state.desa.binaan.includes(target) ? state : coba(state, { type: 'PILIH_BINAAN', keluargaId: target })
  s = coba(s, { type: 'MULAI_KUNJUNGAN', keluargaId: target })
  if (s.kunjungan?.fase === 'penerimaan' && skenario.penerimaanAwal) {
    const pilihan = profil.kunjunganKualitas === 'teladan'
      ? skenario.penerimaanAwal.pilihan.find((p) => p.tindakan === 'hormati')
      : profil.kunjunganKualitas === 'cepat'
        ? skenario.penerimaanAwal.pilihan.find((p) => p.tindakan === 'memaksa')
        : rng.pick(skenario.penerimaanAwal.pilihan)
    return pilihan ? coba(s, { type: 'RESPONS_PENERIMAAN', pilihanId: pilihan.id }) : s
  }
  if (!s.kunjungan || s.kunjungan.fase !== 'observasi') return state // ditolak (stamina/roster) — lewati hari ini

  if (profil.kunjunganKualitas === 'teladan') {
    for (const h of skenario.hotspot) s = coba(s, { type: 'KLIK_HOTSPOT', hotspotId: h.id })
  } else if (profil.kunjunganKualitas === 'acak') {
    for (const h of skenario.hotspot) if (rng.chance(0.5)) s = coba(s, { type: 'KLIK_HOTSPOT', hotspotId: h.id })
  } // 'cepat': skip semua hotspot
  s = coba(s, { type: 'LANJUT_BABAK' })
  if (!s.kunjungan || s.kunjungan.fase !== 'wawancara') return s

  for (const node of skenario.dialog) {
    const hotspotDitemukan = s.kunjungan?.hotspotDitemukan ?? []
    const pilihanTersedia = node.pilihan.filter(
      (item) => item.butuhHotspot?.every((id) => hotspotDitemukan.includes(id)) ?? true,
    )
    const pilihan =
      profil.kunjunganKualitas === 'teladan'
        ? pilihanTersedia.find((p) => p.tepat && !isGayaTerlarang(p.gaya)) ?? pilihanTersedia[0]!
        : profil.kunjunganKualitas === 'cepat'
          ? pilihanTersedia[0]!
          : rng.pick(pilihanTersedia)
    s = coba(s, { type: 'PILIH_DIALOG', pilihanId: pilihan.id })
  }
  s = coba(s, { type: 'LANJUT_BABAK' })
  if (!s.kunjungan || s.kunjungan.fase !== 'diagnosis_perilaku') return s

  const hipotesis: 'kapabilitas' | 'kesempatan' | 'motivasi' =
    profil.kunjunganKualitas === 'teladan'
      ? skenario.hambatanSebenarnya
      : profil.kunjunganKualitas === 'cepat'
        ? skenario.hambatanSebenarnya // speedrunner masih tebak benar (cepat ≠ ceroboh)
        : rng.pick(['kapabilitas', 'kesempatan', 'motivasi'] as const)
  s = coba(s, { type: 'KOMIT_HAMBATAN', hipotesis })
  if (!s.kunjungan || s.kunjungan.fase !== 'resep_sosial') return s

  const cocok = skenario.intervensi.filter((i) => i.cocokUntuk.includes(hipotesis))
  const kartu =
    profil.kunjunganKualitas === 'acak'
      ? rng.pick(skenario.intervensi)
      : (cocok[0] ?? skenario.intervensi[0])
  if (!kartu) return s
  s = coba(s, { type: 'PILIH_INTERVENSI', intervensiId: kartu.id })
  if (s.kunjungan?.fase === 'ingatkan' && skenario.pilihanIngatkan) {
    const pilihan = profil.kunjunganKualitas === 'teladan'
      ? skenario.pilihanIngatkan.pilihan.find((p) => p.tepat)
      : profil.kunjunganKualitas === 'cepat'
        ? skenario.pilihanIngatkan.pilihan[0]
        : rng.pick(skenario.pilihanIngatkan.pilihan)
    if (pilihan) s = coba(s, { type: 'PILIH_INGATKAN', pilihanId: pilihan.id })
  }
  return s
}

interface HasilStase {
  akhir: GameState
  penilaian: PenilaianEncounter[]
  cacat: string[]
}

function jalankanStaseProfil(mode: ModeStase, seed: number, profil: Profil): HasilStase {
  let s = buildInitialState(`Soak-${profil.nama}`, seed, PACK, { mode })
  const rng = new Rng(seed, `adversarial-${profil.nama}`)
  const penilaian: PenilaianEncounter[] = []
  const cacat: string[] = []
  const batasHari = HARI_STASE[mode] + 3
  let guard = 0

  while (!s.tamat && s.hari <= batasHari && guard++ < 400) {
    s = beresIgd(s)
    const pagi = beresPagiProfil(s, profil, rng)
    s = pagi.state
    penilaian.push(...pagi.penilaian)
    s = coba(s, { type: 'LANJUTKAN' }) // pagi → siang
    s = cobaKunjunganProfil(s, profil, rng)
    s = coba(s, { type: 'LANJUTKAN' }) // siang → sore
    s = coba(s, { type: 'LANJUTKAN' }) // sore → tidur → hari baru

    cacat.push(...semuaAngkaFinite(s.tally as unknown as Record<string, unknown>, `H${s.hari}.tally`))
    const skor = hitungSkor(s)
    cacat.push(...semuaAngkaFinite(skor as unknown as Record<string, unknown>, `H${s.hari}.skor`))
  }
  return { akhir: s, penilaian, cacat }
}

function distribusiGrade(penilaian: PenilaianEncounter[]): Record<string, number> {
  const dist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const p of penilaian) dist[p.grade] = (dist[p.grade] ?? 0) + 1
  return dist
}

/* ---------------------------------------------------------------------------
 * Test — 3 profil × 2 mode × 2 seed
 * ------------------------------------------------------------------------- */

const PROFIL = [SPEEDRUNNER, TELITI, CEROBOH]
const SEED_A = 20260712
const SEED_B = 424242

describe('SOAK ADVERSARIAL — 3 profil (speedrunner/teliti/ceroboh), M10.5 §7d/G2 baseline', () => {
  for (const mode of ['karier', 'ujian'] as const) {
    for (const seed of [SEED_A, SEED_B]) {
      for (const profil of PROFIL) {
        it(`${mode} seed ${seed} — profil ${profil.nama}: tamat tanpa crash/NaN, grade valid`, () => {
          const { akhir, penilaian, cacat } = jalankanStaseProfil(mode, seed, profil)
          expect(cacat).toEqual([])
          expect(akhir.tamat).toBeDefined()
          const skor = hitungSkor(akhir)
          expect(Number.isFinite(skor.total)).toBe(true)
          expect(skor.total).toBeGreaterThanOrEqual(0)
          expect(skor.total).toBeLessThanOrEqual(100)
          expect(['A', 'B', 'C', 'D']).toContain(skor.grade)
          for (const p of penilaian) expect(['A', 'B', 'C', 'D']).toContain(p.grade)

          // CODEX audit pasca-GM (2026-07-13, temuan #20): dulu tak ada lantai
          // sama sekali — profil TELITI (harusnya baseline "dokter baik") bisa
          // diam-diam terclamp UKP=0/grade D lewat bug harness (obatBenar
          // mentah memicu firewall alergi berulang), dan suite tetap hijau
          // krn assertion lama cuma cek "angka valid", bukan "masuk akal".
          // Lantai longgar ini bukan angka kalibrasi resmi — cuma pagar
          // regresi murah thd kelas bug "harness sendiri yg rusak, bukan
          // engine", supaya gagal berisik kalau terulang.
          if (profil.nama === 'teliti') {
            expect(skor.ukp).toBeGreaterThanOrEqual(20)
          }

          // Telemetri kalibrasi (dibaca manusia utk keputusan G2, bukan assertion kaku —
          // distribusi target BELUM ditetapkan, ini baseline pertama). Rincian 4
          // dimensi disertakan supaya G2 tahu dimensi MANA yg menyeret total,
          // bukan cuma angka gabungan.
          console.info(
            `[soak-adversarial] ${mode}/seed${seed}/${profil.nama}: dimensi UKP=${skor.ukp.toFixed(1)}/35 ` +
              `UKM=${skor.ukm.toFixed(1)}/35 Manajemen=${skor.manajemen.toFixed(1)}/15 Resiliensi=${skor.resiliensi.toFixed(1)}/15`,
          )
          console.info(
            `[soak-adversarial] ${mode}/seed${seed}/${profil.nama}: ${penilaian.length} pasien, ` +
              `grade=${JSON.stringify(distribusiGrade(penilaian))}, skorAkhir=${skor.total.toFixed(1)} (${skor.grade})`,
          )
        })
      }
    }
  }

  // Invarian arah (bukan angka mutlak): profil lebih teliti TIDAK BOLEH kalah
  // dari profil lebih ceroboh pada rata-rata grade numerik yang sama. Ini
  // pagar regresi murah thd formula skor — kalau suatu hari speedrunner/
  // ceroboh justru MENGUNGGULI teliti, itu tanda outcome-gaming nyata (Q1
  // eskalasi O-C→O-B trigger, docs/M10_5_FIDELITAS.md §7a).
  it('invarian: rata-rata grade teliti ≥ speedrunner ≥ ceroboh (Karier, seed tetap)', () => {
    const NILAI_GRADE: Record<string, number> = { A: 4, B: 3, C: 2, D: 1 }
    const rataRata = (p: PenilaianEncounter[]) =>
      p.length > 0 ? p.reduce((sum, x) => sum + (NILAI_GRADE[x.grade] ?? 0), 0) / p.length : 0

    const teliti = rataRata(jalankanStaseProfil('karier', SEED_A, TELITI).penilaian)
    const speedrunner = rataRata(jalankanStaseProfil('karier', SEED_A, SPEEDRUNNER).penilaian)
    const ceroboh = rataRata(jalankanStaseProfil('karier', SEED_A, CEROBOH).penilaian)

    console.info(
      `[soak-adversarial] rata-rata grade (4=A..1=D): teliti=${teliti.toFixed(2)} speedrunner=${speedrunner.toFixed(2)} ceroboh=${ceroboh.toFixed(2)}`,
    )
    expect(teliti).toBeGreaterThanOrEqual(speedrunner)
    expect(speedrunner).toBeGreaterThanOrEqual(ceroboh)
  })
})
