import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PACK } from '@content/index'
import type { ContentPack } from '@content/pack'
import { buatEncounter } from '@engine/clinic'
import { Rng } from '@engine/core/rng'
import { buatPasienDariKasus } from '@engine/director'
import type { EncounterState } from '@engine/state'
import { sidikJariPack } from '@engine/verifikasi'
import { DeckAnamnesis } from './DeckAnamnesis'

function buatEncounterKasus(kasusId: string, ditanya: string[] = []): EncounterState {
  const pasien = buatPasienDariKasus(kasusId, PACK, new Rng(20260713, `anamnesis-${kasusId}`))
  return { ...buatEncounter(pasien), ditanya }
}

function renderDeck(kasusId: string, ditanya: string[] = []): void {
  render(
    <DeckAnamnesis
      enc={buatEncounterKasus(kasusId, ditanya)}
      kasus={PACK.kasus[kasusId]!}
      dispatch={vi.fn()}
      lastEvents={[]}
      eventTick={0}
    />,
  )
}

describe('<DeckAnamnesis /> - progressive disclosure ringan-plus', () => {
  it('awal encounter hanya menampilkan pertanyaan keluhan utama', () => {
    renderDeck('mm_isk_bawah')

    expect(screen.getByRole('button', { name: 'Keluhan saat berkemihnya seperti apa?' })).toBeEnabled()
    expect(
      screen.queryByRole('button', {
        name: 'Ada nyeri pinggang belakang, demam tinggi, atau menggigil?',
      }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Riwayat Penyakit Sekarang')).not.toBeInTheDocument()
  })

  it('setelah satu pembuka dijawab, kategori anamnesis lanjutan tersedia', () => {
    renderDeck('mm_isk_bawah', ['q_keluhan'])

    expect(screen.getByText('Riwayat Penyakit Sekarang')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Ada nyeri pinggang belakang, demam tinggi, atau menggigil?',
      }),
    ).toBeEnabled()
    expect(screen.getByText('Riwayat Sosial & Kebiasaan')).toBeInTheDocument()
  })

  it('pertanyaan fokus dengan prasyarat tidak muncul sebelum konteksnya digali', () => {
    const { rerender } = render(
      <DeckAnamnesis
        enc={buatEncounterKasus('kia_malaria_falsiparum')}
        kasus={PACK.kasus['kia_malaria_falsiparum']!}
        dispatch={vi.fn()}
        lastEvents={[]}
        eventTick={0}
      />,
    )

    expect(
      screen.queryByRole('button', {
        name: 'Belakangan ini bepergian ke daerah endemis malaria? Kapan pulang?',
      }),
    ).not.toBeInTheDocument()

    rerender(
      <DeckAnamnesis
        enc={buatEncounterKasus('kia_malaria_falsiparum', ['q_keluhan'])}
        kasus={PACK.kasus['kia_malaria_falsiparum']!}
        dispatch={vi.fn()}
        lastEvents={[]}
        eventTick={1}
      />,
    )

    expect(
      screen.getByRole('button', {
        name: 'Belakangan ini bepergian ke daerah endemis malaria? Kapan pulang?',
      }),
    ).toBeEnabled()
  })

  it('setiap kasus memiliki pembuka yang kompatibel dengan demografi pasien', () => {
    for (const kasus of Object.values(PACK.kasus)) {
      for (const jenisKelamin of ['L', 'P'] as const) {
        if (kasus.demografi.jenisKelamin && kasus.demografi.jenisKelamin !== jenisKelamin) continue
        const pembuka = kasus.anamnesis.filter(
          (q) =>
            q.kategori === 'keluhan_utama' &&
            (q.hanyaUntuk === undefined || q.hanyaUntuk === jenisKelamin),
        )
        expect(pembuka.length, `${kasus.id}/${jenisKelamin}`).toBeGreaterThan(0)
      }
    }
  })

  it('setiap prasyarat menunjuk pertanyaan sebelumnya dan kompatibel dengan gender', () => {
    for (const kasus of Object.values(PACK.kasus)) {
      const posisi = new Map(kasus.anamnesis.map((q, index) => [q.id, index]))
      const pertanyaan = new Map(kasus.anamnesis.map((q) => [q.id, q]))
      for (const q of kasus.anamnesis) {
        for (const prasyaratId of q.bukaSetelah ?? []) {
          const prasyarat = pertanyaan.get(prasyaratId)
          expect(prasyarat, `${kasus.id}/${q.id} -> ${prasyaratId}`).toBeDefined()
          expect(posisi.get(prasyaratId)!, `${kasus.id}/${q.id}`).toBeLessThan(posisi.get(q.id)!)
          if (q.hanyaUntuk === undefined) expect(prasyarat?.hanyaUntuk).toBeUndefined()
          else expect([undefined, q.hanyaUntuk]).toContain(prasyarat?.hanyaUntuk)
        }
      }
    }
  })

  it('metadata progressive disclosure tidak mengubah fingerprint replay', () => {
    const malaria = PACK.kasus['kia_malaria_falsiparum']!
    const tanpaGate: ContentPack = {
      ...PACK,
      kasus: {
        ...PACK.kasus,
        kia_malaria_falsiparum: {
          ...malaria,
          anamnesis: malaria.anamnesis.map(({ bukaSetelah: _bukaSetelah, ...q }) => q),
        },
      },
    }
    expect(sidikJariPack(tanpaGate)).toBe(sidikJariPack(PACK))
  })

  it('keluhan awal malaria tidak membocorkan riwayat perjalanan', () => {
    const keluhan = PACK.kasus['kia_malaria_falsiparum']!.keluhanUtama.toLocaleLowerCase('id-ID')
    expect(keluhan).not.toContain('papua')
    expect(keluhan).not.toContain('baru pulang')
  })
})
