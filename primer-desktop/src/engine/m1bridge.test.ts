/**
 * M1 — BRIDGE PENUH UKM↔UKP: test integrasi keenam mekanik di atas konten
 * produksi (PACK). Deterministik penuh (seed tetap).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { buildInitialState } from './init'
import { clusterAktif } from './surveilans'

const SEED = 20260702

function run(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

/** IGD interrupt (M3.14) memblokir LANJUTKAN — tangani optimal bila muncul. */
function bereskanIgd(state: GameState): GameState {
  let cur = state
  let guard = 0
  while (cur.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[cur.igd.kasusId]!
    if (cur.igd.fase === 'langkah') {
      const l = kasus.langkah[cur.igd.langkahIndex]!
      cur = run(cur, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id })
    } else if (cur.igd.fase === 'kode_biru') cur = run(cur, { type: 'RJP_IGD', berkualitas: true })
    else if (cur.igd.fase === 'disposisi') cur = run(cur, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    else break
  }
  return cur
}

/** Lewati satu hari penuh: pagi (buang antrian) → siang → sore → pagi besok. */
function lewatiHari(s: GameState): GameState {
  let cur = bereskanIgd(s)
  while (cur.klinik.aktif) throw new Error('encounter aktif — selesaikan dulu')
  cur = run(cur, { type: 'LANJUTKAN' }) // → siang
  cur = run(cur, { type: 'LANJUTKAN' }) // → sore
  cur = run(cur, { type: 'LANJUTKAN' }) // → hari baru
  return cur
}

function sampaiHari(s: GameState, hari: number): GameState {
  let cur = s
  while (cur.hari < hari) cur = lewatiHari(cur)
  return cur
}

/**
 * Mainkan kunjungan keluarga sampai selesai dengan hasil terkontrol.
 * hipotesis/intervensi 'benar'|'salah' dipetakan ke konten skenario nyata.
 */
function mainkanKunjungan(
  s: GameState,
  keluargaId: string,
  opsi: { hipotesis: 'benar' | 'salah'; intervensi: 'cocok' | 'salah' },
): GameState {
  const kel = s.desa.keluarga[keluargaId]
  const content = PACK.keluarga[keluargaId]
  if (!kel || !content) throw new Error('keluarga tidak ada')
  const skenario = content.arc.kunjungan[kel.arcIndex]
  if (!skenario) throw new Error('arc habis')

  let cur = run(s, { type: 'MULAI_KUNJUNGAN', keluargaId })
  if (!cur.kunjungan) throw new Error('kunjungan gagal mulai (cek guard/blok)')

  // Observasi: temukan semua hotspot ber-indikator.
  for (const h of skenario.hotspot) {
    if (h.indikator) cur = run(cur, { type: 'KLIK_HOTSPOT', hotspotId: h.id })
  }
  cur = run(cur, { type: 'LANJUT_BABAK' })

  // Wawancara: selalu pilih pilihan `tepat` pertama (tanpa konfrontasi).
  for (const node of skenario.dialog) {
    const pilihan = node.pilihan.find((p) => p.tepat) ?? node.pilihan[0]
    if (!pilihan) throw new Error('node tanpa pilihan')
    cur = run(cur, { type: 'PILIH_DIALOG', pilihanId: pilihan.id })
  }
  cur = run(cur, { type: 'LANJUT_BABAK' })

  // Diagnosis perilaku.
  const semuaHambatan = ['kapabilitas', 'kesempatan', 'motivasi'] as const
  const hipotesis =
    opsi.hipotesis === 'benar'
      ? skenario.hambatanSebenarnya
      : semuaHambatan.find((h) => h !== skenario.hambatanSebenarnya)!
  cur = run(cur, { type: 'KOMIT_HAMBATAN', hipotesis })

  // Resep sosial.
  const kartuCocok = skenario.intervensi.find((i) => i.cocokUntuk.includes(skenario.hambatanSebenarnya))!
  const kartuSalah = skenario.intervensi.find((i) => !i.cocokUntuk.includes(skenario.hambatanSebenarnya))!
  cur = run(cur, {
    type: 'PILIH_INTERVENSI',
    intervensiId: opsi.intervensi === 'cocok' ? kartuCocok.id : kartuSalah.id,
  })
  return cur
}

/** Sampai blok siang hari tertentu (untuk kunjungan). */
function sampaiSiang(s: GameState, hari: number): GameState {
  let cur = bereskanIgd(sampaiHari(s, hari))
  cur = run(cur, { type: 'LANJUTKAN' }) // pagi → siang (antrian di-auto-resolve)
  expect(cur.blok).toBe('siang')
  return cur
}

describe('M1.1 — bridge bertingkat (partial menunda, gagal mempercepat)', () => {
  it('partial (hipotesis benar, intervensi salah) menunda karma +3 hari', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const jatuhTempoAwal = s.jadwal.find((j) => j.keluargaId === 'keluarga_wulan')!.hari
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'benar', intervensi: 'salah' })
    expect(s.hasilKunjunganHariIni?.tingkat).toBe('partial')
    const karma = s.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')
    expect(karma?.hari).toBe(jatuhTempoAwal + 3)
    expect(s.desa.keluarga['keluarga_wulan']?.karmaAktif?.jatuhTempoHari).toBe(jatuhTempoAwal + 3)
    expect(s.tally.karmaDicegah).toBe(0)
  })

  it('gagal total (hipotesis & intervensi salah) mempercepat karma −2 hari', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const jatuhTempoAwal = s.jadwal.find((j) => j.keluargaId === 'keluarga_wulan')!.hari
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'salah', intervensi: 'salah' })
    expect(s.hasilKunjunganHariIni?.tingkat).toBe('gagal')
    const karma = s.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')
    expect(karma?.hari).toBe(Math.max(s.hari + 1, jatuhTempoAwal - 2))
  })

  it('berhasil tetap membatalkan karma (regresi)', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'benar', intervensi: 'cocok' })
    expect(s.hasilKunjunganHariIni?.tingkat).toBe('berhasil')
    expect(s.jadwal.some((j) => j.jenis === 'karma_igd' && j.keluargaId === 'keluarga_wulan')).toBe(false)
    expect(s.tally.karmaDicegah).toBe(1)
  })
})

describe('M1.2 — surveilans balik UKP→UKM', () => {
  it('dua dengue dari RW sama dalam 14 hari = kluster + surat sinyal', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    // Suntik entri surveilans langsung (jalur DISPOSISI teruji di clinic.test) —
    // di sini yang diuji: deteksi kluster + surat + dedup flag.
    s = {
      ...s,
      desa: {
        ...s.desa,
        surveilans: [
          { hari: 1, rw: 4, kasusId: 'dengue_df' },
          { hari: 2, rw: 4, kasusId: 'dengue_df' },
        ],
      },
    }
    expect(clusterAktif(s)).toHaveLength(1)
    s = lewatiHari(s) // hariBaru mendeteksi & menyurati
    const suratKluster = s.inbox.filter((m) => m.judul.includes('SINYAL KLUSTER'))
    expect(suratKluster).toHaveLength(1)
    expect(suratKluster[0]!.judul).toContain('Demam')
    // Dedup: hari berikutnya tidak menyurati ulang kluster yang sama.
    s = lewatiHari(s)
    expect(s.inbox.filter((m) => m.judul.includes('SINYAL KLUSTER'))).toHaveLength(1)
  })

  it('entri kedaluwarsa (>14 hari) terpangkas — kluster padam', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = {
      ...s,
      desa: { ...s.desa, surveilans: [{ hari: 1, rw: 2, kasusId: 'dengue_df' }, { hari: 1, rw: 2, kasusId: 'dengue_df' }] },
    }
    s = sampaiHari(s, 16)
    expect(s.desa.surveilans).toHaveLength(0)
    expect(clusterAktif(s)).toHaveLength(0)
  })

  it('diagnosis menular di poli tercatat ke surveilans saat disposisi', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    // Cari hari yang antriannya memuat kasus menular; mainkan minimal lalu pulangkan.
    for (let percobaan = 0; percobaan < 10; percobaan++) {
      const idx = s.klinik.antrian.findIndex((p) => PACK.kasus[p.kasusId] && ['dengue_df', 'diare_akut_anak', 'ispa_common_cold', 'demam_tifoid', 'skabies', 'konjungtivitis_bakterial', 'tb_paru'].includes(p.kasusId))
      if (idx === 0) {
        const pasien = s.klinik.antrian[0]!
        const kasus = PACK.kasus[pasien.kasusId]!
        s = run(s, { type: 'PANGGIL_PASIEN' })
        s = run(s, { type: 'LANJUT_FASE' }) // anamnesis → pemeriksaan
        s = run(s, { type: 'LANJUT_FASE' }) // pemeriksaan → diagnosis
        s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' }) // → terapi
        s = run(s, { type: 'LANJUT_FASE' }) // terapi → disposisi
        s = run(s, { type: 'DISPOSISI', jenis: kasus.harusDirujuk ? 'rujuk' : 'pulang' })
        expect(s.desa.surveilans.some((e) => e.kasusId === pasien.kasusId && e.rw === pasien.rw)).toBe(true)
        return
      }
      s = lewatiHari(s)
    }
    throw new Error('tidak menemukan kasus menular di antrian 10 hari — cek Director')
  })
})

describe('reducer — DISPOSISI phase-guard (CODEX audit 2026-07-04, temuan #2 §9)', () => {
  it('DISPOSISI ditolak bila fase belum disposisi, walau diagnosis sudah di-komit', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PANGGIL_PASIEN' })
    s = run(s, { type: 'LANJUT_FASE' }) // anamnesis → pemeriksaan
    s = run(s, { type: 'LANJUT_FASE' }) // pemeriksaan → diagnosis
    const kasus = PACK.kasus[s.klinik.aktif!.pasien.kasusId]!
    s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' }) // → terapi
    // Masih di fase terapi (belum LANJUT_FASE ke disposisi) — DISPOSISI harus ditolak.
    const sebelum = s
    s = run(s, { type: 'DISPOSISI', jenis: 'pulang' })
    expect(s.klinik.aktif).toBeDefined() // encounter belum selesai
    expect(s.klinik.selesaiHariIni).toEqual(sebelum.klinik.selesaiHariIni)
    expect(s.inbox).toEqual(sebelum.inbox)
  })

  // Audit CODEX 2026-07-04 (ronde-6): reducer men-cek `enc.labDipesan` (state
  // SEBELUM aksiKlinik) utk memutuskan billing/jadwal, bukan `hasil.enc`
  // (SESUDAH) — jadi PESAN_LAB yang ditolak phase-guard (fase bukan
  // pemeriksaan) tetap membakar kapitasi & membuat jadwal hasil lab, padahal
  // labDipesan sendiri tetap kosong. Efek tanpa sebab: pemain "didenda" utk
  // aksi yang menurut UI/engine tidak pernah terjadi.
  it('PESAN_LAB yang ditolak phase-guard TIDAK membakar kapitasi atau membuat jadwal', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PANGGIL_PASIEN' })
    expect(s.klinik.aktif!.fase).toBe('anamnesis') // belum ke pemeriksaan
    const kapitasiSebelum = s.kapitasi
    const jadwalSebelum = s.jadwal.length

    const { state: setelah, events } = advance(s, { type: 'PESAN_LAB', labId: 'hba1c' }, PACK)

    expect(events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    expect(setelah.klinik.aktif!.labDipesan).toEqual([])
    expect(setelah.kapitasi).toBe(kapitasiSebelum)
    expect(setelah.jadwal).toHaveLength(jadwalSebelum)
  })
})

describe('M1.3 — drift keluarga rawan (memburuk, bukan membaik)', () => {
  it('keluarga rawan ber-data yang diabaikan ≥7 hari memburuk + surat kader (cap 2/minggu)', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PILIH_BINAAN', keluargaId: 'keluarga_santoso' })
    // Jangan pernah kunjungi siapa pun; kader mengisi data; jalan sampai hari 14.
    s = sampaiHari(s, 14)
    const suratDrift = s.inbox.filter((m) => m.judul.includes('kabar kurang baik'))
    expect(suratDrift.length).toBeGreaterThanOrEqual(1)
    // Cap mingguan: tidak pernah lebih dari 2 kejadian dalam pekan berjalan.
    expect(s.desa.drift.jumlah).toBeLessThanOrEqual(2)
  })
})

describe('M1.4 — follow-up berkalender', () => {
  it('kunjungan berhasil membuat janji follow-up; mangkir → TTM mundur + surat', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiSiang(s, 3)
    s = mainkanKunjungan(s, 'keluarga_wulan', { hipotesis: 'benar', intervensi: 'cocok' })
    const kel = s.desa.keluarga['keluarga_wulan']!
    expect(kel.ttm).toBe('kontemplasi')
    expect(kel.followUpHari).toBe(3 + 4)
    // Mangkir: biarkan lewat jatuh tempo + 1.
    s = sampaiHari(s, 9)
    const kelSesudah = s.desa.keluarga['keluarga_wulan']!
    expect(kelSesudah.followUpHari).toBeUndefined()
    expect(kelSesudah.ttm).toBe('prekontemplasi')
    expect(s.inbox.some((m) => m.judul.includes('janji kontrol terlewat'))).toBe(true)
  })
})

describe('M1.5 — KBK kapitasi bulanan', () => {
  it('hari 31: kapitasi masuk dengan pengali KBK + surat BPJS', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const kapitasiSebelum = () => s.kapitasi
    const sebelum = kapitasiSebelum()
    s = sampaiHari(s, 31)
    const suratKbk = s.inbox.filter((m) => m.dari === 'BPJS Kesehatan')
    expect(suratKbk).toHaveLength(1)
    expect(suratKbk[0]!.judul).toContain('Kapitasi bulan ini')
    // Kapitasi bertambah minimal 6jt×0.8 (pengali terburuk) MINUS operasional
    // bulanan M4.19 (2,5jt) — laporan bulanan kini satu paket dengan gajian KBK.
    expect(s.kapitasi).toBeGreaterThanOrEqual(sebelum + 4_800_000 - 2_500_000)
    expect(s.inbox.some((m) => m.judul.includes('Laporan keuangan bulanan'))).toBe(true)
  })
})

describe('M1.6 — SDOH armor', () => {
  it('keluarga miskin + hipotesis salah → kenaikan trust dipangkas setengah', () => {
    // keluarga_ketut: ekonomi miskin (RW 7 terpencil — butuh 2 stamina).
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiSiang(s, 3)
    const trustAwal = s.desa.keluarga['keluarga_ketut']!.trust
    s = mainkanKunjungan(s, 'keluarga_ketut', { hipotesis: 'salah', intervensi: 'cocok' })
    const hasil = s.hasilKunjunganHariIni!
    expect(hasil.armorAktif).toBe(true)
    // Delta yang diterapkan = floor(deltaMentah/2) — verifikasi via trust akhir.
    const trustAkhir = s.desa.keluarga['keluarga_ketut']!.trust
    expect(trustAkhir - trustAwal).toBe(hasil.trustDelta)
    expect(hasil.trustDelta).toBeLessThanOrEqual(5) // dipangkas dari delta penuh pilihan tepat semua
  })

  it('hipotesis benar menembus armor (trust penuh)', () => {
    let s1 = buildInitialState('Uji', SEED, PACK)
    s1 = sampaiSiang(s1, 3)
    s1 = mainkanKunjungan(s1, 'keluarga_ketut', { hipotesis: 'benar', intervensi: 'cocok' })
    expect(s1.hasilKunjunganHariIni!.armorAktif).toBeUndefined()
  })
})
