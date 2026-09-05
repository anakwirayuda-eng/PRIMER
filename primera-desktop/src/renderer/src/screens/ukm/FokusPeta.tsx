import { useState } from 'react'
import { useGame } from '../../store'
import { PACK } from '@content/index'
import { clusterAktif } from '@engine/surveilans'
import { hitungTindakLanjutRw, type LapisanPeta } from './lab2View'
import './Lab2.css'

export function FokusPeta({ lapisan, onLapisan, onKeluarga, onRw }: {
  lapisan: LapisanPeta; onLapisan: (l: LapisanPeta) => void; onKeluarga: (id: string) => void; onRw: (rw: number) => void
}) {
  const state = useGame((s) => s.state)!
  const [cari, setCari] = useState('')
  const sinyal = clusterAktif(state, PACK)
  const daftar = state.desa.rw.map((r) => ({ rw: r.nomor, jumlah: lapisan === 'tindak_lanjut'
    ? hitungTindakLanjutRw(state, r.nomor) : sinyal.filter((c) => c.rw === r.nomor).length }))
    .filter((r) => r.jumlah > 0).sort((a, b) => b.jumlah - a.jumlah || a.rw - b.rw)
  const hasil = cari.trim() ? Object.values(PACK.keluarga).filter((k) => k.namaKeluarga.toLocaleLowerCase('id').includes(cari.trim().toLocaleLowerCase('id'))) : []
  return <div className="lab-map-focus">
    <div className="lab-filters" role="group" aria-label="Fokus peta">
      {([['cakupan', 'Cakupan data'], ['tindak_lanjut', 'Tindak lanjut'], ['sinyal', 'Sinyal kluster']] as const).map(([l, label]) => <button key={l} aria-pressed={lapisan === l} onClick={() => onLapisan(l)}>{label}</button>)}
    </div>
    <p className="lab-sub">{lapisan === 'cakupan' ? 'Kenali wilayah yang datanya masih tipis sebelum menilai kondisinya.' : lapisan === 'tindak_lanjut' ? 'Angka petak menunjukkan episode aktif. Warna tetap menunjukkan IKS tercatat.' : 'Angka petak menunjukkan sinyal kluster aktif. Verifikasi diperlukan sebelum penetapan KLB.'}</p>
    {lapisan !== 'cakupan' && <div className="lab-map-signals" aria-live="polite">
      {daftar.length === 0 ? <span>Belum ada {lapisan === 'tindak_lanjut' ? 'episode aktif' : 'sinyal kluster'} tercatat.</span> : daftar.map((r) => <button className="chip" key={r.rw} onClick={() => onRw(r.rw)}>RW {r.rw} · {r.jumlah} {lapisan === 'tindak_lanjut' ? 'episode' : 'sinyal'} →</button>)}
    </div>}
    <label className="lab-search"><span className="mono">CARI KELUARGA</span><input type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Nama keluarga…" /></label>
    {cari.trim() && <div className="lab-search-results" aria-label="Hasil pencarian keluarga">
      {hasil.length === 0 ? <p>Tidak ada keluarga dengan nama tersebut.</p> : hasil.map((k) => <button className="tombol tombol--senyap" key={k.id} onClick={() => { onKeluarga(k.id); setCari('') }}>{k.namaKeluarga} · RW {k.rw} →</button>)}
    </div>}
  </div>
}
