// Fix #1 (audit CODEX 2026-07-11): cegah Golden Master/installer ter-package
// tanpa sengaja selagi musik OST Chrono Cross/FF8 (tanpa lisensi distribusi,
// lihat src/renderer/public/bgm/CATATAN_LISENSI.txt) belum diganti. Dijalankan
// sebelum `pack`/`dist` — gagal (exit 1) bila salah satu track terlarang masih
// ada, kecuali ALLOW_UNLICENSED_BGM=1 disetel eksplisit (HANYA utk build
// internal/playtest, JANGAN dipakai utk build yang akan didistribusikan).
const fs = require('fs')
const path = require('path')

const TERLARANG = [
  'arni_home.mp3',
  'arni_another.mp3',
  'guldove_home.mp3',
  'guldove_another.mp3',
  'balamb_garden.mp3',
  'blue_fields.mp3',
  'fishermans_horizon.mp3',
]

const dir = path.join(__dirname, '../src/renderer/public/bgm')
const ada = TERLARANG.filter((f) => fs.existsSync(path.join(dir, f)))

if (ada.length > 0 && process.env.ALLOW_UNLICENSED_BGM !== '1') {
  console.error('')
  console.error('[LISENSI] Musik berhak cipta (OST Chrono Cross/Final Fantasy VIII, Square Enix)')
  console.error('masih ada di src/renderer/public/bgm/ — TIDAK boleh masuk installer yang')
  console.error('didistribusikan ke mahasiswa (lihat CATATAN_LISENSI.txt).')
  console.error('')
  console.error('File yang masih ada:', ada.join(', '))
  console.error('')
  console.error('Ganti dengan musik berlisensi dulu, ATAU jika ini sungguh build internal/')
  console.error('playtest (BUKAN untuk didistribusikan), jalankan ulang dengan:')
  console.error('  ALLOW_UNLICENSED_BGM=1 npm run pack')
  console.error('')
  process.exit(1)
}

if (ada.length > 0) {
  console.warn('[LISENSI] ALLOW_UNLICENSED_BGM=1 — melanjutkan build DENGAN musik berhak cipta.')
  console.warn('Ingat: build ini TIDAK BOLEH didistribusikan ke mahasiswa/publik.')
}
