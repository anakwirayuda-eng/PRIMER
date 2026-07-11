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
  /**
   * CODEX M14 #25: penanda sesi (seed:seedKurikulum) — file telemetri global
   * dipakai lintas semua slot/sesi/pemain di satu instalasi. Tanpa ini, audit
   * membandingkan entri antar sesi berbeda & salah mencap "save-scum" (komputer
   * bergantian, memuat slot lain, dst.). Opsional: log lama tanpa `sesi` diaudit
   * sbg satu grup 'legacy' (perilaku sebelumnya).
   */
  sesi?: string
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
        hasil.push({
          t: o['t'],
          hari: o['hari'],
          blok: o['blok'],
          jejakLen: o['jejakLen'],
          ...(typeof o['sesi'] === 'string' ? { sesi: o['sesi'] } : {}),
        })
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
  // CODEX M14 #25: kelompokkan per SESI dulu — membandingkan entri antar sesi
  // berbeda (komputer bergantian / memuat slot lain) salah dicap save-scum.
  // Urutan dalam grup tetap urutan kemunculan di file (kronologis penulisan).
  const perSesi = new Map<string, BarisTelemetri[]>()
  for (const e of entri) {
    const kunci = e.sesi ?? 'legacy'
    let grup = perSesi.get(kunci)
    if (!grup) {
      grup = []
      perSesi.set(kunci, grup)
    }
    grup.push(e)
  }
  const peringatan: string[] = []
  for (const grup of perSesi.values()) {
    for (let i = 1; i < grup.length; i++) {
      const prev = grup[i - 1]!
      const cur = grup[i]!
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
  }
  return peringatan
}
