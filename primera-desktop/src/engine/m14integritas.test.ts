/**
 * M14 / CODEX audit integritas backend — kunci skor pasca-tamat + verifier.
 *
 * #1 — sekali stase TAMAT, skor terkunci: SEMUA aksi mutasi (bukan cuma
 *      LANJUTKAN) ditolak; snapshot skor beku di state.tamat.skor.
 * #9 — verifier menolak jejak raksasa sebelum replay (cegah O(n^2) hang);
 *      mode replay in-place tak mengubah determinisme.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { buildInitialState } from './init'
import { hitungSkor } from './scoring'
import { HARI_STASE } from './paketUjian'
import { verifikasiDossier, FORMAT_DOSSIER, VERSI_DOSSIER } from './verifikasi'
import { serialize, deserialize } from './save'

const V_APP = 'test'

/** Bawa state ke ambang tamat lalu LANJUTKAN sekali → stase terkunci. */
function sampaiTamat(mode: GameState['mode'] = 'karier'): GameState {
  let s = buildInitialState('Uji', 777, PACK, { mode })
  s = { ...s, hari: HARI_STASE[mode], blok: 'sore', igd: undefined, layar: 'meja' }
  const r = advance(s, { type: 'LANJUTKAN' }, PACK)
  expect(r.state.tamat).toBeDefined()
  return r.state
}

describe('M14 #1 — skor terkunci pasca-tamat', () => {
  it('snapshot Skor4Dimensi beku tersimpan di state.tamat.skor saat tamat', () => {
    const s = sampaiTamat()
    expect(s.tamat?.skor).toBeDefined()
    // Snapshot = hitungSkor pada momen tamat (state belum termutasi).
    expect(s.tamat!.skor).toEqual(hitungSkor(s))
    expect(s.tamat!.skor!.grade).toBe(s.tamat!.grade)
  })

  it('PESAN_OBAT (mutasi kapitasi→Manajemen) DITOLAK pasca-tamat, kapitasi utuh', () => {
    const s = sampaiTamat()
    const obatId = Object.keys(s.gudang.stok)[0]!
    const kapitasiSebelum = s.kapitasi
    const r = advance(s, { type: 'PESAN_OBAT', obatId, jumlah: 20 }, PACK)
    expect(r.events.some((e) => e.type === 'ERROR_AKSI' && e.pesan.includes('terkunci'))).toBe(true)
    expect(r.state.kapitasi).toBe(kapitasiSebelum)
  })

  it('TETAPKAN_PROGRAM & PILIH_BINAAN DITOLAK pasca-tamat', () => {
    const s = sampaiTamat()
    const r1 = advance(s, { type: 'TETAPKAN_PROGRAM', fokus: 'psn' }, PACK)
    expect(r1.events.some((e) => e.type === 'ERROR_AKSI' && e.pesan.includes('terkunci'))).toBe(true)
    // Roster binaan tak berubah (guard menolak sebelum mutasi apa pun).
    const binaanSebelum = s.desa.binaan.length
    const kelId = Object.keys(s.desa.keluarga)[0]!
    const r2 = advance(s, { type: 'PILIH_BINAAN', keluargaId: kelId }, PACK)
    expect(r2.events.some((e) => e.type === 'ERROR_AKSI' && e.pesan.includes('terkunci'))).toBe(true)
    expect(r2.state.desa.binaan.length).toBe(binaanSebelum)
  })

  it('navigasi & baca TETAP boleh pasca-tamat (whitelist)', () => {
    const s = sampaiTamat()
    const r = advance(s, { type: 'PINDAH_LAYAR', layar: 'rapor' }, PACK)
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
    expect(r.state.layar).toBe('rapor')
    const suratId = s.inbox[0]?.id
    if (suratId) {
      const rb = advance(s, { type: 'BACA_SURAT', suratId }, PACK)
      expect(rb.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
    }
  })

  it('LANJUTKAN pasca-tamat tetap ditolak dgn pesan spesifik (bukan pesan generik)', () => {
    const s = sampaiTamat()
    const r = advance(s, { type: 'LANJUTKAN' }, PACK)
    expect(r.events.some((e) => e.type === 'ERROR_AKSI' && e.pesan.includes('terkunci'))).toBe(true)
    expect(r.state.hari).toBe(s.hari)
  })
})

describe('M14 #9 — verifier tolak jejak raksasa sebelum replay', () => {
  it('jejak > 200.000 aksi → tidak_dapat_diverifikasi (bukan hang)', async () => {
    // Dossier berbentuk sah tapi jejak absurd (aksi trivial). Cap dicek SEBELUM
    // HMAC/replay, jadi ttd boleh dummy — yang diuji: penolakan cepat.
    const jejakRaksasa: Action[] = new Array(200_001).fill({ type: 'TUTUP_REKAP' })
    const dossierPalsu = {
      format: FORMAT_DOSSIER,
      versi: VERSI_DOSSIER,
      identitas: { namaDokter: 'Penyerang' },
      stase: { mode: 'karier', seed: 1, seedKurikulum: 1, hari: 1 },
      klaim: { skor: {}, tally: {}, badge: [] },
      jejak: jejakRaksasa,
      lingkungan: { versiApp: V_APP, sidikJariPack: 'x' },
      ttd: 'dummy',
    }
    const hasil = await verifikasiDossier(JSON.stringify(dossierPalsu), PACK, V_APP)
    expect(hasil.status).toBe('tidak_dapat_diverifikasi')
    expect(hasil.alasan.join(' ')).toMatch(/terlalu panjang/i)
  })

  it('jejak wajar (≤200.000) tak tertolak oleh cap ini (lolos ke tahap HMAC)', async () => {
    // 5 aksi: cap tak memicu; ditolak di tahap LAIN (ttd dummy → tidak_sah/
    // sidik jari), yang penting BUKAN "terlalu panjang".
    const dossierKecil = {
      format: FORMAT_DOSSIER,
      versi: VERSI_DOSSIER,
      identitas: { namaDokter: 'Uji' },
      stase: { mode: 'karier', seed: 1, seedKurikulum: 1, hari: 1 },
      klaim: { skor: {}, tally: {}, badge: [] },
      jejak: new Array(5).fill({ type: 'TUTUP_REKAP' }),
      lingkungan: { versiApp: V_APP, sidikJariPack: 'x' },
      ttd: 'dummy',
    }
    const hasil = await verifikasiDossier(JSON.stringify(dossierKecil), PACK, V_APP)
    expect(hasil.alasan.join(' ')).not.toMatch(/terlalu panjang/i)
  })
})

describe('M14 #7 — recovery save menolak/memulihkan state hard-lock', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function saveKorup(mut: (st: any) => void): string {
    const base = JSON.parse(serialize(buildInitialState('Uji', 1, PACK)))
    mut(base.state)
    return JSON.stringify(base)
  }

  it('baseline: save bersih ter-deserialize (sanity)', () => {
    expect(deserialize(serialize(buildInitialState('Uji', 1, PACK)), PACK)).not.toBeNull()
  })

  it('IGD fase asing → dipulihkan (igd dibuang)', () => {
    const igdId = Object.keys(PACK.kasusIgd)[0]!
    const st = deserialize(saveKorup((s) => { s.igd = { kasusId: igdId, fase: 'asing', langkahIndex: 0, jawaban: [] } }), PACK)
    expect(st).not.toBeNull()
    expect(st!.igd).toBeUndefined()
  })

  it('IGD valid + layar "dex" (kontradiksi) → layar dipaksa "igd"', () => {
    const igdId = Object.keys(PACK.kasusIgd)[0]!
    const st = deserialize(saveKorup((s) => {
      s.igd = { kasusId: igdId, fase: 'langkah', langkahIndex: 0, jawaban: [] }
      s.layar = 'dex'
    }), PACK)
    expect(st).not.toBeNull()
    expect(st!.layar).toBe('igd')
  })

  it('inbox [null] → entri korup disaring (tak crash UI global)', () => {
    const st = deserialize(saveKorup((s) => { s.inbox = [null, ...s.inbox] }), PACK)
    expect(st).not.toBeNull()
    expect(st!.inbox.every((m) => m !== null && typeof m === 'object')).toBe(true)
  })

  it('klinik.antrian [null] → entri korup disaring', () => {
    const st = deserialize(saveKorup((s) => { s.klinik.antrian = [null] }), PACK)
    expect(st).not.toBeNull()
    expect(st!.klinik.antrian.length).toBe(0)
  })

  it('kegiatan jawaban null → backfill [] (JAWAB_KEGIATAN tak throw)', () => {
    const st = deserialize(saveKorup((s) => {
      s.kegiatan = { jenis: 'posyandu', rw: 1, kartu: [{ id: 'k', pilihan: [{ id: 'p', teks: 'x' }] }], index: 0, jawaban: null }
    }), PACK)
    expect(st).not.toBeNull()
    // kegiatan bertahan (kartu valid) & jawaban jadi array, ATAU dipulihkan jadi undefined.
    if (st!.kegiatan) expect(Array.isArray(st!.kegiatan.jawaban)).toBe(true)
  })

  it('kegiatan pilihan [] (nol pilihan) → dipulihkan (dibuang)', () => {
    const st = deserialize(saveKorup((s) => {
      s.kegiatan = { jenis: 'klb', rw: 1, kartu: [{ id: 'k', pilihan: [] }], index: 0, jawaban: [] }
    }), PACK)
    expect(st).not.toBeNull()
    expect(st!.kegiatan).toBeUndefined()
  })

  it('properti top-level ASING dibuang (tak ikut round-trip)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const st = deserialize(saveKorup((s) => { s.__jahat = { x: 1 }; s.seedRahasia = 999 }), PACK) as any
    expect(st).not.toBeNull()
    expect(st.__jahat).toBeUndefined()
    expect(st.seedRahasia).toBeUndefined()
    // Field sah tetap ada.
    expect(typeof st.seed).toBe('number')
    expect(st.klinik).toBeDefined()
  })

  it('CODEX M14 #11: hasilKegiatanTerakhir (field baru) TIDAK ikut terbuang whitelist', () => {
    const hasil = { jenis: 'posyandu', benar: 4, total: 5, skor: 0.8, rw: 1, jawaban: [] }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const st = deserialize(saveKorup((s) => { s.hasilKegiatanTerakhir = hasil }), PACK) as any
    expect(st).not.toBeNull()
    expect(st.hasilKegiatanTerakhir).toEqual(hasil)
  })
})
