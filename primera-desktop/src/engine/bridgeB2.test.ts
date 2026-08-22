import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { Action } from './actions'
import { buatEncounter } from './clinic'
import { Rng } from './core/rng'
import { buatPasienDariKasus } from './director'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { deserialize, serialize } from './save'
import type { CareEpisodeLite, EncounterState, GameState } from './state'
import { buatEpisodeId, perbaruiEpisode, ringkasanEpisode } from './bridge'

function run(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

function episodeDasar(status: CareEpisodeLite['status'] = 'menunggu'): CareEpisodeLite {
  return {
    id: 'episode_uji',
    subjectId: 'warga_uji',
    subjectName: 'Ibu Uji',
    familyId: 'keluarga_wulan',
    rw: 2,
    source: 'keluarga',
    problemId: 'hipertensi',
    problemLabel: 'Tekanan darah belum terkontrol',
    owner: 'dokter',
    status,
    openedDay: 3,
    updatedDay: 5,
    dueDay: 7,
    nextAction: 'Kontrol tekanan darah.',
    receipt: {
      signal: 'Kader menemukan tekanan darah tinggi.',
      decision: 'Evaluasi di poli FKTP.',
      next: 'Kontrol tekanan darah.',
    },
    history: [{ hari: 3, status: 'terdeteksi', label: 'Terdeteksi', detail: 'Data kader masuk.' }],
  }
}

function encounterApendisitis(seed: number): EncounterState {
  const kasus = PACK.kasus['apendisitis_akut']!
  const pasien = buatPasienDariKasus(kasus.id, PACK, new Rng(seed, 'bridge-b2-pasien'), {
    nama: 'Bima',
    usia: 24,
    jenisKelamin: 'L',
    rw: 2,
    keluargaId: 'keluarga_wulan',
  })
  return {
    ...buatEncounter(pasien),
    fase: 'disposisi',
    ditanya: kasus.anamnesis.filter((item) => !item.distraktor).map((item) => item.id),
    vitalDiukur: true,
    diperiksa: kasus.pemeriksaanFisik.filter((item) => item.relevan).map((item) => item.region),
    labDipesan: kasus.lab.filter((item) => item.relevan).map((item) => item.id),
    labTersedia: kasus.lab.filter((item) => item.relevan).map((item) => item.id),
    diagnosis: { icd10: kasus.icd10, jenis: 'tegak' },
    resep: (kasus.tatalaksana.obatAlternatif ?? []).flatMap((grup) => (grup[0] ? [grup[0]] : [])),
    tindakan: kasus.tatalaksana.prosedur ?? [],
    edukasi: kasus.tatalaksana.edukasi,
    disposisi: 'rujuk',
  }
}

function rujukanDiterima(): GameState {
  for (let seed = 1; seed <= 40; seed++) {
    const awal = buildInitialState('Uji Bridge B2', seed, PACK)
    const hasil = run(
      {
        ...awal,
        hari: 20,
        tutorialAktif: false,
        klinik: { ...awal.klinik, antrian: [], aktif: encounterApendisitis(seed) },
      },
      {
        type: 'DISPOSISI',
        jenis: 'rujuk',
        rumahSakitId: 'rsud_provinsi',
        sbar: {
          situation: 'Nyeri kuadran kanan bawah akut dengan tanda rangsang peritoneal.',
          background: 'Nyeri berpindah, anoreksia, demam, dan muntah sejak satu hari.',
          assessment: 'Suspek apendisitis akut yang membutuhkan evaluasi bedah segera.',
          recommendation: 'Mohon terima untuk penilaian bedah dan terapi definitif segera.',
        },
      },
    )
    if (hasil.jadwal.some((item) => item.jenis === 'rujukan_feedback')) return hasil
  }
  throw new Error('Fixture gagal menemukan seed rujukan dengan bed tersedia.')
}

describe('Bridge B2 - continuity ledger lintas UKM, UKP, dan RS', () => {
  it('upsert deterministik tidak menggandakan peristiwa identik dan mempertahankan identitas episode', () => {
    const id = buatEpisodeId('keluarga', 'Keluarga Wulan', 'Hipertensi')
    const update = {
      id,
      day: 4,
      subjectId: 'wulan',
      subjectName: 'Ibu Wulan',
      familyId: 'keluarga_wulan',
      rw: 2,
      source: 'keluarga' as const,
      problemId: 'hipertensi',
      problemLabel: 'Tekanan darah tinggi',
      owner: 'dokter' as const,
      status: 'ditindaklanjuti' as const,
      signal: 'Kader mengirim hasil tekanan darah tinggi.',
      decision: 'Evaluasi klinik dijadwalkan.',
      nextAction: 'Kontrol di poli.',
      dueDay: 6,
      eventLabel: 'Rencana dibuat',
      eventDetail: 'Kontrol poli hari 6.',
    }
    const sekali = perbaruiEpisode([], update)
    const duaKali = perbaruiEpisode(sekali, update)

    expect(id).toBe('episode_keluarga_keluarga_wulan_hipertensi')
    expect(duaKali).toHaveLength(1)
    expect(duaKali[0]?.history).toHaveLength(1)
    expect(duaKali[0]?.familyId).toBe('keluarga_wulan')
  })

  // Audit UKM 2026-08-22: test ini DULU mengunci perilaku yang keliru —
  // `expect(hasil).toHaveLength(120)` + `episode_119` lenyap. Penggusuran
  // record itulah yang membuat hitungan Jejak Perawatan menyusut diam-diam.
  // Sekarang yang digusur riwayatnya, bukan recordnya; prioritas "tenggat
  // terdekat" tetap dipegang, hanya arti slotnya yang berubah (slot detail).
  it('slot detail 120 diberikan ke tenggat terdekat; episode di luar slot kehilangan riwayat, BUKAN recordnya', () => {
    const episodes = Array.from({ length: 120 }, (_, index): CareEpisodeLite => ({
      ...episodeDasar(),
      id: `episode_${String(index).padStart(3, '0')}`,
      dueDay: index + 10,
      updatedDay: index,
      history: [
        { hari: 1, status: 'terdeteksi', label: 'Terdeteksi', detail: 'Sinyal awal masuk.' },
        { hari: 2, status: 'dinilai', label: 'Dinilai', detail: 'Dinilai di poli.' },
      ],
    }))
    const hasil = perbaruiEpisode(episodes, {
      id: 'episode_paling_mendesak',
      day: 20,
      subjectId: 'warga_mendesak',
      subjectName: 'Ibu Mendesak',
      source: 'klinik',
      problemId: 'kontrol_mendesak',
      problemLabel: 'Kontrol mendesak',
      owner: 'dokter',
      status: 'menunggu',
      signal: 'Tenggat klinis paling dekat.',
      nextAction: 'Tindak lanjuti hari ini.',
      dueDay: 1,
      eventLabel: 'Terdeteksi',
      eventDetail: 'Episode mendesak masuk ke ledger penuh.',
    })

    expect(hasil).toHaveLength(121)
    expect(hasil.some((episode) => episode.id === 'episode_paling_mendesak')).toBe(true)
    // Record paling tidak mendesak TETAP ada — dulu ia dibuang begitu saja.
    expect(hasil.some((episode) => episode.id === 'episode_119')).toBe(true)
    // ...hanya riwayatnya yang dirampingkan ke peristiwa terakhir.
    expect(hasil.find((episode) => episode.id === 'episode_119')?.history).toEqual([
      { hari: 2, status: 'dinilai', label: 'Dinilai', detail: 'Dinilai di poli.' },
    ])
    // Yang masih di dalam slot detail utuh riwayatnya.
    expect(hasil.find((episode) => episode.id === 'episode_000')?.history).toHaveLength(2)
    // Worklist tidak berkurang satu pun.
    expect(ringkasanEpisode(hasil, 20).active).toBe(121)
  })

  // Audit UKM 2026-08-22 (bukti: bridge.ts penggusuran kapasitas vs
  // ringkasanEpisode). Ini regresi inti temuan: kapasitas tidak boleh
  // mencabut kerja yang sudah pemain selesaikan.
  it('audit UKM 2026-08-22: hitungan tuntas tidak menyusut saat ledger melewati kapasitas', () => {
    const tuntas = Array.from({ length: 118 }, (_, index): CareEpisodeLite => ({
      ...episodeDasar('terverifikasi'),
      id: `episode_tuntas_${String(index).padStart(3, '0')}`,
      dueDay: undefined,
      updatedDay: index + 1,
    }))
    const aktif = Array.from({ length: 3 }, (_, index): CareEpisodeLite => ({
      ...episodeDasar('menunggu'),
      id: `episode_aktif_${index}`,
      dueDay: 200 + index,
      updatedDay: 150,
    }))
    const ledgerAwal = [...tuntas, ...aktif]
    const sebelum = ringkasanEpisode(ledgerAwal, 160)

    const hasil = perbaruiEpisode(ledgerAwal, {
      id: 'episode_aktif_baru',
      day: 160,
      subjectId: 'warga_baru',
      subjectName: 'Pak Baru',
      source: 'klinik',
      problemId: 'kontrol_baru',
      problemLabel: 'Kontrol baru',
      owner: 'dokter',
      status: 'menunggu',
      signal: 'Kasus baru masuk saat ledger sudah penuh.',
      nextAction: 'Jadwalkan kontrol.',
      dueDay: 165,
      eventLabel: 'Terdeteksi',
      eventDetail: 'Episode ke-122.',
    })
    const sesudah = ringkasanEpisode(hasil, 160)

    expect(hasil).toHaveLength(122)
    expect(sesudah.verified).toBe(sebelum.verified) // 118, dulu turun jadi ≤116
    expect(sesudah.closed).toBe(sebelum.closed)
    expect(sesudah.adverse).toBe(sebelum.adverse)
    expect(sesudah.active).toBe(sebelum.active + 1)
  })

  it('audit UKM 2026-08-22: 400 episode tuntas berturut-turut tetap terhitung 400', () => {
    let ledger: CareEpisodeLite[] = []
    for (let index = 0; index < 400; index++) {
      ledger = perbaruiEpisode(ledger, {
        id: `episode_panen_${String(index).padStart(3, '0')}`,
        day: 10 + index,
        subjectId: `warga_${index}`,
        subjectName: `Warga ${index}`,
        source: 'klinik',
        problemId: 'kontrol_rutin',
        problemLabel: 'Kontrol rutin',
        owner: 'dokter',
        status: 'terverifikasi',
        signal: 'Kasus ditutup dengan verifikasi hasil.',
        nextAction: 'Selesai.',
        eventLabel: 'Terverifikasi',
        eventDetail: 'Hasil diverifikasi dokter.',
      })
    }
    const ringkasan = ringkasanEpisode(ledger, 500)

    // Satu stase karier (90 hari) wajar memanen ratusan episode; dulu angka
    // ini mentok di sisa slot 120 dan terus mundur setiap episode baru.
    expect(ledger).toHaveLength(400)
    expect(ringkasan.verified).toBe(400)
    expect(ringkasan.closureRate).toBe(1)
    expect(ledger.some((episode) => episode.id === 'episode_panen_000')).toBe(true)
  })

  it('plafon arsip 900 tetap jadi rem memori, dan yang jatuh adalah ekor paling basi', () => {
    const episodes = Array.from({ length: 900 }, (_, index): CareEpisodeLite => ({
      ...episodeDasar('terverifikasi'),
      id: `episode_arsip_${String(index).padStart(3, '0')}`,
      dueDay: undefined,
      updatedDay: index + 1, // index 0 = paling lama tak tersentuh
    }))
    const hasil = perbaruiEpisode(episodes, {
      id: 'episode_arsip_baru',
      day: 950,
      subjectId: 'warga_lewat_plafon',
      subjectName: 'Warga Lewat Plafon',
      source: 'klinik',
      problemId: 'kontrol_rutin',
      problemLabel: 'Kontrol rutin',
      owner: 'dokter',
      status: 'menunggu',
      signal: 'Record ke-901.',
      nextAction: 'Tindak lanjuti.',
      eventLabel: 'Terdeteksi',
      eventDetail: 'Melewati plafon arsip.',
    })

    expect(hasil).toHaveLength(900)
    expect(hasil.some((episode) => episode.id === 'episode_arsip_baru')).toBe(true)
    expect(hasil.some((episode) => episode.id === 'episode_arsip_000')).toBe(false)
    expect(hasil.some((episode) => episode.id === 'episode_arsip_001')).toBe(true)
  })

  it('ringkasan memakai hari permainan untuk mendeteksi overdue dan memisahkan verifikasi dari hasil buruk', () => {
    const active = episodeDasar('menunggu')
    const verified = { ...episodeDasar('terverifikasi'), id: 'episode_selesai', dueDay: undefined }
    const adverse = { ...episodeDasar('berakhir'), id: 'episode_buruk', dueDay: undefined }
    const ringkasan = ringkasanEpisode([active, verified, adverse], 10)

    expect(ringkasan).toEqual({
      active: 1,
      closed: 2,
      verified: 1,
      adverse: 1,
      overdue: 1,
      closureRate: 1 / 3,
    })
  })

  it('rujukan akut menutup loop hanya setelah feedback RS dibaca dan diadopsi FKTP', () => {
    let state = rujukanDiterima()
    const jadwal = state.jadwal.find((item) => item.jenis === 'rujukan_feedback')!
    const episodeId = jadwal.episodeId!
    const sebelumFeedback = state.careEpisodes.find((episode) => episode.id === episodeId)!

    expect(sebelumFeedback.referral?.stage).toBe('accepted')
    expect(sebelumFeedback.status).toBe('dirujuk')

    state = run(
      {
        ...state,
        blok: 'sore',
        igd: undefined,
        igdHariIni: false,
        klinik: { ...state.klinik, aktif: undefined, antrian: [] },
        jadwal: state.jadwal.map((item) => item.id === jadwal.id ? { ...item, hari: state.hari + 1 } : item),
      },
      { type: 'LANJUTKAN' },
    )
    const surat = state.inbox.find((item) => item.episodeId === episodeId)!
    const menungguAksi = state.careEpisodes.find((episode) => episode.id === episodeId)!

    expect(surat.judul).toContain('Umpan balik rujukan')
    expect(menungguAksi.referral?.stage).toBe('feedback')
    expect(menungguAksi.status).toBe('kembali')

    state = run(state, { type: 'BACA_SURAT', suratId: surat.id })
    const baruDibaca = state.careEpisodes.find((episode) => episode.id === episodeId)!
    expect(baruDibaca.referral?.stage).toBe('feedback')
    expect(baruDibaca.status).toBe('kembali')

    const ditolak = advance(
      state,
      { type: 'ADOPSI_UMPAN_BALIK', suratId: surat.id, langkah: ['rekonsiliasi', 'kontrol'] },
      PACK,
    )
    expect(ditolak.state.careEpisodes).toEqual(state.careEpisodes)
    expect(ditolak.events.at(-1)).toMatchObject({ type: 'ERROR_AKSI' })

    state = run(state, {
      type: 'ADOPSI_UMPAN_BALIK',
      suratId: surat.id,
      langkah: ['rekonsiliasi', 'kontrol', 'pemantauan_keluarga'],
    })
    const tertutup = state.careEpisodes.find((episode) => episode.id === episodeId)!
    expect(tertutup.referral?.stage).toBe('acted')
    expect(tertutup.status).toBe('terverifikasi')
    expect(tertutup.receipt.feedback).toContain('menyelesaikan pelayanan')
    expect(tertutup.receipt.decision).toContain('rekonsiliasi terapi')
    expect(tertutup.history.map((item) => item.status)).toContain('kembali')
    expect(tertutup.history.at(-1)?.status).toBe('terverifikasi')
  })

  it('save lama tanpa ledger dimigrasikan ke array kosong; entri valid bertahan round-trip', () => {
    const awal = buildInitialState('Uji Save Bridge', 9090, PACK)
    const raw = JSON.parse(serialize(awal)) as { state: Record<string, unknown> }
    delete raw.state['careEpisodes']
    const legacy = deserialize(JSON.stringify(raw), PACK)
    expect(legacy?.careEpisodes).toEqual([])

    const state: GameState = { ...awal, careEpisodes: [episodeDasar()] }
    expect(deserialize(serialize(state), PACK)?.careEpisodes).toEqual(state.careEpisodes)
  })

  it('impor save menyaring episode palsu dan riwayat korup sebelum mencapai UI', () => {
    const awal = buildInitialState('Uji Save Korup', 9191, PACK)
    const raw = JSON.parse(serialize(awal)) as { state: Record<string, unknown> }
    raw.state['careEpisodes'] = [
      {
        ...episodeDasar(),
        history: [null, episodeDasar().history[0], { hari: 'besok', status: 'asing' }],
      },
      { ...episodeDasar(), id: 'episode_palsu', source: 'media_sosial' },
    ]

    const hasil = deserialize(JSON.stringify(raw), PACK)!
    expect(hasil.careEpisodes).toHaveLength(1)
    expect(hasil.careEpisodes[0]?.id).toBe('episode_uji')
    expect(hasil.careEpisodes[0]?.history).toHaveLength(1)
  })
})
