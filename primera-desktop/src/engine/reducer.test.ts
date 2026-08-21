/**
 * Penjaga aksi reducer di atas konten PRODUKSI (PACK): invarian fase IGD,
 * kelengkapan tujuan rujukan IGD, keutuhan identitas pasien terlantar, dan
 * pesan gerbang kegiatan yang mengikuti konstanta per mode.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState, IgdState, ModeStase } from './state'
import type { Action } from './actions'
import { advance, COOLDOWN_POSYANDU, HARI_BUKA_POSYANDU } from './reducer'
import { buildInitialState } from './init'
import { buatPasienDariKasus } from './director'
import { rumahSakitCocokUntukIgd } from './igd'
import { Rng } from './core/rng'

const SEED = 424242

function run(s: GameState, a: Action): GameState {
  return advance(s, a, PACK).state
}
function ev(s: GameState, a: Action) {
  return advance(s, a, PACK)
}
function pesanError(hasil: ReturnType<typeof advance>): string {
  const e = hasil.events.find((item) => item.type === 'ERROR_AKSI')
  return e && e.type === 'ERROR_AKSI' ? e.pesan : ''
}

/* ---------------------------------------------------------------------------
 * Identitas pasien yang dilewatkan di antrian pagi
 * ------------------------------------------------------------------------- */

const KASUS_BAYI = 'lab_bronkiolitis_berat'

describe('LANJUTKAN pagi — pasien yang dilewatkan kembali sebagai orang yang SAMA', () => {
  it('jadwal terlantar membawa usiaBulan, dan bayi yang kembali punya usia-bulan identik', () => {
    const kasus = PACK.kasus[KASUS_BAYI]
    expect(kasus?.konsekuensi).toBeDefined() // pra-syarat: kasus ini punya arc kembali
    const awal = buildInitialState('Uji', SEED, PACK)
    const antrian = Array.from({ length: 12 }, (_, i) =>
      buatPasienDariKasus(KASUS_BAYI, PACK, new Rng(SEED, 'antrian-uji', i)),
    )
    // Bayi 3-8 bulan: usia (tahun) selalu 0, jadi usiaBulan-lah satu-satunya
    // pembeda umur yang menentukan dosis & klasifikasi MTBS.
    expect(antrian.every((p) => p.usiaBulan !== undefined)).toBe(true)
    expect(new Set(antrian.map((p) => p.usiaBulan)).size).toBeGreaterThan(1)
    expect(new Set(antrian.map((p) => p.id)).size).toBe(antrian.length) // pencocokan di bawah tak ambigu

    let s: GameState = {
      ...awal,
      hari: 20,
      blok: 'pagi',
      burnout: 100, // pBermasalah 0.45 — pastikan undian "bermasalah" benar-benar kena
      klinik: { ...awal.klinik, antrian },
    }
    s = run(s, { type: 'LANJUTKAN' })
    const terlantar = s.jadwal.filter((j) => j.id.startsWith('jadwal_terlantar_'))
    expect(terlantar.length).toBeGreaterThan(0)
    for (const j of terlantar) {
      const asal = antrian.find((p) => p.id === j.pasienId)
      expect(asal).toBeDefined()
      expect(j.usiaBulan).toBe(asal!.usiaBulan)
    }

    // Jatuh tempo: bayi yang sama masuk antrian lagi — usia-bulannya tak boleh
    // di-roll ulang oleh buatPasienDariKasus.
    const jatuhTempo = Math.min(...terlantar.map((j) => j.hari))
    const kembaliHariItu = terlantar.filter((j) => j.hari === jatuhTempo)
    while (s.hari < jatuhTempo) {
      s = bereskanIgd(s)
      s = run(s, { type: 'LANJUTKAN' })
    }
    expect(s.hari).toBe(jatuhTempo)
    for (const j of kembaliHariItu) {
      const pasien = s.klinik.antrian.find((p) => p.id === j.pasienId)
      expect(pasien).toBeDefined()
      expect(pasien!.nama).toBe(j.nama)
      expect(pasien!.usiaBulan).toBe(j.usiaBulan)
    }
  })
})

/** IGD interrupt memblokir LANJUTKAN — tangani optimal bila muncul di tengah uji. */
function bereskanIgd(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[s.igd.kasusId]!
    if (s.igd.fase === 'langkah') {
      const l = kasus.langkah[s.igd.langkahIndex]!
      s = run(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id })
    } else if (s.igd.fase === 'kode_biru') s = run(s, { type: 'RJP_IGD', berkualitas: true })
    else if (s.igd.fase === 'pasca_rosc') s = run(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
    else if (s.igd.fase === 'disposisi') {
      const rs = PACK.rumahSakit.find((item) => rumahSakitCocokUntukIgd(kasus, item))
      s = run(s, {
        type: 'DISPOSISI_IGD',
        jenis: kasus.disposisiBenar,
        ...(rs && kasus.disposisiBenar === 'rujuk' ? { rumahSakitId: rs.id } : {}),
      })
    } else break
  }
  return s
}

/* ---------------------------------------------------------------------------
 * IGD — penjaga fase & kelengkapan tujuan rujukan
 * ------------------------------------------------------------------------- */

const KASUS_IGD = 'igd_syok_anafilaksis'
/** Kasus ber-spesialis 'saraf' — tak semua RS jejaring sanggup menerimanya. */
const KASUS_IGD_SARAF = 'igd_status_epileptikus'

function igdAktif(kasusId: string, over?: Partial<IgdState>): IgdState {
  return {
    kasusId,
    pasienNama: 'Pak Uji',
    usia: 40,
    jenisKelamin: 'L',
    rw: 3,
    fase: 'langkah',
    langkahIndex: 0,
    stabilitas: 50,
    jawaban: [],
    ...over,
  }
}
function stateIgd(igd: IgdState): GameState {
  return { ...buildInitialState('Uji', SEED, PACK), hari: 12, igd, layar: 'igd' }
}

describe('AKSI_IGD — penjaga fase menjaga tally Kode Biru jujur', () => {
  it('Kode Biru ditally SEKALI walau AKSI_IGD di-dispatch berulang sesudahnya', () => {
    const kasus = PACK.kasusIgd[KASUS_IGD]!
    const langkah = kasus.langkah[0]!
    const salah = langkah.pilihan.find((p) => !p.benar)!
    let s = stateIgd(igdAktif(KASUS_IGD, { stabilitas: 10 }))
    s = run(s, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: salah.id })
    expect(s.igd?.fase).toBe('kode_biru')
    expect(s.tally.igdKodeBiruTerjadi).toBe(1)

    // Dispatch ulang saat Kode Biru: dulu lolos ke gerbang tally dan
    // menghitung kejadian yang sama berkali-kali (-0.5 skor tiap kali).
    for (let i = 0; i < 3; i++) {
      const hasil = ev(s, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: salah.id })
      expect(hasil.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
      s = hasil.state
      expect(s.tally.igdKodeBiruTerjadi).toBe(1)
      expect(s.igd?.fase).toBe('kode_biru')
      expect(s.igd?.jawaban).toHaveLength(1)
    }
  })

  it('AKSI_IGD di fase disposisi ditolak — bukan no-op senyap', () => {
    const s = stateIgd(igdAktif(KASUS_IGD, { fase: 'disposisi', stabilitas: 70 }))
    const langkah = PACK.kasusIgd[KASUS_IGD]!.langkah[0]!
    const hasil = ev(s, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: langkah.pilihan[0]!.id })
    expect(hasil.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    expect(hasil.state.igd?.fase).toBe('disposisi')
  })
})

describe('DISPOSISI_IGD — rujukan tanpa tujuan bukan disposisi tepat', () => {
  const kasus = PACK.kasusIgd[KASUS_IGD]!
  /** IGD siap disposisi, stabilitas di atas ambang transportasi (bukan rujuk prematur). */
  const siapDisposisi = () => stateIgd(igdAktif(KASUS_IGD, { fase: 'disposisi', stabilitas: 70 }))

  it('rujuk ke RS jejaring yang sesuai → igdStabil + jadwal umpan balik menyebut RS-nya', () => {
    expect(kasus.disposisiBenar).toBe('rujuk')
    const rs = PACK.rumahSakit.find((item) => rumahSakitCocokUntukIgd(kasus, item))!
    const s = run(siapDisposisi(), { type: 'DISPOSISI_IGD', jenis: 'rujuk', rumahSakitId: rs.id })
    expect(s.tally.igdStabil).toBe(1)
    expect(s.tally.igdSalahDisposisi).toBe(0)
    const feedback = s.jadwal.find((j) => j.jenis === 'rujukan_feedback')
    expect(feedback?.rumahSakitId).toBe(rs.id)
    expect(s.inbox.at(-1)?.isi).toContain(rs.nama)
  })

  it('rujuk TANPA rumahSakitId tidak dihitung penuh — igdSalahDisposisi, surat menagih tujuan', () => {
    const s = run(siapDisposisi(), { type: 'DISPOSISI_IGD', jenis: 'rujuk' })
    expect(s.tally.igdStabil).toBe(0)
    expect(s.tally.igdSalahDisposisi).toBe(1)
    expect(s.tally.igdMeninggal).toBe(0) // kurva konsekuensi klinis tak tersentuh
    expect(s.jadwal.some((j) => j.jenis === 'rujukan_feedback')).toBe(false)
    const surat = s.inbox.at(-1)!
    expect(surat.isi).toContain('tanpa RS tujuan')
    // Tak boleh menamai RS yang tak pernah dipilih.
    expect(surat.isi).not.toContain('RS rujukan menyelesaikan')
    const episode = s.careEpisodes.at(-1)!
    expect(episode.referral?.hospitalName).toBeUndefined()
  })

  it('rujuk dengan id RS yang tak ada di jejaring juga tidak dihitung penuh', () => {
    const s = run(siapDisposisi(), { type: 'DISPOSISI_IGD', jenis: 'rujuk', rumahSakitId: 'rs_yang_tak_ada' })
    expect(s.tally.igdStabil).toBe(0)
    expect(s.tally.igdSalahDisposisi).toBe(1)
  })

  it('rujuk ke RS yang tak punya spesialisasi yang dibutuhkan tetap disposisi keliru', () => {
    const kasusSaraf = PACK.kasusIgd[KASUS_IGD_SARAF]
    expect(kasusSaraf).toBeDefined()
    const rsTakCocok = PACK.rumahSakit.find((item) => !rumahSakitCocokUntukIgd(kasusSaraf!, item))!
    const s = run(stateIgd(igdAktif(KASUS_IGD_SARAF, { fase: 'disposisi', stabilitas: 70 })), {
      type: 'DISPOSISI_IGD',
      jenis: 'rujuk',
      rumahSakitId: rsTakCocok.id,
    })
    expect(s.tally.igdStabil).toBe(0)
    expect(s.tally.igdSalahDisposisi).toBe(1)
    expect(s.inbox.at(-1)?.isi).toContain(rsTakCocok.nama)
  })

  it('pulang tetap dinilai tanpa syarat tujuan (tak terpengaruh penjaga rujukan)', () => {
    const s = run(siapDisposisi(), { type: 'DISPOSISI_IGD', jenis: 'pulang' })
    expect(s.tally.igdSalahDisposisi).toBe(1) // kasus ini wajib rujuk
    expect(s.tally.igdStabil).toBe(0)
  })
})

/* ---------------------------------------------------------------------------
 * Kedatangan IGD — gerbangnya flag `igdHari_*`, `igdHariIni` cuma penanda
 * ------------------------------------------------------------------------- */

/** Tidur dari sore hari `hari-1` ke pagi hari `hari`, dengan penanda yang diuji. */
function tidurKeHari(hari: number, opsi: { jedaFlagHari?: number; igdHariIni: boolean }): GameState {
  const awal = buildInitialState('Uji', SEED, PACK)
  return run(
    {
      ...awal,
      hari: hari - 1,
      blok: 'sore',
      igdHariIni: opsi.igdHariIni,
      flags: opsi.jedaFlagHari !== undefined ? { [`igdHari_${opsi.jedaFlagHari}`]: true } : {},
    },
    { type: 'LANJUTKAN' },
  )
}

describe('Kedatangan IGD — `igdHariIni` penanda hari, `igdHari_*` gerbangnya', () => {
  // Hari yang memang menghasilkan IGD pada seed ini — supaya perbandingan di
  // bawah bukan membandingkan dua hari yang sama-sama sepi.
  const hariIgd = (() => {
    for (let hari = 5; hari <= 40; hari++) if (tidurKeHari(hari, { igdHariIni: false }).igd) return hari
    return 0
  })()

  it('pra-syarat: ada hari dengan kedatangan IGD pada seed uji', () => {
    expect(hariIgd).toBeGreaterThan(0)
  })

  it('igdHariIni: true tidak menahan IGD berikutnya — nilainya ditulis ulang tiap hari baru', () => {
    const s = tidurKeHari(hariIgd, { igdHariIni: true })
    expect(s.igd).toBeDefined()
    expect(s.igdHariIni).toBe(true)
    expect(s.flags[`igdHari_${hariIgd}`]).toBe(true)
  })

  it('flag igdHari_* di dalam jendela jeda-lah yang menahan kedatangan', () => {
    const s = tidurKeHari(hariIgd, { jedaFlagHari: hariIgd - 1, igdHariIni: false })
    expect(s.igd).toBeUndefined()
    expect(s.igdHariIni).toBe(false)
  })
})

/* ---------------------------------------------------------------------------
 * Gerbang kegiatan — pesan mengikuti konstanta mode, bukan angka hardcode
 * ------------------------------------------------------------------------- */

function siangSiapKegiatan(mode: ModeStase, hari: number, posyanduTerakhir: number): GameState {
  const s = buildInitialState('Uji', SEED, PACK, { mode })
  return {
    ...s,
    hari,
    blok: 'siang',
    stamina: 6,
    lapanganTerpakai: false,
    posyanduRwTerakhir: { '1': posyanduTerakhir },
  }
}

describe('MULAI_POSYANDU — pesan cooldown menyebut jeda mode yang berlaku', () => {
  it('Karier: ditolak dengan jeda 30 hari', () => {
    const hari = HARI_BUKA_POSYANDU.karier + 5
    const hasil = ev(siangSiapKegiatan('karier', hari, hari - 2), { type: 'MULAI_POSYANDU', rw: 1 })
    expect(hasil.state.kegiatan).toBeUndefined()
    expect(pesanError(hasil)).toContain(`${COOLDOWN_POSYANDU.karier} hari`)
  })

  it('Ujian: ditolak dengan jeda 10 hari — bukan angka Karier yang 3x lipat', () => {
    const hari = HARI_BUKA_POSYANDU.ujian + 3
    const pesan = pesanError(ev(siangSiapKegiatan('ujian', hari, hari - 2), { type: 'MULAI_POSYANDU', rw: 1 }))
    expect(pesan).toContain(`${COOLDOWN_POSYANDU.ujian} hari`)
    expect(pesan).not.toContain('30 hari')
  })

  it('sesudah jeda mode terlampaui, Posyandu RW yang sama boleh digelar lagi', () => {
    const hari = HARI_BUKA_POSYANDU.ujian + COOLDOWN_POSYANDU.ujian
    const hasil = ev(siangSiapKegiatan('ujian', hari, hari - COOLDOWN_POSYANDU.ujian), { type: 'MULAI_POSYANDU', rw: 1 })
    expect(hasil.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
    expect(hasil.state.kegiatan?.jenis).toBe('posyandu')
  })
})
