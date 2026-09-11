import { useState } from 'react'
import type { CareEpisodeLite } from '@engine/state'
import { unduhDokumen } from '../../utils/unduhDokumen'
import { teksIndikator } from './rencanaUkm'

const aman = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
export function htmlRingkasanEpisode(episode: CareEpisodeLite): string {
  const p = (label: string, isi?: string) => `<p><b>${label}:</b> ${aman(teksIndikator(isi ?? 'Tidak tercatat'))}</p>`
  return `<header><h1>Ringkasan episode perawatan</h1><p>Puskesmas Sukamaju · Simulasi PRIMERA</p></header><h2>${aman(episode.subjectName)}</h2>${p('Masalah', episode.problemLabel)}${p('Sinyal', episode.receipt.signal)}${p('Keputusan', episode.receipt.decision)}${p('Umpan balik', episode.receipt.feedback)}${p('Langkah berikutnya', episode.receipt.next)}<h2>Riwayat tercatat</h2><ol>${episode.history.map((e) => `<li>Hari ${e.hari} · <b>${aman(e.label)}</b>${e.detail ? `<p>${aman(teksIndikator(e.detail))}</p>` : ''}</li>`).join('')}</ol><footer>Ini ringkasan episode, bukan rekam medis lengkap. Pemeriksaan, resep, dan rincian yang tidak tersimpan tidak direkonstruksi dari kunci kasus.</footer>`
}

export function UnduhRingkasanEpisode({ episode }: { episode: CareEpisodeLite }) {
  const [status, setStatus] = useState('')
  const [sibuk, setSibuk] = useState(false)
  async function unduh() {
    setSibuk(true); setStatus('Menyiapkan…')
    try { setStatus(await unduhDokumen(htmlRingkasanEpisode(episode), `PRIMERA Ringkasan ${episode.subjectName}`)) }
    catch { setStatus('Gagal membuat dokumen. Coba lagi.') }
    finally { setSibuk(false) }
  }
  return <div className="baris"><button className="tombol tombol--senyap" disabled={sibuk} onClick={() => void unduh()}>Unduh ringkasan episode</button><span className="teks-xs" role="status">{status}</span></div>
}
