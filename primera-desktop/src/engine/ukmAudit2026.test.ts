/**
 * REGRESI — audit CODEX UKM 2026-07-16 (#1 arc buntu Ujian, #3 program per-RW,
 * #12 skala GDP Prolanis). Test kecil terarah; perilaku lengkap tercakup suite
 * kunjungan/m2program yang sudah ada.
 */
import { describe, expect, it } from 'vitest'
import type { GameState } from './state'
import { PACK } from '@content/index'
import { CONTENT_RELEASE } from '@content/pack'
import { arcKunjunganAktif } from './kunjungan'
import {
  AMBANG_TERKENDALI_PROLANIS,
  driftProlanis,
  kartuProlanis,
  prolanisTerkendali,
} from './kegiatan'
import { peluangJanjiDitepati } from './reducer'
import { ambangKlusterPack } from './surveilans'
import { Rng } from './core/rng'
import type { PesertaProlanis } from './state'

describe('#1 — arc kunjungan mode-aware (Gunawan tak buntu di Ujian)', () => {
  const gunawan = PACK.keluarga['keluarga_gunawan']

  it('di Karier seluruh skenario arc Gunawan aktif (k1+k2)', () => {
    if (!gunawan) return // keluarga pilot M13-1a hanya ada di rilis lab
    const arc = arcKunjunganAktif(PACK, gunawan, 'karier', CONTENT_RELEASE)
    expect(arc.map((s) => s.id)).toContain('gunawan_k2')
  })

  it('di Ujian skenario Career-only tersaring — arc PENDEK yang tamat, bukan buntu', () => {
    if (!gunawan) return
    const arcUjian = arcKunjunganAktif(PACK, gunawan, 'ujian', CONTENT_RELEASE)
    const arcKarier = arcKunjunganAktif(PACK, gunawan, 'karier', CONTENT_RELEASE)
    expect(arcUjian.map((s) => s.id)).not.toContain('gunawan_k2')
    expect(arcUjian.length).toBeGreaterThan(0) // masih bisa dimainkan
    expect(arcUjian.length).toBeLessThan(arcKarier.length) // dan memang tersaring
  })

  it('keluarga tanpa skenario mode-terbatas: arc identik di kedua mode (regresi 16 keluarga inti)', () => {
    for (const kel of Object.values(PACK.keluarga)) {
      if (kel.id === 'keluarga_gunawan') continue
      const a = arcKunjunganAktif(PACK, kel, 'karier', CONTENT_RELEASE).map((s) => s.id)
      const b = arcKunjunganAktif(PACK, kel, 'ujian', CONTENT_RELEASE).map((s) => s.id)
      expect(b, kel.id).toEqual(a)
    }
  })
})

describe('#12 — Prolanis DM berskala GDP (kontrol RPPT <130 mg/dL)', () => {
  const peserta = (param: number): PesertaProlanis => ({
    id: 'p_uji', nama: 'Uji', usia: 55, jenisKelamin: 'P', rw: 1,
    keluargaId: 'k_uji', jenis: 'dm', param, takTerkontrolBerturut: 0,
  })

  it('GDP di bawah 130 sesudah intervensi tepat → terkontrol (counter reset)', () => {
    // intervensi tepat menurunkan param 10-30; dari 140 pasti jatuh <130? tidak
    // selalu (140-10=130 tepat ambang) — pakai 135: hasil 105..125, selalu <130.
    const p = driftProlanis(peserta(135), true, new Rng(7, 'uji-gdp'))
    expect(p.param).toBeLessThan(130)
    expect(p.takTerkontrolBerturut).toBe(0)
  })

  it('GDP tinggi yang memburuk → takTerkontrolBerturut naik (ambang 130, bukan 200)', () => {
    const p = driftProlanis(peserta(150), false, new Rng(7, 'uji-gdp'))
    expect(p.param).toBeGreaterThanOrEqual(150)
    expect(p.takTerkontrolBerturut).toBe(1)
  })

  /**
   * REGRESI — audit CODEX 2026-07-16: saat skala DM pindah GDS→GDP (rev 37),
   * HANYA driftProlanis ikut ke <130; kartuProlanis & scoring.ts TERTINGGAL di
   * <200. Peserta GDP 150 tampil "terkendali" di kartu + dihitung terkendali
   * oleh skor, tapi penyakitnya terus memburuk — kartu hijau, penyakit jalan.
   * Tiga modul kini WAJIB memakai satu predikat kanonik.
   */
  it('kartu, skor, dan drift memakai SATU ambang — GDP 150 tak boleh "terkendali" di salah satunya', () => {
    const p150 = peserta(150)

    // (a) predikat kanonik: 150 >= 130 → TIDAK terkendali.
    expect(prolanisTerkendali('dm', 150)).toBe(false)
    expect(prolanisTerkendali('dm', 125)).toBe(true)
    expect(AMBANG_TERKENDALI_PROLANIS.dm).toBe(130)
    expect(AMBANG_TERKENDALI_PROLANIS.ht).toBe(140)

    // (b) kartu: narasi tak boleh mengklaim terkendali pada GDP 150.
    const kartu = kartuProlanis([p150])[0]!
    expect(kartu.narasi.toLowerCase()).not.toContain('terkendali baik')

    // (c) skor: roster berisi satu peserta GDP 150 → rasio terkontrol 0, bukan 1.
    const state = { prolanis: { roster: [p150] } } as unknown as GameState
    const rasio =
      state.prolanis.roster.filter((p) => prolanisTerkendali(p.jenis, p.param)).length /
      state.prolanis.roster.length
    expect(rasio).toBe(0)

    // (d) drift setuju: 150 memburuk → counter naik (tak kontradiksi dgn (b)/(c)).
    expect(driftProlanis(p150, false, new Rng(7, 'uji-konsisten')).takTerkontrolBerturut).toBe(1)
  })
})

describe('#4 — peluang janji ditepati naik dengan trust (bukan hadiah cuma-cuma)', () => {
  it('monoton naik & terkurung [0.35, 0.92]', () => {
    expect(peluangJanjiDitepati(0)).toBeCloseTo(0.35, 5)
    expect(peluangJanjiDitepati(10)).toBeCloseTo(0.9, 1)
    expect(peluangJanjiDitepati(10)).toBeLessThanOrEqual(0.92)
    // Trust rendah TIDAK di bawah lantai; trust tinggi > rendah.
    expect(peluangJanjiDitepati(2)).toBeGreaterThan(peluangJanjiDitepati(0) - 1e-9)
    expect(peluangJanjiDitepati(8)).toBeGreaterThan(peluangJanjiDitepati(3))
  })
})

describe('#13 — ambang KLB ter-ground Permenkes 1/2026 + kalibrasi', () => {
  // M13 Batch 6 (2026-07-16): ambang tak lagi berupa registry hardcoded di
  // surveilans.ts — sumbernya kini `KasusKlinis.ambangKluster` di konten,
  // dibaca `ambangKlusterPack()`. Test membaca PACK supaya yang diuji adalah
  // ambang yang BENAR-BENAR dipakai engine, bukan salinan kedua.
  const ambang = ambangKlusterPack(PACK)

  it('penyakit vektor/berat tetap ambang rendah (2), ISPA ringan dikalibrasi ke 4', () => {
    expect(ambang['dengue_df']).toBe(2)
    expect(ambang['tb_paru']).toBe(2)
    expect(ambang['pneumonia_balita']).toBe(2)
    // Kalibrasi keterjangkauan (audit UKM #13): ISPA 5→4.
    expect(ambang['ispa_common_cold']).toBe(4)
    // Semua ambang tetap ≥2 (kluster = >1 kasus, "peningkatan bermakna").
    for (const n of Object.values(ambang)) expect(n).toBeGreaterThanOrEqual(2)
  })

  it('M13 Batch 6 — kasus infeksi lab kini ikut terpantau surveilans (dulu 0 dari 103)', () => {
    // Regresi atas temuan Batch 6: daftar 8 id hardcoded membuat SELURUH kasus
    // infeksi batch lab mustahil berkluster. Sekarang kasus menular manapun —
    // termasuk yang ditulis batch berikutnya — cukup mendeklarasikan
    // `ambangKluster` di kontennya sendiri.
    expect(ambang['lab_hepatitis_a_akut']).toBe(2)
    expect(ambang['lab_leptospirosis_tanpa_komplikasi']).toBe(2)
    expect(ambang['lab_keracunan_makanan_ringan']).toBe(2)
    expect(ambang['lab_influenza_tanpa_komplikasi']).toBe(4)
    const idLab = Object.keys(ambang).filter((id) => id.startsWith('lab_'))
    expect(idLab.length).toBeGreaterThanOrEqual(10)
  })

  it('kasus TAK menular tetap di luar surveilans (tak ada ambang liar)', () => {
    expect(ambang['hipertensi_esensial']).toBeUndefined()
    expect(ambang['mm_osteoartritis_lutut']).toBeUndefined()
  })
})
