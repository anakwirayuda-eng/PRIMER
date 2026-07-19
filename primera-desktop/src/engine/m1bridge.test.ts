/**
 * M1 — BRIDGE PENUH UKM↔UKP: test integrasi keenam mekanik di atas konten
 * produksi (PACK). Deterministik penuh (seed tetap).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { EncounterState, GameState } from './state'
import type { Action } from './actions'
import { buatEncounter } from './clinic'
import { Rng } from './core/rng'
import { buatPasienDariKasus } from './director'
import { advance } from './reducer'
import { buildInitialState } from './init'
import { clusterAktif } from './surveilans'

const SEED = 20260702

function run(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

/** IGD interrupt (M3.14) memblokir LANJUTKAN — tangani optimal bila muncul. */
function bereskanIgd(state: GameState): GameState {
  let cur = state
  let guard = 0
  while (cur.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[cur.igd.kasusId]!
    if (cur.igd.fase === 'langkah') {
      const l = kasus.langkah[cur.igd.langkahIndex]!
      cur = run(cur, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id })
    } else if (cur.igd.fase === 'kode_biru') cur = run(cur, { type: 'RJP_IGD', berkualitas: true })
    else if (cur.igd.fase === 'pasca_rosc') cur = run(cur, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
    else if (cur.igd.fase === 'disposisi') cur = run(cur, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    else break
  }
  return cur
}

/** Lewati satu hari penuh: pagi (buang antrian) → siang → sore → pagi besok. */
function lewatiHari(s: GameState): GameState {
  let cur = bereskanIgd(s)
  while (cur.klinik.aktif) throw new Error('encounter aktif — selesaikan dulu')
  cur = run(cur, { type: 'LANJUTKAN' }) // → siang
  cur = run(cur, { type: 'LANJUTKAN' }) // → sore
  cur = run(cur, { type: 'LANJUTKAN' }) // → hari baru
  return cur
}

function sampaiHari(s: GameState, hari: number): GameState {
  let cur = s
  while (cur.hari < hari) cur = lewatiHari(cur)
  return cur
}

/**
 * Mainkan kunjungan keluarga sampai selesai dengan hasil terkontrol.
 * hipotesis/intervensi 'benar'|'salah' dipetakan ke konten skenario nyata.
 */
function mainkanKunjungan(
  s: GameState,
  keluargaId: string,
  opsi: { hipotesis: 'benar' | 'salah'; intervensi: 'cocok' | 'salah' },
): GameState {
  const kel = s.desa.keluarga[keluargaId]
  const content = PACK.keluarga[keluargaId]
  if (!kel || !content) throw new Error('keluarga tidak ada')
  const skenario = content.arc.kunjungan[kel.arcIndex]
  if (!skenario) throw new Error('arc habis')

  // Fix #10 (audit CODEX 2026-07-11): MULAI_KUNJUNGAN kini wajib roster binaan.
  let cur = s.desa.binaan.includes(keluargaId) ? s : run(s, { type: 'PILIH_BINAAN', keluargaId })
  cur = run(cur, { type: 'MULAI_KUNJUNGAN', keluargaId })
  if (!cur.kunjungan) throw new Error('kunjungan gagal mulai (cek guard/blok)')

  // Observasi: temukan semua hotspot ber-indikator.
  for (const h of skenario.hotspot) {
    if (h.indikator) cur = run(cur, { type: 'KLIK_HOTSPOT', hotspotId: h.id })
  }
  cur = run(cur, { type: 'LANJUT_BABAK' })

  // Wawancara: selalu pilih pilihan `tepat` pertama (tanpa konfrontasi).
  for (const node of skenario.dialog) {
    const pilihan = node.pilihan.find((p) => p.tepat) ?? node.pilihan[0]
    if (!pilihan) throw new Error('node tanpa pilihan')
    cur = run(cur, { type: 'PILIH_DIALOG', pilihanId: pilihan.id })
  }
  cur = run(cur, { type: 'LANJUT_BABAK' })

  // Diagnosis perilaku.
  const semuaHambatan = ['kapabilitas', 'kesempatan', 'motivasi'] as const
  const hipotesis =
    opsi.hipotesis === 'benar'
      ? skenario.hambatanSebenarnya
      : semuaHambatan.find((h) => h !== skenario.hambatanSebenarnya)!
  cur = run(cur, { type: 'KOMIT_HAMBATAN', hipotesis })

  // Resep sosial.
  const kartuCocok = skenario.intervensi.find((i) => i.cocokUntuk.includes(skenario.hambatanSebenarnya))!
  const kartuSalah = skenario.intervensi.find((i) => !i.cocokUntuk.includes(skenario.hambatanSebenarnya))!
  cur = run(cur, {
    type: 'PILIH_INTERVENSI',
    intervensiId: opsi.intervensi === 'cocok' ? kartuCocok.id : kartuSalah.id,
  })
  if (cur.kunjungan?.fase === 'ingatkan') {
    const pengingatTepat = skenario.pilihanIngatkan?.pilihan.find((pilihan) => pilihan.tepat)
    if (!pengingatTepat) throw new Error('babak ingatkan tanpa pilihan tepat')
    cur = run(cur, { type: 'PILIH_INGATKAN', pilihanId: pengingatTepat.id })
  }
  return cur
}

/** Sampai blok siang hari tertentu (untuk kunjungan). */
function sampaiSiang(s: GameState, hari: number): GameState {
  let cur = bereskanIgd(sampaiHari(s, hari))
  cur = run(cur, { type: 'LANJUTKAN' }) // pagi → siang (antrian di-auto-resolve)
  expect(cur.blok).toBe('siang')
  return cur
}

function encounterKarmaPrapto(
  diagnosisBenar = true,
  konsekuensiKarma = true,
): EncounterState {
  const kasus = PACK.kasus['demam_tifoid']!
  const keluarga = PACK.keluarga['keluarga_prapto']!
  const anggota = keluarga.anggota[2]!
  const pasien = buatPasienDariKasus(kasus.id, PACK, new Rng(SEED, 'b1.3'), {
    nama: anggota.nama,
    usia: anggota.usia,
    jenisKelamin: anggota.jenisKelamin,
    keluargaId: keluarga.id,
    rw: keluarga.rw,
    followUpDari: 'Konsekuensi karma keluarga Prapto',
    konsekuensiKarma,
  })
  return {
    ...buatEncounter(pasien),
    fase: 'disposisi',
    ditanya: kasus.anamnesis.filter((q) => !q.distraktor).map((q) => q.id),
    vitalDiukur: true,
    diperiksa: kasus.pemeriksaanFisik.filter((p) => p.relevan).map((p) => p.region),
    labDipesan: kasus.lab.filter((l) => l.relevan).map((l) => l.id),
    labTersedia: kasus.lab.filter((l) => l.relevan).map((l) => l.id),
    diagnosis: { icd10: diagnosisBenar ? kasus.icd10 : 'A90', jenis: 'tegak' },
    resep: [
      ...kasus.tatalaksana.obatBenar,
      ...(kasus.tatalaksana.obatAlternatif ?? []).flatMap((grup) => (grup[0] ? [grup[0]] : [])),
    ],
    tindakan: kasus.tatalaksana.prosedur ?? [],
    edukasi: kasus.tatalaksana.edukasi.slice(0, 3),
    disposisi: 'pulang',
  }
}

function stateKarmaPrapto(encounter: EncounterState): GameState {
  const awal = buildInitialState('Uji', SEED, PACK)
  const keluarga = awal.desa.keluarga['keluarga_prapto']!
  return {
    ...awal,
    hari: 3,
    tutorialAktif: false,
    jadwal: awal.jadwal.filter((j) => j.keluargaId !== 'keluarga_prapto'),
    tally: { ...awal.tally, karmaTerjadi: 1 },
    desa: {
      ...awal.desa,
      binaan: [...new Set([...awal.desa.binaan, 'keluarga_prapto'])],
      keluarga: {
        ...awal.desa.keluarga,
        keluarga_prapto: { ...keluarga, arcIndex: 0, arcSelesai: 'gagal' },
      },
    },
    klinik: { ...awal.klinik, aktif: encounter, antrian: [] },
  }
}

describe('M1.1 — bridge bertingkat (partial menunda, gagal mempercepat)', () => {
  it('partial (hipotesis benar, intervensi salah) menunda karma +3 hari', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const jatuhTempoAwal = s.jadwal.find((j) => j.keluargaId === 'keluarga_wulan')!.hari
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'benar', intervensi: 'salah' })
    expect(s.hasilKunjunganHariIni?.tingkat).toBe('partial')
    const karma = s.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')
    expect(karma?.hari).toBe(jatuhTempoAwal + 3)
    expect(s.desa.keluarga['keluarga_wulan']?.karmaAktif?.jatuhTempoHari).toBe(jatuhTempoAwal + 3)
    expect(s.tally.karmaDicegah).toBe(0)
  })

  it('gagal total (hipotesis & intervensi salah) mempercepat karma −2 hari', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const jatuhTempoAwal = s.jadwal.find((j) => j.keluargaId === 'keluarga_wulan')!.hari
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'salah', intervensi: 'salah' })
    expect(s.hasilKunjunganHariIni?.tingkat).toBe('gagal')
    const karma = s.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')
    expect(karma?.hari).toBe(Math.max(s.hari + 1, jatuhTempoAwal - 2))
  })

  it('keberhasilan beat awal menunda karma sampai sesudah follow-up, bukan langsung menghapusnya', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'benar', intervensi: 'cocok' })
    expect(s.hasilKunjunganHariIni?.tingkat).toBe('berhasil')
    expect(s.desa.keluarga['keluarga_wulan']?.followUpHari).toBe(7)
    expect(
      s.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')?.hari,
    ).toBe(8)
    expect(s.tally.karmaDicegah).toBe(0)
  })

  it('follow-up tidak dapat dimainkan sebelum tanggal yang dijanjikan', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'benar', intervensi: 'cocok' })

    const terlaluAwal = advance(
      {
        ...s,
        hari: 6,
        blok: 'siang',
        stamina: 6,
        lapanganTerpakai: false,
        hasilKunjunganHariIni: undefined,
      },
      { type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_wulan' },
      PACK,
    )
    expect(terlaluAwal.state.kunjungan).toBeUndefined()
    expect(terlaluAwal.events).toContainEqual(
      expect.objectContaining({ type: 'ERROR_AKSI', pesan: expect.stringContaining('hari ke-7') }),
    )

    const tepatWaktu = advance(
      { ...terlaluAwal.state, hari: 7 },
      { type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_wulan' },
      PACK,
    )
    expect(tepatWaktu.state.kunjungan?.skenarioId).toBe('wulan_k2')
  })

  it('karma baru tercatat dicegah setelah outcome akhir terverifikasi', () => {
    const awal = buildInitialState('Uji', SEED, PACK)
    const keluargaId = 'keluarga_wulan'
    const kel = awal.desa.keluarga[keluargaId]!
    const hasil = advance(
      {
        ...awal,
        hari: 10,
        blok: 'sore',
        tutorialAktif: false,
        igd: undefined,
        klinik: { ...awal.klinik, antrian: [], aktif: undefined },
        jadwal: [
          {
            id: 'karma_wulan_setelah_verifikasi',
            hari: 12,
            jenis: 'karma_igd',
            keluargaId,
            kasusId: 'stroke_iskemik',
          },
          {
            id: 'verifikasi_wulan',
            hari: 11,
            jenis: 'verifikasi_pispk',
            keluargaId,
            indikatorJanji: ['hipertensi_berobat'],
          },
        ],
        desa: {
          ...awal.desa,
          keluarga: {
            ...awal.desa.keluarga,
            [keluargaId]: {
              ...kel,
              arcSelesai: 'berhasil',
              karmaAktif: { jadwalId: 'karma_wulan_setelah_verifikasi', jatuhTempoHari: 12 },
              indikator: {
                ...kel.indikator,
                hipertensi_berobat: {
                  status: 'ya',
                  statusSebenarnya: 'ya',
                  sumber: 'dokter',
                  hariData: 10,
                },
              },
            },
          },
        },
      },
      { type: 'LANJUTKAN' },
      PACK,
    )

    expect(hasil.state.hari).toBe(11)
    expect(hasil.state.jadwal.some((item) => item.jenis === 'karma_igd' && item.keluargaId === keluargaId)).toBe(false)
    expect(hasil.state.desa.keluarga[keluargaId]?.karmaAktif).toBeUndefined()
    expect(hasil.state.tally.karmaDicegah).toBe(awal.tally.karmaDicegah + 1)
    expect(hasil.events).toContainEqual(expect.objectContaining({ type: 'KARMA_DICEGAH' }))
  })
})

describe('B1.3 — klinik membuka pemulihan keluarga setelah karma', () => {
  it('penanganan A atas pasien karma membuka ulang beat UKM tanpa menghapus konsekuensi', () => {
    const awal = stateKarmaPrapto(encounterKarmaPrapto())
    const akhir = run(awal, { type: 'DISPOSISI', jenis: 'pulang' })

    expect(akhir.klinik.selesaiHariIni.at(-1)?.grade).toBe('A')
    expect(akhir.tally.karmaTerjadi).toBe(1)
    expect(akhir.tally.karmaDicegah).toBe(0)
    expect(akhir.desa.keluarga['keluarga_prapto']?.arcSelesai).toBeUndefined()
    expect(akhir.desa.keluarga['keluarga_prapto']?.arcIndex).toBe(0)
    expect(akhir.desa.keluarga['keluarga_prapto']?.followUpHari).toBe(4)
    expect(
      akhir.inbox.some(
        (surat) => surat.kaitKeluargaId === 'keluarga_prapto' && surat.judul.includes('Krisis akut tertangani'),
      ),
    ).toBe(true)

    const terlaluAwal = advance(
      { ...akhir, blok: 'siang', lapanganTerpakai: false, hasilKunjunganHariIni: undefined },
      { type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_prapto' },
      PACK,
    )
    expect(terlaluAwal.state.kunjungan).toBeUndefined()

    const siapPulih = {
      ...akhir,
      hari: 4,
      blok: 'siang' as const,
      lapanganTerpakai: false,
      hasilKunjunganHariIni: undefined,
    }
    const dibuka = run(
      siapPulih,
      { type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_prapto' },
    )
    expect(dibuka.kunjungan?.skenarioId).toBe('prapto_k1')

    const pulih = mainkanKunjungan(
      siapPulih,
      'keluarga_prapto',
      { hipotesis: 'benar', intervensi: 'cocok' },
    )
    const episodeKlinis = pulih.careEpisodes.find(
      (episode) => episode.familyId === 'keluarga_prapto' && episode.problemId === 'demam_tifoid',
    )
    expect(episodeKlinis?.status).toBe('terverifikasi')
    expect(episodeKlinis?.history.at(-1)?.label).toBe('Pemulihan keluarga menutup loop klinik')
  })

  it('kunjungan pemulihan hanya menutup episode klinis yang melahirkannya', () => {
    const akhir = run(stateKarmaPrapto(encounterKarmaPrapto()), { type: 'DISPOSISI', jenis: 'pulang' })
    const target = akhir.careEpisodes.find(
      (episode) => episode.familyId === 'keluarga_prapto' && episode.problemId === 'demam_tifoid',
    )!
    const episodeLain = {
      ...target,
      id: 'episode_keluarga_prapto_masalah_lain',
      problemId: 'masalah_lain',
      problemLabel: 'Masalah keluarga lain yang masih berjalan',
    }
    const pulih = mainkanKunjungan(
      {
        ...akhir,
        hari: 4,
        blok: 'siang',
        lapanganTerpakai: false,
        hasilKunjunganHariIni: undefined,
        careEpisodes: [...akhir.careEpisodes, episodeLain],
      },
      'keluarga_prapto',
      { hipotesis: 'benar', intervensi: 'cocok' },
    )

    expect(pulih.careEpisodes.find((episode) => episode.id === target.id)?.status).toBe('terverifikasi')
    expect(pulih.careEpisodes.find((episode) => episode.id === episodeLain.id)?.status).toBe(episodeLain.status)
  })

  it('follow-up generik atau penanganan di bawah A tidak memulihkan keluarga', () => {
    const generik = run(
      stateKarmaPrapto(encounterKarmaPrapto(true, false)),
      { type: 'DISPOSISI', jenis: 'pulang' },
    )
    expect(generik.klinik.selesaiHariIni.at(-1)?.grade).toBe('A')
    expect(generik.desa.keluarga['keluarga_prapto']?.arcSelesai).toBe('gagal')

    const salah = run(
      stateKarmaPrapto(encounterKarmaPrapto(false, true)),
      { type: 'DISPOSISI', jenis: 'pulang' },
    )
    expect(salah.klinik.selesaiHariIni.at(-1)?.grade).not.toBe('A')
    expect(salah.desa.keluarga['keluarga_prapto']?.arcSelesai).toBe('gagal')
  })
})

describe('M1.2 — surveilans balik UKP→UKM', () => {
  it('dua dengue dari RW sama dalam 14 hari = kluster + surat sinyal', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    // Suntik entri surveilans langsung (jalur DISPOSISI teruji di clinic.test) —
    // di sini yang diuji: deteksi kluster + surat + dedup flag.
    s = {
      ...s,
      desa: {
        ...s.desa,
        surveilans: [
          { hari: 1, rw: 4, kasusId: 'dengue_df' },
          { hari: 2, rw: 4, kasusId: 'dengue_df' },
        ],
      },
    }
    expect(clusterAktif(s, PACK)).toHaveLength(1)
    s = lewatiHari(s) // hariBaru mendeteksi & menyurati
    const suratKluster = s.inbox.filter((m) => m.judul.includes('SINYAL KLUSTER'))
    expect(suratKluster).toHaveLength(1)
    expect(suratKluster[0]!.judul).toContain('Demam')
    // Dedup: hari berikutnya tidak menyurati ulang kluster yang sama.
    s = lewatiHari(s)
    expect(s.inbox.filter((m) => m.judul.includes('SINYAL KLUSTER'))).toHaveLength(1)
  })

  it('entri kedaluwarsa (>14 hari) terpangkas — kluster padam', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = {
      ...s,
      desa: { ...s.desa, surveilans: [{ hari: 1, rw: 2, kasusId: 'dengue_df' }, { hari: 1, rw: 2, kasusId: 'dengue_df' }] },
    }
    s = sampaiHari(s, 16)
    expect(s.desa.surveilans).toHaveLength(0)
    expect(clusterAktif(s, PACK)).toHaveLength(0)
  })

  it('diagnosis menular di poli tercatat ke surveilans saat disposisi', () => {
    // tutorialAktif dimatikan: tes ini soal surveilans, bukan tutorial —
    // encounter tutorial (DeepThink "onboarding railroaded") sengaja kebal
    // skor/side-effect, akan mengacaukan pengecekan surveilans di bawah.
    let s = { ...buildInitialState('Uji', SEED, PACK), tutorialAktif: false }
    // Cari hari yang antriannya memuat kasus menular; mainkan minimal lalu pulangkan.
    for (let percobaan = 0; percobaan < 10; percobaan++) {
      const idx = s.klinik.antrian.findIndex((p) => PACK.kasus[p.kasusId] && ['dengue_df', 'diare_akut_anak', 'ispa_common_cold', 'demam_tifoid', 'skabies', 'konjungtivitis_bakterial', 'tb_paru'].includes(p.kasusId))
      if (idx === 0) {
        const pasien = s.klinik.antrian[0]!
        const kasus = PACK.kasus[pasien.kasusId]!
        s = run(s, { type: 'PANGGIL_PASIEN' })
        s = run(s, { type: 'LANJUT_FASE' }) // anamnesis → pemeriksaan
        s = run(s, { type: 'LANJUT_FASE' }) // pemeriksaan → diagnosis
        s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' }) // → terapi
        s = run(s, { type: 'LANJUT_FASE' }) // terapi → disposisi
        s = run(s, { type: 'DISPOSISI', jenis: kasus.harusDirujuk ? 'rujuk' : 'pulang' })
        expect(s.desa.surveilans.some((e) => e.kasusId === pasien.kasusId && e.rw === pasien.rw)).toBe(true)
        return
      }
      s = lewatiHari(s)
    }
    throw new Error('tidak menemukan kasus menular di antrian 10 hari — cek Director')
  })
})

describe('reducer — DISPOSISI phase-guard (CODEX audit 2026-07-04, temuan #2 §9)', () => {
  it('DISPOSISI ditolak bila fase belum disposisi, walau diagnosis sudah di-komit', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PANGGIL_PASIEN' })
    s = run(s, { type: 'LANJUT_FASE' }) // anamnesis → pemeriksaan
    s = run(s, { type: 'LANJUT_FASE' }) // pemeriksaan → diagnosis
    const kasus = PACK.kasus[s.klinik.aktif!.pasien.kasusId]!
    s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' }) // → terapi
    // Masih di fase terapi (belum LANJUT_FASE ke disposisi) — DISPOSISI harus ditolak.
    const sebelum = s
    s = run(s, { type: 'DISPOSISI', jenis: 'pulang' })
    expect(s.klinik.aktif).toBeDefined() // encounter belum selesai
    expect(s.klinik.selesaiHariIni).toEqual(sebelum.klinik.selesaiHariIni)
    expect(s.inbox).toEqual(sebelum.inbox)
  })

  // Audit CODEX 2026-07-04 (ronde-6): reducer men-cek `enc.labDipesan` (state
  // SEBELUM aksiKlinik) utk memutuskan billing/jadwal, bukan `hasil.enc`
  // (SESUDAH) — jadi PESAN_LAB yang ditolak phase-guard (fase bukan
  // pemeriksaan) tetap membakar kapitasi & membuat jadwal hasil lab, padahal
  // labDipesan sendiri tetap kosong. Efek tanpa sebab: pemain "didenda" utk
  // aksi yang menurut UI/engine tidak pernah terjadi.
  it('PESAN_LAB yang ditolak phase-guard TIDAK membakar kapitasi atau membuat jadwal', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PANGGIL_PASIEN' })
    expect(s.klinik.aktif!.fase).toBe('anamnesis') // belum ke pemeriksaan
    const kapitasiSebelum = s.kapitasi
    const jadwalSebelum = s.jadwal.length

    const { state: setelah, events } = advance(s, { type: 'PESAN_LAB', labId: 'hba1c' }, PACK)

    expect(events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    expect(setelah.klinik.aktif!.labDipesan).toEqual([])
    expect(setelah.kapitasi).toBe(kapitasiSebelum)
    expect(setelah.jadwal).toHaveLength(jadwalSebelum)
  })
})

describe('Fix #10 (audit CODEX 2026-07-11): MULAI_KUNJUNGAN wajib roster binaan', () => {
  it('kunjungan ke keluarga NON-roster ditolak, bukan diam-diam berjalan', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiHari(s, 3) // HARI_BUKA_KUNJUNGAN
    s = run(s, { type: 'LANJUTKAN' }) // pagi → siang
    expect(s.desa.binaan.includes('keluarga_santoso')).toBe(false)
    const sebelum = s
    s = run(s, { type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_santoso' })
    expect(s.kunjungan).toBeUndefined()
    expect(s.stamina).toBe(sebelum.stamina) // tak ada stamina terpakai
  })

  it('kunjungan ke keluarga yg SUDAH di-roster tetap bisa berjalan seperti biasa', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PILIH_BINAAN', keluargaId: 'keluarga_santoso' })
    s = sampaiHari(s, 3)
    s = run(s, { type: 'LANJUTKAN' }) // pagi → siang
    s = run(s, { type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_santoso' })
    expect(s.kunjungan).toBeDefined()
  })
})

describe('M1.3 — drift keluarga rawan (memburuk, bukan membaik)', () => {
  it('keluarga rawan ber-data yang diabaikan ≥7 hari memburuk + surat kader (cap 2/minggu)', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PILIH_BINAAN', keluargaId: 'keluarga_santoso' })
    // Santoso mulai di prekontemplasi dengan target TB masih "tidak". Setelah
    // pagar actionability, tak ada indikator "ya" yang sah untuk dijatuhkan.
    // Geser TTM agar tes ini tetap menguji drift neglect; pemilihan indikator
    // actionable dikunci terpisah di bridgeActionability.test.ts.
    const santoso = s.desa.keluarga['keluarga_santoso']!
    s = {
      ...s,
      desa: {
        ...s.desa,
        keluarga: {
          ...s.desa.keluarga,
          keluarga_santoso: { ...santoso, ttm: 'kontemplasi' },
        },
      },
    }
    // Jangan pernah kunjungi siapa pun; kader mengisi data; jalan sampai hari 14.
    s = sampaiHari(s, 14)
    const suratDrift = s.inbox.filter((m) => m.judul.includes('kabar kurang baik'))
    expect(suratDrift.length).toBeGreaterThanOrEqual(1)
    // Cap mingguan: tidak pernah lebih dari 2 kejadian dalam pekan berjalan.
    expect(s.desa.drift.jumlah).toBeLessThanOrEqual(2)
  })
})

describe('M1.4 — follow-up berkalender', () => {
  it('kunjungan berhasil membuat janji follow-up; mangkir → jadi rawan, PERSIST (bukan sekali-tembak-lupa), akhirnya mundur via drift (Fix #13, audit CODEX 2026-07-11)', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    // Isolasi mekanik drift dari jalur karma Wulan. Jalur karma ketika
    // follow-up mangkir diuji tersendiri di blok M1.1 di atas.
    const wulanAwal = s.desa.keluarga['keluarga_wulan']!
    const { karmaAktif: _karma, ...wulanTanpaKarma } = wulanAwal
    s = {
      ...s,
      jadwal: s.jadwal.filter((j) => !(j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')),
      desa: {
        ...s.desa,
        keluarga: { ...s.desa.keluarga, keluarga_wulan: wulanTanpaKarma },
      },
    }
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'benar', intervensi: 'cocok' })
    const kel = s.desa.keluarga['keluarga_wulan']!
    expect(kel.ttm).toBe('kontemplasi')
    expect(kel.followUpHari).toBe(3 + 4)
    // Mangkir: biarkan lewat jatuh tempo + 1. Sebelum fix #13, followUpHari
    // dihapus sekali-tembak di sini dan TTM mundur deterministik hari ini
    // juga. Sesudah fix #13: janji TETAP ADA (jadi keluarga 'rawan' yg terus
    // di-roll drift mingguan), tak diampuni begitu terlewat sekali.
    s = sampaiHari(s, 9)
    let kelSesudah = s.desa.keluarga['keluarga_wulan']!
    expect(kelSesudah.followUpHari).toBe(7)
    // Beri cukup hari utk roll drift (35%/hari, cap 2/minggu bersama keluarga
    // rawan lain) benar2 kena — jendela lebar drpd pin 1 hari pasti (stokastik).
    s = sampaiHari(s, 60)
    kelSesudah = s.desa.keluarga['keluarga_wulan']!
    expect(kelSesudah.ttm).toBe('prekontemplasi')
    expect(s.inbox.some((m) => m.judul.includes('kabar kurang baik'))).toBe(true)
  })
})

describe('M1.5 — KBK kapitasi bulanan', () => {
  it('hari 31: kapitasi masuk dengan pengali KBK + surat BPJS', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const kapitasiSebelum = () => s.kapitasi
    const sebelum = kapitasiSebelum()
    s = sampaiHari(s, 31)
    const suratKbk = s.inbox.filter((m) => m.dari === 'BPJS Kesehatan')
    expect(suratKbk).toHaveLength(1)
    expect(suratKbk[0]!.judul).toContain('Kapitasi bulan ini')
    // Kapitasi bertambah minimal 6jt×0.8 (pengali terburuk) MINUS operasional
    // bulanan M4.19 (2,5jt) — laporan bulanan kini satu paket dengan gajian KBK.
    expect(s.kapitasi).toBeGreaterThanOrEqual(sebelum + 4_800_000 - 2_500_000)
    expect(s.inbox.some((m) => m.judul.includes('Laporan keuangan bulanan'))).toBe(true)
  })
})

describe('M1.6 — SDOH armor', () => {
  it('keluarga miskin + hipotesis salah → kenaikan trust dipangkas setengah', () => {
    // keluarga_ketut: ekonomi miskin (RW 7 terpencil — butuh 2 stamina).
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiSiang(s, 3)
    const trustAwal = s.desa.keluarga['keluarga_ketut']!.trust
    s = mainkanKunjungan(s, 'keluarga_ketut', { hipotesis: 'salah', intervensi: 'cocok' })
    const hasil = s.hasilKunjunganHariIni!
    expect(hasil.armorAktif).toBe(true)
    // Delta yang diterapkan = floor(deltaMentah/2) — verifikasi via trust akhir.
    const trustAkhir = s.desa.keluarga['keluarga_ketut']!.trust
    expect(trustAkhir - trustAwal).toBe(hasil.trustDelta)
    expect(hasil.trustDelta).toBeLessThanOrEqual(5) // dipangkas dari delta penuh pilihan tepat semua
  })

  it('hipotesis benar menembus armor (trust penuh)', () => {
    let s1 = buildInitialState('Uji', SEED, PACK)
    s1 = sampaiSiang(s1, 3)
    s1 = mainkanKunjungan(s1, 'keluarga_ketut', { hipotesis: 'benar', intervensi: 'cocok' })
    expect(s1.hasilKunjunganHariIni!.armorAktif).toBeUndefined()
  })
})
