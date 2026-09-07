import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import { serialize } from '@engine/save'
import type { GameState, IgdState } from '@engine/state'
import type { Action } from '@engine/actions'
import { useGame } from './store'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

function bridge(save: Partial<Window['primer']['save']> = {}) {
  window.primer = {
    save: { read: async () => null, write: async () => true, list: async () => [], delete: async () => true, ...save },
    telemetri: { append: async () => true, read: async () => [] },
    appVersion: async () => 'test',
  }
}

beforeEach(() => {
  useGame.setState({ ...useGame.getInitialState(), state: buildInitialState('Uji Lab 2', 707071, PACK) })
  bridge()
})
afterEach(() => vi.restoreAllMocks())

/** Simulasikan proses mati setelah aksi: hanya JSON di bridge yang boleh dipulihkan. */
async function pulihkanSetelah(action: Action, state: GameState) {
  let disk = serialize(state)
  bridge({
    write: async (_slot, json) => { disk = json; return true },
    read: async () => disk,
  })
  useGame.setState({ state })
  useGame.getState().dispatch(action)
  expect(useGame.getState().lastEvents.some(e => e.type === 'ERROR_AKSI')).toBe(false)
  const sesudah = useGame.getState().state!
  expect(sesudah).not.toBe(state)
  await vi.waitFor(() => expect(useGame.getState().statusSimpan).toBe('idle'))
  useGame.setState({ state: null, arsip: null })
  expect(await useGame.getState().muatAutosave()).toBe(true)
  useGame.getState().lanjutkanArsip()
  return { sesudah, pulih: useGame.getState().state! }
}

describe('Lab 2 — keputusan bermakna bertahan setelah keluar/muat', () => {
  it('adopsi feedback RS mempertahankan rencana FKTP dan riwayat episode', async () => {
    const state: GameState = {
      ...useGame.getState().state!,
      hari: 3,
      inbox: [{ id: 'feedback', hari: 2, jenis: 'hasil_lab', dari: 'RSUD', judul: 'Feedback Bima', isi: 'Kontrol FKTP.', dibaca: true, episodeId: 'ep', kaitKeluargaId: 'keluarga_wulan' }],
      careEpisodes: [{
        id: 'ep', subjectId: 'bima', subjectName: 'Bima', familyId: 'keluarga_wulan', rw: 2,
        source: 'klinik', problemId: 'apendisitis', problemLabel: 'Apendisitis akut', owner: 'rs',
        status: 'kembali', openedDay: 1, updatedDay: 2, nextAction: 'Adopsi rencana.',
        referral: { stage: 'feedback', hospitalName: 'RSUD' },
        receipt: { signal: 'Rujukan akut', feedback: 'Kontrol FKTP.', next: 'Adopsi rencana.' },
        history: [{ hari: 2, status: 'kembali', label: 'Feedback masuk', detail: 'Menunggu adopsi.' }],
      }],
    }
    const { sesudah, pulih } = await pulihkanSetelah({ type: 'ADOPSI_UMPAN_BALIK', suratId: 'feedback', langkah: ['rekonsiliasi', 'kontrol', 'pemantauan_keluarga'] }, state)
    expect(sesudah.careEpisodes[0]?.referral?.stage).toBe('acted')
    expect(pulih.careEpisodes).toEqual(sesudah.careEpisodes)
  })

  it('surat yang telah dibaca tetap dibaca setelah restart', async () => {
    const state = { ...useGame.getState().state!, inbox: [{ id: 'kabar', hari: 1, jenis: 'kabar_warga' as const, dari: 'Kader', judul: 'Kabar', isi: 'Kunjungan besok.', dibaca: false }] }
    const { pulih } = await pulihkanSetelah({ type: 'BACA_SURAT', suratId: 'kabar' }, state)
    expect(pulih.inbox[0]?.dibaca).toBe(true)
  })

  it.each(['TUTUP_REKAP', 'TUTUP_LOKMIN'] as const)('%s tidak memunculkan kembali modal yang sudah selesai', async type => {
    const state = { ...useGame.getState().state!, flags: { ...useGame.getState().state!.flags, rekapSlice: true, rekapDitutup: false, lokminDitutup: false } }
    const { sesudah, pulih } = await pulihkanSetelah({ type }, state)
    expect(pulih.flags).toEqual(sesudah.flags)
  })

  const kasus = Object.values(PACK.kasusIgd)[0]!
  const langkah = kasus.langkah[0]!
  const pilihan = langkah.pilihan.find(p => !p.benar)!
  const igd: IgdState = { kasusId: kasus.id, pasienNama: 'Uji IGD', usia: kasus.demografi.usiaMin, jenisKelamin: 'L', rw: 2, fase: 'langkah', langkahIndex: 0, stabilitas: kasus.stabilitasAwal, jawaban: [] }
  it.each<{ nama: string; igd: IgdState; action: Action }>([
    { nama: 'jawaban IGD yang sudah diberi feedback', igd, action: { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: pilihan.id } },
    { nama: 'ROSC setelah RJP', igd: { ...igd, fase: 'kode_biru', stabilitas: 0 }, action: { type: 'RJP_IGD', berkualitas: true } },
    { nama: 'keputusan pasca-ROSC', igd: { ...igd, fase: 'pasca_rosc', stabilitas: 25, melewatiKodeBiru: true }, action: { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' } },
  ])('$nama tidak dapat dibatalkan dengan keluar/muat', async ({ igd, action }) => {
    const state: GameState = { ...useGame.getState().state!, layar: 'igd', igd }
    const { sesudah, pulih } = await pulihkanSetelah(action, state)
    expect(sesudah.igd).not.toEqual(igd)
    expect(pulih.igd).toEqual(sesudah.igd)
    expect(pulih.tally).toEqual(sesudah.tally)
  })

  it('care plan yang belum lengkap ditolak tanpa menulis autosave', async () => {
    const write = vi.fn(async () => true)
    bridge({ write })
    useGame.getState().dispatch({ type: 'ADOPSI_UMPAN_BALIK', suratId: 'tidak_ada', langkah: [] })
    expect(useGame.getState().lastEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'ERROR_AKSI' })]))
    expect(write).not.toHaveBeenCalled()
  })
})

describe('Lab 2 — autosave asinkron mengikuti permintaan dan sesi terbaru', () => {
  it('penyelesaian tulis pertama tidak menandai idle saat progres terbaru masih ditulis', async () => {
    const a = deferred<boolean>(), b = deferred<boolean>()
    bridge({ write: vi.fn().mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise) })
    const pertama = useGame.getState().simpan(), kedua = useGame.getState().simpan()
    a.resolve(true)
    await pertama
    const statusSebelumSelesai = useGame.getState().statusSimpan
    b.resolve(true)
    await kedua
    expect(statusSebelumSelesai).toBe('menyimpan')
    expect(useGame.getState().statusSimpan).toBe('idle')
  })

  it('gagal tulis sesi lama tidak menodai status sesi yang baru dilanjutkan', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const a = deferred<boolean>()
    bridge({ write: () => a.promise })
    const pending = useGame.getState().simpan()
    useGame.setState({ arsip: buildInitialState('Sesi baru', 23, PACK) })
    useGame.getState().lanjutkanArsip()
    a.reject(new Error('disk lama gagal'))
    await pending
    expect(useGame.getState().statusSimpan).toBe('idle')
  })

  it('dua pembacaan boot: hasil usang tidak mengganti arsip yang terbaru', async () => {
    const a = deferred<string | null>(), b = deferred<string | null>()
    bridge({ read: vi.fn().mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise) })
    const pertama = useGame.getState().muatAutosave(), kedua = useGame.getState().muatAutosave()
    const baru = buildInitialState('Terbaru', 25, PACK)
    b.resolve(serialize(baru))
    expect(await kedua).toBe(true)
    a.resolve(serialize(buildInitialState('Usang', 24, PACK)))
    expect(await pertama).toBe(false)
    expect(useGame.getState().arsip?.seed).toBe(baru.seed)
  })

  it('indikator muat tetap aktif selama permintaan baca terbaru belum selesai', async () => {
    const a = deferred<string | null>(), b = deferred<string | null>()
    bridge({ read: vi.fn().mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise) })
    const pertama = useGame.getState().muatAutosave(), kedua = useGame.getState().muatAutosave()
    a.resolve(null)
    await pertama
    const masihMemuat = useGame.getState().sedangMemuat
    b.resolve(null)
    await kedua
    expect(masihMemuat).toBe(true)
    expect(useGame.getState().sedangMemuat).toBe(false)
  })

  it.each(['berhasil', 'gagal'] as const)('baca autosave lama yang %s setelah mulai baru tidak menghidupkan arsip atau error lama', async hasil => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const a = deferred<string | null>()
    bridge({ read: () => a.promise })
    const pending = useGame.getState().muatAutosave()
    useGame.getState().mulaiGameBaru('Sesi Baru')
    await vi.waitFor(() => expect(useGame.getState().statusSimpan).toBe('idle'))
    if (hasil === 'berhasil') a.resolve(serialize(buildInitialState('Usang', 26, PACK)))
    else a.reject(new Error('read lama gagal'))
    expect(await pending).toBe(false)
    expect(useGame.getState().arsip).toBeNull()
    expect(useGame.getState().statusSimpan).toBe('idle')
    expect(useGame.getState().sedangMemuat).toBe(false)
  })

  it.each([null, '{rusak'])('hasil baca %s menghapus kandidat arsip sebelumnya', async json => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    useGame.setState({ arsip: buildInitialState('Arsip lama', 27, PACK) })
    bridge({ read: async () => json })
    expect(await useGame.getState().muatAutosave()).toBe(false)
    expect(useGame.getState().arsip).toBeNull()
    expect(useGame.getState().arsipKorup).toBe(json !== null)
  })
})
