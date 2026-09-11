import type { GameState } from '@engine/state'
import { jadwalProlanis } from './rencanaUkm'
import './Lab2.css'

export function JadwalProlanis({ state }: { state: GameState }) {
  const jadwal = jadwalProlanis(state)
  return <aside className={`ukm-jadwal ${jadwal.totalMungkin < 3 || jadwal.rugiJikaTunda ? 'ukm-jadwal--waspada' : ''}`} aria-label="Rencana jadwal Prolanis">
    <strong>Prolanis · rencana sesi ke-{jadwal.berikutNomor}</strong>
    <p>{jadwal.hari.length ? `Hari yang masih mungkin: ${jadwal.hari.join(' → ')}. Jarak antarsesi ${jadwal.periode} hari; stase berakhir hari ${jadwal.batas}.` : `Tidak ada lagi jadwal sesi dalam stase ini (sampai hari ${jadwal.batas}).`}</p>
    {jadwal.rugiJikaTunda && <p><b>Menunda sampai besok mengurangi satu kesempatan sesi sebelum stase berakhir.</b></p>}
    {jadwal.totalMungkin < 3 && <p>Dengan jadwal sekarang, total {jadwal.totalMungkin} sesi masih mungkin dicapai selama stase.</p>}
    <small>Perkiraan mengikuti hari sesi sebenarnya. Tetap perlu slot siang, stamina, dan peserta ber-JKN aktif.</small>
  </aside>
}
