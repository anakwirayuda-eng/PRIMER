import { supabase } from './supabaseClient'
import { nilaiKeputusan } from './penilaian'
import type { GameSession, KartuPasien, KlaimBedResult, PodState, Player, Referral } from './types'

// ---------------------------------------------------------------------------
// GM — pembuatan sesi/pod & pembagian kartu. Dipakai GMConsole, bukan pemain.
// ---------------------------------------------------------------------------

export async function buatSesi(kode: string, nama: string): Promise<GameSession> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({ kode: kode.trim().toUpperCase(), nama })
    .select('*')
    .single()
  if (error) throw error
  return data as GameSession
}

export async function buatPod(
  sessionId: string,
  nomor: number,
  nama: string,
  rsBeds: PodState['rs_beds']
): Promise<PodState> {
  const { data, error } = await supabase
    .from('pod_states')
    .insert({ session_id: sessionId, nomor, nama, rs_beds: rsBeds })
    .select('*')
    .single()
  if (error) throw error
  return data as PodState
}

export async function ubahFaseSesi(sessionId: string, phase: GameSession['phase'], round?: number): Promise<void> {
  const patch: Record<string, unknown> = { phase }
  if (round !== undefined) {
    patch.round = round
    patch.round_started_at = new Date().toISOString()
  }
  const { error } = await supabase.from('game_sessions').update(patch).eq('id', sessionId)
  if (error) throw error
}

export async function bagikanKartu(params: {
  sessionId: string
  podId: string
  playerId: string
  round: number
  pasien: KartuPasien
}): Promise<Referral> {
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      session_id: params.sessionId,
      pod_id: params.podId,
      player_id: params.playerId,
      round: params.round,
      pasien: params.pasien,
      status: 'baru',
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Referral
}

export async function cariSesi(kode: string): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('kode', kode.trim().toUpperCase())
    .maybeSingle()
  if (error) throw error
  return data as GameSession | null
}

export async function ambilSesiById(id: string): Promise<GameSession | null> {
  const { data, error } = await supabase.from('game_sessions').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as GameSession | null
}

export async function ambilPod(podId: string): Promise<PodState | null> {
  const { data, error } = await supabase.from('pod_states').select('*').eq('id', podId).maybeSingle()
  if (error) throw error
  return data as PodState | null
}

export async function daftarPod(sessionId: string): Promise<PodState[]> {
  const { data, error } = await supabase
    .from('pod_states')
    .select('*')
    .eq('session_id', sessionId)
    .order('nomor', { ascending: true })
  if (error) throw error
  return (data ?? []) as PodState[]
}

export async function cariPemainTersimpan(sessionId: string, nim: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('session_id', sessionId)
    .eq('nim', nim.trim())
    .maybeSingle()
  if (error) throw error
  return data as Player | null
}

export interface HasilGabung {
  ok: boolean
  player?: Player
  reason?: 'kursi_diambil' | 'error'
}

/** Anti-rebut-kursi: UNIQUE(pod_id, seat) di DB menolak race condition. */
export async function gabungSebagaiPemain(params: {
  sessionId: string
  podId: string
  nim: string
  nama: string
  seat: string
  authUid: string | null
}): Promise<HasilGabung> {
  const { sessionId, podId, nim, nama, seat, authUid } = params
  const { data, error } = await supabase
    .from('players')
    .upsert(
      {
        session_id: sessionId,
        pod_id: podId,
        nim: nim.trim(),
        nama: nama.trim(),
        seat,
        auth_uid: authUid,
        role: 'puskesmas',
        online: true,
      },
      { onConflict: 'session_id,nim' }
    )
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') return { ok: false, reason: 'kursi_diambil' }
    throw error
  }
  return { ok: true, player: data as Player }
}

export async function referralAktifUntukPemain(playerId: string): Promise<Referral | null> {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('player_id', playerId)
    .in('status', ['baru', 'menunggu_bed'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as Referral | null
}

async function catatAksi(params: {
  sessionId: string
  podId: string | null
  playerId: string | null
  round: number
  type: string
  payload: Record<string, unknown>
  eval: unknown
}): Promise<void> {
  const { error } = await supabase.from('actions').insert({
    session_id: params.sessionId,
    pod_id: params.podId,
    player_id: params.playerId,
    round: params.round,
    type: params.type,
    payload: params.payload,
    eval: params.eval,
  })
  if (error) throw error
}

export async function putuskanTuntas(referral: Referral): Promise<void> {
  const nilai = nilaiKeputusan(referral.pasien, 'tuntas', null, null)
  const { error } = await supabase
    .from('referrals')
    .update({ keputusan: 'tuntas', status: 'tuntas_selesai', eval: nilai, updated_at: new Date().toISOString() })
    .eq('id', referral.id)
  if (error) throw error

  await catatAksi({
    sessionId: referral.session_id,
    podId: referral.pod_id,
    playerId: referral.player_id,
    round: referral.round,
    type: 'tuntaskan',
    payload: { pasien: referral.pasien },
    eval: nilai,
  })
}

export interface HasilRujuk {
  klaim: KlaimBedResult
  nilai: ReturnType<typeof nilaiKeputusan>
}

/** Rujuk ke satu RS di kolam komons pod — inti mekanik "rebut bed". */
export async function putuskanRujuk(referral: Referral, rsId: string, rsSpesialisasi: string[]): Promise<HasilRujuk> {
  const { error: errUpdate } = await supabase
    .from('referrals')
    .update({ keputusan: 'rujuk', updated_at: new Date().toISOString() })
    .eq('id', referral.id)
  if (errUpdate) throw errUpdate

  const { data, error } = await supabase.rpc('klaim_bed', { p_ref: referral.id, p_rs_id: rsId })
  if (error) throw error
  const klaim = data as KlaimBedResult

  const nilai = nilaiKeputusan(referral.pasien, 'rujuk', rsSpesialisasi, klaim)

  await supabase.from('referrals').update({ eval: nilai }).eq('id', referral.id)
  await catatAksi({
    sessionId: referral.session_id,
    podId: referral.pod_id,
    playerId: referral.player_id,
    round: referral.round,
    type: klaim.ok ? 'rujuk' : 'klaim_bed_gagal',
    payload: { pasien: referral.pasien, rsId, klaim },
    eval: nilai,
  })

  return { klaim, nilai }
}

export async function pulangkanPasien(referralId: string): Promise<KlaimBedResult> {
  const { data, error } = await supabase.rpc('prb_pulangkan', { p_ref: referralId })
  if (error) throw error
  return data as KlaimBedResult
}

// ---------------------------------------------------------------------------
// Realtime — pembungkus tipis di atas Supabase Postgres-Changes.
// ---------------------------------------------------------------------------

export function langgananPod(podId: string, onUbah: (pod: PodState) => void) {
  const channel = supabase
    .channel(`pod:${podId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'pod_states', filter: `id=eq.${podId}` },
      (payload) => onUbah(payload.new as PodState)
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}

export function langgananReferralPemain(playerId: string, onUbah: (referral: Referral) => void) {
  const channel = supabase
    .channel(`referrals:player:${playerId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'referrals', filter: `player_id=eq.${playerId}` },
      (payload) => onUbah(payload.new as Referral)
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}

export function langgananPemainPod(podId: string, onUbah: () => void) {
  const channel = supabase
    .channel(`players:pod:${podId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `pod_id=eq.${podId}` },
      () => onUbah()
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}

export function langgananSesi(sessionId: string, onUbah: (sesi: GameSession) => void) {
  const channel = supabase
    .channel(`session:${sessionId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
      (payload) => onUbah(payload.new as GameSession)
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}
