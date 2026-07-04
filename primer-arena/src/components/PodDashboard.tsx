import type { PodState } from '@/lib/types'

interface Props {
  pod: PodState
}

/** Dasbor kolam bed komons (murni tampilan) — dipakai di layar pemain & proyektor GM. */
export function PodDashboard({ pod }: Props) {
  return (
    <div className="pod-dashboard">
      <h2>{pod.nama} — Kolam Bed Komons</h2>
      {pod.tak_tertangani > 0 && (
        <p className="pesan-peringatan">{pod.tak_tertangani} rujukan tak tertangani (kadaluarsa menunggu bed).</p>
      )}
      <div className="daftar-rs">
        {Object.entries(pod.rs_beds).map(([rsId, rs]) => {
          const persen = rs.bedTotal === 0 ? 0 : Math.round((rs.bedTerpakai / rs.bedTotal) * 100)
          const penuh = rs.bedTerpakai >= rs.bedTotal
          return (
            <div key={rsId} className={`kartu-rs${penuh ? ' kartu-rs--penuh' : ''}`}>
              <div className="kartu-rs__header">
                <strong>{rs.nama}</strong>
                <span className="label-kelas">Kelas {rs.kelas}</span>
              </div>
              <p className="kartu-rs__spesialisasi">{rs.spesialisasi.join(', ')}</p>
              <div className="bar-bed">
                <div className="bar-bed__isi" style={{ width: `${persen}%` }} />
              </div>
              <p className="bar-bed__label">
                {rs.bedTerpakai} / {rs.bedTotal} bed {penuh && '— PENUH'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
