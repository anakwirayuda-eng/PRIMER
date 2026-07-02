import { contextBridge, ipcRenderer } from 'electron'

// Bridge tipis & bertipe: satu-satunya pintu renderer ke dunia luar.
const api = {
  save: {
    write: (slot: string, json: string): Promise<boolean> => ipcRenderer.invoke('save:write', slot, json),
    read: (slot: string): Promise<string | null> => ipcRenderer.invoke('save:read', slot),
    list: (): Promise<{ slot: string; mtimeMs: number; size: number }[]> => ipcRenderer.invoke('save:list'),
    delete: (slot: string): Promise<boolean> => ipcRenderer.invoke('save:delete', slot),
  },
  appVersion: (): Promise<string> => ipcRenderer.invoke('app:version'),
}

export type PrimerBridge = typeof api

contextBridge.exposeInMainWorld('primer', api)
