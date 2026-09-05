import { useState } from 'react'
import { useGame } from '../../store'
import { useFocusTrap } from '../../useFocusTrap'
import { PACK } from '@content/index'
import { profilRumah } from '../kunjungan/visualProfiles'
import { labelJanji } from './lab2View'
import './Lab2.css'

export function AlbumKeluarga({ onKeluarga }: { onKeluarga: (id: string) => void }) {
  const state = useGame((s) => s.state)!
  const [buka, setBuka] = useState(false)
  const ref = useFocusTrap<HTMLDivElement>(buka, () => setBuka(false))
  const ids = [...new Set([...state.desa.binaan, ...state.careEpisodes.flatMap((e) => e.familyId ? [e.familyId] : [])])].filter((id) => PACK.keluarga[id])
  return <>
    <button className="lab-album-launch kertas" onClick={() => setBuka(true)} aria-haspopup="dialog"><span><span className="lab-kicker mono">ALBUM KELUARGA</span><strong>Wajah di balik angka</strong></span><span className="mono">{ids.length} keluarga →</span></button>
    {buka && <div className="overlay" onMouseDown={() => setBuka(false)}>
      <div className="modal lab-album" ref={ref} role="dialog" aria-modal="true" aria-label="Album Keluarga Sukamaju" onMouseDown={(e) => e.stopPropagation()}>
        <header className="lab-heading"><div><span className="lab-kicker mono">ALBUM KELUARGA</span><h2>Wajah di balik angka</h2><p className="lab-sub">Catatan hubungan, keputusan, dan kabar yang benar-benar sudah terjadi.</p></div><button className="tombol tombol--senyap" onClick={() => setBuka(false)} aria-label="Tutup album keluarga">Tutup ×</button></header>
        {ids.length === 0 && <p>Kenali keluarga di peta dan jadikan binaan untuk mulai mengisi album ini.</p>}
        <div className="lab-album__grid">{ids.map((id) => {
          const k = PACK.keluarga[id]!
          const foto = profilRumah(id)
          const episodes = state.careEpisodes.filter((e) => e.familyId === id).sort((a, b) => b.updatedDay - a.updatedDay)
          return <article key={id} className="lab-family">
            <div className="lab-family__photo" role="img" aria-label={foto.label} style={{ backgroundImage: `url(${foto.src})`, backgroundPosition: foto.posisi }} />
            <div className="lab-family__body"><span className="lab-kicker mono">RW {k.rw} · {state.desa.binaan.includes(id) ? 'KELUARGA BINAAN' : 'JEJAK PERAWATAN'}</span><h3>{k.namaKeluarga}</h3>
              {episodes.length === 0 && <p className="lab-sub">Cerita baru dimulai. Belum ada episode perawatan tercatat.</p>}
              {episodes.map((e) => <details className="lab-details" key={e.id}><summary>{e.problemLabel}<span className="lab-family__status">{labelJanji(e, state.hari)}</span></summary><ol className="lab-timeline">
                {e.history.map((h, i) => <li key={`${h.hari}:${i}`}><span className="mono">HARI {h.hari}</span><b>{h.label}</b><p>{h.detail}</p></li>)}
              </ol></details>)}
              <button className="tombol tombol--utama" onClick={() => { setBuka(false); onKeluarga(id) }}>Buka kartu keluarga →</button>
            </div>
          </article>
        })}</div>
      </div>
    </div>}
  </>
}
