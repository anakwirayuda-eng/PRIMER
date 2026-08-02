/**
 * CHECKSUM RILIS — SHA-256 untuk tiap artefak installer di dist/.
 *
 * Aplikasi ini didistribusikan TANPA tanda tangan kode (belum bersertifikat),
 * jadi checksum adalah satu-satunya cara dosen/mahasiswa memastikan berkas
 * yang mereka unduh benar-benar utuh dan tidak diubah pihak lain. Berkas
 * SHA256SUMS.txt diunggah bersama installer di GitHub Releases.
 *
 * Pemakaian: node scripts/checksum-rilis.js [versi]
 */
const { createHash } = require('node:crypto')
const { readdirSync, readFileSync, writeFileSync, statSync } = require('node:fs')
const { join } = require('node:path')

const DIST = join(__dirname, '..', 'dist')
const versi = process.argv[2] ?? require('../package.json').version

const berkas = readdirSync(DIST)
  // Harus `versi + '.exe'`, bukan `includes(versi)`: dist/ memuat beta.1 s.d.
  // beta.10 sekaligus, dan "1.1.0-beta.1" akan ikut menyeret
  // "1.1.0-beta.10.exe" — tabrakan nyata, bukan hipotetis.
  .filter((f) => f.endsWith(`${versi}.exe`))
  .sort()

if (berkas.length === 0) {
  console.error(`Tidak ada artefak .exe untuk versi ${versi} di dist/ — jalankan "npm run dist" dulu.`)
  process.exit(1)
}

const baris = []
for (const f of berkas) {
  const isi = readFileSync(join(DIST, f))
  const sha = createHash('sha256').update(isi).digest('hex')
  const mb = (statSync(join(DIST, f)).size / 1048576).toFixed(1)
  baris.push(`${sha}  ${f}`)
  console.log(`${sha}  ${f}  (${mb} MB)`)
}

const keluar = join(DIST, `SHA256SUMS-${versi}.txt`)
writeFileSync(
  keluar,
  [
    `# PRIMERA test-beta ${versi} — SHA-256`,
    '#',
    '# Verifikasi di Windows — salin-tempel ke PowerShell, JANGAN membandingkan',
    '# 64 karakter dengan mata:',
    '#',
    ...berkas.flatMap((f, i) => [
      `#   $x="${baris[i].split('  ')[0]}"`,
      `#   if ((Get-FileHash "${f}" -Algorithm SHA256).Hash -eq $x) {"COCOK"} else {"TIDAK COCOK - JANGAN DIPASANG"}`,
      '#',
    ]),
    '# Alternatif tanpa PowerShell:  certutil -hashfile "NAMA_BERKAS.exe" SHA256',
    '#',
    ...baris,
    '',
  ].join('\n'),
  'utf-8',
)
console.log(`\nDitulis: ${keluar}`)
