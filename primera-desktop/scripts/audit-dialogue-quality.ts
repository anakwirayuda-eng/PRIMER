import { PACK } from '../src/content/index'

function jumlahKata(teks: string): number {
  return teks.match(/[\p{L}\p{N}][\p{L}\p{N}'’/-]*/gu)?.length ?? 0
}

const pilihan = Object.values(PACK.keluarga)
  .flatMap((keluarga) => keluarga.arc.kunjungan)
  .flatMap((kunjungan) => kunjungan.dialog)
  .flatMap((node) => node.pilihan)

const tepat = pilihan.filter((item) => item.tepat)
const keliru = pilihan.filter((item) => !item.tepat)
const rerata = (items: typeof pilihan) =>
  items.reduce((total, item) => total + jumlahKata(item.teks), 0) / Math.max(items.length, 1)

const perGaya = Object.fromEntries(
  [...new Set(pilihan.map((item) => item.gaya))].map((gaya) => [
    gaya,
    {
      tepat: tepat.filter((item) => item.gaya === gaya).length,
      keliru: keliru.filter((item) => item.gaya === gaya).length,
    },
  ]),
)

const kasus = Object.values(PACK.kasus)
const anakKecilTanpaPendamping = kasus
  .filter((item) => item.demografi.usiaMax < 8 && item.keluhanUtamaOlehPendamping !== true)
  .map((item) => ({ id: item.id, usia: [item.demografi.usiaMin, item.demografi.usiaMax] }))
const rentangAnakDewasa = kasus
  .filter((item) => item.demografi.usiaMin < 15 && item.demografi.usiaMax >= 18)
  .map((item) => ({ id: item.id, usia: [item.demografi.usiaMin, item.demografi.usiaMax] }))
const konteksDewasaPadaRentangAnak = kasus
  .filter((item) => item.demografi.usiaMin < 15 && item.demografi.usiaMax >= 18)
  .flatMap((item) => [
    { id: item.id, field: 'keluhanUtama', teks: item.keluhanUtama },
    ...item.anamnesis.map((q) => ({ id: item.id, field: q.id, teks: q.jawab })),
  ])
  .filter((item) => /\b(suami|istri|anak saya|tempat kerja|saya bekerja|teman kos|kuliah|menikah|cucu|pensiun)\b/iu.test(item.teks))
const pertanyaanMiripPemeriksaan = kasus.flatMap((item) => item.anamnesis
  .filter((q) => /\b(coba|saya periksa|boleh saya lihat|angkat alis|julingkan|julurkan|saya raba|saya tekan)\b/iu.test(q.tanya))
  .map((q) => ({ kasusId: item.id, pertanyaanId: q.id, tanya: q.tanya })))
const jawabanBersuaraRekamMedis = kasus.flatMap((item) => item.anamnesis
  .filter((q) => /^(resume|catatan|hasil pemeriksaan|pemeriksaan|diagnosis|pasien)\b/iu.test(q.jawab.trim()))
  .map((q) => ({ kasusId: item.id, pertanyaanId: q.id, jawab: q.jawab })))
const jawabanPendekUntukPertanyaanMajemuk = kasus.flatMap((item) => item.anamnesis
  .filter((q) => (q.tanya.match(/\b(dan|atau)\b/giu)?.length ?? 0) >= 2 && jumlahKata(q.jawab) <= 6)
  .map((q) => ({ kasusId: item.id, pertanyaanId: q.id, tanya: q.tanya, jawab: q.jawab })))

console.log(JSON.stringify({
  jumlah: { semua: pilihan.length, tepat: tepat.length, keliru: keliru.length },
  rerataKata: { tepat: rerata(tepat), keliru: rerata(keliru) },
  perGaya,
  pembicara: {
    anakKecilTanpaPendamping,
    rentangAnakDewasa,
    konteksDewasaPadaRentangAnak,
    pertanyaanPendamping: kasus.reduce(
      (total, item) => total + item.anamnesis.filter((q) => q.olehPendamping === true).length,
      0,
    ),
    pertanyaanMiripPemeriksaan,
    jawabanBersuaraRekamMedis,
    jawabanPendekUntukPertanyaanMajemuk,
  },
  pilihanTepatPanjang: tepat
    .filter((item) => jumlahKata(item.teks) >= 35)
    .map((item) => ({ id: item.id, gaya: item.gaya, kata: jumlahKata(item.teks), teks: item.teks })),
}, null, 2))
