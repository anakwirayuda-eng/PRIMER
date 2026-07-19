import { useMemo, useState } from 'react'
import type {
  CareEpisodeLite,
  PemilikEpisode,
  StatusEpisode,
  SumberEpisode,
  TahapRujukan,
} from '@engine/state'
import { progresEpisode, ringkasanEpisode } from '@engine/bridge'
import { useFocusTrap } from '../useFocusTrap'

type FilterEpisode = 'aktif' | 'selesai' | 'semua'

const LABEL_STATUS: Record<StatusEpisode, string> = {
  terdeteksi: 'Terdeteksi',
  dinilai: 'Sudah dinilai',
  ditindaklanjuti: 'Ditindaklanjuti',
  menunggu: 'Menunggu',
  dirujuk: 'Di jejaring rujukan',
  kembali: 'Kembali ke FKTP',
  terverifikasi: 'Tindak lanjut tuntas',
  berakhir: 'Berakhir tanpa pemulihan',
}

const LABEL_OWNER: Record<PemilikEpisode, string> = {
  dokter: 'Dokter FKTP',
  perawat: 'Perawat',
  bidan: 'Bidan',
  kader: 'Kader',
  program: 'Tim program',
  rs: 'Rumah sakit',
  keluarga: 'Keluarga',
}

const LABEL_SOURCE: Record<SumberEpisode, string> = {
  keluarga: 'Kunjungan keluarga',
  posyandu: 'Posyandu',
  prolanis: 'Prolanis',
  surveilans: 'Surveilans',
  klinik: 'Poli FKTP',
  igd: 'IGD',
  rs: 'Jejaring RS',
}

const TAHAP_EPISODE = ['Deteksi', 'Nilai', 'Tindak lanjut', 'Kembali', 'Verifikasi'] as const
const TAHAP_RUJUKAN: TahapRujukan[] = ['sent', 'accepted', 'completed', 'feedback', 'acted']
const LABEL_RUJUKAN: Record<TahapRujukan, string> = {
  sent: 'Dikirim',
  accepted: 'Diterima',
  completed: 'Dilayani',
  feedback: 'Umpan balik',
  acted: 'Ditindaklanjuti',
}

function terminal(episode: CareEpisodeLite): boolean {
  return episode.status === 'terverifikasi' || episode.status === 'berakhir'
}

function urutEpisode(a: CareEpisodeLite, b: CareEpisodeLite, hari: number): number {
  const aLewat = !terminal(a) && a.dueDay !== undefined && a.dueDay < hari
  const bLewat = !terminal(b) && b.dueDay !== undefined && b.dueDay < hari
  if (aLewat !== bLewat) return aLewat ? -1 : 1
  if (terminal(a) !== terminal(b)) return terminal(a) ? 1 : -1
  const aJatuhTempo = a.dueDay ?? Number.MAX_SAFE_INTEGER
  const bJatuhTempo = b.dueDay ?? Number.MAX_SAFE_INTEGER
  if (aJatuhTempo !== bJatuhTempo) return aJatuhTempo - bJatuhTempo
  return b.updatedDay - a.updatedDay
}

interface JejakPerawatanProps {
  episodes: readonly CareEpisodeLite[]
  hari: number
  petaTerbuka: boolean
  onBukaKeluarga: (keluargaId: string) => void
}

export function JejakPerawatan({ episodes, hari, petaTerbuka, onBukaKeluarga }: JejakPerawatanProps) {
  const [buka, setBuka] = useState(false)
  const [filter, setFilter] = useState<FilterEpisode>('aktif')
  const ringkasan = useMemo(() => ringkasanEpisode(episodes, hari), [episodes, hari])
  const daftar = useMemo(
    () =>
      [...episodes]
        .filter((episode) => {
          if (filter === 'aktif') return !terminal(episode)
          if (filter === 'selesai') return terminal(episode)
          return true
        })
        .sort((a, b) => urutEpisode(a, b, hari)),
    [episodes, filter, hari],
  )
  const refModal = useFocusTrap<HTMLDivElement>(buka, () => setBuka(false))

  return (
    <>
      <button
        className="mk__jejak-ringkas"
        onClick={() => setBuka(true)}
        aria-haspopup="dialog"
        aria-label={`Buka Jejak Perawatan. ${ringkasan.active} episode aktif, ${ringkasan.overdue} lewat jatuh tempo.`}
      >
        <span className="mk__jejak-ringkas-judul">Jejak Perawatan</span>
        <span className="mk__jejak-ringkas-angka mono">
          <strong>{ringkasan.active}</strong> aktif
          {ringkasan.overdue > 0 && <strong className="mk__jejak-bahaya"> {ringkasan.overdue} lewat</strong>}
        </span>
        <span className="mk__jejak-ringkas-sub teks-xs">
          {ringkasan.verified} tertutup
          {ringkasan.adverse > 0 ? `, ${ringkasan.adverse} berakhir buruk` : ''}
        </span>
      </button>

      {buka && (
        <div className="overlay mk__jejak-overlay" onMouseDown={() => setBuka(false)}>
          <div
            ref={refModal}
            className="modal mk__jejak-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Jejak Perawatan lintas UKM dan UKP"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="mk__jejak-header">
              <div>
                <p className="mk__jejak-kicker mono">JEJAK KESINAMBUNGAN</p>
                <h2>Jejak Perawatan</h2>
                <p className="teks-kecil teks-lembut">
                  Dari sinyal komunitas sampai keputusan klinis, umpan balik, dan verifikasi hasil.
                </p>
              </div>
              <button className="tombol tombol--senyap mk__jejak-tutup" onClick={() => setBuka(false)} aria-label="Tutup Jejak Perawatan" title="Tutup">
                &times;
              </button>
            </header>

            <div className="mk__jejak-metrik" aria-label="Ringkasan episode perawatan">
              <div><strong>{ringkasan.active}</strong><span>Aktif</span></div>
              <div className={ringkasan.overdue > 0 ? 'mk__jejak-metrik--bahaya' : ''}><strong>{ringkasan.overdue}</strong><span>Lewat tempo</span></div>
              <div><strong>{ringkasan.verified}</strong><span>Tindak lanjut tuntas</span></div>
              <div className={ringkasan.adverse > 0 ? 'mk__jejak-metrik--bahaya' : ''}><strong>{ringkasan.adverse}</strong><span>Hasil buruk</span></div>
            </div>

            <div className="mk__jejak-tab" role="tablist" aria-label="Filter Jejak Perawatan">
              {(['aktif', 'selesai', 'semua'] as const).map((nilai) => (
                <button
                  key={nilai}
                  id={`jejak-tab-${nilai}`}
                  role="tab"
                  aria-selected={filter === nilai}
                  aria-controls="jejak-panel"
                  tabIndex={filter === nilai ? 0 : -1}
                  className={filter === nilai ? 'mk__jejak-tab--aktif' : ''}
                  onClick={() => setFilter(nilai)}
                  onKeyDown={(event) => {
                    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
                    if (!keys.includes(event.key)) return
                    event.preventDefault()
                    const values: FilterEpisode[] = ['aktif', 'selesai', 'semua']
                    const index = values.indexOf(nilai)
                    const nextIndex = event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? values.length - 1
                        : (index + (event.key === 'ArrowRight' ? 1 : -1) + values.length) % values.length
                    const next = values[nextIndex]!
                    setFilter(next)
                    document.getElementById(`jejak-tab-${next}`)?.focus()
                  }}
                >
                  {nilai === 'aktif' ? 'Aktif' : nilai === 'selesai' ? 'Selesai' : 'Semua'}
                </button>
              ))}
            </div>

            <div id="jejak-panel" className="mk__jejak-daftar" role="tabpanel" aria-labelledby={`jejak-tab-${filter}`}>
              {daftar.length === 0 ? (
                <div className="mk__jejak-kosong">
                  <strong>{episodes.length === 0 ? 'Belum ada episode lintas layanan.' : 'Tidak ada episode pada filter ini.'}</strong>
                  <p className="teks-kecil teks-lembut">
                    Episode muncul saat data keluarga, kegiatan UKM, poli, IGD, atau jejaring rujukan menghasilkan tindak lanjut nyata.
                  </p>
                </div>
              ) : daftar.map((episode) => {
                const progress = progresEpisode(episode.status)
                const lewat = !terminal(episode) && episode.dueDay !== undefined && episode.dueDay < hari
                const referralIndex = episode.referral ? TAHAP_RUJUKAN.indexOf(episode.referral.stage) : -1
                return (
                  <article key={episode.id} className={`mk__episode ${lewat ? 'mk__episode--lewat' : ''} ${episode.status === 'berakhir' ? 'mk__episode--buruk' : ''}`}>
                    <div className="mk__episode-atas">
                      <div>
                        <div className="baris mk__episode-meta">
                          <span className="chip">{LABEL_SOURCE[episode.source]}</span>
                          {episode.rw !== undefined && <span className="chip">RW {episode.rw}</span>}
                          <span className={`chip ${episode.status === 'berakhir' || lewat ? 'chip--merah' : episode.status === 'terverifikasi' ? 'chip--daun' : 'chip--kunyit'}`}>
                            {lewat ? 'Lewat jatuh tempo' : LABEL_STATUS[episode.status]}
                          </span>
                        </div>
                        <h3>{episode.subjectName}</h3>
                        <p className="mk__episode-masalah">{episode.problemLabel}</p>
                      </div>
                      <dl className="mk__episode-pemilik">
                        <dt>Pemilik aksi</dt>
                        <dd>{LABEL_OWNER[episode.owner]}</dd>
                        <dt>Diperbarui</dt>
                        <dd>Hari {episode.updatedDay}</dd>
                        {episode.dueDay !== undefined && <><dt>Jatuh tempo</dt><dd>Hari {episode.dueDay}</dd></>}
                      </dl>
                    </div>

                    <div
                      className="mk__episode-progres"
                      role="progressbar"
                      aria-label={`Kemajuan episode ${episode.subjectName}: tahap ${progress} dari 5, ${LABEL_STATUS[episode.status]}`}
                      aria-valuemin={1}
                      aria-valuemax={5}
                      aria-valuenow={progress}
                    >
                      {TAHAP_EPISODE.map((label, index) => (
                        <span key={label} className={index < progress ? 'mk__episode-progres--isi' : ''} title={label}>
                          <i aria-hidden="true" />
                          <small>{label}</small>
                        </span>
                      ))}
                    </div>

                    {episode.referral && (
                      <div className="mk__episode-rujukan" aria-label={`Alur rujukan ${episode.referral.hospitalName ?? ''}`}>
                        <div className="baris baris--antara">
                          <strong className="teks-kecil">Rujukan {episode.referral.hospitalName ?? 'jejaring'}</strong>
                          <span className="teks-xs teks-lembut">{LABEL_RUJUKAN[episode.referral.stage]}</span>
                        </div>
                        <ol>
                          {TAHAP_RUJUKAN.map((stage, index) => (
                            <li key={stage} className={index <= referralIndex ? 'mk__episode-rujukan--isi' : ''}>
                              <span aria-hidden="true" />{LABEL_RUJUKAN[stage]}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <dl className="mk__episode-receipt">
                      <div><dt>Sinyal</dt><dd>{episode.receipt.signal}</dd></div>
                      <div><dt>Keputusan</dt><dd>{episode.receipt.decision ?? 'Belum diputuskan'}</dd></div>
                      <div><dt>Umpan balik</dt><dd>{episode.receipt.feedback ?? 'Belum diterima'}</dd></div>
                      <div><dt>Berikutnya</dt><dd>{episode.receipt.next}</dd></div>
                    </dl>

                    <details className="mk__episode-riwayat">
                      <summary>Riwayat {episode.history.length} peristiwa</summary>
                      <ol>
                        {[...episode.history].reverse().map((event, index) => (
                          <li key={`${event.hari}-${event.label}-${index}`}>
                            <span className="mono">H{event.hari}</span>
                            <div><strong>{event.label}</strong><p>{event.detail}</p></div>
                          </li>
                        ))}
                      </ol>
                    </details>

                    {episode.familyId && (
                      <button
                        className="tombol mk__episode-keluarga"
                        disabled={!petaTerbuka}
                        title={petaTerbuka ? 'Buka keluarga terkait di Peta Desa' : 'Peta Desa belum terbuka'}
                        onClick={() => {
                          setBuka(false)
                          onBukaKeluarga(episode.familyId!)
                        }}
                      >
                        Buka keluarga terkait
                      </button>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
