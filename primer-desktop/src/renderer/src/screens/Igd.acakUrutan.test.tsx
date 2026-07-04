/**
 * TEST KOMPONEN — Igd merender pilihan dgn urutan acak per-mahasiswa
 * (DeepThink ronde-2 bonus, keputusan user). Cari kasus IGD nyata dgn ≥3
 * pilihan di satu langkah (supaya perbandingan urutan antar-seed reliable,
 * bukan 50:50 kebetulan sama spt di langkah 2-opsi).
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Igd } from './Igd'
import type { IgdState } from '@engine/state'

function cariLangkahMultiPilihan(): { kasusId: string; langkahId: string; pilihanIds: string[] } | undefined {
  for (const kasus of Object.values(PACK.kasusIgd)) {
    for (const l of kasus.langkah) {
      if (l.pilihan.length >= 3) {
        return { kasusId: kasus.id, langkahId: l.id, pilihanIds: l.pilihan.map((p) => p.id) }
      }
    }
  }
  return undefined
}

function pasangIgd(seed: number, kasusId: string): void {
  const state = buildInitialState('Uji Igd', seed, PACK)
  const igd: IgdState = {
    kasusId,
    pasienNama: 'Pasien Uji',
    usia: 40,
    jenisKelamin: 'L',
    rw: 1,
    fase: 'langkah',
    langkahIndex: 0,
    stabilitas: 80,
    jawaban: [],
  }
  useGame.setState({ state: { ...state, seed, igd } })
}

describe('<Igd /> — urutan pilihan diacak per rngFlavor', () => {
  it('seed berbeda → urutan tombol pilihan di layar berbeda utk langkah yg sama', () => {
    const target = cariLangkahMultiPilihan()
    expect(target).toBeDefined() // pra-syarat: konten nyata memang ada langkah ≥3 pilihan
    const { kasusId } = target!

    const urutanUntukSeed = (seed: number): string[] => {
      pasangIgd(seed, kasusId)
      const { unmount } = render(<Igd />)
      const tombol = screen.getAllByRole('button', { name: /.+/ }).filter((b) => b.className.includes('igd__opsi'))
      const label = tombol.map((b) => b.textContent)
      unmount()
      return label
    }

    let adaBeda = false
    const acuan = urutanUntukSeed(1)
    for (let seed = 2; seed < 15; seed++) {
      if (urutanUntukSeed(seed).join('|') !== acuan.join('|')) {
        adaBeda = true
        break
      }
    }
    expect(adaBeda).toBe(true)
  })

  it('urutan tampil TETAP STABIL utk seed yg sama (bukan acak ulang tiap render)', () => {
    const target = cariLangkahMultiPilihan()!
    pasangIgd(7, target.kasusId)
    const r1 = render(<Igd />)
    const label1 = screen.getAllByRole('button').filter((b) => b.className.includes('igd__opsi')).map((b) => b.textContent)
    r1.unmount()
    const r2 = render(<Igd />)
    const label2 = screen.getAllByRole('button').filter((b) => b.className.includes('igd__opsi')).map((b) => b.textContent)
    r2.unmount()
    expect(label1).toEqual(label2)
  })
})
