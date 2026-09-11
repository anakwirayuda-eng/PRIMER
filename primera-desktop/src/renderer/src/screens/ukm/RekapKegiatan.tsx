import { useGame } from '../../store'
import type { HasilKegiatan } from '@engine/kegiatan'
import { kartuPosyandu } from '@engine/kegiatan'
import { Rng } from '@engine/core/rng'
import { KoreksiKader } from './KoreksiKader'

export function RekapKegiatan({ hasil }: { hasil: HasilKegiatan }) {
  const state = useGame((s) => s.state)!
  const rekap = useGame((s) => s.rekapUkm)
  const cuplikan = rekap?.hari === state.hari && rekap.jenis === hasil.jenis && rekap.rw === hasil.rw
    && hasil.jawaban.every((j) => rekap.kartu?.some((k) => k.id === j.kartuId)) ? rekap : null
  const hariPosyandu = hasil.rw === undefined ? undefined : state.posyanduRwTerakhir[String(hasil.rw)]
  const dek = cuplikan?.kartu ?? (hasil.jenis === 'posyandu' && hariPosyandu !== undefined && hasil.rw !== undefined
    ? kartuPosyandu(new Rng(state.seedKurikulum, 'posyandu', hariPosyandu, hasil.rw)) : [])
  return <section className="ukm-rekap" aria-label="Rekap keputusan kegiatan">
    <h2 className="judul-seksi">Keputusan dalam sesi ini</h2>
    {!cuplikan && <p className="teks-xs teks-lembut">Jawaban tersimpan. Rincian siapa yang menjawab tidak tersedia setelah sesi dimuat ulang.</p>}
    <ol>{hasil.jawaban.map((j, i) => {
      const kartu = dek.find((k) => k.id === j.kartuId)
      const pilihan = kartu?.pilihan.find((p) => p.id === j.pilihanId)
      const pelaksana = cuplikan?.dijawabDokter === undefined ? 'Pelaksana tidak tercatat' : i < cuplikan.dijawabDokter ? 'Dokter' : 'Delegasi kader'
      return <li key={j.kartuId}><div className="baris baris--antara"><b>{kartu?.judul ?? `Keputusan ${i + 1}`}</b><span className={`chip ${j.benar ? 'chip--daun' : 'chip--merah'}`}>{j.benar ? 'Tepat' : 'Keliru'}</span></div>
        <p className="teks-xs teks-lembut">{pelaksana}</p>
        {pilihan && <details className="lab-details"><summary>Lihat keputusan dan pembahasan</summary><p>{pilihan.label}</p><p>{pilihan.respons}</p></details>}
      </li>
    })}</ol>
    <KoreksiKader jenis={hasil.jenis} rw={hasil.rw} />
  </section>
}
