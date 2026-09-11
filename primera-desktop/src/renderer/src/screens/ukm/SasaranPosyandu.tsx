import type { GameState } from '@engine/state'
import { sasaranKia } from './rencanaUkm'
import { LABEL_INDIKATOR } from '../peta/petaUtil'
import './Lab2.css'

export function SasaranPosyandu({ state, rw }: { state: GameState; rw: number }) {
  const sasaran = sasaranKia(state, rw)
  const jumlah = sasaran.reduce((n, k) => n + k.kolom.length, 0)
  return <section className="ukm-sasaran" aria-label={`Sasaran Posyandu RW ${rw}`}>
    <strong className="lab-kicker">SASARAN POSYANDU</strong>
    <p className="teks-kecil">{jumlah > 0
      ? <><b>{jumlah} kolom kesehatan ibu dan anak</b> pada {sasaran.length} keluarga masih berupa laporan kader.</>
      : 'Tidak ada kolom kesehatan ibu dan anak berlaporan kader di RW ini. Sesi tidak memutakhirkan data keluarga; keputusan tepat tetap berkontribusi pada IKS wilayah.'}</p>
    {jumlah > 0 && <details className="lab-details"><summary>Lihat keluarga dan batas cakupan</summary>
      <p>Meja ditentukan saat sesi dimulai. Tidak semua kolom ini pasti tercocokkan dalam satu sesi.</p>
      <ul>{sasaran.map((k) => <li key={k.id}><b>{k.nama}</b>: {k.kolom.map((ind) => LABEL_INDIKATOR[ind].penuh).join('; ')}.</li>)}</ul>
    </details>}
  </section>
}
