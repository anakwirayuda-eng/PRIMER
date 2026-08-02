/**
 * GERBANG LISENSI AUDIO — pengaman struktural, bukan sekadar kebiasaan baik.
 *
 * Proyek ini pernah kehilangan seluruh musiknya karena 7 track OST berhak
 * cipta terlanjur masuk installer. Skrip ini membuat kejadian itu MUSTAHIL
 * terulang diam-diam: build gagal bila ada berkas audio di public/bgm/ yang
 * tidak punya entri kredit, atau berlisensi di luar daftar putih
 * docs/KEBIJAKAN_ASET_AUDIO.md.
 *
 * Dijalankan otomatis sebelum `npm run dist`.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR_BGM = join(AKAR, 'src', 'renderer', 'public', 'bgm')
const KREDIT = join(AKAR, 'src', 'renderer', 'src', 'audio', 'bgmKredit.ts')

const LISENSI_DIIZINKAN = ['CC BY 4.0', 'CC BY 3.0', 'CC0 1.0', 'Artistic-2.0', 'MIT', 'OGA-BY 3.0']
const EKSTENSI_AUDIO = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.flac', '.opus'])

const masalah = []

const berkasAudio = existsSync(DIR_BGM)
  ? readdirSync(DIR_BGM).filter((f) => EKSTENSI_AUDIO.has(extname(f).toLowerCase()))
  : []

const sumberKredit = existsSync(KREDIT) ? readFileSync(KREDIT, 'utf-8') : ''

// Ambil tiap entri kredit sebagai blok, supaya berkas & lisensinya berpasangan
// (mencocokkan berkas dan lisensi secara terpisah bisa lolos silang).
const entri = [...sumberKredit.matchAll(/berkas:\s*'([^']+)'([\s\S]*?)(?=berkas:\s*'|\]\s*$)/g)].map(
  (m) => ({ berkas: m[1], blok: m[2] }),
)
const terdaftar = new Map(entri.map((e) => [e.berkas, e.blok]))

for (const f of berkasAudio) {
  if (!terdaftar.has(f)) {
    masalah.push(`Berkas audio "${f}" TIDAK punya entri di bgmKredit.ts — atribusi & lisensinya tak terlacak.`)
    continue
  }
  const blok = terdaftar.get(f)
  const lisensi = blok.match(/lisensi:\s*'([^']+)'/)?.[1]
  if (!lisensi) {
    masalah.push(`Entri "${f}" tidak menyebut lisensi.`)
  } else if (!LISENSI_DIIZINKAN.includes(lisensi)) {
    masalah.push(`Entri "${f}" berlisensi "${lisensi}" — DI LUAR daftar putih (${LISENSI_DIIZINKAN.join(', ')}).`)
  }
  if (!/urlSumber:\s*'https:\/\//.test(blok)) {
    masalah.push(`Entri "${f}" tidak punya urlSumber HTTPS — bukti provenance wajib ada.`)
  }
  if (!/pencipta:\s*'[^']+'/.test(blok)) {
    masalah.push(`Entri "${f}" tidak menyebut pencipta.`)
  }
}

// Kredit yang menunjuk berkas tak ada = musik akan gagal dimuat saat dijalankan.
for (const e of entri) {
  if (!berkasAudio.includes(e.berkas)) {
    masalah.push(`Kredit menyebut "${e.berkas}" tetapi berkasnya tidak ada di public/bgm/.`)
  }
}

if (masalah.length > 0) {
  console.error('')
  console.error('[LISENSI AUDIO] Build dihentikan — lihat docs/KEBIJAKAN_ASET_AUDIO.md')
  console.error('')
  for (const m of masalah) console.error('  • ' + m)
  console.error('')
  process.exit(1)
}

console.log(
  berkasAudio.length === 0
    ? 'Audit lisensi audio: belum ada berkas musik (musik latar nonaktif) — OK.'
    : `Audit lisensi audio: ${berkasAudio.length} berkas, semua berlisensi & berkredit — OK.`,
)
