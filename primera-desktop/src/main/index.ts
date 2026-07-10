import { app, BrowserWindow, ipcMain, shell, Menu } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'

// Build produksi: kunci DevTools & pintasannya. Integritas asesmen (CODEX P1):
// tanpa konsol, mahasiswa tak bisa mem-bypass UI (dispatch aksi lompat-fase)
// atau mengutak-atik state sebelum ekspor dossier. Dibuka hanya bila
// PRIMER_DEV=1 (untuk pengembang), TIDAK di build kelas.
const DEV = !!process.env['ELECTRON_RENDERER_URL'] || process.env['PRIMER_DEV'] === '1'

// ---------------------------------------------------------------------------
// PRIMERA: Puskesmas Pagi — Electron main process
// Bertanggung jawab atas: jendela game, save/load ke disk (userData/saves).
// Semua logika game hidup di renderer/engine — main process sengaja tipis.
// ---------------------------------------------------------------------------

const SAVE_DIR = () => join(app.getPath('userData'), 'saves')

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
    const dir = await ensureSaveDir()
    try {
      return await fs.readFile(join(dir, `${sanitizeSlot(slot)}.json`), 'utf-8')
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

  ipcMain.handle('telemetri:append', async (_e, baris: string) => {
    await fs.appendFile(TELEMETRI_FILE(), baris.replace(/\n/g, ' ') + '\n', 'utf-8')
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
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 760,
    show: false,
    title: 'PRIMERA: Puskesmas Pagi',
    backgroundColor: '#FAF6EF',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
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
    if (sekarang - terakhirReload < 4000) {
      console.error('[render-process-gone] crash beruntun — tidak auto-reload lagi (hindari loop)')
      return
    }
    terakhirReload = sekarang
    win.reload()
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

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

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
app.on('before-quit', (e) => {
  const tertunda = [...antreanTulis.values()]
  if (tertunda.length === 0) return
  e.preventDefault()
  Promise.allSettled(tertunda.map((p) => p.catch(() => {}))).then(() => {
    antreanTulis.clear()
    app.quit()
  })
})
