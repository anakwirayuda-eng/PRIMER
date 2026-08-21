/**
 * TEST KOMPONEN — strip tanda vital IGD memperlakukan 0 sebagai nilai vital.
 *
 * Guard truthiness (`{kasus.vitalAwal.rr && <span/>}`) punya dua akibat pada
 * kasus yang memang bernilai 0: chip-nya hilang, DAN React merender angka '0'
 * telanjang di tengah baris. igd_asfiksia_neonatorum lahir dengan rr 0 (apnea)
 * — justru tanda vital yang menjadi alasan seluruh algoritme VTP-nya, jadi
 * pemain menilai bayi dari strip yang kehilangan frekuensi napasnya.
 */
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Igd } from './Igd'
import type { IgdState } from '@engine/state'

const KASUS_APNEA = 'igd_asfiksia_neonatorum'

function pasangIgd(kasusId: string): void {
  const state = buildInitialState('Uji Vital', 1, PACK)
  const igd: IgdState = {
    kasusId,
    pasienNama: 'Bayi Ny. Uji',
    usia: 0,
    usiaBulan: 0,
    jenisKelamin: 'L',
    rw: 1,
    fase: 'langkah',
    langkahIndex: 0,
    stabilitas: 42,
    jawaban: [],
  }
  useGame.setState({ state: { ...state, igd } })
}

function stripVital(): HTMLElement {
  return document.querySelector('.igd__vital') as HTMLElement
}

describe('<Igd /> — strip vital dgn nilai 0', () => {
  it('rr 0 dirender sebagai chip "RR 0×", bukan disembunyikan', () => {
    expect(PACK.kasusIgd[KASUS_APNEA]?.vitalAwal.rr, 'prasyarat: kasus apnea rr 0').toBe(0)
    pasangIgd(KASUS_APNEA)
    render(<Igd />)

    expect(stripVital().textContent).toContain('RR 0×')
  })

  it('tidak ada angka telanjang di luar chip vital', () => {
    pasangIgd(KASUS_APNEA)
    render(<Igd />)

    const strip = stripVital()
    const dariChip = [...strip.querySelectorAll('span')].map((el) => el.textContent).join('')
    expect(strip.textContent).toBe(dariChip)
  })

  it('field vital yang memang tak ada tetap tidak dirender', () => {
    const kasus = PACK.kasusIgd[KASUS_APNEA]!
    expect(kasus.vitalAwal.td, 'prasyarat: kasus apnea tanpa TD').toBeUndefined()
    expect(kasus.vitalAwal.gds, 'prasyarat: kasus apnea tanpa GDS').toBeUndefined()
    pasangIgd(KASUS_APNEA)
    render(<Igd />)

    const strip = stripVital()
    expect(strip.textContent).not.toContain('TD ')
    expect(strip.textContent).not.toContain('GDS ')
    expect(strip.querySelectorAll('span')).toHaveLength(4) // nadi, rr, spo2, suhu
  })
})
