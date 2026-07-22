/// <reference types="vite/client" />

interface Window {
  primer: {
    save: {
      write: (slot: string, json: string) => Promise<boolean>
      read: (slot: string) => Promise<string | null>
      list: () => Promise<{ slot: string; mtimeMs: number; size: number }[]>
      delete: (slot: string) => Promise<boolean>
    }
    telemetri: {
      append: (baris: string) => Promise<boolean>
      read: () => Promise<string[]>
    }
    appVersion: () => Promise<string>
    runtime?: {
      consumeRecovery: () => Promise<{ occurredAt: string; reason: string; exitCode: number } | null>
      readCrashLog: () => Promise<string[]>
    }
  }
}
