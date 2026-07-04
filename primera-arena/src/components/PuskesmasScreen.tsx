import { useEffect, useState } from 'react'
import { langgananPod, langgananReferralPemain, putuskanRujuk, putuskanTuntas, referralAktifUntukPemain } from '@/lib/api'
import { PodDashboard } from './PodDashboard'
import type { HasilNilai } from '@/lib/penilaian'
import type { PodState, Player, Referral } from '@/lib/types'

interface Props {
  pod: PodState
  player: Player
}

const LABEL_KEGAWATAN: Record<Referral['pasien']['kegawatan'], string> = {
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'TINGGI',
}

export function PuskesmasScreen({ pod, player }: Props) {
  const [referral, setReferral] = useState<Referral | null>(null)
  const [podTerkini, setPodTerkini] = useState(pod)
  const [umpanBalik, setUmpanBalik] = useState<HasilNilai | null>(null)
  const [memutuskan, setMemutuskan] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let batal = false
    referralAktifUntukPemain(player.id).then((r) => {
      if (!batal) setReferral(r)
    })
    const lepas = langgananReferralPemain(player.id, (r) => {
      setReferral(r)
      if (r.status === 'baru') setUmpanBalik(null)
    })
    return () => {
      batal = true
      lepas()
    }
  }, [player.id])

  useEffect(() => {
    setPodTerkini(pod)
    return langgananPod(pod.id, setPodTerkini)
  }, [pod.id])

  async function tuntaskan() {
    if (!referral) return
    setMemutuskan(true)
    setError(null)
    try {
      await putuskanTuntas(referral)
      setUmpanBalik({ score: 0, alasan: 'Menunggu evaluasi…' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mencatat keputusan.')
    } finally {
      setMemutuskan(false)
    }
  }

  async function rujuk(rsId: string) {
    if (!referral) return
    const rs = podTerkini.rs_beds[rsId]
    setMemutuskan(true)
    setError(null)
    try {
      const hasil = await putuskanRujuk(referral, rsId, rs?.spesialisasi ?? [])
      setUmpanBalik(hasil.nilai)
      if (!hasil.klaim.ok && hasil.klaim.reason === 'penuh') {
        setError(`${rs?.nama ?? rsId} penuh — coba RS lain atau tunggu bed kosong.`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal klaim bed.')
    } finally {
      setMemutuskan(false)
    }
  }

  const sudahDiputuskan = referral?.status && referral.status !== 'baru' && referral.status !== 'menunggu_bed'
  const menungguBed = referral?.status === 'menunggu_bed'

  return (
    <div className="layar-puskesmas">
      <header className="layar-puskesmas__header">
        <h1>Puskesmas {player.seat?.replace('puskesmas_', '')}</h1>
        <p className="subjudul">{player.nama} · Ronde {referral?.round ?? podTerkini.tak_tertangani === 0 ? '' : ''}</p>
      </header>

      <section className="kartu-pasien-panel">
        {!referral && <p>Menunggu kartu pasien berikutnya dari dosen/GM…</p>}
        {referral && (
          <>
            <h2>{referral.pasien.nama}</h2>
            <p>
              Usia {referral.pasien.usia} th · ICD-10 {referral.pasien.icd10} · Kegawatan:{' '}
              <strong className={`label-kegawatan label-kegawatan--${referral.pasien.kegawatan}`}>
                {LABEL_KEGAWATAN[referral.pasien.kegawatan]}
              </strong>
            </p>
            <p className="kartu-pasien__keluhan">{referral.pasien.keluhan}</p>
            <p className="kartu-pasien__butuh">Kebutuhan spesialisasi: {referral.pasien.spesialisasiButuh}</p>

            {!sudahDiputuskan && !menungguBed && (
              <div className="aksi-keputusan">
                <button disabled={memutuskan} onClick={tuntaskan}>
                  Tuntaskan di Puskesmas
                </button>
                <p className="label-atau">atau rujuk ke:</p>
                <div className="pilihan-rs">
                  {Object.entries(podTerkini.rs_beds).map(([rsId, rs]) => (
                    <button
                      key={rsId}
                      disabled={memutuskan}
                      className="tombol-rs"
                      onClick={() => rujuk(rsId)}
                    >
                      {rs.nama} ({rs.bedTotal - rs.bedTerpakai} bed kosong)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {menungguBed && (
              <div className="status-menunggu">
                <p>RS tujuan penuh — pilih RS lain:</p>
                <div className="pilihan-rs">
                  {Object.entries(podTerkini.rs_beds).map(([rsId, rs]) => (
                    <button key={rsId} disabled={memutuskan} className="tombol-rs" onClick={() => rujuk(rsId)}>
                      {rs.nama} ({rs.bedTotal - rs.bedTerpakai} bed kosong)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {umpanBalik && (
              <p className={`umpan-balik umpan-balik--${umpanBalik.score >= 1 ? 'baik' : umpanBalik.score < 0 ? 'buruk' : 'netral'}`}>
                {umpanBalik.alasan}
              </p>
            )}
            {error && <p className="pesan-error">{error}</p>}
          </>
        )}
      </section>

      <PodDashboard pod={podTerkini} />
    </div>
  )
}
