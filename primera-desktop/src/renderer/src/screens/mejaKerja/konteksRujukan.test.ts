/**
 * TEST — bendera rujukan: kabar kembali ≠ pekerjaan selesai.
 *
 * Menutup seam yang membuat temuan P1-1 (audit CODEX 2026-08-03) lolos:
 * storylet.test.ts menyuapkan bendera secara langsung, jadi tak ada satu pun
 * test yang memeriksa state MANA yang pantas disebut tuntas.
 *
 * Skenario andalannya diverifikasi lebih dulu pada reducer asli: merujuk kasus
 * yang sebenarnya kompetensi FKTP (rujukan berlebih — justru kesalahan yang
 * ingin diajarkan game ini) membuat RS menolak, dan reducer menandai episode
 * itu `referral.stage: 'feedback'` + `status: 'kembali'` pada aksi yang sama.
 */
import { describe, expect, it } from 'vitest'
import type { CareEpisodeLite, StatusEpisode, TahapRujukan } from '@engine/state'
import { benderaRujukan } from './konteksRujukan'
import { kandidatStorylet } from './storylet'

function episode(
  ubah: { stage?: TahapRujukan; status?: StatusEpisode; note?: string; tanpaRujukan?: boolean } = {},
): CareEpisodeLite {
  return {
    id: 'ep1',
    subjectId: 'p1',
    subjectName: 'Budi',
    source: 'klinik',
    problemId: 'ispa',
    problemLabel: 'ISPA',
    owner: 'dokter',
    status: ubah.status ?? 'ditindaklanjuti',
    openedDay: 4,
    updatedDay: 4,
    nextAction: 'Tuntaskan di poli besok.',
    ...(ubah.tanpaRujukan
      ? {}
      : { referral: { stage: ubah.stage ?? 'sent', hospitalName: 'RSUD Umum', note: ubah.note } }),
    receipt: { signal: 'keluhan', next: 'kontrol' },
    history: [],
  } as CareEpisodeLite
}

describe('benderaRujukan — memisahkan alur informasi dari alur tindakan', () => {
  it('rujukan DITOLAK RS bukan rujukan tuntas (skenario andalan temuan P1-1)', () => {
    // Persis yang ditulis reducer.ts:886-888 saat RS menolak rujukan
    // non-spesialistik: pasien dipulangkan, harus digarap sendiri besok.
    const ditolak = [episode({ stage: 'feedback', status: 'kembali', note: 'Kompetensi FKTP' })]
    const b = benderaRujukan(ditolak)

    expect(b.rujukanTuntas).toBe(false)
    expect(b.rujukanUmpanBalik).toBe(true)
  })

  it('rujukan salah tujuan juga bukan rujukan tuntas', () => {
    const salahTujuan = [
      episode({ stage: 'feedback', status: 'kembali', note: 'Tujuan tidak sesuai' }),
    ]
    expect(benderaRujukan(salahTujuan).rujukanTuntas).toBe(false)
  })

  it('umpan balik yang baru TIBA belum tuntas — baru tuntas setelah diadopsi', () => {
    expect(benderaRujukan([episode({ stage: 'feedback' })].slice()).rujukanTuntas).toBe(false)
    expect(benderaRujukan([episode({ stage: 'acted' })]).rujukanTuntas).toBe(true)
  })

  it('episode terverifikasi tetap dihitung tuntas', () => {
    expect(benderaRujukan([episode({ status: 'terverifikasi' })]).rujukanTuntas).toBe(true)
  })

  it('berkas terkirim tanpa kabar = menunggu, bukan umpan balik & bukan tuntas', () => {
    const b = benderaRujukan([episode({ stage: 'sent' })])
    expect(b).toEqual({ rujukanMenunggu: true, rujukanUmpanBalik: false, rujukanTuntas: false })
  })

  it('episode tanpa rujukan tidak menyalakan bendera rujukan mana pun', () => {
    const b = benderaRujukan([episode({ tanpaRujukan: true })])
    expect(b).toEqual({ rujukanMenunggu: false, rujukanUmpanBalik: false, rujukanTuntas: false })
  })
})

/* kandidatStorylet mengembalikan TEKS-nya, bukan id — dan justru itu yang
   tepat diuji di sini: yang dibaca pemain adalah kalimatnya. */
const KLAIM_TINDAKAN_SELESAI = [
  'Rangkaian ditutup karena ada bukti tindakan',
  'keluarga menerima penjelasan rencana lanjut',
]
const KLAIM_INFORMASI_KEMBALI = [
  'Alur informasi benar-benar kembali ke Puskesmas',
  'tercatat dalam satu jejak yang dapat diaudit',
]

function memuat(teks: readonly string[], potongan: string): boolean {
  return teks.some((t) => t.includes(potongan))
}

describe('kalimat yang boleh muncul pada tiap tahap', () => {
  it('rujukan ditolak: debrief TIDAK boleh mengklaim rangkaian ditutup / keluarga sudah dikonseling', () => {
    const { rujukanUmpanBalik, rujukanTuntas } = benderaRujukan([
      episode({ stage: 'feedback', status: 'kembali', note: 'Kompetensi FKTP' }),
    ])
    const kandidat = kandidatStorylet({ rujukanUmpanBalik, rujukanTuntas })

    for (const klaim of KLAIM_TINDAKAN_SELESAI) {
      expect(memuat(kandidat, klaim)).toBe(false)
    }
  })

  it('kabar baru tiba: klaim ALUR INFORMASI tetap boleh — itu memang benar', () => {
    const { rujukanUmpanBalik, rujukanTuntas } = benderaRujukan([episode({ stage: 'feedback' })])
    const kandidat = kandidatStorylet({ rujukanUmpanBalik, rujukanTuntas })

    for (const klaim of KLAIM_INFORMASI_KEMBALI) {
      expect(memuat(kandidat, klaim)).toBe(true)
    }
    for (const klaim of KLAIM_TINDAKAN_SELESAI) {
      expect(memuat(kandidat, klaim)).toBe(false)
    }
  })

  it('sesudah umpan balik diadopsi: keempat kalimat boleh muncul', () => {
    const { rujukanUmpanBalik, rujukanTuntas } = benderaRujukan([episode({ stage: 'acted' })])
    const kandidat = kandidatStorylet({ rujukanUmpanBalik, rujukanTuntas })

    for (const klaim of [...KLAIM_INFORMASI_KEMBALI, ...KLAIM_TINDAKAN_SELESAI]) {
      expect(memuat(kandidat, klaim)).toBe(true)
    }
  })

  it('tanpa bendera apa pun, tak satu pun kabar rujukan muncul', () => {
    const kandidat = kandidatStorylet({})
    for (const klaim of [...KLAIM_INFORMASI_KEMBALI, ...KLAIM_TINDAKAN_SELESAI]) {
      expect(memuat(kandidat, klaim)).toBe(false)
    }
  })
})
