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
 * Cakupan baseline adversarial: subuh IGD (ditangani optimal utk SEMUA profil)
 * + poli klinik + maksimal 1 kunjungan rumah/hari. Di bagian akhir ada satu
 * driver TELADAN TERPADU tersendiri yang juga menjalankan Posyandu, Prolanis,
 * respons KLB, Lokmin, penutupan umpan-balik rujukan, dan pemulihan akhir pekan.
 * Pemisahan ini menjaga perbandingan profil lama tetap stabil sekaligus memberi
 * bukti attainability untuk keempat dimensi permainan yang sebenarnya.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import {
  advance,
  BIAYA_STAMINA_KUNJUNGAN,
  COOLDOWN_POSYANDU,
  HARI_BUKA_KLB,
  HARI_BUKA_POSYANDU,
  HARI_BUKA_PROLANIS,
  SIKLUS_LAPORAN_BULANAN,
} from './reducer'
import { hitungSkor } from './scoring'
import { KAPASITAS_EDUKASI } from './clinic'
import { HARI_STASE } from './paketUjian'
import { Rng } from './core/rng'
import { isGayaTerlarang } from '@content/types'
import { rumahSakitCocokUntukIgd } from './igd'
import { ambangKlusterPack, clusterAktif } from './surveilans'
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

function cacatTenggatKarma(state: GameState): string[] {
  const pemilikHari = new Map<number, string>()
  const cacat: string[] = []
  for (const item of state.jadwal.filter((jadwal) => jadwal.jenis === 'karma_igd')) {
    const ada = pemilikHari.get(item.hari)
    if (ada) cacat.push(`H${state.hari}.karma-bentrok@${item.hari}:${ada}+${item.keluargaId ?? '-'}`)
    else pemilikHari.set(item.hari, item.keluargaId ?? '-')
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
  const jenis =
    profil.nama === 'teliti'
      ? kasus.kepastianDiagnosis ?? 'tegak'
      : rng.chance(profil.diagnosisTegakProb)
        ? 'tegak'
        : 'suspek'
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
  if (kasus.observasi && profil.nama === 'teliti') {
    s = coba(s, { type: 'MULAI_OBSERVASI' })
    s = coba(s, { type: 'NILAI_ULANG_OBSERVASI' })
  }

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
  staminaCadangan = 0,
): { state: GameState; penilaian: PenilaianEncounter[] } {
  let s = state
  const penilaian: PenilaianEncounter[] = []
  let guard = 0
  while (s.klinik.antrian.length > 0 && s.stamina > staminaCadangan && guard++ < 20) {
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
    .filter(([, k]) =>
      k.arcSelesai === undefined &&
      (k.followUpHari === undefined || k.followUpHari <= state.hari),
    )
    .sort(([a, keluargaA], [b, keluargaB]) => {
      const tenggatA = keluargaA.karmaAktif?.jatuhTempoHari ?? Number.POSITIVE_INFINITY
      const tenggatB = keluargaB.karmaAktif?.jatuhTempoHari ?? Number.POSITIVE_INFINITY
      if (tenggatA !== tenggatB) return tenggatA - tenggatB
      return state.desa.binaan.includes(a) === state.desa.binaan.includes(b)
        ? 0
        : state.desa.binaan.includes(a)
          ? -1
          : 1
    })
  const target = kandidat[0]?.[0]
  if (!target) return state
  const kelContent = PACK.keluarga[target]
  const kelAwal = state.desa.keluarga[target]
  if (!kelContent || !kelAwal) return state
  const skenario = kelContent.arc.kunjungan[kelAwal.arcIndex]
  if (!skenario) return state

  let s = state.desa.binaan.includes(target) ? state : coba(state, { type: 'PILIH_BINAAN', keluargaId: target })
  const mulaiKunjungan = cobaEv(s, { type: 'MULAI_KUNJUNGAN', keluargaId: target })
  s = mulaiKunjungan.state
  if (s.kunjungan?.fase === 'penerimaan' && skenario.penerimaanAwal) {
    const pilihan = profil.kunjunganKualitas === 'teladan'
      ? skenario.penerimaanAwal.pilihan.find((p) => p.tindakan === 'hormati')
      : profil.kunjunganKualitas === 'cepat'
        ? skenario.penerimaanAwal.pilihan.find((p) => p.tindakan === 'memaksa')
        : rng.pick(skenario.penerimaanAwal.pilihan)
    if (pilihan) s = coba(s, { type: 'RESPONS_PENERIMAAN', pilihanId: pilihan.id })
  }
  if (!s.kunjungan || s.kunjungan.fase !== 'observasi') return s

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

/** Jawab seluruh kartu kegiatan dengan keputusan benar, tanpa shortcut state. */
function beresKegiatanTeladan(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.kegiatan && guard++ < 30) {
    const kartu = s.kegiatan.kartu[s.kegiatan.index]
    if (!kartu) break
    const benar = kartu.pilihan.find((p) => p.benar) ?? kartu.pilihan[0]
    if (!benar) break
    s = coba(s, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: benar.id })
  }
  return s
}

function biayaKunjunganTeladan(state: GameState): number {
  const kandidat = Object.entries(state.desa.keluarga)
    .filter(([, kel]) =>
      kel.arcSelesai === undefined &&
      (kel.followUpHari === undefined || kel.followUpHari <= state.hari),
    )
    .sort(([a, keluargaA], [b, keluargaB]) => {
      const tenggatA = keluargaA.karmaAktif?.jatuhTempoHari ?? Number.POSITIVE_INFINITY
      const tenggatB = keluargaB.karmaAktif?.jatuhTempoHari ?? Number.POSITIVE_INFINITY
      if (tenggatA !== tenggatB) return tenggatA - tenggatB
      return state.desa.binaan.includes(a) === state.desa.binaan.includes(b)
        ? 0
        : state.desa.binaan.includes(a)
          ? -1
          : 1
    })[0]
  const rw = kandidat ? PACK.keluarga[kandidat[0]]?.rw : undefined
  const jarak = PACK.rw.find((profilRw) => profilRw.nomor === rw)?.jarak ?? 'sedang'
  return BIAYA_STAMINA_KUNJUNGAN[jarak]
}

/**
 * Satu keputusan siang untuk pemain teladan. Prioritasnya sengaja klinis:
 * respons sinyal KLB, sesi Prolanis jatuh tempo, Posyandu jatuh tempo, lalu
 * kunjungan keluarga. Akhir pekan dipakai pulih agar strategi terbaik tidak
 * identik dengan bekerja sampai burnout.
 */
function beresSiangTeladan(state: GameState, rng: Rng): GameState {
  let s = state
  if (s.blok !== 'siang') return s

  const karmaMendesak = Object.values(s.desa.keluarga).some(
    (keluarga) =>
      keluarga.arcSelesai === undefined &&
      keluarga.karmaAktif !== undefined &&
      keluarga.karmaAktif.jatuhTempoHari <= s.hari + 1,
  )
  if (karmaMendesak) {
    const setelahKunjungan = cobaKunjunganProfil(s, TELITI, rng)
    if (setelahKunjungan !== s) return setelahKunjungan
  }

  if (s.hari % 7 === 0) return coba(s, { type: 'PEMULIHAN', jenis: 'istirahat' })

  const cluster = clusterAktif(s, PACK)[0]
  if (cluster) {
    const mulai = coba(s, { type: 'MULAI_KLB', rw: cluster.rw, kasusId: cluster.kasusId })
    if (mulai.kegiatan) return beresKegiatanTeladan(mulai)
  }

  const prolanisJatuhTempo =
    s.hari >= HARI_BUKA_PROLANIS[s.mode] &&
    s.prolanis.roster.length > 0 &&
    (s.prolanis.sesiBerikutHari === undefined || s.hari >= s.prolanis.sesiBerikutHari)
  if (prolanisJatuhTempo) {
    const mulai = coba(s, { type: 'MULAI_PROLANIS' })
    if (mulai.kegiatan) return beresKegiatanTeladan(mulai)
  }

  const targetKunjungan = state.mode === 'karier' ? 24 : 8
  if (s.tally.kunjunganTotal < targetKunjungan) {
    const setelahKunjungan = cobaKunjunganProfil(s, TELITI, rng)
    if (setelahKunjungan !== s) return setelahKunjungan
  }

  if (s.hari >= HARI_BUKA_POSYANDU[s.mode]) {
    const rwJatuhTempo = PACK.rw
      .map((rw) => rw.nomor)
      .find((rw) => {
        const terakhir = s.posyanduRwTerakhir[String(rw)]
        return terakhir === undefined || s.hari - terakhir >= COOLDOWN_POSYANDU[s.mode]
      })
    if (rwJatuhTempo !== undefined) {
      const mulai = coba(s, { type: 'MULAI_POSYANDU', rw: rwJatuhTempo })
      if (mulai.kegiatan) return beresKegiatanTeladan(mulai)
    }
  }

  return cobaKunjunganProfil(s, TELITI, rng)
}

function tutupAdministrasiTeladan(state: GameState): GameState {
  let s = state
  if (s.flags.rekapSlice && !s.flags.rekapDitutup) s = coba(s, { type: 'TUTUP_REKAP' })
  if (s.flags[`lokmin${s.hari}`] && !s.flags.lokminDitutup) {
    const periode = Math.ceil(s.hari / SIKLUS_LAPORAN_BULANAN[s.mode])
    if (s.program.periodeDitetapkan !== periode) {
      s = coba(s, { type: 'TETAPKAN_PROGRAM', fokus: 'skrining', rwFokus: 1 })
    }
    s = coba(s, { type: 'TUTUP_LOKMIN' })
  }

  for (const surat of s.inbox.filter((item) => !item.dibaca)) {
    s = coba(s, { type: 'BACA_SURAT', suratId: surat.id })
  }
  for (const episode of Object.values(s.careEpisodes)) {
    if (episode.referral?.stage !== 'feedback') continue
    const surat = s.inbox.find((item) => item.episodeId === episode.id)
    if (!surat) continue
    const langkah = episode.familyId
      ? (['rekonsiliasi', 'kontrol', 'pemantauan_keluarga'] as const)
      : (['rekonsiliasi', 'kontrol'] as const)
    s = coba(s, {
      type: 'ADOPSI_UMPAN_BALIK',
      suratId: surat.id,
      langkah: [...langkah],
    })
  }
  return s
}

function jalankanStaseTeladanTerpadu(mode: ModeStase, seed: number): HasilStase {
  let s = buildInitialState('Soak-teladan-terpadu', seed, PACK, { mode })
  for (const keluargaId of Object.keys(PACK.keluarga)) {
    s = coba(s, { type: 'PILIH_BINAAN', keluargaId })
  }
  const rng = new Rng(seed, 'teladan-terpadu')
  const penilaian: PenilaianEncounter[] = []
  const cacat: string[] = []
  let guard = 0

  while (!s.tamat && guard++ < HARI_STASE[mode] + 5) {
    cacat.push(...cacatTenggatKarma(s))
    if (s.hari === HARI_BUKA_KLB[mode] && s.tally.klbTuntas === 0) {
      const [kasusId, ambang] = Object.entries(ambangKlusterPack(PACK)).sort(([a], [b]) => a.localeCompare(b))[0] ?? []
      if (kasusId && ambang) {
        const sinyal = Array.from({ length: ambang }, () => ({ hari: s.hari, rw: 1, kasusId }))
        s = { ...s, desa: { ...s.desa, surveilans: [...s.desa.surveilans, ...sinyal] } }
      }
    }
    s = beresIgd(s)
    s = tutupAdministrasiTeladan(s)

    // Sisakan satu stamina setelah kegiatan/perjalanan: pemain teladan harus
    // mampu merawat pasien tanpa menjadikan burnout sebagai syarat optimal.
    const biayaSiang = s.hari % 7 === 0 ? 0 : Math.max(2, biayaKunjunganTeladan(s))
    const pagi = beresPagiProfil(s, TELITI, rng, biayaSiang + 1)
    s = pagi.state
    penilaian.push(...pagi.penilaian)
    s = coba(s, { type: 'LANJUTKAN' })
    s = beresSiangTeladan(s, rng)
    s = coba(s, { type: 'LANJUTKAN' })
    s = tutupAdministrasiTeladan(s)
    s = coba(s, { type: 'LANJUTKAN' })

    cacat.push(...semuaAngkaFinite(s.tally as unknown as Record<string, unknown>, `H${s.hari}.tally`))
    cacat.push(...semuaAngkaFinite(hitungSkor(s) as unknown as Record<string, unknown>, `H${s.hari}.skor`))
    cacat.push(...cacatTenggatKarma(s))
  }
  return { akhir: s, penilaian, cacat }
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

  for (const mode of ['karier', 'ujian'] as const) {
    it(`${mode}: pemain teladan terpadu dapat menuntaskan UKP, UKM, manajemen, dan resiliensi`, () => {
      const { akhir, cacat } = jalankanStaseTeladanTerpadu(mode, SEED_A)
      const skor = hitungSkor(akhir)

      console.info(
        `[soak-teladan-terpadu] ${mode}: UKP=${skor.ukp.toFixed(1)}/35 ` +
          `UKM=${skor.ukm.toFixed(1)}/35 Manajemen=${skor.manajemen.toFixed(1)}/15 ` +
          `Resiliensi=${skor.resiliensi.toFixed(1)}/15 Total=${skor.total.toFixed(1)}`,
      )
      console.info(
        `[soak-teladan-terpadu] ${mode}: kunjungan=${akhir.tally.kunjunganTotal}, ` +
          `Posyandu=${akhir.tally.posyanduSesi}, Prolanis=${akhir.tally.prolanisSesi}, ` +
          `KLB=${akhir.tally.klbTuntas}, MI=${akhir.tally.miTepat}/${akhir.tally.miTotal}, ` +
          `karma=${akhir.tally.karmaDicegah}/${akhir.tally.karmaTerjadi}, apathy=${akhir.tally.apathy}, ` +
          `pemulihan terakhir=H${akhir.pemulihanTerakhirHari ?? 0}`,
      )

      expect(cacat).toEqual([])
      expect(akhir.tamat).toBeDefined()
      expect(akhir.tally.kunjunganTotal).toBeGreaterThanOrEqual(mode === 'karier' ? 24 : 8)
      expect(akhir.tally.posyanduSesi).toBeGreaterThan(0)
      expect(akhir.tally.prolanisSesi).toBeGreaterThan(0)
      expect(akhir.tally.klbTuntas).toBeGreaterThan(0)
      expect(akhir.pemulihanTerakhirHari).toBeGreaterThan(0)
      expect(skor.ukp).toBeGreaterThanOrEqual(28)
      expect(skor.ukm).toBeGreaterThanOrEqual(24)
      expect(skor.manajemen).toBeGreaterThanOrEqual(12)
      expect(skor.resiliensi).toBeGreaterThanOrEqual(12)
      expect(skor.total).toBeGreaterThanOrEqual(85)
    })
  }
})
