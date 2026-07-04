import { useEffect, useState } from 'react'
import { pastikanSesiAnon } from '@/lib/supabaseClient'
import { ambilPod, ambilSesiById, cariPemainTersimpan, langgananSesi } from '@/lib/api'
import { JoinScreen } from '@/components/JoinScreen'
import { WaitingRoom } from '@/components/WaitingRoom'
import { PuskesmasScreen } from '@/components/PuskesmasScreen'
import { GMConsole } from '@/components/GMConsole'
import type { GameSession, PodState, Player } from '@/lib/types'

const KUNCI_RESUME = 'primer-arena:pemain'

interface KeadaanBergabung {
  session: GameSession
  pod: PodState
  player: Player
}

export default function App() {
  const [authUid, setAuthUid] = useState<string | null>(null)
  const [keadaan, setKeadaan] = useState<KeadaanBergabung | null>(null)

  const modeGm = new URLSearchParams(window.location.search).get('gm') === '1'

  useEffect(() => {
    pastikanSesiAnon().then(setAuthUid)
  }, [])

  useEffect(() => {
    if (modeGm || keadaan) return
    const simpanan = localStorage.getItem(KUNCI_RESUME)
    if (!simpanan) return
    try {
      const { sessionId, nim } = JSON.parse(simpanan) as { sessionId: string; nim: string }
      cariPemainTersimpan(sessionId, nim).then(async (player) => {
        if (!player?.pod_id) return
        const [session, pod] = await Promise.all([ambilSesiById(sessionId), ambilPod(player.pod_id)])
        if (session && pod) setKeadaan({ session, pod, player })
      })
    } catch {
      localStorage.removeItem(KUNCI_RESUME)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!keadaan) return
    return langgananSesi(keadaan.session.id, (sesi) => {
      setKeadaan((prev) => (prev ? { ...prev, session: sesi } : prev))
    })
  }, [keadaan?.session.id])

  function onGabung(hasil: KeadaanBergabung) {
    setKeadaan(hasil)
    localStorage.setItem(
      KUNCI_RESUME,
      JSON.stringify({ sessionId: hasil.session.id, nim: hasil.player.nim })
    )
  }

  if (modeGm) return <GMConsole />

  if (!keadaan) {
    return <JoinScreen authUid={authUid} onGabung={onGabung} />
  }

  if (keadaan.session.phase === 'lobby' || keadaan.session.phase === 'intro') {
    return <WaitingRoom session={keadaan.session} pod={keadaan.pod} player={keadaan.player} />
  }

  if (keadaan.session.phase === 'round') {
    return <PuskesmasScreen pod={keadaan.pod} player={keadaan.player} />
  }

  return (
    <div className="layar-tengah">
      <h1>Sesi selesai</h1>
      <p className="subjudul">Fase: {keadaan.session.phase}. Terima kasih — lanjut ke sesi Refleksi bersama dosen.</p>
    </div>
  )
}
