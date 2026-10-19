import { beforeAll, describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import { advance } from '@engine/reducer'
import { skenarioEfektif } from '@engine/kunjungan'
import type { Action } from '@engine/actions'
import type { GameState } from '@engine/state'
import { isGayaTerlarang } from '@content/types'
import {
  CUPLIKAN_KOSONG,
  encounterDitutup,
  konsultasiPerEpisode,
  rekonstruksiJejak,
  turunkanCuplikan,
  type CuplikanUi,
} from './rekonstruksiJejak'

/**
 * Sesi "live" meniru store.dispatch: tiap aksi lewat advance() lalu cuplikan
 * diturunkan dengan aturan yang sama. Driver toleran (aksi ditolak diabaikan):
 * yang diuji kesetaraan replay, bukan kualitas permainan.
 */
class SesiLive {
  cuplikan: CuplikanUi = CUPLIKAN_KOSONG
  konsultasi = 0
  constructor(public s: GameState) {}
  main(action: Action): void {
    const { state, events } = advance(this.s, action, PACK)
    this.cuplikan = turunkanCuplikan(this.cuplikan, this.s, state, events, action)
    if (encounterDitutup(this.s, events, action)) this.konsultasi += 1
    this.s = state
  }
  beresIgd(): void {
    for (let guard = 0; this.s.igd && guard < 40; guard++) {
      const igd = this.s.igd
      const kasus = PACK.kasusIgd[igd.kasusId]!
      if (igd.fase === 'langkah') {
        const langkah = kasus.langkah[igd.langkahIndex]!
        const benar = langkah.pilihan.find((p) => p.benar) ?? langkah.pilihan[0]!
        this.main({ type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: benar.id })
      } else if (igd.fase === 'kode_biru') this.main({ type: 'RJP_IGD', berkualitas: true })
      else if (igd.fase === 'pasca_rosc') this.main({ type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
      else if (igd.fase === 'disposisi') this.main({ type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
      else break
    }
  }
  beresPagi(): void {
    for (let guard = 0; this.s.klinik.antrian.length > 0 && guard < 20; guard++) {
      this.main({ type: 'PANGGIL_PASIEN' })
      const enc = this.s.klinik.aktif
      if (!enc) break
      const kasus = PACK.kasus[enc.pasien.kasusId]!
      for (const q of kasus.anamnesis.slice(0, 3)) this.main({ type: 'TANYA', pertanyaanId: q.id })
      this.main({ type: 'LANJUT_FASE' })
      this.main({ type: 'UKUR_VITAL' })
      this.main({ type: 'LANJUT_FASE' })
      this.main({ type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'suspek' })
      this.main({ type: 'LANJUT_FASE' })
      this.main({
        type: 'DISPOSISI',
        jenis: kasus.harusDirujuk ? 'rujuk' : 'pulang',
        ...(kasus.harusDirujuk
          ? { sbar: { situation: 'uji', background: 'uji', assessment: kasus.nama, recommendation: 'rujuk' } }
          : {}),
      })
    }
  }
  /** Mainkan hari berjalan sampai blok siang (IGD + seluruh antrian pagi). */
  sampaiSiang(): void {
    this.beresIgd()
    this.beresPagi()
    this.main({ type: 'LANJUTKAN' })
  }
  /** Tutup hari berjalan dari blok siang. */
  tutupHari(): void {
    this.main({ type: 'LANJUTKAN' })
    this.main({ type: 'LANJUTKAN' })
  }
  kunjunganTepat(keluargaId: string): void {
    if (!this.s.desa.binaan.includes(keluargaId)) this.main({ type: 'PILIH_BINAAN', keluargaId })
    this.main({ type: 'MULAI_KUNJUNGAN', keluargaId })
    const kj = this.s.kunjungan
    if (!kj) return
    const dasar = PACK.keluarga[keluargaId]!.arc.kunjungan.find((sk) => sk.id === kj.skenarioId)!
    const skenario = skenarioEfektif(dasar, kj.varianId)
    for (const h of skenario.hotspot) this.main({ type: 'KLIK_HOTSPOT', hotspotId: h.id })
    this.main({ type: 'LANJUT_BABAK' })
    for (const node of skenario.dialog) {
      const pilihan = node.pilihan.find((p) => p.tepat && !isGayaTerlarang(p.gaya)) ?? node.pilihan[0]!
      this.main({ type: 'PILIH_DIALOG', pilihanId: pilihan.id })
    }
    this.main({ type: 'LANJUT_BABAK' })
    this.main({ type: 'KOMIT_HAMBATAN', hipotesis: skenario.hambatanSebenarnya })
    const kartu = skenario.intervensi.find((i) => i.cocokUntuk.includes(skenario.hambatanSebenarnya)) ?? skenario.intervensi[0]!
    this.main({ type: 'PILIH_INTERVENSI', intervensiId: kartu.id })
    const ingatkan = skenario.pilihanIngatkan?.pilihan.find((p) => p.tepat)
    if (this.s.kunjungan?.fase === 'ingatkan' && ingatkan) this.main({ type: 'PILIH_INGATKAN', pilihanId: ingatkan.id })
  }
}

describe('rekonstruksi cuplikan UI dari jejak', () => {
  let sesi: SesiLive
  let setelahKunjungan: { state: GameState; cuplikan: CuplikanUi }

  beforeAll(() => {
    // Mode ujian: kunjungan buka hari 3, Posyandu hari 5.
    sesi = new SesiLive(buildInitialState('Dokter Replay', 4242, PACK, { mode: 'ujian' }))
    while (sesi.s.hari < 3) { sesi.sampaiSiang(); sesi.tutupHari() }
    sesi.sampaiSiang()
    const keluargaId = Object.keys(PACK.keluarga).find((id) => PACK.keluarga[id]!.arc.kunjungan.length > 0)!
    sesi.kunjunganTepat(keluargaId)
    setelahKunjungan = { state: sesi.s, cuplikan: sesi.cuplikan }
    sesi.tutupHari()
    while (sesi.s.hari < 5) { sesi.sampaiSiang(); sesi.tutupHari() }
    sesi.sampaiSiang()
    const kegiatan = () => sesi.s.kegiatan
    sesi.main({ type: 'MULAI_POSYANDU', rw: 1 })
    const kartuPertama = kegiatan()!.kartu[0]!
    sesi.main({ type: 'JAWAB_KEGIATAN', kartuId: kartuPertama.id, pilihanId: kartuPertama.pilihan[0]!.id })
    sesi.main({ type: 'DELEGASI_KEGIATAN' })
  }, 60_000)

  it('kunjungan rumah: cuplikan hasil replay identik dengan cuplikan live, termasuk rekam medis pagi itu', () => {
    const { state, cuplikan } = setelahKunjungan
    expect(cuplikan.rekapUkm?.jenis).toBe('kunjungan')
    expect(cuplikan.rekapUkm?.gaya.length).toBeGreaterThan(0)
    expect(cuplikan.encounterTerakhir).not.toBeNull()
    expect(rekonstruksiJejak(state)?.cuplikan).toEqual(cuplikan)
  })

  it('Posyandu dengan delegasi: pelaksana kartu (dokter vs kader) ikut terpulihkan', () => {
    expect(sesi.cuplikan.rekapUkm?.jenis).toBe('posyandu')
    expect(sesi.cuplikan.rekapUkm?.dijawabDokter).toBe(1)
    expect(rekonstruksiJejak(sesi.s)?.cuplikan).toEqual(sesi.cuplikan)
  })

  it('semua konsultasi poli sepanjang sesi terkumpul dan terkelompok per episode', () => {
    const hasil = rekonstruksiJejak(sesi.s)!
    expect(hasil.encounter).toHaveLength(sesi.konsultasi)
    expect(hasil.encounter.length).toBeGreaterThan(3)
    expect(hasil.encounter.every((item, i, semua) => i === 0 || semua[i - 1]!.hari <= item.hari)).toBe(true)
    const total = [...konsultasiPerEpisode(hasil).values()].reduce((jumlah, daftar) => jumlah + daftar.length, 0)
    expect(total).toBe(hasil.encounter.length)
  })

  it('fail-closed: state yang tidak cocok dengan jejaknya tidak direkonstruksi', () => {
    const diubah = { ...sesi.s, tally: { ...sesi.s.tally, totalPasien: sesi.s.tally.totalPasien + 1 } }
    expect(rekonstruksiJejak(diubah)).toBeNull()
    const tanpaJejak = buildInitialState('Dokter Baru', 1, PACK)
    expect(rekonstruksiJejak(tanpaJejak)).toBeNull()
  })

  it('pergantian hari mengosongkan cuplikan, sama seperti dispatch', () => {
    const awalHari = new SesiLive(sesi.s)
    awalHari.tutupHari()
    expect(awalHari.cuplikan).toEqual(CUPLIKAN_KOSONG)
    expect(rekonstruksiJejak(awalHari.s)?.cuplikan).toEqual(CUPLIKAN_KOSONG)
  })
})
