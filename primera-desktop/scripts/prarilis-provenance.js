/**
 * GERBANG PRA-RILIS — memastikan installer dapat dibuktikan asalnya.
 *
 * Latar (audit CODEX 2026-08-03): installer beta.13 dibangun dari working tree
 * yang kenaikan versinya BELUM di-commit, dan tag rilisnya menunjuk commit lain
 * sama sekali. Akibatnya tak seorang pun — termasuk dosen yang memverifikasi
 * dossier mahasiswa — dapat membuktikan biner itu berasal dari sumber mana.
 *
 * Disiplin "satu versi = satu binary" hanya bermakna bila tiap binary dapat
 * dilacak ke SATU commit. Gerbang ini menolak build yang tidak memenuhinya.
 *
 * Lewati hanya untuk uji coba lokal yang TIDAK dibagikan:
 *   IZINKAN_RILIS_KOTOR=1 npm run dist
 */
const { execSync } = require('node:child_process')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')

const MERAH = '\x1b[31m'
const KUNING = '\x1b[33m'
const HIJAU = '\x1b[32m'
const RESET = '\x1b[0m'

const AKAR = join(__dirname, '..')

function git(perintah) {
  try {
    return execSync(`git ${perintah}`, {
      cwd: AKAR,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

function bacaJson(nama) {
  return JSON.parse(readFileSync(join(AKAR, nama), 'utf-8'))
}

const masalah = []
const catatan = []

const versi = bacaJson('package.json').version
const lock = bacaJson('package-lock.json')

// 1. package.json vs package-lock.json harus satu suara.
if (lock.version !== versi || lock.packages?.['']?.version !== versi) {
  masalah.push(
    `package-lock.json menyebut versi "${lock.version}" sedangkan package.json "${versi}". ` +
      `Samakan dulu — sunting field "version" di kedua tempat dalam lockfile.`,
  )
}

const kotor = git('status --porcelain')

if (kotor === null) {
  catatan.push('Bukan repositori git — pemeriksaan asal-usul dilewati.')
} else {
  // 2. Working tree harus bersih: kalau tidak, sumber biner ini tidak ada di
  //    riwayat mana pun dan tak akan pernah bisa direproduksi.
  if (kotor.length > 0) {
    const baris = kotor.split('\n')
    masalah.push(
      `Working tree belum bersih — installer akan memuat perubahan yang tidak ada di commit mana pun:\n    ` +
        baris.slice(0, 8).join('\n    ') +
        (baris.length > 8 ? `\n    … dan ${baris.length - 8} berkas lain` : ''),
    )
  }

  // 3. Versi ini belum pernah dirilis dari commit LAIN.
  const head = git('rev-parse HEAD')
  const daftarTag = git(`tag --list "*${versi}"`)
  if (head && daftarTag) {
    for (const t of daftarTag.split('\n').filter(Boolean)) {
      const commitTag = git(`rev-parse "${t}^{commit}"`)
      if (commitTag && commitTag !== head) {
        masalah.push(
          `Tag "${t}" sudah ada dan menunjuk commit ${commitTag.slice(0, 7)}, bukan HEAD ${head.slice(0, 7)}. ` +
            `Versi ${versi} sudah pernah dirilis dari sumber lain — naikkan nomor versinya.`,
        )
      }
    }
  }

  if (head) {
    const pendek = head.slice(0, 7)
    catatan.push(`Sumber rilis: commit ${pendek} pada ${git('rev-parse --abbrev-ref HEAD')}`)
    catatan.push(
      `Sesudah build, buat tag TEPAT di commit ini sebelum merilis:\n` +
        `      git tag -a test-beta-${pendek} ${pendek} -m "PRIMERA ${versi}"\n` +
        `      git push origin test-beta-${pendek}\n` +
        `    Jangan biarkan GitHub membuat tag sendiri — tag baru akan menempel\n` +
        `    di branch default, bukan di commit ini.`,
    )
  }
}

if (masalah.length > 0) {
  const dipaksa = process.env.IZINKAN_RILIS_KOTOR === '1'
  const kepala = dipaksa
    ? `${KUNING}⚠ Gerbang asal-usul dilewati paksa (IZINKAN_RILIS_KOTOR=1)${RESET}`
    : `${MERAH}✗ Gerbang asal-usul rilis MENOLAK build ini${RESET}`
  const tulis = dipaksa ? console.warn : console.error
  tulis(`\n${kepala}\n`)
  for (const m of masalah) tulis(`  ${dipaksa ? KUNING : MERAH}•${RESET} ${m}\n`)
  if (dipaksa) {
    console.warn(
      `${KUNING}Biner hasil build ini TIDAK BOLEH dibagikan${RESET} — asalnya tak dapat dibuktikan.\n`,
    )
  } else {
    console.error(
      `${KUNING}Kenapa dijaga:${RESET} dosen memverifikasi dossier mahasiswa berdasarkan versi.\n` +
        `Biner yang tak dapat dilacak ke satu commit membuat verifikasi itu tak berdasar.\n` +
        `Untuk uji lokal yang tidak dibagikan: IZINKAN_RILIS_KOTOR=1 npm run dist\n`,
    )
    process.exit(1)
  }
} else {
  console.log(`${HIJAU}✓ Asal-usul rilis siap${RESET} — versi ${versi}`)
}

for (const c of catatan) console.log(`  ${c}`)
