/**
 * TEST — main process: menu aplikasi, antrean disk, dan flush saat keluar.
 *
 * Modul main punya efek samping saat diimpor (single-instance lock, whenReady,
 * pendaftaran IPC), jadi `electron` dimock dan modulnya diimpor ULANG per
 * skenario (platform/terpaket berbeda). Sisi disk sengaja TIDAK dimock: save
 * benar-benar ditulis ke folder sementara supaya urutan tulis/hapus/rename
 * teruji sungguhan, bukan sekadar urutan pemanggilan.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { promises as fs, mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

type Pendengar = (...args: never[]) => unknown

const bengkel = vi.hoisted(() => ({
  userData: '',
  isPackaged: false,
  ipc: new Map<string, (...args: unknown[]) => unknown>(),
  app: new Map<string, Pendengar[]>(),
  wc: new Map<string, Pendengar[]>(),
  wcSekali: new Map<string, Pendengar[]>(),
  menu: [] as unknown[],
  template: [] as Record<string, unknown>[][],
  popup: 0,
  quit: 0,
  devtoolsDitutup: 0,
  padaQuit: null as null | (() => void),
}))

vi.mock('electron', () => {
  const catat = (peta: Map<string, Pendengar[]>, ev: string, cb: Pendengar): void => {
    const daftar = peta.get(ev) ?? []
    daftar.push(cb)
    peta.set(ev, daftar)
  }
  class FakeWebContents {
    session = { setPermissionRequestHandler: (): void => {} }
    on(ev: string, cb: Pendengar): this {
      catat(bengkel.wc, ev, cb)
      return this
    }
    once(ev: string, cb: Pendengar): this {
      catat(bengkel.wcSekali, ev, cb)
      return this
    }
    setWindowOpenHandler(): void {}
    closeDevTools(): void {
      bengkel.devtoolsDitutup++
    }
    capturePage(): Promise<{ toPNG: () => Buffer }> {
      return Promise.resolve({ toPNG: () => Buffer.from('') })
    }
  }
  class FakeBrowserWindow {
    webContents = new FakeWebContents()
    static getAllWindows(): unknown[] {
      return []
    }
    on(): this {
      return this
    }
    show(): void {}
    isDestroyed(): boolean {
      return false
    }
    isMinimized(): boolean {
      return false
    }
    loadFile(): void {}
    loadURL(): void {}
  }
  return {
    app: {
      get isPackaged(): boolean {
        return bengkel.isPackaged
      },
      getPath: (): string => bengkel.userData,
      getVersion: (): string => '1.1.0-test',
      requestSingleInstanceLock: (): boolean => true,
      whenReady: (): Promise<void> => Promise.resolve(),
      on: (ev: string, cb: Pendengar): void => catat(bengkel.app, ev, cb),
      quit: (): void => {
        bengkel.quit++
        bengkel.padaQuit?.()
      },
    },
    BrowserWindow: FakeBrowserWindow,
    ipcMain: {
      handle: (kanal: string, fn: (...args: unknown[]) => unknown): void => {
        bengkel.ipc.set(kanal, fn)
      },
    },
    nativeTheme: { shouldUseDarkColors: false },
    shell: { openExternal: (): void => {} },
    Menu: {
      setApplicationMenu: (m: unknown): void => {
        bengkel.menu.push(m)
      },
      buildFromTemplate: (t: Record<string, unknown>[]) => {
        bengkel.template.push(t)
        return {
          popup: (): void => {
            bengkel.popup++
          },
        }
      },
    },
  }
})

const platformAsli = process.platform
let dirSementara = ''

function setPlatform(p: NodeJS.Platform): void {
  Object.defineProperty(process, 'platform', { value: p, configurable: true })
}

/** Impor ulang main process dengan kondisi lingkungan tertentu. */
async function muatMain(opsi: { platform?: NodeJS.Platform; terpaket?: boolean } = {}): Promise<void> {
  setPlatform(opsi.platform ?? 'win32')
  bengkel.isPackaged = opsi.terpaket ?? true
  vi.resetModules()
  await import('./index')
  // whenReady() diselesaikan di microtask; beri satu putaran event loop agar
  // registerIpc()/createWindow() benar-benar sudah berjalan.
  await new Promise((r) => setTimeout(r, 0))
}

const saveDir = (): string => join(dirSementara, 'saves')
const ipc = (kanal: string) => bengkel.ipc.get(kanal) as (...args: unknown[]) => Promise<unknown>
const pendengarPertama = (peta: Map<string, Pendengar[]>, ev: string): Pendengar => {
  const daftar = peta.get(ev)
  if (!daftar?.[0]) throw new Error(`Tidak ada pendengar '${ev}'`)
  return daftar[0]
}

beforeEach(() => {
  dirSementara = mkdtempSync(join(tmpdir(), 'primera-main-'))
  bengkel.userData = dirSementara
  bengkel.ipc.clear()
  bengkel.app.clear()
  bengkel.wc.clear()
  bengkel.wcSekali.clear()
  bengkel.menu.length = 0
  bengkel.template.length = 0
  bengkel.popup = 0
  bengkel.quit = 0
  bengkel.devtoolsDitutup = 0
  bengkel.padaQuit = null
  delete process.env['PRIMER_SHOT']
  delete process.env['PRIMER_DEV']
  delete process.env['ELECTRON_RENDERER_URL']
})

afterEach(() => {
  setPlatform(platformAsli)
  delete process.env['PRIMER_SHOT']
  delete process.env['PRIMER_DEV']
  delete process.env['ELECTRON_RENDERER_URL']
  rmSync(dirSementara, { recursive: true, force: true })
})

describe('menu aplikasi build kelas', () => {
  it('macOS terpaket memasang menu role (Cmd+C/V/X/A/Z & Cmd+Q hidup)', async () => {
    await muatMain({ platform: 'darwin' })
    expect(bengkel.menu).toHaveLength(1)
    expect(bengkel.menu[0]).not.toBeNull()
    expect(bengkel.template[0]?.map((i) => i['role'])).toEqual(['appMenu', 'editMenu', 'windowMenu'])
  })

  it('menu macOS tidak membawa DevTools/reload (viewMenu sengaja absen)', async () => {
    await muatMain({ platform: 'darwin' })
    const isi = JSON.stringify(bengkel.template[0])
    expect(isi).not.toMatch(/devtools|reload|viewMenu/i)
  })

  it('Windows/Linux terpaket tetap tanpa menu bar', async () => {
    await muatMain({ platform: 'win32' })
    expect(bengkel.menu).toEqual([null])
    await muatMain({ platform: 'linux' })
    expect(bengkel.menu).toEqual([null, null])
  })

  it('build DEV tak-dipaket tidak diutak-atik menunya', async () => {
    process.env['PRIMER_DEV'] = '1'
    await muatMain({ platform: 'darwin', terpaket: false })
    expect(bengkel.menu).toHaveLength(0)
  })

  it('blokade DevTools tetap utuh di macOS terpaket', async () => {
    await muatMain({ platform: 'darwin' })
    // Lapis 1: pintasan papan ketik ditolak.
    const inputHandler = pendengarPertama(bengkel.wc, 'before-input-event') as (
      e: { preventDefault: () => void },
      input: { key: string; control?: boolean; meta?: boolean; shift?: boolean },
    ) => void
    const f12 = { preventDefault: vi.fn() }
    inputHandler(f12, { key: 'F12' })
    expect(f12.preventDefault).toHaveBeenCalled()
    const ctrlShiftI = { preventDefault: vi.fn() }
    inputHandler(ctrlShiftI, { key: 'I', meta: true, shift: true })
    expect(ctrlShiftI.preventDefault).toHaveBeenCalled()
    // Lapis 2: DevTools yang telanjur terbuka langsung ditutup.
    ;(pendengarPertama(bengkel.wc, 'devtools-opened') as () => void)()
    expect(bengkel.devtoolsDitutup).toBe(1)
  })
})

describe('menu konteks salin/tempel', () => {
  interface ParamsKonteks {
    isEditable: boolean
    selectionText: string
    editFlags: Record<string, boolean>
  }
  const benderaPenuh = {
    canUndo: true,
    canRedo: true,
    canCut: true,
    canCopy: true,
    canPaste: true,
    canSelectAll: true,
  }
  const picu = (params: ParamsKonteks): void => {
    ;(pendengarPertama(bengkel.wc, 'context-menu') as (e: unknown, p: ParamsKonteks) => void)(
      {},
      params,
    )
  }

  it('kolom isian mendapat potong/salin/tempel', async () => {
    await muatMain()
    picu({ isEditable: true, selectionText: '', editFlags: benderaPenuh })
    const roles = bengkel.template[0]?.map((i) => i['role'])
    expect(roles).toContain('paste')
    expect(roles).toContain('copy')
    expect(roles).toContain('cut')
    expect(bengkel.popup).toBe(1)
  })

  it('teks tersorot yang tak bisa disunting hanya mendapat salin', async () => {
    await muatMain()
    picu({ isEditable: false, selectionText: 'Error: gagal', editFlags: benderaPenuh })
    expect(bengkel.template[0]?.map((i) => i['role'])).toEqual(['copy'])
  })

  it('klik kanan di area kosong tidak memunculkan menu', async () => {
    await muatMain()
    picu({ isEditable: false, selectionText: '   ', editFlags: benderaPenuh })
    expect(bengkel.popup).toBe(0)
    expect(bengkel.template).toHaveLength(0)
  })
})

describe('antrean disk per-slot', () => {
  it('slot beda kapital adalah SATU file dan SATU antrean', async () => {
    await muatMain()
    await ipc('save:write')(null, 'slot1', 'LAMA')
    const tulisan = ipc('save:write')(null, 'SLOT1', 'BARU') // sengaja tak ditunggu
    // Pembacaan slot yang sama (kapital berbeda) harus berbaris di belakang
    // tulisan yang masih berjalan, bukan mengambil snapshot lama.
    expect(await ipc('save:read')(null, 'Slot1')).toBe('BARU')
    await tulisan
    expect(await fs.readdir(saveDir())).toEqual(['slot1.json'])
  })

  it('hapus berbaris di belakang tulisan — file tak hidup lagi karena rename tertunda', async () => {
    await muatMain()
    const tulisan = ipc('save:write')(null, 'slot2', 'ISI') // sengaja tak ditunggu
    await ipc('save:delete')(null, 'slot2')
    await tulisan
    expect(await ipc('save:read')(null, 'slot2')).toBeNull()
    expect(await fs.readdir(saveDir())).toEqual([])
  })

  it('slot dengan karakter di luar daftar putih ditolak', async () => {
    await muatMain()
    await expect(ipc('save:write')(null, '../jahat', 'x')).rejects.toThrow(/Slot tidak valid/)
    await expect(ipc('save:delete')(null, 'a/b')).rejects.toThrow(/Slot tidak valid/)
  })
})

describe('telemetri:read', () => {
  it('log yang belum pernah ditulis = daftar kosong', async () => {
    await muatMain()
    expect(await ipc('telemetri:read')()).toEqual([])
  })

  it('kegagalan baca tidak menyamar jadi log kosong', async () => {
    await muatMain()
    // Bukan-ENOENT: path log ternyata sebuah folder (EISDIR).
    await fs.mkdir(join(dirSementara, 'telemetri.jsonl'), { recursive: true })
    await expect(ipc('telemetri:read')()).rejects.toThrow()
  })

  it('baris yang sudah ditulis terbaca kembali', async () => {
    await muatMain()
    await ipc('telemetri:append')(null, 'baris-1')
    await ipc('telemetri:append')(null, 'baris-2')
    expect(await ipc('telemetri:read')()).toEqual(['baris-1', 'baris-2'])
  })
})

describe('PRIMER_SHOT', () => {
  it('tidak aktif di build terpaket (installer kelas)', async () => {
    process.env['PRIMER_SHOT'] = join(dirSementara, 'shot.png')
    await muatMain({ terpaket: true })
    expect(bengkel.wcSekali.get('did-finish-load')).toBeUndefined()
  })

  it('tetap tersedia di build tak-dipaket (verifikasi pengembang)', async () => {
    process.env['PRIMER_SHOT'] = join(dirSementara, 'shot.png')
    await muatMain({ terpaket: false })
    expect(bengkel.wcSekali.get('did-finish-load')).toHaveLength(1)
  })
})

describe('flush saat keluar', () => {
  it('tulisan yang masuk SETELAH snapshot tetap ditunggu sebelum quit', async () => {
    await muatMain()
    let isiSaatQuit: string | null = null
    bengkel.padaQuit = () => {
      try {
        isiSaatQuit = readFileSync(join(saveDir(), 'autosave.json'), 'utf-8')
      } catch {
        isiSaatQuit = null
      }
    }
    const ev = { preventDefault: vi.fn() }
    ;(pendengarPertama(bengkel.app, 'before-quit') as (e: unknown) => void)(ev)
    expect(ev.preventDefault).toHaveBeenCalled()
    // Renderer masih hidup selama fase flush: autosave terakhir tiba sesudah
    // snapshot pertama diambil.
    const telat = ipc('save:write')(null, 'autosave', 'TERLAMBAT')
    await vi.waitFor(() => expect(bengkel.quit).toBe(1))
    await telat
    expect(isiSaatQuit).toBe('TERLAMBAT')
  })

  it('panggilan before-quit kedua lolos tanpa preventDefault', async () => {
    await muatMain()
    const beforeQuit = pendengarPertama(bengkel.app, 'before-quit') as (e: unknown) => void
    const pertama = { preventDefault: vi.fn() }
    const kedua = { preventDefault: vi.fn() }
    beforeQuit(pertama)
    beforeQuit(kedua)
    expect(pertama.preventDefault).toHaveBeenCalled()
    expect(kedua.preventDefault).not.toHaveBeenCalled()
  })
})
