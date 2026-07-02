/**
 * TEST KUNJUNGAN + PIS-PK + KADER — mekanik kunci UKM.
 * Cakupan wajib: gerbang kejujuran dua sisi, diusir 2× konfrontasi,
 * hipotesis salah → gagal, N/A tidak masuk IKS, bias kader membalik data.
 */

import { describe, expect, it } from 'vitest'
import type { Action } from './actions'
import type { GameEvent } from './events'
import type { GameState, KeluargaState, KunjunganState, NilaiIndikator } from './state'
import type { ContentPack } from '../content/pack'
import type {
  IndikatorPisPk,
  KaderProfil,
  KeluargaBinaan,
  RwProfil,
  SkenarioKunjungan,
} from '../content/types'
import { Rng } from './core/rng'
import { hitungIksKeluarga, klasifikasiIks, SEMUA_INDIKATOR_PISPK } from './pispk'
import { aksiKunjungan, buatKunjungan, selesaikanKunjungan, terapkanHasil } from './kunjungan'
import { prosesHarianKader } from './kader'

/* ---------------------------------------------------------------------------
 * Fixture
 * ------------------------------------------------------------------------- */

const RESPONS_JUJUR =
  'Sebenarnya belum ada, Dok. Tanahnya sempit, uangnya belum kumpul. Kami masih ke sungai.'
const RESPONS_BOHONG = 'Ada kok, Dok, di belakang. Cuma sedang diperbaiki, jadi jangan dilihat dulu ya.'

const SKENARIO: SkenarioKunjungan = {
  id: 'sk_jamban',
  judul: 'Jamban di ujung kebun',
  pembuka:
    'Rumah berdinding anyaman itu rapi, tapi tercium bau sungai dari belakang. Pak Raharjo mempersilakan masuk sambil menggulung tikar.',
  target: ['jamban_sehat'],
  hambatanSebenarnya: 'kesempatan',
  petunjukHambatan: 'Tanah sempit dan biaya — bukan soal kemauan.',
  hotspot: [
    {
      id: 'h_belakang',
      label: 'Halaman belakang',
      narasi: 'Tidak ada bangunan jamban di belakang rumah; jalan setapak kecil menurun ke arah sungai.',
      indikator: 'jamban_sehat',
      x: 72,
      y: 58,
    },
    {
      id: 'h_dapur',
      label: 'Dapur',
      narasi: 'Tungku kayu yang terawat; panci-panci digantung rapi.',
      x: 28,
      y: 42,
    },
  ],
  dialog: [
    {
      id: 'n1',
      narasi: 'Pak Raharjo menuang teh, tangannya sedikit gemetar. "Jarang-jarang ada dokter mampir, Dok."',
      pilihan: [
        {
          id: 'p1_empati',
          teks: 'Terima kasih sudah menerima saya, Pak. Ceritakan saja kabar keluarga dulu.',
          gaya: 'empati',
          respons: 'Wah, ya beginilah, Dok. Alhamdulillah sehat-sehat, cuma hidup di sini serba pas-pasan.',
          efekTrust: 2,
          tepat: true,
        },
        {
          id: 'p1_konfrontasi',
          teks: 'Saya langsung saja, Pak. Kebiasaan keluarga ini banyak yang harus diubah.',
          gaya: 'konfrontasi',
          respons: 'Pak Raharjo meletakkan gelasnya pelan-pelan. "Oh... begitu ya, Dok."',
          efekTrust: -2,
          tepat: false,
          catatanPedagogis: 'Righting reflex: menggurui sebelum mendengar menutup pintu percakapan.',
        },
        {
          id: 'p1_edukasi',
          teks: 'Sebelum ngobrol, saya jelaskan dulu 12 indikator keluarga sehat ya, Pak.',
          gaya: 'edukasi',
          respons: 'Pak Raharjo mengangguk-angguk sopan, matanya mulai menerawang.',
          efekTrust: 0,
          tepat: false,
        },
      ],
    },
    {
      id: 'n2',
      narasi: 'Percakapan sampai ke urusan rumah. Kamu teringat bau sungai dari halaman belakang.',
      pilihan: [
        {
          id: 'p2_ungkap',
          teks: 'Banyak keluarga di sini kesulitan bikin jamban. Kalau di rumah Bapak sendiri bagaimana?',
          gaya: 'refleksi',
          respons: RESPONS_JUJUR,
          efekTrust: 1,
          tepat: true,
          ungkap: {
            indikator: 'jamban_sehat',
            ambangTrust: 5,
            responsBohong: RESPONS_BOHONG,
          },
        },
        {
          id: 'p2_konfrontasi',
          teks: 'Bapak masih BAB di sungai, kan? Itu sumber penyakit untuk satu kampung.',
          gaya: 'konfrontasi',
          respons: 'Wajah Pak Raharjo mengeras. "Dokter ini datang mau menolong atau mau memarahi?"',
          efekTrust: -2,
          tepat: false,
        },
        {
          id: 'p2_netral',
          teks: 'Air minumnya dari mana, Pak?',
          gaya: 'edukasi',
          respons: 'Dari sumur bor bersama di ujung gang, Dok. Lumayan jernih.',
          efekTrust: 0,
          tepat: false,
        },
      ],
    },
    {
      id: 'n3',
      narasi: 'Bu Raharjo ikut duduk, memangku si bungsu.',
      pilihan: [
        {
          id: 'p3_refleksi',
          teks: 'Jadi kalau saya tangkap, bukan tidak mau — tapi tanah dan biayanya yang belum ketemu jalannya ya, Pak?',
          gaya: 'refleksi',
          respons: 'Pak Raharjo menghela napas lega. "Nah, itu, Dok. Persis. Bukannya kami betah begini."',
          efekTrust: 1,
          tepat: true,
          catatanPedagogis: 'Refleksi kompleks: memantulkan makna, bukan sekadar mengulang kata.',
        },
        {
          id: 'p3_konfrontasi',
          teks: 'Kalau tidak segera berubah, anak-anak Bapak yang kena diare duluan.',
          gaya: 'konfrontasi',
          respons: 'Bu Raharjo memeluk anaknya lebih erat. Suasana mendadak dingin.',
          efekTrust: -2,
          tepat: false,
        },
        {
          id: 'p3_netral',
          teks: 'Anak-anak sekolahnya di mana, Bu?',
          gaya: 'empati',
          respons: 'Yang besar di SD kampung sebelah, Dok, jalan kaki setengah jam.',
          efekTrust: 0,
          tepat: false,
        },
      ],
    },
  ],
  intervensi: [
    {
      id: 'i_arisan',
      nama: 'Arisan jamban RW',
      deskripsi: 'Gotong royong iuran bergilir + lahan pinjam pakai dari kas desa.',
      cocokUntuk: ['kesempatan'],
      hasilNarasi: 'Pak Raharjo mendaftar arisan gelombang pertama.',
    },
    {
      id: 'i_penyuluhan',
      nama: 'Penyuluhan bahaya BABS',
      deskripsi: 'Ceramah PHBS di balai banjar tentang penyakit tinja-mulut.',
      cocokUntuk: ['motivasi'],
      hasilNarasi: 'Warga datang, mengangguk, lalu pulang seperti biasa.',
    },
    {
      id: 'i_pelatihan',
      nama: 'Pelatihan membuat jamban sehat',
      deskripsi: 'Kader sanitasi melatih cara membangun kloset leher angsa sederhana.',
      cocokUntuk: ['kapabilitas'],
      hasilNarasi: 'Pelatihan berjalan, tapi peserta pulang tanpa lahan dan tanpa dana.',
    },
  ],
  penutupBerhasil:
    'Pak Raharjo mengantar sampai pagar. "Baru kali ini ada yang nanya kenapa, bukan cuma nyuruh, Dok." Kamu mencatat: satu langkah kecil, satu keluarga.',
  penutupGagal:
    'Pintu ditutup lebih cepat dari biasanya. Di jalan pulang, bau sungai itu terasa lebih tajam dari saat datang.',
}

function indikatorPenuh(
  override: Partial<Record<IndikatorPisPk, NilaiIndikator>> = {},
): Record<IndikatorPisPk, NilaiIndikator> {
  const out = {} as Record<IndikatorPisPk, NilaiIndikator>
  for (const ind of SEMUA_INDIKATOR_PISPK) {
    out[ind] = override[ind] ?? { status: 'na', statusSebenarnya: 'na', sumber: 'belum', hariData: 0 }
  }
  return out
}

function buatKel(
  trust: number,
  override: Partial<Record<IndikatorPisPk, NilaiIndikator>> = {},
): KeluargaState {
  return {
    id: 'fam_raharjo',
    trust,
    ttm: 'prekontemplasi',
    indikator: indikatorPenuh(override),
    arcIndex: 0,
    jumlahKunjungan: 0,
  }
}

/** Keluarga dengan jamban yang SEBENARNYA belum ada (data kader keliru 'ya'). */
function kelJambanBohong(trust: number): KeluargaState {
  return buatKel(trust, {
    jamban_sehat: { status: 'ya', statusSebenarnya: 'tidak', sumber: 'kader', hariData: 1 },
  })
}

function jalankan(
  awal: KunjunganState,
  aksi: Action[],
  kel: KeluargaState,
): { kj: KunjunganState; selesai: boolean; events: GameEvent[] } {
  let kj = awal
  let selesai = false
  const events: GameEvent[] = []
  for (const a of aksi) {
    const r = aksiKunjungan(kj, a, SKENARIO, kel)
    kj = r.kj
    selesai = r.selesai
    events.push(...r.events)
  }
  return { kj, selesai, events }
}

function wargaBicara(events: GameEvent[]): Extract<GameEvent, { type: 'WARGA_BICARA' }>[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'WARGA_BICARA' }> => e.type === 'WARGA_BICARA')
}

/* ---------------------------------------------------------------------------
 * Gerbang kejujuran — dua sisi
 * ------------------------------------------------------------------------- */

describe('gerbang kejujuran', () => {
  it('trust cukup → warga jujur, indikator terverifikasi BENAR', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' }, // +2 → trust efektif 8
        { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' }, // +1 → 9 ≥ ambang 5 → jujur
        { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' },
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' },
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' },
      ],
      kel,
    )
    expect(r.selesai).toBe(true)

    const bicara = wargaBicara(r.events)
    expect(bicara.some((b) => b.teks === RESPONS_JUJUR && b.bohong !== true)).toBe(true)
    expect(bicara.some((b) => b.bohong === true)).toBe(false)

    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    expect(hasil.berhasil).toBe(true)
    expect(hasil.indikatorTerverifikasi).toContain('jamban_sehat')

    // Data kader yang keliru ('ya') diluruskan jadi kebenaran ('tidak').
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 4)
    expect(kelBaru.indikator.jamban_sehat.status).toBe('tidak')
    expect(kelBaru.indikator.jamban_sehat.sumber).toBe('dokter')
    expect(kelBaru.indikator.jamban_sehat.hariData).toBe(4)
    expect(kelBaru.ttm).toBe('kontemplasi')
    expect(kelBaru.arcIndex).toBe(1)
    // Immutabilitas: keluarga asal tidak tersentuh.
    expect(kel.indikator.jamban_sehat.status).toBe('ya')
    expect(kel.ttm).toBe('prekontemplasi')
  })

  it('trust rendah → warga bohong, indikator tercatat SALAH', () => {
    const kel = kelJambanBohong(2)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_edukasi' }, // +0 → trust efektif 2
        { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' }, // +1 → 3 < ambang 5 → bohong
        { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' },
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' },
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' },
      ],
      kel,
    )

    const bicara = wargaBicara(r.events)
    expect(bicara.some((b) => b.bohong === true && b.teks === RESPONS_BOHONG)).toBe(true)

    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    expect(hasil.indikatorTerverifikasi).not.toContain('jamban_sehat')

    // Kebohongan tercatat sebagai 'ya' PADAHAL sebenarnya 'tidak' — pedagogi.
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 4)
    expect(kelBaru.indikator.jamban_sehat.status).toBe('ya')
    expect(kelBaru.indikator.jamban_sehat.statusSebenarnya).toBe('tidak')
    expect(kelBaru.indikator.jamban_sehat.sumber).toBe('dokter')
  })

  it('hotspot mengalahkan kebohongan: yang terlihat mata tidak bisa dibohongi', () => {
    const kel = kelJambanBohong(2)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'KLIK_HOTSPOT', hotspotId: 'h_belakang' }, // lihat sendiri: tak ada jamban
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_edukasi' },
        { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' }, // warga tetap bohong...
        { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' },
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' },
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' },
      ],
      kel,
    )
    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    // ...tapi observasimu yang menang.
    expect(hasil.indikatorTerverifikasi).toContain('jamban_sehat')
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 4)
    expect(kelBaru.indikator.jamban_sehat.status).toBe('tidak')
  })
})

/* ---------------------------------------------------------------------------
 * Diusir — 2 konfrontasi beruntun
 * ------------------------------------------------------------------------- */

describe('konfrontasi & diusir', () => {
  it('dua konfrontasi beruntun → diusir, kunjungan hangus', () => {
    const kel = buatKel(5)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_konfrontasi' },
        { type: 'PILIH_DIALOG', pilihanId: 'p2_konfrontasi' },
      ],
      kel,
    )
    expect(r.selesai).toBe(true)
    expect(r.kj.diusir).toBe(true)
    expect(r.kj.fase).toBe('selesai')
    expect(r.events.some((e) => e.type === 'DIUSIR')).toBe(true)

    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    expect(hasil.diusir).toBe(true)
    expect(hasil.berhasil).toBe(false)
    expect(hasil.narasiPenutup).toBe(SKENARIO.penutupGagal)
    // Trust tetap terjun: -2 -2 = -4, clamp di 0-10.
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 3)
    expect(kelBaru.trust).toBe(1)
    expect(kelBaru.ttm).toBe('prekontemplasi')
  })

  it('konfrontasi yang diselingi pilihan lain TIDAK mengusir (beruntun ter-reset)', () => {
    const kel = buatKel(5)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_konfrontasi' },
        { type: 'PILIH_DIALOG', pilihanId: 'p2_netral' },
        { type: 'PILIH_DIALOG', pilihanId: 'p3_konfrontasi' },
      ],
      kel,
    )
    expect(r.kj.diusir).toBe(false)
    expect(r.kj.konfrontasiBeruntun).toBe(1)
    expect(r.selesai).toBe(false)
  })
})

/* ---------------------------------------------------------------------------
 * Hipotesis hambatan salah → kunjungan gagal
 * ------------------------------------------------------------------------- */

describe('diagnosis perilaku (COM-B)', () => {
  it('hipotesis salah → gagal walau intervensi kebetulan cocok', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'KLIK_HOTSPOT', hotspotId: 'h_belakang' },
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' },
        { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' },
        { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' },
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'motivasi' }, // SALAH: sebenarnya kesempatan
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' },
      ],
      kel,
    )
    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    expect(hasil.hipotesisBenar).toBe(false)
    expect(hasil.berhasil).toBe(false)
    expect(hasil.narasiPenutup).toBe(SKENARIO.penutupGagal)

    // Gagal: TTM & arc tidak maju, tapi kunjungan tetap tercatat
    // dan verifikasi observasi tetap berlaku.
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 5)
    expect(kelBaru.ttm).toBe('prekontemplasi')
    expect(kelBaru.arcIndex).toBe(0)
    expect(kelBaru.jumlahKunjungan).toBe(1)
    expect(kelBaru.kunjunganTerakhir).toBe(5)
    expect(kelBaru.indikator.jamban_sehat.status).toBe('tidak')
  })

  it('intervensi salah sasaran → gagal walau hipotesis benar', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' },
        { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' },
        { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' },
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' },
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_penyuluhan' }, // cocok utk motivasi, bukan kesempatan
      ],
      kel,
    )
    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    expect(hasil.hipotesisBenar).toBe(true)
    expect(hasil.berhasil).toBe(false)
  })

  it('kualitas MI = proporsi pilihan tepat', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' }, // tepat
        { type: 'PILIH_DIALOG', pilihanId: 'p2_netral' }, // tidak
        { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' }, // tepat
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' },
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' },
      ],
      kel,
    )
    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    expect(hasil.kualitasMi).toBe(67) // round(2/3 × 100)
  })

  it('TTM mencapai aksi → indikator target flip ya + arc tamat berhasil', () => {
    const kel: KeluargaState = {
      ...kelJambanBohong(7),
      ttm: 'kontemplasi',
      arcIndex: 1,
      jumlahKunjungan: 1,
      kunjunganTerakhir: 4,
    }
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' },
        { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' },
        { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' },
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' },
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' },
      ],
      kel,
    )
    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    expect(hasil.berhasil).toBe(true)
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 8)
    expect(kelBaru.ttm).toBe('aksi')
    expect(kelBaru.indikator.jamban_sehat.status).toBe('ya')
    expect(kelBaru.indikator.jamban_sehat.statusSebenarnya).toBe('ya')
    expect(kelBaru.arcSelesai).toBe('berhasil')
  })
})

/* ---------------------------------------------------------------------------
 * PIS-PK: N/A tidak masuk IKS
 * ------------------------------------------------------------------------- */

describe('hitungIksKeluarga (PIS-PK kanonik)', () => {
  it('N/A demografis & data belum-ada TIDAK masuk penyebut', () => {
    const kel = buatKel(5, {
      tidak_merokok: { status: 'ya', statusSebenarnya: 'ya', sumber: 'kader', hariData: 2 },
      jkn: { status: 'ya', statusSebenarnya: 'ya', sumber: 'dokter', hariData: 2 },
      jamban_sehat: { status: 'tidak', statusSebenarnya: 'tidak', sumber: 'dokter', hariData: 2 },
      // 'na' ber-sumber dokter → tetap dikecualikan (N/A demografis).
      kb: { status: 'na', statusSebenarnya: 'na', sumber: 'dokter', hariData: 2 },
      // Ada nilai tapi sumber masih 'belum' → belum boleh dihitung.
      hipertensi_berobat: { status: 'tidak', statusSebenarnya: 'tidak', sumber: 'belum', hariData: 0 },
    })
    expect(hitungIksKeluarga(kel)).toBeCloseTo(2 / 3, 10)
  })

  it('tanpa satu pun data → null, bukan nol', () => {
    expect(hitungIksKeluarga(buatKel(5))).toBeNull()
  })

  it('klasifikasi: >0.8 sehat, 0.5-0.8 pra-sehat, <0.5 tidak sehat', () => {
    expect(klasifikasiIks(0.9)).toBe('sehat')
    expect(klasifikasiIks(0.8)).toBe('pra_sehat')
    expect(klasifikasiIks(0.5)).toBe('pra_sehat')
    expect(klasifikasiIks(0.49)).toBe('tidak_sehat')
  })
})

/* ---------------------------------------------------------------------------
 * Kader: bias membalik data
 * ------------------------------------------------------------------------- */

const BINAAN_UJI: KeluargaBinaan = {
  id: 'fam1',
  namaKeluarga: 'Keluarga Raharjo',
  rw: 1,
  jarakMenit: 10,
  ekonomi: 'miskin',
  anggota: [{ nama: 'Raharjo', usia: 45, jenisKelamin: 'L', peran: 'kepala' }],
  indikatorAwal: { tidak_merokok: 'tidak', jamban_sehat: 'ya', air_bersih: 'tidak' },
  arc: {
    sinopsis: 'Keluarga pekerja keras yang belum punya jamban.',
    kunjungan: [],
    epilogBerhasil: 'Jamban berdiri; sungai kembali jadi tempat mandi saja.',
    epilogGagal: 'Musim hujan datang, diare ikut datang.',
  },
}

const KADER_UJI: KaderProfil = {
  id: 'k1',
  nama: 'Bu Sari',
  rw: 1,
  // Ketelitian sempurna → satu-satunya sumber kesalahan adalah BIAS.
  ketelitian: 100,
  bias: ['tidak_merokok'],
  persona: 'Sungkan menanyakan soal rokok ke bapak-bapak.',
}

const RW_UJI: RwProfil = { nomor: 1, nama: 'Banjar Kaja', jarak: 'dekat', totalKk: 25 }

function buatPackKader(): ContentPack {
  return {
    kasus: {},
    kasusIgd: {},
    keluarga: { fam1: BINAAN_UJI },
    kader: [KADER_UJI],
    rw: [RW_UJI],
    rumahSakit: [],
    obat: {},
    lab: {},
    edukasi: {},
    tindakan: {},
    skdi144: [],
    namaWarga: { pria: [], wanita: [], keluarga: [] },
  }
}

function buatStateKader(): GameState {
  const fam1: KeluargaState = {
    id: 'fam1',
    trust: 2,
    ttm: 'prekontemplasi',
    indikator: indikatorPenuh({
      tidak_merokok: { status: 'tidak', statusSebenarnya: 'tidak', sumber: 'belum', hariData: 0 },
      jamban_sehat: { status: 'ya', statusSebenarnya: 'ya', sumber: 'belum', hariData: 0 },
      air_bersih: { status: 'tidak', statusSebenarnya: 'tidak', sumber: 'belum', hariData: 0 },
    }),
    arcIndex: 0,
    jumlahKunjungan: 0,
  }
  return {
    versi: 1,
    seed: 42,
    namaDokter: 'dr. Uji',
    hari: 2,
    blok: 'pagi',
    stamina: 6,
    burnout: 0,
    klinik: { antrian: [], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
    desa: {
      keluarga: { fam1 },
      kader: {
        k1: { id: 'k1', nama: 'Bu Sari', rw: 1, ketelitian: 100, bias: ['tidak_merokok'], kkTersurvei: 0 },
      },
      rw: [{ nomor: 1, nama: 'Banjar Kaja', jarak: 'dekat', totalKk: 25, kkTersurvei: 0, iks: 0, bonusIks: 0 }],
      binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 }
    },
    inbox: [],
    jadwal: [],
    tally: {
      totalPasien: 0,
      diagnosisBenar: 0,
      tegakBenar: 0,
      tegakSalah: 0,
      suspekBenar: 0,
      suspekSalah: 0,
      rujukanTotal: 0,
      rujukanNonSpesialistik: 0,
    rujukanTepat: 0, rujukanDitolak: 0,
      cowboy: 0,
      antibiotikTanpaIndikasi: 0,
      labTakRelevan: 0,
      miTepat: 0,
      miTotal: 0,
      kunjunganBerhasil: 0,
      kunjunganTotal: 0,
      kunjunganDiusir: 0,
      apathy: 0,
      autoBermasalah: 0,
      posyanduSesi: 0, prolanisSesi: 0, klbTuntas: 0, igdStabil: 0, igdMeninggal: 0,
      hariKelelahan: 0,
      karmaTerjadi: 0,
      karmaDicegah: 0,
    },
    dex: {},
    log: [],
    kapitasi: 15_000_000,
    refleksi: {},
    flags: {},
    layar: 'meja',
    lapanganTerpakai: false,
    igdHariIni: false,
    prolanis: { roster: [] },
    posyanduRwTerakhir: {},
    program: {},
  }
}

describe('prosesHarianKader (scout)', () => {
  it('bias kader MEMBALIK data indikatornya; sisanya akurat pada ketelitian penuh', () => {
    const state = buatStateKader()
    const r = prosesHarianKader(state, buatPackKader(), new Rng(42, 'kader', 2))

    const fam = r.keluarga['fam1']
    expect(fam).toBeDefined()
    // Bias 'tidak_merokok': sebenarnya 'tidak' → dilaporkan 'ya' (bohong data!).
    expect(fam!.indikator.tidak_merokok.status).toBe('ya')
    expect(fam!.indikator.tidak_merokok.statusSebenarnya).toBe('tidak')
    expect(fam!.indikator.tidak_merokok.sumber).toBe('kader')
    expect(fam!.indikator.tidak_merokok.hariData).toBe(2)
    // Non-bias, ketelitian 100 → akurat.
    expect(fam!.indikator.jamban_sehat.status).toBe('ya')
    expect(fam!.indikator.air_bersih.status).toBe('tidak')
    expect(fam!.indikator.air_bersih.sumber).toBe('kader')
    // N/A demografis tidak diisi kader.
    expect(fam!.indikator.kb.sumber).toBe('belum')

    // State asal tidak dimutasi.
    expect(state.desa.keluarga['fam1']!.indikator.tidak_merokok.sumber).toBe('belum')
    expect(state.desa.rw[0]!.kkTersurvei).toBe(0)
  })

  it('survei 2-4 KK/hari, IKS RW tercampur baseline, surat ber-id deterministik', () => {
    const state = buatStateKader()
    const r = prosesHarianKader(state, buatPackKader(), new Rng(42, 'kader', 2))

    const rw1 = r.rw[0]
    expect(rw1).toBeDefined()
    expect(rw1!.kkTersurvei).toBeGreaterThanOrEqual(2)
    expect(rw1!.kkTersurvei).toBeLessThanOrEqual(4)
    expect(r.kader['k1']!.kkTersurvei).toBe(rw1!.kkTersurvei)

    // IKS keluarga TERCATAT: ya(tidak_merokok bohong) + ya(jamban) + tidak(air) = 2/3;
    // dicampur 50:50 baseline dekat 0.62 ± 0.05 → kisaran ~0.62-0.67.
    expect(rw1!.iks).toBeGreaterThan(0.55)
    expect(rw1!.iks).toBeLessThan(0.75)

    // Maksimal 1 surat/hari dengan id kanonik surat_kader_{hari}_{kaderId}.
    expect(r.surat).toHaveLength(1)
    expect(r.surat[0]!.id).toBe('surat_kader_2_k1')
    expect(r.surat[0]!.jenis).toBe('laporan_kader')
    expect(r.surat[0]!.hari).toBe(2)
    expect(r.surat[0]!.isi.length).toBeGreaterThan(40)
  })

  it('survei kumulatif mentok di totalKk dan indikator terisi tidak ditimpa ulang', () => {
    let state = buatStateKader()
    const pack = buatPackKader()
    // Jalankan 15 hari berturut-turut.
    for (let hari = 2; hari <= 16; hari++) {
      const r = prosesHarianKader({ ...state, hari }, pack, new Rng(42, 'kader', hari))
      state = {
        ...state,
        desa: { ...state.desa, keluarga: r.keluarga, rw: r.rw, kader: r.kader },
      }
    }
    expect(state.desa.rw[0]!.kkTersurvei).toBe(25) // cap totalKk
    // Data keluarga tetap dari hari pertama pengisian (hariData 2), tidak diflip-flip.
    expect(state.desa.keluarga['fam1']!.indikator.jamban_sehat.hariData).toBe(2)
    expect(state.desa.keluarga['fam1']!.indikator.tidak_merokok.status).toBe('ya')
  })
})
