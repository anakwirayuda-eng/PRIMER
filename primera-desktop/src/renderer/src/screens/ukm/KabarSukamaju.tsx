import { useState } from 'react'
import { useGame } from '../../store'
import { HARI_BUKA_PETA } from '@engine/reducer'
import { PACK } from '@content/index'
import { episodePrioritas, episodeTuntas, labelJanji } from './lab2View'
import './Lab2.css'

export function KabarSukamaju() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const setTarget = useGame((s) => s.setPetaTargetKeluargaId)
  const [semua, setSemua] = useState(false)
  const [lihatSelesai, setLihatSelesai] = useState(false)
  const aktif = episodePrioritas(state.careEpisodes)
  const selesai = state.careEpisodes.filter(episodeTuntas).sort((a, b) => b.updatedDay - a.updatedDay || a.id.localeCompare(b.id))
  if (aktif.length + selesai.length === 0) return null
  const riwayat = lihatSelesai || aktif.length === 0
  const cerita = riwayat ? selesai : aktif
  return (
    <section className="lab-kabar kertas" aria-label="Kabar Sukamaju">
      <header className="lab-heading">
        <div><span className="lab-kicker mono">KABAR SUKAMAJU</span><h2>{riwayat ? 'Kabar setelah tindak lanjut' : 'Cerita yang belum selesai'}</h2></div>
        <span className="lab-count mono">{cerita.length}<small>{riwayat ? 'selesai' : 'aktif'}</small></span>
      </header>
      <p className="lab-sub">{riwayat ? 'Hasil yang sudah tercatat tetap bisa dibaca kembali, termasuk tindak lanjut yang berakhir tanpa pemulihan.' : 'Keputusan kemarin masih berjalan. Siapa yang perlu kamu temui kembali?'}</p>
      {aktif.length > 0 && selesai.length > 0 && <div className="baris" role="group" aria-label="Jenis kabar">
        <button className="tombol tombol--senyap" aria-pressed={!riwayat} onClick={() => { setLihatSelesai(false); setSemua(false) }}>Berjalan ({aktif.length})</button>
        <button className="tombol tombol--senyap" aria-pressed={riwayat} onClick={() => { setLihatSelesai(true); setSemua(false) }}>Selesai ({selesai.length})</button>
      </div>}
      <div className="lab-kabar__list">
        {(semua ? cerita : cerita.slice(0, 2)).map((e) => (
          <article className={`lab-story ${!riwayat && e.dueDay !== undefined && e.dueDay < state.hari ? 'lab-story--lewat' : ''}`} key={e.id}>
            <div className="lab-story__meta"><span className="mono">{e.rw ? `RW ${e.rw}` : 'JEJARING'}</span><span>{labelJanji(e, state.hari)}</span></div>
            <h3>{e.subjectName}</h3>
            <p className="lab-story__problem">{e.problemLabel}</p>
            <p className="lab-story__next"><span aria-hidden>↳ </span>{riwayat ? e.receipt.feedback ?? e.receipt.next : e.nextAction}</p>
            <details className="lab-details"><summary>Jejak keputusan</summary>
              <p><b>Sinyal awal:</b> {e.receipt.signal}</p>
              {e.receipt.decision && <p><b>Keputusan:</b> {e.receipt.decision}</p>}
              {e.receipt.feedback && <p><b>Kabar terakhir:</b> {e.receipt.feedback}</p>}
            </details>
            {e.familyId && PACK.keluarga[e.familyId] && <button className="tombol tombol--senyap" disabled={state.hari < HARI_BUKA_PETA}
              title={state.hari < HARI_BUKA_PETA ? `Peta terbuka hari ${HARI_BUKA_PETA}.` : undefined}
              onClick={() => { setTarget(e.familyId!); dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' }) }}>
              Temukan {PACK.keluarga[e.familyId]!.namaKeluarga} →
            </button>}
          </article>
        ))}
      </div>
      {cerita.length > 2 && <button className="tombol tombol--senyap" aria-expanded={semua} onClick={() => setSemua(!semua)}>
        {semua ? 'Ringkas cerita' : `Lihat ${cerita.length - 2} cerita lainnya`}
      </button>}
    </section>
  )
}
