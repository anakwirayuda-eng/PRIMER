import { app, BrowserWindow, ipcMain, nativeTheme, shell, Menu } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { promises as fs } from 'fs'

// Build produksi: kunci DevTools & pintasannya. Integritas asesmen (CODEX P1):
// tanpa konsol, mahasiswa tak bisa mem-bypass UI (dispatch aksi lompat-fase)
// atau mengutak-atik state sebelum ekspor dossier. Dibuka hanya bila
// PRIMER_DEV=1 (untuk pengembang), TIDAK di build kelas.
// Fix #2 (audit CODEX 2026-07-11): ELECTRON_RENDERER_URL HANYA relevan di
// build TAK-dipaket (app.isPackaged===false, dev-server vite) — dulu env var
// polos ini saja bisa membuka DevTools bahkan di installer kelas yang sudah
// dipaket (siapa saja yang set env var itu sebelum menjalankan .exe). PRIMER_DEV
// PRIMER_DEV juga hanya sah pada build tak-dipaket; environment variable pada
// installer kelas tidak boleh menjadi pintu belakang DevTools.
const DEV = !app.isPackaged && (
  !!process.env['ELECTRON_RENDERER_URL'] || process.env['PRIMER_DEV'] === '1'
)

// ---------------------------------------------------------------------------
// PRIMERA: Puskesmas Pagi — Electron main process
// Bertanggung jawab atas: jendela game, save/load ke disk (userData/saves).
// Semua logika game hidup di renderer/engine — main process sengaja tipis.
// ---------------------------------------------------------------------------

const SAVE_DIR = () => join(app.getPath('userData'), 'saves')
const RUNTIME_CRASH_LOG = () => join(app.getPath('userData'), 'runtime-crashes.jsonl')

interface RuntimeRecoveryNotice {
  occurredAt: string
  reason: string
  exitCode: number
}

let pemulihanRendererTertunda: RuntimeRecoveryNotice | null = null

function sanitizeSlot(slot: string): string {
  // Slot menjadi nama file; tolak apa pun selain [a-z0-9_-]
  if (!/^[a-z0-9_-]{1,64}$/i.test(slot)) throw new Error(`Slot tidak valid: ${slot}`)
  return slot
}

async function ensureSaveDir(): Promise<string> {
  const dir = SAVE_DIR()
  await fs.mkdir(dir, { recursive: true })
  return dir
}

// M10 Batch-2 (CODEX P1.2, dossier §53): renderer memanggil save:write
// fire-and-forget — dua autosave beruntun (mis. ENCOUNTER_SELESAI lalu
// BLOK_BERGANTI) dulu berlomba pada SATU `${file}.tmp`: writeFile saling
// klobber + rename kedua bisa ENOENT + snapshot LAMA bisa menang (tulis
// pertama rename TERAKHIR). Fix dua lapis: (a) antrean promise PER-SLOT —
// tulisan slot yang sama dieksekusi berurutan (ordering terjamin, tulisan
// terakhir = pemenang); (b) nama tmp unik ber-counter — kalaupun ada jalur
// konkuren lain di masa depan, tmp tak pernah dishare.
const antreanTulis = new Map<string, Promise<void>>()
let tmpCounter = 0
// Fix #31d: rantai promise telemetri, ditunggu before-quit spt antreanTulis di atas.
let telemetriPending: Promise<void> = Promise.resolve()
// Fix #1 (audit CODEX 2026-07-11, regresi dari fix #31d): dulu ada guard
// `if (tertunda.length===0) return` yg membuat panggilan before-quit KEDUA
// (dipicu app.quit() di bawah, setelah antreanTulis.clear()) lolos tanpa
// preventDefault. Guard itu terhapus tanpa sengaja saat telemetriPending
// ditambahkan ke array tertunda — dan krn telemetriPending tak pernah
// kosong/null, array itu kini TAK PERNAH panjang 0, jadi guard lama pun
// sudah tak relevan lagi walau dikembalikan mentah. Tanpa guard sama sekali:
// before-quit -> preventDefault -> app.quit() -> before-quit -> preventDefault
// -> ... siklus tanpa henti, app TAK PERNAH benar-benar keluar.
let sedangKeluar = false

function registerIpc(): void {
  ipcMain.handle('save:write', async (_e, slot: string, json: string) => {
    const kunci = sanitizeSlot(slot)
    const kerja = async (): Promise<void> => {
      const dir = await ensureSaveDir()
      const file = join(dir, `${kunci}.json`)
      const tmp = `${file}.${++tmpCounter}.tmp`
      // Tulis atomik: tmp dulu, lalu rename — save korup = progres mahasiswa hilang.
      await fs.writeFile(tmp, json, 'utf-8')
      await fs.rename(tmp, file)
    }
    // Rantai di belakang tulisan slot yang sama; error tulisan sebelumnya
    // TIDAK boleh memblokir antrean (catch → lanjut).
    const sebelumnya = antreanTulis.get(kunci) ?? Promise.resolve()
    const giliran = sebelumnya.catch(() => {}).then(kerja)
    antreanTulis.set(kunci, giliran)
    await giliran
    return true
  })

  ipcMain.handle('save:read', async (_e, slot: string) => {
    const kunci = sanitizeSlot(slot)
    // CODEX M14 #3: tunggu tulisan slot yang SAMA yang masih berjalan sebelum
    // membaca. Tanpa ini, bila renderer reload/crash saat autosave belum selesai
    // rename dari .tmp, read bisa dapat snapshot LAMA — pemain lanjut dari state
    // basi lalu autosave berikutnya menimpa snapshot yang sebenarnya lebih baru.
    // (antreanTulis = state modul in-process; bertahan lintas win.reload().)
    await (antreanTulis.get(kunci) ?? Promise.resolve()).catch(() => {})
    const dir = await ensureSaveDir()
    try {
      return await fs.readFile(join(dir, `${kunci}.json`), 'utf-8')
    } catch (e) {
      // CODEX audit UI/UX 2026-07-10 (#2): dulu SEMUA error (ENOENT/EACCES/
      // disk rusak) disamakan jadi null — pemanggil memperlakukan null sbg
      // "save memang tak ada", bukan "gagal baca", sehingga game diam-diam
      // berjalan seolah save baru padahal sebenarnya save ADA tapi gagal
      // dibaca. Hanya file-tak-ada (ENOENT) yang sah dianggap null; error
      // lain dilempar agar pemanggil (store.ts) bisa membedakan & melapor.
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw e
    }
  })

  ipcMain.handle('save:list', async () => {
    const dir = await ensureSaveDir()
    const files = await fs.readdir(dir)
    const slots: { slot: string; mtimeMs: number; size: number }[] = []
    for (const f of files) {
      if (!f.endsWith('.json')) continue
      const st = await fs.stat(join(dir, f))
      slots.push({ slot: f.replace(/\.json$/, ''), mtimeMs: st.mtimeMs, size: st.size })
    }
    return slots.sort((a, b) => b.mtimeMs - a.mtimeMs)
  })

  ipcMain.handle('save:delete', async (_e, slot: string) => {
    const dir = await ensureSaveDir()
    await fs.rm(join(dir, `${sanitizeSlot(slot)}.json`), { force: true })
    return true
  })

  // Telemetri wall-clock (DeepThink ronde-2, keputusan user — docs/TELEMETRI_WALLCLOCK.md):
  // log append-only TERPISAH dari save slot manapun — memuat ulang backup save
  // save-scum tidak memutar-balik log ini, jadi jadi jejak forensik independen
  // utk dosen. SATU-SATUNYA tempat Date.now() boleh menyentuh persistensi game.
  const TELEMETRI_FILE = () => join(app.getPath('userData'), 'telemetri.jsonl')

  // Fix #31d (audit CODEX 2026-07-11): dulu appendFile lepas-tangan (fire-and-
  // forget) — beda dgn save:write yang masuk antreanTulis & ditunggu before-quit.
  // Menutup app tepat saat baris terakhir belum selesai ditulis bisa membuang
  // entri forensik. Sekarang dirantai + ditunggu before-quit sama spt save.
  ipcMain.handle('telemetri:append', async (_e, baris: string) => {
    const tulis = async (): Promise<void> => {
      await fs.appendFile(TELEMETRI_FILE(), baris.replace(/\n/g, ' ') + '\n', 'utf-8')
    }
    const giliran = telemetriPending.catch(() => {}).then(tulis)
    telemetriPending = giliran
    await giliran
    return true
  })

  ipcMain.handle('telemetri:read', async () => {
    try {
      const isi = await fs.readFile(TELEMETRI_FILE(), 'utf-8')
      return isi.split('\n').filter((b) => b.trim().length > 0)
    } catch {
      return []
    }
  })

  ipcMain.handle('app:version', () => app.getVersion())
  ipcMain.handle('runtime:consume-recovery', () => {
    const notice = pemulihanRendererTertunda
    pemulihanRendererTertunda = null
    return notice
  })
  ipcMain.handle('runtime:crash-log', async () => {
    try {
      const isi = await fs.readFile(RUNTIME_CRASH_LOG(), 'utf-8')
      return isi.split('\n').filter(Boolean).slice(-50)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw error
    }
  })
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 760,
    show: false,
    title: 'PRIMERA test-beta',
    // Audit CODEX UX 2026-07-16 (P2 bright-start): pengguna sensitif cahaya
    // dgn OS gelap dulu kena kilatan krem sebelum renderer termuat — warna
    // pra-render kini ikut preferensi OS (malam-800 vs kertas-100).
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#14201c' : '#FAF6EF',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Fix #2d (audit CODEX 2026-07-11): preload hanya pakai contextBridge+
      // ipcRenderer.invoke (lihat preload/index.ts) — sepenuhnya kompatibel
      // sandbox, tak ada alasan mempertahankan sandbox:false.
      sandbox: true,
    },
  })

  win.on('ready-to-show', () => win.show())

  // Self-heal renderer yang MATI LEVEL-PROSES (OOM/GPU/crash native) — beda dari
  // exception JS yang sudah ditangkap dispatch/ErrorBoundary. Di mesin lab tua tanpa
  // pengawas, jendela putih permanen = stasiun mati; muat ulang otomatis memulihkan
  // dari autosave. Guard 4 detik mencegah loop reload bila crash langsung berulang.
  let terakhirReload = 0
  win.webContents.on('render-process-gone', (_e, details) => {
    console.error('[render-process-gone]', details.reason, details.exitCode)
    if (details.reason === 'clean-exit' || win.isDestroyed()) return
    const sekarang = Date.now()
    const notice: RuntimeRecoveryNotice = {
      occurredAt: new Date(sekarang).toISOString(),
      reason: details.reason,
      exitCode: details.exitCode,
    }
    pemulihanRendererTertunda = notice
    void fs.appendFile(
      RUNTIME_CRASH_LOG(),
      JSON.stringify({ ...notice, appVersion: app.getVersion() }) + '\n',
      'utf-8',
    ).catch((error) => console.error('[runtime-crash-log]', error))
    if (sekarang - terakhirReload < 4000) {
      console.error('[render-process-gone] crash beruntun — tidak auto-reload lagi (hindari loop)')
      // CODEX M14 #12: jangan tinggalkan jendela putih/mati diam. Tampilkan
      // pesan pemulihan sederhana (progres tersimpan di autosave, aman) agar
      // pemain tahu harus menutup & membuka ulang, bukan mengira game hang.
      const pesan = `<!doctype html><html lang="id"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#FAF6EF;color:#26312c;font-family:system-ui,Segoe UI,sans-serif;text-align:center">
<div style="max-width:34rem;padding:2rem">
<h1 style="font-size:1.4rem;margin:0 0 .75rem">Permainan perlu dimuat ulang</h1>
<p style="line-height:1.6;color:#4c5a68">Terjadi gangguan teknis yang berulang. <b>Progresmu aman tersimpan otomatis.</b> Tutup jendela ini lalu buka kembali PRIMERA untuk melanjutkan dari penyimpanan terakhir.</p>
</div></body></html>`
      if (!win.isDestroyed()) win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(pesan))
      return
    }
    terakhirReload = sekarang
    if (!win.isDestroyed()) win.reload()
  })

  // Kunci DevTools di produksi (CODEX P1): blokir pintasan F12/Ctrl+Shift+I/J/C
  // dan tolak permintaan buka DevTools. Di DEV, biarkan agar bisa debug.
  if (!DEV) {
    win.webContents.on('before-input-event', (e, input) => {
      const k = input.key?.toLowerCase()
      const buka =
        k === 'f12' ||
        ((input.control || input.meta) && input.shift && (k === 'i' || k === 'j' || k === 'c')) ||
        ((input.control || input.meta) && k === 'r' && input.shift) // hard reload
      if (buka) e.preventDefault()
    })
    win.webContents.on('devtools-opened', () => win.webContents.closeDevTools())
  }

  // Mode verifikasi: PRIMER_SHOT=<path.png> → potret jendela lalu keluar.
  const shotPath = process.env['PRIMER_SHOT']
  if (shotPath) {
    win.webContents.once('did-finish-load', () => {
      setTimeout(async () => {
        try {
          const img = await win.webContents.capturePage()
          await fs.writeFile(shotPath, img.toPNG())
          console.log(`[PRIMER_SHOT] tersimpan: ${shotPath}`)
        } catch (e) {
          console.error('[PRIMER_SHOT] gagal:', e)
        } finally {
          app.quit()
        }
      }, 4500)
    })
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    // Link eksternal (mis. referensi guideline) dibuka di browser OS, bukan in-app
    if (url.startsWith('https://')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Fix #2e (audit CODEX 2026-07-11): tanpa guard ini, renderer bisa dialihkan
  // (mis. via bug/link tak terduga) ke URL luar mana pun sambil tetap membawa
  // preload bridge (save/telemetri) yang sama — situs asing lalu punya akses
  // baca/tulis/hapus save. Hanya izinkan file lokal (produksi) atau dev-server
  // vite yang memang dipakai sesi ini (dev, tak-dipaket).
  // Fix #17 (audit CODEX 2026-07-11): `url.startsWith('file://')` mengizinkan
  // navigasi ke file LOKAL MANA PUN (mis. `file:///etc/passwd`, atau `file://`
  // apa pun di disk pengguna) selama skema-nya cocok — preload bridge yang
  // sama tetap terpasang di sana. Persempit ke exact-match thd satu-satunya
  // berkas renderer yang sah dimuat (sama dgn yang dipakai `win.loadFile` di
  // bawah), bukan sekadar skema URL-nya.
  const rendererUrl = pathToFileURL(join(__dirname, '../renderer/index.html')).href
  win.webContents.on('will-navigate', (e, url) => {
    const devUrl = !app.isPackaged ? process.env['ELECTRON_RENDERER_URL'] : undefined
    const sah = devUrl ? url.startsWith(devUrl) : url === rendererUrl
    if (!sah) e.preventDefault()
  })

  // Fix #2f (audit CODEX 2026-07-11): tolak semua permintaan izin browser
  // (kamera/mikrofon/lokasi/notifikasi/dst) — game ini tak pernah butuh satu
  // pun, jadi permintaan semacam itu hanya bisa datang dari konten tak terduga.
  win.webContents.session.setPermissionRequestHandler((_wc, _permission, callback) => callback(false))

  // Fix #2a (audit CODEX 2026-07-11): ELECTRON_RENDERER_URL HANYA dihormati
  // pada build tak-dipaket (dev, dijalankan via `electron-vite dev`) — build
  // produksi/installer SELALU load file lokal, apa pun isi env var ini.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// CODEX M14 #2: single-instance lock. Dua instance app (mis. ikon di-double-
// click dua kali di lab, atau autoupdate relaunch) berbagi disk save yang sama
// TAPI `antreanTulis`/`tmpCounter` bersifat per-proses — dua proses bisa menulis
// `${slot}.json.1.tmp` yang sama lalu rename saling menimpa tanpa urutan
// terjamin, merusak autosave/slot/meta. Lock: instance kedua langsung keluar;
// instance pertama difokuskan agar pemain tahu game sudah berjalan.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    // Buang menu aplikasi bawaan (juga menghapus akselerator DevTools/reload
    // dari menu) di produksi — game kelas tak butuh menu bar.
    if (!DEV) Menu.setApplicationMenu(null)
    registerIpc()
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  // CODEX audit UI/UX 2026-07-10 (#2): tanpa ini, menutup aplikasi bisa
  // mendahului write/rename yang masih tertunda di `antreanTulis` (mis. tulisan
  // terakhir belum sempat rename dari file .tmp) — progres terbaru bisa hilang.
  // `catch(() => {})` per-promise: satu tulisan gagal tak boleh menahan quit.
  // CODEX M14 #12: race dgn timeout 5 detik — kalau fs hang (disk jaringan/lock
  // antivirus), allSettled bisa TAK PERNAH selesai → app tak pernah keluar
  // (perlu force-kill). Timeout menjamin quit tetap terjadi.
  app.on('before-quit', (e) => {
    if (sedangKeluar) return // panggilan kedua (dipicu app.quit() di bawah) — biarkan lolos
    sedangKeluar = true
    // Fix #31d: telemetriPending ikut ditunggu di sini sekarang, sama spt
    // tulisan save — satu titik flush-on-quit, bukan dua mekanisme berbeda.
    const tertunda = [...antreanTulis.values(), telemetriPending]
    e.preventDefault()
    const semua = Promise.allSettled(tertunda.map((p) => p.catch(() => {})))
    const batasWaktu = new Promise<void>((res) => setTimeout(res, 5000))
    Promise.race([semua, batasWaktu]).then(() => {
      antreanTulis.clear()
      app.quit()
    })
  })
}
