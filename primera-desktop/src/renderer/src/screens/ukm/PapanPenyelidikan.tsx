import { useState } from 'react'
import { useGame } from '../../store'
import { PACK } from '@content/index'
import { JENDELA_SURVEILANS } from '@engine/surveilans'
import { catatanPenyelidikan } from './lab2View'
import './Lab2.css'

export function PapanPenyelidikan({ kasusId, rw }: { kasusId: string; rw: number }) {
  const state = useGame((s) => s.state)!
  const [semuaRw, setSemuaRw] = useState(false)
  const [buka, setBuka] = useState(true)
  const semua = catatanPenyelidikan(state.desa.surveilans, state.hari, kasusId)
  const orang = semua.filter((o) => semuaRw || o.rw === rw)
  const rwTercatat = [...new Set(semua.map((o) => o.rw))].sort((a, b) => a - b)
  const hariAwal = Math.max(1, state.hari - JENDELA_SURVEILANS + 1)
  const hari = Array.from({ length: state.hari - hariAwal + 1 }, (_, i) => hariAwal + i)
  return <section className="lab-investigation kertas" aria-label="Papan penyelidikan">
    <header className="lab-heading"><div><span className="lab-kicker mono">PAPAN PENYELIDIKAN</span><h2>Orang. Tempat. Waktu.</h2></div>
      <button className="tombol tombol--senyap" aria-expanded={buka} onClick={() => setBuka(!buka)}>{buka ? 'Ringkas papan' : 'Buka papan'}</button>
    </header>
    <p className="lab-sub">{PACK.kasus[kasusId]?.nama ?? kasusId} · RW {rw} · catatan hari {hariAwal}–{state.hari}</p>
    {buka && <>
      <div className="lab-filters" role="group" aria-label="Wilayah penyelidikan">
        <button aria-pressed={!semuaRw} onClick={() => setSemuaRw(false)}>RW {rw}</button>
        <button aria-pressed={semuaRw} onClick={() => setSemuaRw(true)}>Bandingkan seluruh RW</button>
      </div>
      <div className="lab-investigation__stats"><span><strong>{orang.length}</strong> identitas/entri berbeda</span><span><strong>{orang.reduce((n, o) => n + o.hari.length, 0)}</strong> kunjungan tercatat</span></div>
      {orang.length === 0 ? <p className="lab-sub">Belum ada catatan pasien pada wilayah ini.</p> : <>
        <figure className="lab-curve"><figcaption>Hari pertama tercatat per identitas/entri · bukan tanggal awal gejala</figcaption><div className="lab-curve__bars">
          {hari.map((h) => { const n = orang.filter((o) => o.hari[0] === h).length; const max = Math.max(1, ...hari.map((d) => orang.filter((o) => o.hari[0] === d).length)); return <div key={h} aria-label={`Hari ${h}: ${n} identitas/entri`}><b>{n || ''}</b><span style={{ height: `${n / max * 62 + 2}px` }} /><small>{h}</small></div> })}
        </div></figure>
        <div className="lab-table-wrap"><table className="lab-table"><caption>Daftar pasien yang sudah tercatat di poli</caption><thead><tr><th scope="col">Pasien</th><th scope="col">RW</th><th scope="col">Hari tercatat</th></tr></thead><tbody>
          {orang.map((o) => <tr key={o.id}><th scope="row">{o.nama}</th><td>{o.rw}</td><td>{o.hari.join(', ')}{o.hari.length > 1 && <span className="chip">Kunjungan ulang</span>}</td></tr>)}
        </tbody></table></div>
      </>}
      {semuaRw && <p className="lab-sub">Wilayah dengan catatan: {rwTercatat.map((r) => `RW ${r}`).join(', ') || 'belum ada'}.</p>}
      <p className="lab-investigation__note">Sinyal belum menetapkan KLB. Bandingkan pola catatan sebelum memilih langkah. Entri tanpa nama belum bisa dipastikan berasal dari orang yang berbeda.</p>
    </>}
  </section>
}
