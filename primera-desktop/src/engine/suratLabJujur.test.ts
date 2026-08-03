/**
 * TEST — surat hasil lab pagi tidak boleh mengarang "dalam batas rujukan".
 *
 * Latar (playtest dr. Wirayuda 2026-08-04 + pengukuran lanjutan). Kasus
 * mendefinisikan hasil hanya untuk lab yang relevan dengannya. Bila pemain
 * memesan lab di luar itu, surat pagi dulu SELALU berbunyi "dalam batas
 * rujukan — tidak menunjukkan kelainan bermakna untuk kasus ini".
 *
 * Penyederhanaan itu benar untuk lab yang sungguh tak berhubungan, tetapi
 * menjadi kebohongan begitu dua pemeriksaan berbagi/berkorelasi analit.
 * Terukur: 10 kasus menulis GDS/GDP abnormal tanpa menulis HbA1c, dan HbA1c
 * adalah SATU-SATUNYA lab berkorelasi yang hasilnya datang besok. Jadi pasien
 * hiperglikemik yang dipesankan HbA1c menerima surat pagi yang menyatakan
 * tidak ada kelainan — mengajarkan hal yang salah pada momen yang paling
 * diingat pemain.
 *
 * Sisi layar sudah dijaga terpisah (LembarPeriksa + labTumpangTindih);
 * berkas ini menjaga permukaan terakhirnya.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { KELOMPOK_KORELASI } from '@content/labTumpangTindih'
import { buildInitialState } from './init'
import { advance } from './reducer'
import type { GameState } from './state'

/** Jalankan satu hari penuh sampai surat pagi berikutnya terbit. */
function suratSetelahPesanLab(kasusId: string, labId: string): string[] {
  let s: GameState = buildInitialState('dr. Uji Surat', 11, PACK)
  // Sisipkan jadwal hasil lab langsung — jalur yang sama dipakai reducer saat
  // pemain memesan lab `hasilBesok`, tanpa perlu memaksa kasus tertentu muncul
  // di antrian acak.
  s = {
    ...s,
    jadwal: [
      ...s.jadwal,
      { id: 'uji_lab', jenis: 'hasil_lab', hari: s.hari + 1, labId, kasusId, catatan: 'pasien uji' },
    ],
  } as GameState

  // Majukan hingga hari berganti (blok pagi hari berikutnya memproses jadwal).
  let aman = 0
  while (s.hari === 1 && aman < 30) {
    s = advance(s, { type: 'LANJUTKAN' }, PACK).state
    aman++
  }
  return s.inbox.filter((surat) => surat.jenis === 'hasil_lab').map((surat) => surat.isi)
}

describe('surat hasil lab pagi — kejujuran', () => {
  it('lab yang TIDAK ditulis kasus: surat tidak mengklaim normal', () => {
    // kulit_herpes_zoster menulis GDS 210 tinggi, tidak menulis HbA1c.
    const isi = suratSetelahPesanLab('kulit_herpes_zoster', 'hba1c').join(' ')

    expect(isi).not.toMatch(/dalam batas rujukan/i)
    expect(isi).not.toMatch(/tidak menunjukkan kelainan bermakna/i)
    expect(isi).toMatch(/tidak tercatat pada berkas pasien ini/i)
    expect(isi).toMatch(/Jangan menganggapnya normal/i)
    // Pesan stewardship dipertahankan — memesan lab tanpa indikasi tetap
    // pelajaran yang ingin diajarkan.
    expect(isi).toMatch(/beban biaya bagi Puskesmas/i)
  })

  it('lab yang DITULIS kasus: surat tetap melaporkan hasil aslinya', () => {
    // dm_tipe2 menulis hba1c — jalur normal tidak boleh ikut berubah.
    const punyaHba1c = PACK.kasus['dm_tipe2']?.lab.some((l) => l.id === 'hba1c')
    expect(punyaHba1c, 'prasyarat: dm_tipe2 menulis hba1c').toBe(true)

    const isi = suratSetelahPesanLab('dm_tipe2', 'hba1c').join(' ')
    expect(isi).toMatch(/Hasil pemeriksaan/i)
    expect(isi).not.toMatch(/tidak tercatat pada berkas pasien ini/i)
  })

  it('HbA1c memang satu-satunya lab berkorelasi ber-hasilBesok — asumsi test ini dijaga', () => {
    // Bila kelak ada lab korelasi lain yang hasilnya besok, test di atas harus
    // diperluas; gerbang ini yang memberi tahu.
    const korelasiBesok = KELOMPOK_KORELASI.flat().filter((id) => PACK.lab[id]?.hasilBesok)
    expect(korelasiBesok).toEqual(['hba1c'])
  })
})
