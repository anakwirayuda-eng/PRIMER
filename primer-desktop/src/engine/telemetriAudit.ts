/**
 * TELEMETRI AUDIT — deteksi save-scumming dari log wall-clock (docs/TELEMETRI_WALLCLOCK.md).
 * Murni: memproses baris yang SUDAH direkam, tidak pernah memanggil Date.now()
 * sendiri. Bukan bagian dari skor/replay — cuma sinyal forensik utk dosen,
 * berdampingan dengan (bukan menggantikan) vonis SAH/TIDAK SAH verifikasiDossier.
 */

export interface BarisTelemetri {
  t: number
  hari: number
  blok: string
  jejakLen: number
}

function parseBaris(baris: string[]): BarisTelemetri[] {
  const hasil: BarisTelemetri[] = []
  for (const b of baris) {
    try {
      const o = JSON.parse(b) as Record<string, unknown>
      if (
        typeof o['t'] === 'number' &&
        typeof o['hari'] === 'number' &&
        typeof o['blok'] === 'string' &&
        typeof o['jejakLen'] === 'number'
      ) {
        hasil.push({ t: o['t'], hari: o['hari'], blok: o['blok'], jejakLen: o['jejakLen'] })
      }
    } catch {
      /* baris korup — lewati, bukan throw (log ini forensik, bukan kritis) */
    }
  }
  return hasil
}

/**
 * Ambang "sesi baru" — jejakLen jatuh ke bawah ini dianggap awal stase baru
 * (bukan save lama dimuat ulang), jadi hari boleh "mundur" tanpa dicurigai.
 */
const JEJAK_SESI_BARU = 3

export function auditTelemetri(baris: string[]): string[] {
  const entri = parseBaris(baris)
  const peringatan: string[] = []
  for (let i = 1; i < entri.length; i++) {
    const prev = entri[i - 1]!
    const cur = entri[i]!
    const sesiBaru = cur.jejakLen <= JEJAK_SESI_BARU && cur.jejakLen < prev.jejakLen
    if (sesiBaru) continue // stase baru dimulai — bukan indikasi save-scum
    if (cur.hari < prev.hari) {
      peringatan.push(
        `Hari mundur di log (hari ${prev.hari} → ${cur.hari}, sekitar ${new Date(prev.t).toLocaleString('id-ID')}) tanpa tanda sesi baru — indikasi save lama dimuat ulang.`,
      )
    } else if (cur.jejakLen < prev.jejakLen) {
      peringatan.push(
        `Jurnal aksi menyusut (${prev.jejakLen} → ${cur.jejakLen} entri) padahal hari tidak mereset — indikasi save lama dimuat ulang di tengah sesi.`,
      )
    }
  }
  return peringatan
}
