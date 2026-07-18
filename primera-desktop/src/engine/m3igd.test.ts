/**
 * M3.14 — IGD turn-based: stabilitas, Kode Biru/RJP, disposisi, scoring.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState, IgdState } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { buildInitialState } from './init'
import { hitungSkor } from './scoring'
import { serialize, deserialize } from './save'

function base(igd?: IgdState): GameState {
  const s = buildInitialState('Uji', 7, PACK)
  return igd ? { ...s, igd, layar: 'igd' } : s
}
function run(s: GameState, a: Action): GameState {
  return advance(s, a, PACK).state
}
function igdKasus(kasusId: string, stabilitas = 50): IgdState {
  return {
    kasusId, pasienNama: 'Pak Uji', usia: 40, jenisKelamin: 'L', rw: 3,
    fase: 'langkah', langkahIndex: 0, stabilitas, jawaban: [],
  }
}

const KASUS = 'igd_syok_anafilaksis'

describe('M3.14 — alur IGD', () => {
  it('jawaban benar menstabilkan; tuntas semua langkah → fase disposisi', () => {
    let s = base(igdKasus(KASUS))
    const kasus = PACK.kasusIgd[KASUS]!
    for (const langkah of kasus.langkah) {
      const benar = langkah.pilihan.find((p) => p.benar)!
      s = run(s, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: benar.id })
    }
    expect(s.igd?.fase).toBe('disposisi')
    expect(s.igd!.stabilitas).toBeGreaterThan(50)
  })

  it('disposisi benar (rujuk pada kasus wajib-rujuk) → tally igdStabil + surat pujian', () => {
    let s = base(igdKasus(KASUS))
    const kasus = PACK.kasusIgd[KASUS]!
    for (const l of kasus.langkah) s = run(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: l.pilihan.find((p) => p.benar)!.id })
    s = run(s, { type: 'DISPOSISI_IGD', jenis: 'rujuk' })
    expect(s.tally.igdStabil).toBe(1)
    expect(s.igd).toBeUndefined()
    expect(s.inbox.some((m) => m.dari.includes('Harsono') && m.jenis === 'pujian_kapus')).toBe(true)
    expect(s.inbox.at(-1)?.kaitKasusIgdId).toBe(KASUS)
  })

  it('disposisi KELIRU (pulang pada kasus wajib-rujuk) → igdSalahDisposisi, BUKAN igdStabil, dan tak dihargai skor', () => {
    let s = base(igdKasus(KASUS))
    const kasus = PACK.kasusIgd[KASUS]!
    for (const l of kasus.langkah) s = run(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: l.pilihan.find((p) => p.benar)!.id })
    expect(kasus.disposisiBenar).toBe('rujuk')
    s = run(s, { type: 'DISPOSISI_IGD', jenis: 'pulang' })
    expect(s.tally.igdStabil).toBe(0)
    expect(s.tally.igdSalahDisposisi).toBe(1)
    expect(s.inbox.some((m) => m.dari.includes('Harsono') && m.jenis === 'teguran_kapus')).toBe(true)
    const skorTepat = hitungSkor({ ...s, tally: { ...s.tally, totalPasien: 4, diagnosisBenar: 4, tegakBenar: 4, igdStabil: 1, igdSalahDisposisi: 0 } })
    const skorKeliru = hitungSkor({ ...s, tally: { ...s.tally, totalPasien: 4, diagnosisBenar: 4, tegakBenar: 4, igdStabil: 0, igdSalahDisposisi: 1 } })
    expect(skorKeliru.ukp).toBeLessThan(skorTepat.ukp)
  })

  it('pilihan salah beruntun → stabilitas habis → Kode Biru', () => {
    // Mulai stabilitas rendah agar 1-2 kesalahan cukup.
    let s = base(igdKasus(KASUS, 20))
    const kasus = PACK.kasusIgd[KASUS]!
    const l0 = kasus.langkah[0]!
    const salah = l0.pilihan.find((p) => !p.benar)!
    s = run(s, { type: 'AKSI_IGD', langkahId: l0.id, pilihanId: salah.id })
    expect(s.igd?.fase).toBe('kode_biru')
  })

  it('M10.5 #14: RJP DETERMINISTIK — berkualitas SELALU ROSC (stabilitas 25), buruk SELALU Kode Hitam', () => {
    let s: GameState = base(igdKasus(KASUS, 10))
    const l0 = PACK.kasusIgd[KASUS]!.langkah[0]!
    const salah = l0.pilihan.find((p) => !p.benar)!
    s = run(s, { type: 'AKSI_IGD', langkahId: l0.id, pilihanId: salah.id })
    expect(s.igd?.fase).toBe('kode_biru')

    // CODEX fix #2 (2026-07-13, temuan #2): ROSC kini singgah di 'pasca_rosc'
    // (bukan langsung 'disposisi') — titik keputusan stabilisasi-lanjutan
    // yang dulu dijanjikan komentar kode tapi tak pernah dibangun.
    const sSukses = run({ ...s }, { type: 'RJP_IGD', berkualitas: true })
    expect(sSukses.igd?.fase).toBe('pasca_rosc')
    expect(sSukses.igd?.stabilitas).toBe(25)

    const sBuruk = run({ ...s }, { type: 'RJP_IGD', berkualitas: false })
    expect(sBuruk.tally.igdMeninggal).toBe(1)
    expect(sBuruk.igd).toBeUndefined()
    expect(sBuruk.inbox.some((m) => m.judul.includes('KODE HITAM'))).toBe(true)
    expect(sBuruk.inbox.at(-1)?.kaitKasusIgdId).toBe(KASUS)
    expect(sBuruk.burnout).toBeGreaterThan(0)
  })

  describe('M10.5 Q4/Q-E — rujuk prematur (stabilitas<50) setara Kode Hitam', () => {
    // CODEX audit (2026-07-12, temuan #2): dulu ROSC → SEGERA disposisi, jadi
    // rujukan BENAR (disposisiBenar SEMUA kasus IGD='rujuk') SELALU mati
    // dalam perjalanan — dead-end deterministik tanpa jalur selamat. Kini ada
    // titik keputusan 'pasca_rosc' (stabilisasiLanjutanIgd): skip stabilisasi
    // (langsung_rujuk) mempertahankan risiko lama; stabilisasi benar
    // (ulang_abcde) membuka jalur selamat yang dulu tak eksis sama sekali.
    it('ROSC lalu SKIP stabilisasi lanjutan (langsung_rujuk) → rujuk prematur, memburuk (igdMeninggal)', () => {
      let s: GameState = base(igdKasus(KASUS, 10))
      const l0 = PACK.kasusIgd[KASUS]!.langkah[0]!
      const salah = l0.pilihan.find((p) => !p.benar)!
      s = run(s, { type: 'AKSI_IGD', langkahId: l0.id, pilihanId: salah.id })
      s = run(s, { type: 'RJP_IGD', berkualitas: true })
      expect(s.igd?.fase).toBe('pasca_rosc')
      expect(s.igd?.stabilitas).toBe(25)

      s = run(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'langsung_rujuk' })
      expect(s.igd?.fase).toBe('disposisi')
      expect(s.igd?.stabilitas).toBe(25) // TAK naik — skip stabilisasi lanjutan

      s = run(s, { type: 'DISPOSISI_IGD', jenis: 'rujuk' })
      expect(s.tally.igdMeninggal).toBe(1)
      expect(s.tally.igdStabil).toBe(0)
      expect(s.tally.igdSalahDisposisi).toBe(0)
      expect(s.igd).toBeUndefined()
      expect(s.inbox.some((m) => m.judul.includes('KODE HITAM') && m.judul.includes('perjalanan'))).toBe(true)
    })

    it('ROSC lalu stabilisasi lanjutan BENAR (ulang_abcde) → stabilitas naik ≥ambang → rujuk SELAMAT (igdStabil)', () => {
      let s: GameState = base(igdKasus(KASUS, 10))
      const l0 = PACK.kasusIgd[KASUS]!.langkah[0]!
      const salah = l0.pilihan.find((p) => !p.benar)!
      s = run(s, { type: 'AKSI_IGD', langkahId: l0.id, pilihanId: salah.id })
      s = run(s, { type: 'RJP_IGD', berkualitas: true })
      expect(s.igd?.stabilitas).toBe(25)

      s = run(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
      expect(s.igd?.fase).toBe('disposisi')
      expect(s.igd?.stabilitas).toBe(55) // 25+30, melewati AMBANG_STABIL_RUJUK=50

      s = run(s, { type: 'DISPOSISI_IGD', jenis: 'rujuk' })
      expect(s.tally.igdMeninggal).toBe(0)
      expect(s.tally.igdStabil).toBe(1)
      expect(s.igd).toBeUndefined()
      expect(s.inbox.some((m) => m.judul.includes('DITERIMA') || m.dari.includes('Harsono'))).toBe(true)
    })

    it('stabilitas ≥ ambang (50) DAN dirujuk pada kasus wajib-rujuk → tetap igdStabil seperti biasa (tanpa Kode Biru)', () => {
      let s = base(igdKasus(KASUS))
      const kasus = PACK.kasusIgd[KASUS]!
      for (const l of kasus.langkah) s = run(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: l.pilihan.find((p) => p.benar)!.id })
      expect(s.igd!.stabilitas).toBeGreaterThanOrEqual(50)
      s = run(s, { type: 'DISPOSISI_IGD', jenis: 'rujuk' })
      expect(s.tally.igdStabil).toBe(1)
      expect(s.tally.igdMeninggal).toBe(0)
    })

    it('STABILISASI_LANJUTAN_IGD di luar fase pasca_rosc ditolak — tak bisa dipanggil sembarang waktu', () => {
      const s = base(igdKasus(KASUS)) // fase 'langkah', bukan 'pasca_rosc'
      const hasil = advance(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' }, PACK)
      expect(hasil.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
      expect(hasil.state.igd?.fase).toBe('langkah') // tak berubah
    })
  })

  it('Kode Hitam menggerus UKP; pasien stabil memberi bonus kecil', () => {
    const sHitam = base()
    const skorHitam = hitungSkor({ ...sHitam, tally: { ...sHitam.tally, totalPasien: 4, diagnosisBenar: 4, tegakBenar: 4, igdMeninggal: 1 } })
    const skorStabil = hitungSkor({ ...sHitam, tally: { ...sHitam.tally, totalPasien: 4, diagnosisBenar: 4, tegakBenar: 4, igdStabil: 2 } })
    expect(skorStabil.ukp).toBeGreaterThan(skorHitam.ukp)
  })

  it('IGD memblokir LANJUTKAN & PANGGIL_PASIEN sampai selesai', () => {
    const s = base(igdKasus(KASUS))
    expect(advance(s, { type: 'LANJUTKAN' }, PACK).events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    expect(advance(s, { type: 'PANGGIL_PASIEN' }, PACK).events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
  })

  it('save dgn IGD berkasus tak dikenal (CODEX P2) → dipulihkan via pack, bukan macet permanen', () => {
    const s = base(igdKasus('kasus_igd_yang_sudah_dihapus'))
    const json = serialize(s)
    // Tanpa pack: perilaku lama dipertahankan (tidak menyentuh igd).
    expect(deserialize(json)?.igd?.kasusId).toBe('kasus_igd_yang_sudah_dihapus')
    // Dengan pack: IGD tak dikenal dibersihkan + surat kompensasi ditambahkan.
    const pulih = deserialize(json, PACK)
    expect(pulih?.igd).toBeUndefined()
    expect(pulih?.inbox.some((m) => m.jenis === 'sistem' && m.judul.includes('dipulihkan'))).toBe(true)
  })
})
