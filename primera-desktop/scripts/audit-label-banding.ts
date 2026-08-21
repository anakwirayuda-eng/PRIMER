/**
 * AUDIT LABEL DIAGNOSIS BANDING — enumerasi penuh setiap (kasus, kode banding)
 * beserta lapisan mana yang menyelesaikan namanya dan kandidat di tiap lapisan.
 *
 * Tujuan: memberi dasar bukti untuk keputusan urutan prioritas `namaDiagnosis`
 * (renderer/screens/klinik/util.ts). Skrip ini TIDAK menilai benar/salah secara
 * klinis — ia hanya memaparkan fakta resolusi supaya perubahan urutan bisa
 * diukur dampaknya di SELURUH pack, bukan hanya pada 3 kasus yang kebetulan
 * ketahuan.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { PACK } from '../src/content/index'
import { NAMA_ICD } from '../src/content/icd10'
import { NAMA_DECK } from '../src/content/namaDeck'

type Lapisan = 'jawaban-sendiri' | 'skdi144' | 'kasus-lain' | 'kamus' | 'kode-telanjang'

interface BarisAudit {
  kasusId: string
  kasusNama: string
  kasusIcd: string
  usiaMin?: number
  usiaMax?: number
  kodeBanding: string
  labelTampil: string
  lapisan: Lapisan
  /** Kandidat yang tersedia di tiap lapisan (untuk mengukur dampak reorder). */
  kandidatSkdi?: string
  kandidatKasusLain?: string
  kandidatKasusLainId?: string
  kandidatKamus?: string
  /** Berapa kasus playable memakai kode ini (sumber tabrakan Map). */
  jumlahKasusPakaiKode: number
  /** Semua nama kasus yang memakai kode ini — memperlihatkan pemenang arbitrer. */
  semuaKasusPakaiKode: string[]
}

const kasusList = Object.values(PACK.kasus)

// Replika persis namaKasusPerIcd di util.ts: Map dari SEMUA kasus, duplikat
// kode -> yang TERAKHIR menang (perilaku Map). Direplikasi apa adanya supaya
// audit memotret keadaan nyata, bukan keadaan ideal.
const namaKasusPerIcd = new Map<string, string>(kasusList.map((k) => [k.icd10, k.nama]))
const idKasusPerIcd = new Map<string, string>(kasusList.map((k) => [k.icd10, k.id]))

const kasusPerKode = new Map<string, string[]>()
for (const k of kasusList) {
  const arr = kasusPerKode.get(k.icd10) ?? []
  arr.push(`${k.id}::${k.nama}`)
  kasusPerKode.set(k.icd10, arr)
}

/**
 * Cermin persis `namaDiagnosis` (renderer/screens/klinik/util.ts). Sejak audit
 * 2026-08-22 lapisan 'kasus-lain' DIHAPUS dari fungsi asli, jadi cermin ini pun
 * tak boleh memakainya — kalau tidak, laporan ini berbohong tentang apa yang
 * benar-benar dilihat pemain.
 */
function resolusi(icd10: string, kasus: (typeof kasusList)[number]): { label: string; lapisan: Lapisan } {
  if (icd10 === kasus.icd10)
    return { label: NAMA_DECK[kasus.id] ?? kasus.nama, lapisan: 'jawaban-sendiri' }
  const tambahan = NAMA_ICD[icd10]
  if (tambahan) return { label: tambahan, lapisan: 'kamus' }
  const entri = PACK.skdi144.find((e) => e.icd10 === icd10)
  if (entri) return { label: entri.nama, lapisan: 'skdi144' }
  return { label: `Kode ${icd10}`, lapisan: 'kode-telanjang' }
}

const baris: BarisAudit[] = []
for (const kasus of kasusList) {
  for (const kode of kasus.diagnosisBanding ?? []) {
    const { label, lapisan } = resolusi(kode, kasus)
    const entriSkdi = PACK.skdi144.find((e) => e.icd10 === kode)
    baris.push({
      kasusId: kasus.id,
      kasusNama: kasus.nama,
      kasusIcd: kasus.icd10,
      usiaMin: kasus.demografi?.usiaMin,
      usiaMax: kasus.demografi?.usiaMax,
      kodeBanding: kode,
      labelTampil: label,
      lapisan,
      kandidatSkdi: entriSkdi?.nama,
      kandidatKasusLain: namaKasusPerIcd.get(kode),
      kandidatKasusLainId: idKasusPerIcd.get(kode),
      kandidatKamus: NAMA_ICD[kode],
      jumlahKasusPakaiKode: kasusPerKode.get(kode)?.length ?? 0,
      semuaKasusPakaiKode: kasusPerKode.get(kode) ?? [],
    })
  }
}

/* -- Ringkasan yang menjawab pertanyaan keputusan ---------------------------- */

const perLapisan = baris.reduce<Record<string, number>>((acc, b) => {
  acc[b.lapisan] = (acc[b.lapisan] ?? 0) + 1
  return acc
}, {})

// REGRESI: label distraktor yang masih SAMA PERSIS dengan nama kasus playable
// lain. Sejak lapisan 'kasus-lain' dihapus, ini seharusnya hanya terjadi bila
// entri kurasi kebetulan bertuliskan sama — bukan karena meminjam identitas.
// Dipertahankan sebagai pemantau supaya kebocoran gaya-lama tak kembali diam.
const labelSamaDenganKasusLain = baris
  .filter((b) => b.lapisan !== 'jawaban-sendiri')
  .filter((b) => b.kandidatKasusLain !== undefined && b.labelTampil === b.kandidatKasusLain)
  .map((b) => ({
    kasusId: b.kasusId,
    kodeBanding: b.kodeBanding,
    label: b.labelTampil,
    samaDenganKasus: b.kandidatKasusLainId,
    lapisan: b.lapisan,
  }))

// Kode banding yang TIDAK punya sumber kurasi sama sekali (SKDI-144/kamus) —
// sejak lapisan kasus-lain dihapus, inilah yang jatuh ke "Kode X" di layar.
const tanpaSumberKurasi = baris
  .filter((b) => b.lapisan === 'kode-telanjang')
  .map((b) => ({
    kasusId: b.kasusId,
    kodeBanding: b.kodeBanding,
    labelSekarang: b.labelTampil,
  }))

// Kode yang dipakai >1 kasus: pemenang label ditentukan urutan objek (arbitrer).
const tabrakanKode = [...kasusPerKode.entries()]
  .filter(([, arr]) => arr.length > 1)
  .map(([kode, arr]) => ({ kode, pemenangSekarang: namaKasusPerIcd.get(kode), semua: arr }))

// Label identik antara jawaban benar dan salah satu distraktor -> membingungkan.
const labelKembar = baris
  .filter((b) => b.lapisan !== 'jawaban-sendiri')
  .filter((b) => {
    const kasus = kasusList.find((k) => k.id === b.kasusId)!
    return b.labelTampil.trim().toLowerCase() === kasus.nama.trim().toLowerCase()
  })
  .map((b) => ({ kasusId: b.kasusId, kodeBanding: b.kodeBanding, label: b.labelTampil }))

/* -- Format-tell: gaya jawaban benar vs gaya distraktornya -------------------- */
// Setelah label distraktor diseragamkan ke sumber kurasi, muncul risiko baru:
// bila HANYA jawaban benar yang bergaya naratif/berdemografi, gayanya sendiri
// jadi petunjuk. Deteksi ini menandai kasus yang jawaban benarnya menonjol
// sementara SEMUA distraktornya netral.
const PENANDA_DEMOGRAFI = /\b(Dewasa|Anak|Balita|Bayi|Neonatus|Lansia|Remaja|Muda|Kehamilan|Hamil)\b/i
const PENANDA_NARASI = /—|\bSuspek\b|\bDugaan\b|\bBerulang\b/i

const formatTell = kasusList
  .map((k) => {
    const distraktor = (k.diagnosisBanding ?? [])
      .filter((kode) => kode !== k.icd10)
      .map((kode) => ({
        kode,
        label:
          NAMA_ICD[kode] ?? PACK.skdi144.find((e) => e.icd10 === kode)?.nama ?? `Kode ${kode}`,
      }))
    if (distraktor.length === 0) return undefined

    const namaDeck = NAMA_DECK[k.id] ?? k.nama
    const rataDistraktor =
      distraktor.reduce((s, d) => s + d.label.length, 0) / distraktor.length
    const alasan = [
      PENANDA_DEMOGRAFI.test(namaDeck) ? 'demografi' : undefined,
      PENANDA_NARASI.test(namaDeck) ? 'narasi/kualifikasi' : undefined,
      namaDeck.length > rataDistraktor * 1.5 && namaDeck.length - rataDistraktor > 12
        ? 'jauh lebih panjang'
        : undefined,
    ].filter((x): x is string => x !== undefined)
    // Bila distraktornya pun bergaya sama, gaya itu bukan petunjuk.
    const distraktorBergaya = distraktor.some(
      (d) => PENANDA_DEMOGRAFI.test(d.label) || PENANDA_NARASI.test(d.label),
    )
    if (alasan.length === 0 || distraktorBergaya) return undefined
    return {
      kasusId: k.id,
      icd10: k.icd10,
      namaKasus: k.nama,
      namaDeck,
      memakaiNamaDeck: NAMA_DECK[k.id] !== undefined,
      alasan,
      panjangNamaDeck: namaDeck.length,
      rataPanjangDistraktor: Math.round(rataDistraktor),
      usiaMin: k.demografi?.usiaMin,
      usiaMax: k.demografi?.usiaMax,
      distraktor,
    }
  })
  .filter((x): x is NonNullable<typeof x> => x !== undefined)
  .sort((a, b) => b.panjangNamaDeck - a.panjangNamaDeck)

const hasil = {
  ringkasan: {
    totalKasus: kasusList.length,
    totalPasanganBanding: baris.length,
    perLapisan,
    jumlahKodeTabrakan: tabrakanKode.length,
    jumlahLabelSamaDenganKasusLain: labelSamaDenganKasusLain.length,
    jumlahTanpaSumberKurasi: tanpaSumberKurasi.length,
    jumlahLabelKembar: labelKembar.length,
    jumlahFormatTell: formatTell.length,
  },
  formatTell,
  labelSamaDenganKasusLain,
  tanpaSumberKurasi,
  tabrakanKode,
  labelKembar,
  baris,
}

const keluar = resolve(process.cwd(), process.argv[2] ?? 'audit-label-banding.json')
mkdirSync(dirname(keluar), { recursive: true })
writeFileSync(keluar, JSON.stringify(hasil, null, 2), 'utf-8')

console.info(`Audit label banding -> ${keluar}`)
console.info(`  ${baris.length} pasangan (kasus x kode banding) dari ${kasusList.length} kasus`)
console.info(`  per lapisan: ${JSON.stringify(perLapisan)}`)
console.info(`  kode dipakai >1 kasus playable: ${tabrakanKode.length}`)
console.info(`  label distraktor identik dgn nama kasus lain: ${labelSamaDenganKasusLain.length}`)
console.info(`  kode banding tanpa sumber kurasi (jatuh ke "Kode X"): ${tanpaSumberKurasi.length}`)
console.info(`  label kembar dgn jawaban benar: ${labelKembar.length}`)
console.info(`  format-tell (hanya jawaban benar yg bergaya): ${formatTell.length}`)
