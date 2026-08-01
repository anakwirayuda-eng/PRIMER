/**
 * TEST — PanelHasil (debrief encounter). CODEX: pasien tutorial yang dituntun
 * PERSIS lewat jalur minimal ter-sorot UI tetap menghasilkan skor SOAP rendah
 * (anamnesis/pemeriksaan cakupan minimal, edukasi 0) → grade D "Perlu
 * pembinaan" tampil walau pemain 100% mengikuti arahan. State SUDAH kebal
 * (reducer.ts), tapi tampilan debrief tetap terasa seperti kegagalan.
 */
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PanelHasil } from './PanelHasil'
import type { PenilaianEncounter } from '@engine/state'
import { PACK } from '@content/index'

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
  obatBerbahaya: false,
  tindakanBerbahaya: false,
  firewallTerpicu: false,
  konfirmasiTakTerpenuhi: false,
  stabilisasiTerlewat: false,
  terapiKritisTerlewat: false,
  labTakRelevan: 0,
  grade: 'D',
  clue: 'ISPA viral self-limiting, simtomatik saja.',
  konsekuensiDijadwalkan: false,
  edukasiKritisTerlewat: [],
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

  it('kasus tanpa target obat/prosedur menampilkan Terapi N/A, bukan nilai sempurna gratis', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, skorTerapi: 100, terapiDinilai: false }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByLabelText('Terapi tidak dinilai pada kasus ini')).toBeInTheDocument()
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

  // DeepThink triangulasi (2026-07-05, O6): debrief harus sebut EKSPLISIT
  // topik edukasiKritis yang terlewat, bukan cuma angka skor yg di-cap.
  it('edukasiKritisTerlewat terisi: nama topik kritis tampil di debrief', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, edukasiKritisTerlewat: ['tanda_bahaya'] }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText(/Tanda bahaya — kapan harus segera kembali/)).toBeInTheDocument()
  })

  it('edukasiKritisTerlewat kosong: pesan topik kritis tak tampil', () => {
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={() => {}} />,
    )
    expect(screen.queryByText(/Topik edukasi wajib yang terlewat/)).not.toBeInTheDocument()
  })

  it('stabilisasi pra-rujuk terlewat: alasan penurunan grade tampil jelas', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, stabilisasiTerlewat: true }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText('Stabilisasi pra-rujuk terlewat')).toBeInTheDocument()
  })

  it('tindakan berbahaya: alasan cap grade tampil jelas', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, tindakanBerbahaya: true }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText('Tindakan berbahaya dilakukan')).toBeInTheDocument()
  })

  it('debrief menyebut item konkret yang dipilih dan terlewat, bukan hanya skor', () => {
    render(
      <PanelHasil
        hasil={{
          ...HASIL_DASAR,
          diagnosisBenar: false,
          diagnosisDipilihIcd10: 'J02.9',
          anamnesisEsensialTerlewat: ['q_durasi'],
          pemeriksaanRelevanTerlewat: ['toraks_paru'],
          obatWajibTerlewat: ['paracetamol_500'],
          grupObatAlternatifTerlewat: [['ctm_4']],
          edukasiRelevanTakDipilih: ['etika_batuk'],
        }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )

    expect(screen.getByText(/Yang Dipilih & Perlu Diperbaiki/i)).toBeInTheDocument()
    expect(screen.getByText(/Sudah berapa hari begini/i)).toBeInTheDocument()
    expect(screen.getByText(/Toraks & Paru/i)).toBeInTheDocument()
    expect(screen.getByText(/Parasetamol/i)).toBeInTheDocument()
    expect(screen.getByText(/Etika batuk/i)).toBeInTheDocument()
  })

  // Q5/C.8 (M10.5, keputusan O-A 2026-07-12): sentilan alergi tanpa gerbang baru.
  it('kasus ber-alergiTrap (mm_isk_bawah): sentilan kebiasaan cek alergi tampil', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, kasusId: 'mm_isk_bawah' }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText(/riwayat alergi/i)).toBeInTheDocument()
  })

  it('kasus tanpa alergiTrap (ispa_common_cold): sentilan alergi TAK tampil', () => {
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={() => {}} />,
    )
    expect(screen.queryByText(/riwayat alergi/i)).not.toBeInTheDocument()
  })

  // §3b (M10.5, keputusan medikolegal 2026-07-12): PPK = baku default, BUKAN
  // hukum mutlak anti-EBM — catatan ini menempel di kotak Panduan Resmi.
  it('kasus ber-panduanResmi (mata_konjungtivitis_alergi): catatan medikolegal §3b tampil', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, kasusId: 'mata_konjungtivitis_alergi' }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText(/Panduan ini menjadi acuan utama penilaian/i)).toBeInTheDocument()
  })

  it('semua kasus, termasuk ispa_common_cold, menampilkan floor sumber dan catatan medikolegal §3b', () => {
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={() => {}} />,
    )
    expect(screen.getByText(/Panduan ini menjadi acuan utama penilaian/i)).toBeInTheDocument()
    expect(screen.getByText(/PPK Dokter FKTP KMK 1186\/2022 bab Rinitis Akut/i)).toBeInTheDocument()
  })

  it('kasus prototipe lab ditandai belum teradjudikasi pada debrief', () => {
    const kasus = Object.values(PACK.kasus).find(
      (item) =>
        item.activationStatus === 'lab_prototype_unadjudicated' &&
        item.reviewStatus !== 'physician_approved',
    )!
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, kasusId: kasus.id, formativePrototype: true }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )
    expect(screen.getByText(/Latihan formatif — progres tidak dicatat/i)).toBeInTheDocument()
  })

  it('kasus dengan provenance terstruktur menampilkan referensi ringkas yang dapat dibuka', () => {
    render(
      <PanelHasil
        hasil={{ ...HASIL_DASAR, kasusId: 'lab_tetanus_generalisata_awal' }}
        bolehPanggil={true}
        alasanTutup=""
        onSelesai={() => {}}
      />,
    )

    expect(screen.getByText('Referensi kasus')).toBeInTheDocument()
    expect(screen.getByText('5 rujukan')).toBeInTheDocument()
    expect(screen.getByRole('link', {
      name: /CDC Clinical Care of Tetanus 2025; buka di browser bawaan/i,
    })).toHaveAttribute('href', 'https://www.cdc.gov/tetanus/hcp/clinical-care/index.html')
    expect(screen.queryByText('INTI KEPUTUSAN')).not.toBeInTheDocument()
  })

  // S1-panelhasil (2026-08-01): debrief hasil-dulu — lapisan pengayaan dilipat
  // ke SATU grup "Pelajari Lebih Dalam"; CTA selalu terlihat (sticky) dan Enter
  // aman (hanya saat fokus masih di kontainer dialog).
  it('grup Pelajari Lebih Dalam default terlipat + hitungan topik jujur', () => {
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={() => {}} />,
    )
    const grup = screen.getByText('Pelajari Lebih Dalam').closest('details')
    expect(grup).not.toBeNull()
    expect(grup).not.toHaveAttribute('open')
    expect(screen.getByText(/\d+ topik/)).toBeInTheDocument()
  })

  it('Panduan Resmi tetap default terbuka DI DALAM grup', () => {
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={() => {}} />,
    )
    expect(
      screen.getByText('📜 Panduan Resmi Kemenkes').closest('details'),
    ).toHaveAttribute('open')
  })

  // REGRESI playtest dr. Wirayuda 2026-08-01: versi pertama pintasan Enter
  // memasang handler DI ELEMEN modal dan menuntut fokus persis di kontainer.
  // Test lama menembakkan keydown langsung ke elemen dialog sehingga selalu
  // hijau, padahal di permainan nyata fokus hampir selalu sudah pindah (klik)
  // dan keydown pada <body> tak pernah melewati elemen modal → pintasan mati.
  // Test kini menembak lewat jalur yang benar-benar dilalui papan ketik.
  it('Enter memicu Pasien Berikutnya walau fokus sudah jatuh ke body (kasus pemain nyata)', () => {
    const onSelesai = vi.fn()
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={onSelesai} />,
    )
    ;(document.activeElement as HTMLElement | null)?.blur()
    expect(document.activeElement).toBe(document.body)
    fireEvent.keyDown(document.body, { key: 'Enter' })
    expect(onSelesai).toHaveBeenCalledWith(true)
  })

  it('Enter saat fokus di tombol dibiarkan milik tombol itu (tanpa dobel-aksi)', () => {
    const onSelesai = vi.fn()
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={onSelesai} />,
    )
    const tutup = screen.getByRole('button', { name: 'Tutup' })
    tutup.focus()
    fireEvent.keyDown(tutup, { key: 'Enter' })
    expect(onSelesai).not.toHaveBeenCalled()
  })

  it('Enter saat fokus di summary grup dibiarkan membuka/menutup lipatan', () => {
    const onSelesai = vi.fn()
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={onSelesai} />,
    )
    const summary = screen.getByText('Pelajari Lebih Dalam').closest('summary')!
    summary.focus()
    fireEvent.keyDown(summary, { key: 'Enter' })
    expect(onSelesai).not.toHaveBeenCalled()
  })

  it('Enter repeat (tombol ditahan dari layar sebelumnya) diabaikan', () => {
    const onSelesai = vi.fn()
    render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={onSelesai} />,
    )
    fireEvent.keyDown(document.body, { key: 'Enter', repeat: true })
    expect(onSelesai).not.toHaveBeenCalled()
  })

  it('Enter diabaikan bila bolehPanggil=false (antrian habis)', () => {
    const onSelesai = vi.fn()
    render(
      <PanelHasil
        hasil={HASIL_DASAR}
        bolehPanggil={false}
        alasanTutup="Antrian habis"
        onSelesai={onSelesai}
      />,
    )
    fireEvent.keyDown(document.body, { key: 'Enter' })
    expect(onSelesai).not.toHaveBeenCalled()
  })

  it('listener Enter dilepas saat modal ditutup — tak ada sisa pintasan liar', () => {
    const onSelesai = vi.fn()
    const { unmount } = render(
      <PanelHasil hasil={HASIL_DASAR} bolehPanggil={true} alasanTutup="" onSelesai={onSelesai} />,
    )
    unmount()
    fireEvent.keyDown(document.body, { key: 'Enter' })
    expect(onSelesai).not.toHaveBeenCalled()
  })
})
