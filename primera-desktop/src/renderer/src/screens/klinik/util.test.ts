/**
 * Test util klinik — dua keluhan playtest user (2026-07-03):
 * 1. Pilihan diagnosis banding tampil "Kode M06.9" tanpa nama.
 * 2. Pencarian obat gagal karena ejaan Inggris (paracetamol/amoxicillin/
 *    cetirizine) vs nama katalog Indonesia (Parasetamol/Amoksisilin/Setirizin).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { NAMA_ICD } from '@content/icd10'
import { NAMA_DECK } from '@content/namaDeck'
import { cocokLab, cocokObat, namaDiagnosis, normalisasiNamaObat } from './util'

describe('namaDiagnosis — semua banding bernama', () => {
  it('kode dari screenshot playtest (M06.9, M54.5) kini bernama', () => {
    const mialgia = PACK.kasus['mm_mialgia']!
    for (const kode of mialgia.diagnosisBanding) {
      expect(namaDiagnosis(kode, mialgia)).not.toMatch(/^Kode /)
    }
  })

  it('TIDAK ADA kode banding mana pun yang jatuh ke fallback "Kode X"', () => {
    const telanjang: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      for (const kode of k.diagnosisBanding) {
        if (namaDiagnosis(kode, k).startsWith('Kode ')) telanjang.push(`${k.id}:${kode}`)
      }
    }
    expect(telanjang).toEqual([])
  })

  // Audit label 2026-08-22: label DISTRAKTOR tak boleh lagi bersumber dari nama
  // kasus playable lain. Lapisan itu membuat identitas kasus lain — berikut
  // penanda demografi & narasi gejalanya — bocor ke deck kasus yang
  // demografinya bertolak belakang ("Epilepsi Dewasa" di deck balita kejang
  // demam, "Mastoiditis Akut pada Anak" di deck pasien 15-40 th). Penjaga ini
  // memastikan lapisan itu tidak bisa dipasang kembali diam-diam: nama tiap
  // distraktor wajib SAMA PERSIS dengan sumber kurasi (SKDI-144 atau kamus
  // icd10.ts), bukan dengan nama kasus mana pun.
  it('label distraktor TIDAK PERNAH meminjam nama kasus playable lain', () => {
    const namaKasusLain = new Map<string, string>(
      Object.values(PACK.kasus).map((k) => [k.icd10, k.nama]),
    )
    const sumberKurasi = (kode: string): string | undefined =>
      PACK.skdi144.find((e) => e.icd10 === kode)?.nama ?? NAMA_ICD[kode]

    const meminjam: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      for (const kode of k.diagnosisBanding) {
        if (kode === k.icd10) continue // jawaban benar memang pakai nama kasusnya sendiri
        const tampil = namaDiagnosis(kode, k)
        const kurasi = sumberKurasi(kode)
        const pinjaman = namaKasusLain.get(kode)
        if (kurasi === undefined || tampil !== kurasi) {
          meminjam.push(`${k.id}:${kode} tampil "${tampil}" (kurasi: ${kurasi ?? 'TIDAK ADA'}, nama kasus lain: ${pinjaman ?? '-'})`)
        }
      }
    }
    expect(meminjam).toEqual([])
  })

  // Audit 2026-08-22 (lanjutan): NAMA_DECK menutup petunjuk GAYA — jawaban
  // benar tak boleh lagi menonjol karena panjang/hiasannya sendiri.
  describe('NAMA_DECK — label jawaban benar setara distraktornya', () => {
    it('setiap kunci NAMA_DECK menunjuk kasus yang benar-benar ada', () => {
      const yatim = Object.keys(NAMA_DECK).filter((id) => PACK.kasus[id] === undefined)
      expect(yatim).toEqual([])
    })

    it('label deck bebas penanda demografi, narasi temuan, dan embel tata laksana', () => {
      const KOTOR = /\b(Dewasa|Anak|Balita|Bayi|Neonatus|Lansia|Remaja)\b|—|\bSuspek\b|\bDugaan\b|\bCuriga\b|Pra-Rujuk|Rawat Jalan/i
      const kotor = Object.entries(NAMA_DECK)
        .filter(([, nama]) => KOTOR.test(nama))
        .map(([id, nama]) => `${id}: "${nama}"`)
      expect(kotor).toEqual([])
    })

    it('label deck bukan nama kode dari KELUARGA ICD lain (koding keliru tercetak di layar)', () => {
      // Kode ikut tampil di DeckDiagnosis, jadi label yang sebenarnya milik kode
      // lain mengajarkan koding salah. Contoh nyata yang pernah lolos ke draf:
      // J44.0 hendak diberi label "PPOK Eksaserbasi Akut" — itu nama J44.1.
      //
      // Dibandingkan per KELUARGA (3 karakter pertama), bukan per kode persis:
      // memakai nama induk untuk kode anak adalah praktik sah dan lazim di sini
      // (D50.0 & D50.9 sama-sama "Anemia Defisiensi Besi"). Yang dikejar adalah
      // label yang menyeberang ke keluarga LAIN.
      const keluarga = (kode: string): string => kode.split('.')[0] ?? kode
      const salahKode: string[] = []
      for (const [kasusId, nama] of Object.entries(NAMA_DECK)) {
        const kasus = PACK.kasus[kasusId]
        if (!kasus) continue
        // Kode RENTANG (mis. 'E50-E56') bukan kode ICD-10 sah dan sedang
        // menunggu keputusan dokter; jangan blokir di penjaga ini.
        if (kasus.icd10.includes('-')) continue
        const akar = keluarga(kasus.icd10)
        const bentrok = [
          ...Object.entries(NAMA_ICD)
            .filter(([kode, label]) => label === nama && keluarga(kode) !== akar)
            .map(([kode]) => kode),
          ...PACK.skdi144
            .filter((e) => e.nama === nama && keluarga(e.icd10) !== akar)
            .map((e) => e.icd10),
        ]
        if (bentrok.length > 0) {
          salahKode.push(`${kasusId} (${kasus.icd10}) "${nama}" = nama kode ${bentrok.join(', ')}`)
        }
      }
      expect(salahKode).toEqual([])
    })

    it('label deck TIDAK menonjol mencolok dari distraktor kasusnya', () => {
      const menonjol: string[] = []
      for (const [kasusId, nama] of Object.entries(NAMA_DECK)) {
        const kasus = PACK.kasus[kasusId]
        if (!kasus) continue
        const distraktor = kasus.diagnosisBanding
          .filter((kode) => kode !== kasus.icd10)
          .map((kode) => namaDiagnosis(kode, kasus))
        if (distraktor.length === 0) continue
        const terpanjang = Math.max(...distraktor.map((d) => d.length))
        // Ambang sengaja longgar (1,8x DAN selisih >12 karakter) karena yang
        // diburu adalah HIASAN, bukan panjang mentah: sebagian diagnosis memang
        // bernama panjang tanpa bisa dipendekkan (mis. "Perdarahan
        // Subkonjungtiva" 25 melawan "Episkleritis" 12 — keduanya sudah nama
        // minimal). Yang harus tertangkap adalah kelas "Penyakit Radang Panggul
        // Berat dengan Curiga Abses Tubo-Ovarium" (62) melawan "Kista Ovarium"
        // (13), di mana pemain bisa memilih dari bentuknya saja.
        if (nama.length > terpanjang * 1.8 && nama.length - terpanjang > 12) {
          menonjol.push(`${kasusId}: "${nama}" (${nama.length}) vs distraktor terpanjang ${terpanjang}`)
        }
      }
      expect(menonjol).toEqual([])
    })
  })

  // Temuan playtest 2026-07-04: dua kode banding berbeda (D50.9 & O99.0) tampil
  // NAMA IDENTIK di layar → pemain lihat opsi dobel, tak bisa membedakannya.
  it('TIDAK ADA dua kode banding dalam satu kasus yang tampil nama sama', () => {
    const tabrakan: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      const perNama = new Map<string, string[]>()
      for (const kode of k.diagnosisBanding) {
        const nama = namaDiagnosis(kode, k)
        perNama.set(nama, [...(perNama.get(nama) ?? []), kode])
      }
      for (const [nama, kodes] of perNama) {
        if (kodes.length > 1) tabrakan.push(`${k.id}: "${nama}" ← ${kodes.join(', ')}`)
      }
    }
    expect(tabrakan).toEqual([])
  })

  // Audit CODEX 2026-07-04: 27 kasus salah tampil label GENERIK skdi144 utk
  // JAWABAN BENARNYA SENDIRI (mis. "Hipertensi Urgensi" tertampil "Hipertensi
  // Esensial") krn urutan resolusi lama mengecek skdi144 sebelum kasus sendiri.
  // Jawaban benar kasus WAJIB pakai nama presisinya SENDIRI, tak pernah jatuh
  // ke label kompetensi generik.
  //
  // Audit 2026-08-22: sumber "nama sendiri" kini boleh berupa label deck
  // kurasi (NAMA_DECK) — itu tetap milik kasus itu, hanya dipangkas hiasannya
  // supaya tak menonjol di antara distraktor. Yang tetap dilarang keras sama
  // seperti dulu: jawaban benar mengambil label skdi144.
  it('jawaban benar kasus SELALU pakai nama sendiri/label deck, TAK PERNAH label skdi144', () => {
    // Cukup satu invarian: label jawaban benar WAJIB berasal dari kasus itu
    // sendiri (nama kasus, atau label deck kurasinya). Selama itu dipegang,
    // jalur resolusi tak pernah bisa sampai ke skdi144 untuk jawaban benar —
    // persis cacat yang ditemukan 2026-07-04. Catatan: sebuah label deck BOLEH
    // kebetulan sama bunyinya dengan nama kompetensi SKDI (mis. "Faringitis
    // Akut" memang nama minimal yang benar); yang dilarang adalah MENGAMBIL
    // dari sana, bukan kebetulan seragam.
    const salah: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      const tampil = namaDiagnosis(k.icd10, k)
      const seharusnya = NAMA_DECK[k.id] ?? k.nama
      if (tampil !== seharusnya) {
        salah.push(`${k.id}: tampil "${tampil}" ≠ label semestinya "${seharusnya}"`)
      }
    }
    expect(salah).toEqual([])
  })
})

describe('pencarian obat toleran-ejaan', () => {
  const obat = (id: string) => PACK.obat[id]!

  it('normalisasi fonetik EN→ID', () => {
    expect(normalisasiNamaObat('Paracetamol')).toBe(normalisasiNamaObat('Parasetamol'))
    expect(normalisasiNamaObat('Amoxicillin')).toBe(normalisasiNamaObat('Amoksisilin'))
    expect(normalisasiNamaObat('Cetirizine')).toBe(normalisasiNamaObat('Setirizine'))
    expect(normalisasiNamaObat('Ciprofloxacin')).toBe(normalisasiNamaObat('Siprofloksasin'))
  })

  it('ejaan Inggris menemukan obat katalog Indonesia', () => {
    expect(cocokObat(obat('paracetamol_500'), 'paracetamol')).toBe(true)
    expect(cocokObat(obat('amoxicillin_500'), 'amoxicillin')).toBe(true)
    expect(cocokObat(obat('cetirizine_10'), 'cetirizine')).toBe(true)
    expect(cocokObat(obat('ciprofloxacin_500'), 'ciprofloxacin')).toBe(true)
    expect(cocokObat(obat('asiklovir_400'), 'acyclovir')).toBe(true)
    expect(cocokObat(obat('cefadroxil_500'), 'cefadroxil')).toBe(true)
  })

  it('sinonim/singkatan lazim menemukan obatnya', () => {
    expect(cocokObat(obat('ctm_4'), 'chlorpheniramine')).toBe(true)
    expect(cocokObat(obat('tablet_fe'), 'tablet tambah darah')).toBe(true)
    expect(cocokObat(obat('oralit'), 'ORS')).toBe(true)
    expect(cocokObat(obat('dihidroartemisinin_piperakuin'), 'DHP')).toBe(true)
    expect(cocokObat(obat('mgso4_inj'), 'magnesium sulfat')).toBe(true)
  })

  it('kueri ngawur tetap tidak mencocokkan apa pun', () => {
    expect(cocokObat(obat('paracetamol_500'), 'xyzzy')).toBe(false)
  })
})

// DeepThink (2026-07-04): daftar lab dulu satu-satunya tanpa pencarian di
// antara 3 daftar pilihan klinik — pola cocokLab meniru cocokObat/cocokEdukasi.
describe('pencarian lab (DeepThink — konsistensi Laci/Cari)', () => {
  const lab = (id: string) => PACK.lab[id]!

  it('kueri kosong mencocokkan semua item', () => {
    expect(cocokLab(lab('darah_rutin'), '')).toBe(true)
  })

  it('kueri sebagian nama menemukan item', () => {
    expect(cocokLab(lab('darah_rutin'), 'darah rutin')).toBe(true)
    expect(cocokLab(lab('widal'), 'widal')).toBe(true)
  })

  it('kueri ngawur tidak mencocokkan apa pun', () => {
    expect(cocokLab(lab('darah_rutin'), 'xyzzy')).toBe(false)
  })
})
