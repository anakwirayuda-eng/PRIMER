/**
 * DIAGNOSTIK & UMPAN BALIK (A8 telemetri, audit benchmark 2026-08-02).
 *
 * PRIMERA sengaja offline (tanpa akun/server — privasi mahasiswa), jadi
 * "telemetri" versi produk ini adalah BERKAS yang mahasiswa sadari dan
 * kirim sendiri: satu Laporan Diagnostik berisi versi aplikasi, pengaturan,
 * log crash lokal, penghitung pemakaian layar, dan teks umpan balik.
 * Tidak ada satu byte pun yang keluar dari mesin tanpa tindakan pengguna.
 */

import { getPengaturan } from './settings'

const KUNCI_PEMAKAIAN = 'primer.pemakaian.layar'

/** Baca penghitung kunjungan layar (localStorage; {} bila kosong/korup). */
export function bacaPemakaianLayar(): Record<string, number> {
  try {
    const mentah = window.localStorage.getItem(KUNCI_PEMAKAIAN)
    if (!mentah) return {}
    const o = JSON.parse(mentah) as Record<string, unknown>
    const bersih: Record<string, number> = {}
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) bersih[k] = v
    }
    return bersih
  } catch {
    return {}
  }
}

/**
 * Catat satu kunjungan layar. Dipanggil App saat `state.layar` berganti —
 * murni renderer/localStorage: TIDAK menyentuh save, engine, maupun sidik
 * jari pack (determinisme replay tak terpengaruh).
 */
export function catatKunjunganLayar(layar: string): void {
  try {
    const pemakaian = bacaPemakaianLayar()
    pemakaian[layar] = (pemakaian[layar] ?? 0) + 1
    window.localStorage.setItem(KUNCI_PEMAKAIAN, JSON.stringify(pemakaian))
  } catch {
    /* penyimpanan penuh/nonaktif — penghitung opsional, jangan ganggu game */
  }
}

export interface LaporanDiagnostik {
  jenis: 'laporan-diagnostik-primera'
  dibuat: string
  versiApp: string
  platform: string
  pengaturan: ReturnType<typeof getPengaturan>
  pemakaianLayar: Record<string, number>
  /** Baris terakhir log crash lokal (render-process-gone + error JS). */
  logCrash: string[]
  /** Konteks sesi ringkas — TANPA isi save (privasi & ukuran). */
  sesi: { hari: number; blok: string; mode: string; layar: string } | null
  umpanBalik: string
}

/** Susun isi laporan — dipisah dari unduh supaya bisa diuji tanpa DOM/IPC. */
export function susunLaporan(masukan: {
  versiApp: string
  logCrash: string[]
  sesi: LaporanDiagnostik['sesi']
  umpanBalik: string
}): LaporanDiagnostik {
  return {
    jenis: 'laporan-diagnostik-primera',
    dibuat: new Date().toISOString(),
    versiApp: masukan.versiApp,
    platform: navigator.userAgent,
    pengaturan: getPengaturan(),
    pemakaianLayar: bacaPemakaianLayar(),
    logCrash: masukan.logCrash.slice(-50),
    sesi: masukan.sesi,
    umpanBalik: masukan.umpanBalik.slice(0, 4000),
  }
}

/** Kumpulkan data via bridge lalu unduh sebagai berkas JSON. */
export async function unduhLaporanDiagnostik(
  umpanBalik: string,
  sesi: LaporanDiagnostik['sesi'],
): Promise<void> {
  const [versiApp, logCrash] = await Promise.all([
    window.primer.appVersion().catch(() => 'tak-diketahui'),
    window.primer.runtime?.readCrashLog().catch(() => [] as string[]) ?? Promise.resolve([]),
  ])
  const laporan = susunLaporan({ versiApp, logCrash, sesi, umpanBalik })
  const blob = new Blob([JSON.stringify(laporan, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `primer_diagnostik_${laporan.dibuat.slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
