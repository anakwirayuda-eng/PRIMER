import type {
  CareEpisodeLite,
  PasienAktif,
  PemilikEpisode,
  SumberEpisode,
  StatusEpisode,
  TahapRujukan,
} from './state'

const BATAS_RIWAYAT = 12
/**
 * Jumlah episode yang dipertahankan LENGKAP — dengan riwayat langkah demi
 * langkahnya. Bukan lagi plafon jumlah record; lihat BATAS_ARSIP_EPISODE.
 */
const BATAS_EPISODE = 120
/**
 * Audit UKM 2026-08-22: plafon KERAS jumlah record episode.
 *
 * Dulu `BATAS_EPISODE` menggusur record: begitu ledger lewat 120, episode
 * 'terverifikasi'/'berakhir' tertua-update DIHAPUS. `ringkasanEpisode`
 * menghitung verified/adverse/closed dari array yang sudah terpangkas itu,
 * jadi angka "Tindak lanjut tuntas" di Jejak Perawatan menyusut sendiri —
 * pemain melihat kerja yang sudah ia selesaikan berkurang tanpa sebab yang
 * bisa dilihat. Kerja yang sudah tuntas tidak boleh dicabut oleh keterbatasan
 * penyimpanan.
 *
 * Kini yang digusur adalah MUATANnya, bukan recordnya (lihat
 * `rampingkanEpisode`). Plafon ini tetap ada sebagai rem memori/ukuran save,
 * tapi dipasang jauh di atas panen wajar satu stase penuh — karier 90 hari
 * dengan 2-4 pasien poli/hari plus IGD, kunjungan, dan kegiatan UKM berhenti
 * di kisaran 500 episode — supaya tak pernah tergigit dalam permainan sah.
 */
const BATAS_ARSIP_EPISODE = 900

function amanId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'tanpa_id'
}

export function buatEpisodeId(scope: string, subjectId: string, problemId: string): string {
  return `episode_${amanId(scope)}_${amanId(subjectId)}_${amanId(problemId)}`
}

export function episodeIdPasien(pasien: Pick<PasienAktif, 'id' | 'kasusId' | 'episodeId'>): string {
  return pasien.episodeId ?? buatEpisodeId('pasien', pasien.id, pasien.kasusId)
}

function episodeTertutup(episode: CareEpisodeLite): boolean {
  return episode.status === 'terverifikasi' || episode.status === 'berakhir'
}

/**
 * Audit UKM 2026-08-22: rampingkan record alih-alih membuangnya. Riwayat
 * langkah demi langkah adalah bagian terberat sebuah episode (sampai
 * BATAS_RIWAYAT peristiwa berisi empat teks), sedangkan `ringkasanEpisode`
 * hanya membaca status, dueDay, updatedDay, dan jumlah record — tak satu pun
 * tersimpan di `history`. Jadi memangkas riwayat menekan memori TANPA
 * menggeser satu angka pun yang dibaca pemain. Peristiwa terakhir disisakan
 * supaya kartu di Jejak Perawatan tetap bercerita bagaimana episode ditutup.
 */
function rampingkanEpisode(episode: CareEpisodeLite): CareEpisodeLite {
  if (episode.history.length <= 1) return episode
  return { ...episode, history: episode.history.slice(-1) }
}

export interface PerbaruiEpisode {
  id: string
  day: number
  subjectId: string
  subjectName: string
  familyId?: string
  rw?: number
  source: SumberEpisode
  problemId: string
  problemLabel: string
  owner: PemilikEpisode
  status: StatusEpisode
  signal: string
  decision?: string
  feedback?: string
  nextAction: string
  dueDay?: number | null
  referral?: {
    stage: TahapRujukan
    hospitalName?: string
    note?: string
  }
  eventLabel: string
  eventDetail: string
}

/**
 * Upsert deterministik untuk ledger episode. Satu transisi identik tidak
 * menggandakan riwayat saat replay atau saat callback yang sama dipanggil lagi.
 */
export function perbaruiEpisode(
  episodes: readonly CareEpisodeLite[],
  update: PerbaruiEpisode,
): CareEpisodeLite[] {
  const index = episodes.findIndex((episode) => episode.id === update.id)
  const current = index >= 0 ? episodes[index] : undefined
  const historyEvent = {
    hari: update.day,
    status: update.status,
    label: update.eventLabel,
    detail: update.eventDetail,
  }
  const historyBefore = current?.history ?? []
  const last = historyBefore.at(-1)
  const duplicate =
    last?.hari === historyEvent.hari &&
    last.status === historyEvent.status &&
    last.label === historyEvent.label &&
    last.detail === historyEvent.detail
  const history = duplicate
    ? historyBefore
    : [...historyBefore, historyEvent].slice(-BATAS_RIWAYAT)

  const next: CareEpisodeLite = {
    id: update.id,
    subjectId: update.subjectId,
    subjectName: update.subjectName,
    ...(current?.familyId || update.familyId ? { familyId: update.familyId ?? current?.familyId } : {}),
    ...(current?.rw !== undefined || update.rw !== undefined ? { rw: update.rw ?? current?.rw } : {}),
    source: current?.source ?? update.source,
    problemId: update.problemId,
    problemLabel: update.problemLabel,
    owner: update.owner,
    status: update.status,
    openedDay: current?.openedDay ?? update.day,
    updatedDay: update.day,
    ...(update.dueDay === null
      ? {}
      : update.dueDay !== undefined || current?.dueDay !== undefined
        ? { dueDay: update.dueDay ?? current?.dueDay }
        : {}),
    nextAction: update.nextAction,
    ...(update.referral || current?.referral
      ? { referral: { ...(current?.referral ?? { stage: update.referral!.stage }), ...update.referral } }
      : {}),
    receipt: {
      signal: update.signal || current?.receipt.signal || '',
      ...(update.decision || current?.receipt.decision
        ? { decision: update.decision ?? current?.receipt.decision }
        : {}),
      ...(update.feedback || current?.receipt.feedback
        ? { feedback: update.feedback ?? current?.receipt.feedback }
        : {}),
      next: update.nextAction,
    },
    history,
  }

  const result = index >= 0
    ? episodes.map((episode, i) => (i === index ? next : episode))
    : [...episodes, next]

  if (result.length <= BATAS_EPISODE) return result

  // Audit UKM 2026-08-22: dulu blok ini memberi episode aktif seluruh 120 slot
  // lalu MENGHAPUS sisa episode tertutup — hitungan "Tindak lanjut tuntas"
  // pemain ikut terhapus bersamanya. Sekarang urutan yang sama hanya
  // menentukan siapa yang berhak menyimpan riwayat penuh; recordnya sendiri
  // tetap tinggal sampai plafon arsip yang jauh lebih longgar.
  const prioritas = [...result].sort((a, b) => {
    const tertutupA = episodeTertutup(a)
    const tertutupB = episodeTertutup(b)
    // Episode hidup = worklist dokter, jadi ia yang paling butuh detail.
    if (tertutupA !== tertutupB) return tertutupA ? 1 : -1
    if (!tertutupA) {
      const dueA = a.dueDay ?? Number.POSITIVE_INFINITY
      const dueB = b.dueDay ?? Number.POSITIVE_INFINITY
      if (dueA !== dueB) return dueA - dueB
    }
    return b.updatedDay - a.updatedDay || a.id.localeCompare(b.id)
  })
  const berdetail = new Set(prioritas.slice(0, BATAS_EPISODE).map((episode) => episode.id))
  // Pemangkasan record hanya terjadi di plafon arsip — dan yang jatuh adalah
  // ekor paling basi (tertutup, paling lama tak tersentuh), bukan capaian
  // terbaru pemain.
  const dipertahankan =
    prioritas.length > BATAS_ARSIP_EPISODE ? prioritas.slice(0, BATAS_ARSIP_EPISODE) : prioritas
  return dipertahankan.map((episode) =>
    berdetail.has(episode.id) ? episode : rampingkanEpisode(episode),
  )
}

export function progresEpisode(status: StatusEpisode): number {
  switch (status) {
    case 'terdeteksi':
      return 1
    case 'dinilai':
      return 2
    case 'ditindaklanjuti':
    case 'menunggu':
    case 'dirujuk':
      return 3
    case 'kembali':
      return 4
    case 'terverifikasi':
    case 'berakhir':
      return 5
  }
}

/**
 * Angka yang dibaca pemain di Jejak Perawatan. Seluruhnya diturunkan dari
 * jumlah record, jadi ia hanya sejujur ledger yang diberikan padanya —
 * `perbaruiEpisode` yang menjaga agar kapasitas tidak lagi mencabut record
 * tertutup (audit UKM 2026-08-22). Jangan kembalikan penggusuran record ke
 * sana tanpa memindahkan verified/adverse ke penghitung kumulatif dulu.
 */
export function ringkasanEpisode(episodes: readonly CareEpisodeLite[], currentDay?: number): {
  active: number
  closed: number
  verified: number
  adverse: number
  overdue: number
  closureRate: number
} {
  const verified = episodes.filter((episode) => episode.status === 'terverifikasi').length
  const adverse = episodes.filter((episode) => episode.status === 'berakhir').length
  const closed = verified + adverse
  const active = episodes.length - closed
  const comparisonDay = currentDay ?? episodes.reduce((max, episode) => Math.max(max, episode.updatedDay), 0)
  const overdue = episodes.filter(
    (episode) =>
      episode.status !== 'terverifikasi' &&
      episode.status !== 'berakhir' &&
      episode.dueDay !== undefined &&
      episode.dueDay < comparisonDay,
  ).length
  return {
    active,
    closed,
    verified,
    adverse,
    overdue,
    closureRate: episodes.length > 0 ? verified / episodes.length : 0,
  }
}
