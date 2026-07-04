/**
 * M6 — VERIFIKASI DOSSIER (docs/M6_KELAS_DOSEN.md).
 *
 * Prinsip yang diuji: skor TIDAK dipercaya dari klaim file — dihitung ulang
 * dengan mereplay jejak aksi penuh (state awal deterministik + advance murni).
 * HMAC menangkap edit kasar; replay menangkap pemalsuan yang tanda tangannya
 * ikut dihitung ulang (penyerang memegang kunci karena app di tangan mahasiswa).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { KAPASITAS_EDUKASI } from './clinic'
import { advance } from './reducer'
import { hashSeed } from './core/rng'
import type { Action } from './actions'
import type { GameState } from './state'
import {
  susunDossier,
  verifikasiDossier,
  sidikJariPack,
  stringifyKanonik,
  type DossierMahasiswa,
} from './verifikasi'

const V_APP = 'test'

function run(state: GameState, action: Action, izinkanError = false): GameState {
  const hasil = advance(state, action, PACK)
  const error = hasil.events.find((e) => e.type === 'ERROR_AKSI')
  if (error && error.type === 'ERROR_AKSI' && !izinkanError) {
    throw new Error(`Aksi ${action.type} ditolak: ${error.pesan}`)
  }
  return hasil.state
}

/**
 * Mainkan Hari 1 pagi: satu pasien lengkap sampai disposisi (tally bergerak —
 * penting agar pemangkasan jejak PASTI terdeteksi lewat banding tally) + satu
 * aksi yang DITOLAK engine (peta terkunci H1) — membuktikan aksi gagal ikut
 * terekam & replay mereproduksi penolakan yang sama.
 */
// Seed ujian diturunkan dari NIM (anti-reroll + ikatan identitas — CODEX #5).
const NAMA_UJI = 'Uji Verifikasi'
const NIM_UJI = '011'
const SEED_UJI = hashSeed('ujian', NIM_UJI)

/** Tangani pasien AKTIF sampai tuntas disposisi (anamnesis lengkap, obat benar, dst). */
function tanganiPasienAktif(s: GameState): GameState {
  const enc = s.klinik.aktif
  if (!enc) throw new Error('encounter tidak aktif')
  const kasus = PACK.kasus[enc.pasien.kasusId]
  if (!kasus) throw new Error(`kasus ${enc.pasien.kasusId} tak ada`)

  for (const q of kasus.anamnesis) {
    if (q.distraktor === true) continue
    s = run(s, { type: 'TANYA', pertanyaanId: q.id })
  }
  s = run(s, { type: 'LANJUT_FASE' })
  s = run(s, { type: 'UKUR_VITAL' })
  for (const t of kasus.pemeriksaanFisik) {
    if (t.relevan) s = run(s, { type: 'PERIKSA', region: t.region })
  }
  s = run(s, { type: 'LANJUT_FASE' })
  s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' })
  for (const obatId of kasus.tatalaksana.obatBenar) s = run(s, { type: 'TAMBAH_OBAT', obatId })
  for (const grup of kasus.tatalaksana.obatAlternatif ?? []) {
    if (grup[0]) s = run(s, { type: 'TAMBAH_OBAT', obatId: grup[0] })
  }
  for (const edukasiId of kasus.tatalaksana.edukasi.slice(0, KAPASITAS_EDUKASI)) {
    s = run(s, { type: 'TAMBAH_EDUKASI', edukasiId })
  }
  s = run(s, { type: 'LANJUT_FASE' })
  return run(
    s,
    kasus.harusDirujuk
      ? {
          type: 'DISPOSISI',
          jenis: 'rujuk',
          sbar: {
            situation: 'Pasien uji verifikasi.',
            background: 'Data lengkap terlampir.',
            assessment: `${kasus.nama} (${kasus.icd10}).`,
            recommendation: 'Mohon penanganan lanjutan.',
          },
        }
      : { type: 'DISPOSISI', jenis: 'pulang' },
  )
}

/**
 * Mainkan DUA pasien: yang PERTAMA adalah encounter tutorial (DeepThink
 * "onboarding railroaded") — sengaja kebal tally by design, jadi ditangani
 * & dilewati apa adanya; SEMUA pengecekan tally/replay di suite ini bertumpu
 * pada pasien KEDUA (Hari 1 sudah 2 pasien di antrian — kurva pacing M5.22).
 */
function mainkanSatuPasien(): GameState {
  let s = buildInitialState(NAMA_UJI, SEED_UJI, PACK, { mode: 'ujian', nim: NIM_UJI })
  s = run(s, { type: 'BACA_SURAT', suratId: 'surat_1_0' })
  s = run(s, { type: 'PINDAH_LAYAR', layar: 'peta' }, true) // ditolak H1 — sengaja
  s = run(s, { type: 'PINDAH_LAYAR', layar: 'klinik' })

  s = run(s, { type: 'PANGGIL_PASIEN' })
  s = tanganiPasienAktif(s) // pasien #1 — tutorial, kebal tally by design

  s = run(s, { type: 'PANGGIL_PASIEN' })
  s = tanganiPasienAktif(s) // pasien #2 — skor SUNGGUHAN, dipakai semua tes di bawah
  return s
}

describe('M6 — jurnal aksi penuh (jejak)', () => {
  it('setiap aksi terekam dengan payload utuh — termasuk yang ditolak engine', () => {
    const s = mainkanSatuPasien()
    expect(s.jejak.length).toBeGreaterThan(5)
    expect(s.jejak.length).toBe(s.log.length) // sejajar 1:1 dengan log telemetri
    // Aksi ditolak (peta H1) tetap ada di jejak:
    expect(s.jejak.some((a) => a.type === 'PINDAH_LAYAR' && 'layar' in a && a.layar === 'peta')).toBe(true)
    // Payload utuh, bukan cuma type:
    const tanya = s.jejak.find((a) => a.type === 'TANYA')
    expect(tanya && 'pertanyaanId' in tanya && typeof tanya.pertanyaanId === 'string').toBe(true)
  })
})

describe('M6 — verifikasi dossier', () => {
  it('dossier asli → SAH; skor replay = skor klaim; deterministik', async () => {
    const s = mainkanSatuPasien()
    const dossier = await susunDossier(s, PACK, { versiApp: V_APP, nim: '011' })
    const json = JSON.stringify(dossier)

    const hasil1 = await verifikasiDossier(json, PACK, V_APP)
    expect(hasil1.status).toBe('sah')
    expect(hasil1.alasan).toEqual([])
    expect(hasil1.ringkasan?.nim).toBe('011')
    expect(hasil1.ringkasan?.mode).toBe('ujian')
    expect(hasil1.ringkasan?.paketUjian).toBeDefined()
    expect(stringifyKanonik(hasil1.ringkasan?.skorReplay)).toBe(stringifyKanonik(hasil1.ringkasan?.skorKlaim))

    const hasil2 = await verifikasiDossier(json, PACK, V_APP)
    expect(stringifyKanonik(hasil2)).toBe(stringifyKanonik(hasil1))
  })

  it('klaim tally diubah + ttd dihitung ulang penyerang → replay menangkap → TIDAK SAH', async () => {
    const s = mainkanSatuPasien()
    const palsu: GameState = { ...s, tally: { ...s.tally, diagnosisBenar: s.tally.diagnosisBenar + 5, totalPasien: s.tally.totalPasien + 5 } }
    const dossier = await susunDossier(palsu, PACK, { versiApp: V_APP }) // ttd VALID (kunci di tangan penyerang)
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('tidak_sah')
    expect(hasil.alasan.join(' ')).toMatch(/[Tt]ally/)
  })

  it('jejak dipangkas (disposisi dihapus) + ttd dihitung ulang → TIDAK SAH', async () => {
    const s = mainkanSatuPasien()
    const dipangkas: GameState = { ...s, jejak: s.jejak.slice(0, -1) } // buang DISPOSISI
    const dossier = await susunDossier(dipangkas, PACK, { versiApp: V_APP })
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('tidak_sah')
  })

  it('NIM ujian DIPALSUKAN (seed dari NIM lama) + ttd VALID → ikatan identitas putus → TIDAK SAH (CODEX #5)', async () => {
    const s = mainkanSatuPasien()
    // Penyerang mengaku NIM mahasiswa lain tapi seed tetap (diturunkan dari NIM
    // asli); susunDossier menghasilkan ttd sah utk objek palsu ini (kunci di tangan).
    const palsu: GameState = { ...s, nim: '999' }
    const dossier = await susunDossier(palsu, PACK, { versiApp: V_APP })
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('tidak_sah')
    expect(hasil.alasan.join(' ')).toMatch(/[Ii]dentitas/)
  })

  it('dossier ujian TANPA NIM → TIDAK SAH (identitas ujian wajib terikat NIM, CODEX #5)', async () => {
    const s = mainkanSatuPasien()
    const tanpaNim: GameState = { ...s, nim: undefined }
    const dossier = await susunDossier(tanpaNim, PACK, { versiApp: V_APP })
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('tidak_sah')
    expect(hasil.alasan.join(' ')).toMatch(/[Ii]dentitas|NIM/)
  })

  it('nama tampilan diubah TIDAK memutus identitas (nama kosmetik; NIM yang mengikat)', async () => {
    const s = mainkanSatuPasien()
    // Ganti nama saja (NIM & seed tetap) → tetap SAH: nama hanya display.
    const dossier = await susunDossier({ ...s, namaDokter: 'Nama Lain' }, PACK, { versiApp: V_APP })
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('sah')
  })

  it('paketUjian DIPALSUKAN + ttd dihitung ulang → replay tak cocok → TIDAK SAH (CODEX P1)', async () => {
    const s = mainkanSatuPasien()
    const palsu: GameState = { ...s, paketUjian: s.paketUjian === 'paket_a' ? 'paket_b' : 'paket_a' }
    const dossier = await susunDossier(palsu, PACK, { versiApp: V_APP }) // ttd VALID
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('tidak_sah')
    expect(hasil.alasan.join(' ')).toMatch(/[Pp]aket/)
  })

  it('file diedit tangan TANPA ttd baru → gagal di tanda tangan → TIDAK SAH', async () => {
    const s = mainkanSatuPasien()
    const dossier = await susunDossier(s, PACK, { versiApp: V_APP })
    const diedit = { ...dossier, klaim: { ...dossier.klaim, skor: { ...dossier.klaim.skor, total: 100 } } }
    const hasil = await verifikasiDossier(JSON.stringify(diedit), PACK, V_APP)
    expect(hasil.status).toBe('tidak_sah')
    expect(hasil.alasan.join(' ')).toMatch(/[Tt]anda tangan/)
  })

  it('jejak kosong (save pra-M6) → TIDAK DAPAT DIVERIFIKASI', async () => {
    const s = mainkanSatuPasien()
    const tanpaJejak: GameState = { ...s, jejak: [] }
    const dossier = await susunDossier(tanpaJejak, PACK, { versiApp: V_APP })
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('tidak_dapat_diverifikasi')
  })

  it('sidik jari konten beda (build lain) → TIDAK DAPAT DIVERIFIKASI, bukan vonis', async () => {
    const s = mainkanSatuPasien()
    const packLain = { ...PACK, skdi144: PACK.skdi144.slice(0, -1) }
    const dossier = await susunDossier(s, packLain, { versiApp: '9.9.9' })
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, V_APP)
    expect(hasil.status).toBe('tidak_dapat_diverifikasi')
    expect(hasil.alasan.join(' ')).toMatch(/[Vv]ersi konten/)
  })

  it('bukan JSON / bukan dossier → TIDAK DAPAT DIVERIFIKASI dengan alasan jelas', async () => {
    expect((await verifikasiDossier('{{rusak', PACK, V_APP)).status).toBe('tidak_dapat_diverifikasi')
    expect((await verifikasiDossier('{"format":"lain"}', PACK, V_APP)).status).toBe('tidak_dapat_diverifikasi')
  })

  it('sidikJariPack stabil terhadap urutan kunci & sensitif terhadap isi', () => {
    expect(sidikJariPack(PACK)).toBe(sidikJariPack({ ...PACK }))
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack({ ...PACK, skdi144: PACK.skdi144.slice(0, -1) }))
  })

  // Audit CODEX 2026-07-04 (ronde-6): probe menunjukkan hash TAK berubah
  // walau pemeriksaanFisik/oldcarts/distraktor/rumahSakit/arc keluarga diubah —
  // padahal semua itu memengaruhi skor replay. Kini harus ikut berubah.
  it('sidikJariPack kini sensitif terhadap pemeriksaanFisik (relevan flag)', () => {
    const kasusId = Object.keys(PACK.kasus)[0]!
    const kasus = PACK.kasus[kasusId]!
    const pfDiubah = kasus.pemeriksaanFisik.map((t, i) => (i === 0 ? { ...t, relevan: !t.relevan } : t))
    const packDiubah = { ...PACK, kasus: { ...PACK.kasus, [kasusId]: { ...kasus, pemeriksaanFisik: pfDiubah } } }
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack(packDiubah))
  })

  it('sidikJariPack kini sensitif terhadap oldcarts/distraktor per pertanyaan anamnesis', () => {
    const kasusId = Object.keys(PACK.kasus)[0]!
    const kasus = PACK.kasus[kasusId]!
    const anamnesisDiubah = kasus.anamnesis.map((q, i) => (i === 0 ? { ...q, distraktor: !q.distraktor } : q))
    const packDiubah = { ...PACK, kasus: { ...PACK.kasus, [kasusId]: { ...kasus, anamnesis: anamnesisDiubah } } }
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack(packDiubah))
  })

  it('sidikJariPack kini sensitif terhadap daftar rumahSakit (SISRUTE)', () => {
    const rsDiubah = PACK.rumahSakit.map((r, i) => (i === 0 ? { ...r, bedDasar: r.bedDasar + 1 } : r))
    const packDiubah = { ...PACK, rumahSakit: rsDiubah }
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack(packDiubah))
  })

  it('sidikJariPack kini sensitif terhadap isi arc keluarga binaan (bukan cuma daftar ID)', () => {
    const keluargaId = Object.keys(PACK.keluarga)[0]!
    const keluarga = PACK.keluarga[keluargaId]!
    const packDiubah = {
      ...PACK,
      keluarga: { ...PACK.keluarga, [keluargaId]: { ...keluarga, ekonomi: keluarga.ekonomi === 'miskin' ? 'rentan' : 'miskin' } },
    }
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack(packDiubah as typeof PACK))
  })

  // Audit CODEX ronde-baru #2: probe menunjukkan hash TAK berubah walau isi IGD
  // (pilihan-benar/efek/disposisi), kader (ketelitian/bias), atau RW (jarak/
  // totalKk) diubah — padahal semua penentu skor/replay. Kini harus ikut berubah.
  it('sidikJariPack kini sensitif terhadap isi IGD (pilihan-benar/efek/disposisi)', () => {
    const igdId = Object.keys(PACK.kasusIgd)[0]!
    const kasus = PACK.kasusIgd[igdId]!
    const langkahDiubah = kasus.langkah.map((l, i) =>
      i === 0 ? { ...l, pilihan: l.pilihan.map((p, j) => (j === 0 ? { ...p, benar: !p.benar } : p)) } : l,
    )
    const packDiubah = { ...PACK, kasusIgd: { ...PACK.kasusIgd, [igdId]: { ...kasus, langkah: langkahDiubah } } }
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack(packDiubah))
  })

  it('sidikJariPack kini sensitif terhadap kader (ketelitian/bias)', () => {
    const kaderDiubah = PACK.kader.map((k, i) => (i === 0 ? { ...k, ketelitian: k.ketelitian + 1 } : k))
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack({ ...PACK, kader: kaderDiubah }))
  })

  it('sidikJariPack kini sensitif terhadap RW (jarak/totalKk)', () => {
    const rwDiubah = PACK.rw.map((r, i) => (i === 0 ? { ...r, totalKk: r.totalKk + 1 } : r))
    expect(sidikJariPack(PACK)).not.toBe(sidikJariPack({ ...PACK, rw: rwDiubah }))
  })

  it('stringifyKanonik kebal urutan properti', () => {
    expect(stringifyKanonik({ b: 1, a: { d: [2, { z: 1, y: 2 }], c: 3 } })).toBe(
      stringifyKanonik({ a: { c: 3, d: [2, { y: 2, z: 1 }] }, b: 1 }),
    )
  })

  it('dossier dgn identitas berbeda tidak bisa saling tukar ttd (anti salin punya teman)', async () => {
    const s = mainkanSatuPasien()
    const d1 = await susunDossier(s, PACK, { versiApp: V_APP, nim: '011' })
    const d2: DossierMahasiswa = { ...d1, identitas: { ...d1.identitas, nim: '099' } }
    const hasil = await verifikasiDossier(JSON.stringify(d2), PACK, V_APP)
    expect(hasil.status).toBe('tidak_sah')
  })
})
