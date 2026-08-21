/**
 * SCORING — dua janji yang harus ditepati ke mahasiswa:
 * (1) stempel grade cocok dengan ANGKA yang tertera di sebelahnya;
 * (2) debrief sore hanya merinci fase yang benar-benar dijalani.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { hitungSkor, ringkasanHarian } from './scoring'
import type { GameState, HasilKunjungan } from './state'

const BASIS = buildInitialState('dr. Uji Skor', 4242, PACK)

/**
 * State yang bisa digeser presisi tinggi: akurasi & kalibrasi sempurna,
 * kunjungan/MI memenuhi ekspektasi beban kerja, satu RW ber-IKS penuh. Sisa
 * pergerakan total hanya dari mutu proses SOAP (0,0105 poin per satuan
 * `sumSkorProses`) dan apathy (−2 poin utuh) — cukup halus untuk mendarat
 * persis di celah pembulatan ambang grade.
 */
function stateSkor(sumSkorProses: number, apathy = 0): GameState {
  return {
    ...BASIS,
    tally: {
      ...BASIS.tally,
      totalPasien: 10,
      diagnosisBenar: 10,
      tegakBenar: 10,
      sumSkorProses,
      kunjunganTotal: 24,
      kunjunganBerhasil: 24,
      miTotal: 24,
      miTepat: 24,
      apathy,
    },
    desa: {
      ...BASIS.desa,
      rw: BASIS.desa.rw.map((r, i) => (i === 0 ? { ...r, iks: 1, kkTersurvei: r.totalKk } : r)),
    },
  }
}

function gradeDariAngkaTampil(tampil: number): string {
  if (tampil >= 85) return 'A'
  if (tampil >= 70) return 'B'
  if (tampil >= 55) return 'C'
  return 'D'
}

describe('grade dan angka yang dibaca mahasiswa', () => {
  it('total mentah 84,9675 → tampil 85,0 dan berstempel A (bukan 85,0 berstempel B)', () => {
    const skor = hitungSkor(stateSkor(235))
    // Jumlah keempat dimensi masih mentah — fixture ini memang mendarat di
    // celah [84,95 .. 85), tempat tampilan dan ambang dulu berselisih.
    const mentah = skor.ukp + skor.ukm + skor.manajemen + skor.resiliensi
    expect(mentah).toBeGreaterThan(84.95)
    expect(mentah).toBeLessThan(85)
    expect(skor.total.toFixed(1)).toBe('85.0')
    expect(skor.total).toBe(85)
    expect(skor.grade).toBe('A')
  })

  it('total mentah 84,915 → tampil 84,9 dan tetap B', () => {
    const skor = hitungSkor(stateSkor(230))
    expect(skor.total.toFixed(1)).toBe('84.9')
    expect(skor.grade).toBe('B')
  })

  it('total yang disimpan sama persis dengan yang ditampilkan (1 desimal)', () => {
    for (let sum = 0; sum <= 1000; sum += 5) {
      const skor = hitungSkor(stateSkor(sum))
      expect(skor.total).toBe(Number(skor.total.toFixed(1)))
    }
  })

  it('lintas ketiga ambang: stempel tak pernah berselisih dengan angkanya', () => {
    for (let apathy = 0; apathy <= 14; apathy += 1) {
      for (let sum = 0; sum <= 1000; sum += 5) {
        const skor = hitungSkor(stateSkor(sum, apathy))
        const tampil = Number(skor.total.toFixed(1))
        expect(`${apathy}/${sum}: ${skor.grade}`).toBe(
          `${apathy}/${sum}: ${gradeDariAngkaTampil(tampil)}`,
        )
      }
    }
  })
})

const KUNJUNGAN_DIUSIR: HasilKunjungan = {
  keluargaId: 'keluarga_wulan',
  skenarioId: 'wulan_k1',
  hasilAkhir: 'diusir',
  berhasil: false,
  diusir: true,
  hipotesisBenar: false,
  trustDelta: -4,
  kualitasMi: 33,
  kualitasSaji: 33,
  indikatorTerverifikasi: [],
  narasiPenutup: 'Pintu ditutup lebih cepat dari biasanya.',
  tingkat: 'gagal',
}

function rincianKunjungan(hasil: HasilKunjungan): string {
  const { catatan } = ringkasanHarian({ ...BASIS, hasilKunjunganHariIni: hasil })
  return catatan.find((c) => c.startsWith('Rincian kunjungan')) ?? ''
}

describe('ringkasanHarian — rincian kunjungan', () => {
  it('fase Ingatkan yang tak pernah ditawarkan tidak dicetak sebagai skor 0', () => {
    const rincian = rincianKunjungan(KUNJUNGAN_DIUSIR)
    expect(rincian).toContain('(MI): 33/100')
    expect(rincian).not.toContain('Fase Ingatkan')
  })

  it('fase Ingatkan yang benar-benar dijalani tetap dirinci apa adanya', () => {
    const rincian = rincianKunjungan({
      ...KUNJUNGAN_DIUSIR,
      hasilAkhir: 'partial',
      diusir: false,
      tingkat: 'partial',
      kualitasMi: 100,
      kualitasIngatkan: 0,
      kualitasSaji: 80,
    })
    expect(rincian).toContain('Fase Ingatkan 0/100')
    expect(rincian).toContain('SAJI 80/100')
  })
})
