/**
 * TEST — LembarPeriksa: tombol coret resep dapat nama obat (CODEX audit
 * UI/UX 2026-07-10, #15). Sebelum fix: tombol HANYA berisi simbol "✕" dgn
 * title statis "Coret dari resep" — nama obat tak disebut sama sekali,
 * bahkan di title — tak terbedakan dari baris resep lain di kartu yang sama.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LembarPeriksa } from './LembarPeriksa'
import { buatEncounter } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { PACK } from '@content/index'

describe('<LembarPeriksa /> — aria-label tombol coret resep bernama (#15)', () => {
  it('tombol coret resep punya aria-label & title yang menyebut nama obatnya', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const contohObat = Object.values(PACK.obat)[0]!
    const enc = { ...buatEncounter(pasien), resep: [contohObat.id] }
    const kasus = PACK.kasus[enc.pasien.kasusId]!
    render(<LembarPeriksa enc={enc} kasus={kasus} dispatch={() => {}} />)

    const tombol = screen.getByRole('button', { name: `Coret ${contohObat.nama} dari resep` })
    expect(tombol).toBeInTheDocument()
    // Audit premium 2026-07-23: tooltip kini data-tip (tooltip instan global).
    expect(tombol).toHaveAttribute('data-tip', `Coret ${contohObat.nama} dari resep`)
  })
})

describe('<LembarPeriksa /> — status konten lab transparan', () => {
  it('kasus yang belum teradjudikasi diberi penanda visual tanpa membocorkan diagnosis', () => {
    const kasus = Object.values(PACK.kasus).find(
      (item) =>
        item.activationStatus === 'lab_prototype_unadjudicated' &&
        item.reviewStatus !== 'physician_approved',
    )!
    const pasien = buatPasienDariKasus(kasus.id, PACK, new Rng(2, 'prototype'))
    const enc = buatEncounter(pasien)
    render(<LembarPeriksa enc={enc} kasus={kasus} dispatch={() => {}} />)

    expect(screen.getByText('Latihan formatif')).toBeInTheDocument()
    expect(screen.queryByText(kasus.nama)).not.toBeInTheDocument()
  })
})

/**
 * Playtest dr. Wirayuda 2026-08-03: satu pasien menampilkan
 *   "Kolesterol Total — normal — Dalam batas normal, tidak ada temuan bermakna."
 * TEPAT DI ATAS
 *   "Profil Lipid — tinggi — Kolesterol total 268, LDL 182 (tinggi)…"
 * Dua hasil bertentangan pada pasien yang sama, dan yang keliru justru
 * berlabel normal. Sebabnya: lab yang tidak ditulis kasus SELALU dirender
 * "dalam batas normal", padahal analitnya termuat di pemeriksaan lain.
 */
describe('<LembarPeriksa /> — tidak mengarang hasil normal yang bertentangan', () => {
  function render2Lab(kasusId: string, labDipesan: string[]) {
    const pasien = buatPasienDariKasus(kasusId, PACK, new Rng(7, 'lab'))
    const enc = { ...buatEncounter(pasien), labDipesan, labTersedia: labDipesan }
    const kasus = PACK.kasus[kasusId]!
    return render(<LembarPeriksa enc={enc} kasus={kasus} dispatch={() => {}} />)
  }

  it('dislipidemia: memesan Kolesterol Total TIDAK lagi dijawab "dalam batas normal"', () => {
    const { container } = render2Lab('mm_dislipidemia', ['kolesterol', 'profil_lipid'])
    const teks = container.textContent ?? ''

    expect(teks).toContain('Kolesterol Total')
    expect(teks).not.toContain('Dalam batas normal, tidak ada temuan bermakna.')
    // Hasil dipinjam dari pemeriksaan yang memuat analit yang sama.
    expect(teks).toMatch(/Menyatu dengan Profil Lipid/)
  })

  it('preeklampsia berat: memesan Urinalisis tidak menutupi proteinuria', () => {
    const { container } = render2Lab('kia_preeklampsia_berat', ['urinalisis'])
    const teks = container.textContent ?? ''

    expect(teks).toContain('Urinalisis')
    expect(teks).not.toContain('Dalam batas normal, tidak ada temuan bermakna.')
    expect(teks).toMatch(/Menyatu dengan Protein Urin/)
  })

  it('lab yang benar-benar tak berhubungan TETAP boleh dijawab normal', () => {
    // Foto toraks pada dislipidemia tidak berbagi analit dengan apa pun —
    // penyederhanaan "dalam batas normal" di sini memang benar & ringkas.
    const { container } = render2Lab('mm_dislipidemia', ['foto_toraks'])
    expect(container.textContent).toContain('Dalam batas normal, tidak ada temuan bermakna.')
  })

  it('glukosa berkorelasi: GDS 320 tertulis, memesan GDP TIDAK dijawab normal & TIDAK meminjam angka', () => {
    // kulit_herpes_zoster menulis gds tinggi tanpa gdp/hba1c. GDP bukan bagian
    // dari GDS, jadi hasilnya tak boleh dipinjam — cukup berhenti mengklaim
    // normal dan menunjuk hasil yang sudah ada.
    const { container } = render2Lab('kulit_herpes_zoster', ['gdp', 'gds'])
    const teks = container.textContent ?? ''

    expect(teks).not.toContain('Dalam batas normal, tidak ada temuan bermakna.')
    expect(teks).toMatch(/Tidak dicatat terpisah pada berkas kasus ini/)
    expect(teks).toMatch(/Hasil terkait yang sudah ada: Gula Darah Sewaktu/)
    // dan bukan format pinjam milik pasangan-kandung:
    expect(teks).not.toMatch(/Menyatu dengan/)
  })
})
