/**
 * STORYLET DEBRIEF MALAM (M11 #2 A2, 2026-07-17) — kejadian naratif kecil
 * satu-tayang di renderer. Storylet kausal hanya masuk pool setelah mekanik
 * terkait sungguh terjadi; atmosfer tidak boleh memalsukan closed-loop.
 */
import { Rng } from '@engine/core/rng'

export interface KonteksStorylet {
  punyaBinaan?: boolean
  pernahRujuk?: boolean
  pernahPosyandu?: boolean
  pernahProlanis?: boolean
}

const STORYLET_UMUM: readonly string[] = [
  '📻 Bu Aminah kirim pesan lewat kader lain: catatan KB RW 1 bulan ini "insyaAllah lengkap", tapi dia masih sungkan menelepon langsung.',
  '📻 Pak Slamet mampir sebentar ke meja depan, cerita hansip RW 2 baru saja menegur remaja yang merokok di pos ronda — "biar ketauan usahanya, Dok."',
  '📻 Bu Komang Sri titip salam lewat kader lain, katanya lansia di Banjar Taman Sari kangen ditanya kabar tensinya.',
  '📻 Pak Darman melapor santai: warungnya jadi tempat nongkrong ibu-ibu tiap sore, jadi dia sering "dengar-dengar" duluan sebelum sempat dicatat resmi.',
  '📻 Bu Ketut Ayu mencatat ada keluarga baru pindah ke wilayahnya. Mereka belum masuk roster bernama hari ini; pendataan awal dijadwalkan kader.',
  '📻 Kabar dari balai desa: jalan menuju RW yang biasa banjir kalau hujan deras sudah mulai diperbaiki, katanya sebelum musim hujan tiba.',
]

const STORYLET_BERSYARAT: readonly {
  teks: string
  boleh: (konteks: KonteksStorylet) => boolean
}[] = [
  {
    teks: '📻 Berkas rujukan yang kamu kirim masuk daftar tindak lanjut. Kabar balik hasil pelayanan belum diterima; loop ini belum boleh dianggap selesai.',
    boleh: (konteks) => konteks.pernahRujuk === true,
  },
  {
    teks: '📻 Pak Gede numpang cerita: jalan ke rumah salah satu keluarga binaan becek parah musim ini, katanya perlu diusulkan ke Lokmin.',
    boleh: (konteks) => konteks.punyaBinaan === true,
  },
  {
    teks: '📻 Bu Endang minta maaf lewat catatan kecil — laporan posyandu bulan ini telat sehari karena cucunya sakit.',
    boleh: (konteks) => konteks.pernahPosyandu === true,
  },
  {
    teks: '📻 Selentingan di ruang tunggu: kader sedang menyiapkan sesi Posyandu berikutnya dengan sasaran lintas siklus hidup.',
    boleh: (konteks) => konteks.pernahPosyandu === true,
  },
  {
    teks: '📻 Ibu-ibu arisan bercanda soal jadwal Prolanis yang katanya "lebih tepat waktu daripada jadwal kondangan" — reputasi kecil yang lumayan menyenangkan didengar.',
    boleh: (konteks) => konteks.pernahProlanis === true,
  },
]

export const STORYLET_POOL: readonly string[] = [
  ...STORYLET_UMUM,
  ...STORYLET_BERSYARAT.map((storylet) => storylet.teks),
]

/** Kandidat aktual; diekspor agar kontrak anti-kabar-palsu dapat diuji langsung. */
export function kandidatStorylet(konteks: KonteksStorylet = {}): readonly string[] {
  return [
    ...STORYLET_UMUM,
    ...STORYLET_BERSYARAT.filter((storylet) => storylet.boleh(konteks)).map((storylet) => storylet.teks),
  ]
}

/** Satu storylet per hari, deterministik dari seed pemain — non-REVISI. */
export function storyletHariIni(
  seed: number,
  hari: number,
  konteks: KonteksStorylet = {},
): string {
  return new Rng(seed, 'storylet', hari).pick(kandidatStorylet(konteks))
}