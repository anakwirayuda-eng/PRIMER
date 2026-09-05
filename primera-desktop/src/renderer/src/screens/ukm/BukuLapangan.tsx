import { useState } from 'react'
import './Lab2.css'

interface Bukti { id: string; judul: string; teks: string; jenis: 'terlihat' | 'terdengar' }
interface Props { temuan: { id: string; label: string; narasi: string }[]; ucapan: { teks: string }[] }

/** Hanya menerima temuan yang telah dibuka dan ucapan yang telah didengar. */
export function BukuLapangan({ temuan, ucapan }: Props) {
  const [filter, setFilter] = useState<'semua' | Bukti['jenis']>('semua')
  const [pilihan, setPilihan] = useState<string[]>([])
  const bukti: Bukti[] = [
    ...temuan.map((t) => ({ id: `lihat:${t.id}`, judul: t.label, teks: t.narasi, jenis: 'terlihat' as const })),
    ...ucapan.map((u, i) => ({ id: `dengar:${i}`, judul: `Ucapan warga ${i + 1}`, teks: u.teks, jenis: 'terdengar' as const })),
  ]
  const bandingkan = bukti.filter((b) => pilihan.includes(b.id))
  return <details className="lab-notebook kertas">
    <summary><span><span className="lab-kicker mono">BUKU LAPANGAN</span><strong>Rangkai bukti sebelum memutuskan</strong></span><span className="chip">{bukti.length} catatan</span></summary>
    <div className="lab-notebook__isi">
      <p className="lab-sub">Pilih hingga dua catatan untuk dibaca berdampingan. Apa yang selaras, dan apa yang masih perlu kamu pahami?</p>
      <div className="lab-filters" role="group" aria-label="Sumber catatan">
        {(['semua', 'terlihat', 'terdengar'] as const).map((f) => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'semua' ? 'Semua' : f === 'terlihat' ? 'Terlihat' : 'Terdengar'}</button>)}
      </div>
      {bandingkan.length > 0 && <section className="lab-compare" aria-label="Bukti untuk dibandingkan">
        {bandingkan.map((b) => <article key={b.id}><span className="lab-kicker mono">{b.jenis}</span><h3>{b.judul}</h3><p>{b.teks}</p><button className="tombol tombol--senyap" onClick={() => setPilihan(pilihan.filter((id) => id !== b.id))}>Lepas catatan {b.judul}</button></article>)}
      </section>}
      <div className="lab-evidence-list">
        {bukti.filter((b) => filter === 'semua' || b.jenis === filter).map((b) => <label key={b.id} className="lab-evidence">
          <input type="checkbox" checked={pilihan.includes(b.id)} disabled={pilihan.length >= 2 && !pilihan.includes(b.id)} onChange={(e) => setPilihan(e.target.checked ? [...pilihan, b.id] : pilihan.filter((id) => id !== b.id))} />
          <span><b>{b.judul}</b><span className="lab-kicker mono">{b.jenis}</span><span>{b.teks}</span></span>
        </label>)}
      </div>
      {bukti.length === 0 && <p className="lab-sub">Catatan terisi saat kamu mengamati rumah dan berbicara dengan keluarga.</p>}
    </div>
  </details>
}
