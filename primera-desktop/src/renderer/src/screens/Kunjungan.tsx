/**
 * KUNJUNGAN RUMAH — match engine 4 babak dalam SATU layar penuh:
 * Salam & Observasi → Wawancara (MI/OARS) → Diagnosis Perilaku → Resep Sosial.
 *
 * Aturan emas gerbang kejujuran: respons warga yang BOHONG dirender persis sama
 * dengan respons jujur — tanpa penanda, warna, atau jeda berbeda. Pemain harus
 * menyadarinya sendiri dari kontradiksi dengan temuan hotspot babak 1.
 * Semua logika (trust, diusir, gerbang) milik engine; layar ini hanya panggung.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../store'
import type { BabakKunjunganFase } from '@engine/state'
import type { Hambatan, PilihanDialog } from '@content/types'
import { PACK } from '@content/index'
import { hashSeed, Rng } from '@engine/core/rng'
import { RumahIlustrasi } from './kunjungan/RumahIlustrasi'
import './Kunjungan.css'

/* ---------------------------------------------------------------------------
 * Kosakata tampilan
 * ------------------------------------------------------------------------- */

const BABAK: { fase: BabakKunjunganFase; label: string }[] = [
  { fase: 'observasi', label: 'Salam & Observasi' },
  { fase: 'wawancara', label: 'Wawancara' },
  { fase: 'diagnosis_perilaku', label: 'Diagnosis Perilaku' },
  { fase: 'resep_sosial', label: 'Resep Sosial' },
]

const GAYA_INFO: Record<PilihanDialog['gaya'], { label: string; simbol: string }> = {
  empati: { label: 'Empati', simbol: '♡' },
  refleksi: { label: 'Refleksi', simbol: '↺' },
  edukasi: { label: 'Edukasi', simbol: '✎' },
  konfrontasi: { label: 'Konfrontasi', simbol: '!' },
}

const KARTU_HAMBATAN: { id: Hambatan; judul: string; sub: string; deskripsi: string }[] = [
  {
    id: 'kapabilitas',
    judul: 'Kapabilitas',
    sub: 'Tidak tahu, atau tidak mampu',
    deskripsi:
      'Pengetahuan, keterampilan, daya ingat, atau kondisi tubuh menghalangi mereka melakukannya — meski sebenarnya mau.',
  },
  {
    id: 'kesempatan',
    judul: 'Kesempatan',
    sub: 'Lingkungan tidak memungkinkan',
    deskripsi: 'Biaya, jarak, sarana, waktu, atau tekanan sosial di sekitar menutup jalannya — meski tahu dan mau.',
  },
  {
    id: 'motivasi',
    judul: 'Motivasi',
    sub: 'Belum merasa perlu, atau takut',
    deskripsi: 'Keyakinan, prioritas, pengalaman buruk, atau rasa malu membuat mereka belum siap berubah.',
  },
]

interface Ucapan {
  peran: 'dokter' | 'warga'
  teks: string
}

function Potret({ nama }: { nama: string }) {
  return (
    <span className="kunjungan-potret" aria-hidden>
      {nama.charAt(0).toUpperCase()}
    </span>
  )
}

/* ---------------------------------------------------------------------------
 * Layar
 * ------------------------------------------------------------------------- */

export function Kunjungan() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const lastEvents = useGame((s) => s.lastEvents)
  const eventTick = useGame((s) => s.eventTick)

  const kj = state.kunjungan
  const kelContent = kj ? PACK.keluarga[kj.keluargaId] : undefined
  const skenario = kj && kelContent ? kelContent.arc.kunjungan.find((sk) => sk.id === kj.skenarioId) : undefined

  /** Catatan percakapan lokal (untuk rekap babak 3) + respons yang sedang tampil. */
  const [riwayat, setRiwayat] = useState<Ucapan[]>([])
  const [responsAktif, setResponsAktif] = useState<string | null>(null)
  const [dokterTerakhir, setDokterTerakhir] = useState<string | null>(null)
  const [intervensiPilihan, setIntervensiPilihan] = useState<string | null>(null)
  const tickTerproses = useRef(-1)

  // Tangkap ucapan warga dari event engine. Respons bohong TIDAK dibedakan —
  // sengaja: field `bohong` tidak pernah dibaca di layar ini.
  useEffect(() => {
    if (tickTerproses.current === eventTick) return
    tickTerproses.current = eventTick
    for (const e of lastEvents) {
      if (e.type === 'WARGA_BICARA') {
        setRiwayat((r) => [...r, { peran: 'warga', teks: e.teks }])
        setResponsAktif(e.teks)
      }
    }
  }, [eventTick, lastEvents])

  // Anti-bocor jawaban: konten menaruh intervensi yang cocok di posisi pertama —
  // acak urutan render sekali, deterministik per skenario (replay/testing aman).
  const intervensiAcak = useMemo(() => {
    if (!skenario) return []
    return new Rng(hashSeed('intervensi', skenario.id)).shuffle(skenario.intervensi)
  }, [skenario])

  // CODEX ronde-13: `kj.hotspotDitemukan` korup (bukan array) crash `.includes`
  // di bawah bila lolos guard tanpa cek ini.
  if (!kj || !kelContent || !skenario || !Array.isArray(kj.hotspotDitemukan)) {
    return (
      <div className="kunjungan-root kunjungan-root--kosong tengah">
        <div className="kartu kolom" style={{ alignItems: 'center' }}>
          <p className="teks-lembut">Tidak ada kunjungan rumah yang sedang berjalan.</p>
          <button className="tombol" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' })}>
            Kembali ke Peta Desa
          </button>
        </div>
      </div>
    )
  }

  const kepala = kelContent.anggota.find((a) => a.peran === 'kepala') ?? kelContent.anggota[0]
  const namaWarga = kepala ? kepala.nama : `Keluarga ${kelContent.namaKeluarga}`
  const nodeAktif = skenario.dialog[kj.dialogIndex]
  const wawancaraTuntas = kj.dialogIndex >= skenario.dialog.length
  const temuan = skenario.hotspot.filter((h) => kj.hotspotDitemukan.includes(h.id))
  const babakIndex = BABAK.findIndex((b) => b.fase === kj.fase)
  const ucapanWarga = riwayat.filter((u) => u.peran === 'warga')

  function pilihDialog(p: PilihanDialog) {
    setDokterTerakhir(p.teks)
    setRiwayat((r) => [...r, { peran: 'dokter', teks: p.teks }])
    dispatch({ type: 'PILIH_DIALOG', pilihanId: p.id })
  }

  function tulisResep() {
    if (!intervensiPilihan) return
    dispatch({ type: 'PILIH_INTERVENSI', intervensiId: intervensiPilihan })
  }

  /* -- Kunci panel bawah per babak (remount → transisi halus) ---------------- */
  const kunciPanel =
    kj.fase === 'wawancara'
      ? responsAktif
        ? `respons-${riwayat.length}`
        : `node-${kj.dialogIndex}`
      : kj.fase

  return (
    <div className="kunjungan-root">
      {/* ---------------- Header: keluarga + stepper babak ---------------- */}
      <header className="kunjungan-header kertas">
        <div className="kunjungan-header__info">
          <div className="kunjungan-header__judul">{skenario.judul}</div>
          <div className="baris teks-xs teks-lembut">
            <span>Keluarga {kelContent.namaKeluarga}</span>
            <span className="chip">RW {kelContent.rw}</span>
            <span className="chip">Kunjungan ke-{nomorKunjunganArc(kj.skenarioId, kelContent.arc.kunjungan)}</span>
          </div>
        </div>
        <ol className="kunjungan-stepper">
          {BABAK.map((b, i) => (
            <li
              key={b.fase}
              className={`kunjungan-stepper__langkah ${
                i === babakIndex ? 'kunjungan-stepper__langkah--aktif' : ''
              } ${i < babakIndex || kj.fase === 'selesai' ? 'kunjungan-stepper__langkah--lewat' : ''}`}
            >
              <span className="kunjungan-stepper__angka mono">{i + 1}</span>
              <span className="kunjungan-stepper__label">{b.label}</span>
            </li>
          ))}
        </ol>
      </header>

      {/* ---------------- Panggung: interior rumah + hotspot ---------------- */}
      <div className={`kunjungan-scene ${kj.fase !== 'observasi' ? 'kunjungan-scene--redup' : ''}`}>
        <RumahIlustrasi />

        <div className="kunjungan-hotspot-lapis">
          {skenario.hotspot.map((h) => {
            const ketemu = kj.hotspotDitemukan.includes(h.id)
            if (!ketemu && kj.fase !== 'observasi') return null
            return (
              <button
                key={h.id}
                className={`kunjungan-hotspot ${ketemu ? 'kunjungan-hotspot--ketemu' : ''}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onClick={() => dispatch({ type: 'KLIK_HOTSPOT', hotspotId: h.id })}
                disabled={ketemu || kj.fase !== 'observasi'}
                title={ketemu ? h.label : 'Ada yang menarik perhatianmu di sini'}
                aria-label={ketemu ? h.label : 'Amati lebih dekat'}
              >
                {ketemu ? '✓' : ''}
              </button>
            )
          })}
        </div>

        {/* Catatan temuan observasi — tetap terlihat sampai wawancara usai */}
        {temuan.length > 0 && kj.fase !== 'resep_sosial' && (
          <aside className="kunjungan-temuan">
            <div className="kunjungan-temuan__judul mono">CATATAN OBSERVASI</div>
            {temuan.map((h) => (
              <div key={h.id} className="kunjungan-temuan__kartu kertas">
                <b>{h.label}</b>
                <p>{h.narasi}</p>
              </div>
            ))}
          </aside>
        )}
      </div>

      {/* ---------------- Panel bawah per babak ---------------- */}
      <div className="kunjungan-panel" key={kunciPanel}>
        {kj.fase === 'observasi' && (
          <div className="kunjungan-pembuka kertas">
            <p className="kunjungan-pembuka__teks">{skenario.pembuka}</p>
            <div className="baris baris--antara">
              <span className="teks-kecil teks-lembut">
                {temuan.length === 0
                  ? 'Amati ruangan pelan-pelan — rumah sering bercerita lebih jujur daripada tuan rumahnya.'
                  : `${temuan.length} temuan tercatat di buku sakumu.`}
              </span>
              <button className="tombol tombol--utama" onClick={() => dispatch({ type: 'LANJUT_BABAK' })}>
                Mulai Berbincang →
              </button>
            </div>
          </div>
        )}

        {kj.fase === 'wawancara' && responsAktif && (
          <div className="kunjungan-wawancara">
            <div className="kunjungan-dialog kertas">
              <Potret nama={namaWarga} />
              <div className="kunjungan-dialog__isi">
                {dokterTerakhir && (
                  <p className="kunjungan-dialog__gema teks-xs teks-lembut">Kamu: “{dokterTerakhir}”</p>
                )}
                <div className="kunjungan-dialog__nama mono">{namaWarga}</div>
                <p className="kunjungan-dialog__teks">“{responsAktif}”</p>
              </div>
              <button className="tombol tombol--utama" onClick={() => setResponsAktif(null)}>
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {kj.fase === 'wawancara' && !responsAktif && nodeAktif && (
          <div className="kunjungan-wawancara">
            <div className="kunjungan-dialog kertas">
              <Potret nama={namaWarga} />
              <div className="kunjungan-dialog__isi">
                <p className="kunjungan-dialog__narasi">{nodeAktif.narasi}</p>
              </div>
            </div>
            <div className="kunjungan-pilihan-baris">
              {nodeAktif.pilihan.map((p) => (
                <button
                  key={p.id}
                  className={`kunjungan-pilihan kartu kartu--klik kunjungan-pilihan--${p.gaya}`}
                  onClick={() => pilihDialog(p)}
                >
                  <span className="chip kunjungan-pilihan__gaya">
                    {GAYA_INFO[p.gaya].simbol} {GAYA_INFO[p.gaya].label}
                  </span>
                  <span className="kunjungan-pilihan__teks">“{p.teks}”</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {kj.fase === 'wawancara' && !responsAktif && !nodeAktif && wawancaraTuntas && (
          <div className="kunjungan-pembuka kertas">
            <p className="kunjungan-pembuka__teks">
              Perbincangan mereda. Gelas teh sudah setengah kosong — saatnya menimbang apa yang sebenarnya menahan
              keluarga ini.
            </p>
            <div className="baris" style={{ justifyContent: 'flex-end' }}>
              <button className="tombol tombol--utama" onClick={() => dispatch({ type: 'LANJUT_BABAK' })}>
                Ambil Kesimpulan →
              </button>
            </div>
          </div>
        )}

        {kj.fase === 'diagnosis_perilaku' && (
          <div className="kunjungan-diagnosis">
            <div className="kunjungan-rekap kertas">
              <div className="judul-seksi">Apa yang kamu lihat &amp; dengar</div>
              <div className="kunjungan-rekap__kolom">
                <div>
                  <b className="teks-xs mono">TERLIHAT</b>
                  {temuan.length === 0 ? (
                    <p className="teks-xs teks-lembut">Kamu tidak sempat mengamati rumah mereka.</p>
                  ) : (
                    <ul>
                      {temuan.map((h) => (
                        <li key={h.id} className="teks-kecil">
                          {h.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <b className="teks-xs mono">TERDENGAR</b>
                  {ucapanWarga.length === 0 ? (
                    <p className="teks-xs teks-lembut">Tidak ada ucapan yang tercatat.</p>
                  ) : (
                    <ul>
                      {ucapanWarga.map((u, i) => (
                        <li key={i} className="teks-kecil">
                          “{u.teks}”
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="kunjungan-hambatan-baris">
              {KARTU_HAMBATAN.map((k) => (
                <button
                  key={k.id}
                  className="kunjungan-hambatan kartu kartu--klik"
                  onClick={() => dispatch({ type: 'KOMIT_HAMBATAN', hipotesis: k.id })}
                >
                  <span className="kunjungan-hambatan__judul">{k.judul}</span>
                  <span className="kunjungan-hambatan__sub">{k.sub}</span>
                  <p className="kunjungan-hambatan__deskripsi teks-xs teks-lembut">{k.deskripsi}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {kj.fase === 'resep_sosial' && (
          <div className="kunjungan-resep">
            <div className="kunjungan-resep__baris">
              {intervensiAcak.map((k) => (
                <button
                  key={k.id}
                  className={`kunjungan-intervensi kartu kartu--klik ${
                    intervensiPilihan === k.id ? 'kunjungan-intervensi--terpilih' : ''
                  }`}
                  onClick={() => setIntervensiPilihan(k.id)}
                >
                  <b>{k.nama}</b>
                  <p className="teks-kecil teks-lembut">{k.deskripsi}</p>
                </button>
              ))}
            </div>
            <div className="baris baris--antara">
              <span className="teks-kecil teks-lembut">
                Pilih SATU resep sosial yang menjawab hambatan sebenarnya — bukan yang paling terdengar medis.
              </span>
              <button
                className="tombol tombol--utama tombol--besar"
                disabled={!intervensiPilihan}
                title={intervensiPilihan ? 'Tutup kunjungan dengan resep sosial ini.' : 'Pilih satu kartu intervensi dulu.'}
                onClick={tulisResep}
              >
                Tulis Resep Sosial ✎
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Nomor urut skenario dalam arc (untuk chip "Kunjungan ke-n"). */
function nomorKunjunganArc(skenarioId: string, kunjungan: { id: string }[]): number {
  const i = kunjungan.findIndex((k) => k.id === skenarioId)
  return i < 0 ? 1 : i + 1
}
