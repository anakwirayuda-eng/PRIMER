import { beforeEach, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react'
import { buatEncounter, kasusEfektif, nilaiEncounter, temuanUntukRegion } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { buildInitialState } from '@engine/init'
import { Rng } from '@engine/core/rng'
import { serialize } from '@engine/save'
import { PACK } from '@content/index'
import { useGame } from '../../store'
import { CetakRekamMedis } from './CetakRekamMedis'
import { PanelHasil } from './PanelHasil'
import { unduhDokumen } from '../../utils/unduhDokumen'
import { htmlRingkasanEpisode } from '../ukm/UnduhRingkasanEpisode'
import { episodeIdPasien } from '@engine/bridge'
import { JejakPerawatan } from '../JejakPerawatan'

vi.mock('../../utils/unduhDokumen', () => ({ unduhDokumen: vi.fn(async () => 'Unduhan PDF disiapkan.') }))
beforeEach(() => {
  vi.clearAllMocks()
  window.primer = { save: { write: async () => true, read: async () => null, list: async () => [], delete: async () => true }, telemetri: { append: async () => true, read: async () => [] }, appVersion: async () => '1.3.1-test' }
  useGame.setState({ state: buildInitialState('Dokter Cetak', 131, PACK), encounterTerakhir: null, lastEvents: [] })
})

/** Satu konsultasi lewat dispatch store sungguhan, supaya jejaknya bisa direplay. */
function mainkanSatuKonsultasi(): void {
  const { dispatch } = useGame.getState()
  dispatch({ type: 'PINDAH_LAYAR', layar: 'klinik' })
  dispatch({ type: 'PANGGIL_PASIEN' })
  const kasus = PACK.kasus[useGame.getState().state!.klinik.aktif!.pasien.kasusId]!
  dispatch({ type: 'TANYA', pertanyaanId: kasus.anamnesis[0]!.id })
  dispatch({ type: 'LANJUT_FASE' })
  dispatch({ type: 'UKUR_VITAL' })
  dispatch({ type: 'LANJUT_FASE' })
  dispatch({ type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' })
  dispatch({ type: 'LANJUT_FASE' })
  dispatch({ type: 'DISPOSISI', jenis: 'pulang' })
}

it('rekam medis pasien terakhir dipulihkan dari jejak setelah arsip diimpor ulang', async () => {
  mainkanSatuKonsultasi()
  const live = useGame.getState().encounterTerakhir
  expect(live).not.toBeNull()
  const arsip = serialize(useGame.getState().state!)
  expect(arsip).not.toContain('encounterTerakhir')
  useGame.setState({ encounterTerakhir: null })
  expect(useGame.getState().imporArsip(arsip)).toBe(true)
  expect(useGame.getState().encounterTerakhir).toBeNull()
  await waitFor(() => expect(useGame.getState().encounterTerakhir).toEqual(live))
})

it('episode di Jejak Perawatan menawarkan rekam medis poli lengkap hasil replay', async () => {
  mainkanSatuKonsultasi()
  const enc = useGame.getState().encounterTerakhir!
  const episode = { id: episodeIdPasien(enc.pasien), subjectId: enc.pasien.id, subjectName: enc.pasien.nama, source: 'klinik' as const, problemId: enc.pasien.kasusId, problemLabel: 'Uji', status: 'dinilai' as const, owner: 'dokter' as const, openedDay: 1, updatedDay: 1, nextAction: 'Kontrol', receipt: { signal: 'Poli', next: 'Kontrol' }, history: [] }
  render(<JejakPerawatan episodes={[episode]} hari={1} petaTerbuka={false} onBukaKeluarga={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: /Buka Jejak Perawatan/i }))
  fireEvent.click(screen.getByRole('button', { name: 'Unduh rekam medis poli (1 konsultasi)' }))
  await waitFor(() => expect(unduhDokumen).toHaveBeenCalledTimes(1))
  const [html, nama] = vi.mocked(unduhDokumen).mock.calls[0]!
  expect(html).toContain('Konsultasi hari 1')
  expect(html).toContain(PACK.kasus[enc.pasien.kasusId]!.anamnesis[0]!.tanya)
  expect(nama).toBe(`PRIMERA Rekam Medis ${enc.pasien.nama}`)
})

it('menangkap konsultasi yang selesai beserta disposisi; snapshot tidak ikut save dan tak dipulihkan bila jejak tak mereproduksinya', async () => {
  const enc = buatEncounter(buatPasienDariKasus('ispa_common_cold', PACK, new Rng(131, 'cetak')))
  enc.fase = 'disposisi'
  enc.diagnosis = { icd10: PACK.kasus.ispa_common_cold!.icd10, jenis: 'tegak' }
  const state = useGame.getState().state!
  useGame.setState({ state: { ...state, tutorialAktif: false, layar: 'klinik', klinik: { ...state.klinik, aktif: enc } } })
  useGame.getState().dispatch({ type: 'DISPOSISI', jenis: 'pulang' })
  expect(useGame.getState().lastEvents.some(e => e.type === 'ENCOUNTER_SELESAI')).toBe(true)
  expect(useGame.getState().encounterTerakhir).toEqual({ ...enc, disposisi: 'pulang' })
  const arsip = serialize(useGame.getState().state!)
  expect(arsip).not.toContain('encounterTerakhir')
  useGame.getState().imporArsip(arsip)
  expect(useGame.getState().encounterTerakhir).toBeNull()
  // Encounter disuntik langsung ke state (bukan lewat jejak) → replay menolak.
  await new Promise((selesai) => setTimeout(selesai, 0))
  expect(useGame.getState().encounterTerakhir).toBeNull()
})

it('dokumen memakai keputusan dan temuan yang diperoleh; tidak menambah pemeriksaan yang terlewat atau id diagnosis pada nomor RM', async () => {
  const kasus = PACK.kasus.ispa_common_cold!
  const enc = buatEncounter(buatPasienDariKasus(kasus.id, PACK, new Rng(131, 'isi')))
  enc.pasien.varianId = '_dasar'
  enc.ditanya = [kasus.anamnesis[0]!.id]
  enc.disposisi = 'pulang'
  render(<CetakRekamMedis enc={enc} kasus={kasus} />)
  fireEvent.click(screen.getByRole('button', { name: 'Unduh rekam medis' }))
  await waitFor(() => expect(unduhDokumen).toHaveBeenCalledTimes(1))
  const [html, nama] = vi.mocked(unduhDokumen).mock.calls[0]!
  expect(html).toContain(kasus.anamnesis[0]!.tanya)
  expect(html).not.toContain(kasus.anamnesis[1]!.tanya)
  expect(html).not.toContain(kasus.pemeriksaanFisik[0]!.temuan)
  expect(html).toContain('belum ada regio yang diperiksa')
  expect(html).toContain('belum ditegakkan')
  expect(html).toContain('pulang')
  expect(nama).toMatch(/^PRIMERA RM-\d{10}$/)
})

it('debrief memakai temuan varian pasien; biaya lab katalog tersedia hanya jika snapshot konsultasi cocok', () => {
  const dasar = Object.values(PACK.kasus).find(k => k.varianPresentasi?.some(v => Object.keys(v.temuanBerubah ?? {}).length > 0))!
  const varian = dasar.varianPresentasi!.find(v => Object.keys(v.temuanBerubah ?? {}).length > 0)!
  const kasus = kasusEfektif(dasar, varian.id)
  const region = kasus.pemeriksaanFisik.find(f => varian.temuanBerubah?.[f.region])!.region
  const enc = buatEncounter(buatPasienDariKasus(kasus.id, PACK, new Rng(1, 'varian')))
  enc.pasien.varianId = varian.id
  const lab = Object.values(PACK.lab).find(l => !kasus.lab.some(k => k.id === l.id && k.relevan))!
  enc.labDipesan = [lab.id]
  const hasil = { ...nilaiEncounter(enc, kasus, PACK), pemeriksaanRelevanTerlewat: [region] }
  useGame.setState({ encounterTerakhir: enc })
  const { container } = render(<PanelHasil hasil={hasil} bolehPanggil={false} alasanTutup="Selesai" onSelesai={() => {}} />)
  expect(container.querySelector('.klinik-hasil')?.textContent ?? container.textContent).toContain(temuanUntukRegion(kasus, region))
  expect(screen.getByText(new RegExp(`biaya katalog Rp ${lab.biaya.toLocaleString('id-ID').replaceAll('.', '\\.')}`))).toBeInTheDocument()
  cleanup()
  useGame.setState({ encounterTerakhir: { ...enc, pasien: { ...enc.pasien, nama: 'Pasien lain' } } })
  render(<PanelHasil hasil={hasil} bolehPanggil={false} alasanTutup="Selesai" onSelesai={() => {}} />)
  expect(screen.queryByRole('button', { name: 'Unduh rekam medis' })).not.toBeInTheDocument()
  expect(screen.queryByText(/biaya katalog/)).not.toBeInTheDocument()
})

it('ringkasan episode lama tidak mengarang rekam medis dan meng-escape masukan', () => {
  const html = htmlRingkasanEpisode({ id: 'e', subjectId: 'p', subjectName: '<img src=x onerror=alert(1)>', source: 'keluarga', problemId: 'uji', problemLabel: 'Uji', status: 'menunggu', owner: 'dokter', openedDay: 1, updatedDay: 1, nextAction: 'Kontrol', receipt: { signal: 'Tercatat', next: 'Kontrol' }, history: [] })
  expect(html).toContain('&lt;img')
  expect(html).not.toContain('<img')
  expect(html).toContain('Tidak tercatat')
  expect(html).toContain('bukan rekam medis lengkap')
})
