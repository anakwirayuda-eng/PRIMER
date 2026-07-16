/**
 * STORYLET DEBRIEF MALAM (M11 #2 A2, 2026-07-17) — kejadian naratif kecil
 * satu-tayang, murni atmosfer. Dipilih deterministik dari `Rng(seed,
 * 'storylet', hari)` di RENDERER SAJA — tidak menyentuh state/reducer/
 * save sama sekali, jadi non-REVISI (padanan class `clue`/`mutiaraEbm`:
 * display-only). Isi merujuk NPC/RS/RW yang sudah ada di dunia game
 * (kader.ts, rumahSakit.ts) supaya terasa terhubung, bukan generik.
 */
import { Rng } from '@engine/core/rng'

export const STORYLET_POOL: readonly string[] = [
  '📻 Bu Aminah kirim pesan lewat kader lain: catatan KB RW 1 bulan ini "insyaAllah lengkap", tapi dia masih sungkan menelepon langsung.',
  '📻 Pak Slamet mampir sebentar ke meja depan, cerita hansip RW 2 baru saja menegur remaja yang merokok di pos ronda — "biar ketauan usahanya, Dok."',
  '📻 Surat balasan dari RSUD Pratama Sukamaju datang lewat kurir: pasien rujukan minggu lalu sudah pulang, kondisinya membaik.',
  '📻 Bu Komang Sri titip salam lewat kader lain, katanya lansia binaannya di Banjar Taman Sari kangen ditanya kabar tensinya.',
  '📻 Pak Gede numpang cerita: jalan ke rumah salah satu keluarga binaan becek parah musim ini, katanya perlu diusulkan ke Lokmin.',
  '📻 Bu Endang minta maaf lewat catatan kecil — laporan posyandu bulan ini telat sehari karena cucunya sakit.',
  '📻 Selentingan di ruang tunggu: katanya jadwal posyandu bulan depan mau digabung dengan lansia, biar sekali jalan.',
  '📻 Pak Darman melapor santai: warungnya jadi tempat nongkrong ibu-ibu tiap sore, jadi dia sering "dengar-dengar" duluan sebelum sempat dicatat resmi.',
  '📻 Bu Ketut Ayu titip pesan: ada keluarga baru pindah ke wilayahnya, belum sempat didata, mungkin perlu kunjungan perkenalan.',
  '📻 Surat dari RS Kasih Bunda: mereka menawarkan jadwal konsul gizi keliling bulan depan, tinggal menunggu jadwal Puskesmas.',
  '📻 Kabar dari balai desa: jalan menuju RW yang biasa banjir kalau hujan deras sudah mulai diperbaiki, katanya sebelum musim hujan tiba.',
  '📻 Ibu-ibu arisan bercanda soal jadwal Prolanis yang katanya "lebih tepat waktu daripada jadwal kondangan" — reputasi kecil yang lumayan menyenangkan didengar.',
]

/** Satu storylet per hari, deterministik dari seed pemain — non-REVISI. */
export function storyletHariIni(seed: number, hari: number): string {
  return new Rng(seed, 'storylet', hari).pick(STORYLET_POOL)
}
