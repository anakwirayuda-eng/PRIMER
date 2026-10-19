import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { CareEpisodeLite } from '@engine/state'
import { kasusEfektif } from '@engine/clinic'
import { PACK } from '@content/index'
import { unduhDokumen } from '../../utils/unduhDokumen'
import type { EncounterSelesai } from '../../utils/rekonstruksiJejak'
import { CATATAN_REKAM_MEDIS, IsiRekamMedis } from './CetakRekamMedis'

/**
 * Rekam medis lengkap semua konsultasi poli dalam satu episode, disusun ulang
 * dari jejak (utils/rekonstruksiJejak). Isi dokumen baru dirender saat tombol
 * diklik: satu stase bisa memuat ratusan konsultasi.
 */
export function UnduhRekamMedisEpisode({ episode, konsultasi, dokter }: {
  episode: CareEpisodeLite
  konsultasi: readonly EncounterSelesai[]
  dokter: string
}) {
  const isi = useRef<HTMLDivElement>(null)
  const [sibuk, setSibuk] = useState(false)
  const [status, setStatus] = useState('')
  async function unduh() {
    if (sibuk) return
    flushSync(() => { setSibuk(true); setStatus('Menyiapkan dokumen…') })
    try { setStatus(await unduhDokumen(isi.current?.innerHTML ?? '', `PRIMERA Rekam Medis ${episode.subjectName}`)) }
    catch { setStatus('Dokumen gagal dibuat. Coba unduh lagi.') }
    finally { setSibuk(false) }
  }
  return <div className="baris">
    <button className="tombol tombol--senyap" disabled={sibuk} onClick={() => void unduh()}>
      Unduh rekam medis poli ({konsultasi.length} konsultasi)
    </button>
    <span className="teks-xs" role="status">{status}</span>
    {sibuk && <div ref={isi} hidden aria-hidden="true">
      <header><h1>Puskesmas Sukamaju</h1><p>Rekam medis simulasi PRIMERA · {episode.subjectName} · dr. {dokter}</p></header>
      {konsultasi.map(({ hari, enc }, index) => {
        const dasar = PACK.kasus[enc.pasien.kasusId]
        return dasar && <section key={index}>
          <h2>Konsultasi hari {hari}</h2>
          <IsiRekamMedis enc={enc} kasus={kasusEfektif(dasar, enc.pasien.varianId)} />
        </section>
      })}
      <footer>{CATATAN_REKAM_MEDIS}</footer>
    </div>}
  </div>
}
