import { contextBridge, ipcRenderer } from 'electron'

// Bridge tipis & bertipe: satu-satunya pintu renderer ke dunia luar.
const api = {
  save: {
    write: (slot: string, json: string): Promise<boolean> => ipcRenderer.invoke('save:write', slot, json),
    read: (slot: string): Promise<string | null> => ipcRenderer.invoke('save:read', slot),
    list: (): Promise<{ slot: string; mtimeMs: number; size: number }[]> => ipcRenderer.invoke('save:list'),
    delete: (slot: string): Promise<boolean> => ipcRenderer.invoke('save:delete', slot),
  },
  // DeepThink ronde-2 — telemetri wall-clock (docs/TELEMETRI_WALLCLOCK.md).
  telemetri: {
    append: (baris: string): Promise<boolean> => ipcRenderer.invoke('telemetri:append', baris),
    read: (): Promise<string[]> => ipcRenderer.invoke('telemetri:read'),
  },
  appVersion: (): Promise<string> => ipcRenderer.invoke('app:version'),
  /** A7: daftar rilis dari feed Atom publik (diambil di main — CSP & rate limit). */
  cekPembaruan: (): Promise<{ judul: string; url: string }[]> => ipcRenderer.invoke('pembaruan:cek'),
  runtime: {
    consumeRecovery: (): Promise<{ occurredAt: string; reason: string; exitCode: number } | null> =>
      ipcRenderer.invoke('runtime:consume-recovery'),
    readCrashLog: (): Promise<string[]> => ipcRenderer.invoke('runtime:crash-log'),
    logError: (entri: { pesan: string; stack?: string; layar?: string }): Promise<boolean> =>
      ipcRenderer.invoke('runtime:log-error', entri),
  },
}

export type PrimerBridge = typeof api

contextBridge.exposeInMainWorld('primer', api)
