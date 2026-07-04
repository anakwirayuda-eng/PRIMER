import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { langgananPemainPod } from '@/lib/api'
import type { GameSession, PodState, Player } from '@/lib/types'

interface Props {
  session: GameSession
  pod: PodState
  player: Player
}

export function WaitingRoom({ session, pod, player }: Props) {
  const [rekan, setRekan] = useState<Player[]>([])

  useEffect(() => {
    let batal = false
    async function muat() {
      const { data } = await supabase.from('players').select('*').eq('pod_id', pod.id).order('seat')
      if (!batal) setRekan((data ?? []) as Player[])
    }
    muat()
    const lepas = langgananPemainPod(pod.id, muat)
    return () => {
      batal = true
      lepas()
    }
  }, [pod.id])

  return (
    <div className="layar-tengah">
      <h1>Ruang Tunggu</h1>
      <p className="subjudul">
        {pod.nama} · Anda: <strong>{player.nama}</strong> ({player.seat})
      </p>
      <p>Menunggu dosen/GM memulai ronde ({session.phase})…</p>
      <ul className="daftar-rekan">
        {rekan.map((r) => (
          <li key={r.id}>
            {r.seat} — {r.nama} {r.id === player.id && '(Anda)'}
          </li>
        ))}
      </ul>
    </div>
  )
}
