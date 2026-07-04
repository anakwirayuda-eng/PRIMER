import { useState } from 'react'
import { cariSesi, daftarPod, gabungSebagaiPemain } from '@/lib/api'
import type { GameSession, PodState, Player } from '@/lib/types'

const JUMLAH_KURSI_PER_POD = 6

interface Props {
  authUid: string | null
  onGabung: (params: { session: GameSession; pod: PodState; player: Player }) => void
}

export function JoinScreen({ authUid, onGabung }: Props) {
  const [langkah, setLangkah] = useState<'kode' | 'kursi'>('kode')
  const [kode, setKode] = useState('')
  const [nim, setNim] = useState('')
  const [nama, setNama] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [memuat, setMemuat] = useState(false)

  const [session, setSession] = useState<GameSession | null>(null)
  const [pods, setPods] = useState<PodState[]>([])
  const [podDipilih, setPodDipilih] = useState<PodState | null>(null)
  const [kursiTerisi, setKursiTerisi] = useState<Set<string>>(new Set())

  async function cariSesiDanPod(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!kode.trim() || !nim.trim() || !nama.trim()) {
      setError('Kode sesi, NIM, dan nama wajib diisi.')
      return
    }
    setMemuat(true)
    try {
      const sesi = await cariSesi(kode)
      if (!sesi) {
        setError(`Sesi dengan kode "${kode.toUpperCase()}" tidak ditemukan.`)
        return
      }
      const daftarKabupaten = await daftarPod(sesi.id)
      if (daftarKabupaten.length === 0) {
        setError('Sesi ini belum punya kabupaten (pod). Hubungi dosen/GM.')
        return
      }
      setSession(sesi)
      setPods(daftarKabupaten)
      setLangkah('kursi')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghubungi server.')
    } finally {
      setMemuat(false)
    }
  }

  async function pilihKabupaten(pod: PodState) {
    setPodDipilih(pod)
    setKursiTerisi(new Set())
  }

  async function ambilKursi(nomorKursi: number) {
    if (!session || !podDipilih) return
    setError(null)
    setMemuat(true)
    const seat = `puskesmas_${nomorKursi}`
    try {
      const hasil = await gabungSebagaiPemain({
        sessionId: session.id,
        podId: podDipilih.id,
        nim,
        nama,
        seat,
        authUid,
      })
      if (!hasil.ok || !hasil.player) {
        setKursiTerisi((prev) => new Set(prev).add(seat))
        setError('Kursi itu baru saja diambil peserta lain — pilih kursi lain.')
        return
      }
      onGabung({ session, pod: podDipilih, player: hasil.player })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal bergabung.')
    } finally {
      setMemuat(false)
    }
  }

  if (langkah === 'kode') {
    return (
      <div className="layar-tengah">
        <h1>PRIMERA Arena</h1>
        <p className="subjudul">Kompetisi kelas real-time — rebutan bed RS kabupaten.</p>
        <form onSubmit={cariSesiDanPod} className="form-join">
          <label>
            Kode Sesi
            <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="mis. FK2026A" autoFocus />
          </label>
          <label>
            NIM
            <input value={nim} onChange={(e) => setNim(e.target.value)} placeholder="NIM Anda" />
          </label>
          <label>
            Nama
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama lengkap" />
          </label>
          {error && <p className="pesan-error">{error}</p>}
          <button type="submit" disabled={memuat}>
            {memuat ? 'Mencari sesi…' : 'Cari Sesi'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="layar-tengah">
      <h1>Pilih Kabupaten &amp; Kursi</h1>
      {!podDipilih ? (
        <div className="grid-pod">
          {pods.map((p) => (
            <button key={p.id} className="kartu-pod" onClick={() => pilihKabupaten(p)}>
              {p.nama}
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className="subjudul">{podDipilih.nama} — pilih kursi Puskesmas Anda</p>
          <div className="grid-kursi">
            {Array.from({ length: JUMLAH_KURSI_PER_POD }, (_, i) => i + 1).map((n) => {
              const seat = `puskesmas_${n}`
              const diambil = kursiTerisi.has(seat)
              return (
                <button key={seat} className="kartu-kursi" disabled={diambil || memuat} onClick={() => ambilKursi(n)}>
                  Puskesmas {n}
                  {diambil && <span className="label-diambil"> (terisi)</span>}
                </button>
              )
            })}
          </div>
          <button className="tombol-kembali" onClick={() => setPodDipilih(null)}>
            ← Ganti kabupaten
          </button>
        </>
      )}
      {error && <p className="pesan-error">{error}</p>}
    </div>
  )
}
