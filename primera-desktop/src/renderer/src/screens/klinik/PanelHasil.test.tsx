/**
 * TEST — PanelHasil (debrief encounter). CODEX: pasien tutorial yang dituntun
 * PERSIS lewat jalur minimal ter-sorot UI tetap menghasilkan skor SOAP rendah
 * (anamnesis/pemeriksaan cakupan minimal, edukasi 0) → grade D "Perlu
 * pembinaan" tampil walau pemain 100% mengikuti arahan. State SUDAH kebal
 * (reducer.ts), tapi tampilan debrief tetap terasa seperti kegagalan.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PanelHasil } from './PanelHasil'
import type { PenilaianEncounter } from '@engine/state'

const HASIL_DASAR: PenilaianEncounter = {
  kasusId: 'ispa_common_cold',
  pasienNama: 'Tiur',
  diagnosisBenar: true,
  jenisDiagnosis: 'tegak',
  skorAnamnesis: 24,
  skorPemeriksaan: 33,
  skorTerapi: 33,
  skorEdukasi: 0,
  disposisiTepat: true,
  rujukanNonSpesialistik: false,
  cowboy: false,
  antibiotikTanpaIndikasi: false,
  labTakRelevan: 0,
  grade: 'D',
  clue: 'ISPA viral self-limiting, simtomatik saja.',
  konsekuensiDijadwalkan: false,
}

describe('<PanelHasil /> — encounter tutorial vs normal', () => {
  it('encounter NORMAL (bukan tutorial): grade huruf + rincian skor SOAP tampil apa adanya', () => {
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={() => {}} />,
    )
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.getByText('Perlu pembinaan')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument() // skorAnamnesis mentah
  })

  it('encounter TUTORIAL: grade/rincian skor rendah TIDAK tampil, tapi mutiara klinis tetap ada', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, tutorialLatihan: true }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.queryByText('Perlu pembinaan')).not.toBeInTheDocument()
    expect(screen.queryByText('D')).not.toBeInTheDocument()
    expect(screen.queryByText('24')).not.toBeInTheDocument()
    expect(screen.getByText(/tak memengaruhi skor|tak mempengaruhi skor/i)).toBeInTheDocument()
    expect(screen.getByText(HASIL_DASAR.clue)).toBeInTheDocument()
  })

  // CODEX ronde-16 P3: wrapper stempel grade dulu pakai aria-hidden={!tutorial}
  // — kebalik, membuat grade SUNGGUHAN (kasus normal, mayoritas encounter)
  // malah disembunyikan dari screen reader, sementara ikon 🎓 dekoratif
  // (tutorial) yang justru terekspos.
  it('CODEX ronde-16 P3: stempel grade normal TAK boleh aria-hidden (screen reader wajib bisa baca)', () => {
    const { container } = render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={() => {}} />,
    )
    const bungkus = container.querySelector('.klinik-hasil__grade-tutorial')
    expect(bungkus?.getAttribute('aria-hidden')).not.toBe('true')
  })

  it('CODEX ronde-16 P3: ikon 🎓 tutorial ditandai aria-hidden (dekoratif, teks di sebelahnya sudah menjelaskan)', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, tutorialLatihan: true }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText('🎓').getAttribute('aria-hidden')).toBe('true')
  })
})
