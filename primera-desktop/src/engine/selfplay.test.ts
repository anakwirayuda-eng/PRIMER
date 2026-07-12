/**
 * SELF-PLAY INTEGRATION TEST — menjalankan SELURUH loop game 8 hari headless
 * dengan konten PRODUKSI (PACK dari '@content/index'), bukan fixture mini.
 *
 * Profil "dokter rajin": tiap pagi memanggil semua pasien, menanyakan semua
 * pertanyaan non-distraktor, mengukur vital, memeriksa semua region relevan,
 * mengomit diagnosis ICD-10 yang benar (stempel TEGAK), meresepkan semua
 * obatBenar, memberi semua edukasi wajib, dan berdisposisi tepat
 * (rujuk bila harusDirujuk, selain itu pulang).
 *
 * Mekanisme karma (Golden Loop GDD §6) yang diverifikasi di sini:
 *   - init.ts menjadwalkan 'karma_igd' SEJAK HARI PERTAMA untuk tiap keluarga
 *     yang skenario arc pertamanya ber-karma (jam pasir berjalan sebelum
 *     dokter tahu) + men-set KeluargaState.karmaAktif.
 *   - Kunjungan pertama yang BERHASIL membatalkan jadwal itu (karmaDicegah).
 *   - Diabaikan → jatuh tempo D+6: surat IGD bernama, pasien stroke_iskemik
 *     muncul di antrian, arcSelesai 'gagal', tally.karmaTerjadi naik.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { KAPASITAS_EDUKASI } from './clinic'
import { advance, HARI_REKAP_SLICE, STAMINA_MAKS } from './reducer'
import type { Action } from './actions'
import type { GameEvent } from './events'
import type { GameState, PasienAktif, PenilaianEncounter } from './state'
import type { SkenarioKunjungan } from '@content/types'

/* ---------------------------------------------------------------------------
 * Helper dasar
 * ------------------------------------------------------------------------- */

interface Langkah {
  state: GameState
  events: GameEvent[]
}

/**
 * Jalankan satu aksi lewat advance(). Gagal keras bila engine menolak aksi
 * (ERROR_AKSI) — dalam skenario self-play semua aksi seharusnya valid.
 * Catatan: FIREWALL_ALERGI bukan ERROR_AKSI (poka-yoke, bukan penolakan).
 */
function run(state: GameState, action: Action): Langkah {
  const hasil = advance(state, action, PACK)
  const error = hasil.events.find((e) => e.type === 'ERROR_AKSI')
  if (error && error.type === 'ERROR_AKSI') {
    throw new Error(
      `Aksi ${action.type} ditolak engine (hari ${state.hari} blok ${state.blok}): ${error.pesan}`,
    )
  }
  return hasil
}

function serialisasi(state: GameState): string {
  return JSON.stringify(state)
}

/**
 * IGD interrupt (M3.14) bisa tiba subuh & memblokir LANJUTKAN. Tangani optimal:
 * tiap langkah pilih tindakan benar → disposisi sesuai disposisiBenar. Deterministik.
 */
function selesaikanIgdJikaAda(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[s.igd.kasusId]
    if (!kasus) break
    if (s.igd.fase === 'langkah') {
      const langkah = kasus.langkah[s.igd.langkahIndex]
      if (!langkah) break
      const benar = langkah.pilihan.find((p) => p.benar) ?? langkah.pilihan[0]!
      s = run(s, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: benar.id }).state
    } else if (s.igd.fase === 'kode_biru') {
      s = run(s, { type: 'RJP_IGD', berkualitas: true }).state
    } else if (s.igd.fase === 'disposisi') {
      s = run(s, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar }).state
    } else break
  }
  return s
}

/* ---------------------------------------------------------------------------
 * Kebijakan "dokter rajin" — deterministik penuh terhadap state + PACK
 * ------------------------------------------------------------------------- */

/** Tangani satu pasien dari antrian secara teladan; kembalikan penilaiannya. */
function tanganiPasienRajin(state: GameState): { state: GameState; penilaian: PenilaianEncounter } {
  let s = run(state, { type: 'PANGGIL_PASIEN' }).state
  const enc = s.klinik.aktif
  if (!enc) throw new Error('PANGGIL_PASIEN tidak menghasilkan encounter aktif')
  const kasus = PACK.kasus[enc.pasien.kasusId]
  if (!kasus) throw new Error(`Kasus '${enc.pasien.kasusId}' tidak ada di PACK`)

  // ANAMNESIS: semua pertanyaan esensial + non-distraktor (cakupan OLDCARTS maksimal).
  for (const q of kasus.anamnesis) {
    if (q.distraktor === true) continue
    s = run(s, { type: 'TANYA', pertanyaanId: q.id }).state
  }

  // PEMERIKSAAN: vital + semua region relevan saja (tanpa pemeriksaan berlebih).
  s = run(s, { type: 'LANJUT_FASE' }).state // anamnesis → pemeriksaan
  s = run(s, { type: 'UKUR_VITAL' }).state
  for (const t of kasus.pemeriksaanFisik) {
    if (!t.relevan) continue
    s = run(s, { type: 'PERIKSA', region: t.region }).state
  }

  // DIAGNOSIS: komit ICD-10 benar dengan stempel TEGAK.
  s = run(s, { type: 'LANJUT_FASE' }).state // pemeriksaan → diagnosis
  expect(s.klinik.aktif?.fase).toBe('diagnosis')
  s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' }).state

  // TERAPI: semua obatBenar + SATU wakil tiap grup alternatif (firewall alergi
  // boleh memblokir — bukan error) + edukasi wajib.
  for (const obatId of kasus.tatalaksana.obatBenar) {
    s = run(s, { type: 'TAMBAH_OBAT', obatId }).state
  }
  for (const grup of kasus.tatalaksana.obatAlternatif ?? []) {
    if (grup[0]) s = run(s, { type: 'TAMBAH_OBAT', obatId: grup[0] }).state
  }
  // M7 (34b/O4): baki edukasi maks KAPASITAS_EDUKASI — dokter rajin memberi
  // 3 topik wajib pertama (target skor = min(kapasitas, |wajib|) -> tetap 100).
  for (const edukasiId of kasus.tatalaksana.edukasi.slice(0, KAPASITAS_EDUKASI)) {
    s = run(s, { type: 'TAMBAH_EDUKASI', edukasiId }).state
  }

  // DISPOSISI: rujuk (dengan SBAR lengkap) bila harusDirujuk, selain itu pulang.
  s = run(s, { type: 'LANJUT_FASE' }).state // terapi → disposisi
  const aksiDisposisi: Action = kasus.harusDirujuk
    ? {
        type: 'DISPOSISI',
        jenis: 'rujuk',
        sbar: {
          situation: `Pasien ${enc.pasien.nama}, ${enc.pasien.usia} tahun, datang dengan keluhan: ${kasus.keluhanUtama}`,
          background: 'Anamnesis, tanda vital, dan pemeriksaan fisik terlampir lengkap pada lembar periksa ini.',
          assessment: `Assessment kerja: ${kasus.nama} (${kasus.icd10}) — di luar kompetensi tuntas FKTP, butuh penanganan lanjutan.`,
          recommendation: 'Mohon penanganan lanjutan di fasilitas rujukan; pasien telah distabilkan dan didampingi keluarga.',
        },
      }
    : { type: 'DISPOSISI', jenis: 'pulang' }
  const akhir = run(s, aksiDisposisi)

  const selesai = akhir.events.find(
    (e): e is Extract<GameEvent, { type: 'ENCOUNTER_SELESAI' }> => e.type === 'ENCOUNTER_SELESAI',
  )
  if (!selesai) throw new Error('DISPOSISI tidak menghasilkan event ENCOUNTER_SELESAI')
  return { state: akhir.state, penilaian: selesai.penilaian }
}

/** Mainkan pagi penuh: panggil & tangani seluruh antrian. */
function mainkanPagiRajin(state: GameState): { state: GameState; penilaian: PenilaianEncounter[] } {
  let s = state
  const penilaian: PenilaianEncounter[] = []
  while (s.klinik.antrian.length > 0) {
    const hasil = tanganiPasienRajin(s)
    s = hasil.state
    penilaian.push(hasil.penilaian)
  }
  return { state: s, penilaian }
}

/**
 * Playthrough dokter rajin dari hari 1 sampai pagi hari `hariAkhir`.
 * LANJUTKAN 3× per hari (pagi→siang→sore→tidur). Tanpa kunjungan rumah.
 */
function mainkanSampaiHari(
  seed: number,
  hariAkhir: number,
): { state: GameState; penilaian: PenilaianEncounter[]; staminaPagi: number[] } {
  // tutorialAktif dimatikan: helper ini menguji tally 1:1 dgn tiap encounter
  // yg dimainkan — encounter tutorial (DeepThink "onboarding railroaded")
  // sengaja kebal tally, akan menggeser hitungan di sini.
  let s = { ...buildInitialState('Tester', seed, PACK), tutorialAktif: false }
  const semuaPenilaian: PenilaianEncounter[] = []
  const staminaPagi: number[] = [s.stamina]

  while (s.hari < hariAkhir) {
    s = selesaikanIgdJikaAda(s) // subuh: tangani gawat darurat bila ada
    const pagi = mainkanPagiRajin(s)
    s = pagi.state
    semuaPenilaian.push(...pagi.penilaian)
    s = run(s, { type: 'LANJUTKAN' }).state // pagi → siang
    s = run(s, { type: 'LANJUTKAN' }).state // siang → sore
    s = run(s, { type: 'LANJUTKAN' }).state // sore → tidur → hari baru
    staminaPagi.push(s.stamina)
  }
  return { state: s, penilaian: semuaPenilaian, staminaPagi }
}

/** Maju sampai blok siang pada hari `hariTarget` tanpa memainkan apa pun. */
function majuKeSiangHari(state: GameState, hariTarget: number): GameState {
  let s = state
  while (s.hari < hariTarget) {
    s = selesaikanIgdJikaAda(s)
    s = run(s, { type: 'LANJUTKAN' }).state
  }
  s = selesaikanIgdJikaAda(s)
  expect(s.blok).toBe('pagi')
  return run(s, { type: 'LANJUTKAN' }).state // pagi → siang
}

/**
 * Mainkan satu kunjungan rumah dengan MI teladan: klik SEMUA hotspot, pilih
 * dialog tepat:true non-konfrontasi di tiap node, komit hambatan ground-truth,
 * pilih kartu intervensi yang cocok.
 */
function mainkanKunjunganTepat(
  state: GameState,
  keluargaId: string,
): {
  state: GameState
  skenario: SkenarioKunjungan
  deltaTrustHarapan: number
  trustAwal: number
  eventsPenutup: GameEvent[]
} {
  const kelContent = PACK.keluarga[keluargaId]
  const kelAwal = state.desa.keluarga[keluargaId]
  if (!kelContent || !kelAwal) throw new Error(`Keluarga '${keluargaId}' tidak dikenal`)
  const skenario = kelContent.arc.kunjungan[kelAwal.arcIndex]
  if (!skenario) throw new Error(`Arc ${keluargaId} sudah habis (arcIndex ${kelAwal.arcIndex})`)

  // Fix #10 (audit CODEX 2026-07-11): MULAI_KUNJUNGAN kini wajib roster binaan.
  let s = state.desa.binaan.includes(keluargaId)
    ? state
    : run(state, { type: 'PILIH_BINAAN', keluargaId }).state
  s = run(s, { type: 'MULAI_KUNJUNGAN', keluargaId }).state
  expect(s.kunjungan?.fase).toBe('observasi')

  for (const h of skenario.hotspot) {
    s = run(s, { type: 'KLIK_HOTSPOT', hotspotId: h.id }).state
  }
  s = run(s, { type: 'LANJUT_BABAK' }).state // observasi → wawancara

  let deltaTrustHarapan = 0
  for (const node of skenario.dialog) {
    const tepat = node.pilihan.find((p) => p.tepat && p.gaya !== 'konfrontasi')
    if (!tepat) throw new Error(`Node ${node.id} tidak punya pilihan tepat non-konfrontasi`)
    deltaTrustHarapan += tepat.efekTrust
    s = run(s, { type: 'PILIH_DIALOG', pilihanId: tepat.id }).state
  }
  s = run(s, { type: 'LANJUT_BABAK' }).state // wawancara → diagnosis_perilaku
  s = run(s, { type: 'KOMIT_HAMBATAN', hipotesis: skenario.hambatanSebenarnya }).state
  const kartu = skenario.intervensi.find((i) => i.cocokUntuk.includes(skenario.hambatanSebenarnya))
  if (!kartu) throw new Error(`Skenario ${skenario.id} tidak punya intervensi yang cocok`)
  const penutup = run(s, { type: 'PILIH_INTERVENSI', intervensiId: kartu.id })

  return {
    state: penutup.state,
    skenario,
    deltaTrustHarapan,
    trustAwal: kelAwal.trust,
    eventsPenutup: penutup.events,
  }
}

/* ---------------------------------------------------------------------------
 * 1. Init dengan konten produksi
 * ------------------------------------------------------------------------- */

describe('selfplay: init konten produksi', () => {
  it('buildInitialState → hari 1 pagi, antrian terisi Director, inbox 2 surat', () => {
    const s = buildInitialState('Tester', 12345, PACK)

    expect(s.hari).toBe(1)
    expect(s.blok).toBe('pagi')
    expect(s.stamina).toBe(STAMINA_MAKS)

    // Director hari 1-2: 2 pasien playable; semua kasusnya harus ada di PACK.
    expect(s.klinik.antrian).toHaveLength(2)
    for (const p of s.klinik.antrian) {
      expect(PACK.kasus[p.kasusId]).toBeDefined()
    }

    // Surat sambutan Kapus + tutorial.
    expect(s.inbox).toHaveLength(2)
    expect(s.inbox.every((m) => m.hari === 1 && !m.dibaca)).toBe(true)

    // Seluruh keluarga pack punya state awal.
    expect(Object.keys(s.desa.keluarga).sort()).toEqual(Object.keys(PACK.keluarga).sort())

    // Jam pasir karma berjalan SEJAK INIT: tiap keluarga yang skenario arc
    // pertamanya ber-karma mendapat jadwal 'karma_igd' + flag karmaAktif.
    const keluargaBerKarma = Object.values(PACK.keluarga).filter(
      (k) => k.arc.kunjungan[0]?.karma !== undefined,
    )
    expect(keluargaBerKarma.length).toBeGreaterThanOrEqual(1) // minimal Bu Wulan
    expect(s.jadwal).toHaveLength(keluargaBerKarma.length)
    for (const k of keluargaBerKarma) {
      const karma = k.arc.kunjungan[0]?.karma
      const item = s.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === k.id)
      expect(item).toBeDefined()
      expect(item?.hari).toBe(karma?.jatuhTempoHari)
      expect(item?.kasusId).toBe(karma?.kasusId)
      expect(s.desa.keluarga[k.id]?.karmaAktif).toEqual({
        jadwalId: item?.id,
        jatuhTempoHari: karma?.jatuhTempoHari,
      })
    }
  })
})

/* ---------------------------------------------------------------------------
 * 2+3. Dokter rajin 8 hari penuh: grade, tally, stamina, rekap, autosave
 * ------------------------------------------------------------------------- */

describe('selfplay: dokter rajin 8 hari (konten produksi, seed 12345)', () => {
  const hasil = mainkanSampaiHari(12345, HARI_REKAP_SLICE)
  const s = hasil.state

  it('setiap encounter: diagnosis benar, disposisi tepat, grade A/B', () => {
    expect(hasil.penilaian.length).toBeGreaterThanOrEqual(14) // 2+2+3×5 = 19 slot playable d1-d7
    for (const p of hasil.penilaian) {
      expect(p.diagnosisBenar).toBe(true)
      expect(p.jenisDiagnosis).toBe('tegak')
      expect(p.disposisiTepat).toBe(true)
      expect(p.rujukanNonSpesialistik).toBe(false)
      expect(p.cowboy).toBe(false)
      expect(p.antibiotikTanpaIndikasi).toBe(false)
      expect(['A', 'B']).toContain(p.grade)
    }

    // Telemetri balancing (dibaca manusia, bukan assertion).
    const distribusi: Record<string, number> = {}
    for (const p of hasil.penilaian) distribusi[p.grade] = (distribusi[p.grade] ?? 0) + 1
    console.info(
      `[selfplay] dokter rajin d1-d7: ${hasil.penilaian.length} pasien, grade = ${JSON.stringify(distribusi)}`,
    )
  })

  it('tally naik konsisten dengan jumlah encounter yang dimainkan', () => {
    expect(s.tally.totalPasien).toBe(hasil.penilaian.length)
    expect(s.tally.diagnosisBenar).toBe(hasil.penilaian.length)
    expect(s.tally.tegakBenar).toBe(hasil.penilaian.length)
    expect(s.tally.tegakSalah).toBe(0)
    expect(s.tally.suspekBenar + s.tally.suspekSalah).toBe(0)
    expect(s.tally.cowboy).toBe(0)
    expect(s.tally.rujukanNonSpesialistik).toBe(0)
    // Dex terisi untuk tiap kasus yang ditangani.
    for (const p of hasil.penilaian) {
      expect(s.dex[p.kasusId]?.ditangani).toBeGreaterThanOrEqual(1)
    }
  })

  it('hari 8 tercapai: flags.rekapSlice truthy, stamina pulih penuh tiap pagi', () => {
    expect(s.hari).toBe(HARI_REKAP_SLICE)
    expect(s.blok).toBe('pagi')
    expect(s.flags['rekapSlice']).toBeTruthy()

    // Dokter rajin memakai maks 3 pip/hari → tidak pernah kelelahan → burnout 0
    // → stamina kembali 6 setiap pagi (hari 1..8).
    expect(hasil.staminaPagi).toHaveLength(HARI_REKAP_SLICE)
    for (const pip of hasil.staminaPagi) expect(pip).toBe(STAMINA_MAKS)
    expect(s.burnout).toBe(0)
    expect(s.tally.hariKelelahan).toBe(0)
  })

  it('autosave-able: serialize → deserialize roundtrip menghasilkan state setara', () => {
    const dipulihkan = JSON.parse(serialisasi(s)) as GameState
    expect(dipulihkan).toEqual(s)

    // Resume mulus: satu langkah LANJUTKAN dari kedua state menghasilkan dunia identik.
    const lanjutAsli = run(s, { type: 'LANJUTKAN' }).state
    const lanjutPulih = run(dipulihkan, { type: 'LANJUTKAN' }).state
    expect(serialisasi(lanjutPulih)).toBe(serialisasi(lanjutAsli))
  })
})

/* ---------------------------------------------------------------------------
 * 4. KARMA — playthrough kedua yang MENGABAIKAN keluarga_wulan
 * ------------------------------------------------------------------------- */

describe('selfplay: karma keluarga_wulan yang diabaikan (playthrough kedua)', () => {
  // Pemicu yang semestinya = INIT: jam pasir karma sudah berjalan sejak hari 1
  // (init.ts menjadwalkan 'karma_igd' untuk keluarga ber-karma), BUKAN saat
  // kunjungan pertama dibuat. Playthrough ini TIDAK PERNAH mengunjungi siapa pun.
  it('jadwal karma_igd keluarga_wulan ada sejak init, jatuh tempo D+6 (stroke_iskemik)', () => {
    const s = buildInitialState('Pengabai', 12345, PACK)
    const karmaKonten = PACK.keluarga['keluarga_wulan']?.arc.kunjungan[0]?.karma
    expect(karmaKonten).toBeDefined()
    expect(karmaKonten?.jatuhTempoHari).toBe(6) // GDD: karma Bu Wulan D+6

    const item = s.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')
    expect(item).toBeDefined()
    expect(item?.hari).toBe(karmaKonten?.jatuhTempoHari)
    expect(item?.kasusId).toBe(karmaKonten?.kasusId)
    expect(item?.kasusId).toBe('stroke_iskemik')
    expect(s.desa.keluarga['keluarga_wulan']?.karmaAktif).toEqual({
      jadwalId: item?.id,
      jatuhTempoHari: karmaKonten?.jatuhTempoHari,
    })
  })

  it('diabaikan total → karma meletus subuh D+6: surat IGD, Bu Wulan di antrian, arc gagal', () => {
    let s = buildInitialState('Pengabai', 12345, PACK)
    const jatuhTempo = PACK.keluarga['keluarga_wulan']?.arc.kunjungan[0]?.karma?.jatuhTempoHari ?? 6

    let eventKarma: Extract<GameEvent, { type: 'KARMA_TERJADI' }> | undefined
    let antrianHariKarma: PasienAktif[] = []

    // Abaikan seluruh dunia (hanya LANJUTKAN, 3× per hari) sampai lewat jatuh tempo.
    while (s.hari < jatuhTempo + 2) {
      s = selesaikanIgdJikaAda(s)
      const langkah = run(s, { type: 'LANJUTKAN' })
      s = langkah.state
      const k = langkah.events.find(
        (e): e is Extract<GameEvent, { type: 'KARMA_TERJADI' }> => e.type === 'KARMA_TERJADI',
      )
      if (k) eventKarma = k
      if (s.hari === jatuhTempo && s.blok === 'pagi') antrianHariKarma = s.klinik.antrian
    }

    // Karma meletus tepat di pagi hari jatuh tempo — konsekuensi BERNAMA.
    expect(eventKarma).toBeDefined()
    expect(s.tally.karmaTerjadi).toBe(1)
    expect(s.tally.karmaDicegah).toBe(0)

    // Surat IGD subuh dari perawat jaga, terkait keluarga_wulan.
    const suratKarma = s.inbox.filter((m) => m.jenis === 'karma')
    expect(suratKarma).toHaveLength(1)
    expect(suratKarma[0]?.hari).toBe(jatuhTempo)
    expect(suratKarma[0]?.kaitKeluargaId).toBe('keluarga_wulan')

    // Bu Wulan muncul sebagai pasien stroke di DEPAN antrian hari itu.
    expect(antrianHariKarma.some((p) => p.kasusId === 'stroke_iskemik' && p.followUpDari)).toBe(true)

    // Arc keluarga dinyatakan gagal; jam pasir dikonsumsi (tidak meletus dua kali).
    const kel = s.desa.keluarga['keluarga_wulan']
    expect(kel?.arcSelesai).toBe('gagal')
    expect(kel?.karmaAktif).toBeUndefined()
    expect(s.jadwal.some((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')).toBe(false)
  })
})

/* ---------------------------------------------------------------------------
 * 5. Kunjungan rumah keluarga_wulan — 4 babak dengan MI teladan
 * ------------------------------------------------------------------------- */

describe('selfplay: kunjungan rumah keluarga_wulan (hari 3 siang)', () => {
  const awal = buildInitialState('Tester', 12345, PACK)
  const siangHari3 = majuKeSiangHari(awal, 3)
  const kunjungan = mainkanKunjunganTepat(siangHari3, 'keluarga_wulan')
  const s = kunjungan.state
  const kel = s.desa.keluarga['keluarga_wulan']

  it('kunjungan selesai & berhasil: hipotesis benar, intervensi cocok, MI 100', () => {
    expect(s.kunjungan).toBeUndefined()
    expect(s.layar).toBe('peta')

    const hasil = s.hasilKunjunganHariIni
    expect(hasil).toBeDefined()
    expect(hasil?.keluargaId).toBe('keluarga_wulan')
    expect(hasil?.skenarioId).toBe(kunjungan.skenario.id)
    expect(hasil?.berhasil).toBe(true)
    expect(hasil?.diusir).toBe(false)
    expect(hasil?.hipotesisBenar).toBe(true)
    expect(hasil?.kualitasMi).toBe(100)
    expect(hasil?.narasiPenutup).toBe(kunjungan.skenario.penutupBerhasil)
  })

  it('trust naik sesuai kualitas pilihan MI (bukan frekuensi)', () => {
    expect(kunjungan.deltaTrustHarapan).toBeGreaterThan(0)
    const trustHarapan = Math.min(10, kunjungan.trustAwal + kunjungan.deltaTrustHarapan)
    expect(kel?.trust).toBe(trustHarapan)
    expect(kel?.trust ?? 0).toBeGreaterThan(kunjungan.trustAwal)
    // TTM maju satu tahap dan arc bergeser ke kunjungan berikutnya.
    expect(kel?.ttm).toBe('kontemplasi')
    expect(kel?.arcIndex).toBe(1)
    expect(kel?.jumlahKunjungan).toBe(1)
    expect(kel?.kunjunganTerakhir).toBe(3)
  })

  it('indikator dari hotspot & gerbang kejujuran terverifikasi sumber dokter', () => {
    const hasil = s.hasilKunjunganHariIni
    // Semua hotspot diklik → indikator ber-hotspot pasti terverifikasi.
    const indikatorHotspot = kunjungan.skenario.hotspot
      .map((h) => h.indikator)
      .filter((x): x is NonNullable<typeof x> => x !== undefined)
    expect(indikatorHotspot.length).toBeGreaterThanOrEqual(2) // klik ≥2 hotspot bermakna
    for (const ind of indikatorHotspot) {
      expect(hasil?.indikatorTerverifikasi).toContain(ind)
    }
    // Data keluarga: status = statusSebenarnya, sumber 'dokter', tercap hari ini.
    for (const ind of hasil?.indikatorTerverifikasi ?? []) {
      const nilai = kel?.indikator[ind]
      expect(nilai?.sumber).toBe('dokter')
      expect(nilai?.status).toBe(nilai?.statusSebenarnya)
      expect(nilai?.hariData).toBe(3)
    }
    // Ground truth konten: Bu Wulan memang belum berobat hipertensi.
    expect(kel?.indikator['hipertensi_berobat']?.status).toBe('tidak')
  })

  it('tally kunjungan: kunjunganBerhasil = 1, MI tercatat penuh', () => {
    expect(s.tally.kunjunganTotal).toBe(1)
    expect(s.tally.kunjunganBerhasil).toBe(1)
    expect(s.tally.kunjunganDiusir).toBe(0)
    expect(s.tally.apathy).toBe(0)
    // M10 Batch-2 (CODEX P1.5): satuan MI kini per-KUNJUNGAN (bukan per-pilihan
    // dialog) — satu kunjungan sempurna (MI 100) = miTotal 1, miTepat 1.0.
    // Sejalan floor EKSPEKTASI_KUNJUNGAN di scoring.ts yang berdenominasi
    // kunjungan (dulu 1 kunjungan 4-pilihan = 4/8 target Ujian = salah satuan).
    expect(s.tally.miTotal).toBe(1)
    expect(s.tally.miTepat).toBe(1)
  })

  it('kunjungan berhasil MENCEGAH karma: jadwal D+6 dibatalkan, karmaAktif lepas', () => {
    // Sebelum kunjungan, jam pasir masih berjalan.
    expect(
      siangHari3.jadwal.some((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan'),
    ).toBe(true)

    // Sesudahnya: dibatalkan + tercatat sebagai karma dicegah + event juice.
    expect(s.jadwal.some((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')).toBe(false)
    expect(kel?.karmaAktif).toBeUndefined()
    expect(s.tally.karmaDicegah).toBe(1)
    expect(s.tally.karmaTerjadi).toBe(0)
    expect(kunjungan.eventsPenutup.some((e) => e.type === 'KARMA_DICEGAH')).toBe(true)

    // Dunia terus berjalan melewati D+6 TANPA ledakan karma.
    let lanjut = s
    while (lanjut.hari < 8) lanjut = run(lanjut, { type: 'LANJUTKAN' }).state
    expect(lanjut.tally.karmaTerjadi).toBe(0)
    expect(lanjut.inbox.filter((m) => m.jenis === 'karma')).toHaveLength(0)
  })
})

/* ---------------------------------------------------------------------------
 * 6. Determinisme — seed sama + urutan aksi sama ⇒ state serial identik
 * ------------------------------------------------------------------------- */

describe('selfplay: determinisme', () => {
  it('dua init dengan seed sama identik byte-per-byte', () => {
    const a = buildInitialState('Tester', 12345, PACK)
    const b = buildInitialState('Tester', 12345, PACK)
    expect(serialisasi(b)).toBe(serialisasi(a))
  })

  it('dua playthrough dokter rajin 8 hari dengan seed sama identik byte-per-byte', () => {
    const a = mainkanSampaiHari(12345, HARI_REKAP_SLICE)
    const b = mainkanSampaiHari(12345, HARI_REKAP_SLICE)
    expect(serialisasi(b.state)).toBe(serialisasi(a.state))
    expect(b.penilaian).toEqual(a.penilaian)
  })

  it('seed berbeda menghasilkan dunia berbeda (sanity anti-konstanta)', () => {
    const a = buildInitialState('Tester', 12345, PACK)
    const b = buildInitialState('Tester', 54321, PACK)
    expect(serialisasi(b)).not.toBe(serialisasi(a))
  })
})
