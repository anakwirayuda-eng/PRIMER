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
import { aksiKunjungan, buatKunjungan, selesaikanKunjungan, skenarioEfektif, terapkanHasil } from './kunjungan'
import { prosesHarianKader } from './kader'

/* ---------------------------------------------------------------------------
 * Fixture
 * ------------------------------------------------------------------------- */

const RESPONS_JUJUR =
  'Sebenarnya belum ada, Dok. Tanahnya sempit, uangnya belum kumpul. Kami masih ke sungai.'
const RESPONS_BOHONG = 'Ada kok, Dok, di belakang. Cuma sedang diperbaiki, jadi jangan dilihat dulu ya.'

/** M11 #5 B1: buatKunjungan kini butuh Rng utk memilih varianId (tak dipakai
 * kasus tanpa varianKunjungan — SKENARIO/SKENARIO_ESKALASI di bawah tak
 * mendeklarasikannya, jadi rng ini murni memenuhi kontrak fungsi). */
const rngTest = new Rng(1, 'test')

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
          gaya: 'menghakimi',
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
          gaya: 'menghakimi',
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
          gaya: 'menghakimi',
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
 * skenarioEfektif — varian presentasi Tingkat-A (M11 #5 B1, 2026-07-17)
 * ------------------------------------------------------------------------- */

const SKENARIO_BER_VARIAN: SkenarioKunjungan = {
  ...SKENARIO,
  varianKunjungan: [
    {
      id: 'sore_hari',
      pembuka: 'Senja mulai turun; Pak Raharjo baru pulang menambal jaring, tangannya masih bau amis.',
      hotspotBerubah: { h_dapur: { narasi: 'Tungku sudah dingin, sisa nasi sore digantung di para-para.' } },
      dialogNarasiBerubah: { n1: 'Pak Raharjo menyeka keringat, lampu teplok baru dinyalakan istrinya.' },
      pilihanBerubah: { p2_ungkap: { respons: 'Sore ini belum sempat, Dok — nanti kalau air surut baru ke sana.' } },
      penutupBerhasil: 'Lampu teplok dinyalakan lebih terang saat kamu pamit. "Datang lagi ya, Dok," kata Bu Raharjo.',
    },
    { id: 'gerbang_diganti', pilihanBerubah: { p2_ungkap: { responsBohong: 'Sudah lama ada kok, Dok, dari saya kecil malah.' } } },
  ],
}

describe('skenarioEfektif', () => {
  it('tanpa varianId (undefined) — kembalikan skenario dasar APA ADANYA (referensi identik)', () => {
    expect(skenarioEfektif(SKENARIO_BER_VARIAN, undefined)).toBe(SKENARIO_BER_VARIAN)
  })

  it("varianId '_dasar' eksplisit — sama seperti undefined", () => {
    expect(skenarioEfektif(SKENARIO_BER_VARIAN, '_dasar')).toBe(SKENARIO_BER_VARIAN)
  })

  it('varianId tak dikenal — jatuh kembali ke dasar, bukan error', () => {
    expect(skenarioEfektif(SKENARIO_BER_VARIAN, 'tak_ada_ini')).toBe(SKENARIO_BER_VARIAN)
  })

  it('varian mengganti pembuka', () => {
    expect(skenarioEfektif(SKENARIO_BER_VARIAN, 'sore_hari').pembuka).toBe(
      'Senja mulai turun; Pak Raharjo baru pulang menambal jaring, tangannya masih bau amis.',
    )
  })

  it('varian mengganti narasi SATU hotspot — hotspot lain & indikator/x/y tak berubah', () => {
    const efektif = skenarioEfektif(SKENARIO_BER_VARIAN, 'sore_hari')
    const dapur = efektif.hotspot.find((h) => h.id === 'h_dapur')!
    expect(dapur.narasi).toBe('Tungku sudah dingin, sisa nasi sore digantung di para-para.')
    expect(dapur.x).toBe(28)
    expect(dapur.y).toBe(42)
    const belakang = efektif.hotspot.find((h) => h.id === 'h_belakang')!
    expect(belakang).toEqual(SKENARIO.hotspot.find((h) => h.id === 'h_belakang'))
  })

  it('varian mengganti narasi SATU node dialog — node lain & pilihan-nya tak berubah', () => {
    const efektif = skenarioEfektif(SKENARIO_BER_VARIAN, 'sore_hari')
    const n1 = efektif.dialog.find((d) => d.id === 'n1')!
    expect(n1.narasi).toBe('Pak Raharjo menyeka keringat, lampu teplok baru dinyalakan istrinya.')
    expect(n1.pilihan).toEqual(SKENARIO.dialog.find((d) => d.id === 'n1')!.pilihan)
    const n3 = efektif.dialog.find((d) => d.id === 'n3')!
    expect(n3).toEqual(SKENARIO.dialog.find((d) => d.id === 'n3'))
  })

  it('varian mengganti respons SATU pilihan — gaya/efekTrust/tepat/ungkap.indikator/ambangTrust tak berubah', () => {
    const efektif = skenarioEfektif(SKENARIO_BER_VARIAN, 'sore_hari')
    const n2 = efektif.dialog.find((d) => d.id === 'n2')!
    const p2 = n2.pilihan.find((p) => p.id === 'p2_ungkap')!
    expect(p2.respons).toBe('Sore ini belum sempat, Dok — nanti kalau air surut baru ke sana.')
    expect(p2.gaya).toBe('refleksi')
    expect(p2.efekTrust).toBe(1)
    expect(p2.tepat).toBe(true)
    expect(p2.ungkap).toEqual({ indikator: 'jamban_sehat', ambangTrust: 5, responsBohong: RESPONS_BOHONG })
    // Pilihan lain di node yang sama tak tersentuh.
    const p2Netral = n2.pilihan.find((p) => p.id === 'p2_netral')!
    expect(p2Netral).toEqual(SKENARIO.dialog.find((d) => d.id === 'n2')!.pilihan.find((p) => p.id === 'p2_netral'))
  })

  it('varian mengganti HANYA responsBohong (gerbang kejujuran) — respons jujur & ambang tak berubah', () => {
    const efektif = skenarioEfektif(SKENARIO_BER_VARIAN, 'gerbang_diganti')
    const p2 = efektif.dialog.find((d) => d.id === 'n2')!.pilihan.find((p) => p.id === 'p2_ungkap')!
    expect(p2.ungkap?.responsBohong).toBe('Sudah lama ada kok, Dok, dari saya kecil malah.')
    expect(p2.respons).toBe(RESPONS_JUJUR)
    expect(p2.ungkap?.ambangTrust).toBe(5)
    expect(p2.ungkap?.indikator).toBe('jamban_sehat')
  })

  it('varian mengganti penutup', () => {
    expect(skenarioEfektif(SKENARIO_BER_VARIAN, 'sore_hari').penutupBerhasil).toBe(
      'Lampu teplok dinyalakan lebih terang saat kamu pamit. "Datang lagi ya, Dok," kata Bu Raharjo.',
    )
    expect(skenarioEfektif(SKENARIO_BER_VARIAN, 'sore_hari').penutupGagal).toBe(SKENARIO.penutupGagal)
  })

  /**
   * REGRESI — jaminan STRUKTURAL Tingkat-A: ground-truth pedagogis kunjungan
   * tak PERNAH berubah oleh varian mana pun (padanan test kunci-jawaban UKP).
   */
  it('ground-truth (target/hambatan/petunjuk/intervensi/karma) TAK PERNAH berubah oleh varian mana pun', () => {
    for (const id of ['sore_hari', 'gerbang_diganti']) {
      const efektif = skenarioEfektif(SKENARIO_BER_VARIAN, id)
      expect(efektif.target).toBe(SKENARIO_BER_VARIAN.target)
      expect(efektif.hambatanSebenarnya).toBe(SKENARIO_BER_VARIAN.hambatanSebenarnya)
      expect(efektif.petunjukHambatan).toBe(SKENARIO_BER_VARIAN.petunjukHambatan)
      expect(efektif.intervensi).toBe(SKENARIO_BER_VARIAN.intervensi)
      expect(efektif.karma).toBe(SKENARIO_BER_VARIAN.karma)
    }
  })

  it('skenario TANPA varianKunjungan sama sekali — skenarioEfektif selalu identitas', () => {
    expect(skenarioEfektif(SKENARIO, undefined)).toBe(SKENARIO)
    expect(skenarioEfektif(SKENARIO, 'apa_saja')).toBe(SKENARIO)
  })
})

/* ---------------------------------------------------------------------------
 * buatKunjungan — pemilihan varianId (RNG)
 * ------------------------------------------------------------------------- */

describe('buatKunjungan — varianId', () => {
  it('skenario TANPA varianKunjungan — varianId selalu undefined', () => {
    for (let seed = 0; seed < 30; seed++) {
      const kj = buatKunjungan('fam_raharjo', SKENARIO, new Rng(seed, 'kunjungan-varian'))
      expect(kj.varianId).toBeUndefined()
    }
  })

  it('skenario BER-varianKunjungan — ketiga hasil (_dasar + 2 varian) muncul dalam 100 percobaan', () => {
    const hasil = new Set<string | undefined>()
    for (let seed = 0; seed < 100; seed++) {
      const kj = buatKunjungan('fam_raharjo', SKENARIO_BER_VARIAN, new Rng(seed, 'kunjungan-varian', seed))
      hasil.add(kj.varianId)
    }
    expect(hasil).toEqual(new Set(['_dasar', 'sore_hari', 'gerbang_diganti']))
  })

  it('deterministik utk seed sama, bervariasi lintas seed', () => {
    const kj1a = buatKunjungan('fam_raharjo', SKENARIO_BER_VARIAN, new Rng(7, 'kunjungan-varian'))
    const kj1b = buatKunjungan('fam_raharjo', SKENARIO_BER_VARIAN, new Rng(7, 'kunjungan-varian'))
    expect(kj1a.varianId).toBe(kj1b.varianId)
    const varianLintasSeed = new Set(
      Array.from({ length: 20 }, (_, seed) => buatKunjungan('fam_raharjo', SKENARIO_BER_VARIAN, new Rng(seed, 'kunjungan-varian')).varianId),
    )
    expect(varianLintasSeed.size).toBeGreaterThan(1)
  })
})

/* ---------------------------------------------------------------------------
 * Gerbang kejujuran — dua sisi
 * ------------------------------------------------------------------------- */

describe('gerbang kejujuran', () => {
  it('trust cukup → warga jujur, indikator terverifikasi BENAR', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 4, 2)
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
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 4, 2)
    expect(kelBaru.indikator.jamban_sehat.status).toBe('ya')
    expect(kelBaru.indikator.jamban_sehat.statusSebenarnya).toBe('tidak')
    expect(kelBaru.indikator.jamban_sehat.sumber).toBe('dokter')
  })

  it('Fix Addendum Q6/Asih (adjudikasi dokter 2026-07-11): hipotesis+kartu BENAR tapi kualitasMi di bawah ambang (dialog asal tebak) → berhasil=false, tingkat=partial', () => {
    const kel = buatKel(5)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_edukasi' }, // tepat:false
        { type: 'PILIH_DIALOG', pilihanId: 'p2_netral' }, // tepat:false
        { type: 'PILIH_DIALOG', pilihanId: 'p3_netral' }, // tepat:false
        { type: 'LANJUT_BABAK' },
        { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' }, // BENAR
        { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' }, // cocok
      ],
      kel,
    )
    const hasil = selesaikanKunjungan(r.kj, SKENARIO, kel)
    // 0/3 pilihan tepat → kualitasMi 0, di bawah AMBANG_KUALITAS_MI_BERHASIL (50)
    // — struktur (hipotesis+kartu) benar TAPI dialognya murni asal-tebak, jadi
    // TIDAK lagi otomatis "berhasil" (beda dari sebelum fix Addendum Q6).
    expect(hasil.kualitasMi).toBe(0)
    expect(hasil.hipotesisBenar).toBe(true)
    expect(hasil.berhasil).toBe(false)
    expect(hasil.tingkat).toBe('partial')
  })

  it('hotspot mengalahkan kebohongan: yang terlihat mata tidak bisa dibohongi', () => {
    const kel = kelJambanBohong(2)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 4, 2)
    expect(kelBaru.indikator.jamban_sehat.status).toBe('tidak')
  })

  it('pilihan yang menyebut petunjuk observasi ditolak sampai hotspot ditemukan', () => {
    const gated: SkenarioKunjungan = {
      ...SKENARIO,
      dialog: SKENARIO.dialog.map((node) => node.id !== 'n2' ? node : {
        ...node,
        pilihan: node.pilihan.map((pilihan) => pilihan.id !== 'p2_ungkap' ? pilihan : {
          ...pilihan,
          butuhHotspot: ['h_belakang'],
        }),
      }),
    }
    const kel = buatKel(5)

    let tanpaObservasi = buatKunjungan(kel.id, gated, rngTest)
    tanpaObservasi = aksiKunjungan(tanpaObservasi, { type: 'LANJUT_BABAK' }, gated, kel).kj
    tanpaObservasi = aksiKunjungan(
      tanpaObservasi,
      { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' },
      gated,
      kel,
    ).kj
    const ditolak = aksiKunjungan(
      tanpaObservasi,
      { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' },
      gated,
      kel,
    )
    expect(ditolak.kj.dialogIndex).toBe(1)
    expect(ditolak.events).toContainEqual({
      type: 'ERROR_AKSI',
      pesan: 'Amati dulu petunjuk yang mendasari tanggapan itu.',
    })

    let denganObservasi = buatKunjungan(kel.id, gated, rngTest)
    denganObservasi = aksiKunjungan(
      denganObservasi,
      { type: 'KLIK_HOTSPOT', hotspotId: 'h_belakang' },
      gated,
      kel,
    ).kj
    denganObservasi = aksiKunjungan(denganObservasi, { type: 'LANJUT_BABAK' }, gated, kel).kj
    denganObservasi = aksiKunjungan(
      denganObservasi,
      { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' },
      gated,
      kel,
    ).kj
    const diterima = aksiKunjungan(
      denganObservasi,
      { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' },
      gated,
      kel,
    )
    expect(diterima.kj.dialogIndex).toBe(2)
    expect(wargaBicara(diterima.events)).toHaveLength(1)
  })
})

/* ---------------------------------------------------------------------------
 * Diusir — 2 konfrontasi beruntun
 * ------------------------------------------------------------------------- */

describe('konfrontasi & diusir', () => {
  it('dua konfrontasi beruntun → diusir, kunjungan hangus', () => {
    const kel = buatKel(5)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 3, 2)
    expect(kelBaru.trust).toBe(1)
    expect(kelBaru.ttm).toBe('prekontemplasi')
  })

  it('konfrontasi yang diselingi pilihan lain TIDAK mengusir (beruntun ter-reset)', () => {
    const kel = buatKel(5)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
 * Babak Ingatkan (SAJI) — hanya babak yang DIJALANI yang dinilai
 * ------------------------------------------------------------------------- */

const SKENARIO_INGATKAN: SkenarioKunjungan = {
  ...SKENARIO,
  pilihanIngatkan: {
    prompt: 'Sebelum pamit, bagaimana kamu mengingatkan rencana tadi?',
    pilihan: [
      {
        id: 'ing_tepat',
        teks: 'Boleh Bapak ulang rencananya dengan kalimat sendiri? Nanti saya mampir lagi hari Kamis.',
        tepat: true,
        respons: 'Pak Raharjo mengulang rencananya, lalu menyebut hari Kamis itu sendiri.',
      },
      {
        id: 'ing_ceramah',
        teks: 'Saya ulang sekali lagi ya bahayanya BAB di sungai, biar Bapak ingat terus.',
        tepat: false,
        respons: 'Pak Raharjo tersenyum tipis, matanya sudah melirik ke arah pintu.',
        catatanPedagogis: 'Menutup dengan ceramah menghapus kesepakatan yang baru saja dibangun.',
      },
      {
        id: 'ing_pamit',
        teks: 'Kalau begitu saya pamit dulu, Pak.',
        tepat: false,
        respons: 'Pintu ditutup pelan, tanpa satu pun kesepakatan diulang.',
      },
    ],
  },
}

function jalankanIngatkan(aksi: Action[], kel: KeluargaState): KunjunganState {
  let kj = buatKunjungan(kel.id, SKENARIO_INGATKAN, rngTest)
  for (const a of aksi) kj = aksiKunjungan(kj, a, SKENARIO_INGATKAN, kel).kj
  return kj
}

describe('babak Ingatkan', () => {
  const WAWANCARA_SEMPURNA: Action[] = [
    { type: 'LANJUT_BABAK' },
    { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' },
    { type: 'PILIH_DIALOG', pilihanId: 'p2_ungkap' },
    { type: 'PILIH_DIALOG', pilihanId: 'p3_refleksi' },
    { type: 'LANJUT_BABAK' },
    { type: 'KOMIT_HAMBATAN', hipotesis: 'kesempatan' },
    { type: 'PILIH_INTERVENSI', intervensiId: 'i_arisan' },
  ]

  it('diusir di tengah wawancara → babak yang tak pernah ditawarkan tidak dinilai', () => {
    const kel = buatKel(5)
    const kj = jalankanIngatkan(
      [
        { type: 'LANJUT_BABAK' },
        { type: 'PILIH_DIALOG', pilihanId: 'p1_empati' }, // tepat
        { type: 'PILIH_DIALOG', pilihanId: 'p2_konfrontasi' },
        { type: 'PILIH_DIALOG', pilihanId: 'p3_konfrontasi' },
      ],
      kel,
    )
    expect(kj.diusir).toBe(true)
    expect(kj.ingatkanDipilih).toBeUndefined()

    const hasil = selesaikanKunjungan(kj, SKENARIO_INGATKAN, kel)
    expect(hasil.kualitasMi).toBe(33) // 1 dari 3 pilihan tepat
    expect(hasil.kualitasIngatkan).toBeUndefined()
    expect('kualitasIngatkan' in hasil).toBe(false)
    // Bobot 20% dinormalisasi ke MI — bukan 0.8×33 = 26.
    expect(hasil.kualitasSaji).toBe(33)
  })

  it('babak dijalani dengan pilihan keliru → tetap memotong 20% seperti semula', () => {
    const kel = kelJambanBohong(6)
    const kj = jalankanIngatkan(
      [...WAWANCARA_SEMPURNA, { type: 'PILIH_INGATKAN', pilihanId: 'ing_pamit' }],
      kel,
    )
    const hasil = selesaikanKunjungan(kj, SKENARIO_INGATKAN, kel)
    expect(hasil.kualitasMi).toBe(100)
    expect(hasil.kualitasIngatkan).toBe(0)
    expect(hasil.kualitasSaji).toBe(80)
  })

  it('babak dijalani dengan pilihan tepat → SAJI penuh', () => {
    const kel = kelJambanBohong(6)
    const kj = jalankanIngatkan(
      [...WAWANCARA_SEMPURNA, { type: 'PILIH_INGATKAN', pilihanId: 'ing_tepat' }],
      kel,
    )
    const hasil = selesaikanKunjungan(kj, SKENARIO_INGATKAN, kel)
    expect(hasil.kualitasIngatkan).toBe(100)
    expect(hasil.kualitasSaji).toBe(100)
  })
})

/* ---------------------------------------------------------------------------
 * Hipotesis hambatan salah → kunjungan gagal
 * ------------------------------------------------------------------------- */

describe('diagnosis perilaku (COM-B)', () => {
  it('hipotesis salah → gagal walau intervensi kebetulan cocok', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 5, 2)
    expect(kelBaru.ttm).toBe('prekontemplasi')
    expect(kelBaru.arcIndex).toBe(0)
    expect(kelBaru.jumlahKunjungan).toBe(1)
    expect(kelBaru.kunjunganTerakhir).toBe(5)
    expect(kelBaru.indikator.jamban_sehat.status).toBe('tidak')
  })

  it('intervensi salah sasaran → gagal walau hipotesis benar', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    expect(hasil.narasiPenutup).toContain('Warga datang, mengangguk, lalu pulang seperti biasa.')
    expect(hasil.narasiPenutup).toContain(SKENARIO.penutupGagal)
    expect(hasil.catatanPedagogis?.[0]).toMatch(/Konteks domain saja.*distraktor pedagogis/i)
  })

  it('kualitas MI = proporsi pilihan tepat', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    expect(hasil.narasiPenutup).toContain('Pak Raharjo mendaftar arisan gelombang pertama.')
    expect(hasil.narasiPenutup).toContain(SKENARIO.penutupBerhasil)
    const kelBaru = terapkanHasil(kel, hasil, SKENARIO, 8, 2)
    expect(kelBaru.ttm).toBe('aksi')
    // #4 outcome-window (audit CODEX UKM 2026-07-16): arc tamat = warga BERJANJI
    // berubah — indikator target `status:'ya'` (IKS naik optimis) tapi
    // `statusSebenarnya` BELUM berubah (masih 'tidak' seperti sebelumnya) &
    // sumber 'janji'. Reducer menjadwalkan verifikasi outcome tertunda.
    expect(kelBaru.indikator.jamban_sehat.status).toBe('ya')
    expect(kelBaru.indikator.jamban_sehat.statusSebenarnya).toBe('tidak')
    expect(kelBaru.indikator.jamban_sehat.sumber).toBe('janji')
    expect(kelBaru.arcSelesai).toBe('berhasil')
  })
})

/* ---------------------------------------------------------------------------
 * Tambahan #1 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): aksiEskalasi
 * ------------------------------------------------------------------------- */

describe('aksiEskalasi (arc ber-karma keselamatan tinggi, mis. preeklampsia Asih)', () => {
  // Dua kartu SAMA-SAMA cocok kategori 'kesempatan' — i_arisan (kartu lama,
  // TANPA flag) vs i_arisan_formal (BER-flag aksiEskalasi:true). Menguji
  // gerbang independen dari kebetulan 1-kartu-per-kategori di konten asli.
  const SKENARIO_ESKALASI: SkenarioKunjungan = {
    ...SKENARIO,
    intervensi: [
      ...SKENARIO.intervensi,
      {
        id: 'i_arisan_formal',
        nama: 'Daftar formal ke bidan desa',
        deskripsi: 'Tindakan eskalasi sungguhan — bukan sekadar arisan.',
        cocokUntuk: ['kesempatan'],
        hasilNarasi: 'Terdaftar resmi ke bidan.',
        aksiEskalasi: true,
      },
    ],
  }

  function jalankanEskalasi(intervensiId: string): { kj: KunjunganState; kel: KeluargaState } {
    const kel = kelJambanBohong(6)
    let kj = buatKunjungan(kel.id, SKENARIO_ESKALASI, rngTest)
    for (const a of [
      { type: 'LANJUT_BABAK' as const },
      { type: 'PILIH_DIALOG' as const, pilihanId: 'p1_empati' },
      { type: 'PILIH_DIALOG' as const, pilihanId: 'p2_ungkap' },
      { type: 'PILIH_DIALOG' as const, pilihanId: 'p3_refleksi' },
      { type: 'LANJUT_BABAK' as const },
      { type: 'KOMIT_HAMBATAN' as const, hipotesis: 'kesempatan' as const },
      { type: 'PILIH_INTERVENSI' as const, intervensiId },
    ]) {
      kj = aksiKunjungan(kj, a, SKENARIO_ESKALASI, kel).kj
    }
    return { kj, kel }
  }

  it('hipotesis+kategori benar TAPI kartu yg dipilih BUKAN aksiEskalasi → berhasil=false, tingkat=partial (bukan gagal)', () => {
    const { kj, kel } = jalankanEskalasi('i_arisan') // kartu lama, cocok kategori, TANPA flag
    const hasil = selesaikanKunjungan(kj, SKENARIO_ESKALASI, kel)
    expect(hasil.berhasil).toBe(false)
    expect(hasil.tingkat).toBe('partial')
  })

  it('hipotesis+kategori benar DAN kartu aksiEskalasi yg dipilih → berhasil=true seperti biasa', () => {
    const { kj, kel } = jalankanEskalasi('i_arisan_formal')
    const hasil = selesaikanKunjungan(kj, SKENARIO_ESKALASI, kel)
    expect(hasil.berhasil).toBe(true)
  })

  it('skenario TANPA kartu aksiEskalasi sama sekali tak terpengaruh (regresi lama tetap berlaku)', () => {
    const kel = kelJambanBohong(6)
    const r = jalankan(
      buatKunjungan(kel.id, SKENARIO, rngTest),
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
    contentRelease: 'legacy-baseline',
    seed: 42,
    mode: 'karier' as const,
    seedKurikulum: 42,
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
      sumSkorProses: 0,
      tegakBenar: 0,
      tegakSalah: 0,
      suspekBenar: 0,
      suspekSalah: 0,
      rujukanTotal: 0,
      rujukanNonSpesialistik: 0,
    rujukanTepat: 0, rujukanDitolak: 0,
      cowboy: 0,
      antibiotikTanpaIndikasi: 0,
      obatBerbahaya: 0,
      tindakanBerbahaya: 0,
      firewallTerpicu: 0,
      stabilisasiTerlewat: 0,
      labTakRelevan: 0,
      miTepat: 0,
      miTotal: 0,
      kunjunganBerhasil: 0,
      kunjunganTotal: 0,
      kunjunganDiusir: 0,
      apathy: 0,
      autoBermasalah: 0,
      posyanduSesi: 0, prolanisSesi: 0, klbTuntas: 0, igdStabil: 0, igdSalahDisposisi: 0, igdMeninggal: 0, igdKodeBiruTerjadi: 0, rmLengkap: 0, teguranDinkes: 0,
      hariKelelahan: 0,
      karmaTerjadi: 0,
      karmaDicegah: 0,
    },
    dex: {},
    log: [],
    jejak: [],
    kapitasi: 15_000_000,
    gudang: { stok: {}, pesanan: [] },
    keuanganBulan: { belanjaObat: 0, belanjaPengadaan: 0 },
    refleksi: {},
    flags: {},
    layar: 'meja',
    lapanganTerpakai: false,
    igdHariIni: false,
    prolanis: { roster: [] },
    posyanduRwTerakhir: {},
    program: {},
    tutorialAktif: false,
    careEpisodes: [],
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

  it('survei 2-4 KK/hari, IKS RW formula resmi (proporsi sehat), surat ber-id deterministik', () => {
    const state = buatStateKader()
    const r = prosesHarianKader(state, buatPackKader(), new Rng(42, 'kader', 2))

    const rw1 = r.rw[0]
    expect(rw1).toBeDefined()
    expect(rw1!.kkTersurvei).toBeGreaterThanOrEqual(2)
    expect(rw1!.kkTersurvei).toBeLessThanOrEqual(4)
    expect(r.kader['k1']!.kkTersurvei).toBe(rw1!.kkTersurvei)

    // M10.5 #5: IKS keluarga TERCATAT fam1 = ya(tidak_merokok bohong)+ya(jamban)+
    // tidak(air) = 2/3 ≈ 0.667 — DI BAWAH ambang 'sehat' (>0.8), jadi fam1 TIDAK
    // menyumbang ke pembilang (sehatBinaan=0, berdataBinaan=1). Total IKS RW =
    // (0 + proporsiBaseline(dekat≈0.18-0.22)×kkTersurvei) / (1+kkTersurvei) —
    // dgn kkTersurvei 2-4, hasil berkisar ~0.10-0.18 (jauh lebih rendah dari
    // formula rata-rata kontinu lama, sesuai realita riil proporsi 'Keluarga
    // Sehat' yg rendah).
    expect(rw1!.iks).toBeGreaterThan(0.1)
    expect(rw1!.iks).toBeLessThan(0.2)

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
    // CODEX audit (2026-07-12, temuan #8 Bagian B): plafon survei STATISTIK
    // kini totalKk DIKURANGI keluarga binaan bernama (fam1, sudah didata
    // individual) — 25-1=24, bukan totalKk mentah (dulu bikin totalKeluarga
    // dobel-hitung fam1 begitu survei statistik penuh).
    expect(state.desa.rw[0]!.kkTersurvei).toBe(24) // cap totalKk - binaan
    // #8 staging (audit CODEX UKM 2026-07-16): kader mengisi maks 2 indikator
    // 'belum' per keluarga per HARI (urutan SEMUA_INDIKATOR_PISPK). fam1 punya
    // 3 'belum' non-na (tidak_merokok#8, air_bersih#10, jamban_sehat#11) → hari 2
    // isi 2 pertama (tidak_merokok+air_bersih), hari 3 isi jamban_sehat. Sekali
    // terisi, TIDAK diflip-flip di hari berikutnya (hariData stabil).
    expect(state.desa.keluarga['fam1']!.indikator.tidak_merokok.hariData).toBe(2)
    expect(state.desa.keluarga['fam1']!.indikator.air_bersih.hariData).toBe(2)
    expect(state.desa.keluarga['fam1']!.indikator.jamban_sehat.hariData).toBe(3)
    expect(state.desa.keluarga['fam1']!.indikator.tidak_merokok.status).toBe('ya')
  })

  // CODEX audit (2026-07-12, temuan #8 Bagian A): dulu `proporsiBaseline`
  // di-roll ULANG tiap hari (RNG reseed per-hari) walau kkTersurvei sudah
  // plateau (nol data baru) — iks RW hanyut ±0.02-0.03/hari murni dari
  // noise, bisa melompati ambang pengali kapitasi 0.18/0.24 tanpa aksi
  // pemain. Test ini mengunci: begitu di-roll SEKALI, iks TIDAK berubah lagi
  // lintas hari selama kkTersurvei tak bertambah.
  it('CODEX #8: iks RW TIDAK hanyut lintas hari begitu survei statistik plateau (nol data baru)', () => {
    let state = buatStateKader()
    const pack = buatPackKader()
    // Jalankan sampai kkTersurvei mentok di plafon (25-1=24) — beberapa hari
    // pertama genuinely menambah data baru.
    for (let hari = 2; hari <= 16; hari++) {
      const r = prosesHarianKader({ ...state, hari }, pack, new Rng(42, 'kader', hari))
      state = { ...state, desa: { ...state.desa, keluarga: r.keluarga, rw: r.rw, kader: r.kader } }
    }
    expect(state.desa.rw[0]!.kkTersurvei).toBe(24)
    const iksSetelahPlateau = state.desa.rw[0]!.iks
    const rollSetelahPlateau = state.desa.rw[0]!.proporsiBaselineRoll

    // 10 hari LAGI, sudah plateau — nol KK statistik baru, nol keluarga baru.
    for (let hari = 17; hari <= 26; hari++) {
      const r = prosesHarianKader({ ...state, hari }, pack, new Rng(42, 'kader', hari))
      state = { ...state, desa: { ...state.desa, keluarga: r.keluarga, rw: r.rw, kader: r.kader } }
      // iks & roll HARUS byte-identik tiap hari pasca-plateau — bukan cuma di akhir.
      expect(state.desa.rw[0]!.iks).toBe(iksSetelahPlateau)
      expect(state.desa.rw[0]!.proporsiBaselineRoll).toBe(rollSetelahPlateau)
    }
  })
})
