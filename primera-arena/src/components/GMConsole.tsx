import { useEffect, useState } from 'react'
import { bagikanKartu, buatPod, buatSesi, daftarPod, ubahFaseSesi } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import { langgananPemainPod } from '@/lib/api'
import { RS_KOMONS_DEFAULT } from '@/data/rumahSakit'
import { kartuAcak } from '@/data/kasus'
import { PodDashboard } from './PodDashboard'
import type { GameSession, PodState, Player } from '@/lib/types'

const JUMLAH_POD_DEFAULT = 2

export function GMConsole() {
  const [session, setSession] = useState<GameSession | null>(null)
  const [pods, setPods] = useState<PodState[]>([])
  const [kode, setKode] = useState('')
  const [nama, setNama] = useState('Sesi PRIMERA Arena')
  const [memuat, setMemuat] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buatSesiBaru(e: React.FormEvent) {
    e.preventDefault()
    if (!kode.trim()) {
      setError('Kode sesi wajib diisi (mis. FK2026A) — ini yang dibagikan ke mahasiswa.')
      return
    }
    setMemuat(true)
    setError(null)
    try {
      const sesiBaru = await buatSesi(kode, nama)
      const podBaru: PodState[] = []
      for (let i = 1; i <= JUMLAH_POD_DEFAULT; i++) {
        const p = await buatPod(sesiBaru.id, i, `Kabupaten ${i}`, structuredClone(RS_KOMONS_DEFAULT))
        podBaru.push(p)
      }
      setSession(sesiBaru)
      setPods(podBaru)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat sesi (mungkin kode sudah dipakai).')
    } finally {
      setMemuat(false)
    }
  }

  async function mulaiRonde() {
    if (!session) return
    await ubahFaseSesi(session.id, 'round', session.round + 1)
    setSession({ ...session, phase: 'round', round: session.round + 1 })
  }

  if (!session) {
    return (
      <div className="layar-tengah">
        <h1>GM Console — PRIMERA Arena</h1>
        <form onSubmit={buatSesiBaru} className="form-join">
          <label>
            Kode Sesi (dibagikan ke mahasiswa)
            <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="mis. FK2026A" autoFocus />
          </label>
          <label>
            Nama Sesi
            <input value={nama} onChange={(e) => setNama(e.target.value)} />
          </label>
          {error && <p className="pesan-error">{error}</p>}
          <button type="submit" disabled={memuat}>
            {memuat ? 'Membuat…' : 'Buat Sesi'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="layar-gm">
      <header>
        <h1>{session.nama}</h1>
        <p className="subjudul">
          Kode: <strong>{session.kode}</strong> · Fase: {session.phase} · Ronde: {session.round}
        </p>
        {session.phase === 'lobby' && <button onClick={mulaiRonde}>Mulai Ronde 1</button>}
        {session.phase === 'round' && (
          <button onClick={mulaiRonde}>Mulai Ronde {session.round + 1}</button>
        )}
      </header>
      <div className="grid-pod-gm">
        {pods.map((p) => (
          <PodPanel key={p.id} sesi={session} pod={p} />
        ))}
      </div>
    </div>
  )
}

function PodPanel({ sesi, pod }: { sesi: GameSession; pod: PodState }) {
  const [pemain, setPemain] = useState<Player[]>([])
  const [podTerkini, setPodTerkini] = useState(pod)

  useEffect(() => {
    let batal = false
    async function muat() {
      const { data } = await supabase.from('players').select('*').eq('pod_id', pod.id).order('seat')
      if (!batal) setPemain((data ?? []) as Player[])
    }
    muat()
    const lepas = langgananPemainPod(pod.id, muat)
    return () => {
      batal = true
      lepas()
    }
  }, [pod.id])

  useEffect(() => {
    const lepas = supabase
      .channel(`gm:pod:${pod.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'pod_states', filter: `id=eq.${pod.id}` },
        (payload) => setPodTerkini(payload.new as PodState)
      )
      .subscribe()
    return () => {
      supabase.removeChannel(lepas)
    }
  }, [pod.id])

  async function kirimKartu(player: Player) {
    await bagikanKartu({
      sessionId: sesi.id,
      podId: pod.id,
      playerId: player.id,
      round: sesi.round,
      pasien: kartuAcak(Math.random),
    })
  }

  return (
    <section className="panel-pod-gm">
      <h2>{pod.nama}</h2>
      <ul className="daftar-rekan">
        {pemain.length === 0 && <li>Belum ada mahasiswa bergabung.</li>}
        {pemain.map((p) => (
          <li key={p.id}>
            {p.seat} — {p.nama}
            <button className="tombol-kecil" onClick={() => kirimKartu(p)}>
              Kirim kartu pasien
            </button>
          </li>
        ))}
      </ul>
      <PodDashboard pod={podTerkini} />
    </section>
  )
}
