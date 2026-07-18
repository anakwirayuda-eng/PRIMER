import type {
  CareEpisodeLite,
  PasienAktif,
  PemilikEpisode,
  SumberEpisode,
  StatusEpisode,
  TahapRujukan,
} from './state'

const BATAS_RIWAYAT = 12
const BATAS_EPISODE = 120

function amanId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'tanpa_id'
}

export function buatEpisodeId(scope: string, subjectId: string, problemId: string): string {
  return `episode_${amanId(scope)}_${amanId(subjectId)}_${amanId(problemId)}`
}

export function episodeIdPasien(pasien: Pick<PasienAktif, 'id' | 'kasusId' | 'episodeId'>): string {
  return pasien.episodeId ?? buatEpisodeId('pasien', pasien.id, pasien.kasusId)
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
  const active = result.filter((episode) => episode.status !== 'terverifikasi' && episode.status !== 'berakhir')
  const closed = result
    .filter((episode) => episode.status === 'terverifikasi' || episode.status === 'berakhir')
    .sort((a, b) => b.updatedDay - a.updatedDay)
  return [...active, ...closed.slice(0, Math.max(0, BATAS_EPISODE - active.length))]
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
