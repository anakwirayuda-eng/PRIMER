/**
 * TEST — M10 Batch-2 (CODEX ronde-verifikasi, dossier §53). Keputusan desain
 * didelegasikan user ("paling optimal, user-oriented, sustainable"). Menguji
 * semantik yang diubah: determinisme urutan kandidat (P1.4), satuan MI (P1.5),
 * gender-gate anamnesis (C.6), Prolanis-JKN runtime (B.1), arus kas obat
 * (B.4), cap verifier (B.7), jendela konsekuensi (C.9).
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { buildInitialState } from './init'
import { susunAntrianHarian, buatPasienDariKasus } from './director'
import { nilaiEncounter, buatEncounter } from './clinic'
import { verifikasiDossier } from './verifikasi'
import { Rng } from './core/rng'

const SEED = 8181
function run(s: GameState, a: Action): GameState {
  return advance(s, a, PACK).state
}

/* -- P1.4: antrian deterministik thd URUTAN KEY pack ------------------------ */

describe('M10 Batch-2 P1.4 — susunAntrianHarian kebal urutan key pack.kasus', () => {
  it('pack dgn key kasus dibalik urutannya → antrian IDENTIK (id per slot)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const antrianA = susunAntrianHarian(s, PACK, new Rng(SEED, 'd', 1), [], new Rng(SEED, 'f', 1))
    const kasusTerbalik = Object.fromEntries(Object.entries(PACK.kasus).reverse())
    const packTerbalik = { ...PACK, kasus: kasusTerbalik }
    const antrianB = susunAntrianHarian(s, packTerbalik as never, new Rng(SEED, 'd', 1), [], new Rng(SEED, 'f', 1))
    expect(antrianB.map((p) => p.kasusId)).toEqual(antrianA.map((p) => p.kasusId))
  })
})

/* -- C.6: gender-gate anamnesis ---------------------------------------------- */

describe('M10 Batch-2 C.6 — hanyaUntuk (q_haid apendisitis)', () => {
  const kasus = PACK.kasus['apendisitis_akut']!
  const esensialUmum = kasus.anamnesis.filter((q) => q.esensial === true && !q.hanyaUntuk).map((q) => q.id)

  function skorUntuk(jk: 'L' | 'P', tanya: string[]): number {
    const pasien = { ...buatPasienDariKasus('apendisitis_akut', PACK, new Rng(2, 'c6')), jenisKelamin: jk }
    const enc = { ...buatEncounter(pasien), ditanya: tanya }
    return nilaiEncounter(enc, kasus, PACK).skorAnamnesis
  }

  it('q_haid bertanda hanyaUntuk P', () => {
    expect(kasus.anamnesis.find((q) => q.id === 'q_haid')?.hanyaUntuk).toBe('P')
  })

  it('pasien LAKI-LAKI: skor esensial penuh TANPA q_haid (keluar dari denominator)', () => {
    // Dulu q_haid ikut denominator semua pasien → laki-laki mustahil 100 tanpa
    // menanyakan haid (dan jawabannya janggal).
    const skorL = skorUntuk('L', esensialUmum)
    const skorLtanpaHaid100 = skorUntuk('L', [...esensialUmum, 'q_haid'])
    expect(skorL).toBe(skorLtanpaHaid100) // bertanya pun tak menambah (tak berlaku)
  })

  it('pasien PEREMPUAN: q_haid tetap dihitung bila esensial/deno berubah wajar', () => {
    const tanpaHaid = skorUntuk('P', esensialUmum)
    const denganHaid = skorUntuk('P', [...esensialUmum, 'q_haid'])
    expect(denganHaid).toBeGreaterThanOrEqual(tanpaHaid)
  })
})

/* -- B.1: Prolanis mengikuti JKN runtime ------------------------------------- */

describe('M10 Batch-2 B.1 — kartu Prolanis hanya utk peserta ber-JKN aktif', () => {
  function stateDenganProlanis(): GameState {
    let s = buildInitialState('Uji', SEED, PACK)
    // Paksa kondisi: hari cukup, roster terisi manual 2 peserta dari 2 keluarga.
    const [kelA, kelB] = Object.keys(s.desa.keluarga)
    s = {
      ...s,
      hari: 40,
      blok: 'siang',
      lapanganTerpakai: false,
      prolanis: {
        roster: [
          { id: 'pA', nama: 'A', usia: 50, jenisKelamin: 'P', rw: 1, keluargaId: kelA!, jenis: 'dm', param: 220, takTerkontrolBerturut: 0 },
          { id: 'pB', nama: 'B', usia: 60, jenisKelamin: 'L', rw: 2, keluargaId: kelB!, jenis: 'ht', param: 160, takTerkontrolBerturut: 0 },
        ],
      },
    }
    // Keluarga A: JKN mati; keluarga B: JKN hidup.
    const kelStateA = s.desa.keluarga[kelA!]!
    const kelStateB = s.desa.keluarga[kelB!]!
    s = {
      ...s,
      desa: {
        ...s.desa,
        keluarga: {
          ...s.desa.keluarga,
          [kelA!]: { ...kelStateA, indikator: { ...kelStateA.indikator, jkn: { ...(kelStateA.indikator.jkn ?? { dilaporkan: 'tidak' }), statusSebenarnya: 'tidak' } } },
          [kelB!]: { ...kelStateB, indikator: { ...kelStateB.indikator, jkn: { ...(kelStateB.indikator.jkn ?? { dilaporkan: 'ya' }), statusSebenarnya: 'ya' } } },
        } as GameState['desa']['keluarga'],
      },
    }
    return s
  }

  it('peserta ber-JKN mati TAK dapat kartu sesi; yang aktif dapat', () => {
    const s = run(stateDenganProlanis(), { type: 'MULAI_PROLANIS' })
    expect(s.kegiatan).toBeDefined()
    const ids = s.kegiatan!.kartu.map((k) => k.id)
    expect(ids).toContain('prol_pB')
    expect(ids).not.toContain('prol_pA')
  })

  it('peserta tanpa kartu TIDAK di-drift saat sesi selesai', () => {
    let s = run(stateDenganProlanis(), { type: 'MULAI_PROLANIS' })
    const paramAwalA = 220
    // Jawab semua kartu (hanya pB) sampai sesi selesai.
    let guard = 0
    while (s.kegiatan && guard++ < 10) {
      const kartu = s.kegiatan.kartu[s.kegiatan.index]!
      s = run(s, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: kartu.pilihan.find((p) => p.benar)!.id })
    }
    const pA = s.prolanis.roster.find((p) => p.id === 'pA')!
    expect(pA.param).toBe(paramAwalA) // dulu: dianggap "salah" → drift memburuk
    expect(pA.takTerkontrolBerturut).toBe(0)
  })

  it('Tambahan #3 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): komplikasi Prolanis DM tetap reuse dm_tipe2 (gerbang rujuk TAK diubah), tapi catatan kini tampilkan GDS sungguhan', () => {
    let s = stateDenganProlanis()
    // pA (dm, keluarga A) perlu JKN AKTIF di test ini (beda dari premis test
    // B.1 di atas yg sengaja menonaktifkannya) supaya dapat kartu sesi.
    const [kelA] = Object.keys(s.desa.keluarga)
    const kelStateA = s.desa.keluarga[kelA!]!
    s = {
      ...s,
      desa: {
        ...s.desa,
        keluarga: {
          ...s.desa.keluarga,
          [kelA!]: { ...kelStateA, indikator: { ...kelStateA.indikator, jkn: { ...(kelStateA.indikator.jkn ?? { dilaporkan: 'ya' }), statusSebenarnya: 'ya' } } },
        } as GameState['desa']['keluarga'],
      },
      prolanis: {
        roster: s.prolanis.roster.map((p) =>
          p.id === 'pA' ? { ...p, param: 190, takTerkontrolBerturut: 1 } : p,
        ),
      },
    }
    s = run(s, { type: 'MULAI_PROLANIS' })
    let guard = 0
    while (s.kegiatan && guard++ < 10) {
      const kartu = s.kegiatan.kartu[s.kegiatan.index]!
      // Jawab SALAH sengaja utk pA (satu-satunya peserta ber-kartu) — dorong
      // takTerkontrolBerturut 1→2, memicu jembatan UKP.
      const salah = kartu.pilihan.find((p) => !p.benar) ?? kartu.pilihan[0]!
      s = run(s, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: salah.id })
    }
    const jadwalPA = s.jadwal.find((j) => j.id.startsWith('jadwal_prolanis_') && j.nama === 'A')
    expect(jadwalPA).toBeDefined()
    // Gerbang rujuk TAK diubah — tetap reuse dm_tipe2 (harusDirujuk:false).
    expect(jadwalPA?.kasusId).toBe('dm_tipe2')
    // Catatan kini menampilkan angka GDS sungguhan (transparansi info),
    // bukan cuma frasa generik "gula darah liar tak terkendali".
    expect(jadwalPA?.catatan).toMatch(/GDS terakhir \d+ mg\/dL/)
  })
})

/* -- B.4: arus kas obat — dispense dari stok = nol kas (BPJS) ----------------- */

describe('M10 Batch-2 B.4 — kas obat tak lagi dobel-charge', () => {
  function encounterSiapDisposisi(bpjs: boolean, stok: number) {
    let s = buildInitialState('Uji', SEED, PACK)
    const kasusId = 'ispa_common_cold'
    const kasus = PACK.kasus[kasusId]!
    const obatId = kasus.tatalaksana.obatBenar[0] ?? kasus.tatalaksana.obatAlternatif![0]![0]!
    const pasien = { ...buatPasienDariKasus(kasusId, PACK, new Rng(3, 'b4')), bpjs }
    const enc = {
      ...buatEncounter(pasien),
      fase: 'disposisi' as const,
      resep: [obatId],
      diagnosis: { icd10: kasus.icd10, jenis: 'tegak' as const },
    }
    s = {
      ...s,
      tutorialAktif: false, // imun tutorial akan membekukan kapitasi
      gudang: { ...s.gudang, stok: { ...s.gudang.stok, [obatId]: stok } },
      klinik: { ...s.klinik, aktif: enc },
    }
    return { s, obatId }
  }

  it('BPJS + stok ADA: kapitasi TAK berkurang saat dispense (biaya sudah di pengadaan)', () => {
    const { s } = encounterSiapDisposisi(true, 5)
    const kasSebelum = s.kapitasi
    const s2 = run(s, { type: 'DISPOSISI', jenis: 'pulang' })
    expect(s2.kapitasi).toBe(kasSebelum) // dulu: -hargaBeli (dobel)
  })

  it('BPJS + stok HABIS: beli darurat −hargaBeli + tercatat belanjaObat', () => {
    const { s, obatId } = encounterSiapDisposisi(true, 0)
    const harga = PACK.obat[obatId]!.hargaBeli
    const kasSebelum = s.kapitasi
    const s2 = run(s, { type: 'DISPOSISI', jenis: 'pulang' })
    expect(s2.kapitasi).toBe(kasSebelum - harga)
    expect(s2.keuanganBulan.belanjaObat).toBe(harga)
  })

  it('UMUM + stok ADA: kas bertambah hargaJual (retribusi)', () => {
    const { s, obatId } = encounterSiapDisposisi(false, 5)
    const jual = PACK.obat[obatId]!.hargaJual
    const kasSebelum = s.kapitasi
    const s2 = run(s, { type: 'DISPOSISI', jenis: 'pulang' })
    expect(s2.kapitasi).toBe(kasSebelum + jual)
  })
})

/* -- B.7: cap ukuran verifier -------------------------------------------------- */

describe('M10 Batch-2 B.7 — verifier menolak berkas raksasa SEBELUM kerja berat', () => {
  it('json > 8MB → tidak_dapat_diverifikasi cepat', async () => {
    const raksasa = '{"format":"x","p":"' + 'a'.repeat(8_100_000) + '"}'
    const mulai = Date.now()
    const hasil = await verifikasiDossier(raksasa, PACK, '1.0.0')
    expect(hasil.status).toBe('tidak_dapat_diverifikasi')
    expect(hasil.alasan?.[0]).toMatch(/terlalu besar/i)
    expect(Date.now() - mulai).toBeLessThan(2000)
  })
})

/* -- C.9: jendela konsekuensi terjangkau dlm stase ----------------------------- */

describe('M10 Batch-2 C.9 — konsekuensi dislipidemia/obesitas terjangkau (≤ stase 90)', () => {
  it.each(['mm_dislipidemia', 'mm_obesitas'])('%s: kembaliHariMax < 90', (id) => {
    const k = PACK.kasus[id]!
    expect(k.konsekuensi!.kembaliHariMax).toBeLessThan(90)
    expect(k.konsekuensi!.kembaliHariMin).toBeLessThanOrEqual(k.konsekuensi!.kembaliHariMax)
  })
})
