/**
 * TEST KOMPONEN — feedback jawaban terakhir IGD tetap terlihat sesaat setelah
 * transisi fase (CODEX audit UI/UX 2026-07-10, #7c). Sebelum fix: ResponsTerakhir
 * hanya dirender di dalam blok fase==='langkah' — begitu jawaban TERAKHIR memicu
 * transisi ke kode_biru/disposisi (fase & jawaban berubah dalam satu return yang
 * sama di engine), feedback benar/keliru pilihan itu lenyap seketika tanpa pernah
 * sempat terlihat.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Igd } from './Igd'
import type { IgdState } from '@engine/state'

function kasusIgdPertama() {
  const kasus = Object.values(PACK.kasusIgd)[0]!
  const langkah = kasus.langkah[0]!
  const pilihan = langkah.pilihan[0]!
  return { kasus, langkah, pilihan }
}

function pasangIgd(fase: IgdState['fase']): void {
  const { kasus, langkah, pilihan } = kasusIgdPertama()
  const state = buildInitialState('Uji Igd', 1, PACK)
  const igd: IgdState = {
    kasusId: kasus.id,
    pasienNama: 'Pasien Uji',
    usia: 40,
    jenisKelamin: 'L',
    rw: 1,
    fase,
    // langkahIndex tetap 0 (langkah yang baru dijawab), jawaban SUDAH tercatat —
    // mensimulasikan state PERSIS setelah jawaban terakhir memicu transisi fase.
    langkahIndex: 0,
    stabilitas: fase === 'kode_biru' ? 0 : 80,
    jawaban: [{ langkahId: langkah.id, pilihanId: pilihan.id, benar: pilihan.benar }],
  }
  useGame.setState({ state: { ...state, igd } })
}

describe('<Igd /> — ResponsTerakhir tetap tampil lintas transisi fase', () => {
  it('fase kode_biru: feedback jawaban terakhir (sebelum transisi) tetap dirender', () => {
    pasangIgd('kode_biru')
    render(<Igd />)
    expect(screen.getByText('KODE BIRU')).toBeInTheDocument() // fase baru tampil
    expect(screen.getByRole('status')).toBeInTheDocument() // feedback lama TETAP ada
  })

  it('fase disposisi: feedback jawaban terakhir tetap dirender', () => {
    pasangIgd('disposisi')
    render(<Igd />)
    expect(screen.getByText('Pasien Stabil — Disposisi')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  /**
   * REGRESI — CODEX M14 #20c: pada jalur RJP (langkah→kode_biru→disposisi),
   * jawaban TERAKHIR yang tercatat adalah pilihan SEBELUM Kode Biru. Banner
   * feedback karena itu masih membicarakan keputusan lama begitu pemain sampai
   * disposisi — terbaca seolah itu respons atas RJP-nya. Digerbang latch
   * renderer `pernahKodeBiru`; jalur NORMAL (test di atas) tetap menampilkannya.
   */
  it('jalur RJP (kode_biru → disposisi): feedback langkah PRA-Kode-Biru TIDAK ikut terbawa', () => {
    pasangIgd('kode_biru')
    const { rerender } = render(<Igd />)
    // Sanity: saat Kode Biru, feedback pilihan yang menghabiskan stabilitas
    // memang SENGAJA tampil (itu justru info terpenting).
    expect(screen.getByRole('status')).toBeInTheDocument()

    // RJP berhasil → engine memindahkan fase ke disposisi; `jawaban` TIDAK
    // bertambah (RJP bukan langkah ber-entri jawaban).
    const skrg = useGame.getState().state!
    useGame.setState({ state: { ...skrg, igd: { ...skrg.igd!, fase: 'disposisi', stabilitas: 25 } } })
    rerender(<Igd />)

    // Pasca-ROSC stabilitas sengaja RENDAH (25 < AMBANG_STABIL_RUJUK 50) —
    // "kembali" bukan "sembuh" — jadi headernya memang varian jujur ini,
    // bukan "Pasien Stabil".
    expect(screen.getByText('Stabilitas Masih Rendah — Disposisi')).toBeInTheDocument()
    expect(
      screen.queryByRole('status'),
      'banner pra-Kode-Biru tak boleh terbawa ke disposisi pasca-RJP',
    ).not.toBeInTheDocument()
  })

  it('fase langkah, langkahIndex 0 (langkah pertama, belum ada jawaban): tak ada feedback ditampilkan', () => {
    const { kasus } = kasusIgdPertama()
    const state = buildInitialState('Uji Igd', 1, PACK)
    const igd: IgdState = {
      kasusId: kasus.id,
      pasienNama: 'Pasien Uji',
      usia: 40,
      jenisKelamin: 'L',
      rw: 1,
      fase: 'langkah',
      langkahIndex: 0,
      stabilitas: 80,
      jawaban: [],
    }
    useGame.setState({ state: { ...state, igd } })
    render(<Igd />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
