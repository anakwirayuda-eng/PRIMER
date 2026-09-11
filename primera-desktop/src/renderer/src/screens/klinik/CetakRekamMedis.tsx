import { useRef, useState } from 'react'
import type { EncounterState } from '@engine/state'
import type { KasusKlinis } from '@content/types'
import { LembarPeriksa, nomorRmTampilan } from './LembarPeriksa'
import { unduhDokumen } from '../../utils/unduhDokumen'
import { useGame } from '../../store'

export function CetakRekamMedis({ enc, kasus }: { enc: EncounterState; kasus: KasusKlinis }) {
  const dokter = useGame((s) => s.state?.namaDokter ?? '')
  const hari = useGame((s) => s.state?.hari)
  const isi = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('')
  const [sibuk, setSibuk] = useState(false)
  async function unduh() {
    if (!isi.current || sibuk) return
    setSibuk(true); setStatus('Menyiapkan dokumen…')
    try { setStatus(await unduhDokumen(isi.current.innerHTML, `PRIMERA ${nomorRmTampilan(enc.pasien.id)}`)) }
    catch { setStatus('Dokumen gagal dibuat. Coba unduh lagi.') }
    finally { setSibuk(false) }
  }
  return <section className="klinik-cetak">
    <button className="tombol" disabled={sibuk} onClick={() => void unduh()}>Unduh rekam medis</button>
    <span className="teks-xs" role="status">{status}</span>
    <div ref={isi} hidden aria-hidden="true">
      <header><h1>Puskesmas Sukamaju</h1><p>Rekam medis simulasi PRIMERA · Hari {hari} · dr. {dokter}</p></header>
      <LembarPeriksa enc={enc} kasus={kasus} dispatch={() => {}} />
      <section><h2>Disposisi</h2><p>{enc.disposisi ?? 'Tidak tercatat'}</p>
        {enc.sbar && <><h2>SBAR yang ditulis dokter</h2><p>Situasi: {enc.sbar.situation}</p><p>Latar belakang: {enc.sbar.background}</p><p>Asesmen: {enc.sbar.assessment}</p><p>Rekomendasi: {enc.sbar.recommendation}</p></>}
      </section>
      <footer>Dokumen simulasi pendidikan. Memuat pemeriksaan, keputusan, dan rencana yang tercatat pada konsultasi ini. Dosis yang tidak dicatat dalam simulasi tidak ditambahkan.</footer>
    </div>
  </section>
}
