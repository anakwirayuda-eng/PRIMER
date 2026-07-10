/**
 * M9.3 — sapuan heuristik: `clue` (mutiara klinis EBM, teks bebas) tak boleh
 * MENJANJIKAN tatalaksana yang tak tercermin STRUKTURAL di `tatalaksana`.
 * Ditulis setelah CODEX ronde-15 menemukan `ppok_eksaserbasi`: clue bilang
 * "antibiotik terindikasi" & `obatSalahUmum` menghukum pilihan SALAH, tapi
 * tak ada satu pun pilihan BENAR — pemain full-score tanpa memenuhi janji
 * clue-nya sendiri (sudah diperbaiki, lihat `pack.test.ts`).
 *
 * Ini pagar PERMANEN (bukan cuma fix satu kasus) — kasus BARU yang menulis
 * clue serupa tanpa tatalaksana yang cocok akan GAGAL di sini otomatis,
 * tanpa menunggu ronde audit berikutnya menemukannya manual.
 *
 * Metodologi: cari kata kunci implikasi ("antibiotik", "kortikosteroid
 * sistemik", dst.) dalam `clue`, TAPI abaikan bila ada kata NEGASI dalam
 * jendela ±45 karakter di sekitarnya ("tidak", "bukan", "jangan", "hindari",
 * "tanpa") — supaya "antibiotik TIDAK diindikasikan" tak salah-tangkap
 * sbg janji yang harus dipenuhi.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from './index'

const KATA_NEGASI = ['tidak', 'bukan', 'jangan', 'hindari', 'tanpa', 'tak perlu', 'tak butuh']
const JENDELA = 45

/**
 * Ada kata negasi dlm jendela ±N karakter dari SETIAP kemunculan `kata`?
 * (CODEX ronde-16 P3: dulu `return true` di kemunculan PERTAMA yang ternegasi
 * — clue campuran "tidak X di awal, tapi nanti X wajib" lolos tanpa dicek krn
 * berhenti sebelum sampai ke kemunculan kedua. Kini SEMUA kemunculan wajib
 * ternegasi baru dianggap aman/di-skip; satu saja tanpa negasi = janji nyata.)
 */
function adaNegasiDekat(teksLower: string, kata: string, jendela: number): boolean {
  let idx = teksLower.indexOf(kata)
  if (idx === -1) return false
  while (idx !== -1) {
    const mulai = Math.max(0, idx - jendela)
    const akhir = Math.min(teksLower.length, idx + kata.length + jendela)
    const sekitar = teksLower.slice(mulai, akhir)
    if (!KATA_NEGASI.some((n) => sekitar.includes(n))) return false
    idx = teksLower.indexOf(kata, idx + 1)
  }
  return true
}

function semuaObatTatalaksana(k: (typeof PACK.kasus)[string]): string[] {
  // M10 §49: obatOpsional ikut — guard ini mendeteksi janji clue yang TAK
  // tercermin STRUKTURAL di mana pun. Obat opsional TETAP dapat diresepkan
  // pemain (tab terapi menampilkannya), jadi "antibiotik topikal opsional"
  // pada hordeolum sudah tercermin & bukan pelanggaran spt ppok (yg NOL slot).
  return [
    ...k.tatalaksana.obatBenar,
    ...(k.tatalaksana.obatAlternatif ?? []).flat(),
    ...(k.tatalaksana.obatOpsional ?? []),
  ]
}

describe('CODEX ronde-16 P3 — adaNegasiDekat wajib cek SEMUA kemunculan, bukan berhenti di yang pertama', () => {
  // Bug lama: `return true` di kemunculan PERTAMA yang ternegasi, walau
  // kemunculan KEDUA kata yang sama membuat janji sungguhan tanpa negasi —
  // clue campuran ("tidak X di awal, tapi nanti X wajib") lolos tanpa dicek.
  it('kemunculan kedua tanpa negasi TETAP terdeteksi (bukan berhenti di kemunculan pertama)', () => {
    const teks = 'antibiotik tidak diperlukan di awal, tapi bila demam menetap, antibiotik wajib diberikan segera'
    expect(adaNegasiDekat(teks, 'antibiotik', JENDELA)).toBe(false)
  })

  it('SEMUA kemunculan ternegasi → tetap true (perilaku lama yg benar terjaga)', () => {
    const teks = 'antibiotik tidak diperlukan; ulangi, antibiotik juga tidak diindikasikan di sini'
    expect(adaNegasiDekat(teks, 'antibiotik', JENDELA)).toBe(true)
  })
})

describe('M9.3 — tatalaksana wajib mencerminkan janji `clue` (sapuan heuristik)', () => {
  it('clue sebut "antibiotik" (tanpa negasi di sekitarnya) → wajib ada antibiotik di obatBenar/obatAlternatif', () => {
    const pelanggar: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      const clueLower = k.clue.toLowerCase()
      if (!clueLower.includes('antibiotik')) continue
      if (adaNegasiDekat(clueLower, 'antibiotik', JENDELA)) continue
      const adaAntibiotik = semuaObatTatalaksana(k).some((id) => PACK.obat[id]?.antibiotik === true)
      if (!adaAntibiotik) pelanggar.push(k.id)
    }
    expect(pelanggar).toEqual([])
  })

  it('clue sebut "kortikosteroid/steroid sistemik/oral" (tanpa negasi) → wajib ada steroid sistemik (bukan topikal saja)', () => {
    const FRASA = ['kortikosteroid sistemik', 'steroid sistemik', 'steroid oral', 'kortikosteroid oral']
    const pelanggar: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      const clueLower = k.clue.toLowerCase()
      const disebut = FRASA.find((f) => clueLower.includes(f))
      if (!disebut || adaNegasiDekat(clueLower, disebut, JENDELA)) continue
      const adaSteroidSistemik = semuaObatTatalaksana(k).some((id) => {
        const kelasLower = PACK.obat[id]?.kelas?.toLowerCase() ?? ''
        return kelasLower.includes('kortikosteroid') && !kelasLower.includes('topikal')
      })
      if (!adaSteroidSistemik) pelanggar.push(k.id)
    }
    expect(pelanggar).toEqual([])
  })

  it('clue minta rujuk kuat ("rujuk segera"/"wajib rujuk"/dst.) → kasus wajib harusDirujuk:true', () => {
    const RUJUK_KUAT = [
      'rujuk segera',
      'segera rujuk',
      'wajib rujuk',
      'harus dirujuk',
      'harus rujuk',
      'rujuk cito',
      'rujuk emergensi',
    ]
    const pelanggar = Object.values(PACK.kasus)
      .filter((k) => RUJUK_KUAT.some((r) => k.clue.toLowerCase().includes(r)) && !k.harusDirujuk)
      .map((k) => k.id)
    expect(pelanggar).toEqual([])
  })
})
